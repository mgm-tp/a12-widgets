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

import { Tooltip, Button, Icon, Link } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Tooltip> = {
	title: "Data Display/Tooltip",
	component: Tooltip,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	argTypes: {
		text: {
			control: "text",
			description: "The text to display when hovering over the element"
		},
		variant: {
			control: "select",
			options: [undefined, "success", "hint", "error", "warning"],
			description: "Variant of tooltip"
		},
		disabled: {
			control: "boolean",
			description: "Disable the tooltip"
		},
		invert: {
			control: "boolean",
			description: "Inverted style for dark backgrounds"
		},
		useDesktopView: {
			control: "boolean",
			description: "Use desktop view on mobile devices"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		text: "This is a tooltip"
	},
	render: (args) => (
		<Tooltip {...args}>
			<Button label="Hover me" />
		</Tooltip>
	)
};

export const OnIcon: Story = {
	args: {
		text: "Information about this feature"
	},
	render: (args) => (
		<Tooltip {...args}>
			<Icon>info</Icon>
		</Tooltip>
	)
};

export const OnLink: Story = {
	args: {
		text: "Click to navigate to the homepage"
	},
	render: (args) => (
		<Tooltip {...args}>
			<Link href="#">Home Page</Link>
		</Tooltip>
	)
};

export const SuccessVariant: Story = {
	args: {
		text: "Operation completed successfully!",
		variant: "success"
	},
	render: (args) => (
		<Tooltip {...args}>
			<Button label="Success" icon={<Icon>check</Icon>} />
		</Tooltip>
	)
};

export const HintVariant: Story = {
	args: {
		text: "Here's a helpful hint for you",
		variant: "hint"
	},
	render: (args) => (
		<Tooltip {...args}>
			<Button label="Hint" icon={<Icon>lightbulb</Icon>} />
		</Tooltip>
	)
};

export const WarningVariant: Story = {
	args: {
		text: "Please review before proceeding",
		variant: "warning"
	},
	render: (args) => (
		<Tooltip {...args}>
			<Button label="Warning" icon={<Icon>warning</Icon>} />
		</Tooltip>
	)
};

export const ErrorVariant: Story = {
	args: {
		text: "An error occurred. Please try again.",
		variant: "error"
	},
	render: (args) => (
		<Tooltip {...args}>
			<Button label="Error" icon={<Icon>error</Icon>} destructive />
		</Tooltip>
	)
};

export const Disabled: Story = {
	args: {
		text: "This tooltip is disabled",
		disabled: true
	},
	render: (args) => (
		<Tooltip {...args}>
			<Button label="Hover me (disabled tooltip)" />
		</Tooltip>
	)
};

export const LongText: Story = {
	args: {
		text: "This is a much longer tooltip text that provides detailed information about the element. It can span multiple lines and contain extensive explanations."
	},
	render: (args) => (
		<Tooltip {...args}>
			<Button label="Long Tooltip" />
		</Tooltip>
	)
};

export const WithRichContent: Story = {
	args: {
		text: (
			<div>
				<strong>Title</strong>
				<p style={{ margin: "4px 0 0 0" }}>Description with more details</p>
			</div>
		)
	},
	render: (args) => (
		<Tooltip {...args}>
			<Button label="Rich Content" />
		</Tooltip>
	)
};

export const Inverted: Story = {
	args: {
		text: "Inverted tooltip for dark backgrounds",
		variant: "hint",
		invert: true
	},
	render: (args) => (
		<div style={{ backgroundColor: "#333", padding: "20px", borderRadius: "4px" }}>
			<Tooltip {...args}>
				<Button label="Inverted" primary invert />
			</Tooltip>
		</div>
	)
};

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
			<Tooltip text="Default tooltip">
				<Button label="Default" />
			</Tooltip>
			<Tooltip text="Success message" variant="success">
				<Button label="Success" />
			</Tooltip>
			<Tooltip text="Helpful hint" variant="hint">
				<Button label="Hint" />
			</Tooltip>
			<Tooltip text="Warning message" variant="warning">
				<Button label="Warning" />
			</Tooltip>
			<Tooltip text="Error message" variant="error">
				<Button label="Error" />
			</Tooltip>
		</div>
	)
};
