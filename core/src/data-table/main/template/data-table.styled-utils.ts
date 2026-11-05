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

import { addPrefix, getHorizontalSpace } from "../../../common/main/utils.js";
import { breakWord } from "../../../theme/base/mixins/_break-word.js";
import { useDataTableContext } from "../data-table.context.js";
import { pinLeftVar, pinRightVar } from "../data-table.pin-offsets.js";

export const baseClassName = addPrefix("dataTable");

/**
 * Resolve a cell's sticky-pinning bits: the inline style feeding the shared
 * `--a12-data-table-pin-offset` channel and whether the cell sits on the freeze
 * edge (where the separator shadow is painted).
 *
 * The offset value is *not* computed here — it lives in the per-leaf
 * `--a12-pin-{left,right}-N` custom properties the orchestrator writes on the
 * `<table>` root (see `useLeafPinOffsetCssVars`). This hook only points the cell's
 * `--a12-data-table-pin-offset` at the var for its leaf, so a re-measure updates the
 * offset with zero React re-renders. The `0px` fallback keeps the cell flush at the
 * edge before the first measure (or when the var is momentarily unset).
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
	const leafPinningEdge = useDataTableContext().leafPinningEdge;
	const pinVar = pinning === "left" ? pinLeftVar(leafFrom) : pinning === "right" ? pinRightVar(leafTo) : undefined;
	const isPinnedEdge =
		(pinning === "left" && leafPinningEdge?.left === leafTo) ||
		(pinning === "right" && leafPinningEdge?.right === leafFrom);
	const pinStyle: CSSProperties | undefined = pinVar
		? { ["--a12-data-table-pin-offset" as string]: `var(${pinVar}, 0px)` }
		: undefined;

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
		${
			$pinnedEdge &&
			css`
				box-shadow: ${edgeShadow}${edgeExtraShadow ? `, ${edgeExtraShadow}` : ""};
			`
		}
	`;
};

export const parseBorder = (border: string): { width: string; color: string } => {
	const parts = border.split(/\s+/);

	return { width: parts[0], color: parts.slice(2).join(" ") };
};

/**
 * Custom property carrying a body row's fixed height. Set inline on a `<tr>` — from the table's
 * `rowHeight`, from a `rowStyling` `style.height`, or from a virtualizer's fixed row height — and
 * consumed by a static rule that clamps the row's cells and their content.
 *
 * It exists because `height` on a `<tr>` / `<td>` is only a *minimum* in table layout: without the
 * clamp, one wrapping cell silently makes its row taller than the rest. Routing it through a
 * variable keeps the height per-row (a `rowStyling` height can differ row to row) while the clamp
 * itself stays a single static rule.
 */
export const ROW_HEIGHT_VAR = "--a12-row-height";

/**
 * Custom property carrying a body cell's block (top + bottom) padding, as the `<td>` itself applies
 * it. Set by every rule that declares a cell `padding` — see {@link cellPadding}.
 *
 * The fixed-row-height clamp subtracts it when capping cell content: the cap has to land on the
 * cell's *content box*, not on the row height, or padding-height worth of content would overflow
 * and push the row taller than the fixed height. Reading it from a variable keeps that one static
 * rule correct for every padding variant instead of hard-coding one token into it.
 */
export const CELL_BLOCK_PADDING_VAR = "--a12-cell-block-padding";

/**
 * One value of a `padding` shorthand as a length safe for `calc()`, or `undefined` when it is not a
 * length. A unitless `0` becomes `0px`: `calc()` rejects a bare number, and one invalid term
 * invalidates the whole expression.
 */
const asLength = (value?: string): string | undefined => {
	if (!/^-?[\d.]+[a-z%]*$/i.test(value ?? "")) {
		return undefined;
	}

	return /^-?[\d.]+$/.test(value!) ? `${value}px` : value;
};

/**
 * The block (top + bottom) padding of a CSS `padding` shorthand, as a single length to subtract.
 *
 * Handles the 1-to-4-value forms: with 1 or 2 values top and bottom are the first value, with 3 or
 * 4 they are the first and third. Anything unparseable yields `0px`, which degrades to the previous
 * behaviour (content capped at the full row height) rather than to a broken `calc()`.
 */
export const blockPadding = (padding: string): string => {
	const parts = String(padding ?? "")
		.trim()
		.split(/\s+/)
		.filter(Boolean);

	const top = asLength(parts[0]);

	if (top === undefined) {
		return "0px";
	}

	const bottom = (parts.length >= 3 ? asLength(parts[2]) : undefined) ?? top;

	return `calc(${top} + ${bottom})`;
};

/**
 * The inline-start (left) padding of a CSS `padding` shorthand, as a single length to add. Parsing
 * is `getHorizontalSpace`'s (whitespace collapsed first, since it splits on a single space);
 * anything unparseable yields `0px` rather than a broken `calc()`.
 */
export const inlineStartPadding = (padding: string): string => {
	const normalized = String(padding ?? "")
		.trim()
		.replace(/\s+/g, " ");

	return asLength(getHorizontalSpace("left", normalized)) ?? "0px";
};

/**
 * A cell's `padding` plus what derives from it: {@link CELL_BLOCK_PADDING_VAR}, and for the first
 * column the `firstMarginLeft` inset (the legacy `Table`'s `setFirstCellSpacing`). Every cell
 * padding goes through here; all are flat declarations, so a later call wins on source order.
 *
 * `firstCell` must come from the cell's column index, not `&:first-child`, which a `rowSpan`'d
 * header leaf and the auto-size clone both break.
 */
export const cellPadding = (theme: DefaultTheme, padding: string, firstCell?: boolean): ReturnType<typeof css> => css`
	padding: ${padding};
	${CELL_BLOCK_PADDING_VAR}: ${blockPadding(padding)};
	${
		firstCell &&
		css`
			padding-inline-start: calc(${inlineStartPadding(padding)} + ${theme.components.table.bodyCell.firstMarginLeft});
		`
	}
`;

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
 *
 * `firstCell` means column index 0, not merely the first cell of its row (see {@link cellPadding}),
 * and carries the first-column inset — so that column keeps one left edge across `thead`, `tbody`
 * and `tfoot`. A kind that declares its own padding passes the flag to its own `cellPadding` call.
 */
export const cellBase = (theme: DefaultTheme, firstCell?: boolean): ReturnType<typeof css> => {
	const { table } = theme.components;

	return css`
		display: table-cell;
		vertical-align: middle;
		${cellPadding(theme, table.bodyCell.padding, firstCell)}
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
