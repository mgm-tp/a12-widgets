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

import { describe, expect, test } from "vitest";
import { getByDataRole, queryByDataRole, render, waitFor } from "test-utils";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { editorThemeClasses } from "../../main/themes/themes.js";

import { DefaultEditorCombination } from "../default-editor-combination.js";

test("Should show tooltip on focus of MentionNode", async () => {
	const { container } = render(
		<DefaultEditorCombination hasTooltipPlugin hasMentionPlugin hasTooltipForMentionPlugin />
	);

	const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);

	editor.focus();

	await userEvent.type(editor, "@");
	await waitFor(() => {
		const mentionList = queryByDataRole(container, DataRoles.RichTextEditor.MentionSuggestion);

		expect(mentionList).toBeVisible();
	});

	await userEvent.keyboard("{Enter}");

	const mentionNode = editor.querySelector(".editor-mention");

	expect(mentionNode).toBeVisible();

	await userEvent.click(mentionNode!);

	await waitFor(() => {
		const tooltip = queryByDataRole(container, DataRoles.RichTextEditor.Tooltip);

		expect(tooltip).toBeVisible();
	});
});

describe("Mention Plugin - Multiple Mentions", () => {
	const getMentionNodes = (container: HTMLElement): NodeListOf<Element> => {
		return container.querySelectorAll(`.${editorThemeClasses.mention}`);
	};

	const createMention = async (
		container: HTMLElement,
		editor: HTMLElement,
		trigger: string,
		index: number
	): Promise<void> => {
		await userEvent.type(editor, trigger);
		await waitFor(() => {
			const mentionList = queryByDataRole(container, DataRoles.RichTextEditor.MentionSuggestion);
			expect(mentionList).toBeVisible();
		});

		// Navigate to the desired index
		for (let i = 0; i < index; i++) {
			await userEvent.keyboard("{ArrowDown}");
		}

		await userEvent.keyboard("{Enter}");
	};

	const waitForMentionCount = async (container: HTMLElement, expectedCount: number): Promise<void> => {
		await waitFor(() => {
			const mentions = getMentionNodes(container);
			expect(mentions.length).toBe(expectedCount);
		});
	};

	test("Should be able to type multiple mentions in sequence", async () => {
		const { container } = render(<DefaultEditorCombination hasMentionPlugin />);
		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);

		// Type first mention
		await createMention(container, editor, "@", 0); // A12W
		await userEvent.type(editor, "and ");

		// Type second mention
		await createMention(container, editor, "@", 1); // A12P
		await userEvent.type(editor, "are working together with ");

		// Type third mention
		await createMention(container, editor, "@", 2); // mgm

		await waitForMentionCount(container, 3);

		// Verify the content of each mention
		const mentions = getMentionNodes(container);
		expect(mentions[0]).toHaveTextContent("Widgets");
		expect(mentions[1]).toHaveTextContent("Plasma");
		expect(mentions[2]).toHaveTextContent("mgm-tp");

		// Verify the full text content
		expect(editor.textContent).toBe("Widgets and Plasma are working together with mgm-tp ");
	});

	test("Should add mention node after text", async () => {
		const { container } = render(<DefaultEditorCombination hasMentionPlugin />);
		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);

		await userEvent.click(editor);
		await userEvent.type(editor, "This is a test ");

		// Create multiple mentions
		await createMention(container, editor, "@", 0); // A12W
		await createMention(container, editor, "@", 1); // A12P
		await createMention(container, editor, "@", 2); // mgm

		await waitForMentionCount(container, 3);

		// Verify final state
		const mentions = getMentionNodes(container);
		expect(mentions[0]).toHaveTextContent("Widgets");
		expect(mentions[1]).toHaveTextContent("Plasma");
		expect(mentions[2]).toHaveTextContent("mgm-tp");
	});

	test("Should type mention node, text and then mention node", async () => {
		const { container } = render(<DefaultEditorCombination hasMentionPlugin />);
		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);

		// Mention at the beginning
		await createMention(container, editor, "@", 0); // A12W
		await userEvent.type(editor, "is the start, ");

		// Mention in the middle
		await createMention(container, editor, "@", 1); // A12P
		await userEvent.type(editor, "is in the middle, and ");

		// Mention at the end
		await createMention(container, editor, "@", 2); // mgm

		await waitForMentionCount(container, 3);

		// Verify the full text content
		expect(editor.textContent).toContain("Widgets is the start, Plasma is in the middle, and mgm-tp");
	});

	test("Should handle mentions with special characters and formatting", async () => {
		const { container } = render(<DefaultEditorCombination hasMentionPlugin />);
		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);

		// Add mentions with special characters around them
		await userEvent.type(editor, "Hello ");
		await createMention(container, editor, "@", 0); // A12W
		await userEvent.type(editor, "! How are ");
		await createMention(container, editor, "@", 1); // A12P
		await userEvent.type(editor, "? Greetings from ");
		await createMention(container, editor, "@", 2); // mgm
		await userEvent.type(editor, ".");

		await waitForMentionCount(container, 3);

		expect(editor.textContent).toBe("Hello Widgets ! How are Plasma ? Greetings from mgm-tp .");
	});
});
