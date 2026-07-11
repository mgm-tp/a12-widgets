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

import type { HTMLAttributes, ReactElement } from "react";
import { css, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";

import { DataTableZIndex } from "./data-table.z-index.js";

/**
 * Resize handle bar — straddles the right edge of its host header cell.
 * Absolutely positioned against the cell's right edge (the cell is its
 * containing block), so the bar lines up with the column boundary.
 */
export const StyledDataTableResizeHandle = styled.div.withConfig({ displayName: "StyledDataTableResizeHandle-sc-" })(
	({ theme }) => {
		const { table } = theme.components;

		return css`
			position: absolute;
			top: 0;
			right: 0;
			width: 6px;
			height: 100%;
			cursor: col-resize;
			pointer-events: auto;
			z-index: ${DataTableZIndex.resizeHandle};
			user-select: none;
			touch-action: none;
			transform: translateX(50%);

			&::after {
				content: "";
				position: absolute;
				top: 0;
				/* The translated handle is centered on the column boundary, so its
				 * 50% line IS the boundary. Anchoring the bar's right edge there makes
				 * it sit flush at [boundary-2px, boundary], aligned with the pinned
				 * inset separator and the group dividers — not straddling the boundary
				 * 1px to the right (which misaligned the pinned line between header and body). */
				right: 50%;
				width: 2px;
				height: 100%;
				background: ${table.headCellGroup?.borderColor ?? "transparent"};
				border-radius: 1px;
				transition: background 0.15s;
			}

			&:hover::after,
			&:focus-visible::after {
				background: ${table.resizeHandler?.background ?? table.headCell.sortable.activeColor};
			}

			&:focus-visible {
				outline: 2px solid ${table.headCell.sortable.focusBorder ? table.headCell.sortable.activeColor : "currentColor"};
				outline-offset: -2px;
			}
		`;
	}
);

export interface DataTableResizeHandleTplProps {
	/**
	 * DOM-level pointer / keyboard / role props from the `useColumnResize` hook,
	 * spread directly onto the handle (`onPointerDown`, `onKeyDown`, `tabIndex`,
	 * `role`, `aria-label`, `aria-orientation`).
	 */
	handleProps?: HTMLAttributes<HTMLDivElement>;
}

/**
 * DataTable column resize handle (`<div>`). Pointer/keyboard wiring is supplied
 * via `handleProps`. Rendered inside its host header cell (its containing block).
 *
 * @experimental
 */
export function DataTableResizeHandleTpl({ handleProps }: DataTableResizeHandleTplProps): ReactElement {
	return (
		<StyledDataTableResizeHandle
			data-role={DataRoles.Table.Column.ResizeHandler}
			aria-orientation="vertical"
			{...handleProps}
		/>
	);
}

DataTableResizeHandleTpl.displayName = "DataTableResizeHandleTpl";
