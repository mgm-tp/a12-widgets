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

import type { FC } from "react";
import { useEffect } from "react";
import type { LexicalCommand, LexicalNode, BaseSelection } from "lexical";
import {
	$getSelection,
	$isParagraphNode,
	$isRangeSelection,
	COMMAND_PRIORITY_CRITICAL,
	COMMAND_PRIORITY_EDITOR,
	INDENT_CONTENT_COMMAND,
	KEY_ENTER_COMMAND,
	KEY_TAB_COMMAND,
	OUTDENT_CONTENT_COMMAND
} from "lexical";
import { $isListNode, INSERT_ORDERED_LIST_COMMAND, ListItemNode, ListNode } from "@lexical/list";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin as LexicalListPlugin } from "@lexical/react/LexicalListPlugin";

import { $isInlineStyleTextNode } from "../../nodes/inline-style-text-node.js";
import { $getFirstLevelSelectedBlockNode } from "../../utils/selection.js";
import { AUTO_LIST_ITEM_REGEX } from "../../utils/constants.js";
import { $isListItemNode } from "../../nodes/list-item-node.js";
import { DataRoles } from "../../../../common/main/data-roles.js";

export const $stopIndentCommand = (selection: BaseSelection | null): boolean => {
	if (!$isRangeSelection(selection)) {
		return true;
	}

	if (!selection.isCollapsed()) {
		return true;
	}

	const listItemNode = $getNearestNodeOfType<ListItemNode>(selection.anchor.getNode(), ListItemNode);
	const listItemNodePrevious = listItemNode?.getPreviousSibling();

	if (!listItemNode || !listItemNodePrevious || !$isListItemNode(listItemNodePrevious)) {
		return true;
	}

	return listItemNode.getIndent() >= listItemNodePrevious.getIndent() + 1;
};

export const $stopOutdentCommand = (selection: BaseSelection | null): boolean => {
	if (!$isRangeSelection(selection)) {
		return true;
	}

	if (!selection.isCollapsed()) {
		return true;
	}

	const listItemNode = $getNearestNodeOfType<ListItemNode>(selection.anchor.getNode(), ListItemNode);

	if (!listItemNode) {
		return true;
	}

	return listItemNode.getIndent() === 0;
};

export const ListPlugin: FC = () => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		const removeListCommands = mergeRegister(
			editor.registerCommand(
				INDENT_CONTENT_COMMAND,
				() => {
					const selection = $getSelection();

					return $stopIndentCommand(selection);
				},
				COMMAND_PRIORITY_CRITICAL
			),
			editor.registerCommand(
				OUTDENT_CONTENT_COMMAND,
				() => {
					const selection = $getSelection();

					return $stopOutdentCommand(selection);
				},
				COMMAND_PRIORITY_CRITICAL
			),
			editor.registerCommand(
				KEY_TAB_COMMAND,
				(event) => {
					const selection = $getSelection();
					const selectedBlockNode = $getFirstLevelSelectedBlockNode();

					if (!$isRangeSelection(selection) || !$isListNode(selectedBlockNode)) {
						return false;
					}

					if (
						(!event.shiftKey && !$stopIndentCommand(selection)) ||
						(event.shiftKey && !$stopOutdentCommand(selection))
					) {
						event.preventDefault();
					}

					const command: LexicalCommand<void> = event.shiftKey ? OUTDENT_CONTENT_COMMAND : INDENT_CONTENT_COMMAND;

					return editor.dispatchCommand(command, undefined);
				},
				COMMAND_PRIORITY_EDITOR
			),
			editor.registerCommand(
				KEY_ENTER_COMMAND,
				(event) => {
					const selection = $getSelection();
					const selectedBlockNode = $getFirstLevelSelectedBlockNode();

					const mentionSuggestion = document.querySelector(`[data-role=${DataRoles.RichTextEditor.MentionSuggestion}]`);

					if (!$isRangeSelection(selection) || !$isParagraphNode(selectedBlockNode) || mentionSuggestion) {
						return false;
					}

					const blockChildren = selectedBlockNode.getChildren();
					const firstBlockChild = blockChildren[0];
					const lastBlockChild = blockChildren[blockChildren.length - 1];

					if ($isInlineStyleTextNode(firstBlockChild)) {
						const match = firstBlockChild.getTextContent()?.match(AUTO_LIST_ITEM_REGEX);

						if (match) {
							event?.preventDefault();
							const startNumber = parseInt(match[1], 10);
							const textContentWithoutOrder = firstBlockChild.getTextContent()?.replace(AUTO_LIST_ITEM_REGEX, "");
							firstBlockChild.setTextContent(textContentWithoutOrder).select();
							lastBlockChild.selectEnd();

							editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);

							const anchorNode = selection.anchor.getNode();
							const listNode = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);

							if (listNode && listNode.getTag() === "ol" && typeof listNode.setStart === "function") {
								listNode.setStart(startNumber);
							}

							return true;
						}
					}

					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			)
		);

		return (): void => {
			removeListCommands();
		};
	}, [editor]);

	return <LexicalListPlugin />;
};

ListPlugin.displayName = "ListPlugin";

export const $getNodeListType = (node: LexicalNode): string | undefined => {
	const parentList = $getNearestNodeOfType<ListNode>(node, ListNode);

	return parentList?.getListType();
};
