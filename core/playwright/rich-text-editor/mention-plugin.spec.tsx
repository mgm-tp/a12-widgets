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

import type { Locator } from "playwright";
import type { MountResult } from "@playwright/experimental-ct-react";

import { DataRoles } from "../../src/common/main/data-roles.js";
import { editorThemeClasses } from "../../src/rich-text-editor/main/themes/themes.js";

import type { Fixtures } from "../fixtures/playwright.config.js";
import { expect, test } from "../fixtures/playwright.config.js";

import { DefaultEditorCombination } from "./default-editor-combination.stories.js";

test.describe("Mention Plugin - Multiple Mentions", () => {
	const getMentionNodes = (component: MountResult): Locator => {
		return component.locator(`.${editorThemeClasses.mention}`);
	};

	const createMention = async (
		getByDataRole: Fixtures["getByDataRole"],
		editor: Locator,
		trigger: string,
		index: number
	): Promise<void> => {
		await editor.pressSequentially(trigger);
		const mentionList = getByDataRole(DataRoles.RichTextEditor.MentionSuggestion);
		await expect(mentionList).toBeVisible();

		// Navigate to the desired index
		for (let i = 0; i < index; i++) {
			await mentionList.press("ArrowDown");
		}

		await mentionList.press("Enter");
	};

	const waitForMentionCount = async (component: MountResult, expectedCount: number): Promise<void> => {
		const mentions = getMentionNodes(component);
		await expect(mentions).toHaveCount(expectedCount);
	};

	test("Should be able to type multiple mentions in sequence", async ({ mount, getByDataRole }) => {
		const component = await mount(<DefaultEditorCombination hasMentionPlugin />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);

		// Type first mention
		await createMention(getByDataRole, editor, "@", 0); // A12W
		await editor.pressSequentially("and ");

		// Type second mention
		await createMention(getByDataRole, editor, "@", 1); // A12P
		await editor.pressSequentially("are working together with ");

		// Type third mention
		await createMention(getByDataRole, editor, "@", 2); // mgm

		await waitForMentionCount(component, 3);

		// Verify the content of each mention
		const mentions = getMentionNodes(component);
		await expect(mentions.nth(0)).toHaveText("Widgets");
		await expect(mentions.nth(1)).toHaveText("Plasma");
		await expect(mentions.nth(2)).toHaveText("mgm-tp");

		// Verify the full text content
		const editorText = await editor.textContent();
		expect(editorText).toBe("Widgets and Plasma are working together with mgm-tp ");
	});

	test("Should add mention node after text", async ({ mount, getByDataRole }) => {
		const component = await mount(<DefaultEditorCombination hasMentionPlugin />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);

		await editor.fill("This is a test ");

		// Create multiple mentions
		await createMention(getByDataRole, editor, "@", 0); // A12W
		await createMention(getByDataRole, editor, "@", 1); // A12P
		await createMention(getByDataRole, editor, "@", 2); // mgm

		await waitForMentionCount(component, 3);

		// Verify final state
		const mentions = getMentionNodes(component);
		await expect(mentions.nth(0)).toHaveText("Widgets");
		await expect(mentions.nth(1)).toHaveText("Plasma");
		await expect(mentions.nth(2)).toHaveText("mgm-tp");
	});

	test("Should type mention node, text and then mention node", async ({ mount, getByDataRole }) => {
		const component = await mount(<DefaultEditorCombination hasMentionPlugin />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);

		// Mention at the beginning
		await createMention(getByDataRole, editor, "@", 0); // A12W
		await editor.pressSequentially("is the start, ");

		// Mention in the middle
		await createMention(getByDataRole, editor, "@", 1); // A12P
		await editor.pressSequentially("is in the middle, and ");

		// Mention at the end
		await createMention(getByDataRole, editor, "@", 2); // mgm

		await waitForMentionCount(component, 3);

		// Verify the full text content
		const editorText = await editor.textContent();
		expect(editorText).toContain("Widgets is the start, Plasma is in the middle, and mgm-tp");
	});

	test("Should handle mentions with special characters and formatting", async ({ mount, getByDataRole }) => {
		const component = await mount(<DefaultEditorCombination hasMentionPlugin />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);

		// Add mentions with special characters around them
		await editor.pressSequentially("Hello ");
		await createMention(getByDataRole, editor, "@", 0); // A12W
		await editor.pressSequentially("! How are ");
		await createMention(getByDataRole, editor, "@", 1); // A12P
		await editor.pressSequentially("? Greetings from ");
		await createMention(getByDataRole, editor, "@", 2); // mgm
		await editor.pressSequentially(".");

		await waitForMentionCount(component, 3);

		const editorText = await editor.textContent();
		expect(editorText).toBe("Hello Widgets ! How are Plasma ? Greetings from mgm-tp .");
	});
});
