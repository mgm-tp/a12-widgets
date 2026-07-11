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
import { IconPicker } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof IconPicker> = {
	title: "Data Entry/IconPicker",
	component: IconPicker,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
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
		}
	},
	args: {
		onChange: fn(),
		onIconClick: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		id: "default-icon-picker",
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
	}
};

export const SaveSpaceMode: Story = {
	args: {
		id: "save-space-icon-picker",
		label: "Icon Picker (Save Space Mode)",
		placeholder: "Select an icon",
		hintTemplate: "{count} of {total} icons shown",
		saveSpaceMode: true
	}
};

export const Disabled: Story = {
	args: {
		id: "disabled-icon-picker",
		label: "Disabled Icon Picker",
		placeholder: "Type an icon or select one",
		hintTemplate: "{count} of {total} icons shown",
		selectedIcon: { value: "star", label: "star" },
		disabled: true
	}
};

export const Readonly: Story = {
	args: {
		id: "readonly-icon-picker",
		label: "Readonly Icon Picker",
		placeholder: "Type an icon or select one",
		hintTemplate: "{count} of {total} icons shown",
		selectedIcon: { value: "favorite", label: "favorite" },
		readonly: true
	}
};

export const WithHelperText: Story = {
	args: {
		id: "helper-icon-picker",
		label: "Icon Picker with Helper Text",
		placeholder: "Type an icon name to search",
		hintTemplate: "{count} of {total} icons shown",
		helperText: "Start typing to search for Material icons by name."
	}
};

export const Controlled: Story = {
	render: () => {
		const ControlledExample = () => {
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
		};

		return <ControlledExample />;
	}
};
