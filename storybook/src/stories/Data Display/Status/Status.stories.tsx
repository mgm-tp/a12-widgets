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

import { Status, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Status> = {
	title: "Data Display/Status",
	component: Status,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["info", "success", "warning", "error"],
			description: "Visual variant — controls color and default icon"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		variant: "info",
		icon: <Icon>info</Icon>,
		children: "This record is currently under review."
	}
};

export const Info: Story = {
	args: {
		variant: "info",
		icon: <Icon>info</Icon>,
		children: "This record is currently under review."
	}
};

export const Success: Story = {
	args: {
		variant: "success",
		icon: <Icon>check_circle</Icon>,
		children: "The process completed successfully."
	}
};

export const Warning: Story = {
	args: {
		variant: "warning",
		icon: <Icon>warning</Icon>,
		children: "Some fields require your attention."
	}
};

export const Error: Story = {
	args: {
		variant: "error",
		icon: <Icon>error</Icon>,
		children: "Submission failed — please correct the errors below."
	}
};

export const NoIcon: Story = {
	args: {
		variant: "info",
		children: "A status message without an icon."
	}
};
