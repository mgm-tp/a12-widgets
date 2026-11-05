/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

/**
 * When an edit rewrites the markdown, and when it leaves it alone.
 *
 * `mode-switch-without-edit.test.tsx` covers the case where nobody types.
 * Switching only picks which surface is on screen, so the value cannot change.
 * This file is the other half, where someone does type. The two surfaces behave differently:
 *
 * - **Source mode** edits the markdown as text. The typed character is the only thing that changes,
 *   and switching modes after that still changes nothing.
 * - **Edit mode** edits a tree of nodes. To report it, the editor runs
 *   `$convertToMarkdownString` and writes the whole document again.
 *   So the rewrite also touches lines the user never went near.
 *
 * Clicking a surface puts the caret wherever the click lands, which the test cannot predict.
 * So instead of checking for the typed character in a known spot, each test types one `Z`,
 * deletes the `Z` from the string again, and compares what is left with the document it
 * started from:
 *
 *     started with            "# Title\n\nBody here.\n"
 *     typed a Z somewhere     "# Title\n\nBodyZ here.\n"
 *     took the Z back out     "# Title\n\nBody here.\n"   same, so nothing else moved
 *
 * If the editor had also dropped the newline at the end, the last line would come back as
 * `"# Title\n\nBody here."` and the test would fail. The `Z` cancels itself out,
 * so whatever is left over is the editor's own doing — which is the only thing these tests ask about.
 */

import type { FC } from "react";
import { useState } from "react";
import { getByDataRole, render } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import type { MarkdownEditorEmitMode, MarkdownEditorMode } from "../../main/markdown-editor.api.js";
import { ControlledEditor, getSurfaceByMode, wait, switchMode, waitForSurfaceReady } from "../utils/index.js";

/**
 * A short debounce, so waiting past it does not cost real seconds per switch. Only
 * the timer length changes; `debounced` still takes the same path.
 */
const DEBOUNCE_MS = 20;

/** Long enough for a {@link DEBOUNCE_MS} timer started before it to have fired. */
const PAST_DEBOUNCE_MS = 2 * DEBOUNCE_MS;

/**
 * Waits for the surface of `mode` to mount, then past the debounce, so anything the
 * mount or the switch scheduled has had its chance to report.
 */
async function settle(container: HTMLElement, mode: MarkdownEditorMode): Promise<void> {
	await waitForSurfaceReady(container, mode);
	await wait(PAST_DEBOUNCE_MS);
}

const EMIT_MODES: MarkdownEditorEmitMode[] = ["change", "debounced", "blur"];

/**
 * The one character every test types.
 *
 * A `Z` because no markdown syntax uses it and the document below has none,
 * so taking it back out with `replace` cannot remove the wrong character.
 */
const TYPED_CHARACTER = "Z";

/**
 * The markdown as a person wrote it, not as the editor would write it back.
 *
 * Two kinds of thing are in here, and edit mode changes both:
 *
 * - **Spacing** — a heading with no blank line under it, a run of blank lines, a child list
 *   item indented with a tab, spaces at the end of a line, a newline at the end of the file.
 * - **Characters the serializer has an opinion about** — `_` inside a word, HTML entities,
 *   `[`, a backtick, `<`, and a single `~` pair.
 *
 * Source mode has to keep every one of them exactly as typed.
 */
const HAND_WRITTEN = [
	"# Heading with no blank line under it",
	"Body straight after.",
	"",
	"",
	"",
	"Three blank lines above.",
	"",
	"- parent",
	"\t- tab-indented child",
	"",
	"snake_case_name, an entity &amp; and a numeric one &#42;.",
	"",
	"Square [brackets], a backtick `, an angle bracket < and a tilde ~here~.",
	"",
	"Trailing spaces here.   ",
	""
].join("\n");

/**
 * The same document after edit mode has written it out again.
 *
 * The user typed one character; everything below moved on its own.
 *
 * Spacing: a blank line was added under the heading, the run of blank lines became one, the
 * tab became two spaces, the spaces at the end of a line are gone, and so is the newline at
 * the end of the file.
 *
 * Characters: `_` inside a word gained a backslash, the two entities were decoded (`&amp;`
 * became a plain `&`, and `&#42;` became a `*` that then needed escaping), `[` and the
 * backtick gained backslashes, and the single `~here~` came back as `~~here~~`. Only `<` was
 * left alone.
 */
const EDITOR_WRITTEN = [
	"# Heading with no blank line under it",
	"",
	"Body straight after.",
	"",
	"Three blank lines above.",
	"",
	"- parent",
	"  - tab-indented child",
	"",
	"snake\\_case\\_name, an entity & and a numeric one \\*.",
	"",
	"Square \\[brackets], a backtick \\`, an angle bracket < and a tilde ~~here~~.",
	"",
	"Trailing spaces here."
].join("\n");

interface HostProps {
	startMode: MarkdownEditorMode;
	emitMode: MarkdownEditorEmitMode;
	onChange?: (markdown: string) => void;
}

/** Keeps the markdown the way a form does and prints it, so a test can read what the host has. */
const Host: FC<HostProps> = ({ startMode, emitMode, onChange }) => {
	const [value, setValue] = useState(HAND_WRITTEN);

	return (
		<>
			<ControlledEditor
				label="Notes"
				initialMode={startMode}
				initialValue={HAND_WRITTEN}
				emitMode={emitMode}
				emitDebounceMs={DEBOUNCE_MS}
				onChange={(next) => {
					setValue(next);
					onChange?.(next);
				}}
			/>
			<pre data-role="form-value">{value}</pre>
		</>
	);
};

Host.displayName = "EditThenSwitchHost";

function formValue(container: HTMLElement): string {
	return getByDataRole(container, "form-value").textContent ?? "";
}

/** The value with the typed `Z` removed again, so only what the user did not type is left. */
function withoutTheTypedCharacter(container: HTMLElement): string {
	return formValue(container).replace(TYPED_CHARACTER, "");
}

async function switchTo(container: HTMLElement, mode: MarkdownEditorMode): Promise<void> {
	await switchMode(container, mode);
	await settle(container, mode);
}

/** Puts the caret in the surface for `mode` and types one character. */
async function typeInto(container: HTMLElement, mode: MarkdownEditorMode): Promise<void> {
	await userEvent.click(getSurfaceByMode(container, mode));
	await userEvent.keyboard(TYPED_CHARACTER);
	await wait(PAST_DEBOUNCE_MS);
}

/**
 * Moves focus off the surface and waits for the editor to report.
 *
 * `emitMode: "blur"` keeps the edit until focus leaves. Without this step the host still has
 * the document it started with, so the test would read the wrong text. The other two modes
 * have already reported by now, so this does them no harm.
 */
async function settleTheReport(): Promise<void> {
	await userEvent.tab();
	await wait(PAST_DEBOUNCE_MS);
}

describe("typing in source mode", () => {
	for (const emitMode of EMIT_MODES) {
		test(`emitMode="${emitMode}": the typed character is the only change`, async () => {
			const { container } = render(<Host startMode="source" emitMode={emitMode} />);

			await settle(container, "source");
			await typeInto(container, "source");
			await settleTheReport();

			expect(formValue(container)).toContain(TYPED_CHARACTER);
			expect(withoutTheTypedCharacter(container)).toBe(HAND_WRITTEN);
		});
	}

	for (const emitMode of EMIT_MODES) {
		test(`emitMode="${emitMode}": switching after the edit still changes nothing`, async () => {
			const onChange = vi.fn();
			const { container } = render(<Host startMode="source" emitMode={emitMode} onChange={onChange} />);

			await settle(container, "source");
			await typeInto(container, "source");
			await settleTheReport();

			const afterTheEdit = formValue(container);
			const reportsForTheEdit = onChange.mock.calls.length;

			// Over to the rich surface, then the read-only one, then back.
			// If anything on the switch path wrote the document out again, this walk would show it.
			await switchTo(container, "edit");
			expect(formValue(container)).toBe(afterTheEdit);

			await switchTo(container, "view");
			expect(formValue(container)).toBe(afterTheEdit);

			await switchTo(container, "source");
			expect(formValue(container)).toBe(afterTheEdit);

			// None of the three switches told the host anything.
			expect(onChange).toHaveBeenCalledTimes(reportsForTheEdit);
			expect(withoutTheTypedCharacter(container)).toBe(HAND_WRITTEN);
		});
	}

	test("a second edit in source mode still rewrites nothing", async () => {
		const { container } = render(<Host startMode="source" emitMode="change" />);

		await settle(container, "source");
		await typeInto(container, "source");
		await switchTo(container, "edit");
		await switchTo(container, "source");
		await userEvent.click(getSurfaceByMode(container, "source"));
		await userEvent.keyboard("{Backspace}");
		await wait(PAST_DEBOUNCE_MS);

		// Typed one character, switched modes twice, then deleted it again.
		// The document the user wrote is still there in full.
		expect(formValue(container)).toBe(HAND_WRITTEN);
	});
});

describe("typing in edit mode", () => {
	for (const emitMode of EMIT_MODES) {
		test(`emitMode="${emitMode}": the whole document is written again`, async () => {
			const { container } = render(<Host startMode="edit" emitMode={emitMode} />);

			await settle(container, "edit");
			await typeInto(container, "edit");
			await settleTheReport();

			// Lines the user never touched moved as well. That is `$convertToMarkdownString`
			// writing the whole document again instead of patching in the one edit.
			expect(withoutTheTypedCharacter(container)).not.toBe(HAND_WRITTEN);
			expect(withoutTheTypedCharacter(container)).toBe(EDITOR_WRITTEN);
		});
	}

	test("switching after the edit changes nothing further", async () => {
		const onChange = vi.fn();
		const { container } = render(<Host startMode="edit" emitMode="change" onChange={onChange} />);

		await settle(container, "edit");
		await typeInto(container, "edit");

		const afterTheEdit = formValue(container);
		const reportsForTheEdit = onChange.mock.calls.length;

		await switchTo(container, "source");
		expect(formValue(container)).toBe(afterTheEdit);

		await switchTo(container, "view");
		expect(formValue(container)).toBe(afterTheEdit);

		await switchTo(container, "edit");
		expect(formValue(container)).toBe(afterTheEdit);

		expect(onChange).toHaveBeenCalledTimes(reportsForTheEdit);
	});

	test("a second edit only changes itself, because the first one already tidied up", async () => {
		const { container } = render(<Host startMode="edit" emitMode="change" />);

		await settle(container, "edit");
		await typeInto(container, "edit");

		const afterTheFirstEdit = formValue(container);

		await userEvent.keyboard(TYPED_CHARACTER);
		await wait(PAST_DEBOUNCE_MS);

		// The first edit already tidied the document, so writing it out again changes nothing.
		// Only the new character is different.
		expect(formValue(container).replace(TYPED_CHARACTER, "")).toBe(afterTheFirstEdit);
	});
});

/*
 * Both halves in one go, in the order a user really does them: write markdown in source mode,
 * look at it in edit mode, then change something there.
 */
describe("source first, then edit", () => {
	test("the authored markdown survives until the edit-mode keystroke", async () => {
		const { container } = render(<Host startMode="source" emitMode="change" />);

		await settle(container, "source");
		await typeInto(container, "source");
		await switchTo(container, "edit");

		// Still exactly what was typed in source mode, even though the rich surface is showing.
		expect(withoutTheTypedCharacter(container)).toBe(HAND_WRITTEN);

		await userEvent.click(getSurfaceByMode(container, "edit"));
		await userEvent.keyboard("{Backspace}");
		await wait(PAST_DEBOUNCE_MS);

		// One keystroke in edit mode, and the whole document has been written again.
		expect(formValue(container)).toBe(EDITOR_WRITTEN);
	});
});
