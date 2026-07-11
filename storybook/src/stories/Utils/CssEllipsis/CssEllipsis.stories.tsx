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

import { CssEllipsis } from "@com.mgmtp.a12.widgets/widgets-core";

const LONG_TEXT =
	"This is a very long text that should be truncated when it exceeds the available space in the container. " +
	"The CssEllipsis component handles overflow using CSS line clamping so the truncation is performant.";

const meta: Meta<typeof CssEllipsis> = {
	title: "Utils/CssEllipsis",
	component: CssEllipsis,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		maxLine: {
			control: { type: "number", min: 1, max: 10 },
			description: "Maximum number of lines before truncation"
		},
		useTooltip: {
			control: "boolean",
			description: "Show full text in a tooltip when truncated"
		},
		tooltipVariant: {
			control: "select",
			options: ["success", "hint", "error", "warning"],
			description: "Variant of the tooltip shown on hover"
		}
	},
	decorators: [
		(Story) => (
			<div style={{ width: 300 }}>
				<Story />
			</div>
		)
	]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: LONG_TEXT
	}
};

export const SingleLine: Story = {
	args: {
		maxLine: 1,
		children: LONG_TEXT
	}
};

export const TwoLines: Story = {
	args: {
		maxLine: 2,
		children: LONG_TEXT
	}
};

export const WithTooltip: Story = {
	args: {
		maxLine: 1,
		useTooltip: true,
		tooltipVariant: "hint",
		children: LONG_TEXT
	}
};

export const ShortText: Story = {
	args: {
		maxLine: 2,
		children: "Short text — no truncation."
	}
};
