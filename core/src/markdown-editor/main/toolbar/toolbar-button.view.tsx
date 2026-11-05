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

import type { FC, MouseEvent, ReactNode } from "react";

import type { ButtonProps } from "../../../button/main/button.api.js";
import { Icon } from "../../../icon/main/icon.view.js";
import type { MarkdownEditorProps, MarkdownEditorToolbarContextValue } from "../markdown-editor.api.js";
import { useMarkdownEditorSurfaces } from "../shared/surfaces-context.js";
import { useMarkdownEditorToolbarState } from "../shared/toolbar-context.js";

import { StyledMarkdownToolbarButton } from "./toolbar.styled.js";

/**
 * {@link Button} props, with the icon required and the click handler optional: a
 * `PopUpMenu` supplies its own when the button is its trigger.
 */
export interface ToolbarButtonProps extends Omit<ButtonProps, "icon"> {
	/** The button icon: a string is a Material Symbols ligature name, any other node renders as-is. */
	icon: ReactNode;

	/** When true the button represents a toggle and exposes `aria-pressed` from {@link active}. */
	toggle?: boolean;
}

/**
 * An icon-only toolbar button built on the A12 {@link Button}. Toggle buttons
 * expose `aria-pressed`; command buttons omit it.
 *
 * Every other Button prop passes through, so it also works as a `PopUpMenu`
 * trigger: the menu's click handler and `aria-expanded` / `aria-haspopup` land
 * on the button unchanged.
 */
export const ToolbarButton: FC<ToolbarButtonProps> = ({ icon, active, toggle, onClick, buttonAttributes, ...rest }) => {
	// Stop the mousedown default, so clicking a toolbar control does not blur the editor
	// or drop the selection before the command runs.
	// The command then works on the text the user picked, no re-focusing needed.
	const handleMouseDown = (event: MouseEvent<HTMLElement>): void => {
		event.preventDefault();
	};

	const handleClick = (event: MouseEvent<HTMLElement>): void => {
		event.preventDefault();
		onClick?.(event);
	};

	return (
		<StyledMarkdownToolbarButton
			{...rest}
			icon={typeof icon === "string" ? <Icon>{icon}</Icon> : icon}
			active={active}
			onMouseDown={handleMouseDown}
			onClick={handleClick}
			buttonAttributes={toggle ? { ...buttonAttributes, "aria-pressed": !!active } : buttonAttributes}
		/>
	);
};

ToolbarButton.displayName = "MarkdownToolbarButton";

/**
 * The generic toolbar button for consumer-custom controls. It reads the toolbar
 * context and hands it to `onClick`, so custom controls can dispatch editor
 * commands (or source-mode edits) without any extra wiring, while behaving like
 * the built-in controls: selection is preserved on click, the surrounding
 * field's disabled state applies, and the button participates in the toolbar's
 * roving-tabindex keyboard navigation.
 */
export const CustomToolbarButton: FC<MarkdownEditorProps.ToolbarButtonProps> = ({
	icon,
	title,
	toggle,
	active,
	disabled,
	dataRole,
	onClick
}) => {
	const surfaces = useMarkdownEditorSurfaces();
	const toolbarState = useMarkdownEditorToolbarState();
	const context: MarkdownEditorToolbarContextValue = { ...surfaces, toolbarState };

	return (
		<ToolbarButton
			icon={icon}
			title={title}
			toggle={toggle}
			active={active}
			disabled={disabled || surfaces.disabled}
			onClick={() => onClick(context)}
			dataRole={dataRole}
		/>
	);
};

CustomToolbarButton.displayName = "MarkdownCustomToolbarButton";
