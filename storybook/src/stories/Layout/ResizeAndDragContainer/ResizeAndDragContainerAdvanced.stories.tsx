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

import { ResizeAndDragContainer, Button, Icon, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ResizeAndDragContainer> = {
	title: "Layout/ResizeAndDragContainer/Advanced",
	component: ResizeAndDragContainer,
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

export const NonResizable: Story = {
	render: () => {
		const Demo = () => {
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
							minWidth={300}
							minHeight={200}
							maxWidth={300}
							maxHeight={200}
							closeOnOutsideClick
							closeOnEsc
							onClose={onClose}
						>
							<div style={{ padding: "16px" }}>
								<Typography.Headline level={4} style={{ margin: "0 0 8px 0" }}>
									Fixed Size Container
								</Typography.Headline>
								<Typography.Body>This container cannot be resized — min and max match initial size.</Typography.Body>
							</div>
						</ResizeAndDragContainer>
					)}
				</div>
			);
		};

		return <Demo />;
	}
};

export const WithCustomOrientation: Story = {
	render: () => {
		const Demo = () => {
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
								<Typography.Body>This container starts with a wider, more horizontal orientation.</Typography.Body>
							</div>
						</ResizeAndDragContainer>
					)}
				</div>
			);
		};

		return <Demo />;
	}
};

export const MultipleContainers: Story = {
	render: () => {
		const Demo = () => {
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
		};

		return <Demo />;
	}
};
