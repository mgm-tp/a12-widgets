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
import { SlidingMenu, Icon, Button } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof SlidingMenu> = {
	title: "Navigation/Menu/SlidingMenu",
	component: SlidingMenu,
	parameters: {
		layout: "fullscreen"
	},
	tags: ["autodocs"],
	argTypes: {
		collapsed: {
			control: "boolean",
			description: "Will compact the view if true"
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

// ========== Basic Sliding Menu Stories ==========

const DefaultStory = () => (
	<div style={{ height: "100vh", position: "relative" }}>
		<div style={{ width: "320px" }}>
			<SlidingMenu id="sliding-menu-default" items={basicItems} />
		</div>
	</div>
);

export const Default: Story = {
	render: () => <DefaultStory />
};

const BasicStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
			</div>
			<div style={{ width: "320px" }}>
				<SlidingMenu id="sliding-menu-basic" items={basicItems} />
			</div>
		</div>
	);
};

export const Basic: Story = {
	render: () => <BasicStory />
};

const WithSubmenusStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
			</div>
			<div style={{ width: "320px" }}>
				<SlidingMenu id="sliding-menu-submenus" items={itemsWithSubmenus} />
			</div>
		</div>
	);
};

export const WithSubmenus: Story = {
	render: () => <WithSubmenusStory />
};
