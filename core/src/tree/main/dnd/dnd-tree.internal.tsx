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

import type { ReactNode } from "react";
import { PureComponent, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import { DragAndDropUtils } from "../../../common/main/drag-and-drop-utils.js";
import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import type { TreeNodeTemplateModel } from "../../main/tpl/tree.tpl.api.js";
import { StyledTreeContext } from "../../main/tpl/tree.tpl.api.js";

import { TreeNode } from "../tpl/tree-elements.tpl.js";

import type { DnDTreeNode, DnDTreeNodeProps, DnDTreeProps } from "./dnd-tree.api.js";
import { TreeNodeDropType } from "./dnd-tree.api.js";
import { DndTreeNodePreview } from "./dnd-tree-node-preview.js";
import { TreeInsertTarget } from "./dnd-insert-target.view.js";

const baseClassName = addPrefix("treeWidget");

interface DnDTreeNodeDragObject {
	node: DnDTreeNode;
	parentNode?: TreeNodeTemplateModel;
	level: number;
}

export class DnDRootNode extends PureComponent<DnDTreeProps> {
	static displayName = "DnDRootNode";
	render(): ReactNode {
		const { id, root, hideRoot } = this.props;

		return <TreeNodeRecursive id={id} node={root} hideRoot={hideRoot} level={hideRoot ? -1 : 0} />;
	}
}

function DndTreeNode(props: DnDTreeNodeProps): ReactNode {
	const ref = useRef<HTMLDivElement>(null);

	const insertBeforeTarget = props.insertBeforeTarget && props.parentNode && (
		<TreeInsertTarget
			top={true}
			level={props.level}
			parentNode={props.parentNode}
			subsequentNode={props.node}
			canDropOnto={props.node.canDrop}
			key="before"
			type={props.type || TreeNodeDropType}
		/>
	);

	const insertAfterTarget = (props.node.strictDnD === false || !props.children) && props.parentNode && (
		<TreeInsertTarget
			top={false}
			level={props.level}
			parentNode={props.parentNode}
			precedingNode={props.node}
			canDropOnto={props.node.canDrop}
			key="after"
			type={props.type || TreeNodeDropType}
		/>
	);

	const dragItem: DnDTreeNodeDragObject = {
		node: props.node,
		parentNode: props.parentNode,
		level: props.level
	};

	const [{ isDragging, canDrag }, drag] = useDrag<DnDTreeNodeDragObject, {}, { isDragging: boolean; canDrag: boolean }>(
		{
			type: props.type || TreeNodeDropType,
			item: (monitor) => {
				if (dragItem.parentNode && monitor.canDrag()) {
					props.node.onBeginDrag?.({ level: dragItem.level, node: dragItem.node, parentNode: dragItem.parentNode });
				}

				return dragItem;
			},
			canDrag: () =>
				!!dragItem.parentNode &&
				(props.node.canDrag?.({ level: dragItem.level, node: dragItem.node, parentNode: dragItem.parentNode }) ?? true),
			end: (item, monitor) => {
				if (monitor.didDrop()) {
					const result = monitor.getDropResult();

					if (item && result && props.node && props.node.onDragDrop) {
						props.node.onDragDrop(monitor.getItem(), result);
					}
				}

				props.node.onEndDrag?.(monitor.getItem());
			},
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
				canDrag: monitor.canDrag()
			})
		}
	);

	const [{ isOverCurrent, canDrop }, drop] = useDrop({
		accept: props.type || TreeNodeDropType,
		canDrop: (item, monitor) => {
			if (monitor.isOver({ shallow: true }) && props.node && props.node.canDrop) {
				return props.node.canDrop(props, monitor.getItem(), false);
			}

			return true;
		},
		drop: (item, monitor) => {
			const hasDroppedOnChild = monitor.didDrop();

			if (hasDroppedOnChild || !monitor.getItem() || !monitor.canDrop() || !monitor.isOver({ shallow: true })) {
				return undefined;
			}

			return {
				node: props.node,
				parentNode: props.parentNode
			};
		},
		hover: (item, monitor) => {
			if (props.node.onDragOver && !monitor.didDrop() && monitor.isOver({ shallow: true })) {
				props.node.onDragOver();
			}
		},
		collect: (monitor) => ({
			isOverCurrent: monitor.isOver({ shallow: true }),
			canDrop: monitor.canDrop()
		})
	});

	const className = joinClassNames(
		{ [`${baseClassName}__node--draggable`]: !isDragging && canDrag },
		{ [`${baseClassName}__node--dragging`]: isDragging && !isOverCurrent },
		{ [`${baseClassName}__node--dropForbidden`]: isOverCurrent && !canDrop },
		{ [`${baseClassName}__node--dragOver`]: isOverCurrent && canDrop }
	);

	drag(ref);
	drop(ref);

	return (
		<div onDragLeave={props.node.onDragLeave} ref={ref}>
			<StyledTreeContext.Provider
				value={{
					draggable: !isDragging && canDrag,
					dragging: isDragging && !isOverCurrent,
					dropForbidden: isOverCurrent && !canDrop,
					dragOver: isOverCurrent && canDrop
				}}
			>
				<TreeNode
					showArrow={!!props.children}
					label={props.node.label}
					level={props.level}
					icon={props.node.icon}
					selected={props.node.selected}
					highlightVariant={props.node.highlightVariant}
					onArrowClick={props.node.onArrowClick}
					onTitleClick={props.node.onTitleClick}
					hintPreview={[insertBeforeTarget, insertAfterTarget]}
					className={className}
					id={props.id}
					dnd
				>
					{props.children}
					{DragAndDropUtils.canUseDragPreview() && isDragging && <DndTreeNodePreview />}
				</TreeNode>
			</StyledTreeContext.Provider>
		</div>
	);
}

DndTreeNode.displayName = "DndTreeNode";

export class TreeNodeRecursive extends PureComponent<DnDTreeNodeProps> {
	static displayName = "TreeNodeRecursive";
	render(): ReactNode {
		let children: ReactNode;
		const childNodes = this.props.node.children;

		if (childNodes && childNodes.length > 0) {
			children = childNodes.map((childNode, index) => (
				<TreeNodeRecursive
					node={childNode}
					parentNode={this.props.node}
					level={this.props.level + 1}
					insertBeforeTarget={this.props.node.strictDnD === false || index === 0}
					key={index}
					id={childNode.id}
					type={this.props.node.type}
				/>
			));
		}

		if (this.props.hideRoot && this.props.level === -1) {
			return <>{children}</>;
		}

		return (
			<DndTreeNode
				node={this.props.node}
				level={this.props.level}
				parentNode={this.props.parentNode}
				insertBeforeTarget={this.props.insertBeforeTarget}
				id={this.props.id}
				type={this.props.node.type}
			>
				{children}
			</DndTreeNode>
		);
	}
}
