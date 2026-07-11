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

import type { CSSProperties } from "react";
import type { DefaultTheme } from "styled-components";
import { css, styled } from "styled-components";

import { addPrefix } from "../../../common/main/utils.js";
import { breakWord } from "../../../theme/base/mixins/_break-word.js";

import { useDataTableContext } from "../data-table.context.js";

export const baseClassName = addPrefix("dataTable");

/**
 * Resolve a cell's sticky-pinning bits from the pin offsets in `DataTableContext`:
 * the inline style carrying the `--a12-data-table-pin-offset` custom property and
 * whether the cell sits on the freeze edge (where the separator shadow is painted).
 *
 * `leafFrom`/`leafTo` are the first/last leaf column the cell covers (`leafTo`
 * defaults to `leafFrom` for single-column cells). Left-pinned cells stick at the
 * offset of their first leaf and are the edge when their last leaf is the pinned
 * region's last column; right-pinned cells mirror this.
 */
export const useCellPinning = (
	pinning: "left" | "right" | undefined,
	leafFrom: number,
	leafTo: number = leafFrom
): { pinStyle: CSSProperties | undefined; isPinnedEdge: boolean } => {
	const leafPinOffsets = useDataTableContext((ctx) => ctx.leafPinOffsets);
	const leafPinningEdge = useDataTableContext((ctx) => ctx.leafPinningEdge);
	const pinOffset =
		pinning === "left"
			? leafPinOffsets?.left[leafFrom]
			: pinning === "right"
				? leafPinOffsets?.right[leafTo]
				: undefined;
	const isPinnedEdge =
		(pinning === "left" && leafPinningEdge?.left === leafTo) ||
		(pinning === "right" && leafPinningEdge?.right === leafFrom);
	const pinStyle: CSSProperties | undefined =
		pinOffset !== undefined ? { ["--a12-data-table-pin-offset" as string]: `${pinOffset}px` } : undefined;

	return { pinStyle, isPinnedEdge };
};

/**
 * Sticky positioning for a pinned cell. Sticks the cell at the offset
 * published through the `--a12-data-table-pin-offset` custom property (see
 * {@link useCellPinning}) and paints the freeze-line separator shadow on the
 * pinned edge. `zIndex` differs between head and body cells (see
 * `DataTableZIndex`); `edgeExtraShadow` lets callers layer an additional
 * shadow behind the separator on the edge cell (e.g. the footer's row shadow).
 */
export const pinnedCell = (
	theme: DefaultTheme,
	params: { $pinned?: "left" | "right"; $pinnedEdge?: boolean; zIndex: number; edgeExtraShadow?: string }
): ReturnType<typeof css> | undefined => {
	const { $pinned, $pinnedEdge, zIndex, edgeExtraShadow } = params;

	if (!$pinned) {
		return undefined;
	}

	const { pinned } = theme.components.table;
	const edgeShadow = $pinned === "left" ? pinned.leftColumn.boxShadow : pinned.rightColumn.boxShadow;

	return css`
		position: sticky;
		${$pinned === "left" ? "inset-inline-start" : "inset-inline-end"}: var(--a12-data-table-pin-offset, 0);
		z-index: ${zIndex};
		${$pinnedEdge &&
		css`
			box-shadow: ${edgeShadow}${edgeExtraShadow ? `, ${edgeExtraShadow}` : ""};
		`}
	`;
};

export const parseBorder = (border: string): { width: string; color: string } => {
	const parts = border.split(/\s+/);

	return { width: parts[0], color: parts.slice(2).join(" ") };
};

/**
 * Compose a body cell's `box-shadow` from the row's interactive state border
 * (drawn as inset top/bottom/edge shadows) plus an optional column-separator
 * shadow for pinned cells.
 *
 * The state border is painted as inset shadows on each cell rather than a border
 * on the row's `::before`, because pinned cells use `position: sticky` with a
 * non-auto z-index that lifts them above the row pseudo (occluding a `::before`
 * border across the pinned region); cell inset shadows travel with the pinned
 * column during scroll. Applying the inset-shadow approach to all cells uniformly
 * also avoids asymmetric bottom borders between pinned and non-pinned cells.
 *
 * Pass `accent` for the selected pinned-left first cell: it replaces the state
 * border's left edge so the selected indicator stays at the row's visible left
 * edge during scroll. `accent.color` overrides the parsed color to tint to the
 * current interactive state.
 */
export const composeCellShadow = (params: {
	stateBorder?: string;
	stateEdge?: "left" | "right";
	accent?: { border: string; color?: string };
	separatorShadow?: string;
}): string => {
	const shadows: string[] = [];

	if (params.stateBorder) {
		const { width, color } = parseBorder(params.stateBorder);
		shadows.push(`inset 0 ${width} 0 0 ${color}`, `inset 0 -${width} 0 0 ${color}`);

		if (params.stateEdge === "right") {
			shadows.push(`inset -${width} 0 0 0 ${color}`);
		}

		if (params.stateEdge === "left" && !params.accent) {
			shadows.push(`inset ${width} 0 0 0 ${color}`);
		}
	}

	if (params.accent) {
		const parsed = parseBorder(params.accent.border);
		const color = params.accent.color ?? parsed.color;
		shadows.push(`inset ${parsed.width} 0 0 0 ${color}`);
	}

	if (params.separatorShadow) {
		shadows.push(params.separatorShadow);
	}

	return shadows.join(", ");
};

/**
 * Outer cell box for the native table layout. The `<td>`/`<th>` must stay
 * `display: table-cell` so it participates in `table-layout: fixed` column sizing;
 * content alignment lives on the inner {@link StyledCellContent} wrapper instead
 * (a flex cell would drop out of table layout).
 */
export const cellBase = (theme: DefaultTheme): ReturnType<typeof css> => {
	const { table } = theme.components;

	return css`
		display: table-cell;
		vertical-align: middle;
		padding: ${table.bodyCell.padding};
		border-bottom: ${table.bodyRow.borderBottom};
		background: ${table.bodyRow.background};
		min-width: 0;
		height: ${table.bodyCell.minHeight};
		box-sizing: border-box;
		font-size: ${table.bodyCell.fontSize};
	`;
};

/** Horizontal/vertical alignment props for {@link StyledCellContent}. */
export interface CellContentAlignProps {
	$horizontalAlignment?: "left" | "center" | "right";
	$verticalAlignment?: "top" | "middle" | "bottom";

	/** Inline gap between content children (e.g. action-column buttons). */
	$gap?: string;
}

const horizontalToJustify = (h: CellContentAlignProps["$horizontalAlignment"]): string =>
	h === "center" ? "center" : h === "right" ? "flex-end" : "flex-start";

const verticalToAlign = (v: CellContentAlignProps["$verticalAlignment"]): string | undefined =>
	v === "top" ? "flex-start" : v === "middle" ? "center" : v === "bottom" ? "flex-end" : undefined;

/**
 * Inner content wrapper carrying the flex layout the cell itself cannot use (it
 * must remain `table-cell`). Owns alignment, word-breaking and the `<p>` margin reset.
 */
export const StyledCellContent = styled.div.withConfig({ displayName: "StyledCellContent-sc-" })<CellContentAlignProps>(
	({ $horizontalAlignment, $verticalAlignment, $gap }) => css`
		/* No \`height: 100%\` here: a percentage height inside a table-cell makes
		 * Chromium stretch the whole <table> to its container's height (ballooning
		 * row heights). Vertical alignment within the cell is handled natively by the
		 * cell's \`vertical-align\`; \`$verticalAlignment\` only aligns the wrapper's own
		 * children on the flex cross axis. */
		display: flex;
		min-width: 0;
		justify-content: ${horizontalToJustify($horizontalAlignment)};
		${$verticalAlignment ? `align-items: ${verticalToAlign($verticalAlignment)};` : ""}
		text-align: ${$horizontalAlignment ?? "left"};
		${$gap ? `gap: ${$gap};` : ""}
		${breakWord}

		// Reset default <p> margins so they don't inflate the cell/row height.
		p {
			&:first-child {
				margin-top: 0;
			}
			&:last-child {
				margin-bottom: 0;
			}
		}
	`
);

/**
 * Per-cell column label shown inline in card view (where the `<thead>` is hidden).
 * Rendered as a real element, not a CSS `::before`, so `ReactNode`/JSX labels
 * display and the label is exposed to assistive technology.
 */
export const StyledCellLabel = styled.div.withConfig({ displayName: "StyledCellLabel-sc-" })(({ theme }) => {
	const { table } = theme.components;

	return css`
		display: block;
		font-size: ${table.cardView.bodyCell.dataTitleFontSize};
		color: ${table.bodyCell.dataColor};
		margin-top: -16px;
		margin-bottom: 4px;
	`;
});
