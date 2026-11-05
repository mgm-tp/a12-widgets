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
	DOMExportOutput,
	EditorConfig,
	LexicalEditor,
	LexicalNode,
	NodeKey,
	SerializedElementNode,
	Spread
} from "lexical";
import { $applyNodeReplacement, ElementNode } from "lexical";

import {
	isInlineHtmlTag,
	sanitizeAttributeRecord,
	sanitizeHtmlTag,
	sanitizeStyleValue
} from "../utils/html-sanitizer.js";

export type SerializedHtmlElementNode = Spread<
	{
		/** The tag name, lower-cased: `div`, `span`, `details`. */
		tag: string;

		/** The attributes that survived {@link sanitizeAttributeRecord}. */
		attributes: Record<string, string>;
	},
	SerializedElementNode
>;

/**
 * Puts the author's `style` on the element, in one of the two ways it is needed.
 *
 * On screen, only what paints: {@link sanitizeStyleValue} drops the declarations that would put
 * the box on top of the host's screen, or load a file from the author's server.
 *
 * On the way out, all of it. The element built for export is never shown on the page, and the
 * document said what it said. Dropping declarations there would change the author's file every
 * time it was opened and saved.
 *
 * Both ways go through `element.style`, never `setAttribute("style", …)`. For a Content Security
 * Policy the attribute counts as an inline style, so a host on `style-src 'self' 'sha256-…'` —
 * which is what our own guide tells them to set — would see the attribute refused, and get a
 * console full of violation reports. The CSSOM is not part of that check.
 */
function applyStyle(element: HTMLElement, value: string, forExport: boolean): void {
	if (forExport) {
		element.style.cssText = value;

		return;
	}

	for (const [property, declared] of sanitizeStyleValue(value)) {
		element.style.setProperty(property, declared);
	}
}

/**
 * Puts the stored attributes on a freshly made element.
 *
 * A name that arrived as JSON is only a string until it is tried: `data-` and `aria-` are
 * prefixes, so a saved state can ask for `data-"`, which `setAttribute` refuses with an
 * `InvalidCharacterError`. Letting that through would take the whole document down on open, so
 * the one attribute is skipped and the rest of the element is still built.
 *
 * The name stays on the node either way, but whether it comes back in the markdown depends on
 * the tag. An inline element is written from the node's own attributes, so the name survives;
 * a block element is written by rendering this element, so the name is dropped there too.
 *
 * `style` and `class` are the exceptions — see {@link applyStyle} and the `class` branch below.
 */
function applyAttributes(element: HTMLElement, attributes: Record<string, string>, forExport: boolean): void {
	for (const [name, value] of Object.entries(attributes)) {
		// A class from the document is a way into the host's own stylesheet: the host writes
		// `.note { … }` for its own page, and a document that says `class="note"` helps itself
		// to it. So it is kept on the node and written back to the file, but never put on the
		// element the reader sees. Export is the other way round, and gets it.
		if (name === "class" && !forExport) {
			continue;
		}

		try {
			if (name === "style") {
				applyStyle(element, value, forExport);
			} else {
				element.setAttribute(name, value);
			}
		} catch {
			// A name this browser will not take. Nothing to do about it, and nothing to lose
			// by carrying on — the attribute simply does not show up on the element.
		}
	}
}

/** Whether two attribute records hold the same names and the same values. */
function isSameAttributes(one: Record<string, string>, other: Record<string, string>): boolean {
	const names = Object.keys(one);

	return names.length === Object.keys(other).length && names.every((name) => one[name] === other[name]);
}

/**
 * One node type for every HTML element the editor renders.
 *
 * The tag name and attributes are data on the node, not a class per tag, so
 * `<div style="background: red">` and `<section id="x">` are the same node with different
 * values. What sat between the tags is the node's children, so the text stays editable and
 * markdown inside it keeps working.
 *
 * ```md
 * <div style="background: red">text</div>
 * ```
 *
 * Nothing reaches it unchecked, wherever it came from. The constructor is the only way to make
 * one, and it runs the tag through {@link sanitizeHtmlTag} and the attributes through
 * {@link sanitizeAttributeRecord}, which drops anything that could fetch, navigate or run. So a
 * node built from stored JSON — a paste, a saved editor state — is held to the same rules as one
 * read out of a markdown file, and a caller cannot forget to ask.
 */
export class HtmlElementNode extends ElementNode {
	/** The tag name, lower-cased. */
	__tag: string;

	/** The attributes that may be put on the element. */
	__attributes: Record<string, string>;

	static getType(): string {
		return "mde-html-element";
	}

	static clone(node: HtmlElementNode): HtmlElementNode {
		return new HtmlElementNode(node.__tag, node.__attributes, node.__key);
	}

	constructor(tag: string, attributes: Record<string, string> = {}, key?: NodeKey) {
		super(key);
		this.__tag = sanitizeHtmlTag(tag);

		// The sanitized tag, not the one asked for: whether an `aria-` name may be kept depends
		// on the tag the element really becomes.
		this.__attributes = sanitizeAttributeRecord(attributes, this.__tag);
	}

	static importJSON(serializedNode: SerializedHtmlElementNode): HtmlElementNode {
		// Nothing to clean here: the constructor does it, and this JSON — a paste, or an
		// editor state saved by an older version — is exactly the case it is there for.
		return new HtmlElementNode(serializedNode.tag, serializedNode.attributes).updateFromJSON(serializedNode);
	}

	exportJSON(): SerializedHtmlElementNode {
		return {
			...super.exportJSON(),
			tag: this.__tag,
			attributes: this.__attributes,
			type: HtmlElementNode.getType(),
			version: 1
		};
	}

	/** The tag name, lower-cased. */
	getTag(): string {
		return this.getLatest().__tag;
	}

	/** The attributes this element carries, as a fresh copy. */
	getAttributes(): Record<string, string> {
		return { ...this.getLatest().__attributes };
	}

	/** A `<span>` flows with its sentence; a `<div>` stands on its own. */
	isInline(): boolean {
		return isInlineHtmlTag(this.getTag());
	}

	createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
		return this.buildElement(false);
	}

	updateDOM(prevNode: this): boolean {
		// A different tag needs a different element, so Lexical has to build a new one.
		return prevNode.__tag !== this.__tag || !isSameAttributes(prevNode.__attributes, this.__attributes);
	}

	/**
	 * The same element again, for the HTML clipboard and for markdown export.
	 *
	 * The markdown exporter renders this shell and then puts the children back in as
	 * markdown, so this is the single place the tag and its attributes are written.
	 */
	exportDOM(_editor: LexicalEditor): DOMExportOutput {
		// The whole `style`, not only the part that paints: this element is written back
		// into the document instead of being shown, so all of it has to survive the trip.
		return { element: this.buildElement(true) };
	}

	/** The element itself, for the screen (`forExport` off) or for the way out (on). */
	private buildElement(forExport: boolean): HTMLElement {
		const element = document.createElement(this.__tag);

		applyAttributes(element, this.__attributes, forExport);

		return element;
	}
}

/** Builds an {@link HtmlElementNode} for `tag`, keeping only the attributes that are allowed. */
export function $createHtmlElementNode(tag: string, attributes: Record<string, string> = {}): HtmlElementNode {
	return $applyNodeReplacement(new HtmlElementNode(tag, attributes));
}

/** Whether `node` is an {@link HtmlElementNode}. */
export function $isHtmlElementNode(node: LexicalNode | null | undefined): node is HtmlElementNode {
	return node instanceof HtmlElementNode;
}
