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

import { ModalOverlay, Button, Icon, Typography, TextField, Select } from "@com.mgmtp.a12.widgets/widgets-core";
import type { SelectItem } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ModalOverlay> = {
	title: "Layout/ModalOverlay",
	component: ModalOverlay,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	argTypes: {
		closeOnEsc: {
			control: "boolean",
			description: "If true, the modal can be closed by pressing ESC key"
		},
		closeOnOutsideClick: {
			control: "boolean",
			description: "If true, the modal can be closed by clicking outside"
		},
		fullscreen: {
			control: "boolean",
			description: "If true, the modal will be fullscreen"
		},
		noGutter: {
			control: "boolean",
			description: "If true, the modal will not have gutter"
		},
		preventScroll: {
			control: "boolean",
			description: "If true, the modal will prevent scroll events"
		},
		focusBack: {
			control: "boolean",
			description: "Focus back to trigger element when closed"
		},
		maxWidth: {
			control: "text",
			description: "Maximum width of the modal"
		},
		focusOnOpen: {
			control: "boolean",
			description: "Focus on modal container when opened"
		},
		fitToParent: {
			control: "boolean",
			description: "Display modal within the parent"
		}
	},
	args: {
		onClose: fn(),
		onOpen: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const ModalDemo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<>
					<Button label="Open Modal" primary onClick={() => setIsOpen(true)} />
					{isOpen && (
						<ModalOverlay onClose={() => setIsOpen(false)} closeOnEsc closeOnOutsideClick>
							<div style={{ padding: "24px", minWidth: "300px" }}>
								<Typography.Headline level={2} style={{ margin: "0 0 16px 0" }}>
									Modal Title
								</Typography.Headline>
								<Typography.Body>This is a basic modal overlay. Click outside or press ESC to close.</Typography.Body>
								<div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
									<Button label="Cancel" onClick={() => setIsOpen(false)} />
									<Button label="Confirm" primary onClick={() => setIsOpen(false)} />
								</div>
							</div>
						</ModalOverlay>
					)}
				</>
			);
		};

		return <ModalDemo />;
	}
};

export const WithMaxWidth: Story = {
	render: () => {
		const ModalDemo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<>
					<Button label="Open Wide Modal" primary onClick={() => setIsOpen(true)} />
					{isOpen && (
						<ModalOverlay onClose={() => setIsOpen(false)} closeOnEsc maxWidth={600}>
							<div style={{ padding: "24px" }}>
								<Typography.Headline level={2} style={{ margin: "0 0 16px 0" }}>
									Wide Modal
								</Typography.Headline>
								<Typography.Body>This modal has a maximum width of 600px.</Typography.Body>
								<Typography.Body>
									It's useful for displaying larger content like forms or detailed information.
								</Typography.Body>
								<div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
									<Button label="Close" onClick={() => setIsOpen(false)} />
								</div>
							</div>
						</ModalOverlay>
					)}
				</>
			);
		};

		return <ModalDemo />;
	}
};

export const Fullscreen: Story = {
	render: () => {
		const ModalDemo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<>
					<Button label="Open Fullscreen Modal" primary onClick={() => setIsOpen(true)} />
					{isOpen && (
						<ModalOverlay onClose={() => setIsOpen(false)} closeOnEsc fullscreen>
							<div style={{ padding: "24px", height: "100%", display: "flex", flexDirection: "column" }}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										marginBottom: "16px"
									}}
								>
									<Typography.Headline level={2} style={{ margin: 0 }}>
										Fullscreen Modal
									</Typography.Headline>
									<Button icon={<Icon>close</Icon>} onClick={() => setIsOpen(false)} title="Close" />
								</div>
								<div style={{ flex: 1 }}>
									<Typography.Body>This modal takes up the entire screen.</Typography.Body>
								</div>
							</div>
						</ModalOverlay>
					)}
				</>
			);
		};

		return <ModalDemo />;
	}
};

export const ConfirmationDialog: Story = {
	render: () => {
		const ModalDemo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<>
					<Button label="Delete Item" destructive onClick={() => setIsOpen(true)} />
					{isOpen && (
						<ModalOverlay onClose={() => setIsOpen(false)} closeOnEsc>
							<div style={{ padding: "24px", maxWidth: "400px" }}>
								<div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
									<Icon variant="warning">warning</Icon>
									<Typography.Headline level={2} style={{ margin: 0 }}>
										Confirm Deletion
									</Typography.Headline>
								</div>
								<Typography.Body>
									Are you sure you want to delete this item? This action cannot be undone.
								</Typography.Body>
								<div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
									<Button label="Cancel" onClick={() => setIsOpen(false)} />
									<Button label="Delete" destructive primary onClick={() => setIsOpen(false)} />
								</div>
							</div>
						</ModalOverlay>
					)}
				</>
			);
		};

		return <ModalDemo />;
	}
};

export const FormModal: Story = {
	render: () => {
		const ModalDemo = () => {
			const [isOpen, setIsOpen] = useState(false);
			const [role, setRole] = useState<string | undefined>(undefined);

			const roleItems: SelectItem[] = [
				{ value: "user", label: "User" },
				{ value: "admin", label: "Admin" },
				{ value: "editor", label: "Editor" }
			];

			return (
				<>
					<Button label="Add New User" primary icon={<Icon>add</Icon>} onClick={() => setIsOpen(true)} />
					{isOpen && (
						<ModalOverlay onClose={() => setIsOpen(false)} closeOnEsc maxWidth={450}>
							<div style={{ padding: "24px" }}>
								<Typography.Headline level={2} style={{ margin: "0 0 24px 0" }}>
									Add New User
								</Typography.Headline>
								<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
									<TextField id="user-name" label="Name" placeholder="Enter name" />
									<TextField id="user-email" label="Email" placeholder="Enter email" />
									<Select
										id="user-role"
										label="Role"
										placeholder="Select role..."
										items={roleItems}
										value={role}
										onValueChanged={setRole}
									/>
								</div>
								<div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
									<Button label="Cancel" onClick={() => setIsOpen(false)} />
									<Button label="Save User" primary onClick={() => setIsOpen(false)} />
								</div>
							</div>
						</ModalOverlay>
					)}
				</>
			);
		};

		return <ModalDemo />;
	}
};
