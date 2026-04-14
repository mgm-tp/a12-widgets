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

import type { HTMLAttributes, ReactNode, RefCallback } from "react";

import type { TextFieldProps } from "../../input/text-field/text-field.api.js";

import type { DatePickerProps } from "./date-picker.api.js";
import type { DateRange } from "./date-range.api.js";

export interface DateInputProps extends TextFieldProps {
	/**
	 * Default value of Date Input.
	 */
	defaultValue?: Date | DateRange;

	/**
	 * Title attribute for the picker button
	 */
	pickerButtonTitle?: string;

	/**
	 * If true, the date picker button will be hidden
	 * @default false
	 */
	hidePickerButton?: boolean;

	/**
	 * Custom icon for the picker button
	 */
	customPickerButtonIcon?: ReactNode;

	/**
	 * The reference of the Date Input.
	 * @param instance – the input element instance.
	 */
	inputRef?: RefCallback<HTMLInputElement>;

	/**
	 * Reference of the picker button
	 */
	buttonRef?: RefCallback<HTMLButtonElement>;

	/**
	 * Props for Date Picker on touch devices
	 */
	datePickerDialogProps?: {
		/**
		 * Title of the modal
		 */
		title?: string;

		okLabel?: string;

		clearLabel?: string;

		/**
		 * Additional HTML attributes to the date picker dialog.
		 *
		 * **Note:** This property will be passed to the Modal Overlay's container element.
		 */
		htmlAttributes?: HTMLAttributes<HTMLDivElement>;
	};

	/**
	 * Props for Date Picker on desktop
	 */
	datePickerProps?: DatePickerProps;

	/**
	 * If true, the date picker will have the ability to select a range of days.
	 * @default false
	 */
	useRangePicker?: boolean;

	/**
	 * Whether a date is selected from the picker
	 */
	onSelectedDayChange?(selectedDay: Date | undefined): void;

	/**
	 * Whether the input value is changed when typing or picking
	 */
	onInputChange?(value: string): void;

	/**
	 * Date format
	 */
	dateFormatter(date: Date): string;

	/**
	 * To convert a string to a date or returns undefined if {@link value} is invalid.
	 * If so, {@link onInputValidationError} will be triggered.
	 */
	dateConverter(value: string): Date | DateRange | undefined;

	/**
	 * Callback is triggered when the value is invalid.
	 */
	onInputValidationError?(value: string): void;

	/**
	 * To get the handler in order to clear all current values
	 * @deprecated from 36.0.0, please use {@link valueChangeHandler} instead
	 */
	clearHandler?(handler: () => void): void;

	/**
	 * Used for updating the value of the selected date from outside the DateInput widget.
	 * handler - Used for updating the value of the input/selected date.
	 * value - If the value being passed to the handler is defined, it will be set as the input's/selected date's new value. If the value being passed is undefined, the input and selected date values will be cleared.
	 */
	valueChangeHandler?(handler: (value: Date | DateRange | undefined) => void): void;
}
