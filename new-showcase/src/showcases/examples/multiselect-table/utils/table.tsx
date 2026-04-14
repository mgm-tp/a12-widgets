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

import type { ReactNode, RefCallback, MouseEvent, ReactElement, FC } from "react";
import { useMemo, useState, useRef, useCallback } from "react";

import type { BaseColumnType, TableRenderPropsType } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	DefaultTableComponentRenderers,
	Table,
	Checkbox,
	Icon,
	ActionContentbox,
	ContentBoxElements,
	Pagination
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { RowObject } from "./data.js";

const COLUMNS: BaseColumnType<RowObject>[] = [
	{
		dataKey: "checked",
		label: "",
		fixedWidth: true,
		width: 0.4,
		pinning: "left",
		verticalAlignment: "middle",
		actionColumn: true
	},
	{
		dataKey: "favorite",
		label: "Favorite",
		fixedWidth: true,
		width: 0.7,
		pinning: "left",
		horizontalAlignment: "center",
		verticalAlignment: "middle"
	},
	{ dataKey: "name", label: "Full Name", verticalAlignment: "middle" },
	{ dataKey: "username", label: "Username", verticalAlignment: "middle" },
	{ dataKey: "company.name", label: "Company", verticalAlignment: "middle" },
	{ dataKey: "email", label: "Email", verticalAlignment: "middle" },
	{ dataKey: "phone", label: "Phone", verticalAlignment: "middle" }
];

const ROWS_PER_PAGE = 25;

interface MultiselectTableProps {
	data: RowObject[];
	checkedRows?: RowObject[];

	header?: ReactNode;
	footer?: ReactNode;
	subActionBar?: ReactNode;

	isShowCheckbox?: boolean;
	isSimpleTable?: boolean;

	onRowCheckboxChange?(value: boolean, row: RowObject): void;
	onHeaderCheckboxChange?(value: boolean): void;
	getCurrentPage?(handler: () => number): void;
	tableRef?: RefCallback<HTMLDivElement>;
}

const CustomCheckBox = (props: {
	checked: boolean;
	row: RowObject;
	onChange?: (value: boolean, row: RowObject) => void;
}): ReactElement => {
	const { checked, onChange, row } = props;

	return useMemo(() => {
		return (
			<Checkbox
				label="Select"
				hideLabel
				checked={checked}
				onChange={(value) => onChange?.(value, row)}
				inputProps={{ onClick: (event: MouseEvent<HTMLElement>) => event.stopPropagation() }}
			/>
		);
	}, [checked, onChange, row]);
};

export function getCurrentPageData(data: RowObject[], page: number): RowObject[] {
	return data.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
}

export const MultiselectTable: FC<MultiselectTableProps> = (props) => {
	const {
		header,
		subActionBar,
		footer,
		data,
		isShowCheckbox,
		onHeaderCheckboxChange,
		checkedRows,
		onRowCheckboxChange,
		isSimpleTable,
		getCurrentPage
	} = props;
	const [page, setPage] = useState(1);
	const [selectedRow, setSelectedRows] = useState<RowObject | undefined>(undefined);

	if (getCurrentPage) {
		getCurrentPage(() => page);
	}

	const currentPageData = getCurrentPageData(data, page);

	const currentChecked = currentPageData.filter((r) => {
		return !!checkedRows && checkedRows.includes(r);
	}).length;

	const headCheckboxValue = useMemo(() => {
		return currentChecked === 0 ? false : currentChecked === currentPageData.length ? true : "mixed";
	}, [currentChecked, currentPageData.length]);

	const tableRef = useRef<HTMLDivElement | null>(null);

	const handleOnPageChanged = useCallback((page: number) => {
		setPage(page);
	}, []);

	const getWrapperRef = useCallback(
		(ref: HTMLDivElement | null) => {
			tableRef.current = ref;
			props.tableRef?.(ref);
		},
		[props]
	);

	const headCellRenderer = useCallback(
		(props: TableRenderPropsType.HeadCellProps<BaseColumnType<RowObject>>): ReactNode => {
			if (props.column.label === "" && !isShowCheckbox) {
				return null;
			}

			return DefaultTableComponentRenderers.headCellRenderer(props);
		},
		[isShowCheckbox]
	);

	const headContentRenderer = useCallback(
		(props: TableRenderPropsType.HeadContentProps<BaseColumnType<RowObject>>, checked: boolean | "mixed" = false) => {
			if (props.column.label === "") {
				return (
					<Checkbox.Indeterminate
						checked={checked}
						onChange={(value) => onHeaderCheckboxChange?.(value)}
						label="De/Select all"
						title="De/Select all"
						hideLabel
					/>
				);
			}

			return DefaultTableComponentRenderers.headContentRenderer(props);
		},
		[onHeaderCheckboxChange]
	);

	const bodyCellRenderer = useCallback(
		(props: TableRenderPropsType.BodyCellProps<RowObject>) => {
			if (props.column.label === "" && !isShowCheckbox) {
				return null;
			}

			return DefaultTableComponentRenderers.bodyCellRenderer(props);
		},
		[isShowCheckbox]
	);

	const bodyContentRenderer = useCallback(
		(props: TableRenderPropsType.BodyContentProps<RowObject>) => {
			if (props.column.label === "") {
				return (
					isShowCheckbox &&
					CustomCheckBox({
						checked: !!checkedRows && checkedRows.includes(props.row),
						row: props.row,
						onChange: onRowCheckboxChange
					})
				);
			}

			if (props.column.label === "Favorite") {
				return props.row.favorite ? <Icon>star</Icon> : "";
			}

			return DefaultTableComponentRenderers.bodyContentRenderer(props);
		},
		[checkedRows, isShowCheckbox, onRowCheckboxChange]
	);
	const footCellRenderer = useCallback(
		(props: TableRenderPropsType.FootCellProps<BaseColumnType<RowObject>>) => {
			if (props.column.label === "" && !isShowCheckbox) {
				return null;
			}

			return DefaultTableComponentRenderers.footCellRenderer(props);
		},
		[isShowCheckbox]
	);

	const table = useMemo(() => {
		return (
			<Table<RowObject>
				data={currentPageData}
				columns={COLUMNS}
				wrapperRef={getWrapperRef}
				componentRenderers={{
					headCellRenderer: (props) => headCellRenderer(props),
					headContentRenderer: (props) => headContentRenderer(props, headCheckboxValue),
					bodyCellRenderer,
					bodyContentRenderer: (props) => bodyContentRenderer(props),
					footCellRenderer
				}}
				rowEventHandlers={({ row }) => ({ onClick: () => setSelectedRows(row) })}
				rowStyling={({ row }) => {
					return {
						selected: selectedRow === row
					};
				}}
			/>
		);
	}, [
		bodyCellRenderer,
		bodyContentRenderer,
		currentPageData,
		footCellRenderer,
		getWrapperRef,
		headCellRenderer,
		headCheckboxValue,
		headContentRenderer,
		selectedRow
	]);

	if (isSimpleTable) {
		return table;
	}

	return (
		<ActionContentbox
			padding={false}
			headingElements={header}
			subActionBar={subActionBar}
			footer={
				footer || (
					<ContentBoxElements.Footer>
						<Pagination
							id="multiselect-table-pagination"
							alignment="right"
							currentPage={page}
							pageCount={Math.ceil(data.length / ROWS_PER_PAGE)}
							onPageChanged={handleOnPageChanged}
							pageLabelTemplate="{page} / {total}"
						/>
					</ContentBoxElements.Footer>
				)
			}
		>
			{table}
		</ActionContentbox>
	);
};
