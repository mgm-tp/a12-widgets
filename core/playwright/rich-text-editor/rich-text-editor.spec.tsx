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

import { DataRoles } from "../../src/common/main/data-roles.js";
import { editorThemeClasses } from "../../src/rich-text-editor/main/themes/themes.js";

import type { Fixtures } from "../fixtures/playwright.config.js";
import { expect, test } from "../fixtures/playwright.config.js";

import {
	DefaultEditorFormatTextExample,
	ReadonlyEditorExample,
	ReadonlyEditorWithSpellCheckExample,
	SimpleEditorExample,
	ToolbarEditorExampleWithLinkPlugin
} from "./rich-text-editor.stories.js";

test.describe("Rich Text Editor", () => {
	const formatTextAndAddMentionNode = async (page: Page, getByDataRole: Fixtures["getByDataRole"]) => {
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		const [boldButton, ...rest] = await getByDataRole(DataRoles.RichTextEditor.ToolbarItem).all();
		const customFormatButton = rest[2];

		await boldButton.click();
		await customFormatButton.click();

		const strikethroughButton = getByDataRole(DataRoles.RichTextEditor.ToolbarListItem).first();
		await strikethroughButton.click();

		await editor.pressSequentially("@");
		await page.waitForTimeout(200); // Wait for mention dropdown to appear
		await editor.press("Enter");

		return editor.locator(`.${editorThemeClasses.mention}`);
	};

	test("Should not reset text styles after transforming to a Mention node", async ({ mount, page, getByDataRole }) => {
		await mount(<DefaultEditorFormatTextExample />);

		const mentionNode = await formatTextAndAddMentionNode(page, getByDataRole);

		await expect(mentionNode).toHaveClass(new RegExp(editorThemeClasses.text?.strikethrough || ""));
		await expect(mentionNode).toHaveClass(new RegExp(editorThemeClasses.text?.bold || ""));
	});

	test("Should not reset text styles after transforming to a Mention node when setting resetTextFormatAfterTransform false", async ({
		page,
		mount,
		getByDataRole
	}) => {
		await mount(<DefaultEditorFormatTextExample mentionPlugin={{ resetTextFormatAfterTransform: false }} />);
		const mentionNode = await formatTextAndAddMentionNode(page, getByDataRole);

		await expect(mentionNode).toHaveClass(new RegExp(editorThemeClasses.text?.strikethrough || ""));
		await expect(mentionNode).toHaveClass(new RegExp(editorThemeClasses.text?.bold || ""));
	});

	test("Should reset text styles after transforming to a Mention node when setting resetTextFormatAfterTransform true", async ({
		page,
		mount,
		getByDataRole
	}) => {
		await mount(<DefaultEditorFormatTextExample mentionPlugin={{ resetTextFormatAfterTransform: true }} />);
		const mentionNode = await formatTextAndAddMentionNode(page, getByDataRole);

		await expect(mentionNode).not.toHaveClass(new RegExp(editorThemeClasses.text?.strikethrough || ""));
		await expect(mentionNode).not.toHaveClass(new RegExp(editorThemeClasses.text?.bold || ""));
	});

	test("Should not change the selection when the editor is blurred and refocused", async ({
		mount,
		getByDataRole,
		page
	}) => {
		const selectedText = "widget";
		await mount(<SimpleEditorExample />);

		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		await editor.fill(`${selectedText} team`);

		// Select the text "widget" in editor
		await selectTextInEditor(editor, { start: 0, end: selectedText.length });

		let selected = await page.evaluate(() => window.getSelection()!.toString());
		expect(selected).toBe(selectedText);

		// Blur the editor to focus on body
		const isBodyFocused = await editor.evaluate((editorElement) => {
			editorElement?.blur();

			return document.activeElement === document.body;
		});

		expect(isBodyFocused).toBe(true);

		// Focus back on the editor
		await editor.focus();

		// Check selected text not change after refocusing editor
		selected = await page.evaluate(() => window.getSelection()!.toString());
		expect(selected).toBe(selectedText);
	});

	test("Should align Link Node as expected", async ({ mount, getByDataRole }) => {
		const url = "https://www.widgets.com/";
		await mount(<ToolbarEditorExampleWithLinkPlugin />);

		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		await editor.fill(url);

		await selectTextInEditor(editor);

		const alignGroupButton = getByDataRole(DataRoles.RichTextEditor.ToolbarItem).nth(4);
		await alignGroupButton.click();

		const alignButtonText = getByDataRole(DataRoles.RichTextEditor.ToolbarListItem).nth(2);
		await alignButtonText.click();

		expect(await alignGroupButton.innerText()).toContain("format_align_right");

		const paragraphTextAlign = await editor.evaluate((editorElement) => {
			const paragraph = editorElement.querySelector("p") as HTMLElement;

			return paragraph ? getComputedStyle(paragraph).textAlign : null;
		});

		expect(paragraphTextAlign).toBe("right");
	});

	test("Should apply styling to Link Node as expected", async ({ mount, getByDataRole }) => {
		const url = "https://www.widgets.com/";
		const formattedText = "widgets";
		await mount(<ToolbarEditorExampleWithLinkPlugin />);

		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		await editor.fill(url);

		await selectTextInEditor(editor, {
			start: url.indexOf(formattedText),
			end: url.indexOf(formattedText[0]) + formattedText.length
		});

		const alignGroupButton = getByDataRole(DataRoles.RichTextEditor.ToolbarItem).nth(3);
		await alignGroupButton.click();

		const alignButtonText = getByDataRole(DataRoles.RichTextEditor.ToolbarListItem).nth(0);
		await alignButtonText.click();

		const hasFormated = await editor.evaluate((editorElement, strikethroughClass) => {
			const paragraph = editorElement.getElementsByClassName(strikethroughClass);

			return paragraph.length > 0;
		}, editorThemeClasses.text?.strikethrough);

		expect(hasFormated).toBe(true);
	});

	test("Should correctly update the auto link when modified", async ({ mount, getByDataRole, page }) => {
		const url = "www.widgets.com";
		const breakUrl = "widgets.com";
		const breakTextPosition = "www.".length;
		await mount(<ToolbarEditorExampleWithLinkPlugin />);

		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		await editor.fill(url);

		await selectTextInEditor(editor, {
			start: breakTextPosition,
			end: breakTextPosition
		});

		await editor.press(" ");

		let autoLink = editor.locator("a");

		expect(await autoLink.innerText()).toEqual(breakUrl);

		await page.keyboard.press("Backspace");

		autoLink = editor.locator("a");

		expect(await autoLink.innerText()).toEqual(url);
	});
});

test.describe("Readonly Rich Text Editor", () => {
	test("Should not be editable when readonly prop is true", async ({ mount, getByDataRole }) => {
		const component = await mount(<ReadonlyEditorExample readonly={true} />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		const contentEditable = component.locator("[contenteditable]");

		await expect(contentEditable).toHaveAttribute("contenteditable", "false");

		await editor.click();

		await expect(contentEditable).toBeFocused();

		const initialContent = await contentEditable.textContent();
		await editor.pressSequentially("This text should not appear");

		// Verify that no text was added
		const finalContent = await contentEditable.textContent();
		expect(finalContent).toBe(initialContent);
	});

	test("Should not be editable when initialConfig.editable is false", async ({ mount, getByDataRole }) => {
		const component = await mount(<ReadonlyEditorExample initialConfig={{ editable: false, namespace: "Test" }} />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		const contentEditable = component.locator("[contenteditable]");

		await expect(contentEditable).toHaveAttribute("contenteditable", "false");

		await editor.click();

		await expect(contentEditable).toBeFocused();

		const initialContent = await contentEditable.textContent();
		await editor.pressSequentially("This text should not appear");

		const finalContent = await contentEditable.textContent();
		expect(finalContent).toBe(initialContent);
	});

	test("Should not be editable when both readonly=true and initialConfig.editable=false", async ({
		mount,
		getByDataRole
	}) => {
		const component = await mount(
			<ReadonlyEditorExample readonly={true} initialConfig={{ editable: false, namespace: "Test" }} />
		);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		const contentEditable = component.locator("[contenteditable]");

		await expect(contentEditable).toHaveAttribute("contenteditable", "false");

		await editor.click();

		await expect(contentEditable).toBeFocused();

		const initialContent = await contentEditable.textContent();
		await editor.pressSequentially("This text should not appear");

		const finalContent = await contentEditable.textContent();
		expect(finalContent).toBe(initialContent);
	});

	test("Should remain readonly with spell check plugin", async ({ mount, getByDataRole }) => {
		const component = await mount(<ReadonlyEditorWithSpellCheckExample readonly={true} />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		const contentEditable = component.locator("[contenteditable]");

		await expect(contentEditable).toHaveAttribute("contenteditable", "false");

		await editor.click();

		await expect(contentEditable).toBeFocused();

		const initialContent = await contentEditable.textContent();
		await editor.pressSequentially("test readonly content");

		const finalContent = await contentEditable.textContent();
		expect(finalContent).toBe(initialContent);
	});

	test("Should not be editable when readOnly true and editable is true", async ({ mount, getByDataRole }) => {
		const component = await mount(<ReadonlyEditorWithSpellCheckExample initialConfig={{ editable: true }} />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		const contentEditable = component.locator("[contenteditable]");

		await expect(contentEditable).toHaveAttribute("contenteditable", "false");

		await editor.click();

		await expect(contentEditable).toBeFocused();

		const initialContent = await contentEditable.textContent();
		await editor.pressSequentially("not be editable content");

		const finalContent = await contentEditable.textContent();
		expect(finalContent).toBe(initialContent);
	});

	test("Should prevent all editing operations in readonly mode", async ({ mount, getByDataRole }) => {
		const component = await mount(<ReadonlyEditorExample readonly={true} />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		const contentEditable = component.locator("[contenteditable]");

		const initialContent = await contentEditable.textContent();

		await editor.click();
		await editor.pressSequentially("New text");
		await editor.press("Enter");
		await editor.press("Backspace");
		await editor.press("Delete");
		await editor.press("Space");
		await editor.press("ControlOrMeta+V");

		const finalContent = await contentEditable.textContent();
		expect(finalContent).toBe(initialContent);

		await expect(contentEditable).toBeFocused();
	});

	test("Should not show cursor in readonly mode", async ({ mount, getByDataRole }) => {
		const component = await mount(<ReadonlyEditorExample readonly={true} />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		const contentEditable = component.locator("[contenteditable]");

		await editor.click();

		await expect(contentEditable).toHaveAttribute("contenteditable", "false");
	});

	test("Should be editable when readonly is false and initialConfig.editable is true", async ({
		mount,
		getByDataRole
	}) => {
		const component = await mount(
			<ReadonlyEditorExample readonly={false} initialConfig={{ editable: true, namespace: "Test" }} />
		);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		const contentEditable = component.locator("[contenteditable]");

		await expect(contentEditable).toHaveAttribute("contenteditable", "true");

		await editor.click();
		await expect(contentEditable).toBeFocused();

		await editor.pressSequentially("This text should appear");

		const content = await contentEditable.textContent();
		expect(content).toContain("This text should appear");
	});

	test("Should handle readonly state changes correctly", async ({ mount, getByDataRole }) => {
		const readonlyState = false;
		const component = await mount(<ReadonlyEditorExample readonly={readonlyState} />);
		const editor = getByDataRole(DataRoles.RichTextEditor.Input);
		const contentEditable = component.locator("[contenteditable]");

		await expect(contentEditable).toHaveAttribute("contenteditable", "true");

		await editor.click();
		await editor.pressSequentially("Initial content");

		const contentAfterTyping = await contentEditable.textContent();
		expect(contentAfterTyping).toContain("Initial content");
	});
});

async function selectTextInEditor(
	editor: Locator,
	position?: {
		start?: number;
		end?: number;
	}
): Promise<void> {
	await editor.click();
	await editor.evaluate((element, position) => {
		const textNode = element.querySelector("span")!.firstChild!;

		const { start = 0, end = 0 } = position ?? { start: 0, end: 0 };

		const range = document.createRange();
		const selection = window.getSelection()!;

		range.setStart(textNode, start);
		range.setEnd(textNode, end);

		selection.removeAllRanges();
		selection.addRange(range);
	}, position);
}
