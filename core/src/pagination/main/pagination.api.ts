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
 * This pagination widget can display page navigation control:
 * first, last, next, previous. User can also go directly to a page from the dropdown list.
 *
 * Encapsulates the communicates with the Pagination and is part of its {@link PaginationProps}.
 */

import type { Identifiable, Styleable } from "../../common/main/base-props.js";
import type { ButtonProps } from "../../button/main/button.api.js";

/**
 * The props of Pagination.
 */
export interface PaginationProps extends Styleable, Identifiable {
	/**
	 * Specifies whether the Pagination is disabled.
	 */
	disabled?: boolean;

	/**
	 * Specifies whether the Pagination has an alignment.
	 */
	alignment?: "left" | "right";

	/**
	 * Specifies the current page number.
	 * It has to be a positive integer that is not bigger than the {@link pageCount}.
	 */
	currentPage: number;

	/**
	 * Handler function when the page changed.
	 */
	onPageChanged(page: number): void;

	/**
	 * Specifies the total number of pages.
	 */
	pageCount: number;

	/**
	 * Specifies the page's label template.
	 * For example: `"{page} / {total}"`.
	 */
	pageLabelTemplate: string;

	/**
	 * Specifies the type of the Pagination.
	 * @default default
	 */
	type?: "default" | "simple";

	/**
	 * Specifies the additional props for the "Next page" button.
	 */
	nextButtonProps?: ButtonProps;

	/**
	 * Specifies the additional props for the "Previous page" button.
	 */
	previousButtonProps?: ButtonProps;
}
