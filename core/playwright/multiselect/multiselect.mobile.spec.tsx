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

import { DataRoles } from "../../src/common/main/data-roles.js";

import { test, expect } from "../fixtures/playwright.config.js";

import { ExampleMultiselect } from "./multiselect.stories.js";

test.describe("Multiselect", () => {
	const items = [
		{
			id: "java",
			label: "Java"
		},
		{
			id: "groovy",
			label: "Groovy"
		},
		{
			id: "javaScript",
			label: "JavaScript"
		},
		{
			id: "c++",
			label: "C++"
		},
		{
			id: "c",
			label: "C"
		},
		{
			id: "scala",
			label: "Scala"
		},
		{
			id: "python",
			label: "Python"
		},
		{
			id: "php",
			label: "PHP"
		},
		{
			id: "actionScript",
			label: "ActionScript"
		},
		{
			id: "appleScript",
			label: "AppleScript"
		},
		{
			id: "asp",
			label: "Asp"
		},
		{
			id: "clojure",
			label: "Clojure"
		},
		{
			id: "cobol",
			label: "COBOL"
		},
		{
			id: "basic",
			label: "BASIC"
		},
		{
			id: "coldFusion",
			label: "ColdFusion"
		},
		{
			id: "123",
			label: "123"
		},
		{
			id: "456",
			label: "456"
		}
	];

	/**
	 * This test verifies the functionality of the "Clear Text" button in the multiselect component on mobile.
	 *
	 * Steps:
	 * 1. Mount the `ExampleMultiselect` component with a default selected item.
	 * 2. Open the modal and verify the dropdown is visible.
	 * 3. Select an additional item from the dropdown.
	 * 4. Save and close the modal.
	 * 5. Reopen the modal and verify the selected items.
	 * 6. Use the "Clear Text" button to clear the selected items.
	 * 7. Verify that the selected items are cleared and the "Clear Text" button is hidden.
	 */
	test("The Clear Text button should clear a selected item if the item was chosen from a search result", async ({
		mount,
		getByDataRole
	}) => {
		const component = await mount(<ExampleMultiselect items={items} selectedItems={[items[3]]} isMobile />);

		// Open the modal with the default selected value (C++)
		const input = getByDataRole(DataRoles.Textline.Input);

		await input.click();

		await expect(getByDataRole(DataRoles.Dropdown)).toBeVisible();

		// Select 'Java'
		const javaItem = component.locator('[id="java"]');
		await javaItem.focus();
		await javaItem.press("Space");

		// Save, close and Reopen Modal
		await javaItem.press("Escape");
		await input.click();

		// Check that there are two items with aria-checked="true" and they are "C++" and "Java"
		const checkedItems = component.locator(`[data-role="${DataRoles.Dropdown.Item}"][aria-checked="true"]`);
		await expect(checkedItems).toHaveCount(2);
		await expect(getByDataRole(DataRoles.Dropdown.Text, checkedItems.nth(0))).toHaveText("Java");
		await expect(getByDataRole(DataRoles.Dropdown.Text, checkedItems.nth(1))).toHaveText("C++");

		// Save, close and Reopen Modal
		const modalInput = getByDataRole(DataRoles.Textline.Input).nth(1);
		await modalInput.fill("h");

		const python = component.locator('[id="python"]');
		await python.focus();
		await python.press("Space");
		await python.press("Escape");

		// Re-open the modal and tap 'Clear text' in the input (or uncheck all selected items)
		await input.click();
		const clearButton = component.locator("[id='multiselect-test-popup-multiselect-clear-button']");
		await clearButton.click();
		await expect(checkedItems).toHaveCount(0);
		await expect(clearButton).toBeHidden();

		// Save, close and Reopen Modal
		await modalInput.press("Escape");
		await input.click();
		await expect(clearButton).toBeHidden();
		await expect(checkedItems).toHaveCount(0);
	});

	test("Should clear the input text when tapping on the clear button", async ({ mount, getByDataRole }) => {
		const component = await mount(<ExampleMultiselect items={items} selectedItems={[items[3]]} isMobile />);

		// Open the modal with the default selected value (C++)
		const input = getByDataRole(DataRoles.Textline.Input);

		await input.click();

		const dropDown = getByDataRole(DataRoles.Dropdown);
		await expect(dropDown).toBeVisible();

		// Select 'Java'
		const javaItem = component.locator('[id="java"]');
		await javaItem.focus();
		await javaItem.press("Space");

		// Save and close modal
		await javaItem.press("Escape");

		const clearButton = component.locator("[id='multiselect-test-multiselect-clear-button']");

		// Blur input
		const inputWrapper = getByDataRole(DataRoles.Textline.Input.Wrapper);
		await inputWrapper.blur();

		await clearButton.tap();

		const clearButtonPopup = component.locator("[id='multiselect-test-popup-multiselect-clear-button']");
		const inputPopup = component.locator("[id='multiselect-test-popup-multiselect__input']");

		await expect(dropDown).toBeVisible();
		await expect(clearButtonPopup).toBeHidden();
		await expect(inputPopup).toHaveValue("");
	});
});
