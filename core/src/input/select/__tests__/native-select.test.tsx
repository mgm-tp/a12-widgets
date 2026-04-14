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

import { getByDataRole, render, fireEvent } from "test-utils";
import { describe, test, expect, vi } from "vitest";

import { DataRoles } from "../../../common/main/data-roles.js";

import { NativeSelect } from "../main/native-select.view.js";
import type { NativeSelectProps } from "../main/select.api.js";

const properties: Partial<NativeSelectProps> = {
	id: "test-id",
	className: "test-classname",
	style: { backgroundColor: "red" },
	helperText: "Test Helper Text",
	label: "Test Label",
	items: [
		{ label: "1", value: "1" },
		{ label: "2", value: "2" }
	],
	value: "test value",
	placeholder: "test placeholder",
	errorMessage: "Test error message",
	warningMessage: "Test warning message",
	infoMessage: "Test info message",
	tooltips: <div className="test-tooltip">Test tooltip</div>
};

describe("com.mgmtp.a12.widgets.input.native.select", () => {
	test("render base native select", () => {
		const { container } = render(
			<NativeSelect
				id={properties.id}
				className={properties.className}
				style={properties.style}
				label={properties.label}
				items={properties.items ?? []}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render select with hidden label", () => {
		const { container } = render(<NativeSelect label={properties.label} hideLabel items={properties.items ?? []} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render warning select", () => {
		const { container } = render(
			<NativeSelect items={properties.items ?? []} warning warningMessage={properties.warningMessage} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render error select", () => {
		const { container } = render(
			<NativeSelect items={properties.items ?? []} error errorMessage={properties.errorMessage} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render info select", () => {
		const { container } = render(
			<NativeSelect items={properties.items ?? []} info infoMessage={properties.infoMessage} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render select with helper text", () => {
		const { container } = render(<NativeSelect items={properties.items ?? []} helperText={properties.helperText} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly select", () => {
		const { container } = render(<NativeSelect items={properties.items ?? []} readonly />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled select", () => {
		const { container } = render(<NativeSelect items={properties.items ?? []} disabled />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render select with tooltip", () => {
		const { container } = render(<NativeSelect items={properties.items ?? []} tooltips={properties.tooltips} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render select with tooltip in new line", () => {
		const { container } = render(
			<NativeSelect items={properties.items ?? []} tooltips={properties.tooltips} breakTooltipsToNewLine />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulate events", () => {
		const selectRefSpy = vi.fn();
		const onFocusSpy = vi.fn();
		const onBlurSpy = vi.fn();
		const onChangeSpy = vi.fn();

		const { container } = render(
			<NativeSelect
				selectRef={selectRefSpy}
				onFocus={onFocusSpy}
				onBlur={onBlurSpy}
				onValueChanged={onChangeSpy}
				items={properties.items ?? []}
			/>
		);

		expect(selectRefSpy).toHaveBeenCalledTimes(1);

		const input = getByDataRole(container, DataRoles.Select.Input);

		fireEvent.focus(input);
		expect(onFocusSpy).toHaveBeenCalledTimes(1);

		fireEvent.blur(input);
		expect(onBlurSpy).toHaveBeenCalledTimes(1);

		fireEvent.change(input, { currentTarget: { value: "test" } });
		expect(onChangeSpy).toHaveBeenCalledTimes(1);
	});

	test("render select with isEmptyValue flag set to true", () => {
		const itemsWithEmpty = [
			{ label: "-- None --", value: "none", isEmptyValue: true },
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" }
		];

		const { getByDataRole } = render(<NativeSelect items={itemsWithEmpty} value="none" />);

		const selectInput = getByDataRole(DataRoles.Select.Input);

		expect(selectInput.firstChild).toMatchSnapshot();
	});
});
