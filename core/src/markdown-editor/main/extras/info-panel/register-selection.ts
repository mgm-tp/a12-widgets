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

/*
 * What the mouse and the arrow keys do to a panel.
 *
 * A panel is in one of two states. Either the cursor is inside it and the user types
 * in it like any other text, or the whole panel is selected the way a picture is,
 * with a ring drawn round it — and then Backspace deletes it and all it holds.
 *
 * Click the text and the cursor goes there. Click anywhere else on the panel -
 * the space around the text, the coloured bar down its side, the header —
 * and the whole panel is selected. Escape swaps between the two.
 *
 * Three more rules stop a panel trapping the cursor. Backspace at the very start
 * selects the panel instead of deleting the block above it.
 * Enter on an empty last line moves that line out below the panel.
 * And when a panel is the first or last thing in the document,
 * pressing up or down there adds a new line beside it.
 */

import { $findMatchingParent, $isAtEndOfNode, $isAtStartOfNode, mergeRegister } from "@lexical/utils";
import type { BaseSelection, LexicalEditor, LexicalNode } from "lexical";
import {
	$createNodeSelection,
	$createParagraphNode,
	$getNearestNodeFromDOMNode,
	$getSelection,
	$isNodeSelection,
	$isParagraphNode,
	$isRangeSelection,
	$setSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_BEFORE_EDITOR,
	COMMAND_PRIORITY_LOW,
	getDOMSelection,
	INSERT_PARAGRAPH_COMMAND,
	KEY_ARROW_DOWN_COMMAND,
	KEY_ARROW_UP_COMMAND,
	KEY_BACKSPACE_COMMAND,
	KEY_ESCAPE_COMMAND
} from "lexical";

import { $isInfoPanelContentNode } from "./info-panel-content-node.js";
import { $isInfoPanelNode, type InfoPanelNode } from "./info-panel-node.js";

// The panel a node sits in. Nested panels give back the inner one.
function $getNearestPanel(node: LexicalNode): InfoPanelNode | null {
	return $findMatchingParent(node, $isInfoPanelNode);
}

// The panels selected whole. Empty while the cursor is in text.
function $getSelectedPanels(selection: BaseSelection | null): InfoPanelNode[] {
	return $isNodeSelection(selection) ? selection.getNodes().filter($isInfoPanelNode) : [];
}

// The paragraph or list the cursor is in, as long as it is one of a panel's own.
function $getBlockInPanel(node: LexicalNode): LexicalNode | null {
	return $findMatchingParent(node, (candidate) => $isInfoPanelContentNode(candidate.getParent()));
}

// The panel that was clicked, unless the click landed on its text.
// Reading it off the DOM rather than the selection, because a click on padding sets no selection at all.
function $getPanelOutsideText(editor: LexicalEditor, target: EventTarget | null): InfoPanelNode | null {
	if (!editor.isEditable() || !(target instanceof HTMLElement)) {
		return null;
	}

	const panelElement = target.closest("[data-panel-type]");
	const contentElement = panelElement?.querySelector(":scope > [data-panel-content]");

	if (!panelElement || contentElement?.contains(target)) {
		return null;
	}

	const panel = $getNearestNodeFromDOMNode(panelElement);

	return $isInfoPanelNode(panel) ? panel : null;
}

// Selects this panel on its own, dropping whatever was selected before.
function $selectPanel(panel: InfoPanelNode): void {
	const selection = $createNodeSelection();

	selection.add(panel.getKey());
	$setSelection(selection);
}

// Shift-click: adds the panel to the selection, or takes it back out.
function $togglePanelSelection(panel: InfoPanelNode): void {
	const selection = $getSelection();

	if (!$isNodeSelection(selection)) {
		$selectPanel(panel);

		return;
	}

	const key = panel.getKey();

	if (selection.has(key)) {
		selection.delete(key);
	} else {
		selection.add(key);
	}

	$setSelection(selection);
}

// Clicking a panel away from its text selects the panel instead of placing a cursor.
function $handleClickOutsideText(editor: LexicalEditor, event: MouseEvent): boolean {
	const panel = $getPanelOutsideText(editor, event.target);

	if (panel === null) {
		return false;
	}

	event.preventDefault();

	if (event.shiftKey) {
		$togglePanelSelection(panel);
	} else {
		$selectPanel(panel);
	}

	return true;
}

// Enter on an empty last line moves that line out below the panel.
// Without it, a panel at the end of the document would be somewhere the cursor could not get past.
function $handleEnter(): boolean {
	const selection = $getSelection();

	if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
		return false;
	}

	const block = $getBlockInPanel(selection.anchor.getNode());
	const panel = block === null ? null : $getNearestPanel(block);

	if (!$isParagraphNode(block) || panel === null) {
		return false;
	}

	const isLastBlock = block.getNextSibling() === null;
	const isEmpty = block.getTextContentSize() === 0;

	if (!isLastBlock || !isEmpty) {
		return false;
	}

	panel.insertAfter(block);
	block.selectStart();

	return true;
}

// Backspace at the very start of a panel selects the panel instead of deleting the block above it.
// Pressing it again deletes the panel.
function $handleBackspace(event: KeyboardEvent): boolean {
	const selection = $getSelection();

	if (!$isRangeSelection(selection)) {
		return false;
	}

	const panel = $getNearestPanel(selection.anchor.getNode());
	const content = panel?.getContent();

	if (!panel || !content || !$isAtStartOfNode(selection.anchor, content)) {
		return false;
	}

	event.preventDefault();
	$selectPanel(panel);

	return true;
}

// Escape swaps the two states, whichever one the panel is in.
function $handleEscape(event: KeyboardEvent): boolean {
	const selection = $getSelection();
	const panelAtCaret = $isRangeSelection(selection) ? $getNearestPanel(selection.anchor.getNode()) : null;
	const selectedPanel = $getSelectedPanels(selection)[0] ?? null;

	if (panelAtCaret !== null) {
		event.preventDefault();
		$selectPanel(panelAtCaret);

		return true;
	}

	if (selectedPanel !== null) {
		event.preventDefault();
		selectedPanel.getContent()?.selectStart();

		return true;
	}

	return false;
}

// Up or Down at the edge of a panel that is the first or last thing in the document
// adds a line beside it. Always returns false so the arrow key still moves the cursor,
// which lands in the line this just made.
function $growBlockBesidePanel(direction: "before" | "after"): boolean {
	const selection = $getSelection();

	if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
		return false;
	}

	const panel = $getNearestPanel(selection.anchor.getNode());
	const content = panel?.getContent();
	const parent = panel?.getParent();

	if (!panel || !content || !parent) {
		return false;
	}

	const caret = selection.anchor;
	const panelIsFirst = parent.getFirstChild()?.is(panel) === true;
	const panelIsLast = parent.getLastChild()?.is(panel) === true;

	if (direction === "before" && panelIsFirst && $isAtStartOfNode(caret, content)) {
		panel.insertBefore($createParagraphNode());
	} else if (direction === "after" && panelIsLast && $isAtEndOfNode(caret, content)) {
		panel.insertAfter($createParagraphNode());
	}

	return false;
}

// Writes the selection onto the DOM so the styles can draw the ring.
// Lexical draws nothing for a selected node on its own.
function syncSelectedPanels(editor: LexicalEditor): void {
	const rootElement = editor.getRootElement();

	rootElement?.querySelectorAll("[data-selected]").forEach((element) => element.removeAttribute("data-selected"));

	editor.getEditorState().read(() => {
		for (const panel of $getSelectedPanels($getSelection())) {
			editor.getElementByKey(panel.getKey())?.setAttribute("data-selected", "true");
		}
	});
}

// Pressing on a panel away from its text must not start selecting text
// and the browser decides that on mousedown — before the click reaches Lexical.
// So this one listener sits on the DOM rather than on CLICK_COMMAND with the rest.
function listenForMouseDownOutsideText(editor: LexicalEditor): (event: MouseEvent) => void {
	return (event: MouseEvent): void => {
		if (!editor.read(() => $getPanelOutsideText(editor, event.target))) {
			return;
		}

		event.preventDefault();

		const rootElement = editor.getRootElement();
		const ownerDocument = rootElement?.ownerDocument;

		if (rootElement && ownerDocument && ownerDocument.activeElement !== rootElement) {
			rootElement.focus({ preventScroll: true });
			getDOMSelection(ownerDocument.defaultView)?.removeAllRanges();
		}
	};
}

// Hooks all of it onto the editor and hands back the undo.
export function registerInfoPanelSelection(editor: LexicalEditor): () => void {
	const onMouseDownOutsideText = listenForMouseDownOutsideText(editor);

	return mergeRegister(
		editor.registerUpdateListener(() => syncSelectedPanels(editor)),

		editor.registerRootListener((rootElement, previousRootElement) => {
			previousRootElement?.removeEventListener("mousedown", onMouseDownOutsideText);
			rootElement?.addEventListener("mousedown", onMouseDownOutsideText);
		}),

		editor.registerCommand<MouseEvent>(
			CLICK_COMMAND,
			(event) => $handleClickOutsideText(editor, event),
			COMMAND_PRIORITY_BEFORE_EDITOR
		),

		editor.registerCommand(INSERT_PARAGRAPH_COMMAND, $handleEnter, COMMAND_PRIORITY_LOW),
		editor.registerCommand<KeyboardEvent>(KEY_BACKSPACE_COMMAND, $handleBackspace, COMMAND_PRIORITY_LOW),
		editor.registerCommand<KeyboardEvent>(KEY_ESCAPE_COMMAND, $handleEscape, COMMAND_PRIORITY_LOW),
		editor.registerCommand(KEY_ARROW_UP_COMMAND, () => $growBlockBesidePanel("before"), COMMAND_PRIORITY_LOW),
		editor.registerCommand(KEY_ARROW_DOWN_COMMAND, () => $growBlockBesidePanel("after"), COMMAND_PRIORITY_LOW)
	);
}
