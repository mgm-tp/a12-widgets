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

import { describe, test, expect, vi, afterEach } from "vitest";

import { getBoundaryAlignment } from "../main/alignment.js";
import { DataRoles } from "../main/index.js";

function mockRect(rect: Partial<DOMRect>): DOMRect {
	return {
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		width: 0,
		height: 0,
		toJSON: () => ({}),
		...rect
	} as DOMRect;
}

describe("getBoundaryAlignment", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("iframe scenario", () => {
		test("should return a non-negative top position when referenceElement is inside an iframe", () => {
			// Set up iframe positioned 725px from the top of the parent document
			const iframeElement = document.createElement("iframe");
			document.body.appendChild(iframeElement);

			vi.spyOn(iframeElement, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 725, left: 0, bottom: 800, right: 1024, width: 1024, height: 75 })
			);

			const iframeDoc = iframeElement.contentDocument!;
			const referenceElement = iframeDoc.createElement("button");

			vi.spyOn(referenceElement, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 126, left: 271, bottom: 146, right: 311, width: 40, height: 20 })
			);

			// Portal (tooltip) element is in the parent document (height=30)
			const portalElement = document.createElement("div");
			document.body.appendChild(portalElement);

			vi.spyOn(portalElement, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 0, left: 0, bottom: 30, right: 200, width: 200, height: 30 })
			);

			// Portal placeholder in parent document at top=725 (same as iframe top)
			const portalPlaceholder = document.createElement("div");
			portalPlaceholder.setAttribute("data-role", DataRoles.Portal.Placeholder);
			document.body.appendChild(portalPlaceholder);

			vi.spyOn(portalPlaceholder, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 725, left: 0, bottom: 725, right: 0, width: 0, height: 0 })
			);

			vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
			vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);

			const result = getBoundaryAlignment({
				referenceElement,
				element: portalElement,
				preferredOrientation: "top",
				mode: "fixed"
			});

			expect(result.top).toBeGreaterThanOrEqual(0);
			expect(result.top).toBe(96);

			document.body.removeChild(iframeElement);
			document.body.removeChild(portalElement);
			document.body.removeChild(portalPlaceholder);
		});

		test("should not apply iframe offset when referenceElement is in the same document as the portal", () => {
			const referenceElement = document.createElement("button");

			vi.spyOn(referenceElement, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 200, left: 100, bottom: 220, right: 200, width: 100, height: 20 })
			);

			const portalElement = document.createElement("div");
			document.body.appendChild(portalElement);

			vi.spyOn(portalElement, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 0, left: 0, bottom: 30, right: 150, width: 150, height: 30 })
			);

			const portalPlaceholder = document.createElement("div");
			portalPlaceholder.setAttribute("data-role", DataRoles.Portal.Placeholder);
			document.body.appendChild(portalPlaceholder);

			vi.spyOn(portalPlaceholder, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 })
			);

			vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
			vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);

			const result = getBoundaryAlignment({
				referenceElement,
				element: portalElement,
				preferredOrientation: "top",
				mode: "fixed"
			});

			expect(result.top).toBe(170);

			document.body.removeChild(portalElement);
			document.body.removeChild(portalPlaceholder);
		});

		test("should correctly apply both top and left iframe offsets for bottom orientation", () => {
			const iframeElement = document.createElement("iframe");
			document.body.appendChild(iframeElement);

			vi.spyOn(iframeElement, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 300, left: 200, bottom: 380, right: 1024, width: 824, height: 80 })
			);

			const iframeDoc = iframeElement.contentDocument!;
			const referenceElement = iframeDoc.createElement("button");

			vi.spyOn(referenceElement, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 20, left: 100, bottom: 40, right: 200, width: 100, height: 20 })
			);

			const portalElement = document.createElement("div");
			document.body.appendChild(portalElement);

			vi.spyOn(portalElement, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 0, left: 0, bottom: 30, right: 200, width: 200, height: 30 })
			);

			const portalPlaceholder = document.createElement("div");
			portalPlaceholder.setAttribute("data-role", DataRoles.Portal.Placeholder);
			document.body.appendChild(portalPlaceholder);

			vi.spyOn(portalPlaceholder, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 300, left: 200, bottom: 300, right: 200, width: 0, height: 0 })
			);

			vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
			vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);

			const result = getBoundaryAlignment({
				referenceElement,
				element: portalElement,
				preferredOrientation: "bottom",
				mode: "fixed"
			});

			expect(result.top).toBe(40);
			expect(result.left).toBe(50);

			document.body.removeChild(iframeElement);
			document.body.removeChild(portalElement);
			document.body.removeChild(portalPlaceholder);
		});

		test("should accumulate offsets across 2 nested iframes", () => {
			// Outer iframe: top=500 in the top-level document
			const outerIframe = document.createElement("iframe");
			document.body.appendChild(outerIframe);

			vi.spyOn(outerIframe, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 500, left: 0, bottom: 900, right: 1024, width: 1024, height: 400 })
			);

			const outerDoc = outerIframe.contentDocument!;

			// Synthetic inner window whose parent points to the outer document's window
			const mockInnerWindow = { parent: outerDoc.defaultView ?? window } as unknown as Window;
			const mockInnerDoc = { defaultView: mockInnerWindow } as unknown as Document;

			// Inner iframe sits 225px from the top inside the outer iframe
			const innerIframeMock = {
				contentDocument: mockInnerDoc,
				getBoundingClientRect: vi
					.fn()
					.mockReturnValue(mockRect({ top: 225, left: 0, bottom: 425, right: 1024, width: 1024, height: 200 }))
			};

			vi.spyOn(outerDoc, "querySelectorAll").mockReturnValue([innerIframeMock] as any);

			// Reference element sits at the same relative position as in the single-level test
			// Total accumulated iframe offset: 500 + 225 = 725 (identical to the single-level test)
			const referenceElement = {
				ownerDocument: mockInnerDoc,
				getBoundingClientRect: () => mockRect({ top: 126, left: 271, bottom: 146, right: 311, width: 40, height: 20 })
			} as unknown as Element;

			const portalElement = document.createElement("div");
			document.body.appendChild(portalElement);

			vi.spyOn(portalElement, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 0, left: 0, bottom: 30, right: 200, width: 200, height: 30 })
			);

			const portalPlaceholder = document.createElement("div");
			portalPlaceholder.setAttribute("data-role", DataRoles.Portal.Placeholder);
			document.body.appendChild(portalPlaceholder);

			vi.spyOn(portalPlaceholder, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 725, left: 0, bottom: 725, right: 0, width: 0, height: 0 })
			);

			vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
			vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);

			const result = getBoundaryAlignment({
				referenceElement,
				element: portalElement,
				preferredOrientation: "top",
				mode: "fixed"
			});

			// Same result as the single-level test since total offset is the same (725px)
			expect(result.top).toBe(96);

			document.body.removeChild(outerIframe);
			document.body.removeChild(portalElement);
			document.body.removeChild(portalPlaceholder);
		});

		test("should not apply iframe offset when referenceElementRect is explicitly provided", () => {
			const iframeElement = document.createElement("iframe");
			document.body.appendChild(iframeElement);

			vi.spyOn(iframeElement, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 400, left: 0, bottom: 475, right: 1024, width: 1024, height: 75 })
			);

			const iframeDoc = iframeElement.contentDocument!;
			const referenceElement = iframeDoc.createElement("button");

			vi.spyOn(referenceElement, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 50, left: 100, bottom: 70, right: 200, width: 100, height: 20 })
			);

			const portalElement = document.createElement("div");
			document.body.appendChild(portalElement);

			vi.spyOn(portalElement, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 0, left: 0, bottom: 25, right: 150, width: 150, height: 25 })
			);

			const portalPlaceholder = document.createElement("div");
			portalPlaceholder.setAttribute("data-role", DataRoles.Portal.Placeholder);
			document.body.appendChild(portalPlaceholder);

			vi.spyOn(portalPlaceholder, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 })
			);

			vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
			vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);

			const referenceElementRect = mockRect({ top: 200, left: 100, bottom: 220, right: 200, width: 100, height: 20 });

			const result = getBoundaryAlignment({
				referenceElement,
				element: portalElement,
				preferredOrientation: "top",
				mode: "fixed",
				referenceElementRect
			});

			expect(result.top).toBe(175);
			expect(result.left).toBe(75);

			document.body.removeChild(iframeElement);
			document.body.removeChild(portalElement);
			document.body.removeChild(portalPlaceholder);
		});
	});
});
