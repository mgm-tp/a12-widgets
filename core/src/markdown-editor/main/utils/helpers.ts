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

import type { LexicalEditor } from "lexical";
import { getActiveElement } from "lexical";

import { ALLOWED_IMAGE_PROTOCOLS, ALLOWED_LINK_PROTOCOLS } from "./constants.js";

/**
 * Focuses an editor: the caret into the document, the browser's focus onto the element.
 *
 * `editor.focus()` only places the caret, so the callback focuses the element.
 * Lexical runs it after the caret is set, which is when there is somewhere to put the focus.
 *
 * The caret lands at the end of the text, like `<textarea autofocus>`.
 */
export function focusEditor(editor: LexicalEditor): void {
	editor.focus(
		() => {
			const root = editor.getRootElement();

			// Somebody is already typing in here. Leave their caret alone.
			if (root !== null && !root.contains(getActiveElement(root))) {
				root.focus({ preventScroll: true });
			}
		},
		{ defaultSelection: "rootEnd" }
	);
}

/** Takes the browser focus off an editor. The caret stays where it was. */
export function blurEditor(editor: LexicalEditor): void {
	editor.getRootElement()?.blur();
}

/**
 * The lower-cased scheme with its colon, or `null` when the address names none.
 *
 * ```
 * "https://example.com/a.png"  -> "https:"
 * "images/a.png"               -> null
 * "#section"                   -> null
 * "java\tscript:alert(1)"      -> "javascript:"
 * ```
 *
 * That last one is why whitespace and control characters go first. Browsers ignore them inside a scheme,
 * so a tab dropped into `javascript:` still counts as one.
 */
function getProtocol(url: string): string | null {
	const stripped = Array.from(url)
		.filter((char) => char.charCodeAt(0) > 0x20)
		.join("");
	const match = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(stripped);

	return match ? `${match[1].toLowerCase()}:` : null;
}

/**
 * Whether a link may point at `url`: an allowed scheme, or no scheme at all.
 *
 * No scheme means no bad scheme, so relative addresses pass. `//other.example.com` counts as
 * relative as well, so check that yourself if you care which site a document points at.
 */
export function isAllowedLinkUrl(url: string): boolean {
	const protocol = getProtocol(url);

	return protocol === null || ALLOWED_LINK_PROTOCOLS.has(protocol);
}

/** Whether an image may point at `src`. Like {@link isAllowedLinkUrl}, minus mail and phone. */
export function isAllowedImageSrc(src: string): boolean {
	const protocol = getProtocol(src);

	return protocol === null || ALLOWED_IMAGE_PROTOCOLS.has(protocol);
}
