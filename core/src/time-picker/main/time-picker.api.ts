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

import type { ReactNode, RefCallback, HTMLAttributes } from "react";

import type { Identifiable, Styleable } from "../../common/main/base-props.js";

import type { TimeInputBaseProps } from "./time-picker-input.api.js";

export interface TimePickerBaseProps extends Styleable, Identifiable {
	/**
	 * Override the default header of picker.
	 */
	customHeaderElement?: ReactNode | TimePickerProps.Renderer;

	/**
	 * Override the label of the clear button for dialog in mobile devices.
	 */
	clearLabel?: string;

	/**
	 * Override the label of the ok button for dialog in mobile devices.
	 */
	okLabel?: string;

	/**
	 * The value of the TimePicker, for use in controlled mode.
	 */
	value?: Date;

	/**
	 * The clock will display in 12 hour or 24 hour mode.
	 */
	mode?: TimePickerProps.ClockMode;

	/**
	 * Timezone database name e.g.: America/New_York
	 * @see [Timezone Database]{@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List} for more detail
	 */
	timezone?: string;

	/**
	 * Callback that is called with the new date (as Date instance) when the value is changed.
	 * If the time is not valid, value arguments will be undefined.
	 */
	onChange?(value?: Date): void;

	/**
	 * Callback for every input change from user
	 */
	onInputChange?(value?: string): void;
}

/**
 * The props of TimePicker.
 */
export interface TimePickerProps extends TimePickerBaseProps, TimeInputBaseProps {
	/**
	 * Set label for TimePicker header on mobile
	 * If the {@link customHeaderElement} is defined, the customHeaderTitle will not work.
	 */
	customHeaderTitle?: ReactNode;

	/**
	 * If true, the modal overlay can be closed by an outside click.

	 * *Note:* Mobile devices do not support closing on backdrop clicks and the default below applies only to desktop devices.
	 * @default true
	 */
	closeOnBackdropClick?: boolean;

	/**
	 * Trigger when the input value is changed.
	 * Returns the typed value and result of that value is valid or not.
	 */
	onValidate?(params: { value: string; valid: boolean }): void;

	/**
	 * The reference of the Time Picker Input.
	 * @param instance – the input element instance.
	 */
	timePickerInputRef?: RefCallback<HTMLInputElement>;

	/**
	 * If true, the time picker button will be hidden
	 * @default false
	 */
	hidePickerButton?: boolean;

	/**
	 * To format a time to string (in regard to timezone if specified)
	 * @param {Date | undefined} time – The time to be formatted.
	 * @returns The formatted time string.
	 *
	 * @example Without specified timezone: `timeFormatter(new Date(Date.UTC(2010, 0, 1, 13, 45)))` returns "01:45 pm"
	 * @example With America/New_York timezone: `timeFormatter(new Date(Date.UTC(2010, 0, 1, 13, 45)))` returns "08:45 am"
	 */
	timeFormatter?: TimePickerProps.TimeFormatter;

	/**
	 * To convert a time string to a Date object (in regard to timezone if specified)
	 * @param timeString – The time string to convert.
	 * @returns {Date | undefined} The converted date or undefined. Using undefined if the time string is invalid.
	 *
	 * @example Without specified timezone: `timeConverter("13:45")` returns a Date object with ISO format "2010-01-01T13:45:00.000Z"
	 * @example With America/New_York timezone: `timeConverter("13:45")` returns a Date object with ISO format "2010-01-01T18:45:00.000Z"
	 */
	timeConverter?: TimePickerProps.TimeConverter;

	/**
	 * To get the handler in order to clear all current values
	 */
	clearHandler?(handler: () => void): void;

	/**
	 * Additional HTML attributes to be applied to the desktop time picker.
	 */
	desktopPickerAttributes?: HTMLAttributes<HTMLDivElement>;

	/**
	 * Additional HTML attributes to be applied to the mobile time picker.
	 *
	 * **Note:** This property will be passed to the Modal Overlay's container element.
	 */
	mobilePickerAttributes?: HTMLAttributes<HTMLDivElement>;
}

export namespace TimePickerProps {
	export type ClockMode = "12h" | "24h";
	export type Screen = "hour" | "minute";
	export type Renderer = (time?: Date, closeHandler?: () => void) => ReactNode;
	export type TimeFormatter = (time: Date | undefined) => string;
	export type TimeConverter = (timeString: string) => Date | undefined;
}
