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
	SerializedTextNode,
	Spread,
	TextFormatType
} from "lexical";
import { $applyNodeReplacement, TextNode } from "lexical";

import { StringUtils } from "../../../common/main/utils.js";

import { editorThemeClasses } from "../themes/themes.js";

export type SerializedInlineStyleTextNode = Spread<
	{
		selectedClassName: string[];
		unmergeable?: boolean;
	},
	SerializedTextNode
>;

function wrapElementWith(element: HTMLElement, tag: string): HTMLElement {
	const el = document.createElement(tag);
	el.appendChild(element);

	return el;
}

export class InlineStyleTextNode extends TextNode {
	__selectedClassName: string[] = [];
	__isolate = false;
	__unmergeable = false;

	static getType(): string {
		return "style-text";
	}

	static clone(node: InlineStyleTextNode): InlineStyleTextNode {
		const cloned = new InlineStyleTextNode(node.__text, node.__selectedClassName, node.__isolate, node.__key);
		cloned.__unmergeable = node.__unmergeable;

		return cloned;
	}

	/**
	 * Initialize Inline Style Text Node
	 * @param {string} text the text display in text node
	 * @param {string[]} selectedStyleName list of class name for custom style
	 * @param {boolean} isolate node is isolate, style selected node will not affect others
	 * @param {NodeKey} key Lexical node key
	 */
	constructor(text: string, selectedStyleName?: string[], isolate?: boolean, key?: NodeKey) {
		super(text, key);
		this.__selectedClassName = selectedStyleName ?? [];
		this.__isolate = isolate ?? false;
		this.__unmergeable = false;
	}

	private updateDOMStyle(dom: HTMLElement): HTMLElement {
		const getSelectedStyleName = this.getSelectedStyleName();
		const strikethroughClass = editorThemeClasses.text?.strikethrough;
		const underlineStrikethroughClass = editorThemeClasses.text?.underlineStrikethrough;

		const className = StringUtils.join(
			...getSelectedStyleName,
			{ [`${editorThemeClasses.text?.underline}`]: this.hasFormat("underline") },
			{ [`${editorThemeClasses.text?.italic}`]: this.hasFormat("italic") },
			{ [`${editorThemeClasses.text?.bold}`]: this.hasFormat("bold") },
			{
				[`${editorThemeClasses.text?.underlineStrikethrough}`]:
					strikethroughClass &&
					underlineStrikethroughClass &&
					getSelectedStyleName.includes(strikethroughClass) &&
					!getSelectedStyleName.includes(underlineStrikethroughClass) &&
					this.hasFormat("underline")
			}
		);

		// Apply class to DOM
		if (className) {
			dom.className = className;
		} else {
			dom.removeAttribute("class");
		}

		return dom;
	}

	createDOM(config: EditorConfig): HTMLElement {
		const element = super.createDOM(config);

		return this.updateDOMStyle(element);
	}

	updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
		const isUpdated = super.updateDOM(prevNode, dom, config);
		this.updateDOMStyle(dom);

		return isUpdated;
	}

	exportDOM(editor: LexicalEditor): DOMExportOutput {
		let element = this.createDOM(editor._config);
		element.classList.remove(editorThemeClasses.misspelledWord);

		if (!element) {
			return { element };
		}

		if (this.hasFormat("bold")) {
			editorThemeClasses.text?.bold && element.classList.add(editorThemeClasses.text.bold);
			element = wrapElementWith(element, "b");
		}

		if (this.hasFormat("italic")) {
			editorThemeClasses.text?.italic && element.classList.add(editorThemeClasses.text.italic);
			element = wrapElementWith(element, "i");
		}

		if (this.hasFormat("strikethrough")) {
			editorThemeClasses.text?.strikethrough && element.classList.add(editorThemeClasses.text.strikethrough);
			element = wrapElementWith(element, "s");
		}

		if (this.hasFormat("underline")) {
			editorThemeClasses.text?.underline && element.classList.add(editorThemeClasses.text.underline);
			element = wrapElementWith(element, "u");
		}

		return {
			element
		};
	}

	getSelectedStyleName(): string[] {
		const self = this.getLatest();

		return self.__selectedClassName.sort();
	}

	setSelectedStyleName(selectedStyleName: string[]): this {
		const self = this.getWritable();
		const newSelectedClassName = new Set([...selectedStyleName]);
		self.__selectedClassName = [...newSelectedClassName];

		return self;
	}

	addSelectedStyleName(...classNames: string[]): this {
		const self = this.getWritable();
		const newSelectedClassName = new Set([...this.getSelectedStyleName(), ...classNames]);
		self.__selectedClassName = [...newSelectedClassName];

		return self;
	}

	removeSelectedStyleName(className: string): this {
		const self = this.getWritable();
		self.__selectedClassName = this.getSelectedStyleName().filter((el) => el !== className);

		return self;
	}

	static importJSON(serializedNode: SerializedInlineStyleTextNode): InlineStyleTextNode {
		const node = $createInlineStyleTextNode(serializedNode.text);
		node.setFormat(serializedNode.format);
		node.setDetail(serializedNode.detail);
		node.setMode(serializedNode.mode);
		node.setStyle(serializedNode.style);
		node.setSelectedStyleName(serializedNode.selectedClassName);

		if (serializedNode.unmergeable) {
			node.setUnmergeable();
		}

		return node;
	}

	exportJSON(): SerializedInlineStyleTextNode {
		return {
			detail: this.getDetail(),
			format: this.getFormat(),
			mode: this.getMode(),
			style: this.getStyle(),
			text: this.getTextContent(),
			selectedClassName: this.getSelectedStyleName(),
			unmergeable: this.__unmergeable || undefined,
			type: this.getType(),
			version: 1
		};
	}

	/**
	 * This function checks if the text is simple text or not. This helps remove or maintain the style of the text each time typing a new word.
	 * It should exclude misspellings and tooltips, as each word is treated as a separate node.
	 */
	isSimpleText(): boolean {
		return (
			this.__type === this.getType() &&
			this.__mode === 0 &&
			!this.__selectedClassName.includes(editorThemeClasses.misspelledWord) &&
			!this.__selectedClassName.includes(editorThemeClasses.withTooltipWord) &&
			!this.__selectedClassName.includes(editorThemeClasses.mention)
		);
	}

	/**
		Get class name list and exclude special class name make text not simple
	 */
	getSimpleTextClassNames(): string[] {
		return this.getSelectedStyleName().filter(
			(className) =>
				className !== editorThemeClasses.misspelledWord &&
				className !== editorThemeClasses.withDefaultTooltipWord &&
				className !== editorThemeClasses.withTooltipWord &&
				className !== editorThemeClasses.mention
		);
	}

	setUnmergeable(): this {
		const self = this.getWritable();

		if (!self.isUnmergeable()) {
			self.toggleUnmergeable();
		}

		// Mark as custom unmergeable - this node should NEVER merge
		self.__unmergeable = true;

		return self;
	}

	/** @internal */
	setLexicalUnmergeable(): this {
		const self = this.getWritable();

		if (!self.isUnmergeable()) {
			self.toggleUnmergeable();
		}

		return self;
	}

	removeUnmergeable(): this {
		const self = this.getWritable();

		if (self.isUnmergeable()) {
			self.toggleUnmergeable();
		}

		// Clear custom unmergeable flag
		self.__unmergeable = false;

		return self;
	}

	isCustomUnmergeable(): boolean {
		const self = this.getLatest();

		return self.__unmergeable;
	}

	setNodeIsolate(status = true): this {
		const self = this.getWritable();
		self.__isolate = status;

		return self;
	}

	canInsertTextBefore(): boolean {
		return !this.__isolate;
	}

	canInsertTextAfter(): boolean {
		return !this.__isolate;
	}

	hasClass(className: string): boolean {
		return this.getSelectedStyleName().includes(className);
	}

	removeFormat(type: TextFormatType): this {
		if (this.hasFormat(type)) {
			return this.toggleFormat(type);
		}

		return this;
	}

	addFormat(type: TextFormatType): this {
		if (!this.hasFormat(type)) {
			return this.toggleFormat(type);
		}

		return this;
	}

	splitText(...splitOffsets: Array<number>): Array<InlineStyleTextNode> {
		const selectedStyleName = this.getSelectedStyleName();

		return super.splitText(...splitOffsets).map((textNode) => {
			return (textNode as InlineStyleTextNode).setSelectedStyleName(selectedStyleName);
		});
	}
}

export function $createInlineStyleTextNode(text: string, selectedClassName?: string[]): InlineStyleTextNode {
	return $applyNodeReplacement(new InlineStyleTextNode(text, selectedClassName));
}

/** @internal */
export function $createLexicalUnmergeableInlineStyleTextNode(
	text: string,
	selectedClassName?: string[],
	format?: number | TextFormatType
): InlineStyleTextNode {
	const node = new InlineStyleTextNode(text, selectedClassName);

	if (format !== undefined) {
		node.setFormat(format);
	}

	return node.setLexicalUnmergeable();
}

export function $isInlineStyleTextNode(node: LexicalNode | undefined | null): node is InlineStyleTextNode {
	return node instanceof InlineStyleTextNode;
}
