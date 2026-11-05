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

import { Breadcrumb, Link, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Breadcrumb> = {
	title: "Navigation/Breadcrumb",
	component: Breadcrumb,
	parameters: {
		layout: "centered"
	},
	argTypes: {
		separator: {
			control: "text",
			description: "Custom divider between items. Defaults to a `chevron_right` icon."
		},
		children: {
			control: false,
			description: "`Breadcrumb.Item` elements forming the navigation trail"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<Breadcrumb {...args}>
			<Breadcrumb.Item>
				<Link href="#">Home</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link href="#">Products</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item currentPage>
				<span>Electronics</span>
			</Breadcrumb.Item>
		</Breadcrumb>
	)
};

export const CustomSeparator: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<Breadcrumb separator="→">
				<Breadcrumb.Item>
					<Link href="#">Home</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					<Link href="#">Category</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item currentPage>
					<span>Current Page</span>
				</Breadcrumb.Item>
			</Breadcrumb>
			<Breadcrumb separator={<Icon>arrow_forward</Icon>}>
				<Breadcrumb.Item>
					<Link href="#">Home</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					<Link href="#">Settings</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item currentPage>
					<span>Profile</span>
				</Breadcrumb.Item>
			</Breadcrumb>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"The `separator` prop accepts any `ReactNode` — a plain string or an `Icon` element. Without it, a `chevron_right` icon is rendered between items."
			}
		}
	}
};

export const WithIcons: Story = {
	render: () => (
		<Breadcrumb>
			<Breadcrumb.Item>
				<Link href="#">
					<span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
						<Icon>home</Icon>
						Home
					</span>
				</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link href="#">
					<span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
						<Icon>folder</Icon>
						Documents
					</span>
				</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item currentPage>
				<span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
					<Icon>description</Icon>
					Report.pdf
				</span>
			</Breadcrumb.Item>
		</Breadcrumb>
	),
	parameters: {
		docs: {
			description: {
				story: "Each `Breadcrumb.Item` accepts arbitrary content, so links can combine an `Icon` with a label."
			}
		}
	}
};

export const LongPath: Story = {
	render: () => (
		<Breadcrumb>
			<Breadcrumb.Item>
				<Link href="#">Home</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link href="#">Level 1</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link href="#">Level 2</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link href="#">Level 3</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link href="#">Level 4</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item currentPage>
				<span>Current Page</span>
			</Breadcrumb.Item>
		</Breadcrumb>
	),
	parameters: {
		docs: {
			description: {
				story: "A deeply nested trail — the breadcrumb renders a separator between every pair of items."
			}
		}
	}
};

export const SingleItem: Story = {
	render: () => (
		<Breadcrumb>
			<Breadcrumb.Item currentPage>
				<span>Home</span>
			</Breadcrumb.Item>
		</Breadcrumb>
	),
	parameters: {
		docs: {
			description: {
				story:
					'With a single item no separator is rendered. `currentPage` still marks the item with `aria-current="page"`.'
			}
		}
	}
};
