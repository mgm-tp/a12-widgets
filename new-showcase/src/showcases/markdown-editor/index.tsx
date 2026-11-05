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

import basicCode from "!./basic.tsx?raw";
import customToolbarCode from "!./custom-toolbar.tsx?raw";
import editorHandleCode from "!./editor-handle.tsx?raw";
import extensionsGuide from "!./extensions.md?raw";
import imageUploadCode from "!./image-upload.tsx?raw";
import overview from "!./index.md?raw";
import infoPanelCode from "!./info-panel.tsx?raw";
import spoilerExtensionCode from "!./spoiler-extension.tsx?raw";
import wordCountPluginCode from "!./word-count-plugin.tsx?raw";

import MarkdownEditorAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/markdown-editor/main/markdown-editor.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";
import { MarkdownViewer } from "../../helpers/markdown-viewer.js";

import { MarkdownEditorBasic } from "./basic.js";
import { MarkdownEditorCustomToolbar } from "./custom-toolbar.js";
import { MarkdownEditorHandleExample } from "./editor-handle.js";
import { MarkdownEditorImageUpload } from "./image-upload.js";
import { MarkdownEditorInfoPanel } from "./info-panel.js";
import { MarkdownEditorSpoilerExtension } from "./spoiler-extension.js";
import { MarkdownEditorWordCountPlugin } from "./word-count-plugin.js";

const showcases: Showcase[] = [
	{
		label: "Markdown Editor",
		description: <MarkdownViewer source={overview} />,
		sections: {
			basic: {
				label: "Basics",
				sections: [
					{
						label: "Basic",
						description: (
							<p>
								Type rich text and watch the Markdown below the editor. The mode menu at the end of the toolbar flips
								between <strong>Edit</strong>, <strong>Source</strong> and <strong>Preview</strong>. In source mode the
								toolbar works on the raw Markdown: select some text, click a control, and it wraps or inserts the
								matching syntax.
							</p>
						),
						content: <MarkdownEditorBasic />,
						code: { name: "basic.tsx", code: basicCode }
					},
					{
						label: "Custom toolbar",
						description: (
							<p>
								The <code>toolbar</code> prop swaps the built-in toolbar for your own composition of{" "}
								<code>MarkdownEditor.*</code> controls. The built-in ones wire themselves up. Your own control is{" "}
								<code>MarkdownEditor.ToolbarButton</code>; its <code>onClick</code> receives the toolbar context and has
								to handle source mode, where the document is plain text.
							</p>
						),
						content: <MarkdownEditorCustomToolbar />,
						code: { name: "custom-toolbar.tsx", code: customToolbarCode }
					},
					{
						label: "Editor handle",
						description: {
							info: (
								<p>
									<code>editorRef</code> gives your application a handle on the editor: insert Markdown at the caret,
									read the selection as Markdown, focus, undo and redo. Every method works on the surface the user can
									see, so the same code serves edit and source mode.
								</p>
							),
							note: (
								<p>
									<code>onChange</code> is debounced by default. Call <code>flush()</code> before a save that does not
									go through a blur, such as a keyboard shortcut or an autosave timer.
								</p>
							)
						},
						content: <MarkdownEditorHandleExample />,
						code: { name: "editor-handle.tsx", code: editorHandleCode }
					}
				]
			},
			advanced: {
				label: "Extensions",
				description: <MarkdownViewer source={extensionsGuide} />,
				sections: [
					{
						label: "Info panels",
						description: {
							info: (
								<p>
									<code>MdastInfoPanelExtension</code> ships with the library and adds <code>:::info</code>,{" "}
									<code>:::note</code>, <code>:::success</code>, <code>:::warning</code> and <code>:::error</code>{" "}
									panels. It brings its own toolbar menu, which you pick up with <code>useExtensionComponent</code> and
									place in a custom toolbar.
								</p>
							),
							note: (
								<p>
									<code>InfoPanelHostContext</code> carries application data into the extension: here it limits which
									panel types the menu offers. This is the host bridge pattern described above, ready to use.
								</p>
							)
						},
						content: <MarkdownEditorInfoPanel />,
						code: { name: "info-panel.tsx", code: infoPanelCode }
					},
					{
						label: "Image upload",
						description: {
							info: (
								<p>
									The editor can only embed an image whose URL it already has. Uploading a file needs a backend, so the
									library ships the two halves and you provide the handler: <code>ImageUploadExtension</code> in{" "}
									<code>extensions</code> owns the placeholder node, <code>ImageUploadPlugin</code> in{" "}
									<code>plugins</code> does the dropping, pasting and uploading. <code>ImageUploadButton</code> is a
									toolbar control whose dialog also offers a file picker.
								</p>
							),
							note: (
								<p>
									Anything that may change at runtime, like the upload handler or the size limit, is a plugin prop. A
									new value reaches the next upload without rebuilding the editor.
								</p>
							)
						},
						content: <MarkdownEditorImageUpload />,
						code: { name: "image-upload.tsx", code: imageUploadCode }
					},
					{
						label: "Your own extension",
						description: {
							info: (
								<p>
									A complete extension in one file: a <code>TextNode</code> subclass, an import rule that claims the{" "}
									<code>:spoiler[…]</code> text directive, and an export rule that writes it back. Edit the text inside
									a spoiler, then switch to <strong>Source</strong> to see the round trip.
								</p>
							),
							warning: (
								<p>
									Keep the <code>extensions</code> array at module scope. A new array builds a new editor and throws
									away any edit <code>onChange</code> has not seen yet.
								</p>
							)
						},
						content: <MarkdownEditorSpoilerExtension />,
						code: { name: "spoiler-extension.tsx", code: spoilerExtensionCode }
					},
					{
						label: "Word count plugin",
						description: (
							<p>
								A <strong>plugin</strong> adds behavior rather than content. It is a component passed to{" "}
								<code>plugins</code>, rendered inside the editor, and it stays mounted across mode switches. This one
								reads both surfaces through <code>useMarkdownEditorSurfaces</code> and reports the word count back to
								the page.
							</p>
						),
						content: <MarkdownEditorWordCountPlugin />,
						code: { name: "word-count-plugin.tsx", code: wordCountPluginCode }
					}
				]
			}
		}
	}
];

export default {
	label: "Markdown Editor",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: MarkdownEditorAPI }],
		themingConfiguration: "markdownEditor"
	}
};
