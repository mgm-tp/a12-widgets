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

/**
 * Widget-neutral headless tree model. Owns expand/collapse (controlled or uncontrolled) and lazy child
 * loading, and flattens the nested/flat input into the ordered visible rows plus lookup maps. Shared by
 * {@link TreeView} and the `DataTreeTable` wrapper over `DataTable` — neither widget type leaks in here,
 * so this module must never import from `data-table/` (would create a `tree-view → data-table` cycle).
 * @module
 */

import type { Key } from "react";
import { useCallback, useMemo, useRef, useState } from "react";

import type { FlatTreeRow } from "./tree-model.utils.js";
import { collectExpandableKeys, flattenTree } from "./tree-model.utils.js";

/** Stable empty has-more/loading-more set returned outside controlled pagination (lazy mode never paginates). */
const EMPTY_KEYS: ReadonlySet<Key> = new Set<Key>();

/** Stable empty per-key totals map returned outside controlled pagination. */
const EMPTY_TOTALS: ReadonlyMap<Key, number> = new Map<Key, number>();

/**
 * Resolves a row's stable key from a getter. Structurally identical to `DataTable`'s `RowKeyGetter`, so
 * a `DataTreeTableProps` object is assignable to {@link TreeModelOptions} without importing from
 * `data-table/`.
 *
 * @internal
 */
export type RowKeyResolver<RowType> = (params: { row: RowType; rowIndex?: number }) => Key;

/**
 * Controlled pagination state for one parent's children — or the implicit root. Structurally identical to
 * `DataTreeTable`'s public `DataTreePaginationState`, so a `DataTreeTableProps` object stays assignable to
 * {@link TreeModelOptions} without this module importing from `data-table/` (which would create a cycle).
 *
 * @internal
 */
export interface TreePaginationState {
	/** More children exist on the source than are currently present in the controlled data. */
	hasMore: boolean;

	/** A page (or "load all") is currently loading for this parent. */
	loading?: boolean;

	/** Total children available, if known. */
	total?: number;
}

/**
 * Input to {@link useTreeModel}. Describes the hierarchy (nested `tree` + `getChildren`, or flat `data` +
 * `getParentId`), the stable `rowKey`, and the expansion/lazy-load options. `DataTreeTableProps` is a
 * structural superset, so it can be passed directly.
 *
 * @internal
 */
export interface TreeModelOptions<RowType> {
	/** Nested hierarchy: top-level rows, each exposing its children via `getChildren`. */
	tree?: RowType[];

	/** Reads a row's children. Defaults to `row => row.children`. Only used with {@link tree}. */
	getChildren?: (row: RowType) => RowType[] | undefined;

	/** Flat hierarchy (adjacency list): every row, with its parent addressed by {@link getParentId}. */
	data?: RowType[];

	/** Reads a row's parent key. Required when using {@link data}; return `undefined` for a root. */
	getParentId?: (row: RowType) => Key | undefined;

	/** Stable, unique row key (property name or getter). */
	rowKey: keyof RowType | RowKeyResolver<RowType>;

	/** Marks a row as a definite leaf, suppressing its chevron without consulting children. */
	isLeaf?: (row: RowType) => boolean;

	/** Lazily loads a row's children, fetched the first time the row is expanded. */
	loadChildren?: (row: RowType) => Promise<RowType[]>;

	/**
	 * Controlled pagination source (flat-adjacency mode): returns the pagination state for the children of
	 * `parentId` (or the implicit root when `parentId` is `undefined`); `undefined` for a fully-loaded
	 * parent. When set, it overrides the internal {@link loadChildren} page-state derivation, and
	 * {@link TreeModel.loadMore} / {@link TreeModel.loadAll} delegate to {@link onLoadMore} / {@link onLoadAll}
	 * rather than awaiting `loadChildren`. Ignored when {@link loadChildren} is also set (lazy mode wins).
	 */
	getPagination?: (parentId: Key | undefined) => TreePaginationState | undefined;

	/** Loads the next page for `parentId` (root when `undefined`) in controlled pagination mode. */
	onLoadMore?: (meta: { parentId: Key | undefined }) => void;

	/** Drains all remaining pages for `parentId` (root when `undefined`); falls back to {@link onLoadMore}. */
	onLoadAll?: (meta: { parentId: Key | undefined }) => void;

	/** Controlled expanded keys. When provided, the model never mutates expansion on its own. */
	expandedKeys?: ReadonlySet<Key>;

	/** Fired whenever a row is expanded or collapsed. */
	onExpandedChange?: (expandedKeys: Set<Key>, meta: { key: Key; expanded: boolean; row: RowType }) => void;

	/** Initially-expanded keys (uncontrolled). Ignored when {@link expandedKeys} is provided. */
	defaultExpandedKeys?: Iterable<Key>;

	/** Expand every expandable row initially (uncontrolled). Ignored when {@link expandedKeys} is provided. */
	defaultExpandAll?: boolean;

	/**
	 * Emit a synthetic `"load-more"` sentinel row after every expanded, paginated parent (a row whose last
	 * page reported `hasMore`). Views that render these rows themselves (e.g. `TreeView`) opt in; views that
	 * feed `rows` into a flat data grid (e.g. the `DataTreeTable` wrapper) leave it off.
	 */
	includeLoadMoreRows?: boolean;
}

/**
 * Headless tree model: normalizes the nested/flat input, owns expand/collapse (controlled or
 * uncontrolled) and lazy child loading, and flattens it all into the ordered visible rows plus lookup
 * maps. The view (e.g. {@link TreeView} or the `DataTreeTable` wrapper) renders from these.
 *
 * @internal
 */
export interface TreeModel<RowType> {
	/** Ordered, currently-visible rows. */
	rows: FlatTreeRow<RowType>[];

	/** Lookup by the row object identity. */
	metaByRow: Map<RowType, FlatTreeRow<RowType>>;

	/** Lookup by row key. */
	metaByKey: Map<Key, FlatTreeRow<RowType>>;

	/** Resolves a row's stable key (shared with the view's own `rowKey`). */
	rowKeyOf: (row: RowType) => Key;

	/** Toggles a row's expansion (honours controlled state and lazy loading). */
	toggle: (key: Key, row: RowType) => void;

	/**
	 * Loads the next page of children for a parent (controlled pagination only) by delegating to
	 * `onLoadMore`. `key`/`row` are `undefined` for the implicit root.
	 */
	loadMore: (key: Key | undefined, row: RowType | undefined) => void;

	/**
	 * Drains all remaining pages of children for a parent (controlled pagination only) by delegating to
	 * `onLoadAll` (or `onLoadMore`). `key`/`row` are `undefined` for the implicit root.
	 */
	loadAll: (key: Key | undefined, row: RowType | undefined) => void;
}

/** Builds a `row → Key` resolver from the `rowKey` option (property name or getter). */
function resolveRowKey<RowType>(rowKey: keyof RowType | RowKeyResolver<RowType>): (row: RowType) => Key {
	if (typeof rowKey === "function") {
		return (row: RowType): Key => (rowKey as RowKeyResolver<RowType>)({ row });
	}

	return (row: RowType): Key => row[rowKey] as unknown as Key;
}

/**
 * The headless tree-model hook. See {@link TreeModel}.
 *
 * @internal
 */
export function useTreeModel<RowType>(props: TreeModelOptions<RowType>): TreeModel<RowType> {
	const {
		tree,
		getChildren,
		data,
		getParentId,
		rowKey,
		isLeaf,
		loadChildren,
		getPagination,
		onLoadMore,
		onLoadAll,
		expandedKeys: controlledExpandedKeys,
		onExpandedChange,
		defaultExpandedKeys,
		defaultExpandAll,
		includeLoadMoreRows
	} = props;

	const rowKeyOf = useMemo(() => resolveRowKey(rowKey), [rowKey]);

	// Controlled (flat-adjacency) pagination is active when a consumer supplies `getPagination` and there is
	// no `loadChildren` — lazy mode owns pagination state internally and wins if both are (mis)configured.
	const controlledPagination = getPagination !== undefined && loadChildren === undefined;

	// Lazily-loaded children, overlaid on top of the declared hierarchy; and the set of rows whose
	// children are currently in flight (first-expand fetch).
	const [overlay, setOverlay] = useState<Map<Key, RowType[]>>(() => new Map());
	const [loadingKeys, setLoadingKeys] = useState<ReadonlySet<Key>>(() => new Set<Key>());

	// Normalize either input (nested `tree` or flat `data` + `getParentId`) into a roots list and a
	// `childrenBase` reader (before the lazy overlay is applied).
	const { roots, childrenBase } = useMemo<{
		roots: RowType[];
		childrenBase: (row: RowType) => RowType[] | undefined;
	}>(() => {
		if (data) {
			const rowByKey = new Map<Key, RowType>();

			for (const row of data) {
				rowByKey.set(rowKeyOf(row), row);
			}

			const childMap = new Map<Key, RowType[]>();
			const rootRows: RowType[] = [];

			for (const row of data) {
				const parentId = getParentId?.(row);

				if (parentId === undefined || parentId === null || !rowByKey.has(parentId)) {
					rootRows.push(row);
				} else {
					const siblings = childMap.get(parentId) ?? [];
					siblings.push(row);
					childMap.set(parentId, siblings);
				}
			}

			return { roots: rootRows, childrenBase: (row: RowType): RowType[] | undefined => childMap.get(rowKeyOf(row)) };
		}

		const read = getChildren ?? ((row: RowType): RowType[] | undefined => (row as { children?: RowType[] }).children);

		return { roots: tree ?? [], childrenBase: read };
	}, [data, getParentId, tree, getChildren, rowKeyOf]);

	const childrenOf = useCallback(
		(row: RowType): RowType[] | undefined => {
			const key = rowKeyOf(row);

			return overlay.has(key) ? overlay.get(key) : childrenBase(row);
		},
		[overlay, childrenBase, rowKeyOf]
	);

	const isExpandable = useCallback(
		(row: RowType, key: Key): boolean => {
			if (isLeaf?.(row)) {
				return false;
			}

			if (overlay.has(key)) {
				// A lazily-loaded row stays expandable only if the fetch returned children.
				return (overlay.get(key)?.length ?? 0) > 0;
			}

			const children = childrenBase(row);

			// Unknown children (undefined) are expandable only when they can be lazily loaded.
			return children !== undefined ? children.length > 0 : !!loadChildren;
		},
		[isLeaf, overlay, childrenBase, loadChildren]
	);

	const isControlled = controlledExpandedKeys !== undefined;

	const [internalExpanded, setInternalExpanded] = useState<ReadonlySet<Key>>(() => {
		if (defaultExpandAll) {
			return collectExpandableKeys({ roots, childrenOf: childrenBase, isExpandable, rowKeyOf });
		}

		return new Set<Key>(defaultExpandedKeys ?? []);
	});

	const expandedKeys = isControlled ? (controlledExpandedKeys as ReadonlySet<Key>) : internalExpanded;

	// Latest expanded set for the async lazy-load path, which resolves after later renders.
	const expandedRef = useRef(expandedKeys);
	expandedRef.current = expandedKeys;

	// Controlled pagination: probe `getPagination` for every expanded parent (and the implicit root) to
	// build the has-more / loading / total maps that the lazy path otherwise derives from `pageStateByKey`.
	// Only expanded parents can show a sentinel (the flattener emits one inside an expanded group), so the
	// expanded set is the exact probe set.
	const externalPagination = useMemo(() => {
		if (!controlledPagination || !getPagination) {
			return undefined;
		}

		const hasMore = new Set<Key>();
		const loadingMore = new Set<Key>();
		const totals = new Map<Key, number>();

		for (const key of expandedKeys) {
			const state = getPagination(key);

			if (state?.hasMore) {
				hasMore.add(key);
			}

			if (state?.loading) {
				loadingMore.add(key);
			}

			if (state?.total !== undefined) {
				totals.set(key, state.total);
			}
		}

		const rootState = getPagination(undefined);

		return {
			hasMoreKeys: hasMore as ReadonlySet<Key>,
			loadingMoreKeys: loadingMore as ReadonlySet<Key>,
			totalByKey: totals as ReadonlyMap<Key, number>,
			root: rootState
				? { hasMore: rootState.hasMore, loadingMore: !!rootState.loading, total: rootState.total }
				: undefined
		};
	}, [controlledPagination, getPagination, expandedKeys]);

	const commitExpanded = useCallback(
		(key: Key, expanded: boolean, row: RowType): void => {
			const next = new Set(expandedRef.current);

			if (expanded) {
				next.add(key);
			} else {
				next.delete(key);
			}

			onExpandedChange?.(next, { key, expanded, row });

			if (!isControlled) {
				setInternalExpanded(next);
			}
		},
		[onExpandedChange, isControlled]
	);

	const toggle = useCallback(
		(key: Key, row: RowType): void => {
			const expanding = !expandedRef.current.has(key);

			if (expanding && loadChildren && !overlay.has(key) && childrenBase(row) === undefined && !isLeaf?.(row)) {
				setLoadingKeys((prev) => new Set(prev).add(key));

				loadChildren(row)
					.then((children) => {
						setOverlay((prev) => new Map(prev).set(key, children));
						setLoadingKeys((prev) => {
							const next = new Set(prev);
							next.delete(key);

							return next;
						});
						commitExpanded(key, true, row);
					})
					.catch(() => {
						setLoadingKeys((prev) => {
							const next = new Set(prev);
							next.delete(key);

							return next;
						});
					});

				return;
			}

			commitExpanded(key, expanding, row);
		},
		[loadChildren, overlay, childrenBase, isLeaf, commitExpanded]
	);

	// Controlled pagination only: the consumer owns loading — report which parent to page (root = undefined).
	// Lazy mode never paginates (single-page `loadChildren`), so these are no-ops without `getPagination`.
	const loadMore = useCallback(
		(key: Key | undefined): void => {
			if (controlledPagination) {
				onLoadMore?.({ parentId: key });
			}
		},
		[controlledPagination, onLoadMore]
	);

	const loadAll = useCallback(
		(key: Key | undefined): void => {
			if (controlledPagination) {
				(onLoadAll ?? onLoadMore)?.({ parentId: key });
			}
		},
		[controlledPagination, onLoadAll, onLoadMore]
	);

	// Has-more / total / loading-more come solely from controlled pagination; lazy mode never paginates.
	const hasMoreKeys = externalPagination?.hasMoreKeys ?? EMPTY_KEYS;
	const totalByKey = externalPagination?.totalByKey ?? EMPTY_TOTALS;
	const resolvedLoadingMoreKeys = externalPagination?.loadingMoreKeys ?? EMPTY_KEYS;
	const rootPagination = externalPagination?.root;

	const { rows, metaByRow, metaByKey } = useMemo(
		() =>
			flattenTree({
				roots,
				childrenOf,
				isExpandable,
				rowKeyOf,
				expandedKeys,
				loadingKeys,
				hasMoreKeys,
				loadingMoreKeys: resolvedLoadingMoreKeys,
				totalByKey,
				rootPagination,
				includeLoadMoreRows
			}),
		[
			roots,
			childrenOf,
			isExpandable,
			rowKeyOf,
			expandedKeys,
			loadingKeys,
			hasMoreKeys,
			resolvedLoadingMoreKeys,
			totalByKey,
			rootPagination,
			includeLoadMoreRows
		]
	);

	return { rows, metaByRow, metaByKey, rowKeyOf, toggle, loadMore, loadAll };
}
