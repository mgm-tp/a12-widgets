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
import { memo, useMemo } from "react";
import { styled, css } from "styled-components";

import { joinClassNames } from "../../../common/main/utils.js";
import { StyledBaseInput } from "../../../input/base-input-styled/base.styled.js";
import { StyledTimePickerWrapper } from "../../../time-picker/main/time-picker.styled.js";
import { DataRoles } from "../../../common/index.js";

import { useTableContext } from "../table.context.js";
import { BASE_TABLE_CLASSNAME } from "../table.internal.js";

import type { TableTemplateProps } from "./table.tpl.api.js";
import { StyledBaseTable } from "./table.styled.js";
import { useStyledTableContext } from "./table.context.styled.js";

export const StyledTableHeadRowSegment = styled(StyledBaseTable.Segment).withConfig({
	displayName: "StyledTableHeadRowSegment-sc-"
})<{
	rowSegmentType?: TableTemplateProps.RowSegmentType;
	$gridRowData?: TableTemplateProps.GridRowDataProps;
	$filterRow?: boolean;
	$enableColumnGroupA11y?: boolean;
}>(
	({
		theme,
		rowSegmentType,
		$gridRowData: { gridRow, gridColumn, gridRowSpan, gridColumnSpan, isHidden, leftOffset, rightOffset } = {},
		$filterRow: filterRow,
		$enableColumnGroupA11y: enableColumnGroupA11y
	}) => {
		const { headRow, header } = theme.components.table;

		return css`
			${enableColumnGroupA11y &&
			css`
				grid-row: ${gridRow} / span ${gridRowSpan};
				grid-column: ${gridColumn} / span ${gridColumnSpan};
				display: grid;

				/* Create a subgrid to maintain cell positioning */
				grid-template-columns: subgrid;
				grid-template-rows: subgrid;

				${isHidden &&
				css`
					position: absolute;
					width: 1px;
					height: 1px;
					padding: 0;
					margin: -1px;
					overflow: hidden;
					clip-path: inset(0);
					white-space: nowrap;
					border: 0;
				`}

				/* Apply pinning styles for wrapper segments */
			${rowSegmentType === "left" &&
				!isHidden &&
				css`
					position: sticky;
					left: ${leftOffset !== undefined ? `${leftOffset}px` : "0"};
					z-index: 2;
					background: ${header.background};
					isolation: isolate;
				`}

			${rowSegmentType === "right" &&
				!isHidden &&
				css`
					position: sticky;
					right: ${rightOffset !== undefined ? `${rightOffset}px` : "0"};
					z-index: 1;
					background: ${header.background};
					isolation: isolate;
				`}

			${rowSegmentType === "scroll" &&
				css`
					min-width: 0;
				`}
			`}

			${filterRow &&
			css`
				align-items: flex-start;
				${StyledBaseInput.StyledFieldWrapper}:not(:last-child),
				${StyledTimePickerWrapper}:not(:last-child) {
					margin-bottom: ${headRow.filter.fieldInputMarginBottom};
				}
				${StyledBaseInput.StyledFieldInput}:read-only {
					background-color: ${headRow.filter.fieldInputReadonlyBG};
				}
			`}
		`;
	}
);

export const HeadRowSegmentTpl = memo(function HeadRowSegmentTpl(
	props: TableTemplateProps.RowSegmentProps
): ReactElement<TableTemplateProps.RowSegmentProps> {
	const cardView = useTableContext((context) => context.cardView);
	const crossTabulation = useTableContext((context) => !!context.crossTabulation);
	const enableColumnGroupA11y = useTableContext((context) => !!context.enableColumnGroupA11y);
	const filterRow = useStyledTableContext((context) => !!context.header?.filterRow);

	const classNames = useMemo(() => {
		return joinClassNames(`${BASE_TABLE_CLASSNAME}__headerRow--${props.type}`, props.className);
	}, [props.className, props.type]);

	return (
		<StyledTableHeadRowSegment
			className={classNames}
			style={props.style}
			id={props.id}
			dataRole={props.dataRole || `${DataRoles.Table.Header.Row}--${props.type}`}
			rowSegmentType={props.type}
			cardView={cardView}
			$gridRowData={props.gridRowData}
			$crossTabulation={crossTabulation}
			$enableColumnGroupA11y={enableColumnGroupA11y}
			$filterRow={filterRow}
		>
			{props.children}
		</StyledTableHeadRowSegment>
	);
});

HeadRowSegmentTpl.displayName = "HeadRowSegmentTpl";
