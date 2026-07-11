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

import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { FlyoutMenu, Icon, Typography, KeyboardNavigationConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof FlyoutMenu> = {
	title: "Navigation/Menu/FlyoutMenu/KeyboardNavigation",
	component: FlyoutMenu,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const items: MenuItem[] = [
	{
		label: "Dashboard",
		icon: <Icon>dashboard</Icon>,
		title: "Dashboard",
		items: [
			{ label: "Overview", icon: <Icon>visibility</Icon>, title: "Overview" },
			{ label: "Analytics", icon: <Icon>analytics</Icon>, title: "Analytics" },
			{ label: "Reports", icon: <Icon>assessment</Icon>, title: "Reports" }
		]
	},
	{
		label: "Products",
		icon: <Icon>inventory_2</Icon>,
		title: "Products",
		items: [
			{ label: "All Products", title: "All Products" },
			{ label: "Categories", title: "Categories" },
			{ label: "Inventory", disabled: true, title: "Inventory" }
		]
	},
	{ label: "Settings", icon: <Icon>settings</Icon>, title: "Settings" }
];

const NavContext = ({ children }: { children: ReactNode }) => (
	<div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px" }}>
		<Typography.Body>
			Use <strong>Tab</strong> to navigate between focusable areas on this page.
		</Typography.Body>
		{children}
	</div>
);

export const HorizontalDefaultMode: Story = {
	render: () => (
		<NavContext>
			<FlyoutMenu type="horizontal" items={items} />
		</NavContext>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**Horizontal FlyoutMenu — default keyboard navigation.** " +
					"**Tab / Shift+Tab** and **← / →** move focus between top-level items. " +
					"On an item with children, **↓** or **Enter** opens the submenu. " +
					"Inside a submenu, **↑ / ↓** navigate items; **Escape** closes the submenu and returns focus to the parent item."
			}
		}
	}
};

export const HorizontalArrowOnlyMode: Story = {
	render: () => (
		<KeyboardNavigationConfigProvider componentConfigs={{ horizontalFlyoutMenu: "arrow-only" }}>
			<NavContext>
				<FlyoutMenu type="horizontal" items={items} />
			</NavContext>
		</KeyboardNavigationConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**Horizontal FlyoutMenu — arrow-only mode** (via `KeyboardNavigationConfigProvider`). " +
					"**← / →** move between top-level items; **↓** / **Enter** opens a submenu; " +
					"**↑ / ↓** move within a submenu; **Escape** closes the submenu. " +
					"**Tab** skips past the entire menu to the next focusable element outside."
			}
		}
	}
};

export const VerticalDefaultMode: Story = {
	render: () => (
		<NavContext>
			<div style={{ width: "250px" }}>
				<FlyoutMenu type="vertical" items={items} />
			</div>
		</NavContext>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**Vertical FlyoutMenu — default keyboard navigation.** " +
					"**Tab / Shift+Tab** and **↑ / ↓** navigate between top-level items. " +
					"On an item with children, **→** or **Enter** opens the submenu. " +
					"Inside a submenu, **↑ / ↓** navigate items; **← / Escape** closes the submenu."
			}
		}
	}
};

export const VerticalArrowOnlyMode: Story = {
	render: () => (
		<KeyboardNavigationConfigProvider componentConfigs={{ verticalFlyoutMenu: "arrow-only" }}>
			<NavContext>
				<div style={{ width: "250px" }}>
					<FlyoutMenu type="vertical" items={items} />
				</div>
			</NavContext>
		</KeyboardNavigationConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**Vertical FlyoutMenu — arrow-only mode** (via `KeyboardNavigationConfigProvider`). " +
					"**↑ / ↓** move between items; **→** / **Enter** opens a submenu; " +
					"**← / Escape** closes the submenu. " +
					"**Tab** exits the menu entirely and focuses the next element outside."
			}
		}
	}
};
