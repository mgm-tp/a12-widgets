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

import { ExampleResizeHandler } from "./resize-handler.stories.js";
import { resizeElement } from "./utils.js";

test.describe("ResizeHandler Component", () => {
	test("Should resize the component and verify the new width matches the expected value", async ({
		mount,
		getByDataRole,
		page
	}) => {
		// Mount the ExampleResizeHandler component
		await mount(<ExampleResizeHandler />);

		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();

		const firstView = page.locator("#test-div-1");

		// Verify initial width
		const initialBounding = await firstView.boundingBox();
		expect(initialBounding?.width).toBe(300); // Assuming the initial width is 300px

		const newWidth = 100;

		await resizeElement(resizeHandler, page, newWidth);

		// Get the new width after resizing
		const newResizedWidth = await firstView.boundingBox();

		// Verify that the element resizes to the new width
		expect(newResizedWidth?.width).toBe(newWidth);
	});

	test("Should not go under minWidth when resizing", async ({ mount, getByDataRole, page }) => {
		const minWidth = 200;
		// Mount the ExampleResizeHandler component with minWidth set to 200px
		await mount(<ExampleResizeHandler minWidth={minWidth} maxWidth={500} />);

		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();
		const firstView = page.locator("#test-div-1");

		// Verify initial width
		const initialWidth = 300;
		const initialBounding = await firstView.boundingBox();
		expect(initialBounding?.width).toBe(initialWidth); // Assuming the initial width is 300px

		// Attempt to resize below minWidth
		const newWidth = 100; // Below minWidth
		await resizeElement(resizeHandler, page, newWidth, undefined, 3);

		const resizedBounding = await firstView.boundingBox();
		// Verify it does NOT go below minWidth (200px)
		expect(resizedBounding?.width).toBeGreaterThanOrEqual(minWidth);
		// Verify that the element resizes to the new width
		expect(resizedBounding?.width).toBeLessThan(initialWidth);
	});

	test("Should not exceed maxWidth when resizing", async ({ mount, getByDataRole, page }) => {
		const maxWidth = 500;
		// Mount the ExampleResizeHandler component with maxWidth set to 500px
		await mount(<ExampleResizeHandler minWidth={200} maxWidth={500} />);

		const resizeHandler = getByDataRole(DataRoles.ResizableHandler).first();
		const firstView = page.locator("#test-div-1");

		const initialWidth = 300;
		// Verify initial width
		const initialBounding = await firstView.boundingBox();
		expect(initialBounding?.width).toBe(initialWidth); // Assuming the initial width is 300px

		// Attempt to resize above maxWidth
		const newWidth = 600; // Above maxWidth
		await resizeElement(resizeHandler, page, newWidth, undefined, 3);

		// Verify it does NOT exceed maxWidth (500px)
		const resizedBounding = await firstView.boundingBox();
		expect(resizedBounding?.width).toBeLessThanOrEqual(maxWidth);
		// Verify that the element resizes to the new width
		expect(resizedBounding?.width).toBeGreaterThan(initialWidth);
	});
});
