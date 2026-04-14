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

import { render, getByDataRole, getAllByDataRole, setupDevice, getByRole } from "test-utils";
import { describe, test, expect, vi, beforeAll } from "vitest";
import { userEvent } from "vitest/browser";

import { Icon } from "../../icon/main/icon.view.js";
import { Button } from "../../button/main/button.view.js";
import { TimeUtils } from "../../common/main/date-time/time-utils.js";
import { DateTimeUtils } from "../../common/main/date-time/date-utils.js";
import { DataRoles } from "../../common/index.js";

import { TimePicker } from "../main/time-picker.view.js";
import { Header } from "../main/time-picker.internal.js";
import type { TimePickerProps } from "../main/time-picker.api.js";

const timezone = "America/New_York";

describe("com.mgmtp.a12.widgets.time-picker.time-picker-desktop", () => {
	test("rendering-a-time-picker-with-label", () => {
		const label = "Test Label";
		const { container } = render(<TimePicker id="test-id" label={label} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-a-time-picker-with-label-graphic", () => {
		const { container } = render(<TimePicker id="test-id" labelGraphic={<Icon>info</Icon>} />);
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-with-icon", () => {
		const { container } = render(<TimePicker id="test-id" icon={<Icon>alarm</Icon>} />);
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-with-placeholder", () => {
		const { container } = render(<TimePicker id="test-id" placeholder="hh:mm" />);
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-with-readonly-state", () => {
		const { container } = render(<TimePicker id="test-id" readonly />);
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-with-disabled-state", () => {
		const { container } = render(<TimePicker id="test-id" disabled />);
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-with-error-state", () => {
		const { container } = render(<TimePicker id="test-id" error />);
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-with-error-message", () => {
		const { container } = render(<TimePicker id="test-id" error errorMessage="An error message" />);
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-with-error-state-and-message", () => {
		const { container } = render(<TimePicker id="test-id" info infoMessage="An info message" />);
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-with-warning-state-and-message", () => {
		const { container } = render(<TimePicker id="test-id" warning warningMessage="An warning message" />);
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-with-help-text", () => {
		const { container } = render(<TimePicker id="test-id" helperText="A helper text" />);
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-with-hideLabel", () => {
		const { container } = render(<TimePicker id="test-id" label="Hidden Label" hideLabel />);
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-dialog-after-click", async () => {
		const { container } = render(<TimePicker />);
		const timePickerTrigger = getByDataRole(container, "button");

		await userEvent.click(timePickerTrigger);

		const portal = getByDataRole(container, "attached-portal");
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-dialog-with-custom-header-element", async () => {
		const date = new Date(Date.UTC(2017, 12, 25, 14, 0));
		const { container } = render(
			<TimePicker
				value={date}
				customHeaderElement={(time) => (
					<Header actionButtons={<Button icon={<Icon>close</Icon>} title="Close" />}>
						<strong>{DateTimeUtils.toISOString(time)}</strong>
					</Header>
				)}
			/>
		);
		const timePickerTrigger = getByDataRole(container, "button");

		await userEvent.click(timePickerTrigger);

		const portal = getByDataRole(container, "attached-portal");
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-dialog-with-value", async () => {
		const date = new Date(Date.UTC(2017, 12, 25, 14, 0));
		const { container } = render(<TimePicker value={date} />);
		const timePickerTrigger = getByDataRole(container, "button");

		await userEvent.click(timePickerTrigger);

		const portal = getByDataRole(container, "attached-portal");
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-dialog-with-24h-mode", async () => {
		const date = new Date(Date.UTC(2017, 12, 25, 14, 0));
		const { container } = render(<TimePicker value={date} mode="24h" />);
		const timePickerTrigger = getByDataRole(container, "button");

		await userEvent.click(timePickerTrigger);

		const portal = getByDataRole(container, "attached-portal");
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-dialog-with-typed-time", async () => {
		const date = new Date(Date.UTC(2017, 12, 25, 14, 0));
		const { container } = render(<TimePicker value={date} />);
		const timePickerTrigger = getByDataRole(container, "button");
		const timeInput = getByDataRole(container, "textline-input");

		await userEvent.click(timeInput);
		await userEvent.fill(timeInput, "13:17");
		await userEvent.tab();
		await userEvent.click(timePickerTrigger);

		const portal = getByDataRole(container, "attached-portal");
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("rendering-a-time-picker-with-timezone", async () => {
		const date: Date | undefined = new Date(Date.UTC(2017, 12, 25, 14, 0));
		const onChangeSpy = vi.fn();

		const { container } = render(<TimePicker value={date} timezone={timezone} onChange={onChangeSpy} />);
		const timeInput = getByDataRole(container, "textline-input") as HTMLInputElement;

		expect(timeInput.value).toBe("09:00 AM");

		await userEvent.click(timeInput);
		await userEvent.fill(timeInput, "13:17");
		await userEvent.tab();

		expect(onChangeSpy).toHaveBeenCalledWith(new Date("1970-01-01T18:17:00.000Z"));
	});

	test("calling-onValidate", async () => {
		const onValidateFn = vi.fn();
		const { container } = render(<TimePicker onValidate={onValidateFn} />);
		const timeInput = getByDataRole(container, "textline-input") as HTMLInputElement;

		await userEvent.click(timeInput);
		await userEvent.fill(timeInput, "invalid value");
		await userEvent.tab();
		expect(onValidateFn).toHaveBeenCalledWith({ value: "invalid value", valid: false });

		await userEvent.click(timeInput);
		await userEvent.fill(timeInput, "12:30");
		await userEvent.tab();
		expect(onValidateFn).toHaveBeenCalledWith({ value: "12:30", valid: true });
	});

	test("calling-onChange-with-typed-value", async () => {
		const onChangeSpy = vi.fn();
		const { container } = render(<TimePicker onChange={onChangeSpy} />);
		const timeInput = getByDataRole(container, "textline-input") as HTMLInputElement;

		await userEvent.click(timeInput);
		await userEvent.fill(timeInput, "13:17");
		await userEvent.tab();

		expect(onChangeSpy).toHaveBeenCalledWith(new Date("1970-01-01T13:17:00.000Z"));
	});

	test("rendering-a-time-picker-with-custom-formatter", async () => {
		const formatter: TimePickerProps.TimeFormatter = (time) => {
			return TimeUtils.formatTimezoneTime(time, undefined, "LTS");
		};

		const date: Date = new Date(Date.UTC(2017, 12, 25, 14, 0));
		const { container } = render(<TimePicker value={date} timeFormatter={formatter} />);
		const timeInput = getByDataRole(container, "textline-input") as HTMLInputElement;

		expect(timeInput.value).toBe("2:00:00 PM");
	});

	test("rendering-a-time-picker-with-custom-formatter-and-timezone", async () => {
		const timeFormatter: TimePickerProps.TimeFormatter = (time) => {
			return TimeUtils.formatTimezoneTime(time, timezone, "LTS");
		};

		const date: Date = new Date(Date.UTC(2017, 12, 25, 14, 0));
		const { container } = render(<TimePicker value={date} timeFormatter={timeFormatter} timezone={timezone} />);
		const timeInput = getByDataRole(container, "textline-input") as HTMLInputElement;

		expect(timeInput.value).toBe("9:00:00 AM");
	});

	test("rendering-a-time-picker-with-custom-converter-and-timezone", async () => {
		const timeConverter: TimePickerProps.TimeConverter = (input) => {
			const [hour, minute] = [Math.floor(+input / 60), +input % 60];
			const timeUTC = new Date(Date.UTC(1970, 0, 1, hour, minute));

			return TimeUtils.convertUTCToTimezoneDate(timeUTC, timezone);
		};

		const onChangeSpy = vi.fn();
		const { container } = render(
			<TimePicker timeConverter={timeConverter} timezone={timezone} onChange={onChangeSpy} />
		);
		const timeInput = getByDataRole(container, "textline-input") as HTMLInputElement;

		await userEvent.click(timeInput);
		await userEvent.fill(timeInput, "67");
		await userEvent.tab();

		expect(onChangeSpy).toHaveBeenCalledWith(new Date("1970-01-01T06:07:00.000Z"));
	});

	test("rendering-a-time-picker-with-custom-converter", async () => {
		const timeConverter: TimePickerProps.TimeConverter = (input) => {
			const [hour, minute] = [Math.floor(+input / 60), +input % 60];

			return new Date(Date.UTC(1970, 0, 1, hour, minute));
		};

		const onChangeSpy = vi.fn();
		const { container } = render(<TimePicker timeConverter={timeConverter} onChange={onChangeSpy} />);
		const timeInput = getByDataRole(container, "textline-input") as HTMLInputElement;

		await userEvent.click(timeInput);
		await userEvent.fill(timeInput, "67");
		await userEvent.tab();

		expect(onChangeSpy).toHaveBeenCalledWith(new Date("1970-01-01T01:07:00.000Z"));
	});

	test("rendering-a-time-picker-with-onInputChange", async () => {
		const onChangeSpy = vi.fn();
		const { container } = render(<TimePicker onInputChange={onChangeSpy} />);
		const timeInput = getByDataRole(container, "textline-input") as HTMLInputElement;

		await userEvent.click(timeInput);
		await userEvent.fill(timeInput, "abcdef");
		await userEvent.tab();

		expect(onChangeSpy).toHaveBeenCalledWith("abcdef");
	});

	test("timepicker does not call onChange again after blur event if the value doesn't need to be updated", async () => {
		const date = new Date(Date.UTC(0, 0, 0, 0, 0, 0));
		const onChangeSpy = vi.fn();
		const { container } = render(<TimePicker onChange={onChangeSpy} value={date} />);
		const timeInput = getByDataRole(container, "textline-input");

		await userEvent.click(timeInput);
		await userEvent.fill(timeInput, "12:00 AM");
		await userEvent.tab();

		expect(onChangeSpy).toHaveBeenCalledTimes(0);
	});

	test("rendering-a-time-picker-with-enter-key-press-trigger", async () => {
		const date = new Date(Date.UTC(0, 0, 0, 0, 0, 0));
		const onChangeSpy = vi.fn();
		const { container } = render(<TimePicker onChange={onChangeSpy} />);
		const timeInput = getByDataRole(container, "textline-input");

		await userEvent.click(timeInput);
		await userEvent.fill(timeInput, "12:00 AM");
		await userEvent.keyboard("{enter}");
		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect(onChangeSpy.mock.calls[0][0].getUTCHours()).toBe(date.getUTCHours());
		expect(onChangeSpy.mock.calls[0][0].getUTCMinutes()).toBe(date.getUTCMinutes());
	});

	test("Clicking the timepicker clear button should reset focus back to the time picker", async () => {
		const { container } = render(<TimePicker />);
		const timePickerTrigger = getByDataRole(container, "button");
		await userEvent.click(timePickerTrigger);
		const portal = getByDataRole(container, "attached-portal");
		const clockNumber = getAllByDataRole(portal, "time-picker-clock-num")[0];
		await userEvent.click(clockNumber, { force: true });
		const clearBtn = getByRole(portal, "button", { name: "clear" });
		await userEvent.click(clearBtn);
		const timePicker = getByDataRole(container, "time-picker");
		expect(document.activeElement).toBe(timePicker);
	});

	test("Time Picker with `desktopPickerAttributes` property", async () => {
		const ariaLabel = "Custom desktop time picker";
		const { getByDataRole } = render(
			<TimePicker
				desktopPickerAttributes={{
					"aria-label": ariaLabel
				}}
			/>
		);

		const timePickerTrigger = getByDataRole(DataRoles.Button);
		await userEvent.click(timePickerTrigger);

		const pickerDialog = getByDataRole(DataRoles.TimePicker);

		expect(pickerDialog).toBeTruthy();
		expect(pickerDialog.getAttribute("aria-label")).toBe(ariaLabel);
	});
});

describe("com.mgmtp.a12.widgets.time-picker.time-picker-mobile", () => {
	beforeAll(() => {
		setupDevice();
	});

	test("rendering-a-time-picker-dialog", async () => {
		const date = new Date(Date.UTC(2017, 12, 25, 14, 0));
		const { container } = render(<TimePicker id="test-id" value={date} />);
		const timePickerTrigger = getByDataRole(container, "button");
		await userEvent.click(timePickerTrigger);

		const modalOverlay = getByDataRole(container, "modal-overlay");
		expect(modalOverlay).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("Time Picker with `mobilePickerAttributes` property", async () => {
		const ariaLabel = "Custom mobile time picker";
		const { getByDataRole } = render(
			<TimePicker
				value={new Date(Date.UTC(2017, 12, 25, 14, 0))}
				mobilePickerAttributes={{
					"aria-label": ariaLabel
				}}
			/>
		);

		const timePickerTrigger = getByDataRole(DataRoles.Button);
		await userEvent.click(timePickerTrigger);

		const modalContent = getByDataRole(DataRoles.Modal.OverlayContent);
		expect(modalContent.getAttribute("aria-label")).toBe(ariaLabel);
	});
});
