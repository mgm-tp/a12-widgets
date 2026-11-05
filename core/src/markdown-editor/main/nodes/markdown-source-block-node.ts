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

import type { LexicalNode, SerializedParagraphNode } from "lexical";
import { $applyNodeReplacement, $createLineBreakNode, $createTabNode, ParagraphNode } from "lexical";

import type { SourceToken, SourceTokenType } from "../source-highlighting/source-token.js";
import { getHeadingLevel, TRANSPARENT_TOKEN_TYPES } from "../source-highlighting/source-token.js";

import { $createMarkdownTokenNode } from "./markdown-token-node.js";
import { $createMarkdownTokenTextNode } from "./markdown-token-text-node.js";

/**
 * One node of a source block, ready to build.
 *
 * A `text` entry carries a `type` when it is the whole of a token — see {@link MarkdownTokenTextNode.__tokenType}.
 * Without that type a text node has no class of its own,
 * so every token needs an element around it to carry one:
 *
 * ```
 * <span class="mde-token--atxHeadingSequence"><span>###</span></span>   without a type
 * <span class="mde-token--atxHeadingSequence">###</span>                with one
 * ```
 */
export type NormalizedSourceToken =
	| { kind: "text"; text: string; type?: SourceTokenType }
	| { kind: "break" }
	| { kind: "tab" }
	| {
			kind: "element";
			type: SourceTokenType;
			level: number;
			children: NormalizedSourceToken[];
	  };

/**
 * Whether the token is nothing but text, so it can be the text node itself.
 *
 * True for `atxHeadingSequence`, which is only `###`, and when the text sits under a chain of
 * {@link TRANSPARENT_TOKEN_TYPES} like `atxHeadingText > data`.
 * False once the token has more than one child:
 * `atxHeading` holds the `###`, a space and the title, so it stays an element.
 */
function shouldFoldIntoText(
	children: NormalizedSourceToken[]
): children is [{ kind: "text"; text: string; type?: SourceTokenType }] {
	const onlyChild = children.length === 1 ? children[0]! : undefined;

	if (onlyChild?.kind !== "text") {
		return false;
	}

	const { type } = onlyChild;

	// Raw characters from the tokenizer: no token has taken them over yet, so this one can.
	// Every leaf starts this way, which is what gets the folding going in the first place.
	const isUnclaimedText = type === undefined;

	return isUnclaimedText || TRANSPARENT_TOKEN_TYPES.has(type);
}

/**
 * Moves the line breaks at the end of a token out, so they sit after the token instead of inside it.
 * `children` loses them and they come back in the same order.
 *
 * A `<br>` at the end of an inline `<span>` shows nothing — the browser drops it.
 * Lexical adds a second `<br>` to make a last newline visible,
 * but only when the block's own last child is a line break.
 *
 * Most constructs end before their newline, so micromark keeps it outside them.
 * The ones that stay open do not: an unclosed code fence or container directive takes the newline in.
 * That is why Enter at the end of an open fence needed TWO presses to add one line.
 *
 * Only the breaks at the end move, so the newlines inside a fence stay put.
 * Nothing else changes: a newline has no highlighting, and the block's text is the same either way.
 */
function takeTrailingBreaks(children: NormalizedSourceToken[]): NormalizedSourceToken[] {
	const breaks: NormalizedSourceToken[] = [];

	while (children[children.length - 1]?.kind === "break") {
		breaks.unshift(children.pop()!);
	}

	return breaks;
}

/**
 * Flattens a token's text into the pieces Lexical can hold.
 *
 * A `TextNode` cannot contain a newline or a tab — Lexical models them as `LineBreakNode` / `TabNode`
 * so the raw text of a token is cut at each of them and the separators become their own entries.
 *
 * The split happens here, not in `$buildNodesFromNormalizedTokens`, so the token list has
 * the same shape as the node list the tree holds — that 1:1 match is what lets
 * the structural diff compare them node by node instead of rebuilding the block.
 */
export function normalizeSourceTokens(tokens: SourceToken[]): NormalizedSourceToken[] {
	const normalizedTokens: NormalizedSourceToken[] = [];

	for (const token of tokens) {
		if (token.kind === "element") {
			const children = normalizeSourceTokens(token.children);
			const trailingBreaks = takeTrailingBreaks(children);
			const hasOnlyChild = children.length === 1;
			const onlyChild = hasOnlyChild ? children[0]! : undefined;

			// micromark sometimes wraps a single tab in a token of its own.
			// Building that token would put a `<span>` around every tab in a fence or a list.
			// The span holds no text, has no style, and nothing looks it up by type,
			// so use the tab alone and drop it.
			// A token wrapping a single line break is handled already:
			// `takeTrailingBreaks` took the break out, so the token arrives here with no children left.
			if (onlyChild?.kind === "tab") {
				normalizedTokens.push(onlyChild, ...trailingBreaks);

				continue;
			}

			if (shouldFoldIntoText(children)) {
				normalizedTokens.push({ kind: "text", text: children[0].text, type: token.type }, ...trailingBreaks);

				continue;
			}

			// Everything the token held was a line ending, so there is nothing left to wrap.
			if (children.length > 0) {
				normalizedTokens.push({ kind: "element", type: token.type, level: getHeadingLevel(token), children });
			}

			normalizedTokens.push(...trailingBreaks);

			continue;
		}

		// The capture group makes `split` keep the separators, so the parts alternate
		// between text and a single `\n` or `\t` — a break, a tab, and text nodes.
		for (const part of token.text.split(/(\n|\t)/)) {
			if (part === "") {
				continue;
			}

			if (part === "\n") {
				normalizedTokens.push({ kind: "break" });
			} else if (part === "\t") {
				normalizedTokens.push({ kind: "tab" });
			} else {
				normalizedTokens.push({ kind: "text", text: part });
			}
		}
	}

	return normalizedTokens;
}

/**
 * Turns normalized tokens into the Lexical nodes the source block holds.
 *
 * Each token becomes exactly one node, in the same order: `break` a `LineBreakNode`,
 * `tab` a `TabNode`, `text` a `MarkdownTokenTextNode`
 * and `element` a `MarkdownTokenNode` with its children built the same way.
 *
 * @param tokens a whole block, or just the range the diff splices in
 */
export function $buildNodesFromNormalizedTokens(tokens: NormalizedSourceToken[]): LexicalNode[] {
	return tokens.map((token) => {
		if (token.kind === "break") {
			return $createLineBreakNode();
		}

		if (token.kind === "tab") {
			return $createTabNode();
		}

		if (token.kind === "text") {
			return $createMarkdownTokenTextNode(token.text, token.type);
		}

		const element = $createMarkdownTokenNode(token.type, token.level);

		element.append(...$buildNodesFromNormalizedTokens(token.children));

		return element;
	});
}

/**
 * Turns raw tokenizer output into the Lexical nodes that a source block takes as its children.
 *
 * Same as {@link $buildNodesFromNormalizedTokens}, but normalizes the raw tokenizer output automatically.
 */
export function $buildNodesFromSourceTokens(tokens: SourceToken[]): LexicalNode[] {
	return $buildNodesFromNormalizedTokens(normalizeSourceTokens(tokens));
}

/**
 * One markdown block in source mode — a paragraph, a heading, a whole fenced code block
 * with its text held as token nodes.
 *
 * Everything works one block at a time: the tokenizer parses a block's text,
 * the diff patches a block's children and the document's markdown is all the blocks' text joined.
 *
 * Extends `ParagraphNode` to get Lexical's block behavior for free
 * and only renders a `div.mde-source-block` instead of a `p`.
 */
export class MarkdownSourceBlockNode extends ParagraphNode {
	static getType(): string {
		return "mde-source-block";
	}

	static clone(node: MarkdownSourceBlockNode): MarkdownSourceBlockNode {
		return new MarkdownSourceBlockNode(node.__key);
	}

	static importJSON(serializedNode: SerializedParagraphNode): MarkdownSourceBlockNode {
		return $createMarkdownSourceBlockNode().updateFromJSON(serializedNode);
	}

	createDOM(): HTMLElement {
		const dom = document.createElement("div");

		dom.className = "mde-source-block";

		return dom;
	}

	updateDOM(): boolean {
		return false;
	}

	exportJSON(): SerializedParagraphNode {
		return { ...super.exportJSON(), type: MarkdownSourceBlockNode.getType() };
	}
}

export function $createMarkdownSourceBlockNode(): MarkdownSourceBlockNode {
	return $applyNodeReplacement(new MarkdownSourceBlockNode());
}

export function $isMarkdownSourceBlockNode(node: LexicalNode | null | undefined): node is MarkdownSourceBlockNode {
	return node instanceof MarkdownSourceBlockNode;
}
