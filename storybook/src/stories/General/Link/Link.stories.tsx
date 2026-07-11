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
import { fn } from "storybook/test";

import { Link, InteractionHintConfigProvider, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Link> = {
	title: "General/Link",
	component: Link,
	decorators: [
		(Story) => (
			<InteractionHintConfigProvider componentConfigs={{ link: { enabled: true } }}>
				<Story />
			</InteractionHintConfigProvider>
		)
	],
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	argTypes: {
		children: {
			control: "text",
			description: "The link text content"
		},
		href: {
			control: "text",
			description: "Specifies the linked document, resource, or location"
		},
		title: {
			control: "text",
			description: "Title of the link"
		},
		target: {
			control: "select",
			options: ["_self", "_blank", "_parent", "_top"],
			description: "Specifies where to open the linked document"
		},
		useAsButton: {
			control: "boolean",
			description: "If set to true, a role='button' will be added"
		}
	},
	args: {
		onClick: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Click here",
		href: "#"
	}
};

export const WithTitle: Story = {
	args: {
		children: "Hover for tooltip",
		href: "#",
		title: "This is a tooltip"
	}
};

export const ExternalLink: Story = {
	args: {
		children: "Open in new tab",
		href: "https://example.com",
		target: "_blank"
	}
};

export const UseAsButton: Story = {
	args: {
		children: "Click me (button behavior)",
		useAsButton: true
	}
};

export const WithCustomContent: Story = {
	args: {
		children: <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>📧 Contact Us</span>,
		href: "#"
	}
};

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
			<Link href="#">Default Link</Link>
			<Link href="#" title="With tooltip">
				Link with Title
			</Link>
			<Link href="https://example.com" target="_blank">
				External Link (opens in new tab)
			</Link>
			<Link useAsButton onClick={() => alert("Clicked!")}>
				Link as Button
			</Link>
		</div>
	)
};

export const WithInteractionHint: Story = {
	args: {
		children: "Link with Hint",
		title: "Click to navigate",
		href: "#"
	},
	parameters: {
		docs: {
			description: {
				story: "Interaction hints are enabled through InteractionHintConfigProvider using the new API."
			}
		}
	}
};

export const WithInteractionHintFollowCursor: Story = {
	decorators: [
		(Story) => (
			<InteractionHintConfigProvider componentConfigs={{ link: { enabled: true, followCursor: true } }}>
				<Story />
			</InteractionHintConfigProvider>
		)
	],
	args: {
		children: "Hint Follows Cursor",
		title: "This hint follows the cursor",
		href: "#"
	}
};

export const WithInteractionHintNoArrow: Story = {
	decorators: [
		(Story) => (
			<InteractionHintConfigProvider componentConfigs={{ link: { enabled: true, hideArrow: true } }}>
				<Story />
			</InteractionHintConfigProvider>
		)
	],
	args: {
		children: "Hint Without Arrow",
		href: "#",
		title: "Hint without arrow"
	}
};

export const InteractionHintVariations: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
			<div>
				<Typography.Headline level={3}>Basic Hint</Typography.Headline>
				<InteractionHintConfigProvider componentConfigs={{ link: { enabled: true } }}>
					<Link href="#" title="Basic interaction hint">
						Hover for hint
					</Link>
				</InteractionHintConfigProvider>
			</div>
			<div>
				<Typography.Headline level={3}>Follow Cursor</Typography.Headline>
				<InteractionHintConfigProvider componentConfigs={{ link: { enabled: true, followCursor: true } }}>
					<Link href="#" title="This hint follows your cursor">
						Follow cursor hint
					</Link>
				</InteractionHintConfigProvider>
			</div>
			<div>
				<Typography.Headline level={3}>No Arrow</Typography.Headline>
				<InteractionHintConfigProvider componentConfigs={{ link: { enabled: true, hideArrow: true } }}>
					<Link href="#" title="Hint without arrow">
						Hint without arrow
					</Link>
				</InteractionHintConfigProvider>
			</div>
		</div>
	)
};
