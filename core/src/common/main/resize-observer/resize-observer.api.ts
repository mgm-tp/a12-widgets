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

import type { RefCallback, RefObject } from "react";

/**
 * Dimensions reported by {@link useResizeObserver}.
 * `null` values indicate that the observed element was detached.
 */
export interface ResizePayload {
	width: number | null;
	height: number | null;
	entry: ResizeObserverEntry | null;
}

/** Callback invoked whenever an observed dimension of the element changes. */
export type OnResizeCallback = (payload: ResizePayload) => void;

export interface UseResizeObserverOptions<T extends HTMLElement = HTMLElement> {
	/**
	 * Element to observe. Alternative to attaching the returned `ref`;
	 * when both are used, `targetRef` wins.
	 */
	targetRef?: RefObject<T | null>;

	/** Called when an observed dimension changes. */
	onResize?: OnResizeCallback;

	/**
	 * Observe width changes.
	 * @default true
	 */
	handleWidth?: boolean;

	/**
	 * Observe height changes.
	 * @default true
	 */
	handleHeight?: boolean;

	/**
	 * Skip the initial notification emitted when observation starts.
	 * @default false
	 */
	skipOnMount?: boolean;

	/**
	 * Quiet period in milliseconds before a resize is reported.
	 * Notifications are always deferred to a macrotask (even at `0`)
	 * so that handlers may safely mutate layout without triggering ResizeObserver loop errors.
	 * @default 0
	 */
	refreshRate?: number;

	/**
	 * Options forwarded to `ResizeObserver.observe`. `box` also selects which
	 * box's dimensions are reported (default: content box).
	 */
	observerOptions?: ResizeObserverOptions;
}

export interface UseResizeObserverResult<T extends HTMLElement = HTMLElement> {
	/** Attach to the element to observe (unless `targetRef` is used). */
	ref: RefCallback<T>;

	/** Last reported width, `undefined` until first notification. */
	width?: number;

	/** Last reported height, `undefined` until first notification. */
	height?: number;
}
