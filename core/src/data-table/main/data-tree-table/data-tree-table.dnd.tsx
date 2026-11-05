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

import type {
	ComponentType,
	Key,
	MouseEvent,
	MouseEventHandler,
	ReactElement,
	ReactNode,
	RefCallback,
	RefObject
} from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { css, styled, useTheme } from "styled-components";

import { attachInstruction, extractInstruction } from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop-hitbox/tree-item";
import { combine } from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop/combine";
import {
	draggable,
	dropTargetForElements,
	monitorForElements
} from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop/element/disable-native-drag-preview";

import type { DragAndDropTitles } from "../../../common/main/a11y-localization/index.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { triggerPostMoveFlash } from "../../../common/main/dnd-flash/index.js";
import { useKeepEditableCursorInDraggable, useLatestRef } from "../../../common/main/hooks.js";
import type { FlatTreeRow } from "../../../tree-view/main/model/index.js";
import {
	computeItemMode,
	evaluateTreeCanDrop,
	indicatorFromInstruction,
	isSameIndicator,
	resolveTreeDropResult
} from "../../../tree-view/main/tree-dnd/index.js";
import type { IndicatorState, TreeDragItem } from "../../../tree-view/main/tree-dnd/index.js";
import type { DataTableColumn } from "../columns.js";
import type { DataTableSlotProps } from "../data-table-slots.api.js";
import { useDataTableContext } from "../data-table.context.js";
import { captureRowSnapshot, DEFAULT_ACCEPT_TYPE, DRAG_TYPE_KEY, isInteractiveElement } from "../dnd/index.js";
import { DataTableZIndex } from "../template/data-table.z-index.js";

import type { DataTreeTableDragDrop } from "./data-tree-table.api.js";
import { useDataTreeTableKeyboardReorder } from "./data-tree-table.dnd-keyboard.js";
import { isLoadMoreSentinel } from "./data-tree-table.load-more.js";

/*
 * The shared tree-DnD core is re-exported so this module stays the single import site for
 * DataTreeTable's DnD (its tests already point here). `tree-view/main/tree-dnd/` is internal to
 * `core/src` and is in no public barrel — the dependency direction `data-table → tree-view` is the
 * one that already exists (see `useTreeModel`).
 */
export * from "../../../tree-view/main/tree-dnd/index.js";

/** Key under which the hovered row's flat index is carried in the drop target's pragmatic data. */
const TREE_INDEX_KEY = "dataTreeRowIndex";

/** Pragmatic data key marking the table's root drop zone (the empty area below the last row). */
const ROOT_DROP_KEY = "dataTreeRootDrop";

/** Whether a drop target's pragmatic data marks the root drop zone rather than a row. */
function isRootDropTarget(data: Record<string | symbol, unknown>): boolean {
	return data[ROOT_DROP_KEY] === true;
}

/** Value of `data-drop-target` when the row is a valid drop destination. */
const DROP_TARGET_DROPPABLE = "droppable";

/** Value of `data-drop-target` when the row is an invalid (forbidden) drop destination. */
const DROP_TARGET_FORBIDDEN = "forbidden";

/**
 * Live tree-DnD state shared from the {@link DataTreeTable} wrapper into the DnD slot components via a
 * ref. The wrapper refreshes it every render; the slot reads `.current` at native-drag time so the
 * pragmatic adapters never re-bind on each render (consumers routinely pass inline option objects).
 *
 * @internal
 */
export interface TreeDnDState<RowType = unknown> {
	options: DataTreeTableDragDrop<RowType>;

	/** Current flattened rows — indices match the underlying {@link DataTable} `data`. */
	rows: FlatTreeRow<RowType>[];

	/** Lookup by row key, for the cycle guard's ancestor walk. */
	metaByKey: Map<Key, FlatTreeRow<RowType>>;

	/** Resolves a row's stable key. */
	rowKeyOf: (row: RowType) => Key;

	/** Indentation in pixels per depth level (drives the hitbox geometry + indicator band). */
	indentPerLevel: number;

	/** Toggles a row's expansion — used by hover-to-auto-expand. */
	toggle: (key: Key, row: RowType) => void;

	/** Localized grab / move / drop / cancel announcements for keyboard drag-and-drop. */
	titles?: DragAndDropTitles;

	/** Announces a screen-reader message through the tree table's polite live region. */
	announce?: (message: string) => void;

	/** Themed background for the post-move confirmation flash. */
	flashColor?: string;

	/**
	 * Stable ref holding the key of the row to flash on the next commit (set by a pointer drop or a
	 * keyboard move, claimed by that row's DnD slot once it has re-rendered at its new position).
	 */
	pendingFlashKeyRef?: RefObject<Key | null>;

	/** Moves focus to the row for `key` after a keyboard move re-renders (resolves key → row index). */
	focusRowByKey?: (key: Key) => void;
}

/** Default hover delay (ms) before {@link DataTreeTableDragDrop.autoExpand} expands a hovered collapsed row. */
const DEFAULT_AUTO_EXPAND_DELAY = 600;

/** Resolves the auto-expand hover delay (ms) from the option, or `null` when auto-expand is off. */
function resolveAutoExpandDelay(autoExpand: DataTreeTableDragDrop["autoExpand"]): number | null {
	if (!autoExpand) {
		return null;
	}

	return typeof autoExpand === "object" ? (autoExpand.delay ?? DEFAULT_AUTO_EXPAND_DELAY) : DEFAULT_AUTO_EXPAND_DELAY;
}

/**
 * Zero-height `<tr>` hosting a tree drop indicator between rows. A native `<tr>` cannot use the grid
 * full-width trick, so the indicator lives on a `colSpan` cell.
 */
const StyledTreeDnDIndicatorRow = styled.tr.withConfig({ displayName: "StyledDataTreeDnDIndicatorRow-sc-" })`
	height: 0;
`;

/**
 * Full-width indicator cell rendered in the zero-height gap row. Its `::before` paints a level-indented
 * filled band centred on the row gap, marking a sibling insertion point (`reorder-top`/`reorder-bottom`).
 *
 * The reparent / "inside" affordance is NOT drawn here — it washes the target row itself (background +
 * left accent on its cells), driven by the `data-drop-target` attribute the DnD row sets on the `<tr>`.
 *
 * Purely visual — the actual drop target is the row `<tr>` itself, so this cell never intercepts
 * pointer events.
 */
const StyledTreeDnDIndicatorCell = styled.td.withConfig({ displayName: "StyledDataTreeDnDIndicatorCell-sc-" })<{
	$active?: boolean;
	$forbidden?: boolean;
	$indent: number;
	$edge?: "top" | "bottom";
}>(({ theme, $active, $forbidden, $indent, $edge }) => {
	const { target } = theme.components.treeTable;
	// Centre the band on the row gap, but clamp it inside the content box at the table's top/bottom
	// edge — otherwise the spilled half enlarges the `overflow:auto` viewport's `scrollHeight` and
	// flickers a scrollbar during a drag.
	const bandTop =
		$edge === "top" ? "0px" : $edge === "bottom" ? `calc(-1 * ${target.height})` : `calc(${target.height} / -2)`;

	return css`
		padding: 0;
		border: 0;
		height: 0;
		line-height: 0;
		position: relative;
		pointer-events: none;

		${
			$active &&
			css`
				z-index: ${DataTableZIndex.stickyHeadFootAndDnd};

				&::before {
					content: "";
					position: absolute;
					left: ${$indent}px;
					right: 0;
					box-sizing: border-box;
					background-color: ${$forbidden ? target.forbiddenBG : target.droppableBG};
					border: ${$forbidden ? target.forbiddenBorder : target.droppableBorder};
					top: ${bandTop};
					height: ${target.height};
				}
			`
		}
	`;
});

/** Resolves the `acceptType` for a tree DnD config, falling back to the shared default. */
function resolveAcceptType(options: DataTreeTableDragDrop): string {
	return options.acceptType || DEFAULT_ACCEPT_TYPE;
}

/**
 * Per-table monitor that resolves tree drops. Drop handling lives on the always-mounted table, not the
 * per-row draggable, because a virtualized tree can unmount the dragged source `<tr>` mid-drag and
 * pragmatic-drag-and-drop would then never dispatch the draggable's own `onDrop`. `localDragRef` (set
 * by this tree's draggable at drag start) scopes the handler to the source tree so a shared
 * `acceptType` does not double-fire.
 *
 * @internal
 */
export function useTreeDnDMonitor<RowType>(
	stateRef: RefObject<TreeDnDState<RowType>>,
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

				// Dropped on the empty area below the last row (see `useTreeRootDropZone`): move to the top level.
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

					// Confirm the landing row with a post-move flash once the reorder re-renders (its DnD slot
					// claims the key). Shared with the keyboard path so both drop routes light up the same way.
					if (state.pendingFlashKeyRef) {
						state.pendingFlashKeyRef.current = state.rowKeyOf(dragData.row);
					}
				}
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps -- rebind only when DnD toggles; live values are read through refs.
	}, [enabled]);
}

/**
 * Root drop zone: the table's viewport `<div>` becomes a drop target for the empty area below the
 * `<table>` — the space under the last row when the table has a bounded height, or the body of an empty
 * tree. Rows stay the innermost targets, so this never competes with a row drop; hovering the header is
 * excluded by the geometry check. Armed only while the consumer provides `onDropToRoot` (read live from the
 * state ref), the counterpart of the legacy TreeTable's `hideRoot` drop onto the body. Feedback is the
 * `data-drop-target` attribute on the viewport (`droppable` / `forbidden`), which the table template turns
 * into a 2px frame around the body (below the head), as the legacy TreeTable framed its body.
 *
 * @internal
 */
export function useTreeRootDropZone<RowType>(
	stateRef: RefObject<TreeDnDState<RowType>>,
	viewportEl: HTMLElement | null,
	enabled: boolean
): void {
	useEffect(() => {
		const element = viewportEl;

		if (!element || !enabled) {
			return undefined;
		}

		const acceptType = resolveAcceptType(stateRef.current.options);
		const tableOf = (): Element | null => element.querySelector(":scope > table");
		let forbidden = false;

		const clear = (): void => {
			forbidden = false;
			element.removeAttribute("data-drop-target");
			element.style.removeProperty("--a12-tree-root-zone-top");
		};

		// The zone's frame starts under the head (see the viewport's `::after` rule): measure the head's
		// bottom edge relative to the viewport once per arming, so the frame wraps the body only.
		const measureFrameTop = (): void => {
			const head = tableOf()?.querySelector(":scope > thead");
			const top = head ? head.getBoundingClientRect().bottom - element.getBoundingClientRect().top : 0;

			element.style.setProperty("--a12-tree-root-zone-top", `${Math.max(0, top)}px`);
		};

		// Force a `not-allowed` cursor while the forbidden zone is hovered. `dragover` bubbles up from the
		// rows too, so only act on events from the empty area — a row owns its own cursor feedback.
		const forbidCursor = (event: DragEvent): void => {
			if (forbidden && event.dataTransfer && !tableOf()?.contains(event.target as Node)) {
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

				// Only the area below the table counts — never the header, and never a row (those are
				// innermost targets anyway). An empty tree has table bottom = header bottom.
				const table = tableOf();

				return !table || input.clientY >= table.getBoundingClientRect().bottom;
			},
			getData: () => ({ [ROOT_DROP_KEY]: true }),
			onDrag: ({ source, location }) => {
				// React only while the viewport itself is the innermost target.
				if (location.current.dropTargets[0]?.element !== element) {
					clear();

					return;
				}

				const dragged = source.data as unknown as TreeDragItem<RowType>;

				forbidden = !(stateRef.current.options.canDropToRoot?.({ source: dragged.row }) ?? true);

				if (!element.hasAttribute("data-drop-target")) {
					measureFrameTop();
				}

				element.setAttribute("data-drop-target", forbidden ? DROP_TARGET_FORBIDDEN : DROP_TARGET_DROPPABLE);
			},
			onDragLeave: clear,
			onDrop: clear
		});

		return (): void => {
			cleanup();
			element.removeEventListener("dragover", forbidCursor);
			clear();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- rebind only on element swap / DnD toggle; live values are read through refs.
	}, [viewportEl, enabled]);
}

/**
 * Creates the tree-aware `dndRow` slot component bound to the wrapper's live state ref, returning a
 * stable component identity. `localDragRef` is flipped on at this tree's drag start so
 * {@link useTreeDnDMonitor} can attribute the drop to the source tree. `grabbedKeyRef` holds the key of
 * the row currently picked up for keyboard grab-and-move (`null` when none is grabbed), shared across all
 * rows so only the grabbed row's arrow presses reorder.
 *
 * @internal
 */
export function createTreeDnDSlots<RowType>(
	stateRef: RefObject<TreeDnDState<RowType>>,
	localDragRef: RefObject<boolean>,
	grabbedKeyRef: RefObject<Key | null>
): {
	DndRow: ComponentType<DataTableSlotProps.DndRow<RowType, DataTableColumn<RowType>>>;
} {
	function DataTreeDnDRow(props: DataTableSlotProps.DndRow<RowType, DataTableColumn<RowType>>): ReactElement {
		const { row, rowIndex, children } = props;
		// A synthetic "load more" row is never a drag source or drop target: bind nothing and drop the bands.
		const sentinel = isLoadMoreSentinel(row);
		const theme = useTheme();
		const spacingLeft = theme.components.treeTable.node.spacingLeft;
		const draggingOpacity = theme.components.treeTable.node.draggingOpacity;
		// Theme indent for the visual band; the hitbox geometry uses the (possibly overridden) effective
		// indent from the live state ref inside `getData`.
		const bandIndentPerLevel = theme.components.tree.node.indentPaddingLeft;
		const styleRef = useLatestRef({ spacingLeft, draggingOpacity });
		const rowMetaRef = useLatestRef({ row, rowIndex });

		const tableCtx = useDataTableContext();
		const colSpan = tableCtx.leafPinning.length || 1;
		// Recognise the table's top/bottom edge so the edge bands stay inside the content box.
		const rowCount = tableCtx.rowCount ?? 0;
		const rowRef = useRef<HTMLTableRowElement | null>(null);
		const [rowEl, setRowEl] = useState<HTMLTableRowElement | null>(null);
		const [indicator, setIndicator] = useState<IndicatorState | null>(null);
		// Drag suppression while over interactive children — a ref, since pragmatic reads `canDrag`
		// fresh on each dragstart and flipping it needs no re-render.
		const dragSuppressedRef = useRef(false);
		// Pending hover-to-auto-expand timer for this row; cleared on leave/drop so it only fires while the
		// drag dwells on a collapsed parent.
		const autoExpandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
		// Mirrors `indicator.forbidden` as a ref for the synchronous `dragover` cursor listener.
		const forbiddenRef = useRef(false);

		useEffect(() => {
			const element = rowEl;

			if (!element) {
				return undefined;
			}

			const acceptType = resolveAcceptType(stateRef.current.options);

			// Read per dragstart, not captured here: this effect rebinds only when the `<tr>` is swapped, so a
			// snapshot goes stale as soon as the consumer's `onDrop` rebuilds the tree. Mirrors `useTreeViewDnD`.
			const resolveDragItem = (): TreeDragItem<RowType> | undefined => {
				const rowIndex = rowMetaRef.current.rowIndex;
				const row = stateRef.current.rows[rowIndex]?.row;

				return row === undefined ? undefined : { rowIndex, row };
			};

			// Held for the drag so `onDragStart` and `onDragEnd` report the same row — by drop time the
			// consumer's reorder may already have replaced it.
			let draggedItem: TreeDragItem<RowType> | undefined;

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
					// An unresolvable row is not draggable, which is why `getInitialData` can assume one.
					canDrag: () => {
						const item = resolveDragItem();

						return (
							!dragSuppressedRef.current &&
							item !== undefined &&
							(stateRef.current.options.canDrag?.({ row: item.row }) ?? true)
						);
					},
					getInitialData: () => {
						draggedItem = resolveDragItem();

						return {
							[DRAG_TYPE_KEY]: acceptType,
							...draggedItem,
							...captureRowSnapshot(element)
						};
					},
					onGenerateDragPreview: ({ nativeSetDragImage }) => {
						disableNativeDragPreview({ nativeSetDragImage });
					},
					onDragStart: () => {
						// Mark this tree as the drag source so its monitor (not another tree sharing the accept
						// type) resolves the drop, even after the source row scrolls out of a virtualized window.
						localDragRef.current = true;
						element.style.opacity = String(styleRef.current.draggingOpacity);

						if (draggedItem) {
							stateRef.current.options.onDragStart?.({ row: draggedItem.row });
						}
					},
					onDrop: () => {
						element.style.opacity = "";

						// Fires at the end of every drag (drop, cancel, or escape) — the counterpart to onDragStart.
						if (draggedItem) {
							stateRef.current.options.onDragEnd?.({ row: draggedItem.row });
						}

						draggedItem = undefined;
					}
				}),
				dropTargetForElements({
					element,
					canDrop: ({ source }) => source.data[DRAG_TYPE_KEY] === acceptType,
					getData: ({ input, element: targetElement }) => {
						const targetIndex = rowMetaRef.current.rowIndex;
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
					onDragEnter: ({ source }) => {
						const state = stateRef.current;
						const dragged = source.data as unknown as TreeDragItem<RowType>;
						const meta = state.rows[rowMetaRef.current.rowIndex];

						if (!meta) {
							return;
						}

						state.options.onDragEnter?.({ source: dragged.row, target: meta.row });

						// Hover-to-auto-expand: after the dwell delay, expand a collapsed, expandable row that
						// isn't the drag source — so the drop can target a currently-collapsed subtree.
						const delay = resolveAutoExpandDelay(state.options.autoExpand);
						const isSource = state.rowKeyOf(dragged.row) === meta.key;

						if (delay !== null && meta.expandable && !meta.expanded && !isSource) {
							if (autoExpandTimerRef.current !== null) {
								clearTimeout(autoExpandTimerRef.current);
							}

							autoExpandTimerRef.current = setTimeout(() => {
								autoExpandTimerRef.current = null;
								stateRef.current.toggle(meta.key, meta.row);
							}, delay);
						}
					},
					onDrag: ({ self, source, location }) => {
						// React only when this row is the innermost target; otherwise another row owns the indicator.
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

						if (autoExpandTimerRef.current !== null) {
							clearTimeout(autoExpandTimerRef.current);
							autoExpandTimerRef.current = null;
						}
					},
					onDrop: () => {
						setIndicator(null);
						forbiddenRef.current = false;

						if (autoExpandTimerRef.current !== null) {
							clearTimeout(autoExpandTimerRef.current);
							autoExpandTimerRef.current = null;
						}
					}
				})
			);

			return () => {
				cleanup();
				element.removeEventListener("dragover", forbidCursor);

				// Drop any pending auto-expand timer if the row unmounts mid-hover (e.g. under virtualization).
				if (autoExpandTimerRef.current !== null) {
					clearTimeout(autoExpandTimerRef.current);
					autoExpandTimerRef.current = null;
				}
			};
			// eslint-disable-next-line react-hooks/exhaustive-deps -- rebind only on element swap; live values are read through refs.
		}, [rowEl]);

		const dragRef = useCallback<RefCallback<HTMLTableRowElement | null>>((node) => {
			rowRef.current = node;
			setRowEl(node);
		}, []);

		// For a sentinel, never register the `<tr>` as `rowEl` so the draggable/drop effect stays inert.
		const noopRef = useCallback<RefCallback<HTMLTableRowElement | null>>(() => undefined, []);

		useKeepEditableCursorInDraggable(rowRef);

		const onMouseOver = useCallback<MouseEventHandler<HTMLElement>>((event: MouseEvent<HTMLElement>) => {
			dragSuppressedRef.current = isInteractiveElement(event);
		}, []);

		// The "inside" reparent wash lives in the StyledDataTableBodyRow rule keyed on `data-drop-target`;
		// toggled imperatively because the `<tr>` is rendered by the orchestrator's body-row slot.
		useEffect(() => {
			const element = rowEl;

			if (!element) {
				return undefined;
			}

			if (indicator?.type === "child") {
				element.setAttribute("data-drop-target", indicator.forbidden ? DROP_TARGET_FORBIDDEN : DROP_TARGET_DROPPABLE);
			} else {
				element.removeAttribute("data-drop-target");
			}

			return (): void => element.removeAttribute("data-drop-target");
		}, [rowEl, indicator]);

		// Keyboard grab-and-move (Space to grab, arrows to reorder / reparent). Bound natively on the
		// `<tr>` — see `./data-tree-table.dnd-keyboard.ts`.
		useDataTreeTableKeyboardReorder<RowType>({ rowEl, stateRef, rowMetaRef, grabbedKeyRef });

		// Post-move flash claim: after a drop / keyboard move reorders the tree, exactly one row's key sits
		// in the shared pending-flash ref. On each commit the row whose key matches claims and clears it,
		// then flashes its own `<tr>` — so the moved row lights up wherever it re-rendered. No-op under
		// reduced motion (handled inside triggerPostMoveFlash).
		useEffect(() => {
			const element = rowEl;
			const state = stateRef.current;
			const pendingRef = state.pendingFlashKeyRef;

			if (!element || !pendingRef) {
				return;
			}

			const key = state.rowKeyOf(rowMetaRef.current.row);

			if (pendingRef.current !== null && pendingRef.current === key) {
				pendingRef.current = null;
				triggerPostMoveFlash(element, { color: state.flashColor ?? "transparent" });
			}
		});

		const indent = indicator ? spacingLeft + bandIndentPerLevel * (1 + indicator.level) : 0;
		const bodyRowContent = (
			children as (args: {
				dragRef: RefCallback<HTMLTableRowElement | null>;
				onMouseOver: MouseEventHandler<HTMLElement>;
			}) => ReactNode
		)({ dragRef: sentinel ? noopRef : dragRef, onMouseOver });

		if (sentinel) {
			return <>{bodyRowContent}</>;
		}

		return (
			<>
				<StyledTreeDnDIndicatorRow data-role={DataRoles.TreeTable.Dnd.Target} aria-hidden="true">
					<StyledTreeDnDIndicatorCell
						colSpan={colSpan}
						$active={indicator?.type === "reorder-top"}
						$forbidden={indicator?.forbidden}
						$indent={indent}
						$edge={rowIndex === 0 ? "top" : undefined}
					/>
				</StyledTreeDnDIndicatorRow>
				{bodyRowContent}
				<StyledTreeDnDIndicatorRow data-role={DataRoles.TreeTable.Dnd.Target} aria-hidden="true">
					<StyledTreeDnDIndicatorCell
						colSpan={colSpan}
						$active={indicator?.type === "reorder-bottom"}
						$forbidden={indicator?.forbidden}
						$indent={indent}
						$edge={rowIndex === rowCount - 1 ? "bottom" : undefined}
					/>
				</StyledTreeDnDIndicatorRow>
			</>
		);
	}

	DataTreeDnDRow.displayName = "DataTreeDnDRow";

	return { DndRow: DataTreeDnDRow };
}
