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

import { describe, test, expect, beforeAll, beforeEach, afterEach } from "vitest";
import {
	render,
	waitFor,
	setupDevice,
	getAllByDataRole,
	getByDataRole,
	queryByDataRole,
	queryAllByDataRole
} from "test-utils";
import { page, userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { KeyboardNavigationConfigProvider } from "../../../keyboard-navigation/main/keyboard-navigation-context.js";
import { FlyoutMenu } from "../../main/flyout-menu.view.js";
import type { MenuItem, MenuItemType } from "../../main/menu.api.js";

const items: MenuItem[] = [
	{ id: "a", label: "Alpha" },
	{ id: "b", label: "Beta" },
	{ id: "c", label: "Gamma", items: [{ id: "c1", label: "Sub 1" }] }
];

const itemsWithSubMenu: MenuItem[] = [
	{ id: "a", label: "Alpha" },
	{
		id: "b",
		label: "Beta",
		items: [
			{ id: "b1", label: "Sub 1" },
			{ id: "b2", label: "Sub 2" },
			{ id: "b3", label: "Sub 3" }
		]
	}
];

const multiSubMenuItems: MenuItem[] = [
	{ id: "a", label: "Alpha", items: [{ id: "a1", label: "A-Sub 1" }] },
	{ id: "b", label: "Beta" },
	{ id: "c", label: "Gamma", items: [{ id: "c1", label: "C-Sub 1" }] }
];

const adjacentSubMenuItems: MenuItem[] = [
	{ id: "a", label: "Alpha", items: [{ id: "a1", label: "A-Sub 1" }] },
	{ id: "b", label: "Beta", items: [{ id: "b1", label: "B-Sub 1" }] },
	{ id: "c", label: "Gamma" }
];

const verticalItemsWithNestedSubMenu: MenuItem[] = [
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

const groupItems: MenuItemType[] = [
	{
		type: "group" as const,
		id: "g1",
		label: "Group 1",
		items: [
			{ id: "a", label: "Alpha" },
			{ id: "b", label: "Beta" }
		]
	},
	{
		type: "group" as const,
		id: "g2",
		label: "Group 2",
		items: [{ id: "c", label: "Gamma" }]
	}
];

describe("com.mgmtp.a12.widgets.flyout-menu", () => {
	describe("arrow-only mode", () => {
		beforeAll(() => {
			setupDevice("desktop");
		});

		/**
		 * The browser keeps one real pointer position for the whole page, and it survives across tests
		 * and test files. Whenever the DOM changes, Chromium re-dispatches `mouseover` for the element
		 * that ends up under that stationary pointer. If the pointer happens to rest where a menu item
		 * is rendered, the menu reacts to a hover nobody performed: it opens or closes submenus behind
		 * the keyboard interaction under test. Park the pointer in an empty corner before every test so
		 * that only the keyboard drives the menu.
		 */
		beforeEach(async () => {
			const parkingSpot = document.createElement("div");

			parkingSpot.setAttribute("style", "position:fixed;right:0;bottom:0;width:20px;height:20px");
			document.body.append(parkingSpot);
			await userEvent.hover(parkingSpot);
			parkingSpot.remove();
		});

		describe("basic navigation", () => {
			test("ArrowRight in arrow-only mode skips disabled items (horizontal)", async () => {
				const itemsWithDisabled: MenuItem[] = [
					{ id: "a", label: "Alpha" },
					{ id: "b", label: "Beta", disabled: true },
					{ id: "c", label: "Gamma" }
				];
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<FlyoutMenu type="horizontal" items={itemsWithDisabled} />
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Alpha
				await userEvent.keyboard("{ArrowRight}");
				// Beta is disabled (aria-disabled="true") → skipped, focus lands on Gamma
				expect(allItems[2]).toHaveFocus();
			});

			test("ArrowDown in arrow-only mode skips disabled items (vertical)", async () => {
				const itemsWithDisabled: MenuItem[] = [
					{ id: "a", label: "Alpha" },
					{ id: "b", label: "Beta", disabled: true },
					{ id: "c", label: "Gamma" }
				];
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<FlyoutMenu type="vertical" style={{ width: 300 }} items={itemsWithDisabled} />
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Alpha
				await userEvent.keyboard("{ArrowDown}");
				// Beta is disabled (aria-disabled="true") → skipped, focus lands on Gamma
				expect(allItems[2]).toHaveFocus();
			});

			test("Tab in arrow-only mode moves focus to element after menu (horizontal)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={items} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus();
				await userEvent.tab();
				expect(container.querySelector("#after-btn")).toHaveFocus();
			});

			test("Shift+Tab in arrow-only mode moves focus to element before menu (horizontal)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={items} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus();
				await userEvent.tab({ shift: true });
				expect(container.querySelector("#before-btn")).toHaveFocus();
			});

			test("Tab in arrow-only mode moves focus to element after menu (vertical)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="vertical" style={{ width: 300 }} items={items} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus();
				await userEvent.tab();
				expect(container.querySelector("#after-btn")).toHaveFocus();
			});

			test("Shift+Tab in arrow-only mode moves focus to element before menu (vertical)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="vertical" style={{ width: 300 }} items={items} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus();
				await userEvent.tab({ shift: true });
				expect(container.querySelector("#before-btn")).toHaveFocus();
			});

			test("Tab from last item in arrow-only mode moves focus to element after menu (horizontal)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={items} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems.length).toBe(3);
				allItems[allItems.length - 1].focus();
				await userEvent.tab();
				expect(container.querySelector("#after-btn")).toHaveFocus();
			});

			test("Shift+Tab from last item in arrow-only mode moves focus to element before menu (horizontal)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={items} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems.length).toBe(3);
				allItems[allItems.length - 1].focus();
				await userEvent.tab({ shift: true });
				expect(container.querySelector("#before-btn")).toHaveFocus();
			});

			test("Tab from last item in arrow-only mode moves focus to element after menu (vertical)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="vertical" style={{ width: 300 }} items={items} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems.length).toBe(3);
				allItems[allItems.length - 1].focus();
				await userEvent.tab();
				expect(container.querySelector("#after-btn")).toHaveFocus();
			});

			test("Shift+Tab from last item in arrow-only mode moves focus to element before menu (vertical)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="vertical" style={{ width: 300 }} items={items} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems.length).toBe(3);
				allItems[allItems.length - 1].focus();
				await userEvent.tab({ shift: true });
				expect(container.querySelector("#before-btn")).toHaveFocus();
			});

			test("Shift+Tab chain from vertical menu reaches horizontal menu and then before-all button", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-all">Before All</button>
						<FlyoutMenu id="h-menu" type="horizontal" items={items} />
						<button id="between">Between</button>
						<FlyoutMenu id="v-menu" type="vertical" items={items} />
						<button id="after-all">After All</button>
					</KeyboardNavigationConfigProvider>
				);
				const vItems = container.querySelectorAll<HTMLElement>(`#v-menu [data-role="${DataRoles.Menu.Item}"]`);
				// Simulate user navigating to v-menu item 2 via arrow keys
				vItems[1].tabIndex = 0;
				vItems[0].tabIndex = -1;
				vItems[1].focus();

				// Shift+Tab from v-menu → should land on "between" button (last element before v-menu)
				await userEvent.tab({ shift: true });
				expect(container.querySelector("#between")).toHaveFocus();

				// Shift+Tab from "between" → browser naturally goes to h-menu item 0 (tabIndex=0)
				await userEvent.tab({ shift: true });
				const hItem0 = container.querySelector<HTMLElement>(`#h-menu [data-role="${DataRoles.Menu.Item}"]`);
				expect(hItem0).toHaveFocus();

				// Shift+Tab from h-menu item → should land on "before-all" button
				await userEvent.tab({ shift: true });
				expect(container.querySelector("#before-all")).toHaveFocus();
			});

			test("Shift+Tab when menu is the FIRST focusable element lets browser handle it (no stuck)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<FlyoutMenu type="horizontal" items={items} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
				menuItems[0].focus();

				const activeBeforeShiftTab = document.activeElement;
				await userEvent.tab({ shift: true });

				if (document.activeElement === activeBeforeShiftTab) {
					// No movement — verify Tab still works (if stuck, Tab would re-enter menu handler)
					await userEvent.tab();
					expect(container.querySelector("#after-btn")).toHaveFocus();
				}
			});
		});

		describe("submenu Tab behavior", () => {
			test("Tab from open submenu item exits to element after menu (horizontal)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={itemsWithSubMenu} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems.length).toBe(2);
				allItems[1].focus(); // Beta — has sub-items
				await userEvent.keyboard("{ArrowDown}"); // opens submenu, focuses first submenu item
				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus();
				});
				await userEvent.tab();
				await waitFor(() => {
					expect(container.querySelector("#after-btn")).toHaveFocus();
				});
			});

			test("Shift+Tab from open submenu item exits to element before menu (horizontal)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={itemsWithSubMenu} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems.length).toBe(2);
				allItems[1].focus(); // Beta — has sub-items
				await userEvent.keyboard("{ArrowDown}"); // opens submenu, focuses first submenu item
				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus();
				});
				await userEvent.tab({ shift: true });
				await waitFor(() => {
					expect(container.querySelector("#before-btn")).toHaveFocus();
				});
			});

			test("Tab from open submenu item exits to element after menu (vertical)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="vertical" style={{ width: 300 }} items={itemsWithSubMenu} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems.length).toBe(2);
				allItems[1].focus(); // Beta — has sub-items
				await userEvent.keyboard("{ArrowRight}"); // opens submenu, focuses first submenu item
				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus();
				});
				await userEvent.tab();
				await waitFor(
					() => {
						expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
						expect(container.querySelector("#after-btn")).toHaveFocus();
					},
					{ timeout: 500 }
				);
			});

			test("Shift+Tab from open submenu item exits to element before menu (vertical)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="vertical" style={{ width: 300 }} items={itemsWithSubMenu} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems.length).toBe(2);
				allItems[1].focus(); // Beta — has sub-items
				await userEvent.keyboard("{ArrowRight}"); // opens submenu, focuses first submenu item
				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus();
				});
				await userEvent.tab({ shift: true });
				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
					expect(container.querySelector("#before-btn")).toHaveFocus();
				});
			});

			test("Tab from open submenu item closes submenu (horizontal)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={itemsWithSubMenu} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus();
				await userEvent.keyboard("{ArrowDown}"); // opens submenu, focuses first submenu item
				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
				});
				await userEvent.tab();
				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
				});
			});

			test("Shift+Tab from open submenu item closes submenu (horizontal)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={itemsWithSubMenu} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus(); // Beta — has sub-items
				await userEvent.keyboard("{ArrowDown}"); // opens submenu, focuses first submenu item
				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
				});
				await userEvent.tab({ shift: true });
				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
				});
			});

			test("Tab from open submenu item closes submenu (vertical)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="vertical" style={{ width: 300 }} items={itemsWithSubMenu} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus(); // Beta — has sub-items
				await userEvent.keyboard("{ArrowRight}"); // opens submenu, focuses first submenu item
				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
				});
				await userEvent.tab();

				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
				});
			});

			test("Shift+Tab from open submenu item closes submenu (vertical)", async () => {
				const { queryByDataRole, getAllByDataRole } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="vertical" style={{ width: 300 }} items={itemsWithSubMenu} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(DataRoles.Menu.Item);
				allItems[1].focus(); // Beta — has sub-items
				await userEvent.keyboard("{ArrowRight}"); // opens submenu, focuses first submenu item
				await waitFor(() => {
					expect(queryByDataRole(DataRoles.SubMenu.Content)).toBeInTheDocument();
				});
				await userEvent.tab({ shift: true });
				await waitFor(() => {
					expect(queryByDataRole(DataRoles.SubMenu.Content)).not.toBeInTheDocument();
				});
			});
		});

		describe("deeply nested submenu Tab", () => {
			test("Tab from grandchild level closes all submenus and exits menu (vertical)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="vertical" style={{ width: 300 }} items={verticalItemsWithNestedSubMenu} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Parent
				await userEvent.keyboard("{ArrowRight}"); // open Parent's submenu

				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
				});
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				expect(subItems.length).toBeGreaterThan(0);
				await waitFor(() => {
					expect(subItems[0]).toHaveFocus(); // Child focused
				});

				await userEvent.keyboard("{ArrowRight}"); // open Child's sub-submenu

				await waitFor(() => {
					const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
					expect(subMenuContents.length).toBe(2);
				});
				const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
				const grandchildSubItems = getAllByDataRole(subMenuContents[1], DataRoles.Menu.Item);
				expect(grandchildSubItems.length).toBeGreaterThan(0);
				await waitFor(() => {
					expect(grandchildSubItems[0]).toHaveFocus();
				});

				await userEvent.tab();

				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
					expect(container.querySelector("#after-btn")).toHaveFocus();
				});
			});

			test("Shift+Tab from grandchild level closes all submenus and exits menu (vertical)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="vertical" items={verticalItemsWithNestedSubMenu} style={{ width: 300 }} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Parent
				await userEvent.keyboard("{ArrowRight}"); // open Parent's submenu

				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
				});
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				expect(subItems.length).toBeGreaterThan(0);
				await waitFor(() => {
					expect(subItems[0]).toHaveFocus(); // Child focused
				});

				await userEvent.keyboard("{ArrowRight}"); // open Child's sub-submenu

				await waitFor(() => {
					const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
					expect(subMenuContents.length).toBe(2);
				});
				const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
				const grandchildSubItems = getAllByDataRole(subMenuContents[1], DataRoles.Menu.Item);
				expect(grandchildSubItems.length).toBeGreaterThan(0);
				await waitFor(() => {
					expect(grandchildSubItems[0]).toHaveFocus();
				});

				await userEvent.tab({ shift: true });

				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
					expect(container.querySelector("#before-btn")).toHaveFocus();
				});
			});

			test("Tab from grandchild level closes all submenus and exits menu (horizontal)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={verticalItemsWithNestedSubMenu} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Parent
				await userEvent.keyboard("{ArrowDown}"); // open Parent's submenu (horizontal opens with ArrowDown)

				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
				});
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				expect(subItems.length).toBeGreaterThan(0);
				await waitFor(() => {
					expect(subItems[0]).toHaveFocus(); // Child focused
				});

				await userEvent.keyboard("{ArrowRight}"); // open Child's sub-submenu (sub-items are vertical, ArrowRight opens)

				await waitFor(() => {
					const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
					expect(subMenuContents.length).toBe(2);
				});

				await userEvent.tab();

				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
					expect(container.querySelector("#after-btn")).toHaveFocus();
				});
			});
		});

		describe("horizontal menu with group", () => {
			test("Shift+Tab from first group item exits to element before menu", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={groupItems} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems.length).toBe(3);
				allItems[0].focus(); // Alpha — first item
				await userEvent.tab({ shift: true });
				expect(container.querySelector("#before-btn")).toHaveFocus();
			});

			test("Shift+Tab from second item (further item) exits to element before menu", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={groupItems} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems.length).toBe(3);
				allItems[1].focus(); // Beta — second item (in first group)
				await userEvent.tab({ shift: true });
				expect(container.querySelector("#before-btn")).toHaveFocus();
			});

			test("Shift+Tab from item in second group exits to element before menu", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={groupItems} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems.length).toBe(3);
				allItems[2].focus(); // Gamma — item in second group
				await userEvent.tab({ shift: true });
				expect(container.querySelector("#before-btn")).toHaveFocus();
			});

			test("Tab from any item exits to element after menu", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={groupItems} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems.length).toBe(3);
				allItems[1].focus(); // Beta — any non-last item
				await userEvent.tab();
				expect(container.querySelector("#after-btn")).toHaveFocus();
			});

			test("Tab from last item exits to element after menu", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={groupItems} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems.length).toBe(3);
				allItems[2].focus(); // Gamma — last item
				await userEvent.tab();
				expect(container.querySelector("#after-btn")).toHaveFocus();
			});
		});

		describe("re-entry via Shift+Tab", () => {
			test("Shift+Tab from element after menu returns focus to first item (horizontal)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={items} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const afterBtn = container.querySelector<HTMLElement>("#after-btn")!;
				afterBtn.focus();
				await userEvent.tab({ shift: true });
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems[0]).toHaveFocus(); // first item — Alpha
			});

			test("Shift+Tab from element after menu returns focus to last navigated item after arrow navigation (horizontal)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={items} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				// Navigate to last item via arrows, then Tab out
				allItems[0].focus();
				await userEvent.keyboard("{ArrowRight}");
				await userEvent.keyboard("{ArrowRight}");
				await userEvent.tab(); // exits to #after-btn, preserves last active item
				expect(container.querySelector("#after-btn")).toHaveFocus();
				// Now Shift+Tab from #after-btn should return to last navigated item — Gamma
				await userEvent.tab({ shift: true });
				expect(allItems[2]).toHaveFocus(); // last navigated item — Gamma
			});

			test("Tab from element before menu lands on first item (horizontal)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={items} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const beforeBtn = container.querySelector<HTMLElement>("#before-btn")!;
				beforeBtn.focus();
				await userEvent.tab();
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems[0]).toHaveFocus(); // first item — Alpha
			});

			test("Shift+Tab from element after menu returns focus to first item (vertical)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="vertical" style={{ width: 300 }} items={items} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const afterBtn = container.querySelector<HTMLElement>("#after-btn")!;
				afterBtn.focus();
				await userEvent.tab({ shift: true });
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems[0]).toHaveFocus(); // first item — Alpha
			});

			test("Shift+Tab from element after grouped menu returns focus to first item", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={groupItems} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const afterBtn = container.querySelector<HTMLElement>("#after-btn")!;
				afterBtn.focus();
				await userEvent.tab({ shift: true });
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				expect(allItems[0]).toHaveFocus(); // first item — Alpha
			});
		});

		describe("submenu close/open on horizontal parent navigation", () => {
			test("ArrowRight from open submenu closes it and moves focus to next parent item", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<FlyoutMenu type="horizontal" items={multiSubMenuItems} />
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				// allItems[0]=Alpha(has submenu), allItems[1]=Beta(no submenu), allItems[2]=Gamma(has submenu)
				allItems[0].focus();
				await userEvent.keyboard("{ArrowDown}"); // open Alpha's submenu

				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus();
				});

				await userEvent.keyboard("{ArrowRight}"); // navigate to Beta (no submenu)

				await waitFor(() => {
					expect(allItems[1]).toHaveFocus(); // Beta focused
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
				});
			});

			test("ArrowLeft from open submenu closes it and moves focus to previous parent item", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<FlyoutMenu type="horizontal" items={multiSubMenuItems} />
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[2].focus(); // Gamma (has submenu)
				await userEvent.keyboard("{ArrowDown}"); // open Gamma's submenu

				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus();
				});

				await userEvent.keyboard("{ArrowLeft}"); // navigate to Beta (no submenu)

				await waitFor(() => {
					expect(allItems[1]).toHaveFocus(); // Beta focused
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
				});
			});

			test("ArrowRight from open submenu opens next parent's submenu when it has one", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<FlyoutMenu type="horizontal" items={adjacentSubMenuItems} />
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				// allItems[0]=Alpha(has submenu), allItems[1]=Beta(has submenu), allItems[2]=Gamma(no submenu)
				allItems[0].focus();
				await userEvent.keyboard("{ArrowDown}"); // open Alpha's submenu

				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus();
				});

				await userEvent.keyboard("{ArrowRight}"); // navigate to Beta (has submenu)

				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus();
				});
			});
		});

		describe("condensed menu", () => {
			afterEach(async () => {
				await page.viewport(1280, 800);
			});

			test("Tab from condensed item closes the condensed dropdown (horizontal, arrow-only)", async () => {
				await page.viewport(100, 600);

				const manyItems: MenuItem[] = [
					{ id: "c1", label: "Alpha with long label" },
					{ id: "c2", label: "Beta with long label" },
					{ id: "c3", label: "Gamma with long label" },
					{ id: "c4", label: "Delta with long label" },
					{ id: "c5", label: "Epsilon with long label" },
					{ id: "c6", label: "Zeta with long label" },
					{ id: "c7", label: "Eta with long label" }
				];

				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={manyItems} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);

				let condensedButton: HTMLElement;

				await waitFor(
					() => {
						const condensed = container.querySelector<HTMLElement>("[class*='nav__item--condensed']");
						expect(condensed).toBeInTheDocument();
						condensedButton = condensed!;
					},
					{ timeout: 2000 }
				);

				await userEvent.click(condensedButton!);

				await waitFor(
					() => {
						expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
					},
					{ timeout: 1000 }
				);

				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				expect(subItems.length).toBeGreaterThan(0);
				subItems[0].focus();

				await userEvent.tab();

				await waitFor(
					() => {
						expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
					},
					{ timeout: 1000 }
				);

				expect(container.querySelector("#after-btn")).toHaveFocus();
			});
		});
	});
});
