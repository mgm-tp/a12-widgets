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

import { BASE_TABLE_CLASSNAME } from "./table.internal.js";
import { TableTemplate } from "./template/index.js";
import type { TableRenderPropsType } from "./table-renderer.api.js";
import type { BaseColumnType } from "./column.api.js";
import { isColumnGroup, TableInternalUtils as Utils } from "./table.utils.js";
import { useTableContext } from "./table.context.js";

/** @internal */
export const HeadCellGroup = memo(function HeadCellGroup(props: TableRenderPropsType.HeadCellProps<BaseColumnType>) {
	const headCellRenderer = useTableContext((context) => context.componentRenderers.headCellRenderer);
	const headCellGroupRenderer = useTableContext((context) => context.componentRenderers.headCellGroupRenderer);
	const columns = useTableContext((context) => context.columns);
	const resizable = useTableContext((context) => context.resizable);
	const { column, ...restProps } = props;
	const baseHeadGroupClassName = `${BASE_TABLE_CLASSNAME}__header-group`;

	const columnParentStyle = useMemo(
		() => Utils.calculateParentColumnFlexAttributes(column, columns, resizable),
		[column, columns, resizable]
	);

	return isColumnGroup(column) ? (
		<TableTemplate.HeadCellGroup
			style={columnParentStyle}
			parent={headCellRenderer({
				column,
				className: `${baseHeadGroupClassName}-parent`,
				fixedWidth: (column.fixedWidth || !!column.pinning) && !column.actionColumn,
				dataRole: DataRoles.Table.Header.Cell.Group.Parent
			})}
		>
			{column.subColumns?.map((col, index) => {
				const isCellOnParWithGroup =
					!col.subColumns && column.subColumns?.some((value) => value.subColumns && value.subColumns.length > 0);

				return headCellGroupRenderer({
					column: col,
					key: `headCell-${index}`,
					fixedWidth: (col.fixedWidth || !!column.pinning) && !col.actionColumn,
					className: !isCellOnParWithGroup ? `${baseHeadGroupClassName}--unspanned` : undefined
				});
			})}
		</TableTemplate.HeadCellGroup>
	) : (
		<>{headCellRenderer({ column, ...restProps })}</>
	);
});

HeadCellGroup.displayName = "HeadCellGroup";
