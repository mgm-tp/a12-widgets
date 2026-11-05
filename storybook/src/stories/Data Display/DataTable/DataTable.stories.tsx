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
import { useMemo, useState } from "react";

import { Button, ButtonGroup, Icon, Pagination, TextField } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DataTableColumn, DataTableProps } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "./data-table.data.js";
import { BASIC_COLUMNS, EMPLOYEES, EMPLOYEE_COLUMNS, makeEmployees } from "./data-table.data.js";
import { useRowSelection, useSortedRows } from "./data-table.helpers.js";

const PINNED_COLUMNS: DataTableColumn<Employee>[] = EMPLOYEE_COLUMNS.map((column) =>
	column.dataKey === "status" ? { ...column, pinning: "right" } : column
);

function SortableDataTableDemo() {
	const { rows, sortOptions } = useSortedRows(EMPLOYEES);

	return (
		<DataTable<Employee>
			ariaLabel="Sortable employees"
			data={rows}
			columns={BASIC_COLUMNS}
			rowKey="id"
			sortOptions={sortOptions}
		/>
	);
}

const CARD_VIEW_COLUMNS: DataTableColumn<Employee>[] = [
	{ label: "ID", dataKey: "id" },
	{ label: "First Name", dataKey: "firstName" },
	{ label: "Last Name", dataKey: "lastName" },
	// A non-string (JSX/icon) label — card view renders these inline too.
	{
		label: (
			<span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
				<Icon>badge</Icon>Role
			</span>
		),
		dataKey: "role"
	}
];

const employeeKey = (row: Employee) => row.id;

function CardViewInteractiveDemo() {
	const { rowEventHandlers, rowStyling } = useRowSelection(employeeKey, { initial: [EMPLOYEES[1]?.id] });

	return (
		<DataTable<Employee>
			ariaLabel="Employees (card view, selectable)"
			data={EMPLOYEES}
			columns={CARD_VIEW_COLUMNS}
			rowKey="id"
			cardView
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
		/>
	);
}

const PAGED_EMPLOYEES = makeEmployees(12);
const PAGE_SIZE = 5;

function WithPaginationDemo() {
	const [currentPage, setCurrentPage] = useState(1);
	const pageCount = Math.ceil(PAGED_EMPLOYEES.length / PAGE_SIZE);

	const paged = useMemo(
		() => PAGED_EMPLOYEES.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
		[currentPage]
	);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<DataTable<Employee> ariaLabel="Paged employees" data={paged} columns={BASIC_COLUMNS} rowKey="id" />
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

type ColumnAlignment = "left" | "center" | "right";

interface PlaygroundArgs {
	cardView: boolean;
	cellHighlighting: boolean;
	disabled: boolean;
	disableArrowNavigation: boolean;
	hideHeader: boolean;
	actionColumn: boolean;
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
	actionColumn,
	maxHeight,
	columnAlignment
}: PlaygroundArgs) {
	const columns = useMemo<DataTableColumn<Employee>[]>(() => {
		const aligned = BASIC_COLUMNS.map((column) => ({ ...column, horizontalAlignment: columnAlignment }));

		if (!actionColumn) {
			return aligned;
		}

		return [
			...aligned,
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
	}, [columnAlignment, actionColumn]);

	const { rows, sortOptions } = useSortedRows(EMPLOYEES);

	return (
		<DataTable<Employee>
			ariaLabel="DataTable playground"
			data={rows}
			columns={columns}
			rowKey="id"
			sortOptions={sortOptions}
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
	const [filters, setFilters] = useState<FilterMap>({});
	const { rowEventHandlers, rowStyling } = useRowSelection(employeeKey);

	const filtered = useMemo(
		() =>
			EMPLOYEES.filter((row) =>
				Object.entries(filters).every(([key, query]) => {
					if (!query) {
						return true;
					}

					return String(row[key as keyof Employee] ?? "")
						.toLowerCase()
						.includes(query.toLowerCase());
				})
			),
		[filters]
	);
	const { rows, sortOptions } = useSortedRows(filtered);

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
				width: 0.7,
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
				renderFooter: () => <span>{rows.length} shown</span>
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
	}, [filters, rows.length]);

	return (
		<DataTable<Employee>
			ariaLabel="Employee directory"
			data={rows}
			columns={columns}
			rowKey="id"
			maxHeight={360}
			cellHighlighting
			sortOptions={sortOptions}
			rowEventHandlers={rowEventHandlers}
			rowStyling={rowStyling}
		/>
	);
}

const meta: Meta<typeof DataTable<Employee>> = {
	title: "Data Display/DataTable/DataTable",
	component: DataTable,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Stories that are plain props are written as `args`, so "Show code" is generated from the
 * rendered `DataTable` element. Stories that need React state keep a demo component and
 * ship a hand-written `docs.source.code` snippet instead — otherwise the snippet would only
 * read `<SomeDemo />`. Controls are switched off for those, since the demo ignores args.
 */
const BASE_ARGS: DataTableProps<Employee> = {
	ariaLabel: "Employees",
	data: EMPLOYEES,
	columns: BASIC_COLUMNS,
	rowKey: "id"
};

const STATEFUL_DEMO = { controls: { disable: true } };

export const Default: Story = {
	args: BASE_ARGS
};

export const Sortable: Story = {
	name: "Sortable Columns",
	render: () => <SortableDataTableDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [sortState, setSortState] = useState<DataTableSortState>([]);
const rows = useMemo(() => sortRows(employees, sortState), [sortState]);

<DataTable<Employee>
	ariaLabel="Sortable employees"
	data={rows}
	columns={columns}
	rowKey="id"
	sortOptions={{ sortState, onSort: setSortState }}
/>`
			},
			description: {
				story:
					"Sorting is controlled: pass `sortOptions={{ sortState, onSort }}`, assign `next` from `onSort` to your state and sort `data` yourself. Click a header to cycle ascending → descending → unsorted."
			}
		}
	}
};

export const WithPinnedColumn: Story = {
	name: "Pinned Columns",
	args: {
		...BASE_ARGS,
		ariaLabel: "Employees with pinned columns",
		columns: PINNED_COLUMNS,
		maxHeight: 320
	},
	parameters: {
		docs: {
			description: {
				story: '`pinning: "left" | "right"` keeps a column in view while the table scrolls horizontally.'
			}
		}
	}
};

export const CardView: Story = {
	args: {
		...BASE_ARGS,
		ariaLabel: "Employees (card view)",
		columns: CARD_VIEW_COLUMNS,
		cardView: true
	},
	parameters: {
		docs: {
			description: {
				story:
					'`cardView` renders a **separate layout**, not a restyled table: a `role="list"` of `listitem` cards with no `<table>` DOM. There is no header and no footer; each card labels its own fields, and non-string (`ReactNode`/icon) labels — like the “Role” column here — are rendered and exposed to assistive technology. Toggle `cardView` in the **Playground** story to switch between the two layouts.'
			}
		}
	}
};

export const CardViewInteractive: Story = {
	name: "Card View — selection & keyboard",
	render: () => <CardViewInteractiveDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [selected, setSelected] = useState<number | undefined>(employees[1]?.id);

<DataTable<Employee>
	ariaLabel="Employees (card view, selectable)"
	data={employees}
	columns={columns}
	rowKey="id"
	cardView
	rowStyling={({ row }) => ({ selected: row.id === selected })}
	rowEventHandlers={({ row }) => ({
		onClick: () => setSelected((prev) => (prev === row.id ? undefined : row.id))
	})}
/>`
			},
			description: {
				story:
					"Card view shares the model with the table layout, so it is not read-only: `rowStyling` / `rowEventHandlers` select cards, and the arrow keys move between cards once the list has focus."
			}
		}
	}
};

export const CellHighlighting: Story = {
	args: {
		...BASE_ARGS,
		ariaLabel: "Employees with cell highlighting",
		cellHighlighting: true
	},
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
	args: { ...BASE_ARGS, data: [] },
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
	args: { ...BASE_ARGS, disabled: true },
	parameters: {
		docs: {
			description: {
				story:
					"The `disabled` prop applies a disabled visual state and suppresses all event handlers — `rowStyling`/`cellStyling` and `cellHighlighting` are also inactive while disabled."
			}
		}
	}
};

export const HiddenHeader: Story = {
	args: { ...BASE_ARGS, ariaLabel: "Header-less table", hideHeader: true },
	parameters: {
		docs: {
			description: {
				story:
					"`hideHeader` removes the `<thead>` (header rows and filter row) entirely. ARIA row numbering excludes the hidden header, and header-dependent features like `cellHighlighting` are inactive."
			}
		}
	}
};

export const WithPagination: Story = {
	render: () => <WithPaginationDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const PAGE_SIZE = 5;
const [currentPage, setCurrentPage] = useState(1);
const paged = employees.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

<DataTable<Employee> ariaLabel="Paged employees" data={paged} columns={columns} rowKey="id" />
<Pagination
	alignment="right"
	currentPage={currentPage}
	pageCount={Math.ceil(employees.length / PAGE_SIZE)}
	pageLabelTemplate="{page} / {total}"
	onPageChanged={setCurrentPage}
/>`
			},
			description: {
				story:
					"Pagination is external to the table — slice `data` for the current page and drive `Pagination` via `currentPage` / `onPageChanged`. For very long lists compare **Large Data**."
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
		actionColumn: false,
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
		actionColumn: {
			control: "boolean",
			description:
				"Append a right-pinned, auto-sized action column rendering Edit/Delete buttons via the column-level `renderCell` hook (see **Action Column**)."
		},
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
			source: {
				language: "tsx",
				code: `<DataTable<Employee>
	ariaLabel="DataTable playground"
	data={rows}
	columns={columns.map((column) => ({ ...column, horizontalAlignment: columnAlignment }))}
	rowKey="id"
	sortOptions={sortOptions}
	cardView={cardView}
	cellHighlighting={cellHighlighting}
	disabled={disabled}
	disableArrowNavigation={disableArrowNavigation}
	hideHeader={hideHeader}
	maxHeight={maxHeight > 0 ? maxHeight : undefined}
/>`
			},
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
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [filters, setFilters] = useState<Record<string, string>>({});
const [sortState, setSortState] = useState<DataTableSortState>([]);
const [selected, setSelected] = useState<number>();

const filtered = employees.filter((row) =>
	Object.entries(filters).every(([key, query]) =>
		String(row[key as keyof Employee] ?? "").toLowerCase().includes(query.toLowerCase())
	)
);
const rows = sortRows(filtered, sortState);

const filterCell = (dataKey: keyof Employee, label: string) => () => (
	<TextField
		label={\`Filter \${label}\`}
		hideLabel
		value={filters[dataKey] ?? ""}
		onChange={(ev) => setFilters((prev) => ({ ...prev, [dataKey]: ev.target.value }))}
	/>
);

const columns: DataTableColumn<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.7, fixedWidth: true, pinning: "left", renderFooter: () => <strong>Total</strong> },
	{
		label: "First Name",
		dataKey: "firstName",
		sortable: true,
		renderFilter: filterCell("firstName", "first name"),
		renderFooter: () => <span>{rows.length} shown</span>
	},
	{ label: "Last Name", dataKey: "lastName", sortable: true, renderFilter: filterCell("lastName", "last name") },
	{ label: "Department", dataKey: "department", width: 1.5, renderFilter: filterCell("department", "department") },
	{ label: "Role", dataKey: "role", width: 1.5 },
	{ label: "Status", dataKey: "status", pinning: "right" }
];

<DataTable<Employee>
	ariaLabel="Employee directory"
	data={rows}
	columns={columns}
	rowKey="id"
	maxHeight={360}
	cellHighlighting
	sortOptions={{ sortState, onSort: setSortState }}
	rowStyling={({ row }) => ({ selected: row.id === selected })}
	rowEventHandlers={({ row }) => ({ onClick: () => setSelected(row.id) })}
/>`
			},
			description: {
				story:
					"A realistic, copy-paste assembly combining the features that ship as isolated stories elsewhere: sortable headers, left/right **pinned** columns, an inline **filter row**, single-row **selection**, a sticky scroll viewport (`maxHeight`), `cellHighlighting`, and a `<tfoot>` summary that reflects the filtered count."
			}
		}
	}
};
