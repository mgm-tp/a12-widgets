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

import type { ComponentType, ReactNode } from "react";

import type { BaseColumnType } from "./foundation/column.api.js";
import type { DataTableRenderPropsType } from "./data-table-renderer.api.js";
import type { DataTableInfiniteScrollBodyProps } from "./data-table.infinite-scroll-body.view.js";
import type { DataTableVirtualizedBodyProps } from "./data-table.virtualized-body.view.js";

/**
 * Props received by each {@link DataTableSlots} component, one alias per slot.
 *
 * @experimental
 */
export namespace DataTableSlotProps {
	export type Head = Omit<DataTableRenderPropsType.HeadProps, "key">;
	export type HeadRow = Omit<DataTableRenderPropsType.HeadRowProps, "key">;
	export type HeadCell<RowType = unknown, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>> = Omit<
		DataTableRenderPropsType.HeadCellProps<RowType, ColumnType>,
		"key"
	>;
	export type HeadContent<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> = Omit<DataTableRenderPropsType.HeadContentProps<RowType, ColumnType>, "key">;
	export type FilterRow = Omit<DataTableRenderPropsType.HeadFilterRowProps, "key">;
	export type FilterCell<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> = Omit<DataTableRenderPropsType.HeadFilterCellProps<RowType, ColumnType>, "key">;
	export type FilterContent<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> = Omit<DataTableRenderPropsType.HeadFilterContentProps<RowType, ColumnType>, "key">;
	export type Body<RowType = unknown, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>> = Omit<
		DataTableRenderPropsType.BodyProps<RowType, ColumnType>,
		"key"
	>;
	export type VirtualizedBody = DataTableVirtualizedBodyProps;
	export type InfiniteScrollBody = DataTableInfiniteScrollBodyProps;
	export type Row<RowType = unknown, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>> = Omit<
		DataTableRenderPropsType.BodyRowProps<RowType, ColumnType>,
		"key"
	>;
	export type Cell<RowType = unknown, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>> = Omit<
		DataTableRenderPropsType.BodyCellProps<RowType, ColumnType>,
		"key"
	>;
	export type CellContent<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> = Omit<DataTableRenderPropsType.BodyContentProps<RowType, ColumnType>, "key">;
	export type PlaceholderRow = Omit<DataTableRenderPropsType.PlaceHolderBodyRowProps, "key">;
	export type PlaceholderCell<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> = Omit<DataTableRenderPropsType.PlaceHolderBodyCellProps<RowType, ColumnType>, "key">;
	export type PlaceholderContent<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> = Omit<DataTableRenderPropsType.PlaceHolderBodyContentProps<RowType, ColumnType>, "key">;
	export type Foot = Omit<DataTableRenderPropsType.FootProps, "key">;
	export type FootRow = Omit<DataTableRenderPropsType.FootRowProps, "key">;
	export type FootCell<RowType = unknown, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>> = Omit<
		DataTableRenderPropsType.FootCellProps<RowType, ColumnType>,
		"key"
	>;
	export type FootContent<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> = Omit<DataTableRenderPropsType.FootContentProps<RowType, ColumnType>, "key">;
	export type ContextMenu<RowType = unknown> = Omit<DataTableRenderPropsType.ContextMenuProps<RowType>, "key">;
	export type HeadContextMenu<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> = Omit<DataTableRenderPropsType.HeadContextMenuProps<RowType, ColumnType>, "key">;
	export type RowGroupHeader<RowType = unknown> = Omit<DataTableRenderPropsType.RowGroupHeaderProps<RowType>, "key">;
	export type DndRow<RowType = unknown, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>> = Omit<
		DataTableRenderPropsType.DndBodyRowProps<RowType, ColumnType>,
		"key"
	>;
	export type DragPreview = Omit<DataTableRenderPropsType.DragPreviewProps, "key">;
	export type RowOverlay<RowType = unknown> = Omit<DataTableRenderPropsType.RowOverlayProps<RowType>, "key">;
}

/**
 * Customization slots for {@link DataTable}'s structural elements.
 *
 * Each slot is a **component**, not a render function, so it can use hooks and
 * be memoized with `React.memo`. Container slots (`head`, `headRow`, `body`,
 * `row`, `foot`, `footRow`, `filterRow`) receive the pre-built, fully wired
 * subtree as `props.children`; either wrap `children` or compose the exported
 * `DataTable.*` primitives (`DataTable.Head`, `DataTable.Row`, …).
 *
 * To suppress a structural element, render nothing (`() => null`) or use the
 * dedicated structural props (e.g. `hideHeader`). An omitted slot always means
 * "use the default".
 *
 * IMPORTANT: slot component identities must be stable across renders (declare
 * at module scope or memoize). An inline `slots={{ row: (p) => … }}` recreates
 * the component type every render, remounting the subtree and losing focus and
 * state.
 *
 * @experimental
 */
export interface DataTableSlots<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
> {
	/** Custom `<thead>` element. Receives the pre-built header rows as `children`. */
	head?: ComponentType<DataTableSlotProps.Head>;

	/** Custom header `<tr>` element (flat, single-depth headers). Receives the pre-built header cells as `children`. */
	headRow?: ComponentType<DataTableSlotProps.HeadRow>;

	/** Custom header `<th>` element for leaf columns. */
	headCell?: ComponentType<DataTableSlotProps.HeadCell<RowType, ColumnType>>;

	/**
	 * Custom header `<th>` element for column-group (non-leaf) cells. When
	 * omitted, group cells route through {@link headCell} if that is provided,
	 * otherwise through the default group cell.
	 */
	headCellGroup?: ComponentType<DataTableSlotProps.HeadCell<RowType, ColumnType>>;

	/** Custom content for a header cell. Subordinate to {@link headCell}. */
	headContent?: ComponentType<DataTableSlotProps.HeadContent<RowType, ColumnType>>;

	/** Custom filter `<tr>` element. Providing any filter slot activates the filter row. */
	filterRow?: ComponentType<DataTableSlotProps.FilterRow>;

	/** Custom filter `<th>` element. Providing any filter slot activates the filter row. */
	filterCell?: ComponentType<DataTableSlotProps.FilterCell<RowType, ColumnType>>;

	/** Custom content for a filter cell. Providing any filter slot activates the filter row. */
	filterContent?: ComponentType<DataTableSlotProps.FilterContent<RowType, ColumnType>>;

	/** Custom `<tbody>` element. Receives the pre-built rows as `children`. */
	body?: ComponentType<DataTableSlotProps.Body<RowType, ColumnType>>;

	/** Escape hatch: replace the entire virtualized `<tbody>` implementation. */
	virtualizedBody?: ComponentType<DataTableSlotProps.VirtualizedBody>;

	/** Escape hatch: replace the entire infinite-scroll `<tbody>` implementation. */
	infiniteScrollBody?: ComponentType<DataTableSlotProps.InfiniteScrollBody>;

	/** Custom body `<tr>` element. Receives the pre-built cells as `children` plus fully resolved row state. */
	row?: ComponentType<DataTableSlotProps.Row<RowType, ColumnType>>;

	/** Custom body `<td>` element. */
	cell?: ComponentType<DataTableSlotProps.Cell<RowType, ColumnType>>;

	/** Custom content for a body cell. Subordinate to {@link cell} and to a column's `renderCell`. */
	cellContent?: ComponentType<DataTableSlotProps.CellContent<RowType, ColumnType>>;

	/** Custom placeholder row (empty state / virtual loading rows). */
	placeholderRow?: ComponentType<DataTableSlotProps.PlaceholderRow>;

	/** Custom placeholder `<td>`. Subordinate to {@link placeholderRow}. */
	placeholderCell?: ComponentType<DataTableSlotProps.PlaceholderCell<RowType, ColumnType>>;

	/** Custom placeholder cell content. Subordinate to {@link placeholderCell}. */
	placeholderContent?: ComponentType<DataTableSlotProps.PlaceholderContent<RowType, ColumnType>>;

	/** Custom `<tfoot>` element. Providing any foot slot activates the footer. */
	foot?: ComponentType<DataTableSlotProps.Foot>;

	/** Custom footer `<tr>` element. Providing any foot slot activates the footer. */
	footRow?: ComponentType<DataTableSlotProps.FootRow>;

	/** Custom footer `<td>` element. Providing any foot slot activates the footer. */
	footCell?: ComponentType<DataTableSlotProps.FootCell<RowType, ColumnType>>;

	/** Custom content for a footer cell. Providing any foot slot activates the footer. */
	footContent?: ComponentType<DataTableSlotProps.FootContent<RowType, ColumnType>>;

	/**
	 * Context-menu content for body rows. Providing this slot enables the
	 * right-click context menu on body rows (per-row opt-out via
	 * `rowStyling().disabledRightClickContextMenu`).
	 */
	contextMenu?: ComponentType<DataTableSlotProps.ContextMenu<RowType>>;

	/**
	 * Context-menu content for header cells. Providing this slot enables the
	 * right-click context menu on header cells.
	 */
	headContextMenu?: ComponentType<DataTableSlotProps.HeadContextMenu<RowType, ColumnType>>;

	/** Custom row-group header content, used by {@link DataTableRowsGroup}. */
	rowGroupHeader?: ComponentType<DataTableSlotProps.RowGroupHeader<RowType>>;

	/** Custom body row wrapper when drag-and-drop is enabled. */
	dndRow?: ComponentType<DataTableSlotProps.DndRow<RowType, ColumnType>>;

	/** Custom drag-preview element rendered in a fixed overlay while dragging. */
	dragPreview?: ComponentType<DataTableSlotProps.DragPreview>;

	/**
	 * Optional per-row overlay, painted as a layer covering a single body row
	 * (e.g. a busy/progress veil while that row's children lazy-load). Opt-in:
	 * omitting it renders no overlay and adds no per-row cost. Rendered by the
	 * default body-row renderer (and any row that composes `DataTable.Row`) as an
	 * absolutely-positioned cell spanning the row — return `null` from the
	 * component for rows that need no overlay.
	 */
	rowOverlay?: ComponentType<DataTableSlotProps.RowOverlay<RowType>>;
}

/**
 * Row-expansion configuration. Expansion is a **render prop** (not a slot) so
 * the table can tell whether a row is expanded, which drives `aria-expanded`
 * and whether an expansion `<tr>` is emitted.
 *
 * @experimental
 */
export interface DataTableRowExpansion<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
> {
	/**
	 * Renders the expansion content below a body row. Called for every row
	 * (unless {@link predicate} is given); return `null` for rows without
	 * expansion content. Compose `DataTableTemplate.ExpandableRow` (which spans
	 * all columns) for the canonical layout.
	 */
	render: (props: DataTableRenderPropsType.AdditionalContentProps<RowType, ColumnType>) => ReactNode;

	/**
	 * Optional fast-path predicate: when provided, {@link render} is only
	 * invoked for rows where this returns `true` — skipping the JSX allocation
	 * for the (typically vast) majority of non-expanded rows.
	 */
	predicate?: (args: { row: RowType; rowIndex: number }) => boolean;
}

/**
 * The fully resolved slot set: every structural slot is guaranteed (consumer
 * override or default), while opt-in slots (`contextMenu`, `headContextMenu`)
 * stay optional.
 *
 * @experimental
 */
export type ResolvedDataTableSlots<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
> = Required<Omit<DataTableSlots<RowType, ColumnType>, "contextMenu" | "headContextMenu" | "rowOverlay">> &
	Pick<DataTableSlots<RowType, ColumnType>, "contextMenu" | "headContextMenu" | "rowOverlay">;
