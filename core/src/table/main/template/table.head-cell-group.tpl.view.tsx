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
import { memo } from "react";
import { styled, css } from "styled-components";

import { joinClassNames } from "../../../common/main/utils.js";
import { createPseudoElement } from "../../../theme/base/mixins/_pseudo.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { useTableContext } from "../table.context.js";
import { BASE_TABLE_CLASSNAME } from "../table.internal.js";

import type { TableTemplateProps } from "./table.tpl.api.js";
import { StyledBaseTable } from "./table.styled.js";

const StyledTableHeaderGroupChildren = styled.div.withConfig({ displayName: "StyledTableHeaderGroupChildren-sc-" })(
	({ theme }) => {
		const { headCellGroup } = theme.components.table;

		return css`
			display: flex;
			// Horizontal border
			&:before {
				border-top: ${headCellGroup.gapForSingle};
				content: "";
				display: block;
				left: 0;
				position: absolute;
				right: 0;
				top: 0;
			}
			& > [data-role="${DataRoles.Table.Header.Cell}"]:last-child:focus:before {
				right: 2px;
			}
		`;
	}
);

export const StyledTableHeadCellGroup = styled(StyledBaseTable.Group).withConfig({
	displayName: "StyledTableHeadCellGroup-sc-"
})<{
	resizable?: boolean;
}>(({ theme, resizable }) => {
	const { headCellGroup } = theme.components.table;

	return css`
		flex-direction: column;
		position: relative;
		[data-role*="group-parent"],
		${StyledTableHeaderGroupChildren} {
			max-width: fit-content;
			min-width: 100%;
			position: relative;
		}
		[data-role*="group-parent"] {
			flex-basis: auto;
			flex-grow: 1;
			width: auto;
		}
		${!resizable &&
		css`
			${createPseudoElement(
				":after",
				css`
					display: block;
					left: unset;
					border-right: ${headCellGroup.gapForGroup};
				`
			)}
			&:focus:after {
				border-color: transparent;
			}
		`}
	`;
});

export const HeadCellGroupTpl = memo(function HeadCellGroupTpl(
	props: TableTemplateProps.HeadCellGroupProps
): ReactElement {
	const baseHeadGroupClassName = `${BASE_TABLE_CLASSNAME}__header-group`;
	const resizable = useTableContext((context) => context.resizable);

	return (
		<StyledTableHeadCellGroup
			className={joinClassNames(baseHeadGroupClassName, props.className)}
			data-role={DataRoles.Table.Header.Cell.Group}
			style={props.style}
			id={props.id}
			resizable={resizable}
		>
			{props.parent}
			<StyledTableHeaderGroupChildren
				className={`${baseHeadGroupClassName}-children`}
				data-role={DataRoles.Table.Header.Cell.Group.Children}
			>
				{props.children}
			</StyledTableHeaderGroupChildren>
		</StyledTableHeadCellGroup>
	);
});

HeadCellGroupTpl.displayName = "HeadCellGroupTpl";
