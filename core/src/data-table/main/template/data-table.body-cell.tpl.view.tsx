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

import type {
	CSSProperties,
	FocusEventHandler,
	KeyboardEventHandler,
	MouseEventHandler,
	ReactElement,
	ReactNode,
	TdHTMLAttributes
} from "react";
import { darken } from "polished";
import { css, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { Icon, StyledIconWrapper } from "../../../icon/main/icon.view.js";

import { useDataTableContext } from "../data-table.context.js";

import { cellBase, pinnedCell, StyledCellContent, StyledCellLabel, useCellPinning } from "./data-table.styled-utils.js";
import { DataTableZIndex } from "./data-table.z-index.js";

export const StyledDataTableBodyRowBadgeWrapper = styled.div.withConfig({
	displayName: "StyledDataTableBodyRowBadgeWrapper-sc-"
})(() => {
	return css`
		position: absolute;
		z-index: ${DataTableZIndex.bodyRowBadge};
		left: 0;
		top: 0;

		&:before {
			content: "";
			transform-origin: 0 0;
			border-right: 1px solid transparent;
			position: absolute;
			right: 0;
		}
	`;
});

export const StyledDataTableBodyCell = styled.td.withConfig({ displayName: "StyledDataTableBodyCell-sc-" })<{
	$pinned?: "left" | "right";
	$pinnedEdge?: boolean;
	$horizontalAlignment?: "left" | "center" | "right";
	$verticalAlignment?: "top" | "middle" | "bottom";
	$subInfo?: boolean;
	$actionColumn?: boolean;
	$firstCell?: boolean;
	$rowDisabled?: boolean;
	$rowHighlightVariant?: "success" | "info";
}>(
	({
		theme,
		$pinned,
		$pinnedEdge,
		$verticalAlignment,
		$subInfo,
		$actionColumn,
		$firstCell,
		$rowDisabled,
		$rowHighlightVariant
	}) => {
		const { table } = theme.components;
		const { bodyCell, bodyRow } = table;
		const badgeBackground = $rowDisabled
			? bodyRow.disabled.background
			: $rowHighlightVariant === "info"
				? bodyRow.infoBG
				: $rowHighlightVariant === "success"
					? bodyRow.successBG
					: bodyRow.background;

		return css`
			${cellBase(theme)}
			overflow: hidden;
			position: relative;
			vertical-align: ${$verticalAlignment === "top" ? "top" : $verticalAlignment === "bottom" ? "bottom" : "middle"};
			&:focus-visible {
				outline: none;
			}
			${$subInfo &&
			css`
				background: ${bodyCell.subInfo.background};
				color: ${bodyCell.subInfo.color};
			`}
			${$firstCell &&
			css`
				isolation: isolate;
			`}
			${StyledDataTableBodyRowBadgeWrapper} {
				width: ${bodyRow.badge.width};
				&:before {
					height: ${bodyRow.badge.height};
					transform: ${bodyRow.badge.transform};
				}

				${StyledIconWrapper} {
					font-size: ${bodyRow.badge.fontSize};
					color: ${$subInfo ? darken(bodyRow.subBGRatio, badgeBackground) : badgeBackground};
					position: absolute;
					top: 3px;
					left: 4px;
					-webkit-tap-highlight-color: transparent;
					-webkit-touch-callout: none;
					-webkit-user-select: none;
					-moz-user-select: none;
					-ms-user-select: none;
					user-select: none;
				}
			}

			${$actionColumn &&
			css`
				padding: ${table.actionCell.padding};
				gap: 4px;
				align-items: center;
			`}

			${pinnedCell(theme, { $pinned, $pinnedEdge, zIndex: DataTableZIndex.pinnedBodyCell })}
		`;
	}
);

/**
 * Resolved cell-styling result (subset of {@link CellStyles}) consumed by
 * {@link DataTableBodyCellTpl}.
 */
export interface DataTableBodyCellTplStyles {
	/** Optional class name forwarded to the `<td>`. */
	className?: string;

	/** Optional inline style forwarded to the `<td>`. */
	style?: CSSProperties;

	/**
	 * Screen-reader-only label injected after the cell content via
	 * {@link HiddenText}. Renders nothing when omitted.
	 */
	secondaryCellTitle?: string;
}

export interface DataTableBodyCellTplProps {
	/**
	 * Column index (zero-based). Used to resolve pin offsets and pinning edges.
	 */
	columnIndex: number;

	/**
	 * Pinning side for the column. Drives sticky positioning + shadow.
	 */
	pinning?: "left" | "right";

	/**
	 * Native `colSpan` for the rendered `<td>` — the number of leaf columns this
	 * cell merges over. `undefined` (→ 1) for the common single-column case.
	 */
	colSpan?: number;

	/**
	 * Explicit leaf-column index emitted as `data-col-index`. Set only when the
	 * row contains a span, so the cross-axis highlighting listener can read the
	 * true leaf index instead of the cell's native DOM position (which diverges
	 * once a preceding cell merges).
	 */
	leafIndexAttr?: number;

	/**
	 * Horizontal text alignment.
	 */
	horizontalAlignment?: "left" | "center" | "right";

	/**
	 * Vertical text alignment.
	 */
	verticalAlignment?: "top" | "middle" | "bottom";

	/**
	 * Whether this cell belongs to a sub-info column (alternate background tint).
	 * Also enabled when consumer cell styling sets `useSecondaryColor`.
	 */
	subInfo?: boolean;

	/**
	 * Whether this cell belongs to an action column (tighter padding, inline gap).
	 */
	actionColumn?: boolean;

	/**
	 * Whether this is the first body cell in the row.
	 */
	firstCell?: boolean;

	/**
	 * Whether the parent row is disabled.
	 */
	rowDisabled?: boolean;

	/**
	 * Highlight variant applied by the parent row.
	 */
	rowHighlightVariant?: "success" | "info";

	/**
	 * `tabIndex` value (`0` for the focused cell, `-1` for siblings, `undefined`
	 * when grid arrow nav is inactive).
	 */
	tabIndex?: number;

	/** Focus handler, forwarded to the `<td>`. */
	onFocus?: FocusEventHandler<HTMLTableCellElement>;

	/**
	 * Click handler. Suppressed while a text selection is active (so dragging to
	 * select text does not trigger the cell click).
	 */
	onClick?: MouseEventHandler<HTMLTableCellElement>;

	/**
	 * Context-menu handler forwarded to the `<td>`.
	 */
	onContextMenu?: MouseEventHandler<HTMLTableCellElement>;

	/**
	 * Keydown handler forwarded to the `<td>`.
	 */
	onKeyDown?: KeyboardEventHandler<HTMLTableCellElement>;

	/**
	 * Mouse-over handler forwarded to the `<td>`.
	 */
	onMouseOver?: MouseEventHandler<HTMLTableCellElement>;

	/**
	 * Mouse-leave handler forwarded to the `<td>`.
	 */
	onMouseLeave?: MouseEventHandler<HTMLTableCellElement>;

	/**
	 * The column's label, shown inline above the cell content in card view
	 * (where the `<thead>` is hidden). Supports any `ReactNode`.
	 */
	cellLabel?: ReactNode;

	/**
	 * Resolved cell-styling result for this cell. Provides optional `className`,
	 * `style` and `secondaryCellTitle` (rendered via {@link HiddenText}).
	 */
	cellStyles?: DataTableBodyCellTplStyles;

	/**
	 * Sanitized consumer-provided `htmlAttributes` from `column.htmlAttributes`
	 * (framework-owned keys already stripped by the orchestrator).
	 */
	htmlAttributes?: TdHTMLAttributes<HTMLTableCellElement>;

	/** Cell content. */
	children?: ReactNode;
}

/**
 * DataTable table body `<td>`. Owns alignment, pinning, sub-info / action-column
 * styling, the `tabIndex` / `onFocus` slot for arrow-key navigation, and the
 * optional secondary-cell-title {@link HiddenText} suffix. Content via `children`.
 *
 * @experimental
 */
export function DataTableBodyCellTpl({
	columnIndex,
	pinning,
	colSpan,
	leafIndexAttr,
	horizontalAlignment,
	verticalAlignment,
	subInfo,
	actionColumn,
	firstCell,
	rowDisabled,
	rowHighlightVariant,
	tabIndex,
	onFocus,
	onClick,
	onContextMenu,
	onKeyDown,
	onMouseOver,
	onMouseLeave,
	cellLabel,
	cellStyles,
	htmlAttributes,
	children
}: DataTableBodyCellTplProps): ReactElement {
	// Card view's `role="list"` root suppresses the cell with `presentation`.
	// (tree)grid mode overrides the table role, which drops the native `<td>` cell
	// mapping, so restate it as `role="gridcell"`. Default view uses the implicit role.
	const cardView = useDataTableContext((ctx) => ctx.cardView);
	const gridRole = useDataTableContext((ctx) => ctx.gridRole);
	const cellRole = cardView ? "presentation" : gridRole ? "gridcell" : undefined;
	// Pass the full leaf range so a pinned spanning cell reports the correct
	// freeze edge (the boundary leaf, not the origin).
	const { pinStyle, isPinnedEdge } = useCellPinning(
		pinning,
		columnIndex,
		colSpan && colSpan > 1 ? columnIndex + colSpan - 1 : columnIndex
	);
	const resolvedStyle: CSSProperties | undefined = pinStyle ? { ...pinStyle, ...cellStyles?.style } : cellStyles?.style;
	// The badge only ever renders in the row's first cell — skip the allocation
	// everywhere else.
	const badgeIcon = !firstCell ? null : rowDisabled ? (
		<Icon title="Disable">block</Icon>
	) : rowHighlightVariant === "success" ? (
		<Icon title="Success">check</Icon>
	) : rowHighlightVariant === "info" ? (
		<Icon title="Info">info</Icon>
	) : null;
	const handleOnClick: MouseEventHandler<HTMLTableCellElement> | undefined = onClick
		? (event): void => {
				// js-dom doesn't support window.getSelection yet
				// See https://github.com/jsdom/jsdom/issues/317 for more detail
				// So just simply trigger onClick here in test environment
				if (!window.getSelection) {
					onClick(event);

					return;
				}

				if (!window.getSelection()?.toString()) {
					onClick(event);
				}
			}
		: htmlAttributes?.onClick;

	return (
		<StyledDataTableBodyCell
			{...htmlAttributes}
			data-role={DataRoles.Table.Body.Cell}
			role={cellRole}
			colSpan={colSpan}
			data-col-index={leafIndexAttr}
			data-pinned={pinning}
			data-pinned-edge={isPinnedEdge ? pinning : undefined}
			className={cellStyles?.className}
			style={resolvedStyle}
			$pinned={pinning}
			$pinnedEdge={isPinnedEdge}
			$verticalAlignment={actionColumn ? "middle" : verticalAlignment}
			$subInfo={!!subInfo}
			$actionColumn={!!actionColumn}
			$firstCell={!!firstCell}
			$rowDisabled={!!rowDisabled}
			$rowHighlightVariant={rowHighlightVariant}
			tabIndex={tabIndex}
			onFocus={onFocus}
			onClick={handleOnClick}
			onContextMenu={onContextMenu ?? htmlAttributes?.onContextMenu}
			onKeyDown={onKeyDown ?? htmlAttributes?.onKeyDown}
			onMouseOver={onMouseOver ?? htmlAttributes?.onMouseOver}
			onMouseLeave={onMouseLeave ?? htmlAttributes?.onMouseLeave}
		>
			{badgeIcon ? <StyledDataTableBodyRowBadgeWrapper>{badgeIcon}</StyledDataTableBodyRowBadgeWrapper> : null}
			{cardView && cellLabel ? (
				<StyledCellLabel data-role={DataRoles.Table.Body.Cell.CardLabel}>
					{cellLabel}
					<HiddenText>, </HiddenText>
				</StyledCellLabel>
			) : null}
			<StyledCellContent
				$horizontalAlignment={horizontalAlignment}
				$verticalAlignment={actionColumn ? "middle" : verticalAlignment}
				$gap={actionColumn ? "4px" : undefined}
			>
				{children}
				{cellStyles?.secondaryCellTitle ? <HiddenText>{cellStyles.secondaryCellTitle}</HiddenText> : null}
			</StyledCellContent>
		</StyledDataTableBodyCell>
	);
}

DataTableBodyCellTpl.displayName = "DataTableBodyCellTpl";
