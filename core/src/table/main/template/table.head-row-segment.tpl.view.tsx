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
import { useTableContext } from "../../new-api/table.context.js";
import { StyledBaseInput } from "../../../input/base-input-styled/base.styled.js";
import { StyledTimePickerWrapper } from "../../../time-picker/main/time-picker.styled.js";

import { BASE_TABLE_CLASSNAME } from "../table.internal.js";

import type { TableTemplateProps } from "./table.tpl.api.js";
import { StyledBaseTable } from "./table.styled.js";
import { useStyledTableContext } from "./table.context.styled.js";

export const StyledTableHeadRowSegment = styled(StyledBaseTable.Segment).withConfig({
	displayName: "StyledTableHeadRowSegment-sc-"
})<{ $filterRow?: boolean }>(({ theme, $filterRow: filterRow }) => {
	const { headRow } = theme.components.table;

	return css`
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
});

export const HeadRowSegmentTpl = memo(function HeadRowSegmentTpl(
	props: TableTemplateProps.RowSegmentProps
): ReactElement<TableTemplateProps.RowSegmentProps> {
	const cardView = useTableContext((context) => context.cardView);
	const crossTabulation = useTableContext((context) => !!context.crossTabulation);
	const filterRow = useStyledTableContext((context) => !!context.header?.filterRow);

	const classNames = useMemo(() => {
		return joinClassNames(`${BASE_TABLE_CLASSNAME}__headerRow--${props.type}`, props.className);
	}, [props.className, props.type]);

	return (
		<StyledTableHeadRowSegment
			className={classNames}
			style={props.style}
			id={props.id}
			dataRole={props.dataRole || `table-header-row--${props.type}`}
			rowSegmentType={props.type}
			cardView={cardView}
			$crossTabulation={crossTabulation}
			$filterRow={filterRow}
		>
			{props.children}
		</StyledTableHeadRowSegment>
	);
});

HeadRowSegmentTpl.displayName = "HeadRowSegmentTpl";
