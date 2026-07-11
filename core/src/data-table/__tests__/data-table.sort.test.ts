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

import type { DataTableSortColumn, DataTableSortState } from "../main/data-table.sort.js";
import {
	assertSortableColumnIds,
	getColumnId,
	getColumnSortIndex,
	getColumnSortOrder,
	getNextSortState
} from "../main/data-table.sort.js";

describe("getColumnId", () => {
	test("prefers explicit id, then dataKey, then a string label", () => {
		expect(getColumnId({ id: "x", dataKey: "k", label: "L" })).toBe("x");
		expect(getColumnId({ dataKey: "k", label: "L" })).toBe("k");
		expect(getColumnId({ dataKey: 3 })).toBe("3");
		expect(getColumnId({ label: "L" })).toBe("L");
	});

	test("returns undefined when nothing resolvable (non-string label)", () => {
		expect(getColumnId({})).toBeUndefined();
		expect(getColumnId({ label: 42 as unknown as string })).toBeUndefined();
	});
});

describe("assertSortableColumnIds", () => {
	test("passes when every sortable leaf has a unique id", () => {
		expect(() =>
			assertSortableColumnIds([
				{ dataKey: "a", sortable: true },
				{ dataKey: "b", sortable: true },
				{ label: "nokey" } // non-sortable, no id — ignored
			])
		).not.toThrow();
	});

	test("throws when a sortable column has no resolvable id", () => {
		expect(() => assertSortableColumnIds([{ sortable: true }])).toThrow(/without a stable id/);
	});

	test("throws when two sortable columns resolve to the same id", () => {
		expect(() =>
			assertSortableColumnIds([
				{ dataKey: "dup", sortable: true },
				{ id: "dup", sortable: true }
			])
		).toThrow(/duplicate sortable column id/);
	});
});

describe("getColumnSortOrder / getColumnSortIndex", () => {
	const state: DataTableSortState = [
		{ columnId: "a", order: "desc" },
		{ columnId: "b", order: "asc" }
	];

	test("reads order and priority index by id", () => {
		expect(getColumnSortOrder("a", state)).toBe("desc");
		expect(getColumnSortOrder("b", state)).toBe("asc");
		expect(getColumnSortOrder("c", state)).toBeUndefined();
		expect(getColumnSortIndex("a", state)).toBe(0);
		expect(getColumnSortIndex("b", state)).toBe(1);
		expect(getColumnSortIndex("c", state)).toBe(-1);
	});

	test("undefined columnId / state is treated as unsorted", () => {
		expect(getColumnSortOrder(undefined, state)).toBeUndefined();
		expect(getColumnSortOrder("a", undefined)).toBeUndefined();
		expect(getColumnSortIndex(undefined, state)).toBe(-1);
	});
});

describe("getNextSortState — single column", () => {
	const col: DataTableSortColumn = { dataKey: "a" };

	test("cycles unsorted → asc → desc → unsorted, replacing prior sort", () => {
		const a = getNextSortState(col, "a", []);
		expect(a).toEqual({ next: [{ columnId: "a", order: "asc" }], order: "asc" });

		const b = getNextSortState(col, "a", a.next);
		expect(b).toEqual({ next: [{ columnId: "a", order: "desc" }], order: "desc" });

		const c = getNextSortState(col, "a", b.next);
		expect(c).toEqual({ next: [], order: undefined });
	});

	test("sorting a new column replaces any other sorted column", () => {
		const next = getNextSortState({ dataKey: "b" }, "b", [{ columnId: "a", order: "asc" }]);
		expect(next).toEqual({ next: [{ columnId: "b", order: "asc" }], order: "asc" });
	});

	test("honours a custom sortDirections cycle", () => {
		const cycled: DataTableSortColumn = { dataKey: "a", sortDirections: ["asc", "desc"] };
		// no unsorted position → starts at asc, never clears
		const first = getNextSortState(cycled, "a", []);
		expect(first.order).toBe("asc");
		const second = getNextSortState(cycled, "a", first.next);
		expect(second.order).toBe("desc");
		const third = getNextSortState(cycled, "a", second.next);
		expect(third.order).toBe("asc");
	});
});

describe("getNextSortState — multi column", () => {
	const opts = { isMulti: true };

	test("appends a new column, preserving prior sorts and their priority", () => {
		const start: DataTableSortState = [{ columnId: "a", order: "asc" }];
		const next = getNextSortState({ dataKey: "b" }, "b", start, opts);
		expect(next.next).toEqual([
			{ columnId: "a", order: "asc" },
			{ columnId: "b", order: "asc" }
		]);
	});

	test("updates an existing column in place (keeps its position)", () => {
		const start: DataTableSortState = [
			{ columnId: "a", order: "asc" },
			{ columnId: "b", order: "asc" }
		];
		const next = getNextSortState({ dataKey: "a" }, "a", start, opts);
		expect(next.next).toEqual([
			{ columnId: "a", order: "desc" },
			{ columnId: "b", order: "asc" }
		]);
	});

	test("cycling a column back to unsorted removes only that entry", () => {
		const start: DataTableSortState = [
			{ columnId: "a", order: "desc" },
			{ columnId: "b", order: "asc" }
		];
		const next = getNextSortState({ dataKey: "a" }, "a", start, opts);
		expect(next).toEqual({ next: [{ columnId: "b", order: "asc" }], order: undefined });
	});

	test("ignores an append past maxMultiSortColCount", () => {
		const start: DataTableSortState = [
			{ columnId: "a", order: "asc" },
			{ columnId: "b", order: "asc" }
		];
		const next = getNextSortState({ dataKey: "c" }, "c", start, { isMulti: true, maxMultiSortColCount: 2 });
		expect(next.next).toBe(start); // unchanged
	});

	test("still updates an existing column when at the cap", () => {
		const start: DataTableSortState = [
			{ columnId: "a", order: "asc" },
			{ columnId: "b", order: "asc" }
		];
		const next = getNextSortState({ dataKey: "b" }, "b", start, { isMulti: true, maxMultiSortColCount: 2 });
		expect(next.next).toEqual([
			{ columnId: "a", order: "asc" },
			{ columnId: "b", order: "desc" }
		]);
	});
});
