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

import { Typography } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Typography.Headline> = {
	title: "Utils/Typography",
	component: Typography.Headline,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Typography provides structured heading and body text components. Typography.Headline renders a heading at a given level (1–5) with optional collapsing, dividers, and addons. Typography.Body renders body text."
			}
		}
	},
	tags: ["autodocs"],
	argTypes: {
		level: {
			control: "select",
			options: [1, 2, 3, 4, 5],
			description: "Heading level (1=largest, 5=smallest)"
		},
		divider: {
			control: "boolean",
			description: "Show a horizontal divider below the headline"
		},
		collapsible: {
			control: "boolean",
			description: "Allow the headline to collapse/expand its content"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Typography.Section>
			{([1, 2, 3, 4, 5] as const).map((level) => (
				<Typography.Headline key={level} level={level}>
					Heading Level {level}
				</Typography.Headline>
			))}
		</Typography.Section>
	)
};

export const HeadlineLevels: Story = {
	render: () => (
		<Typography.Section>
			{([1, 2, 3, 4, 5] as const).map((level) => (
				<Typography.Headline key={level} level={level}>
					Heading Level {level}
				</Typography.Headline>
			))}
		</Typography.Section>
	),
	parameters: {
		docs: {
			description: {
				story: "All five heading levels side by side for visual comparison."
			}
		}
	}
};

export const WithDivider: Story = {
	render: () => (
		<Typography.Section>
			<Typography.Headline level={2} divider>
				Section Title with Divider
			</Typography.Headline>
			<Typography.Body>
				Body text content appears below the headline. Use Typography.Body for paragraph-level text within a structured
				layout.
			</Typography.Body>
		</Typography.Section>
	),
	parameters: {
		docs: {
			description: {
				story: "Headline with a divider line followed by body text."
			}
		}
	}
};

export const CollapsibleSection: Story = {
	render: () => {
		const CollapsibleExample = () => {
			const [collapsed, setCollapsed] = useState(false);

			return (
				<Typography.Section>
					<Typography.Headline
						level={3}
						collapsible
						collapsed={collapsed}
						onCollapsingChange={() => setCollapsed((prev) => !prev)}
					>
						Collapsible Section
					</Typography.Headline>
					{!collapsed && (
						<Typography.Body>
							This content is visible when the section is expanded. Click the headline to collapse it.
						</Typography.Body>
					)}
				</Typography.Section>
			);
		};

		return <CollapsibleExample />;
	},
	parameters: {
		docs: {
			description: {
				story: "Typography.Headline with collapsible=true toggles content visibility on click."
			}
		}
	}
};
