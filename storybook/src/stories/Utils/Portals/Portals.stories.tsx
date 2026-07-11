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
import { useState, useRef } from "react";

import { Portal, AttachedPortal, Button } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Portal> = {
	title: "Utils/Portals",
	component: Portal,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Portal renders its children into document.body, outside the current DOM tree — useful for modals and overlays. AttachedPortal additionally positions itself relative to a referenceElement and supports smart orientation."
			}
		}
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const PortalExample = () => {
			const [open, setOpen] = useState(false);

			return (
				<div>
					<Button onClick={() => setOpen(true)} primary>
						Open Portal
					</Button>
					{open && (
						<Portal closeOnOutsideClick closeOnEsc onClose={() => setOpen(false)}>
							<div
								style={{
									position: "fixed",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									background: "#fff",
									border: "1px solid #ccc",
									borderRadius: "4px",
									padding: "24px",
									boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
									zIndex: 1000,
									minWidth: "200px"
								}}
							>
								<p>Content rendered in document.body via Portal.</p>
								<Button onClick={() => setOpen(false)} secondary>
									Close
								</Button>
							</div>
						</Portal>
					)}
				</div>
			);
		};

		return <PortalExample />;
	}
};

export const BasicPortal: Story = {
	render: () => {
		const PortalExample = () => {
			const [open, setOpen] = useState(false);

			return (
				<div>
					<Button onClick={() => setOpen(true)} primary>
						Open Portal
					</Button>
					{open && (
						<Portal closeOnOutsideClick closeOnEsc onClose={() => setOpen(false)}>
							<div
								style={{
									position: "fixed",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									background: "#fff",
									border: "1px solid #ccc",
									borderRadius: "4px",
									padding: "24px",
									boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
									zIndex: 1000,
									minWidth: "200px"
								}}
							>
								<p>Content rendered in document.body via Portal.</p>
								<Button onClick={() => setOpen(false)} secondary>
									Close
								</Button>
							</div>
						</Portal>
					)}
				</div>
			);
		};

		return <PortalExample />;
	},
	parameters: {
		docs: {
			description: {
				story:
					"Portal renders its children into document.body. closeOnOutsideClick and closeOnEsc are handled by Portal itself via the onClose callback."
			}
		}
	}
};

export const AttachedPortalExample: Story = {
	render: () => {
		const AttachedPortalExampleComponent = () => {
			const [open, setOpen] = useState(false);
			const wrapperRef = useRef<HTMLDivElement>(null);

			return (
				<div style={{ paddingTop: "60px" }}>
					<div ref={wrapperRef} style={{ display: "inline-block" }}>
						<Button onClick={() => setOpen((prev) => !prev)} primary>
							Toggle Attached Portal
						</Button>
					</div>
					{open && wrapperRef.current && (
						<AttachedPortal
							referenceElement={wrapperRef.current}
							closeOnOutsideClick
							closeOnEsc
							onVisibilityChange={(visible) => !visible && setOpen(false)}
						>
							<div
								style={{
									background: "#fff",
									border: "1px solid #ccc",
									borderRadius: "4px",
									padding: "12px",
									boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
									minWidth: "180px"
								}}
							>
								<p style={{ margin: 0 }}>Positioned near the button.</p>
							</div>
						</AttachedPortal>
					)}
				</div>
			);
		};

		return <AttachedPortalExampleComponent />;
	},
	parameters: {
		docs: {
			description: {
				story:
					"AttachedPortal positions content relative to a referenceElement (here: the button wrapper div). It automatically picks orientation to stay on screen."
			}
		}
	}
};
