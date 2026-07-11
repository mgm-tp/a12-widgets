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

import type { Ref } from "react";

import type { RowLoadingStatus } from "./foundation/infinite-scroll.api.js";
import type { DataTableVirtualizerHandle } from "./data-table-virtualizer.api.js";

export type DataTableRowLoadingStatus = RowLoadingStatus;

/**
 * Options for DataTable infinite scroll mode.
 *
 * Combines virtualization with incremental data loading: as the user scrolls toward
 * an unloaded row, {@link loadData} is invoked with the range of indices to fetch.
 * Rows whose {@link rowLoadingStatus} is not `"loaded"` render a placeholder.
 */
export interface DataTableInfiniteScrollOptions {
	/**
	 * Fixed row height in pixels. Required.
	 */
	rowHeight: number;

	/**
	 * Total number of rows in the (possibly partially-loaded) dataset.
	 */
	rowCount: number;

	/**
	 * Loading status for each row. Loaded rows render via the body cell renderers;
	 * all other rows render the placeholder.
	 */
	rowLoadingStatus(rowIndex: number): RowLoadingStatus;

	/**
	 * Triggered when more rows should be loaded. Use it to fetch the rows and update
	 * the data.
	 *
	 * @param range Inclusive `[startIndex, stopIndex]` range to load.
	 * @returns Promise resolved once consumer state has been updated.
	 */
	loadData(range: { startIndex: number; stopIndex: number }): Promise<void>;

	/**
	 * Threshold at which to pre-fetch data: the next rows start loading when the user
	 * scrolls within `threshold` rows of an unloaded row. `0` means only on entry.
	 *
	 * @default 15
	 */
	threshold?: number;

	/**
	 * Minimum number of rows to request per {@link loadData} call. Reduces the number
	 * of requests by batching.
	 *
	 * @default 10
	 */
	minimumBatchSize?: number;

	/**
	 * Receives an imperative {@link DataTableVirtualizerHandle} for programmatic
	 * scrolling and re-measurement (`null` on unmount).
	 */
	virtualizerRef?: Ref<DataTableVirtualizerHandle | null>;
}
