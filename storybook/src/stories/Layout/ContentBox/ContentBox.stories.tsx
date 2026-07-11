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

import { ActionContentbox, ContentBoxElements, Button } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof ActionContentbox> = {
	title: "Layout/ContentBox",
	component: ActionContentbox,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		padding: {
			control: "text",
			description: "Padding for the content area. Pass true/false or a CSS value"
		},
		embedded: {
			control: "boolean",
			description: "Render the content box in embedded (no shadow/border) style"
		},
		boxShadow: {
			control: "select",
			options: ["default", "always", "none"],
			description: "Controls box-shadow rendering"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={2} text="Content Box" />}>
			<p>This is the main content area of the ContentBox.</p>
			<p>It can contain any React content.</p>
		</ActionContentbox>
	)
};

export const WithSubtitle: Story = {
	render: () => (
		<ActionContentbox
			headingElements={
				<>
					<ContentBoxElements.Title ariaLevel={2} key="title" text="Content Box Heading" />
					<ContentBoxElements.Subtitle key="subtitle" text="A descriptive subtitle" />
				</>
			}
		>
			<p>Content box with both a title and subtitle in the heading area.</p>
		</ActionContentbox>
	)
};

export const WithCloseButton: Story = {
	render: () => (
		<ActionContentbox
			headingElements={<ContentBoxElements.Title ariaLevel={2} text="Closeable Content Box" />}
			headingButtons={<ContentBoxElements.CloseButton />}
		>
			<p>This content box shows a close button in the heading.</p>
		</ActionContentbox>
	)
};

export const WithBackButton: Story = {
	render: () => (
		<ActionContentbox
			headingPrefixes={<ContentBoxElements.BackButton />}
			headingElements={<ContentBoxElements.Title ariaLevel={2} text="Detail View" />}
		>
			<p>A back button prefix is useful in navigation flows or detail views.</p>
		</ActionContentbox>
	)
};

export const WithFooter: Story = {
	render: () => (
		<ActionContentbox
			headingElements={<ContentBoxElements.Title ariaLevel={2} text="Content Box with Footer" />}
			footer={
				<ContentBoxElements.Footer>
					<div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
						<Button label="Cancel" />
						<Button primary label="Save" />
					</div>
				</ContentBoxElements.Footer>
			}
		>
			<p>This content box has a footer containing action buttons.</p>
		</ActionContentbox>
	)
};

export const Embedded: Story = {
	render: () => (
		<ActionContentbox embedded headingElements={<ContentBoxElements.Title ariaLevel={2} text="Embedded Content Box" />}>
			<p>Embedded mode removes the outer shadow and border, useful when nested inside other containers.</p>
		</ActionContentbox>
	)
};

export const WithNotificationArea: Story = {
	render: () => (
		<ActionContentbox
			headingElements={<ContentBoxElements.Title ariaLevel={2} text="Content Box with Notification" />}
			notificationArea={
				<div
					style={{
						background: "#fff3cd",
						border: "1px solid #ffc107",
						borderRadius: "4px",
						padding: "8px 12px"
					}}
				>
					<strong>Warning:</strong> Some fields require your attention.
				</div>
			}
		>
			<p>The notification area appears below the heading and above the content.</p>
		</ActionContentbox>
	)
};

export const NoPadding: Story = {
	render: () => (
		<ActionContentbox padding={false} headingElements={<ContentBoxElements.Title ariaLevel={2} text="No Padding" />}>
			<div style={{ background: "#f5f5f5", padding: "24px" }}>
				Content with padding disabled — the content fills edge to edge.
			</div>
		</ActionContentbox>
	)
};
