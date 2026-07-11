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

import { useCallback, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type {
	DataTableColumn,
	DataTableColumnResizeEventHandler,
	DataTableRowLoadingStatus,
	DataTableSortOrder,
	DataTableSortState,
	DataTableDragDropOptions
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

interface VirtualRow {
	id: number;
	name: string;
	department: string;
	role: string;
	status: string;
}

const VIRTUAL_ROWS: VirtualRow[] = Array.from({ length: 500 }, (_, i) => ({
	id: i + 1,
	name: `Employee ${i + 1}`,
	department: ["Engineering", "Sales", "Marketing", "Finance", "HR"][i % 5],
	role: ["Engineer", "Manager", "Designer", "Analyst", "Recruiter"][i % 5],
	status: i % 7 === 0 ? "On Leave" : "Active"
}));

const VIRTUAL_COLUMNS: DataTableColumn<VirtualRow>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, verticalAlignment: "middle", pinning: "left" },
	{ label: "Name", dataKey: "name", width: 1.5, verticalAlignment: "middle", pinning: "left" },
	{ label: "Department", dataKey: "department", width: 1.5, verticalAlignment: "middle" },
	{ label: "Role", dataKey: "role", width: 1.5, verticalAlignment: "middle" },
	{ label: "Status", dataKey: "status", width: 1, verticalAlignment: "middle" }
];

function VirtualizedScrollDemo() {
	return (
		<DataTable<VirtualRow>
			ariaLabel="Virtualized employee table"
			data={VIRTUAL_ROWS}
			columns={VIRTUAL_COLUMNS}
			rowKey="id"
			maxHeight={500}
			virtualScrollOptions={{ rowHeight: 40 }}
		/>
	);
}

interface ResizeRow {
	id: number;
	firstName: string;
	lastName: string;
	department: string;
	role: string;
	email: string;
}

const RESIZE_DATA: ResizeRow[] = [
	{
		id: 1,
		firstName: "Alice",
		lastName: "Smith",
		department: "Engineering",
		role: "Senior Engineer",
		email: "alice@example.com"
	},
	{
		id: 2,
		firstName: "Bob",
		lastName: "Johnson",
		department: "Sales",
		role: "Account Manager",
		email: "bob@example.com"
	},
	{
		id: 3,
		firstName: "Carol",
		lastName: "Williams",
		department: "Marketing",
		role: "Designer",
		email: "carol@example.com"
	},
	{ id: 4, firstName: "David", lastName: "Brown", department: "Finance", role: "Analyst", email: "david@example.com" },
	{ id: 5, firstName: "Eve", lastName: "Davis", department: "Engineering", role: "Team Lead", email: "eve@example.com" }
];

const INITIAL_RESIZE_COLUMNS: DataTableColumn<ResizeRow>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, verticalAlignment: "middle", pinning: "left" },
	{ label: "First Name", dataKey: "firstName", width: 1, verticalAlignment: "middle" },
	{ label: "Last Name", dataKey: "lastName", width: 1, verticalAlignment: "middle" },
	{ label: "Department", dataKey: "department", width: 1.5, verticalAlignment: "middle" },
	{ label: "Role", dataKey: "role", width: 1.5, verticalAlignment: "middle" },
	{ label: "Email", dataKey: "email", width: 2, verticalAlignment: "middle" }
];

function ColumnResizingDemo() {
	const [columns, setColumns] = useState(INITIAL_RESIZE_COLUMNS);

	const onEndResize: DataTableColumnResizeEventHandler<DataTableColumn<ResizeRow>> = useCallback(
		({ resizedWidthsGetter }) => {
			setColumns((prev) =>
				prev.map((column) => {
					const newWidth = resizedWidthsGetter?.(column);

					return newWidth === undefined ? column : { ...column, width: newWidth };
				})
			);
		},
		[]
	);

	return (
		<DataTable<ResizeRow>
			ariaLabel="Resizable employee table"
			data={RESIZE_DATA}
			columns={columns}
			rowKey="id"
			columnResizingOptions={{ onEndResize }}
		/>
	);
}

const INITIAL_RESIZE_SORT_COLUMNS: DataTableColumn<ResizeRow>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, verticalAlignment: "middle", pinning: "left" },
	{ label: "First Name", dataKey: "firstName", width: 1, verticalAlignment: "middle", sortable: true },
	{ label: "Last Name", dataKey: "lastName", width: 1, verticalAlignment: "middle", sortable: true },
	{ label: "Department", dataKey: "department", width: 1.5, verticalAlignment: "middle", sortable: true },
	{ label: "Role", dataKey: "role", width: 1.5, verticalAlignment: "middle", sortable: true },
	{ label: "Email", dataKey: "email", width: 2, verticalAlignment: "middle", sortable: true }
];

/**
 * Resizable + sortable columns. Dragging (or keyboard-resizing) a column handle
 * must NOT toggle the host header's sort — the synthetic click the browser fires
 * after a pointer resize gesture is intercepted before it reaches the sortable
 * `<th>`. Click the header label itself to sort; drag the right-edge handle to
 * resize. Each action should do only its own thing.
 */
function ColumnResizingWithSortingDemo() {
	const [columns, setColumns] = useState(INITIAL_RESIZE_SORT_COLUMNS);
	const [sortState, setSortState] = useState<DataTableSortState>([]);
	const [data, setData] = useState(RESIZE_DATA);

	const onEndResize: DataTableColumnResizeEventHandler<DataTableColumn<ResizeRow>> = useCallback(
		({ resizedWidthsGetter }) => {
			setColumns((prev) =>
				prev.map((column) => {
					const newWidth = resizedWidthsGetter?.(column);

					return newWidth === undefined ? column : { ...column, width: newWidth };
				})
			);
		},
		[]
	);

	const onSort = useCallback((next: DataTableSortState, toggled: { columnId: string; order: DataTableSortOrder }) => {
		setSortState(next);

		const key = toggled.columnId as keyof ResizeRow | undefined;

		if (key && toggled.order) {
			const direction = toggled.order === "asc" ? 1 : -1;

			setData((prev) =>
				[...prev].sort((a, b) => {
					const av = a[key];
					const bv = b[key];

					return av < bv ? -direction : av > bv ? direction : 0;
				})
			);
		} else {
			setData(RESIZE_DATA);
		}
	}, []);

	return (
		<DataTable<ResizeRow>
			ariaLabel="Resizable and sortable employee table"
			data={data}
			columns={columns}
			rowKey="id"
			columnResizingOptions={{ onEndResize }}
			sortOptions={{ sortState, onSort }}
		/>
	);
}

interface InfiniteRow {
	id: number;
	name: string;
	department: string;
	salary: number;
}

const ALL_INFINITE_ROWS: InfiniteRow[] = Array.from({ length: 500 }, (_, i) => ({
	id: i + 1,
	name: `Employee ${i + 1}`,
	department: ["Engineering", "Sales", "Marketing", "Finance"][i % 4],
	salary: 50000 + (Math.floor(i * 37.3) % 100000)
}));

const INFINITE_COLUMNS: DataTableColumn<InfiniteRow>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, verticalAlignment: "middle", pinning: "left" },
	{ label: "Name", dataKey: "name", width: 1.5, verticalAlignment: "middle", pinning: "left" },
	{ label: "Department", dataKey: "department", width: 1.5, verticalAlignment: "middle" },
	{ label: "Salary", dataGetter: ({ row }) => `$${row.salary.toLocaleString()}`, width: 1, verticalAlignment: "middle" }
];

const INFINITE_LATENCY_MS = 600;

function InfiniteScrollDemo() {
	const [data, setData] = useState<(InfiniteRow | undefined)[]>(() =>
		new Array(ALL_INFINITE_ROWS.length).fill(undefined)
	);
	const [statusMap, setStatusMap] = useState<Record<number, DataTableRowLoadingStatus>>({});

	const loadData = useCallback(({ startIndex, stopIndex }: { startIndex: number; stopIndex: number }) => {
		const stop = Math.min(stopIndex, ALL_INFINITE_ROWS.length - 1);

		setStatusMap((prev) => {
			const next = { ...prev };

			for (let i = startIndex; i <= stop; i++) {
				next[i] = "loading";
			}

			return next;
		});

		return new Promise<void>((resolve) =>
			setTimeout(() => {
				setData((prev) => {
					const next = [...prev];

					for (let i = startIndex; i <= stop; i++) {
						next[i] = ALL_INFINITE_ROWS[i];
					}

					return next;
				});
				setStatusMap((prev) => {
					const next = { ...prev };

					for (let i = startIndex; i <= stop; i++) {
						next[i] = "loaded";
					}

					return next;
				});
				resolve();
			}, INFINITE_LATENCY_MS)
		);
	}, []);

	return (
		<DataTable<InfiniteRow>
			ariaLabel="Infinite scroll employee table"
			data={data as InfiniteRow[]}
			columns={INFINITE_COLUMNS}
			rowKey="id"
			maxHeight={500}
			infiniteScrollOptions={{
				rowHeight: 40,
				rowCount: ALL_INFINITE_ROWS.length,
				rowLoadingStatus: (index) => statusMap[index],
				loadData
			}}
		/>
	);
}

interface DndRow {
	id: number;
	name: string;
	department: string;
	role: string;
	status: string;
}

const INITIAL_DND_ROWS: DndRow[] = [
	{ id: 1, name: "Alice Smith", department: "Engineering", role: "Senior Engineer", status: "Active" },
	{ id: 2, name: "Bob Johnson", department: "Sales", role: "Account Manager", status: "Active" },
	{ id: 3, name: "Carol Williams", department: "Marketing", role: "Designer", status: "On Leave" },
	{ id: 4, name: "David Brown", department: "Finance", role: "Analyst", status: "Active" },
	{ id: 5, name: "Eve Davis", department: "Engineering", role: "Team Lead", status: "Active" }
];

const DND_COLUMNS: DataTableColumn<DndRow>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, verticalAlignment: "middle", pinning: "left" },
	{ label: "Name", dataKey: "name", width: 1.5, verticalAlignment: "middle", pinning: "left" },
	{ label: "Department", dataKey: "department", width: 1.5, verticalAlignment: "middle" },
	{ label: "Role", dataKey: "role", width: 1.5, verticalAlignment: "middle" },
	{ label: "Status", dataKey: "status", width: 1, verticalAlignment: "middle" },
	{
		label: "",
		dataKey: "",
		actionColumn: true,
		pinning: "right",
		renderCell: ({ row }) => (
			<Button
				destructive
				icon={<Icon>delete</Icon>}
				title={`Delete ${row.name}`}
				onClick={(e) => e.stopPropagation()}
			/>
		)
	}
];

function DragAndDropDemo() {
	const [data, setData] = useState<DndRow[]>(INITIAL_DND_ROWS);

	const onDrop: NonNullable<DataTableDragDropOptions<DndRow>["onDrop"]> = useCallback(({ dragItem, dropResult }) => {
		setData((prev) => {
			const next = [...prev];
			const moved = next[dragItem.rowIndex];
			const targetIndex = dragItem.rowIndex < dropResult.rowIndex ? dropResult.rowIndex - 1 : dropResult.rowIndex;

			next.splice(dragItem.rowIndex, 1);
			next.splice(targetIndex, 0, moved);

			return next;
		});
	}, []);

	return (
		<DataTable<DndRow>
			ariaLabel="Drag-and-drop reorderable employees"
			data={data}
			columns={DND_COLUMNS}
			rowKey="id"
			dragDropOptions={{ onDrop }}
		/>
	);
}

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Finance", "Support"];
const ROLES = ["Engineer", "Manager", "Designer", "Analyst", "Lead"];

const LARGE_DND_ROWS: DndRow[] = Array.from({ length: 500 }, (_, i) => ({
	id: i + 1,
	name: `Person ${i + 1}`,
	department: DEPARTMENTS[i % DEPARTMENTS.length],
	role: ROLES[i % ROLES.length],
	status: i % 4 === 0 ? "On Leave" : "Active"
}));

function VirtualizedDragAndDropDemo() {
	const [data, setData] = useState<DndRow[]>(LARGE_DND_ROWS);

	const onDrop: NonNullable<DataTableDragDropOptions<DndRow>["onDrop"]> = useCallback(({ dragItem, dropResult }) => {
		setData((prev) => {
			const next = [...prev];
			const moved = next[dragItem.rowIndex];
			const targetIndex = dragItem.rowIndex < dropResult.rowIndex ? dropResult.rowIndex - 1 : dropResult.rowIndex;

			next.splice(dragItem.rowIndex, 1);
			next.splice(targetIndex, 0, moved);

			return next;
		});
	}, []);

	return (
		<DataTable<DndRow>
			ariaLabel="Virtualized drag-and-drop reorderable people"
			data={data}
			columns={DND_COLUMNS}
			rowKey="id"
			maxHeight={400}
			virtualScrollOptions={{ rowHeight: 44 }}
			dragDropOptions={{ onDrop }}
		/>
	);
}

const meta: Meta<typeof VirtualizedScrollDemo> = {
	title: "Data Display/DataTable/Advanced",
	component: VirtualizedScrollDemo,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const VirtualizedScroll: Story = {
	name: "Virtualized Scroll",
	render: () => <VirtualizedScrollDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Set `virtualScrollOptions={{ rowHeight }}` and provide a bounded `maxHeight` to render only viewport rows (plus an overscan buffer). Column widths resolve exactly as in non-virtualized mode (a column with no `width` defaults to `width: 1` and flexes)."
			}
		}
	}
};

export const ColumnResizing: Story = {
	name: "Column Resizing",
	render: () => <ColumnResizingDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Provide `columnResizingOptions.onEndResize` and persist new widths on each column. Non-fixed, non-action header cells gain a drag handle at their right edge that is also keyboard-accessible (Arrow keys to resize, Escape to cancel)."
			}
		}
	}
};

export const ColumnResizingWithSorting: Story = {
	name: "Column Resizing + Sorting",
	render: () => <ColumnResizingWithSortingDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Resizable columns that are also `sortable`. Resizing a column via its drag handle (pointer or keyboard) must NOT toggle the column's sort. Drag the right-edge handle of a header to resize; click the header label to sort. Each gesture should do only its own thing — verify that finishing a drag over the header does not flip the sort order."
			}
		}
	}
};

export const InfiniteScroll: Story = {
	name: "Infinite Scroll",
	render: () => <InfiniteScrollDemo />,
	parameters: {
		docs: {
			description: {
				story:
					'Pass `infiniteScrollOptions={{ rowHeight, rowCount, rowLoadingStatus, loadData }}` to fetch rows in batches as they approach the viewport. Rows whose status is not `"loaded"` render via the placeholder slot. Scroll fast to see the skeleton rows.'
			}
		}
	}
};

export const DragAndDrop: Story = {
	name: "Drag and Drop",
	render: () => <DragAndDropDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Pass `dragDropOptions={{ onDrop }}` to enable row reordering. Drag-and-drop is self-contained (built on Atlassian's pragmatic-drag-and-drop) — no provider or other setup is required around the table."
			}
		}
	}
};

export const VirtualizedDragAndDrop: Story = {
	name: "Drag and Drop + Virtualization",
	render: () => <VirtualizedDragAndDropDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"`dragDropOptions` and `virtualScrollOptions` work together: this table windows 500 rows yet every rendered row stays draggable. Drag a row toward the viewport's **top or bottom edge** and it auto-scrolls to bring off-window rows into view as drop targets."
			}
		}
	}
};
