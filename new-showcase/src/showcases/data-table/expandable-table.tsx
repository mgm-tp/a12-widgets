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

import type { ComponentType, ReactElement, ReactNode } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { round } from "lodash-es";
import { css, styled } from "styled-components";

import type {
	DataTableColumn,
	DataTableColumnRenderContext,
	DataTableSortOrder,
	DataTableSortState,
	DataTableRowStyles
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import {
	BufferedInput,
	Button,
	ButtonGroup,
	HiddenText,
	HTMLInputAdapter,
	Icon,
	noop,
	Pagination,
	TextField,
	TextOutput,
	Typography
} from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable, DataTableTemplate } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { getCurrentTheme } from "../../helpers/theme-selector.js";

import { Utils } from "./utils.js";

interface HistoryType {
	date: string;
	customerId: string;
	amount: number;
}
interface DataType {
	name: string;
	calories: number;
	fat: number;
	carbs: number;
	protein: number;
	price: number;
	history: HistoryType[];
}

function createData(params: Omit<DataType, "history">): DataType {
	return {
		...params,
		history: [
			{
				date: "2022-11-12",
				customerId: "Anonymous",
				amount: 3
			},
			{
				date: "2022-12-12",
				customerId: "11091700",
				amount: 1
			},
			{
				date: "2022-12-13",
				customerId: "Anonymous",
				amount: 5
			}
		]
	};
}

const DEFAULT_DATA: DataType[] = [
	createData({ name: "Frozen yoghurt", calories: 159, fat: 6.0, carbs: 24, protein: 4.0, price: 3.99 }),
	createData({ name: "Ice cream sandwich", calories: 237, fat: 9.0, carbs: 37, protein: 4.3, price: 4.99 }),
	createData({ name: "Eclair", calories: 262, fat: 16.0, carbs: 24, protein: 6.0, price: 3.79 }),
	createData({ name: "Cupcake", calories: 305, fat: 3.7, carbs: 67, protein: 4.3, price: 2.5 }),
	createData({ name: "Gingerbread", calories: 356, fat: 16.0, carbs: 49, protein: 3.9, price: 1.5 }),
	createData({ name: "Honeycomb", calories: 408, fat: 3.2, carbs: 87, protein: 6.5, price: 2.99 }),
	createData({ name: "Jelly Bean", calories: 375, fat: 0.0, carbs: 94, protein: 0.0, price: 0.99 }),
	createData({ name: "KitKat", calories: 518, fat: 26.0, carbs: 65, protein: 7.0, price: 3.49 }),
	createData({ name: "Lollipop", calories: 392, fat: 0.2, carbs: 98, protein: 0.0, price: 0.99 }),
	createData({ name: "Marshmallow", calories: 318, fat: 0, carbs: 81, protein: 2.0, price: 1.99 }),
	createData({ name: "Nougat", calories: 360, fat: 19.0, carbs: 9, protein: 37.0, price: 1.5 }),
	createData({ name: "Oreo", calories: 437, fat: 18.0, carbs: 63, protein: 4.0, price: 1.29 })
];

const ROWS_PER_PAGE = 5;

const BufferedTextField = BufferedInput(HTMLInputAdapter(TextField));

const StyledShowcaseExpandableWrapper = styled.div(() => {
	const currentTheme = getCurrentTheme();
	const isFlatTheme = currentTheme === "flat" || currentTheme === "flat-compact";

	return css`
		border: ${isFlatTheme ? "1px solid #dbdfe8" : "none"};
	`;
});

export function ExpandableTableShowcase(): ReactElement {
	const [data, setData] = useState(DEFAULT_DATA.slice(0, ROWS_PER_PAGE));
	const [selectedRow, setSelectedRow] = useState<DataType | undefined>();
	const [expandedRows, setExpandedRows] = useState<DataType[]>([]);

	const [sortState, setSortState] = useState<DataTableSortState>([]);
	const [filterEnabled, setFilterEnabled] = useState(false);
	const [filterValues, setFilterValues] = useState<any>({});
	const [shouldFocusOnMount, setShouldFocusOnMount] = useState(true);

	const [pageCount, setPageCount] = useState(Math.ceil(DEFAULT_DATA.length / ROWS_PER_PAGE));
	const [pageNumber, setPageNumber] = useState(1);

	const filterRowsRef = useRef<DataType[] | null>(null);

	const filterToggleHandler = useCallback((): void => {
		setFilterEnabled((prevState) => !prevState);
	}, []);

	const generateData = useCallback(
		(originalData: DataType[]): DataType[][] => {
			const data: DataType[][] = [];

			for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
				const offset = pageIndex * ROWS_PER_PAGE;
				data.push(originalData.slice(offset, offset + ROWS_PER_PAGE));
			}

			return data;
		},
		[pageCount]
	);

	const sort = useCallback((data: DataType[], columnId?: string, order?: DataTableSortOrder): DataType[] => {
		if (order === undefined || !columnId) {
			return data;
		}

		const comparator = Utils.getDefaultComparator(columnId, order);

		return comparator ? data.sort(comparator) : data;
	}, []);

	const onSort = useCallback(
		(next: DataTableSortState, toggled: { columnId: string; order: DataTableSortOrder }) => {
			setShouldFocusOnMount(false);
			setTimeout(() => {
				setSortState(next);
				setData(
					sort(
						generateData(filterRowsRef.current ? filterRowsRef.current : DEFAULT_DATA)[pageNumber - 1],
						toggled.columnId,
						toggled.order
					)
				);
				setShouldFocusOnMount(true);
			});
		},
		[generateData, pageNumber, sort]
	);

	const rowStyling = useCallback(
		(params: { row: DataType }): DataTableRowStyles => ({
			selected: selectedRow === params.row,
			title: selectedRow === params.row ? "Selected" : "Selectable",
			highlightVariant: expandedRows.includes(params.row) ? "info" : undefined
		}),
		[expandedRows, selectedRow]
	);

	const rowEventHandlers = useCallback(
		(params: { row: DataType }) => ({
			onClick: (): void => setSelectedRow((selectedRow) => (selectedRow === params.row ? undefined : params.row))
		}),
		[]
	);

	const handleFilterChange = useCallback(
		(value: string, column: DataTableColumn<DataType>): void => {
			const addedFilterValue: { [x: string]: string } = {};

			if (column.dataKey) {
				addedFilterValue[column.dataKey] = value;
			}

			const finalFilterValues = { ...filterValues, ...addedFilterValue };

			filterRowsRef.current = DEFAULT_DATA.filter((row) => {
				const shouldRemoveList = Object.keys(finalFilterValues).map((item) => {
					let shouldRemove = true;
					const cellValue = row[item as keyof DataType];
					const filterValue = finalFilterValues[item];

					if (
						!!filterValue &&
						!cellValue.toLocaleString().toLowerCase().includes(filterValue.toLocaleString().toLowerCase())
					) {
						shouldRemove = false;
					}

					return shouldRemove;
				});

				return shouldRemoveList.indexOf(false) === -1;
			});

			setData(generateData(filterRowsRef.current ?? DEFAULT_DATA)[0]);
			setFilterValues(finalFilterValues);
			setPageNumber(1);
			setPageCount(Math.max(1, Math.ceil(filterRowsRef.current?.length / ROWS_PER_PAGE)));
		},
		[filterValues, generateData]
	);

	const handleOnPageChanged = useCallback(
		(page: number): void => {
			let data = generateData(filterRowsRef.current ? filterRowsRef.current : DEFAULT_DATA)[page - 1];

			if (sortState[0]?.columnId) {
				data = sort(data, sortState[0].columnId, sortState[0].order);
			}

			setPageNumber(page);
			setData(data);
		},
		[generateData, sort, sortState]
	);

	// Column-level `renderFilter` hook: providing it on any column activates the
	// header filter row, so it is only attached while the filter is enabled.
	const renderColumnFilter = useCallback(
		({ column }: DataTableColumnRenderContext<DataType>): ReactNode => {
			if (!column.dataKey) {
				return null;
			}

			const value = filterValues[column.dataKey];

			return (
				<BufferedTextField
					id={`${column.dataKey}-filter-input`}
					label={`Filter by ${column.dataKey}`}
					textAlignment={column.horizontalAlignment !== "center" ? column.horizontalAlignment : undefined}
					initialValue={value}
					value={value}
					onValueSubmit={noop}
					onValueChange={(val): void => handleFilterChange(val, column)}
					onFocus={(): void => setShouldFocusOnMount(false)}
				/>
			);
		},
		[filterValues, handleFilterChange]
	);

	// Column-level render hooks (`renderHeader`, `renderCell`, `renderFilter`)
	// own the presentation of individual columns. They are plain render
	// functions, so they may close over component state — unlike `slots`
	// components, which require a stable component identity.
	const columns = useMemo((): DataTableColumn<DataType>[] => {
		const renderFilter = filterEnabled ? renderColumnFilter : undefined;

		return [
			{
				label: "",
				actionColumn: true,
				dataKey: "leftAction",
				pinning: "left",
				renderCell: ({ row }) => (
					<>
						<HiddenText>Additional content of row</HiddenText>
						<Button
							icon={<Icon size="big">{expandedRows.includes(row) ? "keyboard_arrow_down" : "keyboard_arrow_up"}</Icon>}
							onClick={(event): void => {
								setShouldFocusOnMount(true);
								event.stopPropagation();
								const newExpandedRows = [...expandedRows];
								const rowIndex = newExpandedRows.indexOf(row);

								if (rowIndex === -1) {
									newExpandedRows.push(row);
								} else {
									newExpandedRows.splice(rowIndex, 1);
								}

								setExpandedRows(newExpandedRows);
							}}
							buttonAttributes={{
								"aria-expanded": !!expandedRows.includes(row)
							}}
							title={expandedRows.includes(row) ? `Close ${row.name}` : `Open ${row.name}`}
						/>
					</>
				)
			},
			{ label: "Dessert name", dataKey: "name", sortable: true, sortDirections: ["desc", "asc"], renderFilter },
			{ label: "Calories", dataKey: "calories", sortable: true, sortDirections: ["desc", "asc"], renderFilter },
			{ label: "Fat", dataKey: "fat", sortable: true, sortDirections: ["desc", "asc"], renderFilter },
			{ label: "Carbs", dataKey: "carbs", sortable: true, sortDirections: ["desc", "asc"], renderFilter },
			{ label: "Protein", dataKey: "protein", sortable: true, sortDirections: ["desc", "asc"], renderFilter },
			{ label: "Price ($)", dataKey: "price", sortable: true, sortDirections: ["desc", "asc"], renderFilter },
			{
				label: "",
				actionColumn: true,
				horizontalAlignment: "right",
				dataKey: "rightAction",
				pinning: "right",
				renderHeader: () => (
					<Button icon={<Icon>filter_list</Icon>} title="Turn on / off filter" onClick={filterToggleHandler} />
				),
				renderCell: ({ row }) => (
					<ButtonGroup>
						<Button
							icon={<Icon>edit</Icon>}
							title={`Edit ${row.name}`}
							onClick={(event): void => {
								event.stopPropagation();
							}}
						/>
						<Button
							destructive
							icon={<Icon>delete</Icon>}
							title={`Delete ${row.name}`}
							onClick={(event): void => {
								event.stopPropagation();
							}}
						/>
					</ButtonGroup>
				)
			}
		];
	}, [expandedRows, filterEnabled, filterToggleHandler, renderColumnFilter]);

	return (
		<>
			<DataTable<DataType>
				data={data}
				columns={columns}
				// `rowExpansion.render` produces the expansion content below a body
				// row, while the optional `predicate` skips rendering for collapsed
				// rows.
				rowExpansion={{
					predicate: ({ row }) => expandedRows.includes(row),
					render: ({ row }) => (
						<AdditionalContent data={row} selected={selectedRow === row} shouldFocusOnMount={shouldFocusOnMount} />
					)
				}}
				sortOptions={{ sortState, onSort }}
				rowStyling={rowStyling}
				rowEventHandlers={rowEventHandlers}
			/>
			<Pagination
				id="extended-table-pagination"
				alignment="right"
				currentPage={pageNumber}
				pageCount={pageCount}
				onPageChanged={handleOnPageChanged}
				pageLabelTemplate="{page} / {total}"
				key="paging"
			/>
		</>
	);
}

const AdditionalContent: ComponentType<{ data: DataType; selected: boolean; shouldFocusOnMount: boolean }> = ({
	data,
	selected,
	shouldFocusOnMount
}) => {
	const [sortedData, setSortedData] = useState(data.history);
	const [sortState, setSortState] = useState<DataTableSortState>([]);
	const onSort = useCallback(
		(next: DataTableSortState, toggled: { columnId: string; order: DataTableSortOrder }) => {
			setSortState(next);

			const comparator = Utils.getDefaultComparator(toggled.columnId, toggled.order);
			setSortedData(comparator ? [...data.history].sort(comparator) : data.history);
		},
		[data.history]
	);

	// `renderFooter` on any column activates the footer row automatically —
	// no extra table prop is needed.
	const additionalContentTableColumns = useMemo(
		(): DataTableColumn<HistoryType>[] => [
			{ label: "Date", dataKey: "date", sortable: true },
			{ label: "Customer", dataKey: "customerId", sortable: true },
			{
				label: "Amount",
				dataKey: "amount",
				sortable: true,
				renderFooter: () => {
					let sum = 0;

					for (const record of data.history) {
						sum += record.amount;
					}

					return <TextOutput>Served: {sum}</TextOutput>;
				}
			},
			{
				label: "Total price ($)",
				dataKey: "total",
				renderCell: ({ row }) => round(row.amount * data.price, 2),
				renderFooter: () => {
					let totalAmount = 0;

					for (const record of data.history) {
						totalAmount += record.amount;
					}

					return (
						<TextOutput disableParagraphWrapping>
							<Icon title="Total">functions</Icon>&nbsp;
							<span>{Math.floor(totalAmount * data.price)} $</span>
						</TextOutput>
					);
				}
			}
		],
		[data.history, data.price]
	);

	return (
		<DataTableTemplate.ExpandableRow selected={selected} highlightVariant="info" focusOnMount={shouldFocusOnMount}>
			<DataTableTemplate.ExpandableRowBody>
				<Typography.Headline ariaLevel={3} level={3}>
					History
				</Typography.Headline>
				<StyledShowcaseExpandableWrapper>
					<DataTable<HistoryType>
						data={sortedData}
						columns={additionalContentTableColumns}
						sortOptions={{ sortState, onSort }}
					/>
				</StyledShowcaseExpandableWrapper>
			</DataTableTemplate.ExpandableRowBody>
			<DataTableTemplate.ExpandableRowFooter>
				<ButtonGroup alignment="right">
					<Button label="Export as..." icon={<Icon>ios_share</Icon>} />
					<Button label="Print..." icon={<Icon>print</Icon>} />
				</ButtonGroup>
			</DataTableTemplate.ExpandableRowFooter>
		</DataTableTemplate.ExpandableRow>
	);
};
