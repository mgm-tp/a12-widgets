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
import { styled, css } from "styled-components";

import { joinClassNames, getHorizontalSpace, getRole } from "../../../common/main/utils.js";

import { BASE_TABLE_CLASSNAME } from "../table.internal.js";

import type { TableTemplateProps } from "./table.tpl.api.js";
import { StyledTableExpandableRowFooter } from "./table.expandable-row-footer.tpl.view.js";
import { StyledTableBodyRowSegment } from "./table.body-row-segment.tpl.view.js";
import { StyledTableMixins } from "./table.styled.js";

export const StyledTableExpandableRowBody = styled.div.withConfig({ displayName: "StyledTableExpandableRowBody-sc-" })(
	({ theme }) => {
		const { expandable, bodyRow, bodyCell } = theme.components.table;

		return css`
			max-height: 100%;
			padding: ${expandable.body.padding};
			& + ${StyledTableExpandableRowFooter} {
				border-top: ${bodyRow.borderBottom};
			}
			${StyledTableBodyRowSegment}:first-child & {
				${StyledTableMixins.setFirstCellSpacing({ theme, expandableCell: true })};
			}
			padding-left: calc(${bodyCell.firstMarginLeft} + ${getHorizontalSpace("left", expandable.body.padding)});
		`;
	}
);

export function ExpandableRowBodyTpl(props: TableTemplateProps.ExpandableRowBodyProps): ReactElement {
	const { className, wrapperRef, role, ...rest } = props;

	return (
		<StyledTableExpandableRowBody
			className={joinClassNames(`${BASE_TABLE_CLASSNAME}__expandable-row-body`, props.className)}
			ref={props.wrapperRef}
			role={getRole(props.role)}
			data-role={props.dataRole ?? "table-expandable-row-body"}
			{...rest}
		/>
	);
}

ExpandableRowBodyTpl.displayName = "ExpandableRowBodyTpl";
