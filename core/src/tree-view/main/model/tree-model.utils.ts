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
 * Generic, widget-neutral tree-flattening primitives shared by the headless tree model. The consumer's
 * row type flows through verbatim (no envelope); tree metadata lives alongside it. Consumed by both
 * {@link TreeView} and the `DataTreeTable` wrapper over `DataTable`.
 * @module
 */

import type { Key } from "react";

/**
 * One visible tree row after flattening. The consumer's `row` is carried verbatim (no envelope); the
 * tree metadata lives alongside it so the view resolves depth/expansion/relationships from this record.
 *
 * @internal
 */
export interface FlatTreeRow<RowType = unknown> {
	/**
	 * Discriminates a normal node row from a synthetic "load more" sentinel emitted after a paginated
	 * parent's loaded children. Defaults to `"node"`. For a `"load-more"` row, {@link row} / {@link parentRow}
	 * carry the *parent* node (so its next page can be loaded) and the row is not selectable/expandable. A
	 * root-level `"load-more"` sentinel (controlled pagination of the implicit root) has both `undefined`.
	 */
	kind: "node" | "load-more";

	/**
	 * The consumer's row, passed straight through to the view (the parent node for a `"load-more"` row;
	 * `undefined` for a root-level `"load-more"` sentinel, which has no parent).
	 */
	row: RowType;

	/** Stable key of the row (from `rowKey`); a synthetic `__loadMore__:<parentKey>` for a sentinel. */
	key: Key;

	/** Depth in the tree; `0` for a top-level row. */
	level: number;

	/** Key of the parent row, or `undefined` for a top-level row. */
	parentKey?: Key;

	/** The parent row, or `undefined` for a top-level row. */
	parentRow?: RowType;

	/** Whether the row can be expanded (has, or can lazily load, children). */
	expandable: boolean;

	/** Whether the row is currently expanded. */
	expanded: boolean;

	/** Whether the row's children are currently being lazily loaded (the first-expand fetch). */
	loading: boolean;

	/** Whether more children can be paginated in for this row via lazy loading. */
	hasMore: boolean;

	/** Whether a subsequent page of children is currently loading (distinct from {@link loading}). */
	loadingMore: boolean;

	/** Total child count reported by the paginated source, if known (else `undefined`). */
	total?: number;

	/** 1-based position among its siblings (for `aria-posinset`). */
	posinset: number;

	/** Sibling count (for `aria-setsize`). */
	setsize: number;
}

/**
 * Result of {@link flattenTree}: the ordered visible rows plus lookup maps keyed by the row object and
 * by its key, used by the cell/row decorators and the DnD plumbing.
 *
 * @internal
 */
export interface FlattenResult<RowType = unknown> {
	rows: FlatTreeRow<RowType>[];
	metaByRow: Map<RowType, FlatTreeRow<RowType>>;
	metaByKey: Map<Key, FlatTreeRow<RowType>>;
}

/**
 * Depth-first flatten of a hierarchy into the ordered list of currently-visible rows. A node is
 * descended into only when it is expandable AND its key is in `expandedKeys`. Each produced row
 * carries its depth, parent and sibling position.
 *
 * Input is abstracted behind callbacks so the same routine serves both the nested-`tree` and the
 * flat-`data`/`getParentId` inputs:
 * - `roots` — the top-level rows,
 * - `childrenOf` — a row's children (already overlaid with any lazily-loaded children),
 * - `isExpandable` — whether a row shows a chevron,
 * - `rowKeyOf` — the row's stable key.
 *
 * @internal
 */
export function flattenTree<RowType>(params: {
	roots: RowType[];
	childrenOf: (row: RowType) => RowType[] | undefined;
	isExpandable: (row: RowType, key: Key) => boolean;
	rowKeyOf: (row: RowType) => Key;
	expandedKeys: ReadonlySet<Key>;
	loadingKeys: ReadonlySet<Key>;
	hasMoreKeys: ReadonlySet<Key>;
	loadingMoreKeys: ReadonlySet<Key>;

	/** Total child count per key, where the paginated source reported one. */
	totalByKey: ReadonlyMap<Key, number>;

	/**
	 * Controlled pagination for the implicit root list (flat-adjacency / controlled mode). When set with
	 * `hasMore`, a root-level `"load-more"` sentinel (`parentKey`/`parentRow` `undefined`, `level` 0) trails
	 * the top-level rows. Lazy (`loadChildren`) mode leaves this unset — it has no root pagination.
	 */
	rootPagination?: { hasMore: boolean; loadingMore: boolean; total?: number };

	/** When true, emit a synthetic `"load-more"` sentinel row after each expanded, paginated parent. */
	includeLoadMoreRows?: boolean;
}): FlattenResult<RowType> {
	const {
		roots,
		childrenOf,
		isExpandable,
		rowKeyOf,
		expandedKeys,
		loadingKeys,
		hasMoreKeys,
		loadingMoreKeys,
		totalByKey,
		rootPagination,
		includeLoadMoreRows
	} = params;

	const rows: FlatTreeRow<RowType>[] = [];
	const metaByRow = new Map<RowType, FlatTreeRow<RowType>>();
	const metaByKey = new Map<Key, FlatTreeRow<RowType>>();

	// Whether a children-group has a further page — keyed by the parent's key, or `undefined` for the
	// implicit root list (controlled pagination only). Drives sentinel emission and the group's `setsize`.
	const groupHasMore = (parentKey: Key | undefined): boolean => {
		if (!includeLoadMoreRows) {
			return false;
		}

		return parentKey === undefined ? !!rootPagination?.hasMore : hasMoreKeys.has(parentKey);
	};

	const groupLoadingMore = (parentKey: Key | undefined): boolean =>
		parentKey === undefined ? !!rootPagination?.loadingMore : loadingMoreKeys.has(parentKey);

	const groupTotal = (parentKey: Key | undefined): number | undefined =>
		parentKey === undefined ? rootPagination?.total : totalByKey.get(parentKey);

	const walk = (siblings: RowType[], level: number, parentKey?: Key, parentRow?: RowType): void => {
		// A sentinel trails this sibling group when its parent (or the root list) has another page to load;
		// count it in `setsize` so the children's `aria-setsize` stays consistent with the rendered sentinel.
		const parentHasMore = groupHasMore(parentKey);
		const setsize = siblings.length + (parentHasMore ? 1 : 0);

		siblings.forEach((row, index) => {
			const key = rowKeyOf(row);
			const expandable = isExpandable(row, key);
			const expanded = expandable && expandedKeys.has(key);
			const meta: FlatTreeRow<RowType> = {
				kind: "node",
				row,
				key,
				level,
				parentKey,
				parentRow,
				expandable,
				expanded,
				loading: loadingKeys.has(key),
				hasMore: hasMoreKeys.has(key),
				loadingMore: loadingMoreKeys.has(key),
				total: totalByKey.get(key),
				posinset: index + 1,
				setsize
			};

			rows.push(meta);
			metaByRow.set(row, meta);
			metaByKey.set(key, meta);

			if (expanded) {
				const children = childrenOf(row);
				const childHasMore = includeLoadMoreRows && hasMoreKeys.has(key);

				// Descend when there are children to show, or only a sentinel to emit (empty first page).
				if ((children && children.length > 0) || childHasMore) {
					walk(children ?? [], level + 1, key, row);
				}
			}
		});

		// Emit the sentinel as the last item of this group (after the real children). For the root list
		// `parentKey`/`parentRow` are `undefined` — the sentinel still renders, addressing the implicit root.
		if (parentHasMore) {
			const sentinelKey: Key = `__loadMore__:${String(parentKey)}`;
			const sentinel: FlatTreeRow<RowType> = {
				kind: "load-more",
				row: parentRow as RowType,
				key: sentinelKey,
				level,
				parentKey,
				parentRow,
				expandable: false,
				expanded: false,
				loading: false,
				hasMore: false,
				loadingMore: groupLoadingMore(parentKey),
				total: groupTotal(parentKey),
				posinset: setsize,
				setsize
			};

			rows.push(sentinel);
			// Intentionally not added to `metaByRow`: `row` is the parent, already mapped to its own meta.
			metaByKey.set(sentinelKey, sentinel);
		}
	};

	walk(roots, 0);

	return { rows, metaByRow, metaByKey };
}

/**
 * Whether the row keyed `targetKey` is `sourceKey` itself or sits anywhere inside its subtree, walking
 * the `parentKey` back-references via `metaByKey`. Used to forbid dropping a dragged node onto itself
 * or into its own descendants (which would create a cycle).
 *
 * @internal
 */
export function isSelfOrDescendant<RowType>(
	targetKey: Key,
	sourceKey: Key,
	metaByKey: Map<Key, FlatTreeRow<RowType>>
): boolean {
	let current: FlatTreeRow<RowType> | undefined = metaByKey.get(targetKey);

	while (current) {
		if (current.key === sourceKey) {
			return true;
		}

		current = current.parentKey !== undefined ? metaByKey.get(current.parentKey) : undefined;
	}

	return false;
}

/**
 * Collects every expandable row's key from a hierarchy, regardless of current expansion — used to seed
 * `defaultExpandAll`. Descends through all children (not just expanded ones).
 *
 * @internal
 */
export function collectExpandableKeys<RowType>(params: {
	roots: RowType[];
	childrenOf: (row: RowType) => RowType[] | undefined;
	isExpandable: (row: RowType, key: Key) => boolean;
	rowKeyOf: (row: RowType) => Key;
}): Set<Key> {
	const { roots, childrenOf, isExpandable, rowKeyOf } = params;
	const keys = new Set<Key>();

	const walk = (siblings: RowType[]): void => {
		for (const row of siblings) {
			const key = rowKeyOf(row);
			const children = childrenOf(row);

			if (isExpandable(row, key)) {
				keys.add(key);
			}

			if (children && children.length > 0) {
				walk(children);
			}
		}
	};

	walk(roots);

	return keys;
}
