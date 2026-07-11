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

import { describe, test, expect } from "vitest";

import { normalizePanelWidth } from "../main/utils.js";

describe("normalizePanelWidth", () => {
	const minWidth = 360;
	const maxWidth = 720;

	describe("phone device", () => {
		test("should return 100% when isPhone is true, regardless of width", () => {
			expect(normalizePanelWidth(undefined, minWidth, true, maxWidth)).toBe("100%");
			expect(normalizePanelWidth(200, minWidth, true, maxWidth)).toBe("100%");
			expect(normalizePanelWidth(500, minWidth, true, maxWidth)).toBe("100%");
			expect(normalizePanelWidth("250px", minWidth, true, maxWidth)).toBe("100%");
			expect(normalizePanelWidth("50%", minWidth, true, maxWidth)).toBe("100%");
		});
	});

	describe("undefined width", () => {
		test("should return maxWidth when width is undefined and not on phone", () => {
			expect(normalizePanelWidth(undefined, minWidth, false, maxWidth)).toBe("720px");
		});
	});

	describe("percentage values", () => {
		test("should return percentage strings as-is", () => {
			expect(normalizePanelWidth("50%", minWidth, false, maxWidth)).toBe("50%");
			expect(normalizePanelWidth("100%", minWidth, false, maxWidth)).toBe("100%");
			expect(normalizePanelWidth("25%", minWidth, false, maxWidth)).toBe("25%");
			expect(normalizePanelWidth("75%", minWidth, false, maxWidth)).toBe("75%");
		});
	});

	describe("number values", () => {
		test("should return minWidth with px when number is less than minWidth", () => {
			expect(normalizePanelWidth(200, minWidth, false, maxWidth)).toBe("360px");
			expect(normalizePanelWidth(100, minWidth, false, maxWidth)).toBe("360px");
			expect(normalizePanelWidth(0, minWidth, false, maxWidth)).toBe("360px");
			expect(normalizePanelWidth(359, minWidth, false, maxWidth)).toBe("360px");
		});

		test("should return width with px when number equals minWidth", () => {
			expect(normalizePanelWidth(360, minWidth, false, maxWidth)).toBe("360px");
		});

		test("should return width with px when number is greater than minWidth", () => {
			expect(normalizePanelWidth(400, minWidth, false, maxWidth)).toBe("400px");
			expect(normalizePanelWidth(500, minWidth, false, maxWidth)).toBe("500px");
			expect(normalizePanelWidth(1000, minWidth, false, maxWidth)).toBe("1000px");
		});
	});

	describe("string values with px suffix", () => {
		test("should return minWidth with px when numeric value is less than minWidth", () => {
			expect(normalizePanelWidth("200px", minWidth, false, maxWidth)).toBe("360px");
			expect(normalizePanelWidth("100px", minWidth, false, maxWidth)).toBe("360px");
			expect(normalizePanelWidth("0px", minWidth, false, maxWidth)).toBe("360px");
			expect(normalizePanelWidth("359px", minWidth, false, maxWidth)).toBe("360px");
		});

		test("should return width with px when numeric value equals minWidth", () => {
			expect(normalizePanelWidth("360px", minWidth, false, maxWidth)).toBe("360px");
		});

		test("should return width with px when numeric value is greater than minWidth", () => {
			expect(normalizePanelWidth("400px", minWidth, false, maxWidth)).toBe("400px");
			expect(normalizePanelWidth("500px", minWidth, false, maxWidth)).toBe("500px");
			expect(normalizePanelWidth("1000px", minWidth, false, maxWidth)).toBe("1000px");
		});
	});
});
