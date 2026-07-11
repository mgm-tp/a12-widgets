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

import { getByRole, render, getByText, getByDataRole } from "test-utils";
import { beforeAll, afterAll, beforeEach, afterEach, describe, vi, expect, test } from "vitest";
import { enUS } from "date-fns/locale";

import { DateTimeContext } from "../../common/main/date-time/date-time-context.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { DateTimePickerTimeInput } from "../main/wrapper/date-time-picker.time-input.view.js";

describe("com.mgmtp.a12.widgets.date-time-picker.time-input", () => {
	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(Date.UTC(2022, 2, 2).valueOf()));
	});

	afterAll(() => {
		vi.useRealTimers();
	});
	test("render date time picker with time input", () => {
		const { container } = render(
			<DateTimePickerTimeInput
				id="test-id"
				value={new Date("2002-02-02")}
				className="test-class"
				style={{ color: "red" }}
				yearRange={{ start: 2000, end: 2020 }}
				yearSelectorVariant="select"
			/>
		);
		const picker = document.getElementById("test-id");
		expect(picker).toHaveClass("test-class");
		expect(picker).toHaveStyle({ color: "rgb(255, 0, 0)" });

		for (let year = 2000; year <= 2020; year++) {
			expect(getByText(container, year) as HTMLOptionElement).toBeInTheDocument();
		}

		expect(getByRole(container, "gridcell", { name: "Saturday, February 2nd, 2002, selected" })).toBeInTheDocument();
		// Scope time input query to the EditTime area to avoid ambiguity with year selector textbox
		const editTimeArea = getByDataRole(container, DataRoles.TimePicker.Input);
		expect(getByRole(editTimeArea, "textbox")).toHaveValue("12:00 AM");
	});
});

describe("com.mgmtp.a12.widgets.date-time-picker.time-input.context-time-mode", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(Date.UTC(2022, 2, 2, 14, 40).valueOf()));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test("uses 24h mode from `DateTimeContext`", () => {
		const { container } = render(
			<DateTimeContext.Provider value={{ locale: enUS, timeMode: "24h" }}>
				<DateTimePickerTimeInput />
			</DateTimeContext.Provider>
		);

		const editTime = getByDataRole(container, DataRoles.TimePicker.Input);
		expect(getByRole(editTime, "textbox")).toHaveAttribute("placeholder", "HH:mm");
	});

	test("`timeMode` prop overrides `DateTimeContext`", () => {
		const { container } = render(
			<DateTimeContext.Provider value={{ locale: enUS, timeMode: "24h" }}>
				<DateTimePickerTimeInput timeMode="12h" />
			</DateTimeContext.Provider>
		);

		const editTime = getByDataRole(container, DataRoles.TimePicker.Input);
		expect(getByRole(editTime, "textbox")).toHaveAttribute("placeholder", "hh:mm A");
	});

	test("defaults to 12h when neither prop nor context `timeMode` is set", () => {
		const { container } = render(<DateTimePickerTimeInput />);

		const editTime = getByDataRole(container, DataRoles.TimePicker.Input);
		expect(getByRole(editTime, "textbox")).toHaveAttribute("placeholder", "hh:mm A");
	});
});
