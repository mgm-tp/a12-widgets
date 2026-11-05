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

import type { MarkdownEditorMode } from "../markdown-editor.api.js";

/** What the mode menu needs: the mode that is on, the modes on offer, and how to switch. */
export interface MarkdownEditorModeContextValue {
	/** The mode the editor is in. */
	mode: MarkdownEditorMode;

	/** The modes the user may pick, from `allowedModes`. */
	availableModes: MarkdownEditorMode[];

	/** Switches the editor to another mode, the same way the built-in menu does. */
	changeMode: (mode: MarkdownEditorMode) => void;
}

/**
 * Provided once, around the whole editor. Internal: only the editor may provide it,
 * so a mode menu always switches the editor it sits in.
 */
export const MarkdownEditorModeContext = createContext<MarkdownEditorModeContextValue | null>(null);

/** The mode state of the editor around this component. Only inside a `<MarkdownEditor>`. */
export function useMarkdownEditorMode(): MarkdownEditorModeContextValue {
	const modeState = useContext(MarkdownEditorModeContext);

	if (!modeState) {
		throw new Error("The MarkdownEditor mode menu is only available inside a <MarkdownEditor>.");
	}

	return modeState;
}
