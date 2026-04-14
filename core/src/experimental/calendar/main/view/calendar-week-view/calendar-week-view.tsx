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

import type { ReactElement, ReactNode } from "react";
import { Fragment, useContext, useRef } from "react";
import { format, isSameDay, isSameMonth } from "date-fns";

import type { CalendarDay, CalendarWeekViewProps } from "../../calendar.api.js";
import { DateTimeContext } from "../../../../../common/main/date-time/date-time-context.js";
import { DataRoles } from "../../../../../common/main/data-roles.js";

import { getWeekDates } from "../utils.internal.js";
import { useWeekViewNavigateByKey } from "../calendar-hook.internal.js";
import { CalendarDayCell } from "../calendar-day.js";

import {
	StyledCalendarWeekViewContent,
	StyledCalendarWeekViewHeader,
	StyledCalendarWeekViewHeaderItem,
	StyledCalendarWeekViewWrapper
} from "./calendar-week-view.styled.js";

export const CalendarWeekView = <T extends CalendarDay<E>, E>({
	date = new Date(),
	calendarDateItems,
	componentRenderers = {
		dayHeaderRenderer: undefined,
		dayContentRenderer: undefined,
		dayItemContentRenderer: undefined,
		dayFooterRenderer: undefined
	},
	weekStartsOn = 1, // Default to Monday,
	dateFormatter,
	outsideDayDisplay = "disabled",
	isDisabledDay,
	onDayClick,
	onItemClick,
	selectedItem,
	highlightedWeekends,
	highlightedPublicHolidays,
	publicHolidays,
	selectedDate,
	getDayStyles,
	getDayClassName,
	...rest
}: CalendarWeekViewProps<T, E>): ReactElement => {
	const { locale } = useContext(DateTimeContext);
	const weekViewContentRef = useRef<HTMLDivElement | null>(null);

	const {
		dayHeaderRenderer = (date: Date, isOutsideDay: boolean): ReactNode => {
			return (
				<StyledCalendarWeekViewHeaderItem data-role={DataRoles.Calendar.WeekView.DayHeaderItem}>
					{outsideDayDisplay === "none" && isOutsideDay
						? undefined
						: (dateFormatter?.(date) ?? format(date, "EEEE, dd.MM", { locale }))}
				</StyledCalendarWeekViewHeaderItem>
			);
		}
	} = componentRenderers;

	const weekDates = getWeekDates(date, weekStartsOn);

	const renderWeekHeader = (): ReactNode => {
		return (
			<StyledCalendarWeekViewHeader data-role={DataRoles.Calendar.WeekView.DayHeader}>
				{weekDates.map((weekDate) => (
					<Fragment key={weekDate.toDateString()}>{dayHeaderRenderer(weekDate, !isSameMonth(weekDate, date))}</Fragment>
				))}
			</StyledCalendarWeekViewHeader>
		);
	};

	useWeekViewNavigateByKey({ wrapperRef: weekViewContentRef });

	return (
		<StyledCalendarWeekViewWrapper data-role={DataRoles.Calendar.WeekView.Wrapper} {...rest}>
			{renderWeekHeader()}
			<StyledCalendarWeekViewContent data-role={DataRoles.Calendar.WeekView.Content} ref={weekViewContentRef}>
				{weekDates.map((weekDate) => {
					const items = calendarDateItems.find((day) => isSameDay(day.date, weekDate))?.items ?? [];

					return (
						<CalendarDayCell
							key={weekDate.toDateString()}
							variant="week"
							date={weekDate}
							onDayClick={onDayClick}
							onItemClick={onItemClick}
							selectedItem={selectedItem}
							highlightedWeekends={highlightedWeekends}
							highlightedPublicHolidays={highlightedPublicHolidays}
							items={items}
							componentRenderers={componentRenderers}
							publicHolidays={publicHolidays}
							selectedDate={selectedDate}
							locale={locale}
							isOutsideDay={!isSameMonth(weekDate, date)}
							display={
								isSameMonth(weekDate, date)
									? isDisabledDay?.(weekDate, items)
										? "disabled"
										: "active"
									: outsideDayDisplay
							}
							getDayStyles={getDayStyles}
							getDayClassName={getDayClassName}
							dateFormatter={dateFormatter}
						/>
					);
				})}
			</StyledCalendarWeekViewContent>
		</StyledCalendarWeekViewWrapper>
	);
};

CalendarWeekView.displayName = "CalendarWeekView";
