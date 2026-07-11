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

import type { CSSProperties, Key, ReactElement, ReactNode, Ref, RefCallback, RefObject } from "react";

import type { TableScrollToNodeHandler } from "./foundation/table-renderer.api.js";
import type { DataTableVirtualizerHandle } from "./data-table-virtualizer.api.js";
import { useDataTableVirtualizer } from "./data-table.use-virtualizer.js";
import { DataTableWindowedTbody } from "./data-table.windowed-tbody.view.js";

export interface DataTableVirtualizedRowSlot {
	index: number;
	key: Key;

	/**
	 * Per-row inline style contributed by the windowed-body implementation.
	 * The default spacer-row design positions rows in normal flow and supplies
	 * no style; a custom `virtualizedBodyRenderer` using absolute positioning
	 * can pass one here.
	 */
	style?: CSSProperties;

	/**
	 * Dynamic-height mode only: attach to the row's root `<tr>` so the virtualizer
	 * can measure the row's rendered height (and observe later resizes).
	 */
	measureRef?: RefCallback<HTMLElement>;
}

export interface DataTableVirtualizedBodyProps {
	rowCount: number;

	/** Fixed row height in CSS pixels. Omit for per-row DOM measurement. */
	rowHeight?: number;

	/** Estimate for not-yet-measured rows in dynamic mode. */
	estimatedRowHeight?: number;
	overscan?: number;
	scrollElementRef: RefObject<HTMLElement | null>;
	rowKeyFor: (rowIndex: number) => Key;
	scrollToNode?: (handler: TableScrollToNodeHandler) => void;
	getRowElement?: (rowIndex: number) => HTMLElement | null;
	virtualizerRef?: Ref<DataTableVirtualizerHandle | null>;
	renderRow: (slot: DataTableVirtualizedRowSlot) => ReactNode;

	/**
	 * Number of leaf columns — the `colSpan` for the top/bottom spacer rows.
	 *
	 * @see DataTableWindowedTbodyProps.colSpan for why this must equal the real column count.
	 */
	colSpan: number;

	/**
	 * Optional extra ref onto the windowed `<tbody>` element. Forwarded to
	 * {@link DataTableWindowedTbody} so {@link DataTreeTable} can register a
	 * root-level drop target in virtualized mode.
	 */
	bodyDropRef?: RefCallback<HTMLTableSectionElement | null>;
}

/**
 * Virtualized `<tbody>` implementation. Renders the visible window of rows
 * between top/bottom spacer rows; see {@link useDataTableVirtualizer}.
 *
 * @internal
 */
export function DataTableVirtualizedBody(props: DataTableVirtualizedBodyProps): ReactElement {
	const {
		rowCount,
		rowHeight,
		estimatedRowHeight,
		overscan,
		scrollElementRef,
		scrollToNode,
		getRowElement,
		virtualizerRef,
		renderRow,
		rowKeyFor,
		colSpan,
		bodyDropRef
	} = props;

	const { setBodyRef, virtualItems, topSpacerHeight, bottomSpacerHeight, measureRowRefFor } = useDataTableVirtualizer({
		rowCount,
		rowHeight,
		estimatedRowHeight,
		overscan,
		scrollElementRef,
		scrollToNode,
		getRowElement,
		getItemKey: rowKeyFor,
		virtualizerRef
	});

	return (
		<DataTableWindowedTbody
			setBodyRef={setBodyRef}
			bodyDropRef={bodyDropRef}
			colSpan={colSpan}
			topSpacerHeight={topSpacerHeight}
			bottomSpacerHeight={bottomSpacerHeight}
		>
			{virtualItems.map((item) =>
				renderRow({
					index: item.index,
					key: rowKeyFor(item.index) ?? item.key,
					measureRef: measureRowRefFor?.(item.index)
				})
			)}
		</DataTableWindowedTbody>
	);
}

DataTableVirtualizedBody.displayName = "DataTableVirtualizedBody";
