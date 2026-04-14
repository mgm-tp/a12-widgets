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
 * This checkbox-group (input) widget wraps the HTML checkbox elements
 * in a group and provide more functionality
 * such as tooltips, label and error message.
 * @module
 */

import type { RefCallback, RefObject, ChangeEvent } from "react";

import type { Container } from "../../../common/main/base-props.js";
import type { BaseInputProps } from "../../base/template/base.tpl.api.js";
import type { BaseCheckboxProps } from "../../checkbox/main/checkbox.api.js";

/**
 * The props of CheckboxGroup.
 */
export interface CheckboxGroupProps extends BaseInputProps, Container {
	/**
	 * Handler function when the checkbox value is changed.
	 */
	onValueChanged?(value: string): void;

	/**
	 * Display all items inline.
	 */
	inline?: boolean;

	/**
	 * The reference of the group wrapper.
	 */
	wrapperRef?: RefCallback<HTMLDivElement> | RefObject<HTMLDivElement>;
}

/**
 * The props of CheckboxGroup Item.
 */
export interface CheckboxItemProps extends Omit<BaseCheckboxProps, "warningMessage" | "errorMessage" | "checked"> {
	/**
	 * The value of the CheckboxGroup Item.
	 */
	value: string;

	/**
	 * Specifies whether the CheckboxGroup Item is selected.
	 */
	selected?: boolean;

	/**
	 * The reference of the input field.
	 */
	inputRef?: RefCallback<HTMLInputElement>;

	/**
	 * Handler function when the CheckboxGroup Item is changed.
	 */
	onChange?(ev: ChangeEvent<HTMLInputElement>): void;
}
