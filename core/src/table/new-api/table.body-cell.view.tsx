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

import type { MouseEvent } from "react";
import { memo, useRef, useMemo, useCallback } from "react";
import { styled, css } from "styled-components";

import { getParentElement, joinClassNames } from "../../common/main/utils.js";
import { createPseudoElement } from "../../theme/base/mixins/_pseudo.js";
import { activeAndHover } from "../../theme/base/mixins/_interaction.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { BASE_TABLE_CLASSNAME } from "../main/table.internal.js";
import { StyledTableTemplate, TableTemplate } from "../main/template/index.js";
import { StyledBaseTable } from "../main/template/table.styled.js";
import { useStyledTableContext } from "../main/template/table.context.styled.js";
import type { TableTemplateProps } from "../main/template/table.tpl.api.js";

import type { TableRenderPropsType } from "./table-renderer.api.js";
import { isColumnGroup, TableInternalUtils as Utils, TableInternalUtils } from "./table.utils.js";
import { useCellHighlightingTableContext, useTableContext } from "./table.context.js";

export const StyledTableBodyCellGroup = styled(StyledBaseTable.Group).withConfig({
	displayName: "StyledTableBodyCellGroup-sc-"
})<{
	$crossTabulation?: boolean;
	$rowSegmentType?: TableTemplateProps.RowSegmentType;
	$rowInteractive?: boolean;
}>(({ theme, $crossTabulation: crossTabulation, $rowSegmentType: rowSegmentType, $rowInteractive: rowInteractive }) => {
	const { headCellGroup } = theme.components.table;

	const resetBorder = css`
		&:last-child:after {
			border-right-color: transparent;
		}
	`;

	return css`
		position: relative;
		${createPseudoElement(
			":after",
			css`
				border-right: ${headCellGroup.borderRight};
				display: block;
				left: unset;
			`
		)}
		${(rowSegmentType === "right" || (rowSegmentType === "left" && crossTabulation)) && resetBorder}
		
        // Make sure when hover/focus, column's border not overlap with content row's border
        ${rowInteractive &&
		css`
			${activeAndHover(
				css`
					&:after {
						top: 3px;
						bottom: 3px;
					}
				`,
				StyledTableTemplate.StyledBodyRow
			)}
			${StyledTableTemplate.StyledBodyRow}:focus & {
				&:after {
					top: 3px;
					bottom: 3px;
				}
			}
		`}
	`;
});

/** @internal */
export const BodyCell = memo(function BodyCell(props: TableRenderPropsType.BodyCellProps) {
	const cardView = useTableContext((context) => context.cardView);
	const bodyContentRenderer = useTableContext((context) => context.componentRenderers.bodyContentRenderer);
	const bodyCellRenderer = useTableContext((context) => context.componentRenderers.bodyCellRenderer);
	const cellHighlighting = useTableContext((context) => context.cellHighlighting);
	const columns = useTableContext((context) => context.columns);
	const resizable = useTableContext((context) => context.resizable);
	const setHoveringColumn = useCellHighlightingTableContext((context) => context.setHoveringColumn);
	const setContextMenuOpen = useStyledTableContext((context) => context.row?.setContextMenuOpen);
	const crossTabulation = useTableContext((context) => context.crossTabulation);
	const rowSegmentType = useStyledTableContext((context) => context.rowSegmentType);
	const rowInteractive = useStyledTableContext((context) => !!context.row?.interactive);

	const flattenColumns = useTableContext((context) => context.flattenColumns);

	const { column, row, rowIndex, className, style, role, fixedWidth: fixedWidthProp, ...rest } = props;

	const useSecondaryColor = useTableContext(
		(context) => context.cellStyling?.({ row, rowIndex, column })?.useSecondaryColor
	);
	const secondaryCellTitle = useTableContext(
		(context) => context.cellStyling?.({ row, rowIndex, column })?.secondaryCellTitle
	);

	const cellClassName = useTableContext((context) => context.cellStyling?.({ row, rowIndex, column })?.className);
	const cellStyle = useTableContext((context) => context.cellStyling?.({ row, rowIndex, column })?.style);
	const disabledRow = useTableContext((context) => context.rowStyling?.({ row, rowIndex })?.disabled);
	const contextMenuRenderer = useTableContext((context) => context.componentRenderers.contextMenuRenderer);

	const hasContextMenu = useTableContext((context) => {
		const disabledRightClickContextMenu = context.rowStyling?.({ row, rowIndex })?.disabledRightClickContextMenu;

		return !!contextMenuRenderer && !disabledRightClickContextMenu;
	});
	const headContextMenuRenderer = useTableContext((context) => context.componentRenderers.headContextMenuRenderer);
	const hasHeadContextMenu = !!headContextMenuRenderer;
	const { contextMenuPosition, contextMenuOpen, closeContextMenuPortal, onContextMenu } =
		TableInternalUtils.useContextMenu();
	const bodyCellRef = useRef<HTMLDivElement | null>(null);
	const baseContentGroupClassName = `${BASE_TABLE_CLASSNAME}__content-group`;
	const isVerticalHeader = props.verticalHeader || column.verticalHeader;
	const shouldPassContextMenuHandler = isVerticalHeader ? hasHeadContextMenu : hasContextMenu;
	const fixedWidth = Utils.isFixedWidthColumn({ column, columns, resizable, fixedWidthProp });
	const isSingleColumn = !isColumnGroup(column);
	const shouldHighlightCell = !disabledRow && cellHighlighting;

	const ariaColIndex = useMemo(() => {
		if (!isSingleColumn || !flattenColumns) {
			return undefined;
		}

		const index = Utils.getColumnIndex(column, flattenColumns);

		return index >= 0 ? index + 1 : undefined;
	}, [isSingleColumn, flattenColumns, column]);

	const styles = useMemo(() => ({ ...cellStyle, ...style }), [cellStyle, style]);

	const columnParentStyle = useMemo(
		() => Utils.calculateParentColumnFlexAttributes(column, columns, resizable),
		[column, columns, resizable]
	);
	const getRef = useCallback((ref: HTMLDivElement | null) => {
		bodyCellRef.current = ref;
	}, []);

	const openContextMenu = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			onContextMenu(event);
			setContextMenuOpen?.(true);
		},
		[onContextMenu, setContextMenuOpen]
	);

	const closeContextMenu = useCallback(() => {
		closeContextMenuPortal();
		const bodyRow = getParentElement(
			bodyCellRef.current,
			(parent) => parent.getAttribute("data-role") === DataRoles.Table.Body.Row
		);
		bodyRow?.focus();
		setContextMenuOpen?.(false);
	}, [closeContextMenuPortal, setContextMenuOpen]);

	const handleMouseOver = useCallback(() => {
		setHoveringColumn?.(column);
	}, [column, setHoveringColumn]);

	const handleMouseLeave = useCallback(() => {
		setHoveringColumn?.(undefined);
	}, [setHoveringColumn]);

	const bodyCell = (
		<TableTemplate.BodyCell
			useSecondaryColor={useSecondaryColor}
			secondaryCellTitle={secondaryCellTitle}
			label={cardView && column.label}
			horizontalAlignment={
				isSingleColumn ? (column.specificHorizontalAlignment?.body ?? column.horizontalAlignment) : undefined
			}
			verticalAlignment={
				isSingleColumn ? (column.specificVerticalAlignment?.body ?? column.verticalAlignment) : undefined
			}
			relativeWidth={column.width}
			fixedWidth={fixedWidth}
			subInfo={column.subInfo}
			actionCell={column.actionColumn}
			ariaColIndex={ariaColIndex}
			className={joinClassNames(className, cellClassName)}
			style={styles}
			role={role ?? (cardView ? "listitem" : undefined)}
			onContextMenu={shouldPassContextMenuHandler ? openContextMenu : undefined}
			wrapperRef={getRef}
			onMouseOver={shouldHighlightCell ? handleMouseOver : undefined}
			onMouseLeave={shouldHighlightCell ? handleMouseLeave : undefined}
			verticalHeader={isVerticalHeader}
			{...rest}
		>
			{bodyContentRenderer({ column, row, rowIndex })}
			{isVerticalHeader
				? hasHeadContextMenu &&
					contextMenuOpen && (
						<TableTemplate.ContextMenu
							renderer={headContextMenuRenderer}
							column={column}
							closeHandler={closeContextMenu}
							position={contextMenuPosition}
						/>
					)
				: hasContextMenu &&
					contextMenuOpen && (
						<TableTemplate.ContextMenu
							renderer={contextMenuRenderer}
							column={column}
							row={row}
							rowIndex={rowIndex}
							closeHandler={closeContextMenu}
							position={contextMenuPosition}
						/>
					)}
		</TableTemplate.BodyCell>
	);

	return !isSingleColumn ? (
		<StyledTableBodyCellGroup
			className={baseContentGroupClassName}
			style={columnParentStyle}
			data-role={DataRoles.Table.Body.Cell.Group}
			$crossTabulation={crossTabulation}
			$rowSegmentType={rowSegmentType}
			$rowInteractive={rowInteractive}
		>
			{column.subColumns?.map((col, index) => {
				const isCellOnParWithGroup =
					!col.subColumns && column.subColumns?.some((value) => value.subColumns && value.subColumns.length > 0);

				return bodyCellRenderer({
					...props,
					column: col,
					key: `bodyCell-${index}`,
					className: isCellOnParWithGroup ? `${baseContentGroupClassName}--spannedWithoutGroup` : undefined,
					verticalHeader: column.verticalHeader || props.verticalHeader
				});
			})}
		</StyledTableBodyCellGroup>
	) : (
		bodyCell
	);
});

BodyCell.displayName = "BodyCell";
