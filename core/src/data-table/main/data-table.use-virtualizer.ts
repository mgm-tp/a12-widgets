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

import type { VirtualItem } from "@tanstack/react-virtual";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Key, Ref, RefCallback, RefObject } from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { focusEnsuringTabIndex } from "../../common/main/utils.js";

import type { TableScrollToNodeHandler } from "./foundation/table-renderer.api.js";
import type { DataTableVirtualizerHandle } from "./data-table-virtualizer.api.js";

const DEFAULT_OVERSCAN = 10;

const DEFAULT_ESTIMATED_ROW_HEIGHT = 50;

/** Supports both callback and object refs for {@link UseDataTableVirtualizerParams#virtualizerRef}. */
function assignHandleRef(
	ref: Ref<DataTableVirtualizerHandle | null> | undefined,
	value: DataTableVirtualizerHandle | null
): void {
	if (!ref) {
		return;
	}

	if (typeof ref === "function") {
		ref(value);
	} else {
		ref.current = value;
	}
}

export interface UseDataTableVirtualizerParams {
	/** Total number of rows to virtualize. */
	rowCount: number;

	/** Fixed row height in CSS pixels. Omit to measure each rendered row from the DOM. */
	rowHeight?: number;

	/** Estimate for not-yet-measured rows in dynamic mode. Ignored when `rowHeight` is set. */
	estimatedRowHeight?: number;

	/** Rows to render above/below the viewport as a buffer. */
	overscan?: number;

	/** Ancestor scroll container the virtualizer observes (single-scroll-container shape). */
	scrollElementRef: RefObject<HTMLElement | null>;

	/** Registers the table-level scroll-to-row handler. */
	scrollToNode?: (handler: TableScrollToNodeHandler) => void;

	/** Resolves a rendered row's DOM element (used for focus after scroll). */
	getRowElement?: (rowIndex: number) => HTMLElement | null;

	/**
	 * Stable per-row key. In dynamic mode this keys the measurement cache, so row
	 * heights survive data reorders instead of being re-attributed by index.
	 */
	getItemKey?: (index: number) => Key;

	/** Receives the imperative scroll/measure handle (`null` on unmount). */
	virtualizerRef?: Ref<DataTableVirtualizerHandle | null>;
}

export interface UseDataTableVirtualizerResult {
	/** Attach to the virtualized `<tbody>`; drives the `scrollMargin` measurement. */
	setBodyRef: RefCallback<HTMLTableSectionElement>;

	/** Currently rendered rows (visible window + overscan). */
	virtualItems: VirtualItem[];

	/** Total scrollable height of all rows (excludes the sticky-header scroll margin). */
	totalSize: number;

	/**
	 * Height of the top spacer `<tr>` — reserves the space of the rows above the
	 * rendered window so the first rendered row sits at its true scroll offset.
	 */
	topSpacerHeight: number;

	/**
	 * Height of the bottom spacer `<tr>` — reserves the space of the rows below
	 * the rendered window so the scrollbar reflects the full dataset.
	 */
	bottomSpacerHeight: number;

	/**
	 * Dynamic mode only (`rowHeight` omitted): returns a ref callback for the row at
	 * `index` that measures the row's rendered height and keeps it observed with a
	 * `ResizeObserver`. Attach it to the row's root `<tr>`. `undefined` in
	 * fixed-height mode.
	 */
	measureRowRefFor?: (index: number) => RefCallback<HTMLElement>;
}

/**
 * Shared `@tanstack/react-virtual` setup for both the plain virtualized body and the
 * infinite-scroll body, driven by the surrounding viewport scroll container.
 *
 * Row heights are either fixed (`rowHeight` set) or measured per row from the DOM
 * (`rowHeight` omitted — see {@link UseDataTableVirtualizerResult#measureRowRefFor}).
 * Because the virtualized `<tbody>` sits below a sticky `<thead>` of variable height,
 * row offsets are re-based via `scrollMargin`, measured from the live DOM and kept
 * current with a `ResizeObserver` on the header so toggling the filter row (which
 * changes header height) does not misalign the rows.
 *
 * @internal
 */
export function useDataTableVirtualizer(params: UseDataTableVirtualizerParams): UseDataTableVirtualizerResult {
	const {
		rowCount,
		rowHeight,
		estimatedRowHeight,
		overscan,
		scrollElementRef,
		scrollToNode,
		getRowElement,
		getItemKey,
		virtualizerRef
	} = params;

	// Omitting `rowHeight` switches from the fixed-size fast path to per-row DOM
	// measurement.
	const isDynamic = rowHeight === undefined;

	const bodyElRef = useRef<HTMLTableSectionElement | null>(null);
	const [scrollMargin, setScrollMargin] = useState(0);

	// Distance from the scroll container's content top to the `<tbody>` top. The
	// `+ scrollTop` term cancels the scroll position so the value is stable while scrolling.
	const measureScrollMargin = useCallback((): void => {
		const scrollEl = scrollElementRef.current;
		const bodyEl = bodyElRef.current;

		if (!scrollEl || !bodyEl) {
			return;
		}

		const margin = bodyEl.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top + scrollEl.scrollTop;

		setScrollMargin((prev) => (prev !== margin ? margin : prev));
	}, [scrollElementRef]);

	const setBodyRef = useCallback(
		(node: HTMLTableSectionElement | null): void => {
			bodyElRef.current = node;
			measureScrollMargin();
		},
		[measureScrollMargin]
	);

	// Reading the ref during render lets the effect re-run once the (initially null)
	// viewport node attaches, and re-observe when it changes identity.
	const scrollEl = scrollElementRef.current;

	useLayoutEffect(() => {
		if (!scrollEl) {
			return;
		}

		measureScrollMargin();

		const observer = new ResizeObserver(() => measureScrollMargin());
		observer.observe(scrollEl);

		// The header height directly determines the margin; the scroll container catches
		// width-driven header reflow.
		const headEl = scrollEl.querySelector("thead");

		if (headEl) {
			observer.observe(headEl);
		}

		return (): void => observer.disconnect();
	}, [scrollEl, measureScrollMargin]);

	const virtualizer = useVirtualizer({
		count: rowCount,
		getScrollElement: () => scrollElementRef.current,
		estimateSize: () => rowHeight ?? estimatedRowHeight ?? DEFAULT_ESTIMATED_ROW_HEIGHT,
		overscan: overscan ?? DEFAULT_OVERSCAN,
		scrollMargin,
		getItemKey
	});

	// In dynamic mode every rendered row reports its real height. The returned ref
	// callback stamps `data-index` (how TanStack attributes a measurement to an item)
	// before handing the node to `measureElement`, which measures it and attaches a
	// ResizeObserver so later content-driven height changes are picked up too.
	const measureRowRefFor = useMemo(() => {
		if (!isDynamic) {
			return undefined;
		}

		return (index: number): RefCallback<HTMLElement> =>
			(node) => {
				if (node) {
					node.dataset.index = String(index);
				}

				virtualizer.measureElement(node);
			};
	}, [isDynamic, virtualizer]);

	useEffect(() => {
		if (!virtualizerRef) {
			return;
		}

		const handle: DataTableVirtualizerHandle = {
			scrollToIndex: (index, options) => virtualizer.scrollToIndex(index, options),
			scrollToOffset: (offsetPx, options) => virtualizer.scrollToOffset(offsetPx, options),
			measure: () => virtualizer.measure(),
			getTotalSize: () => virtualizer.getTotalSize(),
			getVirtualIndexes: () => virtualizer.getVirtualIndexes()
		};

		assignHandleRef(virtualizerRef, handle);

		return (): void => assignHandleRef(virtualizerRef, null);
	}, [virtualizerRef, virtualizer]);

	useEffect(() => {
		if (!scrollToNode) {
			return;
		}

		scrollToNode((nodeIndex, options) => {
			setTimeout(() => {
				virtualizer.scrollToIndex(nodeIndex, { align: "center" });

				if (options?.autoFocus) {
					requestAnimationFrame(() => {
						const el = getRowElement?.(nodeIndex);

						if (el) {
							focusEnsuringTabIndex(el);
						}
					});
				}
			});
		});
	}, [scrollToNode, getRowElement, virtualizer]);

	// Native `<tr>` cannot be `position: absolute`, so the window of rendered rows
	// flows normally between two spacer `<tr>`s whose heights reserve the off-screen
	// rows. `item.start`/`end` include `scrollMargin` (the sticky-header offset);
	// subtract it to re-base to the `<tbody>` top.
	const virtualItems = virtualizer.getVirtualItems();
	const totalSize = virtualizer.getTotalSize();
	const firstItem = virtualItems[0];
	const lastItem = virtualItems[virtualItems.length - 1];
	const topSpacerHeight = firstItem ? Math.max(0, firstItem.start - scrollMargin) : 0;
	const bottomSpacerHeight = lastItem ? Math.max(0, totalSize - (lastItem.end - scrollMargin)) : totalSize;

	return {
		setBodyRef,
		virtualItems,
		totalSize,
		topSpacerHeight,
		bottomSpacerHeight,
		measureRowRefFor
	};
}
