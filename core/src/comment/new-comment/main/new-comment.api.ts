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
 * You can create a form to add a new comment by using this widget.
 * @module
 */

import type { ReactNode } from "react";

import type { Styleable, Identifiable } from "../../../common/main/base-props.js";
import type { TextAreaStatelessProps } from "../../../input/text-area/main/template/text-area.tpl.api.js";

export interface NewCommentProps extends Styleable, Identifiable {
	/**
	 * The new comment's content.
	 */
	children?: ReactNode;

	/**
	 * The new comment's information.
	 */
	commentMeta?: NewCommentMeta | ReactNode;

	/**
	 * The new comment's action buttons.
	 */
	actionButtons?: ReactNode;

	/**
	 * If true, the comment will be displayed as a reply.
	 * @default false
	 */
	isReply?: boolean;
}

export interface NewCommentMeta {
	/**
	 * The author's avatar.
	 */
	avatar?: ReactNode;

	/**
	 * The author's name.
	 */
	author?: ReactNode;
}

/**
 * Props for the new comment input field, inheriting all TextAreaStatelessProps properties.
 */
export type NewCommentInputProps = TextAreaStatelessProps;
