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
	tags: ["autodocs"],
	argTypes: {
		children: {
			control: "text",
			description: "The icon name from Material Symbols"
		},
		title: {
			control: "text",
			description: "Specifies the title attribute for the icon"
		},
		showTitleAsTooltip: {
			control: "boolean",
			description: "If true, the title will be shown as a tooltip"
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
			description: "Variant of the icon"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "home"
	}
};

export const WithTitle: Story = {
	args: {
		children: "settings",
		title: "Settings"
	}
};

export const Filled: Story = {
	args: {
		children: "favorite",
		iconTheme: "filled"
	}
};

export const Outlined: Story = {
	args: {
		children: "favorite",
		iconTheme: "outlined"
	}
};

export const Rounded: Story = {
	args: {
		children: "favorite",
		iconTheme: "rounded"
	}
};

export const MediumSize: Story = {
	args: {
		children: "star",
		size: "medium"
	}
};

export const BigSize: Story = {
	args: {
		children: "star",
		size: "big"
	}
};

export const InfoVariant: Story = {
	args: {
		children: "info",
		variant: "info"
	}
};

export const SuccessVariant: Story = {
	args: {
		children: "check_circle",
		variant: "success"
	}
};

export const WarningVariant: Story = {
	args: {
		children: "warning",
		variant: "warning"
	}
};

export const ErrorVariant: Story = {
	args: {
		children: "error",
		variant: "error"
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
	)
};

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<span style={{ width: "100px" }}>Default:</span>
				<Icon>info</Icon>
				<Icon>check_circle</Icon>
				<Icon>warning</Icon>
				<Icon>error</Icon>
			</div>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<span style={{ width: "100px" }}>Info:</span>
				<Icon variant="info">info</Icon>
			</div>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<span style={{ width: "100px" }}>Success:</span>
				<Icon variant="success">check_circle</Icon>
			</div>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<span style={{ width: "100px" }}>Warning:</span>
				<Icon variant="warning">warning</Icon>
			</div>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<span style={{ width: "100px" }}>Error:</span>
				<Icon variant="error">error</Icon>
			</div>
		</div>
	)
};

export const IconThemes: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<span style={{ width: "100px" }}>Filled:</span>
				<Icon iconTheme="filled">favorite</Icon>
				<Icon iconTheme="filled">star</Icon>
				<Icon iconTheme="filled">home</Icon>
			</div>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<span style={{ width: "100px" }}>Outlined:</span>
				<Icon iconTheme="outlined">favorite</Icon>
				<Icon iconTheme="outlined">star</Icon>
				<Icon iconTheme="outlined">home</Icon>
			</div>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<span style={{ width: "100px" }}>Rounded:</span>
				<Icon iconTheme="rounded">favorite</Icon>
				<Icon iconTheme="rounded">star</Icon>
				<Icon iconTheme="rounded">home</Icon>
			</div>
		</div>
	)
};
