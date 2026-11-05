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
 * Keeps the caret in place when the nodes under it are replaced.
 *
 * Lexical remembers the caret as a node key, so the caret is lost when that node is replaced,
 * and the highlighting replaces nodes on almost every keystroke.
 *
 * To avoid that, the caret is saved as a number first, then turned back into a selection
 * once the new nodes are in place. There are two kinds of number:
 * - an offset inside one block, used when only that block is rebuilt
 * - and an offset into the whole document, used when text moves between blocks.
 */

import type { ElementNode, LexicalNode, NodeKey, Point, TextNode } from "lexical";
import {
	$createRangeSelection,
	$getRoot,
	$getSelection,
	$isElementNode,
	$isRangeSelection,
	$isTextNode,
	$setSelection
} from "lexical";

import type { MarkdownSourceBlockNode } from "../nodes/markdown-source-block-node.js";
import { $isMarkdownSourceBlockNode } from "../nodes/markdown-source-block-node.js";

const SEPARATOR_LENGTH = 1;

/**
 * Where the selection is, counted in characters.
 *
 * In the text `# Hello`, selecting `Hel` gives `{ anchor: 2, focus: 5 }`: two characters
 * before it starts, five before it ends. A caret with nothing selected has both the same.
 *
 * Lexical says it the other way, as a node plus an offset inside that node. Highlighting
 * deletes those nodes and builds new ones, so the old points mean nothing afterwards.
 * A character count still points at the same place.
 *
 * Count from where you captured: `$captureBlockSelection` counts inside one block,
 * `$captureSourceDocumentSelection` counts across the whole document. Restore with
 * the function that matches.
 */
export interface SelectionOffsets {
	/** Where the selection started — where the caret is when nothing is selected. */
	anchor: number;

	/** Where the selection ends. Smaller than `anchor` when the user dragged backwards. */
	focus: number;
}

interface PointTarget {
	key: NodeKey;
	offset: number;
	type: "text" | "element";
}

function textPoint(node: TextNode, offset: number): PointTarget {
	return { key: node.getKey(), offset, type: "text" };
}

function elementPoint(node: ElementNode, childIndex: number): PointTarget {
	return { key: node.getKey(), offset: childIndex, type: "element" };
}

function setPoint(point: Point, target: PointTarget): void {
	point.set(target.key, target.offset, target.type);
}

function leavesOf(node: LexicalNode): LexicalNode[] {
	return $isElementNode(node) ? node.getChildren().flatMap(leavesOf) : [node];
}

function offsetWithinOwnNode(point: Point): number {
	const node = point.getNode();

	if (point.type === "text") {
		return point.offset;
	}

	if (!$isElementNode(node)) {
		return 0;
	}

	return node
		.getChildren()
		.slice(0, point.offset)
		.reduce((total, child) => total + child.getTextContentSize(), 0);
}

function blockOffsetOf(block: MarkdownSourceBlockNode, point: Point): number | null {
	let node = point.getNode();
	let offset = offsetWithinOwnNode(point);

	while (node.getKey() !== block.getKey()) {
		for (const previous of node.getPreviousSiblings()) {
			offset += previous.getTextContentSize();
		}

		const parent = node.getParent();

		if (parent === null) {
			return null;
		}

		node = parent;
	}

	return offset;
}

function endOfBlock(block: MarkdownSourceBlockNode): PointTarget {
	const lastText = leavesOf(block).filter($isTextNode).at(-1);

	return lastText ? textPoint(lastText, lastText.getTextContentSize()) : elementPoint(block, block.getChildrenSize());
}

function pointAtBlockOffset(block: MarkdownSourceBlockNode, offset: number): PointTarget {
	const leaves = leavesOf(block);

	let remaining = Math.max(0, offset);

	for (const [index, leaf] of leaves.entries()) {
		const size = leaf.getTextContentSize();
		const isBeyondThisLeaf = remaining > size;

		if (isBeyondThisLeaf) {
			remaining -= size;

			continue;
		}

		if ($isTextNode(leaf)) {
			return textPoint(leaf, remaining);
		}

		const startsTheNextLine = remaining === size && index + 1 < leaves.length;

		if (startsTheNextLine) {
			remaining = 0;

			continue;
		}

		const parent = leaf.getParent();

		if (parent !== null) {
			const isAfterTheBreak = remaining > 0;

			return elementPoint(parent, leaf.getIndexWithinParent() + (isAfterTheBreak ? 1 : 0));
		}
	}

	return endOfBlock(block);
}

export function $captureBlockSelection(block: MarkdownSourceBlockNode): SelectionOffsets | null {
	const selection = $getSelection();

	if (!$isRangeSelection(selection)) {
		return null;
	}

	const anchor = blockOffsetOf(block, selection.anchor);
	const focus = blockOffsetOf(block, selection.focus);

	if (anchor === null || focus === null) {
		return null;
	}

	return { anchor, focus };
}

export function $restoreBlockSelection(block: MarkdownSourceBlockNode, offsets: SelectionOffsets): void {
	const selection = $createRangeSelection();

	setPoint(selection.anchor, pointAtBlockOffset(block, offsets.anchor));
	setPoint(selection.focus, pointAtBlockOffset(block, offsets.focus));
	$setSelection(selection);
}

interface BlockStart {
	block: MarkdownSourceBlockNode;
	start: number;
}

function blockStarts(): BlockStart[] {
	const starts: BlockStart[] = [];
	let start = 0;

	for (const child of $getRoot().getChildren()) {
		if ($isMarkdownSourceBlockNode(child)) {
			starts.push({ block: child, start });
		}

		start += child.getTextContentSize() + SEPARATOR_LENGTH;
	}

	return starts;
}

/** The source block a point sits in, or null when it is not inside one. */
function blockOfPoint(point: Point): MarkdownSourceBlockNode | null {
	let node: LexicalNode | null = point.getNode();

	while (node !== null) {
		if ($isMarkdownSourceBlockNode(node)) {
			return node;
		}

		node = node.getParent();
	}

	return null;
}

/**
 * Where a point sits in the whole document, counting from the first character.
 *
 * We find the block by climbing from the point, not by asking every block in turn.
 * Asking a block for an offset it does not have is slow: the climb only stops at the root, and
 * the last step counts the text of every block above. Asking one block after another that way
 * costs more the lower the caret sits, and on a long document it took seconds by itself.
 */
function documentOffsetOf(point: Point, starts: BlockStart[]): number | null {
	const block = blockOfPoint(point);

	if (block === null) {
		return null;
	}

	const offset = blockOffsetOf(block, point);
	const found = starts.find((entry) => entry.block.getKey() === block.getKey());

	return offset === null || found === undefined ? null : found.start + offset;
}

function pointAtDocumentOffset(starts: BlockStart[], offset: number): PointTarget {
	const wanted = Math.max(0, offset);

	for (const { block, start } of starts) {
		if (wanted <= start + block.getTextContentSize()) {
			return pointAtBlockOffset(block, wanted - start);
		}
	}

	return endOfBlock(starts.at(-1)!.block);
}

/**
 * Remembers where the caret is in source mode.
 *
 * For an extension that writes into the markdown source.
 * Source mode re-highlights the text after every edit,
 * which means it replaces the nodes the caret was sitting in.
 * The caret is lost with them, so save it first and put it back afterwards:
 *
 * ```ts
 * editor.update(() => {
 *   const caret = $captureSourceDocumentSelection();
 *
 *   // ...the edit to the source text...
 *
 *   if (caret !== null) {
 *     $restoreSourceDocumentSelection(caret);
 *   }
 * });
 * ```
 *
 * The offsets count characters in the markdown text, newlines included.
 * Null when no caret sits in the source text.
 */
export function $captureSourceDocumentSelection(): SelectionOffsets | null {
	const selection = $getSelection();

	if (!$isRangeSelection(selection)) {
		return null;
	}

	// Built once and used for both ends, because walking the blocks is the expensive part.
	const starts = blockStarts();

	const anchor = documentOffsetOf(selection.anchor, starts);
	const focus = documentOffsetOf(selection.focus, starts);
	const found = anchor ?? focus;

	if (found === null) {
		return null;
	}

	return { anchor: anchor ?? found, focus: focus ?? found };
}

/**
 * Puts the caret back at the offsets {@link $captureSourceDocumentSelection} handed back.
 * Call it in the same `editor.update()` as the edit.
 *
 * A number past the end of the text puts the caret at the end. Below zero puts it at the start.
 */
export function $restoreSourceDocumentSelection(offsets: SelectionOffsets): void {
	const starts = blockStarts();

	if (starts.length === 0) {
		return;
	}

	const selection = $createRangeSelection();

	setPoint(selection.anchor, pointAtDocumentOffset(starts, offsets.anchor));
	setPoint(selection.focus, pointAtDocumentOffset(starts, offsets.focus));
	$setSelection(selection);
}
