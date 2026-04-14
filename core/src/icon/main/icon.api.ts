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

import type { RefCallback, MouseEvent } from "react";

import type { Styleable, Container, Identifiable, DataRole, HTMLAttributes } from "../../common/main/base-props.js";

/**
 * The icon widget wraps HTML <i> element.
 * By default, it shows the corresponding icon from The Material Icons (https://design.google.com/icons/).
 */

export interface IconProps extends Styleable, Identifiable, Container, DataRole, HTMLAttributes {
	/**
	 * Specifies the title attribute for the icon.
	 */
	title?: string;

	/**
	 * If true, the title will be shown as a tooltip, otherwise, it will not be shown but still be able to read it by screen readers.
	 * @default true
	 */
	showTitleAsTooltip?: boolean;

	/**
	 * Icon theme to use for rendering the icon.
	 *
	 * - `filled`: Solid filled icons from Material Icons
	 * - `outlined`: Outlined/stroke-based icons from Material Icons
	 * - `rounded`: Rounded corner variant from Material Icons
	 * - `custom`: Custom icon implementations
	 *
	 * @default 'filled'
	 * @see [filled]{@link https://fonts.google.com/icons?selected=Material+Icons&icon.style=Filled}
	 * @see [outlined]{@link https://fonts.google.com/icons?selected=Material+Icons&icon.style=Outlined}
	 * @see [custom]{@link #/widgets/general/icon#custom-icons}
	 * @remarks
	 * The 'rounded' theme option was added to support Material Icons rounded variant.
	 */
	iconTheme?: IconTheme;

	/**
	 * The ref to the icon.
	 */
	iconRef?: RefCallback<HTMLElement>;

	/**
	 * Defines the font-size of the icon.
	 * @default medium
	 */
	size?: "medium" | "big";

	/**
	 * Variant of the icon.
	 * @default no variant
	 */
	variant?: "info" | "success" | "warning" | "error";

	/**
	 * A callback will be triggered when the icon is clicked by mouse.
	 */
	onClick?(event: MouseEvent): void;
}

export type IconTheme = "filled" | "outlined" | "rounded" | "custom";

export interface IconMappingDefinition {
	/**
	 * The icon will be replaced.
	 */
	originalIcon: string;

	/**
	 * The icon that will be shown.
	 */
	mappedIcon: string;

	/**
	 * Specifies theme for the icon.
	 */
	theme?: IconTheme;
}
