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

import { add } from "date-fns";
import { de } from "date-fns/locale";
import { fireEvent, getAllByDataRole, getByDataRole, getByRole, getByText, render, screen } from "test-utils";
import { getByLabelText } from "@testing-library/dom";
import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";
import { userEvent } from "vitest/browser";

import { DateTimeContext } from "../../common/main/date-time/date-time-context.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { DatePicker } from "../main/date-picker.view.js";
import { DateInput } from "../main/date-input.view.js";

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

		expect(container).toHaveTextContent("Invalid year");
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
