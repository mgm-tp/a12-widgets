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

import { provider } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DataTableColumn } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { ContextualCard } from "../../helpers/definitions.js";

export type RowType = ContextualCard;
export type ColumnType = DataTableColumn<RowType>;

export const COLUMNS: ColumnType[] = [
	{
		label: "Name",
		dataKey: "name",
		pinning: "left",
		width: 0.7,
		sortable: true
	},
	{
		label: "Profile",
		subColumns: [
			{
				label: "Username",
				dataKey: "username",
				sortable: true
			},
			{ label: "Phone", dataKey: "phone", sortable: true }
		]
	},
	{
		label: "Date of Birth",
		dataKey: "dob"
	},
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
					{
						label: "Street",
						dataKey: "address.street",
						sortable: true
					},
					{
						label: "City",
						dataKey: "address.city",
						sortable: true
					}
				]
			}
		]
	},
	{
		label: "Company",
		pinning: !provider.isDesktop() ? undefined : "right",
		subColumns: [
			{ label: "Name", dataKey: "company.name", sortable: true, width: 0.7 },
			{ label: "Business", dataKey: "company.bs", sortable: true }
		]
	}
];
