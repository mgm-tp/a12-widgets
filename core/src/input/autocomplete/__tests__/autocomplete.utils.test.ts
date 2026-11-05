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
 * The Autocomplete's pure helpers, which the widget's behaviour rests on but which no scenario test
 * pins directly: what the built-in filter matches and in which order, how an option's fallback `id`
 * is derived, and how a committed value is found again among options that may be grouped.
 *
 * These are the rules the rewrite consolidated out of `autocomplete.internal.ts` and
 * `autocomplete-utils.ts`, so a change in any of them shows up here rather than as a puzzling
 * failure three layers up in a rendered widget.
 */

import { describe, expect, test } from "vitest";

import type { DropDownItem } from "../../../dropdown/main/template/dropdown.tpl.api.js";
import {
	filterDropDownItems,
	flattenDropDownItemsRecursively,
	getNewSelectedItem,
	getSelectedItem,
	isItemEmpty,
	toDropDownItem,
	toDropDownItems
} from "../main/autocomplete.utils.js";

const labelsOf = (items: DropDownItem[]): string[] => items.map((item) => item.label);

describe("com.mgmtp.a12.widgets.autocomplete.utils", () => {
	describe("filterDropDownItems", () => {
		test("hands back the whole list untouched for empty text", () => {
			const items: DropDownItem[] = [{ label: "Berlin" }, { label: "Bern" }];

			expect(filterDropDownItems(items, "")).toBe(items);
		});

		test("puts the options starting with the text before those merely containing it", () => {
			const items: DropDownItem[] = [
				{ label: "Denmark" },
				{ label: "Madrid" },
				{ label: "Germany" },
				{ label: "Marrakech" }
			];

			// "Madrid" and "Marrakech" start with "ma"; "Denmark" and "Germany" only contain it.
			expect(labelsOf(filterDropDownItems(items, "ma"))).toEqual(["Madrid", "Marrakech", "Denmark", "Germany"]);
		});

		test("keeps the caller's order within each group rather than sorting alphabetically", () => {
			const items: DropDownItem[] = [{ label: "Munich" }, { label: "Madrid" }, { label: "Malmö" }];

			expect(labelsOf(filterDropDownItems(items, "m"))).toEqual(["Munich", "Madrid", "Malmö"]);
		});

		test("ignores case unless the caller asks for it", () => {
			const items: DropDownItem[] = [{ label: "Paris" }, { label: "PARIS" }];

			expect(labelsOf(filterDropDownItems(items, "par"))).toEqual(["Paris", "PARIS"]);
			// caseSensitive compares the text exactly as typed, so it matches neither spelling here...
			expect(filterDropDownItems(items, "par", true)).toEqual([]);
			// ...and only the one written the same way.
			expect(labelsOf(filterDropDownItems(items, "Par", true))).toEqual(["Paris"]);
		});

		test("matches an accented label from its unaccented spelling", () => {
			const items: DropDownItem[] = [{ label: "München" }, { label: "São Paulo" }, { label: "Medellín" }];

			expect(labelsOf(filterDropDownItems(items, "munchen"))).toEqual(["München"]);
			expect(labelsOf(filterDropDownItems(items, "sao"))).toEqual(["São Paulo"]);
			expect(labelsOf(filterDropDownItems(items, "medellin"))).toEqual(["Medellín"]);
		});

		test("matches a group by its own heading and never by the options inside it", () => {
			// This is what the `items` documentation warns about: the filter sees a group's label, so it
			// can only keep or drop the group whole. Filtering a grouped list is the caller's job.
			const items: DropDownItem[] = [
				{ label: "Germany", children: [{ label: "Berlin" }, { label: "Munich" }] },
				{ label: "France", children: [{ label: "Paris" }] }
			];

			expect(labelsOf(filterDropDownItems(items, "germ"))).toEqual(["Germany"]);
			// "Berlin" is inside a group, so the group is not kept for it.
			expect(filterDropDownItems(items, "berlin")).toEqual([]);
		});

		test("finds nothing when no label matches", () => {
			expect(filterDropDownItems([{ label: "Berlin" }], "zz")).toEqual([]);
		});
	});

	describe("toDropDownItem / toDropDownItems", () => {
		test("turns a plain string into an option carrying an id and a tab index", () => {
			expect(toDropDownItem("Berlin")).toEqual({ label: "Berlin", id: "Berlin", tabIndex: 0 });
		});

		test("stands in an empty option for no value at all", () => {
			expect(toDropDownItem(undefined)).toEqual({ label: "", id: "", tabIndex: 0 });
		});

		test("derives the id from the value when there is one, and from the label otherwise", () => {
			expect(toDropDownItem({ label: "New York", value: "ny" }).id).toBe("ny");
			expect(toDropDownItem({ label: "New York" }).id).toBe("New-York");
		});

		test("leaves an id the caller supplied alone", () => {
			expect(toDropDownItem({ label: "New York", value: "ny", id: "own" }).id).toBe("own");
		});

		test("indexes options spelled alike apart from the first, so that they differ", () => {
			// The first sibling is deliberately left unsuffixed, so that the id matches the one derived
			// for the same option outside a list — which is what lets a committed value be found again.
			const [first, second] = toDropDownItems([{ label: "Berlin" }, { label: "Berlin" }]);

			expect(first.id).toBe(toDropDownItem("Berlin").id);
			expect(second.id).toBe("Berlin-1");
		});

		test("leaves a list of strings unindexed, so its ids stay the labels themselves", () => {
			// These are the ids a consuming project's selectors see for the common string-list case, so
			// they are kept as they are. Two strings spelled alike therefore do share an id; an item
			// carrying its own `id` is the way out.
			expect(toDropDownItems(["Berlin", "Paris"]).map((item) => item.id)).toEqual(["Berlin", "Paris"]);
		});

		test("never mutates the caller's own objects", () => {
			const item: DropDownItem = { label: "Berlin" };
			const [normalized] = toDropDownItems([item]);

			expect(item).toEqual({ label: "Berlin" });
			expect(normalized).not.toBe(item);
		});

		test("normalizes the options inside a group as well as the group itself", () => {
			const [group] = toDropDownItems([{ label: "Germany", children: [{ label: "Berlin" }, { label: "Munich" }] }]);

			expect(group).toMatchObject({ id: "Germany", tabIndex: 0 });
			expect(group.children).toEqual([
				{ label: "Berlin", id: "Berlin", tabIndex: 0 },
				{ label: "Munich", id: "Munich-1", tabIndex: 0 }
			]);
		});

		test("takes a list of strings and a list of items alike", () => {
			expect(toDropDownItems([])).toEqual([]);
			expect(labelsOf(toDropDownItems(["Berlin"]))).toEqual(["Berlin"]);
			expect(labelsOf(toDropDownItems([{ label: "Berlin" }]))).toEqual(["Berlin"]);
		});
	});

	describe("flattenDropDownItemsRecursively", () => {
		test("collects the options and leaves the groups holding them out", () => {
			const flattened: DropDownItem[] = [];

			flattenDropDownItemsRecursively(
				[{ label: "Germany", children: [{ label: "Berlin" }, { label: "Munich" }] }, { label: "Paris" }],
				flattened
			);

			expect(labelsOf(flattened)).toEqual(["Berlin", "Munich", "Paris"]);
		});

		test("goes all the way down, however deep the groups nest", () => {
			const flattened: DropDownItem[] = [];

			flattenDropDownItemsRecursively(
				[{ label: "Europe", children: [{ label: "Germany", children: [{ label: "Berlin" }] }] }],
				flattened
			);

			expect(labelsOf(flattened)).toEqual(["Berlin"]);
		});

		test("appends to what the caller already collected", () => {
			const flattened: DropDownItem[] = [{ label: "Paris" }];

			flattenDropDownItemsRecursively([{ label: "Berlin" }], flattened);

			expect(labelsOf(flattened)).toEqual(["Paris", "Berlin"]);
		});
	});

	describe("getSelectedItem", () => {
		const items = toDropDownItems([
			{ label: "Berlin", value: "de-be" },
			{ label: "Paris", value: "fr-pa" }
		]);

		test("finds the option standing for the committed value, by value", () => {
			expect(getSelectedItem({ label: "anything", value: "fr-pa" }, items)).toBe(items[1]);
		});

		test.each([
			["strings", ["Berlin", "Paris"] as string[]],
			["items", [{ label: "Berlin" }, { label: "Paris" }] as DropDownItem[]]
		])("finds an option past the first one by label, given %s", (_shape, list) => {
			// An id derived from a label carries the option's position, which a committed value
			// normalized on its own cannot, so the label is all the two have in common here.
			const unvalued = toDropDownItems(list);

			expect(getSelectedItem(toDropDownItem("Paris"), unvalued)).toBe(unvalued[1]);
		});

		test("prefers the option whose id matches when several share a label", () => {
			const duplicates = toDropDownItems([{ label: "Berlin" }, { label: "Berlin" }]);

			expect(getSelectedItem({ label: "Berlin", id: "Berlin-1" }, duplicates)).toBe(duplicates[1]);
			// With no id to go on, the first option spelled that way stands in.
			expect(getSelectedItem({ label: "Berlin" }, duplicates)).toBe(duplicates[0]);
		});

		test("finds an option nested inside a group", () => {
			const grouped = toDropDownItems([{ label: "Germany", children: [{ label: "Berlin", value: "de-be" }] }]);

			expect(getSelectedItem({ label: "Berlin", value: "de-be" }, grouped)).toBe(grouped[0].children![0]);
		});

		test("reports nothing for a value the list no longer holds", () => {
			expect(getSelectedItem({ label: "Gone", value: "gone" }, items)).toBeUndefined();
		});

		test("hands back nothing when nothing is committed", () => {
			expect(getSelectedItem(undefined, items)).toBeUndefined();
		});
	});

	describe("getNewSelectedItem", () => {
		const items = toDropDownItems(["Berlin", "Bern", "Paris"]);

		test("selects nothing while the field is empty", () => {
			expect(getNewSelectedItem(items, "", undefined)).toBeUndefined();
		});

		test("selects the option whose label is exactly what was typed", () => {
			expect(getNewSelectedItem(items, "Bern", undefined)).toBe(items[1]);
		});

		test("falls back to the first option the text is a prefix of", () => {
			// Nothing is labelled "Ber", so the first option starting with it stands in.
			expect(getNewSelectedItem(items, "Ber", undefined)).toBe(items[0]);
		});

		test("ignores case in that fallback unless the caller asks for it", () => {
			expect(getNewSelectedItem(items, "ber", undefined)).toBe(items[0]);
			expect(getNewSelectedItem(items, "ber", undefined, true)).toBeUndefined();
		});

		test("re-selects the option already committed when several share the typed label", () => {
			const duplicates = toDropDownItems([
				{ label: "Berlin", value: "de-be" },
				{ label: "Berlin", value: "us-be" }
			]);

			expect(getNewSelectedItem(duplicates, "Berlin", { label: "Berlin", value: "us-be" })).toBe(duplicates[1]);
		});

		test("takes the first of the duplicates when none of them is the committed one", () => {
			const duplicates = toDropDownItems([
				{ label: "Berlin", value: "de-be" },
				{ label: "Berlin", value: "us-be" }
			]);

			expect(getNewSelectedItem(duplicates, "Berlin", undefined)).toBe(duplicates[0]);
		});

		test("looks inside groups for the option that was typed", () => {
			const grouped = toDropDownItems([{ label: "Germany", children: [{ label: "Berlin" }, { label: "Munich" }] }]);

			expect(getNewSelectedItem(grouped, "Munich", undefined)).toBe(grouped[0].children![1]);
		});

		test("selects nothing when nothing matches", () => {
			expect(getNewSelectedItem(items, "zz", undefined)).toBeUndefined();
		});
	});

	describe("isItemEmpty", () => {
		test("counts a missing option, and one with neither label nor value, as empty", () => {
			expect(isItemEmpty(undefined)).toBe(true);
			expect(isItemEmpty({ label: "" })).toBe(true);
		});

		test("counts an option carrying either a label or a value as filled", () => {
			expect(isItemEmpty({ label: "Berlin" })).toBe(false);
			expect(isItemEmpty({ label: "", value: "de-be" })).toBe(false);
		});
	});
});
