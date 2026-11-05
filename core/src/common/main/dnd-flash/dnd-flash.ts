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
 * Post-move confirmation flash: a brief background pulse on the element an item just landed on, so a
 * completed drag-and-drop (pointer or keyboard) is legible — especially for keyboard users who never
 * saw a drop indicator. Mirrors the intent of Atlassian Pragmatic DnD's `triggerPostMoveFlash`.
 * @module
 */

/** Total duration (ms) of the flash pulse. */
export const POST_MOVE_FLASH_DURATION = 700;

export interface PostMoveFlashOptions {
	/**
	 * Background color the flash fades from (typically a themed selection/highlight token). Callers with
	 * theme access resolve the token and pass the literal color here.
	 */
	color: string;

	/** Duration override in milliseconds. @default {@link POST_MOVE_FLASH_DURATION} */
	durationMs?: number;
}

/**
 * Elements that actually paint the flash — `element` itself, or a `<tr>`'s cells: a row's background paints
 * *behind* them, and table cells carry an opaque one, so a row-level pulse would be covered.
 */
function resolveFlashTargets(element: HTMLElement): HTMLElement[] {
	if (element instanceof HTMLTableRowElement && element.cells.length > 0) {
		return Array.from(element.cells);
	}

	return [element];
}

/**
 * Flash `element` once. The background fades from {@link PostMoveFlashOptions.color} back to whatever it
 * already renders, then self-cleans. **No-op when the Web Animations API is unavailable** (SSR / older
 * engines) — the drop itself has already applied, so skipping the flourish is safe.
 */
export function triggerPostMoveFlash(element: HTMLElement, { color, durationMs }: PostMoveFlashOptions): void {
	if (typeof element.animate !== "function") {
		return;
	}

	resolveFlashTargets(element).forEach((target) =>
		target.animate([{ backgroundColor: color }, { backgroundColor: "transparent" }], {
			duration: durationMs ?? POST_MOVE_FLASH_DURATION,
			easing: "cubic-bezier(0.25, 1, 0.5, 1)",
			// `backgroundColor` is composited onto the element's own background for the pulse's lifetime and
			// then dropped; nothing is written to inline styles, so no explicit teardown is needed.
			fill: "none"
		})
	);
}
