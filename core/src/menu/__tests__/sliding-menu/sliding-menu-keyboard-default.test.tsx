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

import { describe, test, expect, vi } from "vitest";
import { getAllByDataRole, render, waitFor } from "test-utils";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { SlidingMenu } from "../../main/sliding-menu.view.js";
import type { MenuItem } from "../../main/menu.api.js";

const items: MenuItem[] = [
	{ id: "a", label: "Alpha" },
	{ id: "b", label: "Beta" },
	{
		id: "c",
		label: "Gamma",
		items: [
			{ id: "c1", label: "Sub 1" },
			{ id: "c2", label: "Sub 2" }
		]
	}
];

describe("com.mgmtp.a12.widgets.sliding-menu", () => {
	describe("default mode", () => {
		test("navigates down with ArrowDown", async () => {
			const { container } = render(<SlidingMenu items={items} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus();
			await userEvent.keyboard("{ArrowDown}");
			expect(menuItems[1]).toHaveFocus();
		});

		test("navigates up with ArrowUp, wrapping to last", async () => {
			const { container } = render(<SlidingMenu items={items} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus();
			await userEvent.keyboard("{ArrowUp}");
			expect(menuItems[menuItems.length - 1]).toHaveFocus();
		});

		test("navigates down with ArrowDown, wrapping from last to first", async () => {
			const { container } = render(<SlidingMenu items={items} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[menuItems.length - 1].focus();
			await userEvent.keyboard("{ArrowDown}");
			expect(menuItems[0]).toHaveFocus();
		});

		test("opens submenu with ArrowRight when item has children", async () => {
			const { container } = render(<SlidingMenu id="test-menu" items={items} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			const parentItem = menuItems[2]; // Gamma
			parentItem.focus();
			await userEvent.keyboard("{ArrowRight}");
			await waitFor(() => {
				const allTexts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(allTexts).toContain("Sub 1");
				expect(allTexts).not.toContain("Alpha");
			});
		});

		test("navigates back with ArrowLeft when in submenu", async () => {
			const { container } = render(<SlidingMenu id="test-menu" items={items} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus();
			await userEvent.keyboard("{ArrowRight}"); // open submenu
			await userEvent.keyboard("{ArrowLeft}"); // go back
			await waitFor(() => {
				const itemsAfter = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(itemsAfter.length).toBe(items.length);
			});
		});

		test("focuses the parent item after ArrowLeft navigates back to root", async () => {
			const { container } = render(<SlidingMenu id="test-menu" items={items} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma (has children)
			await userEvent.keyboard("{ArrowRight}"); // open submenu (Gamma → Sub 1, Sub 2)
			await waitFor(() => {
				// submenu is now shown: backward item + Sub 1 + Sub 2
				expect(getAllByDataRole(container, DataRoles.Menu.Item).length).toBe(3);
			});
			await userEvent.keyboard("{ArrowLeft}"); // navigate back to root
			await waitFor(() => {
				const rootItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(rootItems.length).toBe(items.length); // back at root
				expect(rootItems[2]).toHaveFocus(); // focus on Gamma — the item that was navigated into
			});
		});

		test("ArrowLeft at root level does nothing", async () => {
			const { container } = render(<SlidingMenu id="test-menu" items={items} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			const gammaItem = menuItems[2]; // Gamma has children
			gammaItem.focus();
			await userEvent.keyboard("{ArrowLeft}");
			// ArrowLeft at root does nothing — items remain unchanged
			const updatedItems = getAllByDataRole(container, DataRoles.Menu.Item);
			expect(updatedItems.length).toBe(items.length);
		});

		test("Enter on a leaf item calls the item's onClick", async () => {
			const mockOnClick = vi.fn();
			const leafItems: MenuItem[] = [
				{ id: "leaf-a", label: "Alpha", onClick: mockOnClick },
				{ id: "leaf-b", label: "Beta" }
			];
			const { container } = render(<SlidingMenu items={leafItems} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus();
			await userEvent.keyboard("{Enter}");
			expect(mockOnClick).toHaveBeenCalledTimes(1);
		});

		test("Enter on an item with children navigates into its submenu", async () => {
			const { container } = render(<SlidingMenu id="test-menu" items={items} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma — has Sub 1 and Sub 2
			await userEvent.keyboard("{Enter}");
			await waitFor(() => {
				// backward item + Sub 1 + Sub 2
				expect(getAllByDataRole(container, DataRoles.Menu.Item).length).toBe(3);
			});
		});

		test("Enter on a disabled item does not call onClick", async () => {
			const mockOnClick = vi.fn();
			const disabledItems: MenuItem[] = [
				{ id: "disabled-a", label: "Alpha", disabled: true, onClick: mockOnClick },
				{ id: "enabled-b", label: "Beta" }
			];
			const { container } = render(<SlidingMenu items={disabledItems} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus();
			await userEvent.keyboard("{Enter}");
			expect(mockOnClick).not.toHaveBeenCalled();
		});

		test("Tab on last item calls onTabOut", async () => {
			const onTabOut = vi.fn();
			const { container } = render(<SlidingMenu items={items} onTabOut={onTabOut} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			const lastItem = menuItems[menuItems.length - 1];
			lastItem.focus();
			await userEvent.tab();
			expect(onTabOut).toHaveBeenCalledOnce();
		});

		test("Tab on non-last item does NOT call onTabOut", async () => {
			const onTabOut = vi.fn();
			const { container } = render(<SlidingMenu items={items} onTabOut={onTabOut} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus();
			await userEvent.tab();
			expect(onTabOut).not.toHaveBeenCalled();
		});

		test("ArrowRight at root level focuses a menu item (not body/container) after opening submenu", async () => {
			const { container } = render(<SlidingMenu id="test-menu" items={items} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma — has children
			await userEvent.keyboard("{ArrowRight}");
			await waitFor(() => {
				expect(document.activeElement).toHaveAttribute("data-role", String(DataRoles.Menu.Item));
			});
		});

		test("Shift+Tab after Enter→submenu→ArrowLeft returns focus to the item that opened the submenu", async () => {
			const { container } = render(
				<>
					<button id="before-btn">Before</button>
					<SlidingMenu id="test-menu" items={items} />
					<button id="after-btn">After</button>
				</>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma (has children)
			await userEvent.keyboard("{Enter}"); // open submenu
			await waitFor(() => {
				const allItemTexts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(allItemTexts).toContain("Sub 1");
			});
			await userEvent.keyboard("{ArrowLeft}"); // navigate back to root
			await waitFor(() => {
				expect(getAllByDataRole(container, DataRoles.Menu.Item).length).toBe(items.length);
			});
			// Gamma should be focused after navigating back
			expect(getAllByDataRole(container, DataRoles.Menu.Item)[2]).toHaveFocus();
			await userEvent.tab(); // Tab out of menu
			expect(container.querySelector("#after-btn")).toHaveFocus();
			await userEvent.tab({ shift: true });
			// Shift+Tab returns focus to Gamma (the item that was focused before Tab), not the first item
			const rootItems = getAllByDataRole(container, DataRoles.Menu.Item);
			expect(rootItems[2]).toHaveFocus(); // Gamma
		});

		test("ArrowDown works after ArrowRight opens submenu at root level", async () => {
			const { container } = render(<SlidingMenu id="test-menu" items={items} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma — has children
			await userEvent.keyboard("{ArrowRight}"); // open submenu (backward + Sub1 + Sub2)
			await waitFor(() => {
				expect(document.activeElement).toHaveAttribute("data-role", String(DataRoles.Menu.Item));
			});
			await userEvent.keyboard("{ArrowDown}");
			await waitFor(() => {
				const subItems = getAllByDataRole(container, DataRoles.Menu.Item);
				// ArrowDown should move focus from backward item to Sub 1
				const activeIndex = subItems.indexOf(document.activeElement as HTMLElement);
				expect(activeIndex).toBe(1); // index 1 = Sub 1 (after backward item)
			});
		});

		test("ArrowRight in submenu navigates into deeper level when focused item has children", async () => {
			const deepItems: MenuItem[] = [
				{
					id: "parent",
					label: "Parent",
					items: [
						{
							id: "child",
							label: "Child",
							items: [{ id: "grandchild", label: "Grandchild" }]
						}
					]
				}
			];
			const { container } = render(<SlidingMenu id="test-menu" items={deepItems} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus(); // Parent
			await userEvent.keyboard("{ArrowRight}"); // enter first submenu
			await waitFor(() => {
				const texts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(texts).toContain("Child");
			});
			// Focus the Child item (index 1, after backward item)
			const subItems = getAllByDataRole(container, DataRoles.Menu.Item);
			subItems[1].focus(); // Child — has grandchild
			await userEvent.keyboard("{ArrowRight}"); // enter deeper submenu
			await waitFor(() => {
				const texts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(texts).toContain("Grandchild");
				expect(texts).not.toContain("Parent");
			});
		});

		test("ArrowLeft in submenu navigates back one level at a time", async () => {
			const deepItems: MenuItem[] = [
				{
					id: "parent",
					label: "Parent",
					items: [
						{
							id: "child",
							label: "Child",
							items: [{ id: "grandchild", label: "Grandchild" }]
						}
					]
				}
			];
			const { container } = render(<SlidingMenu id="test-menu" items={deepItems} />);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus();
			await userEvent.keyboard("{ArrowRight}"); // root → Child level
			await waitFor(() => {
				const texts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(texts).toContain("Child");
			});
			const subItems = getAllByDataRole(container, DataRoles.Menu.Item);
			subItems[1].focus(); // Child
			await userEvent.keyboard("{ArrowRight}"); // Child level → Grandchild level
			await waitFor(() => {
				const texts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(texts).toContain("Grandchild");
			});
			await userEvent.keyboard("{ArrowLeft}"); // back to Child level
			await waitFor(() => {
				const texts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(texts).toContain("Child");
				expect(texts).not.toContain("Grandchild");
			});
			await userEvent.keyboard("{ArrowLeft}"); // back to root level
			await waitFor(() => {
				const texts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(texts).toContain("Parent");
				expect(texts).not.toContain("Child");
			});
		});
	});
});
