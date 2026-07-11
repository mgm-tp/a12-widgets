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

import type { ReactElement } from "react";
import { createContext, useCallback, useContext, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { Column, RowEventHandlerGetter, RowsGroup } from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	DataTableColumn,
	DataTableRowStyleGetter,
	DataTableSortOrder,
	DataTableSortState,
	DataTableColumnResizeEventHandler,
	DataTableSlotProps,
	DataTableSlots
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Icon, Link } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable, DataTableRowsGroup } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

interface Dessert {
	name: string;
	calories: number;
	fat: number;
	carbs: number;
	protein: number;
}

const GROUP_DATA: RowsGroup<Dessert>[] = [
	{
		head: { title: "Frozen Desserts" },
		subRows: [
			{ name: "Frozen yoghurt", calories: 159, fat: 6.0, carbs: 24, protein: 4.0 },
			{ name: "Ice cream sandwich", calories: 237, fat: 9.0, carbs: 37, protein: 4.3 }
		],
		ariaLabel: "Frozen Desserts"
	},
	{
		head: { title: "Pastry" },
		subRows: [
			{ name: "Eclair", calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
			{ name: "Cupcake", calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
			{ name: "Gingerbread", calories: 356, fat: 16.0, carbs: 49, protein: 3.9 }
		],
		ariaLabel: "Pastry"
	},
	{
		head: { title: "Candy" },
		subRows: [
			{ name: "Jelly Bean", calories: 375, fat: 0.0, carbs: 94, protein: 0.0 },
			{ name: "Lollipop", calories: 392, fat: 0.2, carbs: 98, protein: 0.0 },
			{ name: "Marshmallow", calories: 318, fat: 0, carbs: 81, protein: 2.0 }
		],
		ariaLabel: "Candy"
	}
];

const GROUP_COLUMNS: DataTableColumn<Dessert>[] = [
	{ label: "Name", dataKey: "name", width: 2, verticalAlignment: "middle", pinning: "left" },
	{ label: "Calories", dataKey: "calories", width: 1, verticalAlignment: "middle" },
	{ label: "Fat (g)", dataKey: "fat", width: 1, verticalAlignment: "middle" },
	{ label: "Carbs (g)", dataKey: "carbs", width: 1, verticalAlignment: "middle" },
	{ label: "Protein (g)", dataKey: "protein", width: 1, verticalAlignment: "middle" }
];

const ToggleGroupContext = createContext<(groupIndex: number) => void>(() => undefined);

/**
 * Slot component declared at module scope (stable identity). Slots are mounted
 * components, so hooks — here `useContext` for the story's toggle handler —
 * are available.
 */
function CollapsibleGroupHeader({
	group,
	groupIndex,
	collapsed
}: DataTableSlotProps.RowGroupHeader<Dessert>): ReactElement {
	const toggleGroup = useContext(ToggleGroupContext);

	return (
		<Link
			useAsButton
			title={collapsed ? "Expand group" : "Collapse group"}
			linkAttributes={{ "aria-expanded": !collapsed }}
			onClick={() => toggleGroup(groupIndex)}
		>
			<Icon>{collapsed ? "chevron_right" : "expand_more"}</Icon>
			{group.head?.title}
		</Link>
	);
}

const GROUP_SLOTS: DataTableSlots<Dessert> = { rowGroupHeader: CollapsibleGroupHeader };

function RowGroupingDemo() {
	const [data, setData] = useState<RowsGroup<Dessert>[]>(GROUP_DATA);
	const [selectedRow, setSelectedRow] = useState<Dessert | undefined>();

	const toggleGroup = useCallback((groupIndex: number) => {
		setData((prev) => prev.map((g, i) => (i === groupIndex ? { ...g, collapsed: !g.collapsed } : g)));
	}, []);

	const rowEventHandlers: RowEventHandlerGetter<Dessert> = useCallback(
		({ row }) => ({ onClick: () => setSelectedRow((prev) => (prev === row ? undefined : row)) }),
		[]
	);

	const rowStyling: DataTableRowStyleGetter<Dessert> = useCallback(
		({ row }) => ({
			selected: selectedRow === row,
			title: selectedRow === row ? "Selected" : "Selectable"
		}),
		[selectedRow]
	);

	return (
		<ToggleGroupContext.Provider value={toggleGroup}>
			<DataTableRowsGroup<Dessert>
				ariaLabel="Desserts grouped by category"
				data={data}
				columns={GROUP_COLUMNS}
				rowKey="name"
				rowStyling={rowStyling}
				rowEventHandlers={rowEventHandlers}
				slots={GROUP_SLOTS}
			/>
		</ToggleGroupContext.Provider>
	);
}

interface EmployeeRow {
	id: number;
	firstName: string;
	lastName: string;
	department: string;
	role: string;
	email: string;
	phone: string;
}

const COLUMN_GROUP_DATA: EmployeeRow[] = [
	{
		id: 1,
		firstName: "Alice",
		lastName: "Smith",
		department: "Engineering",
		role: "Senior Engineer",
		email: "alice@example.com",
		phone: "555-0101"
	},
	{
		id: 2,
		firstName: "Bob",
		lastName: "Johnson",
		department: "Sales",
		role: "Account Manager",
		email: "bob@example.com",
		phone: "555-0102"
	},
	{
		id: 3,
		firstName: "Carol",
		lastName: "Williams",
		department: "Marketing",
		role: "Designer",
		email: "carol@example.com",
		phone: "555-0103"
	},
	{
		id: 4,
		firstName: "David",
		lastName: "Brown",
		department: "Finance",
		role: "Analyst",
		email: "david@example.com",
		phone: "555-0104"
	}
];

const COLUMN_GROUP_COLUMNS: DataTableColumn<EmployeeRow>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, verticalAlignment: "middle", pinning: "left" },
	{
		label: "Name",
		subColumns: [
			{ label: "First", dataKey: "firstName", width: 1, verticalAlignment: "middle" },
			{ label: "Last", dataKey: "lastName", width: 1, verticalAlignment: "middle" }
		]
	},
	{
		label: "Job",
		subColumns: [
			{ label: "Department", dataKey: "department", width: 1.2, verticalAlignment: "middle" },
			{ label: "Role", dataKey: "role", width: 1.2, verticalAlignment: "middle" }
		]
	},
	{
		label: "Contact",
		subColumns: [
			{ label: "Email", dataKey: "email", width: 1.5, verticalAlignment: "middle" },
			{ label: "Phone", dataKey: "phone", width: 1, verticalAlignment: "middle" }
		]
	}
];

function ColumnGroupingDemo() {
	return (
		<DataTable<EmployeeRow>
			ariaLabel="Employees with grouped column headers"
			data={COLUMN_GROUP_DATA}
			columns={COLUMN_GROUP_COLUMNS}
			rowKey="id"
		/>
	);
}

function updateColumnWidths(
	column: DataTableColumn<EmployeeRow>,
	resizedWidthsGetter: (column: DataTableColumn<EmployeeRow>) => Column.Width | undefined
): DataTableColumn<EmployeeRow> {
	const newWidth = resizedWidthsGetter(column);

	if (newWidth !== undefined) {
		return { ...column, width: newWidth };
	}

	if (column.subColumns) {
		return {
			...column,
			subColumns: column.subColumns.map((subColumn) => updateColumnWidths(subColumn, resizedWidthsGetter))
		};
	}

	return column;
}

function ColumnGroupResizingDemo() {
	const [columns, setColumns] = useState(COLUMN_GROUP_COLUMNS);

	const onEndResize: DataTableColumnResizeEventHandler<DataTableColumn<EmployeeRow>> = useCallback(
		({ resizedWidthsGetter }) => {
			if (!resizedWidthsGetter) {
				return;
			}

			setColumns((prev) => prev.map((column) => updateColumnWidths(column, resizedWidthsGetter)));
		},
		[]
	);

	return (
		<DataTable<EmployeeRow>
			ariaLabel="Resizable employees with grouped column headers"
			data={COLUMN_GROUP_DATA}
			columns={columns}
			rowKey="id"
			columnResizingOptions={{ onEndResize }}
		/>
	);
}

const CROSS_TAB_COLUMNS: DataTableColumn<Dessert>[] = [
	{
		label: "Dessert name",
		dataKey: "name",
		verticalHeader: true,
		width: 1.5,
		verticalAlignment: "middle",
		pinning: "left"
	},
	{
		label: "Calories",
		dataKey: "calories",
		sortable: true,
		sortDirections: ["asc", "desc"],
		verticalAlignment: "middle"
	},
	{ label: "Fat (g)", dataKey: "fat", sortable: true, sortDirections: ["asc", "desc"], verticalAlignment: "middle" },
	{
		label: "Carbs (g)",
		dataKey: "carbs",
		sortable: true,
		sortDirections: ["asc", "desc"],
		verticalAlignment: "middle"
	},
	{
		label: "Protein (g)",
		dataKey: "protein",
		sortable: true,
		sortDirections: ["asc", "desc"],
		verticalAlignment: "middle"
	}
];

const CROSS_TAB_DATA: Dessert[] = GROUP_DATA.flatMap((group) => group.subRows);

function CrossTabulationDemo() {
	const [sortedData, setSortedData] = useState(CROSS_TAB_DATA);
	const [sortState, setSortState] = useState<DataTableSortState>([]);

	const onSort = useCallback((next: DataTableSortState, toggled: { columnId: string; order: DataTableSortOrder }) => {
		setSortState(next);

		if (toggled.columnId && toggled.order) {
			const key = toggled.columnId as keyof Dessert;
			const dir = toggled.order === "asc" ? 1 : -1;

			setSortedData([...CROSS_TAB_DATA].sort((a, b) => (a[key] < b[key] ? -dir : a[key] > b[key] ? dir : 0)));
		} else {
			setSortedData(CROSS_TAB_DATA);
		}
	}, []);

	return (
		<DataTable<Dessert>
			ariaLabel="Nutrition cross-tabulation"
			data={sortedData}
			columns={CROSS_TAB_COLUMNS}
			sortOptions={{ sortState, onSort }}
			cellHighlighting
		/>
	);
}

const meta: Meta<typeof RowGroupingDemo> = {
	title: "Data Display/DataTable/Grouping",
	component: RowGroupingDemo,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RowGrouping: Story = {
	name: "Row Grouping",
	render: () => <RowGroupingDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"`DataTableRowsGroup` accepts `data: RowsGroup<RowType>[]`. Provide the `rowGroupHeader` slot to render a collapsible header per group — toggle `group.collapsed` in state to expand/collapse."
			}
		}
	}
};

export const ColumnGrouping: Story = {
	name: "Column Grouping",
	render: () => <ColumnGroupingDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Use `subColumns` on a `DataTableColumn` to nest leaf columns under a group header. The header renders as two rows; the group label spans its leaf columns."
			}
		}
	}
};

export const ColumnGroupResizing: Story = {
	render: () => <ColumnGroupResizingDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Resize handles appear on leaf header cells inside a column group. `columnResizingOptions.onEndResize` reports the new width per leaf column — walk the column tree and update each match via `resizedWidthsGetter` to persist the change."
			}
		}
	}
};

export const CrossTabulation: Story = {
	name: "Cross-tabulation",
	render: () => <CrossTabulationDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Set `verticalHeader: true` on the first column and enable `cellHighlighting` to produce a cross-tabulation layout. Hovering a cell highlights the corresponding row vertical header and column header."
			}
		}
	}
};
