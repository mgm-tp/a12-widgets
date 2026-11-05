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
import { useEffect } from "react";
import { render, waitFor } from "test-utils";
import { describe, expect, test } from "vitest";

import { useMarkdownEditorSurfaces } from "../../main/shared/index.js";
import { ControlledEditor, getSurfaceByMode } from "../utils/index.js";

/*
 * A markdown file is not the only way into this editor. A host that saves an editor state
 * and puts it back later goes through `importJSON`, which is handed a tag name and a set of
 * attributes and asked to build an element out of them.
 *
 * That state is not always the host's own. It gets stored, synced, restored from a draft
 * somebody else wrote. So the rule the markdown path enforces — only the tags on the
 * allowlist are ever built — has to hold here too, or `<script src="…">` is one saved draft
 * away from being a real element on the page.
 */

/** The tags a state must never be able to build, and what each would do if it could. */
const REFUSED: { tag: string; attributes: Record<string, string>; would: string }[] = [
	{ tag: "script", attributes: { src: "https://attacker.example/x.js" }, would: "fetch and run a file" },
	{ tag: "iframe", attributes: { src: "https://attacker.example/" }, would: "load somebody else's page" },
	{ tag: "object", attributes: {}, would: "embed something" },
	{ tag: "form", attributes: {}, would: "post somewhere" },
	{ tag: "style", attributes: {}, would: "restyle the host" }
];

/** Hands the rich surface's editor to the test, which is the only way to put a state in. */
function CaptureEditor({ onReady }: { onReady: (editor: LexicalEditor) => void }): null {
	const { richEditor } = useMarkdownEditorSurfaces();

	// A block, not an expression: whatever `onReady` gives back, React must not read it as
	// a clean-up function.
	useEffect(() => {
		onReady(richEditor);
	}, [richEditor, onReady]);

	return null;
}

/** An editor state whose paragraph holds one `mde-html-element` with the given tag. */
function stateHolding(tag: string, attributes: Record<string, string>, text: string): string {
	const textNode = { detail: 0, format: 0, mode: "normal", style: "", text, type: "text", version: 1 };

	return JSON.stringify({
		root: {
			children: [
				{
					children: [
						{
							children: [textNode],
							direction: null,
							format: "",
							indent: 0,
							type: "mde-html-element",
							version: 1,
							tag,
							attributes
						}
					],
					direction: null,
					format: "",
					indent: 0,
					textFormat: 0,
					textStyle: "",
					type: "paragraph",
					version: 1
				}
			],
			direction: null,
			format: "",
			indent: 0,
			type: "root",
			version: 1
		}
	});
}

/** Renders an editor and gives back the Lexical instance behind its rich surface. */
async function renderWithEditor(): Promise<{ container: HTMLElement; editor: LexicalEditor }> {
	let captured: LexicalEditor | null = null;
	const { container } = render(
		<ControlledEditor
			features={{ htmlTags: true }}
			initialValue="a document"
			plugins={<CaptureEditor onReady={(e) => (captured = e)} />}
		/>
	);

	await waitFor(() => expect(captured).not.toBeNull());

	return { container, editor: captured as unknown as LexicalEditor };
}

describe("MarkdownEditor state import — a tag that arrives as JSON rather than as markdown", () => {
	test.each(REFUSED)("a restored state cannot build a <$tag>, which would $would", async ({ tag, attributes }) => {
		const { container, editor } = await renderWithEditor();
		const surface = getSurfaceByMode(container, "edit");

		editor.setEditorState(editor.parseEditorState(stateHolding(tag, attributes, "the text inside")));

		// Asked structurally, not by searching the markup: the tag name shows up in
		// `innerHTML` either way, as an element if it was built and escaped if it was not.
		await waitFor(() => expect(surface.textContent).toContain("the text inside"));

		expect(container.querySelector(tag)).toBeNull();

		// A leftover `src` rides along onto the plain box that replaced the tag. That is
		// untidy and not a hole: nothing fetches a `src` off a `div`. What matters is that
		// no element that would fetch one exists.
		expect(container.querySelector("script, iframe, object, embed, form, style, link, base")).toBeNull();
	});

	test("what was inside a refused tag is kept, and keeps its shape", async () => {
		const { container, editor } = await renderWithEditor();
		const surface = getSurfaceByMode(container, "edit");

		editor.setEditorState(editor.parseEditorState(stateHolding("script", {}, "still readable")));

		// A refused tag is not a dropped tag. The words a person wrote survive being opened.
		await waitFor(() => expect(surface.textContent).toContain("still readable"));

		// `script` is inline by CommonMark's reckoning, so it comes back as a `span` and the
		// line it sat in still reads as one line.
		expect(surface.querySelector("span")).not.toBeNull();
	});

	test("a tag that is on the allowlist is still built, so the gate is by name", async () => {
		const { container, editor } = await renderWithEditor();

		editor.setEditorState(editor.parseEditorState(stateHolding("details", { open: "" }, "a summary")));

		await waitFor(() => expect(container.querySelector("details")).not.toBeNull());
	});

	test("an event handler in a saved state never reaches the element", async () => {
		const { container, editor } = await renderWithEditor();

		editor.setEditorState(
			editor.parseEditorState(stateHolding("div", { onclick: "globalThis.flag = true", id: "keep" }, "text"))
		);

		await waitFor(() => expect(container.querySelector("div#keep")).not.toBeNull());

		// The harmless attribute rode along, so the cleaning is by name rather than wholesale.
		expect(container.querySelector("[onclick]")).toBeNull();
	});

	test("an attribute name no element could carry does not take the document down", async () => {
		const { container, editor } = await renderWithEditor();

		// `data-` and `aria-` are prefixes, so a name can pass the prefix test and still be one
		// `setAttribute` refuses with an `InvalidCharacterError`. Unhandled, that throws while
		// the element is being built and the whole document fails to open.
		editor.setEditorState(
			editor.parseEditorState(stateHolding("div", { 'data-"': "x", "aria- ": "y", "data-ok": "z" }, "text"))
		);

		// The element is still built, and the attribute next to the bad one still lands.
		await waitFor(() => expect(container.querySelector('div[data-ok="z"]')).not.toBeNull());
		expect(container.textContent).toContain("text");
	});

	test("attributes that are not a record at all leave the element bare", async () => {
		const { container, editor } = await renderWithEditor();
		const state = JSON.parse(stateHolding("div", {}, "text")) as {
			root: { children: { children: { attributes: unknown }[] }[] };
		};

		// A state file is only the shape it claims to be. `Object.entries` throws on `null`, so
		// this is the case that would take the document down on open.
		state.root.children[0]!.children[0]!.attributes = null;

		editor.setEditorState(editor.parseEditorState(JSON.stringify(state)));

		await waitFor(() => expect(container.textContent).toContain("text"));
	});
});
