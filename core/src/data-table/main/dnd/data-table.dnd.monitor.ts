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

import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "styled-components";

import { autoScrollForElements } from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop-auto-scroll/element";
import { monitorForElements } from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop/element/adapter";

import { useLatestRef } from "../../../common/main/hooks.js";
import type { DataTableRenderPropsType } from "../data-table-renderer.api.js";
import type { TableDragDropOptions } from "../foundation/table.api.js";

import { DEFAULT_ACCEPT_TYPE, DRAG_TYPE_KEY } from "./data-table.dnd.constants.js";
import { flashRowAtIndex } from "./data-table.dnd.dom.js";
import type { ResolvedGap } from "./data-table.dnd.geometry.js";
import {
	canDropOnTarget,
	landingIndexForGap,
	resolveProjectedGap,
	rowShiftTargets
} from "./data-table.dnd.geometry.js";
import { createShiftEngine } from "./data-table.dnd.shift-engine.js";

/** @internal */
export interface UseDataTableDndMonitorArgs<RowType> {
	/** DnD options from props; the monitor is inactive without them. */
	dragDropOptions?: TableDragDropOptions<RowType>;

	/** The table element, used to detect whether a drag originated locally. */
	tableRef: { current: HTMLTableElement | null };

	/**
	 * The scroll-container element. When present it is registered as a
	 * pragmatic auto-scroll surface so dragging near its top/bottom edge scrolls
	 * the viewport — essential in virtualized mode, where a row for an off-window
	 * drop target only exists once that row is scrolled into the window.
	 */
	viewportEl?: HTMLElement | null;

	/**
	 * Live registry of this table's mounted body rows. The shift engine iterates
	 * it to open the projected gap and to hit-test the release pointer.
	 */
	dndRowRegistry: DataTableRenderPropsType.DndRowRegistry<RowType>;

	/** Model setter receiving the tracked drag, or `null` once it ends. */
	setActiveDrag: (drag: DataTableRenderPropsType.ActiveDrag<RowType> | null) => void;
}

/**
 * Per-table monitor keeping the orchestrator's `activeDrag` state in sync with
 * the pragmatic-drag-and-drop event stream and driving the **row-shift drop-gap
 * preview**: while a compatible drag is in progress the dragged row hides in
 * place (the floating preview stands in for it) and the rows between its slot and
 * the projected insertion gap slide over with a short `translate` transition — the
 * opened gap *is* the drop indicator. The styles are written by
 * {@link createShiftEngine} (no per-move React renders).
 *
 * Watches every drag whose payload type matches this table's `acceptType` —
 * including drags started in another DataTable sharing the type — so the preview
 * opens for cross-table drags, while `isLocalSource` lets only the source table
 * render the floating preview and fire the drop callbacks.
 *
 * @internal
 */
export function useDataTableDndMonitor<RowType>({
	dragDropOptions,
	tableRef,
	viewportEl,
	dndRowRegistry,
	setActiveDrag
}: UseDataTableDndMonitorArgs<RowType>): void {
	const acceptType = dragDropOptions ? dragDropOptions.acceptType || DEFAULT_ACCEPT_TYPE : undefined;
	const optionsRef = useLatestRef(dragDropOptions);
	// Themed background for the post-drop confirmation flash, read through a ref so the
	// once-bound monitor always uses the current theme without re-binding.
	const flashColorRef = useLatestRef(useTheme().components.table.bodyRow.selected.background);
	// Whether the in-flight drag started in THIS table. Captured at drag start (the
	// source element is mounted then) so the drop can still be attributed to the
	// source table even after the source row scrolls out of a virtualized window
	// and unmounts.
	const isLocalSourceRef = useRef(false);
	// Latest projected gap tracked during moves — the drop-resolution fallback for
	// the rare release pixel that lands between the rows' logical rects.
	const projectedGapRef = useRef<ResolvedGap<RowType> | null>(null);
	// One engine per registry: the registry is stable for the table's lifetime, so
	// this is effectively one engine per DataTable instance.
	const shiftEngine = useMemo(() => createShiftEngine<RowType>(dndRowRegistry), [dndRowRegistry]);

	useEffect(() => {
		if (!acceptType) {
			return undefined;
		}

		return monitorForElements({
			canMonitor: ({ source }) => source.data[DRAG_TYPE_KEY] === acceptType,
			onDragStart: ({ source }) => {
				const data = source.data as unknown as DataTableRenderPropsType.DragObject<RowType>;
				const element = source.element as HTMLTableRowElement | undefined;
				const isLocalSource = !!element && (tableRef.current?.contains(element) ?? false);

				isLocalSourceRef.current = isLocalSource;

				// The dragged segment's height is how far rows part to preview the gap.
				// Measured from the still-mounted source at drag start (works cross-table
				// too); the rare unmounted-source case falls back lazily to the hovered
				// row's height on the first move.
				const dragHeight = element
					? rowShiftTargets(element).reduce((sum, el) => sum + el.getBoundingClientRect().height, 0)
					: 0;
				// The preview needs the source row's on-screen origin, which is still
				// intact at drag start.
				const rect = element?.getBoundingClientRect();

				shiftEngine.begin({ sourceIndex: isLocalSource ? data.rowIndex : null, dragHeight });
				projectedGapRef.current = null;
				// Hide the local source right away (before any move) — its freed slot is
				// the initial gap preview.
				shiftEngine.apply();

				setActiveDrag({
					item: data,
					initialSourceClientOffset: { x: rect?.left ?? 0, y: rect?.top ?? 0 },
					isLocalSource
				});
			},
			onDrag: ({ source, location }) => {
				const options = optionsRef.current;

				if (!shiftEngine.isActive() || !options) {
					return;
				}

				const data = source.data as unknown as DataTableRenderPropsType.DragObject<RowType>;
				const point = { x: location.current.input.clientX, y: location.current.input.clientY };
				const gap = resolveProjectedGap<RowType>(dndRowRegistry, point);

				projectedGapRef.current = gap;

				// Lazy fallback: a cross-table drag whose source row was never measurable
				// parts rows by the height of the row it hovers.
				if (shiftEngine.getDragHeight() === 0 && gap) {
					const hoveredEl = dndRowRegistry.get(gap.rowIndex)?.element;

					if (hoveredEl?.isConnected) {
						shiftEngine.setDragHeight(hoveredEl.getBoundingClientRect().height);
					}
				}

				// Open the gap only when the drop would be accepted — same predicate as
				// the drop itself, so rows never part for a release that would be rejected.
				const dragItem = { rowIndex: data.rowIndex, row: data.row };
				const accepted = !!gap && canDropOnTarget(options, dragItem, { rowIndex: gap.gapIndex, row: gap.row });

				shiftEngine.setGap(accepted && gap ? gap.gapIndex : null);

				// Blocked affordance: pointer over a real row whose drop `canDrop` rejects (and not the
				// dragged row's own slot). Mark that row with the forbidden wash instead of parting rows.
				shiftEngine.setForbidden(
					gap && !accepted && gap.rowIndex !== shiftEngine.getSourceIndex()
						? (dndRowRegistry.get(gap.rowIndex)?.element ?? null)
						: null
				);

				shiftEngine.apply();
			},
			// Drop resolution lives here, not on the per-row draggable: in a virtualized
			// table the dragged source `<tr>` can unmount mid-drag (it scrolls out of the
			// rendered window), and pragmatic-drag-and-drop only dispatches `onDrop` to a
			// draggable that is still registered. The monitor is bound to the
			// always-mounted table, so it fires regardless.
			onDrop: ({ source, location }) => {
				const options = optionsRef.current;
				const data = source.data as unknown as DataTableRenderPropsType.DragObject<RowType>;
				const dragItem = { rowIndex: data.rowIndex, row: data.row };

				// A release over a registered row target (vs. an Escape-cancel or a drop in
				// empty space, both of which leave `dropTargets` empty). Resolve the gap
				// from the real release pointer — must run BEFORE the engine is cleared, since
				// the logical rects need the still-applied offsets to be recoverable. Fall back
				// to the last gap tracked during moves for a release pixel that misses.
				const dropped = location.current.dropTargets.length > 0;
				const point = { x: location.current.input.clientX, y: location.current.input.clientY };
				const resolvedGap = dropped
					? (resolveProjectedGap<RowType>(dndRowRegistry, point) ?? projectedGapRef.current)
					: null;

				// Cleared before the consumer's `onDrop` state update renders, so the new
				// row order is never painted with leftover shift styles.
				shiftEngine.clear();
				projectedGapRef.current = null;

				if (options && isLocalSourceRef.current) {
					const dropResult: DataTableRenderPropsType.DropResult<RowType> | null = resolvedGap
						? { rowIndex: resolvedGap.gapIndex, row: resolvedGap.row }
						: null;

					// Gate the drop through the SAME predicate as the shift preview
					// (`canDropOnTarget`): the consumer `canDrop` when provided, otherwise the
					// default self-reject (`dragItem.row !== hoveredItem.row`).
					if (dropResult && canDropOnTarget(options, dragItem, dropResult)) {
						options.onDrop?.({ dragItem, dropResult });
						// Confirm the landing spot with a brief flash on the row's resting slot,
						// once the consumer's reorder has re-rendered (next frame).
						flashRowAtIndex(
							dndRowRegistry,
							landingIndexForGap(dragItem.rowIndex, dropResult.rowIndex),
							flashColorRef.current
						);
					}

					options.onEndDrag?.({ dragItem, dropResult });
				}

				isLocalSourceRef.current = false;
				setActiveDrag(null);
			}
		});
	}, [acceptType, setActiveDrag, tableRef, optionsRef, dndRowRegistry, flashColorRef, shiftEngine]);

	// Edge auto-scroll on the viewport. The registration is persistent and inert
	// until a compatible drag is in progress, so it is bound once the scroll
	// element exists; `canScroll` restricts it to this table's drags.
	useEffect(() => {
		if (!acceptType || !viewportEl) {
			return undefined;
		}

		return autoScrollForElements({
			element: viewportEl,
			canScroll: ({ source }) => source.data[DRAG_TYPE_KEY] === acceptType
		});
	}, [acceptType, viewportEl]);
}
