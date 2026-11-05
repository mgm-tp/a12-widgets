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

import type { DataTableInfiniteScrollOptions } from "./data-table-infinite-scroll.api.js";
import { useDataTableInfiniteLoader } from "./data-table.use-infinite-loader.js";
import { useDataTableVirtualizer } from "./data-table.use-virtualizer.js";
import { DataTableWindowedTbody } from "./data-table.windowed-tbody.view.js";
import type { TableScrollToNodeHandler } from "./foundation/table-renderer.api.js";

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
 * Shares the {@link useDataTableVirtualizer} windowing engine with
 * {@link DataTableVirtualizedBody} and the {@link useDataTableInfiniteLoader} loading
 * engine with the card layout's infinite-scroll body, contributing only the `<tbody>`
 * scaffold. Rows whose {@link DataTableInfiniteScrollOptions#rowLoadingStatus} is not
 * `"loaded"` render via the consumer's placeholder callback.
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

	useDataTableInfiniteLoader({
		rowCount,
		rowLoadingStatus,
		loadData,
		threshold,
		minimumBatchSize,
		firstVisible: virtualItems[0]?.index ?? 0,
		lastVisible: virtualItems[virtualItems.length - 1]?.index ?? 0
	});

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
