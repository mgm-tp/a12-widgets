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

import { describe, expect, test } from "vitest";
import { renderHook } from "@testing-library/react";

import { useFilterFocusManagement } from "../../main/filter-bar/use-filter-focus-management.js";
import type { UseFilterFocusManagementOptions } from "../../main/filter-bar/use-filter-focus-management.js";

describe("com.mgmtp.a12.widgets.faceted-search.filter-bar.use-focus-management", () => {
	const createMockFilters = () => [
		{ id: "filter1", label: "Filter 1" },
		{ id: "filter2", label: "Filter 2" },
		{ id: "filter3", label: "Filter 3" },
		{ id: "filter4", label: "Filter 4" }
	];

	test("should return isFallbackFocus=false initially", () => {
		const { result } = renderHook(() =>
			useFilterFocusManagement({
				filters: createMockFilters(),
				focusedFilterId: "filter1",
				hiddenIndices: [] as number[]
			})
		);

		expect(result.current.isFallbackFocus).toBe(false);
	});

	test("should return isFallbackFocus=true when focused filter becomes hidden", () => {
		const filters = createMockFilters();
		const { result, rerender } = renderHook(
			(props: UseFilterFocusManagementOptions) => useFilterFocusManagement(props),
			{
				initialProps: {
					filters,
					focusedFilterId: "filter2",
					hiddenIndices: [] as number[]
				}
			}
		);

		expect(result.current.isFallbackFocus).toBe(false);

		rerender({
			filters,
			focusedFilterId: "filter2",
			hiddenIndices: [1]
		});

		expect(result.current.isFallbackFocus).toBe(true);
	});

	test("should return isFallbackFocus=true when focused filter becomes visible", () => {
		const filters = createMockFilters();
		const { result, rerender } = renderHook(
			(props: UseFilterFocusManagementOptions) => useFilterFocusManagement(props),
			{
				initialProps: {
					filters,
					focusedFilterId: "filter3",
					hiddenIndices: [2]
				}
			}
		);

		expect(result.current.isFallbackFocus).toBe(true);

		rerender({
			filters,
			focusedFilterId: "filter3",
			hiddenIndices: []
		});

		expect(result.current.isFallbackFocus).toBe(true);
	});

	test("should not trigger when no filter is focused", () => {
		const filters = createMockFilters();
		const { result, rerender } = renderHook(
			(props: UseFilterFocusManagementOptions) => useFilterFocusManagement(props),
			{
				initialProps: {
					filters,
					focusedFilterId: null,
					hiddenIndices: [] as number[]
				}
			}
		);

		expect(result.current.isFallbackFocus).toBe(false);

		rerender({
			filters,
			focusedFilterId: null,
			hiddenIndices: [0, 1]
		});

		expect(result.current.isFallbackFocus).toBe(false);
	});

	test("should not trigger when focused filter is not found in filter list", () => {
		const filters = createMockFilters();
		const { result, rerender } = renderHook(
			(props: UseFilterFocusManagementOptions) => useFilterFocusManagement(props),
			{
				initialProps: {
					filters,
					focusedFilterId: "nonexistent",
					hiddenIndices: [] as number[]
				}
			}
		);

		expect(result.current.isFallbackFocus).toBe(false);

		rerender({
			filters,
			focusedFilterId: "nonexistent",
			hiddenIndices: [0]
		});

		expect(result.current.isFallbackFocus).toBe(false);
	});

	test("should reset isFallbackFocus to false after visibility change", () => {
		const filters = createMockFilters();
		const { result, rerender } = renderHook(
			(props: UseFilterFocusManagementOptions) => useFilterFocusManagement(props),
			{
				initialProps: {
					filters,
					focusedFilterId: "filter1",
					hiddenIndices: [] as number[]
				}
			}
		);

		rerender({
			filters,
			focusedFilterId: "filter1",
			hiddenIndices: [0]
		});

		expect(result.current.isFallbackFocus).toBe(true);

		rerender({
			filters,
			focusedFilterId: "filter1",
			hiddenIndices: [0]
		});

		expect(result.current.isFallbackFocus).toBe(false);
	});

	test("should handle focus change without visibility change", () => {
		const filters = createMockFilters();
		const { result, rerender } = renderHook(
			(props: UseFilterFocusManagementOptions) => useFilterFocusManagement(props),
			{
				initialProps: {
					filters,
					focusedFilterId: "filter1",
					hiddenIndices: [2, 3]
				}
			}
		);

		expect(result.current.isFallbackFocus).toBe(false);

		rerender({
			filters,
			focusedFilterId: "filter2",
			hiddenIndices: [2, 3]
		});

		expect(result.current.isFallbackFocus).toBe(false);
	});

	test("should detect visibility change when switching to a different filter that was affected", () => {
		const filters = createMockFilters();
		const { result, rerender } = renderHook(
			(props: UseFilterFocusManagementOptions) => useFilterFocusManagement(props),
			{
				initialProps: {
					filters,
					focusedFilterId: "filter1",
					hiddenIndices: [] as number[]
				}
			}
		);

		rerender({
			filters,
			focusedFilterId: "filter3",
			hiddenIndices: [2]
		});

		expect(result.current.isFallbackFocus).toBe(true);
	});

	test("should handle multiple visibility changes correctly", () => {
		const filters = createMockFilters();
		const { result, rerender } = renderHook(
			(props: UseFilterFocusManagementOptions) => useFilterFocusManagement(props),
			{
				initialProps: {
					filters,
					focusedFilterId: "filter2",
					hiddenIndices: [] as number[]
				}
			}
		);

		rerender({
			filters,
			focusedFilterId: "filter2",
			hiddenIndices: [1]
		});

		expect(result.current.isFallbackFocus).toBe(true);

		rerender({
			filters,
			focusedFilterId: "filter2",
			hiddenIndices: []
		});

		expect(result.current.isFallbackFocus).toBe(true);
	});

	test("should handle changes in filter list while maintaining focus tracking", () => {
		const initialFilters = createMockFilters();
		const { result, rerender } = renderHook(
			(props: UseFilterFocusManagementOptions) => useFilterFocusManagement(props),
			{
				initialProps: {
					filters: initialFilters,
					focusedFilterId: "filter2",
					hiddenIndices: [] as number[]
				}
			}
		);

		const updatedFilters = [...initialFilters, { id: "filter5", label: "Filter 5" }];

		rerender({
			filters: updatedFilters,
			focusedFilterId: "filter2",
			hiddenIndices: [1]
		});

		expect(result.current.isFallbackFocus).toBe(true);
	});

	test("should handle edge case when filter moves to different index", () => {
		const { result, rerender } = renderHook(
			(props: UseFilterFocusManagementOptions) => useFilterFocusManagement(props),
			{
				initialProps: {
					filters: [
						{ id: "filter1", label: "Filter 1" },
						{ id: "filter2", label: "Filter 2" },
						{ id: "filter3", label: "Filter 3" }
					],
					focusedFilterId: "filter2",
					hiddenIndices: [] as number[]
				}
			}
		);

		rerender({
			filters: [
				{ id: "filter2", label: "Filter 2" },
				{ id: "filter1", label: "Filter 1" },
				{ id: "filter3", label: "Filter 3" }
			],
			focusedFilterId: "filter2",
			hiddenIndices: [0]
		});

		expect(result.current.isFallbackFocus).toBe(true);
	});

	test("should handle transition from undefined to null focusedFilterId", () => {
		const filters = createMockFilters();
		const { result, rerender } = renderHook(
			(props: UseFilterFocusManagementOptions) => useFilterFocusManagement(props),
			{
				initialProps: {
					filters,
					focusedFilterId: undefined,
					hiddenIndices: [] as number[]
				}
			}
		);

		expect(result.current.isFallbackFocus).toBe(false);

		rerender({
			filters,
			focusedFilterId: undefined,
			hiddenIndices: [0]
		});

		expect(result.current.isFallbackFocus).toBe(false);
	});

	test("should handle empty filters array", () => {
		const { result, rerender } = renderHook(
			(props: UseFilterFocusManagementOptions) => useFilterFocusManagement(props),
			{
				initialProps: {
					filters: [],
					focusedFilterId: "filter1",
					hiddenIndices: [] as number[]
				}
			}
		);

		expect(result.current.isFallbackFocus).toBe(false);

		rerender({
			filters: [],
			focusedFilterId: "filter1",
			hiddenIndices: [0]
		});

		expect(result.current.isFallbackFocus).toBe(false);
	});
});
