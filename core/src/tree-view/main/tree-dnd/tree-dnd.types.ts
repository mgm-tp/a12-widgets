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

import type { Key, RefObject } from "react";

import type { DragAndDropTitles } from "../../../common/main/a11y-localization/index.js";
import type { FlatTreeRow } from "../model/index.js";

/**
 * Where a dragged node lands relative to the drop target.
 *
 * The canonical declaration. `TreeViewDropPosition` and `DataTreeTableDropPosition`
 * are the public spellings on each component's own API and are kept as identical
 * literal unions rather than aliases of this one, so neither published API report
 * churns; `tree-dnd.test.ts` asserts all three stay in step.
 *
 * @internal
 */
export type TreeDropPosition = "before" | "after" | "inside";

/**
 * A resolved tree drop: the hovered/target row plus where the dragged node would land.
 *
 * @internal
 */
export interface ResolvedTreeDrop<RowType> {
	target: FlatTreeRow<RowType>;
	targetIndex: number;
	position: TreeDropPosition;
}

/**
 * The dragged-row payload carried in pragmatic data.
 *
 * @internal
 */
export interface TreeDragItem<RowType = unknown> {
	rowIndex: number;
	row: RowType;
}

/**
 * Visual indicator derived from the current hitbox instruction.
 *
 * @internal
 */
export interface IndicatorState {
	/**
	 * `reorder-top`/`reorder-bottom` draw a band in the gap above/below the row (insert as a sibling);
	 * `child` highlights the row itself (reparent into it).
	 */
	type: "reorder-top" | "reorder-bottom" | "child";

	/** Tree level the reorder band is indented to (so it aligns with the prospective sibling). */
	level: number;
	forbidden: boolean;
}

/**
 * The drag-and-drop callbacks the shared core actually invokes. Both
 * `TreeViewDragDrop` and `DataTreeTableDragDrop` structurally satisfy this — each
 * adds its own component-specific options on top (accept type, hover auto-expand,
 * drag lifecycle hooks), which stay with the component.
 *
 * @internal
 */
export interface TreeDnDCoreOptions<RowType = unknown> {
	/** Whether the drop is permitted. Replaces the default self-or-descendant cycle guard. */
	canDrop?(params: { source: RowType; target: RowType; position: TreeDropPosition }): boolean;

	/** Fired on a completed, permitted drop. */
	onDrop?(params: { source: RowType; target: RowType; position: TreeDropPosition }): void;
}

/**
 * The slice of a component's live DnD state the shared core reads. `TreeView`'s
 * `TreeViewDnDState` and `DataTreeTable`'s `TreeDnDState` are supersets of this,
 * so both are assignable without adaptation.
 *
 * @internal
 */
export interface TreeDnDCoreState<RowType = unknown> {
	options: TreeDnDCoreOptions<RowType>;

	/** Current flattened rows, in DFS (display) order. Indices are flat row indices. */
	rows: FlatTreeRow<RowType>[];

	/** Lookup by row key, for the cycle guard's ancestor walk. */
	metaByKey: Map<Key, FlatTreeRow<RowType>>;

	/** Resolves a row's stable key. */
	rowKeyOf: (row: RowType) => Key;

	/** Localized grab / move / drop / cancel announcements for keyboard drag-and-drop. */
	titles?: DragAndDropTitles;

	/** Announces a screen-reader message through the component's polite live region. */
	announce?: (message: string) => void;

	/**
	 * Stable ref holding the key of the row to flash on the next commit (set by a pointer drop or a
	 * keyboard move, claimed by that row once it has re-rendered at its new position).
	 */
	pendingFlashKeyRef?: RefObject<Key | null>;
}
