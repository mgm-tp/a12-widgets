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

import { describe, expect, test } from "vitest";

import {
	canDropOnTarget,
	dropGapForRow,
	landingIndexForGap,
	shiftForRow,
	slotShiftForSource
} from "../main/dnd/data-table.dnd.geometry.js";
import type { TableDragDropOptions } from "../main/foundation/table.api.js";

/*
 * The row-shift arithmetic previously only ran inside a live drag, so every rule
 * below was covered — if at all — through a full pointer gesture. Exercised
 * directly here: these four functions define where every row lands during a
 * drag, and their edge cases (the gap adjacent to the source, cross-table drags,
 * the off-by-one after removal) are exactly what a DOM-level test reproduces
 * least reliably.
 */

const H = 40;

describe("com.mgmtp.a12.widgets.data-table.dnd — shiftForRow", () => {
	test("no row moves when the gap is the source's own slot", () => {
		// Both `sourceIndex` and `sourceIndex + 1` mean "put it back where it was".
		for (const gapIndex of [2, 3]) {
			for (const rowIndex of [0, 1, 2, 3, 4]) {
				expect(shiftForRow(rowIndex, 2, gapIndex, H)).toBe(0);
			}
		}
	});

	test("dragging down: only the rows the source passes move up by one row height", () => {
		// source 1, gap 4 → rows 2 and 3 slide up into the freed slot.
		expect(shiftForRow(0, 1, 4, H)).toBe(0);
		expect(shiftForRow(1, 1, 4, H)).toBe(0);
		expect(shiftForRow(2, 1, 4, H)).toBe(-H);
		expect(shiftForRow(3, 1, 4, H)).toBe(-H);
		expect(shiftForRow(4, 1, 4, H)).toBe(0);
	});

	test("dragging up: only the rows the source passes move down by one row height", () => {
		// source 4, gap 1 → rows 1, 2 and 3 slide down.
		expect(shiftForRow(0, 4, 1, H)).toBe(0);
		expect(shiftForRow(1, 4, 1, H)).toBe(H);
		expect(shiftForRow(2, 4, 1, H)).toBe(H);
		expect(shiftForRow(3, 4, 1, H)).toBe(H);
		expect(shiftForRow(4, 4, 1, H)).toBe(0);
	});

	test("cross-table drag opens room at the gap without a local source", () => {
		// `sourceIndex === null` — the dragged row lives in another table, so nothing
		// is freed here and every row from the gap down must move.
		expect(shiftForRow(0, null, 2, H)).toBe(0);
		expect(shiftForRow(1, null, 2, H)).toBe(0);
		expect(shiftForRow(2, null, 2, H)).toBe(H);
		expect(shiftForRow(3, null, 2, H)).toBe(H);
	});

	test("a gap at the very top or bottom shifts the whole affected range", () => {
		expect(shiftForRow(0, 3, 0, H)).toBe(H);
		expect(shiftForRow(2, 3, 0, H)).toBe(H);
		expect(shiftForRow(3, 3, 0, H)).toBe(0);
		expect(shiftForRow(1, 0, 4, H)).toBe(-H);
		expect(shiftForRow(3, 0, 4, H)).toBe(-H);
	});
});

describe("com.mgmtp.a12.widgets.data-table.dnd — slotShiftForSource", () => {
	test("the source stays put when the gap is its own slot", () => {
		expect(slotShiftForSource(2, 2, H)).toBe(0);
		expect(slotShiftForSource(2, 3, H)).toBe(0);
	});

	test("moving down, the source rides to the slot the parting rows vacated", () => {
		// gap 4 from source 1: two rows moved up, so the source lands two rows lower.
		expect(slotShiftForSource(1, 4, H)).toBe(2 * H);
		expect(slotShiftForSource(0, 2, H)).toBe(H);
	});

	test("moving up, the source rides straight to the gap", () => {
		expect(slotShiftForSource(4, 1, H)).toBe(-3 * H);
		expect(slotShiftForSource(1, 0, H)).toBe(-H);
	});

	test("the source's shift always lands it in the gap the other rows opened", () => {
		// The invariant that makes the preview read correctly: after both shifts the
		// source occupies the gap, and no two rows occupy the same slot.
		const rowCount = 6;

		for (let sourceIndex = 0; sourceIndex < rowCount; sourceIndex += 1) {
			for (let gapIndex = 0; gapIndex <= rowCount; gapIndex += 1) {
				const sourceSlot = sourceIndex + slotShiftForSource(sourceIndex, gapIndex, H) / H;
				const occupied = new Set([sourceSlot]);

				for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
					if (rowIndex === sourceIndex) {
						continue;
					}

					const slot = rowIndex + shiftForRow(rowIndex, sourceIndex, gapIndex, H) / H;

					expect(occupied.has(slot)).toBe(false);
					occupied.add(slot);
				}

				expect(sourceSlot).toBe(landingIndexForGap(sourceIndex, gapIndex));
			}
		}
	});
});

describe("com.mgmtp.a12.widgets.data-table.dnd — dropGapForRow", () => {
	const rect = { top: 100, height: 40 };

	test("the top half inserts before the hovered row", () => {
		expect(dropGapForRow(rect, 100)).toBe("before");
		expect(dropGapForRow(rect, 119)).toBe("before");
	});

	test("the exact midpoint inserts after", () => {
		expect(dropGapForRow(rect, 120)).toBe("after");
	});

	test("the bottom half inserts after the hovered row", () => {
		expect(dropGapForRow(rect, 121)).toBe("after");
		expect(dropGapForRow(rect, 139)).toBe("after");
	});
});

describe("com.mgmtp.a12.widgets.data-table.dnd — landingIndexForGap", () => {
	test("a downward move lands one slot before the raw gap", () => {
		// Removing the source first shifts every later gap down by one.
		expect(landingIndexForGap(1, 4)).toBe(3);
		expect(landingIndexForGap(0, 5)).toBe(4);
	});

	test("an upward move lands exactly on the gap", () => {
		expect(landingIndexForGap(4, 1)).toBe(1);
		expect(landingIndexForGap(3, 0)).toBe(0);
	});

	test("a no-op gap resolves to the source's own index", () => {
		expect(landingIndexForGap(2, 2)).toBe(2);
		expect(landingIndexForGap(2, 3)).toBe(2);
	});
});

describe("com.mgmtp.a12.widgets.data-table.dnd — canDropOnTarget", () => {
	type Row = { id: string };

	const a: Row = { id: "a" };
	const b: Row = { id: "b" };

	test("without a consumer predicate, any row but the dragged one accepts", () => {
		const options: TableDragDropOptions<Row> = {};

		expect(canDropOnTarget(options, { rowIndex: 0, row: a }, { rowIndex: 1, row: b })).toBe(true);
		expect(canDropOnTarget(options, { rowIndex: 0, row: a }, { rowIndex: 0, row: a })).toBe(false);
	});

	test("a consumer predicate wins outright, including over the self-reject default", () => {
		const options: TableDragDropOptions<Row> = { canDrop: ({ hoveredItem }) => hoveredItem.row.id !== "b" };

		expect(canDropOnTarget(options, { rowIndex: 0, row: a }, { rowIndex: 1, row: b })).toBe(false);
		// The default would reject a self-drop; the consumer's predicate allows it.
		expect(canDropOnTarget(options, { rowIndex: 0, row: a }, { rowIndex: 0, row: a })).toBe(true);
	});

	test("the predicate receives both the dragged and the hovered item", () => {
		const seen: { drag: string; hover: string }[] = [];
		const options: TableDragDropOptions<Row> = {
			canDrop: ({ dragItem, hoveredItem }) => {
				seen.push({ drag: dragItem.row.id, hover: hoveredItem.row.id });

				return true;
			}
		};

		canDropOnTarget(options, { rowIndex: 0, row: a }, { rowIndex: 1, row: b });

		expect(seen).toEqual([{ drag: "a", hover: "b" }]);
	});
});
