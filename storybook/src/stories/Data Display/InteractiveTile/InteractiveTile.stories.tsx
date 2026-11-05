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

import { InteractiveTile, Icon, InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof InteractiveTile> = {
	title: "Data Display/InteractiveTile",
	component: InteractiveTile,
	parameters: {
		layout: "centered"
	},
	argTypes: {
		title: {
			control: "text",
			description: "Title attribute shown when hovering the tile"
		},
		primary: {
			control: "boolean",
			description: "Styles the tile as a primary tile"
		},
		secondary: {
			control: "boolean",
			description: "Styles the tile as a secondary tile (the default when neither `primary` nor `secondary` is set)"
		},
		active: {
			control: "boolean",
			description: "Highlights the tile: background color on a `primary` tile, text color on a `secondary` tile"
		},
		selected: {
			control: "boolean",
			description: "Marks the tile as selected — a checkmark icon appears in its top-right corner"
		},
		disabled: {
			control: "boolean",
			description: "Disables the tile so it no longer reacts to clicks or keyboard input"
		},
		tabIndex: {
			control: "number",
			description: "The `tabIndex` attribute for the tile"
		},
		disableAriaLabel: {
			control: "boolean",
			description:
				"Disables the `aria-label` attribute; with interaction hints enabled, a hidden text for the title is rendered instead"
		},
		onClick: {
			action: "clicked",
			description: "Click handler for the tile"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		title: "Interactive Tile",
		selected: false,
		disabled: false
	},
	render: (args) => (
		<InteractiveTile {...args}>
			<Icon>dashboard</Icon>
			<div>Dashboard</div>
		</InteractiveTile>
	)
};

export const Variants: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
			<InteractiveTile title="Primary tile" primary>
				<Icon>star</Icon>
				<div>Primary</div>
			</InteractiveTile>
			<InteractiveTile title="Primary active tile" primary active>
				<Icon>star</Icon>
				<div>Primary active</div>
			</InteractiveTile>
			<InteractiveTile title="Secondary tile" secondary>
				<Icon>star_outline</Icon>
				<div>Secondary</div>
			</InteractiveTile>
			<InteractiveTile title="Secondary active tile" secondary active>
				<Icon>star_outline</Icon>
				<div>Secondary active</div>
			</InteractiveTile>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`primary` and `secondary` select the tile style; without either flag the tile is styled as secondary. `active` highlights the tile — via the background color on a primary tile and via the text color on a secondary tile."
			}
		}
	}
};

export const States: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
			<InteractiveTile title="Default tile">
				<Icon>dashboard</Icon>
				<div>Default</div>
			</InteractiveTile>
			<InteractiveTile title="Selected tile" selected>
				<Icon>check_circle</Icon>
				<div>Selected</div>
			</InteractiveTile>
			<InteractiveTile title="Disabled tile" disabled>
				<Icon>block</Icon>
				<div>Disabled</div>
			</InteractiveTile>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`selected` adds a checkmark icon to the top-right corner of the tile, while `disabled` blocks all mouse and keyboard interaction."
			}
		}
	}
};

export const Selection: Story = {
	render: function SelectionExample() {
		const [selectedId, setSelectedId] = useState<string | undefined>("1");

		return (
			<div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"Tiles are controlled: combine `onClick` with the `selected` prop to implement single selection across a group of tiles."
			}
		}
	}
};

export const WithInteractionHint: Story = {
	render: () => (
		<InteractionHintConfigProvider componentConfigs={{ interactiveTile: true }}>
			<div style={{ display: "flex", gap: "16px", padding: "20px", flexWrap: "wrap" }}>
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
					"Wrapping tiles in an `InteractionHintConfigProvider` with `interactiveTile` enabled shows the `title` as a tooltip. Hover over or focus the tiles to see the hints."
			}
		}
	}
};
