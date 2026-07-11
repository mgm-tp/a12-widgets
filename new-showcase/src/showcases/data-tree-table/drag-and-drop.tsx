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

import { DataTreeTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { FileNode } from "./shared.js";
import { FILE_TREE, COLUMNS, fileIcon } from "./shared.js";

/** Deep-clones the forest so each drop produces a fresh, mutation-safe tree. */
function cloneForest(nodes: FileNode[]): FileNode[] {
	return nodes.map((node) => ({ ...node, children: node.children ? cloneForest(node.children) : undefined }));
}

/** Removes and returns the node with `id`, mutating the (already-cloned) forest in place. */
function detach(nodes: FileNode[], id: Key): FileNode | undefined {
	const index = nodes.findIndex((node) => node.id === id);

	if (index >= 0) {
		return nodes.splice(index, 1)[0];
	}

	for (const node of nodes) {
		if (node.children) {
			const removed = detach(node.children, id);

			if (removed) {
				return removed;
			}
		}
	}

	return undefined;
}

function find(nodes: FileNode[], id: Key): FileNode | undefined {
	for (const node of nodes) {
		if (node.id === id) {
			return node;
		}

		if (node.children) {
			const found = find(node.children, id);

			if (found) {
				return found;
			}
		}
	}

	return undefined;
}

function findSiblings(nodes: FileNode[], id: Key): FileNode[] | undefined {
	if (nodes.some((node) => node.id === id)) {
		return nodes;
	}

	for (const node of nodes) {
		if (node.children) {
			const siblings = findSiblings(node.children, id);

			if (siblings) {
				return siblings;
			}
		}
	}

	return undefined;
}

/**
 * Pass `dragDropOptions` to make rows draggable — powered by `@atlaskit/pragmatic-drag-and-drop` and its
 * tree-item hitbox, no provider required. Drop near a row's top/bottom edge to reorder it
 * (`before` / `after`), or over the middle of a folder to reparent it (`inside`). The self/descendant
 * cycle guard is built in; `onDrop` reports `{ source, target, position }` and the consumer mutates its
 * own tree in response.
 */
export function DragAndDropDataTreeTable(): ReactElement {
	const [forest, setForest] = useState<FileNode[]>(() => cloneForest(FILE_TREE));

	return (
		<DataTreeTable<FileNode>
			ariaLabel="Files (drag to reorder / reparent)"
			tree={forest}
			getChildren={(row) => row.children}
			getIcon={fileIcon}
			columns={COLUMNS}
			rowKey="id"
			maxHeight={360}
			defaultExpandAll
			dragDropOptions={{
				onDrop: ({ source, target, position }) => {
					setForest((current) => {
						const next = cloneForest(current);

						if (!detach(next, source.id)) {
							return current;
						}

						// Re-create the dragged node from `source` (detach mutated the clone's structure).
						const dragged: FileNode = { ...source };

						if (position === "inside") {
							const into = find(next, target.id);

							if (into) {
								into.children = [...(into.children ?? []), dragged];
							}

							return next;
						}

						const siblings = findSiblings(next, target.id);

						if (!siblings) {
							return current;
						}

						const index = siblings.findIndex((node) => node.id === target.id);
						siblings.splice(position === "before" ? index : index + 1, 0, dragged);

						return next;
					});
				}
			}}
		/>
	);
}
