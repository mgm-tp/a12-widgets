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
import { createElement } from "react";

import { isSimilarElement, isSimilarNode } from "../main/react-node-utils.js";

describe("isSimilarElement", () => {
	test("returns true for identical intrinsic elements", () => {
		expect(isSimilarElement(<div />, <div />)).toBe(true);
	});

	test("returns false when element types differ", () => {
		expect(isSimilarElement(<div />, <span />)).toBe(false);
	});

	test("returns false when keys differ", () => {
		const a = createElement("div", { key: "a" });
		const b = createElement("div", { key: "b" });
		expect(isSimilarElement(a, b)).toBe(false);
	});

	test("returns true when both elements have the same key", () => {
		const a = createElement("div", { key: "x" });
		const b = createElement("div", { key: "x" });
		expect(isSimilarElement(a, b)).toBe(true);
	});

	test("returns true for identical props", () => {
		expect(isSimilarElement(<input type="text" disabled={true} />, <input type="text" disabled={true} />)).toBe(true);
	});

	test("returns false when a string prop differs", () => {
		expect(isSimilarElement(<input type="text" />, <input type="number" />)).toBe(false);
	});

	test("returns false when prop count differs", () => {
		expect(isSimilarElement(<div className="a" />, <div />)).toBe(false);
	});

	test("ignores function props (always considered equal)", () => {
		const handlerA = () => {};

		const handlerB = () => {};

		expect(isSimilarElement(<button onClick={handlerA} />, <button onClick={handlerB} />)).toBe(true);
	});

	test("returns true for matching string children", () => {
		expect(isSimilarElement(<span>hello</span>, <span>hello</span>)).toBe(true);
	});

	test("returns false for differing string children", () => {
		expect(isSimilarElement(<span>hello</span>, <span>world</span>)).toBe(false);
	});

	test("returns true for matching nested element children", () => {
		expect(
			isSimilarElement(
				<div>
					<span>text</span>
				</div>,
				<div>
					<span>text</span>
				</div>
			)
		).toBe(true);
	});

	test("returns false for differing nested element children", () => {
		expect(
			isSimilarElement(
				<div>
					<span>text</span>
				</div>,
				<div>
					<span>other</span>
				</div>
			)
		).toBe(false);
	});

	test("returns true for matching array children", () => {
		expect(
			isSimilarElement(
				<ul>{[<li key="1">a</li>, <li key="2">b</li>]}</ul>,
				<ul>{[<li key="1">a</li>, <li key="2">b</li>]}</ul>
			)
		).toBe(true);
	});

	test("returns false for array children with different lengths", () => {
		expect(isSimilarElement(<ul>{[<li key="1">a</li>, <li key="2">b</li>]}</ul>, <ul>{[<li key="1">a</li>]}</ul>)).toBe(
			false
		);
	});

	test("works with functional components", () => {
		const Foo = (_props: { label: string }) => <div />;
		expect(isSimilarElement(<Foo label="x" />, <Foo label="x" />)).toBe(true);
		expect(isSimilarElement(<Foo label="x" />, <Foo label="y" />)).toBe(false);
	});

	test("returns false when component types differ (function vs intrinsic)", () => {
		const Foo = () => <div />;
		expect(isSimilarElement(<Foo />, <div />)).toBe(false);
	});
});

describe("isSimilarNode", () => {
	// primitives
	test("returns true for equal strings", () => {
		expect(isSimilarNode("hello", "hello")).toBe(true);
	});

	test("returns false for different strings", () => {
		expect(isSimilarNode("hello", "world")).toBe(false);
	});

	test("returns true for equal numbers", () => {
		expect(isSimilarNode(42, 42)).toBe(true);
	});

	test("returns false for different numbers", () => {
		expect(isSimilarNode(1, 2)).toBe(false);
	});

	test("returns true for equal booleans", () => {
		expect(isSimilarNode(true, true)).toBe(true);
	});

	test("returns false for different booleans", () => {
		expect(isSimilarNode(true, false)).toBe(false);
	});

	// null / undefined
	test("returns true for null vs null", () => {
		expect(isSimilarNode(null, null)).toBe(true);
	});

	test("returns true for undefined vs undefined", () => {
		expect(isSimilarNode(undefined, undefined)).toBe(true);
	});

	test("returns false for null vs undefined", () => {
		expect(isSimilarNode(null, undefined)).toBe(false);
	});

	test("returns false for null vs a string", () => {
		expect(isSimilarNode(null, "text")).toBe(false);
	});

	test("returns false for a string vs null", () => {
		expect(isSimilarNode("text", null)).toBe(false);
	});

	// arrays
	test("returns true for matching arrays of primitives", () => {
		expect(isSimilarNode(["a", "b"], ["a", "b"])).toBe(true);
	});

	test("returns false for arrays with different lengths", () => {
		expect(isSimilarNode(["a"], ["a", "b"])).toBe(false);
	});

	test("returns false for arrays with different elements", () => {
		expect(isSimilarNode(["a", "b"], ["a", "c"])).toBe(false);
	});

	test("returns true for matching arrays of elements", () => {
		expect(isSimilarNode([<div key="1" />, <span key="2" />], [<div key="1" />, <span key="2" />])).toBe(true);
	});

	test("returns false for arrays of elements that differ", () => {
		expect(isSimilarNode([<div key="1" />], [<span key="1" />])).toBe(false);
	});

	// ReactElement nodes
	test("returns true for matching React elements", () => {
		expect(isSimilarNode(<div className="a" />, <div className="a" />)).toBe(true);
	});

	test("returns false for React elements with different props", () => {
		expect(isSimilarNode(<div className="a" />, <div className="b" />)).toBe(false);
	});

	test("returns false for React elements of different types", () => {
		expect(isSimilarNode(<div />, <span />)).toBe(false);
	});

	// mixed type mismatches
	test("returns false when one side is a string and other is an element", () => {
		expect(isSimilarNode("text", <div />)).toBe(false);
	});

	test("returns false when one side is null and other is an element", () => {
		expect(isSimilarNode(null, <div />)).toBe(false);
	});
});
