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

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

import { DataRoles } from "../../../../common/index.js";

/**
 * Plugin to handle SELECT_ALL_COMMAND (Ctrl+A / Cmd+A) within the RichTextEditor.
 * This prevents selecting text outside the editor when in readonly mode.
 *
 * By default, Lexical uses contentEditable=false in readonly mode, which causes
 * Cmd+A/Ctrl+A select the whole page. This plugin intercepts
 * both keyboard events and selection changes to ensure only editor content is selected.
 */
export default function SelectAllPlugin(): null {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent): void => {
			if (event.key === "a" && (event.metaKey || event.ctrlKey)) {
				const input = (event.target as HTMLElement).closest(`[data-role=${DataRoles.RichTextEditor.Input}]`);

				if (!input || (document.activeElement !== input && !input.contains(document.activeElement))) {
					return;
				}

				const editorRoot = editor.getRootElement();

				if (!editorRoot) {
					return;
				}

				// Check if current selection is within the editor bounds
				const domSelection = window.getSelection();

				if (domSelection && domSelection.rangeCount > 0) {
					const range = domSelection.getRangeAt(0);
					const { startContainer, endContainer } = range;

					// If selection spans outside the editor, don't override default behavior
					if (!editorRoot.contains(startContainer) || !editorRoot.contains(endContainer)) {
						return;
					}
				}

				event.preventDefault();
				event.stopPropagation();

				const range = document.createRange();
				range.selectNodeContents(editorRoot);

				if (domSelection) {
					domSelection.removeAllRanges();
					domSelection.addRange(range);
				}
			}
		};

		document.addEventListener("keydown", onKeyDown, true);

		return (): void => {
			document.removeEventListener("keydown", onKeyDown, true);
		};
	}, [editor]);

	return null;
}
