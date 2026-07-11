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

import { styled, css } from "styled-components";

export const StyledTableHeadGridCellWrapper = styled.div.withConfig({
	displayName: "StyledTableHeadGridCellWrapper-sc-"
})<{
	$gridRow?: number;
	$gridColumn?: number;
	$gridRowSpan?: number;
	$gridColumnSpan?: number;
	$isHidden?: boolean;
	$isSubColumn?: boolean;
	$isLastInGroup?: boolean;
}>(({ theme, $gridRow, $gridColumn, $gridRowSpan, $gridColumnSpan, $isHidden, $isSubColumn, $isLastInGroup }) => {
	const { headCellGroup } = theme.components.table;

	return css`
		/* Visually hide while keeping in accessibility tree */
		${$isHidden &&
		css`
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip-path: inset(0);
			white-space: nowrap;
			border: 0;
		`}

		/* Enhanced grid layout styles */
		${$gridRow &&
		$gridColumn &&
		$gridRowSpan &&
		$gridColumnSpan &&
		css`
			/* Grid positioning - respects rowspan and colspan */
			grid-row: ${$gridRow} / span ${$gridRowSpan};
			grid-column: ${$gridColumn} / span ${$gridColumnSpan};

			/* Use flex display to allow child to fill the entire grid area */
			display: flex;
			flex-direction: column;
			position: relative;
			min-height: 0; /* Prevent grid blowout */

			/* Ensure the child cell component takes full height and width */
			> * {
				flex: 1;
				display: flex;
				width: 100%;
				height: 100%;
			}

			/* Add top border for sub-column cells */
			${$isSubColumn &&
			css`
				:before {
					border-top: ${headCellGroup.gapForSingle};
					content: "";
					display: block;
					left: 0;
					position: absolute;
					right: 0;
					top: 0;
				}
			`}

			/* Add right border for parent cells and last cells in subcolumn groups */
			${$isLastInGroup &&
			css`
				:after {
					content: "";
					top: 0;
					right: 0;
					bottom: 0;
					position: absolute;
					display: block;
					left: unset;
					border-right: ${headCellGroup.gapForGroup};
				}
			`}
		`}
	`;
});
