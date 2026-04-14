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

import type { Dispatch, RefObject, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";

import { DataRoles } from "../../../common/main/data-roles.js";
import { DOMUtils } from "../../../common/main/utils/dom-utils.js";

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

	useResizeDetector({
		onResize: initializePaneWidth,
		refreshMode: "debounce",
		refreshRate: 0,
		targetRef: paneRef
	});

	return [width, setWidth];
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
