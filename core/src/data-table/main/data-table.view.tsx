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

import type { CSSProperties, Key, MouseEventHandler, ReactElement, ReactNode, RefCallback } from "react";
import { Fragment, useMemo } from "react";

import { DataRoles } from "../../common/main/data-roles.js";

import type { BaseColumnType } from "./foundation/column.api.js";
import type { CellStyles } from "./foundation/table.api.js";
import { getColumnCellSpan, getColumnRender, type DataTableHeaderCell } from "./columns.js";
import { getColumnId, getColumnSortOrder } from "./data-table.sort.js";
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
import type { DataTableProps } from "./data-table.api.js";
import { DataTableContextProvider, type DataTableContextType } from "./data-table.context.js";
import { useDataTableDndMonitor } from "./data-table.dnd.js";
import type { DataTableInfiniteScrollSlot } from "./data-table.infinite-scroll-body.view.js";
import { useDataTableSlots } from "./data-table.slots.js";
import { useDataTableModel } from "./use-data-table-model.js";
import { DataTableBodyTpl } from "./template/data-table.body.tpl.view.js";
import { DataTableContextMenuTpl } from "./template/data-table.context-menu.tpl.view.js";
import { DataTableHeadGroupRowTpl } from "./template/data-table.head-group-row.tpl.view.js";
import { DataTablePlaceholderRowTpl } from "./template/data-table.placeholder-row.tpl.view.js";
import { DataTableTpl } from "./template/data-table.tpl.view.js";
import {
	DEFAULT_BODY_ALIGNMENT,
	DEFAULT_HEAD_ALIGNMENT,
	getCellContent,
	rowKeyFor,
	toAriaSort
} from "./data-table.utils.js";
import type { DataTableVirtualizedRowSlot } from "./data-table.virtualized-body.view.js";

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

	const { slots, hasConsumerSlot } = useDataTableSlots<RowType>(props.slots);

	const model = useDataTableModel<RowType>(props, {
		hasConsumerSlot,
		hasContextMenu: !!slots.contextMenu
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
		activeDrag
	} = model;

	// Tracks any compatible drag (including ones started in another DataTable
	// with the same `acceptType`) into `model.activeDrag`.
	useDataTableDndMonitor<RowType>({
		dragDropOptions,
		tableRef: model.tableRef,
		viewportEl: model.viewportEl,
		setActiveDrag: model.setActiveDrag
	});

	const hasConsumerHeadContent = hasConsumerSlot("headContent");
	const hasConsumerCellContent = hasConsumerSlot("cellContent");

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

	let headRowElement: ReactNode;
	const HeadRowSlot = slots.headRow;

	if (headerDepth === 1) {
		headRowElement = <HeadRowSlot>{cellsByRow[0]?.map(renderHeadCell) ?? []}</HeadRowSlot>;
	} else {
		headRowElement = cellsByRow.map((rowCells, rowIdx) => (
			<DataTableHeadGroupRowTpl key={rowIdx} ariaRowIndex={isVirtualizedMode ? rowIdx + 1 : undefined}>
				{rowCells.map(renderHeadCell)}
			</DataTableHeadGroupRowTpl>
		));
	}

	let filterRowElement: ReactNode = null;

	if (hasFilterRow) {
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
	const headElement = hideHeader ? null : (
		<HeadSlot>
			{headRowElement}
			{filterRowElement}
		</HeadSlot>
	);

	const renderBodyRow = (
		row: RowType,
		rowIndex: number,
		virtualSlot?: { style?: CSSProperties; key?: Key; measureRef?: RefCallback<HTMLElement> }
	): ReactNode => {
		const rowState = model.resolveRowState(row, rowIndex);
		const { rowDisabled, highlightVariant: rowHighlightVariant } = rowState;

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

		for (let columnIndex = 0; columnIndex < leafColumns.length; ) {
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
				ariaRowIndex={isVirtualizedMode ? model.bodyAriaRowIndex(rowIndex) : undefined}
				virtualStyle={virtualStyle}
				onClick={rowState.onClick}
				onContextMenu={rowState.onContextMenu}
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

		if (enableDragDrop && dragDropOptions) {
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
							{/* Row expansion stays off the windowed path: its unmeasured
							    height would desync the virtualizer's spacer math. */}
							{hasAdditionalContent && !virtualSlot && additionalContent}
						</>
					)}
				</DndRowSlot>
			);
		}

		const rowElement = renderRowElement();

		if (hasAdditionalContent && !virtualSlot) {
			return (
				<Fragment key={resolvedRowKey}>
					{rowElement}
					{additionalContent}
				</Fragment>
			);
		}

		return rowElement;
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

	let bodyElement: ReactNode;

	if (isInfiniteScrollMode && infiniteScrollOptions) {
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
		const { rowHeight, estimatedRowHeight, overscan, overscanRowCount, virtualizerRef } = resolvedVirtualScrollOptions;
		const VirtualizedBodySlot = slots.virtualizedBody;

		bodyElement = (
			<VirtualizedBodySlot
				rowCount={data.length}
				rowHeight={rowHeight}
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

					return renderBodyRow(row, slot.index, { style: slot.style, key: slot.key, measureRef: slot.measureRef });
				}}
			/>
		);
	} else if (enableDragDrop) {
		bodyElement = <DataTableBodyTpl>{bodyChildren}</DataTableBodyTpl>;
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

	if (showFooter) {
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
		enableDragDrop && activeDrag?.isLocalSource && data.length > 0 ? <DragPreviewSlot /> : null;

	const ContextMenuSlot = slots.contextMenu;
	const HeadContextMenuSlot = slots.headContextMenu;

	const dataTableContextValue = useMemo<DataTableContextType<RowType>>(
		() => ({
			disabled,
			cardView,
			gridRole: cardView ? undefined : gridRole,
			crossTabulation,
			cellHighlighting: !!cellHighlighting && !cardView,
			headerDepth,
			isVirtualizedMode,
			footerAriaRowIndex: model.footerAriaRowIndex,
			leafPinning,
			leafPinOffsets: model.leafPinOffsets,
			leafPinningEdge: model.leafPinningEdge,
			actionColumnFallbackLabel: model.actionColumnFallbackLabel,
			isResizable: model.isResizable,
			resizeHandleProps: model.resizeHandleProps,
			isRowFocused: model.isRowFocused,
			onRowFocusChange: model.onRowFocusChange,
			arrowNavActive: model.arrowNavActive,
			groupRightBoundaries: model.groupRightBoundaries,
			leavesInGroup: model.leavesInGroup,
			slots,
			sortState,
			onSort: model.handleSort,
			openHeadContextMenu: model.openHeadContextMenu,
			dragDropOptions,
			activeDrag: model.activeDrag,
			rowCount: data.length
		}),
		[
			disabled,
			cardView,
			gridRole,
			crossTabulation,
			cellHighlighting,
			headerDepth,
			isVirtualizedMode,
			model.footerAriaRowIndex,
			leafPinning,
			model.leafPinOffsets,
			model.leafPinningEdge,
			model.actionColumnFallbackLabel,
			model.isResizable,
			model.resizeHandleProps,
			model.isRowFocused,
			model.onRowFocusChange,
			model.arrowNavActive,
			model.groupRightBoundaries,
			model.leavesInGroup,
			slots,
			sortState,
			model.handleSort,
			model.openHeadContextMenu,
			dragDropOptions,
			model.activeDrag,
			data.length
		]
	);

	return (
		<>
			<DataTableContextProvider value={dataTableContextValue}>
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
					colWidths={model.colWidths}
					minWidth={model.minTableWidth}
					cardView={!!cardView}
					highlight={!!cellHighlighting && !cardView}
					virtualized={isVirtualizedMode}
					crossTabulation={crossTabulation}
					role={cardView ? "list" : gridRole}
					ariaLabel={ariaLabel}
					ariaRowCount={isVirtualizedMode ? model.ariaRowCount : undefined}
				>
					{headElement}
					{bodyElement}
					{footElement}
				</DataTableTpl>
				{/* Must stay inside the provider: the default preview reads the
				    dragged item from `DataTableContextType.activeDrag`. */}
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
			<span
				data-role={DataRoles.Table.A11yLiveRegion}
				role="status"
				aria-live="polite"
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "1px",
					height: "1px",
					padding: 0,
					margin: "-1px",
					overflow: "hidden",
					clip: "rect(0, 0, 0, 0)",
					whiteSpace: "nowrap",
					border: 0
				}}
			>
				{model.sortAnnouncement}
			</span>
		</>
	);
}

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
