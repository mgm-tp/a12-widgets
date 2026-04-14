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

import type { RefObject, FC } from "react";
import { useState, useEffect, useRef, isValidElement, cloneElement } from "react";
import { useTheme } from "styled-components";

import { DataRoles } from "../../common/main/data-roles.js";
import type { Container } from "../../common/main/base-props.js";

import { useRegisterResizeEvents } from "./resize-event.js";
import type { ResizeHandlerProps } from "./resize-handler.api.js";
import { StyledResizeHandler, StyledResizeHandlerWrapper } from "./resize-handler.styled.js";

function useComputeLayoutStyle(params: {
	targetRef: RefObject<HTMLElement | null>;
	position: ResizeHandlerProps["position"];
	resizable?: boolean;
	resizeHandleRef: RefObject<HTMLElement | null>;
}): { gap: number; borderRadius: number } {
	const { targetRef, resizable, resizeHandleRef, position } = params;
	const targetElement = targetRef.current;
	const resizeHandleElement = resizeHandleRef.current;
	const [gap, setGap] = useState(0);
	const [borderRadius, setBorderRadius] = useState(0);

	const { spacing } = useTheme(); // make sure to update the border-radius when the theme changes

	useEffect(() => {
		if (!resizable) {
			return;
		}

		const parentElement = targetElement?.parentElement;
		const isRightPosition = position === "right";

		const siblingElement = isRightPosition ? targetElement?.nextElementSibling : targetElement?.previousElementSibling;

		if (parentElement && siblingElement) {
			const parentGap = parseFloat(getComputedStyle(parentElement).gap.split(" ")[0]) || 0;
			const siblingMargin = parseFloat(
				getComputedStyle(siblingElement)[isRightPosition ? "marginLeft" : "marginRight"]
			);
			const targetMargin = parseFloat(getComputedStyle(targetElement)[isRightPosition ? "marginRight" : "marginLeft"]);
			setGap(parentGap + siblingMargin + targetMargin);
		}

		if (resizeHandleRef.current && resizeHandleRef.current.previousElementSibling) {
			const previousElement = resizeHandleRef.current.previousElementSibling as HTMLElement;
			const computedStyle = getComputedStyle(previousElement);
			setBorderRadius(parseFloat(computedStyle.borderRadius.split(" ")[0] || "0") || 0);
		}
	}, [targetElement, spacing, resizable, resizeHandleElement, position, resizeHandleRef]);

	return {
		gap,
		borderRadius
	};
}

export const ResizeHandler: FC<ResizeHandlerProps> = ({
	children,
	resizable = true,
	onResize,
	onResizeStart,
	onResizeStop,
	minWidth,
	maxWidth,
	targetRef,
	position = "right",
	layoutGap,
	wrapperRef
}) => {
	const resizeHandleRef = useRef<HTMLDivElement | null>(null);
	const { gap, borderRadius } = useComputeLayoutStyle({ targetRef, position, resizeHandleRef, resizable });

	const handleRef = (element: HTMLDivElement | null): void => {
		resizeHandleRef.current = element;

		if (wrapperRef) {
			wrapperRef.current = element;
		}
	};

	useRegisterResizeEvents({
		resizeHandleRef,
		minWidth,
		maxWidth,
		targetRef,
		onResizeStop,
		onResizeStart,
		onResize,
		resizable,
		position
	});

	if (isValidElement<Container>(children)) {
		/*
		 * Clone the child element and consistently render `StyledResizeHandlerWrapper` to preserve a stable DOM structure.
		 * This ensures the active element remains focused when switching between resizable and non-resizable modes,
		 * preventing disruptions in user interactions caused by DOM changes.
		 */
		return cloneElement(
			children,
			{},
			<StyledResizeHandlerWrapper $resizable={resizable} data-role={DataRoles.ResizableHandler.Wrapper}>
				{children.props.children}
				{resizable && (
					<StyledResizeHandler
						data-role={DataRoles.ResizableHandler}
						ref={handleRef}
						$layoutGap={layoutGap ?? gap}
						$borderRadius={borderRadius}
						$position={position}
					/>
				)}
			</StyledResizeHandlerWrapper>
		);
	}

	return children;
};
