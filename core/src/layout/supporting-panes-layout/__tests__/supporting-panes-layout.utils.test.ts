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

import { convertToPixel, useLayoutWidth } from "../main/supporting-panes-layout.utils.js";

describe("com.mgmtp.a12.widgets.layout.supporting-panes-layout.utils", () => {
	describe("useLayoutWidth", () => {
		const mockParentElement = {
			offsetWidth: 1000
		} as HTMLElement;

		const mockPaneRef: any = {
			current: {
				parentElement: mockParentElement
			}
		};

		const widthConfig = {
			minResize: "10%",
			maxResize: "500px",
			collapsed: "5%",
			expanded: "50%"
		};

		test("should calculate widths correctly based on widthConfig", () => {
			const { result } = renderHook(() =>
				useLayoutWidth({
					paneRef: mockPaneRef,
					widthConfig
				})
			);

			expect(result.current.resizeMinWidth).toBe(100); // 10% of 1000
			expect(result.current.resizeMaxWidth).toBe(500); // 500px
			expect(result.current.collapsedWidth).toBe(50); // 5% of 1000
			expect(result.current.expandedWidth).toBe(500); // 50% of 1000
		});

		test("should return 0 for all widths if parentElement is null", () => {
			const { result } = renderHook(() =>
				useLayoutWidth({
					paneRef: { current: null },
					widthConfig
				})
			);

			expect(result.current.resizeMinWidth).toBe(0);
			expect(result.current.resizeMaxWidth).toBe(0);
			expect(result.current.collapsedWidth).toBe(0);
			expect(result.current.expandedWidth).toBe(0);
		});

		test("should handle numeric widthConfig values", () => {
			const numericWidthConfig = {
				minResize: 200,
				maxResize: 800,
				collapsed: 100,
				expanded: 600
			};

			const { result } = renderHook(() =>
				useLayoutWidth({
					paneRef: mockPaneRef,
					widthConfig: numericWidthConfig
				})
			);

			expect(result.current.resizeMinWidth).toBe(200);
			expect(result.current.resizeMaxWidth).toBe(800);
			expect(result.current.collapsedWidth).toBe(100);
			expect(result.current.expandedWidth).toBe(600);
		});
	});

	describe("convertToPixel", () => {
		const mockParentElement = { offsetWidth: 1000 } as HTMLElement;

		test("should return the dimension as is when it is a number", () => {
			expect(convertToPixel(mockParentElement, 100)).toBe(100);
		});

		test("should calculate percentage-based dimensions", () => {
			expect(convertToPixel(mockParentElement, "50%")).toBe(500);
			expect(convertToPixel(mockParentElement, "10%")).toBe(100);
		});

		test("should parse pixel-based dimensions", () => {
			expect(convertToPixel(mockParentElement, "200px")).toBe(200);
			expect(convertToPixel(mockParentElement, "50px")).toBe(50);
		});

		test("should return 0 for invalid or undefined dimensions", () => {
			expect(convertToPixel(mockParentElement, undefined)).toBe(0);
			expect(convertToPixel(mockParentElement, "invalid")).toBe(0);
			expect(convertToPixel(mockParentElement, "")).toBe(0);
		});

		test("should return 0 if parentElement is null ", () => {
			expect(convertToPixel(null, "50%")).toBe(0);
			expect(convertToPixel(null, "50px")).toBe(0);
			expect(convertToPixel(null, "50")).toBe(0);
		});
	});
});
