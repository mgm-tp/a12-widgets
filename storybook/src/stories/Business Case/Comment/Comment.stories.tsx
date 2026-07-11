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

import { Comment, Button, ButtonGroup, Icon, Tag, TagGroup } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Comment> = {
	title: "Business Case/Comment",
	component: Comment,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Comment renders a single comment with avatar, author info, body text, and optional replies. Use CommentList for a list of comments, and CommentContainer for the floating panel pattern."
			}
		}
	},
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

const commentMeta1 = {
	avatar: <div style={avatarStyle}>A</div>,
	author: <strong>Alice Johnson</strong>,
	action: "commented on",
	date: <span style={{ color: "#666" }}>2 hours ago</span>
};

export const Default: Story = {
	args: {
		commentMeta: commentMeta1,
		children: "This looks great! I think we should proceed with this approach and schedule a review meeting."
	}
};

export const WithReplies: Story = {
	render: () => (
		<Comment
			commentMeta={commentMeta1}
			replies={
				<Comment
					isReply
					commentMeta={{
						avatar: (
							<div
								style={{
									width: 28,
									height: 28,
									borderRadius: "50%",
									background: "#7b68ee",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#fff",
									fontWeight: "bold",
									fontSize: 12
								}}
							>
								B
							</div>
						),
						author: <strong>Bob Smith</strong>,
						date: <span style={{ color: "#666" }}>1 hour ago</span>
					}}
				>
					Agreed! Let me set up the meeting for Thursday.
				</Comment>
			}
		>
			This looks great! I think we should proceed with this approach.
		</Comment>
	),
	parameters: {
		docs: {
			description: {
				story: "Comment with a reply nested below. Use isReply prop on the nested Comment to style it as a reply."
			}
		}
	}
};

export const Inactive: Story = {
	args: {
		commentMeta: commentMeta1,
		inactive: true,
		inactiveCommentMeta: {
			author: <em style={{ color: "#999" }}>Alice Johnson (deactivated)</em>,
			date: <span style={{ color: "#999" }}>3 days ago</span>
		},
		children: "This comment is from a deactivated user."
	},
	parameters: {
		docs: {
			description: {
				story: "Inactive comment shows inactiveCommentMeta instead of commentMeta when inactive=true."
			}
		}
	}
};

export const WithActionButtons: Story = {
	name: "With Action Buttons",
	render: () => (
		<Comment
			commentMeta={commentMeta1}
			actionButtons={
				<ButtonGroup>
					<Button secondary icon={<Icon>reply</Icon>}>
						Reply
					</Button>
					<Button secondary icon={<Icon>thumb_up</Icon>}>
						Like
					</Button>
				</ButtonGroup>
			}
		>
			Use the actionButtons prop to attach contextual actions — reply, like, edit, or delete — directly below the
			comment body.
		</Comment>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Use the actionButtons prop to place a ButtonGroup below the comment body for contextual actions like reply or like."
			}
		}
	}
};

export const WithCommentTags: Story = {
	name: "With Comment Tags",
	render: () => (
		<Comment
			commentMeta={commentMeta1}
			commentTags={
				<TagGroup>
					<Tag icon={<Icon>bug_report</Icon>}>Bug</Tag>
					<Tag icon={<Icon>priority_high</Icon>}>High Priority</Tag>
					<Tag>UI</Tag>
				</TagGroup>
			}
		>
			Use the commentTags prop to attach categorisation tags to a comment.
		</Comment>
	),
	parameters: {
		docs: {
			description: {
				story: "Use the commentTags prop with Tag and TagGroup to display categorisation chips below the comment body."
			}
		}
	}
};
