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

import type { FC, ReactElement } from "react";
import { useState } from "react";

import type {
	DataTableColumn,
	DataTableSlotProps,
	DataTableSortState
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

interface DataType {
	name: string;
	calories: number;
	fat: number;
	status: "passed" | "pending" | "failed";
}

const data: DataType[] = [
	{ status: "passed", name: "Frozen yoghurt", calories: 159, fat: 6.0 },
	{ status: "pending", name: "Ice cream sandwich", calories: 237, fat: 9.0 },
	{ status: "failed", name: "Eclair", calories: 262, fat: 16.0 }
];

const STATUS_ICONS: Record<DataType["status"], string> = {
	passed: "check_circle",
	pending: "schedule",
	failed: "error"
};

/**
 * Column-level render hooks own one column's presentation, while
 * `dataKey`/`dataGetter` keep resolving the value. `renderFooter` on any
 * column activates the footer automatically.
 */
const columns: DataTableColumn<DataType>[] = [
	{
		label: "Status",
		dataKey: "status",
		width: 0.6,
		renderCell: ({ row }) => (
			<>
				<Icon>{STATUS_ICONS[row.status]}</Icon> {row.status}
			</>
		)
	},
	{
		label: "Dessert",
		dataKey: "name",
		sortable: true,
		renderHeader: ({ label, sortOrder }) => (
			<strong>
				{label}
				{sortOrder ? ` — sorted ${sortOrder === "asc" ? "ascending" : "descending"}` : ""}
			</strong>
		)
	},
	{ label: "Calories", dataKey: "calories", horizontalAlignment: "right" },
	{
		label: "Fat (g)",
		dataKey: "fat",
		horizontalAlignment: "right",
		renderFooter: () => <em>Σ {data.reduce((sum, row) => sum + row.fat, 0).toFixed(1)} g</em>
	}
];

/**
 * A structural slot is a React component declared at module scope (stable
 * identity!). It may use hooks and composes the self-wiring `DataTable.Row`
 * primitive, so selection, click handlers, keyboard navigation and context
 * menus keep working without re-implementation.
 */
function StripedRow(props: DataTableSlotProps.Row<DataType>): ReactElement {
	const striped = props.rowIndex % 2 === 1;

	return (
		<DataTable.Row
			{...props}
			styles={{
				...props.styles,
				style: { ...props.styles?.style, background: striped ? "rgba(127, 127, 127, 0.08)" : undefined }
			}}
		/>
	);
}

export const SlotsTableShowcase: FC = () => {
	const [sortState, setSortState] = useState<DataTableSortState>([]);

	return (
		<DataTable<DataType>
			ariaLabel="Desserts with slot-based customization"
			data={data}
			columns={columns}
			rowKey="name"
			sortOptions={{ sortState, onSort: (next) => setSortState(next) }}
			slots={{ row: StripedRow }}
		/>
	);
};
