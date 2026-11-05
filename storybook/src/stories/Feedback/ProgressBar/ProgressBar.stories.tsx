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
import { useState, useEffect } from "react";

import { ProgressBar } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ProgressBar> = {
	title: "Feedback/ProgressBar",
	component: ProgressBar,
	parameters: {
		layout: "centered"
	},
	argTypes: {
		percentage: {
			control: { type: "range", min: 0, max: 100, step: 1 },
			description: "Progressed percentage of the process (0–100)"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		percentage: 50
	},
	render: (args) => (
		<div style={{ width: "300px", padding: "20px", backgroundColor: "#f5f5f5" }}>
			<ProgressBar {...args} />
		</div>
	)
};

export const Animated: Story = {
	render: function AnimatedExample() {
		const [progress, setProgress] = useState(0);

		useEffect(() => {
			const interval = setInterval(() => {
				setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
			}, 100);

			return () => clearInterval(interval);
		}, []);

		return (
			<div style={{ width: "300px", padding: "8px", backgroundColor: "#f5f5f5" }}>
				<ProgressBar percentage={progress} />
				<div style={{ marginTop: "8px", textAlign: "center" }}>{progress}%</div>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Changes to `percentage` are animated with a smooth fill transition, so continuously updating the prop produces a live progress animation."
			}
		}
	}
};

export const MultipleSteps: Story = {
	render: () => (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "16px",
				width: "300px",
				padding: "20px",
				backgroundColor: "#f5f5f5"
			}}
		>
			<div>
				<div style={{ marginBottom: "4px", fontSize: "12px" }}>Step 1: Preparing</div>
				<ProgressBar percentage={100} />
			</div>
			<div>
				<div style={{ marginBottom: "4px", fontSize: "12px" }}>Step 2: Downloading</div>
				<ProgressBar percentage={65} />
			</div>
			<div>
				<div style={{ marginBottom: "4px", fontSize: "12px" }}>Step 3: Installing</div>
				<ProgressBar percentage={0} />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Several progress bars composed into a multi-step flow. Each bar fills its own parent container, so each step gets its own labelled wrapper."
			}
		}
	}
};

export const TransparentParent: Story = {
	args: {
		percentage: 65
	},
	render: (args) => (
		<div style={{ width: "300px", padding: "20px" }}>
			<ProgressBar {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"When the parent element has no background color of its own, the bar automatically renders its themed track background instead of inheriting the parent's."
			}
		}
	}
};

export const WithColoredParentBackground: Story = {
	args: {
		percentage: 50
	},
	render: (args) => (
		<div
			style={{
				backgroundColor: "#4a90d9",
				borderRadius: "4px",
				padding: "8px",
				width: "300px"
			}}
		>
			<ProgressBar {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"ProgressBar inside a parent that has a background color. The components uses parent's background color for the track and fill."
			}
		}
	}
};
