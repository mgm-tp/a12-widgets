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

import type { FC, ReactNode } from "react";
import { useState, useCallback } from "react";
import { faker as Faker } from "@faker-js/faker/locale/en";

import { LayoutGrid, provider } from "@com.mgmtp.a12.widgets/widgets-core";

import { DragAndDrop } from "./main/showcase-drag-and-drop.api.js";
import type { DragAndDropTableProps } from "./main/table.js";
import { DragAndDropTable, isTableDragItem, isTableDropResult, isTableHoveredObject } from "./main/table.js";
import type { DragAndDropTreeProps } from "./main/tree.js";
import { DragAndDropTree, isTreeDragItem, isTreeDropTarget } from "./main/tree.js";
import { addTableRowReference, removeTableRowReference, updateTableRow, useTableData } from "./shared/table.js";
import { updateTreeNode, useTreeNodeData } from "./shared/tree.js";

const isPhone = provider.isPhone();

export const BetweenTreeAndTable: FC = () => {
	const [data, setData] = useState(DATA);

	const canDropTable = useCallback<DragAndDropTableProps["canDrop"]>(({ hoveredItem }) => {
		if (isTreeDropTarget(hoveredItem)) {
			return hoveredItem.node.id === TREE_ROOT_ID;
		} else if (isTableHoveredObject(hoveredItem)) {
			return true;
		}

		return false;
	}, []);

	const canDropTree = useCallback<DragAndDropTreeProps["canDrop"]>((dropTarget, dragSource) => {
		if (isTreeDragItem(dragSource)) {
			if (dropTarget.node.id !== TREE_ROOT_ID) {
				return false;
			}

			if (dragSource.parentNode?.id === dropTarget.node.id) {
				return false;
			}
		}

		if (isTableDragItem(dragSource)) {
			if (dropTarget.node.id !== TREE_ROOT_ID) {
				return false;
			}
		}

		return true;
	}, []);

	const onTableDragDrop = useCallback<DragAndDropTableProps["onDrop"]>(({ dragItem, dropResult }) => {
		setData((currentData) => {
			let nextData = { ...currentData };
			// Remove previous node reference
			let draggedItemId = -1;

			if (isTreeDragItem(dragItem)) {
				draggedItemId = dragItem.node.id;

				if (isTreeDropTarget(dropResult) && dragItem.parentNode) {
					nextData = updateTreeNode(nextData, dragItem.parentNode.id, (parent) => ({
						...parent,
						children: parent.children?.filter((id) => id !== draggedItemId)
					}));
				}
			} else if (isTableDragItem(dragItem)) {
				draggedItemId = dragItem.row.id;
				nextData = removeTableRowReference(nextData, TABLE_ROOT_ID, draggedItemId, dragItem.rowIndex);
			}

			// Add new node reference
			if (isTreeDropTarget(dropResult)) {
				const dropItemId = dropResult.node.id;
				nextData = updateTreeNode(nextData, dropItemId, (droppedNode) => ({
					...droppedNode,
					children: [...(droppedNode.children ?? []).filter((id) => id !== draggedItemId), draggedItemId]
				}));

				if (DragAndDrop.isTableRow(nextData[draggedItemId])) {
					nextData = updateTableRow(nextData, draggedItemId, (node) => {
						const droppedNode = nextData[dropItemId];

						if (!droppedNode) {
							throw new Error(`Cannot find drop item with ID ${dropItemId}`);
						}

						return { ...node, position: droppedNode.position };
					});
				}
			} else if (isTableDropResult(dropResult)) {
				nextData = addTableRowReference(nextData, TABLE_ROOT_ID, draggedItemId, dropResult.rowIndex);

				if (DragAndDrop.isTreeNode(nextData[draggedItemId])) {
					nextData = updateTreeNode(nextData, draggedItemId, (node) => ({
						...node,
						position: dropResult.row.position
					}));
				}
			}

			return nextData;
		});
	}, []);

	const onTreeDragDrop = useCallback<DragAndDropTreeProps["onDragDrop"]>(
		(dragItem, dropTarget) => {
			if (
				(isTableDragItem(dragItem) || isTreeDragItem(dragItem)) &&
				(isTableDropResult(dropTarget) || isTreeDropTarget(dropTarget))
			) {
				onTableDragDrop({ dragItem, dropResult: dropTarget });
			}
		},
		[onTableDragDrop]
	);

	const leftTree = useTreeNodeData(data, TREE_ROOT_ID, { component: "tree", side: "left" });
	const rightTable = useTableData(data, TABLE_ROOT_ID, { component: "table", side: "right" });
	const { Grid, Column, Row } = LayoutGrid;

	return (
		<Grid fitToParent={isPhone}>
			<Row className={isPhone ? "-u-margin-xs" : "-u-margin-sm"}>
				<Column size={{ sm: 12, md: 6, lg: 6 }} className="-u-background-white">
					<DragAndDropTree
						root={leftTree}
						onDragDrop={onTreeDragDrop}
						canDrop={canDropTree}
						dataGetter={(node) => node.data[0]}
						acceptType={DragAndDrop.UniqueDnDType}
					/>
				</Column>
				<Column size={{ sm: 12, md: 6, lg: 6 }} className="-u-background-white">
					<DragAndDropTable
						data={rightTable}
						onDrop={onTableDragDrop}
						canDrop={canDropTable}
						acceptType={DragAndDrop.UniqueDnDType}
					/>
				</Column>
			</Row>
		</Grid>
	);
};

const TREE_ROOT_ID = 1;
const TABLE_ROOT_ID = 9;
const DATA: DragAndDrop.UiData = {
	1: {
		id: 1,
		data: ["A12"],
		position: { component: "tree", side: "left" },
		children: [2, 3, 4, 5, 6, 7, 8]
	},
	2: {
		id: 2,
		data: createCells(),
		position: { component: "tree", side: "left" }
	},
	3: {
		id: 3,
		data: createCells(),
		position: { component: "tree", side: "left" }
	},
	4: {
		id: 4,
		data: createCells(),
		position: { component: "tree", side: "left" }
	},
	5: {
		id: 5,
		data: createCells(),
		position: { component: "tree", side: "left" }
	},
	6: {
		id: 6,
		data: createCells(),
		position: { component: "tree", side: "left" }
	},
	7: {
		id: 7,
		data: createCells(),
		position: { component: "tree", side: "left" }
	},
	8: {
		id: 8,
		data: createCells(),
		position: { component: "tree", side: "left" }
	},
	9: {
		id: 9,
		data: [],
		position: { component: "tree", side: "right" },
		children: [10, 11, 12, 13, 14, 15, 16, 17, 18]
	},
	10: {
		id: 10,
		data: createCells(),
		position: { component: "table", side: "right" }
	},
	11: {
		id: 11,
		data: createCells(),
		position: { component: "table", side: "right" }
	},
	12: {
		id: 12,
		data: createCells(),
		position: { component: "table", side: "right" }
	},
	13: {
		id: 13,
		data: createCells(),
		position: { component: "table", side: "right" }
	},
	14: {
		id: 14,
		data: createCells(),
		position: { component: "table", side: "right" }
	},
	15: {
		id: 15,
		data: createCells(),
		position: { component: "table", side: "right" }
	},
	16: {
		id: 16,
		data: createCells(),
		position: { component: "table", side: "right" }
	},
	17: {
		id: 17,
		data: createCells(),
		position: { component: "table", side: "right" }
	},
	18: {
		id: 18,
		data: createCells(),
		position: { component: "table", side: "right" }
	}
};

function createCells(): ReactNode[] {
	return [
		Faker.person.firstName() + " " + Faker.person.lastName(),
		Faker.location.street(),
		Faker.phone.number(),
		Faker.person.jobTitle()
	];
}
