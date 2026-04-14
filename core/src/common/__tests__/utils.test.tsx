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

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

import {
	addPrefix,
	cloneObject,
	getAllFocusableElements,
	getNearestFocusableParent,
	getParentElement,
	getIframeOffset,
	handleAriaHiddenOfWrapper,
	hasGotFocus,
	isElementFocusable,
	isLastFocusableElement,
	joinClassNames,
	mergeStyles,
	moveItemFocus,
	moveItemFocusBack,
	moveItemFocusNext,
	Range,
	ScrollbarWidthResolver,
	StringUtils
} from "../main/utils.js";

describe("com.mgmtp.a12.widgets.common.utils.add-prefix", () => {
	test("addPrefix", () => {
		expect(addPrefix("test")).toEqual("test");
		expect(addPrefix("test1", "test2")).toEqual("test1 test2");
	});
});

describe("com.mgmtp.a12.widgets.common.utils.scrollbar-width-resolver", () => {
	test("ScrollbarWidthResolver", () => {
		expect(() => {
			expect(typeof ScrollbarWidthResolver.get() === "number").toBeTruthy();
		}).not.toThrow();
	});
});

describe("com.mgmtp.a12.widgets.common.utils.range", () => {
	test("Range", () => {
		expect(Array.from(new Range(5))).toStrictEqual([0, 1, 2, 3, 4]);
		expect(Array.from(new Range(10, 15))).toStrictEqual([10, 11, 12, 13, 14]);
		expect(Array.from(new Range(10, 20, 2))).toStrictEqual([10, 12, 14, 16, 18]);
	});
});

describe("com.mgmtp.a12.widgets.common.utils.stringUtils", () => {
	test("format", () => {
		expect(StringUtils.format("I am testing {name}", { name: "format string" })).toEqual("I am testing format string");
		expect(StringUtils.format("A total of {number} tester", { number: 10 })).toEqual("A total of 10 tester");
	});

	test("sortIgnoreCase", () => {
		expect(StringUtils.sortIgnoreCase(["banana", "apple", "test", "mango"])).toStrictEqual([
			"apple",
			"banana",
			"mango",
			"test"
		]);
		expect(StringUtils.sortIgnoreCase(["Banana", "apple", "Test", "mango", "123", "Bamboo"])).toStrictEqual([
			"123",
			"apple",
			"Bamboo",
			"Banana",
			"mango",
			"Test"
		]);
	});
});

describe("com.mgmtp.a12.widgets.common.utils.element", () => {
	let mockElement: any;
	beforeEach(() => {
		mockElement = document.createElement("div");
		mockElement.classList.add("wrapper");
		mockElement.id = "id-wrapper-test";
		document.body.appendChild(mockElement);
	});

	afterEach(() => {
		mockElement.innerHTML = "";
		document.body.removeChild(mockElement);
	});

	test("joinClassNames", () => {
		expect(joinClassNames("test1 test2")).toStrictEqual("test1 test2");
		expect(joinClassNames("test1", "test2")).toStrictEqual("test1 test2");
		expect(joinClassNames("test1", { test2: true }, { test3: false })).toStrictEqual("test1 test2");
		expect(joinClassNames()).toStrictEqual(undefined);
	});

	test("mergeStyles", () => {
		const obj1 = {
			color: "red",
			"back-ground": "blue"
		};

		const obj2 = { display: "flex", padding: "30px" };
		expect(mergeStyles(obj1)).toStrictEqual(obj1);
		expect(mergeStyles(obj1, obj2)).toStrictEqual({ ...obj1, ...obj2 });
		expect(mergeStyles()).toStrictEqual(undefined);
	});

	test("cloneObject", () => {
		const obj1 = {
			test1: "test 1",
			test2: {
				test41: "1",
				test42: ["2"]
			}
		};
		const obj2 = {
			test3: () => {},
			test4: undefined
		};
		expect(cloneObject({ ...obj1, ...obj2 })).toStrictEqual(obj1);
	});

	test("getParentElement", () => {
		const func = (currentParent: HTMLElement) => {
			return currentParent === mockElement;
		};

		const div = document.createElement("div");
		const button = document.createElement("button");
		div.appendChild(button);
		mockElement.appendChild(div);

		expect(getParentElement(button, func)).toEqual(mockElement);
	});

	test("getNearestFocusableParent", () => {
		const button = document.createElement("button");
		expect(getNearestFocusableParent(button)).toEqual(button);

		const p = document.createElement("p");
		p.appendChild(document.createTextNode("test"));
		mockElement.appendChild(p);
		mockElement.tabIndex = 1;
		expect(getNearestFocusableParent(p)).toEqual(mockElement);
	});

	test("isElementFocusable", () => {
		const focusableElements = ["button", "input", "select", "textarea", "iframe", "a"];
		focusableElements.forEach((value) => {
			const element = document.createElement(value);
			expect(isElementFocusable(element)).toBeTruthy();

			element.tabIndex = -1;
			expect(isElementFocusable(element)).toBeFalsy();

			element.tabIndex = 0;
			element.setAttribute("disabled", "true");
			expect(isElementFocusable(element)).toBeFalsy();
		});

		const unfocusableElements = ["div", "p", "span"];
		unfocusableElements.forEach((value) => {
			const element = document.createElement(value);
			expect(isElementFocusable(element)).toBeFalsy();

			element.tabIndex = 0;
			expect(isElementFocusable(element)).toBeTruthy();
		});
	});

	describe("com.mgmtp.a12.widgets.common.utils.element.getAllFocusableElements", () => {
		const focusableElements = ["button", "input", "select", "textarea", "iframe", "a"];
		const unfocusableElements = ["div", "p"];
		const combineElements = [...focusableElements, ...unfocusableElements];

		test("getAllFocusableElements with default tag element", () => {
			combineElements.forEach((value) => {
				const element = document.createElement(value);
				mockElement.appendChild(element);
			});
			expect(getAllFocusableElements(mockElement).length).toEqual(focusableElements.length);
		});

		test("getAllFocusableElements with adding attribute", () => {
			combineElements.forEach((value) => {
				const element = document.createElement(value);

				if (value === "div") {
					element.tabIndex = 1;
				}

				if (value === "a") {
					element.setAttribute("href", "test");
				}

				if (value === "p") {
					element.appendChild(document.createTextNode("test text"));
					element.setAttribute("contenteditable", "true");
				}

				mockElement.appendChild(element);
			});
			expect(getAllFocusableElements(mockElement).length).toEqual(combineElements.length);
		});

		test("getAllFocusableElements with tabindex=-1", () => {
			combineElements.forEach((value) => {
				const element = document.createElement(value);
				element.tabIndex = -1;
				mockElement.appendChild(element);
			});
			expect(getAllFocusableElements(mockElement).length).toEqual(0);
		});

		test("getAllFocusableElements disabled elements", () => {
			let focusableElementsLength = focusableElements.length;
			combineElements.forEach((value) => {
				const element = document.createElement(value);

				if (value === "button" || value === "input" || value === "select" || value === "textarea") {
					element.setAttribute("disabled", "true");
					focusableElementsLength--;
				}

				mockElement.appendChild(element);
			});
			expect(getAllFocusableElements(mockElement).length).toEqual(focusableElementsLength);
		});
	});

	test("isLastFocusableElement", () => {
		const button1 = document.createElement("button");
		const button2 = document.createElement("button");
		const button3 = document.createElement("button");

		mockElement.appendChild(button1);
		mockElement.appendChild(button2);
		mockElement.appendChild(button3);
		expect(isLastFocusableElement(mockElement, button1)).toBeFalsy();
		expect(isLastFocusableElement(mockElement, button2)).toBeFalsy();
		expect(isLastFocusableElement(mockElement, button3)).toBeTruthy();
	});

	test("moveItemFocus", () => {
		const stubFunction = vi.fn(() => 1);
		const button1 = document.createElement("button");
		const button2 = document.createElement("button");

		mockElement.appendChild(button1);
		mockElement.appendChild(button2);

		moveItemFocus(mockElement, button1, "button", stubFunction);
		expect(document.activeElement).toEqual(button2);
	});

	test("moveItemFocusBack", () => {
		const button1 = document.createElement("button");
		const button2 = document.createElement("button");
		const button3 = document.createElement("button");

		mockElement.appendChild(button1);
		mockElement.appendChild(button2);
		mockElement.appendChild(button3);

		moveItemFocusBack(mockElement, button2, "button");
		expect(document.activeElement).toEqual(button1);
	});

	test("moveItemFocusNext", () => {
		const button1 = document.createElement("button");
		const button2 = document.createElement("button");
		const button3 = document.createElement("button");

		mockElement.appendChild(button1);
		mockElement.appendChild(button2);
		mockElement.appendChild(button3);

		moveItemFocusNext(mockElement, button2, "button");
		expect(document.activeElement).toEqual(button3);
	});

	test("hasGotFocus", () => {
		const button1 = document.createElement("button");
		const button2 = document.createElement("button");
		mockElement.appendChild(button1);

		const mockButton1Focus = vi.fn(() => button1.focus());
		const mockButton2Focus = vi.fn(() => button2.focus());

		mockButton2Focus();
		expect(hasGotFocus(mockElement)).toBeFalsy();

		mockButton1Focus();
		expect(hasGotFocus(mockElement)).toBeTruthy();
	});

	test("handleAriaHiddenOfWrapper", () => {
		handleAriaHiddenOfWrapper(true);
		expect(mockElement.getAttribute("aria-hidden")).toEqual("true");

		handleAriaHiddenOfWrapper(false);
		expect(mockElement.getAttribute("aria-hidden")).toEqual(null);
	});
});

describe("getIframeOffset", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("returns zero offset when referenceElement is null", () => {
		expect(getIframeOffset(null, document)).toEqual({ top: 0, left: 0 });
	});

	test("returns zero offset when referenceElement is undefined", () => {
		expect(getIframeOffset(undefined, document)).toEqual({ top: 0, left: 0 });
	});

	test("returns zero offset when referenceElement is in the same document as portalDocument", () => {
		const button = document.createElement("button");
		document.body.appendChild(button);

		expect(getIframeOffset(button, document)).toEqual({ top: 0, left: 0 });

		document.body.removeChild(button);
	});

	test("returns zero offset when referenceElement is in a different document but no matching iframe exists", () => {
		const iframe = document.createElement("iframe");
		document.body.appendChild(iframe);

		const otherDoc = iframe.contentDocument!;
		const button = otherDoc.createElement("button");

		// Remove the iframe so querySelectorAll finds no match
		document.body.removeChild(iframe);

		expect(getIframeOffset(button, document)).toEqual({ top: 0, left: 0 });
	});

	test("returns the iframe top/left offset when referenceElement lives inside an iframe", () => {
		const iframe = document.createElement("iframe");
		document.body.appendChild(iframe);

		vi.spyOn(iframe, "getBoundingClientRect").mockReturnValue({
			top: 300,
			left: 150,
			bottom: 400,
			right: 1024,
			width: 874,
			height: 100,
			toJSON: () => ({})
		} as DOMRect);

		const iframeDoc = iframe.contentDocument!;
		const button = iframeDoc.createElement("button");

		expect(getIframeOffset(button, document)).toEqual({ top: 300, left: 150 });

		document.body.removeChild(iframe);
	});

	test("returns only top offset when iframe has no horizontal offset", () => {
		const iframe = document.createElement("iframe");
		document.body.appendChild(iframe);

		vi.spyOn(iframe, "getBoundingClientRect").mockReturnValue({
			top: 500,
			left: 0,
			bottom: 600,
			right: 1024,
			width: 1024,
			height: 100,
			toJSON: () => ({})
		} as DOMRect);

		const button = iframe.contentDocument!.createElement("button");

		expect(getIframeOffset(button, document)).toEqual({ top: 500, left: 0 });

		document.body.removeChild(iframe);
	});

	test("returns accumulated offset when referenceElement is inside 2 nested iframes", () => {
		// Outer iframe sits in the top-level document
		const outerIframe = document.createElement("iframe");
		document.body.appendChild(outerIframe);
		const outerDoc = outerIframe.contentDocument!;

		vi.spyOn(outerIframe, "getBoundingClientRect").mockReturnValue({
			top: 120,
			left: 0,
			bottom: 420,
			right: 1024,
			width: 1024,
			height: 300,
			toJSON: () => ({})
		} as DOMRect);

		// Synthetic inner window whose parent points to the outer document's window
		const mockInnerWindow = { parent: outerDoc.defaultView ?? window } as unknown as Window;
		const mockInnerDoc = { defaultView: mockInnerWindow } as unknown as Document;

		// Synthetic inner iframe element living inside the outer document
		const innerIframeMock = {
			contentDocument: mockInnerDoc,
			getBoundingClientRect: vi.fn().mockReturnValue({
				top: 60,
				left: 10,
				bottom: 210,
				right: 800,
				width: 790,
				height: 150,
				toJSON: () => ({})
			} as DOMRect)
		};

		vi.spyOn(outerDoc, "querySelectorAll").mockReturnValue([innerIframeMock] as any);

		const button = { ownerDocument: mockInnerDoc } as unknown as Element;

		// Expected: innerIframe offset (top:60, left:10) + outerIframe offset (top:120, left:0)
		expect(getIframeOffset(button, document)).toEqual({ top: 180, left: 10 });

		document.body.removeChild(outerIframe);
	});
});
