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

import { Icon, Button } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Button> = {
	title: "General/Buttons/Button",
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
