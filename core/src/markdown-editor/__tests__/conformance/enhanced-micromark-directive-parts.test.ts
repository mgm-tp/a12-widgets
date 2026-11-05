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
 * The rest of a `:::` line: the fence, the name, the label, the attributes.
 *
 * `enhanced-micromark-directive.test.ts` next door is about nesting — which line closes which block.
 * This file is about everything else on the line, and about the three files the fork
 * copied from upstream to read it: `factory-name`, `factory-label`, `factory-attributes`.
 *
 * Those three were copied character for character, so most cases here also check that the
 * fork answers exactly as `micromark-extension-directive` does.
 * If a future copy of an upstream file drops something, the parity tests below say so.
 */

import { directiveFromMarkdown, directiveToMarkdown } from "mdast-util-directive";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import { directive } from "micromark-extension-directive";
import { codes } from "micromark-util-symbol";
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
	attributes?: Record<string, string | null | undefined>;
	children?: NamedNode[];
}

/** The tree as one line per node, `type[name]{attributes} "value"`, indented by depth. */
function outline(node: NamedNode, depth = 0): string[] {
	const name = node.name === undefined ? "" : `[${node.name}]`;
	const attributes = node.attributes && Object.keys(node.attributes).length > 0 ? JSON.stringify(node.attributes) : "";
	const value = node.value === undefined ? "" : ` ${JSON.stringify(node.value)}`;
	const own = `${"  ".repeat(depth)}${node.type}${name}${attributes}${value}`;

	return [own, ...(node.children ?? []).flatMap((child) => outline(child, depth + 1))];
}

function tree(markdown: string, grammar = enhancedDirective()) {
	return fromMarkdown(markdown, { extensions: [grammar], mdastExtensions: [directiveFromMarkdown()] });
}

function parse(markdown: string): string {
	return outline(tree(markdown) as unknown as NamedNode).join("\n");
}

/** The same document read by upstream's grammar, for the parity cases. */
function parseUpstream(markdown: string): string {
	return outline(tree(markdown, directive()) as unknown as NamedNode).join("\n");
}

function write(markdown: string, options?: Parameters<typeof enhancedDirectiveToMarkdown>[0]): string {
	return toMarkdown(tree(markdown), { extensions: [enhancedDirectiveToMarkdown(options)] });
}

const tokenize = createSourceTokenizer([enhancedDirective()]);

function tokenText(tokens: SourceToken[]): string {
	return tokens.map((token) => (token.kind === "text" ? token.text : tokenText(token.children))).join("");
}

/** One directive holding `body`, the shape most cases below expect. */
function oneDirective(name: string, attributes = ""): string {
	return ["root", `  containerDirective[${name}]${attributes}`, '    paragraph\n      text "body"'].join("\n");
}

/** The whole document read as one paragraph, which is what a rejected fence line gives. */
function oneParagraph(text: string): string {
	return ["root", `  paragraph\n    text ${JSON.stringify(text)}`].join("\n");
}

describe("the fence line", () => {
	test("a space between the colons and the name does not open a block", () => {
		expect(parse("::: warning\nbody\n:::\n")).toBe(oneParagraph("::: warning\nbody\n:::"));
	});

	test("trailing colons on the opener do not open a block", () => {
		// The same rule fenced code has: nothing but the info string after the fence.
		expect(parse(":::warning:::\nbody\n:::\n")).toBe(oneParagraph(":::warning:::\nbody\n:::"));
	});

	test.each([
		["one space", " "],
		["two spaces", "  "],
		["three spaces", "   "]
	])("an opener indented by %s still opens", (_label, indent) => {
		expect(parse(`${indent}:::a\nbody\n:::\n`)).toBe(oneDirective("a"));
	});

	test("an opener indented by four spaces is code", () => {
		expect(parse("    :::a\nbody\n:::\n")).toBe(
			["root", '  code ":::a"', '  paragraph\n    text "body\\n:::"'].join("\n")
		);
	});

	test.each([
		["one space", " "],
		["two spaces", "  "],
		["three spaces", "   "]
	])("a closing fence indented by %s still closes", (_label, indent) => {
		expect(parse(`:::a\nbody\n${indent}:::\n`)).toBe(oneDirective("a"));
	});

	test("a tab right after the closing colons still closes", () => {
		// Micromark hands a tab over as its own code, not as the character, so the check
		// for "is a name next?" has to ask for it by name. Without that, `:::\t` looked
		// like an opener and the document grew a block nobody wrote.
		expect(parse(":::a\nbody\n:::\t\n")).toBe(oneDirective("a"));
		expect(write(":::a\nbody\n:::\t\n")).toBe(":::a\nbody\n:::\n");
	});

	test("a tab after the closing colons on CRLF lines closes too", () => {
		expect(parse(":::a\r\nbody\r\n:::\t\r\n")).toBe(oneDirective("a"));
	});

	test("a tab after the opener's attributes is allowed", () => {
		expect(parse(":::a{b=c}\t\nbody\n:::\n")).toBe(oneDirective("a", '{"b":"c"}'));
	});

	test("more than three colons do not open a block", () => {
		expect(parse("::::a\nbody\n::::\n")).toBe(oneParagraph("::::a\nbody\n::::"));
		expect(parse(":::::a\nbody\n:::::\n")).toBe(oneParagraph(":::::a\nbody\n:::::"));
	});

	test("three colons with no name is a paragraph", () => {
		expect(parse(":::\nbody\n:::\n")).toBe(oneParagraph(":::\nbody\n:::"));
	});

	test("an escaped opener is text", () => {
		expect(parse("\\:::a\nbody\n:::\n")).toBe(oneParagraph(":::a\nbody\n:::"));
	});
});

describe("the name", () => {
	test.each([
		["letters", "warning"],
		["letters and digits", "a1"],
		["dashes and underscores inside", "a-b_c1"],
		["a digit first, which the docs do not promise but the code takes", "1a"]
	])("%s open a block", (_label, name) => {
		expect(parse(`:::${name}\nbody\n:::\n`)).toBe(oneDirective(name));
	});

	test.each([
		["an underscore first", "_a"],
		["a dash first", "-a"],
		["a dot inside", "a.b"],
		["a dash at the end", "a-"],
		["an underscore at the end", "a_"]
	])("%s does not open a block", (_label, name) => {
		expect(parse(`:::${name}\nbody\n:::\n`)).toBe(oneParagraph(`:::${name}\nbody\n:::`));
	});

	test("a tab inside the name is part of the name", () => {
		// Not a shape anyone writes on purpose. Recorded because the fork counts this line
		// as an opener, and it has to agree with the name reader about that. One level
		// deep, the parity table below reads the same line with upstream's grammar.
		expect(parse(":::a\n:::b\tx\nbody\n:::\n:::\n")).toBe(
			["root", "  containerDirective[a]", "    containerDirective[b\tx]", '      paragraph\n        text "body"'].join(
				"\n"
			)
		);
	});
});

describe("the label", () => {
	test("an empty label is allowed and holds nothing", () => {
		expect(parse(":::note[]\nbody\n:::\n")).toBe(
			["root", "  containerDirective[note]", "    paragraph", '    paragraph\n      text "body"'].join("\n")
		);
	});

	test("a label reads markdown, so emphasis inside it is emphasis", () => {
		expect(parse(":::note[a *b* c]\nbody\n:::\n")).toBe(
			[
				"root",
				"  containerDirective[note]",
				'    paragraph\n      text "a "\n      emphasis\n        text "b"\n      text " c"',
				'    paragraph\n      text "body"'
			].join("\n")
		);
	});

	test("brackets inside a label are allowed while they balance", () => {
		expect(parse(":::note[a [b] c]\nbody\n:::\n")).toBe(
			[
				"root",
				"  containerDirective[note]",
				'    paragraph\n      text "a [b] c"',
				'    paragraph\n      text "body"'
			].join("\n")
		);
	});

	test("an escaped bracket closes nothing", () => {
		expect(parse(":::note[a \\] b]\nbody\n:::\n")).toBe(
			[
				"root",
				"  containerDirective[note]",
				'    paragraph\n      text "a ] b"',
				'    paragraph\n      text "body"'
			].join("\n")
		);
	});

	test("a label may not run over a line ending", () => {
		expect(parse(":::note[a\nb]\nbody\n:::\n")).toBe(oneParagraph(":::note[a\nb]\nbody\n:::"));
	});

	test("text after the label does not open a block", () => {
		expect(parse(":::note[a]extra\nbody\n:::\n")).toBe(oneParagraph(":::note[a]extra\nbody\n:::"));
	});
});

describe("the attributes", () => {
	test.each([
		["a bare name", "{b}", '{"b":""}'],
		["an empty double-quoted value", '{b=""}', '{"b":""}'],
		["an unquoted value", "{b=c}", '{"b":"c"}'],
		["a single-quoted value", "{b='c'}", '{"b":"c"}'],
		["a double-quoted value", '{b="c"}', '{"b":"c"}'],
		["a value holding a closing brace", '{b="}"}', '{"b":"}"}'],
		["the id and class shortcuts", "{#i .c1 .c2}", '{"id":"i","class":"c1 c2"}'],
		["two ids, where the last one wins", "{#i1 #i2}", '{"id":"i2"}'],
		["classes from both spellings, combined", "{.red class=green .blue}", '{"class":"red green blue"}'],
		["a space before the closing brace", "{b=c }", '{"b":"c"}']
	])("%s", (_label, attributes, expected) => {
		expect(parse(`:::a${attributes}\nbody\n:::\n`)).toBe(oneDirective("a", expected));
	});

	test("attributes may not run over a line ending", () => {
		expect(parse(":::a{b=c\nd=e}\nbody\n:::\n")).toBe(oneParagraph(":::a{b=c\nd=e}\nbody\n:::"));
	});

	test("an unclosed brace does not open a block", () => {
		expect(parse(":::a{b\nbody\n:::\n")).toBe(oneParagraph(":::a{b\nbody\n:::"));
	});

	test("trailing space after the attributes still opens", () => {
		expect(parse(":::a{b=c} \nbody\n:::\n")).toBe(oneDirective("a", '{"b":"c"}'));
	});
});

/**
 * Everything a directive line holds — name, label, attributes — is read by three files
 * copied from upstream. For a document that needs no nesting, the fork must therefore give
 * exactly upstream's answer. A difference here means the copy drifted.
 */
describe("one level deep reads the same as upstream", () => {
	test.each([
		[":::a\nbody\n:::\n"],
		[':::note[Hi *there*]{#i .c d="e"}\nbody\n:::\n'],
		[":::a{.red class=green .blue}\nbody\n:::\n"],
		[":::1a\nbody\n:::\n"],
		[":::b\tx\nbody\n:::\n"],
		[":::a.b\nbody\n:::\n"],
		[":::note[a\nb]\nbody\n:::\n"],
		[":::a{b\nbody\n:::\n"],
		["::: warning\nbody\n:::\n"],
		[":::warning:::\nbody\n:::\n"],
		['::figure[caption]{src="x"}\n'],
		["::\n"],
		['text :abbr[HTML]{title="x"} end\n'],
		["text :red: end\n"],
		["text :red[] end\n"],
		[":::a\n> quote\n:::\n"],
		["- :::a\n  body\n  :::\n"],
		["    :::a\nbody\n:::\n"],
		[":::a\n```js\nconst a = 1;\n```\n:::\n"]
	])("%j", (markdown) => {
		expect(parse(markdown)).toBe(parseUpstream(markdown));
	});

	test("the text grammar is upstream's, and the flow grammar keeps upstream's second construct", () => {
		const ourFlow = enhancedDirective().flow?.[codes.colon] as unknown[];
		const upstreamFlow = directive().flow?.[codes.colon] as unknown[];

		expect(enhancedDirective().text).toEqual(directive().text);
		// Only the container is replaced; the leaf construct behind it stays upstream's.
		expect(ourFlow).toHaveLength(upstreamFlow.length);
		expect(ourFlow[1]).toBe(upstreamFlow[1]);
	});
});

describe("writing markdown back", () => {
	test.each([
		["the default quote", undefined, ':::a{b="c"}\nbody\n:::\n'],
		["a single quote", { quote: "'" as const }, ":::a{b='c'}\nbody\n:::\n"],
		["no quotes where none are needed", { preferUnquoted: true }, ":::a{b=c}\nbody\n:::\n"]
	])("%s", (_label, options, expected) => {
		expect(write(':::a{b="c"}\nbody\n:::\n', options)).toBe(expected);
	});

	test("an empty attribute keeps its value when asked", () => {
		expect(write(":::a{b}\nbody\n:::\n")).toBe(":::a{b}\nbody\n:::\n");
		expect(write(":::a{b}\nbody\n:::\n", { collapseEmptyAttributes: false })).toBe(':::a{b=""}\nbody\n:::\n');
	});

	test("the id and class shortcuts can be turned off", () => {
		expect(write(":::a{#i .c}\nbody\n:::\n")).toBe(":::a{#i .c}\nbody\n:::\n");
		expect(write(":::a{#i .c}\nbody\n:::\n", { preferShortcut: false })).toBe(':::a{id="i" class="c"}\nbody\n:::\n');
	});

	test("the options reach a block nested inside another", () => {
		expect(write(':::a\n:::b{c="d"}\nbody\n:::\n:::\n', { quote: "'" })).toBe(":::a\n:::b{c='d'}\nbody\n:::\n:::\n");
	});

	test("only the container block is written differently from upstream", () => {
		// `directiveToMarkdown` builds new handler functions on every call, so the two
		// sets cannot be compared by identity. Compare what they write instead.
		const asUpstream = (markdown: string): string =>
			toMarkdown(tree(markdown), { extensions: [directiveToMarkdown()] });

		expect(asUpstream('::figure[caption]{src="x"}\n')).toBe(write('::figure[caption]{src="x"}\n'));
		expect(asUpstream('text :abbr[HTML]{title="x"} end\n')).toBe(write('text :abbr[HTML]{title="x"} end\n'));
		expect(enhancedDirectiveToMarkdown().unsafe).toEqual(directiveToMarkdown().unsafe);

		// The one difference: upstream widens the outer fence of a nested block.
		expect(asUpstream(":::a\n:::b\nbody\n:::\n:::\n")).toContain("::::");
		expect(write(":::a\n:::b\nbody\n:::\n:::\n")).not.toContain("::::");
	});
});

/**
 * Documents the fork reads better than upstream, because its fence check reads the line
 * prefix and counts what opened inside. Upstream compares colon counts only, so it loses
 * the closing fence of these.
 */
describe("better than upstream", () => {
	test.each([
		["a closing fence indented three spaces", ":::a\n:::b\nbody\n   :::\n:::\n"],
		["a blank line before the last fence", ":::a\n:::b\nbody\n:::\n\n:::\n"],
		["a code fence indented inside the block", ":::a\n  ```\n  :::\n  ```\n:::\n"],
		["a long code fence holding a shorter one", ":::a\n````js\n```\n:::\n````\nbody\n:::\n"],
		["two levels inside two list levels", "- - :::a\n    :::b\n    body\n    :::\n    :::\n"],
		["two levels inside two block quotes", ">> :::a\n>> :::b\n>> body\n>> :::\n>> :::\n"]
	])("%s", (_label, markdown) => {
		expect(parse(markdown)).not.toBe(parseUpstream(markdown));
		// Nothing is left over: the last fence belongs to the outer block, so no stray
		// `:::` paragraph and no code block full of the rest of the document.
		expect(parse(markdown)).not.toContain('text ":::"');
	});
});

/**
 * A code block hides colons, but only while it has an ending of its own. Which way a
 * fence line is read turns on that, so both directions are pinned down here.
 */
describe("a code fence that is never closed", () => {
	test("does not swallow the closing colons", () => {
		// Half-typed documents look like this all the time: the opening fence is there
		// and the closing one is not yet. Reading the rest of the file as code would let
		// the block run away with it.
		expect(parse(":::a\n```\nnever closed\n:::\n")).toBe(
			["root", "  containerDirective[a]", '    code "never closed"'].join("\n")
		);
		expect(parseUpstream(":::a\n```\nnever closed\n:::\n")).toBe(
			["root", "  containerDirective[a]", '    code "never closed"'].join("\n")
		);
	});

	test("leaves what follows the block outside it", () => {
		expect(parse(":::a\n```\nx\n:::\n\n# After\n")).toBe(
			["root", "  containerDirective[a]", '    code "x"', "  heading", '    text "After"'].join("\n")
		);
	});

	test("a document written back reads the same way again", () => {
		const once = write(":::a\n```\nnever closed\n:::\n");

		expect(once).toBe(":::a\n```\nnever closed\n```\n:::\n");
		expect(write(once)).toBe(once);
	});

	/**
	 * The other direction. A closed code block really is content, so the colons in it
	 * stay code — showing this very syntax in a code sample has to work. Upstream reads
	 * the block's own fence out of the code here.
	 */
	test("a closed one still hides the colons", () => {
		expect(parse(":::a\n```\n:::\n```\nafter\n:::\n")).toBe(
			["root", "  containerDirective[a]", '    code ":::"', "    paragraph", '      text "after"'].join("\n")
		);
		expect(parseUpstream(":::a\n```\n:::\n```\nafter\n:::\n")).toBe(
			["root", "  containerDirective[a]", '    code ""', '  code "after\\n:::"'].join("\n")
		);
	});
});

describe("source mode loses nothing", () => {
	test.each([
		[":::a\nbody\n:::\t"],
		["::: warning\nbody\n:::"],
		[":::warning:::\nbody\n:::"],
		["   :::a\nbody\n   :::"],
		[":::note[a *b* c]{#i .c1 .c2}\nbody\n:::"],
		[":::note[a [b] c]\nbody\n:::"],
		[":::a{b=\"}\" c='d' e}\nbody\n:::"],
		[":::a{b=c\nd=e}\nbody\n:::"],
		[":::a{b\nbody\n:::"],
		[":::a-\nbody\n:::"],
		[":::a\n```\nnever closed\n:::"],
		[":::a\n  ```\n  :::\n  ```\n:::"],
		["- - :::a\n    :::b\n    body\n    :::\n    :::"],
		[">> :::a\n>> :::b\n>> body\n>> :::\n>> :::"],
		["text :red: end"],
		[":::::a\nbody\n:::::"],
		[":::b\tx\nbody\n:::"]
	])("%j", (markdown) => {
		expect(tokenText(tokenize(markdown))).toBe(markdown);
	});
});
