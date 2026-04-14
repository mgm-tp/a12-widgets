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
import { findByDataRole, getByDataRole, render } from "test-utils";
import { userEvent } from "vitest/browser";

import { DefaultRichTextEditor } from "../../main/wrapper/default-rich-text-editor.view.js";
import type { TextMatcher, TextMatcherResult } from "../../main/plugins/plugin.internal.api.js";
import type { SpellCheckPluginConfig } from "../../main/wrapper/default-rich-text-editor.api.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { prepopulatedRichText } from "../../main/utils/common.js";
import { editorThemeClasses } from "../../main/themes/themes.js";

import { misspelledWordsSampleText } from "../data.js";

describe("com.mgmtp.a12.widgets.rich-text-editor.spell-check-plugin", () => {
	describe("Partial word tests", () => {
		function findSubstring(text: string, matchString: string, dictionary?: string[]): TextMatcherResult | null {
			const position = text.indexOf(matchString);

			if ((dictionary && dictionary.indexOf(matchString) >= 0) || position === -1) {
				return null;
			}

			return { index: position, length: matchString.length, text: matchString };
		}

		const handleSpellCheck = (dictionary: string[]): TextMatcher[] => {
			const misspellList = ["developr", "developrr", "javescript"];

			return misspellList.map((misspellWord) => {
				return (text: string) => findSubstring(text, misspellWord, dictionary);
			});
		};

		const spellCheckPluginConfig: SpellCheckPluginConfig = {
			spellCheck: handleSpellCheck([]),
			render: () => undefined
		};

		test("Input snapshot for popular cases", async () => {
			const { container } = render(
				<DefaultRichTextEditor
					initialConfig={{ editorState: prepopulatedRichText(misspelledWordsSampleText), namespace: "Spell Check" }}
					spellCheckPluginConfig={spellCheckPluginConfig}
				/>
			);

			const editorInput = await findByDataRole(container, DataRoles.RichTextEditor.Input);
			expect(editorInput.children).toMatchSnapshot();
		});

		test("Should allow part of a word to be highlighted as a misspelling", async () => {
			const { container } = render(
				<DefaultRichTextEditor
					initialConfig={{
						editorState: prepopulatedRichText("developrs sdevelopr sdeveloprx"),
						namespace: "Spell Check"
					}}
					spellCheckPluginConfig={spellCheckPluginConfig}
				/>
			);

			const editorInput = await findByDataRole(container, DataRoles.RichTextEditor.Input);

			const misspelledElements = editorInput.getElementsByClassName(editorThemeClasses.misspelledWord);

			const allText = editorInput.textContent || "";
			expect(allText).toContain("developrs");
			expect(allText).toContain("sdevelopr");
			expect(allText).toContain("sdeveloprx");

			const misspelledTexts = Array.from(misspelledElements).map((el) => el.textContent);

			expect(misspelledElements.length).toBe(3);
			misspelledTexts.forEach((text) => {
				expect(text).toBe("developr");
			});
		});

		test("Type adjacent misspelled words and number", async () => {
			const { container } = render(
				<DefaultRichTextEditor
					initialConfig={{ namespace: "Spell Check" }}
					spellCheckPluginConfig={spellCheckPluginConfig}
				/>
			);

			const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
			editorInput.focus();

			await userEvent.type(editorInput, "developr");
			await userEvent.type(editorInput, "javescript");
			await userEvent.type(editorInput, "123");

			const misspelledElements = editorInput.getElementsByClassName(editorThemeClasses.misspelledWord);

			expect(misspelledElements.length).equal(2);
			expect(misspelledElements[0].textContent).toBe("developr");
			expect(misspelledElements[1].textContent).toBe("javescript");
		});
	});

	describe("Whole word tests", () => {
		function findSubstring(text: string, matchString: string, dictionary?: string[]): TextMatcherResult | null {
			if (dictionary?.includes(matchString)) {
				return null;
			}

			const regex = new RegExp(`\\b${matchString}\\b`);
			const result = text.match(regex);

			if (!result || result.index === undefined) {
				return null;
			}

			return {
				index: result.index,
				length: matchString.length,
				text: matchString
			};
		}

		const handleSpellCheck = (dictionary: string[]): TextMatcher[] => {
			const misspellList = ["developr", "developrr", "javescript"];

			return misspellList.map((misspellWord) => {
				return (text: string) => findSubstring(text, misspellWord, dictionary);
			});
		};

		const spellCheckPluginConfig: SpellCheckPluginConfig = {
			spellCheck: handleSpellCheck([]),
			render: () => undefined
		};

		test("Input snapshot for popular cases", async () => {
			const { container } = render(
				<DefaultRichTextEditor
					initialConfig={{
						editorState: prepopulatedRichText(misspelledWordsSampleText),
						namespace: "Spell Check For The Whole Word"
					}}
					spellCheckPluginConfig={spellCheckPluginConfig}
				/>
			);

			const editorInput = await findByDataRole(container, DataRoles.RichTextEditor.Input);
			expect(editorInput.children).toMatchSnapshot();
		});

		test("Should not allow part of a word to be highlighted as a misspelling", async () => {
			const spellCheckPluginConfig: SpellCheckPluginConfig = {
				spellCheck: handleSpellCheck([]),
				render: () => undefined
			};
			const { container } = render(
				<DefaultRichTextEditor
					initialConfig={{
						editorState: prepopulatedRichText("developrs sdevelopr sdeveloprx"),
						namespace: "Spell Check"
					}}
					spellCheckPluginConfig={spellCheckPluginConfig}
				/>
			);

			const editorInput = await findByDataRole(container, DataRoles.RichTextEditor.Input);

			const misspelledElements = editorInput.getElementsByClassName(editorThemeClasses.misspelledWord);

			expect(misspelledElements.length).toBe(0);
		});
	});
});
