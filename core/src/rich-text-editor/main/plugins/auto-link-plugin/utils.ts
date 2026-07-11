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

import type { AutoLinkNode } from "@lexical/link";
import { $createAutoLinkNode, $isAutoLinkNode } from "@lexical/link";
import type { LinkMatcher } from "@lexical/react/LexicalAutoLinkPlugin";
import LinkifyIt from "linkify-it";
import type { BaseSelection, LexicalNode } from "lexical";
import { $getSelection, $isRangeSelection } from "lexical";

import type { InlineStyleTextNode } from "../../nodes/inline-style-text-node.js";
import {
	$createInlineStyleTextNode,
	$createLexicalUnmergeableInlineStyleTextNode,
	$isInlineStyleTextNode
} from "../../nodes/inline-style-text-node.js";
import {
	endsWithDot,
	endsWithSeparator,
	findFirstMatch,
	startsWithSeparator,
	startWithLinkSuffix
} from "../../utils/common.js";
import { handleMatchedTextsInNode, replaceWithChildren, shouldEditLinkNodeByNeighbors } from "../../utils/node.js";

import type { ChangeHandler, LinkMatcherResult } from "./auto-link.internal.api.js";

/** @internal */
function getAffectedNodesPosition(nodes: InlineStyleTextNode[], matchStart: number, matchEnd: number) {
	let currentPosition = 0;
	let startNodeIndex = -1;
	let startOffset = 0;
	let endNodeIndex = -1;
	let endOffset = 0;

	// Find which nodes contain the match start and end
	for (let i = 0; i < nodes.length; i++) {
		const nodeText = nodes[i].getTextContent();
		const nodeLength = nodeText.length;
		const nodeStart = currentPosition;
		const nodeEnd = currentPosition + nodeLength;

		if (startNodeIndex === -1 && matchStart >= nodeStart && matchStart < nodeEnd) {
			startNodeIndex = i;
			startOffset = matchStart - nodeStart;
		}

		if (matchEnd > nodeStart && matchEnd <= nodeEnd) {
			endNodeIndex = i;
			endOffset = matchEnd - nodeStart;
		}

		currentPosition += nodeLength;
	}

	return {
		startNodeIndex,
		startOffset,
		endNodeIndex,
		endOffset
	};
}

/** @internal */
function createLink(
	nodes: InlineStyleTextNode[],
	config: {
		match: LinkMatcherResult;
		target?: string;
		startNodeIndex: number;
		startOffset: number;
		endNodeIndex: number;
		endOffset: number;
	}
) {
	const { match, target, startNodeIndex, startOffset, endNodeIndex, endOffset } = config;
	// Create the link node
	const linkNode = $createAutoLinkNode(match.url, { ...match.attributes, target: target ?? "_self" });

	// Handle text before match in the start node
	const startNode = nodes[startNodeIndex];
	const startNodeText = startNode.getTextContent();
	let insertionPoint = startNode;

	if (startOffset > 0) {
		// There's text before the match in the start node
		const beforeText = startNodeText.substring(0, startOffset);
		const beforeNode = $createLexicalUnmergeableInlineStyleTextNode(
			beforeText,
			startNode.getSimpleTextClassNames(),
			startNode.getFormat()
		);
		startNode.insertBefore(beforeNode);
		insertionPoint = beforeNode;
	}

	// Process nodes and add matched content to link
	for (let i = startNodeIndex; i <= endNodeIndex; i++) {
		const node = nodes[i];
		const nodeText = node.getTextContent();

		if (i === startNodeIndex && i === endNodeIndex) {
			// Match is entirely within one node
			const matchText = nodeText.substring(startOffset, endOffset);
			linkNode.append(
				$createLexicalUnmergeableInlineStyleTextNode(matchText, node.getSimpleTextClassNames(), node.getFormat())
			);

			// Handle text after match
			if (endOffset < nodeText.length) {
				const afterText = nodeText.substring(endOffset);
				insertionPoint.insertAfter(linkNode);
				linkNode.insertAfter(
					$createLexicalUnmergeableInlineStyleTextNode(afterText, node.getSimpleTextClassNames(), node.getFormat())
				);
			} else {
				insertionPoint.insertAfter(linkNode);
			}

			node.remove();
		} else if (i === startNodeIndex) {
			// First node of multi-node match
			const matchText = nodeText.substring(startOffset);
			linkNode.append(
				$createLexicalUnmergeableInlineStyleTextNode(matchText, node.getSimpleTextClassNames(), node.getFormat())
			);
		} else if (i === endNodeIndex) {
			// Last node of multi-node match
			const matchText = nodeText.substring(0, endOffset);
			linkNode.append(
				$createLexicalUnmergeableInlineStyleTextNode(matchText, node.getSimpleTextClassNames(), node.getFormat())
			);

			// Insert the link node after the insertion point
			insertionPoint.insertAfter(linkNode);

			// Handle text after match
			if (endOffset < nodeText.length) {
				const afterText = nodeText.substring(endOffset);
				linkNode.insertAfter(
					$createLexicalUnmergeableInlineStyleTextNode(afterText, node.getSimpleTextClassNames(), node.getFormat())
				);
			}

			// Remove all processed nodes
			for (let j = startNodeIndex; j <= endNodeIndex; j++) {
				nodes[j].remove();
			}
		} else {
			// Middle node - entire content is part of the match
			linkNode.append(
				$createLexicalUnmergeableInlineStyleTextNode(nodeText, node.getSimpleTextClassNames(), node.getFormat())
			);
		}
	}

	return linkNode;
}

/** @internal */
function restoreSelectionAfterLinkCreation(
	nodes: InlineStyleTextNode[],
	linkNode: AutoLinkNode,
	selectionConfig: {
		selection: BaseSelection | null;
		savedFocusNodeIndex: number;
		savedFocusNodeOffset: number;
	},
	match: { matchStart: number; matchEnd: number }
) {
	const { savedFocusNodeIndex, savedFocusNodeOffset, selection } = selectionConfig;
	const { matchStart, matchEnd } = match;

	if ($isRangeSelection(selection) && savedFocusNodeIndex !== -1) {
		// The character count from the start of the first node to the selection
		let originalSelectionOffset = 0;

		for (let i = 0; i < savedFocusNodeIndex; i++) {
			originalSelectionOffset += nodes[i].getTextContent().length;
		}

		originalSelectionOffset += savedFocusNodeOffset;

		// Check if selection was after the match
		if (originalSelectionOffset > matchEnd) {
			const afterNode = linkNode.getNextSibling();

			// Selection was after the link - walk sibling nodes to find the correct position.
			if (afterNode && $isInlineStyleTextNode(afterNode)) {
				let remainingOffset = originalSelectionOffset - matchEnd;
				let currentNode: LexicalNode | null = afterNode;

				while (currentNode !== null && $isInlineStyleTextNode(currentNode)) {
					const nodeSize = currentNode.getTextContentSize();

					if (remainingOffset <= nodeSize) {
						currentNode.select(remainingOffset, remainingOffset);

						return;
					}

					remainingOffset -= nodeSize;
					currentNode = currentNode.getNextSibling();
				}
			} else {
				// No text after link, place selection at the end of the link
				const lastChild = linkNode.getLastChild();

				if (lastChild && $isInlineStyleTextNode(lastChild)) {
					const textLength = lastChild.getTextContentSize();

					lastChild.select(textLength, textLength);
				}
			}
		} else if (originalSelectionOffset >= matchStart) {
			// Selection was inside the match - find the correct position in the link
			const positionInMatch = originalSelectionOffset - matchStart;
			const linkChildren = linkNode.getChildren();
			let childPosition = 0;

			for (let i = 0; i < linkChildren.length; i++) {
				const child = linkChildren[i];

				if ($isInlineStyleTextNode(child)) {
					const childLength = child.getTextContentSize();

					if (positionInMatch >= childPosition && positionInMatch <= childPosition + childLength) {
						const offsetInChild = positionInMatch - childPosition;

						child.select(offsetInChild, offsetInChild);

						return;
					}

					childPosition += childLength;
				}
			}
		} else {
			// Selection was before the match - find the text node before the link
			const beforeNode = linkNode.getPreviousSibling();

			if (beforeNode && $isInlineStyleTextNode(beforeNode)) {
				beforeNode.select(savedFocusNodeOffset, savedFocusNodeOffset);
			}
		}
	}
}

/** @internal */
function getCurrentSelection(nodes: LexicalNode[]) {
	const selection = $getSelection();
	let savedFocusNodeIndex = -1;
	let savedFocusNodeOffset = 0;

	if ($isRangeSelection(selection) && selection.isCollapsed()) {
		const focusNode = selection.focus.getNode();

		savedFocusNodeOffset = selection.focus.offset;
		savedFocusNodeIndex = nodes.findIndex((n) => n.getKey() === focusNode.getKey());
	}

	return {
		selection,
		savedFocusNodeOffset,
		savedFocusNodeIndex
	};
}

/**
 * Scans the given array of InlineStyleTextNode nodes for link patterns using the provided matchers,
 * creates an AutoLinkNode for the first match found, replaces the matched text with the link node,
 * restores the user's selection, and triggers the onChange callback.
 *
 * @param nodes - Array of InlineStyleTextNode to process.
 * @param matchers - Array of LinkMatcher functions to identify link patterns.
 * @param onChange - Callback invoked when a link is created or updated.
 * @param target - Optional target attribute for the created link.
 */
export function handleLinkCreationFromNodes(
	nodes: InlineStyleTextNode[],
	matchers: Array<LinkMatcher>,
	onChange: ChangeHandler,
	target?: string
): void {
	if (nodes.length === 0) {
		return;
	}

	// Get the combined text from all nodes
	const combinedText = nodes.map((node) => node.getTextContent()).join("");

	// Find if there's a match in the combined text
	const match = findFirstMatch<LinkMatcher, LinkMatcherResult>(combinedText, matchers);

	if (!match) {
		return;
	}

	const matchStart = match.index;
	const matchEnd = match.index + match.length;

	// Store the current selection to restore later
	const { selection, savedFocusNodeOffset, savedFocusNodeIndex } = getCurrentSelection(nodes);

	// Calculate which nodes and positions are affected
	const { startNodeIndex, startOffset, endNodeIndex, endOffset } = getAffectedNodesPosition(
		nodes,
		matchStart,
		matchEnd
	);

	if (startNodeIndex === -1 || endNodeIndex === -1) {
		return;
	}

	// Create the link node
	const linkNode = createLink(nodes, { match, target, startNodeIndex, startOffset, endNodeIndex, endOffset });

	// Restore selection
	restoreSelectionAfterLinkCreation(
		nodes,
		linkNode,
		{ selection, savedFocusNodeIndex, savedFocusNodeOffset },
		{ matchStart, matchEnd }
	);

	onChange(match.url, null);
}

/**
 * ===== BEGIN THIRD-PARTY SOURCE: Lexical (https://lexical.dev),
 * https://github.com/facebook/lexical/blob/v.0.12.2/packages/lexical-react/src/LexicalAutoLinkPlugin.ts
 * Licensed under the MIT License.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Modified by mgm technology partners on 2024-16-04.
 */

/**
 * @deprecated since 38.2.0, use {@link handleLinkCreationFromNodes} instead
 */
export function handleLinkCreation(
	node: InlineStyleTextNode,
	matchers: Array<LinkMatcher>,
	onChange: ChangeHandler,
	target?: string
): void {
	handleMatchedTextsInNode(node, matchers, (targetNode, match: LinkMatcherResult | null) => {
		if (!match) {
			return targetNode;
		}

		const linkNode = $createAutoLinkNode(match.url, { ...match.attributes, target: target ?? "_self" });
		const textNode = $createInlineStyleTextNode(match.text, node.getSimpleTextClassNames());
		linkNode.append(textNode);
		targetNode.replace(linkNode);
		onChange(match.url, null);

		return textNode;
	});
}

/**
 * Edit link will be converted to its children in order to be able to update,
 * then link children will be converted back to the link in useAutoLink hook.
 */
export function handleLinkEdit(linkNode: AutoLinkNode, matchers: Array<LinkMatcher>, onChange: ChangeHandler): void {
	// Check children are simple text
	const children = linkNode.getChildren();
	const childrenLength = children.length;

	for (let i = 0; i < childrenLength; i++) {
		const child = children[i];

		if (!$isInlineStyleTextNode(child)) {
			replaceWithChildren(linkNode);
			onChange(null, linkNode.getURL());

			return;
		}
	}

	// Check text content fully matches
	const text = linkNode.getTextContent();
	const match: LinkMatcherResult | null = findFirstMatch(text, matchers);

	if (match === null || match.text !== text) {
		replaceWithChildren(linkNode);
		onChange(null, linkNode.getURL());

		return;
	}

	// Check neighbors
	if (shouldEditLinkNodeByNeighbors(linkNode, matchers)) {
		replaceWithChildren(linkNode);
		onChange(null, linkNode.getURL());

		return;
	}

	const url = linkNode.getURL();

	if (url !== match.url) {
		linkNode.setURL(match.url);
		onChange(match.url, url);
	}

	if (match.attributes) {
		const rel = linkNode.getRel();

		if (rel !== match.attributes.rel) {
			linkNode.setRel(match.attributes.rel || null);
			onChange(match.attributes.rel || null, rel);
		}

		const target = linkNode.getTarget();

		if (target !== match.attributes.target) {
			linkNode.setTarget(match.attributes.target || null);
			onChange(match.attributes.target || null, target);
		}
	}
}

export function handleBadNeighbors(
	textNode: InlineStyleTextNode,
	matchers: Array<LinkMatcher>,
	onChange: ChangeHandler,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	target?: string // @deprecated since 38.2.0 - Remove createLinkWithBadNeighbors handler from this function as this function should only update the link back to text if bad neighbors are found.
): void {
	let previousSibling = textNode.getPreviousSibling();
	const nextSibling = textNode.getNextSibling();
	let text = textNode.getTextContent();

	if (previousSibling?.getTextContent() === ".") {
		previousSibling = previousSibling.getPreviousSibling();
		text = "." + text;
	}

	if ($isAutoLinkNode(previousSibling) && (!startsWithSeparator(text) || startWithLinkSuffix(text))) {
		if (shouldEditLinkNodeByNeighbors(previousSibling, matchers)) {
			const prevUrl = previousSibling.getURL();
			replaceWithChildren(previousSibling);
			onChange(null, prevUrl);

			return;
		}
	}

	if (
		$isAutoLinkNode(nextSibling) &&
		(!endsWithSeparator(text) || (endsWithDot(text) && !isLinkStartingWithProtocol(nextSibling.getTextContent())))
	) {
		if (shouldEditLinkNodeByNeighbors(nextSibling, matchers)) {
			const nextUrl = nextSibling.getURL();
			replaceWithChildren(nextSibling);
			onChange(null, nextUrl);

			return;
		}
	}
}

/** @internal */
export function createLinkMatcherWithRegExp(regExp: RegExp, urlTransformer: (text: string) => string = (text) => text) {
	return (
		text: string
	): {
		index: number;
		length: number;
		text: string;
		url: string;
	} | null => {
		// Reinitialize the lastIndex property to 0 to start matching from the beginning of the text.
		regExp.lastIndex = 0;
		const match = regExp.exec(text);

		if (match === null) {
			return null;
		}

		return {
			index: match.index,
			length: match[0].length,
			text: match[0],
			url: urlTransformer(match[0])
		};
	};
}

// ===== END THIRD-PARTY SOURCE =====

const isLinkStartingWithProtocol = (text: string): boolean => {
	return text.startsWith("http://") || text.startsWith("https://") || text.startsWith("//");
};

const linkifyIt = new LinkifyIt();

export function createLinkMatcherWithLinkify(): LinkMatcher {
	return (text: string): LinkMatcherResult | null => {
		const links = linkifyIt.match(text);
		const firstLink = links?.[0];

		if (!firstLink) {
			return null;
		}

		return {
			index: firstLink.index,
			length: firstLink.text.length,
			text: firstLink.text,
			url: firstLink.url
		};
	};
}
