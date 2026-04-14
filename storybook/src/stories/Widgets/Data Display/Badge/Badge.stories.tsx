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
import { useState, useEffect } from "react";

import { Badge, Icon, Button } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Badge> = {
	title: "Widgets/Data Display/Badge",
	component: Badge,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	argTypes: {
		count: {
			control: { type: "number", min: 0, max: 10000 },
			description: "Number to show in badge"
		},
		overflowCount: {
			control: { type: "number", min: 1, max: 9999 },
			description: "Max count to show"
		},
		variant: {
			control: "select",
			options: ["info", "success", "warning", "error"],
			description: "Variant will decide the Badge color"
		},
		light: {
			control: "boolean",
			description: "This property combines with variants to use light colors"
		},
		hidden: {
			control: "boolean",
			description: "Hides the badge"
		},
		standalone: {
			control: "boolean",
			description: "Makes the Badge a standalone element"
		},
		tiny: {
			control: "boolean",
			description: "Makes the Badge become a tiny version"
		},
		title: {
			control: "text",
			description: "Title attribute for the badge"
		},
		animationTimeout: {
			control: { type: "number", min: 0, max: 1000 },
			description: "Timeout for animation in milliseconds"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		count: 5
	},
	render: (args) => (
		<div style={{ position: "relative", display: "inline-block", padding: "10px" }}>
			<Icon>notifications</Icon>
			<Badge {...args} />
		</div>
	)
};

export const InfoVariant: Story = {
	args: {
		count: 3,
		variant: "info"
	},
	render: (args) => (
		<div style={{ position: "relative", display: "inline-block", padding: "10px" }}>
			<Icon>mail</Icon>
			<Badge {...args} />
		</div>
	)
};

export const SuccessVariant: Story = {
	args: {
		count: 7,
		variant: "success"
	},
	render: (args) => (
		<div style={{ position: "relative", display: "inline-block", padding: "10px" }}>
			<Icon>check_circle</Icon>
			<Badge {...args} />
		</div>
	)
};

export const WarningVariant: Story = {
	args: {
		count: 2,
		variant: "warning"
	},
	render: (args) => (
		<div style={{ position: "relative", display: "inline-block", padding: "10px" }}>
			<Icon>warning</Icon>
			<Badge {...args} />
		</div>
	)
};

export const ErrorVariant: Story = {
	args: {
		count: 9,
		variant: "error"
	},
	render: (args) => (
		<div style={{ position: "relative", display: "inline-block", padding: "10px" }}>
			<Icon>error</Icon>
			<Badge {...args} />
		</div>
	)
};

export const LightVariant: Story = {
	args: {
		count: 5,
		variant: "info",
		light: true
	},
	render: (args) => (
		<div style={{ position: "relative", display: "inline-block", padding: "10px" }}>
			<Icon>notifications</Icon>
			<Badge {...args} />
		</div>
	)
};

export const WithOverflow: Story = {
	args: {
		count: 150,
		overflowCount: 99
	},
	render: (args) => (
		<div style={{ position: "relative", display: "inline-block", padding: "10px" }}>
			<Icon>mail</Icon>
			<Badge {...args} />
		</div>
	)
};

export const Standalone: Story = {
	args: {
		count: 42,
		standalone: true,
		variant: "info"
	}
};

export const StandaloneVariants: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "16px" }}>
			<Badge count={5} standalone variant="info" />
			<Badge count={10} standalone variant="success" />
			<Badge count={3} standalone variant="warning" />
			<Badge count={99} standalone variant="error" />
		</div>
	)
};

export const Tiny: Story = {
	args: {
		tiny: true,
		variant: "error"
	},
	render: (args) => (
		<div style={{ position: "relative", display: "inline-block", padding: "10px" }}>
			<Icon>person</Icon>
			<Badge {...args} />
		</div>
	)
};

export const Hidden: Story = {
	render: () => {
		const ToggleBadge = () => {
			const [hidden, setHidden] = useState(false);

			return (
				<div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
					<div style={{ position: "relative", display: "inline-block", padding: "10px" }}>
						<Icon>notifications</Icon>
						<Badge count={5} hidden={hidden} variant="error" />
					</div>
					<Button label={hidden ? "Show Badge" : "Hide Badge"} onClick={() => setHidden(!hidden)} />
				</div>
			);
		};

		return <ToggleBadge />;
	}
};

export const Animated: Story = {
	render: () => {
		const AnimatedBadge = () => {
			const [count, setCount] = useState(0);

			useEffect(() => {
				const interval = setInterval(() => {
					setCount((prev) => (prev >= 10 ? 0 : prev + 1));
				}, 1000);

				return () => clearInterval(interval);
			}, []);

			return (
				<div style={{ position: "relative", display: "inline-block", padding: "10px" }}>
					<Icon>notifications</Icon>
					<Badge count={count} variant="error" animationTimeout={250} />
				</div>
			);
		};

		return <AnimatedBadge />;
	}
};

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
			<div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
				<span style={{ width: "80px" }}>Normal:</span>
				{(["info", "success", "warning", "error"] as const).map((variant) => (
					<div key={variant} style={{ position: "relative", display: "inline-block", padding: "10px" }}>
						<Icon>notifications</Icon>
						<Badge count={5} variant={variant} />
					</div>
				))}
			</div>
			<div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
				<span style={{ width: "80px" }}>Light:</span>
				{(["info", "success", "warning", "error"] as const).map((variant) => (
					<div key={variant} style={{ position: "relative", display: "inline-block", padding: "10px" }}>
						<Icon>notifications</Icon>
						<Badge count={5} variant={variant} light />
					</div>
				))}
			</div>
			<div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
				<span style={{ width: "80px" }}>Tiny:</span>
				{(["info", "success", "warning", "error"] as const).map((variant) => (
					<div key={variant} style={{ position: "relative", display: "inline-block", padding: "10px" }}>
						<Icon>notifications</Icon>
						<Badge tiny variant={variant} />
					</div>
				))}
			</div>
			<div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
				<span style={{ width: "80px" }}>Standalone:</span>
				{(["info", "success", "warning", "error"] as const).map((variant) => (
					<Badge key={variant} count={5} standalone variant={variant} />
				))}
			</div>
		</div>
	)
};
