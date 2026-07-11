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
import { useRef, useState } from "react";

import { ResizeHandler } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ResizeHandler> = {
	title: "Layout/ResizeHandler",
	component: ResizeHandler,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		resizable: {
			control: "boolean",
			description: "Whether the target element can be resized by the user"
		},
		minWidth: {
			control: "number",
			description: "Minimum width the element can be resized to (in pixels)"
		},
		maxWidth: {
			control: "number",
			description: "Maximum width the element can be resized to (in pixels)"
		},
		position: {
			control: "select",
			options: ["left", "right"],
			description: "Position of the resize handle relative to the target element"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

const panelStyle: React.CSSProperties = {
	background: "#ffffff",
	border: "1px solid #e0e0e0",
	borderRadius: "4px",
	padding: "16px",
	minHeight: "120px"
};

const wrapperStyle: React.CSSProperties = {
	display: "flex",
	gap: "4px",
	overflow: "hidden",
	height: "200px"
};

export const Default: Story = {
	render: () => {
		const DefaultResizeHandler = () => {
			const leftRef = useRef<HTMLDivElement>(null);
			const [leftWidth, setLeftWidth] = useState(300);

			return (
				<div style={wrapperStyle}>
					<ResizeHandler
						targetRef={leftRef}
						minWidth={150}
						maxWidth={600}
						onResizeStop={(_event, data) => setLeftWidth(data.width)}
					>
						<div ref={leftRef} style={{ ...panelStyle, width: leftWidth }}>
							<strong>Left Panel</strong>
							<p>Drag the right edge to resize this panel.</p>
						</div>
					</ResizeHandler>
					<div style={{ ...panelStyle, flex: 1, minWidth: 0 }}>
						<strong>Right Panel</strong>
						<p>This panel fills the remaining space.</p>
					</div>
				</div>
			);
		};

		return <DefaultResizeHandler />;
	}
};

export const WithMinMaxConstraints: Story = {
	render: () => {
		const ConstrainedResizeHandler = () => {
			const leftRef = useRef<HTMLDivElement>(null);
			const [leftWidth, setLeftWidth] = useState(250);

			return (
				<div>
					<p style={{ marginBottom: "8px", fontSize: "14px", color: "#666" }}>
						Min: 150px | Max: 500px | Current: {leftWidth}px
					</p>
					<div style={wrapperStyle}>
						<ResizeHandler
							targetRef={leftRef}
							minWidth={150}
							maxWidth={500}
							onResizeStop={(_event, data) => setLeftWidth(data.width)}
							onResize={(_event, data) => setLeftWidth(data.width)}
						>
							<div ref={leftRef} style={{ ...panelStyle, width: leftWidth }}>
								<strong>Constrained Panel</strong>
								<p>Resize is limited between 150px and 500px.</p>
							</div>
						</ResizeHandler>
						<div style={{ ...panelStyle, flex: 1, minWidth: 0 }}>
							<strong>Sibling Panel</strong>
						</div>
					</div>
				</div>
			);
		};

		return <ConstrainedResizeHandler />;
	}
};

export const LeftPosition: Story = {
	render: () => {
		const LeftPositionResizeHandler = () => {
			const rightRef = useRef<HTMLDivElement>(null);
			const [rightWidth, setRightWidth] = useState(300);

			return (
				<div style={wrapperStyle}>
					<div style={{ ...panelStyle, flex: 1, minWidth: 0 }}>
						<strong>Left Panel</strong>
						<p>This panel fills the remaining space.</p>
					</div>
					<ResizeHandler
						targetRef={rightRef}
						position="left"
						minWidth={150}
						maxWidth={500}
						onResizeStop={(_event, data) => setRightWidth(data.width)}
					>
						<div ref={rightRef} style={{ ...panelStyle, width: rightWidth }}>
							<strong>Right Panel</strong>
							<p>The resize handle is placed on the left side.</p>
						</div>
					</ResizeHandler>
				</div>
			);
		};

		return <LeftPositionResizeHandler />;
	}
};

export const NotResizable: Story = {
	render: () => {
		const leftRef = useRef<HTMLDivElement>(null);

		return (
			<div style={wrapperStyle}>
				<ResizeHandler targetRef={leftRef} resizable={false} minWidth={150} maxWidth={500}>
					<div ref={leftRef} style={{ ...panelStyle, width: 250 }}>
						<strong>Fixed Panel</strong>
						<p>The resize handle is visible but dragging is disabled.</p>
					</div>
				</ResizeHandler>
				<div style={{ ...panelStyle, flex: 1, minWidth: 0 }}>
					<strong>Sibling Panel</strong>
				</div>
			</div>
		);
	}
};

export const WithResizeCallbacks: Story = {
	render: () => {
		const CallbackResizeHandler = () => {
			const leftRef = useRef<HTMLDivElement>(null);
			const [leftWidth, setLeftWidth] = useState(300);
			const [status, setStatus] = useState("Idle");

			return (
				<div>
					<p style={{ marginBottom: "8px", fontSize: "14px", color: "#666" }}>
						Status: <strong>{status}</strong> | Width: {leftWidth}px
					</p>
					<div style={wrapperStyle}>
						<ResizeHandler
							targetRef={leftRef}
							minWidth={150}
							maxWidth={550}
							onResizeStart={() => setStatus("Resizing...")}
							onResize={(_event, data) => {
								setLeftWidth(data.width);
								setStatus(`Resizing: ${data.width}px`);
							}}
							onResizeStop={(_event, data) => {
								setLeftWidth(data.width);
								setStatus(`Stopped at ${data.width}px`);
							}}
						>
							<div ref={leftRef} style={{ ...panelStyle, width: leftWidth }}>
								<strong>Resizable Panel</strong>
								<p>All resize callbacks are active.</p>
							</div>
						</ResizeHandler>
						<div style={{ ...panelStyle, flex: 1, minWidth: 0 }}>
							<strong>Sibling Panel</strong>
						</div>
					</div>
				</div>
			);
		};

		return <CallbackResizeHandler />;
	}
};
