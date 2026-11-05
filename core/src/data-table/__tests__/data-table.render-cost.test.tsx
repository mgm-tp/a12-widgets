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

import type { ComponentType, ReactElement } from "react";
import { Profiler, useCallback, useMemo, useState } from "react";
import { fireEvent, getAllByDataRole, render } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../common/main/data-roles.js";
import type { DataTableColumn } from "../main/columns.js";
import type { DataTableSlotProps } from "../main/data-table-slots.api.js";
import type { DataTableProps } from "../main/data-table.api.js";
import { useDataTableContext } from "../main/data-table.context.js";
import { DataTable } from "../main/data-table.view.js";

/**
 * Render-cost guards for the shared {@link useDataTableContext} value.
 *
 * `DataTable` reads its shared state through a plain `useContext` (no
 * `use-context-selector` slice subscription, unlike the legacy `Table`), so there is
 * **no per-field re-render bailout**: any change to the context value re-renders every
 * mounted consumer — including the body-cell templates *inside* the memoized
 * `DataTableBodyRow` boundary, since React context propagation walks into bailed-out
 * subtrees to find consumers.
 *
 * That is only affordable because the context value is deliberately *cold*: every hot,
 * per-interaction concern is routed around React state entirely — cross-highlighting
 * and column resize write DOM/CSS custom properties imperatively, the drag preview
 * shifts rows via inline `translate` and receives the in-progress drag as a prop, roving
 * focus moves the tab stop on the element, and sort announcements go through a
 * live-region ref. These tests pin that down: they drive each interaction and assert the
 * consumer render count does **not** move.
 *
 * There is no exception left: **every** interaction below must cost zero consumer
 * re-renders. Adding a per-gesture value back into the context fails a test here instead
 * of silently costing a table-wide re-render per interaction tick.
 */

interface RowType {
	id: number;
	name: string;
}

const data: RowType[] = [
	{ id: 1, name: "Alpha" },
	{ id: 2, name: "Bravo" },
	{ id: 3, name: "Charlie" },
	{ id: 4, name: "Delta" }
];

const columns: DataTableColumn<RowType>[] = [
	{ label: "ID", dataKey: "id", width: 0.5 },
	{ label: "Name", dataKey: "name", width: 1 }
];

const CELL_COUNT = data.length * columns.length;

interface Probe {
	/** Total renders of the context-consuming cell probe since mount. */
	count: number;
}

/**
 * A `cellContent` slot that reads the shared context and counts its own renders.
 *
 * Reading the context is the whole point: the probe re-renders whenever the context
 * *value identity* changes, which is precisely the cost the cold-context contract is
 * supposed to avoid. It sits inside the memoized row boundary, so it also catches a
 * row-memo regression (a re-render for changed row props) — either way the count moves.
 */
function createCellProbe(): { probe: Probe; CellProbe: ComponentType<DataTableSlotProps.CellContent<RowType>> } {
	const probe: Probe = { count: 0 };

	function CellProbe({ defaultContent }: DataTableSlotProps.CellContent<RowType>): ReactElement {
		useDataTableContext<RowType>();
		probe.count++;

		return <>{defaultContent}</>;
	}

	return { probe, CellProbe };
}

function renderWithProbe(props?: Partial<DataTableProps<RowType>>): { container: HTMLElement; probe: Probe } {
	const { probe, CellProbe } = createCellProbe();
	// `DataTableProps` is a union (plain / virtualized / infinite-scroll variants), which a
	// spread of a `Partial` cannot land in on its own — assembled and asserted once here.
	const tableProps = {
		data,
		columns,
		ariaLabel: "Render cost table",
		...props,
		// Merged, not replaced: a caller passing e.g. `contextMenu` must keep the probe.
		slots: { ...props?.slots, cellContent: CellProbe }
	} as DataTableProps<RowType>;
	const { container } = render(<DataTable {...tableProps} />);

	// Sanity: the probe really is mounted once per body cell, so a delta of 0 below
	// means "nothing re-rendered", not "nothing was ever rendered".
	expect(probe.count).toBe(CELL_COUNT);

	return { container, probe };
}

function bodyCells(container: HTMLElement): HTMLElement[] {
	return getAllByDataRole(container, DataRoles.Table.Body.Cell);
}

function bodyRows(container: HTMLElement): HTMLElement[] {
	return getAllByDataRole(container, DataRoles.Table.Body.Row);
}

function nextFrame(): Promise<void> {
	return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * Waits until the probe's render count stops moving, then returns it as a baseline.
 *
 * Needed around drag start: pragmatic-drag-and-drop dispatches `onDragStart` outside
 * React's event batching, so the `activeDrag` commit it triggers can land a frame after
 * the imperative drag styles are already observable in the DOM. Baselining before that
 * commit would blame the drag-start tick on the pointer moves that follow.
 */
async function settled(read: () => number): Promise<number> {
	let previous = -1;

	while (previous !== read()) {
		previous = read();
		await nextFrame();
		await nextFrame();
	}

	return read();
}

function settledCount(probe: Probe): Promise<number> {
	return settled(() => probe.count);
}

/**
 * Repeats an identical drag event until it stops costing commits, then returns the settled
 * count. React's eager same-state bail-out only applies once the fiber carries no lanes from
 * the previous render, so the first stationary event after a real position change still
 * renders the preview once — this reaches the steady state that must then be free.
 */
async function holdStill(read: () => number, fire: () => void): Promise<number> {
	for (let warmUp = 0; warmUp < 4; warmUp++) {
		const before = read();
		fire();
		await settled(read);

		if (read() === before) {
			break;
		}
	}

	return read();
}

/**
 * Per-row render counter, for the consumer-derived row state below.
 *
 * The context-cost probe above sums every cell, which cannot tell "two rows changed"
 * from "every row changed". `rowStyling` changes are legitimately expected to cost
 * *some* renders — the contract is that they cost only the rows they moved.
 */
function createPerRowProbe(): {
	renders: number[];
	CellProbe: ComponentType<DataTableSlotProps.CellContent<RowType>>;
} {
	const renders = data.map(() => 0);

	function CellProbe({ rowIndex, defaultContent }: DataTableSlotProps.CellContent<RowType>): ReactElement {
		renders[rowIndex]++;

		return <>{defaultContent}</>;
	}

	return { renders, CellProbe };
}

describe("com.mgmtp.a12.widgets.data-table — render cost of consumer-derived row state", () => {
	/**
	 * `rowStyling` derived from consumer state — the shape every selectable table has.
	 * Its identity necessarily changes whenever selection changes (`useCallback` cannot
	 * help: selection is in its dependency list), so the row memo cannot compare it and
	 * has to compare the resolved values instead.
	 */
	function SelectableTable({
		CellProbe
	}: {
		CellProbe: ComponentType<DataTableSlotProps.CellContent<RowType>>;
	}): ReactElement {
		const [selectedId, setSelectedId] = useState(data[0].id);
		// Memoized: an inline `slots` object invalidates `useDataTableSlots` every
		// render and would re-render every row regardless of what this test measures.
		const slots = useMemo(() => ({ cellContent: CellProbe }), [CellProbe]);

		return (
			<DataTable
				data={data}
				columns={columns}
				ariaLabel="Selection table"
				rowStyling={({ row }) => ({ selected: row.id === selectedId })}
				rowEventHandlers={({ row }) => ({ onClick: () => setSelectedId(row.id) })}
				slots={slots}
			/>
		);
	}

	test("changing the selected row re-renders only the rows whose selection changed", async () => {
		const { renders, CellProbe } = createPerRowProbe();
		const { container } = render(<SelectableTable CellProbe={CellProbe} />);
		const rows = bodyRows(container);

		// Row 0 starts selected, so the click below really is a move and not a first pick.
		expect(rows[0].getAttribute("aria-selected")).toBe("true");

		renders.fill(0);
		await userEvent.click(rows[2]);
		await settled(() => renders.reduce((sum, count) => sum + count, 0));

		// Selection really moved (otherwise zero renders below would pass for the wrong
		// reason). `aria-selected` is omitted rather than "false" when unselected.
		expect(rows[0].getAttribute("aria-selected")).toBeNull();
		expect(rows[2].getAttribute("aria-selected")).toBe("true");

		// Row 0 lost selection, row 2 gained it: both re-render their cells. Rows 1 and 3
		// are untouched and must cost nothing — before the row memo compared per field,
		// this read [2,2,2,2], a whole-table re-render to restyle two rows.
		expect(renders).toEqual([columns.length, 0, columns.length, 0]);
	});

	test("a row that skips re-rendering still fires the newest row event handler", async () => {
		const seen: number[] = [];
		const { renders, CellProbe } = createPerRowProbe();

		/**
		 * `rowStyling` is frozen, so no row ever re-renders — but `rowEventHandlers` is
		 * rebuilt per render and captures `tick`. This is the trap that comes with
		 * comparing row state by value: a row that bails out keeps the closure it was
		 * built with, so the handler must be reached through the model's dispatcher
		 * (which re-reads the getter) rather than captured into the row's props.
		 */
		function CapturingTable(): ReactElement {
			const [tick, setTick] = useState(0);
			const rowStyling = useCallback(() => ({}), []);
			const slots = useMemo(() => ({ cellContent: CellProbe }), []);

			return (
				<>
					<button type="button" onClick={() => setTick((current) => current + 1)}>
						tick
					</button>
					<DataTable
						data={data}
						columns={columns}
						ariaLabel="Capturing table"
						rowStyling={rowStyling}
						rowEventHandlers={() => ({ onClick: () => seen.push(tick) })}
						slots={slots}
					/>
				</>
			);
		}

		const { container } = render(<CapturingTable />);
		const rows = bodyRows(container);
		const tickButton = container.querySelector("button") as HTMLButtonElement;

		renders.fill(0);

		for (let press = 0; press < 3; press++) {
			await userEvent.click(tickButton);
		}

		// Precondition for the assertion below: the rows genuinely never re-rendered,
		// so their `onClick` closures date from the very first render (`tick` === 0).
		expect(renders).toEqual([0, 0, 0, 0]);

		await userEvent.click(rows[1]);

		expect(seen).toEqual([3]);
	});
});

describe("com.mgmtp.a12.widgets.data-table — render cost of the shared context", () => {
	test("cross-highlight hovering re-renders nothing (imperative DOM, not context state)", async () => {
		const { container, probe } = renderWithProbe({ cellHighlighting: true });
		const table = container.querySelector("table") as HTMLTableElement;
		const cells = bodyCells(container);
		const before = probe.count;

		// Hover across columns *and* rows — the legacy table drove this through a
		// dedicated hover context, one re-render per pointer transition.
		await userEvent.hover(cells[0]);
		await userEvent.hover(cells[1]);
		await userEvent.hover(cells[2]);
		await userEvent.hover(cells[3]);

		// The highlight really did move (otherwise a broken highlighter would make the
		// render-count assertion below pass for the wrong reason).
		expect(table.dataset.highlightColLeaf).toBe("1");
		expect(table.querySelectorAll('th[data-highlighted="true"]').length).toBeGreaterThan(0);

		expect(probe.count).toBe(before);
	});

	test("a pointer column resize re-renders nothing (CSS custom properties, not context state)", async () => {
		const { container, probe } = renderWithProbe({ columnResizingOptions: { onEndResize: vi.fn() } });
		const table = container.querySelector("table") as HTMLTableElement;
		const handle = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler)[0];
		const before = probe.count;

		fireEvent.pointerDown(handle, { clientX: 100, pointerId: 1, isPrimary: true, button: 0 });

		// A burst of moves: the whole point of the imperative path is that N moves cost
		// zero renders instead of N table-wide ones.
		for (let x = 110; x <= 200; x += 10) {
			fireEvent.pointerMove(document, { clientX: x, pointerId: 1 });
			await nextFrame();
		}

		fireEvent.pointerUp(document, { clientX: 200, pointerId: 1 });

		// The resize took effect (the width lives in a custom property on the table).
		expect(table.style.getPropertyValue("--a12-col-0-width")).not.toBe("");

		expect(probe.count).toBe(before);
	});

	test("keyboard column resize re-renders nothing", async () => {
		const { container, probe } = renderWithProbe({ columnResizingOptions: { onEndResize: vi.fn() } });
		const table = container.querySelector("table") as HTMLTableElement;
		const handle = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler)[0];
		handle.focus();
		const before = probe.count;

		for (let step = 0; step < 6; step++) {
			fireEvent.keyDown(handle, { key: "ArrowRight" });
		}

		await vi.waitFor(() => {
			expect(table.style.getPropertyValue("--a12-col-0-width")).not.toBe("");
		});

		expect(probe.count).toBe(before);
	});

	test("arrow-key row navigation re-renders nothing (roving tab stop moves on the element)", async () => {
		const { container, probe } = renderWithProbe();
		const rows = bodyRows(container);
		rows[0].focus();
		const before = probe.count;

		await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowUp}");

		// Focus and the roving tab stop moved …
		expect(document.activeElement).toBe(rows[1]);
		expect(rows[1].getAttribute("tabindex")).toBe("0");
		expect(rows[0].getAttribute("tabindex")).toBe("-1");
		// … without a single consumer render.
		expect(probe.count).toBe(before);
	});

	test("opening the row context menu re-renders nothing (menu state stays out of the context)", () => {
		function ContextMenu({ row }: DataTableSlotProps.ContextMenu<RowType>): ReactElement {
			return <div data-testid="ctx">{row.name}</div>;
		}

		const { container, probe } = renderWithProbe({ slots: { contextMenu: ContextMenu } });
		const before = probe.count;

		fireEvent.contextMenu(bodyRows(container)[0], { clientX: 20, clientY: 20 });

		// The menu opened — this is a real orchestrator state tick …
		expect(document.body.querySelector(`[data-role="${DataRoles.Table.ContextMenu}"]`)).not.toBeNull();
		// … that the memoized context value absorbs completely.
		expect(probe.count).toBe(before);
	});

	test("sort activation re-renders nothing beyond the consumer's own state change", async () => {
		const onSort = vi.fn();
		const sortableColumns: DataTableColumn<RowType>[] = [
			{ label: "ID", dataKey: "id", width: 0.5, sortable: true },
			{ label: "Name", dataKey: "name", width: 1, sortable: true }
		];
		const { container, probe } = renderWithProbe({
			columns: sortableColumns,
			sortOptions: { sortState: [], onSort }
		});
		const before = probe.count;

		// `onSort` is a spy, so `sortState` never changes: what is left is DataTable's own
		// reaction to the activation — the screen-reader announcement, which goes through a
		// live-region ref rather than state.
		await userEvent.click(getAllByDataRole(container, DataRoles.Table.Header.Cell)[0]);

		expect(onSort).toHaveBeenCalledTimes(1);
		expect(probe.count).toBe(before);
	});

	describe("drag and drop", () => {
		// pragmatic-drag-and-drop ignores `dragstart` without a `dataTransfer`, holds one
		// global drag at a time, and dispatches `onDragStart` a frame late — same harness as
		// the DnD suite in data-table.test.tsx.
		function startDrag(source: HTMLElement): DataTransfer {
			const dataTransfer = new DataTransfer();
			fireEvent.dragStart(source, { dataTransfer });

			return dataTransfer;
		}

		function pointInRowHalf(row: HTMLElement, half: "top" | "bottom"): { clientX: number; clientY: number } {
			const rect = row.getBoundingClientRect();

			return {
				clientX: Math.round(rect.left + rect.width / 2),
				clientY: Math.round(half === "top" ? rect.top + rect.height * 0.25 : rect.top + rect.height * 0.75)
			};
		}

		test("pointer moves during a drag re-render nothing (rows shift via inline styles)", async () => {
			const { container, probe } = renderWithProbe({ dragDropOptions: { onDrop: vi.fn() } });
			const rows = bodyRows(container);
			// Points are measured BEFORE the drag opens the gap: once rows carry a shift,
			// a live rect no longer maps to the row's logical position, so a point taken
			// mid-drag can project a different gap than the one intended.
			const targets = rows.slice(1).map((row) => ({ row, point: pointInRowHalf(row, "bottom") }));
			const dataTransfer = startDrag(rows[0]);
			let ended = false;

			try {
				await nextFrame();
				await vi.waitFor(() => expect(rows[0].hasAttribute("data-drop-slot")).toBe(true));

				// Baseline *after* the drag-start tick has settled: this test is about the
				// moves, not about drag start (asserted separately below).
				const before = await settledCount(probe);

				// Walk down the table, ending on the last row's bottom half — an unambiguous
				// "insert after the last row" gap, so the shift assertion below is stable.
				for (const { row, point } of targets) {
					fireEvent.dragEnter(row, { dataTransfer, ...point });
					fireEvent.dragOver(row, { dataTransfer, ...point });
					await nextFrame();
				}

				// The preview really is tracking the pointer (rows parted to migrate the
				// source's freed slot down) …
				await vi.waitFor(() => expect(rows[1].style.translate).not.toBe(""));
				// … and every one of those moves cost zero consumer renders.
				expect(probe.count).toBe(before);

				fireEvent.dragEnd(rows[0], { dataTransfer, ...targets[targets.length - 1].point });
				ended = true;
			} finally {
				// pragmatic holds one global drag at a time — a dangling drag poisons every
				// following test, so a failed assertion above must still end it.
				if (!ended) {
					fireEvent.dragEnd(rows[0], { dataTransfer });
				}
			}
		});

		test("drag start and drag end re-render nothing (the in-progress drag is a preview prop, not context)", async () => {
			const { container, probe } = renderWithProbe({ dragDropOptions: { onDrop: vi.fn() } });
			const rows = bodyRows(container);
			const endPoint = pointInRowHalf(rows[rows.length - 1], "bottom");
			const beforeStart = probe.count;
			const dataTransfer = startDrag(rows[0]);
			let ended = false;

			try {
				await nextFrame();
				await vi.waitFor(() => expect(rows[0].hasAttribute("data-drop-slot")).toBe(true));

				// Starting a drag re-renders the orchestrator (it mounts the floating preview),
				// but the shared context value is unchanged, so the ripple stops there instead of
				// reaching every cell. Asserted on the *settled* count: the `activeDrag` commit
				// lands outside React's batching, a tick after the drag styles are observable.
				const beforeEnd = await settledCount(probe);
				expect(beforeEnd).toBe(beforeStart);

				fireEvent.dragEnd(rows[0], { dataTransfer, ...endPoint });
				ended = true;

				await vi.waitFor(() => expect(rows[0].hasAttribute("data-drop-slot")).toBe(false));
				// Ending it is symmetric — the preview unmounts, no cell re-renders.
				expect(await settledCount(probe)).toBe(beforeEnd);
			} finally {
				if (!ended) {
					fireEvent.dragEnd(rows[0], { dataTransfer });
				}
			}
		});

		test("holding the pointer still commits nothing; moving it commits again", async () => {
			// The browser re-fires `dragover` on a timer while the pointer is stationary, and
			// pragmatic dispatches `onDrag` from every one of them — so the preview must
			// compare the delta before setting state. A `Profiler` counts commits anywhere in
			// the table, which is what catches the preview repainting on its own.
			let commits = 0;
			const { container } = render(
				<Profiler
					id="data-table"
					onRender={(): void => {
						commits++;
					}}
				>
					<DataTable data={data} columns={columns} dragDropOptions={{ onDrop: vi.fn() }} ariaLabel="Still drag" />
				</Profiler>
			);
			const rows = bodyRows(container);
			const still = pointInRowHalf(rows[2], "bottom");
			const moved = { clientX: still.clientX, clientY: still.clientY + 4 };
			const dataTransfer = startDrag(rows[0]);
			let ended = false;

			try {
				await nextFrame();
				await vi.waitFor(() => expect(rows[0].hasAttribute("data-drop-slot")).toBe(true));

				const beforeStill = await holdStill(
					() => commits,
					() => fireEvent.dragOver(rows[2], { dataTransfer, ...still })
				);

				for (let repeat = 0; repeat < 5; repeat++) {
					fireEvent.dragOver(rows[2], { dataTransfer, ...still });
					await nextFrame();
				}

				// Steady state: a motionless drag costs nothing, however long it is held.
				expect(commits).toBe(beforeStill);

				// The guard must not swallow real movement: a different point still commits.
				fireEvent.dragOver(rows[2], { dataTransfer, ...moved });
				await vi.waitFor(() => expect(commits).toBeGreaterThan(beforeStill));

				fireEvent.dragEnd(rows[0], { dataTransfer, ...moved });
				ended = true;
			} finally {
				if (!ended) {
					fireEvent.dragEnd(rows[0], { dataTransfer });
				}
			}
		});
	});
});
