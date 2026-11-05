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
import type { Key, ReactElement, ReactNode } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { styled } from "styled-components";

import { Button, ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	DataTableColumn,
	DataTableHorizontalScrollHandle,
	DataTreeTableRowMeta
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTreeTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

/*
 * Feasibility spike: can a consumer build a Jira-Plans-style timeline on top of
 * `DataTreeTable` using only the public `experimental` entry point?
 *
 * The whole approach rests on four public capabilities:
 *   1. `pinning: "left"` keeps the tree columns fixed while the rest scrolls
 *      horizontally — that is the Plans split-pane, for free.
 *   2. `renderCell` / `renderHeader` return arbitrary `ReactNode`, so one very
 *      wide "Timeline" column can host an absolutely-positioned bar track.
 *   3. `onVisibleRowsChange` reports each rendered row's ordinal index and
 *      depth, which is what makes dependency arrows possible.
 *   4. `rowHeight` pins a uniform row height, and `horizontalScrollRef` drives
 *      the time axis ("scroll to today").
 *
 * Bars are positioned in **percentages** of the timeline cell, never pixels.
 * Column `width` is a ratio (x150 when `fixedWidth`), so percentages keep the
 * geometry independent of the column's resolved pixel width.
 */

const DAY_MS = 86_400_000;

/** Fixed "today" so the story renders deterministically across runs. */
const TODAY = new Date("2026-07-31T00:00:00Z");

/** Body row height, handed to the table's `rowHeight` so arrow geometry can rely on it. */
const ROW_HEIGHT = 40;

/** Combined width of the two pinned tree columns (`width * 150` each). */
const PINNED_WIDTH = 2.2 * 150 + 0.8 * 150;

/** Horizontal gap between a bar's end and the elbow of an outgoing arrow. */
const ARROW_GAP = 10;

type PlanKind = "initiative" | "epic" | "story";

interface PlanItem {
	id: string;
	name: string;
	kind: PlanKind;
	team: string;
	start: string;
	end: string;

	/** Completion ratio, 0..1 — drawn as a fill inside the bar. */
	progress: number;

	/** Ids this item cannot start before. Finish-to-start only. */
	dependsOn?: string[];
	children?: PlanItem[];
}

const PLAN: PlanItem[] = [
	{
		id: "init-checkout",
		name: "Checkout revamp",
		kind: "initiative",
		team: "Payments",
		start: "2026-06-01",
		end: "2026-09-30",
		progress: 0.45,
		children: [
			{
				id: "epic-cart",
				name: "Cart service",
				kind: "epic",
				team: "Payments",
				start: "2026-06-01",
				end: "2026-07-15",
				progress: 0.9,
				children: [
					{
						id: "story-cart-api",
						name: "Cart API endpoints",
						kind: "story",
						team: "Payments",
						start: "2026-06-01",
						end: "2026-06-20",
						progress: 1
					},
					{
						id: "story-cart-ui",
						name: "Cart drawer UI",
						kind: "story",
						team: "Web",
						start: "2026-06-15",
						end: "2026-07-15",
						progress: 0.8
					}
				]
			},
			{
				id: "epic-payment",
				name: "Payment provider",
				kind: "epic",
				team: "Payments",
				start: "2026-07-27",
				end: "2026-09-10",
				progress: 0.2,
				dependsOn: ["epic-cart"],
				children: [
					{
						id: "story-psp",
						name: "PSP integration",
						kind: "story",
						team: "Payments",
						start: "2026-07-27",
						end: "2026-08-20",
						progress: 0.35
					},
					{
						id: "story-3ds",
						name: "3-D Secure flow",
						kind: "story",
						team: "Payments",
						start: "2026-08-15",
						end: "2026-09-10",
						progress: 0
					}
				]
			}
		]
	},
	{
		id: "init-search",
		name: "Search relevance",
		kind: "initiative",
		team: "Discovery",
		start: "2026-07-01",
		end: "2026-11-15",
		progress: 0.15,
		children: [
			{
				id: "epic-index",
				name: "Indexing pipeline",
				kind: "epic",
				team: "Discovery",
				start: "2026-07-01",
				end: "2026-08-31",
				progress: 0.5
			},
			{
				id: "epic-ranking",
				name: "Ranking model",
				kind: "epic",
				team: "Data",
				start: "2026-09-14",
				end: "2026-11-15",
				progress: 0,
				dependsOn: ["epic-index"]
			}
		]
	}
];

/* ------------------------------------------------------------------ axis --- */

const parseDate = (iso: string): Date => new Date(`${iso}T00:00:00Z`);

const daysBetween = (from: Date, to: Date): number => Math.round((to.getTime() - from.getTime()) / DAY_MS);

const addMonthsUTC = (date: Date, months: number): Date =>
	new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));

interface Axis {
	start: Date;
	totalDays: number;

	/** Left edge of `date` as a percentage of the whole axis. */
	pct: (date: Date) => number;
	months: { key: string; label: string; leftPct: number; widthPct: number }[];
}

/** Builds a month-aligned axis spanning every item in the plan. */
const buildAxis = (items: PlanItem[]): Axis => {
	const all: PlanItem[] = [];
	const walk = (list: PlanItem[]): void => {
		for (const item of list) {
			all.push(item);

			if (item.children) {
				walk(item.children);
			}
		}
	};

	walk(items);

	const earliest = all.reduce((min, i) => Math.min(min, parseDate(i.start).getTime()), Infinity);
	const latest = all.reduce((max, i) => Math.max(max, parseDate(i.end).getTime()), -Infinity);

	// Snap outwards to whole months so the header scale has no partial columns.
	const start = new Date(Date.UTC(new Date(earliest).getUTCFullYear(), new Date(earliest).getUTCMonth(), 1));
	const endExclusive = addMonthsUTC(new Date(latest), 1);
	const totalDays = daysBetween(start, endExclusive);

	const pct = (date: Date): number => (daysBetween(start, date) / totalDays) * 100;

	const months: Axis["months"] = [];

	for (let cursor = start; cursor < endExclusive; cursor = addMonthsUTC(cursor, 1)) {
		const next = addMonthsUTC(cursor, 1);
		months.push({
			key: cursor.toISOString(),
			label: cursor.toLocaleString("en", { month: "short", year: "2-digit", timeZone: "UTC" }),
			leftPct: pct(cursor),
			widthPct: (daysBetween(cursor, next) / totalDays) * 100
		});
	}

	return { start, totalDays, pct, months };
};

/** Inclusive-end bar geometry, in percent of the axis. */
const barGeometry = (axis: Axis, item: PlanItem): { leftPct: number; widthPct: number } => {
	const leftPct = axis.pct(parseDate(item.start));
	// +1 day so a task ending on the 20th covers the 20th.
	const endPct = axis.pct(new Date(parseDate(item.end).getTime() + DAY_MS));

	return { leftPct, widthPct: endPct - leftPct };
};

/* -------------------------------------------------------- visible rows --- */

/*
 * Row order comes from the table via `onVisibleRowsChange`, not from re-walking
 * the hierarchy here. Re-flattening looks equivalent for a static tree, but the
 * table also emits synthetic `"load-more"` rows for paginated parents — a
 * hand-rolled flatten misses those and every arrow below one lands a row off.
 */

/* ---------------------------------------------------------------- styles --- */

/**
 * Uniform row height comes from the table's own `rowHeight` prop, which the arrow
 * geometry below relies on. Only two things are left to the consumer: letting the
 * timeline cell paint outside its box, and keeping the tree columns on one line.
 */
const TimelineFrame = styled.div`
	& tbody td {
		white-space: nowrap;
	}

	/* The bar track and arrows must be allowed to paint outside the timeline cell. */
	& tbody td:last-child {
		overflow: visible;
	}
`;

const Track = styled.div`
	position: absolute;
	inset: 0;
	overflow: visible;
`;

const HeaderScale = styled(Track)`
	display: block;
`;

const MonthTick = styled.div<{ $leftPct: number; $widthPct: number }>`
	position: absolute;
	top: 0;
	bottom: 0;
	left: ${({ $leftPct }) => $leftPct}%;
	width: ${({ $widthPct }) => $widthPct}%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.75rem;
	white-space: nowrap;
	border-left: 1px solid #d0d0d0;
`;

const MonthGrid = styled.div<{ $leftPct: number }>`
	position: absolute;
	top: 0;
	bottom: 0;
	left: ${({ $leftPct }) => $leftPct}%;
	width: 0;
	border-left: 1px solid #e8e8e8;
	opacity: 0.6;
`;

const TodayLine = styled.div<{ $leftPct: number }>`
	position: absolute;
	top: 0;
	bottom: 0;
	left: ${({ $leftPct }) => $leftPct}%;
	width: 2px;
	background: #d04437;
	opacity: 0.85;
	pointer-events: none;
`;

const BAR_COLORS: Record<PlanKind, { base: string; fill: string }> = {
	initiative: { base: "#8777d9", fill: "#5243aa" },
	epic: { base: "#6554c0", fill: "#403294" },
	story: { base: "#4c9aff", fill: "#0052cc" }
};

const Bar = styled.div<{ $leftPct: number; $widthPct: number; $kind: PlanKind }>`
	position: absolute;
	top: 50%;
	left: ${({ $leftPct }) => $leftPct}%;
	width: ${({ $widthPct }) => $widthPct}%;
	height: 18px;
	transform: translateY(-50%);
	border-radius: 3px;
	background: ${({ $kind }) => BAR_COLORS[$kind].base};
	overflow: hidden;
	min-width: 2px;
`;

const BarFill = styled.div<{ $progress: number; $kind: PlanKind }>`
	position: absolute;
	inset: 0 auto 0 0;
	width: ${({ $progress }) => $progress * 100}%;
	background: ${({ $kind }) => BAR_COLORS[$kind].fill};
`;

const BarLabel = styled.span`
	position: relative;
	display: block;
	padding: 0 6px;
	font-size: 0.6875rem;
	line-height: 18px;
	color: #fff;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

/* Dependency arrow: three segments plus a head, drawn with mixed %/px units so
 * the horizontal axis stays percentage-based while the vertical stays in px. */

const ArrowSegment = styled.div`
	position: absolute;
	background: #6b778c;
	pointer-events: none;
`;

const ArrowHead = styled.div`
	position: absolute;
	width: 0;
	height: 0;
	border-top: 4px solid transparent;
	border-bottom: 4px solid transparent;
	border-left: 6px solid #6b778c;
	pointer-events: none;
`;

/**
 * The tree column's own label wrapper sizes to the indent, and the cell content
 * it holds is inline — so an ellipsis has to be declared on the consumer's own
 * element, not on the `<td>`, or long names just clip mid-word.
 */
const NameCell = styled.span`
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const KindPill = styled.span<{ $kind: PlanKind }>`
	display: inline-block;
	padding: 0 6px;
	border-radius: 8px;
	font-size: 0.625rem;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: #fff;
	background: ${({ $kind }) => BAR_COLORS[$kind].base};
`;

const Legend = styled.p`
	margin: 0 0 8px;
	font-size: 0.8125rem;
	display: flex;
	gap: 16px;
	align-items: center;
	flex-wrap: wrap;
`;

/* ------------------------------------------------------------------ demo --- */

interface TimelineCellProps {
	axis: Axis;
	row: PlanItem;

	/** Ordinal positions of currently visible rows, for arrow geometry. */
	rowIndexById: Map<Key, number>;
	showDependencies: boolean;
}

/**
 * The whole timeline pane for one row: grid lines, today marker, the bar, and
 * any incoming dependency arrows.
 *
 * Arrows are rendered in the **target** row's cell and extend upward past the
 * cell box (hence `overflow: visible`). Drawing them from geometry rather than
 * from the source row's DOM node means they survive the source row being
 * unmounted by virtualization.
 */
const TimelineCell = ({ axis, row, rowIndexById, showDependencies }: TimelineCellProps): ReactElement => {
	const { leftPct, widthPct } = barGeometry(axis, row);
	const targetIndex = rowIndexById.get(row.id);

	const arrows: ReactNode[] = [];

	if (showDependencies && targetIndex !== undefined) {
		for (const sourceId of row.dependsOn ?? []) {
			const sourceIndex = rowIndexById.get(sourceId);
			const source = findItem(PLAN, sourceId);

			if (sourceIndex === undefined || !source) {
				continue; // Source collapsed away — nothing to anchor to.
			}

			const sourceBar = barGeometry(axis, source);
			const fromPct = sourceBar.leftPct + sourceBar.widthPct;
			const dy = (sourceIndex - targetIndex) * ROW_HEIGHT;

			arrows.push(
				<ArrowSegment
					key={`${sourceId}-h1`}
					style={{
						left: `${fromPct}%`,
						top: `calc(50% + ${dy}px - 1px)`,
						width: `${ARROW_GAP}px`,
						height: "2px"
					}}
				/>,
				<ArrowSegment
					key={`${sourceId}-v`}
					style={{
						left: `calc(${fromPct}% + ${ARROW_GAP - 1}px)`,
						top: `calc(50% + ${Math.min(dy, 0)}px)`,
						width: "2px",
						height: `${Math.abs(dy)}px`
					}}
				/>,
				<ArrowSegment
					key={`${sourceId}-h2`}
					style={{
						left: `calc(${fromPct}% + ${ARROW_GAP - 1}px)`,
						top: "calc(50% - 1px)",
						width: `calc(${leftPct - fromPct}% - ${ARROW_GAP - 1}px)`,
						height: "2px"
					}}
				/>,
				<ArrowHead key={`${sourceId}-head`} style={{ left: `calc(${leftPct}% - 6px)`, top: "calc(50% - 4px)" }} />
			);
		}
	}

	return (
		<Track>
			{axis.months.map((month) => (
				<MonthGrid key={month.key} $leftPct={month.leftPct} />
			))}
			<TodayLine $leftPct={axis.pct(TODAY)} />
			{arrows}
			<Bar
				$leftPct={leftPct}
				$widthPct={widthPct}
				$kind={row.kind}
				role="img"
				aria-label={`${row.name}: ${row.start} to ${row.end}, ${Math.round(row.progress * 100)}% complete`}
			>
				<BarFill $progress={row.progress} $kind={row.kind} />
				<BarLabel>{Math.round(row.progress * 100)}%</BarLabel>
			</Bar>
		</Track>
	);
};

const findItem = (items: PlanItem[], id: Key): PlanItem | undefined => {
	for (const item of items) {
		if (item.id === id) {
			return item;
		}

		const hit = item.children ? findItem(item.children, id) : undefined;

		if (hit) {
			return hit;
		}
	}

	return undefined;
};

const ALL_KEYS = ((): Set<Key> => {
	const keys = new Set<Key>();
	const walk = (items: PlanItem[]): void => {
		for (const item of items) {
			if (item.children?.length) {
				keys.add(item.id);
				walk(item.children);
			}
		}
	};

	walk(PLAN);

	return keys;
})();

interface PlanTimelineDemoProps {
	showDependencies?: boolean;
}

const PlanTimelineDemo = ({ showDependencies = false }: PlanTimelineDemoProps): ReactElement => {
	const axis = useMemo(() => buildAxis(PLAN), []);
	const [expandedKeys, setExpandedKeys] = useState<ReadonlySet<Key>>(ALL_KEYS);
	const [rowIndexById, setRowIndexById] = useState<Map<Key, number>>(new Map());

	const handleExpandedChange = useCallback((keys: Set<Key>): void => {
		setExpandedKeys(keys);
	}, []);

	const handleVisibleRowsChange = useCallback((rows: DataTreeTableRowMeta<PlanItem>[]): void => {
		setRowIndexById(new Map(rows.map((meta) => [meta.key, meta.index])));
	}, []);

	/*
	 * The two controls every timeline needs. Both are pixel offsets the consumer
	 * derives from its own axis — the table only has to be told where to go, which
	 * is what `horizontalScrollRef` provides.
	 */
	const horizontalScroll = useRef<DataTableHorizontalScrollHandle | null>(null);

	const scrollToDate = useCallback(
		(date: Date): void => {
			const handle = horizontalScroll.current;

			if (!handle) {
				return;
			}

			const { scrollWidth, clientWidth } = handle.getScrollState();
			// The timeline column starts where the pinned tree columns end.
			const timelineWidth = scrollWidth - PINNED_WIDTH;
			const x = PINNED_WIDTH + (axis.pct(date) / 100) * timelineWidth;

			handle.scrollToOffset(x - clientWidth / 2, { behavior: "smooth" });
		},
		[axis]
	);

	const columns = useMemo<DataTableColumn<PlanItem>[]>(
		() => [
			{
				id: "name",
				label: "Name",
				dataKey: "name",
				pinning: "left",
				fixedWidth: true,
				width: 2.2,
				renderCell: ({ row }) => (
					<NameCell title={row.name}>
						<KindPill $kind={row.kind}>{row.kind}</KindPill> {row.name}
					</NameCell>
				)
			},
			{
				id: "team",
				label: "Team",
				dataKey: "team",
				pinning: "left",
				fixedWidth: true,
				width: 0.8
			},
			{
				id: "timeline",
				label: "Timeline",
				fixedWidth: true,
				width: 8,
				renderHeader: () => (
					<HeaderScale>
						{axis.months.map((month) => (
							<MonthTick key={month.key} $leftPct={month.leftPct} $widthPct={month.widthPct}>
								{month.label}
							</MonthTick>
						))}
					</HeaderScale>
				),
				renderCell: ({ row }) => (
					<TimelineCell axis={axis} row={row} rowIndexById={rowIndexById} showDependencies={showDependencies} />
				)
			}
		],
		[axis, rowIndexById, showDependencies]
	);

	return (
		<>
			<Legend>
				<span>
					<KindPill $kind="initiative">initiative</KindPill> → <KindPill $kind="epic">epic</KindPill> →{" "}
					<KindPill $kind="story">story</KindPill>
				</span>
				<span>Red line = today ({TODAY.toISOString().slice(0, 10)})</span>
				{showDependencies ? <span>Grey elbows = finish-to-start dependencies</span> : null}
			</Legend>
			<ButtonGroup>
				<Button onClick={() => scrollToDate(TODAY)}>Scroll to today</Button>
				<Button onClick={() => scrollToDate(axis.start)}>Jump to start</Button>
				<Button onClick={() => horizontalScroll.current?.scrollToColumn("timeline", { align: "end" })}>
					End of timeline
				</Button>
			</ButtonGroup>
			<TimelineFrame>
				<DataTreeTable<PlanItem>
					tree={PLAN}
					getChildren={(row) => row.children}
					rowKey="id"
					treeColumnKey="name"
					columns={columns}
					expandedKeys={expandedKeys}
					onExpandedChange={handleExpandedChange}
					onVisibleRowsChange={handleVisibleRowsChange}
					isLeaf={(row) => !row.children?.length}
					rowHeight={ROW_HEIGHT}
					horizontalScrollRef={horizontalScroll}
					maxHeight={420}
					ariaLabel="Delivery plan timeline"
				/>
			</TimelineFrame>
		</>
	);
};

const meta: Meta<typeof DataTreeTable<PlanItem>> = {
	title: "Data Display/DataTreeTable/Plan Timeline",
	component: DataTreeTable,
	parameters: { layout: "padded" }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Both stories render the composed demo above, so the generated "Show code" would only read
 * `<PlanTimelineDemo />`. The hand-written snippet shows the tree-table wiring the demo rests on;
 * Controls are switched off, since the demo ignores args.
 */
const STATEFUL_DEMO = { controls: { disable: true } };

const TIMELINE_SOURCE = `const [expandedKeys, setExpandedKeys] = useState<ReadonlySet<Key>>(ALL_FOLDER_KEYS);
const horizontalScroll = useRef<DataTableHorizontalScrollHandle | null>(null);

const columns: DataTableColumn<PlanItem>[] = [
	// The two pinned tree columns stay put while the timeline scrolls: that is the split pane.
	{ id: "name", label: "Name", dataKey: "name", pinning: "left", fixedWidth: true, width: 2.2 },
	{ id: "team", label: "Team", dataKey: "team", pinning: "left", fixedWidth: true, width: 0.8 },
	// One very wide column hosts the whole timeline; bars are positioned in % of the cell.
	{
		id: "timeline",
		label: "Timeline",
		fixedWidth: true,
		width: 8,
		renderHeader: () => <MonthScale axis={axis} />,
		renderCell: ({ row }) => <TimelineBar axis={axis} row={row} />
	}
];

<Button onClick={() => scrollToDate(TODAY)}>Scroll to today</Button>
<Button onClick={() => horizontalScroll.current?.scrollToColumn("timeline", { align: "end" })}>End of timeline</Button>
<DataTreeTable<PlanItem>
	ariaLabel="Delivery plan timeline"
	tree={PLAN}
	getChildren={(row) => row.children}
	rowKey="id"
	treeColumnKey="name"
	columns={columns}
	expandedKeys={expandedKeys}
	onExpandedChange={setExpandedKeys}
	isLeaf={(row) => !row.children?.length}
	rowHeight={40}
	horizontalScrollRef={horizontalScroll}
	maxHeight={420}
/>`;

export const PlanTimeline: Story = {
	name: "Timeline (Gantt) pane",
	render: () => <PlanTimelineDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: { language: "tsx", code: TIMELINE_SOURCE },
			description: {
				story:
					"A Jira-Plans-style layout assembled by a **consumer**, using only `@com.mgmtp.a12.widgets/widgets-core/experimental` — no widget changes.\n\n" +
					'- `pinning: "left"` on Name + Team keeps the tree pane fixed while the timeline scrolls horizontally. Pinned cells are `position: sticky`, so this needs no scroll syncing.\n' +
					"- The timeline is a single wide column: `renderCell` paints an absolutely-positioned bar track, `renderHeader` paints the matching month scale. Body cells are already `position: relative`, so `inset: 0` resolves against the cell.\n" +
					"- Bars are positioned in **percent** of the cell. That keeps the geometry independent of the resolved pixel width, and means no per-day cells exist — a multi-year axis costs nothing extra.\n" +
					"- One wide column beats one-column-per-week: a bar is a continuous pixel range that would otherwise be split at every bucket boundary.\n\n" +
					"With an explicit `fixedWidth: true`, `width` resolves to exactly `width * 150` px (here 330 / 120 / 1200). Since `width` allows only one decimal place, column widths quantise to 15px steps.\n\n" +
					"`rowHeight` pins every row to a uniform height — a plain CSS `height` would not, since in table layout it is only a *minimum*.\n\n" +
					'The buttons drive `horizontalScrollRef`: **Scroll to today** maps a date to a pixel offset via `getScrollState()` and calls `scrollToOffset`, while **End of timeline** uses `scrollToColumn("timeline", { align: "end" })`. Both are unreachable without the handle.\n\n' +
					"Scroll horizontally to see the pinned tree hold its position, and collapse a row to see bars follow."
			}
		}
	}
};

export const WithDependencies: Story = {
	name: "With dependency arrows",
	render: () => <PlanTimelineDemo showDependencies />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `// Arrow geometry needs each visible row's ordinal index: the table reports it, including
// synthetic "load-more" rows a hand-rolled flatten would miss.
const [rowIndexById, setRowIndexById] = useState<Map<Key, number>>(new Map());

<DataTreeTable<PlanItem>
	// … the same wiring as "Timeline (Gantt) pane" …
	rowHeight={40} // uniform rows: dy between source and target = (sourceIndex - targetIndex) * 40
	onVisibleRowsChange={(rows) => setRowIndexById(new Map(rows.map((meta) => [meta.key, meta.index])))}
	columns={[
		// …,
		{
			id: "timeline",
			label: "Timeline",
			fixedWidth: true,
			width: 8,
			renderCell: ({ row }) => (
				<TimelineBar axis={axis} row={row} rowIndexById={rowIndexById} showDependencies />
			)
		}
	]}
/>`
			},
			description: {
				story:
					"Adds finish-to-start dependency arrows (Cart service → Payment provider, Indexing → Ranking model).\n\n" +
					"Arrows are drawn inside the **target** row's cell and extend upward past it, which needs `overflow: visible` on the timeline cell — applied by the consumer via a styled wrapper. Because they are computed from geometry rather than read off the source row's DOM node, they survive the source row being unmounted by virtualization.\n\n" +
					'Row order comes from `onVisibleRowsChange`, which reports each rendered row\'s ordinal `index` and `level` — including the synthetic `"load-more"` rows a paginated tree inserts, which a hand-rolled flatten would miss.\n\n' +
					"**Pinning row height is the load-bearing part, and `height` on a `<tr>` is not enough** — in table layout it acts only as a minimum, so one name wrapping to two lines silently makes that row taller and knocks every arrow below it out of alignment. Zeroing the vertical padding *and* forbidding wrapping is what actually produced uniform 40px rows here.\n\n" +
					"**Other limits found:** only finish-to-start routing is handled (overlapping bars would need different elbows); an arrow disappears if either endpoint is collapsed away; and `text-overflow: ellipsis` has to be declared on the consumer's own cell element, since the tree column's label wrapper holds inline content. A first-class overlay slot exposing row offsets would remove the row-height dependency entirely."
			}
		}
	}
};
