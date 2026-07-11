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
import {
	FlyoutMenu,
	Icon,
	Badge,
	Counter,
	InteractionHintConfigProvider,
	Checkbox,
	Typography
} from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof FlyoutMenu> = {
	title: "Navigation/Menu/FlyoutMenu/InteractionsAdvanced",
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
					Vertical Menu — Hints Position Left
				</Typography.Headline>
				<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "left" } }}>
					<div style={{ width: "250px" }}>
						<FlyoutMenu type="vertical" items={itemsWithSubmenus} />
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
				<Typography.Headline level={3} style={{ marginBottom: "20px" }}>
					Vertical Menu — Hints Position Left
				</Typography.Headline>
				<Typography.Body style={{ color: "#666", marginBottom: "10px" }}>
					Hints positioned on the left side (only affects vertical menus)
				</Typography.Body>
				<div style={{ display: "flex", gap: "40px" }}>
					<div>
						<Typography.Headline level={4} style={{ marginTop: "20px", marginBottom: "10px" }}>
							With Submenus — Position Left
						</Typography.Headline>
						<InteractionHintConfigProvider
							componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "left" } }}
						>
							<div style={{ width: "250px" }}>
								<FlyoutMenu type="vertical" items={itemsWithSubmenus} />
							</div>
						</InteractionHintConfigProvider>
					</div>
					<div>
						<Typography.Headline level={4} style={{ marginTop: "20px", marginBottom: "10px" }}>
							With Variants — Position Left
						</Typography.Headline>
						<InteractionHintConfigProvider
							componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "left" } }}
						>
							<div style={{ width: "250px" }}>
								<FlyoutMenu type="vertical" items={variantItems} />
							</div>
						</InteractionHintConfigProvider>
					</div>
					<div>
						<Typography.Headline level={4} style={{ marginTop: "20px", marginBottom: "10px" }}>
							With Badges — Position Left
						</Typography.Headline>
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
				<Typography.Headline level={3} style={{ marginBottom: "20px" }}>
					Vertical Menu — Hints Position Right
				</Typography.Headline>
				<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "right" } }}>
					<div style={{ width: "250px" }}>
						<FlyoutMenu type="vertical" items={itemsWithSubmenus} />
					</div>
				</InteractionHintConfigProvider>

				<Typography.Headline level={3} style={{ marginTop: "40px", marginBottom: "20px" }}>
					With Variants — Position Right
				</Typography.Headline>
				<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "right" } }}>
					<div style={{ width: "250px" }}>
						<FlyoutMenu type="vertical" items={variantItems} />
					</div>
				</InteractionHintConfigProvider>

				<Typography.Headline level={3} style={{ marginTop: "40px", marginBottom: "20px" }}>
					With Badges — Position Right
				</Typography.Headline>
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
				<Typography.Headline level={3} style={{ marginBottom: "20px" }}>
					Comparison: All Hint Positions for Vertical Menu
				</Typography.Headline>
				<Typography.Body style={{ color: "#666", marginBottom: "10px" }}>
					Note: vertical.position configuration only affects vertical flyout menus
				</Typography.Body>
				<div style={{ display: "flex", gap: "40px" }}>
					<div>
						<Typography.Headline level={4} style={{ marginTop: "30px", marginBottom: "15px" }}>
							Default Position
						</Typography.Headline>
						<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: true }}>
							<div style={{ width: "250px" }}>
								<FlyoutMenu type="vertical" items={itemsWithSubmenus} />
							</div>
						</InteractionHintConfigProvider>
					</div>
					<div>
						<Typography.Headline level={4} style={{ marginTop: "30px", marginBottom: "15px" }}>
							Position Left
						</Typography.Headline>
						<InteractionHintConfigProvider
							componentConfigs={{ verticalFlyoutMenu: { enabled: true, position: "left" } }}
						>
							<div style={{ width: "250px" }}>
								<FlyoutMenu type="vertical" items={itemsWithSubmenus} />
							</div>
						</InteractionHintConfigProvider>
					</div>
					<div>
						<Typography.Headline level={4} style={{ marginTop: "30px", marginBottom: "15px" }}>
							Position Right
						</Typography.Headline>
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
				<Typography.Headline level={3} style={{ marginBottom: "20px" }}>
					Collapsed Vertical Menu with Interaction Hints
				</Typography.Headline>
				<div style={{ marginBottom: "20px" }}>
					<Checkbox label="Collapsed" checked={collapsed} onChange={(checked) => setCollapsed(checked)} />
				</div>
				<Typography.Body style={{ color: "#666", marginBottom: "10px" }}>
					Hints especially useful in collapsed mode.
				</Typography.Body>
				<div style={{ display: "flex", gap: "40px" }}>
					<div>
						<Typography.Headline level={4} style={{ marginTop: "20px", marginBottom: "10px" }}>
							Default Position
						</Typography.Headline>
						<InteractionHintConfigProvider componentConfigs={{ verticalFlyoutMenu: true }}>
							<div style={{ width: collapsed ? "fit-content" : "300px" }}>
								<FlyoutMenu type="vertical" items={itemsWithSubmenus} collapsed={collapsed} />
							</div>
						</InteractionHintConfigProvider>
					</div>
					<div>
						<Typography.Headline level={4} style={{ marginTop: "20px", marginBottom: "10px" }}>
							Position Right
						</Typography.Headline>
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
