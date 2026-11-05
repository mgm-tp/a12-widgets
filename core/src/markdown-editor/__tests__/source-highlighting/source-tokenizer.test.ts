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
 * The one rule the whole source mode builds on: tokenizing loses nothing.
 *
 * Every later step counts on it. The block model puts the token text back together,
 * the structural diff compares node text with token text
 * and `block-offsets.ts` saves the caret as a number: how many characters it sits from the start of that text.
 * One lost or extra character would BREAK ALL THREE and the caret would land in the wrong place.
 */

import { buildEditorFromExtensions, getExtensionDependencyFromEditor } from "@lexical/extension";
import { MdastImportExtension } from "@lexical/mdast";
import { describe, expect, test } from "vitest";

import { markdownEditorExtension } from "../../main/extensions.js";
import { micromarkCustomInlineSyntaxes } from "../../main/extensions/micromark-extension-custom-syntaxes.js";
import type { SourceTokenizer } from "../../main/source-highlighting/micromark-tokenizer.js";
import { createSourceTokenizer } from "../../main/source-highlighting/micromark-tokenizer.js";
import { getSourceTokenText, isMarkupTokenType } from "../../main/source-highlighting/source-token.js";

const tokenize: SourceTokenizer = (() => {
	const editor = buildEditorFromExtensions(markdownEditorExtension);
	const { output } = getExtensionDependencyFromEditor(editor, MdastImportExtension);

	return createSourceTokenizer([...output.registry.micromarkExtensions, micromarkCustomInlineSyntaxes()]);
})();

describe("the source tokenizer", () => {
	test.each([
		["a heading", "# Title"],
		["inline strong", "a **b** c"],
		["a list", "- one\n- two"],
		["a code fence", "```js\nconst a = 1;\n```"],
		["a table", "| a | b |\n| --- | --- |\n| 1 | 2 |"],
		["an info panel directive", ":::info\nbody\n:::"],
		["tabs", "a\tb\tc"],
		["a multi-codepoint emoji", "emoji 👨‍👩‍👧‍👦 text"],
		["escaped delimiters", "a \\*escaped\\* b"],
		["padded inline code", "a ` x ` b"],
		["a character reference", "a &amp; b"],
		["a link destination with brackets", "[t](http://e.com/a(b)c)"],
		["a fence indented inside a list item", "- item\n\n  ```js\n  const a = 1;\n  ```"],
		["a setext heading", "Title\n====="],
		["a block quote", "> one\n> two"],
		["a nested block quote", "> outer\n> > inner"],
		["a thematic break", "one\n\n***\n\ntwo"],
		["an indented code block", "\tconst a = 1;\n\nafter"],
		["a task list", "- [x] done\n- [ ] open"],
		["strikethrough", "a ~~b~~ c"],
		["the HTML inline formats", "<sub>a</sub> <sup>b</sup> <u>c</u> <mark>d</mark>"],
		["an unclosed HTML inline format", "a <mark>b"],
		["an inline HTML tag", 'a <span class="x">b</span> c'],
		["an HTML block", "<div>\n<p>x</p>\n</div>"],
		["an autolink", "see <https://e.test/path> here"],
		["a bare URL", "see https://e.test/path here"],
		["an image", '![alt](http://e.com/i.png "title")'],
		["a reference link", "[a][ref]\n\n[ref]: http://e.com"],
		["a hard break made of two spaces", "one  \ntwo"],
		["a hard break made of a backslash", "one\\\ntwo"],
		["a numeric character reference", "a &#38; b"],
		["a directive with attributes", ':::info{title="Note"}\nbody\n:::'],
		["an unknown directive", ":::mystery\nbody\n:::"],
		["an unclosed code fence", "```js\nconst a = 1;"],
		["an unclosed link", "a [b c"],
		["CRLF endings", "# Title\r\n\r\na **b** c"],
		["CRLF inside a code fence", "```js\r\nconst a = 1;\r\n```"],
		["a lone carriage return", "one\rtwo"],
		["a table with tabs in the cells", "| a\t| b\t|\n| ---\t| ---\t|\n| 1\t| 2\t|"],
		["a block quote holding a list and a fence", "> - one\n> - two\n>\n> ```js\n> const a = 1;\n> ```"],
		["a list item holding a block quote", "- item\n\n  > quoted\n  > lines\n\n- next"],
		[
			"a directive holding a list, a table and a fence",
			":::info\n- one\n- two\n\n| a | b |\n| - | - |\n| 1 | 2 |\n\n```js\nconst a = 1;\n```\n:::"
		],
		["a directive nested in a directive", ":::info\nouter\n\n:::warning\ninner\n:::\n\nstill outer\n:::"],
		["a four-colon fence, which is text", "::::info\nouter\n\n:::warning\ninner\n:::\n\nstill outer\n::::"],
		["a directive inside a list item", "- item\n\n  :::info\n  body\n  :::"],
		["a fence holding what looks like markup", "```md\n# not a heading\n- not a list\n> not a quote\n:::info\n```"],
		["a fence holding a shorter fence", "````md\n```js\nconst a = 1;\n```\n````"],
		["a table whose cells hold code, pipes and emphasis", "| a | b |\n| - | - |\n| `x \\| y` | **bold** |"],
		["a table inside a block quote", "> | a | b |\n> | - | - |\n> | 1 | 2 |"],
		["emphasis nested in strong nested in a link", "[**bold *and italic* text**](http://e.com)"],
		["an image inside a link", "[![alt](http://e.com/i.png)](http://e.com)"],
		["the HTML inline formats nested in each other", "<mark>a <sub>b <u>c</u></sub></mark>"],
		["an inline format nested in strong", "**bold <mark>marked</mark>**"],
		["inline code holding backticks", "a ``code with ` tick`` b"],
		["a lazy block quote continuation", "> first line\nstill quoted\n\nafter"],
		["an ordered list with a paren delimiter and nesting", "1) one\n   1) deeper\n2) two"],
		["a loose list with two paragraphs per item", "- one\n\n  more of one\n\n- two\n\n  more of two"],
		["a task list nested in a task list", "- [x] outer\n  - [ ] inner\n  - [x] inner done"],
		["a reference definition with a title, used twice", '[a][ref] and [b][ref]\n\n[ref]: http://e.com "the title"'],
		["a heading holding a link and code", "## A [link](http://e.com) and `code`"],
		["a setext heading after a list", "- one\n- two\n\nTitle\n-----"],
		["CRLF inside a nested structure", "> - one\r\n> - two\r\n>\r\n> ```js\r\nconst a = 1;\r\n> ```"],
		["only spaces", "   "],
		["the empty document", ""]
	])("loses nothing tokenizing %s", (_label, markdown) => {
		expect(getSourceTokenText(tokenize(markdown))).toBe(markdown);
	});

	// Only markup is dimmed, so every type has to land on the right side of this line.
	describe("telling markup apart from content", () => {
		test.each([
			// Named with the `Sequence` suffix, which covers most markup.
			["strongSequence"],
			["emphasisSequence"],
			["atxHeadingSequence"],
			["setextHeadingLineSequence"],
			["codeFencedFenceSequence"],
			["codeTextSequence"],
			["thematicBreakSequence"],
			["strikethroughSequence"],
			// Named with the `Marker` suffix, including the one our own inline formats add.
			["blockQuoteMarker"],
			["listItemMarker"],
			["labelMarker"],
			["labelImageMarker"],
			["escapeMarker"],
			["characterReferenceMarker"],
			["customInlineFormatMarker"],
			// Neither suffix fits, so these are listed by hand.
			["codeFencedFenceInfo"],
			["listItemValue"],
			["tableCellDivider"],
			["tableDelimiterFiller"]
		] as const)("%s is markup", (type) => {
			expect(isMarkupTokenType(type)).toBe(true);
		});

		test.each([
			// The text the markup wraps.
			["atxHeadingText"],
			["setextHeadingText"],
			["codeFlowValue"],
			["codeTextData"],
			["literalAutolink"],
			// The wrappers micromark puts around plain text.
			["data"],
			["chunkString"],
			["chunkText"],
			// The suffix has to be at the end: this one is a marker mid-parse, not a final type.
			["customInlineFormatMarkerTemporary"]
		] as const)("%s is content", (type) => {
			expect(isMarkupTokenType(type)).toBe(false);
		});
	});
});
