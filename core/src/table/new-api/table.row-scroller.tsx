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

import { createPseudoElement } from "../../theme/base/mixins/_pseudo.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { TableTemplateProps } from "../main/template/table.tpl.api.js";
import { StyledBaseTable } from "../main/template/table.styled.js";

import { RowSegments } from "./table.row-segments.view.js";
import { FootCell } from "./table.foot-cell.view.js";
import { useTableContext } from "./table.context.js";

const StyledTableRowScroller = styled(StyledBaseTable.Row).withConfig({ displayName: "StyledTableRowScroller-sc-" })(
	({ theme }) => {
		const { body } = theme.components.table;

		return css`
			border-left: ${body.border};
			border-right: ${body.border};
			margin-top: -1px;
		`;
	}
);

const StyledTableRowScrollerSegment = styled(StyledBaseTable.Segment).withConfig({
	displayName: "StyledTableRowScrollerSegment-sc-"
})(({ rowSegmentType, theme }) => {
	const { bodyRow } = theme.components.table;
	const crossTabulation = useTableContext((context) => context.crossTabulation);

	return css`
		${rowSegmentType === "left" &&
		crossTabulation &&
		css`
			background: ${bodyRow.background};
			${createPseudoElement(
				":after",
				css`
					border-right: none;
				`
			)}
		`}
		${rowSegmentType === "scroll" &&
		css`
			overflow-x: auto;
		`}
	`;
});

const SegmentComponent = (
	props: TableTemplateProps.RowSegmentProps
): ReactElement<TableTemplateProps.RowSegmentProps> => {
	const isScroll = props.type === "scroll";

	return (
		<StyledTableRowScrollerSegment
			dataRole={`${DataRoles.Table.Row.Scroller}--${props.type}`}
			rowSegmentType={props.type}
			tabIndex={isScroll ? -1 : undefined}
		>
			{props.children}
		</StyledTableRowScrollerSegment>
	);
};

SegmentComponent.displayName = "SegmentComponent";

/** @internal */
export const TableRowScroller = memo(function RowScroller() {
	return (
		<StyledTableRowScroller data-role={DataRoles.Table.Row.Scroller} aria-hidden={true}>
			<RowSegments
				SegmentComponent={SegmentComponent}
				cellRenderer={({ key, ...params }) => (
					<FootCell key={key} {...params} dataRole={DataRoles.Table.Row.ScrollerCell} isRowScroller />
				)}
			/>
		</StyledTableRowScroller>
	);
});

TableRowScroller.displayName = "RowScroller";
