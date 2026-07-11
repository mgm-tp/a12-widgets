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

import { css, styled } from "styled-components";

import { active, hover } from "../../../theme/base/mixins/_interaction.js";

/**
 * Row-group header row rendered by {@link DataTableRowsGroup}, spanning all columns. Interaction styling
 * (cursor, hover/active backgrounds) lives on the inner {@link StyledGroupHeaderButton}, not the row.
 */
export const StyledGroupHeaderRow = styled.tr.withConfig({ displayName: "StyledDataTableGroupHeaderRow-sc-" })(
	({ theme }) => {
		const { table } = theme.components;

		return css`
			background: ${table.header.background};
			user-select: none;
		`;
	}
);

/**
 * Cell inside a group-header row, spanning all columns via `colSpan`. When the header is interactive
 * (`$hasButton`) the cell padding moves onto the inner {@link StyledGroupHeaderButton} so the button's
 * click/hover surface covers the whole cell.
 */
export const StyledGroupHeaderCell = styled.td.withConfig({ displayName: "StyledDataTableGroupHeaderCell-sc-" })<{
	$hasButton?: boolean;
}>(({ theme, $hasButton }) => {
	const { table } = theme.components;

	return css`
		display: table-cell;
		vertical-align: middle;
		padding: ${$hasButton ? "0" : table.bodyCell.padding};
		font-weight: ${table.headCell.fontWeight};
		font-size: ${table.headCell.fontSize};
		color: ${table.headCell.color};
		border-bottom: ${table.bodyRow.borderBottom};
		height: ${table.bodyCell.minHeight};
		box-sizing: border-box;
	`;
});

/**
 * Toggle button stretching the group-header cell. A real `<button>` so the collapse/expand interaction
 * is keyboard-accessible and `aria-expanded` sits on an interactive element. Visually unstyled: inherits
 * the header typography and carries the cell padding plus the hover/active backgrounds.
 */
export const StyledGroupHeaderButton = styled.button.withConfig({
	displayName: "StyledDataTableGroupHeaderButton-sc-"
})(({ theme }) => {
	const { table } = theme.components;

	return css`
		display: block;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: ${table.bodyCell.padding};
		border: none;
		background: transparent;
		font: inherit;
		font-weight: inherit;
		color: inherit;
		text-align: inherit;
		box-sizing: border-box;
		cursor: pointer;

		${hover(css`
			background: ${table.bodyRow.nonInteractive.hoverBG};
		`)}

		${active(css`
			background: ${table.bodyRow.nonInteractive.activeBG};
		`)}
	`;
});
