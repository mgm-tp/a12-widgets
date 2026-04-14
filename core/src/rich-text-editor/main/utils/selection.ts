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

import type { ElementNode, Klass, LexicalNode, PointType, RangeSelection, TextNode } from "lexical";
import { $isLineBreakNode, $createParagraphNode, $getSelection, $isElementNode, $isRangeSelection } from "lexical";
import { $findMatchingParent, $getNearestNodeOfType } from "@lexical/utils";
import { $forEachSelectedTextNode, $setBlocksType } from "@lexical/selection";
import { $isLinkNode } from "@lexical/link";

import type { InlineStyleTextNode } from "../nodes/inline-style-text-node.js";
import { $isInlineStyleTextNode } from "../nodes/inline-style-text-node.js";

export const $splitText = (node: TextNode, ...splitOffsets: Array<number>): TextNode[] => {
	const splitNodes = node.splitText(...splitOffsets);

	if ($isInlineStyleTextNode(node)) {
		splitNodes.forEach((el) => {
			if ($isInlineStyleTextNode(el)) {
				el.setSelectedStyleName(node.getSelectedStyleName());
			}
		});
	}

	return splitNodes;
};

/**
 * ===== BEGIN THIRD-PARTY SOURCE: Lexical (https://lexical.dev),
 * https://github.com/facebook/lexical/blob/v0.38.2/packages/lexical-selection/src/lexical-node.ts
 * Licensed under the MIT License.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Modified by mgm technology partners on 2025-03-11.
 */
export const $updateTextSelection = (
	selection: RangeSelection,
	callback: (node: LexicalNode | undefined, isCollapse?: boolean) => void
): void => {
	if ($isRangeSelection(selection) && selection.isCollapsed()) {
		callback(undefined, true);
		const emptyNode = selection.anchor.getNode();

		if ($isElementNode(emptyNode) && emptyNode.isEmpty()) {
			callback(emptyNode, true);
		}
	}

	$forEachSelectedTextNode((textNode) => {
		callback(textNode as InlineStyleTextNode, false);
	});
};

// ===== END THIRD-PARTY SOURCE =====

export const $getSelectionFirstBlockNode = (): LexicalNode | null => {
	const selection = $getSelection();

	if ($isRangeSelection(selection)) {
		const anchorNode = selection.anchor.getNode();

		return anchorNode.getKey() === "root" ? anchorNode : anchorNode.getParent();
	}

	return null;
};

export const $getFirstLevelSelectedBlockNode = (): LexicalNode | null => {
	const selection = $getSelection();

	if ($isRangeSelection(selection)) {
		const anchorNode = selection.anchor.getNode();

		return anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();
	}

	return null;
};

export const $getRangeSelectionPoint = (
	selection: RangeSelection
): {
	startPoint: PointType;
	endPoint: PointType;
} => {
	const anchor = selection.anchor;
	const focus = selection.focus;
	const isBefore = anchor.isBefore(focus);

	return {
		startPoint: isBefore ? anchor : focus,
		endPoint: isBefore ? focus : anchor
	};
};

/** @internal */
export const $getSelectionNodes = (selection: RangeSelection): LexicalNode[] => {
	let nodes = selection.getNodes();

	const { endPoint, startPoint } = $getRangeSelectionPoint(selection);
	const endNode = endPoint.getNode();

	if (selection.isCollapsed()) {
		return [endNode];
	}

	nodes = nodes.filter((node) => {
		if ($isLineBreakNode(node)) {
			return false;
		}

		const nodeKey = node.getKey();
		const startKey = startPoint.key;
		const endKey = endPoint.key;

		if (nodeKey === startKey) {
			if ($isElementNode(node)) {
				return startPoint.offset < node.getChildrenSize();
			}

			return startPoint.offset < node.getTextContent().length;
		}

		if (nodeKey === endKey) {
			if ($isElementNode(node)) {
				return endPoint.offset > 0;
			}

			return endPoint.offset > 0;
		}

		return true;
	});

	return nodes;
};

export const $isSelectionMatchCondition = (
	selection: RangeSelection,
	condition: (node: LexicalNode) => boolean
): boolean => {
	const nodes = $getSelectionNodes(selection);

	return (
		!!nodes.length &&
		nodes.every((node) => {
			return condition(node);
		})
	);
};

export const $isClassNameAppliedToSelection = (
	selection: RangeSelection,
	className: string,
	selectionCLassListCache?: string[]
): boolean => {
	if (selection.isCollapsed()) {
		return selectionCLassListCache?.includes(className) ?? false;
	}

	return $isSelectionMatchCondition(selection, (node) => {
		if ($isElementNode(node)) {
			return true;
		}

		return $isInlineStyleTextNode(node) && node.getSelectedStyleName().includes(className);
	});
};

export const $isElementFormatApplyToSelection = (selection: RangeSelection, format: string): boolean => {
	return $isSelectionMatchCondition(selection, (node) => {
		const parent = node.getParent();
		let matchingParent;

		if ($isLinkNode(parent)) {
			matchingParent = $findMatchingParent(node, (parentNode) => $isElementNode(parentNode) && !parentNode.isInline());
		}

		const elementFormat =
			($isElementNode(matchingParent)
				? matchingParent.getFormatType()
				: $isElementNode(node)
					? node.getFormatType()
					: parent?.getFormatType()) || "left";

		return elementFormat === format;
	});
};

export const $getNearestNodeOfTypeFromAnchor = <T extends ElementNode>(klass: Klass<T>): T | null => {
	const selection = $getSelection();

	if (!$isRangeSelection(selection)) {
		return null;
	}

	const anchor = selection.anchor.getNode();

	return $getNearestNodeOfType<T>(anchor, klass);
};

export const $formatParagraph = (): void => {
	const selection = $getSelection();

	if ($isRangeSelection(selection)) {
		$setBlocksType(selection, () => $createParagraphNode());
	}
};
