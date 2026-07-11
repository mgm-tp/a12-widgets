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

import type { Key, ReactElement } from "react";
import { useState } from "react";

import type { TreeViewDropPosition } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { TreeView } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { FileNode } from "./basic.js";
import { FILE_TREE, fileIcon } from "./basic.js";

/** Removes the node with `key` from the forest, returning the new forest and the detached node. */
function detach(nodes: FileNode[], key: Key): { forest: FileNode[]; removed?: FileNode } {
	let removed: FileNode | undefined;

	const walk = (list: FileNode[]): FileNode[] =>
		list.reduce<FileNode[]>((acc, node) => {
			if (node.id === key) {
				removed = node;

				return acc;
			}

			acc.push(node.children ? { ...node, children: walk(node.children) } : node);

			return acc;
		}, []);

	return { forest: walk(nodes), removed };
}

/** Inserts `node` relative to `targetKey` according to the drop `position`. */
function insert(nodes: FileNode[], targetKey: Key, position: TreeViewDropPosition, node: FileNode): FileNode[] {
	return nodes.flatMap((current) => {
		if (current.id === targetKey) {
			if (position === "inside") {
				return [{ ...current, children: [...(current.children ?? []), node] }];
			}

			return position === "before" ? [node, current] : [current, node];
		}

		return [current.children ? { ...current, children: insert(current.children, targetKey, position, node) } : current];
	});
}

/**
 * A drag-and-drop tree that reparents/reorders nodes. `onDrop` reports the resolved move; this demo
 * mutates its own state in response. The self/descendant cycle guard is built in.
 */
export function DragAndDropTreeView(): ReactElement {
	const [tree, setTree] = useState<FileNode[]>(FILE_TREE);

	return (
		<TreeView<FileNode>
			tree={tree}
			rowKey="id"
			getChildren={(node) => node.children}
			getLabel={(node) => node.label}
			getIcon={fileIcon}
			defaultExpandAll
			dragDrop={{
				onDrop: ({ source, target, position }) => {
					setTree((current) => {
						const { forest, removed } = detach(current, source.id);

						return removed ? insert(forest, target.id, position, removed) : current;
					});
				}
			}}
		/>
	);
}
