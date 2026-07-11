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

import { Icon, InteractionHintConfigProvider, List, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof List> = {
	title: "Data Display/List",
	component: List,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		border: {
			control: "boolean",
			description: "Whether the list has a border"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<List>
			<List.Item text="First item" />
			<List.Item text="Second item" />
			<List.Item text="Third item" />
		</List>
	)
};

export const WithBorder: Story = {
	render: () => (
		<List border>
			<List.Item text="Item with border" />
			<List.Item text="Another item" />
			<List.Item text="Third item" />
		</List>
	)
};

export const CompactDensity: Story = {
	render: () => (
		<List>
			<List.Item text="Compact item 1" />
			<List.Item text="Compact item 2" />
			<List.Item text="Compact item 3" />
			<List.Item text="Compact item 4" />
			<List.Item text="Compact item 5" />
		</List>
	)
};

export const WithSubHeaders: Story = {
	render: () => (
		<List>
			<List.SubHeader>Group 1</List.SubHeader>
			<List.Item text="Item 1.1" />
			<List.Item text="Item 1.2" />
			<List.SubHeader>Group 2</List.SubHeader>
			<List.Item text="Item 2.1" />
			<List.Item text="Item 2.2" />
		</List>
	)
};

export const WithIcons: Story = {
	render: () => (
		<List>
			<List.Item text="Home" graphic={<Icon>home</Icon>} />
			<List.Item text="Profile" graphic={<Icon>user</Icon>} />
			<List.Item text="Settings" graphic={<Icon>settings</Icon>} />
			<List.Item text="Messages" graphic={<Icon>mail</Icon>} />
		</List>
	)
};

export const WithInteractionHint: Story = {
	render: () => (
		<InteractionHintConfigProvider enableInteractionHint>
			<List>
				<List.Item text="Hover to see hint" />
				<List.Item text="Another item with hint" />
				<List.Item text="Third item with hint" />
			</List>
		</InteractionHintConfigProvider>
	)
};

export const WithInteractionHintFollowCursor: Story = {
	render: () => (
		<InteractionHintConfigProvider enableInteractionHint followCursor>
			<List>
				<List.Item text="Home with cursor hint" graphic={<Icon>home</Icon>} />
				<List.Item text="Profile with cursor hint" graphic={<Icon>user</Icon>} />
				<List.Item text="Settings with cursor hint" graphic={<Icon>settings</Icon>} />
			</List>
		</InteractionHintConfigProvider>
	)
};

export const InteractionHintVariations: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
			<div>
				<Typography.Headline level={3}>Basic Interaction Hint</Typography.Headline>
				<InteractionHintConfigProvider enableInteractionHint>
					<List>
						<List.Item text="Item 1" />
						<List.Item text="Item 2" />
						<List.Item text="Item 3" />
					</List>
				</InteractionHintConfigProvider>
			</div>

			<div>
				<Typography.Headline level={3}>Follow Cursor</Typography.Headline>
				<InteractionHintConfigProvider enableInteractionHint followCursor>
					<List>
						<List.Item text="Item 1" />
						<List.Item text="Item 2" />
						<List.Item text="Item 3" />
					</List>
				</InteractionHintConfigProvider>
			</div>

			<div>
				<Typography.Headline level={3}>No Arrow</Typography.Headline>
				<InteractionHintConfigProvider enableInteractionHint hideArrow>
					<List>
						<List.Item text="Item 1" />
						<List.Item text="Item 2" />
						<List.Item text="Item 3" />
					</List>
				</InteractionHintConfigProvider>
			</div>
		</div>
	)
};

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
			<div>
				<Typography.Headline level={3}>Default List</Typography.Headline>
				<List>
					<List.Item text="Item 1" />
					<List.Item text="Item 2" />
					<List.Item text="Item 3" />
				</List>
			</div>

			<div>
				<Typography.Headline level={3}>With Border</Typography.Headline>
				<List border>
					<List.Item text="Item 1" />
					<List.Item text="Item 2" />
					<List.Item text="Item 3" />
				</List>
			</div>

			<div>
				<Typography.Headline level={3}>Compact with Icons and Interaction Hints</Typography.Headline>
				<InteractionHintConfigProvider enableInteractionHint followCursor>
					<List>
						<List.Item text="Home" graphic={<Icon>home</Icon>} />
						<List.Item text="Profile" graphic={<Icon>user</Icon>} />
						<List.Item text="Settings" graphic={<Icon>settings</Icon>} />
					</List>
				</InteractionHintConfigProvider>
			</div>

			<div>
				<Typography.Headline level={3}>With Sub Headers</Typography.Headline>
				<List border>
					<List.SubHeader>Navigation</List.SubHeader>
					<List.Item text="Home" graphic={<Icon>home</Icon>} />
					<List.Item text="Search" graphic={<Icon>search</Icon>} />
					<List.SubHeader>Account</List.SubHeader>
					<List.Item text="Profile" graphic={<Icon>user</Icon>} />
					<List.Item text="Settings" graphic={<Icon>settings</Icon>} />
				</List>
			</div>
		</div>
	)
};
