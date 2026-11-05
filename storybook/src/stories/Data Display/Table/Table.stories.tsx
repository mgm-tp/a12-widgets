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
import type { ReactElement } from "react";
import { useState, useCallback, useMemo } from "react";

import type { BaseColumnType, BaseTableProps, SortState, SortOrder } from "@com.mgmtp.a12.widgets/widgets-core";
import { Table, Button, ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Employee } from "./table.data.js";
import { EMPLOYEES, BASIC_COLUMNS } from "./table.data.js";

function EmployeeTable(props: BaseTableProps<Employee>): ReactElement {
	return <Table<Employee> {...props} />;
}

type ColumnAlignment = "left" | "center" | "right";

function sortEmployees(data: Employee[], sortState: SortState<BaseColumnType<Employee>>): Employee[] {
	const key = sortState.column?.dataKey as keyof Employee | undefined;

	if (!key || !sortState.order) {
		return data;
	}

	const direction = sortState.order === "asc" ? 1 : -1;

	return [...data].sort((a, b) => (a[key] < b[key] ? -direction : a[key] > b[key] ? direction : 0));
}

interface PlaygroundArgs {
	cardView: boolean;
	cellHighlighting: boolean;
	disabled: boolean;
	disableArrowNavigation: boolean;
	actionColumn: boolean;
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
	actionColumn,
	columnAlignment
}: PlaygroundArgs) {
	const [sortState, setSortState] = useState<SortState<BaseColumnType<Employee>>>({});

	const columns = useMemo<BaseColumnType<Employee>[]>(() => {
		const aligned = BASIC_COLUMNS.map((column) => ({ ...column, horizontalAlignment: columnAlignment }));

		if (!actionColumn) {
			return aligned;
		}

		return [
			...aligned,
			{
				label: "",
				dataKey: "",
				actionColumn: true,
				pinning: "right",
				horizontalAlignment: "center",
				verticalAlignment: "middle",
				dataGetter: () => (
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

	const data = useMemo(() => sortEmployees(EMPLOYEES, sortState), [sortState]);

	const onSort = useCallback((params: { column: BaseColumnType<Employee>; order: SortOrder }) => {
		setSortState(params);
	}, []);

	return (
		<Table<Employee>
			data={data}
			columns={columns}
			sortOptions={{ sortState, onSort }}
			cardView={cardView}
			cellHighlighting={cellHighlighting}
			disabled={disabled}
			disableArrowNavigation={disableArrowNavigation}
		/>
	);
}

const meta: Meta<typeof EmployeeTable> = {
	title: "Data Display/Table/Table",
	component: EmployeeTable,
	parameters: { layout: "padded" },
	argTypes: {
		data: {
			control: false,
			description: "Array of row objects to display"
		},
		columns: {
			control: false,
			description: "Column definitions (`label`, `dataKey`, `width`, `sortable`, `pinning`, ...)"
		},
		disabled: {
			control: "boolean",
			description: "Suppresses all event handlers and renders the table visually disabled"
		},
		cardView: {
			control: "boolean",
			description: "Displays rows as stacked cards instead of a tabular layout"
		},
		cellHighlighting: {
			control: "boolean",
			description: "Highlights the hovered body cell together with its column header"
		},
		disableArrowNavigation: {
			control: "boolean",
			description: "Suppresses the arrow-key keyboard navigation handlers"
		},
		ariaLabel: {
			control: "text",
			description: "Accessible name for the table element"
		},
		sortOptions: {
			control: false,
			description: "Sort state and `onSort` handler for sortable columns"
		},
		rowStyling: {
			control: false,
			description: "Function returning per-row styles (`selected`, `interactive`, `highlighted`, ...)"
		},
		rowEventHandlers: {
			control: false,
			description: "Function returning per-row event handlers such as `onClick`"
		},
		cellStyling: {
			control: false,
			description: "Function returning per-cell styles such as `useSecondaryColor`"
		},
		componentRenderers: {
			control: false,
			description: "Overrides for table part renderers (body content, footer, context menu, ...)"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Sortable: Story = {
	name: "Sortable Columns",
	render: function SortableExample() {
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"Mark columns with `sortable` and supply `sortOptions` (`sortState` + `onSort`). Click column headers to sort ascending or descending. A third click resets to original order."
			}
		}
	}
};

export const Selectable: Story = {
	name: "Selectable Rows",
	render: function SelectableExample() {
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"Combine `rowStyling` (`selected`, `interactive`) with `rowEventHandlers` (`onClick`) to make rows selectable. Click a row to select it, click again to deselect."
			}
		}
	}
};

export const Empty: Story = {
	name: "Empty Table",
	args: {
		data: [],
		columns: BASIC_COLUMNS
	},
	parameters: {
		docs: { description: { story: "When `data` is an empty array the table renders headers with no body rows." } }
	}
};

export const Disabled: Story = {
	name: "Disabled Table",
	args: {
		data: EMPLOYEES,
		columns: BASIC_COLUMNS,
		disabled: true
	},
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
	args: {
		data: EMPLOYEES,
		columns: BASIC_COLUMNS,
		cardView: true
	},
	parameters: {
		docs: { description: { story: "Setting `cardView` renders rows as stacked cards — useful for narrow viewports." } }
	}
};

export const CellHighlighting: Story = {
	name: "Cell Highlighting",
	args: {
		data: EMPLOYEES,
		columns: BASIC_COLUMNS,
		cellHighlighting: true
	},
	parameters: {
		docs: {
			description: {
				story: "With `cellHighlighting` enabled, hovering a body cell highlights both the cell and its column header."
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
		actionColumn: false,
		columnAlignment: "left"
	},
	argTypes: {
		cardView: {
			control: "boolean",
			description: "Render rows as stacked cards — useful for narrow viewports."
		},
		cellHighlighting: {
			control: "boolean",
			description: "Highlight the hovered body cell together with its column header."
		},
		disabled: { control: "boolean", description: "Apply a disabled visual state and suppress all event handlers." },
		disableArrowNavigation: {
			control: "boolean",
			description: "Turn off row-level arrow-key navigation (ArrowUp/ArrowDown move focus between body rows)."
		},
		actionColumn: {
			control: "boolean",
			description:
				"Append a right-pinned, auto-sized action column rendering Edit/Delete buttons via the column-level `dataGetter` hook."
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
					"Flip the table-level display props live from the **Controls** panel to feel how each behaves. The table stays sortable throughout — click the First/Last Name headers."
			}
		}
	}
};
