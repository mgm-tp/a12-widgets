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

import type { KeyboardEvent, SyntheticEvent } from "react";

import type { Ref, Container, Identifiable, Styleable } from "../../../common/main/base-props.js";

import type { MenuGroup, MenuItem } from "../menu.api.js";

export interface MenuContainerProps extends Styleable, Identifiable, Container, Ref {
	/**
	 * Whether the menu will be displayed horizontally or vertically.
	 */
	type: "vertical" | "horizontal";

	/**
	 * If true, the menu will be a SlidingMenu, otherwise it will be a FlyoutMenu.
	 */
	sliding?: boolean;

	/**
	 * If true, the menu will be compact.
	 */
	condensible?: boolean;

	/**
	 * Whether the menu item is collapsed or expanded.
	 * Note: Only works with SlidingMenu or "vertical" FlyoutMenu.
	 */
	collapsed?: boolean;

	/**
	 * Specifies the aria-label attribute for the main container.
	 */
	ariaLabel?: string;

	/**
	 * Decides whether the menu will be used as the main menu of the page or tab navigation.
	 * If set to "main", the menu will be mentioned as a main menu and have an aria-label attribute which is defined locally.
	 *  - English: "Main navigation"
	 *  - German: "Hauptnavigation"
	 * To customize the text, use A11YLanguageContext (see Accessibility in Widgets Showcase).
	 */
	useAs?: MainMenuProps.UseAs;

	/**
	 * Handle event when pressing keyboard.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;
}

export interface MainMenuProps extends Styleable, Identifiable, Ref<HTMLDivElement> {
	/**
	 * List of menu items.
	 */
	items: (MenuItem & MainMenuProps.MenuItemInternalProps)[];

	/**
	 * Used to flatten groups of items and convert deprecated prop `children` into the new one `items`
	 * @internal
	 */
	flattenedItems?: (FlattenedMenuItemType & MainMenuProps.MenuItemInternalProps)[];

	/**
	 * Whether the menu will be displayed horizontally or vertically.
	 */
	type: "vertical" | "horizontal";

	/**
	 * Whether the menu item is collapsed or expanded.
	 * Note: Only works with SlidingMenu or "vertical" FlyoutMenu.
	 */
	collapsed?: boolean;

	/**
	 * The number of items that display without having to click into the menu.
	 * @internal
	 */
	nonCondensedItemCount?: number;

	/** @internal */
	clickedOnMainMenu?: boolean;

	/** @internal */
	onCloseAllSubMenus?(): void;

	/**
	 * Handle event when clicking an item by mouse.
	 */
	onClick?(item: MenuItem, event: SyntheticEvent<HTMLElement>): void;

	/**
	 * Handle event when the mouse pointer is moved onto the menu item.
	 */
	onMouseOver?(item: MenuItem, event: SyntheticEvent<HTMLElement>): void;

	/**
	 * Handle event when the mouse pointer is moved out of the menu item.
	 */
	onMouseOut?(): void;
}

export namespace MainMenuProps {
	export interface MenuItemWrapper {
		/**
		 * @internal
		 * @deprecated since 36.3.0
		 */
		originalItem: MenuItem & MenuItemInternalProps;

		/**
		 * @internal
		 */
		flattenedOriginalItem?: FlattenedMenuItemType & MenuItemInternalProps;

		/**
		 * @internal
		 * @deprecated since 36.3.0. Use {@link items} instead
		 */
		children: MenuItemWrapper[];

		items?: MenuItemWrapper[];

		/** @internal */
		parent?: MenuItemWrapper;

		/** @internal */
		id: string;

		/**
		 * Used to identify the group where the item belongs to.
		 * @internal
		 */
		group?: MenuGroup;
	}

	export interface ItemProps extends Styleable, Identifiable {
		/** @internal */
		item: MenuItem;

		/** @internal */
		itemWrapper?: MenuItemWrapper;

		/** @internal */
		type: "horizontal" | "vertical";

		/** @internal */
		showPlaceholder?: boolean;

		/** @internal */
		rootId?: string;

		/** @internal */
		collapsed?: boolean;

		/**
		 * @internal
		 *
		 * If specified, the group's label in the condensed menu will not be shown.
		 * This is useful when the condensed menu does not contain all menu items from the same group.
		 */
		hideSubMenuGroupTitle?: boolean;

		/** @internal */
		clickedOnMainMenu?: boolean;

		/** @internal */
		onClick?(item: MenuItem, event: SyntheticEvent<HTMLElement>): void;

		/** @internal */
		onMouseOut?(): void;

		/** @internal */
		onMouseOver?(item: MenuItem, event: SyntheticEvent<HTMLElement>): void;
	}

	export interface MenuItemInternalProps extends Ref<HTMLLIElement> {
		/** @internal */
		closeCurrentSubMenu?(): void;

		/** @internal */
		onCloseAllSubMenus?(): void;

		/** @internal */
		subMenuItem?: boolean;

		/** @internal */
		wrapperClass?: string;

		/** @internal */
		condensed?: boolean;

		/** @internal */
		sliding?: boolean;
	}

	export type UseAs = "main" | "tabNavigation";
}

export interface FlattenedMenuItemType extends Omit<MenuItem, "children" | "items"> {
	items?: MenuItem[];
}
