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

import { useCallback, useContext, useRef } from "react";
import { useTheme } from "styled-components";

import { A11YLanguageContext } from "../../../common/main/a11y-localization/index.js";
import { useLatestRef } from "../../../common/main/hooks.js";
import type { DataTableRenderPropsType } from "../data-table-renderer.api.js";
import type { TableDragDropOptions } from "../foundation/table.api.js";

import { flashRowAtIndex } from "./data-table.dnd.dom.js";
import { canDropOnTarget, landingIndexForGap } from "./data-table.dnd.geometry.js";

/**
 * Keyboard "grab-and-move" API for DataTable body rows — the non-pointer path to the same outcome as
 * dragging (per the accessibility guidance in Atlassian's Pragmatic drag-and-drop docs). No visible
 * handle: the focused row is picked up with Space, moved one slot per Arrow press, and dropped with
 * Space (Escape cancels). `useRowArrowNavigation` owns the key bindings and calls into this.
 *
 * @internal
 */
export interface RowReorderApi {
	/**
	 * Whether keyboard reordering is available (an `onDrop` to commit to, more than one row, and a grab the
	 * consumer has not switched off).
	 */
	enabled: boolean;

	/** Whether a row is currently grabbed (so Arrow keys reorder instead of moving focus). */
	isGrabbed(): boolean;

	/** Toggle the grabbed state for the row at `rowIndex` (announces grab / drop). */
	toggleGrab(rowIndex: number): void;

	/** Exit grab mode without a further move (announces cancellation). */
	cancelGrab(): void;

	/**
	 * Move the row at `rowIndex` one slot in `direction`, firing the same `onDrop` a pointer drop would,
	 * flashing the landing row, announcing the new position and refocusing the moved row. Returns the new
	 * data index, or `null` if the move did not apply (edge of table, or `canDrop` rejected it).
	 */
	move(rowIndex: number, direction: "up" | "down"): number | null;
}

/** @internal */
export interface UseDataTableKeyboardReorderArgs<RowType> {
	/** DnD options from props; reordering is disabled without them. */
	dragDropOptions?: TableDragDropOptions<RowType>;

	/** Accessor for the row datum at a data index (reads the current data). */
	rowByIndex: (index: number) => RowType | undefined;

	/** Total number of body rows. */
	rowCount: number;

	/** Live registry of mounted rows, used to flash and refocus the landing row. */
	dndRowRegistry: DataTableRenderPropsType.DndRowRegistry<RowType>;

	/** Announces move / grab / drop messages through the table's live region. */
	announce: (message: string) => void;
}

/**
 * Builds the {@link RowReorderApi} consumed by `useRowArrowNavigation`. Holds the grabbed state in
 * a ref (flipping it never needs a re-render), and reads options / data / labels through refs so the
 * returned callbacks stay identity-stable.
 *
 * @internal
 */
export function useDataTableKeyboardReorder<RowType>({
	dragDropOptions,
	rowByIndex,
	rowCount,
	dndRowRegistry,
	announce
}: UseDataTableKeyboardReorderArgs<RowType>): RowReorderApi {
	const titles = useContext(A11YLanguageContext).dragAndDropTitles;
	const flashColor = useTheme().components.table.bodyRow.selected.background;
	const grabbedRef = useRef(false);

	const optionsRef = useLatestRef(dragDropOptions);
	const rowByIndexRef = useLatestRef(rowByIndex);
	const rowCountRef = useLatestRef(rowCount);
	const titlesRef = useLatestRef(titles);
	const flashColorRef = useLatestRef(flashColor);

	const move = useCallback(
		(rowIndex: number, direction: "up" | "down"): number | null => {
			const options = optionsRef.current;
			const rowAt = rowByIndexRef.current;
			const count = rowCountRef.current;
			const source = rowAt(rowIndex);

			if (!options || source === undefined) {
				return null;
			}

			const isUp = direction === "up";

			if (isUp ? rowIndex <= 0 : rowIndex >= count - 1) {
				return null;
			}

			// Gap arithmetic mirrors the pointer path (see landingIndexForGap): an upward move inserts at
			// the previous index; a downward move targets two ahead (removing the source shifts gaps down).
			const gapIndex = isUp ? rowIndex - 1 : rowIndex + 2;
			const hoveredRow = rowAt(isUp ? rowIndex - 1 : rowIndex + 1);

			if (hoveredRow === undefined) {
				return null;
			}

			const dragItem = { rowIndex, row: source };
			const dropResult = { rowIndex: gapIndex, row: hoveredRow };

			// Gate through the SAME predicate as the pointer path so keyboard moves honour `canDrop`.
			if (!canDropOnTarget(options, dragItem, dropResult)) {
				return null;
			}

			options.onDrop?.({ dragItem, dropResult });

			const landing = landingIndexForGap(rowIndex, gapIndex);

			flashRowAtIndex(dndRowRegistry, landing, flashColorRef.current);

			// Refocus the moved row once the consumer's reorder has re-rendered, so consecutive Arrow
			// presses keep moving the same row and the roving tab stop follows it.
			if (typeof requestAnimationFrame === "function") {
				requestAnimationFrame(() => {
					const element = dndRowRegistry.get(landing)?.element;

					if (element?.isConnected) {
						element.focus();
					}
				});
			}

			const moved = titlesRef.current?.movedAnnouncement;

			if (moved) {
				announce(moved.replace("{position}", String(landing + 1)).replace("{total}", String(count)));
			}

			return landing;
		},
		[optionsRef, rowByIndexRef, rowCountRef, titlesRef, flashColorRef, dndRowRegistry, announce]
	);

	const toggleGrab = useCallback(
		(rowIndex: number): void => {
			const options = optionsRef.current;
			const source = rowByIndexRef.current(rowIndex);

			if (!options || source === undefined) {
				return;
			}

			if (!grabbedRef.current) {
				if (!(options.canDrag?.({ dragItem: { rowIndex, row: source } }) ?? true)) {
					return;
				}

				grabbedRef.current = true;

				if (titlesRef.current?.grabInstructions) {
					announce(titlesRef.current.grabInstructions);
				}
			} else {
				grabbedRef.current = false;

				if (titlesRef.current?.dropped) {
					announce(titlesRef.current.dropped);
				}
			}
		},
		[optionsRef, rowByIndexRef, titlesRef, announce]
	);

	const cancelGrab = useCallback((): void => {
		if (!grabbedRef.current) {
			return;
		}

		grabbedRef.current = false;

		if (titlesRef.current?.moveCancelled) {
			announce(titlesRef.current.moveCancelled);
		}
	}, [titlesRef, announce]);

	const isGrabbed = useCallback((): boolean => grabbedRef.current, []);

	// Keyboard reorder is meaningful only when there is an `onDrop` to report the move to: `move()` and
	// the pointer path both commit through `onDrop`, so without it a grab would announce and flash a
	// "moved to position N" that never actually reorders anything. Gate on it (not merely the presence of
	// `dragDropOptions`) — this is also what keeps `DataTreeTable` honest: it hands the inner DataTable
	// only `{ acceptType }` to power the pointer machinery and keeps its real reparenting `onDrop` in its
	// own tree-aware monitor, so flat-index keyboard grab-and-move stays disabled there rather than
	// firing phantom announcements against a callback that isn't wired up.
	//
	// `keyboardGrabKey: false` disables the keyboard path only; pointer dragging is unaffected.
	const keyboardGrabEnabled = (dragDropOptions?.keyboardGrabKey ?? "Space") !== false;

	return {
		enabled: keyboardGrabEnabled && !!dragDropOptions?.onDrop && rowCount > 1,
		isGrabbed,
		toggleGrab,
		cancelGrab,
		move
	};
}
