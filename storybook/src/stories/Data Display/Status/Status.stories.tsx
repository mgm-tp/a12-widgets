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

const variantIcons = {
	info: "info",
	success: "check_circle",
	warning: "warning",
	error: "error"
} as const;

const meta: Meta<typeof Status> = {
	title: "Data Display/Status",
	component: Status,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["info", "success", "warning", "error"],
			description: "Visual variant — controls the color scheme (`info` by default)"
		},
		icon: {
			control: false,
			description: "Element shown as the status icon, typically an `Icon`"
		},
		children: {
			control: "text",
			description: "Content of the status message"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		variant: "info",
		icon: <Icon>info</Icon>,
		children: "This record is currently under review."
	}
};

export const Variants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<Status variant="info" icon={<Icon>info</Icon>}>
				This record is currently under review.
			</Status>
			<Status variant="success" icon={<Icon>check_circle</Icon>}>
				The process completed successfully.
			</Status>
			<Status variant="warning" icon={<Icon>warning</Icon>}>
				Some fields require your attention.
			</Status>
			<Status variant="error" icon={<Icon>error</Icon>}>
				Submission failed — please correct the errors below.
			</Status>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"The `variant` prop selects the color scheme: `info`, `success`, `warning` or `error`. Pair it with a matching `icon` to reinforce the meaning."
			}
		}
	}
};

export const NoIcon: Story = {
	args: {
		variant: "info",
		children: "A status message without an icon."
	},
	parameters: {
		docs: {
			description: {
				story: "`icon` is optional — without it the status renders text only."
			}
		}
	}
};

export const LongText: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "360px" }}>
			{(["info", "warning"] as const).map((variant) => (
				<Status key={variant} variant={variant} icon={<Icon>{variantIcons[variant]}</Icon>}>
					This status message is intentionally long so that it wraps onto multiple lines, demonstrating how the icon
					aligns to the top edge of the text instead of staying vertically centered.
				</Status>
			))}
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"When the content wraps onto multiple lines, the `icon` automatically aligns to the top of the text instead of being vertically centered."
			}
		}
	}
};
