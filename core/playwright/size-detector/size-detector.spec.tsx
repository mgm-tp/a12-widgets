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

import { test, expect } from "@playwright/experimental-ct-react";

import { ExampleSizeDetect1, ExampleSizeDetect2, ExampleSizeDetect3 } from "./size-detector.stories.js";

test.describe("Size detector tests", () => {
	test("Detect the correct breakpoint when window size change", async ({ mount, page }) => {
		const component = await mount(<ExampleSizeDetect1 />);
		await page.setViewportSize({ width: 320, height: 640 });
		await expect(component.locator("#test-id")).toHaveText("xs");
		await page.setViewportSize({ width: 700, height: 1024 });

		await expect(component.locator("#test-id")).toHaveText("sm");
		await page.setViewportSize({ width: 800, height: 1080 });

		await expect(component.locator("#test-id")).toHaveText("md");
		await page.setViewportSize({ width: 1920, height: 1080 });

		await expect(component.locator("#test-id")).toHaveText("lg");

		await page.setViewportSize({ width: 320, height: 640 });
		await expect(component.locator("#test-id")).toHaveText("xs");
	});

	test("Detect the correct breakpoint when element size change", async ({ mount, page }) => {
		const component = await mount(<ExampleSizeDetect2 />);
		await page.setViewportSize({ width: 320, height: 1080 });

		await component.locator("#test-id").evaluate((el) => el.setAttribute("style", "width: 320px"));
		await expect(component.locator("#test-id")).toHaveText("xs");

		await component.locator("#test-id").evaluate((el) => el.setAttribute("style", "width: 700px"));
		await expect(component.locator("#test-id")).toHaveText("sm");

		await component.locator("#test-id").evaluate((el) => el.setAttribute("style", "width: 800px"));
		await expect(component.locator("#test-id")).toHaveText("md");

		await component.locator("#test-id").evaluate((el) => el.setAttribute("style", "width: 1920px"));
		await expect(component.locator("#test-id")).toHaveText("lg");

		await component.locator("#test-id").evaluate((el) => el.setAttribute("style", "width: 320px"));
		await expect(component.locator("#test-id")).toHaveText("xs");
	});

	test("Detect the correct breakpoint when breakpoint is updated at runtime", async ({ mount }) => {
		const component = await mount(<ExampleSizeDetect3 />);
		// with default breakpoint, 500px is xs size
		await component.locator("#test-div").evaluate((el) => el.setAttribute("style", "width: 500px"));
		await expect(component.locator("#test-div")).toHaveText("xs");

		// but with modified breakpoint, it is sm size
		await component.locator("#test-button").click();
		await expect(component.locator("#test-div")).toHaveText("sm");
	});
});
