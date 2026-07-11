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

import {
	render,
	getAllByDataRole,
	fireEvent,
	waitFor,
	getByDataRole,
	screen,
	getByRole,
	setupDevice
} from "test-utils";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { SlidingMenu } from "../../main/sliding-menu.view.js";
import type { MenuItem } from "../../main/menu.api.js";
import { items, itemsWithChildren, itemWithVariants, scrollTestItems } from "../../test/menu.setup.js";
import { Badge } from "../../../badge/index.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { Icon } from "../../../icon/index.js";
import { InteractionHintConfigProvider } from "../../../interaction-hint/main/interaction-hint-context.js";

describe("com.mgmtp.a12.widgets.menu.sliding", () => {
	test("vertical-sliding-menu-not-collapsed-icons", async () => {
		const { container } = render(<SlidingMenu id="test-sliding" items={items} />);
		expect(container.firstChild).toMatchSnapshot();

		expect(getAllByDataRole(container, DataRoles.Menu.Item).length).toBe(items.length);

		// Change to sub menu of first element
		const item1 = getAllByDataRole(container, DataRoles.Menu.Item)[0];
		await userEvent.click(item1);
		await waitFor(() => {
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			expect(menuItems.length).toBe(4);
			expect(menuItems[0]).toHaveFocus();
		});

		// Change back from sub menu to top level menu
		const itemBack1 = getAllByDataRole(container, DataRoles.Menu.Item)[0];
		await userEvent.click(itemBack1);
		await waitFor(() => {
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			expect(menuItems.length).toBe(items.length);
			expect(menuItems[0]).toHaveFocus();
		});

		// Change to sub menu of fourth element
		const item4 = getAllByDataRole(container, DataRoles.Menu.Item)[3];
		await userEvent.click(item4);
		await waitFor(() => expect(getAllByDataRole(container, DataRoles.Menu.Item).length).toBe(3));
	});

	test("vertical-sliding-menu-with-old-children", async () => {
		const { container } = render(<SlidingMenu id="test-sliding" items={itemsWithChildren} />);
		expect(container.firstChild).toMatchSnapshot();

		expect(getAllByDataRole(container, DataRoles.Menu.Item).length).toBe(itemsWithChildren.length);

		// Change to sub menu of first element
		const item1 = getAllByDataRole(container, DataRoles.Menu.Item)[0];
		await userEvent.click(item1);
		await waitFor(() => expect(getAllByDataRole(container, DataRoles.Menu.Item).length).toBe(4));

		// Change back from sub menu to top level menu
		const itemBack1 = getAllByDataRole(container, DataRoles.Menu.Item)[0];
		await userEvent.click(itemBack1);
		await waitFor(() => expect(getAllByDataRole(container, DataRoles.Menu.Item).length).toBe(itemsWithChildren.length));

		// Change to sub menu of fourth element
		const item4 = getAllByDataRole(container, DataRoles.Menu.Item)[3];
		await userEvent.click(item4);
		await waitFor(() => expect(getAllByDataRole(container, DataRoles.Menu.Item).length).toBe(3));
	});

	test("vertical-sliding-menu-collapsed", () => {
		const { container } = render(<SlidingMenu id="test-sliding" items={items} collapsed />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("vertical-sliding-menu-with-variants", () => {
		const { container } = render(<SlidingMenu id="sliding-menu-width-variants" items={itemWithVariants} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("use MainWrapper to have an overlay but should be invisible initially", () => {
		const { container } = render(
			<SlidingMenu.MainWrapper id="main-wrapper-id">
				<span>Sliding Menu here</span>
			</SlidingMenu.MainWrapper>
		);
		expect(container.firstChild).toMatchSnapshot();
		expect(container.firstChild).toHaveStyle({ visibility: "hidden" });
	});

	test("use MainWrapper to have an overlay and should be visible when expanding", () => {
		const { container } = render(
			<SlidingMenu.MainWrapper id="main-wrapper-id" expanded>
				<span>Sliding Menu here</span>
			</SlidingMenu.MainWrapper>
		);
		expect(container.firstChild).toMatchSnapshot();
		expect(container.firstChild).toHaveStyle({ visibility: "visible" });
	});

	describe("When using the badge", () => {
		test("item has long label with badge", () => {
			const { container } = render(
				<SlidingMenu
					id="test-sliding-with-badge"
					items={[{ label: "4 with very long label that will not fit in there", badge: <Badge count={2} /> }]}
					collapsed
				/>
			);

			const menuItemText = getByDataRole(container, DataRoles.Menu.Item.Text);
			const badge = screen.getByTitle(/2 info notifications/i);

			expect(badge).toBeTruthy();
			expect(badge).toHaveStyle({ right: "-16px", top: "-13.5px" });
			expect(menuItemText).toHaveStyle({ margin: "6px 0px" });
		});

		test("item has no label with badge", () => {
			const { getByTitle } = render(
				<SlidingMenu
					id="test-sliding-with-badge"
					items={[
						{
							label: "Settings",
							badge: <Badge count={2} />,
							labelHidden: true,
							icon: <Icon>settings</Icon>
						}
					]}
					collapsed
				/>
			);

			const badge = getByTitle(/2 info notifications/i);

			expect(badge).toBeTruthy();
			expect(badge).toHaveStyle({ right: "0px", top: "-18px" });
		});
	});

	describe("Interaction Hint", () => {
		test('sliding menu should not show hint when componentConfigs.slidingMenu=true"', () => {
			const { getAllByDataRole, queryByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ slidingMenu: true }}>
					<SlidingMenu id="test-sliding-with-badge" items={items} />
				</InteractionHintConfigProvider>
			);
			const firstMenuItem = getAllByDataRole(DataRoles.Menu.Item)[0];

			fireEvent.focus(firstMenuItem);

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);

			expect(hintContent?.textContent).toEqual(items[0].ariaLabel);
		});

		test("sliding menu should not show hint when componentConfigs.slidingMenu=false", async () => {
			const { getAllByDataRole, queryByDataRole } = render(
				<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ slidingMenu: false }}>
					<SlidingMenu id="test-sliding-with-badge" items={items} />
				</InteractionHintConfigProvider>
			);

			const firstMenuItem = getAllByDataRole(DataRoles.Menu.Item)[0];

			fireEvent.focus(firstMenuItem);

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent).not.toBeInTheDocument();
		});
	});

	test("Should apply custom label and onClick to backward item through `backwardItemProps` property", async () => {
		const customBackwardLabel = "Go Back";
		const mockOnClick = vi.fn();
		const itemsWithBackwardOverrides = [
			{
				label: "Products",
				icon: <Icon>inventory_2</Icon>,
				items: [{ label: "Product 1" }, { label: "Product 2" }, { label: "Product 3" }],
				backwardItemProps: {
					label: customBackwardLabel,
					onClick: mockOnClick
				}
			},
			{ label: "Settings", icon: <Icon>settings</Icon> }
		];

		const { getAllByDataRole } = render(
			<SlidingMenu id="test-sliding-backward-override" items={itemsWithBackwardOverrides} />
		);

		// Navigate to submenu
		const productsMenuItem = getAllByDataRole(DataRoles.Menu.Item)[0];
		await userEvent.click(productsMenuItem);

		await waitFor(() => {
			const menuItems = getAllByDataRole(DataRoles.Menu.Item);
			expect(menuItems.length).toBe(4); // 1 backward item + 3 submenu items
		});

		// Get the backward item (first item in submenu)
		const backwardItem = getAllByDataRole(DataRoles.Menu.Item)[0];
		const backwardItemText = getByDataRole(backwardItem, DataRoles.Menu.Item.Text);

		// Verify custom label is applied
		expect(backwardItemText.textContent).toBe(customBackwardLabel);

		// Click backward item and verify custom onClick is called
		await userEvent.click(backwardItem);
		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	test("Scroll selected menu item into view", async () => {
		// Constrained container to simulate a small viewport (similar to 200% zoom on 1024x768)
		const { container } = render(
			<div style={{ width: "512px", height: "384px", overflow: "hidden" }}>
				<SlidingMenu items={scrollTestItems} useAs="main" id="basic-sliding-menu" />
			</div>
		);

		const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);

		// Click last item (Z Menu) that may not be visible due to small container
		await userEvent.click(menuItems[menuItems.length - 1]);

		// Sub menu opens, first item should contain "Z MENU"
		await waitFor(() => {
			const currentMenuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			expect(currentMenuItems[0].textContent?.toUpperCase()).toContain("Z MENU");
		});

		// Click the first item (backward navigation) to return to top level
		const submenuItems = getAllByDataRole(container, DataRoles.Menu.Item);
		await userEvent.click(submenuItems[0]);

		// After navigating back, last item should contain "Z MENU"
		await waitFor(() => {
			const currentMenuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			expect(currentMenuItems[currentMenuItems.length - 1].textContent?.toUpperCase()).toContain("Z MENU");
		});
	});

	describe("Event handlers and ARIA", () => {
		test("calls item onClick when a leaf item is clicked", async () => {
			const mockOnClick = vi.fn();
			const clickableItems: MenuItem[] = [
				{ id: "leaf-1", label: "Leaf", onClick: mockOnClick },
				{ id: "parent-1", label: "Parent", items: [{ id: "child-1", label: "Child" }] }
			];
			const { container } = render(<SlidingMenu id="test-sliding" items={clickableItems} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			await userEvent.click(menuItems[0]);
			expect(mockOnClick).toHaveBeenCalledTimes(1);
		});

		test("does not call item onClick when a disabled item is clicked", async () => {
			const mockOnClick = vi.fn();
			const disabledItems: MenuItem[] = [{ id: "disabled-1", label: "Disabled", disabled: true, onClick: mockOnClick }];
			const { container } = render(<SlidingMenu id="test-sliding" items={disabledItems} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			await userEvent.click(menuItems[0]);
			expect(mockOnClick).not.toHaveBeenCalled();
		});

		test("applies mainContainerLabel as aria-label on the menu container", () => {
			const { container } = render(
				<SlidingMenu id="test-sliding" items={items} mainContainerLabel="Custom Navigation" />
			);
			const menuContainer = container.querySelector(`[data-role="${DataRoles.Menu}"]`);
			expect(menuContainer).toHaveAttribute("aria-label", "Custom Navigation");
		});

		test('sets aria-label to "Main navigation" on the menu container when useAs="main"', () => {
			const { container } = render(<SlidingMenu id="test-sliding" items={items} useAs="main" />);
			const menuContainer = container.querySelector(`[data-role="${DataRoles.Menu}"]`);
			expect(menuContainer).toHaveAttribute("aria-label", "Main navigation");
		});

		test("disabled menu item has aria-disabled='true' on its link element", () => {
			const mixedItems: MenuItem[] = [
				{ id: "active-1", label: "Active" },
				{ id: "disabled-1", label: "Disabled", disabled: true }
			];
			const { container } = render(<SlidingMenu id="test-sliding" items={mixedItems} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			const disabledLink = getByRole(menuItems[1], "link");
			expect(disabledLink).toHaveAttribute("aria-disabled", "true");
			const activeLink = getByRole(menuItems[0], "link");
			expect(activeLink).not.toHaveAttribute("aria-disabled");
		});

		test("selected menu item has aria-current='page' and non-selected items have aria-current='false'", () => {
			const selectableItems: MenuItem[] = [
				{ id: "selected-1", label: "Selected", selected: true },
				{ id: "normal-1", label: "Normal" }
			];
			const { container } = render(<SlidingMenu id="test-sliding" items={selectableItems} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			const selectedLink = getByRole(menuItems[0], "link");
			expect(selectedLink).toHaveAttribute("aria-current", "page");
			const normalLink = getByRole(menuItems[1], "link");
			expect(normalLink).toHaveAttribute("aria-current", "false");
		});

		test("double tap on a parent item only navigates one level forward", async () => {
			const { container } = render(<SlidingMenu id="test-sliding-double-tap" items={items} />);

			// item-4 (index 3) has two children, so a single navigateForward yields [back, 4.1, 4.2]
			const parentItem = getAllByDataRole(container, DataRoles.Menu.Item)[3];

			await userEvent.dblClick(parentItem);

			await waitFor(() => {
				const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(menuItems.length).toBe(3); // [back, 4.1, 4.2]
			});

			const backwardItem = getAllByDataRole(container, DataRoles.Menu.Item)[0];
			await userEvent.click(backwardItem);

			await waitFor(() => {
				const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(menuItems.length).toBe(items.length);
			});
		});
	});

	describe("mobile", () => {
		beforeAll(() => {
			setupDevice("phone", true);
		});

		afterAll(() => {
			vi.restoreAllMocks();
		});

		test("double tap on a parent item only navigates one level forward", async () => {
			const { container } = render(<SlidingMenu id="test-sliding-double-tap" items={items} />);

			// item-4 (index 3) has two children, so a single navigateForward yields [back, 4.1, 4.2]
			const parentItem = getAllByDataRole(container, DataRoles.Menu.Item)[3];

			await userEvent.dblClick(parentItem);

			await waitFor(() => {
				const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(menuItems.length).toBe(3); // [back, 4.1, 4.2]
			});

			const backwardItem = getAllByDataRole(container, DataRoles.Menu.Item)[0];
			await userEvent.click(backwardItem);

			await waitFor(() => {
				const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(menuItems.length).toBe(items.length);
			});
		});
	});
});
