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
import { styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";

import { useDataTableContext } from "../data-table.context.js";

/**
 * Header row used when `column.subColumns` is present — one native `<tr>` per
 * header depth. Group/leaf cells span via real `colSpan`/`rowSpan` attributes
 * (set by the head-cell template), so this is a plain table row with no extra
 * layout of its own.
 */
export const StyledDataTableHeadGroupRow = styled.tr.withConfig({ displayName: "StyledDataTableHeadGroupRow-sc-" })`
	background: ${({ theme }) => theme.components.table.header.background};
`;

export interface DataTableHeadGroupRowTplProps {
	/**
	 * 1-based `aria-rowindex` (typically the depth index + 1). Set only for a
	 * windowed body (virtual/infinite scroll); omitted for a fully-rendered table.
	 */
	ariaRowIndex?: number;

	/** Header cells belonging to this depth. */
	children?: ReactNode;
}

/**
 * Multi-row header `<tr>` (one per depth when columns have `subColumns`).
 * Relies on the native `<tr>`'s implicit `row` role.
 *
 * @experimental
 */
export function DataTableHeadGroupRowTpl({ ariaRowIndex, children }: DataTableHeadGroupRowTplProps): ReactElement {
	// In (tree)grid mode restate the suppressed native header-row role.
	const gridRole = useDataTableContext((ctx) => ctx.gridRole);

	return (
		<StyledDataTableHeadGroupRow
			data-role={DataRoles.Table.Header.Row}
			role={gridRole ? "row" : undefined}
			aria-rowindex={ariaRowIndex}
		>
			{children}
		</StyledDataTableHeadGroupRow>
	);
}

DataTableHeadGroupRowTpl.displayName = "DataTableHeadGroupRowTpl";
