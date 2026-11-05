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
 * Data set and measurement hook for the dropdown performance stories. Not part of any component —
 * it only exists so the perf and virtualization-spike stories report comparable numbers.
 * @module
 */

import { useCallback, useEffect, useState } from "react";

// This module holds no stories; the dummy default export satisfies `storybook/default-exports`.
const noStories = {};

export default noStories;
export const LARGE_ITEM_COUNT = 10_000;

const ADJECTIVES = [
	"Ancient",
	"Brave",
	"Calm",
	"Daring",
	"Eager",
	"Fierce",
	"Gentle",
	"Humble",
	"Idle",
	"Jolly",
	"Keen",
	"Lucky",
	"Mighty",
	"Noble",
	"Quiet",
	"Rapid",
	"Silent",
	"Tender",
	"Vivid",
	"Witty"
];

const NOUNS = [
	"Anchor",
	"Beacon",
	"Canyon",
	"Delta",
	"Ember",
	"Forest",
	"Glacier",
	"Harbor",
	"Island",
	"Jungle",
	"Kernel",
	"Lantern",
	"Meadow",
	"Nebula",
	"Orchard",
	"Prairie",
	"Quarry",
	"Ridge",
	"Summit",
	"Tundra"
];

/** Builds a deterministic list of unique, realistically shaped labels for performance stories. */
export function createLargeItemList(count: number): string[] {
	return Array.from({ length: count }, (_, index) => {
		const adjective = ADJECTIVES[index % ADJECTIVES.length];
		const noun = NOUNS[Math.floor(index / ADJECTIVES.length) % NOUNS.length];

		return `${adjective} ${noun} ${String(index + 1).padStart(5, "0")}`;
	});
}

export interface PerfSample {
	readonly id: number;
	readonly trigger: string;
	readonly ms: number;
	readonly options: number;
}

/**
 * Passively measures how long the dropdown needs to reach the screen: it stamps every pointer/key
 * interaction, waits for the listbox DOM to change (option nodes appearing or the active-option
 * attributes moving), and reports the elapsed time after the next paint (double
 * `requestAnimationFrame`). Interact with the widget normally — no extra wiring.
 */
export function useDropdownPerfProbe(): { samples: PerfSample[]; reset: () => void } {
	const [samples, setSamples] = useState<PerfSample[]>([]);

	useEffect(() => {
		let startedAt = 0;
		let trigger = "";
		let pending = false;
		let nextId = 1;

		const stamp = (label: string): void => {
			startedAt = performance.now();
			trigger = label;
		};

		const handlePointerDown = (): void => stamp("pointer");
		const handleKeyDown = (event: KeyboardEvent): void => stamp(`key ${event.key}`);

		const observer = new MutationObserver(() => {
			if (pending || startedAt === 0) {
				return;
			}

			pending = true;
			requestAnimationFrame(() =>
				requestAnimationFrame(() => {
					const ms = performance.now() - startedAt;
					const options = document.querySelectorAll('[role="option"]').length;

					pending = false;
					startedAt = 0;
					setSamples((previous) => [{ id: nextId++, trigger, ms, options }, ...previous].slice(0, 12));
				})
			);
		});

		document.addEventListener("pointerdown", handlePointerDown, true);
		document.addEventListener("keydown", handleKeyDown, true);
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			// Keyboard navigation only moves the active option, which is an attribute change, not a
			// child-list change — both have to be observed to time an arrow keypress.
			attributeFilter: ["data-preselect", "aria-activedescendant", "aria-selected"]
		});

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown, true);
			document.removeEventListener("keydown", handleKeyDown, true);
			observer.disconnect();
		};
	}, []);

	const reset = useCallback((): void => setSamples([]), []);

	return { samples, reset };
}
