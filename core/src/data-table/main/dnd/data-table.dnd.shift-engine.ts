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

import type { DataTableRenderPropsType } from "../data-table-renderer.api.js";

import {
	DROP_SLOT_ATTRIBUTE,
	DROP_TARGET_ATTRIBUTE,
	DROP_TARGET_FORBIDDEN,
	SHIFT_TRANSITION
} from "./data-table.dnd.constants.js";
import { rowShiftTargets, shiftForRow, slotShiftForSource } from "./data-table.dnd.geometry.js";

/**
 * Live shift-preview state for a table's rows during one drag.
 *
 * @internal
 */
interface ShiftState {
	/** Index of the drag source in THIS table; `null` when it started elsewhere. */
	sourceIndex: number | null;

	/** Height (px) of the dragged row segment — how far displaced rows move. */
	dragHeight: number;

	/** Insertion gap currently previewed, `null` when none. */
	gapIndex: number | null;

	/** Skip the shift transition when the user prefers reduced motion. */
	transition: string;

	/** Every element this drag wrote styles to, for end-of-drag cleanup. */
	touched: Set<HTMLElement>;

	/**
	 * Row currently marked as a rejected ("forbidden") drop target — the pointer is over a real row but
	 * `canDrop` refuses it, so the row shows the blocked wash (reusing the tree-table
	 * `data-drop-target="forbidden"` styling) instead of parting to open a gap. `null` when the hover is
	 * acceptable or off any row.
	 */
	forbiddenEl: HTMLElement | null;
}

/**
 * The imperative writer behind the row-shift drop-gap preview. Owns one drag's
 * worth of mutable state and every style it writes to the table's row elements,
 * so nothing here goes through React — a drag move must not re-render the table.
 *
 * @internal
 */
export interface DataTableShiftEngine {
	/** Whether a drag is currently in flight. */
	isActive(): boolean;

	/** Index of the drag source in this table; `null` for a cross-table drag. */
	getSourceIndex(): number | null;

	/** Height (px) of the dragged row segment; `0` when it could not be measured. */
	getDragHeight(): number;

	/** Late-measured drag height for a cross-table drag whose source was never measurable. */
	setDragHeight(height: number): void;

	/** Start tracking a drag. Any previous state is discarded without cleanup — call {@link clear} first. */
	begin(init: { sourceIndex: number | null; dragHeight: number }): void;

	/** Set the projected insertion gap, or `null` when no drop is accepted here. */
	setGap(gapIndex: number | null): void;

	/** Mark (or unmark) the row showing the rejected-drop wash. */
	setForbidden(element: HTMLElement | null): void;

	/** Write the current preview to the registered row elements. */
	apply(): void;

	/** Remove every style this drag wrote, in one go and without transitions. */
	clear(): void;
}

/**
 * Build a {@link DataTableShiftEngine} over a table's live row registry.
 *
 * The engine holds its state in a closure rather than a React ref for one
 * reason worth preserving: {@link DataTableShiftEngine.apply} schedules a frame to
 * arm the CSS transition, and that callback is guarded on the *identity* of the
 * state object it was scheduled for. {@link DataTableShiftEngine.clear} drops the
 * state before touching any styles, so those pending frames become no-ops instead
 * of re-adding `transition` after the cleanup has run — which would leave rows
 * animating into the committed reorder.
 *
 * @internal
 */
export function createShiftEngine<RowType>(
	registry: DataTableRenderPropsType.DndRowRegistry<RowType>
): DataTableShiftEngine {
	let state: ShiftState | null = null;

	return {
		isActive: (): boolean => state !== null,

		getSourceIndex: (): number | null => state?.sourceIndex ?? null,

		getDragHeight: (): number => state?.dragHeight ?? 0,

		setDragHeight: (height: number): void => {
			if (state) {
				state.dragHeight = height;
			}
		},

		begin: ({ sourceIndex, dragHeight }): void => {
			state = {
				sourceIndex,
				dragHeight,
				gapIndex: null,
				transition: SHIFT_TRANSITION,
				touched: new Set(),
				forbiddenEl: null
			};
		},

		setGap: (gapIndex: number | null): void => {
			if (state) {
				state.gapIndex = gapIndex;
			}
		},

		setForbidden: (element: HTMLElement | null): void => {
			if (!state) {
				return;
			}

			if (state.forbiddenEl && state.forbiddenEl !== element) {
				state.forbiddenEl.removeAttribute(DROP_TARGET_ATTRIBUTE);
			}

			if (element) {
				element.setAttribute(DROP_TARGET_ATTRIBUTE, DROP_TARGET_FORBIDDEN);
				state.touched.add(element);
			}

			state.forbiddenEl = element;
		},

		/**
		 * Runs on every drag move (not only on gap changes): under virtualization rows
		 * mount and unmount mid-drag, and a freshly mounted row must pick up its shift —
		 * writes are skipped when the element already carries the value.
		 */
		apply: (): void => {
			const current = state;

			if (!current) {
				return;
			}

			for (const [rowIndex, entry] of registry) {
				const element = entry.element;

				if (!element.isConnected) {
					continue;
				}

				const isSource = rowIndex === current.sourceIndex;
				// The source's own slot rides into the gap it will fill (its dashed
				// placeholder marks the drop location); every other row parts around that
				// gap. Both are `0` when no gap is accepted.
				const shift =
					current.gapIndex === null
						? 0
						: isSource
							? slotShiftForSource(current.sourceIndex as number, current.gapIndex, current.dragHeight)
							: shiftForRow(rowIndex, current.sourceIndex, current.gapIndex, current.dragHeight);
				// `0px` (not `0`): matches the CSSOM's serialized form, so the write-skip
				// comparison below recognises an already-applied value.
				const translate = shift ? `0px ${shift}px` : "";

				for (const target of rowShiftTargets(element)) {
					if (!current.touched.has(target)) {
						// First write to this element (drag start, or a mid-drag virtualized
						// mount): snap to the current shift without animating — only later
						// gap changes are transitions the user should see.
						current.touched.add(target);
						target.style.transition = "none";
						target.style.translate = translate;

						requestAnimationFrame(() => {
							// Identity guard — see `createShiftEngine`. A frame that lands after
							// `clear()` must not re-arm the transition.
							if (state === current) {
								target.style.transition = current.transition;
							}
						});
					} else if (target.style.translate !== translate) {
						target.style.translate = translate;
					}

					if (isSource) {
						// The source's MAIN `<tr>` keeps its box and stays visible so its dashed
						// drop-slot outline paints — StyledDataTableBodyRow hides the cell content
						// and chrome off `data-drop-slot`, and the floating preview stands in for
						// the row. Any follow rows (expansion panels) are fully hidden.
						if (target === element) {
							if (target.style.visibility === "hidden") {
								target.style.visibility = "";
							}

							if (!target.hasAttribute(DROP_SLOT_ATTRIBUTE)) {
								target.setAttribute(DROP_SLOT_ATTRIBUTE, "");
							}
						} else if (target.style.visibility !== "hidden") {
							target.style.visibility = "hidden";
						}
					} else {
						// Heals a row transiently mistaken for the source (an index reused right
						// after a mid-drag insertion) instead of leaving it hidden / slotted.
						if (target.style.visibility === "hidden") {
							target.style.visibility = "";
						}

						if (target.hasAttribute(DROP_SLOT_ATTRIBUTE)) {
							target.removeAttribute(DROP_SLOT_ATTRIBUTE);
						}
					}
				}
			}
		},

		clear: (): void => {
			const current = state;

			if (!current) {
				return;
			}

			// Dropped before touching styles so the pending transition-arming frames
			// (guarded on state identity) become no-ops instead of re-adding
			// `transition` after this cleanup.
			state = null;

			for (const element of current.touched) {
				element.style.transition = "";
				element.style.translate = "";
				element.style.visibility = "";
				// Drop the dashed drop-slot marker and any blocked-target wash so the committed
				// order paints unstyled.
				element.removeAttribute(DROP_SLOT_ATTRIBUTE);
				element.removeAttribute(DROP_TARGET_ATTRIBUTE);
			}
		}
	};
}
