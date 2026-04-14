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

import { memo, useState, useRef, useMemo, useCallback } from "react";
import type { DraggableEventHandler } from "react-draggable";
import Draggable from "react-draggable";
import { styled, css } from "styled-components";
import { isEqual } from "lodash-es";

import { getParentElement, joinClassNames, roundDecimalNumber } from "../../common/main/utils.js";
import { activeAndHover } from "../../theme/base/mixins/_interaction.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { BASE_TABLE_CLASSNAME } from "../main/table.internal.js";
import { TableDataAttributes } from "../main/table.data-attributes.js";

import type { TableRenderPropsType } from "./table-renderer.api.js";
import { TableInternalUtils as Utils } from "./table.utils.js";
import { useTableContext } from "./table.context.js";

const MIN_COLUMN_WIDTH = 0.1;
const CSS_MIN_COLUMN_WIDTH = 150;

const StyledTableColumnResizeHandler = styled.div.withConfig({ displayName: "StyledTableColumnResizeHandler-sc-" })<{
	isFirstColumnOfRightPin?: boolean;
	isRightResizeHandler?: boolean;
	isResizing?: boolean;
}>(({ theme, isRightResizeHandler, isResizing }) => {
	const { resizeHandler, headCellGroup } = theme.components.table;

	return css`
		cursor: col-resize;
		height: 100%;
		padding: 0 ${resizeHandler.horizontalPadding};
		position: absolute;
		top: 0;
		div {
			-webkit-user-drag: element;
			background-color: ${headCellGroup.borderColor};
			height: 100%;
			width: ${resizeHandler.width};
		}
		${isRightResizeHandler &&
		css`
			right: -${resizeHandler.horizontalPadding};
		`}
		${!isRightResizeHandler &&
		css`
			left: calc((${resizeHandler.horizontalPadding} + ${resizeHandler.width}) * -1);
		`}
	  	${!isResizing &&
		css`
			${activeAndHover(css`
				div {
					background-color: ${resizeHandler.background};
				}
			`)}
			&[${TableDataAttributes.Data.ResizeHandlerHover}="true"] div {
				background-color: ${resizeHandler.background};
			}
		`}
		${isResizing &&
		css`
			div {
				background-color: transparent;
			}
		`}
	`;
});

/** @internal */
export const ColumnResizeHandler = memo(function ColumnResizeHandler(
	props: TableRenderPropsType.ColumnResizeHandlerProps
) {
	const { column: currentColumn, isRightResizeHandler, isFirstColumnOfRightPin } = props;

	const [isResizing, setResizing] = useState(false);
	const [step, setStep] = useState(15);
	const [previewInitialLeft, setPreviewInitialLeft] = useState(0);
	const tableWrapperRef = useRef<HTMLElement | undefined>(undefined);
	const resizePreviewRef = useRef<HTMLElement | null>(null);
	const resizeOverlayRef = useRef<HTMLElement | null>(null);
	const currentHeadCellRef = useRef<HTMLElement | null>(null);
	const nodeRef = useRef<HTMLElement | null>(null);
	const resizeHandlers = useRef<NodeListOf<HTMLElement>>(undefined);
	const columnDisplayWidth = useRef<number>(currentColumn.width ?? 1);

	const onBeginResizeCallback = useTableContext((context) => context.columnResizingOptions?.onBeginResize);
	const onResizeCallback = useTableContext((context) => context.columnResizingOptions?.onResize);
	const onEndResizeCallback = useTableContext((context) => context.columnResizingOptions?.onEndResize);
	const flattenColumns = useTableContext((context) => context.flattenColumns);
	const columns = useTableContext((context) => context.columns);

	const columnIndex = useMemo(
		() => (flattenColumns ? Utils.getColumnIndex(currentColumn, flattenColumns) : -1),
		[flattenColumns, currentColumn]
	);
	const dataResizableAttr = useMemo(
		() =>
			`resizable-column-${columnIndex}${isRightResizeHandler ? "-right" : ""}${isFirstColumnOfRightPin ? "-pin" : ""}`,
		[columnIndex, isRightResizeHandler, isFirstColumnOfRightPin]
	);
	const isLastColumnOfScroll = useMemo(
		() => Utils.isLastColumnOfArea(currentColumn, columns, "scroll"),
		[columns, currentColumn]
	);

	const handleResizingStyle = useCallback((left?: number): void => {
		if (tableWrapperRef.current) {
			if (left) {
				tableWrapperRef.current.setAttribute(TableDataAttributes.Data.Table.ContainerResizing, "true");
				tableWrapperRef.current.classList.add(`${BASE_TABLE_CLASSNAME}__containerWrapper--resizing`);
			} else {
				tableWrapperRef.current?.removeAttribute(TableDataAttributes.Data.Table.ContainerResizing);
				tableWrapperRef.current.classList.remove(`${BASE_TABLE_CLASSNAME}__containerWrapper--resizing`);
			}
		}

		if (currentHeadCellRef.current) {
			if (left) {
				currentHeadCellRef.current.setAttribute(TableDataAttributes.Data.Head.CellResizing, "true");
				currentHeadCellRef.current.classList.add(`${BASE_TABLE_CLASSNAME}__headCell--resizing`);
			} else {
				currentHeadCellRef.current.setAttribute(TableDataAttributes.Data.Head.CellResizing, "false");
				currentHeadCellRef.current.classList.remove(`${BASE_TABLE_CLASSNAME}__headCell--resizing`);
			}
		}

		if (resizeOverlayRef.current) {
			resizeOverlayRef.current.style.visibility = left !== undefined ? "visible" : "hidden";
		}

		if (resizePreviewRef.current && resizeHandlers.current) {
			const resizeHandlerWidth = resizeHandlers.current[0].getBoundingClientRect().width;
			resizePreviewRef.current.style.left =
				left !== undefined ? Math.floor(left - resizeHandlerWidth * 0.5) + "px" : "";
			resizePreviewRef.current.style.visibility = left !== undefined ? "visible" : "hidden";

			if (resizeHandlers.current.length > 1) {
				if (left) {
					resizeHandlers.current.forEach((elem) => {
						(elem as HTMLElement).setAttribute(TableDataAttributes.Data.Head.CellResizing, "true");
						(elem as HTMLElement).classList.add(`${BASE_TABLE_CLASSNAME}__headerCell--resizing`);
					});
				} else {
					resizeHandlers.current.forEach((elem) => {
						(elem as HTMLElement).setAttribute(TableDataAttributes.Data.Head.CellResizing, "false");
						(elem as HTMLElement).classList.remove(`${BASE_TABLE_CLASSNAME}__headerCell--resizing`);
					});
				}
			}
		}
	}, []);

	const resetResizing = useCallback(() => {
		setResizing(false);
		handleResizingStyle();
	}, [handleResizingStyle]);

	const onResizeStart: DraggableEventHandler = useCallback(
		(event, data): void => {
			setResizing(true);

			if (tableWrapperRef.current && resizeHandlers.current) {
				const headCells = tableWrapperRef.current.querySelectorAll(`[data-role=${DataRoles.Table.Header.Cell}]`);
				currentHeadCellRef.current = headCells[columnIndex] as HTMLElement;
				const headRect = currentHeadCellRef.current.getBoundingClientRect();

				// Resize preview's init position
				const headXAxis = isFirstColumnOfRightPin ? headRect.left : headRect.right;
				const left = headXAxis - tableWrapperRef.current.getBoundingClientRect().left;

				if (isLastColumnOfScroll && flattenColumns) {
					// Get right CSS_MIN_COLUMN_WIDTH since it depends on Plasma variable
					const cssMinWidth = columnIndex
						? headCells[columnIndex - 1].getBoundingClientRect().width / (flattenColumns[columnIndex - 1].width ?? 1)
						: CSS_MIN_COLUMN_WIDTH;

					// Last column of scroll area has flex 1,
					// so its display width is changed, need to re-calculate
					columnDisplayWidth.current = roundDecimalNumber(headRect.width / cssMinWidth);
				} else {
					columnDisplayWidth.current = currentColumn.width ?? 1;
				}

				setStep(Math.round(headRect.width / (columnDisplayWidth.current * 10)));
				setPreviewInitialLeft(left);
				handleResizingStyle(left);
			}

			onBeginResizeCallback?.({ resizedColumn: currentColumn, event, data });
		},
		[
			onBeginResizeCallback,
			currentColumn,
			columnIndex,
			isFirstColumnOfRightPin,
			isLastColumnOfScroll,
			flattenColumns,
			handleResizingStyle
		]
	);

	const onResize: DraggableEventHandler = useCallback(
		(event, data): void => {
			handleResizingStyle(previewInitialLeft + data.x);
			onResizeCallback?.({ resizedColumn: currentColumn, event, data });
		},
		[currentColumn, handleResizingStyle, onResizeCallback, previewInitialLeft]
	);

	/**
	 * Calculate width of column
	 * - Max-size of column width is 4, so NO columns could have width bigger than 4
	 * - Each column has its minResizeWidth, so after resize, column's width could not smaller than its minResizeWidth
	 */
	const onResizeStop: DraggableEventHandler = useCallback(
		(event, data): void => {
			if (columnIndex === -1) {
				return;
			}

			const sizeChange = roundDecimalNumber((data.x / step) * -0.1);
			const currentColumnWidth = columnDisplayWidth.current;
			const currentColumnMinResizeWidth = currentColumn.minResizeWidth ?? MIN_COLUMN_WIDTH;

			// Return if column width already at minResizeWidth or MAX_COLUMN_WIDTH
			const isIncreaseSize =
				(isFirstColumnOfRightPin && sizeChange > 0) || (!isFirstColumnOfRightPin && sizeChange < 0);

			if (currentColumnMinResizeWidth === currentColumnWidth && !isIncreaseSize) {
				resetResizing();

				return;
			}

			let newCurrentColumnWidth = roundDecimalNumber(
				currentColumnWidth + sizeChange * (isFirstColumnOfRightPin ? 1 : -1)
			);

			if (newCurrentColumnWidth < currentColumnMinResizeWidth) {
				newCurrentColumnWidth = currentColumnMinResizeWidth;
			}

			onEndResizeCallback?.({
				resizedColumn: currentColumn,
				resizedWidthsGetter: (column) => {
					return isEqual(Utils.crosstabulationColumnRefactor(column), currentColumn)
						? newCurrentColumnWidth
						: undefined;
				},
				event,
				data
			});
			resetResizing();
		},
		[currentColumn, columnIndex, isFirstColumnOfRightPin, onEndResizeCallback, resetResizing, step]
	);

	const handleResizeHandlerRef = useCallback(
		(ref: HTMLElement | null): void => {
			nodeRef.current = ref;
			tableWrapperRef.current = getParentElement(ref, (p) =>
				p.classList.contains(`${BASE_TABLE_CLASSNAME}__containerWrapper`)
			);

			if (tableWrapperRef.current) {
				resizePreviewRef.current = tableWrapperRef.current.getElementsByClassName(
					`${BASE_TABLE_CLASSNAME}__resize--preview`
				)[0] as HTMLElement;
				resizeOverlayRef.current = tableWrapperRef.current.getElementsByClassName(
					`${BASE_TABLE_CLASSNAME}__resize--overlay`
				)[0] as HTMLElement;

				// Ref of all handler of the same column (in headCell & headCell parent)
				resizeHandlers.current = tableWrapperRef.current.querySelectorAll(
					`.${BASE_TABLE_CLASSNAME}__headerCell__resize-handler[data-resizable="${dataResizableAttr}"]`
				);
			}
		},
		[dataResizableAttr]
	);

	const handleColumnGroupHover = useCallback((add = true): void => {
		if (!resizeHandlers.current) {
			return;
		}

		resizeHandlers.current.forEach((elem) => {
			// Add no-effect on headline to remove the hovering style
			const headCellElement = getParentElement(
				elem,
				(p) => p.getAttribute("data-role") === DataRoles.Table.Header.Cell
			);

			if (headCellElement) {
				headCellElement.setAttribute("data-headCell-no-effect", `${add}`);
			}

			(elem as HTMLElement).setAttribute("data-resize-handler-hover", `${add}`);

			if (add) {
				(elem as HTMLElement).classList.add(`${BASE_TABLE_CLASSNAME}__headerCell__resize-handler--hover`);
			} else {
				(elem as HTMLElement).classList.remove(`${BASE_TABLE_CLASSNAME}__headerCell__resize-handler--hover`);
			}
		});
	}, []);

	const onMouseOver = useCallback(() => handleColumnGroupHover(true), [handleColumnGroupHover]);
	const onMouseOut = useCallback(() => handleColumnGroupHover(false), [handleColumnGroupHover]);

	return (
		<Draggable
			axis="x"
			defaultClassName={joinClassNames(`${BASE_TABLE_CLASSNAME}__headerCell__resize-handler`, props.className)}
			grid={[step, 0]}
			// Prevent jumping while resizing
			offsetParent={document.body}
			onStart={onResizeStart}
			onDrag={onResize}
			onStop={onResizeStop}
			defaultPosition={{ x: 0, y: 0 }}
			position={{ x: 0, y: 0 }}
			scale={1}
			nodeRef={nodeRef}
			data-role={DataRoles.Table.Column.ResizeHandler}
		>
			<StyledTableColumnResizeHandler
				onMouseOver={onMouseOver}
				onMouseOut={onMouseOut}
				data-resizable={dataResizableAttr}
				ref={handleResizeHandlerRef}
				className={joinClassNames(
					{ [`${BASE_TABLE_CLASSNAME}__headerCell__resize-handler--right-pin`]: isFirstColumnOfRightPin },
					{ [`${BASE_TABLE_CLASSNAME}__headerCell__right-resize-handler`]: isRightResizeHandler },
					{ [`${BASE_TABLE_CLASSNAME}__headerCell--resizing`]: isResizing }
				)}
				isRightResizeHandler={isRightResizeHandler}
				isResizing={isResizing}
				data-role={
					isRightResizeHandler ? DataRoles.Table.Column.RightResizeHandler : DataRoles.Table.Column.LeftResizeHandler
				}
			>
				<div />
			</StyledTableColumnResizeHandler>
		</Draggable>
	);
});

ColumnResizeHandler.displayName = "ColumnResizeHandler";
