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
import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { styled } from "styled-components";

import type { RowEventHandlerGetter } from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	DataTableColumn,
	DataTableCellStyleGetter,
	DataTableRowStyleGetter,
	DataTableSlotProps,
	DataTableSlots,
	DataTableScrollToNodeHandler
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Button, ButtonGroup, Icon, List } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "../Table/table.data.js";
import { BASIC_COLUMNS, EMPLOYEES } from "../Table/table.data.js";

const STATUS_COLUMNS: DataTableColumn<Employee>[] = [
	...BASIC_COLUMNS,
	{ label: "Status", dataKey: "status", width: 1, verticalAlignment: "middle" }
];

function RowSelectionDemo() {
	const [selected, setSelected] = useState<Employee | undefined>();

	const rowEventHandlers: RowEventHandlerGetter<Employee> = useCallback(
		({ row }) => ({ onClick: () => setSelected((prev) => (prev === row ? undefined : row)) }),
		[]
	);

	const rowStyling: DataTableRowStyleGetter<Employee> = useCallback(
		({ row }) => ({
			selected: selected === row,
			title: selected === row ? "Selected" : "Selectable"
		}),
		[selected]
	);

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
	const [selected, setSelected] = useState<Set<number>>(new Set());

	const rowEventHandlers: RowEventHandlerGetter<Employee> = useCallback(
		({ row }) => ({
			onClick: () =>
				setSelected((prev) => {
					const next = new Set(prev);

					if (next.has(row.id)) {
						next.delete(row.id);
					} else {
						next.add(row.id);
					}

					return next;
				})
		}),
		[]
	);

	const rowStyling: DataTableRowStyleGetter<Employee> = useCallback(
		({ row }) => ({
			selected: selected.has(row.id),
			title: selected.has(row.id) ? "Selected" : "Selectable"
		}),
		[selected]
	);

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

function RowStylingDemo() {
	const rowStyling: DataTableRowStyleGetter<Employee> = useCallback(({ row, rowIndex }) => {
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
	}, []);

	const rowEventHandlers: RowEventHandlerGetter<Employee> = useCallback(
		({ rowIndex }) => (rowIndex === 0 ? { onClick: () => undefined } : {}),
		[]
	);

	return (
		<DataTable<Employee>
			ariaLabel="Row styling variants"
			data={EMPLOYEES}
			columns={STATUS_COLUMNS}
			rowKey="id"
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
		/>
	);
}

function CellStylingDemo() {
	const cellStyling: DataTableCellStyleGetter<Employee, DataTableColumn<Employee>> = useCallback(({ row, column }) => {
		if (column.dataKey === "status" && row.status === "On Leave") {
			return { useSecondaryColor: true, secondaryCellTitle: "Currently unavailable" };
		}

		return {};
	}, []);

	return (
		<DataTable<Employee>
			ariaLabel="Cell styling variants"
			data={EMPLOYEES}
			columns={STATUS_COLUMNS}
			rowKey="id"
			cellStyling={cellStyling}
		/>
	);
}

const SCROLL_ROWS: Employee[] = Array.from({ length: 50 }, (_, i) => ({
	id: i + 1,
	firstName: `First${i + 1}`,
	lastName: `Last${i + 1}`,
	department: ["Engineering", "Sales", "Marketing", "Finance"][i % 4],
	role: ["Engineer", "Manager", "Designer", "Analyst"][i % 4],
	status: i % 3 === 0 ? "On Leave" : "Active"
}));

const StyledScrollContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

function ScrollToNodeDemo() {
	const scrollHandlerRef = useRef<DataTableScrollToNodeHandler | undefined>(undefined);
	const [selected, setSelected] = useState<Employee | undefined>();

	const scrollTo = useCallback((index: number) => {
		scrollHandlerRef.current?.(index, { autoFocus: true });
	}, []);

	const rowEventHandlers: RowEventHandlerGetter<Employee> = useCallback(
		({ row }) => ({ onClick: () => setSelected((prev) => (prev === row ? undefined : row)) }),
		[]
	);

	const rowStyling: DataTableRowStyleGetter<Employee> = useCallback(
		({ row }) => ({
			selected: selected === row,
			title: selected === row ? "Selected" : "Selectable"
		}),
		[selected]
	);

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

	return (
		<List border paddedRight>
			<List.Item
				text="View"
				graphic={<Icon>visibility</Icon>}
				onClick={() => {
					setLastAction(`View ${row.firstName} ${row.lastName} (row ${rowIndex + 1})`);
					closeHandler();
				}}
			/>
			<List.Item
				text="Edit"
				graphic={<Icon>edit</Icon>}
				onClick={() => {
					setLastAction(`Edit ${row.firstName} ${row.lastName} (row ${rowIndex + 1})`);
					closeHandler();
				}}
			/>
			<List.Item
				text="Delete"
				graphic={<Icon>delete</Icon>}
				onClick={() => {
					setLastAction(`Delete ${row.firstName} ${row.lastName} (row ${rowIndex + 1})`);
					closeHandler();
				}}
			/>
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

const meta: Meta<typeof RowSelectionDemo> = {
	title: "Data Display/DataTable/Interactions",
	component: RowSelectionDemo,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RowSelection: Story = {
	name: "Row Selection",
	render: () => <RowSelectionDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Combine `rowEventHandlers` (to capture clicks) with `rowStyling` (to mark the active row as `selected`). Clicking the same row again toggles selection off."
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
					"Track selection in a `Set` of row ids instead of a single row. `rowEventHandlers` toggles the clicked row's id, and `rowStyling` returns `selected: set.has(row.id)` so any number of rows can be marked at once."
			}
		}
	}
};

export const RowStyling: Story = {
	name: "Row Styling Variants",
	render: () => <RowStylingDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Return `{ interactive, disabled, highlighted, highlightVariant, selected }` from `rowStyling` to drive the row's visual variant. Row 1 is `interactive` (hover cursor), row 3 is `disabled`, and rows with `status === 'On Leave'` are `highlighted` with `info` variant."
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
					"`cellStyling` runs per cell. Return `{ useSecondaryColor: true }` to render the de-emphasized secondary background — here, status cells reading `On Leave` are dimmed."
			}
		}
	}
};

export const ScrollToNode: Story = {
	name: "Scroll To Node",
	render: () => <ScrollToNodeDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"The `scrollToNode` prop exposes a handler via callback. Store it in a ref and call `handler(index, { autoFocus: true })` to scroll the row into view and optionally focus it."
			}
		}
	}
};

export const ContextMenu: Story = {
	name: "Context Menu",
	render: () => <ContextMenuDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Provide the `contextMenu` slot to open a popover at the cursor when a body row is right-clicked. The slot component receives `{ row, rowIndex, closeHandler }` — call `closeHandler()` after handling an action to dismiss the menu."
			}
		}
	}
};
