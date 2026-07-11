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

import { Chat } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Chat.Container> = {
	title: "Business Case/Chat",
	component: Chat.Container,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Chat is a compound component for building chat UIs. Use Chat.Container as the scroll container, Chat.MessageGroup to group messages by user, Chat.Message for individual messages, and Chat.UserInfo / Chat.Avatar for user identity."
			}
		}
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: "Basic Chat",
	render: () => (
		<div style={{ width: "400px", height: "200px", border: "1px solid #ccc" }}>
			<Chat.Container>
				<Chat.MessageGroup
					position="left"
					userInfo={
						<Chat.UserInfo
							position="left"
							userAvatar={<Chat.Avatar imageUrl="https://i.pravatar.cc/40?u=alice" alt="Alice" />}
							userName="Alice"
						/>
					}
				>
					<Chat.Message position="left">Hello! How are you doing today?</Chat.Message>
				</Chat.MessageGroup>

				<Chat.MessageGroup
					position="right"
					userInfo={
						<Chat.UserInfo
							position="right"
							userAvatar={<Chat.Avatar imageUrl="https://i.pravatar.cc/40?u=bob" alt="Bob" />}
							userName="Bob"
						/>
					}
				>
					<Chat.Message position="right">Hi Alice! I&apos;m doing great, thanks!</Chat.Message>
				</Chat.MessageGroup>
			</Chat.Container>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Minimal chat showing left/right message groups with user info and avatar."
			}
		}
	}
};

export const BasicConversation: Story = {
	render: () => (
		<div style={{ width: "400px", height: "500px", border: "1px solid #ccc" }}>
			<Chat.Container>
				<Chat.DateMarker>Today</Chat.DateMarker>

				<Chat.MessageGroup
					position="left"
					userInfo={
						<Chat.UserInfo
							position="left"
							userAvatar={<Chat.Avatar imageUrl="https://i.pravatar.cc/40?u=alice" alt="Alice" />}
							userName="Alice"
						/>
					}
				>
					<Chat.Message position="left">Hello! How are you doing today?</Chat.Message>
					<Chat.Message position="left">Did you get a chance to review the document?</Chat.Message>
				</Chat.MessageGroup>

				<Chat.MessageGroup
					position="right"
					userInfo={
						<Chat.UserInfo
							position="right"
							userAvatar={<Chat.Avatar imageUrl="https://i.pravatar.cc/40?u=bob" alt="Bob" />}
							userName="Bob"
						/>
					}
				>
					<Chat.Message position="right">Hi Alice! I&apos;m doing well, thanks.</Chat.Message>
					<Chat.Message position="right">Yes, I reviewed it. Looks great!</Chat.Message>
				</Chat.MessageGroup>

				<Chat.MessageGroup
					position="left"
					userInfo={
						<Chat.UserInfo
							position="left"
							userAvatar={<Chat.Avatar imageUrl="https://i.pravatar.cc/40?u=alice" alt="Alice" />}
							userName="Alice"
						/>
					}
				>
					<Chat.Message position="left">Great to hear! I&apos;ll send you the final version soon.</Chat.Message>
				</Chat.MessageGroup>
			</Chat.Container>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Basic chat with messages from two participants grouped by user."
			}
		}
	}
};

export const WithTypingIndicator: Story = {
	render: () => (
		<div style={{ width: "400px", height: "300px", border: "1px solid #ccc" }}>
			<Chat.Container>
				<Chat.MessageGroup
					position="left"
					userInfo={
						<Chat.UserInfo
							position="left"
							userAvatar={<Chat.Avatar imageUrl="https://i.pravatar.cc/40?u=carol" alt="Carol" />}
							userName="Carol"
						/>
					}
				>
					<Chat.Message position="left">Just a moment...</Chat.Message>
				</Chat.MessageGroup>
				<Chat.TypingMarker>Carol is typing...</Chat.TypingMarker>
			</Chat.Container>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Chat.TypingMarker shows a typing indicator below the last message."
			}
		}
	}
};

export const WithNotification: Story = {
	render: () => (
		<div style={{ width: "400px", height: "300px", border: "1px solid #ccc", position: "relative" }}>
			<Chat.Container>
				<Chat.MessageGroup
					position="right"
					userInfo={
						<Chat.UserInfo
							position="right"
							userAvatar={<Chat.Avatar imageUrl="https://i.pravatar.cc/40?u=dave" alt="Dave" />}
							userName="Dave"
						/>
					}
				>
					<Chat.Message position="right">Scroll up to see older messages</Chat.Message>
				</Chat.MessageGroup>
			</Chat.Container>
			<Chat.Notification show variant="info" fixedToBottom onClick={() => {}}>
				3 new messages
			</Chat.Notification>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Chat.Notification is a fixed overlay button (e.g., 'scroll to new messages'). Use variant prop for info/success/warning/error styling."
			}
		}
	}
};

export const DateMarkersAndNotifications: Story = {
	name: "Date Markers and Notifications",
	render: () => (
		<div style={{ width: "400px", height: "380px", border: "1px solid #ccc" }}>
			<Chat.Container>
				<Chat.DateMarker>Yesterday</Chat.DateMarker>
				<Chat.Notification variant="info">Alice has joined this space</Chat.Notification>

				<Chat.MessageGroup position="left" userInfo={<Chat.UserInfo position="left" userName="Alice" />}>
					<Chat.Message position="left">Good morning everyone!</Chat.Message>
				</Chat.MessageGroup>

				<Chat.Notification variant="warning">Bob has left this space</Chat.Notification>

				<Chat.DateMarker>Today</Chat.DateMarker>
				<Chat.Notification variant="success">Bob has rejoined this space</Chat.Notification>

				<Chat.MessageGroup position="left" userInfo={<Chat.UserInfo position="left" userName="Bob" />}>
					<Chat.Message position="left">Sorry I had to step away!</Chat.Message>
				</Chat.MessageGroup>

				<Chat.Notification variant="error">Connection interrupted</Chat.Notification>
			</Chat.Container>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Use Chat.DateMarker to visually separate days. Use Chat.Notification (without fixedToBottom) to insert event announcements inline in the message stream — supports info, success, warning, error variants."
			}
		}
	}
};

export const MessageWithStatus: Story = {
	name: "Message with Status",
	render: () => (
		<div style={{ width: "400px", height: "280px", border: "1px solid #ccc" }}>
			<Chat.Container>
				<Chat.MessageGroup position="right" userInfo={<Chat.UserInfo position="right" userName="You" />}>
					<Chat.Message position="right" status="10:30 am · Sent">
						Good morning! Are you available for a quick chat?
					</Chat.Message>
					<Chat.Message position="right" status={<span style={{ color: "#4caf50" }}>10:31 am · ✓ Read</span>}>
						I have a few questions about the project.
					</Chat.Message>
				</Chat.MessageGroup>

				<Chat.MessageGroup
					position="left"
					userInfo={
						<Chat.UserInfo
							position="left"
							userAvatar={<Chat.Avatar imageUrl="https://i.pravatar.cc/40?u=alice" alt="Alice" />}
							userName="Alice"
						/>
					}
				>
					<Chat.Message position="left" status="10:32 am">
						Sure, go ahead!
					</Chat.Message>
				</Chat.MessageGroup>
			</Chat.Container>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Use the status prop on Chat.Message to display metadata below a message — such as a timestamp or delivery/read indicator. The status value can be a string or ReactNode."
			}
		}
	}
};
