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
import { css, styled } from "styled-components";

import type { Container, DataRole, Identifiable, Styleable } from "../../../common/main/base-props.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { useDataTableContext } from "../data-table.context.js";

export const StyledDataTableFootRow = styled.tr.withConfig({ displayName: "StyledDataTableFootRow-sc-" })<{
	$useHighlightColor?: boolean;
}>(({ theme, $useHighlightColor }) => {
	const { table } = theme.components;

	return css`
		${$useHighlightColor &&
		css`
			background: ${table.footRow.highlightBG};
		`}
	`;
});

export interface DataTableFootRowTplProps extends Container, DataRole, Identifiable, Styleable {
	/** Highlights the footer row. Defaults to `true`. */
	useHighlightColor?: boolean;

	/**
	 * 1-based `aria-rowindex` (the last index in the grid). Set only for a windowed
	 * body (virtual/infinite scroll), where explicit row numbering must continue
	 * onto the footer; omitted for a fully-rendered table.
	 */
	ariaRowIndex?: number;
}

/**
 * DataTable table footer `<tr>`. Hosts a single row of footer cells.
 *
 * @experimental
 */
export function DataTableFootRowTpl({
	className,
	style,
	id,
	dataRole,
	useHighlightColor,
	ariaRowIndex,
	children
}: DataTableFootRowTplProps): ReactElement {
	// Card view renders the footer as a block, so neutralize the row with
	// `role="presentation"`. (tree)grid mode restates the suppressed native row
	// role; default view uses the implicit `row` role.
	const cardView = useDataTableContext((ctx) => ctx.cardView);
	const gridRole = useDataTableContext((ctx) => ctx.gridRole);

	return (
		<StyledDataTableFootRow
			className={className}
			style={style}
			id={id}
			data-role={dataRole ?? DataRoles.Table.Footer.Row}
			role={cardView ? "presentation" : gridRole ? "row" : undefined}
			aria-rowindex={ariaRowIndex}
			$useHighlightColor={useHighlightColor ?? true}
		>
			{children}
		</StyledDataTableFootRow>
	);
}

DataTableFootRowTpl.displayName = "DataTableFootRowTpl";
