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
import type { CSSProperties } from "react";
import { useState, useRef } from "react";

import { Portal, AttachedPortal, Button } from "@com.mgmtp.a12.widgets/widgets-core";

const overlayStyle: CSSProperties = {
	background: "#fff",
	border: "1px solid #ccc",
	borderRadius: "4px",
	padding: "12px",
	boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
	minWidth: "180px"
};

const meta: Meta<typeof Portal> = {
	title: "Utils/Portals",
	component: Portal,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		closeOnEsc: {
			control: "boolean",
			description: "Should the portal close when the ESC key is hit (default: true)"
		},
		closeOnOutsideClick: {
			control: "boolean",
			description: "Should the portal close when you click outside it"
		},
		onClose: {
			control: false,
			description: "Callback when the portal is closed"
		},
		onClickOutside: {
			control: false,
			description: "Callback when clicking outside the portal"
		},
		children: {
			control: false,
			description: "Content rendered inside the portal"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		closeOnEsc: true,
		closeOnOutsideClick: true
	},
	render: function PlaygroundExample(args) {
		const [open, setOpen] = useState(false);

		return (
			<div>
				<Button onClick={() => setOpen(true)} primary>
					Open Portal
				</Button>
				{open && (
					<Portal
						{...args}
						onClose={(event) => {
							setOpen(false);
							args.onClose?.(event);
						}}
					>
						<div
							style={{
								...overlayStyle,
								position: "fixed",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								padding: "24px",
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"`Portal` renders its children into `document.body`. `closeOnOutsideClick` and `closeOnEsc` are handled by the portal itself via the `onClose` callback."
			}
		}
	}
};

export const Attached: Story = {
	render: function AttachedExample() {
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
						<div style={overlayStyle}>
							<p style={{ margin: 0 }}>Positioned near the button.</p>
						</div>
					</AttachedPortal>
				)}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`AttachedPortal` positions its content relative to a `referenceElement` (here: the button wrapper). It automatically picks an `orientation` so the content stays fully visible on screen."
			}
		}
	}
};

export const AttachedOrientation: Story = {
	render: function AttachedOrientationExample() {
		const [open, setOpen] = useState(false);
		const wrapperRef = useRef<HTMLDivElement>(null);

		return (
			<div style={{ padding: "120px 0 0 120px" }}>
				<div ref={wrapperRef} style={{ display: "inline-block" }}>
					<Button onClick={() => setOpen((prev) => !prev)} primary>
						Open at top-start
					</Button>
				</div>
				{open && wrapperRef.current && (
					<AttachedPortal
						referenceElement={wrapperRef.current}
						orientation="top-start"
						fixedOrientation
						closeOnOutsideClick
						closeOnEsc
						onVisibilityChange={(visible) => !visible && setOpen(false)}
					>
						<div style={overlayStyle}>
							<p style={{ margin: 0 }}>Fixed at the top-start orientation.</p>
						</div>
					</AttachedPortal>
				)}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`orientation` aligns the attached portal to the reference element (default `bottom-start`). With `fixedOrientation` the portal keeps the preferred orientation instead of repositioning automatically; `orientationList` can define prioritized fallbacks."
			}
		}
	}
};
