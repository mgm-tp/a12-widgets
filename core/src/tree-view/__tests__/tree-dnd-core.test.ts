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

import type { Key } from "react";
import { describe, expect, expectTypeOf, test } from "vitest";

import type { DataTreeTableDropPosition } from "../../data-table/main/data-tree-table/data-tree-table.api.js";
import type { FlatTreeRow } from "../main/model/index.js";
import { computeItemMode, mapInstructionToDropResult, resolveTreeKeyboardMove } from "../main/tree-dnd/index.js";
import type { TreeDropPosition } from "../main/tree-dnd/index.js";
import type { TreeViewDropPosition } from "../main/tree-view.api.js";

/*
 * The tree-DnD core is shared by TreeView and DataTreeTable — until it existed the
 * two carried near-verbatim copies of these functions, and they had already drifted:
 * DataTreeTable's copies did not skip `"load-more"` sentinels, even though
 * DataTreeTable is the component that produces them. The sentinel cases below are
 * what that drift cost, so they are pinned here.
 */

interface Row {
	id: string;
}

/** Builds a flattened row in the shape `useTreeModel` emits. */
function node(id: string, level: number, parentKey?: Key): FlatTreeRow<Row> {
	return {
		kind: "node",
		row: { id },
		key: id,
		level,
		parentKey,
		parentRow: undefined,
		expandable: false,
		expanded: false,
		loading: false,
		hasMore: false,
		loadingMore: false,
		total: undefined,
		posinset: 1,
		setsize: 1
	} as FlatTreeRow<Row>;
}

/**
 * A `"load-more"` sentinel, emitted by the model as the last entry of a paginated
 * group at the same level as that group's children.
 */
function sentinel(id: string, level: number, parentKey?: Key): FlatTreeRow<Row> {
	return { ...node(id, level, parentKey), kind: "load-more" } as FlatTreeRow<Row>;
}

describe("com.mgmtp.a12.widgets.tree-dnd — computeItemMode", () => {
	test("a row followed by a deeper row is expanded", () => {
		const rows = [node("a", 0), node("a1", 1, "a")];

		expect(computeItemMode(rows, 0)).toBe("expanded");
	});

	test("a row followed by a sibling is standard", () => {
		const rows = [node("a", 0), node("b", 0)];

		expect(computeItemMode(rows, 0)).toBe("standard");
	});

	test("the last row of the tree is last-in-group", () => {
		const rows = [node("a", 0), node("b", 0)];

		expect(computeItemMode(rows, 1)).toBe("last-in-group");
	});

	test("a row followed by a shallower row is last-in-group", () => {
		const rows = [node("a", 0), node("a1", 1, "a"), node("b", 0)];

		expect(computeItemMode(rows, 1)).toBe("last-in-group");
	});

	test("a trailing load-more sentinel does not mask last-in-group", () => {
		// Regression: DataTreeTable's former copy read the sentinel as a real next row at the same
		// level and returned "standard", which drops the outdent (reparent) zone from the hitbox — so
		// the last real child of a paginated group could not be outdented by dragging.
		const rows = [node("a", 0), node("a1", 1, "a"), sentinel("__loadMore__:a", 1, "a"), node("b", 0)];

		expect(computeItemMode(rows, 1)).toBe("last-in-group");
	});

	test("consecutive load-more sentinels are all skipped", () => {
		const rows = [
			node("a", 0),
			node("a1", 1, "a"),
			sentinel("__loadMore__:a", 1, "a"),
			sentinel("__loadMore__:root", 0, undefined)
		];

		expect(computeItemMode(rows, 1)).toBe("last-in-group");
	});

	test("an out-of-range index is standard rather than a crash", () => {
		expect(computeItemMode([node("a", 0)], 5)).toBe("standard");
	});
});

describe("com.mgmtp.a12.widgets.tree-dnd — mapInstructionToDropResult", () => {
	const rows = [node("a", 0), node("a1", 1, "a"), sentinel("__loadMore__:a", 1, "a"), node("b", 0)];

	test("reorder-above maps to a before-drop on the hovered row", () => {
		const result = mapInstructionToDropResult({ type: "reorder-above", currentLevel: 0, indentPerLevel: 16 }, 3, rows);

		expect(result).toMatchObject({ targetIndex: 3, position: "before" });
	});

	test("reorder-below maps to an after-drop on the hovered row", () => {
		const result = mapInstructionToDropResult({ type: "reorder-below", currentLevel: 0, indentPerLevel: 16 }, 0, rows);

		expect(result).toMatchObject({ targetIndex: 0, position: "after" });
	});

	test("make-child maps to an inside-drop", () => {
		const result = mapInstructionToDropResult({ type: "make-child", currentLevel: 0, indentPerLevel: 16 }, 0, rows);

		expect(result).toMatchObject({ targetIndex: 0, position: "inside" });
	});

	test("a blocked instruction produces no drop", () => {
		const result = mapInstructionToDropResult(
			{
				type: "instruction-blocked",
				desired: { type: "make-child", currentLevel: 0, indentPerLevel: 16 }
			},
			0,
			rows
		);

		expect(result).toBeNull();
	});

	test("reparent walks back past a load-more sentinel to a real ancestor", () => {
		// Outdenting from the sentinel's position must land after node "a" (level 0), never on the
		// sentinel itself — nothing can be a sibling of a sentinel.
		const result = mapInstructionToDropResult(
			{ type: "reparent", currentLevel: 1, desiredLevel: 0, indentPerLevel: 16 },
			2,
			rows
		);

		expect(result).toMatchObject({ targetIndex: 0, position: "after" });
		expect(result?.target.kind).toBe("node");
	});
});

describe("com.mgmtp.a12.widgets.tree-dnd — resolveTreeKeyboardMove", () => {
	// a, a1, a2, <load-more for a>, b
	const rows = [node("a", 0), node("a1", 1, "a"), node("a2", 1, "a"), sentinel("__loadMore__:a", 1, "a"), node("b", 0)];

	test("up moves before the previous sibling", () => {
		expect(resolveTreeKeyboardMove(rows, 2, "up")).toMatchObject({ targetIndex: 1, position: "before" });
	});

	test("down moves after the next sibling", () => {
		expect(resolveTreeKeyboardMove(rows, 1, "down")).toMatchObject({ targetIndex: 2, position: "after" });
	});

	test("up on the first sibling does not apply", () => {
		expect(resolveTreeKeyboardMove(rows, 1, "up")).toBeNull();
	});

	test("down on the last sibling does not apply — the sentinel is not a sibling", () => {
		// "a2" is the last *real* child of "a"; the sentinel that follows must not be treated as one
		// more sibling to move past.
		expect(resolveTreeKeyboardMove(rows, 2, "down")).toBeNull();
	});

	test("into nests under the preceding sibling", () => {
		expect(resolveTreeKeyboardMove(rows, 2, "into")).toMatchObject({ targetIndex: 1, position: "inside" });
	});

	test("out becomes the next sibling of the parent", () => {
		expect(resolveTreeKeyboardMove(rows, 1, "out")).toMatchObject({ targetIndex: 0, position: "after" });
	});

	test("out on a root row does not apply", () => {
		expect(resolveTreeKeyboardMove(rows, 0, "out")).toBeNull();
	});

	test("top and bottom jump to the ends of the sibling group", () => {
		expect(resolveTreeKeyboardMove(rows, 2, "top")).toMatchObject({ targetIndex: 1, position: "before" });
		expect(resolveTreeKeyboardMove(rows, 1, "bottom")).toMatchObject({ targetIndex: 2, position: "after" });
	});

	test("a sentinel is never a movable source", () => {
		expect(resolveTreeKeyboardMove(rows, 3, "up")).toBeNull();
	});
});

describe("com.mgmtp.a12.widgets.tree-dnd — drop-position parity", () => {
	test("both components' public position types match the shared one", () => {
		// The shared core declares `TreeDropPosition`; each component keeps its own public spelling as an
		// identical literal union so neither published API report churns. If one gains a member without
		// the other, this fails at compile time.
		expectTypeOf<TreeViewDropPosition>().toEqualTypeOf<TreeDropPosition>();
		expectTypeOf<DataTreeTableDropPosition>().toEqualTypeOf<TreeDropPosition>();

		expect(true).toBe(true);
	});
});
