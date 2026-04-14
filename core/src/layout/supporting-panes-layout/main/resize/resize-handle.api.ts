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

export interface ResizeHandleProps {
	/**
	 * @internal
	 * Target element to be resized.
	 */
	targetRef: RefObject<HTMLElement | null>;

	/**
	 * @internal
	 * Position of the target element that is standing in front or back of the resize handle.
	 */
	targetPosition: "left" | "right";

	/**
	 * @internal
	 * Minimum width to stop resizing.
	 */
	minWidth?: number;

	/**
	 * @internal
	 * Maximum width to stop resizing.
	 */
	maxWidth?: number;

	/**
	 * @internal
	 * If this prop is defined, the target element will no longer shrink when it reaches {@link minWidth} but jump back to collapsed state.
	 */
	collapsedWidth?: number;

	/**
	 * @internal
	 * A callback will be triggered on mousedown to start resizing.
	 */
	onResizeStart?(event: MouseEvent): void;

	/**
	 * @internal
	 * A callback will be triggered while resizing.
	 */
	onResize?(event: MouseEvent, payload: { resizedElementWidth: number; siblingElementWidth: number }): void;

	/**
	 * @internal
	 * Callback triggered when the resizing action is finished.
	 *
	 * @param event – The mouse event associated with the resize action.
	 * @param payload – An object containing details about the resize operation:
	 *   - `resizedElement`: The element that was resized.
	 *   - `siblingElement`: The adjacent sibling element affected by the resize.
	 *   - `resizedElementWidth`: The new width of the resized element.
	 *   - `siblingElementWidth`: The new width of the sibling element.
	 */
	onResizeEnd?(
		event: MouseEvent,
		payload: {
			resizedElement: HTMLElement | null;
			siblingElement: HTMLElement | null;
			resizedElementWidth: number;
			siblingElementWidth: number;
		}
	): void;

	/**
	 * @internal
	 * A callback triggered when a double-click event occurs.
	 */
	onDoubleClick?(event: MouseEvent): void;
}
