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
	KeyboardEvent as ReactKeyboardEvent,
	KeyboardEventHandler as ReactKeyboardEventHandler,
	MouseEvent as ReactMouseEvent,
	MouseEventHandler as ReactMouseEventHandler,
	ReactElement,
	ReactNode,
	ThHTMLAttributes
} from "react";
import { useContext } from "react";

import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { BaseColumnType } from "./foundation/column.api.js";
import { safeHtmlAttributes } from "./data-table.utils.js";
import { getColumnId, getColumnSortOrder } from "./data-table.sort.js";
import type { DataTableRenderPropsType } from "./data-table-renderer.api.js";
import type { ResolvedDataTableSlots } from "./data-table-slots.api.js";
import { useDataTableContext } from "./data-table.context.js";
import { DataTableDnDBodyRow, DataTableDnDDragPreview } from "./data-table.dnd.js";
import { DataTableInfiniteScrollBody } from "./data-table.infinite-scroll-body.view.js";
import { DataTableVirtualizedBody } from "./data-table.virtualized-body.view.js";
import { DataTableBodyCellTpl } from "./template/data-table.body-cell.tpl.view.js";
import { DataTableBodyRowTpl, StyledDataTableRowOverlayCell } from "./template/data-table.body-row.tpl.view.js";
import { DataTableBodyTpl } from "./template/data-table.body.tpl.view.js";
import { DataTableFootCellTpl } from "./template/data-table.foot-cell.tpl.view.js";
import { DataTableFootRowTpl } from "./template/data-table.foot-row.tpl.view.js";
import { DataTableFootTpl } from "./template/data-table.foot.tpl.view.js";
import { DataTableHeadCellTpl } from "./template/data-table.head-cell.tpl.view.js";
import { DataTableHeadFilterCellTpl } from "./template/data-table.head-filter-cell.tpl.view.js";
import { DataTableHeadFilterRowTpl } from "./template/data-table.head-filter-row.tpl.view.js";
import { DataTableHeadRowTpl } from "./template/data-table.head-row.tpl.view.js";
import { DataTableHeadTpl } from "./template/data-table.head.tpl.view.js";
import { DataTablePlaceholderCellTpl } from "./template/data-table.placeholder-cell.tpl.view.js";
import { DataTablePlaceholderContentTpl } from "./template/data-table.placeholder-content.tpl.view.js";
import { DataTablePlaceholderRowTpl } from "./template/data-table.placeholder-row.tpl.view.js";
import { DataTableVerticalHeaderCellTpl } from "./template/data-table.vertical-header-cell.tpl.view.js";

/**
 * Default `<thead>` renderer — composes {@link DataTableHeadTpl}.
 *
 * @experimental
 */
export function DataTableHead({ children }: DataTableRenderPropsType.HeadProps): ReactElement {
	return <DataTableHeadTpl>{children}</DataTableHeadTpl>;
}

/**
 * Default `<thead><tr>` renderer — composes {@link DataTableHeadRowTpl}.
 *
 * @experimental
 */
export function DataTableHeadRow({ children }: DataTableRenderPropsType.HeadRowProps): ReactElement {
	const isVirtualizedMode = useDataTableContext((ctx) => ctx.isVirtualizedMode);

	// Explicit row numbering is only needed when the body is windowed; a
	// fully-rendered table lets native semantics convey the header's position.
	return <DataTableHeadRowTpl ariaRowIndex={isVirtualizedMode ? 1 : undefined}>{children}</DataTableHeadRowTpl>;
}

/**
 * Resolved framework-owned interaction wiring for a head cell (sort, header
 * context menu, active-sort highlight, resize-handle suppression, group
 * dividers), sourced from {@link DataTableContext} so it stays off the public
 * {@link DataTableRenderPropsType.HeadCellProps} surface.
 */
function useHeadCellInteraction<RowType, ColumnType extends BaseColumnType<RowType>>(
	column: ColumnType,
	columnIndex: number,
	leafTo: number,
	isLeaf: boolean
): {
	sortable: boolean;
	columnActive: boolean;
	onSort?: ReactMouseEventHandler;
	onSortKeyDown?: ReactKeyboardEventHandler;
	onContextMenu?: ReactMouseEventHandler;
	hasResizeHandleRight: boolean;
	rightDivider?: "group" | "single";
} {
	const disabled = useDataTableContext((ctx) => ctx.disabled);
	const onSortCtx = useDataTableContext<RowType, ColumnType>((ctx) => ctx.onSort);
	const sortState = useDataTableContext<RowType, ColumnType>((ctx) => ctx.sortState);
	const isResizable = useDataTableContext((ctx) => ctx.isResizable);
	const openHeadContextMenu = useDataTableContext<RowType, ColumnType>((ctx) => ctx.openHeadContextMenu);
	const groupRightBoundaries = useDataTableContext((ctx) => ctx.groupRightBoundaries);
	const leavesInGroup = useDataTableContext((ctx) => ctx.leavesInGroup);
	const headContextMenuSlot = useDataTableContext((ctx) => ctx.slots?.headContextMenu);

	const sortable = !!column.sortable && isLeaf;
	const columnActive = isLeaf && getColumnSortOrder(getColumnId(column), sortState) !== undefined;
	const hasHeadContextMenu = !disabled && !!headContextMenuSlot;

	return {
		sortable,
		columnActive,
		onSort:
			sortable && onSortCtx
				? (event: ReactMouseEvent<HTMLTableCellElement>): void => onSortCtx(column, event)
				: undefined,
		onSortKeyDown:
			sortable && onSortCtx
				? (event: ReactKeyboardEvent<HTMLTableCellElement>): void => {
						if (event.key === "Enter" || event.key === " ") {
							event.preventDefault();
							onSortCtx(column, event);
						}
					}
				: undefined,
		onContextMenu:
			hasHeadContextMenu && openHeadContextMenu
				? (event: ReactMouseEvent<HTMLTableCellElement>): void => {
						event.preventDefault();
						openHeadContextMenu({
							column,
							columnIndex,
							position: { top: event.clientY, left: event.clientX }
						});
					}
				: undefined,
		hasResizeHandleRight: isResizable?.(leafTo) ?? false,
		rightDivider: isLeaf
			? groupRightBoundaries?.has(leafTo)
				? "group"
				: leavesInGroup?.has(leafTo)
					? "single"
					: undefined
			: undefined
	};
}

/**
 * Default head-cell renderer — composes {@link DataTableHeadCellTpl}. Structural
 * props come from the slot; interaction wiring is self-sourced via
 * {@link useHeadCellInteraction}.
 *
 * @experimental
 */
export function DataTableHeadCell<RowType, ColumnType extends BaseColumnType<RowType>>({
	id,
	column,
	columnIndex,
	ariaSort,
	colSpan,
	rowSpan,
	isLeaf,
	pinning,
	horizontalAlignment,
	verticalAlignment,
	style,
	children
}: DataTableRenderPropsType.HeadCellProps<RowType, ColumnType>): ReactElement {
	const leafTo = columnIndex;
	const interaction = useHeadCellInteraction<RowType, ColumnType>(column, columnIndex, leafTo, !!isLeaf);
	const htmlAttributes = safeHtmlAttributes<HTMLTableCellElement>(
		column.htmlAttributes as ThHTMLAttributes<HTMLTableCellElement> | undefined
	);

	return (
		<DataTableHeadCellTpl
			id={id}
			columnIndex={columnIndex}
			pinning={pinning}
			isLeaf={!!isLeaf}
			horizontalAlignment={horizontalAlignment}
			verticalAlignment={verticalAlignment}
			sortable={interaction.sortable}
			columnActive={interaction.columnActive}
			subInfo={!!column.subInfo}
			actionColumn={!!column.actionColumn}
			ariaSort={ariaSort}
			colSpan={colSpan}
			rowSpan={rowSpan}
			leafFrom={columnIndex}
			leafTo={leafTo}
			ariaLabel={column.hiddenText ? column.hiddenText : undefined}
			hasLabel={!!column.label}
			title={htmlAttributes.title}
			style={style}
			htmlAttributes={htmlAttributes}
			onSort={interaction.onSort}
			onSortKeyDown={interaction.onSortKeyDown}
			onContextMenu={interaction.onContextMenu}
			hasResizeHandleRight={interaction.hasResizeHandleRight}
			rightDivider={interaction.rightDivider}
		>
			{children}
		</DataTableHeadCellTpl>
	);
}

/**
 * Default header-cell-group renderer for a non-leaf (column-group) header cell.
 * Mirrors {@link DataTableHeadCell} but forces `isLeaf={false}` and spans its
 * leaf columns. Group cells are never sortable and paint no leaf divider.
 *
 * @experimental
 */
export function DataTableHeadCellGroup<RowType, ColumnType extends BaseColumnType<RowType>>({
	id,
	column,
	columnIndex,
	ariaSort,
	colSpan,
	rowSpan,
	pinning,
	horizontalAlignment,
	verticalAlignment,
	style,
	children
}: DataTableRenderPropsType.HeadCellProps<RowType, ColumnType>): ReactElement {
	const leafTo = columnIndex + (colSpan ? colSpan - 1 : 0);
	const interaction = useHeadCellInteraction<RowType, ColumnType>(column, columnIndex, leafTo, false);
	const htmlAttributes = safeHtmlAttributes<HTMLTableCellElement>(
		column.htmlAttributes as ThHTMLAttributes<HTMLTableCellElement> | undefined
	);

	return (
		<DataTableHeadCellTpl
			id={id}
			columnIndex={columnIndex}
			pinning={pinning}
			isLeaf={false}
			horizontalAlignment={horizontalAlignment}
			verticalAlignment={verticalAlignment}
			sortable={false}
			subInfo={!!column.subInfo}
			actionColumn={!!column.actionColumn}
			ariaSort={ariaSort}
			colSpan={colSpan}
			rowSpan={rowSpan}
			leafFrom={columnIndex}
			leafTo={leafTo}
			ariaLabel={column.hiddenText ? column.hiddenText : undefined}
			hasLabel={!!column.label}
			title={htmlAttributes.title}
			style={style}
			htmlAttributes={htmlAttributes}
			onContextMenu={interaction.onContextMenu}
			hasResizeHandleRight={interaction.hasResizeHandleRight}
		>
			{children}
		</DataTableHeadCellTpl>
	);
}

/**
 * Default content renderer for a head cell — emits the column label.
 *
 * @experimental
 */
export function DataTableHeadContent({ defaultContent }: DataTableRenderPropsType.HeadContentProps): ReactNode {
	return defaultContent;
}

/**
 * Default header filter row — composes {@link DataTableHeadFilterRowTpl}.
 *
 * @experimental
 */
export function DataTableFilterRow({ children }: DataTableRenderPropsType.HeadFilterRowProps): ReactElement {
	const headerDepth = useDataTableContext((ctx) => ctx.headerDepth);
	const isVirtualizedMode = useDataTableContext((ctx) => ctx.isVirtualizedMode);

	// Only windowed bodies need the explicit index that places the filter row
	// after the header rows; a fully-rendered table relies on native semantics.
	return (
		<DataTableHeadFilterRowTpl ariaRowIndex={isVirtualizedMode ? headerDepth + 1 : undefined}>
			{children}
		</DataTableHeadFilterRowTpl>
	);
}

/**
 * Default header filter cell — composes {@link DataTableHeadFilterCellTpl}.
 *
 * @experimental
 */
export function DataTableFilterCell<RowType, ColumnType extends BaseColumnType<RowType>>({
	columnIndex,
	pinning,
	children
}: DataTableRenderPropsType.HeadFilterCellProps<RowType, ColumnType>): ReactElement {
	return (
		<DataTableHeadFilterCellTpl columnIndex={columnIndex} pinning={pinning}>
			{children}
		</DataTableHeadFilterCellTpl>
	);
}

/**
 * Default header filter-content renderer — emits no content. Consumers wanting
 * a filter input or summary control should override this slot.
 *
 * @experimental
 */
export function DataTableFilterContent(_props: DataTableRenderPropsType.HeadFilterContentProps): ReactNode {
	return null;
}

/**
 * Default `<tbody>` renderer — composes {@link DataTableBodyTpl}.
 *
 * @experimental
 */
export function DataTableBody({ children }: DataTableRenderPropsType.BodyProps): ReactElement {
	return <DataTableBodyTpl>{children}</DataTableBodyTpl>;
}

/**
 * Default body-row renderer — composes {@link DataTableBodyRowTpl}, producing
 * only the `<tr>` and forwarding the resolved row state from
 * {@link DataTableRenderPropsType.BodyRowProps}. Drag-and-drop and row-expansion
 * wiring are composed externally by the orchestrator.
 *
 * @experimental
 */
export function DataTableRow<RowType, ColumnType extends BaseColumnType<RowType>>({
	row,
	styles,
	rowIndex,
	disabled,
	hasAdditionalContent,
	selected,
	highlighted,
	highlightVariant,
	interactive,
	ariaExpanded,
	ariaRowIndex,
	htmlAttributes,
	virtualStyle,
	onClick,
	onContextMenu,
	onMouseOver,
	forwardedRef,
	children
}: DataTableRenderPropsType.BodyRowProps<RowType, ColumnType>): ReactElement {
	// Opt-in per-row overlay (e.g. a busy veil). Absent unless the consumer supplies
	// the slot, so non-overlay tables pay only one stable context read and no extra
	// DOM. The overlay cell is out of table flow (see `StyledDataTableRowOverlayCell`),
	// so it never disturbs column alignment.
	const RowOverlaySlot = useDataTableContext<RowType, ColumnType>((ctx) => ctx.slots?.rowOverlay);
	// Slot component identities are stable per `<DataTable>` instance (see the DataTableSlots contract),
	// so rendering the context-sourced slot here does not remount it between renders.
	// eslint-disable-next-line react-hooks/static-components -- stable slot identity per the slots contract
	const overlay = RowOverlaySlot ? <RowOverlaySlot row={row} rowIndex={rowIndex} /> : null;

	return (
		<DataTableBodyRowTpl
			styles={styles}
			rowIndex={rowIndex}
			disabled={disabled}
			selected={selected}
			highlighted={highlighted}
			highlightVariant={highlightVariant}
			interactive={interactive}
			ariaExpanded={ariaExpanded ?? (hasAdditionalContent ? true : undefined)}
			ariaRowIndex={ariaRowIndex}
			htmlAttributes={htmlAttributes}
			virtualStyle={virtualStyle}
			onClick={onClick}
			onContextMenu={onContextMenu}
			onMouseOver={onMouseOver}
			forwardedRef={forwardedRef}
		>
			{children}
			{overlay ? (
				<StyledDataTableRowOverlayCell data-role={DataRoles.Table.RowOverlay}>{overlay}</StyledDataTableRowOverlayCell>
			) : null}
		</DataTableBodyRowTpl>
	);
}

/**
 * Default body-cell renderer — dispatches to {@link DataTableVerticalHeaderCellTpl}
 * for cross-tabulation header columns (`column.verticalHeader`) and
 * {@link DataTableBodyCellTpl} otherwise. Structural props come from the slot;
 * framework-owned per-cell state is self-sourced from {@link DataTableContext}.
 *
 * @experimental
 */
export function DataTableCell<RowType, ColumnType extends BaseColumnType<RowType>>({
	column,
	columnIndex,
	pinning,
	colSpan,
	rowHasColSpan,
	horizontalAlignment,
	verticalAlignment,
	cellStyles,
	subInfo,
	rowDisabled: rowDisabledProp,
	rowHighlightVariant,
	children
}: DataTableRenderPropsType.BodyCellProps<RowType, ColumnType>): ReactElement {
	const disabled = useDataTableContext((ctx) => ctx.disabled);

	// The orchestrator resolves `rowStyling` once per row and passes the
	// row-level flags down — re-invoking the consumer getter here would cost
	// O(rows × columns) calls per render.
	const rowDisabled = disabled || !!rowDisabledProp;
	const cellLabel = column.label;
	const htmlAttributes = safeHtmlAttributes<HTMLTableCellElement>(
		column.htmlAttributes as ThHTMLAttributes<HTMLTableCellElement> | undefined
	);

	if (column.verticalHeader) {
		return (
			<DataTableVerticalHeaderCellTpl
				columnIndex={columnIndex}
				pinning={pinning}
				colSpan={colSpan}
				horizontalAlignment={horizontalAlignment}
				verticalAlignment={verticalAlignment}
				cellLabel={cellLabel}
				cellStyles={cellStyles}
				htmlAttributes={htmlAttributes}
			>
				{children}
			</DataTableVerticalHeaderCellTpl>
		);
	}

	return (
		<DataTableBodyCellTpl
			columnIndex={columnIndex}
			pinning={pinning}
			colSpan={colSpan}
			leafIndexAttr={rowHasColSpan ? columnIndex : undefined}
			horizontalAlignment={horizontalAlignment}
			verticalAlignment={verticalAlignment}
			subInfo={subInfo ?? !!column.subInfo}
			actionColumn={!!column.actionColumn}
			firstCell={columnIndex === 0}
			rowDisabled={rowDisabled}
			rowHighlightVariant={rowHighlightVariant}
			cellLabel={cellLabel}
			cellStyles={cellStyles}
			htmlAttributes={htmlAttributes}
		>
			{children}
		</DataTableBodyCellTpl>
	);
}

/**
 * Default body content renderer — emits the cell value resolved from
 * `dataKey`/`dataGetter`.
 *
 * @experimental
 */
export function DataTableCellContent({ defaultContent }: DataTableRenderPropsType.BodyContentProps): ReactNode {
	return defaultContent;
}

/**
 * Default placeholder row used when `data` is empty — composes
 * {@link DataTablePlaceholderRowTpl}.
 *
 * @experimental
 */
export function DataTablePlaceholderRow({
	columnCount,
	children
}: DataTableRenderPropsType.PlaceHolderBodyRowProps): ReactElement {
	return <DataTablePlaceholderRowTpl columnCount={columnCount}>{children}</DataTablePlaceholderRowTpl>;
}

/**
 * Default placeholder cell renderer — composes {@link DataTablePlaceholderCellTpl}.
 * Renders a `<td>` per leaf column with placeholder content inside.
 *
 * @experimental
 */
export function DataTablePlaceholderCell<RowType, ColumnType extends BaseColumnType<RowType>>({
	columnIndex,
	children
}: DataTableRenderPropsType.PlaceHolderBodyCellProps<RowType, ColumnType>): ReactElement {
	const leafPinning = useDataTableContext((ctx) => ctx.leafPinning);

	return (
		<DataTablePlaceholderCellTpl columnIndex={columnIndex} pinning={leafPinning[columnIndex]}>
			{children}
		</DataTablePlaceholderCellTpl>
	);
}

/**
 * Default placeholder content renderer — composes {@link DataTablePlaceholderContentTpl},
 * an animated shimmer bar.
 *
 * @experimental
 */
export function DataTablePlaceholderContent(
	_props: DataTableRenderPropsType.PlaceHolderBodyContentProps
): ReactElement {
	return <DataTablePlaceholderContentTpl />;
}

/**
 * Default `<tfoot>` renderer — composes {@link DataTableFootTpl}.
 *
 * @experimental
 */
export function DataTableFoot({ children }: DataTableRenderPropsType.FootProps): ReactElement {
	const { tableTitles } = useContext(A11YLanguageContext);
	const footerLabel = tableTitles?.footerLabel ?? "Footer";

	return <DataTableFootTpl ariaLabel={footerLabel}>{children}</DataTableFootTpl>;
}

/**
 * Default `<tfoot><tr>` renderer — composes {@link DataTableFootRowTpl}.
 *
 * @experimental
 */
export function DataTableFootRow({ children }: DataTableRenderPropsType.FootRowProps): ReactElement {
	const footerAriaRowIndex = useDataTableContext((ctx) => ctx.footerAriaRowIndex);

	// `footerAriaRowIndex` is only populated in windowed modes; otherwise the
	// footer relies on native `<table>` semantics like every other row.
	return <DataTableFootRowTpl ariaRowIndex={footerAriaRowIndex}>{children}</DataTableFootRowTpl>;
}

/**
 * Default `<tfoot><td>` renderer — composes {@link DataTableFootCellTpl}.
 *
 * @experimental
 */
export function DataTableFootCell<RowType, ColumnType extends BaseColumnType<RowType>>({
	column,
	columnIndex,
	pinning,
	children
}: DataTableRenderPropsType.FootCellProps<RowType, ColumnType>): ReactElement {
	return (
		<DataTableFootCellTpl
			columnIndex={columnIndex}
			pinning={pinning ?? column.pinning}
			horizontalAlignment={column.specificHorizontalAlignment?.body ?? column.horizontalAlignment}
			verticalAlignment={column.specificVerticalAlignment?.body ?? column.verticalAlignment}
			actionColumn={!!column.actionColumn}
		>
			{children}
		</DataTableFootCellTpl>
	);
}

/**
 * Default footer content renderer — emits no content. Consumers wanting summary
 * values should override this slot with a custom renderer.
 *
 * @experimental
 */
export function DataTableFootContent(_props: DataTableRenderPropsType.FootContentProps): ReactNode {
	return null;
}

/**
 * Default row-group header renderer used by {@link DataTableRowsGroup}. Emits
 * the resolved `defaultContent` (the group title) prefixed with a small
 * collapse-indicator glyph that reflects the `collapsed` flag. Consumers wanting
 * richer group headers (custom icons, counts, actions) override this slot.
 *
 * @experimental
 */
export function DataTableRowGroupHeader<RowType>({
	collapsed,
	defaultContent
}: DataTableRenderPropsType.RowGroupHeaderProps<RowType>): ReactElement {
	return (
		<>
			<span aria-hidden="true">{collapsed ? "▶" : "▼"}</span>
			{defaultContent}
		</>
	);
}

/**
 * Default slot set for {@link DataTable}: every structural slot maps to the
 * self-wiring primitive of the same name. The orchestrator merges consumer
 * {@link DataTableSlots} over this map; `contextMenu` and `headContextMenu`
 * are opt-in and intentionally absent.
 *
 * @experimental
 */
export const DataTableDefaultSlots: ResolvedDataTableSlots<any> = {
	head: DataTableHead,
	headRow: DataTableHeadRow,
	headCell: DataTableHeadCell,
	headCellGroup: DataTableHeadCellGroup,
	headContent: DataTableHeadContent,
	filterRow: DataTableFilterRow,
	filterCell: DataTableFilterCell,
	filterContent: DataTableFilterContent,
	body: DataTableBody,
	virtualizedBody: DataTableVirtualizedBody,
	infiniteScrollBody: DataTableInfiniteScrollBody,
	row: DataTableRow,
	cell: DataTableCell,
	cellContent: DataTableCellContent,
	placeholderRow: DataTablePlaceholderRow,
	placeholderCell: DataTablePlaceholderCell,
	placeholderContent: DataTablePlaceholderContent,
	foot: DataTableFoot,
	footRow: DataTableFootRow,
	footCell: DataTableFootCell,
	footContent: DataTableFootContent,
	rowGroupHeader: DataTableRowGroupHeader,
	dndRow: DataTableDnDBodyRow,
	dragPreview: DataTableDnDDragPreview
};
