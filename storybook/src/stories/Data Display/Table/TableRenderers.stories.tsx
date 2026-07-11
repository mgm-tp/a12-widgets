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

import type {
	BaseColumnType,
	RowEventHandlerGetter,
	RowStyleGetter,
	TableRenderPropsType,
	TableTemplateProps
} from "@com.mgmtp.a12.widgets/widgets-core";
import { Table, Icon, Button, ButtonGroup, List, Status, getDataByKey } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Employee } from "./table.data.js";
import { EMPLOYEES, BASIC_COLUMNS } from "./table.data.js";

const COLUMNS_WITH_STATUS: BaseColumnType<Employee>[] = [
	...BASIC_COLUMNS,
	{ label: "Status", dataKey: "status", width: 1, verticalAlignment: "middle" }
];

const COLUMNS_WITH_ACTIONS: BaseColumnType<Employee>[] = [
	...COLUMNS_WITH_STATUS,
	{ label: "", dataKey: "", pinning: "right", actionColumn: true, horizontalAlignment: "center" }
];

// ---------------------------------------------------------------------------
// Status Column
// ---------------------------------------------------------------------------

function StatusColumnDemo() {
	const bodyContentRenderer = useCallback(
		({ column, row }: { column: BaseColumnType<Employee>; row: Employee }): ReactNode => {
			if (column.dataKey === "status") {
				const variant = row.status === "Active" ? "success" : "warning";

				return <Status variant={variant}>{row.status}</Status>;
			}

			return getDataByKey(row, column.dataKey ?? "") as string;
		},
		[]
	);

	return (
		<Table<Employee> data={EMPLOYEES} columns={COLUMNS_WITH_STATUS} componentRenderers={{ bodyContentRenderer }} />
	);
}

// ---------------------------------------------------------------------------
// Action Column
// ---------------------------------------------------------------------------

function ActionColumnDemo() {
	const bodyContentRenderer = useCallback(
		({ column, row }: { column: BaseColumnType<Employee>; row: Employee }): ReactNode => {
			if (column.actionColumn) {
				return (
					<ButtonGroup>
						<Button
							icon={<Icon>edit</Icon>}
							title={`Edit ${row.firstName} ${row.lastName}`}
							onClick={(e) => e.stopPropagation()}
						/>
						<Button
							destructive
							icon={<Icon>delete</Icon>}
							title={`Delete ${row.firstName} ${row.lastName}`}
							onClick={(e) => e.stopPropagation()}
						/>
					</ButtonGroup>
				);
			}

			if (column.dataKey === "status") {
				return <Status variant={row.status === "Active" ? "success" : "warning"}>{row.status}</Status>;
			}

			return getDataByKey(row, column.dataKey ?? "") as string;
		},
		[]
	);

	return (
		<Table<Employee> data={EMPLOYEES} columns={COLUMNS_WITH_ACTIONS} componentRenderers={{ bodyContentRenderer }} />
	);
}

// ---------------------------------------------------------------------------
// Row Highlighting
// ---------------------------------------------------------------------------

function RowHighlightingDemo() {
	const rowStyling = useCallback(
		({ row }: { row: Employee }) => ({
			highlighted: row.status !== "Active",
			highlightVariant: "info" as TableTemplateProps.TableHighlightVariant
		}),
		[]
	);

	return <Table<Employee> data={EMPLOYEES} columns={COLUMNS_WITH_STATUS} rowStyling={rowStyling} />;
}

// ---------------------------------------------------------------------------
// Multi-row Selection
// ---------------------------------------------------------------------------

function MultiSelectionDemo() {
	const [selected, setSelected] = useState<Set<number>>(new Set());

	const rowStyling = useCallback(
		({ row }: { row: Employee }) => ({
			selected: selected.has(row.id),
			interactive: true,
			title: selected.has(row.id) ? "Deselect row" : "Select row"
		}),
		[selected]
	);

	const rowEventHandlers = useCallback(
		({ row }: { row: Employee }) => ({
			onClick: () =>
				setSelected((prev) => {
					const next = new Set(prev);

					next.has(row.id) ? next.delete(row.id) : next.add(row.id);

					return next;
				})
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

// ---------------------------------------------------------------------------
// Cell Styling
// ---------------------------------------------------------------------------

function CellStylingDemo() {
	const cellStyling = useCallback(
		({ row, column }: { row: Employee; column: BaseColumnType<Employee> }) => ({
			useSecondaryColor: column.dataKey === "role" && row.status !== "Active"
		}),
		[]
	);

	return <Table<Employee> data={EMPLOYEES} columns={COLUMNS_WITH_STATUS} cellStyling={cellStyling} />;
}

interface Transaction {
	id: number;
	name: string;
	amount: string;
	date: string;
	status: string;
}

const TRANSACTIONS: Transaction[] = [
	{ id: 1, name: "Office supplies", amount: "$124.50", date: "2024-01-10", status: "Paid" },
	{ id: 2, name: "Software license", amount: "$299.00", date: "2024-01-15", status: "Paid" },
	{ id: 3, name: "Travel expenses", amount: "$580.00", date: "2024-02-01", status: "Pending" },
	{ id: 4, name: "Equipment rental", amount: "$750.00", date: "2024-02-10", status: "Pending" },
	{ id: 5, name: "Catering", amount: "$220.00", date: "2024-03-05", status: "Paid" }
];

const TRANSACTION_COLUMNS: BaseColumnType<Transaction>[] = [
	{ label: "Name", dataKey: "name", width: 2, verticalAlignment: "middle" },
	{ label: "Amount", dataKey: "amount", width: 1, verticalAlignment: "middle" },
	{ label: "Date", dataKey: "date", width: 1.5, verticalAlignment: "middle" },
	{ label: "Status", dataKey: "status", width: 1, verticalAlignment: "middle" }
];

function ContextMenuDemo() {
	const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

	const rowStyling: RowStyleGetter<Transaction> = useCallback(
		({ rowIndex }) => ({
			selected: selectedIndex === rowIndex
		}),
		[selectedIndex]
	);

	const rowEventHandlers: RowEventHandlerGetter<Transaction> = useCallback(
		({ rowIndex }) => ({
			onClick: () => setSelectedIndex((prev) => (prev === rowIndex ? undefined : rowIndex))
		}),
		[]
	);

	const contextMenuRenderer = useCallback(
		({ closeHandler, row, rowIndex }: TableRenderPropsType.ContextMenuProps<Transaction>): ReactNode => (
			<List border paddedRight>
				<List.Item
					text="Edit"
					graphic={<Icon>edit</Icon>}
					onClick={() => {
						alert(`Edit: ${row.name} (row ${rowIndex})`);
						closeHandler?.();
					}}
				/>
				<List.Item
					text="Copy"
					graphic={<Icon>content_copy</Icon>}
					onClick={() => {
						alert(`Copy: ${row.name}`);
						closeHandler?.();
					}}
				/>
				<List.Item
					text="Delete"
					graphic={<Icon>delete</Icon>}
					onClick={() => {
						alert(`Delete: ${row.name}`);
						closeHandler?.();
					}}
				/>
			</List>
		),
		[]
	);

	const headContextMenuRenderer = useCallback(
		({ closeHandler, column }: TableRenderPropsType.HeadContextMenuProps<BaseColumnType<Transaction>>): ReactNode => (
			<List border paddedRight>
				<List.Item
					text="Sort ascending"
					graphic={<Icon>arrow_upward</Icon>}
					onClick={() => {
						alert(`Sort ascending: ${column?.dataKey}`);
						closeHandler?.();
					}}
				/>
				<List.Item
					text="Sort descending"
					graphic={<Icon>arrow_downward</Icon>}
					onClick={() => {
						alert(`Sort descending: ${column?.dataKey}`);
						closeHandler?.();
					}}
				/>
				<List.Item
					text="Hide column"
					graphic={<Icon>visibility_off</Icon>}
					onClick={() => {
						alert(`Hide: ${column?.dataKey}`);
						closeHandler?.();
					}}
				/>
			</List>
		),
		[]
	);

	const bodyContentRenderer = useCallback(
		({ column, row }: TableRenderPropsType.BodyContentProps<Transaction>): ReactNode => {
			if (column.dataKey === "status") {
				return <Status variant={row.status === "Paid" ? "success" : "warning"}>{row.status}</Status>;
			}

			return getDataByKey(row, column.dataKey ?? "") as string;
		},
		[]
	);

	return (
		<Table<Transaction>
			data={TRANSACTIONS}
			columns={TRANSACTION_COLUMNS}
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
			componentRenderers={{ bodyContentRenderer, contextMenuRenderer, headContextMenuRenderer }}
		/>
	);
}

const meta: Meta = {
	title: "Data Display/Table/Table Renderers",
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithStatusColumn: Story = {
	name: "With Status Column",
	render: () => <StatusColumnDemo />,
	parameters: {
		docs: {
			description: { story: "A custom `bodyContentRenderer` displays a Status badge in the status column." }
		}
	}
};

export const WithActionColumn: Story = {
	name: "With Action Column",
	render: () => <ActionColumnDemo />,
	parameters: {
		docs: {
			description: { story: "Pinned right action column with Edit and Delete icon buttons per row." }
		}
	}
};

export const RowHighlighting: Story = {
	name: "Row Highlighting",
	render: () => <RowHighlightingDemo />,
	parameters: {
		docs: {
			description: {
				story:
					'Use `rowStyling` with `highlighted: true` and a `highlightVariant` (`"success"` | `"info"`) to draw attention to specific rows.'
			}
		}
	}
};

export const MultiSelection: Story = {
	name: "Multi-row Selection",
	render: () => <MultiSelectionDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Track a `Set` of selected row ids and reflect selection state via `rowStyling`. Click rows to toggle selection."
			}
		}
	}
};

export const CellStyling: Story = {
	name: "Cell Styling",
	render: () => <CellStylingDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Use `cellStyling` with `useSecondaryColor: true` to visually de-emphasise specific cells — here the Role column is dimmed for non-active employees."
			}
		}
	}
};

export const WithContextMenu: Story = {
	name: "Context Menu",
	render: () => <ContextMenuDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Supply `contextMenuRenderer` to show a right-click popup menu on body rows, and `headContextMenuRenderer` for column headers. Both receive a `closeHandler` to dismiss the menu after an action."
			}
		}
	}
};
