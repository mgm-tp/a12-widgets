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

import { render, getAllByDataRole, getByDataRole, screen, queryByDataRole } from "test-utils";
import { describe, test, expect } from "vitest";
import { userEvent } from "vitest/browser";

import { FlyoutMenu } from "../../main/flyout-menu.view.js";
import { items, itemsWithChildren, itemWithGroups, itemWithVariants } from "../../test/menu.setup.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import type { MenuItem } from "../../main/menu.api.js";
import { getA11yResource } from "../../../common/main/a11y-localization/language-context.js";
import { InteractionHintConfigProvider } from "../../../interaction-hint/main/interaction-hint-context.js";
import { Badge } from "../../../badge/index.js";

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
