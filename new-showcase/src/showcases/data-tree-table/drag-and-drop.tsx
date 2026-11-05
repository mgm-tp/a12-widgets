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
import { COLUMNS, fileIcon, fileTree, useRowSelection } from "./shared.js";

const FILE_TREE = fileTree("dnd");

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
 * Pass `dragDropOptions` to make rows draggable — powered by `@com.mgmtp.a12.widgets/pragmatic-drag-and-drop` and its
 * tree-item hitbox, no provider required. Drop near a row's top/bottom edge to reorder it
 * (`before` / `after`), or over the middle of a folder to reparent it (`inside`). The self/descendant
 * cycle guard is built in; `onDrop` reports `{ source, target, position }` and the consumer mutates its
 * own tree in response. The same `onDrop` also receives keyboard moves: Space picks the focused row up,
 * the arrows and Home/End move or re-parent it, Space/Enter drop and Escape cancels. `keyboardGrabKey: false`
 * switches the pick-up off when the rows need Space for a shortcut of their own.
 *
 * With `onDropToRoot` provided, the empty area below the last row (the table here is shorter than its
 * host) becomes a drop zone that moves the row to the top level — the counterpart of the legacy
 * `TreeTable`'s `hideRoot` drop onto the body. `canDropToRoot` can forbid it per row.
 */
export function DragAndDropDataTreeTable(): ReactElement {
	const [forest, setForest] = useState<FileNode[]>(() => cloneForest(FILE_TREE));
	const { rowStyling, rowEventHandlers } = useRowSelection<FileNode>();

	return (
		<div style={{ height: 480 }}>
			<DataTreeTable<FileNode>
				ariaLabel="Files (drag to reorder / reparent)"
				tree={forest}
				getChildren={(row) => row.children}
				getIcon={fileIcon}
				columns={COLUMNS}
				rowKey="id"
				rowStyling={rowStyling}
				rowEventHandlers={rowEventHandlers}
				maxHeight={480}
				defaultExpandAll
				dragDropOptions={{
					canDropToRoot: ({ source }) => forest[forest.length - 1]?.id !== source.id,
					// Dropped on the empty area below the last row: the node becomes the last top-level row.
					onDropToRoot: ({ source }) =>
						setForest((current) => {
							const next = cloneForest(current);

							return detach(next, source.id) ? [...next, { ...source }] : current;
						}),
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
		</div>
	);
}
