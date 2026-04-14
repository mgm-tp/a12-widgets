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

import type { Container } from "./base-props.js";

/**
 * This component makes sure that the tab focus stay inside the component.
 * For example: in the modal overlay when you tab to the end and tab one more times, the focus will move
 * out of the modal, so use the TabSandbox component will solve this problem.
 */
export interface TabSandboxProps extends Container {
	/**
	 * Focus back to the previous active element.
	 */
	focusBack?: boolean;

	/**
	 * The previous active element will be focused if the component meets the below condition.
	 * Note: Just works if {@link focusBack} is true.
	 *
	 * @default unmounted
	 */
	focusBackIf?: "unmounted" | "tabOut" | "both";

	/**
	 * @default true
	 */
	focusOnOpen?: boolean;

	/**
	 * Define the container should have focus outline or not.
	 * @default 'none'. Set it to 'true' to keep the widget's outline.
	 */
	hasFocusStyle?: boolean;

	focusBackHandler?(handler: () => void): void;

	/**
	 * By default, focus will be put back to the container when tabbing out of the last element.
	 * Enable this flag to put focus back to the first interactive element inside the container.
	 */
	skipWrapperFocus?: boolean;
}
