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

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";

import { Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DataTableColumn } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "./data-table.data.js";
import { COLUMN_GROUP_COLUMNS, EMPLOYEE_COLUMNS, EMPLOYEES } from "./data-table.data.js";
import { useResizableColumns, useSortedRows } from "./data-table.helpers.js";

function ColumnResizingDemo(): ReactElement {
	const { columns, onEndResize } = useResizableColumns(EMPLOYEE_COLUMNS);

	return (
		<DataTable<Employee>
			ariaLabel="Resizable employee table"
			data={EMPLOYEES}
			columns={columns}
			rowKey="id"
			columnResizingOptions={{ onEndResize }}
		/>
	);
}

const SORTABLE_COLUMNS: DataTableColumn<Employee>[] = EMPLOYEE_COLUMNS.map((column) =>
	column.dataKey === "id" ? column : { ...column, sortable: true }
);

/**
 * Resizable + sortable columns. Dragging (or keyboard-resizing) a column handle must NOT
 * toggle the host header's sort — the synthetic click the browser fires after a pointer
 * resize gesture is intercepted before it reaches the sortable `<th>`.
 */
function ColumnResizingWithSortingDemo(): ReactElement {
	const { columns, onEndResize } = useResizableColumns(SORTABLE_COLUMNS);
	const { rows, sortOptions } = useSortedRows(EMPLOYEES);

	return (
		<DataTable<Employee>
			ariaLabel="Resizable and sortable employee table"
			data={rows}
			columns={columns}
			rowKey="id"
			columnResizingOptions={{ onEndResize }}
			sortOptions={sortOptions}
		/>
	);
}

/**
 * `pinning` is only allowed on a top-level column; sub-columns inherit the side from
 * their group, so `Department` and `Role` are pinned — and resizable — as a unit.
 */
const PINNED_GROUP_COLUMNS: DataTableColumn<Employee>[] = COLUMN_GROUP_COLUMNS.map((column) =>
	column.label === "Job" ? { ...column, pinning: "right" } : column
);

function ColumnGroupResizingDemo(): ReactElement {
	const { columns, onEndResize } = useResizableColumns(PINNED_GROUP_COLUMNS);

	return (
		<DataTable<Employee>
			ariaLabel="Resizable employees with grouped column headers"
			data={EMPLOYEES}
			columns={columns}
			rowKey="id"
			columnResizingOptions={{ onEndResize }}
		/>
	);
}

const ACTION_COLUMNS: DataTableColumn<Employee>[] = [
	...EMPLOYEE_COLUMNS.slice(0, 4),
	{
		label: "",
		hiddenText: "Actions",
		actionColumn: true,
		pinning: "right",
		renderCell: ({ row }) => (
			<>
				<Button icon={<Icon>edit</Icon>} title={`Edit ${row.firstName}`} onClick={(e) => e.stopPropagation()} />
				<Button
					destructive
					icon={<Icon>delete</Icon>}
					title={`Delete ${row.firstName}`}
					onClick={(e) => e.stopPropagation()}
				/>
			</>
		)
	}
];

function ResizingWithActionColumnDemo(): ReactElement {
	const { columns, onEndResize } = useResizableColumns(ACTION_COLUMNS);

	return (
		<DataTable<Employee>
			ariaLabel="Resizable columns with an auto-sized action column"
			data={EMPLOYEES}
			columns={columns}
			rowKey="id"
			columnResizingOptions={{ onEndResize }}
		/>
	);
}

const meta: Meta<typeof DataTable<Employee>> = {
	title: "Data Display/DataTable/Column Resizing",
	component: DataTable,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Pass `columnResizingOptions={{ onEndResize }}` to make columns resizable. Every header cell gains a drag handle at its right edge that is also keyboard-accessible: focus the handle, then `ArrowLeft` / `ArrowRight` adjust the width and `Escape` cancels. `onEndResize` reports the settled widths through `resizedWidthsGetter` — write them back into your column definitions to persist them, as the shared `useResizableColumns` helper in these stories does. Resizing under virtualization and infinite scroll is covered in **Large Data**."
			}
		}
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const STATEFUL_DEMO = { controls: { disable: true } };

export const Basic: Story = {
	name: "Column Resizing",
	render: () => <ColumnResizingDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [columns, setColumns] = useState<DataTableColumn<Employee>[]>(EMPLOYEE_COLUMNS);

// Persist the settled widths back into the column definitions.
const onEndResize: DataTableColumnResizeEventHandler<DataTableColumn<Employee>> = ({ resizedWidthsGetter }) => {
	if (resizedWidthsGetter) {
		setColumns((prev) => prev.map((column) => ({ ...column, width: resizedWidthsGetter(column) ?? column.width })));
	}
};

<DataTable<Employee>
	ariaLabel="Resizable employee table"
	data={employees}
	columns={columns}
	rowKey="id"
	columnResizingOptions={{ onEndResize }}
/>`
			},
			description: {
				story:
					"Drag a header's right edge to resize the column. `fixedWidth` columns report their new width in fixed-width units (`px / 150`); fluid columns report an `fr` ratio relative to their siblings."
			}
		}
	}
};

export const WithSorting: Story = {
	name: "Column Resizing + Sorting",
	render: () => <ColumnResizingWithSortingDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [columns, setColumns] = useState<DataTableColumn<Employee>[]>(
	EMPLOYEE_COLUMNS.map((column) => (column.dataKey === "id" ? column : { ...column, sortable: true }))
);
const [sortState, setSortState] = useState<DataTableSortState>([]);
const rows = useMemo(() => sortRows(employees, sortState), [sortState]);

const onEndResize: DataTableColumnResizeEventHandler<DataTableColumn<Employee>> = ({ resizedWidthsGetter }) => {
	if (resizedWidthsGetter) {
		setColumns((prev) => prev.map((column) => ({ ...column, width: resizedWidthsGetter(column) ?? column.width })));
	}
};

<DataTable<Employee>
	ariaLabel="Resizable and sortable employee table"
	data={rows}
	columns={columns}
	rowKey="id"
	columnResizingOptions={{ onEndResize }}
	sortOptions={{ sortState, onSort: setSortState }}
/>`
			},
			description: {
				story:
					"Resizable columns that are also `sortable`. Finishing a drag over the header does not flip the sort order — click the header label to sort, drag the right-edge handle to resize. Each gesture does only its own thing."
			}
		}
	}
};

export const WithColumnGroups: Story = {
	name: "Column Resizing + Column Groups",
	render: () => <ColumnGroupResizingDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [columns, setColumns] = useState<DataTableColumn<Employee>[]>([
	{ label: "ID", dataKey: "id", width: 0.7, fixedWidth: true, pinning: "left" },
	{
		label: "Name",
		subColumns: [
			{ label: "First", dataKey: "firstName", width: 1 },
			{ label: "Last", dataKey: "lastName", width: 1 }
		]
	},
	{
		// \`pinning\` sits on the group; its leaves inherit it.
		label: "Job",
		pinning: "right",
		subColumns: [
			{ label: "Department", dataKey: "department", width: 1.2 },
			{ label: "Role", dataKey: "role", width: 1.2 }
		]
	},
	{ label: "Status", dataKey: "status", width: 1 }
]);

// Widths are reported per leaf column, so walk into \`subColumns\` when persisting.
function applyWidths(column: DataTableColumn<Employee>, widthOf: (column: DataTableColumn<Employee>) => number | undefined) {
	const width = widthOf(column);

	if (width !== undefined) {
		return { ...column, width };
	}

	return column.subColumns ? { ...column, subColumns: column.subColumns.map((sub) => applyWidths(sub, widthOf)) } : column;
}

const onEndResize: DataTableColumnResizeEventHandler<DataTableColumn<Employee>> = ({ resizedWidthsGetter }) => {
	if (resizedWidthsGetter) {
		setColumns((prev) => prev.map((column) => applyWidths(column, resizedWidthsGetter)));
	}
};

<DataTable<Employee>
	ariaLabel="Resizable employees with grouped column headers"
	data={employees}
	columns={columns}
	rowKey="id"
	columnResizingOptions={{ onEndResize }}
/>`
			},
			description: {
				story:
					"Resize handles appear on leaf header cells inside a column group, except on the leaf that ends the group — that boundary belongs to the group's own handle, which scales the whole group proportionally. `onEndResize` reports the new width per leaf column, so walk the column tree when persisting. Here the `Job` group is pinned to the right; its leaves inherit the pinning and stay resizable."
			}
		}
	}
};

export const WithActionColumn: Story = {
	name: "Column Resizing + Action Column",
	render: () => <ResizingWithActionColumnDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [columns, setColumns] = useState<DataTableColumn<Employee>[]>([
	...EMPLOYEE_COLUMNS.slice(0, 4),
	{
		// No \`width\`: the action column auto-sizes to its buttons and is not user-resizable.
		label: "",
		hiddenText: "Actions",
		actionColumn: true,
		pinning: "right",
		renderCell: ({ row }) => (
			<>
				<Button icon={<Icon>edit</Icon>} title={\`Edit \${row.firstName}\`} onClick={(e) => e.stopPropagation()} />
				<Button destructive icon={<Icon>delete</Icon>} title={\`Delete \${row.firstName}\`} onClick={(e) => e.stopPropagation()} />
			</>
		)
	}
]);

const onEndResize: DataTableColumnResizeEventHandler<DataTableColumn<Employee>> = ({ resizedWidthsGetter }) => {
	if (resizedWidthsGetter) {
		setColumns((prev) => prev.map((column) => ({ ...column, width: resizedWidthsGetter(column) ?? column.width })));
	}
};

<DataTable<Employee>
	ariaLabel="Resizable columns with an auto-sized action column"
	data={employees}
	columns={columns}
	rowKey="id"
	columnResizingOptions={{ onEndResize }}
/>`
			},
			description: {
				story:
					"A width-less `actionColumn` keeps auto-sizing to its buttons while the data columns are resizable. A data column the user has dragged is left alone by later auto-size re-measurements."
			}
		}
	}
};
