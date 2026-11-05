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

import type { CSSProperties, HTMLAttributes as ReactHTMLAttributes, Key, MouseEvent, ReactNode } from "react";
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";

import { buildHeaderGrid, getColumnRender, type DataTableHeaderCell } from "./columns.js";
import type { DataTableRenderPropsType } from "./data-table-renderer.api.js";
import type { DataTableSlots } from "./data-table-slots.api.js";
import type { DataTableProps, DataTableVirtualScrollOptions } from "./data-table.api.js";
import { useAutoSizeActionColumns } from "./data-table.auto-size.js";
import { useCellHighlighting } from "./data-table.cell-highlighting.js";
import type { DataTableContextType } from "./data-table.context.js";
import { useFilterRowHeadHeight } from "./data-table.head-height.js";
import { useHeaderFocusScroll } from "./data-table.header-focus-scroll.js";
import { useLeafPinOffsetCssVars } from "./data-table.pin-offsets.js";
import { useColumnResize } from "./data-table.resize.js";
import { useRowTabStopFallback } from "./data-table.row-tab-stop.js";
import { useScrollToNode } from "./data-table.scroll-to-node.js";
import type { DataTableSortState } from "./data-table.sort.js";
import { assertSortableColumnIds, getColumnId, getNextSortState } from "./data-table.sort.js";
import { getColumnWidths, getMinTableWidthExpression, rowKeyFor } from "./data-table.utils.js";
import { useDataTableKeyboardReorder } from "./dnd/index.js";
import type { BaseColumnType } from "./foundation/column.api.js";
import { useRowArrowNavigation } from "./keyboard.js";

/**
 * Context-menu request state owned by the model: at most one menu (body or
 * head) is open at a time.
 *
 * @internal
 */
export type DataTableContextMenuState<RowType> =
	| {
			type: "body";
			position: { top: number; left: number };
			row: RowType;
			rowIndex: number;
	  }
	| {
			type: "head";
			position: { top: number; left: number };
			column: BaseColumnType<RowType>;
			columnIndex: number;
	  }
	| null;

/**
 * Fully resolved per-row state: everything `rowStyling` / `rowEventHandlers` /
 * the table-level `disabled` flag contribute to a body row, computed once per
 * row so cell-level code never re-invokes the consumer getters.
 *
 * Deliberately **value-only** — every field is a primitive except `styles`,
 * which is `undefined` unless the consumer actually returned a
 * `className` / `style` / `title`. That is what lets the memoized body row
 * compare its state with React's default shallow compare and re-render only
 * the rows that really changed: a `rowStyling` getter derived from selection
 * necessarily changes identity when selection moves, so comparing the getter
 * (or anything holding it) can only ever mean "re-render every row".
 *
 * The consumer's handlers are therefore reduced to the booleans
 * {@link hasRowClick} / {@link hasRowContextMenu}; the calls themselves go
 * through the model's stable `dispatchRowClick` / `dispatchRowContextMenu`,
 * which read the newest `rowEventHandlers` from a ref. Comparing by value
 * while holding a captured closure would silently freeze handlers on rows that
 * skip a render.
 *
 * @internal
 */
export interface DataTableRowState {
	styles?: DataTableRenderPropsType.RowStyleResult;
	rowDisabled: boolean;
	highlightVariant?: "success" | "info";
	selected: boolean;
	highlighted: boolean;
	interactive: boolean;

	/** Whether `rowEventHandlers` supplied an `onClick` for this row. */
	hasRowClick: boolean;

	/** Whether a right-click on this row should open the body context menu. */
	hasRowContextMenu: boolean;
}

/**
 * Inputs the model needs from the view layer: which opt-in structures the
 * consumer activated (passed as plain booleans/probes so the model has no
 * dependency on the slot components themselves) and the sink for the sort
 * live-region text.
 *
 * @internal
 */
export interface DataTableModelSlotInfo {
	hasConsumerSlot: (slot: keyof DataTableSlots<any, any>) => boolean;
	hasContextMenu: boolean;

	/**
	 * Sink for the localized sort live-region announcement. The text is held by a
	 * ref-driven live-region component in the view, so announcing a sort result
	 * re-renders only that span — not the model or the whole table body.
	 */
	announceSort: (message: string) => void;
}

/**
 * The model's contribution to the shared {@link DataTableContext} — the slice of the
 * slot-facing contract it owns.
 *
 * `slots` and `dragDropOptions` are excluded because the view supplies them: the model
 * is deliberately unaware of the slot components (it sees only the probes on
 * {@link DataTableModelSlotInfo}), and the drag options reach the context through a
 * stable-identity Proxy the view maintains.
 *
 * @internal
 */
export type DataTableModelContextFields<RowType> = Omit<DataTableContextType<RowType>, "slots" | "dragDropOptions">;

/**
 * The state-and-behavior facade behind one `<DataTable>`: derived layout (header grid,
 * pinning, column widths), interaction state (sorting, resizing, keyboard navigation,
 * context menus, drag), per-row state resolution, aria numbering, and the element refs
 * the imperative hot paths write through. No element production.
 *
 * Not purely state — it also carries event dispatchers, ref setters and the return
 * values of the sub-hooks it composes, because its job is to be the single seam between
 * `<DataTable>`'s state and its rendering.
 *
 * The fields split by audience: {@link contextFields} is what reaches slot authors
 * through {@link DataTableContext}, everything beside it is view-internal plumbing. New
 * fields belong on one side or the other — that choice is the reason the two are
 * separated rather than flattened.
 *
 * @internal
 */
export interface DataTableModel<RowType> {
	/** Published to slot authors via {@link DataTableContext}; memoized, stable while its inputs are. */
	contextFields: DataTableModelContextFields<RowType>;

	data: (RowType | undefined)[];
	leafColumns: BaseColumnType<RowType>[];
	cellsByRow: DataTableHeaderCell<RowType>[][];
	headerDepth: number;

	crossTabulation: boolean;
	leafPinning: (("left" | "right") | undefined)[];
	colWidths: string[];

	/** The table's `min-width` as a CSS length. See `getMinTableWidthExpression`. */
	minTableWidth: string | undefined;

	isInfiniteScrollMode: boolean;
	isVirtualizedMode: boolean;
	resolvedVirtualScrollOptions: DataTableVirtualScrollOptions | undefined;

	emptyStateLabel: string;

	sortState: DataTableSortState | undefined;

	hideHeader: boolean;
	hasFilterRow: boolean;
	showFooter: boolean;

	hasExpansion: boolean;
	resolveExpansion: (row: RowType, rowIndex: number) => ReactNode;

	contextMenuState: DataTableContextMenuState<RowType>;
	closeContextMenu: () => void;

	tableRef: { current: HTMLTableElement | null };

	/**
	 * Attach to the layout root: the `<table>` in the table layout, the card root
	 * `<div>` in card view. Widened to `HTMLElement` for that reason — see the setter
	 * for which hooks that affects.
	 */
	setTableRef: (node: HTMLElement | null) => void;
	viewportRef: { current: HTMLDivElement | null };

	/** The live scroll-container element, as state — drives the DnD auto-scroll effect. */
	viewportEl: HTMLDivElement | null;
	setViewportRef: (node: HTMLDivElement | null) => void;
	rowRefs: { current: (HTMLElement | null)[] };
	getRowElement: (rowIndex: number) => HTMLElement | null;
	rowKeyForIndex: (rowIndex: number) => Key;

	enableDragDrop: boolean;
	activeDrag: DataTableRenderPropsType.ActiveDrag<RowType> | null;
	setActiveDrag: (drag: DataTableRenderPropsType.ActiveDrag<RowType> | null) => void;
	dndRowRegistry: DataTableRenderPropsType.DndRowRegistry<RowType>;

	ariaRowCount: number;
	bodyAriaRowIndex: (rowIndex: number) => number;

	resolveRowState: (row: RowType, rowIndex: number) => DataTableRowState;

	/**
	 * Invokes the consumer's row `onClick` for one row. Stable, so it can be held
	 * by a memoized row without pinning that row to one `rowEventHandlers` identity.
	 */
	dispatchRowClick: (row: RowType, rowIndex: number, event: MouseEvent<HTMLElement>) => void;

	/** Opens the body context menu at the pointer. Stable, like {@link dispatchRowClick}. */
	dispatchRowContextMenu: (row: RowType, rowIndex: number, event: MouseEvent<HTMLElement>) => void;
}

/**
 * Build the {@link DataTableModel} for one `<DataTable>` instance.
 *
 * @internal
 */
export function useDataTableModel<RowType>(
	props: DataTableProps<RowType>,
	slotInfo: DataTableModelSlotInfo
): DataTableModel<RowType> {
	const {
		data = [],
		columns,
		sortOptions,
		rowKey,
		rowEventHandlers,
		rowStyling,
		cellHighlighting,
		cardView,
		gridRole,
		disableArrowNavigation,
		disabled,
		hasFootContent,
		hideHeader = false,
		rowExpansion,
		scrollToNode,
		actionColumnAutoSize = true,
		columnResizingOptions,
		dragDropOptions,
		virtualScrollOptions,
		infiniteScrollOptions,
		ref
	} = props;

	// Back-compat: `virtualScrollOptions: true` maps to `{}` (dynamic-height
	// virtualization), matching the old engine's measured-rows default.
	const resolvedVirtualScrollOptions = virtualScrollOptions === true ? {} : virtualScrollOptions;

	const isInfiniteScrollMode = !!infiniteScrollOptions;
	const isVirtualizedMode = isInfiniteScrollMode || !!resolvedVirtualScrollOptions;

	const { tableTitles } = useContext(A11YLanguageContext);
	const emptyStateLabel = tableTitles?.emptyStateLabel ?? "No data";
	const sortAscendingMessage = tableTitles?.sortAscendingAnnouncement ?? "Sorted ascending";
	const sortDescendingMessage = tableTitles?.sortDescendingAnnouncement ?? "Sorted descending";
	const sortClearedMessage = tableTitles?.sortClearedAnnouncement ?? "Sort cleared";
	const actionColumnHiddenText = tableTitles?.actionTitle;

	const { announceSort } = slotInfo;
	const [activeDrag, setActiveDrag] = useState<DataTableRenderPropsType.ActiveDrag<RowType> | null>(null);
	const enableDragDrop = !!dragDropOptions;
	// Live registry of mounted body rows (index → { row, element }), shared with the
	// DnD body rows (which populate it) and the drag monitor's row-shift engine
	// (which iterates it). A stable ref-held Map so registration never triggers a render.
	const dndRowRegistryRef = useRef<DataTableRenderPropsType.DndRowRegistry<RowType>>(undefined);

	if (!dndRowRegistryRef.current) {
		dndRowRegistryRef.current = new Map();
	}

	const dndRowRegistry = dndRowRegistryRef.current;

	const crossTabulation = useMemo(() => columns.some((col) => col.verticalHeader), [columns]);
	const effectiveColumns = useMemo<BaseColumnType<RowType>[]>(
		() =>
			crossTabulation
				? columns.map((col) =>
						col.verticalHeader || col.pinning === "left" ? { ...col, pinning: "left" as const } : col
					)
				: columns,
		[columns, crossTabulation]
	);

	const headerGrid = useMemo(() => buildHeaderGrid(effectiveColumns), [effectiveColumns]);
	const leafColumns = headerGrid.leafColumns;
	const headerDepth = headerGrid.maxDepth;

	// Fail fast on a misconfigured sortable column (missing or duplicate stable id) — sort state is
	// keyed by id, so an unresolvable id would silently break the sort indicator. See getColumnId.
	useMemo(() => assertSortableColumnIds(leafColumns), [leafColumns]);
	const effectiveHeaderDepth = hideHeader ? 0 : headerDepth;

	const leafPinning = useMemo<(("left" | "right") | undefined)[]>(() => {
		const result: (("left" | "right") | undefined)[] = new Array(leafColumns.length);

		for (const cell of headerGrid.cells) {
			if (cell.isLeaf) {
				result[cell.leafFrom] = cell.pinning;
			}
		}

		return result;
	}, [headerGrid.cells, leafColumns.length]);

	const { groupRightBoundaries, leavesInGroup, resizeEdgeOwner } = useMemo(() => {
		const boundaries = new Set<number>();
		const inGroup = new Set<number>();
		// The column itself, not its leaf range: an outer group and its only child
		// share the range, so only the header row separates them.
		const owners: (BaseColumnType<RowType> | undefined)[] = new Array(leafColumns.length);
		const ownerRows: (number | undefined)[] = new Array(leafColumns.length);
		const multiRowHeader = headerGrid.maxDepth > 1;

		for (const cell of headerGrid.cells) {
			if (!cell.isLeaf) {
				boundaries.add(cell.leafTo);

				const ownerRow = ownerRows[cell.leafTo];

				if (ownerRow === undefined || cell.headerRowStart < ownerRow) {
					ownerRows[cell.leafTo] = cell.headerRowStart;
					owners[cell.leafTo] = cell.column;
				}

				for (let i = cell.leafFrom; i <= cell.leafTo; i += 1) {
					inGroup.add(i);
				}
			} else if (multiRowHeader && cell.headerRowStart === 1) {
				// Top-level standalone leaf in a multi-row header: its right
				// edge sits next to a group cell, so paint the same 2 px
				// boundary the group cell paints — keeps the vertical line
				// continuous top-to-bottom.
				boundaries.add(cell.leafTo);
			}
		}

		return { groupRightBoundaries: boundaries, leavesInGroup: inGroup, resizeEdgeOwner: owners };
	}, [headerGrid.cells, headerGrid.maxDepth, leafColumns.length]);

	const leafPinningEdge = useMemo<{ left: number; right: number }>(() => {
		let left = -1;
		let right = -1;

		for (let i = 0; i < leafPinning.length; i += 1) {
			if (leafPinning[i] === "left") {
				left = i;
			} else if (right === -1 && leafPinning[i] === "right") {
				right = i;
			}
		}

		return { left, right };
	}, [leafPinning]);

	const cellsByRow = useMemo(() => {
		const grouped: DataTableHeaderCell<RowType>[][] = Array.from({ length: headerDepth }, () => []);

		for (const cell of headerGrid.cells) {
			const rowIndex = cell.headerRowStart - 1;
			grouped[rowIndex]?.push(cell);
		}

		return grouped;
	}, [headerGrid.cells, headerDepth]);

	const colWidths = useMemo(
		() => getColumnWidths(leafColumns, !!columnResizingOptions, actionColumnAutoSize),
		[leafColumns, columnResizingOptions, actionColumnAutoSize]
	);
	const minTableWidth = useMemo(
		() => getMinTableWidthExpression(leafColumns, actionColumnAutoSize),
		[leafColumns, actionColumnAutoSize]
	);

	const handleSort = useCallback(
		(column: BaseColumnType<RowType>, event?: { shiftKey?: boolean }): void => {
			if (disabled || !column.sortable || !sortOptions?.onSort) {
				return;
			}

			const columnId = getColumnId(column);

			if (columnId === undefined) {
				return;
			}

			const isMulti =
				!!sortOptions.enableMultiSort && (sortOptions.isMultiSortEvent ?? ((e): boolean => !!e?.shiftKey))(event ?? {});

			const { next, order, ignored } = getNextSortState(column, columnId, sortOptions.sortState ?? [], {
				isMulti,
				maxMultiSortColCount: sortOptions.maxMultiSortColCount
			});

			if (ignored) {
				// Activation rejected (e.g. appending past the multi-sort cap): nothing
				// changed, so stay silent and do not fire `onSort` with a no-op payload.
				return;
			}

			if (order === "asc") {
				announceSort(sortAscendingMessage);
			} else if (order === "desc") {
				announceSort(sortDescendingMessage);
			} else {
				announceSort(sortClearedMessage);
			}

			sortOptions.onSort(next, { columnId, order });
		},
		[disabled, sortOptions, sortAscendingMessage, sortDescendingMessage, sortClearedMessage, announceSort]
	);

	const rowRefs = useScrollToNode({ dataLength: data.length, scrollToNode, isVirtualizedMode });

	// Opt-in gating reacts to consumer-provided slots and column-level render
	// hooks — never to the always-present defaults.
	const hasFilterRow =
		!hideHeader &&
		(slotInfo.hasConsumerSlot("filterRow") ||
			slotInfo.hasConsumerSlot("filterCell") ||
			slotInfo.hasConsumerSlot("filterContent") ||
			leafColumns.some((column) => !!getColumnRender(column, "renderFilter")));

	const showFooter =
		hasFootContent === true ||
		slotInfo.hasConsumerSlot("foot") ||
		slotInfo.hasConsumerSlot("footRow") ||
		slotInfo.hasConsumerSlot("footCell") ||
		slotInfo.hasConsumerSlot("footContent") ||
		leafColumns.some((column) => !!getColumnRender(column, "renderFooter"));

	const expansionRender = rowExpansion?.render;
	const expansionPredicate = rowExpansion?.predicate;
	const hasExpansion = !!expansionRender;

	const resolveExpansion = useCallback(
		(row: RowType, rowIndex: number): ReactNode => {
			if (!expansionRender) {
				return null;
			}

			// Skip the renderer (and its JSX allocation) for rows the predicate
			// rejects — matters for large/virtualized datasets.
			if (expansionPredicate && !expansionPredicate({ row, rowIndex })) {
				return null;
			}

			return expansionRender({ row, rowIndex, columns: leafColumns });
		},
		[expansionRender, expansionPredicate, leafColumns]
	);

	const [contextMenuState, setContextMenuState] = useState<DataTableContextMenuState<RowType>>(null);

	const closeContextMenu = useCallback((): void => {
		setContextMenuState(null);
	}, []);

	// A body context menu captures its row by value; if `data` is replaced while the
	// menu is open, the captured row can become stale (its actions would operate on
	// removed data). Close the menu when the data identity changes.
	useEffect(() => {
		setContextMenuState((current) => (current?.type === "body" ? null : current));
	}, [data]);

	const openBodyContextMenu = useCallback(
		(args: { row: RowType; rowIndex: number; position: { top: number; left: number } }): void => {
			setContextMenuState({ type: "body", ...args });
		},
		[]
	);

	const openHeadContextMenu = useCallback(
		(args: { column: BaseColumnType<RowType>; columnIndex: number; position: { top: number; left: number } }): void => {
			setContextMenuState({ type: "head", ...args });
		},
		[]
	);

	const tableRef = useRef<HTMLTableElement | null>(null);
	const viewportRef = useRef<HTMLDivElement | null>(null);

	/*
	 * `viewportRef` lives on an ancestor of `DataTableVirtualizedBody`, but React
	 * commits refs bottom-up, so the descendant's first render sees a null
	 * ancestor ref. The virtualizer needs the live scroll element (to subscribe
	 * to scroll events and measure `scrollMargin`), so this callback-ref stores
	 * it in state to force a re-render once the node attaches.
	 */
	const [viewportEl, setViewportEl] = useState<HTMLDivElement | null>(null);
	const setViewportRef = useCallback((node: HTMLDivElement | null): void => {
		if (viewportRef.current !== node) {
			viewportRef.current = node;
			setViewportEl(node);
		}
	}, []);

	const setTableRef = useCallback(
		(node: HTMLElement | null): void => {
			// The one place the layout root is widened. The table layout attaches a
			// `<table>` here; card view attaches the card root `<div>`. Everything reading
			// `tableRef` stays typed for the table, because every hook that touches a
			// table-specific member (column resize, `<thead>` measurement, pin offsets,
			// keyboard row reorder) belongs to features card view does not have — and the
			// ones that stay live in card view only ever query descendants by `data-role`.
			tableRef.current = node as HTMLTableElement | null;
			ref?.(node as HTMLTableElement | null);
		},
		[ref]
	);

	const { resizeHandleProps, groupResizeHandleProps, isResizable, pinnedByResize, remeasureSignal } = useColumnResize({
		tableRef,
		leafColumns,
		leafPinning,
		resizingOptions: columnResizingOptions,
		disabled
	});

	// Auto-size width-less action columns to fit their content (buttons + header + footer) by
	// writing `--a12-col-N-width` on the table root — the same channel resize uses.
	// Skips any column the user manually resized (`pinnedByResize`); re-fits after an
	// Escape reset clears the vars (`remeasureSignal`).
	useAutoSizeActionColumns({
		tableRef,
		scrollRef: viewportRef,
		leafColumns,
		autoSizeEnabled: actionColumnAutoSize,
		rows: data,
		pinnedByResize,
		remeasureSignal
	});

	const typedResizeHandleProps = useCallback(
		(columnIndex: number): ReactHTMLAttributes<HTMLDivElement> =>
			resizeHandleProps(columnIndex) as ReactHTMLAttributes<HTMLDivElement>,
		[resizeHandleProps]
	);

	const typedGroupResizeHandleProps = useCallback(
		(
			leafFrom: number,
			leafTo: number,
			groupColumn: BaseColumnType<RowType>,
			groupLabel: string
		): ReactHTMLAttributes<HTMLDivElement> =>
			groupResizeHandleProps(leafFrom, leafTo, groupColumn, groupLabel) as ReactHTMLAttributes<HTMLDivElement>,
		[groupResizeHandleProps]
	);

	// Writes `--a12-pin-{left,right}-N` on the table root; cells read them via
	// `--a12-data-table-pin-offset` (see `useCellPinning`) — no state round-trip.
	useLeafPinOffsetCssVars({ tableRef, leafColumns, leafPinning });

	// Keep a focused header cell / resize separator scrolled into the unobscured
	// band when the header overflows horizontally (e.g. after a keyboard resize).
	useHeaderFocusScroll(viewportEl);

	const keyboardReorder = useDataTableKeyboardReorder<RowType>({
		dragDropOptions,
		rowByIndex: (index) => data[index],
		rowCount: data.length,
		dndRowRegistry,
		announce: announceSort
	});

	const getRowElement = useCallback(
		(rowIndex: number): HTMLElement | null => rowRefs.current[rowIndex] ?? null,
		[rowRefs]
	);

	const rowKeyForIndex = useCallback(
		(rowIndex: number): Key => {
			const row = data[rowIndex];

			return row !== undefined ? rowKeyFor(row, rowIndex, rowKey) : rowIndex;
		},
		[data, rowKey]
	);

	// Inverse of `rowKeyForIndex`, mirroring its treatment of holes (sparse `data` in infinite-scroll
	// mode). A scan rather than a map: only hit when the roving tab stop is re-anchored, never per row.
	const indexForRowKey = useCallback(
		(key: Key): number =>
			data.findIndex((row, rowIndex) => (row !== undefined ? rowKeyFor(row, rowIndex, rowKey) : rowIndex) === key),
		[data, rowKey]
	);

	// Set by `DataTreeTable`; `undefined` for a plain `DataTable`.
	const rowFallbackKeys = useRowTabStopFallback();

	const arrowNav = useRowArrowNavigation({
		tableRef,
		disabled: !!disabled || !!disableArrowNavigation,
		rowCount: data.length,
		rowKeyForIndex,
		indexForRowKey,
		getRowElement,
		rowFallbackKeys,
		reorder: keyboardReorder
	});

	const arrowNavActive = !disabled && !disableArrowNavigation && data.length > 0 && leafColumns.length > 0;

	useFilterRowHeadHeight({ tableRef, hasFilterRowRenderer: hasFilterRow, headerDepth });

	useCellHighlighting({ tableRef, cellHighlighting, disabled, cardView });

	// In infinite-scroll mode the windowed body numbers rows against the full
	// `rowCount`, which may exceed the loaded `data.length` (a short/sparse array) —
	// take the larger so a rendered row's `aria-rowindex` never exceeds `aria-rowcount`.
	const bodyRowCount = Math.max(data.length, isInfiniteScrollMode ? (infiniteScrollOptions?.rowCount ?? 0) : 0);
	const ariaRowCount = bodyRowCount + effectiveHeaderDepth + (hasFilterRow ? 1 : 0) + (showFooter ? 1 : 0);

	// The footer is the last row, so its 1-based index equals the total row
	// count. Only needed in windowed modes (explicit numbering).
	const footerAriaRowIndex = isVirtualizedMode && showFooter ? ariaRowCount : undefined;

	const bodyAriaRowIndex = useCallback(
		(rowIndex: number): number => rowIndex + effectiveHeaderDepth + (hasFilterRow ? 1 : 0) + 1,
		[effectiveHeaderDepth, hasFilterRow]
	);

	const { hasContextMenu } = slotInfo;

	const resolveRowState = useCallback(
		(row: RowType, rowIndex: number): DataTableRowState => {
			const styles = rowStyling?.({ row, rowIndex });
			const hasRowClick = !disabled && !!rowEventHandlers?.({ row, rowIndex })?.onClick;

			const resolvedStyles =
				styles?.className !== undefined || styles?.style !== undefined || styles?.title !== undefined
					? { className: styles?.className, style: styles?.style as CSSProperties | undefined, title: styles?.title }
					: undefined;

			return {
				styles: resolvedStyles,
				rowDisabled: !!disabled || !!styles?.disabled,
				highlightVariant: styles?.highlightVariant,
				selected: !!styles?.selected,
				highlighted: !!styles?.highlighted,
				interactive: !!styles?.interactive || hasRowClick,
				hasRowClick,
				hasRowContextMenu: !disabled && hasContextMenu && !styles?.disabledRightClickContextMenu
			};
		},
		[rowStyling, rowEventHandlers, disabled, hasContextMenu]
	);

	// Newest `rowEventHandlers` for the dispatchers below. Synced in a layout
	// effect rather than during render so a render React discards can never leave
	// the ref ahead of what is actually committed; events fire after commit, so
	// the dispatchers always see the handlers belonging to the visible rows.
	const rowEventHandlersRef = useRef(rowEventHandlers);

	useLayoutEffect(() => {
		rowEventHandlersRef.current = rowEventHandlers;
	});

	// Stable for the lifetime of the table: a body row keeps its identity across a
	// `rowEventHandlers` change, so passing these down cannot invalidate the row
	// memo. They re-read the getter per event, which is also what keeps a row that
	// skipped a render from firing a stale handler.
	const dispatchRowClick = useCallback((row: RowType, rowIndex: number, event: MouseEvent<HTMLElement>): void => {
		rowEventHandlersRef.current?.({ row, rowIndex })?.onClick?.(event);
	}, []);

	const dispatchRowContextMenu = useCallback(
		(row: RowType, rowIndex: number, event: MouseEvent<HTMLElement>): void => {
			event.preventDefault();
			openBodyContextMenu({ row, rowIndex, position: { top: event.clientY, left: event.clientX } });
		},
		[openBodyContextMenu]
	);

	// Everything the model publishes to slot authors through `DataTableContext`,
	// assembled here rather than in the view so the boundary is recorded once: a field
	// added below is part of the semi-public slot contract, a field added to the
	// returned object beside it is view-internal plumbing. `slots` and
	// `dragDropOptions` are the two the view still contributes — the model stays
	// deliberately unaware of the slot components themselves (see
	// {@link DataTableModelSlotInfo}), and the drag options need the view's
	// stable-identity Proxy.
	const contextFields = useMemo<DataTableModelContextFields<RowType>>(
		() => ({
			disabled,
			cardView,
			gridRole: cardView ? undefined : gridRole,
			crossTabulation,
			cellHighlighting: !!cellHighlighting && !cardView,
			headerDepth,
			isVirtualizedMode,
			footerAriaRowIndex,
			leafPinning,
			leafPinningEdge,
			actionColumnHiddenText,
			isResizable,
			leafColumnCount: leafColumns.length,
			resizeHandleProps: typedResizeHandleProps,
			groupResizeHandleProps: typedGroupResizeHandleProps,
			isRowFocused: arrowNav.isFocused,
			onRowFocusChange: arrowNav.handleRowFocus,
			ensureRowTabStop: arrowNav.ensureTabStop,
			arrowNavActive,
			groupRightBoundaries,
			leavesInGroup,
			resizeEdgeOwner,
			onSort: handleSort,
			openHeadContextMenu,
			rowCount: data.length,
			dndRowRegistry
		}),
		[
			disabled,
			cardView,
			gridRole,
			crossTabulation,
			cellHighlighting,
			headerDepth,
			isVirtualizedMode,
			footerAriaRowIndex,
			leafPinning,
			leafPinningEdge,
			actionColumnHiddenText,
			isResizable,
			leafColumns.length,
			typedResizeHandleProps,
			typedGroupResizeHandleProps,
			arrowNav.isFocused,
			arrowNav.handleRowFocus,
			arrowNav.ensureTabStop,
			arrowNavActive,
			groupRightBoundaries,
			leavesInGroup,
			resizeEdgeOwner,
			handleSort,
			openHeadContextMenu,
			data.length,
			dndRowRegistry
		]
	);

	return {
		contextFields,
		data,
		leafColumns,
		cellsByRow,
		headerDepth,
		crossTabulation,
		leafPinning,
		colWidths,
		minTableWidth,
		isInfiniteScrollMode,
		isVirtualizedMode,
		resolvedVirtualScrollOptions,
		emptyStateLabel,
		sortState: sortOptions?.sortState,
		hideHeader,
		hasFilterRow,
		showFooter,
		hasExpansion,
		resolveExpansion,
		contextMenuState,
		closeContextMenu,
		tableRef,
		setTableRef,
		viewportRef,
		viewportEl,
		setViewportRef,
		rowRefs,
		getRowElement,
		rowKeyForIndex,
		enableDragDrop,
		activeDrag,
		setActiveDrag,
		dndRowRegistry,
		ariaRowCount,
		bodyAriaRowIndex,
		resolveRowState,
		dispatchRowClick,
		dispatchRowContextMenu
	};
}
