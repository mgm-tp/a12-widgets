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

import { TextOutput } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof TextOutput> = {
	title: "Data Display/TextOutput",
	component: TextOutput,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "Label shown above the value"
		},
		alignment: {
			control: "select",
			options: ["left", "right", "center"],
			description: "Text alignment of the value"
		},
		noData: {
			control: "boolean",
			description: "Render an empty placeholder for missing data"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Full Name",
		children: "Jane Doe"
	}
};

export const WithErrorMessage: Story = {
	args: {
		label: "Email",
		children: "invalid@",
		errorMessage: "Invalid email address"
	}
};

export const WithWarningMessage: Story = {
	args: {
		label: "Budget",
		children: "€ 4,900",
		warningMessage: "Near budget limit"
	}
};

export const NoData: Story = {
	args: {
		label: "Phone",
		noData: true
	}
};

export const RightAligned: Story = {
	args: {
		label: "Amount",
		children: "€ 1,250.00",
		alignment: "right"
	}
};
