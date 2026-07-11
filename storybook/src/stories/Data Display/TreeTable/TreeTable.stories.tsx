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

import { useState, useCallback, useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type {
	BaseTreeTableColumnType,
	BaseTreeTableNode,
	TreeTableRowEventHandlers,
	TreeTableRowStyling,
	TreeTableScrollToNodeHandler
} from "@com.mgmtp.a12.widgets/widgets-core";
import { TreeTable, Button, ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core";

import { COLUMNS, ROOT, getNodeById } from "./tree-table.data.js";

function BasicTreeTableDemo() {
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
				collapsed: node?.children ? !!collapsedNodes[row.id] : undefined,
				title: row.id === selectedNode ? "Selected" : "Selectable"
			};
		},
		[collapsedNodes, selectedNode]
	);

	return (
		<TreeTable
			id="basic-tree-table"
			root={ROOT}
			columns={COLUMNS}
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
		/>
	);
}

function DisabledRowsDemo() {
	const [collapsedNodes, setCollapsedNodes] = useState<Record<number, boolean>>({});

	const rowEventHandlers: TreeTableRowEventHandlers = useCallback(
		({ row }) => ({
			onArrowClick() {
				setCollapsedNodes((prev) => ({ ...prev, [row.id]: !prev[row.id] }));
			}
		}),
		[]
	);

	const rowStyling: TreeTableRowStyling = useCallback(
		({ row }) => {
			const node = getNodeById(row.id, ROOT);
			const isLeaf = !node?.children?.length;

			return {
				disabled: isLeaf,
				interactive: !isLeaf,
				collapsed: node?.children ? !!collapsedNodes[row.id] : undefined
			};
		},
		[collapsedNodes]
	);

	return (
		<TreeTable
			id="disabled-rows-tree-table"
			root={ROOT}
			columns={COLUMNS}
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
		/>
	);
}

function RowHighlightingDemo() {
	const [collapsedNodes, setCollapsedNodes] = useState<Record<number, boolean>>({});

	const rowEventHandlers: TreeTableRowEventHandlers = useCallback(
		({ row }) => ({
			onArrowClick() {
				setCollapsedNodes((prev) => ({ ...prev, [row.id]: !prev[row.id] }));
			}
		}),
		[]
	);

	const rowStyling: TreeTableRowStyling = useCallback(
		({ row }) => {
			const node = getNodeById(row.id, ROOT);

			return {
				highlighted: !node?.children?.length,
				highlightVariant: "success",
				interactive: true,
				collapsed: node?.children ? !!collapsedNodes[row.id] : undefined
			};
		},
		[collapsedNodes]
	);

	return (
		<TreeTable
			id="row-highlighting-tree-table"
			root={ROOT}
			columns={COLUMNS}
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
		/>
	);
}

const SCROLL_COLUMNS: BaseTreeTableColumnType[] = [
	{ label: "Name", hierarchical: true, horizontalAlignment: "left" },
	{ label: "Type", horizontalAlignment: "left" },
	{ label: "Size", horizontalAlignment: "right" }
];

const SCROLL_ROOT: BaseTreeTableNode<string[]> = {
	id: 1,
	data: ["Root", "folder", "-"],
	children: [
		{ id: 2, data: ["Node 2", "file", "1 KB"] },
		{ id: 3, data: ["Node 3", "file", "2 KB"] },
		{ id: 4, data: ["Node 4", "file", "3 KB"] },
		{ id: 5, data: ["Node 5", "file", "4 KB"] },
		{ id: 6, data: ["Node 6", "file", "5 KB"] },
		{ id: 7, data: ["Node 7", "file", "6 KB"] },
		{ id: 8, data: ["Node 8", "file", "7 KB"] },
		{ id: 9, data: ["Node 9", "file", "8 KB"] },
		{ id: 10, data: ["Node 10", "file", "9 KB"] },
		{ id: 11, data: ["Node 11", "file", "10 KB"] },
		{ id: 12, data: ["Node 12", "file", "11 KB"] },
		{ id: 13, data: ["Node 13", "file", "12 KB"] },
		{ id: 14, data: ["Node 14", "file", "13 KB"] },
		{ id: 15, data: ["Node 15", "file", "14 KB"] }
	]
};

const meta: Meta<typeof BasicTreeTableDemo> = {
	title: "Data Display/TreeTable",
	component: BasicTreeTableDemo,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: "Basic TreeTable",
	render: () => <BasicTreeTableDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"A hierarchical table combining tree navigation with tabular columns. " +
					"Click a row to select it; use the arrow button to expand or collapse a branch."
			}
		}
	}
};

export const DisabledRows: Story = {
	name: "Disabled Rows",
	render: () => <DisabledRowsDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Return `disabled: true` from `rowStyling` to suppress interactions on specific rows — here leaf (file) nodes are disabled."
			}
		}
	}
};

export const RowHighlighting: Story = {
	name: "Row Highlighting",
	render: () => <RowHighlightingDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Return `highlighted: true` with a `highlightVariant` from `rowStyling` to visually accent specific rows — here leaf nodes get the success highlight."
			}
		}
	}
};

export const ScrollToNode: Story = {
	name: "Scroll to Node",
	render: () => {
		const scrollHandlerRef = useRef<TreeTableScrollToNodeHandler | undefined>(undefined);

		const scrollTo = (nodeId: number) => scrollHandlerRef.current?.(nodeId, { autoFocus: false });

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: 12, width: 500 }}>
				<ButtonGroup>
					<Button onClick={() => scrollTo(2)}>Scroll to Node 2</Button>
					<Button onClick={() => scrollTo(8)}>Scroll to Node 8</Button>
					<Button onClick={() => scrollTo(15)}>Scroll to Node 15</Button>
				</ButtonGroup>

				<div style={{ height: 200, overflow: "auto", border: "1px solid #ccc" }}>
					<TreeTable
						id="scroll-to-node-tree-table"
						root={SCROLL_ROOT}
						columns={SCROLL_COLUMNS}
						scrollToNode={(handler) => {
							scrollHandlerRef.current = handler;
						}}
					/>
				</div>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "Demonstrates the `scrollToNode` API for programmatically scrolling the TreeTable to a specific row."
			}
		}
	}
};

// ---------------------------------------------------------------------------
// Column Group data for enableColumnGroupA11y story
// ---------------------------------------------------------------------------

interface PersonData {
	name: string;
	username: string;
	phone: string;
	email: string;
	website: string;
	street: string;
	city: string;
	company: string;
	department: string;
}

type PersonNode = BaseTreeTableNode<PersonData>;

const COLUMN_GROUP_COLUMNS: BaseTreeTableColumnType<PersonNode>[] = [
	{
		label: "Name",
		horizontalAlignment: "left",
		hierarchical: true,
		pinning: "left",
		width: 1.5,
		dataGetter: ({ row }) => row.data.name
	},
	{
		label: "Profile",
		subColumns: [
			{ label: "Username", horizontalAlignment: "left", dataGetter: ({ row }) => row.data.username },
			{ label: "Phone", horizontalAlignment: "left", dataGetter: ({ row }) => row.data.phone }
		]
	},
	{
		label: "Contact",
		subColumns: [
			{
				label: "E-address",
				subColumns: [
					{ label: "Email", width: 2, dataGetter: ({ row }) => row.data.email },
					{ label: "Website", dataGetter: ({ row }) => row.data.website }
				]
			},
			{
				label: "Home Address",
				subColumns: [
					{ label: "Street", dataGetter: ({ row }) => row.data.street },
					{ label: "City", dataGetter: ({ row }) => row.data.city }
				]
			}
		]
	},
	{
		label: "Organization",
		pinning: "right",
		subColumns: [
			{ label: "Company", width: 0.7, dataGetter: ({ row }) => row.data.company },
			{ label: "Department", dataGetter: ({ row }) => row.data.department }
		]
	}
];

const COLUMN_GROUP_ROOT: PersonNode = {
	id: 1,
	data: {
		name: "Alice Johnson",
		username: "alicej",
		phone: "555-0101",
		email: "alice@example.com",
		website: "alice.dev",
		street: "12 Oak Ave",
		city: "Springfield",
		company: "Acme Corp",
		department: "Engineering"
	},
	children: [
		{
			id: 2,
			data: {
				name: "Bob Smith",
				username: "bsmith",
				phone: "555-0102",
				email: "bob@example.com",
				website: "bob.io",
				street: "7 Maple St",
				city: "Shelbyville",
				company: "Globex",
				department: "Marketing"
			}
		},
		{
			id: 3,
			data: {
				name: "Carol White",
				username: "cwhite",
				phone: "555-0103",
				email: "carol@example.com",
				website: "carol.net",
				street: "3 Pine Rd",
				city: "Capital City",
				company: "Initech",
				department: "Finance"
			},
			children: [
				{
					id: 4,
					data: {
						name: "David Lee",
						username: "dlee",
						phone: "555-0104",
						email: "david@example.com",
						website: "david.co",
						street: "88 Elm Blvd",
						city: "Ogdenville",
						company: "Umbrella",
						department: "Research"
					}
				},
				{
					id: 5,
					data: {
						name: "Eve Martinez",
						username: "evem",
						phone: "555-0105",
						email: "eve@example.com",
						website: "eve.org",
						street: "22 Cedar Ln",
						city: "North Haverbrook",
						company: "Soylent",
						department: "Operations"
					}
				}
			]
		}
	]
};

export const ColumnGroupWithEnhancedAccessibility: Story = {
	name: "Column Groups Accessibility",
	render: () => {
		const [collapsedNodes, setCollapsedNodes] = useState<Record<number, boolean>>({});

		const rowEventHandlers: TreeTableRowEventHandlers = useCallback(
			({ row }) => ({
				onArrowClick() {
					setCollapsedNodes((prev) => ({ ...prev, [row.id]: !prev[row.id] }));
				}
			}),
			[]
		);

		const rowStyling: TreeTableRowStyling = useCallback(
			({ row }) => {
				const node = getNodeById(row.id, COLUMN_GROUP_ROOT);

				return {
					collapsed: node?.children ? !!collapsedNodes[row.id] : undefined,
					interactive: true
				};
			},
			[collapsedNodes]
		);

		return (
			<TreeTable<PersonNode>
				id="column-group-tree-table"
				root={COLUMN_GROUP_ROOT}
				columns={COLUMN_GROUP_COLUMNS}
				rowEventHandlers={rowEventHandlers}
				rowStyling={rowStyling}
				enableColumnGroupA11y
			/>
		);
	},
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				story:
					'With `enableColumnGroupA11y`, column group headers use `scope="colgroup"` and the header grid ' +
					"synchronizes its column widths to the rendered body cells for precise visual alignment."
			}
		}
	}
};
