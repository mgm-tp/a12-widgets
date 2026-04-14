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

import type { FC, ReactNode } from "react";
import { useState, useRef, useCallback, useMemo } from "react";

import {
	ContentBoxElements,
	Counter,
	ButtonGroup,
	Button,
	Icon,
	ModalNotification
} from "@com.mgmtp.a12.widgets/widgets-core";

import { getCurrentPageData, MultiselectTable } from "./utils/table.js";
import { Elements } from "./utils/elements.js";
import type { RowObject } from "./utils/data.js";
import { TABLE_DATA } from "./utils/data.js";

const { ActionBarGroup, ActionBarGroupDivider } = ContentBoxElements;

export const BasicMultiselectTable: FC = () => {
	const [tableData, setTableData] = useState<RowObject[]>(TABLE_DATA);
	const [showRefreshModal, setShowRefreshModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [checkedRows, setCheckedRows] = useState<RowObject[]>([]);

	const tableRef = useRef<HTMLElement | null>(null);

	let getCurrentPage: (() => number) | undefined;

	const handleTableRef = useCallback((ref: HTMLElement | null) => {
		tableRef.current = ref;
	}, []);

	const updateFavoriteData = useCallback(() => {
		const shouldUnfavoriteAll = checkedRows.every((r) => r.favorite);
		const newTableData = tableData.map((rowData) =>
			checkedRows.includes(rowData) ? { ...rowData, favorite: !shouldUnfavoriteAll } : rowData
		);
		const newCheckedRows = checkedRows.filter((checked) => newTableData.includes(checked));
		tableRef.current?.focus();
		setTableData(newTableData);
		setCheckedRows(newCheckedRows);
	}, [checkedRows, tableData]);

	const renderSubActionBar: ReactNode = useMemo(() => {
		const counterNumber = checkedRows.length;

		return (
			<Elements.ActionBar
				leftSlot={
					<ActionBarGroup role="toolbar">
						<Counter value={counterNumber} type={counterNumber > 0 ? "constructive" : "default"} />
						<ActionBarGroupDivider />
						<ButtonGroup>
							<Button
								disabled={!counterNumber}
								icon={<Icon>star</Icon>}
								secondary
								title="Favorite"
								onClick={updateFavoriteData}
							/>
							<Button
								disabled={!counterNumber}
								icon={<Icon>delete</Icon>}
								destructive
								secondary
								title="Delete"
								onClick={(): void => setShowDeleteModal(true)}
							/>
						</ButtonGroup>
					</ActionBarGroup>
				}
				onClickRefresh={(): void => {
					setShowRefreshModal(true);
					setTableData(tableData.map((r) => ({ ...r, checked: false })));
				}}
			/>
		);
	}, [checkedRows.length, tableData, updateFavoriteData]);

	const onRowCheckBoxChange = useCallback(
		(value: boolean, row: RowObject) => {
			const newCheckedRows = value ? [...checkedRows, row] : checkedRows.filter((checkedRow) => checkedRow !== row);
			setCheckedRows(newCheckedRows);
		},
		[checkedRows]
	);

	const onHeaderCheckboxChange = useCallback(
		(value: boolean) => {
			const shouldSelectAll = checkedRows.length < tableData.length && value;
			const currentPageData = getCurrentPageData(tableData, getCurrentPage?.() ?? 1);

			const newCheckedRows = shouldSelectAll
				? [...checkedRows, ...currentPageData].reduce(
						(unique: RowObject[], item: RowObject) => (unique.includes(item) ? unique : [...unique, item]),
						[]
					)
				: checkedRows.filter((checked) => !currentPageData.includes(checked));
			setCheckedRows(newCheckedRows);
		},
		[checkedRows, getCurrentPage, tableData]
	);

	const closeRefreshModal = useCallback(() => {
		setShowRefreshModal(false);
		tableRef.current?.focus();
	}, []);

	const renderRefreshModal: ReactNode = useMemo(() => {
		return (
			showRefreshModal && (
				<Elements.InfoModal onClose={closeRefreshModal}>
					<p>Your data is up to date.</p>
				</Elements.InfoModal>
			)
		);
	}, [closeRefreshModal, showRefreshModal]);

	const deleteEntries = useCallback(() => {
		const newTableData = tableData.filter((r) => !checkedRows.includes(r));
		const newCheckedRows = checkedRows.filter((row) => newTableData.includes(row));
		tableRef.current?.focus();
		setTableData(newTableData);
		setCheckedRows(newCheckedRows);
		setShowDeleteModal(false);
	}, [checkedRows, tableData]);

	const renderDeleteModal: ReactNode = useMemo(() => {
		return (
			showDeleteModal && (
				<ModalNotification
					title="Delete entries"
					onClose={() => setShowDeleteModal(false)}
					variant="warning"
					footer={
						<ButtonGroup alignment="right">
							<Button secondary label="Cancel" onClick={() => setShowDeleteModal(false)} />
							<Button label="Ok" primary destructive onClick={deleteEntries} />
						</ButtonGroup>
					}
				>
					<p>Are you sure you want to delete the selected entries?</p>
				</ModalNotification>
			)
		);
	}, [deleteEntries, showDeleteModal]);

	return (
		<>
			<MultiselectTable
				tableRef={handleTableRef}
				data={tableData}
				checkedRows={checkedRows}
				getCurrentPage={(handler) => (getCurrentPage = handler)}
				header={<ContentBoxElements.Title text="Simple Multiselect Table" />}
				subActionBar={renderSubActionBar}
				onRowCheckboxChange={onRowCheckBoxChange}
				onHeaderCheckboxChange={onHeaderCheckboxChange}
				isShowCheckbox
			/>
			{renderRefreshModal}
			{renderDeleteModal}
		</>
	);
};
