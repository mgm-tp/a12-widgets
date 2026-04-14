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

import type { MultiselectProps } from "./multiselect.api.js";

export function getFlattenItems(items: MultiselectProps.Items): MultiselectProps.Item[] {
	if (Array.isArray(items)) {
		return items;
	}

	return [...items.selectedItems, ...items.unselectedItems];
}

export function getSelectedItems(items: MultiselectProps.Items): MultiselectProps.Item[] {
	if (Array.isArray(items)) {
		return items.filter((item) => item.selected);
	}

	return items.selectedItems;
}

export function defaultGroupingHandler(items: MultiselectProps.Items): MultiselectProps.ItemGroup {
	const flattenItems = getFlattenItems(items);

	return {
		selectedItems: flattenItems.filter((item) => !!item.selected),
		unselectedItems: flattenItems.filter((item) => !item.selected)
	};
}

export function defaultFilteringHandler(searchText: string, items: MultiselectProps.Items): MultiselectProps.Items {
	if (searchText) {
		const lowercaseSearchText = searchText.toLowerCase();
		const flattenItems = getFlattenItems(items);

		return flattenItems.filter((item) => item.label.toLowerCase().indexOf(lowercaseSearchText) >= 0);
	}

	return items;
}

export function defaultJoiningHandler(
	selectedItems: MultiselectProps.Item[],
	items: MultiselectProps.Items,
	dropdownClosed: boolean
): string {
	let sorted = selectedItems;

	if (dropdownClosed) {
		const flattenItems = getFlattenItems(items);
		sorted = selectedItems.sort((a, b) => {
			return flattenItems.findIndex((i) => i.id === a.id) - flattenItems.findIndex((i) => i.id === b.id);
		});
	}

	return sorted
		.map((item) => item.label)
		.join(", ")
		.trim();
}

export function sortById(data: MultiselectProps.Item[]): MultiselectProps.Item[] {
	return data.sort((item1: MultiselectProps.Item, item2: MultiselectProps.Item) => {
		if (item1.id < item2.id) {
			return -1;
		}

		if (item1.id > item2.id) {
			return 1;
		}

		return 0;
	});
}

export function isSelectedItemsChanged(oldItems: MultiselectProps.Item[], newItems: MultiselectProps.Item[]) {
	if (oldItems.length === newItems.length) {
		return oldItems.some((item, index) => item.id !== newItems[index].id);
	} else {
		return true;
	}
}
