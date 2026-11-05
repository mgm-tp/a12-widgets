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
export const StyledDataTableResizeHandle = styled.div.withConfig({ displayName: "StyledDataTableResizeHandle-sc-" })<{
	$isLastLeaf?: boolean;
	$pinned?: boolean;
}>(({ theme, $isLastLeaf, $pinned }) => {
	const { table } = theme.components;

	/* Hosts that must not be overhung: the last leaf (an overhang would poke past the
	 * table and force a permanent horizontal scrollbar) and any pinned cell (a stacking
	 * context, so the next pinned cell would paint over the overhang). Both sit flush at
	 * [boundary - 6px, boundary]. */
	const noOverhang = !!$isLastLeaf || !!$pinned;

	return css`
		position: absolute;
		top: 0;
		/* The host cell paints its column divider as an inset shadow, not a border, so
		 * its padding box — this element's containing block — ends on the true column
		 * boundary and \`right: 0\` needs no compensation. */
		right: 0;
		width: 6px;
		height: 100%;
		cursor: col-resize;
		pointer-events: auto;
		z-index: ${DataTableZIndex.resizeHandle};
		user-select: none;
		touch-action: none;
		/* Centre on the boundary: 3px of grab zone in each column. */
		transform: ${noOverhang ? "none" : "translateX(50%)"};

		&::after {
			content: "";
			position: absolute;
			top: 0;
			/* The translated box is centred on the boundary, so its 50% line IS the
				 * boundary: the bar lands flush at [boundary-2px, boundary]. Untranslated
				 * hosts anchor it at the cell's right edge instead. */
			right: ${noOverhang ? "0" : "50%"};
			width: 2px;
			height: 100%;
			/* Transparent at rest so the bar does not paint over the header cell's
			 * own right-edge divider (that border is the persistent column separator,
			 * consistent across resizable and non-resizable tables). The handle only
			 * reveals an accent bar on hover / keyboard focus as the resize affordance. */
			background: transparent;
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
});

export interface DataTableResizeHandleTplProps {
	/**
	 * DOM-level pointer / keyboard / role props from the `useColumnResize` hook,
	 * spread directly onto the handle (`onPointerDown`, `onKeyDown`, `tabIndex`,
	 * `role`, `aria-label`, `aria-orientation`).
	 */
	handleProps?: HTMLAttributes<HTMLDivElement>;

	/**
	 * Whether this handle belongs to the last leaf column. The last column's right
	 * edge is the table's right edge, so the default boundary-straddling overhang
	 * would poke past the table and trigger a permanent horizontal scrollbar; when
	 * set, the handle stays flush inside the cell instead.
	 */
	isLastLeaf?: boolean;

	/**
	 * Whether the host head cell is pinned. A pinned cell is a stacking context, so the
	 * next pinned cell would paint over a straddling handle; when set, the handle stays
	 * flush inside the cell. Either this or `isLastLeaf` suppresses the overhang.
	 */
	pinned?: boolean;
}

/**
 * DataTable column resize handle (`<div>`). Pointer/keyboard wiring is supplied
 * via `handleProps`. Rendered inside its host header cell (its containing block).
 *
 * @experimental
 */
export function DataTableResizeHandleTpl({
	handleProps,
	isLastLeaf,
	pinned
}: DataTableResizeHandleTplProps): ReactElement {
	return (
		<StyledDataTableResizeHandle
			data-role={DataRoles.Table.Column.ResizeHandler}
			aria-orientation="vertical"
			$isLastLeaf={isLastLeaf}
			$pinned={pinned}
			{...handleProps}
		/>
	);
}

DataTableResizeHandleTpl.displayName = "DataTableResizeHandleTpl";
