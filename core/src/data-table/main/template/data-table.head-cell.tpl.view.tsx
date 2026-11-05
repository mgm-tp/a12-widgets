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
	HTMLAttributes,
	KeyboardEventHandler,
	MouseEventHandler,
	ReactElement,
	ReactNode,
	ThHTMLAttributes
} from "react";
import { useContext, useId, useMemo } from "react";
import { css, styled } from "styled-components";

import { StyledButton } from "../../../button/main/button.styled.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { provider } from "../../../common/main/device-detector.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { Icon, StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { darkFocus } from "../../../theme/base/mixins/_interaction.js";
import { useDataTableContext } from "../data-table.context.js";

import { HeadHiddenText, resolveHeadHiddenText } from "./data-table.head-hidden-text.js";
import { DataTableResizeHandleTpl, StyledDataTableResizeHandle } from "./data-table.resize-handle.tpl.view.js";
import { cellBase, cellPadding, parseBorder, pinnedCell, useCellPinning } from "./data-table.styled-utils.js";
import { DataTableZIndex } from "./data-table.z-index.js";

/**
 * The cell's right-edge column divider, drawn as an inset shadow rather than a `border-right`.
 *
 * An absolutely positioned child's containing block is its ancestor's *padding* box, so a border
 * here would push the hosted resize handle inside the column boundary. An inset shadow costs no
 * layout and paints on the same pixels: it is drawn inside the padding edge, which without a
 * border is the border-box edge — exactly where the border sat.
 */
const dividerShadowValue = (border: string | undefined): string | undefined => {
	if (!border) {
		return undefined;
	}

	const { width, color } = parseBorder(border);

	return `inset -${width} 0 0 0 ${color}`;
};

const dividerShadow = (border: string | undefined): ReturnType<typeof css> | undefined => {
	const shadow = dividerShadowValue(border);

	if (!shadow) {
		return undefined;
	}

	return css`
		box-shadow: ${shadow};
	`;
};

export const StyledDataTableHeadCell = styled.th.withConfig({ displayName: "StyledDataTableHeadCell-sc-" })<{
	$pinned?: "left" | "right";
	$pinnedEdge?: boolean;
	$horizontalAlignment?: "left" | "center" | "right";
	$verticalAlignment?: "top" | "middle" | "bottom";
	$sortable?: boolean;
	$subInfo?: boolean;
	$isGroup?: boolean;
	$actionColumn?: boolean;
	$rightDivider?: "group" | "single";

	/**
	 * Whether this cell covers the table's first column, which earns the first-column inset. Keyed
	 * off `leafFrom`, not row position: a `rowSpan`'d leaf makes a lower header row start at leaf 1.
	 */
	$firstCell?: boolean;

	/**
	 * Whether this is a column-group cell hosting a group resize handle. Only affects
	 * pinned cells, which are raised one step so the handle's downward overflow clears
	 * the group's own pinned children. Scrolling cells need no raise.
	 */
	$groupResize?: boolean;
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
		$rightDivider,
		$firstCell,
		$groupResize,
		$touch
	}) => {
		const { table } = theme.components;
		const groupAlignment = $horizontalAlignment ?? ($isGroup ? "center" : "left");

		/* A right-pinned edge cell's freeze line sits on its left edge, so — unlike a left-pinned
		 * one — it does not stand in for the right-edge divider. `pinnedCell` sets `box-shadow`
		 * wholesale, so the divider rides along with it instead of as its own declaration. */
		const rightPinnedEdgeDivider =
			$pinnedEdge && $pinned === "right" && !$isGroup && $rightDivider
				? dividerShadowValue(
						$rightDivider === "group" ? table.headCellGroup?.gapForGroup : table.headCellGroup?.gapForSingle
					)
				: undefined;

		return css`
			${cellBase(theme, $firstCell)}
			position: relative;
			/* \`auto\`, not a number: a non-auto z-index would form a stacking context and
			 * trap the hosted resize handle, letting the next head cell paint over the
			 * half that straddles their shared boundary. Pinned cells set their own
			 * z-index below and do stay stacking contexts — their handles sit flush. */
			z-index: auto;
			background: ${$subInfo ? table.bodyCell.subInfo.background : table.header.background};
			color: ${table.headCell.color};
			font-weight: ${table.headCell.fontWeight};
			font-size: ${table.headCell.fontSize};
			${cellPadding(theme, $actionColumn ? table.actionCell.padding : table.headCell.padding, $firstCell)}
			height: ${$touch ? table.headCell.touchMinHeight : table.headCell.minHeight};
			text-align: ${groupAlignment};
			vertical-align: ${$verticalAlignment === "top" ? "top" : $verticalAlignment === "bottom" ? "bottom" : "middle"};
			/* Cancel the cellBase border-bottom; the header underline is painted once
			 * on the thead (see StyledDataTable) so it stays continuous across pinned,
			 * group and resize-handle cells. Group cells re-add a border-bottom below
			 * to separate their row from the leaf row. */
			border-bottom: none;

			${
				$isGroup &&
				css`
					border-bottom: ${table.headCellGroup?.gapForSingle};
					/* Suppress the group cell's divider on a pinned edge (the freeze-line
				 * shadow below already paints that separator, and the two would fight
				 * over the same \`box-shadow\` declaration). A resize handle no longer
				 * suppresses it: the handle straddles only the leaf row, so relying on
				 * it left the group-header row (which has no handle) with no divider. */
					${!$pinnedEdge && dividerShadow(table.headCellGroup?.gapForGroup)}
				`
			}

			${
				!$isGroup &&
				$rightDivider &&
				!$pinnedEdge &&
				dividerShadow($rightDivider === "group" ? table.headCellGroup?.gapForGroup : table.headCellGroup?.gapForSingle)
			}

			/* Mutually exclusive with the divider above: that applies only when
			 * \`!$pinnedEdge\`, this paints its freeze-line shadow only when \`$pinnedEdge\`,
			 * so the later declaration never overwrites an active divider. */

			${pinnedCell(theme, {
				$pinned,
				$pinnedEdge,
				edgeExtraShadow: rightPinnedEdgeDivider,
				zIndex: $groupResize ? DataTableZIndex.pinnedHeadCellGroupResize : DataTableZIndex.pinnedHeadCell
			})}

			${
				$sortable &&
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
						outline: none;
						color: ${table.headCell.sortable.focusColor};
						&::before {
							border-bottom: ${table.headCell.sortable.focusBorder};
							outline-offset: -1px;
							${darkFocus}
						}
					}
				`
			}

			${
				!$isGroup &&
				css`
					&[aria-sort="ascending"],
					&[aria-sort="descending"] {
						color: ${table.headCell.sortable.activeColor};
					}
				`
			}
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
	 * `aria-label` override for a custom head-cell renderer. Overrides the
	 * accessible name contributed by the cell's own content, so prefer
	 * {@link hiddenText} unless the visible label must be replaced.
	 */
	ariaLabel?: string;

	/**
	 * Screen-reader-only text appended after the cell content.
	 *
	 * - An empty string renders nothing, not even the action-column fallback.
	 * - A non-empty value is rendered as-is.
	 * - When `undefined`, an `actionColumn` cell falls back to the localized
	 *   "Action" label from `A11YLanguageContext`.
	 */
	hiddenText?: string;

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
	 * Vertical divider on this cell's right edge: `"group"` is the heavier 2px rule
	 * at a column group's right boundary, `"single"` is the 1px rule between
	 * adjacent columns. `undefined` = no divider (the last leaf / table edge).
	 * Suppressed at pinned edges, where the freeze-line already paints the separator.
	 */
	rightDivider?: "group" | "single";

	/**
	 * Resolved DOM props for a column group's resize handle (from the orchestrator's
	 * `groupResizeHandleProps`). When present on a group cell (`isLeaf === false`),
	 * the handle is rendered at the group's right edge and resizes the whole group
	 * proportionally. Leaf cells source their handle from context instead.
	 */
	groupResizeHandleProps?: HTMLAttributes<HTMLDivElement>;

	/**
	 * Whether the group's right edge is the table's right edge (its last leaf is the
	 * last column). Keeps the handle flush inside the cell to avoid the overhang that
	 * would force a permanent horizontal scrollbar.
	 */
	groupResizeIsLastLeaf?: boolean;

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
	hiddenText,
	title,
	style,
	htmlAttributes,
	onSort,
	onSortKeyDown,
	onContextMenu,
	rightDivider,
	groupResizeHandleProps,
	groupResizeIsLastLeaf,
	id,
	children
}: DataTableHeadCellTplProps): ReactElement {
	const isResizable = useDataTableContext().isResizable;
	const leafColumnCount = useDataTableContext().leafColumnCount;
	const getResizeHandleProps = useDataTableContext().resizeHandleProps;
	const resizeEdgeOwner = useDataTableContext().resizeEdgeOwner;
	// (tree)grid mode overrides the table role, dropping the native `<th>`
	// columnheader mapping, so restate it as `role="columnheader"`.
	const gridRole = useDataTableContext().gridRole;
	const actionColumnHiddenText = useDataTableContext().actionColumnHiddenText;
	const { tableTitles } = useContext(A11YLanguageContext);
	const a11ySortableTitle = tableTitles?.sortableTitle?.trim();
	// Memoized: `provider.isPhone()` runs regex-backed device detection, too
	// costly to repeat per render. Not hoisted to module scope so tests can spy
	// the provider.
	const isMobile = useMemo(() => provider.isPhone(), []);
	const resolvedTitle =
		sortable && a11ySortableTitle ? (title ? `${title}, ${a11ySortableTitle}` : a11ySortableTitle) : title;
	const scope: "col" | "colgroup" = isLeaf ? "col" : "colgroup";
	const { pinStyle, isPinnedEdge } = useCellPinning(pinning, leafFrom, leafTo);
	const resolvedStyle: CSSProperties | undefined = pinStyle ? { ...pinStyle, ...style } : style;

	// The resize handle is a focusable `role="separator"` *inside* the `<th>`, so the
	// cell's name-from-content would fold the handle's own `aria-label` into the column
	// name ("Col A Resize Col A"). Name the cell explicitly from its label parts instead:
	// the visible content, the touch-only "sortable" hint and the screen-reader-only
	// `hiddenText`. Only spans that actually render are referenced, so the name never
	// resolves to an empty string (which would not fall back to the content).
	const nameId = useId();
	const contentId = `${nameId}-label`;
	const sortableHintId = `${nameId}-sortable`;
	const hiddenTextId = `${nameId}-hidden`;
	const showSortableHint = sortable && isMobile && !!a11ySortableTitle;
	const resolvedHiddenText = resolveHeadHiddenText({
		hiddenText,
		actionColumn,
		contextHiddenText: actionColumnHiddenText,
		fallbackTitle: tableTitles?.actionTitle
	});
	const hasContent = children !== undefined && children !== null && children !== "" && children !== false;
	const nameIds = [
		hasContent ? contentId : undefined,
		showSortableHint ? sortableHintId : undefined,
		resolvedHiddenText ? hiddenTextId : undefined
	].filter(Boolean);
	// An explicit `aria-label` / `aria-labelledby` (prop or consumer `htmlAttributes`) wins.
	const resolvedAriaLabel = ariaLabel ?? htmlAttributes?.["aria-label"];
	const ariaLabelledby =
		htmlAttributes?.["aria-labelledby"] ?? (resolvedAriaLabel || nameIds.length === 0 ? undefined : nameIds.join(" "));

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
			$rightDivider={rightDivider}
			$firstCell={leafFrom === 0}
			$groupResize={!isLeaf && !!groupResizeHandleProps}
			$touch={isMobile}
			aria-sort={ariaSort}
			data-col-index={columnIndex + 1}
			data-auto-size-col={actionColumn ? columnIndex : undefined}
			aria-label={resolvedAriaLabel}
			aria-labelledby={ariaLabelledby}
			title={resolvedTitle}
			tabIndex={sortable ? 0 : undefined}
			// Fall back to the consumer's `htmlAttributes` handlers on non-sortable columns
			// instead of clobbering them with `undefined` (the sort handler takes precedence
			// on sortable columns), matching the body cell's compose-don't-clobber idiom.
			onClick={sortable ? onSort : htmlAttributes?.onClick}
			onKeyDown={sortable ? onSortKeyDown : htmlAttributes?.onKeyDown}
			onContextMenu={onContextMenu ?? htmlAttributes?.onContextMenu}
		>
			<StyledDataTableHeadCellContent
				as={sortable ? "span" : "div"}
				id={hasContent ? contentId : undefined}
				data-role={DataRoles.Table.Header.Cell.Content}
			>
				{children}
				{ariaSort === "ascending" || ariaSort === "descending" ? (
					<StyledDataTableHeadCellSortIcon>
						{ariaSort === "ascending" ? "arrow_drop_up" : "arrow_drop_down"}
					</StyledDataTableHeadCellSortIcon>
				) : null}
			</StyledDataTableHeadCellContent>
			{showSortableHint ? <HiddenText id={sortableHintId}>{a11ySortableTitle}</HiddenText> : null}
			<HeadHiddenText hiddenText={hiddenText} actionColumn={actionColumn} id={hiddenTextId} />
			{/* No leaf handle where a group handle already owns the boundary. */}
			{isLeaf && isResizable?.(leafTo) && !resizeEdgeOwner?.[leafTo] ? (
				<DataTableResizeHandleTpl
					handleProps={getResizeHandleProps?.(leafTo)}
					isLastLeaf={leafColumnCount !== undefined && leafTo === leafColumnCount - 1}
					pinned={!!pinning}
				/>
			) : null}
			{!isLeaf && groupResizeHandleProps ? (
				<DataTableResizeHandleTpl
					handleProps={groupResizeHandleProps}
					isLastLeaf={groupResizeIsLastLeaf}
					pinned={!!pinning}
				/>
			) : null}
		</StyledDataTableHeadCell>
	);
}

DataTableHeadCellTpl.displayName = "DataTableHeadCellTpl";
