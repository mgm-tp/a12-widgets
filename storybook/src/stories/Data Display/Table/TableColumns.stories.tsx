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

import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { BaseColumnType, Column, ColumnResizeEventHandler } from "@com.mgmtp.a12.widgets/widgets-core";
import { Table } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Employee } from "./table.data.js";
import { EMPLOYEES, BASIC_COLUMNS } from "./table.data.js";

// ---------------------------------------------------------------------------
// Pinned Columns
// ---------------------------------------------------------------------------

const PINNED_COLUMNS: BaseColumnType<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, pinning: "left", fixedWidth: true, verticalAlignment: "middle" },
	{ label: "First Name", dataKey: "firstName", width: 1, verticalAlignment: "middle" },
	{ label: "Last Name", dataKey: "lastName", width: 1, verticalAlignment: "middle" },
	{ label: "Department", dataKey: "department", width: 1.5, verticalAlignment: "middle" },
	{ label: "Role", dataKey: "role", width: 1.5, verticalAlignment: "middle" },
	{ label: "Status", dataKey: "status", width: 1, verticalAlignment: "middle" },
	{
		label: "",
		dataKey: "status",
		pinning: "right",
		actionColumn: true,
		horizontalAlignment: "center",
		hiddenText: "Status (pinned)"
	}
];

// ---------------------------------------------------------------------------
// Column Groups
// ---------------------------------------------------------------------------

const GROUPED_COLUMNS: BaseColumnType<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, verticalAlignment: "middle" },
	{
		label: "Name",
		subColumns: [
			{ label: "First Name", dataKey: "firstName", width: 1, verticalAlignment: "middle" },
			{ label: "Last Name", dataKey: "lastName", width: 1, verticalAlignment: "middle" }
		]
	},
	{
		label: "Work Details",
		subColumns: [
			{ label: "Department", dataKey: "department", width: 1.5, verticalAlignment: "middle" },
			{ label: "Role", dataKey: "role", width: 1.5, verticalAlignment: "middle" }
		]
	},
	{ label: "Status", dataKey: "status", width: 1, verticalAlignment: "middle" }
];

// ---------------------------------------------------------------------------
// Resizable Columns
// ---------------------------------------------------------------------------

const RESIZABLE_COLUMNS: BaseColumnType<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, verticalAlignment: "middle" },
	{ label: "First Name", dataKey: "firstName", width: 1, verticalAlignment: "middle" },
	{ label: "Last Name", dataKey: "lastName", width: 1, verticalAlignment: "middle" },
	{ label: "Department", dataKey: "department", width: 1.5, verticalAlignment: "middle" },
	{ label: "Role", dataKey: "role", width: 1.5, verticalAlignment: "middle" }
];

function ResizableColumnsDemo() {
	const [columns, setColumns] = useState(RESIZABLE_COLUMNS);

	const onEndResize: ColumnResizeEventHandler<BaseColumnType<Employee>> = useCallback(({ resizedWidthsGetter }) => {
		setColumns((prev) =>
			prev.map((col) => {
				const newWidth = resizedWidthsGetter?.(col);

				return newWidth !== undefined ? { ...col, width: newWidth } : col;
			})
		);
	}, []);

	return <Table<Employee> data={EMPLOYEES} columns={columns} columnResizingOptions={{ onEndResize }} />;
}

// ---------------------------------------------------------------------------
// Resizable Column Groups
// ---------------------------------------------------------------------------

function updateGroupedColumnWidths(
	column: BaseColumnType<Employee>,
	resizedWidthsGetter: (column: BaseColumnType<Employee>) => Column.Width | undefined
): BaseColumnType<Employee> {
	const newWidth = resizedWidthsGetter(column);

	if (newWidth !== undefined) {
		return { ...column, width: newWidth };
	}

	if (column.subColumns) {
		return {
			...column,
			subColumns: column.subColumns.map((subColumn) => updateGroupedColumnWidths(subColumn, resizedWidthsGetter))
		};
	}

	return column;
}

function ResizableColumnGroupsDemo() {
	const [columns, setColumns] = useState(GROUPED_COLUMNS);

	const onEndResize: ColumnResizeEventHandler<BaseColumnType<Employee>> = useCallback(({ resizedWidthsGetter }) => {
		if (!resizedWidthsGetter) {
			return;
		}

		setColumns((prev) => prev.map((column) => updateGroupedColumnWidths(column, resizedWidthsGetter)));
	}, []);

	return <Table<Employee> data={EMPLOYEES} columns={columns} columnResizingOptions={{ onEndResize }} />;
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
	title: "Data Display/Table/Table Columns",
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <Table<Employee> data={EMPLOYEES} columns={BASIC_COLUMNS} />
};

export const PinnedColumns: Story = {
	name: "Pinned Columns",
	render: () => <Table<Employee> data={EMPLOYEES} columns={PINNED_COLUMNS} />,
	parameters: {
		docs: {
			description: {
				story:
					'Set `pinning: "left"` or `pinning: "right"` on a column to fix it to that edge. ' +
					"Pinned columns scroll independently from the middle scrollable area."
			}
		}
	}
};

export const ColumnGroups: Story = {
	name: "Column Groups",
	render: () => <Table<Employee> data={EMPLOYEES} columns={GROUPED_COLUMNS} />,
	parameters: {
		docs: {
			description: {
				story: "Add a `subColumns` array to a column definition to create a column group with a spanning header cell."
			}
		}
	}
};

export const ColumnGroupWithEnableColumnGroupA11y: Story = {
	name: "Column Groups Accessibility",
	render: () => <Table<Employee> data={EMPLOYEES} columns={GROUPED_COLUMNS} enableColumnGroupA11y />,
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

export const ResizableColumns: Story = {
	name: "Resizable Columns",
	render: () => <ResizableColumnsDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Drag the resize handle at a column header border to change its width. " +
					"`columnResizingOptions.onEndResize` receives a `resizedWidthsGetter` helper to read new widths."
			}
		}
	}
};

export const ResizableColumnGroups: Story = {
	render: () => <ResizableColumnGroupsDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Resize handles appear on leaf header cells inside a column group. " +
					"`onEndResize` reports the new width per leaf column — walk the column tree and update each match via `resizedWidthsGetter` to persist the change."
			}
		}
	}
};
