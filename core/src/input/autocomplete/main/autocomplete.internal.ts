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

import { deburr } from "lodash-es";
import { produce } from "immer";

import type { DropDownItem } from "../../../dropdown/main/template/dropdown.tpl.api.js";

export function filterDropDownItems(
	items: DropDownItem[],
	filterText: string,
	caseSensitive?: boolean
): DropDownItem[] {
	if (filterText !== "") {
		// Deburrs string by converting latin-1 supplementary letters to basic latin letters and removing combining diacritical marks.
		const u = (value: string): string =>
			deburr(caseSensitive ? value : value.toLocaleLowerCase())
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "");

		return [
			...items.filter((i) => u(i.label).startsWith(u(filterText))).sort(),
			...items.filter((i) => !u(i.label).startsWith(u(filterText)) && u(i.label).includes(u(filterText)))
		];
	} else {
		return items;
	}
}

export function toDropDownItem(value: string | DropDownItem | undefined): DropDownItem {
	const item = typeof value === "string" ? { label: value } : value ? value : { label: "" };

	return produce(item, (draft) => {
		applyIdAndTabIndex(draft);

		if (draft.children) {
			draft.children.forEach((subItem, index) => applyIdAndTabIndex(subItem, index));
		}
	});
}

export function toDropDownItems(items: string[] | DropDownItem[]): DropDownItem[] {
	if (typeof items[0] === "string") {
		return (items as string[]).map(toDropDownItem);
	}

	return produce(items, (draft) => {
		walk(draft as DropDownItem[], applyIdAndTabIndex);
	}) as DropDownItem[];
}

export function walk(items: DropDownItem[], visitor: (item: DropDownItem, index: number) => void | boolean): void {
	for (const item of items) {
		const descend = visitor(item, items.indexOf(item));

		if (descend !== false && item) {
			if (item.children) {
				walk(item.children, visitor);
			}
		}
	}
}

export function applyIdAndTabIndex(item: DropDownItem, index?: number): void {
	item.id = item.id ?? (item.value ?? `${item.label}${index ? `-${index}` : ""}`).split(" ").join("-");
	item.tabIndex = 0;
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

		return flattenItems.find((item) =>
			currentSelectedItem?.value
				? currentSelectedItem.value === item.value
				: currentSelectedItem?.label === item.label && currentSelectedItem.id === item.id
		);
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

	let newSelectedItem: DropDownItem | undefined;
	const flattenItems: DropDownItem[] = [];
	flattenDropDownItemsRecursively(matchedItems, flattenItems);
	const foundItems = flattenItems.filter((item) => item.label === searchText);
	newSelectedItem = foundItems[0];

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
