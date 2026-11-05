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
import { SlidingMenu, Icon, Badge } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof SlidingMenu> = {
	title: "Navigation/Menu/SlidingMenu",
	component: SlidingMenu,
	parameters: {
		layout: "fullscreen"
	},
	argTypes: {
		items: {
			control: false,
			description: "List of menu items; nested `items` open as sliding submenu levels"
		},
		collapsed: {
			control: "boolean",
			description: "Will compact the view if true"
		},
		useAs: {
			control: "radio",
			options: ["main", "tabNavigation", undefined],
			description: "Whether the menu will be used as the main menu or tab navigation"
		},
		mainContainerLabel: {
			control: "text",
			description: "aria-label attribute of the main container"
		},
		scrollToSelectedItem: {
			control: "boolean",
			description: "Scrolls to the selected item on load"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic menu items for examples
const basicItems: MenuItem[] = [
	{ label: "Home", icon: <Icon>home</Icon>, title: "Go to home" },
	{ label: "Products", icon: <Icon>inventory_2</Icon>, title: "View products" },
	{ label: "Services", icon: <Icon>build</Icon>, title: "Our services" },
	{ label: "About", icon: <Icon>info</Icon>, title: "About us" },
	{ label: "Contact", icon: <Icon>mail</Icon>, title: "Contact us" }
];

// Menu items with submenus
const itemsWithSubmenus: MenuItem[] = [
	{
		label: "Dashboard",
		icon: <Icon>dashboard</Icon>,
		title: "Dashboard",
		items: [
			{ label: "Overview", icon: <Icon>visibility</Icon>, title: "Overview" },
			{ label: "Analytics", icon: <Icon>analytics</Icon>, title: "Analytics" },
			{ label: "Reports", icon: <Icon>assessment</Icon>, title: "View reports" }
		]
	},
	{
		label: "Products",
		icon: <Icon>inventory_2</Icon>,
		title: "Products",
		items: [
			{ label: "All Products", title: "View all products" },
			{ label: "Categories", title: "Product categories" },
			{ label: "Inventory", title: "Manage inventory" }
		]
	},
	{
		label: "Users",
		icon: <Icon>people</Icon>,
		title: "Users",
		items: [
			{ label: "All Users", title: "View all users" },
			{ label: "Roles & Permissions", title: "Manage roles" },
			{ label: "Activity Log", title: "View activity" }
		]
	},
	{ label: "Settings", icon: <Icon>settings</Icon>, title: "Settings" },
	{ label: "Help", icon: <Icon>help</Icon>, title: "Help center" }
];

const itemsWithBadges: MenuItem[] = [
	{
		label: "Messages",
		icon: <Icon>mail</Icon>,
		title: "Messages",
		badge: <Badge count={5} variant="error" />
	},
	{
		label: "Notifications",
		icon: <Icon>notifications</Icon>,
		title: "Notifications",
		badge: <Badge count={5} variant="error" />
	},
	{
		label: "Tasks",
		icon: <Icon>assignment</Icon>,
		title: "Tasks",
		badge: <Badge count={5} variant="error" />
	},
	{ label: "Calendar", icon: <Icon>event</Icon>, title: "Calendar" },
	{ label: "Settings", icon: <Icon>settings</Icon>, title: "Settings" }
];

const itemsWithVariants: MenuItem[] = [
	{
		label: "Open Items",
		icon: <Icon>folder_open</Icon>,
		title: "View open items",
		variant: "open"
	},
	{
		label: "In Progress",
		icon: <Icon>pending</Icon>,
		title: "Items in progress",
		variant: "inProgress"
	},
	{
		label: "Details",
		icon: <Icon>info</Icon>,
		title: "More details available",
		variant: "info"
	},
	{
		label: "Problems",
		icon: <Icon>error</Icon>,
		title: "Issues detected",
		variant: "error"
	},
	{
		label: "Caution",
		icon: <Icon>warning</Icon>,
		title: "Proceed with caution",
		variant: "warning"
	},
	{
		label: "Completed",
		icon: <Icon>check_circle</Icon>,
		title: "Successfully completed",
		variant: "done"
	}
];

const nestedItems: MenuItem[] = [
	{
		label: "Home",
		icon: <Icon>home</Icon>,
		title: "Home"
	},
	{
		label: "Products",
		icon: <Icon>inventory_2</Icon>,
		title: "Products",
		items: [
			{
				label: "Electronics",
				title: "Electronics",
				items: [
					{ label: "Laptops", title: "Laptops" },
					{ label: "Phones", title: "Phones" },
					{ label: "Tablets", title: "Tablets" }
				]
			},
			{
				label: "Clothing",
				title: "Clothing",
				items: [
					{ label: "Men", title: "Men's clothing" },
					{ label: "Women", title: "Women's clothing" },
					{ label: "Kids", title: "Kids' clothing" }
				]
			},
			{ label: "Books", title: "Books" }
		]
	},
	{
		label: "Services",
		icon: <Icon>build</Icon>,
		title: "Services"
	}
];

const itemsWithCustomBackward: MenuItem[] = [
	{
		label: "Products",
		icon: <Icon>inventory_2</Icon>,
		title: "Products menu",
		items: [
			{ label: "All Products", title: "View all products" },
			{ label: "Categories", title: "Product categories" },
			{ label: "Inventory", title: "Manage inventory" }
		],
		backwardItemProps: {
			label: "Go Back",
			icon: <Icon>arrow_back</Icon>
		}
	},
	{
		label: "Users",
		icon: <Icon>people</Icon>,
		title: "Users",
		items: [
			{ label: "All Users", title: "View all users" },
			{ label: "Roles & Permissions", title: "Manage roles" }
		]
	},
	{ label: "Settings", icon: <Icon>settings</Icon>, title: "Settings" },
	{ label: "Help", icon: <Icon>help</Icon>, title: "Help center" }
];

export const Playground: Story = {
	args: {
		id: "sliding-menu-playground",
		items: basicItems
	},
	render: (args) => (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ width: "320px" }}>
				<SlidingMenu {...args} />
			</div>
		</div>
	)
};

export const WithSubmenus: Story = {
	args: {
		id: "sliding-menu-submenus",
		items: itemsWithSubmenus
	},
	render: (args) => (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ width: "320px" }}>
				<SlidingMenu {...args} />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Clicking an item with nested `items` slides its submenu in, replacing the current level. A backward item at the top of the submenu navigates back to the parent level."
			}
		}
	}
};

export const WithBadges: Story = {
	args: {
		id: "sliding-menu-badges",
		items: itemsWithBadges
	},
	render: (args) => (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ width: "320px" }}>
				<SlidingMenu {...args} />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Items accept a `badge` displayed at the top-right of the label, e.g. for unread counts."
			}
		}
	}
};

export const WithVariants: Story = {
	args: {
		id: "sliding-menu-variants",
		items: itemsWithVariants
	},
	render: (args) => (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ width: "320px" }}>
				<SlidingMenu {...args} />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"The item-level `variant` prop (`open`, `inProgress`, `info`, `error`, `warning`, `done`) displays a status icon that takes priority over the item's `icon`."
			}
		}
	}
};

export const NestedSubmenus: Story = {
	args: {
		id: "sliding-menu-nested",
		items: nestedItems
	},
	render: (args) => (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ width: "320px" }}>
				<SlidingMenu {...args} />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Submenus can be nested multiple levels deep (`items` inside `items`); each level slides in and can be navigated back step by step."
			}
		}
	}
};

export const Collapsed: Story = {
	args: {
		id: "sliding-menu-collapsed",
		items: itemsWithSubmenus,
		collapsed: true
	},
	render: (args) => (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ width: "320px" }}>
				<SlidingMenu {...args} />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "`collapsed` compacts the menu to an icon-only view."
			}
		}
	}
};

export const CustomizeBackwardItem: Story = {
	args: {
		id: "sliding-menu-custom-backward",
		items: itemsWithCustomBackward
	},
	render: (args) => (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<p style={{ color: "#666" }}>
					Click on "Products" menu item to see the custom backward item with "Go Back" label in the submenu
				</p>
			</div>
			<div style={{ width: "320px" }}>
				<SlidingMenu {...args} />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Demonstrates customizing the backward navigation item using `backwardItemProps`. The first item (Products) has a custom backward item with a 'Go Back' label and arrow icon, while other items inherit default behavior."
			}
		}
	}
};
