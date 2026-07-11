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

import type { DateRange } from "react-day-picker";
import {
	fireEvent,
	getAllByDataRole,
	getByDataRole,
	getByRole,
	queryByDataRole,
	queryByRole,
	render
} from "test-utils";
import { describe, vi, expect, test, beforeEach, afterEach } from "vitest";
import { userEvent } from "vitest/browser";

import { DateTimeUtils } from "../../common/main/date-time/date-utils.js";
import { provider } from "../../common/main/device-detector.js";
import { Counter } from "../../counter/main/counter.view.js";
import { TextAffix } from "../../input/text-field/text-field.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { DateInput } from "../main/date-input.view.js";

const datePickerClassName = "DayPicker";
const defaultDateFormat = "MM/DD/YYYY";

const stringOfRange = (text: string): string[] => {
	return text.split(" - ");
};

const defaultDateFormatter = (date: Date): string => DateTimeUtils.formatDateTime(date, undefined, defaultDateFormat);

const defaultDateConverter = (dateString: string): Date | undefined => {
	const parsedDate = DateTimeUtils.parseDateTimeUTC(dateString, defaultDateFormat);

	return parsedDate;
};

const defaultDateRangeConverter = (dateString: string): DateRange | undefined => {
	if (!dateString) {
		return undefined;
	}

	const [from, to] = stringOfRange(dateString);

	if (!from || !to) {
		return undefined;
	}

	const parsedFrom = DateTimeUtils.parseDateTimeUTC(from, defaultDateFormat);
	const parsedTo = DateTimeUtils.parseDateTimeUTC(to, defaultDateFormat);

	return { from: parsedFrom, to: parsedTo };
};

describe("com.mgmtp.a12.widgets.date-input", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(Date.UTC(2022, 2, 2).valueOf()));
		vi.spyOn(Math, "random").mockImplementation(() => 0.3);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test("render date input with some TextFieldProps", async () => {
		const { container } = render(
			<DateInput
				id="test-date-input"
				textAlignment="right"
				prefixes={<Counter id="counter" value={10} overflowCount={9} />}
				suffixes={<TextAffix id="mmoll">mmol/l</TextAffix>}
				addonAfter={<>addonAfter</>}
				addonBefore={<>addonBefore</>}
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateConverter}
				className="required-classname"
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default date input", async () => {
		const { container } = render(
			<DateInput id="test-date-input" dateFormatter={defaultDateFormatter} dateConverter={defaultDateConverter} />
		);
		expect(container.firstChild).toMatchSnapshot();

		const pickerTriggerButton = getByDataRole(container, DataRoles.Button);
		fireEvent.click(pickerTriggerButton);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(getByDataRole(portal, DataRoles.DatePicker)).toBeTruthy();
	});

	test("render disabled date input", () => {
		const { container } = render(
			<DateInput
				id="test-date-input"
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateConverter}
				disabled
			/>
		);
		const pickerBtn = getByDataRole(container, DataRoles.Button) as HTMLButtonElement;

		expect(pickerBtn.disabled).toBe(true);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly date input", () => {
		const { container } = render(
			<DateInput
				id="test-date-input"
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateConverter}
				readonly
			/>
		);
		const pickerBtn = getByDataRole(container, DataRoles.Button) as HTMLButtonElement;

		expect(pickerBtn.disabled).toBe(true);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render date input with placeholder and label", () => {
		const { container } = render(
			<DateInput
				id="test-date-input"
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateConverter}
				placeholder="test placeholder"
				label="test label"
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render date input with hidden picker button", () => {
		const { container } = render(
			<DateInput
				id="test-date-input"
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateConverter}
				hidePickerButton
			/>
		);
		const button = queryByDataRole(container, "button");
		expect(button).toBeFalsy();
	});

	test("render date input with custom picker button", () => {
		const { container } = render(
			<DateInput
				id="test-date-input"
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateConverter}
				customPickerButtonIcon="test custom icon"
			/>
		);
		const button = getByDataRole(container, DataRoles.Button);
		expect(button.textContent).toBe("test custom icon");
	});

	test("render date input with inputProps", () => {
		const { container } = render(
			<DateInput
				id="test-date-input"
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateConverter}
				inputProps={{ inputMode: "numeric" }}
			/>
		);
		const inputElement = getByDataRole(container, DataRoles.TextField.Input);

		expect(inputElement.getAttribute("inputmode")).toEqual("numeric");
	});

	test("should trigger onInputChange and onSelectedDayChange on input blur", async () => {
		const onInputChangeSpy = vi.fn();
		const onSelectedDayChangeSpy = vi.fn();
		const { container } = render(
			<DateInput
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateConverter}
				onInputChange={onInputChangeSpy}
				onSelectedDayChange={onSelectedDayChangeSpy}
				datePickerProps={{ disabled: [{ before: new Date() }, { dayOfWeek: [0, 6] }] }}
			/>
		);

		const inputElement = getByDataRole(container, DataRoles.TextField.Input);
		fireEvent.click(inputElement);
		fireEvent.change(inputElement, { target: { value: "03/03/2022" } });
		fireEvent.blur(inputElement);
		expect(onInputChangeSpy).toHaveBeenCalledWith("03/03/2022");
		expect(onSelectedDayChangeSpy).toHaveBeenCalledWith(new Date(Date.UTC(2022, 2, 3)));

		const pickerTriggerButton = getByDataRole(container, DataRoles.Button);
		fireEvent.click(pickerTriggerButton);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(getByDataRole(portal, DataRoles.DatePicker)).toBeTruthy();
		const selectedDay = container.querySelector(`.${datePickerClassName}-Day--selected`);
		expect(selectedDay?.getAttribute("aria-selected")).toEqual("true");
		expect(selectedDay?.firstElementChild?.getAttribute("aria-label")).toEqual("Thursday, March 3rd, 2022, selected");
	});

	test("should not trigger onInputChange and onSelectedDayChange when click on disabled day", async () => {
		const onInputChangeSpy = vi.fn();
		const onSelectedDayChangeSpy = vi.fn();
		const { container } = render(
			<DateInput
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateConverter}
				onInputChange={onInputChangeSpy}
				onSelectedDayChange={onSelectedDayChangeSpy}
				datePickerProps={{ disabled: [{ before: new Date() }, { dayOfWeek: [0, 6] }] }}
			/>
		);

		const pickerTriggerButton = getByDataRole(container, DataRoles.Button);
		fireEvent.click(pickerTriggerButton);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(getByDataRole(portal, DataRoles.DatePicker)).toBeTruthy();

		const dayElements = container.querySelectorAll(
			`.${datePickerClassName}-Day:not(.${datePickerClassName}-Day--outside)`
		);

		fireEvent.click(dayElements[0]);
		expect(onInputChangeSpy).not.toBeCalled();
		expect(onSelectedDayChangeSpy).not.toBeCalled();
	});

	test("should trigger onInputChange and onSelectedDayChange when click on current selected day", async () => {
		const onInputChangeSpy = vi.fn();
		const onSelectedDayChangeSpy = vi.fn();
		const { container } = render(
			<DateInput
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateConverter}
				onInputChange={onInputChangeSpy}
				onSelectedDayChange={onSelectedDayChangeSpy}
				datePickerProps={{ disabled: [{ before: new Date() }, { dayOfWeek: [0, 6] }] }}
			/>
		);

		const pickerTriggerButton = getByDataRole(container, DataRoles.Button);
		fireEvent.click(pickerTriggerButton);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(getByDataRole(portal, DataRoles.DatePicker)).toBeTruthy();

		const dayElements = container.querySelectorAll(
			`.${datePickerClassName}-Day:not(.${datePickerClassName}-Day--outside)`
		);

		fireEvent.click(dayElements[1]);
		expect(onInputChangeSpy).toHaveBeenCalledWith("");
		expect(onSelectedDayChangeSpy).toHaveBeenCalledWith(new Date(Date.UTC(2022, 2, 2)));
	});

	test("should trigger onInputChange and onSelectedDayChange when click on non-disabled day", async () => {
		const onInputChangeSpy = vi.fn();
		const onSelectedDayChangeSpy = vi.fn();
		const { container } = render(
			<DateInput
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateConverter}
				onInputChange={onInputChangeSpy}
				onSelectedDayChange={onSelectedDayChangeSpy}
				datePickerProps={{ disabled: [{ before: new Date() }, { dayOfWeek: [0, 6] }] }}
			/>
		);

		const pickerTriggerButton = getByDataRole(container, DataRoles.Button);
		fireEvent.click(pickerTriggerButton);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(getByDataRole(portal, DataRoles.DatePicker)).toBeTruthy();

		const dayElements = container.querySelectorAll(
			`.${datePickerClassName}-Day:not(.${datePickerClassName}-Day--outside)`
		);

		fireEvent.click(dayElements[2]);
		expect(onInputChangeSpy).toHaveBeenCalledWith("");
		expect(onSelectedDayChangeSpy).toHaveBeenCalledWith(new Date(Date.UTC(2022, 2, 3)));
		fireEvent.click(pickerTriggerButton);
		const selectedDay = container.querySelector(`.${datePickerClassName}-Day--selected`);
		expect(selectedDay?.firstElementChild?.getAttribute("aria-label")).toEqual("Thursday, March 3rd, 2022, selected");
	});

	test("should show error on wrong input value", () => {
		const onInputChangeSpy = vi.fn();

		const errorMessage = "test error message";

		const { container } = render(
			<DateInput
				useRangePicker
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateRangeConverter}
				datePickerProps={{
					mode: "range",
					disabled: [{ dayOfWeek: [0, 6] }],
					footer: { acceptLabel: "OK", clearLabel: "Clear" }
				}}
				datePickerDialogProps={{ title: "Select a Date Range", okLabel: "OK", clearLabel: "Clear" }}
				errorMessage={errorMessage}
				placeholder={`${defaultDateFormat} - ${defaultDateFormat}`}
				onInputChange={onInputChangeSpy}
			/>
		);

		const inputElement = getByDataRole(container, DataRoles.TextField.Input);

		fireEvent.click(inputElement);
		fireEvent.change(inputElement, { target: { value: "03/02/2022" } });
		fireEvent.blur(inputElement);
		expect(getByDataRole(container, DataRoles.Error.Text).firstChild?.nodeValue).toEqual(errorMessage);
		expect(onInputChangeSpy).toHaveBeenCalledWith("03/02/2022");
	});

	test("should change date-range picker's state when input value is correct", () => {
		const onInputChangeSpy = vi.fn();

		const { container } = render(
			<DateInput
				useRangePicker
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateRangeConverter}
				datePickerProps={{
					disabled: [{ dayOfWeek: [0, 6] }],
					footer: { acceptLabel: "OK", clearLabel: "Clear" }
				}}
				datePickerDialogProps={{ title: "Select a Date Range", okLabel: "OK", clearLabel: "Clear" }}
				placeholder={`${defaultDateFormat} - ${defaultDateFormat}`}
				onInputChange={onInputChangeSpy}
			/>
		);

		const inputElement = getByDataRole(container, DataRoles.TextField.Input);

		fireEvent.click(inputElement);
		fireEvent.change(inputElement, { target: { value: "03/02/2022 - 03/04/2022" } });
		fireEvent.blur(inputElement);
		expect(onInputChangeSpy).toHaveBeenCalledWith("03/02/2022 - 03/04/2022");
	});

	test("should not trigger onInputChange if changes are made inside picker", async () => {
		const onInputChangeSpy = vi.fn();

		const { container } = render(
			<DateInput
				useRangePicker
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateRangeConverter}
				datePickerProps={{
					disabled: [{ dayOfWeek: [0, 6] }],
					footer: { acceptLabel: "OK", clearLabel: "Clear" }
				}}
				datePickerDialogProps={{ title: "Select a Date Range", okLabel: "OK", clearLabel: "Clear" }}
				placeholder={`${defaultDateFormat} - ${defaultDateFormat}`}
				onInputChange={onInputChangeSpy}
			/>
		);

		const pickerTriggerButton = getByDataRole(container, DataRoles.Button);
		fireEvent.click(pickerTriggerButton);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(getByDataRole(portal, DataRoles.DatePicker)).toBeTruthy();

		const dayElements = container.querySelectorAll(
			`.${datePickerClassName}-Day:not(.${datePickerClassName}-Day--outside)`
		);
		//should not trigger onInputChange if changes are made inside picker
		fireEvent.click(dayElements[0]);
		expect(onInputChangeSpy).not.toBeCalled();

		//should trigger onInputChange when picker is closed by Accept button
		const acceptAction = getAllByDataRole(container, DataRoles.DatePicker.Footer.Action)[1];
		fireEvent.click(getByDataRole(acceptAction, DataRoles.Button));
		expect(onInputChangeSpy).toBeCalled();
	});

	test("changing date using valueChangeHandler should trigger onSelectedDayChange", () => {
		const currentDate = new Date();
		const tomorrowDate = new Date(currentDate.setDate(currentDate.getDate() + 1));

		let valueChangeHandlerMock: (value: Date | DateRange | undefined) => void = vi.fn();
		const onSelectedDayChangeSpy = vi.fn();
		const onInputValidationErrorSpy = vi.fn();

		render(
			<DateInput
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateConverter}
				onSelectedDayChange={onSelectedDayChangeSpy}
				valueChangeHandler={(handler) => {
					valueChangeHandlerMock = handler;
				}}
				datePickerProps={{
					disabled: [{ dayOfWeek: [0, 6] }]
				}}
				onInputValidationError={onInputValidationErrorSpy}
			/>
		);

		valueChangeHandlerMock(tomorrowDate);
		expect(onSelectedDayChangeSpy).toHaveBeenCalledWith(tomorrowDate);

		valueChangeHandlerMock(new Date(Date.UTC(2022, 2, 5).valueOf()));
		expect(onInputValidationErrorSpy).toBeCalled();

		valueChangeHandlerMock(undefined);
		expect(onSelectedDayChangeSpy).toHaveBeenCalledWith(undefined);
	});

	test("changing date-range using valueChangeHandler should trigger datePickerProps's footer onAccept", () => {
		const currentDate = new Date();
		const preDefinedRange: DateRange = {
			from: new Date(currentDate.setDate(currentDate.getDate() + 1)),
			to: new Date(currentDate.setDate(currentDate.getDate() + 5))
		};

		const preDefinedInvalidRange: DateRange = {
			from: new Date(Date.UTC(2022, 2, 5).valueOf()),
			to: new Date(currentDate.setDate(currentDate.getDate() + 5))
		};

		let valueChangeHandlerMock: (value: Date | DateRange | undefined) => void = vi.fn();
		const onInputValidationErrorSpy = vi.fn();
		const onAcceptSpy = vi.fn();

		render(
			<DateInput
				useRangePicker
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateRangeConverter}
				datePickerProps={{
					disabled: [{ dayOfWeek: [0, 6] }],
					footer: { acceptLabel: "OK", clearLabel: "Clear", onAccept: onAcceptSpy }
				}}
				valueChangeHandler={(handler) => {
					valueChangeHandlerMock = handler;
				}}
				onInputValidationError={onInputValidationErrorSpy}
			/>
		);

		valueChangeHandlerMock(preDefinedRange);
		expect(onAcceptSpy).toHaveBeenCalledWith(preDefinedRange);

		valueChangeHandlerMock(preDefinedInvalidRange);
		expect(onInputValidationErrorSpy).toBeCalled();

		valueChangeHandlerMock(undefined);
		expect(onAcceptSpy).toHaveBeenCalledWith(undefined);
	});

	test("Date Input with `datePickerProps` property", async () => {
		const ariaLabel = "Custom desktop date picker";
		const { getByDataRole } = render(
			<DateInput
				dateFormatter={defaultDateFormatter}
				dateConverter={defaultDateConverter}
				datePickerProps={{
					"aria-label": ariaLabel
				}}
			/>
		);

		const button = getByDataRole(DataRoles.Button);
		await userEvent.click(button);

		const datePicker = getByDataRole(DataRoles.DatePicker);
		expect(datePicker.getAttribute("aria-label")).toBe(ariaLabel);
	});

	describe("Touch Device", () => {
		test("render default date input", async () => {
			const deviceDetectorStub = vi.spyOn(provider, "hasTouch").mockReturnValue(true);

			const { container } = render(
				<DateInput id="test-date-input" dateFormatter={defaultDateFormatter} dateConverter={defaultDateConverter} />
			);

			const pickerTriggerButton = getByDataRole(container, DataRoles.Button);
			fireEvent.click(pickerTriggerButton);

			const modal = getByDataRole(container, DataRoles.Modal.Overlay);
			expect(modal).toBeTruthy();
			expect(container).toMatchSnapshot();
			deviceDetectorStub.mockRestore();
		});

		test("should trigger onInputChange and onSelectedDayChange when click on non-disabled day", async () => {
			const deviceDetectorStub = vi.spyOn(provider, "hasTouch").mockReturnValue(true);

			const onInputChangeSpy = vi.fn();
			const onSelectedDayChangeSpy = vi.fn();

			const { container } = render(
				<DateInput
					dateFormatter={defaultDateFormatter}
					dateConverter={defaultDateConverter}
					onInputChange={onInputChangeSpy}
					onSelectedDayChange={onSelectedDayChangeSpy}
					datePickerProps={{ disabled: [{ before: new Date() }, { dayOfWeek: [0, 6] }] }}
					datePickerDialogProps={{ okLabel: "OK" }}
				/>
			);

			const pickerTriggerButton = getByDataRole(container, DataRoles.Button);
			await userEvent.click(pickerTriggerButton);

			const dialog = getByDataRole(container, DataRoles.DatePicker.Dialog);
			expect(dialog).toBeTruthy();

			const dayElements = container.querySelectorAll(
				`.${datePickerClassName}-Day:not(.${datePickerClassName}-Day--outside)`
			);

			await userEvent.click(dayElements[2]);
			const okButton = getByRole(container, "button", { name: "OK" });

			await userEvent.click(okButton);

			expect(onInputChangeSpy).toHaveBeenCalledWith("");
			expect(onSelectedDayChangeSpy).toHaveBeenCalledWith(new Date(Date.UTC(2022, 2, 3)));
			deviceDetectorStub.mockRestore();
		});

		test("handle submit date range", async () => {
			const deviceDetectorStub = vi.spyOn(provider, "hasTouch").mockReturnValue(true);

			const onInputChangeSpy = vi.fn();

			const { container } = render(
				<DateInput
					useRangePicker
					dateFormatter={defaultDateFormatter}
					dateConverter={defaultDateRangeConverter}
					datePickerProps={{
						disabled: [{ dayOfWeek: [0, 6] }],
						footer: { acceptLabel: "OK", clearLabel: "Clear" }
					}}
					datePickerDialogProps={{ title: "Select a Date Range", okLabel: "OK", clearLabel: "Clear" }}
					placeholder={`${defaultDateFormat} - ${defaultDateFormat}`}
					onInputChange={onInputChangeSpy}
				/>
			);

			const pickerTriggerButton = getByDataRole(container, DataRoles.Button);
			await userEvent.click(pickerTriggerButton);

			const dialog = getByDataRole(container, DataRoles.DatePicker.Dialog);
			expect(dialog).toBeTruthy();

			const dayElements = container.querySelectorAll(
				`.${datePickerClassName}-Day:not(.${datePickerClassName}-Day--outside)`
			);
			await userEvent.click(dayElements[0]);
			await userEvent.click(dayElements[2]);

			// Should have OK button
			const okButton = getByRole(container, "button", { name: "OK" });
			expect(okButton).toBeInTheDocument();

			// Should have Clear button after selecting a range
			const clearButton = getByRole(container, "button", { name: "Clear" });
			expect(clearButton).toBeInTheDocument();

			const acceptAction = getAllByDataRole(container, DataRoles.Picker.Footer.Action)[1];
			await userEvent.click(getByDataRole(acceptAction, DataRoles.Button));
			expect(onInputChangeSpy).toHaveBeenCalledWith("");

			deviceDetectorStub.mockRestore();
		});

		test("should not show OK and Clear buttons if no labels provided", async () => {
			const deviceDetectorStub = vi.spyOn(provider, "hasTouch").mockReturnValue(true);

			const { container } = render(
				<DateInput id="test-date-input" dateFormatter={defaultDateFormatter} dateConverter={defaultDateConverter} />
			);

			const pickerTriggerButton = getByDataRole(container, DataRoles.Button);
			await userEvent.click(pickerTriggerButton);

			const dialog = getByDataRole(container, DataRoles.DatePicker.Dialog);
			expect(dialog).toBeTruthy();

			const okButton = queryByRole(container, "button", { name: "OK" });
			const clearButton = queryByRole(container, "button", { name: "Clear" });

			expect(okButton).not.toBeInTheDocument();
			expect(clearButton).not.toBeInTheDocument();

			deviceDetectorStub.mockRestore();
		});

		test("Date Input with `htmlAttributes` in `datePickerDialogProps` property", async () => {
			const deviceDetectorStub = vi.spyOn(provider, "hasTouch").mockReturnValue(true);

			const ariaLabel = "Custom mobile date picker";
			const { getByDataRole } = render(
				<DateInput
					dateFormatter={defaultDateFormatter}
					dateConverter={defaultDateConverter}
					datePickerDialogProps={{
						htmlAttributes: {
							"aria-label": ariaLabel
						}
					}}
				/>
			);

			const pickerTriggerButton = getByDataRole(DataRoles.Button);
			await userEvent.click(pickerTriggerButton);

			const modalContent = getByDataRole(DataRoles.Modal.OverlayContent);
			expect(modalContent.getAttribute("aria-label")).toBe(ariaLabel);

			deviceDetectorStub.mockRestore();
		});
	});
});
