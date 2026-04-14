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

import type { RefObject } from "react";

import type { Container } from "../../common/main/base-props.js";

export type ResizeCallbackData = {
	/**
	 * The HTML element that is being resized. This is usually the element
	 * directly associated with the resize operation.
	 */
	node: HTMLElement;

	/**
	 * The current width of the element being resized.
	 */
	width: number;

	/**
	 * The current height of the element being resized.
	 */
	height: number;
};

export type ResizeEventHandler = (event: MouseEvent, data: ResizeCallbackData) => void;

export interface ResizeOptions {
	/**
	 * The minimum width that the resizable element can be resized to.
	 */
	minWidth?: number | string;

	/**
	 * The maximum width that the resizable element can be resized to.
	 */
	maxWidth?: number | string;

	/**
	 * A callback triggered when the resize action stops (i.e., when the user stops dragging).
	 * Receives the resize event and a data object containing information such as the element's
	 * final size and the difference in dimensions since the resize began.
	 */
	onResizeStop?: ResizeEventHandler;

	/**
	 * A callback triggered when the resize action starts (i.e., when the user begins dragging).
	 * Receives the resize event and a data object containing initial size and position data.
	 */
	onResizeStart?: ResizeEventHandler;

	/**
	 * A callback triggered continuously as the resize is happening.
	 * Receives the resize event and a data object with information on the current size and
	 * changes in width/height as the user drags.
	 */
	onResize?: ResizeEventHandler;
}

export interface ResizeHandlerProps extends Container, Omit<ResizeOptions, "maxWidth" | "minWidth"> {
	/**
	 * A React reference of the element to observe. Pass a reference to the element you want to attach resize handlers to.
	 */
	targetRef: RefObject<HTMLElement | null>;

	/**
	 * Indicates whether the element can be resized by the user.
	 *
	 * @default true
	 */
	resizable?: boolean;

	/**
	 * The minimum width that the resizable element can be resized to.
	 */
	minWidth?: number;

	/**
	 * The maximum width that the resizable element can be resized to.
	 */
	maxWidth?: number;

	/**
	 * Specifies the position of the resize handler element relative to the target element.
	 *
	 * *Notes:*
	 * - To ensure resizing work properly, the `position` option should be set so that the resize handler is placed at the boundary between the two elements.
	 * - When the `position` is not explicitly set, it defaults to *right*, placing the resize handler on the right side of the first element.
	 *
	 * @default "right"
	 */
	position?: "left" | "right";

	/**
	 * @internal
	 * The gap between the target element and its siblings.
	 */
	layoutGap?: number;

	/**
	 * The reference of the resize handle element.
	 *
	 * This `RefObject` is used to access the DOM element associated with the resize handle.
	 * It allows parent components to interact with the resize handle element directly.
	 *
	 * Example usage:
	 *
	 * ```typescript
	 * const wrapperRef = useRef<HTMLDivElement | null>(null);
	 *
	 * <ResizeHandler wrapperRef={wrapperRef} ...otherProps />
	 *
	 * // Access the DOM element
	 * if (wrapperRef.current) {
	 *   console.log(wrapperRef.current);
	 * }
	 */
	wrapperRef?: RefObject<HTMLElement | null>;
}
