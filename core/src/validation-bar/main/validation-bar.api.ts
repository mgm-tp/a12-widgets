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

import type { ReactNode, RefCallback } from "react";

import type { Container, Identifiable, Ref, Styleable } from "../../common/main/base-props.js";

/**
 * The severity level variant for the validation bar.
 */
export type ValidationBarVariant = "warning" | "error" | "info";

export interface ValidationBarProps extends Styleable, Identifiable, Container, Ref {
	/**
	 * Icon on the header of Validation Bar.
	 */
	icon?: ReactNode;

	/**
	 * Variant of the Validation Bar.
	 * @default error.
	 */
	variant?: ValidationBarVariant;

	/**
	 * Primary title will display on the header.
	 */
	primaryTitle?: ReactNode;

	/**
	 * Secondary title will display below primary title.
	 */
	secondaryTitle?: ReactNode;

	/**
	 * Menu for quick access actions.
	 */
	quickAccessMenu?: ReactNode;

	/**
	 * Pagination for the bar.
	 */
	pagination?: ReactNode;

	/**
	 * Autofocus when ValidationBar is mounted.
	 * @default true
	 */
	autoFocus?: boolean;

	/**
	 * Callback to get ref of the title.
	 */
	titleRef?: RefCallback<HTMLDivElement>;
}
