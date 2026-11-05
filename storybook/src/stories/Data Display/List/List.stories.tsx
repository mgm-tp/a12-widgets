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

import { Icon, InteractionHintConfigProvider, List, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof List> = {
	title: "Data Display/List",
	component: List,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		border: {
			control: "boolean",
			description: "Whether the list has a border"
		},
		divider: {
			control: "boolean",
			description: "Whether a divider will be added below each item"
		},
		flipped: {
			control: "boolean",
			description: "Whether the position of the text and secondary text is reversed"
		},
		paddedLeft: {
			control: "boolean",
			description: "Whether the item's text should all be aligned with or without the graphic"
		},
		paddedRight: {
			control: "boolean",
			description: "Whether the item which doesn't have a meta will be aligned with the others"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		border: false,
		divider: false,
		flipped: false,
		paddedLeft: false,
		paddedRight: false
	},
	render: (args) => (
		<List {...args}>
			<List.Item text="First item" />
			<List.Item text="Second item" />
			<List.Item text="Third item" />
		</List>
	)
};

export const WithBorder: Story = {
	render: () => (
		<List border>
			<List.Item text="Item with border" />
			<List.Item text="Another item" />
			<List.Item text="Third item" />
		</List>
	),
	parameters: {
		docs: {
			description: {
				story: "`border` draws a border around the whole list."
			}
		}
	}
};

export const Dividers: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
			<div>
				<Typography.Headline level={3}>List divider</Typography.Headline>
				<List divider>
					<List.Item text="Item 1" />
					<List.Item text="Item 2" />
					<List.Item text="Item 3" />
				</List>
			</div>

			<div>
				<Typography.Headline level={3}>Per-item dividers</Typography.Headline>
				<List>
					<List.Item text="Light divider below" divider="light" />
					<List.Item text="Dark divider below" divider="dark" />
					<List.Item text="No divider" />
				</List>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'`divider` on the list adds a divider below every item. Individual items accept `divider` as `true`, `"light"` or `"dark"` for fine-grained control.'
			}
		}
	}
};

export const WithSubHeaders: Story = {
	render: () => (
		<List>
			<List.SubHeader>Group 1</List.SubHeader>
			<List.Item text="Item 1.1" />
			<List.Item text="Item 1.2" />
			<List.SubHeader>Group 2</List.SubHeader>
			<List.Item text="Item 2.1" />
			<List.Item text="Item 2.2" />
		</List>
	),
	parameters: {
		docs: {
			description: {
				story: "`List.SubHeader` groups related items under a non-interactive heading."
			}
		}
	}
};

export const WithIcons: Story = {
	render: () => (
		<List>
			<List.Item text="Home" graphic={<Icon>home</Icon>} />
			<List.Item text="Profile" graphic={<Icon>user</Icon>} />
			<List.Item text="Settings" graphic={<Icon>settings</Icon>} />
			<List.Item text="Messages" graphic={<Icon>mail</Icon>} />
		</List>
	),
	parameters: {
		docs: {
			description: {
				story: "`graphic` renders an element (typically an `Icon`) before the item text."
			}
		}
	}
};

export const RichItems: Story = {
	render: () => (
		<List border>
			<List.Item
				text="Inbox"
				secondaryText="12 unread messages"
				graphic={<Icon>mail</Icon>}
				meta={<Icon>chevron_right</Icon>}
			/>
			<List.Item
				text="Drafts"
				secondaryText="3 drafts pending"
				graphic={<Icon>edit</Icon>}
				meta={<Icon>chevron_right</Icon>}
			/>
			<List.Item
				text="Archive"
				secondaryText="Older conversations"
				graphic={<Icon>archive</Icon>}
				meta={<Icon>chevron_right</Icon>}
			/>
		</List>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Items combine `text`, `secondaryText`, a leading `graphic` and a trailing `meta` element for richer rows."
			}
		}
	}
};

export const ItemStates: Story = {
	render: function ItemStatesExample() {
		const [selectedIndex, setSelectedIndex] = useState(0);

		return (
			<List border>
				<List.Item text="Selectable item 1" selected={selectedIndex === 0} onClick={() => setSelectedIndex(0)} />
				<List.Item text="Selectable item 2" selected={selectedIndex === 1} onClick={() => setSelectedIndex(1)} />
				<List.Item text="Active item" active onClick={() => setSelectedIndex(-1)} />
				<List.Item text="Disabled item" disabled onClick={() => setSelectedIndex(-1)} />
			</List>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Items with an `onClick` handler are interactive. `selected` marks the current item, `active` applies the active style and `disabled` prevents interaction."
			}
		}
	}
};

export const InteractionHints: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
			<div>
				<Typography.Headline level={3}>Basic Interaction Hint</Typography.Headline>
				<InteractionHintConfigProvider enableInteractionHint>
					<List>
						<List.Item text="Item 1" />
						<List.Item text="Item 2" />
						<List.Item text="Item 3" />
					</List>
				</InteractionHintConfigProvider>
			</div>

			<div>
				<Typography.Headline level={3}>Follow Cursor</Typography.Headline>
				<InteractionHintConfigProvider enableInteractionHint followCursor>
					<List>
						<List.Item text="Item 1" />
						<List.Item text="Item 2" />
						<List.Item text="Item 3" />
					</List>
				</InteractionHintConfigProvider>
			</div>

			<div>
				<Typography.Headline level={3}>No Arrow</Typography.Headline>
				<InteractionHintConfigProvider enableInteractionHint hideArrow>
					<List>
						<List.Item text="Item 1" />
						<List.Item text="Item 2" />
						<List.Item text="Item 3" />
					</List>
				</InteractionHintConfigProvider>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Wrapping a list in `InteractionHintConfigProvider` with `enableInteractionHint` shows a hover hint on items. `followCursor` lets the hint track the pointer, `hideArrow` removes the hint arrow."
			}
		}
	}
};
