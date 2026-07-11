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
import { fn } from "storybook/test";

import { Radio } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Radio> = {
	title: "Data Entry/Radio",
	component: Radio,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "text",
			description: "The currently selected item value"
		},
		inline: {
			control: "boolean",
			description: "Display radio items in a single row instead of stacked vertically"
		},
		disabled: {
			control: "boolean",
			description: "Disable all radio items in the group"
		},
		readonly: {
			control: "boolean",
			description: "Render the radio group as read-only"
		},
		error: {
			control: "boolean",
			description: "Show the radio group in an error state"
		},
		warning: {
			control: "boolean",
			description: "Show the radio group in a warning state"
		},
		label: {
			control: "text",
			description: "Label for the radio group"
		},
		errorMessage: {
			control: "text",
			description: "Error message shown below the group"
		},
		warningMessage: {
			control: "text",
			description: "Warning message shown below the group"
		},
		infoMessage: {
			control: "text",
			description: "Info message shown below the group"
		}
	},
	args: {
		onValueChanged: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		id: "default-radio",
		label: "Preferred contact method",
		value: undefined,
		children: (
			<>
				<Radio.Item label="Email" value="email" />
				<Radio.Item label="Phone" value="phone" />
				<Radio.Item label="Post" value="post" />
			</>
		)
	}
};

export const WithSelection: Story = {
	args: {
		id: "selected-radio",
		label: "Shipping speed",
		value: "standard",
		children: (
			<>
				<Radio.Item label="Standard (3–5 days)" value="standard" />
				<Radio.Item label="Express (1–2 days)" value="express" />
				<Radio.Item label="Overnight" value="overnight" />
			</>
		)
	}
};

export const Inline: Story = {
	args: {
		id: "inline-radio",
		label: "Size",
		value: "m",
		inline: true,
		children: (
			<>
				<Radio.Item label="S" value="s" />
				<Radio.Item label="M" value="m" />
				<Radio.Item label="L" value="l" />
				<Radio.Item label="XL" value="xl" />
			</>
		)
	}
};

export const WithDisabledItem: Story = {
	args: {
		id: "partial-disabled-radio",
		label: "Subscription plan",
		value: "basic",
		children: (
			<>
				<Radio.Item label="Basic" value="basic" />
				<Radio.Item label="Pro" value="pro" />
				<Radio.Item label="Enterprise (contact sales)" value="enterprise" disabled />
			</>
		)
	}
};

export const Disabled: Story = {
	args: {
		id: "disabled-radio",
		label: "Disabled group",
		value: "option1",
		disabled: true,
		children: (
			<>
				<Radio.Item label="Option 1" value="option1" />
				<Radio.Item label="Option 2" value="option2" />
				<Radio.Item label="Option 3" value="option3" />
			</>
		)
	}
};

export const WithErrorMessage: Story = {
	args: {
		id: "error-radio",
		label: "Payment method",
		value: undefined,
		error: true,
		errorMessage: "Please select a payment method to continue",
		children: (
			<>
				<Radio.Item label="Credit card" value="credit" />
				<Radio.Item label="Bank transfer" value="bank" />
				<Radio.Item label="PayPal" value="paypal" />
			</>
		)
	}
};

export const WithWarningMessage: Story = {
	args: {
		id: "warning-radio",
		label: "Data retention",
		value: "90days",
		warning: true,
		warningMessage: "Shorter retention periods may limit audit capabilities",
		children: (
			<>
				<Radio.Item label="30 days" value="30days" />
				<Radio.Item label="90 days" value="90days" />
				<Radio.Item label="1 year" value="1year" />
			</>
		)
	}
};

export const Interactive: Story = {
	render: () => {
		const InteractiveRadio = () => {
			const [value, setValue] = useState<string | undefined>(undefined);

			return (
				<Radio id="interactive-radio" label="Favourite framework" value={value} onValueChanged={setValue}>
					<Radio.Item label="React" value="react" />
					<Radio.Item label="Vue" value="vue" />
					<Radio.Item label="Angular" value="angular" />
					<Radio.Item label="Svelte" value="svelte" />
				</Radio>
			);
		};

		return <InteractiveRadio />;
	}
};
