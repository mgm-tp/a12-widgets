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

import type { Locator, Page } from "playwright";

import { DataRoles } from "../../../src/common/main/data-roles.js";
import { expect, test } from "../../fixtures/playwright.config.js";
import { clickOutsideLocator } from "../../utils/mouse-utils.js";

import { EditorWithToolbar } from "./toolbar-plugin.stories.js";

test.describe("Rich Text Editor Toolbar Plugin", () => {
	test("Format button status on focus and blur editor", async ({ mount, page, getByDataRole }) => {
		await mount(<EditorWithToolbar />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);

		const boldButton = getByDataRole(DataRoles.RichTextEditor.ToolbarItem).nth(0).getByRole("button");

		await clickBoldButtonAndRefocus(page, editor, boldButton);
		await expect(boldButton).toHaveAttribute("aria-pressed", "true");

		await boldButton.click();

		await editor.pressSequentially("widget");

		await clickBoldButtonAndRefocus(page, editor, boldButton);
		await expect(boldButton).toHaveAttribute("aria-pressed", "false");

		await clickBoldButtonAndRefocus(page, editor, boldButton, "A12");
		await expect(boldButton).toHaveAttribute("aria-pressed", "true");
	});

	test("Custom style button status on focus and blur editor", async ({ mount, page, getByDataRole }) => {
		await mount(<EditorWithToolbar />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);

		const styledButtonGroup = getByDataRole(DataRoles.RichTextEditor.ToolbarItem).nth(3).getByRole("button");

		await clickStyledButtonAndRefocus(page, getByDataRole, editor, styledButtonGroup);
		await expect(styledButtonGroup).toHaveAttribute("aria-pressed", "true");

		await clickStyledButton(getByDataRole, styledButtonGroup);

		await editor.pressSequentially("widget");

		await clickStyledButtonAndRefocus(page, getByDataRole, editor, styledButtonGroup);
		await expect(styledButtonGroup).toHaveAttribute("aria-pressed", "false");

		await clickStyledButtonAndRefocus(page, getByDataRole, editor, styledButtonGroup, "A12");
		await expect(styledButtonGroup).toHaveAttribute("aria-pressed", "true");
	});

	test("Should retain focus on the last toolbar item", async ({ mount, getByDataRole }) => {
		const isToolbarItemFocused = (item: Locator) => {
			return item.evaluate((element) => document.activeElement === element.firstChild);
		};

		await mount(<EditorWithToolbar />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		await editor.focus();

		// Press Shift + Tab to focus the toolbar
		await editor.press("Shift+Tab");
		const toolbarItems = getByDataRole(DataRoles.RichTextEditor.ToolbarItem);
		const firstToolbarItem = toolbarItems.first();
		expect(await isToolbarItemFocused(firstToolbarItem)).toBe(true);

		// Press Arrow Right to focus the next toolbar item
		await firstToolbarItem.press("ArrowRight");
		const secondToolbarItem = toolbarItems.nth(1);
		expect(await isToolbarItemFocused(secondToolbarItem)).toBe(true);

		// Press Tab to focus the editor again
		await secondToolbarItem.press("Tab");
		expect(await editor.evaluate((element) => document.activeElement === element)).toBe(true);

		// Press Shift + Tab to focus the toolbar again
		await editor.press("Shift+Tab");
		expect(await isToolbarItemFocused(secondToolbarItem)).toBe(true);
	});

	test("Editor should not auto-focus after typing and clicking outside", async ({ mount, page, getByDataRole }) => {
		await mount(<EditorWithToolbar />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);

		await editor.click();

		await expect(editor).toBeFocused();

		await editor.pressSequentially("Hello world");

		// Click outside to blur the editor
		await clickOutsideLocator(page, editor);

		await expect(editor).not.toBeFocused();

		await page.waitForTimeout(200);

		await expect(editor).not.toBeFocused();

		await editor.click();
		await editor.pressSequentially(" mgm-tp test A12W-123");

		await clickOutsideLocator(page, editor);

		await expect(editor).not.toBeFocused();

		await page.waitForTimeout(300);

		await expect(editor).not.toBeFocused();
	});

	test("Editor focus behavior with toolbar interactions", async ({ mount, page, getByDataRole }) => {
		await mount(<EditorWithToolbar />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		const boldButton = getByDataRole(DataRoles.RichTextEditor.ToolbarItem).nth(0).getByRole("button");

		await editor.click();
		await editor.pressSequentially("Test text");

		await boldButton.click();

		await clickOutsideLocator(page, editor);

		await expect(editor).not.toBeFocused();

		await page.waitForTimeout(200);

		await expect(editor).not.toBeFocused();

		await editor.click();
		await editor.pressSequentially(" more text");

		await clickOutsideLocator(page, editor);

		await expect(editor).not.toBeFocused();

		await page.waitForTimeout(300);

		await expect(editor).not.toBeFocused();
	});
});

const clickBoldButtonAndRefocus = async (
	page: Page,
	editor: Locator,
	boldButton: Locator,
	text?: string
): Promise<void> => {
	await boldButton.click();
	await expect(boldButton).toHaveAttribute("aria-pressed", "true");

	if (text) {
		await editor.pressSequentially(text);
	}

	await clickOutsideLocator(page, editor);

	await expect(editor).not.toBeFocused();

	await page.waitForTimeout(300);

	await editor.click();
	await expect(editor).toBeFocused();
};

const clickStyledButton = async (
	getByDataRole: (role: string, container?: Locator) => Locator,
	styledButtonGroup: Locator
): Promise<void> => {
	await styledButtonGroup.click();
	const styledButton = getByDataRole(DataRoles.RichTextEditor.ToolbarListItem).nth(0).getByRole("button");
	await styledButton.click();
};

const clickStyledButtonAndRefocus = async (
	page: Page,
	getByDataRole: (role: string, container?: Locator) => Locator,
	editor: Locator,
	styledButtonGroup: Locator,
	text?: string
): Promise<void> => {
	await clickStyledButton(getByDataRole, styledButtonGroup);
	await expect(styledButtonGroup).toHaveAttribute("aria-pressed", "true");

	if (text) {
		await editor.pressSequentially(text);
	}

	await clickOutsideLocator(page, editor);

	await expect(editor).not.toBeFocused();

	await editor.click();
	await expect(editor).toBeFocused();
};
