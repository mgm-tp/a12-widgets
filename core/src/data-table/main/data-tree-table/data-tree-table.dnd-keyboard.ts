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

import type { Key, RefObject } from "react";
import { useEffect } from "react";

import { isKeyboardGrabKey } from "../../../common/main/utils.js";
import type { TreeKeyboardMove } from "../../../tree-view/main/tree-dnd/index.js";
import { performTreeKeyboardMove } from "../../../tree-view/main/tree-dnd/index.js";

import type { TreeDnDState } from "./data-tree-table.dnd.js";

/** Args for {@link useDataTreeTableKeyboardReorder}. @internal */
export interface UseDataTreeTableKeyboardReorderArgs<RowType> {
	/** The row's `<tr>`, or `null` before it mounts. The listener rebinds when it is swapped. */
	rowEl: HTMLTableRowElement | null;

	/** Live tree-DnD state from the {@link DataTreeTable} wrapper. */
	stateRef: RefObject<TreeDnDState<RowType>>;

	/** This row's current data index, read fresh so a reorder does not need a rebind. */
	rowMetaRef: RefObject<{ rowIndex: number }>;

	/**
	 * Key of the row currently picked up, shared across every row of the tree so only the grabbed row's
	 * arrow presses reorder. `null` when nothing is grabbed.
	 */
	grabbedKeyRef: RefObject<Key | null>;
}

/**
 * Keyboard grab-and-move for one `DataTreeTable` body row.
 *
 * Space grabs the focused row unless `keyboardGrabKey` switches the pick-up off (Escape / Enter / Space
 * release), then the arrows reorder it: ↑/↓ among siblings, Home/End to the ends of the sibling group,
 * → nests under the preceding sibling, ← outdents to the parent's level. Every move goes through
 * {@link performTreeKeyboardMove}, so it is gated by the same `canDrop` as a pointer drop and produces
 * the same before / after / inside result.
 *
 * The listener is bound natively on the `<tr>` — the roving tab stop the inner `DataTable` manages —
 * rather than through React, and stops propagation on the keys it consumes so the table's own
 * arrow-key navigation never also acts on a grabbed move. Presses on any row that is not the grabbed
 * one fall through untouched.
 *
 * `TreeView` has the equivalent in `use-tree-view-keyboard.ts`. The two bind differently on purpose:
 * TreeView roves focus over node *content* elements and owns a single container-level handler, while
 * here the focusable unit is the table row and the binding is per row.
 *
 * @internal
 */
export function useDataTreeTableKeyboardReorder<RowType>({
	rowEl,
	stateRef,
	rowMetaRef,
	grabbedKeyRef
}: UseDataTreeTableKeyboardReorderArgs<RowType>): void {
	useEffect(() => {
		const element = rowEl;

		if (!element) {
			return undefined;
		}

		const handleKeyDown = (event: KeyboardEvent): void => {
			// Only when the row itself is focused — never hijack keys from a control inside a cell.
			if (event.target !== element) {
				return;
			}

			const state = stateRef.current;
			const meta = state.rows[rowMetaRef.current.rowIndex];

			if (!meta || meta.kind !== "node") {
				return;
			}

			// Not grabbed: Space picks the row up (when draggable); everything else falls through to the
			// DataTable's roving-focus navigation.
			if (grabbedKeyRef.current === null) {
				const grabKey = state.options.keyboardGrabKey ?? "Space";

				if (isKeyboardGrabKey(event, grabKey) && (state.options.canDrag?.({ row: meta.row }) ?? true)) {
					event.preventDefault();
					event.stopPropagation();
					grabbedKeyRef.current = meta.key;

					if (state.titles?.grabInstructions) {
						state.announce?.(state.titles.grabInstructions);
					}
				}

				return;
			}

			// Grabbed mode is single-row: ignore presses on any row other than the grabbed one.
			if (grabbedKeyRef.current !== meta.key) {
				return;
			}

			const release = (message: string | undefined): void => {
				event.preventDefault();
				event.stopPropagation();
				grabbedKeyRef.current = null;

				if (message) {
					state.announce?.(message);
				}
			};

			const runMove = (move: TreeKeyboardMove): void => {
				event.preventDefault();
				event.stopPropagation();

				const movedKey = performTreeKeyboardMove(stateRef.current, rowMetaRef.current.rowIndex, move);

				// Refocus the moved row once the consumer's reorder has re-rendered, so consecutive
				// presses keep moving the same row and the roving tab stop follows it.
				if (movedKey !== null && typeof requestAnimationFrame === "function") {
					requestAnimationFrame(() => stateRef.current.focusRowByKey?.(movedKey));
				}
			};

			switch (event.key) {
				case " ":
				case "Spacebar":
				case "Enter":
					release(state.titles?.dropped);
					break;
				case "Escape":
					release(state.titles?.moveCancelled);
					break;
				case "ArrowUp":
					runMove("up");
					break;
				case "ArrowDown":
					runMove("down");
					break;
				case "Home":
					runMove("top");
					break;
				case "End":
					runMove("bottom");
					break;
				case "ArrowRight":
					runMove("into");
					break;
				case "ArrowLeft":
					runMove("out");
					break;
				default:
					break;
			}
		};

		element.addEventListener("keydown", handleKeyDown);

		return (): void => element.removeEventListener("keydown", handleKeyDown);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- rebind only on element swap; live values are read through refs.
	}, [rowEl]);
}
