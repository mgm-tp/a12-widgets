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
import { useRef, useState, useCallback } from "react";

import { Callout, Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Callout> = {
	title: "Layout/Callout",
	component: Callout,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		referenceElement: {
			control: false,
			description: "The callout anchors to this reference element"
		},
		referenceElementRect: {
			control: false,
			description:
				"DOMRect of the trigger element — useful for recalculating the orientation when the reference element is overlapped by other elements"
		},
		orientationList: {
			control: false,
			description: "Preferred orientations used to align the callout to the `referenceElement` on initial mount"
		},
		closeOnOutsideClick: {
			control: "boolean",
			description: "Clicking outside will close the callout"
		},
		closeOnEsc: {
			control: "boolean",
			description: "Pressing Escape will close the callout"
		},
		closeOnClickReferenceElement: {
			control: "boolean",
			description: "Clicking the reference element again will close the callout"
		},
		isPointerVisible: {
			control: "boolean",
			description: "Show a pointer arrow indicating the reference element"
		},
		padding: {
			control: "text",
			description: "Padding for the callout content area — `true` (default), `false` (no padding) or a custom CSS value"
		},
		header: {
			control: false,
			description: "Header of the callout with optional `prefix`, `title` and `suffix`"
		},
		footer: {
			control: false,
			description: "Footer content, typically used for action buttons"
		},
		resizeAndDragOptions: {
			control: false,
			description: "Makes the callout resizable and draggable (not supported on phone devices)"
		},
		boundToContentbox: {
			control: false,
			description:
				"Initially expands the callout to the width of the Contentbox's content area — only works when `resizeAndDragOptions` is enabled"
		},
		onClose: {
			control: false,
			description: "Called when the callout requests to be closed"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		closeOnOutsideClick: true,
		closeOnEsc: true,
		closeOnClickReferenceElement: true,
		isPointerVisible: false
	},
	render: function PlaygroundExample(args) {
		const [buttonEl, setButtonEl] = useState<HTMLButtonElement | null>(null);
		const [open, setOpen] = useState(true);

		const handleButtonRef = useCallback((ref: HTMLButtonElement | null) => {
			setButtonEl(ref);
		}, []);

		const toggle = useCallback(() => setOpen((prev) => !prev), []);
		const handleClose = useCallback(() => setOpen(false), []);

		return (
			<div style={{ padding: "40px" }}>
				<Button buttonRef={handleButtonRef} onClick={toggle} label="Open Callout" />
				{open && buttonEl && (
					<Callout
						{...args}
						id="playground-callout"
						referenceElement={buttonEl}
						onClose={handleClose}
						header={{
							title: <span>Callout Title</span>,
							suffix: <Button icon={<Icon>close</Icon>} title="Close" onClick={handleClose} />
						}}
					>
						<p style={{ margin: 0 }}>This is the callout content. It anchors to the reference element.</p>
					</Callout>
				)}
			</div>
		);
	}
};

export const WithPointer: Story = {
	render: function WithPointerExample() {
		const buttonRef = useRef<HTMLButtonElement | null>(null);
		const [open, setOpen] = useState(false);

		const handleButtonRef = useCallback((ref: HTMLButtonElement | null) => {
			buttonRef.current = ref;
		}, []);

		const toggle = useCallback(() => setOpen((prev) => !prev), []);
		const handleClose = useCallback(() => setOpen(false), []);

		return (
			<div style={{ padding: "40px" }}>
				<Button buttonRef={handleButtonRef} onClick={toggle} label="Open Callout with Pointer" />
				{open && buttonRef.current && (
					<Callout
						id="pointer-callout"
						referenceElement={buttonRef.current}
						isPointerVisible
						onClose={handleClose}
						header={{
							title: <span>Callout with Pointer</span>,
							suffix: <Button icon={<Icon>close</Icon>} title="Close" onClick={handleClose} />
						}}
					>
						<p style={{ margin: 0 }}>The pointer arrow shows which element triggered this callout.</p>
					</Callout>
				)}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`isPointerVisible` renders an arrow pointing at the `referenceElement`, so users can see which element triggered the callout."
			}
		}
	}
};

export const WithHeader: Story = {
	render: function WithHeaderExample() {
		const buttonRef = useRef<HTMLButtonElement | null>(null);
		const [open, setOpen] = useState(false);

		const handleButtonRef = useCallback((ref: HTMLButtonElement | null) => {
			buttonRef.current = ref;
		}, []);

		const toggle = useCallback(() => setOpen((prev) => !prev), []);
		const handleClose = useCallback(() => setOpen(false), []);

		return (
			<div style={{ padding: "40px" }}>
				<Button buttonRef={handleButtonRef} onClick={toggle} label="Open Callout with Full Header" />
				{open && buttonRef.current && (
					<Callout
						id="header-callout"
						referenceElement={buttonRef.current}
						onClose={handleClose}
						header={{
							prefix: <Icon>info</Icon>,
							title: <span>Information</span>,
							suffix: <Button icon={<Icon>close</Icon>} title="Close" onClick={handleClose} />
						}}
					>
						<p style={{ margin: 0 }}>This callout has a header with a prefix icon, title, and a close button suffix.</p>
					</Callout>
				)}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "The `header` prop accepts a `prefix` (e.g. an icon), a `title` and a `suffix` (e.g. a close button)."
			}
		}
	}
};

export const WithFooter: Story = {
	render: function WithFooterExample() {
		const buttonRef = useRef<HTMLButtonElement | null>(null);
		const [open, setOpen] = useState(false);

		const handleButtonRef = useCallback((ref: HTMLButtonElement | null) => {
			buttonRef.current = ref;
		}, []);

		const toggle = useCallback(() => setOpen((prev) => !prev), []);
		const handleClose = useCallback(() => setOpen(false), []);

		return (
			<div style={{ padding: "40px" }}>
				<Button buttonRef={handleButtonRef} onClick={toggle} label="Open Callout with Footer" />
				{open && buttonRef.current && (
					<Callout
						id="footer-callout"
						referenceElement={buttonRef.current}
						onClose={handleClose}
						header={{
							title: <span>Callout with Footer</span>,
							suffix: <Button icon={<Icon>close</Icon>} title="Close" onClick={handleClose} />
						}}
						footer={
							<div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
								<Button onClick={handleClose} label="Cancel" />
								<Button primary onClick={handleClose} label="Confirm" />
							</div>
						}
					>
						<p style={{ margin: 0 }}>Callouts can include a footer area for action buttons.</p>
					</Callout>
				)}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "The `footer` prop renders arbitrary content below the body — typically a row of action buttons."
			}
		}
	}
};

export const NoPadding: Story = {
	render: function NoPaddingExample() {
		const buttonRef = useRef<HTMLButtonElement | null>(null);
		const [open, setOpen] = useState(false);

		const handleButtonRef = useCallback((ref: HTMLButtonElement | null) => {
			buttonRef.current = ref;
		}, []);

		const toggle = useCallback(() => setOpen((prev) => !prev), []);
		const handleClose = useCallback(() => setOpen(false), []);

		return (
			<div style={{ padding: "40px" }}>
				<Button buttonRef={handleButtonRef} onClick={toggle} label="Open Callout without Padding" />
				{open && buttonRef.current && (
					<Callout
						id="no-padding-callout"
						referenceElement={buttonRef.current}
						padding={false}
						onClose={handleClose}
						header={{
							title: <span>No Padding</span>,
							suffix: <Button icon={<Icon>close</Icon>} title="Close" onClick={handleClose} />
						}}
					>
						<div style={{ background: "#f0f0f0", padding: "16px" }}>
							Content fills edge-to-edge when padding is disabled.
						</div>
					</Callout>
				)}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					'`padding={false}` removes the default content padding so content fills the callout edge-to-edge. A custom CSS value like `padding="12px 24px"` is also supported.'
			}
		}
	}
};
