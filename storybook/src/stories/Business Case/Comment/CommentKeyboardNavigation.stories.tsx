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

import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	Comment,
	Button,
	Icon,
	Typography,
	KeyboardNavigationConfigProvider
} from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Comment> = {
	title: "Business Case/Comment/KeyboardNavigation",
	component: Comment,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const avatarStyle: CSSProperties = {
	width: 32,
	height: 32,
	borderRadius: "50%",
	background: "#4a90d9",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	color: "#fff",
	fontWeight: "bold"
};

const commentMeta = {
	avatar: <div style={avatarStyle}>A</div>,
	author: <strong>Alice Johnson</strong>,
	action: "commented on",
	date: <span style={{ color: "#666" }}>2 hours ago</span>
};

const actionButtons = (
	<>
		<Button icon={<Icon>reply</Icon>} title="Reply" />
		<Button icon={<Icon>edit</Icon>} title="Edit" />
		<Button icon={<Icon>delete</Icon>} title="Delete" />
	</>
);

const NavContext = ({ children }: { children: React.ReactNode }) => (
	<div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px" }}>
		<Typography.Body>
			Use <strong>Tab</strong> to navigate between focusable areas on this page.
		</Typography.Body>
		{children}
	</div>
);

export const DefaultMode: Story = {
	render: () => (
		<NavContext>
			<Comment commentMeta={commentMeta} actionButtons={actionButtons}>
				This looks great! I think we should proceed with this approach and schedule a review meeting.
			</Comment>
		</NavContext>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**Comment — default keyboard navigation.** " +
					"**Tab** moves focus through each action button (Reply, Edit, Delete) in sequence. " +
					"**Enter** / **Space** activates the focused button."
			}
		}
	}
};

export const ArrowOnlyMode: Story = {
	render: () => (
		<KeyboardNavigationConfigProvider componentConfigs={{ comment: "arrow-only" }}>
			<NavContext>
				<Comment commentMeta={commentMeta} actionButtons={actionButtons}>
					This looks great! I think we should proceed with this approach and schedule a review meeting.
				</Comment>
			</NavContext>
		</KeyboardNavigationConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**Comment — arrow-only mode** (via `KeyboardNavigationConfigProvider`). " +
					"**← / →** or **↑ / ↓** navigate between action buttons (Reply, Edit, Delete). " +
					"**Tab** skips the entire comment and moves focus to the next focusable element outside."
			}
		}
	}
};
