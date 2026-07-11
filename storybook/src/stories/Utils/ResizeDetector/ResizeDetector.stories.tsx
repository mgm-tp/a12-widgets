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

import { WidgetsResizeDetector } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof WidgetsResizeDetector> = {
	title: "Utils/ResizeDetector",
	component: WidgetsResizeDetector,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"WidgetsResizeDetector is a thin wrapper around the react-resize-detector hook, making it usable in class components. Pass a targetRef pointing to the element to observe and an onResize callback to receive size changes."
			}
		}
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const ResizeDetectorExample = () => {
			const [dimensions, setDimensions] = useState<{ width: number | null; height: number | null }>({
				width: null,
				height: null
			});
			const targetRef = useRef<HTMLDivElement>(null);

			return (
				<div>
					<WidgetsResizeDetector
						targetRef={targetRef}
						onResize={({ width, height }) => setDimensions({ width: width ?? null, height: height ?? null })}
					>
						<div
							ref={targetRef}
							style={{
								resize: "both",
								overflow: "auto",
								border: "2px dashed #4a90d9",
								padding: "16px",
								minWidth: "150px",
								minHeight: "80px",
								background: "#f0f7ff"
							}}
						>
							<p style={{ margin: 0 }}>Resize me (drag the corner)</p>
						</div>
					</WidgetsResizeDetector>
					<p style={{ marginTop: "12px", fontFamily: "monospace" }}>
						Width: {dimensions.width ?? "—"}px / Height: {dimensions.height ?? "—"}px
					</p>
				</div>
			);
		};

		return <ResizeDetectorExample />;
	},
	parameters: {
		docs: {
			description: {
				story:
					"Drag the corner of the dashed box to resize it. WidgetsResizeDetector fires onResize and the dimensions are displayed below."
			}
		}
	}
};
