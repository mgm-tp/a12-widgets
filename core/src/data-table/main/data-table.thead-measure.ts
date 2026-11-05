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

import type { DependencyList, RefObject } from "react";
import { useLayoutEffect } from "react";

export interface UseTheadMeasureParams {
	tableRef: RefObject<HTMLTableElement | null>;

	/**
	 * When `false` the effect is inert (no measure, no observer) — lets callers gate
	 * on their own preconditions (`resizable`, `hasPinning`, `hasFilterRow`, …) while
	 * keeping the hook call unconditional.
	 */
	enabled: boolean;

	/**
	 * Reads the header geometry and writes its imperative output (CSS custom
	 * properties / ARIA attributes). Called once on mount and on every relevant
	 * relayout. Receives the live `<table>` and the observed section — the `<thead>`,
	 * or (with {@link fallbackToBody}) the `<tbody>` when no header is rendered.
	 */
	measure: (tableEl: HTMLTableElement, sectionEl: HTMLTableSectionElement) => void;

	/**
	 * When `true` and the table renders no `<thead>` (e.g. `hideHeader`), observe and
	 * measure against the first `<tbody>` instead of going inert. Callers that need
	 * geometry even without a header (pin offsets) opt in; header-only loops
	 * (filter-row height, resize handles) leave it off.
	 */
	fallbackToBody?: boolean;

	/**
	 * When `true`, skip measuring while a column-resize drag is active
	 * (`data-resizing="true"` on the table) and instead rAF-poll until the flag
	 * clears, then measure once. During a drag the resize handler already owns the
	 * per-frame column-width vars, so re-measuring header geometry every frame is
	 * redundant layout thrash. Polling (rather than waiting for a final observer tick
	 * after pointerup) is needed because the pointerup width flush may be a no-op when
	 * the last drag frame already applied it, producing no further resize notification.
	 */
	deferDuringResize?: boolean;

	/** Optional teardown run on unmount / dep change (e.g. clear written vars). */
	onCleanup?: (tableEl: HTMLTableElement) => void;

	/** Effect dependencies — the hook re-subscribes when any of these change. */
	deps: DependencyList;
}

/**
 * Shared header-measurement primitive for DataTable's imperative-CSS-variable
 * loops (pin offsets, filter-row head height, resize-handle a11y ranges). Each such
 * loop needs the same skeleton: run a `measure` in a layout effect against the
 * rendered header, then keep it current with a `ResizeObserver` on the *stable*
 * `<thead>` (observing individual `<th>` cells breaks when a re-render recreates
 * them without re-running the effect), optionally deferring the measure while a
 * column-resize drag is in flight. This centralizes that skeleton — and the
 * defer-during-resize policy — so the individual loops only supply their `measure`.
 *
 * @internal
 */
export function useTheadMeasure({
	tableRef,
	enabled,
	measure,
	deferDuringResize = false,
	fallbackToBody = false,
	onCleanup,
	deps
}: UseTheadMeasureParams): void {
	useLayoutEffect(() => {
		const tableEl = tableRef.current;

		if (!tableEl || !enabled) {
			return;
		}

		// Reassigned by `subscribeToSection` (and read by the closures below) as the
		// observed section changes, so this must stay a `let`.
		let sectionEl: HTMLTableSectionElement | null = null;

		const resolveSection = (): HTMLTableSectionElement | null =>
			tableEl.querySelector<HTMLTableSectionElement>("thead") ??
			(fallbackToBody ? tableEl.querySelector<HTMLTableSectionElement>("tbody") : null);

		const runMeasure = (): void => {
			if (sectionEl) {
				measure(tableEl, sectionEl);
			}
		};

		// rAF handle for the deferred re-measure that fires once a resize drag ends.
		let rafId = 0;

		const measureAfterResize = (): void => {
			rafId = 0;

			if (tableEl.dataset.resizing === "true") {
				rafId = requestAnimationFrame(measureAfterResize);

				return;
			}

			runMeasure();
		};

		const handleTick = (): void => {
			if (deferDuringResize && tableEl.dataset.resizing === "true") {
				if (rafId === 0) {
					rafId = requestAnimationFrame(measureAfterResize);
				}

				return;
			}

			runMeasure();
		};

		let observer: ResizeObserver | null = null;

		const subscribeToSection = (): void => {
			observer?.disconnect();
			observer = null;
			sectionEl = resolveSection();

			if (!sectionEl) {
				return;
			}

			runMeasure();
			observer = new ResizeObserver(handleTick);
			observer.observe(sectionEl);
		};

		subscribeToSection();

		// The measured section mounted or replaced after this effect ran (e.g.
		// `hideHeader` toggled, or the tbody fallback's first body row swapped) changes
		// none of the caller's deps, so the observer above would stay bound to a
		// missing/detached section forever. Track the table's direct children and
		// re-subscribe whenever the resolved section identity changes.
		const structureObserver = new MutationObserver(() => {
			if (resolveSection() !== sectionEl) {
				subscribeToSection();
			}
		});
		structureObserver.observe(tableEl, { childList: true });

		return (): void => {
			structureObserver.disconnect();
			observer?.disconnect();

			if (rafId !== 0) {
				cancelAnimationFrame(rafId);
			}

			onCleanup?.(tableEl);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- deps are supplied by the caller
	}, deps);
}
