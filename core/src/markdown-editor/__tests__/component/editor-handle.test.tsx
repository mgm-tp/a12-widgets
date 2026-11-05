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

import type { LexicalEditor } from "lexical";
import type { ReactElement } from "react";
import { render, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import type { MarkdownEditorHandle, MarkdownEditorMode } from "../../main/markdown-editor.api.js";
import {
	ControlledEditor,
	type ControlledEditorProps,
	getSurfaceByMode,
	getShownMode,
	isHoldingCaret,
	waitForSurfaceReady
} from "../utils/index.js";

const SAMPLE_MARKDOWN = "# Title\n\nA paragraph.\n";

/** One line, so Home reaches the start of the document and a selection is exact. */
const ONE_LINE_MARKDOWN = "hello world";

/** The two surfaces a user can type in. `view` has no caret, and is covered on its own below. */
const EDITABLE_MODES = ["edit", "source"] as const;

/**
 * A ref callback that keeps its identity across re-renders, which is what a host's `useRef`
 * gives the editor. A fresh arrow on every render would make React detach and re-attach the ref
 * and the handle would be rebuilt along with it.
 */
function handleHolder(): {
	ref: (handle: MarkdownEditorHandle | null) => void;
	get: () => MarkdownEditorHandle | null;
} {
	let current: MarkdownEditorHandle | null = null;

	return {
		ref: (handle) => {
			current = handle;
		},
		get: () => current
	};
}

/** Holds the handle the editor fills in, so a test can drive it like a host would. */
interface RenderedEditor {
	container: HTMLElement;
	handle: () => MarkdownEditorHandle;
}

/**
 * Renders the editor with a stable ref and waits for the surface to arrive.
 *
 * `handle()` throws rather than returning null, so a test that reads it too early fails
 * on the missing handle instead of on a confusing `undefined` further down.
 */
async function renderWithHandle(props: ControlledEditorProps = {}): Promise<RenderedEditor> {
	const holder = handleHolder();

	const { container } = render(
		<ControlledEditor label="Notes" initialValue={SAMPLE_MARKDOWN} editorRef={holder.ref} {...props} />
	);

	await waitForSurfaceReady(container, getShownMode(props.initialMode, props.readonly));

	return {
		container,
		handle: () => {
			const handle = holder.get();

			if (!handle) {
				throw new Error("the editor did not fill the ref");
			}

			return handle;
		}
	};
}

/*
 * Every member, on both editable surfaces. The two are different editors with different documents
 * rich nodes on one side, one highlighted text document on the other
 * so a member working in `edit` says nothing about `source`. Each one is asserted twice.
 */
describe.each(EDITABLE_MODES)("MarkdownEditor editorRef in %s mode", (mode) => {
	test("mode reports the surface that is up", async () => {
		const { handle } = await renderWithHandle({ initialMode: mode });

		expect(handle().mode).toBe<MarkdownEditorMode>(mode);
	});

	test("getActiveEditor answers a live editor", async () => {
		const { handle } = await renderWithHandle({ initialMode: mode });

		// The source editor mounts a render behind the shell, so it is worth waiting for.
		await waitFor(() => expect(handle().getActiveEditor()).not.toBeNull());
	});

	test("focus() puts the caret in, blur() takes it back off", async () => {
		const { container, handle } = await renderWithHandle({ initialMode: mode });
		const surface = getSurfaceByMode(container, mode);

		handle().focus();
		await waitFor(() => expect(isHoldingCaret(surface)).toBe(true));

		handle().blur();
		await waitFor(() => expect(isHoldingCaret(surface)).toBe(false));
	});

	test("getSelectedMarkdown answers the selection", async () => {
		const { container, handle } = await renderWithHandle({
			initialMode: mode,
			initialValue: ONE_LINE_MARKDOWN
		});
		const surface = getSurfaceByMode(container, mode);

		// Step 1: focus parks the caret at the end of the text.
		handle().focus();
		await waitFor(() => expect(isHoldingCaret(surface)).toBe(true));

		// Step 2: select back to the start, the way a user drags across a line.
		await userEvent.keyboard("{Shift>}{Home}{/Shift}");

		await waitFor(() => expect(handle().getSelectedMarkdown()).toBe(ONE_LINE_MARKDOWN));
	});

	test("getSelectedMarkdown carries the formatting, not just the text", async () => {
		const { container, handle } = await renderWithHandle({ initialMode: mode, initialValue: "**bold**" });
		const surface = getSurfaceByMode(container, mode);

		handle().focus();
		await waitFor(() => expect(isHoldingCaret(surface)).toBe(true));
		await userEvent.keyboard("{Shift>}{Home}{/Shift}");

		// In edit mode the selected nodes are serialized back to markdown, so the asterisks
		// have to come back even though the surface only ever showed the word.
		await waitFor(() => expect(handle().getSelectedMarkdown()).toBe("**bold**"));
	});

	test("insertMarkdown replaces the selection", async () => {
		const onChange = vi.fn();
		const { container, handle } = await renderWithHandle({
			initialMode: mode,
			initialValue: ONE_LINE_MARKDOWN,
			emitMode: "change",
			onChange
		});
		const surface = getSurfaceByMode(container, mode);

		// Step 1: select the whole line.
		handle().focus();
		await waitFor(() => expect(isHoldingCaret(surface)).toBe(true));
		await userEvent.keyboard("{Shift>}{Home}{/Shift}");

		// Step 2: insert over it. The old text has to go, not sit next to the new one.
		handle().insertMarkdown("replaced");

		await waitFor(() => expect(onChange).toHaveBeenCalled());
		await waitFor(() => expect(surface.textContent).toContain("replaced"));
		expect(surface.textContent).not.toContain(ONE_LINE_MARKDOWN);
	});

	test('getSelectedMarkdown answers "" when nothing is selected', async () => {
		const { handle } = await renderWithHandle({ initialMode: mode });

		expect(handle().getSelectedMarkdown()).toBe("");
	});

	test("insertMarkdown builds a real block in an empty document", async () => {
		const onChange = vi.fn();
		const { handle } = await renderWithHandle({
			initialMode: mode,
			initialValue: "",
			emitMode: "change",
			onChange
		});

		handle().insertMarkdown("## Inserted\n");

		await waitFor(() => expect(onChange).toHaveBeenCalled());
		expect(onChange.mock.lastCall?.[0]).toContain("## Inserted");
	});

	test("insertMarkdown keeps a heading a heading at the end of a filled paragraph", async () => {
		const onChange = vi.fn();
		const { handle } = await renderWithHandle({ initialMode: mode, emitMode: "change", onChange });

		// Never focused, so the caret goes to the end of "A paragraph." — a block with text in it.
		handle().insertMarkdown("## Inserted\n");

		await waitFor(() => expect(onChange).toHaveBeenCalled());

		const emitted = onChange.mock.lastCall?.[0] as string;

		// Its own line, not the word "Inserted" tacked onto the paragraph.
		expect(emitted).toMatch(/^## Inserted$/m);
		expect(emitted).toContain("A paragraph.");
		expect(emitted).not.toContain("paragraph.Inserted");
	});

	test("insertMarkdown with several blocks puts every block on its own line", async () => {
		const onChange = vi.fn();
		const { handle } = await renderWithHandle({ initialMode: mode, emitMode: "change", onChange });

		handle().focus();
		handle().insertMarkdown("## Inserted\n\n- one\n- two\n");

		await waitFor(() => expect(onChange).toHaveBeenCalled());

		const emitted = onChange.mock.lastCall?.[0] as string;

		expect(emitted).toMatch(/^## Inserted$/m);
		expect(emitted).toMatch(/^- one$/m);
		expect(emitted).toMatch(/^- two$/m);
		expect(emitted).not.toContain("paragraph.Inserted");
	});

	test("insertMarkdown appends when the editor was never focused", async () => {
		const onChange = vi.fn();
		const { handle } = await renderWithHandle({ initialMode: mode, emitMode: "change", onChange });

		handle().insertMarkdown("tail");

		await waitFor(() => expect(onChange).toHaveBeenCalled());

		const emitted = onChange.mock.lastCall?.[0] as string;

		// Asserted as "at the end" rather than as one exact string, because the two documents
		// do not end in the same place: the rich one stops at the last paragraph, the markdown
		// source runs on past its trailing newline. Both append; only the join differs.
		expect(emitted.trimEnd().endsWith("tail")).toBe(true);
		expect(emitted).toContain("A paragraph.");
	});

	test("undo walks an edit back, redo puts it in again", async () => {
		const { container, handle } = await renderWithHandle({ initialMode: mode, emitMode: "change" });
		const surface = getSurfaceByMode(container, mode);

		// Step 1: put something in through the handle and wait for it to reach the document.
		handle().insertMarkdown("Inserted");
		await waitFor(() => expect(surface.textContent).toContain("Inserted"));

		// Step 2: undo. History lives in the editor behind the surface that is up.
		handle().undo();
		await waitFor(() => expect(surface.textContent).not.toContain("Inserted"));

		// Step 3: redo, on that same history.
		handle().redo();
		await waitFor(() => expect(surface.textContent).toContain("Inserted"));
	});

	test("flush() reports a debounced edit without waiting for a blur", async () => {
		const onChange = vi.fn();

		// A long debounce, so nothing can have been reported by itself.
		const { container, handle } = await renderWithHandle({
			initialMode: mode,
			emitDebounceMs: 5_000,
			onChange
		});
		const surface = getSurfaceByMode(container, mode);

		// Step 1: type, without leaving the field.
		await userEvent.click(surface);
		await userEvent.keyboard("X");

		expect(onChange).not.toHaveBeenCalled();

		// Step 2: the host asks for the waiting edit — an autosave, a Ctrl+S, a route guard.
		handle().flush();

		await waitFor(() => expect(onChange).toHaveBeenCalled());
	});

	test("flush() stays quiet when nobody typed", async () => {
		const onChange = vi.fn();
		const { handle } = await renderWithHandle({ initialMode: mode, onChange });

		handle().flush();
		handle().flush();

		expect(onChange).not.toHaveBeenCalled();
	});
});

describe("MarkdownEditor editorRef", () => {
	test("the ref is filled once the editor has rendered", async () => {
		const { handle } = await renderWithHandle();

		expect(handle().mode).toBe<MarkdownEditorMode>("edit");
	});

	test("readonly is folded into the mode the handle reports", async () => {
		const { handle } = await renderWithHandle({ readonly: true, initialMode: "edit" });

		// The host asked for `edit`, but a readonly field has nothing to type in.
		expect(handle().mode).toBe<MarkdownEditorMode>("view");
	});

	test("the same handle survives a mode switch", async () => {
		const holder = handleHolder();
		const editorFor = (mode: MarkdownEditorMode): ReactElement => (
			<ControlledEditor label="Notes" initialValue={SAMPLE_MARKDOWN} mode={mode} editorRef={holder.ref} />
		);

		// Step 1: start in edit mode and keep the handle the host was given.
		const { container, rerender } = render(editorFor("edit"));

		await waitForSurfaceReady(container, "edit");

		const first = holder.get();

		// Step 2: switch. The rich surface goes away and the source editor mounts in its place.
		rerender(editorFor("source"));
		await waitForSurfaceReady(container, "source");

		// Step 3: the host's ref must not have churned — but it now answers for the new surface.
		expect(holder.get()).toBe(first);
		expect(holder.get()?.mode).toBe<MarkdownEditorMode>("source");
	});

	test("getActiveEditor follows the mode, rather than always answering the rich editor", async () => {
		const holder = handleHolder();
		const getEditorForMode = (mode: MarkdownEditorMode): ReactElement => (
			<ControlledEditor label="Notes" initialValue={SAMPLE_MARKDOWN} mode={mode} editorRef={holder.ref} />
		);

		const { container, rerender } = render(getEditorForMode("edit"));

		await waitForSurfaceReady(container, "edit");

		const richEditor: LexicalEditor | null = holder.get()?.getActiveEditor() ?? null;

		expect(richEditor).not.toBeNull();

		rerender(getEditorForMode("source"));
		await waitForSurfaceReady(container, "source");

		// The source editor lives in a nested composer, so it is a different instance.
		await waitFor(() => expect(holder.get()?.getActiveEditor()).not.toBe(richEditor));
		expect(holder.get()?.getActiveEditor()).not.toBeNull();
	});

	test("getActiveEditor is null for the render before the source editor mounts", async () => {
		const holder = handleHolder();

		// The source editor sits in a nested composer, so the shell only sees it a render after
		// it mounts. Read the handle the moment the ref is filled to catch that gap.
		let firstAnswer: LexicalEditor | null | "unread" = "unread";

		const { container } = render(
			<ControlledEditor
				label="Notes"
				initialValue={SAMPLE_MARKDOWN}
				initialMode="source"
				editorRef={(handle) => {
					holder.ref(handle);

					if (handle && firstAnswer === "unread") {
						firstAnswer = handle.getActiveEditor();
					}
				}}
			/>
		);

		expect(firstAnswer).toBeNull();

		// And it fills in once that editor is up.
		await waitForSurfaceReady(container, "source");
		await waitFor(() => expect(holder.get()?.getActiveEditor()).not.toBeNull());
	});

	test("an inline ref callback still gets the same handle every render", async () => {
		const seen: MarkdownEditorHandle[] = [];

		// A host writing the ref inline hands React a new callback on every render, which makes
		// React detach and re-attach. The handle behind it must not be rebuilt.
		const editorFor = (value: string): ReactElement => (
			<ControlledEditor
				label="Notes"
				initialValue={SAMPLE_MARKDOWN}
				placeholder={value}
				editorRef={(handle) => {
					if (handle) {
						seen.push(handle);
					}
				}}
			/>
		);

		const { container, rerender } = render(editorFor("one"));

		await waitForSurfaceReady(container, "edit");

		rerender(editorFor("two"));
		rerender(editorFor("three"));

		expect(seen.length).toBeGreaterThan(1);
		expect(seen.every((handle) => handle === seen[0])).toBe(true);
	});

	test("reading still works in view mode", async () => {
		const { container, handle } = await renderWithHandle({ initialMode: "view", initialValue: "**bold**" });

		await waitForSurfaceReady(container, "view");

		// Neither reads nor `flush` are gated on `editable`: reporting a pending edit and asking
		// for the selection are both safe when nothing can be typed.
		expect(handle().getSelectedMarkdown()).toBe("");
		expect(() => handle().flush()).not.toThrow();
		expect(handle().getActiveEditor()).not.toBeNull();
	});

	/*
	 * The two states with nothing to type in. Every member that would change the document
	 * has to do nothing, rather than quietly editing a surface the user cannot see.
	 */
	test.each([
		["view mode", { initialMode: "view" as const }, "view" as const],
		["a disabled field", { initialMode: "edit" as const, disabled: true }, "edit" as const]
	])("nothing the handle offers changes the document in %s", async (_name, props, surfaceMode) => {
		const onChange = vi.fn();
		const { container, handle } = await renderWithHandle({ emitMode: "change", onChange, ...props });

		handle().insertMarkdown("## Inserted\n");
		handle().undo();
		handle().redo();
		handle().focus();

		// Give an emit a chance to arrive before calling it absent.
		await waitForSurfaceReady(container, surfaceMode);

		expect(onChange).not.toHaveBeenCalled();
		expect(getSurfaceByMode(container, surfaceMode).textContent).not.toContain("Inserted");
		expect(isHoldingCaret(getSurfaceByMode(container, surfaceMode))).toBe(false);
	});
});
