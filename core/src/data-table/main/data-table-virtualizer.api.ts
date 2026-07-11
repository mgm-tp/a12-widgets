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

/**
 * Alignment of the target row/offset within the viewport after a programmatic scroll.
 * `"auto"` scrolls the minimal distance to bring the target into view.
 */
export type DataTableVirtualizerScrollAlign = "auto" | "start" | "center" | "end";

/**
 * Options for {@link DataTableVirtualizerHandle} scroll methods.
 */
export interface DataTableVirtualizerScrollToOptions {
	/**
	 * Where the target ends up within the viewport.
	 *
	 * @default "auto"
	 */
	align?: DataTableVirtualizerScrollAlign;

	/**
	 * Native scroll behavior. `"smooth"` is supported only with a fixed
	 * `rowHeight` — smooth-scrolling while rows are still being measured cannot
	 * land precisely.
	 *
	 * @default "auto"
	 */
	behavior?: ScrollBehavior;
}

/**
 * Imperative handle for a virtualized (or infinite-scroll) DataTable body,
 * obtained via `virtualScrollOptions.virtualizerRef` /
 * `infiniteScrollOptions.virtualizerRef`.
 */
export interface DataTableVirtualizerHandle {
	/** Scrolls the viewport so the row at `index` is visible. */
	scrollToIndex(index: number, options?: DataTableVirtualizerScrollToOptions): void;

	/** Scrolls the viewport to an absolute pixel offset. */
	scrollToOffset(offsetPx: number, options?: DataTableVirtualizerScrollToOptions): void;

	/** Drops all cached row measurements and re-measures the rendered rows. */
	measure(): void;

	/** Total height of all rows in CSS pixels (measured where available, estimated otherwise). */
	getTotalSize(): number;

	/** Indices of the currently rendered rows (visible window + overscan). */
	getVirtualIndexes(): number[];
}
