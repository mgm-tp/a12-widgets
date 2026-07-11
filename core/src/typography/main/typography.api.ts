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

import type { FocusEvent, ReactNode, SyntheticEvent } from "react";

import type { Identifiable, Styleable, Container, Ref } from "../../common/main/base-props.js";

export interface BaseTypographyProps extends Identifiable, Styleable, Container {
	/**
	 * Specifies whether the typography has a inline color
	 */
	color?: string;

	/**
	 * Specifies whether the typography has an alignment.
	 * @default "left"
	 */
	alignment?: "left" | "right" | "center";
}

export interface SectionProps extends Identifiable, Styleable, Container {
	/**
	 * Aria-role for the section
	 */
	role?: string;

	/**
	 * Focus event handler forwarded to the underlying div element.
	 */
	onFocus?: (event: FocusEvent<HTMLElement>) => void;
}

export interface HeadlineProps extends BaseTypographyProps {
	/**
	 * Level of the headline. Used for styling purpose only. This mean you can use an h6 and make it looks like an h1.
	 */
	level: 1 | 2 | 3 | 4 | 5;

	/**
	 * Aria level used for accessibility.
	 */
	ariaLevel?: number;

	/**
	 * Define specific HTML tag for the headline
	 * @default "div"
	 *
	 * *Note:* Since every element inside this HTML tag is "div", htmlTag should be a block element, otherwise there'll be a syntax error.
	 */
	htmlTag?: string;

	/**
	 * Default icon for expanding for the typography.
	 * @default `keyboard_arrow_right`
	 */
	expandIcon?: ReactNode;

	/**
	 * Default icon for collapsing for the typography.
	 * @default `keyboard_arrow_down`
	 */
	collapseIcon?: ReactNode;

	/**
	 * Specifies whether the typography has a divider.
	 */
	divider?: boolean;

	/**
	 * Specifies whether the typography is collapsible.
	 */
	collapsible?: boolean;

	/**
	 * Specifies whether the collapsible typography is collapsed.
	 */
	collapsed?: boolean;

	/**
	 * Displays additional information after the headline.
	 */
	info?: ReactNode;

	/**
	 * Displays actions or other information after the headline.
	 */
	addons?: ReactNode;

	/**
	 * Action buttons/icons to be displayed in the header section.
	 * These will be rendered with proper hover and focus states.
	 */
	headerActions?: ReactNode;

	/**
	 * Enable compact mode with no background colors, only border on hover and focus.
	 */
	compact?: boolean;

	/**
	 * Used to offer additional functionality such as ids or refs.
	 */
	titleProps?: HeadlineTitleProps;

	/**
	 * Whether the position of {@link addons} will be swapped with graphic icon ({@link expandIcon} or {@link collapseIcon}).
	 */
	swapAddonsPosition?: boolean;

	/**
	 * Specifies where the {@link addons} and graphic icon ({@link expandIcon} or {@link collapseIcon}) will be positioned vertically.
	 *
	 * @default "top"
	 */
	iconVerticalAlignment?: IconVerticalAlignment;

	/**
	 * Handler for when toggling the collapsed state.
	 */
	onCollapsingChange?(event: SyntheticEvent): void;
}

export type HeadlineTitleProps = Identifiable & Ref;

export type BodyProps = BaseTypographyProps;

export type IconVerticalAlignment = "top" | "middle" | "bottom";
