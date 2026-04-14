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

import type { HTMLAttributes, MouseEvent, KeyboardEvent, FocusEvent } from "react";

import type { Container, DataRole, Identifiable, Styleable } from "../../common/main/base-props.js";

export interface InteractiveTileProps extends Styleable, Identifiable, Container, DataRole {
	/**
	 * Specifies whether the tile is a primary tile.
	 */
	primary?: boolean;

	/**
	 * Specifies whether the tile is a secondary tile.
	 *
	 * *Note:* If neither the {@link primary} nor {@link secondary} is specified, the tile is still styled as a secondary tile.
	 */
	secondary?: boolean;

	/**
	 * Specifies whether the tile is activated. If it is true, the tile will have a specific color at:
	 * - Background color on {@link primary} tile.
	 * - Text color on {@link secondary} tile.
	 */
	active?: boolean;

	/**
	 * Specifies whether the tile is selected.
	 * If a tile is selected, a checkmark icon will appear in its top-right corner.
	 */
	selected?: boolean;

	/**
	 * Specifies whether the tile is disabled.
	 */
	disabled?: boolean;

	/**
	 * Specifies the tabIndex attribute for the tile.
	 */
	tabIndex?: number;

	/**
	 * Specifies the title attribute that will be shown when hovering the tile.
	 */
	title?: string;

	/**
	 * Specifies whether to disable the aria-label attribute.
	 * When set to `true` and interaction hint is enabled, a {@link HiddenText} for title will be displayed instead.
	 */
	disableAriaLabel?: boolean;

	/**
	 * Additional HTML attributes that can be passed to the tile.
	 */
	htmlAttributes?: HTMLAttributes<HTMLElement>;

	/**
	 * Click handler for the tile.
	 * @param event – HTML mouse event.
	 */
	onClick?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Mouse over handler for the tile.
	 * @param event – HTML mouse event.
	 */
	onMouseOver?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Mouse leave handler for the tile.
	 * @param event – HTML mouse event.
	 */
	onMouseLeave?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Mouse down handler for the tile.
	 * @param event – HTML mouse event.
	 */
	onMouseDown?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Key down handler for the tile.
	 * @param event – HTML key event.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * Key up handler for the tile.
	 * @param event – HTML key event.
	 */
	onKeyUp?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * Focus handler for the tile.
	 * @param event – HTML focus event
	 */
	onFocus?(event: FocusEvent<HTMLElement>): void;

	/**
	 * Blur handler for the tile.
	 * @param event – HTML focus event.
	 */
	onBlur?(event: FocusEvent<HTMLElement>): void;
}
