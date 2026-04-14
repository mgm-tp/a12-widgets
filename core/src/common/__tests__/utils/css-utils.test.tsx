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

import { getTransitionDuration, getVerticalGap, parseShorthandSpacing } from "../../main/utils/css-utils.js";

describe("parseShorthandSpacing", () => {
	test("should parse 1 value correctly", () => {
		const result = parseShorthandSpacing("10px");
		expect(result).toEqual({ top: "10px", right: "10px", bottom: "10px", left: "10px" });
	});

	test("should parse 2 values correctly", () => {
		const result = parseShorthandSpacing("10px 20px");
		expect(result).toEqual({ top: "10px", right: "20px", bottom: "10px", left: "20px" });
	});

	test("should parse 3 values correctly", () => {
		const result = parseShorthandSpacing("10px 20px 30px");
		expect(result).toEqual({ top: "10px", right: "20px", bottom: "30px", left: "20px" });
	});

	test("should parse 4 values correctly", () => {
		const result = parseShorthandSpacing("10px 20px 30px 40px");
		expect(result).toEqual({ top: "10px", right: "20px", bottom: "30px", left: "40px" });
	});
});

describe("getTransitionDuration", () => {
	test("should return 0 for when the duration is 0", () => {
		expect(getTransitionDuration("0")).toBe(0);
	});

	test("should return 0 when the duration is `initial`", () => {
		expect(getTransitionDuration("initial")).toBe(0);
	});

	test("should convert milliseconds to seconds", () => {
		expect(getTransitionDuration("500ms")).toBe(0.5);
		expect(getTransitionDuration("1500ms")).toBe(1.5);
	});

	test("should return seconds as a number", () => {
		expect(getTransitionDuration("2s")).toBe(2);
		expect(getTransitionDuration("0.75s")).toBe(0.75);
	});

	test("should throw an error for invalid duration formats", () => {
		// @ts-expect-error test for invalid value
		expect(() => getTransitionDuration("invalid")).toThrow("Invalid duration format: invalid");
		// @ts-expect-error test for invalid value
		expect(() => getTransitionDuration("123")).toThrow("Invalid duration format: 123");
	});
});

describe("getVerticalGap", () => {
	test("should parse px values correctly", () => {
		expect(getVerticalGap("10px")).toBe(10);
		expect(getVerticalGap("25.5px")).toBe(25.5);
		expect(getVerticalGap("0px")).toBe(0);
	});

	test("should parse rem values correctly", () => {
		// Default browser font size is 16px
		expect(getVerticalGap("1rem")).toBe(16);
		expect(getVerticalGap("1.5rem")).toBe(24);
		expect(getVerticalGap("0.5rem")).toBe(8);
	});

	test("should throw an error for unsupported units", () => {
		expect(() => getVerticalGap("10")).toThrow("Unsupported unit for gap value");
		expect(() => getVerticalGap("")).toThrow();
		expect(() => getVerticalGap("invalid")).toThrow();
	});
});
