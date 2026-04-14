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

import type { MenuItem } from "../../src/menu/main/menu.api.js";
import { SlidingMenu } from "../../src/menu/main/sliding-menu.view.js";
import { Icon } from "../../src/icon/main/icon.view.js";

// it's longer than needed for this test, but it is as close as possible to the real showcase
const items: MenuItem[] = [
	{
		label: "1",
		className: "additional-class",
		items: [
			{
				label: "1.1",
				className: "additional-class",
				icon: <Icon>cake</Icon>
			},
			{ label: "1.2", icon: <Icon>card_giftcard</Icon> },
			{
				label: "1.3",
				icon: <Icon>local_florist</Icon>,
				disabled: true
			}
		],
		icon: <Icon>dvr</Icon>
	},
	{ label: "2" },
	{
		label: "3",
		disabled: true
	},
	{
		label: "4 with very long label that will not fit in there",
		items: [
			{
				label: "First",
				items: [
					{ label: "1st Menu" },
					{ label: "2nd Menu" },
					{ label: "3rd Menu" },
					{ label: "4th Menu" },
					{ label: "5th Menu" },
					{ label: "6th Menu" },
					{ label: "7th Menu" }
				]
			},
			{
				label: "Second",
				disabled: true
			},
			{
				label: "Third",
				items: [
					{ label: "3.1st Menu", selected: true },
					{ label: "3.2nd Menu" },
					{ label: "3.3rd Menu" },
					{ label: "3.4th Menu" },
					{ label: "3.5th Menu" },
					{ label: "3.6th Menu" }
				]
			},
			{
				label: "K Menu",
				items: [
					{ label: "A Menu" },
					{ label: "B Menu" },
					{ label: "C Menu" },
					{ label: "D Menu" },
					{ label: "E Menu" },
					{ label: "F Menu" }
				]
			}
		]
	},
	{ label: "5" },
	{ label: "6" },
	{ label: "Settings", icon: <Icon>settings</Icon>, title: "Settings", labelHidden: true },
	{ label: "X Menu" },
	{ label: "Y Menu" },
	{
		label: "Z Menu",
		icon: <Icon>screen_lock_portrait</Icon>,
		items: [
			{
				label: "Z.1 Menu"
			},
			{
				label: "Z.2 Menu",
				disabled: true
			},
			{
				label: "Z.3 Menu",
				disabled: true
			}
		]
	}
];

test.describe("Sliding Menu tests", () => {
	test("Scroll selected menu item into view", async ({ mount, page }) => {
		// similar to 200% zoom on 1024*768 screen
		await page.setViewportSize({ width: 512, height: 384 });
		const component = await mount(<SlidingMenu items={items} useAs="main" id="basic-sliding-menu" />);
		const menuItemSelector = `[data-role="menu-item"]`;
		// clicking last item that is not visible
		await component.locator(menuItemSelector).last().click();
		// sub menu open, now the first item should be visible
		await expect(component.locator(menuItemSelector).first()).toContainText("Z MENU", { ignoreCase: true });
		await expect(component.locator(menuItemSelector).first()).toBeVisible();

		await component.locator(menuItemSelector).first().click();
		await expect(component.locator(menuItemSelector).last()).toContainText("Z MENU", { ignoreCase: true });
		await expect(component.locator(menuItemSelector).last()).toBeVisible();
	});
});
