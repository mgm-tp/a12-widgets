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
	LexicalEditor,
	LexicalNode,
	NodeKey
} from "lexical";
import { $applyNodeReplacement } from "lexical";
import type { SerializedListItemNode } from "@lexical/list";
import { ListItemNode as LexicalListItemNode } from "@lexical/list";

export class ListItemNode extends LexicalListItemNode {
	static getType(): string {
		return "list-item";
	}

	static clone(node: ListItemNode): ListItemNode {
		return new ListItemNode(node.__value, node.__checked, node.__key);
	}

	/**
	 * Initialize list item node
	 * @param {number} value The html value attribute sets the value of the list item (for ordered lists).
	 * @param {boolean} checked Is the List Item a checkbox and, if so, is it checked? undefined/null: not a checkbox, true/false is a checkbox and checked/unchecked, respectively.
	 * @param {NodeKey} key Lexical node key
	 */
	constructor(value?: number, checked?: boolean, key?: NodeKey) {
		super(value, checked, key);
	}

	static importDOM(): DOMConversionMap | null {
		const converters = LexicalListItemNode.importDOM?.();

		return {
			...converters,
			li: () => ({
				conversion: (domNode: HTMLElement): DOMConversionOutput | null => {
					const result = converters?.li?.(domNode);

					if (result?.conversion) {
						return result.conversion(domNode);
					}

					return null;
				},
				priority: 1
			})
		};
	}

	exportDOM(editor: LexicalEditor): DOMExportOutput {
		const element = this.createDOM(editor._config);
		element.style.textAlign = this.getFormatType();

		return {
			element
		};
	}

	static importJSON(serializedNode: SerializedListItemNode): ListItemNode {
		return $createListItemNode(serializedNode.checked).updateFromJSON(serializedNode);
	}

	exportJSON(): SerializedListItemNode {
		return {
			...super.exportJSON(),
			type: this.getType(),
			version: 1
		};
	}
}

export function $createListItemNode(checked?: boolean): ListItemNode {
	return $applyNodeReplacement(new ListItemNode(undefined, checked));
}

export function $isListItemNode(node: LexicalNode | null | undefined): node is ListItemNode {
	return node instanceof ListItemNode;
}
