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

import { Counter, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Counter> = {
	title: "Data Display/Counter",
	component: Counter,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: { type: "number", min: 0, max: 10000 },
			description: "The counter value"
		},
		overflowCount: {
			control: { type: "number", min: 1, max: 9999 },
			description: "Max count to show before displaying overflow indicator"
		},
		title: {
			control: "text",
			description: "Title attribute for the counter"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: 5
	}
};

export const WithHighCount: Story = {
	args: {
		value: 42
	}
};

export const WithOverflow: Story = {
	args: {
		value: 150,
		overflowCount: 99
	}
};

export const WithTitle: Story = {
	args: {
		value: 10,
		title: "10 unread messages"
	}
};

export const TypeVariants: Story = {
	name: "Type Variants",
	render: () => (
		<div style={{ display: "flex", gap: 24, alignItems: "center" }}>
			<Counter value={8} />
			<Counter value={5} type="constructive" />
			<Counter value={3} type="destructive" />
			<Counter value={12} secondary />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Counter supports three type variants: default (neutral), `constructive` (positive/green), and `destructive` (negative/red). A `secondary` Counter uses a muted style."
			}
		}
	}
};

export const WithAddons: Story = {
	name: "With Addons",
	render: () => (
		<div style={{ display: "flex", gap: 24, alignItems: "center" }}>
			<Counter value={10} addonBefore={<Icon>mail</Icon>} />
			<Counter value={5} addonAfter={<Icon>notifications</Icon>} />
			<Counter value={3} addonBefore={<Icon>download</Icon>} type="constructive" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Use addonBefore or addonAfter to place an icon or element adjacent to the counter value."
			}
		}
	}
};
