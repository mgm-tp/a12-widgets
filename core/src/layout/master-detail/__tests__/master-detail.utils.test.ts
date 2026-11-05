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

import { getTransformOrigins, updateSeenOrder } from "../main/master-detail.utils.js";

describe("getTransformOrigins", () => {
	describe("single pane", () => {
		test("ltr returns left center", () => {
			expect(getTransformOrigins(0, 1, false)).toEqual({
				enterTransformOrigin: "left center",
				exitTransformOrigin: "right center"
			});
		});

		test("rtl returns right center", () => {
			expect(getTransformOrigins(0, 1, true)).toEqual({
				enterTransformOrigin: "right center",
				exitTransformOrigin: "left center"
			});
		});

		test("columnsCount 0 treated as single pane ltr", () => {
			expect(getTransformOrigins(0, 0, false)).toEqual({
				enterTransformOrigin: "left center",
				exitTransformOrigin: "right center"
			});
		});
	});

	describe("first pane of multiple", () => {
		test("ltr returns left center", () => {
			expect(getTransformOrigins(0, 2, false)).toEqual({
				enterTransformOrigin: "left center",
				exitTransformOrigin: "left center"
			});
		});

		test("rtl returns right center", () => {
			expect(getTransformOrigins(0, 2, true)).toEqual({
				enterTransformOrigin: "right center",
				exitTransformOrigin: "right center"
			});
		});
	});

	describe("last pane of multiple", () => {
		test("ltr returns right center", () => {
			expect(getTransformOrigins(1, 2, false)).toEqual({
				enterTransformOrigin: "right center",
				exitTransformOrigin: "right center"
			});
		});

		test("rtl returns left center", () => {
			expect(getTransformOrigins(1, 2, true)).toEqual({
				enterTransformOrigin: "left center",
				exitTransformOrigin: "left center"
			});
		});
	});

	describe("middle pane", () => {
		test("returns empty object", () => {
			expect(getTransformOrigins(1, 3, false)).toEqual({});
		});

		test("rtl returns empty object", () => {
			expect(getTransformOrigins(1, 3, true)).toEqual({});
		});
	});
});

describe("updateSeenOrder", () => {
	test("appends new ids when seenOrder is empty", () => {
		const seen: string[] = [];
		updateSeenOrder(seen, ["a", "b", "c"]);
		expect(seen).toEqual(["a", "b", "c"]);
	});

	test("skips ids already present in seenOrder", () => {
		const seen = ["a", "b"];
		updateSeenOrder(seen, ["a", "b"]);
		expect(seen).toEqual(["a", "b"]);
	});

	test("inserts new id after its left neighbour when left neighbour is known", () => {
		const seen = ["a", "c"];
		updateSeenOrder(seen, ["a", "b", "c"]);
		// "b" has left neighbour "a" at pos 0, so inserts at pos 1
		expect(seen).toEqual(["a", "b", "c"]);
	});

	test("inserts new id before its right neighbour when only right neighbour is known", () => {
		const seen = ["b"];
		updateSeenOrder(seen, ["a", "b"]);
		// "a" has no left neighbour; right neighbour "b" is at pos 0, so inserts at pos 0
		expect(seen).toEqual(["a", "b"]);
	});

	test("appends when neither neighbour is in seenOrder", () => {
		const seen = ["x"];
		updateSeenOrder(seen, ["a", "b"]);
		// "a": left=none, right="b" not in seen → append; "b": left="a" now in seen at 1 → insert at 2
		expect(seen).toEqual(["x", "a", "b"]);
	});

	test("is a no-op for an empty visibleIds list", () => {
		const seen = ["a", "b"];
		updateSeenOrder(seen, []);
		expect(seen).toEqual(["a", "b"]);
	});

	test("handles a single new id with no neighbours", () => {
		const seen: string[] = [];
		updateSeenOrder(seen, ["only"]);
		expect(seen).toEqual(["only"]);
	});
});
