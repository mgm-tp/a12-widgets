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

import type { TableCellNode } from "@lexical/table";
import { $isTableCellNode } from "@lexical/table";
import { $getNearestNodeFromDOMNode, $getSelection, $isRangeSelection } from "lexical";
import type { FC } from "react";
import { useCallback, useContext, useEffect, useState } from "react";

import type { MarkdownEditorTitles } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import type { RichCommands } from "../modes/rich-commands.js";
import { createRichCommands } from "../modes/rich-commands.js";
import { useMarkdownEditorSurfaces } from "../shared/surfaces-context.js";
import { DEFAULT_TOOLBAR_STATE } from "../toolbar/toolbar-state.js";
import { focusEditor } from "../utils/helpers.js";

import { findContextMenuTarget } from "./context-menu.utils.js";
import type { ContextMenuOperation } from "./editor-context-menu.view.js";
import { EditorContextMenu, POINTER_OFFSET } from "./editor-context-menu.view.js";

const HEADER_CELL_TAG = "TH";

/** Where the menu opened, and what the cell under the pointer was. */
interface ContextMenuAnchor {
	/** Viewport coordinates, already moved off the pointer by {@link POINTER_OFFSET}. */
	position: { top: number; left: number };

	/**
	 * The right-click landed in the header row. GFM has no row above the header
	 * and a table without a header is not a table, so "insert row above" and "delete row" are off.
	 */
	inHeaderRow: boolean;
}

interface TableContextMenuProps {
	/** Rich edit mode, editor not disabled. Off everywhere else, so the browser menu comes back. */
	enabled: boolean;
}

/**
 * Moves the caret into `cell`, unless it is already there.
 */
function $placeCaretIn(cell: HTMLElement): void {
	const cellNode = $getNearestNodeFromDOMNode(cell);

	if (!$isTableCellNode(cellNode)) {
		return;
	}

	const selection = $getSelection();
	const caretCell: TableCellNode | undefined = $isRangeSelection(selection)
		? selection.anchor.getNode().getParents().find($isTableCellNode)
		: undefined;

	if (caretCell?.getKey() !== cellNode.getKey()) {
		cellNode.selectEnd();
	}
}

/**
 * The menu, in order: the row operations, the column operations, the column's alignment,
 * then the table itself.
 *
 * GFM writes one alignment per column, in the delimiter row, so the alignment entries move the
 * whole column the click landed in — https://github.github.com/gfm/#tables-extension-
 *
 * Two operations are off while the click landed in the header row.
 * GFM has no row above the header and a table without a header row is not a table.
 * Everything else stays on: inserting below the header writes the first body row,
 * a column reaches every row and deleting the table takes the header with it anyway.
 */
function buildOperations(
	titles: MarkdownEditorTitles | undefined,
	commands: RichCommands,
	inHeaderRow: boolean
): ContextMenuOperation[] {
	return [
		{
			key: "addRowBefore",
			label: titles?.addRowBefore,
			icon: "add_row_above",
			disabled: inHeaderRow,
			run: commands.addRowBefore
		},
		{ key: "addRowAfter", label: titles?.addRowAfter, icon: "add_row_below", run: commands.addRowAfter },
		{ key: "deleteRow", label: titles?.deleteRow, icon: "delete", disabled: inHeaderRow, run: commands.deleteRow },
		{
			key: "addColumnBefore",
			label: titles?.addColumnBefore,
			icon: "add_column_left",
			run: commands.addColumnBefore
		},
		{ key: "addColumnAfter", label: titles?.addColumnAfter, icon: "add_column_right", run: commands.addColumnAfter },
		{ key: "deleteColumn", label: titles?.deleteColumn, icon: "delete", run: commands.deleteColumn },
		{
			key: "alignColumnLeft",
			label: titles?.alignColumnLeft,
			icon: "align_horizontal_left",
			run: () => commands.setColumnAlignment("left")
		},
		{
			key: "alignColumnCenter",
			label: titles?.alignColumnCenter,
			icon: "align_horizontal_center",
			run: () => commands.setColumnAlignment("center")
		},
		{
			key: "alignColumnRight",
			label: titles?.alignColumnRight,
			icon: "align_horizontal_right",
			run: () => commands.setColumnAlignment("right")
		},
		{ key: "deleteTable", label: titles?.deleteTable, icon: "delete_forever", run: commands.deleteTable }
	];
}

/**
 * Right-click in a table to add or delete the row and column we clicked on.
 *
 * The toolbar's table menu works on the row the caret is in. This one works on the cell we clicked:
 * the click moves the caret there first, so both agree on which row it means.
 *
 * The Menu key and Shift+F10 open the same menu, at the caret.
 */
export const TableContextMenu: FC<TableContextMenuProps> = ({ enabled }) => {
	const { richEditor, features } = useMarkdownEditorSurfaces();
	const { markdownEditorTitles: titles } = useContext(A11YLanguageContext);
	const [anchor, setAnchor] = useState<ContextMenuAnchor | null>(null);

	const active = enabled && features.table;

	/** Closes the menu and leaves focus where it is: the user clicked away. */
	const onDismiss = useCallback((): void => setAnchor(null), []);

	/** Closes the menu and puts the caret back in the text, so typing carries on. */
	const closeAndReturnCaret = useCallback((): void => {
		setAnchor(null);
		focusEditor(richEditor);
	}, [richEditor]);

	useEffect(() => {
		const root = richEditor.getRootElement();

		if (!active || !root) {
			return undefined;
		}

		const onContextMenu = (event: MouseEvent): void => {
			const target = findContextMenuTarget(event, root);

			// Outside a table the browser's own menu is the right one
			// - spell check, paste, translate. Nothing here beats it.
			// A picture in a cell has its own menu, and `findContextMenuTarget` gives it the click.
			if (target?.kind !== "cell") {
				return;
			}

			const cell = target.element;

			event.preventDefault();
			richEditor.update(() => $placeCaretIn(cell));

			setAnchor({
				position: { top: event.clientY + POINTER_OFFSET.top, left: event.clientX + POINTER_OFFSET.left },
				inHeaderRow: cell.tagName === HEADER_CELL_TAG
			});
		};

		root.addEventListener("contextmenu", onContextMenu);

		return (): void => root.removeEventListener("contextmenu", onContextMenu);
	}, [richEditor, active]);

	// Leaving edit mode, or losing the table feature, with the menu still open.
	useEffect(() => {
		if (!active) {
			onDismiss();
		}
	}, [active, onDismiss]);

	if (!anchor) {
		return null;
	}

	// Not `useToolbarCommand`: that reads the toolbar state, which is provided inside
	// `MarkdownEditor.Toolbar` so the caret moving re-renders the toolbar and nothing else.
	// This menu lives next to the surface and none of the table operations reads that state.
	const operations = buildOperations(titles, createRichCommands(richEditor, DEFAULT_TOOLBAR_STATE), anchor.inHeaderRow);

	return (
		<EditorContextMenu
			position={anchor.position}
			operations={operations}
			listDataRole={DataRoles.MarkdownEditor.ContextMenu.List}
			itemDataRole={DataRoles.MarkdownEditor.ContextMenu.ListItem}
			onClickOutside={onDismiss}
			onRequestClose={closeAndReturnCaret}
		/>
	);
};

TableContextMenu.displayName = "MarkdownTableContextMenu";
