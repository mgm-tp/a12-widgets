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

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { SlidingMenu, Icon, Typography, KeyboardNavigationConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof SlidingMenu> = {
	title: "Navigation/Menu/SlidingMenu/KeyboardNavigation",
	component: SlidingMenu,
	parameters: { layout: "fullscreen" },
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
			{
				label: "Reports",
				icon: <Icon>assessment</Icon>,
				title: "Reports",
				items: [
					{ label: "Monthly", title: "Monthly report" },
					{ label: "Quarterly", title: "Quarterly report" }
				]
			}
		]
	},
	{
		label: "Users",
		icon: <Icon>people</Icon>,
		title: "Users",
		items: [
			{ label: "All Users", title: "All Users" },
			{ label: "Roles", title: "Roles & Permissions" }
		]
	},
	{ label: "Settings", icon: <Icon>settings</Icon>, title: "Settings" }
];

const NavContext = ({ children }: { children: React.ReactNode }) => (
	<div style={{ height: "100vh", display: "flex", flexDirection: "column", gap: "16px", padding: "20px" }}>
		<Typography.Body>
			Use <strong>Tab</strong> to navigate between focusable areas on this page.
		</Typography.Body>
		{children}
	</div>
);

export const DefaultMode: Story = {
	render: () => (
		<NavContext>
			<div style={{ width: "320px" }}>
				<SlidingMenu id="sliding-keynav-default" items={items} />
			</div>
		</NavContext>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**SlidingMenu — default keyboard navigation.** " +
					"**Tab / Shift+Tab** and **↑ / ↓** navigate between menu items. " +
					"On an item with children, **→** or **Enter** drills into the submenu. " +
					"**←** or the back button returns to the parent level. " +
					"**Escape** also navigates back up one level."
			}
		}
	}
};

export const ArrowOnlyMode: Story = {
	render: () => (
		<KeyboardNavigationConfigProvider componentConfigs={{ slidingMenu: "arrow-only" }}>
			<NavContext>
				<div style={{ width: "320px" }}>
					<SlidingMenu id="sliding-keynav-arrow-only" items={items} />
				</div>
			</NavContext>
		</KeyboardNavigationConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**SlidingMenu — arrow-only mode** (via `KeyboardNavigationConfigProvider`). " +
					"Only **↑ / ↓** navigate between items; **→** drills into a submenu; " +
					"**←** goes back to the parent. " +
					"**Tab** exits the entire menu to the next focusable element outside."
			}
		}
	}
};

export const SubmenuNavigation: Story = {
	render: () => (
		<NavContext>
			<div style={{ width: "320px" }}>
				<SlidingMenu id="sliding-keynav-submenu" items={items} />
			</div>
		</NavContext>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**SlidingMenu — multi-level submenu navigation.** " +
					"Items have three levels of nesting (Dashboard → Reports → Monthly/Quarterly). " +
					"Focus the menu, press **↓** to reach *Dashboard*, then **→** to enter its submenu. " +
					"Navigate to *Reports* and press **→** again to go one level deeper. " +
					"Use **←** or **Escape** to navigate back level by level."
			}
		}
	}
};
