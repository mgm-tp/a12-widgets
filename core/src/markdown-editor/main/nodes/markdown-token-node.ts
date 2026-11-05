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

import type { LexicalNode, NodeKey, RangeSelection, SerializedElementNode, Spread } from "lexical";
import { $applyNodeReplacement, $getSelection, $isRangeSelection, ElementNode } from "lexical";

import type { SourceTokenType } from "../source-highlighting/source-token.js";

export type SerializedMarkdownTokenNode = Spread<{ tokenType: SourceTokenType; level: number }, SerializedElementNode>;

/**
 * Wraps one token of markdown syntax, of any type the tokenizer emits.
 * A block holding `### heading_text` is built out of them:
 *
 * ```
 * MarkdownSourceBlockNode
 *   MarkdownTokenNode "atxHeading", level 3
 *     MarkdownTokenNode "atxHeadingSequence" > MarkdownTokenTextNode "###"
 *     MarkdownTokenNode "whitespace"         > MarkdownTokenTextNode " "
 *     MarkdownTokenNode "atxHeadingText"     > MarkdownTokenTextNode "heading_text"
 * ```
 *
 * Nests as the markdown does, so the toolbar and typing rules can walk up from the caret
 * to see what it is in. The DOM gets a `mde-token--{type}` class to style.
 */
export class MarkdownTokenNode extends ElementNode {
	__tokenType: SourceTokenType;

	/**
	 * Heading level, 0 for every other token.
	 *
	 * Counted while normalizing and exposed as `data-token-level`
	 * so CSS can size `#` and `###` differently without counting characters itself.
	 */
	__level: number;

	static getType(): string {
		return "mde-source-token";
	}

	static clone(node: MarkdownTokenNode): MarkdownTokenNode {
		return new MarkdownTokenNode(node.__tokenType, node.__level, node.__key);
	}

	static importJSON(serializedNode: SerializedMarkdownTokenNode): MarkdownTokenNode {
		return $createMarkdownTokenNode(serializedNode.tokenType, serializedNode.level).updateFromJSON(serializedNode);
	}

	constructor(tokenType: SourceTokenType, level = 0, key?: NodeKey) {
		super(key);
		this.__tokenType = tokenType;
		this.__level = level;
	}

	getTokenType(): SourceTokenType {
		return this.getLatest().__tokenType;
	}

	getLevel(): number {
		return this.getLatest().__level;
	}

	isInline(): boolean {
		return true;
	}

	/**
	 * Required of every inline `ElementNode` — see `ElementNode.isInline`.
	 * An empty token has no text to highlight, so nothing is lost by letting Lexical drop it.
	 */
	canBeEmpty(): boolean {
		return false;
	}

	/**
	 * Splits this token in two, which is what makes Enter work inside one.
	 *
	 * Splitting the tree at the caret, Lexical asks every element on the way up to divide itself here
	 * and takes what it gets back as the right-hand half.
	 *
	 * `ElementNode` answers `null` for "cannot be split", which puts the caret after the whole token instead:
	 * Enter in the middle of `abcdef` gave `abcdef\n` rather than `abc\ndef`.
	 *
	 * The new half gets the same type as this token. After a split that type is often wrong,
	 * but it does not stay: the block parses its text again right after and builds new nodes.
	 */
	insertNewAfter(_selection: RangeSelection, restoreSelection = true): MarkdownTokenNode {
		const half = $createMarkdownTokenNode(this.__tokenType, this.__level);

		this.insertAfter(half, restoreSelection);

		return half;
	}

	createDOM(): HTMLElement {
		const dom = document.createElement("span");

		dom.className = `mde-token mde-token--${this.__tokenType}`;
		dom.setAttribute("data-token", this.__tokenType);

		if (this.__level > 0) {
			dom.setAttribute("data-token-level", String(this.__level));
		}

		return dom;
	}

	updateDOM(prevNode: MarkdownTokenNode): boolean {
		return prevNode.__tokenType !== this.__tokenType || prevNode.__level !== this.__level;
	}

	exportJSON(): SerializedMarkdownTokenNode {
		return {
			...super.exportJSON(),
			tokenType: this.__tokenType,
			level: this.__level,
			type: MarkdownTokenNode.getType()
		};
	}
}

export function $createMarkdownTokenNode(tokenType: SourceTokenType, level = 0): MarkdownTokenNode {
	return $applyNodeReplacement(new MarkdownTokenNode(tokenType, level));
}

export function $isMarkdownTokenNode(node: LexicalNode | null | undefined): node is MarkdownTokenNode {
	return node instanceof MarkdownTokenNode;
}

/**
 * What the caret is inside, innermost first. Empty if it is not in a {@link MarkdownTokenNode}.
 *
 * Just the caret's token ancestors, so callers get "in a heading" or "in a code fence"
 * without parsing the text again. The toolbar uses it for its active buttons.
 */
export function $getCoveringMdTokenNodesAtCaret(): MarkdownTokenNode[] {
	const selection = $getSelection();

	if (!$isRangeSelection(selection)) {
		return [];
	}

	return selection.anchor.getNode().getParents().filter($isMarkdownTokenNode);
}
