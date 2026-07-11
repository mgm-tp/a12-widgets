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

import { ExternalLink, Link, BulletList } from "@com.mgmtp.a12.widgets/widgets-core";
import RichTextEditorAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/rich-text-editor/main/rich-text-editor.api.json" with { type: "json" };
import DefaultRichTextEditorAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/rich-text-editor/main/wrapper/default-rich-text-editor.api.json" with { type: "json" };
import AutoLinkPluginAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/rich-text-editor/main/plugins/auto-link-plugin/auto-link.api.json" with { type: "json" };
import FollowLinkPopupPluginAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/rich-text-editor/main/plugins/follow-link-popup-plugin/follow-link-popup-plugin.api.json" with { type: "json" };
import MentionPluginAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/rich-text-editor/main/plugins/mentions-plugin/mention-plugin.api.json" with { type: "json" };
import OutputPluginAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/rich-text-editor/main/plugins/output-plugin/output-plugin.api.json" with { type: "json" };
import SpellCheckPluginAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/rich-text-editor/main/plugins/spell-check-plugin/spell-check-plugin.api.json" with { type: "json" };
import TooltipPluginAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/rich-text-editor/main/plugins/tooltip-plugin/tooltip-plugin.api.json" with { type: "json" };
import ToolbarButtonAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/rich-text-editor/main/plugins/static-toolbar-plugin/toolbar-button/toolbar-button.api.json" with { type: "json" };
import GroupButtonAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/rich-text-editor/main/plugins/static-toolbar-plugin/group-button/group-button.api.json" with { type: "json" };
import InlineButtonAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/rich-text-editor/main/plugins/static-toolbar-plugin/inline-button/inline-button.api.json" with { type: "json" };
import BlockButtonAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/rich-text-editor/main/plugins/static-toolbar-plugin/block-button/block-button.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";
import {
	StyledShowcaseBulletListInMessageBox,
	StyledShowcaseExternalLinkInMessageBox,
	StyledShowcaseLink
} from "../../helpers/showcase-styles.js";

import { Basic } from "./default-rich-text-editor/basic.js";
import { DefaultEditorCombination } from "./default-rich-text-editor/default-editor-combination.js";
import { StaticToolbarGroupPlugin } from "./static-toolbar-plugin/index.js";
import { MentionPluginShowcase } from "./mention-plugin/index.js";
import { LinkPlugin } from "./link-plugin/index.js";
import { SpellCheckPluginEditor } from "./spell-check-plugin/index.js";
import { TooltipPluginEditor } from "./tooltip-plugin/index.js";
import { HyphenToEnDashPluginEditor } from "./create-a-plugin/hyphen-to-en-dash-plugin-editor.js";
import { CreatingTextColorChangePluginEditor } from "./create-a-plugin/creating-text-color-plugin-editor.js";

import configurationView from "!../../helpers/configuration-view.tsx?raw";
import commonCode from "!./common.ts?raw";
import styleWrapper from "!./style/inline-styled-editor-wrapper.styled.tsx?raw";
import toolbarButton from "!./share/data.tsx?raw";
import basicCode from "!./default-rich-text-editor/basic.tsx?raw";
import HTMLOutputCode from "!./default-rich-text-editor/default-editor-combination.tsx?raw";
import staticToolbarGroupPluginCode from "!./static-toolbar-plugin/index.js?raw";
import mentionPluginCode from "!./mention-plugin/index.js?raw";
import linkPluginCode from "!./link-plugin/index.js?raw";
import spellCheckPluginEditorCode from "!./spell-check-plugin/index.js?raw";
import tooltipPluginEditorCode from "!./tooltip-plugin/index.js?raw";
import hyphenToEnDashPluginEditorCode from "!./create-a-plugin/hyphen-to-en-dash-plugin-editor.tsx?raw";
import creatingTextColorPluginEditorCode from "!./create-a-plugin/creating-text-color-plugin-editor.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Rich Text Editor",
		description: {
			info: (
				<>
					<p>
						The <strong>Rich Text Editor</strong> Widget is a highly performant and accessible text editor. It ships
						with a <strong>RichTextEditor</strong> as well as a <strong>DefaultRichTextEditor</strong>.
					</p>
					<p>
						The <strong>DefaultRichTextEditor</strong> is more accessible for beginners to work with because it's built
						on top of the <strong>RichTextEditor</strong> and takes care of the most essential nodes and plugins for
						you. For more detailed instructions on how to use the <strong>DefaultRichTextEditor</strong>, check out the{" "}
						<Link href="#/widgets/data-entry/rich-text-editor/default#combination">combination section</Link>.
					</p>
					<p>
						Regardless of which one you choose, both the <strong>RichTextEditor</strong> and{" "}
						<strong>DefaultRichTextEditor</strong> are highly configurable. We provide several preexisting nodes and
						plugins as well as the ability to{" "}
						<Link href="#/widgets/data-entry/rich-text-editor/plugin-creation">create your own plugins</Link>.
					</p>
					<p>
						The <strong>Rich Text Editor</strong> was built on top of the <strong>Text Field</strong> and for this
						reason, it inherits several general features from the Text Field such as states, messages, helper text, etc.
						Visit <Link href="#/widgets/data-entry/text-field">Text Field</Link> to see these common features demoed.
					</p>
				</>
			),
			note: (
				<StyledShowcaseBulletListInMessageBox>
					<BulletList.Item>
						To use the standard theme for Rich Text Editor, you need to import the CSS file:
						<p>
							<code>import "@com.mgmtp.a12.widgets/widgets-core/styles/rich-text-editor.css";</code>
						</p>
					</BulletList.Item>
					<BulletList.Item>
						To see more customization and theming configuration, visit{" "}
						<StyledShowcaseExternalLinkInMessageBox href="https://lexical.dev/docs/getting-started/theming">
							Theming
						</StyledShowcaseExternalLinkInMessageBox>
						.
					</BulletList.Item>
				</StyledShowcaseBulletListInMessageBox>
			)
		},
		sections: {
			basic: {
				label: "Default",
				sections: [
					{
						label: "Basic",
						description: (
							<>
								<p>
									The <code>DefaultRichTextEditor</code> is capable of quite a lot! You have the standard properties
									found across much of the Widgets library such as <code>helperText</code> which can be used to add
									additional information under the editor, <code>labelGraphic</code> for adding a graphic image next to
									the editor's label, and <code>hideLabel</code> for hiding the label of the editor.
								</p>
								<p>
									Do note, however, that if you use <code>hideLabel</code>, you should still give your editor a
									descriptive label text to support accessibility best practices.
								</p>
								<p>
									There are also properties like <code>minHeight</code>, <code>maxHeight</code>, and{" "}
									<code>autoExpand</code> for controlling the height of the editor, <code>readOnly</code> and{" "}
									<code>disabled</code> for modifying the state of the editor.
								</p>
								<p>
									Of course, the real power of the editor shines when you start to take advantage of its various
									plugins. The editor below utilizes the <strong>Static Toolbar Plugin</strong> to enable font italics,
									bolding, underlining, strikethrough, and a number of other formatting options.
								</p>
								<p>
									To view more information on how the Static Toolbar works as well as see our other ready-made plugins,
									be sure to check out our{" "}
									<Link href="#/widgets/data-entry/rich-text-editor/pre-built-plugins">full list of plugins</Link>.
								</p>
							</>
						),
						content: <Basic />,
						code: [
							{ name: "basic.tsx", code: basicCode },
							{ name: "style.ts", code: styleWrapper },
							{ name: "toolbarButton.ts", code: toolbarButton },
							{ name: "configuration-view.tsx", code: configurationView }
						],
						useConfiguration: true,
						toggleBetweenPartialAndFullCode: true
					},
					{
						label: "Combination",
						description: (
							<>
								<p>
									We've already mentioned that it's possible to create and add your own{" "}
									<Link href="#/widgets/data-entry/rich-text-editor/plugin-creation">plugins</Link> to the editor. For
									your convenience, however, we've also provided pre-defined plugins inside of the{" "}
									<code>DefaultRichTextEditor</code> that you can easily use by configuring properties.
								</p>
								<BulletList.Unordered>
									<BulletList.Item>
										<code>outputConfig</code>: Displays HTML output from the editor (demoed below).
									</BulletList.Item>
									<BulletList.Item>
										<code>mentionPluginConfig</code>: Adds a mention feature for tagging (
										<Link href="#/widgets/data-entry/rich-text-editor/pre-built-plugins#mentions-plugin">
											learn more
										</Link>
										). The trigger character is <strong>@</strong> by default.
									</BulletList.Item>
									<BulletList.Item>
										<code>linkPluginConfig</code>: Provides custom link detection (
										<Link href="#/widgets/data-entry/rich-text-editor/pre-built-plugins#links-plugin">learn more</Link>
										). This example shows you how to create a link with custom term. For example, type{" "}
										<strong>A12W-123</strong> will become a link and refer to{" "}
										<Link href="https://example.com/A12W-123">https://example.com/A12W-123</Link>. You can also type
										anything in link format, e.g. "google.com"
									</BulletList.Item>{" "}
									<BulletList.Item>
										<code>spellCheckPluginConfig</code>: Provides a custom spell checking and allows you to apply styles
										to indicate misspellings (
										<Link href="#/widgets/data-entry/rich-text-editor/pre-built-plugins#spell-check-plugin">
											learn more
										</Link>
										). For instance, when you type <strong>javescript</strong> or <strong>developr</strong>, it will be
										highlighted as an misspelled word. Hovering over it will give you the option of adding that word to
										the dictionary.
									</BulletList.Item>{" "}
									<BulletList.Item>
										<code>tooltipPluginConfig</code>: Displays tooltips when terms you've specified are detected (
										<Link href="#/widgets/data-entry/rich-text-editor/pre-built-plugins#tooltip-plugin">
											learn more
										</Link>
										). In this example, <strong>example</strong> is a matched word which renders a tooltip when hovering
										over it.
									</BulletList.Item>
								</BulletList.Unordered>
								<p>
									For convenient debugging, we also provide the <strong>Tree View Plugin</strong> to visualize the
									editor’s internal node tree in real time. To play around with it, simply check the{" "}
									<strong>Enable Tree View Plugin</strong> option below.
								</p>
							</>
						),
						content: <DefaultEditorCombination />,
						useConfiguration: true,
						code: [
							{ name: "html-output.tsx", code: HTMLOutputCode },
							{ name: "style.ts", code: styleWrapper },
							{ name: "toolbarButton.ts", code: toolbarButton },
							{ name: "common.ts", code: commonCode }
						]
					}
				]
			},
			advanced: {
				label: "Pre-built Plugins",
				sections: [
					{
						label: "Static Toolbar Plugin",
						description: (
							<>
								<p>
									The Static Toolbar plugin uses the <code>staticToolbarButtons</code> property for configuration.
									Inside of <code>staticToolbarButtons</code> property you can define the structure you'd like your
									toolbar to have.
								</p>
								<p>You can create toolbar items by using the following built-in functions:</p>
								<BulletList.Unordered>
									<BulletList.Item>
										<code>createInlineButton</code>: Creates a button that handles interactions related to inline items.
									</BulletList.Item>
									<BulletList.Item>
										<code>createBlockButton</code>: Creates a button that handles interactions related to block items.
									</BulletList.Item>
									<BulletList.Item>
										<code>createButtonGroup</code>: Creates a group button that group other buttons into 1 group.
									</BulletList.Item>
								</BulletList.Unordered>
								<p>We also provide pre-built buttons for a number of common functionalities:</p>
								<BulletList.Unordered>
									<BulletList.Item>
										Bolding via the <code>BoldButton</code>.
									</BulletList.Item>
									<BulletList.Item>
										Italics via the <code>ItalicButton</code>.
									</BulletList.Item>
									<BulletList.Item>
										Underlines via the <code>UnderlineButton</code>.
									</BulletList.Item>
									<BulletList.Item>
										Bulleted and numbered lists via the <code>BulletListButton</code> and <code>NumberListButton</code>.
									</BulletList.Item>
									<BulletList.Item>
										List indents via the <code>IndentDecreaseButton</code> and <code>IndentDecreaseButton</code>.
									</BulletList.Item>
									<BulletList.Item>
										Text alignment via the <code>AlignButtonGroup</code>.
									</BulletList.Item>
									<BulletList.Item>
										Separator elements via the <code>Separator</code>.
									</BulletList.Item>
								</BulletList.Unordered>
								<p>
									Some buttons need to be used alongside certain plugins in order to work correctly. Those plugins have
									already been added to the <code>DefaultRichTextEditor</code>.
								</p>
								<BulletList.Unordered>
									<BulletList.Item>
										The <code>createInlineButton</code> needs the <code>TextFormatPlugin</code>.
									</BulletList.Item>{" "}
									<BulletList.Item>
										The <code>BulletListButton</code>, <code>NumberListButton</code>, <code>IndentDecreaseButton</code>,
										and <code>IndentIncreaseButton</code> require the presence of the <code>ListPlugin</code>.
									</BulletList.Item>
								</BulletList.Unordered>
							</>
						),
						content: <StaticToolbarGroupPlugin />,
						code: [
							{ name: "static-toolbar.tsx", code: staticToolbarGroupPluginCode },
							{ name: "style.ts", code: styleWrapper },
							{ name: "toolbarButton.ts", code: toolbarButton }
						]
					},
					{
						label: "Mentions Plugin",
						description: (
							<>
								<p>
									The Mentions plugin can help you to easily add mention tags to your editor. When users type the{" "}
									<strong>@</strong> key, they'll be prompted with a list of suggestions. These suggestions come from
									the array passed into the <code>suggestions</code> property of the <code>MentionPlugin</code>{" "}
									component.
								</p>
								<p>
									To filter suggestions as the user types, you can pass a function with custom logic to{" "}
									<code>onSearchChange</code>.
								</p>
							</>
						),
						content: <MentionPluginShowcase />,
						code: { name: "mention-plugin.tsx", code: mentionPluginCode }
					},
					{
						label: "Links Plugin",
						description: (
							<p>
								The <strong>Links</strong> plugin is our recommended solution for detecting links. A useful feature of
								this plugin is that it allows you to use <strong>regex</strong> to detect <code>customTerms</code> and
								apply links to them. This could be useful if you often work with things that have a common format such
								as project tickets.
							</p>
						),
						content: <LinkPlugin />,
						code: { name: "link-plugin.tsx", code: linkPluginCode }
					},
					{
						label: "Spell Check Plugin",
						description: {
							info: (
								<>
									<p>
										If words are spelled incorrectly within the editor, the Spell Check plugin can help you apply styles
										to indicate the misspellings. If a word has incorrectly been identified as misspelled, hovering over
										said word will give you the option of adding it to the <code>dictionary</code>.
									</p>
									<p>
										This can be useful for words such as names that may often be incorrectly identified as misspellings.
										To test this plugin, enter 'developr' or 'javescript' (without the quotes) to see an example of a
										word being identified as a misspelling.
									</p>
								</>
							),
							note: <p>You need to define the logic for determining whether a word is misspelled or not.</p>
						},
						content: <SpellCheckPluginEditor />,
						code: [
							{ name: "spell-check.tsx", code: spellCheckPluginEditorCode },
							{ name: "common.ts", code: commonCode }
						]
					},
					{
						label: "Tooltip Plugin",
						description: {
							info: (
								<>
									<p>
										The Tooltip plugin allows you add tooltips that appear when certain <code>customTerms</code> are
										entered into the editor. In the example below, we've configured it so that a tooltip appears when
										you type 'example'.
									</p>
									<p>
										You can pass <code>"focus"</code> to the <code>triggerMode</code> property so that the tooltip
										appears automatically while the editor is focused (as we've done below). Otherwise, the{" "}
										<code>triggerMode</code> will default to <code>"hover"</code> and a tooltip will only appear if you
										hover over one of the <code>customTerms</code>.
									</p>
								</>
							),
							note: (
								<>
									<p>
										If you want to display a tooltip for a specific text node, add the{" "}
										<code>editorThemeClasses.withDefaultTooltip</code> class to the node and provide{" "}
										<code>customTerms</code> without the regex.
									</p>
									<p>This plugin does not fully support accessibility.</p>
								</>
							)
						},
						content: <TooltipPluginEditor />,
						code: { name: "tooltip-plugin.tsx", code: tooltipPluginEditorCode }
					}
				]
			},
			complex: {
				label: "Plugin Creation",
				sections: [
					{
						label: "Lexical",
						description: (
							<p>
								The Widget Rich Text Editor was built on top of{" "}
								<ExternalLink href="https://lexical.dev/">Lexical</ExternalLink>. To create customized features you'll
								need to understand core Lexical concepts such as{" "}
								<ExternalLink href="https://lexical.dev/docs/concepts/editor-state">Editor State</ExternalLink>, and{" "}
								<ExternalLink href="https://lexical.dev/docs/concepts/nodes">Nodes</ExternalLink>. For that reason, we
								recommend perusing the <ExternalLink href="https://lexical.dev/docs/intro">Lexical Docs</ExternalLink>.
							</p>
						)
					},
					{
						label: "Creating Plugins",
						description: (
							<>
								<p>
									Nodes and plugins can be used to add customized features to the Widgets{" "}
									<code>DefaultRichTextEditor</code> and/or <code>RichTextEditor</code>.
								</p>
								<p>
									At their core, Lexical Plugins are just React Components. If you're already comfortable with Lexical
									and are just looking for how to create Lexical plugins using React, we recommend taking a look at{" "}
									<ExternalLink href="https://lexical.dev/docs/react/create_plugin">this guide</ExternalLink>.
								</p>
								<p>
									Otherwise, we recommend taking some time to familiarize yourself with the following concepts before
									getting started:
								</p>
								<BulletList.Unordered>
									<BulletList.Item>
										<ExternalLink href="https://lexical.dev/docs/concepts/nodes">Nodes</ExternalLink>
									</BulletList.Item>
									<BulletList.Item>
										<ExternalLink href="https://lexical.dev/docs/concepts/node-replacement">
											Node Overrides
										</ExternalLink>
									</BulletList.Item>
									<BulletList.Item>
										<ExternalLink href="https://lexical.dev/docs/concepts/transforms">Node Transforms</ExternalLink>
									</BulletList.Item>
									<BulletList.Item>
										<ExternalLink href="https://lexical.dev/docs/concepts/listeners">Listeners</ExternalLink>
									</BulletList.Item>
									<BulletList.Item>
										<ExternalLink href="https://lexical.dev/docs/concepts/commands">Commands</ExternalLink>
									</BulletList.Item>
									<BulletList.Item>
										<ExternalLink href="https://lexical.dev/docs/concepts/dom-events">DOM Events</ExternalLink>
									</BulletList.Item>
								</BulletList.Unordered>
							</>
						)
					},
					{
						label: "Hyphen to En Dash Plugin",
						description: <p>This plugin converts hyphens to en dashes.</p>,
						content: <HyphenToEnDashPluginEditor />,
						code: { name: "hyphen-to-en-dash.tsx", code: hyphenToEnDashPluginEditorCode }
					},
					{
						label: "Text Color Changer Plugin",
						description: {
							info: (
								<>
									<p>
										This plugin utilizes <code>decorators</code> (a type of node) to change the color of selected text
										within the editor. Decorators allow you to build complex features by using custom React components
										within the editor.
									</p>
									<p>
										While decorators can be used to build features by outputting components from JavaScript, React, and
										other frameworks, for most simple features such as bolding or changing the color of text, we would
										recommend using the
										<Link href="#/widgets/data-entry/rich-text-editor/pre-built-plugins#static-toolbar-plugin">
											{" "}
											Static Toolbar
										</Link>{" "}
										instead.
									</p>
								</>
							),
							note: (
								<p>
									This is a simplified example that’s only meant to demonstrate how you’d you implement a custom feature
									using decorators. For that reason, some edge cases such as trying to undo actions using{" "}
									<strong>ctrl/cmd + z</strong> or changing the selected text may result in unexpected behaviors.
								</p>
							)
						},
						content: <CreatingTextColorChangePluginEditor />,
						code: { name: "create-text-color-plugin.tsx", code: creatingTextColorPluginEditorCode }
					}
				]
			}
		}
	}
];

export default {
	label: "Rich Text Editor",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{ declaration: RichTextEditorAPI },
			{ declaration: DefaultRichTextEditorAPI },
			{ declaration: ToolbarButtonAPI },
			{ declaration: InlineButtonAPI },
			{ declaration: BlockButtonAPI },
			{ declaration: GroupButtonAPI },
			{ declaration: AutoLinkPluginAPI },
			{ declaration: FollowLinkPopupPluginAPI },
			{ declaration: MentionPluginAPI },
			{ declaration: OutputPluginAPI },
			{ declaration: SpellCheckPluginAPI },
			{ declaration: TooltipPluginAPI }
		],
		themingConfiguration: "richTextEditor",
		inheritedThemeConfigurationNote: (
			<>
				<p>
					The <strong>Rich Text Editor</strong> has build-in styles for editor content, for getting these styles apply
					to the editor, you need to import build in css file to your application by adding this line of code:
					<p>
						<code>import "@com.mgmtp.a12.widgets/widgets-core/styles/rich-text-editor.css";</code>
					</p>
				</p>
				<p>
					Since the <strong>Plugin Editor</strong> is an accessible text editor, it inherits the style configurations of
					several widgets:{" "}
					<StyledShowcaseLink href="#/widgets/data-entry/text-area#text-area-theme-configuration">
						Text Area
					</StyledShowcaseLink>
					,{" "}
					<StyledShowcaseLink href="#/widgets/general/buttons/button#buttons-theme-configuration">
						Button
					</StyledShowcaseLink>
					,{" "}
					<StyledShowcaseLink href="#/widgets/general/popup-menu#popup-menu-theme-configuration">
						Popup Menu
					</StyledShowcaseLink>
					.
				</p>
			</>
		)
	}
};
