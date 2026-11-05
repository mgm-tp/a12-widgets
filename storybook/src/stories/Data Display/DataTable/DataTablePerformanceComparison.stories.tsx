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
import type { ProfilerOnRenderCallback, ReactElement, ReactNode } from "react";
import { Profiler, useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { styled } from "styled-components";

import type { BaseColumnType, SortOrder, SortState } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, ButtonGroup, Table } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DataTableColumn, DataTableSortState } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Employee } from "../Table/table.data.js";

/*
 * Side-by-side render-cost comparison of the production `Table` and the experimental
 * `DataTable`, for a human to look at. Nothing here asserts: the numbers come from React's
 * `<Profiler>` and are only meaningful relative to each other, in the same browser, in the
 * same run. Storybook runs the development build of React, so every absolute millisecond is
 * inflated — compare the two columns, do not quote them.
 */

// ─── Fixture ─────────────────────────────────────────────────────────────────

const FIRST_NAMES = ["Alice", "Bob", "Carol", "David", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Clark"];
const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Finance", "Support", "Legal"];
const ROLES = ["Senior Engineer", "Account Manager", "Designer", "Analyst", "Team Lead", "Consultant"];

function createRows(count: number): Employee[] {
	return Array.from({ length: count }, (_, i) => ({
		id: i + 1,
		firstName: FIRST_NAMES[i % FIRST_NAMES.length],
		lastName: LAST_NAMES[(i * 7) % LAST_NAMES.length],
		department: DEPARTMENTS[i % DEPARTMENTS.length],
		role: ROLES[(i * 3) % ROLES.length],
		status: i % 7 === 0 ? "On Leave" : "Active"
	}));
}

/*
 * The two column sets are written out in full, side by side, so a reader can see they are the
 * same table: same keys, same widths, same pinning, same sortable columns.
 */
const LEGACY_COLUMNS: BaseColumnType<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.7, fixedWidth: true, pinning: "left", verticalAlignment: "middle" },
	{ label: "First Name", dataKey: "firstName", width: 1, sortable: true, sortDirections: ["asc", "desc"] },
	{ label: "Last Name", dataKey: "lastName", width: 1, sortable: true, sortDirections: ["asc", "desc"] },
	{ label: "Department", dataKey: "department", width: 1.5 },
	{ label: "Role", dataKey: "role", width: 1.5 },
	{ label: "Status", dataKey: "status", width: 1 }
];

const DATA_TABLE_COLUMNS: DataTableColumn<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.7, fixedWidth: true, pinning: "left" },
	{ label: "First Name", dataKey: "firstName", width: 1, sortable: true },
	{ label: "Last Name", dataKey: "lastName", width: 1, sortable: true },
	{ label: "Department", dataKey: "department", width: 1.5 },
	{ label: "Role", dataKey: "role", width: 1.5 },
	{ label: "Status", dataKey: "status", width: 1 }
];

const VIEWPORT_HEIGHT = 480;

interface Sort {
	key?: keyof Employee;
	order?: "asc" | "desc";
}

function sortRows(rows: Employee[], sort: Sort): Employee[] {
	const { key, order } = sort;

	if (!key || !order) {
		return rows;
	}

	const direction = order === "asc" ? 1 : -1;

	return [...rows].sort((a, b) => (a[key] < b[key] ? -direction : a[key] > b[key] ? direction : 0));
}

// ─── Measurement ─────────────────────────────────────────────────────────────

interface Stats {
	/** Commits of the profiled subtree since mount (or since the last reset). */
	commits: number;

	/** `actualDuration` of the mount commit. */
	mountMs: number;

	/** `actualDuration` of the most recent commit. */
	lastMs: number;

	/** Sum of `actualDuration` over all commits. */
	totalMs: number;

	/** Largest single `actualDuration`. */
	maxMs: number;

	/** Wall-clock from the last toolbar click (or header click) to the first commit it caused. */
	lastLatencyMs: number | undefined;

	/** Elements currently inside the profiled subtree. */
	domNodes: number;
}

const EMPTY_STATS: Stats = {
	commits: 0,
	mountMs: 0,
	lastMs: 0,
	totalMs: 0,
	maxMs: 0,
	lastLatencyMs: undefined,
	domNodes: 0
};

/*
 * A tiny external store so the stats readout can update from inside `Profiler.onRender`
 * without re-rendering the component that owns the profiled table. If the readout were plain
 * state on that component, every commit would set state, re-render the parent, re-render the
 * table, and fire `onRender` again — the readout would be measuring itself.
 */
interface StatsStore {
	get(): Stats;
	subscribe(listener: () => void): () => void;
	update(patch: (previous: Stats) => Stats): void;
	reset(): void;
}

function createStatsStore(): StatsStore {
	let stats = EMPTY_STATS;
	const listeners = new Set<() => void>();
	const notify = (): void => listeners.forEach((listener) => listener());

	return {
		get: () => stats,
		subscribe(listener) {
			listeners.add(listener);

			return () => listeners.delete(listener);
		},
		update(patch) {
			stats = patch(stats);
			notify();
		},
		reset() {
			stats = EMPTY_STATS;
			notify();
		}
	};
}

/*
 * Stamps the moment of a user action; each profiled table consumes the stamp on its first
 * commit after it. Later commits (hover, scroll) do not overwrite the latency reading.
 */
interface InteractionClock {
	start(): void;
	consume(profilerId: string, commitTime: number): number | undefined;
}

function createInteractionClock(): InteractionClock {
	let startedAt: number | undefined;
	const pending = new Set<string>();

	return {
		start() {
			startedAt = performance.now();
			pending.clear();
			pending.add("table");
			pending.add("data-table");
		},
		consume(profilerId, commitTime) {
			if (startedAt === undefined || !pending.delete(profilerId)) {
				return undefined;
			}

			return commitTime - startedAt;
		}
	};
}

function formatMs(value: number | undefined): string {
	return value === undefined ? "–" : `${value.toFixed(1)} ms`;
}

function StatsView({ store }: { store: StatsStore }): ReactElement {
	const stats = useSyncExternalStore(store.subscribe, store.get);

	return (
		<StyledStats>
			<StyledStat>
				<dt>Commits</dt>
				<dd>{stats.commits}</dd>
			</StyledStat>
			<StyledStat>
				<dt>Mount</dt>
				<dd>{formatMs(stats.mountMs)}</dd>
			</StyledStat>
			<StyledStat>
				<dt>Last render</dt>
				<dd>{formatMs(stats.lastMs)}</dd>
			</StyledStat>
			<StyledStat>
				<dt>Click → commit</dt>
				<dd>{formatMs(stats.lastLatencyMs)}</dd>
			</StyledStat>
			<StyledStat>
				<dt>Total render</dt>
				<dd>{formatMs(stats.totalMs)}</dd>
			</StyledStat>
			<StyledStat>
				<dt>Slowest commit</dt>
				<dd>{formatMs(stats.maxMs)}</dd>
			</StyledStat>
			<StyledStat>
				<dt>DOM nodes</dt>
				<dd>{stats.domNodes.toLocaleString()}</dd>
			</StyledStat>
		</StyledStats>
	);
}

interface BenchProps {
	id: "table" | "data-table";
	title: string;
	subtitle: string;
	store: StatsStore;
	clock: InteractionClock;
	children: ReactNode;
}

function Bench({ id, title, subtitle, store, clock, children }: BenchProps): ReactElement {
	const containerRef = useRef<HTMLDivElement>(null);

	const onRender = useCallback<ProfilerOnRenderCallback>(
		(profilerId, phase, actualDuration, _baseDuration, _startTime, commitTime) => {
			// `onRender` runs in the commit phase, after DOM mutations, so the count is current.
			const domNodes = containerRef.current?.querySelectorAll("*").length ?? 0;
			const latency = clock.consume(profilerId, commitTime);

			store.update((previous) => ({
				commits: previous.commits + 1,
				mountMs: phase === "mount" ? actualDuration : previous.mountMs,
				lastMs: actualDuration,
				totalMs: previous.totalMs + actualDuration,
				maxMs: Math.max(previous.maxMs, actualDuration),
				lastLatencyMs: latency ?? previous.lastLatencyMs,
				domNodes
			}));
		},
		[clock, store]
	);

	return (
		<StyledPanel>
			<StyledPanelHeader>
				<h3>{title}</h3>
				<span>{subtitle}</span>
			</StyledPanelHeader>
			<StatsView store={store} />
			<div ref={containerRef}>
				<Profiler id={id} onRender={onRender}>
					{children}
				</Profiler>
			</div>
		</StyledPanel>
	);
}

// ─── Harness ─────────────────────────────────────────────────────────────────

interface ComparisonArgs {
	rowCount: number;
	virtualized: boolean;
	cellHighlighting: boolean;
}

const LEGACY_VIEWPORT_STYLE = { height: "100%" } as const;

function ComparisonDemo({ rowCount, virtualized, cellHighlighting }: ComparisonArgs): ReactElement {
	const [stores] = useState(() => ({ table: createStatsStore(), dataTable: createStatsStore() }));
	const [clock] = useState(createInteractionClock);

	const [generation, setGeneration] = useState(0);
	const [replaceTick, setReplaceTick] = useState(0);
	const [patchTick, setPatchTick] = useState(0);
	const [, forceParentRender] = useState(0);
	const [sort, setSort] = useState<Sort>({});

	const baseRows = useMemo(() => createRows(rowCount), [rowCount]);

	const rows = useMemo(() => {
		// "Change one cell": only row 0 gets a new object; every other row keeps its identity.
		const patched =
			patchTick === 0
				? baseRows
				: baseRows.map((row, index) =>
						index === 0 ? { ...row, status: patchTick % 2 === 1 ? "Patched" : row.status } : row
					);
		const sorted = sortRows(patched, sort);

		// "Replace data": same rows, new array identity — what a refetch that returns
		// unchanged data looks like to the table.
		return replaceTick === 0 ? sorted : [...sorted];
	}, [baseRows, sort, patchTick, replaceTick]);

	const legacySortOptions = useMemo(
		() => ({
			sortState: {
				column: LEGACY_COLUMNS.find((column) => column.dataKey === sort.key),
				order: sort.order
			} satisfies SortState<BaseColumnType<Employee>>,
			onSort: ({ column, order }: { column: BaseColumnType<Employee>; order: SortOrder }) => {
				clock.start();
				setSort({ key: column.dataKey as keyof Employee, order });
			}
		}),
		[sort, clock]
	);

	const dataTableSortOptions = useMemo(
		() => ({
			sortState: (sort.key && sort.order
				? [{ columnId: sort.key, order: sort.order }]
				: []) satisfies DataTableSortState,
			onSort: (next: DataTableSortState) => {
				clock.start();
				setSort({ key: next[0]?.columnId as keyof Employee | undefined, order: next[0]?.order });
			}
		}),
		[sort, clock]
	);

	const resetStats = useCallback(() => {
		stores.table.reset();
		stores.dataTable.reset();
	}, [stores]);

	const remount = useCallback(() => {
		resetStats();
		clock.start();
		setGeneration((value) => value + 1);
	}, [resetStats, clock]);

	const toggleSort = useCallback(() => {
		clock.start();
		setSort((current) => ({ key: "firstName", order: current.order === "asc" ? "desc" : "asc" }));
	}, [clock]);

	const replaceData = useCallback(() => {
		clock.start();
		setReplaceTick((value) => value + 1);
	}, [clock]);

	const patchOneCell = useCallback(() => {
		clock.start();
		setPatchTick((value) => value + 1);
	}, [clock]);

	const rerenderParent = useCallback(() => {
		clock.start();
		forceParentRender((value) => value + 1);
	}, [clock]);

	return (
		<StyledHarness>
			<StyledToolbar>
				<ButtonGroup>
					<Button onClick={remount}>Remount both</Button>
					<Button onClick={toggleSort}>Sort by first name</Button>
					<Button onClick={replaceData}>Replace data (same content)</Button>
					<Button onClick={patchOneCell}>Change one cell</Button>
					<Button onClick={rerenderParent}>Re-render parent (no prop change)</Button>
				</ButtonGroup>
				<Button secondary onClick={resetStats}>
					Reset counters
				</Button>
			</StyledToolbar>
			<StyledHint>
				Every button applies the same change to both tables at once. Sorting from either table's header does too. Move
				the mouse across the rows and watch <strong>Commits</strong>; scroll when virtualized.
			</StyledHint>
			<StyledGrid>
				<Bench
					id="table"
					title="Table"
					subtitle="production, use-context-selector + react-virtualized"
					store={stores.table}
					clock={clock}
				>
					{virtualized ? (
						<StyledViewport $height={VIEWPORT_HEIGHT}>
							<Table<Employee>
								key={generation}
								data={rows}
								columns={LEGACY_COLUMNS}
								sortOptions={legacySortOptions}
								cellHighlighting={cellHighlighting}
								virtualScrollOptions
								style={LEGACY_VIEWPORT_STYLE}
							/>
						</StyledViewport>
					) : (
						<Table<Employee>
							key={generation}
							data={rows}
							columns={LEGACY_COLUMNS}
							sortOptions={legacySortOptions}
							cellHighlighting={cellHighlighting}
						/>
					)}
				</Bench>
				<Bench
					id="data-table"
					title="DataTable"
					subtitle="experimental, CSS grid + @tanstack/react-virtual"
					store={stores.dataTable}
					clock={clock}
				>
					<DataTable<Employee>
						key={generation}
						ariaLabel="Employees (DataTable)"
						data={rows}
						columns={DATA_TABLE_COLUMNS}
						rowKey="id"
						sortOptions={dataTableSortOptions}
						cellHighlighting={cellHighlighting}
						maxHeight={virtualized ? VIEWPORT_HEIGHT : undefined}
						virtualScrollOptions={virtualized || undefined}
					/>
				</Bench>
			</StyledGrid>
		</StyledHarness>
	);
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const StyledHarness = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const StyledToolbar = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
`;

const StyledHint = styled.p`
	margin: 0;
	font-size: 13px;
	color: #555;
`;

const StyledGrid = styled.div`
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
	gap: 16px;
	align-items: start;

	@media (max-width: 1100px) {
		grid-template-columns: minmax(0, 1fr);
	}
`;

const StyledPanel = styled.section`
	display: flex;
	flex-direction: column;
	gap: 8px;
	min-width: 0;
	padding: 12px;
	border: 1px solid #d0d0d0;
	border-radius: 4px;
`;

const StyledPanelHeader = styled.header`
	display: flex;
	align-items: baseline;
	gap: 8px;

	h3 {
		margin: 0;
		font-size: 16px;
	}

	span {
		font-size: 12px;
		color: #777;
	}
`;

const StyledStats = styled.dl`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
	gap: 6px;
	margin: 0;
	padding: 8px;
	background: #f5f5f5;
	border-radius: 4px;
	font-variant-numeric: tabular-nums;
`;

const StyledStat = styled.div`
	dt {
		font-size: 11px;
		color: #777;
	}

	dd {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
	}
`;

const StyledViewport = styled.div<{ $height: number }>`
	height: ${({ $height }) => $height}px;
`;

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta: Meta<ComparisonArgs> = {
	title: "Data Display/DataTable/Performance Comparison",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"The production `Table` and the experimental `DataTable` rendering the **same rows and the same " +
					"columns**, each wrapped in a React `<Profiler>`. The readout above each table counts commits and " +
					"sums `actualDuration`; **Click → commit** is wall-clock from a toolbar or header click to the first " +
					"commit it caused; **DOM nodes** is a live `querySelectorAll('*')` count inside the profiled subtree.\n\n" +
					"This story exists for human verification only — there are no assertions, and Storybook runs the " +
					"development build of React, so absolute milliseconds are inflated. Read the two columns against each " +
					"other in the same run, not against any target. Things worth trying: hover across rows with cell " +
					"highlighting on and compare how the commit counters move; **Re-render parent** with identical props; " +
					"**Replace data** with a new array of the same rows; **Change one cell**; scroll a virtualized " +
					"5000-row table."
			}
		}
	},
	argTypes: {
		rowCount: {
			name: "Rows",
			control: { type: "select" },
			options: [100, 500, 1000, 5000],
			description: "Rows in both tables. Non-virtualized 5000 rows is deliberately heavy for both."
		},
		virtualized: {
			name: "Virtualized",
			control: { type: "boolean" },
			description: `Windowed rendering in a ${VIEWPORT_HEIGHT}px viewport: \`virtualScrollOptions\` on Table, \`maxHeight\` + \`virtualScrollOptions\` on DataTable.`
		},
		cellHighlighting: {
			name: "Cell highlighting",
			control: { type: "boolean" },
			description: "Row/column cross-highlight on hover — the interaction most likely to differ in render cost."
		}
	},
	args: {
		rowCount: 500,
		virtualized: false,
		cellHighlighting: true
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Both stories render the benchmark harness (two profiled tables plus a toolbar), which is
 * not what a consumer copies. The `docs.source.code` snippets therefore show only the
 * `DataTable` configuration under measurement, with the same columns as the legacy `Table`.
 */
const DATA_TABLE_COLUMNS_SNIPPET = `const columns: DataTableColumn<Employee>[] = [
	{ label: "ID", dataKey: "id", width: 0.7, fixedWidth: true, pinning: "left" },
	{ label: "First Name", dataKey: "firstName", width: 1, sortable: true },
	{ label: "Last Name", dataKey: "lastName", width: 1, sortable: true },
	{ label: "Department", dataKey: "department", width: 1.5 },
	{ label: "Role", dataKey: "role", width: 1.5 },
	{ label: "Status", dataKey: "status", width: 1 }
];

const [sortState, setSortState] = useState<DataTableSortState>([]);
const rows = useMemo(() => sortRows(employees, sortState), [employees, sortState]);
`;

export const SideBySide: Story = {
	name: "Side by Side",
	render: (args) => <ComparisonDemo {...args} />,
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `${DATA_TABLE_COLUMNS_SNIPPET}
// 500 rows, not virtualized: the table grows to its natural height.
<DataTable<Employee>
	ariaLabel="Employees (DataTable)"
	data={rows}
	columns={columns}
	rowKey="id"
	sortOptions={{ sortState, onSort: setSortState }}
	cellHighlighting
/>`
			}
		}
	}
};

export const VirtualizedSideBySide: Story = {
	name: "Virtualized, 5000 Rows",
	args: { rowCount: 5000, virtualized: true },
	render: (args) => <ComparisonDemo {...args} />,
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `${DATA_TABLE_COLUMNS_SNIPPET}
// 5000 rows, windowed inside a ${VIEWPORT_HEIGHT}px scroll viewport.
<DataTable<Employee>
	ariaLabel="Employees (DataTable)"
	data={rows}
	columns={columns}
	rowKey="id"
	sortOptions={{ sortState, onSort: setSortState }}
	cellHighlighting
	maxHeight={${VIEWPORT_HEIGHT}}
	virtualScrollOptions
/>`
			}
		}
	}
};
