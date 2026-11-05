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

/*
 * Deliberate fork of `core/src/table/main/table-renderer.api.ts` — see `./README.md`.
 * Subset: only the scroll handler and the drag payload shapes. DataTable's own
 * renderer props live in `../data-table-renderer.api.ts`.
 */

/**
 * A handler function that scrolls to a specific node (row) in the table.
 * @param nodeIndex - The index of the node (row) to scroll to
 * @param options - Optional configuration object
 * @param options.autoFocus - If true, automatically focuses the node after scrolling
 */
export type TableScrollToNodeHandler = (nodeIndex: number, options?: { autoFocus?: boolean }) => void;

export namespace TableRenderPropsType {
	export interface DragObject<RowType = unknown> {
		rowIndex: number;
		row: RowType;

		/**
		 * Optional width snapshot used by the floating drag preview, when the renderer
		 * needs to mirror the source row's dimensions. Populated by DataTable; the
		 * production Table leaves this undefined.
		 */
		width?: number;

		/**
		 * Optional intrinsic row width (the dragged `<tr>`'s `offsetWidth`). Captured
		 * by DataTable so the floating preview can render the row at its natural
		 * column widths while clipping to the viewport's visible width.
		 */
		rowWidth?: number;

		/**
		 * Optional horizontal scroll offset of the source viewport at drag start.
		 * DataTable applies this as a `translateX(-scrollLeft)` to the snapshot so
		 * the preview shows the same columns the user was looking at.
		 */
		scrollLeft?: number;

		/**
		 * Optional snapshot of the dragged row's outer HTML, captured at drag start.
		 * Used by the DataTable floating preview to mirror the source row.
		 */
		snapshotHTML?: string;

		/**
		 * Optional clone of the source table's `<colgroup>`, captured alongside
		 * {@link snapshotHTML}. Its presence tells the preview that the snapshot is a
		 * `<tr>` needing a `<table>` host to reproduce the source column widths; card
		 * view captures a card `<div>`, which has no column geometry and is hosted
		 * directly.
		 */
		snapshotColgroupHTML?: string;
	}

	export interface HoveredObject<RowType = unknown> {
		/**
		 * The **insertion index** the drop would land at (`0…rowCount`), i.e. the gap
		 * the dragged row moves into — **not** the hovered row's own index.
		 *
		 * DataTable has no discrete top/bottom drop bands: hovering the bottom half of
		 * row *i* reports `rowIndex === i + 1` (insert after), the top half reports `i`
		 * (insert before). {@link row} is the hovered row itself. A `canDrop` ported
		 * from the production `Table` (where this was the hovered row's index) must
		 * account for the off-by-one on "insert after" hovers.
		 */
		rowIndex: number;
		row: RowType;
	}

	export interface DropResult<RowType = unknown> {
		/** The **insertion index** the row was dropped at (`0…rowCount`). See {@link HoveredObject.rowIndex}. */
		rowIndex: number;
		row: RowType;
	}
}
