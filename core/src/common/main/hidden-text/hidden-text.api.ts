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

import type { HTMLElementType, FocusEvent } from "react";

import type { Ref, Identifiable, Container, HTMLAttributes } from "../base-props.js";

/**
 * This component contains a hidden text and is used in the other widgets to support screen reader use.
 */
export interface HiddenTextProps extends Identifiable, Ref<HTMLSpanElement>, Container, HTMLAttributes {
	/**
	 * Text which is hidden. Can be read by screen reader only.
	 *
	 * @deprecated since 32.4.0. Pass the text directly as children instead.
	 */
	text?: string;

	tabIndex?: number;

	role?: string;

	ariaLevel?: number;

	/**
	 * @internal
	 * @default true
	 * Specifies whether hidden label text should be shown to screen readers or not.
	 */
	showHiddenText?: boolean;

	/**
	 * HTML tag to use for wrapping the hidden text content.
	 *
	 * @default 'span'
	 * @remarks
	 * In version 32.4.0, the component was updated to use children instead of the text prop.
	 * This allows more flexible content composition while maintaining screen reader support.
	 */
	htmlTag?: HTMLElementType;

	onFocus?(event: FocusEvent<HTMLElement>): void;
	onBlur?(event: FocusEvent<HTMLElement>): void;
}
