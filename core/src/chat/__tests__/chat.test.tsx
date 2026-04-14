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

import { render, fireEvent, screen } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";

import { Chat } from "../main/chat.view.js";
import type { ChatProps } from "../main/chat.api.js";

const { Message, Container, MessageGroup, UserInfo, Avatar, DateMarker, Notification, TypingMarker, SecondaryContent } =
	Chat;

const baseClassName = "chat";
const properties = {
	id: "test-id",
	className: "test-class",
	style: {
		color: "red"
	}
};

const mockA11yDefinition = {
	chatTitles: {
		chatMessageSaid: "said:",
		chatMessageYouSaid: "You said:"
	}
};

describe("com.mgmtp.a12.widgets.chat.Container", () => {
	test("rendering-container", () => {
		const { container } = render(<Container {...properties} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("get-inner-chat-container-ref", () => {
		const innerRef = vi.fn();
		render(<Container innerChatContainerRef={innerRef} />);
		expect(innerRef).toHaveBeenCalledTimes(1);
	});
});

describe("com.mgmtp.a12.widgets.chat.template", () => {
	test("rendering-message", () => {
		const message = "message";
		const { container } = render(
			<Message {...properties} status="11:11 am">
				{message}
			</Message>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-message-group-with-position", () => {
		const positions: ChatProps.MessagePosition[] = ["left", "right"];
		positions.forEach((position) => {
			const { container } = render(<MessageGroup position={position} />);
			expect(container.firstChild).toMatchSnapshot();
		});
	});

	test("get-wrapperRef-message", () => {
		const wrapperRef = vi.fn();
		render(<Message wrapperRef={wrapperRef} />);
		expect(wrapperRef).toHaveBeenCalledTimes(1);
	});

	test("rendering-user-info", () => {
		const { container } = render(<UserInfo userName="Peter" {...properties} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-avatar", () => {
		const imageUrl = "images/user-avatar.png";
		const { container } = render(<Avatar imageUrl={imageUrl} alt="avatar" {...properties} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-date-marker", () => {
		const children = "Yesterday";
		const { container } = render(<DateMarker {...properties}>{children}</DateMarker>);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-notification", () => {
		const children = "2 new messages";
		const { container } = render(<Notification {...properties}>{children}</Notification>);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-notification-type", () => {
		const children = "2 new messages";
		const variantList: ChatProps.NotificationVariant[] = ["success", "error", "warning"];
		variantList.forEach((variant) => {
			const { container } = render(
				<Notification variant={variant} {...properties}>
					{children}
				</Notification>
			);
			expect(container.firstChild).toMatchSnapshot();
		});
	});

	test("rendering-notification-with-fixToBottom", () => {
		const { container } = render(<Notification show={true} fixedToBottom={true} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating-click-event-notification", () => {
		const onClick = vi.fn();

		const { container } = render(<Notification show={true} onClick={onClick} />);
		expect(container.firstChild).toMatchSnapshot();
		const wrapperContent = container.querySelector(`.${baseClassName}-notification-wrapper--clickable`);

		wrapperContent && fireEvent.click(wrapperContent);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	test("rendering-type-marker", () => {
		const children = "typing...";
		const { container } = render(<TypingMarker {...properties}>{children}</TypingMarker>);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-message-group", () => {
		const positions: ChatProps.MessagePosition[] = ["left", "right"];
		positions.forEach((position) => {
			const { container } = render(
				<MessageGroup position={position} userInfo={<UserInfo userName="Peter" />}>
					<Message>Hello, my name is Peter. How can I help you?</Message>
				</MessageGroup>
			);
			expect(container.firstChild).toMatchSnapshot();
		});
	});

	test("rendering-message-group-properties", () => {
		const { container } = render(<MessageGroup {...properties} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-secondary-content", () => {
		const children = "secondary content...";
		const { container } = render(<SecondaryContent {...properties}>{children}</SecondaryContent>);

		expect(container.firstChild).toMatchSnapshot();
	});
});

describe("UserNameContext and aria-label functionality", () => {
	test("Message should have correct aria-label when userName is provided via UserInfo", () => {
		render(
			<A11YLanguageContext.Provider value={mockA11yDefinition}>
				<Chat.Container>
					<Chat.MessageGroup userInfo={<Chat.UserInfo userName="Alice" />}>
						<Chat.Message>Hello World</Chat.Message>
					</Chat.MessageGroup>
				</Chat.Container>
			</A11YLanguageContext.Provider>
		);

		const messageContent = screen.getByRole("region");
		expect(messageContent).toHaveAttribute("aria-label", "Alice said:");
	});

	test("Message should have default aria-label when no userName is provided", () => {
		render(
			<A11YLanguageContext.Provider value={mockA11yDefinition}>
				<Chat.Container>
					<Chat.MessageGroup position="right">
						<Chat.Message>Hello World</Chat.Message>
					</Chat.MessageGroup>
				</Chat.Container>
			</A11YLanguageContext.Provider>
		);

		const messageContent = screen.getByRole("region");
		expect(messageContent).toHaveAttribute("aria-label", "You said:");
	});

	test("Multiple messages in MessageGroup should inherit the same userName", () => {
		render(
			<A11YLanguageContext.Provider value={mockA11yDefinition}>
				<Chat.Container>
					<Chat.MessageGroup userInfo={<Chat.UserInfo userName="Alice" />}>
						<Chat.Message>First message</Chat.Message>
						<Chat.Message>Second message</Chat.Message>
					</Chat.MessageGroup>
				</Chat.Container>
			</A11YLanguageContext.Provider>
		);

		const messageContents = screen.getAllByRole("region");
		expect(messageContents).toHaveLength(2);
		expect(messageContents[0]).toHaveAttribute("aria-label", "Alice said:");
		expect(messageContents[1]).toHaveAttribute("aria-label", "Alice said:");
	});
});
