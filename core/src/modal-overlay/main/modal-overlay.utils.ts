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

import { addPrefix, getParentElement } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";

/** @internal */
export const modalOverlayClassName = addPrefix("modalOverlay");

/**
 * Returns the topmost visible (non-aria-hidden) overlay from the given list
 * (iterated in reverse DOM order), or the last one if all are aria-hidden.
 *
 * @internal
 */
const getTopNonHiddenOverlay = (elements: HTMLElement[]): HTMLElement | null =>
	elements.findLast((el) => el.getAttribute("aria-hidden") !== "true") ?? elements.at(-1) ?? null;

/**
 * Returns the topmost visible (non-aria-hidden) fitToParent modal overlay
 * that is a direct child of the given element, or the last fitToParent child
 * if all are aria-hidden.
 *
 * @internal
 */
export const getTopFitToParentOverlay = (element: HTMLElement | null): HTMLElement | null => {
	if (!element) {
		return null;
	}

	const fitToParentChildren = Array.from(element.children).filter(
		(child): child is HTMLElement =>
			child instanceof HTMLElement &&
			child.getAttribute("data-role") === DataRoles.Modal.Overlay &&
			child.classList.contains(`${modalOverlayClassName}--fitToParent`)
	);

	return getTopNonHiddenOverlay(fitToParentChildren);
};

/**
 * Returns the topmost visible (non-aria-hidden) modal overlay in the document,
 * or the last modal overlay if all are aria-hidden.
 *
 * @internal
 */
export const getTopActiveModalOverlay = (): HTMLElement | null => {
	const elements = Array.from(document.querySelectorAll<HTMLElement>(`[data-role=${DataRoles.Modal.Overlay}]`));

	return getTopNonHiddenOverlay(elements);
};

/**
 * Returns the overlay content element (dialog container) inside a given modal overlay element.
 *
 * @internal
 */
export const getModalOverlayContent = (modalOverlay: HTMLElement | null): HTMLElement | null =>
	(modalOverlay?.querySelector(`[data-role=${DataRoles.Modal.OverlayContent}]`) as HTMLElement | null) ?? null;

/**
 * Resolves the element that a fitToParent overlay's Tab trap should focus,
 * or `null` when this overlay should not intercept the Tab event.
 *
 * @internal
 */
export const resolveFitToParentTabTrapTarget = (
	targetElement: HTMLElement,
	overlay: HTMLElement,
	parentEl: HTMLElement | null
): HTMLElement | null => {
	if (overlay.contains(targetElement)) {
		return null;
	}

	const isInsideParent = !!parentEl?.contains(targetElement);
	const isAncestorOfParent = !isInsideParent && targetElement.contains(parentEl);

	if (!isInsideParent && !isAncestorOfParent) {
		const containingModal = getParentElement(
			targetElement,
			(p) => p.getAttribute("data-role") === DataRoles.Modal.Overlay
		);

		if (!containingModal?.contains(overlay)) {
			return null;
		}
	}

	if (!isInsideParent && overlay.getAttribute("aria-hidden") === "true") {
		return null;
	}

	const topFitToParent = getTopFitToParentOverlay(parentEl);
	const topActive = getTopActiveModalOverlay();

	if (topFitToParent !== overlay) {
		return null;
	}

	if (isInsideParent) {
		const topActiveIsFitToParent = topActive?.classList.contains(`${modalOverlayClassName}--fitToParent`) ?? false;
		const topActiveInSameContainer = !!parentEl?.contains(topActive);
		const shouldDefer = !!topActive && topActive !== overlay && (!topActiveIsFitToParent || topActiveInSameContainer);

		if (shouldDefer) {
			return null;
		}
	} else if (topActive && topActive !== overlay) {
		return null;
	}

	return getModalOverlayContent(topFitToParent);
};
