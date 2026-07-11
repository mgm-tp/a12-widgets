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

import type { CSSProperties, FocusEventHandler, ReactElement, ReactNode, ThHTMLAttributes } from "react";
import { css, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";

import { useDataTableContext } from "../data-table.context.js";

import type { DataTableBodyCellTplStyles } from "./data-table.body-cell.tpl.view.js";
import { cellBase, pinnedCell, StyledCellContent, StyledCellLabel, useCellPinning } from "./data-table.styled-utils.js";
import { DataTableZIndex } from "./data-table.z-index.js";

/**
 * Body cell rendered as `<th scope="row">` for columns with `verticalHeader: true`
 * (cross-tabulation mode). Uses header-like background and font-weight to visually
 * distinguish row headers from data cells, while remaining in the body grid flow.
 */
export const StyledDataTableVerticalHeaderCell = styled.th.withConfig({
	displayName: "StyledDataTableVerticalHeaderCell-sc-"
})<{
	$pinned?: "left" | "right";
	$pinnedEdge?: boolean;
	$horizontalAlignment?: "left" | "center" | "right";
	$verticalAlignment?: "top" | "middle" | "bottom";
}>(({ theme, $pinned, $pinnedEdge, $horizontalAlignment, $verticalAlignment }) => {
	const { table } = theme.components;

	return css`
		${cellBase(theme)}
		background: ${table.header.background};
		color: ${table.headCell.color};
		font-weight: ${table.headCell.fontWeight};
		text-align: ${$horizontalAlignment ?? "left"};
		vertical-align: ${$verticalAlignment === "top" ? "top" : $verticalAlignment === "bottom" ? "bottom" : "middle"};

		${pinnedCell(theme, { $pinned, $pinnedEdge, zIndex: DataTableZIndex.pinnedBodyCell })}
	`;
});

export interface DataTableVerticalHeaderCellTplProps {
	/** Zero-based column index, used to resolve pin offsets and pinning edges. */
	columnIndex: number;

	/** Pinning side for the column (sticky positioning + shadow). */
	pinning?: "left" | "right";

	/** Native `colSpan` — leaf columns this cell merges over (`undefined` → 1). */
	colSpan?: number;

	/** Horizontal text alignment. */
	horizontalAlignment?: "left" | "center" | "right";

	/** Vertical text alignment. */
	verticalAlignment?: "top" | "middle" | "bottom";

	/**
	 * `tabIndex` value (`0` for the focused cell, `-1` for siblings, `undefined`
	 * when grid arrow nav is inactive).
	 */
	tabIndex?: number;

	/** Focus handler, forwarded to the `<th>`. */
	onFocus?: FocusEventHandler<HTMLTableCellElement>;

	/** Column label shown inline above the cell content in card view. */
	cellLabel?: ReactNode;

	/**
	 * Resolved cell-styling result: optional `className`, `style` and
	 * `secondaryCellTitle` (rendered via {@link HiddenText}).
	 */
	cellStyles?: DataTableBodyCellTplStyles;

	/** Sanitized consumer-provided `htmlAttributes` from `column.htmlAttributes`. */
	htmlAttributes?: ThHTMLAttributes<HTMLTableCellElement>;

	/** Cell content. */
	children?: ReactNode;
}

/**
 * DataTable vertical-header `<th scope="row">` for cross-tabulation columns
 * (`verticalHeader: true`). Owns alignment, pinning, the `tabIndex` / `onFocus`
 * slot for arrow-key navigation, and the optional secondary-cell-title
 * {@link HiddenText} suffix.
 *
 * @experimental
 */
export function DataTableVerticalHeaderCellTpl({
	columnIndex,
	pinning,
	colSpan,
	horizontalAlignment,
	verticalAlignment,
	tabIndex,
	onFocus,
	cellLabel,
	cellStyles,
	htmlAttributes,
	children
}: DataTableVerticalHeaderCellTplProps): ReactElement {
	// Neutralized to `presentation` in card view; the default table view relies
	// on the native `<th scope="row">`'s implicit `rowheader` role.
	const cardView = useDataTableContext((ctx) => ctx.cardView);
	const { pinStyle, isPinnedEdge } = useCellPinning(
		pinning,
		columnIndex,
		colSpan && colSpan > 1 ? columnIndex + colSpan - 1 : columnIndex
	);
	const resolvedStyle: CSSProperties | undefined = pinStyle ? { ...pinStyle, ...cellStyles?.style } : cellStyles?.style;

	return (
		<StyledDataTableVerticalHeaderCell
			{...htmlAttributes}
			scope="row"
			role={cardView ? "presentation" : undefined}
			data-role={DataRoles.Table.Body.Cell}
			colSpan={colSpan}
			data-pinned={pinning}
			data-pinned-edge={isPinnedEdge ? pinning : undefined}
			className={cellStyles?.className}
			style={resolvedStyle}
			$pinned={pinning}
			$pinnedEdge={isPinnedEdge}
			$horizontalAlignment={horizontalAlignment}
			$verticalAlignment={verticalAlignment}
			tabIndex={tabIndex}
			onFocus={onFocus}
		>
			{cardView && cellLabel ? (
				<StyledCellLabel data-role={DataRoles.Table.Body.Cell.CardLabel}>
					{cellLabel}
					<HiddenText>, </HiddenText>
				</StyledCellLabel>
			) : null}
			<StyledCellContent $horizontalAlignment={horizontalAlignment} $verticalAlignment={verticalAlignment}>
				{children}
				{cellStyles?.secondaryCellTitle ? <HiddenText>{cellStyles.secondaryCellTitle}</HiddenText> : null}
			</StyledCellContent>
		</StyledDataTableVerticalHeaderCell>
	);
}

DataTableVerticalHeaderCellTpl.displayName = "DataTableVerticalHeaderCellTpl";
