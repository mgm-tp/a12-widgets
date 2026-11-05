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

import type { MarkdownEditorMode } from "../markdown-editor.api.js";

type CustomInlineRunTokenType = "inlineSubscript" | "inlineSuperscript" | "inlineUnderline" | "inlineHighlight";

export interface CustomInlineFormatEntry {
	/** Which of Lexical's text formats this entry stands for. */
	format: "subscript" | "superscript" | "underline" | "highlight";

	/** Written before the text and searched for when reading markdown back. */
	open: string;

	/** Written after the text. */
	close: string;

	/**
	 * What the parser names the run: the micromark token type,
	 * which is also the mdast node type and the class the source view styles.
	 */
	tokenType: CustomInlineRunTokenType;
}

/**
 * The four formats CommonMark and GFM have no syntax for.
 *
 * Each one serializes to the HTML element that renders it,
 * because markdown permits inline HTML and GitHub & most other renderers display it correctly.
 *
 * Inventing delimiters instead is not sustainable: nothing outside this editor knows them,
 * so they render as literal text everywhere the markdown is read.
 */
export const CUSTOM_INLINE_FORMATS: CustomInlineFormatEntry[] = [
	{ format: "subscript", open: "<sub>", close: "</sub>", tokenType: "inlineSubscript" },
	{ format: "superscript", open: "<sup>", close: "</sup>", tokenType: "inlineSuperscript" },
	{ format: "underline", open: "<u>", close: "</u>", tokenType: "inlineUnderline" },
	{ format: "highlight", open: "<mark>", close: "</mark>", tokenType: "inlineHighlight" }
];

/**
 * What {@link MarkdownEditorProps.allowedModes} falls back to when a host names none:
 * edit only. One mode alone means there is nothing to pick, so the mode menu stays away
 * until the host asks for more modes.
 */
export const DEFAULT_ALLOWED_MODES: MarkdownEditorMode[] = ["edit"];

/**
 * Protocols a link may use. Same list as `LinkNode.SUPPORTED_URL_PROTOCOLS`
 * (`@lexical/link` 0.48.0), so what the dialog takes is what Lexical renders.
 * `javascript:`, `data:` and `file:` are out, which keeps script and local files out too.
 */
export const ALLOWED_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "sms:", "tel:"]);

/** Protocols an image's `src` may use. A picture is fetched, so mail and phone links make no sense. */
export const ALLOWED_IMAGE_PROTOCOLS = new Set(["http:", "https:"]);
