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
import { useCallback, useMemo, useState } from "react";

import type { DataTableColumn } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Button, ButtonGroup, Checkbox, Icon, MailtoLink, Status } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

interface UserDataType {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	status: string;
}

const data: UserDataType[] = [
	{
		id: 2,
		firstName: "Paul",
		lastName: "Walters",
		email: " paul.walters@yahoo.com",
		status: "Active"
	},
	{
		id: 1,
		firstName: "Lola",
		lastName: "Sporer",
		email: " lola.sporer@gmail.com",
		status: "Active"
	},
	{
		id: 3,
		firstName: "Malcolm",
		lastName: "Spencer",
		email: " malcolm.spencer@hotmail.com",
		status: "Active"
	},
	{
		id: 5,
		firstName: "Naomi",
		lastName: "Jones",
		email: " naomi.jones@yahoo.com",
		status: "Active"
	},
	{
		id: 4,
		firstName: "Christopher",
		lastName: "Kunde",
		email: " christopher.kunde@gmail.com",
		status: "Active"
	}
];

export function Accessibility(): ReactElement {
	const [checkedRows, setCheckedRows] = useState<UserDataType[]>([]);

	const handleSelectAll = useCallback(() => {
		if (checkedRows.length === data.length) {
			setCheckedRows([]);
		} else {
			setCheckedRows(data);
		}
	}, [checkedRows.length]);

	const toggleRowChecked = useCallback((row: UserDataType): void => {
		setCheckedRows((prevCheckedRows) =>
			prevCheckedRows.includes(row)
				? prevCheckedRows.filter((checkedRow) => checkedRow !== row)
				: [...prevCheckedRows, row]
		);
	}, []);

	// Column-level render hooks (`renderHeader`, `renderCell`) own the
	// presentation of individual columns while `dataKey` keeps resolving the
	// value. The hooks are plain render functions, so they may close over
	// component state — unlike `slots` components, which require a stable
	// component identity.
	const columns = useMemo(
		(): DataTableColumn<UserDataType>[] => [
			{
				label: "selection",
				dataKey: "",
				pinning: "left",
				actionColumn: true,
				hiddenText: "",
				renderHeader: () => (
					<Checkbox.Indeterminate
						label="Select all/ Deselect all"
						hideLabel
						checked={checkedRows.length === data.length ? true : checkedRows.length > 0 ? "mixed" : false}
						onChange={handleSelectAll}
					/>
				),
				renderCell: ({ row }) => (
					<Checkbox
						label={`Select ${row.id}`}
						hideLabel
						checked={checkedRows.includes(row)}
						fitToParent
						onChange={(): void => toggleRowChecked(row)}
					/>
				)
			},
			{
				label: "ID",
				dataKey: "id",
				width: 0.55,
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
				verticalAlignment: "middle",
				renderHeader: () => (
					<Icon iconTheme="outlined" title="Email">
						email
					</Icon>
				),
				renderCell: ({ row }) => <MailtoLink to={row.email}>{row.email}</MailtoLink>
			},
			{
				label: "Status",
				dataKey: "status",
				width: 1,
				verticalAlignment: "middle",
				renderCell: ({ row }) => <Status variant="success">{row.status}</Status>
			},
			{
				label: "",
				dataKey: "",
				pinning: "right",
				actionColumn: true,
				horizontalAlignment: "center",
				renderCell: ({ row }) => (
					<ButtonGroup>
						<Button
							icon={<Icon>edit</Icon>}
							title={`Edit ${row.id}`}
							onClick={(event): void => {
								event.stopPropagation();
							}}
						/>
						<Button
							destructive
							icon={<Icon>delete</Icon>}
							title={`Delete ${row.id}`}
							onClick={(event): void => {
								event.stopPropagation();
							}}
						/>
					</ButtonGroup>
				)
			}
		],
		[checkedRows, handleSelectAll, toggleRowChecked]
	);

	return <DataTable<UserDataType> data={data} columns={columns} />;
}
