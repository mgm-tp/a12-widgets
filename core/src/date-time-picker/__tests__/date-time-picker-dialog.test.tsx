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

import { createReferenceElement, getByDataRole, getByRole, removeReferenceElement, render } from "test-utils";
import { afterEach, beforeEach, describe, vi, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { enUS } from "date-fns/locale";

import { provider } from "../../common/main/device-detector.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { DateTimeContext } from "../../common/main/date-time/date-time-context.js";

import { DateTimePicker } from "../main/date-time-picker.view.js";
import { DateTimePickerDialog } from "../main/wrapper/date-time-picker-dialog.view.js";
import { DateTimePickerInput } from "../main/wrapper/date-time-picker-input.view.js";
import { DateTimePickerTimeInput } from "../main/wrapper/date-time-picker.time-input.view.js";

const Picker = DateTimePickerDialog(DateTimePicker);

describe("com.mgmtp.a12.widgets.date-time-picker-dialog", () => {
	let referenceElement: HTMLElement;
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(Date.UTC(2022, 2, 2, 14, 40).valueOf()));
		referenceElement = createReferenceElement();
	});

	afterEach(() => {
		removeReferenceElement(referenceElement);
		vi.useRealTimers();
	});

	test("render date picker dialog desktop", async () => {
		const { container } = render(
			<Picker
				referenceElement={referenceElement}
				pickerProps={{
					id: "test-id",
					className: "test-class",
					style: { color: "red" },
					value: new Date(),
					yearRange: { start: 2000, end: 2020 }
				}}
			/>
		);
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("render date picker dialog mobile", async () => {
		const deviceDetectorStub = vi.spyOn(provider, "hasTouch").mockReturnValue(true);

		const { container } = render(
			<Picker
				referenceElement={referenceElement}
				pickerProps={{
					id: "test-id",
					className: "test-class",
					style: { color: "red" },
					value: new Date(),
					yearRange: { start: 2000, end: 2020 }
				}}
			/>
		);
		const modal = getByDataRole(container, DataRoles.Modal.Overlay);
		expect(modal).toBeTruthy();
		expect(container).toMatchSnapshot();

		deviceDetectorStub.mockRestore();
	});
});

describe("com.mgmtp.a12.widgets.date-time-picker-dialog.context-time-mode", () => {
	const PickerWithTimeInput = DateTimePickerInput(DateTimePickerTimeInput);
	const value = new Date(Date.UTC(2008, 7, 5, 14, 40));

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(Date.UTC(2008, 7, 5, 14, 40).valueOf()));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test("uses 24h mode from `DateTimeContext` when no `pickerProps.timeMode` prop is set", async () => {
		const { container, queryByDataRole } = render(
			<DateTimeContext.Provider value={{ locale: enUS, timeMode: "24h" }}>
				<PickerWithTimeInput pickerProps={{ id: "test-24h", value }} dateTimeInputFormat="MM/DD/YYYY HH:mm" />
			</DateTimeContext.Provider>
		);

		// Open the picker dialog
		await userEvent.click(container.querySelector("#test-24h-trigger-button")!);

		// Time input must show 24h format initialised from context (not the 12h default "02:40 PM")
		const timeInput = container.querySelector(
			`[data-role="${DataRoles.TimePicker.Input}"] [data-role="${DataRoles.TextField.Input}"]`
		);
		expect(timeInput).toHaveValue("14:40");

		// Accept without changing the time and close picker
		await userEvent.click(getByRole(container, "button", { name: "ok" }));
		expect(queryByDataRole(DataRoles.AttachedPortal)).not.toBeInTheDocument();

		// After the picker closes, the main date-time input shows the accepted value in the correct format
		const mainInput = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;
		expect(mainInput).toHaveValue("08/05/2008 14:40");
	});

	test("`pickerProps.timeMode` overrides `timeMode` of `DateTimeContext`", async () => {
		const { queryByDataRole, container } = render(
			<DateTimeContext.Provider value={{ locale: enUS, timeMode: "24h" }}>
				<PickerWithTimeInput
					pickerProps={{ id: "test-12h-override", value, timeMode: "12h" }}
					dateTimeInputFormat="MM/DD/YYYY hh:mm A"
				/>
			</DateTimeContext.Provider>
		);

		// Open the picker dialog
		await userEvent.click(container.querySelector("#test-12h-override-trigger-button")!);

		// Prop timeMode="12h" overrides context timeMode="24h", so time input shows 12h format
		const timeInput = container.querySelector(
			`[data-role="${DataRoles.TimePicker.Input}"] [data-role="${DataRoles.TextField.Input}"]`
		);
		expect(timeInput).toHaveValue("02:40 PM");

		// Accept without changing the time and close picker
		await userEvent.click(getByRole(container, "button", { name: "ok" }));
		expect(queryByDataRole(DataRoles.AttachedPortal)).not.toBeInTheDocument();

		// After the picker closes, the main date-time input shows the accepted value in the correct format
		const mainInput = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;
		expect(mainInput).toHaveValue("08/05/2008 02:40 PM");
	});
});
