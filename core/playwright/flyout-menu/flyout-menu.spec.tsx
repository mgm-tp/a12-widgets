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

import { FlyoutMenu } from "../../src/menu/main/flyout-menu.view.js";
import { DataRoles } from "../../src/common/main/data-roles.js";

import { test, expect } from "../fixtures/playwright.config.js";

test.describe("Flyout Menu tests", () => {
	const items = [
		{
			id: "item-1",
			label: "1",
			items: [
				{
					id: "item-1.1",
					label: "1.1",
					items: [
						{ id: "item-1.1.1", label: "1.1.1" },
						{ id: "item-1.1.2", label: "1.1.2", disabled: true },
						{ id: "item-1.1.3", label: "1.1.3" }
					]
				},
				{ id: "item-1.2", label: "1.2", disabled: true },
				{ id: "item-1.3", label: "1.3" }
			]
		},
		{
			id: "item-2",
			label: "2",
			items: [{ id: "item-2.1", label: "1.1" }]
		},
		{
			id: "item-3",
			label: "3"
		}
	];

	test.describe("Horizontal Flyout Menu", () => {
		test("TAB cycle", async ({ mount, getByDataRole }) => {
			await mount(<FlyoutMenu type="horizontal" id="test-flyout" style={{ width: 500 }} items={items} />);

			// ENTER the first item to open its sub-menu
			const firstMenuItem = getByDataRole(DataRoles.Menu.Item).first();

			await firstMenuItem.focus();
			await firstMenuItem.press("Enter");

			// First TAB after opening the sub-menu
			const portal = getByDataRole(DataRoles.AttachedPortal);
			await expect(portal).toBeVisible();
			await expect(portal).toBeFocused();

			await portal.press("Tab");

			const menuItemSubMenu = getByDataRole(DataRoles.Menu.Item, portal);
			await expect(menuItemSubMenu.first()).toBeFocused();

			// Next TAB
			await menuItemSubMenu.first().press("Tab");
			await expect(menuItemSubMenu.nth(2)).toBeFocused();

			// Next TAB from the last interactive element goes to the first interactive element
			await menuItemSubMenu.nth(2).press("Tab");
			await expect(menuItemSubMenu.first()).toBeFocused();
		});

		test("TAB cycle with all sub-items are disabled", async ({ mount, getByDataRole }) => {
			await mount(
				<FlyoutMenu
					type="horizontal"
					id="test-flyout"
					style={{ width: 500 }}
					items={[
						{
							id: "item-1",
							label: "1",
							items: [
								{ id: "item-1.1", label: "1.1", disabled: true },
								{ id: "item-1.2", label: "1.2", disabled: true },
								{ id: "item-1.3", label: "1.3", disabled: true }
							]
						},
						{
							id: "item-2",
							label: "2"
						}
					]}
				/>
			);

			// ENTER the first item to open its sub-menu
			const firstMenuItem = getByDataRole(DataRoles.Menu.Item).first();

			await firstMenuItem.focus();
			await firstMenuItem.click();
			await firstMenuItem.press("Enter");

			const portal = getByDataRole(DataRoles.AttachedPortal);
			await expect(portal).toBeVisible();
			await expect(portal).toBeFocused();

			// First TAB after opening the sub-menu
			await portal.press("Tab");
			await expect(portal).toBeFocused();

			// SHIFT-TAB should still keep the focus on the portal
			await portal.press("Shift+Tab");
			await expect(portal).toBeFocused();
		});

		test("SHIFT-TAB cycle", async ({ mount, getByDataRole }) => {
			await mount(<FlyoutMenu type="horizontal" id="test-flyout" style={{ width: 500 }} items={items} />);

			// ENTER the first item to open its sub-menu
			const firstMenuItem = getByDataRole(DataRoles.Menu.Item).first();
			await firstMenuItem.focus();
			await firstMenuItem.press("Enter");

			const portal = getByDataRole(DataRoles.AttachedPortal);
			await expect(portal).toBeVisible();
			await expect(portal).toBeFocused();

			// First SHIFT-TAB after opening the sub-menu
			await portal.press("Shift+Tab");

			const menuItemSubMenu = getByDataRole(DataRoles.Menu.Item, portal);
			await expect(menuItemSubMenu.nth(2)).toBeFocused();

			// Next SHIFT-TAB
			await menuItemSubMenu.nth(2).press("Shift+Tab");
			await expect(menuItemSubMenu.first()).toBeFocused();

			// Next SHIFT-TAB from the first interactive element goes to the last interactive element
			await menuItemSubMenu.first().press("Shift+Tab");
			await expect(menuItemSubMenu.nth(2)).toBeFocused();
		});

		test("Should open sub-menu when hovering over an item", async ({ mount, getByDataRole, page }) => {
			const component = await mount(
				<FlyoutMenu type="horizontal" id="test-flyout" style={{ width: 500 }} items={items} />
			);

			const menu = getByDataRole(DataRoles.Menu);

			await expect(menu).toBeVisible();

			const firstMenuItem = getByDataRole(DataRoles.Menu.Item).first();

			// Hover over the first menu item to open its sub-menu
			await firstMenuItem.hover();

			const subMenu = getByDataRole(DataRoles.SubMenu.Content);

			// Expect sub menu is not open initially
			await expect(subMenu).not.toBeVisible();

			// Click the first menu item to open its sub-menu
			await firstMenuItem.click();

			await expect(subMenu).toBeVisible();

			// Click to main menu to close sub menu
			await menu.click();

			await expect(subMenu).not.toBeVisible();

			// Hover over the first menu item again to reopen its sub-menu
			await firstMenuItem.hover();

			await expect(subMenu).toBeVisible();

			const secondMenuItem = getByDataRole(DataRoles.Menu.Item).nth(1);

			await secondMenuItem.hover();

			await page.waitForTimeout(100);

			// Expect the first sub-menu to be closed and the second one to be open
			await expect(component.locator("#test-flyout_mainmenu_item-1_sub")).not.toBeVisible();
			await expect(component.locator("#test-flyout_mainmenu_item-2_sub")).toBeVisible();
		});

		test("Should not close sub-menu when hovering over a disabled item", async ({ mount, getByDataRole }) => {
			await mount(<FlyoutMenu type="horizontal" id="test-flyout" style={{ width: 500 }} items={items} />);

			const menu = getByDataRole(DataRoles.Menu);

			await expect(menu).toBeVisible();

			const firstMenuItem = getByDataRole(DataRoles.Menu.Item).first();

			// Hover over the first menu item to open its sub-menu
			await firstMenuItem.hover();

			const subMenu = getByDataRole(DataRoles.SubMenu.Content);

			// Expect sub menu is not open initially
			await expect(subMenu).not.toBeVisible();

			// Click the first menu item to open its sub-menu
			await firstMenuItem.click();

			await expect(subMenu).toBeVisible();

			// Hover over the first sub menu item to open its sub-menu
			const firstSubMenu = getByDataRole(DataRoles.Menu.Item, subMenu);

			await firstSubMenu.first().hover();

			const firstSubMenuContent = getByDataRole(DataRoles.SubMenu.Content).nth(1);

			await expect(firstSubMenuContent).toBeVisible();

			// Hover over the second sub menu item which is disabled
			await firstSubMenu.nth(1).hover();

			await expect(firstSubMenuContent).toBeVisible();

			// Hover over the third sub menu item which is enabled
			await firstSubMenu.nth(2).hover();

			await expect(firstSubMenuContent).not.toBeVisible();
		});

		test("Should not close sub-menu when clicking on a disabled item", async ({ mount, getByDataRole }) => {
			await mount(<FlyoutMenu type="horizontal" id="test-flyout" style={{ width: 500 }} items={items} />);

			const menu = getByDataRole(DataRoles.Menu);

			await expect(menu).toBeVisible();

			const firstMenuItem = getByDataRole(DataRoles.Menu.Item).first();

			// Hover over the first menu item to open its sub-menu
			await firstMenuItem.click();

			const subMenu = getByDataRole(DataRoles.SubMenu.Content);

			await expect(subMenu).toBeVisible();

			// Hover over the first sub menu item to open its sub-menu
			const firstSubMenu = getByDataRole(DataRoles.Menu.Item, subMenu);

			await firstSubMenu.first().hover();

			const firstSubMenuContent = getByDataRole(DataRoles.SubMenu.Content).nth(1);

			await expect(firstSubMenuContent).toBeVisible();

			// Hover over the second sub menu item which is disabled
			await firstSubMenu.nth(1).click();

			await expect(firstSubMenuContent).not.toBeVisible();

			await expect(subMenu).toBeVisible();
		});
	});

	test.describe("Vertical Flyout Menu", () => {
		test("TAB cycle", async ({ mount, getByDataRole }) => {
			await mount(<FlyoutMenu type="vertical" id="test-flyout" style={{ width: 500 }} items={items} />);

			// ENTER the first item to open its sub-menu
			const firstMenuItem = getByDataRole(DataRoles.Menu.Item).first();

			await firstMenuItem.focus();
			await firstMenuItem.press("Enter");

			await expect(firstMenuItem).toBeVisible();

			// First TAB after opening the sub-menu
			const portal = getByDataRole(DataRoles.AttachedPortal);
			await expect(portal).toBeFocused();

			await portal.press("Tab");

			const menuItemSubMenu = getByDataRole(DataRoles.Menu.Item, portal);
			await expect(menuItemSubMenu.first()).toBeFocused();

			// Next TAB
			await menuItemSubMenu.first().press("Tab");
			await expect(menuItemSubMenu.nth(2)).toBeFocused();

			// Next TAB from the last interactive element goes to the first interactive element
			await menuItemSubMenu.nth(2).press("Tab");
			await expect(menuItemSubMenu.first()).toBeFocused();
		});

		test("TAB cycle with all sub-items are disabled", async ({ mount, getByDataRole }) => {
			await mount(
				<FlyoutMenu
					type="vertical"
					id="test-flyout"
					style={{ width: 500 }}
					items={[
						{
							id: "item-1",
							label: "1",
							items: [
								{ id: "item-1.1", label: "1.1", disabled: true },
								{ id: "item-1.2", label: "1.2", disabled: true },
								{ id: "item-1.3", label: "1.3", disabled: true }
							]
						},
						{
							id: "item-2",
							label: "2"
						}
					]}
				/>
			);

			// ENTER the first item to open its sub-menu
			const firstMenuItem = getByDataRole(DataRoles.Menu.Item).first();

			await firstMenuItem.focus();
			await firstMenuItem.click();
			await firstMenuItem.press("Enter");

			const portal = getByDataRole(DataRoles.AttachedPortal);
			await expect(portal).toBeVisible();
			await expect(portal).toBeFocused();

			// First TAB after opening the sub-menu
			await portal.press("Tab");
			await expect(portal).toBeFocused();

			// SHIFT-TAB should still keep the focus on the portal
			await portal.press("Shift+Tab");
			await expect(portal).toBeFocused();
		});

		test("SHIFT-TAB cycle", async ({ mount, getByDataRole }) => {
			await mount(<FlyoutMenu type="vertical" id="test-flyout" style={{ width: 500 }} items={items} />);

			// ENTER the first item to open its sub-menu
			const firstMenuItem = getByDataRole(DataRoles.Menu.Item).first();
			await firstMenuItem.focus();
			await firstMenuItem.press("Enter");

			const portal = getByDataRole(DataRoles.AttachedPortal);
			await expect(portal).toBeVisible();
			await expect(portal).toBeFocused();

			// First SHIFT-TAB after opening the sub-menu
			await portal.press("Shift+Tab");

			const menuItemSubMenu = getByDataRole(DataRoles.Menu.Item, portal);
			await expect(menuItemSubMenu.nth(2)).toBeFocused();

			// Next SHIFT-TAB
			await menuItemSubMenu.nth(2).press("Shift+Tab");
			await expect(menuItemSubMenu.first()).toBeFocused();

			// Next SHIFT-TAB from the first interactive element goes to the last interactive element
			await menuItemSubMenu.first().press("Shift+Tab");
			await expect(menuItemSubMenu.nth(2)).toBeFocused();
		});

		test("Should open sub-menu when hovering over an item", async ({ mount, getByDataRole, page }) => {
			const component = await mount(
				<FlyoutMenu type="vertical" id="test-flyout" style={{ width: 500 }} items={items} />
			);

			const menu = getByDataRole(DataRoles.Menu);

			await expect(menu).toBeVisible();

			const firstMenuItem = getByDataRole(DataRoles.Menu.Item).first();

			// Hover over the first menu item to open its sub-menu
			await firstMenuItem.hover();

			const subMenu = getByDataRole(DataRoles.SubMenu.Content);

			// Expect sub menu is open
			await expect(subMenu).toBeVisible();

			// Click to main menu to close sub menu
			await menu.click();

			await expect(subMenu).not.toBeVisible();

			// Hover over the first menu item again to reopen its sub-menu
			await firstMenuItem.hover();

			await expect(subMenu).toBeVisible();

			const secondMenuItem = getByDataRole(DataRoles.Menu.Item).nth(1);

			await secondMenuItem.hover();

			await page.waitForTimeout(100);

			// Expect the first sub-menu to be closed and the second one to be open
			await expect(component.locator("#test-flyout_mainmenu_item-1_sub")).not.toBeVisible();
			await expect(component.locator("#test-flyout_mainmenu_item-2_sub")).toBeVisible();
		});

		test("Should not close sub-menu when hovering over a disabled item", async ({ mount, getByDataRole }) => {
			await mount(<FlyoutMenu type="vertical" id="test-flyout" style={{ width: 500 }} items={items} />);

			const menu = getByDataRole(DataRoles.Menu);

			await expect(menu).toBeVisible();

			const firstMenuItem = getByDataRole(DataRoles.Menu.Item).first();

			// Hover over the first menu item to open its sub-menu
			await firstMenuItem.hover();

			const subMenu = getByDataRole(DataRoles.SubMenu.Content);

			await expect(subMenu).toBeVisible();

			// Hover over the first sub menu item to open its sub-menu
			const firstSubMenu = getByDataRole(DataRoles.Menu.Item, subMenu);

			await firstSubMenu.first().hover();

			const firstSubMenuContent = getByDataRole(DataRoles.SubMenu.Content).nth(1);

			await expect(firstSubMenuContent).toBeVisible();

			// Hover over the second sub menu item which is disabled
			await firstSubMenu.nth(1).hover();

			await expect(firstSubMenuContent).toBeVisible();

			// Hover over the third sub menu item which is enabled
			await firstSubMenu.nth(2).hover();

			await expect(firstSubMenuContent).not.toBeVisible();
		});

		test("Should not close sub-menu when clicking on a disabled item", async ({ mount, getByDataRole }) => {
			await mount(<FlyoutMenu type="vertical" id="test-flyout" style={{ width: 500 }} items={items} />);

			const menu = getByDataRole(DataRoles.Menu);

			await expect(menu).toBeVisible();

			const firstMenuItem = getByDataRole(DataRoles.Menu.Item).first();

			// Hover over the first menu item to open its sub-menu
			await firstMenuItem.hover();

			const subMenu = getByDataRole(DataRoles.SubMenu.Content);

			await expect(subMenu).toBeVisible();

			// Hover over the first sub menu item to open its sub-menu
			const firstSubMenu = getByDataRole(DataRoles.Menu.Item, subMenu);

			await firstSubMenu.first().hover();

			const firstSubMenuContent = getByDataRole(DataRoles.SubMenu.Content).nth(1);

			await expect(firstSubMenuContent).toBeVisible();

			// Hover over the second sub menu item which is disabled
			await firstSubMenu.nth(1).click();

			await expect(firstSubMenuContent).not.toBeVisible();

			await expect(subMenu).toBeVisible();
		});
	});
});
