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

import { MasterDetailExample } from "./master-detail.stories.js";

test.describe("Master Detail Component", () => {
	test("Should resize the component and verify the new width matches the expected value", async ({
		mount,
		getByDataRole,
		page
	}) => {
		// Mount the ExampleResizeHandler component
		await mount(
			<MasterDetailExample
				resizeOptions={{
					maxWidth: "70%",
					minWidth: 300
				}}
			/>
		);

		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();

		await expect(firstView).toBeVisible();

		const button = page.locator("#open-detail-test");
		await button.click();

		await expect(button).toBeVisible();

		// Wait for 400ms
		await page.waitForTimeout(400);

		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		// Verify initial width
		const initialBounding = await firstView.boundingBox();
		const initialWidth = initialBounding?.width ?? 0;

		const newWidth = 300;

		await moveResizeElement(resizeHandler, page, {
			x: newWidth - initialWidth,
			steps: 3
		});

		// Get the new width after resizing
		const newResizedWidth = await firstView.boundingBox();

		expect(newResizedWidth?.width).toBe(newWidth);
	});

	test("Should not go under minWidth when resizing", async ({ mount, getByDataRole, page }) => {
		const minWidth = 300;
		// Mount the MasterDetailExample component
		await mount(
			<MasterDetailExample
				resizeOptions={{
					maxWidth: "70%",
					minWidth: minWidth
				}}
			/>
		);

		// Locate the resize handler
		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		const button = page.locator("#open-detail-test");
		await button.click();

		// Resize the pane to a smaller width (below minWidth)
		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();
		const initialBounding = await firstView.boundingBox();
		const initialWidth = initialBounding?.width ?? 0;
		const newWidth = 200; // Below minWidth
		await moveResizeElement(resizeHandler, page, {
			x: newWidth - initialWidth,
			steps: 3
		});

		const resizedBounding = await firstView.boundingBox();
		// Verify the pane does not resize below minWidth (300px)
		expect(resizedBounding?.width).toBeGreaterThanOrEqual(minWidth);
		// Verify that the element resizes to the new width
		expect(resizedBounding?.width).toBeLessThan(initialWidth);
	});

	test("Should not exceed maxWidth when resizing", async ({ mount, getByDataRole, page }) => {
		// Mount the MasterDetailExample component
		await mount(
			<MasterDetailExample
				resizeOptions={{
					maxWidth: "70%",
					minWidth: 300
				}}
			/>
		);

		const pageWidth = await page.evaluate(() => document.documentElement.clientWidth);
		const maxWidth = 0.7 * pageWidth;

		const button = page.locator("#open-detail-test");
		await button.click();

		// Locate the resize handler
		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		// Resize the pane to a larger width (above maxWidth)
		await page.waitForTimeout(300);
		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();
		const initialBounding = await firstView.boundingBox();
		const initialWidth = initialBounding?.width ?? 0;
		const newWidth = 1000; // Above maxWidth

		await moveResizeElement(resizeHandler, page, { x: newWidth - initialWidth, steps: 3 });
		// Verify the pane does not resize above maxWidth
		const resizedBounding = await firstView.boundingBox();
		expect(resizedBounding?.width).toEqual(maxWidth);
	});

	test("The view's width should not exceed maxWidth from beginning", async ({ mount, getByDataRole, page }) => {
		// Mount the MasterDetailExample component
		await mount(
			<MasterDetailExample
				resizeOptions={{
					maxWidth: 400,
					minWidth: 200
				}}
			/>
		);

		const button = page.locator("#open-detail-test");
		await button.click();

		// Resize the pane to a larger width (above maxWidth)
		await page.waitForTimeout(400);
		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();
		const initialBounding = await firstView.boundingBox();
		expect(initialBounding?.width).toBe(400);
	});

	test("Should resizable when detail view closed", async ({ mount, getByDataRole, page }) => {
		// Mount the MasterDetailExample component
		await mount(
			<MasterDetailExample
				resizeOptions={{
					maxWidth: "70%",
					minWidth: 300
				}}
			/>
		);

		const buttonOpen = page.locator("#open-detail-test");
		await buttonOpen.click();

		await page.waitForTimeout(400);

		const panes = getByDataRole(DataRoles.MasterDetail.Layout.Pane);
		await expect(panes).toHaveCount(2);

		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		// Resize the pane to a larger width (above maxWidth)
		const firstView = getByDataRole(DataRoles.MasterDetail.Layout.Pane).first();
		let resizedBounding = await firstView.boundingBox();

		const width = 300;

		await moveResizeElement(resizeHandler, page, { x: width - (resizedBounding?.width ?? 0) });

		resizedBounding = await firstView.boundingBox();
		expect(resizedBounding?.width).toEqual(width);

		const buttonClose = page.locator("#close-button-test");
		await buttonClose.click();

		await page.waitForTimeout(400);

		await expect(panes).toHaveCount(1);

		// Reopen detail view
		await buttonOpen.click();

		await page.waitForTimeout(400);

		resizedBounding = await firstView.boundingBox();

		expect(resizedBounding?.width).toBe(300);

		const initialBounding = await firstView.boundingBox();
		const newWidth = 400;
		await moveResizeElement(resizeHandler, page, { x: newWidth - (initialBounding?.width ?? 0) });

		resizedBounding = await firstView.boundingBox();
		expect(resizedBounding?.width).toBe(newWidth);
	});
});
