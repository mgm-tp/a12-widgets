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
import type { ReactElement } from "react";
import { useRef, useState } from "react";

import { Button, ButtonGroup, TextField } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DataTableColumn, DataTableVirtualizerHandle } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "./data-table.data.js";
import { EMPLOYEE_COLUMNS, makeEmployees } from "./data-table.data.js";
import { useInfiniteScrollData, useResizableColumns } from "./data-table.helpers.js";

const TABLE_HEIGHT = 500;
const ALL_ROWS = makeEmployees(5000);

// ─── Virtualized ─────────────────────────────────────────────────────────────

interface VirtualizedArgs {
	rowHeight: number;
	overscan: number;
}

function VirtualizedDemo({ rowHeight, overscan }: VirtualizedArgs): ReactElement {
	return (
		<DataTable<Employee>
			ariaLabel="Virtualized employees"
			data={ALL_ROWS}
			columns={EMPLOYEE_COLUMNS}
			rowKey="id"
			maxHeight={TABLE_HEIGHT}
			virtualScrollOptions={{ rowHeight, overscan }}
		/>
	);
}

function VirtualizedResizeDemo({ rowHeight, overscan }: VirtualizedArgs): ReactElement {
	const { columns, onEndResize } = useResizableColumns(EMPLOYEE_COLUMNS);

	return (
		<DataTable<Employee>
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

// ─── Dynamic row heights + imperative scroll handle ──────────────────────────

interface NotedEmployee extends Employee {
	notes: string;
}

const NOTE_SENTENCE =
	"This row's notes wrap to a different number of lines than its neighbors, so each row has its own height. ";

const NOTED_ROWS: NotedEmployee[] = makeEmployees(2000).map((row) => ({
	...row,
	notes: NOTE_SENTENCE.repeat((row.id % 5) + 1)
}));

const NOTED_COLUMNS: DataTableColumn<NotedEmployee>[] = [
	{ label: "ID", dataKey: "id", width: 0.7, fixedWidth: true, verticalAlignment: "middle" },
	{ label: "First Name", dataKey: "firstName", width: 1, verticalAlignment: "middle" },
	{ label: "Notes", dataKey: "notes", width: 3 }
];

interface DynamicHeightArgs {
	estimatedRowHeight: number;
	overscan: number;
}

function DynamicRowHeightsDemo({ estimatedRowHeight, overscan }: DynamicHeightArgs): ReactElement {
	const virtualizerHandle = useRef<DataTableVirtualizerHandle | null>(null);
	const [targetIndex, setTargetIndex] = useState("1500");

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
				<div style={{ width: 160 }}>
					<TextField label="Row index" value={targetIndex} onChange={(event) => setTargetIndex(event.target.value)} />
				</div>
				<ButtonGroup>
					<Button onClick={() => virtualizerHandle.current?.scrollToIndex(Number(targetIndex), { align: "center" })}>
						scrollToIndex
					</Button>
					<Button onClick={() => virtualizerHandle.current?.scrollToOffset(0)}>scrollToOffset(0)</Button>
					<Button onClick={() => virtualizerHandle.current?.measure()}>measure()</Button>
				</ButtonGroup>
			</div>
			<DataTable<NotedEmployee>
				ariaLabel="Dynamic row height employees"
				data={NOTED_ROWS}
				columns={NOTED_COLUMNS}
				rowKey="id"
				maxHeight={TABLE_HEIGHT}
				virtualScrollOptions={{ estimatedRowHeight, overscan, virtualizerRef: virtualizerHandle }}
			/>
		</div>
	);
}

// ─── Infinite scroll ─────────────────────────────────────────────────────────

interface InfiniteScrollArgs {
	latencyMs: number;
	threshold: number;
	minimumBatchSize: number;
	rowHeight: number;
}

function InfiniteScrollDemo({ latencyMs, threshold, minimumBatchSize, rowHeight }: InfiniteScrollArgs): ReactElement {
	const { data, rowLoadingStatus, loadData } = useInfiniteScrollData(ALL_ROWS, latencyMs);

	return (
		<DataTable<Employee>
			ariaLabel="Infinite-scroll employees"
			data={data}
			columns={EMPLOYEE_COLUMNS}
			rowKey="id"
			maxHeight={TABLE_HEIGHT}
			infiniteScrollOptions={{
				rowHeight,
				rowCount: ALL_ROWS.length,
				rowLoadingStatus,
				loadData,
				threshold,
				minimumBatchSize
			}}
		/>
	);
}

function InfiniteScrollResizeDemo({
	latencyMs,
	threshold,
	minimumBatchSize,
	rowHeight
}: InfiniteScrollArgs): ReactElement {
	const { columns, onEndResize } = useResizableColumns(EMPLOYEE_COLUMNS);
	const { data, rowLoadingStatus, loadData } = useInfiniteScrollData(ALL_ROWS, latencyMs);

	return (
		<DataTable<Employee>
			ariaLabel="Infinite-scroll resizable employees"
			data={data}
			columns={columns}
			rowKey="id"
			maxHeight={TABLE_HEIGHT}
			infiniteScrollOptions={{
				rowHeight,
				rowCount: ALL_ROWS.length,
				rowLoadingStatus,
				loadData,
				threshold,
				minimumBatchSize
			}}
			columnResizingOptions={{ onEndResize }}
		/>
	);
}

// ─── Meta ────────────────────────────────────────────────────────────────────

const INFINITE_ONLY = {
	latencyMs: { table: { disable: true } },
	threshold: { table: { disable: true } },
	minimumBatchSize: { table: { disable: true } }
};

const meta: Meta<VirtualizedArgs & InfiniteScrollArgs & DynamicHeightArgs> = {
	title: "Data Display/DataTable/Large Data",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Two strategies for long lists, both requiring a bounded `maxHeight`: **virtualization** (`virtualScrollOptions`) renders only the rows in the viewport plus an overscan buffer, and **infinite scroll** (`infiniteScrollOptions`) additionally fetches rows in batches as they approach the viewport. Infinite scroll wins when both are set. Row groups are unavailable in either mode; expansion needs dynamic row heights (see **Expandable Rows**). Migrating from the production `Table`'s react-virtualized options is covered in the showcase migration notes."
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
			name: "Load-ahead threshold (rows)",
			control: { type: "range", min: 5, max: 100, step: 5 }
		},
		minimumBatchSize: {
			name: "Minimum batch size",
			control: { type: "range", min: 10, max: 200, step: 10 }
		}
	},
	args: {
		rowHeight: 40,
		overscan: 10,
		estimatedRowHeight: 60,
		latencyMs: 400,
		threshold: 15,
		minimumBatchSize: 50
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Virtualized: Story = {
	name: "Virtualized Scroll",
	render: ({ rowHeight, overscan }) => <VirtualizedDemo rowHeight={rowHeight} overscan={overscan} />,
	argTypes: { ...INFINITE_ONLY, estimatedRowHeight: { table: { disable: true } } },
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `<DataTable<Employee>
	ariaLabel="Virtualized employees"
	data={employees} // 5000 rows
	columns={columns}
	rowKey="id"
	maxHeight={500}
	virtualScrollOptions={{ rowHeight: 40, overscan: 10 }}
/>`
			},
			description: {
				story:
					"`virtualScrollOptions={{ rowHeight }}` with a bounded `maxHeight` renders only the viewport rows (plus `overscan`). Column widths resolve exactly as in non-virtualized mode. Omit `rowHeight` for dynamic row heights (next story)."
			}
		}
	}
};

export const DynamicRowHeights: Story = {
	name: "Dynamic Row Heights + Imperative Scroll",
	render: ({ estimatedRowHeight, overscan }) => (
		<DynamicRowHeightsDemo estimatedRowHeight={estimatedRowHeight} overscan={overscan} />
	),
	argTypes: { ...INFINITE_ONLY, rowHeight: { table: { disable: true } } },
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `const virtualizerRef = useRef<DataTableVirtualizerHandle | null>(null);

<Button onClick={() => virtualizerRef.current?.scrollToIndex(1500, { align: "center" })}>scrollToIndex</Button>
<Button onClick={() => virtualizerRef.current?.scrollToOffset(0)}>scrollToOffset(0)</Button>
<Button onClick={() => virtualizerRef.current?.measure()}>measure()</Button>

<DataTable<NotedEmployee>
	ariaLabel="Dynamic row height employees"
	data={rows} // 2000 rows whose "notes" column wraps to a varying number of lines
	columns={columns}
	rowKey="id"
	maxHeight={500}
	// No rowHeight: rows are measured from the DOM, estimatedRowHeight sizes unmeasured ones.
	virtualScrollOptions={{ estimatedRowHeight: 60, overscan: 10, virtualizerRef }}
/>`
			},
			description: {
				story:
					"`virtualScrollOptions` without `rowHeight`: each rendered row is measured from the DOM and re-measured when its content resizes, with `estimatedRowHeight` as the placeholder for unmeasured rows. `virtualizerRef` receives an imperative handle with `scrollToIndex`, `scrollToOffset` and `measure` — use the controls to jump to a far row."
			}
		}
	}
};

export const VirtualizedWithResize: Story = {
	name: "Virtualized + Column Resize",
	render: ({ rowHeight, overscan }) => <VirtualizedResizeDemo rowHeight={rowHeight} overscan={overscan} />,
	argTypes: { ...INFINITE_ONLY, estimatedRowHeight: { table: { disable: true } } },
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// Persist widths reported by the resize handle back into the column definitions.
const [columns, setColumns] = useState(initialColumns);
const onEndResize: DataTableColumnResizeEventHandler<DataTableColumn<Employee>> = ({ resizedWidthsGetter }) =>
	setColumns((prev) => prev.map((column) => ({ ...column, width: resizedWidthsGetter?.(column) ?? column.width })));

<DataTable<Employee>
	ariaLabel="Virtualized resizable employees"
	data={employees}
	columns={columns}
	rowKey="id"
	maxHeight={500}
	virtualScrollOptions={{ rowHeight: 40, overscan: 10 }}
	columnResizingOptions={{ onEndResize }}
/>`
			},
			description: {
				story:
					"`virtualScrollOptions` + `columnResizingOptions` on the same table. Drag a handle in the header — the header and every virtualized body row track the new width live."
			}
		}
	}
};

export const InfiniteScroll: Story = {
	render: (args) => <InfiniteScrollDemo {...args} />,
	argTypes: { overscan: { table: { disable: true } }, estimatedRowHeight: { table: { disable: true } } },
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `const TOTAL = 5000;
const [rows, setRows] = useState<(Employee | undefined)[]>(() => new Array(TOTAL).fill(undefined));
const [status, setStatus] = useState<Record<number, DataTableRowLoadingStatus>>({});

const markRange = (start: number, stop: number, value: DataTableRowLoadingStatus) =>
	setStatus((prev) => {
		const next = { ...prev };

		for (let i = start; i <= stop; i++) {
			next[i] = value;
		}

		return next;
	});

// Called by the table for each not-yet-loaded range that approaches the viewport.
const loadData = async ({ startIndex, stopIndex }: { startIndex: number; stopIndex: number }) => {
	markRange(startIndex, stopIndex, "loading");

	const batch = await fetchEmployees(startIndex, stopIndex);

	setRows((prev) => {
		const next = [...prev];

		batch.forEach((row, i) => {
			next[startIndex + i] = row;
		});

		return next;
	});
	markRange(startIndex, stopIndex, "loaded");
};

<DataTable<Employee>
	ariaLabel="Infinite-scroll employees"
	data={rows as Employee[]}
	columns={columns}
	rowKey="id"
	maxHeight={500}
	infiniteScrollOptions={{
		rowHeight: 40,
		rowCount: TOTAL,
		rowLoadingStatus: (index) => status[index],
		loadData,
		threshold: 15,
		minimumBatchSize: 50
	}}
/>`
			},
			description: {
				story:
					'Pass `infiniteScrollOptions={{ rowHeight, rowCount, rowLoadingStatus, loadData }}` to fetch rows in batches as they approach the viewport. Rows whose status is not `"loaded"` render as skeleton placeholders. Raise the latency control and scroll fast to see them.'
			}
		}
	}
};

export const InfiniteScrollWithResize: Story = {
	name: "Infinite Scroll + Column Resize",
	render: (args) => <InfiniteScrollResizeDemo {...args} />,
	argTypes: { overscan: { table: { disable: true } }, estimatedRowHeight: { table: { disable: true } } },
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// Same loadData / rowLoadingStatus wiring as "Infinite Scroll", plus:
// Persist widths reported by the resize handle back into the column definitions.
const [columns, setColumns] = useState(initialColumns);
const onEndResize: DataTableColumnResizeEventHandler<DataTableColumn<Employee>> = ({ resizedWidthsGetter }) =>
	setColumns((prev) => prev.map((column) => ({ ...column, width: resizedWidthsGetter?.(column) ?? column.width })));

<DataTable<Employee>
	ariaLabel="Infinite-scroll resizable employees"
	data={rows as Employee[]}
	columns={columns}
	rowKey="id"
	maxHeight={500}
	infiniteScrollOptions={{ rowHeight: 40, rowCount: TOTAL, rowLoadingStatus: (index) => status[index], loadData }}
	columnResizingOptions={{ onEndResize }}
/>`
			},
			description: {
				story:
					"`infiniteScrollOptions` + `columnResizingOptions` on the same table. Column resize works live across loaded rows and placeholders alike."
			}
		}
	}
};
