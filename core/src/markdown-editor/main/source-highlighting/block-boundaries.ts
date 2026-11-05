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

import type { SourceTokenizer } from "./micromark-tokenizer.js";
import type { SourceToken } from "./source-token.js";
import { getSourceTokenText } from "./source-token.js";

/** One chunk of the token stream: an `element` token plus the `text` tokens joined to it. */
interface SourceChunk {
	text: string;
	tokens: SourceToken[];
}

/**
 * One block, with the tokens the parse already made for it.
 *
 * `tokens` is null when those tokens do not match the block's text. This happens when a block
 * ends with the `\r` of a CRLF: the block keeps the `\r`, but its token covers `\r\n`. The code
 * that builds such a block parses the text again.
 */
export interface SourceBlock {
	text: string;

	tokens: SourceToken[] | null;
}

/**
 * Turns the flat token list into chunks — one per top-level `element` token.
 *
 * ```
 * // "# Title\n\nHello\n" tokenizes to
 * [atxHeading] [lineEnding] [lineEnding] [paragraph] [lineEnding]
 *
 * // and becomes
 * ["# Title", "\n", "\n", "Hello", "\n"]
 * ```
 *
 * Each `element` token starts a new chunk, a `text` token is glued onto the chunk before it.
 * No character is lost, so joining the result gives back the input.
 *
 * Line endings are `element` tokens as well, which is why each one gets a chunk of its own
 * and those are exactly the chunks {@link splitSourceBlocksWithTokens} cuts at.
 */
function chunkSourceTokens(tokens: SourceToken[]): SourceChunk[] {
	const chunks: SourceChunk[] = [];

	for (const token of tokens) {
		const text = token.kind === "text" ? token.text : getSourceTokenText([token]);

		if (token.kind === "element" || chunks.length === 0) {
			chunks.push({ text, tokens: [token] });
		} else {
			const last = chunks[chunks.length - 1]!;

			last.text += text;
			last.tokens.push(token);
		}
	}

	return chunks;
}

/** A chunk that is just a line ending. These are the ones that separate two blocks. */
const LINE_ENDING = /^\r?\n$/;

/**
 * Splits markdown into blocks, cutting at every line ending between two constructs, and keeps
 * the tokens the parse already produced for each block.
 *
 * The document is parsed once, here. Parsing each block a second time costs more than this
 * whole step, so each block keeps the tokens it already has.
 *
 * Only the `\n` itself is the separator, so putting the text back together is `blocks.join("\n")`.
 * Two newlines in a row leave an empty block between them, which is a blank line.
 *
 * ```
 * "# Title\n\nHello\n"  ->  ["# Title", "", "Hello", ""]
 * "- a\n- b\n\nafter"   ->  ["- a\n- b", "", "after"]
 * ```
 *
 * A CRLF ending keeps its `\r` on the block it followed, so nothing is dropped
 * and the join still gives back the input byte for byte.
 * That is also where a `\r` already sits when the ending is *inside* a construct,
 * so both kinds of ending are stored the same way.
 *
 * ```
 * "a\r\n\r\nb"  ->  ["a\r", "\r", "b"]
 * ```
 *
 * Endings *inside* a construct — between list items, or lines of a fence
 * belong to its chunk and stay put. The empty document answers `[""]`,
 * because the caret needs a block to sit in.
 */
export function splitSourceBlocksWithTokens(markdown: string, tokenize: SourceTokenizer): SourceBlock[] {
	const blocks: SourceBlock[] = [{ text: "", tokens: [] }];

	for (const chunk of chunkSourceTokens(tokenize(markdown))) {
		const last = blocks[blocks.length - 1]!;

		if (LINE_ENDING.test(chunk.text)) {
			// Everything but the trailing `\n` — the `\r` of a CRLF, or nothing at all.
			const kept = chunk.text.slice(0, -1);

			last.text += kept;

			// This `\r` is not what the chunk's tokens describe, so the tokens no longer match.
			if (kept !== "") {
				last.tokens = null;
			}

			blocks.push({ text: "", tokens: [] });
		} else {
			last.text += chunk.text;
			last.tokens?.push(...chunk.tokens);
		}
	}

	return blocks;
}

/** The markdown a list of blocks stands for, with the separators between them put back. */
export function joinSourceBlocks(blocks: string[]): string {
	return blocks.join("\n");
}

/** Constructs that keep going past a blank line instead of ending at it. */
const OPEN_ENDED_TOKEN_TYPES: ReadonlySet<string> = new Set([
	"codeFenced",
	"directiveContainer",
	"listOrdered",
	"listUnordered",
	"blockQuote",
	"table",
	"htmlFlow"
]);

/**
 * Whether this block can continue into the next one — a fence, list, quote or table can,
 * a paragraph or heading cannot.
 * ```
 * "para"                   ->  false  // a paragraph ends at its last line
 * "```js\nconst a=1"       ->  true   // the fence is still open, so it takes in what follows
 * "```js\nconst a=1\n```"  ->  true   // closed, but only the token type is looked at
 * ```
 *
 * It reads the block's last top-level token
 * and checks whether that kind of token is one that can span more than one block.
 *
 * `affectedRange` in `source-document.ts` is the caller: after an edit it re-splits the blocks around it
 * and keeps pulling in the block below while this answers `true`.
 */
export function canSwallowsNextBlock(tokens: SourceToken[]): boolean {
	const last = tokens[tokens.length - 1];

	return last !== undefined && last.kind === "element" && OPEN_ENDED_TOKEN_TYPES.has(last.type);
}
