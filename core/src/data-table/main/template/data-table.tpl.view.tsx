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

import type { CSSProperties, FocusEvent, HTMLProps, ReactElement, ReactNode, Ref } from "react";
import type { DefaultTheme } from "styled-components";
import { css, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";

import {
	baseClassName,
	parseBorder,
	StyledCellContent,
	ROW_HEIGHT_VAR,
	CELL_BLOCK_PADDING_VAR
} from "./data-table.styled-utils.js";
import { DataTableZIndex } from "./data-table.z-index.js";

/**
 * Width of the row separator that `cellBase` paints as the body cell's bottom border, taken from
 * the same theme token so a fixed `rowHeight` can discount it. The token is a `border` shorthand
 * (`"1px solid <color>"`), so the width is its first component; anything unparseable (`"none"`,
 * empty) contributes nothing.
 */
const cellBorderWidth = (theme: DefaultTheme): string => {
	const { width } = parseBorder(String(theme.components.table.bodyRow.borderBottom ?? ""));

	return /^[\d.]+[a-z%]*$/i.test(width ?? "") ? width : "0px";
};

export const StyledDataTableViewport = styled.div.withConfig({ displayName: "StyledDataTableViewport-sc-" })<{
	$maxHeight?: number | string;
}>(({ theme, $maxHeight }) => {
	const { table, treeTable } = theme.components;
	const maxHeightValue = typeof $maxHeight === "number" ? `${$maxHeight}px` : $maxHeight;

	return css`
		position: relative;
		display: block;
		height: 100%;
		max-height: ${maxHeightValue ?? "100%"};
		overflow-x: auto;
		overflow-y: auto;
		border: ${table.body.border};
		background: ${table.bodyRow.background};
		width: 100%;
		isolation: isolate;

		/* DataTreeTable root drop zone (drop onto the empty area below the last row), keyed off
		   \`data-drop-target\` set by \`useTreeRootDropZone\`: a 2px frame around the body — from the head's
		   bottom edge (\`--a12-tree-root-zone-top\`, measured by the hook) to the viewport's bottom — like the
		   legacy TreeTable's hidden-root body frame. No wash, so the rows keep their own colours. */
		&[data-drop-target]::after {
			content: "";
			position: absolute;
			top: var(--a12-tree-root-zone-top, 0px);
			right: 0;
			bottom: 0;
			left: 0;
			border: 2px solid ${treeTable.node.droppableBorderColor};
			pointer-events: none;
			z-index: ${DataTableZIndex.stickyHeadFootAndDnd};
		}

		&[data-drop-target="forbidden"]::after {
			border-color: ${treeTable.node.forbiddenBorderColor};
		}
	`;
});

export const StyledDataTable = styled.table.attrs({ className: baseClassName }).withConfig({
	displayName: "StyledDataTable-sc-"
})<{ $highlight?: boolean; $minWidth?: number | string; $rowHeight?: number; $columnCount?: number }>(
	({ theme, $highlight, $minWidth, $rowHeight, $columnCount }) => {
		const { table } = theme.components;

		return css`
			/* Custom properties inherit, so declare each channel invalid here to stop a nested
		 * table sizing a column from the outer table's measurement. The auto-size and
		 * resize hooks write inline, overriding this rule. */
			${Array.from({ length: $columnCount ?? 0 }, (_, index) => `--a12-col-${index}-width: initial;`).join("\n")}
			/* \`table-layout: fixed\` makes column widths come solely from the
		 * <colgroup>. \`border-collapse: separate\` (zero spacing) is required so
		 * cell borders survive under \`position: sticky\` during scroll. */
			table-layout: fixed;
			width: 100%;
			/* Per-column pixel floor (sum of every column's \`width × 150\`, see
		 * \`getMinTableWidthExpression\`): the table overflows and the viewport scrolls
		 * horizontally once columns no longer fit, keeping pinned columns sticky.
		 * A computed length is used, not \`min-width: max-content\` — the latter,
		 * combined with percentage \`<col>\` widths, balloons the table to ~500000px.
		 * An auto-sizing action column contributes a \`var()\` term. */
			${$minWidth ? `min-width: ${typeof $minWidth === "number" ? `${$minWidth}px` : $minWidth};` : ""}
			/* Once a column is resized, the resize hook freezes every column to an
		 * absolute px width. Size the table to \`max-content\` so resizing one column
		 * changes only the total — no leftover space for the browser to redistribute
		 * (which made the others shrink under \`width: 100%\`). \`min-width\` is dropped
		 * so the declared floor cannot re-introduce that redistribution; the frozen px
		 * widths are the floor now. */
			&[data-resized="true"] {
				width: max-content;
				min-width: 0;
			}
			border-collapse: separate;
			border-spacing: 0;
			/* Fixed body row height, driven by the \`${ROW_HEIGHT_VAR}\` custom property that rows
			 * set inline — from the table's \`rowHeight\`, a \`rowStyling\` \`style.height\`, or a
			 * virtualizer's fixed row height. Kept as one static rule rather than generated per
			 * value so the height can differ row to row.
			 *
			 * \`height\` on a \`<tr>\`/\`<td>\` is only a *minimum* in table layout, so pinning it
			 * also requires capping the cell content — otherwise a wrapping cell silently makes
			 * its row taller than the rest, misaligning anything positioned per row and, when
			 * virtualized, desynchronising the virtualizer's spacers from the real layout. */
			${$rowHeight ? `${ROW_HEIGHT_VAR}: ${$rowHeight}px;` : ""}

			/* Two gates for one behaviour: \`data-row-height\` for a table-wide \`rowHeight\` (the
			 * variable is inherited from this element), and the inline-style match for a per-row
			 * height a row sets itself. Both read the same variable, and a row's inline value
			 * naturally overrides the inherited one. Ungated, these would clamp every table. */
			&[data-row-height] > tbody > tr > td,
			& > tbody > tr[style*="${ROW_HEIGHT_VAR}"] > td {
				height: var(${ROW_HEIGHT_VAR});
				box-sizing: border-box;
			}
			&[data-row-height] > tbody > tr > td > *,
			& > tbody > tr[style*="${ROW_HEIGHT_VAR}"] > td > * {
				/* An absolute cap, not \`100%\` — a percentage height on a table-cell child does
				 * not resolve reliably. It has to land on the cell's *content box*, so both the
				 * cell's block padding (\`${CELL_BLOCK_PADDING_VAR}\`, set by whichever rule declared
				 * the padding) and the row separator on its bottom border are subtracted: with
				 * \`box-sizing: border-box\` both already sit inside the fixed height, so capping at
				 * the full row height would let padding-worth of content push the row taller.
				 *
				 * The padding is kept rather than folded into the height on purpose. Zeroing it
				 * only looks right for middle-aligned content; a \`top\`/\`bottom\`-aligned cell —
				 * every Overview Engine column by default — then renders flush against the row
				 * border. */
				max-height: calc(var(${ROW_HEIGHT_VAR}) - var(${CELL_BLOCK_PADDING_VAR}, 0px) - ${cellBorderWidth(theme)});
				overflow: hidden;
			}
			&[data-row-height] > tbody > tr > td > ${StyledCellContent}, & > tbody > tr[style*="${ROW_HEIGHT_VAR}"] > td > ${StyledCellContent} {
				/* The same value as the cap above, but as a *definite* height: a percentage height
				 * on a replaced child (\`<img max-height: 100%>\`, as ResponsiveImageContainer sets)
				 * resolves against its containing block only when that block's height is definite.
				 * Under \`max-height\` alone the wrapper's height stays content-driven, so such an
				 * image keeps its intrinsic size and is clipped by the cap instead of scaling into
				 * the row.
				 *
				 * Not \`height: 100%\` — see {@link StyledCellContent}: a *percentage* height inside
				 * a table cell makes Chromium stretch the whole table. An absolute \`calc()\` off the
				 * row-height variable carries no such hazard. */
				height: calc(var(${ROW_HEIGHT_VAR}) - var(${CELL_BLOCK_PADDING_VAR}, 0px) - ${cellBorderWidth(theme)});
			}
			font-family: ${table.bodyCell.fontFamily};
			font-size: ${table.bodyCell.fontSize};
			color: ${table.color};

			thead {
				position: sticky;
				inset-block-start: 0;
				z-index: ${DataTableZIndex.stickyHeadFootAndDnd};
				/* Single continuous underline for the whole header block. Painted as
			 * an inset box-shadow, not border-bottom: border-collapse: separate
			 * makes the browser ignore borders on row-group elements like <thead>,
			 * whereas box-shadow stays continuous across pinned cells and rowspanned
			 * leaf columns (drawing it on individual head cells breaks under pinned
			 * columns and at resize-handle boundaries). */
				box-shadow: ${table.headRow.boxShadow};
			}

			/* While the first body row is focused, the thead underline would clip the
		 * top edge of that row's focus ring (the row sits flush under the header).
		 * Drop it; the focus ring's own top border becomes the divider. Scoped via
		 * \`data-interactive\` so it only triggers for rows that paint a ring. */
			&:has(tbody > tr[data-interactive]:first-child:focus) thead {
				box-shadow: none;
			}

			tfoot {
				position: sticky;
				inset-block-end: 0;
				z-index: ${DataTableZIndex.stickyHeadFootAndDnd};
			}

			/* cellBase paints a border-bottom on every <td>; drop it on the final body
		 * row so the viewport border is the sole bottom edge. Only on the plain
		 * <tbody> (virtualized/infinite bodies carry a data-role and keep the border)
		 * and only when no <tfoot> follows (:last-child keeps the body/footer divider). */
			tbody:not([data-role]):last-child > tr:last-child > td {
				border-bottom: none;
			}

			${
				$highlight &&
				css`
					thead th[data-highlighted="true"],
					thead th[data-column-active="true"] {
						background: ${table.bodyRow.highlightedBG};
					}
				`
			}
		`;
	}
);

export interface DataTableTplProps {
	/**
	 * Per-leaf-column `<col>` width values, in column order. Rendered into a
	 * `<colgroup>`. Each entry is a `<length>`/`<percentage>` (or a
	 * `var(--a12-col-N-width, …)` wrapper when column resize is enabled).
	 */
	colWidths: string[];

	/**
	 * Minimum table width (sum of every column's pixel floor, `width × 150`). Applied as
	 * `min-width` so the table overflows and the viewport scrolls horizontally once columns
	 * no longer fit. A number means pixels; a string is used verbatim. See
	 * `getMinTableWidthExpression`.
	 */
	minWidth?: number | string;

	/** Fixed body row height in CSS pixels. See `BaseDataTableProps.rowHeight`. */
	rowHeight?: number;

	/**
	 * Enables column-active / cell-highlight styling on `<thead>`.
	 */
	highlight?: boolean;

	/**
	 * Body is rendered by a virtualized backend. Emitted as `data-virtualized`
	 * on the `<table>` — a styling/testing hook only.
	 */
	virtualized?: boolean;

	/**
	 * Marks the table as a cross-tabulation (columns with vertical headers).
	 */
	crossTabulation?: boolean;

	/**
	 * Max-height on the viewport. Defaults to `100%` (fits a bounded parent,
	 * scrolls vertically on overflow); pass a value to cap the height directly.
	 */
	maxHeight?: number | string;

	/**
	 * `aria-rowcount` attribute for the `<table>` element.
	 */
	ariaRowCount?: number;

	/**
	 * `aria-label` applied to both the viewport region and the table.
	 */
	ariaLabel?: string;

	/**
	 * `aria-labelledby` applied to both the viewport region and the table.
	 */
	ariaLabelledby?: string;

	/**
	 * `aria-hidden` for the `<table>` element.
	 */
	ariaHidden?: boolean;

	/**
	 * Additional props spread onto the `<table>`. Framework-owned attributes
	 * (refs, `data-*` flags, aria wiring) win over entries here.
	 */
	domProps?: HTMLProps<HTMLTableElement>;

	/**
	 * Explicit ARIA `role` for the `<table>`. `"grid"` / `"treegrid"` when `gridRole`
	 * is set, otherwise `undefined` so the native `<table>` exposes its implicit
	 * `table` role.
	 */
	role?: "grid" | "treegrid";

	/**
	 * `id` for the viewport element.
	 */
	id?: string;

	/**
	 * `data-role` for the viewport element. Defaults to
	 * {@link DataRoles.Table.Viewport}.
	 */
	dataRole?: string;

	/**
	 * `className` for the `<table>` element.
	 */
	className?: string;

	/**
	 * Inline style for the `<table>` element.
	 */
	style?: CSSProperties;

	/** Forwarded ref to the viewport `<div>` (scroll-element wiring). */
	viewportRef?: Ref<HTMLDivElement>;

	/** Forwarded ref to the underlying `<table>`. */
	tableRef?: Ref<HTMLTableElement>;

	/** `onBlur` forwarded to the `<table>`. */
	onBlur?(event: FocusEvent<HTMLTableElement>): void;

	/**
	 * Head/body/foot content.
	 */
	children?: ReactNode;
}

/**
 * DataTable table root: a scrollable viewport wrapping a native `<table>` laid out
 * with `table-layout: fixed` + a `<colgroup>` (one `<col>` per leaf column).
 * Carries the ARIA region role and the virtualization / cross-tabulation flags.
 *
 * This is the `<table>` layout only. `cardView` renders `DataTableCardsTpl` instead —
 * an entirely separate subtree, not this one restyled — so nothing here has to be
 * neutralized for it.
 *
 * @experimental
 */
export function DataTableTpl({
	colWidths,
	minWidth,
	rowHeight,
	highlight,
	virtualized,
	crossTabulation,
	maxHeight,
	ariaRowCount,
	ariaLabel,
	ariaLabelledby,
	ariaHidden,
	domProps,
	role,
	id,
	dataRole,
	className,
	style,
	viewportRef,
	tableRef,
	onBlur,
	children
}: DataTableTplProps): ReactElement {
	return (
		<StyledDataTableViewport
			ref={viewportRef}
			id={id}
			$maxHeight={maxHeight}
			data-role={dataRole ?? DataRoles.Table.Viewport}
			// Only expose the scroll container as a landmark region when it has an
			// accessible name — an unnamed `role="region"` is a landmark-name violation
			// and adds landmark noise. The name lives on the `<table>` regardless.
			role={ariaLabel || ariaLabelledby ? "region" : undefined}
			aria-label={ariaLabel || ariaLabelledby ? ariaLabel : undefined}
			aria-labelledby={ariaLabel || ariaLabelledby ? ariaLabelledby : undefined}
		>
			<StyledDataTable
				{...domProps}
				ref={tableRef}
				className={className}
				style={style}
				$highlight={highlight}
				$minWidth={minWidth}
				$rowHeight={rowHeight}
				$columnCount={colWidths.length}
				data-row-height={rowHeight === undefined ? undefined : "true"}
				data-role={DataRoles.Table}
				data-cross-tabulation={crossTabulation ? "true" : undefined}
				data-virtualized={virtualized ? "true" : undefined}
				role={role}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledby}
				aria-hidden={ariaHidden}
				aria-rowcount={ariaRowCount}
				onBlur={onBlur}
			>
				<colgroup>
					{colWidths.map((width, index) => (
						<col key={index} style={{ width }} />
					))}
				</colgroup>
				{children}
			</StyledDataTable>
		</StyledDataTableViewport>
	);
}

DataTableTpl.displayName = "DataTableTpl";
