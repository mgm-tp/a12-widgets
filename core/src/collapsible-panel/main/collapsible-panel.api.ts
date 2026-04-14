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
 * This collapsible panel widget is able to collapse or expand to hide/show the content inside the panel.
 * @module
 */
import type { ReactNode } from "react";

import type { Identifiable, Styleable, Container } from "../../common/main/base-props.js";

export interface CollapsiblePanelProps extends Identifiable, Styleable, Container {
	/**
	 * The title of the CollapsiblePanel.
	 */
	title?: ReactNode;

	/**
	 * Additional information that will be placed at the end of the {@link title} .
	 */
	addons?: ReactNode;

	/**
	 * Is called when the panel is clicked.
	 */
	onClick(): void;

	/**
	 * Additional information that will be printed next to the title.
	 */
	info?: string;

	/**
	 * Value of role attribute, in order to support Accessibility.
	 * @see [Roles]{@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles}
	 */
	role?: string;

	/**
	 * Define the aria level of title by the integer number
	 */
	ariaLevel?: number;

	/**
	 * Whether the position of addons will be swapped with the collapsed icon (arrow icon).
	 */
	swapAddonsPosition?: boolean;
}
