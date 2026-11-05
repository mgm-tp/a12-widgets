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

import type { LexicalEditor, LexicalNode } from "lexical";
import { $getEditor, $getRoot } from "lexical";

import type { MarkdownSourceBlockNode } from "../nodes/markdown-source-block-node.js";
import {
	$buildNodesFromSourceTokens,
	$createMarkdownSourceBlockNode,
	$isMarkdownSourceBlockNode
} from "../nodes/markdown-source-block-node.js";

import type { SourceBlock } from "./block-boundaries.js";
import { canSwallowsNextBlock, joinSourceBlocks, splitSourceBlocksWithTokens } from "./block-boundaries.js";
import { $captureSourceDocumentSelection, $restoreSourceDocumentSelection } from "./block-offsets.js";
import type { SourceTokenizer } from "./micromark-tokenizer.js";
import type { SourceToken } from "./source-token.js";

export interface CachedBlockTokens {
	text: string;
	tokens: SourceToken[];
}

/**
 * What source mode remembers about an editor between updates. Every part of it saves work.
 *
 * `tokens` are the tokens we already have for a block. Making a block parses its text, and the
 * highlighter reads that block right after, so it would parse the same text a second time.
 * Keeping the tokens here stops that.
 *
 * `keys` is the list of blocks from the last time we knew they were split right. If the list
 * still matches, no block moved, and there is no boundary work to do.
 *
 * Held weakly, so the cache is dropped with the editor.
 */
export interface SourceBlockCache {
	tokens: Map<string, CachedBlockTokens>;

	keys: string[];

	/**
	 * A repair is building blocks right now.
	 *
	 * Blocks from a repair are not cached. The highlighter then parses them and marks them, so
	 * the boundary step runs again. A repair needs those extra runs: when a fence opens, it
	 * swallows the blocks under it a few at a time, and each run reaches a bit further.
	 *
	 * Blocks from a load are cached, because a load splits the whole document at once and has
	 * nothing left to do.
	 */
	repairing: boolean;
}

const cacheByEditor = new WeakMap<LexicalEditor, SourceBlockCache>();

/** The cache for `editor`. Created the first time it is needed. */
export function getSourceBlockCache(editor: LexicalEditor): SourceBlockCache {
	const existing = cacheByEditor.get(editor);

	if (existing !== undefined) {
		return existing;
	}

	const created: SourceBlockCache = { tokens: new Map(), keys: [], repairing: false };

	cacheByEditor.set(editor, created);

	return created;
}

/** The keys of the blocks in the document, top to bottom. */
export function $getSourceBlockKeys(): string[] {
	return $getRoot()
		.getChildren()
		.map((block) => block.getKey());
}

/**
 * Marks the blocks next to one that was added or removed, so the boundary pass checks there.
 *
 * A block the user edited marks itself, because it holds text we have not parsed yet.
 * Adding or removing a block does not. Delete the blank line between two paragraphs and both
 * still read the same as before, but they are one paragraph now and must be joined.
 *
 * So compare the block list with the one the last run saw, and mark the ends of the part that
 * changed. The boundary step reaches one block further each way on its own.
 *
 * The list to compare with is the one the last run saw, not the one the last repair left. That
 * is what lets a repair finish over several runs. One run is not always enough: when a fence
 * opens, it swallows the blocks under it a few at a time, and each run must see that the list
 * moved again. It stops when a run changes nothing.
 */
export function $markBlocksAroundStructureChange(
	keys: string[],
	previousKeys: string[],
	dirtyBlocks: Set<string>
): void {
	if (keys.length === previousKeys.length && keys.every((key, index) => key === previousKeys[index])) {
		return;
	}

	const shortest = Math.min(keys.length, previousKeys.length);

	let head = 0;

	while (head < shortest && keys[head] === previousKeys[head]) {
		head++;
	}

	let tail = 0;

	while (tail < shortest - head && keys.at(-1 - tail) === previousKeys.at(-1 - tail)) {
		tail++;
	}

	// The blocks that changed, plus the one on each side of them.
	for (let index = Math.max(0, head - 1); index <= Math.min(keys.length - 1, keys.length - tail); index++) {
		const key = keys[index];

		if (key !== undefined) {
			dirtyBlocks.add(key);
		}
	}
}

export function $getSourceDocumentText(): string {
	return joinSourceBlocks(
		$getRoot()
			.getChildren()
			.map((block) => block.getTextContent())
	);
}

function $getAllSourceBlocks(): MarkdownSourceBlockNode[] {
	return $getRoot().getChildren().filter($isMarkdownSourceBlockNode);
}

function getBlocksInRange(blocks: MarkdownSourceBlockNode[], first: number, last: number): MarkdownSourceBlockNode[] {
	return blocks.slice(first, last + 1);
}

function getMarkdownInRange(blocks: MarkdownSourceBlockNode[], first: number, last: number): string {
	return joinSourceBlocks(getBlocksInRange(blocks, first, last).map((block) => block.getTextContent()));
}

function enhanceTokenizer(
	tokenize: SourceTokenizer,
	tokensByBlock?: ReadonlyMap<string, CachedBlockTokens>
): (block: MarkdownSourceBlockNode) => SourceToken[] {
	return (block) => {
		const text = block.getTextContent();
		const cached = tokensByBlock?.get(block.getKey());

		return cached?.text === text ? cached.tokens : tokenize(text);
	};
}

/**
 * The range of blocks to re-split, or null when no block changed.
 *
 * A boundary depends on the text on both sides of it, so the range reaches one block past the
 * edit each way. It then grows right while the block at its end can continue into the next,
 * which is how a freshly opened fence takes in the blocks below it.
 */
function findRangeToResplit(
	blocks: MarkdownSourceBlockNode[],
	dirty: ReadonlySet<string>,
	tokensOf: (block: MarkdownSourceBlockNode) => SourceToken[]
): [first: number, last: number] | null {
	const dirtyIndexes = blocks.flatMap((block, index) => (dirty.has(block.getKey()) ? [index] : []));

	if (dirtyIndexes.length === 0) {
		return null;
	}

	const lastIndex = blocks.length - 1;
	const first = Math.max(0, dirtyIndexes[0]! - 1);

	let last = Math.min(lastIndex, dirtyIndexes[dirtyIndexes.length - 1]! + 1);

	while (last < lastIndex && canSwallowsNextBlock(tokensOf(blocks[last]!))) {
		last++;
	}

	return [first, last];
}

/**
 * Splits the range's markdown into block texts, reaching further while the range turns out to
 * have been swallowed whole.
 *
 * Coming back as a single block means one construct inside the range covered all of it — an
 * unclosed fence, nearly always — and it will cover what follows too. Doubling the reach finds
 * how far in a handful of splits, where stepping one block at a time would re-split an ever
 * longer stretch on every pass.
 */
function resplitUntilStable(
	blocks: MarkdownSourceBlockNode[],
	first: number,
	last: number,
	tokenize: SourceTokenizer
): { last: number; split: SourceBlock[] } {
	const lastIndex = blocks.length - 1;

	let end = last;
	let split = splitSourceBlocksWithTokens(getMarkdownInRange(blocks, first, end), tokenize);

	while (split.length === 1 && end < lastIndex) {
		end = Math.min(lastIndex, first + Math.max(1, (end - first) * 2));
		split = splitSourceBlocksWithTokens(getMarkdownInRange(blocks, first, end), tokenize);
	}

	return { last: end, split };
}

function $createSourceBlock({ text, tokens }: SourceBlock, tokenize: SourceTokenizer): MarkdownSourceBlockNode {
	const block = $createMarkdownSourceBlockNode();

	// The split already parsed this text, so we use those tokens.
	// Only a block whose tokens do not match its text is parsed again.
	const blockTokens = tokens ?? tokenize(text);

	block.append(...$buildNodesFromSourceTokens(blockTokens));

	const cache = getSourceBlockCache($getEditor());

	// The highlighter reads this block as soon as the update ends. Storing the tokens saves it
	// parsing the same text again. Only for a load, though — see `repairing`.
	if (!cache.repairing) {
		cache.tokens.set(block.getKey(), { text, tokens: blockTokens });
	}

	return block;
}

function $prependSourceBlock(block: MarkdownSourceBlockNode): void {
	const first = $getRoot().getFirstChild();

	if (first === null) {
		$getRoot().append(block);
	} else {
		first.insertBefore(block);
	}
}

function $insertBlocksAfter(previous: LexicalNode | null, split: SourceBlock[], tokenize: SourceTokenizer): void {
	let cursor = previous;

	for (const piece of split) {
		const block = $createSourceBlock(piece, tokenize);

		if (cursor === null) {
			$prependSourceBlock(block);
		} else {
			cursor.insertAfter(block);
		}

		cursor = block;
	}
}

function $removeNonBlockChildren(): void {
	for (const child of $getRoot().getChildren()) {
		if (!$isMarkdownSourceBlockNode(child)) {
			child.remove();
		}
	}
}

function $reconcileBlocks(blocks: MarkdownSourceBlockNode[], split: SourceBlock[], tokenize: SourceTokenizer): void {
	const current = blocks.map((block) => block.getTextContent());
	const shortest = Math.min(current.length, split.length);

	let head = 0;

	while (head < shortest && current[head] === split[head]?.text) {
		head++;
	}

	let tail = 0;

	while (tail < shortest - head && current.at(-1 - tail) === split.at(-1 - tail)?.text) {
		tail++;
	}

	const stale = blocks.slice(head, blocks.length - tail);
	const fresh = split.slice(head, split.length - tail);

	if (stale.length === 0 && fresh.length === 0) {
		return;
	}

	const previous: LexicalNode | null = head > 0 ? blocks[head - 1]! : (blocks[0]?.getPreviousSibling() ?? null);
	const caret = $captureSourceDocumentSelection();

	for (const block of stale) {
		block.remove();
	}

	$insertBlocksAfter(previous, fresh, tokenize);

	if (caret !== null) {
		$restoreSourceDocumentSelection(caret);
	}
}

export function $setSourceDocument(markdown: string, tokenize: SourceTokenizer): void {
	$removeNonBlockChildren();
	$reconcileBlocks($getAllSourceBlocks(), splitSourceBlocksWithTokens(markdown, tokenize), tokenize);

	// These blocks come from splitting the whole document, so they are already right. Storing
	// the list here is what lets a freshly loaded document skip the boundary step.
	getSourceBlockCache($getEditor()).keys = $getSourceBlockKeys();
}

export function $repairBlockBoundaries(
	dirtyBlockKeys: ReadonlySet<string>,
	tokenize: SourceTokenizer,
	tokensByBlock?: ReadonlyMap<string, CachedBlockTokens>
): void {
	if ($getRoot().getChildrenSize() === 0) {
		$setSourceDocument("", tokenize);

		return;
	}

	if (dirtyBlockKeys.size === 0) {
		return;
	}

	const blocks = $getAllSourceBlocks();
	const currentBlockKeys = new Set(blocks.map((block) => block.getKey()));
	const dirtyBlocks = dirtyBlockKeys.intersection(currentBlockKeys);
	const range = findRangeToResplit(blocks, dirtyBlocks, enhanceTokenizer(tokenize, tokensByBlock));

	if (range === null) {
		return;
	}

	const [first, dirtyLast] = range;
	const { last, split } = resplitUntilStable(blocks, first, dirtyLast, tokenize);
	const cache = getSourceBlockCache($getEditor());

	cache.repairing = true;

	try {
		$reconcileBlocks(getBlocksInRange(blocks, first, last), split, tokenize);
	} finally {
		cache.repairing = false;
	}
}
