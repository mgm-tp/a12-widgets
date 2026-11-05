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

import type { EditorConfig, LexicalNode, NodeKey, SerializedTextNode, Spread } from "lexical";
import { $applyNodeReplacement, TextNode } from "lexical";

import type { SourceTokenType } from "../source-highlighting/source-token.js";

export type SerializedMarkdownTokenTextNode = Spread<{ tokenType?: SourceTokenType }, SerializedTextNode>;

/**
 * The characters of one token — the `###` of a heading, the `**` of a bold run,
 * the `heading_text` after them, ...
 *
 * A {@link MarkdownTokenNode} cannot hold text itself: it is an `ElementNode`,
 * because token nodes nest inside one another and only a `TextNode` can carry characters and a caret.
 *
 * Having our own subclass also lets the highlighting
 * and the diff distinguish this text from anything else in the tree.
 */
export class MarkdownTokenTextNode extends TextNode {
	/**
	 * The token this text belongs to, when the token holds nothing else.
	 *
	 * Such a token needs no element around it. Lexical already makes a `<span>` for the characters,
	 * so this node puts the `mde-token--{type}` class straight on that span.
	 *
	 * Undefined when this text is not a whole token by itself.
	 * It then gets no class and renders as a plain `<span>`.
	 */
	__tokenType: SourceTokenType | undefined;

	static getType(): string {
		return "mde-source-text";
	}

	static clone(node: MarkdownTokenTextNode): MarkdownTokenTextNode {
		return new MarkdownTokenTextNode(node.__text, node.__tokenType, node.__key);
	}

	static importJSON(serializedNode: SerializedMarkdownTokenTextNode): MarkdownTokenTextNode {
		return $createMarkdownTokenTextNode(serializedNode.text, serializedNode.tokenType).updateFromJSON(serializedNode);
	}

	constructor(text: string, tokenType?: SourceTokenType, key?: NodeKey) {
		super(text, key);
		this.__tokenType = tokenType;
	}

	getTokenType(): SourceTokenType | undefined {
		return this.getLatest().__tokenType;
	}

	/**
	 * Lexical merges neighboring text nodes by default, which would join two tokens' text into one node.
	 * The diff compares one node per token, so a merged node never matches
	 * and that part of the block is re-spliced on every update, even when nothing changed.
	 */
	isUnmergeable(): boolean {
		return true;
	}

	/**
	 * The `<span>` `TextNode` already makes, with the token's classes added.
	 *
	 * `classList.add` rather than assigning `className`,
	 * because the base class may have put theme classes on the element first.
	 */
	createDOM(config: EditorConfig): HTMLElement {
		const dom = super.createDOM(config);

		if (this.__tokenType !== undefined) {
			dom.classList.add("mde-token", `mde-token--${this.__tokenType}`);
			dom.setAttribute("data-token", this.__tokenType);
		}

		return dom;
	}

	/**
	 * Returning true throws the element away and builds a new one, which is the simple way
	 * to swap the classes. It only happens when the type changes
	 * and the type of a run of text rarely does.
	 */
	updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
		return prevNode.__tokenType !== this.__tokenType || super.updateDOM(prevNode, dom, config);
	}

	exportJSON(): SerializedMarkdownTokenTextNode {
		return { ...super.exportJSON(), tokenType: this.__tokenType, type: MarkdownTokenTextNode.getType() };
	}
}

export function $createMarkdownTokenTextNode(text: string, tokenType?: SourceTokenType): MarkdownTokenTextNode {
	return $applyNodeReplacement(new MarkdownTokenTextNode(text, tokenType));
}

export function $isMarkdownTokenTextNode(node: LexicalNode | null | undefined): node is MarkdownTokenTextNode {
	return node instanceof MarkdownTokenTextNode;
}
