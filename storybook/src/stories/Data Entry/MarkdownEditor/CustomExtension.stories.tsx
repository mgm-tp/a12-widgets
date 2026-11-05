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
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { EditorConfig, LexicalEditor, NodeKey, SerializedTextNode } from "lexical";
import { $applyNodeReplacement, $getRoot, configExtension, defineExtension, TextNode } from "lexical";
import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";

import type { MarkdownEditorProps, TextDirective } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import {
	directiveImportType,
	MarkdownEditor,
	MdastUnknownDirectiveExtension,
	useMarkdownEditorSurfaces
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { ControlledMarkdownEditor, MarkdownValuePanel } from "./helpers.js";
import { markdownEditorArgs, markdownEditorArgTypes } from "./story-args.js";

/*
 * A consumer-written extension, as small as one gets: a `TextNode` subclass that claims
 * the `:spoiler[…]` text directive. The showcase explains the pattern; these stories
 * exist to check the mechanics in isolation — the claim, the placeholder for an
 * unclaimed name, the round trip, and a `plugins` component across mode switches.
 */

const SPOILER_CLASS = "story-spoiler";

class SpoilerNode extends TextNode {
	static getType(): string {
		return "story-spoiler";
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

const $importSpoiler: MdastImportHandler<TextDirective> = (node) =>
	$createSpoilerNode(node.children.map((child) => (child.type === "text" ? child.value : "")).join(""));

const $exportSpoiler: MdastExportHandler = (node) =>
	$isSpoilerNode(node)
		? { type: "textDirective", name: "spoiler", children: [{ type: "text", value: node.getTextContent() }] }
		: null;

const SpoilerExtension = defineExtension({
	name: "story/Spoiler",
	nodes: [SpoilerNode],
	dependencies: [
		MdastUnknownDirectiveExtension,
		configExtension(MdastImportExtension, {
			importRules: [{ type: directiveImportType("textDirective", "spoiler"), $import: $importSpoiler }],
			exportRules: [{ type: SpoilerNode.getType(), $export: $exportSpoiler }]
		})
	]
});

// Module scope: a new array on every render rebuilds the editor and loses the document.
const SPOILER_EXTENSIONS = [SpoilerExtension];

const SPOILER_STYLES = `
.${SPOILER_CLASS} {
	background: currentColor;
	border-radius: 3px;
}

.${SPOILER_CLASS}:hover {
	background: transparent;
}
`;

const SPOILER_MARKDOWN = `# Directive claim

The safe held :spoiler[nothing but a train ticket]. Hover the black run to read it.

Only the inline shape is claimed. The block below is nobody's, so it stays a placeholder:

:::chart
type: bar
:::

::toc
`;

const meta: Meta<typeof MarkdownEditor> = {
	title: "Data Entry/MarkdownEditor/Extensions/Custom Extension",
	component: MarkdownEditor,
	render: (args) => (
		<>
			<style>{SPOILER_STYLES}</style>
			<ControlledMarkdownEditor {...args} showValuePanel />
		</>
	),
	parameters: {
		layout: "padded",
		docs: {
			source: { type: "code" },
			description: {
				component:
					"What a consumer's own extension looks like to the editor: a node plus an import and an export " +
					"rule, registered through `extensions`. The spoiler here claims `:spoiler[…]` with " +
					'`directiveImportType("textDirective", "spoiler")`. Everything the extension does not claim ' +
					"falls back to the read-only placeholder and is written back unchanged. The MarkdownEditor docs " +
					"page walks through this code step by step; these stories check the mechanics."
			}
		}
	},
	argTypes: markdownEditorArgTypes,
	args: {
		...markdownEditorArgs,
		value: SPOILER_MARKDOWN,
		allowedModes: ["edit", "source", "view"],
		minHeight: 280
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DirectiveClaim: Story = {
	args: {
		id: "custom-extension-markdown-editor",
		label: "Description",
		extensions: SPOILER_EXTENSIONS
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `const SpoilerExtension = defineExtension({
	name: "my-app/Spoiler",
	nodes: [SpoilerNode],
	dependencies: [
		// Turns the directive grammar on and routes a claimed name to its import rule.
		MdastUnknownDirectiveExtension,
		configExtension(MdastImportExtension, {
			importRules: [{ type: directiveImportType("textDirective", "spoiler"), $import: $importSpoiler }],
			exportRules: [{ type: SpoilerNode.getType(), $export: $exportSpoiler }]
		})
	]
});

const EXTENSIONS = [SpoilerExtension];

<MarkdownEditor value={markdown} onChange={setMarkdown} extensions={EXTENSIONS} />`
			},
			description: {
				story:
					"`:spoiler[…]` renders as the extension's node; `:::chart` and `::toc` stay placeholders because " +
					"nobody claimed them. Edit inside the spoiler and switch to source: it is written back as " +
					"`:spoiler[…]`, and the two placeholders come out character for character."
			}
		}
	}
};

export const WithoutTheExtension: Story = {
	args: {
		id: "no-extension-markdown-editor",
		label: "Description"
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// No extension: every directive is a read-only placeholder that is written back unchanged.
<MarkdownEditor value={markdown} onChange={setMarkdown} allowedModes={["edit", "source", "view"]} />`
			},
			description: {
				story:
					"The same markdown with no extension registered. The spoiler is now just another unclaimed " +
					"directive, so all three become placeholders. The value panel should still match the input " +
					"exactly after a mode round trip."
			}
		}
	}
};

interface WordCountPluginProps {
	onCount: (words: number) => void;

	/** Called once per mount, so the story can prove a mode switch does not remount the plugin. */
	onMount: () => void;
}

function countWords(editor: LexicalEditor): number {
	return editor.getEditorState().read(() => $getRoot().getTextContent().split(/\s+/).filter(Boolean).length);
}

// Follows whichever surface the user can see, so the count keeps updating in source mode.
function WordCountPlugin({ onCount, onMount }: WordCountPluginProps): null {
	const { richEditor, sourceEditor, isSourceMode } = useMarkdownEditorSurfaces();
	const editor = isSourceMode ? sourceEditor : richEditor;

	useEffect(() => onMount(), [onMount]);

	useEffect(() => {
		if (!editor) {
			return;
		}

		onCount(countWords(editor));

		return editor.registerUpdateListener(() => onCount(countWords(editor)));
	}, [editor, onCount]);

	return null;
}

function WordCountSandbox({ value, onChange, ...args }: MarkdownEditorProps): ReactElement {
	const [markdown, setMarkdown] = useState(value);
	const [words, setWords] = useState(0);
	const [mounts, setMounts] = useState(0);
	const countMount = useCallback(() => setMounts((count) => count + 1), []);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<MarkdownEditor
				{...args}
				value={markdown}
				onChange={(next) => {
					setMarkdown(next);
					onChange(next);
				}}
				plugins={<WordCountPlugin onCount={setWords} onMount={countMount} />}
			/>
			<p style={{ margin: 0, fontSize: 13 }}>
				<strong>{words}</strong> words · plugin mounted <strong>{mounts}</strong> {mounts === 1 ? "time" : "times"}
			</p>
			<MarkdownValuePanel markdown={markdown} />
		</div>
	);
}

export const Plugin: Story = {
	args: {
		id: "plugin-markdown-editor",
		label: "Description",
		value: `# Plugins

Type here; the counter under the editor follows every keystroke, not the debounced \`onChange\`.
Switch to **Source** and back: the plugin keeps running without being remounted.
`,
		minHeight: 220
	},
	render: (args) => <WordCountSandbox {...args} />,
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `function WordCountPlugin({ onCount }: { onCount: (words: number) => void }): null {
	const { richEditor, sourceEditor, isSourceMode } = useMarkdownEditorSurfaces();
	const editor = isSourceMode ? sourceEditor : richEditor;

	useEffect(() => editor?.registerUpdateListener(() => onCount(countWords(editor))), [editor, onCount]);

	return null;
}

<MarkdownEditor value={markdown} onChange={setMarkdown} plugins={<WordCountPlugin onCount={setWords} />} />`
			},
			description: {
				story:
					"A `plugins` component reads both surfaces through `useMarkdownEditorSurfaces()` and reports back " +
					"to the host. It sits outside the mode switch, so switching edit ↔ source ↔ view re-renders it " +
					"but never remounts it: the mount counter must stay at 1."
			}
		}
	}
};
