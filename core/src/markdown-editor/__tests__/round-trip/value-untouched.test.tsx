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

import type { FC } from "react";
import { useState } from "react";
import { getByDataRole, render } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import type { MarkdownEditorEmitMode, MarkdownEditorMode } from "../../main/markdown-editor.api.js";
import { MarkdownEditor } from "../../main/markdown-editor.view.js";
import { ALL_MODES, getSurfaceByMode, getShownMode, wait, switchMode, waitForSurfaceReady } from "../utils/index.js";

/**
 * A document built out of everything the editor would rewrite the moment it
 * serialized: frontmatter, a heading with no blank line under it, runs of blank
 * lines, `*` and `+` bullets, `1)` ordinals, two- and three-space nesting, a
 * tab-indented item, setext headings, three spellings of a thematic break,
 * reference links and their definitions, a footnote, raw HTML, character
 * entities, a hard break made of two trailing spaces, and a trailing newline.
 *
 * Not one byte of it may change while nobody edits.
 */
const AUTHORED_MARKDOWN = [
	"---",
	"title: Release notes",
	"tags: [markdown, editor]",
	"---",
	"# Release notes",
	"Straight after the heading, with no blank line between them.",
	"",
	"",
	"",
	"Three blank lines above this one.",
	"",
	"Setext heading",
	"==============",
	"",
	"Another one",
	"-----------",
	"",
	"* asterisk bullet",
	"* still an asterisk",
	"  * two-space nesting",
	"     * five-space nesting",
	"+ plus bullet",
	"",
	"1) paren ordinal",
	"2) second",
	"   1. three-space nested ordinal",
	"",
	"- [ ] open task",
	"- [x] done task",
	"\t- tab-indented child",
	"",
	"> A quote",
	"> with a lazy",
	"continuation line.",
	"",
	"Inline: **bold**, *italic*, `code`, ~~struck~~, <mark>marked</mark>, H<sub>2</sub>O,",
	"a literal backslash-n \\n, an entity &amp; and a numeric one &#42;.",
	"",
	"A hard break lives at the end of this line.  ",
	"So this is still the same paragraph.",
	"",
	"| Left | Center | Right |",
	"| :--- | :----: | ----: |",
	"| a    | `b|c`  |     1 |",
	"",
	"```js",
	'const fence = "holds ``` inside a string";',
	"```",
	"",
	"    an indented code block",
	"    second line",
	"",
	"See [the reference][ref] and ![an image][img].",
	"A bare autolink: https://example.com and <https://example.org>.",
	"",
	"A footnote reference[^note].",
	"",
	'<div class="raw">',
	"  <span>an HTML block</span>",
	"</div>",
	"",
	"---",
	"",
	"***",
	"",
	"___",
	"",
	'[ref]: https://example.com/reference "With a title"',
	"[img]: https://example.com/a.png",
	"",
	"[^note]: The footnote body.",
	""
].join("\n");

/**
 * A short debounce, so waiting past it does not cost real seconds per step. Only
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

/**
 * Holds the markdown in state, the way a form does, and prints what it currently holds,
 * so a test reads the form value itself instead of inferring it from `onChange`.
 *
 * The button re-renders the host without touching the value, so the tests can check
 * that a plain parent render does not push the same string back through the editor.
 */
const FormFieldHost: FC<{
	mode: MarkdownEditorMode;
	emitMode: MarkdownEditorEmitMode;
	readonly?: boolean;
	disabled?: boolean;
	onChange: (markdown: string) => void;
}> = ({ mode, emitMode, readonly, disabled, onChange }) => {
	const [value, setValue] = useState(AUTHORED_MARKDOWN);
	const [, setRenderCount] = useState(0);

	return (
		<>
			<MarkdownEditor
				label="Release notes"
				value={value}
				allowedModes={ALL_MODES}
				initialMode={mode}
				emitMode={emitMode}
				emitDebounceMs={DEBOUNCE_MS}
				readonly={readonly}
				disabled={disabled}
				maxHeight={400}
				onChange={(next) => {
					setValue(next);
					onChange(next);
				}}
			/>
			<pre data-role="form-value">{value}</pre>
			<button type="button" data-role="rerender" onClick={() => setRenderCount((count) => count + 1)}>
				Re-render
			</button>
		</>
	);
};

FormFieldHost.displayName = "FormFieldHost";

/**
 * Walks every path that is able to emit for a document nobody edits: the debounce
 * window, focus, a host re-render, blur (which flushes), and unmount (which flushes
 * again). Fails if the host hears anything at all, or if what it holds has shifted
 * by one byte.
 */
async function expectNothingReported(props: {
	mode: MarkdownEditorMode;
	emitMode: MarkdownEditorEmitMode;
	readonly?: boolean;
	disabled?: boolean;
}): Promise<void> {
	const onChange = vi.fn();
	const { container, unmount } = render(<FormFieldHost {...props} onChange={onChange} />);

	// Mounted and settled. Putting the host's value into the document is not an edit.
	await settle(container, getShownMode(props.mode, props.readonly));
	expect(onChange).not.toHaveBeenCalled();

	// Placing a caret is not an edit either. A disabled surface says `aria-disabled`, which
	// the runner's actionability check reads as "not clickable" and waits on until it times
	// out. A real pointer has no such rule, so the click is forced through to the element.
	await userEvent.click(getSurfaceByMode(container, getShownMode(props.mode, props.readonly)), {
		force: props.disabled
	});
	await wait(PAST_DEBOUNCE_MS);
	expect(onChange).not.toHaveBeenCalled();

	// The host renders again and hands back the same string. Not an edit.
	await userEvent.click(getByDataRole(container, "rerender"));
	await wait(PAST_DEBOUNCE_MS);
	expect(onChange).not.toHaveBeenCalled();

	// Leaving the field flushes whatever is pending. Nothing is pending.
	await userEvent.click(getByDataRole(container, "form-value"));
	await wait(PAST_DEBOUNCE_MS);
	expect(onChange).not.toHaveBeenCalled();

	// The form still holds the exact string it was handed.
	expect(getByDataRole(container, "form-value").textContent).toBe(AUTHORED_MARKDOWN);

	// Unmount flushes one last time.
	unmount();
	await wait(PAST_DEBOUNCE_MS);
	expect(onChange).not.toHaveBeenCalled();
}

describe("MarkdownEditor leaves the form value alone until it is edited", () => {
	/*
	 * Every mode against every emit mode.
	 *
	 * The modes matter because the surfaces reach the host by different routes: the rich
	 * editor serializes its node tree, the source editor edits the raw text, and view mode
	 * keeps the rich bridge switched on and only takes editing away. The emit modes matter
	 * because "change" reports straight from the update listener while the other two go
	 * through the debounce and the flush. None of them may report an untouched document.
	 */
	for (const mode of ["edit", "source", "view"] as MarkdownEditorMode[]) {
		for (const emitMode of ["change", "debounced", "blur"] as MarkdownEditorEmitMode[]) {
			test(`initialMode="${mode}", emitMode="${emitMode}": the value stays byte-for-byte`, async () => {
				await expectNothingReported({ mode, emitMode });
			});
		}
	}

	/*
	 * Both flags leave the value bridge switched on and only make the surface
	 * non-editable, so they get their own check rather than riding on the loop above.
	 */
	test("readonly: the value stays byte-for-byte", async () => {
		await expectNothingReported({ mode: "edit", emitMode: "change", readonly: true });
	});

	test("disabled: the value stays byte-for-byte", async () => {
		await expectNothingReported({ mode: "edit", emitMode: "change", disabled: true });
	});

	/*
	 * Switching to source used to serialize the document and report it whenever the result
	 * read differently from `value` — which is nearly always, because the trip through
	 * mdast drops blank lines and the trailing newline. Opening the source view is not an
	 * edit, so the host must hear nothing.
	 */
	test("switching edit -> source without editing reports nothing", async () => {
		const onChange = vi.fn();
		const { container } = render(<FormFieldHost mode="edit" emitMode="change" onChange={onChange} />);

		// One settle for the import. After that `emitMode: "change"` reports straight from
		// the update listener, so anything the click causes has happened once it resolves.
		await wait(PAST_DEBOUNCE_MS);
		await switchMode(container, "source");

		expect(onChange).not.toHaveBeenCalled();
		expect(getByDataRole(container, "form-value").textContent).toBe(AUTHORED_MARKDOWN);
	});

	/*
	 * Going and coming back, which is where a one-way switch is not enough.
	 *
	 * The rich surface unmounts on the way to source and mounts again on the way back, so
	 * every React plugin inside it re-registers. `registerNodeTransform` marks every existing
	 * node of that type dirty, in an update that carries no tag — on the first mount the
	 * document is still empty and nothing comes of it, on the second it is the host's whole
	 * document. That looked like an edit, and reported the serialized document back.
	 */
	test("switching edit -> source -> edit without editing reports nothing", async () => {
		const onChange = vi.fn();
		const { container } = render(<FormFieldHost mode="edit" emitMode="change" onChange={onChange} />);

		await settle(container, "edit");
		await switchMode(container, "source");
		await settle(container, "source");
		await switchMode(container, "edit");
		await settle(container, "edit");

		expect(onChange).not.toHaveBeenCalled();
		expect(getByDataRole(container, "form-value").textContent).toBe(AUTHORED_MARKDOWN);
	});

	/** The other direction never had the extra report, and still must not grow one. */
	test("switching source -> edit without editing reports nothing", async () => {
		const onChange = vi.fn();
		const { container } = render(<FormFieldHost mode="source" emitMode="change" onChange={onChange} />);

		await settle(container, "source");
		await switchMode(container, "edit");

		expect(onChange).not.toHaveBeenCalled();
		expect(getByDataRole(container, "form-value").textContent).toBe(AUTHORED_MARKDOWN);
	});

	/*
	 * One edit is one report, whichever emit mode is in play.
	 *
	 * The three modes reach the switch in different states. `"change"` already reported at
	 * the keystroke, so there is nothing left to send. `"debounced"` and `"blur"` are still
	 * holding the edit, and `flush()` sends it as the surface goes away. None of them may
	 * send it twice, which is what comparing the written-out document against `value` did:
	 * `value` is a prop, so it still holds the old string inside the same handler.
	 */
	for (const emitMode of ["change", "debounced", "blur"] as MarkdownEditorEmitMode[]) {
		test(`emitMode="${emitMode}": an edit then a switch to source reports once`, async () => {
			const onChange = vi.fn();
			const { container } = render(<FormFieldHost mode="edit" emitMode={emitMode} onChange={onChange} />);

			await settle(container, "edit");
			await userEvent.click(getSurfaceByMode(container, "edit"));
			await userEvent.keyboard("X");

			// No settle in between: for "debounced" and "blur" the edit is still pending
			// here, so the switch is what has to send it.
			await switchMode(container, "source");
			await settle(container, "source");

			expect(onChange).toHaveBeenCalledTimes(1);
		});
	}
});
