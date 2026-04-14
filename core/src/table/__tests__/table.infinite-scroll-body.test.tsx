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

import { getAllByDataRole, render } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { Range } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { DefaultTableComponentRenderers, TableContextProvider } from "../new-api/table.view.js";
import { InfiniteScrollBody } from "../new-api/table.infinite-scroll-body.view.js";

describe("com.mgmtp.a12.widgets.table.infinite-scroll-body", () => {
	const COLUMN_COUNT = 4;
	const ROW_COUNT = 10;
	const ROW_HEIGHT = 50;
	const data: number[][] = Array.from(new Range(ROW_COUNT)).map(() =>
		Array.from(new Range(COLUMN_COUNT)).map(() => Math.random() * 100)
	);
	const loadData = () => Promise.resolve();

	test("TableTemplate.Body", () => {
		const { container } = render(
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
						rowLoadingStatus: () => "loaded",
						loadData
					}}
				/>
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("InfiniteLoader", () => {
		const loaderRefFn = vi.fn();
		const { container } = render(
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
						threshold: 20,
						minimumBatchSize: 20,
						rowLoadingStatus: () => "loaded",
						loadData,
						loaderRef: loaderRefFn
					}}
				/>
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		expect(loaderRefFn).toHaveBeenCalledTimes(1);
	});

	test("List", () => {
		const overrideListProps = {
			listRef: vi.fn(),
			style: { color: "red" }
		};
		const { container } = render(
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
						overrideListProps,
						rowLoadingStatus: () => "loaded",
						loadData
					}}
				/>
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		expect(overrideListProps.listRef).toHaveBeenCalled();
	});

	test("renders placeholder rows for loading and unloaded indices", () => {
		const loadingStateMap: Record<number, "loading" | "loaded" | undefined> = {
			0: "loading",
			1: "loaded"
		};
		const sparseData = [undefined, data[1], undefined];
		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: [{ label: "Column 1" }]
				}}
			>
				<InfiniteScrollBody
					data={sparseData}
					infiniteScrollOptions={{
						rowHeight: ROW_HEIGHT,
						rowCount: sparseData.length,
						rowLoadingStatus: (index) => loadingStateMap[index],
						loadData
					}}
				/>
			</TableContextProvider>
		);

		const mainBodyRows = getAllByDataRole(container, DataRoles.Table.Body.Row).filter(
			(el) => !el.closest("[aria-hidden='true']")
		);
		expect(mainBodyRows.length).toEqual(sparseData.length);

		const mainPlaceholders = getAllByDataRole(container, DataRoles.Table.Body.Content.Placeholder).filter(
			(el) => !el.closest("[aria-hidden='true']")
		);
		expect(mainPlaceholders.length).toEqual(2);
	});

	test("renders an aria-hidden placeholder background layer to prevent blank during fast scrolling", () => {
		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: [{ label: "Col" }]
				}}
			>
				<InfiniteScrollBody
					data={data}
					infiniteScrollOptions={{
						rowHeight: ROW_HEIGHT,
						rowCount: ROW_COUNT,
						rowLoadingStatus: () => "loaded",
						loadData
					}}
				/>
			</TableContextProvider>
		);

		const bgLayer = container.querySelector("[aria-hidden='true']");
		expect(bgLayer).not.toBeNull();
		expect(bgLayer?.tagName.toLowerCase()).toBe("div");
	});

	test("placeholder background layer fills viewport with Math.ceil(height / rowHeight) skeleton rows", () => {
		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: [{ label: "Col" }]
				}}
			>
				<InfiniteScrollBody
					data={data}
					infiniteScrollOptions={{
						rowHeight: ROW_HEIGHT,
						rowCount: ROW_COUNT,
						rowLoadingStatus: () => "loaded",
						loadData
					}}
				/>
			</TableContextProvider>
		);

		const bgLayer = container.querySelector("[aria-hidden='true']") as HTMLElement;
		const bgLayerHeight = bgLayer.offsetHeight;
		const bgSkeletonRows = bgLayer.querySelectorAll(`[data-role='${DataRoles.Table.Body.Content.Placeholder}']`);

		expect(bgSkeletonRows.length).toBe(Math.ceil(bgLayerHeight / ROW_HEIGHT));
	});
});
