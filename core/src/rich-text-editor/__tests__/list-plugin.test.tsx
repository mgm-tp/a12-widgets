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
import { getAllByDataRole, getByDataRole, queryByDataRole, render, waitFor } from "test-utils";

import { DataRoles } from "../../common/main/data-roles.js";

import { editorThemeClasses } from "../main/themes/themes.js";

import { DefaultEditorCombination } from "./default-editor-combination.js";

describe("List Plugin", () => {
	test("Should create auto list when typing '1. ' ", async () => {
		const selectedText = "1. ";
		const { container } = render(<DefaultEditorCombination />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.type(editorInput, selectedText);

		expect(editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`)).toBeNull();

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const numberListButton = document.querySelector("[title='Numbered list']");
			expect(numberListButton).toBeTruthy();
			expect(numberListButton!.getAttribute("aria-pressed")).toEqual("true");

			const listItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(listItem).toBeVisible();
		});
	});

	test("Should create an auto list with list item is a mention node", async () => {
		const selectedText = "1. @";
		const { container } = render(<DefaultEditorCombination hasMentionPlugin />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.type(editorInput, selectedText);

		expect(editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`)).toBeNull();

		await waitFor(() => {
			const mentionList = queryByDataRole(document.body, DataRoles.RichTextEditor.MentionSuggestion);
			expect(mentionList).toBeVisible();
		});

		const mentionList = queryByDataRole(document.body, DataRoles.RichTextEditor.MentionSuggestion)!;
		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			expect(mentionList).not.toBeVisible();
		});

		const mentionNode = editorInput.querySelector(`.${editorThemeClasses.mention}`);
		expect(mentionNode).toBeVisible();

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const numberListButton = document.querySelector("[title='Numbered list']");
			expect(numberListButton).toBeTruthy();
			expect(numberListButton!.getAttribute("aria-pressed")).toEqual("true");

			const listItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(listItem).toBeVisible();
		});
	});

	test("Should add a mention node and create an auto list", async () => {
		const selectedText = "1. hello @";
		const { container } = render(<DefaultEditorCombination hasMentionPlugin />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.type(editorInput, selectedText);

		const listItems = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
		expect(listItems).toBeNull();

		await waitFor(() => {
			const mentionList = queryByDataRole(document.body, DataRoles.RichTextEditor.MentionSuggestion);
			expect(mentionList).toBeVisible();
		});

		const mentionList = queryByDataRole(document.body, DataRoles.RichTextEditor.MentionSuggestion)!;
		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			expect(mentionList).not.toBeVisible();
		});

		const mentionNode = editorInput.querySelector(`.${editorThemeClasses.mention}`);
		expect(mentionNode).toBeVisible();

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const numberListButton = document.querySelector("[title='Numbered list']");
			expect(numberListButton).toBeTruthy();
			expect(numberListButton!.getAttribute("aria-pressed")).toEqual("true");

			const listItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(listItem).toBeVisible();
		});
	});

	test("Should create an auto list contain a node with tooltip", async () => {
		const selectedText = "1. hello example-tooltip";
		const { container } = render(<DefaultEditorCombination hasTooltipPlugin />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.type(editorInput, selectedText);

		const listItems = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
		expect(listItems).toBeNull();

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const tooltipNode = editorInput.querySelector(`.${editorThemeClasses.withTooltipWord}`);
			expect(tooltipNode).toBeVisible();

			const numberListButton = document.querySelector("[title='Numbered list']");
			expect(numberListButton).toBeTruthy();
			expect(numberListButton!.getAttribute("aria-pressed")).toEqual("true");

			const listItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(listItem).toBeVisible();
		});
	});

	test("Should create an auto list with list item is a node with tooltip", async () => {
		const selectedText = "1. example-tooltip";
		const { container } = render(<DefaultEditorCombination hasTooltipPlugin />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.type(editorInput, selectedText);

		const listItems = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
		expect(listItems).toBeNull();

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const tooltipNode = editorInput.querySelector(`.${editorThemeClasses.withTooltipWord}`);
			expect(tooltipNode).toBeVisible();

			const numberListButton = document.querySelector("[title='Numbered list']");
			expect(numberListButton).toBeTruthy();
			expect(numberListButton!.getAttribute("aria-pressed")).toEqual("true");

			const listItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(listItem).toBeVisible();
		});
	});

	test("Should create an auto list contain an auto link node", async () => {
		const selectedText = "1. hello A12W-1234";
		const { container } = render(<DefaultEditorCombination hasAutoLinkPlugin />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.type(editorInput, selectedText);

		const listItems = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
		expect(listItems).toBeNull();

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const autoLink = editorInput.querySelector("a");
			expect(autoLink).toBeVisible();
			expect(autoLink!.className).toContain("editor-link");

			const numberListButton = document.querySelector("[title='Numbered list']");
			expect(numberListButton).toBeTruthy();
			expect(numberListButton!.getAttribute("aria-pressed")).toEqual("true");

			const listItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(listItem).toBeVisible();
		});
	});

	test("Should create an auto list with list item is an auto link node", async () => {
		const selectedText = "1. A12W-1234";
		const { container } = render(<DefaultEditorCombination hasAutoLinkPlugin />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.type(editorInput, selectedText);

		const listItems = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
		expect(listItems).toBeNull();

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const autoLink = editorInput.querySelector("a");
			expect(autoLink).toBeVisible();
			expect(autoLink!.className).toContain("editor-link");

			const numberListButton = document.querySelector("[title='Numbered list']");
			expect(numberListButton).toBeTruthy();
			expect(numberListButton!.getAttribute("aria-pressed")).toEqual("true");

			const listItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(listItem).toBeVisible();
		});
	});

	test("Should create an auto list with after typing @ and press Escape", async () => {
		const selectedText = "1. @";
		const { container } = render(<DefaultEditorCombination hasMentionPlugin />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.type(editorInput, selectedText);

		const listItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
		expect(listItem).toBeNull();

		await userEvent.keyboard("{Escape}");
		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const item = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(item).toBeVisible();
		});
	});

	test("Should create an auto list properly after typing text and @", async () => {
		const selectedText = "1. Hello @";
		const { container } = render(<DefaultEditorCombination hasMentionPlugin />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.type(editorInput, selectedText);

		const listItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
		expect(listItem).toBeNull();

		await userEvent.keyboard("{Escape}");
		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const item = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(item).toBeVisible();
		});
	});

	test("Should create an auto list properly after typing text and @ without space", async () => {
		const selectedText = "1. Hello@";
		const { container } = render(<DefaultEditorCombination hasMentionPlugin />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.type(editorInput, selectedText);

		const listItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
		expect(listItem).toBeNull();

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const item = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(item).toBeVisible();
		});
	});

	test("Should not create list item when typing `Hello 1000. years Vietnam`", async () => {
		const selectedText = "Hello 1000. years Vietnam";
		const { container } = render(<DefaultEditorCombination />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.type(editorInput, selectedText);

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const listItems = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(listItems).toBeNull();

			const breakLine = editorInput.querySelectorAll("p")[1]?.querySelector("br");
			expect(breakLine).toBeTruthy();
		});
	});

	test("Should insert break line when moving cursor to the beginning and pressing Enter", async () => {
		const selectedText = "Hello 1000. years Vietnam";
		const { container } = render(<DefaultEditorCombination />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.type(editorInput, selectedText);

		editorInput.focus();

		await userEvent.keyboard("{Home}");
		await new Promise((r) => setTimeout(r, 100)); // Wait for cursor to move to the beginning
		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const listItems = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(listItems).toBeNull();

			const breakLine = editorInput.querySelectorAll("p")[0]?.querySelector("br");
			expect(breakLine).toBeTruthy();
		});
	});

	test("Should create list item when typing `1000. years Vietnam 2.23`", async () => {
		const selectedText = "1000. years Vietnam";
		const { container } = render(<DefaultEditorCombination />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.type(editorInput, selectedText);

		const listItems = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
		expect(listItems).toBeNull();

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const firstListItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(firstListItem).toBeVisible();
			expect(firstListItem!.getAttribute("value")).toBe("1000");
		});

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const allListItems = editorInput.querySelectorAll(`.${editorThemeClasses.list?.listitem}`);
			expect(allListItems.length).toBeGreaterThanOrEqual(2);
			expect(allListItems[1]).toBeVisible();
			expect(allListItems[1].getAttribute("value")).toBe("1001");
		});
	});

	test("Should preserve bold formatting when creating nested list with Tab", async () => {
		const { container } = render(<DefaultEditorCombination />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);

		// Click bold button
		const boldButton = document.querySelector("[title='Bold']")!;
		await userEvent.click(boldButton);

		await waitFor(() => {
			expect(boldButton.getAttribute("aria-pressed")).toBe("true");
		});

		editorInput.focus();
		await userEvent.type(editorInput, "1. hello");
		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const firstListItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(firstListItem).toBeVisible();
			expect(firstListItem!.getAttribute("value")).toBe("1");

			const firstItemBold = firstListItem!.querySelector(`.${editorThemeClasses.text?.bold}`);
			expect(firstItemBold).toBeVisible();
		});

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const allListItems = editorInput.querySelectorAll(`.${editorThemeClasses.list?.listitem}`);
			expect(allListItems.length).toBeGreaterThanOrEqual(2);
			expect(allListItems[1]).toBeVisible();
			expect(allListItems[1].getAttribute("value")).toBe("2");
		});

		await userEvent.tab();
		await userEvent.type(editorInput, "nested item");

		await waitFor(() => {
			const nestedListItem = editorInput
				.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`)
				?.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(nestedListItem).toBeTruthy();
			expect(nestedListItem!.getAttribute("value")).toBe("1");
			expect(nestedListItem).toBeVisible();

			const formattedText = nestedListItem!.querySelector(`.${editorThemeClasses.text?.bold}`);
			expect(formattedText).toBeVisible();
		});

		await userEvent.keyboard("{Enter}");
		await userEvent.tab();
		await userEvent.type(editorInput, "nested item 2");

		await waitFor(() => {
			const deepNestedList = editorInput
				.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`)
				?.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`);
			const formattedText2 = deepNestedList?.querySelector(`.${editorThemeClasses.text?.bold}`);
			expect(formattedText2).toBeVisible();
		});
	});

	test("Should preserve italic formatting when creating nested list with Tab", async () => {
		const { container } = render(<DefaultEditorCombination />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);

		// Click italic button
		const italicButton = document.querySelector("[title='Italic']")!;
		await userEvent.click(italicButton);

		await waitFor(() => {
			expect(italicButton.getAttribute("aria-pressed")).toBe("true");
		});

		editorInput.focus();
		await userEvent.type(editorInput, "1. hello");
		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const firstListItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(firstListItem).toBeVisible();
			expect(firstListItem!.getAttribute("value")).toBe("1");

			const firstItemItalic = firstListItem!.querySelector(`.${editorThemeClasses.text?.italic}`);
			expect(firstItemItalic).toBeVisible();
		});

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const allListItems = editorInput.querySelectorAll(`.${editorThemeClasses.list?.listitem}`);
			expect(allListItems.length).toBeGreaterThanOrEqual(2);
			expect(allListItems[1]).toBeVisible();
			expect(allListItems[1].getAttribute("value")).toBe("2");
		});

		await userEvent.tab();
		await userEvent.type(editorInput, "nested item");

		await waitFor(() => {
			const nestedListItem = editorInput
				.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`)
				?.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(nestedListItem).toBeTruthy();
			expect(nestedListItem!.getAttribute("value")).toBe("1");
			expect(nestedListItem).toBeVisible();

			const formattedText = nestedListItem!.querySelector(`.${editorThemeClasses.text?.italic}`);
			expect(formattedText).toBeVisible();
		});

		await userEvent.keyboard("{Enter}");
		await userEvent.tab();
		await userEvent.type(editorInput, "nested item 2");

		await waitFor(() => {
			const deepNestedList = editorInput
				.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`)
				?.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`);
			const formattedText2 = deepNestedList?.querySelector(`.${editorThemeClasses.text?.italic}`);
			expect(formattedText2).toBeVisible();
		});
	});

	test("Should preserve underline formatting when creating nested list with Tab", async () => {
		const { container } = render(<DefaultEditorCombination />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);

		// Click underline button
		const underlineButton = document.querySelector("[title='Underline']")!;
		await userEvent.click(underlineButton);

		await waitFor(() => {
			expect(underlineButton.getAttribute("aria-pressed")).toBe("true");
		});

		editorInput.focus();
		await userEvent.type(editorInput, "1. hello");
		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const firstListItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(firstListItem).toBeVisible();
			expect(firstListItem!.getAttribute("value")).toBe("1");

			const firstItemUnderline = firstListItem!.querySelector(`.${editorThemeClasses.text?.underline}`);
			expect(firstItemUnderline).toBeVisible();
		});

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const allListItems = editorInput.querySelectorAll(`.${editorThemeClasses.list?.listitem}`);
			expect(allListItems.length).toBeGreaterThanOrEqual(2);
			expect(allListItems[1]).toBeVisible();
			expect(allListItems[1].getAttribute("value")).toBe("2");
		});

		await userEvent.tab();
		await userEvent.type(editorInput, "nested item");

		await waitFor(() => {
			const nestedListItem = editorInput
				.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`)
				?.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(nestedListItem).toBeTruthy();
			expect(nestedListItem!.getAttribute("value")).toBe("1");
			expect(nestedListItem).toBeVisible();

			const formattedText = nestedListItem!.querySelector(`.${editorThemeClasses.text?.underline}`);
			expect(formattedText).toBeVisible();
		});

		await userEvent.keyboard("{Enter}");
		await userEvent.tab();
		await userEvent.type(editorInput, "nested item 2");

		await waitFor(() => {
			const deepNestedList = editorInput
				.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`)
				?.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`);
			const formattedText2 = deepNestedList?.querySelector(`.${editorThemeClasses.text?.underline}`);
			expect(formattedText2).toBeVisible();
		});
	});

	test("Should preserve strikethrough formatting when creating nested list with Tab", async () => {
		const { container } = render(<DefaultEditorCombination />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);

		const customGroupButton = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem)[4];
		await userEvent.click(customGroupButton);
		const strikethroughButton = document.querySelector(`.${editorThemeClasses.text?.strikethrough}`)!;
		await userEvent.click(strikethroughButton);

		editorInput.focus();
		await userEvent.type(editorInput, "1. hello");
		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const firstListItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(firstListItem).toBeVisible();
			expect(firstListItem!.getAttribute("value")).toBe("1");

			const firstItemStrikethrough = firstListItem!.querySelector(`.${editorThemeClasses.text?.strikethrough}`);
			expect(firstItemStrikethrough).toBeVisible();
		});

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const allListItems = editorInput.querySelectorAll(`.${editorThemeClasses.list?.listitem}`);
			expect(allListItems.length).toBeGreaterThanOrEqual(2);
			expect(allListItems[1]).toBeVisible();
			expect(allListItems[1].getAttribute("value")).toBe("2");
		});

		await userEvent.tab();
		await userEvent.type(editorInput, "nested item");

		await waitFor(() => {
			const nestedListItem = editorInput
				.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`)
				?.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(nestedListItem).toBeTruthy();
			expect(nestedListItem!.getAttribute("value")).toBe("1");
			expect(nestedListItem).toBeVisible();

			const formattedText = nestedListItem!.querySelector(`.${editorThemeClasses.text?.strikethrough}`);
			expect(formattedText).toBeVisible();
		});

		await userEvent.keyboard("{Enter}");
		await userEvent.tab();
		await userEvent.type(editorInput, "nested item 2");

		await waitFor(() => {
			const deepNestedList = editorInput
				.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`)
				?.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`);
			const formattedText2 = deepNestedList?.querySelector(`.${editorThemeClasses.text?.strikethrough}`);
			expect(formattedText2).toBeVisible();
		});
	});

	test("Should preserve multiple formatting styles when creating nested list with Tab", async () => {
		const { container } = render(<DefaultEditorCombination />);

		const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);

		// Click multiple formatting buttons
		const boldButton = document.querySelector("[title='Bold']")!;
		const italicButton = document.querySelector("[title='Italic']")!;
		const underlineButton = document.querySelector("[title='Underline']")!;

		await userEvent.click(boldButton);
		await userEvent.click(italicButton);
		await userEvent.click(underlineButton);

		await waitFor(() => {
			expect(boldButton.getAttribute("aria-pressed")).toBe("true");
			expect(italicButton.getAttribute("aria-pressed")).toBe("true");
			expect(underlineButton.getAttribute("aria-pressed")).toBe("true");
		});

		editorInput.focus();
		await userEvent.type(editorInput, "1. hello");
		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const firstListItem = editorInput.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(firstListItem).toBeVisible();
			expect(firstListItem!.getAttribute("value")).toBe("1");

			const firstItemBold = firstListItem!.querySelector(`.${editorThemeClasses.text?.bold}`);
			expect(firstItemBold).toBeVisible();
			expect(firstItemBold!.className).toBe(
				`${editorThemeClasses.text?.underline} ${editorThemeClasses.text?.italic} ${editorThemeClasses.text?.bold}`
			);
		});

		await userEvent.keyboard("{Enter}");

		await waitFor(() => {
			const allListItems = editorInput.querySelectorAll(`.${editorThemeClasses.list?.listitem}`);
			expect(allListItems.length).toBeGreaterThanOrEqual(2);
			expect(allListItems[1]).toBeVisible();
			expect(allListItems[1].getAttribute("value")).toBe("2");
		});

		await userEvent.tab();
		await userEvent.type(editorInput, "nested item");

		await waitFor(() => {
			const nestedListItem = editorInput
				.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`)
				?.querySelector(`.${editorThemeClasses.list?.listitem}`);
			expect(nestedListItem).toBeTruthy();
			expect(nestedListItem!.getAttribute("value")).toBe("1");
			expect(nestedListItem).toBeVisible();

			const nestedBold = nestedListItem!.querySelector(`.${editorThemeClasses.text?.bold}`);
			expect(nestedBold).toBeVisible();
			expect(nestedBold!.className).toBe(
				`${editorThemeClasses.text?.underline} ${editorThemeClasses.text?.italic} ${editorThemeClasses.text?.bold}`
			);
		});

		await userEvent.keyboard("{Enter}");
		await userEvent.tab();
		await userEvent.type(editorInput, "nested item 2");

		await waitFor(() => {
			const deepNestedList = editorInput
				.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`)
				?.querySelector(`.${editorThemeClasses.list?.nested?.listitem}`);
			const deepNestedBold = deepNestedList?.querySelector(`.${editorThemeClasses.text?.bold}`);
			expect(deepNestedBold).toBeVisible();
			expect(deepNestedBold!.className).toBe(
				`${editorThemeClasses.text?.underline} ${editorThemeClasses.text?.italic} ${editorThemeClasses.text?.bold}`
			);
		});
	});
});
