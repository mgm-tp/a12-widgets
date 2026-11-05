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

import { MessageBox, Icon, Button } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof MessageBox> = {
	title: "Business Case/MessageBox",
	component: MessageBox,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["info", "success", "warning", "error"],
			description: "Visual variant of the message box"
		},
		label: {
			control: "text",
			description: "The message to be shown at the top of the MessageBox"
		},
		children: {
			control: "text",
			description: "Additional content rendered below the label"
		},
		icon: {
			control: false,
			description: "The icon to be shown before the label, e.g. an error or warning icon"
		},
		action: {
			control: false,
			description: "Element placed on the right of the header, typically a button that shows/hides the content"
		},
		focusOnMessage: {
			control: "boolean",
			description:
				"Sets invisible focus on the message after rendering to support A11Y. With multiple boxes, set it to false on all but one"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		variant: "error",
		label: "Validation failed",
		icon: <Icon>error</Icon>,
		children: "One or more fields have errors. Please review and correct them before submitting."
	}
};

export const Variants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<MessageBox variant="info" label="Information" icon={<Icon>info</Icon>} focusOnMessage={false}>
				This is an informational message providing context about the current state.
			</MessageBox>
			<MessageBox variant="success" label="Success" icon={<Icon>check_circle</Icon>} focusOnMessage={false}>
				The operation completed successfully.
			</MessageBox>
			<MessageBox variant="warning" label="Warning" icon={<Icon>warning</Icon>} focusOnMessage={false}>
				Please review the following information before proceeding.
			</MessageBox>
			<MessageBox variant="error" label="Error" icon={<Icon>error</Icon>} focusOnMessage={false}>
				An error occurred. Please try again or contact support.
			</MessageBox>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "The `variant` prop selects the color scheme: `info`, `success`, `warning` or `error` (default)."
			}
		}
	}
};

export const WithoutIcon: Story = {
	args: {
		variant: "info",
		label: "No icon variant",
		children: "A message box can be displayed without an icon."
	},
	parameters: {
		docs: {
			description: {
				story: "The `icon` prop is optional — without it, the `label` aligns to the left edge of the box."
			}
		}
	}
};

export const WithAction: Story = {
	render: function WithActionExample() {
		const [open, setOpen] = useState(false);

		return (
			<MessageBox
				variant="warning"
				label="3 validation warnings"
				icon={<Icon>warning</Icon>}
				action={
					<Button
						secondary
						icon={<Icon>{open ? "expand_less" : "expand_more"}</Icon>}
						title={open ? "Collapse" : "Expand"}
						onClick={() => setOpen((v) => !v)}
					/>
				}
			>
				{open && (
					<ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
						<li>Field &quot;Name&quot; is required.</li>
						<li>Field &quot;Email&quot; must be a valid email address.</li>
						<li>Field &quot;Phone&quot; must contain exactly 10 digits.</li>
					</ul>
				)}
			</MessageBox>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Use the `action` prop to place a button on the right of the header — typically a toggle to expand or collapse detailed content below the label."
			}
		}
	}
};

export const FocusManagement: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<MessageBox variant="error" label="Submission failed" icon={<Icon>error</Icon>}>
				This box receives invisible focus after rendering, so screen readers announce it.
			</MessageBox>
			<MessageBox variant="warning" label="Unsaved changes" icon={<Icon>warning</Icon>} focusOnMessage={false}>
				This box sets `focusOnMessage` to false so only one box is focused.
			</MessageBox>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`focusOnMessage` (default `true`) sets invisible focus on the message after rendering for accessibility. When rendering multiple boxes, set it to `false` on all but one so only a single box receives focus."
			}
		}
	}
};
