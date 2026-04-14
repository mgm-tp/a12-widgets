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

import { SlidingMenu, Icon, Badge, Button } from "@com.mgmtp.a12.widgets/widgets-core";
import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu";
import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint-context.js";

const meta: Meta<typeof SlidingMenu> = {
	title: "Widgets/Navigation/Menu/SlidingMenu",
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

// Menu items with badges
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

// Menu items with variants (status)
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

// Nested menu items
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

// ========== Basic Sliding Menu Stories ==========

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

// ========== Interaction Hint Stories ==========

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

const WithInteractionHintAllPositionsStory = () => {
	const [expandedDefault, setExpandedDefault] = useState(false);
	const [expandedLeft, setExpandedLeft] = useState(false);
	const [expandedRight, setExpandedRight] = useState(false);

	return (
		<div style={{ minHeight: "100vh" }}>
			<div style={{ padding: "20px", borderBottom: "1px solid #ddd" }}>
				<h3 style={{ marginBottom: "20px" }}>Comparison: All Hint Positions for Sliding Menu</h3>
				<p style={{ color: "#666", marginBottom: "20px" }}>
					Open each menu to see how hints appear in different positions
				</p>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: "40px", padding: "20px" }}>
				<div>
					<h4 style={{ marginBottom: "15px" }}>Default Position (Bottom)</h4>
					<Button
						label={expandedDefault ? "Close Menu" : "Open Menu"}
						onClick={() => setExpandedDefault(!expandedDefault)}
						primary
					/>
					<p style={{ marginTop: "10px", color: "#666", fontSize: "14px" }}>
						Default behavior - hints appear below items
					</p>
					<div style={{ height: "400px", position: "relative", marginTop: "10px" }}>
						<InteractionHintConfigProvider componentConfigs={{ slidingMenu: true }}>
							<div style={{ width: "320px" }}>
								<SlidingMenu id="sliding-menu-hint-comparison-default" items={itemsWithSubmenus} />
							</div>
						</InteractionHintConfigProvider>
					</div>
				</div>

				<div>
					<h4 style={{ marginBottom: "15px" }}>Position Left</h4>
					<Button
						label={expandedLeft ? "Close Menu" : "Open Menu"}
						onClick={() => setExpandedLeft(!expandedLeft)}
						primary
					/>
					<p style={{ marginTop: "10px", color: "#666", fontSize: "14px" }}>Hints appear on the left side</p>
					<div style={{ height: "400px", position: "relative", marginTop: "10px" }}>
						<InteractionHintConfigProvider componentConfigs={{ slidingMenu: { enabled: true, position: "left" } }}>
							<SlidingMenu.MainWrapper expanded={expandedLeft}>
								<div style={{ width: "320px" }}>
									<SlidingMenu id="sliding-menu-hint-comparison-left" items={itemsWithSubmenus} />
								</div>
							</SlidingMenu.MainWrapper>
						</InteractionHintConfigProvider>
					</div>
				</div>

				<div>
					<h4 style={{ marginBottom: "15px" }}>Position Right</h4>
					<Button
						label={expandedRight ? "Close Menu" : "Open Menu"}
						onClick={() => setExpandedRight(!expandedRight)}
						primary
					/>
					<p style={{ marginTop: "10px", color: "#666", fontSize: "14px" }}>Hints appear on the right side</p>
					<div style={{ height: "400px", position: "relative", marginTop: "10px" }}>
						<InteractionHintConfigProvider componentConfigs={{ slidingMenu: { enabled: true, position: "right" } }}>
							<div style={{ width: "320px" }}>
								<SlidingMenu id="sliding-menu-hint-comparison-right" items={itemsWithSubmenus} />
							</div>
						</InteractionHintConfigProvider>
					</div>
				</div>
			</div>
		</div>
	);
};

export const WithInteractionHintAllPositions: Story = {
	render: () => <WithInteractionHintAllPositionsStory />
};

const CollapsedWithInteractionHintStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>
					Collapsed view with interaction hints (position: right works best)
				</p>
			</div>
			<InteractionHintConfigProvider componentConfigs={{ slidingMenu: { enabled: true, position: "right" } }}>
				<div style={{ width: "320px" }}>
					<SlidingMenu id="sliding-menu-collapsed-hint" items={itemsWithSubmenus} collapsed />
				</div>
			</InteractionHintConfigProvider>
		</div>
	);
};

export const CollapsedWithInteractionHint: Story = {
	render: () => <CollapsedWithInteractionHintStory />
};

// ========== Advanced Examples ==========

const WithCustomTopStory = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px", backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				<p style={{ marginTop: "10px", color: "#666" }}>Sliding menu with custom layout</p>
			</div>
			<div style={{ width: "320px" }}>
				<SlidingMenu id="sliding-menu-custom-top" items={itemsWithSubmenus} />
			</div>
		</div>
	);
};

export const WithCustomTop: Story = {
	render: () => <WithCustomTopStory />
};

const InteractiveStory = () => {
	const [expanded, setExpanded] = useState(true);
	const [selectedItem, setSelectedItem] = useState<string | null>(null);

	const handleItemClick = (label: string, hasChildren: boolean) => {
		setSelectedItem(label);

		if (!hasChildren) {
			// Only close menu if it's a leaf item (no children)
			setTimeout(() => setExpanded(false), 300);
		}
	};

	const interactiveItems: MenuItem[] = itemsWithSubmenus.map((item) => ({
		...item,
		onClick: () =>
			handleItemClick(
				typeof item.label === "string" ? item.label : item.title || "Unknown",
				!!(item.items && item.items.length > 0)
			),
		items: item.items?.map((subItem) => {
			const isMenuItem = !("type" in subItem);
			const label =
				isMenuItem && typeof subItem.label === "string"
					? subItem.label
					: isMenuItem && "title" in subItem
						? subItem.title || "Unknown"
						: "Unknown";

			return {
				...subItem,
				onClick: () => handleItemClick(label, false)
			};
		})
	}));

	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<Button label={expanded ? "Close Menu" : "Open Menu"} onClick={() => setExpanded(!expanded)} primary />
				{selectedItem && (
					<p style={{ marginTop: "10px", color: "#2196f3", fontWeight: "bold" }}>Selected: {selectedItem}</p>
				)}
			</div>
			<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ slidingMenu: true }}>
				<div style={{ width: "320px" }}>
					<SlidingMenu id="sliding-menu-interactive" items={interactiveItems} />
				</div>
			</InteractionHintConfigProvider>
		</div>
	);
};

export const Interactive: Story = {
	render: () => <InteractiveStory />
};

// ========== Comprehensive Showcase ==========

const ComprehensiveShowcaseStory = () => {
	const [basicExpanded, setBasicExpanded] = useState(false);
	const [badgesExpanded, setBadgesExpanded] = useState(false);
	const [variantsExpanded, setVariantsExpanded] = useState(false);

	return (
		<div style={{ display: "flex", gap: "40px", padding: "20px", minHeight: "100vh" }}>
			<div style={{ flex: 1 }}>
				<h3>Basic Sliding Menu</h3>
				<Button label="Toggle" onClick={() => setBasicExpanded(!basicExpanded)} />
				<div style={{ height: "400px", position: "relative", marginTop: "10px" }}>
					<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ slidingMenu: true }}>
						<div style={{ width: "320px" }}>
							<SlidingMenu id="showcase-basic" items={basicItems} />
						</div>
					</InteractionHintConfigProvider>
				</div>
			</div>

			<div style={{ flex: 1 }}>
				<h3>With Badges</h3>
				<Button label="Toggle" onClick={() => setBadgesExpanded(!badgesExpanded)} />
				<div style={{ height: "400px", position: "relative", marginTop: "10px" }}>
					<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ slidingMenu: true }}>
						<div style={{ width: "320px" }}>
							<SlidingMenu id="showcase-badges" items={itemsWithBadges} />
						</div>
					</InteractionHintConfigProvider>
				</div>
			</div>

			<div style={{ flex: 1 }}>
				<h3>With Status Variants</h3>
				<Button label="Toggle" onClick={() => setVariantsExpanded(!variantsExpanded)} />
				<div style={{ height: "400px", position: "relative", marginTop: "10px" }}>
					<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ slidingMenu: true }}>
						<div style={{ width: "320px" }}>
							<SlidingMenu id="showcase-variants" items={itemsWithVariants} />
						</div>
					</InteractionHintConfigProvider>
				</div>
			</div>
		</div>
	);
};

export const ComprehensiveShowcase: Story = {
	render: () => <ComprehensiveShowcaseStory />
};

// ========== Custom Backward Item ==========
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

const CustomizeBackwardItemStory = () => {
	return (
		<div style={{ height: "100vh", position: "relative" }}>
			<div style={{ padding: "20px" }}>
				<p style={{ marginTop: "10px", color: "#666" }}>
					Click on "Products" menu item to see the custom backward item with "Go Back" label in the submenu
				</p>
			</div>
			<div style={{ width: "320px" }}>
				<SlidingMenu id="sliding-menu-custom-backward" items={itemsWithCustomBackward} />
			</div>
		</div>
	);
};

export const CustomizeBackwardItem: Story = {
	render: () => <CustomizeBackwardItemStory />,
	parameters: {
		docs: {
			description: {
				story:
					"Demonstrates customizing the backward navigation item using `backwardItemProps`. The first item (Products) has a custom backward item with a 'Go Back' label and arrow icon, while other items inherit default behavior."
			}
		}
	}
};
