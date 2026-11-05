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

import type { ReactElement, ReactNode, RefCallback } from "react";
import { useEffect } from "react";

import { DataRoles } from "../../../common/main/data-roles.js";
import { useDataTableContext } from "../data-table.context.js";
import type { DataTableInfiniteScrollBodyProps } from "../data-table.infinite-scroll-body.view.js";
import { useDataTableInfiniteLoader } from "../data-table.use-infinite-loader.js";
import { useDataTableVirtualizer } from "../data-table.use-virtualizer.js";
import type { DataTableVirtualizedBodyProps } from "../data-table.virtualized-body.view.js";

import { StyledDataTableCardList } from "./data-table.card-list.tpl.view.js";

export interface DataTableWindowedCardListProps {
	setListRef: RefCallback<HTMLElement>;
	topSpacerHeight: number;
	bottomSpacerHeight: number;

	/** The window of rendered cards, flowing between the two spacers. */
	children: ReactNode;
}

/**
 * Shared windowing scaffold for the card layout's virtualized / infinite-scroll
 * bodies: the rendered window of cards flows normally between a top and bottom
 * spacer whose heights reserve the off-screen cards.
 *
 * The table layout's equivalent (`DataTableWindowedTbody`) has to size its spacers
 * with a `colSpan` matching the real column count exactly, or `table-layout: fixed`
 * allocates phantom columns and collapses every real one. A card list has no column
 * geometry, so the spacers here are plain sized boxes — and being non-`listitem`
 * children of a `role="list"`, they are hidden from assistive technology.
 *
 * @internal
 */
export function DataTableWindowedCardList(props: DataTableWindowedCardListProps): ReactElement {
	const { setListRef, topSpacerHeight, bottomSpacerHeight, children } = props;
	const ensureRowTabStop = useDataTableContext().ensureRowTabStop;

	// After every commit of the rendered window: the card carrying the roving
	// `tabIndex=0` may just have scrolled out and unmounted, which would leave the
	// list with no tab stop at all (Tab would skip it entirely).
	useEffect(() => {
		ensureRowTabStop?.();
	});

	return (
		<StyledDataTableCardList ref={setListRef} data-role={DataRoles.Table.Body.VirtualizedContainer} role="list">
			{topSpacerHeight > 0 ? <div aria-hidden="true" role="presentation" style={{ height: topSpacerHeight }} /> : null}
			{children}
			{bottomSpacerHeight > 0 ? (
				<div aria-hidden="true" role="presentation" style={{ height: bottomSpacerHeight }} />
			) : null}
		</StyledDataTableCardList>
	);
}

DataTableWindowedCardList.displayName = "DataTableWindowedCardList";

/**
 * Virtualized card-list body — the card layout's `virtualizedBody` slot. Same
 * {@link useDataTableVirtualizer} engine as the table layout's version; only the
 * windowing container differs.
 *
 * Cards size to their stacked content, so dynamic-height virtualization (no
 * `rowHeight`) is the mode that fits: each card is measured as it renders. A fixed
 * `rowHeight` is still honoured for the spacer arithmetic when one is supplied.
 *
 * @internal
 */
export function DataTableVirtualizedCardBody(props: DataTableVirtualizedBodyProps): ReactElement {
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
		rowKeyFor
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
		<DataTableWindowedCardList
			setListRef={setBodyRef}
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
		</DataTableWindowedCardList>
	);
}

DataTableVirtualizedCardBody.displayName = "DataTableVirtualizedCardBody";

/**
 * Infinite-scroll card-list body — the card layout's `infiniteScrollBody` slot.
 * Shares the windowing engine with {@link DataTableVirtualizedCardBody} and the
 * loading engine ({@link useDataTableInfiniteLoader}) with the table layout's
 * infinite-scroll body, contributing only the card-list scaffold.
 *
 * @internal
 */
export function DataTableInfiniteScrollCardBody(props: DataTableInfiniteScrollBodyProps): ReactElement {
	const { options, scrollElementRef, rowKeyFor, scrollToNode, getRowElement, renderRow } = props;
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
		<DataTableWindowedCardList
			setListRef={setBodyRef}
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
		</DataTableWindowedCardList>
	);
}

DataTableInfiniteScrollCardBody.displayName = "DataTableInfiniteScrollCardBody";
