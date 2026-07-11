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

import { Checkbox } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Checkbox> = {
	title: "Data Entry/Checkbox",
	component: Checkbox,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
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
		checked: false,
		label: "Accept terms and conditions"
	}
};

export const Checked: Story = {
	args: {
		checked: true,
		label: "Subscribe to newsletter"
	}
};

export const Disabled: Story = {
	args: {
		checked: false,
		label: "Disabled checkbox",
		disabled: true
	}
};

export const DisabledChecked: Story = {
	args: {
		checked: true,
		label: "Disabled checked checkbox",
		disabled: true
	}
};

export const Readonly: Story = {
	args: {
		checked: true,
		label: "Readonly checkbox",
		readonly: true
	}
};

export const WithErrorMessage: Story = {
	args: {
		checked: false,
		label: "Accept terms and conditions",
		error: true,
		errorMessage: "You must accept the terms to continue"
	}
};

export const WithWarningMessage: Story = {
	args: {
		checked: false,
		label: "Enable notifications",
		warning: true,
		warningMessage: "Notifications require browser permissions"
	}
};

export const WithInfoMessage: Story = {
	args: {
		checked: true,
		label: "Include attachments",
		infoMessage: "Attachments will be added to the export"
	}
};

export const Interactive: Story = {
	render: () => {
		const InteractiveCheckbox = () => {
			const [checked, setChecked] = useState(false);

			return (
				<Checkbox
					id="interactive-checkbox"
					checked={checked}
					onChange={setChecked}
					label={checked ? "Checked — click to uncheck" : "Unchecked — click to check"}
				/>
			);
		};

		return <InteractiveCheckbox />;
	}
};

export const CheckboxGroup: Story = {
	render: () => {
		const CheckboxGroupExample = () => {
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
		};

		return <CheckboxGroupExample />;
	}
};
