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

import { $isCodeNode } from "@lexical/code-core";
import { $isHorizontalRuleNode } from "@lexical/extension";
import { $isLinkNode } from "@lexical/link";
import { ListNode } from "@lexical/list";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $isTableNode } from "@lexical/table";
import { $findMatchingParent, $getNearestNodeOfType } from "@lexical/utils";
import type { LexicalEditor } from "lexical";
import { $getSelection, $isElementNode, $isNodeSelection, $isRangeSelection } from "lexical";

import { $isImageNode } from "../nodes/image-node.js";

import type { MarkdownEditorToolbarState, ToolbarStateReader } from "./toolbar-state.js";
import { DEFAULT_TOOLBAR_STATE, useEditorToolbarState } from "./toolbar-state.js";

/** {@link ToolbarStateReader} for the rich editor's node tree. */
const $readRichState: ToolbarStateReader = (canUndo, canRedo) => {
	const selection = $getSelection();

	// An image and a rule are decorators: clicking one selects the *node* rather
	// than a range, and that is the case these two flags exist for.
	if ($isNodeSelection(selection)) {
		const nodes = selection.getNodes();

		return {
			...DEFAULT_TOOLBAR_STATE,
			isImage: nodes.some($isImageNode),
			isThematicBreak: nodes.some($isHorizontalRuleNode),
			canUndo,
			canRedo
		};
	}

	if (!$isRangeSelection(selection)) {
		return { ...DEFAULT_TOOLBAR_STATE, canUndo, canRedo };
	}

	const anchorNode = selection.anchor.getNode();
	const element =
		anchorNode.getKey() === "root"
			? anchorNode
			: ($findMatchingParent(anchorNode, (node) => $isElementNode(node) && !node.isInline()) ??
				anchorNode.getTopLevelElementOrThrow());

	const listNode = $getNearestNodeOfType(anchorNode, ListNode);
	const listType = listNode ? listNode.getListType() : null;
	const inList = listNode !== null;

	// Only the anchor, never `selection.getNodes()`: that materializes the whole
	// selected range, which would put a select-all's cost on every caret move.
	const isImage = $isImageNode(anchorNode);
	const isThematicBreak = $isHorizontalRuleNode(anchorNode);

	const linkParent = $findMatchingParent(anchorNode, (node) => $isLinkNode(node));
	const codeNode = $findMatchingParent(anchorNode, (node) => $isCodeNode(node));
	const tableNode = $findMatchingParent(anchorNode, (node) => $isTableNode(node));

	const headingLevel = $isHeadingNode(element)
		? (Number(element.getTag().slice(1)) as MarkdownEditorToolbarState["headingLevel"])
		: 0;

	return {
		isBold: selection.hasFormat("bold"),
		isItalic: selection.hasFormat("italic"),
		isStrike: selection.hasFormat("strikethrough"),
		isUnderline: selection.hasFormat("underline"),
		isCode: selection.hasFormat("code"),
		isHighlight: selection.hasFormat("highlight"),
		isSubscript: selection.hasFormat("subscript"),
		isSuperscript: selection.hasFormat("superscript"),
		headingLevel,
		isBulletList: listType === "bullet",
		isOrderedList: listType === "number",
		isTaskList: listType === "check",
		canSink: inList,
		canLift: inList,
		isLink: linkParent !== null,
		isImage,
		isThematicBreak,
		isBlockquote: $isQuoteNode(element),
		isCodeBlock: codeNode !== null,
		codeBlockLanguage: codeNode && $isCodeNode(codeNode) ? (codeNode.getLanguage() ?? "") : "",
		isInTable: tableNode !== null,
		canUndo,
		canRedo
	};
};

/**
 * Derives the {@link MarkdownEditorToolbarState} from the rich editor's node tree,
 * recomputing on selection and content changes. Safe to call with a `null` editor
 * (returns the disabled default state).
 */
export function useRichToolbarState(editor: LexicalEditor | null): MarkdownEditorToolbarState {
	return useEditorToolbarState(editor, $readRichState);
}
