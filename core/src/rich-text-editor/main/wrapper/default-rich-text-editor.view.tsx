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

import type { FC } from "react";
import { useMemo } from "react";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import merge from "deepmerge";

import { RichTextEditor } from "../rich-text-editor.view.js";
import { ListPlugin } from "../plugins/list-plugin/list-plugin.js";
import { MentionPlugin } from "../plugins/mentions-plugin/mention-plugin.js";
import { AutoLinkPlugin } from "../plugins/auto-link-plugin/auto-link-plugin.js";
import { createFollowLinkPopupPlugin } from "../plugins/follow-link-popup-plugin/follow-link-plugin.js";
import { createSpellCheckPlugin } from "../plugins/spell-check-plugin/spell-check-plugin.js";
import { createTooltipPlugin } from "../plugins/tooltip-plugin/tooltip-plugin.js";
import { OutputPlugin } from "../plugins/output-plugin/output-plugin.view.js";
import { MentionNode } from "../nodes/mention-node.js";

import type { DefaultRichTextEditorProps } from "./default-rich-text-editor.api.js";

export const DefaultRichTextEditor: FC<DefaultRichTextEditorProps> = (props) => {
	const {
		mentionPluginConfig,
		linkPluginConfig,
		tooltipPluginConfig,
		spellCheckPluginConfig,
		outputConfig,
		onChange,
		initialConfig,
		children,
		staticToolbarButtons: staticToolbarButtonsProp,
		...rest
	} = props;

	const { FollowLinkPopupPlugin, FollowLinkPopup } = useMemo(
		() =>
			createFollowLinkPopupPlugin({
				render: linkPluginConfig?.popupRenderer
			}),
		[linkPluginConfig?.popupRenderer]
	);

	const SpellCheck = useMemo(() => {
		return (
			spellCheckPluginConfig?.spellCheck &&
			createSpellCheckPlugin({
				spellCheck: spellCheckPluginConfig.spellCheck
			})
		);
	}, [spellCheckPluginConfig?.spellCheck]);

	const { TooltipPopup, TooltipPlugin } = useMemo(
		() =>
			createTooltipPlugin({
				customTerms: tooltipPluginConfig?.customTerms,
				triggerMode: tooltipPluginConfig?.triggerMode
			}),
		[tooltipPluginConfig]
	);

	const defaultRichTextConfig: Partial<InitialConfigType> = useMemo(() => {
		const config: Partial<InitialConfigType> = {
			nodes: [AutoLinkNode, LinkNode, MentionNode]
		};

		if (initialConfig) {
			return merge(config, initialConfig);
		}

		return config;
	}, [initialConfig]);

	const staticToolbarButtons = useMemo(
		() => (rest.readonly || rest.disabled ? undefined : staticToolbarButtonsProp),
		[rest.readonly, rest.disabled, staticToolbarButtonsProp]
	);

	return (
		<RichTextEditor initialConfig={defaultRichTextConfig} staticToolbarButtons={staticToolbarButtons} {...rest}>
			<ListPlugin />
			{onChange && <OnChangePlugin onChange={onChange} />}
			{mentionPluginConfig && <MentionPlugin {...mentionPluginConfig} />}
			{linkPluginConfig?.popupRenderer && (
				<FollowLinkPopupPlugin>
					<FollowLinkPopup />
				</FollowLinkPopupPlugin>
			)}
			{SpellCheck && (
				<SpellCheck.SpellCheckPlugin>
					{spellCheckPluginConfig?.render && SpellCheck.SpellCheckPopup && (
						<SpellCheck.SpellCheckPopup render={spellCheckPluginConfig.render} />
					)}
				</SpellCheck.SpellCheckPlugin>
			)}

			{tooltipPluginConfig && (
				<TooltipPlugin>
					<TooltipPopup />
				</TooltipPlugin>
			)}
			{linkPluginConfig && <AutoLinkPlugin {...linkPluginConfig} />}
			{outputConfig && <OutputPlugin {...outputConfig} />}
			{children}
		</RichTextEditor>
	);
};

DefaultRichTextEditor.displayName = "DefaultRichTextEditor";
