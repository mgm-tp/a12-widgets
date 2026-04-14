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

import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { getAllByDataRole, getByDataRole, render } from "test-utils";
import { differenceInCalendarWeeks, format, isSameDay, startOfWeek } from "date-fns";
import { waitFor } from "@testing-library/dom";

import { DataRoles } from "../../../common/main/data-roles.js";

import type { CalendarDay, DateLoadingStatus } from "../main/calendar.api.js";
import { CalendarInfiniteView } from "../main/view/calendar-month-view/calendar-infinite-view/calendar-infinite-view.js";

interface DayEvent {
	id: string;
	title: string;
}

const calendarDateItems: CalendarDay<DayEvent>[] = [
	{
		date: new Date(2025, 0, 1),
		items: [{ id: "1", title: "New Year" }]
	},
	{
		date: new Date(2025, 0, 15),
		items: [{ id: "2", title: "Mid January Event" }]
	}
];

const MIN_DATE = new Date(2022, 1, 15);
const MAX_DATE = new Date(2027, 10, 24);

describe("com.mgmtp.a12.widgets.calendar.infinite-view", () => {
	test("Should render infinite view with custom getWeekStyles and getWeekClassName.", async () => {
		vi.useFakeTimers();
		const weekStartsOn = 0;
		const date = new Date(2026, 11, 5);

		const styledWeekIndex = differenceInCalendarWeeks(date, MIN_DATE, { weekStartsOn });
		const firstDateInStyledWeek = startOfWeek(date, { weekStartsOn });

		const { getAllByDataRole } = render(
			<div style={{ minWidth: 750, height: 900 }}>
				<CalendarInfiniteView
					calendarDateItems={calendarDateItems}
					date={date}
					infiniteScrollOptions={{
						displayWeeksCount: 5,
						minDate: MIN_DATE,
						maxDate: MAX_DATE,
						dateLoadingStatus(): DateLoadingStatus {
							return "loaded";
						}
					}}
					getWeekStyles={(weekIndex) => (weekIndex === styledWeekIndex ? { backgroundColor: "red" } : undefined)}
					getWeekClassName={(weekIndex) => (weekIndex === styledWeekIndex ? "-u-background-red-dark" : "")}
					weekStartsOn={weekStartsOn}
				/>
			</div>
		);

		// wait for the weeks to be rendered
		await vi.advanceTimersByTimeAsync(500);

		const dayInStyledWeek = getAllByDataRole(`${DataRoles.Calendar.MonthView.Day}`).find((dayElement) => {
			const dataDay = dayElement.getAttribute("data-day");

			return dataDay && isSameDay(new Date(dataDay), firstDateInStyledWeek);
		});

		const styledWeek = dayInStyledWeek?.closest(`[data-role=${DataRoles.Calendar.MonthView.Week}]`) as HTMLElement;

		expect(styledWeek?.getAttribute("style")?.includes("background-color: red;")).toBe(true);
		expect(styledWeek?.className.includes("-u-background-red-dark")).toBe(true);

		vi.useRealTimers();
	});

	test("Should call loadData on initialization. ", async () => {
		const date = new Date(2025, 11, 2);
		const displayWeeksCount = 5;
		const threshold = 10;

		const mockLoadData = vi.fn();

		render(
			<div style={{ minWidth: 750, height: 900 }}>
				<CalendarInfiniteView
					calendarDateItems={calendarDateItems}
					date={date}
					infiniteScrollOptions={{
						displayWeeksCount,
						loadData: mockLoadData,
						threshold,
						minDate: MIN_DATE,
						maxDate: MAX_DATE,
						dateLoadingStatus(): DateLoadingStatus {
							return undefined;
						}
					}}
					weekStartsOn={0}
				/>
			</div>
		);

		await waitFor(() => {
			expect(mockLoadData).toHaveBeenCalled();
		});
	});

	test("Should be able to scroll to minDate.", async () => {
		const minDate = new Date(2025, 5, 1);
		const date = new Date(2025, 11, 15);

		vi.useFakeTimers();

		const { container } = render(
			<div style={{ minWidth: 750, height: 900 }}>
				<CalendarInfiniteView
					calendarDateItems={calendarDateItems}
					date={date}
					infiniteScrollOptions={{
						displayWeeksCount: 5,
						minDate,
						maxDate: MAX_DATE,
						dateLoadingStatus(): DateLoadingStatus {
							return "loaded";
						}
					}}
					weekStartsOn={0}
				/>
			</div>
		);

		const minDataDay = format(minDate, "yyyy-MM-dd");

		// make sure minDate are not rendered
		expect(container.querySelector(`[data-day="${minDataDay}]"`)).toBeNull();

		const scrollableParent = getByDataRole(container, DataRoles.Calendar.MonthView.Infinite.ScrollContainer);

		// Scroll until reach top
		while (scrollableParent.scrollTop > 0) {
			scrollableParent.scrollTop -= 180;

			await vi.advanceTimersByTimeAsync(100);
		}

		const minDateElement = container.querySelector(`[data-day="${minDataDay}"]`);
		expect(minDateElement).not.toBeNull();

		// Confirm first week contains the minDate
		const firstWeek = getAllByDataRole(container, DataRoles.Calendar.MonthView.Week)[0];
		expect(firstWeek.querySelector(`[data-day="${minDataDay}"]`)).toBeInTheDocument();

		vi.useRealTimers();
	});

	test("Should be able to scroll to maxDate.", async () => {
		const date = new Date(2025, 11, 15);
		const maxDate = new Date(2026, 5, 12);

		vi.useFakeTimers();

		const { container } = render(
			<div style={{ minWidth: 750, height: 900 }}>
				<CalendarInfiniteView
					calendarDateItems={calendarDateItems}
					date={date}
					infiniteScrollOptions={{
						displayWeeksCount: 5,
						maxDate,
						minDate: MIN_DATE,
						dateLoadingStatus(): DateLoadingStatus {
							return "loaded";
						}
					}}
					weekStartsOn={0}
				/>
			</div>
		);

		const maxDataDay = format(maxDate, "yyyy-MM-dd");

		// make sure maxDate are not rendered
		expect(container.querySelector(`[data-day="${maxDataDay}]"`)).toBeNull();

		const scrollableParent = getByDataRole(container, DataRoles.Calendar.MonthView.Infinite.ScrollContainer);

		// Scroll down until reach bottom
		while (scrollableParent.scrollTop + scrollableParent.clientHeight < scrollableParent.scrollHeight) {
			scrollableParent.scrollTop += 180;
			await vi.advanceTimersByTimeAsync(100);
		}

		const maxDateElement = container.querySelector(`[data-day="${maxDataDay}"]`);
		expect(maxDateElement).not.toBeNull();

		// Confirm first week contains the maxDate
		const displayWeeks = getAllByDataRole(container, DataRoles.Calendar.MonthView.Week);
		const lastWeek = displayWeeks[displayWeeks.length - 1];
		expect(lastWeek.querySelector(`[data-day="${maxDataDay}"]`)).toBeInTheDocument();

		vi.useRealTimers();
	});

	test("Should call onDateRangeDisplayChange when scrolling.", async () => {
		const date = new Date(2025, 11, 2);
		const onDateRangeDisplayChange = vi.fn();
		const displayWeeksCount = 5;

		const { container } = render(
			<div style={{ minWidth: 750, height: 900 }}>
				<CalendarInfiniteView
					calendarDateItems={calendarDateItems}
					date={date}
					infiniteScrollOptions={{
						displayWeeksCount: displayWeeksCount,
						onVisibleRangeChange: onDateRangeDisplayChange,
						minDate: MIN_DATE,
						maxDate: MAX_DATE,
						dateLoadingStatus(): DateLoadingStatus {
							return "loaded";
						}
					}}
				/>
			</div>
		);

		await waitFor(() => {
			expect(onDateRangeDisplayChange).toHaveBeenCalledTimes(1);
		});

		const scrollableParent = getByDataRole(container, DataRoles.Calendar.MonthView.Infinite.ScrollContainer);
		const weekHeight = scrollableParent.clientHeight / displayWeeksCount;

		// Scroll down by 1 week
		scrollableParent.scrollTop += weekHeight;
		await waitFor(() => {
			expect(onDateRangeDisplayChange).toHaveBeenCalledTimes(2);
		});

		// Scroll up by 1 week
		scrollableParent.scrollTop -= weekHeight;
		await waitFor(() => {
			expect(onDateRangeDisplayChange).toHaveBeenCalledTimes(3);
		});
	});

	test("Should exclude partially visible week from onVisibleRangeChange when visibleThreshold is set as px value.", async () => {
		const date = new Date(2025, 11, 2);
		const onVisibleRangeChange = vi.fn();
		const displayWeeksCount = 5;

		const { getByDataRole } = render(
			<div style={{ minWidth: 750, height: 900 }}>
				<CalendarInfiniteView
					calendarDateItems={calendarDateItems}
					date={date}
					infiniteScrollOptions={{
						displayWeeksCount,
						onVisibleRangeChange,
						minDate: MIN_DATE,
						maxDate: MAX_DATE,
						visibleThreshold: "90px",
						dateLoadingStatus(): DateLoadingStatus {
							return "loaded";
						}
					}}
				/>
			</div>
		);

		await waitFor(() => {
			expect(onVisibleRangeChange).toHaveBeenCalledTimes(1);
		});

		const [rangeWithThresholdStart, rangeWithThresholdEnd] = onVisibleRangeChange.mock.lastCall as [Date, Date];
		onVisibleRangeChange.mockReset();

		const scrollableParent = getByDataRole(DataRoles.Calendar.MonthView.Infinite.ScrollContainer);
		const weekHeight = scrollableParent.clientHeight / displayWeeksCount;

		// Scroll by a tiny amount so the next week becomes only barely visible (10px)
		scrollableParent.scrollTop += 10;
		expect(onVisibleRangeChange).not.toHaveBeenCalled();

		// Now scroll a full week so the next week is fully visible
		scrollableParent.scrollTop += weekHeight;

		await waitFor(() => {
			expect(onVisibleRangeChange).toHaveBeenCalledTimes(1);
		});

		const [rangeFullScrollStart, rangeFullScrollEnd] = onVisibleRangeChange.mock.lastCall as [Date, Date];

		// After a full-week scroll the end of the range should advance by at least one week
		expect(rangeFullScrollEnd.getTime()).toBeGreaterThan(rangeWithThresholdEnd.getTime());
		expect(rangeFullScrollStart.getTime()).toBeGreaterThanOrEqual(rangeWithThresholdStart.getTime());
	});

	test("Should restore focus to a day cell after calendarDateItems updates", async () => {
		vi.useFakeTimers();

		const date = new Date(2025, 4, 1); // May 2025

		const dateLoadingStatusFn = vi.fn<() => DateLoadingStatus>().mockReturnValue("loaded");

		const {
			rerender,
			getAllByDataRole: getAllDays,
			getByDataRole: getScrollContainer
		} = render(
			<div style={{ minWidth: 750, height: 900 }}>
				<CalendarInfiniteView
					calendarDateItems={[]}
					date={date}
					infiniteScrollOptions={{
						displayWeeksCount: 5,
						minDate: MIN_DATE,
						maxDate: MAX_DATE,
						dateLoadingStatus: dateLoadingStatusFn
					}}
					weekStartsOn={1}
				/>
			</div>
		);

		// Wait for the virtualizer to render
		await vi.advanceTimersByTimeAsync(500);

		// Focus a day cell
		const dayCell = getAllDays(`${DataRoles.Calendar.MonthView.Day}`).find(
			(el) => el.getAttribute("data-day") === "2025-05-05"
		) as HTMLElement;

		await userEvent.click(dayCell);
		expect(document.activeElement).toBe(dayCell);

		// Simulate data load: re-render with new calendarDateItems
		rerender(
			<div style={{ minWidth: 750, height: 900 }}>
				<CalendarInfiniteView
					calendarDateItems={[{ date: new Date(2025, 4, 5), items: [] }]}
					date={date}
					infiniteScrollOptions={{
						displayWeeksCount: 5,
						minDate: MIN_DATE,
						maxDate: MAX_DATE,
						dateLoadingStatus: dateLoadingStatusFn
					}}
					weekStartsOn={1}
				/>
			</div>
		);

		await vi.advanceTimersByTimeAsync(100);

		// Focus must still be inside the calendar scroll container
		const scrollContainer = getScrollContainer(DataRoles.Calendar.MonthView.Infinite.ScrollContainer);
		expect(scrollContainer.contains(document.activeElement)).toBe(true);

		vi.useRealTimers();
	});

	test("Should exclude partially visible week from onVisibleRangeChange when visibleThreshold is set as percent value.", async () => {
		const date = new Date(2025, 11, 2);
		const onVisibleRangeChange = vi.fn();
		const displayWeeksCount = 5;

		const { getByDataRole } = render(
			<div style={{ minWidth: 750, height: 900 }}>
				<CalendarInfiniteView
					calendarDateItems={calendarDateItems}
					date={date}
					infiniteScrollOptions={{
						displayWeeksCount,
						onVisibleRangeChange,
						minDate: MIN_DATE,
						maxDate: MAX_DATE,
						visibleThreshold: "50%",
						dateLoadingStatus(): DateLoadingStatus {
							return "loaded";
						}
					}}
				/>
			</div>
		);

		await waitFor(() => {
			expect(onVisibleRangeChange).toHaveBeenCalledTimes(1);
		});

		const [rangeWithThresholdStart, rangeWithThresholdEnd] = onVisibleRangeChange.mock.lastCall as [Date, Date];
		onVisibleRangeChange.mockReset();

		const scrollableParent = getByDataRole(DataRoles.Calendar.MonthView.Infinite.ScrollContainer);
		const weekHeight = scrollableParent.clientHeight / displayWeeksCount;

		// Scroll by less than 50% of week height — the next week is visible but below the threshold
		scrollableParent.scrollTop += Math.floor(weekHeight * 0.3);
		expect(onVisibleRangeChange).not.toHaveBeenCalled();

		// Scroll past 50% of week height — the next week now meets the threshold
		scrollableParent.scrollTop += Math.ceil(weekHeight * 0.3);

		await waitFor(() => {
			expect(onVisibleRangeChange).toHaveBeenCalledTimes(1);
		});

		const [rangeFullScrollStart, rangeFullScrollEnd] = onVisibleRangeChange.mock.lastCall as [Date, Date];

		// After crossing the threshold the end of the range should advance by at least one week
		expect(rangeFullScrollEnd.getTime()).toBeGreaterThan(rangeWithThresholdEnd.getTime());
		expect(rangeFullScrollStart.getTime()).toBeGreaterThanOrEqual(rangeWithThresholdStart.getTime());
	});

	test("Should preserve focused element when container height changes.", async () => {
		const date = new Date(2025, 11, 2);
		const displayWeeksCount = 5;

		vi.useFakeTimers();

		const { container } = render(
			<div style={{ minWidth: 750, height: 900 }}>
				<CalendarInfiniteView
					calendarDateItems={calendarDateItems}
					date={date}
					infiniteScrollOptions={{
						displayWeeksCount,
						minDate: MIN_DATE,
						maxDate: MAX_DATE,
						dateLoadingStatus(): DateLoadingStatus {
							return "loaded";
						}
					}}
					weekStartsOn={0}
				/>
			</div>
		);

		// Wait for initial weeks to render and virtualizer to scroll to the target date
		await vi.advanceTimersByTimeAsync(500);

		// Focus a specific day cell
		const focusedDateStr = format(date, "yyyy-MM-dd");
		const dayToFocus = getAllByDataRole(container, `${DataRoles.Calendar.MonthView.Day}`).find(
			(el) => el.getAttribute("data-day") === focusedDateStr
		) as HTMLElement;

		expect(dayToFocus).not.toBeNull();
		dayToFocus.focus();
		expect(document.activeElement).toBe(dayToFocus);

		// Switch to real timers so ResizeObserver and requestAnimationFrame fire naturally
		vi.useRealTimers();

		// Simulate viewport height change (container shrinks)
		const wrapper = container.firstElementChild as HTMLElement;

		wrapper.style.height = "600px";

		// Wait for scroll container to reflect the new size (confirms ResizeObserver fired)
		const scrollContainer = getByDataRole(container, DataRoles.Calendar.MonthView.Infinite.ScrollContainer);

		await waitFor(() => {
			expect(scrollContainer.clientHeight).toBeLessThan(900);
		});

		// Assert the focused day cell retains focus after resize
		await waitFor(() => {
			expect((document.activeElement as HTMLElement)?.getAttribute("data-day")).toBe(focusedDateStr);
		});
	});

	describe("restoreFocusOnHeightChange", () => {
		test("Should restore focused element when container height changes and restoreFocusOnHeightChange is true.", async () => {
			const date = new Date(2025, 11, 2);
			const displayWeeksCount = 5;

			vi.useFakeTimers();

			const { container } = render(
				<div style={{ minWidth: 750, height: 900 }}>
					<CalendarInfiniteView
						calendarDateItems={calendarDateItems}
						date={date}
						infiniteScrollOptions={{
							displayWeeksCount,
							minDate: MIN_DATE,
							maxDate: MAX_DATE,
							restoreFocusOnHeightChange: true,
							dateLoadingStatus(): DateLoadingStatus {
								return "loaded";
							}
						}}
						weekStartsOn={0}
					/>
				</div>
			);

			// Wait for initial weeks to render and virtualizer to scroll to the target date
			await vi.advanceTimersByTimeAsync(500);

			// Focus a specific day cell
			const focusedDateStr = format(date, "yyyy-MM-dd");
			const dayToFocus = container.querySelector(
				`[data-role="${DataRoles.Calendar.MonthView.Day}"][data-day="${focusedDateStr}"]`
			) as HTMLElement;

			expect(dayToFocus).not.toBeNull();
			dayToFocus.focus();
			expect(document.activeElement).toBe(dayToFocus);

			vi.useRealTimers();

			// Simulate viewport height change (container shrinks)
			const wrapper = container.firstElementChild as HTMLElement;

			wrapper.style.height = "600px";

			// Wait for scroll container to reflect the new size (confirms ResizeObserver fired)
			const scrollContainer = getByDataRole(container, DataRoles.Calendar.MonthView.Infinite.ScrollContainer);

			await waitFor(() => {
				expect(scrollContainer.clientHeight).toBeLessThan(900);
			});

			// Assert the focused day cell regains focus after the 300 ms restore timeout
			await waitFor(() => {
				expect((document.activeElement as HTMLElement)?.getAttribute("data-day")).toBe(focusedDateStr);
			});
		});

		test("Should not restore focused element when container height changes and restoreFocusOnHeightChange is false.", async () => {
			const date = new Date(2025, 11, 2);
			const displayWeeksCount = 5;

			vi.useFakeTimers();

			const { container } = render(
				<div style={{ minWidth: 750, height: 900 }}>
					<CalendarInfiniteView
						calendarDateItems={calendarDateItems}
						date={date}
						infiniteScrollOptions={{
							displayWeeksCount,
							minDate: MIN_DATE,
							maxDate: MAX_DATE,
							restoreFocusOnHeightChange: false,
							dateLoadingStatus(): DateLoadingStatus {
								return "loaded";
							}
						}}
						weekStartsOn={0}
					/>
				</div>
			);

			// Wait for initial weeks to render and virtualizer to scroll to the target date
			await vi.advanceTimersByTimeAsync(500);

			// Focus a specific day cell
			const focusedDateStr = format(date, "yyyy-MM-dd");
			const dayToFocus = container.querySelector(
				`[data-role="${DataRoles.Calendar.MonthView.Day}"][data-day="${focusedDateStr}"]`
			) as HTMLElement;

			expect(dayToFocus).not.toBeNull();
			dayToFocus.focus();
			expect(document.activeElement).toBe(dayToFocus);

			// Simulate viewport height change (container shrinks) — this triggers capturePreResizeStartIndex,
			// which will NOT record the focused day because restoreFocusOnHeightChange is false
			const wrapper = container.firstElementChild as HTMLElement;

			wrapper.style.height = "600px";

			vi.useRealTimers();

			// Wait for scroll container to reflect the new size (confirms ResizeObserver fired)
			const scrollContainer = getByDataRole(container, DataRoles.Calendar.MonthView.Infinite.ScrollContainer);

			await waitFor(() => {
				expect(scrollContainer.clientHeight).toBeLessThan(900);
			});

			vi.useFakeTimers();

			await vi.advanceTimersByTimeAsync(500);
			expect(document.activeElement).not.toBe(dayToFocus);

			vi.useRealTimers();
		});
	});
});
