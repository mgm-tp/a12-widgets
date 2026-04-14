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

/**
 * This widget allow to create a comment component
 */

import type { ReactNode, ReactElement } from "react";

import type { Identifiable, Styleable } from "../../../common/main/base-props.js";
import type { PopUpMenuProps } from "../../../pop-up-menu/main/pop-up-menu.api.js";

export interface CommentProps extends Styleable, Identifiable {
	/**
	 * The comment's information.
	 */
	commentMeta: CommentMeta | ReactNode;

	/**
	 * The inactive comment's information.
	 */
	inactiveCommentMeta?: CommentMeta | ReactNode;

	/**
	 * The comment's content.
	 */
	children?: ReactNode;

	/**
	 * The comment's tags.
	 */
	commentTags?: ReactNode;

	/**
	 * A list of replies.
	 */
	replies?: ReactNode;

	/**
	 * The comment's action buttons.
	 */
	actionButtons?: ReactNode;

	/**
	 * The action button's position.
	 * @default right
	 */
	actionButtonPosition?: "left" | "right";

	/**
	 * The given action buttons will be placed in a pop-up menu.
	 */
	combinedActionButton?: ReactElement<PopUpMenuProps>;

	/**
	 * Whether the comment is in inactive mode.
	 */
	inactive?: boolean;

	/**
	 * Customized text for the SHOW ALL button.
	 *
	 * *Note*: Only works if {@link inactive} is true.
	 */
	showAllText?: string;

	/**
	 * Customized text for the MINIMISE button.
	 *
	 * *Note*: Only works if {@link inactive} is true.
	 */
	minimiseText?: string;

	/**
	 * If true, the comment will be displayed as a reply.
	 * @default false
	 */
	isReply?: boolean;
}

export interface CommentMeta {
	/**
	 * The author's avatar.
	 */
	avatar?: ReactNode;

	/**
	 * The author's name.
	 */
	author?: ReactNode;

	/**
	 * The action that user do with the comment.
	 */
	action?: ReactNode;

	/**
	 * The date that the action was done.
	 */
	date?: ReactNode;
}
