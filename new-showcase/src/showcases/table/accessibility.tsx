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

import type { ChangeEvent, ReactElement, ReactNode } from "react";
import { useCallback, useState } from "react";

import type { BaseColumnType, TableRenderPropsType } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Button,
	ButtonGroup,
	Checkbox,
	DefaultTableComponentRenderers,
	getDataByKey,
	Icon,
	MailtoLink,
	Status,
	Table,
	TextField
} from "@com.mgmtp.a12.widgets/widgets-core";

/**
 * How the generic controls of a row (checkbox, action buttons) get their accessible name:
 *
 * - `title`: the row data is embedded in the control's own `title`/`label`.
 * - `cell-ref`: the control is linked via `aria-labelledby` to itself and to the element rendered in the ID cell.
 * - `input-ref`: the control is linked via `aria-labelledby` the same way, but the ID cell renders a TextField.
 *   A referenced input contributes its value to the name, so the name resolves to the ID that is currently
 *   typed in and follows every edit.
 */
type LabelPatternType = "title" | "cell-ref" | "input-ref";

interface UserDataType {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	status: string;
	labelPattern: LabelPatternType;
}

const data: UserDataType[] = [
	{
		id: 1,
		firstName: "Lola",
		lastName: "Sporer",
		email: "lola.sporer@gmail.com",
		status: "Active",
		labelPattern: "title"
	},
	{
		id: 2,
		firstName: "Paul",
		lastName: "Walters",
		email: "paul.walters@yahoo.com",
		status: "Active",
		labelPattern: "cell-ref"
	},
	{
		id: 3,
		firstName: "Malcolm",
		lastName: "Spencer",
		email: "malcolm.spencer@hotmail.com",
		status: "Active",
		labelPattern: "input-ref"
	}
];

type ControlActionType = "select" | "edit" | "delete";

/** Id of the element rendered in the ID cell of a row, which the controls of that row are linked to. */
const idCellId = (row: UserDataType): string => `a11y-table-${row.id}-id`;

/** Id of a control of a row, which the control links to in order to contribute its own name. */
const controlId = (row: UserDataType, action: ControlActionType): string => `a11y-table-${row.id}-${action}`;

/**
 * Links a control to itself and to the content of the ID cell, e.g. "Edit USR-002". A self reference is
 * skipped while `aria-labelledby` is resolved, so the control contributes its own name - the verb of the
 * action - before the content of the cell. No further element is needed to hold the verb.
 * Rows labelled via `title` carry the row data on the control itself and need no link at all.
 */
const labelledBy = (row: UserDataType, action: ControlActionType): string | undefined =>
	row.labelPattern === "title" ? undefined : `${controlId(row, action)} ${idCellId(row)}`;

const columns: BaseColumnType<UserDataType>[] = [
	{
		label: "selection",
		dataKey: "",
		pinning: "left",
		actionColumn: true,
		hiddenText: ""
	},
	{
		label: "ID",
		dataKey: "id",
		width: 1.5,
		sortable: true,
		sortDirections: ["desc", "asc"],
		verticalAlignment: "middle"
	},
	{
		label: "First name",
		dataKey: "firstName",
		width: 1,
		fixedWidth: true,
		sortable: true,
		sortDirections: ["desc", "asc"],
		verticalAlignment: "middle"
	},
	{
		label: "Last name",
		dataKey: "lastName",
		width: 1,
		fixedWidth: true,
		sortable: true,
		sortDirections: ["desc", "asc"],
		verticalAlignment: "middle"
	},
	{
		label: "email",
		dataKey: "email",
		htmlAttributes: { title: "Email" },
		width: 2,
		sortable: true,
		sortDirections: ["desc", "asc"],
		verticalAlignment: "middle"
	},
	{ label: "Status", dataKey: "status", width: 1, verticalAlignment: "middle" },
	{
		label: "",
		dataKey: "",
		pinning: "right",
		actionColumn: true,
		horizontalAlignment: "center"
	}
];

export function Accessibility(): ReactElement {
	const [checkedRows, setCheckedRows] = useState<UserDataType[]>([]);
	const [editedId, setEditedId] = useState("USR-003");

	const handleSelectAll = useCallback(() => {
		if (checkedRows.length === data.length) {
			setCheckedRows([]);
		} else {
			setCheckedRows(data);
		}
	}, [checkedRows.length]);

	const headContentRenderer = useCallback(
		(props: TableRenderPropsType.HeadCellProps<BaseColumnType<UserDataType>>) => {
			if (props.column.label === "selection") {
				return (
					<Checkbox.Indeterminate
						id="table-accessibility-select-all"
						label="Select all/ Deselect all"
						hideLabel
						checked={checkedRows.length === data.length ? true : checkedRows.length > 0 ? "mixed" : false}
						onChange={handleSelectAll}
					/>
				);
			}

			if (props.column.label === "email") {
				return (
					<Icon iconTheme="outlined" title="Email">
						email
					</Icon>
				);
			} else {
				return DefaultTableComponentRenderers.headContentRenderer(props);
			}
		},
		[checkedRows.length, handleSelectAll]
	);

	const bodyContentRenderer = useCallback(
		({ column, row }: TableRenderPropsType.BodyContentProps<UserDataType>): ReactNode => {
			if (column.actionColumn) {
				const isRowChecked = checkedRows.includes(row);
				const labelledByTitle = row.labelPattern === "title";

				return columns.indexOf(column) === 0 ? (
					<Checkbox
						id={controlId(row, "select")}
						label={labelledByTitle ? `Select ${row.id}` : undefined}
						hideLabel
						checked={isRowChecked}
						fitToParent
						// A Checkbox has no `title` to fall back on, so the verb is given as the `aria-label` of the input.
						inputProps={
							labelledByTitle ? undefined : { "aria-label": "Select", "aria-labelledby": labelledBy(row, "select") }
						}
						onChange={(): void => {
							if (isRowChecked) {
								setCheckedRows(checkedRows.filter((highlightedRow) => highlightedRow !== row));
							} else {
								setCheckedRows([...checkedRows, row]);
							}
						}}
					/>
				) : (
					<ButtonGroup>
						<Button
							id={controlId(row, "edit")}
							icon={<Icon>edit</Icon>}
							title={labelledByTitle ? `Edit ${row.id}` : "Edit"}
							buttonAttributes={{ "aria-labelledby": labelledBy(row, "edit") }}
							onClick={(event): void => {
								event.stopPropagation();
							}}
						/>
						<Button
							id={controlId(row, "delete")}
							destructive
							icon={<Icon>delete</Icon>}
							title={labelledByTitle ? `Delete ${row.id}` : "Delete"}
							buttonAttributes={{ "aria-labelledby": labelledBy(row, "delete") }}
							onClick={(event): void => {
								event.stopPropagation();
							}}
						/>
					</ButtonGroup>
				);
			}

			if (column.dataKey === "id") {
				// The content of the ID cell is what the controls of the row are named after.
				switch (row.labelPattern) {
					case "cell-ref":
						return (
							<Status id={idCellId(row)} variant="info">
								{`USR-${String(row.id).padStart(3, "0")}`}
							</Status>
						);
					case "input-ref":
						return (
							<TextField
								id={idCellId(row)}
								label="ID"
								hideLabel
								value={editedId}
								onChange={(event: ChangeEvent<HTMLInputElement>): void => setEditedId(event.target.value)}
							/>
						);
					default:
						return row.id;
				}
			}

			if (column.dataKey === "status") {
				return <Status variant="success">{row.status}</Status>;
			}

			if (column.dataKey === "email") {
				return <MailtoLink to={row.email}>{row.email}</MailtoLink>;
			}

			return getDataByKey(row, column.dataKey ?? columns.indexOf(column)) as string;
		},
		[checkedRows, editedId]
	);

	return (
		<Table<UserDataType>
			data={data}
			columns={columns}
			componentRenderers={{ headContentRenderer, bodyContentRenderer }}
		/>
	);
}
