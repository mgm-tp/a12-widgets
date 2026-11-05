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

/**
 * A shared, visually-hidden ARIA live region whose spoken text is driven imperatively through a ref.
 * Screen-reader-only status announcements (drag-and-drop moves, sort changes, …) route through this so
 * a message re-renders only the region — never the host widget, which would otherwise reconcile its
 * whole subtree on every announcement.
 *
 * The module also holds the complementary mechanism: {@link useLiveRegionMirror} watches a container
 * with a `MutationObserver` and mirrors content that appears in it on its own (Chat messages and
 * notifications) into a hidden `role="log"` region — needed because VoiceOver on macOS drops dynamic
 * `role="log"` updates.
 * @module
 */

import type { CSSProperties, ReactElement, Ref, RefCallback } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

import { DataRoles } from "../data-roles.js";
import { getDesktopOperatingSystem } from "../device-detector.js";
import { StyledHiddenTextWrapper } from "../hidden-text/hidden-text.view.js";

/** Imperative handle a {@link LiveRegion} exposes to its host. */
export interface LiveRegionHandle {
	/** Replace the live region's spoken text. */
	announce(message: string): void;
}

/**
 * Visually-hidden style for the live region (clip-path technique, never `display:none` /
 * `visibility:hidden` — screen readers must still announce it).
 */
const LIVE_REGION_STYLE: CSSProperties = {
	position: "absolute",
	width: 1,
	height: 1,
	margin: -1,
	padding: 0,
	overflow: "hidden",
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	whiteSpace: "nowrap",
	border: 0,
	top: 0,
	left: 0
};

export interface LiveRegionProps {
	/** `data-role` for testing / querying the region. */
	dataRole?: string;

	/**
	 * Politeness of the region.
	 *
	 * @default "polite"
	 */
	ariaLive?: "polite" | "assertive";
}

/**
 * Visually-hidden live region whose text is set through {@link LiveRegionHandle.announce}. Consecutive
 * identical messages are still re-spoken (React bails out of an identical-state update, so an unspoken
 * zero-width space is alternated onto the text to force the DOM — and thus the announcement — to change).
 */
export const LiveRegion = forwardRef(function LiveRegion(
	{ dataRole, ariaLive = "polite" }: LiveRegionProps,
	ref: Ref<LiveRegionHandle>
): ReactElement {
	const [message, setMessage] = useState("");

	useImperativeHandle(
		ref,
		() => ({
			announce: (next: string): void => {
				setMessage((previous) => (next !== "" && previous === next ? `${next}​` : next));
			}
		}),
		[]
	);

	return (
		<span data-role={dataRole} role="status" aria-live={ariaLive} style={LIVE_REGION_STYLE}>
			{message}
		</span>
	);
});

LiveRegion.displayName = "LiveRegion";

/**
 * Convenience hook returning a stable ref to attach to a {@link LiveRegion} and an `announce` callback
 * that speaks through it. Lets a host mount `<LiveRegion ref={ref} />` once and hand `announce` to any
 * descendant (e.g. a per-row drag handle) without re-rendering itself.
 */
export function useLiveRegion(): { ref: Ref<LiveRegionHandle>; announce: (message: string) => void } {
	const handleRef = useRef<LiveRegionHandle>(null);
	const announce = useCallback((message: string): void => {
		handleRef.current?.announce(message);
	}, []);

	return { ref: handleRef, announce };
}

/** Time (ms) before an announced entry is removed from the live region to prevent DOM growth. */
const DEFAULT_REMOVE_DELAY = 7000;

/**
 * @internal
 */
export interface UseLiveRegionMirrorOptions {
	/** Overrides platform gating. Defaults to `true` on macOS only. */
	enabled?: boolean;

	/** Ms before an entry is removed from the live region. @default 7000 */
	removeDelay?: number;

	/**
	 * CSS selector(s) identifying which added nodes should be announced.
	 * When provided, only matching elements (or descendants matching the selector) are announced.
	 * When omitted, all added nodes' `textContent` is announced.
	 */
	contentSelector?: string;

	/** The `data-role` attribute value for the hidden live region element. @default DataRoles.A11yLiveRegion */
	dataRole?: string;
}

/**
 * @internal
 */
export interface UseLiveRegionMirrorResult {
	/** Hidden live region element to render alongside the observed container. `null` when disabled. */
	liveRegion: ReactElement | null;

	/** Ref callback to attach to the container element whose children should be observed. */
	containerRef: RefCallback<HTMLElement>;
}

/**
 * @internal
 * Announces dynamically added content to screen readers on macOS, where VoiceOver drops
 * dynamic `role="log"` updates. Uses plain DOM appendChild (not React reconciliation)
 * into a persistent live region so entries queue without interrupting each other.
 * Inert on non-macOS platforms to avoid double announcements.
 */
export function useLiveRegionMirror(options: UseLiveRegionMirrorOptions = {}): UseLiveRegionMirrorResult {
	const { removeDelay = DEFAULT_REMOVE_DELAY, contentSelector, dataRole = DataRoles.A11yLiveRegion } = options;
	const isEnabled = options.enabled ?? getDesktopOperatingSystem() === "Mac";

	const [target, setTarget] = useState<HTMLElement | null>(null);

	const liveRegionRef = useRef<HTMLElement | null>(null);
	const timeoutsRef = useRef<number[]>([]);

	const enqueue = useCallback(
		(text: string): void => {
			const region = liveRegionRef.current;
			const trimmed = text.trim();

			if (!region || !trimmed) {
				return;
			}

			const node = document.createElement("div");

			node.textContent = trimmed;
			region.appendChild(node);

			const timeoutId = window.setTimeout(() => {
				node.remove();
				timeoutsRef.current = timeoutsRef.current.filter((pending) => pending !== timeoutId);
			}, removeDelay);

			timeoutsRef.current.push(timeoutId);
		},
		[removeDelay]
	);

	useEffect(() => {
		if (!isEnabled || !target) {
			return;
		}

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				mutation.addedNodes.forEach((node): void => {
					if (!(node instanceof HTMLElement)) {
						return;
					}

					if (!contentSelector) {
						enqueue(node.textContent ?? "");

						return;
					}

					const contentElements = node.matches(contentSelector)
						? [node]
						: Array.from(node.querySelectorAll<HTMLElement>(contentSelector));

					if (contentElements.length === 0) {
						enqueue(node.textContent ?? "");

						return;
					}

					contentElements.forEach((element): void => enqueue(element.textContent ?? ""));
				});
			}
		});

		observer.observe(target, { childList: true, subtree: true });

		return (): void => observer.disconnect();
	}, [contentSelector, enqueue, isEnabled, target]);

	useEffect(() => {
		return (): void => {
			timeoutsRef.current.forEach((id) => clearTimeout(id));
			timeoutsRef.current = [];
		};
	}, []);

	const setLiveRegionRef = useCallback((element: HTMLElement | null): void => {
		liveRegionRef.current = element;
	}, []);

	const liveRegion = isEnabled ? (
		<StyledHiddenTextWrapper as="div" ref={setLiveRegionRef} role="log" data-role={dataRole} $showHiddenText />
	) : null;

	return { liveRegion, containerRef: setTarget };
}
