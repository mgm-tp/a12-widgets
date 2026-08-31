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

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $patchStyleText } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand } from "lexical";
import type { FC } from "react";
import { useEffect } from "react";
import { getAllByDataRole, getByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../common/main/data-roles.js";
import { Icon } from "../../icon/main/icon.view.js";

import type { MentionPluginProps, TooltipPluginConfig } from "../index.js";
import { $isInlineStyleTextNode, $updateTextSelection } from "../index.js";
import type { TextMatcher, TextMatcherResult } from "../main/plugins/plugin.internal.api.js";
import { createInlineButton } from "../main/plugins/static-toolbar-plugin/inline-button/inline-button.view.js";
import { Separator } from "../main/plugins/static-toolbar-plugin/separator/separator.view.js";
import type { LinkPluginConfig, SpellCheckPluginConfig } from "../main/wrapper/default-rich-text-editor.api.js";
import { DefaultRichTextEditor } from "../main/wrapper/default-rich-text-editor.view.js";

import { DefaultEditorCombination } from "./default-editor-combination.js";

const MarkButton = createInlineButton({
	nodeClassName: "editor-text-mark",
	label: "Mark"
});

const StrikethroughButton = createInlineButton({
	nodeClassName: "editor-text-strikethrough",
	label: "Strikethrough"
});

const SET_STYLE_COMMAND = createCommand("SET_STYLE_COMMAND");
const PATCH_STYLE_COMMAND = createCommand("PATCH_STYLE_COMMAND");

const SetStyleButton = createInlineButton({
	onClick: (event, editor) => {
		event.preventDefault();
		editor?.dispatchCommand(SET_STYLE_COMMAND, undefined);
	},
	icon: <Icon>format_color_fill</Icon>,
	title: "setStyle (red)"
});

const PatchStyleButton = createInlineButton({
	onClick: (event, editor) => {
		event.preventDefault();
		editor?.dispatchCommand(PATCH_STYLE_COMMAND, undefined);
	},
	icon: <Icon>format_color_text</Icon>,
	title: "patchStyleText (blue)"
});

const InlineStylePlugin: FC = () => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		return mergeRegister(
			editor.registerCommand(
				SET_STYLE_COMMAND,
				() => {
					const selection = $getSelection();

					if (!$isRangeSelection(selection) || selection.isCollapsed()) {
						return true;
					}

					$updateTextSelection(selection, (node) => {
						if ($isInlineStyleTextNode(node)) {
							node.setStyle("color: red");
						}
					});

					return true;
				},
				COMMAND_PRIORITY_EDITOR
			),
			editor.registerCommand(
				PATCH_STYLE_COMMAND,
				() => {
					const selection = $getSelection();

					if (!$isRangeSelection(selection) || selection.isCollapsed()) {
						return true;
					}

					$patchStyleText(selection, { color: "blue" });

					return true;
				},
				COMMAND_PRIORITY_EDITOR
			)
		);
	}, [editor]);

	return null;
};

describe("TextFormatPlugin - addSelectedStyleName sets unmergeable", () => {
	test("should not merge nodes with different class names after addSelectedStyleName", async () => {
		const { container } = render(<DefaultEditorCombination />);

		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editor);
		await userEvent.type(editor, "hello world");

		// Select "hello" (first 5 characters)
		await userEvent.click(editor);
		await userEvent.keyboard("{Home}");
		await userEvent.keyboard("{Shift>}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{/Shift}");

		// Apply bold to "hello" via toolbar (first button)
		const boldButton = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem)[0];
		await userEvent.click(boldButton);

		// Verify the bold text remains as a separate node (not merged with adjacent unstyled text)
		await waitFor(() => {
			const boldNodes = container.querySelectorAll("[contenteditable] .editor-text-bold");
			expect(boldNodes.length).toBe(1);
			expect(boldNodes[0].textContent).toBe("hello");

			// The rest of the text should still exist separately
			expect(editor.textContent).toContain("hello");
			expect(editor.textContent).toContain(" world");
		});
	});
});

describe("TextFormatPlugin - Unmergeable Nodes", () => {
	test("should NOT merge custom unmergeable space nodes when applying bold format", async () => {
		const { container } = render(<DefaultEditorCombination hasUnmergeablePlugin />);

		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);
		expect(editor).toBeVisible();

		await userEvent.click(editor);
		await userEvent.type(editor, "hello world");

		// Enable unmergeable plugin to mark space nodes as custom unmergeable
		const enableUnmergeableCheckbox = getByDataRole(container, DataRoles.Checkbox.Input);
		expect(enableUnmergeableCheckbox).toBeVisible();
		await userEvent.click(enableUnmergeableCheckbox);

		// Verify space node exists by checking for a text node with only space
		const editorContent = editor.innerHTML;
		expect(editorContent).toContain("hello");
		expect(editorContent).toContain("world");

		// Select all text and apply bold
		await userEvent.click(editor);
		await userEvent.keyboard("{ControlOrMeta>}a{/ControlOrMeta}");

		const boldButton = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem)[0];
		await userEvent.click(boldButton);

		// Verify space node still exists as separate node after applying bold
		await waitFor(() => {
			const boldNodes = container.querySelectorAll("[contenteditable] strong.editor-text-bold");
			expect(boldNodes.length).toBe(3);

			// Check that one of the bold nodes is a space
			let hasSpaceNode = false;

			for (const node of boldNodes) {
				if (node.textContent === " ") {
					hasSpaceNode = true;
					break;
				}
			}

			expect(hasSpaceNode).toBe(true);
		});
	});

	test("should merge lexical unmergeable nodes with same style when applying bold format", async () => {
		const { container } = render(<DefaultEditorCombination />);

		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);
		expect(editor).toBeVisible();

		await userEvent.click(editor);
		await userEvent.type(editor, "abc def ghi");

		// Select all text and apply bold to create lexical unmergeable nodes
		await userEvent.keyboard("{ControlOrMeta>}a{/ControlOrMeta}");
		await new Promise((r) => setTimeout(r, 100));

		const boldButton = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem)[0];
		await userEvent.click(boldButton);

		await new Promise((r) => setTimeout(r, 300));

		await waitFor(() => {
			const boldNodes = container.querySelectorAll("b, strong");

			// Verify all text is still present
			const allText = editor.textContent;
			expect(allText).toContain("abc");
			expect(allText).toContain("def");
			expect(allText).toContain("ghi");

			// All nodes with same style should merge into a single bold node
			expect(boldNodes.length).toBe(1);

			// Verify the single bold node contains all text
			const boldText = container.querySelector("b, strong")!.textContent;
			expect(boldText).toContain("abc def ghi");
		});
	});
});

describe("TextFormatPlugin - Delete text before formatted text", () => {
	test("should preserve strikethrough style when deleting all text before the formatted word", async () => {
		const { findByDataRole, getAllByDataRole } = render(
			<DefaultRichTextEditor
				initialConfig={{ namespace: "strikethrough-delete-test" }}
				staticToolbarButtons={[StrikethroughButton]}
			/>
		);

		const editor = await findByDataRole(DataRoles.RichTextEditor.Input);
		await userEvent.click(editor);

		// Type "text " first (unstyled)
		await userEvent.keyboard("text ");

		// Enable strikethrough for collapsed selection, then type "test"
		const toolbarItems = getAllByDataRole(DataRoles.RichTextEditor.ToolbarItem);
		await userEvent.click(toolbarItems[0]);

		await userEvent.keyboard("test");

		// Verify strikethrough is applied to "test"
		await waitFor(() => {
			const strikethroughNode = editor.querySelector(".editor-text-strikethrough, s");
			expect(strikethroughNode).not.toBeNull();
			expect(strikethroughNode!.textContent).toBe("test");
		});

		// Move cursor to beginning of line
		await userEvent.keyboard("{Home}");

		// Select "text " (5 characters to the right)
		await userEvent.keyboard("{Shift>}{Right}{Right}{Right}{Right}{Right}{/Shift}");

		// Delete the selected text
		await userEvent.keyboard("{Backspace}");

		// Verify "test" still has full strikethrough styling
		await waitFor(() => {
			const styledNode = editor.querySelector(".editor-text-strikethrough, s");
			expect(styledNode).not.toBeNull();
			expect(styledNode!.textContent).toBe("test");
		});
	});
});

describe("TextFormatPlugin - Endless transform prevention", () => {
	function findWholeWord(text: string, matchString: string): TextMatcherResult | null {
		const regex = new RegExp(`\\b${matchString}\\b`);
		const result = text.match(regex);

		if (!result || result.index === undefined) {
			return null;
		}

		return { index: result.index, length: matchString.length, text: matchString };
	}

	const spellCheckPluginConfig: SpellCheckPluginConfig = {
		spellCheck: ["developr"].map((word) => (text: string) => findWholeWord(text, word)) as TextMatcher[],
		render: () => undefined
	};

	test("should not endlessly trigger transforms when deleting space between misspelled and styled words", async () => {
		const { container } = render(
			<DefaultRichTextEditor
				initialConfig={{ namespace: "Endless Transform Test" }}
				spellCheckPluginConfig={spellCheckPluginConfig}
				staticToolbarButtons={[MarkButton]}
			/>
		);

		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editor);

		// Type "abc developrdef" - "developr" is misspelled but adjacent to "def"
		await userEvent.type(editor, "abc developrdef");

		// Select "def" using Shift+ArrowLeft
		await userEvent.keyboard("{Shift>}{ArrowLeft}{ArrowLeft}{ArrowLeft}{/Shift}");

		// Apply mark to "def"
		const markButton = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem)[0];
		await userEvent.click(markButton);

		// Verify mark is applied to "def" and no endless loop occurred
		await waitFor(() => {
			const markNode = editor.querySelector(".editor-text-mark");
			expect(markNode?.textContent).toBe("def");
		});
	});

	test("should not endlessly trigger transforms when a misspelled word appears twice around styled chars", async () => {
		const { container } = render(
			<DefaultRichTextEditor
				initialConfig={{ namespace: "Endless Transform Test 2" }}
				spellCheckPluginConfig={spellCheckPluginConfig}
				staticToolbarButtons={[MarkButton]}
			/>
		);

		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editor);

		// "developr" is misspelled but here only appears inside the compounds "xdevelopr" / "developrd"
		await userEvent.type(editor, "xdevelopr developrd");

		// Format the last "d" (in "developrd")
		await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
		const markButton = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem)[0];
		await userEvent.click(markButton);

		// Move to the very start and format the first "x"
		await userEvent.keyboard("{ArrowLeft}");
		await userEvent.keyboard("{Home}{Shift>}{ArrowRight}{/Shift}");
		await userEvent.click(markButton);

		// Neither "developr" occurrence may be flagged as misspelled, and no endless loop occurs
		await waitFor(() => {
			expect(editor.querySelector(".editor-misspelled-word")).toBeNull();
			expect(editor.textContent).toBe("xdevelopr developrd");
		});
	});

	test("should not endlessly trigger transforms when typing a space turns a compound into a misspelled word", async () => {
		const { container } = render(
			<DefaultRichTextEditor
				initialConfig={{ namespace: "Endless Transform Test 3" }}
				spellCheckPluginConfig={spellCheckPluginConfig}
				staticToolbarButtons={[MarkButton]}
			/>
		);

		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editor);

		await userEvent.type(editor, "xdevelopr developrd");

		// Format the last "d" (in "developrd")
		await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
		const markButton = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem)[0];
		await userEvent.click(markButton);

		// Format the first "x"
		await userEvent.keyboard("{ArrowLeft}");
		await userEvent.keyboard("{Home}{Shift>}{ArrowRight}{/Shift}");
		await userEvent.click(markButton);

		// Place the caret just before the last "d" and type a space.
		// This turns the middle "developr" into a standalone, space-bounded misspelled word.
		await userEvent.keyboard("{End}{ArrowLeft}");
		await userEvent.type(editor, " ");

		// The middle "developr" must be flagged as misspelled, and no endless loop occurs
		await waitFor(() => {
			expect(editor.textContent).toBe("xdevelopr developr d");
			const misspelled = editor.querySelector(".editor-misspelled-word");
			expect(misspelled?.textContent).toBe("developr");
		});
	});

	test("should flag a word as misspelled when a separator is typed into a formatted neighbor", async () => {
		const { container } = render(
			<DefaultRichTextEditor
				initialConfig={{ namespace: "Neighbor Re-evaluation Test" }}
				spellCheckPluginConfig={spellCheckPluginConfig}
				staticToolbarButtons={[MarkButton]}
			/>
		);

		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editor);

		// "developr" is misspelled but here is part of the compound "xdevelopr" -> not flagged.
		await userEvent.type(editor, "xdevelopr");

		// Format the first "x" so it becomes its own styled node.
		await userEvent.keyboard("{Home}{Shift>}{ArrowRight}{/Shift}");
		const markButton = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem)[0];
		await userEvent.click(markButton);

		// Place the caret right after the formatted "x" and type a space -> "x developr".
		// The space only mutates the "x" node; "developr" must still be re-evaluated and flagged.
		await userEvent.keyboard("{Home}{ArrowRight}");
		await userEvent.type(editor, " ");

		await waitFor(() => {
			expect(editor.textContent).toBe("x developr");
			const misspelled = editor.querySelector(".editor-misspelled-word");
			expect(misspelled?.textContent).toBe("developr");
		});
	});

	test("should not endlessly trigger transforms when a different misspelled word abuts an isolate-marked word", async () => {
		// Two misspelled words are needed to surface the bug: the changed node ("javescript ") carries
		// its own leftmost match that differs from the marked neighbour ("developr").
		const twoWordSpellCheckConfig: SpellCheckPluginConfig = {
			spellCheck: ["developr", "javescript"].map(
				(word) => (text: string) => findWholeWord(text, word)
			) as TextMatcher[],
			render: () => undefined
		};

		// Mirror the showcase plugin set — the loop only reproduces with the full combination.
		const tooltipPluginConfig: TooltipPluginConfig = {
			triggerMode: "focus",
			customTerms: [{ regex: /\bexample\b/, render: () => <>tip</> }]
		};
		const linkPluginConfig: LinkPluginConfig = {
			target: "_blank",
			customTerms: [{ regex: /\bA12W-\d+\b/g, getUrl: (text: string) => `https://example.com/${text}` }],
			popupRenderer: () => <>link</>
		};
		const mentionPluginConfig: MentionPluginProps = {
			suggestions: [{ name: "A12W", value: "Widgets" }]
		};

		// The green "Mark" button used in the showcase produces an isolate node.
		const IsolateMarkButton = createInlineButton({
			nodeClassName: "editor-text-mark-1",
			className: "editor-text-mark-1",
			label: "Mark 1",
			nodeIsolate: true,
			allowCollapseStyle: false,
			allowMultipleChoice: false
		});

		const { container } = render(
			<DefaultRichTextEditor
				initialConfig={{ namespace: "Endless Transform Test 4" }}
				spellCheckPluginConfig={twoWordSpellCheckConfig}
				tooltipPluginConfig={tooltipPluginConfig}
				linkPluginConfig={linkPluginConfig}
				mentionPluginConfig={mentionPluginConfig}
				staticToolbarButtons={[IsolateMarkButton]}
			/>
		);

		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editor);

		// Type "developr" (flagged misspelled), select it, and apply the isolate mark.
		await userEvent.type(editor, "developr");
		await userEvent.keyboard("{Home}{Shift>}{End}{/Shift}");
		const markButton = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem)[0];
		await userEvent.click(markButton);

		await waitFor(() => {
			expect(editor.querySelector(".editor-text-mark-1")?.textContent).toBe("developr");
		});

		// Caret right after the isolate node, then type a *different* misspelled word with NO leading
		// space -> "developrjavescript developr". This must not trigger an endless split<->merge loop.
		await userEvent.keyboard("{End}");
		await userEvent.type(editor, "javescript developr");

		await waitFor(() => {
			expect(editor.textContent).toBe("developrjavescript developr");
			// The isolate-marked word keeps its mark.
			expect(editor.querySelector(".editor-text-mark-1")?.textContent).toBe("developr");

			const misspelledTexts = [...editor.querySelectorAll(".editor-misspelled-word")].map((el) => el.textContent);
			// The standalone trailing "developr" is flagged.
			expect(misspelledTexts).toContain("developr");
			// "javescript" is part of the no-boundary compound "developrjavescript" -> not flagged.
			expect(misspelledTexts).not.toContain("javescript");
		});
	});
});

describe("TextFormatPlugin - Inline style with setStyle and patchStyleText", () => {
	test("should apply inline style using setStyle on selected text", async () => {
		const { container } = render(
			<DefaultRichTextEditor
				initialConfig={{ namespace: "set-style-test" }}
				staticToolbarButtons={[SetStyleButton, Separator, PatchStyleButton]}
			>
				<InlineStylePlugin />
			</DefaultRichTextEditor>
		);

		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editor);
		await userEvent.type(editor, "hello world");

		// Select "world" (last 5 characters)
		const selectedText = "world";
		await userEvent.keyboard("{End}");
		await userEvent.keyboard(`{Shift>}${"{ArrowLeft}".repeat(selectedText.length)}{/Shift}`);

		// Click the setStyle button (first toolbar item)
		const toolbarItems = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem);
		await userEvent.click(toolbarItems[0]);

		// Verify that inline style "color: red" was applied only to "world"
		await waitFor(() => {
			const worldSpan = [...editor.querySelectorAll("span")].find((el) => el.textContent === selectedText);
			expect(worldSpan).not.toBeNull();
			expect(worldSpan).toHaveStyle({ color: "red" });
		});
	});

	test("should apply inline style using patchStyleText on selected text", async () => {
		const { container } = render(
			<DefaultRichTextEditor
				initialConfig={{ namespace: "patch-style-test" }}
				staticToolbarButtons={[SetStyleButton, Separator, PatchStyleButton]}
			>
				<InlineStylePlugin />
			</DefaultRichTextEditor>
		);

		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);
		await userEvent.click(editor);
		await userEvent.type(editor, "hello world");

		// Select "world" (last 5 characters)
		const selectedText = "world";
		await userEvent.keyboard("{End}");
		await userEvent.keyboard(`{Shift>}${"{ArrowLeft}".repeat(selectedText.length)}{/Shift}`);

		// Click the patchStyleText button (third toolbar item, index 2 — separator is index 1)
		const toolbarItems = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem);
		await userEvent.click(toolbarItems[2]);

		// Verify that inline style "color: blue" was applied only to "world"
		await waitFor(() => {
			const worldSpan = [...editor.querySelectorAll("span")].find((el) => el.textContent === selectedText);
			expect(worldSpan).not.toBeNull();
			expect(worldSpan).toHaveStyle({ color: "blue" });
		});
	});
});
