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

import {
	extractInstruction,
	type Instruction,
	type ItemMode
} from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop-hitbox/tree-item";

import type { FlatTreeRow } from "../model/index.js";
import { isSelfOrDescendant } from "../model/index.js";

import type { IndicatorState, ResolvedTreeDrop, TreeDnDCoreState } from "./tree-dnd.types.js";

/*
 * Translation between the pragmatic tree-item hitbox vocabulary (`ItemMode`,
 * `Instruction`) and this codebase's before / after / inside drop model. Pure and
 * DOM-free: shared verbatim by TreeView and DataTreeTable.
 */

/**
 * The hitbox mode for the row at `rowIndex` — which instruction zones the pragmatic
 * tree-item hitbox offers on it. `"last-in-group"` is what enables the outdent
 * ("reparent") zone, so getting it right matters for more than cosmetics.
 *
 * `"load-more"` sentinels are skipped when looking ahead: the model emits them as the
 * last entry of a paginated group, at the same level as that group's children, so
 * treating one as a real next row would report the group's last real child as
 * `"standard"` and silently drop its outdent zone.
 *
 * @internal
 */
export function computeItemMode<RowType>(rows: FlatTreeRow<RowType>[], rowIndex: number): ItemMode {
	const row = rows[rowIndex];

	// Skip a trailing "load-more" sentinel so the last real child still reads as `last-in-group`.
	let nextIndex = rowIndex + 1;

	while (rows[nextIndex]?.kind === "load-more") {
		nextIndex++;
	}

	const next = rows[nextIndex];

	if (!row) {
		return "standard";
	}

	if (next && next.level > row.level) {
		return "expanded";
	}

	if (!next || next.level < row.level) {
		return "last-in-group";
	}

	return "standard";
}

/**
 * Maps a pragmatic hitbox {@link Instruction} on the row at `targetIndex` to a
 * {@link ResolvedTreeDrop}, or `null` when the instruction carries no drop.
 *
 * @internal
 */
export function mapInstructionToDropResult<RowType>(
	instruction: Instruction | null,
	targetIndex: number,
	rows: FlatTreeRow<RowType>[]
): ResolvedTreeDrop<RowType> | null {
	const target = rows[targetIndex];

	if (!instruction || instruction.type === "instruction-blocked" || !target) {
		return null;
	}

	switch (instruction.type) {
		case "reorder-above":
			return { target, targetIndex, position: "before" };
		case "reorder-below":
			return { target, targetIndex, position: "after" };
		case "make-child":
			return { target, targetIndex, position: "inside" };
		case "reparent": {
			// Outdent: the dragged node becomes the next sibling of the ancestor at the (shallower) desired
			// level — the nearest preceding row at that level in the DFS order. Sentinels are skipped: they
			// carry their group's level but are not rows anything can be a sibling of.
			let ancestorIndex = targetIndex;

			for (let i = targetIndex; i >= 0; i--) {
				const candidate = rows[i];

				if (candidate && candidate.level === instruction.desiredLevel && candidate.kind !== "load-more") {
					ancestorIndex = i;
					break;
				}
			}

			const ancestor = rows[ancestorIndex];

			return ancestor ? { target: ancestor, targetIndex: ancestorIndex, position: "after" } : null;
		}

		default:
			return null;
	}
}

/**
 * Translates a drop target's pragmatic data into a {@link ResolvedTreeDrop}, or `null`.
 *
 * `indexKey` is the component's own pragmatic data key for the hovered row's flat
 * index — the two components use distinct keys so their payloads never cross.
 *
 * @internal
 */
export function resolveTreeDropResult<RowType>(
	targetData: Record<string | symbol, unknown>,
	rows: FlatTreeRow<RowType>[],
	indexKey: string
): ResolvedTreeDrop<RowType> | null {
	return mapInstructionToDropResult(extractInstruction(targetData), targetData[indexKey] as number, rows);
}

/**
 * Whether a drop is permitted: the consumer `canDrop` when provided, otherwise the default guard that
 * forbids dropping a node onto itself or into its own subtree (which would create a cycle).
 *
 * @internal
 */
export function evaluateTreeCanDrop<RowType>(
	state: TreeDnDCoreState<RowType>,
	sourceRow: RowType,
	resolved: ResolvedTreeDrop<RowType>
): boolean {
	if (state.options.canDrop) {
		return state.options.canDrop({ source: sourceRow, target: resolved.target.row, position: resolved.position });
	}

	return !isSelfOrDescendant(resolved.target.key, state.rowKeyOf(sourceRow), state.metaByKey);
}

/**
 * Maps the current hitbox instruction to the visual indicator placement, or `null` for none.
 *
 * @internal
 */
export function indicatorFromInstruction(instruction: Instruction | null, forbidden: boolean): IndicatorState | null {
	if (!instruction) {
		return null;
	}

	// A blocked instruction still carries a desired placement — show the band where the drop *would*
	// land, painted as forbidden by the caller.
	const resolved = instruction.type === "instruction-blocked" ? instruction.desired : instruction;

	switch (resolved.type) {
		case "reorder-above":
			return { type: "reorder-top", level: resolved.currentLevel, forbidden };
		case "reorder-below":
			return { type: "reorder-bottom", level: resolved.currentLevel, forbidden };
		case "make-child":
			return { type: "child", level: resolved.currentLevel, forbidden };
		case "reparent":
			return { type: "reorder-bottom", level: resolved.desiredLevel, forbidden };
		default:
			return null;
	}
}

/**
 * Value equality for {@link IndicatorState}, so an unchanged indicator does not
 * produce a new object and re-render the row on every `onDrag` tick.
 *
 * @internal
 */
export function isSameIndicator(a: IndicatorState | null, b: IndicatorState | null): boolean {
	if (a === b) {
		return true;
	}

	if (!a || !b) {
		return false;
	}

	return a.type === b.type && a.level === b.level && a.forbidden === b.forbidden;
}
