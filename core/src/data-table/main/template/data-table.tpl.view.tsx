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
import { css, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";

import { baseClassName } from "./data-table.styled-utils.js";
import { DataTableZIndex } from "./data-table.z-index.js";

export const StyledDataTableViewport = styled.div.withConfig({ displayName: "StyledDataTableViewport-sc-" })<{
	$maxHeight?: number | string;
}>(({ theme, $maxHeight }) => {
	const { table } = theme.components;
	const maxHeightValue = typeof $maxHeight === "number" ? `${$maxHeight}px` : $maxHeight;

	return css`
		position: relative;
		display: block;
		max-height: ${maxHeightValue ?? "100%"};
		overflow-x: auto;
		overflow-y: auto;
		border: ${table.body.border};
		background: ${table.bodyRow.background};
		width: 100%;
		isolation: isolate;
	`;
});

export const StyledDataTable = styled.table.attrs({ className: baseClassName }).withConfig({
	displayName: "StyledDataTable-sc-"
})<{ $highlight?: boolean; $cardView?: boolean; $minWidth?: number }>(({ theme, $highlight, $cardView, $minWidth }) => {
	const { table } = theme.components;

	return css`
		/* \`table-layout: fixed\` makes column widths come solely from the
		 * <colgroup>. \`border-collapse: separate\` (zero spacing) is required so
		 * cell borders survive under \`position: sticky\` during scroll. */
		table-layout: fixed;
		width: 100%;
		/* Per-column pixel floor (sum of every column's \`width × 150\`, see
		 * \`getMinTableWidth\`): the table overflows and the viewport scrolls
		 * horizontally once columns no longer fit, keeping pinned columns sticky.
		 * A computed px value is used, not \`min-width: max-content\` — the latter,
		 * combined with percentage \`<col>\` widths, balloons the table to ~500000px. */
		${$minWidth ? `min-width: ${$minWidth}px;` : ""}
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

		${$highlight &&
		css`
			thead th[data-highlighted="true"],
			thead th[data-column-active="true"] {
				background: ${table.bodyRow.highlightedBG};
			}
		`}

		${$cardView &&
		css`
			&[data-card-view="true"] {
				display: block;
				width: 100%;
				min-width: 0;

				colgroup {
					display: none;
				}

				thead {
					display: none;
				}

				tbody,
				tfoot {
					display: block;
					position: static;
				}

				tbody tr {
					display: block;
					border: none;
					border-radius: ${table.cardView.bodyRow.borderRadius};
					box-shadow: ${table.cardView.bodyRow.boxShadow};
					width: ${table.cardView.bodyRow.width};
					margin: 8px auto;
				}

				tbody td {
					display: block;
					position: static;
					box-shadow: none;
					inset-inline-start: auto;
					inset-inline-end: auto;
					width: 100%;
					min-width: 0;
					/* cellBase sets a fixed \`height\` + \`overflow: hidden\`; as a block
						 * element that clips the stacked label + value, so let the card cell
						 * grow to its content. */
					height: auto;
					overflow: visible;
					border-bottom: none;
					padding-top: 24px;
					font-size: ${table.cardView.bodyCell.fontSize};
					text-align: left;
				}
			}
		`}
	`;
});

export interface DataTableTplProps {
	/**
	 * Per-leaf-column `<col>` width values, in column order. Rendered into a
	 * `<colgroup>`. Each entry is a `<length>`/`<percentage>` (or a
	 * `var(--a12-col-N-width, …)` wrapper when column resize is enabled).
	 */
	colWidths: string[];

	/**
	 * Minimum table width in pixels (sum of every column's pixel floor,
	 * `width × 150`). Applied as `min-width` so the table overflows and the
	 * viewport scrolls horizontally once columns no longer fit. See `getMinTableWidth`.
	 */
	minWidth?: number;

	/**
	 * Toggles the card-view layout (drives `data-card-view` plus the
	 * `$cardView` styled flag).
	 */
	cardView?: boolean;

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
	 * Explicit ARIA `role` for the `<table>`. `"list"` for card view,
	 * `"grid"` / `"treegrid"` when `gridRole` is set, otherwise `undefined` so the
	 * native `<table>` exposes its implicit `table` role.
	 */
	role?: "list" | "grid" | "treegrid";

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
 * Carries the ARIA region role and card-view / virtualization / cross-tabulation flags.
 *
 * @experimental
 */
export function DataTableTpl({
	colWidths,
	minWidth,
	cardView,
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
			role="region"
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledby}
		>
			<StyledDataTable
				{...domProps}
				ref={tableRef}
				className={className}
				style={style}
				$highlight={highlight}
				$cardView={cardView}
				$minWidth={minWidth}
				data-role={DataRoles.Table}
				data-card-view={cardView ? "true" : undefined}
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
