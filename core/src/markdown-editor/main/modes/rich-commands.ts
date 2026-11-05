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
 * Turns toolbar clicks into Lexical commands and editor updates.
 * Buttons that toggle check {@link MarkdownEditorToolbarState} to see if they are already on.
 */

import { $createCodeNode, $isCodeNode } from "@lexical/code-core";
import {
	INSERT_CHECK_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
	REMOVE_LIST_COMMAND
} from "@lexical/list";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import type { HeadingTagType } from "@lexical/rich-text";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
	$deleteTableColumnAtSelection,
	$deleteTableRowAtSelection,
	$getTableCellNodeFromLexicalNode,
	$getTableColumnIndexFromTableCellNode,
	$insertTableColumnAtSelection,
	$insertTableRowAtSelection,
	$isTableNode,
	$isTableRowNode,
	INSERT_TABLE_COMMAND
} from "@lexical/table";
import { $findMatchingParent } from "@lexical/utils";
import type { ElementFormatType, ElementNode, LexicalEditor } from "lexical";
import {
	$createParagraphNode,
	$getSelection,
	$isElementNode,
	$isRangeSelection,
	FORMAT_TEXT_COMMAND,
	INDENT_CONTENT_COMMAND,
	OUTDENT_CONTENT_COMMAND,
	REDO_COMMAND,
	UNDO_COMMAND
} from "lexical";

import type { MarkdownEditorToolbarState } from "../toolbar/toolbar-state.js";

export interface RichCommands {
	undo: () => void;
	redo: () => void;
	toggleBold: () => void;
	toggleItalic: () => void;
	toggleStrike: () => void;
	toggleUnderline: () => void;
	toggleHighlight: () => void;
	toggleCode: () => void;
	toggleSubscript: () => void;
	toggleSuperscript: () => void;
	toggleBulletList: () => void;
	toggleOrderedList: () => void;
	toggleTaskList: () => void;
	sinkListItem: () => void;
	liftListItem: () => void;
	toggleBlockquote: () => void;
	setHorizontalRule: () => void;
	setParagraph: () => void;
	toggleHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => void;
	toggleCodeBlock: (language: string) => void;
	setCodeBlockLanguage: (language: string) => void;
	insertTable: (rows: number, columns: number) => void;
	addRowBefore: () => void;
	addRowAfter: () => void;
	addColumnBefore: () => void;
	addColumnAfter: () => void;
	deleteRow: () => void;

	/**
	 * Aligns the column the caret is in. GFM keeps one alignment per column, written in the
	 * delimiter row, so every cell of the column moves together. `""` clears it.
	 */
	setColumnAlignment: (alignment: ElementFormatType) => void;
	deleteColumn: () => void;
	deleteTable: () => void;
}

export function createRichCommands(editor: LexicalEditor, state: MarkdownEditorToolbarState): RichCommands {
	// Toolbar buttons call preventDefault on mousedown, so the editor keeps focus
	// and the user's selection is still there when the command runs.
	const update = (fn: () => void): void => {
		editor.update(fn);
	};

	const setBlocks = (create: () => ElementNode): void =>
		update(() => {
			const selection = $getSelection();

			if ($isRangeSelection(selection)) {
				$setBlocksType(selection, create);
			}
		});

	return {
		undo: () => editor.dispatchCommand(UNDO_COMMAND, undefined),
		redo: () => editor.dispatchCommand(REDO_COMMAND, undefined),
		toggleBold: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold"),
		toggleItalic: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic"),
		toggleStrike: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough"),
		toggleUnderline: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline"),
		toggleHighlight: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight"),
		toggleCode: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code"),
		toggleSubscript: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript"),
		toggleSuperscript: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript"),
		toggleBulletList: () =>
			editor.dispatchCommand(state.isBulletList ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND, undefined),
		toggleOrderedList: () =>
			editor.dispatchCommand(state.isOrderedList ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND, undefined),
		toggleTaskList: () =>
			editor.dispatchCommand(state.isTaskList ? REMOVE_LIST_COMMAND : INSERT_CHECK_LIST_COMMAND, undefined),
		sinkListItem: () => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined),
		liftListItem: () => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined),
		toggleBlockquote: () => setBlocks(() => (state.isBlockquote ? $createParagraphNode() : $createQuoteNode())),
		setHorizontalRule: () => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
		setParagraph: () => setBlocks(() => $createParagraphNode()),
		toggleHeading: (level) =>
			setBlocks(() =>
				state.headingLevel === level ? $createParagraphNode() : $createHeadingNode(`h${level}` as HeadingTagType)
			),
		toggleCodeBlock: (language) =>
			setBlocks(() => (state.isCodeBlock ? $createParagraphNode() : $createCodeNode(language || undefined))),
		setCodeBlockLanguage: (language) =>
			update(() => {
				const selection = $getSelection();

				if (!$isRangeSelection(selection)) {
					return;
				}

				const code = $findMatchingParent(selection.anchor.getNode(), (node) => $isCodeNode(node));

				if ($isCodeNode(code)) {
					code.setLanguage(language || "");
				}
			}),
		insertTable: (rows, columns) =>
			editor.dispatchCommand(INSERT_TABLE_COMMAND, {
				columns: String(columns),
				rows: String(rows),
				// A header row only. `includeHeaders: true` would also make the first column a header.
				// A GFM table is one header row, a delimiter row and data rows;
				// alignment is the only thing a column carries.
				includeHeaders: { rows: true, columns: false }
			}),
		addRowBefore: () => update(() => $insertTableRowAtSelection(false)),
		addRowAfter: () => update(() => $insertTableRowAtSelection(true)),
		addColumnBefore: () => update(() => $insertTableColumnAtSelection(false)),
		addColumnAfter: () => update(() => $insertTableColumnAtSelection(true)),
		deleteRow: () => update(() => $deleteTableRowAtSelection()),
		setColumnAlignment: (alignment) =>
			update(() => {
				const selection = $getSelection();

				if (!$isRangeSelection(selection)) {
					return;
				}

				const cell = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
				const table = cell && $findMatchingParent(cell, (node) => $isTableNode(node));

				if (!cell || !$isTableNode(table)) {
					return;
				}

				// GFM writes one alignment per column, in the delimiter row, so the whole column
				// moves together — https://github.github.com/gfm/#tables-extension-
				const column = $getTableColumnIndexFromTableCellNode(cell);

				for (const row of table.getChildren()) {
					if (!$isTableRowNode(row)) {
						continue;
					}

					const target = row.getChildren()[column];

					for (const block of $isElementNode(target) ? target.getChildren() : []) {
						if ($isElementNode(block)) {
							block.setFormat(alignment);
						}
					}
				}
			}),
		deleteColumn: () => update(() => $deleteTableColumnAtSelection()),
		deleteTable: () =>
			update(() => {
				const selection = $getSelection();

				if (!$isRangeSelection(selection)) {
					return;
				}

				const table = $findMatchingParent(selection.anchor.getNode(), (node) => $isTableNode(node));

				if (table) {
					table.remove();
				}
			})
	};
}
