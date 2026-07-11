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

import { useCallback, useRef, useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type {
	DataTableColumn,
	DataTableColumnResizeEventHandler,
	DataTableRowLoadingStatus,
	DataTableVirtualizerHandle
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

interface Row {
	id: number;
	name: string;
	department: string;
	role: string;
	salary: number;
	status: string;
}

const TOTAL_ROWS = 5000;
const BATCH_SIZE = 50;
const ROW_HEIGHT = 40;
const TABLE_HEIGHT = 500;

const ALL_ROWS: Row[] = Array.from({ length: TOTAL_ROWS }, (_, i) => ({
	id: i + 1,
	name: `Employee ${i + 1}`,
	department: ["Engineering", "Sales", "Marketing", "Finance", "HR"][i % 5],
	role: ["Engineer", "Manager", "Designer", "Analyst", "Recruiter"][i % 5],
	salary: 50000 + (Math.floor(i * 37.3) % 100000),
	status: i % 7 === 0 ? "On Leave" : "Active"
}));

const INITIAL_COLUMNS: DataTableColumn<Row>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, verticalAlignment: "middle", pinning: "left" },
	{ label: "Name", dataKey: "name", width: 1.5, verticalAlignment: "middle", pinning: "left" },
	{ label: "Department", dataKey: "department", width: 1.2, verticalAlignment: "middle" },
	{ label: "Role", dataKey: "role", width: 1.2, verticalAlignment: "middle" },
	{
		label: "Salary",
		dataGetter: ({ row }) => `$${row.salary.toLocaleString()}`,
		width: 1,
		verticalAlignment: "middle",
		horizontalAlignment: "right"
	},
	{ label: "Status", dataKey: "status", width: 0.8, verticalAlignment: "middle" }
];

function useResizableColumns(): {
	columns: DataTableColumn<Row>[];
	onEndResize: DataTableColumnResizeEventHandler<DataTableColumn<Row>>;
} {
	const [columns, setColumns] = useState<DataTableColumn<Row>[]>(INITIAL_COLUMNS);

	const onEndResize: DataTableColumnResizeEventHandler<DataTableColumn<Row>> = useCallback(
		({ resizedWidthsGetter }) => {
			setColumns((prev) =>
				prev.map((column) => {
					const newWidth = resizedWidthsGetter?.(column);

					return newWidth === undefined ? column : { ...column, width: newWidth };
				})
			);
		},
		[]
	);

	return { columns, onEndResize };
}

// ─── Virtualized + resize ───────────────────────────────────────────────────

interface VirtualizedDemoProps {
	overscan: number;
	rowHeight: number;
}

function VirtualizedResizeDemo({ overscan, rowHeight }: VirtualizedDemoProps): ReactElement {
	const { columns, onEndResize } = useResizableColumns();

	return (
		<DataTable<Row>
			ariaLabel="Virtualized resizable employees"
			data={ALL_ROWS}
			columns={columns}
			rowKey="id"
			maxHeight={TABLE_HEIGHT}
			virtualScrollOptions={{ rowHeight, overscan }}
			columnResizingOptions={{ onEndResize }}
		/>
	);
}

// ─── Dynamic row heights + imperative scroll handle ─────────────────────────

interface DynamicRow {
	id: number;
	name: string;
	notes: string;
}

const NOTE_SENTENCE =
	"This row's notes wrap to a different number of lines than its neighbors, so each row has its own height. ";

const DYNAMIC_ROWS: DynamicRow[] = Array.from({ length: 2000 }, (_, i) => ({
	id: i + 1,
	name: `Employee ${i + 1}`,
	notes: NOTE_SENTENCE.repeat((i % 5) + 1)
}));

const DYNAMIC_COLUMNS: DataTableColumn<DynamicRow>[] = [
	{ label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, verticalAlignment: "middle" },
	{ label: "Name", dataKey: "name", width: 1, verticalAlignment: "middle" },
	{ label: "Notes", dataKey: "notes", width: 3 }
];

interface DynamicHeightDemoProps {
	estimatedRowHeight: number;
	overscan: number;
}

function DynamicRowHeightsDemo({ estimatedRowHeight, overscan }: DynamicHeightDemoProps): ReactElement {
	const virtualizerHandle = useRef<DataTableVirtualizerHandle | null>(null);
	const [targetIndex, setTargetIndex] = useState(1500);

	return (
		<div>
			<div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
				<label>
					Row index{" "}
					<input
						type="number"
						min={0}
						max={DYNAMIC_ROWS.length - 1}
						value={targetIndex}
						onChange={(event) => setTargetIndex(Number(event.target.value))}
					/>
				</label>
				<button
					type="button"
					onClick={() => virtualizerHandle.current?.scrollToIndex(targetIndex, { align: "center" })}
				>
					scrollToIndex
				</button>
				<button type="button" onClick={() => virtualizerHandle.current?.scrollToOffset(0)}>
					scrollToOffset(0)
				</button>
				<button type="button" onClick={() => virtualizerHandle.current?.measure()}>
					measure()
				</button>
			</div>
			<DataTable<DynamicRow>
				ariaLabel="Dynamic row height employees"
				data={DYNAMIC_ROWS}
				columns={DYNAMIC_COLUMNS}
				rowKey="id"
				maxHeight={TABLE_HEIGHT}
				virtualScrollOptions={{ estimatedRowHeight, overscan, virtualizerRef: virtualizerHandle }}
			/>
		</div>
	);
}

// ─── Infinite scroll + resize ───────────────────────────────────────────────

function useInfiniteScrollData(latencyMs: number): {
	data: (Row | undefined)[];
	statusMap: Record<number, DataTableRowLoadingStatus>;
	loadData: (range: { startIndex: number; stopIndex: number }) => Promise<void>;
} {
	const [data, setData] = useState<(Row | undefined)[]>(() => new Array(TOTAL_ROWS).fill(undefined));
	const [statusMap, setStatusMap] = useState<Record<number, DataTableRowLoadingStatus>>({});

	const loadData = useCallback(
		({ startIndex, stopIndex }: { startIndex: number; stopIndex: number }) => {
			const stop = Math.min(stopIndex, TOTAL_ROWS - 1);

			setStatusMap((prev) => {
				const next = { ...prev };

				for (let i = startIndex; i <= stop; i++) {
					next[i] = "loading";
				}

				return next;
			});

			return new Promise<void>((resolve) =>
				setTimeout(() => {
					setData((prev) => {
						const next = [...prev];

						for (let i = startIndex; i <= stop; i++) {
							next[i] = ALL_ROWS[i];
						}

						return next;
					});
					setStatusMap((prev) => {
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

	return { data, statusMap, loadData };
}

interface InfiniteScrollDemoProps {
	latencyMs: number;
	threshold: number;
	minimumBatchSize: number;
	rowHeight: number;
}

function InfiniteScrollResizeDemo({
	latencyMs,
	threshold,
	minimumBatchSize,
	rowHeight
}: InfiniteScrollDemoProps): ReactElement {
	const { columns, onEndResize } = useResizableColumns();
	const { data, statusMap, loadData } = useInfiniteScrollData(latencyMs);

	return (
		<DataTable<Row>
			ariaLabel="Infinite-scroll resizable employees"
			data={data as Row[]}
			columns={columns}
			rowKey="id"
			maxHeight={TABLE_HEIGHT}
			infiniteScrollOptions={{
				rowHeight,
				rowCount: TOTAL_ROWS,
				rowLoadingStatus: (index) => statusMap[index],
				loadData,
				threshold,
				minimumBatchSize
			}}
			columnResizingOptions={{ onEndResize }}
		/>
	);
}

// ─── Meta ───────────────────────────────────────────────────────────────────

const meta: Meta<VirtualizedDemoProps & InfiniteScrollDemoProps & DynamicHeightDemoProps> = {
	title: "Data Display/DataTable/Large Data",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"DataTable rendering large datasets via virtualization or infinite-scroll, " +
					"combined with column resize. The virtualized track template wraps each non-action column in " +
					"`var(--a12-col-N-width, <explicit>)` so the drag handle drives layout live; on release the new " +
					"width is reported as an `fr` ratio anchored against the rendered widths of sibling fluid columns."
			}
		}
	},
	argTypes: {
		rowHeight: {
			name: "Row height (px)",
			control: { type: "range", min: 28, max: 80, step: 4 }
		},
		overscan: {
			name: "Overscan rows",
			description: "Extra rows rendered above/below the viewport.",
			control: { type: "range", min: 0, max: 50, step: 5 }
		},
		estimatedRowHeight: {
			name: "Estimated row height (px)",
			description: "Placeholder height for not-yet-measured rows in dynamic-height mode.",
			control: { type: "range", min: 20, max: 200, step: 10 }
		},
		latencyMs: {
			name: "Network latency (ms)",
			description: "Simulated fetch delay. Increase to see placeholder rows while scrolling.",
			control: { type: "range", min: 0, max: 2000, step: 100 }
		},
		threshold: {
			name: "InfiniteLoader threshold",
			control: { type: "range", min: 5, max: 100, step: 5 }
		},
		minimumBatchSize: {
			name: "Minimum batch size",
			control: { type: "range", min: 10, max: 200, step: 10 }
		}
	},
	args: {
		rowHeight: ROW_HEIGHT,
		overscan: 10,
		estimatedRowHeight: 60,
		latencyMs: 400,
		threshold: 15,
		minimumBatchSize: BATCH_SIZE
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const VirtualizedWithResize: Story = {
	name: "Virtualized + Column Resize",
	render: ({ overscan, rowHeight }) => <VirtualizedResizeDemo overscan={overscan} rowHeight={rowHeight} />,
	argTypes: {
		latencyMs: { table: { disable: true } },
		threshold: { table: { disable: true } },
		minimumBatchSize: { table: { disable: true } }
	},
	parameters: {
		docs: {
			description: {
				story:
					"`virtualScrollOptions` + `columnResizingOptions` on the same table. Drag a handle in the header — " +
					"both the header and all virtualized body rows track the new width live."
			}
		}
	}
};

export const DynamicRowHeights: Story = {
	name: "Dynamic Row Heights + Imperative Scroll",
	render: ({ estimatedRowHeight, overscan }) => (
		<DynamicRowHeightsDemo estimatedRowHeight={estimatedRowHeight} overscan={overscan} />
	),
	argTypes: {
		rowHeight: { table: { disable: true } },
		latencyMs: { table: { disable: true } },
		threshold: { table: { disable: true } },
		minimumBatchSize: { table: { disable: true } }
	},
	parameters: {
		docs: {
			description: {
				story:
					"`virtualScrollOptions` without `rowHeight`: each rendered row is measured from the DOM " +
					"(and re-measured on resize), with `estimatedRowHeight` as the placeholder for unmeasured rows — " +
					"the migration path for tables that relied on react-virtualized's `CellMeasurer`. " +
					"`virtualizerRef` provides the imperative handle that replaces `listRef`: scrollToIndex, " +
					"scrollToOffset and measure. Scroll up and down and use the controls to jump to a far row."
			}
		}
	}
};

export const InfiniteScrollWithResize: Story = {
	name: "Infinite Scroll + Column Resize",
	render: ({ latencyMs, threshold, minimumBatchSize, rowHeight }) => (
		<InfiniteScrollResizeDemo
			latencyMs={latencyMs}
			threshold={threshold}
			minimumBatchSize={minimumBatchSize}
			rowHeight={rowHeight}
		/>
	),
	argTypes: {
		overscan: { table: { disable: true } }
	},
	parameters: {
		docs: {
			description: {
				story:
					"`infiniteScrollOptions` + `columnResizingOptions` on the same table. Rows load in batches as you " +
					"scroll; placeholder rows render via the default skeleton slot. Column resize works live across " +
					"loaded rows and placeholders alike."
			}
		}
	}
};
