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

import { StyledIconWrapper, StyledVariantIconWrapper } from "../../../icon/main/icon.view.js";
import { StyledTextOutputText } from "../../../text-output/main/text-output.view.js";
import { joinClassNames, getRole } from "../../../common/main/utils.js";
import { useTableContext } from "../../new-api/table.context.js";
import type { Column } from "../../new-api/column.api.js";

import { BASE_TABLE_CLASSNAME } from "../table.internal.js";
import { TableDataAttributes } from "../table.data-attributes.js";

import type { TableTemplateProps } from "./table.tpl.api.js";
import { StyledBaseTable } from "./table.styled.js";
import { StyledTableFootRowSegment } from "./table.foot-row-segment.tpl.view.js";
import { resetBoxShadowForSubInfoCell } from "./table.tpl.utils.js";

export const StyledTableFootCell = styled(StyledBaseTable.Cell).withConfig({ displayName: "StyledTableFootCell-sc-" })<{
	horizAlignment?: Column.HorizontalAlignment;
	verAlignment?: Column.VerticalAlignment;
}>(({ theme, subInfo, horizAlignment, verAlignment }) => {
	const { table } = theme.components;
	const { footCell } = table;

	return css`
		font-weight: ${footCell.fontWeight};
		min-height: ${footCell.minHeight};
		overflow: hidden;
		${subInfo &&
		css`
			align-items: center;
			${resetBoxShadowForSubInfoCell(StyledTableFootRowSegment)}
		`}
		&:empty {
			min-height: 1px;
			padding-top: 0;
			padding-bottom: 0;
		}

		justify-content: ${horizAlignment === "right" ? "flex-end" : horizAlignment === "center" ? "center" : "flex-start"};
		text-align: ${horizAlignment};
		align-items: ${verAlignment === "bottom" ? "flex-end" : verAlignment === "middle" ? "center" : "flex-start"};
		${StyledTextOutputText} {
			${StyledIconWrapper} {
				font-weight: ${footCell.fontWeight};

				&:not(${StyledVariantIconWrapper}) {
					color: ${table.color};
				}
			}
		}
	`;
});

export function FootCellTpl(props: TableTemplateProps.FootCellProps): ReactElement<TableTemplateProps.FootCellProps> {
	const cardView = useTableContext((context) => context.cardView);
	const resizable = useTableContext((context) => context.resizable);
	const columnWidth = props.relativeWidth ?? 1;
	const classNames = useMemo(
		() =>
			!props.isRowScroller
				? joinClassNames(
						`${BASE_TABLE_CLASSNAME}__footerCell`,
						{
							[`${BASE_TABLE_CLASSNAME}__footerCell--${columnWidth * 10}`]:
								!props.actionCell || (props.actionCell && props.relativeWidth)
						},
						{ [`${BASE_TABLE_CLASSNAME}__footerCell--sub-info`]: props.subInfo },
						{ [`${BASE_TABLE_CLASSNAME}__actionCell`]: props.actionCell },
						{ [`${BASE_TABLE_CLASSNAME}__footerCell--fixedWidth`]: props.fixedWidth },
						{
							[`${BASE_TABLE_CLASSNAME}__footerCell--align-${props.horizontalAlignment}`]:
								props.horizontalAlignment && props.horizontalAlignment !== "left"
						},
						{
							[`${BASE_TABLE_CLASSNAME}__footerCell--align-${props.verticalAlignment}`]:
								props.verticalAlignment && props.verticalAlignment !== "top"
						},
						props.className
					)
				: props.className,
		[
			props.isRowScroller,
			props.actionCell,
			props.relativeWidth,
			props.subInfo,
			props.fixedWidth,
			props.horizontalAlignment,
			props.verticalAlignment,
			props.className,
			columnWidth
		]
	);

	return (
		<StyledTableFootCell
			role={getRole(props.role, "cell")}
			id={props.id}
			data-role={props.dataRole || "table-footer-cell"}
			className={classNames}
			style={props.style}
			onClick={props.onClick}
			onKeyDown={props.onKeyDown}
			fixedWidth={props.fixedWidth}
			subInfo={props.subInfo}
			actionCell={props.actionCell}
			relativeWidth={columnWidth}
			$hasActionCellWidth={!!props.relativeWidth}
			cardView={cardView}
			verAlignment={props.verticalAlignment}
			horizAlignment={props.horizontalAlignment}
			resizable={resizable}
			data-width={props.relativeWidth}
			data-type={props.actionCell && TableDataAttributes.Table.ActionCell}
		>
			{props.children}
		</StyledTableFootCell>
	);
}

FootCellTpl.displayName = "FootCellTpl";
