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

import type { MouseEvent, ReactElement, ReactNode, RefCallback } from "react";
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import type { List } from "react-virtualized";

import { createContext, useContextSelector } from "../../context/index.js";
import { addPrefix, joinClassNames, StringUtils } from "../../common/main/utils.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { useKeepEditableCursorInDraggable } from "../../common/main/hooks.js";
import type { DOMProps } from "../../common/main/base-props.js";
import { TableTemplate } from "../../table/main/template/index.js";
import type { TableContextType } from "../../table/new-api/table.api.js";
import type { TableRenderPropsType } from "../../table/new-api/table-renderer.api.js";
import {
	DefaultTableComponentRenderers,
	DnDTable,
	StyledTableDnDBody,
	TableContextProvider
} from "../../table/new-api/table.view.js";
import { flattenAllColumns, getRowKey, hasColumnGroup, TableInternalUtils } from "../../table/new-api/table.utils.js";
import { TreeNode } from "../../tree/main/tpl/tree-elements.tpl.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { TableRowScroller } from "../../table/new-api/table.row-scroller.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type {
	BaseTreeTableColumnType,
	BaseTreeTableNode,
	FlattenTreeTableNode,
	TreeTableComponentRenderers,
	TreeTableContextType,
	TreeTableDragDropOptions,
	TreeTableProps,
	TreeTableRenderPropsType,
	TreeTableScrollToNodeHandler,
	TreeTableVirtualScrollOptions
} from "./tree-table.api.js";
import { TreeTableNodeDropPosition } from "./tree-table.api.js";
import { StyledTreeTable } from "./tree-table.styled.js";
import { areRowsEqual, getNodeContent, shouldHaveHiddenText } from "./tree-table.utils.js";

const baseTreeTableClassName = addPrefix("tree-table");
const baseTableClassName = addPrefix("table");

export function useTreeTableContext<
	NodeType extends BaseTreeTableNode = BaseTreeTableNode,
	ColumnType extends BaseTreeTableColumnType<NodeType> = BaseTreeTableColumnType<NodeType>,
	DragDropOptions = TreeTableDragDropOptions<NodeType>,
	Selector extends (context: TreeTableContextType<NodeType, ColumnType, DragDropOptions>) => any = (
		context: TreeTableContextType<NodeType, ColumnType, DragDropOptions>
	) => any
>(selector: Selector): ReturnType<Selector> {
	return useContextSelector(TreeTableContext, selector);
}

const VirtualizedBody = memo(function VirtualizedBody(
	props: TreeTableRenderPropsType.VirtualizedBodyProps<FlattenTreeTableNode>
) {
	const { data, scrollToNode } = props;
	const virtualizedListRef = useRef<List | null>(null);
	const virtualScrollOptions = useMemo<TreeTableVirtualScrollOptions>(
		() => ({
			...props.virtualScrollOptions,
			listRef: (ref) => {
				props.virtualScrollOptions?.listRef?.(ref);
				virtualizedListRef.current = ref;
			}
		}),
		[props.virtualScrollOptions]
	);
	const virtualScrollToNode: TreeTableScrollToNodeHandler = useCallback(
		(nodeId, options) => {
			const index = data.findIndex((row) => nodeId === row.id);

			if (index !== -1) {
				setTimeout(() => {
					virtualizedListRef.current?.scrollToRow(index);

					if (options?.autoFocus) {
						requestAnimationFrame(() => {
							const nodeElement = document.getElementById(`tree-node-name-${nodeId}`);
							nodeElement?.closest<HTMLElement>(`[data-role=${DataRoles.Table.Body.Row}]`)?.focus();
						});
					}
				});
			}
		},
		[data]
	);

	useEffect(() => {
		scrollToNode?.(virtualScrollToNode);
	}, [scrollToNode, virtualScrollToNode]);

	return <>{DefaultTableComponentRenderers.virtualizedBodyRenderer({ data: props.data, virtualScrollOptions })}</>;
});

VirtualizedBody.displayName = "VirtualizedBody";

const Body = memo(function Body(props: TreeTableRenderPropsType.BodyProps<FlattenTreeTableNode>) {
	const { scrollToNode, ...rest } = props;
	const bodyRowRenderer = useTreeTableContext((context) => context.componentRenderers.bodyRowRenderer);
	const dndBodyRowRenderer = useTreeTableContext((context) => context.componentRenderers.dndBodyRowRenderer);
	const enabledDragDrop = useTreeTableContext((context) => !!context.dragDropOptions);
	const rowKey = useTreeTableContext((context) => context.rowKey);
	const cardView = useTreeTableContext((context) => context.cardView);

	useEffect(() => {
		scrollToNode?.((nodeId, options) => {
			const nodeRef = document.getElementById(`tree-node-name-${nodeId}`);

			if (nodeRef) {
				nodeRef.scrollIntoView({ block: "center" });

				if (options?.autoFocus) {
					nodeRef.closest<HTMLElement>(`[data-role=${DataRoles.Table.Body.Row}]`)?.focus();
				}
			}
		});
	}, [scrollToNode]);

	return (
		<TableTemplate.Body key="body" role={cardView ? "list" : "none"} tabIndex={false} {...rest}>
			{props.data.map<ReactNode>((row) => {
				const key = rowKey ? getRowKey(row, rowKey) : row.id;
				const renderer = enabledDragDrop ? dndBodyRowRenderer : bodyRowRenderer;

				return renderer({ key, rowIndex: 0, row });
			})}
		</TableTemplate.Body>
	);
});

Body.displayName = "Body";

const BodyRow = memo(function BodyRow(props: TableRenderPropsType.BodyRowProps<FlattenTreeTableNode>) {
	const collapsed = useTreeTableContext((context) => context.rowStyling?.(props)?.collapsed);
	const domProps: DOMProps["domProps"] = useMemo(() => {
		return {
			[`aria-expanded`]: collapsed === undefined ? undefined : !collapsed
		};
	}, [collapsed]);

	return (
		<>
			{DefaultTableComponentRenderers.bodyRowRenderer({
				...props,
				domProps,
				role: "row"
			})}
		</>
	);
});

BodyRow.displayName = "BodyRow";

export const TreeTableBodyContent = memo(function BodyContent(
	props: TableRenderPropsType.BodyContentProps<FlattenTreeTableNode, BaseTreeTableColumnType>
): ReactElement {
	const flattenColumns = useTreeTableContext((context) => context.flattenColumns);
	const { row, column } = props;

	const cellContent: ReactNode = useMemo(
		() => getNodeContent(row, column, flattenColumns),
		[column, flattenColumns, row]
	);

	const hierarchicalBodyContentRenderer = useTreeTableContext(
		(context) => context.componentRenderers.hierarchicalBodyContentRenderer
	);

	if (column.hierarchical) {
		return <>{hierarchicalBodyContentRenderer({ ...props, children: cellContent })}</>;
	}

	return <>{cellContent}</>;
});

TreeTableBodyContent.displayName = "BodyContent";

/** @deprecated since version 38.2.0. Use {@link TreeTableBodyContent} instead. */
export const BodyContent = TreeTableBodyContent;

const HierarchicalBodyContent = memo(function HierarchicalBodyContent(
	props: TreeTableRenderPropsType.HierarchicalBodyContentProps
) {
	const { row, rowIndex, style, className, children, onArrowClick: onArrowClickProp, column } = props;

	const collapsed = useTreeTableContext((context) => context.rowStyling?.({ row, rowIndex })?.collapsed);
	const interactive = useTreeTableContext((context) => context.rowStyling?.({ row, rowIndex })?.interactive);
	const disabled = useTreeTableContext((context) => context.rowStyling?.({ row, rowIndex })?.disabled);
	const flattenColumns = useTreeTableContext((context) => context.flattenColumns);
	const rowEventHandlers = useTreeTableContext((context) => context.rowEventHandlers);

	const onArrowClick = useCallback(() => {
		onArrowClickProp?.();
		rowEventHandlers?.({ row, rowIndex })?.onArrowClick?.();
	}, [rowEventHandlers, row, rowIndex, onArrowClickProp]);

	const parentLabel: ReactNode = useMemo(() => {
		if (!row.parent) {
			return null;
		}

		return getNodeContent(row.parent, column, flattenColumns);
	}, [column, flattenColumns, row]);

	return (
		<TreeNode
			id={row.id}
			style={style}
			className={className}
			label={children}
			level={row.level}
			icon={props.icon ?? row.icon}
			expanded={!(props.collapsed ?? collapsed)}
			onArrowClick={row.children && onArrowClick}
			focusable={false}
			interactive={interactive === true ? undefined : interactive}
			disabled={disabled}
			showArrow={!!row.children}
			parentLabel={parentLabel}
			//eslint-disable-next-line jsx-a11y/aria-role
			role={false}
		/>
	);
});

HierarchicalBodyContent.displayName = "HierarchicalBodyContent";

export const TreeTableBodyCell = memo(function BodyCell(props: TableRenderPropsType.BodyCellProps): ReactElement {
	const { column } = props;

	return (
		<>
			{DefaultTableComponentRenderers.bodyCellRenderer({
				...props,
				role: "gridcell",
				verticalAlignment: column.specificVerticalAlignment?.body ?? (column.verticalAlignment || "middle")
			})}
		</>
	);
});

/** @deprecated since version 38.2.0. Use {@link TreeTableBodyCell} instead. */
export const BodyCell = TreeTableBodyCell;

TreeTableBodyCell.displayName = "TreeTableBodyCell";

export namespace DndTreeTable {
	import isInteractiveElement = TableInternalUtils.isInteractiveElement;

	export const DEFAULT_ACCEPT_TYPE = DnDTable.DEFAULT_ACCEPT_TYPE;

	export function DndContainer<
		NodeType extends BaseTreeTableNode = BaseTreeTableNode,
		ColumnType extends BaseTreeTableColumnType<NodeType> = BaseTreeTableColumnType<NodeType>,
		DragDropOptions = TreeTableDragDropOptions<NodeType>
	>(props: TreeTableProps<NodeType, ColumnType, DragDropOptions>): ReactElement {
		const dropElementRef = useRef<HTMLElement>(null);
		const dragDropOptions = useTreeTableContext((context) => context.dragDropOptions);
		const hideRoot = useTreeTableContext((context) => context.hideRoot);
		const root = useTreeTableContext<NodeType, ColumnType>((context) => context.root);
		const data = useFlattenTree<NodeType>();

		const hoveredRootRow: TreeTableRenderPropsType.HoveredObject<NodeType> | undefined = useMemo(() => {
			if (!root && !data) {
				return undefined;
			}

			let rootRow: FlattenTreeTableNode<NodeType> | undefined;

			if (hideRoot) {
				rootRow = data?.find((row) => row.level === -1);
			} else {
				rootRow = { ...root, level: 0 };
			}

			if (!rootRow) {
				throw new Error(`Could not find the root node of the tree.`);
			}

			return { row: rootRow, position: TreeTableNodeDropPosition.AS_CHILD, rowIndex: 0 };
		}, [root, data, hideRoot]);

		const [{ isOver, canDrop }, dropConnector] = useDrop<
			TreeTableRenderPropsType.DragObject,
			TreeTableRenderPropsType.DropResult,
			{ isOver: boolean; canDrop: boolean }
		>({
			accept: dragDropOptions?.acceptType || DndTreeTable.DEFAULT_ACCEPT_TYPE,
			drop: (item, monitor) => {
				if (monitor.didDrop() || !monitor.getItem() || !monitor.canDrop() || !monitor.isOver({ shallow: true })) {
					return undefined;
				}

				return hoveredRootRow;
			},
			canDrop: (item, monitor) => {
				if (hideRoot && monitor.isOver({ shallow: true }) && hoveredRootRow) {
					return dragDropOptions?.canDrop?.({ dragItem: monitor.getItem(), hoveredItem: hoveredRootRow }) ?? true;
				}

				return false;
			},
			hover: (item, monitor) => {
				if (hideRoot && monitor.isOver({ shallow: true }) && hoveredRootRow) {
					dragDropOptions?.onHover?.({ dragItem: monitor.getItem(), hoveredItem: hoveredRootRow });
				}
			},
			collect: (monitor) => ({
				canDrop: monitor.canDrop(),
				isOver: monitor.isOver({ shallow: true })
			})
		});
		const setRef = (ref: HTMLDivElement | null) => {
			dropElementRef.current = ref;
		};

		dropConnector(dropElementRef);

		const bodyBGClassName = useMemo(() => {
			const classNames = [];

			if (hideRoot && isOver && canDrop) {
				classNames.push(`${baseTreeTableClassName}__body-background--droppable`);
			} else if (hideRoot && isOver && !canDrop) {
				classNames.push(`${baseTreeTableClassName}__body-background--forbidden`);
			}

			return addPrefix(...classNames);
		}, [hideRoot, canDrop, isOver]);

		return (
			<TreeTableContainer
				{...props}
				bodyBGClassName={bodyBGClassName}
				bodyContentRef={setRef}
				droppable={hideRoot && isOver && canDrop}
				forbidden={hideRoot && isOver && !canDrop}
			/>
		);
	}

	DndContainer.displayName = "DndContainer";

	export const DndBodyRow = memo(function DndBodyRow(
		props: TableRenderPropsType.DndBodyRowProps<FlattenTreeTableNode>
	): ReactElement {
		const dragSourceRenderer = useTreeTableContext((context) => context.componentRenderers.dragSourceRenderer);
		const dropTargetRenderer = useTreeTableContext((context) => context.componentRenderers.dropTargetRenderer);
		const bodyRowRenderer = useTreeTableContext((context) => context.componentRenderers.bodyRowRenderer);
		const { row, canDrag: canDragProp } = props;
		const [canDrag, setCanDrag] = useState(canDragProp);
		const { style, className, wrapperRef, ...bodyRowProps } = props;

		const onMouseOver = useCallback((event: MouseEvent<HTMLElement>) => {
			setCanDrag(isInteractiveElement(event) ? false : undefined);
		}, []);

		const content = useMemo(
			() => bodyRowRenderer({ ...bodyRowProps, onMouseOver }),
			[bodyRowProps, bodyRowRenderer, onMouseOver]
		);

		return (
			<StyledTableDnDBody
				className={joinClassNames(`${baseTableClassName}__contentDnD`, className)}
				style={style}
				ref={wrapperRef}
			>
				{dragSourceRenderer({
					row,
					rowIndex: 0,
					canDrag,
					children: content
				})}
				{dropTargetRenderer({
					row,
					rowIndex: 0,
					position: TreeTableNodeDropPosition.TOP
				})}
				{dropTargetRenderer({
					row,
					rowIndex: 0,
					position: TreeTableNodeDropPosition.BOTTOM
				})}
			</StyledTableDnDBody>
		);
	});

	DndBodyRow.displayName = "DndBodyRow";

	export const DragSource = memo(function DragSource(
		props: TableRenderPropsType.DragSourceProps<FlattenTreeTableNode>
	): ReactElement {
		const acceptType = useTreeTableContext((context) => context.dragDropOptions?.acceptType || DEFAULT_ACCEPT_TYPE);
		const setIsDragging = useTreeTableContext((context) => context.setIsDragging);
		const elementRef = useRef<HTMLDivElement>(null);

		const dragItem: TreeTableRenderPropsType.DragObject = useMemo(
			() => ({
				type: acceptType,
				row: props.row,
				rowIndex: props.rowIndex
			}),
			[acceptType, props.row, props.rowIndex]
		);

		const canDragContext = useTreeTableContext((context) => context?.dragDropOptions?.canDrag?.({ dragItem }));
		const isInteractiveRowContext = useTreeTableContext(
			(context) => context.rowStyling?.({ row: props.row, rowIndex: props.rowIndex })?.interactive ?? true
		);
		const canDrag = useMemo(
			() => (props.canDrag === false ? false : isInteractiveRowContext && (canDragContext ?? true)),
			[canDragContext, isInteractiveRowContext, props.canDrag]
		);

		const canDropCallback = useTreeTableContext((context) => context.dragDropOptions?.canDrop);
		const onDropCallback = useTreeTableContext((context) => context.dragDropOptions?.onDrop);
		const onBeginDragCallback = useTreeTableContext((context) => context.dragDropOptions?.onBeginDrag);
		const onEndDragCallback = useTreeTableContext((context) => context.dragDropOptions?.onEndDrag);
		const onHoverCallback = useTreeTableContext((context) => context.dragDropOptions?.onHover);

		const [{ isDragging }, drag, preview] = useDrag<
			TableRenderPropsType.DragObject,
			TreeTableRenderPropsType.DropResult,
			{ isDragging: boolean }
		>({
			type: acceptType,
			item: () => {
				onBeginDragCallback?.({ dragItem });
				setIsDragging?.(true);

				return { ...dragItem, width: elementRef.current?.offsetWidth };
			},
			canDrag,
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

		const [{ isOverCurrent, canDrop }, drop] = useDrop<
			TableRenderPropsType.DragObject,
			TreeTableRenderPropsType.DropResult,
			{ isOverCurrent: boolean; canDrop: boolean }
		>({
			accept: acceptType,
			canDrop: (item, monitor) => {
				if (!monitor.isOver({ shallow: true })) {
					return false;
				}

				if (canDropCallback) {
					return canDropCallback({
						dragItem: monitor.getItem(),
						hoveredItem: { rowIndex: props.rowIndex, row: props.row, position: TreeTableNodeDropPosition.AS_CHILD }
					});
				}

				return true;
			},
			hover: (item, monitor) => {
				if (monitor.isOver({ shallow: true })) {
					onHoverCallback?.({
						dragItem: monitor.getItem(),
						hoveredItem: { rowIndex: props.rowIndex, row: props.row, position: TreeTableNodeDropPosition.AS_CHILD }
					});
				}
			},
			drop: (item, monitor) => {
				if (monitor.didDrop() || !monitor.getItem() || !monitor.canDrop() || !monitor.isOver({ shallow: true })) {
					return undefined;
				}

				return {
					row: props.row,
					rowIndex: props.rowIndex,
					position: TreeTableNodeDropPosition.AS_CHILD
				};
			},
			collect: (monitor) => ({
				isOverCurrent: monitor.isOver({ shallow: true }),
				canDrop: monitor.canDrop()
			})
		});

		const className = useMemo(() => {
			return joinClassNames(
				`${baseTreeTableClassName}__node`,
				`${baseTreeTableClassName}__node--level-${props.row.level}`,
				{ [`${baseTreeTableClassName}__node--draggable`]: !isDragging && canDrag },
				{ [`${baseTreeTableClassName}__node--forbidden`]: isOverCurrent && (isDragging || (!isDragging && !canDrop)) },
				{ [`${baseTreeTableClassName}__node--dragging`]: isDragging && !isOverCurrent },
				{ [`${baseTreeTableClassName}__node--droppable`]: !isDragging && isOverCurrent && canDrop },
				props.className
			);
		}, [isDragging, canDrag, isOverCurrent, canDrop, props.row.level, props.className]);

		drag(drop(elementRef));

		useKeepEditableCursorInDraggable(elementRef);

		return (
			<StyledTreeTable.StyledNode
				ref={elementRef}
				className={className}
				style={props.style}
				id={props.id}
				draggable={!isDragging && canDrag}
				dragging={isDragging && !isOverCurrent}
				droppable={!isDragging && isOverCurrent && canDrop}
				forbidden={isOverCurrent && (isDragging || (!isDragging && !canDrop))}
				data-tree-level={props.row.level}
			>
				{props.children}
			</StyledTreeTable.StyledNode>
		);
	});

	DragSource.displayName = "DragSource";

	export const DropTarget = memo(function DropTarget(
		props: TreeTableRenderPropsType.DropTargetProps<FlattenTreeTableNode>
	): ReactElement | null {
		const ref = useRef<HTMLDivElement>(null);
		const acceptType = useTreeTableContext((context) => context.dragDropOptions?.acceptType || DEFAULT_ACCEPT_TYPE);

		const canDropCallback = useTreeTableContext((context) => context.dragDropOptions?.canDrop);
		const onHoverCallback = useTreeTableContext((context) => context.dragDropOptions?.onHover);

		const [{ canDrop, isOver, isDragging, item }, dropConnector] = useDrop<
			TreeTableRenderPropsType.DragObject,
			TreeTableRenderPropsType.DropResult,
			{ canDrop: boolean; isOver: boolean; isDragging: boolean; item?: TreeTableRenderPropsType.DropTargetProps }
		>({
			accept: acceptType,
			drop: (item, monitor) => {
				if (monitor.didDrop() || !monitor.canDrop()) {
					return;
				}

				return {
					rowIndex: props.rowIndex,
					row: props.row,
					position: props.position
				};
			},
			collect: (monitor) => ({
				isOver: monitor.isOver({ shallow: true }),
				canDrop: monitor.canDrop(),
				isDragging: !!monitor.getItem(),
				item: monitor.getItem()
			}),
			canDrop: (item, monitor) => {
				if (!monitor.isOver({ shallow: true })) {
					return false;
				}

				if (canDropCallback) {
					return canDropCallback({
						dragItem: monitor.getItem(),
						hoveredItem: { rowIndex: props.rowIndex, row: props.row, position: props.position }
					});
				}

				return item?.row.id !== props.row.id;
			},
			hover: (item, monitor) => {
				onHoverCallback?.({
					dragItem: monitor.getItem(),
					hoveredItem: { rowIndex: props.rowIndex, row: props.row, position: props.position }
				});
			}
		});
		dropConnector(ref);
		const className = joinClassNames(
			`${baseTreeTableClassName}__target`,
			{ [`${baseTreeTableClassName}__target--top`]: props.position === TreeTableNodeDropPosition.TOP },
			{ [`${baseTreeTableClassName}__target--droppable`]: isOver && canDrop },
			{ [`${baseTreeTableClassName}__target--forbidden`]: isOver && !canDrop },
			props.className
		);

		if (!isDragging || item?.row === props.row) {
			return null;
		}

		return (
			<StyledTreeTable.StyledTarget
				ref={ref}
				id={props.id}
				style={props.style}
				className={className}
				top={props.position === TreeTableNodeDropPosition.TOP}
				droppable={isOver && canDrop}
				forbidden={isOver && !canDrop}
				nodeLevel={props.row.level}
				data-role={DataRoles.TreeTable.Dnd.Target}
			/>
		);
	});

	DropTarget.displayName = "DropTarget";
}

export const DefaultTreeTableComponentRenderers: TreeTableComponentRenderers<any> = {
	...DefaultTableComponentRenderers,
	bodyRenderer: (params) => <Body {...params} />,
	bodyRowRenderer: ({ key, ...params }) => <BodyRow key={key} {...params} />,
	bodyContentRenderer: (params) => <TreeTableBodyContent {...params} />,
	hierarchicalBodyContentRenderer: (params) => <HierarchicalBodyContent {...params} />,
	bodyCellRenderer: ({ key, ...params }) => <TreeTableBodyCell key={key} {...params} />,
	dndBodyRowRenderer: ({ key, ...params }) => <DndTreeTable.DndBodyRow key={key} {...params} />,
	dragSourceRenderer: (params) => <DndTreeTable.DragSource {...params} />,
	dropTargetRenderer: (params) => <DndTreeTable.DropTarget {...params} />,
	virtualizedBodyRenderer: (params) => <VirtualizedBody {...params} />
};

const TreeTableContext = createContext<TreeTableContextType<any, any, any>>({
	root: { id: "", data: [] },
	columns: [],
	componentRenderers: DefaultTreeTableComponentRenderers
});

export const TreeTableContextProvider = TreeTableContext.Provider;

export function TreeTable<
	NodeType extends BaseTreeTableNode = BaseTreeTableNode,
	ColumnType extends BaseTreeTableColumnType<NodeType> = BaseTreeTableColumnType<NodeType>,
	DragDropOptions = TreeTableDragDropOptions<NodeType>
>(props: TreeTableProps<NodeType, ColumnType, DragDropOptions>): ReactElement {
	const [isDragging, setIsDragging] = useState(false);

	const componentRenderers: TreeTableComponentRenderers<NodeType, ColumnType> = useMemo(
		() => ({ ...DefaultTreeTableComponentRenderers, ...props.componentRenderers }),
		[props.componentRenderers]
	);

	const flattenColumns = useMemo(() => {
		return flattenAllColumns<FlattenTreeTableNode<NodeType>, ColumnType>(props.columns);
	}, [props.columns]);

	const contextValue: TreeTableContextType<NodeType, ColumnType, DragDropOptions> = {
		...props,
		resizable: !!props.columnResizingOptions,
		rowKey: props.rowKey ?? (({ row }) => row.id),
		flattenColumns,
		componentRenderers,
		isDragging,
		setIsDragging
	};

	return (
		<TreeTableContext.Provider value={contextValue}>
			{props.dragDropOptions ? <DndTreeTable.DndContainer {...props} /> : <TreeTableContainer {...props} />}
		</TreeTableContext.Provider>
	);
}

TreeTable.displayName = "TreeTable";

interface TreeTableContainerProps<
	NodeType extends BaseTreeTableNode = BaseTreeTableNode,
	ColumnType extends BaseTreeTableColumnType<NodeType> = BaseTreeTableColumnType<NodeType>,
	DragDropOptions = TreeTableDragDropOptions<NodeType>
> extends TreeTableProps<NodeType, ColumnType, DragDropOptions> {
	bodyContentRef?: RefCallback<HTMLDivElement>;
	bodyBGClassName?: string;
	droppable?: boolean;
	forbidden?: boolean;
}

function TreeTableContainer<
	NodeType extends BaseTreeTableNode = BaseTreeTableNode,
	ColumnType extends BaseTreeTableColumnType<NodeType> = BaseTreeTableColumnType<NodeType>,
	DragDropOptions = TreeTableDragDropOptions<NodeType>
>(props: TreeTableContainerProps<NodeType, ColumnType, DragDropOptions>): ReactElement {
	const treeTableContext = useTreeTableContext((context) => context);
	const enableDragDrop = useTreeTableContext((context) => !!context.dragDropOptions);
	const componentRenderers = useTreeTableContext((context) => context.componentRenderers);
	const dragPreviewRenderer = useTreeTableContext((context) => context.componentRenderers.dragPreviewRenderer);
	const isDragging = useTreeTableContext((context) => context.isDragging);
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);

	const {
		bodyContentRef,
		bodyBGClassName,
		hideRoot,
		virtualScrollOptions,
		scrollToNode,
		wrapperRef,
		ariaLabel,
		ariaLabelledby,
		id,
		disableArrowNavigation,
		...rest
	} = props;
	const [isInteractiveTable, setIsInteractiveTable] = useState(false);

	const data = useFlattenTree<NodeType>();

	const renderedData: FlattenTreeTableNode<NodeType>[] = useMemo(() => {
		if (!data) {
			return [];
		}

		return hideRoot ? data.filter((row) => row.level !== -1) : data;
	}, [data, hideRoot]);

	/**
	 *  A simple workaround for typing issue with {@link DndTreeTable.DropTarget}.
	 *  Table does not render {@link DnDTable.DropTarget} with position but TreeTable does require it.
	 *  However, the rendering of DropTarget has already been controlled by TreeTable in
	 *  {@link DndTreeTable.DndBodyRow}.
	 *  Therefore, it should not cause any runtime issue. You can always remove the @ts-ignore
	 * flag below to see the typing issue.
	 */
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const tableContext: TableContextType<FlattenTreeTableNode<NodeType>, ColumnType> = treeTableContext;
	const isColumnGroup = hasColumnGroup(tableContext.columns);
	const shouldShowHiddenText = shouldHaveHiddenText<NodeType>({
		data,
		hideRoot,
		ariaLabel,
		treeTableID: id,
		isInteractiveTable
	});

	return (
		<>
			{shouldShowHiddenText && (
				<HiddenText id={`${id}-hidden-text`}>
					{StringUtils.join(
						ariaLabel,
						{ " - ": isInteractiveTable && ariaLabel },
						{ [`${languageContext.treeTableTitles?.treeTableLabel}`]: isInteractiveTable }
					)}
				</HiddenText>
			)}

			<StyledTreeTable.StyledTreeContainer id={`${id}-container`} role={props.role ?? false} fitToParent {...rest}>
				<TableContextProvider
					value={{ ...tableContext, hasColumnGroup: isColumnGroup, isInteractiveTable, setIsInteractiveTable }}
				>
					<StyledTreeTable.StyledTableContainer
						id={id}
						columns={props.columns}
						style={props.style}
						className={joinClassNames(
							baseTreeTableClassName,
							bodyBGClassName,
							{ [`${baseTableClassName}--group`]: isColumnGroup },
							{ [`${baseTableClassName}--virtual-scroll`]: props.virtualScrollOptions },
							props.className
						)}
						cardView={props.cardView}
						wrapperRef={props.wrapperRef}
						noAriaLabel // No aria-label on Tree Table since it is not read by JAWS in chrome
						interactive={!!props.rowEventHandlers}
						resizable={!!props.columnResizingOptions}
						onBlur={props.onBlur}
						role="treegrid"
						containerWrapper={bodyContentRef}
						droppable={props.droppable}
						forbidden={props.forbidden}
						virtualScroll={!!props.virtualScrollOptions}
						ariaLabelledby={StringUtils.join({ [`${id}-hidden-text`]: shouldShowHiddenText }, ariaLabelledby)}
						disableArrowNavigation={disableArrowNavigation}
					>
						{componentRenderers.headRenderer()}
						{virtualScrollOptions
							? componentRenderers.virtualizedBodyRenderer({
									data: renderedData,
									virtualScrollOptions,
									scrollToNode
								})
							: componentRenderers.bodyRenderer({ data: renderedData, scrollToNode })}
						{componentRenderers.footRenderer()}
						<TableRowScroller />
					</StyledTreeTable.StyledTableContainer>
					{enableDragDrop && isDragging && dragPreviewRenderer({})}
				</TableContextProvider>
			</StyledTreeTable.StyledTreeContainer>
		</>
	);
}

TreeTableContainer.displayName = "TreeTableContainer";

function useFlattenTree<NodeType extends BaseTreeTableNode>(): FlattenTreeTableNode<NodeType>[] | undefined {
	const root: NodeType | undefined = useTreeTableContext<NodeType>((context) => context.root);
	const hideRoot = useTreeTableContext((context) => context.hideRoot);
	const data: FlattenTreeTableNode<NodeType>[] | undefined = useTreeTableContext<NodeType>((context) => context.data);
	const rowStyling = useTreeTableContext((context) => context.rowStyling);
	const areRowsEqualCallback = useTreeTableContext((context) => context.areRowsEqual);
	const cachedRef = useRef(new TreeNodeCache<NodeType>());

	return useMemo<FlattenTreeTableNode<NodeType>[] | undefined>(() => {
		if (data) {
			return data;
		}

		if (!root) {
			return undefined;
		}

		const flattenRows: FlattenTreeTableNode<NodeType>[] = [];
		const rowIndex = 0;

		function flatten(node: NodeType, level: number, parent?: FlattenTreeTableNode<NodeType>): void {
			const newNode = { ...node, level, parent } as FlattenTreeTableNode<NodeType>;
			let flattenNode: FlattenTreeTableNode<NodeType>;

			if (cachedRef.current.has(newNode.id)) {
				const cachedNode = cachedRef.current.get(newNode.id);

				if ((areRowsEqualCallback ?? areRowsEqual)(cachedNode, newNode)) {
					flattenNode = cachedNode;
					flattenNode.children = newNode.children;
				} else {
					flattenNode = newNode;
				}
			} else {
				flattenNode = newNode;
			}

			flattenRows.push(flattenNode);

			if (rowStyling?.({ row: flattenNode, rowIndex }).collapsed && !(hideRoot && level === -1)) {
				return;
			}

			node.children?.forEach((child) => {
				flatten(child as NodeType, level + 1, flattenNode);
			});
		}

		flatten(root, hideRoot ? -1 : 0);
		cachedRef.current.clear();
		flattenRows.forEach((node) => {
			cachedRef.current.set(node.id, node);
		});

		return flattenRows;
	}, [data, root, hideRoot, rowStyling, areRowsEqualCallback]);
}

class TreeNodeCache<NodeType extends BaseTreeTableNode = BaseTreeTableNode> {
	private _cache: Map<string, FlattenTreeTableNode<NodeType>> = new Map();

	set(key: string, value: FlattenTreeTableNode<NodeType>): void {
		this._cache.set(key, value);
	}

	get(key: string): FlattenTreeTableNode<NodeType> {
		const result = this._cache.get(key);

		if (!result) {
			throw new Error(`Could not read the cached node for key "${key}".`);
		}

		return result;
	}

	has(key: string): boolean {
		return this._cache.has(key);
	}

	clear(): void {
		this._cache.clear();
	}
}
