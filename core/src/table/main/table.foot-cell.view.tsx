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

import { memo, useMemo } from "react";
import { styled } from "styled-components";

import { TableTemplate } from "./template/index.js";
import { BASE_TABLE_CLASSNAME } from "./table.internal.js";
import { StyledBaseTable } from "./template/table.styled.js";
import type { TableRenderPropsType } from "./table-renderer.api.js";
import type { BaseColumnType } from "./column.api.js";
import { isColumnGroup, TableInternalUtils as Utils } from "./table.utils.js";
import { useTableContext } from "./table.context.js";
import { FootContent } from "./table.foot-content.view.js";

const StyledTableFootCellGroup = styled(StyledBaseTable.Group)``;

/** @internal */
export const FootCell = memo(function FootCell(props: TableRenderPropsType.FootCellProps<BaseColumnType>) {
	const footCellRenderer = useTableContext((context) => context.componentRenderers.footCellRenderer);
	const footContentRenderer = useTableContext((context) => context.componentRenderers.footContentRenderer);
	const cardView = useTableContext((context) => context.cardView);
	const hasFootContent = useTableContext((context) => context.hasFootContent);
	const columns = useTableContext((context) => context.columns);
	const resizable = useTableContext((context) => context.resizable);
	const { column, role, fixedWidth: fixedWidthProp } = props;

	const columnParentStyle = useMemo(
		() => Utils.calculateParentColumnFlexAttributes(column, columns, resizable),
		[column, columns, resizable]
	);

	const fixedWidth = useMemo(() => {
		return Utils.isFixedWidthColumn({ column, columns, resizable, fixedWidthProp });
	}, [resizable, fixedWidthProp, column, columns]);

	const footRenderer = (
		<TableTemplate.FootCell
			horizontalAlignment={column.specificHorizontalAlignment?.foot ?? column.horizontalAlignment}
			verticalAlignment={column.specificVerticalAlignment?.foot ?? column.verticalAlignment}
			relativeWidth={column.width}
			subInfo={column.subInfo}
			actionCell={column.actionColumn}
			fixedWidth={fixedWidth}
			{...props}
			role={hasFootContent && !cardView ? role : false}
		>
			{props.isRowScroller ? <FootContent column={column} /> : footContentRenderer({ column })}
		</TableTemplate.FootCell>
	);

	return isColumnGroup(column) ? (
		<StyledTableFootCellGroup className={`${BASE_TABLE_CLASSNAME}__footer-group`} style={columnParentStyle}>
			{column.subColumns?.map((col, index) => {
				return footCellRenderer({ ...props, column: col, key: `foot-cell-${index}` });
			})}
		</StyledTableFootCellGroup>
	) : (
		footRenderer
	);
});

FootCell.displayName = "FootCell";
