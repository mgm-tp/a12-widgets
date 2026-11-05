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

import { DataRoles } from "../../common/main/data-roles.js";

import { useDataTableContext } from "./data-table.context.js";

export interface DataTableWindowedTbodyProps {
	setBodyRef: RefCallback<HTMLTableSectionElement>;

	/**
	 * Number of leaf columns — the `colSpan` for the top/bottom spacer rows. Must
	 * equal the real column count: under `table-layout: fixed` a spacer cell whose
	 * `colSpan` exceeds the `<colgroup>` length makes the table allocate phantom
	 * columns, collapsing every real column to ~0 px.
	 */
	colSpan: number;
	topSpacerHeight: number;
	bottomSpacerHeight: number;

	/** The window of rendered rows, flowing between the two spacer rows. */
	children: ReactNode;
}

/**
 * Shared `<tbody>` scaffold for the windowed (virtualized / infinite-scroll) body
 * implementations: the rendered window of rows flows normally between a top and
 * bottom spacer `<tr>` whose heights reserve the off-screen rows.
 *
 * @internal
 */
export function DataTableWindowedTbody(props: DataTableWindowedTbodyProps): ReactElement {
	const { setBodyRef, colSpan, topSpacerHeight, bottomSpacerHeight, children } = props;
	const ensureRowTabStop = useDataTableContext().ensureRowTabStop;
	// (tree)grid mode overrides the table role, dropping the native `<tbody>` rowgroup
	// mapping, so restate it — same as the plain-body tpl. Card view has its own
	// windowed scaffold (`DataTableWindowedCardList`), so this is table-layout only.
	const gridRole = useDataTableContext().gridRole;

	// After every commit of the rendered window: the row carrying the roving
	// `tabIndex=0` may just have scrolled out and unmounted, which would leave the
	// body with no tab stop at all (Tab would skip it entirely).
	useEffect(() => {
		ensureRowTabStop?.();
	});

	return (
		<tbody
			ref={setBodyRef}
			data-role={DataRoles.Table.Body.VirtualizedContainer}
			role={gridRole ? "rowgroup" : undefined}
		>
			{topSpacerHeight > 0 ? (
				<tr aria-hidden="true">
					<td colSpan={colSpan} style={{ height: topSpacerHeight, padding: 0, border: 0 }} />
				</tr>
			) : null}
			{children}
			{bottomSpacerHeight > 0 ? (
				<tr aria-hidden="true">
					<td colSpan={colSpan} style={{ height: bottomSpacerHeight, padding: 0, border: 0 }} />
				</tr>
			) : null}
		</tbody>
	);
}

DataTableWindowedTbody.displayName = "DataTableWindowedTbody";
