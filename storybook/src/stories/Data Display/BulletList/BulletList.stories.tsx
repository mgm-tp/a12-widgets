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

const meta: Meta = {
	title: "Data Display/BulletList",
	component: BulletList.Unordered,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: "Unordered List",
	render: () => (
		<BulletList.Unordered type="disc">
			<BulletList.Item>First item</BulletList.Item>
			<BulletList.Item>Second item</BulletList.Item>
			<BulletList.Item>Third item</BulletList.Item>
		</BulletList.Unordered>
	)
};

export const UnorderedDisc: Story = {
	render: () => (
		<BulletList.Unordered type="disc">
			<BulletList.Item>First item</BulletList.Item>
			<BulletList.Item>Second item</BulletList.Item>
			<BulletList.Item>Third item</BulletList.Item>
		</BulletList.Unordered>
	)
};

export const UnorderedCircle: Story = {
	render: () => (
		<BulletList.Unordered type="circle">
			<BulletList.Item>Alpha</BulletList.Item>
			<BulletList.Item>Beta</BulletList.Item>
			<BulletList.Item>Gamma</BulletList.Item>
		</BulletList.Unordered>
	)
};

export const OrderedDecimal: Story = {
	render: () => (
		<BulletList.Ordered type="decimal">
			<BulletList.Item>Step one</BulletList.Item>
			<BulletList.Item>Step two</BulletList.Item>
			<BulletList.Item>Step three</BulletList.Item>
		</BulletList.Ordered>
	)
};

export const OrderedLowerAlpha: Story = {
	render: () => (
		<BulletList.Ordered type="lower-alpha">
			<BulletList.Item>Option a</BulletList.Item>
			<BulletList.Item>Option b</BulletList.Item>
			<BulletList.Item>Option c</BulletList.Item>
		</BulletList.Ordered>
	)
};

export const Inline: Story = {
	render: () => (
		<BulletList.Unordered inline type="none">
			<BulletList.Item>Home</BulletList.Item>
			<BulletList.Item>Products</BulletList.Item>
			<BulletList.Item>About</BulletList.Item>
		</BulletList.Unordered>
	)
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
