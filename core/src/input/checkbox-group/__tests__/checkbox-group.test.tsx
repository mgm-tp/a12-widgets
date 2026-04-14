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

import { Icon } from "../../../icon/main/icon.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { getByDataRole } from "../../../common/test/test-utils.js";

import { CheckboxGroup } from "../main/checkbox-group.view.js";

describe("com.mgmtp.a12.widgets.checkbox-group", () => {
	test("render basic checkbox-group", () => {
		const { container } = render(
			<CheckboxGroup label="Checkbox Group" id="test checkbox-group">
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render checkbox-group with hidden label", () => {
		const { container } = render(
			<CheckboxGroup label="Checkbox Group" id="test checkbox-group" hideLabel>
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render basic inline checkbox-group", () => {
		const { container } = render(
			<CheckboxGroup label="Checkbox Group" id="test checkbox-group" inline>
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render checkbox-group with helper-text", () => {
		const { container } = render(
			<CheckboxGroup label="Checkbox Group" id="test checkbox-group" helperText="helper-text">
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render inline checkbox-group with helper-text", () => {
		const { container } = render(
			<CheckboxGroup label="Checkbox Group" id="test checkbox-group" inline helperText="helper-text">
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render warning checkbox-group", () => {
		const { container } = render(
			<CheckboxGroup label="Checkbox Group" id="test checkbox-group" warning>
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render error checkbox-group", () => {
		const { container } = render(
			<CheckboxGroup label="Checkbox Group" id="test checkbox-group" error>
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render info checkbox-group", () => {
		const { container } = render(
			<CheckboxGroup label="Checkbox Group" id="test checkbox-group" info>
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly checkbox-group", () => {
		const { container } = render(
			<CheckboxGroup label="Checkbox Group" id="test checkbox-group" readonly>
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled checkbox-group", () => {
		const { container } = render(
			<CheckboxGroup label="Checkbox Group" id="test checkbox-group" disabled>
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render checkbox-group with warning message", () => {
		const { container } = render(
			<CheckboxGroup label="Checkbox Group" id="test checkbox-group" warningMessage="warning">
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render checkbox-group with error message", () => {
		const { container } = render(
			<CheckboxGroup label="Checkbox Group" id="test checkbox-group" errorMessage="error">
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render checkbox-group with info message", () => {
		const { container } = render(
			<CheckboxGroup label="Checkbox Group" id="test checkbox-group" infoMessage="info">
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("checkbox-group with label graphic", () => {
		const { container } = render(
			<CheckboxGroup id="checkbox-group" label="Checkbox Group with label graphic" labelGraphic={<Icon>info</Icon>}>
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);
		const labelGraphic = getByDataRole(container, DataRoles.Label.Graphic);

		expect(labelGraphic).toBeTruthy();
	});

	test("checkbox-group events", () => {
		const onValueChangedSpy = vi.fn();

		const { container } = render(
			<CheckboxGroup onValueChanged={onValueChangedSpy}>
				<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
				<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				<CheckboxGroup.Item label="Option 3" value="3" id="item-3" />
			</CheckboxGroup>
		);

		const checkboxInputs = getAllByDataRole(container, DataRoles.Checkbox.Input);
		fireEvent.click(checkboxInputs[0], { currentTarget: { checked: true } });
		expect(onValueChangedSpy).toHaveBeenCalledTimes(1);
	});
});
