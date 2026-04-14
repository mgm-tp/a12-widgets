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

import { DOMUtils } from "../../main/utils/dom-utils.js";

describe("DOMUtils", () => {
	describe("getSiblings", () => {
		test("should return an empty array if the element is null", () => {
			const result = DOMUtils.getSiblings(null);
			expect(result).toEqual([]);
		});

		test("should return an empty array if the element has no parent", () => {
			const element = document.createElement("div");
			const result = DOMUtils.getSiblings(element);
			expect(result).toEqual([]);
		});

		test("should return the siblings of the element", () => {
			const parent = document.createElement("div");
			const child1 = document.createElement("div");
			const child2 = document.createElement("div");
			const child3 = document.createElement("div");
			parent.appendChild(child1);
			parent.appendChild(child2);
			parent.appendChild(child3);

			const result = DOMUtils.getSiblings(child2);
			expect(result).toEqual([child1, child3]);
		});
	});

	describe("convertToPixel", () => {
		test("should return undefined if the parent element is null", () => {
			const result = DOMUtils.convertToPixel(null, "50%");
			expect(result).toBeUndefined();
		});

		test("should convert percentage dimension to pixels", () => {
			const parent = document.createElement("div");
			Object.defineProperty(parent, "offsetWidth", {
				value: 200
			});
			document.body.appendChild(parent);

			const result = DOMUtils.convertToPixel(parent, "50%");
			expect(result).toBe(100);

			document.body.removeChild(parent);
		});

		test("should return the numeric value if dimension is a number", () => {
			const parent = document.createElement("div");
			const result = DOMUtils.convertToPixel(parent, 100);
			expect(result).toBe(100);
		});

		test("should parse and return the numeric value if dimension is a string", () => {
			const parent = document.createElement("div");
			const result = DOMUtils.convertToPixel(parent, "100px");
			expect(result).toBe(100);
		});
	});
});
