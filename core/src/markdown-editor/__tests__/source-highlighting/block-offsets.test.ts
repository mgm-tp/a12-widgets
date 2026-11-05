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
 * Turning the caret into a number and back.
 *
 * The highlighting pipeline rebuilds nodes under the caret all the time
 * and a Lexical selection is made of node keys, so it parks the caret as a character offset first
 * and resolves it again afterwards. These tests hold that pair to being a real round trip.
 */

import { buildEditorFromExtensions, getExtensionDependencyFromEditor } from "@lexical/extension";
import { MdastImportExtension } from "@lexical/mdast";
import { PlainTextExtension } from "@lexical/plain-text";
import type { LexicalEditor } from "lexical";
import { $getRoot, defineExtension } from "lexical";
import { describe, expect, test } from "vitest";

import { markdownEditorExtension } from "../../main/extensions.js";
import { MarkdownHighlightingExtension } from "../../main/extensions/markdown-highlighting-extension.js";
import { micromarkCustomInlineSyntaxes } from "../../main/extensions/micromark-extension-custom-syntaxes.js";
import { $isMarkdownSourceBlockNode } from "../../main/nodes/markdown-source-block-node.js";
import {
	$captureBlockSelection,
	$captureSourceDocumentSelection,
	$restoreBlockSelection,
	$restoreSourceDocumentSelection
} from "../../main/source-highlighting/block-offsets.js";
import type { SourceTokenizer } from "../../main/source-highlighting/micromark-tokenizer.js";
import { createSourceTokenizer } from "../../main/source-highlighting/micromark-tokenizer.js";
import { registerSourceHighlighting } from "../../main/source-highlighting/register-source-highlighting.js";
import { $getSourceDocumentText, $setSourceDocument } from "../../main/source-highlighting/source-document.js";

const tokenize: SourceTokenizer = (() => {
	const editor = buildEditorFromExtensions(markdownEditorExtension);
	const { output } = getExtensionDependencyFromEditor(editor, MdastImportExtension);

	return createSourceTokenizer([...output.registry.micromarkExtensions, micromarkCustomInlineSyntaxes()]);
})();

/** The real source-mode pipeline, so the blocks hold real token trees, breaks and tabs. */
function createSourceEditor(markdown: string): LexicalEditor {
	const editor = buildEditorFromExtensions(
		defineExtension({
			name: "@a12/test/BlockOffsets",
			dependencies: [PlainTextExtension, MarkdownHighlightingExtension],
			register: (registered) => registerSourceHighlighting(registered, tokenize)
		})
	);

	editor.update(() => $setSourceDocument(markdown, tokenize), { discrete: true });

	return editor;
}

/** Puts the caret at `offset` and reads back where it actually landed. */
function roundTripDocument(editor: LexicalEditor, offset: number): number | null {
	editor.update(() => $restoreSourceDocumentSelection({ anchor: offset, focus: offset }), { discrete: true });

	return editor.read(() => $captureSourceDocumentSelection()?.anchor ?? null);
}

/** The same, within one block. */
function roundTripBlock(editor: LexicalEditor, blockIndex: number, offset: number): number | null {
	editor.update(
		() => {
			const block = $getRoot().getChildren()[blockIndex];

			if (block && $isMarkdownSourceBlockNode(block)) {
				$restoreBlockSelection(block, { anchor: offset, focus: offset });
			}
		},
		{ discrete: true }
	);

	return editor.read(() => {
		const block = $getRoot().getChildren()[blockIndex];

		return block && $isMarkdownSourceBlockNode(block) ? ($captureBlockSelection(block)?.anchor ?? null) : null;
	});
}

const MARKDOWN_DOCUMENTS: ReadonlyArray<readonly [string, string]> = [
	["a heading, a list and paragraphs", "# Title\n\nFirst paragraph.\n\n- one\n- two\n\nLast paragraph."],
	["a closed code fence", "```js\nconst a = 1;\n```\n\nafter"],
	["an unclosed code fence", "```js\nconst a = 1;\n\nstill inside"],
	["a tilde code fence", "~~~\ncode\n~~~\n\nafter"],
	["consecutive blank lines", "one\n\n\n\ntwo"],
	["a tab-indented code block", "\tindented\n\nafter"],
	["a table", "| a | b |\n| - | - |\n| 1 | 2 |\n\nafter"],
	["a table with tabs in the cells", "| a\t| b\t|\n| -\t| -\t|\n| 1\t| 2\t|\n\nafter"],
	["a block quote", "> quoted\n> more\n\nafter"],
	["a nested list", "- one\n  - deeper\n    - deepest\n\nafter"],
	["a setext heading", "Title\n=====\n\nafter"],
	["a thematic break", "one\n\n---\n\ntwo"],
	["an HTML block", "<div>\n<p>x</p>\n</div>\n\nafter"],
	["inline links, code and emphasis", "A [link](https://x.test) and `code` and *emphasis*.\n\nafter"],
	["a hard break made of two spaces", "one  \ntwo\n\nafter"],
	["CRLF endings", "one\r\n\r\ntwo"],
	["CRLF around a heading and a list", "# Title\r\n\r\n- one\r\n- two\r\n"],
	["CRLF inside a code fence", "```js\r\nconst a = 1;\r\n```\r\n\r\nafter"],
	["mixed CRLF and LF endings", "one\r\n\ntwo\n\r\nthree"],
	["a lone carriage return", "one\rtwo\n\nafter"],
	["a trailing CRLF", "one\r\n"],
	["astral characters", "a \u{1F600} b\n\naf\u{1F1E9}\u{1F1EA}ter"],
	["combining marks", "cafe\u0301 nai\u0308ve\n\nafter"],
	["only blank lines", "\n\n\n"],
	["only spaces", "   "],
	["a trailing newline", "one\n"],
	["the empty document", ""]
];

describe("document offsets", () => {
	test.each(MARKDOWN_DOCUMENTS)("every offset in %s resolves to a caret and back", (_label, markdown) => {
		const editor = createSourceEditor(markdown);
		const length = editor.read(() => $getSourceDocumentText()).length;
		const drifted: Array<{ offset: number; landed: number | null }> = [];

		for (let offset = 0; offset <= length; offset++) {
			const landed = roundTripDocument(editor, offset);

			if (landed !== offset) {
				drifted.push({ offset, landed });
			}
		}

		// Every offset in the document is a position the caret can be put at and read back from.
		// Nothing is lost, nothing is off by one, nothing fails to resolve.
		expect(drifted).toStrictEqual([]);
	});

	test.each(MARKDOWN_DOCUMENTS)("the text is unchanged by all that seeking in %s", (_label, markdown) => {
		const editor = createSourceEditor(markdown);
		const length = markdown.length;

		for (let offset = 0; offset <= length; offset++) {
			roundTripDocument(editor, offset);
		}

		expect(editor.read(() => $getSourceDocumentText())).toBe(markdown);
	});

	test("an offset past the end clamps to the end", () => {
		const markdown = "one\n\ntwo";
		const editor = createSourceEditor(markdown);

		expect(roundTripDocument(editor, markdown.length + 50)).toBe(markdown.length);
	});

	test("a negative offset clamps to the start", () => {
		const editor = createSourceEditor("one\n\ntwo");

		expect(roundTripDocument(editor, -10)).toBe(0);
	});

	test("a range spanning blocks comes back as the same range", () => {
		const markdown = "# Title\n\nbody text";
		const editor = createSourceEditor(markdown);

		editor.update(() => $restoreSourceDocumentSelection({ anchor: 2, focus: markdown.length - 1 }), { discrete: true });

		expect(editor.read(() => $captureSourceDocumentSelection())).toStrictEqual({
			anchor: 2,
			focus: markdown.length - 1
		});
	});

	test("a backwards range keeps its direction", () => {
		const editor = createSourceEditor("# Title\n\nbody text");

		editor.update(() => $restoreSourceDocumentSelection({ anchor: 12, focus: 3 }), { discrete: true });

		expect(editor.read(() => $captureSourceDocumentSelection())).toStrictEqual({ anchor: 12, focus: 3 });
	});

	test("there is no selection to capture when nothing is selected", () => {
		const editor = createSourceEditor("one\n\ntwo");

		expect(editor.read(() => $captureSourceDocumentSelection())).toBeNull();
	});
});

describe("block offsets", () => {
	test.each(MARKDOWN_DOCUMENTS)("every offset within every block of %s round-trips", (_label, markdown) => {
		const editor = createSourceEditor(markdown);
		const sizes = editor.read(() =>
			$getRoot()
				.getChildren()
				.map((block) => block.getTextContentSize())
		);
		const drifted: Array<{ block: number; offset: number; landed: number | null }> = [];

		sizes.forEach((size, block) => {
			for (let offset = 0; offset <= size; offset++) {
				const landed = roundTripBlock(editor, block, offset);

				if (landed !== offset) {
					drifted.push({ block, offset, landed });
				}
			}
		});

		expect(drifted).toStrictEqual([]);
	});

	test("an offset past the end of a block clamps to its end", () => {
		const editor = createSourceEditor("one\n\ntwo");

		expect(roundTripBlock(editor, 0, 99)).toBe(3);
	});

	test("the caret can sit in the empty block that is a blank line", () => {
		const editor = createSourceEditor("one\n\ntwo");

		expect(editor.read(() => $getRoot().getChildren()[1]?.getTextContentSize())).toBe(0);
		expect(roundTripBlock(editor, 1, 0)).toBe(0);
		// Offset 4 in "one\n\ntwo" is that blank line: after the newline ending "one",
		// before the one that starts "two".
		expect(roundTripDocument(editor, 4)).toBe(4);
	});

	test("a point in another block is not this block's to report", () => {
		const editor = createSourceEditor("one\n\ntwo");

		editor.update(() => $restoreSourceDocumentSelection({ anchor: 0, focus: 0 }), { discrete: true });

		expect(
			editor.read(() => {
				const second = $getRoot().getChildren()[2];

				return second && $isMarkdownSourceBlockNode(second) ? $captureBlockSelection(second) : "not a block";
			})
		).toBeNull();
	});
});
