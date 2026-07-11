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

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { addDays, format, isSameDay, parseISO } from "date-fns";
import { cloneDeep } from "lodash-es";
import styled from "styled-components";

import { Button, ButtonGroup, Calendar, Message } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DateLoadingStatus, SelectedItem } from "@com.mgmtp.a12.widgets/widgets-core";

// Types
interface DayEvent {
	id: string;
	title: string;
	author?: string;
	status: "info" | "success" | "warning" | "error";
}

interface CalendarDayData {
	date: Date;
	items: DayEvent[];
}

// Styled components
const StyledCalendarItem = styled.div`
	padding: 2px 4px;
	border-radius: 4px;
	font-size: 12px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	background-color: #e3f2fd;
	color: #1565c0;
	margin-bottom: 2px;
`;

// Helper function to generate dummy data
const generateDummyData = (startDate: Date, endDate: Date): CalendarDayData[] => {
	const data: CalendarDayData[] = [];
	const currentDate = new Date(startDate);
	const titles = [
		"Marketing Meeting",
		"Product Brainstorming",
		"Code Review",
		"Daily Standup",
		"Happy Hour",
		"Sprint Review",
		"Team Building"
	];
	const statuses: Array<"info" | "success" | "warning" | "error"> = ["info", "success", "warning", "error"];

	while (currentDate <= endDate) {
		const itemsCount = Math.floor(Math.random() * 3);
		const items: DayEvent[] = [];

		for (let i = 0; i < itemsCount; i++) {
			items.push({
				id: `${currentDate.getTime()}-${i}`,
				title: titles[Math.floor(Math.random() * titles.length)],
				status: statuses[Math.floor(Math.random() * statuses.length)]
			});
		}

		data.push({
			date: new Date(currentDate),
			items
		});
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return data;
};

interface CalendarInfiniteScrollViewArgs {
	weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	highlightedWeekends: boolean;
	highlightedPublicHolidays: boolean;
	displayWeeksCount: number;
	threshold: number;
	date: string;
	publicHolidays: string[];
	disabledDays: string[];
	minDate: string;
	maxDate: string;
}

const meta: Meta<CalendarInfiniteScrollViewArgs> = {
	title: "Data Display/Calendar/Infinite Scroll View",
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	args: {
		weekStartsOn: 0,
		highlightedWeekends: true,
		highlightedPublicHolidays: true,
		displayWeeksCount: 5,
		threshold: 10,
		date: new Date(2026, 0, 6).toISOString(),
		publicHolidays: ["2026-01-01", "2026-01-06", "2026-05-01"],
		disabledDays: ["2026-01-14", "2026-01-17"],
		minDate: new Date(2025, 0, 1).toISOString(),
		maxDate: new Date(2027, 11, 31).toISOString()
	},
	argTypes: {
		weekStartsOn: {
			control: "select",
			options: [0, 1, 2, 3, 4, 5, 6],
			description: "Specifies the day on which the week starts (0 = Sunday, 1 = Monday, etc.)"
		},
		highlightedWeekends: {
			control: "boolean",
			description: "Indicates whether weekends should be highlighted"
		},
		highlightedPublicHolidays: {
			control: "boolean",
			description: "Indicates whether public holidays should be highlighted"
		},
		displayWeeksCount: {
			control: { type: "number", min: 3, max: 10 },
			description: "The number of weeks to display in the visible viewport"
		},
		threshold: {
			control: { type: "number", min: 1, max: 5 },
			description: "The number of extra weeks outside the visible range to load"
		},
		date: {
			control: "date",
			description: "The date to be displayed in the calendar (anchor date)"
		},
		publicHolidays: {
			control: "object",
			description: "Array of public holiday dates in ISO format (YYYY-MM-DD)"
		},
		disabledDays: {
			control: "object",
			description: "Array of disabled day dates in ISO format (YYYY-MM-DD)"
		},
		minDate: {
			control: "date",
			description: "Minimum date that can be scrolled to in the calendar"
		},
		maxDate: {
			control: "date",
			description: "Maximum date that can be scrolled to in the calendar"
		}
	}
};

export default meta;
type Story = StoryObj<CalendarInfiniteScrollViewArgs>;

export const Default: Story = {
	args: {
		weekStartsOn: 0,
		highlightedWeekends: true,
		highlightedPublicHolidays: true,
		displayWeeksCount: 5,
		threshold: 10,
		date: new Date(2026, 0, 6).toISOString(),
		publicHolidays: ["2026-01-01", "2026-01-06", "2026-05-01"],
		disabledDays: ["2026-01-14", "2026-01-17"],
		minDate: new Date(2025, 0, 1).toISOString(),
		maxDate: new Date(2027, 11, 31).toISOString()
	},
	render: (args) => {
		const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
		const [selectedItem, setSelectedItem] = useState<SelectedItem<DayEvent> | undefined>(undefined);
		const [displayDateRange, setDisplayDateRange] = useState<{ startDate: Date; endDate: Date } | undefined>(undefined);
		const [calendarData, setCalendarData] = useState<CalendarDayData[]>([]);
		const [dateStatusMap, setDateStatusMap] = useState<Record<string, DateLoadingStatus>>({});

		const scrollToDateRef = useRef<((date: Date, shouldFocus: boolean) => void) | null>(null);

		const minDate = useMemo(() => new Date(args.minDate), [args.minDate]);
		const maxDate = useMemo(() => new Date(args.maxDate), [args.maxDate]);
		const date = useMemo(() => new Date(args.date), [args.date]);
		const holidays = useMemo(() => args.publicHolidays.map((holiday) => parseISO(holiday)), [args.publicHolidays]);
		const disabled = useMemo(() => args.disabledDays.map((day) => parseISO(day)), [args.disabledDays]);

		const dayItemContentRenderer = useCallback((_date: Date, event?: DayEvent): ReactNode => {
			return <StyledCalendarItem>{event?.title}</StyledCalendarItem>;
		}, []);

		const dateFormatter = useCallback((date: Date) => format(date, "dd-MM-yyyy"), []);

		const isDisabledDay = useCallback((date: Date) => !!disabled.find((d) => isSameDay(d, date)), [disabled]);

		const onVisibleRangeChange = useCallback((startDate: Date, endDate: Date) => {
			setDisplayDateRange({ startDate, endDate });
		}, []);

		const handleDateStatusMapUpdate = useCallback((startDate: Date, endDate: Date, status: DateLoadingStatus) => {
			setDateStatusMap((map) => {
				const newMap = { ...map };
				let currentDate = new Date(startDate);

				while (currentDate <= endDate) {
					const dateKey = format(currentDate, "yyyy-MM-dd");
					newMap[dateKey] = status;
					currentDate = addDays(currentDate, 1);
				}

				return newMap;
			});
		}, []);

		const loadData = useCallback(
			(startDate: Date, endDate: Date) => {
				handleDateStatusMapUpdate(startDate, endDate, "loading");

				setTimeout(
					() => {
						setCalendarData((data) => [...cloneDeep(data), ...generateDummyData(startDate, endDate)]);
						handleDateStatusMapUpdate(startDate, endDate, "loaded");
					},
					500 + Math.random() * 1000
				);
			},
			[handleDateStatusMapUpdate]
		);

		const dateLoadingStatus = useCallback(
			(date: Date): DateLoadingStatus => {
				const dateKey = format(date, "yyyy-MM-dd");

				return dateStatusMap[dateKey];
			},
			[dateStatusMap]
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
						{`Displaying dates from ${format(displayDateRange.startDate, "dd-MM-yyyy")} to ${format(displayDateRange.endDate, "dd-MM-yyyy")}`}
					</Message>
				)}
				<div className="-u-flex -u-items-center -u-margin-b-base">
					<span className="-u-margin-r-base">Quick Navigation:</span>
					<ButtonGroup>
						<Button onClick={() => goToDate(minDate)}>Min Date</Button>
						<Button onClick={() => goToDate(new Date())}>Today</Button>
						<Button onClick={() => goToDate(maxDate)}>Max Date</Button>
					</ButtonGroup>
				</div>
				<div style={{ minWidth: 800, height: 1000 }}>
					<Calendar
						view="month"
						infiniteScrollOptions={{
							displayWeeksCount: args.displayWeeksCount,
							threshold: args.threshold,
							minDate,
							maxDate,
							dateLoadingStatus,
							loadData,
							scrollToDate: getScrollToDateHandler,
							onVisibleRangeChange,
							visibleThreshold: "10px"
						}}
						dateFormatter={dateFormatter}
						weekStartsOn={args.weekStartsOn}
						highlightedWeekends={args.highlightedWeekends}
						highlightedPublicHolidays={args.highlightedPublicHolidays}
						date={date}
						publicHolidays={holidays}
						calendarDateItems={calendarData}
						selectedDate={selectedDate}
						onDayClick={setSelectedDate}
						selectedItem={selectedItem}
						onItemClick={setSelectedItem}
						componentRenderers={{
							dayItemContentRenderer
						}}
						isDisabledDay={isDisabledDay}
					/>
				</div>
			</div>
		);
	}
};
