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

import type { ReactNode, RefCallback } from "react";

import type { Container, HTMLAttributes, Identifiable, Ref, Styleable } from "../../../common/main/base-props.js";
import type { Orientation } from "../../../common/main/alignment.js";

export interface CalloutTplProps extends Styleable, Identifiable, Container, Ref<HTMLDivElement>, HTMLAttributes {
	/**
	 * The header of callout.
	 */
	header?: CalloutHeaderProps;

	/**
	 * The footer of callout.
	 */
	footer?: ReactNode;

	/**
	 * Set "true" to make the container can be resizable and draggable
	 */
	resizeAndDrag?: boolean;

	/**
	 * Set "true" to render a pointer which lets users know the container is triggered form which element.
	 */
	isPointerVisible?: boolean;

	/**
	 * Specifies the padding for the Callout's content area.
	 * - If set to true, there will be padding left, right, top and bottom applied.
	 * - If set to false, there's no padding applied.
	 * - You can also set a custom padding value. For example: `padding="12px 24px"` or `padding=24`.
	 *
	 * @default true
	 */
	padding?: number | string | boolean;

	/**
	 * The position style of the arrow.
	 * - Top: Distance from the arrow to the top of the container.
	 */
	pointerPosition?: { top?: number };

	/**
	 * @internal
	 */
	calloutOrientation?: Orientation;

	/**
	 * Reference of the callout's body
	 */
	bodyRef?: RefCallback<HTMLElement>;
}

export interface CalloutHeaderProps {
	/**
	 * Title of the callout's header.
	 */
	title?: ReactNode;

	/**
	 * Specifies prefix will be added in front of {@link title}.
	 */
	prefix?: ReactNode;

	/**
	 * Specifies prefix will be added in the end of {@link title}.
	 */
	suffix?: ReactNode;
}
