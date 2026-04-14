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
 * This is the props of the Global Message Box widget which will be used above the Application Header.
 * @module
 */
import type { ReactNode } from "react";

import type { Identifiable, Styleable } from "../../common/main/base-props.js";

export type GlobalMessageBoxVariant = "info" | "success" | "warning" | "error";

export interface GlobalMessageBoxProps extends Identifiable, Styleable {
	/**
	 * Specifies the global message box's variant.
	 * @default "info"
	 */
	variant?: GlobalMessageBoxVariant;

	/**
	 * Specifies whether the global message box is in one line.
	 * @default true
	 */
	ellipsis?: boolean;

	/**
	 * Specifies the global message box's content.
	 */
	content?: ReactNode;

	/**
	 * Specifies the icon that will be rendered on the left of the global message box.
	 * @default variant's icon
	 */
	icon?: ReactNode;

	/**
	 * Specifies actions that will be rendered on the right of the global message box.
	 */
	actions?: ReactNode;

	/**
	 * Set invisible focus on the global message box when it has finished rendering to support A11Y.
	 * In case of multiple boxes, to make sure there is only 1 box has focused, set this to "false" for the others.
	 * @default true
	 */
	focusOnMount?: boolean;

	/**
	 * The value of "role" attribute of content, will be placed at the {@link content}'s wrapper.
	 * - If set value as string, apply that value for role.
	 * - If set to false, will not apply role.
	 *
	 * @default "heading"
	 */
	role?: string | false;

	/**
	 * Value for "aria-level" attribute of content, will be placed at the {@link content}'s wrapper.
	 * The value should be greater than 0.
	 * If the {@link role} is set to false, the aria-level will NOT be set either.
	 *
	 * @default 2
	 */
	ariaLevel?: number;
}
