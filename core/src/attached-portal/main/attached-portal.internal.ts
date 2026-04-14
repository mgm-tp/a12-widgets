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

import type { Orientation } from "../../common/main/alignment.js";
import { DISTANCE_TO_SCREEN_BORDER } from "../../common/main/alignment.js";
import type { CustomClientRect } from "../../common/main/utils.js";

export function computeMaxSize(
	referenceElementRect: CustomClientRect,
	orientation: Orientation
): { maxWidth: number; maxHeight: number } {
	const element = referenceElementRect;

	let maxWidth: number;

	if (orientation.startsWith("top") || orientation.startsWith("bottom")) {
		if (orientation.endsWith("end")) {
			maxWidth = element.right;
		} else if (orientation.endsWith("start")) {
			maxWidth = window.innerWidth - element.left;
		} else {
			maxWidth = window.innerWidth;
		}
	} else {
		if (orientation.startsWith("right")) {
			maxWidth = window.innerWidth - element.right;
		} else {
			maxWidth = element.left;
		}
	}

	let maxHeight: number;

	if (orientation.startsWith("right") || orientation.startsWith("left")) {
		if (orientation.endsWith("end")) {
			// Limit height to avoid being cut off at the bottom
			maxHeight = Math.min(element.bottom, window.innerHeight - DISTANCE_TO_SCREEN_BORDER);
		} else if (orientation.endsWith("start")) {
			maxHeight = window.innerHeight - element.top;
		} else {
			// make sure the element is not squeezed to the border (top and bottom) of the screen
			maxHeight = window.innerHeight - DISTANCE_TO_SCREEN_BORDER * 2;
		}
	} else {
		if (orientation.startsWith("top")) {
			maxHeight = element.top - 1;
		} else {
			// make sure the element is not squeezed to the border (bottom) of the screen
			maxHeight = window.innerHeight - element.bottom - DISTANCE_TO_SCREEN_BORDER;
		}
	}

	return { maxWidth: Math.round(maxWidth), maxHeight: Math.round(maxHeight) };
}

export function findClosestAttachedPortal(referencedElement: Element | null): Element | null {
	if (referencedElement === null) {
		return null;
	}

	let element: Element | null = referencedElement;
	const portals = document.querySelectorAll("[data-role=portal]");
	let i: number;

	do {
		i = portals.length;

		while (--i >= 0) {
			const item = portals.item(i);

			if (!item || item.firstElementChild === element) {
				break;
			}
		}

		element = element.parentElement;
	} while (i < 0 && element);

	return element;
}

export function hasRectChanged(previousRect?: DOMRect, currentRect?: DOMRect): boolean {
	if (!previousRect || !currentRect) {
		return false;
	}

	return (
		previousRect.top !== currentRect.top ||
		previousRect.left !== currentRect.left ||
		previousRect.width !== currentRect.width ||
		previousRect.height !== currentRect.height
	);
}
