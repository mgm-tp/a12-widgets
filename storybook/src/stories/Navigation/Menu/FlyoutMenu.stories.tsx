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
import { useState } from "react";

import type { MenuItem, MenuItemType } from "@com.mgmtp.a12.widgets/widgets-core";
import { FlyoutMenu, Icon, Checkbox, Badge, Counter } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof FlyoutMenu> = {
	title: "Navigation/Menu/FlyoutMenu",
	component: FlyoutMenu,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		type: {
			control: "radio",
			options: ["horizontal", "vertical"],
			description: "Whether the menu will be displayed horizontally or vertically"
		},
		items: {
			control: false,
			description: 'List of menu items (`MenuItem` entries or `MenuGroup` entries with `type: "group"`)'
		},
		collapsed: {
			control: "boolean",
			description: "Will compact the view if true (only works with vertical FlyoutMenu)"
		},
		hoverDelay: {
			control: "number",
			description: "Delay time when submenu is shown by hovering on parent"
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
	{ label: "Home", icon: <Icon>home</Icon>, title: "Go to home page" },
	{ label: "Products", icon: <Icon>inventory_2</Icon>, title: "View all products" },
	{ label: "Services", icon: <Icon>build</Icon>, title: "Our services" },
	{ label: "About", icon: <Icon>info</Icon>, title: "About us" },
	{ label: "Contact", icon: <Icon>mail</Icon>, title: "Contact us" }
];

// Menu items with submenus
const itemsWithSubmenus: MenuItem[] = [
	{
		label: "Dashboard",
		icon: <Icon>dashboard</Icon>,
		title: "Dashboard overview",
		items: [
			{ label: "Overview", icon: <Icon>visibility</Icon>, title: "View overview" },
			{ label: "Analytics", icon: <Icon>analytics</Icon>, title: "View analytics" },
			{ label: "Reports", icon: <Icon>assessment</Icon>, title: "View reports" }
		]
	},
	{
		label: "Products",
		icon: <Icon>inventory_2</Icon>,
		title: "Product management",
		items: [
			{ label: "All Products", title: "View all products" },
			{ label: "Categories", title: "Product categories" },
			{ label: "Inventory", disabled: true, title: "Manage inventory" }
		]
	},
	{
		label: "Users",
		icon: <Icon>people</Icon>,
		title: "User management",
		items: [
			{ label: "All Users", title: "View all users" },
			{ label: "Roles & Permissions", title: "Manage roles and permissions" },
			{
				label: "Teams",
				title: "Team management",
				items: [
					{ label: "Engineering", title: "Engineering team" },
					{ label: "Design", title: "Design team" },
					{ label: "Marketing", title: "Marketing team" }
				]
			}
		]
	},
	{ label: "Settings", icon: <Icon>settings</Icon>, title: "Application settings" }
];

const variantItems: MenuItem[] = [
	{ label: "Open", variant: "open", title: "Available to access" },
	{ label: "Info", variant: "info", title: "Additional information" },
	{ label: "Error", variant: "error", title: "Error detected" },
	{ label: "Warning", variant: "warning", title: "Proceed with caution" },
	{ label: "Done", variant: "done", title: "Successfully completed" },
	{ label: "In Progress", variant: "inProgress", title: "Currently in progress" }
];

const itemsWithBadges: MenuItem[] = [
	{ label: "Inbox", icon: <Icon>inbox</Icon>, badge: <Badge variant="error" count={5} />, title: "Unread messages" },
	{
		label: "Notifications",
		icon: <Icon>notifications</Icon>,
		counter: <Counter value={12} />,
		title: "Recent notifications"
	},
	{ label: "Messages", icon: <Icon>chat</Icon>, badge: <Badge variant="info" count={999} />, title: "Chat messages" },
	{ label: "Tasks", icon: <Icon>task</Icon>, title: "View tasks" }
];

const groupedItems: MenuItemType[] = [
	{
		type: "group",
		id: "main-group",
		label: "Main",
		items: [
			{ label: "Dashboard", icon: <Icon>dashboard</Icon> },
			{ label: "Analytics", icon: <Icon>analytics</Icon> }
		]
	},
	{
		type: "group",
		id: "content-group",
		label: "Content",
		items: [
			{ label: "Articles", icon: <Icon>article</Icon> },
			{ label: "Media", icon: <Icon>perm_media</Icon> },
			{ label: "Files", icon: <Icon>folder</Icon> }
		]
	},
	{
		type: "group",
		id: "settings-group",
		label: "Settings",
		items: [
			{ label: "General", icon: <Icon>settings</Icon> },
			{ label: "Security", icon: <Icon>security</Icon> }
		]
	}
];

export const Playground: Story = {
	args: {
		id: "flyout-menu-playground",
		type: "horizontal",
		items: basicItems
	},
	render: (args) => (
		<div style={{ width: args.type === "vertical" ? "300px" : "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	)
};

export const Vertical: Story = {
	args: {
		id: "flyout-menu-vertical",
		type: "vertical",
		items: basicItems
	},
	render: (args) => (
		<div style={{ width: "300px" }}>
			<FlyoutMenu {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: '`type="vertical"` renders the menu as a vertical sidebar instead of a horizontal bar.'
			}
		}
	}
};

export const WithSubmenus: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
			<div style={{ width: "100%" }}>
				<FlyoutMenu id="flyout-menu-submenus-horizontal" type="horizontal" items={itemsWithSubmenus} />
			</div>
			<div style={{ width: "300px" }}>
				<FlyoutMenu id="flyout-menu-submenus-vertical" type="vertical" items={itemsWithSubmenus} />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Nested `items` open as flyout submenus on hover, click or keyboard interaction — below the parent for horizontal menus, next to it for vertical menus. Submenus can be nested multiple levels deep."
			}
		}
	}
};

export const Collapsed: Story = {
	render: function CollapsedExample() {
		const [collapsed, setCollapsed] = useState(true);

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<Checkbox
					id="flyout-menu-collapsed"
					label="Collapsed"
					checked={collapsed}
					onChange={(checked) => setCollapsed(checked)}
				/>
				<div style={{ width: collapsed ? "fit-content" : "300px" }}>
					<FlyoutMenu id="flyout-menu-collapsed-menu" type="vertical" items={itemsWithSubmenus} collapsed={collapsed} />
				</div>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`collapsed` compacts a vertical menu to icons only; labels and submenus still appear as flyouts. It has no effect on horizontal menus."
			}
		}
	}
};

export const Variants: Story = {
	args: {
		id: "flyout-menu-variants",
		type: "horizontal",
		items: variantItems
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"The item-level `variant` prop (`open`, `info`, `error`, `warning`, `done`, `inProgress`) displays a status icon that takes priority over the item's `icon`."
			}
		}
	}
};

export const WithBadgesAndCounters: Story = {
	args: {
		id: "flyout-menu-badges-counters",
		type: "horizontal",
		items: itemsWithBadges
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Items accept a `badge` (top-right of the label) and a `counter` (after the label) for notifications and additional information."
			}
		}
	}
};

export const WithGroups: Story = {
	args: {
		id: "flyout-menu-groups",
		type: "horizontal",
		items: groupedItems
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'`MenuGroup` entries (`type: "group"`) group items under an optional `label`. Groups are only supported by the horizontal FlyoutMenu.'
			}
		}
	}
};

export const SelectedAndDisabledItems: Story = {
	args: {
		id: "flyout-menu-selected-disabled",
		type: "horizontal",
		items: [
			{ label: "Home", icon: <Icon>home</Icon> },
			{ label: "Products", icon: <Icon>inventory_2</Icon>, selected: true },
			{ label: "Inventory", icon: <Icon>block</Icon>, disabled: true },
			{ label: "About", icon: <Icon>info</Icon> }
		]
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"The item-level `selected` prop highlights the current item; `disabled` greys an item out and prevents interaction."
			}
		}
	}
};

export const AsMainNavigation: Story = {
	args: {
		id: "flyout-menu-main-navigation",
		type: "horizontal",
		items: basicItems,
		useAs: "main",
		mainContainerLabel: "Main navigation"
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'`useAs="main"` marks the menu as the page\'s main navigation with a localized `aria-label`; `mainContainerLabel` overrides the label text.'
			}
		}
	}
};

export const AsTabNavigation: Story = {
	args: {
		id: "flyout-menu-tab-navigation",
		type: "horizontal",
		items: [{ label: "Overview" }, { label: "Details", selected: true }, { label: "History" }, { label: "Settings" }],
		useAs: "tabNavigation"
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: '`useAs="tabNavigation"` styles the horizontal menu as a tab bar, e.g. for switching page sections.'
			}
		}
	}
};

export const WithHiddenLabels: Story = {
	args: {
		id: "flyout-menu-hidden-labels",
		type: "horizontal",
		items: [
			{ label: "Home", icon: <Icon>home</Icon>, labelHidden: true, title: "Home" },
			{ label: "Search", icon: <Icon>search</Icon>, labelHidden: true, title: "Search" },
			{ label: "Favorites", icon: <Icon>favorite</Icon>, labelHidden: true, title: "Favorites" },
			{ label: "Settings", icon: <Icon>settings</Icon>, labelHidden: true, title: "Settings" }
		]
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`labelHidden` shows icon-only items while keeping the `label` available for condensed items and assistive technology (`title` provides the tooltip)."
			}
		}
	}
};

export const WithClickHandler: Story = {
	render: function WithClickHandlerExample() {
		const [selectedItem, setSelectedItem] = useState<string>("Home");

		const items: MenuItem[] = [
			{
				label: "Home",
				icon: <Icon>home</Icon>,
				title: "Go to home page",
				selected: selectedItem === "Home",
				onClick: () => setSelectedItem("Home")
			},
			{
				label: "Products",
				icon: <Icon>inventory_2</Icon>,
				title: "View all products",
				selected: selectedItem === "Products",
				onClick: () => setSelectedItem("Products")
			},
			{
				label: "Services",
				icon: <Icon>build</Icon>,
				title: "Our services",
				selected: selectedItem === "Services",
				onClick: () => setSelectedItem("Services")
			},
			{
				label: "Contact",
				icon: <Icon>mail</Icon>,
				title: "Contact us",
				selected: selectedItem === "Contact",
				onClick: () => setSelectedItem("Contact")
			}
		];

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<div style={{ width: "100%" }}>
					<FlyoutMenu id="flyout-menu-click-handler" type="horizontal" items={items} />
				</div>
				<div style={{ padding: "16px", background: "#f5f5f5", borderRadius: "4px" }}>
					Selected: <strong>{selectedItem}</strong>
				</div>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Each item accepts an `onClick` handler. Combine it with the `selected` prop to control the active item from application state."
			}
		}
	}
};
