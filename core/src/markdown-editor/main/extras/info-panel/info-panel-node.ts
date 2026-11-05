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

import { getPeerDependencyFromEditorOrThrow } from "@lexical/extension";
import type {
	DOMConversionMap,
	DOMConversionOutput,
	DOMExportOutput,
	EditorConfig,
	LexicalEditor,
	LexicalNode,
	NodeKey,
	SerializedElementNode,
	Spread
} from "lexical";
import { $applyNodeReplacement, $getEditor, ElementNode } from "lexical";

import { $isInfoPanelContentNode, type InfoPanelContentNode } from "./info-panel-content-node.js";
import type { MdastInfoPanelExtension } from "./mdast-info-panel-extension.js";
import { getInfoPanelThemeClasses } from "./theme.js";
import { $getOrCreateInfoPanelContent, type InfoPanelType, isInfoPanelType } from "./utils.js";

type SerializedInfoPanelNode = Spread<{ panelType: InfoPanelType }, SerializedElementNode>;

export class InfoPanelNode extends ElementNode {
	__panelType: InfoPanelType;

	static getType(): string {
		return "mde-info-panel";
	}

	static clone(node: InfoPanelNode): InfoPanelNode {
		return new InfoPanelNode(node.__panelType, node.__key);
	}

	constructor(panelType: InfoPanelType = "info", key?: NodeKey) {
		super(key);
		this.__panelType = panelType;
	}

	static importJSON(serializedNode: SerializedInfoPanelNode): InfoPanelNode {
		return $createInfoPanelNode(isInfoPanelType(serializedNode.panelType) ? serializedNode.panelType : "info");
	}

	exportJSON(): SerializedInfoPanelNode {
		return {
			...super.exportJSON(),
			panelType: this.__panelType,
			type: InfoPanelNode.getType(),
			version: 1
		};
	}

	private writeDataPanelType(element: HTMLElement): void {
		element.setAttribute("data-panel-type", this.__panelType);
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement("div");

		this.writeDataPanelType(element);

		return { element };
	}

	static importDOM(): DOMConversionMap | null {
		return {
			div: (element: HTMLElement) => {
				const panelType = element.getAttribute("data-panel-type");

				if (!isInfoPanelType(panelType)) {
					return null;
				}

				return {
					// Only reached when the clipboard has no Lexical payload
					// a paste from a rendered page or another app. The header is not in the HTML
					// (its `exportDOM` writes nothing) and the content div converts to nothing,
					// so both are built here and the blocks moved inside.
					conversion: (): DOMConversionOutput => {
						const panel = $createInfoPanelNode(panelType);
						const content = $getOrCreateInfoPanelContent(panel);

						return {
							node: panel,
							after: (blocks) => {
								content.append(...blocks);

								return [];
							}
						};
					},
					priority: 1
				};
			}
		};
	}

	createDOM(config: EditorConfig, editor?: LexicalEditor): HTMLElement {
		const { config: dataRoles } = getPeerDependencyFromEditorOrThrow<typeof MdastInfoPanelExtension>(
			editor ?? $getEditor(),
			"@a12/mdast/InfoPanel"
		);

		const classes = getInfoPanelThemeClasses(config.theme);

		const dom = document.createElement("div");

		dom.className = `${classes.root} ${classes[this.__panelType]}`;
		dom.setAttribute("data-role", dataRoles.panel);
		this.writeDataPanelType(dom);

		return dom;
	}

	updateDOM(prevNode: InfoPanelNode, dom: HTMLElement, config: EditorConfig): boolean {
		if (prevNode.__panelType !== this.__panelType) {
			const classes = getInfoPanelThemeClasses(config.theme);

			dom.className = `${classes.root} ${classes[this.__panelType]}`;
			dom.setAttribute("data-panel-type", this.__panelType);
		}

		return false;
	}

	getContent(): InfoPanelContentNode | null {
		const content = this.getLatest().getChildren().find($isInfoPanelContentNode);

		return content ?? null;
	}

	getContentChildren(): LexicalNode[] {
		return this.getContent()?.getChildren() ?? [];
	}

	getPanelType(): InfoPanelType {
		return this.getLatest().__panelType;
	}

	setPanelType(panelType: InfoPanelType): this {
		const self = this.getWritable();
		self.__panelType = panelType;

		return self;
	}

	canBeEmpty(): boolean {
		return false;
	}

	canIndent(): boolean {
		return false;
	}
}

export function $createInfoPanelNode(panelType: InfoPanelType = "info"): InfoPanelNode {
	return $applyNodeReplacement(new InfoPanelNode(panelType));
}

export function $isInfoPanelNode(node: LexicalNode | null | undefined): node is InfoPanelNode {
	return node instanceof InfoPanelNode;
}
