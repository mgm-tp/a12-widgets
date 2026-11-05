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
import type { ReactElement, ReactNode } from "react";

import { Status } from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	DataTableProps,
	DataTableSlotProps,
	DataTableSlots
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "./data-table.data.js";
import { EMPLOYEE_COLUMNS, EMPLOYEES } from "./data-table.data.js";

/**
 * Slot components are declared at module scope so their identity stays stable
 * across renders — inlining them into the `slots` object literal would remount
 * the subtree on every render.
 */
function UppercaseHeadContent({ defaultContent }: DataTableSlotProps.HeadContent<Employee>): ReactElement {
	return <span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>{defaultContent}</span>;
}

const HEAD_CONTENT_SLOTS: DataTableSlots<Employee> = { headContent: UppercaseHeadContent };

function StatusCellContent({ column, row, defaultContent }: DataTableSlotProps.CellContent<Employee>): ReactNode {
	if (column.dataKey === "status") {
		const variant = row.status === "Active" ? "success" : row.status === "On Leave" ? "warning" : "error";

		return <Status variant={variant}>{row.status}</Status>;
	}

	return defaultContent;
}

const CELL_CONTENT_SLOTS: DataTableSlots<Employee> = { cellContent: StatusCellContent };

function DashedCell({ column, children }: DataTableSlotProps.Cell<Employee>): ReactElement {
	return (
		<td
			style={{
				padding: "8px 12px",
				borderBottom: "1px dashed var(--plasma-color-stroke-secondary, #ccc)",
				fontStyle: column.dataKey === "id" ? "italic" : "normal"
			}}
		>
			{children}
		</td>
	);
}

const CELL_SLOTS: DataTableSlots<Employee> = { cell: DashedCell };

/**
 * A structural slot composing the self-wiring `DataTable.Row` primitive — sorting,
 * selection, keyboard navigation and context menus stay intact; only zebra striping
 * is layered on top.
 */
function ZebraRow(props: DataTableSlotProps.Row<Employee>): ReactElement {
	const shaded = props.rowIndex % 2 === 1;

	return (
		<DataTable.Row
			{...props}
			styles={{
				...props.styles,
				style: { ...props.styles?.style, background: shaded ? "rgba(0, 0, 0, 0.04)" : undefined }
			}}
		/>
	);
}

const ROW_SLOTS: DataTableSlots<Employee> = { row: ZebraRow };

const meta: Meta<typeof DataTable<Employee>> = {
	title: "Data Display/DataTable/Customization/Slots",
	component: DataTable,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"`slots` swap in your own components table-wide. **Content slots** (`headContent`, `cellContent`) transform the label or value of *every* column from one place and fall back to `defaultContent`. **Structural slots** (`row`, `cell`, `contextMenu`, `rowGroupHeader`, …) replace an element outright; compose the self-wiring `DataTable.*` primitives inside them so sorting, selection, keyboard navigation and context menus keep working. Slot components must have stable identity — declare them at module scope or memoize. For a single column, prefer a **Render Hook**."
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

export const HeadContentSlot: Story = {
	name: "Head Content",
	args: { ...BASE_ARGS, ariaLabel: "Custom head content slot", slots: HEAD_CONTENT_SLOTS },
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `function UppercaseHeadContent({ defaultContent }: DataTableSlotProps.HeadContent<Employee>) {
	return <span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>{defaultContent}</span>;
}

// Declare slots at module scope so their identity stays stable across renders.
const SLOTS: DataTableSlots<Employee> = { headContent: UppercaseHeadContent };

<DataTable<Employee> ariaLabel="Custom head content slot" data={employees} columns={columns} rowKey="id" slots={SLOTS} />`
			},
			description: { story: "The `headContent` slot wraps or transforms every column label." }
		}
	}
};

export const CellContentSlot: Story = {
	name: "Cell Content",
	args: { ...BASE_ARGS, ariaLabel: "Custom cell content slot", slots: CELL_CONTENT_SLOTS },
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `function StatusCellContent({ column, row, defaultContent }: DataTableSlotProps.CellContent<Employee>) {
	if (column.dataKey === "status") {
		return <Status variant={row.status === "Active" ? "success" : "warning"}>{row.status}</Status>;
	}

	return defaultContent;
}

const SLOTS: DataTableSlots<Employee> = { cellContent: StatusCellContent };

<DataTable<Employee> ariaLabel="Custom cell content slot" data={employees} columns={columns} rowKey="id" slots={SLOTS} />`
			},
			description: {
				story:
					"The `cellContent` slot renders rich content per column — e.g., a `Status` pill for the status column. Return `defaultContent` to fall back to the resolved cell value."
			}
		}
	}
};

export const CellSlot: Story = {
	name: "Body Cell",
	args: { ...BASE_ARGS, ariaLabel: "Custom cell slot", slots: CELL_SLOTS },
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `function DashedCell({ column, children }: DataTableSlotProps.Cell<Employee>) {
	return (
		<td
			style={{
				padding: "8px 12px",
				borderBottom: "1px dashed var(--plasma-color-stroke-secondary, #ccc)",
				fontStyle: column.dataKey === "id" ? "italic" : "normal"
			}}
		>
			{children}
		</td>
	);
}

const SLOTS: DataTableSlots<Employee> = { cell: DashedCell };

<DataTable<Employee> ariaLabel="Custom cell slot" data={employees} columns={columns} rowKey="id" slots={SLOTS} />`
			},
			description: {
				story:
					"The structural `cell` slot gives full control over the `<td>` element — useful for per-column styles or wrappers. The pre-built cell content arrives as `children`."
			}
		}
	}
};

export const RowSlot: Story = {
	name: "Row",
	args: { ...BASE_ARGS, ariaLabel: "Zebra rows via row slot", slots: ROW_SLOTS },
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// Compose the self-wiring DataTable.Row so sorting, selection, keyboard navigation
// and context menus stay intact; only zebra striping is layered on top.
function ZebraRow(props: DataTableSlotProps.Row<Employee>) {
	const shaded = props.rowIndex % 2 === 1;

	return (
		<DataTable.Row
			{...props}
			styles={{
				...props.styles,
				style: { ...props.styles?.style, background: shaded ? "rgba(0, 0, 0, 0.04)" : undefined }
			}}
		/>
	);
}

const SLOTS: DataTableSlots<Employee> = { row: ZebraRow };

<DataTable<Employee> ariaLabel="Zebra rows via row slot" data={employees} columns={columns} rowKey="id" slots={SLOTS} />`
			},
			description: {
				story:
					"The structural `row` slot is a full component and may use hooks. Composing `DataTable.Row` keeps sorting, selection, keyboard navigation and context menus intact; here it only adds zebra striping on top."
			}
		}
	}
};
