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

import type { SourceSelection } from "../../main/modes/source-commands.js";
import {
	applyLinePrefix,
	composeImage,
	composeLink,
	indentLines,
	insertCodeBlock,
	insertHorizontalRule,
	insertTable,
	insertText,
	outdentLines,
	toggleInlineWrap
} from "../../main/modes/source-commands.js";

/**
 * Builds a {@link SourceSelection} from a string where `|` marks a collapsed caret
 * and `[`…`]` marks a selection range. The markers are stripped.
 *
 * ```
 * "a|b"     -> { value: "ab",   selectionStart: 1, selectionEnd: 1 }
 * "a[bc]d"  -> { value: "abcd", selectionStart: 1, selectionEnd: 3 }
 * ```
 */
function parseAnnotatedSelection(annotated: string): SourceSelection {
	const caret = annotated.indexOf("|");

	if (caret !== -1) {
		const value = annotated.replace("|", "");

		return { value, selectionStart: caret, selectionEnd: caret };
	}

	const start = annotated.indexOf("[");
	const end = annotated.indexOf("]") - 1; // account for the removed "["
	const value = annotated.replace("[", "").replace("]", "");

	return { value, selectionStart: start, selectionEnd: end };
}

/**
 * The other way round: turns a {@link SourceSelection} back into the annotated form,
 * so an assertion reads like the text the user sees.
 *
 * ```
 * { value: "ab",   selectionStart: 1, selectionEnd: 1 }  ->  "a|b"
 * { value: "abcd", selectionStart: 1, selectionEnd: 3 }  ->  "a[bc]d"
 * ```
 */
function formatAnnotatedSelection(snapshot: SourceSelection): string {
	const { value, selectionStart, selectionEnd } = snapshot;

	if (selectionStart === selectionEnd) {
		return `${value.slice(0, selectionStart)}|${value.slice(selectionStart)}`;
	}

	return `${value.slice(0, selectionStart)}[${value.slice(selectionStart, selectionEnd)}]${value.slice(selectionEnd)}`;
}

describe("toggleInlineWrap", () => {
	test("wraps a selection and keeps the inner text selected", () => {
		expect(formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("[word]"), "**"))).toBe("**[word]**");
	});

	test("inserts empty markers with the caret between them", () => {
		expect(formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("a|b"), "**"))).toBe("a**|**b");
		expect(formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("a |"), "**"))).toBe("a **|**");
	});

	// Clicking the same button again, without typing anything, takes the markers back out.
	test("removes empty markers when the caret is still between them", () => {
		expect(formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("a**|**b"), "**"))).toBe("a|b");
		expect(formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("a*|*b"), "*"))).toBe("a|b");
		expect(formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("a~~|~~b"), "~~"))).toBe("a|b");
		expect(formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("<sub>|</sub>"), "<sub>", "</sub>"))).toBe(
			"|"
		);
	});

	test("toggles off when the markers are inside the selection", () => {
		expect(formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("[**word**]"), "**"))).toBe("[word]");
	});

	test("toggles off when the markers flank the selection", () => {
		expect(formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("**[word]**"), "**"))).toBe("[word]");
	});

	test("italic does not treat one half of a bold pair as its own marker", () => {
		// Selection is the inner text of **bold**; italic must ADD emphasis (not strip the bold `*`s)
		// yielding bold + italic with the inner text still selected.
		expect(formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("**[bold]**"), "*"))).toBe("***[bold]***");
	});

	// An even run of `*` is fully consumed by bold, an odd one carries italic as well
	// so italic toggles off inside bold instead of growing the run.
	test("italic toggles off again inside a bold run", () => {
		expect(formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("***[bold]***"), "*"))).toBe("**[bold]**");
		expect(formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("[***bold***]"), "*"))).toBe("[**bold**]");
	});

	test("repeated italic clicks alternate instead of accumulating delimiters", () => {
		let snapshot = parseAnnotatedSelection("[text]");

		// Bold first, then italic on and off twice over the same selection.
		snapshot = toggleInlineWrap(snapshot, "**");
		expect(formatAnnotatedSelection(toggleInlineWrap(snapshot, "*"))).toBe("***[text]***");

		for (let click = 0; click < 4; click++) {
			snapshot = toggleInlineWrap(snapshot, "*");
			expect(snapshot.value).toBe(click % 2 === 0 ? "***text***" : "**text**");
		}
	});

	test("bold toggles off around an italic run", () => {
		expect(formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("***[both]***"), "**"))).toBe("*[both]*");
	});

	test("strike and inline code and highlight use their markers", () => {
		expect(toggleInlineWrap(parseAnnotatedSelection("[x]"), "~~").value).toBe("~~x~~");
		expect(toggleInlineWrap(parseAnnotatedSelection("[x]"), "`").value).toBe("`x`");
		expect(toggleInlineWrap(parseAnnotatedSelection("[x]"), "==").value).toBe("==x==");
	});

	// Subscript and superscript have no markdown syntax, so they serialize to raw HTML
	// the only formats whose closing delimiter differs from its opening one.
	test("wraps with distinct opening and closing delimiters", () => {
		expect(formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("H[2]O"), "<sub>", "</sub>"))).toBe(
			"H<sub>[2]</sub>O"
		);
	});

	test("toggles off a distinct-delimiter wrap from either side", () => {
		expect(
			formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("[<sup>2</sup>]"), "<sup>", "</sup>"))
		).toBe("[2]");
		expect(
			formatAnnotatedSelection(toggleInlineWrap(parseAnnotatedSelection("<sup>[2]</sup>"), "<sup>", "</sup>"))
		).toBe("[2]");
	});
});

describe("applyLinePrefix", () => {
	test("applies a heading marker to the caret line", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("Ti|tle"), "heading2").value).toBe("## Title");
	});

	test("replaces an existing heading level", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("#|# Title"), "heading3").value).toBe("### Title");
	});

	test("toggles a heading off when every line already has it", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("## |Title"), "heading2").value).toBe("Title");
	});

	test("paragraph strips a heading marker", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("### |Title"), "paragraph").value).toBe("Title");
	});

	test("bullets every selected line", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("[a\nb]"), "bulletList").value).toBe("- a\n- b");
	});

	test("numbers an ordered list sequentially across lines", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("[a\nb\nc]"), "orderedList").value).toBe("1. a\n2. b\n3. c");
	});

	test("switches a bullet list to a task list (mutually exclusive)", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("[- a\n- b]"), "taskList").value).toBe("- [ ] a\n- [ ] b");
	});

	test("toggles a list off when every line already has it", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("[- a\n- b]"), "bulletList").value).toBe("a\nb");
	});

	test("blockquote is additive and toggles off", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("qu|ote"), "blockquote").value).toBe("> quote");
		expect(applyLinePrefix(parseAnnotatedSelection("> qu|ote"), "blockquote").value).toBe("quote");
	});

	// Indentation is what makes a list item nested, so it survives every toggle:
	// the marker is replaced, added or removed after it, never in front of it.
	test("toggles a nested list item off without disturbing its indentation", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("- a\n  - |b"), "bulletList").value).toBe("- a\n  b");
	});

	test("bullets an indented line after its indentation", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("- a\n  |b"), "bulletList").value).toBe("- a\n  - b");
	});

	test("switches a nested bullet to a task item in place", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("- a\n  - |b"), "taskList").value).toBe("- a\n  - [ ] b");
	});

	test("headings and blockquotes keep the indentation they are applied to", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("  Ti|tle"), "heading2").value).toBe("  ## Title");
		expect(applyLinePrefix(parseAnnotatedSelection("  qu|ote"), "blockquote").value).toBe("  > quote");
	});

	// The editor's fidelity contract keeps the author's own markers, so a toggle has to
	// recognise the bullet characters and ordered delimiters it did not write itself.
	test("recognises `*` and `+` bullets and toggles them off", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("[* a\n* b]"), "bulletList").value).toBe("a\nb");
		expect(applyLinePrefix(parseAnnotatedSelection("+ |a"), "bulletList").value).toBe("a");
	});

	test("recognises `1)` numbering and toggles it off", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("[1) a\n2) b]"), "orderedList").value).toBe("a\nb");
	});

	test("keeps the marker character the block already uses when switching list kinds", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("* |a"), "taskList").value).toBe("* [ ] a");
		expect(applyLinePrefix(parseAnnotatedSelection("+ [ ] |a"), "bulletList").value).toBe("+ a");
	});

	// A bullet character or ordered delimiter that changes mid-list starts a second
	// list, so the marker found in the block is written to every line of it.
	test("numbers a partly numbered block with the delimiter it already uses", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("[1) a\nb]"), "orderedList").value).toBe("1) a\n2) b");
		expect(applyLinePrefix(parseAnnotatedSelection("[* a\nb]"), "taskList").value).toBe("* [ ] a\n* [ ] b");
		expect(applyLinePrefix(parseAnnotatedSelection("* |a"), "orderedList").value).toBe("1. a");
	});

	// A blank line separates blocks and carries no marker of its own.
	test("blank lines inside the selection stay blank and do not count as ordinals", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("[a\n\nb]"), "orderedList").value).toBe("1. a\n\n2. b");
		expect(applyLinePrefix(parseAnnotatedSelection("[a\n\nb]"), "blockquote").value).toBe("> a\n\n> b");
	});

	// The toggle is decided for the block as a whole, so a half-formatted selection
	// is completed rather than partly stripped.
	test("a partly prefixed block is completed rather than toggled off", () => {
		expect(applyLinePrefix(parseAnnotatedSelection("[- a\nb]"), "bulletList").value).toBe("- a\n- b");
	});
});

describe("indent / outdent", () => {
	test("indent prepends two spaces to each line", () => {
		expect(indentLines(parseAnnotatedSelection("[a\nb]")).value).toBe("  a\n  b");
	});

	test("outdent removes up to two leading spaces", () => {
		expect(outdentLines(parseAnnotatedSelection("[    a\n  b]")).value).toBe("  a\nb");
	});

	test("outdent removes a leading tab", () => {
		expect(outdentLines(parseAnnotatedSelection("[\ta]")).value).toBe("a");
	});
});

describe("inserts", () => {
	test("insertText replaces the selection and leaves the caret after it", () => {
		expect(formatAnnotatedSelection(insertText(parseAnnotatedSelection("a[XX]b"), "Y"))).toBe("aY|b");
	});

	test("insertHorizontalRule guarantees a blank line before the rule", () => {
		expect(insertHorizontalRule(parseAnnotatedSelection("text|")).value).toBe("text\n\n---\n");
	});

	test("insertHorizontalRule at the document start needs no leading blank", () => {
		expect(insertHorizontalRule(parseAnnotatedSelection("|")).value).toBe("---\n");
	});

	test("insertCodeBlock fences the selection and selects the body", () => {
		const result = insertCodeBlock(parseAnnotatedSelection("|"), { language: "ts" });
		expect(result.value).toBe("```ts\n\n```\n");
	});

	test("insertCodeBlock keeps the selected body between the fences", () => {
		const result = insertCodeBlock(parseAnnotatedSelection("[code]"), { language: "" });
		expect(result.value).toBe("```\ncode\n```\n");
		expect(result.value.slice(result.selectionStart, result.selectionEnd)).toBe("code");
	});

	test("insertTable writes a GFM table with a header row and placeholder cells", () => {
		const result = insertTable(parseAnnotatedSelection("|"));

		expect(result.value).toBe(
			"| Column 1 | Column 2 | Column 3 |\n" +
				"| -------- | -------- | -------- |\n" +
				"| Cell 1-1 | Cell 1-2 | Cell 1-3 |\n" +
				"| Cell 2-1 | Cell 2-2 | Cell 2-3 |\n"
		);
	});

	test("insertTable pads cells to the widest text in their column", () => {
		// "Cell 10-1" in the last row is wider than the "Column 1" header above it, so
		// the whole column — header and delimiter row included — widens with it.
		const lines = insertTable(parseAnnotatedSelection("|"), { columns: 1, rows: 10 }).value.trimEnd().split("\n");

		expect(lines[0]).toBe("| Column 1  |");
		expect(lines[1]).toBe("| --------- |");
		expect(lines.at(-1)).toBe("| Cell 10-1 |");
	});

	test("insertTable selects the first header cell so it can be overwritten", () => {
		const result = insertTable(parseAnnotatedSelection("|"));

		expect(result.value.slice(result.selectionStart, result.selectionEnd)).toBe("Column 1");
	});

	test("insertTable pads a blank line before the table when mid-document", () => {
		const result = insertTable(parseAnnotatedSelection("text|"));

		expect(result.value.startsWith("text\n\n| Column 1 |")).toBe(true);
	});

	// A GFM table runs on until a blank line, so without the trailing pad the
	// paragraph after the caret is parsed as one more row.
	test("insertTable pads a blank line after the table so the next paragraph survives", () => {
		const result = insertTable(parseAnnotatedSelection("|after"));

		expect(result.value.endsWith("| Cell 2-1 | Cell 2-2 | Cell 2-3 |\n\nafter")).toBe(true);
	});

	test("insertHorizontalRule pads a blank line after the rule", () => {
		expect(insertHorizontalRule(parseAnnotatedSelection("|after")).value).toBe("---\n\nafter");
	});

	test("block inserts do not add padding that is already there", () => {
		expect(insertHorizontalRule(parseAnnotatedSelection("|\n\nafter")).value).toBe("---\n\n\nafter");
		expect(
			insertTable(parseAnnotatedSelection("|\nafter")).value.endsWith("| Cell 2-1 | Cell 2-2 | Cell 2-3 |\n\nafter")
		).toBe(true);
	});

	test("insertCodeBlock pads both sides of the block", () => {
		expect(insertCodeBlock(parseAnnotatedSelection("text|after"), { language: "ts" }).value).toBe(
			"text\n\n```ts\n\n```\n\nafter"
		);
	});

	test("insertCodeBlock selects the body so it can be typed into", () => {
		const result = insertCodeBlock(parseAnnotatedSelection("[body]"));

		expect(result.value).toBe("```\nbody\n```\n");
		expect(result.value.slice(result.selectionStart, result.selectionEnd)).toBe("body");
	});

	test("composeLink / composeImage build the expected markdown", () => {
		expect(composeLink("A12", "https://geta12.com")).toBe("[A12](https://geta12.com)");
		expect(composeImage("logo", "https://geta12.com/logo.png")).toBe("![logo](https://geta12.com/logo.png)");
		expect(composeImage("logo", "https://geta12.com/logo.png", "A12")).toBe(
			'![logo](https://geta12.com/logo.png "A12")'
		);
	});
});
