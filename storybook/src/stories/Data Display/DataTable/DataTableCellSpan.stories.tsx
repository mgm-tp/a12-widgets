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

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { DataTableColumn } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

interface SalesRow {
	region: string;
	quarter: string;
	revenue: number;
	isTotal?: boolean;
}

const SALES: SalesRow[] = [
	{ region: "EMEA", quarter: "Q1", revenue: 120 },
	{ region: "EMEA", quarter: "Q2", revenue: 138 },
	{ region: "APAC", quarter: "Q1", revenue: 96 },
	{ region: "APAC", quarter: "Q2", revenue: 104 },
	{ region: "Total", quarter: "", revenue: 458, isTotal: true }
];

// On the summary row the "Region" cell merges over the "Quarter" column so the
// "Total" label spans the two descriptive columns; all other rows stay 1:1.
const COLUMNS: DataTableColumn<SalesRow>[] = [
	{ label: "Region", dataKey: "region", width: 1, cellSpan: ({ row }) => ({ colSpan: row.isTotal ? 2 : 1 }) },
	{ label: "Quarter", dataKey: "quarter", width: 1 },
	{ label: "Revenue (k€)", dataKey: "revenue", width: 1, horizontalAlignment: "right" }
];

// A larger data set to exercise colSpan through the windowed render path. Every
// 10th row is a "section total" whose first cell spans the two label columns.
const MANY: SalesRow[] = Array.from({ length: 200 }, (_, i) => {
	const isTotal = i % 10 === 9;

	return isTotal
		? { region: `Section ${Math.floor(i / 10)} total`, quarter: "", revenue: 1000 + i, isTotal: true }
		: { region: i % 2 === 0 ? "EMEA" : "APAC", quarter: `Q${(i % 4) + 1}`, revenue: 100 + i };
});

function BasicSpanDemo() {
	return <DataTable<SalesRow> ariaLabel="Quarterly revenue with a spanning total row" data={SALES} columns={COLUMNS} />;
}

function VirtualizedSpanDemo() {
	return (
		<DataTable<SalesRow>
			ariaLabel="Spanning total rows in a virtualized table"
			data={MANY}
			columns={COLUMNS}
			maxHeight={320}
			virtualScrollOptions={{ rowHeight: 36 }}
		/>
	);
}

const meta: Meta<typeof BasicSpanDemo> = {
	title: "Data Display/DataTable/Cell Spanning",
	component: BasicSpanDemo,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SummaryRow: Story = {
	name: "Summary Row (colSpan)",
	render: () => <BasicSpanDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"A column-level `cellSpan` hook returns `{ colSpan }` per row. On the total row the first cell renders a single `<td colSpan={2}>` and the covered column emits no cell. The span is clamped to the remaining columns and never crosses a pinning boundary."
			}
		}
	}
};

export const Virtualized: Story = {
	name: "Virtualized (colSpan flows through the windowed body)",
	render: () => <VirtualizedSpanDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"`cellSpan` works in virtualized mode — every section-total row merges its label cells as it scrolls into view."
			}
		}
	}
};
