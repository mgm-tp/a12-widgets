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
import { Key } from "ts-key-enum";
import { getByDataRole, render, fireEvent } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { noop } from "../../../common/main/utils.js";

import { TextLineStateless, TextAffix } from "../main/template/text-line.tpl.view.js";
import type { TextLineStatelessProps } from "../main/template/text-line.tpl.api.js";

const baseTextLineDataRole = "textline";
const properties: Partial<TextLineStatelessProps> = {
	id: "test-id",
	className: "test-classname",
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
	tooltips: <div className="test-tooltip">Test tooltip</div>,
	prefixes: [<div>Prefix 1</div>, <div>Prefix 2</div>],
	suffixes: [<div>Suffix 1</div>, <div>Suffix 2</div>, <TextAffix>Suffix 3</TextAffix>],
	ariaDescribedby: "Test aria-describedby"
};

describe("com.mgmtp.a12.widgets.text-line-tpl", () => {
	test("render basic text-line with customize role, inputProps, customInputProps", () => {
		const { container } = render(
			<TextLineStateless
				helperText={properties.helperText}
				label={properties.label}
				value={properties.value}
				placeholder={properties.placeholder}
				onChange={noop}
				role="search"
				inputProps={{ "aria-hidden": true }}
				customInputProps={{ virtualKeyboardPolicy: "manual" }}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render auto-width text-line", () => {
		const { container } = render(
			<TextLineStateless
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

	test("render text-line with hidden label", () => {
		const { container } = render(<TextLineStateless label={properties.label} hideLabel onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-line with right-alignment", () => {
		const { container } = render(<TextLineStateless textAlignment="right" onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-line with tooltip", () => {
		const { container } = render(<TextLineStateless textAlignment="right" onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-line with addons", () => {
		const { container } = render(
			<TextLineStateless addonAfter={properties.addonAfter} addonBefore={properties.addonBefore} onChange={noop} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-line with affixes", () => {
		const { container } = render(
			<TextLineStateless prefixes={properties.prefixes} suffixes={properties.suffixes} onChange={noop} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-line with info", () => {
		const { container } = render(<TextLineStateless info onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("render text-line with info-message", () => {
		const { container } = render(<TextLineStateless infoMessage={properties.infoMessage} onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-line with error", () => {
		const { container } = render(<TextLineStateless error onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("render text-line with error-message", () => {
		const { container } = render(<TextLineStateless errorMessage={properties.errorMessage} onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-line with warning", () => {
		const { container } = render(<TextLineStateless warning onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-line with warning-message", () => {
		const { container } = render(<TextLineStateless warningMessage={properties.warningMessage} onChange={noop} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly text-line", () => {
		const { container } = render(<TextLineStateless readonly />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly with value text-line", () => {
		const { container } = render(<TextLineStateless readonly value="test readonly with value" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled text-line", () => {
		const { container } = render(<TextLineStateless disabled />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render text-line events", () => {
		const onClickSpy = vi.fn();
		const onDoubleClickSpy = vi.fn();
		const onWrapperClickSpy = vi.fn();
		const onFocusSpy = vi.fn();
		const onBlurSpy = vi.fn();
		const onInputSpy = vi.fn();
		const onKeyDownSpy = vi.fn();
		const onKeyUpSpy = vi.fn();

		const { container } = render(
			<TextLineStateless
				onClick={onClickSpy}
				onDoubleClick={onDoubleClickSpy}
				onWrapperClick={onWrapperClickSpy}
				onFocus={onFocusSpy}
				onBlur={onBlurSpy}
				onInput={onInputSpy}
				onKeyDown={onKeyDownSpy}
				onKeyUp={onKeyUpSpy}
			/>
		);
		const wrapper = getByDataRole(container, `${baseTextLineDataRole}-input-wrapper`);
		const input = getByDataRole(container, `${baseTextLineDataRole}-input`);

		fireEvent.click(wrapper);
		expect(onWrapperClickSpy).toHaveBeenCalledTimes(1);

		fireEvent.click(input);
		expect(onClickSpy).toHaveBeenCalledTimes(1);

		fireEvent.focus(input);
		expect(onFocusSpy).toHaveBeenCalledTimes(1);

		fireEvent.blur(input);
		expect(onBlurSpy).toHaveBeenCalledTimes(1);

		fireEvent.input(input);
		expect(onInputSpy).toHaveBeenCalledTimes(1);

		fireEvent.doubleClick(input);
		expect(onDoubleClickSpy).toHaveBeenCalledTimes(1);

		fireEvent.keyDown(input, { key: Key.Enter });
		expect(onKeyDownSpy).toHaveBeenCalledTimes(1);

		fireEvent.keyUp(input);
		expect(onKeyUpSpy).toHaveBeenCalledTimes(1);
	});

	test("onChange is called correctly", () => {
		const onChangeSpy = vi.fn();

		const InputWrapper = () => {
			const [value, setValue] = useState("");

			return (
				<TextLineStateless
					value={value}
					onChange={(event) => {
						onChangeSpy(event);
						setValue(event.target.value);
					}}
				/>
			);
		};

		const { container } = render(<InputWrapper />);
		const input = getByDataRole(container, `${baseTextLineDataRole}-input`) as HTMLInputElement;

		// make sure that triggering input change via JavaScript works
		input.value = "test";
		fireEvent.focus(input);
		expect(input.value).toBe("test");

		// and of course normal onChange should work too
		fireEvent.change(input, { target: { value: "test onChange event" } });
		fireEvent.focus(input);
		expect(input.value).toBe("test onChange event");
	});
});
