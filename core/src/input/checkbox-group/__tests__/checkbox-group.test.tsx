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

import { render, fireEvent, getAllByDataRole, isAfter } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { DataRoles } from "../../../common/main/data-roles.js";
import { getByDataRole } from "../../../common/test/test-utils.js";
import { Icon } from "../../../icon/main/icon.view.js";
import type { MessagePosition, TooltipLineBreak } from "../../base/template/base.tpl.api.js";
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

	describe("message position", () => {
		const messageRoles = [
			DataRoles.CheckboxGroup.ErrorMessage,
			DataRoles.CheckboxGroup.WarningMessage,
			DataRoles.CheckboxGroup.InfoMessage
		];

		const renderWithMessages = (messagePosition: MessagePosition) =>
			render(
				<CheckboxGroup
					label="Test Label"
					helperText="Test Helper Text"
					id="test-checkbox-group"
					errorMessage="Test error message"
					warningMessage="Test warning message"
					infoMessage="Test info message"
					messagePosition={messagePosition}
				>
					<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
					<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				</CheckboxGroup>
			);

		test("renders the messages above the group for above", () => {
			const { getAllByDataRole, getByDataRole } = renderWithMessages("above");
			const items = getAllByDataRole(DataRoles.Checkbox.Control);
			const label = getByDataRole(DataRoles.CheckboxGroup.Label);
			const helperText = getByDataRole(DataRoles.Checkbox.HelperText);

			for (const role of messageRoles) {
				const message = getByDataRole(role);

				expect(isAfter(message, items[0])).toBe(true);
				// stays inside the label -> helper text envelope
				expect(isAfter(label, message)).toBe(true);
				expect(isAfter(message, helperText)).toBe(true);
			}
		});

		test("renders the messages below the group for below", () => {
			const { getAllByDataRole, getByDataRole } = renderWithMessages("below");
			const items = getAllByDataRole(DataRoles.Checkbox.Control);
			const lastItem = items[items.length - 1];
			const label = getByDataRole(DataRoles.CheckboxGroup.Label);
			const helperText = getByDataRole(DataRoles.Checkbox.HelperText);

			for (const role of messageRoles) {
				const message = getByDataRole(role);

				expect(isAfter(lastItem, message)).toBe(true);
				// stays inside the label -> helper text envelope
				expect(isAfter(label, message)).toBe(true);
				expect(isAfter(message, helperText)).toBe(true);
			}
		});
	});

	describe("tooltip position", () => {
		const renderWithTooltips = (breakTooltipsToNewLine: TooltipLineBreak, helperText?: string) =>
			render(
				<CheckboxGroup
					label="Checkbox Group"
					id="test-checkbox-group"
					helperText={helperText}
					tooltips={<div>Test tooltip</div>}
					breakTooltipsToNewLine={breakTooltipsToNewLine}
				>
					<CheckboxGroup.Item label="Option 1" value="1" id="item-1" />
					<CheckboxGroup.Item label="Option 2" value="2" id="item-2" />
				</CheckboxGroup>
			);

		test("renders the tooltips above the group for false, having no inline placement", () => {
			const { getAllByDataRole, getByDataRole, getByText } = renderWithTooltips(false);
			const items = getAllByDataRole(DataRoles.Checkbox.Control);
			const tooltip = getByText("Test tooltip");

			expect(items.some((item) => item.contains(tooltip))).toBe(false);
			// the very slot "above" uses: after the group label, before the group itself
			expect(isAfter(getByDataRole(DataRoles.CheckboxGroup.Label), tooltip)).toBe(true);
			expect(isAfter(tooltip, items[0])).toBe(true);
		});

		test("renders the tooltips above the group for above", () => {
			const { getAllByDataRole, getByDataRole, getByText } = renderWithTooltips("above");
			const items = getAllByDataRole(DataRoles.Checkbox.Control);
			const tooltip = getByText("Test tooltip");

			expect(items.some((item) => item.contains(tooltip))).toBe(false);
			expect(isAfter(getByDataRole(DataRoles.CheckboxGroup.Label), tooltip)).toBe(true);
			expect(isAfter(tooltip, items[0])).toBe(true);
		});

		test("renders the tooltips below the group for below", () => {
			const { getAllByDataRole, getByDataRole, getByText } = renderWithTooltips("below", "Test Helper Text");
			const items = getAllByDataRole(DataRoles.Checkbox.Control);
			const helperText = getByDataRole(DataRoles.Checkbox.HelperText);
			const tooltip = getByText("Test tooltip");

			expect(items.some((item) => item.contains(tooltip))).toBe(false);
			expect(isAfter(items[items.length - 1], tooltip)).toBe(true);
			expect(isAfter(tooltip, helperText)).toBe(true);
		});
	});
});
