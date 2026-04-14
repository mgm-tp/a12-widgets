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

import { render } from "test-utils";
import { afterEach, describe, expect, test, vi } from "vitest";

import { DataRoles } from "../../common/main/data-roles.js";

import type { TreeTableScrollToNodeHandler } from "../main/tree-table.api.js";
import { TreeTable } from "../main/tree-table.view.js";

import { COLUMNS, TREE_TABLE_NODE } from "./data.js";

describe("com.mgmtp.a12.widgets.tree-table.scroll-to-node", () => {
	test("scrollToNode handler is registered once on mount", () => {
		let scrollHandler: TreeTableScrollToNodeHandler | undefined;
		const scrollToNodeFn = vi.fn((handler: TreeTableScrollToNodeHandler) => {
			scrollHandler = handler;
		});

		render(<TreeTable id="test" root={TREE_TABLE_NODE} columns={COLUMNS} scrollToNode={scrollToNodeFn} />);

		expect(scrollToNodeFn).toHaveBeenCalledTimes(1);
		expect(scrollHandler).toBeDefined();
	});

	test("scrollToNode scrolls to the node", () => {
		let scrollHandler: TreeTableScrollToNodeHandler | undefined;
		const scrollToNodeFn = vi.fn((handler: TreeTableScrollToNodeHandler) => {
			scrollHandler = handler;
		});

		const scrollIntoViewMock = vi.fn();

		render(<TreeTable id="test" root={TREE_TABLE_NODE} columns={COLUMNS} scrollToNode={scrollToNodeFn} />);

		const nodeEl = document.getElementById("tree-node-name-2");

		if (nodeEl) {
			nodeEl.scrollIntoView = scrollIntoViewMock;
		}

		scrollHandler?.(2);

		expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
	});

	test("scrollToNode with autoFocus focuses the row", () => {
		let scrollHandler: TreeTableScrollToNodeHandler | undefined;
		const scrollToNodeFn = vi.fn((handler: TreeTableScrollToNodeHandler) => {
			scrollHandler = handler;
		});

		const scrollIntoViewMock = vi.fn();
		const focusMock = vi.fn();

		render(<TreeTable id="test" root={TREE_TABLE_NODE} columns={COLUMNS} scrollToNode={scrollToNodeFn} />);

		const nodeEl = document.getElementById("tree-node-name-2");
		const rowEl = nodeEl?.closest<HTMLElement>(`[data-role=${DataRoles.Table.Body.Row}]`);

		if (nodeEl) {
			nodeEl.scrollIntoView = scrollIntoViewMock;
		}

		if (rowEl) {
			rowEl.focus = focusMock;
		}

		scrollHandler?.(2, { autoFocus: true });

		expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
		expect(focusMock).toHaveBeenCalledTimes(1);
	});

	describe("with virtualScrollOptions (VirtualizedBody)", () => {
		afterEach(() => {
			vi.useRealTimers();
		});

		test("scrollToNode handler is registered once on mount", () => {
			let scrollHandler: TreeTableScrollToNodeHandler | undefined;
			const scrollToNodeFn = vi.fn((handler: TreeTableScrollToNodeHandler) => {
				scrollHandler = handler;
			});

			render(
				<TreeTable
					id="test"
					root={TREE_TABLE_NODE}
					columns={COLUMNS}
					scrollToNode={scrollToNodeFn}
					virtualScrollOptions={{ rowHeight: 40 }}
				/>
			);

			expect(scrollToNodeFn).toHaveBeenCalledTimes(1);
			expect(scrollHandler).toBeDefined();
		});

		test("scrollToNode scrolls to the node via virtualizedList.scrollToRow", () => {
			let scrollHandler: TreeTableScrollToNodeHandler | undefined;
			const scrollToNodeFn = vi.fn((handler: TreeTableScrollToNodeHandler) => {
				scrollHandler = handler;
			});

			const scrollToRowMock = vi.fn();

			vi.useFakeTimers();

			render(
				<TreeTable
					id="test"
					root={TREE_TABLE_NODE}
					columns={COLUMNS}
					scrollToNode={scrollToNodeFn}
					virtualScrollOptions={{
						rowHeight: 40,
						listRef: (ref) => {
							if (ref) {
								ref.scrollToRow = scrollToRowMock;
							}
						}
					}}
				/>
			);

			scrollHandler?.(2);

			vi.runAllTimers();

			expect(scrollToRowMock).toHaveBeenCalledTimes(1);
		});

		test("scrollToNode with autoFocus focuses the row via virtualizedList", () => {
			let scrollHandler: TreeTableScrollToNodeHandler | undefined;
			const scrollToNodeFn = vi.fn((handler: TreeTableScrollToNodeHandler) => {
				scrollHandler = handler;
			});

			const scrollToRowMock = vi.fn();
			const focusMock = vi.fn();

			vi.useFakeTimers();

			render(
				<TreeTable
					id="test"
					root={TREE_TABLE_NODE}
					columns={COLUMNS}
					scrollToNode={scrollToNodeFn}
					virtualScrollOptions={{
						rowHeight: 40,
						listRef: (ref) => {
							if (ref) {
								ref.scrollToRow = scrollToRowMock;
							}
						}
					}}
				/>
			);

			// scrollToRow is mocked, so react-virtualized never actually scrolls
			// and the target node is never rendered into the DOM.
			// Manually append a real subtree so getElementById and closest resolve correctly.
			const rowEl = document.createElement("div");
			rowEl.setAttribute("data-role", DataRoles.Table.Body.Row);
			rowEl.focus = focusMock;

			const nodeEl = document.createElement("div");
			nodeEl.id = "tree-node-name-2";
			rowEl.appendChild(nodeEl);
			document.body.appendChild(rowEl);

			scrollHandler?.(2, { autoFocus: true });

			vi.runAllTimers();

			expect(scrollToRowMock).toHaveBeenCalledTimes(1);
			expect(focusMock).toHaveBeenCalledTimes(1);

			rowEl.remove();
		});
	});
});
