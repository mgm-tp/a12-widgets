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

import type { ComponentType, HTMLAttributes, MouseEvent, ReactElement, ReactNode } from "react";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useTheme } from "styled-components";

import { ArrowButton } from "../../../tree/main/tpl/tree-elements.tpl.js";
import { useTreeModel } from "../../../tree-view/main/model/index.js";
import type { FlatTreeRow } from "../../../tree-view/main/model/index.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { TableScrollToNodeHandler } from "../foundation/table-renderer.api.js";
import type { TableDragDropOptions } from "../foundation/table.api.js";
import { flattenAllColumns, isColumnGroup } from "../foundation/utils.js";
import type { DataTableCellRenderContext, DataTableColumn } from "../columns.js";
import type { DataTableProps, DataTableRowKeyGetter } from "../data-table.api.js";
import type { DataTableSlotProps, DataTableSlots } from "../data-table-slots.api.js";
import { DataTable } from "../data-table.view.js";
import { DataTableRow } from "../default-renderers.js";
import { rowKeyFor } from "../data-table.utils.js";

import { StyledTreeCell, StyledTreeIcon, StyledTreeLabel, StyledTreeToggle } from "./data-tree-table.styled.js";
import type { DataTreeTableExpandToggleContext, DataTreeTableProps } from "./data-tree-table.api.js";
import type { TreeDnDState } from "./data-tree-table.dnd.js";
import { createTreeDnDSlots, useTreeDnDMonitor } from "./data-tree-table.dnd.js";
import {
	createLoadMoreSentinel,
	isLoadMoreSentinel,
	loadMoreSentinelKey,
	TreeLoadMoreRow
} from "./data-tree-table.load-more.js";

interface TreeCellContentProps<RowType> {
	/** Resolved cell content for the tree column — the node label. */
	label: ReactNode;

	/** Resolved leading icon, rendered between the toggle slot and the label. */
	icon?: ReactNode;
	row: RowType;
	level: number;
	expandable: boolean;
	expanded: boolean;
	loading: boolean;
	indentSize: number;
	toggleSize: number;
	renderToggle?: (context: DataTreeTableExpandToggleContext<RowType>) => ReactNode;
	onToggle: () => void;
}

/**
 * Renders the tree column's cell: a depth indent, a fixed-width expand/collapse slot (the default
 * chevron, a consumer-supplied control, or empty space for a leaf) and the label.
 */
function TreeCellContentInner<RowType>(props: TreeCellContentProps<RowType>): ReactElement {
	const { label, icon, row, level, expandable, expanded, loading, indentSize, toggleSize, renderToggle, onToggle } =
		props;
	const theme = useTheme();
	const indent = theme.components.treeTable.node.spacingLeft + level * indentSize;

	const handleToggle = useCallback(
		(event?: MouseEvent<HTMLElement>) => {
			event?.stopPropagation();
			onToggle();
		},
		[onToggle]
	);

	let toggle: ReactNode = null;

	if (expandable) {
		toggle = renderToggle ? (
			renderToggle({ row, expanded, isLeaf: false, level, loading, toggle: onToggle })
		) : (
			<ArrowButton expanded={expanded} loading={loading} onToggleExpansion={handleToggle} />
		);
	}

	return (
		<StyledTreeCell $indent={indent} data-role={DataRoles.TreeTable.Cell} data-tree-level={level}>
			<StyledTreeToggle $size={toggleSize}>{toggle}</StyledTreeToggle>
			{icon != null && icon !== false && (
				<StyledTreeIcon data-role={DataRoles.TreeTable.Icon} aria-hidden="true">
					{icon}
				</StyledTreeIcon>
			)}
			<StyledTreeLabel>{label}</StyledTreeLabel>
		</StyledTreeCell>
	);
}

const TreeCellContent = memo(TreeCellContentInner) as typeof TreeCellContentInner;

/**
 * Hierarchical wrapper over {@link DataTable}. Flattens a nested `tree` (or a flat `data` +
 * `getParentId` adjacency list) into the rows {@link DataTable} renders, owns expand/collapse
 * (controlled or uncontrolled, with optional lazy loading), decorates one column with an indent +
 * chevron, and applies `treegrid` ARIA. The consumer's own row type flows straight through to columns,
 * `rowStyling`, `slots` etc. — there is no node envelope. See {@link DataTreeTableProps}.
 *
 * @experimental
 */
export function DataTreeTable<RowType = unknown>(props: DataTreeTableProps<RowType>): ReactElement {
	const {
		// Consumed here; not forwarded to DataTable.
		tree: _tree,
		getChildren: _getChildren,
		data: _data,
		getParentId: _getParentId,
		rowKey,
		isLeaf: _isLeaf,
		loadChildren: _loadChildren,
		getPagination: _getPagination,
		onLoadMore: _onLoadMore,
		onLoadAll: _onLoadAll,
		expandedKeys: _expandedKeys,
		onExpandedChange: _onExpandedChange,
		defaultExpandedKeys: _defaultExpandedKeys,
		defaultExpandAll: _defaultExpandAll,
		treeColumnKey,
		indentSize: indentSizeProp,
		getIcon,
		renderExpandToggle,
		renderLoadMore,
		loadMoreLabel,
		loadAllLabel,
		columns,
		slots,
		scrollToNode,
		dragDropOptions,
		rowStyling,
		cellStyling,
		rowEventHandlers,
		...tableProps
	} = props;

	const theme = useTheme();
	const indentSize = indentSizeProp ?? theme.components.tree.node.indentPaddingLeft;
	// The toggle slot width tracks the indent step so a child's chevron lines up within its parent's
	// indentation track, including when the consumer overrides `indentSize`.
	const toggleSize = indentSize;

	// `loadChildren` (widget-owned first-expand fetch) and `getPagination` (consumer-owned controlled
	// pagination) are different input modes; configuring both is a usage error. The model prefers
	// `loadChildren`; warn so the ignored `getPagination` is not mistaken for broken.
	if (process.env.NODE_ENV !== "production" && _loadChildren && _getPagination) {
		// eslint-disable-next-line no-console
		console.warn(
			"DataTreeTable: `loadChildren` and `getPagination` are mutually exclusive. `loadChildren` takes " +
				"precedence and `getPagination` is ignored. Provide only one."
		);
	}

	// `includeLoadMoreRows` makes the model emit a synthetic `"load-more"` row after each controlled-paginated
	// parent's loaded children; the wrapper renders those as grid-spanning rows (see below). Only controlled
	// pagination produces sentinels, so it is gated on `getPagination`.
	const model = useTreeModel({ ...props, includeLoadMoreRows: _getPagination !== undefined });
	const { rows, metaByRow, metaByKey, rowKeyOf, toggle, loadMore, loadAll } = model;

	// A flat data grid cannot render a model sentinel (its `row` is the parent, which would collide on
	// `rowKey`), so each `"load-more"` row becomes a branded placeholder object in `data`; `metaBySentinel`
	// recovers its flattened metadata for the row slot.
	const { data, metaBySentinel } = useMemo(() => {
		const sentinels = new Map<object, FlatTreeRow<RowType>>();
		const flat = rows.map((entry) => {
			if (entry.kind === "load-more") {
				// `parentKey` is `undefined` for a root-level sentinel (controlled pagination of the root).
				const sentinel = createLoadMoreSentinel(entry.parentKey);
				sentinels.set(sentinel, entry);

				return sentinel as unknown as RowType;
			}

			return entry.row;
		});

		return { data: flat, metaBySentinel: sentinels };
	}, [rows]);

	// Derive the row key from the consumer's `rowKey` for real rows, and from the synthetic sentinel key
	// for load-more placeholders — keeping every key unique even though a sentinel's parent is also a row.
	const treeRowKey = useCallback<DataTableRowKeyGetter<RowType>>(
		({ row, rowIndex }) => (isLoadMoreSentinel(row) ? loadMoreSentinelKey(row) : rowKeyFor(row, rowIndex ?? 0, rowKey)),
		[rowKey]
	);

	const dragDropEnabled = !!dragDropOptions;

	// Live DnD state handed to the slot component through a ref, refreshed each render so the pragmatic
	// adapters read current options/rows without re-binding.
	const dndStateRef = useRef<TreeDnDState<RowType>>({
		options: dragDropOptions ?? {},
		rows,
		metaByKey,
		rowKeyOf,
		indentPerLevel: indentSize,
		toggle
	});

	dndStateRef.current = {
		options: dragDropOptions ?? {},
		rows,
		metaByKey,
		rowKeyOf,
		indentPerLevel: indentSize,
		toggle
	};

	// Set true at this tree's drag start so the monitor resolves the drop only for the source tree,
	// surviving the source row unmounting under virtualization.
	const localDragRef = useRef(false);

	useTreeDnDMonitor<RowType>(dndStateRef, localDragRef, dragDropEnabled);

	const dndSlots = useMemo(
		() => (dragDropEnabled ? createTreeDnDSlots<RowType>(dndStateRef, localDragRef) : null),
		[dragDropEnabled]
	);

	// Resolve which *leaf* column hosts the tree affordances: the leaf whose `dataKey` matches
	// `treeColumnKey`, else the first leaf. Matched against the flattened leaves so a column nested in
	// a group can be targeted — only leaf columns own body cells, so the decoration must land on one.
	// `treeLeafIndex` (the leaf's position among all leaves) lets the load-more row span the columns
	// before the tree column so its affordance aligns to the tree column wherever it sits.
	const { treeLeafColumn, treeLeafIndex } = useMemo<{
		treeLeafColumn: DataTableColumn<RowType> | undefined;
		treeLeafIndex: number;
	}>(() => {
		const leaves = flattenAllColumns<RowType, DataTableColumn<RowType>>(columns);

		if (treeColumnKey === undefined) {
			return { treeLeafColumn: leaves[0], treeLeafIndex: 0 };
		}

		const matchIndex = leaves.findIndex((column) => String(column.dataKey) === String(treeColumnKey));
		const index = matchIndex >= 0 ? matchIndex : 0;

		return { treeLeafColumn: leaves[index], treeLeafIndex: index };
	}, [columns, treeColumnKey]);

	// The tree `renderCell` and the `row` slot read their inputs through a ref so the transformed columns
	// and the slot component keep a stable identity — changing expansion must not rebuild the header grid
	// or remount rows. The ref is refreshed during render; DataTable invokes them in the same pass.
	const treeStateRef = useRef({
		metaByRow,
		metaBySentinel,
		toggle,
		loadMore,
		loadAll,
		getIcon,
		renderExpandToggle,
		renderLoadMore,
		loadMoreLabel,
		loadAllLabel,
		indentSize,
		toggleSize,
		treeLeafIndex,
		consumerRow: slots?.row
	});

	treeStateRef.current = {
		metaByRow,
		metaBySentinel,
		toggle,
		loadMore,
		loadAll,
		getIcon,
		renderExpandToggle,
		renderLoadMore,
		loadMoreLabel,
		loadAllLabel,
		indentSize,
		toggleSize,
		treeLeafIndex,
		consumerRow: slots?.row
	};

	const treeColumns = useMemo<DataTableColumn<RowType>[]>(() => {
		if (!treeLeafColumn) {
			return columns;
		}

		const makeTreeRenderCell =
			(consumerRenderCell: DataTableColumn<RowType>["renderCell"]) =>
			(context: DataTableCellRenderContext<RowType>): ReactNode => {
				const { row, value } = context;

				// The whole row is replaced by the spanning load-more row in the `row` slot; emit nothing here.
				if (isLoadMoreSentinel(row)) {
					return null;
				}

				const state = treeStateRef.current;
				const meta = state.metaByRow.get(row);
				const label = consumerRenderCell ? consumerRenderCell(context) : value;

				if (!meta) {
					return label;
				}

				return (
					<TreeCellContent
						label={label}
						icon={state.getIcon?.(row)}
						row={row}
						level={meta.level}
						expandable={meta.expandable}
						expanded={meta.expanded}
						loading={meta.loading}
						indentSize={state.indentSize}
						toggleSize={state.toggleSize}
						renderToggle={state.renderExpandToggle}
						onToggle={(): void => state.toggle(meta.key, row)}
					/>
				);
			};

		// Short-circuit a leaf column's per-cell consumer logic for synthetic sentinel rows: their cells are
		// discarded (the `row` slot renders a spanning load-more row), and the consumer's `dataGetter` /
		// `renderCell` / `cellSpan` must never run against the fieldless placeholder.
		const guardLeaf = (column: DataTableColumn<RowType>): DataTableColumn<RowType> => {
			const guarded: DataTableColumn<RowType> = { ...column };

			if (column.dataGetter) {
				const original = column.dataGetter;
				guarded.dataGetter = (params): ReactNode => (isLoadMoreSentinel(params.row) ? "" : original(params));
			}

			if (column.renderCell) {
				const original = column.renderCell;
				guarded.renderCell = (context): ReactNode => (isLoadMoreSentinel(context.row) ? null : original(context));
			}

			if (column.cellSpan) {
				const original = column.cellSpan;
				guarded.cellSpan = (context) => (isLoadMoreSentinel(context.row) ? {} : original(context));
			}

			return guarded;
		};

		// Recurse into column groups so the tree leaf is decorated wherever it sits in the column tree.
		const decorate = (cols: DataTableColumn<RowType>[]): DataTableColumn<RowType>[] =>
			cols.map((column) => {
				if (isColumnGroup(column)) {
					return { ...column, subColumns: decorate(column.subColumns as DataTableColumn<RowType>[]) };
				}

				const guarded = guardLeaf(column);

				if (column === treeLeafColumn) {
					guarded.renderCell = makeTreeRenderCell(column.renderCell);
				}

				return guarded;
			});

		return decorate(columns);
	}, [columns, treeLeafColumn]);

	// Inject treegrid ARIA (`aria-level`/`aria-expanded`/`aria-setsize`/`aria-posinset`) onto each body
	// row via a stable `row` slot that composes any consumer-provided `row` slot, else `DataTable.Row`.
	const TreeRowSlot = useMemo<ComponentType<DataTableSlotProps.Row<RowType, DataTableColumn<RowType>>>>(() => {
		function DataTreeTableRow(rowProps: DataTableSlotProps.Row<RowType, DataTableColumn<RowType>>): ReactElement {
			const state = treeStateRef.current;

			// A synthetic "load more" row: replace the whole row with a grid-spanning load-more affordance.
			const sentinelMeta = state.metaBySentinel.get(rowProps.row as object);

			if (sentinelMeta) {
				const sentinelAttributes: HTMLAttributes<HTMLTableRowElement> = {
					...rowProps.htmlAttributes,
					"aria-level": sentinelMeta.level + 1,
					"aria-setsize": sentinelMeta.setsize,
					"aria-posinset": sentinelMeta.posinset
				};

				return (
					<TreeLoadMoreRow
						meta={sentinelMeta}
						indentSize={state.indentSize}
						toggleSize={state.toggleSize}
						treeLeafIndex={state.treeLeafIndex}
						loadMore={state.loadMore}
						loadAll={state.loadAll}
						renderLoadMore={state.renderLoadMore}
						loadMoreLabel={state.loadMoreLabel}
						loadAllLabel={state.loadAllLabel}
						htmlAttributes={sentinelAttributes}
						forwardedRef={rowProps.forwardedRef}
					/>
				);
			}

			const meta = state.metaByRow.get(rowProps.row);
			const RowImpl = (state.consumerRow ?? DataTableRow) as ComponentType<
				DataTableSlotProps.Row<RowType, DataTableColumn<RowType>>
			>;

			if (!meta) {
				return <RowImpl {...rowProps} />;
			}

			const htmlAttributes: HTMLAttributes<HTMLTableRowElement> = {
				...rowProps.htmlAttributes,
				"aria-level": meta.level + 1,
				"aria-setsize": meta.setsize,
				"aria-posinset": meta.posinset
			};

			return (
				<RowImpl
					{...rowProps}
					htmlAttributes={htmlAttributes}
					ariaExpanded={meta.expandable ? meta.expanded : undefined}
				/>
			);
		}

		return DataTreeTableRow;
	}, []);

	const mergedSlots = useMemo<DataTableSlots<RowType, DataTableColumn<RowType>>>(
		() => ({
			...slots,
			row: TreeRowSlot,
			...(dndSlots ? { dndRow: dndSlots.DndRow } : {})
		}),
		[slots, TreeRowSlot, dndSlots]
	);

	// Bridge the key-based `scrollToNode` onto the flat DataTable's row-index handle: capture the index
	// handler once, then resolve `rowKey → index` against the current rows at call time. A row hidden
	// inside a collapsed ancestor is absent from `data`, so the call is a no-op.
	const indexHandlerRef = useRef<TableScrollToNodeHandler | null>(null);
	const rowsRef = useRef(rows);

	rowsRef.current = rows;

	const captureIndexHandler = useCallback((handler: TableScrollToNodeHandler): void => {
		indexHandlerRef.current = handler;
	}, []);

	// Minimal options handed to the inner DataTable purely to enable its DnD machinery (drag monitor +
	// default row-snapshot preview). The real tree callbacks live in `dndStateRef`; only `acceptType`
	// must match so the monitor tracks this table's drags.
	const innerDragDropOptions = useMemo<TableDragDropOptions<RowType> | undefined>(
		() => (dragDropEnabled ? { acceptType: dragDropOptions?.acceptType } : undefined),
		[dragDropEnabled, dragDropOptions?.acceptType]
	);

	useEffect(() => {
		scrollToNode?.((nodeKey, options) => {
			const index = rowsRef.current.findIndex((entry) => entry.key === nodeKey);

			if (index >= 0) {
				indexHandlerRef.current?.(index, options);
			}
		});
	}, [scrollToNode]);

	// Sentinel rows borrow no consumer row/cell styling — they render the load-more affordance, not data.
	const treeRowStyling = useMemo<typeof rowStyling>(
		() => (rowStyling ? (params) => (isLoadMoreSentinel(params.row) ? {} : rowStyling(params)) : undefined),
		[rowStyling]
	);

	const treeCellStyling = useMemo<typeof cellStyling>(
		() => (cellStyling ? (params) => (isLoadMoreSentinel(params.row) ? {} : cellStyling(params)) : undefined),
		[cellStyling]
	);

	// Synthetic "load more" rows carry no consumer fields — never run the consumer's row event handlers
	// against the fieldless sentinel (it renders the load-more affordance, not data). Mirrors the
	// `treeRowStyling` / `treeCellStyling` guards and the per-leaf `dataGetter` / `renderCell` / `cellSpan`
	// guards in `guardLeaf`, so every consumer callback is shielded from the sentinel symmetrically.
	const treeRowEventHandlers = useMemo<typeof rowEventHandlers>(
		() => (rowEventHandlers ? (params) => (isLoadMoreSentinel(params.row) ? {} : rowEventHandlers(params)) : undefined),
		[rowEventHandlers]
	);

	return (
		<DataTable
			{...(tableProps as DataTableProps<RowType, DataTableColumn<RowType>>)}
			columns={treeColumns}
			data={data}
			rowKey={treeRowKey}
			rowStyling={treeRowStyling}
			cellStyling={treeCellStyling}
			rowEventHandlers={treeRowEventHandlers}
			gridRole="treegrid"
			slots={mergedSlots}
			scrollToNode={captureIndexHandler}
			dragDropOptions={innerDragDropOptions}
		/>
	);
}

DataTreeTable.displayName = "DataTreeTable";
