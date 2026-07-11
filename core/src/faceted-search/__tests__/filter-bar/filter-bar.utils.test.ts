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

import { describe, test, expect, beforeEach, vi } from "vitest";

import { handleCompactMode, handleCollapseMode } from "../../main/filter-bar/filter-bar.utils.js";

const mockStyleMap = new Map<
	HTMLElement,
	{ marginLeft: number; marginRight: number; paddingLeft: number; paddingRight: number }
>();

function createMockElement(width: number, marginLeft: number = 0, marginRight: number = 0): HTMLElement {
	const element = document.createElement("div");

	element.getBoundingClientRect = vi.fn(() => ({
		width,
		height: 30,
		top: 0,
		left: 0,
		bottom: 30,
		right: width,
		x: 0,
		y: 0,
		toJSON: () => ({})
	}));

	mockStyleMap.set(element, {
		marginLeft,
		marginRight,
		paddingLeft: 0,
		paddingRight: 0
	});

	return element;
}

describe("filter-bar.utils", () => {
	const hiddenClass = "h_hidden";
	let mockFilters: HTMLElement[];

	beforeEach(() => {
		mockStyleMap.clear();

		const originalGetComputedStyle = window.getComputedStyle.bind(window);
		window.getComputedStyle = vi.fn((el) => {
			const mockStyle = mockStyleMap.get(el as HTMLElement);

			if (mockStyle) {
				return {
					marginLeft: `${mockStyle.marginLeft}px`,
					marginRight: `${mockStyle.marginRight}px`,
					paddingLeft: `${mockStyle.paddingLeft}px`,
					paddingRight: `${mockStyle.paddingRight}px`
				} as CSSStyleDeclaration;
			}

			return originalGetComputedStyle(el);
		});

		mockFilters = [
			createMockElement(100, 10, 10),
			createMockElement(150, 5, 5),
			createMockElement(80, 0, 0),
			createMockElement(200, 15, 15)
		];
	});

	describe("handleCompactMode", () => {
		test("shows all filters when width is sufficient", () => {
			const hiddenIndices = handleCompactMode(mockFilters, hiddenClass, 700);

			expect(hiddenIndices).toEqual([]);
			mockFilters.forEach((filter) => {
				expect(filter.classList.contains(hiddenClass)).toBe(false);
			});
		});

		test("hides filters that don't fit", () => {
			const hiddenIndices = handleCompactMode(mockFilters, hiddenClass, 300);

			expect(hiddenIndices).toEqual([2, 3]);
			expect(mockFilters[0].classList.contains(hiddenClass)).toBe(false);
			expect(mockFilters[1].classList.contains(hiddenClass)).toBe(false);
			expect(mockFilters[2].classList.contains(hiddenClass)).toBe(true);
			expect(mockFilters[3].classList.contains(hiddenClass)).toBe(true);
		});

		test("hides all filters when width is zero", () => {
			const hiddenIndices = handleCompactMode(mockFilters, hiddenClass, 0);

			expect(hiddenIndices).toEqual([0, 1, 2, 3]);
			mockFilters.forEach((filter) => {
				expect(filter.classList.contains(hiddenClass)).toBe(true);
			});
		});

		test("handles empty filters array", () => {
			const hiddenIndices = handleCompactMode([], hiddenClass, 1000);
			expect(hiddenIndices).toEqual([]);
		});
	});

	describe("handleCollapseMode", () => {
		let mockContentElement: HTMLElement;
		let mockActionElement: HTMLElement;

		beforeEach(() => {
			mockContentElement = createMockElement(700, 10, 10);
			mockActionElement = createMockElement(40, 0, 0);
			mockFilters.forEach((filter) => filter.classList.remove(hiddenClass));
		});

		test("hides action button when all filters fit", () => {
			handleCollapseMode({
				filters: mockFilters,
				hiddenClass,
				contentElement: mockContentElement,
				actionElement: mockActionElement,
				collapsed: false
			});

			expect(mockActionElement.classList.contains(hiddenClass)).toBe(true);
		});

		test("shows action button when filters overflow and collapsed", () => {
			mockContentElement = createMockElement(300, 10, 10);

			handleCollapseMode({
				filters: mockFilters,
				hiddenClass,
				contentElement: mockContentElement,
				actionElement: mockActionElement,
				collapsed: true
			});

			expect(mockActionElement.classList.contains(hiddenClass)).toBe(false);
		});

		test("hides filters when collapsed and overflowing", () => {
			mockContentElement = createMockElement(300, 10, 10);

			handleCollapseMode({
				filters: mockFilters,
				hiddenClass,
				contentElement: mockContentElement,
				actionElement: mockActionElement,
				collapsed: true
			});

			const hiddenCount = mockFilters.filter((f) => f.classList.contains(hiddenClass)).length;
			expect(hiddenCount).toBeGreaterThan(0);
		});

		test("handles empty filters array", () => {
			expect(() =>
				handleCollapseMode({
					filters: [],
					hiddenClass,
					contentElement: mockContentElement,
					actionElement: mockActionElement,
					collapsed: false
				})
			).not.toThrow();
		});
	});
});
