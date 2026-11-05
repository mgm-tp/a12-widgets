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

import type {
	CSSProperties,
	HTMLProps,
	Key,
	MouseEvent,
	MouseEventHandler,
	ReactElement,
	ReactNode,
	Ref,
	RefCallback
} from "react";
import {
	forwardRef,
	Fragment,
	memo,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState
} from "react";

import { DataRoles } from "../../common/main/data-roles.js";

import { DataTableCardListTpl } from "./card-view/data-table.card-list.tpl.view.js";
import { DataTableCardPlaceholderTpl } from "./card-view/data-table.card-placeholder.tpl.view.js";
import { DataTableCardsTpl } from "./card-view/data-table.cards.tpl.view.js";
import { getColumnCellSpan, getColumnRender, type DataTableHeaderCell } from "./columns.js";
import type { ResolvedDataTableSlots } from "./data-table-slots.api.js";
import type { DataTableProps } from "./data-table.api.js";
import { DataTableContextProvider, type DataTableContextType } from "./data-table.context.js";
import { scrollHeaderTargetIntoView } from "./data-table.header-focus-scroll.js";
import type { DataTableInfiniteScrollSlot } from "./data-table.infinite-scroll-body.view.js";
import { useDataTableSlots } from "./data-table.slots.js";
import { getColumnId, getColumnSortOrder } from "./data-table.sort.js";
import {
	DEFAULT_BODY_ALIGNMENT,
	DEFAULT_HEAD_ALIGNMENT,
	getCellContent,
	rowKeyFor,
	toAriaSort
} from "./data-table.utils.js";
import type { DataTableVirtualizedRowSlot } from "./data-table.virtualized-body.view.js";
import {
	DataTableBody,
	DataTableCell,
	DataTableCellContent,
	DataTableFilterCell,
	DataTableFilterContent,
	DataTableFilterRow,
	DataTableFoot,
	DataTableFootCell,
	DataTableFootContent,
	DataTableFootRow,
	DataTableHead,
	DataTableHeadCell,
	DataTableHeadCellGroup,
	DataTableHeadContent,
	DataTableHeadRow,
	DataTablePlaceholderCell,
	DataTablePlaceholderContent,
	DataTablePlaceholderRow,
	DataTableRow,
	DataTableRowGroupHeader
} from "./default-renderers.js";
import { useDataTableDndMonitor } from "./dnd/index.js";
import type { BaseColumnType } from "./foundation/column.api.js";
import type { CellStyles, TableDragDropOptions } from "./foundation/table.api.js";
import { DataTableBodyTpl } from "./template/data-table.body.tpl.view.js";
import { DataTableContextMenuTpl } from "./template/data-table.context-menu.tpl.view.js";
import { DataTableHeadGroupRowTpl } from "./template/data-table.head-group-row.tpl.view.js";
import { DataTablePlaceholderRowTpl } from "./template/data-table.placeholder-row.tpl.view.js";
import { DataTableTpl } from "./template/data-table.tpl.view.js";
import { useDataTableModel, type DataTableRowState } from "./use-data-table-model.js";

/**
 * Experimental DataTable — a table renderer with no imperative column-width
 * sync (no per-row 3-segment containers, no `ColumnWidthSync`).
 *
 * Customization is layered:
 *  - column-level `renderCell` / `renderHeader` / `renderFooter` / `renderFilter`
 *    hooks on {@link DataTableColumn} for per-column content,
 *  - component {@link DataTableSlots} (the `slots` prop) for structural overrides,
 *  - the self-wiring `DataTable.*` primitives (`DataTable.Head`, `DataTable.Row`, …)
 *    for slot implementations that compose rather than wrap,
 *  - the headless model published through {@link useDataTableContext} for fully
 *    custom slot internals.
 *
 * @experimental
 */
export function DataTable<RowType, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>>(
	genericProps: DataTableProps<RowType, ColumnType>
): ReactElement {
	// `ColumnType` only preserves the consumer's column typing in callbacks and
	// slots; internals operate on the base column type.
	const props = genericProps as unknown as DataTableProps<RowType>;
	const {
		data = [],
		cellStyling,
		cellHighlighting,
		cardView,
		disabled,
		ariaLabel,
		maxHeight,
		rowHeight,
		horizontalScrollRef,
		rowKey,
		dragDropOptions,
		infiniteScrollOptions,
		scrollToNode,
		onBlur,
		id,
		className,
		style,
		dataRole,
		domProps,
		ariaLabelledby,
		ariaHidden,
		gridRole
	} = props;

	// The layout choice made once, up front: `cardView` swaps in the card-view slot set
	// (a `role="list"` of cards) and, below, the card root template. Nothing downstream
	// re-decides it — no template branches on `cardView`, and the two layouts share no CSS.
	const { slots, hasConsumerSlot } = useDataTableSlots<RowType>(props.slots, cardView);

	// Live-region text is held imperatively by a ref-driven <DataTableLiveRegion>
	// span, not by state on this component: an announcement (a sort result)
	// re-renders only the span, never the whole table — whose body would
	// otherwise reconcile every row per tick. The sink is stable, so passing it
	// into the model never re-subscribes anything.
	const sortLiveRegionRef = useRef<DataTableLiveRegionHandle>(null);
	const announceSort = useCallback((message: string): void => sortLiveRegionRef.current?.announce(message), []);

	const model = useDataTableModel<RowType>(props, {
		hasConsumerSlot,
		hasContextMenu: !!slots.contextMenu,
		announceSort
	});

	const {
		leafColumns,
		cellsByRow,
		headerDepth,
		crossTabulation,
		leafPinning,
		isVirtualizedMode,
		isInfiniteScrollMode,
		resolvedVirtualScrollOptions,
		emptyStateLabel,
		sortState,
		hideHeader,
		hasFilterRow,
		showFooter,
		hasExpansion,
		resolveExpansion,
		contextMenuState,
		closeContextMenu,
		rowRefs,
		enableDragDrop,
		activeDrag,
		dndRowRegistry
	} = model;

	// Tracks any compatible drag (including ones started in another DataTable
	// with the same `acceptType`) into `model.activeDrag`, and drives the row-shift
	// drop-gap preview off the shared row registry.
	useDataTableDndMonitor<RowType>({
		dragDropOptions,
		tableRef: model.tableRef,
		viewportEl: model.viewportEl,
		dndRowRegistry,
		setActiveDrag: model.setActiveDrag
	});

	// Horizontal counterpart to the virtualizer's vertical handle. The scroll viewport is the
	// horizontal scroller in every mode, so this needs nothing from the virtualizer — and column
	// targeting reuses the pinned-aware band arithmetic that keeps a focused header cell clear of
	// sticky columns, so a column is never revealed behind one.
	useImperativeHandle(
		horizontalScrollRef,
		() => ({
			scrollToColumn: (columnId, { align, behavior } = {}): void => {
				const viewport = model.viewportRef.current;
				// Same identity precedence as sorting (`id` → `dataKey` → string `label`), so a
				// column is addressed here by whatever already identifies it elsewhere.
				const leafIndex = leafColumns.findIndex((column) => getColumnId(column) === columnId);

				if (!viewport || leafIndex < 0) {
					return;
				}

				// Header cells carry a 1-based `data-col-index` matching leaf order.
				const cell = model.tableRef.current?.querySelector<HTMLElement>(
					`thead [data-role="${DataRoles.Table.Header.Cell}"][data-col-index="${leafIndex + 1}"]`
				);

				if (cell) {
					scrollHeaderTargetIntoView(viewport, cell, { align, behavior });
				}
			},
			scrollToOffset: (offsetPx, { behavior } = {}): void => {
				const viewport = model.viewportRef.current;

				if (!viewport) {
					return;
				}

				const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);

				viewport.scrollTo({ left: Math.min(Math.max(offsetPx, 0), max), behavior });
			},
			getScrollState: () => {
				const viewport = model.viewportRef.current;

				return {
					scrollLeft: viewport?.scrollLeft ?? 0,
					scrollWidth: viewport?.scrollWidth ?? 0,
					clientWidth: viewport?.clientWidth ?? 0
				};
			}
		}),
		[leafColumns, model.tableRef, model.viewportRef]
	);

	// The height actually applied to the DOM. A virtualized or infinite-scroll fixed row height is
	// an assertion the arithmetic already depends on — spacers and offsets are computed from it — so
	// it drives the layout too, rather than being left to agree by luck. An explicit `rowHeight`
	// still wins, and a `rowStyling` height overrides both on the rows it targets.
	const appliedRowHeight =
		rowHeight ?? (isInfiniteScrollMode ? infiniteScrollOptions?.rowHeight : resolvedVirtualScrollOptions?.rowHeight);

	const hasConsumerHeadContent = hasConsumerSlot("headContent");
	const hasConsumerCellContent = hasConsumerSlot("cellContent");
	const hasConsumerBody = hasConsumerSlot("body");

	// Dev-only: surface the `body`-slot bypass below — while DnD is enabled the table
	// owns the `<tbody>` (the interleaved drop-target hint rows assume the template
	// tbody with one `<tr>` per data row in data order), so a consumer `body` slot is ignored.
	useEffect(() => {
		if (process.env.NODE_ENV === "production" || !enableDragDrop || !hasConsumerBody) {
			return;
		}

		// eslint-disable-next-line no-console
		console.error(
			"DataTable: the `body` slot is ignored while drag & drop is enabled — the DnD machinery " +
				"owns the <tbody> structure. Customize rows via the `row`/`dndRow` slots instead."
		);
	}, [enableDragDrop, hasConsumerBody]);

	// Stable-identity view of `dragDropOptions`. Consumers routinely pass an inline
	// options object (new identity every render); dropping the raw prop into the
	// context memo below would re-key the whole context value every parent render,
	// re-rendering every context consumer and defeating the cold-context design. A
	// render-updated ref mirror keeps field reads current, and the Proxy gives the
	// context one stable reference whose reads always resolve to the latest options.
	// `has`/`ownKeys`/`getOwnPropertyDescriptor` are trapped too so spread and
	// key-enumeration by custom slots see the live options, not the empty target.
	const dragDropOptionsRef = useRef(dragDropOptions);
	dragDropOptionsRef.current = dragDropOptions;
	const stableDragDropOptions = useMemo<TableDragDropOptions<RowType> | undefined>(
		() =>
			enableDragDrop
				? new Proxy({} as TableDragDropOptions<RowType>, {
						get: (_target, property) => dragDropOptionsRef.current?.[property as keyof TableDragDropOptions<RowType>],
						has: (_target, property) => !!dragDropOptionsRef.current && property in dragDropOptionsRef.current,
						ownKeys: () => (dragDropOptionsRef.current ? Reflect.ownKeys(dragDropOptionsRef.current) : []),
						getOwnPropertyDescriptor: (_target, property) => {
							const descriptor = dragDropOptionsRef.current
								? Object.getOwnPropertyDescriptor(dragDropOptionsRef.current, property)
								: undefined;

							// `configurable` is forced: the proxy target is `{}`, and reporting a
							// non-configurable property the target lacks violates proxy invariants.
							return descriptor ? { ...descriptor, configurable: true } : undefined;
						}
					})
				: undefined,
		[enableDragDrop]
	);

	const renderHeadCell = (cell: DataTableHeaderCell<RowType>): ReactNode => {
		const { column, isLeaf, leafFrom, leafTo, headerRowStart, headerRowEnd, pinning } = cell;
		const columnIndex = leafFrom;
		// Native `<th>` spanning conveys the span to assistive tech, so no
		// `aria-colspan`/`aria-rowspan` is needed: group cells span their leaf
		// range horizontally; leaf cells fill remaining header rows vertically.
		const colSpan = isLeaf ? undefined : leafTo - leafFrom + 1;
		const rowSpan = isLeaf
			? headerRowEnd - headerRowStart > 1
				? headerRowEnd - headerRowStart
				: undefined
			: undefined;
		const scope: "col" | "colgroup" = isLeaf ? "col" : "colgroup";
		const sortable = isLeaf && !!column.sortable;
		const sortOrder = isLeaf ? getColumnSortOrder(getColumnId(column), sortState) : undefined;
		const ariaSort = sortable ? toAriaSort(sortOrder) : undefined;
		const horizontal =
			column.specificHorizontalAlignment?.head ?? column.horizontalAlignment ?? DEFAULT_HEAD_ALIGNMENT.horizontal;
		const vertical =
			column.specificVerticalAlignment?.head ?? column.verticalAlignment ?? DEFAULT_HEAD_ALIGNMENT.vertical;
		const defaultLabel = column.label;

		// Content precedence: column `renderHeader` → consumer `headContent` slot
		// → label. The default content slot is skipped (it only echoes the label).
		const renderHeader = isLeaf ? getColumnRender(column, "renderHeader") : undefined;
		const HeadContentSlot = slots.headContent;
		const innerContent = renderHeader ? (
			renderHeader({ column, columnIndex, sortOrder, label: defaultLabel })
		) : hasConsumerHeadContent ? (
			<HeadContentSlot column={column} columnIndex={columnIndex} sortOrder={sortOrder} defaultContent={defaultLabel} />
		) : (
			defaultLabel
		);

		// Interaction wiring (sort, context menu, dividers, resize) is self-sourced
		// from context by the slot primitives, off the public slot prop surface.
		const HeadCellSlot = isLeaf ? slots.headCell : slots.headCellGroup;

		return (
			<HeadCellSlot
				key={`${headerRowStart}-${columnIndex}`}
				column={column}
				columnIndex={columnIndex}
				sortOrder={sortOrder}
				ariaSort={ariaSort}
				colSpan={colSpan}
				rowSpan={rowSpan}
				scope={scope}
				isLeaf={isLeaf}
				pinning={pinning}
				horizontalAlignment={horizontal}
				verticalAlignment={vertical}
				defaultContent={defaultLabel}
			>
				{innerContent}
			</HeadCellSlot>
		);
	};

	// Card view renders no header at all: each card labels its own fields, so there is
	// nothing for a column header to align with. It is skipped rather than hidden —
	// which is what lets the head templates stay free of card-view branches, and saves
	// building header cells that would never be shown.
	const showHeader = !hideHeader && !cardView;

	let headRowElement: ReactNode = null;
	const HeadRowSlot = slots.headRow;

	if (showHeader) {
		if (headerDepth === 1) {
			headRowElement = <HeadRowSlot>{cellsByRow[0]?.map(renderHeadCell) ?? []}</HeadRowSlot>;
		} else {
			headRowElement = cellsByRow.map((rowCells, rowIdx) => (
				<DataTableHeadGroupRowTpl key={rowIdx} ariaRowIndex={isVirtualizedMode ? rowIdx + 1 : undefined}>
					{rowCells.map(renderHeadCell)}
				</DataTableHeadGroupRowTpl>
			));
		}
	}

	let filterRowElement: ReactNode = null;

	if (showHeader && hasFilterRow) {
		const FilterRowSlot = slots.filterRow;
		const FilterCellSlot = slots.filterCell;
		const FilterContentSlot = slots.filterContent;
		const filterCells = leafColumns.map((column, columnIndex) => {
			// Filter content precedence: column-level `renderFilter` → the
			// `filterContent` slot (whose default renders nothing).
			const renderFilter = getColumnRender(column, "renderFilter");
			const innerContent = renderFilter ? (
				renderFilter({ column, columnIndex })
			) : (
				<FilterContentSlot column={column} columnIndex={columnIndex} />
			);

			return (
				<FilterCellSlot key={columnIndex} column={column} columnIndex={columnIndex} pinning={leafPinning[columnIndex]}>
					{innerContent}
				</FilterCellSlot>
			);
		});

		filterRowElement = <FilterRowSlot>{filterCells}</FilterRowSlot>;
	}

	const HeadSlot = slots.head;
	const headElement = showHeader ? (
		<HeadSlot>
			{headRowElement}
			{filterRowElement}
		</HeadSlot>
	) : null;

	// Everything a body row needs that is *not* per-row. Bundled into one memoized
	// object so the memoized <DataTableBodyRow> below (which builds the row's cells
	// internally) bails out of re-rendering when the table re-renders for a reason
	// that does not touch a given row — a drag start/end (`activeDrag`) or a
	// context-menu toggle. Its identity is stable as long as these inputs are; the
	// consumer callbacks in it (`cellStyling`, `rowKey`) must be stable for the
	// bail-out to hold, the same identity-stability contract the slots already carry.
	//
	// `resolveRowState` deliberately does *not* live here. It closes over
	// `rowStyling`, which any consumer deriving row state from their own state
	// (selection being the obvious case) must give a new identity on every change —
	// so holding it here made one selection click re-render every rendered row's
	// cells. It is invoked per rendered row in `renderBodyRow` instead, and its
	// value-only result is spread across the row's props so React's default shallow
	// compare re-renders just the rows whose state actually moved.
	const rowRenderContext = useMemo<DataTableRowRenderContext<RowType>>(
		() => ({
			data,
			dispatchRowClick: model.dispatchRowClick,
			dispatchRowContextMenu: model.dispatchRowContextMenu,
			slots,
			leafColumns,
			disabled,
			cellStyling,
			leafPinning,
			hasConsumerCellContent,
			rowRefs,
			resolveExpansion,
			hasExpansion,
			isVirtualizedMode,
			bodyAriaRowIndex: model.bodyAriaRowIndex,
			rowKey,
			enableDragDrop
		}),
		[
			data,
			model.dispatchRowClick,
			model.dispatchRowContextMenu,
			slots,
			leafColumns,
			disabled,
			cellStyling,
			leafPinning,
			hasConsumerCellContent,
			rowRefs,
			resolveExpansion,
			hasExpansion,
			isVirtualizedMode,
			model.bodyAriaRowIndex,
			rowKey,
			enableDragDrop
		]
	);

	// Resolved here, at the one funnel every body path goes through (plain,
	// virtualized and infinite-scroll below), so the consumer's `rowStyling` /
	// `rowEventHandlers` getters are still only invoked for rows that are actually
	// rendered — windowed modes must not pay for the whole data set.
	const renderBodyRow = (row: RowType, rowIndex: number, virtualSlot?: DataTableBodyRowVirtualSlot): ReactNode => {
		const rowState = model.resolveRowState(row, rowIndex);

		return (
			<DataTableBodyRow
				key={virtualSlot?.key ?? rowKeyFor(row, rowIndex, rowKey)}
				renderContext={rowRenderContext}
				row={row}
				rowIndex={rowIndex}
				virtualSlot={virtualSlot}
				rowStyles={rowState.styles}
				rowDisabled={rowState.rowDisabled}
				highlightVariant={rowState.highlightVariant}
				selected={rowState.selected}
				highlighted={rowState.highlighted}
				interactive={rowState.interactive}
				hasRowClick={rowState.hasRowClick}
				hasRowContextMenu={rowState.hasRowContextMenu}
			/>
		);
	};

	// `data` may be sparse in infinite-scroll mode (which renders through the
	// windowed path below); in the plain path an `undefined` row renders nothing.
	const bodyRows = isVirtualizedMode
		? []
		: data.map((row, rowIndex) => (row === undefined ? null : renderBodyRow(row, rowIndex)));

	const PlaceholderRowSlot = slots.placeholderRow;
	const bodyChildren =
		data.length === 0 ? (
			<PlaceholderRowSlot rowIndex={0} columnCount={leafColumns.length}>
				{emptyStateLabel}
			</PlaceholderRowSlot>
		) : (
			bodyRows
		);

	// Consumer-supplied override only — the default placeholder row is for the
	// empty state, not for the virtual loading rows below.
	const hasConsumerPlaceholderRow = hasConsumerSlot("placeholderRow");

	const renderPlaceholderCells = (rowIndex: number): ReactNode => {
		const PlaceholderCellSlot = slots.placeholderCell;
		const PlaceholderContentSlot = slots.placeholderContent;

		return leafColumns.map((column, columnIndex) => (
			<PlaceholderCellSlot key={columnIndex} rowIndex={rowIndex} column={column} columnIndex={columnIndex}>
				<PlaceholderContentSlot rowIndex={rowIndex} column={column} columnIndex={columnIndex} />
			</PlaceholderCellSlot>
		));
	};

	const renderPlaceholderRow = (rowIndex: number, virtualSlot: { style?: CSSProperties }): ReactNode => {
		const inlineStyle = virtualSlot.style;

		if (hasConsumerPlaceholderRow) {
			return (
				<PlaceholderRowSlot
					key={`placeholder-${rowIndex}`}
					rowIndex={rowIndex}
					columnCount={leafColumns.length}
					style={inlineStyle}
				/>
			);
		}

		// Not routed through the `placeholderRow` slot: that slot's default is the
		// empty-state row, not the windowed loading row (a set `columnCount` selects the
		// empty-state variant). Each layout's own loading placeholder is used instead —
		// and the card one takes no `aria-rowindex`, a list having no row numbering.
		if (cardView) {
			return (
				<DataTableCardPlaceholderTpl key={`placeholder-${rowIndex}`} virtualStyle={inlineStyle}>
					{renderPlaceholderCells(rowIndex)}
				</DataTableCardPlaceholderTpl>
			);
		}

		return (
			<DataTablePlaceholderRowTpl
				key={`placeholder-${rowIndex}`}
				virtualStyle={inlineStyle}
				ariaRowIndex={model.bodyAriaRowIndex(rowIndex)}
			>
				{renderPlaceholderCells(rowIndex)}
			</DataTablePlaceholderRowTpl>
		);
	};

	// The two body branches below deliberately bypass the `body` slot (see their
	// comments), so they name the active layout's body container directly.
	const PlainBodyTpl = cardView ? DataTableCardListTpl : DataTableBodyTpl;

	let bodyElement: ReactNode;

	// The windowed branches below render only the virtualizer's items, which are
	// empty when there is nothing to window — so an empty dataset (e.g. a
	// filtered-out table, or infinite scroll with `rowCount: 0`) would show a bare
	// header with no "No data" placeholder. Short-circuit to the plain body, which
	// renders the empty-state placeholder row, exactly as the non-virtualized table does.
	const effectiveRowCount = isInfiniteScrollMode ? (infiniteScrollOptions?.rowCount ?? 0) : data.length;

	if (isVirtualizedMode && effectiveRowCount === 0) {
		bodyElement = <PlainBodyTpl>{bodyChildren}</PlainBodyTpl>;
	} else if (isInfiniteScrollMode && infiniteScrollOptions) {
		const InfiniteScrollBodySlot = slots.infiniteScrollBody;

		bodyElement = (
			<InfiniteScrollBodySlot
				options={infiniteScrollOptions}
				scrollElementRef={model.viewportRef}
				rowKeyFor={model.rowKeyForIndex}
				scrollToNode={scrollToNode}
				getRowElement={model.getRowElement}
				colSpan={leafColumns.length}
				renderRow={(slot: DataTableInfiniteScrollSlot): ReactNode => {
					const row = data[slot.index];

					if (!slot.loaded || row === undefined) {
						return renderPlaceholderRow(slot.index, { style: slot.style });
					}

					return renderBodyRow(row, slot.index, { style: slot.style, key: slot.key });
				}}
			/>
		);
	} else if (isVirtualizedMode && resolvedVirtualScrollOptions) {
		const {
			rowHeight: virtualRowHeight,
			estimatedRowHeight,
			overscan,
			overscanRowCount,
			virtualizerRef
		} = resolvedVirtualScrollOptions;
		// A table-level `rowHeight` pins the real layout, so it is also the virtualizer's fixed
		// size unless the virtual options name one — otherwise the spacers would be computed
		// from a different height than the rows actually render at.
		const effectiveRowHeight = virtualRowHeight ?? rowHeight;
		const VirtualizedBodySlot = slots.virtualizedBody;

		bodyElement = (
			<VirtualizedBodySlot
				rowCount={data.length}
				rowHeight={effectiveRowHeight}
				estimatedRowHeight={estimatedRowHeight}
				overscan={overscan ?? overscanRowCount}
				scrollElementRef={model.viewportRef}
				rowKeyFor={model.rowKeyForIndex}
				scrollToNode={scrollToNode}
				getRowElement={model.getRowElement}
				virtualizerRef={virtualizerRef}
				colSpan={leafColumns.length}
				renderRow={(slot: DataTableVirtualizedRowSlot): ReactNode => {
					const row = data[slot.index];

					if (row === undefined) {
						return null;
					}

					return renderBodyRow(row, slot.index, {
						style: slot.style,
						key: slot.key,
						measureRef: slot.measureRef,
						// Dynamic-height virtualization (no fixed row height) measures each
						// row together with its expansion panel, so expansion can render in
						// the window; fixed-height mode keeps it suppressed.
						renderExpansion: effectiveRowHeight === undefined
					});
				}}
			/>
		);
	} else if (enableDragDrop) {
		// Deliberate `body`-slot bypass (dev-warned above): DnD owns the <tbody> — the
		// row-shift preview and gap hit-testing assume the plain template tbody with one
		// <tr> per data row in data order, which a consumer body slot could break silently.
		bodyElement = <PlainBodyTpl>{bodyChildren}</PlainBodyTpl>;
	} else {
		const BodySlot = slots.body;

		// In this branch rows are all present (sparse `data` only occurs in the
		// windowed branches above), so the cast to `RowType[]` is safe.
		bodyElement = (
			<BodySlot data={data as RowType[]} columns={leafColumns}>
				{bodyChildren}
			</BodySlot>
		);
	}

	let footElement: ReactNode = null;

	// Card view renders no footer, matching the production `Table` (whose `FootTpl`
	// returns nothing in card view outright). A summary row only reads as a summary
	// against aligned columns; trailing a card stack it is just another card. Decided
	// here beside `showHeader` rather than inside a template, so the card foot slots
	// simply never render — same as the head slots.
	if (showFooter && !cardView) {
		const FootSlot = slots.foot;
		const FootRowSlot = slots.footRow;
		const FootCellSlot = slots.footCell;
		const FootContentSlot = slots.footContent;
		const footCells = leafColumns.map((column, columnIndex) => {
			// Footer content precedence: column-level `renderFooter` → the
			// `footContent` slot (whose default renders nothing).
			const renderFooter = getColumnRender(column, "renderFooter");
			const innerFooterContent = renderFooter ? (
				renderFooter({ column, columnIndex })
			) : (
				<FootContentSlot column={column} columnIndex={columnIndex} />
			);

			return (
				<FootCellSlot key={columnIndex} column={column} columnIndex={columnIndex} pinning={leafPinning[columnIndex]}>
					{innerFooterContent}
				</FootCellSlot>
			);
		});

		footElement = (
			<FootSlot>
				<FootRowSlot>{footCells}</FootRowSlot>
			</FootSlot>
		);
	}

	const DragPreviewSlot = slots.dragPreview;
	// Only the table the drag started in renders the floating preview; other
	// tables monitoring the same `acceptType` merely open their drop targets.
	const dragPreviewElement =
		enableDragDrop && activeDrag?.isLocalSource && data.length > 0 ? <DragPreviewSlot activeDrag={activeDrag} /> : null;

	const ContextMenuSlot = slots.contextMenu;
	const HeadContextMenuSlot = slots.headContextMenu;

	// The model owns its own contribution (`model.contextFields`, memoized there against
	// its local inputs); the view adds only the two it owns. Keeping the composition this
	// shallow is the point — this used to restate all 26 fields with a hand-mirrored
	// dependency array, so every field added to the context had to be remembered twice.
	const dataTableContextValue = useMemo<DataTableContextType<RowType>>(
		() => ({
			...model.contextFields,
			slots,
			dragDropOptions: stableDragDropOptions
		}),
		[model.contextFields, slots, stableDragDropOptions]
	);

	// One of two root templates, never a blend of the two. The card root has no
	// `<colgroup>`, no `aria-rowcount` and no `rowHeight` / pinning / cross-tabulation
	// inputs, because a card list has no column geometry and no fixed row height to
	// carry them — see `BaseDataTableProps.cardView` for the full support matrix.
	const layoutElement = cardView ? (
		<DataTableCardsTpl
			viewportRef={model.setViewportRef}
			rootRef={model.setTableRef}
			onBlur={onBlur}
			id={id}
			dataRole={dataRole}
			className={className}
			style={style}
			domProps={domProps as HTMLProps<HTMLElement> | undefined}
			ariaLabel={ariaLabel}
			ariaLabelledby={ariaLabelledby}
			ariaHidden={ariaHidden}
			maxHeight={maxHeight}
		>
			{bodyElement}
			{footElement}
		</DataTableCardsTpl>
	) : (
		<DataTableTpl
			viewportRef={model.setViewportRef}
			tableRef={model.setTableRef}
			onBlur={onBlur}
			id={id}
			dataRole={dataRole}
			className={className}
			style={style}
			domProps={domProps}
			ariaLabelledby={ariaLabelledby}
			ariaHidden={ariaHidden}
			maxHeight={maxHeight}
			rowHeight={appliedRowHeight}
			colWidths={model.colWidths}
			minWidth={model.minTableWidth}
			highlight={!!cellHighlighting}
			virtualized={isVirtualizedMode}
			crossTabulation={crossTabulation}
			role={gridRole}
			ariaLabel={ariaLabel}
			ariaRowCount={isVirtualizedMode ? model.ariaRowCount : undefined}
		>
			{headElement}
			{bodyElement}
			{footElement}
		</DataTableTpl>
	);

	return (
		<>
			<DataTableContextProvider value={dataTableContextValue}>
				{layoutElement}
				{/* Must stay inside the provider: the dragged item reaches the preview as
				    the `activeDrag` prop, but a custom `dragPreview` slot may still read
				    shared state (slots, pinning, …) via `useDataTableContext()`. */}
				{dragPreviewElement}
			</DataTableContextProvider>
			{contextMenuState?.type === "body" && ContextMenuSlot && (
				<DataTableContextMenuTpl position={contextMenuState.position} closeHandler={closeContextMenu}>
					<ContextMenuSlot
						row={contextMenuState.row}
						rowIndex={contextMenuState.rowIndex}
						closeHandler={closeContextMenu}
					/>
				</DataTableContextMenuTpl>
			)}
			{contextMenuState?.type === "head" && HeadContextMenuSlot && (
				<DataTableContextMenuTpl position={contextMenuState.position} closeHandler={closeContextMenu}>
					<HeadContextMenuSlot
						column={contextMenuState.column}
						columnIndex={contextMenuState.columnIndex}
						closeHandler={closeContextMenu}
					/>
				</DataTableContextMenuTpl>
			)}
			<DataTableLiveRegion ref={sortLiveRegionRef} dataRole={DataRoles.Table.A11yLiveRegion} />
		</>
	);
}

/** Imperative handle a {@link DataTableLiveRegion} exposes to its host. */
interface DataTableLiveRegionHandle {
	/** Replace the live region's spoken text. */
	announce: (message: string) => void;
}

/**
 * Visually-hidden style for the live region (clip-path technique, never
 * `display:none` — screen readers must still announce it).
 */
const LIVE_REGION_STYLE: CSSProperties = {
	position: "absolute",
	width: 1,
	height: 1,
	margin: -1,
	padding: 0,
	overflow: "hidden",
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	whiteSpace: "nowrap",
	border: 0,
	top: 0,
	left: 0
};

/**
 * Visually-hidden polite live region whose text is driven imperatively through a
 * ref (see {@link DataTableLiveRegionHandle}) rather than a prop. Announcing a
 * message re-renders only this span — not the host `<DataTable>`, whose body
 * would otherwise reconcile every row on each announcement.
 */
const DataTableLiveRegion = forwardRef(function DataTableLiveRegion(
	{ dataRole }: { dataRole: string },
	ref: Ref<DataTableLiveRegionHandle>
): ReactElement {
	const [message, setMessage] = useState("");

	useImperativeHandle(
		ref,
		() => ({
			announce: (next: string): void => {
				// Identical consecutive messages must still be re-spoken (e.g. a keyboard drag
				// clamped at the table edge repeats the same position text). Identical state is
				// a bailed-out no-op, so alternate an unspoken zero-width space to force the
				// DOM text — and thus the screen-reader announcement — to change.
				setMessage((previous) => (next !== "" && previous === next ? `${next}\u200B` : next));
			}
		}),
		[]
	);

	return (
		<span data-role={dataRole} role="status" aria-live="polite" style={LIVE_REGION_STYLE}>
			{message}
		</span>
	);
});

DataTableLiveRegion.displayName = "DataTableLiveRegion";

DataTable.displayName = "DataTable";

/*
 * Self-wiring primitives, attached as a compound namespace so slot
 * implementations can compose `<DataTable.Head>`, `<DataTable.Row>`, … — each
 * sources its framework behavior from the table's context.
 */
DataTable.Head = DataTableHead;
DataTable.HeadRow = DataTableHeadRow;
DataTable.HeadCell = DataTableHeadCell;
DataTable.HeadCellGroup = DataTableHeadCellGroup;
DataTable.HeadContent = DataTableHeadContent;
DataTable.FilterRow = DataTableFilterRow;
DataTable.FilterCell = DataTableFilterCell;
DataTable.FilterContent = DataTableFilterContent;
DataTable.Body = DataTableBody;
DataTable.Row = DataTableRow;
DataTable.Cell = DataTableCell;
DataTable.CellContent = DataTableCellContent;
DataTable.PlaceholderRow = DataTablePlaceholderRow;
DataTable.PlaceholderCell = DataTablePlaceholderCell;
DataTable.PlaceholderContent = DataTablePlaceholderContent;
DataTable.Foot = DataTableFoot;
DataTable.FootRow = DataTableFootRow;
DataTable.FootCell = DataTableFootCell;
DataTable.FootContent = DataTableFootContent;
DataTable.RowGroupHeader = DataTableRowGroupHeader;

/** Windowing hooks a body row receives when rendered by a virtualized/infinite body. */
interface DataTableBodyRowVirtualSlot {
	style?: CSSProperties;
	key?: Key;
	measureRef?: RefCallback<HTMLElement>;
	renderExpansion?: boolean;
}

/**
 * Everything a body row needs that is *not* per-row (slots, columns, resolved
 * flags, and the identity-stable model callbacks it invokes internally). Built
 * once per `<DataTable>` render and memoized, so the memoized {@link DataTableBodyRow}
 * shallow-compares a single stable prop instead of a dozen.
 */
interface DataTableRowRenderContext<RowType, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>> {
	/**
	 * The current row data. Not read when building a row — it is here so the row
	 * memo invalidates whenever the data set's identity changes, the coarse signal
	 * that any row's rendered content may differ. This matters for wrappers whose
	 * cell renderers read mutable per-row state through a ref (the tree table's
	 * expand/loading meta): they update only when the row actually re-renders, and
	 * every such change flows through a new `data` array. Interaction-only ticks
	 * (drag start/end, context-menu, announcements) keep `data` stable, so the
	 * memoized rows still bail out of those.
	 */
	data: readonly (RowType | undefined)[];
	dispatchRowClick: (row: RowType, rowIndex: number, event: MouseEvent<HTMLElement>) => void;
	dispatchRowContextMenu: (row: RowType, rowIndex: number, event: MouseEvent<HTMLElement>) => void;
	slots: ResolvedDataTableSlots<RowType, ColumnType>;
	leafColumns: BaseColumnType<RowType>[];
	disabled?: boolean;
	cellStyling?: DataTableProps<RowType>["cellStyling"];
	leafPinning: readonly (("left" | "right") | undefined)[];
	hasConsumerCellContent: boolean;
	rowRefs: { current: (HTMLElement | null)[] };
	resolveExpansion: (row: RowType, rowIndex: number) => ReactNode;
	hasExpansion: boolean;
	isVirtualizedMode: boolean;
	bodyAriaRowIndex: (rowIndex: number) => number;
	rowKey?: DataTableProps<RowType>["rowKey"];
	enableDragDrop: boolean;
}

/**
 * Builds one body row: its cells (respecting `renderCell` / `cellContent` /
 * `cellSpan`), the row `<tr>` via the row slot, and the DnD / inline-expansion
 * wrapping. Lives at module scope, fed by a {@link DataTableRowRenderContext}, so
 * the work runs inside the memoized {@link DataTableBodyRow} boundary rather than
 * eagerly in the orchestrator's render.
 */
function renderDataTableBodyRow<RowType>(
	renderContext: DataTableRowRenderContext<RowType>,
	row: RowType,
	rowIndex: number,
	rowState: DataTableRowState,
	virtualSlot?: DataTableBodyRowVirtualSlot
): ReactNode {
	const {
		dispatchRowClick,
		dispatchRowContextMenu,
		slots,
		leafColumns,
		disabled,
		cellStyling,
		leafPinning,
		hasConsumerCellContent,
		rowRefs,
		resolveExpansion,
		hasExpansion,
		isVirtualizedMode,
		bodyAriaRowIndex,
		rowKey,
		enableDragDrop
	} = renderContext;

	const { rowDisabled, highlightVariant: rowHighlightVariant } = rowState;

	// Built per row render, not compared: the row's memo keys off the
	// `hasRowClick` / `hasRowContextMenu` booleans, and the dispatchers re-read the
	// consumer's getter per event, so these closures cannot go stale.
	const onClick = rowState.hasRowClick
		? (event: MouseEvent<HTMLElement>): void => dispatchRowClick(row, rowIndex, event)
		: undefined;
	const onContextMenu = rowState.hasRowContextMenu
		? (event: MouseEvent<HTMLElement>): void => dispatchRowContextMenu(row, rowIndex, event)
		: undefined;

	const CellSlot = slots.cell;
	const CellContentSlot = slots.cellContent;

	// Explicit cursor loop (not a 1:1 `map`): a column's `cellSpan` hook can
	// merge its cell rightward (native `colSpan`), and covered columns emit no
	// `<td>`. Descriptors are collected first so the whole-row `rowHasColSpan`
	// flag is known before any cell renders — it drives the `data-col-index`
	// the highlighting listener needs once DOM position ≠ leaf-column index.
	type BodyCellDescriptor = {
		column: (typeof leafColumns)[number];
		columnIndex: number;
		horizontal: "left" | "center" | "right";
		vertical: "top" | "middle" | "bottom";
		defaultContent: ReturnType<typeof getCellContent>;
		innerContent: ReactNode;
		cellStyles?: CellStyles;
		pinning?: "left" | "right";
		subInfoResolved: boolean;
		colSpan: number;
	};
	const cellDescriptors: BodyCellDescriptor[] = [];
	let rowHasColSpan = false;

	for (let columnIndex = 0; columnIndex < leafColumns.length;) {
		const column = leafColumns[columnIndex];
		const horizontal =
			column.specificHorizontalAlignment?.body ?? column.horizontalAlignment ?? DEFAULT_BODY_ALIGNMENT.horizontal;
		const vertical =
			column.specificVerticalAlignment?.body ?? column.verticalAlignment ?? DEFAULT_BODY_ALIGNMENT.vertical;
		const defaultContent = getCellContent(column, row, rowIndex);

		// Content precedence: column `renderCell` → consumer `cellContent` slot
		// → resolved value. The default content slot is skipped (it only echoes).
		const renderCell = getColumnRender(column, "renderCell");
		const innerContent = renderCell ? (
			renderCell({ row, rowIndex, column, columnIndex, value: defaultContent })
		) : hasConsumerCellContent ? (
			<CellContentSlot
				row={row}
				rowIndex={rowIndex}
				column={column}
				columnIndex={columnIndex}
				defaultContent={defaultContent}
			/>
		) : (
			defaultContent
		);

		const cellStyles: CellStyles | undefined =
			!disabled && cellStyling ? cellStyling({ row, rowIndex, column }) : undefined;
		const pinning = leafPinning[columnIndex];
		const subInfoResolved = !!column.subInfo || !!cellStyles?.useSecondaryColor;

		// Clamp the span: never beyond the remaining leaf columns, and never
		// across a pinning-side boundary (every covered column must share the
		// origin's `leafPinning`). Gated on `!disabled`, like `cellStyling`.
		let colSpan = 1;

		if (!disabled) {
			const requested = getColumnCellSpan(column)?.({
				row,
				rowIndex,
				column,
				columnIndex,
				value: defaultContent
			})?.colSpan;

			if (typeof requested === "number" && Number.isFinite(requested) && requested > 1) {
				const maxSpan = Math.min(Math.floor(requested), leafColumns.length - columnIndex);
				let allowed = 1;

				while (allowed < maxSpan && leafPinning[columnIndex + allowed] === pinning) {
					allowed += 1;
				}

				colSpan = allowed;
			}
		}

		if (colSpan > 1) {
			rowHasColSpan = true;
		}

		cellDescriptors.push({
			column,
			columnIndex,
			horizontal,
			vertical,
			defaultContent,
			innerContent,
			cellStyles,
			pinning,
			subInfoResolved,
			colSpan
		});

		columnIndex += colSpan;
	}

	// The cell primitive self-sources its framework-owned per-cell state from
	// context, keeping it off the public Cell slot prop surface.
	const cells = cellDescriptors.map((descriptor) => (
		<CellSlot
			key={descriptor.columnIndex}
			row={row}
			rowIndex={rowIndex}
			column={descriptor.column}
			columnIndex={descriptor.columnIndex}
			pinning={descriptor.pinning}
			colSpan={descriptor.colSpan > 1 ? descriptor.colSpan : undefined}
			rowHasColSpan={rowHasColSpan}
			horizontalAlignment={descriptor.horizontal}
			verticalAlignment={descriptor.vertical}
			cellStyles={descriptor.cellStyles}
			subInfo={descriptor.subInfoResolved}
			rowDisabled={rowDisabled}
			rowHighlightVariant={rowHighlightVariant}
			defaultContent={descriptor.defaultContent}
		>
			{descriptor.innerContent}
		</CellSlot>
	));

	const setRowRef = (el: HTMLTableRowElement | null): void => {
		rowRefs.current[rowIndex] = el;
	};

	const additionalContent = resolveExpansion(row, rowIndex);
	const hasAdditionalContent = additionalContent != null;
	// Expansion renders inline in the plain body always, and in the windowed
	// (virtualized) body only in dynamic-height mode — where the virtualizer
	// measures each row together with its expansion sibling as a single item (see
	// `measureRowWithExpansion`). In fixed-`rowHeight` mode rows are never measured,
	// so an unmeasured panel would desync the spacer math; it stays suppressed there.
	const renderExpansionInline = hasAdditionalContent && (!virtualSlot || virtualSlot.renderExpansion === true);

	const virtualStyle: CSSProperties | undefined = virtualSlot?.style;
	const rowAriaExpanded = hasExpansion ? hasAdditionalContent : undefined;
	const resolvedRowKey = rowKeyFor(row, rowIndex, rowKey);

	const RowSlot = slots.row;

	const renderRowElement = (extraRowProps?: {
		dragRef?: (node: HTMLTableRowElement | null) => void;
		onMouseOver?: MouseEventHandler<HTMLElement>;
	}): ReactNode => (
		<RowSlot
			key={virtualSlot?.key ?? resolvedRowKey}
			row={row}
			rowIndex={rowIndex}
			columns={leafColumns}
			styles={rowState.styles}
			disabled={rowDisabled}
			hasAdditionalContent={hasAdditionalContent}
			selected={rowState.selected}
			highlighted={rowState.highlighted}
			highlightVariant={rowHighlightVariant}
			interactive={rowState.interactive}
			ariaExpanded={rowAriaExpanded}
			ariaRowIndex={isVirtualizedMode ? bodyAriaRowIndex(rowIndex) : undefined}
			virtualStyle={virtualStyle}
			onClick={onClick}
			onContextMenu={onContextMenu}
			onMouseOver={extraRowProps?.onMouseOver}
			forwardedRef={(node: HTMLTableRowElement | null): void => {
				setRowRef(node);
				extraRowProps?.dragRef?.(node);
				virtualSlot?.measureRef?.(node);
			}}
		>
			{cells}
		</RowSlot>
	);

	if (enableDragDrop) {
		const DndRowSlot = slots.dndRow;

		return (
			<DndRowSlot
				key={virtualSlot?.key ?? resolvedRowKey}
				row={row}
				rowIndex={rowIndex}
				columns={leafColumns}
				styles={rowState.styles}
				disabled={rowDisabled}
				hasAdditionalContent={hasAdditionalContent}
			>
				{({
					dragRef,
					onMouseOver
				}: {
					dragRef: RefCallback<HTMLTableRowElement | null>;
					onMouseOver: MouseEventHandler<HTMLElement>;
				}) => (
					<>
						{renderRowElement({ dragRef, onMouseOver })}
						{renderExpansionInline && additionalContent}
					</>
				)}
			</DndRowSlot>
		);
	}

	const rowElement = renderRowElement();

	return (
		<Fragment key={virtualSlot?.key ?? resolvedRowKey}>
			{rowElement}
			{renderExpansionInline && additionalContent}
		</Fragment>
	);
}

/**
 * Props of the memoized body row: the stable {@link DataTableRowRenderContext} plus
 * this row's {@link DataTableRowState} flattened into individual values, so the
 * comparison below is per-field rather than per-object.
 */
type DataTableBodyRowProps<RowType> = {
	renderContext: DataTableRowRenderContext<RowType>;
	row: RowType;
	rowIndex: number;
	virtualSlot?: DataTableBodyRowVirtualSlot;
} & Omit<DataTableRowState, "styles"> & { rowStyles?: DataTableRowState["styles"] };

/**
 * Memoized body-row boundary. Builds its row via {@link renderDataTableBodyRow}
 * from a stable {@link DataTableRowRenderContext}, so a `<DataTable>` re-render that
 * does not touch a given row — a drag start/end or context-menu toggle — skips
 * rebuilding that row's cells. In the windowed paths `virtualSlot` is a fresh
 * object each render, so those (few, visible) rows re-render as before.
 *
 * The per-row state arrives as flattened values rather than one object so that a
 * `rowStyling` change re-renders only the rows it actually moved: a table where
 * clicking a row selects it re-renders the deselected and the selected row, not
 * all of them.
 */
function DataTableBodyRowInner<RowType>({
	renderContext,
	row,
	rowIndex,
	virtualSlot,
	rowStyles,
	...rowState
}: DataTableBodyRowProps<RowType>): ReactNode {
	return renderDataTableBodyRow(renderContext, row, rowIndex, { ...rowState, styles: rowStyles }, virtualSlot);
}

/**
 * Shallow prop comparison, extended one level into `rowStyles`.
 *
 * `rowStyling` returns a fresh result object per call, so its `className` /
 * `style` / `title` projection is a new reference on every render even when
 * nothing changed — comparing it by identity would defeat the whole point for
 * every consumer that returns any of the three. `styles` is `undefined` unless
 * one was actually supplied, so the common case never reaches the inner loop.
 */
function areDataTableBodyRowPropsEqual<RowType>(
	previous: DataTableBodyRowProps<RowType>,
	next: DataTableBodyRowProps<RowType>
): boolean {
	const keys = Object.keys(next) as (keyof DataTableBodyRowProps<RowType>)[];

	if (keys.length !== Object.keys(previous).length) {
		return false;
	}

	for (const key of keys) {
		if (key === "rowStyles") {
			if (!areRowStylesEqual(previous.rowStyles, next.rowStyles)) {
				return false;
			}
		} else if (previous[key] !== next[key]) {
			return false;
		}
	}

	return true;
}

function areRowStylesEqual(previous: DataTableRowState["styles"], next: DataTableRowState["styles"]): boolean {
	if (previous === next) {
		return true;
	}

	if (!previous || !next) {
		return false;
	}

	if (previous.className !== next.className || previous.title !== next.title) {
		return false;
	}

	const previousStyle = previous.style as CSSProperties | undefined;
	const nextStyle = next.style as CSSProperties | undefined;

	if (previousStyle === nextStyle) {
		return true;
	}

	if (!previousStyle || !nextStyle) {
		return false;
	}

	const styleKeys = Object.keys(nextStyle) as (keyof CSSProperties)[];

	return (
		styleKeys.length === Object.keys(previousStyle).length &&
		styleKeys.every((key) => previousStyle[key] === nextStyle[key])
	);
}

const DataTableBodyRow = memo(DataTableBodyRowInner, areDataTableBodyRowPropsEqual) as typeof DataTableBodyRowInner;
