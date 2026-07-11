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

import type { MouseEvent, FC } from "react";
import { useEffect } from "react";
import "@com.mgmtp.a12.widgets/widgets-core/styles/rich-text-editor.css";
import type { LexicalEditor } from "lexical";
import { $getSelection, $isNodeSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
	Icon,
	createInlineButton,
	RichTextEditor,
	$updateTextSelection,
	DataRoles
} from "@com.mgmtp.a12.widgets/widgets-core";

import { $createTextColorDecoratorNode, TextColorDecoratorNode } from "../nodes/text-color-decorator-node.js";

const TEXT_COLOR_CHANGE = createCommand("TEXT_COLOR_CHANGE");

const TextColorDecoratorPlugin = {
	ToolbarButton: createInlineButton({
		onClick: (event: MouseEvent<HTMLElement>, editor: LexicalEditor) => {
			event.preventDefault();
			editor?.update(() => {
				editor?.dispatchCommand(TEXT_COLOR_CHANGE, undefined);
			});
		},
		icon: <Icon iconTheme="outlined">color_lens</Icon>,
		isActive(selection): boolean {
			if ($isNodeSelection(selection)) {
				return true;
			}

			return document.activeElement?.getAttribute("data-role") === `${DataRoles.RichTextEditor.ColorDecoration}`;
		},
		title: "Make it red!"
	}),
	Plugin: () => {
		const [editor] = useLexicalComposerContext();

		useEffect(() => {
			const removeRegisterCommands = mergeRegister(
				editor.registerCommand(
					TEXT_COLOR_CHANGE,
					() => {
						const selection = $getSelection();

						if (!$isRangeSelection(selection) || selection.isCollapsed()) {
							return true;
						}

						$updateTextSelection(selection, (node) => {
							const newDecoratedNode = $createTextColorDecoratorNode(node?.getTextContent() ?? "");
							node?.replace(newDecoratedNode);
							newDecoratedNode.selectNext(0, 0);
						});

						return true;
					},
					COMMAND_PRIORITY_EDITOR
				)
			);

			return (): void => {
				removeRegisterCommands();
			};
		}, [editor]);

		return <></>;
	}
};

export const CreatingTextColorChangePluginEditor: FC = () => {
	return (
		<RichTextEditor
			initialConfig={{
				namespace: "Creating Text Color Change Plugin Editor",
				nodes: [TextColorDecoratorNode]
			}}
			id="creating-tag-plugin-editor"
			labelGraphic={<Icon>info</Icon>}
			placeholder="Type some text, select it, and click the button in the toolbar to make it red!"
			staticToolbarButtons={[TextColorDecoratorPlugin.ToolbarButton]}
		>
			<TextColorDecoratorPlugin.Plugin />
		</RichTextEditor>
	);
};
