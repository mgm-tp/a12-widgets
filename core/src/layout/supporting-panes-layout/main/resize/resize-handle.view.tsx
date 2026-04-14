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

import { useTheme } from "styled-components";
import type { FunctionComponent, RefObject, MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { DataRoles } from "../../../../common/main/data-roles.js";

import { getResizeCursor, useRegisterResizeEvents } from "./resize-event.js";
import type { ResizeHandleProps } from "./resize-handle.api.js";
import { StyledResizeHandle } from "./resize-handle.styled.js";

/** @internal */
export const ResizeHandle: FunctionComponent<ResizeHandleProps> = (props) => {
	const { onResizeEnd: onResizeEndProp, onResizeStart: onResizeStartProp, onDoubleClick } = props;

	const [isResizing, setIsResizing] = useState(false);
	const [resizeCursor, setResizeCursor] = useState("col-resize");

	const resizeHandleRef = useRef<HTMLDivElement | null>(null);

	const handleResizeHandleRef = useCallback((instance: HTMLDivElement | null) => {
		resizeHandleRef.current = instance;
	}, []);

	const handleMouseOver = useCallback((event: ReactMouseEvent) => {
		event.stopPropagation();
	}, []);

	const onResizeStart = useCallback(
		(event: MouseEvent) => {
			setIsResizing(true);
			onResizeStartProp?.(event);
		},
		[onResizeStartProp]
	);

	const onEndResize = useCallback(
		(
			event: MouseEvent,
			payload: {
				resizedElement: HTMLElement | null;
				siblingElement: HTMLElement | null;
				resizedElementWidth: number;
				siblingElementWidth: number;
			}
		) => {
			setIsResizing(false);
			onResizeEndProp?.(event, payload);
		},
		[onResizeEndProp]
	);

	useEffect(() => {
		if (props.targetRef.current) {
			const min = props.minWidth && `${props.minWidth}px`;
			const max = props.maxWidth && `${props.maxWidth}px`;
			const targetWidth = props.targetRef.current.offsetWidth;

			const { minCursor, maxCursor } = getResizeCursor(props.targetPosition);

			setResizeCursor(targetWidth === min ? minCursor : targetWidth === max ? maxCursor : "col-resize");
		}
	}, [props.maxWidth, props.minWidth, props.targetPosition, props.targetRef]);

	useEffect(() => {
		// Prevent the other resize handles from revealing on hover over while dragging the current one
		const otherResizeHandles = document.querySelectorAll("[draggable='false']");
		otherResizeHandles.forEach((value) => {
			(value as HTMLElement).style.pointerEvents = isResizing ? "none" : "";
		});
	}, [isResizing]);

	useRegisterResizeEvents({
		targetRef: props.targetRef.current,
		targetPosition: props.targetPosition,
		resizeHandleRef: resizeHandleRef.current,
		minWidth: props.minWidth,
		maxWidth: props.maxWidth,
		collapsedWidth: props.collapsedWidth,
		onResizeStart,
		onResize: props.onResize,
		onResizeEnd: onEndResize,
		onDoubleClick
	});

	const { gap, targetBorder } = useComputeLayoutStyle(props.targetRef, props.targetPosition);

	return (
		<StyledResizeHandle
			data-role={DataRoles.SupportingPanesLayoutResizeHandler}
			ref={handleResizeHandleRef}
			draggable={isResizing}
			$targetPosition={props.targetPosition}
			$resizeCursor={resizeCursor}
			$gap={gap}
			$targetBorder={targetBorder}
			onMouseOver={handleMouseOver}
		/>
	);
};

ResizeHandle.displayName = "ResizeHandle";

function useComputeLayoutStyle(
	targetElement: RefObject<HTMLElement | null>,
	targetPosition: ResizeHandleProps["targetPosition"]
): { gap: number; targetBorder: number } {
	const [gap, setGap] = useState(0);
	const [targetBorder, setTargetBorder] = useState(0);

	const { components } = useTheme();

	useEffect(() => {
		const isTargetLeft = targetPosition === "left";

		if (targetElement.current) {
			const targetElementStyle = getComputedStyle(targetElement.current);
			const siblingElement = isTargetLeft
				? targetElement.current.nextElementSibling
				: targetElement.current.previousElementSibling;

			if (!siblingElement) {
				return;
			}

			const siblingElementStyle = getComputedStyle(siblingElement);

			const margin = parseFloat(targetElementStyle[isTargetLeft ? "marginRight" : "marginLeft"]) || 0;
			const siblingMargin = parseFloat(siblingElementStyle[isTargetLeft ? "marginLeft" : "marginRight"]) || 0;
			setGap(margin + siblingMargin);

			const border = parseFloat(targetElementStyle[isTargetLeft ? "borderRightWidth" : "borderLeftWidth"]) || 0;
			setTargetBorder(border);
		}
	}, [components, targetPosition, targetElement]);

	return { gap, targetBorder };
}
