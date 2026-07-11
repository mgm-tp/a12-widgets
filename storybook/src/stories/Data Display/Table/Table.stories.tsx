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

import type { BaseColumnType, SortState, SortOrder } from "@com.mgmtp.a12.widgets/widgets-core";
import { Table } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Employee } from "./table.data.js";
import { EMPLOYEES, BASIC_COLUMNS } from "./table.data.js";

function BasicTableDemo() {
	return <Table<Employee> data={EMPLOYEES} columns={BASIC_COLUMNS} />;
}

function SortableTableDemo() {
	const [sortedData, setSortedData] = useState(EMPLOYEES);
	const [sortState, setSortState] = useState<SortState<BaseColumnType<Employee>>>({});

	const onSort = useCallback((params: { column: BaseColumnType<Employee>; order: SortOrder }) => {
		setSortState(params);

		if (params.column.dataKey && params.order) {
			const key = params.column.dataKey as keyof Employee;
			const direction = params.order === "asc" ? 1 : -1;

			setSortedData(
				[...EMPLOYEES].sort((a, b) => {
					const aVal = a[key];
					const bVal = b[key];

					return aVal < bVal ? -direction : aVal > bVal ? direction : 0;
				})
			);
		} else {
			setSortedData(EMPLOYEES);
		}
	}, []);

	return <Table<Employee> data={sortedData} columns={BASIC_COLUMNS} sortOptions={{ sortState, onSort }} />;
}

function SelectableTableDemo() {
	const [selectedRow, setSelectedRow] = useState<Employee | undefined>();

	const rowStyling = useCallback(
		({ row }: { row: Employee }) => ({
			selected: selectedRow === row,
			interactive: true,
			title: selectedRow === row ? "Selected" : "Selectable"
		}),
		[selectedRow]
	);

	const rowEventHandlers = useCallback(
		({ row }: { row: Employee }) => ({
			onClick: () => setSelectedRow((prev) => (prev === row ? undefined : row))
		}),
		[]
	);

	return (
		<Table<Employee>
			data={EMPLOYEES}
			columns={BASIC_COLUMNS}
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
		/>
	);
}

function EmptyTableDemo() {
	return <Table<Employee> data={[]} columns={BASIC_COLUMNS} />;
}

function CellHighlightingDemo() {
	return <Table<Employee> data={EMPLOYEES} columns={BASIC_COLUMNS} cellHighlighting />;
}

const meta: Meta<typeof BasicTableDemo> = {
	title: "Data Display/Table/Table",
	component: BasicTableDemo,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <BasicTableDemo />
};

export const Sortable: Story = {
	name: "Sortable Columns",
	render: () => <SortableTableDemo />,
	parameters: {
		docs: {
			description: {
				story: "Click column headers to sort ascending or descending. A third click resets to original order."
			}
		}
	}
};

export const Selectable: Story = {
	name: "Selectable Rows",
	render: () => <SelectableTableDemo />,
	parameters: {
		docs: { description: { story: "Click a row to select it. Click again to deselect." } }
	}
};

export const Empty: Story = {
	name: "Empty Table",
	render: () => <EmptyTableDemo />,
	parameters: {
		docs: { description: { story: "When `data` is an empty array the table renders headers with no body rows." } }
	}
};

export const Disabled: Story = {
	name: "Disabled Table",
	render: () => <Table<Employee> data={EMPLOYEES} columns={BASIC_COLUMNS} disabled />,
	parameters: {
		docs: {
			description: {
				story: "When `disabled` is true all interactions are suppressed and the table is visually disabled."
			}
		}
	}
};

export const CardView: Story = {
	name: "Card View",
	render: () => <Table<Employee> data={EMPLOYEES} columns={BASIC_COLUMNS} cardView />,
	parameters: {
		docs: { description: { story: "Setting `cardView` renders rows as stacked cards — useful for narrow viewports." } }
	}
};

export const CellHighlighting: Story = {
	name: "Cell Highlighting",
	render: () => <CellHighlightingDemo />,
	parameters: {
		docs: {
			description: {
				story: "With `cellHighlighting` enabled, hovering a body cell highlights both the cell and its column header."
			}
		}
	}
};
