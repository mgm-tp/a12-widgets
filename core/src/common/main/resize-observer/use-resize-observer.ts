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

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import type { ResizePayload, UseResizeObserverOptions, UseResizeObserverResult } from "./resize-observer.api.js";

/** Dimensions of the box selected via `observerOptions.box` (content box by default). */
const getDimensions = (
	entry: ResizeObserverEntry,
	box?: ResizeObserverBoxOptions
): { width: number; height: number } => {
	const borderBox = entry.borderBoxSize?.[0];
	const contentBox = entry.contentBoxSize?.[0];

	if (box === "border-box" && borderBox) {
		return { width: borderBox.inlineSize, height: borderBox.blockSize };
	}

	if (box === "content-box" && contentBox) {
		return { width: contentBox.inlineSize, height: contentBox.blockSize };
	}

	return { width: entry.contentRect.width, height: entry.contentRect.height };
};

/**
 * Creates a `ResizeObserver`, or `null` where the API is unavailable
 * (SSR, non-DOM test environments, legacy browsers). Resize detection then degrades
 * to "no updates reported" instead of breaking the host component's render.
 */
const createObserver = (callback: ResizeObserverCallback): ResizeObserver | null => {
	try {
		return new ResizeObserver(callback);
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			// eslint-disable-next-line no-console
			console.warn("useResizeObserver: ResizeObserver is not supported or failed to initialize.", error);
		}

		return null;
	}
};

interface ObserverState<T extends HTMLElement> {
	element: T | null;
	observer: ResizeObserver | null;
	timer: ReturnType<typeof setTimeout> | null;
	pendingEntry: ResizeObserverEntry | null;
	skip: boolean;
	width: number | null | undefined;
	height: number | null | undefined;
}

/**
 * Observes an element with a native `ResizeObserver` and reports dimension
 * changes of the selected box. Notifications are coalesced onto a macrotask
 * (`refreshRate` quiet period, default `0`) so handlers may mutate layout
 * without causing ResizeObserver loop errors, and are only emitted when a
 * dimension enabled via `handleWidth`/`handleHeight` actually changed.
 *
 * Where `ResizeObserver` is unavailable the hook reports no updates rather than
 * throwing, so a host component still renders at its initial size.
 *
 * Internal replacement for the `react-resize-detector` package.
 */
export const useResizeObserver = <T extends HTMLElement = HTMLElement>(
	options: UseResizeObserverOptions<T> = {}
): UseResizeObserverResult<T> => {
	const {
		targetRef,
		onResize,
		handleWidth = true,
		handleHeight = true,
		skipOnMount = false,
		refreshRate = 0,
		observerOptions
	} = options;

	const [size, setSize] = useState<{ width?: number; height?: number }>({});

	const optionsRef = useRef({ onResize, handleWidth, handleHeight, refreshRate, observerOptions });

	useLayoutEffect(() => {
		optionsRef.current = { onResize, handleWidth, handleHeight, refreshRate, observerOptions };
	});

	const stateRef = useRef<ObserverState<T> | null>(null);

	if (stateRef.current === null) {
		stateRef.current = {
			element: null,
			observer: null,
			timer: null,
			pendingEntry: null,
			skip: skipOnMount,
			width: undefined,
			height: undefined
		};
	}

	const emit = useCallback((payload: ResizePayload) => {
		const state = stateRef.current!;
		const { onResize: notify, handleWidth: reportWidth, handleHeight: reportHeight } = optionsRef.current;

		if (!reportWidth && !reportHeight) {
			return;
		}

		const changed = (reportWidth && state.width !== payload.width) || (reportHeight && state.height !== payload.height);

		if (!changed) {
			return;
		}

		state.width = payload.width;
		state.height = payload.height;
		notify?.(payload);
		setSize({ width: payload.width ?? undefined, height: payload.height ?? undefined });
	}, []);

	const flush = useCallback(() => {
		const state = stateRef.current!;
		state.timer = null;

		const entry = state.pendingEntry;
		state.pendingEntry = null;

		if (entry === null) {
			return;
		}

		emit({ ...getDimensions(entry, optionsRef.current.observerOptions?.box), entry });
	}, [emit]);

	const cancel = useCallback(() => {
		const state = stateRef.current!;

		if (state.timer !== null) {
			clearTimeout(state.timer);
			state.timer = null;
		}

		state.pendingEntry = null;
	}, []);

	const attach = useCallback(
		(element: T | null) => {
			const state = stateRef.current!;

			if (state.element === element) {
				return;
			}

			state.observer?.disconnect();
			state.observer = null;
			cancel();
			state.element = element;

			if (element) {
				state.observer = createObserver((entries: ResizeObserverEntry[]) => {
					if (state.skip) {
						state.skip = false;

						return;
					}

					// Coalesce bursts and defer to a macrotask so that handlers
					// mutating layout do not trigger ResizeObserver loop errors.
					state.pendingEntry = entries[entries.length - 1];

					if (state.timer !== null) {
						clearTimeout(state.timer);
					}

					state.timer = setTimeout(flush, optionsRef.current.refreshRate);
				});

				state.observer?.observe(element, optionsRef.current.observerOptions);
			} else if (state.width != null || state.height != null) {
				emit({ width: null, height: null, entry: null });
			}
		},
		[cancel, emit, flush]
	);

	// `targetRef` elements are assigned outside our control;
	// re-check after every render and re-observe when the element identity changed.
	useEffect(() => {
		if (!targetRef) {
			return;
		}

		attach(targetRef.current);

		if (targetRef.current !== null) {
			return;
		}

		// A still-unassigned ref may be populated by a commit that does not
		// re-render this hook's host, e.g. the second pass of a portal mount.
		// Re-check once after the current flush settles.
		const timer = setTimeout(() => attach(targetRef.current), 0);

		return (): void => clearTimeout(timer);
	});

	useEffect(
		() => (): void => {
			const state = stateRef.current!;
			state.observer?.disconnect();
			state.observer = null;
			state.element = null;
			cancel();
		},
		[cancel]
	);

	return { ref: attach, width: size.width, height: size.height };
};
