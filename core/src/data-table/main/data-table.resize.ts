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
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { DraggableData, DraggableEvent } from "react-draggable";

import { DataRoles } from "../../common/main/data-roles.js";

import type { BaseColumnType, Column } from "./foundation/column.api.js";
import type { DataTableColumnResizingOptions } from "./data-table.api.js";
import { FIXED_WIDTH_BASE_PX } from "./data-table.utils.js";

const MIN_COLUMN_WIDTH_PX = 30;
const KEYBOARD_STEP_PX = 10;

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

interface UseColumnResizeResult {
	resizeHandleProps: (columnIndex: number) => ResizeHandleProps;
	isResizable: (columnIndex: number) => boolean;
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
export function useColumnResize<RowType>(params: UseColumnResizeParams<RowType>): UseColumnResizeResult {
	const { tableRef, leafColumns, resizingOptions, disabled } = params;

	const dragState = useRef<{
		columnIndex: number;
		startX: number;
		startWidthPx: number;
		column: BaseColumnType<RowType>;
	} | null>(null);

	// Teardown for the drag in progress, if any. Lets unmount restore global
	// state (document listeners, body user-select, `data-resizing`) without
	// firing consumer callbacks.
	const activeDragTeardown = useRef<(() => void) | null>(null);

	useEffect(
		() => (): void => {
			activeDragTeardown.current?.();
		},
		[]
	);

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

		leafColumns.forEach((_column, index) => {
			setColumnWidthPx(index, getColumnWidthPx(index));
		});

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

		delete tableEl.dataset.resized;
	}, [tableRef, leafColumns]);

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

			return !!column;
		},
		[disabled, resizingOptions, leafColumns]
	);

	const resizable = !disabled && !!resizingOptions;

	// A focusable `role="separator"` resize handle is a range widget. With no
	// `aria-valuenow` at rest the platform reports its default `0–100` midpoint —
	// a phantom "50" screen readers announce on every resizable column. Seed each
	// handle's range semantics from the rendered column widths on mount, and resync
	// on relayout. Mirrors `useLeafPinOffsets`: observe the stable <thead>, and defer
	// while a drag is active (the gesture keeps the dragged handle's value fresh and
	// the rest are frozen) so the per-frame CSS-variable resize path is left alone.
	useLayoutEffect(() => {
		const tableEl = tableRef.current;

		if (!tableEl || !resizable) {
			return;
		}

		const measure = (): void => {
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
		};

		measure();

		// During a drag (`data-resizing`) the observer fires every frame; measuring then
		// would re-introduce the per-frame React/DOM work the CSS-variable design avoids.
		// rAF-poll until the flag clears, then measure once (mirrors useLeafPinOffsets).
		let rafId = 0;

		const measureAfterResize = (): void => {
			rafId = 0;

			if (tableEl.dataset.resizing === "true") {
				rafId = requestAnimationFrame(measureAfterResize);

				return;
			}

			measure();
		};

		const handleResizeTick = (): void => {
			if (tableEl.dataset.resizing === "true") {
				if (rafId === 0) {
					rafId = requestAnimationFrame(measureAfterResize);
				}

				return;
			}

			measure();
		};

		const observer = new ResizeObserver(handleResizeTick);
		const theadEl = tableEl.querySelector("thead");

		if (theadEl) {
			observer.observe(theadEl);
		}

		return (): void => {
			observer.disconnect();

			if (rafId !== 0) {
				cancelAnimationFrame(rafId);
			}
		};
	}, [tableRef, resizable, leafColumns, getHeadCell]);

	const resizeHandleProps = useCallback(
		(columnIndex: number): ResizeHandleProps => {
			const column = leafColumns[columnIndex];
			// Prefer the visible text label; fall back to `hiddenText` (action columns
			// keep their accessible name there, with an empty `label`) and finally to the
			// 1-based index, so every handle — including action-column handles — has a
			// non-empty accessible name.
			const columnLabel =
				(typeof column?.label === "string" && column.label) || column?.hiddenText || `Column ${columnIndex + 1}`;

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

				event.preventDefault();
				event.stopPropagation();
				const startWidthPx = getColumnWidthPx(columnIndex);

				// Freeze every column to its current px before the drag begins so the
				// non-dragged columns stop reacting to the table width (see
				// freezeAllColumnWidths). Measured before any width is mutated, so it
				// captures the genuine starting layout.
				freezeAllColumnWidths();

				dragState.current = {
					columnIndex,
					startX: event.clientX,
					startWidthPx,
					column
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

				const draggableData = (clientX: number, clientY: number): DraggableData => {
					const data: DraggableData = {
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
					resizedColumn: column,
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
				let latestEvent: DraggableEvent = event;

				setHandleWidthValue(handleEl, startWidthPx);

				const applyMove = (): void => {
					rafId = 0;

					if (!dragState.current) {
						return;
					}

					const cursorDeltaX = latestClientX - dragState.current.startX;
					const newWidthPx = dragState.current.startWidthPx + cursorDeltaX;
					setColumnWidthPx(columnIndex, newWidthPx);
					setHandleWidthValue(handleEl, newWidthPx);

					resizingOptions.onResize?.({
						resizedColumn: column,
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
						const finalWidthPx = Math.max(MIN_COLUMN_WIDTH_PX, dragState.current.startWidthPx + cursorDeltaX);
						setColumnWidthPx(columnIndex, finalWidthPx);
						setHandleWidthValue(handleEl, finalWidthPx);

						const newWidth = computeNewWidth(column, dragState.current.startWidthPx, finalWidthPx);

						resizingOptions.onEndResize?.({
							resizedColumn: column,
							resizedWidthsGetter: (col) => (col === column ? newWidth : undefined),
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
				const keyboardData = (deltaX: number, node: HTMLElement): DraggableData => ({
					node,
					x: 0,
					y: 0,
					deltaX,
					deltaY: 0,
					lastX: 0,
					lastY: 0
				});
				const keyboardEvent = event as unknown as DraggableEvent;

				if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
					event.preventDefault();
					event.stopPropagation();
					// Same freeze as the pointer path: pin all columns to px and switch
					// the table to its resized layout before applying the step.
					freezeAllColumnWidths();

					// Each keypress is a one-shot resize gesture: begin and end bracket
					// the single step so consumers see the same lifecycle as a drag.
					resizingOptions.onBeginResize?.({
						resizedColumn: column,
						event: keyboardEvent,
						data: keyboardData(0, event.currentTarget)
					});

					const delta = event.key === "ArrowRight" ? KEYBOARD_STEP_PX : -KEYBOARD_STEP_PX;
					const currentWidthPx = getColumnWidthPx(columnIndex);
					const newWidthPx = Math.max(MIN_COLUMN_WIDTH_PX, currentWidthPx + delta);
					setColumnWidthPx(columnIndex, newWidthPx);
					setHandleWidthValue(event.currentTarget, newWidthPx);

					const newWidth = computeNewWidth(column, currentWidthPx, newWidthPx);
					resizingOptions.onEndResize?.({
						resizedColumn: column,
						resizedWidthsGetter: (col) => (col === column ? newWidth : undefined),
						event: keyboardEvent,
						data: keyboardData(delta, event.currentTarget)
					});
				} else if (event.key === "Escape") {
					event.preventDefault();
					event.stopPropagation();
					resetAllColumnWidths();
					// Reflect the reverted width rather than dropping `aria-valuenow` — a bare
					// focusable separator falls back to the phantom "50" (see setHandleWidthValue).
					// Measuring after the reset's removeProperty forces layout, so this reads the
					// restored proportional width.
					setHandleWidthValue(event.currentTarget, getColumnWidthPx(columnIndex));

					// All widths just reverted to their defaults; report the reset so
					// consumers persisting widths via onEndResize can clear them — the
					// getter returns `undefined` for every column ("no stored width").
					resizingOptions.onEndResize?.({
						resizedColumn: column,
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
				"aria-label": `Resize ${columnLabel}`,
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
			freezeAllColumnWidths,
			resetAllColumnWidths,
			tableRef
		]
	);

	return { resizeHandleProps, isResizable };
}
