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

import { FlyoutMenu, Icon, Badge, Counter } from "@com.mgmtp.a12.widgets/widgets-core";
import type { MenuItem, MenuItemType } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu";
import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint-context.js";

const meta: Meta<typeof FlyoutMenu> = {
	title: "Widgets/Navigation/Menu/FlyoutMenu",
	component: FlyoutMenu,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: "radio",
			options: ["horizontal", "vertical"],
			description: "Whether the menu will be displayed horizontally or vertically"
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

// Menu items with variants
const variantItems: MenuItem[] = [
	{ label: "Open", variant: "open", title: "Available to access" },
	{ label: "Info", variant: "info", title: "Additional information" },
	{ label: "Error", variant: "error", title: "Error detected" },
	{ label: "Warning", variant: "warning", title: "Proceed with caution" },
	{ label: "Done", variant: "done", title: "Successfully completed" }
];

// Menu items with badges and counters
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

// Menu items with groups
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

export const HorizontalBasic: Story = {
	args: {
		type: "horizontal",
		items: basicItems
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	)
};

export const VerticalBasic: Story = {
	args: {
		type: "vertical",
		items: basicItems
	},
	render: (args) => (
		<div style={{ width: "300px" }}>
			<FlyoutMenu {...args} />
		</div>
	)
};

export const HorizontalWithSubmenus: Story = {
	args: {
		type: "horizontal",
		items: itemsWithSubmenus
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	)
};

export const VerticalWithSubmenus: Story = {
	args: {
		type: "vertical",
		items: itemsWithSubmenus
	},
	render: (args) => (
		<div style={{ width: "300px" }}>
			<FlyoutMenu {...args} />
		</div>
	)
};

export const VerticalCollapsed: Story = {
	render: () => {
		const CollapsedMenu = () => {
			const [collapsed, setCollapsed] = useState(true);

			return (
				<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
					<label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						<input type="checkbox" checked={collapsed} onChange={(e) => setCollapsed(e.target.checked)} />
						Collapsed
					</label>
					<div style={{ width: collapsed ? "fit-content" : "300px" }}>
						<FlyoutMenu type="vertical" items={itemsWithSubmenus} collapsed={collapsed} />
					</div>
				</div>
			);
		};

		return <CollapsedMenu />;
	}
};

export const WithVariants: Story = {
	args: {
		type: "horizontal",
		items: variantItems
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	)
};

export const WithBadgesAndCounters: Story = {
	args: {
		type: "horizontal",
		items: itemsWithBadges
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	)
};

export const HorizontalWithGroups: Story = {
	args: {
		type: "horizontal",
		items: groupedItems
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	)
};

export const WithSelectedItem: Story = {
	args: {
		type: "horizontal",
		items: [
			{ label: "Home", icon: <Icon>home</Icon> },
			{ label: "Products", icon: <Icon>inventory_2</Icon>, selected: true },
			{ label: "Services", icon: <Icon>build</Icon> },
			{ label: "About", icon: <Icon>info</Icon> }
		]
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	)
};

export const WithDisabledItems: Story = {
	args: {
		type: "horizontal",
		items: [
			{ label: "Active", icon: <Icon>check_circle</Icon> },
			{ label: "Disabled", icon: <Icon>block</Icon>, disabled: true },
			{ label: "Active", icon: <Icon>check_circle</Icon> },
			{ label: "Disabled", icon: <Icon>block</Icon>, disabled: true }
		]
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	)
};

export const AsMainNavigation: Story = {
	args: {
		type: "horizontal",
		items: basicItems,
		useAs: "main",
		mainContainerLabel: "Main navigation"
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	)
};

export const AsTabNavigation: Story = {
	args: {
		type: "horizontal",
		items: [{ label: "Overview" }, { label: "Details", selected: true }, { label: "History" }, { label: "Settings" }],
		useAs: "tabNavigation"
	},
	render: (args) => (
		<div style={{ width: "100%" }}>
			<FlyoutMenu {...args} />
		</div>
	)
};

export const WithHiddenLabels: Story = {
	args: {
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
	)
};

export const WithClickHandler: Story = {
	render: () => {
		const InteractiveMenu = () => {
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
						<FlyoutMenu type="horizontal" items={items} />
					</div>
					<div style={{ padding: "16px", background: "#f5f5f5", borderRadius: "4px" }}>
						Selected: <strong>{selectedItem}</strong>
					</div>
				</div>
			);
		};

		return <InteractiveMenu />;
	}
};

// ========== Interaction Hint Stories ==========

export const WithInteractionHint: Story = {
	render: () => {
		return (
			<div style={{ padding: "20px" }}>
				<h3 style={{ marginBottom: "20px" }}>Horizontal Menu with Interaction Hints</h3>
				<p style={{ marginBottom: "10px", color: "#666" }}>Hover or focus on menu items to see interaction hints</p>
				<InteractionHintConfigProvider componentConfigs={{ horizontalFlyoutMenu: true }}>
					<FlyoutMenu type="horizontal" items={itemsWithSubmenus} />
				</InteractionHintConfigProvider>

				<h3 style={{ marginTop: "40px", marginBottom: "20px" }}>Vertical Menu with Interaction Hints</h3>
				<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: true }}>
					<div style={{ width: "250px" }}>
						<FlyoutMenu type="vertical" items={itemsWithSubmenus} />
					</div>
				</InteractionHintConfigProvider>
			</div>
		);
	}
};

export const WithInteractionHintFollowCursor: Story = {
	render: () => {
		return (
			<div style={{ padding: "20px" }}>
				<h3 style={{ marginBottom: "20px" }}>Horizontal Menu - Hints Follow Cursor</h3>
				<p style={{ marginBottom: "10px", color: "#666" }}>Hints follow your cursor movement</p>
				<InteractionHintConfigProvider
					componentConfigs={{ horizontalFlyoutMenu: { enabled: true, followCursor: true } }}
				>
					<FlyoutMenu type="horizontal" items={itemsWithSubmenus} />
				</InteractionHintConfigProvider>

				<h3 style={{ marginTop: "40px", marginBottom: "20px" }}>Vertical Menu - Hints Follow Cursor</h3>
				<InteractionHintConfigProvider
					componentConfigs={{ horizontalFlyoutMenu: { enabled: true, followCursor: true } }}
				>
					<div style={{ width: "250px" }}>
						<FlyoutMenu type="vertical" items={itemsWithSubmenus} />
					</div>
				</InteractionHintConfigProvider>
			</div>
		);
	}
};

export const WithInteractionHintNoArrow: Story = {
	render: () => {
		return (
			<div style={{ padding: "20px" }}>
				<h3 style={{ marginBottom: "20px" }}>Horizontal Menu - No Arrow Pointers</h3>
				<p style={{ marginBottom: "10px", color: "#666" }}>Hints displayed without arrow pointers</p>
				<InteractionHintConfigProvider hideArrow componentConfigs={{ horizontalFlyoutMenu: true }}>
					<FlyoutMenu type="horizontal" items={itemsWithSubmenus} />
				</InteractionHintConfigProvider>

				<h3 style={{ marginTop: "40px", marginBottom: "20px" }}>Vertical Menu - No Arrow Pointers</h3>
				<InteractionHintConfigProvider hideArrow componentConfigs={{ verticalFlyoutMenu: true }}>
					<div style={{ width: "250px" }}>
						<FlyoutMenu type="vertical" items={itemsWithSubmenus} />
					</div>
				</InteractionHintConfigProvider>
			</div>
		);
	}
};

export const WithBadgesAndInteractionHint: Story = {
	render: () => {
		return (
			<div style={{ padding: "20px" }}>
				<h3 style={{ marginBottom: "20px" }}>Horizontal Menu with Badges and Hints</h3>
				<p style={{ marginBottom: "10px", color: "#666" }}>Menu items with badges and interaction hints</p>
				<InteractionHintConfigProvider componentConfigs={{ horizontalFlyoutMenu: true }}>
					<FlyoutMenu type="horizontal" items={itemsWithBadges} />
				</InteractionHintConfigProvider>

				<h3 style={{ marginTop: "40px", marginBottom: "20px" }}>Vertical Menu with Badges and Hints</h3>
				<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: true }}>
					<div style={{ width: "250px" }}>
						<FlyoutMenu type="vertical" items={itemsWithBadges} />
					</div>
				</InteractionHintConfigProvider>
			</div>
		);
	}
};

export const WithVariantsAndInteractionHint: Story = {
	render: () => {
		return (
			<div style={{ padding: "20px" }}>
				<h3 style={{ marginBottom: "20px" }}>Horizontal Menu with Status Variants and Hints</h3>
				<p style={{ marginBottom: "10px", color: "#666" }}>Menu items with different status variants and hints</p>
				<InteractionHintConfigProvider componentConfigs={{ horizontalFlyoutMenu: true }}>
					<FlyoutMenu type="horizontal" items={variantItems} />
				</InteractionHintConfigProvider>

				<h3 style={{ marginTop: "40px", marginBottom: "20px" }}>Vertical Menu with Status Variants and Hints</h3>
				<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: true }}>
					<div style={{ width: "250px" }}>
						<FlyoutMenu type="vertical" items={variantItems} />
					</div>
				</InteractionHintConfigProvider>
			</div>
		);
	}
};

export const WithInteractionHintPositionLeft: Story = {
	render: () => {
		return (
			<div style={{ padding: "20px" }}>
				<h3 style={{ marginBottom: "20px" }}>Vertical Menu - Hints Position Left</h3>
				<p style={{ marginBottom: "10px", color: "#666" }}>
					Hints positioned on the left side (vertical.position only affects vertical menus)
				</p>
				<div style={{ display: "flex", gap: "40px" }}>
					<div>
						<h3 style={{ marginTop: "40px", marginBottom: "20px" }}>With Position Left</h3>
						<InteractionHintConfigProvider
							componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "left" } }}
						>
							<div style={{ width: "250px" }}>
								<FlyoutMenu type="vertical" items={itemsWithSubmenus} />
							</div>
						</InteractionHintConfigProvider>
					</div>

					<div>
						<h3 style={{ marginTop: "40px", marginBottom: "20px" }}>With Variants - Position Left</h3>
						<InteractionHintConfigProvider
							componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "left" } }}
						>
							<div style={{ width: "250px" }}>
								<FlyoutMenu type="vertical" items={variantItems} />
							</div>
						</InteractionHintConfigProvider>
					</div>
					<div>
						<h3 style={{ marginTop: "40px", marginBottom: "20px" }}>With Badges - Position Left</h3>
						<InteractionHintConfigProvider
							componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "left" } }}
						>
							<div style={{ width: "250px" }}>
								<FlyoutMenu type="vertical" items={itemsWithBadges} />
							</div>
						</InteractionHintConfigProvider>
					</div>
				</div>
			</div>
		);
	}
};

export const WithInteractionHintPositionRight: Story = {
	render: () => {
		return (
			<div style={{ padding: "20px" }}>
				<h3 style={{ marginBottom: "20px" }}>Vertical Menu - Hints Position Right</h3>
				<p style={{ marginBottom: "10px", color: "#666" }}>
					Hints positioned on the right side (vertical.position only affects vertical menus)
				</p>
				<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "right" } }}>
					<div style={{ width: "250px" }}>
						<FlyoutMenu type="vertical" items={itemsWithSubmenus} />
					</div>
				</InteractionHintConfigProvider>

				<h3 style={{ marginTop: "40px", marginBottom: "20px" }}>With Variants - Position Right</h3>
				<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "right" } }}>
					<div style={{ width: "250px" }}>
						<FlyoutMenu type="vertical" items={variantItems} />
					</div>
				</InteractionHintConfigProvider>

				<h3 style={{ marginTop: "40px", marginBottom: "20px" }}>With Badges - Position Right</h3>
				<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "right" } }}>
					<div style={{ width: "250px" }}>
						<FlyoutMenu type="vertical" items={itemsWithBadges} />
					</div>
				</InteractionHintConfigProvider>
			</div>
		);
	}
};

export const WithInteractionHintAllPositions: Story = {
	render: () => {
		return (
			<div style={{ padding: "20px" }}>
				<h3 style={{ marginBottom: "20px" }}>Comparison: All Hint Positions for Vertical Menu</h3>
				<p style={{ marginBottom: "10px", color: "#666" }}>
					Note: vertical.position configuration only affects vertical flyout menus
				</p>

				<div style={{ display: "flex", gap: "40px" }}>
					<div>
						<h4 style={{ marginTop: "30px", marginBottom: "15px" }}>Default Position (Bottom)</h4>
						<p style={{ marginBottom: "10px", color: "#666", fontSize: "14px" }}>
							Default behavior - hints appear below items
						</p>
						<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: true }}>
							<div style={{ width: "250px" }}>
								<FlyoutMenu type="vertical" items={itemsWithSubmenus} />
							</div>
						</InteractionHintConfigProvider>
					</div>

					<div>
						<h4 style={{ marginTop: "30px", marginBottom: "15px" }}>Position Left</h4>
						<p style={{ marginBottom: "10px", color: "#666", fontSize: "14px" }}>Hints appear on the left side</p>
						<InteractionHintConfigProvider
							componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "left" } }}
						>
							<div style={{ width: "250px" }}>
								<FlyoutMenu type="vertical" items={itemsWithSubmenus} />
							</div>
						</InteractionHintConfigProvider>
					</div>

					<div>
						<h4 style={{ marginTop: "30px", marginBottom: "15px" }}>Position Right</h4>
						<p style={{ marginBottom: "10px", color: "#666", fontSize: "14px" }}>Hints appear on the right side</p>
						<InteractionHintConfigProvider
							componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "right" } }}
						>
							<div style={{ width: "250px" }}>
								<FlyoutMenu type="vertical" items={itemsWithSubmenus} />
							</div>
						</InteractionHintConfigProvider>
					</div>
				</div>
			</div>
		);
	}
};

export const CollapsedWithInteractionHint: Story = {
	render: () => {
		const [collapsed, setCollapsed] = useState(true);

		return (
			<div style={{ padding: "20px" }}>
				<h3 style={{ marginBottom: "20px" }}>Collapsed Vertical Menu with Interaction Hints</h3>
				<label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
					<input type="checkbox" checked={collapsed} onChange={(e) => setCollapsed(e.target.checked)} />
					Collapsed
				</label>
				<p style={{ marginBottom: "10px", color: "#666" }}>
					Hints especially useful in collapsed mode. Note: vertical.position only applies to vertical menus.
				</p>

				<div style={{ display: "flex", gap: "40px" }}>
					<div>
						<h4 style={{ marginTop: "20px", marginBottom: "10px" }}>Default Position</h4>
						<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: true }}>
							<div style={{ width: collapsed ? "fit-content" : "300px" }}>
								<FlyoutMenu type="vertical" items={itemsWithSubmenus} collapsed={collapsed} />
							</div>
						</InteractionHintConfigProvider>
					</div>
					<div>
						<h4 style={{ marginTop: "20px", marginBottom: "10px" }}>Position Right</h4>
						<InteractionHintConfigProvider
							componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "right", followCursor: true } }}
						>
							<div style={{ width: collapsed ? "fit-content" : "300px" }}>
								<FlyoutMenu type="vertical" items={itemsWithSubmenus} collapsed={collapsed} />
							</div>
						</InteractionHintConfigProvider>
					</div>
				</div>
			</div>
		);
	}
};
