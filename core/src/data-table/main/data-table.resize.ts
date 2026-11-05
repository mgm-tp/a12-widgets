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

import type { RefObject } from "react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { DataRoles } from "../../common/main/data-roles.js";

import type { DataTableColumnResizingOptions } from "./data-table.api.js";
import { writeLeafPinOffsets } from "./data-table.pin-offsets.js";
import { getColumnId } from "./data-table.sort.js";
import { useTheadMeasure } from "./data-table.thead-measure.js";
import { FIXED_WIDTH_BASE_PX } from "./data-table.utils.js";
import type { BaseColumnType, Column } from "./foundation/column.api.js";
import type { ColumnResizeDragData, ColumnResizeDragEvent } from "./foundation/table.api.js";

const MIN_COLUMN_WIDTH_PX = 30;
const KEYBOARD_STEP_PX = 10;
// Trailing window after the last keyboard resize step before `data-resizing` clears
// — longer than any OS key-repeat interval so a held arrow key stays one burst.
const KEYBOARD_RESIZE_BURST_MS = 250;

/**
 * Announce a resize handle's current column width to assistive tech. A focusable
 * `role="separator"` is a window-splitter (a range widget); without an
 * `aria-valuenow` the platform reports the midpoint of its default `0–100` range —
 * a phantom "50" screen readers read out on every resizable column even though it
 * appears nowhere in the markup. `aria-valuetext` carries the human-friendly width;
 * `aria-valuenow` mirrors it numerically for AT that ignore `valuetext`.
 */
function setHandleWidthValue(handleEl: HTMLElement, widthPx: number): void {
	const rounded = Math.max(MIN_COLUMN_WIDTH_PX, Math.round(widthPx));
	handleEl.setAttribute("aria-valuenow", String(rounded));
	handleEl.setAttribute("aria-valuetext", `${rounded} pixels`);
}

interface UseColumnResizeParams<RowType> {
	tableRef: RefObject<HTMLTableElement | null>;
	leafColumns: readonly BaseColumnType<RowType>[];

	/**
	 * Pinning side per leaf column, index-aligned with {@link leafColumns}. Needed
	 * because resizing a pinned column shifts the sticky offsets of the pinned
	 * columns beside it, and the `<thead>` measure that normally owns those offsets
	 * is deferred for the duration of the gesture (see `syncPinOffsets`).
	 */
	leafPinning: readonly (("left" | "right") | undefined)[];
	resizingOptions?: DataTableColumnResizingOptions<BaseColumnType<RowType>>;
	disabled?: boolean;
}

interface ResizeHandleProps {
	onPointerDown: React.PointerEventHandler<HTMLDivElement>;
	onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
	tabIndex: number;
	role: string;
	"aria-label": string;
	"aria-orientation": "vertical";
}

interface UseColumnResizeResult<RowType> {
	resizeHandleProps: (columnIndex: number) => ResizeHandleProps;

	/**
	 * Handle props for a column group: resizes its whole leaf range
	 * `[leafFrom, leafTo]` proportionally (every leaf scales by the same factor,
	 * preserving the group's internal column ratios). `groupColumn` / `groupLabel`
	 * are reported back through the resize callbacks and the accessible name.
	 */
	groupResizeHandleProps: (
		leafFrom: number,
		leafTo: number,
		groupColumn: BaseColumnType<RowType>,
		groupLabel: string
	) => ResizeHandleProps;
	isResizable: (columnIndex: number) => boolean;

	/**
	 * Leaf indices the user manually resized this session. Action-column auto-size
	 * reads this to leave a dragged column alone (a manual resize must not be
	 * clobbered by a later re-measure). Empty when resizing is disabled.
	 */
	pinnedByResize: RefObject<ReadonlySet<number>>;

	/**
	 * Counter bumped whenever {@link resetAllColumnWidths} (Escape) clears every
	 * `--a12-col-N-width` override. Action-column auto-size depends on it so the
	 * reverse path is closed: an Escape reset also wipes auto-size's fitted widths,
	 * and this signal re-triggers the measure so those columns re-fit instead of
	 * snapping to the `getColumnWidths` fallback.
	 */
	remeasureSignal: number;
}

/**
 * Hook providing column resize behavior for DataTable.
 *
 * During resize, column widths are set via CSS custom properties
 * (`--a12-col-N-width`) on the table root. This avoids re-rendering and
 * lets the grid engine handle layout updates natively.
 *
 * @internal
 */
export function useColumnResize<RowType>(params: UseColumnResizeParams<RowType>): UseColumnResizeResult<RowType> {
	const { tableRef, leafColumns, leafPinning, resizingOptions, disabled } = params;

	const dragState = useRef<{
		// Leaf indices this gesture resizes. A single-leaf handle has one entry; a
		// column group's handle has its whole leaf range (resized proportionally).
		leaves: number[];
		startX: number;
		// Rendered px width of each leaf at drag start (index-aligned with `leaves`).
		startWidths: number[];
		// Sum of `startWidths` — the group's total width at drag start.
		groupStartPx: number;
		// Column reported back to consumers via the resize callbacks (the leaf, or
		// the group column for a group resize).
		reportColumn: BaseColumnType<RowType>;
	} | null>(null);

	// Leaf indices the user manually resized this session — exposed so action-column
	// auto-size skips them. A stable ref (never reassigned) so consumers can read the
	// live set without re-subscribing.
	const pinnedByResize = useRef<Set<number>>(new Set());

	// Bumped by `resetAllColumnWidths` (Escape) so action-column auto-size re-fits
	// after every override — including its own fitted widths — has been cleared.
	const [remeasureSignal, setRemeasureSignal] = useState(0);

	// Teardown for the drag in progress, if any. Lets unmount restore global
	// state (document listeners, body user-select, `data-resizing`) without
	// firing consumer callbacks.
	const activeDragTeardown = useRef<(() => void) | null>(null);

	// Trailing-debounce timer marking a keyboard resize burst (held arrow key).
	const keyboardBurstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Immediately clears the keyboard burst marker (Escape, unmount).
	const clearKeyboardResizeBurst = useCallback((): void => {
		if (keyboardBurstTimer.current !== null) {
			clearTimeout(keyboardBurstTimer.current);
			keyboardBurstTimer.current = null;
		}

		const tableEl = tableRef.current;

		if (tableEl) {
			delete tableEl.dataset.resizing;
		}
	}, [tableRef]);

	// Marks a keyboard resize step as an in-flight resize (`data-resizing`, the same
	// flag the pointer drag sets) so the `useTheadMeasure` loops defer instead of
	// re-measuring the header per keypress: a held arrow key auto-repeats at key-repeat
	// rate — exactly the per-frame thrash the defer policy exists to avoid. The flag
	// clears on a trailing debounce, after which the loops measure once.
	const markKeyboardResizeStep = useCallback((): void => {
		const tableEl = tableRef.current;

		if (!tableEl) {
			return;
		}

		tableEl.dataset.resizing = "true";

		if (keyboardBurstTimer.current !== null) {
			clearTimeout(keyboardBurstTimer.current);
		}

		keyboardBurstTimer.current = setTimeout(() => {
			keyboardBurstTimer.current = null;
			delete tableEl.dataset.resizing;
		}, KEYBOARD_RESIZE_BURST_MS);
	}, [tableRef]);

	useEffect(
		() => (): void => {
			activeDragTeardown.current?.();
			clearKeyboardResizeBurst();
		},
		[clearKeyboardResizeBurst]
	);

	// Manual widths (`--a12-col-N-width`), the `pinnedByResize` set and the
	// `data-resized` layout flag are all keyed by leaf *index*. When the column set
	// changes (add / remove / reorder) index N now addresses a different column, so a
	// stale override would silently re-apply to the wrong one (and auto-size would
	// skip it as "pinned"). Invalidate everything when the ordered column identity
	// signature changes — but not on the initial mount.
	const columnSignature = leafColumns.map((column, index) => getColumnId(column) ?? `@${index}`).join("|");
	const prevSignatureRef = useRef<string | null>(null);
	const prevLeafCountRef = useRef<number>(leafColumns.length);

	useEffect(() => {
		if (prevSignatureRef.current === null) {
			prevSignatureRef.current = columnSignature;

			return;
		}

		if (prevSignatureRef.current === columnSignature) {
			return;
		}

		prevSignatureRef.current = columnSignature;

		const tableEl = tableRef.current;

		if (tableEl) {
			// Clear a generous range: the previous layout may have written vars at
			// indices beyond the new leaf count.
			const clearCount = Math.max(prevLeafCountRef.current, leafColumns.length);

			for (let index = 0; index < clearCount; index += 1) {
				tableEl.style.removeProperty(`--a12-col-${index}-width`);
			}

			delete tableEl.dataset.resized;
		}

		pinnedByResize.current.clear();
		prevLeafCountRef.current = leafColumns.length;

		// The cleared vars also wiped auto-size's fitted widths; re-trigger the measure
		// so action columns re-fit rather than stranding on the fallback track.
		setRemeasureSignal((signal) => signal + 1);
	}, [columnSignature, leafColumns.length, tableRef]);

	const getHeadCell = useCallback(
		(columnIndex: number): HTMLTableCellElement | null => {
			const tableEl = tableRef.current;

			if (!tableEl) {
				return null;
			}

			return tableEl.querySelector<HTMLTableCellElement>(`thead th[scope="col"][data-col-index="${columnIndex + 1}"]`);
		},
		[tableRef]
	);

	const getColumnWidthPx = useCallback(
		(columnIndex: number): number => {
			const headCell = getHeadCell(columnIndex);

			if (headCell) {
				return headCell.getBoundingClientRect().width;
			}

			return FIXED_WIDTH_BASE_PX;
		},
		[getHeadCell]
	);

	const setColumnWidthPx = useCallback(
		(columnIndex: number, widthPx: number): void => {
			const tableEl = tableRef.current;

			if (!tableEl) {
				return;
			}

			const clampedWidth = Math.max(MIN_COLUMN_WIDTH_PX, widthPx);
			tableEl.style.setProperty(`--a12-col-${columnIndex}-width`, `${clampedWidth}px`);
		},
		[tableRef]
	);

	/**
	 * Re-write the pinned leaves' sticky offset vars from the column widths this
	 * gesture just applied.
	 *
	 * Resizing a pinned column changes the cumulative width of the pinned block, so
	 * every pinned leaf beside the resized one needs a new offset: a right-pinned
	 * leaf sticks at the total width of the right-pinned leaves after it, a
	 * left-pinned leaf at the width of those before it. `useLeafPinOffsetCssVars`
	 * owns these vars in steady state, but its `<thead>` measure is deliberately
	 * deferred while `data-resizing` is set, so without this the offsets stay frozen
	 * at their pre-drag values for the whole gesture. A group header cell sticks at
	 * the offset of its *last* leaf, which the resize does not change, so the group
	 * cell tracks the drag while its own leaves lag behind — the group's edge visibly
	 * separates from the column border beneath it until the drag ends.
	 *
	 * Widths are read from the `--a12-col-N-width` vars rather than measured: every
	 * leaf carries one for the duration of a gesture (`freezeAllColumnWidths` runs
	 * first), so this stays a string read and adds no layout to the drag frame.
	 */
	const syncPinOffsets = useCallback((): void => {
		const tableEl = tableRef.current;

		if (!tableEl || !leafPinning.some((pinning) => pinning !== undefined)) {
			return;
		}

		const widths = leafColumns.map((_column, index) => {
			const frozen = Number.parseFloat(tableEl.style.getPropertyValue(`--a12-col-${index}-width`));

			return Number.isFinite(frozen) ? frozen : getColumnWidthPx(index);
		});

		writeLeafPinOffsets(tableEl, widths, leafPinning);
	}, [tableRef, leafColumns, leafPinning, getColumnWidthPx]);

	/**
	 * Pin *every* resizable column to its current rendered pixel width and flip the
	 * table into its resized layout (`data-resized="true"`, which switches the table
	 * to `width: max-content`).
	 *
	 * Without this, only the dragged column gets a px `--a12-col-N-width`; the others
	 * keep their percentage/`calc` `<col>` widths. Under `table-layout: fixed;
	 * width: 100%` the browser distributes the table's leftover space across those
	 * proportional tracks, so growing one column shrinks the rest. Freezing every leaf
	 * column to px (all of them are now `var()`-wrapped by `getColumnWidths`, including
	 * width-less flex-fallback and `actionColumn` cells) removes the proportional tracks
	 * entirely, and `max-content` then sizes the table to the sum of the columns so only
	 * the dragged column's delta moves the total.
	 *
	 * Called once at the start of each resize gesture. It freezes to the *currently
	 * rendered* widths (which already fill the container), so the flip is seamless.
	 */
	const freezeAllColumnWidths = useCallback((): void => {
		const tableEl = tableRef.current;

		if (!tableEl) {
			return;
		}

		// READ pass then WRITE pass: each `setColumnWidthPx` writes a CSS var on the
		// table root and invalidates layout, so interleaving the reads would force a
		// synchronous reflow before every `getColumnWidthPx`. Measure all widths first,
		// then write them (mirrors the auto-size read-all/write-all pattern).
		const frozenWidths = leafColumns.map((_column, index) => getColumnWidthPx(index));
		frozenWidths.forEach((widthPx, index) => setColumnWidthPx(index, widthPx));

		tableEl.dataset.resized = "true";
	}, [tableRef, leafColumns, setColumnWidthPx, getColumnWidthPx]);

	/**
	 * Clear every column's px override and leave the resized layout, restoring the
	 * pristine proportional `<col>` widths + `width: 100%`. Used by Escape to reset
	 * column sizing: removing only the focused column's override would strand it on
	 * its percentage fallback while its siblings stay frozen to px and the table is
	 * `width: max-content` — an incoherent mix (and percentage `<col>` widths
	 * degenerate the table width under `max-content`). Resetting all columns keeps
	 * the layout coherent.
	 */
	const resetAllColumnWidths = useCallback((): void => {
		const tableEl = tableRef.current;

		if (!tableEl) {
			return;
		}

		leafColumns.forEach((_column, index) => {
			tableEl.style.removeProperty(`--a12-col-${index}-width`);
		});

		// Every width just reverted to its default, so auto-size may resume for action
		// columns: drop the manual-resize pins.
		pinnedByResize.current.clear();

		// Clearing the vars also wiped auto-size's fitted widths; its effect deps
		// (data/theme/fonts) haven't changed, so bump a signal to re-trigger the
		// measure — otherwise action columns strand on the `getColumnWidths` fallback.
		setRemeasureSignal((signal) => signal + 1);

		delete tableEl.dataset.resized;

		// The widths are back to their defaults, so the pinned offsets computed from
		// the dragged widths are wrong until the `<thead>` measure runs again. Re-sync
		// now (from the restored layout) rather than waiting on that observer tick,
		// which may not fire at all if the reset leaves the `<thead>` box unchanged.
		syncPinOffsets();
	}, [tableRef, leafColumns, syncPinOffsets]);

	/**
	 * Convert a column's final pixel width back to a stored {@link Column.Width}.
	 *
	 * - `fixedWidth` columns store width in units of {@link FIXED_WIDTH_BASE_PX}
	 *   (track is `${width * 150}px`), so the px→width map is `endPx / 150`.
	 * - Fluid columns store width as an `fr` ratio. The rendered pixel width of an
	 *   `fr` track has no relation to 150px, so we scale the column's *starting*
	 *   ratio by how much its pixel width changed: `startFr * (endPx / startPx)`.
	 *   This preserves drag direction (dragging narrower yields a smaller ratio)
	 *   instead of inflating every release through a bogus `/150` conversion.
	 */
	const computeNewWidth = useCallback(
		(column: BaseColumnType<RowType>, startPx: number, endPx: number): Column.Width => {
			if (column.fixedWidth) {
				return Math.max(column.minResizeWidth ?? 0.1, endPx / FIXED_WIDTH_BASE_PX);
			}

			const startFr = typeof column.width === "number" && column.width > 0 ? column.width : undefined;

			if (startFr === undefined || startPx <= 0) {
				// No usable starting ratio (e.g. a width-less column sized by the
				// fallback track) — fall back to the fixed-width-style conversion.
				return Math.max(column.minResizeWidth ?? 0.1, endPx / FIXED_WIDTH_BASE_PX);
			}

			return Math.max(column.minResizeWidth ?? 0.1, startFr * (endPx / startPx));
		},
		[]
	);

	const isResizable = useCallback(
		(columnIndex: number): boolean => {
			if (disabled || !resizingOptions) {
				return false;
			}

			const column = leafColumns[columnIndex];

			// Every leaf column is resizable when `columnResizingOptions` is provided —
			// including `fixedWidth` (resized to a different fixed track) and `actionColumn`
			// (a manual width then pins it against auto-size, by design).
			return !!column;
		},
		[disabled, resizingOptions, leafColumns]
	);

	const resizable = !disabled && !!resizingOptions;

	// A focusable `role="separator"` resize handle is a range widget. With no
	// `aria-valuenow` at rest the platform reports its default `0–100` midpoint —
	// a phantom "50" screen readers announce on every resizable column. Seed each
	// handle's range semantics from the rendered column widths on mount, and resync
	// on relayout via the shared `<thead>` observer, deferring while a drag is active
	// (the gesture keeps the dragged handle's value fresh and the rest are frozen) so
	// the per-frame CSS-variable resize path is left alone.
	useTheadMeasure({
		tableRef,
		enabled: resizable,
		deferDuringResize: true,
		measure: (tableEl, theadEl): void => {
			// The full content width is an upper bound no single column can exceed, so it
			// gives every handle a coherent `[min, max]` range for AT that read the numeric
			// value rather than `aria-valuetext`.
			const maxWidth = Math.max(MIN_COLUMN_WIDTH_PX, Math.round(tableEl.scrollWidth) || FIXED_WIDTH_BASE_PX);

			leafColumns.forEach((_column, index) => {
				const headCell = getHeadCell(index);
				const handleEl = headCell?.querySelector<HTMLElement>(`[data-role="${DataRoles.Table.Column.ResizeHandler}"]`);

				if (!headCell || !handleEl) {
					return;
				}

				handleEl.setAttribute("aria-valuemin", String(MIN_COLUMN_WIDTH_PX));
				handleEl.setAttribute("aria-valuemax", String(maxWidth));
				setHandleWidthValue(handleEl, headCell.getBoundingClientRect().width);
			});

			// Column-group handles span the *whole* header height (their group-header
			// row plus the sub-column rows below), so the handle reads as a group-wide
			// resize rather than a single-column one. The group cell only occupies its
			// own header row, so stretch the handle down to the <thead>'s bottom edge
			// (`bottom - cell.top` also covers deeper nested groups correctly).
			const theadBottom = theadEl.getBoundingClientRect().bottom;

			theadEl.querySelectorAll<HTMLTableCellElement>('th[scope="colgroup"]').forEach((groupCell) => {
				const handleEl = groupCell.querySelector<HTMLElement>(`[data-role="${DataRoles.Table.Column.ResizeHandler}"]`);

				if (!handleEl) {
					return;
				}

				const cellRect = groupCell.getBoundingClientRect();
				handleEl.style.height = `${Math.max(0, Math.round(theadBottom - cellRect.top))}px`;

				// The group's total width equals its (colspanning) header cell's width.
				handleEl.setAttribute("aria-valuemin", String(MIN_COLUMN_WIDTH_PX));
				handleEl.setAttribute("aria-valuemax", String(maxWidth));
				setHandleWidthValue(handleEl, cellRect.width);
			});
		},
		deps: [tableRef, resizable, leafColumns, getHeadCell]
	});

	// Core gesture over one or more leaf columns. A single-leaf handle passes
	// `[index]`; a column group's handle passes its whole leaf range and every leaf
	// scales by the same factor, preserving the group's internal ratios. The
	// single-leaf case is the identity of the previous additive resize:
	// `startPx * (startPx + delta) / startPx === startPx + delta`.
	const buildHandleProps = useCallback(
		(leaves: number[], reportColumn: BaseColumnType<RowType>, label: string): ResizeHandleProps => {
			// Current rendered px width of each resized leaf (index-aligned with `leaves`).
			const readStartWidths = (): number[] => leaves.map((leaf) => getColumnWidthPx(leaf));

			// Scale factor that turns the group's start width into `targetGroupPx`,
			// clamped so no single leaf shrinks below MIN_COLUMN_WIDTH_PX.
			const factorFor = (startWidths: number[], groupStartPx: number, targetGroupPx: number): number => {
				const rawFactor = groupStartPx > 0 ? targetGroupPx / groupStartPx : 1;
				const smallestLeaf = Math.min(...startWidths);
				const minFactor = smallestLeaf > 0 ? MIN_COLUMN_WIDTH_PX / smallestLeaf : rawFactor;

				return Math.max(rawFactor, minFactor);
			};

			// Apply a scale factor to every resized leaf (writes each `--a12-col-N-width`).
			const applyFactor = (startWidths: number[], factor: number): void => {
				leaves.forEach((leaf, index) => setColumnWidthPx(leaf, startWidths[index] * factor));
				// Pinned offsets follow the widths in the same frame (see syncPinOffsets).
				syncPinOffsets();
			};

			// Final stored width per resized leaf column, for onEndResize's per-column
			// getter (consumers walk their column tree and read each match).
			const endWidthsFor = (startWidths: number[], factor: number): Map<BaseColumnType<RowType>, Column.Width> => {
				const widths = new Map<BaseColumnType<RowType>, Column.Width>();

				leaves.forEach((leaf, index) => {
					const leafColumn = leafColumns[leaf];
					const endPx = Math.max(MIN_COLUMN_WIDTH_PX, startWidths[index] * factor);
					widths.set(leafColumn, computeNewWidth(leafColumn, startWidths[index], endPx));
				});

				return widths;
			};

			/**
			 * Swallow the synthetic `click` the browser fires right after a pointer
			 * resize gesture. `pointerdown.stopPropagation()` only stops the
			 * pointerdown; the follow-up `click` is a separate event whose nearest
			 * common ancestor (after a drag that ends over the header, or a plain
			 * click on the handle) is the host `<th>`, so it would reach the cell's
			 * `onClick={onSort}` and toggle sorting. A one-shot capture-phase listener
			 * on the window intercepts that click before it reaches any cell. The rAF
			 * fallback drops the listener if no click is synthesized (e.g. after
			 * `pointercancel`) so a later genuine header click still sorts.
			 */
			const suppressNextClick = (): void => {
				const onClickCapture = (clickEvent: MouseEvent): void => {
					clickEvent.stopPropagation();
					clickEvent.preventDefault();
				};

				window.addEventListener("click", onClickCapture, { capture: true, once: true });
				requestAnimationFrame(() => {
					window.removeEventListener("click", onClickCapture, { capture: true });
				});
			};

			const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (event): void => {
				if (disabled || !resizingOptions) {
					return;
				}

				// A gesture is already in flight (e.g. a second finger on another handle):
				// ignore the new pointerdown rather than overwrite `dragState`/teardown, which
				// would strand the first gesture's listeners and commit widths from mixed state.
				if (dragState.current !== null) {
					return;
				}

				event.preventDefault();
				event.stopPropagation();
				const startWidths = readStartWidths();
				const groupStartPx = startWidths.reduce((sum, width) => sum + width, 0);

				// Pin every resized leaf so action-column auto-size leaves them alone from here on.
				leaves.forEach((leaf) => pinnedByResize.current.add(leaf));

				// Freeze every column to its current px before the drag begins so the
				// non-dragged columns stop reacting to the table width (see
				// freezeAllColumnWidths). Measured before any width is mutated, so it
				// captures the genuine starting layout.
				freezeAllColumnWidths();

				dragState.current = {
					leaves,
					startX: event.clientX,
					startWidths,
					groupStartPx,
					reportColumn
				};

				// Bind the whole drag to the handle. On touch this stops the browser
				// from reinterpreting the gesture (scroll / native text selection /
				// long-press callout) once the finger leaves the 6px handle target.
				const handleEl = event.currentTarget;
				handleEl.setPointerCapture?.(event.pointerId);

				// The handle itself has `user-select: none`, but a touch-drag would
				// otherwise select text in every cell the finger passes over. Suppress
				// selection document-wide for the duration of the drag, then restore.
				const { body } = document;
				const previousUserSelect = body.style.userSelect;
				const previousWebkitUserSelect = body.style.webkitUserSelect;
				body.style.userSelect = "none";
				body.style.webkitUserSelect = "none";

				const tableEl = tableRef.current;

				if (tableEl) {
					tableEl.dataset.resizing = "true";
				}

				/*
				 * Resize handlers expect react-draggable's `event`/`data` pair, rebuilt here
				 * from raw pointer events. `x`/`y` are the cursor's client coordinates,
				 * `lastX`/`lastY` the previous callback's, `deltaX`/`deltaY` the difference,
				 * `node` the handle.
				 */
				let lastReportedX = event.clientX;
				let lastReportedY = event.clientY;

				const draggableData = (clientX: number, clientY: number): ColumnResizeDragData => {
					const data: ColumnResizeDragData = {
						node: handleEl,
						x: clientX,
						y: clientY,
						deltaX: clientX - lastReportedX,
						deltaY: clientY - lastReportedY,
						lastX: lastReportedX,
						lastY: lastReportedY
					};
					lastReportedX = clientX;
					lastReportedY = clientY;

					return data;
				};

				resizingOptions.onBeginResize?.({
					resizedColumn: reportColumn,
					event,
					data: draggableData(event.clientX, event.clientY)
				});

				// Coalesce pointer moves into one DOM write per frame. Each write sets
				// a custom property on the table root, which invalidates layout across
				// every rendered (sub)grid row; without this, a burst of pointermove
				// events forces multiple style recalcs per frame and the drag stutters.
				let rafId = 0;
				let latestClientX = event.clientX;
				let latestClientY = event.clientY;
				let latestEvent: ColumnResizeDragEvent = event;

				setHandleWidthValue(handleEl, groupStartPx);

				const applyMove = (): void => {
					rafId = 0;

					if (!dragState.current) {
						return;
					}

					const cursorDeltaX = latestClientX - dragState.current.startX;
					const targetGroupPx = dragState.current.groupStartPx + cursorDeltaX;
					const factor = factorFor(dragState.current.startWidths, dragState.current.groupStartPx, targetGroupPx);
					applyFactor(dragState.current.startWidths, factor);
					setHandleWidthValue(handleEl, dragState.current.groupStartPx * factor);

					resizingOptions.onResize?.({
						resizedColumn: reportColumn,
						event: latestEvent,
						data: draggableData(latestClientX, latestClientY)
					});
				};

				const handlePointerMove = (moveEvent: PointerEvent): void => {
					if (!dragState.current) {
						return;
					}

					latestClientX = moveEvent.clientX;
					latestClientY = moveEvent.clientY;
					latestEvent = moveEvent;

					if (rafId === 0) {
						rafId = requestAnimationFrame(applyMove);
					}
				};

				const finishDrag = (commit: boolean): void => {
					document.removeEventListener("pointermove", handlePointerMove);
					document.removeEventListener("pointerup", handlePointerEnd);
					document.removeEventListener("pointercancel", handlePointerEnd);

					handleEl.releasePointerCapture?.(event.pointerId);
					body.style.userSelect = previousUserSelect;
					body.style.webkitUserSelect = previousWebkitUserSelect;

					if (rafId !== 0) {
						cancelAnimationFrame(rafId);
						rafId = 0;
					}

					if (tableEl) {
						delete tableEl.dataset.resizing;
					}

					activeDragTeardown.current = null;

					if (dragState.current && commit) {
						// Derive the final width from the last cursor position (the source
						// of truth) rather than re-measuring — a pending frame may not have
						// flushed the latest move to the DOM yet. Flush it here so the
						// reported width matches what the column settles at.
						const cursorDeltaX = latestClientX - dragState.current.startX;
						const targetGroupPx = dragState.current.groupStartPx + cursorDeltaX;
						const factor = factorFor(dragState.current.startWidths, dragState.current.groupStartPx, targetGroupPx);
						applyFactor(dragState.current.startWidths, factor);
						setHandleWidthValue(handleEl, dragState.current.groupStartPx * factor);

						const endWidths = endWidthsFor(dragState.current.startWidths, factor);

						resizingOptions.onEndResize?.({
							resizedColumn: reportColumn,
							resizedWidthsGetter: (col) => endWidths.get(col),
							event: latestEvent,
							data: draggableData(latestClientX, latestClientY)
						});
					}

					dragState.current = null;
				};

				// `pointercancel` (e.g. the browser reclaiming a touch gesture) commits
				// the in-flight width like `pointerup` — the column already renders at
				// that width, and pointer capture has delivered every move so far.
				const handlePointerEnd = (endEvent: PointerEvent): void => {
					latestEvent = endEvent;
					// Arm the click guard before tearing down: the synthetic click
					// follows this pointerup synchronously.
					suppressNextClick();
					finishDrag(true);
				};

				document.addEventListener("pointermove", handlePointerMove);
				document.addEventListener("pointerup", handlePointerEnd);
				document.addEventListener("pointercancel", handlePointerEnd);

				// Unmount teardown only restores global state — no consumer callbacks.
				activeDragTeardown.current = (): void => {
					finishDrag(false);
				};
			};

			const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event): void => {
				if (disabled || !resizingOptions) {
					return;
				}

				// Keyboard steps have no cursor, so the react-draggable-shaped `data`
				// reports the step delta in `deltaX` (0 for begin/reset) with zeroed
				// coordinates, and the KeyboardEvent travels as `event`.
				const keyboardData = (deltaX: number, node: HTMLElement): ColumnResizeDragData => ({
					node,
					x: 0,
					y: 0,
					deltaX,
					deltaY: 0,
					lastX: 0,
					lastY: 0
				});
				const keyboardEvent = event as unknown as ColumnResizeDragEvent;

				if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
					event.preventDefault();
					event.stopPropagation();
					// Defer the thead measure loops for the duration of the keypress burst,
					// like the pointer drag does for its duration.
					markKeyboardResizeStep();
					// Pin every resized leaf so action-column auto-size leaves them alone from here on.
					leaves.forEach((leaf) => pinnedByResize.current.add(leaf));
					// Same freeze as the pointer path: pin all columns to px and switch
					// the table to its resized layout before applying the step.
					freezeAllColumnWidths();

					// Each keypress is a one-shot resize gesture: begin and end bracket
					// the single step so consumers see the same lifecycle as a drag.
					resizingOptions.onBeginResize?.({
						resizedColumn: reportColumn,
						event: keyboardEvent,
						data: keyboardData(0, event.currentTarget)
					});

					// One step grows/shrinks the whole gesture by KEYBOARD_STEP_PX total,
					// distributed proportionally across its leaves (single leaf → additive).
					const delta = event.key === "ArrowRight" ? KEYBOARD_STEP_PX : -KEYBOARD_STEP_PX;
					const startWidths = readStartWidths();
					const groupStartPx = startWidths.reduce((sum, width) => sum + width, 0);
					const factor = factorFor(startWidths, groupStartPx, groupStartPx + delta);
					applyFactor(startWidths, factor);
					setHandleWidthValue(event.currentTarget, groupStartPx * factor);

					const endWidths = endWidthsFor(startWidths, factor);
					resizingOptions.onEndResize?.({
						resizedColumn: reportColumn,
						resizedWidthsGetter: (col) => endWidths.get(col),
						event: keyboardEvent,
						data: keyboardData(delta, event.currentTarget)
					});
				} else if (event.key === "Escape") {
					event.preventDefault();
					event.stopPropagation();
					// End any keyboard burst NOW: the reset below must re-measure promptly,
					// not after the trailing debounce.
					clearKeyboardResizeBurst();
					resetAllColumnWidths();
					// Reflect the reverted width rather than dropping `aria-valuenow` — a bare
					// focusable separator falls back to the phantom "50" (see setHandleWidthValue).
					// Measuring after the reset's removeProperty forces layout, so this reads the
					// restored proportional width (summed across the gesture's leaves).
					setHandleWidthValue(
						event.currentTarget,
						leaves.reduce((sum, leaf) => sum + getColumnWidthPx(leaf), 0)
					);

					// All widths just reverted to their defaults; report the reset so
					// consumers persisting widths via onEndResize can clear them — the
					// getter returns `undefined` for every column ("no stored width").
					resizingOptions.onEndResize?.({
						resizedColumn: reportColumn,
						resizedWidthsGetter: () => undefined,
						event: keyboardEvent,
						data: keyboardData(0, event.currentTarget)
					});
				}
			};

			return {
				onPointerDown,
				onKeyDown,
				tabIndex: 0,
				role: "separator",
				"aria-label": label,
				"aria-orientation": "vertical"
			};
		},
		[
			disabled,
			resizingOptions,
			leafColumns,
			getColumnWidthPx,
			setColumnWidthPx,
			computeNewWidth,
			syncPinOffsets,
			freezeAllColumnWidths,
			resetAllColumnWidths,
			markKeyboardResizeStep,
			clearKeyboardResizeBurst,
			tableRef
		]
	);

	const resizeHandleProps = useCallback(
		(columnIndex: number): ResizeHandleProps => {
			const column = leafColumns[columnIndex];
			// Prefer the visible text label; fall back to `hiddenText` (action columns
			// keep their accessible name there, with an empty `label`) and finally to the
			// 1-based index, so every handle — including action-column handles — has a
			// non-empty accessible name.
			const columnLabel =
				(typeof column?.label === "string" && column.label) || column?.hiddenText || `Column ${columnIndex + 1}`;

			return buildHandleProps([columnIndex], column, `Resize ${columnLabel}`);
		},
		[buildHandleProps, leafColumns]
	);

	const groupResizeHandleProps = useCallback(
		(leafFrom: number, leafTo: number, groupColumn: BaseColumnType<RowType>, groupLabel: string): ResizeHandleProps => {
			const leaves: number[] = [];

			for (let leaf = leafFrom; leaf <= leafTo; leaf++) {
				leaves.push(leaf);
			}

			return buildHandleProps(leaves, groupColumn, `Resize ${groupLabel} group`);
		},
		[buildHandleProps]
	);

	return { resizeHandleProps, groupResizeHandleProps, isResizable, pinnedByResize, remeasureSignal };
}
