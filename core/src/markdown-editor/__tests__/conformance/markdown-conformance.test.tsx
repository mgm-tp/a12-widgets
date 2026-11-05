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

import { describe, expect, test } from "vitest";

import { EDITORS, imageDialog, linkDialog, recordParityRow, roundTrip, shortcut, toolbarAction } from "./harness.js";

/**
 * What the editor emits for a representative slice of CommonMark + GFM.
 *
 * Every case asserts the **exact** markdown produced, so a change in
 * serialization shows up as a failing diff rather than silently altering what
 * consumers persist. `recordParityRow` additionally emits a machine-readable row per case
 * for the report aggregator.
 *
 * These were comparison assertions while a second, transformer-based editor
 * shipped alongside this one; with that editor retired the expected strings are
 * the contract itself.
 */
async function runParityCase(
	execute: (editor: (typeof EDITORS)[number]) => Promise<string>,
	row: { category: string; name: string; input: string; note?: string },
	expected: string
): Promise<void> {
	const outputs: Record<string, string> = {};

	for (const editor of EDITORS) {
		outputs[editor.id] = await execute(editor);
	}

	recordParityRow(row, outputs);

	for (const editor of EDITORS) {
		expect(outputs[editor.id], `${editor.id} emitted unexpected markdown`).toBe(expected);
	}
}

const ROUND_TRIP_CASES: Array<{ name: string; markdown: string; expected?: string }> = [
	{ name: "heading h1", markdown: "# Title" },
	{ name: "heading h3", markdown: "### Sub heading" },
	{ name: "bold", markdown: "text **bold** here" },
	{ name: "italic", markdown: "text *italic* here" },
	{ name: "strikethrough", markdown: "a ~~gone~~ b" },
	{ name: "inline code", markdown: "use `code` now" },
	{ name: "highlight", markdown: "a <mark>marked</mark> b" },
	{ name: "blockquote", markdown: "> quoted line" },
	{ name: "unordered list", markdown: "- one\n- two" },
	{ name: "ordered list", markdown: "1. one\n2. two" },
	{ name: "task list", markdown: "- [ ] todo\n- [x] done" },
	{ name: "code fence", markdown: "```js\nconst a = 1;\n```" },
	// A fence with no info string keeps it empty: nothing may guess a language for it.
	{ name: "code fence without a language", markdown: "```\nconst a = 1;\n```" },
	{ name: "link", markdown: "see [site](https://example.com)" },
	{ name: "image", markdown: "![alt](https://example.com/a.png)" },
	{ name: "image with title", markdown: '![alt](https://example.com/a.png "cap")' },
	{ name: "subscript", markdown: "H<sub>2</sub>O" },
	{ name: "superscript", markdown: "x<sup>2</sup>" },
	{ name: "underline", markdown: "an <u>underlined</u> word" },
	// Anything can sit inside one of these: the parser reports the whole run as
	// one token, so the content keeps its own structure.
	{ name: "highlight around italic", markdown: "a <mark>*marked*</mark> b" },
	{ name: "subscript around bold", markdown: "H<sub>**2**</sub>O" },
	{ name: "highlight around a code span", markdown: "a <mark>`code`</mark> b" },
	{ name: "highlight around part of a sentence", markdown: "<mark>a *b* c</mark>" },
	{ name: "horizontal rule", markdown: "before\n\n---\n\nafter" },
	{
		// mdast-util-to-markdown emits the spec-minimal delimiter; no editor
		// preserves the author's table padding.
		name: "GFM table",
		markdown: "| A | B |\n| --- | --- |\n| 1 | 2 |",
		expected: "| A | B |\n| - | - |\n| 1 | 2 |"
	},
	{ name: "nested list", markdown: "- a\n  - a1\n  - a2\n- b" },
	{ name: "mixed doc", markdown: "# H\n\ntext **b** *i*\n\n- x\n- y\n\n> q" },
	{ name: "info panel", markdown: ":::info\nHeads up.\n:::" },
	{ name: "warning panel with formatting", markdown: ":::warning\nUse **bold** here.\n:::" },
	{
		// Panels nest on three colons at every level: the outer fence is not widened.
		name: "nested panels",
		markdown: ":::info\nOuter content.\n\n:::warning\nNested warning.\n:::\n:::"
	}
];

describe("markdown conformance — round-trip", () => {
	test.each(ROUND_TRIP_CASES)("$name", async ({ name, markdown, expected }) => {
		await runParityCase(
			(editor) => roundTrip(editor, markdown),
			{ category: "round-trip", name, input: markdown },
			expected ?? markdown
		);
	});
});

const TOOLBAR_CASES: Array<{ name: string; seed: string; button: string; expected: string }> = [
	{ name: "bold", seed: "word", button: "bold", expected: "**word**" },
	{ name: "italic", seed: "word", button: "italic", expected: "*word*" },
	{ name: "strikethrough", seed: "word", button: "strikethrough", expected: "~~word~~" },
	{ name: "underline", seed: "word", button: "underline", expected: "<u>word</u>" },
	{ name: "inline code", seed: "word", button: "code", expected: "`word`" },
	{ name: "highlight", seed: "word", button: "highlight", expected: "<mark>word</mark>" },
	{ name: "subscript", seed: "word", button: "subscript", expected: "<sub>word</sub>" },
	{ name: "superscript", seed: "word", button: "superscript", expected: "<sup>word</sup>" },
	{ name: "bullet list", seed: "item", button: "bulletList", expected: "- item" },
	{ name: "ordered list", seed: "item", button: "orderedList", expected: "1. item" },
	{ name: "task list", seed: "item", button: "taskList", expected: "- [ ] item" },
	{ name: "blockquote", seed: "quote", button: "blockquote", expected: "> quote" },
	{
		// The rule is inserted before the seed paragraph, which leaves the leading
		// blank line the serializer emits for a document-initial thematic break.
		name: "horizontal rule",
		seed: "line",
		button: "horizontalRule",
		expected: "\n\n---\n\nline"
	}
];

describe("markdown conformance — toolbar actions", () => {
	test.each(TOOLBAR_CASES)("$name", async ({ name, seed, button, expected }) => {
		await runParityCase(
			(editor) => toolbarAction(editor, seed, button),
			{ category: "toolbar", name, input: `select "${seed}" → ${button}` },
			expected
		);
	});
});

const SHORTCUT_CASES: Array<{ name: string; keys: string; expected: string }> = [
	{ name: "h1 (# )", keys: "# Heading", expected: "# Heading" },
	{ name: "h2 (## )", keys: "## Heading", expected: "## Heading" },
	{ name: "bullet (- )", keys: "- item", expected: "- item" },
	{ name: "ordered (1. )", keys: "1. item", expected: "1. item" },
	{ name: "blockquote (> )", keys: "> quote", expected: "> quote" },
	{ name: "bold (**x**)", keys: "**bold** end", expected: "**bold** end" },
	{ name: "italic (*x*)", keys: "*em* end", expected: "*em* end" },
	// The four formats markdown has no syntax for are typed as the HTML tag that
	// renders them, and convert on the closing tag like any other inline construct.
	{ name: "highlight (<mark>x</mark>)", keys: "<mark>hl</mark> end", expected: "<mark>hl</mark> end" },
	{ name: "subscript (<sub>x</sub>)", keys: "H<sub>2</sub>O", expected: "H<sub>2</sub>O" },
	{ name: "superscript (<sup>x</sup>)", keys: "x<sup>2</sup> end", expected: "x<sup>2</sup> end" },
	{ name: "underline (<u>x</u>)", keys: "<u>ul</u> end", expected: "<u>ul</u> end" }
];

describe("markdown conformance — markdown input shortcuts", () => {
	test.each(SHORTCUT_CASES)("$name", async ({ name, keys, expected }) => {
		await runParityCase(
			(editor) => shortcut(editor, keys),
			{ category: "shortcut", name, input: `type "${keys}"` },
			expected
		);
	});
});

describe("markdown conformance — dialogs + URL policy", () => {
	test("link insert", async () => {
		await runParityCase(
			(editor) => linkDialog(editor, "site", "https://example.com"),
			{ category: "dialog", name: "link insert", input: 'link "site" → https://example.com' },
			"[site](https://example.com)"
		);
	});

	test("link rejects javascript: URL", async () => {
		// The dialog refuses the URL, so the seed text is emitted unlinked.
		await runParityCase(
			(editor) => linkDialog(editor, "x", "javascript:alert(1)"),
			{
				category: "dialog",
				name: "javascript: URL rejected",
				input: "link → javascript:alert(1)",
				note: "no javascript: link may reach the markdown"
			},
			"x"
		);
	});

	test("image insert", async () => {
		await runParityCase(
			(editor) => imageDialog(editor, "https://example.com/a.png", "alt"),
			{ category: "dialog", name: "image insert", input: "image → https://example.com/a.png" },
			"![alt](https://example.com/a.png)"
		);
	});
});
