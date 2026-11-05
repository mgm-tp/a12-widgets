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

import { configExtension } from "@lexical/extension";
import type { MdastConfig, MdastExportHandler } from "@lexical/mdast";
import { MdastImportExtension } from "@lexical/mdast";
import type { AnyLexicalExtensionArgument, LexicalNode, TextNode } from "lexical";
import { $isTextNode, defineExtension, TEXT_TYPE_TO_FORMAT } from "lexical";
import type { PhrasingContent } from "mdast";
import type { Token } from "micromark-util-types";

import type { CustomInlineFormatEntry } from "../utils/constants.js";

import { micromarkCustomInlineSyntaxes } from "./micromark-extension-custom-syntaxes.js";

/*
 * The mdast nodes the four formats parse into.
 * Each node keeps what sits between its tags as children, so nothing inside is lost:
 *
 * ```
 * <mark>a *b*</mark>  →  inlineHighlight [ text "a ", emphasis [ text "b" ] ]
 * ```
 *
 * They are declared here with `declare module` — mdast's own way to add node types
 * so the rest of the code sees them as normal mdast nodes.
 */
declare module "mdast" {
	interface InlineSubscript extends Parent {
		type: "inlineSubscript";
		children: PhrasingContent[];
	}
	interface InlineSuperscript extends Parent {
		type: "inlineSuperscript";
		children: PhrasingContent[];
	}
	interface InlineUnderline extends Parent {
		type: "inlineUnderline";
		children: PhrasingContent[];
	}
	interface InlineHighlight extends Parent {
		type: "inlineHighlight";
		children: PhrasingContent[];
	}
	interface PhrasingContentMap {
		inlineSubscript: InlineSubscript;
		inlineSuperscript: InlineSuperscript;
		inlineUnderline: InlineUnderline;
		inlineHighlight: InlineHighlight;
	}
	interface RootContentMap {
		inlineSubscript: InlineSubscript;
		inlineSuperscript: InlineSuperscript;
		inlineUnderline: InlineUnderline;
		inlineHighlight: InlineHighlight;
	}
}

type FromMarkdownExtension = MdastConfig["mdastExtensions"][number];

/**
 * Builds the mdast nodes for the tokens {@link micromarkCustomInlineSyntaxes} reports.
 *
 * For `<mark>a *b*</mark>`:
 *
 * ```
 * micromark tokens                       mdast
 *
 * inlineHighlight                        inlineHighlight
 *   customInlineFormatMarker "<mark>"      text     "a "
 *   inlineHighlightText                    emphasis
 *     data "a "                              text   "b"
 *     emphasis "*b*"
 *   customInlineFormatMarker "</mark>"
 * ```
 *
 * Only `inlineHighlight` gets a handler: `enter` opens the node, `exit` closes it,
 * so the tokens in between land inside. A token with no handler makes no node,
 * which is what the two inner types need — `customInlineFormatMarker` holds a tag,
 * so the tags disappear; `inlineHighlightText` only wraps what sits between them,
 * so that content lands on the run node itself.
 */
function mdastCustomInlineFormatsFromMarkdown(enabledEntries: CustomInlineFormatEntry[]): FromMarkdownExtension {
	const enter: FromMarkdownExtension["enter"] = {};
	const exit: FromMarkdownExtension["exit"] = {};

	for (const { tokenType } of enabledEntries) {
		enter[tokenType] = function (token: Token) {
			this.enter({ type: tokenType, children: [] }, token);
		};

		exit[tokenType] = function (token: Token) {
			this.exit(token);
		};
	}

	return { canContainEols: enabledEntries.map(({ tokenType }) => tokenType), enter, exit };
}

/**
 * A text node's bold / italic / code / strikethrough → mdast.
 *
 * ```
 * "x" [italic, bold]  →  strong [ emphasis [ text "x" ] ]  →  ***x***
 * ```
 *
 * Same as `phrasingFromFormattedText` in `@lexical/mdast`, which the package does not export.
 * {@link $exportInlineFormat} builds its own phrasing, so it has to nest these
 * the way the core text handler would.
 */
function getCorePhrasing(node: TextNode): PhrasingContent {
	const value = node.getTextContent();
	let content: PhrasingContent = node.hasFormat("code") ? { type: "inlineCode", value } : { type: "text", value };

	if (node.hasFormat("italic")) {
		content = { type: "emphasis", children: [content] };
	}

	if (node.hasFormat("bold")) {
		content = { type: "strong", children: [content] };
	}

	if (node.hasFormat("strikethrough")) {
		content = { type: "delete", children: [content] };
	}

	return content;
}

/** The tags `node` needs, innermost first. A highlighted subscript needs `<sub>` and `<mark>`. */
function findTagsOnNode(node: LexicalNode, enabledEntries: CustomInlineFormatEntry[]): CustomInlineFormatEntry[] {
	return $isTextNode(node) ? enabledEntries.filter(({ format }) => node.hasFormat(format)) : [];
}

/** Whether two nodes need the same tags, so `<mark>a </mark><mark>b</mark>` can be `<mark>a b</mark>`. */
function isSameTags(one: LexicalNode, other: LexicalNode, enabledEntries: CustomInlineFormatEntry[]): boolean {
	const oneTags = findTagsOnNode(one, enabledEntries);
	const otherTags = findTagsOnNode(other, enabledEntries);

	return oneTags.length === otherTags.length && oneTags.every((tag) => otherTags.includes(tag));
}

const createInlineFormatExporter =
	(enabledEntries: CustomInlineFormatEntry[]): MdastExportHandler =>
	(node, ctx) => {
		const tags = findTagsOnNode(node, enabledEntries);

		// Nothing of ours on this node. Returning null hands it to the core text handler.
		if (tags.length === 0 || !$isTextNode(node)) {
			return null;
		}

		const previous = node.getPreviousSibling();

		// `<mark>a *b* c</mark>` is three text nodes in the editor: "a ", "b" (italic), " c".
		// Export asks each node what to write. Answer one by one and each gets its own tags:
		// `<mark>a </mark><mark>*b*</mark><mark> c</mark>`. Lexical usually joins neighbour text nodes
		// before asking, but it stops doing that for a node type with its own export rule, and `"text"`
		// has one now. So the first node writes all three (the loop below) and the others write nothing.
		// This is the "write nothing" part.
		//
		// `[]` means "wrote nothing". `null` would mean "not mine", and the core handler would write
		// the text again.
		//
		// `isIncluded`: with a selection, the node before this one may not be selected.
		// It wrote nothing then, so this node is the first one and has to write the run itself.
		if (previous !== null && ctx.isIncluded(previous) && isSameTags(previous, node, enabledEntries)) {
			return [];
		}

		let content: PhrasingContent[] = [getCorePhrasing(node)];
		let next = node.getNextSibling();

		// The rest of the run: the next nodes that need the same tags.
		while (next !== null && $isTextNode(next) && ctx.isIncluded(next) && isSameTags(next, node, enabledEntries)) {
			content.push(getCorePhrasing(next));
			next = next.getNextSibling();
		}

		// The tags go in as `html` nodes, not `text`. The serializer escapes `<` inside text,
		// so `{ type: "text", value: "<mark>" }` reaches the markdown as `\<mark>`. An `html` node is copied as it is.
		for (const { open, close } of tags) {
			content = [{ type: "html", value: open }, ...content, { type: "html", value: close }];
		}

		return content;
	};

/**
 * The extension for one set of formats, so each is turned on by its own `features` key.
 *
 * A format left out is not parsed and not written: its tags stay ordinary inline HTML,
 * which is what they already look like to any other markdown reader.
 */
export function defineInlineFormatsExtension(enabledEntries: CustomInlineFormatEntry[]): AnyLexicalExtensionArgument {
	return defineExtension({
		name: "@a12/mdast/InlineFormats",
		dependencies: [
			configExtension(MdastImportExtension, {
				micromarkExtensions: [micromarkCustomInlineSyntaxes(enabledEntries)],
				mdastExtensions: [mdastCustomInlineFormatsFromMarkdown(enabledEntries)],
				importRules: enabledEntries.map(({ tokenType, format }) => ({
					type: tokenType,
					$import: (node, ctx): LexicalNode[] => ctx.importChildren(node, TEXT_TYPE_TO_FORMAT[format])
				})),
				exportRules: [{ type: "text", $export: createInlineFormatExporter(enabledEntries) }],
				inlineShortcutTypes: enabledEntries.map(({ tokenType }) => tokenType),
				inlineShortcutTriggers: [">"]
			})
		]
	});
}

/**
 * Which marker to write when the editor has to pick one.
 *
 * ```
 * typed `+ item`            →  `+ item`   the marker was typed, so it is written back
 * bullet list from toolbar  →  `- item`   no marker was ever typed, so this one is used
 * ```
 *
 * Without this the defaults are `*`: `* item` for a bullet, `***` for a horizontal rule.
 * `-` is what people write. `emphasis` and `strong` are `*` already,
 * listed so all four markers sit together.
 *
 * Tables keep mdast's `| - |` row instead of `| --- |`.
 * `MdastTableExtension` has its own table handler, so the padding option never reaches it.
 * Both are valid GFM.
 */
export const MdastSerializerDefaultsExtension = defineExtension({
	name: "@a12/mdast/SerializerDefaults",
	dependencies: [
		configExtension(MdastImportExtension, {
			toMarkdownExtensions: [{ rule: "-", bullet: "-", emphasis: "*", strong: "*" }]
		})
	]
});
