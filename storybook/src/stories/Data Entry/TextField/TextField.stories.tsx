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

import { TextField, Icon, HintTooltip } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof TextField> = {
	title: "Data Entry/TextField",
	component: TextField,
	parameters: {
		layout: "centered"
	},
	argTypes: {
		value: {
			control: "text",
			description: "Value of the input"
		},
		placeholder: {
			control: "text",
			description: "Placeholder text shown when the input is empty"
		},
		label: {
			control: "text",
			description: "Label for the input field"
		},
		hideLabel: {
			control: "boolean",
			description: "Visually hides the label while keeping it accessible to screen readers"
		},
		helperText: {
			control: "text",
			description: "Helper text displayed below the input"
		},
		disabled: {
			control: "boolean",
			description: "Whether the input is disabled"
		},
		readonly: {
			control: "boolean",
			description: "Whether the input is read-only"
		},
		error: {
			control: "boolean",
			description: "Error state for the input"
		},
		warning: {
			control: "boolean",
			description: "Warning state for the input"
		},
		info: {
			control: "boolean",
			description: "Info state for the input"
		},
		textAlignment: {
			control: "select",
			options: ["left", "right"],
			description: "Text alignment within the input"
		},
		autoFocus: {
			control: "boolean",
			description: "Whether the input should auto-focus on render"
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
				'Where tooltips render: `true` / `"above"` (default for this widget) on a new line above the control, `false` inline beside the control, `"below"` on a new line below'
		}
	},
	args: {
		onChange: fn(),
		onBlur: fn(),
		onFocus: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		label: "Label",
		placeholder: "Enter text..."
	},
	decorators: [
		(Story) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	]
};

export const WithHelperText: Story = {
	args: {
		label: "Email",
		placeholder: "Enter your email",
		helperText: "We'll never share your email with anyone else."
	},
	decorators: [
		(Story) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	],
	parameters: {
		docs: {
			description: {
				story: "`helperText` renders additional guidance below the input."
			}
		}
	}
};

export const States: Story = {
	render: (args) => (
		<div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "16px" }}>
			<TextField {...args} label="Disabled Field" value="Cannot edit this" disabled />
			<TextField {...args} label="Read-only Field" value="This is read-only" readonly />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`disabled` blocks all interaction, while `readonly` keeps the value focusable and selectable but not editable."
			}
		}
	}
};

export const ValidationStates: Story = {
	render: (args) => (
		<div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "16px" }}>
			<TextField {...args} label="Error" value="Invalid value" error errorMessage="This value is not valid." />
			<TextField
				{...args}
				label="Warning"
				value="Check this value"
				warning
				warningMessage="This value looks unusual."
			/>
			<TextField
				{...args}
				label="Info"
				value="Some value"
				info
				infoMessage="Additional information about this field."
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`error`, `warning` and `info` set the validation state, and `errorMessage`/`warningMessage`/`infoMessage` render the matching message below the input."
			}
		}
	}
};

export const RightAligned: Story = {
	args: {
		label: "Amount",
		value: "1,234.56",
		textAlignment: "right"
	},
	decorators: [
		(Story) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	],
	parameters: {
		docs: {
			description: {
				story: '`textAlignment="right"` aligns the input text to the right — useful for numeric values such as amounts.'
			}
		}
	}
};

export const PrefixesAndSuffixes: Story = {
	render: (args) => (
		<div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "16px" }}>
			<TextField
				{...args}
				label="Website"
				placeholder="example.com"
				prefixes={<span style={{ color: "#666" }}>https://</span>}
			/>
			<TextField
				{...args}
				label="Weight"
				placeholder="Enter weight"
				suffixes={<span style={{ color: "#666" }}>kg</span>}
			/>
			<TextField {...args} label="Search" placeholder="Search..." prefixes={<Icon>search</Icon>} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`prefixes` and `suffixes` place text or icon elements inside the input wrapper, before or after the HTML input."
			}
		}
	}
};

export const Controlled: Story = {
	render: function ControlledExample() {
		const [value, setValue] = useState("");

		return (
			<div style={{ width: "300px" }}>
				<TextField
					label="Interactive Input"
					value={value}
					placeholder="Type something..."
					onChange={(e) => setValue(e.target.value)}
					helperText={`Character count: ${value.length}`}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"TextField has no intrinsic state — control it via `value` and `onChange`. Here the `helperText` reflects the current character count."
			}
		}
	}
};

export const MessagePosition: Story = {
	args: {
		id: "text-field-message-position",
		label: "Label",
		helperText: "Helper text explaining the field",
		value: "Invalid value",
		error: true,
		errorMessage: "This field is required",
		messagePosition: "below"
	},
	decorators: [
		(Story) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	],
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
		id: "text-field-tooltip-position",
		label: "Label",
		helperText: "Helper text explaining the field",
		value: "Example value",
		tooltips: <HintTooltip text="This is a hint" id="text-field-tooltip-position-hint" />,
		ariaDescribedby: "text-field-tooltip-position-hint",
		breakTooltipsToNewLine: "below"
	},
	decorators: [
		(Story) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	],
	parameters: {
		controls: { include: ["breakTooltipsToNewLine"] },
		docs: {
			description: {
				story:
					'`breakTooltipsToNewLine` places the tooltips relative to the control. This story starts at `"below"`, which puts them on their own line under the control — switch the control to `false` to place them inline beside it, or to `"above"` / `true` for a line above, which is the default for this widget.'
			}
		}
	}
};

export const TooltipContent: Story = {
	render: () => (
		<div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "16px" }}>
			<TextField
				id="text-field-tooltip-content-element"
				label="Element tooltip"
				value="Example value"
				breakTooltipsToNewLine={false}
				tooltips={<HintTooltip text="This is a hint" id="text-field-tooltip-content-hint" />}
				ariaDescribedby="text-field-tooltip-content-hint"
			/>
			<TextField
				id="text-field-tooltip-content-string"
				label="String tooltip"
				value="Example value"
				breakTooltipsToNewLine={false}
				tooltips="(optional)"
			/>
		</div>
	),
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story:
					"`tooltips` takes any React node, not only tooltip components. An element tooltip gets the `field__tooltip` class merged into its own `className`; a string, a number or a fragment is wrapped in a `span` carrying that class, so consumer styling reaches both the same way."
			}
		}
	}
};

export const FormExample: Story = {
	render: () => (
		<div style={{ width: "min(400px, calc(100vw - 32px))", display: "flex", flexDirection: "column", gap: "16px" }}>
			<TextField label="First Name" placeholder="Enter first name" />
			<TextField label="Last Name" placeholder="Enter last name" />
			<TextField label="Email" placeholder="Enter email" prefixes={<Icon>mail</Icon>} />
			<TextField label="Phone" placeholder="Enter phone number" prefixes={<span style={{ color: "#666" }}>+1</span>} />
			<TextField label="Website" placeholder="example.com" prefixes={<span style={{ color: "#666" }}>https://</span>} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"A realistic composition: several text fields stacked in a form, combining `label`, `placeholder` and `prefixes`."
			}
		}
	}
};
