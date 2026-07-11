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
 * Stacking ladder for the data-table.
 *
 * The table is a single element sharing one horizontal scroll container, so
 * pinned cells must explicitly stack above the scrolling cells they would
 * otherwise paint behind in DOM order.
 *
 * The viewport applies `isolation: isolate` so this ladder is sealed inside the
 * table and cannot interact with z-indices in surrounding portals, popovers or
 * sticky ancestors.
 */
export const DataTableZIndex = {
	/** Decorative badge inside the first body cell of a row. */
	bodyRowBadge: 1,

	/**
	 * Sticky body / footer / vertical-header / placeholder pinned cells —
	 * paint above scrolling body cells during horizontal scroll.
	 */
	pinnedBodyCell: 2,

	/**
	 * Sticky `<thead>` / `<tfoot>` containers (above body rows during vertical
	 * scroll) and DnD drop-indicator / drag-preview overlays (above pinned
	 * body cells, below the pinned head).
	 */
	stickyHeadFootAndDnd: 3,

	/**
	 * Pinned header / filter-header cells — paint above the sticky `<thead>`
	 * stacking context so the sticky head still wins over scrolling head cells
	 * during horizontal scroll.
	 */
	pinnedHeadCell: 4,

	/** Column resize handle on a head cell — always topmost. */
	resizeHandle: 5
} as const;
