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
 * Pure helpers for the Autocomplete widget: item normalization, filtering and
 * selection matching. Consolidates the former `autocomplete.internal.ts` and
 * `autocomplete-utils.ts` into a single, testable module.
 * @module
 */

import { deburr } from "lodash-es";

import type { DropDownItem } from "../../../dropdown/main/template/dropdown.tpl.api.js";

/**
 * Normalizes a string for accent-insensitive, optionally case-insensitive comparison.
 * Deburrs latin-1 supplementary letters to basic latin and strips combining diacritics.
 */
function normalize(value: string, caseSensitive?: boolean): string {
	return deburr(caseSensitive ? value : value.toLocaleLowerCase())
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

/**
 * Filters items by {@link filterText}. Items whose (normalized) label starts with the text
 * come first (sorted), followed by items that merely contain it.
 *
 * The normalized form of each label is computed once per item per call rather than repeatedly,
 * so callers should still memoize by (items, filterText, caseSensitive) at the component level.
 */
export function filterDropDownItems(
	items: DropDownItem[],
	filterText: string,
	caseSensitive?: boolean
): DropDownItem[] {
	if (filterText === "") {
		return items;
	}

	const needle = normalize(filterText, caseSensitive);
	const startsWith: DropDownItem[] = [];
	const contains: DropDownItem[] = [];

	for (const item of items) {
		const haystack = normalize(item.label, caseSensitive);

		if (haystack.startsWith(needle)) {
			startsWith.push(item);
		} else if (haystack.includes(needle)) {
			contains.push(item);
		}
	}

	// Prefix matches ("starts with") are surfaced before substring matches ("contains"); items keep
	// their incoming order within each group.
	return [...startsWith, ...contains];
}

/**
 * Copies {@link item} and its whole subtree, stamping the `id` and `tabIndex` the Dropdown needs.
 * A missing `id` is derived from `value`, falling back to the label suffixed with the item's index
 * among its siblings. Callers' objects are never mutated.
 *
 * The first sibling deliberately gets no suffix, so that the id derived here matches the one
 * {@link toDropDownItem} derives for the same item outside a list — that is what lets
 * {@link getSelectedItem} recognize the committed value among the options.
 */
function normalizeItem(item: DropDownItem, index?: number): DropDownItem {
	const id = item.id ?? (item.value || `${item.label}${index ? `-${index}` : ""}`).split(" ").join("-");

	return {
		...item,
		id,
		tabIndex: 0,
		...(item.children ? { children: item.children.map(normalizeItem) } : {})
	};
}

export function toDropDownItem(value: string | DropDownItem | undefined): DropDownItem {
	return normalizeItem(typeof value === "string" ? { label: value } : (value ?? { label: "" }));
}

export function toDropDownItems(items: string[] | DropDownItem[]): DropDownItem[] {
	if (items.length > 0 && typeof items[0] === "string") {
		// Deliberately without the sibling index, unlike the item branch below: these ids are what a
		// consuming project's selectors see for the common `items={["a", "b"]}` case, and indexing them
		// would rename every one of them. Two strings spelled alike do end up sharing an id; pass items
		// carrying their own `id` where that matters.
		return (items as string[]).map((value) => toDropDownItem(value));
	}

	return (items as DropDownItem[]).map(normalizeItem);
}

export function flattenDropDownItemsRecursively(items: DropDownItem[], flattenItems: DropDownItem[]): void {
	for (const item of items) {
		if (item.children) {
			flattenDropDownItemsRecursively(item.children, flattenItems);
		} else {
			flattenItems.push(item);
		}
	}
}

export function getSelectedItem(
	currentSelectedItem: DropDownItem | undefined,
	items: DropDownItem[]
): DropDownItem | undefined {
	if (currentSelectedItem) {
		const flattenItems: DropDownItem[] = [];
		flattenDropDownItemsRecursively(items, flattenItems);

		if (currentSelectedItem.value) {
			return flattenItems.find((item) => currentSelectedItem.value === item.value);
		}

		// The id is what tells options sharing a label apart, so it decides when it can. It cannot
		// always: an id derived from a label carries the option's position among its siblings, while a
		// committed value normalized on its own has no position to carry, so the two only ever agree
		// on the first option. Falling back to the label is what lets any later option be found again.
		const sharingTheLabel = flattenItems.filter((item) => currentSelectedItem.label === item.label);

		return sharingTheLabel.find((item) => currentSelectedItem.id === item.id) ?? sharingTheLabel[0];
	}

	return currentSelectedItem;
}

export function getNewSelectedItem(
	matchedItems: DropDownItem[],
	searchText: string,
	currentSelectedItem: DropDownItem | undefined,
	caseSensitive?: boolean
): DropDownItem | undefined {
	if (!searchText) {
		return undefined;
	}

	const flattenItems: DropDownItem[] = [];
	flattenDropDownItemsRecursively(matchedItems, flattenItems);
	const foundItems = flattenItems.filter((item) =>
		caseSensitive ? item.label === searchText : item.label.toLowerCase() === searchText.toLowerCase()
	);
	let newSelectedItem: DropDownItem | undefined = foundItems[0];

	// re-select previous item when opening dropdown
	if (foundItems.length > 1 && currentSelectedItem) {
		newSelectedItem = foundItems.find(
			(item) =>
				currentSelectedItem.value === item.value ||
				(item.label === currentSelectedItem.label && item.id === currentSelectedItem.id)
		);
	}

	return (
		newSelectedItem ||
		flattenItems.find((item) =>
			caseSensitive ? item.label.startsWith(searchText) : item.label.toLowerCase().startsWith(searchText.toLowerCase())
		)
	);
}

export function isItemEmpty(item: DropDownItem | undefined): boolean {
	return !item || (item.label === "" && !item.value);
}
