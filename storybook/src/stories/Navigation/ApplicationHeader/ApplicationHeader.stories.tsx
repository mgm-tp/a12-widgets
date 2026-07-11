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

import { ApplicationHeader, Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ApplicationHeader> = {
	title: "Navigation/ApplicationHeader",
	component: ApplicationHeader,
	parameters: {
		layout: "fullscreen"
	},
	tags: ["autodocs"],
	argTypes: {
		leftSlots: {
			description: "Elements placed on the left side — typically the application logo and name"
		},
		rightSlots: {
			description: "Elements placed on the right side — typically version info, user info, or action buttons"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		leftSlots: [<span key="logo">Logo</span>, <span key="name">My Application</span>],
		rightSlots: [<span key="version">Version: 1.0.0</span>]
	}
};

export const Basic: Story = {
	args: {
		leftSlots: [<span key="logo">Logo</span>, <span key="name">My Application</span>],
		rightSlots: [<span key="version">Version: 1.0.0</span>]
	},
	parameters: {
		docs: {
			description: {
				story:
					"Basic application header with a logo and application name on the left, and a version indicator on the right."
			}
		}
	}
};

export const WithActions: Story = {
	args: {
		leftSlots: [
			<Button key="menu" icon={<Icon>menu</Icon>} title="Toggle navigation" invert />,
			<span key="name" style={{ color: "white", fontWeight: "bold" }}>
				My Application
			</span>
		],
		rightSlots: [
			<span key="user" style={{ color: "white" }}>
				John Doe
			</span>,
			<Button key="logout" icon={<Icon>logout</Icon>} title="Log out" invert />
		]
	},
	parameters: {
		docs: {
			description: {
				story: "Application header with a hamburger menu button and user info with a logout action."
			}
		}
	}
};

export const LogoOnly: Story = {
	args: {
		leftSlots: [<span key="logo">Logo</span>]
	},
	parameters: {
		docs: {
			description: {
				story: "Minimal application header with only a logo in the left slot and no right slots."
			}
		}
	}
};

export const WithMultipleActions: Story = {
	args: {
		leftSlots: [
			<Button key="menu" icon={<Icon>menu</Icon>} title="Toggle navigation" invert />,
			<span key="name" style={{ color: "white", fontWeight: "bold" }}>
				Enterprise Suite
			</span>
		],
		rightSlots: [
			<Button key="notifications" icon={<Icon>notifications</Icon>} title="Notifications" invert />,
			<Button key="settings" icon={<Icon>settings</Icon>} title="Settings" invert />,
			<Button key="account" icon={<Icon>account_circle</Icon>} title="Account" invert />,
			<Button key="logout" icon={<Icon>logout</Icon>} title="Log out" invert />
		]
	},
	parameters: {
		docs: {
			description: {
				story: "Application header with multiple action buttons in the right slot, typical for enterprise applications."
			}
		}
	}
};
