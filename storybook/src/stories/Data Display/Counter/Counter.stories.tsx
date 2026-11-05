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
	argTypes: {
		value: {
			control: { type: "number", min: 0, max: 10000 },
			description: "The value to show in the counter (string or number)"
		},
		placeholder: {
			control: "text",
			description: "Placeholder text shown when `value` is undefined"
		},
		overflowCount: {
			control: { type: "number", min: 1, max: 9999 },
			description: "Max count to show before displaying the overflow indicator"
		},
		title: {
			control: "text",
			description: "Hint text shown on mouse over"
		},
		type: {
			control: "select",
			options: ["default", "constructive", "destructive"],
			description: "Variant of the counter"
		},
		secondary: {
			control: "boolean",
			description: "Renders the counter in a muted, secondary style"
		},
		interactive: {
			control: "boolean",
			description: "Marks the counter as interactive (required for interaction hints)"
		},
		hiddenDescription: {
			control: "text",
			description: "Hidden text read by screen readers before the counter value"
		},
		addonBefore: {
			control: false,
			description: "Addon element placed before the value, e.g. an Icon"
		},
		addonAfter: {
			control: false,
			description: "Addon element placed after the value, e.g. an Icon"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		value: 5
	}
};

export const Overflow: Story = {
	args: {
		value: 150,
		overflowCount: 99
	},
	parameters: {
		docs: {
			description: {
				story: "Values above `overflowCount` are rendered as `{overflowCount}+`."
			}
		}
	}
};

export const TypeVariants: Story = {
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
					"The `type` prop supports three variants: `default` (neutral), `constructive` (positive/green) and `destructive` (negative/red). A `secondary` counter uses a muted style."
			}
		}
	}
};

export const WithAddons: Story = {
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
				story: "Use `addonBefore` or `addonAfter` to place an icon or element adjacent to the counter value."
			}
		}
	}
};

export const WithTitle: Story = {
	args: {
		value: 10,
		title: "10 unread messages"
	},
	parameters: {
		docs: {
			description: {
				story: "The `title` prop provides a hint text that is shown on mouse over."
			}
		}
	}
};

export const Placeholder: Story = {
	args: {
		value: undefined,
		placeholder: "–"
	},
	parameters: {
		docs: {
			description: {
				story: "When `value` is undefined, the `placeholder` text is shown instead."
			}
		}
	}
};
