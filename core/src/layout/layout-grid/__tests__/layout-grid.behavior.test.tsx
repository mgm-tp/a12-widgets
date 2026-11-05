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

import { waitFor } from "@testing-library/dom";
import { getAllByDataRole, getByDataRole, render } from "test-utils";
import { afterEach, describe, expect, test, vi } from "vitest";

import { StyledGridRow } from "../main/layout-grid.styled.js";
import { LayoutGrid } from "../main/layout-grid.view.js";

const { Grid, Column, Row, LayoutGridTemplate } = LayoutGrid;

const gridDataRole = "layout-grid";
const columnDataRole = `${gridDataRole}-column`;

/**
 * Behavioural characterisation of the LayoutGrid, expressed only through the public API and observable
 * geometry (bounding rects, size classes, visibility). Deliberately free of any assertion about *how* the
 * layout is produced, so the very same expectations can be run against the flexbox implementation and
 * against the container-query one.
 */

/** Ratio of a column's width to the width of the grid it lives in, rounded to whole percent. */
const widthRatio = (column: HTMLElement, grid: HTMLElement): number =>
	Math.round((column.getBoundingClientRect().width / grid.getBoundingClientRect().width) * 100);

/**
 * Asserts a column occupies roughly the expected share of its grid. The tolerance absorbs the gutter, which
 * is a theme value and is applied differently by the two implementations, while still pinning down which of
 * the twelve spans a column resolved to.
 */
const expectSpan = (column: HTMLElement, grid: HTMLElement, expectedPercent: number): void =>
	expect(Math.abs(widthRatio(column, grid) - expectedPercent)).toBeLessThanOrEqual(3);

/**
 * All content columns of a grid, excluding the spacer columns that the flexbox implementation renders to
 * realise offsets. Spacers carry the same `data-role`, so positional lookups have to skip them for the
 * expectations to mean the same thing under both implementations.
 */
const columnsOf = (container: HTMLElement): HTMLElement[] =>
	getAllByDataRole(container, columnDataRole).filter((column) => !column.className.includes("column--spacer"));

const sizeClassOf = (grid: HTMLElement): string | undefined =>
	Array.from(grid.classList)
		.find((name) => name.includes("layoutGridSize--"))
		?.split("layoutGridSize--")[1];

describe("com.mgmtp.a12.widgets.layout-grid behaviour", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	describe("breakpoint resolution", () => {
		test("the size class follows the grid's own width", async () => {
			const { container } = render(
				<div style={{ width: "1200px" }}>
					<Grid>
						<Row>
							<Column size={{ sm: 12, md: 6, lg: 3 }}>x</Column>
						</Row>
					</Grid>
				</div>
			);
			const wrapper = container.firstChild as HTMLElement;
			const grid = getByDataRole(container, gridDataRole);

			await waitFor(() => expect(sizeClassOf(grid)).toBe("lg"));

			wrapper.style.width = "900px";
			await waitFor(() => expect(sizeClassOf(grid)).toBe("md"));

			wrapper.style.width = "700px";
			await waitFor(() => expect(sizeClassOf(grid)).toBe("sm"));

			wrapper.style.width = "400px";
			await waitFor(() => expect(sizeClassOf(grid)).toBe("xs"));
		});

		test("onBreakPointChanged reports every breakpoint the grid passes through", async () => {
			const onBreakPointChanged = vi.fn();
			const { container } = render(
				<div style={{ width: "1200px" }}>
					<Grid onBreakPointChanged={onBreakPointChanged}>
						<Row>
							<Column size={{ sm: 12, md: 6, lg: 3 }}>x</Column>
						</Row>
					</Grid>
				</div>
			);
			const wrapper = container.firstChild as HTMLElement;

			await waitFor(() => expect(onBreakPointChanged).toHaveBeenCalledWith(expect.objectContaining({ size: "lg" })));

			wrapper.style.width = "700px";
			await waitFor(() => expect(onBreakPointChanged).toHaveBeenCalledWith(expect.objectContaining({ size: "sm" })));
		});

		test("a resize just below a breakpoint boundary is reported", async () => {
			const onBreakPointChanged = vi.fn();
			const { container } = render(
				<div style={{ width: "1100px" }}>
					<Grid onBreakPointChanged={onBreakPointChanged}>
						<Row>
							<Column size={{ sm: 12, md: 6, lg: 3 }}>x</Column>
						</Row>
					</Grid>
				</div>
			);
			const wrapper = container.firstChild as HTMLElement;
			const grid = getByDataRole(container, gridDataRole);

			await waitFor(() => expect(onBreakPointChanged).toHaveBeenCalledWith(expect.objectContaining({ size: "lg" })));

			// 985px sits a scrollbar width below the 991px md boundary.
			wrapper.style.width = "985px";
			await waitFor(() => expect(onBreakPointChanged).toHaveBeenCalledWith(expect.objectContaining({ size: "md" })));
			await waitFor(() => expect(sizeClassOf(grid)).toBe("md"));
		});

		test("the initial breakpoint is reported without a ResizeObserver", async () => {
			vi.stubGlobal("ResizeObserver", undefined);
			const onBreakPointChanged = vi.fn();
			render(
				<div style={{ width: "1200px" }}>
					<Grid onBreakPointChanged={onBreakPointChanged}>
						<Row>
							<Column size={{ sm: 12, md: 6, lg: 3 }}>x</Column>
						</Row>
					</Grid>
				</div>
			);

			await waitFor(() => expect(onBreakPointChanged).toHaveBeenCalledWith(expect.objectContaining({ size: "lg" })));
		});

		test("a forced size on the template overrides the live width", async () => {
			const { container } = render(
				<div style={{ width: "1200px" }}>
					<LayoutGridTemplate size="md">
						<Row>
							<Column size={{ sm: 12, md: 6, lg: 3 }}>x</Column>
						</Row>
					</LayoutGridTemplate>
				</div>
			);
			const grid = getByDataRole(container, gridDataRole);
			const column = getByDataRole(container, columnDataRole);

			expect(sizeClassOf(grid)).toBe("md");
			await waitFor(() => expectSpan(column, grid, 50));
		});
	});

	describe("column geometry", () => {
		test("column widths follow the breakpoint of their own grid", async () => {
			const { container } = render(
				<div style={{ width: "1200px" }}>
					<Grid>
						<Row>
							<Column size={{ sm: 12, md: 6, lg: 3 }}>x</Column>
						</Row>
					</Grid>
				</div>
			);
			const wrapper = container.firstChild as HTMLElement;
			const grid = getByDataRole(container, gridDataRole);
			const column = getByDataRole(container, columnDataRole);

			await waitFor(() => expectSpan(column, grid, 25));

			wrapper.style.width = "900px";
			await waitFor(() => expectSpan(column, grid, 50));

			wrapper.style.width = "700px";
			await waitFor(() => expectSpan(column, grid, 100));

			// xs stacks columns to the full width
			wrapper.style.width = "400px";
			await waitFor(() => expectSpan(column, grid, 100));
		});

		test("a nested grid resolves its breakpoint against its own width", async () => {
			const { container } = render(
				<div style={{ width: "1200px" }}>
					<Grid>
						<Row>
							<Column size={{ sm: 12, md: 6, lg: 3 }}>
								<Grid>
									<Row>
										<Column size={{ sm: 6, md: 6, lg: 6 }}>inner</Column>
									</Row>
								</Grid>
							</Column>
						</Row>
					</Grid>
				</div>
			);
			const [outerGrid, innerGrid] = getAllByDataRole(container, gridDataRole);
			const [outerColumn, innerColumn] = columnsOf(container);

			// The outer grid is lg (1200px); the nested grid sits in a 3/12 column (~280px), which is xs.
			await waitFor(() => expect(sizeClassOf(outerGrid)).toBe("lg"));
			await waitFor(() => expect(sizeClassOf(innerGrid)).toBe("xs"));
			await waitFor(() => expectSpan(outerColumn, outerGrid, 25));
			await waitFor(() => expectSpan(innerColumn, innerGrid, 100));
		});

		test("a nested column does not inherit the geometry of the outer column", async () => {
			const { container } = render(
				<div style={{ width: "1600px" }}>
					<Grid>
						<Row layoutConfig={{ layout: { lg: [6, 6] } }}>
							<Column>outer</Column>
							<Column>
								<Grid>
									<Row>
										<Column size={{ sm: 12, md: 12, lg: 12 }}>inner</Column>
									</Row>
								</Grid>
							</Column>
						</Row>
					</Grid>
				</div>
			);
			const innerGrid = getAllByDataRole(container, gridDataRole)[1];
			const innerColumn = columnsOf(container)[2];

			// The nested grid is ~790px wide; its single 12-span column must fill it, and must not be
			// pushed to the right by the outer column's placement.
			await waitFor(() => expectSpan(innerColumn, innerGrid, 100));
			expect(innerColumn.getBoundingClientRect().left).toBe(innerGrid.getBoundingClientRect().left);
		});

		test("a nested column falls back to full width for breakpoints its size omits", async () => {
			const { container } = render(
				<div style={{ width: "1600px" }}>
					<Grid>
						<Row>
							<Column size={{ sm: 4, md: 4, lg: 6 }}>
								<Grid>
									<Row>
										<Column size={{ lg: 12 }}>inner</Column>
									</Row>
								</Grid>
							</Column>
						</Row>
					</Grid>
				</div>
			);
			const innerGrid = getAllByDataRole(container, gridDataRole)[1];
			const innerColumn = columnsOf(container)[1];

			// The nested grid is ~790px (md). The inner column defines no md span, so it must fall back
			// to the full width rather than inheriting the outer 4.
			await waitFor(() => expectSpan(innerColumn, innerGrid, 100));
		});

		test("a column size of 0 hides the column", async () => {
			const { container } = render(
				<div style={{ width: "1200px" }}>
					<Grid>
						<Row>
							<Column size={{ sm: 6, md: 6, lg: 0 }}>hidden</Column>
							<Column size={{ sm: 6, md: 6, lg: 12 }}>visible</Column>
						</Row>
					</Grid>
				</div>
			);
			const columns = columnsOf(container);

			await waitFor(() => expect(columns[0]).not.toBeVisible());
			expect(columns[1]).toBeVisible();
		});
	});

	describe("wrapping", () => {
		test("an over-full layout wraps onto a second line", async () => {
			const { container } = render(
				<div style={{ width: "1600px" }}>
					<Grid>
						<Row layoutConfig={{ layout: { lg: [5, 5, 5, 5] } }}>
							<Column>c1</Column>
							<Column>c2</Column>
							<Column>c3</Column>
							<Column>c4</Column>
						</Row>
					</Grid>
				</div>
			);
			const [c1, c2, c3, c4] = columnsOf(container);

			// c1+c2 share the first line; c3 wraps and c4 sits next to it.
			await waitFor(() => expect(c3.getBoundingClientRect().top).toBeGreaterThan(c1.getBoundingClientRect().top));
			expect(c2.getBoundingClientRect().top).toBe(c1.getBoundingClientRect().top);
			expect(c4.getBoundingClientRect().top).toBe(c3.getBoundingClientRect().top);
			expect(c3.getBoundingClientRect().left).toBe(c1.getBoundingClientRect().left);
		});

		test("an offset that crosses the row edge wraps the column to the next line", async () => {
			const { container } = render(
				<div style={{ width: "1600px" }}>
					<Grid>
						<Row layoutConfig={{ layout: { lg: [6, 1, 6] }, offsets: { lg: [0, 1] } }}>
							<Column>c1</Column>
							<Column>c2</Column>
						</Row>
					</Grid>
				</div>
			);
			const [c1, c2] = columnsOf(container);

			// 6 + 1 (offset) + 6 exceeds 12, so the second column starts a new line at the left edge.
			await waitFor(() => expect(c2.getBoundingClientRect().top).toBeGreaterThan(c1.getBoundingClientRect().top));
			expect(c2.getBoundingClientRect().left).toBe(c1.getBoundingClientRect().left);
		});

		test("an offset shifts a column to the right without a preceding sibling", async () => {
			const { container } = render(
				<div style={{ width: "1200px" }}>
					<Grid>
						<Row layoutConfig={{ layout: { lg: [3, 3, 5] }, offsets: { lg: [1, 0, 0] } }}>
							<Column>c1</Column>
							<Column>c2</Column>
							<Column>c3</Column>
						</Row>
					</Grid>
				</div>
			);
			const grid = getByDataRole(container, gridDataRole);
			const [c1, c2, c3] = columnsOf(container);

			// A leading offset of 1 pushes c1 off the left edge of the grid; 1+3+3+5 still fits on one line.
			await waitFor(() => expect(c1.getBoundingClientRect().left).toBeGreaterThan(grid.getBoundingClientRect().left));
			expect(c2.getBoundingClientRect().top).toBe(c1.getBoundingClientRect().top);
			expect(c3.getBoundingClientRect().top).toBe(c1.getBoundingClientRect().top);
			expect(c2.getBoundingClientRect().left).toBeGreaterThan(c1.getBoundingClientRect().left);
			expect(c3.getBoundingClientRect().left).toBeGreaterThan(c2.getBoundingClientRect().left);
		});
	});

	describe("gutters", () => {
		test("a standalone grid row keeps the theme gutters", async () => {
			const { container } = render(
				<StyledGridRow>
					<div>a</div>
					<div>b</div>
				</StyledGridRow>
			);
			const row = container.firstChild as HTMLElement;

			await waitFor(() => expect(getComputedStyle(row).marginBottom).not.toBe("0px"));
		});
	});
});
