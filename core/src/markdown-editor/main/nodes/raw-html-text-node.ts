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

import type { EditorConfig, LexicalNode, SerializedTextNode } from "lexical";
import { $applyNodeReplacement, TextNode } from "lexical";

/**
 * A piece of raw HTML shown as the characters it is, not as an element.
 *
 * It is a `TextNode`, so the caret, selection and delete all work on it. The difference is
 * what happens on the way out. Ordinary text is escaped, which is right for text a person
 * typed and wrong for a tag that was already in the document:
 *
 * ```md
 * <a href="bar">x</a>   ->   \<a href="bar">x\</a>
 * ```
 *
 * CommonMark says raw HTML is rendered "without escaping"
 * (https://spec.commonmark.org/0.31.2/#raw-html), so that backslash turns working markup
 * into literal characters. Worse, it comes back as a real character next time and gets
 * escaped again — the document grows a layer of backslashes every save.
 *
 * So this exports an mdast `html` node, which the serializer emits untouched.
 *
 * `token` mode because it holds one tag: the caret steps over it and Backspace takes the
 * whole tag instead of leaving `<a href="ba`.
 */
export class RawHtmlTextNode extends TextNode {
	static getType(): string {
		return "mde-raw-html-text";
	}

	static clone(node: RawHtmlTextNode): RawHtmlTextNode {
		return new RawHtmlTextNode(node.__text, node.__key);
	}

	static importJSON(serializedNode: SerializedTextNode): RawHtmlTextNode {
		return $createRawHtmlTextNode(serializedNode.text).updateFromJSON(serializedNode);
	}

	exportJSON(): SerializedTextNode {
		return { ...super.exportJSON(), type: RawHtmlTextNode.getType(), version: 1 };
	}

	createDOM(config: EditorConfig): HTMLElement {
		const element = super.createDOM(config);

		// Marks the markup as markup for a screen reader and for anyone inspecting the DOM.
		// It carries no styling of its own — raw HTML reads as the text it is.
		element.setAttribute("data-raw-html", "true");

		return element;
	}
}

/** Puts one piece of raw HTML into a {@link RawHtmlTextNode}. */
export function $createRawHtmlTextNode(html: string): RawHtmlTextNode {
	return $applyNodeReplacement(new RawHtmlTextNode(html).setMode("token"));
}

/** Whether `node` is a {@link RawHtmlTextNode}. */
export function $isRawHtmlTextNode(node: LexicalNode | null | undefined): node is RawHtmlTextNode {
	return node instanceof RawHtmlTextNode;
}
