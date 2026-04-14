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

import type { ReactNode, RefCallback } from "react";

import type { ButtonProps } from "../../button/main/button.api.js";
import type { Styleable, Identifiable } from "../../common/main/base-props.js";
import type { ListItemProps } from "../../list/main/list.api.js";

export interface QuickAccessButtonProps
	extends Pick<ButtonProps, "primary" | "secondary" | "destructive" | "invert" | "disabled">, Styleable, Identifiable {
	/**
	 *  children that will be rendered inside the QuickAccessButton's PopUpMenu.
	 * @deprecated from 34.4.0, use {@link actionItems} instead
	 */
	children?: ReactNode;

	/**
	 * The main action button.
	 */
	mainAction?: ReactNode;

	/**
	 * Overrides the icon of the QuickAccessButton's PopUpMenu trigger button.
	 */
	menuTriggerIcon?: ReactNode;

	/**
	 * Array of Action Items that will be rendered inside the QuickAccessButton's PopUpMenu.
	 */
	actionItems?: ListItemProps[];

	/**
	 * If set to true, the action item will keep its main action styles.
	 */
	preserveMainActionStyles?: boolean;

	/**
	 * Notifies that the visibility of the popup is changed.
	 * @param isPopupVisible – true if the popup is show and false if not.
	 */
	onVisibilityChange?(isPopupVisible: boolean): void;

	/**
	 * Specifies whether the focus should be set back to the trigger element when the popup of {@link actionItems} is closed.
	 *
	 * *Note:* Only works with mouse click. Using the keyboard (ESC, SPACE) will always focus on trigger element after the popup is closed.
	 * @default true
	 */
	focusOnTriggerElementAfterClose?: boolean;

	/**
	 * The reference of the button triggering the {@link actionItems} popup.
	 * @param instance of the button element.
	 */
	triggerElementButtonRef?: RefCallback<HTMLButtonElement>;
}
