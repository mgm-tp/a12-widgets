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

import type { FC, KeyboardEvent, MouseEvent } from "react";
import { useContext, useRef, useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Key } from "ts-key-enum";

import { Icon } from "../../../../../icon/main/icon.view.js";
import { StyledEditorButton } from "../../../rich-text-editor.styled.js";
import { A11YLanguageContext } from "../../../../../common/main/a11y-localization/language-context.js";
import { Key as KeyUtils } from "../../../../../common/main/utils.js";
import { DataRoles } from "../../../../../common/main/data-roles.js";

import type { BaseToolbarButtonProps } from "./toolbar-button.api.js";
import type { ToolbarButtonInternalProps } from "./toolbar-button.internal.api.js";

export const ToolbarButtonInternal: FC<BaseToolbarButtonProps & ToolbarButtonInternalProps> = (props) => {
	const [editor] = useLexicalComposerContext();
	const languageContext = useContext(A11YLanguageContext);
	const itemContentRef = useRef<HTMLDivElement | null>(null);

	const {
		onClick,
		isActive,
		isDisabled,
		label,
		title,
		active,
		tabIndex,
		icon,
		children,
		wrapperRef,
		triggerElementRef,
		...rest
	} = props;

	const isIconButton = !!icon && !label;

	const handleOnKeyDown = useCallback((event: KeyboardEvent): void => {
		if (event.key === Key.Enter || event.key === KeyUtils.Space) {
			event.preventDefault();
		}
	}, []);

	const getItemContentRef = useCallback(
		(ref: HTMLDivElement | null) => {
			itemContentRef.current = ref;
			wrapperRef?.(ref);
		},
		[wrapperRef]
	);

	const handleClick = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			const toolbarButton = triggerElementRef?.current ?? itemContentRef.current;
			const editorWrapper = toolbarButton?.closest(`[data-role=${DataRoles.RichTextEditor.Wrapper}]`);
			const editorContent = editorWrapper?.querySelector(`[data-role=${DataRoles.RichTextEditor.Input}]`);

			const isKeyEvent = "key" in event;

			const contenteditable = editorContent?.getAttribute("contenteditable") ?? "false";

			if (isKeyEvent) {
				editorContent?.setAttribute("contenteditable", "false");
			}

			editor.focus();
			onClick?.(event, editor);

			setTimeout(() => {
				isKeyEvent && editorContent?.setAttribute("contenteditable", contenteditable);
			});
		},
		[editor, onClick, triggerElementRef]
	);

	const handleMouseDown = (event: MouseEvent<HTMLElement>): void => {
		event.preventDefault();
	};

	const buttonTitle = title instanceof Function ? title(languageContext) : title;

	return (
		<StyledEditorButton
			{...rest}
			isActive={active}
			tabIndex={tabIndex ?? -1}
			text={icon ?? label}
			selected={active}
			meta={active && <Icon>check</Icon>}
			onMouseDown={handleMouseDown}
			title={buttonTitle}
			ariaLabel={buttonTitle}
			contentProps={{ wrapperRef: getItemContentRef }}
			onClick={handleClick}
			onKeyDown={handleOnKeyDown}
			isIconButton={isIconButton}
		/>
	);
};

ToolbarButtonInternal.displayName = "ToolbarButtonInternal";
