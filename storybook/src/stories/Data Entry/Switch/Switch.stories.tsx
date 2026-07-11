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

import { Switch } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Switch> = {
	title: "Data Entry/Switch",
	component: Switch,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
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
		}
	},
	args: {
		onChange: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		id: "default-switch",
		checked: false,
		label: "Enable feature"
	}
};

export const Checked: Story = {
	args: {
		id: "checked-switch",
		checked: true,
		label: "Feature enabled"
	}
};

export const WithOptions: Story = {
	args: {
		id: "options-switch",
		checked: false,
		label: "Dark mode",
		checkedOption: "On",
		uncheckedOption: "Off"
	}
};

export const WithHelperText: Story = {
	args: {
		id: "helper-text-switch",
		checked: false,
		label: "Send notifications",
		helperText: "You will receive email notifications for important updates."
	}
};

export const Disabled: Story = {
	args: {
		id: "disabled-switch",
		checked: false,
		label: "Disabled switch",
		disabled: true
	}
};

export const Readonly: Story = {
	args: {
		id: "readonly-switch",
		checked: true,
		label: "Readonly switch",
		readonly: true
	}
};

export const WithErrorMessage: Story = {
	args: {
		id: "error-switch",
		checked: false,
		label: "Accept data processing",
		error: true,
		errorMessage: "This setting is required to proceed"
	}
};

export const WithWarningMessage: Story = {
	args: {
		id: "warning-switch",
		checked: true,
		label: "Allow third-party cookies",
		warning: true,
		warningMessage: "Enabling this may affect your privacy"
	}
};

export const Interactive: Story = {
	render: () => {
		const InteractiveSwitch = () => {
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
		};

		return <InteractiveSwitch />;
	}
};
