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

import type { ReactElement, ReactNode } from "react";
import { css, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";

import { useDataTableContext } from "../data-table.context.js";

export const StyledDataTableHeadRow = styled.tr.withConfig({ displayName: "StyledDataTableHeadRow-sc-" })(
	({ theme }) => {
		const { table } = theme.components;

		return css`
			background: ${table.header.background};
		`;
	}
);

export interface DataTableHeadRowTplProps {
	/**
	 * 1-based `aria-rowindex` for the single header row. Set only for a windowed
	 * body (virtual/infinite scroll); omitted for a fully-rendered table.
	 */
	ariaRowIndex?: number;

	/** Header cells. */
	children?: ReactNode;
}

/**
 * Single-row header `<tr>` (no grouped columns; for grouped headers see
 * `DataTableHeadGroupRowTpl`).
 *
 * @experimental
 */
export function DataTableHeadRowTpl({ ariaRowIndex, children }: DataTableHeadRowTplProps): ReactElement {
	// (tree)grid mode overrides the table role, dropping the native `<tr>` row
	// mapping, so restate it as `role="row"`.
	const gridRole = useDataTableContext((ctx) => ctx.gridRole);

	return (
		<StyledDataTableHeadRow
			data-role={DataRoles.Table.Header.Row}
			role={gridRole ? "row" : undefined}
			aria-rowindex={ariaRowIndex}
		>
			{children}
		</StyledDataTableHeadRow>
	);
}

DataTableHeadRowTpl.displayName = "DataTableHeadRowTpl";
