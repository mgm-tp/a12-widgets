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

export const StyledDataTablePlaceholderCell = styled.td.withConfig({
	displayName: "StyledDataTablePlaceholderCell-sc-"
})<{ $pinned?: "left" | "right"; $pinnedEdge?: boolean }>(({ theme, $pinned, $pinnedEdge }) => {
	return css`
		${cellBase(theme)}
		overflow: hidden;
		position: relative;

		${pinnedCell(theme, { $pinned, $pinnedEdge, zIndex: DataTableZIndex.pinnedBodyCell })}
	`;
});

export interface DataTablePlaceholderCellTplProps {
	columnIndex: number;
	pinning?: "left" | "right";
	children?: ReactNode;
}

/**
 * Placeholder `<td>` for a single column. Mirrors the regular body cell
 * structure but renders placeholder content instead of data.
 *
 * @experimental
 */
export function DataTablePlaceholderCellTpl({
	columnIndex,
	pinning,
	children
}: DataTablePlaceholderCellTplProps): ReactElement {
	const cardView = useDataTableContext((ctx) => ctx.cardView);
	const { pinStyle, isPinnedEdge } = useCellPinning(pinning, columnIndex);

	return (
		<StyledDataTablePlaceholderCell
			data-role={DataRoles.Table.Body.Cell}
			role={cardView ? "presentation" : undefined}
			$pinned={pinning}
			$pinnedEdge={isPinnedEdge}
			style={pinStyle}
		>
			<StyledCellContent $verticalAlignment="middle">{children}</StyledCellContent>
		</StyledDataTablePlaceholderCell>
	);
}

DataTablePlaceholderCellTpl.displayName = "DataTablePlaceholderCellTpl";
