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
import {
	FlyoutMenu,
	Icon,
	Badge,
	Counter,
	InteractionHintConfigProvider,
	Typography
} from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof FlyoutMenu> = {
	title: "Navigation/Menu/FlyoutMenu/Interactions",
	component: FlyoutMenu,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

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
			{ label: "Roles & Permissions", title: "Manage roles and permissions" }
		]
	},
	{ label: "Settings", icon: <Icon>settings</Icon>, title: "Application settings" }
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

const variantItems: MenuItem[] = [
	{ label: "Open", variant: "open", title: "Available to access" },
	{ label: "Info", variant: "info", title: "Additional information" },
	{ label: "Error", variant: "error", title: "Error detected" },
	{ label: "Warning", variant: "warning", title: "Proceed with caution" },
	{ label: "Done", variant: "done", title: "Successfully completed" }
];

export const Default: Story = {
	render: () => {
		return (
			<div style={{ padding: "20px" }}>
				<Typography.Headline level={3} style={{ marginBottom: "20px" }}>
					Horizontal Menu with Interaction Hints
				</Typography.Headline>
				<Typography.Body style={{ color: "#666", marginBottom: "10px" }}>
					Hover or focus on menu items to see interaction hints
				</Typography.Body>
				<InteractionHintConfigProvider componentConfigs={{ horizontalFlyoutMenu: true }}>
					<FlyoutMenu type="horizontal" items={itemsWithSubmenus} />
				</InteractionHintConfigProvider>
			</div>
		);
	}
};

export const WithInteractionHint: Story = {
	render: () => {
		return (
			<div style={{ padding: "20px" }}>
				<Typography.Headline level={3} style={{ marginBottom: "20px" }}>
					Horizontal Menu with Interaction Hints
				</Typography.Headline>
				<Typography.Body style={{ color: "#666", marginBottom: "10px" }}>
					Hover or focus on menu items to see interaction hints
				</Typography.Body>
				<InteractionHintConfigProvider componentConfigs={{ horizontalFlyoutMenu: true }}>
					<FlyoutMenu type="horizontal" items={itemsWithSubmenus} />
				</InteractionHintConfigProvider>

				<Typography.Headline level={3} style={{ marginTop: "40px", marginBottom: "20px" }}>
					Vertical Menu with Interaction Hints
				</Typography.Headline>
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
				<Typography.Headline level={3} style={{ marginBottom: "20px" }}>
					Horizontal Menu — Hints Follow Cursor
				</Typography.Headline>
				<Typography.Body style={{ color: "#666", marginBottom: "10px" }}>
					Hints follow your cursor movement
				</Typography.Body>
				<InteractionHintConfigProvider
					componentConfigs={{ horizontalFlyoutMenu: { enabled: true, followCursor: true } }}
				>
					<FlyoutMenu type="horizontal" items={itemsWithSubmenus} />
				</InteractionHintConfigProvider>

				<Typography.Headline level={3} style={{ marginTop: "40px", marginBottom: "20px" }}>
					Vertical Menu — Hints Follow Cursor
				</Typography.Headline>
				<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: { enabled: true, followCursor: true } }}>
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
				<Typography.Headline level={3} style={{ marginBottom: "20px" }}>
					Horizontal Menu — No Arrow Pointers
				</Typography.Headline>
				<Typography.Body style={{ color: "#666", marginBottom: "10px" }}>
					Hints displayed without arrow pointers
				</Typography.Body>
				<InteractionHintConfigProvider hideArrow componentConfigs={{ horizontalFlyoutMenu: true }}>
					<FlyoutMenu type="horizontal" items={itemsWithSubmenus} />
				</InteractionHintConfigProvider>

				<Typography.Headline level={3} style={{ marginTop: "40px", marginBottom: "20px" }}>
					Vertical Menu — No Arrow Pointers
				</Typography.Headline>
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
				<Typography.Headline level={3} style={{ marginBottom: "20px" }}>
					Horizontal Menu with Badges and Hints
				</Typography.Headline>
				<InteractionHintConfigProvider componentConfigs={{ horizontalFlyoutMenu: true }}>
					<FlyoutMenu type="horizontal" items={itemsWithBadges} />
				</InteractionHintConfigProvider>

				<Typography.Headline level={3} style={{ marginTop: "40px", marginBottom: "20px" }}>
					Vertical Menu with Badges and Hints
				</Typography.Headline>
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
				<Typography.Headline level={3} style={{ marginBottom: "20px" }}>
					Horizontal Menu with Status Variants and Hints
				</Typography.Headline>
				<InteractionHintConfigProvider componentConfigs={{ horizontalFlyoutMenu: true }}>
					<FlyoutMenu type="horizontal" items={variantItems} />
				</InteractionHintConfigProvider>

				<Typography.Headline level={3} style={{ marginTop: "40px", marginBottom: "20px" }}>
					Vertical Menu with Status Variants and Hints
				</Typography.Headline>
				<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: true }}>
					<div style={{ width: "250px" }}>
						<FlyoutMenu type="vertical" items={variantItems} />
					</div>
				</InteractionHintConfigProvider>
			</div>
		);
	}
};
