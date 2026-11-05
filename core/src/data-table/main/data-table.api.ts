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
import type { FocusEvent, Ref, RefCallback } from "react";

import type { DOMProps, Identifiable, Styleable, DataRole } from "../../common/main/base-props.js";

import type { DataTableInfiniteScrollOptions } from "./data-table-infinite-scroll.api.js";
import type { DataTableRowExpansion, DataTableSlots } from "./data-table-slots.api.js";
import type { DataTableVirtualizerHandle } from "./data-table-virtualizer.api.js";
import type { DataTableSortOptions } from "./data-table.sort.js";
import type { BaseColumnType } from "./foundation/column.api.js";
import type { TableScrollToNodeHandler } from "./foundation/table-renderer.api.js";
import type {
	CellStyleGetter,
	ColumnResizeEventHandler,
	RowEventHandlerGetter,
	RowKeyGetter,
	RowStyleGetter,
	TableDragDropOptions
} from "./foundation/table.api.js";

export type {
	CellStyleGetter as DataTableCellStyleGetter,
	CellStyles as DataTableCellStyles,
	RowStyles as DataTableRowStyles,
	RowStyleGetter as DataTableRowStyleGetter,
	TableDragDropOptions as DataTableDragDropOptions
} from "./foundation/table.api.js";

// The consumer-facing name for the handler `DataTableProps.scrollToNode` registers —
// without this alias the type is referenced by the props docs but not importable.
export type { TableScrollToNodeHandler as DataTableScrollToNodeHandler } from "./foundation/table-renderer.api.js";

export type {
	DataTableSortOptions,
	DataTableSortState,
	DataTableColumnSort,
	DataTableSortOrder
} from "./data-table.sort.js";

export type { DataTableRowLoadingStatus, DataTableInfiniteScrollOptions } from "./data-table-infinite-scroll.api.js";

export type {
	DataTableVirtualizerHandle,
	DataTableVirtualizerScrollAlign,
	DataTableVirtualizerScrollToOptions
} from "./data-table-virtualizer.api.js";

export type DataTableRowKeyGetter<RowType> = RowKeyGetter<RowType>;

/**
 * Options for DataTable virtualization mode. When provided, only the rows in the visible
 * scroll viewport (plus an overscan buffer) are rendered.
 *
 * To scroll programmatically, use the table-level {@link DataTableProps#scrollToNode} prop
 * or a {@link virtualizerRef} handle.
 */
export interface DataTableVirtualScrollOptions {
	/**
	 * Fixed height of each row, in CSS pixels.
	 *
	 * Omit for dynamic row heights: each rendered row is then measured from the DOM (and
	 * re-measured on content-driven resize), with {@link estimatedRowHeight} as the
	 * placeholder for rows not yet measured. Prefer a fixed `rowHeight` when rows are
	 * uniform — it skips per-row measurement entirely.
	 */
	rowHeight?: number;

	/**
	 * Estimated height of a not-yet-measured row in dynamic-height mode, in CSS pixels.
	 * Used to size the scrollbar and spacer rows until real measurements arrive; closer
	 * estimates mean less scrollbar jitter. Ignored when {@link rowHeight} is set.
	 *
	 * @default 50
	 */
	estimatedRowHeight?: number;

	/**
	 * Number of rows to render above and below the visible viewport as a buffer.
	 * Larger values produce smoother scrolling at the cost of more rendered DOM.
	 *
	 * @default 10
	 */
	overscan?: number;

	/**
	 * Alias for {@link overscan}, matching the react-virtualized prop name accepted by the
	 * production Table. Ignored when {@link overscan} is also set.
	 *
	 * @deprecated Use {@link overscan} instead.
	 */
	overscanRowCount?: number;

	/**
	 * Receives an imperative {@link DataTableVirtualizerHandle} for programmatic scrolling
	 * and re-measurement (`null` on unmount).
	 */
	virtualizerRef?: Ref<DataTableVirtualizerHandle | null>;
}

/**
 * How a column is positioned in the viewport by
 * {@link DataTableHorizontalScrollHandle#scrollToColumn}.
 *
 * - `"auto"` — scroll only as far as needed to bring the column fully into view.
 * - `"start"` / `"end"` — align the column's leading / trailing edge to the viewport.
 * - `"center"` — centre the column in the unobscured band.
 */
export type DataTableHorizontalScrollAlign = "auto" | "start" | "center" | "end";

/** Options for the {@link DataTableHorizontalScrollHandle} methods. */
export interface DataTableHorizontalScrollToOptions {
	/** Where the target lands in the viewport. @default "auto" */
	align?: DataTableHorizontalScrollAlign;

	/** Scroll animation, as per `Element.scrollTo`. Defaults to an instant jump. */
	behavior?: ScrollBehavior;
}

/**
 * Imperative control over the table's **horizontal** scroll position, the counterpart to
 * {@link DataTableVirtualizerHandle}'s vertical `scrollToIndex` / `scrollToOffset`.
 *
 * Unlike the virtualizer handle this works in every mode, virtualized or not, because the
 * horizontal axis is the scroll viewport itself. Pinned columns are accounted for: a column
 * is never left sitting behind a sticky pinned neighbour.
 *
 * @experimental
 */
export interface DataTableHorizontalScrollHandle {
	/**
	 * Scrolls horizontally until the column with this `id` is visible clear of any pinned
	 * columns. No-op for an unknown id, a pinned column (always visible), or a column group —
	 * only leaf columns are addressable.
	 */
	scrollToColumn(columnId: string, options?: DataTableHorizontalScrollToOptions): void;

	/** Scrolls to an absolute horizontal offset, in CSS pixels, clamped to the scrollable range. */
	scrollToOffset(offsetPx: number, options?: Pick<DataTableHorizontalScrollToOptions, "behavior">): void;

	/**
	 * Current horizontal geometry of the viewport, for deriving an offset of your own — e.g.
	 * mapping a date to a pixel position on a timeline before calling {@link scrollToOffset}.
	 */
	getScrollState(): { scrollLeft: number; scrollWidth: number; clientWidth: number };
}

/**
 * Callback invoked during column resize lifecycle events. Same shape as the production
 * Table's {@link ColumnResizeEventHandler}, so handlers written for it are directly
 * assignable.
 *
 * - `event` — the originating `PointerEvent` of a drag gesture, or the `KeyboardEvent` of
 *   a keyboard-driven resize step.
 * - `data` — a `DraggableData`-shaped snapshot of the pointer position: `x`/`y` are the
 *   cursor's client coordinates, `lastX`/`lastY` the previous callback's, `deltaX`/`deltaY`
 *   the difference, `node` the resize-handle element. Keyboard steps report the step delta
 *   in `deltaX`.
 */
export type DataTableColumnResizeEventHandler<ColumnType> = ColumnResizeEventHandler<ColumnType>;

/**
 * Options for column resize behavior. When provided, every leaf header cell displays a
 * resize handle at its right edge — including `fixedWidth` columns (resized to a
 * different fixed track) and action columns (a manual width then pins them against
 * auto-size).
 */
export interface DataTableColumnResizingOptions<ColumnType> {
	/** Fires when the user begins a resize drag. */
	onBeginResize?: DataTableColumnResizeEventHandler<ColumnType>;

	/** Fires during a resize drag on each pointer move. */
	onResize?: DataTableColumnResizeEventHandler<ColumnType>;

	/** Fires when the user finishes a resize drag. */
	onEndResize?: DataTableColumnResizeEventHandler<ColumnType>;
}

/**
 * Props shared by both {@link DataTable} modes (see {@link DataTableProps}).
 *
 * The `ColumnType` parameter preserves a consumer-extended column type (extra fields on
 * {@link BaseColumnType}) through `sortOptions`, `cellStyling`, `columnResizingOptions`
 * and `slots`.
 *
 * @experimental Not all features of {@link Table} are available. See migration notes for the supported subset.
 */
export interface BaseDataTableProps<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
>
	extends Identifiable, Styleable, DataRole, DOMProps<HTMLTableElement> {
	/**
	 * Data rows to display. Defaults to an empty table when omitted — useful while data is
	 * still loading.
	 */
	data?: RowType[];

	/**
	 * Column definitions. Same shape as {@link BaseColumnType} for the production Table.
	 *
	 * `minResizeWidth` bounds the width reported once a resize settles; during an in-progress
	 * drag a hard floor of 30px applies regardless.
	 *
	 * A width-less `actionColumn` auto-sizes to fit its content (buttons + header), matching the
	 * production Table. Set an explicit `width` / `fixedWidth`, or {@link actionColumnAutoSize}
	 * `false`, to opt out (the column then falls back to a fixed `150px` track).
	 */
	columns: ColumnType[];

	/**
	 * Sort options. State is keyed by stable column id (see {@link DataTableSortOptions}), so it
	 * survives column re-cloning (e.g. `DataTreeTable`) and supports multi-column sort.
	 */
	sortOptions?: DataTableSortOptions;

	/**
	 * Stable row key: either a property name on the row, or a function returning a key. If
	 * omitted, the row index is used (which may cause unnecessary remounts on reorder).
	 *
	 * When passing the function form, pass a stable reference (`useCallback`, or a module-scope
	 * function), not an inline arrow: unlike {@link rowStyling}, this getter's *identity* is part
	 * of the boundary that lets untouched rows skip re-rendering, so an unstable one re-renders
	 * every body row on every parent render.
	 */
	rowKey?: keyof RowType | (string & {}) | number | DataTableRowKeyGetter<RowType>;

	/**
	 * Per-row event handler getter. Same shape as {@link RowEventHandlerGetter} on the production Table.
	 *
	 * The identity does not need to be stable, and the handlers may close over changing state:
	 * the getter is re-read when an event fires, not captured when the row rendered, so a row
	 * that skipped a re-render still calls the newest handler. Only *whether* a row has an
	 * `onClick` participates in the row's re-render decision.
	 */
	rowEventHandlers?: RowEventHandlerGetter<RowType>;

	/**
	 * Per-row style getter. Same shape as {@link RowStyleGetter} on the production Table.
	 * Currently honored: `selected`, `interactive`, `disabled`, `highlighted`, `highlightVariant`, `title`, `className`, `style`.
	 *
	 * Invoked once per *rendered* row per render (so windowed modes only pay for the visible
	 * window), and the returned object is consumed directly — returning a fresh object each
	 * call is fine and costs nothing.
	 *
	 * The function identity does **not** need to be stable: the values it returns are compared
	 * per row, so an inline arrow deriving `selected` from component state re-renders only the
	 * rows whose state actually changed, not the whole body. That is deliberate — a getter
	 * driven by selection cannot have a stable identity even with `useCallback`, since the
	 * selection is necessarily in its dependency list.
	 *
	 * What it does need to be is **cheap**. It runs once per visible row on every render, so
	 * avoid scanning the data set inside it (`selectedIds.find(...)` over a large array turns
	 * one render into O(rows²)); prefer a `Set`/`Map` lookup built outside the getter.
	 */
	rowStyling?: RowStyleGetter<RowType>;

	/**
	 * When true, hovering or focusing a body cell highlights the corresponding column header
	 * (and, for grouped columns, the ancestor group header).
	 */
	cellHighlighting?: boolean;

	/**
	 * When true, the rows render as a vertical stack of "cards": a `role="list"` whose
	 * `listitem` cards each stack their columns as label/value fields. No header is
	 * rendered — every card labels its own fields instead.
	 *
	 * This is a *separate layout*, not a restyled table: no `<table>`, `<thead>`,
	 * `<tbody>` or `<colgroup>` is emitted at all, and the structural slots resolve to
	 * card primitives (see `DataTableCardViewSlots`). What carries over unchanged is
	 * everything above the DOM — columns, sorting, `rowStyling` / `cellStyling`,
	 * selection, row events, expansion, the context menu, virtualization and infinite
	 * scroll, drag and drop, and row-level arrow-key navigation.
	 *
	 * What a card list has no equivalent for, and which is therefore inert here:
	 *
	 *  - {@link cellHighlighting} — forced off (it highlights a column header).
	 *  - {@link gridRole} — ignored; the list semantics apply instead.
	 *  - {@link rowHeight} — ignored; cards must grow to their stacked content.
	 *  - {@link hideHeader}, `filterRow` and the `head*` slots — no header is drawn.
	 *  - {@link hasFootContent}, `renderFooter` and the `foot*` slots — no footer is drawn
	 *    either, matching the production {@link Table}: a summary row only reads as one
	 *    against aligned columns. Both are honoured again as soon as `cardView` is off.
	 *  - `column.pinning` and `columnResizingOptions` — there is no column axis.
	 *  - `column.verticalHeader` (cross-tabulation) — such columns render as plain fields.
	 *
	 * A consumer `slots` override still applies, but must be card-shaped: a `cell` slot
	 * rendering a `<td>` belongs to the table layout only.
	 */
	cardView?: boolean;

	/**
	 * When true, disables row-level arrow-key navigation. By default `ArrowUp` / `ArrowDown`
	 * move focus between body rows (roving tabindex, clamped at the first / last row, no wrap);
	 * `ArrowLeft` / `ArrowRight` are intentionally inert, leaving native horizontal scrolling
	 * intact.
	 *
	 * Suppressed when {@link disabled} is true.
	 */
	disableArrowNavigation?: boolean;

	/**
	 * Disables all event handlers and applies a disabled visual state.
	 */
	disabled?: boolean;

	/**
	 * Callback ref to the underlying `<table>` element, called with the element on attach and
	 * `null` on detach. Object refs are not supported.
	 *
	 * Unlike the production {@link Table} (which exposes its root `<div>`), this targets the
	 * `<table>` element itself, not the optional viewport `<div>` that wraps it when
	 * {@link maxHeight} is set; query the viewport via `table.parentElement` if needed.
	 *
	 * In {@link cardView} there is no `<table>`: the callback receives the card layout's
	 * root `<div>` instead — the element carrying `data-card-view="true"`. The type stays
	 * `HTMLTableElement` so existing callbacks keep compiling.
	 */
	ref?: RefCallback<HTMLTableElement>;

	/**
	 * Invoked when focus leaves the table. Useful for validating the table's data when the user
	 * tabs out; inspect `event.relatedTarget` to check whether the new focus target is still
	 * inside the table.
	 */
	onBlur?(event: FocusEvent<HTMLTableElement>): void;

	/**
	 * Accessible label for the table. Maps to `aria-label` on the `<table>` element.
	 */
	ariaLabel?: string;

	/**
	 * `aria-labelledby` attribute for the `<table>` element.
	 */
	ariaLabelledby?: string;

	/**
	 * `aria-hidden` attribute for the `<table>` element.
	 */
	ariaHidden?: boolean;

	/**
	 * Overrides the table's ARIA role to a (tree)grid and switches the structural elements to
	 * grid semantics: rows expose `role="row"`, body/footer cells `role="gridcell"`, header cells
	 * `role="columnheader"`, and the head/body/foot groups `role="rowgroup"`. Use `"treegrid"`
	 * for hierarchical data (drives {@link DataTreeTable}) and `"grid"` for flat interactive grids.
	 *
	 * When omitted, native `<table>` semantics apply (or `role="list"` in {@link cardView}).
	 * Ignored in card view.
	 *
	 * @experimental
	 */
	gridRole?: "grid" | "treegrid";

	/**
	 * Maximum height of the scroll viewport. When set, vertical overflow scrolls inside the
	 * viewport while the header remains sticky. If omitted, the viewport defaults to
	 * `max-height: 100%` — fitting and scrolling within a bounded parent, or growing to its
	 * natural height within an unbounded one.
	 */
	maxHeight?: number | string;

	/**
	 * Fixes every body row to this height, in CSS pixels, overriding the theme's
	 * `table.bodyCell.minHeight`. Omit to let rows size to their content.
	 *
	 * Rows become exactly this tall rather than merely at least this tall: content that would
	 * otherwise wrap onto a second line is clipped instead of growing its row. That is the
	 * point — a `height` declared in CSS is only a *minimum* in table layout, so one wrapping
	 * cell silently makes its row taller than the rest and misaligns anything a consumer
	 * positions per row (overlays, connectors, rulers).
	 *
	 * A `rowStyling` `style.height` overrides this for the rows it targets, so per-row heights
	 * remain possible; either route is clamped the same way.
	 *
	 * When virtualizing, this also supplies the virtualizer's fixed row height unless
	 * {@link DataTableVirtualScrollOptions#rowHeight} sets one explicitly — keeping the
	 * measured layout and the virtualizer's offset arithmetic in agreement.
	 *
	 * Has no effect in {@link cardView}, where cells stack and must grow.
	 */
	rowHeight?: number;

	/**
	 * Receives an imperative {@link DataTableHorizontalScrollHandle} for programmatic horizontal
	 * scrolling (`null` on unmount) — "scroll to this column", or to a pixel offset you derive
	 * yourself. Works in every mode; {@link DataTableVirtualScrollOptions#virtualizerRef} covers
	 * the vertical axis and only when virtualized.
	 *
	 * @experimental
	 */
	horizontalScrollRef?: Ref<DataTableHorizontalScrollHandle | null>;

	/**
	 * Customization slots for DataTable's structural elements (head/body/foot, rows, cells,
	 * content). See {@link DataTableSlots}.
	 *
	 * Each slot is a component receiving fully resolved props; container slots receive the
	 * pre-built subtree as `children`. Slot component identities must be stable across renders
	 * (declare them at module scope or memoize) — inline arrow components force a remount of the
	 * slot's subtree on every render.
	 *
	 * The *map* itself should be stable too: an inline `slots={{ ... }}` object is a new
	 * reference every render, which re-renders every body row on every parent render regardless
	 * of what changed. Hoist it to module scope or wrap it in `useMemo`.
	 */
	slots?: DataTableSlots<RowType, ColumnType>;

	/**
	 * Row-expansion configuration: renders additional content below body rows and drives the rows'
	 * `aria-expanded` state. See {@link DataTableRowExpansion}. Replaces the production Table's
	 * `additionalContentRenderer`.
	 */
	rowExpansion?: DataTableRowExpansion<RowType, ColumnType>;

	/**
	 * Hides the `<thead>` (header rows and filter row) entirely. ARIA row numbering excludes the
	 * hidden header.
	 *
	 * @default false
	 */
	hideHeader?: boolean;

	/**
	 * Per-cell style getter. Same shape as {@link CellStyleGetter} on the production Table.
	 * Returns `useSecondaryColor`, `secondaryCellTitle`, `className` and `style`. Not invoked
	 * when {@link disabled} is true.
	 *
	 * Pass a stable reference (`useCallback`, or a module-scope function), not an inline arrow.
	 * Unlike {@link rowStyling}, cell styles are resolved inside each row rather than compared
	 * per row, so this getter's identity is a coarse signal: changing it re-renders every body
	 * row. If your cell styling depends on state that changes during interaction, drive it from
	 * `rowStyling` or the `cellContent` slot instead.
	 */
	cellStyling?: CellStyleGetter<RowType, ColumnType>;

	/**
	 * Programmatic scroll-to-row handle. Receives a callback that scrolls a row (by index) into
	 * view (centered within the viewport) and optionally focuses it.
	 *
	 * @example
	 * ```tsx
	 * const scrollHandlerRef = useRef<DataTableScrollToNodeHandler>();
	 *
	 * <DataTable
	 *   data={rows}
	 *   columns={columns}
	 *   scrollToNode={(handler) => { scrollHandlerRef.current = handler; }}
	 * />
	 *
	 * // Later:
	 * scrollHandlerRef.current?.(42, { autoFocus: true });
	 * ```
	 */
	scrollToNode?(handler: TableScrollToNodeHandler): void;

	/**
	 * Event handlers for resizing columns. When provided, every leaf header cell displays
	 * a drag handle at its right edge — including `fixedWidth` and action columns — also
	 * keyboard-accessible (`ArrowLeft`/`ArrowRight` adjust width, `Escape` cancels).
	 */
	columnResizingOptions?: DataTableColumnResizingOptions<ColumnType>;

	/**
	 * Whether width-less `actionColumn`s auto-size to fit their content (their buttons and, if
	 * present, a labelled header) instead of taking a flat `150px` track — restoring the
	 * production {@link Table}'s action-column sizing.
	 *
	 * Only width-less, non-`fixedWidth` action columns are measured; an explicit `width` /
	 * `fixedWidth` always wins. Set `false` to opt every action column out globally. A column
	 * the user manually resizes is left at its dragged width.
	 *
	 * @default true
	 */
	actionColumnAutoSize?: boolean;

	/**
	 * Event handlers for DnD behavior. When provided, body rows become drag sources and drop
	 * targets; no provider or other setup is required in the consumer's component tree. Two
	 * DataTables configured with the same {@link TableDragDropOptions#acceptType} accept each
	 * other's rows. Combinable with {@link virtualScrollOptions} (dragging near the viewport's
	 * top/bottom edge auto-scrolls to reveal off-window rows).
	 *
	 * Same shape as the production {@link TableDragDropOptions}.
	 */
	dragDropOptions?: TableDragDropOptions<RowType>;

	/**
	 * Set to `true` to render a `<tfoot>` element even when no `foot*` slot is provided. The
	 * footer is also rendered automatically whenever any `foot*` slot is present in {@link slots}
	 * or any column provides `renderFooter`.
	 */
	hasFootContent?: boolean;

	/**
	 * Enable virtualized rendering of body rows: only the rows visible in the scroll viewport
	 * (plus an overscan buffer) are committed to the DOM.
	 *
	 * Requires {@link maxHeight}. Mutually exclusive with {@link infiniteScrollOptions} (the
	 * latter wins). Not combinable with row groups (enabling virtualization silently disables
	 * grouping). Expandable rows (`rowExpansion`) render only with dynamic row heights (omit
	 * `rowHeight`); a fixed `rowHeight` silently suppresses the expansion panels. Drag-and-drop
	 * (`dragDropOptions`) and column resize are supported in virtualized mode.
	 *
	 * `true` is shorthand for `{}` (virtualized with dynamic row heights). Pass
	 * {@link DataTableVirtualScrollOptions} for a fixed `rowHeight` or other options.
	 */
	virtualScrollOptions?: true | DataTableVirtualScrollOptions;

	/**
	 * Enable infinite-scroll rendering: loads rows incrementally via
	 * {@link DataTableInfiniteScrollOptions#loadData} as the user scrolls toward unloaded rows.
	 *
	 * Requires {@link maxHeight}. When provided, overrides {@link virtualScrollOptions}. Rows
	 * whose {@link DataTableInfiniteScrollOptions#rowLoadingStatus} is not `"loaded"` are
	 * rendered via `slots.placeholderRow` (or a default placeholder if the slot is not provided).
	 */
	infiniteScrollOptions?: DataTableInfiniteScrollOptions;
}

/**
 * {@link DataTable} props in infinite-scroll mode: same surface as {@link BaseDataTableProps},
 * except `data` may be sparse (unloaded indices hold `undefined` and render as placeholder rows)
 * and `infiniteScrollOptions` is required.
 *
 * @experimental
 */
export interface InfiniteScrollDataTableProps<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
> extends Omit<BaseDataTableProps<RowType, ColumnType>, "data"> {
	/**
	 * Data rows to display. May be sparse: indices whose
	 * {@link DataTableInfiniteScrollOptions#rowLoadingStatus} is not `"loaded"` may hold
	 * `undefined` and render as placeholder rows.
	 */
	data?: (RowType | undefined)[];

	/**
	 * Enable infinite-scroll rendering. See {@link BaseDataTableProps#infiniteScrollOptions}.
	 */
	infiniteScrollOptions: DataTableInfiniteScrollOptions;
}

/**
 * Props for the experimental DataTable component — either the base mode or the
 * infinite-scroll mode (which allows sparse `data`).
 *
 * @experimental Not all features of {@link Table} are available. See migration notes for the supported subset.
 */
export type DataTableProps<RowType = unknown, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>> =
	| BaseDataTableProps<RowType, ColumnType>
	| InfiniteScrollDataTableProps<RowType, ColumnType>;
