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
import { useRef, useEffect } from "react";

import type { ResizeHandleProps } from "./resize-handle.api.js";

function manageResize(
	params: {
		event: MouseEvent;
		resizeHandleRef: HTMLElement | null;
		targetRef: HTMLElement | null;
		isResized: RefObject<boolean>;
	} & Omit<ResizeHandleProps, "targetRef">
): void {
	const {
		resizeHandleRef,
		maxWidth,
		minWidth,
		collapsedWidth,
		event,
		targetPosition,
		targetRef,
		onResizeEnd,
		onResize,
		isResized
	} = params;
	const isResizeTargetLeft = targetPosition === "left";

	if (!targetRef || !resizeHandleRef) {
		return;
	}

	const resizeHandle = event.target as HTMLElement;

	const currentElement = targetRef;
	const siblingElement = (
		isResizeTargetLeft ? targetRef?.nextElementSibling : targetRef?.previousElementSibling
	) as HTMLElement;

	if (!currentElement || !siblingElement) {
		return;
	}

	event.preventDefault();

	const lastPos = event.clientX;

	const currentElOriginSize = currentElement["offsetWidth"];
	const siblingElOriginSize = siblingElement["offsetWidth"];
	let currentElResizingSize = currentElOriginSize;
	let siblingElResizingSize = siblingElOriginSize;

	const sumSize = currentElResizingSize + siblingElResizingSize;

	// Resize by `width`
	const currentElWidth = parseFloat(window.getComputedStyle(currentElement).width);
	const siblingElWidth = parseFloat(window.getComputedStyle(siblingElement).width);

	function validateResizeRange(value: number): {
		isMin: boolean;
		isMax: boolean;
		isCollapsedWidth: boolean;
		isOutOfMin: boolean;
		isOutOfMax: boolean;
		isOutOfCollapsed: boolean;
	} {
		return {
			isMin: !!(minWidth && value <= minWidth),
			isMax: !!(maxWidth && value >= maxWidth),
			isOutOfMin: !!(minWidth && value < minWidth),
			isOutOfMax: !!(maxWidth && value > maxWidth),
			isCollapsedWidth: !!(collapsedWidth && value <= collapsedWidth),
			isOutOfCollapsed: !!(collapsedWidth && value < collapsedWidth)
		};
	}

	// Is being resized
	function onMouseMove(mouseMoveEvent: MouseEvent): void {
		isResized.current = true;
		const currentPos = mouseMoveEvent["clientX"];

		const delta = currentPos - lastPos;

		// delta decreases if resize to the right
		// delta increases if resize to the left
		currentElResizingSize = Number(currentElOriginSize) + delta * (isResizeTargetLeft ? 1 : -1);
		siblingElResizingSize = Number(siblingElOriginSize) - delta * (isResizeTargetLeft ? 1 : -1);

		const sumWidth = currentElWidth + siblingElWidth;
		const currentElDesiredWidth = Math.floor(sumWidth * (currentElResizingSize / sumSize));
		const siblingDesiredWidth = Math.floor(sumWidth * (siblingElResizingSize / sumSize));

		const validation = validateResizeRange(currentElDesiredWidth);

		const { minCursor, maxCursor } = getResizeCursor(targetPosition);
		updateCursor(
			resizeHandle,
			validation.isMin || validation.isCollapsedWidth ? minCursor : validation.isMax ? maxCursor : "col-resize"
		);

		if (
			(validation.isOutOfMin && !collapsedWidth) ||
			validation.isOutOfMax ||
			validation.isOutOfCollapsed ||
			currentElDesiredWidth <= 0 ||
			siblingDesiredWidth <= 0
		) {
			return;
		}

		let newCurrentWidth = currentElDesiredWidth;
		let newSiblingWidth = siblingDesiredWidth;

		if (validation.isMin && collapsedWidth) {
			const offset = currentElDesiredWidth - collapsedWidth;
			newCurrentWidth = collapsedWidth;
			newSiblingWidth = siblingDesiredWidth + offset;
		}

		currentElement.style.width = `${newCurrentWidth}px`;
		siblingElement.style.width = `${newSiblingWidth}px`;

		onResize?.(event, { resizedElementWidth: currentElDesiredWidth, siblingElementWidth: siblingDesiredWidth });
	}

	// End resize
	function onMouseUp(event: MouseEvent): void {
		updateCursor(resizeHandle, undefined, false);

		if (targetRef) {
			targetRef.style.transition = "";
		}

		if (isResized.current) {
			onResizeEnd?.(event, {
				resizedElement: currentElement,
				resizedElementWidth: currentElement.offsetWidth,
				siblingElement: siblingElement,
				siblingElementWidth: siblingElement.offsetWidth
			});

			isResized.current = false;
		}

		// Remove inline style after resizing. The new width is supposed to be updated in styled-component instead.
		currentElement.style.width = "";
		siblingElement.style.width = "";
		resizeHandle.style.left = "";
		resizeHandle.style.right = "";

		window.removeEventListener("mousemove", onMouseMove);
		window.removeEventListener("mouseup", onMouseUp);
	}

	window.addEventListener("mousemove", onMouseMove);
	window.addEventListener("mouseup", onMouseUp);
}

/** @internal */
export function useRegisterResizeEvents(
	params: {
		resizeHandleRef: HTMLElement | null;
		targetRef: HTMLElement | null;
	} & Omit<ResizeHandleProps, "targetRef">
): void {
	const {
		resizeHandleRef,
		targetRef,
		minWidth,
		maxWidth,
		collapsedWidth,
		targetPosition,
		onResizeEnd,
		onResize,
		onResizeStart,
		onDoubleClick
	} = params;

	const isResized = useRef(false);

	useEffect(() => {
		if (!resizeHandleRef || !targetRef) {
			return;
		}

		function handleMouseDown(event: MouseEvent): void {
			const target = event.target as HTMLElement;

			if (target.nodeType !== 1) {
				return;
			}

			updateCursor(target, target.style.cursor);

			if (targetRef) {
				targetRef.style.transition = "none";
			}

			manageResize({
				event,
				resizeHandleRef,
				targetRef,
				minWidth: minWidth && Math.floor(minWidth),
				maxWidth: maxWidth && Math.floor(maxWidth),
				collapsedWidth,
				targetPosition,
				onResizeEnd,
				onResize,
				isResized
			});

			if (isResized.current) {
				onResizeStart?.(event);
			}
		}

		const handleDoubleClick = (event: MouseEvent): void => {
			onDoubleClick?.(event);
		};

		resizeHandleRef.addEventListener("mousedown", handleMouseDown);
		resizeHandleRef.addEventListener("dblclick", handleDoubleClick);

		return (): void => {
			resizeHandleRef?.removeEventListener("mousedown", handleMouseDown);
			resizeHandleRef.removeEventListener("dblclick", handleDoubleClick);
		};
	}, [
		targetPosition,
		maxWidth,
		minWidth,
		resizeHandleRef,
		onResizeStart,
		onResizeEnd,
		onResize,
		targetRef,
		collapsedWidth,
		onDoubleClick
	]);
}

export function updateCursor(
	resizeHandle: HTMLElement | null,
	expectedCursor?: string,
	shouldUpdateResizeHandleCursor: boolean = true
): void {
	const html = document.querySelector("html");

	if (!html) {
		return;
	}

	html.style.cursor = expectedCursor || "default";

	if (shouldUpdateResizeHandleCursor && resizeHandle) {
		resizeHandle.style.cursor = expectedCursor || "";
	}
}

/** @internal */
export function getResizeCursor(targetPosition: ResizeHandleProps["targetPosition"]): {
	minCursor: string;
	maxCursor: string;
} {
	const isResizeTargetLeft = targetPosition === "left";
	const minCursor = isResizeTargetLeft ? "e-resize" : "w-resize";
	const maxCursor = isResizeTargetLeft ? "w-resize" : "e-resize";

	return {
		minCursor,
		maxCursor
	};
}
