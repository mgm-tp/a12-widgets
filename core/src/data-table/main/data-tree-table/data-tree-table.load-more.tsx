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
 * The {@link DataTreeTable} "load more" plumbing. The headless tree model emits a synthetic
 * `"load-more"` row after every paginated parent; a flat data grid cannot render that as an ordinary
 * row, so this module: (1) represents each sentinel by a branded placeholder object that flows through
 * {@link DataTable}'s `data` with a stable, collision-free key, and (2) renders it as a row whose
 * affordance is aligned to the tree column — an optional leading spacer cell covers the leaves before
 * the tree column, then a single cell spans the tree column to the end of the row, hosting
 * {@link TreeView}'s shared load-more affordance.
 * @module
 */

import type { HTMLAttributes, Key, ReactElement, ReactNode, Ref } from "react";
import { useTheme } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";
import type { FlatTreeRow } from "../../../tree-view/main/model/index.js";
import type { TreeLoadMoreRenderParams } from "../../../tree-view/main/tree-view-load-more.view.js";
import { TreeLoadMoreContent } from "../../../tree-view/main/tree-view-load-more.view.js";

import { useDataTableContext } from "../data-table.context.js";

import {
	StyledTreeLoadMoreCell,
	StyledTreeLoadMoreContent,
	StyledTreeLoadMoreRow,
	StyledTreeLoadMoreSpacerCell
} from "./data-tree-table.styled.js";

/** Brand carried by a sentinel placeholder so it is recognizable among the real rows. */
const SENTINEL_PARENT_KEY = Symbol("a12.dataTreeTable.loadMoreParentKey");

/**
 * The synthetic row object pushed into {@link DataTable}'s `data` for a model `"load-more"` row. It
 * carries only the parent's key (or `undefined` for a root-level sentinel) so the wrapper can derive a
 * stable row key without consulting the model; its full metadata is recovered from a parallel
 * `row → FlatTreeRow` map.
 *
 * @internal
 */
export interface LoadMoreSentinel {
	readonly [SENTINEL_PARENT_KEY]: Key | undefined;
}

/**
 * Creates a sentinel placeholder for the paginated parent keyed `parentKey` — or for the implicit root
 * list when `parentKey` is `undefined` (controlled pagination). @internal
 */
export function createLoadMoreSentinel(parentKey: Key | undefined): LoadMoreSentinel {
	return { [SENTINEL_PARENT_KEY]: parentKey };
}

/** Whether `row` is a synthetic load-more sentinel rather than a consumer row. @internal */
export function isLoadMoreSentinel(row: unknown): row is LoadMoreSentinel {
	return typeof row === "object" && row !== null && SENTINEL_PARENT_KEY in row;
}

/** The stable, collision-free row key for a sentinel — mirrors the model's own sentinel key. @internal */
export function loadMoreSentinelKey(row: LoadMoreSentinel): Key {
	return `__loadMore__:${String(row[SENTINEL_PARENT_KEY])}`;
}

/** Props for {@link TreeLoadMoreRow}. @internal */
export interface TreeLoadMoreRowProps<RowType> {
	/** The sentinel's flattened metadata (level, paginated parent, `loadingMore`, `total`). */
	meta: FlatTreeRow<RowType>;

	/** Indentation in pixels per depth level (mirrors the tree cell's indent). */
	indentSize: number;

	/** Width of the tree cell's expand/collapse toggle slot, so the affordance lines up with node labels. */
	toggleSize: number;

	/**
	 * Index of the tree column among the flattened leaf columns. A leading spacer cell spans the leaves
	 * before it (omitted when `0`) so the affordance's cell begins exactly at the tree column's left edge.
	 */
	treeLeafIndex: number;

	/** Loads the next page of the parent's children (`key`/`row` `undefined` for a root-level sentinel). */
	loadMore: (key: Key | undefined, row: RowType | undefined) => void;

	/** Drains all remaining pages of the parent's children (`key`/`row` `undefined` for the root). */
	loadAll: (key: Key | undefined, row: RowType | undefined) => void;

	/** Consumer override for the affordance; falls back to the built-in links / progress indicator. */
	renderLoadMore?: (params: TreeLoadMoreRenderParams<RowType>) => ReactNode;

	/** Label for the "load next page" link. Defaults to `"Load more"`. */
	loadMoreLabel?: string;

	/** Label for the "drain all pages" link; the `total` child count (if known) is appended. Defaults to `"Load all"`. */
	loadAllLabel?: string;

	/** Extra HTML attributes for the `<tr>` (the wrapper injects `aria-level`/`-setsize`/`-posinset`). */
	htmlAttributes?: HTMLAttributes<HTMLTableRowElement>;

	/** Ref forwarded to the `<tr>` (focus / scroll-to-node parity with body rows). */
	forwardedRef?: Ref<HTMLTableRowElement>;
}

/**
 * The {@link DataTreeTable} "load more" row, aligned to the tree column wherever it sits: an optional
 * leading spacer cell spans the leaf columns *before* the tree column, then a single cell spans from the
 * tree column to the end of the row, indented to align with the node labels of the children it trails and
 * hosting the shared {@link TreeLoadMoreContent} affordance.
 *
 * @internal
 */
export function TreeLoadMoreRow<RowType>(props: TreeLoadMoreRowProps<RowType>): ReactElement {
	const {
		meta,
		indentSize,
		toggleSize,
		treeLeafIndex,
		loadMore,
		loadAll,
		renderLoadMore,
		loadMoreLabel,
		loadAllLabel,
		htmlAttributes,
		forwardedRef
	} = props;
	const theme = useTheme();
	const leafCount = useDataTableContext((ctx) => ctx.leafPinning.length) || 1;
	// Add the toggle slot width so the affordance lines up with the node *labels* of the children it
	// trails — the tree cell reserves `toggleSize` for the chevron before the label, but this spanning
	// cell has no chevron, so without it the links would sit a toggle-width to the left under the chevrons.
	const indent = theme.components.treeTable.node.spacingLeft + meta.level * indentSize + toggleSize;

	// The leading spacer occupies exactly the columns before the tree column, so the content cell's left
	// edge lands at the tree column's left edge (alignment by construction, no pixel measurement); the
	// content cell then spans to the end of the row so the affordance keeps the full remaining width.
	const spacerSpan = Math.min(treeLeafIndex, leafCount);
	const contentSpan = Math.max(leafCount - spacerSpan, 1);

	// `undefined` for a root-level sentinel (controlled pagination of the implicit root); the model's
	// `loadMore`/`loadAll` accept the root case and the default affordance does not dereference `row`.
	const parentKey = meta.parentKey;
	const parentRow = meta.parentRow as RowType;

	return (
		<StyledTreeLoadMoreRow ref={forwardedRef} data-role={DataRoles.TreeTable.LoadMore} {...htmlAttributes}>
			{spacerSpan > 0 ? <StyledTreeLoadMoreSpacerCell colSpan={spacerSpan} aria-hidden /> : null}
			<StyledTreeLoadMoreCell colSpan={contentSpan}>
				<StyledTreeLoadMoreContent $indent={indent}>
					<TreeLoadMoreContent
						row={parentRow}
						loading={meta.loadingMore}
						loadMore={(): void => loadMore(parentKey, parentRow)}
						loadAll={(): void => loadAll(parentKey, parentRow)}
						total={meta.total}
						renderLoadMore={renderLoadMore}
						loadMoreLabel={loadMoreLabel}
						loadAllLabel={loadAllLabel}
					/>
				</StyledTreeLoadMoreContent>
			</StyledTreeLoadMoreCell>
		</StyledTreeLoadMoreRow>
	);
}

TreeLoadMoreRow.displayName = "TreeLoadMoreRow";
