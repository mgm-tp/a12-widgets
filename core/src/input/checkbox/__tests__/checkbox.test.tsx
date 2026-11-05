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

import { render, fireEvent, getByDataRole, isAfter } from "test-utils";
import { describe, test, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { noop } from "../../../common/main/utils.js";
import { Icon } from "../../../icon/main/icon.view.js";
import type { MessagePosition, TooltipLineBreak } from "../../base/template/base.tpl.api.js";
import { Checkbox } from "../main/checkbox.view.js";

describe("com.mgmtp.a12.widgets.checkbox", () => {
	test("render basic checkbox with label", () => {
		const { container } = render(<Checkbox id="testId" checked={false} onChange={noop} label="Test checkbox" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render basic checked checkbox", () => {
		const { container } = render(<Checkbox id="testId" checked={true} onChange={noop} />);
		const checkbox = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(checkbox).toHaveAttribute("checked");
		expect(checkbox).toMatchSnapshot();
	});

	test("render warning checkbox", () => {
		const { container } = render(<Checkbox warning id="testId" checked={false} onChange={noop} />);
		const warningCheckbox = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(warningCheckbox).toMatchSnapshot();
	});

	test("render error checkbox", () => {
		const { container } = render(<Checkbox error id="testId" checked={false} onChange={noop} />);
		const errorCheckbox = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(errorCheckbox).toMatchSnapshot();
	});

	test("render info checkbox", () => {
		const { container } = render(<Checkbox info id="testId" checked={false} onChange={noop} />);
		const infoCheckbox = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(infoCheckbox).toMatchSnapshot();
	});

	test("render readonly checkbox", () => {
		const { container } = render(<Checkbox readonly id="testId" checked={false} onChange={noop} />);
		const readOnlyCheckbox = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(readOnlyCheckbox).toHaveAttribute("disabled");
		expect(readOnlyCheckbox).toMatchSnapshot();
	});

	test("render disabled checkbox", () => {
		const { container } = render(<Checkbox disabled id="testId" checked={false} onChange={noop} />);
		const disabledCheckbox = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(disabledCheckbox).toHaveAttribute("disabled");
		expect(disabledCheckbox).toMatchSnapshot();
	});

	test("render readonly & checked checkbox", () => {
		const { container } = render(<Checkbox readonly id="testId" checked={true} onChange={noop} />);
		const checkboxInput = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(checkboxInput).toHaveAttribute("disabled");
		expect(checkboxInput).toHaveAttribute("checked");
		expect(checkboxInput).toMatchSnapshot();
	});

	test("render disabled & checked checkbox", () => {
		const { container } = render(<Checkbox disabled id="testId" checked={true} onChange={noop} />);
		const checkboxInput = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(checkboxInput).toHaveAttribute("disabled");
		expect(checkboxInput).toHaveAttribute("checked");
		expect(checkboxInput).toMatchSnapshot();
	});

	test("checkbox with hideLabel", () => {
		const { container } = render(
			<Checkbox hideLabel label="Test checkbox" id="testId" checked={false} onChange={noop} />
		);
		const label = getByDataRole(container, DataRoles.Checkbox.Label);

		expect(label).toHaveClass("-u-unseenButRead");
	});

	test("checkbox with helper-text", () => {
		const { container } = render(<Checkbox id="testId" checked={false} onChange={noop} helperText="helper-text" />);
		const helperText = getByDataRole(container, DataRoles.Checkbox.HelperText);

		expect(helperText).toBeTruthy();
	});

	test("checkbox with label graphic", () => {
		const { container } = render(
			<Checkbox
				id="checkbox-with-labelGraphic"
				checked={false}
				onChange={noop}
				label="Checkbox with label graphic"
				labelGraphic={<Icon>info</Icon>}
			/>
		);
		const labelGraphic = getByDataRole(container, DataRoles.Label.Graphic);

		expect(labelGraphic).toBeTruthy();
	});

	test("checkbox with warning message", () => {
		const { container } = render(<Checkbox warningMessage="warning" id="testId" checked={false} onChange={noop} />);
		const warningMessage = getByDataRole(container, DataRoles.Checkbox.WarningMessage);

		expect(warningMessage).toBeTruthy();
	});

	test("checkbox with error message", () => {
		const { container } = render(<Checkbox errorMessage="error" id="testId" checked={false} onChange={noop} />);
		const errorMessage = getByDataRole(container, DataRoles.Checkbox.ErrorMessage);

		expect(errorMessage).toBeTruthy();
	});

	test("checkbox with info message", () => {
		const { container } = render(<Checkbox infoMessage="info" id="testId" checked={false} onChange={noop} />);
		const infoMessage = getByDataRole(container, DataRoles.Checkbox.InfoMessage);

		expect(infoMessage).toBeTruthy();
	});

	test("checkbox events", () => {
		const onBlurSpy = vi.fn();
		const onChangeSpy = vi.fn();
		const onFocusSpy = vi.fn();
		const onClickSpy = vi.fn();

		const { container } = render(
			<Checkbox
				id="testId"
				inputProps={{ onClick: onClickSpy }}
				checked={false}
				onChange={onChangeSpy}
				onBlur={onBlurSpy}
				onFocus={onFocusSpy}
				label="Test checkbox"
			/>
		);
		const checkboxInput = getByDataRole(container, DataRoles.Checkbox.Input);

		fireEvent.focus(checkboxInput);
		expect(onFocusSpy).toHaveBeenCalledTimes(1);

		fireEvent.blur(checkboxInput);
		expect(onBlurSpy).toHaveBeenCalledTimes(1);

		fireEvent.click(checkboxInput, { currentTarget: { checked: true } });
		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect(onClickSpy).toHaveBeenCalledTimes(1);
	});

	describe("message position", () => {
		const messageRoles = [
			DataRoles.Checkbox.ErrorMessage,
			DataRoles.Checkbox.WarningMessage,
			DataRoles.Checkbox.InfoMessage
		];

		const renderWithMessages = (messagePosition: MessagePosition) =>
			render(
				<Checkbox
					id="testId"
					checked={false}
					onChange={noop}
					label="Test Label"
					helperText="Test Helper Text"
					errorMessage="Test error message"
					warningMessage="Test warning message"
					infoMessage="Test info message"
					messagePosition={messagePosition}
				/>
			);

		/**
		 * Unlike text-field, the checkbox's label lives *inside* the control, after the box. "Above" therefore
		 * places the messages above the label as well, not between the label and the control.
		 */
		test("renders the messages above both the control and the label for above", () => {
			const { getByDataRole } = renderWithMessages("above");
			const control = getByDataRole(DataRoles.Checkbox.Control);
			const label = getByDataRole(DataRoles.Checkbox.Label);
			const helperText = getByDataRole(DataRoles.Checkbox.HelperText);

			for (const role of messageRoles) {
				const message = getByDataRole(role);

				// message -> control (label inside it) -> helper text
				expect(isAfter(message, control)).toBe(true);
				expect(isAfter(message, label)).toBe(true);
				expect(isAfter(message, helperText)).toBe(true);
			}
		});

		test("renders the messages below the control and above the helper text for below", () => {
			const { getByDataRole } = renderWithMessages("below");
			const control = getByDataRole(DataRoles.Checkbox.Control);
			const label = getByDataRole(DataRoles.Checkbox.Label);
			const helperText = getByDataRole(DataRoles.Checkbox.HelperText);

			for (const role of messageRoles) {
				const message = getByDataRole(role);

				// label -> control -> message -> helper text
				expect(isAfter(label, message)).toBe(true);
				expect(isAfter(control, message)).toBe(true);
				expect(isAfter(message, helperText)).toBe(true);
			}
		});
	});

	describe("tooltip position", () => {
		const renderWithTooltips = (breakTooltipsToNewLine: TooltipLineBreak, helperText?: string) =>
			render(
				<Checkbox
					id="testId"
					checked={false}
					onChange={noop}
					label="Test checkbox"
					helperText={helperText}
					tooltips={<div>Test tooltip</div>}
					breakTooltipsToNewLine={breakTooltipsToNewLine}
				/>
			);

		test("renders the tooltips inside the control for false", () => {
			const { getByDataRole, getByText } = renderWithTooltips(false);
			const control = getByDataRole(DataRoles.Checkbox.Control);
			const tooltip = getByText("Test tooltip");

			expect(control.contains(tooltip)).toBe(true);
			// the last thing in the control row, after the box and the label
			expect(isAfter(getByDataRole(DataRoles.Checkbox.Label), tooltip)).toBe(true);
		});

		test("renders the tooltips above the control for above", () => {
			const { getByDataRole, getByText } = renderWithTooltips("above");
			const control = getByDataRole(DataRoles.Checkbox.Control);
			const tooltip = getByText("Test tooltip");

			expect(control.contains(tooltip)).toBe(false);
			expect(isAfter(tooltip, control)).toBe(true);
		});

		test("renders the tooltips below the control for below", () => {
			const { getByDataRole, getByText } = renderWithTooltips("below", "Test Helper Text");
			const control = getByDataRole(DataRoles.Checkbox.Control);
			const helperText = getByDataRole(DataRoles.Checkbox.HelperText);
			const tooltip = getByText("Test tooltip");

			expect(control.contains(tooltip)).toBe(false);
			expect(isAfter(control, tooltip)).toBe(true);
			expect(isAfter(tooltip, helperText)).toBe(true);
		});
	});

	describe("aria-invalid", () => {
		test("marks the input as invalid for error", () => {
			const { getByDataRole } = render(<Checkbox id="testId" checked={false} onChange={noop} error />);

			expect(getByDataRole(DataRoles.Checkbox.Input)).toHaveAttribute("aria-invalid", "true");
		});

		test("marks the input as invalid for errorMessage", () => {
			const { getByDataRole } = render(
				<Checkbox id="testId" checked={false} onChange={noop} errorMessage="Test error message" />
			);

			expect(getByDataRole(DataRoles.Checkbox.Input)).toHaveAttribute("aria-invalid", "true");
		});

		test("does not mark the input as invalid for a warning or an info", () => {
			const { getByDataRole } = render(
				<Checkbox
					id="testId"
					checked={false}
					onChange={noop}
					warning
					info
					warningMessage="Test warning message"
					infoMessage="Test info message"
				/>
			);

			expect(getByDataRole(DataRoles.Checkbox.Input)).not.toHaveAttribute("aria-invalid");
		});
	});
});

describe("com.mgmtp.a12.widgets.indeterminate.checkbox", () => {
	test("render basic indeterminate checkbox", () => {
		const { container } = render(
			<Checkbox.Indeterminate id="testId" checked={false} onChange={noop} label="Test checkbox" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render mixed indeterminate checkbox", () => {
		const { container } = render(
			<Checkbox.Indeterminate id="testId" checked="mixed" onChange={noop} label="Test checkbox" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render checked indeterminate checkbox", () => {
		const { container } = render(
			<Checkbox.Indeterminate id="testId" checked={true} onChange={noop} label="Test checkbox" />
		);
		const checkboxInput = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(checkboxInput).toHaveAttribute("aria-checked", "true");
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled indeterminate checkbox", () => {
		const { container } = render(
			<Checkbox.Indeterminate disabled id="testId" checked="mixed" onChange={noop} label="Test checkbox" />
		);
		const checkboxInput = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(checkboxInput).toHaveAttribute("disabled");
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readOnly indeterminate checkbox", () => {
		const { container } = render(
			<Checkbox.Indeterminate readonly id="testId" checked="mixed" onChange={noop} label="Test checkbox" />
		);
		const checkboxInput = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(checkboxInput).toHaveAttribute("disabled");
		expect(container.firstChild).toMatchSnapshot();
	});

	test("indeterminate checkbox events", () => {
		const onBlurSpy = vi.fn();
		const onChangeSpy = vi.fn();
		const onFocusSpy = vi.fn();

		const { container } = render(
			<Checkbox.Indeterminate
				id="testId"
				checked="mixed"
				onChange={onChangeSpy}
				onBlur={onBlurSpy}
				onFocus={onFocusSpy}
				label="Test checkbox"
			/>
		);
		const checkboxButton = getByDataRole(container, DataRoles.Checkbox.Input);

		fireEvent.focus(checkboxButton);
		expect(onFocusSpy).toHaveBeenCalledTimes(1);

		fireEvent.blur(checkboxButton);
		expect(onBlurSpy).toHaveBeenCalledTimes(1);

		fireEvent.click(checkboxButton, { currentTarget: { checked: true } });
		expect(onChangeSpy).toHaveBeenCalledTimes(1);
	});

	test("generates an id so the label stays associated when none is given", () => {
		const { container } = render(
			<Checkbox checked={false} onChange={noop} label="Test checkbox" helperText="Helper" errorMessage="Error" />
		);
		const input = container.querySelector("input") as HTMLInputElement;

		// The label is a sibling with no `for` of its own, so the checkbox would be unnamed without an id.
		expect(input.labels?.length).toBeGreaterThan(0);
		expect(input.id).toBeTruthy();
		expect(input.getAttribute("aria-describedby")).toContain(`${input.id}-error`);
		// No id must never leak into a derived id such as "undefined-controls".
		expect(container.querySelector("[id*='undefined']")).toBeNull();
	});

	test("keeps the generated id stable across re-renders", () => {
		const { container, rerender } = render(<Checkbox checked={false} onChange={noop} label="Test checkbox" />);
		const firstId = (container.querySelector("input") as HTMLInputElement).id;

		rerender(<Checkbox checked={true} onChange={noop} label="Test checkbox" />);

		expect((container.querySelector("input") as HTMLInputElement).id).toBe(firstId);
	});

	test("derives the control, helper and message ids from a given id", () => {
		const { container } = render(
			<Checkbox
				id="testId"
				checked={false}
				onChange={noop}
				label="Test checkbox"
				helperText="Helper"
				errorMessage="Error"
			/>
		);
		const input = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(input).toHaveAttribute("id", "testId");
		expect(input.getAttribute("aria-describedby")).toContain("testId-error");
		expect(input.getAttribute("aria-describedby")).toContain("testId-helperText");
		expect(getByDataRole(container, DataRoles.Checkbox.Control)).toHaveAttribute("id", "testId-controls");
	});

	test("clicking the label toggles the checkbox when an id is given", async () => {
		const onChangeSpy = vi.fn();
		const { container } = render(<Checkbox id="testId" checked={false} onChange={onChangeSpy} label="Test checkbox" />);

		await userEvent.click(getByDataRole(container, DataRoles.Checkbox.Label));

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect(onChangeSpy).toHaveBeenCalledWith(true, expect.anything());
	});
});
