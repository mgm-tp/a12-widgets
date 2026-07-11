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

import { ModalOverlay, Button, Icon, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ModalOverlay> = {
	title: "Layout/ModalOverlay/Advanced",
	component: ModalOverlay,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	args: {
		onClose: fn(),
		onOpen: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const Demo = () => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<>
					<Button label="Open Advanced Modal" primary onClick={() => setIsOpen(true)} />
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
									No Gutter Modal
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
									This modal uses the <code>noGutter</code> prop to remove internal padding, allowing custom content
									(like an image header) to go edge-to-edge.
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

		return <Demo />;
	}
};

export const NoGutter: Story = {
	render: () => {
		const Demo = () => {
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
		};

		return <Demo />;
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
