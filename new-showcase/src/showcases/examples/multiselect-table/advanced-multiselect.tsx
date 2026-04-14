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

import type { FC, ChangeEvent, ReactNode } from "react";
import { useState, useRef, useCallback, useMemo } from "react";

import {
	ContentBoxElements,
	Button,
	Icon,
	ButtonGroup,
	Counter,
	Select,
	TextLineStateless,
	Toast,
	ToastGroup
} from "@com.mgmtp.a12.widgets/widgets-core";

import { getCurrentPageData, MultiselectTable } from "./utils/table.js";
import { Elements } from "./utils/elements.js";
import type { RowObject } from "./utils/data.js";
import { TABLE_DATA } from "./utils/data.js";
import { useEffectOnlyOnUpdate } from "./utils/hook.js";

const { ActionBarGroup, ActionBarGroupDivider } = ContentBoxElements;

export const MultiselectTableWithValuesInActionBar: FC = () => {
	const [tableData, setTableData] = useState<RowObject[]>(TABLE_DATA);
	const [checkedRows, setCheckedRows] = useState<RowObject[]>([]);
	const [showRefreshModal, setShowRefreshModal] = useState(false);
	const [showSelectedUsersModal, setShowSelectedUsersModal] = useState(false);
	const [showShareToast, setShowShareToast] = useState(false);
	const [multiselectExpanded, setMultiselectExpanded] = useState(false);
	const [changeCompanyData, setChangeCompanyData] = useState("");
	const [shareGroup, setShareGroup] = useState("");
	const [selectAction, setSelectAction] = useState("change-company");

	const tableRef = useRef<HTMLElement | null>(null);
	const selectedUsersButtonRef = useRef<HTMLElement | null>(null);
	const actionBarButtonRef = useRef<HTMLElement | null>(null);

	const handleTableRef = useCallback((ref: HTMLElement | null) => {
		tableRef.current = ref;
	}, []);

	let getCurrentPage: (() => number) | undefined;

	const toggleActionBar = useCallback(() => {
		setMultiselectExpanded(!multiselectExpanded);
	}, [multiselectExpanded]);

	useEffectOnlyOnUpdate(() => actionBarButtonRef.current?.focus(), [multiselectExpanded]);

	const getActionBarTriggerButtonRef = useCallback((ref: HTMLElement | null) => {
		actionBarButtonRef.current = ref;
	}, []);

	const getSelectedUsersTriggerButtonRef = useCallback((ref: HTMLElement | null) => {
		selectedUsersButtonRef.current = ref;
	}, []);
	const selectActionChange = useCallback((selectAction: string) => {
		setSelectAction(selectAction);
	}, []);

	const shareGroupsChanged = useCallback((shareGroup: string) => {
		setShareGroup(shareGroup);
	}, []);

	const onCompanyChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setChangeCompanyData(event.target.value);
	}, []);

	const doAction = useCallback(() => {
		if (selectAction === "share") {
			setShowShareToast(true);
			setShareGroup("");
			setCheckedRows([]);
		} else {
			const newTableData = tableData.map((r) => {
				const checked = checkedRows.includes(r);

				return { ...r, company: { ...r.company, name: checked ? changeCompanyData : r.company.name } };
			});

			setTableData(newTableData);
			setChangeCompanyData("");
			setCheckedRows([]);
		}

		tableRef.current?.focus();
	}, [changeCompanyData, checkedRows, selectAction, tableData]);

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

	const renderMultiselectAndActions: ReactNode = useMemo(() => {
		const triggerButton = (
			<Button
				buttonRef={getActionBarTriggerButtonRef}
				secondary
				icon={<Icon>library_add</Icon>}
				title={`${multiselectExpanded ? "Collapse" : "Expand"} functions for bulk operation`}
				onClick={toggleActionBar}
			/>
		);

		const hasCheckRow = checkedRows.length > 0;

		return multiselectExpanded ? (
			<ActionBarGroup role="toolbar">
				<ButtonGroup>
					{triggerButton}
					<Button
						buttonRef={getSelectedUsersTriggerButtonRef}
						secondary
						title="Currently selected users list"
						onClick={(): void => setShowSelectedUsersModal(true)}
					>
						<Icon>list</Icon>
						<Counter value={checkedRows.length} type={checkedRows.length > 0 ? "constructive" : "default"} />
					</Button>
				</ButtonGroup>
				<ActionBarGroupDivider />
				<div className="-u-flex">
					<Select
						onValueChanged={selectActionChange}
						value={selectAction}
						disabled={!hasCheckRow}
						className="-u-margin-r-xs -u-flex-no-shrink"
						fitToParent={false}
						items={[
							{ label: "Change Company", value: "change-company" },
							{ label: "Share", value: "share" }
						]}
					/>
					{selectAction === "share" && (
						<Select
							className="-u-margin-r-xs"
							disabled={!hasCheckRow}
							onValueChanged={shareGroupsChanged}
							value={shareGroup}
							style={{ width: 150 }}
							items={[
								{ label: "Family", value: "Family" },
								{ label: "Friends", value: "Friends" },
								{ label: "Colleagues", value: "Colleagues" },
								{ label: "Everybody", value: "Everybody" }
							]}
						/>
					)}
					{selectAction === "change-company" && (
						<TextLineStateless
							className="-u-margin-r-xs"
							disabled={!hasCheckRow}
							value={changeCompanyData}
							placeholder="Enter Company Name"
							onChange={onCompanyChange}
							style={{ width: 150 }}
						/>
					)}
					<ButtonGroup>
						<Button
							title="Go"
							icon={<Icon>play_arrow</Icon>}
							secondary
							disabled={!hasCheckRow || (selectAction === "change-company" && changeCompanyData === "")}
							onClick={doAction}
						/>
					</ButtonGroup>
				</div>
			</ActionBarGroup>
		) : (
			triggerButton
		);
	}, [
		changeCompanyData,
		checkedRows.length,
		doAction,
		getActionBarTriggerButtonRef,
		getSelectedUsersTriggerButtonRef,
		multiselectExpanded,
		onCompanyChange,
		selectAction,
		selectActionChange,
		shareGroup,
		shareGroupsChanged,
		toggleActionBar
	]);

	const renderSubActionBar: ReactNode = useMemo(() => {
		return (
			<Elements.ActionBar
				leftSlot={renderMultiselectAndActions}
				onClickRefresh={(): void => {
					setShowRefreshModal(true);
					setTableData(tableData.map((r) => ({ ...r, checked: false })));
				}}
			/>
		);
	}, [renderMultiselectAndActions, tableData]);

	const onRowCheckBoxChange = useCallback(
		(value: boolean, row: RowObject) => {
			const newCheckedRows = value ? [...checkedRows, row] : checkedRows.filter((checkedRow) => checkedRow !== row);
			setCheckedRows(newCheckedRows);
		},
		[checkedRows]
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

	const renderSelectedUsersModal: ReactNode = useMemo(() => {
		return (
			showSelectedUsersModal && (
				<Elements.InfoModal
					onClose={(): void => {
						selectedUsersButtonRef.current?.focus();
						setShowSelectedUsersModal(false);
					}}
					title="Currently Selected Users"
					padding={checkedRows.length <= 0}
				>
					{checkedRows.length > 0 ? <MultiselectTable data={checkedRows} isSimpleTable /> : <p>No selected entries.</p>}
				</Elements.InfoModal>
			)
		);
	}, [checkedRows, showSelectedUsersModal]);

	const closeShareToast = useCallback(() => {
		setShowShareToast(false);
		tableRef.current?.focus();
	}, []);

	const renderToast: ReactNode = useMemo(() => {
		return (
			showShareToast && (
				<ToastGroup>
					<Toast variant="success" header="Entries have been shared." onClose={closeShareToast} />
				</ToastGroup>
			)
		);
	}, [closeShareToast, showShareToast]);

	return (
		<>
			<MultiselectTable
				tableRef={handleTableRef}
				getCurrentPage={(handler) => (getCurrentPage = handler)}
				data={tableData}
				checkedRows={checkedRows}
				header={<ContentBoxElements.Title text="Advanced Multiselect Table" />}
				subActionBar={renderSubActionBar}
				onRowCheckboxChange={onRowCheckBoxChange}
				onHeaderCheckboxChange={onHeaderCheckboxChange}
				isShowCheckbox={multiselectExpanded}
			/>
			{renderRefreshModal}
			{renderSelectedUsersModal}
			{renderToast}
		</>
	);
};
