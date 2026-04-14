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

import type { CSSProperties, ReactNode } from "react";
import type { Locale } from "react-day-picker";
import type { Day } from "date-fns";

import type { HTMLAttributes, Identifiable, Styleable } from "../../../common/main/base-props.js";

/**
 * The display state for calendar days.
 * - `none`: Day is not displayed
 * - `disabled`: Day is shown but not interactive
 * - `active`: Day is shown and interactive
 */
export type DayDisplay = "none" | "disabled" | "active";

export interface SelectedItem<T> {
	/**
	 * The date associated with the selected event.
	 */
	date: Date;

	/**
	 * The event data associated with the selected date.
	 */
	item?: T;
}

export interface CalendarDay<T> {
	/**
	 * The date associated with the calendar day.
	 */
	date: Date;

	/**
	 * Array of items associated with the calendar day.
	 */
	items: T[];
}

export interface ComponentRenderer<E> {
	/**
	 * Renderer function for customizing the header of a day in the calendar.
	 * @param date – The date for which the header is being rendered.
	 * @returns A ReactNode representing the rendered header content for the day.
	 */
	dayHeaderRenderer?(date: Date): ReactNode;

	/**
	 * Renderer function for customizing the content of a day in the calendar.
	 * @param date – The date for which the content is being rendered.
	 * @param items – Array of items associated with the day (optional).
	 * @returns A ReactNode representing the rendered content for the day.
	 */
	dayContentRenderer?(date: Date, items: E[]): ReactNode;

	/**
	 * Renderer function for customizing the content of a day item in the calendar.
	 * @param date – The date of the item.
	 * @param item – The item data associated with the day (optional).
	 * @returns A ReactNode representing the rendered content for the day item.
	 */
	dayItemContentRenderer?(date: Date, item: E): ReactNode;

	/**
	 * Renderer function for customizing the footer of a day in the calendar.
	 * @param date – The date for which the footer is being rendered.
	 * @returns A ReactNode representing the rendered footer content for the day.
	 */
	dayFooterRenderer?(date: Date): ReactNode;

	/**
	 * Renderer function for customizing the placeholder content of a day in the calendar.
	 * @returns A ReactNode representing the rendered placeholder content for the day.
	 */
	placeholderRenderer?(): ReactNode;
}

export interface CalendarBaseProps<T extends CalendarDay<E>, E> extends Styleable, Identifiable, HTMLAttributes {
	/**
	 * Array of calendar day items, where each item contains a date and associated items.
	 */
	calendarDateItems: T[];

	/**
	 * The calendar view to be displayed.
	 * @default "month"
	 */
	view?: "month" | "week";

	/**
	 * Renderers for customizing the components.
	 */
	componentRenderers?: ComponentRenderer<E>;

	/**
	 * Specifies the day on which the week starts.
	 * @default 1 (Monday)
	 */
	weekStartsOn?: Day;

	/**
	 * Function to format the date displayed in the calendar.
	 */
	dateFormatter?(date: Date): string;

	/**
	 * Function to format the weekday displayed in the calendar.
	 * This is used to display the day headers in the week view.
	 */
	weekDayFormatter?(date: Date): string;

	/**
	 * The date to be displayed in the calendar.
	 * This determines the currently visible month or week in the calendar view.
	 * If not provided, the calendar defaults to the current date.
	 * @default new Date()
	 */
	date?: Date;

	/**
	 * Array of dates representing public holidays.
	 */
	publicHolidays?: Date[];

	/**
	 * Indicates whether public holidays should be highlighted in the calendar view.
	 */
	highlightedPublicHolidays?: boolean;

	/**
	 * The currently selected date in the calendar.
	 */
	selectedDate?: Date;

	/**
	 * Callback function triggered when a day is selected in the calendar.
	 * @param date - The selected date.
	 */
	onDayClick?: (date: Date, items: E[]) => void;

	/**
	 * The currently selected item in the calendar.
	 */
	selectedItem?: SelectedItem<E>;

	/**
	 * Callback function triggered when an item is selected in the calendar.
	 * @param item - The selected item, including the date and item details.
	 */
	onItemClick?: (item?: SelectedItem<E>) => void;

	/**
	 * Indicates whether weekends should be highlighted in the calendar view.
	 */
	highlightedWeekends?: boolean;

	/**
	 * Display the days falling into other months.
	 * @default "disabled"
	 */
	outsideDayDisplay?: DayDisplay;

	/**
	 * Function to determine if specific days should be disabled.
	 */
	isDisabledDay?: (date: Date, items: E[]) => boolean;

	/**
	 * Function to apply custom styles to a specific day.
	 */
	getDayStyles?: (date: Date, items: E[]) => CSSProperties | undefined;

	/**
	 * Function to apply custom className to a specific day.
	 */
	getDayClassName?: (date: Date, items: E[]) => string | undefined;
}

export interface CalendarInfiniteScrollOptions {
	/**
	 * The number of weeks to display in the visible viewport.
	 */
	displayWeeksCount: number;

	/**
	 * The number of extra weeks outside the visible range to load with {@link loadData} function.
	 * @default 10
	 */
	threshold?: number;

	/**
	 * Minimum day that can be scrolled to in the calendar
	 */
	minDate: Date;

	/**
	 * Maximum day that can be scrolled to in the calendar
	 */
	maxDate: Date;

	/**
	 * Function to check if data for a specific date has been loaded.
	 * This function is called before {@link loadData} to determine if data needs to be fetched,
	 *
	 * @param date - The date to check if data has been loaded for.
	 * @returns The loading status of the date, which can be `undefined` (not loaded), `"loading"` (currently loading), or `"loaded"` (data is loaded).
	 */
	dateLoadingStatus(date: Date): DateLoadingStatus;

	/**
	 * Function to load additional data when scrolling in infinite week view.
	 * @param startDate - The start date of the range to load data for.
	 * @param endDate - The end date of the range to load data for.
	 */
	loadData?(startDate: Date, endDate: Date): void;

	/**
	 * Callback function triggered when the displayed date range changes due to scrolling.
	 * @param startDate - The start date of the newly visible range.
	 * @param endDate - The end date of the newly visible range.
	 */
	onVisibleRangeChange?(startDate: Date, endDate: Date): void;

	/**
	 * Scroll snap type for the week view.
	 * - `none`: No scroll snapping.
	 * - `mandatory`: The scroll position will snap to the start of the nearest week after a scroll action.
	 * @default "none"
	 */
	weekScrollSnapType?: "none" | "mandatory";

	/**
	 * Function to get a handler for programmatically scrolling to a specific date.
	 * @param handler - A handler to scroll to a specific date.
	 */
	scrollToDate?(handler: (date: Date, shouldFocus: boolean) => void): void;

	/**
	 * Minimum visible area an item must have in the viewport to be considered part of the
	 * visible range. Items visible by less than this threshold are excluded from the range
	 * reported via {@link onVisibleRangeChange} and used for data loading.
	 *
	 * Accepts:
	 * - A pixel value, e.g. `"10px"` – the item must have at least 10 px visible.
	 * - A percentage value, e.g. `"50%"` – the item must have at least 50 % of its height visible.
	 */
	visibleThreshold?: string;

	/**
	 * Controls whether focus is restored to the previously focused day cell after the calendar height changes.
	 *
	 * When the calendar height changes, the virtual scroll recalculates and re-renders the calendar weeks,
	 * which causes the focused day cell to lose focus. Setting this to `true` restores focus to that day cell
	 * after the height change.
	 *
	 * - `true` – Focus is restored to the previously focused day cell after the height change.
	 * - `false` – The day cell loses focus after the height change.
	 *
	 * @default true
	 */
	restoreFocusOnHeightChange?: boolean;
}

export interface MonthCalendarView {
	/**
	 * Month view.
	 */
	view?: "month";

	/**
	 * Options for configuring infinite scrolling behavior in the week view.
	 */
	infiniteScrollOptions?: CalendarInfiniteScrollOptions;

	/**
	 * Function to apply custom styles to a specific week in the calendar.
	 * @param weekIndex – The index of the week within the current month for which styles are being applied.
	 * *Note:* When infiniteScrollOptions is provided, the week containing the {@link infiniteScrollOptions.minDate} property is considered weekIndex 0. The weekIndex of other weeks is counted relative to this week (for example, 2 weeks after = 2).
	 * @return CSSProperties object containing the styles for the specified week, or undefined if no custom styles are applied.
	 */
	getWeekStyles?(weekIndex: number): CSSProperties | undefined;

	/**
	 * Function to apply custom className to a specific week in the calendar.
	 * @param weekIndex – The index of the week within the current month for which class name are being applied.
	 * *Note:* When infiniteScrollOptions is provided, the week containing the {@link infiniteScrollOptions.minDate} property is considered weekIndex 0. The weekIndex of other weeks is counted relative to this week (for example, 2 weeks after = 2).
	 * @return A string representing the className for the specified week, or undefined if no custom className is applied.
	 */
	getWeekClassName?(weekIndex: number): string | undefined;
}

export interface WeekCalendarView {
	/**
	 * Week view.
	 */
	view: "week";
}

export type CalendarProps<T extends CalendarDay<E>, E> = CalendarBaseProps<T, E> &
	(MonthCalendarView | WeekCalendarView);

export type CalendarMonthViewProps<T extends CalendarDay<E>, E> = Omit<
	CalendarBaseProps<T, E> & MonthCalendarView,
	"view" | "monthViewComponentRenderers"
> & {
	componentRenderers?: ComponentRenderer<E>;
};

export type CalendarWeekViewProps<T extends CalendarDay<E>, E> = Omit<
	CalendarBaseProps<T, E> & WeekCalendarView,
	"view" | "weekViewComponentRenderers"
> & {
	componentRenderers?: ComponentRenderer<E>;
};

export type CalendarDayProps<T extends CalendarDay<E>, E> = Omit<
	CalendarBaseProps<T, E>,
	"view" | "calendarDateItems" | "weekStartsOn" | "weekDayFormatter" | "outsideDayDisplay"
> & {
	items: E[];
	locale?: Locale;
	display: DayDisplay;
	isOutsideDay?: boolean;
	componentRenderers?: ComponentRenderer<E>;
};

export type DateLoadingStatus = undefined | "loading" | "loaded";
