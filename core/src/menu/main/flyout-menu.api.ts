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

import type { ReactNode } from "react";

import type { MenuBaseProps, MenuItem } from "./menu.api.js";
import type { MainMenuProps } from "./template/menu.tpl.api.js";

export interface FlyoutMenuProps extends MenuBaseProps {
	/**
	 * Whether the menu will be displayed horizontally or vertically.
	 */
	type: "vertical" | "horizontal";

	/**
	 * If true, all items will expand to their inherent width.
	 *
	 * *Note:* Only works with "horizontal" Flyout Menu.
	 *
	 * @deprecated from 36.0.0. This property could cause unexpected bugs for layout if used.
	 */
	disableCondensing?: boolean;

	/**
	 * Specify the delay time when the submenu is shown by hovering on parent.
	 *
	 * *Note:* Only works on non-touchable devices.
	 *
	 * @default 100
	 */
	hoverDelay?: number;

	/**
	 * Whether the menu will be used as the main menu of the page or tab navigation.
	 *
	 * If set to "main", the menu will be mentioned as a main menu and have an aria-label attribute which is defined locally.
	 * - English: "Main navigation"
	 * - German: "Hauptnavigation"
	 *
	 * To customize the text, use A11YLanguageContext (see Accessibility in Widgets Showcase).
	 *
	 * *NOTE:* If {@link mainContainerLabel} is defined then it will be used.
	 */
	useAs?: MainMenuProps.UseAs;

	/**
	 * A callback will be returned with an array of condensed items.
	 */
	onCondensed?(condensedItems: MenuItem[]): void;

	/**
	 * A badge to be displayed at the top-right of the 3-dot menu item in a responsive menu.
	 */
	condensedBadge?: ReactNode;
}
