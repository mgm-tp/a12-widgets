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

import { createContext, useContextSelector } from "../../context/index.js";

import type { BaseColumnType } from "./foundation/column.api.js";
import type { TableDragDropOptions } from "./foundation/table.api.js";
import type { DataTableRenderPropsType } from "./data-table-renderer.api.js";
import type { DataTableSortState } from "./data-table.sort.js";
import type { ResolvedDataTableSlots } from "./data-table-slots.api.js";

/**
 * Minimal handle attributes exposed by `useColumnResize`. Loose shape so the
 * context value can be assigned the hook output without an exact match.
 */
export interface DataTableResizeHandleProps {
	/** Pointer-down handler that initiates a drag-resize. */
	onPointerDown?: unknown;

	/** Key-down handler for keyboard-driven resize. */
	onKeyDown?: unknown;

	/** Tab order of the resize handle. */
	tabIndex?: number;

	/** ARIA role for the resize handle. */
	role?: string;
}

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
	 * Cumulative pixel offsets for sticky-pinned leaf cells, aligned by index
	 * with the resolved leaf columns. The orchestrator measures rendered leaf header widths
	 * with a `ResizeObserver` and exposes:
	 *
	 *  - `left[i]` — px from the table's inline-start edge for leaf `i` when it
	 *    is left-pinned. Equal to the sum of widths of all preceding left-pinned
	 *    leaves; `0` for the first left-pinned leaf and for non-pinned leaves.
	 *  - `right[i]` — px from the table's inline-end edge for leaf `i` when it
	 *    is right-pinned. Equal to the sum of widths of all following right-pinned
	 *    leaves; `0` for the last right-pinned leaf and for non-pinned leaves.
	 *
	 * Cell templates read this slice to drive
	 * `inset-inline-start` / `inset-inline-end` via the `--a12-data-table-pin-offset`
	 * custom property, so multi-column pinning (including pinning inherited from
	 * a column group) cascades correctly instead of stacking at a single edge.
	 */
	leafPinOffsets: { readonly left: readonly number[]; readonly right: readonly number[] };

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
	 * Per-leaf `headers` attribute value, aligned by index with the resolved leaf columns.
	 * Each entry is the space-separated list of header-cell `id`s that cover
	 * that leaf column — its group ancestors (upper header rows) followed by the
	 * leaf header (bottom row). Body cells apply this as their `headers`
	 * attribute to restore the header⇄cell association the CSS-Grid layout
	 * strips from the native `<table>` (see {@link DataTable}).
	 */
	leafHeaderIds?: readonly string[];

	/**
	 * Localized fallback label for an action column with no visible `label`.
	 * Resolved from `A11YLanguageContext.tableTitles.actionColumnDefaultLabel`.
	 * Optional so templates rendered outside a `<DataTable>` provider can
	 * fall back to their own `A11YLanguageContext` lookup.
	 */
	actionColumnFallbackLabel?: string;

	/** Whether the given leaf column is resizable. */
	isResizable?: (columnIndex: number) => boolean;

	/**
	 * DOM-level pointer/keyboard/role props for the given leaf column's resize
	 * handle, produced by the orchestrator's `useColumnResize` hook. The header
	 * cell renders the handle at its right edge when the column is resizable.
	 */
	resizeHandleProps?: (columnIndex: number) => HTMLAttributes<HTMLDivElement>;

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
	onRowFocusChange?: (rowIndex: number, row?: HTMLTableRowElement) => void;

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

	/** Current sort state (id-keyed, priority-ordered), if any. */
	sortState?: DataTableSortState;

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
	 * default DnD renderers (`DataTableDnDBodyRow`, `DataTableDnDDropTarget`) so they
	 * can be invoked through the renderer slots without prop-drilling.
	 */
	dragDropOptions?: TableDragDropOptions<RowType>;

	/**
	 * Snapshot of the drag currently in progress, tracked by the orchestrator's
	 * drag-and-drop monitor — `null`/`undefined` when nothing compatible is being
	 * dragged. The default drop targets read it to open while a compatible drag
	 * is active; the default drag preview reads the dragged item and its initial
	 * position from it.
	 */
	activeDrag?: DataTableRenderPropsType.ActiveDrag<RowType> | null;

	/**
	 * Number of body rows. Used by the default drop targets to recognise the
	 * table's top/bottom edge (`rowIndex === 0` / `rowIndex === rowCount`) so the
	 * edge drop indicators can be clamped inside the table's content box —
	 * otherwise their gap-centred band overflows the scroll viewport and makes a
	 * scrollbar flicker in/out during a drag.
	 */
	rowCount?: number;
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
	leafPinOffsets: { left: [], right: [] },
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
 * Selective-subscription hook for the {@link DataTableContext}: pass a selector
 * that picks the slice your template depends on, and the template re-renders
 * only when that slice changes (reference-equality on the selector result).
 *
 * Templates should treat the returned value as a fallback — a direct prop with
 * the same value wins. This keeps templates usable standalone and overridable.
 *
 * @experimental
 */
export function useDataTableContext<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>,
	Selector extends (context: DataTableContextType<RowType, ColumnType>) => any = (
		context: DataTableContextType<RowType, ColumnType>
	) => any
>(selector: Selector): ReturnType<Selector> {
	return useContextSelector(DataTableContext, selector);
}
