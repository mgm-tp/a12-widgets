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
	SlidingMenu,
	Icon,
	Badge,
	Button,
	InteractionHintConfigProvider,
	Typography
} from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof SlidingMenu> = {
	title: "Navigation/Menu/SlidingMenu/Advanced",
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

const DefaultStory = () => {
	const [expandedDefault, setExpandedDefault] = useState(false);
	const [expandedLeft, setExpandedLeft] = useState(false);
	const [expandedRight, setExpandedRight] = useState(false);

	return (
		<div style={{ minHeight: "100vh" }}>
			<div style={{ padding: "20px", borderBottom: "1px solid #ddd" }}>
				<Typography.Headline level={3} style={{ marginBottom: "20px" }}>
					Comparison: All Hint Positions for Sliding Menu
				</Typography.Headline>
				<Typography.Body color="#666" style={{ marginBottom: "20px" }}>
					Open each menu to see how hints appear in different positions
				</Typography.Body>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: "40px", padding: "20px" }}>
				<div>
					<Typography.Headline level={4} style={{ marginBottom: "15px" }}>
						Default Position (Bottom)
					</Typography.Headline>
					<Button
						label={expandedDefault ? "Close Menu" : "Open Menu"}
						onClick={() => setExpandedDefault(!expandedDefault)}
						primary
					/>
					<Typography.Body color="#666" style={{ marginTop: "10px", fontSize: "14px" }}>
						Default behavior - hints appear below items
					</Typography.Body>
					<div style={{ height: "400px", position: "relative", marginTop: "10px" }}>
						<InteractionHintConfigProvider componentConfigs={{ slidingMenu: true }}>
							<div style={{ width: "320px" }}>
								<SlidingMenu id="sliding-menu-hint-comparison-default" items={itemsWithSubmenus} />
							</div>
						</InteractionHintConfigProvider>
					</div>
				</div>

				<div>
					<Typography.Headline level={4} style={{ marginBottom: "15px" }}>
						Position Left
					</Typography.Headline>
					<Button
						label={expandedLeft ? "Close Menu" : "Open Menu"}
						onClick={() => setExpandedLeft(!expandedLeft)}
						primary
					/>
					<Typography.Body color="#666" style={{ marginTop: "10px", fontSize: "14px" }}>
						Hints appear on the left side
					</Typography.Body>
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
					<Typography.Headline level={4} style={{ marginBottom: "15px" }}>
						Position Right
					</Typography.Headline>
					<Button
						label={expandedRight ? "Close Menu" : "Open Menu"}
						onClick={() => setExpandedRight(!expandedRight)}
						primary
					/>
					<Typography.Body color="#666" style={{ marginTop: "10px", fontSize: "14px" }}>
						Hints appear on the right side
					</Typography.Body>
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

export const Default: Story = {
	render: () => <DefaultStory />
};

const WithInteractionHintAllPositionsStory = () => {
	const [expandedDefault, setExpandedDefault] = useState(false);
	const [expandedLeft, setExpandedLeft] = useState(false);
	const [expandedRight, setExpandedRight] = useState(false);

	return (
		<div style={{ minHeight: "100vh" }}>
			<div style={{ padding: "20px", borderBottom: "1px solid #ddd" }}>
				<Typography.Headline level={3} style={{ marginBottom: "20px" }}>
					Comparison: All Hint Positions for Sliding Menu
				</Typography.Headline>
				<Typography.Body color="#666" style={{ marginBottom: "20px" }}>
					Open each menu to see how hints appear in different positions
				</Typography.Body>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: "40px", padding: "20px" }}>
				<div>
					<Typography.Headline level={4} style={{ marginBottom: "15px" }}>
						Default Position (Bottom)
					</Typography.Headline>
					<Button
						label={expandedDefault ? "Close Menu" : "Open Menu"}
						onClick={() => setExpandedDefault(!expandedDefault)}
						primary
					/>
					<Typography.Body color="#666" style={{ marginTop: "10px", fontSize: "14px" }}>
						Default behavior - hints appear below items
					</Typography.Body>
					<div style={{ height: "400px", position: "relative", marginTop: "10px" }}>
						<InteractionHintConfigProvider componentConfigs={{ slidingMenu: true }}>
							<div style={{ width: "320px" }}>
								<SlidingMenu id="sliding-menu-hint-comparison-default" items={itemsWithSubmenus} />
							</div>
						</InteractionHintConfigProvider>
					</div>
				</div>

				<div>
					<Typography.Headline level={4} style={{ marginBottom: "15px" }}>
						Position Left
					</Typography.Headline>
					<Button
						label={expandedLeft ? "Close Menu" : "Open Menu"}
						onClick={() => setExpandedLeft(!expandedLeft)}
						primary
					/>
					<Typography.Body color="#666" style={{ marginTop: "10px", fontSize: "14px" }}>
						Hints appear on the left side
					</Typography.Body>
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
					<Typography.Headline level={4} style={{ marginBottom: "15px" }}>
						Position Right
					</Typography.Headline>
					<Button
						label={expandedRight ? "Close Menu" : "Open Menu"}
						onClick={() => setExpandedRight(!expandedRight)}
						primary
					/>
					<Typography.Body color="#666" style={{ marginTop: "10px", fontSize: "14px" }}>
						Hints appear on the right side
					</Typography.Body>
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

const ComprehensiveShowcaseStory = () => {
	const [basicExpanded, setBasicExpanded] = useState(false);
	const [badgesExpanded, setBadgesExpanded] = useState(false);
	const [variantsExpanded, setVariantsExpanded] = useState(false);

	return (
		<div style={{ display: "flex", gap: "40px", padding: "20px", minHeight: "100vh" }}>
			<div style={{ flex: 1 }}>
				<Typography.Headline level={3}>Basic Sliding Menu</Typography.Headline>
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
				<Typography.Headline level={3}>With Badges</Typography.Headline>
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
				<Typography.Headline level={3}>With Status Variants</Typography.Headline>
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
