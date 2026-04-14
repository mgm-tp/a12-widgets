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

import type { FC, KeyboardEvent } from "react";
import { useState, useRef, useCallback, isValidElement, cloneElement } from "react";
import { Key } from "ts-key-enum";

import { moveItemFocusBack, moveItemFocusNext } from "../../../../common/main/utils.js";
import { StyledEditorToolbar } from "../../rich-text-editor.styled.js";
import { DataRoles } from "../../../../common/main/data-roles.js";

import type { BaseStaticToolbarProps } from "./static-toolbar.api.js";
import { ButtonType } from "./toolbar-button/toolbar-button.api.js";

export const ToolbarPlugin: FC<BaseStaticToolbarProps> = (props: BaseStaticToolbarProps) => {
	const [currentFocusedItemIndex, setCurrentFocusedItemIndex] = useState(0);
	const toolbarWrapperRef = useRef<HTMLElement | null>(null);

	const getToolbarWrapperRef = useCallback((instance: HTMLElement | null): void => {
		if (instance) {
			toolbarWrapperRef.current = instance;
		}
	}, []);

	const getCurrentFocusedElementIndex = useCallback((): number => {
		const elements = toolbarWrapperRef.current?.querySelectorAll(`[data-role=${DataRoles.RichTextEditor.ToolbarItem}]`);

		if (!elements || elements.length === 0 || !document.activeElement) {
			return 0;
		}

		const toolbarItems = Array.from(elements);

		return toolbarItems.indexOf(document.activeElement.parentElement as Element);
	}, []);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>): void => {
			if (!toolbarWrapperRef.current?.contains(document.activeElement)) {
				return;
			}

			if (event.key === Key.ArrowLeft || event.key === Key.ArrowRight) {
				event.preventDefault();
				const moveFocus = event.key === Key.ArrowLeft ? moveItemFocusBack : moveItemFocusNext;
				moveFocus(toolbarWrapperRef.current, document.activeElement, "[tabindex]");

				setCurrentFocusedItemIndex(getCurrentFocusedElementIndex());
			}
		},
		[getCurrentFocusedElementIndex]
	);

	return (
		<StyledEditorToolbar
			style={props.style}
			id={props.id}
			role="toolbar"
			ariaControls={props.ariaControls}
			ariaDescribedby={props.ariaDescribedby}
			wrapperRef={getToolbarWrapperRef}
			onKeyDown={handleKeyDown}
			dataRole={DataRoles.RichTextEditor.Toolbar}
		>
			{props.items.map((ItemRenderer, index) => {
				if (isValidElement(ItemRenderer)) {
					return cloneElement(ItemRenderer, {
						dataRole: DataRoles.RichTextEditor.ToolbarItem,
						tabIndex: currentFocusedItemIndex === index ? 0 : undefined
					});
				}

				const Component = ButtonType.isInstance(ItemRenderer) ? ItemRenderer.component : ItemRenderer;

				return (
					<Component
						key={index}
						dataRole={DataRoles.RichTextEditor.ToolbarItem}
						tabIndex={currentFocusedItemIndex === index ? 0 : undefined}
					/>
				);
			})}
		</StyledEditorToolbar>
	);
};

ToolbarPlugin.displayName = "ToolbarPlugin";
