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
import { userEvent } from "vitest/browser";
import { getByDataRole, queryByDataRole, render, waitFor } from "test-utils";

import { DataRoles } from "../../common/main/data-roles.js";

import { editorThemeClasses } from "../main/themes/themes.js";

import { DefaultEditorCombination } from "./default-editor-combination.js";

// Define the patterns array for use in tests
const patterns = [
	{ text: "cn.vn", description: "plain domain" },
	{ text: "www.com.vn", description: "www domain" },
	{ text: "A12W-1234", description: "regex pattern" },
	{ text: "https://www.google.com/", description: "HTTPS URL" }
];

const getMentionSuggestion = (): HTMLElement | null =>
	queryByDataRole(document.body, DataRoles.RichTextEditor.MentionSuggestion);

describe("Link Plugin", () => {
	test("Should auto-link text matching link regex (e.g. A12W-1234)", async () => {
		const selectedText = "A12W-1234";
		const { container } = render(<DefaultEditorCombination hasAutoLinkPlugin />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.type(editorInput, selectedText);

		await waitFor(() => {
			const autoLink = editorInput.querySelector(`.${editorThemeClasses.link}`);
			expect(autoLink).toBeVisible();
			expect(autoLink!.getAttribute("href")).toContain(selectedText);
		});
	});

	test("Should auto-link plain domain text (e.g. cn.vn)", async () => {
		const { container } = render(<DefaultEditorCombination hasAutoLinkPlugin />);
		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);

		await userEvent.click(editorInput);
		await userEvent.type(editorInput, "cn.vn");

		await waitFor(() => {
			const autoLink = editorInput.querySelector(`.${editorThemeClasses.link}`);
			expect(autoLink).toBeVisible();
			expect(autoLink!.getAttribute("href")).toContain("cn.vn");
		});
	});

	test("Should auto-link URLs after typing @ (e.g. 'www.com.vn@ www.google.com')", async () => {
		const { container } = render(<DefaultEditorCombination hasAutoLinkPlugin hasMentionPlugin />);
		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);

		await userEvent.click(editorInput);
		await userEvent.type(editorInput, "www.com.vn");

		await waitFor(() => {
			const autoLink = editorInput.querySelector(`.${editorThemeClasses.link}`);
			expect(autoLink).toBeVisible();
			expect(autoLink!.getAttribute("href")).toContain("www.com.vn");
		});

		await userEvent.type(editorInput, "@");

		await waitFor(() => {
			const mentionList = getMentionSuggestion();
			expect(mentionList).toBeVisible();
		});

		await userEvent.keyboard("{Escape}");

		await waitFor(() => {
			const mentionList = getMentionSuggestion();
			expect(mentionList).not.toBeInTheDocument();
		});

		await waitFor(() => {
			const autoLink = editorInput.querySelector(`.${editorThemeClasses.link}`);
			expect(autoLink).toBeVisible();
			expect(autoLink!.getAttribute("href")).toContain("www.com.vn");
		});

		await userEvent.type(editorInput, " www.google.com");

		await waitFor(() => {
			const secondAutoLink = editorInput.querySelectorAll(`.${editorThemeClasses.link}`)[1];
			expect(secondAutoLink).toBeVisible();
			expect(secondAutoLink!.getAttribute("href")).toContain("www.google.com");
		});

		// Move cursor to the space between the links
		editorInput.focus();
		await userEvent.keyboard("{Home}");
		const fullText = editorInput.innerText;
		const spaceIndex = fullText.indexOf(" ");

		// Move caret to just **after** the space
		for (let i = 0; i <= spaceIndex; i++) {
			await userEvent.keyboard("{ArrowRight}");
		}

		// Now caret is right after the space -> press Backspace
		await userEvent.keyboard("{Backspace}");

		// After removing the space, there should be only one merged link
		await waitFor(() => {
			const mergedLink = editorInput.querySelector(`.${editorThemeClasses.link}`);
			expect(mergedLink).toBeVisible();
			expect(mergedLink!.getAttribute("href")).toContain("www.com.vn@www.google.com");
		});
	});

	test("Should add a mention node after a link (e.g. 'com.vn Widgets')", async () => {
		const { container } = render(<DefaultEditorCombination hasAutoLinkPlugin hasMentionPlugin />);
		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);

		await userEvent.click(editorInput);
		await userEvent.type(editorInput, "com.vn");

		await waitFor(() => {
			const autoLink = editorInput.querySelector(`.${editorThemeClasses.link}`);
			expect(autoLink).toBeVisible();
			expect(autoLink!.getAttribute("href")).toContain("com.vn");
		});

		// Press space to continue typing and add a mention
		await userEvent.keyboard(" ");
		await userEvent.type(editorInput, "@");

		await waitFor(() => {
			const mentionList = getMentionSuggestion();
			expect(mentionList).toBeVisible();
		});

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const mentionList = getMentionSuggestion();
			expect(mentionList).not.toBeInTheDocument();
		});

		await waitFor(() => {
			const mentionNode = editorInput.querySelector(`.${editorThemeClasses.mention}`);
			expect(mentionNode).toBeVisible();
		});

		// Cut-and-paste text: style should be preserved
		await userEvent.keyboard("{Meta>}a{/Meta}");
		await userEvent.keyboard("{Meta>}x{/Meta}");

		// Paste back
		await userEvent.keyboard("{Meta>}v{/Meta}");

		await waitFor(() => {
			const pastedLink = editorInput.querySelector(`.${editorThemeClasses.link}`);
			expect(pastedLink).toBeVisible();
			expect(pastedLink!.getAttribute("href")).toContain("com.vn");
		});

		await waitFor(() => {
			const pastedMentionNode = editorInput.querySelector(`.${editorThemeClasses.mention}`);
			expect(pastedMentionNode).toBeVisible();
		});
	});

	describe("Auto-linking patterns after mention node", () => {
		for (const pattern of patterns) {
			test(`Should auto-link ${pattern.description} without space`, async () => {
				const { container } = render(<DefaultEditorCombination hasAutoLinkPlugin hasMentionPlugin />);
				const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);

				// Type '@' to trigger mention, select first suggestion
				await userEvent.click(editorInput);
				await userEvent.type(editorInput, "@");

				await waitFor(() => {
					const mentionList = getMentionSuggestion();
					expect(mentionList).toBeVisible();
				});

				await userEvent.keyboard("{Enter}");

				await waitFor(() => {
					const mentionList = getMentionSuggestion();
					expect(mentionList).not.toBeInTheDocument();
				});

				// Remove space character and add the pattern
				await userEvent.keyboard("{Backspace}");
				await userEvent.type(editorInput, pattern.text);

				await waitFor(() => {
					const autoLink = editorInput.querySelector(`.${editorThemeClasses.link}`);
					expect(autoLink).toBeVisible();
					expect(autoLink!.getAttribute("href")).toContain(pattern.text);
				});
			});
		}

		test("Should auto-link all patterns sequentially", async () => {
			const { container } = render(<DefaultEditorCombination hasAutoLinkPlugin hasMentionPlugin />);
			const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);

			await userEvent.click(editorInput);
			await userEvent.type(editorInput, "@");

			await waitFor(() => {
				const mentionList = getMentionSuggestion();
				expect(mentionList).toBeVisible();
			});

			await userEvent.keyboard("{Enter}");

			await waitFor(() => {
				const mentionList = getMentionSuggestion();
				expect(mentionList).not.toBeInTheDocument();
			});

			// Remove space character
			await userEvent.keyboard("{Backspace}");

			// Add all patterns sequentially
			for (const [index, pattern] of patterns.entries()) {
				if (index > 0) {
					await userEvent.keyboard(" ");
				}

				await userEvent.type(editorInput, pattern.text);

				await waitFor(() => {
					const currentLink = editorInput.querySelectorAll(`.${editorThemeClasses.link}`)[index];
					expect(currentLink).toBeVisible();
					expect(currentLink!.getAttribute("href")).toContain(pattern.text);
				});
			}
		});

		test("Should auto-link domain text when separated by a space (e.g. 'Widgets com.vn')", async () => {
			const { container } = render(<DefaultEditorCombination hasAutoLinkPlugin hasMentionPlugin />);
			const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);

			// Type '@' to trigger mention, select first suggestion
			await userEvent.click(editorInput);
			await userEvent.type(editorInput, "@");

			await waitFor(() => {
				const mentionList = getMentionSuggestion();
				expect(mentionList).toBeVisible();
			});

			await userEvent.keyboard("{Enter}");

			await waitFor(() => {
				const mentionList = getMentionSuggestion();
				expect(mentionList).not.toBeInTheDocument();
			});

			await userEvent.type(editorInput, "com.vn");

			await waitFor(() => {
				const autoLink = editorInput.querySelector(`.${editorThemeClasses.link}`);
				expect(autoLink).toBeVisible();
				expect(autoLink!.getAttribute("href")).toContain("com.vn");
			});
		});
	});
});
