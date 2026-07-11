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

import { Icon, Button } from "@com.mgmtp.a12.widgets/widgets-core";

type StoryFn = () => React.JSX.Element;

const meta: Meta<typeof Button> = {
	title: "General/Buttons/Button/States",
	component: Button,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Loading...",
		loading: true,
		processedPercentage: 0
	}
};

export const Loading: Story = {
	args: {
		label: "Loading...",
		loading: true,
		processedPercentage: 0
	}
};

export const LoadingPrimary: Story = {
	args: {
		label: "Saving...",
		loading: true,
		primary: true,
		processedPercentage: 0
	}
};

export const LoadingWithProgress: Story = {
	args: {
		label: "Downloading...",
		loading: true,
		processedPercentage: 65
	}
};

export const LoadingAnimatedProgress: Story = {
	render: () => {
		const AnimatedButton = () => {
			const [progress, setProgress] = useState(0);
			const [isLoading, setIsLoading] = useState(true);

			useEffect(() => {
				if (!isLoading) {
					return;
				}

				const interval = setInterval(() => {
					setProgress((prev) => {
						if (prev >= 100) {
							setIsLoading(false);

							return 100;
						}

						return prev + 5;
					});
				}, 200);

				return () => clearInterval(interval);
			}, [isLoading]);

			const handleReset = () => {
				setProgress(0);
				setIsLoading(true);
			};

			return (
				<div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
					<Button
						label={isLoading ? `Uploading... ${progress}%` : "Upload Complete!"}
						loading={isLoading}
						processedPercentage={progress}
						primary
					/>
					{!isLoading && <Button label="Reset" onClick={handleReset} />}
				</div>
			);
		};

		return <AnimatedButton />;
	}
};

export const Active: Story = {
	args: {
		label: "Active Button",
		active: true
	}
};

export const Block: Story = {
	args: {
		label: "Block Button",
		block: true
	},
	decorators: [
		(Story: StoryFn) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	]
};

export const BlockPrimary: Story = {
	args: {
		label: "Block Primary Button",
		block: true,
		primary: true
	},
	decorators: [
		(Story: StoryFn) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	]
};

export const Vertical: Story = {
	args: {
		label: "Vertical",
		icon: <Icon>home</Icon>,
		vertical: true
	}
};

export const InvertedPrimary: Story = {
	args: {
		label: "Inverted Primary",
		primary: true,
		invert: true
	},
	decorators: [
		(Story: StoryFn) => (
			<div style={{ backgroundColor: "#333", padding: "20px", borderRadius: "4px" }}>
				<Story />
			</div>
		)
	]
};

export const InvertedSecondary: Story = {
	args: {
		label: "Inverted Secondary",
		secondary: true,
		invert: true
	},
	decorators: [
		(Story: StoryFn) => (
			<div style={{ backgroundColor: "#333", padding: "20px", borderRadius: "4px" }}>
				<Story />
			</div>
		)
	]
};

export const SubmitButton: Story = {
	args: {
		label: "Submit",
		type: "submit",
		primary: true
	}
};

export const ResetButton: Story = {
	args: {
		label: "Reset",
		type: "reset"
	}
};

export const IconButtonWithBadge: Story = {
	args: {
		icon: <Icon>notifications</Icon>,
		badge: "5",
		title: "Notifications"
	}
};

export const HiddenLabel: Story = {
	args: {
		label: "Settings",
		icon: <Icon>settings</Icon>,
		labelHidden: true
	}
};
