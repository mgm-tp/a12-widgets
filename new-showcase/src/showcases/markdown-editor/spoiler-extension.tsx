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

import type { MdastExportHandler, MdastImportHandler } from "@lexical/mdast";
import { MdastImportExtension } from "@lexical/mdast";
import type { EditorConfig, NodeKey, SerializedTextNode } from "lexical";
import { $applyNodeReplacement, configExtension, defineExtension, TextNode } from "lexical";
import type { ReactElement } from "react";
import { useState } from "react";
import { css, styled } from "styled-components";

import type { TextDirective } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import {
	directiveImportType,
	MarkdownEditor,
	MdastUnknownDirectiveExtension
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";

/*
 * A spoiler: `:spoiler[the ending]` is blacked out until you hover it.
 *
 * Like every extension it has three parts: a node, an import rule and an export rule.
 */

// ---------------------------------------------------------------------------------------
// 1. The node — what a spoiler is while it is being edited.
//
// A `TextNode` subclass is the smallest node there is. Lexical already handles the
// characters and the caret; all this one adds is a class on its span.
// ---------------------------------------------------------------------------------------

const SPOILER_CLASS = "my-app-spoiler";

class SpoilerNode extends TextNode {
	// Prefixed, so it cannot clash with a built-in node. The export rule looks this up.
	static getType(): string {
		return "my-app-spoiler";
	}

	static clone(node: SpoilerNode): SpoilerNode {
		return new SpoilerNode(node.__text, node.__key);
	}

	static importJSON(serializedNode: SerializedTextNode): SpoilerNode {
		return $createSpoilerNode(serializedNode.text).updateFromJSON(serializedNode);
	}

	constructor(text: string, key?: NodeKey) {
		super(text, key);
	}

	createDOM(config: EditorConfig): HTMLElement {
		const dom = super.createDOM(config);

		dom.classList.add(SPOILER_CLASS);

		return dom;
	}

	// Lexical merges neighboring text nodes and grows a node when you type at its edge.
	// A spoiler must stay its own node, so both are switched off.
	isUnmergeable(): boolean {
		return true;
	}

	canInsertTextBefore(): boolean {
		return false;
	}

	canInsertTextAfter(): boolean {
		return false;
	}
}

function $createSpoilerNode(text: string): SpoilerNode {
	return $applyNodeReplacement(new SpoilerNode(text));
}

function $isSpoilerNode(node: unknown): node is SpoilerNode {
	return node instanceof SpoilerNode;
}

// ---------------------------------------------------------------------------------------
// 2. Markdown in — `:spoiler[…]` is a text directive whose children hold the text.
// ---------------------------------------------------------------------------------------

const $importSpoiler: MdastImportHandler<TextDirective> = (node) =>
	$createSpoilerNode(node.children.map((child) => (child.type === "text" ? child.value : "")).join(""));

// ---------------------------------------------------------------------------------------
// 3. Markdown out — without this, spoilers turn into plain text the next time the editor
//    writes Markdown.
// ---------------------------------------------------------------------------------------

const $exportSpoiler: MdastExportHandler = (node) =>
	$isSpoilerNode(node)
		? { type: "textDirective", name: "spoiler", children: [{ type: "text", value: node.getTextContent() }] }
		: null;

// ---------------------------------------------------------------------------------------
// The extension puts the three together.
//
// `MdastUnknownDirectiveExtension` is what parses `:name[…]` at all and routes a claimed
// name to its import rule. `directiveImportType` claims `spoiler` in its inline shape.
// ---------------------------------------------------------------------------------------

const SpoilerExtension = defineExtension({
	name: "my-app/Spoiler",
	nodes: [SpoilerNode],
	dependencies: [
		MdastUnknownDirectiveExtension,
		configExtension(MdastImportExtension, {
			importRules: [{ type: directiveImportType("textDirective", "spoiler"), $import: $importSpoiler }],
			exportRules: [{ type: SpoilerNode.getType(), $export: $exportSpoiler }]
		})
	]
});

// Module scope: a new array on every render would rebuild the editor and lose the document.
const EXTENSIONS = [SpoilerExtension];

// Hover is a CSS state, so the spoiler styling lives in a stylesheet. The background
// matches the text color, which paints the words out; hovering removes it.
const Layout = styled.div(
	() => css`
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;

		.${SPOILER_CLASS} {
			background: currentColor;
			border-radius: 3px;
			transition: background 0.15s ease;

			&:hover {
				background: transparent;
			}
		}
	`
);

const INITIAL_MARKDOWN = `# Your own extension

The butler did it, and the safe held :spoiler[nothing but a train ticket].
Hover a blacked-out run to read it, then switch to **Source** to see it written
back as \`:spoiler[…]\`.

A directive nobody claims stays a read-only placeholder and comes back out of the
editor untouched:

:::chart
type: bar
:::
`;

export function MarkdownEditorSpoilerExtension(): ReactElement {
	const [markdown, setMarkdown] = useState(INITIAL_MARKDOWN);

	return (
		<Layout>
			<MarkdownEditor
				id="markdown-editor-spoiler-extension"
				label="Description"
				value={markdown}
				onChange={setMarkdown}
				extensions={EXTENSIONS}
				allowedModes={["edit", "source", "view"]}
				minHeight={300}
			/>
			<details>
				<summary>Markdown value</summary>
				<pre style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>{markdown}</pre>
			</details>
		</Layout>
	);
}
