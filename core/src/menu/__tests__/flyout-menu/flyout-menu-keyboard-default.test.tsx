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

import { describe, test, expect, beforeAll } from "vitest";
import {
	render,
	waitFor,
	setupDevice,
	getAllByDataRole,
	getByDataRole,
	queryByDataRole,
	queryAllByDataRole
} from "test-utils";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { KeyboardNavigationConfigProvider } from "../../../keyboard-navigation/main/keyboard-navigation-context.js";
import { FlyoutMenu } from "../../main/flyout-menu.view.js";
import type { MenuItem } from "../../main/menu.api.js";

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

const verticalNestedMultiGrandchildren: MenuItem[] = [
	{
		id: "parent",
		label: "Parent",
		items: [
			{
				id: "child",
				label: "Child",
				items: [
					{ id: "gc1", label: "Grandchild 1" },
					{ id: "gc2", label: "Grandchild 2" },
					{ id: "gc3", label: "Grandchild 3" }
				]
			}
		]
	}
];

describe("com.mgmtp.a12.widgets.flyout-menu", () => {
	describe("default mode", () => {
		beforeAll(() => {
			setupDevice("desktop");
		});

		describe("keyboard navigation (horizontal)", () => {
			test("moves focus right with ArrowRight", async () => {
				const { getAllByDataRole } = render(<FlyoutMenu type="horizontal" items={items} />);
				const allItems = getAllByDataRole(DataRoles.Menu.Item);
				allItems[0].focus();
				await userEvent.keyboard("{ArrowRight}");
				expect(allItems[1]).toHaveFocus();
			});

			test("moves focus left with ArrowLeft, wrapping to last", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={items} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus();
				await userEvent.keyboard("{ArrowLeft}");
				expect(allItems[allItems.length - 1]).toHaveFocus();
			});

			test("opens submenu with ArrowDown when item has children", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={items} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				const parentItem = allItems[2]; // Gamma with sub-items
				parentItem.focus();
				await userEvent.keyboard("{ArrowDown}");
				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
				});
			});

			test("focuses first submenu item when submenu opens via ArrowDown", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={items} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				const parentItem = allItems[2]; // Gamma with sub-items
				parentItem.focus();
				await userEvent.keyboard("{ArrowDown}");
				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subMenuItems.length).toBeGreaterThan(0);
					expect(subMenuItems[0]).toHaveFocus();
				});
			});
		});

		describe("keyboard navigation (vertical)", { retry: 2 }, () => {
			test("moves focus down with ArrowDown", async () => {
				const { container } = render(<FlyoutMenu type="vertical" style={{ width: 300 }} items={items} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus();
				await userEvent.keyboard("{ArrowDown}");
				expect(allItems[1]).toHaveFocus();
			});

			test("moves focus up with ArrowUp", async () => {
				const { container } = render(<FlyoutMenu type="vertical" style={{ width: 300 }} items={items} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus();
				await userEvent.keyboard("{ArrowUp}");
				expect(allItems[0]).toHaveFocus();
			});

			test("ArrowDown from last item wraps to first", async () => {
				const { container } = render(<FlyoutMenu type="vertical" style={{ width: 300 }} items={items} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[allItems.length - 1].focus();
				await userEvent.keyboard("{ArrowDown}");
				expect(allItems[0]).toHaveFocus();
			});

			test("opens submenu with ArrowRight when item has children", async () => {
				const { container } = render(<FlyoutMenu type="vertical" style={{ width: 300 }} items={items} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				const parentItem = allItems[2]; // Gamma with sub-items
				parentItem.focus();
				await userEvent.keyboard("{ArrowRight}");
				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
				});
				await userEvent.keyboard("{Escape}");
				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
				});
			});

			test("focuses first submenu item when submenu opens via ArrowRight", async () => {
				const { container } = render(<FlyoutMenu type="vertical" style={{ width: 300 }} items={items} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				const parentItem = allItems[2]; // Gamma with sub-items
				parentItem.focus();
				await userEvent.keyboard("{ArrowRight}");
				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
				});
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				expect(subMenuItems.length).toBeGreaterThan(0);
				await waitFor(
					() => {
						expect(subMenuItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);
			});
		});

		describe("submenu arrow key navigation (vertical)", { retry: 2 }, () => {
			test("ArrowDown in open submenu moves focus to next submenu item", async () => {
				const { container } = render(<FlyoutMenu type="vertical" style={{ width: 300 }} items={itemsWithSubMenu} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus(); // Beta — has sub-items
				await userEvent.keyboard("{ArrowRight}"); // open submenu
				await waitFor(
					() => {
						const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
						const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
						expect(subMenuItems.length).toBe(3);
						expect(subMenuItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);
				await userEvent.keyboard("{ArrowDown}");
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				expect(subMenuItems[1]).toHaveFocus();
			});

			test("ArrowUp in open submenu moves focus to previous submenu item", async () => {
				const { container } = render(<FlyoutMenu type="vertical" style={{ width: 300 }} items={itemsWithSubMenu} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus(); // Beta — has sub-items
				await userEvent.keyboard("{ArrowRight}");
				await waitFor(
					() => {
						const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
						const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
						expect(subMenuItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);
				// Manually focus second item to set up precondition
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				subMenuItems[1].focus();
				await userEvent.keyboard("{ArrowUp}");
				const updatedSubMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const updatedSubMenuItems = getAllByDataRole(updatedSubMenuContent, DataRoles.Menu.Item);
				expect(updatedSubMenuItems[0]).toHaveFocus();
			});

			test("ArrowDown on last submenu item wraps to first (vertical)", async () => {
				const { container } = render(<FlyoutMenu type="vertical" style={{ width: 300 }} items={itemsWithSubMenu} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus();
				await userEvent.keyboard("{ArrowRight}");
				await waitFor(
					() => {
						const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
						const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
						expect(subMenuItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				subMenuItems[subMenuItems.length - 1].focus();
				await userEvent.keyboard("{ArrowDown}");
				const updatedSubMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const updatedSubMenuItems = getAllByDataRole(updatedSubMenuContent, DataRoles.Menu.Item);
				expect(updatedSubMenuItems[0]).toHaveFocus();
			});

			test("ArrowUp on first submenu item wraps to last (vertical)", async () => {
				const { container } = render(<FlyoutMenu type="vertical" style={{ width: 300 }} items={itemsWithSubMenu} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus();
				await userEvent.keyboard("{ArrowRight}");
				await waitFor(
					() => {
						const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
						const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
						expect(subMenuItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);
				await userEvent.keyboard("{ArrowUp}");
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				expect(subMenuItems[subMenuItems.length - 1]).toHaveFocus();
			});
		});

		describe("vertical submenu close behavior", { retry: 2 }, () => {
			test("Escape closes vertical submenu and returns focus to parent item", async () => {
				const { container } = render(<FlyoutMenu type="vertical" style={{ width: 300 }} items={itemsWithSubMenu} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus(); // Beta — has sub-items
				await userEvent.keyboard("{ArrowRight}"); // open submenu
				await waitFor(
					() => {
						expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
					},
					{ timeout: 3000 }
				);
				await userEvent.keyboard("{Escape}");
				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
					expect(allItems[1]).toHaveFocus();
				});
			});

			test("ArrowLeft closes vertical submenu and returns focus to parent item", async () => {
				const { container } = render(<FlyoutMenu type="vertical" style={{ width: 300 }} items={itemsWithSubMenu} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus(); // Beta — has sub-items
				await userEvent.keyboard("{ArrowRight}"); // open submenu
				await waitFor(
					() => {
						const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
						const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
						expect(subMenuItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);
				await userEvent.keyboard("{ArrowLeft}"); // close submenu
				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
					expect(allItems[1]).toHaveFocus();
				});
			});
		});

		describe("nested submenu (vertical)", { retry: 2 }, () => {
			test("ArrowRight from child item opens grandchild submenu", async () => {
				const { container } = render(
					<FlyoutMenu type="vertical" style={{ width: 300 }} items={verticalItemsWithNestedSubMenu} />
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Parent
				await userEvent.keyboard("{ArrowRight}"); // open child submenu
				await waitFor(
					() => {
						expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
					},
					{ timeout: 3000 }
				);
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const childItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				await waitFor(
					() => {
						expect(childItems[0]).toHaveFocus(); // Child focused
					},
					{ timeout: 3000 }
				);

				await userEvent.keyboard("{ArrowRight}"); // open grandchild submenu

				await waitFor(
					() => {
						const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
						expect(subMenuContents.length).toBe(2);
					},
					{ timeout: 3000 }
				);
			});

			test("focus lands on first grandchild item after grandchild submenu opens", async () => {
				const { container } = render(
					<FlyoutMenu type="vertical" style={{ width: 300 }} items={verticalNestedMultiGrandchildren} />
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Parent
				await userEvent.keyboard("{ArrowRight}"); // open child submenu
				await waitFor(
					() => {
						const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
						const childItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
						expect(childItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);

				await userEvent.keyboard("{ArrowRight}"); // open grandchild submenu

				await waitFor(
					() => {
						const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
						expect(subMenuContents.length).toBe(2);
						const grandchildItems = getAllByDataRole(subMenuContents[1], DataRoles.Menu.Item);
						expect(grandchildItems.length).toBe(3);
						expect(grandchildItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);
			});

			test("ArrowDown and ArrowUp navigate grandchild items", async () => {
				const { container } = render(
					<FlyoutMenu type="vertical" style={{ width: 300 }} items={verticalNestedMultiGrandchildren} />
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Parent
				await userEvent.keyboard("{ArrowRight}"); // open child submenu
				await waitFor(
					() => {
						const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
						const childItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
						expect(childItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);
				await userEvent.keyboard("{ArrowRight}"); // open grandchild submenu
				await waitFor(
					() => {
						const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
						const grandchildItems = getAllByDataRole(subMenuContents[1], DataRoles.Menu.Item);
						expect(grandchildItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);

				// Navigate down in grandchild
				await userEvent.keyboard("{ArrowDown}");
				const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
				const grandchildItems = getAllByDataRole(subMenuContents[1], DataRoles.Menu.Item);
				expect(grandchildItems[1]).toHaveFocus();

				// Navigate back up
				await userEvent.keyboard("{ArrowUp}");
				const updatedSubMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
				const updatedGrandchildItems = getAllByDataRole(updatedSubMenuContents[1], DataRoles.Menu.Item);
				expect(updatedGrandchildItems[0]).toHaveFocus();
			});

			test("Escape from grandchild closes only grandchild, returns focus to child", async () => {
				const { container } = render(
					<FlyoutMenu type="vertical" style={{ width: 300 }} items={verticalItemsWithNestedSubMenu} />
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Parent
				await userEvent.keyboard("{ArrowRight}"); // open child submenu
				await waitFor(
					() => {
						const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
						const childItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
						expect(childItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);

				// Capture child li reference before opening grandchild
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const childItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				const childLi = childItems[0];

				await userEvent.keyboard("{ArrowRight}"); // open grandchild submenu
				await waitFor(
					() => {
						const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
						expect(subMenuContents.length).toBe(2);
					},
					{ timeout: 3000 }
				);

				await userEvent.keyboard("{Escape}"); // close only grandchild

				await waitFor(() => {
					// child submenu still open, grandchild closed
					const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
					expect(subMenuContents.length).toBe(1);
					expect(childLi).toHaveFocus();
				});
			});

			test("ArrowLeft from grandchild closes grandchild, returns focus to child", async () => {
				const { container } = render(
					<FlyoutMenu type="vertical" style={{ width: 300 }} items={verticalItemsWithNestedSubMenu} />
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Parent
				await userEvent.keyboard("{ArrowRight}"); // open child submenu
				await waitFor(
					() => {
						const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
						const childItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
						expect(childItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);

				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const childItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				const childLi = childItems[0];

				await userEvent.keyboard("{ArrowRight}"); // open grandchild submenu
				await waitFor(
					() => {
						const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
						expect(subMenuContents.length).toBe(2);
					},
					{ timeout: 3000 }
				);

				await userEvent.keyboard("{ArrowLeft}"); // close grandchild

				await waitFor(() => {
					const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
					expect(subMenuContents.length).toBe(1); // child submenu still open
					expect(childLi).toHaveFocus();
				});
			});

			test("Escape from child (no open nested) closes child submenu, returns focus to parent", async () => {
				const { container } = render(
					<FlyoutMenu type="vertical" style={{ width: 300 }} items={verticalItemsWithNestedSubMenu} />
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Parent
				await userEvent.keyboard("{ArrowRight}"); // open child submenu
				await waitFor(
					() => {
						const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
						const childItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
						expect(childItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);

				await userEvent.keyboard("{Escape}"); // close child submenu (no nested open)

				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
					expect(allItems[0]).toHaveFocus(); // Parent focused
				});
			});
		});

		describe("nested submenu (horizontal)", { retry: 2 }, () => {
			test("ArrowDown opens child submenu, ArrowRight opens grandchild submenu", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={verticalItemsWithNestedSubMenu} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Parent (horizontal top-level)
				await userEvent.keyboard("{ArrowDown}"); // open child submenu (horizontal uses ArrowDown)
				await waitFor(
					() => {
						expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
					},
					{ timeout: 3000 }
				);
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const childItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				await waitFor(
					() => {
						expect(childItems[0]).toHaveFocus(); // Child focused
					},
					{ timeout: 3000 }
				);

				await userEvent.keyboard("{ArrowRight}"); // open grandchild (child is vertical, so ArrowRight opens its submenu)

				await waitFor(
					() => {
						const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
						expect(subMenuContents.length).toBe(2);
					},
					{ timeout: 3000 }
				);
			});

			test("focus lands on first grandchild item after grandchild opens (horizontal)", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={verticalNestedMultiGrandchildren} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Parent
				await userEvent.keyboard("{ArrowDown}"); // open child submenu
				await waitFor(
					() => {
						const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
						const childItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
						expect(childItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);

				await userEvent.keyboard("{ArrowRight}"); // open grandchild

				await waitFor(
					() => {
						const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
						expect(subMenuContents.length).toBe(2);
						const grandchildItems = getAllByDataRole(subMenuContents[1], DataRoles.Menu.Item);
						expect(grandchildItems.length).toBe(3);
						expect(grandchildItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);
			});

			test("Escape from grandchild closes only grandchild, returns focus to child (horizontal)", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={verticalItemsWithNestedSubMenu} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Parent
				await userEvent.keyboard("{ArrowDown}"); // open child submenu
				await waitFor(
					() => {
						const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
						const childItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
						expect(childItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);

				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const childItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				const childLi = childItems[0];

				await userEvent.keyboard("{ArrowRight}"); // open grandchild
				await waitFor(
					() => {
						const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
						expect(subMenuContents.length).toBe(2);
					},
					{ timeout: 3000 }
				);

				await userEvent.keyboard("{Escape}"); // close grandchild only

				await waitFor(() => {
					const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
					expect(subMenuContents.length).toBe(1); // child submenu still open
					expect(childLi).toHaveFocus();
				});
			});

			test("ArrowLeft from grandchild closes grandchild, returns focus to child (horizontal)", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={verticalItemsWithNestedSubMenu} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Parent
				await userEvent.keyboard("{ArrowDown}"); // open child submenu
				await waitFor(
					() => {
						const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
						const childItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
						expect(childItems[0]).toHaveFocus();
					},
					{ timeout: 3000 }
				);

				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const childItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				const childLi = childItems[0];

				await userEvent.keyboard("{ArrowRight}"); // open grandchild
				await waitFor(
					() => {
						const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
						expect(subMenuContents.length).toBe(2);
					},
					{ timeout: 3000 }
				);

				await userEvent.keyboard("{ArrowLeft}"); // close grandchild

				await waitFor(() => {
					const subMenuContents = queryAllByDataRole(container, DataRoles.SubMenu.Content);
					expect(subMenuContents.length).toBe(1); // child submenu still open
					expect(childLi).toHaveFocus();
				});
			});
		});

		describe("submenu Tab behavior", () => {
			test("Tab inside open submenu does not close the submenu (horizontal)", async () => {
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="default">
						<button id="before-btn">Before</button>
						<FlyoutMenu type="horizontal" items={itemsWithSubMenu} />
						<button id="after-btn">After</button>
					</KeyboardNavigationConfigProvider>
				);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus(); // Beta — has sub-items
				await userEvent.keyboard("{ArrowDown}"); // open submenu
				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
				});

				await userEvent.tab();

				await waitFor(() => {
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).toBeInTheDocument();
				});
			});
		});

		describe("submenu arrow key navigation (horizontal)", () => {
			test("ArrowDown in open submenu moves focus to next submenu item", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={itemsWithSubMenu} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus(); // Beta
				await userEvent.keyboard("{ArrowDown}");
				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subMenuItems.length).toBe(3);
					expect(subMenuItems[0]).toHaveFocus();
				});
				await userEvent.keyboard("{ArrowDown}");
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				expect(subMenuItems[1]).toHaveFocus();
			});

			test("ArrowUp in open submenu moves focus to previous submenu item", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={itemsWithSubMenu} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus(); // Beta
				await userEvent.keyboard("{ArrowDown}");
				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subMenuItems[0]).toHaveFocus();
				});
				// Manually focus second item to set up the precondition
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				subMenuItems[1].focus();
				await userEvent.keyboard("{ArrowUp}");
				const updatedSubMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const updatedSubMenuItems = getAllByDataRole(updatedSubMenuContent, DataRoles.Menu.Item);
				expect(updatedSubMenuItems[0]).toHaveFocus();
			});

			test("ArrowDown on last submenu item wraps to first (horizontal)", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={itemsWithSubMenu} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus(); // Beta
				await userEvent.keyboard("{ArrowDown}");
				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subMenuItems[0]).toHaveFocus();
				});
				// Focus last submenu item manually
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				subMenuItems[subMenuItems.length - 1].focus();
				await userEvent.keyboard("{ArrowDown}");
				const updatedSubMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const updatedSubMenuItems = getAllByDataRole(updatedSubMenuContent, DataRoles.Menu.Item);
				expect(updatedSubMenuItems[0]).toHaveFocus();
			});

			test("ArrowUp on first submenu item wraps to last (horizontal)", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={itemsWithSubMenu} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus(); // Beta
				await userEvent.keyboard("{ArrowDown}");
				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subMenuItems[0]).toHaveFocus();
				});
				await userEvent.keyboard("{ArrowUp}");
				const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
				const subMenuItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
				expect(subMenuItems[subMenuItems.length - 1]).toHaveFocus();
			});
		});

		describe("submenu arrow-left/right navigation", () => {
			test("horizontal: ArrowRight inside submenu moves focus to next item and opens its submenu", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={multiSubMenuItems} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				// allItems[0]=Alpha(has submenu), allItems[1]=Beta(no submenu), allItems[2]=Gamma(has submenu)
				allItems[0].focus();
				await userEvent.keyboard("{ArrowDown}"); // open Alpha's submenu

				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus(); // focus inside Alpha's submenu
				});

				await userEvent.keyboard("{ArrowRight}"); // navigate to Beta (no submenu)

				await waitFor(() => {
					// Beta is focused, Alpha's submenu is gone
					expect(allItems[1]).toHaveFocus();
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
				});
			});

			test("horizontal: ArrowLeft inside submenu moves focus to previous item and opens its submenu", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={multiSubMenuItems} />);
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

			test("horizontal: ArrowRight from last item's submenu wraps to first and opens its submenu", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={multiSubMenuItems} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[2].focus(); // Gamma (last, has submenu)
				await userEvent.keyboard("{ArrowDown}"); // open Gamma's submenu

				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus();
				});

				await userEvent.keyboard("{ArrowRight}"); // wraps to Alpha (first, has submenu)

				await waitFor(() => {
					// Alpha's submenu is open, focus is on Alpha's first sub-item
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus();
				});
			});

			test("horizontal: ArrowLeft from first item's submenu wraps to last and opens its submenu", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={multiSubMenuItems} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[0].focus(); // Alpha (first, has submenu)
				await userEvent.keyboard("{ArrowDown}"); // open Alpha's submenu

				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus();
				});

				await userEvent.keyboard("{ArrowLeft}"); // wraps to Gamma (last, has submenu)

				await waitFor(() => {
					// Gamma's submenu is open, focus is on Gamma's first sub-item
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus();
				});
			});
		});

		describe("submenu close/open on horizontal parent navigation", () => {
			test("ArrowRight from open submenu to next item with submenu closes old and opens new", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={adjacentSubMenuItems} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				// allItems[0]=Alpha(has submenu), allItems[1]=Beta(has submenu), allItems[2]=Gamma(no submenu)
				allItems[0].focus();
				await userEvent.keyboard("{ArrowDown}"); // open Alpha's submenu

				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus(); // focus on A-Sub 1
				});

				await userEvent.keyboard("{ArrowRight}"); // navigate to Beta (has submenu)

				await waitFor(() => {
					// Beta's submenu should be open with focus on B-Sub 1
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus();
				});
			});

			test("ArrowLeft from open submenu to previous item with submenu closes old and opens new", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={adjacentSubMenuItems} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus(); // Beta (has submenu)
				await userEvent.keyboard("{ArrowDown}"); // open Beta's submenu

				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus(); // focus on B-Sub 1
				});

				await userEvent.keyboard("{ArrowLeft}"); // navigate to Alpha (has submenu)

				await waitFor(() => {
					// Alpha's submenu should be open with focus on A-Sub 1
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus();
				});
			});

			test("ArrowRight from open submenu to next item without submenu closes submenu", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={adjacentSubMenuItems} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				allItems[1].focus(); // Beta (has submenu)
				await userEvent.keyboard("{ArrowDown}"); // open Beta's submenu

				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus(); // focus on B-Sub 1
				});

				await userEvent.keyboard("{ArrowRight}"); // navigate to Gamma (no submenu)

				await waitFor(() => {
					expect(allItems[2]).toHaveFocus(); // Gamma focused
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
				});
			});

			test("ArrowLeft from open submenu to previous item without submenu closes submenu", async () => {
				const { container } = render(<FlyoutMenu type="horizontal" items={multiSubMenuItems} />);
				const allItems = getAllByDataRole(container, DataRoles.Menu.Item);
				// allItems[0]=Alpha(has submenu), allItems[1]=Beta(no submenu), allItems[2]=Gamma(has submenu)
				allItems[2].focus(); // Gamma (has submenu)
				await userEvent.keyboard("{ArrowDown}"); // open Gamma's submenu

				await waitFor(() => {
					const subMenuContent = getByDataRole(container, DataRoles.SubMenu.Content);
					const subItems = getAllByDataRole(subMenuContent, DataRoles.Menu.Item);
					expect(subItems.length).toBeGreaterThan(0);
					expect(subItems[0]).toHaveFocus(); // focus on C-Sub 1
				});

				await userEvent.keyboard("{ArrowLeft}"); // navigate to Beta (no submenu)

				await waitFor(() => {
					expect(allItems[1]).toHaveFocus(); // Beta focused
					expect(queryByDataRole(container, DataRoles.SubMenu.Content)).not.toBeInTheDocument();
				});
			});
		});
	});
});
