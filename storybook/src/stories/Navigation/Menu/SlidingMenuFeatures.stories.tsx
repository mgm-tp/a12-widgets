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
import { SlidingMenu, Icon, Badge, Button } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof SlidingMenu> = {
	title: "Navigation/Menu/SlidingMenu/Features",
	component: SlidingMenu,
	parameters: {
		layout: "fullscreen"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems: MenuItem[] = [
	{ label: "Home", icon: <Icon>home</Icon>, title: "Go to home" },
	{ label: "Products", icon: <Icon>inventory_2</Icon>, title: "View products" },
	{ label: "Services", icon: <Icon>build</Icon>, title: "Our services" },
	{ label: "About", icon: <Icon>info</Icon>, title: "About us" },
	{ label: "Contact", icon: <Icon>mail</Icon>, title: "Contact us" }
];

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

const DefaultStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
			</div>
			<div style={{ width: "320px" }}>
				<SlidingMenu id="sliding-menu-features-default" items={basicItems} />
			</div>
		</div>
	);
};

export const Default: Story = {
	render: () => <DefaultStory />
};

const WithBadgesStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
			</div>
			<div style={{ width: "320px" }}>
				<SlidingMenu id="sliding-menu-badges" items={itemsWithBadges} />
			</div>
		</div>
	);
};

export const WithBadges: Story = {
	render: () => <WithBadgesStory />
};

const WithVariantsStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>
					Menu items with status variants (open, inProgress, info, error, warning, done)
				</p>
			</div>
			<div style={{ width: "320px" }}>
				<SlidingMenu id="sliding-menu-variants" items={itemsWithVariants} />
			</div>
		</div>
	);
};

export const WithVariants: Story = {
	render: () => <WithVariantsStory />
};

const NestedSubmenusStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Navigate through nested menu levels</p>
			</div>
			<div style={{ width: "320px" }}>
				<SlidingMenu id="sliding-menu-nested" items={nestedItems} />
			</div>
		</div>
	);
};

export const NestedSubmenus: Story = {
	render: () => <NestedSubmenusStory />
};

const CollapsedStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Collapsed view shows only icons</p>
			</div>
			<div style={{ width: "320px" }}>
				<SlidingMenu id="sliding-menu-collapsed" items={itemsWithSubmenus} collapsed />
			</div>
		</div>
	);
};

export const Collapsed: Story = {
	render: () => <CollapsedStory />
};
