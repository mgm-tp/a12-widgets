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
import type { LexicalEditor, TextFormatType, BaseSelection } from "lexical";
import {
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_NORMAL,
	FORMAT_TEXT_COMMAND,
	COMMAND_PRIORITY_LOW
} from "lexical";
import type { FC, MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useContext, useEffect, useState } from "react";

import { A11YLanguageContext } from "../../../../../common/main/a11y-localization/language-context.js";
import { $isInlineStyleTextNode } from "../../../nodes/inline-style-text-node.js";
import { APPLY_TEXT_FORMAT_COMMAND } from "../../../utils/commands.js";
import { useEditorUpdateChange } from "../../../utils/hooks.js";
import { $isClassNameAppliedToSelection, $updateTextSelection } from "../../../utils/selection.js";
import { useRichTextEditorCache } from "../../../template/rich-text-editor.tpl.view.js";

import type { ButtonType, Interactable } from "../toolbar-button/toolbar-button.api.js";
import type { ToolbarButtonInternalProps } from "../toolbar-button/toolbar-button.internal.api.js";
import { ToolbarButtonInternal } from "../toolbar-button/toolbar-button.view.js";

import type { InlineButtonProps } from "./inline-button.api.js";

function InlineInteractElement(buttonProps: InlineButtonProps): Required<Interactable> {
	return {
		isActive(selection: BaseSelection | null, editor: LexicalEditor, selectionCLassListCache?: string[]): boolean {
			if (buttonProps.isActive) {
				return buttonProps.isActive(selection, editor);
			}

			if ($isRangeSelection(selection)) {
				if (buttonProps.nodeFormatType) {
					return selection.hasFormat(buttonProps.nodeFormatType as TextFormatType);
				}

				if (buttonProps.nodeClassName) {
					return $isClassNameAppliedToSelection(selection, buttonProps.nodeClassName, selectionCLassListCache);
				}
			}

			return false;
		},
		isDisabled(selection: BaseSelection | null, editor: LexicalEditor): boolean {
			return !!buttonProps.isDisabled?.(selection, editor);
		}
	};
}

export function createInlineButton(buttonProps: InlineButtonProps): ButtonType {
	const interaction = InlineInteractElement(buttonProps);

	const EditorButton: FC<ToolbarButtonInternalProps> = (props) => {
		const [editor] = useLexicalComposerContext();
		const languageContext = useContext(A11YLanguageContext);
		const { classList } = useRichTextEditorCache();
		const [isFormatApplied, setIsFormatApplied] = useState(false);
		const [isFormatDisabled, setIsFormatDisabled] = useState(false);

		const $updateChange = useCallback(
			(isSelectionChange = true) => {
				const selection = $getSelection();
				let newClassList = [...(classList ?? [])];

				if ($isRangeSelection(selection) && selection.isCollapsed() && isSelectionChange) {
					const focus = selection.focus;
					const focusNode = focus.getNode();

					if ($isInlineStyleTextNode(focusNode)) {
						newClassList = focusNode.getSelectedStyleName();
					}
				}

				setIsFormatApplied(interaction.isActive(selection, editor, newClassList));
				setIsFormatDisabled(interaction.isDisabled(selection, editor));
			},
			[classList, editor]
		);

		const handleClick = useCallback(
			(event: ReactMouseEvent<HTMLElement, MouseEvent>) => {
				if (buttonProps.nodeFormatType) {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, buttonProps.nodeFormatType as TextFormatType);
				}

				if (buttonProps.nodeClassName) {
					editor.dispatchCommand(APPLY_TEXT_FORMAT_COMMAND, {
						styleName: buttonProps.nodeClassName,
						isActive: interaction.isActive,
						isolateStyle: buttonProps.nodeIsolate ?? false,
						allowCollapseStyle: buttonProps.allowCollapseStyle ?? true
					});
				}

				buttonProps.onClick?.(event, editor);
			},
			[editor]
		);

		useEffect(() => {
			return editor.registerCommand(
				APPLY_TEXT_FORMAT_COMMAND,
				(payload: {
					styleName: string;
					allowCollapseStyle: boolean;
					isActive: (selection: BaseSelection | null) => boolean;
					isolateStyle: boolean;
				}) => {
					const selection = $getSelection();

					if ($isRangeSelection(selection)) {
						$updateTextSelection(selection, (node) => {
							if (
								buttonProps.nodeClassName &&
								$isInlineStyleTextNode(node) &&
								payload.styleName !== buttonProps.nodeClassName
							) {
								buttonProps.allowMultipleChoice === false && node.removeSelectedStyleName(buttonProps.nodeClassName);
							}
						});
					}

					return false;
				},
				COMMAND_PRIORITY_NORMAL
			);
		}, [editor]);

		useEffect(() => {
			const removeUpdateCommands = editor.registerCommand(
				APPLY_TEXT_FORMAT_COMMAND,
				() => {
					$updateChange(false);

					return false;
				},
				COMMAND_PRIORITY_LOW
			);

			return () => {
				removeUpdateCommands();
			};
		}, [$updateChange, editor]);

		useEditorUpdateChange($updateChange);

		return (
			<ToolbarButtonInternal
				{...props}
				{...buttonProps}
				onClick={handleClick}
				active={isFormatApplied}
				title={buttonProps.title instanceof Function ? buttonProps.title(languageContext) : buttonProps.title}
				disabled={isFormatDisabled}
			/>
		);
	};

	EditorButton.displayName = "EditorButton";

	return { component: EditorButton, interaction };
}
