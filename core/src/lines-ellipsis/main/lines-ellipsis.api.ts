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

import type { ReactNode } from "react";

import type { Styleable, Container, Identifiable } from "../../common/main/base-props.js";

export interface LinesEllipsisProps extends Styleable, Identifiable, Container {
	/**
	 * The text you want to clamp.
	 *
	 * Notice: type React.ReactNode is valid only when {@link htmlSupport} is set to true.
	 */
	text: string | ReactNode;

	/**
	 * Number of lines allowed.
	 * @default 1
	 */
	maxLine?: number;

	/**
	 * Content of the ellipsis.
	 * @default "..."
	 */
	ellipsis?: ReactNode;

	/**
	 * Trim right the clamped text to avoid putting the ellipsis on an empty line.
	 * Note: does not work when {@link htmlSupport} is true.
	 * @default true
	 */
	trimRight?: boolean;

	/**
	 * Split by letters or words. By default it makes a guess based on your text.
	 */
	basedOn?: "letters" | "words";

	/**
	 * The tagName of the rendered node.
	 * @default "div"
	 */
	component?: string;

	/**
	 * Html truncation. This is still an experimental feature.
	 */
	htmlSupport?: boolean;

	/**
	 * A prop that enables or disables responsive behavior when the parent element is resized.
	 * @default true
	 */
	responsive?: boolean;

	/**
	 * Callback function invoked when the reflow logic complete.
	 */
	onReflow?(reflowState: { clamped: boolean; text: string }): void;
}
