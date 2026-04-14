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

import type { ReactNode, ReactElement } from "react";
import { Component } from "react";

import { Button } from "../../../button/main/button.view.js";
import { ButtonGroup } from "../../../button-group/main/button-group.view.js";
import { bindMethods, addPrefix, joinClassNames } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import {
	StyledCommentMeta,
	StyledCommentMetaAvatar,
	StyledCommentMetaAuthor,
	StyledCommentMetaAction,
	StyledCommentMetaDate,
	StyledCommentWrapper,
	StyledCommentMetaContainer,
	StyledCommentMetaGroup,
	StyledCommentActionsCombine,
	StyledCommentContent,
	StyledCommentText,
	StyledCommentReplies,
	StyledCommentRepliesActions,
	StyledCommentActions
} from "../../comment.styled.js";

import type { CommentMeta, CommentProps } from "./comment.api.js";

const baseClassName = addPrefix("comment");

export interface CommentState {
	minimised: boolean;
}

export class Comment extends Component<CommentProps, CommentState> {
	static displayName = "Comment";
	constructor(props: CommentProps) {
		super(props);
		this.state = {
			minimised: true
		};
		bindMethods(this);
	}

	private toggleMinimisedState(): void {
		this.setState((prevState) => {
			return { minimised: !prevState.minimised };
		});
	}

	private renderCommentMeta(commentMeta: CommentMeta, inactive?: boolean): ReactNode {
		const baseMetaClassName = `${baseClassName}__meta`;
		const classNames = joinClassNames(baseMetaClassName, { [`${baseMetaClassName}--destructive`]: inactive });

		return (
			<StyledCommentMeta inactive={inactive} className={classNames} data-role={DataRoles.Comment.Meta}>
				{commentMeta.avatar && (
					<StyledCommentMetaAvatar inactive={inactive} className={`${baseMetaClassName}-avatar`}>
						{commentMeta.avatar}
					</StyledCommentMetaAvatar>
				)}
				{commentMeta.author && (
					<StyledCommentMetaAuthor className={`${baseMetaClassName}-author`}>
						{commentMeta.author}
					</StyledCommentMetaAuthor>
				)}
				{commentMeta.action && (
					<StyledCommentMetaAction className={`${baseMetaClassName}-action`}>
						{commentMeta.action}
					</StyledCommentMetaAction>
				)}
				{commentMeta.date && (
					<StyledCommentMetaDate className={`${baseMetaClassName}-date`}>{commentMeta.date}</StyledCommentMetaDate>
				)}
			</StyledCommentMeta>
		);
	}

	private renderCommentMetaInfo(): ReactNode {
		const { commentMeta, inactiveCommentMeta } = this.props;

		return (
			<>
				{isCommentMeta(commentMeta) ? this.renderCommentMeta(commentMeta) : commentMeta}
				{inactiveCommentMeta && isCommentMeta(inactiveCommentMeta)
					? this.renderCommentMeta(inactiveCommentMeta, true)
					: inactiveCommentMeta}
			</>
		);
	}

	render(): ReactElement<CommentProps> {
		const {
			id,
			style,
			children,
			commentTags,
			actionButtons,
			actionButtonPosition,
			inactive,
			showAllText,
			minimiseText,
			isReply,
			replies,
			combinedActionButton
		} = this.props;
		const { minimised } = this.state;

		const classNames = joinClassNames(
			baseClassName,
			{ [`${baseClassName}__replies-item`]: isReply },
			{ [`${baseClassName}--inactive`]: inactive },
			{ [`${baseClassName}--minimised`]: inactive && minimised },
			this.props.className
		);

		return (
			<StyledCommentWrapper
				isReply={isReply}
				inactive={inactive}
				className={classNames}
				id={id}
				style={style}
				data-role={DataRoles.Comment}
			>
				<StyledCommentMetaContainer className={`${baseClassName}__meta-container`}>
					{combinedActionButton ? (
						<StyledCommentMetaGroup className={`${baseClassName}__meta-group`} data-role={DataRoles.Comment.MetaGroup}>
							{this.renderCommentMetaInfo()}
						</StyledCommentMetaGroup>
					) : (
						this.renderCommentMetaInfo()
					)}
					{combinedActionButton && (
						<StyledCommentActionsCombine
							isReply={isReply}
							className={`${baseClassName}__actions-combine`}
							data-role={DataRoles.Comment.Actions.Combine}
						>
							{combinedActionButton}
						</StyledCommentActionsCombine>
					)}
				</StyledCommentMetaContainer>
				<StyledCommentContent isReply={isReply} className={`${baseClassName}__content`}>
					{children && (
						<StyledCommentText
							inactive={inactive}
							minimised={inactive && minimised}
							className={`${baseClassName}__text`}
							data-role={DataRoles.Comment.Text}
						>
							{children}
						</StyledCommentText>
					)}
					{((commentTags && !inactive) || (inactive && !minimised)) && (
						<div className={`${baseClassName}__tag`} data-role={DataRoles.Comment.Tag}>
							{commentTags}
						</div>
					)}
					{inactive && showAllText && minimiseText && (
						<ButtonGroup>
							{minimised && showAllText && <Button onClick={this.toggleMinimisedState}>{showAllText}</Button>}
							{!minimised && minimiseText && <Button onClick={this.toggleMinimisedState}>{minimiseText}</Button>}
						</ButtonGroup>
					)}
				</StyledCommentContent>
				{replies && (
					<StyledCommentReplies className={`${baseClassName}__replies`} data-role={DataRoles.Comment.Replies}>
						{replies}
					</StyledCommentReplies>
				)}
				{actionButtons && (
					<StyledCommentActions className={`${baseClassName}__actions`} data-role={DataRoles.Comment.Actions}>
						<StyledCommentRepliesActions
							alignment={actionButtonPosition ?? "right"}
							className={isReply ? `${baseClassName}__replies-actions` : undefined}
						>
							{actionButtons}
						</StyledCommentRepliesActions>
					</StyledCommentActions>
				)}
			</StyledCommentWrapper>
		);
	}
}

export function isCommentMeta(object: CommentMeta | ReactNode): object is CommentMeta {
	return (
		object instanceof Object &&
		(Object.prototype.hasOwnProperty.call(object, "avatar") ||
			Object.prototype.hasOwnProperty.call(object, "author") ||
			Object.prototype.hasOwnProperty.call(object, "action") ||
			Object.prototype.hasOwnProperty.call(object, "date"))
	);
}
