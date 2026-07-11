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
import { useState } from "react";
import type { Instruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";
import {
	fireEvent,
	findByText,
	getAllByDataRole,
	getByDataRole,
	getByText,
	queryByDataRole,
	queryByText,
	render
} from "test-utils";
import { userEvent } from "vitest/browser";
import { describe, expect, test, vi } from "vitest";

import { DataRoles } from "../../common/main/data-roles.js";
import type { FlatTreeRow } from "../../tree-view/main/model/index.js";
import { flattenTree, isSelfOrDescendant } from "../../tree-view/main/model/index.js";

import type { DataTableColumn } from "../main/columns.js";
import type { DataTableSlotProps } from "../main/data-table-slots.api.js";
import type { DataTableSortState } from "../main/data-table.sort.js";
import type { DataTreeTableProps, DataTreeTableScrollToNodeHandler } from "../main/data-tree-table/index.js";
import { DataTreeTable } from "../main/data-tree-table/index.js";
import {
	computeItemMode,
	indicatorFromInstruction,
	mapInstructionToDropResult
} from "../main/data-tree-table/data-tree-table.dnd.js";

interface Row {
	id: string;
	name: string;
	size: string;
	children?: Row[];
}

const TREE: Row[] = [
	{
		id: "a",
		name: "Folder A",
		size: "10 MB",
		children: [
			{ id: "a1", name: "File A1", size: "1 MB" },
			{ id: "a2", name: "File A2", size: "2 MB" }
		]
	},
	{ id: "b", name: "File B", size: "3 MB" }
];

const COLUMNS: DataTableColumn<Row>[] = [
	{ label: "Name", dataKey: "name" },
	{ label: "Size", dataKey: "size" }
];

function bodyRows(container: HTMLElement): HTMLElement[] {
	return getAllByDataRole(container, DataRoles.Table.Body.Row);
}

function expanderButtons(container: HTMLElement): HTMLButtonElement[] {
	return getAllByDataRole(container, DataRoles.Tree.Node.Expander)
		.map((wrapper) => wrapper.querySelector("button"))
		.filter((button): button is HTMLButtonElement => button !== null);
}

describe("com.mgmtp.a12.widgets.data-tree-table — rendering", () => {
	test("renders only the top-level rows when nothing is expanded", () => {
		const { container } = render(<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" ariaLabel="Files" />);

		expect(bodyRows(container).length).toBe(2);
		expect(container.textContent).toContain("Folder A");
		expect(container.textContent).toContain("File B");
		expect(container.textContent).not.toContain("File A1");
	});

	test("defaultExpandAll reveals every descendant", () => {
		const { container } = render(<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" defaultExpandAll />);

		// a + a1 + a2 + b
		expect(bodyRows(container).length).toBe(4);
		expect(container.textContent).toContain("File A1");
	});

	test("defaultExpandedKeys expands the named rows only", () => {
		const { container } = render(
			<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" defaultExpandedKeys={["a"]} />
		);

		expect(bodyRows(container).length).toBe(4);
	});

	test("only expandable rows render an expand/collapse control", () => {
		const { container } = render(<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" defaultExpandAll />);

		// Only "Folder A" has children.
		expect(expanderButtons(container).length).toBe(1);
	});

	test("indents deeper rows more than shallow ones", () => {
		const { container } = render(<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" defaultExpandAll />);

		const cells = getAllByDataRole(container, DataRoles.TreeTable.Cell);
		const folderPad = parseFloat(getComputedStyle(cells[0]).paddingLeft); // Folder A, level 0
		const childPad = parseFloat(getComputedStyle(cells[1]).paddingLeft); // File A1, level 1
		expect(childPad).toBeGreaterThan(folderPad);
	});

	test("a custom indentSize also sizes the expand/collapse toggle slot", () => {
		const { container } = render(
			<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" defaultExpandAll indentSize={48} />
		);

		const cell = getAllByDataRole(container, DataRoles.TreeTable.Cell)[0];
		const toggleSlot = cell.firstElementChild as HTMLElement; // StyledTreeToggle

		expect(parseFloat(getComputedStyle(toggleSlot).width)).toBe(48);
	});

	test("hosts the tree affordances on a tree column nested inside a column group", () => {
		const grouped: DataTableColumn<Row>[] = [
			{
				label: "Details",
				subColumns: [
					{ label: "Name", dataKey: "name" },
					{ label: "Size", dataKey: "size" }
				]
			}
		];
		const { container } = render(<DataTreeTable tree={TREE} columns={grouped} rowKey="id" defaultExpandAll />);

		// The first leaf (Name), even nested under the "Details" group, gets the indent + chevron.
		expect(getAllByDataRole(container, DataRoles.TreeTable.Cell).length).toBe(4);
		expect(expanderButtons(container).length).toBe(1);
		expect(bodyRows(container)[1].getAttribute("aria-level")).toBe("2");
	});

	test("renders a leading icon from getIcon in the tree column, before the label", () => {
		const { container } = render(
			<DataTreeTable
				tree={TREE}
				columns={COLUMNS}
				rowKey="id"
				defaultExpandAll
				getIcon={(row) => <span>{(row as Row).children ? "📁" : "📄"}</span>}
			/>
		);

		const icons = getAllByDataRole(container, DataRoles.TreeTable.Icon);
		// One icon per rendered row (Folder A + 2 children + File B).
		expect(icons.length).toBe(4);
		// Presentational only — the label still carries the meaning.
		expect(icons[0].getAttribute("aria-hidden")).toBe("true");
		expect(icons[0].textContent).toBe("📁");
		expect(icons[3].textContent).toBe("📄");

		// The icon sits between the toggle slot and the label within the tree cell.
		const cell = getAllByDataRole(container, DataRoles.TreeTable.Cell)[0];
		const [, iconSlot] = Array.from(cell.children);
		expect(iconSlot.getAttribute("data-role")).toBe(DataRoles.TreeTable.Icon);
	});

	test("renders no icon slot when getIcon returns nothing for a row", () => {
		const { container } = render(
			<DataTreeTable
				tree={TREE}
				columns={COLUMNS}
				rowKey="id"
				defaultExpandAll
				getIcon={(row) => ((row as Row).children ? <span>📁</span> : undefined)}
			/>
		);

		// Only the two folders (Folder A) render an icon; the three files render none.
		expect(getAllByDataRole(container, DataRoles.TreeTable.Icon).length).toBe(1);
	});

	test("renders the placeholder and no tree controls for an empty tree", () => {
		const { container } = render(<DataTreeTable<Row> tree={[]} columns={COLUMNS} rowKey="id" ariaLabel="Empty" />);

		expect(queryByDataRole(container, DataRoles.Tree.Node.Expander)).toBeNull();
		expect(getByDataRole(container, DataRoles.Table.Body.Content.Placeholder)).toBeDefined();
	});

	test("accepts a flat adjacency list via data + getParentId", () => {
		const flat: Row[] = [
			{ id: "a", name: "Folder A", size: "10 MB" },
			{ id: "a1", name: "File A1", size: "1 MB" },
			{ id: "b", name: "File B", size: "3 MB" }
		];
		const { container } = render(
			<DataTreeTable
				data={flat}
				getParentId={(row) => (row.id === "a1" ? "a" : undefined)}
				columns={COLUMNS}
				rowKey="id"
				defaultExpandAll
			/>
		);

		// a (top) + a1 (child) + b (top)
		expect(bodyRows(container).length).toBe(3);
		expect(expanderButtons(container).length).toBe(1); // only "a" has a child
	});
});

/** Stable (module-scope) overlay slot: a busy veil shown only over Folder A. Identity must not change per render. */
function FolderABusyOverlay({ row }: DataTableSlotProps.RowOverlay<Row>): ReactElement | null {
	return (row as Row).id === "a" ? <span>busy-a</span> : null;
}

describe("com.mgmtp.a12.widgets.data-tree-table — rowOverlay slot", () => {
	test("renders the overlay slot over the matching rows only", () => {
		const { container } = render(
			<DataTreeTable
				tree={TREE}
				columns={COLUMNS}
				rowKey="id"
				defaultExpandAll
				slots={{ rowOverlay: FolderABusyOverlay }}
				ariaLabel="Overlaid"
			/>
		);

		// The overlay host cell is an always-present (invisible) layer per row; only Folder A's slot
		// renders content into it, the others return null.
		const overlays = getAllByDataRole(container, DataRoles.Table.RowOverlay);
		expect(overlays.length).toBe(bodyRows(container).length);
		expect(overlays.filter((cell) => cell.textContent === "busy-a").length).toBe(1);
		expect(getByText(container, "busy-a")).toBeInTheDocument();
	});

	test("renders no overlay cell when the slot is absent", () => {
		const { container } = render(
			<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" defaultExpandAll ariaLabel="No overlay" />
		);

		expect(queryByDataRole(container, DataRoles.Table.RowOverlay)).toBeNull();
	});
});

describe("com.mgmtp.a12.widgets.data-tree-table — expansion", () => {
	test("uncontrolled: clicking the control expands and collapses the row", async () => {
		const { container } = render(<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" />);

		expect(bodyRows(container).length).toBe(2);

		await userEvent.click(expanderButtons(container)[0]);
		await vi.waitFor(() => expect(bodyRows(container).length).toBe(4));

		await userEvent.click(expanderButtons(container)[0]);
		await vi.waitFor(() => expect(bodyRows(container).length).toBe(2));
	});

	test("controlled: expansion is driven by expandedKeys + onExpandedChange", async () => {
		const onExpandedChange = vi.fn();

		function Controlled(): React.ReactElement {
			const [expanded, setExpanded] = useState<Set<Key>>(new Set());

			return (
				<DataTreeTable
					tree={TREE}
					columns={COLUMNS}
					rowKey="id"
					expandedKeys={expanded}
					onExpandedChange={(next, meta) => {
						onExpandedChange(meta);
						setExpanded(next);
					}}
				/>
			);
		}

		const { container } = render(<Controlled />);
		expect(bodyRows(container).length).toBe(2);

		await userEvent.click(expanderButtons(container)[0]);

		await vi.waitFor(() => expect(bodyRows(container).length).toBe(4));
		expect(onExpandedChange).toHaveBeenCalledWith({ key: "a", expanded: true, row: TREE[0] });
	});

	test("lazily loads children the first time a row is expanded", async () => {
		const loadChildren = vi.fn(
			(): Promise<Row[]> => Promise.resolve([{ id: "x1", name: "Loaded child", size: "1 KB" }])
		);
		const { container } = render(
			<DataTreeTable
				tree={[{ id: "x", name: "Lazy", size: "—" }]}
				columns={COLUMNS}
				rowKey="id"
				loadChildren={loadChildren}
				isLeaf={(row) => row.id !== "x"}
			/>
		);

		// "x" shows a chevron even though its children aren't loaded yet.
		expect(expanderButtons(container).length).toBe(1);

		await userEvent.click(expanderButtons(container)[0]);

		await vi.waitFor(() => expect(loadChildren).toHaveBeenCalledTimes(1));
		await vi.waitFor(() => expect(container.textContent).toContain("Loaded child"));
	});

	test("shows the default toggle's loading indicator while children load", async () => {
		let resolveChildren!: (rows: Row[]) => void;
		const loadChildren = vi.fn(
			(): Promise<Row[]> =>
				new Promise((resolve) => {
					resolveChildren = resolve;
				})
		);
		const { container } = render(
			<DataTreeTable
				tree={[{ id: "x", name: "Lazy", size: "—" }]}
				columns={COLUMNS}
				rowKey="id"
				loadChildren={loadChildren}
				isLeaf={(row) => row.id !== "x"}
			/>
		);

		await userEvent.click(expanderButtons(container)[0]);

		// While loading: the chevron's button shows the progress indicator and is non-interactive.
		await vi.waitFor(() =>
			expect(container.querySelector(`[data-role="${DataRoles.ProgressIndicator.CircleSpinner}"]`)).not.toBeNull()
		);
		expect(expanderButtons(container)[0]).toBeDisabled();

		resolveChildren([{ id: "x1", name: "Loaded child", size: "1 KB" }]);

		await vi.waitFor(() => expect(container.textContent).toContain("Loaded child"));
		expect(container.querySelector(`[data-role="${DataRoles.ProgressIndicator.CircleSpinner}"]`)).toBeNull();
	});
});

describe("com.mgmtp.a12.widgets.data-tree-table — controlled pagination (load more)", () => {
	interface FRow {
		id: string;
		parentId?: string;
		name: string;
		size: string;
	}

	const FCOLUMNS: DataTableColumn<FRow>[] = [
		{ label: "Name", dataKey: "name" },
		{ label: "Size", dataKey: "size" }
	];

	const PARENT: FRow = { id: "a", name: "Folder A", size: "—" };
	const CHILDREN: FRow[] = [
		{ id: "a1", parentId: "a", name: "child-1", size: "1 KB" },
		{ id: "a2", parentId: "a", name: "child-2", size: "2 KB" }
	];

	/**
	 * Controlled host mirroring a store-owned tree: it holds the flat `data` snapshot and a per-parent
	 * "loaded" count. `getPagination` reports `hasMore` while a parent still has unloaded children;
	 * `onLoadMore` appends one more child, `onLoadAll` appends them all — the same convergence (snapshot
	 * grows → `hasMore` flips false → sentinel disappears) the widget relies on.
	 */
	function ControlledHost(props: {
		loading?: boolean;
		withLoadAll?: boolean;
		onLoadMoreSpy?: (parentId: Key | undefined) => void;
		onLoadAllSpy?: (parentId: Key | undefined) => void;
		renderLoadMore?: DataTreeTableProps<FRow>["renderLoadMore"];
		loadMoreLabel?: string;
		loadAllLabel?: string;
	}): ReactElement {
		const [loaded, setLoaded] = useState(1); // first page already present

		const data = [PARENT, ...CHILDREN.slice(0, loaded)];

		return (
			<DataTreeTable<FRow>
				ariaLabel="Controlled"
				data={data}
				getParentId={(row) => row.parentId}
				rowKey="id"
				columns={FCOLUMNS}
				expandedKeys={new Set(["a"])}
				isLeaf={(row) => row.id !== "a"}
				getPagination={(parentId) =>
					parentId === "a" && loaded < CHILDREN.length
						? { hasMore: true, loading: props.loading, total: CHILDREN.length }
						: undefined
				}
				onLoadMore={({ parentId }) => {
					props.onLoadMoreSpy?.(parentId);
					setLoaded((n) => Math.min(n + 1, CHILDREN.length));
				}}
				onLoadAll={
					props.withLoadAll
						? ({ parentId }) => {
								props.onLoadAllSpy?.(parentId);
								setLoaded(CHILDREN.length);
							}
						: undefined
				}
				renderLoadMore={props.renderLoadMore}
				loadMoreLabel={props.loadMoreLabel}
				loadAllLabel={props.loadAllLabel}
			/>
		);
	}

	test("renders a spanning load-more row after a controlled parent that reports hasMore", () => {
		const { container } = render(<ControlledHost />);

		expect(getByText(container, "child-1")).toBeInTheDocument();
		const loadMoreRow = getByDataRole(container, DataRoles.TreeTable.LoadMore);
		// The spanning cell covers every leaf column.
		expect(loadMoreRow.querySelector("td")).toHaveAttribute("colspan", String(FCOLUMNS.length));
		// Default affordance shows both links, the "load all" labelled with the reported total.
		expect(getByText(loadMoreRow, "Load more")).toBeInTheDocument();
		expect(getByText(loadMoreRow, "Load all 2")).toBeInTheDocument();
	});

	test("clicking 'Load more' invokes onLoadMore with the parentId and converges when the data grows", async () => {
		const onLoadMoreSpy = vi.fn();
		const { container } = render(<ControlledHost onLoadMoreSpy={onLoadMoreSpy} />);

		await userEvent.click(getByText(getByDataRole(container, DataRoles.TreeTable.LoadMore), "Load more"));

		expect(onLoadMoreSpy).toHaveBeenCalledWith("a");
		// The host appended the last child, so `getPagination` now reports fully-loaded ⇒ the sentinel is gone.
		expect(await findByText(container, "child-2")).toBeInTheDocument();
		expect(queryByDataRole(container, DataRoles.TreeTable.LoadMore)).toBeNull();
	});

	test("'Load all' invokes onLoadAll with the parentId and removes the sentinel", async () => {
		const onLoadAllSpy = vi.fn();
		const { container } = render(<ControlledHost withLoadAll onLoadAllSpy={onLoadAllSpy} />);

		await userEvent.click(getByText(getByDataRole(container, DataRoles.TreeTable.LoadMore), "Load all 2"));

		expect(onLoadAllSpy).toHaveBeenCalledWith("a");
		expect(await findByText(container, "child-2")).toBeInTheDocument();
		expect(queryByDataRole(container, DataRoles.TreeTable.LoadMore)).toBeNull();
	});

	test("'Load all' falls back to onLoadMore when onLoadAll is omitted", async () => {
		const onLoadMoreSpy = vi.fn();
		const { container } = render(<ControlledHost onLoadMoreSpy={onLoadMoreSpy} />);

		await userEvent.click(getByText(getByDataRole(container, DataRoles.TreeTable.LoadMore), "Load all 2"));

		expect(onLoadMoreSpy).toHaveBeenCalledWith("a");
	});

	test("loading: true shows the busy indicator and hides the links", () => {
		const { container } = render(<ControlledHost loading />);

		const loadMoreRow = getByDataRole(container, DataRoles.TreeTable.LoadMore);
		expect(loadMoreRow.querySelector(`[data-role="${DataRoles.ProgressIndicator.OuterOverlay}"]`)).not.toBeNull();
		expect(queryByText(loadMoreRow, "Load more")).toBeNull();
	});

	test("loadMoreLabel / loadAllLabel override the default link text (total still appended)", () => {
		const { container } = render(<ControlledHost loadMoreLabel="Mehr laden" loadAllLabel="Alle laden" />);

		const loadMoreRow = getByDataRole(container, DataRoles.TreeTable.LoadMore);
		expect(getByText(loadMoreRow, "Mehr laden")).toBeInTheDocument();
		expect(getByText(loadMoreRow, "Alle laden 2")).toBeInTheDocument();
		expect(queryByText(loadMoreRow, "Load more")).toBeNull();
	});

	test("renderLoadMore overrides the default affordance", () => {
		const { container } = render(<ControlledHost renderLoadMore={({ total }) => <span>custom-more ({total})</span>} />);

		expect(getByText(container, "custom-more (2)")).toBeInTheDocument();
		expect(queryByText(container, "Load more")).toBeNull();
	});

	test("never forwards the load-more sentinel row to rowEventHandlers", () => {
		const rowEventHandlers = vi.fn(() => ({}));
		const { container } = render(
			<DataTreeTable<FRow>
				ariaLabel="Guarded handlers"
				data={[PARENT, CHILDREN[0]]}
				getParentId={(row) => row.parentId}
				rowKey="id"
				columns={FCOLUMNS}
				expandedKeys={new Set(["a"])}
				isLeaf={(row) => row.id !== "a"}
				getPagination={(parentId) => (parentId === "a" ? { hasMore: true, total: CHILDREN.length } : undefined)}
				onLoadMore={() => undefined}
				rowEventHandlers={rowEventHandlers}
			/>
		);

		// A sentinel row is rendered…
		expect(getByDataRole(container, DataRoles.TreeTable.LoadMore)).toBeDefined();
		// …yet the consumer's getter only ever saw real rows (each carrying an `id`), never the fieldless
		// sentinel — symmetric with the rowStyling / cellStyling / dataGetter / renderCell / cellSpan guards.
		expect(rowEventHandlers).toHaveBeenCalled();

		for (const [params] of rowEventHandlers.mock.calls) {
			expect((params.row as FRow).id).toBeDefined();
		}
	});

	test("root-level pagination renders a sentinel and reports parentId undefined", async () => {
		const onLoadMoreSpy = vi.fn();

		function RootHost(): ReactElement {
			const ROOTS: FRow[] = [
				{ id: "r1", name: "root-1", size: "1 KB" },
				{ id: "r2", name: "root-2", size: "2 KB" }
			];
			const [loaded, setLoaded] = useState(1);

			return (
				<DataTreeTable<FRow>
					ariaLabel="Root paginated"
					data={ROOTS.slice(0, loaded)}
					getParentId={(row) => row.parentId}
					rowKey="id"
					columns={FCOLUMNS}
					isLeaf={() => true}
					getPagination={(parentId) =>
						parentId === undefined && loaded < ROOTS.length ? { hasMore: true, total: ROOTS.length } : undefined
					}
					onLoadMore={({ parentId }) => {
						onLoadMoreSpy(parentId);
						setLoaded((n) => n + 1);
					}}
				/>
			);
		}

		const { container } = render(<RootHost />);

		const loadMoreRow = getByDataRole(container, DataRoles.TreeTable.LoadMore);
		// A root sentinel sits at level 0 (aria-level 1).
		expect(loadMoreRow.getAttribute("aria-level")).toBe("1");

		await userEvent.click(getByText(loadMoreRow, "Load more"));

		expect(onLoadMoreSpy).toHaveBeenCalledWith(undefined);
		expect(await findByText(container, "root-2")).toBeInTheDocument();
		expect(queryByDataRole(container, DataRoles.TreeTable.LoadMore)).toBeNull();
	});

	test("warns in dev when both loadChildren and getPagination are set", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

		render(
			<DataTreeTable<FRow>
				ariaLabel="Conflicting"
				data={[PARENT]}
				getParentId={(row) => row.parentId}
				rowKey="id"
				columns={FCOLUMNS}
				loadChildren={() => Promise.resolve([])}
				getPagination={() => undefined}
			/>
		);

		expect(warn).toHaveBeenCalledWith(expect.stringContaining("mutually exclusive"));
		warn.mockRestore();
	});
});

describe("com.mgmtp.a12.widgets.data-tree-table — accessibility", () => {
	test("renders role=treegrid with grid semantics on its structure", () => {
		const { container } = render(<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" ariaLabel="Files" />);

		expect(getByDataRole(container, DataRoles.Table).getAttribute("role")).toBe("treegrid");
		expect(bodyRows(container).every((row) => row.getAttribute("role") === "row")).toBe(true);
	});

	test("exposes aria-level / aria-setsize / aria-posinset and aria-expanded", () => {
		const { container } = render(<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" defaultExpandAll />);

		// Order: a(l0), a1(l1), a2(l1), b(l0).
		const rows = bodyRows(container);

		expect(rows[0].getAttribute("aria-level")).toBe("1");
		expect(rows[0].getAttribute("aria-expanded")).toBe("true"); // Folder A, expanded
		expect(rows[0].getAttribute("aria-setsize")).toBe("2"); // a + b
		expect(rows[0].getAttribute("aria-posinset")).toBe("1");

		expect(rows[1].getAttribute("aria-level")).toBe("2"); // File A1
		expect(rows[1].getAttribute("aria-setsize")).toBe("2"); // a1 + a2
		expect(rows[1].getAttribute("aria-posinset")).toBe("1");
		expect(rows[1].hasAttribute("aria-expanded")).toBe(false); // leaf
	});

	test("scrollToNode by row key focuses the matching row", async () => {
		let handler: DataTreeTableScrollToNodeHandler | undefined;
		const { container } = render(
			<DataTreeTable
				tree={TREE}
				columns={COLUMNS}
				rowKey="id"
				defaultExpandAll
				ariaLabel="Files"
				scrollToNode={(h) => {
					handler = h;
				}}
			/>
		);

		expect(typeof handler).toBe("function");

		const rows = bodyRows(container); // a(0), a1(1), a2(2), b(3)
		handler?.("a2", { autoFocus: true });

		await vi.waitFor(() => {
			expect(rows[2].contains(document.activeElement) || document.activeElement === rows[2]).toBe(true);
		});
	});
});

describe("com.mgmtp.a12.widgets.data-tree-table — drag and drop", () => {
	function flat(expanded: string[] = ["a"]): {
		rows: FlatTreeRow<Row>[];
		metaByKey: Map<Key, FlatTreeRow<Row>>;
	} {
		const result = flattenTree<Row>({
			roots: TREE,
			childrenOf: (row) => row.children,
			isExpandable: (row) => !!row.children?.length,
			rowKeyOf: (row) => row.id,
			expandedKeys: new Set(expanded),
			loadingKeys: new Set(),
			hasMoreKeys: new Set(),
			loadingMoreKeys: new Set(),
			totalByKey: new Map()
		});

		return { rows: result.rows, metaByKey: result.metaByKey };
	}

	describe("position mapping (pure)", () => {
		test("reorder/make-child map to before / after / inside", () => {
			const { rows } = flat(); // a(0), a1(1), a2(2), b(3)
			const above: Instruction = { type: "reorder-above", currentLevel: 1, indentPerLevel: 16 };
			const below: Instruction = { type: "reorder-below", currentLevel: 1, indentPerLevel: 16 };
			const child: Instruction = { type: "make-child", currentLevel: 1, indentPerLevel: 16 };

			expect(mapInstructionToDropResult(above, 1, rows)?.position).toBe("before");
			expect(mapInstructionToDropResult(below, 1, rows)?.position).toBe("after");
			expect(mapInstructionToDropResult(child, 1, rows)?.position).toBe("inside");
		});

		test("reparent outdent resolves the ancestor at the desired level", () => {
			const { rows } = flat();
			// Drop below a1 (level 1) with desiredLevel 0 → becomes a sibling after Folder A (level 0).
			const reparent: Instruction = { type: "reparent", currentLevel: 1, indentPerLevel: 16, desiredLevel: 0 };
			const result = mapInstructionToDropResult(reparent, 1, rows);

			expect(result?.position).toBe("after");
			expect(result?.target.row).toBe(TREE[0]);
			expect(result?.targetIndex).toBe(0);
		});

		test("null / blocked instructions resolve to no drop", () => {
			const { rows } = flat();
			const blocked: Instruction = {
				type: "instruction-blocked",
				desired: { type: "make-child", currentLevel: 1, indentPerLevel: 16 }
			};

			expect(mapInstructionToDropResult(null, 1, rows)).toBeNull();
			expect(mapInstructionToDropResult(blocked, 1, rows)).toBeNull();
		});
	});

	describe("hitbox item mode", () => {
		test("derives expanded / standard / last-in-group from the flattened rows", () => {
			const { rows } = flat();

			expect(computeItemMode(rows, 0)).toBe("expanded"); // Folder A shows children
			expect(computeItemMode(rows, 1)).toBe("standard"); // a1 has following sibling a2
			expect(computeItemMode(rows, 2)).toBe("last-in-group"); // a2 is the last child of a
			expect(computeItemMode(rows, 3)).toBe("last-in-group"); // b is the last row
		});
	});

	describe("indicator placement", () => {
		test("maps instruction to indicator type + indent level", () => {
			expect(indicatorFromInstruction({ type: "reorder-above", currentLevel: 1, indentPerLevel: 16 }, false)).toEqual({
				type: "reorder-top",
				level: 1,
				forbidden: false
			});
			expect(indicatorFromInstruction({ type: "make-child", currentLevel: 1, indentPerLevel: 16 }, false)).toEqual({
				type: "child",
				level: 1,
				forbidden: false
			});
			expect(
				indicatorFromInstruction({ type: "reparent", currentLevel: 1, indentPerLevel: 16, desiredLevel: 0 }, true)
			).toEqual({ type: "reorder-bottom", level: 0, forbidden: true });
			expect(indicatorFromInstruction(null, false)).toBeNull();
		});
	});

	describe("cycle guard (isSelfOrDescendant)", () => {
		test("a row is its own and its descendants' ancestor, but not its siblings'", () => {
			const { metaByKey } = flat();

			expect(isSelfOrDescendant("a", "a", metaByKey)).toBe(true);
			expect(isSelfOrDescendant("a1", "a", metaByKey)).toBe(true); // a1 inside a's subtree
			expect(isSelfOrDescendant("a", "a1", metaByKey)).toBe(false); // a not inside a1's subtree
			expect(isSelfOrDescendant("b", "a", metaByKey)).toBe(false); // b is a sibling
		});
	});

	describe("integration", () => {
		function startDrag(source: HTMLElement): DataTransfer {
			const dataTransfer = new DataTransfer();
			fireEvent.dragStart(source, { dataTransfer });

			return dataTransfer;
		}

		function nextFrame(): Promise<void> {
			return new Promise((resolve) => requestAnimationFrame(() => resolve()));
		}

		async function dragOnto(source: HTMLElement, target: HTMLElement, fraction: number): Promise<void> {
			const dataTransfer = startDrag(source);
			await nextFrame();

			const rect = target.getBoundingClientRect();
			const clientX = rect.left + rect.width * 0.7;
			const clientY = rect.top + rect.height * fraction;

			fireEvent.dragEnter(target, { dataTransfer, clientX, clientY });
			fireEvent.dragOver(target, { dataTransfer, clientX, clientY });
			fireEvent.drop(target, { dataTransfer, clientX, clientY });
			fireEvent.dragEnd(source, { dataTransfer });
		}

		test("rows are draggable only when dragDropOptions is provided", () => {
			const withDnd = render(
				<DataTreeTable
					tree={TREE}
					columns={COLUMNS}
					rowKey="id"
					defaultExpandAll
					dragDropOptions={{}}
					ariaLabel="DnD"
				/>
			);

			for (const row of bodyRows(withDnd.container)) {
				expect(row.getAttribute("draggable")).toBe("true");
			}

			const withoutDnd = render(
				<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" defaultExpandAll ariaLabel="No DnD" />
			);

			for (const row of bodyRows(withoutDnd.container)) {
				expect(row.getAttribute("draggable")).not.toBe("true");
			}
		});

		test("renders a drop indicator above and below every row", () => {
			const { container } = render(
				<DataTreeTable
					tree={TREE}
					columns={COLUMNS}
					rowKey="id"
					defaultExpandAll
					dragDropOptions={{}}
					ariaLabel="DnD"
				/>
			);

			const rowCount = bodyRows(container).length;
			expect(getAllByDataRole(container, DataRoles.TreeTable.Dnd.Target).length).toBe(rowCount * 2);
		});

		test("dropping near the top edge of a row reports position 'before'", async () => {
			const onDrop = vi.fn();
			const { container } = render(
				<DataTreeTable
					tree={TREE}
					columns={COLUMNS}
					rowKey="id"
					defaultExpandAll
					dragDropOptions={{ onDrop, canDrop: () => true }}
					ariaLabel="DnD"
				/>
			);

			const rows = bodyRows(container); // a(0), a1(1), a2(2), b(3)
			await dragOnto(rows[3], rows[1], 0.05);

			await vi.waitFor(() => expect(onDrop).toHaveBeenCalledTimes(1));
			expect(onDrop.mock.calls[0][0].position).toBe("before");
			expect(onDrop.mock.calls[0][0].source).toBe(TREE[1]); // File B
		});

		test("dropping near the bottom edge of a row reports position 'after'", async () => {
			const onDrop = vi.fn();
			const { container } = render(
				<DataTreeTable
					tree={TREE}
					columns={COLUMNS}
					rowKey="id"
					defaultExpandAll
					dragDropOptions={{ onDrop, canDrop: () => true }}
					ariaLabel="DnD"
				/>
			);

			const rows = bodyRows(container);
			await dragOnto(rows[3], rows[1], 0.95);

			await vi.waitFor(() => expect(onDrop).toHaveBeenCalledTimes(1));
			expect(onDrop.mock.calls[0][0].position).toBe("after");
		});

		test("canDrop:false blocks the drop", async () => {
			const onDrop = vi.fn();
			const { container } = render(
				<DataTreeTable
					tree={TREE}
					columns={COLUMNS}
					rowKey="id"
					defaultExpandAll
					dragDropOptions={{ onDrop, canDrop: () => false }}
					ariaLabel="DnD"
				/>
			);

			const rows = bodyRows(container);
			await dragOnto(rows[3], rows[1], 0.05);
			await nextFrame();

			expect(onDrop).not.toHaveBeenCalled();
		});

		test("dragging onto the middle of a folder washes the target row ('inside')", async () => {
			const { container } = render(
				<DataTreeTable
					tree={TREE}
					columns={COLUMNS}
					rowKey="id"
					defaultExpandAll
					dragDropOptions={{ canDrop: () => true }}
					ariaLabel="DnD"
				/>
			);

			const rows = bodyRows(container);
			const dataTransfer = startDrag(rows[3]); // File B
			await nextFrame();

			const rect = rows[0].getBoundingClientRect(); // Folder A
			const clientX = rect.left + rect.width * 0.7;
			const clientY = rect.top + rect.height * 0.5;
			fireEvent.dragEnter(rows[0], { dataTransfer, clientX, clientY });
			fireEvent.dragOver(rows[0], { dataTransfer, clientX, clientY });

			await vi.waitFor(() => expect(rows[0].getAttribute("data-drop-target")).toBe("droppable"));

			fireEvent.dragEnd(rows[3], { dataTransfer });
			await vi.waitFor(() => expect(rows[0].getAttribute("data-drop-target")).toBeNull());
		});

		test("fires onDragStart at drag start and onDragEnd at drag end", async () => {
			const onDragStart = vi.fn();
			const onDragEnd = vi.fn();
			const { container } = render(
				<DataTreeTable
					tree={TREE}
					columns={COLUMNS}
					rowKey="id"
					defaultExpandAll
					dragDropOptions={{ onDragStart, onDragEnd }}
					ariaLabel="DnD lifecycle"
				/>
			);

			const rows = bodyRows(container); // a, a1, a2, b
			const dataTransfer = startDrag(rows[3]); // File B
			await nextFrame();

			await vi.waitFor(() => expect(onDragStart).toHaveBeenCalledTimes(1));
			expect(onDragStart.mock.calls[0][0].row).toBe(TREE[1]); // File B

			fireEvent.dragEnd(rows[3], { dataTransfer });
			await vi.waitFor(() => expect(onDragEnd).toHaveBeenCalledTimes(1));
			expect(onDragEnd.mock.calls[0][0].row).toBe(TREE[1]);
		});

		test("fires onDragEnter with the dragged source and the hovered target", async () => {
			const onDragEnter = vi.fn();
			const { container } = render(
				<DataTreeTable
					tree={TREE}
					columns={COLUMNS}
					rowKey="id"
					defaultExpandAll
					dragDropOptions={{ onDragEnter, canDrop: () => true }}
					ariaLabel="DnD hover"
				/>
			);

			const rows = bodyRows(container); // a(0), a1(1), a2(2), b(3)
			const dataTransfer = startDrag(rows[3]); // File B
			await nextFrame();

			const rect = rows[0].getBoundingClientRect();
			fireEvent.dragEnter(rows[0], {
				dataTransfer,
				clientX: rect.left + rect.width * 0.7,
				clientY: rect.top + rect.height * 0.5
			});

			await vi.waitFor(() => expect(onDragEnter).toHaveBeenCalled());
			expect(onDragEnter.mock.calls[0][0].source).toBe(TREE[1]); // File B
			expect(onDragEnter.mock.calls[0][0].target).toBe(TREE[0]); // Folder A

			fireEvent.dragEnd(rows[3], { dataTransfer });
		});

		test("autoExpand expands a collapsed folder hovered during a drag", async () => {
			const { container } = render(
				<DataTreeTable
					tree={TREE}
					columns={COLUMNS}
					rowKey="id"
					dragDropOptions={{ autoExpand: { delay: 10 }, canDrop: () => true }}
					ariaLabel="DnD auto-expand"
				/>
			);

			// Collapsed: only the two top-level rows (Folder A + File B) are visible, no child rendered.
			const rows = bodyRows(container); // a(0), b(1)
			expect(rows.length).toBe(2);
			expect(queryByText(container, "File A1")).toBeNull();

			const dataTransfer = startDrag(rows[1]); // drag File B
			await nextFrame();

			const rect = rows[0].getBoundingClientRect(); // hover Folder A (collapsed, expandable)
			fireEvent.dragEnter(rows[0], {
				dataTransfer,
				clientX: rect.left + rect.width * 0.7,
				clientY: rect.top + rect.height * 0.5
			});

			// After the dwell delay, Folder A auto-expands and its children become visible.
			await vi.waitFor(() => expect(queryByText(container, "File A1")).not.toBeNull());

			fireEvent.dragEnd(rows[1], { dataTransfer });
		});
	});

	// Regression: DataTreeTable re-clones columns every render to inject the tree affordances, which
	// used to break the identity-based sort match. Id-keyed sort state must survive the cloning.
	describe("com.mgmtp.a12.widgets.data-tree-table — sorting", () => {
		const SORTABLE_COLUMNS: DataTableColumn<Row>[] = [
			{ label: "Name", dataKey: "name", sortable: true },
			{ label: "Size", dataKey: "size", sortable: true }
		];

		// The sorted header appends a sort-arrow icon (its ligature text), so match by label prefix.
		function headCell(container: HTMLElement, text: string): HTMLElement {
			const cell = getAllByDataRole(container, DataRoles.Table.Header.Cell).find((c) =>
				c.textContent?.startsWith(text)
			);
			expect(cell).toBeDefined();

			return cell!;
		}

		test("aria-sort reflects id-keyed sort state through the cloned columns", () => {
			const { container } = render(
				<DataTreeTable
					tree={TREE}
					columns={SORTABLE_COLUMNS}
					rowKey="id"
					sortOptions={{ sortState: [{ columnId: "name", order: "asc" }], onSort: vi.fn() }}
				/>
			);

			expect(headCell(container, "Name").getAttribute("aria-sort")).toBe("ascending");
			expect(headCell(container, "Size").getAttribute("aria-sort")).toBe("none");
		});

		test("clicking a header reports the column id and toggles the cycle", async () => {
			function Controlled(): ReactElement {
				const [sortState, setSortState] = useState<DataTableSortState>([]);

				return (
					<DataTreeTable
						tree={TREE}
						columns={SORTABLE_COLUMNS}
						rowKey="id"
						sortOptions={{ sortState, onSort: (next) => setSortState(next) }}
					/>
				);
			}

			const { container } = render(<Controlled />);

			await userEvent.click(headCell(container, "Name"));
			expect(headCell(container, "Name").getAttribute("aria-sort")).toBe("ascending");

			await userEvent.click(headCell(container, "Name"));
			expect(headCell(container, "Name").getAttribute("aria-sort")).toBe("descending");

			await userEvent.click(headCell(container, "Name"));
			expect(headCell(container, "Name").getAttribute("aria-sort")).toBe("none");
		});
	});
});
