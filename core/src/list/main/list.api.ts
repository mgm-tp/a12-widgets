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

import type {
	DetailedHTMLProps,
	ReactNode,
	MouseEvent,
	KeyboardEvent,
	FocusEvent,
	HTMLAttributes as ReactHTMLAttributes
} from "react";

import type {
	Container,
	Styleable,
	Identifiable,
	DataRole,
	Ref,
	HTMLAttributes
} from "../../common/main/base-props.js";

export interface ListProps extends Styleable, Container, Identifiable, DataRole, Ref<HTMLUListElement> {
	/**
	 * Whether the list has a border.
	 */
	border?: boolean;

	/**
	 * Whether a divider will be added below each item.
	 */
	divider?: boolean;

	/**
	 * Whether the position of the text and secondary text is reversed.
	 */
	flipped?: boolean;

	/**
	 * Whether the item's text should all be aligned with or without the graphic.
	 */
	paddedLeft?: boolean;

	/**
	 * Whether the item which doesn't have a meta will be aligned with the others.
	 */
	paddedRight?: boolean;

	/**
	 * tab-index attribute for the list.
	 */
	tabIndex?: number;

	/**
	 * role attribute for the list.
	 */
	role?: string;

	/**
	 * aria-control attribute for the list.
	 */
	ariaControls?: string;

	/**
	 * aria-describedby attribute for the list.
	 */
	ariaDescribedby?: string;

	/**
	 * A callback will be triggered on keydown event.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;
}

export interface ListItemProps extends Styleable, Identifiable, DataRole, Ref<HTMLLIElement>, HTMLAttributes {
	/**
	 * Displays an element before the text.
	 */
	graphic?: ReactNode;

	/**
	 * Displays an element after the text.
	 */
	meta?: ReactNode;

	/**
	 * Displays the primary information.
	 */
	text?: ReactNode;

	/**
	 * Displays the secondary information.
	 */
	secondaryText?: ReactNode;

	/**
	 * Whether the item is readonly.
	 */
	readonly?: boolean;

	/**
	 * Whether the item is disabled.
	 */
	disabled?: boolean;

	/**
	 * Whether a divider will be added below the item.
	 * - `true` or `false`: Standard boolean divider behavior
	 * - `"light"`: Light divider (1px, using divider.colorLight)
	 * - `"dark"`: Dark divider (2px, using divider.colorDark)
	 */
	divider?: boolean | "light" | "dark";

	/**
	 * Whether the item is being selected and indicates the current "pressed" state.
	 */
	selected?: boolean;

	/**
	 * Whether the position of {@link text} and {@link secondaryText} is reversed.
	 */
	flipped?: boolean;

	/**
	 * Uses the active style.
	 */
	active?: boolean;

	/**
	 * Button semantic style properties for preserving button appearance in list items.
	 * These properties are used when buttons are displayed as list items in popup menus.
	 */
	buttonSemantics?: {
		/**
		 * Whether the button is primary style.
		 */
		primary?: boolean;

		/**
		 * Whether the button is secondary style.
		 */
		secondary?: boolean;

		/**
		 * Whether the button has destructive style.
		 */
		destructive?: boolean;

		/**
		 * Whether the button is in active state.
		 */
		active?: boolean;

		/**
		 * Whether the button is icon-only.
		 */
		iconOnly?: boolean;
	};

	/**
	 * Preserves the main action font style (size, weight, text-transform, etc.) when the item is used in a popup menu.
	 * @internal
	 */
	preserveMainActionStyles?: boolean;

	/**
	 * Specifies the tabIndex attribute for the item.
	 */
	tabIndex?: number;

	/**
	 * Specifies the title attribute for the item.
	 */
	title?: string;

	/**
	 * Specifies the aria-label attribute for the item.
	 */
	ariaLabel?: string;

	/**
	 * Additional properties for the content wrapper.
	 */
	contentProps?: Identifiable & Ref<HTMLDivElement>;

	/**
	 * Additional properties for the graphic wrapper.
	 */
	graphicWrapperProps?: DetailedHTMLProps<ReactHTMLAttributes<HTMLDivElement>, HTMLDivElement>;

	/**
	 * Progressed percentage of the process.
	 * This property specifies the width of Progress Bar component.
	 * Recommend using when a user is in the action which needs to visualize the progression (ex: downloading, installing...).
	 */
	processedPercentage?: number;

	/** @internal */
	isIconButton?: boolean;

	/**
	 * A callback that will be triggered when the item is clicked.
	 */
	onClick?(event?: MouseEvent<HTMLElement>): void;

	/**
	 * A callback that will be triggered when moving the mouse pointer onto the item.
	 */
	onMouseOver?(event?: MouseEvent<HTMLElement>): void;

	/**
	 * A callback when pressing a mouse button over the item.
	 */
	onMouseDown?(event?: MouseEvent<HTMLElement>): void;

	/**
	 * A callback that will be triggered when the mouse pointer enters the item.
	 */
	onMouseEnter?(event?: MouseEvent<HTMLElement>): void;

	/**
	 * A callback that will be triggered when the mouse pointer leaves the item.
	 */
	onMouseLeave?(event?: MouseEvent<HTMLElement>): void;

	/**
	 * A callback that will be triggered when the item gets focus on.
	 */
	onFocus?(event?: FocusEvent<HTMLElement>): void;

	/**
	 * A callback that will be triggered when a key is pressed.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * A callback that will be triggered when a key is released.
	 */
	onKeyUp?(event: KeyboardEvent<HTMLElement>): void;
}

export interface ListSubHeaderProps extends Styleable, Identifiable, Container {
	/**
	 * Whether the sub-header has a background.
	 */
	fill?: boolean;

	/**
	 * Whether a divider will be added below the sub-header.
	 */
	divider?: boolean;

	/**
	 * Additional icon will be shown on the left of the title.
	 */
	graphic?: ReactNode;

	/**
	 * Additional icon will be shown on the right of the title.
	 */
	meta?: ReactNode;

	/**
	 * Title of the sub-header.
	 */
	title?: string;

	/**
	 * A handler for click event. If this property is passed, the sub-header will be interactive and have the hover and focus states.
	 */
	onClick?(event?: MouseEvent<HTMLElement>): void;

	/**
	 * A handler for key down event on the sub-header.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * A handler for key up event on the sub-header.
	 */
	onKeyUp?(event: KeyboardEvent<HTMLElement>): void;
}
