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

import type { HTMLAttributes, ReactElement } from "react";

import { DataRoles } from "../../../common/main/data-roles.js";
import type { DataTableRenderPropsType } from "../data-table-renderer.api.js";
import type { ResolvedDataTableSlots } from "../data-table-slots.api.js";
import { useDataTableContext } from "../data-table.context.js";
import { safeHtmlAttributes } from "../data-table.utils.js";
import { DataTableDefaultSlots } from "../default-renderers.js";
import type { BaseColumnType } from "../foundation/column.api.js";

import { DataTableCardFieldTpl } from "./data-table.card-field.tpl.view.js";
import { DataTableCardListTpl } from "./data-table.card-list.tpl.view.js";
import {
	DataTableCardPlaceholderFieldTpl,
	DataTableCardPlaceholderTpl
} from "./data-table.card-placeholder.tpl.view.js";
import type { DataTableCardTplProps } from "./data-table.card.tpl.view.js";
import { DataTableCardTpl, StyledDataTableCardOverlay } from "./data-table.card.tpl.view.js";
import { DataTableInfiniteScrollCardBody, DataTableVirtualizedCardBody } from "./data-table.windowed-card-list.view.js";

/**
 * Card-view `body` slot — composes {@link DataTableCardListTpl}.
 *
 * @experimental
 */
export function DataTableCardList({ children }: DataTableRenderPropsType.BodyProps): ReactElement {
	return <DataTableCardListTpl>{children}</DataTableCardListTpl>;
}

/**
 * Card-view `row` slot — composes {@link DataTableCardTpl}, mirroring the table
 * layout's `DataTableRow` (including the opt-in per-row overlay). Drag-and-drop and
 * row-expansion wiring are composed externally by the orchestrator.
 *
 * @experimental
 */
export function DataTableCard<RowType, ColumnType extends BaseColumnType<RowType>>({
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
	htmlAttributes,
	virtualStyle,
	onClick,
	onContextMenu,
	onMouseOver,
	forwardedRef,
	children
}: DataTableRenderPropsType.BodyRowProps<RowType, ColumnType>): ReactElement {
	const RowOverlaySlot = useDataTableContext<RowType, ColumnType>().slots?.rowOverlay;
	// Slot component identities are stable per `<DataTable>` instance (see the DataTableSlots contract),
	// so rendering the context-sourced slot here does not remount it between renders.
	// eslint-disable-next-line react-hooks/static-components -- stable slot identity per the slots contract
	const overlay = RowOverlaySlot ? <RowOverlaySlot row={row} rowIndex={rowIndex} /> : null;

	return (
		<DataTableCardTpl
			styles={styles}
			rowIndex={rowIndex}
			disabled={disabled}
			selected={selected}
			highlighted={highlighted}
			highlightVariant={highlightVariant}
			interactive={interactive}
			ariaExpanded={ariaExpanded ?? (hasAdditionalContent ? true : undefined)}
			htmlAttributes={htmlAttributes as HTMLAttributes<HTMLDivElement> | undefined}
			virtualStyle={virtualStyle}
			onClick={onClick}
			onContextMenu={onContextMenu}
			onMouseOver={onMouseOver}
			// The row slot's prop surface is shared by both layouts and typed for the
			// table's `<tr>`; card view hands the same ref channel a `<div>`. Only
			// `scrollToNode` and focus management consume it, and both work on any element.
			forwardedRef={forwardedRef as DataTableCardTplProps["forwardedRef"]}
		>
			{children}
			{overlay ? (
				<StyledDataTableCardOverlay data-role={DataRoles.Table.RowOverlay}>{overlay}</StyledDataTableCardOverlay>
			) : null}
		</DataTableCardTpl>
	);
}

/**
 * Card-view `cell` slot — composes {@link DataTableCardFieldTpl}.
 *
 * Note what is *not* resolved here, compared with the table layout's `DataTableCell`:
 * a card has no columns, so pinning, `colSpan`, the spanning-row `data-col-index`
 * and the cross-tabulation vertical-header dispatch all fall away, and with them the
 * branches that decided between them.
 *
 * @experimental
 */
export function DataTableCardField<RowType, ColumnType extends BaseColumnType<RowType>>({
	column,
	horizontalAlignment,
	cellStyles,
	subInfo,
	children
}: DataTableRenderPropsType.BodyCellProps<RowType, ColumnType>): ReactElement {
	const htmlAttributes = safeHtmlAttributes<HTMLDivElement>(
		column.htmlAttributes as HTMLAttributes<HTMLDivElement> | undefined
	);

	return (
		<DataTableCardFieldTpl
			cellLabel={column.label}
			horizontalAlignment={horizontalAlignment}
			subInfo={subInfo ?? !!column.subInfo}
			actionColumn={!!column.actionColumn}
			cellStyles={cellStyles}
			htmlAttributes={htmlAttributes}
		>
			{children}
		</DataTableCardFieldTpl>
	);
}

/**
 * Card-view `placeholderRow` slot — the empty-state card. `columnCount` is always
 * supplied on this path (the orchestrator renders the windowed loading placeholder
 * through {@link DataTableCardPlaceholderTpl} directly), so this always resolves to
 * the empty-state variant.
 *
 * @experimental
 */
export function DataTableCardPlaceholder({
	columnCount,
	children
}: DataTableRenderPropsType.PlaceHolderBodyRowProps): ReactElement {
	return <DataTableCardPlaceholderTpl columnCount={columnCount}>{children}</DataTableCardPlaceholderTpl>;
}

/**
 * Card-view `placeholderCell` slot — composes {@link DataTableCardPlaceholderFieldTpl}.
 *
 * @experimental
 */
export function DataTableCardPlaceholderField<RowType, ColumnType extends BaseColumnType<RowType>>({
	children
}: DataTableRenderPropsType.PlaceHolderBodyCellProps<RowType, ColumnType>): ReactElement {
	return <DataTableCardPlaceholderFieldTpl>{children}</DataTableCardPlaceholderFieldTpl>;
}

/**
 * Slot set for `cardView`: the card layout's structural primitives, replacing the
 * table layout's {@link DataTableDefaultSlots} wholesale rather than restyling it.
 * The orchestrator selects between the two sets in `useDataTableSlots`, and consumer
 * `slots` still merge over whichever is active.
 *
 * The head, filter and foot slots are inherited from the table defaults and never
 * rendered: card view draws no header (each card labels its own fields instead) and no
 * footer (matching the production `Table`), so the orchestrator builds neither element.
 *
 * Because the two sets are mutually exclusive, a consumer overriding a structural
 * slot must supply a card-shaped implementation for card view — a `cell` slot
 * rendering a `<td>` belongs to the table layout only.
 *
 * @experimental
 */
export const DataTableCardViewSlots: ResolvedDataTableSlots<any> = {
	...DataTableDefaultSlots,
	body: DataTableCardList,
	virtualizedBody: DataTableVirtualizedCardBody,
	infiniteScrollBody: DataTableInfiniteScrollCardBody,
	row: DataTableCard,
	cell: DataTableCardField,
	placeholderRow: DataTableCardPlaceholder,
	placeholderCell: DataTableCardPlaceholderField
};
