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
	tags: ["autodocs"],
	argTypes: {
		src: {
			control: "text",
			description: "URL of the image to display"
		},
		alt: {
			control: "text",
			description: "Alternate text for the image"
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

export const Default: Story = {
	args: {
		src: PLACEHOLDER_IMAGE,
		alt: "A landscape photo"
	},
	decorators: [
		(Story) => (
			<div style={{ width: 600 }}>
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
			<div style={{ width: 600 }}>
				<Story />
			</div>
		)
	]
};

export const WideImage: Story = {
	args: {
		src: WIDE_IMAGE,
		alt: "A very wide panoramic image"
	},
	decorators: [
		(Story) => (
			<div style={{ width: 400 }}>
				<Story />
			</div>
		)
	]
};

export const TallImage: Story = {
	args: {
		src: TALL_IMAGE,
		alt: "A tall portrait image"
	},
	decorators: [
		(Story) => (
			<div style={{ width: 300 }}>
				<Story />
			</div>
		)
	]
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
	]
};
