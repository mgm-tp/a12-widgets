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

import { createReferenceElement, getByDataRole, removeReferenceElement, render } from "test-utils";
import { afterEach, beforeEach, describe, vi, expect, test } from "vitest";

import { provider } from "../../common/main/device-detector.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { DateTimePicker } from "../main/date-time-picker.view.js";
import { DateTimePickerDialog } from "../main/wrapper/date-time-picker-dialog.view.js";

const Picker = DateTimePickerDialog(DateTimePicker);

describe("com.mgmtp.a12.widgets.date-time-picker-dialog", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(Date.UTC(2022, 2, 2, 14, 40).valueOf()));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test("render date picker dialog desktop", async () => {
		const referenceElement = createReferenceElement();
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
		removeReferenceElement(referenceElement);
	});

	test("render date picker dialog mobile", async () => {
		const deviceDetectorStub = vi.spyOn(provider, "hasTouch").mockReturnValue(true);

		const referenceElement = createReferenceElement();
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
		removeReferenceElement(referenceElement);
	});
});
