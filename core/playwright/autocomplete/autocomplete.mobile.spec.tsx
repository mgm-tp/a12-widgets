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

import { MobileAutocomplete } from "../../src/input/autocomplete/main/autocomplete.mobile.view.js";
import { noop } from "../../src/common/main/utils.js";
import { DataRoles } from "../../src/common/main/data-roles.js";

import { test, expect } from "../fixtures/playwright.config.js";

test.describe("Autocomplete mobile", () => {
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

	test("Modal should open and the focus is set on input field after clicking to input", async ({
		mount,
		getByDataRole
	}) => {
		const component = await mount(<MobileAutocomplete items={items} hintTemplate="Just a hint" onValueChange={noop} />);
		const input = getByDataRole(DataRoles.Textline.Input);

		await input.click();

		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);
		const inputModal = getByDataRole(DataRoles.Textline.Input, modalOverlay);

		await expect(inputModal).toBeFocused();

		// Modal close with selecting the item after tapping to select an item
		const item = getByDataRole(DataRoles.Dropdown.Item, component).first();

		await item.click();

		await expect(inputModal).toHaveCount(0);
		await expect(input).toHaveValue(items[0]);
	});

	test("Modal should be closed without selecting any new item when pressing Save and Close button", async ({
		mount,
		getByDataRole
	}) => {
		const component = await mount(<MobileAutocomplete items={items} hintTemplate="Just a hint" onValueChange={noop} />);

		const input = getByDataRole(DataRoles.Textline.Input);

		await input.click();

		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);
		const inputModal = getByDataRole(DataRoles.Textline.Input, modalOverlay);
		const button = component.locator("[aria-label='Save and close']");

		await button.click();

		await expect(inputModal).toHaveCount(0);
		await expect(input).toHaveValue("");
	});

	test("Modal should be closed without clearing the selected item", async ({ mount, getByDataRole }) => {
		const inputValue = items[2];
		const component = await mount(
			<MobileAutocomplete items={items} hintTemplate="Just a hint" value={inputValue} onValueChange={noop} />
		);

		const input = getByDataRole(DataRoles.Textline.Input);

		await input.click();

		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);
		const inputModal = getByDataRole(DataRoles.Textline.Input, modalOverlay);

		for (let i = 0; i < inputValue.length; i++) {
			await inputModal.press("Backspace");
		}

		await inputModal.press("Space");

		const button = component.locator("[aria-label='Save and close']");

		await button.click();

		await expect(input).toHaveValue(inputValue);

		await input.click();

		for (let i = 0; i < inputValue.length; i++) {
			await inputModal.press("Backspace");
		}

		await inputModal.pressSequentially("not existing item");
		await button.click();

		await expect(input).toHaveValue(inputValue);
	});

	test("Modal should be closed with clearing the selected item", async ({ mount, getByDataRole }) => {
		const inputValue = items[2];
		await mount(
			<MobileAutocomplete items={items} hintTemplate="Just a hint" value={inputValue} onValueChange={noop} />
		);
		const input = getByDataRole(DataRoles.Textline.Input);

		await input.click();

		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);
		const buttonClear = modalOverlay.locator("[aria-label='Clear text']");
		const buttonSaveAndClose = modalOverlay.locator("[aria-label='Save and close']");

		await buttonClear.click();
		await buttonSaveAndClose.click();

		await expect(input).toHaveValue("");
	});

	test("Modal should close with selecting the matched item after Enter to a matching item", async ({
		mount,
		getByDataRole
	}) => {
		await mount(<MobileAutocomplete items={items} hintTemplate="Just a hint" onValueChange={noop} />);
		const input = getByDataRole(DataRoles.Textline.Input);

		await input.click();

		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);
		const inputModal = getByDataRole(DataRoles.Textline.Input, modalOverlay);

		await inputModal.click();
		await inputModal.fill("London");
		await inputModal.press("Enter");

		await expect(inputModal).toHaveCount(0);
		await expect(input).toHaveValue(items[1]);
	});

	test("Should clear input value when tapping on the clear button", async ({ mount, getByDataRole }) => {
		await mount(<MobileAutocomplete items={items} hintTemplate="Just a hint" onValueChange={noop} />);

		const input = getByDataRole(DataRoles.Textline.Input);

		await input.click();

		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);
		const inputModal = getByDataRole(DataRoles.Textline.Input, modalOverlay);

		await inputModal.click();
		await inputModal.fill("London");
		await inputModal.press("Enter");

		const inputWrapper = getByDataRole(DataRoles.Textline.Input.Wrapper);

		await inputWrapper.blur();

		const clearButton = getByDataRole(DataRoles.Button, inputWrapper);

		await clearButton.tap();

		await expect(inputModal).toBeVisible();
		await expect(inputModal).toHaveValue("");
		await expect(clearButton).toBeHidden();
	});

	test("Should not render the clear button when `enableClearButton` is false", async ({ mount, getByDataRole }) => {
		await mount(
			<MobileAutocomplete enableClearButton={false} items={items} onValueChange={noop} hintTemplate="Just a hint" />
		);

		const input = getByDataRole(DataRoles.Textline.Input);
		const inputClearButton = getByDataRole(DataRoles.Button);
		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);
		const inputModal = getByDataRole(DataRoles.Textline.Input, modalOverlay);
		const inputModalWrapper = getByDataRole(DataRoles.Textline.Input.Wrapper);
		const inputModalClearButton = getByDataRole(DataRoles.Button, inputModalWrapper);

		// Check if the input's clear button is not visible when the input is empty.
		await expect(inputClearButton).not.toBeVisible();

		await input.click();

		// Check if the input modal's clear button is not visible when the input is empty.
		await expect(inputModalClearButton).not.toBeVisible();

		await inputModal.click();
		await inputModal.fill("Seoul");

		// Check if the input modal's clear button is still not visible when the input has a value.
		await expect(inputModalClearButton).not.toBeVisible();

		await inputModal.press("Enter");

		// Check if the input's clear button is still not visible when the modal is closed and the input has a value.
		await expect(inputClearButton).not.toBeVisible();
	});
});
