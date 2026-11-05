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
	buildNavigationModel,
	findItemIndex,
	getEdgeStep,
	getNextHorizontalStep,
	getNextVerticalStep
} from "../template/dropdown.navigation.js";
import type { DropDownItem } from "../template/dropdown.tpl.api.js";
import { getDropDownItemsLength } from "../template/dropdown.utils.js";

const flat: DropDownItem[] = [
	{ id: "1", label: "One" },
	{ id: "2", label: "Two" },
	{ id: "3", label: "Three" }
];

describe("com.mgmtp.a12.widgets.dropdown.navigation", () => {
	describe("buildNavigationModel", () => {
		test("puts one option per row for a vertical list", () => {
			const model = buildNavigationModel(flat);

			expect(model.entries.map((entry) => entry.item.id)).toEqual(["1", "2", "3"]);
			expect(model.rows).toEqual([[0], [1], [2]]);
			expect(model.allDisabled).toBe(false);
		});

		test("flattens sections and keeps the section id for each option", () => {
			const model = buildNavigationModel([
				{
					id: "s1",
					label: "Section",
					children: [
						{ id: "1", label: "One" },
						{ id: "2", label: "Two" }
					]
				},
				{ id: "3", label: "Three" }
			]);

			expect(model.entries.map((entry) => entry.item.id)).toEqual(["1", "2", "3"]);
			expect(model.entries.map((entry) => entry.sectionId)).toEqual(["s1", "s1", undefined]);
		});

		test("flattens the one level of sections the list renders, and no deeper", () => {
			// An option nested below a section is rendered as an option of its own — its children are not
			// rendered at all. Recursing into them would number entries the list has no elements for, so
			// every flat index after that point would address a different option than the one on screen.
			const model = buildNavigationModel([
				{ id: "1", label: "One" },
				{
					id: "s1",
					label: "Section",
					children: [
						{ id: "2", label: "Two" },
						{ id: "deep", label: "Deep", children: [{ id: "hidden", label: "Hidden" }] }
					]
				}
			]);

			expect(model.entries.map((entry) => entry.item.id)).toEqual(["1", "2", "deep"]);
			expect(model.entries.map((entry) => entry.flatIndex)).toEqual([0, 1, 2]);
		});

		test("agrees with getDropDownItemsLength, at any nesting depth", () => {
			const nested: DropDownItem[] = [
				{ id: "1", label: "One" },
				{
					id: "s1",
					label: "Section",
					children: [
						{ id: "2", label: "Two" },
						{ id: "deep", label: "Deep", children: [{ id: "hidden", label: "Hidden" }] }
					]
				}
			];

			expect(getDropDownItemsLength(nested)).toBe(buildNavigationModel(nested).entries.length);
			expect(getDropDownItemsLength(nested)).toBe(3);
			expect(getDropDownItemsLength(flat)).toBe(buildNavigationModel(flat).entries.length);
		});

		test("reports an all-disabled list, but not an empty one", () => {
			expect(buildNavigationModel([{ id: "1", label: "One", disabled: true }]).allDisabled).toBe(true);
			expect(buildNavigationModel([]).allDisabled).toBe(false);
		});

		test("indexes a supplied grid grouping by row and column", () => {
			const model = buildNavigationModel(flat, [[0, 1], [2]]);

			expect(model.rowOf).toEqual([0, 0, 1]);
			expect(model.columnOf).toEqual([0, 1, 0]);
		});
	});

	describe("getNextVerticalStep", () => {
		test("moves to the neighbouring option", () => {
			const model = buildNavigationModel(flat);

			expect(getNextVerticalStep(model, 0, 1)).toEqual({ type: "item", flatIndex: 1 });
			expect(getNextVerticalStep(model, 2, -1)).toEqual({ type: "item", flatIndex: 1 });
		});

		test("wraps around at both ends", () => {
			const model = buildNavigationModel(flat);

			expect(getNextVerticalStep(model, 2, 1)).toEqual({ type: "item", flatIndex: 0 });
			expect(getNextVerticalStep(model, 0, -1)).toEqual({ type: "item", flatIndex: 2 });
		});

		test("skips over a run of disabled options", () => {
			const model = buildNavigationModel([
				{ id: "1", label: "One" },
				{ id: "2", label: "Two", disabled: true },
				{ id: "3", label: "Three", disabled: true },
				{ id: "4", label: "Four" }
			]);

			expect(getNextVerticalStep(model, 0, 1)).toEqual({ type: "item", flatIndex: 3 });
		});

		test("stays on the only enabled option", () => {
			const model = buildNavigationModel([
				{ id: "1", label: "One" },
				{ id: "2", label: "Two", disabled: true }
			]);

			// Skipping the disabled option wraps back around to where it started.
			expect(getNextVerticalStep(model, 0, 1)).toEqual({ type: "item", flatIndex: 0 });
		});

		test("finds nothing when the whole list is disabled", () => {
			const model = buildNavigationModel([
				{ id: "1", label: "One", disabled: true },
				{ id: "2", label: "Two", disabled: true }
			]);

			expect(getNextVerticalStep(model, 0, 1)).toEqual({ type: "none" });
		});

		test("hands over to the link options at the list boundaries", () => {
			const model = buildNavigationModel(flat);

			expect(getNextVerticalStep(model, 2, 1, 2)).toEqual({ type: "linkBoundary", linkIndex: 0 });
			expect(getNextVerticalStep(model, 0, -1, 2)).toEqual({ type: "linkBoundary", linkIndex: 1 });
			// Away from the boundaries the links play no role.
			expect(getNextVerticalStep(model, 1, 1, 2)).toEqual({ type: "item", flatIndex: 2 });
		});

		test("reaches the link options past a disabled option at either end", () => {
			// A press keeps going while it lands on disabled options, so one at the edge means the list is
			// left a hop later than the option the press started from.
			const lastDisabled = buildNavigationModel([flat[0], flat[1], { ...flat[2], disabled: true }]);

			expect(getNextVerticalStep(lastDisabled, 1, 1, 2)).toEqual({ type: "linkBoundary", linkIndex: 0 });

			const firstDisabled = buildNavigationModel([{ ...flat[0], disabled: true }, flat[1], flat[2]]);

			expect(getNextVerticalStep(firstDisabled, 1, -1, 2)).toEqual({ type: "linkBoundary", linkIndex: 1 });
		});

		test("keeps the column when moving between rows of a grid", () => {
			const model = buildNavigationModel(
				[...flat, { id: "4", label: "Four" }],
				[
					[0, 1],
					[2, 3]
				]
			);

			expect(getNextVerticalStep(model, 1, 1)).toEqual({ type: "item", flatIndex: 3 });
			expect(getNextVerticalStep(model, 3, -1)).toEqual({ type: "item", flatIndex: 1 });
		});

		test("returns nothing for an index outside the model", () => {
			expect(getNextVerticalStep(buildNavigationModel(flat), 99, 1)).toEqual({ type: "none" });
		});
	});

	describe("getNextHorizontalStep", () => {
		test("moves within the row", () => {
			const model = buildNavigationModel(
				[...flat, { id: "4", label: "Four" }],
				[
					[0, 1],
					[2, 3]
				]
			);

			expect(getNextHorizontalStep(model, 0, 1)).toEqual({ type: "item", flatIndex: 1 });
			expect(getNextHorizontalStep(model, 3, -1)).toEqual({ type: "item", flatIndex: 2 });
		});

		test("spills into the neighbouring row at the row edges", () => {
			const model = buildNavigationModel(
				[...flat, { id: "4", label: "Four" }],
				[
					[0, 1],
					[2, 3]
				]
			);

			expect(getNextHorizontalStep(model, 1, 1)).toEqual({ type: "item", flatIndex: 2 });
			expect(getNextHorizontalStep(model, 2, -1)).toEqual({ type: "item", flatIndex: 1 });
		});

		test("wraps from the last option to the first and back", () => {
			const model = buildNavigationModel(
				[...flat, { id: "4", label: "Four" }],
				[
					[0, 1],
					[2, 3]
				]
			);

			expect(getNextHorizontalStep(model, 3, 1)).toEqual({ type: "item", flatIndex: 0 });
			expect(getNextHorizontalStep(model, 0, -1)).toEqual({ type: "item", flatIndex: 3 });
		});

		test("handles a ragged last row", () => {
			const model = buildNavigationModel(
				[...flat, { id: "4", label: "Four" }, { id: "5", label: "Five" }],
				[[0, 1], [2, 3], [4]]
			);

			expect(getNextHorizontalStep(model, 3, 1)).toEqual({ type: "item", flatIndex: 4 });
			expect(getNextHorizontalStep(model, 4, 1)).toEqual({ type: "item", flatIndex: 0 });
		});
	});

	describe("getEdgeStep", () => {
		test("returns the first or last option", () => {
			const model = buildNavigationModel(flat);

			expect(getEdgeStep(model, 1)).toEqual({ type: "item", flatIndex: 0 });
			expect(getEdgeStep(model, -1)).toEqual({ type: "item", flatIndex: 2 });
		});

		test("returns nothing for an empty list", () => {
			expect(getEdgeStep(buildNavigationModel([]), 1)).toEqual({ type: "none" });
		});

		test("skips a disabled option at either end", () => {
			const model = buildNavigationModel([
				{ id: "1", label: "One", disabled: true },
				{ id: "2", label: "Two" },
				{ id: "3", label: "Three", disabled: true }
			]);

			// Arrowing into the list must not land on an option that cannot be selected.
			expect(getEdgeStep(model, 1)).toEqual({ type: "item", flatIndex: 1 });
			expect(getEdgeStep(model, -1)).toEqual({ type: "item", flatIndex: 1 });
		});

		test("returns nothing when every option is disabled", () => {
			const model = buildNavigationModel([{ id: "1", label: "One", disabled: true }]);

			expect(getEdgeStep(model, 1)).toEqual({ type: "none" });
		});
	});

	describe("findItemIndex", () => {
		const byId = (one?: DropDownItem, other?: DropDownItem): boolean => !!one && !!other && one.id === other.id;

		test("finds the option standing for an item", () => {
			const model = buildNavigationModel(flat);

			expect(findItemIndex(model, { id: "3", label: "Three" }, byId)).toBe(2);
		});

		test("finds an option nested in a section", () => {
			const model = buildNavigationModel([
				{
					id: "s",
					label: "Section",
					children: [
						{ id: "1", label: "One" },
						{ id: "2", label: "Two" }
					]
				}
			]);

			expect(findItemIndex(model, { id: "2", label: "Two" }, byId)).toBe(1);
		});

		test("returns nothing for an item the list does not hold, or for none at all", () => {
			const model = buildNavigationModel(flat);

			expect(findItemIndex(model, { id: "9", label: "Nine" }, byId)).toBeUndefined();
			expect(findItemIndex(model, undefined, byId)).toBeUndefined();
		});
	});
});
