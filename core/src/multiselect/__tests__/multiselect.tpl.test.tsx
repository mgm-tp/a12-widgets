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
import { Key } from "ts-key-enum";
import { describe, vi, expect, test } from "vitest";

import { HintTooltip } from "../../tooltip/hint/main/hint.view.js";
import { AttachedPortal } from "../../attached-portal/main/attached-portal.view.js";
import { noop } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { MultiselectProps } from "../main/multiselect.api.js";
import { MultiselectTemplate } from "../main/multiselect.tpl.view.js";

export const ITEMS: MultiselectProps.Item[] = [
	{
		id: "1",
		label: "Java"
	},
	{
		id: "2",
		label: "Groovy"
	},
	{
		id: "3",
		label: "JavaScript"
	},
	{
		id: "4",
		label: "C++"
	},
	{
		id: "5",
		label: "C"
	},
	{
		id: "6",
		label: "Scala"
	},
	{
		id: "7",
		label: "Python"
	},
	{
		id: "8",
		label: "PHP"
	},
	{
		id: "9",
		label: "ActionScript"
	},
	{
		id: "10",
		label: "AppleScript"
	},
	{
		id: "11",
		label: "Asp"
	},
	{
		id: "12",
		label: "Clojure"
	},
	{
		id: "13",
		label: "COBOL"
	},
	{
		id: "14",
		label: "BASIC"
	},
	{
		id: "15",
		label: "ColdFusion"
	},
	{
		id: "16",
		label: "123"
	},
	{
		id: "17",
		label: "456"
	}
];

export const properties = {
	id: "test-id",
	label: "Test Multiselect",
	placeholder: "Test Placeholder",
	tooltips: <HintTooltip text="hint tooltip" />,
	errorMessage: "Error message",
	warningMessage: "Warning message",
	ariaDescribedby: "warning-tooltip",
	helperText: "Helper text",
	hintTemplate: "{count} of {total} options shown",
	selectAllText: "All",
	inputProps: { "aria-label": "Multiselect" }
};

describe("com.mgmtp.a12.widgets.multiselect.template", () => {
	test("render default multiselect template", () => {
		const { container } = render(
			<MultiselectTemplate
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				placeholder={properties.placeholder}
				ariaDescribedby={properties.ariaDescribedby}
				selectAllText="All"
				showDropdown
				onChange={noop}
			/>
		);

		const dropdown = getByDataRole(container, DataRoles.Dropdown);
		expect(dropdown).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("render readonly multiselect template", () => {
		const { container } = render(
			<MultiselectTemplate
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				placeholder={properties.placeholder}
				readonly
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled multiselect template", () => {
		const { container } = render(
			<MultiselectTemplate
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				placeholder={properties.placeholder}
				disabled
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render multiselect template with error message", () => {
		const { container } = render(
			<MultiselectTemplate
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				placeholder={properties.placeholder}
				errorMessage={properties.errorMessage}
				onChange={noop}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("render multiselect template with warning message", () => {
		const { container } = render(
			<MultiselectTemplate
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				placeholder={properties.placeholder}
				warningMessage={properties.warningMessage}
				onChange={noop}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("render multiselect template with tooltip", () => {
		const { container } = render(
			<MultiselectTemplate
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				placeholder={properties.placeholder}
				tooltips={properties.tooltips}
				onChange={noop}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render multiselect template with tooltip in new line", () => {
		const { container } = render(
			<MultiselectTemplate
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				placeholder={properties.placeholder}
				tooltips={properties.tooltips}
				breakTooltipsToNewLine
				onChange={noop}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("multiselect references", async () => {
		const inputRefSpy = vi.fn();
		const inputWrapperRefSpy = vi.fn();
		const dropdownInstance = vi.fn();
		const dropdownRefSpy = vi.fn();
		const helperTextRefSpy = vi.fn();
		const labelRefSpy = vi.fn();
		const clearButtonRefSpy = vi.fn();
		const element = document.createElement("div");
		const refElement = document.body.appendChild(element);

		render(
			<MultiselectTemplate
				items={ITEMS}
				label={properties.label}
				helperText={properties.helperText}
				labelRef={labelRefSpy}
				helperTextRef={helperTextRefSpy}
				clearButtonRef={clearButtonRefSpy}
				inputRef={inputRefSpy}
				inputWrapperRef={inputWrapperRefSpy}
				dropdownInstance={dropdownInstance}
				dropdownRef={dropdownRefSpy}
				dropdownContainer={(content) => <AttachedPortal referenceElement={refElement}>{content}</AttachedPortal>}
				showClearButton
				showDropdown
				onChange={noop}
			/>
		);

		expect(labelRefSpy).toHaveBeenCalledTimes(1);
		expect(helperTextRefSpy).toHaveBeenCalledTimes(1);
		expect(inputWrapperRefSpy).toHaveBeenCalledTimes(1);
		expect(inputRefSpy).toHaveBeenCalledTimes(1);
		expect(clearButtonRefSpy).toHaveBeenCalledTimes(1);

		expect(dropdownInstance).toHaveBeenCalled();
		expect(dropdownRefSpy).toHaveBeenCalled();

		document.body.removeChild(refElement);
	});

	test("multiselect template events", () => {
		const onChangeSpy = vi.fn();
		const onClickSpy = vi.fn();
		const onKeyDownSpy = vi.fn();
		const onFocusSpy = vi.fn();
		const onBlurSpy = vi.fn();
		const onInputWrapperMouseDownSpy = vi.fn();
		const onInputWrapperClickSpy = vi.fn();
		const onClearButtonClickSpy = vi.fn();
		const onDropdownKeyDownSpy = vi.fn();

		const { container } = render(
			<MultiselectTemplate
				items={ITEMS}
				onChange={onChangeSpy}
				onBlur={onBlurSpy}
				onFocus={onFocusSpy}
				onClick={onClickSpy}
				onKeyDown={onKeyDownSpy}
				onInputWrapperMouseDown={onInputWrapperMouseDownSpy}
				onInputWrapperClick={onInputWrapperClickSpy}
				onClearButtonClick={onClearButtonClickSpy}
				onDropdownKeyDown={onDropdownKeyDownSpy}
				showClearButton
				showDropdown
			/>
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		fireEvent.focus(input);
		expect(onFocusSpy).toHaveBeenCalledTimes(1);

		fireEvent.change(input, { target: { value: "test" } });
		expect(onChangeSpy).toHaveBeenCalledTimes(1);

		fireEvent.blur(input);
		expect(onBlurSpy).toHaveBeenCalledTimes(1);

		fireEvent.mouseDown(input);
		expect(onInputWrapperMouseDownSpy).toHaveBeenCalledTimes(1);

		fireEvent.click(input);
		expect(onInputWrapperClickSpy).toHaveBeenCalledTimes(1);
		expect(onClickSpy).toHaveBeenCalledTimes(1);

		const clearButton = getByDataRole(container, DataRoles.Button);
		fireEvent.click(clearButton);
		expect(onClearButtonClickSpy).toHaveBeenCalledTimes(1);

		fireEvent.keyDown(input, { key: Key.ArrowDown });
		expect(onKeyDownSpy).toHaveBeenCalledTimes(1);

		const dropdown = getByDataRole(container, DataRoles.Dropdown);
		fireEvent.focus(dropdown);
		fireEvent.keyDown(dropdown, { key: Key.ArrowDown });
		expect(onDropdownKeyDownSpy).toHaveBeenCalledTimes(1);
	});
});
