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
import { useCallback, useMemo, useState } from "react";

import type {
	BaseTreeTableColumnType,
	BaseTreeTableNode,
	FlattenTreeTableNode,
	TreeTableDragDropOptions
} from "@com.mgmtp.a12.widgets/widgets-core";
import { Icon, TextOutput, TreeTableNodeDropPosition } from "@com.mgmtp.a12.widgets/widgets-core";

const noStories = {};

export default noStories;

export type FileType = "computer" | "drive" | "folder" | "file";

export interface FileNodeData {
	name: string;
	type: FileType;
	modified: string;
	size: string;
	owner: string;

	/** Marks a node that must neither be dragged nor receive a drop. */
	locked?: boolean;
}

export type FileNode = BaseTreeTableNode<FileNodeData>;
export type FlatFileNode = FlattenTreeTableNode<FileNode>;

const FILE_ICONS: Record<FileType, ReactNode> = {
	computer: <Icon>computer</Icon>,
	drive: <Icon>storage</Icon>,
	folder: <Icon>folder</Icon>,
	file: <Icon>insert_drive_file</Icon>
};

export const DND_COLUMNS: BaseTreeTableColumnType<FileNode>[] = [
	{
		label: "Name",
		hierarchical: true,
		horizontalAlignment: "left",
		width: 2,
		dataGetter: ({ row }) => <TextOutput>{row.data.name}</TextOutput>
	},
	{ label: "Type", horizontalAlignment: "left", dataGetter: ({ row }) => <TextOutput>{row.data.type}</TextOutput> },
	{
		label: "Modified",
		horizontalAlignment: "left",
		dataGetter: ({ row }) => <TextOutput>{row.data.modified}</TextOutput>
	},
	{
		label: "Size",
		horizontalAlignment: "right",
		dataGetter: ({ row }) => <TextOutput alignment="right">{row.data.size}</TextOutput>
	},
	{ label: "Owner", horizontalAlignment: "left", dataGetter: ({ row }) => <TextOutput>{row.data.owner}</TextOutput> }
];

function node(id: string, data: FileNodeData, children?: FileNode[]): FileNode {
	return { id, icon: FILE_ICONS[data.type], data, children };
}

export const DND_ROOT: FileNode = node(
	"root",
	{ name: "My Computer", type: "computer", modified: "—", size: "—", owner: "system" },
	[
		node("c", { name: "C:", type: "drive", modified: "2024-01-15", size: "500 GB", owner: "admin" }, [
			node("programs", {
				name: "Program Files",
				type: "folder",
				modified: "2024-01-10",
				size: "12 GB",
				owner: "admin"
			}),
			node("windows", { name: "Windows", type: "folder", modified: "2024-01-12", size: "30 GB", owner: "system" }, [
				node("system32", { name: "System32", type: "folder", modified: "2024-01-08", size: "8 GB", owner: "system" }, [
					node("sasser", { name: "sasser.dll", type: "file", modified: "2021-06-01", size: "124 KB", owner: "system" })
				])
			]),
			node("pagefile", { name: "pagefile.sys", type: "file", modified: "2024-01-15", size: "4 GB", owner: "system" }),
			node("locked", {
				name: "Locked (read-only)",
				type: "folder",
				modified: "2023-02-02",
				size: "2 GB",
				owner: "system",
				locked: true
			})
		]),
		node("d", { name: "D: (Data)", type: "drive", modified: "2024-01-14", size: "1 TB", owner: "user" }, [
			node("report", { name: "report.xlsx", type: "file", modified: "2024-01-14", size: "2 MB", owner: "user" })
		]),
		node("e", { name: "E: (Recovery)", type: "drive", modified: "2023-08-01", size: "16 GB", owner: "system" }, [
			node("recovery", { name: "recovery.wim", type: "file", modified: "2023-08-01", size: "15 GB", owner: "system" })
		])
	]
);

export function findNode(id: unknown, current: FileNode): FileNode | undefined {
	if (current.id === id) {
		return current;
	}

	for (const child of current.children ?? []) {
		const found = findNode(id, child);

		if (found) {
			return found;
		}
	}

	return undefined;
}

/** Whether `candidate` is the dragged node itself or one of its descendants — dropping there would create a cycle. */
function isSelfOrDescendant(dragged: FlatFileNode, candidate: FlatFileNode): boolean {
	if (dragged.id === candidate.id) {
		return true;
	}

	let parent = candidate.parent;

	while (parent) {
		if (parent.id === dragged.id) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}

/**
 * Applies a drop to the tree: removes the dragged node from its old place and re-inserts it
 * next to (`TOP`/`BOTTOM`) or inside (`AS_CHILD`) the drop target.
 */
function moveNode(
	root: FileNode,
	draggedId: unknown,
	targetId: unknown,
	position: TreeTableNodeDropPosition,
	dragged: FileNode
): FileNode {
	function update(current: FileNode): FileNode {
		let children = current.children?.filter(({ id }) => id !== draggedId);

		if (position === TreeTableNodeDropPosition.AS_CHILD) {
			// Append to the target itself; every other level only loses the dragged node.
			if (current.id === targetId) {
				children = children ? [...children, dragged] : [dragged];
			}
		} else if (children) {
			// TOP / BOTTOM: insert next to the target inside the target's parent.
			const targetIndex = children.findIndex(({ id }) => id === targetId);

			if (targetIndex >= 0) {
				const insertAt = position === TreeTableNodeDropPosition.TOP ? targetIndex : targetIndex + 1;
				children = [...children.slice(0, insertAt), dragged, ...children.slice(insertAt)];
			}
		}

		children = children?.length ? children.map(update) : undefined;

		return { id: current.id, icon: current.icon, data: current.data, children };
	}

	return update(root);
}

export interface DndTreeOptions {
	/** Additionally applies the type/lock rules of the "restrictions" story. */
	restricted?: boolean;

	/** Called after every applied drop — used by the event-log story. */
	onNodeMoved?(params: { dragged: FlatFileNode; target: FlatFileNode; position: TreeTableNodeDropPosition }): void;
}

/**
 * Keeps the tree in local state and returns the `dragDropOptions` that reorder / reparent its nodes.
 */
export function useDndTree(
	initialRoot: FileNode,
	{ restricted, onNodeMoved }: DndTreeOptions = {}
): [FileNode, TreeTableDragDropOptions<FileNode>, () => void] {
	const [root, setRoot] = useState(initialRoot);
	const reset = useCallback(() => setRoot(initialRoot), [initialRoot]);

	const dragDropOptions: TreeTableDragDropOptions<FileNode> = useMemo(
		() => ({
			canDrag: ({ dragItem }) => {
				// The root itself stays put, everything else may be picked up.
				if (dragItem.row.data.type === "computer") {
					return false;
				}

				return !restricted || !dragItem.row.data.locked;
			},
			canDrop: ({ dragItem, hoveredItem }) => {
				if (isSelfOrDescendant(dragItem.row, hoveredItem.row)) {
					return false;
				}

				const { position, row: target } = hoveredItem;
				const asChild = position === TreeTableNodeDropPosition.AS_CHILD;

				// Files never accept children, and re-parenting into the current parent is a no-op.
				if (asChild && (target.data.type === "file" || dragItem.row.parent?.id === target.id)) {
					return false;
				}

				// A drive cannot be nested and only reorders among the other drives.
				if (dragItem.row.data.type === "drive") {
					return !asChild && target.data.type === "drive";
				}

				// Nothing can be placed next to a drive except another drive.
				if (!asChild && target.data.type === "drive") {
					return false;
				}

				if (!restricted) {
					return true;
				}

				return !target.data.locked && target.data.type !== "computer";
			},
			onDrop: ({ dragItem, dropResult }) => {
				setRoot((currentRoot) =>
					moveNode(currentRoot, dragItem.row.id, dropResult.row.id, dropResult.position, dragItem.row)
				);
				onNodeMoved?.({ dragged: dragItem.row, target: dropResult.row, position: dropResult.position });
			}
		}),
		[onNodeMoved, restricted]
	);

	return [root, dragDropOptions, reset];
}
