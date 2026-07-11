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

import { render, getAllByDataRole, getByDataRole, screen, queryByDataRole, waitFor } from "test-utils";
import { describe, test, expect } from "vitest";
import { userEvent } from "vitest/browser";

import { FlyoutMenu } from "../../main/flyout-menu.view.js";
import { items, itemsWithChildren, itemWithGroups, itemWithVariants } from "../../test/menu.setup.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import type { MenuItem } from "../../main/menu.api.js";
import { getA11yResource } from "../../../common/main/a11y-localization/language-context.js";
import { InteractionHintConfigProvider } from "../../../interaction-hint/main/interaction-hint-context.js";
import { Badge } from "../../../badge/index.js";
import { KeyboardNavigationConfigProvider } from "../../../keyboard-navigation/main/keyboard-navigation-context.js";

describe("com.mgmtp.a12.widgets.menu.flyout", () => {
	test("horizontal-flyout-menu-condensed", () => {
		const { container } = render(<FlyoutMenu type="horizontal" id="test-flyout" items={items} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("horizontal-flyout-menu-with-old-children", () => {
		const { container } = render(<FlyoutMenu type="horizontal" id="test-flyout" items={itemsWithChildren} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("vertical-flyout-menu-with-old-children", () => {
		const { container } = render(<FlyoutMenu type="vertical" id="test-flyout" items={itemsWithChildren} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("vertical-flyout-menu-not-collapsed-icons", () => {
		const { container } = render(<FlyoutMenu type="vertical" id="test-flyout" items={items} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("vertical-flyout-menu-collapsed", () => {
		const { container } = render(<FlyoutMenu type="vertical" id="test-flyout" items={items} collapsed />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("horizontal-flyout-menu-with-group", () => {
		const { container } = render(<FlyoutMenu type="horizontal" id="test-flyout" items={itemWithGroups} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("horizontal-flyout-menu-with-variants", () => {
		const { container } = render(
			<FlyoutMenu type="horizontal" id="horizontal-menu-with-variants" items={itemWithVariants} />
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("vertical-flyout-menu-with-variants", () => {
		const { container } = render(
			<FlyoutMenu type="vertical" id="vertical-menu-with-variants" items={itemWithVariants} />
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("horizontal flyout menu with badge", async () => {
		const { container } = render(
			<FlyoutMenu
				type="horizontal"
				id="horizontal-menu-with-badge"
				items={items}
				condensedBadge={<Badge count={2} />}
			/>
		);

		const menuItemText = getAllByDataRole(container, DataRoles.Menu.Item.Text)?.[0];
		const badge = screen.getByTitle(/2 info notifications/i);

		expect(badge).toBeTruthy();
		expect(badge).toHaveStyle({ right: "-8px", top: "-12.6px" });
		expect(menuItemText).not.toHaveStyle({ margin: "6px 0px" });
	});

	test("vertical flyout menu with badge", () => {
		const { container } = render(
			<FlyoutMenu
				type="vertical"
				id="vertical-menu-with-badge"
				items={[{ label: "Test", badge: <Badge count={2} /> }]}
			/>
		);

		const menuItemText = getByDataRole(container, DataRoles.Menu.Item.Text);
		const badge = screen.getByTitle(/2 info notifications/i);

		expect(badge).toBeTruthy();
		expect(badge).toHaveStyle({ right: "-16px", top: "-13.5px" });
		expect(menuItemText).toHaveStyle({ margin: "6px 0px" });
	});

	test("vertical collapsed flyout menu with badge", () => {
		const { container } = render(
			<FlyoutMenu
				type="vertical"
				collapsed
				id="vertical-collapsed-menu-with-badge"
				items={[{ label: "Test", badge: <Badge count={2} /> }]}
			/>
		);

		const menuItemText = getByDataRole(container, DataRoles.Menu.Item.Text);

		const badge = screen.getByTitle(/2 info notifications/i);

		expect(badge).toBeTruthy();
		expect(badge).toHaveStyle({ right: "-16px", top: "-13.5px" });
		expect(menuItemText).toHaveStyle({ margin: "6px 0px" });
	});

	test("render alternative text and title for each status", async () => {
		const variantMenuItems: MenuItem[] = [
			{ label: "Available", variant: "open", title: "Available to access" },
			{ label: "Details", variant: "info", title: "More details and insights available" },
			{ label: "Problems", variant: "error", title: "An issue occurred, check for details" },
			{ label: "Caution", variant: "warning", title: "Proceed with caution, review warnings" },
			{ label: "Completed", variant: "done", title: "Successfully completed" }
		];
		const { container } = render(
			<InteractionHintConfigProvider enableInteractionHint>
				<FlyoutMenu type="vertical" id="vertical-menu-with-variants" items={variantMenuItems} />
			</InteractionHintConfigProvider>
		);

		const menuItem = getAllByDataRole(container, DataRoles.Menu.Item)[0];

		await userEvent.tab();

		const interactionHint = queryByDataRole(container, DataRoles.InteractionHint);
		const variantTitle = `${getA11yResource("en").variantTitles?.open} - ${variantMenuItems[0].title}`;

		expect(interactionHint).toBeTruthy();
		expect(interactionHint?.textContent).toEqual(variantTitle);

		const hiddenText = getByDataRole(menuItem, DataRoles.HiddenText);

		expect(hiddenText.textContent).toEqual(` - ${variantTitle}`);

		// Assert that the menu item does not have a title attribute
		const condensedIcon = getByDataRole(menuItem, DataRoles.Menu.Item.Icon);
		expect(condensedIcon.getAttribute("title")).toBeFalsy();
	});

	describe("Interaction Hint", () => {
		test("flyout menu shows hint when it is enabled with position=`right`", async () => {
			const { getAllByDataRole, findByDataRole } = render(
				<InteractionHintConfigProvider
					enableInteractionHint
					componentConfigs={{ verticalFlyoutMenu: { position: "right", enabled: true } }}
				>
					<FlyoutMenu type="vertical" id="test-flyout" items={items} />
				</InteractionHintConfigProvider>
			);

			const firstMenuItem = getAllByDataRole(DataRoles.Menu.Item)[0];
			firstMenuItem.focus();

			const interactionHint = await findByDataRole(DataRoles.InteractionHint);
			expect(interactionHint?.textContent).toEqual(items[0].ariaLabel);

			const attachedPortal = await findByDataRole(DataRoles.AttachedPortal);

			// Confirm attached portal is on the right side of firstMenuItem
			const menuItemRect = firstMenuItem.getBoundingClientRect();
			const portalLeft = parseInt(attachedPortal.style.left, 10);
			expect(portalLeft).toBeGreaterThanOrEqual(menuItemRect.right - menuItemRect.width);
		});

		test("flyout menu shows hint when it is enabled with position=`left`", async () => {
			const { getAllByDataRole, findByDataRole } = render(
				<InteractionHintConfigProvider
					enableInteractionHint
					componentConfigs={{ verticalFlyoutMenu: { position: "left", enabled: true } }}
				>
					<FlyoutMenu type="vertical" id="test-flyout" items={items} />
				</InteractionHintConfigProvider>
			);

			const firstMenuItem = getAllByDataRole(DataRoles.Menu.Item)[0];
			firstMenuItem.focus();

			const interactionHint = await findByDataRole(DataRoles.InteractionHint);
			expect(interactionHint?.textContent).toEqual(items[0].ariaLabel);

			const attachedPortal = await findByDataRole(DataRoles.AttachedPortal);
			expect(attachedPortal).toMatchSnapshot();
		});

		test("flyout menu should show hint when componentConfigs.verticalFlyoutMenu=true", async () => {
			const { findByDataRole, getAllByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: true }}>
					<FlyoutMenu type="vertical" id="test-flyout" items={items} />
				</InteractionHintConfigProvider>
			);

			const firstMenuItem = getAllByDataRole(DataRoles.Menu.Item)[0];
			firstMenuItem.focus();

			const interactionHint = await findByDataRole(DataRoles.InteractionHint);

			expect(interactionHint).toBeInTheDocument();
			expect(interactionHint?.textContent).toEqual(items[0].ariaLabel);
		});

		test("flyout menu should not show hint when componentConfigs.verticalFlyoutMenu=false", async () => {
			const { queryByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: false }}>
					<FlyoutMenu type="vertical" id="test-flyout" items={items} />
				</InteractionHintConfigProvider>
			);

			await userEvent.tab();

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent).not.toBeInTheDocument();
		});

		test("flyout menu should show hint when componentConfigs.horizontalFlyoutMenu=true", async () => {
			const { findByDataRole, getAllByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ horizontalFlyoutMenu: true }}>
					<FlyoutMenu type="horizontal" id="test-flyout" items={items} />
				</InteractionHintConfigProvider>
			);

			const firstMenuItem = getAllByDataRole(DataRoles.Menu.Item)[0];
			firstMenuItem.focus();

			const interactionHint = await findByDataRole(DataRoles.InteractionHint);

			expect(interactionHint).toBeInTheDocument();
			expect(interactionHint?.textContent).toEqual(items[0].ariaLabel);
		});

		test("flyout menu should show hint when componentConfigs.horizontalFlyoutMenu=false", async () => {
			const { queryByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ horizontalFlyoutMenu: false }}>
					<FlyoutMenu type="horizontal" id="test-flyout" items={items} />
				</InteractionHintConfigProvider>
			);

			await userEvent.tab();

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent).not.toBeInTheDocument();
		});
	});
});

describe("Flyout Menu tests", () => {
	const navigationItems = [
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

	describe("Horizontal Flyout Menu", () => {
		test("TAB cycle", async () => {
			render(<FlyoutMenu type="horizontal" id="test-flyout" style={{ width: 500 }} items={navigationItems} />);

			// ENTER the first item to open its sub-menu
			const firstMenuItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];

			firstMenuItem.focus();
			await userEvent.keyboard("{Enter}");

			const portal = await waitFor(() => {
				const el = document.querySelector<HTMLElement>(`[data-role="${DataRoles.AttachedPortal}"]`);
				expect(el).toBeVisible();

				return el!;
			});

			// After opening sub-menu, focus goes directly to first focusable sub-item
			const menuItemSubMenu = portal.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`);
			await waitFor(() => {
				expect(menuItemSubMenu[0]).toHaveFocus();
			});
			// Next TAB (skips disabled item-1.2)
			await userEvent.tab();
			expect(menuItemSubMenu[2]).toHaveFocus();
			// Next TAB from the last interactive element goes to the first interactive element
			await userEvent.tab();
			expect(menuItemSubMenu[0]).toHaveFocus();
		});

		test("TAB cycle with all sub-items are disabled", async () => {
			render(
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
			const firstMenuItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];

			firstMenuItem.focus();
			await userEvent.click(firstMenuItem);
			await userEvent.keyboard("{Enter}");

			const portal = await waitFor(() => {
				const el = document.querySelector<HTMLElement>(`[data-role="${DataRoles.AttachedPortal}"]`);
				expect(el).toBeVisible();

				return el!;
			});
			await waitFor(() => {
				expect(portal).toHaveFocus();
			});

			// First TAB after opening the sub-menu
			await userEvent.tab();
			await waitFor(() => {
				expect(portal).toHaveFocus();
			});
			// SHIFT-TAB should still keep the focus on the portal
			await userEvent.tab({ shift: true });
			await waitFor(() => {
				expect(portal).toHaveFocus();
			});
		});

		test("SHIFT-TAB cycle", async () => {
			render(<FlyoutMenu type="horizontal" id="test-flyout" style={{ width: 500 }} items={navigationItems} />);

			// ENTER the first item to open its sub-menu
			const firstMenuItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];
			firstMenuItem.focus();
			await userEvent.keyboard("{Enter}");

			const portal = await waitFor(() => {
				const el = document.querySelector<HTMLElement>(`[data-role="${DataRoles.AttachedPortal}"]`);
				expect(el).toBeVisible();

				return el!;
			});

			// After opening sub-menu, focus goes directly to first focusable sub-item
			const menuItemSubMenu = portal.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`);
			await waitFor(() => {
				expect(menuItemSubMenu[0]).toHaveFocus();
			});

			// First SHIFT-TAB wraps to the last interactive element
			await userEvent.tab({ shift: true });
			expect(menuItemSubMenu[2]).toHaveFocus();

			// Next SHIFT-TAB (skips disabled item-1.2)
			await userEvent.tab({ shift: true });
			expect(menuItemSubMenu[0]).toHaveFocus();

			// Next SHIFT-TAB from the first interactive element goes to the last interactive element
			await userEvent.tab({ shift: true });
			expect(menuItemSubMenu[2]).toHaveFocus();
		});

		test("Should open sub-menu when hovering over an item", async () => {
			render(<FlyoutMenu type="horizontal" id="test-flyout" style={{ width: 500 }} items={navigationItems} />);

			const menu = document.querySelector<HTMLElement>(`[data-role="${DataRoles.Menu}"]`)!;
			expect(menu).toBeVisible();

			const firstMenuItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];

			// Hover over the first menu item to open its sub-menu
			await userEvent.hover(firstMenuItem);

			// Expect sub menu is not open initially (horizontal requires click first)
			await waitFor(() => {
				const subMenu = document.querySelector<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(subMenu === null || !subMenu.checkVisibility()).toBe(true);
			});

			// Click the first menu item to open its sub-menu
			await userEvent.click(firstMenuItem);

			await waitFor(() => {
				const subMenuAfterClick = document.querySelector<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(subMenuAfterClick).toBeVisible();
			});

			// Click to main menu to close sub menu
			await userEvent.click(menu);

			await waitFor(() => {
				const subMenuAfterClose = document.querySelector<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(subMenuAfterClose === null || !subMenuAfterClose.checkVisibility()).toBe(true);
			});

			// Hover over the first menu item again to reopen its sub-menu
			await userEvent.hover(firstMenuItem);

			await waitFor(() => {
				const subMenuAfterHover = document.querySelector<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(subMenuAfterHover).toBeVisible();
			});

			const secondMenuItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[1];

			await userEvent.hover(secondMenuItem);

			// Expect the first sub-menu to be closed and the second one to be open
			await waitFor(() => {
				const firstSubMenu = document.querySelector<HTMLElement>("#test-flyout_mainmenu_item-1_sub");
				const secondSubMenu = document.querySelector<HTMLElement>("#test-flyout_mainmenu_item-2_sub");
				expect(firstSubMenu === null || !firstSubMenu.checkVisibility()).toBe(true);
				expect(secondSubMenu).toBeVisible();
			});
		});

		test("Should not close sub-menu when hovering over a disabled item", async () => {
			render(<FlyoutMenu type="horizontal" id="test-flyout" style={{ width: 500 }} items={navigationItems} />);

			const menu = document.querySelector<HTMLElement>(`[data-role="${DataRoles.Menu}"]`)!;
			expect(menu).toBeVisible();

			const firstMenuItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];

			// Hover over the first menu item
			await userEvent.hover(firstMenuItem);

			// Expect sub menu is not open initially
			await waitFor(() => {
				const subMenu = document.querySelector<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(subMenu === null || !subMenu.checkVisibility()).toBe(true);
			});

			// Click the first menu item to open its sub-menu
			await userEvent.click(firstMenuItem);

			const subMenuContent = await waitFor(() => {
				const el = document.querySelector<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(el).toBeVisible();

				return el!;
			});

			// Hover over the first sub menu item to open its sub-menu
			const firstSubMenuItems = subMenuContent.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`);

			await userEvent.hover(firstSubMenuItems[0]);

			await waitFor(() => {
				const allSubMenuContents = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(allSubMenuContents[1]).toBeVisible();
			});

			// Hover over the second sub menu item which is disabled
			await userEvent.hover(firstSubMenuItems[1]);

			await waitFor(() => {
				const allSubMenuContents = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(allSubMenuContents[1]).toBeVisible();
			});

			// Hover over the third sub menu item which is enabled
			await userEvent.hover(firstSubMenuItems[2]);

			await waitFor(() => {
				const allSubMenuContents = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(allSubMenuContents.length < 2 || !allSubMenuContents[1].checkVisibility()).toBe(true);
			});
		});

		test("Should not close sub-menu when clicking on a disabled item", async () => {
			render(<FlyoutMenu type="horizontal" id="test-flyout" style={{ width: 500 }} items={navigationItems} />);

			const menu = document.querySelector<HTMLElement>(`[data-role="${DataRoles.Menu}"]`)!;
			expect(menu).toBeVisible();

			const firstMenuItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];

			// Click the first menu item to open its sub-menu
			await userEvent.click(firstMenuItem);

			const subMenuContent = await waitFor(() => {
				const el = document.querySelector<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(el).toBeVisible();

				return el!;
			});

			// Hover over the first sub menu item to open its sub-menu
			const firstSubMenuItems = subMenuContent.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`);

			await userEvent.hover(firstSubMenuItems[0]);

			await waitFor(() => {
				const allSubMenuContents = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(allSubMenuContents[1]).toBeVisible();
			});

			// Click the second sub menu item which is disabled
			await userEvent.click(firstSubMenuItems[1]);

			await waitFor(() => {
				const allSubMenuContents = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(allSubMenuContents.length < 2 || !allSubMenuContents[1].checkVisibility()).toBe(true);
			});

			// The parent sub-menu should still be visible
			await waitFor(() => {
				const subMenuAfterClick = document.querySelector<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(subMenuAfterClick).toBeVisible();
			});
		});
	});

	describe("Vertical Flyout Menu", () => {
		test("TAB cycle", async () => {
			render(<FlyoutMenu type="vertical" id="test-flyout" style={{ width: 500 }} items={navigationItems} />);

			// ENTER the first item to open its sub-menu
			const firstMenuItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];
			await userEvent.tab();
			await userEvent.keyboard("{Enter}");

			expect(firstMenuItem).toBeVisible();

			const portal = await waitFor(() => {
				const el = document.querySelector<HTMLElement>(`[data-role="${DataRoles.AttachedPortal}"]`);
				expect(el).toBeVisible();

				return el!;
			});

			// After opening sub-menu, focus goes directly to first focusable sub-item
			const menuItemSubMenu = portal.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`);
			await waitFor(() => {
				expect(menuItemSubMenu[0]).toHaveFocus();
			});
			// Next TAB (skips disabled item-1.2)
			await userEvent.tab();
			expect(menuItemSubMenu[2]).toHaveFocus();
			// Next TAB from the last interactive element goes to the first interactive element
			await userEvent.tab();
			expect(menuItemSubMenu[0]).toHaveFocus();
		});

		test("TAB cycle with all sub-items are disabled", async () => {
			render(
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
			const firstMenuItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];

			firstMenuItem.focus();
			await userEvent.keyboard("{Enter}");

			const portal = await waitFor(() => {
				const el = document.querySelector<HTMLElement>(`[data-role="${DataRoles.AttachedPortal}"]`);
				expect(el).toBeVisible();

				return el!;
			});
			await waitFor(() => {
				expect(portal).toHaveFocus();
			});

			// First TAB after opening the sub-menu
			await userEvent.tab();
			await waitFor(() => {
				expect(portal).toHaveFocus();
			});
			// SHIFT-TAB should still keep the focus on the portal
			await userEvent.tab({ shift: true });
			await waitFor(() => {
				expect(portal).toHaveFocus();
			});
		});

		test("SHIFT-TAB cycle", async () => {
			render(<FlyoutMenu type="vertical" id="test-flyout" style={{ width: 500 }} items={navigationItems} />);

			// ENTER the first item to open its sub-menu
			const firstMenuItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];
			firstMenuItem.focus();
			await userEvent.keyboard("{Enter}");

			const portal = await waitFor(() => {
				const el = document.querySelector<HTMLElement>(`[data-role="${DataRoles.AttachedPortal}"]`);
				expect(el).toBeVisible();

				return el!;
			});

			// After opening sub-menu, focus goes directly to first focusable sub-item
			const menuItemSubMenu = portal.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`);
			await waitFor(() => {
				expect(menuItemSubMenu[0]).toHaveFocus();
			});

			// First SHIFT-TAB wraps to the last interactive element
			await userEvent.tab({ shift: true });
			expect(menuItemSubMenu[2]).toHaveFocus();

			// Next SHIFT-TAB (skips disabled item-1.2)
			await userEvent.tab({ shift: true });
			expect(menuItemSubMenu[0]).toHaveFocus();
			// Next SHIFT-TAB from the first interactive element goes to the last interactive element
			await userEvent.tab({ shift: true });
			expect(menuItemSubMenu[2]).toHaveFocus();
		});

		test("Should open sub-menu when hovering over an item", async () => {
			render(<FlyoutMenu type="vertical" id="test-flyout" style={{ width: 500 }} items={navigationItems} />);

			const menu = document.querySelector<HTMLElement>(`[data-role="${DataRoles.Menu}"]`)!;
			expect(menu).toBeVisible();

			const firstMenuItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];

			// Hover over the first menu item to open its sub-menu (vertical opens on hover)
			await userEvent.hover(firstMenuItem);

			await waitFor(() => {
				const subMenu = document.querySelector<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(subMenu).toBeVisible();
			});

			// Click to main menu to close sub menu
			await userEvent.click(menu);

			await waitFor(() => {
				const subMenu = document.querySelector<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(subMenu === null || !subMenu.checkVisibility()).toBe(true);
			});

			// Hover over the first menu item again to reopen its sub-menu
			await userEvent.hover(firstMenuItem);

			await waitFor(() => {
				const subMenu = document.querySelector<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(subMenu).toBeVisible();
			});

			const secondMenuItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[1];

			await userEvent.hover(secondMenuItem);

			// Expect the first sub-menu to be closed and the second one to be open
			await waitFor(() => {
				const firstSubMenu = document.querySelector<HTMLElement>("#test-flyout_mainmenu_item-1_sub");
				const secondSubMenu = document.querySelector<HTMLElement>("#test-flyout_mainmenu_item-2_sub");
				expect(firstSubMenu === null || !firstSubMenu.checkVisibility()).toBe(true);
				expect(secondSubMenu).toBeVisible();
			});
		});

		test("Should not close sub-menu when hovering over a disabled item", async () => {
			render(<FlyoutMenu type="vertical" id="test-flyout" style={{ width: 500 }} items={navigationItems} />);

			const menu = document.querySelector<HTMLElement>(`[data-role="${DataRoles.Menu}"]`)!;
			expect(menu).toBeVisible();

			const firstMenuItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];

			// Hover over the first menu item to open its sub-menu (vertical opens on hover)
			await userEvent.hover(firstMenuItem);

			const subMenuContent = await waitFor(() => {
				const el = document.querySelector<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(el).toBeVisible();

				return el!;
			});

			// Hover over the first sub menu item to open its sub-menu
			const firstSubMenuItems = subMenuContent.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`);

			await userEvent.hover(firstSubMenuItems[0]);

			await waitFor(() => {
				const allSubMenuContents = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(allSubMenuContents[1]).toBeVisible();
			});

			// Hover over the second sub menu item which is disabled
			await userEvent.hover(firstSubMenuItems[1]);

			await waitFor(() => {
				const allSubMenuContents = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(allSubMenuContents[1]).toBeVisible();
			});

			// Hover over the third sub menu item which is enabled
			await userEvent.hover(firstSubMenuItems[2]);

			await waitFor(
				() => {
					const allSubMenuContents = document.querySelectorAll<HTMLElement>(
						`[data-role="${DataRoles.SubMenu.Content}"]`
					);
					expect(allSubMenuContents.length < 2 || !allSubMenuContents[1].checkVisibility()).toBe(true);
				},
				{ timeout: 500 }
			);
		});

		test("Should not close sub-menu when clicking on a disabled item", async () => {
			render(<FlyoutMenu type="vertical" id="test-flyout" style={{ width: 500 }} items={navigationItems} />);

			const menu = document.querySelector<HTMLElement>(`[data-role="${DataRoles.Menu}"]`)!;
			expect(menu).toBeVisible();

			const firstMenuItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];

			// Hover over the first menu item to open its sub-menu (vertical opens on hover)
			await userEvent.hover(firstMenuItem);

			const subMenuContentV = await waitFor(() => {
				const el = document.querySelector<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(el).toBeVisible();

				return el!;
			});

			// Hover over the first sub menu item to open its sub-menu
			const firstSubMenuItems = subMenuContentV.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`);

			await userEvent.hover(firstSubMenuItems[0]);

			await waitFor(() => {
				const allSubMenuContents = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(allSubMenuContents[1]).toBeVisible();
			});

			// Click the second sub menu item which is disabled
			await userEvent.click(firstSubMenuItems[1]);

			await waitFor(() => {
				const allSubMenuContents = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(allSubMenuContents.length < 2 || !allSubMenuContents[1].checkVisibility()).toBe(true);
			});

			// The parent sub-menu should still be visible
			await waitFor(() => {
				const subMenuAfterClick = document.querySelector<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`);
				expect(subMenuAfterClick).toBeVisible();
			});
		});
	});
});

describe("com.mgmtp.a12.widgets.menu.flyout", () => {
	describe("KeyboardNavigation arrow-only mode", () => {
		const simpleItems: MenuItem[] = [
			{ id: "item-1", label: "Item 1" },
			{ id: "item-2", label: "Item 2" },
			{ id: "item-3", label: "Item 3" }
		];

		test("horizontal: Tab exits menu to next focusable element in arrow-only mode", async () => {
			render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button data-testid="before">Before</button>
					<FlyoutMenu type="horizontal" id="test-flyout" style={{ width: 500 }} items={simpleItems} />
					<button data-testid="after">After</button>
				</KeyboardNavigationConfigProvider>
			);

			const firstItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];
			firstItem.focus();
			await userEvent.tab();

			expect(document.querySelector("[data-testid='after']")).toHaveFocus();
		});

		test("horizontal: Shift+Tab exits menu to previous focusable element in arrow-only mode", async () => {
			render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button data-testid="before">Before</button>
					<FlyoutMenu type="horizontal" id="test-flyout" style={{ width: 500 }} items={simpleItems} />
					<button data-testid="after">After</button>
				</KeyboardNavigationConfigProvider>
			);

			const firstItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];
			firstItem.focus();
			await userEvent.tab({ shift: true });

			expect(document.querySelector("[data-testid='before']")).toHaveFocus();
		});

		test("vertical: Tab exits menu to next focusable element in arrow-only mode", async () => {
			render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button data-testid="before">Before</button>
					<FlyoutMenu type="vertical" id="test-flyout" style={{ width: 500 }} items={simpleItems} />
					<button data-testid="after">After</button>
				</KeyboardNavigationConfigProvider>
			);

			const firstItem = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`)[0];
			firstItem.focus();
			await userEvent.tab();

			expect(document.querySelector("[data-testid='after']")).toHaveFocus();
		});

		test("default mode: Tab navigates through menu items naturally (no override)", async () => {
			render(
				<KeyboardNavigationConfigProvider mode="default">
					<button data-testid="before">Before</button>
					<FlyoutMenu type="horizontal" id="test-flyout" style={{ width: 500 }} items={simpleItems} />
					<button data-testid="after">After</button>
				</KeyboardNavigationConfigProvider>
			);

			const menuItems = document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"]`);
			menuItems[0].focus();
			await userEvent.tab();

			// In default mode, Tab is not intercepted — browser moves to the next item
			expect(menuItems[1]).toHaveFocus();
		});
	});
});
