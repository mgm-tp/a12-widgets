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

import { createContext, useContext } from "react";

import type { MarkdownEditorToolbarState } from "../toolbar/toolbar-state.js";

/**
 * `MarkdownEditor.Toolbar` provides this, and works the state out once for all its controls.
 *
 * The provider sits inside the toolbar on purpose. This value changes every time the caret moves,
 * so React re-renders the toolbar and nothing else.
 * Providing it around the whole editor would re-render the editor on every keystroke.
 */
export const ToolbarStateContext = createContext<MarkdownEditorToolbarState | null>(null);

/**
 * One flag per control: bold, italic, link, list, table, code block, undo and the rest,
 * plus the heading level the caret sits in.
 *
 * Only inside `MarkdownEditor.Toolbar`.
 */
export function useMarkdownEditorToolbarState(): MarkdownEditorToolbarState {
	const toolbarState = useContext(ToolbarStateContext);

	if (!toolbarState) {
		throw new Error("MarkdownEditor toolbar controls must be rendered inside <MarkdownEditor.Toolbar>.");
	}

	return toolbarState;
}
