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
import { useMemo } from "react";
import { styled, css } from "styled-components";

import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { useTableContext } from "../table.context.js";
import { BASE_TABLE_CLASSNAME } from "../table.internal.js";

import { HeadRowTpl } from "./table.head-row.tpl.view.js";
import type { TableTemplateProps } from "./table.tpl.api.js";
import { StyledTableContextProvider, useOptimalTableContextValue } from "./table.context.styled.js";

export const StyledTableHeadFilterRow = styled(HeadRowTpl).withConfig({ displayName: "StyledTableHeadFilterRow-sc-" })<{
	cardView?: boolean;
}>(({ theme, cardView }) => {
	const { headRow } = theme.components.table;

	return css`
		background-color: inherit;
		border-bottom: ${headRow.filter.borderBottom};
		${cardView &&
		css`
			display: block;
			border: none;

			// Specific style for FILTER
			padding-right: 0;
			[data-role="${DataRoles.Table.Header.Row.SegmentLeft}"] {
				&.${addPrefix("h_hidden")} {
					display: block;
				}
				[data-role="${DataRoles.Table.Header.Cell}"] {
					padding-top: 10px;
				}
			}
			[data-role="${DataRoles.Table.Header.Cell}"] {
				width: 100%;
			}
		`}
	`;
});

export function HeadFilterRowTpl(props: TableTemplateProps.BaseProps): ReactElement<TableTemplateProps.BaseProps> {
	const classNames = useMemo(() => {
		return joinClassNames(`${BASE_TABLE_CLASSNAME}__headerRow--filter`, props.className);
	}, [props.className]);
	const cardView = useTableContext((context) => context.cardView);

	const contextValue = useOptimalTableContextValue({ header: { filterRow: true } });

	return (
		<StyledTableContextProvider value={contextValue}>
			<StyledTableHeadFilterRow
				className={classNames}
				style={props.style}
				id={props.id}
				dataRole={props.dataRole || "table-header-row--filter"}
				cardView={cardView}
			>
				{props.children}
			</StyledTableHeadFilterRow>
		</StyledTableContextProvider>
	);
}

HeadFilterRowTpl.displayName = "HeadFilterRowTpl";
