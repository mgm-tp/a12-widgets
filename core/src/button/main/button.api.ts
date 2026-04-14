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

/**
 * This button widget wraps the HTML button element and provides more functionality
 * like icon (icon button).
 *  @module
 */

import type { ReactNode, HTMLAttributes, MouseEvent, KeyboardEvent, RefCallback, FocusEvent } from "react";

import type { Identifiable, Styleable, Container, DataRole } from "../../common/main/base-props.js";

export interface ButtonProps extends Styleable, Identifiable, Container, DataRole {
	/** Specify the type of the button.
	 * @default button
	 */
	type?: "button" | "submit" | "reset";

	/**
	 * The label of the button.
	 */
	label?: ReactNode;

	/**
	 * Specify a badge for the button. It is only shown with the icon button.
	 */
	badge?: ReactNode;

	/**
	 * Specify the title attribute that will be shown when hovering the button.
	 */
	title?: string;

	/**
	 * Specify whether the button is a primary button.
	 */
	primary?: boolean;

	/**
	 * Specify whether the button is a secondary button.
	 * It's default for the normal button. For the icon button, this flag has to be set explicitly to make it secondary.
	 */
	secondary?: boolean;

	/**
	 * Specify whether the button represents a destructive action.
	 */
	destructive?: boolean;

	/**
	 * If true, an inverted color will be set. It's useful in case the background is dark.
	 * For the secondary button, an additional outline will be displayed to make it more visible to the user.
	 * @requires primary
	 * @requires secondary
	 */
	invert?: boolean;

	/**
	 * Make the width and height of the button (width and height) fit its parent.
	 * @default false
	 */
	block?: boolean;

	/**
	 * Whether the button is activated. If true, the background color will be changed.
	 */
	active?: boolean;

	/**
	 * Specify whether the button is disabled.
	 */
	disabled?: boolean;

	/**
	 * Aligns the button's icon and text vertically at the center.
	 *
	 * *Note:* This property should only be used when both the icon and text are present.
	 */
	vertical?: boolean;

	/**
	 * Specify an additional icon for the button. If no label is given, the button will be considered as an icon button.
	 */
	icon?: ReactNode;

	/**
	 * Specify the tabIndex attribute for the button.
	 */
	tabIndex?: number;

	/**
	 *  Specify the additional props that will be placed at the real button attributes Element.
	 *  It should be used in case a user want to access to the native DOM properties of the original button element but there's no property allows to do that.
	 */
	buttonAttributes?: HTMLAttributes<HTMLButtonElement>;

	/**
	 * Specify whether the button is a loading button. If true, a progress indicator will be shown inside the button.
	 */
	loading?: boolean;

	/**
	 * Specify the progressed percentage of the process that represents the width of ProgressBar widget.
	 * Recommend using when a user is in the action which needs to visualize the progression (ex: downloading, installing...).
	 */
	processedPercentage?: number;

	/**
	 * If the {@link label} is defined and this property is set to true, the label will be hidden but still be used as the item text in the responsive button group.
	 * @requires label
	 */
	labelHidden?: boolean;

	/**
	 * Click handler for the button.
	 * @param event – HTML mouse event.
	 */
	onClick?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Mouse over handler for the button.
	 * @param event – HTML mouse event.
	 */
	onMouseOver?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Mouse leave handler for the button.
	 * @param event – HTML mouse event.
	 */
	onMouseLeave?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Mouse down handler for the button.
	 * @param event – HTML mouse event.
	 */
	onMouseDown?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Key down handler for the button.
	 * @param event – HTML key event.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * Key up handler for the button.
	 * @param event – HTML key event.
	 */
	onKeyUp?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * The reference of the button.
	 * @param instance – the button element instance.
	 */
	buttonRef?: RefCallback<HTMLButtonElement>;

	/**
	 * Key press handler for the button.
	 * @param event – HTML key event.
	 */
	onKeyPress?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * Focus handler for the button.
	 * @param event – HTML focus event
	 */
	onFocus?(event: FocusEvent<HTMLElement>): void;

	/**
	 * Blur handler for the button.
	 * @param event – HTML focus event
	 */
	onBlur?(event: FocusEvent<HTMLElement>): void;
}
