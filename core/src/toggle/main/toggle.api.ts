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

import type { SyntheticEvent } from "react";

import type { Container, Identifiable, Ref, Styleable } from "../../common/main/base-props.js";

export interface ToggleProps extends Styleable, Container, Identifiable {
	/**
	 * Item's value that being selected.
	 */
	value?: string;

	/**
	 * Title label of the widget.
	 */
	label?: string | undefined;

	/**
	 * Set the widget to be rendered read-only.
	 */
	readOnly?: boolean;

	/**
	 * Set the widget to be rendered disabled.
	 */
	disabled?: boolean;

	/**
	 * Make size (width and height) of toggle item fit to parent's size.
	 *
	 * @default false
	 */
	block?: boolean;

	/**
	 * Only display the selected item when the toggle is not hovered.
	 * @default false
	 * @requires value
	 */
	showOnlySelectedOption?: boolean;

	/**
	 * Trigger when a selection is changed.
	 */
	onValueChanged?(newValue: string, oldValue?: string): void;
}

/**
 * The visual style variant for toggle items when displayed in showOnlySelectedOption mode.
 */
export type ToggleItemVariant = "status1" | "status2" | "status3";

export interface ToggleItemProps extends Styleable, Container, Identifiable, Ref {
	/**
	 * Item's value.
	 */
	value: string;

	/**
	 * Item's variant to be displayed as a selected item overlay when Toggle is in showOnlySelectedOption.
	 * @requires showOnlySelectedOption
	 */
	variant?: ToggleItemVariant;

	/**
	 * Title property to show item's name (hint text) on toggle item's on mouse over event.
	 */
	title?: string;

	/**
	 * Set the item to be rendered disabled.
	 */
	disabled?: boolean;

	/**
	 * Set the item to be rendered read-only.
	 */
	readOnly?: boolean;

	/**
	 * Trigger when clicking on an item.
	 */
	onClick?(event: SyntheticEvent<HTMLElement>): void;

	/**
	 * @internal
	 */
	selected?: boolean;
}
