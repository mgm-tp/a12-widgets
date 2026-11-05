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

export const MARKDOWN_EDITOR_THEME: EditorThemeClasses = {
	paragraph: "mde-paragraph",
	quote: "mde-quote",
	heading: {
		h1: "mde-h1",
		h2: "mde-h2",
		h3: "mde-h3",
		h4: "mde-h4",
		h5: "mde-h5",
		h6: "mde-h6"
	},
	list: {
		ul: "mde-ul",
		ol: "mde-ol",
		listitem: "mde-li",
		nested: { listitem: "mde-nested-li" },
		checklist: "mde-checklist",
		listitemChecked: "mde-li-checked",
		listitemUnchecked: "mde-li-unchecked"
	},
	link: "mde-link",
	code: "mde-codeblock",
	text: {
		bold: "mde-bold",
		italic: "mde-italic",
		underline: "mde-underline",
		strikethrough: "mde-strikethrough",
		highlight: "mde-highlight",
		code: "mde-code",
		subscript: "mde-subscript",
		superscript: "mde-superscript"
	},
	table: "mde-table",
	tableCell: "mde-table-cell",
	tableCellHeader: "mde-table-cell-header",
	tableRow: "mde-table-row",

	// `TableExtension` turns on horizontal scrolling by default, so it wraps every table in a `<div>`.
	// Without a class here Lexical falls back to an inline `overflow-x: auto` on that `<div>`
	// and warns on every render, and the wrapper cannot be styled from the theme.
	tableScrollableWrapper: "mde-table-scroll",

	// A `diff-<lang>` fence is the one place a class lands: Shiki cuts the first character off the line
	// and gives it a type instead of an inline style. `+` and `>` are `inserted`,
	// `-` and `<` are `deleted`, a space is `unchanged`. Those three are all Shiki sends.
	// `markdown-editor.styled.tsx` colors the first two and leaves `unchanged` plain.
	codeHighlight: {
		deleted: "mde-code-deleted",
		inserted: "mde-code-inserted",
		unchanged: "mde-code-unchanged"
	}
};
