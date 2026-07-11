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

import type { KeyboardEvent } from "react";
import { memo, useMemo, useRef, useCallback } from "react";
import { Key } from "ts-key-enum";
import { isEqual } from "lodash-es";

import { BASE_TABLE_CLASSNAME } from "./table.internal.js";
import { TableTemplate } from "./template/index.js";
import type { TableRenderPropsType } from "./table-renderer.api.js";
import type { BaseColumnType } from "./column.api.js";
import { getNextSorting, isColumnGroup, TableInternalUtils as Utils } from "./table.utils.js";
import { ColumnResizeHandler } from "./table.resize-handler.view.js";
import { useCellHighlightingTableContext, useTableContext } from "./table.context.js";

/** @internal */
export const HeadCell = memo(function HeadCell(props: TableRenderPropsType.HeadCellProps<BaseColumnType>) {
	const { column, fixedWidth: fixedWidthProp, role, ...rest } = props;

	const cardView = useTableContext((context) => context.cardView);
	const headContentRenderer = useTableContext((context) => context.componentRenderers.headContentRenderer);
	const sortState = useTableContext((context) => context.sortOptions?.sortState);
	const onSort = useTableContext((context) => context.sortOptions?.onSort);
	const disabled = useTableContext((context) => context.disabled);
	const resizable = useTableContext((context) => context.resizable);
	const columns = useTableContext((context) => context.columns);
	const flattenColumns = useTableContext((context) => context.flattenColumns);
	const headContextMenuRenderer = useTableContext((context) => context.componentRenderers.headContextMenuRenderer);
	const hasHeadContextMenu = !!headContextMenuRenderer;
	const { contextMenuPosition, contextMenuOpen, closeContextMenuPortal, onContextMenu } = Utils.useContextMenu();

	const isHovering = useCellHighlightingTableContext((context) => isEqual(context.hoveringColumn, column));

	const isSingleColumn = useMemo(() => !isColumnGroup(column), [column]);
	const isIntermediateColumn = useMemo(() => Utils.isIntermediateColumn(column, columns), [column, columns]);

	const headCellRef = useRef<HTMLDivElement | null>(null);

	const fixedWidth = useMemo(() => {
		return Utils.isFixedWidthColumn({ column, columns, resizable, fixedWidthProp });
	}, [resizable, fixedWidthProp, column, columns]);

	const currentColumn = useMemo(
		() => (!isSingleColumn ? (Utils.getFirstSubColumn(column) ?? column) : column),
		[column, isSingleColumn]
	);

	const currentColumnIndex = useMemo(() => {
		if (!flattenColumns) {
			return -1;
		}

		return Utils.getColumnIndex(currentColumn, flattenColumns);
	}, [flattenColumns, currentColumn]);

	const isFirstColumnOfRightPin = useMemo(
		() => Utils.isFirstColumnOfArea(currentColumn, columns, "right"),
		[columns, currentColumn]
	);

	const ariaColIndex = currentColumnIndex >= 0 ? currentColumnIndex + 1 : undefined;

	const leftResizeableColumn = useMemo(() => {
		if (!flattenColumns || currentColumnIndex <= 0) {
			return currentColumn;
		}

		return flattenColumns[currentColumnIndex - 1];
	}, [flattenColumns, currentColumnIndex, currentColumn]);

	const rightResizeableColumn = useMemo(
		() => (!isSingleColumn ? (Utils.getLastSubColumn(column) ?? column) : column),
		[column, isSingleColumn]
	);

	const showLeftResizeHandler = useMemo(() => {
		if (!resizable) {
			return false;
		}

		if (
			Utils.isRightOfActionColumn(currentColumn, columns) ||
			Utils.isFirstColumnOfArea(currentColumn, columns, "scroll") ||
			Utils.isFirstColumnOfArea(currentColumn, columns, "left")
		) {
			return false;
		}

		if (isFirstColumnOfRightPin && currentColumn.actionColumn) {
			return false;
		}

		return (
			(isIntermediateColumn && !Utils.isFirstColumnOfArea(currentColumn, columns, "left")) || currentColumnIndex > 0
		);
	}, [resizable, currentColumn, columns, isFirstColumnOfRightPin, isIntermediateColumn, currentColumnIndex]);

	// Last column of left pin has right resize handler to resize its own width
	const showRightResizeHandler = useMemo(() => {
		if (!resizable || !rightResizeableColumn || !flattenColumns) {
			return false;
		}

		if (rightResizeableColumn.actionColumn || column.actionColumn) {
			return false;
		}

		return (
			Utils.isLastColumnOfArea(rightResizeableColumn, columns, "left") &&
			Utils.getColumnIndex(rightResizeableColumn, flattenColumns) !== flattenColumns.length - 1
		);
	}, [column.actionColumn, resizable, columns, flattenColumns, rightResizeableColumn]);

	const handleSortEvent = useMemo(() => {
		if (isSingleColumn && column.sortable && !disabled) {
			return (): void => onSort?.({ column, order: getNextSorting(column, sortState) });
		}

		return undefined;
	}, [isSingleColumn, column, disabled, onSort, sortState]);

	const handleKeyUp = useCallback(
		(event: KeyboardEvent<HTMLElement>): void => {
			if (
				event.key === Key.Enter &&
				handleSortEvent &&
				(event.target as HTMLElement).classList.contains(`${BASE_TABLE_CLASSNAME}__headerCell`)
			) {
				handleSortEvent();
			}
		},
		[handleSortEvent]
	);

	const getRef = useCallback((ref: HTMLDivElement | null) => {
		headCellRef.current = ref;
	}, []);

	const closeContextMenu = useCallback(() => {
		closeContextMenuPortal();
		headCellRef.current?.focus();
	}, [closeContextMenuPortal]);

	const columnGroup = isColumnGroup(column);

	return (
		<TableTemplate.HeadCell
			onClick={handleSortEvent}
			onKeyUp={handleKeyUp}
			horizontalAlignment={
				(column.specificHorizontalAlignment?.head ?? column.horizontalAlignment) || (columnGroup ? "center" : "left")
			}
			verticalAlignment={column.specificVerticalAlignment?.head ?? column.verticalAlignment}
			sortable={isSingleColumn && column.sortable && !disabled}
			relativeWidth={isSingleColumn ? column.width : undefined}
			sorting={isSingleColumn && sortState?.column === column ? sortState.order : undefined}
			fixedWidth={fixedWidth}
			subInfo={column.subInfo}
			actionCell={column.actionColumn}
			ariaColIndex={ariaColIndex}
			hiddenText={column.hiddenText ?? column.title}
			role={cardView ? false : role}
			htmlAttributes={column.htmlAttributes}
			onContextMenu={hasHeadContextMenu ? onContextMenu : undefined}
			isHovering={isHovering}
			wrapperRef={getRef}
			{...rest}
			leftResizeHandler={
				// Head cell of this column will contain previous column resize handler
				showLeftResizeHandler && (
					<ColumnResizeHandler
						isFirstColumnOfRightPin={isFirstColumnOfRightPin}
						column={isFirstColumnOfRightPin ? currentColumn : leftResizeableColumn}
					/>
				)
			}
			rightResizeHandler={
				showRightResizeHandler && <ColumnResizeHandler column={rightResizeableColumn} isRightResizeHandler />
			}
		>
			{headContentRenderer({ column })}
			{hasHeadContextMenu && contextMenuOpen && (
				<TableTemplate.ContextMenu
					renderer={headContextMenuRenderer}
					column={column}
					closeHandler={closeContextMenu}
					position={contextMenuPosition}
				/>
			)}
		</TableTemplate.HeadCell>
	);
});

HeadCell.displayName = "HeadCell";
