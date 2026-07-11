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

import type { ReactElement, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type {
	DataTableColumn,
	DataTableSlotProps,
	DataTableSlots
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Status } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "../Table/table.data.js";
import { BASIC_COLUMNS, EMPLOYEES } from "../Table/table.data.js";

const COLUMNS: DataTableColumn<Employee>[] = [...BASIC_COLUMNS, { label: "Status", dataKey: "status", width: 1 }];

/**
 * Slot components are declared at module scope so their identity stays stable
 * across renders — inlining them into the `slots` object literal would remount
 * the subtree on every render.
 */
function UppercaseHeadContent({ defaultContent }: DataTableSlotProps.HeadContent<Employee>): ReactElement {
	return <span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>{defaultContent}</span>;
}

const HEAD_CONTENT_SLOTS: DataTableSlots<Employee> = { headContent: UppercaseHeadContent };

function HeadContentSlotDemo() {
	return (
		<DataTable<Employee>
			ariaLabel="Custom head content slot"
			data={EMPLOYEES}
			columns={COLUMNS}
			rowKey="id"
			slots={HEAD_CONTENT_SLOTS}
		/>
	);
}

function StatusCellContent({ column, row, defaultContent }: DataTableSlotProps.CellContent<Employee>): ReactNode {
	if (column.dataKey === "status") {
		const variant = row.status === "Active" ? "success" : row.status === "On Leave" ? "warning" : "error";

		return <Status variant={variant}>{row.status}</Status>;
	}

	return defaultContent;
}

const CELL_CONTENT_SLOTS: DataTableSlots<Employee> = { cellContent: StatusCellContent };

function CellContentSlotDemo() {
	return (
		<DataTable<Employee>
			ariaLabel="Custom cell content slot"
			data={EMPLOYEES}
			columns={COLUMNS}
			rowKey="id"
			slots={CELL_CONTENT_SLOTS}
		/>
	);
}

const TOTAL_EMPLOYEES = EMPLOYEES.length;
const ACTIVE_EMPLOYEES = EMPLOYEES.filter((e) => e.status === "Active").length;

const FOOTER_COLUMNS: DataTableColumn<Employee>[] = COLUMNS.map((column) => {
	switch (column.dataKey) {
		case "id":
			return { ...column, renderFooter: () => <strong>Total</strong> };
		case "firstName":
			return { ...column, renderFooter: () => <span>{TOTAL_EMPLOYEES} employees</span> };
		case "status":
			return { ...column, renderFooter: () => <span>{ACTIVE_EMPLOYEES} active</span> };
		default:
			return column;
	}
});

function ColumnFootersDemo() {
	return <DataTable<Employee> ariaLabel="Column footers" data={EMPLOYEES} columns={FOOTER_COLUMNS} rowKey="id" />;
}

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

function CellSlotDemo() {
	return (
		<DataTable<Employee>
			ariaLabel="Custom cell slot"
			data={EMPLOYEES}
			columns={COLUMNS}
			rowKey="id"
			slots={CELL_SLOTS}
		/>
	);
}

const meta: Meta<typeof HeadContentSlotDemo> = {
	title: "Data Display/DataTable/Customization/Content Slots",
	component: HeadContentSlotDemo,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Content slots transform the label or value of *every* column from one place, falling back to `defaultContent`. Reach for a column-level render hook (see **Render Hooks**) when you only need to customize a single column; use the structural `cell` slot when you need control over the `<td>` element itself."
			}
		}
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const HeadContentSlot: Story = {
	name: "Custom Head Content",
	render: () => <HeadContentSlotDemo />,
	parameters: {
		docs: {
			description: { story: "Provide the `headContent` slot to wrap or transform every column label." }
		}
	}
};

export const CellContentSlot: Story = {
	name: "Custom Cell Content",
	render: () => <CellContentSlotDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Provide the `cellContent` slot to render rich content per column — e.g., a `Status` pill for the status column. Return `defaultContent` to fall back to the resolved cell value. For a single column, prefer the column-level `renderCell` hook."
			}
		}
	}
};

export const ColumnFooters: Story = {
	name: "Custom Footer Content",
	render: () => <ColumnFootersDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Provide `renderFooter` on columns to render a `<tfoot>` aligned with the body — the footer activates automatically when any column has `renderFooter` (or when any `foot*` slot is provided)."
			}
		}
	}
};

export const CellSlot: Story = {
	name: "Custom Body Cell",
	render: () => <CellSlotDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Provide the `cell` slot for full control over the `<td>` element — useful for applying per-column styles or wrappers. The pre-built cell content arrives as `children`."
			}
		}
	}
};
