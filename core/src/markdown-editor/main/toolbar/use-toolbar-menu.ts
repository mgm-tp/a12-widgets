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

import { useRef } from "react";

import type { PopUpMenuProps } from "../../../pop-up-menu/main/pop-up-menu.api.js";
import { useMarkdownEditorSurfaces } from "../shared/surfaces-context.js";
import { focusEditor } from "../utils/helpers.js";

/** The `PopUpMenu` props every toolbar menu sets the same way. */
type ToolbarMenuProps = Required<Pick<PopUpMenuProps, "orientation" | "focusOnTriggerElementAfterClose" | "close">>;

interface ToolbarMenu {
	/** Spread onto the `PopUpMenu`. */
	menuProps: ToolbarMenuProps;

	/**
	 * Runs `action`, closes the menu and puts the caret back into the editor
	 * the user is looking at, so typing carries on right after the pick.
	 */
	pick: (action: () => void) => void;
}

/**
 * What the toolbar menus share: where they open, how they close, and where focus goes afterwards.
 *
 * `PopUpMenu` hands focus back to its trigger when it closes. That is right for a menu
 * that stands on its own, but a toolbar menu is a way of formatting the text under the
 * caret, and the editor lost focus the moment the menu opened and its first item took it.
 * Focus on the trigger after a pick means the next keystroke goes nowhere until the user
 * clicks back into the text. So a pick keeps the trigger out of it and focuses the editor
 * instead. Escape and Tab still return to the trigger: the user backed out and is
 * navigating the toolbar, not typing.
 */
export function useToolbarMenu(): ToolbarMenu {
	const { richEditor, sourceEditor, isSourceMode } = useMarkdownEditorSurfaces();
	const closeRef = useRef<(() => void) | undefined>(undefined);

	const pick = (action: () => void): void => {
		action();
		closeRef.current?.();

		// `sourceEditor` is null for one render after switching modes. Nothing to focus then.
		const editor = isSourceMode ? sourceEditor : richEditor;

		if (editor) {
			focusEditor(editor);
		}
	};

	return {
		menuProps: {
			orientation: "bottom-start",
			focusOnTriggerElementAfterClose: { onItemClick: false, onProgrammatic: false },
			close: (handler) => {
				closeRef.current = handler;
			}
		},
		pick
	};
}
