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

import { Select, CustomSelect, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import type { SelectItem } from "@com.mgmtp.a12.widgets/widgets-core";

const FRUIT_ITEMS: SelectItem[] = [
	"Avocado",
	"Chestnut",
	"Dragon fruit",
	"Grape",
	"Grapefruit",
	"Jackfruit",
	"Mango",
	"Apple",
	"Orange",
	"Strawberry",
	"Banana",
	"Kiwi"
].map((item) => ({ value: item, label: item }));

const GROUPED_ITEMS: SelectItem[] = [
	{
		label: "Programming languages",
		children: [
			{ value: "Java", label: "Java" },
			{ value: "JavaScript", label: "JavaScript" },
			{ value: "Python", label: "Python" },
			{ value: "TypeScript", label: "TypeScript" }
		]
	},
	{
		label: "Editors",
		children: [
			{ value: "VSCode", label: "VSCode" },
			{ value: "IntelliJ", label: "IntelliJ" },
			{ value: "Vim", label: "Vim" }
		]
	}
];

const meta: Meta<typeof Select> = {
	title: "Data Entry/Select",
	component: Select,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "Label displayed above the select input"
		},
		placeholder: {
			control: "text",
			description: "Placeholder text shown when no value is selected"
		},
		disabled: {
			control: "boolean",
			description: "Disables the select input"
		},
		readonly: {
			control: "boolean",
			description: "Makes the select input read-only"
		},
		error: {
			control: "boolean",
			description: "Applies error styling"
		},
		warning: {
			control: "boolean",
			description: "Applies warning styling"
		},
		info: {
			control: "boolean",
			description: "Applies info styling"
		},
		useCustomView: {
			control: "boolean",
			description: "Render a custom HTML structure instead of the native browser select"
		},
		errorMessage: {
			control: "text",
			description: "Error message shown below the input"
		},
		warningMessage: {
			control: "text",
			description: "Warning message shown below the input"
		},
		infoMessage: {
			control: "text",
			description: "Info message shown below the input"
		},
		helperText: {
			control: "text",
			description: "Helper text displayed below the input"
		}
	},
	args: {
		onValueChanged: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const DefaultSelect = () => {
			const [value, setValue] = useState<string | undefined>(undefined);

			return (
				<div style={{ width: 320 }}>
					<Select
						id="select-default"
						label="Fruit"
						placeholder="Please choose..."
						items={FRUIT_ITEMS}
						value={value}
						onValueChanged={setValue}
					/>
				</div>
			);
		};

		return <DefaultSelect />;
	}
};

export const WithLabelGraphic: Story = {
	render: () => {
		const SelectWithGraphic = () => {
			const [value, setValue] = useState<string | undefined>(undefined);

			return (
				<div style={{ width: 320 }}>
					<Select
						id="select-label-graphic"
						label="Fruit"
						labelGraphic={<Icon>info</Icon>}
						placeholder="Please choose..."
						items={FRUIT_ITEMS}
						value={value}
						onValueChanged={setValue}
					/>
				</div>
			);
		};

		return <SelectWithGraphic />;
	}
};

export const WithGroupedOptions: Story = {
	render: () => {
		const SelectWithGroups = () => {
			const [value, setValue] = useState<string>("Java");

			return (
				<div style={{ width: 320 }}>
					<Select
						id="select-grouped"
						label="Technology"
						placeholder="Please choose..."
						items={GROUPED_ITEMS}
						value={value}
						onValueChanged={setValue}
						helperText="Items are grouped by category"
					/>
				</div>
			);
		};

		return <SelectWithGroups />;
	}
};

export const Disabled: Story = {
	render: () => (
		<div style={{ width: 320 }}>
			<Select
				id="select-disabled"
				label="Fruit (disabled)"
				placeholder="Please choose..."
				items={FRUIT_ITEMS}
				disabled
			/>
		</div>
	)
};

export const Readonly: Story = {
	render: () => (
		<div style={{ width: 320 }}>
			<Select id="select-readonly" label="Fruit (readonly)" items={FRUIT_ITEMS} value="Apple" readonly />
		</div>
	)
};

export const ValidationStates: Story = {
	render: () => {
		const ValidationSelect = () => {
			const [value, setValue] = useState<string | undefined>(undefined);

			return (
				<div style={{ width: 320, display: "flex", flexDirection: "column", gap: 16 }}>
					<Select
						id="select-error"
						label="Error state"
						placeholder="Please choose..."
						items={FRUIT_ITEMS}
						value={value}
						onValueChanged={setValue}
						error
						errorMessage="A selection is required"
					/>
					<Select
						id="select-warning"
						label="Warning state"
						placeholder="Please choose..."
						items={FRUIT_ITEMS}
						value={value}
						onValueChanged={setValue}
						warning
						warningMessage="Consider reviewing your selection"
					/>
					<Select
						id="select-info"
						label="Info state"
						placeholder="Please choose..."
						items={FRUIT_ITEMS}
						value={value}
						onValueChanged={setValue}
						info
						infoMessage="You can update this later"
					/>
				</div>
			);
		};

		return <ValidationSelect />;
	}
};

export const CustomView: Story = {
	render: () => {
		const CustomSelectExample = () => {
			const [value, setValue] = useState<string>("Apple");

			return (
				<div style={{ width: 320 }}>
					<CustomSelect
						id="custom-select"
						label="Custom Select"
						placeholder="Please choose..."
						items={FRUIT_ITEMS}
						value={value}
						onValueChanged={setValue}
						helperText="Uses a custom dropdown instead of the native browser select"
					/>
				</div>
			);
		};

		return <CustomSelectExample />;
	}
};
