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
import { useCallback, useState } from "react";

import type {
	BaseTreeTableColumnType,
	TreeTableRowEventHandlers,
	TreeTableRowStyling
} from "@com.mgmtp.a12.widgets/widgets-core";
import { TreeTable } from "@com.mgmtp.a12.widgets/widgets-core";

import { generateTreeTableNodes, getNodeById } from "./shared/data.js";

const root = generateTreeTableNodes(true, "accessibility");

const COLUMNS: BaseTreeTableColumnType[] = [
	{
		label: "Folder",
		horizontalAlignment: "left",
		verticalAlignment: "top",
		hierarchical: true,
		width: 2
	},
	{ label: "Date modified", verticalAlignment: "top" },
	{ label: "Size", horizontalAlignment: "right", verticalAlignment: "top" },
	{ label: "Owner", verticalAlignment: "top" },
	{ label: "Group", verticalAlignment: "top" },
	{ label: "Date Added", verticalAlignment: "top" },
	{ label: "", verticalAlignment: "middle", pinning: "right", actionColumn: true }
];

export const Accessibility: FC = () => {
	const [selectedNode, setSelectedNode] = useState<string | undefined>();
	const [collapsedNodes, setCollapsedNodes] = useState<{ [key: string]: boolean }>({});

	const rowEventHandlers: TreeTableRowEventHandlers = useCallback(({ row }) => {
		const rowData = row.data as [string];
		const isNonInteractive = rowData[0].includes("Non-interactive");

		return {
			onArrowClick(): void {
				if (!isNonInteractive) {
					setCollapsedNodes((currentCollapsedNodes) => ({
						...currentCollapsedNodes,
						[row.id]: !currentCollapsedNodes[row.id]
					}));
				}
			},
			onClick(): void {
				if (!isNonInteractive) {
					setSelectedNode(row.id);
				}
			}
		};
	}, []);

	const rowStyling: TreeTableRowStyling = useCallback(
		({ row }) => {
			const selected = row.id === selectedNode;
			const disabled = row.id === 8 || row.id === 11;
			const interactive = !(row.data as [string])[0].includes("Non-interactive");
			const node = getNodeById(row.id, root);

			return {
				highlightVariant: row.id === 4 ? "success" : undefined,
				collapsed: node?.children ? !!collapsedNodes[row.id] : undefined,
				interactive,
				selected,
				disabled,
				title: selected ? "Selected" : !disabled && interactive ? "Selectable" : undefined
			};
		},
		[collapsedNodes, selectedNode]
	);

	return (
		<TreeTable
			root={root}
			columns={COLUMNS}
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
			id="accessibility-tree-table"
		/>
	);
};
