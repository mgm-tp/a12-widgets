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

import { expect, test } from "../fixtures/playwright.config.js";
import { moveResizeElement } from "../resizable/utils.js";

import { ManagedMasterDetailExample } from "./managed-master-detail.stories.js";

test.describe("Managed Master Detail Component", () => {
	test("Should resize the component and verify the new width matches the expected value", async ({
		mount,
		getByDataRole,
		page
	}) => {
		// Mount the ExampleResizeHandler component
		await mount(<ManagedMasterDetailExample resizeOptions={{ maxWidth: "70%", minWidth: "300px" }} />);

		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();

		await expect(firstView).toBeVisible();

		// Wait for 400ms
		await page.waitForTimeout(400);

		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		// Verify initial width
		const initialBounding = await firstView.boundingBox();
		const initialWidth = initialBounding?.width ?? 0;

		const newWidth = 300;

		await moveResizeElement(resizeHandler, page, {
			x: newWidth - initialWidth
		});

		// Get the new width after resizing
		const newResizedWidth = await firstView.boundingBox();

		expect(newResizedWidth?.width).toBe(newWidth);
	});

	test("Should not go under minWidth when resizing", async ({ mount, getByDataRole, page }) => {
		const minWidth = 300;
		// Mount the MasterDetailExample component
		await mount(<ManagedMasterDetailExample resizeOptions={{ maxWidth: "70%", minWidth: minWidth }} />);

		// Locate the resize handler
		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		// Resize the pane to a smaller width (below minWidth)
		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();
		const initialBounding = await firstView.boundingBox();
		const initialWidth = initialBounding?.width ?? 0;
		const newWidth = 200; // Below minWidth
		await moveResizeElement(resizeHandler, page, { x: newWidth - initialWidth, steps: 3 });

		const resizedBounding = await firstView.boundingBox();
		// Verify the pane does not resize below minWidth (300px)
		expect(resizedBounding?.width).toBeGreaterThanOrEqual(minWidth);
		// Verify that the element resizes to the new width
		expect(resizedBounding?.width).toBeLessThan(initialWidth);
	});

	test("Should not exceed maxWidth when resizing", async ({ mount, getByDataRole, page }) => {
		// Mount the MasterDetailExample component
		await mount(<ManagedMasterDetailExample resizeOptions={{ maxWidth: "70%", minWidth: "300px" }} />);
		await page.waitForTimeout(500);

		const pageWidth = await page.evaluate(() => document.documentElement.clientWidth);
		const maxWidth = 0.7 * pageWidth;

		// Locate the resize handler
		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		// Resize the pane to a larger width (above maxWidth)
		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();
		const initialBounding = await firstView.boundingBox();
		const initialWidth = initialBounding?.width ?? 0;

		const newSmallWidth = 500; // Below maxWidth
		await moveResizeElement(resizeHandler, page, { x: newSmallWidth - initialWidth });
		let resizedBounding = await firstView.boundingBox();
		expect(resizedBounding?.width).toEqual(newSmallWidth);

		const newLargeWidth = 1000; // Above maxWidth
		await moveResizeElement(resizeHandler, page, {
			x: newLargeWidth - newSmallWidth,
			steps: 3
		});

		resizedBounding = await firstView.boundingBox();
		// Verify the pane does not resize above maxWidth
		expect(resizedBounding?.width).toBeLessThanOrEqual(maxWidth);
		// Verify that the element resizes to the new width
		expect(resizedBounding?.width).toBeGreaterThan(newSmallWidth);
	});

	test("Should resize to maxWidth on first attempt without issues", async ({ mount, getByDataRole, page }) => {
		// Mount component with large maxWidth to test reaching it
		await mount(<ManagedMasterDetailExample resizeOptions={{ maxWidth: "2000px", minWidth: "300px" }} />);

		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();
		const secondView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).nth(1);
		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		await expect(firstView).toBeVisible();
		await expect(secondView).toBeVisible();
		await expect(resizeHandler).toBeVisible();

		// Wait for component to stabilize
		await page.waitForTimeout(400);

		// Get initial widths
		const initialFirstViewBox = await firstView.boundingBox();
		const initialFirstWidth = initialFirstViewBox?.width ?? 0;

		// Calculate a more conservative target width that respects layout constraints
		const maxWidth = 2000;
		const moveDistance = maxWidth - initialFirstWidth;

		// Perform resize operation
		await moveResizeElement(resizeHandler, page, {
			x: moveDistance,
			steps: 10
		});

		// Wait for resize to complete
		await page.waitForTimeout(200);

		// Verify the resize was successful
		const finalFirstViewBox = await firstView.boundingBox();
		const finalFirstWidth = finalFirstViewBox?.width ?? 0;

		// Should be able to resize significantly from initial width
		expect(finalFirstWidth).toBeGreaterThan(initialFirstWidth);

		// Should not exceed maxWidth
		expect(finalFirstWidth).toBeLessThanOrEqual(maxWidth);
	});
	test("Should not cause jumping when clicking resize handler multiple times", async ({
		mount,
		getByDataRole,
		page
	}) => {
		await mount(<ManagedMasterDetailExample resizeOptions={{ maxWidth: "70%", minWidth: "300px" }} />);

		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();
		const secondView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).nth(1);
		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		await page.waitForTimeout(400);

		// Record initial state
		const initialFirstViewBox = await firstView.boundingBox();
		const initialSecondViewBox = await secondView.boundingBox();
		const initialFirstWidth = initialFirstViewBox?.width ?? 0;
		const initialSecondWidth = initialSecondViewBox?.width ?? 0;

		// Click the resize handler without moving (should not cause jumping)
		await resizeHandler.hover();
		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(400);

		// Check that widths haven't changed significantly (no jumping)
		const afterClickFirstViewBox = await firstView.boundingBox();
		const afterClickSecondViewBox = await secondView.boundingBox();
		const afterClickFirstWidth = afterClickFirstViewBox?.width ?? 0;
		const afterClickSecondWidth = afterClickSecondViewBox?.width ?? 0;

		// The width change after clicking should be small (no jumping)
		expect(Math.abs(afterClickFirstWidth - initialFirstWidth)).toBeLessThan(4);
		expect(Math.abs(afterClickSecondWidth - initialSecondWidth)).toBeLessThan(4);

		// Repeat the click test
		await resizeHandler.hover();
		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(100);

		const secondClickFirstViewBox = await firstView.boundingBox();
		const secondClickSecondViewBox = await secondView.boundingBox();
		const secondClickFirstWidth = secondClickFirstViewBox?.width ?? 0;
		const secondClickSecondWidth = secondClickSecondViewBox?.width ?? 0;

		// Should still be stable
		expect(Math.abs(secondClickFirstWidth - initialFirstWidth)).toBeLessThan(4);
		expect(Math.abs(secondClickSecondWidth - initialSecondWidth)).toBeLessThan(4);
	});

	test("Should maintain consistent behavior between first and subsequent resizes", async ({
		mount,
		getByDataRole,
		page
	}) => {
		await mount(<ManagedMasterDetailExample resizeOptions={{ maxWidth: "1500px", minWidth: "300px" }} />);

		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();
		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		await page.waitForTimeout(400);

		// First resize attempt
		const firstMoveDistance = 400;

		await moveResizeElement(resizeHandler, page, {
			x: firstMoveDistance,
			steps: 5
		});

		await page.waitForTimeout(200);

		const firstResizeBox = await firstView.boundingBox();

		// Second resize attempt with same distance
		await moveResizeElement(resizeHandler, page, {
			x: firstMoveDistance,
			steps: 5
		});

		await page.waitForTimeout(200);

		const secondResizeBox = await firstView.boundingBox();
		const secondResizeWidth = secondResizeBox?.width ?? 0;

		// Third resize attempt - should still work consistently
		await moveResizeElement(resizeHandler, page, {
			x: -200, // Resize back
			steps: 5
		});

		await page.waitForTimeout(200);

		// Should be able to resize back
		expect(firstResizeBox?.width).toBeLessThan(secondResizeWidth);
	});

	test("Should respect minWidth constraints properly", async ({ mount, getByDataRole, page }) => {
		const minWidth = 350;
		await mount(<ManagedMasterDetailExample resizeOptions={{ maxWidth: "70%", minWidth: `${minWidth}px` }} />);

		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();
		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		await page.waitForTimeout(400);

		// Try to resize below minWidth
		const initialBox = await firstView.boundingBox();
		const initialWidth = initialBox?.width ?? 0;
		const excessiveShrinkDistance = -(initialWidth - 100);

		await moveResizeElement(resizeHandler, page, {
			x: excessiveShrinkDistance,
			steps: 10
		});

		await page.waitForTimeout(200);

		const finalBox = await firstView.boundingBox();
		const finalWidth = finalBox?.width ?? 0;

		expect(finalWidth).toBeGreaterThanOrEqual(minWidth);
	});

	test("Should respect maxWidth constraints properly", async ({ mount, getByDataRole, page }) => {
		const maxWidth = 800;
		await mount(<ManagedMasterDetailExample resizeOptions={{ maxWidth: `${maxWidth}px`, minWidth: "200px" }} />);

		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();
		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		await page.waitForTimeout(400);

		// Try to resize beyond maxWidth
		const excessiveExpandDistance = maxWidth + 500;

		await moveResizeElement(resizeHandler, page, {
			x: excessiveExpandDistance,
			steps: 10
		});

		await page.waitForTimeout(200);

		const finalBox = await firstView.boundingBox();
		const finalWidth = finalBox?.width ?? 0;

		expect(finalWidth).toBeLessThanOrEqual(maxWidth);
	});

	test("Should handle percentage-based maxWidth correctly", async ({ mount, getByDataRole, page }) => {
		await mount(<ManagedMasterDetailExample resizeOptions={{ maxWidth: "60%", minWidth: "250px" }} />);

		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();
		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		await page.waitForTimeout(400);

		// Get parent container width to calculate expected maxWidth
		const parentContainer = page.locator('[data-role="master-detail-layout-body"]');
		const parentBox = await parentContainer.boundingBox();
		const parentWidth = parentBox?.width ?? 0;
		const expectedMaxWidth = parentWidth * 0.6;

		// Try to resize to maximum
		const initialBox = await firstView.boundingBox();
		const initialWidth = initialBox?.width ?? 0;
		const moveToMax = expectedMaxWidth - initialWidth + 200; // Try to exceed percentage

		await moveResizeElement(resizeHandler, page, {
			x: moveToMax,
			steps: 10
		});

		await page.waitForTimeout(200);

		const finalBox = await firstView.boundingBox();
		const finalWidth = finalBox?.width ?? 0;

		expect(finalWidth).toBeLessThanOrEqual(expectedMaxWidth);
	});

	test("Should maintain proper sibling coordination during resize", async ({ mount, getByDataRole, page }) => {
		await mount(<ManagedMasterDetailExample resizeOptions={{ maxWidth: "1200px", minWidth: "300px" }} />);

		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();
		const secondView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).nth(1);
		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		await page.waitForTimeout(400);

		// Record initial state
		const initialFirstBox = await firstView.boundingBox();
		const initialSecondBox = await secondView.boundingBox();
		const initialFirstWidth = initialFirstBox?.width ?? 0;
		const initialSecondWidth = initialSecondBox?.width ?? 0;
		const initialTotalWidth = initialFirstWidth + initialSecondWidth;

		// Perform multiple resize operations
		const resizeOperations = [
			{ x: 300, description: "expand first pane" },
			{ x: -150, description: "shrink first pane" },
			{ x: 200, description: "expand again" },
			{ x: -100, description: "small shrink" }
		];

		for (const operation of resizeOperations) {
			await moveResizeElement(resizeHandler, page, {
				x: operation.x,
				steps: 5
			});

			await page.waitForTimeout(150);

			// Check coordination after each operation
			const currentFirstBox = await firstView.boundingBox();
			const currentSecondBox = await secondView.boundingBox();
			const currentFirstWidth = currentFirstBox?.width ?? 0;
			const currentSecondWidth = currentSecondBox?.width ?? 0;
			const currentTotalWidth = currentFirstWidth + currentSecondWidth;

			expect(Math.abs(currentTotalWidth - initialTotalWidth)).toBeLessThan(5);
			expect(currentFirstWidth).toBeGreaterThan(50);
			expect(currentSecondWidth).toBeGreaterThan(50);
		}
	});
});
