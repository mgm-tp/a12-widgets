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

import { render, waitFor, setupDevice, getAllByDataRole, getByDataRole, queryByDataRole } from "test-utils";
import { describe, test, expect, vi, beforeEach, beforeAll, afterAll } from "vitest";
import { userEvent } from "vitest/browser";

import { getA11yResource } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { FlyoutMenu } from "../../main/flyout-menu.view.js";
import type { MenuItem } from "../../main/menu.api.js";
import { MainMenuTpl } from "../../main/template/menu.tpl.view.js";

/**
 * Behavior tests for the menu item, driven through the public `FlyoutMenu` and `MainMenuTpl` API. They pin down the
 * item's event handling, submenu open/close logic, ARIA state, prop updates and unmount handling as a safety net for
 * the conversion of the item to a function component.
 */

const HOVER_DELAY = 100;

/**
 * The browser keeps one real pointer position for the whole page, and it survives across tests and test files.
 * Whenever the DOM changes, Chromium re-dispatches `mouseover` for the element that ends up under that stationary
 * pointer. Park the pointer in an empty corner before every test so that only the interaction under test drives the
 * menu.
 */
async function parkPointer(): Promise<void> {
	const parkingSpot = document.createElement("div");

	parkingSpot.setAttribute("style", "position:fixed;right:0;bottom:0;width:20px;height:20px");
	document.body.append(parkingSpot);
	await userEvent.hover(parkingSpot);
	parkingSpot.remove();
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function getLink(menuItem: HTMLElement): HTMLElement {
	return menuItem.querySelector<HTMLElement>('[role="link"]')!;
}

function querySubMenus(): HTMLElement[] {
	return Array.from(document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.SubMenu.Content}"]`));
}

function getSubMenuItems(index = 0): HTMLElement[] {
	return getAllByDataRole(querySubMenus()[index], DataRoles.Menu.Item);
}

function createItems(onClick?: () => void): MenuItem[] {
	return [
		{
			id: "parent",
			label: "Parent",
			items: [
				{ id: "child", label: "Child", items: [{ id: "grandchild", label: "Grandchild", onClick }] },
				{ id: "child-leaf", label: "Child leaf", onClick }
			]
		},
		{ id: "sibling", label: "Sibling", items: [{ id: "sibling-child", label: "Sibling child" }] },
		{ id: "leaf", label: "Leaf", onClick },
		{ id: "disabled", label: "Disabled", disabled: true, onClick }
	];
}

describe("com.mgmtp.a12.widgets.menu.item", () => {
	beforeEach(async () => {
		await parkPointer();
	});

	describe("event handlers", () => {
		test("calls the item's onClick once when a leaf item is clicked", async () => {
			const onClick = vi.fn();
			const { container } = render(<FlyoutMenu type="horizontal" id="menu" items={createItems(onClick)} />);

			await userEvent.click(getAllByDataRole(container, DataRoles.Menu.Item)[2]);

			expect(onClick).toHaveBeenCalledTimes(1);
		});

		test("does not call onClick when a disabled item is clicked", async () => {
			const onClick = vi.fn();
			const { container } = render(<FlyoutMenu type="horizontal" id="menu" items={createItems(onClick)} />);

			await userEvent.click(getAllByDataRole(container, DataRoles.Menu.Item)[3]);
			await sleep(HOVER_DELAY * 2);

			expect(onClick).not.toHaveBeenCalled();
			expect(querySubMenus()).toHaveLength(0);
		});

		test("calls the onClick handler that is current after a re-render", async () => {
			const firstOnClick = vi.fn();
			const secondOnClick = vi.fn();
			const { container, rerender } = render(
				<FlyoutMenu type="horizontal" id="menu" items={[{ id: "leaf", label: "Leaf", onClick: firstOnClick }]} />
			);

			rerender(
				<FlyoutMenu type="horizontal" id="menu" items={[{ id: "leaf", label: "Leaf", onClick: secondOnClick }]} />
			);
			await userEvent.click(getByDataRole(container, DataRoles.Menu.Item));

			expect(firstOnClick).not.toHaveBeenCalled();
			expect(secondOnClick).toHaveBeenCalledTimes(1);
		});

		test("calls onClick of a submenu leaf and closes the submenu", async () => {
			const onClick = vi.fn();
			const { container } = render(<FlyoutMenu type="horizontal" id="menu" items={createItems(onClick)} />);

			await userEvent.click(getAllByDataRole(container, DataRoles.Menu.Item)[0]);
			await waitFor(() => expect(querySubMenus()[0]).toBeVisible());

			await userEvent.click(getSubMenuItems()[1]);

			expect(onClick).toHaveBeenCalledTimes(1);
			await waitFor(() => expect(querySubMenus()).toHaveLength(0));
		});

		test("clicking a leaf in a nested submenu closes every open submenu", async () => {
			const onClick = vi.fn();
			const { container } = render(<FlyoutMenu type="horizontal" id="menu" items={createItems(onClick)} />);

			await userEvent.click(getAllByDataRole(container, DataRoles.Menu.Item)[0]);
			await waitFor(() => expect(querySubMenus()[0]).toBeVisible());

			await userEvent.hover(getSubMenuItems()[0]);
			await waitFor(() => expect(querySubMenus()[1]).toBeVisible());

			await userEvent.click(getSubMenuItems(1)[0]);

			expect(onClick).toHaveBeenCalledTimes(1);
			await waitFor(() => expect(querySubMenus()).toHaveLength(0));
		});

		test("toggles a horizontal submenu by clicking its parent item", async () => {
			const { container } = render(<FlyoutMenu type="horizontal" id="menu" items={createItems()} />);
			const parent = getAllByDataRole(container, DataRoles.Menu.Item)[0];

			await userEvent.click(parent);
			await waitFor(() => expect(querySubMenus()[0]).toBeVisible());
			expect(getLink(parent)).toHaveAttribute("aria-expanded", "true");

			await userEvent.click(parent);
			await waitFor(() => expect(querySubMenus()).toHaveLength(0));
			expect(getLink(parent)).toHaveAttribute("aria-expanded", "false");
		});

		test("moves focus to the first submenu item shortly after a click opens a horizontal submenu", async () => {
			const { container } = render(<FlyoutMenu type="horizontal" id="menu" items={createItems()} />);

			await userEvent.click(getAllByDataRole(container, DataRoles.Menu.Item)[0]);

			await waitFor(() => expect(getSubMenuItems()[0]).toHaveFocus());
		});

		test("opens a vertical submenu on hover", async () => {
			const { container } = render(
				<FlyoutMenu type="vertical" id="menu" items={createItems()} style={{ width: 300 }} />
			);
			const parent = getAllByDataRole(container, DataRoles.Menu.Item)[0];

			await userEvent.hover(parent);

			await waitFor(() => expect(querySubMenus()[0]).toBeVisible());
			expect(getLink(parent)).toHaveAttribute("aria-expanded", "true");
		});

		test("does not open a submenu when hovering a disabled parent item", async () => {
			const items: MenuItem[] = [
				{ id: "parent", label: "Parent", disabled: true, items: [{ id: "child", label: "Child" }] }
			];
			const { container } = render(<FlyoutMenu type="vertical" id="menu" items={items} style={{ width: 300 }} />);
			const parent = getByDataRole(container, DataRoles.Menu.Item);

			await userEvent.hover(parent);
			await sleep(HOVER_DELAY * 3);

			expect(querySubMenus()).toHaveLength(0);
			expect(getLink(parent)).toHaveAttribute("aria-expanded", "false");
		});

		test("needs a click on the menu again before hovering opens a submenu after an outside click closed one", async () => {
			const outside = document.createElement("button");
			outside.textContent = "outside";
			outside.setAttribute("style", "position:fixed;left:0;bottom:0");
			document.body.append(outside);

			try {
				const { container } = render(<FlyoutMenu type="horizontal" id="menu" items={createItems()} />);
				const [parent, sibling] = getAllByDataRole(container, DataRoles.Menu.Item);

				await userEvent.click(parent);
				await waitFor(() => expect(querySubMenus()[0]).toBeVisible());

				await userEvent.click(outside);
				await waitFor(() => expect(querySubMenus()).toHaveLength(0));

				await userEvent.hover(sibling);
				await sleep(HOVER_DELAY * 3);
				expect(querySubMenus()).toHaveLength(0);

				await userEvent.click(sibling);
				await waitFor(() => expect(querySubMenus()[0]).toBeVisible());
			} finally {
				outside.remove();
			}
		});

		test("calls onMouseOut when the pointer leaves an item for an element outside the menu", async () => {
			const outside = document.createElement("div");
			outside.setAttribute("style", "position:fixed;left:0;bottom:0;width:40px;height:40px");
			document.body.append(outside);

			try {
				const onMouseOut = vi.fn();
				const { container } = render(
					<MainMenuTpl
						type="horizontal"
						id="tpl"
						items={[
							{ id: "tpl.first", label: "First" },
							{ id: "tpl.second", label: "Second" }
						]}
						onMouseOut={onMouseOut}
					/>
				);
				const [first, second] = getAllByDataRole(container, DataRoles.Menu.Item);

				await userEvent.hover(first);
				await userEvent.hover(second);
				expect(onMouseOut).not.toHaveBeenCalled();

				await userEvent.hover(outside);
				expect(onMouseOut).toHaveBeenCalled();
			} finally {
				outside.remove();
			}
		});
	});

	describe("keyboard", () => {
		test("Enter on a leaf item calls its onClick", async () => {
			const onClick = vi.fn();
			const { container } = render(<FlyoutMenu type="horizontal" id="menu" items={createItems(onClick)} />);

			getAllByDataRole(container, DataRoles.Menu.Item)[2].focus();
			await userEvent.keyboard("{Enter}");

			expect(onClick).toHaveBeenCalledTimes(1);
		});

		test("Enter on a disabled item does nothing", async () => {
			const onClick = vi.fn();
			const { container } = render(<FlyoutMenu type="horizontal" id="menu" items={createItems(onClick)} />);

			getAllByDataRole(container, DataRoles.Menu.Item)[3].focus();
			await userEvent.keyboard("{Enter}");
			await sleep(HOVER_DELAY * 2);

			expect(onClick).not.toHaveBeenCalled();
			expect(querySubMenus()).toHaveLength(0);
		});

		test("Escape on a parent item with an open submenu closes it and keeps the focus on the item", async () => {
			const { container } = render(<FlyoutMenu type="horizontal" id="menu" items={createItems()} />);
			const parent = getAllByDataRole(container, DataRoles.Menu.Item)[0];

			await userEvent.click(parent);
			await waitFor(() => expect(getSubMenuItems()[0]).toHaveFocus());

			parent.focus();
			await userEvent.keyboard("{Escape}");

			await waitFor(() => expect(querySubMenus()).toHaveLength(0));
			expect(parent).toHaveFocus();
			expect(getLink(parent)).toHaveAttribute("aria-expanded", "false");
		});
	});

	describe("ARIA", () => {
		test("marks items with sub items as having a popup", () => {
			const { container } = render(<FlyoutMenu type="horizontal" id="menu" items={createItems()} />);
			const [parent, , leaf] = getAllByDataRole(container, DataRoles.Menu.Item);

			expect(getLink(parent)).toHaveAttribute("aria-haspopup", "true");
			expect(getLink(parent)).toHaveAttribute("aria-expanded", "false");
			expect(getLink(leaf)).toHaveAttribute("aria-haspopup", "false");
			expect(getLink(leaf)).not.toHaveAttribute("aria-expanded");
		});

		test("reflects disabled and selected changes after a re-render", () => {
			const { container, rerender } = render(
				<FlyoutMenu type="horizontal" id="menu" items={[{ id: "a", label: "A", disabled: false, selected: false }]} />
			);
			const item = getByDataRole(container, DataRoles.Menu.Item);

			expect(item).toHaveAttribute("tabindex", "0");
			expect(getLink(item)).toHaveAttribute("aria-disabled", "false");
			expect(getLink(item)).toHaveAttribute("aria-current", "false");

			rerender(
				<FlyoutMenu type="horizontal" id="menu" items={[{ id: "a", label: "A", disabled: true, selected: true }]} />
			);

			expect(item).toHaveAttribute("tabindex", "-1");
			expect(getLink(item)).toHaveAttribute("aria-disabled", "true");
			expect(getLink(item)).toHaveAttribute("aria-current", "page");
		});

		test("gains a popup when sub items are added after mount", () => {
			const { container, rerender } = render(
				<FlyoutMenu type="horizontal" id="menu" items={[{ id: "a", label: "A" }]} />
			);
			const item = getByDataRole(container, DataRoles.Menu.Item);

			expect(getLink(item)).toHaveAttribute("aria-haspopup", "false");

			rerender(
				<FlyoutMenu type="horizontal" id="menu" items={[{ id: "a", label: "A", items: [{ id: "a1", label: "A1" }] }]} />
			);

			expect(getLink(item)).toHaveAttribute("aria-haspopup", "true");
			expect(getLink(item)).toHaveAttribute("aria-expanded", "false");
		});

		describe("on phones", () => {
			beforeAll(() => {
				setupDevice("phone", true);
			});

			afterAll(() => {
				vi.restoreAllMocks();
			});

			test("adds hidden texts for disabled, selected and selected parent items", () => {
				const titles = getA11yResource("en").menuTitles!;
				const items: MenuItem[] = [
					{ id: "disabled", label: "Disabled", disabled: true },
					{ id: "selected", label: "Selected", selected: true },
					{ id: "selected-parent", label: "Selected parent", selected: true, items: [{ id: "c", label: "C" }] },
					{ id: "plain", label: "Plain" }
				];
				const { container } = render(<FlyoutMenu type="vertical" id="menu" items={items} style={{ width: 300 }} />);
				const [disabled, selected, selectedParent, plain] = getAllByDataRole(container, DataRoles.Menu.Item).map(
					(item) => getByDataRole(item, DataRoles.Menu.Item.Label)
				);

				expect(disabled).toHaveTextContent(`${titles.disabled}Disabled`);
				expect(selected).toHaveTextContent(`${titles.selected}Selected`);
				expect(selectedParent).toHaveTextContent(`${titles.selectedParent}Selected parent`);
				expect(plain).toHaveTextContent("Plain");
				expect(plain).not.toHaveTextContent(titles.selected!);
			});
		});
	});

	describe("refs and unmount", () => {
		test("calls a changed item wrapperRef with the item element after a re-render", () => {
			const firstRef = vi.fn();
			const secondRef = vi.fn();
			const { container, rerender } = render(
				<MainMenuTpl type="horizontal" id="tpl" items={[{ id: "tpl.a", label: "A", wrapperRef: firstRef }]} />
			);

			// The item only forwards a wrapperRef when it changes, not on mount.
			expect(firstRef).not.toHaveBeenCalled();

			rerender(<MainMenuTpl type="horizontal" id="tpl" items={[{ id: "tpl.a", label: "A", wrapperRef: secondRef }]} />);

			expect(secondRef).toHaveBeenCalledTimes(1);
			expect(secondRef).toHaveBeenCalledWith(getByDataRole(container, DataRoles.Menu.Item));
			expect(firstRef).not.toHaveBeenCalled();
		});

		test("removes an open horizontal submenu when the menu unmounts", async () => {
			const { container, unmount } = render(<FlyoutMenu type="horizontal" id="menu" items={createItems()} />);

			await userEvent.click(getAllByDataRole(container, DataRoles.Menu.Item)[0]);
			await waitFor(() => expect(querySubMenus()[0]).toBeVisible());

			unmount();

			expect(querySubMenus()).toHaveLength(0);
			// The focus timer that follows a click-open may still be pending; it must not fail after unmount.
			await sleep(HOVER_DELAY * 2);
			expect(querySubMenus()).toHaveLength(0);
		});

		test("removes an open vertical submenu and stops listening to Escape when the menu unmounts", async () => {
			const { container, unmount } = render(
				<FlyoutMenu type="vertical" id="menu" items={createItems()} style={{ width: 300 }} />
			);
			const parent = getAllByDataRole(container, DataRoles.Menu.Item)[0];

			parent.focus();
			await userEvent.keyboard("{ArrowRight}");
			await waitFor(() => expect(getSubMenuItems()[0]).toHaveFocus());

			unmount();

			expect(querySubMenus()).toHaveLength(0);
			expect(queryByDataRole(document.body, DataRoles.Menu.Item)).not.toBeInTheDocument();
			await userEvent.keyboard("{Escape}");
			await userEvent.keyboard("{ArrowLeft}");
			expect(querySubMenus()).toHaveLength(0);
		});
	});
});
