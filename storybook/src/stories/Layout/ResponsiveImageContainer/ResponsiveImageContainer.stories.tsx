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
import { fn } from "storybook/test";

import { ResponsiveImageContainer } from "@com.mgmtp.a12.widgets/widgets-core";

const PLACEHOLDER_IMAGE = "https://picsum.photos/seed/a12/800/450";
const TALL_IMAGE = "https://picsum.photos/seed/tall/400/600";
const WIDE_IMAGE = "https://picsum.photos/seed/wide/1200/300";

const meta: Meta<typeof ResponsiveImageContainer> = {
	title: "Layout/ResponsiveImageContainer",
	component: ResponsiveImageContainer,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		src: {
			control: "text",
			description: "URL of the image to display"
		},
		alt: {
			control: "text",
			description: "Alternate text for the image if it cannot be displayed"
		},
		title: {
			control: "text",
			description: "Title attribute shown on hover"
		},
		onClick: {
			description: "Callback when the image is clicked"
		},
		onLoad: {
			description: "Callback when the image has loaded successfully"
		}
	},
	args: {
		onClick: fn(),
		onLoad: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		src: PLACEHOLDER_IMAGE,
		alt: "A landscape photo"
	},
	decorators: [
		(Story) => (
			<div style={{ width: "100%", maxWidth: 600 }}>
				<Story />
			</div>
		)
	]
};

export const WithTitle: Story = {
	args: {
		src: PLACEHOLDER_IMAGE,
		alt: "A landscape photo",
		title: "Hover to see this title"
	},
	decorators: [
		(Story) => (
			<div style={{ width: "100%", maxWidth: 600 }}>
				<Story />
			</div>
		)
	],
	parameters: {
		docs: {
			description: {
				story: "The `title` prop sets the image's title attribute, shown as a native tooltip on hover."
			}
		}
	}
};

export const AspectRatios: Story = {
	render: (args) => (
		<div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
			<div style={{ flex: "0 1 400px", maxWidth: 400 }}>
				<ResponsiveImageContainer {...args} src={WIDE_IMAGE} alt="A very wide panoramic image" />
			</div>
			<div style={{ flex: "0 1 300px", maxWidth: 300 }}>
				<ResponsiveImageContainer {...args} src={TALL_IMAGE} alt="A tall portrait image" />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Images of any aspect ratio — wide panoramas or tall portraits — scale down to fit their container while keeping their proportions (`object-fit: contain`)."
			}
		}
	}
};

export const NarrowContainer: Story = {
	args: {
		src: PLACEHOLDER_IMAGE,
		alt: "Image in a narrow container"
	},
	decorators: [
		(Story) => (
			<div style={{ width: 200 }}>
				<Story />
			</div>
		)
	],
	parameters: {
		docs: {
			description: {
				story: "The image never overflows its parent: in a narrow container it shrinks to the available width."
			}
		}
	}
};
