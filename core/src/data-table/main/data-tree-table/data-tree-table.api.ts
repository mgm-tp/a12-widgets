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

import type { Key, ReactNode } from "react";

import type { DataTableColumn } from "../columns.js";
import type { BaseDataTableProps, DataTableRowKeyGetter } from "../data-table.api.js";

/**
 * Where a dragged node lands relative to the hovered node during a {@link DataTreeTable} drag.
 *
 * - `"before"` — insert the dragged node as a sibling immediately **before** the target.
 * - `"after"` — insert the dragged node as a sibling immediately **after** the target.
 * - `"inside"` — reparent the dragged node **into** the target (becomes its first/last child).
 */
export type DataTreeTableDropPosition = "before" | "after" | "inside";

/**
 * Context handed to {@link DataTreeTableProps.renderExpandToggle} for a single tree row. Call
 * {@link toggle} to flip the row's expansion (honouring controlled/uncontrolled state and lazy
 * loading) exactly as the built-in chevron would.
 */
export interface DataTreeTableExpandToggleContext<RowType = unknown> {
	/** The row this toggle belongs to. */
	row: RowType;

	/** Whether the row is currently expanded. Always `false` for a leaf. */
	expanded: boolean;

	/** Whether the row has no (and cannot load any) children. */
	isLeaf: boolean;

	/** Depth of the row; `0` for a top-level row. */
	level: number;

	/** Whether the row's children are currently being loaded via {@link DataTreeTableProps.loadChildren}. */
	loading: boolean;

	/** Toggles this row's expansion. No-op for a leaf. */
	toggle(): void;
}

/**
 * Drag-and-drop reparenting options for {@link DataTreeTable}. Opt in by passing this prop; rows then
 * become drag sources and tree-aware drop targets. The wrapper owns the drop geometry and the
 * self/descendant cycle guard — {@link onDrop} only reports the resolved move; the consumer mutates
 * their own tree in response.
 */
export interface DataTreeTableDragDrop<RowType = unknown> {
	/** Whether a given row may be dragged. Defaults to `true`. */
	canDrag?(params: { row: RowType }): boolean;

	/**
	 * Whether `source` may be dropped onto `target` at `position`. Defaults to forbidding a drop onto
	 * the dragged node itself or into its own subtree (which would create a cycle). When provided, the
	 * cycle guard is the consumer's responsibility.
	 */
	canDrop?(params: { source: RowType; target: RowType; position: DataTreeTableDropPosition }): boolean;

	/** Fired on a completed, permitted drop. Mutate your own tree here. */
	onDrop?(params: { source: RowType; target: RowType; position: DataTreeTableDropPosition }): void;

	/** Fired once when a drag begins, with the dragged `row`. For drag-start side effects (e.g. highlighting). */
	onDragStart?(params: { row: RowType }): void;

	/**
	 * Fired once when a drag finishes — on drop, cancel, or escape — with the dragged `row`. The
	 * counterpart to {@link onDragStart} for cleanup; fires even when the drag lands on no target (unlike
	 * {@link onDrop}).
	 */
	onDragEnd?(params: { row: RowType }): void;

	/**
	 * Fired when the drag moves onto a new row, with the dragged `source` and the hovered `target`. Useful
	 * for drag-hover highlighting the consumer drives in its own store. Distinct from the built-in drop
	 * indicator, which the wrapper paints regardless.
	 */
	onDragEnter?(params: { source: RowType; target: RowType }): void;

	/**
	 * Auto-expand a collapsed, expandable row when the drag hovers over it, so a node can be dropped into a
	 * currently-collapsed subtree. Pass `true` for the default ~600 ms hover delay, or `{ delay }` to tune
	 * it. Off by default. Never expands the dragged row itself.
	 */
	autoExpand?: boolean | { delay?: number };

	/**
	 * The drag kind. Two tables sharing an `acceptType` accept each other's rows. Defaults to the
	 * shared table default.
	 */
	acceptType?: string;
}

/**
 * Node-key-based scroll handle handed to the {@link DataTreeTableProps.scrollToNode} callback. Scrolls
 * the row for `rowKey` into view; with `autoFocus`, moves focus to it after scrolling. A row hidden
 * inside a collapsed ancestor is not rendered, so the call is a no-op.
 */
export type DataTreeTableScrollToNodeHandler = (rowKey: Key, options?: { autoFocus?: boolean }) => void;

/**
 * Controlled pagination state for one parent in the flat-adjacency model — or for the implicit root when
 * `parentId` is `undefined`. Lets a consumer that owns its own data (and loading) drive the built-in
 * "load more" affordance without surrendering tree state to {@link DataTreeTableProps.loadChildren}.
 *
 * Mutually exclusive with {@link DataTreeTableProps.loadChildren} (which manages this state internally).
 */
export interface DataTreePaginationState {
	/** More children exist on the source than are currently present in {@link DataTreeTableProps.data}. */
	hasMore: boolean;

	/** A page (or "load all") is currently loading for this parent — disables the affordance and shows busy. */
	loading?: boolean;

	/** Total children available, if known — labels the "load all N" action. */
	total?: number;
}

/**
 * Props for {@link DataTreeTable} — a hierarchical wrapper over {@link DataTable}.
 *
 * The consumer's own row type flows straight through: columns (`dataKey`/`dataGetter`/`renderCell`),
 * `rowStyling`, `cellStyling`, `slots`, sorting, resizing, virtualization etc. all operate on
 * `RowType` directly (no node envelope). The wrapper flattens the hierarchy into the rows
 * {@link DataTable} renders, owns expand/collapse, decorates one column with an indent + chevron, and
 * applies `treegrid` ARIA.
 *
 * Provide the hierarchy either as a nested {@link tree} (read via {@link getChildren}) or as a flat
 * {@link data} list plus {@link getParentId}. A stable {@link rowKey} is required.
 *
 * @experimental
 */
export interface DataTreeTableProps<RowType = unknown> extends Omit<
	BaseDataTableProps<RowType, DataTableColumn<RowType>>,
	"data" | "columns" | "rowKey" | "dragDropOptions" | "scrollToNode" | "gridRole" | "rowExpansion"
> {
	/**
	 * Nested hierarchy: the top-level rows, each exposing its children via {@link getChildren}.
	 * Mutually exclusive with {@link data} + {@link getParentId}.
	 */
	tree?: RowType[];

	/**
	 * Reads a row's children. Defaults to `row => row.children`. Return `undefined` (or an empty array)
	 * for a leaf. Only used with {@link tree}.
	 */
	getChildren?: (row: RowType) => RowType[] | undefined;

	/**
	 * Flat hierarchy (adjacency list): every row, with its parent addressed by {@link getParentId}.
	 * Rows whose parent key is missing/unknown become top-level. Mutually exclusive with {@link tree}.
	 */
	data?: RowType[];

	/** Reads a row's parent key. Required when using {@link data}; return `undefined` for a root. */
	getParentId?: (row: RowType) => Key | undefined;

	/** Column definitions, operating directly on `RowType`. */
	columns: DataTableColumn<RowType>[];

	/** Stable, unique row key. Required — reorder/reparent and expansion state depend on it. */
	rowKey: keyof RowType | DataTableRowKeyGetter<RowType>;

	/** Initially-expanded keys (uncontrolled). Ignored when {@link expandedKeys} is provided. */
	defaultExpandedKeys?: Iterable<Key>;

	/** Expand every expandable row initially (uncontrolled). Ignored when {@link expandedKeys} is provided. */
	defaultExpandAll?: boolean;

	/** Controlled expanded keys. When provided, the wrapper never mutates expansion on its own. */
	expandedKeys?: ReadonlySet<Key>;

	/** Fired whenever a row is expanded or collapsed. Required to drive controlled {@link expandedKeys}. */
	onExpandedChange?: (expandedKeys: Set<Key>, meta: { key: Key; expanded: boolean; row: RowType }) => void;

	/**
	 * Lazily loads a row's children the first time it is expanded. The resolved children are held
	 * internally (overlaying {@link getChildren}); the row shows a loading state until they arrive.
	 *
	 * @experimental
	 */
	loadChildren?: (row: RowType) => Promise<RowType[]>;

	/**
	 * Controlled pagination (flat-adjacency mode): returns the pagination state for the children of
	 * `parentId` (or the implicit root when `parentId` is `undefined`). Return `undefined` for a
	 * fully-loaded parent. When `hasMore` is `true`, the table renders the standard grid-spanning
	 * "load more" row after that parent's currently-loaded children, wired to {@link onLoadMore} /
	 * {@link onLoadAll}.
	 *
	 * For consumers that own their own tree state (loaded pages, in-flight flags) and feed the table a
	 * controlled {@link data} snapshot — drive the built-in affordance while keeping their store as the
	 * single source of truth. Mutually exclusive with {@link loadChildren} (which manages its own input mode).
	 */
	getPagination?: (parentId: Key | undefined) => DataTreePaginationState | undefined;

	/** Load the next page for `parentId` (root when `undefined`). Required to make {@link getPagination} actionable. */
	onLoadMore?: (meta: { parentId: Key | undefined }) => void;

	/** Drain all remaining pages for `parentId` (root when `undefined`). Falls back to {@link onLoadMore} if omitted. */
	onLoadAll?: (meta: { parentId: Key | undefined }) => void;

	/**
	 * Marks a row as a definite leaf, suppressing its chevron without consulting {@link getChildren}
	 * or {@link loadChildren}. Useful with lazy loading to know which rows can never expand.
	 */
	isLeaf?: (row: RowType) => boolean;

	/**
	 * Which column hosts the indentation + expand/collapse chevron, matched against the column's
	 * `dataKey`. Defaults to the first leaf column.
	 */
	treeColumnKey?: keyof RowType | (string & {});

	/** Indentation in pixels per depth level. Defaults to the theme's tree indentation. */
	indentSize?: number;

	/**
	 * Reads a row's leading icon, rendered in the tree column between the expand/collapse chevron and the
	 * cell content. A convenience for the common "folder/file" tree look without hand-assembling the icon
	 * in the tree column's `renderCell`. The icon is presentational (`aria-hidden`); keep meaning in the
	 * label. Return `undefined` for no icon.
	 */
	getIcon?: (row: RowType) => ReactNode;

	/** Renders a custom expand/collapse control in place of the default chevron. */
	renderExpandToggle?: (context: DataTreeTableExpandToggleContext<RowType>) => ReactNode;

	/**
	 * Renders the "load more" affordance shown in the row trailing a {@link getPagination}-paginated parent's
	 * loaded children. Receives the parent `row` (`undefined` for the implicit root), whether a page is
	 * currently loading, bound `loadMore` (next page) and `loadAll` (drain all remaining pages) callbacks,
	 * and the `total` child count if known. Defaults to "load more" + "load all N" links labelled from
	 * {@link loadMoreLabel} / {@link loadAllLabel}.
	 */
	renderLoadMore?: (params: {
		row: RowType | undefined;
		loading: boolean;
		loadMore: () => void;
		loadAll: () => void;
		total?: number;
	}) => ReactNode;

	/**
	 * Text of the default "load next page" link in the {@link getPagination}-paginated load-more row.
	 * Defaults to `"Load more"`. Ignored when {@link renderLoadMore} is supplied. Pass a localized string
	 * to translate the affordance.
	 */
	loadMoreLabel?: string;

	/**
	 * Text of the default "drain all remaining pages" link in the {@link getPagination}-paginated load-more
	 * row; the total child count is appended when known (e.g. `"Load all 42"`). Defaults to `"Load all"`.
	 * Ignored when {@link renderLoadMore} is supplied. Pass a localized string to translate the affordance.
	 */
	loadAllLabel?: string;

	/** Drag-and-drop reparenting. Opt in to make rows draggable; see {@link DataTreeTableDragDrop}. */
	dragDropOptions?: DataTreeTableDragDrop<RowType>;

	/**
	 * Programmatic scroll-to-node handle, addressed by {@link rowKey}. Unlike {@link DataTable}'s
	 * row-index `scrollToNode`, this resolves the row index from the key at call time.
	 */
	scrollToNode?(handler: DataTreeTableScrollToNodeHandler): void;
}
