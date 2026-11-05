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
import type { MessagePosition, TooltipLineBreak } from "../../base/template/base.tpl.api.js";
import type { RadioProps } from "../main/radio.api.js";
import { Radio } from "../main/radio.view.js";

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

	describe("message position", () => {
		const messageRoles = [
			DataRoles.Radio.Group.ErrorMessage,
			DataRoles.Radio.Group.WarningMessage,
			DataRoles.Radio.Group.InfoMessage
		];

		const renderWithMessages = (messagePosition: MessagePosition) =>
			render(
				<Radio
					id={properties.id}
					label="Test Label"
					helperText="Test Helper Text"
					errorMessage="Test error message"
					warningMessage="Test warning message"
					infoMessage="Test info message"
					messagePosition={messagePosition}
				>
					<Radio.Item label="Option 1" value="1" />
					<Radio.Item label="Option 2" value="2" />
				</Radio>
			);

		test("renders the messages above the group for above", () => {
			const { getAllByDataRole, getByDataRole } = renderWithMessages("above");
			const items = getAllByDataRole(DataRoles.Radio.Item);
			const label = getByDataRole(DataRoles.Radio.Group.Label);
			const helperText = getByDataRole(DataRoles.Radio.Group.HelperText);

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
			const items = getAllByDataRole(DataRoles.Radio.Item);
			const lastItem = items[items.length - 1];
			const label = getByDataRole(DataRoles.Radio.Group.Label);
			const helperText = getByDataRole(DataRoles.Radio.Group.HelperText);

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
				<Radio
					id={properties.id}
					label="Test Radio"
					helperText={helperText}
					tooltips={<div>Test tooltip</div>}
					breakTooltipsToNewLine={breakTooltipsToNewLine}
				>
					<Radio.Item label="Option 1" value="1" />
					<Radio.Item label="Option 2" value="2" />
				</Radio>
			);

		test("renders the tooltips above the group for false, having no inline placement", () => {
			const { getAllByDataRole, getByDataRole, getByText } = renderWithTooltips(false);
			const items = getAllByDataRole(DataRoles.Radio.Item);
			const tooltip = getByText("Test tooltip");

			expect(items.some((item) => item.contains(tooltip))).toBe(false);
			// the very slot "above" uses: after the group label, before the group itself
			expect(isAfter(getByDataRole(DataRoles.Radio.Group.Label), tooltip)).toBe(true);
			expect(isAfter(tooltip, items[0])).toBe(true);
		});

		test("renders the tooltips above the group for above", () => {
			const { getAllByDataRole, getByDataRole, getByText } = renderWithTooltips("above");
			const items = getAllByDataRole(DataRoles.Radio.Item);
			const tooltip = getByText("Test tooltip");

			expect(items.some((item) => item.contains(tooltip))).toBe(false);
			expect(isAfter(getByDataRole(DataRoles.Radio.Group.Label), tooltip)).toBe(true);
			expect(isAfter(tooltip, items[0])).toBe(true);
		});

		test("renders the tooltips below the group for below", () => {
			const { getAllByDataRole, getByDataRole, getByText } = renderWithTooltips("below", "Test Helper Text");
			const items = getAllByDataRole(DataRoles.Radio.Item);
			const helperText = getByDataRole(DataRoles.Radio.Group.HelperText);
			const tooltip = getByText("Test tooltip");

			expect(items.some((item) => item.contains(tooltip))).toBe(false);
			expect(isAfter(items[items.length - 1], tooltip)).toBe(true);
			expect(isAfter(tooltip, helperText)).toBe(true);
		});
	});

	describe("aria-invalid", () => {
		test("marks the item inputs as invalid for error", () => {
			const { getAllByDataRole } = render(
				<Radio id={properties.id} label="Test Radio" error>
					<Radio.Item label="Option 1" value="1" />
					<Radio.Item label="Option 2" value="2" />
				</Radio>
			);

			for (const input of getAllByDataRole(DataRoles.Radio.Input)) {
				expect(input).toHaveAttribute("aria-invalid", "true");
			}
		});

		test("marks the item inputs as invalid for errorMessage", () => {
			const { getAllByDataRole } = render(
				<Radio id={properties.id} label="Test Radio" errorMessage="Test error message">
					<Radio.Item label="Option 1" value="1" />
					<Radio.Item label="Option 2" value="2" />
				</Radio>
			);

			for (const input of getAllByDataRole(DataRoles.Radio.Input)) {
				expect(input).toHaveAttribute("aria-invalid", "true");
			}
		});

		test("does not mark the item inputs as invalid for a warning or an info", () => {
			const { getAllByDataRole } = render(
				<Radio
					id={properties.id}
					label="Test Radio"
					warning
					info
					warningMessage="Test warning message"
					infoMessage="Test info message"
				>
					<Radio.Item label="Option 1" value="1" />
					<Radio.Item label="Option 2" value="2" />
				</Radio>
			);

			for (const input of getAllByDataRole(DataRoles.Radio.Input)) {
				expect(input).not.toHaveAttribute("aria-invalid");
			}
		});
	});
});
