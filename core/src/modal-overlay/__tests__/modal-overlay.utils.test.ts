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

import { afterEach, describe, expect, test } from "vitest";

import { DataRoles } from "../../common/main/data-roles.js";

import {
	getModalOverlayContent,
	getTopActiveModalOverlay,
	getTopFitToParentOverlay,
	modalOverlayClassName,
	resolveFitToParentTabTrapTarget
} from "../main/modal-overlay.utils.js";

const fitToParentClassName = `${modalOverlayClassName}--fitToParent`;

const createOverlayElement = (options: { fitToParent?: boolean; ariaHidden?: boolean } = {}): HTMLDivElement => {
	const el = document.createElement("div");
	el.setAttribute("data-role", DataRoles.Modal.Overlay);

	if (options.fitToParent) {
		el.classList.add(fitToParentClassName);
	}

	if (options.ariaHidden) {
		el.setAttribute("aria-hidden", "true");
	}

	return el;
};

const createOverlayContentElement = (): HTMLDivElement => {
	const el = document.createElement("div");
	el.setAttribute("data-role", DataRoles.Modal.OverlayContent);

	return el;
};

afterEach(() => {
	document.body.innerHTML = "";
});

describe("com.mgmtp.a12.widgets.modal-overlay.getTopFitToParentOverlay", () => {
	test("returns null when element is null", () => {
		expect(getTopFitToParentOverlay(null)).toBeNull();
	});

	test("returns null when element has no children", () => {
		const parent = document.createElement("div");
		expect(getTopFitToParentOverlay(parent)).toBeNull();
	});

	test("returns null when element has no fitToParent overlay children", () => {
		const parent = document.createElement("div");
		const child = document.createElement("div");
		parent.appendChild(child);
		expect(getTopFitToParentOverlay(parent)).toBeNull();
	});

	test("returns null when child has overlay data-role but no fitToParent class", () => {
		const parent = document.createElement("div");
		const child = createOverlayElement({ fitToParent: false });
		parent.appendChild(child);
		expect(getTopFitToParentOverlay(parent)).toBeNull();
	});

	test("returns the single visible fitToParent overlay", () => {
		const parent = document.createElement("div");
		const overlay = createOverlayElement({ fitToParent: true });
		parent.appendChild(overlay);
		expect(getTopFitToParentOverlay(parent)).toBe(overlay);
	});

	test("returns the single aria-hidden fitToParent overlay as fallback", () => {
		const parent = document.createElement("div");
		const overlay = createOverlayElement({ fitToParent: true, ariaHidden: true });
		parent.appendChild(overlay);
		expect(getTopFitToParentOverlay(parent)).toBe(overlay);
	});

	test("returns the last visible fitToParent overlay when multiple are present", () => {
		const parent = document.createElement("div");
		const first = createOverlayElement({ fitToParent: true });
		const second = createOverlayElement({ fitToParent: true });
		parent.appendChild(first);
		parent.appendChild(second);
		expect(getTopFitToParentOverlay(parent)).toBe(second);
	});

	test("skips aria-hidden overlays and returns the last visible one", () => {
		const parent = document.createElement("div");
		const visible = createOverlayElement({ fitToParent: true });
		const hidden = createOverlayElement({ fitToParent: true, ariaHidden: true });
		parent.appendChild(visible);
		parent.appendChild(hidden);
		expect(getTopFitToParentOverlay(parent)).toBe(visible);
	});

	test("returns the last fitToParent overlay when all are aria-hidden", () => {
		const parent = document.createElement("div");
		const first = createOverlayElement({ fitToParent: true, ariaHidden: true });
		const second = createOverlayElement({ fitToParent: true, ariaHidden: true });
		parent.appendChild(first);
		parent.appendChild(second);
		expect(getTopFitToParentOverlay(parent)).toBe(second);
	});

	test("ignores non-fitToParent overlay siblings", () => {
		const parent = document.createElement("div");
		const nonFitToParent = createOverlayElement({ fitToParent: false });
		const fitToParent = createOverlayElement({ fitToParent: true });
		parent.appendChild(nonFitToParent);
		parent.appendChild(fitToParent);
		expect(getTopFitToParentOverlay(parent)).toBe(fitToParent);
	});
});

describe("com.mgmtp.a12.widgets.modal-overlay.getTopActiveModalOverlay", () => {
	test("returns null when there are no modal overlays in the document", () => {
		expect(getTopActiveModalOverlay()).toBeNull();
	});

	test("returns the single visible overlay", () => {
		const overlay = createOverlayElement();
		document.body.appendChild(overlay);
		expect(getTopActiveModalOverlay()).toBe(overlay);
	});

	test("returns the single aria-hidden overlay as fallback", () => {
		const overlay = createOverlayElement({ ariaHidden: true });
		document.body.appendChild(overlay);
		expect(getTopActiveModalOverlay()).toBe(overlay);
	});

	test("returns the last visible overlay among multiple", () => {
		const first = createOverlayElement();
		const second = createOverlayElement();
		document.body.appendChild(first);
		document.body.appendChild(second);
		expect(getTopActiveModalOverlay()).toBe(second);
	});

	test("skips aria-hidden overlays and returns the last visible one", () => {
		const visible = createOverlayElement();
		const hidden = createOverlayElement({ ariaHidden: true });
		document.body.appendChild(visible);
		document.body.appendChild(hidden);
		expect(getTopActiveModalOverlay()).toBe(visible);
	});

	test("returns the last overlay in DOM order when all are aria-hidden", () => {
		const first = createOverlayElement({ ariaHidden: true });
		const second = createOverlayElement({ ariaHidden: true });
		document.body.appendChild(first);
		document.body.appendChild(second);
		expect(getTopActiveModalOverlay()).toBe(second);
	});
});

describe("com.mgmtp.a12.widgets.modal-overlay.getModalOverlayContent", () => {
	test("returns null when overlay is null", () => {
		expect(getModalOverlayContent(null)).toBeNull();
	});

	test("returns null when overlay has no content element", () => {
		const overlay = document.createElement("div");
		expect(getModalOverlayContent(overlay)).toBeNull();
	});

	test("returns the direct content element", () => {
		const overlay = document.createElement("div");
		const content = createOverlayContentElement();
		overlay.appendChild(content);
		expect(getModalOverlayContent(overlay)).toBe(content);
	});

	test("returns nested content element inside the overlay", () => {
		const overlay = document.createElement("div");
		const wrapper = document.createElement("div");
		const content = createOverlayContentElement();
		wrapper.appendChild(content);
		overlay.appendChild(wrapper);
		expect(getModalOverlayContent(overlay)).toBe(content);
	});
});

describe("com.mgmtp.a12.widgets.modal-overlay.resolveFitToParentTabTrapTarget", () => {
	const setupScenario = (options: {
		targetIsInsideOverlay?: boolean;
		targetIsInsideParent?: boolean;
		targetIsAncestorOfParent?: boolean;
		targetIsInsideContainingModal?: boolean;
		overlayAriaHidden?: boolean;
		overlayIsTopFitToParent?: boolean;
		topActiveIsRegularModal?: boolean;
		topActiveIsCrossContainerFitToParent?: boolean;
		topActiveIsSameContainerFitToParent?: boolean;
	}): { overlay: HTMLElement; target: HTMLElement; parentEl: HTMLElement } => {
		const parentEl = document.createElement("div");
		const overlay = createOverlayElement({ fitToParent: true });
		const content = createOverlayContentElement();
		overlay.appendChild(content);
		parentEl.appendChild(overlay);
		document.body.appendChild(parentEl);

		let target: HTMLElement;

		if (options.targetIsInsideOverlay) {
			target = document.createElement("button");
			content.appendChild(target);
		} else if (options.targetIsInsideParent) {
			target = document.createElement("button");
			parentEl.appendChild(target);
		} else if (options.targetIsAncestorOfParent) {
			target = document.createElement("div");
			target.appendChild(parentEl);
			document.body.appendChild(target);
		} else if (options.targetIsInsideContainingModal) {
			const containingModal = createOverlayElement();
			const innerContent = createOverlayContentElement();
			containingModal.appendChild(innerContent);
			containingModal.appendChild(parentEl);
			document.body.appendChild(containingModal);
			target = document.createElement("button");
			innerContent.appendChild(target);
		} else {
			target = document.createElement("button");
			document.body.appendChild(target);
		}

		if (options.overlayAriaHidden) {
			overlay.setAttribute("aria-hidden", "true");
		}

		if (options.topActiveIsRegularModal) {
			const regularModal = createOverlayElement();
			document.body.appendChild(regularModal);
		} else if (options.topActiveIsCrossContainerFitToParent) {
			const otherParent = document.createElement("div");
			const otherOverlay = createOverlayElement({ fitToParent: true });
			otherParent.appendChild(otherOverlay);
			document.body.appendChild(otherParent);
		} else if (options.topActiveIsSameContainerFitToParent) {
			const nestedOverlay = createOverlayElement({ fitToParent: true });
			parentEl.appendChild(nestedOverlay);
		}

		return { overlay, target, parentEl };
	};

	test("returns null when target is inside the overlay itself", () => {
		const { overlay, target, parentEl } = setupScenario({ targetIsInsideOverlay: true });
		expect(resolveFitToParentTabTrapTarget(target, overlay, parentEl)).toBeNull();
	});

	test("returns null when target is completely outside parent and no containing modal", () => {
		const { overlay, target, parentEl } = setupScenario({});
		expect(resolveFitToParentTabTrapTarget(target, overlay, parentEl)).toBeNull();
	});

	test("returns null when overlay is aria-hidden and target is ancestor of parent", () => {
		const { overlay, target, parentEl } = setupScenario({
			targetIsAncestorOfParent: true,
			overlayAriaHidden: true
		});
		expect(resolveFitToParentTabTrapTarget(target, overlay, parentEl)).toBeNull();
	});

	test("returns content when target is inside parent and overlay is the top fitToParent", () => {
		const { overlay, target, parentEl } = setupScenario({ targetIsInsideParent: true });
		const content = overlay.querySelector(`[data-role]`) as HTMLElement;
		expect(resolveFitToParentTabTrapTarget(target, overlay, parentEl)).toBe(content);
	});

	test("returns content when target is ancestor of parent and overlay is top fitToParent (no competing modal)", () => {
		const { overlay, target, parentEl } = setupScenario({ targetIsAncestorOfParent: true });
		const content = overlay.querySelector(`[data-role]`) as HTMLElement;
		expect(resolveFitToParentTabTrapTarget(target, overlay, parentEl)).toBe(content);
	});

	test("returns content when target is inside a modal that contains this overlay", () => {
		const { overlay, target, parentEl } = setupScenario({ targetIsInsideContainingModal: true });
		const content = overlay.querySelector(`[data-role]`) as HTMLElement;
		expect(resolveFitToParentTabTrapTarget(target, overlay, parentEl)).toBe(content);
	});

	test("returns null when a regular modal is on top (ancestor case defers to global top)", () => {
		const { overlay, target, parentEl } = setupScenario({
			targetIsAncestorOfParent: true,
			topActiveIsRegularModal: true
		});
		expect(resolveFitToParentTabTrapTarget(target, overlay, parentEl)).toBeNull();
	});

	test("returns content when target is inside parent and cross-container fitToParent is on top (per-container independence)", () => {
		const { overlay, target, parentEl } = setupScenario({
			targetIsInsideParent: true,
			topActiveIsCrossContainerFitToParent: true
		});
		const content = overlay.querySelector(`[data-role]`) as HTMLElement;
		expect(resolveFitToParentTabTrapTarget(target, overlay, parentEl)).toBe(content);
	});

	test("returns null when target is inside parent and a same-container fitToParent stacked on top", () => {
		const { overlay, target, parentEl } = setupScenario({
			targetIsInsideParent: true,
			topActiveIsSameContainerFitToParent: true
		});
		expect(resolveFitToParentTabTrapTarget(target, overlay, parentEl)).toBeNull();
	});
});
