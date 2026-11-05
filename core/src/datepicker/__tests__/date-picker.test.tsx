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

import { getByLabelText } from "@testing-library/dom";
import { add } from "date-fns";
import { de } from "date-fns/locale";
import {
	fireEvent,
	getAllByDataRole,
	getByDataRole,
	getByRole,
	getByText,
	queryByDataRole,
	queryByRole,
	render,
	screen
} from "test-utils";
import { describe, test, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../common/main/data-roles.js";
import { DateTimeContext } from "../../common/main/date-time/date-time-context.js";
import { DateInput } from "../main/date-input.view.js";
import { DatePicker } from "../main/date-picker.view.js";

const baseClassName = "DayPicker";

describe.each([undefined, "UTC", "Pacific/Kiritimati"])(
	"com.mgmtp.a12.widgets.date-picker with timezone %s",
	(timezone) => {
		beforeAll(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date(Date.UTC(2022, 2, 2).valueOf()));
		});

		afterAll(() => {
			vi.useRealTimers();
		});
		test("render basic date picker — select year selector", () => {
			const { container } = render(
				<DatePicker
					id="test-id"
					className="test-class"
					style={{ color: "red" }}
					timezone={timezone}
					yearSelectorVariant="select"
				/>
			);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render basic date picker with outside days displaying", () => {
			const { container } = render(<DatePicker showOutsideDays timezone={timezone} />);

			const outsideDays = container.querySelectorAll('[data-month="2022-04"]');
			outsideDays.forEach((day) => {
				expect(day).toHaveAttribute("data-outside", "true");
				expect(day).toHaveClass("DayPicker-Day--outside");
			});
		});

		test("render date picker with passed date", async () => {
			const day = new Date(Date.UTC(2022, 2, 12).valueOf());
			const { container } = render(<DatePicker month={day} selected={day} value={day} timezone={timezone} />);
			expect((screen.getByRole("option", { name: "March" }) as HTMLOptionElement).selected).toBe(true);
			// Year uses textbox variant by default (no yearRange) — check input value instead of option
			expect((getByDataRole(container, DataRoles.Year.Selector.Input) as HTMLInputElement).value).toBe("2022");
			expect(screen.getByText("12")).toHaveAttribute("aria-label", "Saturday, March 12th, 2022, selected");
			expect(container.getElementsByClassName("DayPicker-Day--selected")[0]).toHaveTextContent("12");
		});

		test("render date picker with disabled day", () => {
			const onChangeFn = vi.fn();
			const { container } = render(<DatePicker disabled={new Date()} onChange={onChangeFn} timezone={timezone} />);

			const today = container.querySelector(`.${baseClassName}-Day--today`);

			if (today) {
				expect(today).toHaveClass("DayPicker-Day--disabled");
				expect(today).toMatchSnapshot();

				fireEvent.click(today);
				expect(onChangeFn).toHaveBeenCalledTimes(0);
			}
		});

		test("render date picker with custom modifier", () => {
			const highlightedDay = (day: Date): boolean => {
				return day.getDate() === 20;
			};

			const { container } = render(
				<DatePicker
					modifiers={{ highlightedDay }}
					modifiersClassNames={{ highlightedDay: "highlightedDay" }}
					timezone={timezone}
				/>
			);
			const dayButton = getByText(container, "20");
			expect(dayButton.parentElement).toHaveClass("highlightedDay");
		});
		test("render date picker with custom locale", () => {
			const { container } = render(
				<DateTimeContext.Provider value={{ locale: de }}>
					<DatePicker timezone={timezone} />
				</DateTimeContext.Provider>
			);

			// Verify that the month selector uses the German locale
			const monthOptions = container.querySelectorAll(`[data-role=${DataRoles.Month.Selector.Input}] option`);
			const germanMonths = [
				"Januar",
				"Februar",
				"März",
				"April",
				"Mai",
				"Juni",
				"Juli",
				"August",
				"September",
				"Oktober",
				"November",
				"Dezember"
			];

			monthOptions.forEach((option, index) => {
				expect(option.textContent).toBe(germanMonths[index]);
			});
		});

		test("render date-range picker — select year selector", () => {
			const fromDate = new Date();
			const toDate = new Date(fromDate);
			toDate.setDate(fromDate.getDate() + 1);

			const { container } = render(
				<DatePicker
					selected={[fromDate, { from: fromDate, to: toDate }]}
					timezone={timezone}
					yearSelectorVariant="select"
				/>
			);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render custom footer", () => {
			// The old test was not correct. The custom footer is only rendered in range picker
			const { container } = render(
				<DatePicker mode="range" footer={{ customFooter: <p className="custom-footer">Custom Footer</p> }} />
			);
			expect(getByText(container, "Custom Footer")).toHaveClass("custom-footer");
		});

		test("render custom year range with select variant shows all year options", () => {
			const { container } = render(
				<DatePicker yearRange={{ start: 2000, end: 2030 }} yearSelectorVariant="select" timezone={timezone} />
			);

			for (let year = 2000; year <= 2030; year++) {
				expect(getByText(container, year)).toBeInTheDocument();
			}
		});

		test("render custom year range with autocomplete variant", () => {
			const { container } = render(<DatePicker yearRange={{ start: 2000, end: 2030 }} timezone={timezone} />);

			// Autocomplete variant: year input renders as text input, not a select
			const yearInput = getByDataRole(container, DataRoles.Year.Selector.Input) as HTMLInputElement;
			expect(yearInput.tagName).toBe("INPUT");
		});

		// Meaning less test. Should test again base on the actual class name provided in the datePickerClassNames
		test("test date picker classNames — select year selector", () => {
			const classNames = {
				container: "",
				wrapper: "",
				interactionDisabled: "",
				navBar: "",
				navButtonPrev: "",
				navButtonNext: "",
				navButtonInteractionDisabled: "",
				months: "",
				month: "",
				caption: "",
				weekdays: "",
				weekdaysRow: "",
				weekday: "",
				weekNumber: "",
				body: "",
				week: "",
				day: "",
				footer: "",
				todayButton: "",
				today: "",
				selected: "",
				disabled: "",
				outside: ""
			};
			const { container } = render(
				<DatePicker classNames={classNames} timezone={timezone} yearSelectorVariant="select" />
			);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render custom months", () => {
			const customMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
			const { container } = render(<DatePicker months={customMonths} timezone={timezone} />);

			customMonths.forEach((month) => {
				expect(getByRole(container, "option", { name: `${month}` })).toBeInTheDocument();
			});
		});

		test("render weekNumbers", () => {
			const { container } = render(<DatePicker showWeekNumber timezone={timezone} />);
			const weekNumberHeader = getByLabelText(container, "Week Number");
			expect(weekNumberHeader).toBeInTheDocument();
			expect(weekNumberHeader).toHaveClass("DayPicker-WeekNumberHeader");

			// The current month should show week 11 to week 15
			for (let week = 11; week <= 15; week++) {
				const weekNumber = getByLabelText(container, `Week ${week}`);
				expect(weekNumber).toBeInTheDocument();
				expect(weekNumber).toHaveClass("DayPicker-WeekNumber");
			}
		});

		test("Should not shift the month to the previous month when selecting the first day of a month", () => {
			const { container } = render(<DatePicker value={new Date(Date.UTC(2022, 2, 1))} />);

			expect((getByDataRole(container, DataRoles.Month.Selector.Input) as HTMLSelectElement).value).toBe("2");
			expect((getByDataRole(container, DataRoles.Year.Selector.Input) as HTMLSelectElement).value).toBe("2022");
			expect(container.getElementsByClassName("DayPicker-Day--selected").item(0)?.textContent).toBe("1");
		});

		test("simulate click a day", () => {
			const onChangeFn = vi.fn();
			const onDayClickFn = vi.fn();
			const { container } = render(<DatePicker onChange={onChangeFn} onDayClick={onDayClickFn} timezone={timezone} />);

			const today = container.querySelector(`.${baseClassName}-Day--today`);

			if (today) {
				fireEvent.click(today.firstChild!);
				expect(onDayClickFn).toHaveBeenCalledTimes(1);
				expect(onChangeFn).toHaveBeenCalledTimes(1);
			}
		});

		test("simulate onMonthChange", () => {
			const onMonthChangeFn = vi.fn();
			const { container } = render(<DatePicker onMonthChange={onMonthChangeFn} timezone={timezone} />);

			fireEvent.click(getByDataRole(container, DataRoles.DatePicker.NavBar.Next));
			expect(onMonthChangeFn).toHaveBeenCalledTimes(1);
		});

		test("simulate onAccept and custom submit label in date-range picker", () => {
			const today = new Date();
			const onAcceptFn = vi.fn();
			const { container } = render(
				<DatePicker
					selected={[today, { from: today, to: today }]}
					footer={{ acceptLabel: "OK", onAccept: onAcceptFn }}
					timezone={timezone}
				/>
			);

			// first action element is empty, used only for layout purpose
			const action = getAllByDataRole(container, DataRoles.DatePicker.Footer.Action)[1];
			expect(action).toHaveTextContent("OK");
			fireEvent.click(getByDataRole(action, DataRoles.Button));
			expect(onAcceptFn).toHaveBeenCalledWith({ from: today, to: today });
		});

		test("simulate onClear and custom clear label in date-range picker", () => {
			const today = new Date();
			const onClearFn = vi.fn();
			const { container } = render(
				<DatePicker
					selected={[today, { from: today, to: today }]}
					footer={{ clearLabel: "Clear Button", onClear: onClearFn }}
					timezone={timezone}
				/>
			);

			const action = getAllByDataRole(container, DataRoles.DatePicker.Footer.Action)[2];
			const button = getByDataRole(action, DataRoles.Button);
			expect(button).toHaveTextContent("Clear Button");
			fireEvent.click(button);
			expect(onClearFn).toHaveBeenCalledTimes(1);
		});

		test("should be focused after clicking the clear button in date-range picker", () => {
			const { container } = render(
				<DateInput
					useRangePicker
					dateFormatter={() => ""}
					dateConverter={() => undefined}
					datePickerProps={{
						footer: { clearLabel: "clear" },
						timezone: timezone
					}}
				/>
			);

			fireEvent.click(getByDataRole(container, DataRoles.Button));
			const datePickerElement = getByDataRole(container, DataRoles.DatePicker.Root);
			const dayBtn = getByText(datePickerElement, "1");
			fireEvent.click(dayBtn);
			const clearBtn = getByRole(datePickerElement, "button", { name: "clear" });
			fireEvent.click(clearBtn);
			expect(datePickerElement).toHaveFocus();
		});

		test("simulate date-range change", () => {
			const currentDate = new Date();
			const fromDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 15);
			const toDay = add(fromDay, {
				days: 1
			});
			const toDayModifier = (modifierDay: Date): boolean => {
				return toDay === modifierDay;
			};

			const fromDayModifier = (modifierDay: Date): boolean => {
				return fromDay === modifierDay;
			};

			const onDateRangeChangeFn = vi.fn();
			const { container } = render(
				<DatePicker
					onDateRangeChange={onDateRangeChangeFn}
					modifiers={{
						toDayModifier,
						fromDayModifier
					}}
					modifiersClassNames={{
						toDayModifier: "to-day-class-name",
						fromDayModifier: "from-day-class-name"
					}}
					timezone={timezone}
				/>
			);

			const fromDayElement = container.querySelector(`.from-day-class-name`);
			const toDayElement = container.querySelector(`.to-day-class-name`);

			if (fromDayElement && toDayElement) {
				// select start date
				fireEvent.click(fromDayElement);

				// select end date
				fireEvent.click(toDayElement);

				expect(onDateRangeChangeFn).toHaveBeenCalledWith({
					from: new Date(Date.UTC(fromDay.getFullYear(), fromDay.getMonth(), fromDay.getDate())),
					to: new Date(Date.UTC(toDay.getFullYear(), toDay.getMonth(), toDay.getDate()))
				});
			}
		});
	}
);

describe("com.mgmtp.a12.widgets.date-picker — year selector variants", () => {
	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(Date.UTC(2022, 2, 2).valueOf()));
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	test("default variant (no yearRange) renders year as textbox input", () => {
		const { container } = render(<DatePicker />);

		const yearInput = getByDataRole(container, DataRoles.Year.Selector.Input) as HTMLInputElement;
		expect(yearInput.tagName).toBe("INPUT");
		expect(yearInput).toHaveAttribute("inputmode", "numeric");
	});

	test("textbox variant shows current year value in input", () => {
		const day = new Date(Date.UTC(2022, 2, 12));
		const { container } = render(<DatePicker yearSelectorVariant="textbox" value={day} month={day} />);

		const yearInput = getByDataRole(container, DataRoles.Year.Selector.Input) as HTMLInputElement;
		expect(yearInput.value).toBe("2022");
	});

	test("textbox variant: typing a 4-digit year navigates the picker", async () => {
		const { container } = render(<DatePicker yearSelectorVariant="textbox" />);

		const yearInput = getByDataRole(container, DataRoles.Year.Selector.Input) as HTMLInputElement;
		await userEvent.click(yearInput);
		await userEvent.clear(yearInput);
		await userEvent.type(yearInput, "2025");

		expect(yearInput.value).toBe("2025");
	});

	test("textbox variant: partial input (< 4 digits) does not navigate", async () => {
		const onChangeFn = vi.fn();
		const { container } = render(<DatePicker yearSelectorVariant="textbox" onChange={onChangeFn} />);

		const yearInput = getByDataRole(container, DataRoles.Year.Selector.Input) as HTMLInputElement;
		await userEvent.click(yearInput);
		await userEvent.clear(yearInput);
		await userEvent.type(yearInput, "20");

		expect(onChangeFn).not.toHaveBeenCalled();
	});

	test("select variant renders year as select element", () => {
		const { container } = render(<DatePicker yearSelectorVariant="select" />);

		const yearInput = getByDataRole(container, DataRoles.Year.Selector.Input) as HTMLSelectElement;
		expect(yearInput.tagName).toBe("SELECT");
	});

	test("select variant with yearRange shows correct options", () => {
		const { container } = render(<DatePicker yearSelectorVariant="select" yearRange={{ start: 2010, end: 2015 }} />);

		for (let year = 2010; year <= 2015; year++) {
			expect(getByText(container, year)).toBeInTheDocument();
		}
	});

	test("yearSelectorVariant=textbox: onYearSelectorBlur prop is accepted without errors", () => {
		const onBlurFn = vi.fn();
		const { container } = render(<DatePicker yearSelectorVariant="textbox" onYearSelectorBlur={onBlurFn} />);

		const yearInput = getByDataRole(container, DataRoles.Year.Selector.Input);
		expect(yearInput).toBeInTheDocument();
		expect(yearInput.tagName).toBe("INPUT");
	});

	test("yearErrorMessage is displayed when provided", () => {
		const { container } = render(<DatePicker yearSelectorVariant="textbox" yearErrorMessage="Invalid year" />);

		expect(container).toMatchTextContent("Invalid year");
	});

	test("yearErrorMessage is NOT rendered when not provided", () => {
		const { container } = render(<DatePicker yearSelectorVariant="textbox" />);

		expect(container).not.toHaveTextContent("Invalid year");
	});

	test("autocomplete variant renders year as text input (Autocomplete)", () => {
		const { container } = render(
			<DatePicker yearSelectorVariant="autocomplete" yearRange={{ start: 2000, end: 2030 }} />
		);

		const yearInput = getByDataRole(container, DataRoles.Year.Selector.Input) as HTMLInputElement;
		expect(yearInput.tagName).toBe("INPUT");
	});
});

describe("com.mgmtp.a12.widgets.date-picker — year selector snapshots", () => {
	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(Date.UTC(2022, 2, 2).valueOf()));
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	test("render date picker with textbox year selector (default)", () => {
		const { container } = render(<DatePicker id="test-id" className="test-class" style={{ color: "red" }} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render date picker with autocomplete year selector", () => {
		const { container } = render(
			<DatePicker id="test-id" className="test-class" yearRange={{ start: 2000, end: 2030 }} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});
});

describe("com.mgmtp.a12.widgets.date-picker — behavior", () => {
	const utc = (year: number, month: number, day: number): Date => new Date(Date.UTC(year, month, day));
	const monthSelectOf = (container: HTMLElement): HTMLSelectElement =>
		getByDataRole(container, DataRoles.Month.Selector.Input) as HTMLSelectElement;
	const yearInputOf = (container: HTMLElement): HTMLInputElement | HTMLSelectElement =>
		getByDataRole(container, DataRoles.Year.Selector.Input) as HTMLInputElement | HTMLSelectElement;
	// Days 10–28 are unique within the rendered grid (outside days only repeat 1–9 and 27–28 of the neighbours).
	const dayButtonOf = (container: HTMLElement, day: number): HTMLButtonElement =>
		getByText(container, String(day)) as HTMLButtonElement;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(utc(2022, 2, 2));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("rendering", () => {
		test("applies the date-picker data-role to the calendar root", () => {
			const { container } = render(<DatePicker />);

			const picker = getByDataRole(container, DataRoles.DatePicker);
			expect(picker).toHaveClass(baseClassName);
			expect(queryByDataRole(container, DataRoles.DatePicker.Root)).toBeNull();
		});

		test("wraps the calendar in a focusable root with a footer in range mode", () => {
			const { container } = render(<DatePicker mode="range" footer={{ acceptLabel: "OK", clearLabel: "Clear" }} />);

			const root = getByDataRole(container, DataRoles.DatePicker.Root);
			expect(root).toHaveAttribute("tabindex", "-1");
			expect(getByDataRole(root, DataRoles.DatePicker)).toBeInTheDocument();
			expect(getByDataRole(root, DataRoles.DatePicker.Footer)).toBeInTheDocument();
			expect(getByRole(root, "button", { name: "OK" })).toBeInTheDocument();
		});

		test("shows six fixed weeks with empty outside cells by default", () => {
			const { container } = render(<DatePicker />);

			expect(getAllByDataRole(container, DataRoles.DatePicker.Week)).toHaveLength(6);
			expect(getAllByDataRole(container, DataRoles.DatePicker.DayButton)).toHaveLength(31);
		});

		test("showOutsideDays renders the outside days as buttons", () => {
			const { container } = render(<DatePicker showOutsideDays />);

			expect(getAllByDataRole(container, DataRoles.DatePicker.Week)).toHaveLength(6);
			expect(getAllByDataRole(container, DataRoles.DatePicker.DayButton)).toHaveLength(42);
		});

		test("fixedWeeks={false} renders only the weeks of the month without outside day buttons", () => {
			const { container } = render(<DatePicker fixedWeeks={false} />);

			expect(getAllByDataRole(container, DataRoles.DatePicker.Week)).toHaveLength(5);
			expect(getAllByDataRole(container, DataRoles.DatePicker.DayButton)).toHaveLength(31);
		});

		test("opens the month of defaultMonth", () => {
			const { container } = render(<DatePicker defaultMonth={utc(2021, 10, 1)} />);

			expect(monthSelectOf(container).value).toBe("10");
			expect(yearInputOf(container).value).toBe("2021");
		});

		test("opens the month of the selected range start when neither value nor month is given", () => {
			const { container } = render(<DatePicker selected={{ from: utc(2021, 5, 10), to: utc(2021, 5, 12) }} />);

			expect(monthSelectOf(container).value).toBe("5");
			expect(yearInputOf(container).value).toBe("2021");
			expect(dayButtonOf(container, 10).parentElement).toHaveClass(`${baseClassName}-Day--start`);
			expect(dayButtonOf(container, 12).parentElement).toHaveClass(`${baseClassName}-Day--end`);
		});

		test("clamps the initial month into yearRange when no value is given", () => {
			const { container } = render(<DatePicker yearRange={{ start: 2000, end: 2010 }} yearSelectorVariant="select" />);

			expect(yearInputOf(container).value).toBe("2000");
			expect(monthSelectOf(container).value).toBe("2");
		});

		test("marks the value as selected with aria-selected on the day cell", () => {
			const { container } = render(<DatePicker value={utc(2022, 2, 12)} />);

			expect(dayButtonOf(container, 12).parentElement).toHaveAttribute("aria-selected", "true");
			expect(dayButtonOf(container, 13).parentElement).not.toHaveAttribute("aria-selected", "true");
		});

		test("disables matching days", () => {
			const { container } = render(<DatePicker disabled={new Date(2022, 2, 15)} />);

			expect(dayButtonOf(container, 15)).toBeDisabled();
			expect(dayButtonOf(container, 15).parentElement).toHaveClass(`${baseClassName}-Day--disabled`);
			expect(dayButtonOf(container, 16)).toBeEnabled();
		});
	});

	describe("selection callbacks", () => {
		test("onChange receives the clicked day as a UTC midnight date", async () => {
			const onChange = vi.fn();
			const onDayClick = vi.fn();
			const { container } = render(<DatePicker onChange={onChange} onDayClick={onDayClick} />);

			await userEvent.click(dayButtonOf(container, 15));

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(utc(2022, 2, 15));
			expect(onDayClick).toHaveBeenCalledTimes(1);
			expect((onDayClick.mock.calls[0][0] as Date).getDate()).toBe(15);
			expect(onDayClick.mock.calls[0][1]).toEqual(expect.objectContaining({ disabled: false }));
		});

		test("clicking a day does not change the selection until the value prop follows", async () => {
			const onChange = vi.fn();
			const { container, rerender } = render(<DatePicker value={utc(2022, 2, 12)} onChange={onChange} />);

			await userEvent.click(dayButtonOf(container, 15));

			expect(onChange).toHaveBeenCalledWith(utc(2022, 2, 15));
			expect(dayButtonOf(container, 12).parentElement).toHaveAttribute("aria-selected", "true");
			expect(dayButtonOf(container, 15).parentElement).not.toHaveAttribute("aria-selected", "true");

			rerender(<DatePicker value={utc(2022, 2, 15)} onChange={onChange} />);

			expect(dayButtonOf(container, 12).parentElement).not.toHaveAttribute("aria-selected", "true");
			expect(dayButtonOf(container, 15).parentElement).toHaveAttribute("aria-selected", "true");
		});

		test("calls the latest onChange after a rerender", async () => {
			const first = vi.fn();
			const second = vi.fn();
			const { container, rerender } = render(<DatePicker onChange={first} />);

			rerender(<DatePicker onChange={second} />);
			await userEvent.click(dayButtonOf(container, 15));

			expect(first).not.toHaveBeenCalled();
			expect(second).toHaveBeenCalledWith(utc(2022, 2, 15));
		});

		test("onMonthChange receives the first day of the new month as a UTC date", async () => {
			const onMonthChange = vi.fn();
			const { container } = render(<DatePicker onMonthChange={onMonthChange} />);

			await userEvent.click(getByDataRole(container, DataRoles.DatePicker.NavBar.Next));

			expect(onMonthChange).toHaveBeenCalledTimes(1);
			expect(onMonthChange).toHaveBeenCalledWith(utc(2022, 3, 1));
			expect(monthSelectOf(container).value).toBe("3");

			await userEvent.click(getByDataRole(container, `${DataRoles.DatePicker.NavBar}-prev`));

			expect(onMonthChange).toHaveBeenCalledTimes(2);
			expect(onMonthChange).toHaveBeenLastCalledWith(utc(2022, 2, 1));
			expect(monthSelectOf(container).value).toBe("2");
		});

		test("choosing a month in the header navigates and fires onMonthChange", async () => {
			const onMonthChange = vi.fn();
			const { container } = render(<DatePicker onMonthChange={onMonthChange} />);

			await userEvent.selectOptions(monthSelectOf(container), "4");

			expect(monthSelectOf(container).value).toBe("4");
			expect(onMonthChange).toHaveBeenCalledTimes(1);
			expect(onMonthChange).toHaveBeenCalledWith(utc(2022, 4, 1));
		});

		test("does not fire onChange for a disabled day", () => {
			const onChange = vi.fn();
			const onDayClick = vi.fn();
			const { container } = render(
				<DatePicker disabled={new Date(2022, 2, 15)} onChange={onChange} onDayClick={onDayClick} />
			);

			fireEvent.click(dayButtonOf(container, 15));

			expect(onChange).not.toHaveBeenCalled();
			expect(onDayClick).not.toHaveBeenCalled();
		});
	});

	describe("keyboard", () => {
		test("Enter on a focused day selects it without a native click", async () => {
			const onChange = vi.fn();
			const onDayClick = vi.fn();
			const onDayKeyDown = vi.fn();
			const { container } = render(
				<DatePicker onChange={onChange} onDayClick={onDayClick} onDayKeyDown={onDayKeyDown} />
			);

			dayButtonOf(container, 15).focus();
			await userEvent.keyboard("{Enter}");

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(utc(2022, 2, 15));
			expect(onDayClick).not.toHaveBeenCalled();
			expect(onDayKeyDown).toHaveBeenCalledTimes(1);
			expect((onDayKeyDown.mock.calls[0][2] as KeyboardEvent).key).toBe("Enter");
		});

		test("arrow keys move the focus between days and are forwarded to onDayKeyDown", async () => {
			const onChange = vi.fn();
			const onDayKeyDown = vi.fn();
			const { container } = render(<DatePicker onChange={onChange} onDayKeyDown={onDayKeyDown} />);

			dayButtonOf(container, 15).focus();
			await userEvent.keyboard("{ArrowRight}");
			expect(dayButtonOf(container, 16)).toHaveFocus();

			await userEvent.keyboard("{ArrowDown}");
			expect(dayButtonOf(container, 23)).toHaveFocus();

			await userEvent.keyboard("{ArrowLeft}");
			expect(dayButtonOf(container, 22)).toHaveFocus();

			expect(onDayKeyDown).toHaveBeenCalledTimes(3);
			expect(onChange).not.toHaveBeenCalled();
		});

		test("Enter on a disabled day does nothing", async () => {
			const onChange = vi.fn();
			const { container } = render(<DatePicker disabled={new Date(2022, 2, 16)} onChange={onChange} />);

			dayButtonOf(container, 15).focus();
			await userEvent.keyboard("{ArrowRight}");

			// Focus skips the disabled day; the disabled button itself never receives Enter
			expect(dayButtonOf(container, 16)).not.toHaveFocus();
			await userEvent.keyboard("{Enter}");
			expect(onChange).not.toHaveBeenCalledWith(utc(2022, 2, 16));
		});
	});

	describe("prop updates", () => {
		test("rerender with a new value moves the selection", () => {
			const { container, rerender } = render(<DatePicker value={utc(2022, 2, 12)} />);
			expect(dayButtonOf(container, 12).parentElement).toHaveAttribute("aria-selected", "true");

			rerender(<DatePicker value={utc(2022, 2, 20)} />);

			expect(dayButtonOf(container, 12).parentElement).not.toHaveAttribute("aria-selected", "true");
			expect(dayButtonOf(container, 20).parentElement).toHaveAttribute("aria-selected", "true");
			expect(dayButtonOf(container, 20)).toHaveAttribute("aria-label", expect.stringContaining("selected"));
		});

		test("rerender with a value in another month keeps the displayed month", () => {
			const { container, rerender } = render(<DatePicker value={utc(2022, 2, 12)} />);

			rerender(<DatePicker value={utc(2022, 5, 12)} />);

			expect(monthSelectOf(container).value).toBe("2");
			expect(dayButtonOf(container, 12).parentElement).not.toHaveAttribute("aria-selected", "true");
		});

		test("rerender with a new month prop navigates the calendar", async () => {
			const { container, rerender } = render(<DatePicker month={utc(2022, 2, 1)} />);
			expect(monthSelectOf(container).value).toBe("2");

			rerender(<DatePicker month={utc(2022, 5, 1)} />);

			expect(monthSelectOf(container).value).toBe("5");
			expect(yearInputOf(container).value).toBe("2022");
		});

		test("rerender with a defined month prop re-applies it after the user navigated", async () => {
			const { container, rerender } = render(<DatePicker month={utc(2022, 2, 1)} />);

			await userEvent.click(getByDataRole(container, DataRoles.DatePicker.NavBar.Next));
			expect(monthSelectOf(container).value).toBe("3");

			rerender(<DatePicker month={utc(2022, 2, 1)} />);

			expect(monthSelectOf(container).value).toBe("2");
		});

		test("rerender without a month prop keeps the month the user navigated to", async () => {
			const { container, rerender } = render(<DatePicker onChange={vi.fn()} />);

			await userEvent.click(getByDataRole(container, DataRoles.DatePicker.NavBar.Next));
			expect(monthSelectOf(container).value).toBe("3");

			rerender(<DatePicker onChange={vi.fn()} />);

			expect(monthSelectOf(container).value).toBe("3");
		});

		test("rerender with a new selected range updates the highlight and the accepted range", async () => {
			const onAccept = vi.fn();
			const footer = { acceptLabel: "OK", onAccept };
			const { container, rerender } = render(
				<DatePicker selected={{ from: utc(2022, 2, 10), to: utc(2022, 2, 12) }} footer={footer} />
			);
			expect(dayButtonOf(container, 10).parentElement).toHaveClass(`${baseClassName}-Day--start`);

			rerender(<DatePicker selected={{ from: utc(2022, 2, 20), to: utc(2022, 2, 22) }} footer={footer} />);

			expect(dayButtonOf(container, 10).parentElement).not.toHaveClass(`${baseClassName}-Day--start`);
			expect(dayButtonOf(container, 20).parentElement).toHaveClass(`${baseClassName}-Day--start`);
			expect(dayButtonOf(container, 22).parentElement).toHaveClass(`${baseClassName}-Day--end`);

			await userEvent.click(getByRole(container, "button", { name: "OK" }));

			expect(onAccept).toHaveBeenCalledTimes(1);
			expect(onAccept).toHaveBeenCalledWith({ from: utc(2022, 2, 20), to: utc(2022, 2, 22) });
		});

		test("rerender with an equal selected range keeps the highlight", () => {
			const { container, rerender } = render(
				<DatePicker selected={{ from: utc(2022, 2, 10), to: utc(2022, 2, 12) }} footer={{ acceptLabel: "OK" }} />
			);

			rerender(
				<DatePicker selected={{ from: utc(2022, 2, 10), to: utc(2022, 2, 12) }} footer={{ acceptLabel: "OK" }} />
			);

			expect(dayButtonOf(container, 10).parentElement).toHaveClass(`${baseClassName}-Day--start`);
			expect(dayButtonOf(container, 12).parentElement).toHaveClass(`${baseClassName}-Day--end`);
			expect(getByRole(container, "button", { name: "OK" })).toBeEnabled();
		});

		test("accept button is disabled while the selected range is incomplete", () => {
			const { container, rerender } = render(
				<DatePicker selected={{ from: utc(2022, 2, 10), to: undefined }} footer={{ acceptLabel: "OK" }} />
			);
			expect(getByRole(container, "button", { name: "OK" })).toBeDisabled();

			rerender(
				<DatePicker selected={{ from: utc(2022, 2, 10), to: utc(2022, 2, 14) }} footer={{ acceptLabel: "OK" }} />
			);

			expect(getByRole(container, "button", { name: "OK" })).toBeEnabled();
		});

		test("rerender with another locale re-labels the months", () => {
			const { container, rerender } = render(
				<DateTimeContext.Provider value={{}}>
					<DatePicker />
				</DateTimeContext.Provider>
			);
			expect(getByRole(container, "option", { name: "March" })).toBeInTheDocument();

			rerender(
				<DateTimeContext.Provider value={{ locale: de }}>
					<DatePicker />
				</DateTimeContext.Provider>
			);

			expect(getByRole(container, "option", { name: "März" })).toBeInTheDocument();
		});

		test("unmounting removes the calendar", () => {
			const { container, unmount } = render(<DatePicker mode="range" footer={{ acceptLabel: "OK" }} />);
			expect(getByDataRole(container, DataRoles.DatePicker.Root)).toBeInTheDocument();

			unmount();

			expect(queryByDataRole(document.body, DataRoles.DatePicker.Root)).toBeNull();
			expect(queryByDataRole(document.body, DataRoles.DatePicker)).toBeNull();
		});
	});

	describe("range mode", () => {
		test("selecting two days reports the UTC range and accepts it", async () => {
			const onDateRangeChange = vi.fn();
			const onAccept = vi.fn();
			const { container } = render(
				<DatePicker mode="range" onDateRangeChange={onDateRangeChange} footer={{ acceptLabel: "OK", onAccept }} />
			);
			const accept = getByRole(container, "button", { name: "OK" });

			await userEvent.click(dayButtonOf(container, 10));

			expect(onDateRangeChange).toHaveBeenCalledTimes(1);
			expect(onDateRangeChange).toHaveBeenLastCalledWith({ from: utc(2022, 2, 10), to: utc(2022, 2, 10) });
			expect(accept).toBeEnabled();

			await userEvent.click(dayButtonOf(container, 12));

			expect(onDateRangeChange).toHaveBeenCalledTimes(2);
			expect(onDateRangeChange).toHaveBeenLastCalledWith({ from: utc(2022, 2, 10), to: utc(2022, 2, 12) });
			expect(accept).toBeEnabled();

			await userEvent.click(accept);

			expect(onAccept).toHaveBeenCalledTimes(1);
			expect(onAccept).toHaveBeenCalledWith({ from: utc(2022, 2, 10), to: utc(2022, 2, 12) });
		});

		test("Enter on a focused day extends the range", async () => {
			const onDateRangeChange = vi.fn();
			const { container } = render(<DatePicker mode="range" onDateRangeChange={onDateRangeChange} />);

			dayButtonOf(container, 10).focus();
			await userEvent.keyboard("{Enter}");
			await userEvent.keyboard("{ArrowRight}{ArrowRight}{Enter}");

			expect(onDateRangeChange).toHaveBeenCalledTimes(2);
			expect(onDateRangeChange).toHaveBeenLastCalledWith({ from: utc(2022, 2, 10), to: utc(2022, 2, 12) });
		});

		test("clear button appears with a range start and resets the range", async () => {
			const onClear = vi.fn();
			const onMonthChange = vi.fn();
			const { container } = render(
				<DatePicker
					mode="range"
					footer={{ acceptLabel: "OK", clearLabel: "Clear", onClear }}
					onMonthChange={onMonthChange}
				/>
			);
			expect(queryByRole(container, "button", { name: "Clear" })).toBeNull();

			await userEvent.click(dayButtonOf(container, 10));

			await userEvent.click(getByRole(container, "button", { name: "Clear" }));

			expect(onClear).toHaveBeenCalledTimes(1);
			expect(onMonthChange).toHaveBeenCalledTimes(1);
			expect(onMonthChange).toHaveBeenCalledWith(utc(2022, 2, 2));
			expect(queryByRole(container, "button", { name: "Clear" })).toBeNull();
			expect(monthSelectOf(container).value).toBe("2");
		});

		test("clear button appears after navigating away from defaultMonth and returns to it", async () => {
			const onMonthChange = vi.fn();
			const { container } = render(
				<DatePicker
					mode="range"
					defaultMonth={utc(2022, 0, 1)}
					footer={{ acceptLabel: "OK", clearLabel: "Clear" }}
					onMonthChange={onMonthChange}
				/>
			);
			expect(monthSelectOf(container).value).toBe("0");
			expect(queryByRole(container, "button", { name: "Clear" })).toBeNull();

			await userEvent.click(getByDataRole(container, DataRoles.DatePicker.NavBar.Next));
			expect(monthSelectOf(container).value).toBe("1");
			expect(getByRole(container, "button", { name: "Clear" })).toBeInTheDocument();

			await userEvent.click(getByRole(container, "button", { name: "Clear" }));

			expect(monthSelectOf(container).value).toBe("0");
			expect(onMonthChange).toHaveBeenLastCalledWith(utc(2022, 0, 1));
			expect(queryByRole(container, "button", { name: "Clear" })).toBeNull();
		});

		test("custom footer replaces the default footer and its callbacks", async () => {
			const onAccept = vi.fn();
			const { container } = render(
				<DatePicker
					mode="range"
					footer={{ acceptLabel: "OK", onAccept, customFooter: <p data-role="custom-footer">Custom</p> }}
				/>
			);

			expect(getByDataRole(container, "custom-footer")).toHaveTextContent("Custom");
			expect(queryByRole(container, "button", { name: "OK" })).toBeNull();
			expect(queryByDataRole(container, DataRoles.DatePicker.Footer)).toBeNull();
		});

		test("wrapperRef receives the range root element", () => {
			const wrapperRef = vi.fn();
			const { container } = render(<DatePicker mode="range" wrapperRef={wrapperRef} />);

			expect(wrapperRef).toHaveBeenCalledWith(getByDataRole(container, DataRoles.DatePicker.Root));
		});
	});
});
