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

import type { UIEvent, ReactNode, ReactElement } from "react";
import { createRef, Children, isValidElement, Component, useContext, useRef, createContext } from "react";
import { scroller, animateScroll, Events } from "react-scroll";

import { bindMethods, generateUid, joinClassNames, addPrefix } from "../../common/main/utils.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { Icon } from "../../icon/main/icon.view.js";
import { WidgetsResizeDetector } from "../../common/main/widgets-resize-detector/widgets-resize-detector.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { ChatProps } from "./chat.api.js";
import {
	StyledAvatarImage,
	StyledAvatarWrapper,
	StyledBottomNotificationWrapper,
	StyledContainerInner,
	StyledContainerWrapper,
	StyledDateContent,
	StyledDateMarker,
	StyledMessageBubble,
	StyledMessageContainer,
	StyledMessageContent,
	StyledMessageGroup,
	StyledMessageStatus,
	StyledMessageWrapper,
	StyledNotificationContent,
	StyledNotificationWrapper,
	StyledSecondaryContent,
	StyledTypingMaker,
	StyledUserInfo,
	StyledUserName,
	StyledNotificationContainer
} from "./chat.styled.js";

const baseClassName = addPrefix("chat");

const UserNameContext = createContext<string | undefined>(undefined);

export namespace Chat {
	const MESSAGE_BASE_CLASS = `${baseClassName}-message`;
	const MESSAGE_GROUP_BASE_CLASS = `${baseClassName}-message-group`;
	const SCROLL_OFFSET = 1;
	const SCROLL_DURATION = 300;
	const SCROLL_OPTIONS = {
		duration: SCROLL_DURATION,
		delay: 0,
		smooth: "easeInOutQuad",
		offset: SCROLL_OFFSET
	};

	interface ContainerState {
		isScrollingEnd: boolean;
	}

	export class Container extends Component<ChatProps.ContainerProps, ContainerState> {
		static displayName = "Chat.Container";
		public static defaultProps = {
			scrollEndDetectingTime: 250
		};

		private innerContainerRef: HTMLElement | null = null;
		private lastMessage: Element | null = null;
		private lastElement: Element | null = null;
		private wrapperRef = createRef<HTMLDivElement>();

		private innerContainerId: string;
		private numberOfMessageGroup = 0;
		private scrollOptions = {};
		private scrollEndTimeoutId: number | null = null;

		private scrollbarAtBottom = true;
		private isAutomaticallyScrolling = false;
		private scrollbarAtBottomBeforeResize = false;

		constructor(props: ChatProps.ContainerProps) {
			super(props);

			this.state = { isScrollingEnd: true };

			this.innerContainerId = this.props.id ? `${this.props.id}-inner-container` : `inner-container-${generateUid()}`;
			this.scrollOptions = { ...SCROLL_OPTIONS, containerId: this.innerContainerId };

			bindMethods(this);
		}

		private getInnerContainerRef(ref: HTMLDivElement | null): void {
			this.innerContainerRef = ref;
			this.props.innerChatContainerRef?.(ref);
		}

		/**
		 * Force the scrollbar to the bottom. Due to cases when CSS is not finished loading,
		 * the scroll height may be smaller than actual height after loading CSS
		 */
		private pageLoadListener() {
			this.scrollToBottom();
		}

		private scrollIntoView(): void {
			if (this.innerContainerRef && this.state.isScrollingEnd) {
				const messageGroups = this.innerContainerRef.getElementsByClassName(MESSAGE_GROUP_BASE_CLASS);
				const lastMessageGroup = messageGroups[messageGroups.length - 1];

				const messages = this.innerContainerRef.getElementsByClassName(MESSAGE_BASE_CLASS);
				const lastMessage = messages[messages.length - 1];

				const lastElement = this.innerContainerRef.lastElementChild;

				if (this.numberOfMessageGroup !== messageGroups.length) {
					this.scrollMessage(lastMessageGroup, true);
				} else if (lastMessage !== this.lastMessage) {
					this.scrollMessage(lastMessage);
				} else if (lastElement !== this.lastElement && this.scrollbarAtBottom) {
					this.scrollToBottom(undefined, false);
				}

				this.lastMessage = lastMessage;
				this.lastElement = lastElement;
				this.numberOfMessageGroup = messageGroups.length;
			}
		}

		private scrollMessage(message: Element | undefined, isMessageGroup?: boolean): void {
			if (!message) {
				return;
			}

			const checkedClass = `${isMessageGroup ? MESSAGE_GROUP_BASE_CLASS : MESSAGE_BASE_CLASS}--right`;
			const rightPosition = message.classList.contains(checkedClass);

			if (rightPosition) {
				const params = this.scrollbarAtBottom ? { duration: undefined, useAnimation: false } : {};
				this.scrollToBottom(params.duration, params.useAnimation);
			} else if (this.scrollbarAtBottom) {
				this.scrollTo(message, undefined, false);
			}
		}

		private handleOnInnerContainerScroll(event: UIEvent<HTMLElement>): void {
			const isScrollbarAtBottom = this.isScrollbarAtBottom();

			if (this.props.onScroll) {
				this.props.onScroll(event, isScrollbarAtBottom, this.isAutomaticallyScrolling);
			}

			if (this.scrollEndTimeoutId) {
				clearTimeout(this.scrollEndTimeoutId);
			} else {
				this.props.onScrollStart?.(event);
			}

			this.scrollEndTimeoutId = window.setTimeout(() => {
				this.props.onScrollEnd?.(event);
				this.scrollbarAtBottomBeforeResize = this.isScrollbarAtBottom();
				this.scrollEndTimeoutId = null;
				this.isAutomaticallyScrolling = false;
			}, this.props.scrollEndDetectingTime);
		}

		private renderFixedToBottomNotifications(): ReactNode[] {
			return Children.toArray(this.props.children)
				.map((child) => {
					return this.isFixedToBottomNotification(child) && child;
				})
				.filter(Boolean);
		}

		private renderInnerChildren(): ReactNode {
			return Children.toArray(this.props.children)
				.map((child) => {
					return !this.isFixedToBottomNotification(child) && child;
				})
				.filter(Boolean);
		}

		private isFixedToBottomNotification(element: ReactNode): boolean {
			return (
				isValidElement(element) &&
				element.type === Notification &&
				!!(element.props as ChatProps.NotificationProps).fixedToBottom
			);
		}

		private onResize(): void {
			if (this.scrollbarAtBottomBeforeResize) {
				this.scrollToBottom(undefined, false);
			}
		}

		public isScrollbarAtBottom(): boolean {
			if (!this.innerContainerRef) {
				return false;
			}

			return (
				Math.ceil(this.innerContainerRef.scrollTop + this.innerContainerRef.offsetHeight + SCROLL_OFFSET) >=
				this.innerContainerRef.scrollHeight
			);
		}

		public scrollTo(
			element: Element,
			duration?: number | ((scrollDistanceInPx: number) => number),
			useAnimation = true
		): void {
			if (!this.innerContainerRef) {
				return;
			}

			if (!useAnimation) {
				this.isAutomaticallyScrolling = true;

				const container = this.innerContainerRef;
				const containerTop = container.getBoundingClientRect().top;
				const elementTop = element.getBoundingClientRect().top;

				container.scrollTop += elementTop - containerTop;

				return;
			}

			setTimeout(() => (this.isAutomaticallyScrolling = true));

			let calculatedDuration = 0;
			const durationConfig = (scrollDistanceInPx: number) => {
				calculatedDuration =
					typeof duration === "function" ? duration(scrollDistanceInPx) : duration || SCROLL_DURATION;

				return calculatedDuration;
			};

			element.setAttribute("name", "scrollElement");
			scroller.scrollTo("scrollElement", {
				...this.scrollOptions,
				duration: durationConfig
			});
			element.removeAttribute("name");

			this.setState({ isScrollingEnd: false });
			setTimeout(() => this.setState({ isScrollingEnd: true }), calculatedDuration);
		}

		public scrollToBottom(duration: number = SCROLL_DURATION, useAnimation = true): void {
			if (!this.innerContainerRef) {
				return;
			}

			if (!useAnimation) {
				this.isAutomaticallyScrolling = true;
				this.innerContainerRef.scrollTop = this.innerContainerRef.scrollHeight;

				return;
			}

			setTimeout(() => (this.isAutomaticallyScrolling = true));

			animateScroll.scrollToBottom({
				...this.scrollOptions,
				duration: duration
			});

			this.setState({ isScrollingEnd: false });
			setTimeout(() => this.setState({ isScrollingEnd: true }), SCROLL_DURATION);
		}

		componentDidMount(): void {
			window.addEventListener("load", this.pageLoadListener);
			this.scrollIntoView();
		}

		getSnapshotBeforeUpdate(prevProps: Readonly<ChatProps.ContainerProps>, prevState: Readonly<ContainerState>): null {
			if (prevProps.children !== this.props.children && prevState.isScrollingEnd) {
				this.scrollbarAtBottom = this.isScrollbarAtBottom();
			}

			return null;
		}

		componentDidUpdate(): void {
			this.scrollIntoView();
		}

		componentWillUnmount(): void {
			window.removeEventListener("load", this.pageLoadListener);
			Events.scrollEvent.remove("end");
		}

		render(): ReactNode {
			const { style, className, id } = this.props;
			const classNames = joinClassNames(`${baseClassName}-container`, className);

			const fixedToBottomNotifications = this.renderFixedToBottomNotifications();
			let scrollWidth = 0;

			if (this.innerContainerRef) {
				scrollWidth =
					this.innerContainerRef.offsetWidth - this.innerContainerRef.clientWidth - this.innerContainerRef.clientLeft;
			}

			return (
				<WidgetsResizeDetector handleWidth={false} onResize={this.onResize} targetRef={this.wrapperRef}>
					<StyledContainerWrapper
						id={id}
						style={style}
						className={classNames}
						aria-live="polite"
						role="log"
						data-role={DataRoles.Chat}
						ref={this.wrapperRef}
					>
						<StyledContainerInner
							className={`${baseClassName}-container__inner`}
							ref={this.getInnerContainerRef}
							id={this.innerContainerId}
							onScroll={this.handleOnInnerContainerScroll}
						>
							{this.renderInnerChildren()}
						</StyledContainerInner>
						{fixedToBottomNotifications?.length > 0 && (
							<StyledBottomNotificationWrapper scrollWidth={scrollWidth}>
								{fixedToBottomNotifications}
							</StyledBottomNotificationWrapper>
						)}
					</StyledContainerWrapper>
				</WidgetsResizeDetector>
			);
		}
	}

	export function Message({
		children,
		className,
		id,
		position = "left",
		status,
		style,
		wrapperRef
	}: ChatProps.MessageProps): ReactElement<ChatProps.MessageProps> {
		const { chatTitles } = useContext<A11yDefinition>(A11YLanguageContext);
		const userName = useContext(UserNameContext);
		const msgClasses = joinClassNames(
			MESSAGE_BASE_CLASS,
			{ [`${MESSAGE_BASE_CLASS}--${position}`]: position },
			className
		);

		const chatMessageTitle = position === "right" ? chatTitles?.chatMessage : undefined;
		const ariaLabel = userName ? `${userName} ${chatTitles?.chatMessageSaid}` : chatTitles?.chatMessageYouSaid;

		return (
			<StyledMessageWrapper
				id={id}
				style={style}
				className={msgClasses}
				ref={wrapperRef}
				data-role={DataRoles.Chat.Message}
			>
				{chatMessageTitle && <HiddenText>{chatMessageTitle}</HiddenText>}
				<StyledMessageContainer position={position} className={`${MESSAGE_BASE_CLASS}__container`}>
					<StyledMessageBubble position={position} className={`${MESSAGE_BASE_CLASS}__bubble`}>
						<StyledMessageContent
							className={`${MESSAGE_BASE_CLASS}__content`}
							data-role={DataRoles.Chat.Message.Content}
							role="region"
							aria-label={ariaLabel}
						>
							{children}
						</StyledMessageContent>
						{status && (
							<StyledMessageStatus
								className={`${MESSAGE_BASE_CLASS}__status`}
								data-role={DataRoles.Chat.Message.Status}
							>
								{status}
							</StyledMessageStatus>
						)}
					</StyledMessageBubble>
				</StyledMessageContainer>
			</StyledMessageWrapper>
		);
	}

	export function SecondaryContent(
		props: ChatProps.SecondaryContentProps
	): ReactElement<ChatProps.SecondaryContentProps> {
		const { children, wrapperRef, className, ...rest } = props;

		return (
			<StyledSecondaryContent
				ref={wrapperRef}
				className={joinClassNames(`${MESSAGE_BASE_CLASS}__secondary-content`, className)}
				{...rest}
			>
				{children}
			</StyledSecondaryContent>
		);
	}

	export function UserInfo({
		className,
		id,
		position = "left",
		style,
		userAvatar = <Icon>account_circle</Icon>,
		userName
	}: ChatProps.UserInfo): ReactElement<ChatProps.UserInfo> {
		const baseUserClassName = `${baseClassName}-user`;
		const classNames = joinClassNames(
			baseUserClassName,
			{ [`${baseUserClassName}--${position}`]: position },
			className
		);

		return (
			<StyledUserInfo
				position={position}
				className={classNames}
				id={id}
				style={style}
				data-role={DataRoles.Chat.User.Info}
			>
				<StyledAvatarWrapper
					position={position}
					className={`${baseUserClassName}__avatar`}
					data-role={DataRoles.Chat.User.Avatar}
				>
					{userAvatar}
				</StyledAvatarWrapper>
				<StyledUserName
					position={position}
					className={`${baseUserClassName}__name`}
					data-role={DataRoles.Chat.User.Name}
				>
					{userName}
				</StyledUserName>
			</StyledUserInfo>
		);
	}

	export function Avatar(props: ChatProps.AvatarProps): ReactElement<ChatProps.AvatarProps> {
		const { id, style, imageUrl, className, alt } = props;

		return (
			<StyledAvatarImage
				id={id}
				src={imageUrl}
				style={style}
				alt={alt}
				className={joinClassNames(`${baseClassName}-user__avatar-image`, className)}
				data-role={DataRoles.Chat.AvatarImg}
			/>
		);
	}

	export function DateMarker(props: ChatProps.DateMarkerProps): ReactElement<ChatProps.DateMarkerProps> {
		const { id, style, children, className } = props;
		const baseDateClassName = `${baseClassName}-date`;

		return (
			<StyledDateMarker
				id={id}
				style={style}
				className={joinClassNames(baseDateClassName, className)}
				data-role={DataRoles.Chat.DateMarker}
			>
				<StyledDateContent className={`${baseDateClassName}__content`}>{children}</StyledDateContent>
			</StyledDateMarker>
		);
	}

	export function Notification({
		children,
		className,
		fixedToBottom,
		id,
		onClick,
		onKeyDown,
		show = true,
		style,
		variant = "info"
	}: ChatProps.NotificationProps): ReactElement<ChatProps.NotificationProps> {
		const nodeRef = useRef<HTMLDivElement>(null);
		const baseNotificationClassName = `${baseClassName}-notification`;

		const classNames = joinClassNames(
			baseNotificationClassName,
			{ [`${baseClassName}-notification--${variant}`]: variant },
			{ [`${baseNotificationClassName}--fixed-to-bottom`]: fixedToBottom },
			className
		);

		return (
			<StyledNotificationContainer
				variant={variant}
				fixedToBottom={fixedToBottom}
				className={classNames}
				id={id}
				style={style}
				data-role={DataRoles.Chat.Notification}
			>
				<StyledNotificationWrapper
					show={show}
					className={joinClassNames(`${baseNotificationClassName}-wrapper`, {
						[`${baseNotificationClassName}-wrapper--clickable`]: onClick
					})}
					onClick={onClick}
					onKeyDown={onKeyDown}
					aria-live="polite"
					ref={nodeRef}
				>
					<StyledNotificationContent
						className={`${baseNotificationClassName}-content`}
						role={fixedToBottom ? "alert" : "log"}
						$variant={variant}
					>
						{children}
					</StyledNotificationContent>
				</StyledNotificationWrapper>
			</StyledNotificationContainer>
		);
	}

	export function TypingMarker(props: ChatProps.TypingMarkerProps): ReactElement<ChatProps.TypingMarkerProps> {
		const { id, style, children, className } = props;

		return (
			<StyledTypingMaker
				id={id}
				style={style}
				className={joinClassNames(`${baseClassName}-typing`, className)}
				data-role={DataRoles.Chat.TypingMarker}
			>
				{children}
			</StyledTypingMaker>
		);
	}

	export function MessageGroup({
		children,
		className,
		id,
		position = "left",
		style,
		userInfo
	}: ChatProps.MessageGroupProps): ReactElement<ChatProps.MessageGroupProps> {
		const { chatTitles } = useContext<A11yDefinition>(A11YLanguageContext);
		const classNames = joinClassNames(
			MESSAGE_GROUP_BASE_CLASS,
			{ [`${MESSAGE_GROUP_BASE_CLASS}--${position}`]: position === "right" },
			className
		);

		const chatMessageTitle = position === "right" ? chatTitles?.chatMessage : undefined;

		// Extract userName from UserInfo component
		const userName =
			isValidElement<ChatProps.UserInfo>(userInfo) && userInfo.type === UserInfo ? userInfo.props.userName : undefined;

		return (
			<StyledMessageGroup
				position={position}
				className={classNames}
				id={id}
				style={style}
				data-role={DataRoles.Chat.Message.Group}
			>
				{userInfo}
				{chatMessageTitle && <HiddenText>{chatMessageTitle}</HiddenText>}
				<UserNameContext.Provider value={typeof userName === "string" ? userName : undefined}>
					{children}
				</UserNameContext.Provider>
			</StyledMessageGroup>
		);
	}
}
