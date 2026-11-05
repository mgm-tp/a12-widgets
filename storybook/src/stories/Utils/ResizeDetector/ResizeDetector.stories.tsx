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

import { WidgetsResizeDetector } from "@com.mgmtp.a12.widgets/widgets-core";

const resizableBoxStyle: CSSProperties = {
	resize: "both",
	overflow: "auto",
	border: "2px dashed #4a90d9",
	padding: "16px",
	minWidth: "150px",
	minHeight: "80px",
	background: "#f0f7ff"
};

const meta: Meta<typeof WidgetsResizeDetector> = {
	title: "Utils/ResizeDetector",
	component: WidgetsResizeDetector,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		onResize: {
			control: false,
			description: "Callback invoked with `{ width, height, entry }` whenever the observed element resizes"
		},
		targetRef: {
			control: false,
			description: "Ref to the DOM element to observe — the detector attaches a ResizeObserver to `targetRef.current`"
		},
		handleWidth: {
			control: "boolean",
			description: "Trigger `onResize` on width changes (default `true`)"
		},
		handleHeight: {
			control: "boolean",
			description: "Trigger `onResize` on height changes (default `true`)"
		},
		skipOnMount: {
			control: "boolean",
			description: "Skip the initial `onResize` call after mounting"
		},
		refreshMode: {
			control: "select",
			options: ["debounce", "throttle"],
			description: "Rate-limiting strategy applied to resize notifications"
		},
		refreshRate: {
			control: { type: "number", min: 0, max: 2000, step: 50 },
			description: "Delay in milliseconds used by the selected `refreshMode`"
		},
		children: {
			control: false,
			description: "Rendered as-is — the detector adds no extra DOM element"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		handleWidth: true,
		handleHeight: true,
		skipOnMount: false,
		refreshMode: "debounce",
		refreshRate: 0
	},
	render: function PlaygroundExample(args) {
		const [dimensions, setDimensions] = useState<{ width: number | null; height: number | null }>({
			width: null,
			height: null
		});
		const targetRef = useRef<HTMLDivElement>(null);

		return (
			<div>
				<WidgetsResizeDetector
					{...args}
					targetRef={targetRef}
					onResize={({ width, height }) => setDimensions({ width: width ?? null, height: height ?? null })}
				>
					<div ref={targetRef} style={resizableBoxStyle}>
						<p style={{ margin: 0 }}>Resize me (drag the corner)</p>
					</div>
				</WidgetsResizeDetector>
				<p style={{ marginTop: "12px", fontFamily: "monospace" }}>
					Width: {dimensions.width ?? "—"}px / Height: {dimensions.height ?? "—"}px
				</p>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Drag the corner of the dashed box to resize it. `WidgetsResizeDetector` fires `onResize` and the dimensions are displayed below."
			}
		}
	}
};

export const WidthOnly: Story = {
	render: function WidthOnlyExample() {
		const [width, setWidth] = useState<number | null>(null);
		const targetRef = useRef<HTMLDivElement>(null);

		return (
			<div>
				<WidgetsResizeDetector
					targetRef={targetRef}
					handleHeight={false}
					onResize={(payload) => setWidth(payload.width ?? null)}
				>
					<div ref={targetRef} style={resizableBoxStyle}>
						<p style={{ margin: 0 }}>Only width changes are reported</p>
					</div>
				</WidgetsResizeDetector>
				<p style={{ marginTop: "12px", fontFamily: "monospace" }}>Width: {width ?? "—"}px</p>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`handleWidth` and `handleHeight` select which dimension changes trigger the callback. Here `handleHeight` is `false`, so dragging only the bottom edge does not fire `onResize`."
			}
		}
	}
};

export const Throttled: Story = {
	render: function ThrottledExample() {
		const [resizeCount, setResizeCount] = useState(0);
		const targetRef = useRef<HTMLDivElement>(null);

		return (
			<div>
				<WidgetsResizeDetector
					targetRef={targetRef}
					refreshMode="throttle"
					refreshRate={500}
					onResize={() => setResizeCount((count) => count + 1)}
				>
					<div ref={targetRef} style={resizableBoxStyle}>
						<p style={{ margin: 0 }}>Resize me — notifications are throttled</p>
					</div>
				</WidgetsResizeDetector>
				<p style={{ marginTop: "12px", fontFamily: "monospace" }}>onResize calls: {resizeCount}</p>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`refreshMode` and `refreshRate` rate-limit resize notifications — here `onResize` is throttled to at most one call every 500 ms while you drag."
			}
		}
	}
};
