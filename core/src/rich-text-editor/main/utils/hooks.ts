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

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { LexicalEditor, LexicalNode } from "lexical";
import { COMMAND_PRIORITY_LOW, SELECTION_CHANGE_COMMAND } from "lexical";
import { $isAutoLinkNode } from "@lexical/link";

import type { TextMatcher } from "../plugins/plugin.internal.api.js";
import { $isInlineStyleTextNode, InlineStyleTextNode } from "../nodes/inline-style-text-node.js";

import { addClassToMatchersInNode, mergeWithSibling, removeClassFromMatchersInNode } from "./node.js";
import { findFirstMatch } from "./common.js";

export const useEditorUpdateChange = ($updateChange: (isSelectionChange?: boolean) => void): void => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		const removeUpdateCommands = editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			() => {
				$updateChange();

				return false;
			},
			COMMAND_PRIORITY_LOW
		);

		return (): void => {
			removeUpdateCommands();
		};
	}, [$updateChange, editor]);

	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				$updateChange(false);
			});
		});
	}, [$updateChange, editor]);

	// For update group item button status
	useEffect(() => {
		return editor.update(() => {
			$updateChange(false);
		});
	}, [$updateChange, editor]);

	return;
};

function handleBadNeighbors(
	textNode: InlineStyleTextNode,
	className: string,
	options?: { matchers: TextMatcher[] }
): void {
	const textContent = textNode.getTextContent();
	const previous = textNode.getPreviousSibling();
	const next = textNode.getNextSibling();
	const matchers = options?.matchers ?? [];

	const handleNeighbor = (neighbor: LexicalNode | null, isNextNode = false): void => {
		if (!$isInlineStyleTextNode(neighbor)) {
			return;
		}

		const isClassAddedToNeighbor = neighbor.getSelectedStyleName().includes(className);

		if (isClassAddedToNeighbor) {
			const neighborTextContent = neighbor.getTextContent();
			const newTextContent = isNextNode ? textContent + neighborTextContent : neighborTextContent + textContent;
			const newMatch = findFirstMatch(newTextContent, matchers ?? []);

			if ((newMatch && newMatch.text !== neighborTextContent) || !newMatch) {
				const newNeighbor = neighbor.removeSelectedStyleName(className);

				if (isNextNode) {
					mergeWithSibling(textNode, newNeighbor);
				} else {
					mergeWithSibling(newNeighbor, textNode);
				}
			}
		}
	};

	handleNeighbor(previous);

	handleNeighbor(next, true);
}

export const useAddClassToTextMatchers = (editor: LexicalEditor, matchers: TextMatcher[], className: string): void => {
	useEffect(() => {
		const isEditable = editor.isEditable();

		if (editor.getRootElement() !== document.activeElement && isEditable) {
			// If editor is not focused, temporarily disable it to prevent autofocus
			editor.setEditable(false);
		}

		const removeTransform = editor.registerNodeTransform(InlineStyleTextNode, (node) => {
			const isClassAdded = node.getSelectedStyleName().includes(className);
			const parent = node.getParent();

			if (isClassAdded) {
				removeClassFromMatchersInNode(node, matchers, className);
			} else if (!$isAutoLinkNode(parent) && !node.getSelectedStyleName().includes(className)) {
				addClassToMatchersInNode(node, matchers, className);

				handleBadNeighbors(node, className, { matchers });
			}
		});

		// Re-enable editor in next frame if it was disabled
		requestAnimationFrame(() => {
			if (!editor.isEditable() && isEditable) {
				editor.setEditable(true);
			}
		});

		return removeTransform;
	}, [className, editor, matchers]);
};
