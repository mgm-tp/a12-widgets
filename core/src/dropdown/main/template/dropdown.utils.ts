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

import type { DropDownItem } from "./dropdown.tpl.api.js";

/**
 * Whether two options stand for the same thing.
 *
 * With a `getItemKey` at hand the two keys decide it. Without one the options are compared the way
 * selection has always compared them: by {@link DropDownItem.value} when the second option has one,
 * otherwise by label and id together — which cannot tell two options with the same label apart.
 * @param one the first option
 * @param other the second option
 * @param getItemKey identifies an option, as passed to the list through `getItemKey`
 */
export function isSameDropdownItem<T>(
	one: DropDownItem<T> | undefined,
	other: DropDownItem<T> | undefined,
	getItemKey?: (item: DropDownItem<T>) => string
): boolean {
	if (!one || !other) {
		return false;
	}

	if (getItemKey) {
		return getItemKey(one) === getItemKey(other);
	}

	return other.value ? one.value === other.value : one.label === other.label && one.id === other.id;
}

export function isExtendedDropdown(data: DropDownItem[]): boolean {
	for (const item of data) {
		if (item.secondaryText || item.children) {
			return true;
		}
	}

	return false;
}

/**
 * Counts the options in a list: a section contributes the options inside it rather than itself.
 *
 * Only the one level of sections the list renders is resolved — an option nested deeper counts as
 * itself, because that is what appears in the list. The same count as the number of entries in the
 * model `buildNavigationModel` builds, which is what the list navigates over.
 * @param data the options, sections included
 * @returns how many options the list holds
 */
export function getDropDownItemsLength(data: DropDownItem[]): number {
	return data.reduce((count, item) => count + (item.children ? item.children.length : 1), 0);
}

/**
 * @deprecated since 39.1.0. Use `buildNavigationModel(items).entries`, which reports each option's
 *   position in the flattened list along with it. It flattens the one level of sections the list
 *   renders, where this recurses to any depth — so the two differ for items nested deeper than that.
 */
export function flattenItems(items: DropDownItem[], result: DropDownItem[]): void {
	for (const item of items) {
		if (item.children) {
			flattenItems(item.children, result);
		} else {
			result.push(item);
		}
	}
}
