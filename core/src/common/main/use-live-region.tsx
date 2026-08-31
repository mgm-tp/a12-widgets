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

import type { ReactElement, RefCallback } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { DataRoles } from "./data-roles.js";
import { getDesktopOperatingSystem } from "./device-detector.js";
import { StyledHiddenTextWrapper } from "./hidden-text/hidden-text.view.js";

/** Time (ms) before an announced entry is removed from the live region to prevent DOM growth. */
const DEFAULT_REMOVE_DELAY = 7000;

/**
 * @internal
 */
export interface UseLiveRegionOptions {
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
export interface UseLiveRegionResult {
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
export function useLiveRegion(options: UseLiveRegionOptions = {}): UseLiveRegionResult {
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
