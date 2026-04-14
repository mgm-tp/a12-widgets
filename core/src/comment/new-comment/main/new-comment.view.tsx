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

import { ButtonGroup } from "../../../button-group/main/button-group.view.js";
import { TextAreaStateless } from "../../../input/text-area/main/template/text-area.tpl.view.js";
import { bindMethods, addPrefix, joinClassNames } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import {
	StyledNewCommentMeta,
	StyledCommentMetaAvatar,
	StyledCommentMetaAuthor,
	StyledNewCommentWrapper,
	StyledNewCommentMetaContainer,
	StyledNewCommentContent,
	StyledNewCommentActions
} from "../../comment.styled.js";

import type { NewCommentMeta, NewCommentInputProps, NewCommentProps } from "./new-comment.api.js";

const baseClassName = addPrefix("new-comment");

export class NewComment extends Component<NewCommentProps, { update: boolean }> {
	static displayName = "NewComment";
	private newCommentRef: HTMLDivElement | null = null;

	constructor(props: NewCommentProps) {
		super(props);
		bindMethods(this);
	}

	private scrollToBottom(): void {
		if (this.newCommentRef) {
			this.newCommentRef.scrollTop = this.newCommentRef.scrollHeight;
		}
	}

	private renderNewCommentMeta(newCommentMeta: NewCommentMeta): ReactNode {
		const baseMetaClassName = `${baseClassName}__meta`;

		return (
			<StyledNewCommentMeta className={baseMetaClassName}>
				{newCommentMeta.avatar && (
					<StyledCommentMetaAvatar className={`${baseMetaClassName}-avatar`} data-role={DataRoles.NewComment.Avatar}>
						{newCommentMeta.avatar}
					</StyledCommentMetaAvatar>
				)}
				{newCommentMeta.author && (
					<StyledCommentMetaAuthor className={`${baseMetaClassName}-author`} data-role={DataRoles.NewComment.Author}>
						{newCommentMeta.author}
					</StyledCommentMetaAuthor>
				)}
			</StyledNewCommentMeta>
		);
	}

	componentDidMount(): void {
		this.scrollToBottom();
	}

	componentDidUpdate(): void {
		this.scrollToBottom();
	}

	render(): ReactElement<NewCommentProps> {
		const classNames = joinClassNames(
			baseClassName,
			{ [addPrefix("comment__replies-item")]: this.props.isReply },
			this.props.className
		);

		return (
			<StyledNewCommentWrapper
				isReply={this.props.isReply}
				id={this.props.id}
				className={classNames}
				style={this.props.style}
				ref={(ref) => {
					this.newCommentRef = ref;
				}}
				data-role={DataRoles.NewComment}
			>
				{this.props.commentMeta && (
					<StyledNewCommentMetaContainer
						className={`${baseClassName}__meta-container`}
						data-role={DataRoles.NewComment.MetaContainer}
					>
						{isNewCommentMeta(this.props.commentMeta)
							? this.renderNewCommentMeta(this.props.commentMeta)
							: this.props.commentMeta}
					</StyledNewCommentMetaContainer>
				)}
				<StyledNewCommentContent className={`${baseClassName}__content`} data-role={DataRoles.NewComment.Content}>
					{this.props.children}
				</StyledNewCommentContent>
				{this.props.actionButtons && (
					<StyledNewCommentActions className={`${baseClassName}__actions`}>
						<ButtonGroup className={addPrefix("-u-flex", "-u-justify-end")}>{this.props.actionButtons}</ButtonGroup>
					</StyledNewCommentActions>
				)}
			</StyledNewCommentWrapper>
		);
	}
}

export namespace NewComment {
	export function Input(props: NewCommentInputProps): ReactElement<NewCommentInputProps> {
		return (
			<TextAreaStateless
				{...props}
				onChange={(event) => {
					if (props.onChange) {
						props.onChange(event);
					}
				}}
			/>
		);
	}

	Input.displayName = "NewComment.Input";
}

function isNewCommentMeta(object: NewCommentMeta | ReactNode): object is NewCommentMeta {
	return (
		object instanceof Object &&
		(Object.prototype.hasOwnProperty.call(object, "avatar") || Object.prototype.hasOwnProperty.call(object, "author"))
	);
}
