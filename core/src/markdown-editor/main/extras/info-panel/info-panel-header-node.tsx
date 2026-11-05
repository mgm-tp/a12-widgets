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

import type { DOMExportOutput, LexicalNode, SerializedLexicalNode } from "lexical";
import { $applyNodeReplacement, DecoratorNode } from "lexical";
import type { ReactNode } from "react";

import { InfoPanelHeader } from "./panel-header.view.js";

export class InfoPanelHeaderNode extends DecoratorNode<ReactNode> {
	static getType(): string {
		return "mde-info-panel-header";
	}

	static clone(node: InfoPanelHeaderNode): InfoPanelHeaderNode {
		return new InfoPanelHeaderNode(node.__key);
	}

	static importJSON(): InfoPanelHeaderNode {
		return $createInfoPanelHeaderNode();
	}

	exportJSON(): SerializedLexicalNode {
		return { ...super.exportJSON(), type: InfoPanelHeaderNode.getType(), version: 1 };
	}

	createDOM(): HTMLElement {
		const dom = document.createElement("div");

		dom.setAttribute("data-panel-header", "");
		// React owns what is drawn in here, so the browser must not let anyone type in it.
		// The caret skips over the header and lands in the panel's blocks.
		dom.contentEditable = "false";

		return dom;
	}

	updateDOM(): false {
		return false;
	}

	// Nothing to put on the clipboard. The header is drawn from the panel's type,
	// so pasting the panel elsewhere builds a fresh header from that type instead.
	exportDOM(): DOMExportOutput {
		return { element: null };
	}

	isInline(): false {
		return false;
	}

	// Arrow keys and Tab walk straight past the header.
	// Clicking it still selects the whole panel — that is the selection layer's job, not the keyboard's.
	isKeyboardSelectable(): false {
		return false;
	}

	decorate(): ReactNode {
		return <InfoPanelHeader nodeKey={this.getKey()} />;
	}
}

export function $createInfoPanelHeaderNode(): InfoPanelHeaderNode {
	return $applyNodeReplacement(new InfoPanelHeaderNode());
}

export function $isInfoPanelHeaderNode(node: LexicalNode | null | undefined): node is InfoPanelHeaderNode {
	return node instanceof InfoPanelHeaderNode;
}
