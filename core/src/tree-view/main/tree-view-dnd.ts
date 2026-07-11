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

/**
 * Drag-and-drop reparenting for {@link TreeView} on `@atlaskit/pragmatic-drag-and-drop` with the
 * tree-item hitbox (before / after / inside). Self-contained within `tree-view/` — it must NOT import
 * the `data-table/` DnD helpers (that would create a `tree-view → data-table` cycle), so the small
 * pragmatic helpers are re-implemented locally and the pure instruction mappers are ported here.
 *
 * The drop geometry lives on the per-node drop target; a single container-level monitor resolves the
 * completed drop. Visuals are driven through the legacy tree's `StyledTreeContext` + `StyledTreeDropHint`,
 * so no new styling is introduced.
 * @module
 */

import type { Key, RefCallback, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import {
	draggable,
	dropTargetForElements,
	monitorForElements
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
	attachInstruction,
	extractInstruction,
	type Instruction,
	type ItemMode
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";

import type { FlatTreeRow } from "./model/index.js";
import { isSelfOrDescendant } from "./model/index.js";
import type { TreeViewDragDrop, TreeViewDropPosition } from "./tree-view.api.js";

/** Pragmatic data key under which the drag kind is carried (scopes which trees accept the drag). */
const DRAG_TYPE_KEY = "treeViewDragType";

/** Pragmatic data key under which the hovered node's flat index is carried. */
const TREE_INDEX_KEY = "treeViewRowIndex";

/** Default drag kind when the consumer does not set `acceptType`. */
const DEFAULT_ACCEPT_TYPE = "tree-view-node";

/** A ref that always holds the latest value passed to it (read fresh inside stable DnD callbacks). */
function useLatestRef<T>(value: T): RefObject<T> {
	const ref = useRef(value);
	ref.current = value;

	return ref;
}

/** Whether a pointer event originates inside an interactive control (so dragging should be suppressed). */
function isInteractiveTarget(target: EventTarget | null): boolean {
	return !!(target as HTMLElement | null)?.closest?.(
		'button, a, input, select, textarea, [role="button"], [contenteditable="true"]'
	);
}

/** Resolves the `acceptType` for a tree DnD config, falling back to the shared default. */
function resolveAcceptType(options: TreeViewDragDrop): string {
	return options.acceptType || DEFAULT_ACCEPT_TYPE;
}

/**
 * Live tree-DnD state shared from the {@link TreeView} into the per-node DnD hook and the monitor via a
 * ref, refreshed every render so the pragmatic adapters never re-bind on each render.
 *
 * @internal
 */
export interface TreeViewDnDState<RowType = unknown> {
	options: TreeViewDragDrop<RowType>;

	/** Current flattened, visible rows — indices match the rendered order. */
	rows: FlatTreeRow<RowType>[];

	/** Lookup by row key, for the cycle guard's ancestor walk. */
	metaByKey: Map<Key, FlatTreeRow<RowType>>;

	/** Resolves a row's stable key. */
	rowKeyOf: (row: RowType) => Key;

	/** Indentation in pixels per depth level (drives the hitbox geometry). */
	indentPerLevel: number;
}

/** The dragged node payload carried in pragmatic data. @internal */
export interface TreeDragItem<RowType = unknown> {
	rowIndex: number;
	row: RowType;
}

/** A resolved tree drop: the target row plus where the dragged node would land. */
interface ResolvedTreeDrop<RowType> {
	target: FlatTreeRow<RowType>;
	targetIndex: number;
	position: TreeViewDropPosition;
}

/** Visual indicator derived from the current hitbox instruction. @internal */
export interface IndicatorState {
	/** `reorder-top`/`reorder-bottom` draw a band above/below; `child` washes the row (reparent into it). */
	type: "reorder-top" | "reorder-bottom" | "child";

	/** Tree level the reorder band is indented to. */
	level: number;
	forbidden: boolean;
}

/**
 * The pragmatic hitbox item mode for a row: `expanded` when it shows children, `last-in-group` when it
 * is the last visible child of its parent (enables the reparent affordance), otherwise `standard`.
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
 * Maps a hitbox {@link Instruction} for a hovered row into a {@link ResolvedTreeDrop}, or `null` when
 * the drop is blocked. Pure (no DOM / pragmatic state), so the position mapping — including the
 * `reparent` outdent's ancestor resolution — is unit-testable independently of hitbox geometry.
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
			// level — the nearest preceding row at that level in the DFS order.
			let ancestorIndex = targetIndex;

			for (let i = targetIndex; i >= 0; i--) {
				if (rows[i]!.level === instruction.desiredLevel && rows[i]!.kind !== "load-more") {
					ancestorIndex = i;
					break;
				}
			}

			return { target: rows[ancestorIndex]!, targetIndex: ancestorIndex, position: "after" };
		}

		default:
			return null;
	}
}

/** Translates a drop target's pragmatic data into a {@link ResolvedTreeDrop}, or `null`. */
function resolveTreeDropResult<RowType>(
	targetData: Record<string | symbol, unknown>,
	state: TreeViewDnDState<RowType>
): ResolvedTreeDrop<RowType> | null {
	return mapInstructionToDropResult(extractInstruction(targetData), targetData[TREE_INDEX_KEY] as number, state.rows);
}

/**
 * Whether a drop is permitted: the consumer `canDrop` when provided, otherwise the default guard that
 * forbids dropping a node onto itself or into its own subtree (which would create a cycle).
 */
function evaluateCanDrop<RowType>(
	state: TreeViewDnDState<RowType>,
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
 * Container-level monitor that resolves a completed tree drop and fires the consumer's `onDrop`.
 * `localDragRef` (set by this tree's draggable at drag start) scopes the handler to the source tree so a
 * shared `acceptType` does not double-fire across trees.
 *
 * @internal
 */
export function useTreeViewDnDMonitor<RowType>(
	stateRef: RefObject<TreeViewDnDState<RowType>>,
	localDragRef: RefObject<boolean>,
	enabled: boolean
): void {
	useEffect(() => {
		if (!enabled) {
			return undefined;
		}

		const acceptType = resolveAcceptType(stateRef.current.options);

		return monitorForElements({
			canMonitor: ({ source }) => source.data[DRAG_TYPE_KEY] === acceptType,
			onDrop: ({ source, location }) => {
				if (!localDragRef.current) {
					return;
				}

				localDragRef.current = false;

				const state = stateRef.current;
				const dragData = source.data as unknown as TreeDragItem<RowType>;
				const target = location.current.dropTargets[0];
				const resolved = target ? resolveTreeDropResult(target.data, state) : null;

				if (resolved && evaluateCanDrop(state, dragData.row, resolved)) {
					state.options.onDrop?.({ source: dragData.row, target: resolved.target.row, position: resolved.position });
				}
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps -- rebind only when DnD toggles; live values read through refs.
	}, [enabled]);
}

/**
 * Per-node draggable + tree-aware drop target. Returns a `dragRef` to attach to the node's container
 * element plus the current {@link IndicatorState} and whether this node is being dragged.
 *
 * @internal
 */
export function useTreeViewNodeDnD<RowType>(params: {
	rowIndex: number;
	enabled: boolean;
	stateRef: RefObject<TreeViewDnDState<RowType>>;
	localDragRef: RefObject<boolean>;
}): { dragRef: RefCallback<HTMLElement | null>; indicator: IndicatorState | null; dragging: boolean } {
	const { rowIndex, enabled, stateRef, localDragRef } = params;
	const rowIndexRef = useLatestRef(rowIndex);

	const [element, setElement] = useState<HTMLElement | null>(null);
	const [indicator, setIndicator] = useState<IndicatorState | null>(null);
	const [dragging, setDragging] = useState(false);
	// Drag suppression while the pointer is over interactive children — a ref, since pragmatic reads
	// `canDrag` fresh on each dragstart and flipping it needs no re-render.
	const dragSuppressedRef = useRef(false);

	useEffect(() => {
		if (!element || !enabled) {
			return undefined;
		}

		const acceptType = resolveAcceptType(stateRef.current.options);

		const onPointerOver = (event: PointerEvent): void => {
			dragSuppressedRef.current = isInteractiveTarget(event.target);
		};

		element.addEventListener("pointerover", onPointerOver);

		const cleanup = combine(
			draggable({
				element,
				canDrag: () => {
					const row = stateRef.current.rows[rowIndexRef.current]?.row;

					return (
						!dragSuppressedRef.current && row !== undefined && (stateRef.current.options.canDrag?.({ row }) ?? true)
					);
				},
				getInitialData: () => {
					const row = stateRef.current.rows[rowIndexRef.current]?.row as RowType;

					return { [DRAG_TYPE_KEY]: acceptType, rowIndex: rowIndexRef.current, row };
				},
				onDragStart: () => {
					localDragRef.current = true;
					setDragging(true);
				},
				onDrop: () => setDragging(false)
			}),
			dropTargetForElements({
				element,
				canDrop: ({ source }) => source.data[DRAG_TYPE_KEY] === acceptType,
				getData: ({ input, element: targetElement }) => {
					const targetIndex = rowIndexRef.current;
					const targetRow = stateRef.current.rows[targetIndex];
					const mode = computeItemMode(stateRef.current.rows, targetIndex);

					return attachInstruction(
						{ [TREE_INDEX_KEY]: targetIndex },
						{
							element: targetElement,
							input,
							currentLevel: Math.max(targetRow?.level ?? 0, 0),
							indentPerLevel: stateRef.current.indentPerLevel,
							mode
						}
					);
				},
				onDrag: ({ self, source, location }) => {
					// React only when this node is the innermost target; otherwise another node owns the indicator.
					if (location.current.dropTargets[0]?.element !== element) {
						setIndicator(null);

						return;
					}

					const state = stateRef.current;
					const dragged = source.data as unknown as TreeDragItem<RowType>;
					const instruction = extractInstruction(self.data);
					const resolved = resolveTreeDropResult(self.data, state);
					const forbidden = resolved ? !evaluateCanDrop(state, dragged.row, resolved) : true;

					setIndicator(indicatorFromInstruction(instruction, forbidden));
				},
				onDragLeave: () => setIndicator(null),
				onDrop: () => setIndicator(null)
			})
		);

		return (): void => {
			element.removeEventListener("pointerover", onPointerOver);
			cleanup();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- rebind only on element swap / enable toggle; live values read through refs.
	}, [element, enabled]);

	return { dragRef: setElement, indicator, dragging };
}
