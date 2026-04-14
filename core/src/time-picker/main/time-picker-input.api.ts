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

import type { ReactNode, HTMLProps, RefCallback } from "react";

import type { Identifiable, Styleable } from "../../common/main/base-props.js";
import type { BaseInputProps, InputDOMProps } from "../../input/base/template/base.tpl.api.js";

export interface TimeInputBaseProps
	extends InputDOMProps, Omit<BaseInputProps, "breakTooltipsToNewLine" | "fitToParent"> {
	/**
	 * Specifies addons will be placed before time picker input wrapper
	 */
	addonBefore?: ReactNode | ReactNode[];

	/**
	 * Specifies addons will be placed after time picker input wrapper
	 */
	addonAfter?: ReactNode | ReactNode[];

	/**
	 * Override the default icon of the input.
	 */
	icon?: ReactNode;

	/**
	 * Placeholder for the input.
	 */
	placeholder?: string;

	/**
	 * This property enables ability to focus on time input after clicking ok button from time picker dialog.
	 * @default false
	 */
	focusOnInputAfterPicking?: boolean;

	/**
	 * Pass DOM properties for Time Picker Input Wrapper
	 */
	timeInputWrapperProps?: Omit<HTMLProps<HTMLDivElement>, "ref" | "as">;
}

/**
 * @deprecated since 34.3.0, use {@link TimeInputProps} instead.
 */
export type InputProps = TimeInputProps;

export interface TimeInputProps extends Styleable, Identifiable, TimeInputBaseProps {
	/**
	 * The value of the input.
	 */
	value: string;

	/**
	 * The ref to the input field.
	 */
	inputRef?: RefCallback<HTMLInputElement>;

	/**
	 * The ref to the input's wrapper.
	 */
	inputWrapperRef?: RefCallback<HTMLDivElement>;

	/**
	 * Trigger when the input is clicked.
	 */
	onClick?(): void;

	/**
	 * Trigger when the text inside the input is changed. It always be triggered whenever blurring the time input
	 * even if the time value is not changed since the last submit.
	 */
	onChange?(newText: string): void;

	/**
	 * Trigger for every change from the text inside.
	 */
	onValueChange?(newText: string): void;
}
