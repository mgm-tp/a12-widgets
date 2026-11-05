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
import { describe, expect, test } from "vitest";

import { defineMarkdownEditorExtension } from "../../main/extensions.js";
import type { ImageNode } from "../../main/nodes/image-node.js";
import { $isImageNode } from "../../main/nodes/image-node.js";
import { resolveFeatures } from "../../main/optional-features.js";
import { ControlledEditor, getSurfaceByMode } from "../utils/index.js";

/** Parses markdown into a headless editor built from the real root extension, then writes it back. */
/** Everything here is about the `htmlTags` feature, which is off unless a host asks for it. */
const HTML_TAGS_ON = defineMarkdownEditorExtension(resolveFeatures({ htmlTags: true }));

function roundTrip(markdown: string): string {
	const editor = buildEditorFromExtensions(HTML_TAGS_ON);

	editor.update(
		() => {
			$convertFromMarkdownString(markdown);
		},
		{ discrete: true }
	);

	return editor.read(() => $convertToMarkdownString());
}

/** The only picture in the document. */
function $onlyImage(): ImageNode {
	const [image] = $dfs().flatMap(({ node }) => ($isImageNode(node) ? [node] : []));

	expect(image).toBeDefined();

	return image;
}

/**
 * The same trip, with a change made to the picture in between — what the right-click menu's
 * dialog and `setSize` do once the document is open.
 */
function roundTripAfterEditing(markdown: string, $change: (image: ImageNode) => void): string {
	const editor = buildEditorFromExtensions(HTML_TAGS_ON);

	editor.update(
		() => {
			$convertFromMarkdownString(markdown);
		},
		{ discrete: true }
	);

	editor.update(() => $change($onlyImage()), { discrete: true });

	return editor.read(() => $convertToMarkdownString());
}

/** Renders the markdown and hands back the edit surface once it holds `text`. */
async function editSurfaceShowing(markdown: string, text: string): Promise<HTMLElement> {
	const { container } = render(<ControlledEditor initialValue={markdown} features={{ htmlTags: true }} />);
	const surface = getSurfaceByMode(container, "edit");

	await waitFor(() => expect(surface.textContent).toContain(text));

	return surface;
}

describe("MarkdownEditor HTML — what gets built", () => {
	test("an allowed tag becomes the element it names, with its content inside", async () => {
		const surface = await editSurfaceShowing('<div style="background: red">text</div>', "text");
		const built = surface.querySelector<HTMLElement>("div[style]");

		expect(built).not.toBeNull();
		expect(built?.style.backgroundColor).toBe("red");
		expect(built?.textContent).toBe("text");
	});

	test("an inline tag stays inside its sentence", async () => {
		const surface = await editSurfaceShowing('a <span id="x">middle</span> b', "middle");

		expect(surface.querySelector("span#x")?.textContent).toBe("middle");

		// One line, not three: the span did not break the paragraph around it.
		expect(surface.textContent).toContain("a middle b");
	});

	test("markdown written inside an HTML block is still markdown", async () => {
		const surface = await editSurfaceShowing("<div>\n\n# a heading\n\n</div>", "a heading");

		expect(surface.querySelector("div h1")?.textContent).toBe("a heading");
	});

	test("the GitHub details shape works", async () => {
		const surface = await editSurfaceShowing(
			"<details><summary>more</summary>\n\nbody **bold**\n\n</details>",
			"body bold"
		);

		expect(surface.querySelector("details summary")?.textContent).toBe("more");
		expect(surface.querySelector("details strong")?.textContent).toBe("bold");
	});
});

describe("MarkdownEditor HTML — pictures written as HTML", () => {
	/*
	 * `<img>` cannot go through the generic element node: Lexical removes an inline element
	 * with no children, and a void tag has none. So it becomes the `ImageNode` the editor
	 * already has — which draws it, and checks its `src` — while the original tag is kept so
	 * the document is not rewritten as `![](…)` on save.
	 */
	test("an img tag draws a picture", async () => {
		const surface = await editSurfaceShowing('<img src="https://example.com/a.png" alt="a photo">', "");
		const image = surface.querySelector<HTMLImageElement>("img");

		expect(image).not.toBeNull();
		expect(image?.getAttribute("src")).toBe("https://example.com/a.png");
		expect(image?.getAttribute("alt")).toBe("a photo");
	});

	test.each([
		['<img src="https://example.com/a.png" width="200">', "200", null],
		['<img src="https://example.com/a.png" width="200" height="120">', "200", "120"],
		// Browsers honour a percentage, and a zero is a size the author asked for.
		['<img src="https://example.com/a.png" width="50%">', "50%", null],
		['<img src="https://example.com/a.png" width="0">', "0", null],
		// `auto` is not a size at all, so it is left off.
		['<img src="https://example.com/a.png" width="auto">', null, null]
	])("%s draws at the size the tag asks for", async (markdown, width, height) => {
		const surface = await editSurfaceShowing(markdown, "");
		const image = surface.querySelector("img");

		expect(image?.getAttribute("width")).toBe(width);
		expect(image?.getAttribute("height")).toBe(height);
	});

	test.each([
		["a heading", "<h1>heading 1</h1>", "h1"],
		["a paragraph", "<p>a para</p>", "p"],
		["a list", "<ul><li>one</li></ul>", "ul li"],
		["a quote", "<blockquote>quoted</blockquote>", "blockquote"],
		["bold text", "<b>bold</b>", "strong"],
		["a link", '<a href="https://example.com">link</a>', "a[href]"]
	])("%s written as HTML becomes the real thing", async (_name, markdown, selector) => {
		// Markdown owns these, so they go to the node that owns them — the toolbar, the
		// typing shortcuts and the list behaviour all keep working. What each one is written
		// back as is pinned tag by tag in `html-tags.test.tsx`; this is about the element.
		const surface = await editSurfaceShowing(markdown, "");

		expect(surface.querySelector(selector)).not.toBeNull();
	});

	test("a del becomes real strikethrough", () => {
		// GFM writes `~~x~~` as `<del>` — https://github.github.com/gfm/#strikethrough-extension-
		// — so `<del>` is the canonical HTML for it. Nothing in `@lexical/html` reads it that
		// way (its rule matches `s`), so the editor supplies the mapping; without it the tag
		// was dropped outright, and building it as a plain element left the toolbar blind.
		expect(roundTrip("<del>gone</del>")).toBe("~~gone~~");
	});

	test.each([
		["a rule", "<hr>\n\nafter", "hr"],
		["a line break", "a<br>b", "br"]
	])("%s written as HTML draws the real thing", async (_name, markdown, selector) => {
		// Both are void, so neither can be a generic element — Lexical deletes an inline
		// element with no children. They go to the nodes that draw them.
		const surface = await editSurfaceShowing(markdown, "");

		expect(surface.querySelector(selector)).not.toBeNull();
	});

	test.each([
		// A `<br>` keeps its tag. A bare newline would be a soft break, which does not break
		// the line at all, so the tag has to survive rather than settle into markdown.
		["a<br>b", "a<br>b"],
		// A rule has no such problem: every markdown spelling means the same thing, so the
		// tag settles into the one this editor writes.
		["<hr>\n\nafter", "---\n\nafter"],
		// The spellings an author typed are left exactly as they were, all of them.
		["---\n\nafter", "---\n\nafter"],
		["***\n\nafter", "***\n\nafter"],
		["___\n\nafter", "___\n\nafter"],
		["a\\\nb", "a\\\nb"],
		["a  \nb", "a  \nb"]
	])("%s keeps the meaning, and stays put on the next save", (markdown, written) => {
		expect(roundTrip(markdown)).toBe(written);
		expect(roundTrip(written)).toBe(written);
	});

	test("the tag is written back as it was, attributes and all", () => {
		const markdown = '<img src="https://example.com/a.png" width="200">';

		expect(roundTrip(markdown)).toBe(markdown);
	});

	test("a picture written as markdown still comes back as markdown", () => {
		const markdown = "![alt](https://example.com/a.png)";

		expect(roundTrip(markdown)).toBe(markdown);
	});

	/*
	 * The tag is kept so a document is not rewritten, but it is not the record any more —
	 * the node is. The right-click menu's dialog and `setSize` change the node, so writing
	 * the tag back as it arrived would throw every one of those changes away: a new address
	 * typed into the dialog would be gone the moment the document was saved.
	 */
	test("a new address typed into the dialog reaches the tag", () => {
		const written = roundTripAfterEditing('<img src="https://example.com/a.png" alt="a photo">', (image) =>
			image.updateImage({ src: "https://example.com/b.png", altText: "another photo", title: "a title" })
		);

		expect(written).toBe('<img src="https://example.com/b.png" alt="another photo" title="a title">');
	});

	test("a size set on the node reaches the tag, and clearing it takes the attribute off", () => {
		const markdown = '<img src="https://example.com/a.png" width="200" height="120">';

		expect(roundTripAfterEditing(markdown, (image) => image.setSize(400))).toBe(
			'<img src="https://example.com/a.png" width="400">'
		);
	});

	test("what the editor cannot change is left where it was", () => {
		// Only `src`, `alt`, `title`, `width` and `height` move. A `class` the author wrote
		// stays put, in the place they wrote it.
		const written = roundTripAfterEditing('<img class="hero" src="https://example.com/a.png" id="cover">', (image) =>
			image.updateImage({ src: "https://example.com/b.png" })
		);

		expect(written).toBe('<img class="hero" src="https://example.com/b.png" id="cover">');
	});

	test("an empty alt is kept, because it means the picture is decoration", () => {
		const written = roundTripAfterEditing('<img src="https://example.com/a.png" alt="a photo">', (image) =>
			image.updateImage({ src: "https://example.com/a.png", altText: "" })
		);

		expect(written).toBe('<img src="https://example.com/a.png" alt="">');
	});

	test("an event handler on the tag never reaches the picture", async () => {
		const markdown = '<img src="https://example.com/a.png" onerror="alert(1)">';
		const surface = await editSurfaceShowing(markdown, "");

		// Only `src`, `alt` and `title` reach the node, so there is nothing to fire.
		expect(surface.querySelector("[onerror]")).toBeNull();

		// And the document still holds what the author wrote.
		expect(roundTrip(markdown)).toBe(markdown);
	});

	test("a src the protocol check refuses draws nothing, and is kept as text", async () => {
		const markdown = '<img src="javascript:alert(1)">';
		const surface = await editSurfaceShowing(markdown, "javascript");

		expect(surface.querySelector("img")).toBeNull();
		expect(roundTrip(markdown)).toBe(markdown);
	});
});

describe("MarkdownEditor HTML — what comes back out", () => {
	/*
	 * Writing the same document twice has to produce the same bytes twice. A serializer that
	 * adds a line each time turns every save into a diff, which is what makes HTML in
	 * markdown unusable in a form.
	 */
	test.each([
		["an inline tag", "a <mark>marked</mark> b"],
		["an inline tag with attributes", 'a <span class="x">y</span> b']
	])("%s comes back exactly as written", (_name, markdown) => {
		expect(roundTrip(markdown)).toBe(markdown);
	});

	test.each([
		["a block with inline content", '<div class="note">a note</div>'],
		["a block with markdown inside", "<div>\n\n# a heading\n\n</div>"],
		["the details shape", "<details><summary>more</summary>\n\nbody **bold**\n\n</details>"]
	])("%s settles after one save and then stays put", (_name, markdown) => {
		// A block is re-laid-out once — the blank lines that set the embedded markdown off
		// from the tags are placed by the serializer, not copied from the source. What
		// matters is that it stops there: the second save writes what the first one did.
		const once = roundTrip(markdown);

		expect(roundTrip(once)).toBe(once);
	});

	test("an inline tag's style is written back exactly as the author wrote it", () => {
		// The editor paints none of this: `position` and `url(…)` are both dropped before
		// the screen. The file still says what it said. The cleaning is for what is shown,
		// not for what is stored — a document that loses its styling when it is opened is
		// broken too, only more quietly.
		const markdown = 'a <span style="position:fixed;background:url(https://t.example/p.gif)">x</span> b';

		expect(roundTrip(markdown)).toBe(markdown);
	});

	test("a block's style survives the save, declaration for declaration", () => {
		// A block is written by rendering the element, not from the stored text, so the
		// exact spelling can change, the way it does for any block. What must not happen is
		// a declaration being lost.
		const once = roundTrip(
			'<div style="position: fixed; background-image: url(https://t.example/p.gif)">\n\ntext\n\n</div>'
		);

		expect(once).toContain("position: fixed");
		expect(once).toContain("t.example/p.gif");
		expect(roundTrip(once)).toBe(once);
	});

	test("a class is written back although the editor never paints it", () => {
		// The editor leaves `class` off the element, so the host's own stylesheet cannot be
		// picked up by a document. The file still keeps it: cleaning is for what is shown,
		// the same split as `style`.
		const inline = 'a <span class="note">y</span> b';

		expect(roundTrip(inline)).toBe(inline);

		const block = roundTrip('<div class="note">\n\ntext\n\n</div>');

		expect(block).toContain('class="note"');
		expect(roundTrip(block)).toBe(block);
	});

	test("a tag the editor will not build keeps its text", () => {
		// Not rendered, so it is text — readable, still there, and escaped on the way out
		// the way any `<` in markdown text is. It reads the same and it does not grow on
		// the next save.
		const once = roundTrip('<img src=x alt="a picture">');

		expect(once).toContain("<img");
		expect(once).toContain("a picture");
		expect(roundTrip(once)).toBe(once);
	});

	test.each([
		["a script block", "<script>alert(1)</script>"],
		["a style block", "<style>p{color:red;}</style>"],
		["a pre block", "<pre>\nfoo\n</pre>"],
		["a textarea block", "<textarea>\n\n*foo*\n\n</textarea>"]
	])("%s keeps every character", (_name, markdown) => {
		// CommonMark start condition 1: these hold literal text, and the spec passes them
		// through untouched — https://spec.commonmark.org/0.31.2/#html-blocks. GFM filters
		// `script` and `style` when it renders HTML, by escaping the leading `<`, and leaves
		// the markdown source alone. The source is what this editor produces.
		const once = roundTrip(markdown);

		expect(once).toContain(markdown);
		expect(roundTrip(once)).toBe(once);
	});

	test("a script block is text, never an element", async () => {
		const surface = await editSurfaceShowing("<script>alert(1)</script>\n\nafter", "after");

		expect(surface.querySelector("script")).toBeNull();
		expect(surface.textContent).toContain("alert(1)");
	});

	test("a tag nobody knows is kept exactly, not escaped", () => {
		// Raw HTML "will be rendered in HTML without escaping" and tag names are "not limited
		// to current HTML tags" — https://spec.commonmark.org/0.31.2/#raw-html. A backslash in
		// front of the `<` would stop it being HTML wherever the markdown is read next.
		for (const markdown of ["<a><bab>22<c2c>", "<bab>22</bab>", "<a>22</a>", "<div>22"]) {
			expect(roundTrip(markdown)).toBe(markdown);
		}
	});

	test.each(["edit", "view"] as const)("a comment is invisible in %s mode", async (mode) => {
		// CommonMark passes a comment through to the HTML output, where a browser hides it,
		// so a reader never sees one. Neither should the editor.
		const { container } = render(
			<ControlledEditor
				features={{ htmlTags: true }}
				initialValue={"<!-- reviewers: leave this alone -->\n\nafter"}
				allowedModes={["edit", "view", "source"]}
				initialMode={mode}
			/>
		);
		const surface = getSurfaceByMode(container, mode);

		await waitFor(() => expect(surface.textContent).toContain("after"));

		expect(surface.textContent).not.toContain("reviewers");
	});

	test("a tag the document marked as an mdast placeholder still comes back", () => {
		// `data-mdast-child` is how `MdastHtmlExtension` marks the spot where embedded markdown
		// goes back in. The markers are read off HTML the document supplied, so a document can
		// write one itself — and then the placeholder rule claims the span, finds no child
		// under that number, and returns nothing. The author's tag and its text are gone from
		// the saved file, which is the worst way to lose them: on save, silently.
		const once = roundTrip('a <span data-mdast-child="0">x</span> b');

		expect(once).toContain("x");
		expect(once).toContain("<span");

		// The forged marker itself is not written back — it was never the author's to write.
		expect(once).not.toContain("data-mdast-child");
		expect(roundTrip(once)).toBe(once);
	});

	test("real embedded markdown still goes back where it came from", () => {
		// The other side of the same check: the placeholders the extension writes must still
		// be recognised, or the markdown inside a block would be lost instead.
		const once = roundTrip("<div>\n\n# a heading\n\nand *text*\n\n</div>");

		expect(once).toContain("# a heading");
		expect(once).toContain("*text*");
		expect(once).not.toContain("data-mdast");
		expect(roundTrip(once)).toBe(once);
	});

	test("a comment is kept, rather than quietly dropped", () => {
		// A comment carries instructions for whatever reads the markdown next
		// (`<!-- prettier-ignore -->`), so losing it loses meaning.
		// Invisible is not the same as gone: a comment carries instructions for whatever reads
		// the markdown next, `<!-- prettier-ignore -->` and the like.
		for (const markdown of ["<!-- hidden -->", "a <!-- inline --> b", "<!-- multi\nline -->"]) {
			expect(roundTrip(markdown)).toBe(markdown);
		}
	});
});
