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

import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { FlyoutMenu, Icon, Checkbox } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof FlyoutMenu> = {
	title: "Navigation/Menu/FlyoutMenu",
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

export const Default: Story = {
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
					<Checkbox label="Collapsed" checked={collapsed} onChange={(checked) => setCollapsed(checked)} />
					<div style={{ width: collapsed ? "fit-content" : "300px" }}>
						<FlyoutMenu type="vertical" items={itemsWithSubmenus} collapsed={collapsed} />
					</div>
				</div>
			);
		};

		return <CollapsedMenu />;
	}
};
