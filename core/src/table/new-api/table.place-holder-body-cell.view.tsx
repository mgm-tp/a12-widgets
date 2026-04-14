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

import { DataRoles } from "../../common/main/data-roles.js";

import { BASE_TABLE_CLASSNAME } from "../main/table.internal.js";
import { TableTemplate } from "../main/template/index.js";

import type { TableRenderPropsType } from "./table-renderer.api.js";
import { useTableContext } from "./table.context.js";
import { isColumnGroup, TableInternalUtils as Utils } from "./table.utils.js";
import { StyledTableBodyCellGroup } from "./table.body-cell.view.js";

/** @internal */
export const PlaceHolderBodyCell = memo(function PlaceHolderBodyCell(
	props: TableRenderPropsType.PlaceHolderBodyCellProps
) {
	const columns = useTableContext((context) => context.columns);
	const resizable = useTableContext((context) => context.resizable);

	const placeHolderBodyContentRenderer = useTableContext(
		(context) => context.componentRenderers.placeHolderBodyContentRenderer
	);
	const placeHolderBodyCellRenderer = useTableContext(
		(context) => context.componentRenderers.placeHolderBodyCellRenderer
	);

	const { column, rowIndex, ...rest } = props;

	const fixedWidth = useMemo(() => {
		if (column.actionColumn) {
			return false;
		}

		if (resizable) {
			return !Utils.isLastColumnOfArea(column, columns, "scroll");
		}

		return column.fixedWidth || !!column.pinning;
	}, [resizable, column, columns]);

	const placeHolderBodyCell = (
		<TableTemplate.BodyCell relativeWidth={column.width} fixedWidth={fixedWidth} {...rest}>
			{placeHolderBodyContentRenderer?.({ column, rowIndex })}
		</TableTemplate.BodyCell>
	);

	const columnParentStyle = useMemo(
		() => Utils.calculateParentColumnFlexAttributes(column, columns, resizable),
		[column, resizable, columns]
	);

	const baseContentGroupClassName = `${BASE_TABLE_CLASSNAME}__content-group`;

	return isColumnGroup(column) ? (
		<StyledTableBodyCellGroup
			className={baseContentGroupClassName}
			style={columnParentStyle}
			data-role={DataRoles.Table.Body.Cell.Group}
		>
			{column.subColumns?.map((col, index) =>
				placeHolderBodyCellRenderer?.({ ...props, column: col, key: `bodyCell-${index}` })
			)}
		</StyledTableBodyCellGroup>
	) : (
		placeHolderBodyCell
	);
});

PlaceHolderBodyCell.displayName = "PlaceHolderBodyCell";
