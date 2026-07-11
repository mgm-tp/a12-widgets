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

import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { page } from "vitest/browser";

import type { Orientation } from "../main/alignment.js";
import { adjustParentMarginForEdges } from "../main/portal-utils.js";

describe("com.mgmtp.a12.widgets.common.portal-utils.adjustParentMarginForEdges", () => {
	let mockElement: HTMLElement;
	const defaultMargin = "-10px";
	let originalViewport: { width: number; height: number };

	beforeEach(async () => {
		originalViewport = { width: window.innerWidth, height: window.innerHeight };
		await page.viewport(1024, originalViewport.height);

		// Create a mock element
		mockElement = document.createElement("div");
	});

	afterEach(async () => {
		vi.restoreAllMocks();
		await page.viewport(originalViewport.width, originalViewport.height);
	});

	test("should return default margin when no reference element is provided", () => {
		const result = adjustParentMarginForEdges(defaultMargin, "top-start", null);
		expect(result).toBe(defaultMargin);
	});

	test("should return default margin when no orientation is provided", () => {
		const result = adjustParentMarginForEdges(defaultMargin, undefined, mockElement);
		expect(result).toBe(defaultMargin);
	});

	test("should return default margin when reference element is undefined", () => {
		const result = adjustParentMarginForEdges(defaultMargin, "top-start", undefined);
		expect(result).toBe(defaultMargin);
	});

	describe("top-start orientation", () => {
		test("should return 0px when element is at left edge", () => {
			vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
				left: 0,
				right: 100,
				top: 50,
				bottom: 100,
				width: 100,
				height: 50,
				x: 0,
				y: 50,
				toJSON: () => ({})
			});

			const result = adjustParentMarginForEdges(defaultMargin, "top-start", mockElement);
			expect(result).toBe("0px");
		});

		test("should return default margin when element is not at left edge", () => {
			vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
				left: 100,
				right: 200,
				top: 50,
				bottom: 100,
				width: 100,
				height: 50,
				x: 100,
				y: 50,
				toJSON: () => ({})
			});

			const result = adjustParentMarginForEdges(defaultMargin, "top-start", mockElement);
			expect(result).toBe(defaultMargin);
		});
	});

	describe("top-end orientation", () => {
		test("should return 0px when element is at right edge", () => {
			vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
				left: 924,
				right: 1024,
				top: 50,
				bottom: 100,
				width: 100,
				height: 50,
				x: 924,
				y: 50,
				toJSON: () => ({})
			});

			const result = adjustParentMarginForEdges(defaultMargin, "top-end", mockElement);
			expect(result).toBe("0px");
		});

		test("should return 0px when element exceeds right edge", () => {
			vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
				left: 924,
				right: 1030,
				top: 50,
				bottom: 100,
				width: 106,
				height: 50,
				x: 924,
				y: 50,
				toJSON: () => ({})
			});

			const result = adjustParentMarginForEdges(defaultMargin, "top-end", mockElement);
			expect(result).toBe("0px");
		});

		test("should return default margin when element is not at right edge", () => {
			vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
				left: 800,
				right: 900,
				top: 50,
				bottom: 100,
				width: 100,
				height: 50,
				x: 800,
				y: 50,
				toJSON: () => ({})
			});

			const result = adjustParentMarginForEdges(defaultMargin, "top-end", mockElement);
			expect(result).toBe(defaultMargin);
		});
	});

	describe("bottom-start orientation", () => {
		test("should return 0px when element is at left edge", () => {
			vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
				left: 0,
				right: 100,
				top: 50,
				bottom: 100,
				width: 100,
				height: 50,
				x: 0,
				y: 50,
				toJSON: () => ({})
			});

			const result = adjustParentMarginForEdges(defaultMargin, "bottom-start", mockElement);
			expect(result).toBe("0px");
		});

		test("should return default margin when element is not at left edge", () => {
			vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
				left: 50,
				right: 150,
				top: 50,
				bottom: 100,
				width: 100,
				height: 50,
				x: 50,
				y: 50,
				toJSON: () => ({})
			});

			const result = adjustParentMarginForEdges(defaultMargin, "bottom-start", mockElement);
			expect(result).toBe(defaultMargin);
		});
	});

	describe("bottom-end orientation", () => {
		test("should return 0px when element is at right edge", () => {
			vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
				left: 924,
				right: 1024,
				top: 50,
				bottom: 100,
				width: 100,
				height: 50,
				x: 924,
				y: 50,
				toJSON: () => ({})
			});

			const result = adjustParentMarginForEdges(defaultMargin, "bottom-end", mockElement);
			expect(result).toBe("0px");
		});

		test("should return default margin when element is not at right edge", () => {
			vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
				left: 500,
				right: 600,
				top: 50,
				bottom: 100,
				width: 100,
				height: 50,
				x: 500,
				y: 50,
				toJSON: () => ({})
			});

			const result = adjustParentMarginForEdges(defaultMargin, "bottom-end", mockElement);
			expect(result).toBe(defaultMargin);
		});
	});

	describe("other orientations", () => {
		const nonEdgeOrientations: Orientation[] = [
			"top",
			"bottom",
			"left",
			"right",
			"left-start",
			"left-end",
			"right-start",
			"right-end"
		];

		test.each(nonEdgeOrientations)(
			"should return default margin for %s orientation regardless of position",
			(orientation) => {
				// Test at left edge
				vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
					left: 0,
					right: 100,
					top: 50,
					bottom: 100,
					width: 100,
					height: 50,
					x: 0,
					y: 50,
					toJSON: () => ({})
				});

				let result = adjustParentMarginForEdges(defaultMargin, orientation, mockElement);
				expect(result).toBe(defaultMargin);

				// Test at right edge
				vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
					left: 924,
					right: 1024,
					top: 50,
					bottom: 100,
					width: 100,
					height: 50,
					x: 924,
					y: 50,
					toJSON: () => ({})
				});

				result = adjustParentMarginForEdges(defaultMargin, orientation, mockElement);
				expect(result).toBe(defaultMargin);
			}
		);
	});
});
