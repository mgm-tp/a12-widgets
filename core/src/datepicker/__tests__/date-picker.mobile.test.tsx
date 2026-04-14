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

import { fireEvent, getByDataRole, render, getByRole } from "test-utils";
import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";

import { DataRoles } from "../../common/main/data-roles.js";

import { DatePickerDialog } from "../main/date-picker.mobile.view.js";
import { PickerHeaderCloseButton } from "../main/date-picker.tpl.view.js";

describe("com.mgmtp.a12.widgets.date-picker.mobile", () => {
	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(Date.UTC(2022, 2, 2).valueOf()));
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	test("render basic date picker on mobile", () => {
		const { container } = render(<DatePickerDialog submitButton={<button />} />);
		expect(container).toMatchSnapshot();
	});

	test("render date picker with passed props", () => {
		const { container } = render(
			<DatePickerDialog
				id="test-id"
				className="test-class"
				title="test title"
				submitButton={<button>submit</button>}
				closeButton={<button>close-btn</button>}
				clearButton={<button>clear-btn</button>}
			/>
		);
		expect(getByRole(container, "button", { name: "close-btn" })).toBeInTheDocument();
		expect(getByRole(container, "button", { name: "clear-btn" })).toBeInTheDocument();
		expect(getByRole(container, "button", { name: "submit" })).toBeInTheDocument();

		expect(getByDataRole(container, DataRoles.DatePicker.Dialog)).toHaveAttribute("id", "test-id");
		expect(getByDataRole(container, DataRoles.DatePicker.Dialog)).toHaveClass("test-class");

		expect(getByDataRole(container, DataRoles.DatePicker.Dialog.Title)).toHaveTextContent("test title");
	});

	test("simulate date-range change", () => {
		const onCloseFn = vi.fn();
		const { container } = render(<DatePickerDialog onClose={onCloseFn} submitButton={null} />);

		fireEvent.click(getByDataRole(container, DataRoles.Button));
		expect(onCloseFn).toHaveBeenCalledTimes(1);
	});
});

describe("com.mgmtp.a12.widgets.date-picker.PickerHeaderCloseButton", () => {
	test("renders with default aria-label from context", () => {
		const { container } = render(<PickerHeaderCloseButton />);
		expect(getByDataRole(container, DataRoles.Button)).toHaveAttribute("aria-label", "Close");
	});

	test("aria-label can be overridden via buttonAttributes", () => {
		const { container } = render(<PickerHeaderCloseButton buttonAttributes={{ "aria-label": "Custom Text" }} />);
		expect(getByDataRole(container, DataRoles.Button)).toHaveAttribute("aria-label", "Custom Text");
	});

	test("aria-label is preserved when buttonAttributes contains other attributes", () => {
		const { container } = render(<PickerHeaderCloseButton buttonAttributes={{ "data-testid": "close-btn" }} />);
		const button = getByDataRole(container, DataRoles.Button);
		expect(button).toHaveAttribute("data-testid", "close-btn");
		expect(button).toHaveAttribute("aria-label", "Close");
	});
});
