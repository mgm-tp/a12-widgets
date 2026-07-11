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

import { MessageBox, Icon, Button } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof MessageBox> = {
	title: "Business Case/MessageBox",
	component: MessageBox,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["info", "success", "warning", "error"],
			description: "Visual variant of the message box"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		variant: "error",
		label: "Validation failed",
		icon: <Icon>error</Icon>,
		children: "One or more fields have errors. Please review and correct them before submitting."
	}
};

export const Info: Story = {
	args: {
		variant: "info",
		label: "Information",
		icon: <Icon>info</Icon>,
		children: "This is an informational message providing context about the current state."
	}
};

export const Success: Story = {
	args: {
		variant: "success",
		label: "Success",
		icon: <Icon>check_circle</Icon>,
		children: "The operation completed successfully."
	}
};

export const Warning: Story = {
	args: {
		variant: "warning",
		label: "Warning",
		icon: <Icon>warning</Icon>,
		children: "Please review the following information before proceeding."
	}
};

export const Error: Story = {
	args: {
		variant: "error",
		label: "Error",
		icon: <Icon>error</Icon>,
		children: "An error occurred. Please try again or contact support."
	}
};

export const WithoutIcon: Story = {
	args: {
		variant: "info",
		label: "No icon variant",
		children: "A message box can be displayed without an icon."
	}
};

export const WithAction: Story = {
	name: "With Action (collapsible)",
	render: () => {
		const WithActionExample = () => {
			const [open, setOpen] = useState(false);

			return (
				<MessageBox
					variant="warning"
					label="3 validation warnings"
					icon={<Icon>warning</Icon>}
					action={
						<Button
							secondary
							icon={<Icon>{open ? "expand_less" : "expand_more"}</Icon>}
							title={open ? "Collapse" : "Expand"}
							onClick={() => setOpen((v) => !v)}
						/>
					}
				>
					{open && (
						<ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
							<li>Field &quot;Name&quot; is required.</li>
							<li>Field &quot;Email&quot; must be a valid email address.</li>
							<li>Field &quot;Phone&quot; must contain exactly 10 digits.</li>
						</ul>
					)}
				</MessageBox>
			);
		};

		return <WithActionExample />;
	},
	parameters: {
		docs: {
			description: {
				story:
					"Use the action prop to place a button on the right of the header — typically a toggle to expand or collapse detailed content below the label."
			}
		}
	}
};
