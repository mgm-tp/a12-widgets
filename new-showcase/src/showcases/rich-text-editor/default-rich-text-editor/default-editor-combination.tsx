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
import { useMemo, useState } from "react";
import DOMPurify from "dompurify";
import "@com.mgmtp.a12.widgets/widgets-core/styles/rich-text-editor.css";
import { debounce } from "lodash-es";

import type {
	LinkDecoratorProps,
	MentionPluginProps,
	TooltipPluginConfig,
	LinkPluginConfig,
	SpellCheckPluginConfig
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Icon,
	DefaultRichTextEditor,
	Button,
	ExternalLink,
	Checkbox,
	TreeViewPlugin
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../../helpers/configuration-view.js";

import { EditorStyle } from "../style/inline-styled-editor-wrapper.styled.js";
import { BUTTONS } from "../share/data.js";
import { handleSpellCheck } from "../common.js";

export const DefaultEditorCombination: FC = () => {
	const [editorHtml, setEditorHtml] = useState("");
	const [dictionary, setDictionary] = useState<string[]>([]);
	const [enableTreeView, setEnableTreeView] = useState(false);

	const mentionPluginConfig: MentionPluginProps = useMemo(
		() => ({
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
		}),
		[]
	);

	const linkPluginConfig: LinkPluginConfig = useMemo(
		() => ({
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
		}),
		[]
	);

	const spellCheckPluginConfig: SpellCheckPluginConfig = useMemo(
		() => ({
			spellCheck: handleSpellCheck(dictionary),
			render: (text) => (
				<Button
					primary
					className="h_blueBG"
					label="Add to dictionary"
					onClick={(): void => setDictionary([...dictionary, text])}
				/>
			)
		}),
		[dictionary]
	);

	const tooltipPluginConfig: TooltipPluginConfig = useMemo(
		() => ({
			triggerMode: "focus",
			customTerms: [
				{
					regex: /\bexample\b/,
					render: () => (
						<ExternalLink target="_blank" href="https://example.com/">
							Go to the example homepage
						</ExternalLink>
					)
				}
			]
		}),
		[]
	);

	// Debounce the editor's change handler to prevent lag while typing.
	const debouncedChangeHandler = useMemo(
		() =>
			debounce((htmlString: string) => {
				setEditorHtml(htmlString);
			}, 300),
		[]
	);

	return (
		<ConfigurationView
			configuration={
				<div className="-u-flex -u-flex-row -u-justify-end -u-items-center">
					<Checkbox label="Enable Tree View Plugin" checked={enableTreeView} onChange={setEnableTreeView} />
				</div>
			}
		>
			<div className="-u-width-full">
				<EditorStyle />
				<DefaultRichTextEditor
					initialConfig={{ namespace: "HTML output" }}
					id="default-editor-html-output"
					label="Editor with HTML Output"
					labelGraphic={<Icon>info</Icon>}
					placeholder="Type anything..."
					staticToolbarButtons={BUTTONS}
					outputConfig={{
						onChange: debouncedChangeHandler
					}}
					mentionPluginConfig={mentionPluginConfig}
					linkPluginConfig={linkPluginConfig}
					spellCheckPluginConfig={spellCheckPluginConfig}
					tooltipPluginConfig={tooltipPluginConfig}
				>
					{enableTreeView && <TreeViewPlugin />}
				</DefaultRichTextEditor>
				<p>As you make changes to the editor's content, the HTML output will appear below.</p>
				<div
					dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(editorHtml) ?? "" }}
					style={{ padding: "7px 12px 5px", minHeight: 100 }}
					className="-u-break-words -sc-helper-border"
				/>
			</div>
		</ConfigurationView>
	);
};
