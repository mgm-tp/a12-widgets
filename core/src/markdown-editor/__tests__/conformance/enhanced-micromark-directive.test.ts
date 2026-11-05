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
 * The `:::` fork, tested at its own level: markdown in, mdast out, markdown back.
 *
 * Every case here is about one rule — a line of colons closes the innermost directive
 * that is still open — or about the lines that make colons mean something else:
 * code fences, block quotes, list indents, and names the parser will not accept.
 *
 * The editor's own round-trip is in `../round-trip/round-trip.test.ts`. This file leaves
 * Lexical out on purpose, so a failure here means the tokenizer is wrong, not a node.
 */

import { directiveFromMarkdown } from "mdast-util-directive";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import { directive } from "micromark-extension-directive";
import { describe, expect, test } from "vitest";

import {
	enhancedDirective,
	enhancedDirectiveToMarkdown
} from "../../main/extensions/enhanced-micromark-directive/index.js";
import { createSourceTokenizer } from "../../main/source-highlighting/micromark-tokenizer.js";
import type { SourceToken } from "../../main/source-highlighting/source-token.js";

interface NamedNode {
	type: string;
	name?: string;
	value?: string;
	children?: NamedNode[];
}

/**
 * The tree as one line per node, `type[name]`, indented by depth.
 *
 * Every case here asks the same question: which directive ended up inside which? A
 * whole mdast object buries that answer under positions and attribute records.
 */
function outline(node: NamedNode, depth = 0): string[] {
	const name = node.name === undefined ? "" : `[${node.name}]`;
	const value = node.value === undefined ? "" : ` ${JSON.stringify(node.value)}`;
	const own = `${"  ".repeat(depth)}${node.type}${name}${value}`;

	return [own, ...(node.children ?? []).flatMap((child) => outline(child, depth + 1))];
}

function parse(markdown: string): string {
	const tree = fromMarkdown(markdown, {
		extensions: [enhancedDirective()],
		mdastExtensions: [directiveFromMarkdown()]
	});

	return outline(tree as unknown as NamedNode).join("\n");
}

function write(markdown: string): string {
	const tree = fromMarkdown(markdown, {
		extensions: [enhancedDirective()],
		mdastExtensions: [directiveFromMarkdown()]
	});

	return toMarkdown(tree, { extensions: [enhancedDirectiveToMarkdown()] });
}

/** Source mode reads the same grammar, so it has to handle the same documents. */
const tokenize = createSourceTokenizer([enhancedDirective()]);

function tokenText(tokens: SourceToken[]): string {
	return tokens.map((token) => (token.kind === "text" ? token.text : tokenText(token.children))).join("");
}

describe("the nested directive grammar", () => {
	describe("three colons nest", () => {
		test("a directive inside a directive, both on three colons", () => {
			expect(parse(":::warning\nwarning content\n\n:::info\ninfo\n:::\n\nfooter text\n:::\n")).toBe(
				[
					"root",
					"  containerDirective[warning]",
					'    paragraph\n      text "warning content"',
					"    containerDirective[info]",
					'      paragraph\n        text "info"',
					'    paragraph\n      text "footer text"'
				].join("\n")
			);
		});

		test("three levels deep", () => {
			expect(parse(":::a\n:::b\n:::c\nC\n:::\nafterC\n:::\nafterB\n:::\nafterA\n")).toBe(
				[
					"root",
					"  containerDirective[a]",
					"    containerDirective[b]",
					"      containerDirective[c]",
					'        paragraph\n          text "C"',
					'      paragraph\n        text "afterC"',
					'    paragraph\n      text "afterB"',
					'  paragraph\n    text "afterA"'
				].join("\n")
			);
		});

		test("two directives side by side, each closing its own", () => {
			expect(parse(":::a\nA\n:::\n\n:::b\nB\n:::\n")).toBe(
				[
					"root",
					"  containerDirective[a]",
					'    paragraph\n      text "A"',
					"  containerDirective[b]",
					'    paragraph\n      text "B"'
				].join("\n")
			);
		});

		test("siblings inside a parent", () => {
			expect(parse(":::outer\n:::one\n1\n:::\n:::two\n2\n:::\n:::\n")).toBe(
				[
					"root",
					"  containerDirective[outer]",
					"    containerDirective[one]",
					'      paragraph\n        text "1"',
					"    containerDirective[two]",
					'      paragraph\n        text "2"'
				].join("\n")
			);
		});

		test("a name with attributes and a label still opens a level", () => {
			expect(parse(':::chart{type="bar"}\n:::note[Hi]{#x}\nn\n:::\nsales\n:::\n')).toBe(
				[
					"root",
					"  containerDirective[chart]",
					"    containerDirective[note]",
					'      paragraph\n        text "Hi"',
					'      paragraph\n        text "n"',
					'    paragraph\n      text "sales"'
				].join("\n")
			);
		});
	});

	describe("lines of colons that are not this block's fence", () => {
		test("colons inside a code fence are code", () => {
			expect(parse(":::warning\n```\n:::info\n```\nreal content\n:::\nafter\n")).toBe(
				[
					"root",
					"  containerDirective[warning]",
					'    code ":::info"',
					'    paragraph\n      text "real content"',
					'  paragraph\n    text "after"'
				].join("\n")
			);
		});

		test("a tilde fence holds colons too", () => {
			expect(parse(":::warning\n~~~\n:::\n~~~\nstill inside\n:::\n")).toBe(
				["root", "  containerDirective[warning]", '    code ":::"', '    paragraph\n      text "still inside"'].join(
					"\n"
				)
			);
		});

		test("a backtick fence is not closed by a tilde fence", () => {
			expect(parse(":::warning\n```\n~~~\n```\nout of the code\n:::\n")).toBe(
				["root", "  containerDirective[warning]", '    code "~~~"', '    paragraph\n      text "out of the code"'].join(
					"\n"
				)
			);
		});

		test("a longer fence is needed to close a longer fence", () => {
			expect(parse(":::warning\n````\n```\n:::\n```\n````\nafter the code\n:::\n")).toBe(
				[
					"root",
					"  containerDirective[warning]",
					'    code "```\\n:::\\n```"',
					'    paragraph\n      text "after the code"'
				].join("\n")
			);
		});

		test("an info string does not close a code fence", () => {
			expect(parse(":::warning\n```js\nconst a = 1;\n```js\nstill code\n```\ndone\n:::\n")).toBe(
				[
					"root",
					"  containerDirective[warning]",
					'    code "const a = 1;\\n```js\\nstill code"',
					'    paragraph\n      text "done"'
				].join("\n")
			);
		});

		test("a name the parser will not read is not counted", () => {
			// `factoryName` rejects `:::-nope`, so the inner parse leaves it as text.
			// If we counted it, this block's own fence would go to a directive that
			// never opened.
			expect(parse(":::info\n:::-nope\n:::\nafter\n")).toBe(
				[
					"root",
					"  containerDirective[info]",
					'    paragraph\n      text ":::-nope"',
					'  paragraph\n    text "after"'
				].join("\n")
			);
		});

		test("a fence inside a block quote belongs to the quote", () => {
			// The next line continues the quoted paragraph, so it joins it.
			expect(parse(":::info\n> :::\nstill inside\n:::\nafter\n")).toBe(
				[
					"root",
					"  containerDirective[info]",
					'    blockquote\n      paragraph\n        text ":::\\nstill inside"',
					'  paragraph\n    text "after"'
				].join("\n")
			);
		});

		test("two colons are a leaf directive, not a fence", () => {
			expect(parse(":::info\n::video{u=1}\n:::\n")).toBe(
				["root", "  containerDirective[info]", "    leafDirective[video]"].join("\n")
			);
		});

		test("a line of colons indented four spaces is code", () => {
			expect(parse(":::info\ntext\n\n    :::\n\nmore\n:::\n")).toBe(
				[
					"root",
					"  containerDirective[info]",
					'    paragraph\n      text "text"',
					'    code ":::"',
					'    paragraph\n      text "more"'
				].join("\n")
			);
		});
	});

	describe("closing", () => {
		test("trailing spaces after the colons still close", () => {
			expect(parse(":::info\nbody\n:::   \nafter\n")).toBe(
				[
					"root",
					"  containerDirective[info]",
					'    paragraph\n      text "body"',
					'  paragraph\n    text "after"'
				].join("\n")
			);
		});

		test("text after the colons does not close", () => {
			expect(parse(":::info\nbody\n::: nope\n")).toBe(
				["root", "  containerDirective[info]", '    paragraph\n      text "body\\n::: nope"'].join("\n")
			);
		});

		test("a run of colons left open at the end of the document still opens", () => {
			expect(parse(":::warning\n:::info\ninfo\n:::\n")).toBe(
				[
					"root",
					"  containerDirective[warning]",
					"    containerDirective[info]",
					'      paragraph\n        text "info"'
				].join("\n")
			);
		});

		/**
		 * Closing is last in, first out at any depth: one line of colons ends the block
		 * that opened last, and the blocks around it stay open. Left open at the end of
		 * the document, they take the rest of it with them.
		 */
		test("three levels deep, only the innermost one closed", () => {
			expect(parse(":::a\n:::b\n:::c\nC\n:::\nafterC\n")).toBe(
				[
					"root",
					"  containerDirective[a]",
					"    containerDirective[b]",
					"      containerDirective[c]",
					'        paragraph\n          text "C"',
					'      paragraph\n        text "afterC"'
				].join("\n")
			);
		});

		test("three levels deep, the outermost one left open", () => {
			expect(parse(":::a\n:::b\n:::c\nC\n:::\nafterC\n:::\nafterB\n")).toBe(
				[
					"root",
					"  containerDirective[a]",
					"    containerDirective[b]",
					"      containerDirective[c]",
					'        paragraph\n          text "C"',
					'      paragraph\n        text "afterC"',
					'    paragraph\n      text "afterB"'
				].join("\n")
			);
		});

		test("four colons do not close the block", () => {
			expect(parse(":::info\nbody\n::::\nafter\n")).toBe(
				["root", "  containerDirective[info]", '    paragraph\n      text "body\\n::::\\nafter"'].join("\n")
			);
		});
	});

	/**
	 * Four colons or more is text. That is the whole point of the fork: one spelling, so
	 * nobody has to count colons. It also means a document from a tool that nests by
	 * widening the outer fence does not read as a directive here.
	 */
	describe("only three colons", () => {
		test("a four-colon opener is a paragraph", () => {
			expect(parse("::::warning\nbody\n::::\n")).toBe(
				["root", '  paragraph\n    text "::::warning\\nbody\\n::::"'].join("\n")
			);
		});

		test("a widened outer fence leaves only the inner block a directive", () => {
			expect(parse("::::warning\nouter\n\n:::info\ninner\n:::\n\nfooter\n::::\n")).toBe(
				[
					"root",
					'  paragraph\n    text "::::warning\\nouter"',
					"  containerDirective[info]",
					'    paragraph\n      text "inner"',
					'  paragraph\n    text "footer\\n::::"'
				].join("\n")
			);
		});

		test("upstream reads that same document as one nested pair", () => {
			// Recorded so the difference from upstream is visible, not assumed.
			const widened = "::::warning\nouter\n\n:::info\ninner\n:::\n\nfooter\n::::\n";

			expect(
				outline(
					fromMarkdown(widened, {
						extensions: [directive()],
						mdastExtensions: [directiveFromMarkdown()]
					}) as unknown as NamedNode
				).join("\n")
			).toBe(
				[
					"root",
					"  containerDirective[warning]",
					'    paragraph\n      text "outer"',
					"    containerDirective[info]",
					'      paragraph\n        text "inner"',
					'    paragraph\n      text "footer"'
				].join("\n")
			);
		});

		test("a four-colon line inside a block is text, so it counts for nothing", () => {
			expect(parse(":::a\n::::b\nx\n:::\nafter\n")).toBe(
				[
					"root",
					"  containerDirective[a]",
					'    paragraph\n      text "::::b\\nx"',
					'  paragraph\n    text "after"'
				].join("\n")
			);
		});

		test("a five-colon opener is a paragraph too", () => {
			expect(parse(":::::info\nbody\n:::::\n")).toBe(
				["root", '  paragraph\n    text ":::::info\\nbody\\n:::::"'].join("\n")
			);
		});

		test("a line of six colons inside a block is text, so the block stays open", () => {
			expect(parse(":::info\nbody\n::::::\nafter\n")).toBe(
				["root", "  containerDirective[info]", '    paragraph\n      text "body\\n::::::\\nafter"'].join("\n")
			);
		});

		test("two colons are still a leaf directive", () => {
			expect(parse("::video{u=1}\n")).toBe(["root", "  leafDirective[video]"].join("\n"));
		});
	});

	/**
	 * The document the behaviour was agreed on, read end to end: the first bare `:::`
	 * closes `warning` because it opened last, `info` never closes and so holds the rest
	 * of the document, and the four-colon line at the end is text like any other.
	 */
	describe("the agreed document", () => {
		const agreed = [
			":::info",
			"Use **info** panels for neutral, contextual notes.",
			"",
			":::warning",
			"warning text",
			":::",
			"",
			"text here",
			"",
			"**bold text**",
			"",
			"also text here",
			"",
			"::::info",
			""
		].join("\n");

		test("reads as one open block holding a closed one", () => {
			expect(parse(agreed)).toBe(
				[
					"root",
					"  containerDirective[info]",
					'    paragraph\n      text "Use "\n      strong\n        text "info"\n      text " panels for neutral, contextual notes."',
					"    containerDirective[warning]",
					'      paragraph\n        text "warning text"',
					'    paragraph\n      text "text here"',
					'    paragraph\n      strong\n        text "bold text"',
					'    paragraph\n      text "also text here"',
					'    paragraph\n      text "::::info"'
				].join("\n")
			);
		});

		test("written back, the open block gets a fence and the four colons stay text", () => {
			const once = write(agreed);

			expect(once).toBe(
				[
					":::info",
					"Use **info** panels for neutral, contextual notes.",
					"",
					":::warning",
					"warning text",
					":::",
					"",
					"text here",
					"",
					"**bold text**",
					"",
					"also text here",
					"",
					"\\::::info",
					":::",
					""
				].join("\n")
			);
			expect(write(once)).toBe(once);
		});
	});

	describe("writing markdown back", () => {
		test.each([
			":::info\nbody\n:::\n",
			":::warning\nwarning content\n\n:::info\ninfo\n:::\n\nfooter text\n:::\n",
			":::a\n:::b\n:::c\nC\n:::\n\nafterC\n:::\n\nafterB\n:::\n\nafterA\n",
			":::outer\n:::one\n1\n:::\n\n:::two\n2\n:::\n:::\n",
			':::chart{type="bar"}\n:::note[Hi]{#x}\nn\n:::\n\nsales\n:::\n',
			":::warning\n```js\n:::info\n```\n\nreal\n:::\n",
			':::info\n::video{u="1"}\n\ntext :abbr[HTML] end\n:::\n',
			":::empty\n:::\n"
		])("%j comes back the same", (markdown) => {
			expect(write(markdown)).toBe(markdown);
		});

		test("a nested block is never written with a wider fence", () => {
			// The serializer widens by default. Left alone it would write `::::`, which this
			// grammar reads as a paragraph — the document would not survive its own save.
			const written = write(":::a\n:::b\n:::c\nC\n:::\n:::\n:::\n");

			expect(written).not.toContain("::::");
			expect(write(written)).toBe(written);
		});

		test("a four-colon fence is escaped, because it is only text", () => {
			const once = write("::::warning\nbody\n::::\n");

			expect(once).toBe("\\::::warning\nbody\n\\::::\n");
			expect(write(once)).toBe(once);
		});

		test("a leaf directive keeps its two colons", () => {
			expect(write('::video{u="1"}\n')).toBe('::video{u="1"}\n');
		});

		test("an inline directive keeps its one colon", () => {
			expect(write('text :abbr[HTML]{title="x"} end\n')).toBe('text :abbr[HTML]{title="x"} end\n');
		});

		test.each([
			":::a\n:::b\nx\n:::\n:::\n",
			"* :::a\n  :::b\n  x\n  :::\n  :::\n",
			"> :::a\n> :::b\n> x\n> :::\n> :::\n",
			":::a\n:::b\n```\n:::\n```\n:::\n:::\n",
			":::wärnung\nx\n:::\n",
			':::a{x=":::"}\nbody\n:::\n',
			":::a\n`:::`\n:::\n"
		])("%j survives the trip out and back", (markdown) => {
			expect(write(markdown)).toBe(markdown);
		});

		test("ten levels deep all come back on three colons", () => {
			const markdown = `${":::d\n".repeat(10)}deep\n${":::\n".repeat(10)}`;

			expect(write(markdown)).toBe(markdown);
		});

		test("a table inside a nested directive survives", () => {
			const markdown = ":::outer\n:::inner\n| a | b |\n| - | - |\n| 1 | 2 |\n:::\n:::\n";

			expect(write(markdown)).toBe(markdown);
		});
	});

	describe("inside other containers", () => {
		test("nested inside a list item", () => {
			expect(parse("- :::a\n  :::b\n  x\n  :::\n  :::")).toBe(
				[
					"root",
					"  list",
					"    listItem",
					"      containerDirective[a]",
					"        containerDirective[b]",
					'          paragraph\n            text "x"'
				].join("\n")
			);
		});

		/**
		 * A `:::name` that sits on a list marker line opens a block just like one on a
		 * line of its own, and its closing `:::` is indented no further than three, so
		 * this file reads that closer too. Miss the opener and the closer is taken for
		 * the outer block's own fence, which ends the outer block a line early.
		 */
		test("a directive on a list marker line does not close the block around it", () => {
			expect(parse(":::outer\n- :::inner\n  x\n  :::\n:::")).toBe(
				[
					"root",
					"  containerDirective[outer]",
					"    list",
					"      listItem",
					"        containerDirective[inner]",
					'          paragraph\n            text "x"'
				].join("\n")
			);
		});

		test("the same with an ordered marker, whose content starts one column further", () => {
			expect(parse(":::outer\n1. :::inner\n   x\n   :::\n:::")).toBe(
				[
					"root",
					"  containerDirective[outer]",
					"    list",
					"      listItem",
					"        containerDirective[inner]",
					'          paragraph\n            text "x"'
				].join("\n")
			);
		});

		test("content after the list still belongs to the outer block", () => {
			expect(parse(":::outer\n- :::inner\n  x\n  :::\nfooter\n:::")).toBe(
				[
					"root",
					"  containerDirective[outer]",
					"    list",
					"      listItem",
					"        containerDirective[inner]",
					'          paragraph\n            text "x"',
					'    paragraph\n      text "footer"'
				].join("\n")
			);
		});

		test("two list items, each with its own block", () => {
			expect(parse(":::outer\n- :::a\n  x\n  :::\n- :::b\n  y\n  :::\n:::")).toBe(
				[
					"root",
					"  containerDirective[outer]",
					"    list",
					"      listItem",
					"        containerDirective[a]",
					'          paragraph\n            text "x"',
					"      listItem",
					"        containerDirective[b]",
					'          paragraph\n            text "y"'
				].join("\n")
			);
		});

		/**
		 * A code fence may sit on the marker line as well. Its closing fence sits at the
		 * item's content column, where a line is read like any other — so if the opener
		 * were skipped, that closer would be taken for an opener and every later `:::`
		 * would look like code.
		 */
		test("a code fence on the marker line does not keep the block open", () => {
			expect(parse(":::a\n- ```\n  x\n  ```\n:::")).toBe(
				["root", "  containerDirective[a]", "    list", "      listItem", '        code "x"'].join("\n")
			);
		});

		test("colons inside a code fence on the marker line are code", () => {
			expect(parse(":::a\n- ```\n  :::\n  ```\n:::")).toBe(
				["root", "  containerDirective[a]", "    list", "      listItem", '        code ":::"'].join("\n")
			);
		});

		test("the same for a tilde fence and an ordered marker", () => {
			expect(parse(":::a\n1. ~~~\n   :::\n   ~~~\n:::")).toBe(
				["root", "  containerDirective[a]", "    list", "      listItem", '        code ":::"'].join("\n")
			);
		});

		/**
		 * A tab after the marker puts the item's content at column four, and the prefix a
		 * line is read through stops at three characters. So the closing line is out of
		 * reach and nothing on this line may be counted, or the tally would stay up and
		 * the block would never close.
		 */
		test("a tab after the marker leaves the tally alone", () => {
			expect(parse(":::a\n-\t:::b\n\tx\n\t:::\n:::")).toBe(
				[
					"root",
					"  containerDirective[a]",
					"    list",
					"      listItem",
					"        containerDirective[b]",
					'          paragraph\n            text "x"'
				].join("\n")
			);
		});

		/**
		 * A directive can end without a fence of its own: the list item it sits in ends,
		 * and takes it along. Closing is last in, first out, so if that directive stayed
		 * on the tally every later `:::` would go one level too deep for the rest of the
		 * document.
		 */
		test("a directive the list item closed does not hold the tally up", () => {
			expect(parse(":::a\n- :::b\n  x\n:::")).toBe(
				[
					"root",
					"  containerDirective[a]",
					"    list",
					"      listItem",
					"        containerDirective[b]",
					'          paragraph\n            text "x"'
				].join("\n")
			);
		});

		test("the same once a blank line has ended the list", () => {
			expect(parse(":::a\n- :::b\n  x\n\nafter\n:::")).toBe(
				[
					"root",
					"  containerDirective[a]",
					"    list",
					"      listItem",
					"        containerDirective[b]",
					'          paragraph\n            text "x"',
					'    paragraph\n      text "after"'
				].join("\n")
			);
		});

		test("two levels of list, neither closed", () => {
			expect(parse(":::a\n- :::b\n  - :::c\n    y\n:::")).toBe(
				[
					"root",
					"  containerDirective[a]",
					"    list",
					"      listItem",
					"        containerDirective[b]",
					"          list",
					"            listItem",
					"              containerDirective[c]",
					'                paragraph\n                  text "y"'
				].join("\n")
			);
		});

		/**
		 * Two markers push the content to column four, and a closing fence that far in is
		 * indented code, not a fence. So neither line is counted and the tally still
		 * balances.
		 */
		test("a marker deep enough to put the block out of reach is left alone", () => {
			expect(parse(":::outer\n- - :::inner\n    x\n    :::\n:::")).toBe(
				[
					"root",
					"  containerDirective[outer]",
					"    list",
					"      listItem",
					"        list",
					"          listItem",
					"            containerDirective[inner]",
					'              paragraph\n                text "x"'
				].join("\n")
			);
		});

		test("a dash with no space after it is text, not a marker", () => {
			// `-:::inner` is a paragraph, so nothing opens and the first bare `:::`
			// closes the outer block.
			expect(parse(":::outer\n-:::inner\n:::\n:::")).toBe(
				[
					"root",
					"  containerDirective[outer]",
					'    paragraph\n      text "-:::inner"',
					'  paragraph\n    text ":::"'
				].join("\n")
			);
		});

		test("a list item written back reads the same way again", () => {
			const markdown = ":::outer\n* :::inner\n  x\n  :::\n:::\n";

			expect(write(markdown)).toBe(markdown);
		});

		test("nested inside a block quote", () => {
			expect(parse("> :::a\n> :::b\n> x\n> :::\n> :::")).toBe(
				[
					"root",
					"  blockquote",
					"    containerDirective[a]",
					"      containerDirective[b]",
					'        paragraph\n          text "x"'
				].join("\n")
			);
		});

		test("a code fence inside the inner directive", () => {
			expect(parse(":::a\n:::b\n```\n:::\n```\n:::\n:::")).toBe(
				["root", "  containerDirective[a]", "    containerDirective[b]", '      code ":::"'].join("\n")
			);
		});

		test("a directive interrupts a paragraph", () => {
			expect(parse("text\n:::info\nbody\n:::")).toBe(
				["root", '  paragraph\n    text "text"', "  containerDirective[info]", '    paragraph\n      text "body"'].join(
					"\n"
				)
			);
		});
	});

	describe("shapes that should not throw the tally off", () => {
		test.each([
			["CRLF endings", ":::a\r\n:::b\r\nx\r\n:::\r\n:::\r\n"],
			["no trailing newline", ":::a\n:::b\nx\n:::\n:::"],
			["blank lines around the fences", ":::a\n\n:::b\n\nx\n\n:::\n\n:::"]
		])("%s", (_label, markdown) => {
			expect(parse(markdown)).toBe(
				["root", "  containerDirective[a]", "    containerDirective[b]", '      paragraph\n        text "x"'].join("\n")
			);
		});

		test("an empty directive inside a directive", () => {
			expect(parse(":::a\n:::b\n:::\n:::")).toBe(
				["root", "  containerDirective[a]", "    containerDirective[b]"].join("\n")
			);
		});

		test("a unicode name", () => {
			expect(parse(":::wärnung\nx\n:::")).toBe(
				["root", "  containerDirective[wärnung]", '    paragraph\n      text "x"'].join("\n")
			);
		});

		test("colons in an attribute value are not a fence", () => {
			expect(parse(':::a{x=":::"}\nbody\n:::')).toBe(
				["root", "  containerDirective[a]", '    paragraph\n      text "body"'].join("\n")
			);
		});

		test("a line of inline code holding colons", () => {
			expect(parse(":::a\n`:::`\n:::")).toBe(
				["root", "  containerDirective[a]", '    paragraph\n      inlineCode ":::"'].join("\n")
			);
		});

		test("ten levels deep", () => {
			const open = ":::d\n".repeat(10);
			const close = ":::\n".repeat(10);
			const expected = [
				"root",
				...Array.from({ length: 10 }, (_unused, level) => `${"  ".repeat(level + 1)}containerDirective[d]`),
				`${"  ".repeat(11)}paragraph`,
				`${"  ".repeat(12)}text "deep"`
			].join("\n");

			expect(parse(`${open}deep\n${close}`)).toBe(expected);
		});
	});

	/**
	 * Colons inside raw HTML are HTML, not a block that opens. Count one and the next
	 * line of colons would go to a directive nobody wrote, leaving this block open to
	 * the end of the document.
	 */
	describe("raw HTML", () => {
		test("a fence inside a raw HTML block is not counted", () => {
			expect(parse(":::a\n<div>\n:::b\n</div>\n:::")).toBe(
				["root", "  containerDirective[a]", '    html "<div>\\n:::b\\n</div>"'].join("\n")
			);
		});

		test("the same on a list marker line", () => {
			expect(parse(":::a\n- <div>\n  :::b\n  </div>\n:::")).toBe(
				["root", "  containerDirective[a]", "    list", "      listItem", '        html "<div>\\n:::b\\n</div>"'].join(
					"\n"
				)
			);
		});

		test("every kind of HTML block hides colons, not only tags", () => {
			for (const [open, close] of [
				["<!--", "-->"],
				["<![CDATA[", "]]>"],
				["<?php", "?>"],
				["<!DOCTYPE", ">"],
				["<script>", "</script>"],
				["<pre>", "</pre>"]
			]) {
				expect(parse(`:::a\n${open}\n:::b\n${close}\n:::`)).toBe(
					["root", "  containerDirective[a]", `    html "${open}\\n:::b\\n${close}"`].join("\n")
				);
			}
		});

		/**
		 * The reason the HTML is read with CommonMark's own `htmlFlow` and not by hand: a
		 * paragraph line can start with `<` too, and guessing it is HTML would be worse
		 * than not guessing at all.
		 */
		test("an autolink is a paragraph, not an HTML block", () => {
			expect(parse(":::a\n<https://example.test>\n:::")).toBe(
				["root", "  containerDirective[a]", "    paragraph", "      link", '        text "https://example.test"'].join(
					"\n"
				)
			);
		});

		test("a block that ends at a blank line stops hiding colons there", () => {
			expect(parse(":::a\n<div>\nx\n\n:::b\ny\n:::\n:::")).toBe(
				[
					"root",
					"  containerDirective[a]",
					'    html "<div>\\nx"',
					"    containerDirective[b]",
					'      paragraph\n        text "y"'
				].join("\n")
			);
		});
	});

	// An unclosed code fence used to swallow the closing colons. Both directions — a
	// fence left open and a fence closed — are pinned in `enhanced-micromark-directive-parts.test.ts`,
	// next to the upstream reading of the same document.

	describe("the extension object", () => {
		test("building it twice leaves upstream's own grammar alone", () => {
			const before = JSON.stringify(Object.keys(directive().flow ?? {}));

			enhancedDirective();
			enhancedDirective();

			expect(JSON.stringify(Object.keys(directive().flow ?? {}))).toBe(before);
			expect(enhancedDirective().text).toEqual(directive().text);
		});
	});

	describe("source mode loses nothing", () => {
		test.each([
			[":::warning\nwarning content\n\n:::info\ninfo\n:::\n\nfooter text\n:::"],
			[":::a\n:::b\n:::c\nC\n:::\nafterC\n:::\nafterB\n:::\nafterA"],
			[":::warning\n```js\n:::info\n```\nreal\n:::"],
			[":::info\n:::-nope\n:::\nafter"],
			[":::info\n> :::\nstill inside\n:::"],
			[":::info\ntext\n\n    :::\n\nmore\n:::"],
			[":::info\nbody\n::: nope"],
			["::::warning\nouter\n\n:::info\ninner\n:::\n\nfooter\n::::"],
			[":::info\n~~~\n:::\n~~~\nafter\n:::"],
			[":::info\n````\n```\n:::\n```\n````\nafter\n:::"],
			[":::warning\n:::info\ninfo\n:::"],
			[":::a\n\n  :::b\n  inner\n  :::\n\n:::"],
			["- :::info\n  body\n  :::"],
			["> :::info\n> body\n> :::"],
			["- :::a\n  :::b\n  x\n  :::\n  :::"],
			["> :::a\n> :::b\n> x\n> :::\n> :::"],
			[":::a\r\n:::b\r\nx\r\n:::\r\n:::"],
			["text\n:::info\nbody\n:::"],
			[":::a\n<div>\n:::b\n</div>\n:::"],
			[":::a\n::::b\nx\n:::\nafter\n:::"],
			[':::a{x=":::"}\nbody\n:::'],
			[":::a\n`:::`\n:::"],
			[":::wärnung\nx\n:::"],
			[":::a\n:::b\n:::\n:::"],
			[":::a\n- ```\n  :::\n  ```\n:::"],
			[":::a\n- <div>\n  :::b\n  </div>\n:::"],
			[":::a\n<!--\n:::b\n-->\n:::"],
			[":::a\n<https://example.test>\n:::"],
			[":::a\n1. ~~~\n   :::\n   ~~~\n:::"],
			[":::a\n-\t:::b\n\tx\n\t:::\n:::"],
			[":::a\n~~~x~~~\n:::\n~~~\nafter\n:::"],
			[":::info\nUse **info** panels.\n\n:::warning\nwarning text\n:::\n\ntext here\n\n::::info"],
			[":::::info\nbody\n:::::"],
			[":::a\n:::b\n:::c\nC\n:::\nafterC"]
		])("%j", (markdown) => {
			expect(tokenText(tokenize(markdown))).toBe(markdown);
		});
	});
});
