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

import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { page } from "vitest/browser";

import { hasRectChanged, computeMaxSize } from "../main/attached-portal.internal.js";

describe("attached-portal.internal", () => {
	describe("hasRectChanged", () => {
		test("should return false when both rects are undefined", () => {
			expect(hasRectChanged(undefined, undefined)).toBe(false);
		});

		test("should return false when previous rect is undefined", () => {
			const currentRect = new DOMRect(0, 0, 100, 100);
			expect(hasRectChanged(undefined, currentRect)).toBe(false);
		});

		test("should return false when current rect is undefined", () => {
			const previousRect = new DOMRect(0, 0, 100, 100);
			expect(hasRectChanged(previousRect, undefined)).toBe(false);
		});

		test("should return false when rects are identical", () => {
			const previousRect = new DOMRect(10, 20, 100, 200);
			const currentRect = new DOMRect(10, 20, 100, 200);
			expect(hasRectChanged(previousRect, currentRect)).toBe(false);
		});

		test("should return true when top position changes", () => {
			const previousRect = new DOMRect(10, 20, 100, 200);
			const currentRect = new DOMRect(10, 30, 100, 200);
			expect(hasRectChanged(previousRect, currentRect)).toBe(true);
		});

		test("should return true when left position changes", () => {
			const previousRect = new DOMRect(10, 20, 100, 200);
			const currentRect = new DOMRect(20, 20, 100, 200);
			expect(hasRectChanged(previousRect, currentRect)).toBe(true);
		});

		test("should return true when width changes", () => {
			const previousRect = new DOMRect(10, 20, 100, 200);
			const currentRect = new DOMRect(10, 20, 150, 200);
			expect(hasRectChanged(previousRect, currentRect)).toBe(true);
		});

		test("should return true when height changes", () => {
			const previousRect = new DOMRect(10, 20, 100, 200);
			const currentRect = new DOMRect(10, 20, 100, 250);
			expect(hasRectChanged(previousRect, currentRect)).toBe(true);
		});

		test("should return true when multiple properties change", () => {
			const previousRect = new DOMRect(10, 20, 100, 200);
			const currentRect = new DOMRect(50, 100, 150, 300);
			expect(hasRectChanged(previousRect, currentRect)).toBe(true);
		});

		test("should handle zero values correctly", () => {
			const previousRect = new DOMRect(0, 0, 0, 0);
			const currentRect = new DOMRect(0, 0, 0, 0);
			expect(hasRectChanged(previousRect, currentRect)).toBe(false);
		});

		test("should detect change from zero to non-zero", () => {
			const previousRect = new DOMRect(0, 0, 0, 0);
			const currentRect = new DOMRect(10, 10, 100, 100);
			expect(hasRectChanged(previousRect, currentRect)).toBe(true);
		});

		test("should handle negative values correctly", () => {
			const previousRect = new DOMRect(-10, -20, 100, 200);
			const currentRect = new DOMRect(-10, -20, 100, 200);
			expect(hasRectChanged(previousRect, currentRect)).toBe(false);
		});
	});

	describe("computeMaxSize", () => {
		let originalViewport: { width: number; height: number };

		beforeEach(async () => {
			originalViewport = { width: window.innerWidth, height: window.innerHeight };
			await page.viewport(1920, 1080);
		});

		afterEach(async () => {
			await page.viewport(originalViewport.width, originalViewport.height);
		});

		test("should compute max size for bottom-start orientation", () => {
			const referenceRect = { left: 100, right: 200, top: 100, bottom: 150, width: 100, height: 50, x: 100, y: 100 };

			const result = computeMaxSize(referenceRect, "bottom-start");

			expect(result.maxWidth).toBeGreaterThan(0);
			expect(result.maxHeight).toBeGreaterThan(0);
		});

		test("should compute max size for top-end orientation", () => {
			const referenceRect = { left: 100, right: 200, top: 200, bottom: 250, width: 100, height: 50, x: 100, y: 200 };

			const result = computeMaxSize(referenceRect, "top-end");

			expect(result.maxWidth).toBeGreaterThan(0);
			expect(result.maxHeight).toBeGreaterThan(0);
		});

		test("should compute max size for right-start orientation", () => {
			const referenceRect = { left: 100, right: 200, top: 100, bottom: 150, width: 100, height: 50, x: 100, y: 100 };

			const result = computeMaxSize(referenceRect, "right-start");

			expect(result.maxWidth).toBeGreaterThan(0);
			expect(result.maxHeight).toBeGreaterThan(0);
		});

		test("should compute max size for left-end orientation", () => {
			const referenceRect = { left: 500, right: 600, top: 100, bottom: 150, width: 100, height: 50, x: 500, y: 100 };

			const result = computeMaxSize(referenceRect, "left-end");

			expect(result.maxWidth).toBeGreaterThan(0);
			expect(result.maxHeight).toBeGreaterThan(0);
		});

		test("should return rounded values", () => {
			const referenceRect = {
				left: 100.5,
				right: 200.5,
				top: 100.5,
				bottom: 150.5,
				width: 100,
				height: 50,
				x: 100.5,
				y: 100.5
			};

			const result = computeMaxSize(referenceRect, "bottom-start");

			expect(Number.isInteger(result.maxWidth)).toBe(true);
			expect(Number.isInteger(result.maxHeight)).toBe(true);
		});
	});
});
