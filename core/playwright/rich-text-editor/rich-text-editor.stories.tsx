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
import type { ReactElement, ReactNode } from "react";

import { Button } from "../../src/button/main/button.view.js";
import { Icon } from "../../src/icon/main/icon.view.js";
import type { LinkDecoratorProps, MentionPluginProps } from "../../src/rich-text-editor/index.js";
import { AlignButtonGroup } from "../../src/rich-text-editor/main/plugins/alignment-plugin/alignment-default-button.js";
import { createButtonGroup } from "../../src/rich-text-editor/main/plugins/static-toolbar-plugin/group-button/group-button.view.js";
import type { InlineButtonProps } from "../../src/rich-text-editor/main/plugins/static-toolbar-plugin/inline-button/inline-button.api.js";
import type { LinkPluginConfig } from "../../src/rich-text-editor/main/wrapper/default-rich-text-editor.api.js";
import { createInlineButton } from "../../src/rich-text-editor/main/plugins/static-toolbar-plugin/inline-button/inline-button.view.js";
import {
	BoldButton,
	ItalicButton,
	UnderlineButton
} from "../../src/rich-text-editor/main/plugins/static-toolbar-plugin/inline-button/inline-default-button.js";
import { RichTextEditor } from "../../src/rich-text-editor/main/rich-text-editor.view.js";
import { DefaultRichTextEditor } from "../../src/rich-text-editor/main/wrapper/default-rich-text-editor.view.js";
import { createSpellCheckPlugin } from "../../src/rich-text-editor/main/plugins/spell-check-plugin/spell-check-plugin.js";
import type { RichTextEditorProps } from "../../src/rich-text-editor/main/rich-text-editor.api.js";

export const customInlineButtons = [
	{
		nodeClassName: "editor-text-strikethrough",
		label: "Strikethrough"
	},
	{
		nodeClassName: "editor-text-monospace",
		label: "Monospace"
	}
].map((format: InlineButtonProps) => {
	return createInlineButton({
		nodeClassName: format.nodeClassName,
		label: (
			<span className={`${format.nodeClassName}`}>
				{(format.label as string)?.replace(/\b\w/g, (char) => char.toUpperCase())}
			</span>
		),
		className: format.nodeClassName
	});
});

export const TextFormatButtonGroup = createButtonGroup({
	icon: <Icon>text_format</Icon>,
	buttons: customInlineButtons,
	title: "More"
});

export const BUTTONS = [BoldButton, ItalicButton, UnderlineButton, TextFormatButtonGroup, AlignButtonGroup];

export const SimpleEditorExample = ({ children }: { children?: ReactNode }) => {
	return (
		<RichTextEditor
			initialConfig={{
				namespace: "Simple Rich Text Editor"
			}}
			id="simple-rich-text-editor"
			placeholder="Type anything..."
		>
			{children}
		</RichTextEditor>
	);
};

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

export const ToolbarEditorExampleWithLinkPlugin = (): ReactNode => {
	return (
		<DefaultRichTextEditor
			initialConfig={{
				namespace: "Link Plugin",
				nodes: [AutoLinkNode, LinkNode]
			}}
			id="link-plugin-editor"
			labelGraphic={<Icon>info</Icon>}
			placeholder="Type anything..."
			staticToolbarButtons={BUTTONS}
			linkPluginConfig={linkPluginConfig}
		/>
	);
};

export const DefaultEditorFormatTextExample = (props: {
	mentionPlugin?: { resetTextFormatAfterTransform?: boolean };
}): ReactElement => {
	const mentionPluginConfig: MentionPluginProps = {
		suggestions: [
			{
				name: "A12W",
				value: "Widgets"
			},
			{
				name: "A12P",
				value: "Plasma"
			},
			{
				name: "mgm",
				value: "mgm-tp"
			}
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

export const ReadonlyEditorExample = (props: Partial<RichTextEditorProps>): ReactElement => {
	return (
		<RichTextEditor
			initialConfig={{
				namespace: "Readonly Rich Text Editor Test",
				...props.initialConfig
			}}
			id="readonly-test-editor"
			label="Readonly Test Editor"
			labelGraphic={<Icon>lock</Icon>}
			placeholder="This should not be editable when readonly..."
			readonly={true}
			{...props}
		/>
	);
};

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

export const ReadonlyEditorWithSpellCheckExample = (props: Partial<RichTextEditorProps>): ReactElement => {
	return (
		<RichTextEditor
			initialConfig={{
				namespace: "Readonly with SpellCheck Test",
				...props.initialConfig
			}}
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
};
