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

import type { ReactNode, ChangeEvent, KeyboardEvent, ReactElement } from "react";
import { useState, useRef, useCallback, useEffect, Fragment } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	Chat,
	Icon,
	ActionContentbox,
	ContentBoxElements,
	Button,
	Checkbox,
	TextAreaStateless
} from "@com.mgmtp.a12.widgets/widgets-core";

interface ChatStoryArgs {
	numberOfMessages?: number;
}

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
type InteractiveStory = StoryObj<ChatStoryArgs>;

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
			{/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
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

// --- Adding Multiple Messages story ---

interface MessageType {
	content: ReactNode;
	userName?: string;
	status?: string;
	position?: "left" | "right";
}

type ChatItem = { kind: "message"; data: MessageType } | { kind: "notification"; text: string };

const CONVERSATION: ChatItem[] = [
	{
		kind: "message",
		data: { content: "Hello, my name is Peter. How can I help you?", userName: "Peter", status: "11:11 am" }
	},
	{
		kind: "message",
		data: { content: "Hello! I have a question about room service.", status: "11:13 am", position: "right" }
	},
	{
		kind: "message",
		data: {
			content: "Could you please tell me which service you're asking about?",
			userName: "Peter",
			status: "11:13 am"
		}
	},
	{ kind: "message", data: { content: "It's about pet services.", status: "11:14 am", position: "right" } },
	{
		kind: "message",
		data: {
			content: "My puppies are staying with me and I would like to request food and in-room cleaning services.",
			status: "11:15 am",
			position: "right"
		}
	},
	{
		kind: "message",
		data: {
			content: "Yes, sure. Please check the attached files with all the information about our pet services.",
			userName: "Peter",
			status: "11:16 am"
		}
	},
	{ kind: "message", data: { content: "Pet Services Policy and Agreement", status: "11:17 am", userName: "Peter" } },
	{ kind: "message", data: { content: "Pet Services Registration", status: "11:17 am", userName: "Peter" } },
	{ kind: "message", data: { content: "Great. I'll take a look.", status: "11:17 am", position: "right" } }
];

function AddingMultipleMessagesChat({ numberOfMessages = 3 }: { numberOfMessages?: number }): ReactElement {
	const [inputMessage, setInputMessage] = useState("");
	const [chatItems, setChatItems] = useState<ChatItem[]>(CONVERSATION);
	const chatContainerInstance = useRef<Chat.Container | null>(null);

	const getChatContainerInstance = useCallback((ref: Chat.Container) => {
		chatContainerInstance.current = ref;
	}, []);

	const handleScrollToBottom = useCallback(() => {
		chatContainerInstance.current?.scrollToBottom();
	}, []);

	useEffect(() => {
		handleScrollToBottom();
	}, [handleScrollToBottom, chatItems]);

	const handleInputChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
		const message = event.target.value;

		if (message.substring(-1) === "\n" && message.trim() === "") {
			return;
		}

		setInputMessage(message);
	}, []);

	const handleSendMessage = useCallback((): void => {
		if (inputMessage.trim() !== "") {
			const date = new Date();
			const hour = date.getHours() - (date.getHours() >= 12 ? 12 : 0);
			const period = date.getHours() >= 12 ? "pm" : "am";
			const status = `${hour}:${date.getMinutes()} ${period}`;

			const newItems: ChatItem[] = [
				{ kind: "message", data: { content: inputMessage.trim(), status, position: "right" } }
			];

			for (let i = 1; i < numberOfMessages; i++) {
				newItems.push({
					kind: "message",
					data: {
						content: (
							<>
								Re ({i}): <strong>{inputMessage.trim()}</strong> <Icon>check_circle</Icon>
							</>
						),
						status,
						userName: "Peter"
					}
				});
			}

			newItems.push({ kind: "notification", text: `${numberOfMessages} new messages received` });

			setChatItems((items) => [...items, ...newItems]);
		}

		setInputMessage("");
	}, [inputMessage, numberOfMessages]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLTextAreaElement>): void => {
			if (event.key === "Enter" && !event.shiftKey) {
				handleSendMessage();
			}
		},
		[handleSendMessage]
	);

	const renderMessageGroups = useCallback((): ReactNode => {
		const groups: ({ kind: "messageGroup"; messages: MessageType[] } | { kind: "notification"; text: string })[] = [];

		for (const item of chatItems) {
			if (item.kind === "notification") {
				groups.push({ kind: "notification", text: item.text });
			} else {
				const lastGroup = groups[groups.length - 1];

				if (lastGroup?.kind === "messageGroup" && item.data.userName === lastGroup.messages[0].userName) {
					lastGroup.messages.push(item.data);
				} else {
					groups.push({ kind: "messageGroup", messages: [item.data] });
				}
			}
		}

		return groups.map((group, index) => {
			if (group.kind === "notification") {
				return (
					<Chat.Notification key={`notification-${index}`} variant="success">
						{group.text}
					</Chat.Notification>
				);
			}

			return (
				<Chat.MessageGroup
					position={group.messages[0].position}
					userInfo={group.messages[0].userName ? <Chat.UserInfo userName={group.messages[0].userName} /> : undefined}
					key={index}
				>
					{group.messages.map((message, msgIndex) => (
						<Fragment key={msgIndex}>
							<Chat.Message status={message.status}>{message.content}</Chat.Message>
						</Fragment>
					))}
				</Chat.MessageGroup>
			);
		});
	}, [chatItems]);

	return (
		<ActionContentbox
			style={{ height: 500, width: 400 }}
			className="-u-flex"
			headingElements={<ContentBoxElements.Title key="title" text="Chat with expandable input" />}
			padding={false}
			footer={
				<ContentBoxElements.Footer>
					<div className="-u-flex -u-width-full">
						<div className="-u-flex-grow -u-margin-r-xs -u-self-start -sc-input-wrapper">
							<TextAreaStateless
								style={{ maxHeight: 300 }}
								value={inputMessage}
								placeholder="Type anything..."
								onChange={handleInputChange}
								onKeyDown={handleKeyDown}
								autoExpand
							/>
						</div>
						<Button
							className="-u-self-start"
							onClick={handleSendMessage}
							icon={<Icon>send</Icon>}
							title="Send Message"
							primary
						/>
					</div>
				</ContentBoxElements.Footer>
			}
		>
			<Chat.Container ref={getChatContainerInstance}>{renderMessageGroups()}</Chat.Container>
		</ActionContentbox>
	);
}

export const AddingMultipleMessages: InteractiveStory = {
	render: (args) => <AddingMultipleMessagesChat numberOfMessages={args.numberOfMessages as number} />,
	args: {
		numberOfMessages: 3
	},
	argTypes: {
		numberOfMessages: {
			control: { type: "number", min: 1, step: 1 },
			description: "Number of messages added per send (1 user message + N-1 replies)"
		}
	},
	parameters: {
		docs: {
			description: {
				story:
					"Interactive chat that demonstrates adding multiple messages dynamically. Type a message and press Enter or click Send — configurable number of replies are generated automatically."
			}
		}
	}
};

// --- Add Message and Notification story ---

function AddMessageAndNotificationChat(): ReactElement {
	const [inputMessage, setInputMessage] = useState("");
	const [chatItems, setChatItems] = useState<ChatItem[]>(CONVERSATION);
	const notificationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const chatContainerInstance = useRef<Chat.Container | null>(null);

	const getChatContainerInstance = useCallback((ref: Chat.Container) => {
		chatContainerInstance.current = ref;
	}, []);

	const handleScrollToBottom = useCallback(() => {
		chatContainerInstance.current?.scrollToBottom();
	}, []);

	useEffect(() => {
		handleScrollToBottom();
	}, [handleScrollToBottom, chatItems]);

	useEffect(() => {
		return () => {
			if (notificationTimerRef.current) {
				clearTimeout(notificationTimerRef.current);
			}
		};
	}, []);

	const handleInputChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
		const message = event.target.value;

		if (message.substring(-1) === "\n" && message.trim() === "") {
			return;
		}

		setInputMessage(message);
	}, []);

	const handleSendMessage = useCallback((): void => {
		if (inputMessage.trim() !== "") {
			const date = new Date();
			const hour = date.getHours() - (date.getHours() >= 12 ? 12 : 0);
			const period = date.getHours() >= 12 ? "pm" : "am";

			const messageItem: ChatItem = {
				kind: "message",
				data: { content: inputMessage.trim(), status: `${hour}:${date.getMinutes()} ${period}`, position: "right" }
			};

			setChatItems((items) => [...items, messageItem]);

			if (notificationTimerRef.current) {
				clearTimeout(notificationTimerRef.current);
			}

			notificationTimerRef.current = setTimeout(() => {
				setChatItems((items) => [...items, { kind: "notification", text: "Message sent successfully" }]);
			}, 2000);
		}

		setInputMessage("");
	}, [inputMessage]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLTextAreaElement>): void => {
			if (event.key === "Enter" && !event.shiftKey) {
				handleSendMessage();
			}
		},
		[handleSendMessage]
	);

	const renderMessageGroups = useCallback((): ReactNode => {
		const groups: ({ kind: "messageGroup"; messages: MessageType[] } | { kind: "notification"; text: string })[] = [];

		for (const item of chatItems) {
			if (item.kind === "notification") {
				groups.push({ kind: "notification", text: item.text });
			} else {
				const lastGroup = groups[groups.length - 1];

				if (lastGroup?.kind === "messageGroup" && item.data.userName === lastGroup.messages[0].userName) {
					lastGroup.messages.push(item.data);
				} else {
					groups.push({ kind: "messageGroup", messages: [item.data] });
				}
			}
		}

		return groups.map((group, index) => {
			if (group.kind === "notification") {
				return (
					<Chat.Notification key={`notification-${index}`} variant="success">
						{group.text}
					</Chat.Notification>
				);
			}

			return (
				<Chat.MessageGroup
					position={group.messages[0].position}
					userInfo={group.messages[0].userName ? <Chat.UserInfo userName={group.messages[0].userName} /> : undefined}
					key={index}
				>
					{group.messages.map((message, msgIndex) => (
						<Fragment key={msgIndex}>
							<Chat.Message status={message.status}>{message.content}</Chat.Message>
						</Fragment>
					))}
				</Chat.MessageGroup>
			);
		});
	}, [chatItems]);

	return (
		<ActionContentbox
			style={{ height: 500, width: 400 }}
			className="-u-flex"
			headingElements={<ContentBoxElements.Title key="title" text="Chat with expandable input" />}
			padding={false}
			footer={
				<ContentBoxElements.Footer>
					<div className="-u-flex -u-width-full">
						<div className="-u-flex-grow -u-margin-r-xs -u-self-start -sc-input-wrapper">
							<TextAreaStateless
								style={{ maxHeight: 300 }}
								value={inputMessage}
								placeholder="Type anything..."
								onChange={handleInputChange}
								onKeyDown={handleKeyDown}
								autoExpand
							/>
						</div>
						<Button
							className="-u-self-start"
							onClick={handleSendMessage}
							icon={<Icon>send</Icon>}
							title="Send Message"
							primary
						/>
					</div>
				</ContentBoxElements.Footer>
			}
		>
			<Chat.Container ref={getChatContainerInstance}>{renderMessageGroups()}</Chat.Container>
		</ActionContentbox>
	);
}

export const AddMessageAndNotification: InteractiveStory = {
	render: () => <AddMessageAndNotificationChat />,
	parameters: {
		docs: {
			description: {
				story:
					"Interactive chat that demonstrates adding messages and notifications dynamically. Type a message and press Enter or click Send — the message appears immediately, and a success notification is added after the configured delay."
			}
		}
	}
};

// --- Message and fixedToBottom Notification story ---

function MessageAndFixedToBottomNotificationChat(): ReactElement {
	const [inputMessage, setInputMessage] = useState("");
	const [additionalMessages, setAdditionalMessages] = useState<MessageType[]>([]);
	const [showNotification, setShowNotification] = useState(true);
	const [notificationText, setNotificationText] = useState<string | null>(null);
	const notificationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const chatContainerInstance = useRef<Chat.Container | null>(null);

	const getChatContainerInstance = useCallback((ref: Chat.Container) => {
		chatContainerInstance.current = ref;
	}, []);

	const handleScrollToBottom = useCallback(() => {
		chatContainerInstance.current?.scrollToBottom();
	}, []);

	useEffect(() => {
		handleScrollToBottom();
	}, [handleScrollToBottom, additionalMessages]);

	useEffect(() => {
		return () => {
			if (notificationTimerRef.current) {
				clearTimeout(notificationTimerRef.current);
			}
		};
	}, []);

	const handleInputChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
		const message = event.target.value;

		if (message.substring(-1) === "\n" && message.trim() === "") {
			return;
		}

		setInputMessage(message);
	}, []);

	const handleSendMessage = useCallback((): void => {
		if (inputMessage.trim() !== "") {
			const date = new Date();
			const hour = date.getHours() - (date.getHours() >= 12 ? 12 : 0);
			const period = date.getHours() >= 12 ? "pm" : "am";
			const status = `${hour}:${date.getMinutes()} ${period}`;

			setAdditionalMessages((messages) => [...messages, { content: inputMessage.trim(), status, position: "right" }]);

			if (notificationTimerRef.current) {
				clearTimeout(notificationTimerRef.current);
			}

			setNotificationText(null);
			notificationTimerRef.current = setTimeout(() => {
				setNotificationText("Message sent successfully");
			}, 2000);
		}

		setInputMessage("");
	}, [inputMessage]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLTextAreaElement>): void => {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				handleSendMessage();
			}
		},
		[handleSendMessage]
	);

	return (
		<ActionContentbox
			style={{ height: 500, width: 400 }}
			className="-u-flex"
			headingElements={<ContentBoxElements.Title key="title" text="Chat with fixedToBottom notification" />}
			padding={false}
			footer={
				<ContentBoxElements.Footer>
					<div className="-u-flex -u-width-full">
						<div className="-u-flex-grow -u-margin-r-xs -u-self-start -sc-input-wrapper">
							<TextAreaStateless
								style={{ maxHeight: 300 }}
								value={inputMessage}
								placeholder="Type anything..."
								onChange={handleInputChange}
								onKeyDown={handleKeyDown}
								autoExpand
							/>
						</div>
						<Button
							className="-u-self-start"
							onClick={handleSendMessage}
							icon={<Icon>send</Icon>}
							title="Send Message"
							primary
						/>
					</div>
					<Checkbox
						label="Show notification after message"
						checked={showNotification}
						onChange={() => setShowNotification((prev) => !prev)}
					/>
				</ContentBoxElements.Footer>
			}
		>
			<Chat.Container ref={getChatContainerInstance}>
				{CONVERSATION.filter((item) => item.kind === "message").map((item, index) => (
					<Chat.MessageGroup
						key={index}
						position={item.data.position}
						userInfo={item.data.userName ? <Chat.UserInfo userName={item.data.userName} /> : undefined}
					>
						<Chat.Message status={item.data.status}>{item.data.content}</Chat.Message>
					</Chat.MessageGroup>
				))}

				{additionalMessages.map((message, index) => (
					<Chat.MessageGroup key={`new-${index}`} position="right">
						<Chat.Message status={message.status}>{message.content}</Chat.Message>
					</Chat.MessageGroup>
				))}

				{showNotification && notificationText && (
					<Chat.Notification variant="success" fixedToBottom>
						{notificationText}
					</Chat.Notification>
				)}
			</Chat.Container>
		</ActionContentbox>
	);
}

export const MessageAndFixedToBottomNotification: InteractiveStory = {
	name: "Message and fixedToBottom Notification",
	render: () => <MessageAndFixedToBottomNotificationChat />,
	parameters: {
		docs: {
			description: {
				story:
					"Interactive chat demonstrating the fixedToBottom notification overlay. Send a message and a success notification appears fixed to the bottom of the chat container after a configurable delay. Use the checkbox to toggle the notification feature on/off."
			}
		}
	}
};
