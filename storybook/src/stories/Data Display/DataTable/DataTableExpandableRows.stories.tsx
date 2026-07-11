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

import { useCallback, useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { DataTableColumn, DataTableRowExpansion } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Button, HiddenText, Icon, Pagination } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable, DataTableTemplate } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

interface HistoryEntry {
	date: string;
	customer: string;
	amount: number;
}

interface Dessert {
	name: string;
	calories: number;
	fat: number;
	carbs: number;
	protein: number;
	history: HistoryEntry[];
}

const DESSERTS: Dessert[] = [
	{
		name: "Frozen yoghurt",
		calories: 159,
		fat: 6.0,
		carbs: 24,
		protein: 4.0,
		history: [
			{ date: "2024-01-10", customer: "Alice", amount: 2 },
			{ date: "2024-02-14", customer: "Bob", amount: 1 }
		]
	},
	{
		name: "Ice cream sandwich",
		calories: 237,
		fat: 9.0,
		carbs: 37,
		protein: 4.3,
		history: [
			{ date: "2024-01-15", customer: "Carol", amount: 3 },
			{ date: "2024-03-01", customer: "Dave", amount: 2 }
		]
	},
	{
		name: "Eclair",
		calories: 262,
		fat: 16.0,
		carbs: 24,
		protein: 6.0,
		history: [{ date: "2024-02-20", customer: "Eve", amount: 5 }]
	},
	{
		name: "Cupcake",
		calories: 305,
		fat: 3.7,
		carbs: 67,
		protein: 4.3,
		history: [
			{ date: "2024-01-05", customer: "Frank", amount: 4 },
			{ date: "2024-04-12", customer: "Grace", amount: 1 }
		]
	},
	{
		name: "Gingerbread",
		calories: 356,
		fat: 16.0,
		carbs: 49,
		protein: 3.9,
		history: [{ date: "2024-03-22", customer: "Heidi", amount: 6 }]
	}
];

const HISTORY_COLUMNS: DataTableColumn<HistoryEntry>[] = [
	{ label: "Date", dataKey: "date", width: 1.5, verticalAlignment: "middle" },
	{ label: "Customer", dataKey: "customer", width: 1.5, verticalAlignment: "middle" },
	{ label: "Amount", dataKey: "amount", width: 1, verticalAlignment: "middle" }
];

const DESSERT_DATA_COLUMNS: DataTableColumn<Dessert>[] = [
	{ label: "Name", dataKey: "name", width: 2, verticalAlignment: "middle", pinning: "left" },
	{ label: "Calories", dataKey: "calories", width: 1, verticalAlignment: "middle" },
	{ label: "Fat (g)", dataKey: "fat", width: 1, verticalAlignment: "middle" },
	{ label: "Carbs (g)", dataKey: "carbs", width: 1, verticalAlignment: "middle" },
	{ label: "Protein (g)", dataKey: "protein", width: 1, verticalAlignment: "middle" }
];

function ExpandableRowsDemo() {
	const [expandedRows, setExpandedRows] = useState<Set<Dessert>>(new Set());

	const toggleRow = useCallback((row: Dessert, event: React.MouseEvent) => {
		event.stopPropagation();
		setExpandedRows((prev) => {
			const next = new Set(prev);

			next.has(row) ? next.delete(row) : next.add(row);

			return next;
		});
	}, []);

	const columns = useMemo<DataTableColumn<Dessert>[]>(
		() => [
			{
				label: "",
				dataKey: "expand",
				actionColumn: true,
				pinning: "left",
				width: 0.5,
				renderCell: ({ row }) => {
					const isExpanded = expandedRows.has(row);

					return (
						<>
							<HiddenText>Order history</HiddenText>
							<Button
								icon={<Icon size="big">{isExpanded ? "keyboard_arrow_down" : "keyboard_arrow_right"}</Icon>}
								title={isExpanded ? `Collapse ${row.name}` : `Expand ${row.name}`}
								onClick={(e) => toggleRow(row, e)}
								buttonAttributes={{ "aria-expanded": isExpanded }}
							/>
						</>
					);
				}
			},
			...DESSERT_DATA_COLUMNS
		],
		[expandedRows, toggleRow]
	);

	const rowExpansion = useMemo<DataTableRowExpansion<Dessert>>(
		() => ({
			predicate: ({ row }) => expandedRows.has(row),
			render: ({ row }) => (
				<DataTableTemplate.ExpandableRow>
					<DataTableTemplate.ExpandableRowBody>
						<DataTable<HistoryEntry>
							ariaLabel={`Order history for ${row.name}`}
							data={row.history}
							columns={HISTORY_COLUMNS}
						/>
					</DataTableTemplate.ExpandableRowBody>
				</DataTableTemplate.ExpandableRow>
			)
		}),
		[expandedRows]
	);

	return (
		<DataTable<Dessert>
			ariaLabel="Desserts with expandable order history"
			data={DESSERTS}
			columns={columns}
			rowKey="name"
			rowExpansion={rowExpansion}
		/>
	);
}

function sumOf(key: keyof Pick<Dessert, "calories" | "fat" | "carbs" | "protein">): number {
	const sum = DESSERTS.reduce((acc, row) => acc + row[key], 0);

	return Math.round(sum * 10) / 10;
}

const FOOT_COLUMNS: DataTableColumn<Dessert>[] = [
	{
		label: "Name",
		dataKey: "name",
		width: 2,
		verticalAlignment: "middle",
		pinning: "left",
		renderFooter: () => <strong>Total ({DESSERTS.length} items)</strong>
	},
	{
		label: "Calories",
		dataKey: "calories",
		width: 1,
		verticalAlignment: "middle",
		renderFooter: () => <strong>{sumOf("calories")}</strong>
	},
	{
		label: "Fat (g)",
		dataKey: "fat",
		width: 1,
		verticalAlignment: "middle",
		renderFooter: () => <strong>{sumOf("fat")}</strong>
	},
	{
		label: "Carbs (g)",
		dataKey: "carbs",
		width: 1,
		verticalAlignment: "middle",
		renderFooter: () => <strong>{sumOf("carbs")}</strong>
	},
	{
		label: "Protein (g)",
		dataKey: "protein",
		width: 1,
		verticalAlignment: "middle",
		renderFooter: () => <strong>{sumOf("protein")}</strong>
	}
];

function WithFooterDemo() {
	return (
		<DataTable<Dessert> ariaLabel="Desserts with footer totals" data={DESSERTS} columns={FOOT_COLUMNS} rowKey="name" />
	);
}

interface PageEmployee {
	id: number;
	name: string;
	department: string;
	role: string;
}

const PAGE_EMPLOYEES: PageEmployee[] = Array.from({ length: 12 }, (_, i) => ({
	id: i + 1,
	name: `Employee ${i + 1}`,
	department: ["Engineering", "Sales", "Marketing", "Finance"][i % 4],
	role: ["Engineer", "Manager", "Designer", "Analyst"][i % 4]
}));

const PAGE_COLUMNS: DataTableColumn<PageEmployee>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, verticalAlignment: "middle", pinning: "left" },
	{ label: "Name", dataKey: "name", width: 1.5, verticalAlignment: "middle", pinning: "left" },
	{ label: "Department", dataKey: "department", width: 1.5, verticalAlignment: "middle" },
	{ label: "Role", dataKey: "role", width: 1.5, verticalAlignment: "middle" }
];

const PAGE_SIZE = 5;

function WithPaginationDemo() {
	const [currentPage, setCurrentPage] = useState(1);
	const pageCount = Math.ceil(PAGE_EMPLOYEES.length / PAGE_SIZE);

	const paged = useMemo(
		() => PAGE_EMPLOYEES.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
		[currentPage]
	);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<DataTable<PageEmployee> ariaLabel="Paged employees" data={paged} columns={PAGE_COLUMNS} rowKey="id" />
			<Pagination
				alignment="right"
				currentPage={currentPage}
				pageCount={pageCount}
				pageLabelTemplate="{page} / {total}"
				onPageChanged={setCurrentPage}
			/>
		</div>
	);
}

const meta: Meta<typeof ExpandableRowsDemo> = {
	title: "Data Display/DataTable/Expandable Rows",
	component: ExpandableRowsDemo,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ExpandableRows: Story = {
	name: "Expandable Rows",
	render: () => <ExpandableRowsDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Use the `rowExpansion` prop — `predicate` marks expanded rows and `render` returns a `DataTableTemplate.ExpandableRow` that spans all columns via `grid-column: 1 / -1`. The toggle button in the pinned action column (a column-level `renderCell`) controls expansion."
			}
		}
	}
};

export const WithFooter: Story = {
	name: "With Footer",
	render: () => <WithFooterDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Provide `renderFooter` on a column to render its summary inside the `<tfoot>` — the footer activates automatically when any column has `renderFooter`. The footer aligns with body columns via data-table."
			}
		}
	}
};

export const WithPagination: Story = {
	name: "With Pagination",
	render: () => <WithPaginationDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Pagination is external to the table — slice `data` based on the current page and drive `Pagination` via `currentPage` / `onPageChanged`."
			}
		}
	}
};
