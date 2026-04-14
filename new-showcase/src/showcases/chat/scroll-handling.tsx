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
import { Key } from "ts-key-enum";

import {
	Chat,
	Icon,
	ActionContentbox,
	ContentBoxElements,
	Button,
	TextAreaStateless
} from "@com.mgmtp.a12.widgets/widgets-core";

const { Container, Message, UserInfo, MessageGroup, Notification } = Chat;

interface MessageType {
	content: ReactNode;
	userName?: string;
	status?: string;
	position?: "left" | "right";
	getRef?(element: HTMLElement | null): void;
}

const CONVERSATION: MessageType[] = [
	{ content: "Hello, my name is Peter. How can I help you?", userName: "Peter", status: "11:11 am" },
	{ content: "Hello! I have a question about room service.", status: "11:13 am", position: "right" },
	{ content: "Could you please tell me which service you're asking about?", userName: "Peter", status: "11:13 am" },
	{ content: "It's about pet services.", status: "11:14 am", position: "right" },
	{
		content: "My puppies are staying with me and I would like to request food and in-room cleaning services.",
		status: "11:15 am",
		position: "right"
	},
	{
		content: "Yes, sure. Please check the attached files with all the information about our pet services.",
		userName: "Peter",
		status: "11:16 am"
	},
	{ content: "Pet Services Policy and Agreement", status: "11:17 am", userName: "Peter" },
	{ content: "Pet Services Registration", status: "11:17 am", userName: "Peter" },
	{ content: "Great. I'll take a look.", status: "11:17 am", position: "right" }
];

export function ScrollHandlingChatShowcase(): ReactElement {
	const [inputMessage, setInputMessage] = useState("");
	const [messages, setMessages] = useState<MessageType[]>(CONVERSATION);
	const [shouldShowNotification, setShouldShowNotification] = useState(false);

	const chatContainerInstance = useRef<Chat.Container | null>(null);

	const getChatContainerInstance = useCallback((ref: Chat.Container) => {
		chatContainerInstance.current = ref;
	}, []);

	const handleInputChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
		const message = event.target.value;

		if (message.substring(-1) === "\n" && message.trim() === "") {
			return;
		}

		setInputMessage(message);
	}, []);

	const handleScrollToBottom = useCallback(() => {
		chatContainerInstance.current?.scrollToBottom();
	}, []);

	const handleSendMessage = useCallback((): void => {
		const message: MessageType = { content: inputMessage.trim(), status: "11:30", position: "right" };

		if (inputMessage.trim() !== "") {
			const date = new Date();
			const hour = date.getHours() - (date.getHours() >= 12 ? 12 : 0);
			const period = date.getHours() >= 12 ? "pm" : "am";

			setMessages([...messages, { ...message, status: `${hour}:${date.getMinutes()} ${period}` }]);
		}

		setInputMessage("");
	}, [inputMessage, messages]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLTextAreaElement>): void => {
			if (event.key === Key.Enter && !event.shiftKey) {
				handleSendMessage();
			}
		},
		[handleSendMessage]
	);

	const handleScrollEnd = useCallback(() => {
		if (chatContainerInstance.current?.isScrollbarAtBottom()) {
			setShouldShowNotification(false);
		} else if (!shouldShowNotification) {
			setShouldShowNotification(true);
		}
	}, [shouldShowNotification]);

	const renderMessageGroups = useCallback((): ReactNode => {
		const messageGroups = messages.reduce((accumulator: MessageType[][], currentMsg) => {
			if (accumulator.length && currentMsg.userName === accumulator[accumulator.length - 1][0].userName) {
				accumulator[accumulator.length - 1].push(currentMsg);
			} else {
				accumulator.push([currentMsg]);
			}

			return accumulator;
		}, []);

		return messageGroups.map((values, index) => {
			return (
				<MessageGroup
					position={values[0].position}
					userInfo={values[0].userName ? <UserInfo {...values[0]} /> : undefined}
					key={index}
				>
					{values.map((message, index) => {
						return (
							<Fragment key={index}>
								<Message status={message.status} wrapperRef={message.getRef}>
									{message.content}
								</Message>
							</Fragment>
						);
					})}
				</MessageGroup>
			);
		});
	}, [messages]);

	useEffect(() => {
		handleScrollToBottom();
	}, [handleScrollToBottom, messages]);

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
			<Container ref={getChatContainerInstance} onScrollEnd={handleScrollEnd} scrollEndDetectingTime={0}>
				{renderMessageGroups()}
				<Notification onClick={handleScrollToBottom} show={shouldShowNotification} fixedToBottom={true}>
					Scroll to bottom <Icon>arrow_downward</Icon>
				</Notification>
			</Container>
		</ActionContentbox>
	);
}
