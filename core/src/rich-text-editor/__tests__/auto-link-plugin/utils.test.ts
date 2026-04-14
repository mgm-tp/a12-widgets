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

import {
	createLinkMatcherWithRegExp,
	createLinkMatcherWithLinkify
} from "../../main/plugins/auto-link-plugin/utils.js";

describe("auto link plugin utils tests", () => {
	describe("createLinkMatcherWithRegExp", () => {
		const regex = /\bA12W-\d+\b/g;
		const urlTransformer = (text: string) => `https://example.com/${text}`;
		const linkMatcher = createLinkMatcherWithRegExp(regex, urlTransformer);

		test("should return a link matcher when the text matches the regex", () => {
			const text = "A12W-12345";
			const expectedResult = {
				index: 0,
				length: text.length,
				text,
				url: `https://example.com/${text}`
			};

			expect(linkMatcher(text)).toEqual(expectedResult);
		});

		test("should return null when text does not match the regex", () => {
			const text = "No match here";

			expect(linkMatcher(text)).toBeNull();
		});

		test("should handle multiple matches in the text", () => {
			const text = "A12W-12345 A12W-54321 A12W-98765";
			const expectedResults = [
				{ index: 0, length: 10, text: "A12W-12345", url: "https://example.com/A12W-12345" },
				{ index: 1, length: 10, text: "A12W-54321", url: "https://example.com/A12W-54321" },
				{ index: 2, length: 10, text: "A12W-98765", url: "https://example.com/A12W-98765" }
			];

			let match;
			let textIndex = 0;
			let index = 0;

			while (index <= 2 && (match = linkMatcher(text.slice(textIndex)))) {
				expect(match).toEqual(expectedResults[index]);
				textIndex += 10;
				index++;
			}
		});

		test("should correctly transform the matched text using the urlTransformer function", () => {
			const urlTransformer = (text: string) => `https://example.com/${text}`;
			const regExp = /\bA12W-\d+\b/g;
			const linkMatcher = createLinkMatcherWithRegExp(regExp, urlTransformer);

			const text = "A12W-12345";
			const expectedResult = {
				index: 0,
				length: text.length,
				text,
				url: `https://example.com/${text}`
			};

			expect(linkMatcher(text)).toEqual(expectedResult);
		});

		test("should handle special characters in the matched text", () => {
			const textWithSpecialCharacters = "A12W-12345!@#$%^&*()";
			const expectedResult = {
				index: 0,
				length: textWithSpecialCharacters.length,
				text: "A12W-12345",
				url: `https://example.com/${textWithSpecialCharacters}`
			};

			expect(linkMatcher(textWithSpecialCharacters)?.text).toEqual(expectedResult.text);
		});

		test("should handle non-word characters in the regex pattern", () => {
			const text = "A12W-12345, A12W-56789, A12W-90123";
			const expectedResults = [
				{
					index: 0,
					length: 10,
					text: "A12W-12345",
					url: "https://example.com/A12W-12345"
				},
				{
					index: 1,
					length: 10,
					text: "A12W-56789",
					url: "https://example.com/A12W-56789"
				},
				{
					index: 2,
					length: 10,
					text: "A12W-90123",
					url: "https://example.com/A12W-90123"
				}
			];

			let match;
			let textIndex = 0;
			let index = 0;

			while (index <= 2 && (match = linkMatcher(text.slice(textIndex)))) {
				expect(match).toEqual(expectedResults[index]);
				textIndex += 11;
				index++;
			}
		});

		test("should return the first match when there are overlapping matches", () => {
			const text = "A12W-12345 A12W-54321";
			const expectedResult = {
				index: 0,
				length: 10,
				text: "A12W-12345",
				url: "https://example.com/A12W-12345"
			};

			expect(linkMatcher(text)).toEqual(expectedResult);
		});

		test("should handle empty input text", () => {
			expect(linkMatcher("")).toBeNull();
		});

		test("should handle regex patterns that start with non-word characters", () => {
			expect(linkMatcher("123abc")).toBeNull();
		});
	});

	describe("createLinkMatcherWithLinkify", () => {
		const matcher = createLinkMatcherWithLinkify();

		test("should return a match for a valid URL", () => {
			const link = "https://example.com";
			const text = `Visit ${link} for more info.`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(link);
			expect(result!.url).toBe(link);
			expect(result!.index).toBe(6);
			expect(result!.length).toBe(link.length);
		});

		test("should return null if there is no link", () => {
			const text = "No links here!";
			expect(matcher(text)).toBeNull();
		});

		test("should return a match for a valid URL (returns first match when multiple links present)", () => {
			const link = "https://example.com";
			const text = `Visit ${link} for more info.`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(link);
			expect(result!.url).toBe(link);
			expect(result!.index).toBe(6);
			expect(result!.length).toBe(link.length);
		});

		test("should handle empty string", () => {
			expect(matcher("")).toBeNull();
		});

		test("should match HTTP URLs", () => {
			const link = "http://example.com";
			const text = `Visit ${link}`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(link);
			expect(result!.url).toBe(link);
		});

		test("should match URLs without protocol", () => {
			const link = "www.example.com";
			const text = `Visit ${link}`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(link);
			expect(result!.url).toBe(`http://${link}`);
		});

		test("should match URLs with paths", () => {
			const link = "https://example.com/path/to/page";
			const text = `Check ${link}`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(link);
			expect(result!.url).toBe(link);
		});

		test("should match URLs with query parameters", () => {
			const link = "https://example.com?param=value&other=test";
			const text = `Link: ${link}`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(link);
			expect(result!.url).toBe(link);
		});

		test("should match URLs with fragments", () => {
			const link = "https://example.com/page#section";
			const text = `Go to ${link}`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(link);
			expect(result!.url).toBe(link);
		});

		test("should match FTP URLs", () => {
			const link = "ftp://files.example.com";
			const text = `Download from ${link}`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(link);
			expect(result!.url).toBe(link);
		});

		test("should match email addresses", () => {
			const email = "test@example.com";
			const text = `Contact ${email}`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(email);
			expect(result!.url).toBe(`mailto:${email}`);
		});

		test("should handle URLs with ports", () => {
			const link = "https://example.com:8080";
			const text = `Server at ${link}`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(link);
			expect(result!.url).toBe(link);
		});

		test("should handle URLs with special characters", () => {
			const link = "https://example.com/path-with_underscores";
			const text = `Link: ${link}`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(link);
			expect(result!.url).toBe(link);
		});

		test("should return correct index for URL in middle of text", () => {
			const link = "https://example.com";
			const text = `Before text ${link} after text`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.index).toBe(12);
			expect(result!.length).toBe(link.length);
		});

		test("should return correct index for URL at beginning", () => {
			const link = "https://example.com";
			const text = `${link} some text after`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.index).toBe(0);
			expect(result!.length).toBe(link.length);
		});

		test("should return correct index for URL at end", () => {
			const link = "https://example.com";
			const text = `Some text before ${link}`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.index).toBe(17);
			expect(result!.length).toBe(link.length);
		});

		test("should handle URLs surrounded by punctuation", () => {
			const link = "https://example.com";
			const text = `Check (${link}) for details.`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(link);
			expect(result!.url).toBe(link);
		});

		test("should handle whitespace around URLs", () => {
			const link = "https://example.com";
			const text = `   ${link}   `;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(link);
			expect(result!.url).toBe(link);
			expect(result!.index).toBe(3);
		});

		test("should handle international domain names", () => {
			const link = "https://example.org";
			const text = `Visit ${link}`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(link);
			expect(result!.url).toBe(link);
		});

		test("should not match invalid URLs", () => {
			const invalidUrls = ["just text", "http://", "https://", "www.", "not.a.valid.url", "@example.com"];

			invalidUrls.forEach((invalidUrl) => {
				const result = matcher(invalidUrl);
				expect(result).toBeNull();
			});
		});

		test("should handle newlines in text", () => {
			const link = "https://example.com";
			const text = `Line 1\n${link}\nLine 3`;
			const result = matcher(text);
			expect(result).not.toBeNull();
			expect(result!.text).toBe(link);
			expect(result!.url).toBe(link);
		});
	});
});
