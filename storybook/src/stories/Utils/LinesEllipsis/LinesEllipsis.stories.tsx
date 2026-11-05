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

import { LinesEllipsis } from "@com.mgmtp.a12.widgets/widgets-core";

const LONG_TEXT =
	"This is a very long text that should be truncated when it exceeds the maximum number of lines. " +
	"LinesEllipsis uses JavaScript measurement for precise truncation at the word or letter boundary.";

const meta: Meta<typeof LinesEllipsis> = {
	title: "Utils/LinesEllipsis",
	component: LinesEllipsis,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		text: {
			control: "text",
			description: "The text to clamp. Non-string content requires `htmlSupport`"
		},
		maxLine: {
			control: { type: "number", min: 1, max: 10 },
			description: "Maximum number of lines before truncation"
		},
		ellipsis: {
			control: "text",
			description: "Content rendered at the truncation point (default: `...`)"
		},
		basedOn: {
			control: "select",
			options: ["letters", "words"],
			description: "Whether to truncate at letter or word boundaries"
		},
		trimRight: {
			control: "boolean",
			description: "Trim trailing whitespace so the ellipsis never sits on an empty line"
		},
		component: {
			control: "text",
			description: "Tag name of the rendered root node (default: `div`)"
		},
		responsive: {
			control: "boolean",
			description: "Re-compute truncation on container resize"
		},
		htmlSupport: {
			control: "boolean",
			description: "Allow HTML in the text prop (experimental)"
		},
		onReflow: {
			description: "Callback invoked when the reflow logic completes"
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

export const Playground: Story = {
	args: {
		text: LONG_TEXT,
		maxLine: 2
	}
};

export const MaxLines: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			{[1, 2, 3].map((maxLine) => (
				<div key={maxLine}>
					<strong>{`maxLine: ${maxLine}`}</strong>
					<LinesEllipsis text={LONG_TEXT} maxLine={maxLine} />
				</div>
			))}
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "`maxLine` sets how many lines are allowed before the text is clamped. The default is `1`."
			}
		}
	}
};

export const TruncateByWords: Story = {
	args: {
		text: LONG_TEXT,
		maxLine: 2,
		basedOn: "words"
	},
	parameters: {
		docs: {
			description: {
				story:
					'`basedOn="words"` truncates at word boundaries instead of letters. By default the widget makes a guess based on the text.'
			}
		}
	}
};

export const CustomEllipsis: Story = {
	args: {
		text: LONG_TEXT,
		maxLine: 1,
		ellipsis: " [read more]"
	},
	parameters: {
		docs: {
			description: {
				story: "The `ellipsis` prop replaces the default `...` with custom content rendered at the truncation point."
			}
		}
	}
};
