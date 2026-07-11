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

import type { CSSProperties, ReactElement, ReactNode } from "react";
import { css, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";

import { useDataTableContext } from "../data-table.context.js";

/**
 * Placeholder body row rendered while infinite-scroll data is loading.
 * Uses a subtle gradient to communicate "loading".
 */
export const StyledDataTablePlaceholderRow = styled.tr.withConfig({ displayName: "StyledDataTablePlaceholderRow-sc-" })(
	({ theme }) => {
		const { table } = theme.components;

		return css`
			background: linear-gradient(
				90deg,
				${table.bodyRow.background} 0%,
				${table.header.background} 50%,
				${table.bodyRow.background} 100%
			);
			background-size: 200% 100%;
			animation: a12DataTableShimmer 1.4s ease-in-out infinite;
			border-bottom: ${table.bodyRow.borderBottom};
			pointer-events: none;

			@keyframes a12DataTableShimmer {
				0% {
					background-position: 100% 0;
				}
				100% {
					background-position: -100% 0;
				}
			}

			@media (prefers-reduced-motion: reduce) {
				animation: none;
				background: ${table.header.background};
			}
		`;
	}
);

/**
 * Props accepted by {@link DataTablePlaceholderRowTpl}.
 */
export interface DataTablePlaceholderRowTplProps {
	/** Inline style overrides for the loading-variant `<tr>`. */
	virtualStyle?: CSSProperties;

	/** 1-based `aria-rowindex`. */
	ariaRowIndex?: number;

	/**
	 * Number of leaf columns to span. Its presence selects the empty-state
	 * variant (`<tr>` with a single `<td colSpan>` around `children`); when
	 * omitted, the shimmering loading variant renders `children` directly.
	 */
	columnCount?: number;

	/**
	 * Row content — the empty-state label (spanning-`<td>` variant) or the
	 * per-column placeholder cells (loading variant).
	 */
	children?: ReactNode;
}

/**
 * DataTable placeholder `<tr>`, in two variants:
 *
 * - Loading slot (`columnCount` omitted) — a shimmering `<tr>` with
 *   `aria-busy="true"` whose `children` are the per-column placeholder cells.
 * - Empty-state row (`columnCount` set) — a `<tr>` with one `<td colSpan>`
 *   containing the label.
 *
 * @experimental
 */
export function DataTablePlaceholderRowTpl({
	virtualStyle,
	ariaRowIndex,
	columnCount,
	children
}: DataTablePlaceholderRowTplProps): ReactElement {
	// (tree)grid mode overrides the table role, dropping the native row/cell
	// mappings, so restate them on the placeholder row and its cell.
	const gridRole = useDataTableContext((ctx) => ctx.gridRole);

	if (columnCount === undefined) {
		return (
			<StyledDataTablePlaceholderRow
				data-role={DataRoles.Table.Body.Content.Placeholder}
				role={gridRole ? "row" : undefined}
				style={virtualStyle}
				aria-rowindex={ariaRowIndex}
				aria-busy="true"
			>
				{children}
			</StyledDataTablePlaceholderRow>
		);
	}

	return (
		<tr data-role={DataRoles.Table.Body.Row} role={gridRole ? "row" : undefined} aria-rowindex={ariaRowIndex}>
			<td
				colSpan={columnCount}
				role={gridRole ? "gridcell" : undefined}
				data-role={DataRoles.Table.Body.Content.Placeholder}
				style={{ padding: "1rem", textAlign: "center" }}
			>
				{children}
			</td>
		</tr>
	);
}

DataTablePlaceholderRowTpl.displayName = "DataTablePlaceholderRowTpl";
