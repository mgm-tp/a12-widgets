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
import { useState, useCallback } from "react";
import { styled } from "styled-components";

import type { RowEventHandlerGetter, RowsGroup } from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	DataTableColumn,
	DataTableSlotProps,
	DataTableRowStyleGetter
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTableRowsGroup } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

interface DataType {
	name: string;
	calories: number;
	fat: number;
	carbs: number;
	protein: number;
	type: string;
}

const StyledShowcaseIcon = styled(Icon)`
	&& {
		font-weight: bold;
	}
`;

/**
 * Custom row-group header content. Declared at module scope so the component
 * identity stays stable across renders. When `onGroupHeaderClick` is provided,
 * DataTableRowsGroup wraps this content in a toggle `<button>` that already
 * carries the appropriate `aria-expanded` state, so the slot only needs to
 * render the visuals: a collapse indicator plus the group title
 * (`defaultContent`).
 */
function ShowcaseRowGroupHeader({
	collapsed,
	defaultContent
}: DataTableSlotProps.RowGroupHeader<DataType>): ReactElement {
	return (
		<>
			<StyledShowcaseIcon>{collapsed ? "chevron_right" : "expand_more"}</StyledShowcaseIcon>
			{defaultContent}
		</>
	);
}

const groupData: RowsGroup<DataType>[] = [
	{
		head: { title: "Frozen dessert" },
		subRows: [
			{ name: "Frozen yoghurt", calories: 159, fat: 6.0, carbs: 24, protein: 4.0, type: "Frozen dessert" },
			{ name: "Ice cream sandwich", calories: 237, fat: 9.0, carbs: 37, protein: 4.3, type: "Frozen dessert" }
		],
		ariaLabel: "Frozen dessert"
	},
	{
		head: { title: "Pastry" },
		subRows: [
			{ name: "Eclair", calories: 262, fat: 16.0, carbs: 24, protein: 6.0, type: "Pastry" },
			{ name: "Cupcake", calories: 305, fat: 3.7, carbs: 67, protein: 4.3, type: "Pastry" },
			{ name: "Gingerbread", calories: 356, fat: 16.0, carbs: 49, protein: 3.9, type: "Pastry" }
		],
		ariaLabel: "Pastry"
	},
	{
		head: { title: "Candy" },
		subRows: [
			{ name: "Jelly Bean", calories: 375, fat: 0.0, carbs: 94, protein: 0.0, type: "Candy" },
			{ name: "Lollipop", calories: 392, fat: 0.2, carbs: 98, protein: 0.0, type: "Candy" },
			{ name: "Marshmallow", calories: 318, fat: 0, carbs: 81, protein: 2.0, type: "Candy" },
			{ name: "Nougat", calories: 360, fat: 19.0, carbs: 9, protein: 37.0, type: "Candy" }
		],
		ariaLabel: "Candy"
	},
	{
		head: { title: "Biscuit" },
		subRows: [
			{ name: "KitKat", calories: 518, fat: 26.0, carbs: 65, protein: 7.0, type: "Biscuit" },
			{ name: "Oreo", calories: 437, fat: 18.0, carbs: 63, protein: 4.0, type: "Biscuit" }
		],
		ariaLabel: "Biscuit"
	},
	{
		head: { title: "Other" },
		subRows: [{ name: "Honeycomb", calories: 408, fat: 3.2, carbs: 87, protein: 6.5, type: "Other" }],
		ariaLabel: "Other"
	}
];

const columns: DataTableColumn<DataType>[] = [
	{ label: "Dessert name", dataKey: "name", pinning: "left" },
	{ label: "Calories", dataKey: "calories" },
	{ label: "Fat", dataKey: "fat" },
	{ label: "Carbs", dataKey: "carbs" },
	{ label: "Protein", dataKey: "protein" }
];

export function RowGroupTableShowcase(): ReactElement {
	const [selectedRow, setSelectedRow] = useState<DataType | undefined>(undefined);
	const [data, setData] = useState<RowsGroup<DataType>[]>(groupData);

	const onGroupHeaderClick = useCallback((params: { group: RowsGroup<DataType>; groupIndex: number }): void => {
		setData((prevData) =>
			prevData.map((val, index) => {
				if (params.groupIndex === index) {
					return {
						...val,
						collapsed: !val.collapsed
					};
				}

				return val;
			})
		);
	}, []);

	const rowEventHandlers: RowEventHandlerGetter<DataType> = useCallback(
		({ row }) => ({ onClick: () => setSelectedRow(selectedRow === row ? undefined : row) }),
		[selectedRow]
	);

	const rowStyling: DataTableRowStyleGetter<DataType> = useCallback(
		({ row }) => ({
			selected: selectedRow === row,
			title: selectedRow === row ? "Selected" : "Selectable"
		}),
		[selectedRow]
	);

	return (
		<DataTableRowsGroup<DataType>
			data={data}
			columns={columns}
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
			onGroupHeaderClick={onGroupHeaderClick}
			slots={{ rowGroupHeader: ShowcaseRowGroupHeader }}
		/>
	);
}
