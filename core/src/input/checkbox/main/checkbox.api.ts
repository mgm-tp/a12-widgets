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
 * This checkbox (input) widget wraps the HTML checkbox element and provide more functionality
 * such as tooltips, label and error message.
 * @module
 */

import type { ChangeEvent, RefCallback, MouseEvent } from "react";

import type { BaseInputEventHandler, BaseInputProps, InputDOMProps } from "../../base/template/base.tpl.api.js";

export interface BaseCheckboxProps<ElementType extends HTMLElement = HTMLInputElement>
	extends BaseInputProps, Omit<BaseInputEventHandler<ElementType>, "onChange">, InputDOMProps<ElementType> {
	/**
	 * tabIndex of the checkbox.
	 */
	tabIndex?: number;

	/**
	 * Return ids of the set of checkboxes controlled by the indeterminate checkbox.
	 */
	ariaControls?: string;

	/**
	 * Title property to show the checkbox's name (hint text) on checkbox's on mouse over event.
	 */
	title?: string;
}

/**
 * The props of Checkbox.
 */
export interface CheckboxProps extends BaseCheckboxProps {
	/**
	 * Returns if the checkbox is checked.
	 */
	checked: boolean;

	/**
	 * Handler function when the checkbox is changed.
	 */
	onChange(value: boolean, event: ChangeEvent<HTMLInputElement>): void;

	/**
	 * Reference of the Checkbox.
	 * @param instance – the input element instance.
	 */
	inputRef?: RefCallback<HTMLInputElement>;
}

export interface IndeterminateCheckboxProps extends BaseCheckboxProps<HTMLButtonElement> {
	/**
	 * Returns if the checkbox is checked.
	 */
	checked: boolean | "mixed";

	/**
	 * Handler function when the checkbox is changed.
	 */
	onChange(value: boolean, event: MouseEvent): void;

	/**
	 * Reference of the Indeterminate Checkbox.
	 * @param instance – the button element instance
	 */
	buttonRef?: RefCallback<HTMLButtonElement>;
}
