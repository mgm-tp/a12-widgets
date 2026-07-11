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

import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type {
	BaseTreeTableColumnType,
	TreeTableRowEventHandlers,
	TreeTableRowStyling
} from "@com.mgmtp.a12.widgets/widgets-core";
import { TreeTable, Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import { COLUMNS, ROOT, getNodeById } from "./tree-table.data.js";

const COLUMNS_WITH_ACTIONS: BaseTreeTableColumnType[] = [
	...COLUMNS,
	{ label: "", horizontalAlignment: "center", actionColumn: true } as BaseTreeTableColumnType
];

function ActionColumnTreeTableDemo() {
	const [selectedNode, setSelectedNode] = useState<number | undefined>();
	const [collapsedNodes, setCollapsedNodes] = useState<Record<number, boolean>>({});

	const rowEventHandlers: TreeTableRowEventHandlers = useCallback(
		({ row }) => ({
			onArrowClick() {
				setCollapsedNodes((prev) => ({ ...prev, [row.id]: !prev[row.id] }));
			},
			onClick() {
				setSelectedNode(row.id);
			}
		}),
		[]
	);

	const rowStyling: TreeTableRowStyling = useCallback(
		({ row }) => {
			const node = getNodeById(row.id, ROOT);

			return {
				selected: row.id === selectedNode,
				interactive: true,
				collapsed: node?.children ? !!collapsedNodes[row.id] : undefined
			};
		},
		[collapsedNodes, selectedNode]
	);

	const bodyContentRenderer = ({ column }: { column: BaseTreeTableColumnType; row: unknown }) => {
		if (column.actionColumn) {
			return <Button destructive icon={<Icon>delete</Icon>} onClick={(e) => e.stopPropagation()} />;
		}

		return undefined;
	};

	return (
		<TreeTable
			id="action-column-tree-table"
			root={ROOT}
			columns={COLUMNS_WITH_ACTIONS}
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
			componentRenderers={{ bodyContentRenderer } as never}
		/>
	);
}

function HideRootTreeTableDemo() {
	const [selectedNode, setSelectedNode] = useState<number | undefined>();
	const [collapsedNodes, setCollapsedNodes] = useState<Record<number, boolean>>({});

	const rowEventHandlers: TreeTableRowEventHandlers = useCallback(
		({ row }) => ({
			onArrowClick() {
				setCollapsedNodes((prev) => ({ ...prev, [row.id]: !prev[row.id] }));
			},
			onClick() {
				setSelectedNode(row.id);
			}
		}),
		[]
	);

	const rowStyling: TreeTableRowStyling = useCallback(
		({ row }) => {
			const node = getNodeById(row.id, ROOT);

			return {
				selected: row.id === selectedNode,
				interactive: true,
				collapsed: node?.children ? !!collapsedNodes[row.id] : undefined
			};
		},
		[collapsedNodes, selectedNode]
	);

	return (
		<TreeTable
			id="hide-root-tree-table"
			root={ROOT}
			columns={COLUMNS}
			hideRoot
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
		/>
	);
}

const meta: Meta = {
	title: "Data Display/TreeTable/Interactions",
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithActionColumn: Story = {
	name: "With Action Column",
	render: () => <ActionColumnTreeTableDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Adds a pinned action column containing a per-row delete button. " +
					"Use `componentRenderers.bodyContentRenderer` with `column.actionColumn` to inject custom cell content."
			}
		}
	}
};

export const HideRoot: Story = {
	name: "Hide Root Node",
	render: () => <HideRootTreeTableDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Set `hideRoot` to suppress the root node and show its children as top-level rows — " +
					"useful when the root is a conceptual container rather than a meaningful entry."
			}
		}
	}
};
