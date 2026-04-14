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

import { describe, expect, test } from "vitest";
import { getAllByDataRole, render } from "test-utils";
import { format, isSameDay } from "date-fns";

import { DataRoles } from "../../../common/main/data-roles.js";

import { Calendar } from "../main/calendar.view.js";

interface DayEvent {
	id: string;
	title: string;
	author?: string;
}

interface CalendarDay {
	date: Date;
	items: DayEvent[];
}

const calendarDateItems: CalendarDay[] = [
	{
		date: new Date(2025, 3, 25),
		items: [
			{
				id: "1000000011",
				title: "Marketing Meeting",
				author: "Alice Smith"
			},
			{
				id: "1000000021",
				title: "Product Brainstorming",
				author: "Bob Johnson"
			}
		]
	},
	{
		date: new Date(2025, 4, 26),
		items: [
			{
				id: "100000001",
				title: "Marketing Meeting",
				author: "Alice Smith"
			},
			{
				id: "100000002",
				title: "Product Brainstorming",
				author: "Bob Johnson"
			}
		]
	},
	{
		date: new Date(2025, 4, 28),
		items: [
			{
				id: "100000003",
				title: "Checkpoint Calendar Widget (Another checkpoint for the basic calendar widget)",
				author: "Charlie Brown"
			}
		]
	},
	{
		date: new Date(2025, 4, 30),
		items: [
			{
				id: "100000004",
				title: "Code Review",
				author: "Emily Clark"
			}
		]
	},
	{
		date: new Date(2025, 4, 31),
		items: [
			{
				id: "455698741",
				title: "Project Deadline"
			}
		]
	}
];

const properties = {
	view: "week" as const,
	highlightedWeekends: true,
	highlightedPublicHolidays: true,
	publicHolidays: [new Date(2025, 4, 29)] as Date[],
	date: new Date(2025, 4, 27),
	selectedDate: new Date(2025, 4, 28),
	selectedItem: {
		date: new Date(2025, 4, 28),
		items: {
			id: "100000003",
			title: "Checkpoint Calendar Widget (Another checkpoint for the basic calendar widget)",
			author: "Charlie Brown"
		}
	},
	dayStyle: (date: Date) => {
		if (isSameDay(date, new Date(2025, 4, 25))) {
			return { backgroundColor: "lightblue" };
		}

		return undefined;
	}
};

describe("com.mgmtp.a12.widgets.calendar-week-view", () => {
	test("render basic widgets.calendar-week-view", () => {
		const { container } = render(<Calendar calendarDateItems={calendarDateItems} {...properties} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render widgets.calendar-week-view with custom renderers", () => {
		const { container } = render(
			<Calendar
				calendarDateItems={calendarDateItems}
				{...properties}
				componentRenderers={{
					dayItemContentRenderer: (date, item: DayEvent) => <div>{item?.title}</div>,
					dayFooterRenderer: (date) => <div>Footer for {date.toLocaleDateString()}</div>,
					dayHeaderRenderer: (date) => <div>Header for {date.toLocaleDateString()}</div>
				}}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render widgets.calendar-week-view with custom weekStartsOn", () => {
		const { container } = render(<Calendar calendarDateItems={calendarDateItems} {...properties} weekStartsOn={3} />);
		const headerItems = getAllByDataRole(container, DataRoles.Calendar.WeekView.DayHeaderItem);

		expect(headerItems.map((item) => item.textContent)).toStrictEqual([
			"Wednesday, 21.05",
			"Thursday, 22.05",
			"Friday, 23.05",
			"Saturday, 24.05",
			"Sunday, 25.05",
			"Monday, 26.05",
			"Tuesday, 27.05"
		]);
	});

	test("render widgets.calendar-week-view with custom dayDisabled", () => {
		const disabledDate = new Date(2025, 4, 27);

		const { container } = render(
			<Calendar
				calendarDateItems={calendarDateItems}
				{...properties}
				isDisabledDay={(date: Date) => {
					return isSameDay(disabledDate, date);
				}}
			/>
		);
		const monthDays = getAllByDataRole(container, DataRoles.Calendar.WeekView.DayWrapper);

		const disabledDay = monthDays.find((day) => {
			const dataDay = day.getAttribute("data-day");

			return isSameDay(dataDay!, disabledDate);
		});
		expect(disabledDay?.tabIndex).toBe(-1);
	});

	test("renders day headers with custom dateFormat", () => {
		const dateFormat = "dd/MM";
		const { container } = render(
			<Calendar
				{...properties}
				date={new Date(2025, 4, 1)}
				calendarDateItems={calendarDateItems}
				dateFormatter={(date: Date) => format(date, dateFormat)}
			/>
		);

		const days = getAllByDataRole(container, DataRoles.Calendar.WeekView.DayWrapper);
		const dayHeaderItems = getAllByDataRole(container, DataRoles.Calendar.WeekView.DayHeaderItem);

		days.forEach((day, index) => {
			const dataDay = day.getAttribute("data-day");
			expect(dayHeaderItems[index].textContent).toBe(format(dataDay!, dateFormat));
		});
	});

	test("does not render outside days when outsideDayDisplay is 'none'", () => {
		const { container } = render(
			<Calendar {...properties} outsideDayDisplay="none" calendarDateItems={calendarDateItems} />
		);
		const outsideDays = getAllByDataRole(container, DataRoles.Calendar.WeekView.DayWrapper).filter((day) => {
			const dataOutside = day.getAttribute("data-outside");

			return dataOutside === "true";
		});

		expect(outsideDays.length).toBe(0);
	});

	test("renders calendar with getDayClassName", () => {
		const dayToCheck = new Date(2025, 4, 28);

		const { container } = render(
			<Calendar
				{...properties}
				calendarDateItems={calendarDateItems}
				getDayClassName={(date) => (isSameDay(date, dayToCheck) ? "-u-background-red-dark" : "")}
			/>
		);

		const dayWithClassName = getAllByDataRole(container, DataRoles.Calendar.WeekView.DayWrapper).find((day) => {
			const dataDay = day.getAttribute("data-day");

			return isSameDay(dataDay!, dayToCheck);
		});

		expect(dayWithClassName?.className.includes("-u-background-red-dark")).toBe(true);
	});

	test("renders calendar with getDayStyles", () => {
		const dayToCheck = new Date(2025, 4, 28);

		const { container } = render(
			<Calendar
				{...properties}
				calendarDateItems={calendarDateItems}
				dateFormatter={(date: Date) => format(date, "dd/MM")}
				getDayStyles={(date) => (isSameDay(date, dayToCheck) ? { backgroundColor: "red" } : undefined)}
			/>
		);

		const dayWithCustomStyle = getAllByDataRole(container, DataRoles.Calendar.WeekView.DayWrapper).find((day) => {
			const dataDay = day.getAttribute("data-day");

			return isSameDay(dataDay!, dayToCheck);
		});

		expect(dayWithCustomStyle?.getAttribute("style")?.includes("background-color: red;")).toBe(true);
	});
});
