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

import { fireEvent, getAllByDataRole, getByDataRole, queryByDataRole, render } from "test-utils";
import { beforeAll, afterAll, describe, vi, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { DateTimeUtils } from "../../common/main/date-time/date-utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { provider } from "../../common/main/device-detector.js";

import { DateTimePicker } from "../main/date-time-picker.view.js";
import { DateTimePickerInput } from "../main/wrapper/date-time-picker-input.view.js";
import type { DateTimePickerProps } from "../main/date-time-picker.api.js";

const format = "DD-MM-YYYY HH.mm";
const timezone = "America/New_York";

const Picker = DateTimePickerInput(DateTimePicker);

describe("com.mgmtp.a12.widgets.date-time-picker-input", () => {
	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(Date.UTC(2022, 2, 2).valueOf()));
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	test("render date time picker input", async () => {
		const { container } = render(
			<Picker
				pickerProps={{
					id: "test-id",
					className: "test-class",
					style: { color: "red" },
					value: new Date(),
					yearRange: { start: 2000, end: 2020 }
				}}
				inputLabel="inputLabel"
				inputErrorMessage="inputErrorMessage"
				inputWarningMessage="inputWarningMessage"
				inputTooltips="inputTooltips"
				helperText="helperText"
			/>
		);
		expect(container.firstChild).toMatchSnapshot();

		const triggerButton = getAllByDataRole(container, DataRoles.Button)[0];
		fireEvent.click(triggerButton);
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("picker button should be disabled when the disabled prop is true", () => {
		const { container } = render(
			<Picker
				pickerProps={{
					id: "test-id",
					className: "test-class",
					value: new Date()
				}}
				disabled
			/>
		);
		const pickerBtn = getByDataRole(container, DataRoles.Button) as HTMLButtonElement;

		expect(pickerBtn.disabled).toBe(true);
	});

	test("picker button should be disabled when the readonly prop is true", () => {
		const { container } = render(
			<Picker
				pickerProps={{
					id: "test-id",
					className: "test-class",
					value: new Date()
				}}
				readonly
			/>
		);

		const pickerBtn = queryByDataRole(container, DataRoles.Button) as HTMLButtonElement;

		expect(pickerBtn.disabled).toBe(true);
	});

	test("rendering-a-date-time-picker-with-custom-formatter", async () => {
		const date: Date = new Date(Date.UTC(2017, 11, 25, 14, 0));
		const dateTimeFormatter: DateTimePickerProps.DateTimeFormatter = (dateTime?: Date) =>
			DateTimeUtils.formatUTCDateTime(dateTime, undefined, format);
		const { container } = render(<Picker pickerProps={{ value: date }} dateTimeFormatter={dateTimeFormatter} />);
		const timeInput = getByDataRole(container, DataRoles.Textline.Input) as HTMLInputElement;

		expect(timeInput.value).toBe("25-12-2017 14.00");
	});

	test("rendering-a-date-time-picker-with-custom-formatter-and-timezone", async () => {
		const date: Date = new Date(Date.UTC(2017, 11, 25, 14, 0));
		const dateTimeFormatter: DateTimePickerProps.DateTimeFormatter = (dateTime?: Date) =>
			DateTimeUtils.formatTimezoneDateTime({ date: dateTime, timezone, dateTimeFormat: format });
		const { container } = render(
			<Picker pickerProps={{ value: date, timezone }} dateTimeFormatter={dateTimeFormatter} />
		);
		const timeInput = getByDataRole(container, DataRoles.Textline.Input) as HTMLInputElement;

		expect(timeInput.value).toBe("25-12-2017 09.00");
	});

	test("rendering-a-date-time-picker-with-custom-converter", async () => {
		const date: Date = new Date(Date.UTC(2017, 11, 25, 14, 0));
		const dateTimeConverter: DateTimePickerProps.DateTimeConverter = (dateTimeString: string) => {
			const dateTimeUTC = DateTimeUtils.parseDateTimeUTC(dateTimeString, format);

			return dateTimeUTC ? DateTimeUtils.createTimezoneConverter().convertDate.toUTC(dateTimeUTC) : undefined;
		};

		const { container } = render(<Picker pickerProps={{ value: date }} dateTimeConverter={dateTimeConverter} />);
		const timeInput = getByDataRole(container, DataRoles.Textline.Input) as HTMLInputElement;

		expect(timeInput.value).toBe("12/25/2017 2:00 PM");
	});

	test("rendering-a-date-time-picker-with-custom-converter-and-timezone", async () => {
		const date: Date = new Date(Date.UTC(2017, 11, 25, 14, 0));
		const dateTimeConverter: DateTimePickerProps.DateTimeConverter = (dateTimeString: string) => {
			const dateTimeUTC = DateTimeUtils.parseDateTimeUTC(dateTimeString, format);

			return dateTimeUTC
				? DateTimeUtils.createTimezoneConverter(timezone).convertDate.toTimezone(dateTimeUTC)
				: undefined;
		};

		const { container } = render(
			<Picker pickerProps={{ value: date, timezone }} dateTimeConverter={dateTimeConverter} />
		);
		const timeInput = getByDataRole(container, DataRoles.Textline.Input) as HTMLInputElement;

		expect(timeInput.value).toBe("12/25/2017 9:00 AM");
	});

	test("should focus back to trigger button after accepting date/time with OK button", async () => {
		const onAcceptFn = vi.fn();

		const { container } = render(<Picker pickerProps={{ id: "test-id", value: new Date(), onAccept: onAcceptFn }} />);

		const triggerButton = getByDataRole(container, DataRoles.Button);
		await userEvent.click(triggerButton);

		const dateTimePicker = getByDataRole(container, DataRoles.DateTimePicker);

		expect(dateTimePicker).toBeInTheDocument();

		const okButton = getAllByDataRole(container, DataRoles.DateTimePicker.Footer.Action)[1];
		await userEvent.click(getByDataRole(okButton, DataRoles.Button));

		expect(onAcceptFn).toHaveBeenCalledTimes(1);

		expect(queryByDataRole(container, DataRoles.DateTimePicker)).not.toBeInTheDocument();
		expect(document.activeElement).toBe(triggerButton);
	});

	test("Date Time Picker Input with `desktopPickerAttributes` property", async () => {
		const ariaLabel = "Custom desktop date time picker";
		const { getByDataRole } = render(
			<Picker
				pickerProps={{
					value: new Date(Date.UTC(2022, 2, 2, 14, 0)),
					desktopPickerAttributes: {
						"aria-label": ariaLabel
					}
				}}
			/>
		);

		const button = getByDataRole(DataRoles.Button);
		await userEvent.click(button);

		const dateTimePicker = getByDataRole(DataRoles.DateTimePicker);
		expect(dateTimePicker.getAttribute("aria-label")).toBe(ariaLabel);
	});
});

describe("Touch Device", () => {
	test("Date Time Picker Input with `mobilePickerAttributes` property", async () => {
		const deviceDetectorStub = vi.spyOn(provider, "hasTouch").mockReturnValue(true);

		const ariaLabel = "Custom mobile date time picker";
		const { getByDataRole } = render(
			<Picker
				pickerProps={{
					value: new Date(Date.UTC(2022, 2, 2, 14, 0)),
					mobilePickerAttributes: {
						"aria-label": ariaLabel
					}
				}}
			/>
		);

		const button = getByDataRole(DataRoles.Button);
		await userEvent.click(button);

		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);
		expect(modalOverlay).toBeTruthy();

		// The `mobilePickerAttributes` should be applied to the Modal Overlay's container element
		const modalContent = getByDataRole(DataRoles.Modal.OverlayContent);
		expect(modalContent.getAttribute("aria-label")).toBe(ariaLabel);

		deviceDetectorStub.mockRestore();
	});
});
