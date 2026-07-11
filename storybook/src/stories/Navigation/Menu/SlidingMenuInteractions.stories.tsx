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
import { SlidingMenu, Icon, Badge, Button, InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof SlidingMenu> = {
	title: "Navigation/Menu/SlidingMenu/Interactions",
	component: SlidingMenu,
	parameters: {
		layout: "fullscreen"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

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

const DefaultStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Hover or focus on menu items to see interaction hints</p>
			</div>
			<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ slidingMenu: true }}>
				<div style={{ width: "320px" }}>
					<SlidingMenu id="sliding-menu-interactions-default" items={itemsWithSubmenus} />
				</div>
			</InteractionHintConfigProvider>
		</div>
	);
};

export const Default: Story = {
	render: () => <DefaultStory />
};

const WithInteractionHintStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Hover or focus on menu items to see interaction hints</p>
			</div>
			<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ slidingMenu: true }}>
				<div style={{ width: "320px" }}>
					<SlidingMenu id="sliding-menu-hint" items={itemsWithSubmenus} />
				</div>
			</InteractionHintConfigProvider>
		</div>
	);
};

export const WithInteractionHint: Story = {
	render: () => <WithInteractionHintStory />
};

const WithInteractionHintFollowCursorStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Hints follow your cursor movement</p>
			</div>
			<InteractionHintConfigProvider enableInteractionHint followCursor componentConfigs={{ slidingMenu: true }}>
				<div style={{ width: "320px" }}>
					<SlidingMenu id="sliding-menu-hint-follow" items={itemsWithSubmenus} />
				</div>
			</InteractionHintConfigProvider>
		</div>
	);
};

export const WithInteractionHintFollowCursor: Story = {
	render: () => <WithInteractionHintFollowCursorStory />
};

const WithInteractionHintNoArrowStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Hints displayed without arrow pointers</p>
			</div>
			<InteractionHintConfigProvider enableInteractionHint hideArrow componentConfigs={{ slidingMenu: true }}>
				<div style={{ width: "320px" }}>
					<SlidingMenu id="sliding-menu-hint-no-arrow" items={itemsWithSubmenus} />
				</div>
			</InteractionHintConfigProvider>
		</div>
	);
};

export const WithInteractionHintNoArrow: Story = {
	render: () => <WithInteractionHintNoArrowStory />
};

const WithBadgesAndInteractionHintStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Badges with interaction hints</p>
			</div>
			<InteractionHintConfigProvider componentConfigs={{ slidingMenu: true }}>
				<div style={{ width: "320px" }}>
					<SlidingMenu id="sliding-menu-badges-hint" items={itemsWithBadges} />
				</div>
			</InteractionHintConfigProvider>
		</div>
	);
};

export const WithBadgesAndInteractionHint: Story = {
	render: () => <WithBadgesAndInteractionHintStory />
};

const WithVariantsAndInteractionHintStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Status variants with interaction hints</p>
			</div>
			<InteractionHintConfigProvider componentConfigs={{ slidingMenu: true }}>
				<div style={{ width: "320px" }}>
					<SlidingMenu id="sliding-menu-variants-hint" items={itemsWithVariants} />
				</div>
			</InteractionHintConfigProvider>
		</div>
	);
};

export const WithVariantsAndInteractionHint: Story = {
	render: () => <WithVariantsAndInteractionHintStory />
};

const WithInteractionHintPositionLeftStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Hints positioned on the left side of items</p>
			</div>
			<InteractionHintConfigProvider componentConfigs={{ slidingMenu: { enabled: true, position: "left" } }}>
				<div style={{ width: "320px" }}>
					<SlidingMenu id="sliding-menu-hint-left" items={itemsWithSubmenus} />
				</div>
			</InteractionHintConfigProvider>
		</div>
	);
};

export const WithInteractionHintPositionLeft: Story = {
	render: () => <WithInteractionHintPositionLeftStory />
};

const WithInteractionHintPositionRightStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Hints positioned on the right side of items</p>
			</div>
			<InteractionHintConfigProvider componentConfigs={{ slidingMenu: { enabled: true, position: "right" } }}>
				<div style={{ width: "320px" }}>
					<SlidingMenu id="sliding-menu-hint-right" items={itemsWithSubmenus} />
				</div>
			</InteractionHintConfigProvider>
		</div>
	);
};

export const WithInteractionHintPositionRight: Story = {
	render: () => <WithInteractionHintPositionRightStory />
};

const WithBadgesAndHintPositionLeftStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Badges with hints positioned left</p>
			</div>
			<InteractionHintConfigProvider componentConfigs={{ slidingMenu: { enabled: true, position: "left" } }}>
				<SlidingMenu.MainWrapper expanded={expanded}>
					<div style={{ width: "320px" }}>
						<SlidingMenu id="sliding-menu-badges-hint-left" items={itemsWithBadges} />
					</div>
				</SlidingMenu.MainWrapper>
			</InteractionHintConfigProvider>
		</div>
	);
};

export const WithBadgesAndHintPositionLeft: Story = {
	render: () => <WithBadgesAndHintPositionLeftStory />
};

const WithBadgesAndHintPositionRightStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Badges with hints positioned right</p>
			</div>
			<InteractionHintConfigProvider componentConfigs={{ slidingMenu: { enabled: true, position: "right" } }}>
				<div style={{ width: "320px" }}>
					<SlidingMenu id="sliding-menu-badges-hint-right" items={itemsWithBadges} />
				</div>
			</InteractionHintConfigProvider>
		</div>
	);
};

export const WithBadgesAndHintPositionRight: Story = {
	render: () => <WithBadgesAndHintPositionRightStory />
};

const WithVariantsAndHintPositionLeftStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Status variants with hints positioned left</p>
			</div>
			<InteractionHintConfigProvider componentConfigs={{ slidingMenu: { enabled: true, position: "left" } }}>
				<div style={{ width: "320px" }}>
					<SlidingMenu id="sliding-menu-variants-hint-left" items={itemsWithVariants} />
				</div>
			</InteractionHintConfigProvider>
		</div>
	);
};

export const WithVariantsAndHintPositionLeft: Story = {
	render: () => <WithVariantsAndHintPositionLeftStory />
};

const WithVariantsAndHintPositionRightStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Status variants with hints positioned right</p>
			</div>
			<InteractionHintConfigProvider componentConfigs={{ slidingMenu: { enabled: true, position: "right" } }}>
				<div style={{ width: "320px" }}>
					<SlidingMenu id="sliding-menu-variants-hint-right" items={itemsWithVariants} />
				</div>
			</InteractionHintConfigProvider>
		</div>
	);
};

export const WithVariantsAndHintPositionRight: Story = {
	render: () => <WithVariantsAndHintPositionRightStory />
};
