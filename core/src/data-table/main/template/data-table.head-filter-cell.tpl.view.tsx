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
import { StyledBaseInput } from "../../../input/base-input-styled/base.styled.js";
import { StyledSelectTemplate } from "../../../input/select/main/select.styled.js";
import { StyledTagGroup } from "../../../tag/main/tag-group.view.js";
import { StyledTagInputFieldWrapper } from "../../../tag-input/main/tag-input.styled.js";
import { StyledTimePickerWrapper } from "../../../time-picker/main/time-picker.styled.js";

import { useDataTableContext } from "../data-table.context.js";

import { cellBase, pinnedCell, useCellPinning } from "./data-table.styled-utils.js";
import { DataTableZIndex } from "./data-table.z-index.js";

export const StyledDataTableHeadFilterCell = styled.th.withConfig({
	displayName: "StyledDataTableHeadFilterCell-sc-"
})<{
	$pinned?: "left" | "right";
	$pinnedEdge?: boolean;
}>(({ theme, $pinned, $pinnedEdge }) => {
	const { table } = theme.components;

	const { headRow } = table;

	return css`
		${cellBase(theme)}
		background: ${table.header.background};
		padding: ${table.headCell.padding};
		height: ${table.headCell.minHeight};
		text-align: left;
		vertical-align: top;
		border-bottom: ${table.headRow.borderBottom};
		font-weight: normal;

		// Spacing between stacked filter field/timepicker wrappers.
		${StyledBaseInput.StyledFieldWrapper}:not(:last-child),
		${StyledTimePickerWrapper}:not(:last-child) {
			margin-bottom: ${headRow.filter.fieldInputMarginBottom};
		}

		// Distinct background for editable filter inputs.
		${StyledBaseInput.StyledFieldInput}:not([data-readonly="true"]):not([data-disabled="true"]),
		${StyledSelectTemplate.StyledSelectInput}:not(:read-only):not(:disabled),
		${StyledSelectTemplate.StyledFieldSelectWrapper}:not([data-readonly="true"]):not([data-disabled="true"]),
		${StyledTagInputFieldWrapper} ${StyledTagGroup} {
			background-color: ${headRow.filter.fieldInputBG};
		}

		// Read-only filter inputs use the dedicated readonly background.
		${StyledBaseInput.StyledFieldInput}:read-only {
			background-color: ${headRow.filter.fieldInputReadonlyBG};
		}

		${pinnedCell(theme, { $pinned, $pinnedEdge, zIndex: DataTableZIndex.pinnedHeadCell })}
	`;
});

export interface DataTableHeadFilterCellTplProps {
	/** Zero-based column index, used to resolve pin offsets and pinning edges. */
	columnIndex: number;

	/** Pinning side for the column (sticky positioning + shadow). */
	pinning?: "left" | "right";

	/**
	 * Filter cell content. When provided, it is wrapped in a `<span>` carrying
	 * `data-role={DataRoles.Table.Filter.Cell.Content}`; when `null`/`undefined`,
	 * no wrapper is emitted.
	 */
	children?: ReactNode;
}

/**
 * DataTable filter `<th>` inside the filter row. Owns pinning, sticky positioning
 * and the optional content wrapper span.
 *
 * @experimental
 */
export function DataTableHeadFilterCellTpl({
	columnIndex,
	pinning,
	children
}: DataTableHeadFilterCellTplProps): ReactElement {
	const { pinStyle, isPinnedEdge } = useCellPinning(pinning, columnIndex);
	// In (tree)grid mode restate the suppressed native cell role.
	const gridRole = useDataTableContext((ctx) => ctx.gridRole);

	return (
		<StyledDataTableHeadFilterCell
			data-role={DataRoles.Table.Filter.Cell}
			role={gridRole ? "gridcell" : undefined}
			data-pinned={pinning}
			$pinned={pinning}
			$pinnedEdge={isPinnedEdge}
			style={pinStyle}
		>
			{children != null ? (
				<span data-role={DataRoles.Table.Filter.Cell.Content} style={{ display: "contents" }}>
					{children}
				</span>
			) : null}
		</StyledDataTableHeadFilterCell>
	);
}

DataTableHeadFilterCellTpl.displayName = "DataTableHeadFilterCellTpl";
