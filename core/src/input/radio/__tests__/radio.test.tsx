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

import { render, fireEvent, getAllByDataRole } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { DataRoles } from "../../../common/main/data-roles.js";

import { Radio } from "../main/radio.view.js";
import type { RadioProps } from "../main/radio.api.js";

describe("com.mgmtp.a12.widgets.input.radio", () => {
	const properties: Partial<RadioProps> = {
		id: "test-id",
		className: "test-classname",
		style: { backgroundColor: "red" },
		label: "Test Radio",
		hideLabel: true,
		errorMessage: "Test error message",
		warningMessage: "Test warning message",
		infoMessage: "Test info message",
		warning: true,
		error: true,
		info: true,
		tooltips: "Test tooltips",
		helperText: "Test helper test",
		ariaDescribedby: "test-aria-describedby",
		name: "test-name"
	};

	test("radio-group-with-base-properties", () => {
		const { container } = render(
			<Radio {...properties}>
				<Radio.Item label="Option 1" value="1" tabIndex={-1} style={{ backgroundColor: "red" }} />
				<Radio.Item label="Option 2" value="2" />
				<Radio.Item label="Option 3" value="3" />
			</Radio>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-a-radio-disabled-readonly", () => {
		const { container } = render(
			<Radio id={properties.id} label="Radio's label">
				<Radio.Item label="Option 1" value="1" disabled />
				<Radio.Item label="Option 2" value="2" readonly />
				<Radio.Item label="Option 3" value="3" />
			</Radio>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-a-disabled-radio-group", () => {
		const { container } = render(
			<Radio id={properties.id} label="Radio's label" disabled>
				<Radio.Item label="Option 1" value="1" />
				<Radio.Item label="Option 2" value="2" />
				<Radio.Item label="Option 3" value="3" />
			</Radio>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("inline-radio", () => {
		const { container } = render(
			<Radio id={properties.id} inline>
				<Radio.Item label="Option 1" value="1" />
				<Radio.Item label="Option 2" value="2" />
				<Radio.Item label="Option 3" value="3" />
			</Radio>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulate-radio-input-ref", () => {
		const inputRef = vi.fn();
		render(
			<Radio id={properties.id}>
				<Radio.Item label="Option 1" value="1" inputRef={inputRef} />
				<Radio.Item label="Option 2" value="2" />
				<Radio.Item label="Option 3" value="3" />
			</Radio>
		);

		expect(inputRef).toHaveBeenCalledTimes(1);
	});

	test("on-value-change", () => {
		const onValueChanged = vi.fn();

		const { container } = render(
			<Radio id={properties.id} onValueChanged={onValueChanged}>
				<Radio.Item label="Option 1" value="1" />
				<Radio.Item label="Option 2" value="2" />
				<Radio.Item label="Option 3" value="3" />
			</Radio>
		);

		const items = getAllByDataRole(container, DataRoles.Radio.Input);
		fireEvent.click(items[0]);
		expect(onValueChanged).toHaveBeenCalledTimes(1);
	});

	test("on-radio-item-events", () => {
		const onItemFocus = vi.fn();
		const onItemBlur = vi.fn();

		const { container } = render(
			<Radio id={properties.id}>
				<Radio.Item label="Option 1" value="1" onFocus={onItemFocus} onBlur={onItemBlur} />
				<Radio.Item label="Option 2" value="2" />
				<Radio.Item label="Option 3" value="3" />
			</Radio>
		);

		const items = getAllByDataRole(container, DataRoles.Radio.Input);
		fireEvent.focus(items[0]);
		fireEvent.blur(items[0]);

		expect(onItemFocus).toHaveBeenCalledTimes(1);
		expect(onItemBlur).toHaveBeenCalledTimes(1);
	});
});
