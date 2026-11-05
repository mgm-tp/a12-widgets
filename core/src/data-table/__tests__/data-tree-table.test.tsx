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

import type { Key, KeyboardEvent as ReactKeyboardEvent, ReactElement } from "react";
import { Profiler, useMemo, useState } from "react";
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
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import type { Instruction } from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop-hitbox/tree-item";

import { DataRoles } from "../../common/main/data-roles.js";
import { KeyboardNavigationConfigProvider } from "../../keyboard-navigation/main/keyboard-navigation-context.js";
import type { FlatTreeRow } from "../../tree-view/main/model/index.js";
import { flattenTree, isSelfOrDescendant } from "../../tree-view/main/model/index.js";
import type { DataTableColumn } from "../main/columns.js";
import type { DataTableSlotProps } from "../main/data-table-slots.api.js";
import type { DataTableSortState } from "../main/data-table.sort.js";
import {
	computeItemMode,
	indicatorFromInstruction,
	isSameIndicator,
	mapInstructionToDropResult,
	resolveTreeKeyboardMove
} from "../main/data-tree-table/data-tree-table.dnd.js";
import type {
	DataTreeTableProps,
	DataTreeTableRowMeta,
	DataTreeTableScrollToNodeHandler
} from "../main/data-tree-table/index.js";
import { DataTreeTable } from "../main/data-tree-table/index.js";

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

		// The icon sits between the toggle slot and the label, inside the node title.
		const title = getAllByDataRole(container, DataRoles.Tree.Node.Title)[0];
		const [iconSlot, label] = Array.from(title.children);
		expect(iconSlot.getAttribute("data-role")).toBe(DataRoles.TreeTable.Icon);
		expect(label.getAttribute("data-role")).toBe(DataRoles.Tree.Node.Name);
	});

	test("anchors the node title and name with the ids a control can point aria-labelledby at", () => {
		const { container } = render(<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" defaultExpandAll />);

		const title = getAllByDataRole(container, DataRoles.Tree.Node.Title)[0];
		const name = getAllByDataRole(container, DataRoles.Tree.Node.Name)[0];

		expect(title.id).toBe("tree-node-title-a");
		expect(name.id).toBe("tree-node-name-a");
		expect(title.contains(name)).toBe(true);
		expect(name.textContent).toBe("Folder A");

		// The chevron stays outside the title, so naming a control after the title cannot fold the
		// expand/collapse control's own name into the result.
		const [expander] = expanderButtons(container);
		expect(title.contains(expander)).toBe(false);
	});

	test("names the expand/collapse control after its node, the way the legacy TreeTable does", () => {
		const { container } = render(<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" defaultExpandAll />);

		const [expander] = expanderButtons(container);
		const name = getAllByDataRole(container, DataRoles.Tree.Node.Name)[0];

		// `aria-labelledby` overrides the localized "Expand subitems" title, so the control announces the node
		// rather than a string every chevron in the table shares.
		expect(expander.getAttribute("aria-labelledby")).toBe("tree-node-name-a");
		expect(name.id).toBe("tree-node-name-a");
		expect(name.textContent).toBe("Folder A");

		// The wrapper carries the arrow id, matching the legacy `tree-node-arrow-{id}`.
		expect(getAllByDataRole(container, DataRoles.Tree.Node.Expander)[0].id).toBe("tree-node-arrow-a");

		// The tree cell reuses the legacy `Tree` node roles and id shapes, so a consumer's selectors and any
		// `aria-labelledby` written against `TreeTable` keep working after the migration.
		expect(getAllByDataRole(container, DataRoles.Tree.Node.Title)[0].id).toBe("tree-node-title-a");

		// The action stays available as state, not as part of the name.
		expect(expander.getAttribute("aria-expanded")).toBe("true");
	});

	test("a consumer-supplied expand toggle is left to name itself", () => {
		const { container } = render(
			<DataTreeTable
				tree={TREE}
				columns={COLUMNS}
				rowKey="id"
				defaultExpandAll
				renderExpandToggle={({ toggle }) => (
					<button type="button" aria-label="My toggle" onClick={toggle}>
						x
					</button>
				)}
			/>
		);

		expect(queryByDataRole(container, DataRoles.Tree.Node.Expander)).toBeNull();
		expect(container.querySelector('[aria-label="My toggle"]')?.getAttribute("aria-labelledby")).toBeNull();
	});

	test("the node title of a child row also covers the hidden parent text, the node name does not", () => {
		const { container } = render(<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" defaultExpandAll />);

		// Row 1 is "File A1", a child of "Folder A".
		const title = getAllByDataRole(container, DataRoles.Tree.Node.Title)[1];
		const name = getAllByDataRole(container, DataRoles.Tree.Node.Name)[1];

		expect(name.textContent).toBe("File A1");
		expect(title.textContent).toContain("File A1");
		expect(title.textContent).toContain("Folder A");
		expect(title.contains(getAllByDataRole(container, DataRoles.TreeTable.ParentLabel)[0])).toBe(true);
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

describe("com.mgmtp.a12.widgets.data-tree-table — render cost of consumer-derived row state", () => {
	test("changing the selected node re-renders only the rows whose selection changed", async () => {
		// Expanded, so two of the four rows are bystanders to the selection move below —
		// with only the two top-level rows every row would change and the assertion could
		// not tell precision from a whole-table re-render.
		const renders: Record<string, number> = { a: 0, a1: 0, a2: 0, b: 0 };

		function CellProbe({ row, defaultContent }: DataTableSlotProps.CellContent<Row>): ReactElement {
			// Sentinel placeholders have no `id`; only the real rows are counted.
			if (row.id in renders) {
				renders[row.id]++;
			}

			return <>{defaultContent}</>;
		}

		function SelectableTree(): ReactElement {
			const [selectedId, setSelectedId] = useState("a");
			const slots = useMemo(() => ({ cellContent: CellProbe }), []);

			return (
				<DataTreeTable
					tree={TREE}
					columns={COLUMNS}
					rowKey="id"
					ariaLabel="Files"
					defaultExpandAll
					rowStyling={({ row }) => ({ selected: row.id === selectedId })}
					rowEventHandlers={({ row }) => ({ onClick: () => setSelectedId(row.id) })}
					slots={slots}
				/>
			);
		}

		const { container } = render(<SelectableTree />);
		const rows = bodyRows(container);

		// Mount counts are one full render per row — the tree column renders through the
		// wrapper's own cell renderer rather than the `cellContent` slot, so this is
		// calibrated rather than assumed to be `COLUMNS.length`.
		const perRow = renders.a;

		expect(perRow).toBeGreaterThan(0);
		expect(rows[0].getAttribute("aria-selected")).toBe("true");

		for (const id of Object.keys(renders)) {
			renders[id] = 0;
		}

		await userEvent.click(rows[3]);

		expect(rows[0].getAttribute("aria-selected")).toBeNull();
		expect(rows[3].getAttribute("aria-selected")).toBe("true");

		// The wrapper re-wraps `rowStyling` in its own memoized getter before handing it to
		// the inner DataTable; that indirection must not flatten the per-row precision back
		// into a whole-table re-render. Only "a" (deselected) and "b" (selected) may pay.
		expect(renders).toEqual({ a: perRow, a1: 0, a2: 0, b: perRow });
	});
});

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

interface PagedRow {
	id: string;
	parentId?: string;
	name: string;
}

/**
 * Minimal paginated host: parent "a" has two children but only reports the first until
 * `onLoadMore` fires, so the tree emits a `"load-more"` row in between.
 */
function PagedHost(props: { onVisibleRowsChange: (rows: DataTreeTableRowMeta<PagedRow>[]) => void }): ReactElement {
	const [loaded, setLoaded] = useState(1);

	const children: PagedRow[] = [
		{ id: "a1", parentId: "a", name: "child-1" },
		{ id: "a2", parentId: "a", name: "child-2" }
	];

	return (
		<DataTreeTable<PagedRow>
			ariaLabel="Paged"
			data={[{ id: "a", name: "Folder A" }, ...children.slice(0, loaded)]}
			getParentId={(row) => row.parentId}
			rowKey="id"
			columns={[{ label: "Name", dataKey: "name" }]}
			expandedKeys={new Set(["a"])}
			isLeaf={(row) => row.id !== "a"}
			getPagination={(parentId) =>
				parentId === "a" && loaded < children.length ? { hasMore: true, total: children.length } : undefined
			}
			onLoadMore={() => setLoaded((n) => Math.min(n + 1, children.length))}
			onVisibleRowsChange={props.onVisibleRowsChange}
		/>
	);
}

describe("com.mgmtp.a12.widgets.data-tree-table — onVisibleRowsChange", () => {
	test("reports the visible rows in render order with depth and parent", () => {
		const onVisibleRowsChange = vi.fn<(rows: DataTreeTableRowMeta<Row>[]) => void>();

		render(
			<DataTreeTable
				tree={TREE}
				columns={COLUMNS}
				rowKey="id"
				defaultExpandAll
				ariaLabel="Files"
				onVisibleRowsChange={onVisibleRowsChange}
			/>
		);

		const reported = onVisibleRowsChange.mock.lastCall?.[0] ?? [];

		expect(reported.map((meta) => [meta.key, meta.index, meta.level, meta.parentKey])).toEqual([
			["a", 0, 0, undefined],
			["a1", 1, 1, "a"],
			["a2", 2, 1, "a"],
			["b", 3, 0, undefined]
		]);
		expect(reported.map((meta) => meta.row.name)).toEqual(["Folder A", "File A1", "File A2", "File B"]);
		expect(reported[1].parentRow).toBe(TREE[0]);
	});

	test("indexes match the rendered row order, and re-report on collapse", async () => {
		const onVisibleRowsChange = vi.fn<(rows: DataTreeTableRowMeta<Row>[]) => void>();

		const { container } = render(
			<DataTreeTable
				tree={TREE}
				columns={COLUMNS}
				rowKey="id"
				defaultExpandAll
				ariaLabel="Files"
				onVisibleRowsChange={onVisibleRowsChange}
			/>
		);

		expect(onVisibleRowsChange.mock.lastCall?.[0]).toHaveLength(bodyRows(container).length);

		await userEvent.click(expanderButtons(container)[0]);

		const afterCollapse = onVisibleRowsChange.mock.lastCall?.[0] ?? [];

		expect(afterCollapse.map((meta) => meta.key)).toEqual(["a", "b"]);
		// The ordinal must follow the rendered rows, not the position in the source hierarchy.
		expect(afterCollapse.map((meta) => meta.index)).toEqual([0, 1]);
		expect(afterCollapse).toHaveLength(bodyRows(container).length);
	});

	test("expandable and expanded track the row's own state", async () => {
		const onVisibleRowsChange = vi.fn<(rows: DataTreeTableRowMeta<Row>[]) => void>();

		const { container } = render(
			<DataTreeTable
				tree={TREE}
				columns={COLUMNS}
				rowKey="id"
				ariaLabel="Files"
				onVisibleRowsChange={onVisibleRowsChange}
			/>
		);

		const collapsed = onVisibleRowsChange.mock.lastCall?.[0] ?? [];

		expect(collapsed.map((meta) => [meta.key, meta.expandable, meta.expanded])).toEqual([
			["a", true, false],
			["b", false, false]
		]);

		await userEvent.click(expanderButtons(container)[0]);

		expect(onVisibleRowsChange.mock.lastCall?.[0][0]).toMatchObject({ key: "a", expandable: true, expanded: true });
	});

	test("includes the synthetic load-more row a consumer cannot derive", async () => {
		const onVisibleRowsChange = vi.fn<(rows: DataTreeTableRowMeta<PagedRow>[]) => void>();

		render(<PagedHost onVisibleRowsChange={onVisibleRowsChange} />);

		const reported = onVisibleRowsChange.mock.lastCall?.[0] ?? [];

		// parent, its one loaded child, then the load-more affordance the tree inserted itself.
		expect(reported.map((meta) => meta.kind)).toEqual(["node", "node", "load-more"]);
		expect(reported[2].index).toBe(2);
		// A sentinel carries the *parent* whose next page it would fetch.
		expect(reported[2].parentKey).toBe("a");

		await userEvent.click(getByText(document.body, "Load more"));

		const afterLoad = onVisibleRowsChange.mock.lastCall?.[0] ?? [];

		// Second child arrived, so the sentinel is gone and the indexes shift down.
		expect(afterLoad.map((meta) => meta.kind)).toEqual(["node", "node", "node"]);
		expect(afterLoad.map((meta) => meta.index)).toEqual([0, 1, 2]);
	});

	test("storing the reported rows in state does not loop, even with inline tree callbacks", () => {
		let renders = 0;

		/**
		 * The intended shape, and the one that used to hang: inline `getChildren` / `isLeaf` make the
		 * model re-derive its rows array every render, and the consumer feeds the report straight back
		 * into state as a fresh `Map`. Only a value-gated notification terminates here.
		 */
		function Host(): ReactElement {
			const [indexByKey, setIndexByKey] = useState<Map<Key, number>>(new Map());

			renders += 1;

			return (
				<>
					<span data-role="probe">{indexByKey.size}</span>
					<DataTreeTable
						tree={TREE}
						columns={COLUMNS}
						rowKey="id"
						defaultExpandAll
						ariaLabel="Files"
						getChildren={(row) => row.children}
						isLeaf={(row) => !row.children?.length}
						onVisibleRowsChange={(rows) => setIndexByKey(new Map(rows.map((m) => [m.key, m.index])))}
					/>
				</>
			);
		}

		const { container } = render(<Host />);

		// Settles at: initial render + the one caused by storing the report.
		expect(renders).toBeLessThanOrEqual(3);
		expect(getByDataRole(container, "probe").textContent).toBe("4");
	});

	test("does not re-fire when only an inline listener identity changes", () => {
		const spy = vi.fn();

		function Host({ tick }: { tick: number }): ReactElement {
			return (
				<DataTreeTable
					tree={TREE}
					columns={COLUMNS}
					rowKey="id"
					ariaLabel={`Files ${tick}`}
					// A fresh closure every render — the common consumer shape.
					onVisibleRowsChange={(rows) => spy(rows.length)}
				/>
			);
		}

		const { rerender } = render(<Host tick={0} />);

		expect(spy).toHaveBeenCalledTimes(1);

		rerender(<Host tick={1} />);
		rerender(<Host tick={2} />);

		// The visible row set never changed, so the listener must stay quiet.
		expect(spy).toHaveBeenCalledTimes(1);
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
		const loadChildren = vi.fn((): Promise<Row[]> =>
			Promise.resolve([{ id: "x1", name: "Loaded child", size: "1 KB" }])
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

	test("a paginated parent with no loaded children shows a chevron and expands to the load-more row", async () => {
		interface PRow {
			id: string;
			parentId?: string;
			name: string;
			size: string;
		}

		const onLoadMore = vi.fn();
		const { container } = render(
			<DataTreeTable<PRow>
				ariaLabel="Unloaded folder"
				data={[
					{ id: "f", name: "Folder", size: "—" },
					{ id: "x", name: "File", size: "1 KB" }
				]}
				getParentId={(row) => row.parentId}
				rowKey="id"
				columns={[
					{ label: "Name", dataKey: "name" },
					{ label: "Size", dataKey: "size" }
				]}
				getPagination={(parentId) => (parentId === "f" ? { hasMore: true, total: 3 } : undefined)}
				onLoadMore={onLoadMore}
			/>
		);

		// Not a single child row is loaded, yet the folder is expandable: `getPagination("f").hasMore`
		// says its first page is still outstanding, so no placeholder child rows are needed. "x" reports
		// no pagination state and stays a leaf.
		expect(expanderButtons(container).length).toBe(1);
		expect(queryByDataRole(container, DataRoles.TreeTable.LoadMore)).toBeNull();

		await userEvent.click(expanderButtons(container)[0]);

		// Expanding an empty first page renders just the load-more affordance, nested under the folder.
		const loadMoreRow = getByDataRole(container, DataRoles.TreeTable.LoadMore);
		expect(loadMoreRow.getAttribute("aria-level")).toBe("2");

		await userEvent.click(getByText(loadMoreRow, "Load more"));
		expect(onLoadMore).toHaveBeenCalledWith({ parentId: "f" });
	});

	test("a paginated parent drops its chevron once its pages are drained", () => {
		interface PRow {
			id: string;
			parentId?: string;
			name: string;
		}

		const columns: DataTableColumn<PRow>[] = [{ label: "Name", dataKey: "name" }];
		const render_ = (hasMore: boolean): HTMLElement =>
			render(
				<DataTreeTable<PRow>
					ariaLabel="Drained folder"
					data={[{ id: "f", name: "Folder" }]}
					getParentId={(row) => row.parentId}
					rowKey="id"
					columns={columns}
					getPagination={(parentId) => (parentId === "f" ? { hasMore, total: 0 } : undefined)}
					onLoadMore={vi.fn()}
				/>
			).container;

		const expanders = (container: HTMLElement): number =>
			container.querySelectorAll(`[data-role="${DataRoles.Tree.Node.Expander}"] button`).length;

		// Derived expandability retracts on its own: a parent that reports no further pages and has no
		// loaded children is a leaf, with nothing for the consumer to flip.
		expect(expanders(render_(true))).toBe(1);
		expect(expanders(render_(false))).toBe(0);
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
		const rowEventHandlers = vi.fn((_params: { row: FRow; rowIndex: number }) => ({}));
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

	test("the expand/collapse control is its own tab stop in the default navigation mode", () => {
		const { container } = render(<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" ariaLabel="Files" />);

		expect(expanderButtons(container)[0]).not.toHaveAttribute("tabindex");
	});

	test("arrow-only navigation takes the expand/collapse control out of the tab order", () => {
		const { container } = render(
			<KeyboardNavigationConfigProvider mode="arrow-only">
				<DataTreeTable tree={TREE} columns={COLUMNS} rowKey="id" ariaLabel="Files" />
			</KeyboardNavigationConfigProvider>
		);

		// The row stays the table's only tab stop; the arrows drive expansion instead.
		expect(expanderButtons(container)[0]).toHaveAttribute("tabindex", "-1");
		expect(bodyRows(container)[0]).toHaveAttribute("tabindex", "0");
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
			const above: Instruction = {
				type: "reorder-above",
				currentLevel: 1,
				indentPerLevel: 16
			};
			const below: Instruction = {
				type: "reorder-below",
				currentLevel: 1,
				indentPerLevel: 16
			};
			const child: Instruction = {
				type: "make-child",
				currentLevel: 1,
				indentPerLevel: 16
			};

			expect(mapInstructionToDropResult(above, 1, rows)?.position).toBe("before");
			expect(mapInstructionToDropResult(below, 1, rows)?.position).toBe("after");
			expect(mapInstructionToDropResult(child, 1, rows)?.position).toBe("inside");
		});

		test("reparent outdent resolves the ancestor at the desired level", () => {
			const { rows } = flat();
			// Drop below a1 (level 1) with desiredLevel 0 → becomes a sibling after Folder A (level 0).
			const reparent: Instruction = {
				type: "reparent",
				currentLevel: 1,
				indentPerLevel: 16,
				desiredLevel: 0
			};
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

	describe("keyboard move resolution (pure)", () => {
		// Expanded rows: a(0), a1(1), a2(2), b(3). a1/a2 are siblings under a; a/b are siblings at root.
		test("up/down/top/bottom stay within the sibling group", () => {
			const { rows } = flat();

			// a1 is the first child of a: no move up, down lands after a2.
			expect(resolveTreeKeyboardMove(rows, 1, "up")).toBeNull();
			expect(resolveTreeKeyboardMove(rows, 1, "down")).toMatchObject({ targetIndex: 2, position: "after" });
			// a2 is the last child: down/bottom are no-ops, up lands before a1.
			expect(resolveTreeKeyboardMove(rows, 2, "down")).toBeNull();
			expect(resolveTreeKeyboardMove(rows, 2, "up")).toMatchObject({ targetIndex: 1, position: "before" });
			expect(resolveTreeKeyboardMove(rows, 2, "top")).toMatchObject({ targetIndex: 1, position: "before" });
		});

		test("into nests under the preceding sibling; out outdents after the parent", () => {
			const { rows } = flat();

			// a2 nests into a1 (inside).
			expect(resolveTreeKeyboardMove(rows, 2, "into")).toMatchObject({ targetIndex: 1, position: "inside" });
			// a1 outdents to become the sibling after its parent Folder A (index 0).
			expect(resolveTreeKeyboardMove(rows, 1, "out")).toMatchObject({ targetIndex: 0, position: "after" });
		});

		test("out on a root row is a no-op (no parent to outdent past)", () => {
			const { rows } = flat();

			expect(resolveTreeKeyboardMove(rows, 0, "out")).toBeNull(); // Folder A is a root
			expect(resolveTreeKeyboardMove(rows, 3, "out")).toBeNull(); // File B is a root
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
				indicatorFromInstruction(
					{
						type: "reparent",
						currentLevel: 1,
						indentPerLevel: 16,
						desiredLevel: 0
					},
					true
				)
			).toEqual({ type: "reorder-bottom", level: 0, forbidden: true });
			expect(indicatorFromInstruction(null, false)).toBeNull();
		});

		test("equal indicators compare as the same placement (so a repeated dragover can bail)", () => {
			const base = { type: "reorder-top", level: 1, forbidden: false } as const;

			expect(isSameIndicator(null, null)).toBe(true);
			expect(isSameIndicator(base, { ...base })).toBe(true);
			expect(isSameIndicator(base, null)).toBe(false);
			expect(isSameIndicator(base, { ...base, level: 2 })).toBe(false);
			expect(isSameIndicator(base, { ...base, forbidden: true })).toBe(false);
			expect(isSameIndicator(base, { ...base, type: "child" })).toBe(false);
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

		/** A frame followed by a macrotask, so resize notifications flushed on a timer after that frame land too. */
		async function frameAndTimers(): Promise<void> {
			await nextFrame();
			await new Promise((resolve) => setTimeout(resolve));
		}

		/** Waits until `read()` stops changing across two frames, then returns it. */
		async function settled(read: () => number): Promise<number> {
			let previous = -1;

			while (previous !== read()) {
				previous = read();
				await frameAndTimers();
				await frameAndTimers();
			}

			return read();
		}

		/**
		 * Repeats an identical drag event until it stops costing commits, then returns the
		 * settled count. React's eager same-state bail-out only applies once the fiber carries
		 * no lanes from the previous render, so the first stationary event after a real change
		 * still renders once — this reaches the steady state that must then be free.
		 */
		async function holdStill(read: () => number, fire: () => void): Promise<number> {
			for (let warmUp = 0; warmUp < 4; warmUp++) {
				const before = read();
				fire();
				await settled(read);

				if (read() === before) {
					break;
				}
			}

			return read();
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

		test("holding the pointer still over a row commits nothing; moving it commits again", async () => {
			// `onDrag` fires from every `dragover`, and the browser re-fires `dragover` on a timer
			// while the pointer is held still — the hovered row's indicator state must compare
			// equal placements or a motionless hover repaints it several times a second.
			let commits = 0;
			const { container } = render(
				<Profiler
					id="data-tree-table"
					onRender={(): void => {
						commits++;
					}}
				>
					<DataTreeTable
						tree={TREE}
						columns={COLUMNS}
						rowKey="id"
						defaultExpandAll
						dragDropOptions={{ onDrop: vi.fn(), canDrop: () => true }}
						ariaLabel="Still hover"
					/>
				</Profiler>
			);

			// Let the table's own measurement commits finish first; one landing late, inside the
			// motionless window below, would be counted against the drag.
			await settled(() => commits);

			const rows = bodyRows(container);
			const target = rows[1];
			const dataTransfer = startDrag(rows[0]);

			try {
				await nextFrame();

				const rect = target.getBoundingClientRect();
				const still = { clientX: rect.left + rect.width * 0.7, clientY: rect.top + rect.height * 0.05 };
				const moved = { clientX: still.clientX, clientY: rect.top + rect.height * 0.9 };

				fireEvent.dragEnter(target, { dataTransfer, ...still });
				const beforeStill = await holdStill(
					() => commits,
					() => fireEvent.dragOver(target, { dataTransfer, ...still })
				);

				for (let repeat = 0; repeat < 5; repeat++) {
					fireEvent.dragOver(target, { dataTransfer, ...still });
					await nextFrame();
				}

				expect(commits).toBe(beforeStill);

				// A real move to the opposite edge flips the indicator, which must still commit.
				fireEvent.dragOver(target, { dataTransfer, ...moved });
				await vi.waitFor(() => expect(commits).toBeGreaterThan(beforeStill));
			} finally {
				fireEvent.dragEnd(rows[0], { dataTransfer });
			}
		});

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

		// Root drop zone: the viewport's empty area below the `<table>` (only there when the table is
		// shorter than its bounded height) accepts a drop that moves the row to the top level.
		describe("root drop zone", () => {
			const A1 = TREE[0].children![0]; // File A1

			function renderRootDnd(options: DataTreeTableProps<Row>["dragDropOptions"]): {
				container: HTMLElement;
				rows: HTMLElement[];
				viewport: HTMLElement;
			} {
				const { container } = render(
					<div style={{ height: 320 }}>
						<DataTreeTable
							tree={TREE}
							columns={COLUMNS}
							rowKey="id"
							defaultExpandAll
							dragDropOptions={options}
							ariaLabel="DnD root"
						/>
					</div>
				);

				return { container, rows: bodyRows(container), viewport: getByDataRole(container, DataRoles.Table.Viewport) }; // a(0), a1(1), a2(2), b(3)
			}

			/** Starts dragging `source` and hovers the viewport's empty area below the `<table>`. */
			async function hoverBelowRows(
				container: HTMLElement,
				source: HTMLElement
			): Promise<{ dataTransfer: DataTransfer; point: { clientX: number; clientY: number } }> {
				const viewport = getByDataRole(container, DataRoles.Table.Viewport);
				const table = getByDataRole(container, DataRoles.Table);
				const dataTransfer = startDrag(source);
				await nextFrame();

				const point = {
					clientX: viewport.getBoundingClientRect().left + 20,
					clientY: table.getBoundingClientRect().bottom + 20
				};

				// The empty area is real: the viewport reaches further down than the table.
				expect(point.clientY).toBeLessThan(viewport.getBoundingClientRect().bottom);

				fireEvent.dragEnter(viewport, { dataTransfer, ...point });
				fireEvent.dragOver(viewport, { dataTransfer, ...point });

				return { dataTransfer, point };
			}

			test("dropping on the empty area below the last row reports onDropToRoot, not onDrop", async () => {
				const onDrop = vi.fn();
				const onDropToRoot = vi.fn();
				const { container, rows, viewport } = renderRootDnd({ onDrop, onDropToRoot });

				const { dataTransfer, point } = await hoverBelowRows(container, rows[1]); // File A1

				await vi.waitFor(() => expect(viewport.getAttribute("data-drop-target")).toBe("droppable"));

				fireEvent.drop(viewport, { dataTransfer, ...point });
				fireEvent.dragEnd(rows[1], { dataTransfer });

				expect(onDropToRoot).toHaveBeenCalledTimes(1);
				expect(onDropToRoot.mock.calls[0][0]).toEqual({ source: A1 });
				expect(onDrop).not.toHaveBeenCalled();
				// Feedback is cleared once the drop completes.
				expect(viewport.getAttribute("data-drop-target")).toBeNull();
			});

			test("the zone is armed only while onDropToRoot is provided", async () => {
				const onDrop = vi.fn();
				const { container, rows, viewport } = renderRootDnd({ onDrop });

				const { dataTransfer, point } = await hoverBelowRows(container, rows[1]);
				await nextFrame();

				expect(viewport.getAttribute("data-drop-target")).toBeNull();

				fireEvent.drop(viewport, { dataTransfer, ...point });
				fireEvent.dragEnd(rows[1], { dataTransfer });

				expect(onDrop).not.toHaveBeenCalled();
			});

			test("canDropToRoot:false shows the forbidden zone and blocks the drop", async () => {
				const onDropToRoot = vi.fn();
				const { container, rows, viewport } = renderRootDnd({ onDropToRoot, canDropToRoot: () => false });

				const { dataTransfer, point } = await hoverBelowRows(container, rows[1]);

				await vi.waitFor(() => expect(viewport.getAttribute("data-drop-target")).toBe("forbidden"));

				fireEvent.drop(viewport, { dataTransfer, ...point });
				fireEvent.dragEnd(rows[1], { dataTransfer });

				expect(onDropToRoot).not.toHaveBeenCalled();
				expect(viewport.getAttribute("data-drop-target")).toBeNull();
			});

			test("hovering the header never arms the zone", async () => {
				const onDropToRoot = vi.fn();
				const { container, rows, viewport } = renderRootDnd({ onDropToRoot });
				const headerCell = getAllByDataRole(container, DataRoles.Table.Header.Cell)[0];

				const dataTransfer = startDrag(rows[1]);
				await nextFrame();

				const rect = headerCell.getBoundingClientRect();
				const point = { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };

				fireEvent.dragEnter(headerCell, { dataTransfer, ...point });
				fireEvent.dragOver(headerCell, { dataTransfer, ...point });
				await nextFrame();

				expect(viewport.getAttribute("data-drop-target")).toBeNull();

				fireEvent.drop(headerCell, { dataTransfer, ...point });
				fireEvent.dragEnd(rows[1], { dataTransfer });

				expect(onDropToRoot).not.toHaveBeenCalled();
			});
		});

		// Tree-aware keyboard grab-and-move: Space grabs the focused row, arrows reorder it (↑/↓ among
		// siblings, Home/End to the ends, → nests, ← outdents), Space/Enter drop, Escape cancels. Each move
		// fires the same `onDrop` a pointer drop would and announces through the tree's live region.
		describe("keyboard grab-and-move", () => {
			const A1 = TREE[0].children![0]; // File A1
			const A2 = TREE[0].children![1]; // File A2

			function renderKbd(options: Parameters<typeof DataTreeTable<Row>>[0]["dragDropOptions"]): {
				container: HTMLElement;
				rows: HTMLElement[];
			} {
				const { container } = render(
					<DataTreeTable
						tree={TREE}
						columns={COLUMNS}
						rowKey="id"
						defaultExpandAll
						dragDropOptions={options}
						ariaLabel="DnD kbd"
					/>
				);

				return { container, rows: bodyRows(container) }; // a(0), a1(1), a2(2), b(3)
			}

			function liveText(container: HTMLElement): string {
				return getByDataRole(container, DataRoles.TreeTable.A11yLiveRegion).textContent ?? "";
			}

			test("Space grabs (announcing instructions); ArrowDown reorders down as a sibling ('after')", async () => {
				const onDrop = vi.fn();
				const { container, rows } = renderKbd({ onDrop, canDrop: () => true });

				rows[1].focus(); // File A1 (first child of Folder A)
				await userEvent.keyboard(" ");
				expect(liveText(container)).toMatch(/grabbed/i);

				await userEvent.keyboard("{ArrowDown}");
				expect(onDrop).toHaveBeenCalledTimes(1);
				expect(onDrop.mock.calls[0][0]).toMatchObject({ source: A1, target: A2, position: "after" });
				expect(liveText(container)).toMatch(/moved to position/i);
			});

			test("ArrowUp reorders up as a sibling ('before')", async () => {
				const onDrop = vi.fn();
				const { rows } = renderKbd({ onDrop, canDrop: () => true });

				rows[2].focus(); // File A2
				await userEvent.keyboard(" ");
				await userEvent.keyboard("{ArrowUp}");

				expect(onDrop).toHaveBeenCalledTimes(1);
				expect(onDrop.mock.calls[0][0]).toMatchObject({ source: A2, target: A1, position: "before" });
			});

			test("ArrowRight nests under the preceding sibling ('inside')", async () => {
				const onDrop = vi.fn();
				const { rows } = renderKbd({ onDrop, canDrop: () => true });

				rows[2].focus(); // File A2
				await userEvent.keyboard(" ");
				await userEvent.keyboard("{ArrowRight}");

				expect(onDrop).toHaveBeenCalledTimes(1);
				expect(onDrop.mock.calls[0][0]).toMatchObject({ source: A2, target: A1, position: "inside" });
			});

			test("ArrowLeft outdents to the parent's level ('after' the parent)", async () => {
				const onDrop = vi.fn();
				const { rows } = renderKbd({ onDrop, canDrop: () => true });

				rows[1].focus(); // File A1
				await userEvent.keyboard(" ");
				await userEvent.keyboard("{ArrowLeft}");

				expect(onDrop).toHaveBeenCalledTimes(1);
				expect(onDrop.mock.calls[0][0]).toMatchObject({ source: A1, target: TREE[0], position: "after" });
			});

			test("Escape cancels the grab: no move, and a subsequent arrow just navigates", async () => {
				const onDrop = vi.fn();
				const { container, rows } = renderKbd({ onDrop, canDrop: () => true });

				rows[1].focus();
				await userEvent.keyboard(" ");
				await userEvent.keyboard("{Escape}");
				expect(liveText(container)).toMatch(/cancel/i);

				await userEvent.keyboard("{ArrowDown}");
				expect(onDrop).not.toHaveBeenCalled();
				expect(document.activeElement).toBe(rows[2]); // focus moved, not grabbed
			});

			// The grab stops propagation, so by default a consumer's own Space shortcut never sees the press.
			function renderKbdWithConsumerKeys(
				options: Parameters<typeof DataTreeTable<Row>>[0]["dragDropOptions"],
				onConsumerKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void
			): { container: HTMLElement; rows: HTMLElement[] } {
				const { container } = render(
					<div onKeyDown={onConsumerKeyDown}>
						<DataTreeTable
							tree={TREE}
							columns={COLUMNS}
							rowKey="id"
							defaultExpandAll
							dragDropOptions={options}
							ariaLabel="DnD kbd grab key"
						/>
					</div>
				);

				return { container, rows: bodyRows(container) };
			}

			test("the default grab swallows Space before a consumer's own row shortcut sees it", async () => {
				const onConsumerKeyDown = vi.fn();
				const { container, rows } = renderKbdWithConsumerKeys({ onDrop: vi.fn() }, onConsumerKeyDown);

				rows[1].focus();
				await userEvent.keyboard(" ");

				expect(liveText(container)).toMatch(/grabbed/i);
				expect(onConsumerKeyDown).not.toHaveBeenCalled();
			});

			test("keyboardGrabKey:false never grabs and hands Space back to the consumer", async () => {
				const onDrop = vi.fn();
				const onConsumerKeyDown = vi.fn();
				const { container, rows } = renderKbdWithConsumerKeys({ onDrop, keyboardGrabKey: false }, onConsumerKeyDown);

				rows[1].focus();
				await userEvent.keyboard(" ");

				expect(liveText(container)).not.toMatch(/grabbed/i);
				expect(onConsumerKeyDown).toHaveBeenCalledTimes(1);

				// Nothing is grabbed, so the arrow navigates instead of reordering.
				await userEvent.keyboard("{ArrowDown}");
				expect(onDrop).not.toHaveBeenCalled();
				expect(document.activeElement).toBe(rows[2]);
			});

			test("canDrag:false prevents grabbing (no announcement, no move)", async () => {
				const onDrop = vi.fn();
				const { container, rows } = renderKbd({ onDrop, canDrag: () => false });

				rows[1].focus();
				await userEvent.keyboard(" ");
				expect(liveText(container)).not.toMatch(/grabbed/i);

				await userEvent.keyboard("{ArrowDown}");
				expect(onDrop).not.toHaveBeenCalled();
			});

			test("consecutive grabbed moves keep operating on the same node (controlled reorder)", async () => {
				const onDrop = vi.fn();

				function Harness(): ReactElement {
					const [tree, setTree] = useState<Row[]>([
						{ id: "a", name: "A", size: "1 MB" },
						{ id: "b", name: "B", size: "2 MB" },
						{ id: "c", name: "C", size: "3 MB" }
					]);

					return (
						<DataTreeTable
							tree={tree}
							columns={COLUMNS}
							rowKey="id"
							defaultExpandAll
							ariaLabel="controlled reorder"
							dragDropOptions={{
								canDrop: () => true,
								onDrop: (params) => {
									onDrop(params);
									setTree((prev) => {
										const next = prev.filter((r) => r.id !== params.source.id);
										const idx = next.findIndex((r) => r.id === params.target.id);
										next.splice(params.position === "after" ? idx + 1 : idx, 0, params.source);

										return next;
									});
								}
							}}
						/>
					);
				}

				const { container } = render(<Harness />);
				bodyRows(container)[0].focus(); // A

				// Grab A, move it down past B: order becomes B, A, C.
				await userEvent.keyboard(" ");
				await userEvent.keyboard("{ArrowDown}");
				await vi.waitFor(() => expect(onDrop).toHaveBeenCalledTimes(1));
				// The moved row is refocused at its new slot so the next press keeps moving A (not B).
				await vi.waitFor(() => expect(document.activeElement?.textContent).toContain("A"));

				// A second ArrowDown moves A past C (using A's NEW position): order becomes B, C, A.
				await userEvent.keyboard("{ArrowDown}");
				await vi.waitFor(() => expect(onDrop).toHaveBeenCalledTimes(2));

				expect(onDrop.mock.calls[0][0]).toMatchObject({ source: { id: "a" }, target: { id: "b" }, position: "after" });
				expect(onDrop.mock.calls[1][0]).toMatchObject({ source: { id: "a" }, target: { id: "c" }, position: "after" });
			});
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
					sortOptions={{
						sortState: [{ columnId: "name", order: "asc" }],
						onSort: vi.fn()
					}}
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

describe("com.mgmtp.a12.widgets.data-tree-table — action column auto-size", () => {
	// Tree column + a width-less action column holding `buttonCount` buttons. The
	// auto-size machinery flows through the DataTable wrapper unchanged.
	const treeAutoSizeColumns = (buttonCount: number): DataTableColumn<Row>[] => [
		{ label: "Name", dataKey: "name" },
		{
			label: "",
			actionColumn: true,
			hiddenText: "Actions",
			renderCell: (): ReactElement => (
				<>
					{Array.from({ length: buttonCount }, (_, i) => (
						<button key={i} type="button">
							Action {i + 1}
						</button>
					))}
				</>
			)
		}
	];

	// Two leaves: Name (0) and the action column (1) → `--a12-col-1-width`.
	const actionWidth = (container: HTMLElement): number => {
		const table = container.querySelector("table") as HTMLTableElement;

		return parseFloat(table.style.getPropertyValue("--a12-col-1-width"));
	};

	test("auto-sizes a width-less action column for a nested tree", async () => {
		const { container: c1 } = render(
			<DataTreeTable tree={TREE} columns={treeAutoSizeColumns(1)} rowKey="id" defaultExpandAll ariaLabel="One" />
		);
		const { container: c3 } = render(
			<DataTreeTable tree={TREE} columns={treeAutoSizeColumns(3)} rowKey="id" defaultExpandAll ariaLabel="Three" />
		);

		await vi.waitFor(() => {
			expect(actionWidth(c1)).toBeGreaterThan(0);
			expect(actionWidth(c3)).toBeGreaterThan(actionWidth(c1));
		});
	});

	test("auto-sizes a width-less action column for a flat adjacency list", async () => {
		const flat: Row[] = [
			{ id: "a", name: "Folder A", size: "10 MB" },
			{ id: "a1", name: "File A1", size: "1 MB" }
		];
		const { container } = render(
			<DataTreeTable
				data={flat}
				getParentId={(row) => (row.id === "a1" ? "a" : undefined)}
				columns={treeAutoSizeColumns(3)}
				rowKey="id"
				defaultExpandAll
				ariaLabel="Flat tree auto-size"
			/>
		);

		await vi.waitFor(() => {
			expect(actionWidth(container)).toBeGreaterThan(0);
		});
	});

	test("actionColumnAutoSize=false opts the tree-table out", () => {
		const { container } = render(
			<DataTreeTable
				tree={TREE}
				columns={treeAutoSizeColumns(3)}
				rowKey="id"
				defaultExpandAll
				actionColumnAutoSize={false}
				ariaLabel="Opt out"
			/>
		);
		const table = container.querySelector("table") as HTMLTableElement;
		expect(table.style.getPropertyValue("--a12-col-1-width")).toBe("");
	});
});
