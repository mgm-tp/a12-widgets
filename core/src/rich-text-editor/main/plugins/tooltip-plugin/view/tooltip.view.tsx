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

import type { FC } from "react";
import { useState, useRef, useCallback, useEffect } from "react";

import { getGlobalViewportBox } from "../../../../../common/main/alignment.js";
import { StyledEditorTooltipArrow } from "../../../rich-text-editor.styled.js";
import { provider } from "../../../../../common/main/device-detector.js";

import type { TooltipPluginProps } from "./tooltip.api.js";
import { TooltipWrapper } from "./tooltip-wrapper.view.js";

export const TooltipPlugin: FC<TooltipPluginProps> = ({ openedDelay = 500, closedDelay = 200, ...rest }) => {
	const [isVisible, setVisible] = useState(false);
	const [children, setChildren] = useState(rest.render?.());

	const wrapperRef = useRef<HTMLElement | null>(null);
	const arrowRef = useRef<HTMLElement | null>(null);
	const targetRef = useRef<EventTarget | null>(null);
	const currentPosition = useRef<{ x: number; y: number } | null>(null);
	const openTimeoutID = useRef<number | null>(null);
	const closeTimeoutID = useRef<number | null>(null);
	const [position, setPosition] = useState<{ centerX: number; centerY: number }>({
		centerX: 0,
		centerY: 0
	});
	const isMobile = !provider.isDesktop();

	const { changeVisible, changePosition } = rest;

	const clearTimeout = (): void => {
		if (openTimeoutID.current !== null) {
			window.clearTimeout(openTimeoutID.current);
			openTimeoutID.current = null;
		}

		if (closeTimeoutID.current !== null) {
			window.clearTimeout(closeTimeoutID.current);
			closeTimeoutID.current = null;
		}
	};

	const adjustLeftToScreen = (left: number, width: number): number => {
		if (left < 0) {
			return 0;
		}

		const globalRect = getGlobalViewportBox();

		if (left + width > globalRect.right) {
			return globalRect.right - width;
		}

		return left;
	};

	const updatePosition = useCallback(
		(centerX: number, centerY: number): void => {
			if (typeof document.elementFromPoint !== "function") {
				return;
			}

			currentPosition.current = {
				x: centerX,
				y: centerY
			};

			if (wrapperRef.current && arrowRef.current) {
				if (isMobile) {
					wrapperRef.current.style.left = 0 + "px";
				}

				const tooltipRect = wrapperRef.current.getBoundingClientRect();
				let moveOnElement: Element | null = targetRef.current as Element;
				const isVirtualKeyboardOpen = window.innerHeight < document.documentElement.clientHeight;

				if (!moveOnElement) {
					const keyboardOffset = document.documentElement.clientHeight - window.innerHeight;
					const adjustedCenterY = centerY + arrowRef.current.offsetHeight - (isMobile ? keyboardOffset : 0);
					moveOnElement = document.elementFromPoint(centerX, adjustedCenterY);
				}

				if (moveOnElement) {
					const moveOnElementRect = moveOnElement.getBoundingClientRect();
					const tooltipPosition = tooltipRect.height + arrowRef.current.getBoundingClientRect().height / 2;
					const wholeArea = {
						left: centerX - tooltipRect.width / 2,
						top: isMobile && isVirtualKeyboardOpen ? centerY - tooltipPosition : moveOnElementRect.top - tooltipPosition
					};
					const visibleArea = {
						left: adjustLeftToScreen(wholeArea.left, tooltipRect.width),
						top: wholeArea.top
					};

					wrapperRef.current.style.left = visibleArea.left + "px";
					wrapperRef.current.style.top = visibleArea.top + "px";
				}
			}
		},
		[isMobile]
	);

	const hideTooltip = useCallback((): void => {
		clearTimeout();
		closeTimeoutID.current = window.setTimeout(() => setVisible(false), closedDelay);
	}, [closedDelay]);

	const showTooltip = useCallback((): void => {
		clearTimeout();
		openTimeoutID.current = window.setTimeout(() => {
			setVisible(true);
		}, openedDelay);
	}, [openedDelay]);

	const onMouseOver = useCallback((): void => {
		clearTimeout();
	}, []);

	const handleWrapperRef = useCallback((ref: HTMLElement | null): void => {
		wrapperRef.current = ref;
	}, []);

	const getArrowRef = useCallback((ref: HTMLDivElement | null): void => {
		arrowRef.current = ref;
	}, []);

	useEffect(() => {
		changeVisible?.((isVisibleTooltip: boolean, render?: TooltipPluginProps.Render) => {
			if (isVisibleTooltip) {
				setChildren(render?.());
				showTooltip();
			} else {
				hideTooltip();
			}
		});
	}, [changeVisible, hideTooltip, showTooltip]);

	useEffect(() => {
		changePosition?.((centerX: number, centerY: number, target?: EventTarget | null) => {
			targetRef.current = target ?? null;
			const clientRect = target ? (target as HTMLElement).getBoundingClientRect() : { left: centerX, top: centerY };
			const top = window.scrollY !== 0 && isMobile ? window.scrollY + clientRect.top : clientRect.top;
			setPosition({ centerX, centerY: top });
		});
	}, [changePosition, isMobile, updatePosition]);

	// Update the position when tooltip is visible
	useEffect(() => {
		if (isVisible) {
			updatePosition(position.centerX, position.centerY);
		}
	}, [isVisible, position, updatePosition]);

	useEffect(() => {
		return () => clearTimeout();
	}, []);

	return isVisible && children ? (
		<TooltipWrapper
			className={rest.className}
			wrapperRef={handleWrapperRef}
			id={rest.id}
			style={rest.style}
			onMouseOver={onMouseOver}
			onMouseLeave={rest.triggerMode !== "focus" ? hideTooltip : undefined}
			onClickOutside={rest.triggerMode !== "focus" ? undefined : hideTooltip}
		>
			<StyledEditorTooltipArrow ref={getArrowRef} />
			{children}
		</TooltipWrapper>
	) : null;
};

/** @deprecated since version 38.2.0. Use {@link TooltipPlugin} instead. */
export const Tooltip = TooltipPlugin;

TooltipPlugin.displayName = "TooltipPlugin";
