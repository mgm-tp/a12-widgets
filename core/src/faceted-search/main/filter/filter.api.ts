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

import type { ReactNode, MouseEvent, FocusEvent, RefCallback } from "react";

import type { Identifiable, Styleable } from "../../../common/main/base-props.js";

export interface FilterProps extends Styleable, Identifiable {
	/**
	 * Specifies whether the filter is activated.
	 * If true, the filter will have a border-left style.
	 */
	active?: boolean;

	/**
	 * The name of the filter.
	 */
	name: ReactNode;

	/**
	 * The options of the filter.
	 */
	options?: ReactNode;

	/**
	 * The element that overrides the default action element.
	 */
	customAction?: ReactNode;

	/**
	 * The separator between each {@link options}.
	 */
	separator?: ReactNode;

	/** Prefix element displayed before the filter name */
	prefix?: ReactNode;

	/**
	 * If true, when options are present, only the options will be displayed.
	 * The filter name will be moved to an interaction hint (tooltip).
	 * When no options are present, the filter name is always shown.
	 */
	compact?: boolean;

	/**
	 * If this property is set to true, the Filter will not have the close button.
	 */
	nonRemovable?: boolean;

	/**
	 * Specifies whether the Filter is disabled.
	 */
	disabled?: boolean;

	/**
	 * Specifies whether the Filter should have the aria-expanded attribute.
	 */
	ariaExpanded?: boolean;

	/**
	 * The function that will be fired when closing the Filter.
	 */
	onClose?(): void;

	/**
	 * The function that will be fired when clicking the Filter.
	 */
	onClick?(event: MouseEvent<HTMLElement>): void;

	/**
	 * The function that will be fired when the Filter receives focus.
	 */
	onFocus?(event: FocusEvent<HTMLElement>): void;

	/**
	 * The reference of the Filter's wrapper.
	 */
	filterRef?: RefCallback<HTMLDivElement>;
}
