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

import { DataRoles } from "../../../src/common/main/data-roles.js";
import { test, expect } from "../../fixtures/playwright.config.js";

import { ExampleButtonGroupContainer, RtlButtonGroupContainer } from "./button-group-container-old.stories.js";

test.describe("Button Group Container tests", () => {
	test.use({ viewport: { width: 500, height: 500 } });

	test("render button with hidden label correctly in different viewport size", async ({
		mount,
		page,
		getByDataRole
	}) => {
		await mount(<ExampleButtonGroupContainer />, { hooksConfig: {} });
		await expect(getByDataRole(DataRoles.Button)).toHaveCount(4);
		await expect(getByDataRole(DataRoles.Popup)).not.toBeVisible();

		await page.setViewportSize({ width: 320, height: 640 });

		await getByDataRole(DataRoles.Popup).click();
		await expect(getByDataRole(DataRoles.Button).filter({ hasText: "Delete" })).toBeVisible();
		await expect(getByDataRole(DataRoles.Button).filter({ hasText: "Add" })).toBeVisible();
		await expect(getByDataRole(DataRoles.Button).filter({ hasText: "test button 3" })).toBeVisible();
	});

	test("render right to left", async ({ mount, page, getByDataRole }) => {
		await mount(<RtlButtonGroupContainer />, { hooksConfig: {} });
		await expect(getByDataRole(DataRoles.Button)).toHaveCount(4);
		await expect(getByDataRole(DataRoles.Popup)).not.toBeVisible();

		await page.setViewportSize({ width: 320, height: 640 });
		await getByDataRole(DataRoles.Popup).click();
		const menu = getByDataRole(DataRoles.Popup.Menu);

		await expect(getByDataRole(DataRoles.Button).filter({ hasText: "delete" })).toBeVisible();
		await expect(getByDataRole(DataRoles.Button).filter({ hasText: "add" })).toBeVisible();
		await expect(menu.getByRole("button").filter({ hasText: "test button 3" })).toBeVisible();
		await expect(menu.getByRole("button").filter({ hasText: "test button 4" })).toBeVisible();
	});
});
