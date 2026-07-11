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

import { Button } from "../../button/main/button.view.js";
import { Icon } from "../../icon/main/icon.view.js";
import { Checkbox } from "../../input/checkbox/main/checkbox.view.js";
import { ExternalLink } from "../../link/main/external-link/external-link.view.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";

import { DefaultRichTextEditor } from "../main/wrapper/default-rich-text-editor.view.js";
import type { LinkPluginConfig } from "../main/wrapper/default-rich-text-editor.api.js";
import type { InlineButtonProps, LinkDecoratorProps, MentionPluginProps, TooltipPluginConfig } from "../index.js";
import {
	$isInlineStyleTextNode,
	$splitText,
	createButtonGroup,
	createInlineButton,
	editorThemeClasses,
	InlineStyleTextNode,
	MentionNode,
	NumberListButton
} from "../index.js";
import {
	BoldButton,
	ItalicButton,
	UnderlineButton
} from "../main/plugins/static-toolbar-plugin/inline-button/inline-default-button.js";

export interface DefaultEditorCombinationProps {
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

			const splitPoints: number[] = [];

			for (let i = 0; i < text.length; i++) {
				if (text[i] === " ") {
					if (i > 0) {
						splitPoints.push(i);
					}

					if (i < text.length - 1) {
						splitPoints.push(i + 1);
					}
				}
			}

			if (splitPoints.length > 0) {
				const uniqueSplitPoints = [...new Set(splitPoints)].sort((a, b) => a - b);
				const newNodes = $splitText(node, ...uniqueSplitPoints);

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
			{ name: "A12W", value: "Widgets" },
			{ name: "A12P", value: "Plasma" },
			{ name: "mgm", value: "mgm-tp" }
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

	const customInlineButtons = (
		[
			{ nodeClassName: "editor-text-strikethrough", label: "Strikethrough" },
			{ nodeClassName: "editor-text-monospace", label: "Monospace" }
		] as InlineButtonProps[]
	).map((format) =>
		createInlineButton({
			nodeClassName: format.nodeClassName,
			label: (
				<span className={`${format.nodeClassName}`}>
					{(format.label as string)?.replace(/\b\w/g, (c) => c.toUpperCase())}
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
