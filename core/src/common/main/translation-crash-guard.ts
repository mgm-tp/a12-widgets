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

import { isBrowser } from "./is-browser.js";

let installed = false;

/**
 * Makes React resilient to DOM mutations performed by in-browser translation tools (e.g. Google Translate).
 *
 * Translation tools rewrite text nodes by wrapping/replacing them with injected `<font>` elements.
 * React still holds references to the original text nodes in its fiber tree, so on a later update or unmount it calls
 * `parent.removeChild(node)` / `parent.insertBefore(node, ref)` for a node that the translator has moved out of `parent`.
 * The browser then throws `NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be
 * removed is not a child of this node.` and the application crashes.
 *
 * This guard patches `Node.prototype.removeChild` / `insertBefore` so that — only when the target is not actually
 * a child of the expected parent — the operation becomes a safe no-op instead of throwing. In every other case
 * the native behaviour is preserved. See the long-standing React issue facebook/react#11538.
 *
 * The patch is installed at most once and is a no-op outside the browser, so it is safe to call repeatedly
 * (e.g. on every {@link WidgetsRoot} mount).
 */
export function installTranslationCrashGuard(): void {
	if (installed || !isBrowser || typeof Node !== "function" || !Node.prototype) {
		return;
	}

	const originalRemoveChild = Node.prototype.removeChild;
	Node.prototype.removeChild = function removeChild<T extends Node>(this: Node, child: T): T {
		// Translation tools may have already moved or replaced this node.
		// Skip the removal when it is no longer a child of the expected parent.
		if (child.parentNode !== this) {
			return child;
		}

		return originalRemoveChild.call(this, child) as T;
	};

	const originalInsertBefore = Node.prototype.insertBefore;
	Node.prototype.insertBefore = function insertBefore<T extends Node>(
		this: Node,
		newNode: T,
		referenceNode: Node | null
	): T {
		// Translation tools may have moved or replaced the reference node.
		// Skip the insertion when the reference node is no longer under this parent.
		if (referenceNode && referenceNode.parentNode !== this) {
			return newNode;
		}

		return originalInsertBefore.call(this, newNode, referenceNode) as T;
	};

	installed = true;
}
