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

import type { IconPickerProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { HintTooltip, IconPicker } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof IconPicker> = {
	title: "Data Entry/IconPicker",
	component: IconPicker,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		placeholder: {
			control: "text",
			description: "Placeholder text shown in the input when no icon is selected"
		},
		hintTemplate: {
			control: "text",
			description: 'Template for showing icon count — use "{count} of {total} icons shown"'
		},
		saveSpaceMode: {
			control: "boolean",
			description: "When enabled, icon items are shown without labels to save horizontal space"
		},
		openOnFocus: {
			control: "boolean",
			description: "Whether the dropdown opens automatically when the input is focused"
		},
		disabled: {
			control: "boolean",
			description: "Whether the icon picker is disabled"
		},
		readonly: {
			control: "boolean",
			description: "Whether the icon picker is read-only"
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
		onIconClick: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		id: "playground-icon-picker",
		label: "Icon Picker",
		placeholder: "Type an icon or select one",
		hintTemplate: "{count} of {total} icons shown"
	}
};

export const WithPreselectedIcon: Story = {
	args: {
		id: "preselected-icon-picker",
		label: "Icon Picker with Pre-selected Icon",
		placeholder: "Type an icon or select one",
		hintTemplate: "{count} of {total} icons shown",
		selectedIcon: { value: "home", label: "home" }
	},
	parameters: {
		docs: {
			description: {
				story:
					"`selectedIcon` sets the initially selected icon — an object with `value` and `label` (and optionally an icon `theme`)."
			}
		}
	}
};

export const SaveSpaceMode: Story = {
	args: {
		id: "save-space-icon-picker",
		label: "Icon Picker (Save Space Mode)",
		placeholder: "Select an icon",
		hintTemplate: "{count} of {total} icons shown",
		saveSpaceMode: true
	},
	parameters: {
		docs: {
			description: {
				story:
					"`saveSpaceMode` renders the icon items without labels. Without the prop, the picker switches to this mode automatically when its width is below 208px."
			}
		}
	}
};

export const DisabledAndReadonly: Story = {
	render: (args) => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<IconPicker
				{...args}
				id="disabled-icon-picker"
				label="Disabled Icon Picker"
				selectedIcon={{ value: "star", label: "star" }}
				disabled
			/>
			<IconPicker
				{...args}
				id="readonly-icon-picker"
				label="Readonly Icon Picker"
				selectedIcon={{ value: "favorite", label: "favorite" }}
				readonly
			/>
		</div>
	),
	args: {
		placeholder: "Type an icon or select one",
		hintTemplate: "{count} of {total} icons shown"
	},
	parameters: {
		docs: {
			description: {
				story:
					"`disabled` blocks all interaction, while `readonly` keeps the current selection visible but not editable."
			}
		}
	}
};

export const WithHelperText: Story = {
	args: {
		id: "helper-icon-picker",
		label: "Icon Picker with Helper Text",
		placeholder: "Type an icon name to search",
		hintTemplate: "{count} of {total} icons shown",
		helperText: "Start typing to search for Material icons by name."
	},
	parameters: {
		docs: {
			description: {
				story: "`helperText` renders supporting text below the input, e.g. instructions on how to search."
			}
		}
	}
};

export const MessagePosition: Story = {
	args: {
		id: "icon-picker-message-position",
		label: "Icon Picker",
		placeholder: "Type an icon or select one",
		hintTemplate: "{count} of {total} icons shown",
		helperText: "Helper text explaining the field",
		error: true,
		errorMessage: "Please select an icon",
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
		id: "icon-picker-tooltip-position",
		label: "Icon Picker",
		placeholder: "Type an icon or select one",
		hintTemplate: "{count} of {total} icons shown",
		helperText: "Helper text explaining the field",
		tooltips: <HintTooltip text="This is a hint" id="icon-picker-tooltip-position-hint" />,
		ariaDescribedby: "icon-picker-tooltip-position-hint",
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

export const Controlled: Story = {
	render: function ControlledExample() {
		const [selectedIcon, setSelectedIcon] = useState<IconPickerProps.Icon | undefined>();

		return (
			<div>
				<IconPicker
					id="controlled-icon-picker"
					label="Controlled Icon Picker"
					placeholder="Type an icon or select one"
					hintTemplate="{count} of {total} icons shown"
					selectedIcon={selectedIcon}
					onChange={setSelectedIcon}
				/>
				<p style={{ marginTop: 12 }}>
					Selected icon: <strong>{selectedIcon ? selectedIcon.label : "none"}</strong>
				</p>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Pair `selectedIcon` with the `onChange` callback to control the selection from outside. `onChange` receives `undefined` when the clear button is clicked."
			}
		}
	}
};
