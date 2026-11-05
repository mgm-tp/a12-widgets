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

import { HintTooltip, Icon, Switch } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Switch> = {
	title: "Data Entry/Switch",
	component: Switch,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		checked: {
			control: "boolean",
			description: "Whether the switch is on (checked)"
		},
		disabled: {
			control: "boolean",
			description: "Disable user interaction with the switch"
		},
		readonly: {
			control: "boolean",
			description: "Render the switch as read-only"
		},
		error: {
			control: "boolean",
			description: "Show the switch in an error state"
		},
		warning: {
			control: "boolean",
			description: "Show the switch in a warning state"
		},
		info: {
			control: "boolean",
			description: "Show the switch in an info state"
		},
		label: {
			control: "text",
			description: "Label text displayed next to the switch"
		},
		labelPosition: {
			control: "select",
			options: ["top", "left", "right", "bottom"],
			description: "Position of the label relative to the switch control"
		},
		checkedOption: {
			control: "text",
			description: "Label shown when the switch is in the on/checked state"
		},
		uncheckedOption: {
			control: "text",
			description: "Label shown when the switch is in the off/unchecked state"
		},
		hideOptions: {
			control: "boolean",
			description: "Hide the checked/unchecked option labels"
		},
		errorMessage: {
			control: "text",
			description: "Error message shown below the switch"
		},
		warningMessage: {
			control: "text",
			description: "Warning message shown below the switch"
		},
		infoMessage: {
			control: "text",
			description: "Info message shown below the switch"
		},
		helperText: {
			control: "text",
			description: "Helper text shown below the switch"
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
		onChange: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		id: "playground-switch",
		checked: false,
		label: "Enable feature"
	}
};

export const WithOptions: Story = {
	args: {
		id: "options-switch",
		checked: false,
		label: "Dark mode",
		checkedOption: "On",
		uncheckedOption: "Off"
	},
	parameters: {
		docs: {
			description: {
				story:
					"`checkedOption` and `uncheckedOption` display state labels next to the control. Use `hideOptions` to suppress them."
			}
		}
	}
};

export const LabelPositions: Story = {
	render: (args) => (
		<div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
			{(["top", "left", "right", "bottom"] as const).map((position) => (
				<Switch
					{...args}
					key={position}
					id={`label-position-${position}-switch`}
					label={`Label ${position}`}
					labelPosition={position}
				/>
			))}
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`labelPosition` places the label at the `top` (default), `left`, `right` or `bottom` of the switch control."
			}
		}
	}
};

export const WithHelperText: Story = {
	args: {
		id: "helper-text-switch",
		checked: false,
		label: "Send notifications",
		helperText: "You will receive email notifications for important updates."
	},
	parameters: {
		docs: {
			description: {
				story: "`helperText` renders additional explanatory content below the switch."
			}
		}
	}
};

export const States: Story = {
	render: (args) => (
		<div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
			<Switch {...args} id="disabled-switch" label="Disabled" disabled />
			<Switch {...args} id="disabled-checked-switch" label="Disabled checked" disabled checked />
			<Switch {...args} id="readonly-switch" label="Readonly" readonly checked />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`disabled` blocks user interaction entirely, while `readonly` renders the current value without allowing changes."
			}
		}
	}
};

export const ValidationStates: Story = {
	render: (args) => (
		<div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
			<Switch
				{...args}
				id="error-switch"
				label="Accept data processing"
				error
				errorMessage="This setting is required to proceed"
			/>
			<Switch
				{...args}
				id="warning-switch"
				label="Allow third-party cookies"
				checked
				warning
				warningMessage="Enabling this may affect your privacy"
			/>
			<Switch
				{...args}
				id="info-switch"
				label="Beta features"
				info
				infoMessage="Beta features may change without notice"
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`error`, `warning` and `info` highlight the switch; `errorMessage`, `warningMessage` and `infoMessage` show the corresponding message below it."
			}
		}
	}
};

export const MessagePosition: Story = {
	args: {
		id: "switch-message-position",
		checked: false,
		label: "Accept data processing",
		helperText: "Helper text explaining the field",
		error: true,
		errorMessage: "This setting is required to proceed",
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
		id: "switch-tooltip-position",
		checked: false,
		label: "Accept data processing",
		helperText: "Helper text explaining the field",
		tooltips: <HintTooltip text="This is a hint" id="switch-tooltip-position-hint" />,
		ariaDescribedby: "switch-tooltip-position-hint",
		breakTooltipsToNewLine: "below"
	},
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

export const CustomIcons: Story = {
	args: {
		id: "custom-icons-switch",
		checked: true,
		label: "Sound",
		checkedIcon: <Icon>volume_up</Icon>,
		uncheckedIcon: <Icon>volume_off</Icon>
	},
	parameters: {
		docs: {
			description: {
				story: "`checkedIcon` and `uncheckedIcon` replace the default check/remove icons displayed inside the thumb."
			}
		}
	}
};

export const Interactive: Story = {
	render: function InteractiveExample() {
		const [checked, setChecked] = useState(false);

		return (
			<Switch
				id="interactive-switch"
				label="Airplane mode"
				checkedOption="On"
				uncheckedOption="Off"
				checked={checked}
				onChange={setChecked}
			/>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"A controlled switch: `checked` is held in state and updated through `onChange`, which receives the new boolean value."
			}
		}
	}
};
