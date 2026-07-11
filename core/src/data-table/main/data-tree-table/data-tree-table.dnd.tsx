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
import {
	draggable,
	dropTargetForElements,
	monitorForElements
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
	attachInstruction,
	extractInstruction,
	type Instruction,
	type ItemMode
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";
import { css, styled, useTheme } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";
import { useKeepEditableCursorInDraggable } from "../../../common/main/hooks.js";
import type { FlatTreeRow } from "../../../tree-view/main/model/index.js";
import { isSelfOrDescendant } from "../../../tree-view/main/model/index.js";

import {
	captureRowSnapshot,
	DEFAULT_ACCEPT_TYPE,
	DRAG_TYPE_KEY,
	isInteractiveElement,
	useLatestRef
} from "../data-table.dnd.js";
import { useDataTableContext } from "../data-table.context.js";
import type { DataTableColumn } from "../columns.js";
import type { DataTableSlotProps } from "../data-table-slots.api.js";
import { DataTableZIndex } from "../template/data-table.z-index.js";

import type { DataTreeTableDragDrop, DataTreeTableDropPosition } from "./data-tree-table.api.js";
import { isLoadMoreSentinel } from "./data-tree-table.load-more.js";

/** Key under which the hovered row's flat index is carried in the drop target's pragmatic data. */
const TREE_INDEX_KEY = "dataTreeRowIndex";

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

/** A resolved tree drop: the hovered/target row plus where the dragged node would land. */
interface ResolvedTreeDrop<RowType> {
	target: FlatTreeRow<RowType>;
	targetIndex: number;
	position: DataTreeTableDropPosition;
}

/**
 * The dragged-row payload carried in pragmatic data.
 *
 * @internal
 */
export interface TreeDragItem<RowType = unknown> {
	rowIndex: number;
	row: RowType;
}

/**
 * Visual indicator derived from the current hitbox instruction.
 *
 * @internal
 */
export interface IndicatorState {
	/**
	 * `reorder-top`/`reorder-bottom` draw a band in the gap above/below the row (insert as a sibling);
	 * `child` highlights the row itself (reparent into it).
	 */
	type: "reorder-top" | "reorder-bottom" | "child";

	/** Tree level the reorder band is indented to (so it aligns with the prospective sibling). */
	level: number;
	forbidden: boolean;
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

		${$active &&
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
		`}
	`;
});

/** Resolves the `acceptType` for a tree DnD config, falling back to the shared default. */
function resolveAcceptType(options: DataTreeTableDragDrop): string {
	return options.acceptType || DEFAULT_ACCEPT_TYPE;
}

/**
 * The pragmatic-drag-and-drop hitbox item mode for a row: `expanded` when it shows children,
 * `last-in-group` when it is the last visible child of its parent (enables the reparent affordance),
 * otherwise `standard`.
 *
 * @internal
 */
export function computeItemMode<RowType>(rows: FlatTreeRow<RowType>[], rowIndex: number): ItemMode {
	const row = rows[rowIndex];
	const next = rows[rowIndex + 1];

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
 * the drop is blocked. Pure (no DOM / pragmatic state) so the position mapping — including the
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
			// Outdent: the dragged node becomes the next sibling of the ancestor at the (shallower)
			// desired level — the nearest preceding row at that level in the DFS order.
			let ancestorIndex = targetIndex;

			for (let i = targetIndex; i >= 0; i--) {
				if (rows[i].level === instruction.desiredLevel) {
					ancestorIndex = i;
					break;
				}
			}

			return { target: rows[ancestorIndex], targetIndex: ancestorIndex, position: "after" };
		}

		default:
			return null;
	}
}

/** Translates a drop target's pragmatic data into a {@link ResolvedTreeDrop}, or `null`. */
function resolveTreeDropResult<RowType>(
	targetData: Record<string | symbol, unknown>,
	state: TreeDnDState<RowType>
): ResolvedTreeDrop<RowType> | null {
	return mapInstructionToDropResult(extractInstruction(targetData), targetData[TREE_INDEX_KEY] as number, state.rows);
}

/**
 * Whether a drop is permitted: the consumer `canDrop` when provided, otherwise the default guard that
 * forbids dropping a node onto itself or into its own subtree (which would create a cycle).
 */
function evaluateTreeCanDrop<RowType>(
	state: TreeDnDState<RowType>,
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
				const resolved = target ? resolveTreeDropResult(target.data, state) : null;

				if (resolved && evaluateTreeCanDrop(state, dragData.row, resolved)) {
					state.options.onDrop?.({ source: dragData.row, target: resolved.target.row, position: resolved.position });
				}
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps -- rebind only when DnD toggles; live values are read through refs.
	}, [enabled]);
}

/**
 * Creates the tree-aware `dndRow` slot component bound to the wrapper's live state ref, returning a
 * stable component identity. `localDragRef` is flipped on at this tree's drag start so
 * {@link useTreeDnDMonitor} can attribute the drop to the source tree.
 *
 * @internal
 */
export function createTreeDnDSlots<RowType>(
	stateRef: RefObject<TreeDnDState<RowType>>,
	localDragRef: RefObject<boolean>
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

		const colSpan = useDataTableContext((ctx) => ctx.leafPinning.length) || 1;
		// Recognise the table's top/bottom edge so the edge bands stay inside the content box.
		const rowCount = useDataTableContext((ctx) => ctx.rowCount) ?? 0;
		const rowRef = useRef<HTMLTableRowElement | null>(null);
		const [rowEl, setRowEl] = useState<HTMLTableRowElement | null>(null);
		const [indicator, setIndicator] = useState<IndicatorState | null>(null);
		// Drag suppression while over interactive children — a ref, since pragmatic reads `canDrag`
		// fresh on each dragstart and flipping it needs no re-render.
		const dragSuppressedRef = useRef(false);
		// Pending hover-to-auto-expand timer for this row; cleared on leave/drop so it only fires while the
		// drag dwells on a collapsed parent.
		const autoExpandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

		useEffect(() => {
			const element = rowEl;

			if (!element) {
				return undefined;
			}

			const acceptType = resolveAcceptType(stateRef.current.options);
			const dragItem: TreeDragItem<RowType> = {
				rowIndex: rowMetaRef.current.rowIndex,
				row: rowMetaRef.current.row
			};

			const cleanup = combine(
				draggable({
					element,
					canDrag: () =>
						!dragSuppressedRef.current && (stateRef.current.options.canDrag?.({ row: dragItem.row }) ?? true),
					getInitialData: () => ({
						[DRAG_TYPE_KEY]: acceptType,
						...dragItem,
						...captureRowSnapshot(element)
					}),
					onGenerateDragPreview: ({ nativeSetDragImage }) => {
						disableNativeDragPreview({ nativeSetDragImage });
					},
					onDragStart: () => {
						// Mark this tree as the drag source so its monitor (not another tree sharing the accept
						// type) resolves the drop, even after the source row scrolls out of a virtualized window.
						localDragRef.current = true;
						element.style.opacity = String(styleRef.current.draggingOpacity);
						stateRef.current.options.onDragStart?.({ row: rowMetaRef.current.row });
					},
					onDrop: () => {
						element.style.opacity = "";
						// Fires at the end of every drag (drop, cancel, or escape) — the counterpart to onDragStart.
						stateRef.current.options.onDragEnd?.({ row: rowMetaRef.current.row });
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

							return;
						}

						const state = stateRef.current;
						const dragged = source.data as unknown as TreeDragItem<RowType>;
						const instruction = extractInstruction(self.data);
						const resolved = resolveTreeDropResult(self.data, state);
						const forbidden = resolved ? !evaluateTreeCanDrop(state, dragged.row, resolved) : true;

						setIndicator(indicatorFromInstruction(instruction, forbidden));
					},
					onDragLeave: () => {
						setIndicator(null);

						if (autoExpandTimerRef.current !== null) {
							clearTimeout(autoExpandTimerRef.current);
							autoExpandTimerRef.current = null;
						}
					},
					onDrop: () => {
						setIndicator(null);

						if (autoExpandTimerRef.current !== null) {
							clearTimeout(autoExpandTimerRef.current);
							autoExpandTimerRef.current = null;
						}
					}
				})
			);

			return () => {
				cleanup();

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
				element.setAttribute("data-drop-target", indicator.forbidden ? "forbidden" : "droppable");
			} else {
				element.removeAttribute("data-drop-target");
			}

			return (): void => element.removeAttribute("data-drop-target");
		}, [rowEl, indicator]);

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
