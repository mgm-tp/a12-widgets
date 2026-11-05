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

import type { Key, ReactElement } from "react";
import { useState } from "react";

import type { DataTableColumn } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTreeTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { useRowSelection } from "./shared.js";

/** Flat-adjacency rows: the shape a paged store hands out, one page of siblings at a time. */
interface FlatNode {
	id: string;
	parentId?: string;
	name: string;
	size: string;
	modified: string;
	kind: "folder" | "file";
}

const PAGE_SIZE = 3;
const ROOT_TOTAL = 7;
const CHILD_TOTAL = 5;

// The full backing dataset a store would fetch from, page by page. The first root is a folder whose
// children are themselves paginated, so a load-more row appears both at the root and inside it.
const ALL_ROOTS: FlatNode[] = Array.from({ length: ROOT_TOTAL }, (_unused, index): FlatNode =>
	index === 0
		? { id: "paged-logs", name: "logs", size: "—", modified: "2026-06-12", kind: "folder" }
		: {
				id: `paged-report-${index}`,
				name: `report-${index}.csv`,
				size: `${index} KB`,
				modified: "2026-06-12",
				kind: "file"
			}
);

const ALL_CHILDREN: FlatNode[] = Array.from({ length: CHILD_TOTAL }, (_unused, index): FlatNode => ({
	id: `paged-entry-${index + 1}`,
	parentId: "paged-logs",
	name: `entry-${index + 1}.log`,
	size: `${index + 1} KB`,
	modified: "2026-06-12",
	kind: "file"
}));

const COLUMNS: DataTableColumn<FlatNode>[] = [
	{ label: "Name", dataKey: "name", width: 3 },
	{ label: "Size", dataKey: "size", width: 1, horizontalAlignment: "right" },
	{ label: "Modified", dataKey: "modified", width: 1.5 }
];

/**
 * Controlled pagination: the consumer's store stays the single source of truth. `getPagination(parentId)`
 * reports `{ hasMore, total }` for a parent's children (or for the implicit root when `parentId` is
 * `undefined`), and `onLoadMore` / `onLoadAll` append rows to the consumer-owned `data`. The wrapper
 * renders a grid-spanning load-more row with "Load more" / "Load all N" links (override the texts with
 * `loadMoreLabel` / `loadAllLabel`, or the whole row with `renderLoadMore`); the row disappears once
 * `hasMore` turns false. Mutually exclusive with `loadChildren`. A parent whose first page is not fetched
 * yet has no child rows in `data`; while `hasMore` is true it gets a chevron anyway, so no placeholder rows
 * are needed.
 */
export function PaginatedDataTreeTable(): ReactElement {
	const { rowStyling, rowEventHandlers } = useRowSelection<FlatNode>();
	const [rootLoaded, setRootLoaded] = useState(PAGE_SIZE);
	// The folder starts with no children loaded: `hasMore` still earns it a chevron, and expanding it
	// shows just the load-more row — no placeholder child rows needed.
	const [childLoaded, setChildLoaded] = useState(0);
	const [expanded, setExpanded] = useState<Set<Key>>(() => new Set());

	const data: FlatNode[] = [...ALL_ROOTS.slice(0, rootLoaded), ...ALL_CHILDREN.slice(0, childLoaded)];

	return (
		<DataTreeTable<FlatNode>
			ariaLabel="Paginated files"
			data={data}
			getParentId={(row) => row.parentId}
			rowKey="id"
			columns={COLUMNS}
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
			maxHeight={360}
			expandedKeys={expanded}
			onExpandedChange={setExpanded}
			isLeaf={(row) => row.kind === "file"}
			getPagination={(parentId) => {
				if (parentId === undefined) {
					return rootLoaded < ROOT_TOTAL ? { hasMore: true, total: ROOT_TOTAL } : undefined;
				}

				if (parentId === "paged-logs") {
					return childLoaded < CHILD_TOTAL ? { hasMore: true, total: CHILD_TOTAL } : undefined;
				}

				return undefined;
			}}
			onLoadMore={({ parentId }) => {
				if (parentId === undefined) {
					setRootLoaded((count) => Math.min(count + PAGE_SIZE, ROOT_TOTAL));
				} else if (parentId === "paged-logs") {
					setChildLoaded((count) => Math.min(count + PAGE_SIZE, CHILD_TOTAL));
				}
			}}
			onLoadAll={({ parentId }) => {
				if (parentId === undefined) {
					setRootLoaded(ROOT_TOTAL);
				} else if (parentId === "paged-logs") {
					setChildLoaded(CHILD_TOTAL);
				}
			}}
		/>
	);
}
