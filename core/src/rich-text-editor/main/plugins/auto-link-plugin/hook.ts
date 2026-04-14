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
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, SELECTION_CHANGE_COMMAND } from "lexical";
import type { LinkMatcher } from "@lexical/react/LexicalAutoLinkPlugin";
import { useEffect } from "react";
import { $isAutoLinkNode, $isLinkNode, AutoLinkNode } from "@lexical/link";
import { mergeRegister } from "@lexical/utils";

import { $isInlineStyleTextNode, InlineStyleTextNode } from "../../nodes/inline-style-text-node.js";
import { useRichTextEditorCache } from "../../template/rich-text-editor.tpl.view.js";
import { getEffectedNodes, replaceWithChildren } from "../../utils/node.js";

import type { ChangeHandler } from "./auto-link.internal.api.js";
import { handleBadNeighbors, handleLinkCreationFromNodes, handleLinkEdit } from "./utils.js";

export function useAutoLink(
	editor: LexicalEditor,
	matchers: Array<LinkMatcher>,
	onChange?: ChangeHandler,
	target?: string
): void {
	const { setClassList } = useRichTextEditorCache();

	useEffect(() => {
		return editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			() => {
				const selection = $getSelection();

				if ($isRangeSelection(selection) && selection.isCollapsed()) {
					const focus = selection.focus;
					const focusNode = focus.getNode();
					const previousNode = focusNode.getPreviousSibling();

					if ($isAutoLinkNode(previousNode) && focus.offset === 0) {
						let newClassList: string[] = [];
						const lastChild = previousNode.getLastChild();

						if ($isInlineStyleTextNode(lastChild)) {
							newClassList = lastChild.getSimpleTextClassNames();
							selection.format = lastChild.getFormat();
						}

						setClassList(newClassList);
					}
				}

				return false;
			},
			COMMAND_PRIORITY_LOW
		);
	}, [editor, setClassList]);

	useEffect(() => {
		const onChangeWrapped = (url: string | null, prevUrl: string | null): void => {
			if (onChange) {
				onChange(url, prevUrl);
			}
		};

		return mergeRegister(
			editor.registerNodeTransform(InlineStyleTextNode, (textNode: InlineStyleTextNode) => {
				const parent = textNode.getParentOrThrow();

				if ($isAutoLinkNode(parent)) {
					handleLinkEdit(parent, matchers, onChangeWrapped);
				} else if (!$isLinkNode(parent)) {
					handleLinkCreationFromNodes(getEffectedNodes(textNode), matchers, onChangeWrapped, target);

					handleBadNeighbors(textNode, matchers, onChangeWrapped);
				}
			})
		);
	}, [editor, matchers, onChange, target]);

	useEffect(() => {
		// Replace with children if the next node is AutoLinkNode
		return editor.registerNodeTransform(AutoLinkNode, (autoLinkNode) => {
			const nextNode = autoLinkNode.getNextSibling();

			if ($isAutoLinkNode(nextNode)) {
				replaceWithChildren(autoLinkNode);
				replaceWithChildren(nextNode);
			}
		});
	}, [editor]);
}
