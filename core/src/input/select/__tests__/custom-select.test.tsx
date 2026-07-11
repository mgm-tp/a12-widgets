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

import {
	findAllByDataRole,
	findByDataRole,
	fireEvent,
	getAllByDataRole,
	getByDataRole,
	queryByDataRole,
	render,
	setupDevice,
	waitFor
} from "test-utils";
import { Key } from "ts-key-enum";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { useState } from "react";
import { userEvent } from "vitest/browser";
import type { ReactNode } from "react";

import { Icon } from "../../../icon/main/icon.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { inputWithSuffixName } from "../../../common/main/utils.js";
import { TextField } from "../../text-field/text-field.view.js";
import type { DropDownItem } from "../../../dropdown/main/template/dropdown.tpl.api.js";

import { CustomSelect } from "../main/custom-select.view.js";
import type { CustomSelectProps } from "../main/select.api.js";

const ITEMS = [
	{ label: "Top", graphic: <Icon>vertical_align_top</Icon> },
	{ label: "Middle", graphic: <Icon>vertical_align_center</Icon> },
	{ label: "Bottom", graphic: <Icon>vertical_align_bottom</Icon> },
	{ label: "Center", graphic: <Icon>format_align_center</Icon> },
	{ label: "Justify", graphic: <Icon>format_align_justify</Icon>, disabled: true },
	{ label: "Left", graphic: <Icon>format_align_left</Icon> },
	{ label: "Right", graphic: <Icon>format_align_right</Icon> },
	{ label: "Decrease", graphic: <Icon>format_indent_decrease</Icon> },
	{ label: "Increase", graphic: <Icon>format_indent_increase</Icon> }
].map((item) => ({ ...item, value: item.label.toLowerCase(), title: item.label }));

const properties: Partial<CustomSelectProps> = {
	id: "test-id",
	className: "test-classname",
	style: { backgroundColor: "red" },
	helperText: "Test Helper Text",
	label: "Test Label",
	items: ITEMS,
	value: "test value",
	placeholder: "test placeholder",
	errorMessage: "Test error message",
	warningMessage: "Test warning message",
	infoMessage: "Test info message",
	tooltips: <div className="test-tooltip">Test tooltip</div>
};

describe("com.mgmtp.a12.widgets.input.custom.select", () => {
	describe("desktop", () => {
		test("render base custom select", () => {
			const { container } = render(
				<CustomSelect
					id={properties.id}
					className={properties.className}
					style={properties.style}
					label={properties.label}
					items={ITEMS}
				/>
			);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render base custom select with value of empty string", () => {
			const itemWithEmptyStringValue = {
				label: "Empty string value",
				value: "",
				graphic: <Icon>visibility</Icon>,
				title: "Empty string value"
			};

			const ItemsWithEmptyString = [...ITEMS, itemWithEmptyStringValue];

			const { container } = render(
				<CustomSelect
					id={properties.id}
					className={properties.className}
					style={properties.style}
					label={properties.label}
					value=""
					items={ItemsWithEmptyString}
				/>
			);
			const input = getByDataRole(container, DataRoles.Select.Input) as HTMLInputElement;

			expect(input.value).toBe(itemWithEmptyStringValue.label);
		});

		test("render select with hidden label", () => {
			const { container } = render(<CustomSelect label={properties.label} hideLabel items={ITEMS} />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render warning select", () => {
			const { container } = render(<CustomSelect items={ITEMS} warning warningMessage={properties.warningMessage} />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render error select", () => {
			const { container } = render(<CustomSelect items={ITEMS} error errorMessage={properties.errorMessage} />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render info select", () => {
			const { container } = render(<CustomSelect items={ITEMS} info infoMessage={properties.infoMessage} />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render select with helper text", () => {
			const { container } = render(<CustomSelect items={ITEMS} helperText={properties.helperText} />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render readonly select", () => {
			const { container } = render(<CustomSelect items={ITEMS} readonly />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render disabled select", () => {
			const { container } = render(<CustomSelect items={ITEMS} disabled />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render select with tooltip", () => {
			const { container } = render(<CustomSelect items={ITEMS} tooltips={properties.tooltips} />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render select with tooltip in new line", () => {
			const { container } = render(
				<CustomSelect items={ITEMS} tooltips={properties.tooltips} breakTooltipsToNewLine />
			);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render select with options group", () => {
			const optionGroupItems = [
				{
					label: "Programming languages",
					children: [
						{ value: "Java", label: "Java" },
						{ value: "Javascript", label: "Javascript" }
					]
				},
				{
					label: "Editors",
					children: [
						{ value: "VSCode", label: "VSCode" },
						{ value: "IntelliJ", label: "IntelliJ" }
					]
				}
			];
			const { container } = render(<CustomSelect items={optionGroupItems} />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("simulate mouse events", async () => {
			const selectRefSpy = vi.fn();
			const onValueChangedSpy = vi.fn();
			const onSelectSpy = vi.fn();
			const onFocusSpy = vi.fn();
			const onBlurSpy = vi.fn();

			const { container } = render(
				<CustomSelect
					selectRef={selectRefSpy}
					onFocus={onFocusSpy}
					onBlur={onBlurSpy}
					onSelect={onSelectSpy}
					onValueChanged={onValueChangedSpy}
					items={ITEMS}
				/>
			);

			expect(selectRefSpy).toHaveBeenCalledTimes(1);

			const input = getByDataRole(container, DataRoles.Select.Input);

			fireEvent.focus(input);
			expect(onFocusSpy).toHaveBeenCalledTimes(1);

			fireEvent.blur(input);
			expect(onBlurSpy).toHaveBeenCalledTimes(1);

			fireEvent.click(input);
			const dropdownItems = await findAllByDataRole(container, DataRoles.Dropdown.Item);
			fireEvent.click(dropdownItems[0]);

			await waitFor(() => {
				expect(onSelectSpy).toHaveBeenCalledWith(ITEMS[0].value);
				expect(onValueChangedSpy).toHaveBeenCalledWith(ITEMS[0].value);
			});
		});

		test("simulate keyboard event to select item", () => {
			const onValueChangedSpy = vi.fn();
			const onFocusSpy = vi.fn();

			const { container } = render(
				<CustomSelect onFocus={onFocusSpy} onValueChanged={onValueChangedSpy} items={ITEMS} />
			);

			const input = getByDataRole(container, DataRoles.Select.Input);

			[
				{ key: Key.Tab },
				{ key: Key.Tab, shiftKey: true },
				{ key: Key.Escape },
				{ key: " " },
				{ key: Key.Enter }
			].forEach((keyOption) => {
				fireEvent.click(input);
				fireEvent.keyDown(input, { key: Key.ArrowDown });
				fireEvent.keyDown(input, keyOption);

				expect(onValueChangedSpy).toHaveBeenCalledTimes(1);
				vi.clearAllMocks();
			});
		});

		test("Should update the selected value when the items change.", () => {
			const value = "mgm-widgets";

			const { container, rerender } = render(
				<CustomSelect
					id={properties.id}
					className={properties.className}
					style={properties.style}
					label={properties.label}
					items={ITEMS}
					value={value}
				/>
			);

			const input = getByDataRole(container, inputWithSuffixName(DataRoles.Select)!) as HTMLInputElement;
			expect(input.value).toBe("");

			rerender(
				<CustomSelect
					id={properties.id}
					className={properties.className}
					style={properties.style}
					label={properties.label}
					items={[...ITEMS, { label: value, value }]}
					value={value}
				/>
			);

			expect(input.value).toBe(value);
		});

		test("should open dropdown when openOnFocus is true and input is focused", async () => {
			const { baseElement } = render(<CustomSelect items={ITEMS} openOnFocus />);

			await userEvent.tab();

			expect(await findByDataRole(baseElement, DataRoles.Dropdown)).toBeTruthy();
		});

		test("should not open dropdown when openOnFocus is false and input is focused", async () => {
			const { baseElement } = render(<CustomSelect items={ITEMS} openOnFocus={false} />);

			await userEvent.tab();

			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();
		});

		test("should handle dropdown visibility changes", async () => {
			const onVisibilityChangeSpy = vi.fn();

			const { container, baseElement } = render(
				<CustomSelect items={ITEMS} onVisibilityChange={onVisibilityChangeSpy} />
			);

			const input = getByDataRole(container, DataRoles.Select.Input);

			await userEvent.click(input);

			expect(await findByDataRole(baseElement, DataRoles.Dropdown)).toBeTruthy();

			fireEvent.keyDown(input, { key: Key.Escape });

			await waitFor(() => {
				expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();
			});

			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();
		});

		test("should handle custom keysToOpen", async () => {
			const { container, baseElement } = render(<CustomSelect items={ITEMS} keysToOpen={[Key.Control, Key.Alt]} />);

			const input = getByDataRole(container, DataRoles.Select.Input);

			fireEvent.keyDown(input, { key: Key.ArrowDown });
			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();

			fireEvent.keyDown(input, { key: " " });
			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();

			fireEvent.keyDown(input, { key: Key.Control });
			expect(await findByDataRole(baseElement, DataRoles.Dropdown)).toBeTruthy();

			fireEvent.keyDown(input, { key: Key.Escape });

			fireEvent.keyDown(input, { key: Key.Alt });
			expect(await findByDataRole(baseElement, DataRoles.Dropdown)).toBeTruthy();
		});

		test("should handle custom keysToClose", async () => {
			const { container, baseElement } = render(
				<CustomSelect items={ITEMS} keysToClose={[Key.Delete, Key.Backspace]} />
			);

			const input = getByDataRole(container, DataRoles.Select.Input);

			await userEvent.click(input);
			expect(await findByDataRole(baseElement, DataRoles.Dropdown)).toBeTruthy();

			fireEvent.keyDown(input, { key: Key.Escape });
			expect(await findByDataRole(baseElement, DataRoles.Dropdown)).toBeTruthy();

			fireEvent.keyDown(input, { key: Key.Tab });
			expect(await findByDataRole(baseElement, DataRoles.Dropdown)).toBeTruthy();

			fireEvent.keyDown(input, { key: Key.Delete });
			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();
		});

		test("should prevent dropdown from opening when disabled", () => {
			const { container, baseElement } = render(<CustomSelect items={ITEMS} disabled />);

			const input = getByDataRole(container, DataRoles.Select.Input);

			fireEvent.click(input);
			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();

			fireEvent.keyDown(input, { key: Key.ArrowDown });
			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();
		});

		test("should prevent dropdown from opening when readonly", async () => {
			const { container, baseElement } = render(<CustomSelect items={ITEMS} readonly />);

			const input = getByDataRole(container, DataRoles.Select.Input);

			await userEvent.click(input);
			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();

			fireEvent.keyDown(input, { key: Key.ArrowDown });
			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();
		});

		test("should handle keyboard navigation with letter keys", () => {
			const onValueChangedSpy = vi.fn();

			const { container } = render(<CustomSelect items={ITEMS} onValueChanged={onValueChangedSpy} />);

			const input = getByDataRole(container, DataRoles.Select.Input);

			fireEvent.keyPress(input, { key: "t", charCode: 116 });
			expect(onValueChangedSpy).toHaveBeenCalledWith("top");

			fireEvent.keyPress(input, { key: "m", charCode: 109 });
			expect(onValueChangedSpy).toHaveBeenCalledWith("middle");
		});

		test("should handle keyboard navigation with letter keys when dropdown is open", async () => {
			const { container, baseElement } = render(<CustomSelect items={ITEMS} />);

			const input = getByDataRole(container, DataRoles.Select.Input);

			await userEvent.click(input);
			expect(await findByDataRole(baseElement, DataRoles.Dropdown)).toBeTruthy();

			const keypressEvent = new KeyboardEvent("keypress", { key: "b", bubbles: true });
			fireEvent(input, keypressEvent);

			expect(await findByDataRole(baseElement, DataRoles.Dropdown)).toBeTruthy();
		});

		test("should not change value with letter key when no matching item", () => {
			const onValueChangedSpy = vi.fn();

			const { container } = render(<CustomSelect items={ITEMS} onValueChanged={onValueChangedSpy} />);

			const input = getByDataRole(container, DataRoles.Select.Input);

			const keypressEvent = new KeyboardEvent("keypress", { key: "x", bubbles: true });
			fireEvent(input, keypressEvent);
			expect(onValueChangedSpy).not.toHaveBeenCalled();
		});

		test("should show prefix graphic when showPrefixes is true", () => {
			const { container } = render(<CustomSelect items={ITEMS} value="top" showPrefixes />);

			const prefix = queryByDataRole(container, DataRoles.Select.Prefix);
			expect(prefix).toBeTruthy();
		});

		test("should not show prefix graphic when showPrefixes is false", () => {
			const { container } = render(<CustomSelect items={ITEMS} value="top" showPrefixes={false} />);

			const prefix = queryByDataRole(container, DataRoles.Select.Prefix);
			expect(prefix).toBeNull();
		});

		test("should handle horizontalMode prop", async () => {
			const { container, baseElement } = render(<CustomSelect items={ITEMS} horizontalMode />);

			const input = getByDataRole(container, DataRoles.Select.Input);
			await userEvent.click(input);

			const dropdown = await findByDataRole(baseElement, DataRoles.Dropdown);
			expect(dropdown).toBeTruthy();
		});

		test("should handle selectRef callback", () => {
			const selectRefSpy = vi.fn();

			render(<CustomSelect items={ITEMS} selectRef={selectRefSpy} />);

			expect(selectRefSpy).toHaveBeenCalledTimes(1);
			const receivedElement = selectRefSpy.mock.calls[0][0];

			expect(receivedElement).toBeTruthy();
			expect(receivedElement.tagName).toBeDefined();
		});

		test("should handle selectWrapperId prop", () => {
			const customId = "custom-wrapper-id";
			const { container } = render(<CustomSelect items={ITEMS} id="test" selectWrapperId={customId} />);

			expect(container).toBeTruthy();
		});

		test("should handle focusBack false", async () => {
			const { container, baseElement } = render(<CustomSelect items={ITEMS} focusBack={false} />);

			const input = getByDataRole(container, DataRoles.Select.Input);
			await userEvent.click(input);

			const dropdownItems = await findAllByDataRole(baseElement, DataRoles.Dropdown.Item);
			await userEvent.click(dropdownItems[0]);

			await waitFor(() => {
				expect(input.matches(":focus")).toBeFalsy();
			});
		});

		test("should handle onSelect callback", async () => {
			const onSelectSpy = vi.fn();

			const { container, baseElement } = render(<CustomSelect items={ITEMS} onSelect={onSelectSpy} />);

			const input = getByDataRole(container, DataRoles.Select.Input);
			await userEvent.click(input);

			const dropdownItems = await findAllByDataRole(baseElement, DataRoles.Dropdown.Item);

			await userEvent.click(dropdownItems[0]);

			await waitFor(() => {
				expect(onSelectSpy).toHaveBeenCalledWith(ITEMS[0].value);
			});
		});

		test("should handle mouseDown event on input", () => {
			const { container } = render(<CustomSelect items={ITEMS} />);

			const input = getByDataRole(container, DataRoles.Select.Input);

			const mouseDownEvent = new MouseEvent("mousedown", { bubbles: true });
			const preventDefaultSpy = vi.spyOn(mouseDownEvent, "preventDefault");

			fireEvent(input, mouseDownEvent);

			expect(preventDefaultSpy).toHaveBeenCalled();
		});

		test("should handle input with value but no matching item", () => {
			const { container } = render(<CustomSelect items={ITEMS} value="non-existent-value" />);

			const input = getByDataRole(container, DataRoles.Select.Input) as HTMLInputElement;
			expect(input.value).toBe("");
		});

		test("should handle items with children (option groups)", async () => {
			const optionGroupItems = [
				{
					label: "Group 1",
					children: [
						{ value: "item1", label: "Item 1" },
						{ value: "item2", label: "Item 2" }
					]
				}
			];

			const { container, baseElement } = render(<CustomSelect items={optionGroupItems} value="item1" />);

			const input = getByDataRole(container, DataRoles.Select.Input) as HTMLInputElement;
			expect(input.value).toBe("Item 1");

			await userEvent.click(input);
			const dropdown = await findByDataRole(baseElement, DataRoles.Dropdown);

			expect(dropdown).toBeTruthy();
		});

		test("should handle disabled items", () => {
			const itemsWithDisabled = [
				{ label: "Enabled", value: "enabled" },
				{ label: "Disabled", value: "disabled", disabled: true }
			];

			const onValueChangedSpy = vi.fn();

			const { container } = render(<CustomSelect items={itemsWithDisabled} onValueChanged={onValueChangedSpy} />);

			const input = getByDataRole(container, DataRoles.Select.Input);

			fireEvent.keyPress(input, { key: "d", charCode: 100 });
			expect(onValueChangedSpy).not.toHaveBeenCalled();

			fireEvent.keyPress(input, { key: "e", charCode: 101 });
			expect(onValueChangedSpy).toHaveBeenCalledWith("enabled");
		});

		test("should handle Escape key when custom keysToClose does not include Escape", async () => {
			const { container, baseElement } = render(<CustomSelect items={ITEMS} keysToClose={[Key.Delete]} />);

			const input = getByDataRole(container, DataRoles.Select.Input);
			await userEvent.click(input);

			expect(await findByDataRole(baseElement, DataRoles.Dropdown)).toBeTruthy();

			const escapeEvent = new KeyboardEvent("keydown", { key: Key.Escape, bubbles: true });
			const stopPropagationSpy = vi.spyOn(escapeEvent, "stopPropagation");

			fireEvent(input, escapeEvent);

			expect(stopPropagationSpy).toHaveBeenCalled();
			expect(await findByDataRole(baseElement, DataRoles.Dropdown)).toBeTruthy();
		});

		test("should handle placeholder and label together", () => {
			const { container } = render(<CustomSelect items={ITEMS} label="Test Label" placeholder="Test Placeholder" />);

			expect(container).toBeTruthy();
		});

		test("should handle aria attributes correctly", () => {
			const { container } = render(
				<CustomSelect
					items={ITEMS}
					id="test-select"
					ariaDescribedby="custom-description"
					errorMessage="Error message"
					warningMessage="Warning message"
					infoMessage="Info message"
				/>
			);

			const input = getByDataRole(container, DataRoles.Select.Input);

			expect(input.getAttribute("aria-describedby")).toContain("test-select-error");
			expect(input.getAttribute("aria-describedby")).toContain("test-select-warning");
			expect(input.getAttribute("aria-describedby")).toContain("test-select-info");
			expect(input.getAttribute("aria-describedby")).toContain("custom-description");
		});

		test("should handle component unmounting gracefully", () => {
			const { container, unmount } = render(<CustomSelect items={ITEMS} />);

			expect(container).toBeTruthy();
			expect(() => unmount()).not.toThrow();
		});

		test("should render and handle empty value when `items` has an `isEmptyValue` item", async () => {
			const itemsWithEmptyValue = [
				{ label: "Empty", value: "Empty", isEmptyValue: true },
				{ label: "Option 1", value: "option1" },
				{ label: "Option 2", value: "option2" }
			];

			const { container } = render(
				<CustomSelect items={itemsWithEmptyValue} value="" id="empty-value-select" label="Test Label" />
			);

			const input = getByDataRole(container, DataRoles.Select.Input) as HTMLInputElement;

			expect(input.value).toBe("");

			// Open dropdown and verify empty value item is pre-selected
			await userEvent.click(input);

			const dropdown = await findByDataRole(container, DataRoles.Dropdown);
			const dropdownItems = await findAllByDataRole(dropdown, DataRoles.Dropdown.Item);

			expect(dropdownItems[0]).toHaveAttribute("data-preselect", "true");

			await userEvent.click(dropdownItems[0]);

			expect(input.value).toBe("Empty");
			expect(input).toMatchSnapshot();
		});

		test("should handle empty items array", () => {
			const { container } = render(<CustomSelect items={[]} />);

			const input = getByDataRole(container, DataRoles.Select.Input) as HTMLInputElement;
			expect(input.value).toBe("");
		});

		test("should maintain focus on input when clicking on dropdown", async () => {
			const { container, baseElement } = render(<CustomSelect items={ITEMS} />);

			const input = getByDataRole(container, DataRoles.Select.Input);
			await userEvent.click(input);

			const dropdown = await findByDataRole(baseElement, DataRoles.Dropdown);

			input.focus();
			await userEvent.click(dropdown);

			expect(container).toBeTruthy();
		});

		test("should open dropdown when select input changes its position", async () => {
			const TestComponent = () => {
				const [textValue, setTextValue] = useState("");
				const [selectValue, setSelectValue] = useState("");
				const [errorMessage, setErrorMessage] = useState("");

				const handleTextBlur = (e: any) => {
					if (e.target.value === "") {
						setErrorMessage("should not be empty");
					} else {
						setErrorMessage("");
					}
				};

				const handleTextChange = (e: any) => {
					setTextValue(e.target.value);
				};

				return (
					<>
						<TextField
							id="basic-text-field"
							value={textValue}
							label="Basic Text Field"
							onChange={handleTextChange}
							placeholder="Type something here"
							errorMessage={errorMessage}
							onBlur={handleTextBlur}
						/>
						<CustomSelect
							id="position-test-select"
							label="Test Custom Select"
							placeholder="Please choose..."
							items={ITEMS}
							value={selectValue}
							onValueChanged={setSelectValue}
						/>
					</>
				);
			};

			const { baseElement } = render(<TestComponent />);

			const textInput = getByDataRole(baseElement, DataRoles.TextField.Input);
			const selectInput = getByDataRole(baseElement, DataRoles.Select.Input);
			expect(queryByDataRole(baseElement, DataRoles.TextField.ErrorMessage)).toBeNull();

			await userEvent.click(textInput);

			expect(textInput).toHaveFocus();

			await userEvent.click(selectInput);

			const errorMessage = await findByDataRole(baseElement, DataRoles.TextField.ErrorMessage);
			expect(errorMessage).toBeInTheDocument();

			const dropdown = await findByDataRole(baseElement, DataRoles.Dropdown);
			expect(dropdown).toBeInTheDocument();

			const dropdownItems = await findAllByDataRole(baseElement, DataRoles.Dropdown.Item);
			expect(dropdownItems.length).toBeGreaterThan(0);
		});

		test("should render rich content with `labelRenderer`", async () => {
			const customLabelRenderer = (item: DropDownItem): ReactNode => (
				<div className="rich-label">
					<span className="label-text">{item.label}</span>
					{item.disabled ? (
						<span className="label-unavailable">Unavailable</span>
					) : (
						<span className="label-available">Available</span>
					)}
				</div>
			);

			const { getByDataRole, findByDataRole } = render(
				<CustomSelect items={ITEMS} labelRenderer={customLabelRenderer} />
			);

			const inputWrapper = getByDataRole(DataRoles.Select.Wrapper);
			await userEvent.click(inputWrapper);

			const dropdown = await findByDataRole(DataRoles.Dropdown);

			expect(dropdown.querySelector(".rich-label")).toBeTruthy();
			expect(dropdown.querySelector(".label-text")).toBeTruthy();
			expect(dropdown.querySelector(".label-available")).toBeTruthy();
			expect(dropdown.querySelector(".label-unavailable")).toBeTruthy();
		});
	});

	describe("Mobile", () => {
		beforeAll(() => {
			setupDevice();
		});

		test("should handle onModalOpen callback", async () => {
			const onModalOpenSpy = vi.fn();

			const { container } = render(<CustomSelect items={ITEMS} onModalOpen={onModalOpenSpy} />);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);
			await userEvent.click(inputWrapper);

			expect(onModalOpenSpy).toHaveBeenCalledTimes(1);
		});

		test("should handle selectWrapperInModalRef callback", async () => {
			const selectWrapperInModalRefSpy = vi.fn();

			const { container } = render(<CustomSelect items={ITEMS} selectWrapperInModalRef={selectWrapperInModalRefSpy} />);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);
			await userEvent.click(inputWrapper);

			expect(selectWrapperInModalRefSpy).toHaveBeenCalledTimes(1);
		});

		test("should handle custom modalProps", async () => {
			const { container, baseElement } = render(
				<CustomSelect items={ITEMS} modalProps={{ fullscreen: false, noGutter: false }} />
			);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);
			await userEvent.click(inputWrapper);

			const modalOverlay = getByDataRole(baseElement, DataRoles.Modal.Overlay);
			expect(modalOverlay).toBeTruthy();
		});

		test("should handle focusBack false on mobile", async () => {
			const { container, baseElement } = render(<CustomSelect items={ITEMS} focusBack={false} />);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);
			await userEvent.click(inputWrapper);

			const dropdownItems = await findAllByDataRole(baseElement, DataRoles.Dropdown.Item);
			await userEvent.click(dropdownItems[0]);

			expect(inputWrapper.matches(":focus")).toBeFalsy();
		});

		test("should handle openOnFocus on mobile", async () => {
			const { container, baseElement } = render(<CustomSelect items={ITEMS} openOnFocus />);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);
			await userEvent.click(inputWrapper);

			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeTruthy();
		});

		test("should handle selectWrapperId on mobile", () => {
			const customId = "custom-wrapper-id";
			const { container } = render(<CustomSelect items={ITEMS} id="test" selectWrapperId={customId} />);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);
			expect(inputWrapper.id).toBe(customId);
		});

		test("should handle selectRef on mobile", () => {
			const selectRefSpy = vi.fn();

			const { container } = render(<CustomSelect items={ITEMS} selectRef={selectRefSpy} />);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);
			expect(selectRefSpy).toHaveBeenCalledWith(inputWrapper);
		});

		test("should handle custom keysToOpen on mobile", async () => {
			const { container, baseElement } = render(<CustomSelect items={ITEMS} keysToOpen={[Key.Control]} />);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);

			fireEvent.keyDown(inputWrapper, { key: Key.ArrowDown });
			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();

			fireEvent.keyDown(inputWrapper, { key: Key.Control });
			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeTruthy();
		});

		test("should handle aria attributes on mobile wrapper", () => {
			const { container } = render(
				<CustomSelect
					items={ITEMS}
					id="test-select"
					label="Test Label"
					ariaDescribedby="custom-description"
					errorMessage="Error message"
				/>
			);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);

			expect(inputWrapper.getAttribute("role")).toBe("combobox");
			expect(inputWrapper.getAttribute("aria-haspopup")).toBe("listbox");
			expect(inputWrapper.getAttribute("aria-expanded")).toBe("false");
			expect(inputWrapper.getAttribute("aria-describedby")).toContain("test-select");
			expect(inputWrapper.getAttribute("aria-describedby")).toContain("test-select-label");
			expect(inputWrapper.getAttribute("aria-describedby")).toContain("test-select-error");
			expect(inputWrapper.getAttribute("aria-describedby")).toContain("custom-description");
		});

		test("should handle disabled state on mobile", async () => {
			const { container, baseElement } = render(<CustomSelect items={ITEMS} disabled />);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);

			await userEvent.click(inputWrapper);
			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();

			fireEvent.keyDown(inputWrapper, { key: Key.ArrowDown });
			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();
		});

		test("should handle readonly state on mobile", async () => {
			const { container, baseElement } = render(<CustomSelect items={ITEMS} readonly />);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);

			await userEvent.click(inputWrapper);
			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();

			fireEvent.keyDown(inputWrapper, { key: Key.ArrowDown });
			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();
		});

		test("should handle close button click in modal", async () => {
			const onModalCloseSpy = vi.fn();

			const { container, baseElement } = render(<CustomSelect items={ITEMS} onModalClose={onModalCloseSpy} />);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);
			await userEvent.click(inputWrapper);

			const closeButton = getByDataRole(baseElement, DataRoles.Button);
			await userEvent.click(closeButton);

			expect(queryByDataRole(baseElement, DataRoles.Dropdown)).toBeNull();
			expect(onModalCloseSpy).toHaveBeenCalledTimes(1);
		});

		test("Should call onModalClose and set focus back to input after press custom key", async () => {
			const onModalCloseSpy = vi.fn();

			const { container } = render(
				<CustomSelect items={ITEMS} onModalClose={onModalCloseSpy} keysToClose={[Key.Backspace]} />
			);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);

			await userEvent.click(inputWrapper);

			expect(getByDataRole(container, DataRoles.Dropdown)).toBeTruthy();
			expect(await findByDataRole(container, DataRoles.Dropdown)).toBeTruthy();

			fireEvent.keyDown(inputWrapper, { key: Key.Backspace });

			expect(queryByDataRole(container, DataRoles.Dropdown)).toBeNull();
			expect(inputWrapper.matches(":focus")).toBeTruthy();
			expect(onModalCloseSpy).toHaveBeenCalledTimes(1);
		});

		test("Should call onModalClose after closing modal by clicking to select an item", async () => {
			const onModalCloseSpy = vi.fn();

			const { container } = render(<CustomSelect items={ITEMS} onModalClose={onModalCloseSpy} />);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);

			await userEvent.click(inputWrapper);

			expect(getByDataRole(container, DataRoles.Dropdown)).toBeTruthy();

			const dropdownItems = getAllByDataRole(container, DataRoles.Dropdown.Item);

			await userEvent.click(dropdownItems[0]);

			expect(queryByDataRole(container, DataRoles.Dropdown)).toBeNull();
			expect(inputWrapper.matches(":focus")).toBeTruthy();
			expect(onModalCloseSpy).toHaveBeenCalledTimes(1);
		});

		test("Should call onModalClose after closing modal by pressing Enter to select an item", async () => {
			const onModalCloseSpy = vi.fn();

			const { container } = render(<CustomSelect items={ITEMS} onModalClose={onModalCloseSpy} />);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);

			await userEvent.click(inputWrapper);

			expect(getByDataRole(container, DataRoles.Dropdown)).toBeTruthy();

			const dropdownItems = getAllByDataRole(container, DataRoles.Dropdown.Item);

			fireEvent.keyDown(dropdownItems[0], { key: Key.Enter });

			expect(queryByDataRole(container, DataRoles.Dropdown)).toBeNull();
			expect(inputWrapper.matches(":focus")).toBeTruthy();
			expect(onModalCloseSpy).toHaveBeenCalledTimes(1);
		});

		test("Should not call onModalClose by pressing ESC when the using another custom key to close modal", async () => {
			const onModalCloseSpy = vi.fn();

			const { container } = render(
				<CustomSelect items={ITEMS} onModalClose={onModalCloseSpy} keysToClose={[Key.Backspace]} />
			);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);

			await userEvent.click(inputWrapper);

			expect(getByDataRole(container, DataRoles.Dropdown)).toBeTruthy();

			fireEvent.keyDown(getByDataRole(container, DataRoles.TextField.Input.Wrapper), { key: Key.Escape });

			expect(queryByDataRole(container, DataRoles.Dropdown)).toBeTruthy();
			expect(onModalCloseSpy).not.toHaveBeenCalled();
		});

		test("Should have the graphic for input after selecting the element", async () => {
			const onModalCloseSpy = vi.fn();

			const { container } = render(<CustomSelect items={ITEMS} onModalClose={onModalCloseSpy} />);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);

			await userEvent.click(inputWrapper);

			expect(getByDataRole(container, DataRoles.Dropdown)).toBeTruthy();

			const dropdownItems = getAllByDataRole(container, DataRoles.Dropdown.Item);

			fireEvent.keyDown(dropdownItems[0], { key: Key.Enter });

			await userEvent.click(inputWrapper);

			const modalInput = getByDataRole(container, DataRoles.TextField);

			expect(modalInput).toMatchSnapshot();

			const graphic = getByDataRole(modalInput, `${DataRoles.TextField.Prefix}-0`);

			expect(graphic).toBeTruthy();

			const dropdownItemGraphic = getByDataRole(dropdownItems[0], DataRoles.Icon);

			expect(graphic.textContent).toEqual(dropdownItemGraphic.textContent);
		});

		test("Should not show the graphic for input when showPrefixes is false", async () => {
			const onModalCloseSpy = vi.fn();

			const { container } = render(<CustomSelect items={ITEMS} onModalClose={onModalCloseSpy} showPrefixes={false} />);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);

			await userEvent.click(inputWrapper);

			expect(getByDataRole(container, DataRoles.Dropdown)).toBeTruthy();

			const dropdownItems = getAllByDataRole(container, DataRoles.Dropdown.Item);

			fireEvent.keyDown(dropdownItems[0], { key: Key.Enter });

			await userEvent.click(inputWrapper);

			const modalInput = getByDataRole(container, DataRoles.TextField);

			const graphic = queryByDataRole(modalInput, `${DataRoles.TextField.Prefix}-0`);

			expect(graphic).toBeFalsy();

			const dropdownItemGraphic = getByDataRole(dropdownItems[0], DataRoles.Icon);

			expect(dropdownItemGraphic).toBeTruthy();

			expect(graphic).toBeFalsy();
		});

		test("should apply empty styles to mobile modal input when isEmptyValue is true", async () => {
			const itemsWithEmptyValue = [
				{ label: "Empty", value: "empty", isEmptyValue: true, graphic: <Icon>block</Icon> },
				{ label: "Option 1", value: "option1" },
				{ label: "Option 2", value: "option2" }
			];

			const { container } = render(
				<CustomSelect items={itemsWithEmptyValue} value="empty" id="empty-value-select" label="Test Label" />
			);

			const inputWrapper = getByDataRole(container, DataRoles.Select.Wrapper);

			await userEvent.click(inputWrapper);

			expect(await findByDataRole(container, DataRoles.Dropdown)).toBeTruthy();

			const modalInput = getByDataRole(container, DataRoles.TextField);

			// Verify the input has the empty value
			const input = getByDataRole(modalInput, DataRoles.TextField.Input) as HTMLInputElement;
			expect(input.value).toBe("Empty");

			// Verify snapshot includes empty styles
			expect(modalInput).toMatchSnapshot();
		});

		test("should render rich content with `labelRenderer`", async () => {
			const customLabelRenderer = (item: DropDownItem): ReactNode => (
				<div className="rich-label-mobile">
					<span className="label-text">{item.label}</span>
					{item.disabled ? (
						<span className="label-unavailable">Unavailable</span>
					) : (
						<span className="label-available">Available</span>
					)}
				</div>
			);

			const { getByDataRole, findByDataRole } = render(
				<CustomSelect items={ITEMS} labelRenderer={customLabelRenderer} />
			);

			const inputWrapper = getByDataRole(DataRoles.Select.Wrapper);
			await userEvent.click(inputWrapper);

			const dropdown = await findByDataRole(DataRoles.Dropdown);

			expect(dropdown.querySelector(".rich-label-mobile")).toBeTruthy();
			expect(dropdown.querySelector(".label-text")).toBeTruthy();
			expect(dropdown.querySelector(".label-available")).toBeTruthy();
			expect(dropdown.querySelector(".label-unavailable")).toBeTruthy();

			const modal = getByDataRole(DataRoles.Modal.Overlay);
			const richLabelWrapper = queryByDataRole(modal, DataRoles.Select.RichLabel.Wrapper);
			expect(richLabelWrapper).toBeTruthy();

			const prefixGraphic = queryByDataRole(modal, `${DataRoles.TextField.Prefix}-0`);

			if (richLabelWrapper && prefixGraphic) {
				const prefixStyles = window.getComputedStyle(prefixGraphic);

				// Verify computed styles for left positioning to prevent graphic overlap
				const richLabelStyles = window.getComputedStyle(richLabelWrapper);
				expect(richLabelStyles.left).toBe(prefixStyles.width);
				expect(richLabelStyles.paddingLeft).toBe("0px");
			}
		});
	});
});
