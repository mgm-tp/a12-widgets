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
import { useState, useCallback } from "react";

import type {
	DataTableColumn,
	DataTableCellStyles,
	DataTableRowStyles,
	DataTableCellStyleGetter,
	DataTableRowStyleGetter
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

interface DataType {
	name: string;
	calories: number;
	fat: number;
	description: string;
	status: "passed" | "pending" | "failed";
}

const data: DataType[] = [
	{
		status: "passed",
		name: "Frozen yoghurt",
		calories: 159,
		fat: 6.0,
		description:
			"Frozen yogurt is a frozen product containing the same basic ingredients as ice cream, but contains live bacterial cultures."
	},
	{
		status: "pending",
		name: "Ice cream sandwich",
		calories: 237,
		fat: 9.0,
		description:
			"An ice cream sandwich is a frozen dessert consisting of ice cream between two biscuits, skins, wafers, or cookies."
	},
	{
		status: "pending",
		name: "Eclair",
		calories: 262,
		fat: 16.0,
		description: "An éclair is a pastry made with choux dough filled with a cream and topped with a flavored icing."
	},
	{
		status: "pending",
		name: "Cupcake",
		calories: 305,
		fat: 3.7,
		description:
			"A cupcake is a small cake designed to serve one person, which may be baked in a small thin paper or aluminum cup."
	},
	{
		status: "pending",
		name: "Gingerbread",
		calories: 356,
		fat: 16.0,
		description:
			"Gingerbread refers to a broad category of baked goods, typically flavored with ginger, cloves, nutmeg, and cinnamon and sweetened with honey, sugar, or molasses."
	},
	{
		status: "failed",
		name: "Jelly Bean",
		calories: 375,
		fat: 0.0,
		description: "Jelly beans are small bean shaped sugar candies with soft candy shells and thick gel interiors."
	}
];

const columns: DataTableColumn<DataType>[] = [
	{
		label: "Status",
		dataKey: "status",
		subInfo: true,
		verticalAlignment: "middle",
		horizontalAlignment: "center",
		pinning: "left",
		width: 0.7,
		// Column-level render hook: the column resolves the value via `dataKey`
		// while `renderCell` owns the presentation of this column's body cells.
		renderCell: ({ row }): ReactElement => {
			switch (row.status) {
				case "passed":
					return (
						<Icon title="Success" variant="success">
							check_circle
						</Icon>
					);
				case "failed":
					return <Icon title="Failed">cancel</Icon>;
				default:
					return (
						<Icon title="Pending" variant="info">
							pending
						</Icon>
					);
			}
		}
	},
	{
		label: "Dessert name",
		dataKey: "name",
		fixedWidth: true
	},
	{ label: "Calories", dataKey: "calories" },
	{ label: "Fat", dataKey: "fat" },
	{ label: "Description", dataKey: "description", width: 3 }
];

export const CustomizationTableShowcase: FC = () => {
	const [selectedRow, setSelectedRow] = useState<DataType | undefined>(data[1]);

	const rowEventHandlers = useCallback(
		(params: { row: DataType }) => ({
			onClick: (): void => setSelectedRow((selectedRow) => (selectedRow === params.row ? undefined : params.row))
		}),
		[]
	);

	const cellStyling: DataTableCellStyleGetter<DataType, DataTableColumn<DataType>> = useCallback(
		({ column }): DataTableCellStyles => ({
			useSecondaryColor: column.dataKey === "description"
		}),
		[]
	);

	const rowStyling: DataTableRowStyleGetter<DataType> = useCallback(
		({ row }): DataTableRowStyles => ({
			selected: selectedRow === row,
			highlightVariant: row.status === "passed" ? "success" : undefined,
			disabled: row.status === "failed"
		}),
		[selectedRow]
	);

	return (
		<DataTable<DataType>
			data={data}
			ariaLabel="Customization With Cells"
			columns={columns}
			cellStyling={cellStyling}
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
		/>
	);
};
