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

import type { ElementNode, LexicalNode, TextNode } from "lexical";
import { $isElementNode, $isLineBreakNode, $isParagraphNode } from "lexical";
import { isEqual } from "lodash-es";
import type { LinkNode } from "@lexical/link";
import type { LinkMatcher } from "@lexical/react/LexicalAutoLinkPlugin";

import type { InlineStyleTextNode } from "../nodes/inline-style-text-node.js";
import { $isInlineStyleTextNode } from "../nodes/inline-style-text-node.js";
import { $isListItemNode } from "../nodes/list-item-node.js";
import type { TextMatcher, TextMatcherResult } from "../plugins/plugin.internal.api.js";
import { $isMentionNode } from "../nodes/mention-node.js";

import { endsWithSeparator, findFirstMatch, isSeparator, startsWithSeparator } from "./common.js";
import { $splitText } from "./selection.js";

/**
 * Collects all consecutive InlineStyleTextNode nodes starting from the given node
 * until a space character is encountered in the text content.
 * Includes the first node if it contains a space, and the last node if it contains a space.
 *
 * @param textNode - The starting InlineStyleTextNode
 * @returns An array of InlineStyleTextNode nodes between two spaces (inclusive)
 */
export function getEffectedNodes(textNode: InlineStyleTextNode): InlineStyleTextNode[] {
	const nodes: InlineStyleTextNode[] = [textNode];
	let currentNode: InlineStyleTextNode | null;

	// Traverse backwards to find the start (stop when we find a node that contains space)
	currentNode = textNode.getPreviousSibling() as InlineStyleTextNode | null;

	while (currentNode !== null && $isInlineStyleTextNode(currentNode) && !$isMentionNode(currentNode)) {
		const textContent = currentNode.getTextContent();

		// Add this node to the beginning
		nodes.unshift(currentNode);

		// If this node contains a space, stop here (but we've already included it)
		if (textContent.includes(" ")) {
			break;
		}

		currentNode = currentNode.getPreviousSibling() as InlineStyleTextNode | null;
	}

	// Traverse forwards to find the end (stop when we find a node that contains space)
	currentNode = textNode.getNextSibling() as InlineStyleTextNode | null;

	while (currentNode !== null && $isInlineStyleTextNode(currentNode) && !$isMentionNode(currentNode)) {
		const textContent = currentNode.getTextContent();

		// Add this node to the end
		nodes.push(currentNode);

		// If this node contains a space, stop here (but we've already included it)
		if (textContent.includes(" ")) {
			break;
		}

		currentNode = currentNode.getNextSibling() as InlineStyleTextNode | null;
	}

	return nodes;
}

/** @internal */
export function shouldEditLinkNodeByNeighbors(linkNode: LinkNode, matchers: Array<LinkMatcher>): boolean {
	const linkNodeText = linkNode.getTextContent();

	const previousNode = linkNode.getPreviousSibling();
	let previousText = "";
	let processedNode = previousNode;

	while ($isInlineStyleTextNode(processedNode) && !$isMentionNode(processedNode)) {
		const textContent = processedNode.getTextContent();
		previousText = textContent + previousText;
		processedNode = processedNode.getPreviousSibling();

		if (textContent.includes(" ")) {
			break;
		}
	}

	const nextNode = linkNode.getNextSibling();
	let nextText = "";
	processedNode = nextNode;

	while ($isInlineStyleTextNode(processedNode) && !$isMentionNode(processedNode)) {
		const textContent = processedNode.getTextContent();
		nextText += textContent;
		processedNode = processedNode.getNextSibling();

		if (textContent.includes(" ")) {
			break;
		}
	}

	const newMatch = findFirstMatch(previousText + linkNodeText + nextText, matchers);

	return (newMatch && newMatch?.text !== linkNodeText) || !newMatch;
}

/**
 * ===== BEGIN THIRD-PARTY SOURCE: Lexical (https://lexical.dev),
 * https://github.com/facebook/lexical/blob/v.0.12.2/packages/lexical-react/src/LexicalAutoLinkPlugin.ts
 * Licensed under the MIT License.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Modified by mgm technology partners on 2024-16-04.
 */
export function isPreviousNodeValid(node: LexicalNode): boolean {
	let previousNode = node.getPreviousSibling();

	if ($isElementNode(previousNode)) {
		previousNode = previousNode.getLastDescendant();
	}

	return (
		previousNode === null ||
		$isLineBreakNode(previousNode) ||
		($isInlineStyleTextNode(previousNode) && endsWithSeparator(previousNode.getTextContent())) ||
		$isMentionNode(previousNode)
	);
}

export function isNextNodeValid(node: LexicalNode): boolean {
	let nextNode = node.getNextSibling();

	if ($isElementNode(nextNode)) {
		nextNode = nextNode.getFirstDescendant();
	}

	return (
		nextNode === null ||
		$isLineBreakNode(nextNode) ||
		($isInlineStyleTextNode(nextNode) && startsWithSeparator(nextNode.getTextContent())) ||
		$isMentionNode(nextNode)
	);
}

export function isContentAroundIsValid(matchStart: number, matchEnd: number, text: string, node: TextNode): boolean {
	if (!$isParagraphNode(node.getParent()) && !$isListItemNode(node.getParent())) {
		return false;
	}

	const contentBeforeIsValid = matchStart > 0 ? isSeparator(text[matchStart - 1]) : isPreviousNodeValid(node);

	if (!contentBeforeIsValid) {
		return false;
	}

	return matchEnd < text.length ? isSeparator(text[matchEnd]) : isNextNodeValid(node);
}

export function isContentAfterValid(matchEnd: number, text: string, node: TextNode): boolean {
	return matchEnd < text.length ? isSeparator(text[matchEnd]) : isNextNodeValid(node);
}

export function replaceWithChildren(node: ElementNode): Array<LexicalNode> {
	const children = node.getChildren();
	const childrenLength = children.length;

	for (let j = childrenLength - 1; j >= 0; j--) {
		const child = children[j];

		node.insertAfter(child);
	}

	node.remove();

	return children.map((child) => child.getLatest());
}

// ===== END THIRD-PARTY SOURCE =====

export function removeClassFromMatchersInNode(
	node: InlineStyleTextNode,
	matchers: TextMatcher[],
	className: string
): void {
	const textContent = node.getTextContent();
	const firstMatch: TextMatcherResult | null = findFirstMatch(textContent, matchers);
	(!firstMatch || firstMatch.text !== textContent) && node.removeSelectedStyleName(className);
}

/**
 * Execute handle callback to matched texts in a node.
 */
export function handleMatchedTextsInNode<T extends (text: string) => K, K extends TextMatcherResult | null>(
	node: InlineStyleTextNode,
	matchers: T[],
	handler: (targetNode: TextNode, match: K) => LexicalNode
): void {
	const fullText = node.getTextContent();
	let match: K | null;
	let remainingTextNode: TextNode = node;
	let consumed = 0;
	let remainingStart = 0;

	while ((match = findFirstMatch<T, K>(fullText.substring(consumed), matchers))) {
		const matchStart = consumed + match.index;
		const matchEnd = matchStart + match.length;
		consumed = matchEnd;

		const needLeftRecheck = match.index === 0;
		const needRightRecheck = matchEnd === fullText.length;

		if (needLeftRecheck || needRightRecheck) {
			const word = fullText.substring(matchStart, matchEnd);
			let textWithContentAround = word;
			let prefixLength = 0;

			if (needLeftRecheck) {
				let leftChar = "";

				if (matchStart > 0) {
					leftChar = fullText[matchStart - 1];
				} else {
					const previousNode = remainingTextNode.getPreviousSibling();

					if ($isInlineStyleTextNode(previousNode) && !$isMentionNode(previousNode)) {
						const previousText = previousNode.getTextContent();
						leftChar = previousText.length > 0 ? previousText[previousText.length - 1] : "";
					}
				}

				if (leftChar) {
					textWithContentAround = leftChar + textWithContentAround;
					prefixLength = 1;
				}
			}

			if (needRightRecheck) {
				const nextNode = remainingTextNode.getNextSibling();

				if ($isInlineStyleTextNode(nextNode) && !$isMentionNode(nextNode)) {
					const nextText = nextNode.getTextContent();

					if (nextText.length > 0) {
						textWithContentAround = textWithContentAround + nextText[0];
					}
				}
			}

			if (textWithContentAround !== word) {
				const augmentedMatch = findFirstMatch<T, K>(textWithContentAround, matchers);

				if (!augmentedMatch || augmentedMatch.text !== match.text || augmentedMatch.index !== prefixLength) {
					continue;
				}
			}
		}

		const relativeStart = matchStart - remainingStart;
		let targetNode: TextNode;

		if (relativeStart === 0) {
			[targetNode, remainingTextNode] = $splitText(remainingTextNode, match.length);
		} else {
			[, targetNode, remainingTextNode] = $splitText(remainingTextNode, relativeStart, relativeStart + match.length);
		}

		remainingStart = matchEnd;

		const replacedTextNode = handler(targetNode, match);

		// maintain style and format to the new node
		if ($isInlineStyleTextNode(replacedTextNode)) {
			replacedTextNode.setFormat(node.getFormat());
			replacedTextNode.setStyle(node.getStyle());
		}
	}
}

export function addClassToMatchersInNode(node: InlineStyleTextNode, matchers: TextMatcher[], className: string): void {
	handleMatchedTextsInNode(node, matchers, (targetNode) => {
		if ($isInlineStyleTextNode(targetNode)) {
			targetNode.addSelectedStyleName(className);
		}

		return targetNode;
	});
}

export function mergeWithSibling(node: InlineStyleTextNode, sibling: InlineStyleTextNode): TextNode {
	// Don't merge if either node is marked as customUnmergeable
	if (node.isCustomUnmergeable() || sibling.isCustomUnmergeable()) {
		return node;
	}

	// Verify the sibling is actually a current sibling (may be stale after prior merges)
	if (sibling !== node.getNextSibling() && sibling !== node.getPreviousSibling()) {
		return node;
	}

	if (
		isEqual(sibling.getSelectedStyleName(), node.getSelectedStyleName()) &&
		sibling.getFormat() === node.getFormat() &&
		sibling.getStyle() === node.getStyle()
	) {
		return node.mergeWithSibling(sibling);
	}

	return node;
}
