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

import {
	CollapsiblePanel,
	Button,
	InteractionHintConfigProvider,
	A11YLanguageContext,
	Typography
} from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof CollapsiblePanel> = {
	title: "Layout/CollapsiblePanel",
	component: CollapsiblePanel,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		title: {
			control: "text",
			description: "Title of the panel"
		},
		info: {
			control: "text",
			description: "Additional information that will be printed next to the title"
		},
		addons: {
			control: false,
			description: "Additional content that will be placed at the end of the title"
		},
		swapAddonsPosition: {
			control: "boolean",
			description: "Whether the position of addons will be swapped with the collapse icon"
		},
		ariaLevel: {
			control: { type: "number", min: 1, max: 6 },
			description: "Aria level of the title"
		},
		role: {
			control: "text",
			description: "Value of the role attribute of the panel header, in order to support accessibility"
		},
		onClick: {
			control: false,
			description: "Called when the panel header is clicked or Enter is pressed on it"
		},
		children: {
			control: false,
			description: "Panel content — the panel is expanded while children are rendered and collapsed otherwise"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleContent = (
	<div style={{ padding: "20px" }}>
		<p>This is the content of the collapsible panel.</p>
		<p>It can contain any React elements.</p>
		<Button primary>Action Button</Button>
	</div>
);

export const Playground: Story = {
	args: {
		title: "Panel Title"
	},
	render: function PlaygroundExample(args) {
		const [collapsed, setCollapsed] = useState(false);

		return (
			<CollapsiblePanel {...args} onClick={() => setCollapsed(!collapsed)}>
				{!collapsed && sampleContent}
			</CollapsiblePanel>
		);
	}
};

export const Collapsed: Story = {
	render: () => <CollapsiblePanel title="Collapsed Panel" onClick={() => {}} />,
	parameters: {
		docs: {
			description: {
				story:
					"The panel is collapsed whenever no `children` are rendered. The indicator icon switches accordingly and `aria-expanded` is set to `false`."
			}
		}
	}
};

export const Controlled: Story = {
	render: function ControlledExample() {
		const [collapsed, setCollapsed] = useState(false);

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
				<Button onClick={() => setCollapsed(!collapsed)}>Toggle Panel ({collapsed ? "Expand" : "Collapse"})</Button>
				<CollapsiblePanel title="Controlled Panel" onClick={() => setCollapsed(!collapsed)}>
					{!collapsed && sampleContent}
				</CollapsiblePanel>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"The panel is fully controlled: `onClick` reports header clicks (or Enter key presses) and the consumer decides whether to render the `children`. External controls can toggle the same state."
			}
		}
	}
};

export const WithInfo: Story = {
	render: () => (
		<CollapsiblePanel title="Panel Title" info="3 items" onClick={() => {}}>
			{sampleContent}
		</CollapsiblePanel>
	),
	parameters: {
		docs: {
			description: {
				story: "`info` prints additional text next to the panel title."
			}
		}
	}
};

export const WithAddons: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
			<div>
				<Typography.Headline level={3}>Addons at the end of the title</Typography.Headline>
				<CollapsiblePanel
					title="Panel with Addons"
					addons={<Button label="Edit" onClick={() => {}} />}
					onClick={() => {}}
				>
					{sampleContent}
				</CollapsiblePanel>
			</div>

			<div>
				<Typography.Headline level={3}>Swapped addons position</Typography.Headline>
				<CollapsiblePanel
					title="Panel with Swapped Addons"
					addons={<Button label="Edit" onClick={() => {}} />}
					swapAddonsPosition
					onClick={() => {}}
				>
					{sampleContent}
				</CollapsiblePanel>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`addons` places extra interactive content in the panel header. With `swapAddonsPosition` the addons swap places with the collapse indicator icon. Clicking an interactive addon does not toggle the panel."
			}
		}
	}
};

export const InteractionHints: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
			<div>
				<Typography.Headline level={3}>Basic Interaction Hint</Typography.Headline>
				<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ collapsiblePanel: true }}>
					<CollapsiblePanel title="Basic Hint" onClick={() => {}}>
						{sampleContent}
					</CollapsiblePanel>
				</InteractionHintConfigProvider>
			</div>

			<div>
				<Typography.Headline level={3}>Follow Cursor</Typography.Headline>
				<InteractionHintConfigProvider enableInteractionHint followCursor componentConfigs={{ collapsiblePanel: true }}>
					<CollapsiblePanel title="Follow Cursor Hint" onClick={() => {}}>
						{sampleContent}
					</CollapsiblePanel>
				</InteractionHintConfigProvider>
			</div>

			<div>
				<Typography.Headline level={3}>No Arrow</Typography.Headline>
				<InteractionHintConfigProvider enableInteractionHint hideArrow componentConfigs={{ collapsiblePanel: true }}>
					<CollapsiblePanel title="No Arrow Hint" onClick={() => {}}>
						{sampleContent}
					</CollapsiblePanel>
				</InteractionHintConfigProvider>
			</div>

			<div>
				<Typography.Headline level={3}>Localized Hint Labels</Typography.Headline>
				<A11YLanguageContext.Provider
					value={{
						collapsiblePanelTitles: {
							openPanel: "open",
							closePanel: "close"
						}
					}}
				>
					<InteractionHintConfigProvider componentConfigs={{ collapsiblePanel: true }}>
						<CollapsiblePanel title="Localized Hint" onClick={() => {}}>
							{sampleContent}
						</CollapsiblePanel>
					</InteractionHintConfigProvider>
				</A11YLanguageContext.Provider>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Wrapping the panel in an `InteractionHintConfigProvider` with `componentConfigs={{ collapsiblePanel: true }}` shows an open/close hint when hovering the header. `followCursor` and `hideArrow` adjust the hint behavior, and `A11YLanguageContext` localizes the hint labels."
			}
		}
	}
};
