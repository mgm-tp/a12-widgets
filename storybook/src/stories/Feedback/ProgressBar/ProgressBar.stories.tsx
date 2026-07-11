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
	tags: ["autodocs"],
	argTypes: {
		percentage: {
			control: { type: "range", min: 0, max: 100, step: 1 },
			description: "Progressed percentage of the process"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		percentage: 50
	},
	decorators: [
		(Story) => (
			<div style={{ width: "300px", padding: "20px", backgroundColor: "#f5f5f5" }}>
				<Story />
			</div>
		)
	]
};

export const Animated: Story = {
	render: () => {
		const AnimatedProgressBar = () => {
			const [progress, setProgress] = useState(0);

			useEffect(() => {
				const interval = setInterval(() => {
					setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
				}, 100);

				return () => clearInterval(interval);
			}, []);

			return (
				<div style={{ width: "300px", padding: "20px", backgroundColor: "#f5f5f5" }}>
					<ProgressBar percentage={progress} />
					<div style={{ marginTop: "8px", textAlign: "center" }}>{progress}%</div>
				</div>
			);
		};

		return <AnimatedProgressBar />;
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
	)
};
