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

import type { BezierDefinition, Variants } from "motion/react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";
import { useResizeObserver } from "../../../common/main/resize-observer/use-resize-observer.js";
import type { Duration } from "../../../common/main/type-utilities.js";
import { getTransitionDuration } from "../../../common/main/utils/css-utils.js";
import { DOMUtils } from "../../../common/main/utils/dom-utils.js";

import type { PaneTransformOrigin } from "./master-detail.utils.js";

import convertToPixel = DOMUtils.convertToPixel;

type WidthType = string | number | undefined;

export const usePaneWidthState = ({
	paneRef,
	maxWidth,
	isResizeable,
	resizeStopWidth,
	numOfColumns,
	smallView
}: {
	paneRef: RefObject<HTMLElement | null>;
	maxWidth?: string | number;
	isResizeable?: boolean;
	resizeStopWidth?: number;
	numOfColumns: number;
	smallView?: boolean;
}): [WidthType, Dispatch<SetStateAction<WidthType>>] => {
	const [width, setWidth] = useState<WidthType>(isResizeable ? resizeStopWidth : smallView ? 0 : undefined);
	const initPaneRef = useRef({
		paneRef,
		maxWidth,
		isResizeable,
		resizeStopWidth,
		numOfColumns,
		smallView
	});

	useEffect(() => {
		initPaneRef.current = {
			paneRef,
			maxWidth,
			isResizeable,
			resizeStopWidth,
			numOfColumns,
			smallView
		};
	});

	const initializePaneWidth = useCallback((): void => {
		if (paneRef.current && initPaneRef.current.isResizeable && !initPaneRef.current.smallView) {
			const layoutBody = paneRef.current.closest<HTMLElement>(`[data-role="${DataRoles.MasterDetail.Layout.Body}"]`);

			if (!layoutBody) {
				return;
			}

			const resizableMaxWidth = initPaneRef.current.maxWidth;
			const maxWidthValue = resizableMaxWidth ? convertToPixel(layoutBody, resizableMaxWidth) : undefined;
			const initialWidthValue =
				initPaneRef.current.resizeStopWidth ??
				convertToPixel(layoutBody, (initPaneRef.current.numOfColumns / 12) * 100 + "%");

			if (maxWidthValue && initialWidthValue) {
				setWidth(initialWidthValue < maxWidthValue ? initialWidthValue : maxWidthValue);
			}
		}
	}, [paneRef]);

	useEffect(() => {
		requestAnimationFrame(() => {
			initializePaneWidth();
		});
	}, [initializePaneWidth]);

	useResizeObserver({
		onResize: initializePaneWidth,
		targetRef: paneRef
	});

	return [width, setWidth];
};

interface MasterDetailAnimationConfigProps {
	numOfColumns?: number;
	isResizable?: boolean;
	enterTransformOrigin?: PaneTransformOrigin;
	exitTransformOrigin?: PaneTransformOrigin;
	isSinglePane?: boolean;

	/** True while an adjacent pane is animating out, so this pane should grow to fill the freed space. */
	siblingExiting?: boolean;
	isExistingPane?: boolean;
}

export interface MasterDetailAnimationConfig {
	paneVariants: Variants;
	contentVariants: Variants;
	MDAnimationStates: {
		hidden: "hidden";
		visible: "visible";
		exit: "exit";
	};
}

export const useMasterDetailAnimationConfig = ({
	numOfColumns,
	isResizable,
	enterTransformOrigin,
	exitTransformOrigin,
	isSinglePane,
	siblingExiting,
	isExistingPane
}: MasterDetailAnimationConfigProps): MasterDetailAnimationConfig => {
	const { animationDuration } = useTheme().components.masterDetailLayout.pane;

	const enterEasing: BezierDefinition = [0.17, 0.88, 0.33, 1.13];
	// The followEasing is used for panes already visible when another pane enters. Keeping same overshoot as enterEasing causes a slight shake at the end of the animation.
	const followEasing: BezierDefinition = [0.17, 0.88, 0.33, 1];
	const exitEasing: BezierDefinition = [0.17, 0.12, 0.67, 0.87];

	const duration = getTransitionDuration(animationDuration as Duration);
	const MDAnimationStates = {
		hidden: "hidden",
		visible: "visible",
		exit: "exit"
	} as const;

	const targetFlexGrow = isResizable && !siblingExiting ? 0 : (numOfColumns ?? 0);
	const enterDuration = duration * 1.5;

	const enterTransition = {
		scaleX: {
			duration: enterDuration,
			ease: isExistingPane ? followEasing : enterEasing
		},
		flexGrow: {
			duration: duration,
			ease: isExistingPane ? followEasing : enterEasing
		}
	};

	const exitTransition = {
		scaleX: { duration, ease: exitEasing },
		opacity: { duration: duration * 0.6 },
		flexGrow: { duration, ease: exitEasing }
	};

	const contentVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { ease: "easeIn", delay: duration, duration: duration * 0.5 }
		},
		exit: {
			opacity: 0,
			transition: { duration: 0 }
		}
	};

	const fullWidthStyle = numOfColumns === 1 ? { width: "100%" } : {};

	return {
		paneVariants: {
			hidden: {
				scaleX: 0,
				opacity: 0,
				flexGrow: 0,
				transformOrigin: enterTransformOrigin,
				...fullWidthStyle
			},
			visible: {
				scaleX: 1,
				opacity: 1,
				flexGrow: targetFlexGrow,
				transition: enterTransition,
				transformOrigin: enterTransformOrigin,
				...fullWidthStyle
			},
			exit: (customTransformOrigin?: PaneTransformOrigin) => ({
				scaleX: 0,
				opacity: 0,
				flexGrow: 0,
				transition: exitTransition,
				transformOrigin: customTransformOrigin ?? exitTransformOrigin,
				...(isSinglePane && { width: 0 })
			})
		},
		contentVariants,
		MDAnimationStates
	};
};

export const useAnimationEvents = (
	animating: boolean,
	{
		onAnimationStart,
		onAnimationEnd
	}: {
		onAnimationStart?: () => void;
		onAnimationEnd?: () => void;
	}
): void => {
	const prevAnimating = useRef(animating);

	useEffect(() => {
		if (!prevAnimating.current && animating) {
			onAnimationStart?.();
		}

		if (prevAnimating.current && !animating) {
			onAnimationEnd?.();
		}

		prevAnimating.current = animating;
	}, [animating, onAnimationStart, onAnimationEnd]);
};
