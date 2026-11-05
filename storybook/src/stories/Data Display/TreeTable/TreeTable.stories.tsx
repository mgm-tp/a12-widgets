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

import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";
import { useState, useCallback, useMemo, useRef } from "react";
import { DndProvider } from "react-dnd";
import { styled } from "styled-components";

import type {
	BaseTreeTableColumnType,
	BaseTreeTableNode,
	TreeTableRowEventHandlers,
	TreeTableRowStyling,
	TreeTableScrollToNodeHandler
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	TreeTable,
	Button,
	ButtonGroup,
	DragAndDropUtils,
	Icon,
	TreeTableNodeDropPosition
} from "@com.mgmtp.a12.widgets/widgets-core";

import { COLUMNS, ROOT, getNodeById } from "./tree-table.data.js";
import type { FileNode, FlatFileNode } from "./tree-table.dnd-data.js";
import { DND_COLUMNS, DND_ROOT, findNode, useDndTree } from "./tree-table.dnd-data.js";

const meta: Meta<typeof TreeTable> = {
	title: "Data Display/TreeTable",
	component: TreeTable,
	parameters: { layout: "padded" },
	argTypes: {
		root: {
			control: false,
			description:
				"Root node of the tree. Each node provides an `id`, `data` (one cell per column), an optional `icon` and optional `children`."
		},
		columns: {
			control: false,
			description:
				"Column definitions. Mark exactly one column as `hierarchical` to render the expand/collapse arrows and node icons in it."
		},
		hideRoot: {
			control: "boolean",
			description: "Hides the root node and renders its children as top-level rows."
		},
		enableColumnGroupA11y: {
			control: "boolean",
			description:
				'Improves accessibility of grouped column headers (`scope="colgroup"`) and aligns header widths with body cells.'
		},
		rowStyling: {
			control: false,
			description:
				"Callback returning per-row styles such as `selected`, `disabled`, `highlighted`, `interactive` and `collapsed`."
		},
		rowEventHandlers: {
			control: false,
			description:
				"Callback returning per-row event handlers, including `onClick` and `onArrowClick` for expand/collapse."
		},
		scrollToNode: {
			control: false,
			description: "Receives a handler to programmatically scroll the table to a node by its `id`."
		},
		virtualScrollOptions: {
			control: false,
			description: "Enables virtual scrolling; requires a fixed `rowHeight`."
		},
		componentRenderers: {
			control: false,
			description: "Custom renderers for table parts, e.g. `bodyContentRenderer` for custom cell content."
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		id: "playground-tree-table",
		root: ROOT,
		columns: COLUMNS,
		hideRoot: false,
		enableColumnGroupA11y: false
	},
	render: function PlaygroundExample(args) {
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

		return <TreeTable {...args} rowStyling={rowStyling} rowEventHandlers={rowEventHandlers} />;
	},
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
	render: function DisabledRowsExample() {
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
	},
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
	render: function RowHighlightingExample() {
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"Return `highlighted: true` with a `highlightVariant` from `rowStyling` to visually accent specific rows — here leaf nodes get the success highlight."
			}
		}
	}
};

export const HideRoot: Story = {
	render: function HideRootExample() {
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
	},
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

const COLUMNS_WITH_ACTIONS: BaseTreeTableColumnType[] = [
	...COLUMNS,
	{ label: "", horizontalAlignment: "center", actionColumn: true } as BaseTreeTableColumnType
];

export const WithActionColumn: Story = {
	render: function WithActionColumnExample() {
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
	},
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

export const ScrollToNode: Story = {
	render: function ScrollToNodeExample() {
		const scrollHandlerRef = useRef<TreeTableScrollToNodeHandler | undefined>(undefined);

		const scrollTo = (nodeId: number) => scrollHandlerRef.current?.(nodeId, { autoFocus: false });

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 500 }}>
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
	render: function ColumnGroupExample() {
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

// ---------------------------------------------------------------------------
// Drag and drop
//
// TreeTable's DnD is built on react-dnd, so every story below has to be wrapped
// in a DndProvider. Drop targets come in three flavours (TreeTableNodeDropPosition):
// TOP / BOTTOM reorder next to the hovered row, AS_CHILD re-parents into it.
// ---------------------------------------------------------------------------

const withDndProvider: Decorator = (Story) => (
	<DndProvider backend={DragAndDropUtils.DefaultDndBackend} options={DragAndDropUtils.DefaultDndBackendOptions}>
		<Story />
	</DndProvider>
);

function positionLabel(position: TreeTableNodeDropPosition): string {
	switch (position) {
		case TreeTableNodeDropPosition.TOP:
			return "above";
		case TreeTableNodeDropPosition.BOTTOM:
			return "below";
		default:
			return "into";
	}
}

/** Expand/collapse plus row styling shared by all drag-and-drop stories. */
function useFileTreeRows(
	root: FileNode,
	disableLocked = false
): { rowEventHandlers: TreeTableRowEventHandlers<FileNode>; rowStyling: TreeTableRowStyling<FileNode> } {
	const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

	const rowEventHandlers: TreeTableRowEventHandlers<FileNode> = useCallback(
		({ row }) => ({
			onArrowClick() {
				setCollapsedNodes((prev) => ({ ...prev, [row.id]: !prev[row.id] }));
			}
		}),
		[]
	);

	const rowStyling: TreeTableRowStyling<FileNode> = useCallback(
		({ row }) => {
			const node = findNode(row.id, root);
			const locked = disableLocked && !!row.data.locked;

			return {
				collapsed: node?.children?.length ? !!collapsedNodes[row.id] : undefined,
				interactive: !locked,
				disabled: locked,
				title: locked ? "Locked — cannot be dragged or dropped into" : undefined
			};
		},
		[collapsedNodes, disableLocked, root]
	);

	return { rowEventHandlers, rowStyling };
}

const StyledDndDemo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

/** Leaves empty space below the last row so the hidden root's drop zone can be reached. */
const StyledTallTable = styled.div`
	height: 480px;

	& > * {
		height: 100%;
	}
`;

function DragAndDropDemo({
	id,
	hideRoot,
	restricted
}: {
	id: string;
	hideRoot?: boolean;
	restricted?: boolean;
}): ReactElement {
	const [root, dragDropOptions, reset] = useDndTree(DND_ROOT, { restricted });
	const { rowEventHandlers, rowStyling } = useFileTreeRows(root, restricted);

	const table = (
		<TreeTable<FileNode>
			id={id}
			root={root}
			columns={DND_COLUMNS}
			hideRoot={hideRoot}
			dragDropOptions={dragDropOptions}
			rowEventHandlers={rowEventHandlers}
			rowStyling={rowStyling}
		/>
	);

	return (
		<StyledDndDemo>
			<ButtonGroup>
				<Button onClick={reset}>Reset tree</Button>
			</ButtonGroup>
			{hideRoot ? <StyledTallTable>{table}</StyledTallTable> : table}
		</StyledDndDemo>
	);
}

export const DragAndDrop: Story = {
	name: "Drag and Drop",
	decorators: [withDndProvider],
	render: () => <DragAndDropDemo id="dnd-tree-table" />,
	parameters: {
		docs: {
			description: {
				story:
					"Pass `dragDropOptions` to make rows draggable. Drop a row near another row's **top or bottom edge** to " +
					"reorder it among that row's siblings, or onto the **middle of a folder/drive** to re-parent it. " +
					"`onDrop` receives `{ dragItem, dropResult }` where `dropResult.position` is one of " +
					"`TreeTableNodeDropPosition.TOP`, `BOTTOM` or `AS_CHILD`; the consumer applies the move to its own tree. " +
					"`canDrop` here rejects self/descendant targets (which would create a cycle) and keeps drives at top level."
			}
		}
	}
};

export const DragAndDropRestrictions: Story = {
	name: "Drag and Drop — Restrictions",
	decorators: [withDndProvider],
	render: () => <DragAndDropDemo id="dnd-restricted-tree-table" restricted />,
	parameters: {
		docs: {
			description: {
				story:
					"`canDrag` decides which rows can be picked up and `canDrop` which targets accept them — forbidden targets " +
					'are marked while dragging. "Locked (read-only)" can neither be dragged nor receive a drop, files never ' +
					"accept children, and drives can only be reordered next to other drives. Note that a row whose " +
					"`rowStyling` returns `interactive: false` is not draggable either, independent of `canDrag`."
			}
		}
	}
};

export const DragAndDropHiddenRoot: Story = {
	name: "Drag and Drop — Hidden Root",
	decorators: [withDndProvider],
	render: () => <DragAndDropDemo id="dnd-hide-root-tree-table" hideRoot />,
	parameters: {
		docs: {
			description: {
				story:
					"With `hideRoot`, the table itself becomes a drop target for the (invisible) root node: drop a row onto the " +
					"empty area below the last row to move it back to the top level. Everything else behaves as in the basic " +
					"drag-and-drop story."
			}
		}
	}
};

const StyledDndLog = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-height: 120px;
	padding: 8px 12px;
	border: 1px solid rgb(128 128 128 / 40%);
	font-family: monospace;
	font-size: 12px;
`;

function DragAndDropEventsDemo(): ReactElement {
	const [log, setLog] = useState<string[]>([]);
	const [hovered, setHovered] = useState<string | undefined>();
	const hoveredRef = useRef<string | undefined>(undefined);

	const append = useCallback((entry: string) => setLog((prev) => [entry, ...prev].slice(0, 8)), []);

	const onNodeMoved = useCallback(
		({
			dragged,
			target,
			position
		}: {
			dragged: FlatFileNode;
			target: FlatFileNode;
			position: TreeTableNodeDropPosition;
		}) => append(`onDrop: "${dragged.data.name}" ${positionLabel(position)} "${target.data.name}"`),
		[append]
	);

	const [root, dragDropOptions, reset] = useDndTree(DND_ROOT, { onNodeMoved });
	const { rowEventHandlers, rowStyling } = useFileTreeRows(root);

	const updateHovered = useCallback((label: string | undefined) => {
		if (label !== hoveredRef.current) {
			hoveredRef.current = label;
			setHovered(label);
		}
	}, []);

	const optionsWithEvents: typeof dragDropOptions = useMemo(
		() => ({
			...dragDropOptions,
			onBeginDrag({ dragItem }) {
				append(`onBeginDrag: "${dragItem.row.data.name}"`);
			},
			onHover({ hoveredItem }) {
				updateHovered(
					hoveredItem ? `${positionLabel(hoveredItem.position)} "${hoveredItem.row.data.name}"` : undefined
				);
			},
			onEndDrag({ dropResult }) {
				updateHovered(undefined);
				append(dropResult ? "onEndDrag: dropped" : "onEndDrag: cancelled");
			}
		}),
		[append, dragDropOptions, updateHovered]
	);

	return (
		<StyledDndDemo>
			<ButtonGroup>
				<Button
					onClick={() => {
						reset();
						setLog([]);
					}}
				>
					Reset tree
				</Button>
			</ButtonGroup>
			<TreeTable<FileNode>
				id="dnd-events-tree-table"
				root={root}
				columns={DND_COLUMNS}
				dragDropOptions={optionsWithEvents}
				rowEventHandlers={rowEventHandlers}
				rowStyling={rowStyling}
			/>
			<StyledDndLog aria-live="polite">
				<div>{hovered ? `hovering: ${hovered}` : "hovering: —"}</div>
				{log.map((entry, index) => (
					<div key={`${entry}-${index}`}>{entry}</div>
				))}
			</StyledDndLog>
		</StyledDndDemo>
	);
}

export const DragAndDropEvents: Story = {
	name: "Drag and Drop — Events",
	decorators: [withDndProvider],
	render: () => <DragAndDropEventsDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"The full drag lifecycle: `onBeginDrag` when a row is picked up, `onHover` for every hovered drop target " +
					"(row **and** position — useful for custom highlighting or auto-expanding), `onDrop` when a valid drop is " +
					"applied, and `onEndDrag` when the gesture finishes, with `dropResult: null` if it was cancelled. " +
					"`onHover` fires very frequently, so keep its handler cheap — here the hovered target is only written to " +
					"state when it actually changes."
			}
		}
	}
};
