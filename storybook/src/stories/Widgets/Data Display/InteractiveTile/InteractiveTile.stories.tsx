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

import { InteractiveTile } from "@com.mgmtp.a12.widgets/widgets-core/lib/interactive-tile/main/interactive-tile.view";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view";
import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint-context.js";

const meta: Meta<typeof InteractiveTile> = {
	title: "Widgets/Data Display/InteractiveTile",
	component: InteractiveTile,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	argTypes: {
		title: {
			control: "text",
			description: "Title text for the tile"
		},
		selected: {
			control: "boolean",
			description: "Whether the tile is selected"
		},
		disabled: {
			control: "boolean",
			description: "Whether the tile is disabled"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<InteractiveTile title="Interactive Tile">
			<Icon>dashboard</Icon>
		</InteractiveTile>
	)
};

export const WithIcon: Story = {
	render: () => (
		<InteractiveTile title="Tile with Icon">
			<Icon>dashboard</Icon>
			<div>Content</div>
		</InteractiveTile>
	)
};

export const Selected: Story = {
	render: () => (
		<InteractiveTile title="Selected Tile" selected>
			<Icon>check_circle</Icon>
			<div>Selected</div>
		</InteractiveTile>
	)
};

export const Disabled: Story = {
	render: () => (
		<InteractiveTile title="Disabled Tile" disabled>
			<Icon>block</Icon>
			<div>Disabled</div>
		</InteractiveTile>
	)
};

export const WithMetaInfo: Story = {
	render: () => (
		<InteractiveTile title="Tile with Meta">
			<Icon>check_circle</Icon>
			<div>Meta Info</div>
		</InteractiveTile>
	)
};

export const Interactive: Story = {
	render: () => {
		const InteractiveTileDemo = () => {
			const [selectedId, setSelectedId] = useState<string | undefined>("1");

			return (
				<div style={{ display: "flex", gap: "16px" }}>
					<InteractiveTile id="1" title="Option 1" selected={selectedId === "1"} onClick={() => setSelectedId("1")}>
						<Icon>home</Icon>
						<div>Option 1</div>
					</InteractiveTile>
					<InteractiveTile id="2" title="Option 2" selected={selectedId === "2"} onClick={() => setSelectedId("2")}>
						<Icon>settings</Icon>
						<div>Option 2</div>
					</InteractiveTile>
					<InteractiveTile id="3" title="Option 3" selected={selectedId === "3"} onClick={() => setSelectedId("3")}>
						<Icon>help</Icon>
						<div>Option 3</div>
					</InteractiveTile>
				</div>
			);
		};

		return <InteractiveTileDemo />;
	}
};

export const WithInteractionHint: Story = {
	render: () => (
		<InteractionHintConfigProvider componentConfigs={{ interactiveTile: true }}>
			<div style={{ display: "flex", gap: "16px", padding: "20px" }}>
				<InteractiveTile title="Dashboard Overview">
					<Icon>dashboard</Icon>
					<div>Dashboard</div>
				</InteractiveTile>
				<InteractiveTile title="Settings Panel">
					<Icon>settings</Icon>
					<div>Settings</div>
				</InteractiveTile>
				<InteractiveTile title="Help Center">
					<Icon>help</Icon>
					<div>Help</div>
				</InteractiveTile>
			</div>
		</InteractionHintConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Interactive tiles with interaction hints enabled. Hover over or focus the tiles to see helpful tooltips."
			}
		}
	}
};

export const WithInteractionHintFollowCursor: Story = {
	render: () => (
		<InteractionHintConfigProvider componentConfigs={{ interactiveTile: { followCursor: true } }}>
			<div style={{ display: "flex", gap: "16px", padding: "20px" }}>
				<InteractiveTile title="Follow cursor hint">
					<Icon>mouse</Icon>
					<div>Follow</div>
				</InteractiveTile>
				<InteractiveTile title="Moves with mouse">
					<Icon>touch_app</Icon>
					<div>Moves</div>
				</InteractiveTile>
				<InteractiveTile title="Dynamic positioning">
					<Icon>open_with</Icon>
					<div>Dynamic</div>
				</InteractiveTile>
			</div>
		</InteractionHintConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Interactive tiles with hints that follow the cursor position. Move your mouse over the tiles to see the tooltip follow your cursor."
			}
		}
	}
};

export const InteractionHintVariations: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "20px" }}>
			<div>
				<h3>Standard Hints (Fixed Position)</h3>
				<InteractionHintConfigProvider componentConfigs={{ interactiveTile: { enabled: true } }}>
					<div style={{ display: "flex", gap: "16px" }}>
						<InteractiveTile title="Standard hint with arrow">
							<Icon>info</Icon>
							<div>Hover me</div>
						</InteractiveTile>
						<InteractiveTile title="Fixed position tooltip">
							<Icon>lightbulb</Icon>
							<div>Fixed</div>
						</InteractiveTile>
					</div>
				</InteractionHintConfigProvider>
			</div>
			<div>
				<h3>Follow Cursor (Dynamic Position)</h3>
				<InteractionHintConfigProvider componentConfigs={{ interactiveTile: { enabled: true, followCursor: true } }}>
					<div style={{ display: "flex", gap: "16px" }}>
						<InteractiveTile title="Tooltip follows your mouse cursor">
							<Icon>mouse</Icon>
							<div>Move mouse</div>
						</InteractiveTile>
						<InteractiveTile title="Dynamic positioning enabled">
							<Icon>near_me</Icon>
							<div>Dynamic</div>
						</InteractiveTile>
					</div>
				</InteractionHintConfigProvider>
			</div>
			<div>
				<h3>Follow Cursor + Hide Arrow</h3>
				<InteractionHintConfigProvider
					componentConfigs={{ interactiveTile: { enabled: true, followCursor: true, hideArrow: true } }}
				>
					<div style={{ display: "flex", gap: "16px" }}>
						<InteractiveTile title="Follows cursor without arrow pointer">
							<Icon>visibility_off</Icon>
							<div>No arrow</div>
						</InteractiveTile>
						<InteractiveTile title="Clean tooltip design">
							<Icon>open_with</Icon>
							<div>Clean</div>
						</InteractiveTile>
					</div>
				</InteractionHintConfigProvider>
			</div>
			<div>
				<h3>Without Hints (Disabled)</h3>
				<div style={{ display: "flex", gap: "16px" }}>
					<InteractiveTile title="No interaction hints">
						<Icon>block</Icon>
						<div>No hints</div>
					</InteractiveTile>
					<InteractiveTile title="Default behavior">
						<Icon>disabled_by_default</Icon>
						<div>Disabled</div>
					</InteractiveTile>
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Comprehensive comparison of interaction hint configurations:\n\n- **Standard**: Fixed position tooltips with arrow\n- **Follow Cursor**: Tooltips that move with your mouse\n- **Follow Cursor + Hide Arrow**: Dynamic tooltips without arrow pointer\n- **Disabled**: No interaction hints shown\n\nHover over each tile to see the different behaviors."
			}
		}
	}
};

export const AllVariants: Story = {
	render: () => {
		const TileShowcase = () => {
			const [selectedId, setSelectedId] = useState<string | undefined>("tile-2");

			return (
				<InteractionHintConfigProvider componentConfigs={{ interactiveTile: true }}>
					<div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "20px" }}>
						<div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
							<InteractiveTile
								id="tile-1"
								title="Default tile"
								selected={selectedId === "tile-1"}
								onClick={() => setSelectedId("tile-1")}
							>
								<Icon>dashboard</Icon>
								<div>Default</div>
							</InteractiveTile>
							<InteractiveTile
								id="tile-2"
								title="Selected tile"
								selected={selectedId === "tile-2"}
								onClick={() => setSelectedId("tile-2")}
							>
								<Icon>check_circle</Icon>
								<div>Selected</div>
							</InteractiveTile>
							<InteractiveTile
								id="tile-3"
								title="Tile with meta"
								selected={selectedId === "tile-3"}
								onClick={() => setSelectedId("tile-3")}
							>
								<Icon>folder</Icon>
								<div>With Meta</div>
							</InteractiveTile>
							<InteractiveTile id="tile-4" title="Disabled tile" disabled>
								<Icon>block</Icon>
								<div>Disabled</div>
							</InteractiveTile>
						</div>
						<div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
							<InteractiveTile
								id="tile-5"
								title="Interactive tile with hint"
								selected={selectedId === "tile-5"}
								onClick={() => setSelectedId("tile-5")}
							>
								<Icon>help</Icon>
								<div>With Hint</div>
							</InteractiveTile>
						</div>
					</div>
				</InteractionHintConfigProvider>
			);
		};

		return <TileShowcase />;
	},
	parameters: {
		docs: {
			description: {
				story:
					"Comprehensive showcase of all interactive tile variants with interaction hints enabled. Click tiles to select them and hover to see tooltips."
			}
		}
	}
};
