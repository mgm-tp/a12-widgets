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
import type { AnyLexicalExtensionArgument } from "lexical";
import { describe, expect, test } from "vitest";

import { defineMarkdownEditorExtension, markdownEditorExtension } from "../../main/extensions.js";
import { MdastInfoPanelExtension } from "../../main/extras/info-panel/index.js";
import type { MarkdownEditorOptionalFeatures } from "../../main/optional-features.js";
import { resolveFeatures } from "../../main/optional-features.js";
import { INLINE_FORMAT_FEATURES } from "../utils/index.js";

/** The extension for one feature set, built once per set. */
const extensionsByFeatureSet = new Map<string, AnyLexicalExtensionArgument>();

function extensionForFeatures(features: MarkdownEditorOptionalFeatures): AnyLexicalExtensionArgument {
	const key = JSON.stringify(features);
	let extension = extensionsByFeatureSet.get(key);

	if (!extension) {
		extension = defineMarkdownEditorExtension(resolveFeatures(features));
		extensionsByFeatureSet.set(key, extension);
	}

	return extension;
}

/** The root extension plus the opt-in info panels, the way a host registers them. */
const extensionWithInfoPanels = defineMarkdownEditorExtension(undefined, [MdastInfoPanelExtension]);

/** The four inline formats markdown has no syntax for, all turned on. */
/**
 * Parses markdown into a fresh headless editor built from the real root
 * extension, then serializes it straight back.
 *
 * Note the absence of any input-normalization step: a transformer-based path has
 * to re-indent incoming markdown before `$convertFromMarkdownString` or nested
 * lists flatten. micromark parses CommonMark nesting natively, which is what the
 * "author syntax" block below asserts.
 */
function roundTrip(markdown: string, extension: AnyLexicalExtensionArgument = markdownEditorExtension): string {
	const editor = buildEditorFromExtensions(extension);

	editor.update(
		() => {
			$convertFromMarkdownString(markdown);
		},
		{ discrete: true }
	);

	return editor.read(() => $convertToMarkdownString());
}

/** Same, with info panels registered. */
function roundTripWithInfoPanels(markdown: string): string {
	return roundTrip(markdown, extensionWithInfoPanels);
}

/** Same, with the four inline formats turned on. */
function roundTripWithInlineFormats(markdown: string): string {
	return roundTrip(markdown, extensionForFeatures(INLINE_FORMAT_FEATURES));
}

describe("MarkdownEditor markdown round-trip", () => {
	// `panels` marks the cases that need the opt-in info-panel extension.
	const cases: Array<{
		name: string;
		markdown: string;
		contains: string[];
		panels?: boolean;
		formats?: boolean;
	}> = [
		{ name: "heading", markdown: "# Title", contains: ["# Title"] },
		{ name: "deep heading", markdown: "### Sub heading", contains: ["### Sub heading"] },
		{ name: "bold", markdown: "text **bold** here", contains: ["**bold**"] },
		{ name: "italic", markdown: "text *italic* here", contains: ["*italic*"] },
		{ name: "strikethrough", markdown: "a ~~gone~~ b", contains: ["~~gone~~"] },
		{ name: "inline code", markdown: "use `code` now", contains: ["`code`"] },
		{ name: "blockquote", markdown: "> quoted line", contains: ["> quoted line"] },
		{ name: "unordered list", markdown: "- one\n- two", contains: ["- one", "- two"] },
		{ name: "ordered list", markdown: "1. one\n2. two", contains: ["1. one", "2. two"] },
		{ name: "task list", markdown: "- [ ] todo\n- [x] done", contains: ["- [ ] todo", "- [x] done"] },
		{ name: "code fence", markdown: "```js\nconst a = 1;\n```", contains: ["```", "const a = 1;"] },
		{ name: "link", markdown: "see [site](https://example.com)", contains: ["[site](https://example.com)"] },
		{ name: "image", markdown: "![alt](https://example.com/a.png)", contains: ["![alt](https://example.com/a.png)"] },
		{
			name: "image with title",
			markdown: '![alt](https://example.com/a.png "cap")',
			contains: ['![alt](https://example.com/a.png "cap")']
		},
		{ name: "subscript", markdown: "H<sub>2</sub>O", contains: ["<sub>2</sub>"], formats: true },
		{ name: "superscript", markdown: "x<sup>2</sup>", contains: ["<sup>2</sup>"], formats: true },
		{ name: "highlight", markdown: "a <mark>marked</mark> b", contains: ["<mark>marked</mark>"], formats: true },
		{ name: "underline", markdown: "an <u>underlined</u> word", contains: ["<u>underlined</u>"], formats: true },
		{ name: "horizontal rule", markdown: "before\n\n---\n\nafter", contains: ["---"] },
		{ name: "setext heading", markdown: "Title\n=====", contains: ["Title", "====="] },
		{
			name: "autolink literal",
			markdown: "visit https://example.com now",
			contains: ["https://example.com"]
		},
		{
			name: "image reference with definition",
			markdown: "![alt][logo]\n\n[logo]: https://example.com/a.png",
			contains: ["![alt](https://example.com/a.png)"]
		},
		{
			// An unknown directive becomes a placeholder node — see MdastInfoPanelExtension.
			name: "unknown directive survives whole",
			markdown: ":::unknown\nkept content\n:::",
			contains: [":::unknown", "kept content"]
		},
		{
			name: "GFM table",
			markdown: "| A | B |\n| --- | --- |\n| 1 | 2 |",
			contains: ["| A | B |", "| 1 | 2 |"]
		},
		{ name: "info panel", markdown: ":::info\nHeads up.\n:::", contains: [":::info", "Heads up."], panels: true },
		{
			name: "warning panel",
			markdown: ":::warning\nBe careful.\n:::",
			contains: [":::warning", "Be careful."],
			panels: true
		},
		{
			name: "panel with inline formatting",
			markdown: ":::success\nUse **bold** text.\n:::",
			contains: [":::success", "**bold**"],
			panels: true
		},
		{
			name: "panel with multiple paragraphs",
			markdown: ":::note\nFirst paragraph.\n\nSecond paragraph.\n:::",
			contains: [":::note", "First paragraph.", "Second paragraph."],
			panels: true
		},
		{
			// A panel the author has not written in yet. It has to survive the trip, or
			// opening the document would quietly delete a fence they typed.
			name: "empty panel",
			markdown: ":::warning\n:::",
			contains: [":::warning"],
			panels: true
		},
		{
			// Panels nest on three colons at every level — see the enhanced-micromark-directive fork.
			name: "nested panels",
			markdown: ":::info\nOuter content.\n\n:::warning\nNested warning.\n:::\n:::",
			contains: [":::info", ":::warning", "Outer content.", "Nested warning."],
			panels: true
		}
	];

	test.each(cases)("$name round-trips", ({ markdown, contains, panels, formats }) => {
		const rt = panels ? roundTripWithInfoPanels : formats ? roundTripWithInlineFormats : roundTrip;
		const once = rt(markdown);

		for (const token of contains) {
			expect(once).toContain(token);
		}

		// The transform is idempotent: re-parsing the output yields the same markdown.
		expect(rt(once)).toBe(once);
	});

	/**
	 * What a feature switched off does to markdown that already uses it.
	 *
	 * The syntax is not deleted — it is read as plain text. Whether that survives the
	 * trip back depends on the construct: pipes and `:::` are written as they are, but
	 * `~~`, `[` and `<` look like syntax to the serializer, so it escapes them.
	 */
	describe("a feature that is off", () => {
		test("keeps a table as its own text", () => {
			const markdown = "| A | B |\n| --- | --- |\n| 1 | 2 |";

			expect(roundTrip(markdown, extensionForFeatures({ table: false }))).toBe(markdown);
		});

		test("keeps a bare URL as text", () => {
			const markdown = "visit https://example.com now";

			expect(roundTrip(markdown, extensionForFeatures({ autolink: false }))).toBe(markdown);
		});

		test("keeps strikethrough as its own text", () => {
			const markdown = "a ~~gone~~ b";

			expect(roundTrip(markdown, extensionForFeatures({ strikethrough: false }))).toBe(markdown);
		});

		test("keeps the tags of an inline format as HTML, when html is on", () => {
			// `<mark>` is on the allowlist in `html-sanitizer.ts`, so with the highlight
			// feature off the tag is still rendered — as a plain `<mark>` element rather
			// than a text format — and written back as itself.
			const off = extensionForFeatures({ highlight: false, htmlTags: true });
			const markdown = "a <mark>marked</mark> b";

			expect(roundTrip(markdown, off)).toBe(markdown);
		});

		test("escapes the tags of an inline format, when html is off too", () => {
			// With no html support the editor does what markdown does on its own: the tag is
			// text, so it is escaped once and stays that way.
			const off = extensionForFeatures({ highlight: false, htmlTags: false });
			const once = roundTrip("a <mark>marked</mark> b", off);

			expect(once).toBe("a \\<mark>marked\\</mark> b");
			expect(roundTrip(once, off)).toBe(once);
		});

		test("escapes a task marker, which then stays put", () => {
			// `[` could open a link, so the serializer escapes it once the checkbox is
			// no longer a checkbox. It reads the same, and it does not grow on re-save.
			const off = extensionForFeatures({ taskList: false });
			const once = roundTrip("- [x] done", off);

			expect(once).toBe("- \\[x] done");
			expect(roundTrip(once, off)).toBe(once);
		});
	});

	/**
	 * Directives the editor does not recognize round-trip whole: name, attributes,
	 * label and content. They render as a read-only placeholder; the alternative —
	 * unwrapping to plain text — silently rewrote foreign documents (a Docusaurus
	 * `:::tip` lost its fences on the first save).
	 */
	describe("unknown directives are preserved", () => {
		const exact = [
			":::spoiler\nhidden content\n:::",
			':::spoiler{title="Click me"}\nhidden content\n:::',
			"::figure[caption text]",
			'a :abbr[HTML]{title="HyperText"} b',
			":::info\nouter\n\n:::spoiler\nnested unknown\n:::\n:::",
			":::spoiler\ncontains a panel\n\n:::note\nknown inside\n:::\n:::",
			":::unknown-empty\n:::"
		];

		test.each(exact)("%s", (markdown) => {
			const once = roundTripWithInfoPanels(markdown);

			expect(once).toBe(markdown);
			expect(roundTripWithInfoPanels(once)).toBe(markdown);
		});

		// `mdast-util-to-markdown` quotes bare attribute values; the re-quoted form
		// parses back to the same directive, so only the first pass differs.
		test("bare attribute values gain quotes, then stay stable", () => {
			const once = roundTrip(":::youtube[Video]{#id .class url=x}\n:::");

			expect(once).toBe(':::youtube[Video]{#id .class url="x"}\n:::');
			expect(roundTrip(once)).toBe(once);
		});

		// Info panels are opt-in. Left out, a panel name is just another unknown name:
		// it stays a placeholder and the document survives untouched.
		test("a panel name is an unknown directive when the extension is not registered", () => {
			const markdown = ":::info\nHeads up.\n:::";

			expect(roundTrip(markdown)).toBe(markdown);
			expect(roundTrip(roundTrip(markdown))).toBe(markdown);
		});
	});

	/**
	 * Constructs nest and compose: panels hold tables, lists, fences, images and
	 * custom inline formats; tables hold directives; directives hold each other,
	 * known or not. Some syntax normalizes (noted per case) but nothing is lost,
	 * and every output is idempotent.
	 */
	describe("nesting and composition", () => {
		const exact = [
			":::note\n- item one\n- item two\n\n```js\nconst a = 1;\n```\n:::",
			":::info\nlevel one\n\n:::warning\nlevel two\n\n:::error\nlevel three\n:::\n:::\n:::",
			":::info\n::figure[caption]\n:::"
		];

		test.each(exact)("%s", (markdown) => {
			const once = roundTripWithInfoPanels(markdown);

			expect(once).toBe(markdown);
			expect(roundTripWithInfoPanels(once)).toBe(markdown);
		});

		// Colons inside a code fence are code, so the fence that follows still closes
		// the panel it belongs to.
		test("a code fence inside a panel may hold colons", () => {
			const markdown = ":::info\n```md\n:::warning\n```\n:::";
			const once = roundTripWithInfoPanels(markdown);

			expect(once).toBe(markdown);
			expect(roundTripWithInfoPanels(once)).toBe(markdown);
		});

		// Other tools nest by widening the outer fence. Four colons is not a fence here,
		// so those lines are text — and text that looks like markup gets a backslash so
		// it stays text.
		test("a widened outer fence is text, not a panel", () => {
			const markdown = "::::info\nouter\n\n:::warning\ninner\n:::\n\nfooter\n::::";
			const once = roundTripWithInfoPanels(markdown);

			expect(once).toBe("\\::::info\nouter\n\n:::warning\ninner\n:::\n\nfooter\n\\::::");
			expect(roundTripWithInfoPanels(once)).toBe(once);
		});

		// Closing is last in, first out: the lone fence ends the panel that opened last,
		// and the one still open holds the rest of the document. Writing it back gives it
		// the fence it never had.
		test("an unclosed outer panel holds the rest of the document", () => {
			const markdown = ":::info\nouter\n\n:::warning\ninner\n:::\n\nfooter";
			const once = roundTripWithInfoPanels(markdown);

			expect(once).toBe(":::info\nouter\n\n:::warning\ninner\n:::\n\nfooter\n:::");
			expect(roundTripWithInfoPanels(once)).toBe(once);
		});

		// The table delimiter row is written spec-minimally — the documented
		// normalization — inside known panels and unknown directives alike.
		test.each([
			[":::info\n| A | B |\n| --- | --- |\n| 1 | 2 |\n:::", ":::info\n| A | B |\n| - | - |\n| 1 | 2 |\n:::"],
			[":::spoiler\n| A | B |\n| --- | --- |\n| 1 | 2 |\n:::", ":::spoiler\n| A | B |\n| - | - |\n| 1 | 2 |\n:::"]
		])("table inside a directive normalizes its delimiter row", (markdown, expected) => {
			const once = roundTripWithInfoPanels(markdown);

			expect(once).toBe(expected);
			expect(roundTripWithInfoPanels(once)).toBe(expected);
		});
	});

	/**
	 * The reason this editor exists. The transformer path re-indents every nested
	 * list to Lexical's four-space-per-level form and normalizes list markers;
	 * mdast carries the author's original syntax through untouched.
	 */
	describe("author syntax is preserved verbatim", () => {
		const verbatim: Array<{ name: string; markdown: string }> = [
			{ name: "2-space nested unordered list", markdown: "- one\n  - nested a\n  - nested b\n- two" },
			{ name: "3-space nested ordered list", markdown: "1. one\n   1. nested a\n   2. nested b\n2. two" },
			{ name: "three levels at 2-space steps", markdown: "- a\n  - b\n    - c" },
			{ name: "ordered list nested under a bullet", markdown: "- one\n  1. nested a\n  2. nested b" },
			{ name: "asterisk bullets", markdown: "* one\n* two" },
			{ name: "plus bullets", markdown: "+ one\n+ two" },
			{ name: "paren-delimited ordered list", markdown: "1) one\n2) two" }
		];

		test.each(verbatim)("$name", ({ markdown }) => {
			expect(roundTrip(markdown)).toBe(markdown);
		});
	});

	/**
	 * A blockquote holds blocks, not just a run of inline text.
	 *
	 * The markdown survived either way — a list or a fence inside `> ` was already
	 * imported as its own block. What `MdastShadowRootQuoteExtension` changes is the
	 * tree: a quote with two paragraphs used to be one quote holding a line break
	 * between the two texts, so Enter inside it broke the line instead of starting a
	 * paragraph. Now the quote is a shadow root holding real paragraphs, the way a
	 * table cell does.
	 */
	describe("a blockquote holds blocks", () => {
		const quotes: Array<{ name: string; markdown: string }> = [
			{ name: "two paragraphs", markdown: "> one\n>\n> two" },
			{ name: "a bullet list", markdown: "> - a\n> - b" },
			{ name: "an ordered list", markdown: "> 1. a\n> 2. b" },
			{ name: "a task list", markdown: "> - [ ] todo\n> - [x] done" },
			{ name: "a code fence", markdown: "> ```js\n> const a = 1;\n> ```" },
			{ name: "a nested quote", markdown: "> outer\n>\n> > inner" },
			{ name: "a heading and a paragraph", markdown: "> # Title\n>\n> body" },
			{ name: "a table", markdown: "> | a | b |\n> | - | - |\n> | 1 | 2 |" },
			{ name: "a thematic break between paragraphs", markdown: "> one\n>\n> ---\n>\n> two" }
		];

		test.each(quotes)("$name", ({ markdown }) => {
			const once = roundTrip(markdown);

			expect(once).toBe(markdown);
			expect(roundTrip(once)).toBe(markdown);
		});
	});

	/**
	 * Constructs that the retired `@lexical/markdown` transformer path got wrong
	 * upstream, kept as regression cases now that the transformer study
	 * (`upstream-issues.test.tsx`) is gone with the dependency it documented.
	 *
	 * Each names the upstream Lexical issue it stands in for.
	 */
	describe("constructs the transformer path handled incorrectly upstream", () => {
		const regressions: Array<{ name: string; markdown: string }> = [
			{ name: "#7407 blockquote containing a heading", markdown: "> # Quoted heading" },
			{ name: "#5646 heading whose text starts with `1.`", markdown: "# 1. Not a list" },
			{ name: "#7033 nested ordered list", markdown: "1. one\n   1. nested a\n   2. nested b" },
			{ name: "#6305 document ending in a code block", markdown: "text\n\n```js\nconst a = 1;\n```" },
			{ name: "#2213 2-space nested list is not re-indented", markdown: "- a\n  - a1\n  - a2\n- b" }
		];

		test.each(regressions)("$name", ({ markdown }) => {
			expect(roundTrip(markdown)).toBe(markdown);
		});
	});

	test("a panel holding an image and two inline formats keeps all three", () => {
		const markdown = ":::success\nSee ![alt](https://e.com/a.png) and H<sub>2</sub>O and <mark>marked</mark>.\n:::";
		const extension = defineMarkdownEditorExtension(resolveFeatures(INLINE_FORMAT_FEATURES), [MdastInfoPanelExtension]);
		const once = roundTrip(markdown, extension);

		expect(once).toBe(markdown);
		expect(roundTrip(once, extension)).toBe(markdown);
	});

	/**
	 * The inline formats with no markdown syntax, asserted as **exact** output.
	 *
	 * `contains` is not enough here: `mdast-util-to-markdown` escapes characters
	 * that could open a construct, so a broken serializer emits `\<mark>marked\</mark>`
	 * — which still *contains* the run and would pass a substring assertion.
	 */
	describe("inline formats serialize unescaped", () => {
		const exact = [
			"H<sub>2</sub>O",
			"x<sup>2</sup>",
			"a <mark>marked</mark> b",
			// Underline had no serialized form at all before `<u>`: the format bit
			// fell through to the core text handler and the emphasis was dropped.
			"an <u>underlined</u> word",
			"H<sub>2</sub>O and <mark>note</mark> and x<sup>2</sup> and <u>underline</u>",
			// The formats these tags stand for are parsed, not pattern-matched on the
			// imported text, so the run keeps whatever markdown sits inside it.
			"a <mark>*marked*</mark> b",
			"H<sub>**2**</sub>O",
			"a <mark>`code`</mark> b",
			"a <mark>~~gone~~</mark> b",
			"<mark>a *b* c</mark>",
			"a <u>*x*</u> b"
		];

		test.each(exact)("%s", (markdown) => {
			const once = roundTripWithInlineFormats(markdown);

			expect(once).toBe(markdown);
			expect(once).not.toContain("\\");
		});
	});
});
