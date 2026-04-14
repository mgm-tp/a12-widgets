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

import { findFirstMatch } from "../../main/utils/common.js";
import type { TextMatcherResult } from "../../main/plugins/plugin.internal.api.js";

describe("findFirstMatch", () => {
	// Helper matcher functions for testing
	const createMatcher = (pattern: string, startIndex: number = 0): ((text: string) => TextMatcherResult | null) => {
		return (text: string): TextMatcherResult | null => {
			const index = text.indexOf(pattern, startIndex);

			if (index === -1) {
				return null;
			}

			return {
				index,
				length: pattern.length,
				text: pattern
			};
		};
	};

	const createRegexMatcher = (regex: RegExp): ((text: string) => TextMatcherResult | null) => {
		return (text: string): TextMatcherResult | null => {
			const match = text.match(regex);

			if (!match) {
				return null;
			}

			return {
				index: text.indexOf(match[0]),
				length: match[0].length,
				text: match[0]
			};
		};
	};

	test("should return null when no matchers find anything", () => {
		const text = "hello world";
		const matchers = [createMatcher("xyz"), createMatcher("abc")];

		const result = findFirstMatch(text, matchers);
		expect(result).toBeNull();
	});

	test("should return null when matchers array is empty", () => {
		const text = "hello world";
		const matchers: Array<(text: string) => TextMatcherResult | null> = [];

		const result = findFirstMatch(text, matchers);
		expect(result).toBeNull();
	});

	test("should return the only match when only one matcher finds something", () => {
		const text = "hello world";
		const matchers = [createMatcher("world"), createMatcher("xyz")];

		const result = findFirstMatch(text, matchers);
		expect(result).toEqual({
			index: 6,
			length: 5,
			text: "world"
		});
	});

	test("should return the match with the smallest index when multiple matches exist", () => {
		const text = "hello world test";
		const matchers = [
			createMatcher("world"), // index 6
			createMatcher("hello"), // index 0
			createMatcher("test") // index 12
		];

		const result = findFirstMatch(text, matchers);
		expect(result).toEqual({
			index: 0,
			length: 5,
			text: "hello"
		});
	});

	test("should return the longest match when multiple matches have the same index", () => {
		const text = "hello world";
		const matchers = [
			createMatcher("hello"), // index 0, length 5
			createMatcher("hel"), // index 0, length 3
			createMatcher("hello w") // index 0, length 7
		];

		const result = findFirstMatch(text, matchers);
		expect(result).toEqual({
			index: 0,
			length: 7,
			text: "hello w"
		});
	});

	test("should work with regex matchers", () => {
		const text = "Contact us at test@example.com or call 123-456-7890";
		const matchers = [
			createRegexMatcher(/\b\d{3}-\d{3}-\d{4}\b/), // phone number
			createRegexMatcher(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/) // email
		];

		const result = findFirstMatch(text, matchers);
		// Email appears first at index 14
		expect(result).toEqual({
			index: 14,
			length: 16,
			text: "test@example.com"
		});
	});

	test("should handle overlapping matches correctly", () => {
		const text = "abcdef";
		const matchers = [
			createMatcher("abc"), // index 0, length 3
			createMatcher("bcd"), // index 1, length 3
			createMatcher("cde") // index 2, length 3
		];

		const result = findFirstMatch(text, matchers);
		expect(result).toEqual({
			index: 0,
			length: 3,
			text: "abc"
		});
	});

	test("should handle matches at the same index with different lengths correctly", () => {
		const text = "programming";
		const matchers = [
			createMatcher("program"), // index 0, length 7
			createMatcher("programming"), // index 0, length 11
			createMatcher("prog") // index 0, length 4
		];

		const result = findFirstMatch(text, matchers);
		expect(result).toEqual({
			index: 0,
			length: 11,
			text: "programming"
		});
	});

	test("should handle matchers that return null", () => {
		const text = "hello world";
		const matchers = [() => null, createMatcher("world"), () => null];

		const result = findFirstMatch(text, matchers);
		expect(result).toEqual({
			index: 6,
			length: 5,
			text: "world"
		});
	});

	test("should work with empty text", () => {
		const text = "";
		const matchers = [createMatcher("hello"), createMatcher("world")];

		const result = findFirstMatch(text, matchers);
		expect(result).toBeNull();
	});

	test("should handle complex scenario with multiple matchers and priorities", () => {
		const text = "Visit https://example.com or email info@test.org for more details";
		const matchers = [
			createRegexMatcher(/https?:\/\/[^\s]+/), // URL matcher
			createRegexMatcher(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/), // Email matcher
			createMatcher("Visit"), // Simple text matcher
			createMatcher("for more") // Another text matcher
		];

		const result = findFirstMatch(text, matchers);
		// 'Visit' appears first at index 0
		expect(result).toEqual({
			index: 0,
			length: 5,
			text: "Visit"
		});
	});

	test("should return the first match when all matches have the same index and length", () => {
		const text = "test string";
		const matcher1 = createMatcher("test");
		const matcher2 = createMatcher("test");
		const matcher3 = createMatcher("test");
		const matchers = [matcher1, matcher2, matcher3];

		const result = findFirstMatch(text, matchers);
		expect(result).toEqual({
			index: 0,
			length: 4,
			text: "test"
		});
	});
});
