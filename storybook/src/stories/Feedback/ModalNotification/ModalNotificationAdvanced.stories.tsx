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

const meta: Meta<typeof ModalNotification> = {
	title: "Feedback/ModalNotification/Advanced",
	component: ModalNotification,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const Demo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<>
					<Button label="Show Notification" primary onClick={() => setIsOpen(true)} />
					{isOpen && (
						<ModalNotification
							id="advanced-default"
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

		return <Demo />;
	},
	args: { onClose: fn() }
};

export const WithCustomIcon: Story = {
	render: () => {
		const Demo = () => {
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
		};

		return <Demo />;
	},
	args: { onClose: fn() }
};

export const WithFooterActions: Story = {
	render: () => {
		const Demo = () => {
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
		};

		return <Demo />;
	},
	args: { onClose: fn() }
};

export const WithHeadingButtons: Story = {
	render: () => {
		const Demo = () => {
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
		};

		return <Demo />;
	},
	args: { onClose: fn() }
};

export const CloseOnOutsideClick: Story = {
	render: () => {
		const Demo = () => {
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
		};

		return <Demo />;
	},
	args: { onClose: fn() }
};
