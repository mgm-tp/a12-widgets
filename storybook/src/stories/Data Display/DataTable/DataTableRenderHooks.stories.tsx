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

import { Status } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DataTableColumn, DataTableProps } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "./data-table.data.js";
import { EMPLOYEE_COLUMNS, EMPLOYEES } from "./data-table.data.js";
import { useSortedRows } from "./data-table.helpers.js";

/**
 * Column-level render hooks: `renderCell` / `renderHeader` own the presentation of one
 * column, while `dataKey` / `dataGetter` keeps resolving the value.
 */
const RENDER_COLUMNS: DataTableColumn<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.7, fixedWidth: true },
	{
		label: "Name",
		dataGetter: ({ row }) => `${row.firstName} ${row.lastName}`,
		width: 1.5,
		sortable: true,
		renderHeader: ({ label, sortOrder }) => (
			<span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
				{label}
				{sortOrder ? ` (${sortOrder})` : ""}
			</span>
		)
	},
	{ label: "Department", dataKey: "department", width: 1.5 },
	{
		label: "Status",
		dataKey: "status",
		width: 1,
		renderCell: ({ row }) => {
			const variant = row.status === "Active" ? "success" : row.status === "On Leave" ? "warning" : "error";

			return <Status variant={variant}>{row.status}</Status>;
		}
	}
];

function ColumnRenderHooksDemo(): ReactElement {
	const { rows, sortOptions } = useSortedRows(EMPLOYEES);

	return (
		<DataTable<Employee>
			ariaLabel="Column render hooks"
			data={rows}
			columns={RENDER_COLUMNS}
			rowKey="id"
			sortOptions={sortOptions}
		/>
	);
}

const ACTIVE_EMPLOYEES = EMPLOYEES.filter((e) => e.status === "Active").length;

const FOOTER_COLUMNS: DataTableColumn<Employee>[] = EMPLOYEE_COLUMNS.map((column) => {
	switch (column.dataKey) {
		case "id":
			return { ...column, renderFooter: () => <strong>Total</strong> };
		case "firstName":
			return { ...column, renderFooter: () => <span>{EMPLOYEES.length} employees</span> };
		case "status":
			return { ...column, renderFooter: () => <span>{ACTIVE_EMPLOYEES} active</span> };
		default:
			return column;
	}
});

const meta: Meta<typeof DataTable<Employee>> = {
	title: "Data Display/DataTable/Customization/Render Hooks",
	component: DataTable,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Column-level render hooks (`renderCell`, `renderHeader`, `renderFooter`, `renderFilter`) own the presentation of a single column while the value keeps resolving through `dataKey` / `dataGetter` — so sorting, footers and filtering still work. Prefer them for single-column tweaks. To transform *every* column from one place, or to take over a `<td>` / `<tr>` element, see **Slots**. `renderFilter` is shown under **Filter Row**."
			}
		}
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const BASE_ARGS: DataTableProps<Employee> = {
	ariaLabel: "Employees",
	data: EMPLOYEES,
	columns: EMPLOYEE_COLUMNS,
	rowKey: "id"
};

const STATEFUL_DEMO = { controls: { disable: true } };

export const ColumnRenderHooks: Story = {
	name: "Cell & Header",
	render: () => <ColumnRenderHooksDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const columns: DataTableColumn<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.7, fixedWidth: true },
	{
		label: "Name",
		dataGetter: ({ row }) => \`\${row.firstName} \${row.lastName}\`,
		width: 1.5,
		sortable: true,
		renderHeader: ({ label, sortOrder }) => (
			<span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
				{label}
				{sortOrder ? \` (\${sortOrder})\` : ""}
			</span>
		)
	},
	{ label: "Department", dataKey: "department", width: 1.5 },
	{
		label: "Status",
		dataKey: "status",
		width: 1,
		renderCell: ({ row }) => (
			<Status variant={row.status === "Active" ? "success" : "warning"}>{row.status}</Status>
		)
	}
];

const [sortState, setSortState] = useState<DataTableSortState>([]);
const rows = useMemo(() => sortRows(employees, sortState), [sortState]);

<DataTable<Employee>
	ariaLabel="Column render hooks"
	data={rows}
	columns={columns}
	rowKey="id"
	sortOptions={{ sortState, onSort: setSortState }}
/>`
			},
			description: {
				story:
					"`renderCell` and `renderHeader` take over one column's markup (here a `Status` pill and an uppercased, sort-aware header) while `dataKey` / `dataGetter` still resolves the value — so the column stays sortable."
			}
		}
	}
};

export const ColumnFooters: Story = {
	name: "Footer",
	args: { ...BASE_ARGS, ariaLabel: "Column footers", columns: FOOTER_COLUMNS },
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `const activeCount = employees.filter((e) => e.status === "Active").length;

const columns: DataTableColumn<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.7, fixedWidth: true, renderFooter: () => <strong>Total</strong> },
	{ label: "First Name", dataKey: "firstName", renderFooter: () => <span>{employees.length} employees</span> },
	{ label: "Last Name", dataKey: "lastName" },
	{ label: "Department", dataKey: "department", width: 1.5 },
	{ label: "Role", dataKey: "role", width: 1.5 },
	{ label: "Status", dataKey: "status", renderFooter: () => <span>{activeCount} active</span> }
];

<DataTable<Employee> ariaLabel="Column footers" data={employees} columns={columns} rowKey="id" />`
			},
			description: {
				story:
					"Provide `renderFooter` on columns to render a `<tfoot>` aligned with the body. The footer activates automatically when any column has `renderFooter` (or when any `foot*` slot is provided)."
			}
		}
	}
};
