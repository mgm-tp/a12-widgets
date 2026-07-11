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

import { fireEvent, getAllByDataRole, getByDataRole, queryAllByDataRole, queryByDataRole, render } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, vi, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import type { ReactElement } from "react";

import { navigateWithTab } from "../../../common/test/user-event-utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { Icon } from "../../../icon/main/icon.view.js";
import type { DropDownItem } from "../../../dropdown/index.js";

import { DefaultAutocomplete } from "../main/autocomplete.default.view.js";

import { inputProps } from "./data.js";

describe("com.mgmtp.a12.widgets.autocomplete.default", () => {
	test("render default autocomplete", () => {
		const { container } = render(<DefaultAutocomplete {...inputProps} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(container.firstChild).toMatchSnapshot();

		fireEvent.click(input);
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("render readonly autocomplete", () => {
		const { container } = render(<DefaultAutocomplete {...inputProps} readonly />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(container.firstChild).toMatchSnapshot();

		fireEvent.click(input);
		expect(container.firstElementChild?.children).toHaveLength(1);
	});

	test("render disabled autocomplete", async () => {
		const { container } = render(<DefaultAutocomplete {...inputProps} disabled />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(container.firstChild).toMatchSnapshot();

		fireEvent.click(input);
		expect(container.firstElementChild?.children).toHaveLength(1);
	});

	test("autocomplete loading state", () => {
		const { container } = render(<DefaultAutocomplete {...inputProps} loading />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		fireEvent.click(input);
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("focus input without opening the list", () => {
		const { container } = render(<DefaultAutocomplete {...inputProps} openOnFocus={false} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);
		fireEvent.focus(input);
		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeFalsy();

		fireEvent.keyDown(input, { key: Key.Enter });
		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy();
	});

	test("autocomplete events", async () => {
		const onSearchSpy = vi.fn();
		const onValueChange = vi.fn();

		const { container } = render(
			<DefaultAutocomplete {...inputProps} onSearch={onSearchSpy} onValueChange={onValueChange} value="a" />
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		fireEvent.click(input);

		// onSearch callback would be called twice for focus and click events
		expect(onSearchSpy).toHaveBeenCalledTimes(2);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();

		fireEvent.click(queryAllByDataRole(container, DataRoles.Dropdown.Item)[0]);
		expect(queryAllByDataRole(container, DataRoles.Dropdown.Item)).toHaveLength(0);
		expect(onValueChange).toHaveBeenCalledTimes(1);
	});

	test("onValueChange should not be triggered when picking the currently selected item", () => {
		const onValueChange = vi.fn();

		const { container } = render(<DefaultAutocomplete {...inputProps} onValueChange={onValueChange} value="" />);

		const getDropdownItems = () => {
			const input = getByDataRole(container, DataRoles.TextField.Input);
			fireEvent.click(input);

			return getAllByDataRole(container, DataRoles.Dropdown.Item);
		};

		let dropdownItems = getDropdownItems();
		fireEvent.click(dropdownItems[0]);
		expect(onValueChange).toHaveBeenCalledTimes(1);

		dropdownItems = getDropdownItems();
		fireEvent.click(dropdownItems[0]);
		expect(onValueChange).toHaveBeenCalledTimes(1);

		dropdownItems = getDropdownItems();
		fireEvent.click(dropdownItems[1]);
		expect(onValueChange).toHaveBeenCalledTimes(2);
	});

	test("onValueChange should be triggered when change input value to empty string", async () => {
		const onValueChange = vi.fn();

		const { container } = render(
			<DefaultAutocomplete
				hintTemplate={inputProps.hintTemplate}
				items={inputProps.items}
				onValueChange={onValueChange}
				value=""
			/>
		);

		const input = getByDataRole(container, DataRoles.TextField.Input);
		const openDropdown = async () => {
			await userEvent.click(input);

			return getAllByDataRole(container, DataRoles.Dropdown.Item);
		};

		await openDropdown();
		await userEvent.click(document.body);
		expect(onValueChange).not.toHaveBeenCalled();

		let dropdownItems = await openDropdown();

		await userEvent.click(dropdownItems[0]);
		expect(onValueChange).toHaveBeenCalledWith(inputProps.items[0]);
		onValueChange.mockReset();

		await userEvent.type(input, "     ");
		await userEvent.click(document.body);
		expect(onValueChange).not.toHaveBeenCalled();

		await userEvent.type(input, "notmatchtext");
		await userEvent.click(document.body);
		expect(onValueChange).not.toHaveBeenCalled();

		await userEvent.clear(input);
		await userEvent.click(document.body);
		expect(onValueChange).toHaveBeenCalledWith("");
		onValueChange.mockReset();

		dropdownItems = await openDropdown();

		await userEvent.click(dropdownItems[0]);
		expect(onValueChange).toHaveBeenCalledWith(inputProps.items[0]);
		onValueChange.mockReset();

		await userEvent.clear(input);
		await navigateWithTab(userEvent, () => !input.contains(document.activeElement));
		expect(onValueChange).toHaveBeenCalledWith("");
	});

	test("Input caret position should not change after focus to the middle of input text", async () => {
		const selectedValue = "AppleScript";

		// Start with autocomplete component that has already had selectedValue
		const { container, rerender } = render(<DefaultAutocomplete {...inputProps} value={selectedValue} />);
		const inputEl = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;

		// Cursor position is at the end of selectedValue
		expect(inputEl.selectionStart).toEqual(selectedValue.length);
		expect(inputEl.selectionEnd).toEqual(selectedValue.length);

		const focusPosition = 5;
		fireEvent.focus(inputEl);
		inputEl.setSelectionRange(focusPosition, focusPosition);

		// Cursor position is at focusPosition
		expect(inputEl.selectionStart).toEqual(focusPosition);
		expect(inputEl.selectionEnd).toEqual(focusPosition);

		// Rerender component with new value of items to simulate onSearch handle when focusing the input
		rerender(<DefaultAutocomplete {...inputProps} value={selectedValue} items={[...(inputProps.items as string[])]} />);

		// Cursor position is at focusPosition
		expect(inputEl.selectionStart).toEqual(focusPosition);
		expect(inputEl.selectionEnd).toEqual(focusPosition);
	});

	test("Input caret position should not change after option items change from empty to the list which contains input value", async () => {
		const selectedValue = "AppleScript";

		// Start with autocomplete component that has already had selectedValue
		const { container, rerender } = render(<DefaultAutocomplete {...inputProps} value={selectedValue} items={[]} />);
		const inputEl = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;

		// Cursor position is at the end of selectedValue
		expect(inputEl.selectionStart).toEqual(selectedValue.length);
		expect(inputEl.selectionEnd).toEqual(selectedValue.length);

		const focusPosition = 5;
		fireEvent.focus(inputEl);
		inputEl.setSelectionRange(focusPosition, focusPosition);

		// Cursor position is at focusPosition
		expect(inputEl.selectionStart).toEqual(focusPosition);
		expect(inputEl.selectionEnd).toEqual(focusPosition);

		// Rerender component with new value of items that contains selectedValue
		rerender(<DefaultAutocomplete {...inputProps} value={selectedValue} items={[...(inputProps.items as string[])]} />);

		// Cursor position is at focusPosition
		expect(inputEl.selectionStart).toEqual(focusPosition);
		expect(inputEl.selectionEnd).toEqual(focusPosition);
	});

	test("Should render and handle interaction safely when an autocomplete item contains React children", async () => {
		const AutocompleteContainer = (): ReactElement => {
			const onValueChangeSpy = vi.fn();

			const items: DropDownItem[] = [
				{
					label: "Custom item",
					graphic: <Icon>mail</Icon>
				}
			];

			return (
				<DefaultAutocomplete
					hintTemplate={inputProps.hintTemplate}
					items={items}
					value={items[0]}
					onValueChange={onValueChangeSpy}
				/>
			);
		};

		const { getByDataRole } = render(<AutocompleteContainer />);
		const input = getByDataRole(DataRoles.TextField.Input);

		await userEvent.click(input);

		const dropdownItem = getByDataRole(DataRoles.Dropdown.Item);
		expect(dropdownItem).toBeTruthy();

		// Verify that clicking the dropdown item does not throw an error
		expect(async () => {
			await userEvent.click(dropdownItem);
		}).not.toThrowError();
	});

	describe("adding item", () => {
		test("if `items` list is initialized empty, a new item should be added when pressing ENTER", async () => {
			const onValueChangeSpy = vi.fn();
			const onSearchSpy = vi.fn();

			const { container } = render(
				<DefaultAutocomplete
					label="Add new item initially"
					value=""
					items={[]}
					hintTemplate={inputProps.hintTemplate}
					onValueChange={onValueChangeSpy}
					onSearch={onSearchSpy}
					allowAddingNewItem
				/>
			);

			const input = getByDataRole(container, DataRoles.TextField.Input);
			fireEvent.click(input);

			expect(queryAllByDataRole(container, DataRoles.Dropdown.Item)).toHaveLength(0);

			fireEvent.input(input, { target: { value: "New York" } });
			fireEvent.keyDown(input, { key: Key.Enter });
			expect(onValueChangeSpy).toHaveBeenCalledTimes(1);
		});

		test("if `items` list is initialized empty, a new item should be added when clicking outside", () => {
			const onValueChangeSpy = vi.fn();
			const onSearchSpy = vi.fn();

			const { container } = render(
				<DefaultAutocomplete
					label="Add new item initially"
					value=""
					items={[]}
					hintTemplate={inputProps.hintTemplate}
					onValueChange={onValueChangeSpy}
					onSearch={onSearchSpy}
					allowAddingNewItem
				/>
			);

			const input = getByDataRole(container, DataRoles.TextField.Input);
			fireEvent.click(input);

			expect(queryAllByDataRole(container, DataRoles.Dropdown.Item)).toHaveLength(0);

			fireEvent.input(input, { target: { value: "London" } });
			fireEvent.mouseDown(document.body);
			expect(onValueChangeSpy).toHaveBeenCalledTimes(1);
		});

		test("Should trigger `onDropdownClose` when the dropdown is closed", async () => {
			const onDropdownClose = vi.fn();

			const { container } = render(<DefaultAutocomplete {...inputProps} onDropdownClose={onDropdownClose} value="" />);

			const openDropdown = async () => {
				const input = getByDataRole(container, DataRoles.TextField.Input);
				await userEvent.click(input);

				return getAllByDataRole(container, DataRoles.Dropdown.Item);
			};

			const dropdownItems = await openDropdown();
			await userEvent.click(dropdownItems[0]);
			expect(onDropdownClose).toHaveBeenCalledTimes(1);

			await openDropdown();
			await userEvent.keyboard("{Escape}");
			expect(onDropdownClose).toHaveBeenCalledTimes(2);

			await openDropdown();
			await userEvent.click(document.body);
			expect(onDropdownClose).toHaveBeenCalledTimes(3);
		});
	});
});
