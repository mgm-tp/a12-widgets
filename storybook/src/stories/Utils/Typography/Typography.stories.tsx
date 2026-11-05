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

import { Typography, Button, Icon, Badge } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Typography.Headline> = {
	title: "Utils/Typography",
	component: Typography.Headline,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		level: {
			control: "select",
			options: [1, 2, 3, 4, 5],
			description: "Heading level used for styling (1=largest, 5=smallest)"
		},
		ariaLevel: {
			control: { type: "number", min: 1, max: 6 },
			description: "Aria level used for accessibility"
		},
		children: {
			control: "text",
			description: "Headline text content"
		},
		divider: {
			control: "boolean",
			description: "Show a horizontal divider below the headline"
		},
		collapsible: {
			control: "boolean",
			description: "Allow the headline to collapse/expand its content"
		},
		collapsed: {
			control: "boolean",
			description: "Whether the collapsible headline is currently collapsed"
		},
		compact: {
			control: "boolean",
			description: "Compact mode with no background colors, only border on hover and focus"
		},
		alignment: {
			control: "select",
			options: ["left", "center", "right"],
			description: "Text alignment of the headline"
		},
		color: {
			control: "color",
			description: "Inline color applied to the headline"
		},
		htmlTag: {
			control: "text",
			description: "HTML tag used for the headline element (must be a block element)"
		},
		swapAddonsPosition: {
			control: "boolean",
			description: "Swap the position of addons with the expand/collapse icon"
		},
		iconVerticalAlignment: {
			control: "select",
			options: ["top", "middle", "bottom"],
			description: "Vertical position of the addons and expand/collapse icon"
		},
		info: {
			control: false,
			description: "Additional information displayed after the headline"
		},
		addons: {
			control: false,
			description: "Actions or other information displayed after the headline"
		},
		headerActions: {
			control: false,
			description: "Action buttons/icons displayed in the header with hover and focus states"
		},
		expandIcon: {
			control: false,
			description: "Icon shown while the headline is collapsed"
		},
		collapseIcon: {
			control: false,
			description: "Icon shown while the headline is expanded"
		},
		onCollapsingChange: {
			action: "onCollapsingChange",
			description: "Handler called when the collapsed state is toggled"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		level: 2,
		children: "Section headline",
		divider: false,
		collapsible: false,
		compact: false,
		alignment: "left"
	},
	render: (args) => (
		<Typography.Section>
			<Typography.Headline {...args} />
			<Typography.Body>Body text rendered below the headline inside the same section.</Typography.Body>
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
				story:
					"All five `level` values side by side. The level is used for styling only — use `ariaLevel` or `htmlTag` to control the semantic heading level."
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
				story: "`divider` renders a horizontal line below the headline, followed here by `Typography.Body` text."
			}
		}
	}
};

export const CollapsibleSection: Story = {
	render: function CollapsibleExample() {
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"`collapsible` makes the headline interactive; `collapsed` and `onCollapsingChange` control the toggle state. Render or hide the section content based on the collapsed state."
			}
		}
	}
};

export const InfoAndAddons: Story = {
	render: () => (
		<Typography.Section>
			<Typography.Headline
				level={3}
				divider
				info={<Badge count={4} standalone variant="info" />}
				addons={<Button label="Edit" />}
			>
				Headline with Info and Addons
			</Typography.Headline>
			<Typography.Body>
				Use the info slot for supplementary indicators and the addons slot for actions related to the section.
			</Typography.Body>
		</Typography.Section>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`info` displays additional information right after the headline text, while `addons` places actions or extra content at the end of the headline row."
			}
		}
	}
};

export const HeaderActions: Story = {
	render: function HeaderActionsExample() {
		const [collapsed, setCollapsed] = useState(false);

		return (
			<Typography.Section>
				<Typography.Headline
					level={3}
					collapsible
					collapsed={collapsed}
					onCollapsingChange={() => setCollapsed((prev) => !prev)}
					headerActions={
						<>
							<Button icon={<Icon>edit</Icon>} title="Edit section" />
							<Button icon={<Icon>delete</Icon>} title="Delete section" />
						</>
					}
				>
					Section with Header Actions
				</Typography.Headline>
				{!collapsed && <Typography.Body>Header actions render with proper hover and focus states.</Typography.Body>}
			</Typography.Section>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`headerActions` renders action buttons in the header section with proper hover and focus states — independent of the collapse toggle."
			}
		}
	}
};

export const BodyText: Story = {
	render: () => (
		<Typography.Section>
			<Typography.Body>Default body text aligned to the left.</Typography.Body>
			<Typography.Body alignment="center">Centered body text via the `alignment` prop.</Typography.Body>
			<Typography.Body alignment="right" color="#6b6b6b">
				Right-aligned body text with a custom `color`.
			</Typography.Body>
		</Typography.Section>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`Typography.Body` renders paragraph-level text and supports the same `alignment` and `color` props as the headline."
			}
		}
	}
};
