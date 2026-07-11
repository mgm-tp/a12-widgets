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

import { StyledButton } from "../../../button/main/button.styled.js";

/**
 * Wrapper for the tree column's cell content: indents the row by depth, reserves a fixed-width slot
 * for the expand/collapse control (so leaf labels align with their expandable siblings) and lays the
 * label out beside it.
 *
 * @internal
 */
export const StyledTreeCell = styled.span.withConfig({ displayName: "StyledDataTreeCell-sc-" })<{ $indent: number }>`
	display: flex;
	align-items: center;
	width: 100%;
	min-width: 0;
	padding-inline-start: ${({ $indent }) => $indent}px;
`;

/**
 * Fixed-width slot holding the chevron (or, for a leaf, empty space). Centres the control so labels
 * line up regardless of whether a row is expandable.
 *
 * @internal
 */
export const StyledTreeToggle = styled.span.withConfig({ displayName: "StyledDataTreeToggle-sc-" })<{ $size: number }>`
	display: inline-flex;
	flex: 0 0 ${({ $size }) => $size}px;
	width: ${({ $size }) => $size}px;
	align-items: center;
	justify-content: center;

	${StyledButton}[data-type="icon"] {
		margin: 0;
	}
`;

/**
 * Leading icon slot, sitting between the expand/collapse control and the label. Shrinks to its content
 * and centres the icon so it lines up with the chevron and the cell text.
 *
 * @internal
 */
export const StyledTreeIcon = styled.span.withConfig({ displayName: "StyledDataTreeIcon-sc-" })`
	display: inline-flex;
	flex: 0 0 auto;
	align-items: center;
	justify-content: center;
	margin-inline-end: ${({ theme }) => theme.spacing.horizontalSpacing.horizWhiteSpacingsm}px;
`;

/**
 * The label/content area of the tree cell. `min-width: 0` lets the consumer's own cell content
 * truncate or wrap as it sees fit inside the flex row.
 *
 * @internal
 */
export const StyledTreeLabel = styled.span.withConfig({ displayName: "StyledDataTreeLabel-sc-" })`
	flex: 1 1 auto;
	min-width: 0;
`;

/**
 * The synthetic "load more" row trailing a paginated parent's loaded children. An optional leading
 * spacer cell aligns the affordance to the tree column, then a single `<td colSpan>` spans the tree
 * column to the end of the row so the affordance is free-form; styling matches a body row.
 *
 * @internal
 */
export const StyledTreeLoadMoreRow = styled.tr.withConfig({ displayName: "StyledDataTreeLoadMoreRow-sc-" })(
	({ theme }) => {
		const { bodyRow } = theme.components.table;

		return css`
			background: ${bodyRow.background};
			outline: none;

			// No vertical cell padding: the row height comes from the content box's min-height with the
			// affordance centred, matching TreeView's load-more node (which has only a left indent). The
			// horizontal indent lives on the cell's padding-inline-start.
			> td {
				padding-block: 0;
				border-bottom: ${bodyRow.borderBottom};
			}
		`;
	}
);

/**
 * The spanning cell of {@link StyledTreeLoadMoreRow}. Carries the same horizontal padding as a real
 * body cell (`table.bodyCell.padding`) so the affordance starts from the same baseline as the data
 * cells; the depth indent that lines it up with the children it trails lives on the inner content box
 * ({@link StyledTreeLoadMoreContent}), mirroring how the tree cell's indent stacks on top of the cell
 * padding. The row zeroes the vertical padding.
 *
 * @internal
 */
export const StyledTreeLoadMoreCell = styled.td.withConfig({ displayName: "StyledDataTreeLoadMoreCell-sc-" })(
	({ theme }) => css`
		vertical-align: middle;
		padding: ${theme.components.table.bodyCell.padding};
	`
);

/**
 * The optional leading spacer cell of {@link StyledTreeLoadMoreRow}, spanning the leaf columns before
 * the tree column. It carries no content or padding — it exists only to occupy those columns' width so
 * the adjacent content cell starts at the tree column's left edge. The row supplies its border-bottom.
 *
 * @internal
 */
export const StyledTreeLoadMoreSpacerCell = styled.td.withConfig({
	displayName: "StyledDataTreeLoadMoreSpacerCell-sc-"
})`
	padding: 0;
`;

/**
 * Inner content box of the load-more cell, mirroring TreeView's `StyledTreeNodeContent`. Two jobs that
 * keep the load-more row behaving like its sibling data rows while a page loads:
 *
 * - `position: relative` anchors the loading `ProgressIndicator`'s absolutely-positioned overlay to this
 *   box. Without a positioned ancestor the overlay escapes to the scroll viewport and the spinner renders
 *   centred in the whole table instead of the row.
 * - `min-height` drives the row height (the cell carries no vertical padding) and reserves height for the
 *   out-of-flow progress indicator, so the row keeps the same height when the links give way to the
 *   spinner instead of collapsing — the visible "row swap" otherwise seen mid-load. The affordance is
 *   centred within it, matching TreeView's load-more node.
 *
 * @internal
 */
export const StyledTreeLoadMoreContent = styled.div.withConfig({ displayName: "StyledDataTreeLoadMoreContent-sc-" })<{
	$indent: number;
}>`
	position: relative;
	display: flex;
	align-items: center;
	min-height: ${({ theme }) => theme.components.table.bodyCell.minHeight};
	padding-inline-start: ${({ $indent }) => $indent}px;
`;
