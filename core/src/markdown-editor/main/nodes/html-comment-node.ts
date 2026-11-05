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

import type { LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import { $applyNodeReplacement, DecoratorNode } from "lexical";
import type { ReactNode } from "react";

export type SerializedHtmlCommentNode = Spread<{ comment: string }, SerializedLexicalNode>;

/**
 * An HTML comment: kept in the markdown, shown to nobody.
 *
 * ```md
 * <!-- reviewers: leave this alone -->
 * ```
 *
 * CommonMark passes it through to the HTML output and the browser hides it
 * (https://spec.commonmark.org/0.31.2/#html-blocks, condition 2), so a reader never sees a
 * comment. Deleting it would lose real instructions like `<!-- prettier-ignore -->`, so the
 * text is held here instead and written back untouched.
 *
 * It has no box on the page. Source mode is where a comment is read and edited.
 */
export class HtmlCommentNode extends DecoratorNode<ReactNode> {
	/** The comment, markers included. */
	__comment: string;

	static getType(): string {
		return "mde-html-comment";
	}

	static clone(node: HtmlCommentNode): HtmlCommentNode {
		return new HtmlCommentNode(node.__comment, node.__key);
	}

	constructor(comment: string, key?: NodeKey) {
		super(key);
		this.__comment = comment;
	}

	static importJSON(serializedNode: SerializedHtmlCommentNode): HtmlCommentNode {
		return $createHtmlCommentNode(serializedNode.comment).updateFromJSON(serializedNode);
	}

	exportJSON(): SerializedHtmlCommentNode {
		return { ...super.exportJSON(), comment: this.__comment, type: HtmlCommentNode.getType(), version: 1 };
	}

	/** Inline, so a comment mid-sentence does not split the paragraph. */
	isInline(): boolean {
		return true;
	}

	createDOM(): HTMLElement {
		const element = document.createElement("span");

		// `hidden`, not a class, so no stylesheet can bring it back by accident.
		element.hidden = true;

		return element;
	}

	updateDOM(): false {
		return false;
	}

	/** The comment as written. Export hands exactly this back. */
	getComment(): string {
		return this.getLatest().__comment;
	}

	decorate(): ReactNode {
		return null;
	}
}

/** Holds one HTML comment. */
export function $createHtmlCommentNode(comment: string): HtmlCommentNode {
	return $applyNodeReplacement(new HtmlCommentNode(comment));
}

/** Whether `node` is an {@link HtmlCommentNode}. */
export function $isHtmlCommentNode(node: LexicalNode | null | undefined): node is HtmlCommentNode {
	return node instanceof HtmlCommentNode;
}
