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
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { styled } from "styled-components";

import type { RowEventHandlerGetter } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, ButtonGroup, Icon, List } from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	DataTableCellStyleGetter,
	DataTableColumn,
	DataTableProps,
	DataTableRowStyleGetter,
	DataTableScrollToNodeHandler,
	DataTableSlotProps,
	DataTableSlots
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "./data-table.data.js";
import { BASIC_COLUMNS, EMPLOYEES, EMPLOYEE_COLUMNS, makeEmployees } from "./data-table.data.js";
import { useRowSelection } from "./data-table.helpers.js";

const employeeKey = (row: Employee) => row.id;

function RowSelectionDemo() {
	const { rowEventHandlers, rowStyling } = useRowSelection(employeeKey);

	return (
		<DataTable<Employee>
			ariaLabel="Selectable employees"
			data={EMPLOYEES}
			columns={BASIC_COLUMNS}
			rowKey="id"
			rowEventHandlers={rowEventHandlers}
			rowStyling={rowStyling}
		/>
	);
}

function MultiSelectionDemo() {
	const { rowEventHandlers, rowStyling } = useRowSelection(employeeKey, { multi: true });

	return (
		<DataTable<Employee>
			ariaLabel="Multi-selectable employees"
			data={EMPLOYEES}
			columns={BASIC_COLUMNS}
			rowKey="id"
			rowEventHandlers={rowEventHandlers}
			rowStyling={rowStyling}
		/>
	);
}

const ROW_STYLING: DataTableRowStyleGetter<Employee> = ({ row, rowIndex }) => {
	if (rowIndex === 2) {
		return { disabled: true, title: "Disabled — on leave" };
	}

	if (row.status === "On Leave") {
		return { highlighted: true, highlightVariant: "info", title: "On leave" };
	}

	if (rowIndex === 0) {
		return { interactive: true, title: "Click me" };
	}

	return {};
};

const ROW_EVENT_HANDLERS: RowEventHandlerGetter<Employee> = ({ rowIndex }) =>
	rowIndex === 0 ? { onClick: () => undefined } : {};

const CELL_STYLING: DataTableCellStyleGetter<Employee, DataTableColumn<Employee>> = ({ row, column }) => {
	if (column.dataKey === "status" && row.status === "On Leave") {
		return { useSecondaryColor: true, secondaryCellTitle: "Currently unavailable" };
	}

	return {};
};

const SCROLL_ROWS = makeEmployees(50);

const StyledScrollContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

function ScrollToNodeDemo() {
	const scrollHandlerRef = useRef<DataTableScrollToNodeHandler | undefined>(undefined);
	const { rowEventHandlers, rowStyling } = useRowSelection(employeeKey);

	const scrollTo = useCallback((index: number) => {
		scrollHandlerRef.current?.(index, { autoFocus: true });
	}, []);

	return (
		<StyledScrollContainer>
			<ButtonGroup>
				<Button onClick={() => scrollTo(0)}>Row 1</Button>
				<Button onClick={() => scrollTo(9)}>Row 10</Button>
				<Button onClick={() => scrollTo(24)}>Row 25</Button>
				<Button onClick={() => scrollTo(49)}>Row 50</Button>
			</ButtonGroup>
			<DataTable<Employee>
				ariaLabel="Scroll-to-node employee table"
				data={SCROLL_ROWS}
				columns={BASIC_COLUMNS}
				rowKey="id"
				maxHeight={400}
				scrollToNode={(handler) => {
					scrollHandlerRef.current = handler;
				}}
				rowEventHandlers={rowEventHandlers}
				rowStyling={rowStyling}
			/>
		</StyledScrollContainer>
	);
}

const ContextMenuActionContext = createContext<(action: string) => void>(() => undefined);

/**
 * Slot component declared at module scope (stable identity). Slots are mounted
 * components, so hooks — here `useContext` for the story's action reporter —
 * are available.
 */
function EmployeeContextMenu({ row, rowIndex, closeHandler }: DataTableSlotProps.ContextMenu<Employee>): ReactElement {
	const setLastAction = useContext(ContextMenuActionContext);
	const report = (action: string) => () => {
		setLastAction(`${action} ${row.firstName} ${row.lastName} (row ${rowIndex + 1})`);
		closeHandler();
	};

	return (
		<List border paddedRight>
			<List.Item text="View" graphic={<Icon>visibility</Icon>} onClick={report("View")} />
			<List.Item text="Edit" graphic={<Icon>edit</Icon>} onClick={report("Edit")} />
			<List.Item text="Delete" graphic={<Icon>delete</Icon>} onClick={report("Delete")} />
		</List>
	);
}

const CONTEXT_MENU_SLOTS: DataTableSlots<Employee> = { contextMenu: EmployeeContextMenu };

function ContextMenuDemo() {
	const [lastAction, setLastAction] = useState<string>("Right-click a row to see actions");

	return (
		<ContextMenuActionContext.Provider value={setLastAction}>
			<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
				<div role="status" aria-live="polite">
					<strong>Last action:</strong> {lastAction}
				</div>
				<DataTable<Employee>
					ariaLabel="Employees with context menu"
					data={EMPLOYEES}
					columns={BASIC_COLUMNS}
					rowKey="id"
					slots={CONTEXT_MENU_SLOTS}
				/>
			</div>
		</ContextMenuActionContext.Provider>
	);
}

const meta: Meta<typeof DataTable<Employee>> = {
	title: "Data Display/DataTable/Interactions",
	component: DataTable,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const BASE_ARGS: DataTableProps<Employee> = {
	ariaLabel: "Employees",
	data: EMPLOYEES,
	columns: BASIC_COLUMNS,
	rowKey: "id"
};

const STATEFUL_DEMO = { controls: { disable: true } };

export const RowSelection: Story = {
	render: () => <RowSelectionDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [selected, setSelected] = useState<number>();

<DataTable<Employee>
	ariaLabel="Selectable employees"
	data={employees}
	columns={columns}
	rowKey="id"
	rowEventHandlers={({ row }) => ({
		onClick: () => setSelected((prev) => (prev === row.id ? undefined : row.id))
	})}
	rowStyling={({ row }) => ({ selected: row.id === selected })}
/>`
			},
			description: {
				story:
					"Selection is consumer state: combine `rowEventHandlers` (to capture clicks) with `rowStyling` (to mark the active row as `selected`). Clicking the same row again toggles selection off."
			}
		}
	}
};

export const MultiSelection: Story = {
	name: "Multi-row Selection",
	render: () => <MultiSelectionDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [selected, setSelected] = useState<Set<number>>(() => new Set());

const toggle = (id: number) =>
	setSelected((prev) => {
		const next = new Set(prev);

		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}

		return next;
	});

<DataTable<Employee>
	ariaLabel="Multi-selectable employees"
	data={employees}
	columns={columns}
	rowKey="id"
	rowEventHandlers={({ row }) => ({ onClick: () => toggle(row.id) })}
	rowStyling={({ row }) => ({ selected: selected.has(row.id) })}
/>`
			},
			description: {
				story:
					"Track a `Set` of row ids instead of a single row. `rowEventHandlers` toggles the clicked row's id, and `rowStyling` returns `selected: set.has(row.id)` so any number of rows can be marked at once."
			}
		}
	}
};

export const RowStyling: Story = {
	name: "Row Styling Variants",
	args: {
		...BASE_ARGS,
		ariaLabel: "Row styling variants",
		columns: EMPLOYEE_COLUMNS,
		rowStyling: ROW_STYLING,
		rowEventHandlers: ROW_EVENT_HANDLERS
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `const rowStyling: DataTableRowStyleGetter<Employee> = ({ row, rowIndex }) => {
	if (rowIndex === 2) {
		return { disabled: true, title: "Disabled — on leave" };
	}

	if (row.status === "On Leave") {
		return { highlighted: true, highlightVariant: "info", title: "On leave" };
	}

	if (rowIndex === 0) {
		return { interactive: true, title: "Click me" };
	}

	return {};
};

<DataTable<Employee>
	ariaLabel="Row styling variants"
	data={employees}
	columns={columns}
	rowKey="id"
	rowStyling={rowStyling}
	rowEventHandlers={({ rowIndex }) => (rowIndex === 0 ? { onClick: () => undefined } : {})}
/>`
			},
			description: {
				story:
					"Return `{ interactive, disabled, highlighted, highlightVariant, selected }` from `rowStyling` to drive the row's visual variant. Row 1 is `interactive` (hover cursor), row 3 is `disabled`, and rows with `status === 'On Leave'` are `highlighted` with `info` variant."
			}
		}
	}
};

export const CellStyling: Story = {
	args: {
		...BASE_ARGS,
		ariaLabel: "Cell styling variants",
		columns: EMPLOYEE_COLUMNS,
		cellStyling: CELL_STYLING
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `<DataTable<Employee>
	ariaLabel="Cell styling variants"
	data={employees}
	columns={columns}
	rowKey="id"
	cellStyling={({ row, column }) =>
		column.dataKey === "status" && row.status === "On Leave"
			? { useSecondaryColor: true, secondaryCellTitle: "Currently unavailable" }
			: {}
	}
/>`
			},
			description: {
				story:
					"`cellStyling` runs per cell. Return `{ useSecondaryColor: true }` to render the de-emphasized secondary background — here, status cells reading `On Leave` are dimmed."
			}
		}
	}
};

export const ScrollToNode: Story = {
	render: () => <ScrollToNodeDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const scrollHandlerRef = useRef<DataTableScrollToNodeHandler>(undefined);

<Button onClick={() => scrollHandlerRef.current?.(24, { autoFocus: true })}>Row 25</Button>

<DataTable<Employee>
	ariaLabel="Scroll-to-node employee table"
	data={employees}
	columns={columns}
	rowKey="id"
	maxHeight={400}
	scrollToNode={(handler) => {
		scrollHandlerRef.current = handler;
	}}
/>`
			},
			description: {
				story:
					"The `scrollToNode` prop exposes a handler via callback. Store it in a ref and call `handler(index, { autoFocus: true })` to scroll the row into view and optionally focus it. Works in every mode, virtualized or not."
			}
		}
	}
};

export const ContextMenu: Story = {
	render: () => <ContextMenuDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `function EmployeeContextMenu({ row, closeHandler }: DataTableSlotProps.ContextMenu<Employee>) {
	const act = (action: string) => () => {
		onAction(action, row);
		closeHandler();
	};

	return (
		<List border paddedRight>
			<List.Item text="View" graphic={<Icon>visibility</Icon>} onClick={act("View")} />
			<List.Item text="Edit" graphic={<Icon>edit</Icon>} onClick={act("Edit")} />
			<List.Item text="Delete" graphic={<Icon>delete</Icon>} onClick={act("Delete")} />
		</List>
	);
}

// Declare slots at module scope so their identity stays stable across renders.
const SLOTS: DataTableSlots<Employee> = { contextMenu: EmployeeContextMenu };

<DataTable<Employee>
	ariaLabel="Employees with context menu"
	data={employees}
	columns={columns}
	rowKey="id"
	slots={SLOTS}
/>`
			},
			description: {
				story:
					"Provide the `contextMenu` slot to open a popover at the cursor when a body row is right-clicked. The slot component receives `{ row, rowIndex, closeHandler }` — call `closeHandler()` after handling an action to dismiss the menu."
			}
		}
	}
};
