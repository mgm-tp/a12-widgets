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

import type { FunctionComponent, ReactNode } from "react";
import { useState, useCallback, useRef, useLayoutEffect, useEffect } from "react";
import { useResizeDetector } from "react-resize-detector";
import { type ResizePayload, type OnResizeCallback } from "react-resize-detector";

import type { WidgetsResizeDetectorProps } from "./widgets-resize-detector.api.js";

/**
 * Wrapper around the useResizeDetector hook to make it easier to use with class components.
 * @param props see {@link WidgetsResizeDetectorProps}
 * @constructor
 */
export const WidgetsResizeDetector: FunctionComponent<WidgetsResizeDetectorProps> = (props): ReactNode => {
	const {
		children,
		onResize,
		handleHeight,
		handleWidth,
		skipOnMount,
		refreshMode = "debounce",
		refreshRate = 0,
		refreshOptions,
		observerOptions,
		targetRef
	} = props;

	const [resizePayload, setResizePayload] = useState<ResizePayload>({
		height: null,
		width: null,
		entry: null
	});

	const handleOnResize = useCallback<OnResizeCallback>((payload: ResizePayload) => {
		setResizePayload(payload);
	}, []);

	const { ref: resizeRef } = useResizeDetector<HTMLElement>({
		onResize: handleOnResize,
		handleHeight,
		handleWidth,
		skipOnMount,
		refreshMode,
		refreshRate,
		refreshOptions,
		observerOptions,
		targetRef
	});

	const onResizeRef = useRef(onResize);

	/*
	 * Using the latest ref pattern with an onResize callback, ensure that the latest onResize is called in subsequent hooks without adding it to the dependencies.
	 * You can refer to the pattern here: https://www.epicreact.dev/the-latest-ref-pattern-in-react
	 * We keep this React.useLayoutEffect without dependencies, similar to how this pattern is used in ReactJS internal code.
	 */
	useLayoutEffect(() => {
		onResizeRef.current = onResize;
	});

	// Calling onResize directly in the useResizeDetector hook causes the onResize to trigger when the parent component is rendering. In case there is some setState for parent state in onResize, it will cause the issue of not being able to update during an existing state transition.
	useEffect(() => {
		onResizeRef.current?.(resizePayload);
	}, [resizePayload]);

	const observedElement = targetRef?.current;

	const attachRef = useCallback(() => {
		resizeRef.current = observedElement;
	}, [observedElement, resizeRef]);

	useEffect(() => {
		attachRef();
	}, [attachRef]);

	return children;
};

WidgetsResizeDetector.displayName = "WidgetsResizeDetector";
