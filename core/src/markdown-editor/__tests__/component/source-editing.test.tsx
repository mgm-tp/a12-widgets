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
 * Typing in source mode.
 *
 * The source surface is not a textarea. It is a second Lexical editor holding one node per
 * markdown block, so Enter and Backspace are structural edits: they split blocks, join them,
 * and can dissolve a boundary by changing the text around it. Every case here is one of those
 * edits, checked through the markdown that reaches the host.
 *
 * What the surface renders is pinned in `source-dom-shape.test.tsx`; what the tokenizer makes
 * of the text is in `source-highlighting/`.
 */

import { getByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { ControlledEditor, getToolbarItem } from "../utils/index.js";

describe("MarkdownEditor source mode", () => {
	// The source surface runs its own editor with its own history, so the toolbar's
	// undo has to reach *that* editor — the shell's has seen no edit at all.
	test("undo in source mode reverts the last edit", async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor initialValue="" onChange={onChange} initialMode="source" />);

		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);
		const undo = getToolbarItem(container, "undo");

		await userEvent.click(source);
		await userEvent.type(source, "hello");

		await waitFor(() => expect(undo).toBeEnabled());
		await userEvent.click(undo);

		await waitFor(() => expect(source.textContent).not.toContain("hello"));
	});

	// A block boundary is a property of the text around it, so a command can
	// dissolve one even though it only rewrote the block after it.
	test("a source-mode toolbar command merges the blocks it joins", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue={"- alpha\n\nbravo\n"} onChange={onChange} initialMode="source" />
		);

		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);
		const blocks = (): Element[] => [...source.querySelectorAll(".mde-source-block")];

		// "- alpha", the blank line, "bravo", and the empty block the trailing newline leaves.
		await waitFor(() => expect(blocks()).toHaveLength(4));

		await userEvent.click(blocks()[2]!.querySelector("[data-lexical-text]")!);
		await userEvent.click(getToolbarItem(container, "bulletList"));

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toBe("- alpha\n\n- bravo\n"));

		// One list, so one block: the two items are no longer separate constructs, and the
		// blank line between them belongs to the list rather than standing between blocks.
		await waitFor(() => expect(blocks()).toHaveLength(2));
	});

	// Enter used to append the break at the *end* of the block instead of the caret:
	// `LineBreakNode` has no `isInline()`, so the generic insert hoisted it out of the
	// nested token elements. `registerSourceLineBreak` places it by hand.
	test("Enter splits a source block at the caret, not at its end", async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor initialValue="abcdef" onChange={onChange} initialMode="source" />);

		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);

		await userEvent.click(source.querySelector("[data-lexical-text]")!);

		// Enter goes in its own `type` call: keys batched into one call reach the editor
		// before the caret has finished moving, and Enter then splits at the old caret.
		await userEvent.type(source, "{End}{arrowleft}{arrowleft}{arrowleft}");
		await userEvent.type(source, "{enter}");

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toBe("abc\ndef"));
	});

	// The caret sits inside `atxHeadingText`, two token elements deep, and the break
	// ends the heading — so the boundary repair has to split the block afterwards.
	test("Enter inside a nested token splits the block it ends", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue="# Heading" onChange={onChange} initialMode="source" />
		);

		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);
		const blocks = (): Element[] => [...source.querySelectorAll(".mde-source-block")];

		await userEvent.click(source.querySelector("[data-lexical-text]")!);
		await userEvent.type(source, "{End}{arrowleft}{arrowleft}{arrowleft}");
		await userEvent.type(source, "{enter}");

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toBe("# Head\ning"));
		await waitFor(() => expect(blocks()).toHaveLength(2));
	});

	// The break splits the block, so the caret's offset lands exactly on the new boundary —
	// a position both blocks can claim. It belongs to the one that *starts* there, or the
	// caret stays behind on the line the user just left and the next character is typed
	// before the break instead of after it.
	test("Enter leaves the caret on the new line, twice over", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue="# Awesome Editor!" onChange={onChange} initialMode="source" />
		);

		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);

		await userEvent.click(source.querySelector("[data-lexical-text]")!);
		await userEvent.type(source, "{End}" + "{arrowleft}".repeat("Editor!".length));
		await userEvent.type(source, "{enter}");

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toBe("# Awesome \nEditor!"));

		// A second break at the same caret opens a blank line between the two, which only
		// works if the caret really moved down with the first one.
		await userEvent.type(source, "{enter}");

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toBe("# Awesome \n\nEditor!"));

		await userEvent.keyboard("X");

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toBe("# Awesome \n\nXEditor!"));
	});

	// At the end of the document the break is the block's last child, and a trailing `<br>`
	// has no line after it to put a caret on — Lexical renders its own managed `<br>` for
	// that, but only when the break is the block's own child rather than a token's.
	test("Enter at the end of the document opens a line to type on", async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor initialValue="" onChange={onChange} initialMode="source" />);

		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);

		await userEvent.click(source);
		await userEvent.type(source, "one");
		await userEvent.type(source, "{enter}");
		await userEvent.type(source, "{enter}");
		await userEvent.keyboard("two");

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toBe("one\n\ntwo"));
	});

	// Backspace over a break used to look like it did nothing: the deletion was applied and
	// then overwritten, because the *edit-mode* editor answered the same update with the
	// document it still held from before the mode switch.
	test("Backspace at the start of a line removes the break before it", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue={"abc\ndef"} onChange={onChange} initialMode="source" />
		);

		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);

		await userEvent.click(source.querySelector("[data-lexical-text]")!);
		await userEvent.type(source, "{End}{arrowright}");
		await userEvent.keyboard("{Backspace}");

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toBe("abcdef"));
	});

	// Two blocks are two `div`s, so joining them is a boundary repair rather than a plain
	// text deletion — the blank line between them goes and the blocks merge into one.
	test("Backspace at the start of a block joins it to the one above", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue={"abc\n\ndef"} onChange={onChange} initialMode="source" />
		);

		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);
		const blocks = (): Element[] => [...source.querySelectorAll(".mde-source-block")];

		// "abc", the blank line between them, "def".
		await waitFor(() => expect(blocks()).toHaveLength(3));

		await userEvent.click(blocks()[2]!.querySelector("[data-lexical-text]")!);
		await userEvent.type(source, "{Home}");
		await userEvent.keyboard("{Backspace}");

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toBe("abc\ndef"));

		// Without the blank line the two are one paragraph, so one block.
		await waitFor(() => expect(blocks()).toHaveLength(1));
	});

	// Deleting a block's last character leaves the block itself behind, holding nothing.
	// Removing it changes no text, so the keypress that does it looks like a dead one and
	// the reader presses Backspace twice to delete once.
	test("every Backspace after several Enters removes something", async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor initialValue="" onChange={onChange} initialMode="source" />);

		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);

		await userEvent.click(source);

		for (const step of ["abc", "{enter}", "{enter}", "def"]) {
			await userEvent.type(source, step);
		}

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toBe("abc\n\ndef"));

		for (const expected of ["abc\n\nde", "abc\n\nd", "abc\n\n", "abc\n", "abc"]) {
			await userEvent.keyboard("{Backspace}");

			await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toBe(expected));
		}
	});

	// With the caret at the very start of a block, the character before it is the last one
	// of the block above. Lexical reads the boundary as structure and merges the two block
	// nodes, which deletes no text at all — the blank lines are still there, the repair
	// splits them apart again, and the keypress does nothing at all.
	test("Backspace at the start of a block deletes the blank line above it", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue={"first\n\n\n\nsecond\n"} onChange={onChange} initialMode="source" />
		);

		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);
		const blocks = (): Element[] => [...source.querySelectorAll(".mde-source-block")];

		// "first", three blank lines, "second", and the empty block the trailing newline leaves.
		await waitFor(() => expect(blocks()).toHaveLength(6));

		// The very start of the block holding "second", in front of its first character.
		await userEvent.click(blocks()[4]!.querySelector("[data-lexical-text]")!);
		await userEvent.type(source, "{Home}");

		for (const expected of ["first\n\n\nsecond\n", "first\n\nsecond\n", "first\nsecond\n"]) {
			await userEvent.keyboard("{Backspace}");

			await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toBe(expected));
		}

		// The last blank line taken away leaves one paragraph, plus the trailing empty block.
		await waitFor(() => expect(blocks()).toHaveLength(2));
	});

	// A blank line separates two blocks only while nothing is still open across it. An
	// unfinished fence reads on through everything below it, so the whole document becomes
	// one block until the fence is taken away again.
	test("opening a fence takes in what follows, removing it gives it back", async () => {
		const onChange = vi.fn();
		// `emitMode="change"` so every keystroke is reported. On the default debounce the
		// whole sequence lands inside one window, and the only emit left carries the text
		// the document started with — which the host already holds, so it is not sent.
		const { container } = render(
			<ControlledEditor initialValue={"one\n\ntwo\n"} onChange={onChange} initialMode="source" emitMode="change" />
		);

		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);
		const blocks = (): Element[] => [...source.querySelectorAll(".mde-source-block")];

		await waitFor(() => expect(blocks()).toHaveLength(4));

		await userEvent.click(source.querySelector("[data-lexical-text]")!);
		await userEvent.type(source, "{Home}");
		await userEvent.type(source, "```js");

		await waitFor(() => expect(blocks()).toHaveLength(1));

		// The caret is still just after the fence characters, so these take exactly them back.
		await userEvent.keyboard("{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}");

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toBe("one\n\ntwo\n"));
		await waitFor(() => expect(blocks()).toHaveLength(4));
	});

	test("editing the source surface emits markdown", async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor initialValue="" onChange={onChange} initialMode="source" />);

		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);

		await userEvent.click(source);
		await userEvent.type(source, "hello");

		await waitFor(() => {
			expect(onChange.mock.calls.at(-1)?.[0]).toContain("hello");
		});
	});
});
