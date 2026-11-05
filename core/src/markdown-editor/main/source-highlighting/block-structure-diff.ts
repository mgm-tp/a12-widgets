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

import type { LexicalNode } from "lexical";
import { $isLineBreakNode, $isTabNode } from "lexical";

import type { NormalizedSourceToken } from "../nodes/markdown-source-block-node.js";
import { $buildNodesFromNormalizedTokens, normalizeSourceTokens } from "../nodes/markdown-source-block-node.js";
import type { MarkdownTokenNode } from "../nodes/markdown-token-node.js";
import { $isMarkdownTokenNode } from "../nodes/markdown-token-node.js";
import { $isMarkdownTokenTextNode } from "../nodes/markdown-token-text-node.js";

import type { SourceToken } from "./source-token.js";

interface BlockSplice {
	/** Whose children to patch. Null means the block itself. */
	target: MarkdownTokenNode | null;

	/** Index of the first child to remove. */
	from: number;

	/** Index just past the last child to remove. */
	to: number;

	/** The new children to insert where the removed ones were. */
	nodes: LexicalNode[];
}

type BlockDiffResult = "same" | BlockSplice;

/** Whether `node` is the element `token` describes, ignoring what is inside it. */
function isSameElementNode(node: LexicalNode, token: NormalizedSourceToken): node is MarkdownTokenNode {
	return (
		token.kind === "element" &&
		$isMarkdownTokenNode(node) &&
		node.getTokenType() === token.type &&
		node.getLevel() === token.level
	);
}

/**
 * Compares a node with a source token: the node kind for a break or a tab, the text for a text token,
 * and the type, level and children for an element token.
 */
function isNodeMatchesSourceToken(node: LexicalNode, token: NormalizedSourceToken): boolean {
	switch (token.kind) {
		case "break":
			return $isLineBreakNode(node);

		case "tab":
			return $isTabNode(node);

		// Compare the type too, not only the characters.
		// Wrap `word` in `*` and the text is still `word` while its type changes,
		// so text alone would leave the old class on it.
		case "text":
			return (
				$isMarkdownTokenTextNode(node) && node.getTextContent() === token.text && node.getTokenType() === token.type
			);

		case "element":
			return isSameElementNode(node, token) && isNodeListMatchesSourceTokens(node.getChildren(), token.children);
	}
}

/** Same as {@link isNodeMatchesSourceToken}, for a whole list: same length, and every pair matches. */
function isNodeListMatchesSourceTokens(nodes: LexicalNode[], tokens: NormalizedSourceToken[]): boolean {
	return nodes.length === tokens.length && nodes.every((node, index) => isNodeMatchesSourceToken(node, tokens[index]!));
}

function diffNodesAgainstTokens(
	target: MarkdownTokenNode | null,
	nodes: LexicalNode[],
	tokens: NormalizedSourceToken[]
): BlockDiffResult {
	// A block holds a single wrapper, and any change is usually inside it.
	// Step into that wrapper, so the patch lands on what changed
	// instead of replacing the wrapper and everything under it.
	if (nodes.length === 1 && tokens.length === 1) {
		const node = nodes[0]!;
		const token = tokens[0]!;

		if (token.kind === "element" && isSameElementNode(node, token)) {
			return diffNodesAgainstTokens(node, node.getChildren(), token.children);
		}
	}

	// Count the matching nodes at each end, so the patch covers only what changed in between.
	const shortest = Math.min(nodes.length, tokens.length);

	let head = 0;

	while (head < shortest && isNodeMatchesSourceToken(nodes[head]!, tokens[head]!)) {
		head++;
	}

	// The head reached the end of both lists, so there is nothing to patch.
	if (head === nodes.length && head === tokens.length) {
		return "same";
	}

	let tail = 0;

	while (tail < shortest - head && isNodeMatchesSourceToken(nodes.at(-1 - tail)!, tokens.at(-1 - tail)!)) {
		tail++;
	}

	return {
		target,
		from: head,
		to: nodes.length - tail,
		nodes: $buildNodesFromNormalizedTokens(tokens.slice(head, tokens.length - tail))
	};
}

/** The smallest splice that makes a block's children match its tokens, or `"same"` if they already do. */
export function diffBlockChildren(children: LexicalNode[], tokens: SourceToken[]): BlockDiffResult {
	return diffNodesAgainstTokens(null, children, normalizeSourceTokens(tokens));
}
