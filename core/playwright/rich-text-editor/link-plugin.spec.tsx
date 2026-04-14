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

// Define the patterns array for use in tests
const patterns = [
	{ text: "cn.vn", description: "plain domain" },
	{ text: "www.com.vn", description: "www domain" },
	{ text: "A12W-1234", description: "regex pattern" },
	{ text: "https://www.google.com/", description: "HTTPS URL" }
];

test.describe("Link Plugin", () => {
	test("Should auto-link text matching link regex (e.g. A12W-1234)", async ({ mount, getByDataRole }) => {
		const selectedText = "A12W-1234";
		await mount(<DefaultEditorCombination hasAutoLinkPlugin />);

		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);
		await editorInput.fill(selectedText);

		const autoLink = editorInput.locator(`.${editorThemeClasses.link}`).first();
		await expect(autoLink).toBeVisible();
		expect(await autoLink.getAttribute("href")).toContain(selectedText);
	});

	test("Should auto-link plain domain text (e.g. cn.vn)", async ({ mount, getByDataRole }) => {
		await mount(<DefaultEditorCombination hasAutoLinkPlugin />);
		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);

		await editorInput.fill("cn.vn");
		const autoLink = editorInput.locator(`.${editorThemeClasses.link}`).first();
		await expect(autoLink).toBeVisible();
		expect(await autoLink.getAttribute("href")).toContain("cn.vn");
	});

	test("Should auto-link URLs after typing @ (e.g. 'www.com.vn@ www.google.com')", async ({ mount, getByDataRole }) => {
		await mount(<DefaultEditorCombination hasAutoLinkPlugin hasMentionPlugin />);
		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);

		await editorInput.fill("www.com.vn");

		const autoLink = editorInput.locator(`.${editorThemeClasses.link}`).first();

		await expect(autoLink).toBeVisible();

		expect(await autoLink.getAttribute("href")).toContain("www.com.vn");

		await editorInput.pressSequentially("@");

		const mentionList = getByDataRole(DataRoles.RichTextEditor.MentionSuggestion);

		await expect(mentionList).toBeVisible();
		await mentionList.press("Escape");
		await expect(mentionList).not.toBeVisible();

		await expect(autoLink).toBeVisible();

		expect(await autoLink.getAttribute("href")).toContain("www.com.vn");

		await editorInput.pressSequentially(" www.google.com");

		const secondAutoLink = editorInput.locator(`.${editorThemeClasses.link}`).nth(1);

		await expect(secondAutoLink).toBeVisible();
		expect(await secondAutoLink.getAttribute("href")).toContain("www.google.com");

		// Move cursor to the space between the links
		await editorInput.focus();
		await editorInput.press("Home");
		const fullText = await editorInput.innerText();
		const spaceIndex = fullText.indexOf(" ");

		// Move caret to just **after** the space
		for (let i = 0; i <= spaceIndex; i++) {
			await editorInput.press("ArrowRight");
		}

		// Now caret is right after the space → press Backspace
		await editorInput.press("Backspace");

		// After removing the space, there should be only one merged link
		const mergedLink = editorInput.locator(`.${editorThemeClasses.link}`).first();
		await expect(mergedLink).toBeVisible();
		expect(await mergedLink.getAttribute("href")).toContain("www.com.vn@www.google.com");
	});

	test("Should add a mention node after a link (e.g. 'com.vn Widgets')", async ({ mount, getByDataRole }) => {
		await mount(<DefaultEditorCombination hasAutoLinkPlugin hasMentionPlugin />);
		const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);

		await editorInput.fill("com.vn");

		const autoLink = editorInput.locator(`.${editorThemeClasses.link}`).first();

		await expect(autoLink).toBeVisible();
		expect(await autoLink.getAttribute("href")).toContain("com.vn");

		// Press space to continue typing and add a mention
		await editorInput.press("Space");
		await editorInput.pressSequentially("@");

		const mentionList = getByDataRole(DataRoles.RichTextEditor.MentionSuggestion);

		await expect(mentionList).toBeVisible();

		await mentionList.press("Enter");

		await expect(mentionList).not.toBeVisible();

		const mentionNode = editorInput.locator(`.${editorThemeClasses.mention}`).first();

		await expect(mentionNode).toBeVisible();

		// Cut-and-paste text: style should be preserved
		await editorInput.press("ControlOrMeta+A");
		await editorInput.press("ControlOrMeta+X");

		// Paste back
		await editorInput.press("ControlOrMeta+V");

		const pastedLink = editorInput.locator(`.${editorThemeClasses.link}`).first();

		await expect(pastedLink).toBeVisible();
		expect(await pastedLink.getAttribute("href")).toContain("com.vn");

		const pastedMentionNode = editorInput.locator(`.${editorThemeClasses.mention}`).first();

		await expect(pastedMentionNode).toBeVisible();
	});

	test.describe("Auto-linking patterns after mention node", () => {
		for (const pattern of patterns) {
			test(`Should auto-link ${pattern.description} without space`, async ({ mount, getByDataRole }) => {
				await mount(<DefaultEditorCombination hasAutoLinkPlugin hasMentionPlugin />);
				const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);

				// Type '@' to trigger mention, select first suggestion
				await editorInput.fill("@");
				const mentionList = getByDataRole(DataRoles.RichTextEditor.MentionSuggestion);
				await expect(mentionList).toBeVisible();
				await mentionList.press("Enter");
				await expect(mentionList).not.toBeVisible();

				// Remove space character and add the pattern
				await editorInput.press("Backspace");
				await editorInput.pressSequentially(pattern.text);

				const autoLink = editorInput.locator(`.${editorThemeClasses.link}`).first();
				await expect(autoLink).toBeVisible();
				expect(await autoLink.getAttribute("href")).toContain(pattern.text);
			});
		}

		test("Should auto-link all patterns sequentially", async ({ mount, getByDataRole }) => {
			await mount(<DefaultEditorCombination hasAutoLinkPlugin hasMentionPlugin />);
			const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);

			await editorInput.fill("@");
			const mentionList = getByDataRole(DataRoles.RichTextEditor.MentionSuggestion);
			await expect(mentionList).toBeVisible();
			await mentionList.press("Enter");
			await expect(mentionList).not.toBeVisible();

			// Remove space character
			await editorInput.press("Backspace");

			// Add all patterns sequentially
			for (const [index, pattern] of patterns.entries()) {
				if (index > 0) {
					await editorInput.press("Space");
				}

				await editorInput.pressSequentially(pattern.text);

				const currentLink = editorInput.locator(`.${editorThemeClasses.link}`).nth(index);
				await expect(currentLink).toBeVisible();
				expect(await currentLink.getAttribute("href")).toContain(pattern.text);
			}
		});

		test("Should auto-link domain text when separated by a space (e.g. 'Widgets com.vn')", async ({
			mount,
			getByDataRole
		}) => {
			await mount(<DefaultEditorCombination hasAutoLinkPlugin hasMentionPlugin />);
			const editorInput = getByDataRole(DataRoles.RichTextEditor.Input);

			// Type '@' to trigger mention, select first suggestion
			await editorInput.fill("@");

			const mentionList = getByDataRole(DataRoles.RichTextEditor.MentionSuggestion);

			await expect(mentionList).toBeVisible();
			await mentionList.press("Enter");
			await expect(mentionList).not.toBeVisible();

			await editorInput.pressSequentially("com.vn");

			const autoLink = editorInput.locator(`.${editorThemeClasses.link}`).first();

			await expect(autoLink).toBeVisible();
			expect(await autoLink.getAttribute("href")).toContain("com.vn");
		});
	});
});
