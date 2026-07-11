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

import type { RowEventHandlerGetter } from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	DataTableColumn,
	DataTableSortOrder,
	DataTableSortState,
	DataTableRowStyleGetter
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Button, ButtonGroup, Icon, TextField } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "../Table/table.data.js";
import { BASIC_COLUMNS, EMPLOYEES } from "../Table/table.data.js";

const PINNED_COLUMNS: DataTableColumn<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, pinning: "left" },
	{ label: "First Name", dataKey: "firstName", width: 1, sortable: true },
	{ label: "Last Name", dataKey: "lastName", width: 1, sortable: true },
	{ label: "Department", dataKey: "department", width: 1.5 },
	{ label: "Role", dataKey: "role", width: 1.5 },
	{ label: "Status", dataKey: "status", width: 1, pinning: "right" }
];

const ACTION_COLUMNS: DataTableColumn<Employee>[] = [
	...BASIC_COLUMNS,
	{
		label: "",
		actionColumn: true,
		pinning: "right",
		hiddenText: "Actions",
		renderCell: () => (
			<ButtonGroup>
				<Button onClick={(event) => event.stopPropagation()}>Edit</Button>
				<Button destructive onClick={(event) => event.stopPropagation()}>
					Delete
				</Button>
			</ButtonGroup>
		)
	}
];

function BasicDataTableDemo() {
	return <DataTable<Employee> ariaLabel="Employees" data={EMPLOYEES} columns={BASIC_COLUMNS} rowKey="id" />;
}

function SortableDataTableDemo() {
	const [sortedData, setSortedData] = useState<Employee[]>(EMPLOYEES);
	const [sortState, setSortState] = useState<DataTableSortState>([]);

	const onSort = useCallback((next: DataTableSortState, toggled: { columnId: string; order: DataTableSortOrder }) => {
		setSortState(next);

		if (toggled.columnId && toggled.order) {
			const key = toggled.columnId as keyof Employee;
			const direction = toggled.order === "asc" ? 1 : -1;

			setSortedData(
				[...EMPLOYEES].sort((a, b) => {
					const av = a[key];
					const bv = b[key];

					return av < bv ? -direction : av > bv ? direction : 0;
				})
			);
		} else {
			setSortedData(EMPLOYEES);
		}
	}, []);

	return (
		<DataTable<Employee>
			ariaLabel="Sortable employees"
			data={sortedData}
			columns={BASIC_COLUMNS}
			rowKey="id"
			sortOptions={{ sortState, onSort }}
		/>
	);
}

function PinnedColumnsDemo() {
	return (
		<DataTable<Employee>
			ariaLabel="Employees with pinned columns"
			data={EMPLOYEES}
			columns={PINNED_COLUMNS}
			rowKey="id"
			maxHeight={320}
		/>
	);
}

function ActionColumnDemo() {
	return (
		<DataTable<Employee>
			ariaLabel="Employees with action column"
			data={EMPLOYEES}
			columns={ACTION_COLUMNS}
			rowKey="id"
		/>
	);
}

const CARD_VIEW_COLUMNS: DataTableColumn<Employee>[] = [
	{ label: "ID", dataKey: "id" },
	{ label: "First Name", dataKey: "firstName" },
	{ label: "Last Name", dataKey: "lastName" },
	// A non-string (JSX/icon) label — these now render inline in card view.
	{
		label: (
			<span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
				<Icon>badge</Icon>Role
			</span>
		),
		dataKey: "role"
	}
];

function CardViewDemo() {
	return (
		<DataTable<Employee>
			ariaLabel="Employees (card view)"
			data={EMPLOYEES}
			columns={CARD_VIEW_COLUMNS}
			rowKey="id"
			cardView
		/>
	);
}

function EmptyDataTableDemo() {
	return <DataTable<Employee> ariaLabel="Employees" data={[]} columns={BASIC_COLUMNS} rowKey="id" />;
}

function DisabledDataTableDemo() {
	return <DataTable<Employee> ariaLabel="Employees" data={EMPLOYEES} columns={BASIC_COLUMNS} rowKey="id" disabled />;
}

function CellHighlightingDemo() {
	return (
		<DataTable<Employee>
			ariaLabel="Employees with cell highlighting"
			data={EMPLOYEES}
			columns={BASIC_COLUMNS}
			rowKey="id"
			cellHighlighting
		/>
	);
}

type ColumnAlignment = "left" | "center" | "right";

function sortEmployees(data: Employee[], sortState: DataTableSortState): Employee[] {
	const key = sortState[0]?.columnId as keyof Employee | undefined;

	if (!key || !sortState[0]?.order) {
		return data;
	}

	const direction = sortState[0]?.order === "asc" ? 1 : -1;

	return [...data].sort((a, b) => (a[key] < b[key] ? -direction : a[key] > b[key] ? direction : 0));
}

interface PlaygroundArgs {
	cardView: boolean;
	cellHighlighting: boolean;
	disabled: boolean;
	disableArrowNavigation: boolean;
	hideHeader: boolean;
	maxHeight: number;
	columnAlignment: ColumnAlignment;
}

/**
 * Live-toggle the table-level display props from the Controls panel. `columnAlignment`
 * is applied to every column's `horizontalAlignment` to show a column-level prop reacting too.
 */
function PlaygroundDemo({
	cardView,
	cellHighlighting,
	disabled,
	disableArrowNavigation,
	hideHeader,
	maxHeight,
	columnAlignment
}: PlaygroundArgs) {
	const [sortState, setSortState] = useState<DataTableSortState>([]);

	const columns = useMemo<DataTableColumn<Employee>[]>(
		() => BASIC_COLUMNS.map((column) => ({ ...column, horizontalAlignment: columnAlignment })),
		[columnAlignment]
	);

	const data = useMemo(() => sortEmployees(EMPLOYEES, sortState), [sortState]);

	return (
		<DataTable<Employee>
			ariaLabel="DataTable playground"
			data={data}
			columns={columns}
			rowKey="id"
			sortOptions={{ sortState, onSort: (next) => setSortState(next) }}
			cardView={cardView}
			cellHighlighting={cellHighlighting}
			disabled={disabled}
			disableArrowNavigation={disableArrowNavigation}
			hideHeader={hideHeader}
			maxHeight={maxHeight > 0 ? maxHeight : undefined}
		/>
	);
}

type FilterMap = Record<string, string>;

/**
 * A realistic assembly: sortable + pinned columns, an inline filter row, single-row
 * selection, a sticky scroll viewport, and a `<tfoot>` summary — the way a consumer
 * would wire DataTable up in a real screen.
 */
function FullExampleDemo() {
	const [sortState, setSortState] = useState<DataTableSortState>([]);
	const [filters, setFilters] = useState<FilterMap>({});
	const [selectedId, setSelectedId] = useState<number | undefined>();

	const data = useMemo(() => {
		const filtered = EMPLOYEES.filter((row) =>
			Object.entries(filters).every(([key, query]) => {
				if (!query) {
					return true;
				}

				return String(row[key as keyof Employee] ?? "")
					.toLowerCase()
					.includes(query.toLowerCase());
			})
		);

		return sortEmployees(filtered, sortState);
	}, [filters, sortState]);

	const columns = useMemo<DataTableColumn<Employee>[]>(() => {
		const filterCell = (dataKey: string, label: string) => () => (
			<TextField
				label={`Filter ${label}`}
				hideLabel
				value={filters[dataKey] ?? ""}
				onChange={(ev) => setFilters((prev) => ({ ...prev, [dataKey]: ev.target.value }))}
			/>
		);

		return [
			{
				label: "ID",
				dataKey: "id",
				width: 0.4,
				fixedWidth: true,
				pinning: "left",
				renderFooter: () => <strong>Total</strong>
			},
			{
				label: "First Name",
				dataKey: "firstName",
				width: 1,
				sortable: true,
				renderFilter: filterCell("firstName", "first name"),
				renderFooter: () => <span>{data.length} shown</span>
			},
			{
				label: "Last Name",
				dataKey: "lastName",
				width: 1,
				sortable: true,
				renderFilter: filterCell("lastName", "last name")
			},
			{ label: "Department", dataKey: "department", width: 1.5, renderFilter: filterCell("department", "department") },
			{ label: "Role", dataKey: "role", width: 1.5 },
			{ label: "Status", dataKey: "status", width: 1, pinning: "right" }
		];
	}, [filters, data.length]);

	const rowEventHandlers: RowEventHandlerGetter<Employee> = useCallback(
		({ row }) => ({ onClick: () => setSelectedId((prev) => (prev === row.id ? undefined : row.id)) }),
		[]
	);

	const rowStyling: DataTableRowStyleGetter<Employee> = useCallback(
		({ row }) => ({
			selected: selectedId === row.id,
			title: selectedId === row.id ? "Selected" : "Select row"
		}),
		[selectedId]
	);

	return (
		<DataTable<Employee>
			ariaLabel="Employee directory"
			data={data}
			columns={columns}
			rowKey="id"
			maxHeight={360}
			cellHighlighting
			sortOptions={{ sortState, onSort: (next) => setSortState(next) }}
			rowEventHandlers={rowEventHandlers}
			rowStyling={rowStyling}
		/>
	);
}

const meta: Meta<typeof BasicDataTableDemo> = {
	title: "Data Display/DataTable/DataTable",
	component: BasicDataTableDemo,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <BasicDataTableDemo />
};

export const Sortable: Story = {
	name: "Sortable Columns",
	render: () => <SortableDataTableDemo />,
	parameters: {
		docs: {
			description: {
				story: "Click a column header to cycle sort state — ascending → descending → unsorted."
			}
		}
	}
};

export const WithPinnedColumn: Story = {
	name: "Pinned Columns",
	render: () => <PinnedColumnsDemo />,
	parameters: {
		docs: {
			description: {
				story: "Pinned columns use `position: sticky` — no `ColumnWidthSync`, no per-row scroll containers."
			}
		}
	}
};

export const WithActionColumn: Story = {
	name: "Action Column",
	render: () => <ActionColumnDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Action columns auto-size via a `max-content` grid track. Custom body content is provided through the column-level `renderCell` hook."
			}
		}
	}
};

export const CardView: Story = {
	name: "Card View",
	render: () => <CardViewDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"In card view the `<thead>` is hidden and each cell renders its column's `label` inline as a real element. Non-string (`ReactNode`/icon) labels — like the “Role” column here — display correctly and are exposed to assistive technology."
			}
		}
	}
};

export const CellHighlighting: Story = {
	render: () => <CellHighlightingDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Set `cellHighlighting` to highlight the hovered body cell together with its column header (a cross-hair effect). Forced off in card view, when disabled, or when the `<thead>` is hidden."
			}
		}
	}
};

export const Empty: Story = {
	name: "Empty Table",
	render: () => <EmptyDataTableDemo />,
	parameters: {
		docs: {
			description: {
				story: "With `data={[]}` the header still renders and the body is empty."
			}
		}
	}
};

export const Disabled: Story = {
	name: "Disabled Table",
	render: () => <DisabledDataTableDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"The `disabled` prop applies a disabled visual state and suppresses all event handlers — `rowStyling`/`cellStyling` and `cellHighlighting` are also inactive while disabled."
			}
		}
	}
};

export const Playground: StoryObj<typeof PlaygroundDemo> = {
	render: (args) => <PlaygroundDemo {...args} />,
	args: {
		cardView: false,
		cellHighlighting: false,
		disabled: false,
		disableArrowNavigation: false,
		hideHeader: false,
		maxHeight: 0,
		columnAlignment: "left"
	},
	argTypes: {
		cardView: {
			control: "boolean",
			description: "Render rows as stacked cards; hides the header and forces `cellHighlighting` off."
		},
		cellHighlighting: {
			control: "boolean",
			description:
				"Highlight the hovered cell together with its column header. Inactive in card view, when disabled, or when the header is hidden."
		},
		disabled: { control: "boolean", description: "Apply a disabled visual state and suppress all event handlers." },
		disableArrowNavigation: {
			control: "boolean",
			description: "Turn off row-level arrow-key navigation (ArrowUp/ArrowDown move focus between body rows)."
		},
		hideHeader: { control: "boolean", description: "Hide the `<thead>` entirely." },
		maxHeight: {
			control: { type: "range", min: 0, max: 400, step: 20 },
			description: "Scroll-viewport height in px (0 = unset, table grows to natural height)."
		},
		columnAlignment: {
			control: "inline-radio",
			options: ["left", "center", "right"],
			description: "Applied to every column's `horizontalAlignment`."
		}
	},
	parameters: {
		docs: {
			description: {
				story:
					"Flip the table-level display props live from the **Controls** panel to feel how each behaves — and how some combine (e.g. `cellHighlighting` goes inactive once `cardView`, `hideHeader`, or `disabled` is on). The table stays sortable throughout."
			}
		}
	}
};

export const FullExample: Story = {
	render: () => <FullExampleDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"A realistic, copy-paste assembly combining the features that ship as isolated stories elsewhere: sortable headers, left/right **pinned** columns, an inline **filter row**, single-row **selection**, a sticky scroll viewport (`maxHeight`), `cellHighlighting`, and a `<tfoot>` summary that reflects the filtered count."
			}
		}
	}
};
