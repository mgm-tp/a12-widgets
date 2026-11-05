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

import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof BulletList.Unordered> = {
	title: "Data Display/BulletList",
	component: BulletList.Unordered,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		type: {
			control: "select",
			options: ["disc", "circle", "square", "none"],
			description: "Bullet marker style of the unordered list"
		},
		inline: {
			control: "boolean",
			description: "Renders the list items in a single horizontal row"
		},
		indent: {
			control: "boolean",
			description: "Whether the list is indented (unordered lists only)"
		},
		children: {
			control: false,
			description: "List items, typically `BulletList.Item` elements"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		type: "disc",
		inline: false,
		indent: true
	},
	render: (args) => (
		<BulletList.Unordered {...args}>
			<BulletList.Item>First item</BulletList.Item>
			<BulletList.Item>Second item</BulletList.Item>
			<BulletList.Item>Third item</BulletList.Item>
		</BulletList.Unordered>
	)
};

export const UnorderedTypes: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
			{(["disc", "circle", "square", "none"] as const).map((type) => (
				<div key={type}>
					<strong>{type}</strong>
					<BulletList.Unordered type={type}>
						<BulletList.Item>First item</BulletList.Item>
						<BulletList.Item>Second item</BulletList.Item>
						<BulletList.Item>Third item</BulletList.Item>
					</BulletList.Unordered>
				</div>
			))}
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`BulletList.Unordered` supports the marker `type` values `disc` (default), `circle`, `square` and `none`."
			}
		}
	}
};

export const OrderedTypes: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
			{(["decimal", "decimal-leading-zero", "lower-roman", "upper-roman", "lower-alpha"] as const).map((type) => (
				<div key={type}>
					<strong>{type}</strong>
					<BulletList.Ordered type={type}>
						<BulletList.Item>Step one</BulletList.Item>
						<BulletList.Item>Step two</BulletList.Item>
						<BulletList.Item>Step three</BulletList.Item>
					</BulletList.Ordered>
				</div>
			))}
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`BulletList.Ordered` renders a numbered list. The `type` prop selects the numbering scheme: `decimal` (default), `decimal-leading-zero`, `lower-roman`, `upper-roman` or `lower-alpha`."
			}
		}
	}
};

export const Inline: Story = {
	render: () => (
		<BulletList.Unordered inline type="none">
			<BulletList.Item>Home</BulletList.Item>
			<BulletList.Item>Products</BulletList.Item>
			<BulletList.Item>About</BulletList.Item>
		</BulletList.Unordered>
	),
	parameters: {
		docs: {
			description: {
				story:
					'`inline` lays the items out horizontally — combined with `type="none"` this is useful for navigation-style lists.'
			}
		}
	}
};

export const WithoutIndent: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "48px" }}>
			<div>
				<strong>indent (default)</strong>
				<BulletList.Unordered type="disc">
					<BulletList.Item>First item</BulletList.Item>
					<BulletList.Item>Second item</BulletList.Item>
				</BulletList.Unordered>
			</div>
			<div>
				<strong>indent=false</strong>
				<BulletList.Unordered type="disc" indent={false}>
					<BulletList.Item>First item</BulletList.Item>
					<BulletList.Item>Second item</BulletList.Item>
				</BulletList.Unordered>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Setting `indent={false}` on `BulletList.Unordered` removes the default left indentation so the list aligns with surrounding content."
			}
		}
	}
};

export const Nested: Story = {
	render: () => (
		<BulletList.Unordered type="disc">
			<BulletList.Item>Root item 1</BulletList.Item>
			<BulletList.Item>
				Root item 2
				<BulletList.Unordered type="circle">
					<BulletList.Item>Nested item 2.1</BulletList.Item>
					<BulletList.Item>
						Nested item 2.2
						<BulletList.Ordered type="decimal">
							<BulletList.Item>Deep item 2.2.1</BulletList.Item>
							<BulletList.Item>Deep item 2.2.2</BulletList.Item>
						</BulletList.Ordered>
					</BulletList.Item>
				</BulletList.Unordered>
			</BulletList.Item>
			<BulletList.Item>Root item 3</BulletList.Item>
		</BulletList.Unordered>
	),
	parameters: {
		docs: {
			description: {
				story: "BulletList components can be nested to any depth. Mix Unordered and Ordered lists at different levels."
			}
		}
	}
};
