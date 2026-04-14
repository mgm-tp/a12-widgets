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
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { debounce } from "lodash-es";
import type { ResizePayload, OnResizeCallback } from "react-resize-detector";
import { useResizeDetector } from "react-resize-detector";

import { ScrollbarWidthResolver } from "../../../common/main/utils.js";

import type {
	ElementSizeDetectorProps,
	SizeDetectorComponentProps,
	SizeDetectorProps,
	WindowSizeDetectorProps
} from "./size-detector.api.js";
import { SizeDetectorUtils } from "./size-detector.utils.js";

const scrollbarSize = ScrollbarWidthResolver.get();

export const useSizeChangeHandler = (params: {
	breakPoints?: SizeDetectorProps.BreakPoint[];
	initialWidth: number;
	shouldNotAccountForScrollbar?: boolean;
}): { breakPoint: SizeDetectorProps.BreakPoint; updateBreakPoint: (width: number) => void } => {
	const breakPoints = params.breakPoints || SizeDetectorUtils.DefaultBreakPoints;

	const [breakPoint, setBreakPoint] = useState<SizeDetectorProps.BreakPoint>(
		SizeDetectorUtils.lookupBreakPoint(breakPoints, params.initialWidth)
	);
	const previousWidth = useRef<number | undefined>(undefined);

	const updateBreakPoint = useCallback(
		(width: number) => {
			const newBreakpoint = SizeDetectorUtils.lookupBreakPoint(
				breakPoints ?? SizeDetectorUtils.DefaultBreakPoints,
				width
			);

			if (JSON.stringify(newBreakpoint) === JSON.stringify(breakPoint)) {
				previousWidth.current = width;

				return;
			}

			// ==== START - Prevent scrollbar show/hide from triggering infinite loop ===
			if (
				!params.shouldNotAccountForScrollbar &&
				previousWidth.current !== undefined &&
				scrollbarSize !== undefined &&
				scrollbarSize > 0
			) {
				if (
					previousWidth.current < width &&
					newBreakpoint.width &&
					width > newBreakpoint.width &&
					width - scrollbarSize < newBreakpoint.width
				) {
					return;
				}

				if (
					previousWidth.current > width &&
					newBreakpoint.width &&
					width < newBreakpoint.width &&
					width + scrollbarSize > newBreakpoint.width
				) {
					return;
				}
			}
			// ==== END - Prevent scrollbar show/hide from triggering infinite loop ===

			previousWidth.current = width;
			setBreakPoint(newBreakpoint);
		},
		[breakPoint, breakPoints, params.shouldNotAccountForScrollbar]
	);

	useEffect(() => {
		updateBreakPoint(previousWidth.current || params.initialWidth);
	}, [params.breakPoints, params.initialWidth, updateBreakPoint]);

	return { breakPoint, updateBreakPoint };
};

export const useWindowSize = (params?: WindowSizeDetectorProps): { breakPoint: SizeDetectorProps.BreakPoint } => {
	const breakPoints = params?.breakPoints || SizeDetectorUtils.DefaultBreakPoints;

	const { breakPoint, updateBreakPoint } = useSizeChangeHandler({
		breakPoints: breakPoints,
		initialWidth: document.documentElement.clientWidth,
		shouldNotAccountForScrollbar: true
	});
	const mounted = useRef(false);

	const onWindowSizeChange = useMemo(
		() =>
			debounce(() => {
				if (mounted.current) {
					updateBreakPoint(document.documentElement.clientWidth);
				}
			}, 100),
		[updateBreakPoint]
	);

	useEffect(() => {
		window.addEventListener("resize", onWindowSizeChange);
		updateBreakPoint(document.documentElement.clientWidth);

		return () => {
			window.removeEventListener("resize", onWindowSizeChange);
		};
	}, [onWindowSizeChange, updateBreakPoint]);

	useEffect(() => {
		mounted.current = true;

		return () => {
			mounted.current = false;
		};
	}, []);

	return { breakPoint };
};

/**
 * Component-based window size detector.
 *
 * @deprecated Use the `useWindowSize` hook instead.
 *
 * This component wraps the useWindowSize hook and provides a component-based API
 * for detecting window size changes.
 *
 * @example
 * // Old (deprecated):
 * <WindowSizeDetector onSizeChange={(breakpoint) => console.log(breakpoint.size)} />
 *
 * @example
 * // New (recommended):
 * const { breakPoint } = useWindowSize();
 * useEffect(() => {
 *   console.log(breakPoint.size);
 * }, [breakPoint]);
 */
export const WindowSizeDetector: FC<WindowSizeDetectorProps & SizeDetectorComponentProps> = (props) => {
	const { onSizeChange } = props;
	const { breakPoint } = useWindowSize(props);
	const onSizeChangeRef = useRef(onSizeChange);
	useEffect(() => {
		onSizeChangeRef.current?.(breakPoint);
	}, [breakPoint]);

	return <></>;
};

WindowSizeDetector.displayName = "WindowSizeDetector";

export const useElementSizeDetector = (
	params: ElementSizeDetectorProps
): { breakPoint: SizeDetectorProps.BreakPoint } => {
	const breakPoints = params.breakPoints || SizeDetectorUtils.DefaultBreakPoints;

	const { breakPoint, updateBreakPoint } = useSizeChangeHandler({
		breakPoints: breakPoints,
		initialWidth: params.targetRef.current?.clientWidth || 0
	});

	const onResize = useCallback<OnResizeCallback>(
		({ width }: ResizePayload) => width && updateBreakPoint(width),
		[updateBreakPoint]
	);

	useResizeDetector({
		handleHeight: params.handleHeight ?? false,
		handleWidth: params.handleWidth ?? true,
		refreshMode: "debounce",
		refreshRate: 0,
		onResize,
		targetRef: params.targetRef
	});

	return { breakPoint };
};

/**
 * Component-based element size detector.
 *
 * @deprecated Use the `useElementSizeDetector` hook instead.
 *
 * This component wraps the useElementSizeDetector hook and provides a component-based API
 * for detecting element size changes.
 *
 * @example
 * // Old (deprecated):
 * const ref = useRef<HTMLDivElement>(null);
 * <ElementSizeDetector
 *   targetRef={ref}
 *   onSizeChange={(breakpoint) => console.log(breakpoint.size)}
 * />
 *
 * @example
 * // New (recommended):
 * const ref = useRef<HTMLDivElement>(null);
 * const { breakPoint } = useElementSizeDetector({ targetRef: ref });
 * useEffect(() => {
 *   console.log(breakPoint.size);
 * }, [breakPoint]);
 */
export const ElementSizeDetector: FC<ElementSizeDetectorProps & SizeDetectorComponentProps> = (props) => {
	const { onSizeChange } = props;
	const { breakPoint } = useElementSizeDetector(props);
	const onSizeChangeRef = useRef(onSizeChange);

	useEffect(() => {
		onSizeChangeRef.current?.(breakPoint);
	}, [breakPoint]);

	return <></>;
};

ElementSizeDetector.displayName = "ElementSizeDetector";
