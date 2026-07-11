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

import { DataRoles } from "../../common/main/data-roles.js";

import type { MenuGroup, MenuItem, MenuItemType } from "./menu.api.js";

export const isMenuGroup = (item: MenuItemType | undefined): item is MenuGroup =>
	!!(item && "type" in item && item.type === "group" && "items" in item);

export const isMenuItemList = (items: MenuItemType[] | undefined): items is MenuItem[] =>
	!!items?.every((item) => !isMenuGroup(item));

/**
 * Returns the menu items that can receive focus inside a container.
 * In `arrow-only` mode, excludes aria-disabled items.
 * In default mode, excludes items removed from the tab sequence (tabIndex === -1).
 *
 * @internal
 */
export function getNavigableMenuItems(container: HTMLElement, isArrowOnly: boolean): HTMLElement[] {
	return Array.from(container.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)).filter((el) =>
		isArrowOnly ? el.querySelector("[aria-disabled='true']") === null : el.tabIndex !== -1
	);
}

/**
 * Moves the roving `tabIndex=0` to `items[newIndex]`, setting all others to `tabIndex=-1`.
 *
 * @internal
 */
export function updateMenuRovingTabIndex(items: HTMLElement[], newIndex: number): void {
	items.forEach((item, i) => {
		item.tabIndex = i === newIndex ? 0 : -1;
	});
}

/**
 * Resets roving tabIndex on a container: first enabled item gets `tabIndex=0`, all others `-1`.
 * Only enabled (non-aria-disabled) items are included.
 *
 * @internal
 */
export function resetMenuRovingTabIndex(container: HTMLElement): void {
	getNavigableMenuItems(container, true).forEach((item, i) => {
		item.tabIndex = i === 0 ? 0 : -1;
	});
}

/**
 * Initialises tabIndex for default (tab-based) navigation mode:
 * every enabled item gets `tabIndex=0`, making all items reachable via Tab.
 *
 * @internal
 */
export function initDefaultMenuTabIndex(container: HTMLElement): void {
	getNavigableMenuItems(container, true).forEach((item) => {
		item.tabIndex = 0;
	});
}
