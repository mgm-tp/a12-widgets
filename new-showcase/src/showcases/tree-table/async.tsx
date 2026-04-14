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

import type { FC, ReactNode } from "react";
import { useState, useCallback, useMemo } from "react";

import type {
	BaseTreeTableNode,
	TreeTableComponentRenderers,
	TreeTableRowEventHandlers,
	TreeTableRowStyling
} from "@com.mgmtp.a12.widgets/widgets-core";
import { ProgressIndicator, TreeTable } from "@com.mgmtp.a12.widgets/widgets-core";

import { COLUMNS, getNodeById, generateTreeTableNodes } from "./shared/data.js";

export const Async: FC = () => {
	const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({});
	const [busyNodes, setBusyNodes] = useState<{ [key: string]: boolean }>({});

	const makeBusyNode = useCallback((id: string, timeout?: number) => {
		setBusyNodes((currentBusyNodes) => ({
			...currentBusyNodes,
			[id]: !currentBusyNodes[id]
		}));
		setTimeout(() => {
			setBusyNodes((currentBusyNodes) => ({
				...currentBusyNodes,
				[id]: !currentBusyNodes[id]
			}));
		}, timeout);
	}, []);

	const rowEventHandlers: TreeTableRowEventHandlers = useCallback(
		({ row }) => {
			return {
				onArrowClick(): void {
					setExpandedNodes((currentExpandedNodes) => {
						const nextExpandedNodes = !currentExpandedNodes[row.id];

						if (nextExpandedNodes) {
							makeBusyNode(row.id, Math.random() * 2000);
						}

						return { ...currentExpandedNodes, [row.id]: nextExpandedNodes };
					});
				}
			};
		},
		[makeBusyNode]
	);

	const rowStyling: TreeTableRowStyling = useCallback(
		({ row }) => {
			const node = getNodeById(row.id, generateTreeTableNodes(undefined, "async"));

			return { collapsed: node?.children ? !expandedNodes[row.id] : undefined };
		},
		[expandedNodes]
	);

	const componentRenderers: Partial<TreeTableComponentRenderers> = useMemo(() => {
		return {
			additionalContentRenderer: ({ row }): ReactNode => {
				return (
					busyNodes[row.id] && (
						<div style={{ width: "100%", height: "100px" }}>
							<ProgressIndicator outerOverlayVariant="bright" innerOverlayVariant="bright" />
						</div>
					)
				);
			}
		};
	}, [busyNodes]);

	const root: BaseTreeTableNode = useMemo(() => {
		function recurse(node: BaseTreeTableNode): BaseTreeTableNode {
			const children: BaseTreeTableNode[] = [];

			if (!busyNodes[node.id]) {
				return { ...node, children: node.children?.map(recurse) };
			}

			return { ...node, children };
		}

		return recurse(generateTreeTableNodes(undefined, "async"));
	}, [busyNodes]);

	return (
		<TreeTable
			id="async-tree-table"
			root={root}
			columns={COLUMNS}
			rowEventHandlers={rowEventHandlers}
			rowStyling={rowStyling}
			componentRenderers={componentRenderers}
		/>
	);
};
