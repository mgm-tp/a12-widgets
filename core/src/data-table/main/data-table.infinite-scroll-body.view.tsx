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

import type { CSSProperties, Key, ReactElement, ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";

import type { TableScrollToNodeHandler } from "./foundation/table-renderer.api.js";
import type { DataTableInfiniteScrollOptions } from "./data-table-infinite-scroll.api.js";
import { useDataTableVirtualizer } from "./data-table.use-virtualizer.js";
import { DataTableWindowedTbody } from "./data-table.windowed-tbody.view.js";

export interface DataTableInfiniteScrollSlot {
	index: number;
	key: Key;

	/**
	 * Per-row inline style contributed by the windowed-body implementation.
	 * The default spacer-row design positions rows in normal flow and supplies
	 * no style; a custom `infiniteScrollBodyRenderer` using absolute
	 * positioning can pass one here.
	 */
	style?: CSSProperties;
	loaded: boolean;
}

export interface DataTableInfiniteScrollBodyProps {
	options: DataTableInfiniteScrollOptions;
	scrollElementRef: RefObject<HTMLElement | null>;
	rowKeyFor: (rowIndex: number) => Key;
	scrollToNode?: (handler: TableScrollToNodeHandler) => void;
	getRowElement?: (rowIndex: number) => HTMLElement | null;
	renderRow: (slot: DataTableInfiniteScrollSlot) => ReactNode;

	/**
	 * Number of leaf columns — the `colSpan` for the top/bottom spacer rows.
	 *
	 * @see DataTableWindowedTbodyProps.colSpan for why this must equal the real column count.
	 */
	colSpan: number;
}

/**
 * Infinite-scroll `<tbody>` implementation.
 *
 * Shares the {@link useDataTableVirtualizer} engine with {@link DataTableVirtualizedBody} and
 * adds incremental loading: an effect keyed on the rendered range detects unloaded rows
 * entering (or approaching, within {@link DataTableInfiniteScrollOptions#threshold}) the
 * viewport and calls {@link DataTableInfiniteScrollOptions#loadData} to fetch a batch of at
 * least {@link DataTableInfiniteScrollOptions#minimumBatchSize} rows. Rows whose
 * {@link DataTableInfiniteScrollOptions#rowLoadingStatus} is not `"loaded"` render via the
 * consumer's placeholder callback. (`@tanstack/react-virtual` has no built-in
 * `InfiniteLoader`, so range detection, batching and in-flight de-duplication are
 * implemented here.)
 *
 * @internal
 */
export function DataTableInfiniteScrollBody(props: DataTableInfiniteScrollBodyProps): ReactElement {
	const { options, scrollElementRef, rowKeyFor, scrollToNode, getRowElement, renderRow, colSpan } = props;
	const {
		rowHeight,
		rowCount,
		rowLoadingStatus,
		loadData,
		threshold = 15,
		minimumBatchSize = 10,
		virtualizerRef
	} = options;

	const { setBodyRef, virtualItems, topSpacerHeight, bottomSpacerHeight } = useDataTableVirtualizer({
		rowCount,
		rowHeight,
		scrollElementRef,
		scrollToNode,
		getRowElement,
		getItemKey: rowKeyFor,
		virtualizerRef
	});

	// Ranges already requested via `loadData`, keyed `start:stop`. A key is added before
	// the call and kept after the promise settles (it is NOT removed on completion):
	// once a range's rows load, its key can never be recomputed, and keeping the key for
	// a request that failed (or resolved without updating statuses) prevents the same
	// batch from being re-requested in a storm. Retry semantics: a failed range is
	// retried only when scrolling produces a *different* batch key or the dataset is
	// replaced (`rowCount` change clears the cache).
	const requestedRanges = useRef<Set<string>>(new Set());

	// Bumped when a `loadData` promise settles, to re-scan the visible window once.
	// Needed because the load effect intentionally does not depend on the consumer's
	// `rowLoadingStatus` callback identity: if a request loaded fewer rows than asked,
	// the leftover unloaded rows would otherwise wait for the next scroll.
	const [loadEpoch, setLoadEpoch] = useState(0);

	// Latest-ref pattern: consumers typically pass inline lambdas, so keeping these out
	// of the load effect's deps stops every parent render from re-running the scan. The
	// sync effect is declared *before* the load effect so the refs are current when it
	// reads them (effects run in declaration order).
	const loadDataRef = useRef(loadData);
	const rowLoadingStatusRef = useRef(rowLoadingStatus);

	useEffect(() => {
		loadDataRef.current = loadData;
		rowLoadingStatusRef.current = rowLoadingStatus;
	});

	const firstVisible = virtualItems[0]?.index ?? 0;
	const lastVisible = virtualItems[virtualItems.length - 1]?.index ?? 0;

	// Drop the request cache when the dataset is replaced.
	useEffect(() => {
		requestedRanges.current.clear();
	}, [rowCount]);

	useEffect(() => {
		if (rowCount === 0) {
			return;
		}

		const statusOf = rowLoadingStatusRef.current;

		// Scan the rendered window plus `threshold` rows ahead for the first unloaded row.
		const scanStart = firstVisible;
		const scanEnd = Math.min(rowCount - 1, lastVisible + threshold);

		let firstUnloaded = -1;
		let lastUnloaded = -1;

		for (let i = scanStart; i <= scanEnd; i++) {
			if (statusOf(i) === undefined) {
				if (firstUnloaded === -1) {
					firstUnloaded = i;
				}

				lastUnloaded = i;
			}
		}

		if (firstUnloaded === -1) {
			return;
		}

		// Expand to at least `minimumBatchSize`, clamped to the dataset.
		let startIndex = firstUnloaded;
		const stopIndex = Math.min(rowCount - 1, Math.max(lastUnloaded, firstUnloaded + minimumBatchSize - 1));

		// Back-fill toward the start only across still-unloaded rows, so a small leading
		// sliver is batched without re-requesting already-loaded rows.
		while (startIndex > 0 && stopIndex - startIndex + 1 < minimumBatchSize && statusOf(startIndex - 1) === undefined) {
			startIndex--;
		}

		const key = `${startIndex}:${stopIndex}`;

		if (requestedRanges.current.has(key)) {
			return;
		}

		requestedRanges.current.add(key);
		void loadDataRef.current({ startIndex, stopIndex }).finally(() => {
			setLoadEpoch((epoch) => epoch + 1);
		});
	}, [firstVisible, lastVisible, rowCount, threshold, minimumBatchSize, loadEpoch]);

	return (
		<DataTableWindowedTbody
			setBodyRef={setBodyRef}
			colSpan={colSpan}
			topSpacerHeight={topSpacerHeight}
			bottomSpacerHeight={bottomSpacerHeight}
		>
			{virtualItems.map((item) =>
				renderRow({
					index: item.index,
					key: rowKeyFor(item.index) ?? item.key,
					loaded: rowLoadingStatus(item.index) === "loaded"
				})
			)}
		</DataTableWindowedTbody>
	);
}

DataTableInfiniteScrollBody.displayName = "DataTableInfiniteScrollBody";
