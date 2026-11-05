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
import type { DataTableColumn, DataTableProps } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "./data-table.data.js";
import { EMPLOYEES } from "./data-table.data.js";

const DATA_COLUMNS: DataTableColumn<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.7, fixedWidth: true, pinning: "left" },
	{ label: "First Name", dataKey: "firstName", width: 1 },
	{ label: "Department", dataKey: "department", width: 1.5 }
];

const editButton = (row: Employee): ReactElement => (
	<Button icon={<Icon>edit</Icon>} title={`Edit ${row.firstName}`} onClick={(e) => e.stopPropagation()} />
);

const deleteButton = (row: Employee): ReactElement => (
	<Button
		destructive
		icon={<Icon>delete</Icon>}
		title={`Delete ${row.firstName}`}
		onClick={(e) => e.stopPropagation()}
	/>
);

const moreButton = (row: Employee): ReactElement => (
	<Button icon={<Icon>more_vert</Icon>} title={`More for ${row.firstName}`} onClick={(e) => e.stopPropagation()} />
);

// A width-less, pinned action column holding a single button.
const ONE_BUTTON_COLUMNS: DataTableColumn<Employee>[] = [
	...DATA_COLUMNS,
	{
		label: "",
		hiddenText: "Actions",
		actionColumn: true,
		pinning: "right",
		renderCell: ({ row }) => deleteButton(row)
	}
];

// Same column, now with three buttons — the auto-sized track grows to fit them.
const THREE_BUTTON_COLUMNS: DataTableColumn<Employee>[] = [
	...DATA_COLUMNS,
	{
		label: "",
		hiddenText: "Actions",
		actionColumn: true,
		pinning: "right",
		renderCell: ({ row }) => (
			<>
				{editButton(row)}
				{moreButton(row)}
				{deleteButton(row)}
			</>
		)
	}
];

// A labelled action header — auto-size measures the header too, so a long label is
// never clipped by the auto-sized track.
const LABELLED_HEADER_COLUMNS: DataTableColumn<Employee>[] = [
	...DATA_COLUMNS,
	{
		label: "Manage entry",
		actionColumn: true,
		pinning: "right",
		renderCell: ({ row }) => (
			<>
				{editButton(row)}
				{deleteButton(row)}
			</>
		)
	}
];

const BASE_ARGS: DataTableProps<Employee> = {
	ariaLabel: "One action button",
	data: EMPLOYEES,
	columns: ONE_BUTTON_COLUMNS,
	rowKey: "id"
};

const meta: Meta<typeof DataTable<Employee>> = {
	title: "Data Display/DataTable/Action Column",
	component: DataTable,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"An `actionColumn` holds per-row buttons rendered through the column-level `renderCell` hook. Give it `hiddenText` (or a `label`) so the header has an accessible name, and stop click propagation inside the buttons so row handlers do not fire. A width-less action column auto-sizes to its content by default (`actionColumnAutoSize`)."
			}
		}
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OneButton: Story = {
	name: "Single Button",
	args: BASE_ARGS,
	parameters: {
		docs: {
			description: {
				story: "A width-less `actionColumn` auto-sizes to fit its content. With a single button the track is narrow."
			}
		}
	}
};

export const ThreeButtons: Story = {
	args: { ...BASE_ARGS, ariaLabel: "Three action buttons", columns: THREE_BUTTON_COLUMNS },
	parameters: {
		docs: {
			description: {
				story:
					"The same width-less `actionColumn` with three buttons — the auto-sized track grows to fit them, no `width` needed."
			}
		}
	}
};

export const LabelledHeader: Story = {
	args: { ...BASE_ARGS, ariaLabel: "Labelled action header", columns: LABELLED_HEADER_COLUMNS },
	parameters: {
		docs: {
			description: {
				story: "Auto-size measures the header too, so a labelled action header is never clipped."
			}
		}
	}
};

export const AutoSizeDisabled: Story = {
	name: "Auto-Size Disabled",
	args: {
		...BASE_ARGS,
		ariaLabel: "Action column auto-size disabled",
		columns: THREE_BUTTON_COLUMNS,
		actionColumnAutoSize: false
	},
	parameters: {
		docs: {
			description: {
				story:
					"Set `actionColumnAutoSize={false}` (or give the column a `width` / `fixedWidth`) to opt out — the column falls back to a flat `150px` track. Resizing alongside an auto-sized action column is covered under **Column Resizing**."
			}
		}
	}
};
