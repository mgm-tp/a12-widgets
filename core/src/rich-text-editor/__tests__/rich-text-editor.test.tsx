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

import { AutoLinkNode, LinkNode } from "@lexical/link";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import type { ReactElement, ReactNode } from "react";
import { getAllByDataRole, getByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { Button } from "../../button/main/button.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { Icon } from "../../icon/main/icon.view.js";

import type { InlineButtonProps, LinkDecoratorProps, MentionPluginProps } from "../main/plugins/index.js";
import {
	AlignButtonGroup,
	BoldButton,
	createButtonGroup,
	createInlineButton,
	createSpellCheckPlugin,
	ItalicButton,
	UnderlineButton
} from "../main/plugins/index.js";
import type { RichTextEditorProps } from "../main/rich-text-editor.api.js";
import { RichTextEditor } from "../main/rich-text-editor.view.js";
import { editorThemeClasses } from "../main/themes/themes.js";
import type { LinkPluginConfig } from "../main/wrapper/default-rich-text-editor.api.js";
import { DefaultRichTextEditor } from "../main/wrapper/default-rich-text-editor.view.js";

// -- Story components inlined for rich-text-editor behavior tests --

const customInlineButtons = [
	{ nodeClassName: "editor-text-strikethrough", label: "Strikethrough" },
	{ nodeClassName: "editor-text-monospace", label: "Monospace" }
].map((format: InlineButtonProps) =>
	createInlineButton({
		nodeClassName: format.nodeClassName,
		label: (
			<span className={`${format.nodeClassName}`}>
				{(format.label as string)?.replace(/\b\w/g, (char) => char.toUpperCase())}
			</span>
		),
		className: format.nodeClassName
	})
);

const TextFormatButtonGroup = createButtonGroup({
	icon: <Icon>text_format</Icon>,
	buttons: customInlineButtons,
	title: "More"
});

const BUTTONS = [BoldButton, ItalicButton, UnderlineButton, TextFormatButtonGroup, AlignButtonGroup];

const SimpleEditorExample = ({ children }: { children?: ReactNode }): ReactElement => (
	<RichTextEditor
		initialConfig={{ namespace: "Simple Rich Text Editor" }}
		id="simple-rich-text-editor"
		placeholder="Type anything..."
	>
		{children}
	</RichTextEditor>
);

const linkPluginConfig: LinkPluginConfig = {
	target: "_blank",
	customTerms: [
		{
			regex: /\bA12W-\d+\b/g,
			getUrl: (text: string) => `https://example.com/${text}`
		}
	],
	popupRenderer(info: LinkDecoratorProps.LinkInfo): ReactNode {
		return (
			<Button
				label="Follow this link"
				onClick={(): void => {
					if (info.target === "_self") {
						window.location.href = info.href;
					} else if (info.target === "_blank") {
						window.open(info.href);
					}
				}}
			/>
		);
	}
};

const ToolbarEditorExampleWithLinkPlugin = (): ReactNode => (
	<DefaultRichTextEditor
		initialConfig={{ namespace: "Link Plugin", nodes: [AutoLinkNode, LinkNode] }}
		id="link-plugin-editor"
		labelGraphic={<Icon>info</Icon>}
		placeholder="Type anything..."
		staticToolbarButtons={BUTTONS}
		linkPluginConfig={linkPluginConfig}
	/>
);

const DefaultEditorFormatTextExample = (props: {
	mentionPlugin?: { resetTextFormatAfterTransform?: boolean };
}): ReactElement => {
	const mentionPluginConfig: MentionPluginProps = {
		suggestions: [
			{ name: "A12W", value: "Widgets" },
			{ name: "A12P", value: "Plasma" },
			{ name: "mgm", value: "mgm-tp" }
		],
		clearTextFormatAfterTransform: props.mentionPlugin?.resetTextFormatAfterTransform
	};

	return (
		<div className="-u-width-full">
			<DefaultRichTextEditor
				initialConfig={{ namespace: "Default Editor Example" }}
				id="default-editor"
				label="Editor with HTML Output"
				labelGraphic={<Icon>info</Icon>}
				placeholder="Type anything..."
				staticToolbarButtons={BUTTONS}
				mentionPluginConfig={mentionPluginConfig}
			/>
		</div>
	);
};

const ReadonlyEditorExample = (props: Partial<RichTextEditorProps>): ReactElement => (
	<RichTextEditor
		initialConfig={{ namespace: "Readonly Rich Text Editor Test", ...props.initialConfig }}
		id="readonly-test-editor"
		label="Readonly Test Editor"
		labelGraphic={<Icon>lock</Icon>}
		placeholder="This should not be editable when readonly..."
		readonly={true}
		{...props}
	/>
);

const TestSpellCheckPlugin = createSpellCheckPlugin({
	spellCheck: [
		(text: string): { index: number; length: number; text: string } | null => {
			const index = text.indexOf("test");

			return index >= 0 ? { index, length: 4, text: "test" } : null;
		},
		(text: string): { index: number; length: number; text: string } | null => {
			const index = text.indexOf("readonly");

			return index >= 0 ? { index, length: 8, text: "readonly" } : null;
		}
	]
});

const ReadonlyEditorWithSpellCheckExample = (props: Partial<RichTextEditorProps>): ReactElement => (
	<RichTextEditor
		initialConfig={{ namespace: "Readonly with SpellCheck Test", ...props.initialConfig }}
		id="readonly-spellcheck-test-editor"
		label="Readonly Editor with SpellCheck Plugin"
		labelGraphic={<Icon>lock</Icon>}
		placeholder="This should remain readonly even with spell check plugin..."
		readonly={true}
		{...props}
	>
		<TestSpellCheckPlugin.SpellCheckPlugin />
	</RichTextEditor>
);

async function selectTextInEditor(editor: HTMLElement, position?: { start?: number; end?: number }): Promise<void> {
	await userEvent.click(editor);
	const textNode = editor.querySelector("span")!.firstChild!;
	const { start = 0, end = 0 } = position ?? { start: 0, end: 0 };
	const range = document.createRange();
	const selection = window.getSelection()!;
	range.setStart(textNode, start);
	range.setEnd(textNode, end);
	selection.removeAllRanges();
	selection.addRange(range);
}

describe("Rich Text Editor", () => {
	test("Should render with label, content and helper text", async () => {
		const { container, findByDataRole } = render(
			<RichTextEditor
				id="label-content-helper-test"
				label="Editor Label"
				helperText="Helper text content"
				initialConfig={{
					namespace: "Label Content Helper Test",
					editorState: () => {
						const root = $getRoot();

						if (root.getFirstChild() === null) {
							const paragraph = $createParagraphNode();
							paragraph.append($createTextNode("Initial editor content"));
							root.append(paragraph);
						}
					}
				}}
			/>
		);

		await findByDataRole(DataRoles.RichTextEditor.Input);
		expect(container).toMatchSnapshot();
	});

	test("Should render with label, placeholder and helper text", async () => {
		const { container, findByDataRole } = render(
			<RichTextEditor
				id="label-placeholder-helper-test"
				label="Editor Label"
				helperText="Helper text content"
				placeholder="Type something..."
				initialConfig={{ namespace: "Label Placeholder Helper Test" }}
			/>
		);

		await findByDataRole(DataRoles.RichTextEditor.Input);
		expect(container).toMatchSnapshot();
	});

	test("Should render info message", async () => {
		const { container, findByDataRole } = render(
			<RichTextEditor
				id="info-message-test"
				label="Editor Label"
				infoMessage="Example Info Message"
				initialConfig={{ namespace: "Info Message Test" }}
			/>
		);

		const editor = await findByDataRole(DataRoles.RichTextEditor.Input);
		const infoElement = container.querySelector("#info-message-test-info");
		expect(infoElement).toBeVisible();
		expect(infoElement!.textContent).toContain("Example Info Message");
		expect(editor.getAttribute("aria-describedby")).toContain("info-message-test-info");
	});

	test("Should render warning message", async () => {
		const { container, findByDataRole } = render(
			<RichTextEditor
				id="warning-message-test"
				label="Editor Label"
				warningMessage="Example Warning Message"
				initialConfig={{ namespace: "Warning Message Test" }}
			/>
		);

		const editor = await findByDataRole(DataRoles.RichTextEditor.Input);
		const warningElement = container.querySelector("#warning-message-test-warning");
		expect(warningElement).toBeVisible();
		expect(warningElement!.textContent).toContain("Example Warning Message");
		expect(editor.getAttribute("aria-describedby")).toContain("warning-message-test-warning");
	});

	test("Should render error message", async () => {
		const { container, findByDataRole } = render(
			<RichTextEditor
				id="error-message-test"
				label="Editor Label"
				errorMessage="Example Error Message"
				initialConfig={{ namespace: "Error Message Test" }}
			/>
		);

		const editor = await findByDataRole(DataRoles.RichTextEditor.Input);
		const errorElement = container.querySelector("#error-message-test-error");
		expect(errorElement).toBeVisible();
		expect(errorElement!.textContent).toContain("Example Error Message");
		expect(editor.getAttribute("aria-describedby")).toContain("error-message-test-error");
	});

	const formatTextAndAddMentionNode = async (container: HTMLElement): Promise<HTMLElement> => {
		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);
		const toolbarItems = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem);
		const boldButton = toolbarItems[0];
		const customFormatButton = toolbarItems[3];

		await userEvent.click(boldButton);
		await userEvent.click(customFormatButton);

		await waitFor(() => {
			const strikethroughButton = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarListItem)[0];
			expect(strikethroughButton).toBeVisible();
		});

		const strikethroughButton = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarListItem)[0];
		await userEvent.click(strikethroughButton);

		await userEvent.click(editor);
		await userEvent.type(editor, "@");
		await new Promise((r) => setTimeout(r, 200)); // Wait for mention dropdown to appear
		await userEvent.keyboard("{Enter}");

		return editor.querySelector(`.${editorThemeClasses.mention}`)!;
	};

	test("Should not reset text styles after transforming to a Mention node", async () => {
		const { container } = render(<DefaultEditorFormatTextExample />);

		const mentionNode = await formatTextAndAddMentionNode(container);

		expect(mentionNode.className).toMatch(new RegExp(editorThemeClasses.text?.strikethrough || ""));
		expect(mentionNode.className).toMatch(new RegExp(editorThemeClasses.text?.bold || ""));
	});

	test("Should not reset text styles after transforming to a Mention node when setting resetTextFormatAfterTransform false", async () => {
		const { container } = render(
			<DefaultEditorFormatTextExample mentionPlugin={{ resetTextFormatAfterTransform: false }} />
		);

		const mentionNode = await formatTextAndAddMentionNode(container);

		expect(mentionNode.className).toMatch(new RegExp(editorThemeClasses.text?.strikethrough || ""));
		expect(mentionNode.className).toMatch(new RegExp(editorThemeClasses.text?.bold || ""));
	});

	test("Should reset text styles after transforming to a Mention node when setting resetTextFormatAfterTransform true", async () => {
		const { container } = render(
			<DefaultEditorFormatTextExample mentionPlugin={{ resetTextFormatAfterTransform: true }} />
		);

		const mentionNode = await formatTextAndAddMentionNode(container);

		expect(mentionNode.className).not.toMatch(new RegExp(editorThemeClasses.text?.strikethrough || ""));
		expect(mentionNode.className).not.toMatch(new RegExp(editorThemeClasses.text?.bold || ""));
	});

	test("Should not change the selection when the editor is blurred and refocused", async () => {
		const selectedText = "widget";
		const { container } = render(<SimpleEditorExample />);

		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);

		await userEvent.click(editor);
		await userEvent.type(editor, `${selectedText} team`);

		// Select the text "widget" in editor
		await selectTextInEditor(editor, { start: 0, end: selectedText.length });

		let selected = window.getSelection()!.toString();
		expect(selected).toBe(selectedText);

		// Blur the editor to focus on body
		editor.blur();
		const isBodyFocused = document.activeElement === document.body;
		expect(isBodyFocused).toBe(true);

		// Focus back on the editor
		editor.focus();

		// Check selected text not change after refocusing editor
		selected = window.getSelection()!.toString();
		expect(selected).toBe(selectedText);
	});

	test("Should align Link Node as expected", async () => {
		const url = "https://www.widgets.com/";
		const { container } = render(<ToolbarEditorExampleWithLinkPlugin />);

		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);

		await userEvent.click(editor);
		await userEvent.type(editor, url);

		await selectTextInEditor(editor);

		const toolbarItems = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem);
		const alignGroupButton = toolbarItems[4];
		await userEvent.click(alignGroupButton);

		await waitFor(() => {
			const listItems = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarListItem);
			expect(listItems.length).toBeGreaterThan(2);
		});

		const alignButtonText = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarListItem)[2];
		await userEvent.click(alignButtonText);

		expect(alignGroupButton.innerText).toContain("format_align_right");

		const paragraph = editor.querySelector("p") as HTMLElement;
		const paragraphTextAlign = paragraph ? getComputedStyle(paragraph).textAlign : null;
		expect(paragraphTextAlign).toBe("right");
	});

	test("Should apply styling to Link Node as expected", async () => {
		const url = "https://www.widgets.com/";
		const formattedText = "widgets";
		const { container } = render(<ToolbarEditorExampleWithLinkPlugin />);

		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);

		await userEvent.click(editor);
		await userEvent.type(editor, url);

		await selectTextInEditor(editor, {
			start: url.indexOf(formattedText),
			end: url.indexOf(formattedText[0]) + formattedText.length
		});

		const toolbarItems = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem);
		const alignGroupButton = toolbarItems[3];
		await userEvent.click(alignGroupButton);

		await waitFor(() => {
			const listItems = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarListItem);
			expect(listItems.length).toBeGreaterThan(0);
		});

		const alignButtonText = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarListItem)[0];
		await userEvent.click(alignButtonText);

		const hasFormatted = editor.getElementsByClassName(editorThemeClasses.text?.strikethrough || "").length > 0;
		expect(hasFormatted).toBe(true);
	});

	test("Should correctly update the auto link when modified", async () => {
		const url = "www.widgets.com";
		const breakUrl = "widgets.com";
		const breakTextPosition = "www.".length;
		const { container } = render(<ToolbarEditorExampleWithLinkPlugin />);

		const editor = getByDataRole(container, DataRoles.RichTextEditor.Input);

		await userEvent.click(editor);
		await userEvent.type(editor, url);

		await selectTextInEditor(editor, {
			start: breakTextPosition,
			end: breakTextPosition
		});

		await userEvent.keyboard(" ");

		await waitFor(() => {
			const autoLink = editor.querySelector("a");
			expect(autoLink).not.toBeNull();
			expect(autoLink!.innerText).toEqual(breakUrl);
		});

		await userEvent.keyboard("{Backspace}");

		await waitFor(() => {
			const autoLink = editor.querySelector("a");
			expect(autoLink).not.toBeNull();
			expect(autoLink!.innerText).toEqual(url);
		});
	});
});

describe("Readonly Rich Text Editor", () => {
	test("Should not be editable when readonly prop is true", async () => {
		const { container } = render(<ReadonlyEditorExample readonly={true} />);
		const editor = getByDataRole(container, `${DataRoles.RichTextEditor.Input}`);
		const contentEditable = container.querySelector("[contenteditable]") as HTMLElement;

		expect(contentEditable).toHaveAttribute("contenteditable", "false");

		await userEvent.click(editor);
		expect(contentEditable).toHaveFocus();

		const initialContent = contentEditable.textContent;
		await userEvent.type(contentEditable, "This text should not appear");

		// Verify that no text was added
		const finalContent = contentEditable.textContent;
		expect(finalContent).toBe(initialContent);
	});

	test("Should not be editable when initialConfig.editable is false", async () => {
		const { container } = render(<ReadonlyEditorExample initialConfig={{ editable: false, namespace: "Test" }} />);
		const editor = getByDataRole(container, `${DataRoles.RichTextEditor.Input}`);
		const contentEditable = container.querySelector("[contenteditable]") as HTMLElement;

		expect(contentEditable).toHaveAttribute("contenteditable", "false");

		await userEvent.click(editor);
		expect(contentEditable).toHaveFocus();

		const initialContent = contentEditable.textContent;
		await userEvent.type(contentEditable, "This text should not appear");

		const finalContent = contentEditable.textContent;
		expect(finalContent).toBe(initialContent);
	});

	test("Should not be editable when both readonly=true and initialConfig.editable=false", async () => {
		const { container } = render(
			<ReadonlyEditorExample readonly={true} initialConfig={{ editable: false, namespace: "Test" }} />
		);
		const editor = getByDataRole(container, `${DataRoles.RichTextEditor.Input}`);
		const contentEditable = container.querySelector("[contenteditable]") as HTMLElement;

		expect(contentEditable).toHaveAttribute("contenteditable", "false");

		await userEvent.click(editor);
		expect(contentEditable).toHaveFocus();

		const initialContent = contentEditable.textContent;
		await userEvent.type(contentEditable, "This text should not appear");

		const finalContent = contentEditable.textContent;
		expect(finalContent).toBe(initialContent);
	});

	test("Should remain readonly with spell check plugin", async () => {
		const { container } = render(<ReadonlyEditorWithSpellCheckExample readonly={true} />);
		const editor = getByDataRole(container, `${DataRoles.RichTextEditor.Input}`);
		const contentEditable = container.querySelector("[contenteditable]") as HTMLElement;

		expect(contentEditable).toHaveAttribute("contenteditable", "false");

		await userEvent.click(editor);
		expect(contentEditable).toHaveFocus();

		const initialContent = contentEditable.textContent;
		await userEvent.type(contentEditable, "test readonly content");

		const finalContent = contentEditable.textContent;
		expect(finalContent).toBe(initialContent);
	});

	test("Should not be editable when readOnly true and editable is true", async () => {
		const { container } = render(<ReadonlyEditorWithSpellCheckExample initialConfig={{ editable: true }} />);
		const editor = getByDataRole(container, `${DataRoles.RichTextEditor.Input}`);
		const contentEditable = container.querySelector("[contenteditable]") as HTMLElement;

		expect(contentEditable).toHaveAttribute("contenteditable", "false");

		await userEvent.click(editor);
		expect(contentEditable).toHaveFocus();

		const initialContent = contentEditable.textContent;
		await userEvent.type(contentEditable, "not be editable content");

		const finalContent = contentEditable.textContent;
		expect(finalContent).toBe(initialContent);
	});

	test("Should prevent all editing operations in readonly mode", async () => {
		const { container } = render(<ReadonlyEditorExample readonly={true} />);
		const editor = getByDataRole(container, `${DataRoles.RichTextEditor.Input}`);
		const contentEditable = container.querySelector("[contenteditable]") as HTMLElement;

		const initialContent = contentEditable.textContent;

		await userEvent.click(editor);
		await userEvent.type(contentEditable, "New text");
		await userEvent.keyboard("{Enter}");
		await userEvent.keyboard("{Backspace}");
		await userEvent.keyboard("{Delete}");
		await userEvent.keyboard(" ");
		const isMac = navigator.platform.includes("Mac");
		const pasteKey = isMac ? "{Meta>}v{/Meta}" : "{Control>}v{/Control}";
		await userEvent.keyboard(pasteKey);

		const finalContent = contentEditable.textContent;
		expect(finalContent).toBe(initialContent);

		expect(contentEditable).toHaveFocus();
	});

	test("Should not show cursor in readonly mode", async () => {
		const { container } = render(<ReadonlyEditorExample readonly={true} />);
		const editor = getByDataRole(container, `${DataRoles.RichTextEditor.Input}`);
		const contentEditable = container.querySelector("[contenteditable]") as HTMLElement;

		await userEvent.click(editor);

		expect(contentEditable).toHaveAttribute("contenteditable", "false");
	});

	test("Should be editable when readonly is false and initialConfig.editable is true", async () => {
		const { container } = render(
			<ReadonlyEditorExample readonly={false} initialConfig={{ editable: true, namespace: "Test" }} />
		);
		const editor = getByDataRole(container, `${DataRoles.RichTextEditor.Input}`);
		const contentEditable = container.querySelector("[contenteditable]") as HTMLElement;

		expect(contentEditable).toHaveAttribute("contenteditable", "true");

		await userEvent.click(editor);
		expect(contentEditable).toHaveFocus();

		await userEvent.type(contentEditable, "This text should appear");

		const content = contentEditable.textContent;
		expect(content).toContain("This text should appear");
	});

	test("Should handle readonly state changes correctly", async () => {
		const readonlyState = false;
		const { container } = render(<ReadonlyEditorExample readonly={readonlyState} />);
		const editor = getByDataRole(container, `${DataRoles.RichTextEditor.Input}`);
		const contentEditable = container.querySelector("[contenteditable]") as HTMLElement;

		expect(contentEditable).toHaveAttribute("contenteditable", "true");

		await userEvent.click(editor);
		await userEvent.type(contentEditable, "Initial content");

		const contentAfterTyping = contentEditable.textContent;
		expect(contentAfterTyping).toContain("Initial content");
	});

	test("Should render readonly editor with content and be focusable via tab", async () => {
		const { container, findByDataRole } = render(
			<RichTextEditor
				id="readonly-content-test"
				label="Readonly Editor"
				readonly={true}
				initialConfig={{
					namespace: "Readonly Content Test",
					editorState: () => {
						const root = $getRoot();

						if (root.getFirstChild() === null) {
							const paragraph = $createParagraphNode();
							paragraph.append($createTextNode("Readonly content"));
							root.append(paragraph);
						}
					}
				}}
			/>
		);

		const editorInput = await findByDataRole(DataRoles.RichTextEditor.Input);
		expect(container).toMatchSnapshot();

		await userEvent.tab();
		expect(editorInput).toHaveFocus();
	});

	test("Should render readonly editor without content and not be focusable via tab", async () => {
		const { container, findByDataRole } = render(
			<RichTextEditor
				id="readonly-empty-test"
				label="Readonly Editor"
				readonly={true}
				initialConfig={{ namespace: "Readonly Empty Test" }}
			/>
		);

		const editorInput = await findByDataRole(DataRoles.RichTextEditor.Input);
		expect(container).toMatchSnapshot();

		await userEvent.tab();
		expect(editorInput).not.toHaveFocus();
	});
});

describe("InlineStyleTextNode - Strikethrough with format combinations", () => {
	const applyStrikethrough = async (
		container: HTMLElement,
		findAllByDataRole: (role: string) => Promise<HTMLElement[]>
	): Promise<void> => {
		const toolbarItems = getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem);
		await userEvent.click(toolbarItems[3]);
		const listItems = await findAllByDataRole(DataRoles.RichTextEditor.ToolbarListItem);
		await userEvent.click(listItems[0]);
	};

	test("Should use strong tag when strikethrough and bold are applied", async () => {
		const text = "Hello";
		const { container, findByDataRole, findAllByDataRole } = render(
			<DefaultRichTextEditor staticToolbarButtons={BUTTONS} initialConfig={{ namespace: "strikethrough-bold" }} />
		);

		const editorInput = await findByDataRole(DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.keyboard(text);
		await userEvent.keyboard("{ControlOrMeta>}a{/ControlOrMeta}");

		await applyStrikethrough(container, findAllByDataRole);

		await userEvent.click(editorInput);
		await userEvent.keyboard("{ControlOrMeta>}a{/ControlOrMeta}");
		await userEvent.click(getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem)[0]);

		const strongTag = editorInput.querySelector("strong");
		expect(strongTag).not.toBeNull();
		expect(strongTag!.textContent).toBe(text);
	});

	test("Should use em tag when strikethrough and italic are applied", async () => {
		const text = "Hello";
		const { container, findByDataRole, findAllByDataRole } = render(
			<DefaultRichTextEditor staticToolbarButtons={BUTTONS} initialConfig={{ namespace: "strikethrough-italic" }} />
		);

		const editorInput = await findByDataRole(DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.keyboard(text);
		await userEvent.keyboard("{ControlOrMeta>}a{/ControlOrMeta}");

		await applyStrikethrough(container, findAllByDataRole);

		await userEvent.click(editorInput);
		await userEvent.keyboard("{ControlOrMeta>}a{/ControlOrMeta}");
		await userEvent.click(getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem)[1]);

		const emTag = editorInput.querySelector("em");
		expect(emTag).not.toBeNull();
		expect(emTag!.textContent).toBe(text);
	});

	test("Should use s tag when strikethrough and underline are applied", async () => {
		const text = "Hello";
		const { container, findByDataRole, findAllByDataRole } = render(
			<DefaultRichTextEditor staticToolbarButtons={BUTTONS} initialConfig={{ namespace: "strikethrough-underline" }} />
		);

		const editorInput = await findByDataRole(DataRoles.RichTextEditor.Input);
		await userEvent.click(editorInput);
		await userEvent.keyboard(text);
		await userEvent.keyboard("{ControlOrMeta>}a{/ControlOrMeta}");

		await applyStrikethrough(container, findAllByDataRole);

		await userEvent.click(editorInput);
		await userEvent.keyboard("{ControlOrMeta>}a{/ControlOrMeta}");
		await userEvent.click(getAllByDataRole(container, DataRoles.RichTextEditor.ToolbarItem)[2]);

		const sTag = editorInput.querySelector("s");
		expect(sTag).not.toBeNull();
		expect(sTag!.textContent).toBe(text);
	});
});

describe("Disabled Rich Text Editor", () => {
	test("Should render disabled editor with content and not be focusable via tab", async () => {
		const { container, findByDataRole } = render(
			<RichTextEditor
				id="disabled-content-test"
				label="Disabled Editor"
				disabled={true}
				initialConfig={{
					namespace: "Disabled Content Test",
					editorState: () => {
						const root = $getRoot();

						if (root.getFirstChild() === null) {
							const paragraph = $createParagraphNode();
							paragraph.append($createTextNode("Disabled content"));
							root.append(paragraph);
						}
					}
				}}
			/>
		);

		const editorInput = await findByDataRole(DataRoles.RichTextEditor.Input);
		expect(container).toMatchSnapshot();

		await userEvent.tab();
		expect(editorInput).not.toHaveFocus();
	});
});
