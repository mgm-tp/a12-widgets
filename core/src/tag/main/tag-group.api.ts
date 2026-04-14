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

import type { KeyboardEvent, FocusEvent, MouseEvent, TouchEvent } from "react";

import type { Styleable, Identifiable, Container, Ref } from "../../common/main/base-props.js";

export interface TagGroupProps extends Styleable, Identifiable, Container, Ref<HTMLDivElement> {
	/**
	 * Custom timeout for TransitionGroup.
	 * Change this if you are also overriding the duration in css,
	 * the value should be equal to or bigger than the css transition duration.
	 * @default 300
	 */
	animationTimeout?: number;

	tabIndex?: number;

	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;

	onFocus?(event: FocusEvent<HTMLDivElement>): void;

	onBlur?(event: FocusEvent<HTMLDivElement>): void;

	onMouseOver?(event: MouseEvent<HTMLDivElement>): void;

	onMouseLeave?(event: MouseEvent<HTMLDivElement>): void;

	onTouchStart?(event: TouchEvent<HTMLDivElement>): void;

	onTouchEnd?(event: TouchEvent<HTMLDivElement>): void;

	onClick?(event: MouseEvent<HTMLDivElement>): void;

	/**
	 * If set to true, will exclude the wai-aria attributes from TagGroup, so screen reader can not reach the TagGroup.
	 */
	noWaiAria?: boolean;
}
