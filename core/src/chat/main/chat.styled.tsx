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

import { styled, css } from "styled-components";

import { StyledIconWrapper } from "../../icon/main/icon.view.js";
import {
	StyledLoadingInnerOverlay,
	StyledLoadingLabel,
	StyledLoadingOuterOverlay
} from "../../progress-indicator/main/progress-indicator.styled.js";

import type { ChatProps } from "./chat.api.js";

export const StyledMessageWrapper = styled.div.withConfig({ displayName: "StyledMessageWrapper-sc-" })(({ theme }) => {
	const {
		message: { wrapper },
		userInfo
	} = theme.components.chat;

	return css`
		&:not(:first-child) {
			padding: ${wrapper.padding};
		}
		& + ${StyledUserInfo} {
			padding-top: ${userInfo.paddingTop};
		}

		&:last-child {
			padding-bottom: ${wrapper.lastChildPaddingBottom};
		}

		${StyledDateMarker} + & {
			padding-top: 0;
		}
	`;
});

export const StyledMessageGroup = styled.div.withConfig({ displayName: "StyledMessageGroup-sc-" })<{
	position?: "left" | "right";
}>(({ theme, position = "left" }) => {
	const { message, messageGroup } = theme.components.chat;

	return css`
		position: relative;
		padding: ${messageGroup.padding};
		&:first-child {
			padding-top: 0;
		}

		${StyledMessageWrapper}:last-child {
			padding-bottom: 0;
		}

		&:last-child {
			padding: ${messageGroup.lastChildPadding};
		}

		${StyledMessageWrapper} ${StyledMessageBubble} {
			background-color: ${message.background[position]};
			border-color: ${message.borderColor[position]};
			${position === "left"
				? css`
						margin-left: ${message.bubble.horizontalMargin};
					`
				: css`
						margin-right: ${message.bubble.horizontalMargin};
					`}
		}

		${position === "right" &&
		css`
			${StyledMessageWrapper} ${StyledMessageContainer} {
				justify-content: flex-end;
			}
		`}

		${position === "left"
			? css`
					${StyledMessageWrapper} {
						padding-right: 5%;
					}
					${StyledMessageWrapper}:not(${StyledMessageWrapper} ~ ${StyledMessageWrapper}) {
						${createLeftArrow}
					}
				`
			: css`
					${StyledMessageWrapper} {
						padding-left: 5%;
					}
					${StyledMessageWrapper}:not(${StyledMessageWrapper} ~ ${StyledMessageWrapper}) {
						${createRightArrow}
					}
				`}

			${StyledDateMarker}	+ & {
			padding-top: 0;
		}
	`;
});

export const StyledTypingMaker = styled.div.withConfig({ displayName: "StyledTypingMaker-sc-" })(({ theme }) => {
	const { typing } = theme.components.chat;

	return css`
		padding: ${typing.padding};
		${StyledLoadingOuterOverlay},
		${StyledLoadingInnerOverlay} {
			position: static;
		}
		${StyledLoadingOuterOverlay} {
			margin: 0 auto;
			width: ${typing.width};
		}
		${StyledLoadingInnerOverlay} {
			transform: translate(0, 0);
			padding: 0;
		}
		${StyledLoadingLabel} {
			margin-top: 0;
			margin-bottom: 0;
		}
	`;
});

export const StyledNotificationContent = styled.div.withConfig({ displayName: "StyledNotificationContent-sc-" })<{
	$variant: ChatProps.NotificationVariant;
}>(({ theme, $variant }) => {
	const { content } = theme.components.chat.notification;

	return css`
		align-items: center;
		background-color: ${content.background};
		border-radius: ${content.borderRadius};
		color: ${content.color ?? content.variant.text[$variant]};
		display: flex;
		flex-shrink: 1;
		font-family: ${content.fontFamily};
		font-size: ${content.fontSize};
		line-height: normal;
		padding: ${content.padding};
		text-align: center;

		& > *:first-child {
			flex-shrink: 1;
		}

		${StyledIconWrapper} {
			color: inherit;
			font-size: ${content.icon?.fontSize ?? "inherit"};
			margin: ${content.icon.margin};
		}
	`;
});

export const StyledNotificationWrapper = styled.div.withConfig({ displayName: "StyledNotificationWrapper-sc-" })<{
	show?: boolean;
}>(({ show, onClick }) => {
	return css`
		cursor: default;
		display: flex;
		transition:
			visibility 0.4s,
			opacity 0.4s linear;
		${!!onClick &&
		css`
			cursor: pointer;
		`}
		${show
			? css`
					visibility: visible;
					opacity: 1;
				`
			: css`
					visibility: hidden;
					opacity: 0;
				`}
	`;
});

export const StyledDateMarker = styled.div.withConfig({ displayName: "StyledDateMarker-sc-" })(({ theme }) => {
	const { date } = theme.components.chat;

	return css`
		display: flex;
		justify-content: center;
		padding: ${date.marker.padding};

		&:first-child {
			& > ${StyledDateContent} {
				margin-top: 0;
			}
		}
	`;
});

export const StyledDateContent = styled.div.withConfig({ displayName: "StyledDateContent-sc-" })(({ theme }) => {
	const { content } = theme.components.chat.date;

	return css`
		background-color: ${content.background};
		border-radius: ${content.borderRadius};
		color: ${content.color};
		cursor: default;
		font-family: ${content.fontFamily};
		font-size: ${content.fontSize};
		line-height: normal;
		margin: ${content.margin};
		padding: ${content.padding};
	`;
});

export const StyledAvatarImage = styled.img.withConfig({ displayName: "StyledAvatarImage-sc-" })(({ theme }) => {
	const { image } = theme.components.chat.userInfo.avatar;

	return css`
		border-radius: ${image.borderRadius};
		height: ${image.size};
		width: ${image.size};
	`;
});

export const StyledAvatarWrapper = styled.div.withConfig({ displayName: "StyledAvatarWrapper-sc-" })<{
	position?: ChatProps.MessagePosition;
}>(({ theme, position = "left" }) => {
	const { spacing } = theme.components.chat.userInfo.avatar.wrapper;

	return css`
		display: flex;
		${position === "left"
			? css`
					margin-right: ${spacing};
				`
			: css`
					margin-left: ${spacing};
				`}
	`;
});

export const StyledUserName = styled.div.withConfig({ displayName: "StyledUserName-sc-" })<{
	position?: "left" | "right";
}>(({ theme, position = "left" }) => {
	const { name } = theme.components.chat.userInfo;

	return css`
		align-self: center;
		flex-grow: 1;
		flex-shrink: 1;
		font-family: ${name.fontFamily};
		font-size: ${name.fontSize};
		font-weight: ${name.fontWeight};
		line-height: ${name.lineHeight};
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		${position === "right" &&
		css`
			text-align: right;
		`}
	`;
});

export const StyledUserInfo = styled.div.withConfig({ displayName: "StyledUserInfo-sc-" })<{
	position?: "left" | "right";
}>(({ position = "left" }) => {
	return css`
		display: flex;
		width: 100%;
		${position === "right" &&
		css`
			flex-direction: row-reverse;
		`}
	`;
});

export const StyledSecondaryContent = styled.div.withConfig({ displayName: "StyledSecondaryContent-sc-" })(
	({ theme }) => {
		const { secondaryContent } = theme.components.chat;

		return css`
			color: ${secondaryContent.color};
			font-family: ${secondaryContent.fontFamily};
			font-size: ${secondaryContent.fontSize};
			font-style: ${secondaryContent.fontStyle};
			margin: ${secondaryContent.margin};
		`;
	}
);

export const StyledMessageContent = styled.div.withConfig({ displayName: "StyledMessageContent-sc-" })(({ theme }) => {
	const { content } = theme.components.chat.message;

	return css`
		font-family: ${content.fontFamily};
		font-size: ${content.fontSize};
		font-weight: ${content.fontWeight};
		line-height: ${content.lineHeight};
		overflow-wrap: break-word;
		white-space: pre-wrap;
	`;
});

export const StyledMessageStatus = styled.div.withConfig({ displayName: "StyledMessageStatus-sc-" })(({ theme }) => {
	const { status } = theme.components.chat.message;

	return css`
		color: ${status.color};
		font-family: ${status.fontFamily};
		font-size: ${status.fontSize};
		font-weight: ${status.fontWeight};
		line-height: ${status.lineHeight};
		padding-left: ${status.paddingLeft};
		text-align: right;
	`;
});

export const StyledMessageBubble = styled.div.withConfig({ displayName: "StyledMessageBubble-sc-" })<{
	position?: "left" | "right";
}>(({ theme, position = "left" }) => {
	const { message } = theme.components.chat;

	return css`
		background-color: ${message.background[position]};
		border-color: ${message.borderColor[position]};
		border-radius: ${message.bubble.borderRadius};
		border-style: solid;
		border-width: 1px;
		max-width: 100%;
		min-height: ${message.bubble.minHeight};
		padding: ${message.bubble.padding};
		position: relative;

		// Arrow
		&:before {
			border-color: transparent;
			border-style: solid;
			border-width: 1px;
			content: "";
			height: 5px;
			position: absolute;
			pointer-events: none;
			top: -1px;
			width: 6px;
		}

		${position === "left"
			? css`
					margin-left: ${message.bubble.horizontalMargin};
				`
			: css`
					margin-right: ${message.bubble.horizontalMargin};
				`}
	`;
});

const createLeftArrow = css`
	${StyledMessageBubble} {
		border-top-left-radius: 0;
		&:before {
			background-color: ${({ theme }) => theme.components.chat.message.background.left};
			border-bottom: 0;
			border-left-color: ${({ theme }) => theme.components.chat.message.borderColor.left};
			border-right: 0;
			border-top-color: ${({ theme }) => theme.components.chat.message.borderColor.left};
			left: -4px;
			transform: rotate(0deg) skew(50deg, 0deg);
		}
	}
`;
const createRightArrow = css`
	${StyledMessageBubble} {
		border-top-left-radius: ${({ theme }) => theme.components.chat.message.bubble.borderRadius};
		border-top-right-radius: 0;
		&:before {
			background-color: ${({ theme }) => theme.components.chat.message.background.right};
			border-bottom: 0;
			border-left: 0;
			border-right: 1px solid ${({ theme }) => theme.components.chat.message.borderColor.right};
			border-top-color: ${({ theme }) => theme.components.chat.message.borderColor.right};
			left: unset;
			right: -4px;
			transform: rotate(0deg) skew(-50deg, 0deg);
		}
	}
`;

export const StyledMessageContainer = styled.div.withConfig({ displayName: "StyledMessageContainer-sc-" })<{
	position?: "left" | "right";
}>(({ position = "left" }) => {
	return css`
		display: flex;
		flex-wrap: wrap;

		${position === "right" &&
		css`
			justify-content: flex-end;
		`}
	`;
});

export const StyledContainerInner = styled.div.withConfig({ displayName: "StyledContainerInner-sc-" })(({ theme }) => {
	const { inner } = theme.components.chat.container;

	return css`
		box-sizing: border-box;
		height: 100%;
		overflow: auto;
		position: relative;
		padding: ${inner.padding};
	`;
});

export const StyledBottomNotificationWrapper = styled.div.withConfig({
	displayName: "StyledBottomNotificationWrapper-sc-"
})<{ scrollWidth: number }>(({ scrollWidth }) => {
	return css`
		margin-right: ${scrollWidth};
		box-sizing: border-box;
	`;
});

export const StyledContainerWrapper = styled.div.withConfig({ displayName: "StyledContainerWrapper-sc-" })(
	({ theme }) => {
		const { color, fontFamily, fontSize } = theme.applicationStyles;

		return css`
			color: ${color};
			font-family: ${fontFamily};
			font-size: ${fontSize};
			height: 100%;
			line-height: 1.45;
			position: relative;
			overflow: hidden;
		`;
	}
);

export const StyledNotificationContainer = styled.div.withConfig({ displayName: "StyledNotificationContainer-sc-" })<{
	fixedToBottom?: boolean;
	variant: ChatProps.NotificationVariant;
}>(({ theme, fixedToBottom, variant }) => {
	const { notification } = theme.components.chat;

	return css`
		display: flex;
		justify-content: center;
		margin: ${notification.margin};
		width: ${notification.width};

		${fixedToBottom &&
		css`
			bottom: 0;
			position: absolute;
			left: 50%;
			margin: ${notification.fixedToBottom.margin};
			transform: translateX(-50%);
			width: ${notification.fixedToBottom.width};
		`}

		${variant !== "info" &&
		css`
			${StyledNotificationContent} {
				background-color: ${notification.background[variant]};
			}
		`}

			& + ${StyledMessageWrapper}, & + ${StyledMessageGroup} {
			padding-top: 0;
		}
	`;
});
