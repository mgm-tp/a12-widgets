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
import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { BaseColumnType, RowLoadingStatus } from "@com.mgmtp.a12.widgets/widgets-core";
import { Table } from "@com.mgmtp.a12.widgets/widgets-core";

type Row = { id: number; name: string; department: string; salary: number };

const ROW_COUNT = 10000;
const BATCH_SIZE = 50;

const ALL_ROWS: Row[] = Array.from({ length: ROW_COUNT }, (_, i) => ({
	id: i + 1,
	name: `Employee ${i + 1}`,
	department: ["Engineering", "Sales", "Marketing", "Finance"][i % 4],
	salary: 50000 + (Math.floor(i * 37.3) % 100000)
}));

const columns: BaseColumnType<Row>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true },
	{ label: "Name", dataKey: "name" },
	{ label: "Department", dataKey: "department" },
	{ label: "Salary", dataGetter: ({ row }) => `$${row.salary.toLocaleString()}` }
];

interface InfiniteScrollDemoProps {
	latencyMs: number;
	threshold: number;
	minimumBatchSize: number;
	overscanRowCount: number;
}

function InfiniteScrollDemo({
	latencyMs,
	threshold,
	minimumBatchSize,
	overscanRowCount
}: InfiniteScrollDemoProps): ReactElement {
	const [tableData, setTableData] = useState<(Row | undefined)[]>(() => new Array(ROW_COUNT).fill(undefined));
	const [rowStatusMap, setRowStatusMap] = useState<Record<number, RowLoadingStatus>>({});

	const loadData = useCallback(
		({ startIndex, stopIndex }: { startIndex: number; stopIndex: number }) => {
			const stop = Math.min(stopIndex, ROW_COUNT - 1);

			setRowStatusMap((prev) => {
				const next = { ...prev };

				for (let i = startIndex; i <= stop; i++) {
					next[i] = "loading";
				}

				return next;
			});

			return new Promise<void>((resolve) =>
				setTimeout(() => {
					setTableData((prev) => {
						const next = [...prev];

						for (let i = startIndex; i <= stop; i++) {
							next[i] = ALL_ROWS[i];
						}

						return next;
					});
					setRowStatusMap((prev) => {
						const next = { ...prev };

						for (let i = startIndex; i <= stop; i++) {
							next[i] = "loaded";
						}

						return next;
					});
					resolve();
				}, latencyMs)
			);
		},
		[latencyMs]
	);

	return (
		<Table<Row>
			data={tableData}
			columns={columns}
			style={{ height: 480 }}
			infiniteScrollOptions={{
				rowLoadingStatus: (index) => rowStatusMap[index],
				rowHeight: 48,
				loadData,
				rowCount: ROW_COUNT,
				threshold,
				minimumBatchSize,
				overrideListProps: { overscanRowCount }
			}}
		/>
	);
}

const meta: Meta<InfiniteScrollDemoProps> = {
	title: "Widgets/Data Display/Table/Infinite Scroll",
	component: InfiniteScrollDemo,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"An infinite-scroll table that fetches data in batches as the user scrolls. " +
					"A background layer of animated placeholder rows (rendered via `placeHolderBodyRowRenderer`) " +
					"fills the visible area so fast scrolling never leaves a blank white gap."
			}
		}
	},
	argTypes: {
		latencyMs: {
			name: "Network latency (ms)",
			description: "Simulated fetch delay. Increase to make the placeholder background easy to see.",
			control: { type: "range", min: 0, max: 2000, step: 100 }
		},
		threshold: {
			name: "InfiniteLoader threshold",
			description: "Rows from viewport edge at which pre-fetching starts.",
			control: { type: "range", min: 5, max: 100, step: 5 }
		},
		minimumBatchSize: {
			name: "Minimum batch size",
			description: "Minimum number of rows per fetch request.",
			control: { type: "range", min: 10, max: 200, step: 10 }
		},
		overscanRowCount: {
			name: "Overscan row count",
			description: "Extra rows rendered above/below viewport to absorb moderate scroll speeds.",
			control: { type: "range", min: 0, max: 200, step: 10 }
		}
	},
	args: {
		latencyMs: 400,
		threshold: 50,
		minimumBatchSize: BATCH_SIZE,
		overscanRowCount: 100
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LargeDataSetTable: Story = {
	name: "Large Data Set Table",
	args: {
		latencyMs: 1200,
		threshold: 50,
		minimumBatchSize: 50,
		overscanRowCount: 0
	},
	parameters: {
		docs: {
			description: {
				story:
					"Latency is set to 1 200 ms and overscanRowCount to 0 to maximise the window " +
					"where placeholder rows are visible. Scroll rapidly to see the skeleton background " +
					"instead of a blank white area."
			}
		}
	}
};
