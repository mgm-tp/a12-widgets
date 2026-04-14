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

import {
	AutocompleteExample,
	ButtonExample,
	TextOutputExample,
	TextOutputWithoutDataExample
} from "./helper-classes.stories.js";

const helperClassName = "h_blueFC";
test.describe("Font Color Helper Classes", () => {
	test("Font-color in Autocomplete", async ({ mount }) => {
		const component = await mount(<AutocompleteExample className={helperClassName} />);
		const input = component.locator("input");

		await expect(input).toHaveCSS("color", "rgb(5, 104, 174)");
	});

	test("Font-color in Button", async ({ mount }) => {
		const component = await mount(<ButtonExample className={helperClassName} />);
		const button = component.locator(`[data-role="button"]`);

		for (let i = 0; i < 4; i++) {
			await expect(button.nth(i)).toHaveCSS("color", "rgb(5, 104, 174)");
		}
	});

	test("Font-color in Text Output", async ({ mount }) => {
		const component = await mount(<TextOutputExample className={helperClassName} />);
		const label = component.locator(`[data-role="label"]`);
		const textContent = component.locator(`[data-role="text-output-text"]`);

		await expect(label).toHaveCSS("color", "rgb(5, 104, 174)");
		await expect(textContent).toHaveCSS("color", "rgb(5, 104, 174)");
	});

	test("Font-color in Text Output without data", async ({ mount }) => {
		const component = await mount(<TextOutputWithoutDataExample className={helperClassName} />);
		const label = component.locator(`[data-role="label"]`);
		const textContent = component.locator(`[data-role="text-output-text"]`);

		await expect(label).toHaveCSS("color", "rgb(5, 104, 174)");
		await expect(textContent).toHaveCSS("color", "rgb(5, 104, 174)");
	});
});
