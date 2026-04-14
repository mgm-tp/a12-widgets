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
import { useState, useCallback } from "react";

import type { TreeTableRowEventHandlers, TreeTableRowStyling } from "@com.mgmtp.a12.widgets/widgets-core";
import { TreeTable } from "@com.mgmtp.a12.widgets/widgets-core";

import { COMPLEX_TREE_TABLE_NODE_CREATOR, createComplexColumns } from "./shared/complex-data.js";
import { getNodeById } from "./shared/data.js";

const root = COMPLEX_TREE_TABLE_NODE_CREATOR();

export const VirtualScrolling: FC = () => {
	const [collapsedNodes, setCollapsedNodes] = useState<{ [key: number]: boolean }>({});
	const [selectedNode, setSelectedNode] = useState<number | undefined>();

	const rowEventHandlers: TreeTableRowEventHandlers = useCallback(({ row }) => {
		return {
			onArrowClick(): void {
				setCollapsedNodes((currentCollapsedNodes) => ({
					...currentCollapsedNodes,
					[row.id]: !currentCollapsedNodes[row.id]
				}));
			},
			onClick(): void {
				setSelectedNode(row.id);
			}
		};
	}, []);

	const rowStyling: TreeTableRowStyling = useCallback(
		({ row }) => {
			const node = getNodeById(row.id, root);

			return { collapsed: node?.children ? !!collapsedNodes[row.id] : undefined, selected: row.id === selectedNode };
		},
		[collapsedNodes, selectedNode]
	);

	return (
		<div style={{ height: 470 }}>
			<TreeTable
				hideRoot
				root={root}
				columns={createComplexColumns()}
				rowEventHandlers={rowEventHandlers}
				rowStyling={rowStyling}
				virtualScrollOptions={{
					rowHeight: 70
				}}
				id="tree-table-virtual-scroll"
			/>
		</div>
	);
};
