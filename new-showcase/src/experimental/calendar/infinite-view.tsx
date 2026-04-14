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

import type { ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import { addDays, format, isSameDay } from "date-fns";
import { cloneDeep } from "lodash-es";

import type { DateLoadingStatus, RowLoadingStatus } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, ButtonGroup, Calendar, Message } from "@com.mgmtp.a12.widgets/widgets-core";

import type { CalendarDay, DayEvent, SelectedDayEvent } from "./shared/data.js";
import { disabledDays, generateDummyData, holidays } from "./shared/data.js";
import { StyledCalendarMonthViewItem } from "./shared/calendar.styled.js";
import { MonthViewDayFooter } from "./shared/component.js";

const DATE_FORMAT = "dd-MM-yyyy";
const MIN_DATE = new Date(2022, 1, 15);
const MAX_DATE = new Date(2027, 10, 24);

export const InfiniteView = () => {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedItem, setSelectedItem] = useState<SelectedDayEvent | undefined>(undefined);
	const [displayDateRange, setDisplayDateRange] = useState<{ startDate: Date; endDate: Date } | undefined>(undefined);
	const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
	const [rowStatusMap, setRowStatusMap] = useState<Record<string, RowLoadingStatus>>({});

	const scrollToDateRef = useRef<((date: Date, shouldFocus: boolean) => void) | null>(null);

	const dayItemContentRenderer = useCallback((date: Date, event?: DayEvent): ReactNode => {
		return <StyledCalendarMonthViewItem>{event?.title}</StyledCalendarMonthViewItem>;
	}, []);

	const dayFooterRenderer = useCallback((date: Date) => {
		return <MonthViewDayFooter date={date} />;
	}, []);

	const dateFormatter = useCallback((date: Date) => format(date, DATE_FORMAT), []);

	const isDisabledDay = useCallback((date: Date) => {
		return !!disabledDays.find((disabled) => isSameDay(disabled, date));
	}, []);

	const onVisibleRangeChange = useCallback((startDate: Date, endDate: Date) => {
		setDisplayDateRange({ startDate, endDate });
	}, []);

	const handleRowStatusMapUpdate = useCallback((startDate: Date, endDate: Date, status: RowLoadingStatus) => {
		setRowStatusMap((map) => {
			const newMap = { ...map };
			let currentDate = new Date(startDate);

			while (currentDate <= endDate) {
				const dateKey = format(currentDate, DATE_FORMAT);
				newMap[dateKey] = status;
				currentDate = addDays(currentDate, 1);
			}

			return newMap;
		});
	}, []);

	const loadData = useCallback(
		(startDate: Date, endDate: Date) => {
			handleRowStatusMapUpdate(startDate, endDate, "loading");

			setTimeout(() => {
				setCalendarData((data) => [...cloneDeep(data), ...generateDummyData(startDate, endDate)]);
				handleRowStatusMapUpdate(startDate, endDate, "loaded");
			}, 1000 * Math.random());
		},
		[handleRowStatusMapUpdate]
	);

	const dateLoadingStatus = useCallback(
		(date: Date): DateLoadingStatus => {
			const dateKey = format(date, DATE_FORMAT);

			return rowStatusMap[dateKey];
		},
		[rowStatusMap]
	);

	const getScrollToDateHandler = useCallback((handler: (date: Date, shouldFocus: boolean) => void) => {
		scrollToDateRef.current = handler;
	}, []);

	const goToDate = useCallback((date: Date) => {
		if (scrollToDateRef.current) {
			scrollToDateRef.current(date, true);
		}
	}, []);

	return (
		<div className="-u-width-full -u-overflow-x-auto">
			{displayDateRange && (
				<Message>
					{`The Calendar is displaying data from dates ${format(displayDateRange.startDate, DATE_FORMAT)} to ${format(displayDateRange.endDate, DATE_FORMAT)}.`}
				</Message>
			)}
			<div className="-u-flex -u-items-center -u-margin-b-base -u-margin-l-base ">
				<span className="-u-margin-r-base">Quick Navigation:</span>
				<ButtonGroup>
					<Button onClick={() => goToDate(MIN_DATE)}>Min Date</Button>
					<Button onClick={() => goToDate(new Date())}>Today</Button>
					<Button onClick={() => goToDate(MAX_DATE)}>Max Date</Button>
				</ButtonGroup>
			</div>
			<div style={{ minWidth: 750, height: 1000 }}>
				<Calendar
					view="month"
					infiniteScrollOptions={{
						displayWeeksCount: 5,
						minDate: MIN_DATE,
						maxDate: MAX_DATE,
						dateLoadingStatus,
						loadData,
						scrollToDate: getScrollToDateHandler,
						onVisibleRangeChange,
						visibleThreshold: "10px"
					}}
					dateFormatter={dateFormatter}
					weekStartsOn={0}
					date={new Date()}
					highlightedWeekends
					highlightedPublicHolidays
					publicHolidays={holidays}
					calendarDateItems={calendarData}
					selectedDate={selectedDate}
					onDayClick={setSelectedDate}
					selectedItem={selectedItem}
					onItemClick={setSelectedItem}
					componentRenderers={{
						dayItemContentRenderer,
						dayFooterRenderer
					}}
					isDisabledDay={isDisabledDay}
				/>
			</div>
		</div>
	);
};
