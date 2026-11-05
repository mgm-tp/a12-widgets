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

import type { ColumnVisibilityItem, ColumnVisibilityMap } from "./column-visibility-panel.api.js";

/** The visibility a column has unless the user changed it, `true` for an item that does not say. */
export function isColumnVisibleByDefault(item: ColumnVisibilityItem): boolean {
	return item.defaultVisible ?? true;
}

/** The visibility of the given columns as the panel reports it. */
export function getColumnVisibility(items: ColumnVisibilityItem[]): ColumnVisibilityMap {
	return Object.fromEntries(items.map((item) => [item.id, item.visible]));
}

/**
 * The visibility the panel's reset action restores: the default of every column the user may change,
 * and the current state of the disabled ones.
 */
export function getDefaultColumnVisibility(items: ColumnVisibilityItem[]): ColumnVisibilityMap {
	return Object.fromEntries(
		items.map((item) => [item.id, item.disabled ? item.visible : isColumnVisibleByDefault(item)])
	);
}

/**
 * Whether any column the user may change deviates from its default, i.e. whether a reset would change
 * anything. Disables the panel's reset action.
 */
export function hasColumnVisibilityDeviation(items: ColumnVisibilityItem[]): boolean {
	return items.some((item) => !item.disabled && item.visible !== isColumnVisibleByDefault(item));
}

/** The text a column is searched by: its label where that is a text, otherwise its title. */
export function getColumnSearchText(item: ColumnVisibilityItem): string {
	const { label } = item;

	return typeof label === "string" || typeof label === "number" ? String(label) : (item.title ?? "");
}

/**
 * The columns whose name contains the search term, ignoring case. An empty term matches every column.
 */
export function filterColumnVisibilityItems(items: ColumnVisibilityItem[], searchTerm: string): ColumnVisibilityItem[] {
	const term = searchTerm.trim().toLocaleLowerCase();

	if (!term) {
		return items;
	}

	return items.filter((item) => getColumnSearchText(item).toLocaleLowerCase().includes(term));
}

/**
 * Whether any of the given columns is hidden and may be shown, i.e. whether showing them all would
 * change anything. It is what disables the panel's show-all action.
 */
export function hasHiddenColumns(items: ColumnVisibilityItem[]): boolean {
	return items.some((item) => !item.disabled && !item.visible);
}
