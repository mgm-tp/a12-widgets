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

import type { ReactNode, ReactElement } from "react";
import { useState, useCallback } from "react";
import { styled, css } from "styled-components";

import type {
	BaseTableRowsGroupColumnType,
	TableRowsGroupRowType,
	RowEventHandlerGetter,
	RowsGroup,
	TableRenderPropsType,
	RowStyleGetter
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	TableRowsGroup,
	isGroupHead,
	isRowGroup,
	TableTemplate,
	Icon,
	Link,
	getHorizontalSpace
} from "@com.mgmtp.a12.widgets/widgets-core";

import { getCurrentTheme } from "../../helpers/theme-selector.js";

interface DataType {
	name: string;
	calories: number;
	fat: number;
	carbs: number;
	protein: number;
	type: string;
}

const StyledShowcaseRowGroupHeader = styled(TableTemplate.RowGroupHeader)<{
	$isDefaultTheme?: boolean;
	$isFlatTheme?: boolean;
}>(({ theme, $isDefaultTheme, $isFlatTheme }) => {
	const { spacing } = theme;
	const bodyCellPaddingLeft = $isDefaultTheme
		? `${spacing.horizontalSpacing.horizWhiteSpacingxs}px`
		: $isFlatTheme
			? `${spacing.horizontalSpacing.horizWhiteSpacinglg}px`
			: `${spacing.horizontalSpacing.horizWhiteSpacingsm}px`;

	return css`
		padding-left: calc(
			${bodyCellPaddingLeft} +
				${getHorizontalSpace(
					"left",
					`${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`
				)}
		);
	`;
});

const StyledShowcaseIcon = styled(Icon)`
	&& {
		font-weight: bold;
	}
`;

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

const columns: BaseTableRowsGroupColumnType<DataType>[] = [
	{ label: "Dessert name", dataKey: "name", pinning: "left" },
	{ label: "Calories", dataKey: "calories" },
	{ label: "Fat", dataKey: "fat" },
	{ label: "Carbs", dataKey: "carbs" },
	{ label: "Protein", dataKey: "protein" }
];

export function RowGroupTableShowcase(): ReactElement {
	const [selectedRow, setSelectedRow] = useState<DataType | undefined>(undefined);
	const [data, setData] = useState<RowsGroup<DataType>[]>(groupData);

	const toggleExpanse = useCallback(
		(rowIndex?: number): void => {
			const result = data.map((val, index) => {
				if (rowIndex === index) {
					return {
						...val,
						collapsed: !val.collapsed
					};
				}

				return val;
			});
			setData(result);
		},
		[data]
	);

	const rowGroupHeaderRenderer = useCallback(
		(props?: TableRenderPropsType.RowGroupHeaderProps<TableRowsGroupRowType<DataType>>): ReactNode => {
			const row = props?.row as RowsGroup<DataType>;
			const rowIndex = props?.rowIndex;
			const collapsed = !!row.collapsed;
			const linkTitle = collapsed ? "Expand group" : "Collapse group";

			return (
				<StyledShowcaseRowGroupHeader
					{...props}
					{...row}
					{...row.head}
					$isDefaultTheme={getCurrentTheme() === "default"}
					$isFlatTheme={getCurrentTheme() === "flat"}
				>
					<Link
						useAsButton
						title={linkTitle}
						linkAttributes={{ "aria-expanded": !collapsed }}
						onClick={(): void => toggleExpanse(rowIndex)}
					>
						<StyledShowcaseIcon>{collapsed ? "chevron_right" : "expand_more"}</StyledShowcaseIcon>
						{row?.head?.title}
					</Link>
				</StyledShowcaseRowGroupHeader>
			);
		},
		[toggleExpanse]
	);

	const rowEventHandlers: RowEventHandlerGetter<TableRowsGroupRowType<DataType>> = useCallback(
		({ row }) => {
			if (!isGroupHead(row) && !isRowGroup(row)) {
				return { onClick: () => setSelectedRow(selectedRow === row.data ? undefined : row.data) };
			}

			return {};
		},
		[selectedRow]
	);

	const rowStyling: RowStyleGetter<TableRowsGroupRowType<DataType>> = useCallback(
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
		<TableRowsGroup<DataType>
			data={data}
			columns={columns}
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
			componentRenderers={{
				rowGroupHeaderRenderer
			}}
		/>
	);
}
