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
import { useState, useCallback, useEffect } from "react";
import { useResizeDetector } from "react-resize-detector";

import { DOMUtils } from "../../common/main/utils/dom-utils.js";

import type { ResizeOptions } from "./resize-handler.api.js";

/**
 * A custom React hook that calculates and manages the width constraints of a specified HTML element.
 * It dynamically adjusts dimensions based on the element's parent, sibling elements, and window resizing.
 *
 * @param params - Object containing:
 *   - elementRef: React ref to the target HTML element.
 *   - widthConfig: Object with min and max width settings.
 * @returns An object with:
 *   - absoluteMinWidth: Minimum width in pixels.
 *   - absoluteMaxWidth: Maximum width in pixels.
 */
export function useElementDimensions(params: {
	elementRef: RefObject<HTMLElement | null>;
	widthConfig: Pick<ResizeOptions, "maxWidth" | "minWidth">;
}): {
	absoluteMinWidth?: number;
	absoluteMaxWidth?: number;
} {
	const { elementRef, widthConfig } = params;
	const element = elementRef.current;
	const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);
	const [minWidth, setMinWidth] = useState<number | undefined>(undefined);
	const isMaxWidthPercentage = typeof widthConfig.maxWidth === "string" && widthConfig.maxWidth.endsWith("%");

	// Convert width config to pixel values
	const updateSize = useCallback((): void => {
		if (element) {
			setMaxWidth(DOMUtils.convertToPixel(element.parentElement, widthConfig?.maxWidth));
			setMinWidth(DOMUtils.convertToPixel(element.parentElement, widthConfig?.minWidth));
		}
	}, [element, widthConfig?.maxWidth, widthConfig?.minWidth]);

	// Adjusts maxWidth if siblings overflow or maxWidth is set in percentage
	const handleResize = useCallback((): void => {
		const parentElement = element?.parentElement;

		if (parentElement) {
			if (isMaxWidthPercentage) {
				// For percentage-based maxWidth, dynamically adjust based on the parent width.
				updateSize();
			} else {
				const maxWidthInPixels = DOMUtils.convertToPixel(parentElement, widthConfig?.maxWidth);

				if (!maxWidthInPixels) {
					return;
				}

				const siblingElements = DOMUtils.getSiblings(element);
				const parentElementWidth = parentElement.offsetWidth;

				if (siblingElements.length > 0) {
					// Check if siblings have explicit minimum widths that would prevent maxWidth
					const totalSiblingMinWidth = siblingElements.reduce((sum, sibling) => {
						const siblingMinWidth = parseFloat(getComputedStyle(sibling).minWidth) || 0;

						return sum + siblingMinWidth;
					}, 0);

					const availableWidthForTarget = parentElementWidth - totalSiblingMinWidth;

					// Only limit maxWidth if it would actually break layout constraints
					if (availableWidthForTarget > 0 && maxWidthInPixels > availableWidthForTarget) {
						setMaxWidth(availableWidthForTarget);
					} else {
						setMaxWidth(maxWidthInPixels);
					}
				} else {
					// No siblings, use configured maxWidth directly
					setMaxWidth(maxWidthInPixels);
				}
			}
		}
	}, [element, isMaxWidthPercentage, updateSize, widthConfig?.maxWidth]);

	useResizeDetector({
		handleHeight: false,
		onResize: handleResize,
		targetRef: elementRef
	});

	useEffect(() => {
		updateSize();
	}, [updateSize]);

	useEffect(() => {
		const parentElement = element?.parentElement;

		if (!parentElement) {
			return;
		}

		const resizeObserver = new ResizeObserver(() => {
			handleResize();
		});

		resizeObserver.observe(parentElement);

		return (): void => {
			resizeObserver.disconnect();
		};
	}, [element, handleResize]);

	return {
		absoluteMinWidth: minWidth ? Math.round(minWidth) : undefined,
		absoluteMaxWidth: maxWidth ? Math.round(maxWidth) : undefined
	};
}
