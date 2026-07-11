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

import { KeyboardNavigationConfigProvider } from "../../../keyboard-navigation/main/keyboard-navigation-context.js";
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
	describe("arrow-only mode", () => {
		test("ArrowDown skips disabled items", async () => {
			const itemsWithDisabled: MenuItem[] = [
				{ id: "a", label: "Alpha" },
				{ id: "b", label: "Beta", disabled: true },
				{ id: "c", label: "Gamma" }
			];
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<SlidingMenu items={itemsWithDisabled} />
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus(); // Alpha
			await userEvent.keyboard("{ArrowDown}");
			// Beta is disabled (aria-disabled="true") → skipped, focus lands on Gamma
			expect(menuItems[2]).toHaveFocus();
		});

		test("ArrowUp skips disabled items", async () => {
			const itemsWithDisabled: MenuItem[] = [
				{ id: "a", label: "Alpha" },
				{ id: "b", label: "Beta", disabled: true },
				{ id: "c", label: "Gamma" }
			];
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<SlidingMenu items={itemsWithDisabled} />
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma
			await userEvent.keyboard("{ArrowUp}");
			// Beta is disabled (aria-disabled="true") → skipped, focus lands on Alpha
			expect(menuItems[0]).toHaveFocus();
		});

		test("Tab moves focus to element after menu", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button id="before-btn">Before</button>
					<SlidingMenu items={items} />
					<button id="after-btn">After</button>
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus();
			await userEvent.tab();
			expect(container.querySelector("#after-btn")).toHaveFocus();
		});

		test("calls onTabOut on Tab regardless of position", async () => {
			const onTabOut = vi.fn();
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<SlidingMenu items={items} onTabOut={onTabOut} />
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus(); // focus first item, not last
			await userEvent.tab();
			expect(onTabOut).toHaveBeenCalledOnce();
		});

		test("Shift+Tab moves focus to element before menu", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button id="before-btn">Before</button>
					<SlidingMenu items={items} />
					<button id="after-btn">After</button>
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus();
			await userEvent.tab({ shift: true });
			expect(container.querySelector("#before-btn")).toHaveFocus();
		});

		test("does NOT call onTabOut on Shift+Tab", async () => {
			const onTabOut = vi.fn();
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<SlidingMenu items={items} onTabOut={onTabOut} />
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus();
			await userEvent.tab({ shift: true });
			expect(onTabOut).not.toHaveBeenCalled();
		});

		test("Tab from within nested submenu moves focus to element after menu", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button id="before-btn">Before</button>
					<SlidingMenu id="test-menu" items={items} />
					<button id="after-btn">After</button>
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma (has children)
			await userEvent.keyboard("{ArrowRight}"); // navigate into submenu
			await waitFor(() => {
				const allItemTexts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(allItemTexts).toContain("Sub 1");
			});
			await userEvent.tab();
			expect(container.querySelector("#after-btn")).toHaveFocus();
		});

		test("Shift+Tab from within nested submenu moves focus to element before menu", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button id="before-btn">Before</button>
					<SlidingMenu id="test-menu" items={items} />
					<button id="after-btn">After</button>
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma (has children)
			await userEvent.keyboard("{ArrowRight}"); // navigate into submenu
			await waitFor(() => {
				const allItemTexts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(allItemTexts).toContain("Sub 1");
			});
			await userEvent.tab({ shift: true });
			expect(container.querySelector("#before-btn")).toHaveFocus();
		});

		test("Tab from within nested submenu does NOT close the submenu", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button id="before-btn">Before</button>
					<SlidingMenu id="test-menu" items={items} />
					<button id="after-btn">After</button>
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma (has children)
			await userEvent.keyboard("{ArrowRight}"); // navigate into submenu
			await waitFor(() => {
				const allItemTexts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(allItemTexts).toContain("Sub 1");
			});
			await userEvent.tab();
			await waitFor(() => {
				const allItemTexts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(allItemTexts).toContain("Sub 1");
				expect(allItemTexts).not.toContain("Alpha");
			});
		});

		test("Shift+Tab from within nested submenu does NOT close the submenu", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button id="before-btn">Before</button>
					<SlidingMenu id="test-menu" items={items} />
					<button id="after-btn">After</button>
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma (has children)
			await userEvent.keyboard("{ArrowRight}"); // navigate into submenu
			await waitFor(() => {
				const allItemTexts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(allItemTexts).toContain("Sub 1");
			});
			await userEvent.tab({ shift: true });
			await waitFor(() => {
				const allItemTexts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(allItemTexts).toContain("Sub 1");
				expect(allItemTexts).not.toContain("Alpha");
			});
		});

		test("Tab from element before menu lands on first item", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button id="before-btn">Before</button>
					<SlidingMenu items={items} />
					<button id="after-btn">After</button>
				</KeyboardNavigationConfigProvider>
			);
			const beforeBtn = container.querySelector<HTMLElement>("#before-btn")!;
			beforeBtn.focus();
			await userEvent.tab();
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			expect(menuItems[0]).toHaveFocus(); // first item — Alpha
		});

		test("Shift+Tab from element after menu returns focus to first item", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button id="before-btn">Before</button>
					<SlidingMenu items={items} />
					<button id="after-btn">After</button>
				</KeyboardNavigationConfigProvider>
			);
			const afterBtn = container.querySelector<HTMLElement>("#after-btn")!;
			afterBtn.focus();
			await userEvent.tab({ shift: true });
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			expect(menuItems[0]).toHaveFocus(); // first item — Alpha
		});

		test("Shift+Tab from element after menu returns focus to last navigated item after arrow navigation", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button id="before-btn">Before</button>
					<SlidingMenu items={items} />
					<button id="after-btn">After</button>
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus();
			await userEvent.keyboard("{ArrowDown}"); // navigate to second item
			await userEvent.tab(); // exits to #after-btn, preserves last active item
			expect(container.querySelector("#after-btn")).toHaveFocus();
			await userEvent.tab({ shift: true });
			const updatedItems = getAllByDataRole(container, DataRoles.Menu.Item);
			expect(updatedItems[1]).toHaveFocus(); // last navigated item — second item
		});

		test("Shift+Tab from element after menu returns focus to first item after exiting from submenu", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button id="before-btn">Before</button>
					<SlidingMenu id="test-menu" items={items} />
					<button id="after-btn">After</button>
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma (has children)
			await userEvent.keyboard("{ArrowRight}"); // navigate into submenu
			await waitFor(() => {
				const allItemTexts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(allItemTexts).toContain("Sub 1");
			});
			await userEvent.tab(); // exit to #after-btn; submenu stays open
			expect(container.querySelector("#after-btn")).toHaveFocus();
			await userEvent.tab({ shift: true }); // returns focus into still-visible submenu
			await waitFor(() => {
				// sub-menu is still showing; roving tabindex has tabindex=0 on the first sub-menu item (Sub 1)
				const subMenuItems = getAllByDataRole(container, DataRoles.Menu.Item);
				const firstSubItem = subMenuItems.find((el) => el.getAttribute("tabindex") === "0");
				expect(firstSubItem).toHaveFocus();
			});
		});

		test("Shift+Tab skips visibility:hidden SlidingMenu that sits between a real element and the visible one", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button id="before-btn">Before</button>
					<div style={{ visibility: "hidden" }}>
						<SlidingMenu id="hidden-menu" items={items} />
					</div>
					<SlidingMenu id="visible-menu" items={items} />
					<button id="after-btn">After</button>
				</KeyboardNavigationConfigProvider>
			);

			const visibleMenu = container.querySelector<HTMLElement>("#visible-menu")!;
			const visibleMenuItems = getAllByDataRole(visibleMenu, DataRoles.Menu.Item);
			visibleMenuItems[0].focus();
			await userEvent.tab({ shift: true });
			expect(container.querySelector("#before-btn")).toHaveFocus();
		});

		test("does not steal focus back to hiddenMainMenuElement when focus has left the menu container", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button id="before-btn">Before</button>
					<SlidingMenu id="test-menu" items={items} />
					<button id="after-btn">After</button>
				</KeyboardNavigationConfigProvider>
			);

			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma — has children

			// Navigate forward; this starts the CSSTransition (timeout=100ms)
			await userEvent.keyboard("{ArrowRight}");

			// Tab in arrow-only mode exits to the after-btn *before* handleEntered fires
			await userEvent.tab();

			// Wait longer than the 100ms CSSTransition timeout so handleEntered has fired
			await waitFor(
				() => {
					expect(document.getElementById("after-btn")).toHaveFocus();
				},
				{ timeout: 300 }
			);
		});

		test("ArrowRight at root level focuses a menu item (not body/container) after opening submenu", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<SlidingMenu id="test-menu" items={items} />
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma — has children
			await userEvent.keyboard("{ArrowRight}");
			await waitFor(() => {
				expect(document.activeElement).toHaveAttribute("data-role", String(DataRoles.Menu.Item));
			});
		});

		test("Shift+Tab after Enter→submenu→ArrowLeft returns focus to the item that opened the submenu, not the first item", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<button id="before-btn">Before</button>
					<SlidingMenu id="test-menu" items={items} />
					<button id="after-btn">After</button>
				</KeyboardNavigationConfigProvider>
			);
			// Navigate to Gamma via arrow keys so the roving tabindex tracks Gamma
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus(); // Alpha
			await userEvent.keyboard("{ArrowDown}"); // Beta
			await userEvent.keyboard("{ArrowDown}"); // Gamma — has children
			await userEvent.keyboard("{Enter}"); // open submenu
			await waitFor(() => {
				const allItemTexts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(allItemTexts).toContain("Sub 1");
			});
			await userEvent.keyboard("{ArrowLeft}"); // navigate back to root; focus returns to Gamma
			await waitFor(() => {
				expect(getAllByDataRole(container, DataRoles.Menu.Item).length).toBe(items.length);
			});
			await userEvent.tab(); // exit menu to #after-btn
			expect(container.querySelector("#after-btn")).toHaveFocus();
			await userEvent.tab({ shift: true });
			// Shift+Tab must return focus to Gamma (the item that was focused before Tab), not Alpha (first item)
			const rootItems = getAllByDataRole(container, DataRoles.Menu.Item);
			expect(rootItems[2]).toHaveFocus(); // Gamma
		});

		test("ArrowDown works after ArrowRight opens submenu at root level in arrow-only mode", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<SlidingMenu id="test-menu" items={items} />
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma — has children
			await userEvent.keyboard("{ArrowRight}"); // open submenu
			await waitFor(() => {
				expect(document.activeElement).toHaveAttribute("data-role", String(DataRoles.Menu.Item));
			});
			await userEvent.keyboard("{ArrowDown}");
			await waitFor(() => {
				const subItems = getAllByDataRole(container, DataRoles.Menu.Item);
				const activeIndex = subItems.indexOf(document.activeElement as HTMLElement);
				expect(activeIndex).toBe(1); // Sub 1 (after backward item at index 0)
			});
		});

		test("ArrowLeft in submenu navigates back in arrow-only mode", async () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<SlidingMenu id="test-menu" items={items} />
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[2].focus(); // Gamma — has children
			await userEvent.keyboard("{ArrowRight}"); // enter submenu
			await waitFor(() => {
				const texts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(texts).toContain("Sub 1");
			});
			await userEvent.keyboard("{ArrowLeft}"); // navigate back
			await waitFor(() => {
				const rootItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(rootItems.length).toBe(items.length);
			});
		});

		test("ArrowRight in submenu navigates into deeper level in arrow-only mode", async () => {
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
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<SlidingMenu id="test-menu" items={deepItems} />
				</KeyboardNavigationConfigProvider>
			);
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			menuItems[0].focus(); // Parent
			await userEvent.keyboard("{ArrowRight}"); // root → Child level
			await waitFor(() => {
				const texts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(texts).toContain("Child");
			});
			const subItems = getAllByDataRole(container, DataRoles.Menu.Item);
			subItems[1].focus(); // Child — has grandchild
			await userEvent.keyboard("{ArrowRight}"); // Child level → Grandchild level
			await waitFor(() => {
				const texts = getAllByDataRole(container, DataRoles.Menu.Item.Text).map((el) => el.textContent?.trim());
				expect(texts).toContain("Grandchild");
				expect(texts).not.toContain("Parent");
			});
		});

		test("ArrowLeft in submenu navigates back one level at a time in arrow-only mode", async () => {
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
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<SlidingMenu id="test-menu" items={deepItems} />
				</KeyboardNavigationConfigProvider>
			);
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
