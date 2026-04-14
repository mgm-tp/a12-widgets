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

import type { CSSObject } from "styled-components";
import { styled, css } from "styled-components";
import { darken } from "polished";

import { breakWord } from "../../../theme/base/mixins/_break-word.js";
import type { DefaultThemeType } from "../../../theme/schema.js";
import { active, hover } from "../../../theme/base/mixins/_interaction.js";
import { useTableContext } from "../../new-api/table.context.js";
import type { Column } from "../../new-api/column.api.js";
import { StyledBaseInput } from "../../../input/base-input-styled/base.styled.js";
import { StyledTagInputFieldWrapper } from "../../../tag-input/main/tag-input.styled.js";
import { StyledTagGroup } from "../../../tag/main/tag-group.view.js";
import { StyledSelectTemplate } from "../../../input/select/main/select.styled.js";
import { createPseudoElement } from "../../../theme/base/mixins/_pseudo.js";
import { getHorizontalSpace } from "../../../common/main/utils.js";
import { StyledListItemWrapper } from "../../../list/main/list.styled.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { TableDataAttributes } from "../table.data-attributes.js";

import { CollapsingWrapper } from "./table.collapsing-wrapper.tpl.view.js";
import type { TableTemplateProps } from "./table.tpl.api.js";
import { useStyledTableContext } from "./table.context.styled.js";

export namespace StyledBaseTable {
	export const Row = styled.div.withConfig({ displayName: "StyledTableRow-sc-" })<{ cardView?: boolean }>(
		({ theme, cardView }) => {
			const { table } = theme.components;

			return css`
				display: ${cardView ? "block" : "flex"};
				position: relative;
				${cardView &&
				css`
					border: none;
					border-radius: ${table.cardView.bodyRow.borderRadius};
					box-shadow: ${table.cardView.bodyRow.boxShadow};
				`}
			`;
		}
	);

	export const Group = styled.div.withConfig({ displayName: "StyledTableGroup-sc-" })`
		display: flex;
		flex-grow: 1;
	`;

	export const Cell = styled.div.withConfig({ displayName: "StyledTableCell-sc-" })<{
		fixedWidth?: boolean;
		subInfo?: boolean;
		actionCell?: boolean;
		relativeWidth?: Column.Width;
		cardView?: boolean;
		hasColumnGroup?: boolean;
		resizable?: boolean;
		$hasActionCellWidth?: boolean;
	}>(({ theme, fixedWidth, subInfo, actionCell, relativeWidth, cardView, resizable, $hasActionCellWidth }) => {
		const { table } = theme.components;
		const { bodyCell, headCell } = table;

		const padding = subInfo ? bodyCell.subInfo.padding : actionCell ? table.actionCell.padding : bodyCell.padding;
		const crossTabulation = useTableContext((context) => context.crossTabulation);
		const rowSegmentType = useStyledTableContext((context) => context.rowSegmentType);

		const width =
			actionCell && !$hasActionCellWidth
				? "unset"
				: relativeWidth
					? `${Math.round(bodyCell.width * relativeWidth)}px`
					: `${bodyCell.width}px`;
		const flex =
			fixedWidth || (actionCell && !$hasActionCellWidth)
				? "0 0 auto"
				: relativeWidth
					? `${relativeWidth * 10} ${relativeWidth} auto`
					: "1 1 0%";

		const firstColumnStyle = css`
			&:first-child {
				${StyledTableMixins.setFirstCellSpacing({
					subInfo,
					actionCell,
					theme,
					relativeWidth,
					$hasActionCellWidth
				})}
			}
		`;

		const resetColumnStyle = css`
			padding-left: ${getHorizontalSpace("left", padding)};
			min-width: ${width};
			width: ${width};
		`;

		return css`
			box-sizing: border-box;
			display: flex;
			flex: ${flex};
			font-family: ${bodyCell.fontFamily};
			font-size: ${bodyCell.fontSize};
			font-weight: ${bodyCell.fontWeight};
			min-width: ${width};
			padding: ${padding};
			text-align: left;
			width: ${width};

			// Remove the default margin of p tag to not increase the Cell's height unexpectedly, which leads to the row's visual issue.
			p {
				&:first-child {
					margin-top: 0;
				}
				&:last-child {
					margin-bottom: 0;
				}
			}

			${breakWord}

			${subInfo &&
			css`
				color: ${bodyCell.subInfo.color};
				& > * {
					color: ${bodyCell.subInfo.color};
				}
			`}

			${actionCell &&
			css`
				height: 100%;
			`}

            // Style for cell of first column
			${!cardView &&
			css`
				${rowSegmentType === "left" &&
				css`
					${firstColumnStyle}
					${Group}:not(:first-child) &&:first-child {
						${resetColumnStyle}
					}
				`}

				${rowSegmentType === "scroll" &&
				css`
					${Segment}:first-child && {
						${firstColumnStyle}
					}
					${Segment}:first-child ${Group}:not(:first-child) &&:first-child {
						${resetColumnStyle}
					}
				`}
			`}

		  	${cardView &&
			css`
				position: relative;
				padding-top: 24px;
				font-size: ${table.cardView.bodyCell.fontSize};
				width: 100%;
			`}


		  	${resizable &&
			css`
				[${TableDataAttributes.Data.Head.CellResizing}="true"] div {
					background-color: transparent;
				}
				${rowSegmentType === "scroll" &&
				css`
					${Segment} > &&:last-child {
						flex: 1;
					}
				`}
			`}
		  	${crossTabulation &&
			rowSegmentType === "left" &&
			css`
				color: ${headCell.color};
				font-size: ${headCell.fontSize};
				font-weight: ${headCell.fontWeight};
			`}
		`;
	});

	export const Segment = styled(CollapsingWrapper)<{
		rowSegmentType?: TableTemplateProps.RowSegmentType;
		cardView?: boolean;
	}>(({ rowSegmentType, theme, cardView }) => {
		const { header, headRow } = theme.components.table;
		const crossTabulation = useTableContext((context) => context.crossTabulation);

		return css`
			display: ${cardView ? "block" : "flex"};
			position: relative;

			${rowSegmentType === "left" &&
			css`
				${crossTabulation &&
				css`
					background: ${header.background};
					${createPseudoElement(
						":after",
						css`
							left: unset;
							border-right: ${headRow.borderBottom};
						`
					)}
				`}
			`}

			${rowSegmentType === "scroll" &&
			css`
				flex: 1 1 0%;
				overflow: hidden;
			`}
		`;
	});
}

export const StyledTableMixins = {
	setRowBG: (props: {
		background: string;
		state?: "hover" | "active" | "focus";
		theme: DefaultThemeType;
		darken?: boolean;
		selector?: CSSObject | string;
	}) => {
		const { bodyRow } = props.theme.components.table;
		const backgroundStyle = css`
			background-color: ${props.darken ? darken(bodyRow.subBGRatio, props.background) : props.background};
		`;

		if (!props.state) {
			return backgroundStyle;
		}

		return css`
			${props.state === "hover" && hover(backgroundStyle, props.selector)}
			${props.state === "active" && active(backgroundStyle, props.selector)}
		  	${props.state === "focus" &&
			(props.selector
				? css`
						${props.selector}:focus && {
							${backgroundStyle}
						}
					`
				: css`
						&:focus {
							${backgroundStyle}
						}
					`)}
		`;
	},
	setFirstCellSpacing: (props: {
		theme: DefaultThemeType;
		subInfo?: boolean;
		actionCell?: boolean;
		relativeWidth?: Column.Width;
		expandableCell?: boolean;
		$hasActionCellWidth?: boolean;
	}) => {
		const { bodyCell, headCell } = props.theme.components.table;
		const { bodyCell: treeTableBodyCell } = props.theme.components.treeTable;

		const width =
			props.actionCell && !props.$hasActionCellWidth
				? "unset"
				: props.relativeWidth
					? props.subInfo
						? `calc(${bodyCell.width}px * ${props.relativeWidth})`
						: `calc(${bodyCell.width}px * ${props.relativeWidth} + ${bodyCell.firstMarginLeft})`
					: `calc(${bodyCell.width}px + ${bodyCell.firstMarginLeft})`;

		return css`
			${!props.expandableCell &&
			css`
				min-width: ${width};
				width: ${width};
			`}

			${!props.subInfo
				? props.actionCell
					? css`
							padding: ${headCell.padding};
							padding-top: 0;
							padding-bottom: 0;
							padding-left: calc(${getHorizontalSpace("left", headCell.padding)} + ${bodyCell.firstMarginLeft});
						`
					: css`
							padding-left: calc(${bodyCell.firstMarginLeft} + ${getHorizontalSpace("left", bodyCell.padding)});
							[data-role="${DataRoles.Tree}"] && {
								padding-left: calc(
									${bodyCell.firstMarginLeft} + ${getHorizontalSpace("left", treeTableBodyCell.padding)}
								);
							}
						`
				: props.actionCell &&
					css`
						padding: ${headCell.padding};
						padding-top: 0;
						padding-bottom: 0;
					`}
		`;
	},
	setInputBG: (props: { background: string }) => {
		return css`
			${StyledBaseInput.StyledFieldInput}:not([data-readonly="true"]):not([data-disabled="true"]),
			${StyledSelectTemplate.StyledSelectInput}:not(:read-only):not(:disabled),
			${StyledSelectTemplate.StyledFieldSelectWrapper}:not([data-readonly="true"]):not([data-disabled="true"]),
			${StyledTagInputFieldWrapper} ${StyledTagGroup} {
				background-color: ${props.background};
			}
		`;
	}
};

export const StyledContextMenuDialog = styled.div.withConfig({ displayName: "StyledContextMenuDialog-sc-" })(
	({ theme }) => {
		const { contextMenu } = theme.components.table;

		return css`
			box-shadow: ${contextMenu.boxShadow};
			outline-style: none;
			overflow: hidden auto;
			${StyledListItemWrapper} {
				border: none;
			}
		`;
	}
);
