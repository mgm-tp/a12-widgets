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

import { Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Icon> = {
	title: "General/Icon",
	component: Icon,
	parameters: {
		layout: "centered"
	},
	argTypes: {
		children: {
			control: "text",
			description: "The icon name from Material Symbols"
		},
		title: {
			control: "text",
			description: "Specifies the title attribute for the icon"
		},
		hiddenText: {
			control: "text",
			description:
				"Screen-reader text for the icon. Defaults to `title`; set to an empty string to render no hidden text"
		},
		showTitleAsTooltip: {
			control: "boolean",
			description:
				"If true (default), the title is shown as a tooltip; otherwise it stays readable by screen readers only"
		},
		iconTheme: {
			control: "select",
			options: ["filled", "outlined", "rounded", "custom"],
			description: "Icon theme to use for rendering the icon"
		},
		size: {
			control: "select",
			options: ["medium", "big"],
			description: "Defines the font-size of the icon"
		},
		variant: {
			control: "select",
			options: [undefined, "info", "success", "warning", "error"],
			description: "Semantic color variant of the icon"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		children: "home",
		title: "Home"
	}
};

export const WithTitle: Story = {
	args: {
		children: "settings",
		title: "Settings"
	},
	parameters: {
		docs: {
			description: {
				story:
					"`title` adds a tooltip and an accessible name. Set `showTitleAsTooltip` to `false` to keep the name for screen readers without showing the tooltip."
			}
		}
	}
};

export const IconThemes: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
				<span style={{ width: "100px" }}>Filled:</span>
				<Icon iconTheme="filled">favorite</Icon>
				<Icon iconTheme="filled">star</Icon>
				<Icon iconTheme="filled">home</Icon>
			</div>
			<div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
				<span style={{ width: "100px" }}>Outlined:</span>
				<Icon iconTheme="outlined">favorite</Icon>
				<Icon iconTheme="outlined">star</Icon>
				<Icon iconTheme="outlined">home</Icon>
			</div>
			<div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
				<span style={{ width: "100px" }}>Rounded:</span>
				<Icon iconTheme="rounded">favorite</Icon>
				<Icon iconTheme="rounded">star</Icon>
				<Icon iconTheme="rounded">home</Icon>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`iconTheme` selects the Material Symbols style: `filled` (default), `outlined` or `rounded`. A `custom` theme is also available for project-specific icon implementations."
			}
		}
	}
};

export const Sizes: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
			<Icon size="medium" title="Medium">
				star
			</Icon>
			<Icon size="big" title="Big">
				star
			</Icon>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "`size` defines the font-size of the icon: `medium` (default) or `big`."
			}
		}
	}
};

export const Variants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
				<span style={{ width: "100px" }}>Default:</span>
				<Icon>info</Icon>
				<Icon>check_circle</Icon>
				<Icon>warning</Icon>
				<Icon>error</Icon>
			</div>
			<div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
				<span style={{ width: "100px" }}>Info:</span>
				<Icon variant="info">info</Icon>
			</div>
			<div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
				<span style={{ width: "100px" }}>Success:</span>
				<Icon variant="success">check_circle</Icon>
			</div>
			<div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
				<span style={{ width: "100px" }}>Warning:</span>
				<Icon variant="warning">warning</Icon>
			</div>
			<div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
				<span style={{ width: "100px" }}>Error:</span>
				<Icon variant="error">error</Icon>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`variant` applies a semantic color: `info`, `success`, `warning` or `error`. Without a variant the icon inherits the surrounding text color."
			}
		}
	}
};

export const CommonIcons: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
			<Icon title="Home">home</Icon>
			<Icon title="Settings">settings</Icon>
			<Icon title="Search">search</Icon>
			<Icon title="Add">add</Icon>
			<Icon title="Delete">delete</Icon>
			<Icon title="Edit">edit</Icon>
			<Icon title="Save">save</Icon>
			<Icon title="Close">close</Icon>
			<Icon title="Menu">menu</Icon>
			<Icon title="More">more_vert</Icon>
			<Icon title="Notifications">notifications</Icon>
			<Icon title="Person">person</Icon>
			<Icon title="Favorite">favorite</Icon>
			<Icon title="Star">star</Icon>
			<Icon title="Check">check</Icon>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "A selection of frequently used Material Symbols names passed as `children`."
			}
		}
	}
};
