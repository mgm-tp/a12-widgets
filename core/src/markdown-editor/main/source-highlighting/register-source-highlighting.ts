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
import { $getNodeByKey, $onUpdate, LineBreakNode, mergeRegister, RootNode, TabNode } from "lexical";

import { $isMarkdownSourceBlockNode, MarkdownSourceBlockNode } from "../nodes/markdown-source-block-node.js";
import { MarkdownTokenNode } from "../nodes/markdown-token-node.js";
import { MarkdownTokenTextNode } from "../nodes/markdown-token-text-node.js";

import { $captureBlockSelection, $restoreBlockSelection } from "./block-offsets.js";
import { diffBlockChildren } from "./block-structure-diff.js";
import type { SourceTokenizer } from "./micromark-tokenizer.js";
import {
	$getSourceBlockKeys,
	$markBlocksAroundStructureChange,
	$repairBlockBoundaries,
	getSourceBlockCache
} from "./source-document.js";
import type { SourceToken } from "./source-token.js";

export function registerSourceHighlighting(editor: LexicalEditor, tokenize: SourceTokenizer): () => void {
	/** Keys of the blocks whose text changed in this update, for the boundary pass. */
	const dirtyBlocks = new Set<string>();

	/** Keys of the blocks being highlighted right now, so the nodes that adds cannot start it again. */
	const beingHighlightedBlocks = new Set<string>();

	/** What we remember about this editor's blocks: their tokens, and their order. */
	const cache = getSourceBlockCache(editor);

	/** Tokens already parsed for a block, reused while its text is unchanged. */
	const cachedBlockTokens = cache.tokens;

	const tokenizeBlockTextContent = (blockKey: string, text: string): SourceToken[] => {
		const cached = cachedBlockTokens.get(blockKey);

		if (cached && cached.text === text) {
			return cached.tokens;
		}

		const tokens = tokenize(text);

		cachedBlockTokens.set(blockKey, { text, tokens });

		return tokens;
	};

	/**
	 * Updates one block's token nodes so they match its text.
	 * Only the nodes that differ are replaced, so a keystroke costs one block, not the document.
	 *
	 * Also adds the block to `dirtyBlocks`, because this is the only place that knows its text changed.
	 *
	 * Does nothing in two cases:
	 * - the block is already being highlighted, because the nodes this adds would call it again
	 * - or an IME is composing, because rebuilding the block would drop the IME's own selection.
	 *
	 * The caret is saved as a character offset and restored afterwards
	 * because the nodes holding it are replaced.
	 */
	const $highlightBlock = (block: MarkdownSourceBlockNode): void => {
		const key = block.getKey();

		if (beingHighlightedBlocks.has(key) || editor.isComposing()) {
			return;
		}

		const text = block.getTextContent();

		// Only mark the block if it holds text we have not parsed yet. Typing does that, and so
		// does a block Lexical just created, because it is not in the cache at all. A block the
		// loader built is already cached with its own text, so a fresh document marks nothing.
		if (cachedBlockTokens.get(key)?.text !== text) {
			dirtyBlocks.add(key);
		}

		const diff = diffBlockChildren(block.getChildren(), tokenizeBlockTextContent(key, text));

		// The nodes already match the tokens, so there is nothing to replace.
		if (diff === "same") {
			return;
		}

		beingHighlightedBlocks.add(key);

		// This runs after the update finishes. Until then the block is skipped and the next update can highlight it again.
		$onUpdate(() => beingHighlightedBlocks.delete(key));

		const capturedSelection = $captureBlockSelection(block);

		// The block, or the token node inside it that changed.
		const elementToPatch = diff.target ?? block;

		// Puts the new nodes in place of the old ones.
		elementToPatch.splice(diff.from, diff.to - diff.from, diff.nodes);

		if (capturedSelection !== null) {
			$restoreBlockSelection(block, capturedSelection);
		}
	};

	/**
	 * Highlights the block that `node` sits in.
	 *
	 * Lexical only runs element transforms for nodes it was told changed
	 * and a block whose child was edited does not count as one.
	 * So typing never reaches a transform registered on the block itself
	 * and the leaves have to walk up and start it.
	 */
	const $highlightOwningBlock = (node: LexicalNode): void => {
		const block = node.getParents().find($isMarkdownSourceBlockNode);

		if (block) {
			$highlightBlock(block);
		}
	};

	return mergeRegister(
		editor.registerNodeTransform(MarkdownTokenTextNode, $highlightOwningBlock),
		editor.registerNodeTransform(MarkdownTokenNode, $highlightOwningBlock),
		editor.registerNodeTransform(LineBreakNode, $highlightOwningBlock),
		editor.registerNodeTransform(TabNode, $highlightOwningBlock),
		editor.registerNodeTransform(MarkdownSourceBlockNode, $highlightBlock),

		// Re-splits the blocks around the edit, so the boundaries match the text again.
		editor.registerNodeTransform(RootNode, () => {
			// A block that was added or removed leaves its neighbours reading the same, so nothing
			// above marked them. Comparing the block list finds them.
			const seen = $getSourceBlockKeys();

			$markBlocksAroundStructureChange(seen, cache.keys, dirtyBlocks);

			// The list as this run saw it, stored before the repair moves anything.
			// The next run compares with it, so a repair that is not finished yet keeps going.
			cache.keys = seen;

			$repairBlockBoundaries(dirtyBlocks, tokenize, cachedBlockTokens);
			dirtyBlocks.clear();

			// Forget the tokens of blocks that no longer exist, or the cache grows forever.
			for (const key of cachedBlockTokens.keys()) {
				if ($getNodeByKey(key) === null) {
					cachedBlockTokens.delete(key);
				}
			}
		})
	);
}
