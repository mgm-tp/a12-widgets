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

import type { ReactElement, ReactNode } from "react";
import { css, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";

import { useDataTableContext } from "../data-table.context.js";

import { cellBase, pinnedCell, StyledCellContent, useCellPinning } from "./data-table.styled-utils.js";
import { DataTableZIndex } from "./data-table.z-index.js";

export const StyledDataTableFootCell = styled.td.withConfig({ displayName: "StyledDataTableFootCell-sc-" })<{
	$pinned?: "left" | "right";
	$pinnedEdge?: boolean;
	$verticalAlignment?: "top" | "middle" | "bottom";
	$actionColumn?: boolean;
}>(({ theme, $pinned, $pinnedEdge, $verticalAlignment, $actionColumn }) => {
	const { table } = theme.components;

	return css`
		${cellBase(theme)}
		background: ${table.footRow.highlightBG};
		font-weight: ${table.footCell.fontWeight};
		height: ${table.footCell.minHeight};
		vertical-align: ${$verticalAlignment === "top" ? "top" : $verticalAlignment === "bottom" ? "bottom" : "middle"};
		box-shadow: ${table.footRow.boxShadow};
		border-bottom: 0;
		${$actionColumn &&
		css`
			padding: ${table.actionCell.padding};
		`}

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
	children
}: DataTableFootCellTplProps): ReactElement {
	const cardView = useDataTableContext((ctx) => ctx.cardView);
	const gridRole = useDataTableContext((ctx) => ctx.gridRole);
	const { pinStyle, isPinnedEdge } = useCellPinning(pinning, columnIndex);

	return (
		<StyledDataTableFootCell
			data-role={DataRoles.Table.Footer.Cell}
			role={cardView ? "presentation" : gridRole ? "gridcell" : undefined}
			data-pinned={pinning}
			$pinned={pinning}
			$pinnedEdge={isPinnedEdge}
			$verticalAlignment={verticalAlignment}
			$actionColumn={!!actionColumn}
			style={pinStyle}
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
