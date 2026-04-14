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
 * This HeaderTrigger widget wraps the HTML button element and provides more functionality
 * @module
 */

import type { RefCallback, MouseEvent, KeyboardEvent } from "react";

import type { Container, DataRole, Identifiable, Styleable } from "../../../common/main/base-props.js";

/**
 * This is the props of HeaderTrigger widget.
 */
export interface HeaderTriggerProps extends Styleable, Identifiable, Container, DataRole {
	/**
	 * Whether HeaderTrigger is activated,
	 * if true, background color will be changed.
	 */
	active?: boolean;

	/**
	 * Specifies whether the HeaderTrigger is disabled.
	 */
	disabled?: boolean;

	/**
	 * Graphic Icon of HeaderTrigger
	 */
	graphic?: string;

	/**
	 * Text of HeaderTrigger
	 */
	text?: string;

	/**
	 * Title of {@link text} to support accessibility
	 */
	textTitle?: string;

	/**
	 * Meta Icon of HeaderTrigger
	 */
	meta?: string;

	/**
	 * Specifies whether the header trigger is used as trigger element for multilingual popup.
	 */
	multilingual?: boolean;

	/**
	 * Specifies whether the hidden text placed before the header content should be hidden from screen readers or not.
	 *
	 * If this property is set to:
	 * - `undefined` (default) or `false` - show the default hidden text that indicates the header content as a selected option:
	 * 	+ English: "Selected "
	 *	+ German: "Gewählt "
	 * - `true` - the hidden text will be removed.
	 *
	 * To customize the hidden text, use `A11YLanguageContext` (see Accessibility in Widgets Showcase).
	 */
	hideHiddenText?: boolean;

	/**
	 * Specifies whether the icon and text of the multilingual header trigger align vertically in the center.
	 * @requires multilingual
	 */
	vertical?: boolean;

	/**
	 * Specifies whether the multilingual header trigger has a light background.
	 * @requires multilingual
	 */
	light?: boolean;

	/**
	 * The ref to the button.
	 * @param instance – the button element instance.
	 */
	buttonRef?: RefCallback<HTMLButtonElement>;

	/**
	 * Click handler for HeaderTrigger.
	 * @param event – mouse event.
	 */
	onClick?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Handle key up event for HeaderTrigger.
	 * @param event – keyboard event.
	 */
	onKeyUp?(event: KeyboardEvent): void;
}
