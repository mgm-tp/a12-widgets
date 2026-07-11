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

import type { ReactNode, HTMLAttributes } from "react";

import type { DatePickerProps } from "../../datepicker/main/date-picker.api.js";
import type { TimePickerProps } from "../../time-picker/main/time-picker.api.js";

export interface DateTimePickerProps extends Omit<DatePickerProps, "onChange" | "onDateRangeChange" | "footer"> {
	/**
	 * Overrides the header of edit time screen.
	 */
	customHeaderElement?: ReactNode | DateTimePickerProps.Renderer;

	/**
	 * Set the label for Picker header on mobile.
	 * If the {@link customHeaderElement} is defined, the customHeaderTitle will not work.
	 */
	customHeaderTitle?: ReactNode;

	/**
	 * Overrides the footer.
	 */
	customFooterElement?: ReactNode | DateTimePickerProps.Renderer;

	/**
	 * Overrides the time edit element.
	 */
	customTimeEditElement?: ReactNode | DateTimePickerProps.Renderer;

	/**
	 * Overrides the label of time edit button that is used by default if customTimeEditElement is undefined.
	 */
	customTimeEditLabel?: string;

	/**
	 * The initial screen for datetime picker.
	 */
	initialScreen?: DateTimePickerProps.Screen;

	/**
	 * Specifies whether the time mandatory.
	 */
	timeRequired?: boolean;

	/**
	 * The clock will display in 12 hour or 24 hour mode.
	 */
	timeMode?: TimePickerProps.ClockMode;

	/**
	 * Timezone database name e.g. America/New_York
	 * @see [Timezone Database]{@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List} for more detail
	 */
	timezone?: string;

	/**
	 * Overrides the label of the ok button for the dialog.
	 */
	okLabel?: string;

	/**
	 * Overrides the label of the clear button for the dialog in mobile devices.
	 */
	clearLabel?: string;

	/**
	 * Overrides the label of the back button for the dialog in mobile devices.
	 */
	backLabel?: string;

	/**
	 * DateTimePicker is shown in mobile devices.
	 */
	mobileMode?: boolean;

	/**
	 * The date is displayed in the time screen.
	 */
	dateDisplayInTimePicker?: ReactNode;

	/**
	 * If true, the date time picker button will be hidden
	 * @default false
	 */
	hidePickerButton?: boolean;

	/**
	 * Returns a handler for backing to the previous screen.
	 */
	back?(handler: () => void): void;

	/**
	 * Returns a handler for clearing the current value in the picker.
	 */
	clear?(handler: () => void): void;

	/**
	 * Returns a handler for accepting the current value in the picker.
	 */
	ok?(handler: () => void): void;

	/**
	 * This callback will be called when the screen is changed.
	 */
	onScreenChange?(newScreen: DateTimePickerProps.Screen, screenRef: HTMLElement | null): void;

	/**
	 * Callback that is called when the date or time is changed.
	 */
	onChange?(date?: Date, time?: Date): void;

	/**
	 * Callback that is called with the new datetime (as Date instance) when the value is accepted.
	 */
	onAccept?(datetime?: Date): void;

	/**
	 * Trigger when the DateTimePicker is closed.
	 */
	onClose?(): void;

	/**
	 * Additional HTML attributes to be applied to the desktop date time picker.
	 */
	desktopPickerAttributes?: HTMLAttributes<HTMLDivElement>;

	/**
	 * Additional HTML attributes to be applied to the mobile date time picker.
	 *
	 * *Note:* When using *DateTimePickerInput* to display the picker, this property will be passed to the Modal Overlay's container element.
	 */
	mobilePickerAttributes?: HTMLAttributes<HTMLDivElement>;
}

export namespace DateTimePickerProps {
	export type Screen = "date" | TimePickerProps.Screen;

	/**
	 * Renderer function with given arguments:
	 * @param datetime – A single date, in case you are using a normal date picker
	 * @param screen – Date or Time Picker
	 * @param isYearMonthChanged – A flag to indicate if the year or month has changed.
	 */
	export type Renderer = (datetime?: Date, screen?: Screen, isYearMonthChanged?: boolean) => ReactNode;

	export type DateTimeFormatter = (dateTime: Date | undefined) => string;
	export type DateTimeConverter = (dateTimeString: string) => Date | undefined;
}
