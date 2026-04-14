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
import { useState, useEffect } from "react";

import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint-context.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view";
import { Badge } from "@com.mgmtp.a12.widgets/widgets-core/lib/badge/main/badge.view";

type StoryFn = () => React.JSX.Element;

const meta: Meta<typeof Button> = {
	title: "Widgets/General/Buttons/Button",
	component: Button,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: "select",
			options: ["button", "submit", "reset"],
			description: "Specify the type of the button"
		},
		label: {
			control: "text",
			description: "The label of the button"
		},
		title: {
			control: "text",
			description: "Tooltip shown when hovering the button"
		},
		primary: {
			control: "boolean",
			description: "Whether the button is a primary button"
		},
		secondary: {
			control: "boolean",
			description: "Whether the button is a secondary button"
		},
		destructive: {
			control: "boolean",
			description: "Whether the button represents a destructive action"
		},
		invert: {
			control: "boolean",
			description: "If true, an inverted color will be set"
		},
		block: {
			control: "boolean",
			description: "Make the button fit its parent width and height"
		},
		active: {
			control: "boolean",
			description: "Whether the button is activated"
		},
		disabled: {
			control: "boolean",
			description: "Whether the button is disabled"
		},
		vertical: {
			control: "boolean",
			description: "Aligns icon and text vertically at center"
		},
		loading: {
			control: "boolean",
			description: "Shows a progress indicator inside the button"
		},
		processedPercentage: {
			control: { type: "range", min: 0, max: 100, step: 1 },
			description: "The progressed percentage of the loading process"
		},
		labelHidden: {
			control: "boolean",
			description: "Hide the label but keep it for accessibility"
		},
		tabIndex: {
			control: "number",
			description: "The tabIndex attribute for the button"
		}
	},
	args: {
		onClick: fn(),
		onMouseOver: fn(),
		onMouseLeave: fn(),
		onMouseDown: fn(),
		onKeyDown: fn(),
		onKeyUp: fn(),
		onFocus: fn(),
		onBlur: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Button Stories
export const Default: Story = {
	args: {
		label: "Button"
	}
};

export const Primary: Story = {
	args: {
		label: "Primary Button",
		primary: true
	}
};

export const Secondary: Story = {
	args: {
		label: "Secondary Button",
		secondary: true
	}
};

export const Destructive: Story = {
	args: {
		label: "Delete",
		destructive: true
	}
};

export const DestructivePrimary: Story = {
	args: {
		label: "Delete",
		destructive: true,
		primary: true
	}
};

export const Disabled: Story = {
	args: {
		label: "Disabled Button",
		disabled: true
	}
};

export const DisabledPrimary: Story = {
	args: {
		label: "Disabled Primary",
		primary: true,
		disabled: true
	}
};

// Icon Button Stories
export const IconButton: Story = {
	args: {
		icon: <Icon>add</Icon>,
		title: "Add item"
	}
};

export const IconButtonPrimary: Story = {
	args: {
		icon: <Icon>add</Icon>,
		primary: true,
		title: "Add item"
	}
};

export const IconButtonSecondary: Story = {
	args: {
		icon: <Icon>settings</Icon>,
		secondary: true,
		title: "Settings"
	}
};

export const IconButtonDestructive: Story = {
	args: {
		icon: <Icon>delete</Icon>,
		destructive: true,
		title: "Delete"
	}
};

// Button with Icon and Label
export const ButtonWithIcon: Story = {
	args: {
		label: "Add Item",
		icon: <Icon>add</Icon>
	}
};

export const ButtonWithIconPrimary: Story = {
	args: {
		label: "Save",
		icon: <Icon>save</Icon>,
		primary: true
	}
};

export const ButtonWithIconDestructive: Story = {
	args: {
		label: "Delete",
		icon: <Icon>delete</Icon>,
		destructive: true
	}
};

// Loading States
export const Loading: Story = {
	args: {
		label: "Loading...",
		loading: true,
		processedPercentage: 0
	}
};

export const LoadingPrimary: Story = {
	args: {
		label: "Saving...",
		loading: true,
		primary: true,
		processedPercentage: 0
	}
};

export const LoadingWithProgress: Story = {
	args: {
		label: "Downloading...",
		loading: true,
		processedPercentage: 65
	}
};

export const LoadingAnimatedProgress: Story = {
	render: () => {
		const AnimatedButton = () => {
			const [progress, setProgress] = useState(0);
			const [isLoading, setIsLoading] = useState(true);

			useEffect(() => {
				if (!isLoading) {
					return;
				}

				const interval = setInterval(() => {
					setProgress((prev) => {
						if (prev >= 100) {
							setIsLoading(false);

							return 100;
						}

						return prev + 5;
					});
				}, 200);

				return () => clearInterval(interval);
			}, [isLoading]);

			const handleReset = () => {
				setProgress(0);
				setIsLoading(true);
			};

			return (
				<div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
					<Button
						label={isLoading ? `Uploading... ${progress}%` : "Upload Complete!"}
						loading={isLoading}
						processedPercentage={progress}
						primary
					/>
					{!isLoading && <Button label="Reset" onClick={handleReset} />}
				</div>
			);
		};

		return <AnimatedButton />;
	}
};

// Active State
export const Active: Story = {
	args: {
		label: "Active Button",
		active: true
	}
};

// Block Button
export const Block: Story = {
	args: {
		label: "Block Button",
		block: true
	},
	decorators: [
		(Story: StoryFn) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	]
};

export const BlockPrimary: Story = {
	args: {
		label: "Block Primary Button",
		block: true,
		primary: true
	},
	decorators: [
		(Story: StoryFn) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	]
};

// Vertical Layout
export const Vertical: Story = {
	args: {
		label: "Vertical",
		icon: <Icon>home</Icon>,
		vertical: true
	}
};

// Inverted Button (for dark backgrounds)
export const InvertedPrimary: Story = {
	args: {
		label: "Inverted Primary",
		primary: true,
		invert: true
	},
	decorators: [
		(Story: StoryFn) => (
			<div style={{ backgroundColor: "#333", padding: "20px", borderRadius: "4px" }}>
				<Story />
			</div>
		)
	]
};

export const InvertedSecondary: Story = {
	args: {
		label: "Inverted Secondary",
		secondary: true,
		invert: true
	},
	decorators: [
		(Story: StoryFn) => (
			<div style={{ backgroundColor: "#333", padding: "20px", borderRadius: "4px" }}>
				<Story />
			</div>
		)
	]
};

// Button Types
export const SubmitButton: Story = {
	args: {
		label: "Submit",
		type: "submit",
		primary: true
	}
};

export const ResetButton: Story = {
	args: {
		label: "Reset",
		type: "reset"
	}
};

// With Badge (Icon Button)
export const IconButtonWithBadge: Story = {
	args: {
		icon: <Icon>notifications</Icon>,
		badge: "5",
		title: "Notifications"
	}
};

// Hidden Label
export const HiddenLabel: Story = {
	args: {
		label: "Settings",
		icon: <Icon>settings</Icon>,
		labelHidden: true
	}
};

// All Variants Overview
export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Default:</span>
				<Button label="Default" />
				<Button label="Disabled" disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Primary:</span>
				<Button label="Primary" primary />
				<Button label="Disabled" primary disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Secondary:</span>
				<Button label="Secondary" secondary />
				<Button label="Disabled" secondary disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Destructive:</span>
				<Button label="Destructive" destructive />
				<Button label="Primary" destructive primary />
				<Button label="Disabled" destructive disabled />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>With Icon:</span>
				<Button label="Save" icon={<Icon>save</Icon>} />
				<Button label="Save" icon={<Icon>save</Icon>} primary />
				<Button label="Delete" icon={<Icon>delete</Icon>} destructive />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Icon Only:</span>
				<Button icon={<Icon>add</Icon>} title="Add" />
				<Button icon={<Icon>add</Icon>} title="Add" primary />
				<Button icon={<Icon>add</Icon>} title="Add" secondary />
				<Button icon={<Icon>delete</Icon>} title="Delete" destructive />
			</div>
			<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
				<span style={{ width: "120px" }}>Loading:</span>
				<Button label="Loading" loading processedPercentage={0} />
				<Button label="Loading" loading primary processedPercentage={0} />
				<Button label="65%" loading processedPercentage={65} />
			</div>
		</div>
	)
};

// Button with Badge Examples
export const ButtonWithBadge: Story = {
	args: {
		label: "Messages",
		icon: <Icon>mail</Icon>,
		badge: <Badge tiny variant="error" />,
		title: "View messages"
	}
};

export const PrimaryButtonWithBadge: Story = {
	args: {
		label: "Notifications",
		icon: <Icon>notifications</Icon>,
		badge: <Badge tiny variant="warning" />,
		primary: true,
		title: "View notifications"
	}
};

export const SecondaryButtonWithBadge: Story = {
	args: {
		label: "Tasks",
		icon: <Icon>assignment</Icon>,
		badge: <Badge tiny variant="info" />,
		secondary: true,
		title: "View tasks"
	}
};

export const DestructiveButtonWithBadge: Story = {
	args: {
		label: "Alerts",
		icon: <Icon>warning</Icon>,
		badge: <Badge tiny variant="error" />,
		destructive: true,
		title: "View alerts"
	}
};

export const IconOnlyButtonWithBadge: Story = {
	args: {
		icon: <Icon>notifications</Icon>,
		badge: <Badge tiny variant="warning" />,
		title: "Notifications"
	}
};

export const IconOnlyPrimaryWithBadge: Story = {
	args: {
		icon: <Icon>mail</Icon>,
		badge: <Badge tiny variant="error" />,
		primary: true,
		title: "Messages"
	}
};

// Interaction Hint Examples
export const ButtonWithInteractionHint: Story = {
	render: () => (
		<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ button: true }}>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<Button label="Hover me" title="This button has an interaction hint" />
				<Button label="Primary" primary title="Primary button with hint" />
				<Button icon={<Icon>settings</Icon>} title="Settings" />
			</div>
		</InteractionHintConfigProvider>
	)
};

export const ButtonWithInteractionHintFollowCursor: Story = {
	render: () => (
		<InteractionHintConfigProvider enableInteractionHint followCursor componentConfigs={{ button: true }}>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<Button label="Follow Cursor" title="This hint follows your cursor" />
				<Button label="Primary" primary title="Hint follows cursor" />
				<Button icon={<Icon>help</Icon>} secondary title="Help" />
			</div>
		</InteractionHintConfigProvider>
	)
};

export const ButtonWithInteractionHintNoArrow: Story = {
	render: () => (
		<InteractionHintConfigProvider enableInteractionHint hideArrow componentConfigs={{ button: true }}>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<Button label="No Arrow" title="This hint has no arrow" />
				<Button icon={<Icon>info</Icon>} title="Info button" />
				<Button label="Delete" destructive title="Delete action" />
			</div>
		</InteractionHintConfigProvider>
	)
};

export const ButtonWithBadgeAndInteractionHint: Story = {
	render: () => (
		<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ button: true }}>
			<div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
				<Button
					label="Messages"
					icon={<Icon>mail</Icon>}
					badge={<Badge tiny variant="error" />}
					title="View new messages"
				/>
				<Button
					icon={<Icon>notifications</Icon>}
					badge={<Badge tiny variant="warning" />}
					primary
					title="View notifications"
				/>
				<Button
					label="Alerts"
					icon={<Icon>warning</Icon>}
					badge={<Badge tiny variant="error" />}
					destructive
					title="View alerts"
				/>
			</div>
		</InteractionHintConfigProvider>
	)
};

export const IconButtonWithInteractionHint: Story = {
	render: () => (
		<InteractionHintConfigProvider componentConfigs={{ iconButton: true }}>
			<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
				<Button icon={<Icon>add</Icon>} title="Add item" />
				<Button icon={<Icon>edit</Icon>} primary title="Edit" />
				<Button icon={<Icon>delete</Icon>} destructive title="Delete" />
				<Button icon={<Icon>settings</Icon>} secondary title="Settings" />
			</div>
		</InteractionHintConfigProvider>
	)
};
