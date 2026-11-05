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

import { HintTooltip, Radio } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Radio> = {
	title: "Data Entry/Radio",
	component: Radio,
	parameters: {
		layout: "padded"
	},
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
		info: {
			control: "boolean",
			description: "Show the radio group in an info state"
		},
		label: {
			control: "text",
			description: "Label for the radio group"
		},
		hideLabel: {
			control: "boolean",
			description: "Visually hide the label while keeping it accessible to screen readers"
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
		},
		helperText: {
			control: "text",
			description: "Additional content displayed below the group"
		},
		name: {
			control: "text",
			description: "HTML name attribute shared by all items; falls back to the `id` when omitted"
		},
		messagePosition: {
			control: "select",
			options: ["above", "below"],
			description:
				'Where the error, warning and info message boxes render: `"above"` (default) between the label and the control, `"below"` directly under the control'
		},
		breakTooltipsToNewLine: {
			control: "select",
			options: [false, true, "above", "below"],
			description:
				'Where tooltips render: `false` (default) inline beside the control, `true` / `"above"` on a new line above the control, `"below"` on a new line below'
		}
	},
	args: {
		onValueChanged: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		id: "playground-radio",
		label: "Preferred contact method",
		value: "email",
		children: (
			<>
				<Radio.Item label="Email" value="email" />
				<Radio.Item label="Phone" value="phone" />
				<Radio.Item label="Post" value="post" />
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
	},
	parameters: {
		docs: {
			description: {
				story: "`inline` lays the radio items out in a single row instead of stacking them vertically."
			}
		}
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"Individual options can be disabled via the `disabled` prop on a single `Radio.Item` while the rest of the group stays interactive."
			}
		}
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
	},
	parameters: {
		docs: {
			description: {
				story: "Setting `disabled` on the group disables every radio item; value changes are no longer possible."
			}
		}
	}
};

export const Readonly: Story = {
	args: {
		id: "readonly-radio",
		label: "Contract type",
		value: "permanent",
		readonly: true,
		children: (
			<>
				<Radio.Item label="Permanent" value="permanent" />
				<Radio.Item label="Fixed-term" value="fixed" />
				<Radio.Item label="Freelance" value="freelance" />
			</>
		)
	},
	parameters: {
		docs: {
			description: {
				story: "`readonly` presents the current selection without allowing changes — useful for review screens."
			}
		}
	}
};

export const ValidationStates: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
			<Radio id="error-radio" label="Payment method" error errorMessage="Please select a payment method to continue">
				<Radio.Item label="Credit card" value="credit" />
				<Radio.Item label="Bank transfer" value="bank" />
				<Radio.Item label="PayPal" value="paypal" />
			</Radio>
			<Radio
				id="warning-radio"
				label="Data retention"
				value="90days"
				warning
				warningMessage="Shorter retention periods may limit audit capabilities"
			>
				<Radio.Item label="30 days" value="30days" />
				<Radio.Item label="90 days" value="90days" />
				<Radio.Item label="1 year" value="1year" />
			</Radio>
			<Radio
				id="info-radio"
				label="Newsletter frequency"
				value="weekly"
				info
				infoMessage="You can change this at any time in your profile"
			>
				<Radio.Item label="Daily" value="daily" />
				<Radio.Item label="Weekly" value="weekly" />
				<Radio.Item label="Monthly" value="monthly" />
			</Radio>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"The `error`, `warning` and `info` flags style the group, while `errorMessage`, `warningMessage` and `infoMessage` show a matching message below it."
			}
		}
	}
};

export const MessagePosition: Story = {
	args: {
		id: "radio-message-position",
		label: "Payment method",
		helperText: "Helper text explaining the field",
		error: true,
		errorMessage: "Please select a payment method to continue",
		messagePosition: "below",
		children: (
			<>
				<Radio.Item label="Credit card" value="credit" />
				<Radio.Item label="Bank transfer" value="bank" />
				<Radio.Item label="PayPal" value="paypal" />
			</>
		)
	},
	parameters: {
		controls: { include: ["messagePosition"] },
		docs: {
			description: {
				story:
					'`messagePosition` places the message box relative to the control. This story starts at `"below"`, which renders it directly under the control — switch the control to `"above"` for the default placement between the label and the control.'
			}
		}
	}
};

export const TooltipPosition: Story = {
	args: {
		id: "radio-tooltip-position",
		label: "Payment method",
		helperText: "Helper text explaining the field",
		value: "credit",
		tooltips: <HintTooltip text="This is a hint" id="radio-tooltip-position-hint" />,
		ariaDescribedby: "radio-tooltip-position-hint",
		breakTooltipsToNewLine: "below",
		children: (
			<>
				<Radio.Item label="Credit card" value="credit" />
				<Radio.Item label="Bank transfer" value="bank" />
				<Radio.Item label="PayPal" value="paypal" />
			</>
		)
	},
	parameters: {
		controls: { include: ["breakTooltipsToNewLine"] },
		docs: {
			description: {
				story:
					'`breakTooltipsToNewLine` places the tooltips relative to the control. This story starts at `"below"`, which puts them on their own line under the control — switch the control to `false` for the default inline placement beside it, or to `"above"` / `true` for a line above.'
			}
		}
	}
};

export const Controlled: Story = {
	render: function ControlledExample() {
		const [value, setValue] = useState<string | undefined>(undefined);

		return (
			<Radio id="controlled-radio" label="Favourite framework" value={value} onValueChanged={setValue}>
				<Radio.Item label="React" value="react" />
				<Radio.Item label="Vue" value="vue" />
				<Radio.Item label="Angular" value="angular" />
				<Radio.Item label="Svelte" value="svelte" />
			</Radio>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Radio is a controlled component: pass the selected item via `value` and update it in the `onValueChanged` callback."
			}
		}
	}
};
