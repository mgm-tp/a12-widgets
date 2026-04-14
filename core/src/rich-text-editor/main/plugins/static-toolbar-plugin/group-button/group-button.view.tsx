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

import type { FunctionComponent, MouseEvent, ReactNode } from "react";
import { useCallback, useContext, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";

import { List } from "../../../../../list/main/list.view.js";
import { A11YLanguageContext } from "../../../../../common/main/a11y-localization/language-context.js";
import { StyledEditorButtonGroup, StyledEditorButtonGroupTrigger } from "../../../rich-text-editor.styled.js";
import { useEditorUpdateChange } from "../../../utils/hooks.js";
import { useRichTextEditorCache } from "../../../template/rich-text-editor.tpl.view.js";
import { DataRoles } from "../../../../../common/main/data-roles.js";

import type { BaseToolbarButtonProps } from "../toolbar-button/toolbar-button.api.js";

import type { ToolbarButtonGroupProps } from "./group-button.api.js";

export function createButtonGroup(buttonProps: ToolbarButtonGroupProps): FunctionComponent<BaseToolbarButtonProps> {
	const ButtonGroup = (props: any): ReactNode => {
		const [editor] = useLexicalComposerContext();
		const languageContext = useContext(A11YLanguageContext);
		const { classList } = useRichTextEditorCache();
		const [icon, setIcon] = useState(buttonProps.icon);
		const [isGroupActive, setIsGroupActive] = useState(false);
		const [focusOnTriggerElementAfterClose, setFocusOnTriggerElementAfterClose] = useState(true);
		const closePopupHandler = useRef<(() => void) | undefined>(undefined);
		const triggerElementRef = useRef<HTMLButtonElement | null>(null);
		const { popUpMenuTitles } = useContext(A11YLanguageContext);

		const $updateChange = useCallback(() => {
			const selection = $getSelection();

			if ($isRangeSelection(selection)) {
				const activeButton = buttonProps.buttons.find((button) =>
					button.interaction.isActive(selection, editor, classList)
				);

				setIsGroupActive(!!activeButton);

				if (activeButton) {
					setIcon(activeButton.icon);
				}
			}
		}, [classList, editor]);

		const getClosePopupHandler = useCallback((handler: () => void): void => {
			closePopupHandler.current = handler;
		}, []);

		const onButtonTriggerMouseDown = useCallback((event: MouseEvent<HTMLElement>): void => {
			event.preventDefault();

			setFocusOnTriggerElementAfterClose(false);
		}, []);

		const onButtonTriggerKeyDown = useCallback((): void => {
			setFocusOnTriggerElementAfterClose(true);
		}, []);

		useEditorUpdateChange($updateChange);

		return (
			<StyledEditorButtonGroup
				htmlTag="li"
				focusOnOpen={true}
				className={buttonProps.className}
				style={buttonProps.style}
				id={buttonProps.id}
				triggerElement={
					<StyledEditorButtonGroupTrigger
						$active={isGroupActive}
						aria-pressed={isGroupActive}
						title={buttonProps.title instanceof Function ? buttonProps.title(languageContext) : buttonProps.title}
						icon={icon || buttonProps.icon}
						tabIndex={props.tabIndex ?? -1}
						onMouseDown={onButtonTriggerMouseDown}
						onKeyDown={onButtonTriggerKeyDown}
						buttonRef={(ref) => {
							triggerElementRef.current = ref;
						}}
					/>
				}
				close={getClosePopupHandler}
				focusOnTriggerElementAfterClose={focusOnTriggerElementAfterClose}
				dataRole={props.dataRole}
				headerTitle={popUpMenuTitles?.headingTitle}
			>
				<List dataRole={DataRoles.RichTextEditor.ToolbarList}>
					{buttonProps.buttons.map((ButtonComponent, index) => (
						<ButtonComponent.component
							{...props}
							key={index}
							tabIndex={0}
							triggerElementRef={triggerElementRef}
							dataRole={DataRoles.RichTextEditor.ToolbarListItem}
						/>
					))}
				</List>
			</StyledEditorButtonGroup>
		);
	};

	ButtonGroup.displayName = "ButtonGroup";

	return ButtonGroup;
}
