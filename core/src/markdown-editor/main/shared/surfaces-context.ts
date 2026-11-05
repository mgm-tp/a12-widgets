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

import type { MarkdownEditorSurfacesContextValue } from "../markdown-editor.api.js";

/**
 * Provided once, around the whole editor. The value changes when an editor,
 * the mode or the disabled flag changes — never while someone types, so it is cheap to put this high up.
 */
export const MarkdownEditorSurfacesContext = createContext<MarkdownEditorSurfacesContextValue | null>(null);

/**
 * Both editors of the surrounding MarkdownEditor and what is true about them right now:
 * which mode is on, which features are on and how to open the link and image dialogs.
 *
 * Works anywhere inside a `<MarkdownEditor>` — a toolbar control,
 * or a component handed to {@link MarkdownEditorProps.plugins}.
 *
 * This hook is how a plugin reaches both editors: `richEditor` and `sourceEditor`.
 * `useLexicalComposerContext()` hands back the rich editor only, because a plugin is mounted
 * above the composer the source editor lives in.
 *
 * ```tsx
 * function MyPlugin() {
 *   const { sourceEditor } = useMarkdownEditorSurfaces();
 *
 *   useEffect(() => sourceEditor?.registerUpdateListener(…), [sourceEditor]);
 *
 *   return null;
 * }
 *
 * <MarkdownEditor value={markdown} onChange={setMarkdown} plugins={<MyPlugin />} />
 * ```
 *
 * `sourceEditor` is null in every other mode and for one render after switching to source.
 */
export function useMarkdownEditorSurfaces(): MarkdownEditorSurfacesContextValue {
	const surfaces = useContext(MarkdownEditorSurfacesContext);

	if (!surfaces) {
		throw new Error("MarkdownEditor surfaces are only available inside a <MarkdownEditor>.");
	}

	return surfaces;
}
