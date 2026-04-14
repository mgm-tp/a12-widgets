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

import type { FC } from "react";
import { useState, useCallback, useMemo } from "react";

import type {
	ColumnResizingOptions,
	BaseTreeTableColumnType,
	TreeTableRowEventHandlers,
	TreeTableRowStyling
} from "@com.mgmtp.a12.widgets/widgets-core";
import { TreeTable } from "@com.mgmtp.a12.widgets/widgets-core";

import { COLUMNS, generateTreeTableNodes } from "./shared/data.js";

export const ResizableTreeTable: FC = () => {
	const [columns, setColumns] = useState(COLUMNS);
	const [collapsedNodes, setCollapsedNodes] = useState<{ [key: string]: boolean }>({});
	const rowEventHandlers: TreeTableRowEventHandlers = useCallback(({ row }) => {
		return {
			onArrowClick(): void {
				setCollapsedNodes((currentCollapsedNodes) => ({
					...currentCollapsedNodes,
					[row.id]: !currentCollapsedNodes[row.id]
				}));
			}
		};
	}, []);

	const rowStyling: TreeTableRowStyling = useCallback(
		({ row }) => {
			return { collapsed: collapsedNodes[row.id] };
		},
		[collapsedNodes]
	);

	const columnResizingOptions = useMemo<ColumnResizingOptions<BaseTreeTableColumnType>>(() => {
		return {
			onEndResize: ({ resizedWidthsGetter }): void => {
				setColumns((oldColumns) =>
					oldColumns.map((column) => {
						const newWidth = resizedWidthsGetter?.(column);

						if (newWidth !== undefined) {
							return { ...column, width: newWidth };
						}

						return column;
					})
				);
			}
		};
	}, []);

	return (
		<TreeTable
			root={generateTreeTableNodes(undefined, "resizable")}
			columns={columns}
			rowEventHandlers={rowEventHandlers}
			rowStyling={rowStyling}
			columnResizingOptions={columnResizingOptions}
			id="resizable-tree-table"
		/>
	);
};
