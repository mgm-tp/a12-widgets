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

import { TableTemplate } from "./template/index.js";
import type { TableRenderPropsType } from "./table-renderer.api.js";
import type { BaseColumnType } from "./column.api.js";
import { useTableContext } from "./table.context.js";
import { isColumnGroup, TableInternalUtils } from "./table.utils.js";

/** @internal */
export const HeadFilterCell = memo(function HeadFilterCell(props: TableRenderPropsType.HeadCellProps<BaseColumnType>) {
	const cardView = useTableContext((context) => context.cardView);
	const headFilterContentRenderer = useTableContext((context) => context.componentRenderers.headFilterContentRenderer);
	const resizable = useTableContext((context) => context.resizable);
	const columns = useTableContext((context) => context.columns);

	const { column, role, ...restProps } = props;
	const isSingleColumn = !isColumnGroup(column);

	const fixedWidth = useMemo(() => {
		if (resizable) {
			return !TableInternalUtils.isLastColumnOfArea(column, columns, "scroll") && !column.actionColumn;
		}

		return props.fixedWidth || ((column.fixedWidth || !!column.pinning) && !column.actionColumn);
	}, [resizable, props.fixedWidth, column, columns]);

	return (
		<TableTemplate.HeadCell
			horizontalAlignment={
				(column.specificHorizontalAlignment?.head ?? column.horizontalAlignment) ||
				(isColumnGroup(column) ? "center" : "left")
			}
			verticalAlignment={column.specificVerticalAlignment?.head ?? column.verticalAlignment}
			relativeWidth={isSingleColumn ? column.width : undefined}
			fixedWidth={fixedWidth}
			subInfo={column.subInfo}
			actionCell={column.actionColumn}
			hiddenText={column.title}
			role={cardView ? false : (role ?? "cell")}
			{...restProps}
		>
			{headFilterContentRenderer?.({ column })}
		</TableTemplate.HeadCell>
	);
});

HeadFilterCell.displayName = "HeadFilterCell";
