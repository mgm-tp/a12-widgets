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

import { SizeDetectorUtils } from "../main/size-detector.utils.js";

const breakPoints = SizeDetectorUtils.DefaultBreakPoints;

describe("SizeDetectorUtils.lookupBreakPoint", () => {
	test("returns xs for width below first breakpoint", () => {
		expect(SizeDetectorUtils.lookupBreakPoint(breakPoints, 100)).toEqual({ width: 575, size: "xs" });
	});

	test("returns xs for width exactly at first breakpoint", () => {
		expect(SizeDetectorUtils.lookupBreakPoint(breakPoints, 575)).toEqual({ width: 575, size: "xs" });
	});

	test("returns sm for width between first and second breakpoint", () => {
		expect(SizeDetectorUtils.lookupBreakPoint(breakPoints, 600)).toEqual({ width: 767, size: "sm" });
	});

	test("returns md for width between second and third breakpoint", () => {
		expect(SizeDetectorUtils.lookupBreakPoint(breakPoints, 767)).toEqual({ width: 767, size: "sm" });
	});

	test("returns md for width between second and third breakpoint", () => {
		expect(SizeDetectorUtils.lookupBreakPoint(breakPoints, 768)).toEqual({ width: 991, size: "md" });
	});

	test("returns md for width between second and third breakpoint", () => {
		expect(SizeDetectorUtils.lookupBreakPoint(breakPoints, 991)).toEqual({ width: 991, size: "md" });
	});

	test("returns lg for width above third breakpoint", () => {
		expect(SizeDetectorUtils.lookupBreakPoint(breakPoints, 1200)).toEqual({
			width: Number.POSITIVE_INFINITY,
			size: "lg"
		});
	});

	test("returns lg for undefined width", () => {
		expect(SizeDetectorUtils.lookupBreakPoint(breakPoints, undefined)).toEqual({
			width: Number.POSITIVE_INFINITY,
			size: "lg"
		});
	});
});
