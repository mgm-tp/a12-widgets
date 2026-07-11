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
import { useCallback, useContext, useMemo, useRef, useState } from "react";

import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";

import type { BaseColumnType } from "./foundation/column.api.js";
import type { DataTableSortState } from "./data-table.sort.js";
import { assertSortableColumnIds, getColumnId, getNextSortState } from "./data-table.sort.js";
import { useCellHighlighting } from "./data-table.cell-highlighting.js";
import { useFilterRowHeadHeight } from "./data-table.head-height.js";
import { useLeafPinOffsets } from "./data-table.pin-offsets.js";
import { useScrollToNode } from "./data-table.scroll-to-node.js";
import { buildHeaderGrid, getColumnRender, type DataTableHeaderCell } from "./columns.js";
import { useRowArrowNavigation } from "./keyboard.js";
import type { DataTableProps, DataTableVirtualScrollOptions } from "./data-table.api.js";
import type { DataTableRenderPropsType } from "./data-table-renderer.api.js";
import type { DataTableSlots } from "./data-table-slots.api.js";
import { useColumnResize } from "./data-table.resize.js";
import { getColumnWidths, getMinTableWidth, rowKeyFor } from "./data-table.utils.js";

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
 * @internal
 */
export interface DataTableRowState {
	styles?: DataTableRenderPropsType.RowStyleResult;
	rowDisabled: boolean;
	highlightVariant?: "success" | "info";
	selected: boolean;
	highlighted: boolean;
	interactive: boolean;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
	onContextMenu?: (event: MouseEvent<HTMLElement>) => void;
}

/**
 * Inputs the model needs from the slot-resolution layer: which opt-in
 * structures the consumer activated. Passed as plain booleans/probes so the
 * model has no dependency on the slot components themselves.
 *
 * @internal
 */
export interface DataTableModelSlotInfo {
	hasConsumerSlot: (slot: keyof DataTableSlots<any, any>) => boolean;
	hasContextMenu: boolean;
}

/**
 * The headless DataTable state model: every piece of derived layout state and
 * behavior (header grid, pinning, sorting, resizing, keyboard navigation,
 * context menus, row state, aria numbering) with no element production. Most
 * fields are also published through {@link DataTableContext}.
 *
 * @internal
 */
export interface DataTableModel<RowType> {
	data: (RowType | undefined)[];
	leafColumns: BaseColumnType<RowType>[];
	cellsByRow: DataTableHeaderCell<RowType>[][];
	headerDepth: number;

	/** `headerDepth` for aria purposes — `0` when the header is hidden. */
	effectiveHeaderDepth: number;
	crossTabulation: boolean;
	leafPinning: (("left" | "right") | undefined)[];
	leafPinOffsets: { left: number[]; right: number[] };
	leafPinningEdge: { left: number; right: number };
	groupRightBoundaries: ReadonlySet<number>;
	leavesInGroup: ReadonlySet<number>;
	colWidths: string[];
	minTableWidth: number | undefined;

	isInfiniteScrollMode: boolean;
	isVirtualizedMode: boolean;
	resolvedVirtualScrollOptions: DataTableVirtualScrollOptions | undefined;

	emptyStateLabel: string;
	actionColumnFallbackLabel: string;

	sortState: DataTableSortState | undefined;
	handleSort: (column: BaseColumnType<RowType>, event?: { shiftKey?: boolean }) => void;
	sortAnnouncement: string;

	hideHeader: boolean;
	hasFilterRow: boolean;
	showFooter: boolean;

	hasExpansion: boolean;
	resolveExpansion: (row: RowType, rowIndex: number) => ReactNode;

	contextMenuState: DataTableContextMenuState<RowType>;
	openBodyContextMenu: (args: { row: RowType; rowIndex: number; position: { top: number; left: number } }) => void;
	openHeadContextMenu: (args: {
		column: BaseColumnType<RowType>;
		columnIndex: number;
		position: { top: number; left: number };
	}) => void;
	closeContextMenu: () => void;

	tableRef: { current: HTMLTableElement | null };
	setTableRef: (node: HTMLTableElement | null) => void;
	viewportRef: { current: HTMLDivElement | null };

	/** The live scroll-container element, as state — drives the DnD auto-scroll effect. */
	viewportEl: HTMLDivElement | null;
	setViewportRef: (node: HTMLDivElement | null) => void;
	rowRefs: { current: (HTMLElement | null)[] };
	getRowElement: (rowIndex: number) => HTMLElement | null;
	rowKeyForIndex: (rowIndex: number) => Key;

	isResizable: (columnIndex: number) => boolean;
	resizeHandleProps: (columnIndex: number) => ReactHTMLAttributes<HTMLDivElement>;

	isRowFocused: (rowIndex: number) => boolean;
	onRowFocusChange: (rowIndex: number, row?: HTMLTableRowElement) => void;
	arrowNavActive: boolean;

	enableDragDrop: boolean;
	activeDrag: DataTableRenderPropsType.ActiveDrag<RowType> | null;
	setActiveDrag: (drag: DataTableRenderPropsType.ActiveDrag<RowType> | null) => void;

	ariaRowCount: number;
	footerAriaRowIndex: number | undefined;
	bodyAriaRowIndex: (rowIndex: number) => number;

	resolveRowState: (row: RowType, rowIndex: number) => DataTableRowState;
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
		disableArrowNavigation,
		disabled,
		hasFootContent,
		hideHeader = false,
		rowExpansion,
		scrollToNode,
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
	const actionColumnFallbackLabel = tableTitles?.actionColumnDefaultLabel ?? "Actions";

	const [sortAnnouncement, setSortAnnouncement] = useState("");
	const [activeDrag, setActiveDrag] = useState<DataTableRenderPropsType.ActiveDrag<RowType> | null>(null);
	const enableDragDrop = !!dragDropOptions;

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

	const { groupRightBoundaries, leavesInGroup } = useMemo(() => {
		const boundaries = new Set<number>();
		const inGroup = new Set<number>();
		const multiRowHeader = headerGrid.maxDepth > 1;

		for (const cell of headerGrid.cells) {
			if (!cell.isLeaf) {
				boundaries.add(cell.leafTo);

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

		return { groupRightBoundaries: boundaries, leavesInGroup: inGroup };
	}, [headerGrid.cells, headerGrid.maxDepth]);

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
		() => getColumnWidths(leafColumns, !!columnResizingOptions),
		[leafColumns, columnResizingOptions]
	);
	const minTableWidth = useMemo(() => getMinTableWidth(leafColumns), [leafColumns]);

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

			const { next, order } = getNextSortState(column, columnId, sortOptions.sortState ?? [], {
				isMulti,
				maxMultiSortColCount: sortOptions.maxMultiSortColCount
			});

			if (order === "asc") {
				setSortAnnouncement(sortAscendingMessage);
			} else if (order === "desc") {
				setSortAnnouncement(sortDescendingMessage);
			} else {
				setSortAnnouncement(sortClearedMessage);
			}

			sortOptions.onSort(next, { columnId, order });
		},
		[disabled, sortOptions, sortAscendingMessage, sortDescendingMessage, sortClearedMessage]
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
		(node: HTMLTableElement | null): void => {
			tableRef.current = node;
			ref?.(node);
		},
		[ref]
	);

	const { resizeHandleProps, isResizable } = useColumnResize({
		tableRef,
		leafColumns,
		resizingOptions: columnResizingOptions,
		disabled
	});

	const typedResizeHandleProps = useCallback(
		(columnIndex: number): ReactHTMLAttributes<HTMLDivElement> =>
			resizeHandleProps(columnIndex) as ReactHTMLAttributes<HTMLDivElement>,
		[resizeHandleProps]
	);

	const leafPinOffsets = useLeafPinOffsets({ tableRef, leafColumns, leafPinning });

	const arrowNav = useRowArrowNavigation({
		tableRef,
		disabled: !!disabled || !!disableArrowNavigation,
		rowCount: data.length
	});

	const arrowNavActive = !disabled && !disableArrowNavigation && data.length > 0 && leafColumns.length > 0;

	useFilterRowHeadHeight({ tableRef, hasFilterRowRenderer: hasFilterRow, headerDepth });

	useCellHighlighting({ tableRef, cellHighlighting, disabled, cardView });

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

	const ariaRowCount = data.length + effectiveHeaderDepth + (hasFilterRow ? 1 : 0) + (showFooter ? 1 : 0);

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
			const handlers = rowEventHandlers?.({ row, rowIndex });
			const rowOnClick = !disabled && handlers?.onClick ? handlers.onClick : undefined;

			const rowDisabled = !!disabled || !!styles?.disabled;
			const rowContextMenuEnabled = !disabled && hasContextMenu && !styles?.disabledRightClickContextMenu;
			const onContextMenu = rowContextMenuEnabled
				? (event: MouseEvent<HTMLElement>): void => {
						event.preventDefault();
						openBodyContextMenu({ row, rowIndex, position: { top: event.clientY, left: event.clientX } });
					}
				: undefined;

			const resolvedStyles =
				styles?.className !== undefined || styles?.style !== undefined || styles?.title !== undefined
					? { className: styles?.className, style: styles?.style as CSSProperties | undefined, title: styles?.title }
					: undefined;

			return {
				styles: resolvedStyles,
				rowDisabled,
				highlightVariant: styles?.highlightVariant,
				selected: !!styles?.selected,
				highlighted: !!styles?.highlighted,
				interactive: !!styles?.interactive || !!rowOnClick,
				onClick: rowOnClick ? (event: MouseEvent<HTMLElement>): void => rowOnClick(event) : undefined,
				onContextMenu
			};
		},
		[rowStyling, rowEventHandlers, disabled, hasContextMenu, openBodyContextMenu]
	);

	return {
		data,
		leafColumns,
		cellsByRow,
		headerDepth,
		effectiveHeaderDepth,
		crossTabulation,
		leafPinning,
		leafPinOffsets,
		leafPinningEdge,
		groupRightBoundaries,
		leavesInGroup,
		colWidths,
		minTableWidth,
		isInfiniteScrollMode,
		isVirtualizedMode,
		resolvedVirtualScrollOptions,
		emptyStateLabel,
		actionColumnFallbackLabel,
		sortState: sortOptions?.sortState,
		handleSort,
		sortAnnouncement,
		hideHeader,
		hasFilterRow,
		showFooter,
		hasExpansion,
		resolveExpansion,
		contextMenuState,
		openBodyContextMenu,
		openHeadContextMenu,
		closeContextMenu,
		tableRef,
		setTableRef,
		viewportRef,
		viewportEl,
		setViewportRef,
		rowRefs,
		getRowElement,
		rowKeyForIndex,
		isResizable,
		resizeHandleProps: typedResizeHandleProps,
		isRowFocused: arrowNav.isFocused,
		onRowFocusChange: arrowNav.handleRowFocus,
		arrowNavActive,
		enableDragDrop,
		activeDrag,
		setActiveDrag,
		ariaRowCount,
		footerAriaRowIndex,
		bodyAriaRowIndex,
		resolveRowState
	};
}
