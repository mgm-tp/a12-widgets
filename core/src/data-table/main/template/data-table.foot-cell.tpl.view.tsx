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

import type { ReactElement, ReactNode, TdHTMLAttributes } from "react";
import { css, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";
import { useDataTableContext } from "../data-table.context.js";

import { cellBase, cellPadding, pinnedCell, StyledCellContent, useCellPinning } from "./data-table.styled-utils.js";
import { DataTableZIndex } from "./data-table.z-index.js";

export const StyledDataTableFootCell = styled.td.withConfig({ displayName: "StyledDataTableFootCell-sc-" })<{
	$pinned?: "left" | "right";
	$pinnedEdge?: boolean;
	$verticalAlignment?: "top" | "middle" | "bottom";
	$actionColumn?: boolean;

	/** Whether this cell sits in the table's first column, which earns the inset. */
	$firstCell?: boolean;
}>(({ theme, $pinned, $pinnedEdge, $verticalAlignment, $actionColumn, $firstCell }) => {
	const { table } = theme.components;

	return css`
		${cellBase(theme, $firstCell)}
		background: ${table.footRow.highlightBG};
		font-weight: ${table.footCell.fontWeight};
		height: ${table.footCell.minHeight};
		vertical-align: ${$verticalAlignment === "top" ? "top" : $verticalAlignment === "bottom" ? "bottom" : "middle"};
		box-shadow: ${table.footRow.boxShadow};
		border-bottom: 0;
		${$actionColumn && cellPadding(theme, table.actionCell.padding, $firstCell)}

		${pinnedCell(theme, {
			$pinned,
			$pinnedEdge,
			zIndex: DataTableZIndex.pinnedBodyCell,
			edgeExtraShadow: table.footRow.boxShadow
		})}
	`;
});

export interface DataTableFootCellTplProps {
	/** Zero-based column index, used to resolve pin offsets and pinning edges. */
	columnIndex: number;

	/** Pinning side for the column (sticky positioning + shadow). */
	pinning?: "left" | "right";

	/** Horizontal text alignment. */
	horizontalAlignment?: "left" | "center" | "right";

	/** Vertical text alignment. */
	verticalAlignment?: "top" | "middle" | "bottom";

	/** Whether this footer cell belongs to an action column (tighter padding). */
	actionColumn?: boolean;

	/** Sanitized consumer-provided `htmlAttributes` from `column.htmlAttributes`. */
	htmlAttributes?: TdHTMLAttributes<HTMLTableCellElement>;

	/** Footer cell content. */
	children?: ReactNode;
}

/**
 * DataTable table footer `<td>`. Owns pinning + action-column styling.
 *
 * @experimental
 */
export function DataTableFootCellTpl({
	columnIndex,
	pinning,
	horizontalAlignment,
	verticalAlignment,
	actionColumn,
	htmlAttributes,
	children
}: DataTableFootCellTplProps): ReactElement {
	const gridRole = useDataTableContext().gridRole;
	const { pinStyle, isPinnedEdge } = useCellPinning(pinning, columnIndex);
	// Consumer style merges over the pin offsets (same precedence as head/body cells) —
	// a later plain `style={pinStyle}` would silently discard `htmlAttributes.style`.
	const resolvedStyle = pinStyle ? { ...pinStyle, ...htmlAttributes?.style } : htmlAttributes?.style;

	return (
		<StyledDataTableFootCell
			{...htmlAttributes}
			data-role={DataRoles.Table.Footer.Cell}
			role={gridRole ? "gridcell" : undefined}
			data-auto-size-col={actionColumn ? columnIndex : undefined}
			data-pinned={pinning}
			$pinned={pinning}
			$pinnedEdge={isPinnedEdge}
			$verticalAlignment={verticalAlignment}
			$actionColumn={!!actionColumn}
			$firstCell={columnIndex === 0}
			style={resolvedStyle}
		>
			<StyledCellContent
				$horizontalAlignment={horizontalAlignment}
				$verticalAlignment={verticalAlignment}
				$gap={actionColumn ? "4px" : undefined}
			>
				{children}
			</StyledCellContent>
		</StyledDataTableFootCell>
	);
}

DataTableFootCellTpl.displayName = "DataTableFootCellTpl";
