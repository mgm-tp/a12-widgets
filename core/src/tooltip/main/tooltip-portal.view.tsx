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

import type { ReactElement } from "react";
import { useRef, useState, useCallback, useEffect } from "react";

import { AttachedPortal } from "../../attached-portal/main/attached-portal.view.js";
import type { Orientation } from "../../common/main/alignment.js";
import { IntersectionObserverHelper } from "../../common/main/utils.js";

import { StyledTooltipContainer, StyledTooltipContent } from "./tooltip.styled.js";
import type { TooltipPortalProps } from "./tooltip-portal.api.js";

/**
 * A reusable tooltip portal component that displays content in a positioned overlay.
 * This component handles all show/hide logic internally
 * and only requires a reference to the element to attach to.
 *
 * @internal
 * This is an internal component used by css-ellipsis and other widgets.
 */
export function TooltipPortal({
	referenceElementRef,
	children,
	variant = "hint",
	className,
	dataRole,
	tooltipContentDataRole,
	shouldShowTooltip
}: TooltipPortalProps): ReactElement | null {
	const [orientation, setOrientation] = useState<Orientation>("top-start");
	const [showTooltip, setShowTooltip] = useState(false);
	const [containerPosition, setContainerPosition] = useState<{ top: number; left: number } | undefined>(undefined);

	const tooltipContentRef = useRef<HTMLDivElement | null>(null);
	const portalElement = useRef<HTMLElement | null>(null);
	const tooltipElement = useRef<HTMLElement | null>(null);
	const intersectionObserverRef = useRef<IntersectionObserverHelper>(new IntersectionObserverHelper());
	const showTimeoutId = useRef<number | null>(null);
	const hideTimeoutId = useRef<number | null>(null);

	const TOOLTIP_DELAY = 500;

	const getPortalElementRef = useCallback((ref: HTMLDivElement | null): void => {
		portalElement.current = ref;
	}, []);

	const handleOrientationChange = useCallback((orientation: Orientation) => {
		setOrientation(orientation);

		if (portalElement.current) {
			setContainerPosition(portalElement.current.getBoundingClientRect());
		}
	}, []);

	const getTooltipElementRef = useCallback((ref: HTMLElement | null): void => {
		tooltipElement.current = ref;
	}, []);

	const clearTimeouts = useCallback((): void => {
		if (showTimeoutId.current) {
			window.clearTimeout(showTimeoutId.current);
			showTimeoutId.current = null;
		}

		if (hideTimeoutId.current) {
			window.clearTimeout(hideTimeoutId.current);
			hideTimeoutId.current = null;
		}
	}, []);

	const handleShowTooltip = useCallback((): void => {
		clearTimeouts();

		showTimeoutId.current = window.setTimeout(() => {
			if (referenceElementRef.current) {
				// Calculate visible rect when showing tooltip to ensure correct positioning
				intersectionObserverRef.current.getVisibleElementRect(referenceElementRef.current);
			}

			// Check if we should show the tooltip
			if (!shouldShowTooltip?.()) {
				return;
			}

			setShowTooltip(true);
		}, TOOLTIP_DELAY);
	}, [clearTimeouts, referenceElementRef, shouldShowTooltip, TOOLTIP_DELAY]);

	const handleHideTooltip = useCallback((): void => {
		clearTimeouts();

		hideTimeoutId.current = window.setTimeout(() => {
			setShowTooltip(false);
			intersectionObserverRef.current.disconnectObserver();
		}, TOOLTIP_DELAY);
	}, [clearTimeouts, TOOLTIP_DELAY]);

	useEffect(() => {
		const handleMouseOver = (): void => {
			handleShowTooltip();
		};

		const handleMouseOut = (event: MouseEvent): void => {
			const relatedTarget = event.relatedTarget;

			// Only hide the tooltip when the cursor moves outside both the reference element and the portal
			if (relatedTarget !== portalElement.current && relatedTarget !== tooltipElement.current) {
				handleHideTooltip();
			}
		};

		const referenceElement = referenceElementRef.current;

		if (referenceElement) {
			referenceElement.addEventListener("mouseover", handleMouseOver);
			referenceElement.addEventListener("mouseout", handleMouseOut);
		}

		return (): void => {
			if (referenceElement) {
				referenceElement.removeEventListener("mouseover", handleMouseOver);
				referenceElement.removeEventListener("mouseout", handleMouseOut);
			}
		};
	}, [referenceElementRef, handleShowTooltip, handleHideTooltip]);

	useEffect(() => {
		const observer = intersectionObserverRef.current;

		return (): void => {
			clearTimeouts();
			observer.disconnectObserver();
		};
	}, [clearTimeouts]);

	const handleTooltipMouseOver = useCallback((): void => {
		clearTimeouts();
	}, [clearTimeouts]);

	const handleTooltipMouseLeave = useCallback((): void => {
		handleHideTooltip();
	}, [handleHideTooltip]);

	if (!showTooltip || !referenceElementRef.current) {
		return null;
	}

	return (
		<AttachedPortal
			referenceElement={referenceElementRef.current}
			referenceElementRect={intersectionObserverRef.current.visibleElementRect}
			orientation={orientation}
			className={className}
			closeOnOutsideClick
			hideOnReferenceElementPositionChange
			onOrientationChange={handleOrientationChange}
			adjustPositionToScreen
			focusOnOpen={false}
			onMouseOver={handleTooltipMouseOver}
			onMouseLeave={handleTooltipMouseLeave}
			wrapperRef={getPortalElementRef}
		>
			<StyledTooltipContainer
				ref={getTooltipElementRef}
				data-role={dataRole}
				$variant={variant}
				$tooltipOrientation={orientation}
				$referenceElement={referenceElementRef.current}
				$position={containerPosition}
			>
				<StyledTooltipContent data-role={tooltipContentDataRole} role="tooltip" ref={tooltipContentRef} tabIndex={-1}>
					{children}
				</StyledTooltipContent>
			</StyledTooltipContainer>
		</AttachedPortal>
	);
}

TooltipPortal.displayName = "TooltipPortal";
