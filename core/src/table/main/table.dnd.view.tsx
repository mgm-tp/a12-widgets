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

import type { CSSProperties, MouseEvent, ReactElement } from "react";
import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import type { DragLayerMonitor, XYCoord } from "react-dnd";
import { useDrag, useDragLayer, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { styled, css } from "styled-components";
import { shallowEqual } from "@react-dnd/shallowequal";

import { joinClassNames } from "../../common/main/utils.js";
import { useKeepEditableCursorInDraggable } from "../../common/main/hooks.js";

import { BASE_TABLE_CLASSNAME } from "./table.internal.js";
import { StyledTableBodyRow } from "./template/table.body-row.tpl.view.js";
import type { TableRenderPropsType } from "./table-renderer.api.js";
import { useTableContext } from "./table.context.js";
import { TableInternalUtils } from "./table.utils.js";

export const StyledTableDnDBody = styled.div.withConfig({ displayName: "StyledTableDnDBody-sc-" })(({ theme }) => {
	const { bodyRow } = theme.components.table;

	return css`
		position: relative;
		user-select: none;
		-webkit-user-drag: element;
		[draggable="true"] {
			cursor: move;
		}
		&:not(:last-child) ${StyledTableBodyRow}:before {
			border-bottom: ${bodyRow.borderBottom};
		}

		${StyledTableBodyRow} {
			position: static;
		}
	`;
});

const StyledTableDnDBodyRowPreview = styled.div.withConfig({ displayName: "StyledTableDnDBodyRowPreview-sc-" })(
	({ theme }) => {
		const { bodyRowDnD } = theme.components.table;

		return css`
			background-color: ${bodyRowDnD.preview.background};
			box-shadow: ${bodyRowDnD.preview.boxShadow};
			opacity: ${bodyRowDnD.preview.opacity};
			position: fixed;
			pointer-events: none;
			width: 100%;
			z-index: 1;
		`;
	}
);

export const StyledTableDnDBodyHint = styled.div.withConfig({ displayName: "StyledTableDnDBodyHint-sc-" })<{
	isOpen?: boolean;
	isOver?: boolean;
}>(({ theme, isOpen, isOver }) => {
	const { bodyRowDnD } = theme.components.table;

	return css`
		background-color: transparent;
		bottom: 0;
		cursor: default;
		height: ${bodyRowDnD.hint.height};
		position: absolute;
		width: 100%;
		display: ${isOpen ? "block" : "none"};
		${isOpen &&
		css`
			z-index: 1;
			${isOver &&
			css`
				background-color: ${bodyRowDnD.hint.openedBG};
				border: ${bodyRowDnD.hint.openedBorder};
			`}
			&:first-child {
				top: 0;
			}
		`}
	`;
});

export const StyledTableDnDDragPreview = styled.div.withConfig({ displayName: "StyledTableDnDDragPreview-sc-" })`
	position: fixed;
	pointer-events: none;
	z-index: 1;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
`;

export namespace DnDTable {
	import isInteractiveElement = TableInternalUtils.isInteractiveElement;

	export const DEFAULT_ACCEPT_TYPE = "TableDnDRow";

	export function getBodyRowPreviewStyles(initialOffset: XYCoord | null, currentOffset: XYCoord | null): CSSProperties {
		if (!initialOffset || !currentOffset) {
			return {
				display: "none"
			};
		}

		const { x, y } = currentOffset;
		const transform = `translate(${x}px, ${y}px)`;

		return {
			transform,
			WebkitTransform: transform
		};
	}

	export function DndBodyRow(props: TableRenderPropsType.BodyRowProps): ReactElement {
		const { rowIndex, row } = props;
		const { style, className, ...bodyRowProps } = props;
		const [canDrag, setCanDrag] = useState<false | undefined>(undefined);

		const dragSourceRenderer = useTableContext((context) => context.componentRenderers.dragSourceRenderer);
		const dropTargetRenderer = useTableContext((context) => context.componentRenderers.dropTargetRenderer);
		const bodyRowRenderer = useTableContext((context) => context.componentRenderers.bodyRowRenderer);

		const onMouseOver = useCallback((event: MouseEvent<HTMLElement>) => {
			setCanDrag(isInteractiveElement(event) ? false : undefined);
		}, []);

		const content = bodyRowRenderer({
			...bodyRowProps,
			onMouseOver
		});

		return (
			<StyledTableDnDBody className={joinClassNames(`${BASE_TABLE_CLASSNAME}__contentDnD`, className)} style={style}>
				{rowIndex === 0 && dropTargetRenderer({ row, rowIndex })}
				{dragSourceRenderer({
					row,
					rowIndex,
					children: content,
					canDrag
				})}
				{dropTargetRenderer({ row, rowIndex: rowIndex + 1 })}
			</StyledTableDnDBody>
		);
	}

	interface DragSourceCollectedProps {
		isDragging: boolean;
	}

	/**
	 * This DragSource wrap a table row and provide ability to show a preview of what is being dragged.
	 * On mobile device, it shows a preview when holding long enough, and make a pop-out effect to differential with
	 * touch to scroll
	 */
	export function DragSource<RowType = unknown>(
		props: TableRenderPropsType.DragSourceProps<RowType>
	): ReactElement | null {
		const acceptType = useTableContext((context) => context.dragDropOptions?.acceptType || DEFAULT_ACCEPT_TYPE);
		const elementRef = useRef<HTMLDivElement>(null);

		const dragItem = useMemo<TableRenderPropsType.DragObject<RowType>>(() => {
			return {
				rowIndex: props.rowIndex,
				row: props.row
			};
		}, [props.row, props.rowIndex]);

		const canDragContext = useTableContext((context) => {
			return context.dragDropOptions?.canDrag?.({ dragItem });
		});

		const onBeginDragCallback = useTableContext((context) => context.dragDropOptions?.onBeginDrag);
		const onEndDragCallback = useTableContext((context) => context.dragDropOptions?.onEndDrag);
		const canDropCallback = useTableContext((context) => context.dragDropOptions?.canDrop);
		const onDropCallback = useTableContext((context) => context.dragDropOptions?.onDrop);
		const setIsDragging = useTableContext((context) => context.setIsDragging);

		const [, drag, preview] = useDrag<
			TableRenderPropsType.DragObject<RowType>,
			TableRenderPropsType.DropResult<RowType>,
			DragSourceCollectedProps
		>({
			type: acceptType,
			canDrag: props.canDrag === false ? false : (canDragContext ?? true),
			item: () => {
				onBeginDragCallback?.({ dragItem });
				setIsDragging?.(true);

				return { ...dragItem, width: elementRef.current?.offsetWidth };
			},
			end: (item, monitor) => {
				const dropResult = monitor.getDropResult();
				const canDrop = (dropResult && canDropCallback?.({ dragItem, hoveredItem: dropResult })) ?? true;

				if (monitor.didDrop() && dropResult && canDrop) {
					onDropCallback?.({ dragItem, dropResult });
				}

				setIsDragging?.(false);
				onEndDragCallback?.({ dragItem, dropResult });
			},
			collect: (monitor) => ({
				isDragging: monitor.isDragging()
			})
		});

		const { connectDragPreview } = props;
		useEffect(() => {
			connectDragPreview?.(preview);
		}, [connectDragPreview, preview]);

		useEffect(() => {
			// this useEffect hides the default preview
			preview(getEmptyImage(), { captureDraggingState: true });
		}, [preview]);

		const style: CSSProperties = useMemo(() => ({ userSelect: "none", ...props.style }), [props.style]);

		drag(elementRef);

		useKeepEditableCursorInDraggable(elementRef);

		return (
			<div ref={elementRef} style={style} id={props.id}>
				{props.children}
			</div>
		);
	}

	interface DropTargetCollectedProps {
		isSomethingDragging: boolean;
		canDrop: boolean;
		isOver: boolean;
	}

	export function DropTarget<RowType>(props: TableRenderPropsType.DropTargetProps<RowType>): ReactElement {
		const acceptType = useTableContext((context) => context.dragDropOptions?.acceptType || DEFAULT_ACCEPT_TYPE);
		const canDropCallback = useTableContext((context) => context.dragDropOptions?.canDrop);
		const ref = useRef<HTMLDivElement>(null);
		const [{ isSomethingDragging, canDrop, isOver }, dropConnector] = useDrop<
			TableRenderPropsType.DragObject<RowType>,
			TableRenderPropsType.DropResult<RowType>,
			DropTargetCollectedProps
		>({
			accept: acceptType,
			drop: () => ({ rowIndex: props.rowIndex, row: props.row }),
			canDrop: (dragItem, monitor) => {
				if (monitor.isOver({ shallow: true }) && canDropCallback) {
					return canDropCallback({
						dragItem,
						hoveredItem: { rowIndex: props.rowIndex, row: props.row }
					});
				}

				// item being dragged is a Table DragSource, so let's do some basic check if it's the same row
				return dragItem.row !== props.row;
			},
			collect: (monitor) => ({
				canDrop: monitor.canDrop(),
				isOver: monitor.isOver({ shallow: true }),
				isSomethingDragging: !!monitor.getItem()
			})
		});
		const classNames = joinClassNames(
			`${BASE_TABLE_CLASSNAME}__contentDnDHint`,
			canDrop && isSomethingDragging
				? `${BASE_TABLE_CLASSNAME}__contentDnDHint--opened`
				: `${BASE_TABLE_CLASSNAME}__contentDnDHint--closed`,
			{ [`${BASE_TABLE_CLASSNAME}__contentDnDHint--isOver`]: isOver },
			props.className
		);
		dropConnector(ref);

		return (
			<StyledTableDnDBodyHint
				ref={ref}
				className={classNames}
				style={props.style}
				id={props.id}
				isOpen={canDrop && isSomethingDragging}
				isOver={isOver}
			>
				{props.children}
			</StyledTableDnDBodyHint>
		);
	}

	export function DragPreview(props: TableRenderPropsType.DragPreviewProps): ReactElement | null {
		const bodyRowRenderer = useTableContext((context) => context.componentRenderers.bodyRowRenderer);

		const { initialFileOffset, currentFileOffset, isDragging, item } = useEfficientDragLayer((monitor) => ({
			item: monitor.getItem(),
			initialFileOffset: monitor.getInitialSourceClientOffset(),
			currentFileOffset: monitor.getSourceClientOffset(),
			isDragging: monitor.isDragging()
		}));

		if (!isDragging || !initialFileOffset || !currentFileOffset || !("rowIndex" in item && "row" in item)) {
			return null;
		}

		return (
			<StyledTableDnDDragPreview>
				<StyledTableDnDBodyRowPreview
					className={joinClassNames(`${BASE_TABLE_CLASSNAME}__contentRowPreview`, props.className)}
					style={{
						width: item.width,
						...getBodyRowPreviewStyles(initialFileOffset, currentFileOffset),
						...props.style
					}}
					id={props.id}
				>
					{bodyRowRenderer(item)}
				</StyledTableDnDBodyRowPreview>
			</StyledTableDnDDragPreview>
		);
	}

	/**
	 * A custom specialized hook to improve performance by collecting the offset values conditionally in useDragLayer hook,
	 * in order to have multiple hooks but only one which causes the component to rerender.
	 * @param collect
	 */
	export function useEfficientDragLayer<CollectedProps>(
		collect: (monitor: DragLayerMonitor) => CollectedProps
	): CollectedProps {
		const collected = useDragLayer(collect);
		const [previousCollected, setPreviousCollected] = useState<CollectedProps>(collected);
		const [requestID, setRequestID] = useState<number>();

		useEffect(() => {
			if (requestID === undefined && !shallowEqual(collected, previousCollected)) {
				setPreviousCollected(collected);
				setRequestID(requestAnimationFrame(() => setRequestID(undefined)));
			}
		}, [collected, previousCollected, requestID]);

		return previousCollected;
	}
}
