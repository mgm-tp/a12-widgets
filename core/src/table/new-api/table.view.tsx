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

import type { ReactElement } from "react";
import { useState, useMemo, memo } from "react";

import { joinClassNames } from "../../common/main/utils.js";

import { TableTemplate } from "../main/template/index.js";
import { BASE_TABLE_CLASSNAME } from "../main/table.internal.js";

import type { TableContextType, TableProps, VirtualScrollOptions } from "./table.api.js";
import type { BaseColumnType } from "./column.api.js";
import type { TableComponentRenderers, TableScrollToNodeHandler } from "./table-renderer.api.js";
import type { InfiniteScrollOptions } from "./infinite-scroll.api.js";
import { TableInternalUtils, flattenAllColumns, hasColumnGroup } from "./table.utils.js";
import { TableContextProvider, CellHighlightingTableContextProvider, useTableContext } from "./table.context.js";
import { Head } from "./table.head.view.js";
import { HeadRow } from "./table.head-row.view.js";
import { HeadCell } from "./table.head-cell.view.js";
import { HeadCellGroup } from "./table.head-cell-group.view.js";
import { HeadContent } from "./table.head-content.view.js";
import { Body } from "./table.body.view.js";
import { InfiniteScrollBody } from "./table.infinite-scroll-body.view.js";
import { VirtualizedBody } from "./table.virtualized-body.view.js";
import { BodyRow } from "./table.body-row.view.js";
import { BodyCell } from "./table.body-cell.view.js";
import { BodyContent } from "./table.body-content.view.js";
import { PlaceHolderBodyRow } from "./table.place-holder-row.view.js";
import { Foot } from "./table.foot.view.js";
import { FootRow } from "./table.foot-row.view.js";
import { FootCell } from "./table.foot-cell.view.js";
import { FootContent } from "./table.foot-content.view.js";
import { HeadFilterRow } from "./table.head-filter-row.view.js";
import { HeadFilterCell } from "./table.head-filter-cell.view.js";
import { HeadFilterContent } from "./table.head-filter-content.view.js";
import { DnDTable } from "./table.dnd.view.js";
import { PlaceHolderBodyCell } from "./table.place-holder-body-cell.view.js";
import { PlaceHolderBodyContent } from "./table.place-holder-body-content.view.js";
import { RowGroupHeader } from "./table.row-group-header.view.js";
import { TableRowScroller } from "./table.row-scroller.js";

export const DefaultTableComponentRenderers: TableComponentRenderers<any> = {
	headRenderer: (params) => <Head {...params} />,
	headRowRenderer: (params) => <HeadRow {...params} />,
	headCellRenderer: ({ key, ...params }) => <HeadCell key={key} {...params} />,
	headCellGroupRenderer: ({ key, ...params }) => <HeadCellGroup key={key} {...params} />,
	headContentRenderer: (params) => <HeadContent {...params} />,
	bodyRenderer: (params) => <Body {...params} />,
	infiniteScrollBodyRenderer: (params) => <InfiniteScrollBody {...params} />,
	virtualizedBodyRenderer: (params) => <VirtualizedBody {...params} />,
	bodyRowRenderer: ({ key, ...params }) => <BodyRow key={key} {...params} />,
	bodyCellRenderer: ({ key, ...params }) => <BodyCell key={key} {...params} />,
	bodyContentRenderer: (params) => <BodyContent {...params} />,
	placeHolderBodyRowRenderer: ({ key, ...params }) => <PlaceHolderBodyRow key={key} {...params} />,
	placeHolderBodyCellRenderer: ({ key, ...params }) => <PlaceHolderBodyCell key={key} {...params} />,
	placeHolderBodyContentRenderer: (params) => <PlaceHolderBodyContent {...params} />,
	footRenderer: (params) => <Foot {...params} />,
	footRowRenderer: (params) => <FootRow {...params} />,
	footCellRenderer: ({ key, ...params }) => <FootCell key={key} {...params} />,
	footContentRenderer: (params) => <FootContent {...params} />,
	dndBodyRowRenderer: ({ key, ...params }) => <DnDTable.DndBodyRow key={key} {...params} />,
	dragSourceRenderer: (params) => <DnDTable.DragSource {...params} />,
	dropTargetRenderer: (params) => <DnDTable.DropTarget {...params} />,
	dragPreviewRenderer: (params) => <DnDTable.DragPreview {...params} />,
	rowGroupHeaderRenderer: (params) => <RowGroupHeader {...params} />
};
export const DefaultFilterHeadComponentRenderers: Partial<TableComponentRenderers<any>> = {
	headFilterRowRenderer: (params) => <HeadFilterRow {...params} />,
	headFilterCellRenderer: ({ key, ...params }) => <HeadFilterCell key={key} {...params} />,
	headFilterContentRenderer: () => <HeadFilterContent />
};

export function Table<RowType = unknown, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>>(
	props: TableProps<RowType, ColumnType>
): ReactElement<TableProps> {
	const [isInteractiveTable, setIsInteractiveTable] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const { disableArrowNavigation } = props;

	const componentRenderers = useMemo<TableComponentRenderers<RowType, ColumnType>>(() => {
		if (props.componentRenderers?.headFilterContentRenderer) {
			return { ...DefaultTableComponentRenderers, ...DefaultFilterHeadComponentRenderers, ...props.componentRenderers };
		}

		return { ...DefaultTableComponentRenderers, ...props.componentRenderers };
	}, [props.componentRenderers]);

	const columns = useMemo(
		() => props.columns.map((col) => TableInternalUtils.crosstabulationColumnRefactor(col)),
		[props.columns]
	);

	const flattenColumns = useMemo(() => flattenAllColumns<RowType, ColumnType>(columns), [columns]);
	const isColumnGroup = hasColumnGroup(columns);
	const isCrossTabulation = columns.some((col) => col.verticalHeader);

	const contextValue: TableContextType<RowType, ColumnType> = {
		...props,
		columns,
		flattenColumns,
		componentRenderers,
		hasFootContent: props.hasFootContent,
		hasColumnGroup: isColumnGroup,
		resizable: !!props.columnResizingOptions,
		crossTabulation: isCrossTabulation,
		cellHighlighting: props.cellHighlighting && !props.cardView,
		isInteractiveTable,
		setIsInteractiveTable,
		isDragging,
		setIsDragging,
		hasScrollToNode: !!props.scrollToNode
	};

	const isInfiniteTable = "infiniteScrollOptions" in props && props.infiniteScrollOptions !== undefined;
	const isVirtualizedTable = "virtualScrollOptions" in props && props.virtualScrollOptions !== undefined;

	return (
		<TableContextProvider value={contextValue}>
			<TableTemplate.Table
				id={props.id}
				style={props.style}
				className={joinClassNames(
					{
						[`${BASE_TABLE_CLASSNAME}--virtual-scroll`]: isInfiniteTable || isVirtualizedTable
					},
					{ [`${BASE_TABLE_CLASSNAME}--group`]: isColumnGroup },
					props.className
				)}
				cardView={props.cardView}
				wrapperRef={props.wrapperRef}
				ariaLabel={props.ariaLabel}
				interactive={isInteractiveTable}
				role={props.role}
				resizable={!!props.columnResizingOptions}
				onBlur={props.onBlur}
				columns={columns}
				virtualScroll={isInfiniteTable || isVirtualizedTable}
				disableArrowNavigation={disableArrowNavigation}
			>
				<TableHeadAndBody
					data={props.data}
					infiniteScrollOptions={isInfiniteTable ? props.infiniteScrollOptions : undefined}
					virtualScrollOptions={isVirtualizedTable ? props.virtualScrollOptions : undefined}
					scrollToNode={props.scrollToNode}
				/>
				{contextValue.componentRenderers.footRenderer()}
				<TableRowScroller />
			</TableTemplate.Table>
		</TableContextProvider>
	);
}

Table.displayName = "Table";

// Split component to prevent re-rendering in CellHighlighting mode
const TableHeadAndBody = memo(function TableHeadAndBody<RowType = unknown>(props: {
	data: RowType[] | undefined;
	infiniteScrollOptions: InfiniteScrollOptions | undefined;
	virtualScrollOptions: VirtualScrollOptions | boolean | undefined;
	scrollToNode?: (handler: TableScrollToNodeHandler) => void;
}) {
	const { infiniteScrollOptions, virtualScrollOptions, scrollToNode, data = [] } = props;
	const [hoveringColumn, setHoveringColumn] = useState();
	const headRenderer = useTableContext((context) => context.componentRenderers.headRenderer);
	const infiniteScrollBodyRenderer = useTableContext(
		(context) => context.componentRenderers.infiniteScrollBodyRenderer
	);
	const virtualizedBodyRenderer = useTableContext((context) => context.componentRenderers.virtualizedBodyRenderer);
	const bodyRenderer = useTableContext((context) => context.componentRenderers.bodyRenderer);
	const enableDragDrop = useTableContext((context) => !!context.dragDropOptions);
	const dragPreviewRenderer = useTableContext((context) => context.componentRenderers.dragPreviewRenderer);
	const isDragging = useTableContext((context) => context.isDragging);

	return (
		<CellHighlightingTableContextProvider value={{ hoveringColumn, setHoveringColumn }}>
			{headRenderer()}
			{infiniteScrollOptions
				? infiniteScrollBodyRenderer({ data, infiniteScrollOptions, scrollToNode })
				: virtualScrollOptions
					? virtualizedBodyRenderer({
							data,
							virtualScrollOptions: virtualScrollOptions === true ? undefined : virtualScrollOptions,
							scrollToNode
						})
					: bodyRenderer({ data, scrollToNode })}
			{!!data.length && enableDragDrop && isDragging && dragPreviewRenderer({})}
		</CellHighlightingTableContextProvider>
	);
});

TableHeadAndBody.displayName = "TableHeadAndBody";

// re-export stuff that was moved to stay non-breaking
export * from "./table.head-filter-row.view.js";
export * from "./table.head-filter-cell.view.js";
export * from "./table.head-filter-content.view.js";
export * from "./table.dnd.view.js";
export * from "./table.context.js";
