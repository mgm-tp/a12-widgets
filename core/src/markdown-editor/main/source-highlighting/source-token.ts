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

import type { TokenType as BaseTokenType } from "micromark-util-types";

/**
 * GFM token types, listed by hand.
 *
 * An extension normally declares its types in `TokenTypeMap`, which widens `BaseTokenType`.
 * The GFM ones do too, but their packages belong to `@lexical/mdast` and are not ours to import,
 * so the types we need are repeated here.
 */
type GfmTokenType =
	| "literalAutolink"
	| "strikethrough"
	| "strikethroughSequence"
	| "table"
	| "tableCellDivider"
	| "tableDelimiterFiller"
	| "taskListCheck";

/**
 * Every source token type the tree can hold, from two places:
 *
 * - `BaseTokenType` — CommonMark, plus any extension whose package we import,
 *   such as `micromark-extension-directive`, which declares its own types.
 * - {@link GfmTokenType} — GFM, listed by hand because its packages are not ours to import.
 */
export type SourceTokenType = BaseTokenType | GfmTokenType;

interface SourceTextToken {
	kind: "text";
	text: string;
}

interface SourceElementToken {
	kind: "element";
	type: SourceTokenType;
	children: SourceToken[];
}

export type SourceToken = SourceTextToken | SourceElementToken;

/**
 * The markdown these tokens were parsed from, put back together.
 *
 * The tree keeps every character, markup included, so concatenating the text of the whole tree
 * returns the input unchanged — and of a subtree, exactly the part it covers.
 *
 * ```
 * // For the tree of "## title":
 * getSourceTokenText(tree)  →  "## title"   (the markdown it came from)
 * ```
 */
export function getSourceTokenText(tokens: SourceToken[]): string {
	let text = "";

	for (const token of tokens) {
		text += token.kind === "text" ? token.text : getSourceTokenText(token.children);
	}

	return text;
}

/**
 * The construct's depth — see {@link MarkdownTokenNode.__level}.
 *
 * Only ATX headings have one: the number of `#` characters,
 * which micromark reports as the heading's `atxHeadingSequence` child
 * rather than on the heading itself.
 */
export function getHeadingLevel(token: SourceElementToken): number {
	if (token.type !== "atxHeading") {
		return 0;
	}

	// Find the child holding the leading `#` characters.
	const sequence = token.children.find((child) => child.kind === "element" && child.type === "atxHeadingSequence");

	// Count them: `###` is level 3. Fall back to 0, which means paragraph.
	return sequence ? getSourceTokenText([sequence]).length : 0;
}

/**
 * Token types that only wrap text and carry nothing of their own.
 *
 * micromark puts a `data` around every run of plain text, and chunks it further while parsing.
 * None of the three are styled, and nothing asks for them, so a token whose whole content is
 * one of these is treated as holding the text directly — see {@link normalizeSourceTokens}.
 *
 * Only the types listed here fold away. Anything else stays, including what an extension adds.
 * Add a type only when it carries nothing.
 */
export const TRANSPARENT_TOKEN_TYPES = new Set<SourceTokenType>(["data", "chunkString", "chunkText"]);

/** Markup that the `Sequence` / `Marker` check below cannot catch, so it is listed by hand. */
const MARKUP_TOKEN_TYPES = new Set<SourceTokenType>([
	"codeFencedFenceInfo",
	"listItemValue",
	"tableCellDivider",
	"tableDelimiterFiller"
]);

/**
 * Whether the token is syntax rather than the text it wraps — `###`, `**`, `|`, a list's `1.`.
 *
 * micromark names most of them consistently: `atxHeadingSequence`, `blockQuoteMarker`, ...
 * so matching the two suffixes covers nearly everything, extensions included.
 * The rest are listed in {@link MARKUP_TOKEN_TYPES}.
 */
export function isMarkupTokenType(type: SourceTokenType): boolean {
	return type.endsWith("Sequence") || type.endsWith("Marker") || MARKUP_TOKEN_TYPES.has(type);
}
