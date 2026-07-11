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
 * This Datepicker widget is a combination of an input field and a Datepicker
 * that enables us to use date inputs consistently.
 * @module
 */

import type { MouseEvent as ReactMouseEvent, ReactNode, FocusEvent } from "react";
import type { DayPickerProps, Matcher } from "react-day-picker";

import type { Ref, Container, Identifiable, Styleable } from "../../common/main/base-props.js";
import type { YearRange, YearSelectorVariant } from "../../input/year-month-selector/year-selector.api.js";

import type { DateRange } from "./date-range.api.js";

export type { Matcher } from "react-day-picker";

/**
 * The props of DatePicker extends from DayPickerProps of react-day-picker library
 * @see https://daypicker.dev/v9/api/type-aliases/DayPickerProps
 */
export interface DatePickerProps extends Omit<DayPickerProps, "footer" | "locale" | "timeZone">, Identifiable, Ref {
	/**
	 *  A value or an array that can be used to define selected days.
	 */
	selected?: Matcher | Matcher[];

	/**
	 *  A string array that can be used to customize month names.
	 */
	months?: string[];

	/**
	 * Set the selected date.
	 */
	value?: Date;

	/**
	 * Override the year selection range.
	 */
	yearRange?: YearRange;

	/**
	 * Controls the rendering mode of the year selector in the date picker header.
	 * When omitted, the mode is auto-detected: `"autocomplete"` if {@link yearRange} is provided, `"textbox"` otherwise.
	 */
	yearSelectorVariant?: YearSelectorVariant;

	/**
	 * Callback fired when the year text-box inside the picker header loses focus.
	 * Only relevant when `yearSelectorVariant="textbox"` (or auto-detected as textbox).
	 */
	onYearSelectorBlur?: (event: FocusEvent<HTMLInputElement>) => void;

	/**
	 * Error message shown below the year text-box inside the picker header.
	 * Only relevant when `yearSelectorVariant="textbox"` (or auto-detected as textbox).
	 */
	yearErrorMessage?: string;

	/**
	 * If it's a date-range picker which means the range `{from, to}` in {@link selected} or {@link onDateRangeChange} is defined, a default footer
	 * will be rendered which has the following buttons with the labels will be passed by users by using {@link PickerFooter}.
	 *  - A button to save the acceptable date
	 *  - A button to clear the selected date
	 *
	 * In addition, users can pass any elements to replace the default one.
	 *
	 * To use a picker without footer, pass an empty element into this prop.
	 */
	footer?: PickerFooter;

	/**
	 * @internal
	 */
	mobile?: boolean;

	/**
	 * Timezone database name e.g.: America/New_York
	 * @see [Timezone Database]{@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List} for more detail
	 */
	timezone?: string;

	/**
	 * Trigger when the date is selected.
	 */
	onChange?(value: Date): void;

	/**
	 * Callback that is called when the date range is selected.
	 */
	onDateRangeChange?(range?: DateRange): void;

	/**
	 * @internal
	 */
	onDayMouseDown?(event: ReactMouseEvent): void;
}

export interface PickerFooter {
	/**
	 * Define a custom footer.
	 * The following props for the default one will be ignored:
	 * - {@link acceptLabel}
	 * - {@link clearLabel}
	 * - {@link onAccept}
	 * - {@link onClear}
	 */
	customFooter?: ReactNode;

	/**
	 * Label of the submit button.
	 */
	acceptLabel?: string;

	/**
	 * Label of the button which is responsible for clearing the date.
	 */
	clearLabel?: string;

	/**
	 * Callback that is fired with the new accepted date range when pressing the accept button.
	 */
	onAccept?(range?: DateRange): void;

	/**
	 * Callback that is fired when the date is cleared.
	 */
	onClear?(): void;
}

export interface DatePickerFooterProps extends Styleable, Identifiable, Container {
	/**
	 * data-role attribute.
	 */
	dataRole?: string;
}

export interface DatePickerFooterActionProps extends Styleable, Identifiable, Container {
	/**
	 * data-role attribute.
	 */
	dataRole?: string;
}
