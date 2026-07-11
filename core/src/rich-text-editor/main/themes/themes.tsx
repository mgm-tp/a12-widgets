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

import type { EditorThemeClasses } from "lexical";

export const editorThemeClasses: EditorThemeClasses = {
	placeholder: "editor-placeholder",
	paragraph: "editor-paragraph",
	quote: "editor-quote",
	heading: {
		h1: "editor-heading-h1",
		h2: "editor-heading-h2",
		h3: "editor-heading-h3",
		h4: "editor-heading-h4",
		h5: "editor-heading-h5"
	},
	list: {
		nested: {
			listitem: "editor-nested-listitem"
		},
		ol: "editor-list-ol",
		ul: "editor-list-ul",
		listitem: "editor-listitem",
		olDepth: ["editor-list-ol1", "editor-list-ol2", "editor-list-ol3", "editor-list-ol4", "editor-list-ol5"]
	},
	image: "editor-image",
	link: "editor-link",
	text: {
		bold: "editor-text-bold",
		italic: "editor-text-italic",
		underline: "editor-text-underline",
		strikethrough: "editor-text-strikethrough",
		underlineStrikethrough: "editor-text-underlineStrikethrough",
		code: "editor-text-code"
	},
	code: "editor-code",
	codeHighlight: {
		atrule: "editor-tokenAttr",
		attr: "editor-tokenAttr",
		boolean: "editor-tokenProperty",
		builtin: "editor-tokenSelector",
		cdata: "editor-tokenComment",
		char: "editor-tokenSelector",
		class: "editor-tokenFunction",
		"class-name": "editor-tokenFunction",
		comment: "editor-tokenComment",
		constant: "editor-tokenProperty",
		deleted: "editor-tokenProperty",
		doctype: "editor-tokenComment",
		entity: "editor-tokenOperator",
		function: "editor-tokenFunction",
		important: "editor-tokenVariable",
		inserted: "editor-tokenSelector",
		keyword: "editor-tokenAttr",
		namespace: "editor-tokenVariable",
		number: "editor-tokenProperty",
		operator: "editor-tokenOperator",
		prolog: "editor-tokenComment",
		property: "editor-tokenProperty",
		punctuation: "editor-tokenPunctuation",
		regex: "editor-tokenVariable",
		selector: "editor-tokenSelector",
		string: "editor-tokenSelector",
		symbol: "editor-tokenProperty",
		tag: "editor-tokenProperty",
		url: "editor-tokenOperator",
		variable: "editor-tokenVariable"
	},
	misspelledWord: "editor-misspelled-word",
	withTooltipWord: "editor-with-tooltip-word",
	withDefaultTooltipWord: "editor-with-default-tooltip-word",
	mention: "editor-mention"
};
