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
	tags: ["autodocs"],
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
		show: {
			control: "boolean",
			description: "Whether the container is visible"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const Demo = () => {
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
							</div>
						</ResizeAndDragContainer>
					)}
				</div>
			);
		};

		return <Demo />;
	}
};

export const BasicResizable: Story = {
	render: () => {
		const Demo = () => {
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
		};

		return <Demo />;
	}
};

export const WithListContent: Story = {
	render: () => {
		const Demo = () => {
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
		};

		return <Demo />;
	}
};
