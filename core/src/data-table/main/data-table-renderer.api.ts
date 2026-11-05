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

import type { CSSProperties, HTMLAttributes, Key, MouseEventHandler, ReactNode, Ref, RefCallback } from "react";

import type { Container, Identifiable, Styleable } from "../../common/main/base-props.js";

import type { DataTableSortOrder } from "./data-table.sort.js";
import type { BaseColumnType } from "./foundation/column.api.js";
import type { TableRenderPropsType } from "./foundation/table-renderer.api.js";
import type { RowsGroup } from "./foundation/table-row-group.api.js";
import type { CellStyles as TableCellStyles } from "./foundation/table.api.js";

/**
 * Props passed to DataTable's structural slots. Each interface is self-contained
 * — it declares exactly the fields the DataTable templates produce and consume,
 * so slot implementors never receive props that silently do nothing.
 */
export namespace DataTableRenderPropsType {
	export interface BaseProps extends Identifiable, Styleable {
		key?: Key;
	}

	export interface HeadProps extends BaseProps {
		/** The pre-built header rows (and filter row). */
		children?: ReactNode;
	}

	export interface HeadRowProps extends BaseProps {
		/** The pre-built header cells. */
		children?: ReactNode;
	}

	export interface HeadCellProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		column: ColumnType;

		/**
		 * Leaf column index for leaf cells; for group cells, the leftmost leaf
		 * index covered by the group (matches `leafFrom`).
		 */
		columnIndex: number;
		sortOrder: DataTableSortOrder;
		ariaSort?: "ascending" | "descending" | "none";
		defaultContent: ReactNode;

		/**
		 * Native `colSpan` for the rendered `<th>`. Number of leaf columns a group
		 * cell covers; `undefined` (→ 1) for leaf cells.
		 */
		colSpan?: number;

		/**
		 * Native `rowSpan` for the rendered `<th>`. Number of header rows a leaf
		 * cell fills in a multi-row header; `undefined` (→ 1) otherwise.
		 */
		rowSpan?: number;

		/**
		 * `"col"` for leaf header cells, `"colgroup"` for group cells.
		 */
		scope?: "col" | "colgroup";

		/**
		 * `true` when this cell is a leaf column header. `false` for group
		 * (parent) header cells produced by `column.subColumns`.
		 */
		isLeaf?: boolean;

		/**
		 * Pinning side resolved for this header cell from the leaf column's
		 * pinning. `"left"` / `"right"` enables sticky positioning; `undefined`
		 * means the cell is in the normal scroll flow.
		 */
		pinning?: "left" | "right";

		/**
		 * Resolved horizontal text alignment.
		 */
		horizontalAlignment?: "left" | "center" | "right";

		/**
		 * Resolved vertical text alignment.
		 */
		verticalAlignment?: "top" | "middle" | "bottom";

		children?: ReactNode;
	}

	export interface HeadContentProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		column: ColumnType;
		columnIndex: number;
		sortOrder: DataTableSortOrder;
		defaultContent: ReactNode;
	}

	export interface HeadFilterRowProps extends BaseProps {
		/** The pre-built filter cells. */
		children?: ReactNode;
	}

	export interface HeadFilterCellProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		column: ColumnType;
		columnIndex: number;

		/**
		 * Pinning side resolved for this filter cell from the leaf column.
		 */
		pinning?: "left" | "right";
		children?: ReactNode;
	}

	export interface HeadFilterContentProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		column: ColumnType;
		columnIndex: number;
	}

	export interface BodyProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		data: RowType[];
		columns: ColumnType[];
		children?: ReactNode;
	}

	/**
	 * Resolved cell-styling result from `cellStyling({ row, rowIndex, column })`.
	 */
	export type CellStyles = TableCellStyles;

	/**
	 * Resolved row-styling result forwarded to body-row renderers: the visual bits
	 * applied to the `<tr>` (`className`, inline `style`, `title`). Selection /
	 * interactivity / disabled flags travel as siblings on {@link BodyRowProps}.
	 */
	export interface RowStyleResult {
		/** Optional class name forwarded to the `<tr>`. */
		className?: string;

		/** Optional inline style forwarded to the `<tr>`. */
		style?: CSSProperties;

		/** Optional `title` attribute (browser-native tooltip). */
		title?: string;
	}

	export interface BodyRowProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		row: RowType;
		rowIndex: number;
		columns: ColumnType[];

		/**
		 * Resolved row-styling result for this row, evaluated from
		 * `rowStyling({ row, rowIndex })`.
		 */
		styles?: RowStyleResult;

		/**
		 * Whether the row is selected.
		 */
		selected?: boolean;

		/**
		 * Whether the row is highlighted.
		 */
		highlighted?: boolean;

		/**
		 * Variant highlight of this row, from `rowStyling().highlightVariant`.
		 */
		highlightVariant?: "success" | "info";

		/**
		 * Whether the row is interactive (renders as clickable).
		 */
		interactive?: boolean;

		/**
		 * Whether the row is disabled.
		 */
		disabled?: boolean;

		/**
		 * Whether this row has expanded additional content following it (as a
		 * sibling `<tr>` produced by `rowExpansion.render`). Drives
		 * `aria-expanded` on the body row.
		 */
		hasAdditionalContent?: boolean;

		/**
		 * Value for `aria-expanded` on the row. Only set when the table has a
		 * `rowExpansion`; `false` then means "expandable API present, this row not
		 * expanded" — distinct from {@link hasAdditionalContent}.
		 */
		ariaExpanded?: boolean;

		/**
		 * Explicit `aria-rowindex`, set only in windowed (virtualized/infinite)
		 * modes where native `<table>` row numbering can't convey position.
		 */
		ariaRowIndex?: number;

		/**
		 * Additional HTML attributes spread onto the row `<tr>`. Lets a wrapper inject extra ARIA (e.g.
		 * `aria-level` / `aria-setsize` / `aria-posinset` for a `treegrid`) without a bespoke row slot.
		 */
		htmlAttributes?: HTMLAttributes<HTMLTableRowElement>;

		/**
		 * Inline style contributed by a custom windowed body implementation.
		 */
		virtualStyle?: CSSProperties;

		/** Row click handler resolved from `rowEventHandlers`. */
		onClick?: MouseEventHandler<HTMLElement>;

		/** Row context-menu handler (present when the `contextMenu` slot is enabled). */
		onContextMenu?: MouseEventHandler<HTMLElement>;

		/**
		 * Mouse-over handler forwarded by the DnD row wrapper — suppresses dragging
		 * while the cursor is over an interactive child. Present only under DnD.
		 */
		onMouseOver?: MouseEventHandler<HTMLElement>;

		/**
		 * Ref to the `<tr>` element. Custom renderers must forward it to their root
		 * `<tr>`, as `scrollToNode` and focus management depend on it.
		 */
		forwardedRef?: Ref<HTMLTableRowElement>;
		children?: ReactNode;
	}

	export interface BodyCellProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		row: RowType;
		rowIndex: number;
		column: ColumnType;
		columnIndex: number;
		defaultContent: ReactNode;

		/**
		 * Pinning side resolved for this body cell from the leaf column's pinning.
		 */
		pinning?: "left" | "right";

		/**
		 * Horizontal span resolved from the column's `cellSpan` hook, clamped to the
		 * remaining leaf columns and to a single pinning side. Omitted for the common
		 * `colSpan === 1` case; applied to the rendered `<td>`. The covered leaf
		 * columns emit no cell.
		 */
		colSpan?: number;

		/**
		 * Whether this cell's row contains at least one spanning (`colSpan > 1`)
		 * cell. When `true`, the default cell renderer emits a `data-col-index`
		 * attribute carrying the true leaf-column index, since the cell's native DOM
		 * position no longer equals its leaf index once a preceding cell merges.
		 */
		rowHasColSpan?: boolean;

		/**
		 * Resolved horizontal text alignment.
		 */
		horizontalAlignment?: "left" | "center" | "right";

		/**
		 * Resolved vertical text alignment.
		 */
		verticalAlignment?: "top" | "middle" | "bottom";

		/**
		 * Resolved cell-styling result from `cellStyling({ row, rowIndex, column })`.
		 */
		cellStyles?: CellStyles;

		/**
		 * Whether this cell belongs to a sub-info column (alternate background).
		 * Combines `column.subInfo` with the `cellStyles.useSecondaryColor` flag.
		 */
		subInfo?: boolean;

		/**
		 * Whether this cell's row is disabled.
		 */
		rowDisabled?: boolean;

		/**
		 * Variant highlight of this cell's row, from `rowStyling().highlightVariant`.
		 */
		rowHighlightVariant?: "success" | "info";
		children?: ReactNode;
	}

	export interface BodyContentProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		row: RowType;
		rowIndex: number;
		column: ColumnType;
		columnIndex: number;
		defaultContent: ReactNode;
	}

	export interface PlaceHolderBodyRowProps extends BaseProps {
		rowIndex: number;
		columnCount: number;
		children?: ReactNode;
	}

	export interface PlaceHolderBodyCellProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		rowIndex: number;
		column: ColumnType;
		columnIndex: number;
		children?: ReactNode;
	}

	export interface PlaceHolderBodyContentProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		rowIndex: number;
		column: ColumnType;
		columnIndex: number;
	}

	export interface FootProps extends BaseProps {
		/** The pre-built footer row. */
		children?: ReactNode;
	}

	export interface FootRowProps extends BaseProps {
		/** The pre-built footer cells. */
		children?: ReactNode;
	}

	export interface FootCellProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		column: ColumnType;
		columnIndex: number;

		/**
		 * Pinning side resolved for this footer cell from the leaf column's pinning.
		 */
		pinning?: "left" | "right";
		children?: ReactNode;
	}

	export interface FootContentProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		column: ColumnType;
		columnIndex: number;
	}

	/**
	 * Props passed to the body context menu renderer.
	 */
	export interface ContextMenuProps<RowType = unknown> {
		row: RowType;
		rowIndex: number;
		closeHandler: () => void;
	}

	/**
	 * Props passed to the head context menu renderer.
	 */
	export interface HeadContextMenuProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> {
		column: ColumnType;
		columnIndex: number;
		closeHandler: () => void;
	}

	/**
	 * Props passed to the additional-content renderer for expandable rows
	 * (`rowExpansion.render`).
	 */
	export interface AdditionalContentProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		row: RowType;
		rowIndex: number;
		columns: ColumnType[];
	}

	/**
	 * Props passed to the row-group header renderer. Exposes the full
	 * `RowsGroup` and group-level metadata rather than a `row`/`rowIndex` pair.
	 */
	export interface RowGroupHeaderProps<RowType = unknown> extends BaseProps {
		group: RowsGroup<RowType>;
		groupIndex: number;
		collapsed: boolean;
		defaultContent: ReactNode;
		children?: ReactNode;
	}

	/**
	 * Object describing the dragged row.
	 */
	export type DragObject<RowType = unknown> = TableRenderPropsType.DragObject<RowType>;

	/**
	 * Snapshot of the drag currently in progress. Present for any compatible drag
	 * (matching `acceptType`), including drags that started in another DataTable.
	 */
	export interface ActiveDrag<RowType = unknown> {
		/** The dragged row payload, as captured at drag start (includes the preview snapshot). */
		item: TableRenderPropsType.DragObject<RowType>;

		/**
		 * Viewport-relative top-left corner of the dragged `<tr>` at drag start.
		 * Anchors the floating drag preview.
		 */
		initialSourceClientOffset: { x: number; y: number };

		/**
		 * `true` when the drag started on a row of this DataTable instance. The
		 * drag preview only renders in the source table; drop targets open for
		 * any compatible drag.
		 */
		isLocalSource: boolean;
	}

	/**
	 * Object describing the hovered drop target row.
	 */
	export type HoveredObject<RowType = unknown> = TableRenderPropsType.HoveredObject<RowType>;

	/**
	 * Object returned by a completed drop operation.
	 */
	export type DropResult<RowType = unknown> = TableRenderPropsType.DropResult<RowType>;

	/**
	 * A single entry in the {@link DndRowRegistry}: the row datum plus its mounted
	 * `<tr>` element.
	 *
	 * Deliberately *not* tagged internal: {@link DataTableContextType.dndRowRegistry}
	 * is part of the public context, and `stripInternal` (inherited from the shared
	 * devtools tsconfig) would drop this declaration from the emitted `.d.ts` while
	 * leaving that field referencing it — breaking the published types.
	 *
	 * @experimental
	 */
	export interface DndRowEntry<RowType = unknown> {
		/** The row datum — used to build `canDrop` / drop-result payloads. */
		row: RowType;

		/** The mounted `<tr>` the shift engine writes transforms to. */
		element: HTMLTableRowElement;
	}

	/**
	 * Live registry of a DataTable's mounted body rows, keyed by data row index.
	 * Populated by the default DnD body-row wrapper and read by the drag monitor's
	 * row-shift engine, which iterates it to open the projected drop gap and to
	 * hit-test the release pointer against the rows' logical (untransformed) rects.
	 * Only rows currently in the DOM appear — under virtualization off-window rows
	 * are absent, exactly like the set the engine may shift.
	 *
	 * Deliberately not tagged internal — see {@link DndRowEntry}.
	 *
	 * @experimental
	 */
	export type DndRowRegistry<RowType = unknown> = Map<number, DndRowEntry<RowType>>;

	/**
	 * Args passed to the render-prop {@link DndBodyRowProps.children}. The render
	 * function must apply `dragRef` to the `<tr>` element and forward `onMouseOver`
	 * so drag-and-drop can fire on the row.
	 */
	export interface DndBodyRowRenderArgs {
		/** Ref callback that attaches the drag connector to the row `<tr>`. */
		dragRef: RefCallback<HTMLTableRowElement | null>;

		/**
		 * Mouse-over handler that suppresses dragging when the cursor is over an
		 * interactive child (button, input). Forward as-is to the `<tr>`.
		 */
		onMouseOver: MouseEventHandler<HTMLElement>;
	}

	/**
	 * Props for the DnD-aware body row wrapper.
	 */
	export interface DndBodyRowProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends Omit<BodyRowProps<RowType, ColumnType>, "children"> {
		canDrag?: boolean;

		/**
		 * Render-prop that produces the row content with the DnD connectors
		 * applied. Called with {@link DndBodyRowRenderArgs}; the caller must attach
		 * `dragRef` to the `<tr>` and forward `onMouseOver`.
		 */
		children: (args: DndBodyRowRenderArgs) => ReactNode;
	}

	/**
	 * Props for the drag source element wrapping row content.
	 */
	export interface DragSourceProps<RowType = unknown> extends Container, Styleable, Identifiable {
		rowIndex: number;
		row: RowType;
		canDrag?: boolean;
	}

	/**
	 * Props for the drop target element between rows. `rowIndex` is the insertion
	 * index the target represents (`0…rowCount`).
	 */
	export interface DropTargetProps<RowType = unknown> extends Container, Styleable, Identifiable {
		rowIndex: number;
		row: RowType;
	}

	/**
	 * Props for the drag preview overlay.
	 */
	export interface DragPreviewProps<RowType = unknown> extends Container, Identifiable, Styleable {
		/**
		 * Snapshot of the drag in progress: the dragged item and the on-screen origin
		 * the preview is anchored to. Passed as a prop rather than read from
		 * {@link DataTableContextType} on purpose — the preview is the only consumer of
		 * this per-gesture value, and the shared context must stay identity-stable
		 * across an interaction (it has no per-field re-render bailout, so a change
		 * there re-renders every cell in the table).
		 */
		activeDrag: ActiveDrag<RowType>;
	}

	/**
	 * Props for the per-row overlay slot — a layer painted over a single body row
	 * (e.g. a busy/progress veil while that row's children lazy-load). Receives the
	 * row data and its index so the overlay can decide whether (and what) to render.
	 */
	export interface RowOverlayProps<RowType = unknown> {
		/** The row this overlay is painted over. */
		row: RowType;

		/** Zero-based index of the row in the current `data`. */
		rowIndex: number;
	}
}
