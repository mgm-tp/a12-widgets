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
	argTypes: {
		closeOnEsc: {
			control: "boolean",
			description: "If true, the modal can be closed by pressing the ESC key (requires `onClose`)"
		},
		closeOnOutsideClick: {
			control: "boolean",
			description: "If true, the modal can be closed by clicking outside (requires `onClose`)"
		},
		fullscreen: {
			control: "boolean",
			description: "If true, the modal will be fullscreen"
		},
		noGutter: {
			control: "boolean",
			description: "If true, the modal will not have internal padding (gutter)"
		},
		preventScroll: {
			control: "boolean",
			description: "If true, the modal will prevent scroll events"
		},
		focusBack: {
			control: "boolean",
			description: "Focus back to the trigger element when the modal is closed"
		},
		maxWidth: {
			control: "text",
			description: 'Maximum width of the modal — number of pixels or a string like "70%"'
		},
		focusOnOpen: {
			control: "boolean",
			description: "Focus the modal container when it is opened"
		},
		fitToParent: {
			control: "boolean",
			description: "Display the modal within the parent element instead of the viewport"
		}
	},
	args: {
		onClose: fn(),
		onOpen: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		closeOnEsc: true,
		closeOnOutsideClick: true,
		maxWidth: 480
	},
	render: function PlaygroundExample(args) {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button label="Open Modal" primary onClick={() => setIsOpen(true)} />
				{isOpen && (
					<ModalOverlay
						{...args}
						onClose={() => {
							args.onClose?.();
							setIsOpen(false);
						}}
					>
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
	}
};

export const WithMaxWidth: Story = {
	render: function WithMaxWidthExample() {
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
	},
	parameters: {
		docs: {
			description: {
				story: '`maxWidth` caps the modal width — pass a number of pixels or a string such as `"70%"`.'
			}
		}
	}
};

export const Fullscreen: Story = {
	render: function FullscreenExample() {
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
	},
	parameters: {
		docs: {
			description: {
				story: "`fullscreen` makes the modal cover the entire viewport — useful for immersive editing flows."
			}
		}
	}
};

export const NoGutter: Story = {
	render: function NoGutterExample() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button label="Open No-Gutter Modal" primary onClick={() => setIsOpen(true)} />
				{isOpen && (
					<ModalOverlay onClose={() => setIsOpen(false)} closeOnEsc closeOnOutsideClick noGutter>
						<div
							style={{
								background: "#1976d2",
								height: "150px",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								padding: "0 24px"
							}}
						>
							<Typography.Headline level={2} style={{ margin: 0, color: "#ffffff" }}>
								Custom Header
							</Typography.Headline>
							<Button
								icon={<Icon>close</Icon>}
								title="Close"
								onClick={() => setIsOpen(false)}
								style={{ color: "#ffffff" }}
							/>
						</div>
						<div style={{ padding: "24px" }}>
							<Typography.Body>
								The <code>noGutter</code> prop removes the default internal padding so custom content fills the modal
								edge-to-edge. This is useful for modals with image headers or custom layouts.
							</Typography.Body>
							<div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
								<Button label="Close" onClick={() => setIsOpen(false)} />
							</div>
						</div>
					</ModalOverlay>
				)}
			</>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"When `noGutter` is set, the modal removes its default padding. Useful for edge-to-edge content like image headers."
			}
		}
	}
};

export const ConfirmationDialog: Story = {
	render: function ConfirmationDialogExample() {
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"A typical confirmation dialog composition: warning icon, message and a `Cancel`/`Delete` action row. `closeOnOutsideClick` is intentionally omitted so the user must make an explicit choice."
			}
		}
	}
};

export const FormModal: Story = {
	render: function FormModalExample() {
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"A modal hosting a form with `TextField` and `Select` widgets. Note that `closeOnOutsideClick` is omitted — portal-based fields (e.g. `Select`, `DatePicker`) render outside the modal and would otherwise close it."
			}
		}
	}
};
