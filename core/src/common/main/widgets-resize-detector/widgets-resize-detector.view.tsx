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
import { useEffect, useEffectEvent } from "react";

import { useResizeObserver } from "../resize-observer/use-resize-observer.js";

import type { WidgetsResizeDetectorProps } from "./widgets-resize-detector.api.js";

/**
 * Wrapper around the {@link useResizeObserver} hook to make it easier to use
 * with class components.
 * @param props see {@link WidgetsResizeDetectorProps}
 * @constructor
 */
export const WidgetsResizeDetector: FunctionComponent<WidgetsResizeDetectorProps> = (props): ReactNode => {
	const { children, onResize, handleHeight, handleWidth, skipOnMount, refreshRate, observerOptions, targetRef } = props;

	// The detector has always emitted one `onResize` with an empty payload on
	// mount (before any measurement); consumers rely on it to run their
	// initial positioning and width/height synchronization.
	const emitInitialResize = useEffectEvent(() => {
		onResize?.({ width: null, height: null, entry: null });
	});

	useEffect(() => {
		emitInitialResize();
	}, []);

	useResizeObserver({
		onResize,
		handleHeight,
		handleWidth,
		skipOnMount,
		refreshRate,
		observerOptions,
		targetRef
	});

	return children;
};

WidgetsResizeDetector.displayName = "WidgetsResizeDetector";
