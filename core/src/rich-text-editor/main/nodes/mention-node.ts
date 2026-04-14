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

import type {
	DOMConversionMap,
	DOMConversionOutput,
	DOMExportOutput,
	EditorConfig,
	LexicalEditor,
	LexicalNode,
	NodeKey,
	Spread
} from "lexical";
import { $applyNodeReplacement } from "lexical";

import { editorThemeClasses } from "../themes/themes.js";

import type { SerializedInlineStyleTextNode } from "./inline-style-text-node.js";
import { InlineStyleTextNode } from "./inline-style-text-node.js";

export type SerializedMentionNode = Spread<
	{
		mentionName: string;
		mentionText?: string;
		type: string;
		version: 1;
	},
	SerializedInlineStyleTextNode
>;

function convertMentionElement(domNode: HTMLElement): DOMConversionOutput | null {
	const textContent = domNode.textContent;

	if (textContent !== null) {
		const node = $createEditorMentionNode({ mentionName: textContent });

		return {
			node
		};
	}

	return null;
}

export class MentionNode extends InlineStyleTextNode {
	__mention: string;

	static getType(): string {
		return "mention";
	}

	static clone(node: MentionNode): MentionNode {
		return new MentionNode(node.__mention, node.__text, node.__selectedClassName, node.__key);
	}

	static importJSON(serializedNode: SerializedMentionNode): MentionNode {
		const node = $createEditorMentionNode({
			mentionName: serializedNode.mentionName,
			selectedClassName: serializedNode.selectedClassName,
			mentionText: serializedNode?.mentionText
		});
		node.setTextContent(serializedNode.text);
		node.setFormat(serializedNode.format);
		node.setDetail(serializedNode.detail);
		node.setMode(serializedNode.mode);
		node.setStyle(serializedNode.style);

		return node;
	}

	/**
	 * Initialize mention node
	 * @param {string} mentionName Mention name
	 * @param {string} mentionText Text display for mention node
	 * @param {string[]} selectedStyleName List of class name for custom style
	 * @param {NodeKey} key Lexical node key
	 */
	constructor(mentionName: string, mentionText?: string, selectedStyleName?: string[], key?: NodeKey) {
		const dedupedClassNames = Array.from(new Set(selectedStyleName ?? []));
		super(mentionText ?? mentionName, dedupedClassNames, false, key);
		this.__mention = mentionName;
		this.__text = mentionText ?? mentionName;
	}

	exportJSON(): SerializedMentionNode {
		return {
			...super.exportJSON(),
			mentionName: this.__mention,
			mentionText: this.__text,
			type: this.getType(),
			version: 1
		};
	}

	createDOM(config: EditorConfig): HTMLElement {
		return super.createDOM(config);
	}

	updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
		return super.updateDOM(prevNode, dom, config);
	}

	exportDOM(editor: LexicalEditor): DOMExportOutput {
		const { element } = super.exportDOM(editor);

		if (element instanceof HTMLElement) {
			element?.setAttribute("data-lexical-mention", "true");
		}

		return { element };
	}

	static importDOM(): DOMConversionMap | null {
		return {
			span: (domNode: HTMLElement) => {
				if (!domNode.hasAttribute("data-lexical-mention")) {
					return null;
				}

				return {
					conversion: convertMentionElement,
					priority: 1
				};
			}
		};
	}

	isTextEntity(): true {
		return true;
	}
}

/**
 * @deprecated since 37.2.2
 * Use $createEditorMentionNode instead.
 */
export function $createMentionNode(
	mentionName: string,
	selectedClassName: string[] = [],
	mentionText?: string
): MentionNode {
	const mentionNode = new MentionNode(mentionName, mentionText, [editorThemeClasses.mention, ...selectedClassName]);
	mentionNode.setMode("segmented").toggleDirectionless();

	return $applyNodeReplacement(mentionNode);
}

export function $createEditorMentionNode({
	mentionName,
	selectedClassName = [],
	mentionText
}: {
	mentionName: string;
	selectedClassName?: string[];
	mentionText?: string;
}): MentionNode {
	const mentionNode = new MentionNode(mentionName, mentionText, [editorThemeClasses.mention, ...selectedClassName]);
	mentionNode.setMode("segmented").toggleDirectionless();

	return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(node: LexicalNode | null | undefined): node is MentionNode {
	return node instanceof MentionNode;
}
