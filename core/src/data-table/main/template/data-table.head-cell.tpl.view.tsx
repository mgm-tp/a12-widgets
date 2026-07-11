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
	KeyboardEventHandler,
	MouseEventHandler,
	ReactElement,
	ReactNode,
	ThHTMLAttributes
} from "react";
import { useContext, useMemo } from "react";
import { css, styled } from "styled-components";

import { StyledButton } from "../../../button/main/button.styled.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { provider } from "../../../common/main/device-detector.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { Icon, StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { darkFocus } from "../../../theme/base/mixins/_interaction.js";

import { useDataTableContext } from "../data-table.context.js";

import { DataTableResizeHandleTpl, StyledDataTableResizeHandle } from "./data-table.resize-handle.tpl.view.js";
import { cellBase, pinnedCell, useCellPinning } from "./data-table.styled-utils.js";
import { DataTableZIndex } from "./data-table.z-index.js";

export const StyledDataTableHeadCell = styled.th.withConfig({ displayName: "StyledDataTableHeadCell-sc-" })<{
	$pinned?: "left" | "right";
	$pinnedEdge?: boolean;
	$horizontalAlignment?: "left" | "center" | "right";
	$verticalAlignment?: "top" | "middle" | "bottom";
	$sortable?: boolean;
	$subInfo?: boolean;
	$isGroup?: boolean;
	$actionColumn?: boolean;
	$hasResizeHandleRight?: boolean;
	$rightDivider?: "group" | "single";
	$touch?: boolean;
}>(
	({
		theme,
		$pinned,
		$pinnedEdge,
		$horizontalAlignment,
		$verticalAlignment,
		$sortable,
		$subInfo,
		$isGroup,
		$actionColumn,
		$hasResizeHandleRight,
		$rightDivider,
		$touch
	}) => {
		const { table } = theme.components;
		const groupAlignment = $horizontalAlignment ?? ($isGroup ? "center" : "left");

		return css`
			${cellBase(theme)}
			position: relative;
			/* Lowest-level stacking context so the hosted resize handle stays
			 * contained and renders BELOW pinned head cells when this column scrolls
			 * behind them; otherwise the handle's z-index would compete in the
			 * <thead> context and paint over the pinned cells. Pinned cells raise
			 * their own z-index below, so this 0 only applies to scrolling cells. */
			z-index: 0;
			background: ${$subInfo ? table.bodyCell.subInfo.background : table.header.background};
			color: ${table.headCell.color};
			font-weight: ${table.headCell.fontWeight};
			font-size: ${table.headCell.fontSize};
			padding: ${$actionColumn ? table.actionCell.padding : table.headCell.padding};
			height: ${$touch ? table.headCell.touchMinHeight : table.headCell.minHeight};
			text-align: ${groupAlignment};
			vertical-align: ${$verticalAlignment === "top" ? "top" : $verticalAlignment === "bottom" ? "bottom" : "middle"};
			/* Cancel the cellBase border-bottom; the header underline is painted once
			 * on the thead (see StyledDataTable) so it stays continuous across pinned,
			 * group and resize-handle cells. Group cells re-add a border-bottom below
			 * to separate their row from the leaf row. */
			border-bottom: none;

			${$isGroup &&
			css`
				border-bottom: ${table.headCellGroup?.gapForSingle};
				/* Suppress the group cell's right border when a resize handle is
				 * mounted on this boundary (the handle draws its own 2px bar) or on a
				 * pinned edge (the freeze-line box-shadow below already paints the
				 * separator, and the group border would paint over it). */
				${!$hasResizeHandleRight &&
				!$pinnedEdge &&
				css`
					border-right: ${table.headCellGroup?.gapForGroup};
				`}
			`}

			${!$isGroup &&
			$rightDivider &&
			!$hasResizeHandleRight &&
			!$pinnedEdge &&
			css`
				border-right: ${$rightDivider === "group"
					? table.headCellGroup?.gapForGroup
					: table.headCellGroup?.gapForSingle};
			`}

			${pinnedCell(theme, { $pinned, $pinnedEdge, zIndex: DataTableZIndex.pinnedHeadCell })}

		${$sortable &&
			!$isGroup &&
			css`
				cursor: pointer;
				user-select: none;
				color: ${table.headCell.sortable.color};
				/* Hover bottom border, drawn on an absolutely-positioned overlay
				 * (inset: 0) rather than the cell's own border-bottom so it sits on top
				 * of the continuous thead underline without shifting the label. */
				&::before {
					content: "";
					position: absolute;
					inset: 0;
					pointer-events: none;
				}
				/* Suppress the sortable hover affordance while the column resize
				 * handle is hovered — the pointer is over the handle (a child of this
				 * cell), so the bare :hover would otherwise light up the header as
				 * if it were about to sort. */
				&:hover:not(:has(${StyledDataTableResizeHandle}:hover)) {
					color: ${table.headCell.sortable.hoverColor};
					&::before {
						border-bottom: ${table.headCell.sortable.hoverBorder};
					}
				}
				/* Sortable-header focus: colored label + underline on the ::before
				 * overlay + a dotted dark ring, not a solid box. Keyed off \`:focus\`
				 * (not \`:focus-visible\`) to match the row focus ring, keeping the
				 * focus model consistent across rows and headers. */
				&:focus {
					color: ${table.headCell.sortable.focusColor};
					&::before {
						border-bottom: ${table.headCell.sortable.focusBorder};
						outline-offset: -1px;
						${darkFocus}
					}
				}
			`}

		${!$isGroup &&
			css`
				&[aria-sort="ascending"],
				&[aria-sort="descending"] {
					color: ${table.headCell.sortable.activeColor};
				}
			`}
		`;
	}
);

/**
 * Inner wrapper for header-cell content: lets the label wrap (`flex-wrap`),
 * reserves the content min-height, and normalizes the size of icons and
 * icon-buttons rendered inside the header to the theme's header tokens.
 */
const StyledDataTableHeadCellContent = styled.div.withConfig({
	displayName: "StyledDataTableHeadCellContent-sc-"
})(({ theme }) => {
	const { headCell } = theme.components.table;

	return css`
		align-items: center;
		display: inline-flex;
		vertical-align: middle;
		flex-wrap: wrap;
		line-height: normal;
		min-height: ${headCell.contentMinHeight};
		min-width: 0;

		${StyledIconWrapper} {
			align-items: center;
			display: inline-flex;
			font-size: ${headCell.iconFontSize};
		}

		${StyledButton}[data-type="icon"] {
			font-size: ${headCell.buttonIconFontSize};
			height: ${headCell.buttonIconSize};
			min-height: ${headCell.buttonIconSize};
			width: ${headCell.buttonIconSize};
		}
	`;
});

/**
 * Sort-direction arrow rendered inline after the header label. Mounted only when
 * the column is actively sorted, so unsorted columns reserve no space. Uses the
 * shared {@link Icon} widget so the glyph is `aria-hidden` automatically (sort
 * state is conveyed by the cell's `aria-sort`). `color: inherit` (via `&&` for
 * specificity) picks up the cell's active-sort color.
 */
const StyledDataTableHeadCellSortIcon = styled(Icon).withConfig({
	displayName: "StyledDataTableHeadCellSortIcon-sc-"
})`
	margin-inline-start: 6px;
	vertical-align: middle;

	&& {
		color: inherit;
	}
`;

export interface DataTableHeadCellTplProps {
	/** Zero-based leaf-column index this cell starts at. */
	columnIndex: number;

	/** Pinning side for the column (sticky positioning + shadow). */
	pinning?: "left" | "right";

	/**
	 * Whether this is a leaf cell (single column) or a group (spans multiple
	 * leaves). Controls `scope`, sort affordance and group-row borders.
	 */
	isLeaf: boolean;

	/** Horizontal text alignment. */
	horizontalAlignment?: "left" | "center" | "right";

	/** Vertical text alignment. */
	verticalAlignment?: "top" | "middle" | "bottom";

	/** Whether the column is sortable (cursor, `tabIndex`, sort key handlers). */
	sortable?: boolean;

	/**
	 * Whether this is the active sort column. Emits `data-column-active="true"` so
	 * the body cells in the same column pick up the highlight.
	 */
	columnActive?: boolean;

	/** Whether this cell belongs to a sub-info column (alternate background tint). */
	subInfo?: boolean;

	/** Whether this cell belongs to an action column (tighter padding, a11y fallback). */
	actionColumn?: boolean;

	/** Resolved `aria-sort` value. `undefined` when not sortable. */
	ariaSort?: "ascending" | "descending" | "none";

	/** Native `colSpan` — leaf columns a group cell covers (`undefined` → 1). */
	colSpan?: number;

	/** Native `rowSpan` — header rows a leaf cell fills (`undefined` → 1). */
	rowSpan?: number;

	/** `data-leaf-from` — index of the first leaf column this cell covers. */
	leafFrom: number;

	/** `data-leaf-to` — index of the last leaf column this cell covers. */
	leafTo: number;

	/**
	 * `aria-label` override. When `undefined`, action-column cells with no visible
	 * `label` fall back to the localized "Actions" label from `A11YLanguageContext`.
	 */
	ariaLabel?: string;

	/**
	 * Whether the column has a non-empty `label`. When `false` and `actionColumn`
	 * is `true`, the template injects the localized "Actions" fallback `aria-label`.
	 */
	hasLabel?: boolean;

	/**
	 * `title` attribute. Enriched with the localized sortable hint when `sortable`.
	 */
	title?: string;

	/** Inline `style` forwarded to the `<th>`. */
	style?: CSSProperties;

	/** Sanitized consumer-provided `htmlAttributes` from `column.htmlAttributes`. */
	htmlAttributes?: ThHTMLAttributes<HTMLTableCellElement>;

	/** Click handler that triggers sort. */
	onSort?: MouseEventHandler<HTMLTableCellElement>;

	/** Key handler that triggers sort on Enter / Space (only when `sortable`). */
	onSortKeyDown?: KeyboardEventHandler<HTMLTableCellElement>;

	/** Right-click handler — opens the header context menu. */
	onContextMenu?: MouseEventHandler<HTMLTableCellElement>;

	/**
	 * Whether a resize handle is mounted on this cell's right edge. When `true`,
	 * the group cell's `border-right` is suppressed to avoid double-painting the
	 * handle's 2px bar.
	 */
	hasResizeHandleRight?: boolean;

	/**
	 * Vertical divider on this leaf cell's right edge under a column group:
	 * `"group"` extends the group cell's 2px border down through the leaf row,
	 * `"single"` is a 1px divider between sibling leaves. `undefined` = no divider.
	 * Ignored for group cells and suppressed when `hasResizeHandleRight` is true.
	 */
	rightDivider?: "group" | "single";

	/** `id` for the `<th>`. */
	id?: string;

	/** Header content. */
	children?: ReactNode;
}

/**
 * DataTable table header `<th>`. Owns pinning, alignment, sort indicator
 * styling, the `aria-sort` attribute, and an optional resize-handle slot.
 *
 * @experimental
 */
export function DataTableHeadCellTpl({
	columnIndex,
	pinning,
	isLeaf,
	horizontalAlignment,
	verticalAlignment,
	sortable,
	columnActive,
	subInfo,
	actionColumn,
	ariaSort,
	colSpan,
	rowSpan,
	leafFrom,
	leafTo,
	ariaLabel,
	hasLabel,
	title,
	style,
	htmlAttributes,
	onSort,
	onSortKeyDown,
	onContextMenu,
	hasResizeHandleRight,
	rightDivider,
	id,
	children
}: DataTableHeadCellTplProps): ReactElement {
	// Action-column fallback label from `DataTableContext`; falls back to the
	// language context when rendered outside `<DataTable>`.
	const contextActionColumnFallbackLabel = useDataTableContext((ctx) => ctx.actionColumnFallbackLabel);
	const isResizable = useDataTableContext((ctx) => ctx.isResizable);
	const getResizeHandleProps = useDataTableContext((ctx) => ctx.resizeHandleProps);
	// (tree)grid mode overrides the table role, dropping the native `<th>`
	// columnheader mapping, so restate it as `role="columnheader"`.
	const gridRole = useDataTableContext((ctx) => ctx.gridRole);
	const { tableTitles } = useContext(A11YLanguageContext);
	const actionColumnFallbackLabel =
		contextActionColumnFallbackLabel ?? tableTitles?.actionColumnDefaultLabel ?? "Actions";
	const a11ySortableTitle = tableTitles?.sortableTitle?.trim();
	// Memoized: `provider.isPhone()` runs regex-backed device detection, too
	// costly to repeat per render. Not hoisted to module scope so tests can spy
	// the provider.
	const isMobile = useMemo(() => provider.isPhone(), []);
	const resolvedAriaLabel = ariaLabel ?? (actionColumn && !hasLabel ? actionColumnFallbackLabel : undefined);
	const resolvedTitle =
		sortable && a11ySortableTitle ? (title ? `${title}, ${a11ySortableTitle}` : a11ySortableTitle) : title;
	const scope: "col" | "colgroup" = isLeaf ? "col" : "colgroup";
	const { pinStyle, isPinnedEdge } = useCellPinning(pinning, leafFrom, leafTo);
	const resolvedStyle: CSSProperties | undefined = pinStyle ? { ...pinStyle, ...style } : style;

	return (
		<StyledDataTableHeadCell
			{...htmlAttributes}
			id={id ?? htmlAttributes?.id}
			scope={scope}
			role={gridRole ? "columnheader" : undefined}
			data-role={DataRoles.Table.Header.Cell}
			data-column-active={isLeaf && columnActive ? "true" : undefined}
			data-pinned={pinning}
			data-leaf-from={leafFrom}
			data-leaf-to={leafTo}
			colSpan={colSpan}
			rowSpan={rowSpan}
			style={resolvedStyle}
			$pinned={pinning}
			$pinnedEdge={isPinnedEdge}
			$horizontalAlignment={horizontalAlignment}
			$verticalAlignment={verticalAlignment}
			$sortable={sortable}
			$subInfo={!!subInfo}
			$isGroup={!isLeaf}
			$actionColumn={!!actionColumn}
			$hasResizeHandleRight={hasResizeHandleRight}
			$rightDivider={rightDivider}
			$touch={isMobile}
			aria-sort={ariaSort}
			data-col-index={columnIndex + 1}
			aria-label={resolvedAriaLabel}
			title={resolvedTitle}
			tabIndex={sortable ? 0 : undefined}
			onClick={sortable ? onSort : undefined}
			onKeyDown={sortable ? onSortKeyDown : undefined}
			onContextMenu={onContextMenu}
		>
			<StyledDataTableHeadCellContent as={sortable ? "span" : "div"} data-role={DataRoles.Table.Header.Cell.Content}>
				{children}
				{ariaSort === "ascending" || ariaSort === "descending" ? (
					<StyledDataTableHeadCellSortIcon>
						{ariaSort === "ascending" ? "arrow_drop_up" : "arrow_drop_down"}
					</StyledDataTableHeadCellSortIcon>
				) : null}
			</StyledDataTableHeadCellContent>
			{sortable && isMobile && a11ySortableTitle ? <HiddenText>{a11ySortableTitle}</HiddenText> : null}
			{isLeaf && isResizable?.(leafTo) ? (
				<DataTableResizeHandleTpl handleProps={getResizeHandleProps?.(leafTo)} />
			) : null}
		</StyledDataTableHeadCell>
	);
}

DataTableHeadCellTpl.displayName = "DataTableHeadCellTpl";
