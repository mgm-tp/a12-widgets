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

import { Autocomplete } from "../../src/input/autocomplete/main/autocomplete.view.js";
import { Icon } from "../../src/icon/main/icon.view.js";
import { Link } from "../../src/link/main/link/link.view.js";
import { noop } from "../../src/common/main/utils.js";
import type { DropDownItem } from "../../src/dropdown/main/template/dropdown.tpl.api.js";
import { DataRoles } from "../../src/common/main/data-roles.js";

import { test, expect, delay } from "../fixtures/playwright.config.js";

import { ExampleAsynchronousAutoComplete, ExampleAutoComplete } from "./autocomplete.stories.js";

test.describe("Autocomplete desktop", () => {
	const items = [
		"Đà Nẵng",
		"London",
		"New York",
		"Beijing",
		"Dubai",
		"Hong Kong",
		"Paris",
		"Amsterdam",
		"Brussels",
		"Chicago",
		"São Paulo",
		"Los Angeles",
		"Madrid",
		"Seoul",
		"München",
		"Singapore",
		"Medellín",
		"Glasgow",
		"Prague",
		"Marrakech",
		"Berlin",
		"Montreal"
	];

	test.describe("Non-asynchronous", () => {
		test("clear selection range after selecting with keyboard", async ({ mount, getByDataRole }) => {
			await mount(<ExampleAutoComplete items={items} />);
			const input = getByDataRole(DataRoles.Textline.Input);

			await input.fill("New");
			await input.press("Enter");
			await expect(input).toHaveJSProperty("selectionStart", 8);
			await expect(input).toHaveJSProperty("selectionEnd", 8);
		});

		test("Should not render the clear button when `enableClearButton` is false", async ({ mount, getByDataRole }) => {
			await mount(
				<Autocomplete
					enableClearButton={false}
					items={items}
					onValueChange={noop}
					hintTemplate="{count} out of {total} options shown"
				/>
			);

			const clearButton = getByDataRole(DataRoles.Button);
			const input = getByDataRole(DataRoles.Textline.Input);

			// Check if the clear button is not visible when the input is empty.
			await expect(clearButton).not.toBeVisible();

			await input.click();
			await input.fill("Seoul");

			// Check if the clear button is still not visible when the input has a value.
			await expect(clearButton).not.toBeVisible();
		});

		test("Input caret position should not change after filtering matched items", async ({ mount, getByDataRole }) => {
			await mount(<Autocomplete items={items} hintTemplate="Just a hint" onValueChange={noop} />);
			const input = getByDataRole(DataRoles.Textline.Input);
			await input.fill("Đà Nẵng");

			for (let i = 0; i < 4; i++) {
				await input.press("ArrowLeft");
			}

			await input.press("Delete");
			await input.press("n");
			await expect(input).toHaveJSProperty("selectionStart", 4);
			await expect(input).toHaveJSProperty("selectionEnd", 4);
		});

		test("Dropdown should open and the focus is set on input field after clicking to input", async ({
			mount,
			getByDataRole
		}) => {
			await mount(<Autocomplete items={items} hintTemplate="Just a hint" onValueChange={noop} />);

			const input = getByDataRole(DataRoles.Textline.Input);

			await input.click();
			await expect(input).toBeFocused();

			const dropdown = getByDataRole(DataRoles.Dropdown).first();
			await expect(dropdown).toBeVisible();
		});

		test("Dropdown should open and the focus is set on input field after clicking to label", async ({
			mount,
			getByDataRole
		}) => {
			await mount(
				<Autocomplete
					label="Autocomplete label"
					items={items}
					hintTemplate="Just a hint"
					onValueChange={noop}
					id="autocomplete-id"
				/>
			);
			const label = getByDataRole(DataRoles.Textline.Label);
			await label.click();
			const input = getByDataRole(DataRoles.Textline.Input);
			await expect(input).toBeFocused();
			const dropdown = getByDataRole(DataRoles.Dropdown).first();
			await expect(dropdown).toBeVisible();
		});

		test("Compare amount of dropdown hint and actual amount of dropdown items", async ({ mount, getByDataRole }) => {
			await mount(<Autocomplete items={items} hintTemplate="{count} matches" onValueChange={noop} />);
			const input = getByDataRole(DataRoles.Textline.Input);

			await input.fill("London");
			const hintElement = getByDataRole(DataRoles.Dropdown.Hint);
			const dropdownItemsCount = await getByDataRole(DataRoles.Dropdown.Item).count();
			await expect(hintElement).toHaveText(`${dropdownItemsCount} matches`);
		});

		test("Type a keyword that is matched to dropdown items gets highlighted", async ({ mount, getByDataRole }) => {
			const component = await mount(<ExampleAutoComplete items={items} />);
			const input = getByDataRole(DataRoles.Textline.Input);
			const inputValue = "London";
			await input.focus();
			await input.fill(inputValue);

			const preSelectItem = component.locator(`[aria-selected='true'][data-role='${DataRoles.Dropdown.Item}']`);
			await expect(preSelectItem).toHaveText(inputValue);

			// Press enter to select item after the matched dropdown item gets highlighted.
			await input.press("Enter");

			await expect(input).toHaveValue(inputValue);
			await expect(getByDataRole(DataRoles.Dropdown)).toHaveCount(0);
		});

		test("Enter to show all dropdown-item after selecting", async ({ mount, getByDataRole }) => {
			const newItems = ["Cat", "Cat A", "Cat B", ...items];
			await mount(<ExampleAutoComplete items={newItems} />);
			const input = getByDataRole(DataRoles.Textline.Input);
			const inputValue = "Cat";

			await input.fill(inputValue);
			await input.press("ArrowDown");
			await input.press("Enter");
			await expect(input).toHaveValue(newItems[1]);
			await expect(getByDataRole(DataRoles.Dropdown)).toHaveCount(0);

			// Enter to show all dropdown-item
			await input.press("Enter");

			const dropdownItems = getByDataRole(DataRoles.Dropdown.Item);
			await expect(dropdownItems).toHaveCount(newItems.length);
		});

		test("The dropdown is able to scroll when pressing Up/Down arrow key", async ({ mount, getByDataRole }) => {
			await mount(<Autocomplete items={items} hintTemplate="{count} matches" onValueChange={noop} />);
			const input = getByDataRole(DataRoles.Textline.Input);
			await input.click();

			for (let i = 0; i < 4; i++) {
				await input.press("ArrowDown");
			}

			await expect(input).toBeFocused();
			const preselectItem = getByDataRole(DataRoles.Dropdown.Item).getByText(items[items.length - 1]);
			await expect(preselectItem).toBeVisible();
		});

		test("The dropdown is closed with selecting the preselect item after pressing Escape", async ({
			mount,
			getByDataRole
		}) => {
			await mount(<ExampleAutoComplete items={items} />);
			const input = getByDataRole(DataRoles.Textline.Input);
			await input.click();

			for (let i = 0; i < 4; i++) {
				await input.press("ArrowDown");
			}

			await input.press("Escape");

			await expect(input).toHaveValue(items[3]);
			await expect(getByDataRole(DataRoles.Dropdown)).toHaveCount(0);
		});

		test("The dropdown of Autocomplete Link is closed without selecting any preselect item after pressing Escape", async ({
			mount,
			getByDataRole
		}) => {
			const inputValue = "London";

			await mount(
				<Autocomplete
					items={items}
					hintTemplate="{count} matches"
					onValueChange={noop}
					links={[
						<Link>Assign to me</Link>,
						<Link>
							<Icon>person_remove</Icon> Remove assignment
						</Link>
					]}
					value={inputValue}
				/>
			);
			const input = getByDataRole(DataRoles.Textline.Input);
			await input.click();

			await input.press("ArrowDown");
			await input.press("Escape");

			await expect(input).toHaveValue(inputValue);
			await expect(getByDataRole(DataRoles.Dropdown)).toHaveCount(0);
		});

		test("Should open the dropdown with the selected item highlighted after press up/down arrow key", async ({
			mount,
			getByDataRole
		}) => {
			const items = ["London", "London1", "London2"];
			const component = await mount(<Autocomplete items={items} hintTemplate="{count} matches" onValueChange={noop} />);
			const input = getByDataRole(DataRoles.Textline.Input);
			const inputValue = "London";
			await input.click();
			await input.fill(inputValue);
			await input.press("Enter");
			await input.press("ArrowDown");

			const preSelectItem = component.locator(`[aria-selected='true'][data-role='${DataRoles.Dropdown.Item}']`);
			await expect(preSelectItem).toHaveText(inputValue);
		});

		test("Clear button trigger clearing the selection of current item", async ({ mount, getByDataRole }) => {
			const inputValue = items[1];

			await mount(
				<Autocomplete items={items} hintTemplate="{count} matches" value={inputValue} onValueChange={noop} />
			);
			const clearButton = getByDataRole(DataRoles.Button).first();

			await clearButton.press("Enter");
			const input = getByDataRole(DataRoles.Textline.Input);
			await expect(input).toHaveValue("");
		});

		test("Select only one item when multiple items have the same label but different ids", async ({
			mount,
			getByDataRole
		}) => {
			const ITEMS: DropDownItem[] = [
				{
					id: "1",
					label: "Da Nang",
					secondaryText: "Mien Trung"
				},

				{
					id: "2",
					label: "London",
					secondaryText: "Anh Quoc"
				},
				{
					id: "3",
					label: "Da Nang",
					secondaryText: "Mien Trung Viet Nam"
				},
				{
					id: "4",
					label: "Berlin",
					secondaryText: "Germany"
				},
				{
					id: "5",
					label: "Ha Noi",
					secondaryText: "Mien Bac Viet Nam"
				}
			];

			const component = await mount(<Autocomplete items={ITEMS} hintTemplate="{count} matches" onValueChange={noop} />);

			const input = getByDataRole(DataRoles.Textline.Input);
			await input.click();

			await input.press("ArrowDown");

			const selectedItems = component.locator(`[aria-selected='true'][data-role='${DataRoles.Dropdown.Item}']`);
			const preSelectItems = component.locator(`[aria-selected='true'][data-role='${DataRoles.Dropdown.Item}']`);

			await expect(selectedItems).toHaveCount(1);
			await expect(preSelectItems).toHaveCount(1);
		});
	});

	test.describe("Asynchronous", () => {
		test("Should not trigger the onSearch callback when input value is empty", async ({ mount, getByDataRole }) => {
			await mount(<ExampleAsynchronousAutoComplete itemsProps={items} timeout={1500} />);
			const input = getByDataRole(DataRoles.Textline.Input);

			await input.click();
			const progress = getByDataRole(DataRoles.ProgressIndicator.OuterOverlay);

			await expect(progress).toBeHidden();
		});

		/**
		 * This test verifies that an item is selected when the Enter key is pressed.
		 * It ensures that:
		 * 1. The dropdown displays the correct number of items when opened.
		 * 2. The first item in the dropdown is highlighted when the down arrow key is pressed.
		 * 3. The highlighted item is selected when the Enter key is pressed.
		 * 4. The input field displays the selected item and the dropdown is closed after selection.
		 */
		test("Should select the item when Enter key is pressed", async ({ mount, getByDataRole }) => {
			const sortedItems = items.sort();
			const component = await mount(<ExampleAsynchronousAutoComplete itemsProps={items} timeout={1500} />);
			const input = getByDataRole(DataRoles.Textline.Input);

			await input.click();

			const dropdownItem = getByDataRole(DataRoles.Dropdown.Item);
			await expect(dropdownItem).toHaveCount(items.length);

			await input.press("ArrowDown");

			const selectedItem = component.locator(`[aria-selected='true'][data-role='${DataRoles.Dropdown.Item}']`);
			await expect(selectedItem).toHaveText(sortedItems[0]);
			await expect(selectedItem).toHaveCount(1);

			await selectedItem.focus();

			await selectedItem.press("Enter");
			await expect(input).toHaveValue(sortedItems[0]);
			await expect(selectedItem).toHaveCount(0);
		});

		/**
		 * This test verifies that all items are displayed when the dropdown is reopened if the data is already available.
		 * It ensures that:
		 * 1. The onSearch callback is triggered if type on input or click if input value is not empty.
		 * 2. The dropdown displays the correct number of items when reopened.
		 * 3. The input field displays the correct item when filled.
		 */
		test("Should display all items when dropdown is reopened if data is already available", async ({
			mount,
			getByDataRole
		}) => {
			const component = await mount(<ExampleAsynchronousAutoComplete itemsProps={items} timeout={1500} />);
			const input = getByDataRole(DataRoles.Textline.Input);
			const inputValue = "Berlin";
			await input.fill(inputValue);
			const progress = getByDataRole(DataRoles.ProgressIndicator.OuterOverlay);
			await expect(progress).toBeVisible();

			await delay(1500);
			await expect(progress).toBeHidden();

			const dropdownItem = getByDataRole(DataRoles.Dropdown.Item);
			const selectedItem = component.locator(`[aria-selected='true'][data-role='${DataRoles.Dropdown.Item}']`);
			await expect(selectedItem).toHaveText(inputValue);
			await expect(dropdownItem).toHaveCount(1);
			await input.press("Escape");

			await input.click();
			await expect(progress).toBeVisible();
			await delay(1500);
			await expect(progress).toBeHidden();

			await expect(selectedItem).toHaveText(inputValue);
			await expect(dropdownItem).toHaveCount(items.length);
		});
	});
});
