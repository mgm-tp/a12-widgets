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

import type { ReactElement, CSSProperties, ReactNode } from "react";
import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { BaseColumnType, RowLoadingStatus, TableRenderPropsType } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, Table } from "@com.mgmtp.a12.widgets/widgets-core";

type Row = { id: number; name: string; department: string; salary: number };

const ROW_COUNT = 5000;
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

const ROW_HEIGHT = 48;
const TABLE_HEIGHT = 480;

function useInfiniteScrollData(rows: readonly Row[], latencyMs: number) {
	const rowCount = rows.length;
	const [tableData, setTableData] = useState<(Row | undefined)[]>(() => new Array(rowCount).fill(undefined));
	const [rowStatusMap, setRowStatusMap] = useState<Record<number, RowLoadingStatus>>({});

	const loadData = useCallback(
		({ startIndex, stopIndex }: { startIndex: number; stopIndex: number }) => {
			const stop = Math.min(stopIndex, rowCount - 1);

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
							next[i] = rows[i];
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
		[latencyMs, rowCount, rows]
	);

	return { tableData, rowStatusMap, loadData };
}

interface FilterableTableDemoProps {
	rows: readonly Row[];
	latencyMs: number;
}

function FilterableTableDemo({ rows, latencyMs }: FilterableTableDemoProps): ReactElement {
	const rowCount = rows.length;
	const { tableData, rowStatusMap, loadData } = useInfiniteScrollData(rows, latencyMs);

	return (
		<Table<Row>
			data={tableData}
			columns={columns}
			style={{ height: TABLE_HEIGHT }}
			infiniteScrollOptions={{
				rowLoadingStatus: (index) => rowStatusMap[index],
				rowHeight: ROW_HEIGHT,
				loadData,
				rowCount
			}}
		/>
	);
}

interface FilterableTableProps {
	rowCount: number;
	latencyMs: number;
}

function FilterableTable({ rowCount, latencyMs }: FilterableTableProps): ReactElement {
	const [filtered, setFiltered] = useState(false);
	const effectiveRows = filtered ? [ALL_ROWS[0], ALL_ROWS[rowCount - 1]] : ALL_ROWS.slice(0, rowCount);

	return (
		<>
			<Button onClick={() => setFiltered((f) => !f)} style={{ marginBottom: 8 }}>
				{filtered ? "Show all rows" : "Filter: first & last only"}
			</Button>
			<FilterableTableDemo key={`${rowCount}-${filtered}`} rows={effectiveRows} latencyMs={latencyMs} />
		</>
	);
}

interface InfiniteScrollDemoProps {
	latencyMs: number;
	threshold: number;
	minimumBatchSize: number;
	overscanRowCount: number;

	/** Used by the table with filter story only. */
	rowCount?: number;
}

function InfiniteScrollDemo({
	latencyMs,
	threshold,
	minimumBatchSize,
	overscanRowCount
}: InfiniteScrollDemoProps): ReactElement {
	const { tableData, rowStatusMap, loadData } = useInfiniteScrollData(ALL_ROWS, latencyMs);

	return (
		<Table<Row>
			data={tableData}
			columns={columns}
			style={{ height: TABLE_HEIGHT }}
			infiniteScrollOptions={{
				rowLoadingStatus: (index) => rowStatusMap[index],
				rowHeight: ROW_HEIGHT,
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
	title: "Data Display/Table/Infinite Scroll",
	component: InfiniteScrollDemo,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"An infinite-scroll table that fetches data in batches as the user scrolls. " +
					"Scroll rapidly through unloaded rows to see placeholder skeleton rows."
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

export const TableWithFilter: Story = {
	render: ({ rowCount = 500, latencyMs }) => (
		<FilterableTable key={rowCount} rowCount={rowCount} latencyMs={latencyMs} />
	),
	args: {
		rowCount: 500,
		latencyMs: 800
	},
	argTypes: {
		rowCount: {
			name: "Row count",
			description: "Total rows in the table. Use a small value (e.g. 3) to test rendering with few rows.",
			control: { type: "number", min: 1, max: 10000 }
		},
		overscanRowCount: { table: { disable: true } },
		threshold: { table: { disable: true } },
		minimumBatchSize: { table: { disable: true } }
	},
	parameters: {
		docs: {
			description: {
				story:
					"An infinite-scroll table with a filter button that switches between the full dataset " +
					"and two rows (first and last). Use the **Row count** control to set the total number of rows."
			}
		}
	}
};
const CUSTOM_ROW_RENDERER_LOADED_STYLE: CSSProperties = {
	display: "flex",
	alignItems: "center",
	gap: 16,
	padding: "0 12px",
	boxSizing: "border-box",
	borderBottom: "1px solid #e0e0e0",
	background: "linear-gradient(90deg, #f0f7ff 0%, #ffffff 100%)"
};

const CUSTOM_ROW_RENDERER_LOADING_STYLE: CSSProperties = {
	display: "flex",
	alignItems: "center",
	gap: 16,
	padding: "0 12px",
	boxSizing: "border-box",
	borderBottom: "1px dashed #e0e0e0",
	background: "#fafafa",
	color: "#bdbdbd",
	fontStyle: "italic"
};

interface CustomRowRendererDemoProps {
	rows: readonly Row[];
	latencyMs: number;
}

function CustomRowRendererDemo({ rows, latencyMs }: CustomRowRendererDemoProps): ReactElement {
	const rowCount = rows.length;
	const { tableData, rowStatusMap, loadData } = useInfiniteScrollData(rows, latencyMs);
	const isAllLoaded = Object.values(rowStatusMap).filter((s) => s === "loaded").length === rowCount;

	const rowRenderer = useCallback(
		({ index, key, style }: { index: number; key: string; style: CSSProperties }): ReactNode => {
			const row = tableData[index];
			const status = rowStatusMap[index];

			if (status === "loaded" && row) {
				return (
					<div key={key} style={{ ...style, ...CUSTOM_ROW_RENDERER_LOADED_STYLE }}>
						<span style={{ width: 60, fontWeight: 700, color: "#1565c0" }}>#{row.id}</span>
						<span style={{ flex: 1 }}>{row.name}</span>
						<span style={{ width: 120, color: "#555" }}>{row.department}</span>
						<span style={{ width: 100, textAlign: "right", color: "#2e7d32" }}>${row.salary.toLocaleString()}</span>
					</div>
				);
			}

			return (
				<div key={key} style={{ ...style, ...CUSTOM_ROW_RENDERER_LOADING_STYLE }}>
					<span>Loading row {index + 1}…</span>
				</div>
			);
		},
		[tableData, rowStatusMap]
	);

	return (
		<Table<Row>
			data={tableData}
			columns={columns}
			style={{ height: TABLE_HEIGHT }}
			infiniteScrollOptions={{
				rowLoadingStatus: (index) => rowStatusMap[index],
				rowHeight: ROW_HEIGHT,
				loadData,
				rowCount,
				overrideListProps: {
					rowRenderer,
					style: isAllLoaded
						? undefined
						: {
								background: `repeating-linear-gradient(to bottom, #fafafa 0px, #fafafa ${ROW_HEIGHT - 1}px, #e0e0e0 ${ROW_HEIGHT - 1}px, #e0e0e0 ${ROW_HEIGHT}px)`
							}
				}
			}}
		/>
	);
}

interface CustomRowRendererFilterProps {
	rowCount: number;
	latencyMs: number;
}

function CustomRowRendererFilter({ rowCount, latencyMs }: CustomRowRendererFilterProps): ReactElement {
	const [filtered, setFiltered] = useState(false);
	const effectiveRows = filtered ? [ALL_ROWS[0], ALL_ROWS[rowCount - 1]] : ALL_ROWS.slice(0, rowCount);

	return (
		<>
			<Button onClick={() => setFiltered((f) => !f)} style={{ marginBottom: 8 }}>
				{filtered ? "Show all rows" : "Filter: first & last only"}
			</Button>
			<CustomRowRendererDemo key={`${rowCount}-${filtered}`} rows={effectiveRows} latencyMs={latencyMs} />
		</>
	);
}

export const CustomRowRenderer: Story = {
	name: "Custom Row Renderer (overrideListProps)",
	render: ({ rowCount = 500, latencyMs }) => (
		<CustomRowRendererFilter key={rowCount} rowCount={rowCount} latencyMs={latencyMs} />
	),
	argTypes: {
		rowCount: {
			name: "Row count",
			description: "Total rows in the table.",
			control: { type: "number", min: 1, max: 10000 }
		},
		overscanRowCount: { table: { disable: true } },
		threshold: { table: { disable: true } },
		minimumBatchSize: { table: { disable: true } }
	},
	args: { rowCount: 500, latencyMs: 600 },
	parameters: {
		docs: {
			description: {
				story:
					"Demonstrates passing a custom `rowRenderer` via `overrideListProps`. " +
					"The custom renderer has full control over every row — it receives the row index, key, " +
					"and style from react-virtualized and renders both loaded data and the loading state itself. " +
					"Increase **Network latency** and scroll fast to see the custom loading rows."
			}
		}
	}
};

const shimmerKeyframes = `
@keyframes a12-placeholder-shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`;

function injectShimmerStyles(): void {
	if (typeof document !== "undefined" && !document.getElementById("a12-placeholder-shimmer-style")) {
		const style = document.createElement("style");

		style.id = "a12-placeholder-shimmer-style";
		style.textContent = shimmerKeyframes;
		document.head.appendChild(style);
	}
}

function CustomPlaceholderRow({ style, rowIndex }: TableRenderPropsType.PlaceHolderBodyRowProps): ReactElement {
	injectShimmerStyles();

	const shimmerStyle: CSSProperties = {
		backgroundImage: "linear-gradient(90deg, #eeeeee 25%, #f5f5f5 50%, #eeeeee 75%)",
		backgroundSize: "800px 100%",
		animation: "a12-placeholder-shimmer 1.4s infinite linear",
		borderRadius: 4
	};

	return (
		<div
			role="row"
			aria-rowindex={rowIndex + 1}
			aria-busy="true"
			style={{
				...style,
				display: "flex",
				alignItems: "center",
				gap: 12,
				padding: "0 12px",
				boxSizing: "border-box",
				borderBottom: "1px solid #f0f0f0"
			}}
		>
			<div style={{ ...shimmerStyle, width: 40, height: 14 }} />
			<div style={{ ...shimmerStyle, flex: 1, height: 14 }} />
			<div style={{ ...shimmerStyle, width: 110, height: 14 }} />
			<div style={{ ...shimmerStyle, width: 80, height: 14 }} />
		</div>
	);
}

interface CustomPlaceholderDemoProps {
	rows: readonly Row[];
	latencyMs: number;
}

function CustomPlaceholderDemo({ rows, latencyMs }: CustomPlaceholderDemoProps): ReactElement {
	const rowCount = rows.length;
	const { tableData, rowStatusMap, loadData } = useInfiniteScrollData(rows, latencyMs);
	const isAllLoaded = Object.values(rowStatusMap).filter((s) => s === "loaded").length === rowCount;

	return (
		<Table<Row>
			data={tableData}
			columns={columns}
			style={{ height: TABLE_HEIGHT }}
			infiniteScrollOptions={{
				rowLoadingStatus: (index) => rowStatusMap[index],
				rowHeight: ROW_HEIGHT,
				loadData,
				rowCount,
				overrideListProps: {
					style: isAllLoaded
						? undefined
						: {
								background: `repeating-linear-gradient(to bottom, #eeeeee 0px, #eeeeee ${ROW_HEIGHT - 1}px, #f0f0f0 ${ROW_HEIGHT - 1}px, #f0f0f0 ${ROW_HEIGHT}px)`
							}
				}
			}}
			componentRenderers={{
				placeHolderBodyRowRenderer: (props) => <CustomPlaceholderRow {...props} />
			}}
		/>
	);
}

interface CustomPlaceholderFilterProps {
	rowCount: number;
	latencyMs: number;
}

function CustomPlaceholderFilter({ rowCount, latencyMs }: CustomPlaceholderFilterProps): ReactElement {
	const [filtered, setFiltered] = useState(false);
	const effectiveRows = filtered ? [ALL_ROWS[0], ALL_ROWS[rowCount - 1]] : ALL_ROWS.slice(0, rowCount);

	return (
		<>
			<Button onClick={() => setFiltered((f) => !f)} style={{ marginBottom: 8 }}>
				{filtered ? "Show all rows" : "Filter: first & last only"}
			</Button>
			<CustomPlaceholderDemo key={`${rowCount}-${filtered}`} rows={effectiveRows} latencyMs={latencyMs} />
		</>
	);
}

export const CustomPlaceholder: Story = {
	name: "Custom Placeholder While Loading",
	render: ({ rowCount = 500, latencyMs }) => (
		<CustomPlaceholderFilter key={rowCount} rowCount={rowCount} latencyMs={latencyMs} />
	),
	argTypes: {
		rowCount: {
			name: "Row count",
			description: "Total rows in the table.",
			control: { type: "number", min: 1, max: 10000 }
		},
		threshold: { table: { disable: true } },
		minimumBatchSize: { table: { disable: true } },
		overscanRowCount: { table: { disable: true } }
	},
	args: { rowCount: 500 },
	parameters: {
		docs: {
			description: {
				story:
					"Demonstrates replacing the default skeleton row with a custom shimmer animation " +
					"via `componentRenderers.placeHolderBodyRowRenderer`. " +
					"Increase **Network latency** and scroll rapidly to see the animated shimmer rows " +
					"before data arrives."
			}
		}
	}
};
