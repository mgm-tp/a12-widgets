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

import type { FC } from "react";

import type { DataTableColumn } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

interface SalesRow {
	region: string;
	quarter: string;
	revenue: number;

	/** A synthetic "summary" row whose first cell spans the label columns. */
	isTotal?: boolean;
}

const data: SalesRow[] = [
	{ region: "EMEA", quarter: "Q1", revenue: 120 },
	{ region: "EMEA", quarter: "Q2", revenue: 138 },
	{ region: "APAC", quarter: "Q1", revenue: 96 },
	{ region: "APAC", quarter: "Q2", revenue: 104 },
	{ region: "Total", quarter: "", revenue: 458, isTotal: true }
];

const columns: DataTableColumn<SalesRow>[] = [
	{
		label: "Region",
		dataKey: "region",
		width: 1,
		// On the summary row, the "Region" cell merges over the "Quarter" column so
		// the "Total" label spans the two descriptive columns. Every other row keeps
		// the normal 1:1 column-to-cell mapping.
		cellSpan: ({ row }) => ({ colSpan: row.isTotal ? 2 : 1 })
	},
	{ label: "Quarter", dataKey: "quarter", width: 1 },
	{ label: "Revenue (k€)", dataKey: "revenue", width: 1, horizontalAlignment: "right" }
];

export const CellSpanShowcase: FC = () => (
	<DataTable<SalesRow> data={data} columns={columns} ariaLabel="Quarterly revenue with a spanning total row" />
);
