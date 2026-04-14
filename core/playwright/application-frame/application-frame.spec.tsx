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

import { ResizeableApplicationFrameExample } from "./application-frame.stories.js";

test.describe("Application frame resizing", () => {
	test("Should resize the component and verify the new width matches the expected value", async ({
		mount,
		getByDataRole,
		page
	}) => {
		await mount(
			<ResizeableApplicationFrameExample
				resizeOptions={{
					minWidth: 300,
					maxWidth: "70%"
				}}
			/>
		);

		await page.waitForTimeout(300);

		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();
		const resizedElement = getByDataRole(DataRoles.ApplicationFrame.Sidebar.Wrapper).first();

		const initialBounding = await resizedElement.boundingBox();
		const initialWidth = initialBounding?.width ?? 0;
		const newWidth = 500;

		await moveResizeElement(resizeHandler, page, {
			x: newWidth - initialWidth
		});

		const resizedBounding = await resizedElement.boundingBox();
		expect(resizedBounding?.width).toBe(newWidth);
	});

	test("Should not change width after reaching minWidth or maxWidth", async ({ mount, getByDataRole, page }) => {
		const minWidth = 300;
		const pageWidth = await page.evaluate(() => document.documentElement.clientWidth);
		const maxWidth = 0.7 * pageWidth;

		await mount(
			<ResizeableApplicationFrameExample
				resizeOptions={{
					minWidth: minWidth,
					maxWidth: "70%"
				}}
			/>
		);

		await page.waitForTimeout(300);

		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();
		const resizedElement = getByDataRole(DataRoles.ApplicationFrame.Sidebar.Wrapper).first();

		// Resize to minWidth
		const initialBounding = await resizedElement.boundingBox();
		const initialWidth = initialBounding?.width ?? 0;

		await moveResizeElement(resizeHandler, page, {
			x: minWidth - initialWidth,
			steps: 3
		});

		const resizedBoundingMin = await resizedElement.boundingBox();
		expect(resizedBoundingMin?.width).toBe(minWidth);

		// Attempt to resize below minWidth
		await moveResizeElement(resizeHandler, page, {
			x: -100
		});

		const resizedBoundingAfterMin = await resizedElement.boundingBox();
		expect(resizedBoundingAfterMin?.width).toBe(minWidth);

		// Resize to maxWidth
		await moveResizeElement(resizeHandler, page, {
			x: maxWidth - minWidth,
			steps: 3
		});

		const resizedBoundingMax = await resizedElement.boundingBox();
		expect(resizedBoundingMax?.width).toBe(maxWidth);

		// Attempt to resize beyond maxWidth
		await moveResizeElement(resizeHandler, page, {
			x: 100
		});

		const resizedBoundingAfterMax = await resizedElement.boundingBox();
		expect(resizedBoundingAfterMax?.width).toBe(maxWidth);
	});

	test("The sidebar's width should not exceed maxWidth from beginning", async ({ mount, getByDataRole, page }) => {
		await mount(
			<ResizeableApplicationFrameExample
				resizeOptions={{
					minWidth: 200,
					maxWidth: 400,
					removeSubWidth: true
				}}
			/>
		);

		await page.waitForTimeout(300);

		const resizedElement = getByDataRole(DataRoles.ApplicationFrame.Sidebar.Wrapper).first();

		const initialBounding = await resizedElement.boundingBox();
		expect(initialBounding?.width).toBeLessThanOrEqual(400);
	});
});
