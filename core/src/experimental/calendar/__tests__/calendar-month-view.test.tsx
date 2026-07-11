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
import { userEvent } from "vitest/browser";
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
		date: new Date(2025, 3, 29),
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
		date: new Date(2025, 4, 5),
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
		date: new Date(2025, 4, 7),
		items: [
			{
				id: "100000003",
				title: "Checkpoint Calendar Widget (Another checkpoint for the basic calendar widget)",
				author: "Charlie Brown"
			}
		]
	},
	{
		date: new Date(2025, 4, 9),
		items: [
			{
				id: "100000004",
				title: "Code Review",
				author: "Emily Clark"
			}
		]
	},
	{
		date: new Date(2025, 4, 12),
		items: [
			{
				id: "455698741",
				title: "Project Deadline"
			}
		]
	}
];

const properties = {
	view: "month" as const,
	highlightedWeekends: true,
	highlightedPublicHolidays: true,
	publicHolidays: [new Date(2025, 4, 5), new Date(2025, 4, 12)] as Date[],
	date: new Date(2025, 4, 27),
	selectedDate: new Date(2025, 4, 5),
	selectedItem: {
		date: new Date(2025, 4, 5),
		items: {
			id: "100000002",
			title: "Product Brainstorming",
			author: "Bob Johnson"
		}
	},
	dayStyle: (date: Date) => {
		if (isSameDay(date, new Date(2025, 4, 21))) {
			return { backgroundColor: "lightblue" };
		}

		return undefined;
	}
};

describe("com.mgmtp.a12.widgets.calendar-month-view", () => {
	test("render basic widgets.calendar-month-view", () => {
		const { container } = render(<Calendar calendarDateItems={calendarDateItems} {...properties} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("render widgets.calendar-month-view with custom renderers", () => {
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

	test("renders weekday headers with custom weekDayFormat", () => {
		const { container } = render(
			<Calendar
				{...properties}
				date={new Date(2025, 4, 1)}
				calendarDateItems={calendarDateItems}
				weekDayFormatter={(date: Date) => format(date, "EEE")}
			/>
		);

		const headerItemsText = getAllByDataRole(container, DataRoles.Calendar.MonthView.WeekDayHeaderItem).map(
			(weekday) => weekday.textContent
		);

		expect(headerItemsText).toStrictEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
	});

	test("render widgets.calendar-month-view with custom weekStartsOn", () => {
		const { container } = render(
			<Calendar
				calendarDateItems={calendarDateItems}
				{...properties}
				weekStartsOn={3}
				weekDayFormatter={(date: Date) => format(date, "EEEE")}
			/>
		);

		const headerItems = getAllByDataRole(container, DataRoles.Calendar.MonthView.WeekDayHeaderItem);

		expect(headerItems.map((item) => item.textContent)).toStrictEqual([
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday",
			"Monday",
			"Tuesday"
		]);
	});

	test("render widgets.calendar-month-view with custom dayDisabled", () => {
		const disabledDate = new Date(2025, 4, 20);
		const { container } = render(
			<Calendar
				calendarDateItems={calendarDateItems}
				{...properties}
				isDisabledDay={(date: Date) => {
					return isSameDay(disabledDate, date);
				}}
			/>
		);
		const monthDay = getAllByDataRole(container, `${DataRoles.Calendar.MonthView.Day}`);

		const disabledDay = monthDay.find((day) => {
			const dataDay = day.getAttribute("data-day");

			return isSameDay(disabledDate, new Date(dataDay!));
		});

		expect(disabledDay?.tabIndex).toBe(-1);
	});

	test("renders day headers with custom dateFormat", () => {
		const calendarInputDate = new Date(2025, 4, 1);
		const dateFormat = "dd/MM";

		const { container } = render(
			<Calendar
				view="month"
				date={calendarInputDate}
				calendarDateItems={calendarDateItems}
				dateFormatter={(date: Date) => format(date, dateFormat)}
			/>
		);

		const days = getAllByDataRole(container, `${DataRoles.Calendar.MonthView.Day}`);

		days.forEach((header) => {
			const dataDay = header.getAttribute("data-day");
			expect(header.textContent).toBe(format(dataDay!, dateFormat));
		});
	});

	test("does not render outside days when outsideDayDisplay is 'none'", () => {
		const { container } = render(
			<Calendar {...properties} outsideDayDisplay="none" calendarDateItems={calendarDateItems} />
		);

		const outsideDays = getAllByDataRole(container, `${DataRoles.Calendar.MonthView.Day}`).filter(
			(day) => day.getAttribute("data-outside") === "true"
		);

		expect(outsideDays.length).toBe(0);
	});

	test("renders calendar with getDayClassName", () => {
		const dateToAddClassName = new Date(2025, 4, 5);

		const { container } = render(
			<Calendar
				{...properties}
				calendarDateItems={calendarDateItems}
				getDayClassName={(date) => (isSameDay(date, dateToAddClassName) ? "-u-background-red-dark" : "")}
			/>
		);

		const dayWithClassName = getAllByDataRole(container, `${DataRoles.Calendar.MonthView.Day}`).find((dayElement) => {
			const dataDay = dayElement.getAttribute("data-day");

			return isSameDay(dataDay!, dateToAddClassName);
		});

		expect(dayWithClassName?.className.includes("-u-background-red-dark")).toBe(true);
	});

	test("renders calendar with getDayStyles", () => {
		const styledDay = new Date(2025, 4, 5);
		const { container } = render(
			<Calendar
				{...properties}
				calendarDateItems={calendarDateItems}
				getDayStyles={(date) => (isSameDay(date, styledDay) ? { backgroundColor: "red" } : undefined)}
			/>
		);

		const dayWithCustomStyle = getAllByDataRole(container, `${DataRoles.Calendar.MonthView.Day}`).find((dayElement) => {
			const dataDay = dayElement.getAttribute("data-day");

			return isSameDay(styledDay, dataDay!);
		});

		expect(dayWithCustomStyle?.getAttribute("style")?.includes("background-color: red;")).toBe(true);
	});

	test("renders calendar with getWeekStyles", () => {
		const weekIndexToStyle = 1;

		const { container } = render(
			<Calendar
				{...properties}
				calendarDateItems={calendarDateItems}
				dateFormatter={(date: Date) => format(date, "dd/MM")}
				getWeekStyles={(weekIndex) => (weekIndex === weekIndexToStyle ? { backgroundColor: "red" } : undefined)}
			/>
		);

		const weekWithCustomStyle = getAllByDataRole(container, DataRoles.Calendar.MonthView.Week)[weekIndexToStyle];

		expect(weekWithCustomStyle?.getAttribute("style")?.includes("background-color: red;")).toBe(true);
	});

	test("renders calendar with getWeekClassName", () => {
		const weekIndexToAddClassName = 1;
		const { container } = render(
			<Calendar
				{...properties}
				calendarDateItems={calendarDateItems}
				dateFormatter={(date: Date) => format(date, "dd/MM")}
				getWeekClassName={(weekIndex) => (weekIndex === weekIndexToAddClassName ? "-u-background-red-dark" : "")}
			/>
		);

		const weekWithCustomClassName = getAllByDataRole(container, DataRoles.Calendar.MonthView.Week)[
			weekIndexToAddClassName
		];

		expect(weekWithCustomClassName?.className.includes("-u-background-red-dark")).toBe(true);
	});

	describe("navigate by arrow key", () => {
		// May 2025, weekStartsOn=1 (Monday, default):
		// Row 0: Apr 28 (Mon)…May 4 (Sun)  — Apr days are "disabled" outside days
		// Row 1: May 5 (Mon)…May 11 (Sun)
		// Row 2: May 12 (Mon)…May 18 (Sun)
		const calendarForNav = {
			view: "month" as const,
			date: new Date(2025, 4, 1),
			calendarDateItems: []
		};

		const findDay = (container: HTMLElement, date: Date): HTMLElement => {
			const dateStr = format(date, "yyyy-MM-dd");

			return getAllByDataRole(container, `${DataRoles.Calendar.MonthView.Day}`).find(
				(day) => day.getAttribute("data-day") === dateStr
			) as HTMLElement;
		};

		test("ArrowRight moves focus to the next day", async () => {
			const { container } = render(<Calendar {...calendarForNav} />);

			const may5 = findDay(container, new Date(2025, 4, 5));
			const may6 = findDay(container, new Date(2025, 4, 6));

			await userEvent.click(may5);
			await userEvent.keyboard("{ArrowRight}");

			expect(may6).toHaveFocus();
		});

		test("ArrowLeft moves focus to the previous day", async () => {
			const { container } = render(<Calendar {...calendarForNav} />);

			const may6 = findDay(container, new Date(2025, 4, 6));
			const may5 = findDay(container, new Date(2025, 4, 5));

			await userEvent.click(may6);
			await userEvent.keyboard("{ArrowLeft}");

			expect(may5).toHaveFocus();
		});

		test("ArrowDown moves focus to the same weekday one week later", async () => {
			const { container } = render(<Calendar {...calendarForNav} />);

			const may5 = findDay(container, new Date(2025, 4, 5));
			const may12 = findDay(container, new Date(2025, 4, 12));

			await userEvent.click(may5);
			await userEvent.keyboard("{ArrowDown}");

			expect(may12).toHaveFocus();
		});

		test("ArrowUp moves focus to the same weekday one week earlier", async () => {
			const { container } = render(<Calendar {...calendarForNav} />);

			const may12 = findDay(container, new Date(2025, 4, 12));
			const may5 = findDay(container, new Date(2025, 4, 5));

			await userEvent.click(may12);
			await userEvent.keyboard("{ArrowUp}");

			expect(may5).toHaveFocus();
		});

		test("ArrowRight wraps from the last day of a week to the first day of the next week", async () => {
			const { container } = render(<Calendar {...calendarForNav} />);

			const may11 = findDay(container, new Date(2025, 4, 11));
			const may12 = findDay(container, new Date(2025, 4, 12));

			await userEvent.click(may11);
			await userEvent.keyboard("{ArrowRight}");

			expect(may12).toHaveFocus();
		});

		test("ArrowLeft wraps from the first day of a week to the last day of the previous week", async () => {
			const { container } = render(<Calendar {...calendarForNav} />);

			const may5 = findDay(container, new Date(2025, 4, 5));
			const may4 = findDay(container, new Date(2025, 4, 4));

			await userEvent.click(may5);
			await userEvent.keyboard("{ArrowLeft}");

			expect(may4).toHaveFocus();
		});

		test("ArrowRight skips disabled days", async () => {
			const { container } = render(
				<Calendar {...calendarForNav} isDisabledDay={(date) => isSameDay(date, new Date(2025, 4, 6))} />
			);

			const may5 = findDay(container, new Date(2025, 4, 5));
			const may7 = findDay(container, new Date(2025, 4, 7));

			await userEvent.click(may5);
			await userEvent.keyboard("{ArrowRight}");

			expect(may7).toHaveFocus();
		});

		test("ArrowLeft skips disabled days", async () => {
			const { container } = render(
				<Calendar {...calendarForNav} isDisabledDay={(date) => isSameDay(date, new Date(2025, 4, 6))} />
			);

			const may7 = findDay(container, new Date(2025, 4, 7));
			const may5 = findDay(container, new Date(2025, 4, 5));

			await userEvent.click(may7);
			await userEvent.keyboard("{ArrowLeft}");

			expect(may5).toHaveFocus();
		});

		test("ArrowDown skips disabled days", async () => {
			const { container } = render(
				<Calendar {...calendarForNav} isDisabledDay={(date) => isSameDay(date, new Date(2025, 4, 12))} />
			);

			const may5 = findDay(container, new Date(2025, 4, 5));
			const may19 = findDay(container, new Date(2025, 4, 19));

			await userEvent.click(may5);
			await userEvent.keyboard("{ArrowDown}");

			expect(may19).toHaveFocus();
		});

		test("ArrowUp skips disabled days", async () => {
			const { container } = render(
				<Calendar {...calendarForNav} isDisabledDay={(date) => isSameDay(date, new Date(2025, 4, 12))} />
			);

			const may19 = findDay(container, new Date(2025, 4, 19));
			const may5 = findDay(container, new Date(2025, 4, 5));

			await userEvent.click(may19);
			await userEvent.keyboard("{ArrowUp}");

			expect(may5).toHaveFocus();
		});
	});
});
