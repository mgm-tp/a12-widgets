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
import { fn } from "storybook/test";
import { useState } from "react";

import { TextField } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-field/text-field.view";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view";

const meta: Meta<typeof TextField> = {
	title: "Widgets/Data Entry/TextField",
	component: TextField,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "text",
			description: "Value of the input"
		},
		placeholder: {
			control: "text",
			description: "Placeholder text shown when input is empty"
		},
		label: {
			control: "text",
			description: "Label for the input field"
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
		textAlignment: {
			control: "select",
			options: ["left", "right"],
			description: "Text alignment within the input"
		},
		autoFocus: {
			control: "boolean",
			description: "Whether the input should auto-focus on render"
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

export const Default: Story = {
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

export const WithValue: Story = {
	args: {
		label: "Name",
		value: "John Doe"
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
	]
};

export const Disabled: Story = {
	args: {
		label: "Disabled Field",
		value: "Cannot edit this",
		disabled: true
	},
	decorators: [
		(Story) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	]
};

export const ReadOnly: Story = {
	args: {
		label: "Read-only Field",
		value: "This is read-only",
		readonly: true
	},
	decorators: [
		(Story) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	]
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
	]
};

export const WithPrefix: Story = {
	args: {
		label: "Website",
		placeholder: "example.com",
		prefixes: <span style={{ color: "#666" }}>https://</span>
	},
	decorators: [
		(Story) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	]
};

export const WithSuffix: Story = {
	args: {
		label: "Weight",
		placeholder: "Enter weight",
		suffixes: <span style={{ color: "#666" }}>kg</span>
	},
	decorators: [
		(Story) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	]
};

export const WithIconPrefix: Story = {
	args: {
		label: "Search",
		placeholder: "Search...",
		prefixes: <Icon>search</Icon>
	},
	decorators: [
		(Story) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	]
};

export const Interactive: Story = {
	render: () => {
		const InteractiveTextField = () => {
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
		};

		return <InteractiveTextField />;
	}
};

export const FormExample: Story = {
	render: () => (
		<div style={{ width: "400px", display: "flex", flexDirection: "column", gap: "16px" }}>
			<TextField label="First Name" placeholder="Enter first name" />
			<TextField label="Last Name" placeholder="Enter last name" />
			<TextField label="Email" placeholder="Enter email" prefixes={<Icon>mail</Icon>} />
			<TextField label="Phone" placeholder="Enter phone number" prefixes={<span style={{ color: "#666" }}>+1</span>} />
			<TextField label="Website" placeholder="example.com" prefixes={<span style={{ color: "#666" }}>https://</span>} />
		</div>
	)
};
