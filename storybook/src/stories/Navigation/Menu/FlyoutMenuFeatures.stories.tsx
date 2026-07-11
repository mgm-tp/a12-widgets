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
import { FlyoutMenu, Icon, Badge, Counter } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof FlyoutMenu> = {
	title: "Navigation/Menu/FlyoutMenu/Features",
	component: FlyoutMenu,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems: MenuItem[] = [
	{ label: "Home", icon: <Icon>home</Icon>, title: "Go to home page" },
	{ label: "Products", icon: <Icon>inventory_2</Icon>, title: "View all products" },
	{ label: "Services", icon: <Icon>build</Icon>, title: "Our services" },
	{ label: "About", icon: <Icon>info</Icon>, title: "About us" },
	{ label: "Contact", icon: <Icon>mail</Icon>, title: "Contact us" }
];

const variantItems: MenuItem[] = [
	{ label: "Open", variant: "open", title: "Available to access" },
	{ label: "Info", variant: "info", title: "Additional information" },
	{ label: "Error", variant: "error", title: "Error detected" },
	{ label: "Warning", variant: "warning", title: "Proceed with caution" },
	{ label: "Done", variant: "done", title: "Successfully completed" }
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

export const Default: Story = {
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
