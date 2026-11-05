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

import { buildEditorFromExtensions } from "@lexical/extension";
import { $convertFromMarkdownString, $convertToMarkdownString } from "@lexical/mdast";
import { $dfs } from "@lexical/utils";
import { render, waitFor } from "test-utils";
import { afterEach, describe, expect, test, vi } from "vitest";

import { defineMarkdownEditorExtension } from "../../main/extensions.js";
import { $isImageNode } from "../../main/nodes/image-node.js";
import { resolveFeatures } from "../../main/optional-features.js";
import { ControlledEditor, pasteHtmlIntoSurface, getSurfaceByMode } from "../utils/index.js";

/**
 * Raised by any payload below that manages to run. Every case checks it stayed
 * untouched, so a script executing fails the test instead of passing quietly.
 */
declare global {
	// eslint-disable-next-line no-var
	var markdownEditorXssFlag: boolean | undefined;
}

afterEach(() => {
	globalThis.markdownEditorXssFlag = undefined;
});

/** The payload every case tries to get executed. */
const RAISE_THE_FLAG = "globalThis.markdownEditorXssFlag = true";

/** Nothing ran, and nothing that could run is in the document. */
function expectNoScriptRan(container: HTMLElement): void {
	expect(globalThis.markdownEditorXssFlag).toBeUndefined();
	expect(container.querySelector("script")).toBeNull();
}

describe("MarkdownEditor XSS safety — a hostile value", () => {
	/*
	 * Markdown allows inline HTML, so a hostile `value` is the cheapest attack there is:
	 * anything that reaches a document field arrives here as-is. This file only asks
	 * whether it ran. What it looks like afterwards is the sanitization suite's question.
	 */
	test("a script tag in the markdown never runs", async () => {
		const { container } = render(
			<ControlledEditor
				features={{ htmlTags: true }}
				initialValue={`before\n\n<script>${RAISE_THE_FLAG}</script>\n\nafter`}
			/>
		);
		const surface = getSurfaceByMode(container, "edit");

		// Wait for the document to load, so the check is not just early.
		await waitFor(() => expect(surface.textContent).toContain("before"));

		expectNoScriptRan(container);
	});

	test("an onerror image in the markdown never fires", async () => {
		const { container } = render(
			<ControlledEditor features={{ htmlTags: true }} initialValue={`<img src=x onerror="${RAISE_THE_FLAG}">`} />
		);
		// An `<img>` written as HTML draws a picture, the same as `![](…)` does, so the
		// picture itself is what has to be checked rather than the absence of one.
		const image = await waitFor(() => {
			const found = container.querySelector("img");

			expect(found).not.toBeNull();

			return found as HTMLImageElement;
		});

		expectNoScriptRan(container);

		// Only `src`, `alt` and `title` are carried over to the picture, so `onerror` has
		// nothing to sit on — the browser fires it at a handler that was never attached.
		expect(image.hasAttribute("onerror")).toBe(false);
		expect(container.querySelector("[onerror]")).toBeNull();
	});

	test("an inline click handler in the markdown never fires", async () => {
		const { container } = render(
			<ControlledEditor
				features={{ htmlTags: true }}
				initialValue={`<div onclick="${RAISE_THE_FLAG}">click me</div>`}
			/>
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("click me"));

		expectNoScriptRan(container);
		expect(container.querySelector("[onclick]")).toBeNull();
	});

	test("a javascript: link in the markdown never becomes a live anchor", async () => {
		// A link cannot be refused on the way in — rewriting the host's markdown would
		// report an edit nobody made. So the guarantee is that it renders unclickable.
		const { container } = render(
			<ControlledEditor
				features={{ htmlTags: true }}
				initialValue={`[safe](https://example.com) [bad](javascript:${RAISE_THE_FLAG})`}
			/>
		);
		const surface = getSurfaceByMode(container, "edit");

		await waitFor(() => expect(surface.textContent).toContain("bad"));

		// The control: links really do render as anchors here, so the absence below means
		// the scheme was refused rather than links being ignored.
		expect(container.querySelector('a[href="https://example.com"]')).not.toBeNull();
		expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
	});

	test("a script tag in the source surface never runs either", async () => {
		// Source mode shows the raw markdown, so the payload is on screen character for
		// character — the case where an unescaped render would execute.
		const { container } = render(
			<ControlledEditor initialMode="source" initialValue={`<script>${RAISE_THE_FLAG}</script>`} />
		);
		const surface = getSurfaceByMode(container, "source");

		await waitFor(() => expect(surface.textContent).toContain("script"));

		expectNoScriptRan(container);
	});
});

describe("MarkdownEditor XSS safety — a hostile paste", () => {
	/*
	 * A paste skips the markdown parser: Lexical builds nodes from the pasted DOM. So the
	 * guarantee has to be proven again here — a safe `value` says nothing about a paste.
	 */
	test("a pasted script tag never runs", async () => {
		const { container } = render(<ControlledEditor />);
		const surface = getSurfaceByMode(container, "edit");

		await pasteHtmlIntoSurface(surface, `<p>safe</p><script>${RAISE_THE_FLAG}</script>`, "safe");

		// The paste landing proves the payload was really processed.
		await waitFor(() => expect(surface.textContent).toContain("safe"));

		expectNoScriptRan(container);
	});

	test("a pasted onerror image never fires", async () => {
		const { container } = render(<ControlledEditor />);
		const surface = getSurfaceByMode(container, "edit");

		await pasteHtmlIntoSurface(surface, `<p>text <img src="x" onerror="${RAISE_THE_FLAG}"> more</p>`, "text more");

		await waitFor(() => expect(surface.textContent).toContain("text"));

		expectNoScriptRan(container);
		expect(container.querySelector("[onerror]")).toBeNull();
	});

	test("a pasted javascript: link is not clickable", async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor onChange={onChange} />);
		const surface = getSurfaceByMode(container, "edit");

		await pasteHtmlIntoSurface(surface, `<a href="javascript:${RAISE_THE_FLAG}">click</a>`, "click");

		await waitFor(() => expect(surface.textContent).toContain("click"));

		// The text arrives, so the anchor was processed rather than the paste dropped.
		// What must not exist is an anchor that runs the payload on click.
		expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
		expect(globalThis.markdownEditorXssFlag).toBeUndefined();

		// The control: a pasted link the policy takes does become an anchor, so the
		// absence above is the scheme being refused, not paste dropping every link.
		await pasteHtmlIntoSurface(surface, '<a href="https://example.com">ok</a>', "ok");
		await waitFor(() => expect(container.querySelector('a[href="https://example.com"]')).not.toBeNull());
	});

	test("a pasted iframe does not become a frame", async () => {
		const { container } = render(<ControlledEditor />);
		const surface = getSurfaceByMode(container, "edit");

		await pasteHtmlIntoSurface(surface, '<p>after</p><iframe src="https://evil.example.com"></iframe>', "after");

		await waitFor(() => expect(surface.textContent).toContain("after"));

		// A frame would load a third-party page inside the editor. No node claims
		// `<iframe>`, so it has nothing to become — worth pinning all the same.
		expect(container.querySelector("iframe")).toBeNull();
	});
});

/**
 * Writing a picture back is the one place the editor rebuilds a tag rather than reading one.
 *
 * It used to get the attributes by parsing the stored tag, and the only thing keeping that
 * safe was the `<template>` it parsed into: the same two lines against a `<div>` run the
 * payload, because a detached `<div>` still belongs to the live document. The attributes are
 * held as data now, so there is no parse to get wrong — and this is the test that says so.
 */
describe("MarkdownEditor XSS safety — writing a picture back", () => {
	/** Parses markdown into a headless editor built from the real root extension, then writes it back. */
	function roundTrip(markdown: string): string {
		const editor = buildEditorFromExtensions(defineMarkdownEditorExtension(resolveFeatures({ htmlTags: true })));

		editor.update(
			() => {
				$convertFromMarkdownString(markdown);
			},
			{ discrete: true }
		);

		return editor.read(() => $convertToMarkdownString());
	}

	test("an image whose tag carries an event handler runs nothing on the way out", () => {
		const written = roundTrip(`<img src="https://example.com/a.png" onerror="${RAISE_THE_FLAG}">`);

		expect(globalThis.markdownEditorXssFlag).toBeUndefined();

		// The handler is still written back — an attribute the editor cannot change is left
		// where it was, and markdown passes raw HTML through. Running it is the part that
		// must never happen.
		expect(written).toContain("onerror=");
	});

	test("an image edited after loading still runs nothing", () => {
		// `updateImage` is what the right-click dialog calls, and it is what makes the export
		// rebuild the tag instead of writing the stored one back.
		const editor = buildEditorFromExtensions(defineMarkdownEditorExtension(resolveFeatures({ htmlTags: true })));

		editor.update(
			() => {
				$convertFromMarkdownString(`<img src="https://example.com/a.png" onerror="${RAISE_THE_FLAG}">`);
			},
			{ discrete: true }
		);

		editor.update(
			() => {
				const [image] = $dfs()
					.map(({ node }) => node)
					.filter($isImageNode);

				image!.updateImage({ src: "https://example.com/b.png" });
			},
			{ discrete: true }
		);

		const written = editor.read(() => $convertToMarkdownString());

		expect(globalThis.markdownEditorXssFlag).toBeUndefined();
		expect(written).toContain('src="https://example.com/b.png"');
	});
});
