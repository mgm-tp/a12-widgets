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
import { editorThemeClasses } from "../../src/rich-text-editor/main/themes/themes.js";

import { expect, test } from "../fixtures/playwright.config.js";

import { DefaultEditorCombination } from "./default-editor-combination.stories.js";

test.describe("List Plugin", () => {
	test("Should create auto list when typing '1. ' ", async ({ mount, getByDataRole, page }) => {
		const selectedText = "1. ";
		await mount(<DefaultEditorCombination />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);
		await editorInput.fill(selectedText);

		const listItems = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();
		await expect(listItems).not.toBeVisible();

		await editorInput.press("Enter");

		const numberListButton = page.locator("[title='Numbered list']").first();

		expect(await numberListButton.getAttribute("aria-pressed")).toEqual("true");

		await expect(listItems).toBeVisible();
	});

	test("Should create an auto list with list item is a mention node", async ({ mount, getByDataRole, page }) => {
		const selectedText = "1. @";
		await mount(<DefaultEditorCombination hasMentionPlugin />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);
		await editorInput.fill(selectedText);

		const listItems = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();
		await expect(listItems).not.toBeVisible();

		const mentionList = getByDataRole(DataRoles.RichTextEditor.MentionSuggestion);

		await expect(mentionList).toBeVisible();

		await mentionList.press("Enter");

		await expect(mentionList).not.toBeVisible();

		const mentionNode = editorInput.locator(`.${editorThemeClasses.mention}`).first();

		await expect(mentionNode).toBeVisible();

		await editorInput.press("Enter");

		const numberListButton = page.locator("[title='Numbered list']").first();

		expect(await numberListButton.getAttribute("aria-pressed")).toEqual("true");

		await expect(listItems).toBeVisible();
	});

	test("Should add a mention node and create an auto list", async ({ mount, getByDataRole, page }) => {
		const selectedText = "1. hello @";
		await mount(<DefaultEditorCombination hasMentionPlugin />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);
		await editorInput.fill(selectedText);

		const listItems = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();
		await expect(listItems).not.toBeVisible();

		const mentionList = getByDataRole(DataRoles.RichTextEditor.MentionSuggestion);

		await expect(mentionList).toBeVisible();

		await mentionList.press("Enter");

		await expect(mentionList).not.toBeVisible();

		const mentionNode = editorInput.locator(`.${editorThemeClasses.mention}`).first();

		await expect(mentionNode).toBeVisible();

		await editorInput.press("Enter");

		const numberListButton = page.locator("[title='Numbered list']").first();

		expect(await numberListButton.getAttribute("aria-pressed")).toEqual("true");

		await expect(listItems).toBeVisible();
	});

	test("Should create an auto list contain a node with tooltip", async ({ mount, getByDataRole, page }) => {
		const selectedText = "1. hello example-tooltip";
		await mount(<DefaultEditorCombination hasTooltipPlugin />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);
		await editorInput.fill(selectedText);

		const listItems = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();
		await expect(listItems).not.toBeVisible();

		await editorInput.press("Enter");

		const tooltipNode = editorInput.locator(`.${editorThemeClasses.withTooltipWord}`).first();

		await expect(tooltipNode).toBeVisible();

		const numberListButton = page.locator("[title='Numbered list']").first();

		expect(await numberListButton.getAttribute("aria-pressed")).toEqual("true");

		await expect(listItems).toBeVisible();
	});

	test("Should create an auto list with list item is a node with tooltip", async ({ mount, getByDataRole, page }) => {
		const selectedText = "1. example-tooltip";
		await mount(<DefaultEditorCombination hasTooltipPlugin />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);
		await editorInput.fill(selectedText);

		const listItems = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();
		await expect(listItems).not.toBeVisible();

		await editorInput.press("Enter");

		const tooltipNode = editorInput.locator(`.${editorThemeClasses.withTooltipWord}`).first();

		await expect(tooltipNode).toBeVisible();

		const numberListButton = page.locator("[title='Numbered list']").first();

		expect(await numberListButton.getAttribute("aria-pressed")).toEqual("true");

		await expect(listItems).toBeVisible();
	});

	test("Should create an auto list contain an auto link node", async ({ mount, getByDataRole, page }) => {
		const selectedText = "1. hello A12W-1234";
		await mount(<DefaultEditorCombination hasAutoLinkPlugin />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);
		await editorInput.fill(selectedText);

		const listItems = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();
		await expect(listItems).not.toBeVisible();

		await editorInput.press("Enter");

		const autoLink = editorInput.locator("a").first();

		await expect(autoLink).toBeVisible();
		expect(await autoLink.getAttribute("class")).toContain("editor-link");

		const numberListButton = page.locator("[title='Numbered list']").first();

		expect(await numberListButton.getAttribute("aria-pressed")).toEqual("true");

		await expect(listItems).toBeVisible();
	});

	test("Should create an auto list with list item is an auto link node", async ({ mount, getByDataRole, page }) => {
		const selectedText = "1. A12W-1234";
		await mount(<DefaultEditorCombination hasAutoLinkPlugin />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);
		await editorInput.fill(selectedText);

		const listItems = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();
		await expect(listItems).not.toBeVisible();

		await editorInput.press("Enter");

		const autoLink = editorInput.locator("a").first();

		await expect(autoLink).toBeVisible();
		await expect(autoLink).toContainClass("editor-link");

		const numberListButton = page.locator("[title='Numbered list']").first();

		expect(await numberListButton.getAttribute("aria-pressed")).toEqual("true");

		await expect(listItems).toBeVisible();
	});

	test("Should create an auto list with after typing @ and press Escape", async ({ mount, getByDataRole }) => {
		const selectedText = "1. @";
		await mount(<DefaultEditorCombination hasMentionPlugin />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);
		await editorInput.fill(selectedText);

		const listItem = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();
		await expect(listItem).not.toBeVisible();

		await editorInput.press("Escape");
		await editorInput.press("Enter");

		await expect(listItem).toBeVisible();
	});

	test("Should create an auto list properly after typing text and @", async ({ mount, getByDataRole }) => {
		const selectedText = "1. Hello @";
		await mount(<DefaultEditorCombination hasMentionPlugin />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);
		await editorInput.fill(selectedText);

		const listItem = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();
		await expect(listItem).not.toBeVisible();

		await editorInput.press("Escape");
		await editorInput.press("Enter");

		await expect(listItem).toBeVisible();
	});

	test("Should create an auto list properly after typing text and @ without space", async ({
		mount,
		getByDataRole
	}) => {
		const selectedText = "1. Hello@";
		await mount(<DefaultEditorCombination hasMentionPlugin />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);
		await editorInput.fill(selectedText);

		const listItem = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();
		await expect(listItem).not.toBeVisible();

		await editorInput.press("Enter");

		await expect(listItem).toBeVisible();
	});

	test("Should not create list item when typing `Hello 1000. years Vietnam`", async ({ mount, getByDataRole }) => {
		const selectedText = "Hello 1000. years Vietnam";
		await mount(<DefaultEditorCombination />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);
		await editorInput.fill(selectedText);

		await editorInput.press("Enter");
		const listItems = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();

		await expect(listItems).not.toBeVisible();

		const breakLine = editorInput.locator("p").nth(1).locator("br").first();
		await expect(breakLine).toBeAttached();
	});

	test("Should insert break line when moving cursor to the beginning and pressing Enter", async ({
		page,
		mount,
		getByDataRole
	}) => {
		const selectedText = "Hello 1000. years Vietnam";
		await mount(<DefaultEditorCombination />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);
		await editorInput.fill(selectedText);

		await editorInput.focus();

		await editorInput.press("Home");
		await page.waitForTimeout(100); // Wait for cursor to move to the beginning
		await editorInput.press("Enter");

		const listItems = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();
		await expect(listItems).not.toBeVisible();

		const breakLine = editorInput.locator("p").first().locator("br").first();
		await expect(breakLine).toBeAttached();
	});

	test("Should create list item when typing `1000. years Vietnam 2.23`", async ({ mount, getByDataRole }) => {
		const selectedText = "1000. years Vietnam";
		await mount(<DefaultEditorCombination />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);
		await editorInput.fill(selectedText);

		const listItems = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();
		await expect(listItems).not.toBeVisible();

		await editorInput.press("Enter");

		await expect(listItems).toBeVisible();

		expect(await listItems.getAttribute("value")).toBe("1000");

		await editorInput.press("Enter");

		const secondListItem = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).nth(1);

		await expect(secondListItem).toBeVisible();

		expect(await secondListItem.getAttribute("value")).toBe("1001");
	});

	test("Should preserve bold formatting when creating nested list with Tab", async ({ mount, getByDataRole, page }) => {
		await mount(<DefaultEditorCombination />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);

		// Click bold buttons
		const boldButton = page.locator("[title='Bold']").first();
		await boldButton.click();

		await expect(boldButton).toHaveAttribute("aria-pressed", "true");

		await editorInput.focus();
		await editorInput.pressSequentially("1. hello");
		await editorInput.press("Enter");
		const firstListItem = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();

		await expect(firstListItem).toBeVisible();
		await expect(firstListItem).toHaveAttribute("value", "1");

		const firstItemBold = firstListItem.locator(`.${editorThemeClasses.text?.bold}`);

		await expect(firstItemBold).toBeVisible();

		await editorInput.press("Enter");
		const secondListItem = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).nth(1);

		await expect(secondListItem).toBeVisible();
		await expect(secondListItem).toHaveAttribute("value", "2");

		await editorInput.press("Tab");
		await editorInput.pressSequentially("nested item");
		const listItemsWithText = editorInput
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`)
			.locator(`.${editorThemeClasses.list?.listitem}`);

		await expect(listItemsWithText).toHaveAttribute("value", "1");
		await expect(listItemsWithText).toBeVisible();

		const formattedText = listItemsWithText.locator(`.${editorThemeClasses.text?.bold}`);

		await expect(formattedText).toBeVisible();

		await editorInput.press("Enter");
		await editorInput.press("Tab");
		await editorInput.pressSequentially("nested item 2");
		const nestedList = editorInput
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`)
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`);
		const formattedText2 = nestedList.locator(`.${editorThemeClasses.text?.bold}`);

		await expect(formattedText2).toBeVisible();
	});

	test("Should preserve italic formatting when creating nested list with Tab", async ({
		mount,
		getByDataRole,
		page
	}) => {
		await mount(<DefaultEditorCombination />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);

		// Click italic button
		const italicButton = page.locator("[title='Italic']").first();
		await italicButton.click();

		await expect(italicButton).toHaveAttribute("aria-pressed", "true");

		await editorInput.focus();
		await editorInput.pressSequentially("1. hello");
		await editorInput.press("Enter");
		const firstListItem = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();

		await expect(firstListItem).toBeVisible();
		await expect(firstListItem).toHaveAttribute("value", "1");

		const firstItemItalic = firstListItem.locator(`.${editorThemeClasses.text?.italic}`);

		await expect(firstItemItalic).toBeVisible();

		await editorInput.press("Enter");
		const secondListItem = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).nth(1);

		await expect(secondListItem).toBeVisible();
		await expect(secondListItem).toHaveAttribute("value", "2");

		await editorInput.press("Tab");
		await editorInput.pressSequentially("nested item");
		const listItemsWithText = editorInput
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`)
			.locator(`.${editorThemeClasses.list?.listitem}`);

		await expect(listItemsWithText).toHaveAttribute("value", "1");
		await expect(listItemsWithText).toBeVisible();

		const formattedText = listItemsWithText.locator(`.${editorThemeClasses.text?.italic}`);

		await expect(formattedText).toBeVisible();

		await editorInput.press("Enter");
		await editorInput.press("Tab");
		await editorInput.pressSequentially("nested item 2");
		const nestedList = editorInput
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`)
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`);
		const formattedText2 = nestedList.locator(`.${editorThemeClasses.text?.italic}`);

		await expect(formattedText2).toBeVisible();
	});

	test("Should preserve underline formatting when creating nested list with Tab", async ({
		mount,
		getByDataRole,
		page
	}) => {
		await mount(<DefaultEditorCombination />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);

		// Click underline button
		const underlineButton = page.locator("[title='Underline']").first();
		await underlineButton.click();

		await expect(underlineButton).toHaveAttribute("aria-pressed", "true");

		await editorInput.focus();
		await editorInput.pressSequentially("1. hello");
		await editorInput.press("Enter");
		const firstListItem = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();

		await expect(firstListItem).toBeVisible();
		await expect(firstListItem).toHaveAttribute("value", "1");

		const firstItemUnderline = firstListItem.locator(`.${editorThemeClasses.text?.underline}`);

		await expect(firstItemUnderline).toBeVisible();

		await editorInput.press("Enter");
		const secondListItem = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).nth(1);

		await expect(secondListItem).toBeVisible();
		await expect(secondListItem).toHaveAttribute("value", "2");

		await editorInput.press("Tab");
		await editorInput.pressSequentially("nested item");
		const listItemsWithText = editorInput
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`)
			.locator(`.${editorThemeClasses.list?.listitem}`);

		await expect(listItemsWithText).toHaveAttribute("value", "1");
		await expect(listItemsWithText).toBeVisible();

		const formattedText = listItemsWithText.locator(`.${editorThemeClasses.text?.underline}`);

		await expect(formattedText).toBeVisible();

		await editorInput.press("Enter");
		await editorInput.press("Tab");
		await editorInput.pressSequentially("nested item 2");
		const nestedList = editorInput
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`)
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`);
		const formattedText2 = nestedList.locator(`.${editorThemeClasses.text?.underline}`);

		await expect(formattedText2).toBeVisible();
	});

	test("Should preserve strikethrough formatting when creating nested list with Tab", async ({
		mount,
		getByDataRole,
		page
	}) => {
		await mount(<DefaultEditorCombination />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);

		const customGroupButton = getByDataRole(DataRoles.RichTextEditor.ToolbarItem).nth(4);
		await customGroupButton.click();
		const strikethroughButton = page.locator(`.${editorThemeClasses.text?.strikethrough}`).first();
		await strikethroughButton.click();

		await editorInput.focus();
		await editorInput.pressSequentially("1. hello");
		await editorInput.press("Enter");
		const firstListItem = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();

		await expect(firstListItem).toBeVisible();
		await expect(firstListItem).toHaveAttribute("value", "1");

		const firstItemStrikethrough = firstListItem.locator(`.${editorThemeClasses.text?.strikethrough}`);

		await expect(firstItemStrikethrough).toBeVisible();

		await editorInput.press("Enter");
		const secondListItem = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).nth(1);

		await expect(secondListItem).toBeVisible();
		await expect(secondListItem).toHaveAttribute("value", "2");

		await editorInput.press("Tab");
		await editorInput.pressSequentially("nested item");
		const listItemsWithText = editorInput
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`)
			.locator(`.${editorThemeClasses.list?.listitem}`);

		await expect(listItemsWithText).toHaveAttribute("value", "1");
		await expect(listItemsWithText).toBeVisible();

		const formattedText = listItemsWithText.locator(`.${editorThemeClasses.text?.strikethrough}`);

		await expect(formattedText).toBeVisible();

		await editorInput.press("Enter");
		await editorInput.press("Tab");
		await editorInput.pressSequentially("nested item 2");
		const nestedList = editorInput
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`)
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`);
		const formattedText2 = nestedList.locator(`.${editorThemeClasses.text?.strikethrough}`);

		await expect(formattedText2).toBeVisible();
	});

	test("Should preserve multiple formatting styles when creating nested list with Tab", async ({
		mount,
		getByDataRole,
		page
	}) => {
		await mount(<DefaultEditorCombination />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);

		// Click multiple formatting buttons
		const boldButton = page.locator("[title='Bold']").first();
		const italicButton = page.locator("[title='Italic']").first();
		const underlineButton = page.locator("[title='Underline']").first();

		await boldButton.click();
		await italicButton.click();
		await underlineButton.click();

		await expect(boldButton).toHaveAttribute("aria-pressed", "true");
		await expect(italicButton).toHaveAttribute("aria-pressed", "true");
		await expect(underlineButton).toHaveAttribute("aria-pressed", "true");

		await editorInput.focus();
		await editorInput.pressSequentially("1. hello");
		await editorInput.press("Enter");
		const firstListItem = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).first();

		await expect(firstListItem).toBeVisible();
		await expect(firstListItem).toHaveAttribute("value", "1");

		const firstItemBold = firstListItem.locator(`.${editorThemeClasses.text?.bold}`);

		await expect(firstItemBold).toBeVisible();
		await expect(firstItemBold).toHaveClass(
			`${editorThemeClasses.text?.underline} ${editorThemeClasses.text?.italic} ${editorThemeClasses.text?.bold}`
		);

		await editorInput.press("Enter");
		const secondListItem = editorInput.locator(`.${editorThemeClasses.list?.listitem}`).nth(1);

		await expect(secondListItem).toBeVisible();
		await expect(secondListItem).toHaveAttribute("value", "2");

		await editorInput.press("Tab");
		await editorInput.pressSequentially("nested item");
		const listItemsWithText = editorInput
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`)
			.locator(`.${editorThemeClasses.list?.listitem}`);

		await expect(listItemsWithText).toHaveAttribute("value", "1");
		await expect(listItemsWithText).toBeVisible();

		const nestedBold = listItemsWithText.locator(`.${editorThemeClasses.text?.bold}`);

		await expect(nestedBold).toBeVisible();
		await expect(nestedBold).toHaveClass(
			`${editorThemeClasses.text?.underline} ${editorThemeClasses.text?.italic} ${editorThemeClasses.text?.bold}`
		);

		await editorInput.press("Enter");
		await editorInput.press("Tab");
		await editorInput.pressSequentially("nested item 2");
		const deepNestedList = editorInput
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`)
			.locator(`.${editorThemeClasses.list?.nested?.listitem}`);

		const deepNestedBold = deepNestedList.locator(`.${editorThemeClasses.text?.bold}`);

		await expect(deepNestedBold).toBeVisible();
		await expect(deepNestedBold).toHaveClass(
			`${editorThemeClasses.text?.underline} ${editorThemeClasses.text?.italic} ${editorThemeClasses.text?.bold}`
		);
	});
});
