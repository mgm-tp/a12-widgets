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

import type { Key, ReactElement } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { keyframes, styled } from "styled-components";

import type { RowEventHandlerGetter } from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	DataTableCellStyleGetter,
	DataTableColumn,
	DataTableColumnResizeEventHandler,
	DataTableSlotProps,
	DataTableSortOrder,
	DataTableSortState,
	DataTreeTableScrollToNodeHandler,
	DataTableRowStyleGetter
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Button, ButtonGroup, Checkbox, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTreeTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

interface FileNode {
	id: string;
	name: string;
	size: string;
	modified: string;
	kind: "folder" | "file";
	children?: FileNode[];
}

const folder = (id: string, name: string, modified: string, children?: FileNode[]): FileNode => ({
	id,
	name,
	size: "—",
	modified,
	kind: "folder",
	children
});

const file = (id: string, name: string, size: string, modified: string): FileNode => ({
	id,
	name,
	size,
	modified,
	kind: "file"
});

const spin = keyframes`
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
`;

/** A bare expand/collapse control that swaps the chevron for a spinning icon while children load. */
const TreeToggle = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	border: none;
	background: none;
	color: inherit;
	cursor: pointer;
`;

const SpinningIcon = styled(Icon)`
	animation: ${spin} 0.8s linear infinite;
`;

const TREE: FileNode[] = [
	folder("src", "src", "2026-06-10", [
		folder("components", "components", "2026-06-09", [
			file("button", "button.tsx", "4 KB", "2026-06-09"),
			file("table", "table.tsx", "18 KB", "2026-06-09")
		]),
		file("index", "index.ts", "1 KB", "2026-06-10")
	]),
	folder("assets", "assets", "2026-05-20", [file("logo", "logo.svg", "12 KB", "2026-05-20")]),
	file("readme", "README.md", "2 KB", "2026-06-01")
];

/** The consumer's row type flows straight through; the wrapper adds the indent + chevron in front. */
const COLUMNS: DataTableColumn<FileNode>[] = [
	{ label: "Name", dataKey: "name", width: 3 },
	{ label: "Size", dataKey: "size", width: 1, horizontalAlignment: "right" },
	{ label: "Modified", dataKey: "modified", width: 1.5 }
];

const ALL_KEYS: Key[] = ["src", "components", "assets"];

function BasicDemo(): ReactElement {
	return (
		<DataTreeTable<FileNode>
			ariaLabel="Files"
			tree={TREE}
			columns={COLUMNS}
			rowKey="id"
			maxHeight={360}
			defaultExpandedKeys={["src"]}
		/>
	);
}

function ControlledDemo(): ReactElement {
	const [expanded, setExpanded] = useState<Set<Key>>(() => new Set(["src"]));

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<ButtonGroup>
				<Button onClick={() => setExpanded(new Set(ALL_KEYS))}>Expand all</Button>
				<Button onClick={() => setExpanded(new Set())}>Collapse all</Button>
			</ButtonGroup>
			<DataTreeTable<FileNode>
				ariaLabel="Files"
				tree={TREE}
				columns={COLUMNS}
				rowKey="id"
				maxHeight={360}
				expandedKeys={expanded}
				onExpandedChange={setExpanded}
			/>
		</div>
	);
}

/** Lazily loads a folder's children on first expand, simulating a network round-trip. */
function LazyDemo(): ReactElement {
	// Children are left undefined (not []) so the model treats them as unloaded and lazy-loadable —
	// an empty array would mean "known to have zero children" and the row would show no chevron.
	const roots: FileNode[] = [
		folder("remote", "remote", "2026-06-12", undefined),
		folder("cache", "cache", "2026-06-12", undefined)
	];

	const loadChildren = (row: FileNode): Promise<FileNode[]> =>
		new Promise((resolve) =>
			setTimeout(
				() =>
					resolve([
						file(`${row.id}-1`, `${row.name}-a.bin`, "8 KB", "2026-06-12"),
						file(`${row.id}-2`, `${row.name}-b.bin`, "16 KB", "2026-06-12")
					]),
				600
			)
		);

	return (
		<DataTreeTable<FileNode>
			ariaLabel="Lazy files"
			tree={roots}
			columns={COLUMNS}
			rowKey="id"
			maxHeight={360}
			loadChildren={loadChildren}
			isLeaf={(row) => row.kind === "file"}
		/>
	);
}

/**
 * Controlled pagination (flat-adjacency mode): the consumer owns its own `data` and loading, keeping its
 * store as the single source of truth. `getPagination(parentId)` reports `{ hasMore, total }` for a
 * parent's children (or the implicit root when `parentId` is `undefined`), and `onLoadMore` / `onLoadAll`
 * append rows to the consumer-owned snapshot. The widget renders a grid-spanning load-more row with
 * _Load more_ / _Load all N_ links (and a progress indicator while a page is in flight).
 */
function ControlledPaginationDemo(props: { loadMoreLabel?: string; loadAllLabel?: string } = {}): ReactElement {
	interface FlatNode {
		id: string;
		parentId?: string;
		name: string;
		size: string;
		modified: string;
		kind: "folder" | "file";
	}

	const PAGE_SIZE = 3;
	const ROOT_TOTAL = 7;
	const CHILD_TOTAL = 5;

	// The full backing dataset a store would fetch from, page by page. The first root is a folder whose
	// children are themselves paginated — so a load-more row appears both at the root and inside it.
	const allRoots: FlatNode[] = Array.from({ length: ROOT_TOTAL }, (_unused, index) =>
		index === 0
			? { id: "logs", name: "logs", size: "—", modified: "2026-06-12", kind: "folder" }
			: { id: `root-${index}`, name: `report-${index}.csv`, size: `${index} KB`, modified: "2026-06-12", kind: "file" }
	);
	const allChildren: FlatNode[] = Array.from({ length: CHILD_TOTAL }, (_unused, index) => ({
		id: `logs/entry-${index + 1}`,
		parentId: "logs",
		name: `entry-${index + 1}.log`,
		size: `${index + 1} KB`,
		modified: "2026-06-12",
		kind: "file"
	}));

	const [rootLoaded, setRootLoaded] = useState(PAGE_SIZE);
	const [childLoaded, setChildLoaded] = useState(PAGE_SIZE);
	const [expanded, setExpanded] = useState<Set<Key>>(() => new Set(["logs"]));

	const data: FlatNode[] = [...allRoots.slice(0, rootLoaded), ...allChildren.slice(0, childLoaded)];

	const columns: DataTableColumn<FlatNode>[] = [
		{ label: "Name", dataKey: "name", width: 3 },
		{ label: "Size", dataKey: "size", width: 1, horizontalAlignment: "right" },
		{ label: "Modified", dataKey: "modified", width: 1.5 }
	];

	return (
		<DataTreeTable<FlatNode>
			ariaLabel="Controlled paginated files"
			data={data}
			getParentId={(row) => row.parentId}
			rowKey="id"
			columns={columns}
			maxHeight={360}
			expandedKeys={expanded}
			onExpandedChange={setExpanded}
			isLeaf={(row) => row.kind === "file"}
			getPagination={(parentId) => {
				if (parentId === undefined) {
					return rootLoaded < ROOT_TOTAL ? { hasMore: true, total: ROOT_TOTAL } : undefined;
				}

				if (parentId === "logs") {
					return childLoaded < CHILD_TOTAL ? { hasMore: true, total: CHILD_TOTAL } : undefined;
				}

				return undefined;
			}}
			onLoadMore={({ parentId }) => {
				if (parentId === undefined) {
					setRootLoaded((n) => Math.min(n + PAGE_SIZE, ROOT_TOTAL));
				} else if (parentId === "logs") {
					setChildLoaded((n) => Math.min(n + PAGE_SIZE, CHILD_TOTAL));
				}
			}}
			onLoadAll={({ parentId }) => {
				if (parentId === undefined) {
					setRootLoaded(ROOT_TOTAL);
				} else if (parentId === "logs") {
					setChildLoaded(CHILD_TOTAL);
				}
			}}
			loadMoreLabel={props.loadMoreLabel}
			loadAllLabel={props.loadAllLabel}
		/>
	);
}

/** Replaces the default chevron with a consumer-supplied control via `renderExpandToggle`. */
function CustomToggleDemo(): ReactElement {
	// Children left undefined so the rows lazy-load — exercising the custom toggle's loading branch too.
	const roots: FileNode[] = [
		folder("remote", "remote", "2026-06-12", undefined),
		folder("cache", "cache", "2026-06-12", undefined)
	];

	const loadChildren = (row: FileNode): Promise<FileNode[]> =>
		new Promise((resolve) =>
			setTimeout(
				() =>
					resolve([
						file(`${row.id}-1`, `${row.name}-a.bin`, "8 KB", "2026-06-12"),
						file(`${row.id}-2`, `${row.name}-b.bin`, "16 KB", "2026-06-12")
					]),
				600
			)
		);

	return (
		<DataTreeTable<FileNode>
			ariaLabel="Custom toggle"
			tree={roots}
			columns={COLUMNS}
			rowKey="id"
			maxHeight={360}
			loadChildren={loadChildren}
			isLeaf={(row) => row.kind === "file"}
			renderExpandToggle={({ expanded, loading, toggle }) =>
				loading ? (
					<SpinningIcon aria-label="Loading">progress_activity</SpinningIcon>
				) : (
					<TreeToggle type="button" aria-label={expanded ? "Collapse" : "Expand"} onClick={toggle}>
						<Icon>{expanded ? "keyboard_arrow_down" : "chevron_right"}</Icon>
					</TreeToggle>
				)
			}
		/>
	);
}

/** A leading folder/file icon per row via `getIcon` — no need to hand-assemble it in `renderCell`. */
function LeadingIconsDemo(): ReactElement {
	return (
		<DataTreeTable<FileNode>
			ariaLabel="Files with icons"
			tree={TREE}
			columns={COLUMNS}
			rowKey="id"
			defaultExpandAll
			getIcon={(row) => <Icon>{row.kind === "folder" ? "folder" : "description"}</Icon>}
		/>
	);
}

const DEEP_TREE: FileNode[] = [
	folder(
		"logs",
		"logs",
		"2026-06-11",
		Array.from({ length: 40 }, (_unused, index) =>
			file(`log-${index}`, `run-${String(index).padStart(3, "0")}.log`, `${index + 1} KB`, "2026-06-11")
		)
	)
];

function ScrollToNodeDemo(): ReactElement {
	const scrollRef = useRef<DataTreeTableScrollToNodeHandler>(null);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<ButtonGroup>
				<Button onClick={() => scrollRef.current?.("log-0", { autoFocus: true })}>Scroll to first</Button>
				<Button onClick={() => scrollRef.current?.("log-20", { autoFocus: true })}>Scroll to run-020</Button>
				<Button onClick={() => scrollRef.current?.("log-39", { autoFocus: true })}>Scroll to last</Button>
			</ButtonGroup>
			<DataTreeTable<FileNode>
				ariaLabel="Logs"
				tree={DEEP_TREE}
				columns={COLUMNS}
				rowKey="id"
				maxHeight={280}
				defaultExpandAll
				scrollToNode={(handler) => {
					scrollRef.current = handler;
				}}
			/>
		</div>
	);
}

function cloneForest(nodes: FileNode[]): FileNode[] {
	return nodes.map((node) => ({ ...node, children: node.children ? cloneForest(node.children) : undefined }));
}

function detach(nodes: FileNode[], id: Key): FileNode | undefined {
	const index = nodes.findIndex((node) => node.id === id);

	if (index >= 0) {
		return nodes.splice(index, 1)[0];
	}

	for (const node of nodes) {
		if (node.children) {
			const removed = detach(node.children, id);

			if (removed) {
				return removed;
			}
		}
	}

	return undefined;
}

function find(nodes: FileNode[], id: Key): FileNode | undefined {
	for (const node of nodes) {
		if (node.id === id) {
			return node;
		}

		if (node.children) {
			const found = find(node.children, id);

			if (found) {
				return found;
			}
		}
	}

	return undefined;
}

function findSiblings(nodes: FileNode[], id: Key): FileNode[] | undefined {
	if (nodes.some((node) => node.id === id)) {
		return nodes;
	}

	for (const node of nodes) {
		if (node.children) {
			const siblings = findSiblings(node.children, id);

			if (siblings) {
				return siblings;
			}
		}
	}

	return undefined;
}

function DragAndDropDemo(): ReactElement {
	const [forest, setForest] = useState<FileNode[]>(() => cloneForest(TREE));

	return (
		<DataTreeTable<FileNode>
			ariaLabel="Files (drag to reorder / reparent)"
			tree={forest}
			columns={COLUMNS}
			rowKey="id"
			maxHeight={360}
			defaultExpandAll
			dragDropOptions={{
				onDrop: ({ source, target, position }) => {
					setForest((current) => {
						const next = cloneForest(current);

						if (!detach(next, source.id)) {
							return current;
						}

						// Re-detach from the clone (detach mutated `next`); re-create the dragged node from source.
						const dragged: FileNode = { ...source };

						if (position === "inside") {
							const into = find(next, target.id);

							if (into) {
								into.children = [...(into.children ?? []), dragged];
							}

							return next;
						}

						const siblings = findSiblings(next, target.id);

						if (!siblings) {
							return current;
						}

						const index = siblings.findIndex((node) => node.id === target.id);
						siblings.splice(position === "before" ? index : index + 1, 0, dragged);

						return next;
					});
				}
			}}
		/>
	);
}

/**
 * One demo that turns on every `DataTreeTable` feature at once: nested `tree` data with a lazy,
 * paginated folder, controlled expansion, sorting, column resizing, a filter row, a footer, grouped
 * columns, an action column, drag-and-drop reparenting, a custom toggle + load-more, row selection,
 * cell highlighting and a programmatic scroll-to-node.
 */
const EVERYTHING_TREE: FileNode[] = [
	folder("src", "src", "2026-06-10", [
		folder("components", "components", "2026-06-09", [
			file("button", "button.tsx", "4 KB", "2026-06-09"),
			file("table", "table.tsx", "18 KB", "2026-06-09"),
			file("tree", "tree.tsx", "11 KB", "2026-06-09")
		]),
		folder("hooks", "hooks", "2026-06-08", [file("use-tree", "use-tree.ts", "3 KB", "2026-06-08")]),
		file("index", "index.ts", "1 KB", "2026-06-10")
	]),
	folder("assets", "assets", "2026-05-20", [
		file("logo", "logo.svg", "12 KB", "2026-05-20"),
		file("hero", "hero.png", "340 KB", "2026-05-19")
	]),
	// Children left undefined → lazy-loaded (paginated) on first expand.
	folder("logs", "logs", "2026-06-12", undefined),
	file("readme", "README.md", "2 KB", "2026-06-01")
];

/** Every folder key — used to seed / drive expand-all. */
function collectFolderKeys(nodes: FileNode[]): Key[] {
	return nodes.flatMap((node) =>
		node.kind === "folder" ? [node.id, ...(node.children ? collectFolderKeys(node.children) : [])] : []
	);
}

/** Every node key (folders and files) — used to drive the select-all header checkbox. */
function collectAllKeys(nodes: FileNode[]): Key[] {
	return nodes.flatMap((node) => [node.id, ...(node.children ? collectAllKeys(node.children) : [])]);
}

function countNodes(nodes: FileNode[]): number {
	return nodes.reduce((sum, node) => sum + 1 + (node.children ? countNodes(node.children) : 0), 0);
}

type SortKey = "name" | "size" | "modified" | "kind";

/** Recursively sorts each sibling group, preserving the hierarchy. */
function sortForest(nodes: FileNode[], key: SortKey, order: Exclude<DataTableSortOrder, undefined>): FileNode[] {
	const direction = order === "asc" ? 1 : -1;

	return [...nodes]
		.sort((a, b) => (a[key] < b[key] ? -direction : a[key] > b[key] ? direction : 0))
		.map((node) => (node.children ? { ...node, children: sortForest(node.children, key, order) } : node));
}

/** Whether `nodeId` sits anywhere inside `ancestorId`'s subtree — the drop cycle guard. */
function isWithinSubtree(nodes: FileNode[], ancestorId: Key, nodeId: Key): boolean {
	const ancestor = find(nodes, ancestorId);

	return !!ancestor?.children && !!find(ancestor.children, nodeId);
}

const StyledToolbar = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

function EverythingDemo(): ReactElement {
	const [forest, setForest] = useState<FileNode[]>(() => cloneForest(EVERYTHING_TREE));
	const [expanded, setExpanded] = useState<Set<Key>>(() => new Set(["src", "components"]));
	const [selectedId, setSelectedId] = useState<Key | undefined>();
	const [checkedIds, setCheckedIds] = useState<Set<Key>>(() => new Set());
	const [sortState, setSortState] = useState<DataTableSortState>([]);
	const [widths, setWidths] = useState<Record<string, number>>({});
	const scrollRef = useRef<DataTreeTableScrollToNodeHandler>(null);

	const folderKeys = useMemo(() => collectFolderKeys(forest), [forest]);
	const allKeys = useMemo(() => collectAllKeys(forest), [forest]);

	// Drives the select-all header checkbox: fully checked when every node is selected, "mixed" when only
	// some are, unchecked otherwise.
	const allChecked = allKeys.length > 0 && allKeys.every((key) => checkedIds.has(key));
	const someChecked = !allChecked && allKeys.some((key) => checkedIds.has(key));

	const toggleChecked = useCallback((id: Key, checked: boolean) => {
		setCheckedIds((prev) => {
			const next = new Set(prev);

			if (checked) {
				next.add(id);
			} else {
				next.delete(id);
			}

			return next;
		});
	}, []);

	// Sort derives a fresh tree but keeps node ids (and thus expansion + lazy children) stable. Sort
	// state is id-keyed, so the active sort is the first entry's `columnId` (here equal to `dataKey`).
	const visibleTree = useMemo(() => {
		const { columnId, order } = sortState[0] ?? {};

		return columnId && order ? sortForest(forest, columnId as SortKey, order) : forest;
	}, [forest, sortState]);

	const onSort = useCallback((next: DataTableSortState) => setSortState(next), []);

	const onEndResize: DataTableColumnResizeEventHandler<DataTableColumn<FileNode>> = useCallback(
		({ resizedColumn, resizedWidthsGetter }) => {
			const key = resizedColumn.dataKey as string | undefined;
			const width = resizedWidthsGetter?.(resizedColumn);

			if (key && typeof width === "number") {
				setWidths((prev) => ({ ...prev, [key]: width }));
			}
		},
		[]
	);

	const rowEventHandlers: RowEventHandlerGetter<FileNode> = useCallback(
		({ row }) => ({ onClick: () => setSelectedId((prev) => (prev === row.id ? undefined : row.id)) }),
		[]
	);

	const rowStyling: DataTableRowStyleGetter<FileNode> = useCallback(
		({ row }) => ({
			selected: row.id === selectedId,
			interactive: true,
			title: row.kind === "folder" ? "Folder" : "File"
		}),
		[selectedId]
	);

	// De-emphasize the placeholder size of folders.
	const cellStyling: DataTableCellStyleGetter<FileNode, DataTableColumn<FileNode>> = useCallback(
		({ row, column }) =>
			column.dataKey === "size" && row.kind === "folder"
				? { useSecondaryColor: true, secondaryCellTitle: "Folders have no size" }
				: {},
		[]
	);

	const deleteNode = useCallback(
		(id: Key) =>
			setForest((current) => {
				const next = cloneForest(current);
				detach(next, id);

				return next;
			}),
		[]
	);

	const columns = useMemo<DataTableColumn<FileNode>[]>(() => {
		// Sort state is id-keyed, so the built-in sort indicator and `aria-sort` work out of the box
		// even though DataTreeTable re-clones columns each render — no custom sort header needed.
		return [
			{
				// A leading checkbox-selection column. It also pushes the tree column ("name") to the second
				// position, so the lazy `logs` folder's load-more row demonstrates that the affordance aligns
				// to the tree column wherever it sits — not just when it is the first column.
				label: "",
				dataKey: "select",
				pinning: "left",
				fixedWidth: true,
				width: 0.3,
				renderHeader: () => (
					<Checkbox.Indeterminate
						label="Select all rows"
						hideLabel
						checked={allChecked ? true : someChecked ? "mixed" : false}
						onChange={(value) => setCheckedIds(value ? new Set(allKeys) : new Set())}
					/>
				),
				renderCell: ({ row }) => (
					<Checkbox
						label={`Select ${row.name}`}
						hideLabel
						checked={checkedIds.has(row.id)}
						onChange={(value) => toggleChecked(row.id, value)}
						// Stop the toggle from also triggering the row's click-to-highlight handler.
						inputProps={{ onClick: (event) => event.stopPropagation() }}
					/>
				)
			},
			{
				label: "Name",
				dataKey: "name",
				width: widths.name ?? 3,
				pinning: "left",
				sortable: true,
				renderFooter: () => `${countNodes(visibleTree)} items`
			},
			{
				label: "Details",
				subColumns: [
					{
						label: "Size",
						dataKey: "size",
						width: widths.size ?? 1,
						sortable: true,
						horizontalAlignment: "right"
					},
					{
						label: "Modified",
						dataKey: "modified",
						width: widths.modified ?? 1.5,
						sortable: true
					}
				]
			},
			{
				label: "Kind",
				dataKey: "kind",
				width: widths.kind ?? 1,
				sortable: true,
				renderCell: ({ row }) => (row.kind === "folder" ? "Folder" : "File")
			},
			{
				label: "",
				dataKey: "actions",
				actionColumn: true,
				pinning: "right",
				fixedWidth: true,
				width: 0.4,
				renderCell: ({ row }) => (
					<Button
						destructive
						icon={<Icon>delete</Icon>}
						title={`Delete ${row.name}`}
						onClick={(event) => {
							event.stopPropagation();
							deleteNode(row.id);
						}}
					/>
				)
			}
		];
	}, [widths, visibleTree, deleteNode, allChecked, someChecked, allKeys, checkedIds, toggleChecked]);

	return (
		<StyledToolbar>
			<ButtonGroup>
				<Button onClick={() => setExpanded(new Set(folderKeys))}>Expand all</Button>
				<Button onClick={() => setExpanded(new Set())}>Collapse all</Button>
				<Button onClick={() => scrollRef.current?.("table", { autoFocus: true })}>Scroll to table.tsx</Button>
				<Button onClick={() => setForest(cloneForest(EVERYTHING_TREE))}>Reset</Button>
			</ButtonGroup>
			<DataTreeTable<FileNode>
				ariaLabel="Everything-enabled file tree"
				tree={visibleTree}
				getChildren={(row) => row.children}
				columns={columns}
				rowKey="id"
				treeColumnKey="name"
				indentSize={22}
				getIcon={(row) => <Icon>{row.kind === "folder" ? "folder" : "description"}</Icon>}
				maxHeight={420}
				expandedKeys={expanded}
				onExpandedChange={setExpanded}
				isLeaf={(row) => row.kind === "file"}
				loadChildren={(row) => {
					const children = Array.from({ length: 7 }, (_unused, index) => {
						const n = index + 1;

						return file(`${row.id}-${n}`, `entry-${n}.log`, `${n} KB`, "2026-06-12");
					});

					return new Promise<FileNode[]>((resolve) => setTimeout(() => resolve(children), 1000));
				}}
				sortOptions={{ sortState, onSort }}
				columnResizingOptions={{ onEndResize }}
				rowEventHandlers={rowEventHandlers}
				rowStyling={rowStyling}
				cellStyling={cellStyling}
				scrollToNode={(handler) => {
					scrollRef.current = handler;
				}}
				dragDropOptions={{
					canDrop: ({ source, target, position }) => {
						if (source.id === target.id) {
							return false;
						}

						if (position === "inside" && target.kind !== "folder") {
							return false;
						}

						// Forbid dropping a node into its own subtree (would create a cycle).
						return !isWithinSubtree(forest, source.id, target.id);
					},
					onDrop: ({ source, target, position }) =>
						setForest((current) => {
							const next = cloneForest(current);

							if (!detach(next, source.id)) {
								return current;
							}

							const dragged: FileNode = { ...source };

							if (position === "inside") {
								const into = find(next, target.id);

								if (into) {
									into.children = [...(into.children ?? []), dragged];
								}

								return next;
							}

							const siblings = findSiblings(next, target.id);

							if (!siblings) {
								return current;
							}

							const index = siblings.findIndex((node) => node.id === target.id);
							siblings.splice(position === "before" ? index : index + 1, 0, dragged);

							return next;
						})
				}}
			/>
		</StyledToolbar>
	);
}

/** A busy veil that fills the host overlay cell. Module-scope so the slot identity is stable across renders. */
const StyledBusyVeil = styled.div`
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	background: rgba(250, 250, 250, 0.72);
	font-size: 12px;
	pointer-events: auto;
`;

/** Overlay slot: a "loading children…" veil shown only over the `logs` folder while it refreshes. */
function BusyRowOverlay({ row }: DataTableSlotProps.RowOverlay<FileNode>): ReactElement | null {
	if (row.id !== "logs") {
		return null;
	}

	return (
		<StyledBusyVeil>
			<SpinningIcon aria-label="Loading">progress_activity</SpinningIcon>
			Loading children…
		</StyledBusyVeil>
	);
}

function RowOverlayDemo(): ReactElement {
	return (
		<DataTreeTable<FileNode>
			ariaLabel="Files (logs is busy)"
			tree={TREE.concat(folder("logs", "logs", "2026-06-12", [file("app-log", "app.log", "9 KB", "2026-06-12")]))}
			columns={COLUMNS}
			rowKey="id"
			maxHeight={360}
			defaultExpandedKeys={["src"]}
			slots={{ rowOverlay: BusyRowOverlay }}
		/>
	);
}

function AutoExpandDnDDemo(): ReactElement {
	const [forest, setForest] = useState<FileNode[]>(() => cloneForest(TREE));
	const [dragging, setDragging] = useState<string | null>(null);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			<span style={{ fontSize: 12, opacity: 0.7 }}>
				{dragging
					? `Dragging "${dragging}" — hover a collapsed folder to auto-expand it.`
					: "Drag a row over a collapsed folder."}
			</span>
			<DataTreeTable<FileNode>
				ariaLabel="Files (auto-expand on hover)"
				tree={forest}
				columns={COLUMNS}
				rowKey="id"
				maxHeight={360}
				dragDropOptions={{
					autoExpand: { delay: 600 },
					onDragStart: ({ row }) => setDragging(row.name),
					onDragEnd: () => setDragging(null),
					onDrop: ({ source, target, position }) => {
						setForest((current) => {
							const next = cloneForest(current);

							if (!detach(next, source.id)) {
								return current;
							}

							const dragged: FileNode = { ...source };

							if (position === "inside") {
								const into = find(next, target.id);

								if (into) {
									into.children = [...(into.children ?? []), dragged];
								}

								return next;
							}

							const siblings = findSiblings(next, target.id);

							if (!siblings) {
								return current;
							}

							const index = siblings.findIndex((node) => node.id === target.id);
							siblings.splice(position === "before" ? index : index + 1, 0, dragged);

							return next;
						});
					}
				}}
			/>
		</div>
	);
}

const meta: Meta<typeof BasicDemo> = {
	title: "Data Display/DataTreeTable",
	component: BasicDemo,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	name: "Basic",
	render: () => <BasicDemo />,
	parameters: {
		docs: {
			description: {
				story:
					'`DataTreeTable` flattens a nested `tree` into rows and decorates the first column with an indent + expand/collapse chevron. The consumer\'s own row type flows straight through — columns (`dataKey`/`renderCell`), `rowStyling` and `slots` all operate on `RowType`, no node envelope. Expansion is **uncontrolled** here, seeded with `defaultExpandedKeys`.\n\n**Accessibility:** renders as `role="treegrid"` with `aria-level` / `aria-setsize` / `aria-posinset` / `aria-expanded` on each row.'
			}
		}
	}
};

export const Controlled: Story = {
	name: "Controlled Expansion",
	render: () => <ControlledDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Drive expansion yourself with `expandedKeys` + `onExpandedChange` — useful for persistence, expand/collapse-all, or syncing with external state."
			}
		}
	}
};

export const LazyLoading: Story = {
	name: "Lazy Loading",
	render: () => <LazyDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"With `loadChildren`, a folder's children are fetched the first time it expands and held internally. `isLeaf` tells the wrapper which rows can never expand, so files show no chevron."
			}
		}
	}
};

export const ControlledPagination: Story = {
	name: "Controlled Pagination (Load More)",
	render: () => <ControlledPaginationDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Drive the built-in load-more row from your **own** store in flat-adjacency mode (`data` + `getParentId`) — no tree state surrendered to the widget. `getPagination(parentId)` returns `{ hasMore, loading?, total? }` for a parent's children, or for the **implicit root** when `parentId` is `undefined`; `onLoadMore` / `onLoadAll` append rows to your `data`, and the sentinel disappears once the snapshot reports `hasMore: false`. Here both the root list and the `logs` folder are paginated. The links read _Load more_ / _Load all N_ by default — override the text with `loadMoreLabel` / `loadAllLabel` (see _Localized Load More_). Mutually exclusive with `loadChildren`."
			}
		}
	}
};

export const LocalizedLoadMore: Story = {
	render: () => <ControlledPaginationDemo loadMoreLabel="Mehr laden" loadAllLabel="Alle laden" />,
	parameters: {
		docs: {
			description: {
				story:
					'The default load-more links read _Load more_ / _Load all N_ in English. Pass `loadMoreLabel` / `loadAllLabel` to translate or reword them — here the German `"Mehr laden"` / `"Alle laden"` (the total count is still appended, e.g. _Alle laden 7_). For full control over the affordance\'s markup, use `renderLoadMore` instead.'
			}
		}
	}
};

export const CustomToggle: Story = {
	name: "Custom Toggle",
	render: () => <CustomToggleDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Swap the built-in chevron for your own control with `renderExpandToggle`. It receives `{ row, expanded, isLeaf, level, loading, toggle }` — call `toggle()` to flip expansion (honouring controlled/uncontrolled state and lazy loading), and render your own loading affordance from `loading`."
			}
		}
	}
};

export const LeadingIcons: Story = {
	name: "Leading Icons",
	render: () => <LeadingIconsDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Add a per-row leading icon with `getIcon={(row) => …}`. It renders in the tree column between the chevron and the cell content — the common folder/file look without touching the column's `renderCell`. The icon is presentational (`aria-hidden`), so keep meaning in the label; return `undefined` for no icon. Restores the legacy `TreeTable`'s per-node `icon` and mirrors `TreeView`'s `getIcon`."
			}
		}
	}
};

export const ScrollToNode: Story = {
	name: "Scroll To Node",
	render: () => <ScrollToNodeDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Capture the handle from `scrollToNode={(handler) => …}` and call it with a `rowKey` (and optional `{ autoFocus }`) to scroll that row into view and focus it. A row hidden inside a collapsed ancestor is a no-op."
			}
		}
	}
};

export const DragAndDrop: Story = {
	name: "Drag & Drop (reparenting)",
	render: () => <DragAndDropDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Pass `dragDropOptions` to make rows draggable — powered by `@atlaskit/pragmatic-drag-and-drop` and its tree-item hitbox, no provider required. Drop near a row's **top/bottom edge** to reorder it (`before`/`after`), or over the **middle of a folder** to reparent it (`inside`). The self/descendant cycle guard is built in; `onDrop` reports `{ source, target, position }` and the consumer mutates their own tree."
			}
		}
	}
};

export const RowOverlay: Story = {
	name: "Row Overlay (busy veil)",
	render: () => <RowOverlayDemo />,
	parameters: {
		docs: {
			description: {
				story:
					'The optional `rowOverlay` slot paints a layer over a single body row — here a busy veil over the `logs` folder. The slot returns `null` for rows that need no overlay; it is opt-in, so tables without it pay no per-row cost. Rendered as an absolutely-positioned cell spanning the row (`data-role="table-row-overlay"`).'
			}
		}
	}
};

export const AutoExpandOnHover: Story = {
	name: "Drag & Drop (auto-expand on hover)",
	render: () => <AutoExpandDnDDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"`dragDropOptions.autoExpand` expands a collapsed folder when the drag dwells over it (~600 ms here), so a node can be dropped into a currently-collapsed subtree. `onDragStart` / `onDragEnd` drive the consumer's own drag-state label, and `onDragEnter({ source, target })` is available for hover highlighting."
			}
		}
	}
};

export const Everything: Story = {
	name: "All Features Enabled",
	render: () => <EverythingDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Many `DataTreeTable` features combined in one table: a leading **checkbox-selection column** (with a select-all/indeterminate header) that also pushes the tree column to the **second** position, nested `tree` data with a **lazy** folder (`logs`) whose children are fetched on first expand, **controlled expansion** (Expand/Collapse all), **sorting** (`sortOptions` re-sorts each sibling group), **column resizing** (`columnResizingOptions`), a **footer** (`renderFooter`), **grouped columns** (Size + Modified under _Details_), per-row **leading icons** (`getIcon`), a pinned **action column** (delete), **drag-and-drop reparenting** with a cycle/`inside`-on-file guard, **row selection** (`rowEventHandlers` + `rowStyling`), **cell styling**, and a programmatic **scroll-to-node**.\n\nNote: `virtualScrollOptions` is intentionally omitted — it is mutually exclusive with drag-and-drop, column resize and lazy children."
			}
		}
	}
};
