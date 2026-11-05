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

import { useEffect, useRef, useState } from "react";

import type { DataTableInfiniteScrollOptions } from "./data-table-infinite-scroll.api.js";

/** Inputs {@link useDataTableInfiniteLoader} needs to drive incremental loading. */
export interface DataTableInfiniteLoaderParams extends Pick<
	DataTableInfiniteScrollOptions,
	"rowCount" | "rowLoadingStatus" | "loadData"
> {
	/** Pre-fetch distance in rows. See `DataTableInfiniteScrollOptions.threshold`. */
	threshold: number;

	/** Minimum rows per request. See `DataTableInfiniteScrollOptions.minimumBatchSize`. */
	minimumBatchSize: number;

	/** First row index in the rendered window. */
	firstVisible: number;

	/** Last row index in the rendered window. */
	lastVisible: number;
}

/**
 * Incremental-loading engine for infinite scroll: watches the rendered window and
 * calls `loadData` for the first batch of unloaded rows entering (or approaching,
 * within `threshold`) the viewport, batched to at least `minimumBatchSize` rows and
 * de-duplicated against ranges already requested.
 *
 * (`@tanstack/react-virtual` has no built-in `InfiniteLoader`, so range detection,
 * batching and in-flight de-duplication are implemented here.)
 *
 * Kept separate from the body components that use it because the loading behaviour is
 * identical in both layouts while the DOM is not: the table layout renders the window
 * into a `<tbody>` with spacer `<tr>`s, card view into a `role="list"` with spacer
 * `<div>`s. Only the windowing container differs, so only that is duplicated.
 *
 * @internal
 */
export function useDataTableInfiniteLoader(params: DataTableInfiniteLoaderParams): void {
	const { rowCount, rowLoadingStatus, loadData, threshold, minimumBatchSize, firstVisible, lastVisible } = params;

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
}
