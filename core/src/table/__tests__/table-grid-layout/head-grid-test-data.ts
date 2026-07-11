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

import type { BaseColumnType } from "../../main/index.js";

// ---------------------------------------------------------------------------
// Employee – grouped columns (2 levels)
// ---------------------------------------------------------------------------

export interface Employee {
	id: number;
	firstName: string;
	lastName: string;
	department: string;
	role: string;
	status: string;
}

export const EMPLOYEES: Employee[] = [
	{
		id: 1,
		firstName: "Alice",
		lastName: "Smith",
		department: "Engineering",
		role: "Senior Engineer",
		status: "Active"
	},
	{ id: 2, firstName: "Bob", lastName: "Johnson", department: "Sales", role: "Account Manager", status: "Active" },
	{ id: 3, firstName: "Carol", lastName: "Williams", department: "Marketing", role: "Designer", status: "On Leave" },
	{ id: 4, firstName: "David", lastName: "Brown", department: "Finance", role: "Analyst", status: "Active" },
	{ id: 5, firstName: "Eve", lastName: "Davis", department: "Engineering", role: "Team Lead", status: "Active" }
];

export const GROUPED_COLUMNS: BaseColumnType<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, verticalAlignment: "middle" },
	{
		label: "Name",
		subColumns: [
			{ label: "First Name", dataKey: "firstName", width: 1, sortable: true, verticalAlignment: "middle" },
			{ label: "Last Name", dataKey: "lastName", width: 1, sortable: true, verticalAlignment: "middle" }
		]
	},
	{
		label: "Work Details",
		subColumns: [
			{ label: "Department", dataKey: "department", width: 1.5, sortable: true, verticalAlignment: "middle" },
			{ label: "Role", dataKey: "role", width: 1.5, sortable: true, verticalAlignment: "middle" }
		]
	},
	{ label: "Status", dataKey: "status", width: 1, verticalAlignment: "middle" }
];

// ---------------------------------------------------------------------------
// ContextualCard – deeply nested columns (3 levels, with pinning)
// ---------------------------------------------------------------------------

export interface ContextualCard {
	name: string;
	username: string;
	phone: string;
	email: string;
	website: string;
	dob: string;
	address: { street: string; city: string };
	company: { name: string; bs: string };
}

export const CONTEXTUAL_CARD_COLUMNS: BaseColumnType<ContextualCard>[] = [
	{
		label: "Name",
		dataKey: "name",
		pinning: "left",
		width: 0.7,
		sortable: true,
		subColumns: [
			{ label: "Username", dataKey: "username", sortable: true },
			{
				label: "Phone",
				dataKey: "phone",
				sortable: true,
				subColumns: [
					{ label: "Username", dataKey: "username", sortable: true },
					{ label: "Phone", dataKey: "phone", sortable: true }
				]
			}
		]
	},
	{
		label: "Profile",
		subColumns: [
			{ label: "Username", dataKey: "username", sortable: true },
			{ label: "Phone", dataKey: "phone", sortable: true }
		]
	},
	{ label: "Date of Birth", dataKey: "dob" },
	{
		label: "Address",
		subColumns: [
			{
				label: "E-address",
				subColumns: [
					{ label: "Email", dataKey: "email", width: 2 },
					{ label: "Website", dataKey: "website" }
				]
			},
			{
				label: "Home Address",
				subColumns: [
					{ label: "Street", dataKey: "address.street", sortable: true },
					{ label: "City", dataKey: "address.city", sortable: true }
				]
			}
		]
	},
	{
		label: "Company",
		pinning: "right",
		subColumns: [
			{ label: "Name", dataKey: "company.name", sortable: true, width: 0.7 },
			{
				label: "Business",
				dataKey: "company.bs",
				sortable: true,
				subColumns: [
					{ label: "Username", dataKey: "username", sortable: true },
					{ label: "Phone", dataKey: "phone", sortable: true }
				]
			}
		]
	}
];
