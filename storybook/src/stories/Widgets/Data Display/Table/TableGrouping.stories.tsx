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

import type { ReactNode } from "react";
import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type {
	BaseColumnType,
	BaseTableRowsGroupColumnType,
	RowEventHandlerGetter,
	RowsGroup,
	RowStyleGetter,
	SortOrder,
	SortState,
	TableRenderPropsType,
	TableRowsGroupRowType
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Icon,
	isGroupHead,
	isRowGroup,
	Link,
	Table,
	TableRowsGroup,
	TableTemplate
} from "@com.mgmtp.a12.widgets/widgets-core";

interface Dessert {
	name: string;
	calories: number;
	fat: number;
	carbs: number;
	protein: number;
}

const groupData: RowsGroup<Dessert>[] = [
	{
		head: { title: "Frozen Desserts" },
		subRows: [
			{ name: "Frozen yoghurt", calories: 159, fat: 6.0, carbs: 24, protein: 4.0 },
			{ name: "Ice cream sandwich", calories: 237, fat: 9.0, carbs: 37, protein: 4.3 }
		],
		ariaLabel: "Frozen Desserts"
	},
	{
		head: { title: "Pastry" },
		subRows: [
			{ name: "Eclair", calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
			{ name: "Cupcake", calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
			{ name: "Gingerbread", calories: 356, fat: 16.0, carbs: 49, protein: 3.9 }
		],
		ariaLabel: "Pastry"
	},
	{
		head: { title: "Candy" },
		subRows: [
			{ name: "Jelly Bean", calories: 375, fat: 0.0, carbs: 94, protein: 0.0 },
			{ name: "Lollipop", calories: 392, fat: 0.2, carbs: 98, protein: 0.0 },
			{ name: "Marshmallow", calories: 318, fat: 0, carbs: 81, protein: 2.0 }
		],
		ariaLabel: "Candy"
	}
];

const GROUP_COLUMNS: BaseTableRowsGroupColumnType<Dessert>[] = [
	{ label: "Name", dataKey: "name", width: 2, verticalAlignment: "middle" },
	{ label: "Calories", dataKey: "calories", width: 1, verticalAlignment: "middle" },
	{ label: "Fat (g)", dataKey: "fat", width: 1, verticalAlignment: "middle" },
	{ label: "Carbs (g)", dataKey: "carbs", width: 1, verticalAlignment: "middle" },
	{ label: "Protein (g)", dataKey: "protein", width: 1, verticalAlignment: "middle" }
];

function RowGroupingDemo() {
	const [data, setData] = useState<RowsGroup<Dessert>[]>(groupData);
	const [selectedRow, setSelectedRow] = useState<Dessert | undefined>();

	const toggleGroup = useCallback((rowIndex?: number) => {
		setData((prev) => prev.map((group, i) => (i === rowIndex ? { ...group, collapsed: !group.collapsed } : group)));
	}, []);

	const rowGroupHeaderRenderer = useCallback(
		(props?: TableRenderPropsType.RowGroupHeaderProps<TableRowsGroupRowType<Dessert>>): ReactNode => {
			const row = props?.row as RowsGroup<Dessert>;
			const collapsed = !!row.collapsed;

			return (
				<TableTemplate.RowGroupHeader {...props} {...row} {...row.head}>
					<Link
						useAsButton
						title={collapsed ? "Expand group" : "Collapse group"}
						linkAttributes={{ "aria-expanded": !collapsed }}
						onClick={() => toggleGroup(props?.rowIndex)}
					>
						<Icon>{collapsed ? "chevron_right" : "expand_more"}</Icon>
						{row?.head?.title}
					</Link>
				</TableTemplate.RowGroupHeader>
			);
		},
		[toggleGroup]
	);

	const rowEventHandlers: RowEventHandlerGetter<TableRowsGroupRowType<Dessert>> = useCallback(({ row }) => {
		if (!isGroupHead(row) && !isRowGroup(row)) {
			return { onClick: () => setSelectedRow((prev) => (prev === row.data ? undefined : row.data)) };
		}

		return {};
	}, []);

	const rowStyling: RowStyleGetter<TableRowsGroupRowType<Dessert>> = useCallback(
		(params) => {
			if (!isGroupHead(params.row) && !isRowGroup(params.row)) {
				return {
					selected: selectedRow === params.row.data,
					title: selectedRow === params.row.data ? "Selected" : "Selectable"
				};
			}

			return {};
		},
		[selectedRow]
	);

	return (
		<TableRowsGroup<Dessert>
			data={data}
			columns={GROUP_COLUMNS}
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
			componentRenderers={{ rowGroupHeaderRenderer }}
		/>
	);
}

interface NutritionRow {
	name: string;
	calories: number;
	fat: number;
	carbs: number;
	protein: number;
}

const NUTRITION_DATA: NutritionRow[] = [
	{ name: "Frozen yoghurt", calories: 159, fat: 6.0, carbs: 24, protein: 4.0 },
	{ name: "Ice cream sandwich", calories: 237, fat: 9.0, carbs: 37, protein: 4.3 },
	{ name: "Eclair", calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
	{ name: "Cupcake", calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
	{ name: "Gingerbread", calories: 356, fat: 16.0, carbs: 49, protein: 3.9 },
	{ name: "Honeycomb", calories: 408, fat: 3.2, carbs: 87, protein: 6.5 },
	{ name: "Jelly Bean", calories: 375, fat: 0.0, carbs: 94, protein: 0.0 },
	{ name: "KitKat", calories: 518, fat: 26.0, carbs: 65, protein: 7.0 }
];

const CROSS_TAB_COLUMNS: BaseColumnType<NutritionRow>[] = [
	{ label: "Dessert name", dataKey: "name", verticalHeader: true, width: 1.5, verticalAlignment: "middle" },
	{
		label: "Calories",
		dataKey: "calories",
		sortable: true,
		sortDirections: ["asc", "desc"],
		verticalAlignment: "middle"
	},
	{ label: "Fat (g)", dataKey: "fat", sortable: true, sortDirections: ["asc", "desc"], verticalAlignment: "middle" },
	{
		label: "Carbs (g)",
		dataKey: "carbs",
		sortable: true,
		sortDirections: ["asc", "desc"],
		verticalAlignment: "middle"
	},
	{
		label: "Protein (g)",
		dataKey: "protein",
		sortable: true,
		sortDirections: ["asc", "desc"],
		verticalAlignment: "middle"
	}
];

function CrossTabulationDemo() {
	const [sortedData, setSortedData] = useState(NUTRITION_DATA);
	const [sortState, setSortState] = useState<SortState<BaseColumnType<NutritionRow>>>({});

	const onSort = useCallback((params: { column: BaseColumnType<NutritionRow>; order: SortOrder }) => {
		setSortState(params);

		if (params.column.dataKey && params.order) {
			const key = params.column.dataKey as keyof NutritionRow;
			const dir = params.order === "asc" ? 1 : -1;

			setSortedData([...NUTRITION_DATA].sort((a, b) => (a[key] < b[key] ? -dir : a[key] > b[key] ? dir : 0)));
		} else {
			setSortedData(NUTRITION_DATA);
		}
	}, []);

	return (
		<Table<NutritionRow>
			data={sortedData}
			columns={CROSS_TAB_COLUMNS}
			sortOptions={{ sortState, onSort }}
			cellHighlighting
			ariaLabel="Nutrition cross-tabulation"
		/>
	);
}

const meta: Meta = {
	title: "Data Display/Table/Table Grouping",
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RowGrouping: Story = {
	name: "Row Grouping",
	render: () => <RowGroupingDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Use `TableRowsGroup` with a `rowGroupHeaderRenderer` to render collapsible group headers. Use `isGroupHead` and `isRowGroup` guards in `rowStyling` and `rowEventHandlers` to target only data rows."
			}
		}
	}
};

export const CrossTabulation: Story = {
	name: "Cross-tabulation",
	render: () => <CrossTabulationDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"Set `verticalHeader: true` on the first column and enable `cellHighlighting` to produce a cross-tabulation layout. Hovering a cell highlights its row header and column header simultaneously."
			}
		}
	}
};
