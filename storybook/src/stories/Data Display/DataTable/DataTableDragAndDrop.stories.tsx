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

import { Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DataTableColumn } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "./data-table.data.js";
import { EMPLOYEE_COLUMNS, EMPLOYEES, makeEmployees } from "./data-table.data.js";
import { useReorderableRows } from "./data-table.helpers.js";

const DND_COLUMNS: DataTableColumn<Employee>[] = [
	...EMPLOYEE_COLUMNS,
	{
		label: "",
		hiddenText: "Actions",
		actionColumn: true,
		pinning: "right",
		renderCell: ({ row }) => (
			<Button
				destructive
				icon={<Icon>delete</Icon>}
				title={`Delete ${row.firstName}`}
				onClick={(e) => e.stopPropagation()}
			/>
		)
	}
];

function DragAndDropDemo(): ReactElement {
	const { data, onDrop } = useReorderableRows(EMPLOYEES);

	return (
		<DataTable<Employee>
			ariaLabel="Drag-and-drop reorderable employees"
			data={data}
			columns={DND_COLUMNS}
			rowKey="id"
			dragDropOptions={{ onDrop }}
		/>
	);
}

const MANY_EMPLOYEES = makeEmployees(500);

function VirtualizedDragAndDropDemo(): ReactElement {
	const { data, onDrop } = useReorderableRows(MANY_EMPLOYEES);

	return (
		<DataTable<Employee>
			ariaLabel="Virtualized drag-and-drop reorderable employees"
			data={data}
			columns={DND_COLUMNS}
			rowKey="id"
			maxHeight={400}
			virtualScrollOptions={{ rowHeight: 44 }}
			dragDropOptions={{ onDrop }}
		/>
	);
}

const meta: Meta<typeof DataTable<Employee>> = {
	title: "Data Display/DataTable/Drag and Drop",
	component: DataTable,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Pass `dragDropOptions={{ onDrop }}` to make body rows drag sources and drop targets. Drag-and-drop is self-contained — no provider or other setup is required around the table. `onDrop` receives `{ dragItem, dropResult }` with the source and target row indexes; reorder your `data` in state from there. Two tables with the same `acceptType` accept each other's rows."
			}
		}
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const STATEFUL_DEMO = { controls: { disable: true } };

export const Basic: Story = {
	name: "Drag and Drop",
	render: () => <DragAndDropDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [data, setData] = useState(employees);

// \`onDrop\` gives the source and target row indexes; move the row in state.
const onDrop: DataTableDragDropOptions<Employee>["onDrop"] = ({ dragItem, dropResult }) => {
	setData((prev) => {
		const next = [...prev];
		const [moved] = next.splice(dragItem.rowIndex, 1);
		const target = dragItem.rowIndex < dropResult.rowIndex ? dropResult.rowIndex - 1 : dropResult.rowIndex;

		next.splice(target, 0, moved);

		return next;
	});
};

<DataTable<Employee>
	ariaLabel="Drag-and-drop reorderable employees"
	data={data}
	columns={columns}
	rowKey="id"
	dragDropOptions={{ onDrop }}
/>`
			},
			description: {
				story:
					"Drag a row and drop it between two others to reorder the list; `onDrop` moves it in state.\n\n**Keyboard:** focus a row and press **Space** to pick it up, **Up/Down** to move it one slot at a time, **Space** to drop it or **Escape** to put it back. Each step is announced to screen readers; `canDrag` / `canDrop` apply exactly as for pointer drags. `keyboardGrabKey: false` switches the keyboard grab off when the rows need Space for a shortcut of their own."
			}
		}
	}
};

export const WithVirtualization: Story = {
	name: "Drag and Drop + Virtualization",
	render: () => <VirtualizedDragAndDropDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [data, setData] = useState(() => makeEmployees(500));

// \`onDrop\` gives the source and target row indexes; move the row in state.
const onDrop: DataTableDragDropOptions<Employee>["onDrop"] = ({ dragItem, dropResult }) => {
	setData((prev) => {
		const next = [...prev];
		const [moved] = next.splice(dragItem.rowIndex, 1);
		const target = dragItem.rowIndex < dropResult.rowIndex ? dropResult.rowIndex - 1 : dropResult.rowIndex;

		next.splice(target, 0, moved);

		return next;
	});
};

<DataTable<Employee>
	ariaLabel="Virtualized drag-and-drop reorderable employees"
	data={data}
	columns={columns}
	rowKey="id"
	maxHeight={400}
	virtualScrollOptions={{ rowHeight: 44 }}
	dragDropOptions={{ onDrop }}
/>`
			},
			description: {
				story:
					"`dragDropOptions` and `virtualScrollOptions` work together: this table windows 500 rows yet every rendered row stays draggable. Drag a row toward the viewport's **top or bottom edge** and it auto-scrolls to bring off-window rows into view as drop targets."
			}
		}
	}
};
