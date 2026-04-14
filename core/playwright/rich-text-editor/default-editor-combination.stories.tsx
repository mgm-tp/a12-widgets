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

import type { FC, ReactNode } from "react";
import { useState, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";

import {
	BoldButton,
	ItalicButton,
	UnderlineButton
} from "../../src/rich-text-editor/main/plugins/static-toolbar-plugin/inline-button/inline-default-button.js";
import { DefaultRichTextEditor } from "../../src/rich-text-editor/main/wrapper/default-rich-text-editor.view.js";
import { Button } from "../../src/button/main/button.view.js";
import { Icon } from "../../src/icon/main/icon.view.js";
import { Checkbox } from "../../src/input/checkbox/main/checkbox.view.js";
import type { LinkPluginConfig } from "../../src/rich-text-editor/main/wrapper/default-rich-text-editor.api.js";
import type {
	InlineButtonProps,
	LinkDecoratorProps,
	MentionPluginProps,
	TooltipPluginConfig
} from "../../src/rich-text-editor/index.js";
import {
	$splitText,
	InlineStyleTextNode,
	createButtonGroup,
	createInlineButton,
	editorThemeClasses,
	NumberListButton,
	$isInlineStyleTextNode,
	MentionNode
} from "../../src/rich-text-editor/index.js";
import { ExternalLink } from "../../src/link/main/external-link/external-link.view.js";
import { InteractionHintConfigProvider } from "../../src/interaction-hint/main/interaction-hint-context.js";

interface DefaultEditorCombinationProps {
	hasMentionPlugin?: boolean;
	hasAutoLinkPlugin?: boolean;
	hasTooltipPlugin?: boolean;
	hasTooltipForMentionPlugin?: boolean;
	hasUnmergeablePlugin?: boolean;
}

const UnmergeablePlugin: FC = () => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		return editor.registerNodeTransform(InlineStyleTextNode, (node: InlineStyleTextNode) => {
			const text = node.getTextContent();

			if (!text.includes(" ") || text.length === 1) {
				return;
			}

			// Find all space positions
			const splitPoints: number[] = [];

			for (let i = 0; i < text.length; i++) {
				if (text[i] === " ") {
					// Split before and after each space
					if (i > 0) {
						splitPoints.push(i);
					}

					if (i < text.length - 1) {
						splitPoints.push(i + 1);
					}
				}
			}

			// Found spaces, split the text
			if (splitPoints.length > 0) {
				// Remove duplicates and sort
				const uniqueSplitPoints = [...new Set(splitPoints)].sort((a, b) => a - b);

				// Split the text at all points
				const newNodes = $splitText(node, ...uniqueSplitPoints);

				// Mark space nodes as unmergeable
				newNodes.forEach((newNode) => {
					if ($isInlineStyleTextNode(newNode) && newNode.getTextContent() === " ") {
						newNode.setUnmergeable();
					}
				});
			}
		});
	}, [editor]);

	return null;
};

export const DefaultEditorCombination = ({
	hasMentionPlugin,
	hasAutoLinkPlugin,
	hasTooltipPlugin,
	hasTooltipForMentionPlugin,
	hasUnmergeablePlugin
}: DefaultEditorCombinationProps): ReactNode => {
	const [enableUnmergeable, setEnableUnmergeable] = useState(false);

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
		]
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

	const tooltipPluginConfig: TooltipPluginConfig = {
		triggerMode: "focus",
		customTerms: [
			{
				regex: /\bexample-tooltip\b/,
				render: () => (
					<ExternalLink target="_blank" href="https://example.com/">
						Go to the example homepage
					</ExternalLink>
				)
			},
			{
				render: () => <>Default Tooltip</>
			}
		]
	};

	const formatTextType: InlineButtonProps[] = [
		{
			nodeClassName: "editor-text-strikethrough",
			label: "Strikethrough"
		},
		{
			nodeClassName: "editor-text-monospace",
			label: "Monospace"
		}
	];

	const customInlineButtons = formatTextType.map((format: InlineButtonProps) => {
		return createInlineButton({
			nodeClassName: format.nodeClassName,
			label: (
				<span className={`${format.nodeClassName}`}>
					{(format.label as string)?.replace(/\b\w/g, (c) => c.toUpperCase())}
				</span>
			),
			className: format.nodeClassName
		});
	});

	const TextFormatButtonGroup = createButtonGroup({
		icon: <Icon>text_format</Icon>,
		buttons: customInlineButtons,
		title: "More"
	});

	const BUTTONS = [BoldButton, ItalicButton, UnderlineButton, NumberListButton, TextFormatButtonGroup];

	return (
		<>
			{hasUnmergeablePlugin && (
				<Checkbox label="Enable Unmergeable" checked={enableUnmergeable} onChange={setEnableUnmergeable} />
			)}
			<InteractionHintConfigProvider componentConfigs={{ iconButton: false }}>
				<DefaultRichTextEditor
					initialConfig={{ namespace: "HTML output" }}
					id="default-editor-html-output"
					placeholder="Type anything..."
					mentionPluginConfig={hasMentionPlugin ? mentionPluginConfig : undefined}
					staticToolbarButtons={BUTTONS}
					linkPluginConfig={hasAutoLinkPlugin ? linkPluginConfig : undefined}
					tooltipPluginConfig={hasTooltipPlugin ? tooltipPluginConfig : undefined}
				>
					{hasTooltipForMentionPlugin && <TooltipForMentionPlugin />}
					{hasUnmergeablePlugin && enableUnmergeable && <UnmergeablePlugin />}
				</DefaultRichTextEditor>
			</InteractionHintConfigProvider>
		</>
	);
};

const TooltipForMentionPlugin = (): ReactNode => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		return editor.registerMutationListener(
			MentionNode,
			(mutatedNodes) => {
				editor.update(() => {
					for (const [nodeKey, mutation] of mutatedNodes) {
						if (mutation === "created") {
							const node = $getNodeByKey(nodeKey);

							if ($isInlineStyleTextNode(node)) {
								node.addSelectedStyleName(editorThemeClasses.withDefaultTooltipWord);
							}
						}
					}
				});
			},
			{ skipInitialization: false }
		);
	}, [editor]);

	return <></>;
};
