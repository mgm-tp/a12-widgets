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

import { getPeerDependencyFromEditorOrThrow } from "@lexical/extension";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import type { ElementNode, LexicalCommand, LexicalEditor, RangeSelection } from "lexical";
import {
	$createParagraphNode,
	$getSelection,
	$insertNodes,
	$isElementNode,
	$isNodeSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_EDITOR,
	createCommand
} from "lexical";

import type { InfoPanelHostBridgeExtension } from "./host-bridge-extension.js";
import { $createInfoPanelNode, $isInfoPanelNode, type InfoPanelNode } from "./info-panel-node.js";
import { $getOrCreateInfoPanelContent, type InfoPanelType } from "./utils.js";

export const SET_INFO_PANEL_COMMAND: LexicalCommand<InfoPanelType> = createCommand("SET_INFO_PANEL_COMMAND");

export const REMOVE_INFO_PANEL_COMMAND: LexicalCommand<void> = createCommand("REMOVE_INFO_PANEL_COMMAND");

export function $getSelectedInfoPanel(): InfoPanelNode | null {
	const selection = $getSelection();

	if ($isNodeSelection(selection)) {
		return selection.getNodes().find($isInfoPanelNode) ?? null;
	}

	if (!$isRangeSelection(selection)) {
		return null;
	}

	return $findMatchingParent(selection.anchor.getNode(), $isInfoPanelNode);
}

// A command runs outside React, so it cannot read `InfoPanelHostContext` itself.
// The bridge extension holds the same value as a signal, and this reads it off there.
function getInsertableTypes(editor: LexicalEditor): ReadonlySet<InfoPanelType> {
	const { output } = getPeerDependencyFromEditorOrThrow<typeof InfoPanelHostBridgeExtension>(
		editor,
		"@a12/MarkdownEditor/InfoPanelHost"
	);

	return output.insertableTypes.value;
}

// The blocks a selection covers, each one listed once.
//
// Say the user selects "heads up" in one paragraph. `getNodes()` gives back the two words as two text nodes,
// and asking each one for its block gives that same paragraph twice. The Set drops the repeat.
function $selectedBlocks(selection: RangeSelection): ElementNode[] {
	const blocks = new Set<ElementNode>();

	for (const node of selection.getNodes()) {
		const block = node.getTopLevelElement();

		if (block && $isElementNode(block)) {
			blocks.add(block);
		}
	}

	return [...blocks];
}

function $setPanel(editor: LexicalEditor, type: InfoPanelType): boolean {
	// The menu hides these already, but code outside the editor can still dispatch one.
	// Returning true says the command was handled, so nothing below runs.
	if (!getInsertableTypes(editor).has(type)) {
		return true;
	}

	const existingPanel = $getSelectedInfoPanel();

	if (existingPanel) {
		existingPanel.setPanelType(type);

		return true;
	}

	const selection = $getSelection();

	if (!$isRangeSelection(selection)) {
		return false;
	}

	const panel = $createInfoPanelNode(type);
	const content = $getOrCreateInfoPanelContent(panel);
	const blocks = $selectedBlocks(selection);

	// Nothing to wrap, so the panel starts empty and takes the caret.
	if (blocks.length === 0) {
		content.append($createParagraphNode());
		$insertNodes([panel]);
		content.selectStart();

		return true;
	}

	// The panel goes where the first block was, then every block moves inside it.
	blocks[0].insertBefore(panel);
	blocks.forEach((block) => content.append(block));

	return true;
}

function $removePanel(): boolean {
	const panel = $getSelectedInfoPanel();

	if (!panel) {
		return false;
	}

	const blocks = panel.getContentChildren();

	blocks.forEach((block) => panel.insertBefore(block));
	panel.remove();

	blocks[0]?.selectStart();

	return true;
}

export function registerInfoPanelCommands(editor: LexicalEditor): () => void {
	return mergeRegister(
		editor.registerCommand(SET_INFO_PANEL_COMMAND, (type) => $setPanel(editor, type), COMMAND_PRIORITY_EDITOR),
		editor.registerCommand(REMOVE_INFO_PANEL_COMMAND, $removePanel, COMMAND_PRIORITY_EDITOR)
	);
}
