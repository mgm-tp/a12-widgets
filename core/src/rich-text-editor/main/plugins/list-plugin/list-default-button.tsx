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

import type { MouseEvent } from "react";
import { $isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode } from "@lexical/list";
import type { LexicalEditor, BaseSelection } from "lexical";
import { $isRangeSelection, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND } from "lexical";

import { Icon } from "../../../../icon/main/icon.view.js";
import {
	$formatParagraph,
	$getNearestNodeOfTypeFromAnchor,
	$isSelectionMatchCondition
} from "../../utils/selection.js";

import { createBlockButton } from "../static-toolbar-plugin/block-button/block-button.view.js";

import { $getNodeListType, $stopIndentCommand, $stopOutdentCommand } from "./list-plugin.js";

export const BulletListButton = createBlockButton({
	onClick: (event: MouseEvent<HTMLElement>, editor: LexicalEditor) => {
		editor?.update(() => {
			const selectedNode = $getNearestNodeOfTypeFromAnchor<ListNode>(ListNode);

			if ($isListNode(selectedNode) && selectedNode.getListType() === "bullet") {
				$formatParagraph();
			} else {
				editor?.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
			}
		});
	},
	icon: <Icon>list</Icon>,
	isActive: (selection): boolean => {
		if (!$isRangeSelection(selection)) {
			return false;
		}

		return $isSelectionMatchCondition(selection, (node) => $getNodeListType(node) === "bullet");
	},
	title: (languageContext) => languageContext?.pluginEditorTitles?.bulletListButton
});

export const NumberListButton = createBlockButton({
	onClick: (event: MouseEvent<HTMLElement>, editor) => {
		editor?.update(() => {
			const selectedNode = $getNearestNodeOfTypeFromAnchor<ListNode>(ListNode);

			if ($isListNode(selectedNode) && selectedNode.getListType() === "number") {
				$formatParagraph();
			} else {
				editor?.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
			}
		});
	},
	icon: <Icon>format_list_numbered</Icon>,
	isActive: (selection): boolean => {
		if (!$isRangeSelection(selection)) {
			return false;
		}

		return $isSelectionMatchCondition(selection, (node) => $getNodeListType(node) === "number");
	},
	title: (languageContext) => languageContext?.pluginEditorTitles?.numberedListButtonGroup
});

export const IndentDecreaseButton = createBlockButton({
	icon: <Icon>format_indent_decrease</Icon>,
	onClick(event: MouseEvent<HTMLElement>, editor?: LexicalEditor) {
		editor?.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
	},
	isDisabled(selection: BaseSelection | null): boolean {
		return $stopOutdentCommand(selection);
	},
	title: (languageContext) => languageContext?.pluginEditorTitles?.decreaseIndentButton
});

export const IndentIncreaseButton = createBlockButton({
	icon: <Icon>format_indent_increase</Icon>,
	onClick(event: MouseEvent<HTMLElement>, editor?: LexicalEditor) {
		editor?.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
	},
	isDisabled(selection: BaseSelection | null): boolean {
		return $stopIndentCommand(selection);
	},
	title: (languageContext) => languageContext?.pluginEditorTitles?.increaseIndentButton
});
