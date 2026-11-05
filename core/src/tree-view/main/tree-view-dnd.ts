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
 * Drag-and-drop reparenting for {@link TreeView} on `@com.mgmtp.a12.widgets/pragmatic-drag-and-drop` with the
 * tree-item hitbox (before / after / inside).
 *
 * The pure instruction mapping, cycle guard and keyboard move arithmetic live in `./tree-dnd/`, shared
 * with `DataTreeTable`. What stays here is the pragmatic adapter binding and this component's own
 * pragmatic data keys. Note the dependency direction: `data-table/` may import `tree-view/`, never the
 * reverse — importing the `data-table/` DnD helpers from here would be a cycle.
 *
 * The drop geometry lives on the per-node drop target; a single container-level monitor resolves the
 * completed drop. Visuals: the sibling-insertion band is the tree view's own `StyledTreeViewDropBand`
 * (indented to the target level, see `tree-view.styled.ts`); the reparent affordance washes the node
 * content through the legacy `StyledTreeNodeContent` drag-over props.
 * @module
 */

import type { Key, RefCallback, RefObject } from "react";
import { useEffect, useRef, useState } from "react";

import { attachInstruction, extractInstruction } from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop-hitbox/tree-item";
import { combine } from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop/combine";
import {
	draggable,
	dropTargetForElements,
	monitorForElements
} from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop/element/adapter";

import type { DragAndDropTitles } from "../../common/main/a11y-localization/index.js";
import { triggerPostMoveFlash } from "../../common/main/dnd-flash/index.js";
import { useLatestRef } from "../../common/main/hooks.js";

import type { FlatTreeRow } from "./model/index.js";
import {
	computeItemMode,
	evaluateTreeCanDrop,
	indicatorFromInstruction,
	isSameIndicator,
	resolveTreeDropResult
} from "./tree-dnd/index.js";
import type { IndicatorState, TreeDragItem } from "./tree-dnd/index.js";
import type { TreeViewDragDrop } from "./tree-view.api.js";

/*
 * The shared tree-DnD core is re-exported so this module stays the single import
 * site for TreeView's DnD (its tests and `use-tree-view-keyboard.ts` already point
 * here). `./tree-dnd/` is internal to `core/src`, not part of any public barrel.
 */
export * from "./tree-dnd/index.js";

/** Pragmatic data key under which the drag kind is carried (scopes which trees accept the drag). */
const DRAG_TYPE_KEY = "treeViewDragType";

/** Pragmatic data key under which the hovered node's flat index is carried. */
const TREE_INDEX_KEY = "treeViewRowIndex";

/** Pragmatic data key marking the tree's root drop zone (the empty area below the last node). */
const ROOT_DROP_KEY = "treeViewRootDrop";

/** Whether a drop target's pragmatic data marks the root drop zone rather than a node. */
function isRootDropTarget(data: Record<string | symbol, unknown>): boolean {
	return data[ROOT_DROP_KEY] === true;
}

/** Default drag kind when the consumer does not set `acceptType`. */
const DEFAULT_ACCEPT_TYPE = "tree-view-node";

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

	/**
	 * Localized grab / move / drop / cancel announcements for keyboard grab-and-move. Held on the state
	 * (rather than passed per call) so `performTreeKeyboardMove` has one signature across both trees.
	 */
	titles?: DragAndDropTitles;

	/**
	 * Announces a screen-reader message through the tree's polite live region. Set by {@link TreeView}
	 * when drag-and-drop is enabled; used by the keyboard move handle to report a completed move.
	 */
	announce?: (message: string) => void;

	/** Themed background for the post-move confirmation flash. */
	flashColor?: string;

	/**
	 * Stable ref holding the key of the node to flash on the next commit (set by a keyboard move, claimed
	 * by that node's DnD hook once its row has re-rendered at its new position).
	 */
	pendingFlashKeyRef?: RefObject<Key | null>;
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

				// Dropped on the empty area below the last node (see `useTreeViewRootDropZone`): move to the top level.
				if (target && isRootDropTarget(target.data)) {
					if (state.options.canDropToRoot?.({ source: dragData.row }) ?? true) {
						state.options.onDropToRoot?.({ source: dragData.row });

						if (state.pendingFlashKeyRef) {
							state.pendingFlashKeyRef.current = state.rowKeyOf(dragData.row);
						}
					}

					return;
				}

				const resolved = target ? resolveTreeDropResult<RowType>(target.data, state.rows, TREE_INDEX_KEY) : null;

				if (resolved && evaluateTreeCanDrop(state, dragData.row, resolved)) {
					state.options.onDrop?.({ source: dragData.row, target: resolved.target.row, position: resolved.position });

					// Confirm the landing node with a post-move flash once the reorder re-renders.
					if (state.pendingFlashKeyRef) {
						state.pendingFlashKeyRef.current = state.rowKeyOf(dragData.row);
					}
				}
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps -- rebind only when DnD toggles; live values read through refs.
	}, [enabled]);
}

/**
 * Root drop zone: the tree's container becomes a drop target for the empty area below the nodes list —
 * the space under the last node when the tree has a bounded height, or an empty tree. Nodes stay the
 * innermost targets, so this never competes with a node drop. Armed only while the consumer provides
 * `onDropToRoot` (read live from the state ref). Feedback is the `data-drop-target` attribute on the
 * container (`droppable` / `forbidden`), styled by `StyledTreeContainer`.
 *
 * @internal
 */
export function useTreeViewRootDropZone<RowType>(params: {
	stateRef: RefObject<TreeViewDnDState<RowType>>;
	containerEl: HTMLElement | null;

	/** The nodes list; the zone is the container area below its bottom edge. */
	nodesEl: HTMLElement | null;
	enabled: boolean;
}): void {
	const { stateRef, containerEl, nodesEl, enabled } = params;

	useEffect(() => {
		const element = containerEl;

		if (!element || !enabled) {
			return undefined;
		}

		const acceptType = resolveAcceptType(stateRef.current.options);
		let forbidden = false;

		const clear = (): void => {
			forbidden = false;
			element.removeAttribute("data-drop-target");
		};

		// Force a `not-allowed` cursor while the forbidden zone is hovered. `dragover` bubbles up from the
		// nodes too, so only act on events from the empty area — a node owns its own cursor feedback.
		const forbidCursor = (event: DragEvent): void => {
			if (forbidden && event.dataTransfer && !nodesEl?.contains(event.target as Node)) {
				event.dataTransfer.dropEffect = "none";
			}
		};

		element.addEventListener("dragover", forbidCursor);

		const cleanup = dropTargetForElements({
			element,
			canDrop: ({ source, input }) => {
				if (source.data[DRAG_TYPE_KEY] !== acceptType || !stateRef.current.options.onDropToRoot) {
					return false;
				}

				// Only the area below the last node counts; an empty tree has an empty (zero-height) list.
				const lastNode = nodesEl?.lastElementChild;

				return !lastNode || input.clientY >= lastNode.getBoundingClientRect().bottom;
			},
			getData: () => ({ [ROOT_DROP_KEY]: true }),
			onDrag: ({ source, location }) => {
				// React only while the container itself is the innermost target.
				if (location.current.dropTargets[0]?.element !== element) {
					clear();

					return;
				}

				const dragged = source.data as unknown as TreeDragItem<RowType>;

				forbidden = !(stateRef.current.options.canDropToRoot?.({ source: dragged.row }) ?? true);
				element.setAttribute("data-drop-target", forbidden ? "forbidden" : "droppable");
			},
			onDragLeave: clear,
			onDrop: clear
		});

		return (): void => {
			cleanup();
			element.removeEventListener("dragover", forbidCursor);
			clear();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- rebind only on element swap / DnD toggle; live values read through refs.
	}, [containerEl, nodesEl, enabled]);
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
	// Mirrors `indicator.forbidden` as a ref for the synchronous `dragover` cursor listener.
	const forbiddenRef = useRef(false);

	useEffect(() => {
		if (!element || !enabled) {
			return undefined;
		}

		const acceptType = resolveAcceptType(stateRef.current.options);

		const onPointerOver = (event: PointerEvent): void => {
			dragSuppressedRef.current = isInteractiveTarget(event.target);
		};

		element.addEventListener("pointerover", onPointerOver);

		// Force a `not-allowed` cursor on forbidden positions
		const forbidCursor = (event: DragEvent): void => {
			if (forbiddenRef.current && event.dataTransfer) {
				event.dataTransfer.dropEffect = "none";
			}
		};

		element.addEventListener("dragover", forbidCursor);

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
						forbiddenRef.current = false;

						return;
					}

					const state = stateRef.current;
					const dragged = source.data as unknown as TreeDragItem<RowType>;
					const instruction = extractInstruction(self.data);
					const resolved = resolveTreeDropResult<RowType>(self.data, state.rows, TREE_INDEX_KEY);
					const forbidden = resolved ? !evaluateTreeCanDrop(state, dragged.row, resolved) : true;

					// Mirror for the native `dragover` cursor listener (read synchronously during dispatch).
					forbiddenRef.current = forbidden;

					const next = indicatorFromInstruction(instruction, forbidden);

					setIndicator((previous) => (isSameIndicator(previous, next) ? previous : next));
				},
				onDragLeave: () => {
					setIndicator(null);
					forbiddenRef.current = false;
				},
				onDrop: () => {
					setIndicator(null);
					forbiddenRef.current = false;
				}
			})
		);

		return (): void => {
			element.removeEventListener("pointerover", onPointerOver);
			element.removeEventListener("dragover", forbidCursor);
			cleanup();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- rebind only on element swap / enable toggle; live values read through refs.
	}, [element, enabled]);

	// Post-move flash claim: after a drop reorders the tree, exactly one node's key sits in the shared
	// pending-flash ref. On each commit the node whose key matches claims and clears it, then flashes its
	// own element — so the moved node lights up wherever it re-rendered. No-op under reduced motion.
	useEffect(() => {
		const state = stateRef.current;
		const pendingRef = state.pendingFlashKeyRef;
		const row = state.rows[rowIndexRef.current]?.row;

		if (!element || !pendingRef || row === undefined) {
			return;
		}

		if (pendingRef.current !== null && pendingRef.current === state.rowKeyOf(row)) {
			pendingRef.current = null;
			triggerPostMoveFlash(element, { color: state.flashColor ?? "transparent" });
		}
	});

	return { dragRef: setElement, indicator, dragging };
}
