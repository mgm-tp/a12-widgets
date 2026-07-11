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
import { findByDataRole, getByDataRole, render, waitFor } from "test-utils";
import { userEvent } from "vitest/browser";

import { DefaultRichTextEditor } from "../../main/wrapper/default-rich-text-editor.view.js";
import type { TextMatcher, TextMatcherResult } from "../../main/plugins/plugin.internal.api.js";
import type { SpellCheckPluginConfig } from "../../main/wrapper/default-rich-text-editor.api.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { prepopulatedRichText } from "../../main/utils/common.js";
import { editorThemeClasses } from "../../main/themes/themes.js";
import { AutoLinkPlugin } from "../../index.js";

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

	describe("Spell check with auto-link interaction", () => {
		function findWholeWord(text: string, matchString: string): TextMatcherResult | null {
			const regex = new RegExp(`\\b${matchString}\\b`);
			const result = text.match(regex);

			if (!result || result.index === undefined) {
				return null;
			}

			return { index: result.index, length: matchString.length, text: matchString };
		}

		const spellCheckPluginConfig: SpellCheckPluginConfig = {
			spellCheck: ["developr"].map((word) => (text: string) => findWholeWord(text, word)),
			render: () => undefined
		};

		const autoLinkTerms = [
			{
				regex: /\bA12W-\d+\b/g,
				getUrl: (text: string): string => `https://example.com/${text}`
			}
		];

		function renderSpellCheckWithAutoLink(namespace: string): ReturnType<typeof render> {
			return render(
				<DefaultRichTextEditor initialConfig={{ namespace }} spellCheckPluginConfig={spellCheckPluginConfig}>
					<AutoLinkPlugin customTerms={autoLinkTerms} target="_blank" />
				</DefaultRichTextEditor>
			);
		}

		test("Should keep misspelled mark on 'developr' and remove link when typing 'd' before 'A12W-123'", async () => {
			const { container } = renderSpellCheckWithAutoLink("Spell Check AutoLink");

			const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
			await userEvent.click(editorInput);

			// Type: "A12W-123: abc developr def"
			await userEvent.type(editorInput, "A12W-123: abc developr def");

			// Wait for auto-link and spell-check to be applied
			await waitFor(() => {
				const linkElement = editorInput.querySelector(`.${editorThemeClasses.link}`);
				expect(linkElement).not.toBeNull();
				expect(linkElement!.textContent).toBe("A12W-123");

				const misspelled = editorInput.getElementsByClassName(editorThemeClasses.misspelledWord);
				expect(misspelled.length).toBe(1);
				expect(misspelled[0].textContent).toBe("developr");
			});

			// Move cursor to start and type "d" — turns "A12W-123" into "dA12W-123"
			await userEvent.keyboard("{Home}");
			await userEvent.type(editorInput, "d");

			await waitFor(() => {
				// "dA12W-123" no longer matches the link regex, so no link should exist
				const linkElement = editorInput.querySelector(`.${editorThemeClasses.link}`);
				expect(linkElement).toBeNull();

				// "developr" should still be marked as misspelled
				const misspelled = editorInput.getElementsByClassName(editorThemeClasses.misspelledWord);
				expect(misspelled.length).toBe(1);
				expect(misspelled[0].textContent).toBe("developr");
			});

			expect(editorInput.textContent).toBe("dA12W-123: abc developr def");
		});

		test("Should not throw when pasting text that contains a link pattern and a misspelled word", async () => {
			const { container } = renderSpellCheckWithAutoLink("Spell Check AutoLink Paste");

			const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
			await userEvent.click(editorInput);

			// Simulate pasting text that contains a link pattern and a misspelled word
			await userEvent.type(editorInput, "A12W-123: this developr bug");

			// Verify A12W-123 is rendered as a link
			await waitFor(() => {
				const linkElement = editorInput.querySelector(`.${editorThemeClasses.link}`);
				expect(linkElement).not.toBeNull();
				expect(linkElement!.textContent).toBe("A12W-123");
			});

			// Verify "developr" is marked as a misspelled word
			await waitFor(() => {
				const misspelled = editorInput.getElementsByClassName(editorThemeClasses.misspelledWord);
				expect(misspelled.length).toBe(1);
				expect(misspelled[0].textContent).toBe("developr");
			});
		});

		test("Should keep 'A12W-123' as link and 'developr' as misspelled after re-typing both", async () => {
			const { container } = renderSpellCheckWithAutoLink("Spell Check AutoLink Retype");

			const editorInput = getByDataRole(container, DataRoles.RichTextEditor.Input);
			await userEvent.click(editorInput);

			// Type: "A12W-123: abc developr def"
			await userEvent.type(editorInput, "A12W-123: abc developr def");

			await waitFor(() => {
				const linkElement = editorInput.querySelector(`.${editorThemeClasses.link}`);
				expect(linkElement).not.toBeNull();
				expect(linkElement!.textContent).toBe("A12W-123");

				const misspelled = editorInput.getElementsByClassName(editorThemeClasses.misspelledWord);
				expect(misspelled.length).toBe(1);
				expect(misspelled[0].textContent).toBe("developr");
			});

			// Move cursor after "A12W-" (5 chars from start), then delete "123" and retype it
			// "A12W-123: abc developr def" — "123" starts at index 5
			await userEvent.keyboard("{Home}");
			await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}");
			await userEvent.keyboard("{Delete}{Delete}{Delete}");
			await userEvent.type(editorInput, "123");

			// "A12W-123" should still be a link after re-typing "123"
			await waitFor(() => {
				const linkElement = editorInput.querySelector(`.${editorThemeClasses.link}`);
				expect(linkElement).not.toBeNull();
				expect(linkElement!.textContent).toBe("A12W-123");
			});

			// Navigate to "r" at the end of "developr" and delete then retype it
			// Position cursor right after "developr" by going to end and stepping back over " def"
			await userEvent.keyboard("{End}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}");
			await userEvent.keyboard("{Backspace}");
			await userEvent.type(editorInput, "r");
			await userEvent.keyboard("{Backspace}");
			await userEvent.type(editorInput, "r");

			// "developr" should still be misspelled after deleting and retyping "r"
			await waitFor(() => {
				const misspelled = editorInput.getElementsByClassName(editorThemeClasses.misspelledWord);
				expect(misspelled.length).toBe(1);
				expect(misspelled[0].textContent).toBe("developr");
			});

			// Final state: link intact, misspell intact, full text correct
			await waitFor(() => {
				const linkElement = editorInput.querySelector(`.${editorThemeClasses.link}`);
				expect(linkElement).not.toBeNull();
				expect(linkElement!.textContent).toBe("A12W-123");
			});

			expect(editorInput.textContent).toBe("A12W-123: abc developr def");
		});
	});
});
