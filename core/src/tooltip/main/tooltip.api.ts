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

/**
 * Tooltip widget can be used to display elements and show plain strings
 * when the user hover over/ click the element on desktop and touch
 * the element on mobile device. It can be placed after input fields
 * or labels to provide more information to the user.
 */

import type { ReactElement, ReactNode } from "react";

import type { DataRole, Identifiable, Styleable } from "../../common/main/base-props.js";

/**
 * The props of Tooltip.
 */
export interface TooltipProps extends BaseTooltipProps {
	/**
	 * Children element passed by users.
	 */
	children: ReactElement;

	/**
	 * Variant of tooltip.
	 * @default undefined
	 */
	variant?: "success" | "hint" | "error" | "warning";
}

export interface BaseTooltipProps extends Styleable, Identifiable, DataRole {
	/**
	 * The text to display when the mouse hovers over/clicks the element.
	 */
	text: ReactNode;

	/**
	 * Disable the tooltip.
	 */
	disabled?: boolean;

	/**
	 * Specifies whether the trigger button of Hint, Success, Warning or Error Tooltip has inverted style for better contrast on the dark background.
	 */
	invert?: boolean;

	/**
	 * Specifies whether to use the desktop view on mobile devices.
	 */
	useDesktopView?: boolean;
}
