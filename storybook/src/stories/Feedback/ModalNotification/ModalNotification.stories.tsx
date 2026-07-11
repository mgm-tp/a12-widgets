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

import { Button, ModalNotification, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

const sampleText =
	"This notification contains important information that requires your attention. Please review the details and take the appropriate action before proceeding.";

const meta: Meta<typeof ModalNotification> = {
	title: "Feedback/ModalNotification",
	component: ModalNotification,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
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
		onClose: {
			description: "Callback triggered when the modal is closed"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => {
		const DefaultDemo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<>
					<Button label="Show Modal" primary onClick={() => setIsOpen(true)} />
					{isOpen && (
						<ModalNotification
							{...args}
							id="default-modal-notification"
							title="Modal Notification"
							onClose={() => setIsOpen(false)}
							enableCloseButton
						>
							<Typography.Body>{sampleText}</Typography.Body>
						</ModalNotification>
					)}
				</>
			);
		};

		return <DefaultDemo />;
	},
	args: {
		onClose: fn()
	}
};

export const Basic: Story = {
	render: (args) => {
		const BasicDemo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<>
					<Button label="Show Modal" primary onClick={() => setIsOpen(true)} />
					{isOpen && (
						<ModalNotification
							{...args}
							id="basic-modal-notification"
							title="Modal Notification"
							onClose={() => setIsOpen(false)}
							enableCloseButton
						>
							<Typography.Body>{sampleText}</Typography.Body>
						</ModalNotification>
					)}
				</>
			);
		};

		return <BasicDemo />;
	},
	args: {
		onClose: fn()
	},
	parameters: {
		docs: {
			description: {
				story: "Basic modal notification with a close button. Click the button to open the modal."
			}
		}
	}
};

export const InfoVariant: Story = {
	render: () => {
		const InfoDemo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<>
					<Button label="Show Info" primary onClick={() => setIsOpen(true)} />
					{isOpen && (
						<ModalNotification
							id="info-modal"
							title="Information"
							variant="info"
							onClose={() => setIsOpen(false)}
							enableCloseButton
						>
							<Typography.Body>{sampleText}</Typography.Body>
						</ModalNotification>
					)}
				</>
			);
		};

		return <InfoDemo />;
	},
	parameters: {
		docs: {
			description: {
				story: "Info variant — default styling for informational messages."
			}
		}
	}
};

export const SuccessVariant: Story = {
	render: () => {
		const SuccessDemo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<>
					<Button label="Show Success" primary onClick={() => setIsOpen(true)} />
					{isOpen && (
						<ModalNotification
							id="success-modal"
							title="Operation Successful"
							variant="success"
							onClose={() => setIsOpen(false)}
							enableCloseButton
						>
							<Typography.Body>The operation completed successfully. All records have been saved.</Typography.Body>
						</ModalNotification>
					)}
				</>
			);
		};

		return <SuccessDemo />;
	},
	parameters: {
		docs: {
			description: {
				story: "Success variant — used to confirm that an action completed successfully."
			}
		}
	}
};

export const WarningVariant: Story = {
	render: () => {
		const WarningDemo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<>
					<Button label="Show Warning" primary onClick={() => setIsOpen(true)} />
					{isOpen && (
						<ModalNotification
							id="warning-modal"
							title="Warning"
							variant="warning"
							onClose={() => setIsOpen(false)}
							enableCloseButton
						>
							<Typography.Body>
								Some fields are incomplete. Saving now may result in missing data. Do you want to continue?
							</Typography.Body>
						</ModalNotification>
					)}
				</>
			);
		};

		return <WarningDemo />;
	},
	parameters: {
		docs: {
			description: {
				story: "Warning variant — alerts the user to a potential issue before proceeding."
			}
		}
	}
};

export const ErrorVariant: Story = {
	render: () => {
		const ErrorDemo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<>
					<Button label="Show Error" primary onClick={() => setIsOpen(true)} />
					{isOpen && (
						<ModalNotification
							id="error-modal"
							title="Error"
							variant="error"
							onClose={() => setIsOpen(false)}
							enableCloseButton
						>
							<Typography.Body>
								An error occurred while saving the record. Please try again or contact support.
							</Typography.Body>
						</ModalNotification>
					)}
				</>
			);
		};

		return <ErrorDemo />;
	},
	parameters: {
		docs: {
			description: {
				story: "Error variant — indicates a failure that requires user attention."
			}
		}
	}
};
