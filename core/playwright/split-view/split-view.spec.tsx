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

import { DataRoles } from "../../src/common/main/data-roles.js";

import { test, expect } from "../fixtures/playwright.config.js";
import { resizeElement } from "../resizable/utils.js";

import { ExampleSplitView } from "./split-view.stories.js";

test.describe("Resizable Split View tests", () => {
	test.describe("First View", () => {
		test("Should not resize below minWidth", async ({ mount, getByDataRole, page }) => {
			const firstViewWidth = 300;
			// Mount the component with minWidth set to 200px
			await mount(
				<ExampleSplitView
					singleArea={false}
					resizableOptions={{ first: { minWidth: 200, maxWidth: "70%" } }}
					widthConfigs={{ containerWidth: 600 }}
				/>
			);

			const firstArea = getByDataRole(DataRoles.SplitView.Area).first();
			const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

			// Get initial width
			const initialWidth = await firstArea.boundingBox();
			expect(initialWidth?.width).toBe(300);

			// Try resizing **smaller than minWidth**
			const newWidth = firstViewWidth - 100; // Trying to go below 200px

			await resizeElement(resizeHandler, page, newWidth, firstViewWidth);

			// Get the new width after resizing
			let newResizedWidth = await firstArea.boundingBox();

			// Verify it does NOT go below minWidth (200px)
			expect(newResizedWidth?.width).toBe(200);

			await resizeElement(resizeHandler, page, newWidth - 100, firstViewWidth);

			newResizedWidth = await firstArea.boundingBox();

			expect(newResizedWidth?.width).toBe(200);
		});

		test("Should not resize exceed maxWidth", async ({ mount, getByDataRole, page }) => {
			const firstViewWidth = 200;
			// Mount the component with minWidth set to 200px
			await mount(
				<ExampleSplitView
					singleArea={false}
					resizableOptions={{ first: { minWidth: 200, maxWidth: "70%" } }}
					widthConfigs={{ containerWidth: 600, firstWidth: firstViewWidth }}
				/>
			);

			const firstArea = getByDataRole(DataRoles.SplitView.Area).first();
			const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

			// Try resizing **smaller than minWidth**
			const newWidth = firstViewWidth + 220; // Trying to reach the maxWidth 600 * 70%

			await resizeElement(resizeHandler, page, newWidth, firstViewWidth);

			// Get the new width after resizing
			let newResizedWidth = await firstArea.boundingBox();

			// Verify it does NOT go exceed maxWidth (70%) of 600px
			expect(newResizedWidth?.width).toBe(420);

			await resizeElement(resizeHandler, page, newWidth + 100, newWidth);

			newResizedWidth = await firstArea.boundingBox();

			expect(newResizedWidth?.width).toBe(420);
		});

		test("Resizable should work when last the element is updated", async ({ mount, getByDataRole, page }) => {
			const firstViewWidth = 300;

			// Mount the component with minWidth set to 200px
			const component = await mount(
				<ExampleSplitView
					singleArea
					resizableOptions={{ first: { minWidth: 200, maxWidth: "70%" } }}
					widthConfigs={{ containerWidth: 600 }}
				/>
			);

			const secondArea = getByDataRole(DataRoles.SplitView.Area).nth(1);

			await expect(secondArea).not.toBeVisible();

			const toggleButton = component.locator("#toggle-button");

			await toggleButton.click();
			await expect(secondArea).toBeVisible();

			const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

			const firstArea = getByDataRole(DataRoles.SplitView.Area).first();

			// Try resizing **smaller than minWidth**
			const newWidth = firstViewWidth + 100; // Trying to go below 200px

			await resizeElement(resizeHandler, page, newWidth, firstViewWidth);

			// Get the new width after resizing
			const newResizedWidth = await firstArea.boundingBox();
			expect(newResizedWidth?.width).toBe(newWidth);
		});
	});

	test.describe("Second View", () => {
		test("Should not resize below minWidth", async ({ mount, getByDataRole, page }) => {
			const firstViewWidth = 300;

			// Mount the component with minWidth set to 200px
			await mount(
				<ExampleSplitView
					singleArea={false}
					resizableOptions={{ second: { minWidth: 200, maxWidth: "70%" } }}
					widthConfigs={{ containerWidth: 600 }}
				/>
			);

			const secondArea = getByDataRole(DataRoles.SplitView.Area).last();
			const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

			// Get initial width
			const initialWidth = await secondArea.boundingBox();
			expect(initialWidth?.width).toBe(firstViewWidth);

			// Try resizing **smaller than minWidth**
			const newWidth = firstViewWidth + 100; // Trying to go below 200px

			await resizeElement(resizeHandler, page, newWidth, firstViewWidth);

			// Get the new width after resizing
			let newResizedWidth = await secondArea.boundingBox();

			// Verify it does NOT go below minWidth (200px)
			expect(newResizedWidth?.width).toBe(200);

			await resizeElement(resizeHandler, page, newWidth + 100, initialWidth?.width ?? 0);

			newResizedWidth = await secondArea.boundingBox();

			expect(newResizedWidth?.width).toBe(200);
		});

		test("Should not resize exceed maxWidth", async ({ mount, getByDataRole, page }) => {
			const secondViewWidth = 400;

			// Mount the component with minWidth set to 200px
			await mount(
				<ExampleSplitView
					singleArea={false}
					resizableOptions={{ second: { minWidth: 200, maxWidth: "70%" } }}
					widthConfigs={{ secondWidth: secondViewWidth, containerWidth: 600 }}
				/>
			);

			const secondArea = getByDataRole(DataRoles.SplitView.Area).last();
			const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

			// Try resizing **smaller than minWidth**
			const newWidth = secondViewWidth - 220; // Trying to reach the maxWidth 600 * 70%

			await resizeElement(resizeHandler, page, newWidth, secondViewWidth);

			// Get the new width after resizing
			let newResizedWidth = await secondArea.boundingBox();

			// Verify it does NOT go exceed maxWidth (70%)
			expect(newResizedWidth?.width).toBe(420);

			await resizeElement(resizeHandler, page, newWidth - 120, secondViewWidth);

			newResizedWidth = await secondArea.boundingBox();

			expect(newResizedWidth?.width).toBe(420);
		});
	});
});
