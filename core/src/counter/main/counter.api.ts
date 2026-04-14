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
 * The counter widget wraps HTML <span> element.
 * @module
 */
import type { ReactNode, MouseEvent } from "react";

import type { Identifiable, Styleable, DataRole, HTMLAttributes } from "../../common/main/base-props.js";

/**
 * The props of Counter.
 */
export interface CounterProps extends Styleable, Identifiable, DataRole, HTMLAttributes {
	/**
	 * Specifies the value to show in the counter.
	 */
	value?: string | number;

	/**
	 * Specifies the placeholder text that will be shown when the {@link value} is undefined.
	 */
	placeholder?: string;

	/**
	 * Specifies an addon element that will be placed before the {@link value}.
	 * For example: Icon widget
	 */
	addonBefore?: ReactNode;

	/**
	 * Specifies an addon element that will be placed after the {@link value}.
	 * For example: Icon widget
	 */
	addonAfter?: ReactNode;

	/**
	 * Specifies the hint text that will be shown on mouse over event.
	 */
	title?: string;

	/**
	 * Specifies the variant of the Counter.
	 * @default default
	 */
	type?: "default" | "constructive" | "destructive";

	/**
	 * Specifies whether the Counter is secondary or not.
	 * @default false
	 */
	secondary?: boolean;

	/**
	 * Specifies the max value that should be shown.
	 */
	overflowCount?: number;

	/**
	 * Specifies whether the Counter is interactive or not.
	 * @default false
	 */
	interactive?: boolean;

	/**
	 * Specifies the hidden information to describe the counter. It will be read by screen readers before reading counter value.
	 */
	hiddenDescription?: string;

	/**
	 * Mouse over handler for counter.
	 * @param event – HTML mouse event.
	 */
	onMouseOver?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Mouse leave handler for counter.
	 * @param event – HTML mouse event.
	 */
	onMouseLeave?(event: MouseEvent<HTMLElement>): void;
}
