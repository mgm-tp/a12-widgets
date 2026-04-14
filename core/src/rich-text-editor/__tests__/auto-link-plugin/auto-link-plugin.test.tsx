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
import { findByDataRole, render } from "test-utils";
import { userEvent } from "@vitest/browser/context";

import { DefaultRichTextEditor } from "../../main/wrapper/default-rich-text-editor.view.js";
import { AutoLinkPlugin, BoldButton, type ButtonType, createInlineButton } from "../../main/plugins/index.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { prepopulatedRichText } from "../../main/utils/common.js";
import { editorThemeClasses } from "../../main/themes/themes.js";

import {
	EMAILS,
	FUZZY_LINKS,
	INTERNATIONAL_LINKS,
	LINKS_SURROUNDED_BY_SPECIAL_CHARACTERS,
	LINKS_WITH_TRAILING_DASHES,
	NOT_LINKS,
	PROTOCOL_LINKS,
	REGULAR_LINKS
} from "../data.js";

describe("com.mgmtp.a12.widgets.rich-text-editor.auto-link-plugin", () => {
	const linkTestCases = [
		["Regular links", REGULAR_LINKS],
		["Protocol links", PROTOCOL_LINKS],
		["Fuzzy links", FUZZY_LINKS],
		["Links surrounded by special characters", LINKS_SURROUNDED_BY_SPECIAL_CHARACTERS],
		["Links with trailing dashes", LINKS_WITH_TRAILING_DASHES],
		["Emails", EMAILS],
		["International links", INTERNATIONAL_LINKS],
		["Not links", NOT_LINKS]
	];
	test.each(linkTestCases)("Should handle %s", async (_, inputText) => {
		const { container } = render(
			<DefaultRichTextEditor initialConfig={{ editorState: prepopulatedRichText(inputText), namespace: "Auto Link" }}>
				<AutoLinkPlugin
					customTerms={[
						{
							regex: /\bA12W-\d+\b/g,
							getUrl: (text: string): string => `https://example.com/${text}`
						}
					]}
					target="_blank"
				/>
			</DefaultRichTextEditor>
		);

		const editorInput = await findByDataRole(container, DataRoles.RichTextEditor.Input);
		expect(editorInput.children).toMatchSnapshot();
	});

	describe("Styled text should remain part of the link after link creation", () => {
		const testStyledLinkCreation = async (config: { buttons: ButtonType[]; styleClassNames: string[] }) => {
			const handleCheckLinkElements = ({
				linkElement,
				linkText,
				linkHref,
				className
			}: {
				linkElement: HTMLElement | null;
				linkText: string;
				linkHref: string;
				className: string;
			}): void => {
				expect(linkElement).not.toBeNull();
				expect(linkElement!.textContent).toBe(linkText);
				expect(linkElement!.getAttribute("href")).toBe(linkHref);
				expect((linkElement!.firstChild as HTMLElement)?.classList.contains(className)).toBe(true);
			};

			const { buttons, styleClassNames } = config;
			const url = "example.com";
			const urlExtension = ".vn";

			const { findByDataRole, getAllByDataRole } = render(
				<DefaultRichTextEditor
					staticToolbarButtons={buttons}
					linkPluginConfig={{
						target: "_blank",
						popupRenderer: () => undefined
					}}
				/>
			);

			const editorInput = await findByDataRole(DataRoles.RichTextEditor.Input);
			await userEvent.click(editorInput!);

			const toolbarItems = getAllByDataRole(DataRoles.RichTextEditor.ToolbarItem);

			// Click all style buttons to enable formatting
			for (let index = 0; index < toolbarItems.length; index++) {
				const button = toolbarItems[index];
				await userEvent.click(button);
				expect((button.firstChild as HTMLElement).getAttribute("aria-pressed")).toBe("true");
			}

			// Type initial URL
			await userEvent.keyboard(url);

			let linkElement = editorInput.querySelector(`.${editorThemeClasses.link}`) as HTMLElement;
			handleCheckLinkElements({
				linkElement,
				linkText: url,
				linkHref: `http://${url}`,
				className: styleClassNames[0]
			});

			// Verify all styles are applied
			const styledElement = linkElement!.firstChild as HTMLElement;

			for (const className of styleClassNames) {
				expect(styledElement?.classList.contains(className)).toBe(true);
			}

			// Type URL extension
			await userEvent.keyboard(urlExtension);

			linkElement = editorInput.querySelector(`.${editorThemeClasses.link}`) as HTMLElement;
			handleCheckLinkElements({
				linkElement,
				linkText: url + urlExtension,
				linkHref: `http://${url}${urlExtension}`,
				className: styleClassNames[0]
			});

			// Verify all styles are still applied after extension
			const updatedStyledElement = linkElement!.firstChild as HTMLElement;

			for (const className of styleClassNames) {
				expect(updatedStyledElement?.classList.contains(className)).toBe(true);
			}
		};

		test("Should apply custom style and then type URL to create a link", async () => {
			const StrikethroughButton = createInlineButton({
				nodeClassName: "editor-text-strikethrough",
				label: "Strikethrough"
			});

			await testStyledLinkCreation({
				buttons: [StrikethroughButton],
				styleClassNames: ["editor-text-strikethrough"]
			});
		});

		test("Should apply inline style and then type URL to create a link", async () => {
			await testStyledLinkCreation({
				buttons: [BoldButton],
				styleClassNames: [editorThemeClasses.text!.bold!]
			});
		});

		test("Should apply custom style and inline style and then type URL to create a link", async () => {
			const StrikethroughButton = createInlineButton({
				nodeClassName: "editor-text-strikethrough",
				label: "Strikethrough"
			});

			await testStyledLinkCreation({
				buttons: [BoldButton, StrikethroughButton],
				styleClassNames: [editorThemeClasses.text!.bold!, "editor-text-strikethrough"]
			});
		});
	});
});
