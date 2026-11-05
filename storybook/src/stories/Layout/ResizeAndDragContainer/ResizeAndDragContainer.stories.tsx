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
import { useState, useCallback } from "react";

import { ResizeAndDragContainer, Button, Icon, List, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ResizeAndDragContainer> = {
	title: "Layout/ResizeAndDragContainer",
	component: ResizeAndDragContainer,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		orientation: {
			control: "select",
			options: [
				"top",
				"top-start",
				"top-end",
				"bottom",
				"bottom-start",
				"bottom-end",
				"left",
				"left-start",
				"left-end",
				"right",
				"right-start",
				"right-end"
			],
			description: "Aligns the container relative to the reference element on initial mount"
		},
		closeOnOutsideClick: {
			control: "boolean",
			description: "Close the container when clicking outside of it"
		},
		closeOnEsc: {
			control: "boolean",
			description: "Close the container when the ESC key is pressed"
		},
		disableResizing: {
			control: "boolean",
			description: "Disable resizing of the container"
		},
		focusOnOpen: {
			control: "boolean",
			description: "Focus the container when it is opened"
		},
		focusOnReferenceElementAfterEsc: {
			control: "boolean",
			description: "Focus the reference element after the container was closed via ESC"
		},
		fixedOrientation: {
			control: "boolean",
			description: "Keep the container at the preferred orientation instead of flipping when space runs out"
		},
		show: {
			control: "boolean",
			description: "Whether the container is visible"
		},
		animation: {
			control: "boolean",
			description: "Animate showing and hiding the container (combine with `show`)"
		},
		initialSize: {
			control: "object",
			description: "Initial width and height of the container"
		},
		minWidth: {
			control: "number",
			description: "Minimum width the container can be resized to"
		},
		minHeight: {
			control: "number",
			description: "Minimum height the container can be resized to"
		},
		maxWidth: {
			control: "number",
			description: "Maximum width the container can be resized to"
		},
		maxHeight: {
			control: "number",
			description: "Maximum height the container can be resized to"
		},
		onClose: {
			control: false,
			description: "Called when the container requests to close (outside click, ESC, ...)"
		},
		referenceElement: {
			control: false,
			description: "The element the container is aligned to on initial mount"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		orientation: "bottom-start",
		closeOnOutsideClick: false,
		closeOnEsc: true,
		disableResizing: false,
		focusOnOpen: true,
		show: true,
		initialSize: { width: 300, height: 250 },
		minWidth: 200,
		minHeight: 150,
		maxWidth: 600,
		maxHeight: 500
	},
	render: function PlaygroundExample(args) {
		const [open, setOpen] = useState(true);
		const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);

		const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);
		const onClose = useCallback(() => setOpen(false), []);

		return (
			<div style={{ padding: "16px" }}>
				<div ref={setReferenceElement} style={{ display: "inline-block" }}>
					<Button primary icon={<Icon>open_in_new</Icon>} onClick={toggleOpen}>
						{open ? "Hide Container" : "Show Container"}
					</Button>
				</div>
				{open && referenceElement && (
					<ResizeAndDragContainer {...args} referenceElement={referenceElement} onClose={onClose}>
						<div style={{ padding: "16px" }}>
							<Typography.Headline level={4} style={{ margin: "0 0 8px 0" }}>
								Resizable Container
							</Typography.Headline>
							<Typography.Body>Drag the edges or corners to resize this container.</Typography.Body>
						</div>
					</ResizeAndDragContainer>
				)}
			</div>
		);
	}
};

export const Default: Story = {
	render: function DefaultExample() {
		const [show, setShow] = useState(false);
		const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);

		const toggleShow = useCallback(() => setShow((prev) => !prev), []);
		const onClose = useCallback(() => setShow(false), []);

		return (
			<div style={{ padding: "16px" }}>
				<div ref={setReferenceElement} style={{ display: "inline-block" }}>
					<Button primary icon={<Icon>open_in_new</Icon>} onClick={toggleShow}>
						{show ? "Hide Container" : "Show Container"}
					</Button>
				</div>
				{show && referenceElement && (
					<ResizeAndDragContainer
						referenceElement={referenceElement}
						initialSize={{ width: 300, height: 250 }}
						minWidth={200}
						minHeight={150}
						maxWidth={600}
						maxHeight={500}
						closeOnOutsideClick
						closeOnEsc
						onClose={onClose}
					>
						<div style={{ padding: "16px" }}>
							<Typography.Headline level={4} style={{ margin: "0 0 8px 0" }}>
								Resizable Container
							</Typography.Headline>
							<Typography.Body>Drag the edges or corners to resize this container.</Typography.Body>
							<Typography.Body>Click outside or press ESC to close.</Typography.Body>
						</div>
					</ResizeAndDragContainer>
				)}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"A container anchored to a `referenceElement` with `initialSize` plus `minWidth`/`minHeight`/`maxWidth`/`maxHeight` resize limits. `closeOnOutsideClick` and `closeOnEsc` trigger `onClose`."
			}
		}
	}
};

export const WithListContent: Story = {
	render: function WithListContentExample() {
		const [show, setShow] = useState(false);
		const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);

		const toggleShow = useCallback(() => setShow((prev) => !prev), []);
		const onClose = useCallback(() => setShow(false), []);

		return (
			<div style={{ padding: "16px" }}>
				<div ref={setReferenceElement} style={{ display: "inline-block" }}>
					<Button icon={<Icon>person</Icon>} onClick={toggleShow}>
						User Details
					</Button>
				</div>
				{show && referenceElement && (
					<ResizeAndDragContainer
						referenceElement={referenceElement}
						initialSize={{ width: 320, height: 380 }}
						minWidth={240}
						minHeight={200}
						maxWidth={600}
						maxHeight={600}
						closeOnOutsideClick
						onClose={onClose}
					>
						<List flipped border>
							<List.SubHeader fill>User Data</List.SubHeader>
							<List.Item readonly text="Jane Smith" secondaryText="Name" />
							<List.Item readonly text="jane.smith@example.com" secondaryText="Email" />
							<List.Item readonly text="+1 (555) 123-4567" secondaryText="Phone" />
							<List.SubHeader fill>Account</List.SubHeader>
							<List.Item readonly text="Administrator" secondaryText="Role" />
							<List.Item readonly text="Active" secondaryText="Status" />
							<List.Item readonly text="2025-03-01" secondaryText="Member since" />
						</List>
					</ResizeAndDragContainer>
				)}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"The container accepts arbitrary `children` — here a scrollable `List` acts as a detail panel that the user can enlarge as needed."
			}
		}
	}
};

export const NonResizable: Story = {
	render: function NonResizableExample() {
		const [show, setShow] = useState(false);
		const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);

		const onClose = useCallback(() => setShow(false), []);

		return (
			<div style={{ padding: "16px" }}>
				<div ref={setReferenceElement} style={{ display: "inline-block" }}>
					<Button primary onClick={() => setShow((prev) => !prev)}>
						{show ? "Hide Container" : "Show Non-Resizable Container"}
					</Button>
				</div>
				{show && referenceElement && (
					<ResizeAndDragContainer
						referenceElement={referenceElement}
						initialSize={{ width: 300, height: 200 }}
						disableResizing
						closeOnOutsideClick
						closeOnEsc
						onClose={onClose}
					>
						<div style={{ padding: "16px" }}>
							<Typography.Headline level={4} style={{ margin: "0 0 8px 0" }}>
								Fixed Size Container
							</Typography.Headline>
							<Typography.Body>This container cannot be resized, but it can still be dragged around.</Typography.Body>
						</div>
					</ResizeAndDragContainer>
				)}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`disableResizing` removes the resize handles so the container keeps its `initialSize`, while dragging stays enabled."
			}
		}
	}
};

export const CustomOrientation: Story = {
	render: function CustomOrientationExample() {
		const [show, setShow] = useState(false);
		const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);

		const onClose = useCallback(() => setShow(false), []);

		return (
			<div style={{ padding: "16px", display: "flex", justifyContent: "flex-end" }}>
				<div ref={setReferenceElement} style={{ display: "inline-block" }}>
					<Button primary icon={<Icon>open_in_new</Icon>} onClick={() => setShow((prev) => !prev)}>
						{show ? "Hide" : "Open Wide Container"}
					</Button>
				</div>
				{show && referenceElement && (
					<ResizeAndDragContainer
						referenceElement={referenceElement}
						orientation="bottom-end"
						initialSize={{ width: 450, height: 180 }}
						minWidth={300}
						minHeight={120}
						maxWidth={700}
						maxHeight={300}
						closeOnOutsideClick
						closeOnEsc
						onClose={onClose}
					>
						<div style={{ padding: "16px" }}>
							<Typography.Headline level={4} style={{ margin: "0 0 8px 0" }}>
								Wide Horizontal Layout
							</Typography.Headline>
							<Typography.Body>
								This wide container opens with `bottom-end` orientation, aligning its end edge with the reference
								element.
							</Typography.Body>
						</div>
					</ResizeAndDragContainer>
				)}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`orientation` controls where the container appears relative to the `referenceElement` on initial mount — here `bottom-end` keeps a wide container aligned with a right-hand trigger."
			}
		}
	}
};

export const MultipleContainers: Story = {
	render: function MultipleContainersExample() {
		const [showFirst, setShowFirst] = useState(false);
		const [showSecond, setShowSecond] = useState(false);
		const [refFirst, setRefFirst] = useState<HTMLDivElement | null>(null);
		const [refSecond, setRefSecond] = useState<HTMLDivElement | null>(null);

		return (
			<div style={{ padding: "16px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
				<div ref={setRefFirst} style={{ display: "inline-block" }}>
					<Button primary onClick={() => setShowFirst((prev) => !prev)}>
						{showFirst ? "Hide First" : "Show First"}
					</Button>
				</div>
				<div ref={setRefSecond} style={{ display: "inline-block" }}>
					<Button onClick={() => setShowSecond((prev) => !prev)}>{showSecond ? "Hide Second" : "Show Second"}</Button>
				</div>
				{showFirst && refFirst && (
					<ResizeAndDragContainer
						referenceElement={refFirst}
						initialSize={{ width: 260, height: 200 }}
						minWidth={180}
						minHeight={120}
						maxWidth={500}
						maxHeight={400}
						closeOnEsc
						onClose={() => setShowFirst(false)}
					>
						<div style={{ padding: "12px" }}>
							<Typography.Headline level={4} style={{ margin: "0 0 8px 0" }}>
								First Container
							</Typography.Headline>
							<Typography.Body>Independent resize/drag.</Typography.Body>
						</div>
					</ResizeAndDragContainer>
				)}
				{showSecond && refSecond && (
					<ResizeAndDragContainer
						referenceElement={refSecond}
						initialSize={{ width: 260, height: 200 }}
						minWidth={180}
						minHeight={120}
						maxWidth={500}
						maxHeight={400}
						closeOnEsc
						onClose={() => setShowSecond(false)}
					>
						<div style={{ padding: "12px" }}>
							<Typography.Headline level={4} style={{ margin: "0 0 8px 0" }}>
								Second Container
							</Typography.Headline>
							<Typography.Body>Each container is independently controllable.</Typography.Body>
						</div>
					</ResizeAndDragContainer>
				)}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Several containers can be open at the same time — each one tracks its own `referenceElement`, position and size independently."
			}
		}
	}
};
