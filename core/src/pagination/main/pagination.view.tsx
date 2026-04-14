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

import type { ReactElement } from "react";

import type { PaginationProps } from "./pagination.api.js";
import { DefaultPagination } from "./default-pagination.view.js";
import { SimplePagination } from "./simple-pagination.view.js";

/**
 * The {@link Pagination} is a simple page selector widget.
 *
 * **Note:** Every {@link Pagination} must be surrounded with a {@link Clearfix}. In case of consecutive elements,
 * they must be contained within the same {@link Clearfix} and elements with alignment "right" should be positioned
 * after groups with alignment "left" in the DOM, so that the visual order matches the DOM and hence the tab order.
 */
export function Pagination(props: PaginationProps): ReactElement<PaginationProps> {
	const { type, ...rest } = props;

	return type === "simple" ? <SimplePagination {...rest} /> : <DefaultPagination {...rest} />;
}

Pagination.displayName = "Pagination";
