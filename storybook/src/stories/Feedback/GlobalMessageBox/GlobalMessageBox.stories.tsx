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
import { fn } from "storybook/test";

import { GlobalMessageBox, Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof GlobalMessageBox> = {
	title: "Feedback/GlobalMessageBox",
	component: GlobalMessageBox,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["info", "success", "warning", "error"],
			description: "Visual variant — controls color and default icon"
		},
		content: {
			control: "text",
			description: "Main message content displayed inside the box"
		},
		ellipsis: {
			control: "boolean",
			description: "When true, truncates content to a single line with an ellipsis"
		},
		focusOnMount: {
			control: "boolean",
			description: "Set invisible focus on the box when mounted (supports accessibility)"
		},
		icon: {
			description: "Custom icon rendered on the left side; defaults to the variant icon"
		},
		actions: {
			description: "Action elements rendered on the right side (e.g. buttons)"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		variant: "info",
		content: "System maintenance is scheduled for tonight between 22:00 and 23:00.",
		actions: <Button invert icon={<Icon>close</Icon>} title="Dismiss" onClick={fn()} />,
		focusOnMount: false
	}
};

export const Info: Story = {
	args: {
		variant: "info",
		content: "System maintenance is scheduled for tonight between 22:00 and 23:00.",
		actions: <Button invert icon={<Icon>close</Icon>} title="Dismiss" onClick={fn()} />,
		focusOnMount: false
	}
};

export const Success: Story = {
	args: {
		variant: "success",
		content: "Your account has been verified successfully.",
		actions: <Button invert icon={<Icon>close</Icon>} title="Dismiss" onClick={fn()} />,
		focusOnMount: false
	}
};

export const Warning: Story = {
	args: {
		variant: "warning",
		content: "Your session will expire in 10 minutes. Please save your work.",
		actions: <Button invert icon={<Icon>close</Icon>} title="Dismiss" onClick={fn()} />,
		focusOnMount: false
	}
};

export const Error: Story = {
	args: {
		variant: "error",
		content: "A critical error occurred. Please contact your system administrator.",
		actions: <Button invert icon={<Icon>close</Icon>} title="Dismiss" onClick={fn()} />,
		focusOnMount: false
	}
};

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
			<GlobalMessageBox
				variant="info"
				content="This is an informational message."
				actions={<Button invert icon={<Icon>close</Icon>} title="Dismiss" />}
				focusOnMount={false}
			/>
			<GlobalMessageBox
				variant="success"
				content="This is a success message."
				actions={<Button invert icon={<Icon>close</Icon>} title="Dismiss" />}
				focusOnMount={false}
			/>
			<GlobalMessageBox
				variant="warning"
				content="This is a warning message."
				actions={<Button invert icon={<Icon>close</Icon>} title="Dismiss" />}
				focusOnMount={false}
			/>
			<GlobalMessageBox
				variant="error"
				content="This is an error message."
				actions={<Button invert icon={<Icon>close</Icon>} title="Dismiss" />}
				focusOnMount={false}
			/>
		</div>
	)
};

export const WithActions: Story = {
	args: {
		variant: "warning",
		content: "A new version of the application is available.",
		actions: (
			<div style={{ display: "flex", gap: "8px" }}>
				<Button primary invert label="Update now" />
				<Button secondary invert icon={<Icon>close</Icon>} title="Dismiss" />
			</div>
		),
		focusOnMount: false
	}
};

export const WithCustomIcon: Story = {
	args: {
		variant: "info",
		icon: <Icon>campaign</Icon>,
		content: "New features are available. Check the release notes for details.",
		actions: <Button invert icon={<Icon>close</Icon>} title="Dismiss" onClick={fn()} />,
		focusOnMount: false
	}
};

export const EllipsisContent: Story = {
	args: {
		variant: "info",
		ellipsis: true,
		content:
			"This is a very long message that will be truncated to a single line when the ellipsis option is enabled. Users can toggle this to show the full content when needed.",
		actions: <Button invert icon={<Icon>close</Icon>} title="Dismiss" onClick={fn()} />,
		focusOnMount: false
	}
};

export const DismissableMessage: Story = {
	render: () => {
		const DismissableDemo = () => {
			const [visible, setVisible] = useState(true);

			if (!visible) {
				return <Button label="Show message" primary onClick={() => setVisible(true)} />;
			}

			return (
				<GlobalMessageBox
					variant="info"
					content="Click the dismiss button to hide this message."
					actions={<Button invert icon={<Icon>close</Icon>} title="Dismiss" onClick={() => setVisible(false)} />}
					focusOnMount={false}
				/>
			);
		};

		return <DismissableDemo />;
	}
};

export const ToggleEllipsis: Story = {
	render: () => {
		const ToggleEllipsisDemo = () => {
			const [ellipsis, setEllipsis] = useState(true);

			return (
				<GlobalMessageBox
					variant="info"
					icon={<Icon>speaker_notes</Icon>}
					content="This is a detailed notification with a lot of content. When ellipsis is enabled the text is truncated to a single line. Click the expand button to show the full message. Click collapse to hide it again."
					ellipsis={ellipsis}
					actions={
						<Button
							invert
							icon={<Icon>{ellipsis ? "unfold_more" : "unfold_less"}</Icon>}
							title={ellipsis ? "Expand" : "Collapse"}
							onClick={() => setEllipsis((prev) => !prev)}
						/>
					}
					focusOnMount={false}
				/>
			);
		};

		return <ToggleEllipsisDemo />;
	}
};
