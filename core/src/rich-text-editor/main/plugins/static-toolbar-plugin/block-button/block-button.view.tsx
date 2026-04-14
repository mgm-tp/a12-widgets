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

import type { FC, MouseEvent } from "react";
import { useContext, useState, useCallback, useEffect } from "react";
import type { LexicalEditor, BaseSelection } from "lexical";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, FORMAT_ELEMENT_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { useEditorUpdateChange } from "../../../utils/hooks.js";
import { $isElementFormatApplyToSelection } from "../../../utils/selection.js";
import { A11YLanguageContext } from "../../../../../common/main/a11y-localization/language-context.js";
import { useRichTextEditorCache } from "../../../template/rich-text-editor.tpl.view.js";

import type { ButtonType, Interactable } from "../toolbar-button/toolbar-button.api.js";
import { ToolbarButtonInternal } from "../toolbar-button/toolbar-button.view.js";
import type { ToolbarButtonInternalProps } from "../toolbar-button/toolbar-button.internal.api.js";

import type { BlockButtonProps } from "./block-button.api.js";

function BlockInteractElement(buttonProps: BlockButtonProps): Required<Interactable> {
	return {
		isActive(selection: BaseSelection | null, editor: LexicalEditor): boolean {
			if (buttonProps.isActive) {
				return buttonProps.isActive(selection, editor);
			}

			if (buttonProps.nodeFormatType && $isRangeSelection(selection)) {
				return $isElementFormatApplyToSelection(selection, buttonProps.nodeFormatType);
			}

			return false;
		},

		isDisabled(selection: BaseSelection | null, editor: LexicalEditor): boolean {
			return !!buttonProps.isDisabled?.(selection, editor);
		}
	};
}

export function createBlockButton(buttonProps: BlockButtonProps): ButtonType {
	const interaction = BlockInteractElement(buttonProps);

	const BlockButton: FC<ToolbarButtonInternalProps> = (props) => {
		const [editor] = useLexicalComposerContext();
		const languageContext = useContext(A11YLanguageContext);
		const { setElementFormatType, setClassList } = useRichTextEditorCache();
		const [isFormatApplied, setIsFormatApplied] = useState(false);
		const [isFormatDisabled, setIsFormatDisabled] = useState(false);

		const $updateChange = useCallback(() => {
			const selection = $getSelection();
			setIsFormatApplied(interaction.isActive(selection, editor));

			if (interaction.isActive(selection, editor) && buttonProps.nodeFormatType) {
				setElementFormatType(buttonProps.nodeFormatType ?? "left");
			}

			setIsFormatDisabled(interaction.isDisabled(selection, editor));
		}, [editor, setElementFormatType]);

		const handleClick = useCallback(
			(event: MouseEvent<HTMLElement>) => {
				if (buttonProps.nodeFormatType) {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, buttonProps.nodeFormatType);
				}

				if (isFormatApplied) {
					setClassList([]);
				}

				buttonProps.onClick?.(event, editor);
				editor.update(() => {
					$updateChange();
				});
			},
			[$updateChange, editor, isFormatApplied, setClassList]
		);

		useEffect(() => {
			const removeUpdateCommands = editor.registerCommand(
				FORMAT_ELEMENT_COMMAND,
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

		useEditorUpdateChange($updateChange);

		return (
			<ToolbarButtonInternal
				{...buttonProps}
				{...props}
				title={buttonProps.title instanceof Function ? buttonProps.title(languageContext) : buttonProps.title}
				onClick={handleClick}
				active={isFormatApplied}
				disabled={isFormatDisabled}
			/>
		);
	};

	BlockButton.displayName = "BlockButton";

	return { component: BlockButton, interaction, icon: buttonProps.icon };
}
