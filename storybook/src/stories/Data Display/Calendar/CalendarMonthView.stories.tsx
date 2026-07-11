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
import { useCallback, useState } from "react";
import { isSameDay, parseISO } from "date-fns";
import styled from "styled-components";

import { Calendar } from "@com.mgmtp.a12.widgets/widgets-core";
import type { CalendarDay, SelectedItem } from "@com.mgmtp.a12.widgets/widgets-core";

// Types
interface DayEvent {
	id: string;
	title: string;
	author?: string;
	status: "info" | "success" | "warning" | "error";
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

// Sample data
const calendarDays: CalendarDay<DayEvent>[] = [
	{
		date: new Date(2026, 0, 5),
		items: [
			{ id: "1", title: "Marketing Meeting", author: "Alice Smith", status: "info" },
			{ id: "2", title: "Product Brainstorming", author: "Bob Johnson", status: "success" }
		]
	},
	{
		date: new Date(2026, 0, 7),
		items: [{ id: "3", title: "Checkpoint Calendar Widget", author: "Charlie Brown", status: "warning" }]
	},
	{
		date: new Date(2026, 0, 9),
		items: [{ id: "4", title: "Code Review", author: "Emily Clark", status: "info" }]
	},
	{
		date: new Date(2026, 0, 12),
		items: [{ id: "5", title: "Project Deadline", status: "error" }]
	},
	{
		date: new Date(2026, 0, 15),
		items: [
			{ id: "6", title: "Daily Standup", author: "Diana Prince", status: "info" },
			{ id: "7", title: "Happy Hour", author: "Ethan Hunt", status: "success" },
			{ id: "8", title: "Sprint Review", author: "Fiona Gallagher", status: "warning" }
		]
	},
	{
		date: new Date(2026, 0, 20),
		items: [{ id: "9", title: "Team Building", author: "George Martin", status: "success" }]
	}
];

interface CalendarMonthViewArgs {
	view: "month" | "week";
	weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	highlightedWeekends: boolean;
	highlightedPublicHolidays: boolean;
	outsideDayDisplay: "none" | "disabled" | "active";
	date: string;
	publicHolidays: string[];
	disabledDays: string[];
}

const meta: Meta<CalendarMonthViewArgs> = {
	title: "Data Display/Calendar/Month View",
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	args: {
		view: "month",
		weekStartsOn: 1,
		highlightedWeekends: true,
		highlightedPublicHolidays: true,
		outsideDayDisplay: "disabled",
		date: new Date(2026, 0, 6).toISOString(),
		publicHolidays: ["2026-01-01", "2026-01-06"],
		disabledDays: ["2026-01-14", "2026-01-17"]
	},
	argTypes: {
		view: {
			control: "select",
			options: ["month", "week"],
			description: "The calendar view to be displayed"
		},
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
		outsideDayDisplay: {
			control: "select",
			options: ["none", "disabled", "active"],
			description: "Display the days falling into other months"
		},
		date: {
			control: "date",
			description: "The date to be displayed in the calendar"
		},
		publicHolidays: {
			control: "object",
			description: "Array of public holiday dates in ISO format (YYYY-MM-DD)"
		},
		disabledDays: {
			control: "object",
			description: "Array of disabled day dates in ISO format (YYYY-MM-DD)"
		}
	}
};

export default meta;
type Story = StoryObj<CalendarMonthViewArgs>;

export const Default: Story = {
	args: {
		view: "month",
		weekStartsOn: 1,
		highlightedWeekends: true,
		highlightedPublicHolidays: true,
		outsideDayDisplay: "disabled",
		date: new Date(2026, 0, 6).toISOString(),
		publicHolidays: ["2026-01-01", "2026-01-06"],
		disabledDays: ["2026-01-14", "2026-01-17"]
	},
	render: (args) => {
		const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
		const [selectedItem, setSelectedItem] = useState<SelectedItem<DayEvent> | undefined>(undefined);

		const dayItemContentRenderer = useCallback((_date: Date, event?: DayEvent): ReactNode => {
			return <StyledCalendarItem>{event?.title}</StyledCalendarItem>;
		}, []);

		const holidays = args.publicHolidays.map((holiday) => parseISO(holiday));
		const disabled = args.disabledDays.map((day) => parseISO(day));

		return (
			<div style={{ width: "900px", height: "700px" }}>
				<Calendar
					view={args.view}
					weekStartsOn={args.weekStartsOn}
					highlightedWeekends={args.highlightedWeekends}
					highlightedPublicHolidays={args.highlightedPublicHolidays}
					outsideDayDisplay={args.outsideDayDisplay}
					date={new Date(args.date)}
					publicHolidays={holidays}
					calendarDateItems={calendarDays}
					selectedDate={selectedDate}
					onDayClick={setSelectedDate}
					selectedItem={selectedItem}
					onItemClick={setSelectedItem}
					componentRenderers={{
						dayItemContentRenderer
					}}
					isDisabledDay={(date) => !!disabled.find((d) => isSameDay(d, date))}
				/>
			</div>
		);
	}
};
