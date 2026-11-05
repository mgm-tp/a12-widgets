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

import type { LexicalEditor } from "lexical";

import type { MarkdownTokenNode } from "../nodes/markdown-token-node.js";
import { $getCoveringMdTokenNodesAtCaret } from "../nodes/markdown-token-node.js";
import type { SourceTokenType } from "../source-highlighting/source-token.js";

import type { HeadingLevel } from "./toolbar-command-registry.js";
import type { MarkdownEditorToolbarState, ToolbarStateReader } from "./toolbar-state.js";
import { DEFAULT_TOOLBAR_STATE, useEditorToolbarState } from "./toolbar-state.js";

/** The innermost covering token of `type`, or undefined when the caret is outside one. */
function $coveringToken(covering: MarkdownTokenNode[], type: SourceTokenType): MarkdownTokenNode | undefined {
	return covering.find((token) => token.getTokenType() === type);
}

/** The heading level of the covering ATX heading, or 0 when the caret is elsewhere. */
function $headingLevel(tokenNode: MarkdownTokenNode[]): HeadingLevel {
	const level = $coveringToken(tokenNode, "atxHeading")?.getLevel() ?? 0;

	return level >= 1 && level <= 6 ? (level as HeadingLevel) : 0;
}

/** {@link ToolbarStateReader} for the highlighted source surface's token tree. */
const $readSourceState: ToolbarStateReader = (canUndo, canRedo) => {
	const coveringMdTokenNodes = $getCoveringMdTokenNodesAtCaret();
	const types = new Set(coveringMdTokenNodes.map((tokenNode) => tokenNode.getTokenType()));

	return {
		...DEFAULT_TOOLBAR_STATE,

		// Every source command is a text transform over the whole document,
		// coveringMdTokenNodes dispatched without a selection falls back to its end
		// so all of them are always available. Only the *active* flags depend on the covering constructs.
		canSink: true,
		canLift: true,
		canUndo,
		canRedo,

		isBold: types.has("strong"),
		isItalic: types.has("emphasis"),
		isStrike: types.has("strikethrough"),
		isCode: types.has("codeText"),
		headingLevel: $headingLevel(coveringMdTokenNodes),
		isBulletList: types.has("listUnordered"),
		isOrderedList: types.has("listOrdered"),
		isTaskList: types.has("taskListCheck"),
		isBlockquote: types.has("blockQuote"),
		isCodeBlock: types.has("codeFenced") || types.has("codeIndented"),
		// A link is `link` (inline + reference), `autolink` (`<http://…>`) or
		// `literalAutolink` (a bare URL, from the GFM extension).
		isLink: types.has("link") || types.has("autolink") || types.has("literalAutolink"),
		isImage: types.has("image"),
		isThematicBreak: types.has("thematicBreak"),
		isInTable: types.has("table"),

		// The formats with no markdown syntax; the tokenizer pairs their delimiters itself,
		// so they read like any other construct here.
		isHighlight: types.has("inlineHighlight"),
		isUnderline: types.has("inlineUnderline"),
		isSubscript: types.has("inlineSubscript"),
		isSuperscript: types.has("inlineSuperscript")
	};
};

/**
 * The toolbar snapshot for the highlighted source surface.
 *
 * Where rich mode asks the node tree what formats the selection carries,
 * source mode asks the *token* tree: the constructs covering the caret are its ancestor chain,
 * so "inside `**…**`" is `getParents()` filtered to token nodes
 * no position arithmetic and no separate parse.
 */
export function useSourceToolbarState(sourceEditor: LexicalEditor | null): MarkdownEditorToolbarState {
	return useEditorToolbarState(sourceEditor, $readSourceState);
}
