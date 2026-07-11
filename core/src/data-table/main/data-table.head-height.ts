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

import type { RefObject } from "react";
import { useEffect } from "react";

import { DataRoles } from "../../common/main/data-roles.js";

export interface UseFilterRowHeadHeightParams {
	tableRef: RefObject<HTMLTableElement | null>;
	hasFilterRowRenderer: boolean;
	headerDepth: number;
}

/**
 * Publishes the header height *above* the filter row as the
 * `--a12-data-table-head-height` CSS custom property, so the sticky filter row can
 * offset itself to sit directly beneath the column headers. Tracks header
 * resizing via a `ResizeObserver` on the `<thead>`.
 *
 * No-op when there is no filter row to position.
 */
export function useFilterRowHeadHeight(params: UseFilterRowHeadHeightParams): void {
	const { tableRef, hasFilterRowRenderer, headerDepth } = params;

	useEffect(() => {
		const tableEl = tableRef.current;

		if (!hasFilterRowRenderer || !tableEl) {
			return;
		}

		const theadEl = tableEl.querySelector<HTMLTableSectionElement>("thead");

		if (!theadEl) {
			return;
		}

		const updateHeadHeight = (): void => {
			const filterCell = theadEl.querySelector<HTMLTableCellElement>(`[data-role="${DataRoles.Table.Filter.Cell}"]`);
			const filterCellHeight = filterCell?.getBoundingClientRect().height ?? 0;
			const headHeight = theadEl.getBoundingClientRect().height;
			const offset = Math.max(0, headHeight - filterCellHeight);
			tableEl.style.setProperty("--a12-data-table-head-height", `${offset}px`);
		};

		updateHeadHeight();
		const observer = new ResizeObserver(updateHeadHeight);
		observer.observe(theadEl);

		return (): void => observer.disconnect();
	}, [tableRef, hasFilterRowRenderer, headerDepth]);
}
