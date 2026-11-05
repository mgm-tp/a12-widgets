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
import type { MouseEvent } from "react";
import { useCallback, useMemo, useState } from "react";

import { Button, HiddenText, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DataTableColumn, DataTableRowExpansion } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable, DataTableTemplate } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Dessert, Employee } from "./data-table.data.js";
import { dessertColumns, DESSERTS, EMPLOYEE_COLUMNS, makeEmployees } from "./data-table.data.js";

interface HistoryEntry {
	date: string;
	customer: string;
	amount: number;
}

interface DessertWithHistory extends Dessert {
	history: HistoryEntry[];
}

const CUSTOMERS = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Heidi"];

const DESSERTS_WITH_HISTORY: DessertWithHistory[] = DESSERTS.slice(0, 5).map((dessert, i) => ({
	...dessert,
	history: Array.from({ length: (i % 2) + 1 }, (_, j) => ({
		date: `2024-0${i + 1}-1${j}`,
		customer: CUSTOMERS[(i * 2 + j) % CUSTOMERS.length],
		amount: i + j + 1
	}))
}));

const HISTORY_COLUMNS: DataTableColumn<HistoryEntry>[] = [
	{ label: "Date", dataKey: "date", width: 1.5, verticalAlignment: "middle" },
	{ label: "Customer", dataKey: "customer", width: 1.5, verticalAlignment: "middle" },
	{ label: "Amount", dataKey: "amount", width: 1, verticalAlignment: "middle" }
];

/**
 * Expansion is consumer state: a `Set` of expanded keys drives both the toggle button's
 * `aria-expanded` and the `rowExpansion.predicate`.
 */
function useExpandedKeys<Key>(): { expanded: Set<Key>; toggle: (key: Key, event: MouseEvent) => void } {
	const [expanded, setExpanded] = useState<Set<Key>>(new Set());

	const toggle = useCallback((key: Key, event: MouseEvent) => {
		event.stopPropagation();
		setExpanded((prev) => {
			const next = new Set(prev);

			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}

			return next;
		});
	}, []);

	return { expanded, toggle };
}

/** The toggle column: a left-pinned action column whose `renderCell` renders the expand button. */
function toggleColumn<Row>(
	hiddenText: string,
	isExpanded: (row: Row) => boolean,
	label: (row: Row) => string,
	toggle: (row: Row, event: MouseEvent) => void
): DataTableColumn<Row> {
	return {
		label: "",
		actionColumn: true,
		pinning: "left",
		width: 0.5,
		renderCell: ({ row }) => {
			const expanded = isExpanded(row);

			return (
				<>
					<HiddenText>{hiddenText}</HiddenText>
					<Button
						icon={<Icon size="big">{expanded ? "keyboard_arrow_down" : "keyboard_arrow_right"}</Icon>}
						title={expanded ? `Collapse ${label(row)}` : `Expand ${label(row)}`}
						onClick={(event) => toggle(row, event)}
						buttonAttributes={{ "aria-expanded": expanded }}
					/>
				</>
			);
		}
	};
}

function ExpandableRowsDemo() {
	const { expanded, toggle } = useExpandedKeys<string>();

	const columns = useMemo<DataTableColumn<DessertWithHistory>[]>(
		() => [
			toggleColumn<DessertWithHistory>(
				"Order history",
				(row) => expanded.has(row.name),
				(row) => row.name,
				(row, event) => toggle(row.name, event)
			),
			...dessertColumns<DessertWithHistory>()
		],
		[expanded, toggle]
	);

	const rowExpansion = useMemo<DataTableRowExpansion<DessertWithHistory>>(
		() => ({
			predicate: ({ row }) => expanded.has(row.name),
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
		[expanded]
	);

	return (
		<DataTable<DessertWithHistory>
			ariaLabel="Desserts with expandable order history"
			data={DESSERTS_WITH_HISTORY}
			columns={columns}
			rowKey="name"
			rowExpansion={rowExpansion}
		/>
	);
}

// A note whose length varies per row, so each expansion panel is a different height —
// the case dynamic-height virtualization (no fixed `rowHeight`) handles.
const NOTE =
	"Joined the team and has since contributed across multiple projects, mentored new hires, and driven several cross-functional initiatives. ";

const MANY_EMPLOYEES = makeEmployees(1000);

function VirtualizedExpandableDemo() {
	const { expanded, toggle } = useExpandedKeys<number>();

	const columns = useMemo<DataTableColumn<Employee>[]>(
		() => [
			toggleColumn<Employee>(
				"Profile details",
				(row) => expanded.has(row.id),
				(row) => `${row.firstName} ${row.lastName}`,
				(row, event) => toggle(row.id, event)
			),
			...EMPLOYEE_COLUMNS
		],
		[expanded, toggle]
	);

	const rowExpansion = useMemo<DataTableRowExpansion<Employee>>(
		() => ({
			// `predicate` skips the render allocation for the (vast) majority of
			// collapsed rows — worthwhile across 1,000 rows.
			predicate: ({ row }) => expanded.has(row.id),
			render: ({ row }) => (
				<DataTableTemplate.ExpandableRow>
					<DataTableTemplate.ExpandableRowBody>
						<div style={{ display: "grid", gap: 12, padding: 12 }}>
							<strong>
								{row.firstName} {row.lastName} — {row.role}, {row.department}
							</strong>
							<span>{NOTE.repeat((row.id % 4) + 1)}</span>
						</div>
					</DataTableTemplate.ExpandableRowBody>
				</DataTableTemplate.ExpandableRow>
			)
		}),
		[expanded]
	);

	return (
		<DataTable<Employee>
			ariaLabel="Virtualized employees with expandable profiles"
			data={MANY_EMPLOYEES}
			columns={columns}
			rowKey="id"
			maxHeight={400}
			// Dynamic-height virtualization (no fixed `rowHeight`): each row is measured
			// from the DOM, so an expanded row reserves its panel's height too.
			virtualScrollOptions={{ estimatedRowHeight: 44 }}
			rowExpansion={rowExpansion}
		/>
	);
}

const meta: Meta<typeof DataTable<DessertWithHistory>> = {
	title: "Data Display/DataTable/Expandable Rows",
	component: DataTable,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const STATEFUL_DEMO = { controls: { disable: true } };

export const ExpandableRows: Story = {
	render: () => <ExpandableRowsDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `// Expansion is consumer state: the same \`Set\` drives the toggle's \`aria-expanded\` and \`predicate\`.
const [expanded, setExpanded] = useState<Set<string>>(new Set());
const toggle = (key: string) =>
	setExpanded((prev) => {
		const next = new Set(prev);
		next.has(key) ? next.delete(key) : next.add(key);
		return next;
	});

const columns: DataTableColumn<DessertWithHistory>[] = [
	{
		label: "",
		actionColumn: true,
		pinning: "left",
		width: 0.5,
		renderCell: ({ row }) => (
			<>
				<HiddenText>Order history</HiddenText>
				<Button
					icon={<Icon size="big">{expanded.has(row.name) ? "keyboard_arrow_down" : "keyboard_arrow_right"}</Icon>}
					title={expanded.has(row.name) ? "Collapse" : "Expand"}
					onClick={(event) => {
						event.stopPropagation();
						toggle(row.name);
					}}
					buttonAttributes={{ "aria-expanded": expanded.has(row.name) }}
				/>
			</>
		)
	},
	...dessertColumns
];

const rowExpansion: DataTableRowExpansion<DessertWithHistory> = {
	predicate: ({ row }) => expanded.has(row.name),
	render: ({ row }) => (
		<DataTableTemplate.ExpandableRow>
			<DataTableTemplate.ExpandableRowBody>
				<DataTable<HistoryEntry> ariaLabel={\`Order history for \${row.name}\`} data={row.history} columns={historyColumns} />
			</DataTableTemplate.ExpandableRowBody>
		</DataTableTemplate.ExpandableRow>
	)
};

<DataTable<DessertWithHistory>
	ariaLabel="Desserts with expandable order history"
	data={desserts}
	columns={columns}
	rowKey="name"
	rowExpansion={rowExpansion}
/>`
			},
			description: {
				story:
					"Use the `rowExpansion` prop — `predicate` marks expanded rows and `render` returns a `DataTableTemplate.ExpandableRow` that spans all columns. The toggle button lives in a pinned action column (a column-level `renderCell`) and mirrors the expansion state via `aria-expanded`."
			}
		}
	}
};

export const Virtualized: Story = {
	name: "Virtualized + Expandable",
	render: () => <VirtualizedExpandableDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `// Expansion is consumer state: the same \`Set\` drives the toggle's \`aria-expanded\` and \`predicate\`.
const [expanded, setExpanded] = useState<Set<number>>(new Set());
const toggle = (key: number) =>
	setExpanded((prev) => {
		const next = new Set(prev);
		next.has(key) ? next.delete(key) : next.add(key);
		return next;
	});

const columns: DataTableColumn<Employee>[] = [
	{
		label: "",
		actionColumn: true,
		pinning: "left",
		width: 0.5,
		renderCell: ({ row }) => (
			<>
				<HiddenText>Profile details</HiddenText>
				<Button
					icon={<Icon size="big">{expanded.has(row.id) ? "keyboard_arrow_down" : "keyboard_arrow_right"}</Icon>}
					title={expanded.has(row.id) ? "Collapse" : "Expand"}
					onClick={(event) => {
						event.stopPropagation();
						toggle(row.id);
					}}
					buttonAttributes={{ "aria-expanded": expanded.has(row.id) }}
				/>
			</>
		)
	},
	...employeeColumns
];

const rowExpansion: DataTableRowExpansion<Employee> = {
	// \`predicate\` skips the render for the (vast) majority of collapsed rows.
	predicate: ({ row }) => expanded.has(row.id),
	render: ({ row }) => (
		<DataTableTemplate.ExpandableRow>
			<DataTableTemplate.ExpandableRowBody>
				<strong>
					{row.firstName} {row.lastName} — {row.role}, {row.department}
				</strong>
			</DataTableTemplate.ExpandableRowBody>
		</DataTableTemplate.ExpandableRow>
	)
};

<DataTable<Employee>
	ariaLabel="Virtualized employees with expandable profiles"
	data={employees}
	columns={columns}
	rowKey="id"
	maxHeight={400}
	// Dynamic-height virtualization: no fixed \`rowHeight\`, so an expanded row's panel is measured.
	virtualScrollOptions={{ estimatedRowHeight: 44 }}
	rowExpansion={rowExpansion}
/>`
			},
			description: {
				story:
					"Row expansion combined with **virtualization** across 1,000 rows. This requires **dynamic-height** virtualization — pass `virtualScrollOptions` *without* `rowHeight` (here `estimatedRowHeight`), so each row is measured from the DOM and an expanded row reserves its panel's height in the scroll math. With a fixed `rowHeight` the panel cannot be measured, so expansion is intentionally suppressed."
			}
		}
	}
};
