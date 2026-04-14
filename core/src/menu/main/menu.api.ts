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

import type { HTMLAttributes, ReactNode, ReactElement, SyntheticEvent } from "react";

import type { Identifiable, Ref, Styleable } from "../../common/main/base-props.js";
import type { CounterProps } from "../../counter/main/counter.api.js";
import type { IconProps } from "../../icon/main/icon.api.js";

export interface MenuBaseProps extends Styleable, Identifiable, Ref {
	/**
	 * List of menu items.
	 *
	 * *Note:*
	 * - {@link MenuItemType} is a union type created by combining {@link MenuItem} and {@link MenuGroup}, where MenuGroup can help group items together.
	 * - `MenuGroup` is only used for Horizontal Flyout Menu.
	 */
	items: MenuItemType[];

	/**
	 * Will compact the view if true.
	 *
	 * *Note:* Only works with the SlidingMenu or "vertical" FlyoutMenu.
	 */
	collapsed?: boolean;

	/**
	 * Specify aria-label attribute of the main container.
	 */
	mainContainerLabel?: string;

	/**
	 * Scrolls to selected item on loaded.
	 */
	scrollToSelectedItem?: boolean;

	/**
	 * Specify HTML attributes for the sub-menu.
	 */
	subMenuAttributes?: HTMLAttributes<HTMLUListElement>;
}

export interface MenuItem extends Styleable, Identifiable {
	/**
	 * Label of the menu item.
	 */
	label: ReactNode;

	/**
	 * List of submenu.
	 * @deprecated since 36.3.0. Use {@link items} instead
	 */
	children?: MenuItem[];

	/**
	 * List of items in sub-menu. It can contain both ordinary items and groups of items.
	 */
	items?: MenuItemType[];

	/**
	 * Used to identify the group where the item belongs to.
	 * @internal
	 */
	group?: MenuGroup;

	/**
	 * An icon which is displayed as the placeholder of the item.
	 * If not set, the first letter of {@link label} will display instead.
	 *
	 * *Note:* If the {@link variant} is set, the icon from that property will take priority.
	 */
	icon?: ReactNode;

	/**
	 * A Counter to display at the end of item's label as the additional information.
	 */
	counter?: ReactElement<CounterProps>;

	/**
	 * A badge to display at the top-right of item's label as the additional information or notification.
	 */
	badge?: ReactNode;

	/**
	 * An additional icon will display when SlidingMenu is expanded to replace {@link icon}.
	 *
	 * *Note:* Only work with SlidingMenu or "vertical" FlyoutMenu.
	 */
	additionalInfoIcon?: ReactElement<IconProps>;

	/**
	 * If true, the item is disabled.
	 */
	disabled?: boolean;

	/**
	 * Whether this element is selected.
	 */
	selected?: boolean;

	/**
	 * Title of menu item.
	 * To fully support accessibility with screen reader, a menu item should have a title if it has no {@link label}.
	 */
	title?: string;

	/**
	 * aria-label attribute of the menu item.
	 * If this property is not defined, the {@link title} property will be used as the Item's aria-label.
	 */
	ariaLabel?: string;

	/**
	 * If true, the label will be hidden but still be used as the item text in condensed items.
	 *
	 * *Note:* Only work with FlyoutMenu.
	 */
	labelHidden?: boolean;

	/**
	 * Variant of a menu item. There are 6 values: `open`, `info`, `error`, `warning`, `done`, and `inProgress`.
	 * If it is defined, a specific icon corresponding to that variant will be displayed.
	 */
	variant?: MenuItemVariant;

	/**
	 * Handle event when an item is selected by mouse.
	 *
	 * *Note:*
	 * - If the item has a sub-menu, this event will be triggered when clicking on the parent item to expand the sub-menu.
	 * - To handle the click event on the backward item (when navigating back to the parent menu), use {@link backwardItemProps.onClick} instead.
	 */
	onClick?(event: SyntheticEvent<HTMLElement>): void;

	/**
	 * Customize the properties of the backward navigation item displayed in the Sliding Menu.
	 *
	 * *Note:*
	 * - The backward item appears at the top of a sub-menu and allows users to navigate back to the parent menu.
	 * - By default, the backward item inherits all properties from its parent item.
	 * - Use this property to override specific properties (e.g., label, icon, onClick handler) for the backward item.
	 * - The `children` and `items` properties cannot be customized as they are not applicable to backward navigation items.
	 */
	backwardItemProps?: Omit<MenuItem, "children" | "items">;
}

export interface MenuGroup extends Styleable, Identifiable {
	/**
	 * To distinguish it from the ordinary item.
	 */
	type: "group";

	/**
	 * List of items in a group.
	 *
	 * *Note:* This prop must be specified along with {@link type} to define it as a group. {@link MenuItem.children} is not valid for a group.
	 */
	items: MenuItem[];

	/**
	 * Menu group's label.
	 */
	label?: ReactNode;
}

/**
 * A menu item can be either a single menu item or a group of menu items.
 */
export type MenuItemType = MenuItem | MenuGroup;
export type MenuItemVariant = "open" | "info" | "error" | "warning" | "done" | "inProgress";
