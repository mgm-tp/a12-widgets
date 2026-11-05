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

import { useState } from "react";
import { getByDataRole, isAfter, render, fireEvent } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, test, expect, vi } from "vitest";

import { DataRoles } from "../../../common/index.js";
import { addPrefix, noop } from "../../../common/main/utils.js";
import type { MessagePosition, TooltipLineBreak } from "../../base/template/base.tpl.api.js";
import type { TextAreaStatelessProps } from "../main/template/text-area.tpl.api.js";
import { TextAreaStateless } from "../main/template/text-area.tpl.view.js";

const baseTextAreaDataRole = "textarea";
const properties: Partial<TextAreaStatelessProps> = {
	id: "test-id",
	className: "test-classname",
	wrapperStyle: { backgroundColor: "blue" },
	style: { backgroundColor: "red" },
	helperText: "Test Helper Text",
	label: "Test Label",
	value: "Test value",
	placeholder: "Test placeholder",
	errorMessage: "Test error message",
	warningMessage: "Test warning message",
	infoMessage: "Test info message",
	addonBefore: "Test addon before",
	addonAfter: "Test addon after",
	prefixes: "Test prefix",
	suffixes: "Test suffix",
	tooltips: <div className="test-tooltip">Test tooltip</div>,
	ariaDescribedby: "Test aria-describedby"
};

describe("com.mgmtp.a12.widgets.text-area-tpl", () => {
	test("render basic text-area", () => {
		const { container } = render(
			<TextAreaStateless
				helperText={properties.helperText}
				label={properties.label}
				value={properties.value}
				placeholder={properties.placeholder}
				onChange={noop}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-area with extended properties", () => {
		const { container } = render(
			<TextAreaStateless
				inputProps={{ tabIndex: 1, "aria-label": `${properties.label}` }}
				role="textbox"
				ariaAutocomplete="list"
				ariaHaspopup="listbox"
				ariaExpanded
				ariaActivedescendant="list-id"
				ariaOwns="list-id"
				ariaBusy
				readonly
				id={properties.id}
				warningMessage={properties.warningMessage}
				errorMessage={properties.errorMessage}
				infoMessage={properties.infoMessage}
				ariaDescribedby={properties.ariaDescribedby}
				label={properties.label}
				onChange={noop}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render auto-width text-area", () => {
		const { container } = render(
			<TextAreaStateless
				helperText={properties.helperText}
				label={properties.label}
				value={properties.value}
				placeholder={properties.placeholder}
				onChange={noop}
				fitToParent={false}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-area with hidden label", () => {
		const { container } = render(<TextAreaStateless label={properties.label} hideLabel onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-area with right-alignment", () => {
		const { container } = render(<TextAreaStateless textAlignment="right" onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-area with tooltip", () => {
		const { container } = render(
			<TextAreaStateless id={properties.id} tooltips={properties.tooltips} onChange={noop} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-area with addons", () => {
		const { container } = render(
			<TextAreaStateless
				id={properties.id}
				addonBefore={properties.addonBefore}
				addonAfter={properties.addonAfter}
				onChange={noop}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-area with affixes", () => {
		const { container } = render(
			<TextAreaStateless prefixes={properties.prefixes} suffixes={properties.suffixes} onChange={noop} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-area with info", () => {
		const { container } = render(<TextAreaStateless info onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-area with info-message", () => {
		const { container } = render(<TextAreaStateless infoMessage="test info message" onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-area with error", () => {
		const { container } = render(<TextAreaStateless error onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-area with error-message", () => {
		const { container } = render(<TextAreaStateless errorMessage="test error message" onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-area with warning", () => {
		const { container } = render(<TextAreaStateless warning onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-area with warning-message", () => {
		const { container } = render(<TextAreaStateless warningMessage="test warning message" onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly text-area", () => {
		const { container } = render(<TextAreaStateless readonly />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly with value text-area", () => {
		const { container } = render(<TextAreaStateless readonly value="test readonly with value" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled text-area", () => {
		const { container } = render(<TextAreaStateless disabled />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-field events", () => {
		const onClickSpy = vi.fn();
		const onFocusSpy = vi.fn();
		const onBlurSpy = vi.fn();
		const onInputSpy = vi.fn();
		const onKeyDownSpy = vi.fn();

		const { container } = render(
			<TextAreaStateless
				onClick={onClickSpy}
				onFocus={onFocusSpy}
				onBlur={onBlurSpy}
				onInput={onInputSpy}
				onKeyDown={onKeyDownSpy}
			/>
		);
		const input = getByDataRole(container, `${baseTextAreaDataRole}-input`);

		fireEvent.click(input);
		expect(onClickSpy).toHaveBeenCalledTimes(1);

		fireEvent.focus(input);
		expect(onFocusSpy).toHaveBeenCalledTimes(1);

		fireEvent.blur(input);
		expect(onBlurSpy).toHaveBeenCalledTimes(1);

		fireEvent.input(input);
		expect(onInputSpy).toHaveBeenCalledTimes(1);

		fireEvent.keyDown(input, { key: Key.Enter });
		expect(onKeyDownSpy).toHaveBeenCalledTimes(1);
	});

	test("onChange is called correctly", () => {
		const onChangeSpy = vi.fn();

		const InputWrapper = () => {
			const [value, setValue] = useState("");

			return (
				<TextAreaStateless
					value={value}
					onChange={(event) => {
						onChangeSpy(event);
						setValue(event.target.value);
					}}
				/>
			);
		};

		const { container } = render(<InputWrapper />);
		const input = getByDataRole(container, `${baseTextAreaDataRole}-input`) as HTMLInputElement;

		// make sure that triggering input change via JavaScript works
		input.value = "test";
		fireEvent.focus(input);
		expect(input.value).toBe("test");

		// and of course normal onChange should work too
		fireEvent.change(input, { target: { value: "test onChange event" } });
		input.focus();
		expect(input.value).toBe("test onChange event");
	});

	describe("message position", () => {
		const messageRoles = [
			DataRoles.Textarea.ErrorMessage,
			DataRoles.Textarea.WarningMessage,
			DataRoles.Textarea.InfoMessage
		];

		const renderWithMessages = (messagePosition: MessagePosition) =>
			render(
				<TextAreaStateless
					id={properties.id}
					label={properties.label}
					helperText={properties.helperText}
					errorMessage={properties.errorMessage}
					warningMessage={properties.warningMessage}
					infoMessage={properties.infoMessage}
					messagePosition={messagePosition}
					onChange={noop}
				/>
			);

		test("renders the messages above the control for above", () => {
			const { getByDataRole } = renderWithMessages("above");
			const control = getByDataRole(DataRoles.Textarea.Control);
			const input = getByDataRole(DataRoles.Textarea.Input);
			const label = getByDataRole(DataRoles.Textarea.Label);
			const helperText = getByDataRole(DataRoles.Textarea.HelperText);

			for (const role of messageRoles) {
				const message = getByDataRole(role);

				expect(control.contains(message)).toBe(true);
				expect(isAfter(message, input)).toBe(true);
				// the message stays inside the label -> helper text envelope
				expect(isAfter(label, message)).toBe(true);
				expect(isAfter(message, helperText)).toBe(true);
			}
		});

		test("renders the messages below the control for below", () => {
			const { getByDataRole } = renderWithMessages("below");
			const control = getByDataRole(DataRoles.Textarea.Control);
			const input = getByDataRole(DataRoles.Textarea.Input);
			const label = getByDataRole(DataRoles.Textarea.Label);
			const helperText = getByDataRole(DataRoles.Textarea.HelperText);

			for (const role of messageRoles) {
				const message = getByDataRole(role);

				expect(control.contains(message)).toBe(true);
				expect(isAfter(input, message)).toBe(true);
				// the message stays inside the label -> helper text envelope
				expect(isAfter(label, message)).toBe(true);
				expect(isAfter(message, helperText)).toBe(true);
			}
		});
	});

	describe("tooltip position", () => {
		const renderWithTooltips = (breakTooltipsToNewLine: TooltipLineBreak) =>
			render(
				<TextAreaStateless
					id={properties.id}
					helperText={properties.helperText}
					tooltips={<div>Test tooltip</div>}
					breakTooltipsToNewLine={breakTooltipsToNewLine}
					onChange={noop}
				/>
			);

		test("renders the tooltips above the control by default", () => {
			const { getByDataRole, getByText, queryByDataRole } = render(
				<TextAreaStateless
					id={properties.id}
					helperText={properties.helperText}
					tooltips={<div>Test tooltip</div>}
					onChange={noop}
				/>
			);
			const control = getByDataRole(DataRoles.Textarea.Control);
			const input = getByDataRole(DataRoles.Textarea.Input);
			const tooltip = getByText("Test tooltip");

			expect(queryByDataRole(DataRoles.Textarea.TooltipAddon)).toBeNull();
			expect(control.contains(tooltip)).toBe(true);
			expect(isAfter(tooltip, input)).toBe(true);
		});

		test("renders the tooltips inline beside the control for false", () => {
			const { getByDataRole, getByText } = renderWithTooltips(false);
			const control = getByDataRole(DataRoles.Textarea.Control);
			const addon = getByDataRole(DataRoles.Textarea.TooltipAddon);
			const tooltip = getByText("Test tooltip");

			expect(addon.contains(tooltip)).toBe(true);
			// the addon is a sibling of the control inside the field's main row
			expect(control.parentElement?.contains(addon)).toBe(true);
			expect(isAfter(control, addon)).toBe(true);
		});

		test("renders the tooltips above the control for above", () => {
			const { getByDataRole, getByText, queryByDataRole } = renderWithTooltips("above");
			const control = getByDataRole(DataRoles.Textarea.Control);
			const input = getByDataRole(DataRoles.Textarea.Input);
			const tooltip = getByText("Test tooltip");

			expect(queryByDataRole(DataRoles.Textarea.TooltipAddon)).toBeNull();
			expect(control.contains(tooltip)).toBe(true);
			expect(isAfter(tooltip, input)).toBe(true);
		});

		test("renders the tooltips below the whole control row for below", () => {
			const { container, getByDataRole, getByText, queryByDataRole } = renderWithTooltips("below");
			const control = getByDataRole(DataRoles.Textarea.Control);
			const fieldMain = control.parentElement as HTMLElement;
			const helperText = getByDataRole(DataRoles.Textarea.HelperText);
			const tooltip = getByText("Test tooltip");

			expect(queryByDataRole(DataRoles.Textarea.TooltipAddon)).toBeNull();
			expect(fieldMain.contains(tooltip)).toBe(false);
			expect(tooltip.parentElement).toBe(container.firstChild);
			expect(isAfter(fieldMain, tooltip)).toBe(true);
			expect(isAfter(tooltip, helperText)).toBe(true);
		});
	});

	describe("tooltip content", () => {
		test("renders a plain string tooltip", () => {
			const { getByDataRole, getByText } = render(
				<TextAreaStateless
					id={properties.id}
					tooltips="String tooltip"
					breakTooltipsToNewLine={false}
					onChange={noop}
				/>
			);
			const addon = getByDataRole(DataRoles.Textarea.TooltipAddon);
			const tooltip = getByText("String tooltip");

			expect(addon.contains(tooltip)).toBe(true);
			expect(tooltip).toHaveClass(addPrefix("field") + "__tooltip");
		});
	});

	describe("aria-invalid", () => {
		test("marks the input as invalid for error", () => {
			const { getByDataRole } = render(<TextAreaStateless id={properties.id} error onChange={noop} />);

			expect(getByDataRole(DataRoles.Textarea.Input)).toHaveAttribute("aria-invalid", "true");
		});

		test("marks the input as invalid for errorMessage", () => {
			const { getByDataRole } = render(
				<TextAreaStateless id={properties.id} errorMessage={properties.errorMessage} onChange={noop} />
			);

			expect(getByDataRole(DataRoles.Textarea.Input)).toHaveAttribute("aria-invalid", "true");
		});

		test("does not mark the input as invalid for a warning or an info", () => {
			const { getByDataRole } = render(
				<TextAreaStateless
					id={properties.id}
					warning
					info
					warningMessage={properties.warningMessage}
					infoMessage={properties.infoMessage}
					onChange={noop}
				/>
			);

			expect(getByDataRole(DataRoles.Textarea.Input)).not.toHaveAttribute("aria-invalid");
		});
	});
});
