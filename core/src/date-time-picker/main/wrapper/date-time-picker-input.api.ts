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

import type { BaseInputProps } from "../../../input/base/template/base.tpl.api.js";

import type { DateTimePickerProps } from "../date-time-picker.api.js";

export interface DateTimePickerInputProps<T extends DateTimePickerProps> extends Omit<
	BaseInputProps,
	"breakTooltipsToNewLine" | "fitToParent" | "label" | "errorMessage" | "warningMessage" | "tooltips"
> {
	/**
	 * Initial text of the datetime input field.
	 */
	initialText?: string;

	/**
	 * The input label that will display in the input box.
	 */
	inputLabel?: string;

	/**
	 * The input error message.
	 */
	inputErrorMessage?: ReactNode;

	/**
	 * The input warning message.
	 */
	inputWarningMessage?: ReactNode;

	/**
	 * The input tooltips.
	 */
	inputTooltips?: ReactNode;

	/**
	 * The input button icon.
	 */
	buttonIcon?: ReactNode;

	/**
	 * The input datetime format.
	 */
	dateTimeInputFormat?: string;

	/**
	 * Custom placeholder.
	 */
	placeholder?: string;

	/**
	 * The reference of the input field.
	 */
	inputRef?: RefCallback<HTMLInputElement>;

	/**
	 * To format a date time to string (in regard to timezone if specified)
	 * @param {Date | undefined} dateTime – The date time to be formatted.
	 * @returns {string} The formatted date time string.
	 *
	 * @example Without specified timezone
	 * dateTimeFormatter(new Date(Date.UTC(2010, 0, 1, 13, 45))) // returns "01/01/2010 1:45 PM"
	 *
	 * @example With America/New_York timezone
	 * dateTimeFormatter(new Date(Date.UTC(2010, 0, 1, 13, 45))) // returns "01/01/2010 08:45 AM"
	 */
	dateTimeFormatter?: DateTimePickerProps.DateTimeFormatter;

	/**
	 * To convert a date time string to a Date object (in regard to timezone if specified)
	 * @param {string} dateTimeString – The date time string to convert.
	 * @returns {Date | undefined} The converted date or undefined. Using undefined if the date time string is invalid.
	 *
	 * @example Without specified timezone
	 * dateTimeConverter("25-12-2023 14:00") // returns a Date object with ISO format "2023-12-25T14:00:00.000Z"
	 *
	 * @example With America/New_York timezone
	 * dateTimeConverter("25-12-2023 14:00") // returns a Date object with ISO format "2023-12-25T19:00:00.000Z"
	 */
	dateTimeConverter?: DateTimePickerProps.DateTimeConverter;

	/**
	 * Callback is triggered when the value is invalid.
	 */
	onInputValidationError?(value: string): void;

	/**
	 * Callback is triggered whether the input value is changed when blur the input or submit the date.
	 */
	onInputChange?(value: string): void;

	/**
	 * The props of DatePicker extends from DayPickerProps of react-day-picker library
	 * @see https://react-day-picker.js.org/api/interfaces/DayPickerBase
	 */
	pickerProps?: T;

	/**
	 * To get the handler in order to clear all current values
	 */
	clearHandler?(handler: () => void): void;
}
