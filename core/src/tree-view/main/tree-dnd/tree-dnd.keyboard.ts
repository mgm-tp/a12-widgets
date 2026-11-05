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

import type { Key } from "react";

import type { FlatTreeRow } from "../model/index.js";

import { evaluateTreeCanDrop } from "./tree-dnd.instructions.js";
import type { ResolvedTreeDrop, TreeDnDCoreState, TreeDropPosition } from "./tree-dnd.types.js";

/*
 * Keyboard "grab-and-move" — the non-pointer path to the same outcome as dragging,
 * per the accessibility guidance in Atlassian's Pragmatic drag-and-drop docs.
 *
 * Resolution and commit are pure functions over the flattened rows, in the same
 * before / after / inside vocabulary as the pointer hitbox, so the two paths stay
 * consistent and this is unit-testable without a DOM. Binding the actual keys is
 * each component's job — TreeView in `use-tree-view-keyboard.ts`, DataTreeTable in
 * `data-tree-table.dnd-keyboard.ts` — because the two have different focus models.
 */

/** The keyboard move actions offered by the grab-and-move handle. @internal */
export type TreeKeyboardMove = "up" | "down" | "top" | "bottom" | "into" | "out";

/**
 * Flat indices of every visible sibling sharing `parentKey`, in DFS (display) order. Top-level rows
 * (`parentKey === undefined`) are all siblings of one another. `"load-more"` sentinels are excluded.
 */
function siblingIndices<RowType>(rows: FlatTreeRow<RowType>[], parentKey: Key | undefined): number[] {
	const out: number[] = [];

	for (let j = 0; j < rows.length; j++) {
		const candidate = rows[j];

		if (candidate && candidate.kind === "node" && candidate.parentKey === parentKey) {
			out.push(j);
		}
	}

	return out;
}

/**
 * Resolves the drop a keyboard {@link TreeKeyboardMove} on the row at `rowIndex` would produce, or `null`
 * when the move does not apply (e.g. "up" on the first sibling, "out" on a root row). Pure — the same
 * before/after/inside/reparent vocabulary as the pointer hitbox, so the two paths stay consistent and
 * this is unit-testable without DOM.
 *
 * @internal
 */
export function resolveTreeKeyboardMove<RowType>(
	rows: FlatTreeRow<RowType>[],
	rowIndex: number,
	move: TreeKeyboardMove
): ResolvedTreeDrop<RowType> | null {
	const source = rows[rowIndex];

	if (!source || source.kind !== "node") {
		return null;
	}

	const group = siblingIndices(rows, source.parentKey);
	const pos = group.indexOf(rowIndex);

	if (pos < 0) {
		return null;
	}

	const at = (targetIndex: number, position: TreeDropPosition): ResolvedTreeDrop<RowType> | null => {
		const target = rows[targetIndex];

		return target ? { target, targetIndex, position } : null;
	};

	switch (move) {
		case "up":
			return pos > 0 ? at(group[pos - 1], "before") : null;
		case "down":
			return pos < group.length - 1 ? at(group[pos + 1], "after") : null;
		case "top":
			return pos > 0 ? at(group[0], "before") : null;
		case "bottom":
			return pos < group.length - 1 ? at(group[group.length - 1], "after") : null;
		case "into":
			// Nest under the preceding sibling (which then owns the moved node as its last child).
			return pos > 0 ? at(group[pos - 1], "inside") : null;
		case "out": {
			// Outdent: become the next sibling of the parent. Root nodes have no parent to outdent past.
			if (source.parentKey === undefined) {
				return null;
			}

			const parentIndex = rows.findIndex((r) => r.kind === "node" && r.key === source.parentKey);

			return parentIndex >= 0 ? at(parentIndex, "after") : null;
		}

		default:
			return null;
	}
}

/**
 * Best-effort `{position, total}` for the move announcement, computed from the destination sibling group
 * (pre-move rows). A screen-reader hint, so approximate placement on reparenting moves is acceptable.
 */
function announcePlacement<RowType>(
	rows: FlatTreeRow<RowType>[],
	resolved: ResolvedTreeDrop<RowType>
): { position: number; total: number } {
	if (resolved.position === "inside") {
		const childCount = siblingIndices(rows, resolved.target.key).length;

		return { position: childCount + 1, total: childCount + 1 };
	}

	const group = siblingIndices(rows, resolved.target.parentKey);
	const targetPos = group.indexOf(resolved.targetIndex);
	const position = resolved.position === "before" ? targetPos + 1 : targetPos + 2;

	return { position: Math.max(1, position), total: group.length };
}

/**
 * Runs a keyboard move: resolves the drop, gates it through the same `canDrop` predicate as the pointer
 * path, fires the consumer's `onDrop`, requests the post-move flash on the moved row and announces the
 * result. Returns the moved row's key on success (so the caller can refocus it once the reorder
 * re-renders), or `null` when the move did not apply / was rejected.
 *
 * @internal
 */
export function performTreeKeyboardMove<RowType>(
	state: TreeDnDCoreState<RowType>,
	rowIndex: number,
	move: TreeKeyboardMove
): Key | null {
	const resolved = resolveTreeKeyboardMove(state.rows, rowIndex, move);
	const sourceRow = state.rows[rowIndex]?.row;

	if (!resolved || sourceRow === undefined || !evaluateTreeCanDrop(state, sourceRow, resolved)) {
		return null;
	}

	state.options.onDrop?.({ source: sourceRow, target: resolved.target.row, position: resolved.position });

	const sourceKey = state.rowKeyOf(sourceRow);

	if (state.pendingFlashKeyRef) {
		state.pendingFlashKeyRef.current = sourceKey;
	}

	if (state.announce && state.titles?.movedAnnouncement) {
		const { position, total } = announcePlacement(state.rows, resolved);

		state.announce(
			state.titles.movedAnnouncement.replace("{position}", String(position)).replace("{total}", String(total))
		);
	}

	return sourceKey;
}
