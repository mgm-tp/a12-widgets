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
import type { ReactNode } from "react";
import { useState, useCallback, useEffect } from "react";

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

interface VirtualEmployee {
	id: number;
	name: string;
	department: string;
	role: string;
	note: string;
}

const VIRTUAL_DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Finance", "HR"];
const VIRTUAL_ROLES = ["Engineer", "Manager", "Designer", "Analyst", "Recruiter"];

// A note whose length varies per row, so each expansion panel is a different height —
// the case that needs `measureRowHeight` to keep the virtualizer's row heights correct.
const VIRTUAL_NOTE =
	"Joined the team and has since contributed across multiple projects, mentored new hires, and driven several cross-functional initiatives. ";

const VIRTUAL_EMPLOYEES: VirtualEmployee[] = Array.from({ length: 1000 }, (_, i) => ({
	id: i + 1,
	name: `Employee ${i + 1}`,
	department: VIRTUAL_DEPARTMENTS[i % VIRTUAL_DEPARTMENTS.length],
	role: VIRTUAL_ROLES[i % VIRTUAL_ROLES.length],
	note: VIRTUAL_NOTE.repeat((i % 4) + 1)
}));

const VIRTUAL_COLUMNS: BaseColumnType<VirtualEmployee>[] = [
	{ label: "", dataKey: "expand", actionColumn: true, pinning: "left", width: 0.5 },
	{ label: "ID", dataKey: "id", width: 0.5, fixedWidth: true, verticalAlignment: "middle" },
	{ label: "Name", dataKey: "name", width: 1.5, verticalAlignment: "middle" },
	{ label: "Department", dataKey: "department", width: 1.2, verticalAlignment: "middle" },
	{ label: "Role", dataKey: "role", width: 1.2, verticalAlignment: "middle" }
];

/**
 * Wraps the expanded content and pings `measureRowHeight` whenever it mounts or
 * unmounts, so react-virtualized recomputes the (now taller / shorter) row height
 * and keeps the windowed rows and scrollbar aligned.
 */
function MeasuredExpansion({ measure, children }: { measure?: () => void; children: ReactNode }) {
	useEffect(() => {
		measure?.();

		// Defer the collapse re-measure: react-virtualized's CellMeasurer reads the
		// row's natural height, so it must run *after* the panel is removed and the
		// row has reflowed. Measuring synchronously would re-read the still-expanded
		// height and ratchet the cached row height, leaving blank space.
		return () => {
			setTimeout(() => measure?.(), 10);
		};
	}, [measure]);

	return <>{children}</>;
}

function VirtualizedExpandableDemo() {
	const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

	const toggleRow = useCallback((row: VirtualEmployee, event: React.MouseEvent) => {
		event.stopPropagation();
		setExpandedIds((prev) => {
			const next = new Set(prev);

			next.has(row.id) ? next.delete(row.id) : next.add(row.id);

			return next;
		});
	}, []);

	const bodyContentRenderer = useCallback(
		({ column, row }: TableRenderPropsType.BodyContentProps<VirtualEmployee>): ReactNode => {
			if (column.actionColumn) {
				const isExpanded = expandedIds.has(row.id);

				return (
					<>
						<HiddenText>Profile details</HiddenText>
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
		[expandedIds, toggleRow]
	);

	const additionalContentRenderer = useCallback(
		({ row, measureRowHeight }: TableRenderPropsType.BodyRowProps<VirtualEmployee>): ReactNode => {
			if (!expandedIds.has(row.id)) {
				return null;
			}

			return (
				<TableTemplate.BodyRow>
					<TableTemplate.ExpandableRow>
						<TableTemplate.ExpandableRowBody>
							<MeasuredExpansion measure={measureRowHeight}>
								<div style={{ display: "grid", gap: 12, padding: 12, minHeight: 200 }}>
									<strong>
										{row.name} — {row.role}, {row.department}
									</strong>
									<div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
										<div>
											<em>Employee ID</em>
											<div>{row.id}</div>
										</div>
										<div>
											<em>Department</em>
											<div>{row.department}</div>
										</div>
										<div>
											<em>Role</em>
											<div>{row.role}</div>
										</div>
										<div>
											<em>Status</em>
											<div>Active</div>
										</div>
									</div>
									<span>{row.note}</span>
								</div>
							</MeasuredExpansion>
						</TableTemplate.ExpandableRowBody>
					</TableTemplate.ExpandableRow>
				</TableTemplate.BodyRow>
			);
		},
		[expandedIds]
	);

	return (
		<div style={{ height: 400 }}>
			<Table<VirtualEmployee>
				data={VIRTUAL_EMPLOYEES}
				columns={VIRTUAL_COLUMNS}
				rowKey="id"
				virtualScrollOptions
				componentRenderers={{ bodyContentRenderer, additionalContentRenderer }}
				style={{ height: "100%" }}
			/>
		</div>
	);
}

const meta: Meta = {
	title: "Data Display/Table/Table Expandable Rows",
	parameters: { layout: "padded" }
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

export const Virtualized: Story = {
	name: "Virtualized + Expandable",
	render: () => <VirtualizedExpandableDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Legacy `Table` counterpart to DataTable's *Virtualized + Expandable* story, for side-by-side comparison. Expansion is wired through `componentRenderers.additionalContentRenderer`; because the panels have varying heights, the renderer calls the `measureRowHeight` callback (here on mount/unmount via `MeasuredExpansion`) so react-virtualized recomputes the affected row's height. The table needs an explicit container height. Expand a few rows, then scroll to compare windowing/alignment behavior against the new DataTable."
			}
		}
	}
};
