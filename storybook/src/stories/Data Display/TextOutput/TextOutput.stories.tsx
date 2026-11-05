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

import { TextOutput, ErrorTooltip, HintTooltip, WarningTooltip } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof TextOutput> = {
	title: "Data Display/TextOutput",
	component: TextOutput,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		label: {
			control: "text",
			description: "Label shown above the value"
		},
		children: {
			control: "text",
			description: "Content (value) of the text output"
		},
		errorMessage: {
			control: "text",
			description: "Error message shown between label and value"
		},
		warningMessage: {
			control: "text",
			description: "Warning message shown between label and value"
		},
		infoMessage: {
			control: "text",
			description: "Info message shown between label and value"
		},
		alignment: {
			control: "select",
			options: ["left", "right", "center"],
			description: "Text alignment of the value"
		},
		noData: {
			control: "boolean",
			description: "Render an empty placeholder for missing data"
		},
		disableParagraphWrapping: {
			control: "boolean",
			description: "Do not wrap the content in an HTML paragraph (recommended inside table cells)"
		},
		addonAfter: {
			control: false,
			description: "Addons placed after the content, e.g. tooltips"
		},
		tooltips: {
			control: false,
			description: "Additional tooltips rendered next to the label"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		label: "Full Name",
		children: "Jane Doe"
	}
};

export const Messages: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<TextOutput label="Email" errorMessage="Invalid email address">
				invalid@
			</TextOutput>
			<TextOutput label="Budget" warningMessage="Near budget limit">
				€ 4,900
			</TextOutput>
			<TextOutput label="Membership" infoMessage="Renews automatically">
				Premium
			</TextOutput>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`errorMessage`, `warningMessage` and `infoMessage` render a validation-style message between the label and the value."
			}
		}
	}
};

export const NoData: Story = {
	args: {
		label: "Phone",
		noData: true
	},
	parameters: {
		docs: {
			description: {
				story: "`noData` renders an italic dash placeholder in a muted color to indicate missing data."
			}
		}
	}
};

export const Alignment: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<TextOutput label="Left (default)" alignment="left">
				€ 1,250.00
			</TextOutput>
			<TextOutput label="Center" alignment="center">
				€ 1,250.00
			</TextOutput>
			<TextOutput label="Right" alignment="right">
				€ 1,250.00
			</TextOutput>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`alignment` aligns the value `left` (default), `center` or `right` — right alignment is typical for numeric values."
			}
		}
	}
};

export const TooltipsAndAddons: Story = {
	args: {
		label: "Project status",
		children: "Two deliverables are overdue and the budget forecast exceeds the approved limit.",
		tooltips: <HintTooltip text="Status is recalculated every night" />,
		addonAfter: [
			<ErrorTooltip key="error" text="Deliverables overdue" />,
			<WarningTooltip key="warning" text="Budget forecast exceeded" />
		]
	},
	parameters: {
		docs: {
			description: {
				story:
					"`tooltips` places tooltips next to the label, while `addonAfter` places addons (such as tooltips) after the content."
			}
		}
	}
};
