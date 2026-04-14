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

import { expect, test } from "../fixtures/playwright.config.js";

import { DefaultEditorCombination } from "./default-editor-combination.stories.js";

test.describe("TextFormatPlugin - Unmergeable Nodes", () => {
	test("should NOT merge custom unmergeable space nodes when applying bold format", async ({
		mount,
		getByDataRole,
		page
	}) => {
		await mount(<DefaultEditorCombination hasUnmergeablePlugin />);

		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		await expect(editor).toBeVisible();

		await editor.click();
		await editor.pressSequentially("hello world");

		// Enable unmergeable plugin to mark space nodes as custom unmergeable
		const enableUnmergeableCheckbox = getByDataRole(DataRoles.Checkbox.Input);
		await expect(enableUnmergeableCheckbox).toBeVisible();
		await enableUnmergeableCheckbox.click();

		// Wait for plugin to process nodes
		await page.waitForTimeout(200);

		// Verify space node exists by checking for a text node with only space
		const editorContent = await editor.innerHTML();
		expect(editorContent).toContain("hello");
		expect(editorContent).toContain("world");

		// Select all text and apply bold
		const modifierKey = process.platform === "darwin" ? "Meta" : "Control";
		await editor.click();
		await page.keyboard.press(`${modifierKey}+A`);
		await page.waitForTimeout(200);

		const boldButton = getByDataRole(DataRoles.RichTextEditor.ToolbarItem).first();
		await boldButton.click();

		await page.waitForTimeout(200);

		// Verify space node still exists as separate node after applying bold
		const boldNodes = await page.locator("[contenteditable] strong.editor-text-bold").all();
		expect(boldNodes.length).toBe(3);

		// Check that one of the bold nodes is a space
		let hasSpaceNode = false;

		for (const node of boldNodes) {
			const text = await node.textContent();

			if (text === " ") {
				hasSpaceNode = true;
				break;
			}
		}

		expect(hasSpaceNode).toBe(true);
	});

	test("should merge lexical unmergeable nodes with same style when applying bold format", async ({
		mount,
		getByDataRole,
		page
	}) => {
		await mount(<DefaultEditorCombination />);

		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		await expect(editor).toBeVisible();

		await editor.click();
		await editor.pressSequentially("abc def ghi");

		const modifierKey = process.platform === "darwin" ? "Meta" : "Control";

		// Select all text and apply bold to create lexical unmergeable nodes
		await page.keyboard.press(`${modifierKey}+A`);
		await page.waitForTimeout(100);

		const boldButton = getByDataRole(DataRoles.RichTextEditor.ToolbarItem).first();
		await boldButton.click();

		await page.waitForTimeout(300);

		const boldNodes = await page.locator("b, strong").count();

		// Verify all text is still present
		const allText = await editor.textContent();
		expect(allText).toContain("abc");
		expect(allText).toContain("def");
		expect(allText).toContain("ghi");

		// All nodes with same style should merge into a single bold node
		expect(boldNodes).toBe(1);

		// Verify the single bold node contains all text
		const boldText = await page.locator("b, strong").first().textContent();
		expect(boldText).toContain("abc def ghi");
	});
});
