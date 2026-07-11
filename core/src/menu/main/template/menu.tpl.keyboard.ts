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

import type { KeyboardEvent as ReactKeyboardEvent, SyntheticEvent } from "react";
import { Key } from "ts-key-enum";

import { DataRoles } from "../../../common/main/data-roles.js";
import type { KeyboardNavigationMode } from "../../../keyboard-navigation/main/keyboard-navigation.api.js";

import type { MenuItem } from "../menu.api.js";
import { getNavigableMenuItems, updateMenuRovingTabIndex } from "../menu.utils.js";

import type { FlattenedMenuItemType } from "./menu.tpl.api.js";

export interface MenuItemKeyDownOptions {
	item: MenuItem;
	type: "horizontal" | "vertical";
	sliding?: boolean;
	liElement: HTMLElement | null;
	showCurrentSubMenu: boolean;
	subMenuItems: FlattenedMenuItemType[] | undefined;
	onItemClick: (event: ReactKeyboardEvent<HTMLElement>) => void;

	/** Opens the submenu — responsible for calling onMouseOver and updating showCurrentSubMenu state. */
	openSubMenu: (event: ReactKeyboardEvent<HTMLElement>) => void;
	onEsc: (event: SyntheticEvent<HTMLElement>) => void;
	setMouseOverVertical: (value: boolean) => void;
}

/** @internal */
export function handleMenuItemKeyDown(
	event: ReactKeyboardEvent<HTMLElement>,
	{
		item,
		type,
		sliding,
		liElement,
		showCurrentSubMenu,
		subMenuItems,
		onItemClick,
		openSubMenu,
		onEsc,
		setMouseOverVertical
	}: MenuItemKeyDownOptions
): void {
	if (event.target !== liElement) {
		return;
	}

	setMouseOverVertical(false);

	if (event.key === Key.Enter && !item.disabled) {
		if (subMenuItems === undefined || sliding) {
			onItemClick(event);

			if (subMenuItems === undefined) {
				return;
			}
		}

		openSubMenu(event);
	} else if (sliding && event.key === Key.ArrowRight && !item.disabled) {
		if (subMenuItems !== undefined) {
			event.preventDefault();
			event.stopPropagation();
			onItemClick(event);
		}
	} else if (
		!sliding &&
		!item.disabled &&
		((type === "horizontal" && event.key === Key.ArrowDown) || (type === "vertical" && event.key === Key.ArrowRight))
	) {
		if (item.items || item.children) {
			event.preventDefault();
			event.stopPropagation();
			openSubMenu(event);
		}
	} else if (event.key === Key.Escape && showCurrentSubMenu) {
		onEsc(event);
	}
}

export interface SubMenuKeyDownOptions {
	type: "horizontal" | "vertical";
	subMenuItem?: boolean;
	liElement: HTMLElement | null;
	onCloseAllSubMenus?: () => void;
	closeCurrentSubMenu: () => void;
	setPendingSubmenuElement: (el: HTMLElement | null) => void;
	keyboardNavMode?: KeyboardNavigationMode;
}

/** @internal */
export function handleSubMenuKeyDown(
	event: ReactKeyboardEvent<HTMLElement>,
	{
		type,
		subMenuItem,
		liElement,
		onCloseAllSubMenus,
		closeCurrentSubMenu,
		setPendingSubmenuElement,
		keyboardNavMode
	}: SubMenuKeyDownOptions
): void {
	const isArrowLeft = event.key === Key.ArrowLeft;
	const isArrowRight = event.key === Key.ArrowRight;
	const isEscape = event.key === Key.Escape;

	if (!isArrowLeft && !isArrowRight && !isEscape) {
		return;
	}

	if (isEscape) {
		event.preventDefault();
		event.stopPropagation();
		liElement?.focus();
		closeCurrentSubMenu();

		return;
	}

	if (isArrowLeft && type === "vertical") {
		// ArrowLeft in a vertical menu is handled by the item-level window listener,
		// so only the deepest open submenu closes no matter where focus is.
		return;
	}

	if (type === "horizontal" && !subMenuItem) {
		if (isArrowLeft) {
			const ownerDoc = liElement?.ownerDocument ?? document;
			const openSubMenus = ownerDoc.querySelectorAll(`[data-role="${DataRoles.SubMenu.Content}"]`);

			if (openSubMenus.length > 1) {
				return;
			}
		}

		event.preventDefault();
		event.stopPropagation();

		const isArrowOnly = keyboardNavMode === "arrow-only";
		const direction = isArrowRight ? 1 : -1;
		const menuContent = liElement?.closest<HTMLElement>(`[data-role="${DataRoles.Menu.Content}"]`);
		const topLevelItems = menuContent ? getNavigableMenuItems(menuContent, isArrowOnly) : [];
		const currentIndex = topLevelItems.indexOf(liElement!);

		if (currentIndex === -1) {
			return;
		}

		const newIndex = (currentIndex + direction + topLevelItems.length) % topLevelItems.length;
		const adjacentEl = topLevelItems[newIndex];

		onCloseAllSubMenus?.();
		closeCurrentSubMenu();

		if (isArrowOnly) {
			updateMenuRovingTabIndex(topLevelItems, newIndex);
		}

		if (adjacentEl?.querySelector('[aria-haspopup="true"]')) {
			setPendingSubmenuElement(adjacentEl);
		}

		adjacentEl?.focus();
	}
}
