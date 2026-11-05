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

import { Button, ButtonGroup, Icon, ModalNotification, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

const sampleText =
	"This notification contains important information that requires your attention. Please review the details and take the appropriate action before proceeding.";

const variants = ["info", "success", "warning", "error"] as const;

const variantTitles: Record<(typeof variants)[number], string> = {
	info: "Information",
	success: "Operation Successful",
	warning: "Warning",
	error: "Error"
};

const meta: Meta<typeof ModalNotification> = {
	title: "Feedback/ModalNotification",
	component: ModalNotification,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["info", "success", "warning", "error"],
			description: "Visual variant — controls the color scheme and default icon"
		},
		title: {
			control: "text",
			description: "Title displayed in the notification header"
		},
		enableCloseButton: {
			control: "boolean",
			description: "Show a close button in the header (requires onClose)"
		},
		closeOnOutsideClick: {
			control: "boolean",
			description: "Close the modal when clicking outside (requires onClose)"
		},
		closeOnEsc: {
			control: "boolean",
			description: "Close the modal when pressing the Escape key (requires onClose)"
		},
		maxWidth: {
			control: "text",
			description: 'Maximum width of the modal — a number of pixels or a CSS string like "70%"'
		},
		fullscreen: {
			control: "boolean",
			description: "Render the modal overlay fullscreen"
		},
		onClose: {
			description: "Callback triggered when the modal is closed"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		title: "Modal Notification",
		variant: "info",
		enableCloseButton: true,
		closeOnEsc: true,
		onClose: fn()
	},
	render: function PlaygroundExample(args) {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button label="Show Modal" primary onClick={() => setIsOpen(true)} />
				{isOpen && (
					<ModalNotification
						{...args}
						id="playground-modal-notification"
						onClose={() => {
							args.onClose?.();
							setIsOpen(false);
						}}
					>
						<Typography.Body>{sampleText}</Typography.Body>
					</ModalNotification>
				)}
			</>
		);
	}
};

export const Variants: Story = {
	render: function VariantsExample() {
		const [openVariant, setOpenVariant] = useState<(typeof variants)[number] | undefined>(undefined);

		return (
			<>
				<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
					{variants.map((variant) => (
						<Button key={variant} label={`Show ${variantTitles[variant]}`} onClick={() => setOpenVariant(variant)} />
					))}
				</div>
				{openVariant && (
					<ModalNotification
						id={`${openVariant}-modal`}
						title={variantTitles[openVariant]}
						variant={openVariant}
						onClose={() => setOpenVariant(undefined)}
						enableCloseButton
					>
						<Typography.Body>{sampleText}</Typography.Body>
					</ModalNotification>
				)}
			</>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"The `variant` prop selects the color scheme and default icon: `info` (default), `success`, `warning` or `error`."
			}
		}
	}
};

export const WithCustomIcon: Story = {
	render: function WithCustomIconExample() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button label="Show with Custom Icon" primary onClick={() => setIsOpen(true)} />
				{isOpen && (
					<ModalNotification
						id="custom-icon-modal"
						title="Custom Icon Notification"
						icon={<Icon>star</Icon>}
						onClose={() => setIsOpen(false)}
						enableCloseButton
					>
						<Typography.Body>{sampleText}</Typography.Body>
					</ModalNotification>
				)}
			</>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "The `icon` prop replaces the variant's default icon with a custom element."
			}
		}
	}
};

export const WithFooterActions: Story = {
	render: function WithFooterActionsExample() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button label="Show with Footer Actions" primary onClick={() => setIsOpen(true)} />
				{isOpen && (
					<ModalNotification
						id="footer-actions-modal"
						title="Action Required"
						variant="warning"
						onClose={() => setIsOpen(false)}
						enableCloseButton
						footer={
							<ButtonGroup>
								<Button label="Cancel" onClick={() => setIsOpen(false)} />
								<Button label="Confirm" primary onClick={() => setIsOpen(false)} />
							</ButtonGroup>
						}
					>
						<Typography.Body>{sampleText}</Typography.Body>
					</ModalNotification>
				)}
			</>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"The `footer` prop renders custom content below the body — typically a `ButtonGroup` with confirm/cancel actions."
			}
		}
	}
};

export const WithHeadingButtons: Story = {
	render: function WithHeadingButtonsExample() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button label="Show with Heading Buttons" primary onClick={() => setIsOpen(true)} />
				{isOpen && (
					<ModalNotification
						id="heading-buttons-modal"
						title="Notification with Actions"
						onClose={() => setIsOpen(false)}
						enableCloseButton
						headingButtons={
							<>
								<Button icon={<Icon>edit</Icon>} title="Edit" onClick={() => {}} />
								<Button icon={<Icon>share</Icon>} title="Share" onClick={() => {}} />
							</>
						}
					>
						<Typography.Body>{sampleText}</Typography.Body>
					</ModalNotification>
				)}
			</>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "The `headingButtons` prop places additional icon buttons in the header, next to the close button."
			}
		}
	}
};

export const CloseOnOutsideClick: Story = {
	render: function CloseOnOutsideClickExample() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button label="Show Modal (close on outside click)" primary onClick={() => setIsOpen(true)} />
				{isOpen && (
					<ModalNotification
						id="outside-click-modal"
						title="Close On Outside Click"
						onClose={() => setIsOpen(false)}
						closeOnOutsideClick
						closeOnEsc
					>
						<Typography.Body>Click outside this modal or press ESC to close it.</Typography.Body>
					</ModalNotification>
				)}
			</>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`closeOnOutsideClick` and `closeOnEsc` dismiss the modal without a close button. Both require an `onClose` callback."
			}
		}
	}
};
