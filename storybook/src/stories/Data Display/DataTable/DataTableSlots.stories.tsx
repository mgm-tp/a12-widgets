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
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type {
	DataTableColumn,
	DataTableSlotProps,
	DataTableSortState
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Status } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "../Table/table.data.js";
import { BASIC_COLUMNS, EMPLOYEES } from "../Table/table.data.js";

/**
 * Column-level render hooks: `renderCell` / `renderHeader` own the
 * presentation of one column, while `dataKey` keeps resolving the value.
 */
const RENDER_COLUMNS: DataTableColumn<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true },
	{
		label: "Name",
		dataGetter: ({ row }) => `${row.firstName} ${row.lastName}`,
		width: 1.5,
		sortable: true,
		renderHeader: ({ label, sortOrder }) => (
			<span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
				{label}
				{sortOrder ? ` (${sortOrder})` : ""}
			</span>
		)
	},
	{ label: "Department", dataKey: "department", width: 1.5 },
	{
		label: "Status",
		dataKey: "status",
		width: 1,
		renderCell: ({ row }) => {
			const variant = row.status === "Active" ? "success" : row.status === "On Leave" ? "warning" : "error";

			return <Status variant={variant}>{row.status}</Status>;
		},
		renderFooter: () => <em>3 employees</em>
	}
];

function ColumnRenderHooksDemo(): ReactElement {
	const [sortState, setSortState] = useState<DataTableSortState>([]);

	return (
		<DataTable<Employee>
			ariaLabel="Column render hooks"
			data={EMPLOYEES}
			columns={RENDER_COLUMNS}
			rowKey="id"
			sortOptions={{ sortState, onSort: (next) => setSortState(next) }}
		/>
	);
}

/**
 * A component slot: declared at module scope (stable identity), free to use
 * hooks, and composing the self-wiring `DataTable.Row` primitive — sorting,
 * selection, keyboard navigation and context menus stay intact.
 */
function ZebraRow(props: DataTableSlotProps.Row<Employee>): ReactElement {
	// Slots are mounted components, so hooks are available.
	const [zebra] = useState(true);
	const shaded = zebra && props.rowIndex % 2 === 1;

	return (
		<DataTable.Row
			{...props}
			styles={{
				...props.styles,
				style: { ...props.styles?.style, background: shaded ? "rgba(0, 0, 0, 0.04)" : undefined }
			}}
		/>
	);
}

function RowSlotDemo(): ReactElement {
	return (
		<DataTable<Employee>
			ariaLabel="Zebra rows via row slot"
			data={EMPLOYEES}
			columns={BASIC_COLUMNS}
			rowKey="id"
			slots={{ row: ZebraRow }}
		/>
	);
}

function HiddenHeaderDemo(): ReactElement {
	return (
		<DataTable<Employee>
			ariaLabel="Header-less table"
			data={EMPLOYEES}
			columns={BASIC_COLUMNS}
			rowKey="id"
			hideHeader
		/>
	);
}

const meta: Meta<typeof ColumnRenderHooksDemo> = {
	title: "Data Display/DataTable/Customization/Render Hooks",
	component: ColumnRenderHooksDemo,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Column-level render hooks own the presentation of a single column while the value keeps resolving through `dataKey`/`dataGetter` — so sorting, footers and filtering still work. For transforming *every* column from one place, see **Content Slots** instead."
			}
		}
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ColumnRenderHooks: Story = {
	render: () => <ColumnRenderHooksDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"`renderCell` and `renderHeader` take over one column's markup (here a `Status` pill and an uppercased, sort-aware header) while `dataKey`/`dataGetter` still resolves the value — so the column stays sortable and its `renderFooter` summary keeps working. Prefer these over slots for single-column tweaks."
			}
		}
	}
};

export const RowSlot: Story = {
	render: () => <RowSlotDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"The `row` slot is a full component (stable identity required — declare at module scope or memoize) and may use hooks. Composing the self-wiring `DataTable.Row` primitive keeps sorting, selection, keyboard navigation and context menus intact; here it only adds zebra striping on top."
			}
		}
	}
};

export const HiddenHeader: Story = {
	render: () => <HiddenHeaderDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"`hideHeader` removes the `<thead>` (header rows and filter row) entirely. ARIA row numbering excludes the hidden header, and header-dependent features like `cellHighlighting` are inactive."
			}
		}
	}
};
