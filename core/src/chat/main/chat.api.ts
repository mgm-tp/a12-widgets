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

import type { RefCallback, UIEvent, ReactNode, MouseEvent, KeyboardEvent } from "react";

import type { Container, Styleable, Identifiable, Ref } from "../../common/main/base-props.js";

export namespace ChatProps {
	export interface ContainerProps extends Styleable, Container, Identifiable {
		/**
		 * The reference of the chat container element.
		 */
		innerChatContainerRef?: RefCallback<HTMLElement>;

		/**
		 * The scroll event handler for the Chat Container.
		 * @param event – scroll event
		 * @param isScrolledToBottom – Notifies that the scrollbar is scrolled to the bottom.
		 * Deprecated since 28.3.0 - It is extracted to isScrollbarAtBottom prop
		 * @param isAutomaticallyScrolling – Notifies that the scrolling is automatically or not
		 */
		onScroll?(event: UIEvent<HTMLElement>, isScrolledToBottom?: boolean, isAutomaticallyScrolling?: boolean): void;

		/**
		 * The event handler for the Chat Container when the first scrolling event fired.
		 */
		onScrollStart?(firstScrollEvent: UIEvent<HTMLElement>): void;

		/**
		 * The event handler for the Chat Container after the last scrolling event fired.
		 */
		onScrollEnd?(lastScrollEvent: UIEvent<HTMLElement>): void;

		/**
		 * The amount of time (in milliseconds) for firing the onScrollEnd event after the scroll event stop.
		 * @default 250
		 */
		scrollEndDetectingTime?: number;
	}

	export interface MessageProps extends Styleable, Container, Identifiable, Ref<HTMLDivElement> {
		/**
		 * The additional information that is displayed at the bottom of the Message.
		 * Example: Date, Time, sent/received status, etc.
		 */
		status?: ReactNode;

		/**
		 * @deprecated - will base on position of {@link MessageGroupProps}
		 * Position of Message in the Chat Container.
		 *
		 * @default left
		 */
		position?: MessagePosition;
	}

	export interface SecondaryContentProps extends Styleable, Container, Identifiable, Ref<HTMLDivElement> {}

	export interface AvatarProps extends Styleable, Identifiable {
		/**
		 * Specifies the URL of the image.
		 */
		imageUrl: string;

		/**
		 * Specifies an alternate text for an image if the image cannot be displayed.
		 * @default ""
		 */
		alt?: string;
	}

	export interface UserInfo extends Styleable, Identifiable {
		/**
		 * The avatar of the user.
		 * @default 'account_circle' Icon
		 */
		userAvatar?: ReactNode;

		/**
		 * The display name of the user.
		 */
		userName?: ReactNode;

		/**
		 * @deprecated - will base on position of {@link MessageGroupProps}
		 * Position of UserInfo in the Chat Container.
		 *
		 * @default left
		 */
		position?: MessagePosition;
	}

	export type NotificationVariant = "info" | "success" | "warning" | "error";

	export type MessagePosition = "left" | "right";

	export interface NotificationProps extends Styleable, Identifiable, Container {
		/**
		 * Specifies whether the Notification is visible.
		 * @default true
		 */
		show?: boolean;

		/**
		 * Specifies whether the Notification is fixed to the bottom of the Chat Container.
		 * @default false
		 */
		fixedToBottom?: boolean;

		/**
		 * Specifies the variant of the Notification.
		 * @default "info"
		 */
		variant?: NotificationVariant;

		/**
		 * A callback will be triggered when the Notification is clicked by mouse.
		 */
		onClick?(event: MouseEvent<HTMLElement>): void;

		/**
		 * A callback will be triggered when the Notification receives a KeyDown event.
		 */
		onKeyDown?(event: KeyboardEvent<HTMLElement>): void;
	}

	export interface DateMarkerProps extends Styleable, Identifiable, Container {}

	export interface MessageGroupProps extends Styleable, Identifiable, Container {
		/**
		 * Specifies the user information.
		 */
		userInfo?: ReactNode;

		/**
		 * Specifies the position of Messages inside the Message Group.
		 * @default left
		 */
		position?: MessagePosition;
	}

	export interface TypingMarkerProps extends Styleable, Identifiable, Container {}
}
