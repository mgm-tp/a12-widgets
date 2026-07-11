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

import type { RefCallback } from "react";
import type {
	InfiniteLoader,
	List as ReactVirtualizedList,
	ListProps as ReactVirtualizedProps
} from "react-virtualized";

export interface InfiniteScrollOptions {
	/**
	 * A fixed height of the rows
	 */
	rowHeight: number;

	/**
	 * Total number of rows
	 */
	rowCount: number;

	/**
	 * To specify a loading status for each row.
	 * If a row is marked as loaded, it will be rendered using the body row renderer as normal, otherwise a placeholder
	 * will be rendered instead.
	 */
	rowLoadingStatus(rowIndex: number): RowLoadingStatus;

	/**
	 * A callback that will be triggered when more rows should be loaded.
	 * Use this callback to fetch the rows and update the data.
	 *
	 * @param range – The rows between `startIndex` and `stopIndex` inclusively should be loaded
	 * @returns Promise<void> which resolves when data is updated
	 */
	loadData(range: { startIndex: number; stopIndex: number }): Promise<void>;

	/**
	 * Threshold at which to pre-fetch data.
	 * A threshold `X` means that the next rows will start loading when a user scrolls within `X` last rows.
	 * @default 15
	 */
	threshold?: number;

	/**
	 * Minimum number of rows to be loaded at a time. This can be used to reduce the number of HTTP requests
	 * @default 10
	 */
	minimumBatchSize?: number;

	/**
	 * Ref to InfiniteLoader from react-virtualized package used in the table
	 */
	loaderRef?: RefCallback<InfiniteLoader>;

	/**
	 * To override the props of the react-virtualized list used inside an infinite-scroll table
	 */
	overrideListProps?: Partial<ReactVirtualizedProps> & { listRef?: RefCallback<ReactVirtualizedList> };
}

/**
 * Loading status of a row.
 * `undefined`, `loading` and `loaded` indicate that the row is unloaded, loading and loaded respectively.
 */
export type RowLoadingStatus = undefined | "loading" | "loaded";
