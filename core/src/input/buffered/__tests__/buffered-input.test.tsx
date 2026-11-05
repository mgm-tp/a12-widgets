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

import { waitFor } from "@testing-library/dom";
import type { ChangeEvent, FocusEvent, InputHTMLAttributes, ReactElement, ReactNode, Ref, RefObject } from "react";
import { createRef, useState } from "react";
import { getByDataRole, render } from "test-utils";
import { describe, vi, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { noop } from "../../../common/main/utils.js";
import { TextField } from "../../text-field/index.js";
import { BufferedInput, HTMLInputAdapter } from "../main/buffered.view.js";

interface MockInputProps {
	onChange?(ev: ChangeEvent<HTMLInputElement>): void;
	onBlur?(ev: FocusEvent<HTMLInputElement>): void;
}

interface ForwardingMockProps extends InputHTMLAttributes<HTMLInputElement> {
	inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement>;
	alwaysSubmit?: boolean;
}

/**
 * Immediate input that behaves like the real widgets: it hands the DOM node to `inputRef`
 * (so the buffer can tell a focused edit from an autofill), stays controlled like `TextField` does
 * and passes every other prop to the `<input>`.
 */
function ForwardingMock({
	inputRef,
	alwaysSubmit: _alwaysSubmit,
	value = "",
	...rest
}: ForwardingMockProps): ReactElement {
	return <input data-role="mock-element" ref={inputRef as Ref<HTMLInputElement>} value={value} {...rest} />;
}

/** Changes the value like a browser autofill does: without focusing the input. */
function autofill(input: HTMLInputElement, value: string): void {
	const nativeValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
	nativeValueSetter?.call(input, value);
	input.dispatchEvent(new Event("input", { bubbles: true }));
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
		const bufferedElementInput = getByDataRole(bufferedElement.container, DataRoles.TextField.Input);

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

	describe("buffered editing", () => {
		const BufferedTextInput = BufferedInput(HTMLInputAdapter(ForwardingMock));

		function getInput(container: HTMLElement): HTMLInputElement {
			return getByDataRole(container, "mock-element") as HTMLInputElement;
		}

		test("calls onValueSubmit with the buffered value on Enter and on blur", async () => {
			const onValueSubmit = vi.fn();
			const { container } = render(<BufferedTextInput submitOnEnter onValueSubmit={onValueSubmit} />);
			const input = getInput(container);

			await userEvent.click(input);
			await userEvent.fill(input, "first");
			await userEvent.keyboard("{Enter}");
			expect(onValueSubmit).toHaveBeenCalledTimes(1);
			expect(onValueSubmit).toHaveBeenLastCalledWith("first");

			await userEvent.fill(input, "second");
			await userEvent.tab();
			expect(onValueSubmit).toHaveBeenCalledTimes(2);
			expect(onValueSubmit).toHaveBeenLastCalledWith("second");
			expect(input.value).toBe("second");
		});

		test("reports every keystroke through onValueChange and holds onValueSubmit until the input is submitted", async () => {
			const onValueChange = vi.fn();
			const onValueSubmit = vi.fn();
			const { container } = render(<BufferedTextInput onValueChange={onValueChange} onValueSubmit={onValueSubmit} />);
			const input = getInput(container);

			await userEvent.click(input);
			await userEvent.type(input, "abc");

			expect(onValueChange.mock.calls).toEqual([["a"], ["ab"], ["abc"]]);
			expect(onValueSubmit).not.toHaveBeenCalled();
			expect(input.value).toBe("abc");

			await userEvent.tab();
			expect(onValueSubmit).toHaveBeenCalledTimes(1);
			expect(onValueSubmit).toHaveBeenCalledWith("abc");
			expect(onValueChange).toHaveBeenCalledTimes(3);
		});

		test("calls onSubmit on every blur and Enter even when the value is unchanged", async () => {
			const onSubmit = vi.fn();
			const onValueSubmit = vi.fn();
			const { container } = render(
				<BufferedTextInput value="de" submitOnEnter onSubmit={onSubmit} onValueSubmit={onValueSubmit} />
			);
			const input = getInput(container);

			await userEvent.click(input);
			await userEvent.keyboard("{Enter}");
			expect(onSubmit).toHaveBeenCalledTimes(1);

			await userEvent.tab();
			expect(onSubmit).toHaveBeenCalledTimes(2);
			expect(onValueSubmit).not.toHaveBeenCalled();
		});

		test("submits the unchanged value on blur when alwaysSubmit is set", async () => {
			const onValueSubmit = vi.fn();
			const { container } = render(<BufferedTextInput value="de" alwaysSubmit onValueSubmit={onValueSubmit} />);
			const input = getInput(container);

			await userEvent.click(input);
			await userEvent.tab();
			expect(onValueSubmit).toHaveBeenCalledTimes(1);
			expect(onValueSubmit).toHaveBeenLastCalledWith("de");

			await userEvent.click(input);
			await userEvent.tab();
			expect(onValueSubmit).toHaveBeenCalledTimes(2);
			expect(input.value).toBe("de");
		});

		test("Enter does not submit unless submitOnEnter is set", async () => {
			const onValueSubmit = vi.fn();
			const { container } = render(<BufferedTextInput onValueSubmit={onValueSubmit} />);
			const input = getInput(container);

			await userEvent.click(input);
			await userEvent.fill(input, "typed");
			await userEvent.keyboard("{Enter}");
			expect(onValueSubmit).not.toHaveBeenCalled();
			expect(input.value).toBe("typed");

			await userEvent.tab();
			expect(onValueSubmit).toHaveBeenCalledTimes(1);
			expect(onValueSubmit).toHaveBeenCalledWith("typed");
		});

		test("prefers initialValue over value at mount", async () => {
			const onValueSubmit = vi.fn();
			const { container } = render(
				<BufferedTextInput initialValue="draft" value="stored" onValueSubmit={onValueSubmit} />
			);
			const input = getInput(container);

			expect(input.value).toBe("draft");

			// the initial value counts as already submitted
			await userEvent.click(input);
			await userEvent.tab();
			expect(onValueSubmit).not.toHaveBeenCalled();
		});

		test("adopts an external value update while the buffer is clean", async () => {
			const onValueSubmit = vi.fn();
			const { container, rerender } = render(<BufferedTextInput value="de" onValueSubmit={onValueSubmit} />);
			const input = getInput(container);

			rerender(<BufferedTextInput value="en" onValueSubmit={onValueSubmit} />);
			expect(input.value).toBe("en");

			// the adopted value counts as already submitted
			await userEvent.click(input);
			await userEvent.tab();
			expect(onValueSubmit).not.toHaveBeenCalled();
		});

		test("an external value update replaces the buffer even while the user is typing", async () => {
			const onValueSubmit = vi.fn();
			const { container, rerender } = render(<BufferedTextInput value="de" onValueSubmit={onValueSubmit} />);
			const input = getInput(container);

			await userEvent.click(input);
			await userEvent.fill(input, "typing");
			expect(input.value).toBe("typing");

			rerender(<BufferedTextInput value="fr" onValueSubmit={onValueSubmit} />);
			expect(input.value).toBe("fr");

			await userEvent.tab();
			expect(onValueSubmit).not.toHaveBeenCalled();
			expect(input.value).toBe("fr");
		});

		test("a parent re-render with unchanged props keeps the edited buffer", async () => {
			const onValueSubmit = vi.fn();
			const { container, rerender } = render(<BufferedTextInput value="de" onValueSubmit={onValueSubmit} />);
			const input = getInput(container);

			await userEvent.click(input);
			await userEvent.fill(input, "edited");

			rerender(<BufferedTextInput value="de" onValueSubmit={onValueSubmit} />);
			expect(input.value).toBe("edited");
			expect(onValueSubmit).not.toHaveBeenCalled();

			await userEvent.tab();
			expect(onValueSubmit).toHaveBeenCalledTimes(1);
			expect(onValueSubmit).toHaveBeenCalledWith("edited");
		});

		test("keeps the submitted value once the parent accepts it and does not submit it again", async () => {
			const onValueSubmit = vi.fn();

			function Controlled(): ReactElement {
				const [value, setValue] = useState("de");

				return (
					<BufferedTextInput
						value={value}
						onValueSubmit={(newValue) => {
							onValueSubmit(newValue);
							setValue(newValue ?? "");
						}}
					/>
				);
			}

			const { container } = render(<Controlled />);
			const input = getInput(container);

			await userEvent.click(input);
			await userEvent.fill(input, "en");
			await userEvent.tab();
			expect(onValueSubmit).toHaveBeenCalledTimes(1);
			expect(onValueSubmit).toHaveBeenCalledWith("en");
			expect(input.value).toBe("en");

			await userEvent.click(input);
			await userEvent.tab();
			expect(onValueSubmit).toHaveBeenCalledTimes(1);
			expect(input.value).toBe("en");
		});

		test("uses the latest handlers after they are swapped between renders", async () => {
			const firstSubmit = vi.fn();
			const firstChange = vi.fn();
			const secondSubmit = vi.fn();
			const secondChange = vi.fn();
			const { container, rerender } = render(
				<BufferedTextInput onValueChange={firstChange} onValueSubmit={firstSubmit} />
			);
			const input = getInput(container);

			await userEvent.click(input);
			await userEvent.fill(input, "one");
			expect(firstChange).toHaveBeenCalledWith("one");

			rerender(<BufferedTextInput onValueChange={secondChange} onValueSubmit={secondSubmit} />);

			await userEvent.fill(input, "two");
			await userEvent.tab();

			expect(secondChange).toHaveBeenCalledWith("two");
			expect(secondSubmit).toHaveBeenCalledTimes(1);
			expect(secondSubmit).toHaveBeenCalledWith("two");
			expect(firstChange).toHaveBeenCalledTimes(1);
			expect(firstSubmit).not.toHaveBeenCalled();
		});

		test("forwards the underlying input through a callback inputRef", () => {
			const inputRef = vi.fn();
			const { container, rerender, unmount } = render(
				<BufferedTextInput inputRef={inputRef} value="initial" onValueSubmit={noop} />
			);
			const input = getInput(container);

			expect(inputRef).toHaveBeenLastCalledWith(input);

			rerender(<BufferedTextInput inputRef={inputRef} value="changed" onValueSubmit={noop} />);
			expect(inputRef).toHaveBeenLastCalledWith(input);

			unmount();
			expect(inputRef).toHaveBeenLastCalledWith(null);
		});

		test("forwards the underlying input through an object inputRef", () => {
			const inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null> = createRef();
			const { container, unmount } = render(<BufferedTextInput inputRef={inputRef} onValueSubmit={noop} />);

			expect(inputRef.current).toBe(getInput(container));

			unmount();
			expect(inputRef.current).toBeNull();
		});

		test("does not submit an edited buffer on unmount", async () => {
			const onValueSubmit = vi.fn();
			const { container, unmount } = render(<BufferedTextInput onValueSubmit={onValueSubmit} />);
			const input = getInput(container);

			await userEvent.click(input);
			await userEvent.fill(input, "unsaved");

			unmount();
			expect(onValueSubmit).not.toHaveBeenCalled();
		});

		test("does not buffer or submit while disabled", async () => {
			const onValueChange = vi.fn();
			const onValueSubmit = vi.fn();
			const { container } = render(
				<BufferedTextInput
					value="de"
					disabled
					submitOnEnter
					alwaysSubmit
					onValueChange={onValueChange}
					onValueSubmit={onValueSubmit}
				/>
			);
			const input = getInput(container);

			expect(input).toBeDisabled();

			// Playwright refuses to click a disabled element; force it to prove the disabled input stays inert
			await userEvent.click(input, { force: true });
			await userEvent.keyboard("typed{Enter}");
			await userEvent.tab();

			expect(input.value).toBe("de");
			expect(onValueChange).not.toHaveBeenCalled();
			expect(onValueSubmit).not.toHaveBeenCalled();
		});

		test("does not change or submit the value while readOnly", async () => {
			const onValueChange = vi.fn();
			const onValueSubmit = vi.fn();
			const { container } = render(
				<BufferedTextInput value="de" readOnly onValueChange={onValueChange} onValueSubmit={onValueSubmit} />
			);
			const input = getInput(container);

			expect(input).toHaveAttribute("readonly");

			await userEvent.click(input);
			await userEvent.keyboard("typed");
			await userEvent.tab();

			expect(input.value).toBe("de");
			expect(onValueChange).not.toHaveBeenCalled();
			expect(onValueSubmit).not.toHaveBeenCalled();
		});

		test("passes id, className and ARIA attributes through and keeps buffered-only props off the DOM", () => {
			const { container } = render(
				<BufferedTextInput
					id="buffered-id"
					className="buffered-class"
					aria-label="Buffered label"
					aria-invalid
					initialValue="draft"
					alwaysSubmit
					submitOnEnter
					onValueSubmit={noop}
				/>
			);
			const input = getInput(container);

			expect(input).toHaveAttribute("id", "buffered-id");
			expect(input).toHaveClass("buffered-class");
			expect(input).toHaveAttribute("aria-label", "Buffered label");
			expect(input).toHaveAttribute("aria-invalid", "true");
			expect(input).not.toHaveAttribute("initialvalue");
			expect(input).not.toHaveAttribute("submitonenter");
		});

		test("a change while the input is not focused (autofill) submits immediately without buffering", () => {
			const onValueChange = vi.fn();
			const onSubmit = vi.fn();
			const onValueSubmit = vi.fn();
			const { container } = render(
				<BufferedTextInput value="de" onValueChange={onValueChange} onSubmit={onSubmit} onValueSubmit={onValueSubmit} />
			);
			const input = getInput(container);

			expect(document.activeElement).not.toBe(input);
			autofill(input, "autofilled");

			expect(onValueSubmit).toHaveBeenCalledTimes(1);
			expect(onValueSubmit).toHaveBeenCalledWith("autofilled");
			expect(onSubmit).toHaveBeenCalledTimes(1);
			expect(onValueChange).not.toHaveBeenCalled();
		});

		test("an unfocused change equal to the controlled value is not submitted", () => {
			const onValueSubmit = vi.fn();
			const { container } = render(<BufferedTextInput initialValue="draft" value="de" onValueSubmit={onValueSubmit} />);
			const input = getInput(container);

			expect(input.value).toBe("draft");
			autofill(input, "de");

			expect(onValueSubmit).not.toHaveBeenCalled();
		});
	});
});
