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
import {
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	mergeRegister,
	SELECTION_CHANGE_COMMAND
} from "lexical";
import { useEffect, useState } from "react";

/**
 * A flat snapshot of everything the toolbar needs to render its active and
 * enabled states. Recomputed on every selection / content change so the toolbar
 * subtree re-renders only when one of these values changes.
 *
 * Both surfaces produce one: `useRichToolbarState` from the rich node tree,
 * `useSourceToolbarState` from the markdown token tree. The shape is shared so a
 * control never asks which mode it is in.
 */
export interface MarkdownEditorToolbarState {
	isBold: boolean;
	isItalic: boolean;
	isStrike: boolean;
	isUnderline: boolean;
	isCode: boolean;
	isHighlight: boolean;
	isSubscript: boolean;
	isSuperscript: boolean;

	/** Active heading level, or `0` for a paragraph. */
	headingLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	isBulletList: boolean;
	isOrderedList: boolean;
	isTaskList: boolean;
	canSink: boolean;
	canLift: boolean;
	isLink: boolean;

	/** The selection is on an image. */
	isImage: boolean;

	/** The selection is on a thematic break (`---`). */
	isThematicBreak: boolean;
	isBlockquote: boolean;
	isCodeBlock: boolean;
	codeBlockLanguage: string;
	isInTable: boolean;

	canUndo: boolean;
	canRedo: boolean;
}

/** Everything off — the state of a toolbar with no editor or no selection. */
export const DEFAULT_TOOLBAR_STATE: MarkdownEditorToolbarState = {
	isBold: false,
	isItalic: false,
	isStrike: false,
	isUnderline: false,
	isCode: false,
	isHighlight: false,
	isSubscript: false,
	isSuperscript: false,
	headingLevel: 0,
	isBulletList: false,
	isOrderedList: false,
	isTaskList: false,
	canSink: false,
	canLift: false,
	isLink: false,
	isImage: false,
	isThematicBreak: false,
	isBlockquote: false,
	isCodeBlock: false,
	codeBlockLanguage: "",
	isInTable: false,
	canUndo: false,
	canRedo: false
};

/**
 * Reads the current selection into a state snapshot. Undo/redo enablement is
 * threaded in separately because it is not derivable from the selection — it
 * arrives through the CAN_UNDO/CAN_REDO commands.
 */
export type ToolbarStateReader = (canUndo: boolean, canRedo: boolean) => MarkdownEditorToolbarState;

/**
 * A reader builds a new object every time. React sees a new object as a change,
 * so the whole toolbar would re-render on every keystroke, even when no flag moved.
 * Every field is a boolean, a number or a string, so comparing them one by one is enough.
 */
function isSameToolbarState(one: MarkdownEditorToolbarState, other: MarkdownEditorToolbarState): boolean {
	const keys = Object.keys(one) as Array<keyof MarkdownEditorToolbarState>;

	return keys.every((key) => one[key] === other[key]);
}

/**
 * Subscribes to everything that can change a toolbar snapshot and re-reads it.
 *
 * The two surfaces differ only in how they read a selection, so the subscription
 * — update listener, selection changes, undo/redo enablement — is shared.
 * `$read` runs inside `editorState.read()` and must be a stable reference;
 * both callers pass a module-level function.
 */
export function useEditorToolbarState(
	editor: LexicalEditor | null,
	$read: ToolbarStateReader
): MarkdownEditorToolbarState {
	const [state, setState] = useState<MarkdownEditorToolbarState>(DEFAULT_TOOLBAR_STATE);

	useEffect(() => {
		if (!editor) {
			setState(DEFAULT_TOOLBAR_STATE);

			return undefined;
		}

		let canUndo = false;
		let canRedo = false;

		const update = (): void => {
			const next = editor.getEditorState().read(() => $read(canUndo, canRedo));

			// Keep the old object when the values match, so the toolbar re-renders on a change
			// the user can see rather than on every update the editor reports.
			setState((current) => (isSameToolbarState(current, next) ? current : next));
		};

		// The command handlers return false so they never consume the event
		// they only observe it.
		const observe = (command: typeof CAN_UNDO_COMMAND, apply: (payload: boolean) => void): (() => void) =>
			editor.registerCommand(
				command,
				(payload: boolean) => {
					apply(payload);
					update();

					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			);

		update();

		return mergeRegister(
			editor.registerUpdateListener(update),
			// A click or an arrow key moves the caret without changing the document
			// and only this command is guaranteed to report it.
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					update();

					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			),
			observe(CAN_UNDO_COMMAND, (payload) => {
				canUndo = payload;
			}),
			observe(CAN_REDO_COMMAND, (payload) => {
				canRedo = payload;
			})
		);
	}, [editor, $read]);

	return state;
}
