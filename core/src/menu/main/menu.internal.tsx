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

import { StringUtils } from "../../common/main/utils.js";

import type { MenuItem, MenuItemType } from "./menu.api.js";
import type { FlattenedMenuItemType, MainMenuProps } from "./template/menu.tpl.api.js";
import { MenuTplUtils } from "./template/menu.tpl.internal.js";
import { isMenuGroup } from "./menu.utils.js";

export namespace MenuUtils {
	export interface ItemMenuWrapper extends FlattenedMenuItemType {
		origin: FlattenedMenuItemType;
	}

	/** @internal */
	export function findSelectedChild(item: FlattenedMenuItemType): FlattenedMenuItemType | undefined {
		if (!item.items || item.items.length === 0) {
			return undefined;
		}

		const flattenedItems = MenuTplUtils.flattenToMenuItems(item.items);

		if (flattenedItems) {
			for (const val of flattenedItems) {
				if (val.selected || val.items?.find((v) => v.selected)) {
					return val;
				}

				if (val.items) {
					findSelectedChild(val);
				}
			}
		}

		return undefined;
	}

	/** @internal */
	export function createMenuItemWrapper(
		item: FlattenedMenuItemType,
		isExpanded?: (item: FlattenedMenuItemType) => boolean
	): ItemMenuWrapper {
		const expanded = isExpanded ? isExpanded(item) : false;

		// Copy all properties of item and extend it by origin and a getter for children
		return {
			...item,
			selected: item.selected !== undefined ? item.selected : !!findSelectedChild(item),
			origin: item,
			get items(): FlattenedMenuItemType[] | undefined {
				if (!item.items) {
					return undefined;
				}

				const flattenedItems = MenuTplUtils.flattenToMenuItems(item.items);

				return expanded && flattenedItems
					? flattenedItems.map((child) => createMenuItemWrapper(child, isExpanded))
					: [];
			}
		};
	}

	/** @internal */
	export function isChildMenuElement(element: Element | null, parentId: string | undefined): boolean {
		if (!parentId) {
			return false;
		}

		if (element && element.id === parentId) {
			return false;
		}

		let checkedElement = element;

		while (checkedElement) {
			if (checkedElement.id && checkedElement.id.startsWith(parentId)) {
				return true;
			}

			checkedElement = checkedElement.parentElement;
		}

		return false;
	}

	export interface MenuItemWithChildren extends FlattenedMenuItemType {
		readonly items: (FlattenedMenuItemType & MainMenuProps.MenuItemInternalProps)[];
	}

	/** @internal */
	export function isItemEqual(item: MenuItemType, other: MenuItemType): boolean {
		if (isMenuGroup(item) && isMenuGroup(other)) {
			const group = item;
			const otherGroup = other;

			return group.id === otherGroup.id && group.label === otherGroup.label;
		}

		const menuItem = item as MenuItem;
		const otherMenuItem = other as MenuItem;

		if (
			item.items?.length !== other.items?.length ||
			menuItem.label !== otherMenuItem.label ||
			menuItem.counter !== otherMenuItem.counter ||
			menuItem.badge !== otherMenuItem.badge ||
			menuItem.icon !== otherMenuItem.icon ||
			menuItem.additionalInfoIcon !== otherMenuItem.additionalInfoIcon ||
			menuItem.disabled !== otherMenuItem.disabled ||
			menuItem.selected !== otherMenuItem.selected ||
			menuItem.onClick !== otherMenuItem.onClick
		) {
			return false;
		}

		// If item and other have sub-items, recursively compare each pair of corresponding sub-items for equality.
		if (item.items && other.items) {
			return item.items.every((subItem, index) => isItemEqual(subItem, other.items?.[index] as MenuItem));
		}

		return true;
	}

	/** @internal */
	export function areItemsEqual(items: MenuItemType[], others: MenuItemType[]): boolean {
		return items.length === others.length && items.every((item, index) => isItemEqual(item, others[index]));
	}

	/** @internal */
	export function fillId(item: FlattenedMenuItemType, parentId: string): FlattenedMenuItemType {
		const itemLabelWithoutSpaces = typeof item.label === "string" ? StringUtils.hyphenate(item.label) : undefined;
		const newItem = { ...item, id: item.id || `${parentId}.${itemLabelWithoutSpaces}` };
		const flattenedItems = newItem.items && MenuTplUtils.flattenToMenuItems(newItem.items);

		if (flattenedItems) {
			newItem.items = flattenedItems.map((subNewItem) => {
				return fillId(subNewItem, newItem.id || "");
			});
		}

		return newItem;
	}

	/** @internal */
	export function fillIds(items: FlattenedMenuItemType[], parentId: string): FlattenedMenuItemType[] {
		return items.map((item) => fillId(item, parentId));
	}
}
