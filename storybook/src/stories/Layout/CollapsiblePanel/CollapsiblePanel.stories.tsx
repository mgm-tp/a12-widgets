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

export const Default: Story = {
	render: () => (
		<CollapsiblePanel title="Panel Title" onClick={() => {}}>
			{sampleContent}
		</CollapsiblePanel>
	)
};

export const Collapsed: Story = {
	render: () => <CollapsiblePanel title="Collapsed Panel" onClick={() => {}}></CollapsiblePanel>
};

export const Expanded: Story = {
	render: () => (
		<CollapsiblePanel title="Expanded Panel" onClick={() => {}}>
			{sampleContent}
		</CollapsiblePanel>
	)
};

export const NotCollapsible: Story = {
	render: () => (
		// CollapsiblePanel does not support a `collapsible` prop. To show an always-visible panel,
		// provide a no-op onClick and keep the content rendered.
		<CollapsiblePanel title="Always Visible Panel" onClick={() => {}}>
			{sampleContent}
		</CollapsiblePanel>
	)
};

export const Controlled: Story = {
	render: () => {
		const [collapsed, setCollapsed] = useState(false);

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
				<Button onClick={() => setCollapsed(!collapsed)}>Toggle Panel ({collapsed ? "Expand" : "Collapse"})</Button>
				<CollapsiblePanel title="Controlled Panel" onClick={() => setCollapsed(!collapsed)}>
					{!collapsed && sampleContent}
				</CollapsiblePanel>
			</div>
		);
	}
};

export const WithInteractionHint: Story = {
	render: () => (
		<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ collapsiblePanel: true }}>
			<CollapsiblePanel title="Panel with Interaction Hint" onClick={() => {}}>
				{sampleContent}
			</CollapsiblePanel>
		</InteractionHintConfigProvider>
	)
};

export const WithInteractionHintFollowCursor: Story = {
	render: () => (
		<InteractionHintConfigProvider enableInteractionHint followCursor componentConfigs={{ collapsiblePanel: true }}>
			<CollapsiblePanel title="Panel with Follow Cursor Hint" onClick={() => {}}>
				{sampleContent}
			</CollapsiblePanel>
		</InteractionHintConfigProvider>
	)
};

export const InteractionHintVariations: Story = {
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
		</div>
	)
};

export const AllVariants: Story = {
	render: () => {
		const [controlled, setControlled] = useState(true);

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
				<div>
					<Typography.Headline level={3}>Default Expanded</Typography.Headline>
					<CollapsiblePanel title="Default Panel" onClick={() => {}}>
						<div style={{ padding: "20px" }}>Default expanded state</div>
					</CollapsiblePanel>
				</div>

				<div>
					<Typography.Headline level={3}>Initially Collapsed</Typography.Headline>
					<CollapsiblePanel title="Collapsed Panel" onClick={() => {}}></CollapsiblePanel>
				</div>

				<div>
					<Typography.Headline level={3}>Not Collapsible</Typography.Headline>
					<CollapsiblePanel title="Always Visible" onClick={() => {}}>
						<div style={{ padding: "20px" }}>Cannot be collapsed</div>
					</CollapsiblePanel>
				</div>

				<div>
					<Typography.Headline level={3}>With Interaction Hint</Typography.Headline>
					<A11YLanguageContext.Provider
						value={{
							collapsiblePanelTitles: {
								openPanel: "open",
								closePanel: "close"
							}
						}}
					>
						<InteractionHintConfigProvider componentConfigs={{ collapsiblePanel: true }}>
							<CollapsiblePanel onClick={() => {}}>
								<div style={{ padding: "20px" }}>Hover the header to see hints</div>
							</CollapsiblePanel>
						</InteractionHintConfigProvider>
					</A11YLanguageContext.Provider>
				</div>

				<div>
					<Typography.Headline level={3}>Controlled Panel</Typography.Headline>
					<Button onClick={() => setControlled(!controlled)}>Toggle ({controlled ? "Collapse" : "Expand"})</Button>
					<CollapsiblePanel title="Controlled Panel" onClick={() => setControlled(!controlled)}>
						{!controlled && <div style={{ padding: "20px" }}>Controlled by external button</div>}
					</CollapsiblePanel>
				</div>
			</div>
		);
	}
};
