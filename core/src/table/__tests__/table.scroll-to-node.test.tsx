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
import { describe, test, expect, vi } from "vitest";

import { Range } from "../../common/main/utils.js";

import type { RowLoadingStatus } from "../main/infinite-scroll.api.js";
import { DefaultTableComponentRenderers, TableContextProvider } from "../main/table.view.js";
import { Body } from "../main/table.body.view.js";
import { VirtualizedBody } from "../main/table.virtualized-body.view.js";
import { InfiniteScrollBody } from "../main/table.infinite-scroll-body.view.js";
import type { TableScrollToNodeHandler } from "../main/table-renderer.api.js";

describe("com.mgmtp.a12.widgets.table.scroll-to-node", () => {
	const COLUMN_COUNT = 4;
	("");
	const ROW_COUNT = 10;
	const ROW_HEIGHT = 50;

	const data: number[][] = Array.from(new Range(ROW_COUNT)).map(() =>
		Array.from(new Range(COLUMN_COUNT)).map(() => Math.random() * 100)
	);

	describe("Body", () => {
		test("scrollToNode handler is called", () => {
			let scrollHandler: TableScrollToNodeHandler | undefined;
			const scrollToNodeFn = vi.fn((handler: TableScrollToNodeHandler) => {
				scrollHandler = handler;
			});

			render(
				<TableContextProvider
					value={{
						componentRenderers: DefaultTableComponentRenderers,
						columns: []
					}}
				>
					<Body data={data} scrollToNode={scrollToNodeFn} />
				</TableContextProvider>
			);

			expect(scrollToNodeFn).toHaveBeenCalledTimes(1);
			expect(scrollHandler).toBeDefined();
		});

		test("scrollToNode scrolls to specified node", () => {
			let scrollHandler: TableScrollToNodeHandler | undefined;
			const scrollToNodeFn = vi.fn((handler: TableScrollToNodeHandler) => {
				scrollHandler = handler;
			});

			const scrollIntoViewMock = vi.fn();
			const focusMock = vi.fn();

			const { container } = render(
				<TableContextProvider
					value={{
						componentRenderers: DefaultTableComponentRenderers,
						columns: []
					}}
				>
					<Body data={data} scrollToNode={scrollToNodeFn} />
				</TableContextProvider>
			);

			// Get all row elements
			const rows = container.querySelectorAll('[role="row"]');

			// Mock scrollIntoView and focus on the target row (index 5)
			if (rows[5]) {
				rows[5].scrollIntoView = scrollIntoViewMock;
				(rows[5] as HTMLElement).focus = focusMock;
			}

			// Call the handler to scroll to node 5
			scrollHandler?.(5);

			expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: "center" });
			expect(focusMock).not.toHaveBeenCalled();
		});

		test("scrollToNode with autoFocus option", () => {
			let scrollHandler: TableScrollToNodeHandler | undefined;
			const scrollToNodeFn = vi.fn((handler: TableScrollToNodeHandler) => {
				scrollHandler = handler;
			});

			const scrollIntoViewMock = vi.fn();
			const focusMock = vi.fn();

			const { container } = render(
				<TableContextProvider
					value={{
						componentRenderers: DefaultTableComponentRenderers,
						columns: []
					}}
				>
					<Body data={data} scrollToNode={scrollToNodeFn} />
				</TableContextProvider>
			);

			// Get all row elements
			const rows = container.querySelectorAll('[role="row"]');

			// Mock scrollIntoView and focus on the target row (index 3)
			if (rows[3]) {
				rows[3].scrollIntoView = scrollIntoViewMock;
				(rows[3] as HTMLElement).focus = focusMock;
			}

			// Call the handler with autoFocus
			scrollHandler?.(3, { autoFocus: true });

			expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: "center" });
			expect(focusMock).toHaveBeenCalledTimes(1);
		});
	});

	describe("VirtualizedBody", () => {
		test("scrollToNode handler is called", () => {
			let scrollHandler: TableScrollToNodeHandler | undefined;
			const scrollToNodeFn = vi.fn((handler: TableScrollToNodeHandler) => {
				scrollHandler = handler;
			});

			render(
				<TableContextProvider
					value={{
						componentRenderers: DefaultTableComponentRenderers,
						columns: []
					}}
				>
					<VirtualizedBody data={data} virtualScrollOptions={{ rowHeight: ROW_HEIGHT }} scrollToNode={scrollToNodeFn} />
				</TableContextProvider>
			);

			expect(scrollToNodeFn).toHaveBeenCalledTimes(1);
			expect(scrollHandler).toBeDefined();
		});
	});

	describe("InfiniteScrollBody", () => {
		test("scrollToNode handler is called", () => {
			let scrollHandler: TableScrollToNodeHandler | undefined;
			const scrollToNodeFn = vi.fn((handler: TableScrollToNodeHandler) => {
				scrollHandler = handler;
			});

			const loadData = vi.fn(() => Promise.resolve());
			const rowLoadingStatus = vi.fn((_rowIndex: number): RowLoadingStatus => "loaded");

			render(
				<TableContextProvider
					value={{
						componentRenderers: DefaultTableComponentRenderers,
						columns: []
					}}
				>
					<InfiniteScrollBody
						data={data}
						infiniteScrollOptions={{
							rowHeight: ROW_HEIGHT,
							rowCount: ROW_COUNT,
							loadData,
							rowLoadingStatus
						}}
						scrollToNode={scrollToNodeFn}
					/>
				</TableContextProvider>
			);

			expect(scrollToNodeFn).toHaveBeenCalledTimes(1);
			expect(scrollHandler).toBeDefined();
		});
	});
});
