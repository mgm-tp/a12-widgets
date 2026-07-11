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

import type { FocusEvent, ReactElement } from "react";
import { useCallback, useRef } from "react";

import { DataRoles } from "../../../../common/index.js";

import { useRowScrollManager } from "../table.tpl.utils.js";

import { StyledTableHeadGrid, StyledTableHeadGridRow } from "./table.head-grid.tpl.styled.js";
import type { HeadGridRowTplProps, HeadGridTplProps } from "./table.head-grid.api.js";

export function HeadGridTpl(props: HeadGridTplProps): ReactElement {
	const { children, columnWidths, totalRows, className, style } = props;
	const gridRef = useRef<HTMLDivElement>(null);

	useRowScrollManager(gridRef);

	const handleScrollFocusedCellIntoView = useCallback((event: FocusEvent<HTMLDivElement>) => {
		const grid = gridRef.current;

		if (!grid) {
			return;
		}

		const target = event.target as HTMLElement;

		if (!target.closest(`[data-role="${DataRoles.Table.Header.Row.SegmentScroll}"]`)) {
			return;
		}

		const cellRect = target.getBoundingClientRect();
		const gridRect = grid.getBoundingClientRect();
		const leftWidth =
			grid.querySelector(`[data-role="${DataRoles.Table.Header.Row.SegmentLeft}"]`)?.getBoundingClientRect().width ?? 0;
		const rightWidth =
			grid.querySelector(`[data-role="${DataRoles.Table.Header.Row.SegmentRight}"]`)?.getBoundingClientRect().width ??
			0;

		const overRight = cellRect.right - (gridRect.right - rightWidth);
		const overLeft = gridRect.left + leftWidth - cellRect.left;

		if (overRight > 0) {
			grid.scrollLeft += overRight;
		} else if (overLeft > 0) {
			grid.scrollLeft -= overLeft;
		}
	}, []);

	return (
		<StyledTableHeadGrid
			ref={gridRef}
			className={className}
			style={style}
			role="rowgroup"
			data-role={DataRoles.Table.Row.Group.Header}
			$columnWidths={columnWidths}
			$totalRows={totalRows}
			onFocus={handleScrollFocusedCellIntoView}
		>
			{children}
		</StyledTableHeadGrid>
	);
}

export function HeadGridRowTpl(props: HeadGridRowTplProps): ReactElement {
	const { children, ariaRowIndex } = props;

	return (
		<StyledTableHeadGridRow role="row" aria-rowindex={ariaRowIndex} data-role={DataRoles.Table.Header.Row}>
			{children}
		</StyledTableHeadGridRow>
	);
}
