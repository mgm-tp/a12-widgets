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

import { Checkbox, HintTooltip } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Checkbox> = {
	title: "Data Entry/Checkbox",
	component: Checkbox,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		checked: {
			control: "boolean",
			description: "Whether the checkbox is checked"
		},
		disabled: {
			control: "boolean",
			description: "Disable user interaction with the checkbox"
		},
		readonly: {
			control: "boolean",
			description: "Render the checkbox as read-only"
		},
		error: {
			control: "boolean",
			description: "Show the checkbox in an error state"
		},
		warning: {
			control: "boolean",
			description: "Show the checkbox in a warning state"
		},
		info: {
			control: "boolean",
			description: "Show the checkbox in an info state"
		},
		label: {
			control: "text",
			description: "Label text displayed next to the checkbox"
		},
		errorMessage: {
			control: "text",
			description: "Error message shown below the checkbox when in error state"
		},
		warningMessage: {
			control: "text",
			description: "Warning message shown below the checkbox"
		},
		infoMessage: {
			control: "text",
			description: "Info message shown below the checkbox"
		},
		title: {
			control: "text",
			description: "Hint text shown as native tooltip on mouse over"
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
		onChange: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		checked: false,
		label: "Accept terms and conditions"
	}
};

export const Disabled: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			<Checkbox id="checkbox-disabled-unchecked" checked={false} onChange={fn()} label="Disabled unchecked" disabled />
			<Checkbox id="checkbox-disabled-checked" checked onChange={fn()} label="Disabled checked" disabled />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "`disabled` blocks user interaction in both the unchecked and the checked state."
			}
		}
	}
};

export const Readonly: Story = {
	args: {
		checked: true,
		label: "Readonly checkbox",
		readonly: true
	},
	parameters: {
		docs: {
			description: {
				story: "`readonly` displays the current value without allowing the user to change it."
			}
		}
	}
};

export const ValidationStates: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<Checkbox
				id="checkbox-accept-terms"
				checked={false}
				onChange={fn()}
				label="Accept terms and conditions"
				error
				errorMessage="You must accept the terms to continue"
			/>
			<Checkbox
				id="checkbox-enable-notifications"
				checked={false}
				onChange={fn()}
				label="Enable notifications"
				warning
				warningMessage="Notifications require browser permissions"
			/>
			<Checkbox
				id="checkbox-include-attachments"
				checked
				onChange={fn()}
				label="Include attachments"
				info
				infoMessage="Attachments will be added to the export"
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"The `error`, `warning` and `info` flags style the checkbox, while `errorMessage`, `warningMessage` and `infoMessage` render a hint below it."
			}
		}
	}
};

export const Controlled: Story = {
	render: function ControlledExample() {
		const [checked, setChecked] = useState(false);

		return (
			<Checkbox
				id="interactive-checkbox"
				checked={checked}
				onChange={setChecked}
				label={checked ? "Checked — click to uncheck" : "Unchecked — click to check"}
			/>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"The checkbox is a controlled component: keep the value in state and update it via `onChange(value, event)`."
			}
		}
	}
};

export const MessagePosition: Story = {
	args: {
		id: "checkbox-message-position",
		checked: false,
		label: "Accept terms and conditions",
		helperText: "Helper text explaining the field",
		error: true,
		errorMessage: "You must accept the terms to continue",
		messagePosition: "below"
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
		id: "checkbox-tooltip-position",
		checked: false,
		label: "Accept terms and conditions",
		helperText: "Helper text explaining the field",
		tooltips: <HintTooltip text="This is a hint" id="checkbox-tooltip-position-hint" />,
		ariaDescribedby: "checkbox-tooltip-position-hint",
		breakTooltipsToNewLine: "below"
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

export const CheckboxGroup: Story = {
	render: function CheckboxGroupExample() {
		const options = ["React", "TypeScript", "GraphQL", "REST"];
		const [selected, setSelected] = useState<string[]>(["React"]);

		const toggle = (option: string) => {
			setSelected((prev) => (prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]));
		};

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
				{options.map((option) => (
					<Checkbox
						key={option}
						id={`checkbox-${option.toLowerCase()}`}
						checked={selected.includes(option)}
						onChange={() => toggle(option)}
						label={option}
					/>
				))}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "Several checkboxes composed into a multi-select group, each with its own `id` and `label`."
			}
		}
	}
};
