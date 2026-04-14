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
import { useEffect } from "react";

import type { ResizeHandlerProps } from "./resize-handler.api.js";

function computeNodeSize(node: HTMLElement | null): { width: number; height: number } {
	if (!node) {
		return { width: 0, height: 0 };
	}

	const { height, width } = node.getBoundingClientRect();

	return { width, height };
}

function clampWidth(width: number, minWidth?: number, maxWidth?: number): number {
	let newWidth = width;

	if (minWidth !== undefined) {
		newWidth = Math.max(newWidth, minWidth);
	}

	if (maxWidth !== undefined) {
		newWidth = Math.min(newWidth, maxWidth);
	}

	return newWidth;
}

function manageResize(
	params: {
		event: MouseEvent;
	} & ResizeHandlerProps
): void {
	const { maxWidth, minWidth, event, targetRef, onResize, onResizeStart, onResizeStop, position } = params;

	const targetElement = targetRef.current as HTMLElement;
	const isRightPosition = position === "right";

	if (!targetRef.current) {
		return;
	}

	const resizeHandlerElement = event.target as HTMLElement;
	const siblingElement = (isRightPosition ? targetElement.nextSibling : targetElement.previousSibling) as HTMLElement;

	if (!siblingElement) {
		return;
	}

	event.preventDefault();

	const parentElementWidth = (targetElement.parentElement?.offsetWidth || 0) - resizeHandlerElement.offsetWidth;
	const lastPosition = event.clientX;

	const { width: targetInitialWidth, height: targetInitialHeight } = targetElement.getBoundingClientRect();
	const siblingInitialWidth = siblingElement.offsetWidth;

	let targetResizingWidth = targetInitialWidth;

	const sumInitialWidth = targetInitialWidth + siblingInitialWidth;

	onResizeStart?.(event, {
		node: targetElement,
		width: clampWidth(targetInitialWidth, minWidth, maxWidth),
		height: targetInitialHeight
	});

	// Helper function to validate if a size is within the allowed range
	function validateResizeRange(value: number): {
		isBelowMinWidth: boolean;
		isAboveMaxWidth: boolean;
		isOutOfRange: boolean;
	} {
		const isBelowMinWidth = Boolean(minWidth && value <= minWidth);
		const isAboveMaxWidth = Boolean((maxWidth && value >= maxWidth) || value >= parentElementWidth);

		return {
			isAboveMaxWidth,
			isBelowMinWidth,
			isOutOfRange: isBelowMinWidth || isAboveMaxWidth
		};
	}

	// Common function to apply cursor style based on resize range
	function applyCursorStyle(isOutOfRange: boolean, isBelowMinWidth: boolean): void {
		const html = document.documentElement;

		if (!html) {
			return;
		}

		const cursorStyle = isOutOfRange ? (isBelowMinWidth ? "e-resize" : "w-resize") : "col-resize";
		resizeHandlerElement.style.cursor = cursorStyle;
		html.style.cursor = cursorStyle;
	}

	function handleResizing(mouseMoveEvent: MouseEvent): void {
		// Remove transition to avoid delay while resizing
		targetElement.style.transition = "none";
		siblingElement.style.transition = "none";

		// Calculates the new width of the resizing element based on the mouse movement.
		function getElementResizingWidth(elementSize: number, resizeDirection: 1 | -1 = 1): number {
			const currentPosition = mouseMoveEvent.clientX;
			const delta = currentPosition - lastPosition;

			return Number(elementSize) + resizeDirection * delta;
		}

		targetResizingWidth = getElementResizingWidth(targetInitialWidth, isRightPosition ? 1 : -1);

		const targetDesiredWidth = clampWidth(
			sumInitialWidth * (targetResizingWidth / sumInitialWidth),
			minWidth,
			maxWidth
		);
		const siblingDesiredWidth = sumInitialWidth - targetDesiredWidth;

		const { isBelowMinWidth, isOutOfRange } = validateResizeRange(targetDesiredWidth);

		applyCursorStyle(isOutOfRange, isBelowMinWidth);

		targetElement.style.width = `${targetDesiredWidth}px`;
		siblingElement.style.width = `${siblingDesiredWidth}px`;

		onResize?.(event, { node: targetElement, width: targetDesiredWidth, height: targetElement.offsetHeight });
	}

	// Function to handle the end of resizing
	function handleResizeStop(event: MouseEvent): void {
		const html = document.documentElement;

		if (!html) {
			return;
		}

		html.style.cursor = "";

		const { width, height } = computeNodeSize(targetElement);

		onResizeStop?.(event, {
			node: targetElement,
			width: clampWidth(width, minWidth, maxWidth),
			height
		});

		// Remove inline style after updating the width directly in the affected pane via state
		targetElement.style.width = "";
		siblingElement.style.width = "";
		targetElement.style.transition = "";
		siblingElement.style.transition = "";

		document.removeEventListener("mousemove", handleResizing);
		document.removeEventListener("mouseup", handleResizeStop);
	}

	document.addEventListener("mousemove", handleResizing);
	document.addEventListener("mouseup", handleResizeStop);
}

/** @internal */
export function useRegisterResizeEvents(
	params: {
		resizeHandleRef: RefObject<HTMLElement | null>;
	} & ResizeHandlerProps
): void {
	const { resizeHandleRef, resizable, position, targetRef, minWidth, maxWidth, onResize, onResizeStart, onResizeStop } =
		params;

	useEffect(() => {
		const resizeHandleElement = resizeHandleRef.current;

		if (!resizable || !resizeHandleElement) {
			return;
		}

		function handleResizeStart(event: MouseEvent): void {
			const html = document.documentElement;
			const target = event.target as HTMLElement;

			if (!html || target.nodeType !== 1) {
				return;
			}

			target.style.cursor = "col-resize";
			html.style.cursor = "col-resize"; // avoid cursor's flickering

			manageResize({
				event,
				minWidth,
				maxWidth,
				targetRef,
				position,
				onResize,
				onResizeStart,
				onResizeStop
			});
		}

		resizeHandleElement.addEventListener("mousedown", handleResizeStart);

		return (): void => {
			resizeHandleElement.removeEventListener("mousedown", handleResizeStart);
		};
	}, [position, resizable, resizeHandleRef, targetRef, onResize, onResizeStart, onResizeStop, minWidth, maxWidth]);
}
