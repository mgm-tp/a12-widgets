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

import type { ReactNode } from "react";

import type { Identifiable, Ref, Styleable } from "../../common/main/base-props.js";

/**
 * This is the props for ProgressIndicator widget.
 * All other properties will be spread to the root element.
 */
export interface ProgressIndicatorProps extends Identifiable, Styleable, Ref {
	/**
	 * Set this to display the label below the progress indicator
	 */
	label?: ReactNode;

	/**
	 * Size of the Inner Overlay
	 * @default "big"
	 */
	size?: ProgressIndicatorSize;

	/**
	 * Custom color for the progress indicator
	 */
	color?: string;

	/**
	 * Hide the loading circle
	 */
	hideLoadingCircle?: boolean;

	/**
	 * Set this to display the label and circle in vertical or horizontal alignment
	 * @default "vertical"
	 */
	type?: "vertical" | "horizontal";

	/**
	 * Specifies when the widget should adjust its size based on the parent's size.
	 * Set to false to disable.
	 * @default 0.9
	 */
	dynamicHeightThreshold?: false | number;

	/**
	 * Display single overlay
	 */
	singleOverlay?: boolean;

	/**
	 * The circle and label appear immediately.
	 */
	fastAppear?: boolean;

	/**
	 * If it is set to `true`, the Progress Indicator's inner overlay will be focused and scrolled into view automatically.
	 * On the other hand, use {@link scrollIntoView} to execute scrolling manually.
	 */
	focusOnOpen?: boolean;

	/**
	 * To scroll the current progress indicator into the browser window's visible area without focusing on it.
	 *
	 * *Note:* Only works if {@link focusOnOpen} is not set.
	 */
	scrollIntoView?: boolean;

	/**
	 * Variant for Outer Overlay.
	 */
	outerOverlayVariant?: OverlayVariant;

	/**
	 * Variant for Inner Overlay.
	 */
	innerOverlayVariant?: OverlayVariant;

	/**
	 * Delay time when opening the ProgressIndicator.
	 */
	openingDelay?: number;

	/**
	 * Specifies whether using the loading dots after the label or not.
	 * *Note:* Loading dots just appears if there is a label.
	 */
	useLoadingDots?: boolean;

	/**
	 * If this property is set to `true`:
	 * - The progress indicator will take up the entire screen and won't be tied to any outer container.
	 * - The inner overlay will be automatically focused.
	 */
	global?: boolean;

	/**
	 * Specifies whether the progress indicator has no tabIndex.
	 * For avoiding HTML Validator:
	 * noTabIndex should be used in case Progress Indicator is called as a descendant of `button` or `a` element
	 */
	noTabIndex?: boolean;
}

/**
 * The size variant for the progress indicator.
 * - `default`: Deprecated since version 26.0.0, use "big" instead.
 * @default "big"
 */
export type ProgressIndicatorSize = "default" | "small" | "medium" | "big";

export type OverlayVariant = "bright" | "transparent";
