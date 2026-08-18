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

import type { ReactNode } from "react";
import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { BaseColumnType, TableRenderPropsType } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Button,
	DefaultTableComponentRenderers,
	getDataByKey,
	HiddenText,
	Icon,
	Table,
	TableTemplate
} from "@com.mgmtp.a12.widgets/widgets-core";

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

const HISTORY_COLUMNS: BaseColumnType<HistoryEntry>[] = [
	{ label: "Date", dataKey: "date", width: 1.5, verticalAlignment: "middle" },
	{ label: "Customer", dataKey: "customer", width: 1.5, verticalAlignment: "middle" },
	{ label: "Amount", dataKey: "amount", width: 1, verticalAlignment: "middle" }
];

const DESSERT_COLUMNS: BaseColumnType<Dessert>[] = [
	{ label: "", dataKey: "expand", actionColumn: true, pinning: "left", width: 0.5 },
	{ label: "Name", dataKey: "name", width: 2, verticalAlignment: "middle" },
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

	const bodyContentRenderer = useCallback(
		({ column, row }: TableRenderPropsType.BodyContentProps<Dessert>): ReactNode => {
			if (column.actionColumn) {
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

			return getDataByKey(row, column.dataKey ?? "") as string;
		},
		[expandedRows, toggleRow]
	);

	const additionalContentRenderer = useCallback(
		({ row }: TableRenderPropsType.BodyRowProps<Dessert>): ReactNode => {
			if (!expandedRows.has(row)) {
				return null;
			}

			return (
				<TableTemplate.BodyRow>
					<TableTemplate.ExpandableRow>
						<TableTemplate.ExpandableRowBody>
							<Table<HistoryEntry>
								data={row.history}
								columns={HISTORY_COLUMNS}
								componentRenderers={{
									bodyContentRenderer: DefaultTableComponentRenderers.bodyContentRenderer
								}}
							/>
						</TableTemplate.ExpandableRowBody>
					</TableTemplate.ExpandableRow>
				</TableTemplate.BodyRow>
			);
		},
		[expandedRows]
	);

	return (
		<Table<Dessert>
			data={DESSERTS}
			columns={DESSERT_COLUMNS}
			componentRenderers={{ bodyContentRenderer, additionalContentRenderer }}
		/>
	);
}

const FOOT_COLUMNS: BaseColumnType<Dessert>[] = [
	{ label: "Name", dataKey: "name", width: 2, verticalAlignment: "middle" },
	{ label: "Calories", dataKey: "calories", width: 1, verticalAlignment: "middle" },
	{ label: "Fat (g)", dataKey: "fat", width: 1, verticalAlignment: "middle" },
	{ label: "Carbs (g)", dataKey: "carbs", width: 1, verticalAlignment: "middle" },
	{ label: "Protein (g)", dataKey: "protein", width: 1, verticalAlignment: "middle" }
];

function WithFooterDemo() {
	const footContentRenderer = useCallback(
		({ column }: TableRenderPropsType.FootContentProps<BaseColumnType<Dessert>>): ReactNode => {
			if (column.dataKey === "name") {
				return <strong>Total ({DESSERTS.length} items)</strong>;
			}

			const key = column.dataKey as keyof Dessert;

			if (key && key !== "history") {
				const sum = DESSERTS.reduce((acc, row) => acc + (row[key] as number), 0);

				return <strong>{Math.round(sum * 10) / 10}</strong>;
			}

			return null;
		},
		[]
	);

	const footRowRenderer = useCallback(
		(props?: TableRenderPropsType.FootRowProps): ReactNode =>
			DefaultTableComponentRenderers.footRowRenderer({ ...props, useHighlightColor: true }),
		[]
	);

	return (
		<Table<Dessert>
			data={DESSERTS}
			columns={FOOT_COLUMNS}
			hasFootContent
			componentRenderers={{ footContentRenderer, footRowRenderer }}
		/>
	);
}

function WithHeaderFilterDemo() {
	const [filterValues, setFilterValues] = useState<Record<string, string>>({});
	const [filteredData, setFilteredData] = useState(DESSERTS);

	const handleFilterChange = useCallback((dataKey: string, value: string) => {
		setFilterValues((prev) => {
			const next = { ...prev, [dataKey]: value };

			setFilteredData(
				DESSERTS.filter((row) =>
					Object.entries(next).every(([key, filter]) => {
						if (!filter) {
							return true;
						}

						const cell = row[key as keyof Dessert];

						return String(cell).toLowerCase().includes(filter.toLowerCase());
					})
				)
			);

			return next;
		});
	}, []);

	const headFilterContentRenderer = useCallback(
		({ column }: TableRenderPropsType.HeadContentProps<BaseColumnType<Dessert>>): ReactNode => {
			if (column.actionColumn || !column.dataKey) {
				return null;
			}

			return (
				<input
					aria-label={`Filter by ${column.dataKey}`}
					value={filterValues[column.dataKey] ?? ""}
					onChange={(e) => handleFilterChange(column.dataKey as string, e.target.value)}
					style={{ width: "100%", boxSizing: "border-box", padding: "2px 4px", fontSize: "12px" }}
				/>
			);
		},
		[filterValues, handleFilterChange]
	);

	const bodyContentRenderer = useCallback(
		({ column, row }: TableRenderPropsType.BodyContentProps<Dessert>): ReactNode =>
			getDataByKey(row, column.dataKey ?? "") as string,
		[]
	);

	return (
		<Table<Dessert>
			data={filteredData}
			columns={FOOT_COLUMNS}
			componentRenderers={{ headFilterContentRenderer, bodyContentRenderer }}
		/>
	);
}

const meta: Meta = {
	title: "Data Display/Table/Table Expandable Rows",
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
					"Use `additionalContentRenderer` with `TableTemplate.BodyRow` + `TableTemplate.ExpandableRow` to toggle a nested detail panel per row. The action column button controls expand/collapse via `aria-expanded`."
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
					"Set `hasFootContent` and supply `footContentRenderer` to render column summaries. Use `footRowRenderer` with `useHighlightColor` to style the footer row."
			}
		}
	}
};

export const WithHeaderFilter: Story = {
	name: "Header Filter Row",
	render: () => <WithHeaderFilterDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Supply `headFilterContentRenderer` to render a filter input inside each column header. Filter logic is handled externally by updating the `data` prop."
			}
		}
	}
};
