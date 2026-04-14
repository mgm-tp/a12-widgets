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

import { ModalOverlay, Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ModalOverlay> = {
	title: "Widgets/Layout/ModalOverlay",
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
								<h2 style={{ margin: "0 0 16px 0" }}>Modal Title</h2>
								<p>This is a basic modal overlay. Click outside or press ESC to close.</p>
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
								<h2 style={{ margin: "0 0 16px 0" }}>Wide Modal</h2>
								<p>This modal has a maximum width of 600px.</p>
								<p>It's useful for displaying larger content like forms or detailed information.</p>
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
									<h2 style={{ margin: 0 }}>Fullscreen Modal</h2>
									<Button icon={<Icon>close</Icon>} onClick={() => setIsOpen(false)} title="Close" />
								</div>
								<div style={{ flex: 1 }}>
									<p>This modal takes up the entire screen.</p>
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
									<h2 style={{ margin: 0 }}>Confirm Deletion</h2>
								</div>
								<p>Are you sure you want to delete this item? This action cannot be undone.</p>
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

			return (
				<>
					<Button label="Add New User" primary icon={<Icon>add</Icon>} onClick={() => setIsOpen(true)} />
					{isOpen && (
						<ModalOverlay onClose={() => setIsOpen(false)} closeOnEsc maxWidth={450}>
							<div style={{ padding: "24px" }}>
								<h2 style={{ margin: "0 0 24px 0" }}>Add New User</h2>
								<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
									<div>
										<label htmlFor="user-name" style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
											Name
										</label>
										<input
											id="user-name"
											type="text"
											placeholder="Enter name"
											style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
										/>
									</div>
									<div>
										<label htmlFor="user-email" style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
											Email
										</label>
										<input
											id="user-email"
											type="email"
											placeholder="Enter email"
											style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
										/>
									</div>
									<div>
										<label htmlFor="user-role" style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
											Role
										</label>
										<select
											id="user-role"
											style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
										>
											<option>User</option>
											<option>Admin</option>
											<option>Editor</option>
										</select>
									</div>
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

export const NoGutter: Story = {
	render: () => {
		const ModalDemo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<>
					<Button label="Open No Gutter Modal" onClick={() => setIsOpen(true)} />
					{isOpen && (
						<ModalOverlay onClose={() => setIsOpen(false)} closeOnEsc noGutter>
							<div style={{ width: "400px" }}>
								<div
									style={{
										height: "150px",
										backgroundColor: "#1976d2",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "white"
									}}
								>
									<Icon size="big">image</Icon>
								</div>
								<div style={{ padding: "24px" }}>
									<h2 style={{ margin: "0 0 8px 0" }}>No Gutter Modal</h2>
									<p style={{ margin: 0, color: "#666" }}>
										This modal has no gutter, allowing content to extend to the edges.
									</p>
									<div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
										<Button label="Close" onClick={() => setIsOpen(false)} />
									</div>
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
