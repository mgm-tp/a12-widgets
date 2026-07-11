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

import { fireEvent, getAllByDataRole, getByDataRole, queryByDataRole, render, setupDevice, waitFor } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, test, expect, vi, afterEach, beforeAll } from "vitest";
import { getByText } from "@testing-library/dom";
import { userEvent } from "vitest/browser";
import type { PropsWithChildren, ReactElement, ReactNode } from "react";
import { createContext, useContext, useState, useMemo } from "react";

import { noop, Key as CustomKey } from "../../common/main/utils.js";
import { HintTooltip } from "../../tooltip/hint/main/hint.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { navigateWithTab } from "../../common/test/user-event-utils.js";
import { Icon } from "../../icon/index.js";

import { Multiselect } from "../main/multiselect.view.js";
import type { MultiselectProps } from "../main/multiselect.api.js";
import * as multiselectInternal from "../main/multiselect.internal.js";

vi.mock("../main/multiselect.internal.js", { spy: true });

export const ITEMS: MultiselectProps.Item[] = [
	{
		id: "1",
		label: "Java"
	},
	{
		id: "2",
		label: "Groovy"
	},
	{
		id: "3",
		label: "JavaScript"
	},
	{
		id: "4",
		label: "C++"
	},
	{
		id: "5",
		label: "C"
	},
	{
		id: "6",
		label: "Scala"
	},
	{
		id: "7",
		label: "Python"
	},
	{
		id: "8",
		label: "PHP"
	},
	{
		id: "9",
		label: "ActionScript"
	},
	{
		id: "10",
		label: "AppleScript"
	},
	{
		id: "11",
		label: "Asp"
	},
	{
		id: "12",
		label: "Clojure"
	},
	{
		id: "13",
		label: "COBOL"
	},
	{
		id: "14",
		label: "BASIC"
	},
	{
		id: "15",
		label: "ColdFusion"
	},
	{
		id: "16",
		label: "123"
	},
	{
		id: "17",
		label: "456"
	}
];

export const properties = {
	id: "test-id",
	label: "Test Multiselect",
	placeholder: "Test Placeholder",
	tooltips: <HintTooltip text="hint tooltip" />,
	errorMessage: "Error message",
	warningMessage: "Warning message",
	ariaDescribedby: "warning-tooltip",
	helperText: "Helper text",
	hintTemplate: "{count} of {total} options shown",
	selectAllText: "All",
	inputProps: { "aria-label": "Multiselect" }
};

describe("com.mgmtp.a12.widgets.multiselect", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	test("render default multiselect", async () => {
		const { container } = render(
			<Multiselect
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				hintTemplate={properties.hintTemplate}
				placeholder={properties.placeholder}
				ariaDescribedby={properties.ariaDescribedby}
				onChange={noop}
			/>
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(container).toMatchSnapshot();

		await userEvent.click(input);
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("render readonly multiselect", async () => {
		const { container } = render(
			<Multiselect
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				placeholder={properties.placeholder}
				readonly
				onChange={noop}
			/>
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(container.firstChild).toMatchSnapshot();

		await userEvent.click(input);
		const portal = queryByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).not.toBeInTheDocument();
	});

	test("render disabled multiselect", async () => {
		const { container } = render(
			<Multiselect
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				placeholder={properties.placeholder}
				disabled
			/>
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(container.firstChild).toMatchSnapshot();

		fireEvent.click(input);
		const portal = queryByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).not.toBeInTheDocument();
	});

	test("render multiselect with error message", async () => {
		const { container } = render(
			<Multiselect
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				placeholder={properties.placeholder}
				errorMessage={properties.errorMessage}
				onChange={noop}
			/>
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(container.firstChild).toMatchSnapshot();

		await userEvent.click(input);
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("render multiselect with warning message", async () => {
		const { container } = render(
			<Multiselect
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				placeholder={properties.placeholder}
				warningMessage={properties.warningMessage}
				onChange={noop}
			/>
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(container.firstChild).toMatchSnapshot();

		await userEvent.click(input);
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("render multiselect with tooltip", () => {
		const { container } = render(
			<Multiselect
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				placeholder={properties.placeholder}
				tooltips={properties.tooltips}
				onChange={noop}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render multiselect with tooltip in new line", () => {
		const { container } = render(
			<Multiselect
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				placeholder={properties.placeholder}
				tooltips={properties.tooltips}
				breakTooltipsToNewLine
				onChange={noop}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render mobile multiselect", async () => {
		const { container } = render(
			<Multiselect
				items={ITEMS}
				label={properties.label}
				id={properties.id}
				helperText={properties.helperText}
				hintTemplate={properties.hintTemplate}
				placeholder={properties.placeholder}
				ariaDescribedby={properties.ariaDescribedby}
				mobile
				onChange={noop}
			/>
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(container.firstChild).toMatchSnapshot();

		await userEvent.click(input);
		const portal = getByDataRole(container, DataRoles.Portal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("focus input without opening the list", async () => {
		const { container } = render(<Multiselect items={ITEMS} openOnFocus={false} onChange={noop} />);

		const input = getByDataRole(container, DataRoles.TextField.Input);
		fireEvent.focus(input);
		expect(queryByDataRole(container, DataRoles.Dropdown)).toBeFalsy();

		fireEvent.keyDown(input, { key: Key.Enter });
		expect(queryByDataRole(container, DataRoles.Dropdown)).toBeTruthy();
	});

	test("multiselect events", async () => {
		const onItemCheckSpy = vi.fn();
		const onItemClickSpy = vi.fn();
		const onChangeSpy = vi.fn();

		const { container } = render(
			<Multiselect items={ITEMS} onItemCheck={onItemCheckSpy} onItemClick={onItemClickSpy} onChange={onChangeSpy} />
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		await userEvent.click(input);
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		const items = getAllByDataRole(container, DataRoles.Dropdown.Item);
		await userEvent.click(items[1]);
		expect(onItemClickSpy).toHaveBeenCalledTimes(1);
		expect(onChangeSpy).toHaveBeenCalledTimes(1);

		const secondItemCheckbox = getByDataRole(items[2], DataRoles.Checkbox.Input);
		onChangeSpy.mockClear();
		await userEvent.click(secondItemCheckbox);
		expect(onItemCheckSpy).toHaveBeenCalledTimes(1);
		expect(onChangeSpy).toHaveBeenCalledTimes(1);

		//Open dropdown using click on input
		onChangeSpy.mockClear();
		await userEvent.click(input);
		expect(getByDataRole(container, DataRoles.Dropdown)).toBeTruthy();

		//Select item using keyboard events
		const dropdown = getByDataRole(container, DataRoles.Dropdown);
		fireEvent.keyDown(dropdown, { key: Key.ArrowDown });
		fireEvent.keyDown(dropdown, { key: CustomKey.Space });
		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy();

		//Open dropdown using arrow down key
		fireEvent.keyDown(input, { key: Key.ArrowDown });
		expect(getByDataRole(container, DataRoles.Dropdown)).toBeTruthy();

		//Close dropdown using escape key
		fireEvent.keyDown(input, { key: Key.Escape });
		expect(queryByDataRole(container, DataRoles.AttachedPortal)).not.toBeInTheDocument();

		fireEvent.blur(input);
		fireEvent.focus(input);

		//Open dropdown using arrow up key
		fireEvent.keyDown(input, { key: Key.ArrowUp });
		expect(getByDataRole(container, DataRoles.Dropdown)).toBeTruthy();
	});

	test("simulate handlers", () => {
		const viewItems = ITEMS.map((item, index) => ({
			...item,
			selected: index === 0 || index === 1 || index === 2
		}));
		const selectedItems = viewItems.filter((item) => item.selected);
		const unselectedItems = viewItems.filter((item) => !item.selected);

		const groupingHandler = vi.fn().mockReturnValue({
			selectedItems,
			unselectedItems
		});
		const joiningHandler = vi.fn().mockReturnValue(
			selectedItems
				.map((item) => item.label)
				.join(" --- ")
				.trim()
		);
		const sortingHandler = vi.fn().mockReturnValue({
			selectedItems,
			unselectedItems
		});
		const filteringHandler = vi.fn().mockReturnValue({
			selectedItems,
			unselectedItems
		});

		const properties: Partial<MultiselectProps> = {
			joiningHandler,
			groupingHandler,
			sortingHandler,
			filteringHandler
		};

		const { container } = render(<Multiselect items={viewItems} {...properties} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(groupingHandler).toHaveBeenCalledWith(viewItems, selectedItems);

		expect(joiningHandler).toHaveBeenCalledWith(
			selectedItems,
			{
				selectedItems,
				unselectedItems
			},
			true
		);

		expect(sortingHandler).toHaveBeenCalledWith({ selectedItems, unselectedItems });

		const searchText = "ja";
		fireEvent.change(input, { target: { value: searchText } });
		expect(filteringHandler).toHaveBeenCalledWith(searchText, viewItems);
	});

	test("The sort handler should be called when closing the dropdown by tab navigation", async () => {
		const viewItems = ITEMS.map((item, index) => ({
			...item,
			selected: index === 0 || index === 1 || index === 2
		}));
		const selectedItems = viewItems.filter((item) => item.selected);

		const { container } = render(<Multiselect items={viewItems} {...properties} />);

		const input = getByDataRole(container, DataRoles.TextField.Input);
		const inputWrapper = getByDataRole(container, DataRoles.TextField.Input.Wrapper);

		// The sort function is called the first time when the multiselect is mounted.
		expect(multiselectInternal.defaultGroupingHandler).toHaveBeenLastCalledWith(viewItems, selectedItems);

		// Tab to the input to open the dropdown.
		await navigateWithTab(userEvent, () => document.activeElement === input);
		let dropdown = queryByDataRole(container, DataRoles.Dropdown);
		expect(dropdown).toBeTruthy();

		// Tab out of the input wrapper to close the dropdown.
		await navigateWithTab(userEvent, () => !inputWrapper.contains(document.activeElement));
		dropdown = queryByDataRole(container, DataRoles.Dropdown);
		expect(dropdown).not.toBeTruthy();

		// The sort function is called the second time after the dropdown is closed
		expect(multiselectInternal.defaultGroupingHandler).toHaveBeenCalledTimes(2);
		expect(multiselectInternal.defaultGroupingHandler).toHaveBeenLastCalledWith(viewItems, selectedItems);
	});

	test("The sort handler should be called when closing the dropdown with the Escape key", async () => {
		const viewItems = ITEMS.map((item, index) => ({
			...item,
			selected: index === 0 || index === 1 || index === 2
		}));
		const selectedItems = viewItems.filter((item) => item.selected);

		const { container } = render(<Multiselect items={viewItems} {...properties} />);

		const input = getByDataRole(container, DataRoles.TextField.Input);

		// The sort is called the first time when the multiselect is mounted.
		expect(multiselectInternal.defaultGroupingHandler).toHaveBeenLastCalledWith(viewItems, selectedItems);

		// Tab to the input to open the dropdown.
		await navigateWithTab(userEvent, () => document.activeElement === input);
		let dropdown = queryByDataRole(container, DataRoles.Dropdown);
		expect(dropdown).toBeTruthy();

		// Press ESCAPE to close the dropdown.
		await userEvent.keyboard("{Escape}");
		dropdown = queryByDataRole(container, DataRoles.Dropdown);
		expect(dropdown).not.toBeTruthy();

		// The sort function is called the second time after the dropdown is closed.
		expect(multiselectInternal.defaultGroupingHandler).toHaveBeenCalledTimes(2);
		expect(multiselectInternal.defaultGroupingHandler).toHaveBeenLastCalledWith(viewItems, selectedItems);
	});

	test("Should close the dropdown when blur input", async () => {
		const { container } = render(
			<>
				<Multiselect items={ITEMS} />
				<button>button</button>
			</>
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);
		const button = getByText(container, "button");

		await userEvent.click(input);
		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy();

		// Should close the dropdown when blur input by click outside
		await userEvent.click(document.body);
		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeFalsy();

		await userEvent.click(input);
		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy();

		// Should close the dropdown when blur input by tab navigation to another element
		await navigateWithTab(userEvent, () => document.activeElement === button);
		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeFalsy();
	});

	test("Should toggle the dropdown when click arrow icon", async () => {
		const { container } = render(<Multiselect items={ITEMS} />);
		const expandIcon = getByDataRole(container, DataRoles.SelectionSuffix);

		await userEvent.click(expandIcon);
		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy();

		// Should close the dropdown when blur input by click outside
		await userEvent.click(expandIcon);
		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeFalsy();
	});

	test("onChange should be called only once when clicking select-all checkbox", async () => {
		const onChangeSpy = vi.fn();
		const { container, baseElement } = render(
			<Multiselect items={ITEMS} selectAllText={properties.selectAllText} onChange={onChangeSpy} />
		);

		// Open dropdown
		const input = getByDataRole(container, DataRoles.TextField.Input);
		await userEvent.click(input);

		// Wait for dropdown to appear
		expect(getByDataRole(baseElement, DataRoles.AttachedPortal)).toBeTruthy();

		// Find select-all checkbox and click it
		const selectAllItem = getAllByDataRole(baseElement, DataRoles.Dropdown.Item)[0];
		const selectAllCheckbox = getByDataRole(selectAllItem, DataRoles.Checkbox.Input);

		await userEvent.click(selectAllCheckbox);

		// Assert onChange called only once
		expect(onChangeSpy).toHaveBeenCalledTimes(1);
	});

	test("Should render and handle interaction safely when a graphic in multiselect item contains React children", async () => {
		const MultiselectContainer = (): ReactElement => {
			const items: MultiselectProps.Item[] = [
				{
					id: "custom-item",
					label: "Custom item",
					graphic: <Icon>mail</Icon>
				}
			];

			return <Multiselect items={items} />;
		};

		const { container } = render(<MultiselectContainer />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		await userEvent.click(input);

		const dropdownItemWithGraphic = getAllByDataRole(container, DataRoles.Dropdown.Item)[1];

		expect(getByDataRole(dropdownItemWithGraphic, DataRoles.Icon)).toBeInTheDocument();

		// Verify that clicking the dropdown item does not throw an error
		await expect(userEvent.click(dropdownItemWithGraphic)).resolves.not.toThrow();
	});

	test("Should not show select all option when `enableSelectAllOption` is false and update items correctly while dropdown is open", async () => {
		// Initial items with first 2 selected
		const initialItems = ITEMS.map((item, index) => ({
			...item,
			selected: index < 2,
			disabled: false
		}));

		const { container, baseElement, rerender } = render(
			<Multiselect enableSelectAllOption={false} items={initialItems} />
		);

		const input = getByDataRole(container, DataRoles.TextField.Input);
		await userEvent.click(input);

		const dropdownPortal = getByDataRole(baseElement, DataRoles.AttachedPortal);
		expect(dropdownPortal).toBeTruthy();

		// Verify select all option is not present
		const selectAllItem = queryByDataRole(dropdownPortal, DataRoles.Checkbox.Input.Indeterminate);
		expect(selectAllItem).toBeNull();

		// Simulate prop update with 3 selected items and remaining items disabled
		const updatedItems = initialItems.map((item, index) => ({
			...item,
			selected: index < 3,
			disabled: index >= 3
		}));

		// Re-render with updated items while dropdown is still open
		rerender(<Multiselect enableSelectAllOption={false} items={updatedItems} />);

		expect(dropdownPortal).toBeTruthy();

		const updatedDropdownItems = getAllByDataRole(baseElement, DataRoles.Dropdown.Item);

		// Check that selected items are still enabled
		for (let i = 0; i < 3; i++) {
			const checkbox = getByDataRole(updatedDropdownItems[i], DataRoles.Checkbox.Input);
			expect(checkbox).not.toBeDisabled();
			expect(checkbox).toBeChecked();
		}

		// Check that unselected items are disabled
		for (let i = 3; i < updatedDropdownItems.length; i++) {
			const checkbox = getByDataRole(updatedDropdownItems[i], DataRoles.Checkbox.Input);
			expect(checkbox).toBeDisabled();
		}

		// Verify select all option is still not present after update
		const selectAllItemAfterUpdate = queryByDataRole(dropdownPortal, DataRoles.Checkbox.Input.Indeterminate);
		expect(selectAllItemAfterUpdate).toBeNull();
	});

	test("Checkbox on disabled item should be disabled", async () => {
		const itemsWithDisabled: MultiselectProps.Item[] = [
			{ id: "1", label: "Enabled Item 1" },
			{ id: "2", label: "Disabled Item", disabled: true },
			{ id: "3", label: "Enabled Item 2" }
		];

		const { container, baseElement } = render(<Multiselect items={itemsWithDisabled} enableSelectAllOption={false} />);

		// Open dropdown
		const input = getByDataRole(container, DataRoles.TextField.Input);
		await userEvent.click(input);

		// Verify dropdown is open
		const dropdownPortal = getByDataRole(baseElement, DataRoles.AttachedPortal);
		expect(dropdownPortal).toBeTruthy();

		const dropdownItems = getAllByDataRole(baseElement, DataRoles.Dropdown.Item);

		// Verify the checkbox on disabled item (index 1) is disabled
		const disabledCheckbox = getByDataRole(dropdownItems[1], DataRoles.Checkbox.Input);
		expect(disabledCheckbox).toHaveProperty("disabled", true);

		// Verify enabled items have enabled checkboxes
		const firstEnabledCheckbox = getByDataRole(dropdownItems[0], DataRoles.Checkbox.Input);
		expect(firstEnabledCheckbox).not.toHaveAttribute("disabled");

		const secondEnabledCheckbox = getByDataRole(dropdownItems[2], DataRoles.Checkbox.Input);
		expect(secondEnabledCheckbox).not.toHaveAttribute("disabled");
	});

	test("Should skip disabled first item and select first non-disabled item when pressing ArrowDown", async () => {
		const itemsWithFirstDisabled: MultiselectProps.Item[] = [
			{ id: "1", label: "Disabled Item", disabled: true },
			{ id: "2", label: "Enabled Item 1" },
			{ id: "3", label: "Enabled Item 2" }
		];

		const { container, baseElement } = render(
			<Multiselect items={itemsWithFirstDisabled} enableSelectAllOption={false} />
		);

		const input = getByDataRole(container, DataRoles.TextField.Input);
		await userEvent.click(input);

		// Open dropdown and navigate with ArrowDown
		await userEvent.keyboard("{ArrowDown}");

		// Verify dropdown is open
		const dropdownPortal = getByDataRole(baseElement, DataRoles.AttachedPortal);
		expect(dropdownPortal).toBeTruthy();

		const dropdownItems = getAllByDataRole(baseElement, DataRoles.Dropdown.Item);

		// Check the active element is the first element which is not disabled
		expect(dropdownItems[1]).toHaveFocus();

		// Verify first item is disabled
		const disabledCheckbox = getByDataRole(dropdownItems[0], DataRoles.Checkbox.Input);
		expect(disabledCheckbox).toHaveProperty("disabled", true);

		// Verify second item is enabled
		const enabledCheckbox = getByDataRole(dropdownItems[1], DataRoles.Checkbox.Input);
		expect(enabledCheckbox).not.toHaveAttribute("disabled");
	});

	test("Should skip disabled first search result and focus first non-disabled item when pressing ArrowDown", async () => {
		const itemsWithDisabled: MultiselectProps.Item[] = [
			{ id: "1", label: "Apple", disabled: true },
			{ id: "2", label: "Apricot" },
			{ id: "3", label: "Banana" },
			{ id: "4", label: "Cherry" }
		];

		const { container, baseElement } = render(<Multiselect items={itemsWithDisabled} enableSelectAllOption={false} />);

		const input = getByDataRole(container, DataRoles.TextField.Input);
		await userEvent.click(input);

		// Search for "Ap" which should return "Apple" (disabled) and "Apricot" (enabled)
		await userEvent.type(input, "Ap");

		// Verify dropdown is open
		const dropdownPortal = getByDataRole(baseElement, DataRoles.AttachedPortal);
		expect(dropdownPortal).toBeTruthy();

		// Press ArrowDown to navigate
		await userEvent.keyboard("{ArrowDown}");

		const dropdownItems = getAllByDataRole(baseElement, DataRoles.Dropdown.Item);

		// Check the active element is the first non-disabled search result (Apricot)
		expect(dropdownItems[1]).toHaveFocus();

		// Verify first search result (Apple) is disabled
		const disabledCheckbox = getByDataRole(dropdownItems[0], DataRoles.Checkbox.Input);
		expect(disabledCheckbox).toHaveProperty("disabled", true);

		// Verify second search result (Apricot) is enabled
		const enabledCheckbox = getByDataRole(dropdownItems[1], DataRoles.Checkbox.Input);
		expect(enabledCheckbox).not.toHaveAttribute("disabled");
	});

	test("Should disable all unselected items when the maximum selection limit is reached", async () => {
		const MaxSelectionMultiselect = (): ReactElement => {
			const MAX_SELECTED_ITEMS = 3;
			const [selectedIds, setSelectedIds] = useState<string[]>([]);

			const items = useMemo(
				() =>
					ITEMS.map((item) => ({
						...item,
						selected: selectedIds.includes(item.id),
						...(selectedIds.length >= MAX_SELECTED_ITEMS && !selectedIds.includes(item.id) ? { disabled: true } : {})
					})),
				[selectedIds]
			);

			return (
				<Multiselect
					items={items}
					enableSelectAllOption={false}
					onChange={(selectedItems) => setSelectedIds(selectedItems.map(({ id }) => id))}
				/>
			);
		};

		const { container, baseElement } = render(<MaxSelectionMultiselect />);
		const input = getByDataRole(container, DataRoles.TextField.Input);
		await userEvent.click(input);

		const dropdownItems = getAllByDataRole(baseElement, DataRoles.Dropdown.Item);

		// Select 3 items to reach the maximum
		await userEvent.click(getByDataRole(dropdownItems[0], DataRoles.Checkbox.Input));
		await userEvent.click(getByDataRole(dropdownItems[2], DataRoles.Checkbox.Input));
		await userEvent.click(getByDataRole(dropdownItems[4], DataRoles.Checkbox.Input));

		// Selected items should remain enabled
		// Unselected items should be disabled after max reached
		for (let i = 0; i < dropdownItems.length; i++) {
			if ([0, 2, 4].includes(i)) {
				const checkbox = getByDataRole(dropdownItems[i], DataRoles.Checkbox.Input);
				expect(checkbox).toHaveAttribute("aria-checked", "true");
				expect(checkbox).not.toBeDisabled();
			} else {
				expect(getByDataRole(dropdownItems[i], DataRoles.Checkbox.Input)).toBeDisabled();
			}
		}
	});

	test("Should not cause infinite render loop when items prop uses grouped format", async () => {
		const groupedItems: MultiselectProps.Items = {
			selectedItems: [],
			unselectedItems: ITEMS
		};

		const { container, baseElement } = render(<Multiselect items={groupedItems} enableSelectAllOption={false} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		// Opening dropdown triggers componentDidUpdate — old bug caused infinite loop here
		await userEvent.click(input);

		// Clicking an item triggers setState, which re-enters componentDidUpdate
		const dropdownItems = getAllByDataRole(baseElement, DataRoles.Dropdown.Item);
		const firstItem = getByDataRole(dropdownItems[0], DataRoles.Checkbox.Input);
		await userEvent.click(firstItem);

		// Component still functional means no infinite loop occurred
		expect(input).toBeInTheDocument();
		// Item was selected
		expect(firstItem).toHaveAttribute("aria-checked", "true");
	});

	test("Should not crash when items contain a JSX graphic and a surrounding context exposes a throwing getter", () => {
		const throwingModel = {
			get header(): never {
				throw new Error("should never be accessed");
			}
		};
		const ThrowingContext = createContext<{ model: unknown }>({ model: throwingModel });

		const ContextConsumer = ({ children }: PropsWithChildren): ReactNode => {
			useContext(ThrowingContext);

			return children;
		};

		const itemsWithGraphic: MultiselectProps.Item[] = ITEMS.map((item) => ({
			...item,
			graphic: <Icon>star</Icon>
		}));

		const { getByDataRole } = render(
			<ContextConsumer>
				<Multiselect items={itemsWithGraphic} label={properties.label} id={properties.id} onChange={noop} />
			</ContextConsumer>
		);

		expect(getByDataRole(DataRoles.TextField.Input)).toBeInTheDocument();
	});
});

const ExampleMultiselect = ({
	items,
	selectedItems,
	isMobile
}: {
	items: MultiselectProps.Item[];
	isMobile?: boolean;
	selectedItems?: MultiselectProps.Item[];
}): ReactNode => {
	const [selectedItemsState, setSelectedItemsState] = useState<MultiselectProps.Item[]>(selectedItems || []);

	const newItems = useMemo(() => {
		const selectedIds = selectedItemsState.map((i) => i.id);

		return items.map((i) => (selectedIds.includes(i.id) ? { ...i, selected: true } : i));
	}, [items, selectedItemsState]);

	return (
		<Multiselect
			id="multiselect-test"
			label="Multiselect with a graphic label"
			labelGraphic={<Icon>info</Icon>}
			hintTemplate="{count} of {total} options shown"
			selectAllText="All"
			mobile={isMobile}
			mobileHeadingTitle="Select your options"
			placeholder="Please select or start typing"
			onChange={setSelectedItemsState}
			items={newItems}
		/>
	);
};

describe("Multiselect Mobile", () => {
	const mobileItems: MultiselectProps.Item[] = [
		{ id: "java", label: "Java" },
		{ id: "groovy", label: "Groovy" },
		{ id: "javaScript", label: "JavaScript" },
		{ id: "c++", label: "C++" },
		{ id: "c", label: "C" },
		{ id: "scala", label: "Scala" },
		{ id: "python", label: "Python" },
		{ id: "php", label: "PHP" },
		{ id: "actionScript", label: "ActionScript" },
		{ id: "appleScript", label: "AppleScript" },
		{ id: "asp", label: "Asp" },
		{ id: "clojure", label: "Clojure" },
		{ id: "cobol", label: "COBOL" },
		{ id: "basic", label: "BASIC" },
		{ id: "coldFusion", label: "ColdFusion" },
		{ id: "123", label: "123" },
		{ id: "456", label: "456" }
	];

	beforeAll(() => {
		setupDevice();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("The Clear Text button should clear a selected item if the item was chosen from a search result", async () => {
		render(<ExampleMultiselect items={mobileItems} selectedItems={[mobileItems[3]]} isMobile />);

		// Open the modal with the default selected value (C++)
		const input = document.querySelector<HTMLElement>(`[data-role="${DataRoles.TextField.Input}"]`)!;
		await userEvent.click(input);

		// Verify dropdown is visible in the modal
		await waitFor(() => {
			expect(queryByDataRole(document.body, DataRoles.Dropdown)).toBeTruthy();
		});

		// Select 'Java' from the dropdown
		const javaItem = document.querySelector<HTMLElement>('[id="java"]')!;
		javaItem.focus();
		await userEvent.keyboard(" ");

		// Save, close and Reopen Modal
		await userEvent.keyboard("{Escape}");
		await userEvent.click(input);

		// Check that there are two items with aria-checked="true" (Java and C++)
		await waitFor(() => {
			const checkedItems = document.querySelectorAll(`[data-role="${DataRoles.Dropdown.Item}"][aria-checked="true"]`);
			expect(checkedItems).toHaveLength(2);
		});

		const checkedItems = document.querySelectorAll(`[data-role="${DataRoles.Dropdown.Item}"][aria-checked="true"]`);
		const firstCheckedText = checkedItems[0].querySelector(`[data-role="${DataRoles.Dropdown.Text}"]`);
		const secondCheckedText = checkedItems[1].querySelector(`[data-role="${DataRoles.Dropdown.Text}"]`);
		expect(firstCheckedText).toHaveTextContent("Java");
		expect(secondCheckedText).toHaveTextContent("C++");

		// Type 'h' in the modal input (the second text-field input in the document) and select Python
		const modalInput = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.TextField.Input}"]`)[1]!;
		await userEvent.type(modalInput, "h");

		const pythonItem = document.querySelector<HTMLElement>('[id="python"]')!;
		pythonItem.focus();
		await userEvent.keyboard(" ");
		await userEvent.keyboard("{Escape}");

		// Re-open the modal and click the 'Clear text' button
		await userEvent.click(input);
		const clearButton = document.querySelector<HTMLElement>("[id='multiselect-test-popup-multiselect-clear-button']")!;
		await userEvent.click(clearButton);

		// Verify that all items are cleared
		await waitFor(() => {
			const checkedAfterClear = document.querySelectorAll(
				`[data-role="${DataRoles.Dropdown.Item}"][aria-checked="true"]`
			);
			expect(checkedAfterClear).toHaveLength(0);
		});

		// Verify the clear button is hidden
		const clearButtonAfterClear = document.querySelector<HTMLElement>(
			"[id='multiselect-test-popup-multiselect-clear-button']"
		);
		expect(clearButtonAfterClear).toBeNull();

		// Save, close and Reopen Modal — verify items remain cleared
		await userEvent.keyboard("{Escape}");
		await userEvent.click(input);

		await waitFor(() => {
			const checkedAfterReopen = document.querySelectorAll(
				`[data-role="${DataRoles.Dropdown.Item}"][aria-checked="true"]`
			);
			expect(checkedAfterReopen).toHaveLength(0);
		});

		const clearButtonAfterReopen = document.querySelector<HTMLElement>(
			"[id='multiselect-test-popup-multiselect-clear-button']"
		);
		expect(clearButtonAfterReopen).toBeNull();
	});

	test("Should clear the input text when tapping on the clear button", async () => {
		render(<ExampleMultiselect items={mobileItems} selectedItems={[mobileItems[3]]} isMobile />);

		// Open the modal with the default selected value (C++)
		const input = document.querySelector<HTMLElement>(`[data-role="${DataRoles.TextField.Input}"]`)!;
		await userEvent.click(input);

		// Verify dropdown is visible
		await waitFor(() => {
			expect(queryByDataRole(document.body, DataRoles.Dropdown)).toBeTruthy();
		});

		// Select 'Java'
		const javaItem = document.querySelector<HTMLElement>('[id="java"]')!;
		javaItem.focus();
		await userEvent.keyboard(" ");

		// Save and close modal
		await userEvent.keyboard("{Escape}");

		// Blur input wrapper
		const inputWrapper = document.querySelector<HTMLElement>(`[data-role="${DataRoles.TextField.Input.Wrapper}"]`)!;
		fireEvent.blur(inputWrapper);

		// Click the clear button (substitute for tap)
		const clearButton = document.querySelector<HTMLElement>("[id='multiselect-test-multiselect-clear-button']")!;
		await userEvent.click(clearButton);

		// Verify: dropdown is visible, popup clear button is hidden, popup input is empty
		await waitFor(() => {
			expect(queryByDataRole(document.body, DataRoles.Dropdown)).toBeTruthy();
		});

		const clearButtonPopup = document.querySelector<HTMLElement>(
			"[id='multiselect-test-popup-multiselect-clear-button']"
		);
		expect(clearButtonPopup).toBeNull();

		const inputPopup = document.querySelector<HTMLInputElement>("[id='multiselect-test-popup-multiselect__input']");
		expect(inputPopup?.value).toBe("");
	});
});
