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

import type { ReactElement } from "react";
import { useContext, useRef } from "react";
import { getMonth, getWeeksInMonth, isSameDay } from "date-fns";

import type { CalendarDay, CalendarMonthViewProps } from "../../calendar.api.js";
import { DateTimeContext } from "../../../../../common/main/date-time/date-time-context.js";
import { DataRoles } from "../../../../../common/main/data-roles.js";

import { getMonthViewDates } from "../utils.internal.js";
import { useMonthViewNavigateByKey, WEEK_DAYS_NUM } from "../calendar-hook.internal.js";
import { CalendarDayCell } from "../calendar-day.js";

import {
	StyledCalendarMonthViewTable,
	StyledCalendarMonthViewWeek,
	StyledCalendarMonthViewWrapper
} from "./calendar-month-view.styled.js";
import { CalendarInfiniteView } from "./calendar-infinite-view/calendar-infinite-view.js";
import { CalendarMonthViewHeader } from "./calendar-month-view-header.js";

const CalendarMonthViewInternal = <T extends CalendarDay<E>, E>(props: CalendarMonthViewProps<T, E>): ReactElement => {
	const {
		date = new Date(),
		calendarDateItems,
		weekStartsOn = 1, // Default to Monday,
		weekDayFormatter,
		outsideDayDisplay = "disabled",
		isDisabledDay,
		dateFormatter,
		onDayClick,
		onItemClick,
		selectedItem,
		highlightedWeekends,
		highlightedPublicHolidays,
		publicHolidays,
		selectedDate,
		getDayStyles,
		getDayClassName,
		getWeekClassName,
		getWeekStyles,
		...rest
	} = props;

	const { locale } = useContext(DateTimeContext);
	const calendarTableBodyRef = useRef<HTMLDivElement | null>(null);

	const monthViewDates = getMonthViewDates({
		date,
		weekStartsOn
	});

	const monthViewDaysDate = monthViewDates.map((currentDate) => {
		const items = calendarDateItems.find((day) => day && isSameDay(day.date, currentDate))?.items ?? [];
		const isOutsideDay = getMonth(date) !== getMonth(currentDate);
		const display = isDisabledDay?.(currentDate, items) ? "disabled" : isOutsideDay ? outsideDayDisplay : "active";

		return {
			date: currentDate,
			items,
			isOutsideDay,
			display
		};
	});

	const monthViewDaysDateByWeek = Array.from({ length: Math.ceil(monthViewDaysDate.length / 7) }, (_, i) => {
		return monthViewDaysDate.slice(i * 7, i * 7 + 7);
	});

	useMonthViewNavigateByKey({ tableBodyRef: calendarTableBodyRef });

	return (
		<StyledCalendarMonthViewWrapper {...rest} data-role={DataRoles.Calendar.MonthView.Wrapper}>
			<CalendarMonthViewHeader locale={locale} weekStartsOn={weekStartsOn} weekDayFormatter={weekDayFormatter} />
			<StyledCalendarMonthViewTable
				ref={calendarTableBodyRef}
				data-role={DataRoles.Calendar.MonthView.Table}
				$rowNum={getWeeksInMonth(date, { weekStartsOn })}
			>
				{monthViewDaysDateByWeek.map((week, index) => (
					<StyledCalendarMonthViewWeek
						style={getWeekStyles?.(index)}
						className={getWeekClassName?.(index)}
						data-role={DataRoles.Calendar.MonthView.Week}
						$columnNum={WEEK_DAYS_NUM}
						key={index}
					>
						{week.map((weekDate) => (
							<CalendarDayCell
								key={weekDate.date.toDateString()}
								variant="month"
								onDayClick={onDayClick}
								onItemClick={onItemClick}
								selectedItem={selectedItem}
								highlightedWeekends={highlightedWeekends}
								highlightedPublicHolidays={highlightedPublicHolidays}
								componentRenderers={rest.componentRenderers}
								publicHolidays={publicHolidays}
								selectedDate={selectedDate}
								locale={locale}
								dateFormatter={dateFormatter}
								getDayStyles={getDayStyles}
								getDayClassName={getDayClassName}
								{...weekDate}
							/>
						))}
					</StyledCalendarMonthViewWeek>
				))}
			</StyledCalendarMonthViewTable>
		</StyledCalendarMonthViewWrapper>
	);
};

export const CalendarMonthView = <T extends CalendarDay<E>, E>(props: CalendarMonthViewProps<T, E>): ReactElement => {
	if (props.infiniteScrollOptions) {
		return <CalendarInfiniteView {...props} infiniteScrollOptions={props.infiniteScrollOptions} />;
	}

	return <CalendarMonthViewInternal {...props} />;
};

CalendarMonthView.displayName = "CalendarMonthView";
