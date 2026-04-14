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
import { render } from "test-utils";
import { $createLineBreakNode, $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { userEvent } from "vitest/browser";

import { DefaultRichTextEditor } from "../../main/wrapper/default-rich-text-editor.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { editorThemeClasses } from "../../main/themes/themes.js";
import type { ButtonType } from "../../main/plugins/index.js";
import { BoldButton, createInlineButton } from "../../main/plugins/index.js";
import { RichTextEditor } from "../../main/rich-text-editor.view.js";

import { BUTTONS } from "./toolbar-button.js";

describe("com.mgmtp.a12.widgets.rich-text-editor.toolbar-plugin", () => {
	const renderEditor = (config: { editorState: () => void; namespace: string }) => {
		return render(<DefaultRichTextEditor initialConfig={config} staticToolbarButtons={BUTTONS} />);
	};

	const clickButtonGroupItem = async (
		styledGroupButton: Element,
		findAllByDataRole: (role: string) => Promise<HTMLElement[]>,
		findByDataRole: (role: string) => Promise<HTMLElement>
	): Promise<HTMLElement> => {
		await userEvent.click(styledGroupButton);
		const portal = findByDataRole(DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();

		const styledButton = (await findAllByDataRole(DataRoles.RichTextEditor.ToolbarListItem))[0];
		await userEvent.click(styledButton);

		return styledButton;
	};

	const verifyButtonGroupItemState = async (
		styledGroupButton: Element,
		findAllByDataRole: (role: string) => Promise<HTMLElement[]>,
		findByDataRole: (role: string) => Promise<HTMLElement>
	) => {
		expect((styledGroupButton.firstChild as HTMLElement).getAttribute("aria-pressed")).toBe("true");

		await userEvent.click(styledGroupButton);
		const portal = findByDataRole(DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();

		const styledButton = (await findAllByDataRole(DataRoles.RichTextEditor.ToolbarListItem))[0];
		expect((styledButton.firstChild as HTMLElement).getAttribute("aria-pressed")).toBe("true");
	};

	test("Should not have toolbar in DefaultRichTextEditor when enable readonly", () => {
		const { queryByDataRole } = render(
			<DefaultRichTextEditor
				readonly
				initialConfig={{ namespace: "readonly-toolbar" }}
				staticToolbarButtons={BUTTONS}
			/>
		);

		const toolbar = queryByDataRole(DataRoles.RichTextEditor.Toolbar);
		expect(toolbar).toBeFalsy();
	});

	test("Should not have toolbar in DefaultRichTextEditor when enable disabled", () => {
		const { queryByDataRole } = render(
			<DefaultRichTextEditor
				disabled
				initialConfig={{ namespace: "disabled-toolbar" }}
				staticToolbarButtons={BUTTONS}
			/>
		);

		const toolbar = queryByDataRole(DataRoles.RichTextEditor.Toolbar);
		expect(toolbar).toBeFalsy();
	});

	test("Should have toolbar in RichTextEditor when enable readonly", () => {
		const { queryByDataRole } = render(
			<RichTextEditor readonly initialConfig={{ namespace: "readonly-toolbar" }} staticToolbarButtons={BUTTONS} />
		);

		const toolbar = queryByDataRole(DataRoles.RichTextEditor.Toolbar);
		expect(toolbar).toBeTruthy();
	});

	test("Should have toolbar in RichTextEditor when enable disabled", () => {
		const { queryByDataRole } = render(
			<RichTextEditor disabled initialConfig={{ namespace: "disabled-toolbar" }} staticToolbarButtons={BUTTONS} />
		);

		const toolbar = queryByDataRole(DataRoles.RichTextEditor.Toolbar);
		expect(toolbar).toBeTruthy();
	});

	describe("Multiple line text content", () => {
		const createMultiLineContent = () => {
			const firstLine = "This is the 1st line";
			const secondLine = "This is the 2nd line";

			return {
				firstLine,
				secondLine,
				prepopulatedRichText: () => (): void => {
					const root = $getRoot();

					if (root.getFirstChild() === null) {
						const paragraph = $createParagraphNode();
						paragraph.append($createTextNode(firstLine));
						paragraph.append($createLineBreakNode());
						paragraph.append($createTextNode(secondLine));
						root.append(paragraph);
					}
				}
			};
		};

		const handleStyleButtonTestWithMultipleLine = async (
			buttonIndex: number,
			styledClassName: string
		): Promise<void> => {
			const { secondLine, prepopulatedRichText } = createMultiLineContent();

			const { findAllByDataRole, findByDataRole, getAllByDataRole } = renderEditor({
				editorState: prepopulatedRichText(),
				namespace: "Multiple line"
			});

			const editorInput = await findByDataRole(DataRoles.RichTextEditor.Input);
			const paragraphChildNode = editorInput.children[0].childNodes;
			const [_, br, secondLineNode] = Array.from(paragraphChildNode).filter(
				(n): n is HTMLElement => n.nodeType === Node.ELEMENT_NODE
			);

			const setSelectionFromLineBreakToTheEndOfLine2 = (): void => {
				const range = document.createRange();
				range.setStartBefore(br);
				range.setEnd(secondLineNode.firstChild!, secondLine.length);

				const selection = window.getSelection()!;
				selection.removeAllRanges();
				selection.addRange(range);
			};

			setSelectionFromLineBreakToTheEndOfLine2();

			const toolbarItem = getAllByDataRole(DataRoles.RichTextEditor.ToolbarItem);
			const styledGroupButton = toolbarItem[buttonIndex];

			await clickButtonGroupItem(styledGroupButton, findAllByDataRole, findByDataRole);
			expect(secondLineNode.className).toBe(styledClassName);

			setSelectionFromLineBreakToTheEndOfLine2();
			await verifyButtonGroupItemState(styledGroupButton, findAllByDataRole, findByDataRole);
		};

		test("Should the styled button be active when selecting multiple lines.", async () =>
			await handleStyleButtonTestWithMultipleLine(
				3,
				editorThemeClasses.text?.strikethrough ?? "editor-text-strikethrough"
			));

		test("Should the mark button be active when selecting multiple lines.", async () =>
			await handleStyleButtonTestWithMultipleLine(13, "editor-text-mark-1"));
	});

	describe("Multiple paragraph text content", () => {
		const createMultiParagraphContent = () => {
			const firstParagraphText = "This is the 1st paragraph";
			const secondParagraphText = "This is the 2nd paragraph";
			const thirdParagraphText = "This is the 3nd paragraph";

			return {
				firstParagraphText,
				secondParagraphText,
				thirdParagraphText,
				prepopulatedRichText: () => (): void => {
					const root = $getRoot();

					if (root.getFirstChild() === null) {
						const paragraph1 = $createParagraphNode();
						paragraph1.append($createTextNode(firstParagraphText));
						const paragraph2 = $createParagraphNode();
						paragraph2.append($createTextNode(secondParagraphText));
						const paragraph3 = $createParagraphNode();
						paragraph3.append($createTextNode(thirdParagraphText));
						root.append(paragraph1);
						root.append(paragraph2);
						root.append(paragraph3);
					}
				}
			};
		};

		const handleStyleButtonTestWithMultipleParagraph = async (
			buttonIndex: number,
			styledClassName: string
		): Promise<void> => {
			const { prepopulatedRichText } = createMultiParagraphContent();

			const { findAllByDataRole, findByDataRole, getAllByDataRole } = renderEditor({
				editorState: prepopulatedRichText(),
				namespace: "Multiple paragraph"
			});

			const editorInput = await findByDataRole(DataRoles.RichTextEditor.Input);
			const firstParagraphChildNode = editorInput.children[0].childNodes;
			const [firstParagraphTextNode] = Array.from(firstParagraphChildNode).filter(
				(n): n is HTMLElement => n.nodeType === Node.ELEMENT_NODE
			);

			const secondParagraphChildNode = editorInput.children[1].childNodes;
			const [secondParagraphTextNode] = Array.from(secondParagraphChildNode).filter(
				(n): n is HTMLElement => n.nodeType === Node.ELEMENT_NODE
			);

			const thirdParagraphChildNode = editorInput.children[2].childNodes;
			const [thirdParagraphTextNode] = Array.from(thirdParagraphChildNode).filter(
				(n): n is HTMLElement => n.nodeType === Node.ELEMENT_NODE
			);

			const setSelectionFromEndOfParagraph1ToParagraph3 = (): void => {
				const range = document.createRange();
				range.setStartAfter(firstParagraphTextNode.firstChild!);
				range.setEnd(thirdParagraphTextNode.firstChild!, 0);

				const selection = window.getSelection()!;
				selection.removeAllRanges();
				selection.addRange(range);
			};

			setSelectionFromEndOfParagraph1ToParagraph3();

			const toolbarItem = getAllByDataRole(DataRoles.RichTextEditor.ToolbarItem);
			const styledGroupButton = toolbarItem[buttonIndex];

			await clickButtonGroupItem(styledGroupButton, findAllByDataRole, findByDataRole);
			expect(secondParagraphTextNode.className).toBe(styledClassName);

			setSelectionFromEndOfParagraph1ToParagraph3();
			await verifyButtonGroupItemState(styledGroupButton, findAllByDataRole, findByDataRole);
		};

		test("Should the mark button be active when selecting multiple paragraph.", async () =>
			await handleStyleButtonTestWithMultipleParagraph(13, "editor-text-mark-1"));

		test("Should the styled button be active when selecting multiple paragraph.", async () =>
			await handleStyleButtonTestWithMultipleParagraph(3, editorThemeClasses.text!.strikethrough!));
	});

	describe("Copy and Paste styled text", () => {
		const testCopyPasteWithStyles = async (config: { buttons: ButtonType[]; styleClassNames: string[] }) => {
			const { buttons, styleClassNames } = config;

			const styledText = "This is styled text";
			const normalText = "This is normal text";

			const { findByDataRole, getAllByDataRole } = render(<DefaultRichTextEditor staticToolbarButtons={buttons} />);

			const editorInput = await findByDataRole(DataRoles.RichTextEditor.Input);
			await userEvent.click(editorInput!);

			const toolbarItems = getAllByDataRole(DataRoles.RichTextEditor.ToolbarItem);

			// Click all style buttons to enable formatting
			for (let index = 0; index < toolbarItems.length; index++) {
				const button = toolbarItems[index];
				await userEvent.click(button);
				expect((button.firstChild as HTMLElement).getAttribute("aria-pressed")).toBe("true");
			}

			// Type styled text
			await userEvent.keyboard(styledText);

			let paragraphs = editorInput.querySelectorAll("p");

			// Verify styles are applied
			const selector = styleClassNames.map((className) => `.${className}`).join("");
			const styledElement = paragraphs[0].querySelector(selector);
			expect(styledElement).not.toBeNull();
			expect(styledElement!.textContent).toBe(styledText);

			await userEvent.keyboard("{Enter}");

			// Turn off all styles
			// Click all style buttons to enable formatting
			for (let index = 0; index < toolbarItems.length; index++) {
				const button = toolbarItems[index];
				await userEvent.click(button);
				expect((button.firstChild as HTMLElement).getAttribute("aria-pressed")).toBe("false");
			}

			// Type normal text
			await userEvent.keyboard(normalText);

			// Verify normal text doesn't have styles
			paragraphs = editorInput.querySelectorAll("p");
			expect(paragraphs.length).toBe(2);
			expect(paragraphs[1].textContent).toBe(normalText);

			for (const className of styleClassNames) {
				expect(paragraphs[1].querySelector(`.${className}`)).toBeNull();
			}

			// Select the styled text from first paragraph
			const styledTextNode = paragraphs[0].querySelector(selector);
			expect(styledTextNode).not.toBeNull();

			// Create selection range for the styled text
			const range = document.createRange();
			range.selectNodeContents(styledTextNode!);
			const selection = window.getSelection()!;
			selection.removeAllRanges();
			selection.addRange(range);

			// Copy the text
			await userEvent.keyboard("{ControlOrMeta>}c{/ControlOrMeta}");

			// Go to the end of the normal text line
			await userEvent.click(paragraphs[1]);
			await userEvent.keyboard("{End}");
			await userEvent.keyboard("{Enter}");

			// Paste the text
			await userEvent.keyboard("{ControlOrMeta>}v{/ControlOrMeta}");

			// Verify the pasted text has all styles
			paragraphs = editorInput.querySelectorAll("p");
			expect(paragraphs.length).toBe(3);

			const pastedElement = paragraphs[2].querySelector(selector);
			expect(pastedElement).not.toBeNull();
			expect(pastedElement!.textContent).toBe(styledText);

			// Verify individual styles are present
			for (const className of styleClassNames) {
				expect(pastedElement!.classList.contains(className)).toBe(true);
			}
		};

		test("Should maintain custom style when copying and pasting text", async () => {
			await testCopyPasteWithStyles({
				buttons: [
					createInlineButton({
						nodeClassName: "editor-text-strikethrough",
						label: "Strikethrough"
					})
				],
				styleClassNames: ["editor-text-strikethrough"]
			});
		});

		test("Should maintain inline style when copying and pasting text", async () => {
			await testCopyPasteWithStyles({
				buttons: [BoldButton],
				styleClassNames: [editorThemeClasses.text!.bold!]
			});
		});

		test("Should maintain inline styles and custom styles when copying and pasting text", async () => {
			const StrikethroughButton = createInlineButton({
				nodeClassName: "editor-text-strikethrough",
				label: "Strikethrough"
			});

			await testCopyPasteWithStyles({
				buttons: [BoldButton, StrikethroughButton],
				styleClassNames: [editorThemeClasses.text!.bold!, "editor-text-strikethrough"]
			});
		});
	});
});
