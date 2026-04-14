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

import { StyledIconWrapper } from "../icon/main/icon.view.js";
import { ButtonGroup } from "../button-group/main/button-group.view.js";
import { StyledTextAreaInputWrapper } from "../input/text-area/main/template/text-area.tpl.styled.js";

export const StyledCommentListWrapper = styled.ul.withConfig({ displayName: "StyledCommentListWrapper-sc-" })(
	({ theme }) => {
		const commentList = theme.components.commentList;

		return css`
			background-color: ${commentList.background};
			margin: 0;
			min-height: ${commentList.minHeight};
			overflow-x: hidden;
			overflow-y: auto;
			padding: 0;
		`;
	}
);

export const StyledCommentListItem = styled.li.withConfig({ displayName: "StyledCommentListItem-sc-" })(({ theme }) => {
	const commentList = theme.components.commentList;

	return css`
		list-style-type: none;
		position: relative;

		&:not(:last-child):after {
			border-bottom: ${commentList.children.borderBottom};
			bottom: ${commentList.children.bottom};
			content: "";
			left: ${commentList.children.left};
			position: absolute;
			right: ${commentList.children.right};
		}
	`;
});

export const StyledReplyItemAction = styled.div.withConfig({ displayName: "StyledReplyItemAction-sc-" })(
	({ theme }) => {
		const { actions } = theme.components.comment;

		return css`
			background-color: ${actions.replies.item.background};
			padding: ${actions.replies.item.padding};
			text-align: center;
			position: relative;

			&:before {
				top: 0;
			}

			&:after {
				bottom: 0;
			}

			&:before,
			&:after {
				content: "";
				border-bottom: ${actions.replies.item.borderBottom};
				display: block;
				left: 0;
				position: absolute;
				width: 100%;
			}
		`;
	}
);

export const StyledNewCommentMeta = styled.div.withConfig({ displayName: "StyledNewCommentMeta-sc-" })(({ theme }) => {
	const { meta } = theme.components.comment;

	return css`
		color: ${meta.newComment.color};
		cursor: default;
		display: inline-block;
		font-family: ${meta.newComment.fontFamily};
		font-size: ${meta.newComment.fontSize};
		font-weight: ${meta.newComment.fontWeight};
		line-height: 1rem;
		position: relative;

		& > *:last-child {
			margin-right: 0;
		}
	`;
});

export const StyledCommentMetaAvatar = styled.div.withConfig({ displayName: "StyledCommentMetaAvatar-sc-" })<{
	inactive?: boolean;
}>(({ theme }) => {
	const { avatar } = theme.components.comment.meta.newComment;

	return css`
		display: inline-flex;
		font-size: ${avatar.fontSize};
		height: ${avatar.size};
		left: ${avatar.left};
		position: absolute;
		width: ${avatar.size};
	`;
});

export const StyledCommentMetaAuthor = styled.div.withConfig({ displayName: "StyledCommentMetaAuthor-sc-" })(
	({ theme }) => {
		const { author } = theme.components.comment.meta.newComment;

		return css`
			display: inline;
			font-weight: ${author.fontWeight};
			margin: ${author.margin};
		`;
	}
);

export const StyledNewCommentMetaContainer = styled.div.withConfig({
	displayName: "StyledNewCommentMetaContainer-sc-"
})(({ theme }) => {
	const { meta } = theme.components.comment;

	return css`
		margin: ${meta.newComment.containerMargin};
	`;
});

export const StyledNewCommentContent = styled.div.withConfig({ displayName: "StyledNewCommentContent-sc-" })(
	({ theme }) => {
		const { content } = theme.components.comment;

		return css`
			margin: ${content.newCommentMargin};
		`;
	}
);

export const StyledNewCommentActions = styled.div.withConfig({ displayName: "StyledNewCommentActions-sc-" })``;

export const StyledNewCommentWrapper = styled.div.withConfig({ displayName: "StyledNewCommentWrapper-sc-" })<{
	isReply?: boolean;
}>(({ theme, isReply }) => {
	const { newComment, replyComment, actions, content } = theme.components.comment;

	return css`
		box-sizing: border-box;
		background-color: ${newComment.background};
		border: none;
		overflow-x: hidden;
		overflow-y: auto;
		width: 100%;

		${isReply &&
		css`
			background-color: ${replyComment.background};
			padding: ${replyComment.padding};

			${StyledCommentActionsCombine} {
				margin: ${actions.replyCommentMargin};
			}

			${StyledCommentContent} {
				padding: ${content.replyCommentPadding};
			}

			${StyledTextAreaInputWrapper} {
				background-color: ${replyComment.inputBG};
			}
		`}
	`;
});

export const StyledCommentWrapper = styled.div.withConfig({ displayName: "StyledCommentWrapper-sc-" })<{
	isReply?: boolean;
	inactive?: boolean;
}>(({ theme, inactive, isReply }) => {
	const comment = theme.components.comment;

	return css`
		display: flex;
		flex-direction: column;
		padding: ${comment.padding};
		overflow-x: auto;
		text-size-adjust: none;

		${isReply &&
		css`
			background-color: ${comment.replyComment.background};
			padding: ${comment.replyComment.padding};

			${StyledTextAreaInputWrapper} {
				background-color: ${comment.replyComment.inputBG};
			}
		`}

		${inactive &&
		css`
			${StyledCommentMeta} {
				&:first-child {
					margin: ${comment.meta.inactive.margin};
				}

				&:only-child {
					margin: 0;
				}
			}

			${StyledCommentMetaAvatar} ${StyledIconWrapper} {
				color: ${comment.meta.inactive.avatarColor};
			}

			${StyledCommentMetaAuthor},
			${StyledCommentMetaAction},
            	${StyledCommentMetaDate} {
				color: ${comment.meta.inactive.color};
			}
		`}
	`;
});

export const StyledCommentMeta = styled(StyledNewCommentMeta).withConfig({ displayName: "StyledCommentMeta-sc-" })<{
	inactive?: boolean;
}>(({ theme, inactive }) => {
	const comment = theme.components.comment;

	return (
		inactive &&
		css`
			display: inline;
			margin: ${comment.meta.inactive.destructive.margin};

			${StyledCommentMetaAuthor},
			${StyledCommentMetaAction},
          	${StyledCommentMetaDate} {
				color: ${comment.meta.inactive.destructive.color};
			}
		`
	);
});

export const StyledCommentMetaContainer = styled.div.withConfig({ displayName: "StyledCommentMetaContainer-sc-" })(
	({ theme }) => {
		const comment = theme.components.comment;

		return css`
			align-items: center;
			display: flex;
			margin: ${comment.meta.containerMargin};
		`;
	}
);

export const StyledCommentMetaGroup = styled.div.withConfig({ displayName: "StyledCommentMetaGroup-sc-" })`
	flex-grow: 1;
`;

export const StyledCommentActionsCombine = styled.div.withConfig({ displayName: "StyledCommentActionsCombine-sc-" })<{
	isReply?: boolean;
}>(({ theme, isReply }) => {
	const comment = theme.components.comment;

	return css`
		display: flex;
		margin: ${isReply ? comment.actions.replyCommentMargin : comment.actions.margin};
	`;
});

export const StyledCommentMetaAction = styled.div.withConfig({ displayName: "StyledCommentMetaAction-sc-" })(
	({ theme }) => {
		const comment = theme.components.comment;

		return css`
			color: ${comment.meta.action.color};
			display: inline-block;
			margin: ${comment.meta.action.margin};
		`;
	}
);

export const StyledCommentMetaDate = styled.div.withConfig({ displayName: "StyledCommentMetaDate-sc-" })(
	({ theme }) => {
		const comment = theme.components.comment;

		return css`
			color: ${comment.meta.dateColor};
			display: inline-block;
		`;
	}
);

export const StyledCommentContent = styled.div.withConfig({ displayName: "StyledCommentContent-sc-" })<{
	isReply?: boolean;
}>(({ theme, isReply }) => {
	const comment = theme.components.comment;

	return css`
		font-family: ${comment.content.fontFamily};
		font-size: ${comment.content.fontSize};
		font-weight: ${comment.content.fontWeight};
		overflow-x: auto;
		padding: ${isReply ? comment.content.replyCommentPadding : comment.content.padding};

		& > *:not(:last-child) {
			margin: ${comment.content.childrenMargin};
		}
	`;
});

export const StyledCommentText = styled.div.withConfig({ displayName: "StyledCommentText-sc-" })<{
	minimised?: boolean;
	inactive?: boolean;
}>(({ theme, minimised, inactive }) => {
	const comment = theme.components.comment;

	return css`
		color: ${inactive ? comment.meta.inactive.color : comment.text.color};
		white-space: pre-wrap;

		${minimised &&
		css`
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		`}
	`;
});

export const StyledCommentReplies = styled.div.withConfig({ displayName: "StyledCommentReplies-sc-" })(({ theme }) => {
	const comment = theme.components.comment;

	return css`
		margin: ${comment.replies.margin};

		&:empty {
			margin: 0;
		}

		${StyledNewCommentContent} {
			margin: ${comment.content.replyNewCommentMargin};
		}

		${StyledNewCommentActions} {
			margin: ${comment.actions.newCommentMargin};
		}
	`;
});

export const StyledCommentRepliesActions = styled(ButtonGroup).withConfig({
	displayName: "StyledCommentRepliesActions-sc-"
})<{ isReply?: boolean }>(({ theme, isReply }) => {
	const comment = theme.components.comment;

	return (
		isReply &&
		css`
			margin: ${comment.replies.actionMargin};
		`
	);
});

export const StyledCommentActions = styled.div.withConfig({ displayName: "StyledCommentActions-sc-" })(({ theme }) => {
	const comment = theme.components.comment;

	return css`
		height: fit-content;
		margin: ${comment.actions.margin};
	`;
});
