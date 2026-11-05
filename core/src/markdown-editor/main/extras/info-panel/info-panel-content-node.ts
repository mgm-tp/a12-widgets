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

import type { EditorConfig, LexicalNode, SerializedElementNode } from "lexical";
import { $applyNodeReplacement, ElementNode } from "lexical";

import { getInfoPanelThemeClasses } from "./theme.js";

export class InfoPanelContentNode extends ElementNode {
	static getType(): string {
		return "mde-info-panel-content";
	}

	static clone(node: InfoPanelContentNode): InfoPanelContentNode {
		return new InfoPanelContentNode(node.__key);
	}

	static importJSON(): InfoPanelContentNode {
		return $createInfoPanelContentNode();
	}

	exportJSON(): SerializedElementNode {
		return { ...super.exportJSON(), type: InfoPanelContentNode.getType(), version: 1 };
	}

	createDOM(config: EditorConfig): HTMLElement {
		const dom = document.createElement("div");
		const themeClasses = getInfoPanelThemeClasses(config.theme);

		dom.className = themeClasses.content;
		dom.setAttribute("data-panel-content", "");

		return dom;
	}

	// The div holds nothing that changes, so it never needs rebuilding.
	updateDOM(): false {
		return false;
	}

	// Marks this node as a boundary. Anything that walks up looking for the document root stops here instead.
	// So Ctrl+A with the caret in a panel selects the panel's blocks and nothing outside it,
	// and a command that works on "the top-level block"
	// gets a block inside the panel rather than the panel itself.
	isShadowRoot(): true {
		return true;
	}

	canIndent(): false {
		return false;
	}
}

export function $createInfoPanelContentNode(): InfoPanelContentNode {
	return $applyNodeReplacement(new InfoPanelContentNode());
}

export function $isInfoPanelContentNode(node: LexicalNode | null | undefined): node is InfoPanelContentNode {
	return node instanceof InfoPanelContentNode;
}
