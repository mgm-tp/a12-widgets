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

import type { Container, DataRole, Identifiable, Styleable } from "../../../common/main/base-props.js";

import { useDataTableContext } from "../data-table.context.js";

export interface DataTableBodyTplProps extends Container, DataRole, Identifiable, Styleable {
	/**
	 * `data-role` for the `<tbody>`. Defaults to undefined — the non-virtualized
	 * `<tbody>` has no `data-role`, while virtualized/infinite-scroll bodies carry
	 * their own `Body.VirtualizedContainer` role.
	 */
	dataRole?: string;
}

/**
 * DataTable table `<tbody>` wrapper. Layout-only — visual styling lives in
 * descendant selectors on `StyledDataTable`.
 *
 * @experimental
 */
export function DataTableBodyTpl({ className, style, id, dataRole, children }: DataTableBodyTplProps): ReactElement {
	// Card view's `role="list"` root makes the implicit `<tbody>` rowgroup an
	// invalid child between the list and its `listitem` rows — neutralize with
	// `role="presentation"`. Default view uses the implicit `rowgroup` role.
	const cardView = useDataTableContext((ctx) => ctx.cardView);
	const gridRole = useDataTableContext((ctx) => ctx.gridRole);

	return (
		<tbody
			className={className}
			style={style}
			id={id}
			data-role={dataRole}
			role={cardView ? "presentation" : gridRole ? "rowgroup" : undefined}
		>
			{children}
		</tbody>
	);
}

DataTableBodyTpl.displayName = "DataTableBodyTpl";
