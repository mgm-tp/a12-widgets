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
 * This ApplicationHeader widget is useful for displaying information like application logo,
 * application name, version or user information on top of the page.
 */
import type { ReactNode } from "react";

import type { Identifiable, Styleable } from "../../common/main/base-props.js";

/**
 * The props of ApplicationHeader.
 */
export interface ApplicationHeaderProps extends Identifiable, Styleable {
	/**
	 * Elements to be placed on the left of ApplicationHeader.
	 * This can be used to show application logo, name or the hamburger menu in the mobile mode.
	 */
	leftSlots?: ReactNode;

	/**
	 * Elements to be placed on the right of ApplicationHeader.
	 * This can be used to show application version, username, logout button action and the popup menu due to the limited space on mobile phone.
	 */
	rightSlots?: ReactNode;

	/**
	 * The ARIA role of the ApplicationHeader.
	 * @see [Roles]{@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles}
	 * @default "banner"
	 */
	role?: string;
}
