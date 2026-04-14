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

import type { ChangeEvent, FocusEvent, ReactElement, ReactNode } from "react";
import { useState } from "react";
import { getByDataRole, render } from "test-utils";
import { describe, vi, expect, test } from "vitest";
import { waitFor } from "@testing-library/dom";
import { userEvent } from "vitest/browser";

import { noop } from "../../../common/main/utils.js";
import { TextField } from "../../text-field/index.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { BufferedInput, HTMLInputAdapter } from "../main/buffered.view.js";

interface MockInputProps {
	onChange?(ev: ChangeEvent<HTMLInputElement>): void;
	onBlur?(ev: FocusEvent<HTMLInputElement>): void;
}

describe("com.mgmtp.a12.widgets.input.buffered-input", () => {
	function Mock(props: MockInputProps): ReactElement {
		return <input data-role="mock-element" onChange={props.onChange} onBlur={props.onBlur} />;
	}

	const BufferedStringInput = BufferedInput(HTMLInputAdapter(Mock));
	test("rendering-children", () => {
		const bufferedElement = render(<BufferedStringInput onValueSubmit={noop} initialValue="100" />);

		const bufferedElementInput = getByDataRole(bufferedElement.container, "mock-element");

		const mockElement = render(<Mock />);
		const mockElementInput = getByDataRole(mockElement.container, "mock-element");

		// Buffered input should be the same as unbuffered input
		expect(mockElementInput).toStrictEqual(bufferedElementInput);
	});

	/**
	 * `onValueSubmit` callback:
	 * - should be triggered when pressing ENTER or blurring the input with value changed
	 * - should not be triggered when the input has not been edited
	 * - should not be triggered when the input has been edited, but the value is still the same as before
	 */
	test("submit-value", async () => {
		const BufferedStringInput = BufferedInput(HTMLInputAdapter(Mock));
		const onValueSubmitSpy = vi.fn();

		const bufferedElement = render(
			<BufferedStringInput initialValue="50" submitOnEnter onValueSubmit={onValueSubmitSpy} />
		);
		const bufferedElementInput = getByDataRole(bufferedElement.container, "mock-element");

		// onValueSubmit should be called when pressing ENTER with value changed
		await userEvent.click(bufferedElementInput);
		await userEvent.fill(bufferedElementInput, "100");
		await userEvent.keyboard("{Enter}");
		expect(onValueSubmitSpy).toHaveBeenCalledTimes(1);

		// onValueSubmit should not be called when input has been edited with the same value
		await userEvent.fill(bufferedElementInput, "100");
		await userEvent.tab();
		expect(onValueSubmitSpy).toHaveBeenCalledTimes(1);

		// onValueSubmit should not be called when input has not been edited
		await userEvent.click(bufferedElementInput);
		await userEvent.keyboard("{Enter}");
		expect(onValueSubmitSpy).toHaveBeenCalledTimes(1);

		// onValueSubmit should be called when blurring the input with value changed
		await userEvent.fill(bufferedElementInput, "200");
		await userEvent.tab();
		expect(onValueSubmitSpy).toHaveBeenCalledTimes(2);
	});

	test("onValueSubmit is called when browser autofills", async () => {
		const onValueSubmitSpy = vi.fn();

		const bufferedElement = render(<BufferedStringInput onValueSubmit={onValueSubmitSpy} />);
		const bufferedElementInput = getByDataRole(bufferedElement.container, "mock-element") as HTMLInputElement;

		await userEvent.fill(bufferedElementInput, "autofilled value");
		expect(onValueSubmitSpy).toHaveBeenCalledTimes(1);
		expect(bufferedElementInput.value).toBe("autofilled value");
	});

	test("Should keep the value after blurring", async () => {
		const BufferedStringInput = BufferedInput(HTMLInputAdapter(TextField));

		const bufferedElement = render(<BufferedStringInput onValueSubmit={noop} />);
		const bufferedElementInput = getByDataRole(bufferedElement.container, DataRoles.Textline.Input);

		await userEvent.click(bufferedElementInput);
		await userEvent.type(bufferedElementInput, "test value");
		await userEvent.tab();
		expect((bufferedElementInput as HTMLInputElement).value).toBe("test value");
	});

	test("prop `value` should have higher priority after blurring", async () => {
		function Mock(props: MockInputProps & { value?: string }): ReactElement {
			return <input data-role="mock-element" onChange={props.onChange} onBlur={props.onBlur} value={props.value} />;
		}

		const BufferedStringInput = BufferedInput(HTMLInputAdapter(Mock));

		const onValueSubmitSpy = vi.fn();

		const { container } = render(<BufferedStringInput value="de" onValueSubmit={onValueSubmitSpy} />);
		const bufferedElementInput = getByDataRole(container, "mock-element") as HTMLInputElement;

		await userEvent.click(bufferedElementInput);
		await userEvent.fill(bufferedElementInput, "en");
		await userEvent.tab();

		expect(onValueSubmitSpy).toHaveBeenCalledTimes(1);
		expect((getByDataRole(container, "mock-element") as HTMLInputElement).value).toBe("de");
	});

	test("onValueSubmit should not be called multiple times when focusing or blurring", async () => {
		const onValueSubmitSpy = vi.fn();
		const onValueChangeSpy = vi.fn();

		const TestComponent = (): ReactNode => {
			const [value, setValue] = useState<string | undefined>("Test");

			return (
				<BufferedStringInput
					value={value}
					onValueSubmit={(newValue) => {
						onValueSubmitSpy(newValue);
						setTimeout(() => {
							setValue(newValue);
						}, 100);
					}}
					onValueChange={onValueChangeSpy}
					submitOnEnter
				/>
			);
		};

		const bufferedElement = render(<TestComponent />);
		const bufferedElementInput = getByDataRole(bufferedElement.container, "mock-element") as HTMLInputElement;

		await userEvent.click(bufferedElementInput);
		await userEvent.fill(bufferedElementInput, "New Test Value");
		await userEvent.keyboard("{Enter}");

		await waitFor(
			() => {
				expect(onValueSubmitSpy).toHaveBeenCalledTimes(1);
				expect(onValueSubmitSpy).toHaveBeenCalledWith("New Test Value");
			},
			{ timeout: 150 }
		);

		await userEvent.fill(bufferedElementInput, "New Test Value 2");
		await userEvent.tab();

		await waitFor(
			() => {
				expect(onValueSubmitSpy).toHaveBeenCalledTimes(2);
				expect(onValueSubmitSpy).toHaveBeenCalledWith("New Test Value 2");
			},
			{ timeout: 150 }
		);
	});
});
