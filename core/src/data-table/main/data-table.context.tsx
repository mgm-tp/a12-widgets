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

import type { HTMLAttributes } from "react";
import { createContext, useContext } from "react";

import type { DataTableRenderPropsType } from "./data-table-renderer.api.js";
import type { ResolvedDataTableSlots } from "./data-table-slots.api.js";
import type { BaseColumnType } from "./foundation/column.api.js";
import type { TableDragDropOptions } from "./foundation/table.api.js";

/**
 * Shared per-render state exposed to every template inside a `<DataTable>`.
 * Templates read slices via {@link useDataTableContext} only as a fallback for
 * values not supplied via direct props — direct props always win.
 *
 * The shape is deliberately minimal: only inputs widely shared across many
 * templates / rows / cells (and therefore expensive to prop-drill) live here.
 *
 * @experimental
 */
export interface DataTableContextType<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
> {
	/** Whether the surrounding `<DataTable>` is disabled. */
	disabled?: boolean;

	/** Whether the surrounding `<DataTable>` is in card-view layout mode. */
	cardView?: boolean;

	/**
	 * When set, the surrounding `<DataTable>` renders with (tree)grid ARIA
	 * semantics: structural templates emit `role="row"` on rows, `"gridcell"` on
	 * body/footer cells, `"columnheader"` on header cells and `"rowgroup"` on the
	 * head/body/foot groups. `undefined` keeps the native `<table>` semantics.
	 */
	gridRole?: "grid" | "treegrid";

	/** Whether the surrounding `<DataTable>` has at least one vertical-header column. */
	crossTabulation?: boolean;

	/** Whether the surrounding `<DataTable>` has cell-highlighting enabled. */
	cellHighlighting?: boolean;

	/** Resolved header depth (1 for flat headers, >1 for grouped headers). */
	headerDepth: number;

	/**
	 * Whether the body is windowed (virtual scroll or infinite scroll). When
	 * `true`, only a slice of rows lives in the DOM, so the explicit
	 * `aria-rowindex` / `aria-rowcount` pair must be emitted; when `false` native
	 * `<table>` semantics convey position and those attributes are omitted.
	 */
	isVirtualizedMode?: boolean;

	/** Per-leaf pinning side, aligned by index with the resolved leaf columns. */
	leafPinning: readonly (("left" | "right") | undefined)[];

	/**
	 * 1-based `aria-rowindex` for the footer row — the last index in the grid.
	 * Set by the orchestrator only when {@link isVirtualizedMode} is `true` and a
	 * footer is shown, so the default footer renderer completes the explicit row
	 * numbering the body rows started. `undefined` in a fully-rendered table,
	 * where native `<table>` semantics convey position.
	 */
	footerAriaRowIndex?: number;

	/**
	 * Indices of the **edge** pinned leaf columns — the last left-pinned column
	 * and the first right-pinned column. Templates use these to render the
	 * pinned-region drop shadow on only the boundary cell, so N pinned columns
	 * produce a single visual shadow per side instead of N stacked ones.
	 *
	 *  - `left` — leaf index of the last left-pinned column, or `-1` when none.
	 *  - `right` — leaf index of the first right-pinned column, or `-1` when none.
	 *
	 * For group header cells that span columns, the edge match uses the cell's
	 * `leafTo` (left side) and `leafFrom` (right side).
	 */
	leafPinningEdge: { readonly left: number; readonly right: number };

	/**
	 * Localized screen-reader-only text a header cell renders for an action column
	 * whose definition supplies no `hiddenText`. Resolved from
	 * `A11YLanguageContext.tableTitles.actionTitle`. Optional so templates rendered
	 * outside a `<DataTable>` provider can fall back to their own lookup.
	 */
	actionColumnHiddenText?: string;

	/** Whether the given leaf column is resizable. */
	isResizable?: (columnIndex: number) => boolean;

	/**
	 * Total number of leaf columns. Lets a head cell tell whether it owns the
	 * last leaf column (`leafTo === leafColumnCount - 1`) so its resize handle can
	 * drop the boundary-straddling overhang that would otherwise poke past the
	 * table's right edge and force a permanent horizontal scrollbar.
	 */
	leafColumnCount?: number;

	/**
	 * DOM-level pointer/keyboard/role props for the given leaf column's resize
	 * handle, produced by the orchestrator's `useColumnResize` hook. The header
	 * cell renders the handle at its right edge when the column is resizable.
	 */
	resizeHandleProps?: (columnIndex: number) => HTMLAttributes<HTMLDivElement>;

	/**
	 * DOM-level pointer/keyboard/role props for a column group's resize handle.
	 * Resizes the group's whole leaf range `[leafFrom, leafTo]` proportionally
	 * (every leaf scales by the same factor, preserving the group's internal
	 * ratios). `groupColumn` / `groupLabel` are reported through the resize
	 * callbacks and used for the handle's accessible name.
	 */
	groupResizeHandleProps?: (
		leafFrom: number,
		leafTo: number,
		groupColumn: BaseColumnType<RowType>,
		groupLabel: string
	) => HTMLAttributes<HTMLDivElement>;

	/**
	 * Whether the given row is the currently focused arrow-navigation target.
	 * Identity-stable across renders — safe to use in render without
	 * invalidating memoization.
	 */
	isRowFocused?: (rowIndex: number) => boolean;

	/**
	 * Notify the orchestrator that the given row received focus. Pass the row
	 * element so the roving tabindex can move to it imperatively (without a
	 * table-wide re-render). Identity-stable across renders.
	 */
	onRowFocusChange?: (rowIndex: number, row?: HTMLElement) => void;

	/**
	 * Re-assert that some rendered body row carries the roving tab stop. Called by
	 * the windowed tbody after each commit — the focused row can scroll out of the
	 * rendered window and unmount, taking the only `tabIndex=0` with it.
	 * Identity-stable across renders.
	 */
	ensureRowTabStop?: () => void;

	/** Whether row arrow-key navigation is active. */
	arrowNavActive: boolean;

	/**
	 * Leaf indices whose right edge ends a column group (or is a top-level
	 * standalone leaf in a multi-row header). The default head-cell renderer
	 * paints the 2 px `"group"` divider on these leaves. Computed once per render
	 * by the orchestrator from the header grid.
	 */
	groupRightBoundaries?: ReadonlySet<number>;

	/**
	 * Leaf indices that sit inside a column group. The default head-cell renderer
	 * paints the 1 px `"single"` divider between sibling leaves in a group (for
	 * leaves not already covered by {@link groupRightBoundaries}).
	 */
	leavesInGroup?: ReadonlySet<number>;

	/**
	 * Per leaf column, the group that draws the resize handle on its right edge.
	 * Every other header cell ending on that edge draws none; `undefined` leaves it
	 * to the leaf itself.
	 *
	 * @internal
	 */
	resizeEdgeOwner?: (BaseColumnType<RowType> | undefined)[];

	/**
	 * The merged slot set: consumer {@link DataTableSlots} over
	 * {@link DataTableDefaultSlots}. Published so nested compositions — the
	 * windowed bodies, {@link DataTableRowsGroup}, custom container slots
	 * composing the `DataTable.*` primitives — resolve every slot exactly
	 * like the orchestrator does.
	 *
	 * Slot component identities are stable per `<DataTable>` instance, so
	 * reading a slot from context never forces a remount by itself.
	 */
	slots?: ResolvedDataTableSlots<RowType, ColumnType>;

	/**
	 * Sort handler. Templates only fire the callback (forwarding the activation event so the
	 * orchestrator can detect a multi-sort modifier) — the cycle, announcement and call into
	 * `sortOptions.onSort` stay in the orchestrator.
	 */
	onSort?: (column: ColumnType, event?: { shiftKey?: boolean }) => void;

	/**
	 * Request a header context menu open at the given position. The
	 * orchestrator owns the menu state; templates only request the open.
	 */
	openHeadContextMenu?: (args: {
		column: ColumnType;
		columnIndex: number;
		position: { top: number; left: number };
	}) => void;

	/**
	 * Drag-and-drop options forwarded from the orchestrator. Consumed by the
	 * default DnD renderer (`DataTableDnDBodyRow`) and the drag monitor so they
	 * can be invoked through the renderer slots without prop-drilling.
	 */
	dragDropOptions?: TableDragDropOptions<RowType>;

	/**
	 * Number of body rows. Exposed for renderers that need the row total (e.g. to
	 * recognise the table's top/bottom edge).
	 */
	rowCount?: number;

	/**
	 * Live registry of this table's mounted body rows, keyed by data row index.
	 * The default DnD body-row wrapper (`DataTableDnDBodyRow`) registers each row
	 * here on mount; the drag monitor's row-shift engine reads it to open the
	 * projected drop gap and to hit-test the pointer against the rows' logical
	 * rects. Absent when drag-and-drop is disabled.
	 */
	dndRowRegistry?: DataTableRenderPropsType.DndRowRegistry<RowType>;
}

/**
 * Default context value used when a template renders outside a `<DataTable>`:
 * an empty shape so standalone templates see "no shared state".
 *
 * @internal
 */
const DEFAULT_CONTEXT_VALUE: DataTableContextType<unknown, BaseColumnType<unknown>> = {
	headerDepth: 1,
	leafPinning: [],
	leafPinningEdge: { left: -1, right: -1 },
	arrowNavActive: false
};

/**
 * @internal
 * Read via {@link useDataTableContext} from templates; only {@link DataTable}
 * mounts the provider.
 */
export const DataTableContext = createContext<DataTableContextType<any, any>>(
	DEFAULT_CONTEXT_VALUE as DataTableContextType<any, any>
);

/**
 * Provider for {@link DataTableContext}. Only {@link DataTable} mounts it.
 *
 * @internal
 */
export const DataTableContextProvider = DataTableContext.Provider;

/**
 * Reader for the {@link DataTableContext}: returns the whole context value; pick
 * the slice your template needs off the result (`useDataTableContext().gridRole`).
 *
 * The context carries only *cold* shared state — layout/config/identity-stable
 * callbacks that change on structural events (columns, data, slots), never
 * mid-interaction (sort, drag and keyboard-focus state are routed around it). So a
 * plain {@link useContext} is sufficient: it needs no selective re-render guard, and
 * DataTable no longer depends on `useContextSelector`.
 *
 * This is a plain reader, **not** a slice subscription — there is no per-field
 * re-render bailout, so the context value must stay cold (a hot, per-interaction
 * value must never be added to it). A previous signature took a `(ctx) => slice`
 * selector; it read exactly like `use-context-selector`'s subscribing API but did
 * not subscribe, an invitation to expect a bailout that never came. It was removed.
 *
 * React context propagation walks *into* memoized subtrees to find consumers, so the
 * `DataTableBodyRow` memo boundary does not shield the cell templates: one changed
 * field here costs a re-render of every rendered cell. That is why the in-progress
 * drag (`activeDrag`) reaches the drag preview as a prop instead of living here — it
 * was the last per-gesture value in this object, and it made every drag start and end
 * a table-wide re-render to serve a single overlay. `data-table.render-cost.test.tsx`
 * guards the contract: every interaction must cost zero consumer re-renders.
 *
 * Templates should treat the returned value as a fallback — a direct prop with
 * the same value wins. This keeps templates usable standalone and overridable.
 *
 * @experimental
 */
export function useDataTableContext<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
>(): DataTableContextType<RowType, ColumnType> {
	return useContext(DataTableContext) as DataTableContextType<RowType, ColumnType>;
}
