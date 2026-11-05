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

import type { RefObject } from "react";
import { render, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";

import type { MarkdownEditorHandle, MarkdownEditorMode } from "../../main/markdown-editor.api.js";
import {
	ControlledEditor,
	copyFromSurface,
	getSurfaceByMode,
	lastEmittedMarkdown,
	pasteClipboardIntoSurface,
	pasteHtmlIntoSurface,
	pasteTextIntoSurface
} from "../utils/index.js";

/**
 * A document with one of each thing the clipboard has to carry: every inline mark,
 * both kinds of list, a task list, a table, a quote, a fenced code block, a rule, a link and an image.
 *
 * Kept deliberately broad. The source-mode copy test compares against it character for character,
 * so anything the editor mangles on the way through shows up there.
 */
const RICH_DOCUMENT = [
	"## Title",
	"",
	"Some **bold** and *italic* and `code` and ~~struck~~ text.",
	"",
	"### Details",
	"",
	"> A quote,",
	"> over two lines.",
	"",
	"- one",
	"- two",
	"  - nested under two",
	"    - nested twice",
	"- three",
	"",
	"1. first",
	"2. second",
	"   1. nested number",
	"",
	"- [x] done",
	"- [ ] still to do",
	"  - [ ] a nested task",
	"",
	"> A quote holding a list:",
	">",
	"> - inside the quote",
	"> - also inside",
	"",
	"- a list item holding a code block:",
	"",
	"  ```js",
	"  const inList = true;",
	"  ```",
	"",
	"| Feature | Supported |",
	"| ------- | --------- |",
	"| Tables  | Yes       |",
	"",
	"```ts",
	"const answer = 42;",
	"```",
	"",
	"---",
	"",
	"See [the docs](https://example.com) and ![a picture](https://example.com/cat.png).",
	""
].join("\n");

/** An empty editor plus the spy the pasted markdown comes back through. */
function renderForPaste(mode: MarkdownEditorMode): {
	surface: HTMLElement;
	onChange: ReturnType<typeof vi.fn>;
} {
	const onChange = vi.fn();
	const { container } = render(<ControlledEditor initialMode={mode} onChange={onChange} />);

	return { surface: getSurfaceByMode(container, mode), onChange };
}

/**
 * An editor holding {@link RICH_DOCUMENT}, and a `copy` that selects everything
 * and hands back what the editor wrote onto the clipboard.
 *
 * The document has to be on screen before copying — `copy` waits for it, so no test has to.
 */
function renderForCopy(mode: MarkdownEditorMode): { copyWholeDocument: () => Promise<DataTransfer> } {
	const handleRef = { current: null } as RefObject<MarkdownEditorHandle | null>;
	const { container } = render(
		<ControlledEditor initialValue={RICH_DOCUMENT} initialMode={mode} editorRef={handleRef} />
	);
	const surface = getSurfaceByMode(container, mode);

	return {
		copyWholeDocument: async () => {
			await waitFor(() => expect(surface.textContent).toContain("Title"));

			return copyFromSurface(surface, handleRef.current);
		}
	};
}

/*
 * The rich surface. Content lives as Lexical nodes and the markdown comes from serializing them,
 * so everything the clipboard does here goes through that conversion.
 */
describe("MarkdownEditor — clipboard in edit mode", () => {
	/*
	 * Formatted text copied out of a browser or a word processor arrives as `text/html`.
	 * Lexical builds nodes from it and those serialize like anything typed by hand,
	 * so what the host receives is the interesting part, not the DOM.
	 */
	describe("pasting in", () => {
		test("bold and italic arrive as markdown emphasis", async () => {
			const { surface, onChange } = renderForPaste("edit");

			await pasteHtmlIntoSurface(surface, "<p><b>bold</b> and <i>italic</i></p>", "bold and italic");
			await waitFor(() => expect(surface.textContent).toContain("bold"));

			const markdown = await lastEmittedMarkdown(onChange);

			expect(markdown).toContain("**bold**");
			expect(markdown).toContain("*italic*");
		});

		test("a list arrives as a markdown list", async () => {
			const { surface, onChange } = renderForPaste("edit");

			await pasteHtmlIntoSurface(surface, "<ul><li>one</li><li>two</li></ul>", "one\ntwo");
			await waitFor(() => expect(surface.textContent).toContain("one"));

			const markdown = await lastEmittedMarkdown(onChange);

			expect(markdown).toContain("- one");
			expect(markdown).toContain("- two");
		});

		test("a heading arrives as a markdown heading", async () => {
			const { surface, onChange } = renderForPaste("edit");

			await pasteHtmlIntoSurface(surface, "<h2>Title</h2>", "Title");
			await waitFor(() => expect(surface.textContent).toContain("Title"));

			expect(await lastEmittedMarkdown(onChange)).toContain("## Title");
		});

		test("a link arrives as markdown link syntax", async () => {
			const { surface, onChange } = renderForPaste("edit");

			await pasteHtmlIntoSurface(surface, '<p>see <a href="https://example.com">the docs</a></p>', "see the docs");
			await waitFor(() => expect(surface.textContent).toContain("the docs"));

			expect(await lastEmittedMarkdown(onChange)).toContain("[the docs](https://example.com)");
		});

		test("strikethrough arrives as markdown strikethrough", async () => {
			const { surface, onChange } = renderForPaste("edit");

			await pasteHtmlIntoSurface(surface, "<p><s>gone</s></p>", "gone");
			await waitFor(() => expect(surface.textContent).toContain("gone"));

			expect(await lastEmittedMarkdown(onChange)).toContain("~~gone~~");
		});

		test("inline code arrives as markdown inline code", async () => {
			const { surface, onChange } = renderForPaste("edit");

			await pasteHtmlIntoSurface(surface, "<p>run <code>build</code> first</p>", "run build first");
			await waitFor(() => expect(surface.textContent).toContain("build"));

			expect(await lastEmittedMarkdown(onChange)).toContain("`build`");
		});

		test("a quote arrives as a markdown quote", async () => {
			const { surface, onChange } = renderForPaste("edit");

			await pasteHtmlIntoSurface(surface, "<blockquote><p>quoted</p></blockquote>", "quoted");
			await waitFor(() => expect(surface.textContent).toContain("quoted"));

			expect(await lastEmittedMarkdown(onChange)).toContain("> quoted");
		});

		test("a numbered list arrives as a markdown numbered list", async () => {
			const { surface, onChange } = renderForPaste("edit");

			await pasteHtmlIntoSurface(surface, "<ol><li>first</li><li>second</li></ol>", "first\nsecond");
			await waitFor(() => expect(surface.textContent).toContain("first"));

			const markdown = await lastEmittedMarkdown(onChange);

			expect(markdown).toContain("1. first");
			expect(markdown).toContain("2. second");
		});

		/*
		 * A paste into a document that already has text has to keep that text.
		 * Everything above pastes into an empty editor, so on its own it would not catch a paste
		 * that wipes the document instead of adding to it.
		 */
		test("text already in the editor is kept", async () => {
			const onChange = vi.fn();
			const { container } = render(<ControlledEditor initialValue="Kept." onChange={onChange} />);
			const surface = getSurfaceByMode(container, "edit");

			await waitFor(() => expect(surface.textContent).toContain("Kept."));
			await pasteHtmlIntoSurface(surface, "<p><b>added</b></p>", "added");
			await waitFor(() => expect(surface.textContent).toContain("added"));

			const markdown = await lastEmittedMarkdown(onChange);

			expect(markdown).toContain("Kept.");
			expect(markdown).toContain("**added**");
		});

		/*
		 * Markdown copied from a file, a terminal or a GitHub comment box arrives as plain text
		 * with no `text/html` next to it. Edit mode has no markdown-on-paste step,
		 * so every marker is read as literal text and escaped on the way back out
		 * and each newline starts its own paragraph. Pinned as it is today, not as it should be.
		 */
		test("plain markdown is escaped, not parsed", async () => {
			const { surface, onChange } = renderForPaste("edit");

			await pasteTextIntoSurface(
				surface,
				"## Title\n\nSome **bold** and a [link](https://example.com).\n\n- one\n- two"
			);
			await waitFor(() => expect(surface.textContent).toContain("Title"));

			expect(await lastEmittedMarkdown(onChange)).toBe(
				"\\## Title\n\n\n\nSome \\*\\*bold\\*\\* and a \\[link]\\(https\\://example.com).\n\n\n\n\\- one\n\n\\- two"
			);
		});
	});

	/*
	 * One copy writes three formats, and each is read by a different kind of target:
	 * a word processor takes `text/html`, another Lexical editor takes its own payload
	 * and everything else — a terminal, a code editor, a GitHub comment box — takes `text/plain`.
	 */
	describe("copying out", () => {
		test("the html carries the formatting", async () => {
			const html = (await renderForCopy("edit").copyWholeDocument()).getData("text/html");

			expect(html).toContain("<h2");
			expect(html).toContain("<strong");
			expect(html).toContain("<em");
			expect(html).toContain("<ul");
			expect(html).toContain('href="https://example.com"');
		});

		test("the lexical payload is there, so a paste back keeps everything", async () => {
			const clipboardData = await renderForCopy("edit").copyWholeDocument();

			expect(clipboardData.getData("application/x-lexical-editor")).not.toBe("");
		});

		/*
		 * The whole point of the three formats: copy out of the editor and paste straight back in,
		 * and nothing is lost. The paste takes the Lexical payload, so it never goes near the
		 * plain-text half that drops the formatting.
		 */
		test("a copy pasted back into edit mode keeps the formatting", async () => {
			const clipboardData = await renderForCopy("edit").copyWholeDocument();

			const onChange = vi.fn();
			const { container } = render(<ControlledEditor onChange={onChange} />);
			const target = getSurfaceByMode(container, "edit");

			await pasteClipboardIntoSurface(target, clipboardData);
			await waitFor(() => expect(target.textContent).toContain("Title"));

			const markdown = await lastEmittedMarkdown(onChange);

			expect(markdown).toContain("## Title");
			expect(markdown).toContain("### Details");
			expect(markdown).toContain("**bold**");
			expect(markdown).toContain("*italic*");
			expect(markdown).toContain("`code`");
			expect(markdown).toContain("~~struck~~");
			expect(markdown).toContain("> A quote,");
			expect(markdown).toContain("- one");
			expect(markdown).toContain("  - nested under two");
			expect(markdown).toContain("    - nested twice");
			expect(markdown).toContain("1. first");
			expect(markdown).toContain("   1. nested number");
			expect(markdown).toContain("- [x] done");
			expect(markdown).toContain("  - [ ] a nested task");
			expect(markdown).toContain("> - inside the quote");
			expect(markdown).toContain("  const inList = true;");
			expect(markdown).toContain("| Feature | Supported |");
			expect(markdown).toContain("const answer = 42;");
			expect(markdown).toContain("[the docs](https://example.com)");
			expect(markdown).toContain("![a picture](https://example.com/cat.png)");
		});

		/*
		 * The plain-text half is the rendered text, not the markdown behind it. So pasting out of
		 * edit mode into anything that only reads plain text loses the formatting:
		 * the heading, the emphasis, the bullets and the link target all go.
		 *
		 * Pinned as it is today. A markdown editor arguably ought to put markdown here.
		 */
		test("the plain text is the rendered text, with the markdown stripped", async () => {
			const plain = (await renderForCopy("edit").copyWholeDocument()).getData("text/plain");

			// The words survive.
			expect(plain).toContain("Title");
			expect(plain).toContain("bold");
			expect(plain).toContain("the docs");

			// Everything that made them markdown does not.
			expect(plain).not.toContain("## ");
			expect(plain).not.toContain("**");
			expect(plain).not.toContain("~~");
			expect(plain).not.toContain("> ");
			expect(plain).not.toContain("- ");
			expect(plain).not.toContain("| ");
			expect(plain).not.toContain("```");
			expect(plain).not.toContain("https://example.com");
		});
	});
});

/*
 * The raw surface. Content is the markdown text itself, so the clipboard moves characters
 * rather than nodes and nothing is converted in either direction.
 */
describe("MarkdownEditor — clipboard in source mode", () => {
	describe("pasting in", () => {
		/*
		 * Source mode is raw text, so a paste has to arrive character for character: the blank
		 * lines, the tab and the newline at the end all survive.
		 */
		test("multi-line plain text keeps every character", async () => {
			const { surface, onChange } = renderForPaste("source");
			const pasted = "# A\n\n- one\n\ttab\n\nend\n";

			await pasteTextIntoSurface(surface, pasted);
			await waitFor(() => expect(surface.textContent).toContain("end"));

			expect(await lastEmittedMarkdown(onChange)).toBe(pasted);
		});

		test("the clipboard's plain half is what lands, not the html", async () => {
			// Source mode holds raw markdown, so pasted HTML has no meaning there.
			const { surface, onChange } = renderForPaste("source");

			await pasteHtmlIntoSurface(surface, "<p><b>bold</b></p>", "**bold**");
			await waitFor(() => expect(surface.textContent).toContain("**bold**"));

			expect(await lastEmittedMarkdown(onChange)).toContain("**bold**");
		});

		/*
		 * A clipboard carrying `text/html` and an empty plain half. Source mode only reads the
		 * plain one, so there is nothing to take and the surface stays empty. Real clipboards
		 * always carry the text as well, so this is the edge rather than the common case.
		 */
		test("html with an empty plain half lands as nothing", async () => {
			const { surface } = renderForPaste("source");

			await pasteHtmlIntoSurface(surface, "<h2>Title</h2><p><b>bold</b></p>", "");

			expect(surface.textContent).toBe("");
		});
	});

	describe("copying out", () => {
		test("the plain text is the markdown, character for character", async () => {
			const plain = (await renderForCopy("source").copyWholeDocument()).getData("text/plain");

			expect(plain).toBe(RICH_DOCUMENT);
		});

		/*
		 * The html half is the highlighted source, one span per token. A word processor reads that
		 * half first, so pasting source-mode text into one gives the markers as visible text
		 * rather than formatting — which is what source mode is showing, so it matches.
		 */
		test("the html is the highlighted source, not rendered markdown", async () => {
			const html = (await renderForCopy("source").copyWholeDocument()).getData("text/html");

			expect(html).toContain("mde-token");
			expect(html).not.toContain("<h2");
			expect(html).not.toContain("<strong");
		});
	});
});

/*
 * Copying in one mode and pasting in the other. Both directions go through the plain-text half
 * of the clipboard, because neither surface can read what the other one writes: source mode
 * has no use for the rich HTML, and edit mode gets no Lexical payload from source mode.
 *
 * Both are pinned as they behave today, not as they should behave.
 */
describe("MarkdownEditor — clipboard between the two modes", () => {
	test("edit to source loses the markdown, because the plain half is the rendered text", async () => {
		const clipboardData = await renderForCopy("edit").copyWholeDocument();

		const onChange = vi.fn();
		const { container } = render(<ControlledEditor initialMode="source" onChange={onChange} />);
		const target = getSurfaceByMode(container, "source");

		await pasteClipboardIntoSurface(target, clipboardData);
		await waitFor(() => expect(target.textContent).toContain("Title"));

		const markdown = await lastEmittedMarkdown(onChange);

		// The heading marks, the emphasis marks, the table and the link address are all gone.
		expect(markdown).not.toContain("## ");
		expect(markdown).not.toContain("**");
		expect(markdown).not.toContain("~~");
		expect(markdown).not.toContain("| Feature | Supported |");
		expect(markdown).not.toContain("https://example.com");
	});

	test("source to edit escapes the markdown, because edit mode reads it as plain characters", async () => {
		const clipboardData = await renderForCopy("source").copyWholeDocument();

		const onChange = vi.fn();
		const { container } = render(<ControlledEditor onChange={onChange} />);
		const target = getSurfaceByMode(container, "edit");

		await pasteClipboardIntoSurface(target, clipboardData);
		await waitFor(() => expect(target.textContent).toContain("Title"));

		// Every marker comes back with a backslash in front of it instead of turning into formatting.
		expect(await lastEmittedMarkdown(onChange)).toContain("\\##");
	});
});
