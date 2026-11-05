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
import { Key } from "ts-key-enum";

import { AttachedPortal } from "../../../attached-portal/main/attached-portal.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { List } from "../../../list/main/list.view.js";

import { StyledMarkdownEditorContextMenu } from "./context-menu.styled.js";

const ENABLED_ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])';

/**
 * How far from the pointer the menu opens. Opened right under the pointer,
 * the first item is the thing the pointer sits on:
 * it lights up as hovered and the next click runs it without the user picking it.
 */
export const POINTER_OFFSET = { left: 10, top: 10 };

/** One line of a context menu. */
export interface ContextMenuOperation {
	key: string;
	label?: string;

	/** Material Symbols ligature name. */
	icon: string;
	disabled?: boolean;
	run: () => void;
}

interface EditorContextMenuProps {
	/** Viewport coordinates, already moved off the pointer by {@link POINTER_OFFSET}. */
	position: { top: number; left: number };

	operations: ContextMenuOperation[];

	/** data-role of the menu itself. */
	listDataRole: string;

	/** data-role of every item. */
	itemDataRole: string;

	/** The user clicked away. Close the menu and leave focus where the click put it. */
	onClickOutside: () => void;

	/** An item ran, or Escape was pressed. Close the menu and put the caret back in the text. */
	onRequestClose: () => void;
}

/** The next index after a step of `offset`, wrapping around at both ends. */
function wrapIndex(current: number, offset: number, length: number): number {
	if (length === 0) {
		return -1;
	}

	// `current` is -1 when focus is not on an item yet, so a step forward opens at the first.
	return (current + offset + length) % length;
}

/**
 * The floating menu a right-click inside the editor opens.
 *
 * It only draws the menu and works the keys. What the menu is about — a table cell,
 * an image — is the caller's business: it finds the target, builds the operations
 * and decides where the menu opens.
 */
export const EditorContextMenu: FC<EditorContextMenuProps> = ({
	position,
	operations,
	listDataRole,
	itemDataRole,
	onClickOutside,
	onRequestClose
}) => {
	/** Up and Down walk the items that are switched on, and wrap around at both ends. */
	const moveFocus = (menu: HTMLElement, offset: number): void => {
		const items = [...menu.querySelectorAll<HTMLElement>(ENABLED_ITEM_SELECTOR)];
		const current = items.indexOf(document.activeElement as HTMLElement);

		items[wrapIndex(current, offset, items.length)]?.focus();
	};

	const onKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
		if (event.key === Key.Escape) {
			onRequestClose();

			return;
		}

		const offset = { [Key.ArrowDown]: 1, [Key.ArrowUp]: -1 }[event.key];

		if (offset === undefined) {
			return;
		}

		event.preventDefault();
		moveFocus(event.currentTarget, offset);
	};

	return (
		<AttachedPortal
			position={position}
			adjustPositionToScreen
			closeOnOutsideClick
			// The portal's own Escape only hides the portal. It would leave the caller's open state set,
			// so the menu would look closed while it is still open and focus would stay in a dead portal.
			// `onKeyDown` below handles Escape instead: it closes for real and puts the caret back in the text.
			closeOnEsc={false}
			onClickOutside={onClickOutside}
			onKeyDown={onKeyDown}
		>
			<StyledMarkdownEditorContextMenu role="menu" dataRole={listDataRole}>
				{operations.map((operation) => (
					<List.Item
						key={operation.key}
						htmlAttributes={{ role: "menuitem" }}
						dataRole={itemDataRole}
						text={operation.label}
						graphic={<Icon>{operation.icon}</Icon>}
						disabled={operation.disabled}
						onClick={() => {
							operation.run();
							onRequestClose();
						}}
					/>
				))}
			</StyledMarkdownEditorContextMenu>
		</AttachedPortal>
	);
};

EditorContextMenu.displayName = "MarkdownEditorContextMenu";
