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

import type { RowsGroup } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DataTableColumn } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "../Table/table.data.js";

export type { Employee } from "../Table/table.data.js";
export { BASIC_COLUMNS, EMPLOYEES } from "../Table/table.data.js";

const FIRST_NAMES = ["Alice", "Bob", "Carol", "David", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Clark"];
const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Finance", "HR"];
const ROLES = ["Engineer", "Manager", "Designer", "Analyst", "Recruiter"];

/**
 * Deterministic generator for the large-data stories (virtualization, infinite scroll,
 * drag-and-drop over many rows). Same `Employee` shape as the shared five-row fixture.
 */
export function makeEmployees(count: number): Employee[] {
	return Array.from({ length: count }, (_, i) => ({
		id: i + 1,
		firstName: FIRST_NAMES[i % FIRST_NAMES.length],
		lastName: LAST_NAMES[(i * 7) % LAST_NAMES.length],
		department: DEPARTMENTS[i % DEPARTMENTS.length],
		role: ROLES[(i * 3) % ROLES.length],
		status: i % 7 === 0 ? "On Leave" : "Active"
	}));
}

/** Employee columns for wide tables: every field, ID + names pinned left. */
export const EMPLOYEE_COLUMNS: DataTableColumn<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.7, fixedWidth: true, verticalAlignment: "middle", pinning: "left" },
	{ label: "First Name", dataKey: "firstName", width: 1, verticalAlignment: "middle", pinning: "left" },
	{ label: "Last Name", dataKey: "lastName", width: 1, verticalAlignment: "middle" },
	{ label: "Department", dataKey: "department", width: 1.5, verticalAlignment: "middle" },
	{ label: "Role", dataKey: "role", width: 1.5, verticalAlignment: "middle" },
	{ label: "Status", dataKey: "status", width: 1, verticalAlignment: "middle" }
];

export interface Dessert {
	name: string;
	calories: number;
	fat: number;
	carbs: number;
	protein: number;
}

export const DESSERT_GROUPS: RowsGroup<Dessert>[] = [
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

export const DESSERTS: Dessert[] = DESSERT_GROUPS.flatMap((group) => group.subRows);

/** Typed generically so rows that extend `Dessert` (e.g. with a `history`) can reuse it. */
export function dessertColumns<Row extends Dessert>(): DataTableColumn<Row>[] {
	return [
		{ label: "Name", dataKey: "name", width: 2, verticalAlignment: "middle", pinning: "left" },
		{ label: "Calories", dataKey: "calories", width: 1, verticalAlignment: "middle" },
		{ label: "Fat (g)", dataKey: "fat", width: 1, verticalAlignment: "middle" },
		{ label: "Carbs (g)", dataKey: "carbs", width: 1, verticalAlignment: "middle" },
		{ label: "Protein (g)", dataKey: "protein", width: 1, verticalAlignment: "middle" }
	];
}

export const DESSERT_COLUMNS = dessertColumns<Dessert>();

/** Employee columns with two-level headers (`subColumns`). */
export const COLUMN_GROUP_COLUMNS: DataTableColumn<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.7, fixedWidth: true, verticalAlignment: "middle", pinning: "left" },
	{
		label: "Name",
		subColumns: [
			{ label: "First", dataKey: "firstName", width: 1, verticalAlignment: "middle" },
			{ label: "Last", dataKey: "lastName", width: 1, verticalAlignment: "middle" }
		]
	},
	{
		label: "Job",
		subColumns: [
			{ label: "Department", dataKey: "department", width: 1.2, verticalAlignment: "middle" },
			{ label: "Role", dataKey: "role", width: 1.2, verticalAlignment: "middle" }
		]
	},
	{ label: "Status", dataKey: "status", width: 1, verticalAlignment: "middle" }
];

// oxlint applies the Storybook rule set to every file in storybook/; this keeps `storybook/default-exports` quiet.
export default {};
