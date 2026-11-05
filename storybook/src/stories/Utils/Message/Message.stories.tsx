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

import { Message } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Message> = {
	title: "Utils/Message",
	component: Message,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		children: {
			control: "text",
			description: "The message content"
		},
		className: {
			control: "text",
			description: "Additional css class names"
		},
		id: {
			control: "text",
			description: "Html id attribute of the message element"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		children: "This is a simple message component used to display inline text content."
	}
};

export const FormattedContent: Story = {
	render: () => (
		<Message>
			<strong>Note:</strong> This field is required and must be unique across all records.
		</Message>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Message accepts any `children`, so the content can contain formatted text like bold text or inline elements."
			}
		}
	}
};

export const LongContent: Story = {
	args: {
		children:
			"Longer messages wrap with the surrounding layout. The message inherits its color, font and padding from the " +
			"theme, so it stays visually consistent with the rest of the application without any additional styling."
	},
	parameters: {
		docs: {
			description: {
				story:
					"Long messages wrap naturally inside their container; typography and `padding` come from the theme configuration."
			}
		}
	}
};
