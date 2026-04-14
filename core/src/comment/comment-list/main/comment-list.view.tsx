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

import type { ReactElement } from "react";
import { Children, Component } from "react";

import { bindMethods, addPrefix, joinClassNames } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { StyledCommentListWrapper, StyledCommentListItem } from "../../comment.styled.js";

import type { CommentListProps } from "./comment-list.api.js";

const baseClassName = addPrefix("comment-list");

export class CommentList extends Component<CommentListProps> {
	static displayName = "CommentList";
	private listRef: HTMLUListElement | null = null;

	constructor(props: CommentListProps) {
		super(props);
		bindMethods(this);
	}

	private scrollToBottom(): void {
		if (this.listRef && this.props.scrollToBottom) {
			this.listRef.scrollTop = this.listRef.scrollHeight;
		}
	}

	private getWrapperRef(ref: HTMLUListElement | null): void {
		this.listRef = ref;
	}

	componentDidMount(): void {
		setTimeout(this.scrollToBottom);
	}

	componentDidUpdate(): void {
		this.scrollToBottom();
	}

	render(): ReactElement<CommentListProps> {
		const classNames = joinClassNames(baseClassName, this.props.className);

		return (
			<StyledCommentListWrapper
				className={classNames}
				id={this.props.id}
				style={this.props.style}
				ref={this.getWrapperRef}
				data-role={DataRoles.CommentList}
			>
				{Children.toArray(this.props.children).map((comment, index) => {
					return (
						<StyledCommentListItem
							className={`${baseClassName}__item`}
							key={`comment-${index}`}
							data-role={DataRoles.CommentList.Item}
						>
							{comment}
						</StyledCommentListItem>
					);
				})}
			</StyledCommentListWrapper>
		);
	}
}
