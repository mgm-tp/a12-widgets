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

/*
 * Switching mode without editing keeps the markdown exactly the same - byte for byte.
 * A switch only picks which surface is on screen: the rich editor keeps the document it
 * already has, and the source editor is filled from the host's value. So a user can hop
 * between Edit, Source and View as often as they like.
 *
 * The value is only standardized on a real edit in Edit mode. That is when
 * `$convertToMarkdownString` runs and writes the whole document again, so the
 * standardization also reaches lines nobody touched. Nothing here makes a real edit in
 * Edit mode, which is why every case expects the value to come back untouched.
 */

import type { FC, RefObject } from "react";
import { useState } from "react";
import { getByDataRole, render } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import type {
	MarkdownEditorEmitMode,
	MarkdownEditorHandle,
	MarkdownEditorMode
} from "../../main/markdown-editor.api.js";
import { MarkdownEditor } from "../../main/markdown-editor.view.js";
import { $getSourceDocumentText } from "../../main/source-highlighting/source-document.js";
import { ALL_MODES, getSurfaceByMode, switchMode, wait, waitForSurfaceReady } from "../utils/index.js";

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
const MODES: MarkdownEditorMode[] = ["edit", "source", "view"];

/**
 * Documents chosen for what they would lose if anything on the switch path
 * serialized them: syntax the editor has no node for, syntax it re-spells, and
 * text the browser likes to normalize.
 */
const DOCS: Record<string, string> = {
	awkward: [
		"---",
		"title: Release notes",
		"---",
		"# Heading with no blank line under it",
		"Body straight after.",
		"",
		"",
		"",
		"Three blank lines above.",
		"",
		"Setext",
		"======",
		"",
		"+ plus bullet",
		"* asterisk bullet",
		"\t- tab-indented child",
		"",
		"1) paren ordinal",
		"",
		"snake_case_name, an entity &amp;, a numeric one &#42;, a backslash \\n.",
		"",
		"A hard break at the end of this line.  ",
		"Same paragraph.",
		"",
		'<div class="raw"><span>raw html</span></div>',
		"",
		"See [the reference][ref] and a footnote[^n].",
		"",
		'[ref]: https://example.com "With a title"',
		"[^n]: The body.",
		"",
		"***",
		""
	].join("\n"),
	crlf: "a\r\n\r\nb\r\nc",
	empty: "",
	whitespace: "   \n\n\t\n",
	unicode: "emoji 👩🏽‍🚒, combining é, zero width a​b, rtl אבג, nbsp here\n",
	long: Array.from({ length: 120 }, (_, index) => `Paragraph ${index} with snake_case_${index} and &amp;.`).join("\n\n")
};

interface HostProps {
	initial: string;
	startMode: MarkdownEditorMode;
	emitMode: MarkdownEditorEmitMode;
	controlled?: boolean;
	onChange: (markdown: string) => void;
	handleRef: RefObject<MarkdownEditorHandle | null>;
}

/**
 * Holds the markdown the way a form does and prints it, so the assertions read the
 * value the host actually holds rather than what `onChange` happened to report.
 *
 * `controlled` swaps `initialMode` for the controlled `mode` prop, because those are
 * two different code paths through `changeMode`.
 */
const Host: FC<HostProps> = ({ initial, startMode, emitMode, controlled, onChange, handleRef }) => {
	const [value, setValue] = useState(initial);
	const [mode, setMode] = useState(startMode);

	return (
		<>
			<MarkdownEditor
				label="Notes"
				value={value}
				allowedModes={ALL_MODES}
				editorRef={handleRef}
				emitMode={emitMode}
				emitDebounceMs={DEBOUNCE_MS}
				{...(controlled ? { mode } : { initialMode: startMode })}
				onModeChange={setMode}
				onChange={(next) => {
					setValue(next);
					onChange(next);
				}}
			/>
			<pre data-role="form-value">{value}</pre>
		</>
	);
};

Host.displayName = "ModeSwitchHost";

function formValue(container: HTMLElement): string {
	return getByDataRole(container, "form-value").textContent ?? "";
}

/**
 * The whole rich document, serialized — what "the rich editor keeps the document it
 * already has" means.
 *
 * The node tree, not its text: a remount re-registers every node transform, and the
 * damage that caused last time was a stripped link target, which the text alone
 * would not show.
 */
function richState(handle: MarkdownEditorHandle | null): string | null {
	const editor = handle?.getActiveEditor() ?? null;

	return editor ? JSON.stringify(editor.getEditorState().toJSON()) : null;
}

interface WalkOptions {
	doc: string;
	start: MarkdownEditorMode;
	stops: MarkdownEditorMode[];
	emitMode: MarkdownEditorEmitMode;
	controlled?: boolean;

	/** Click straight through without waiting, to catch a switch racing an unfinished mount. */
	rapid?: boolean;

	/** Put the caret in the surface before every switch. */
	focusFirst?: boolean;
}

/**
 * Walks the mode switcher and fails if the host's value moved by one byte, if
 * `onChange` fired at all, or if the rich document came back different.
 */
async function expectWalkChangesNothing({
	doc,
	start,
	stops,
	emitMode,
	controlled,
	rapid,
	focusFirst
}: WalkOptions): Promise<void> {
	const onChange = vi.fn();
	const handleRef = { current: null } as RefObject<MarkdownEditorHandle | null>;
	const { container, unmount } = render(
		<Host
			initial={doc}
			startMode={start}
			emitMode={emitMode}
			controlled={controlled}
			handleRef={handleRef}
			onChange={onChange}
		/>
	);

	if (!rapid) {
		await settle(container, start);
	}

	// The handle has to be there, or every assertion that reads through it is vacuous.
	expect(handleRef.current).not.toBeNull();

	// Taken while the rich editor is the one on screen, so there is something to compare with.
	const richBefore = start === "source" ? null : richState(handleRef.current);

	expect(start === "source" || richBefore).not.toBeNull();

	for (const stop of stops) {
		const current = handleRef.current?.mode ?? start;

		if (focusFirst && current !== "view") {
			await userEvent.click(getSurfaceByMode(container, current));
		}

		await switchMode(container, stop);

		if (!rapid) {
			await settle(container, stop);
		}
	}

	await settle(container, stops.at(-1) ?? start);

	expect(onChange).not.toHaveBeenCalled();
	expect(formValue(container)).toBe(doc);

	if (richBefore !== null && handleRef.current?.mode !== "source") {
		expect(richState(handleRef.current)).toBe(richBefore);
	}

	// Unmount flushes both surfaces one last time.
	unmount();
	await wait(PAST_DEBOUNCE_MS);
	expect(onChange).not.toHaveBeenCalled();
}

describe("MarkdownEditor mode switching without editing", () => {
	describe("every ordered pair of modes", () => {
		for (const from of MODES) {
			for (const to of MODES.filter((mode) => mode !== from)) {
				for (const emitMode of EMIT_MODES) {
					test(`${from} -> ${to} (emitMode="${emitMode}") changes nothing`, async () => {
						await expectWalkChangesNothing({
							doc: DOCS.awkward!,
							start: from,
							stops: [to],
							emitMode
						});
					});
				}
			}
		}
	});

	/*
	 * Eight switches, each one waiting out the debounce, and every switch goes through the
	 * mode menu: open it, then pick. That is well past the default 10s on a loaded CI machine.
	 */
	describe("a long walk over all three surfaces", { timeout: 30_000 }, () => {
		const WALK: MarkdownEditorMode[] = ["source", "view", "edit", "view", "source", "edit", "source", "view"];

		for (const [name, doc] of Object.entries(DOCS)) {
			test(`${name}: eight switches change nothing`, async () => {
				await expectWalkChangesNothing({
					doc,
					start: "edit",
					stops: WALK,
					emitMode: "change"
				});
			});
		}

		for (const emitMode of EMIT_MODES) {
			test(`emitMode="${emitMode}": eight switches change nothing`, async () => {
				await expectWalkChangesNothing({
					doc: DOCS.awkward!,
					start: "edit",
					stops: WALK,
					emitMode
				});
			});
		}

		test("with the mode prop controlled by the host", async () => {
			await expectWalkChangesNothing({
				doc: DOCS.awkward!,
				start: "edit",
				stops: WALK,
				emitMode: "change",
				controlled: true
			});
		});

		/*
		 * Clicking the switcher blurs the surface first, and blur flushes. Under
		 * `emitMode: "blur"` that flush is the only thing standing between a caret
		 * and a report, so all three emit modes get their own run.
		 */
		for (const emitMode of EMIT_MODES) {
			test(`emitMode="${emitMode}": the caret placed in each surface before switching`, async () => {
				await expectWalkChangesNothing({
					doc: DOCS.awkward!,
					start: "edit",
					stops: WALK,
					emitMode,
					focusFirst: true
				});
			});
		}
	});

	describe("switching before the editor has settled", () => {
		for (const emitMode of EMIT_MODES) {
			test(`emitMode="${emitMode}": switching straight after mount changes nothing`, async () => {
				await expectWalkChangesNothing({
					doc: DOCS.awkward!,
					start: "edit",
					stops: ["source", "edit", "view", "source"],
					emitMode,
					rapid: true
				});
			});
		}
	});

	describe("what the source surface is filled with", () => {
		for (const [name, doc] of Object.entries(DOCS)) {
			test(`${name}: the source editor holds the host's value byte for byte`, async () => {
				const onChange = vi.fn();
				const handleRef = { current: null } as RefObject<MarkdownEditorHandle | null>;
				const { container } = render(
					<Host initial={doc} startMode="edit" emitMode="change" handleRef={handleRef} onChange={onChange} />
				);

				await settle(container, "edit");
				await switchMode(container, "source");
				await settle(container, "source");

				const sourceEditor = handleRef.current?.getActiveEditor() ?? null;

				expect(sourceEditor).not.toBeNull();
				expect(sourceEditor!.read(() => $getSourceDocumentText())).toBe(doc);
				expect(formValue(container)).toBe(doc);
				expect(onChange).not.toHaveBeenCalled();
			});
		}
	});

	/*
	 * The same check for a host that opens straight into source mode, where the surface is
	 * filled on the first mount instead of on a switch. Reading the value is not an edit, so
	 * every character has to arrive intact and the host has to hear nothing.
	 */
	describe("opening straight into source mode", () => {
		for (const [name, doc] of Object.entries(DOCS)) {
			test(`${name}: the source editor holds the host's value byte for byte on mount`, async () => {
				const onChange = vi.fn();
				const handleRef = { current: null } as RefObject<MarkdownEditorHandle | null>;
				const { container } = render(
					<Host initial={doc} startMode="source" emitMode="change" handleRef={handleRef} onChange={onChange} />
				);

				await settle(container, "source");

				const sourceEditor = handleRef.current?.getActiveEditor() ?? null;

				expect(sourceEditor).not.toBeNull();
				expect(sourceEditor!.read(() => $getSourceDocumentText())).toBe(doc);
				expect(formValue(container)).toBe(doc);
				expect(onChange).not.toHaveBeenCalled();
			});
		}
	});

	/*
	 * CRLF used to lose the `\r` of every ending that sat between two blocks:
	 * `splitSourceBlocks` dropped the whole separator chunk and `joinSourceBlocks` re-joined
	 * with "\n". The value survived a mode switch anyway, because nothing was dirty and
	 * nothing was ever read back out — the damage waited for the first keystroke.
	 */
	describe("CRLF line endings", () => {
		test("one keystroke in source leaves every ending the user never touched alone", async () => {
			const onChange = vi.fn();
			const handleRef = { current: null } as RefObject<MarkdownEditorHandle | null>;
			const { container } = render(
				<Host initial={DOCS.crlf!} startMode="source" emitMode="change" handleRef={handleRef} onChange={onChange} />
			);

			await settle(container, "source");
			await userEvent.click(getSurfaceByMode(container, "source"));
			await userEvent.keyboard("X");
			await wait(PAST_DEBOUNCE_MS);

			expect(formValue(container)).toBe(`${DOCS.crlf}X`);
		});
	});
});
