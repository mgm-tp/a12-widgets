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

import { ExampleResizableContainer } from "./resize-and-drag-container.stories.js";

test.describe("Resize And Drag Container", () => {
	test("The basic resize and drag container should be show", async ({ mount, getByDataRole }) => {
		await mount(<ExampleResizableContainer />);

		const buttonTrigger = getByDataRole(DataRoles.Button);
		await buttonTrigger.click();

		await expect(getByDataRole(DataRoles.ResizeAndDragContainer)).toBeVisible();
	});

	test("Custom container with minWidth, maxWidth, minHeight, maxHeight as strings should be show", async ({
		mount,
		getByDataRole
	}) => {
		await mount(<ExampleResizableContainer maxHeight="50vh" minHeight="40vh" minWidth="25vw" maxWidth="60vw" />);

		const buttonTrigger = getByDataRole(DataRoles.Button);
		await buttonTrigger.click();

		await expect(getByDataRole(DataRoles.ResizeAndDragContainer)).toBeVisible();
	});

	test("Custom container with minWidth, maxWidth, minHeight, maxHeight as numbers should be show", async ({
		mount,
		getByDataRole
	}) => {
		await mount(<ExampleResizableContainer maxHeight={1000} minHeight={500} minWidth={100} maxWidth={500} />);

		const buttonTrigger = getByDataRole(DataRoles.Button);
		await buttonTrigger.click();

		await expect(getByDataRole(DataRoles.ResizeAndDragContainer)).toBeVisible();
	});

	test("Initialize the container with dimensions larger than the viewport size.", async ({
		mount,
		getByDataRole,
		page
	}) => {
		const viewport = { width: 800, height: 300 };
		await page.setViewportSize({ ...viewport });

		await mount(<ExampleResizableContainer initialSize={{ width: 900, height: 400 }} />);

		const buttonTrigger = getByDataRole(DataRoles.Button);
		await buttonTrigger.click();

		const resizeAndDragContainer = getByDataRole(DataRoles.ResizeAndDragContainer);
		const containerBoundingBox = await resizeAndDragContainer.boundingBox();

		await expect(resizeAndDragContainer).toBeVisible();
		expect({ width: containerBoundingBox?.width, height: containerBoundingBox?.height }).toEqual(viewport);
	});
});
