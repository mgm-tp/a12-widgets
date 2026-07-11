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

import type { FC } from "react";
import { useState, useCallback } from "react";

import type {
	DataTableColumn,
	DataTableSortOrder,
	DataTableSortState
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { Utils } from "./utils.js";

interface DataType {
	name: string;
	calories: number;
	fat: number;
	carbs: number;
	protein: number;
}

const data: DataType[] = [
	{ name: "Frozen yoghurt", calories: 159, fat: 6.0, carbs: 24, protein: 4.0 },
	{ name: "Ice cream sandwich", calories: 237, fat: 9.0, carbs: 37, protein: 4.3 },
	{ name: "Eclair", calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
	{ name: "Cupcake", calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
	{ name: "Gingerbread", calories: 356, fat: 16.0, carbs: 49, protein: 3.9 },
	{ name: "Honeycomb", calories: 408, fat: 3.2, carbs: 87, protein: 6.5 },
	{ name: "Jelly Bean", calories: 375, fat: 0.0, carbs: 94, protein: 0.0 },
	{ name: "KitKat", calories: 518, fat: 26.0, carbs: 65, protein: 7.0 },
	{ name: "Lollipop", calories: 392, fat: 0.2, carbs: 98, protein: 0.0 },
	{ name: "Marshmallow", calories: 318, fat: 0, carbs: 81, protein: 2.0 },
	{ name: "Nougat", calories: 360, fat: 19.0, carbs: 9, protein: 37.0 },
	{ name: "Oreo", calories: 437, fat: 18.0, carbs: 63, protein: 4.0 }
];

const columns: DataTableColumn<DataType>[] = [
	{
		label: "Dessert name",
		dataKey: "name",
		verticalHeader: true,
		sortable: true,
		sortDirections: ["desc", "asc"]
	},
	{ label: "Calories", dataKey: "calories", sortable: true, sortDirections: ["desc", "asc"] },
	{ label: "Fat", dataKey: "fat", sortable: true, sortDirections: ["desc", "asc"] },
	{ label: "Carbs", dataKey: "carbs", sortable: true, sortDirections: ["desc", "asc"] },
	{ label: "Protein", dataKey: "protein", sortable: true, sortDirections: ["desc", "asc"] }
];

export const CrossTabulationShowcase: FC = () => {
	const [sortedData, setSortedData] = useState(data);
	const [sortState, setSortState] = useState<DataTableSortState>([]);

	const onSort = useCallback(
		(next: DataTableSortState, toggled: { columnId: string; order: DataTableSortOrder }): void => {
			setSortState(next);

			const comparator = Utils.getDefaultComparator(toggled.columnId, toggled.order);
			setSortedData(comparator ? [...data].sort(comparator) : data);
		},
		[]
	);

	return (
		<DataTable<DataType>
			data={sortedData}
			ariaLabel="Cross Tabulation"
			columns={columns}
			sortOptions={{ sortState, onSort }}
			cellHighlighting
		/>
	);
};
