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

import { render, getAllByDataRole, fireEvent, waitFor, getByDataRole, screen } from "test-utils";
import { describe, expect, test, vitest } from "vitest";

import { SlidingMenu } from "../../main/sliding-menu.view.js";
import { items, itemsWithChildren, itemWithVariants } from "../../test/menu.setup.js";
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
		fireEvent.click(item1);
		await waitFor(() => {
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			expect(menuItems.length).toBe(4);
			expect(document.activeElement).toEqual(menuItems[0]);
		});

		// Change back from sub menu to top level menu
		const itemBack1 = getAllByDataRole(container, DataRoles.Menu.Item)[0];
		fireEvent.click(itemBack1);
		await waitFor(() => {
			const menuItems = getAllByDataRole(container, DataRoles.Menu.Item);
			expect(menuItems.length).toBe(items.length);
			expect(document.activeElement).toEqual(menuItems[0]);
		});

		// Change to sub menu of fourth element
		const item4 = getAllByDataRole(container, DataRoles.Menu.Item)[3];
		fireEvent.click(item4);
		await waitFor(() => expect(getAllByDataRole(container, DataRoles.Menu.Item).length).toBe(3));
	});

	test("vertical-sliding-menu-with-old-children", async () => {
		const { container } = render(<SlidingMenu id="test-sliding" items={itemsWithChildren} />);
		expect(container.firstChild).toMatchSnapshot();

		expect(getAllByDataRole(container, DataRoles.Menu.Item).length).toBe(itemsWithChildren.length);

		// Change to sub menu of first element
		const item1 = getAllByDataRole(container, DataRoles.Menu.Item)[0];
		fireEvent.click(item1);
		await waitFor(() => expect(getAllByDataRole(container, DataRoles.Menu.Item).length).toBe(4));

		// Change back from sub menu to top level menu
		const itemBack1 = getAllByDataRole(container, DataRoles.Menu.Item)[0];
		fireEvent.click(itemBack1);
		await waitFor(() => expect(getAllByDataRole(container, DataRoles.Menu.Item).length).toBe(itemsWithChildren.length));

		// Change to sub menu of fourth element
		const item4 = getAllByDataRole(container, DataRoles.Menu.Item)[3];
		fireEvent.click(item4);
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
		const mockOnClick = vitest.fn();
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
		fireEvent.click(productsMenuItem);

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
		fireEvent.click(backwardItem);
		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});
});
