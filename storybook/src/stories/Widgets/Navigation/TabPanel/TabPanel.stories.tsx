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

import { Badge, TabPanel } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/index.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/index.js";
import {
	TabPanelTemplate,
	type TabPanelTemplateProps
} from "@com.mgmtp.a12.widgets/widgets-core/lib/tab-panel/index.js";
import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint-context.js";

const meta: Meta<typeof TabPanel> = {
	title: "Widgets/Navigation/TabPanel",
	component: TabPanel,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof TabPanel>;

export const sampleTabs: TabPanelTemplateProps.TabProps[] = [
	{
		icon: <Icon>info</Icon>,
		value: "information",
		title: "Information"
	},
	{
		icon: <Icon>navigation</Icon>,
		value: "navigation",
		title: "Navigation",
		ariaLabelledby: "badge-id",
		children: <Badge id="badge-id" count={9} />
	},
	{
		icon: <Icon>search</Icon>,
		value: "search",
		title: "Search"
	},
	{
		icon: <Icon>event_note</Icon>,
		value: "calendar",
		title: "Calendar"
	},
	{
		icon: <Icon>feedback</Icon>,
		value: "feedback",
		disabled: true,
		title: "Feedback"
	},
	{
		icon: <Icon>airline_seat_legroom_reduced</Icon>,
		value: "Airline seat",
		title: "Airline seat"
	},
	{
		icon: <Icon>add_circle</Icon>,
		value: "Add circle",
		title: "Add circle"
	},
	{
		icon: <Icon>accessible</Icon>,
		value: "Accessible",
		title: "Accessible"
	}
];

export const WithInteractionHint: Story = {
	render: () => {
		const TabPanelDemo = () => {
			const [value, setValue] = useState("overview");
			const [maximized, setMaximized] = useState(false);

			return (
				<InteractionHintConfigProvider componentConfigs={{ tabPanel: { enabled: true } }}>
					<TabPanel
						tabs={sampleTabs}
						value={value}
						onSelect={(tab) => setValue(tab.value)}
						header={
							<TabPanelTemplate.PanelHeader
								heading="Demo"
								suffixes={[
									<Button
										key="fs"
										icon={<Icon>{maximized ? "fullscreen_exit" : "fullscreen"}</Icon>}
										invert
										onClick={() => setMaximized(!maximized)}
										title={maximized ? "Minimize" : "Maximize"}
									/>,
									<Button
										key="close"
										icon={<Icon>close</Icon>}
										invert
										onClick={() => setValue("overview")}
										title="Close"
									/>
								]}
							/>
						}
					>
						<div style={{ padding: "20px" }}>Hover over tabs to see interaction hints</div>
					</TabPanel>
				</InteractionHintConfigProvider>
			);
		};

		return <TabPanelDemo />;
	},
	parameters: {
		docs: {
			description: {
				story: "Tab panel with standard interaction hints. Hover over tabs to see tooltips."
			}
		}
	}
};

export const WithInteractionHintFollowCursor: Story = {
	render: () => {
		const TabPanelDemo = () => {
			const [value, setValue] = useState("overview");

			return (
				<InteractionHintConfigProvider componentConfigs={{ tabPanel: { enabled: true, followCursor: true } }}>
					<TabPanel tabs={sampleTabs} value={value} onSelect={(tab) => setValue(tab.value)}>
						<div style={{ padding: "20px" }}>Hints follow your cursor position</div>
					</TabPanel>
				</InteractionHintConfigProvider>
			);
		};

		return <TabPanelDemo />;
	},
	parameters: {
		docs: {
			description: {
				story: "Tab panel with cursor-following hints. Move your mouse over tabs to see tooltips follow the cursor."
			}
		}
	}
};

export const InteractionHintVariations: Story = {
	render: () => {
		const TabPanelDemo = () => {
			const [value1, setValue1] = useState("overview");
			const [value2, setValue2] = useState("details");
			const [value3, setValue3] = useState("settings");
			const [value4, setValue4] = useState("overview");

			return (
				<div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
					<div>
						<h3>Standard Hints (Fixed Position)</h3>
						<InteractionHintConfigProvider componentConfigs={{ tabPanel: { enabled: true } }}>
							<TabPanel tabs={sampleTabs} value={value1} onSelect={(tab) => setValue1(tab.value)}>
								<div style={{ padding: "20px" }}>Fixed position tooltips</div>
							</TabPanel>
						</InteractionHintConfigProvider>
					</div>

					<div>
						<h3>Follow Cursor (Dynamic Position)</h3>
						<InteractionHintConfigProvider componentConfigs={{ tabPanel: { enabled: true, followCursor: true } }}>
							<TabPanel tabs={sampleTabs} value={value2} onSelect={(tab) => setValue2(tab.value)}>
								<div style={{ padding: "20px" }}>Tooltips follow mouse cursor</div>
							</TabPanel>
						</InteractionHintConfigProvider>
					</div>

					<div>
						<h3>Follow Cursor + Hide Arrow</h3>
						<InteractionHintConfigProvider
							componentConfigs={{ tabPanel: { enabled: true, followCursor: true, hideArrow: true } }}
						>
							<TabPanel tabs={sampleTabs} value={value3} onSelect={(tab) => setValue3(tab.value)}>
								<div style={{ padding: "20px" }}>Dynamic tooltips without arrow</div>
							</TabPanel>
						</InteractionHintConfigProvider>
					</div>

					<div>
						<h3>Without Hints (Disabled)</h3>
						<TabPanel tabs={sampleTabs} value={value4} onSelect={(tab) => setValue4(tab.value)}>
							<div style={{ padding: "20px" }}>No interaction hints</div>
						</TabPanel>
					</div>
				</div>
			);
		};

		return <TabPanelDemo />;
	},
	parameters: {
		docs: {
			description: {
				story:
					"Comparison of different interaction hint configurations:\n\n- **Standard**: Fixed position tooltips with arrow\n- **Follow Cursor**: Tooltips that move with your mouse\n- **Follow Cursor + Hide Arrow**: Dynamic tooltips without arrow pointer\n- **Disabled**: No interaction hints shown"
			}
		}
	}
};
