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
import { useContext, useRef, useMemo } from "react";
import { styled, css } from "styled-components";

import { joinClassNames, getRole } from "../../../common/main/utils.js";
import { useTableContext } from "../../new-api/table.context.js";
import { StyledContentBoxContext } from "../../../contentbox/main/template/contentbox.context.js";
import { StyledContentBox, StyledContentBoxContent } from "../../../contentbox/main/template/contentbox.tpl.styled.js";

import { BASE_TABLE_CLASSNAME } from "../table.internal.js";

import type { TableTemplateProps } from "./table.tpl.api.js";
import { StyledBaseTable, StyledTableMixins } from "./table.styled.js";

export const StyledTableHeadRow = styled(StyledBaseTable.Row).withConfig({ displayName: "StyledTableHeadRow-sc-" })<{
	cardView?: boolean;
	$embedded?: boolean;
}>(({ theme, cardView, $embedded: embedded }) => {
	const { headRow, header } = theme.components.table;
	const { contentBox } = theme.components;

	return css`
		border-bottom: ${headRow.borderBottom};
		overflow: hidden;
		display: ${cardView && "none"};

		${StyledTableMixins.setRowBG({ background: header.background, theme })}
		${StyledTableMixins.setInputBG({ background: headRow.filter.fieldInputBG })}

		${embedded &&
		css`
			${StyledContentBox} > ${StyledContentBoxContent} && {
				background-color: ${contentBox.embedded.table.header.background};
				&:first-child {
					border-top: ${contentBox.embedded.table.header.borderTop};
				}
			}
		`}
	`;
});

export function HeadRowTpl(props: TableTemplateProps.HeadRowProps): ReactElement<TableTemplateProps.HeadRowProps> {
	const ref = useRef<HTMLDivElement | null>(null);
	const classNames = useMemo(() => {
		return joinClassNames(`${BASE_TABLE_CLASSNAME}__headerRow`, props.className);
	}, [props.className]);
	const cardView = useTableContext((context) => context.cardView);
	const { embedded } = useContext(StyledContentBoxContext);

	return (
		<StyledTableHeadRow
			ref={ref}
			className={classNames}
			style={props.style}
			id={props.id}
			data-role={props.dataRole || "table-header-row"}
			role={getRole(props.role, "row")}
			cardView={cardView}
			$embedded={embedded}
		>
			{props.children}
		</StyledTableHeadRow>
	);
}

HeadRowTpl.displayName = "HeadRowTpl";
