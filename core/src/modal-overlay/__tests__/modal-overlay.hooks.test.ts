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
import { fireEvent } from "@testing-library/dom";
import { renderHook } from "@testing-library/react";

import { DataRoles } from "../../common/main/data-roles.js";

import { modalOverlayClassName } from "../main/modal-overlay.utils.js";
import { useModalTabTrap } from "../main/modal-overlay.hooks.js";

const fitToParentClassName = `${modalOverlayClassName}--fitToParent`;

const makeRef = <T extends HTMLElement>(el: T): { current: T } => ({ current: el });

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

const createContentElement = (): HTMLDivElement => {
	const el = document.createElement("div");
	el.setAttribute("data-role", DataRoles.Modal.OverlayContent);
	el.setAttribute("tabindex", "-1");

	return el;
};

const pressTab = (from: HTMLElement): void => {
	fireEvent.keyDown(from, { key: "Tab", bubbles: true });
};

afterEach(() => {
	document.body.innerHTML = "";
});

describe("com.mgmtp.a12.widgets.modal-overlay.useModalTabTrap", () => {
	describe("fitToParent mode", () => {
		test("redirects Tab from a sibling element inside the parent container to the modal content", () => {
			const parentContainer = document.createElement("div");
			const overlay = createOverlayElement({ fitToParent: true });
			const modalContent = createContentElement();
			overlay.appendChild(modalContent);

			const siblingButton = document.createElement("button");
			parentContainer.appendChild(overlay);
			parentContainer.appendChild(siblingButton);
			document.body.appendChild(parentContainer);

			const outerRef = makeRef(overlay);
			const innerRef = makeRef(modalContent);
			const parentRef = makeRef(parentContainer);

			renderHook(() => useModalTabTrap({ outerRef, innerRef, parentRef, fitToParent: true }));

			siblingButton.focus();
			pressTab(siblingButton);

			expect(modalContent).toHaveFocus();
		});

		test("does not intercept Tab when focus is already inside the overlay", () => {
			const parentContainer = document.createElement("div");
			const overlay = createOverlayElement({ fitToParent: true });
			const modalContent = createContentElement();
			const buttonInsideOverlay = document.createElement("button");
			modalContent.appendChild(buttonInsideOverlay);
			overlay.appendChild(modalContent);
			parentContainer.appendChild(overlay);
			document.body.appendChild(parentContainer);

			const outerRef = makeRef(overlay);
			const innerRef = makeRef(modalContent);
			const parentRef = makeRef(parentContainer);

			renderHook(() => useModalTabTrap({ outerRef, innerRef, parentRef, fitToParent: true }));

			buttonInsideOverlay.focus();
			pressTab(buttonInsideOverlay);

			expect(buttonInsideOverlay).toHaveFocus();
		});

		test("does not intercept Tab from an element outside the parent container hierarchy", () => {
			const parentContainer = document.createElement("div");
			const overlay = createOverlayElement({ fitToParent: true });
			const modalContent = createContentElement();
			overlay.appendChild(modalContent);
			parentContainer.appendChild(overlay);

			const buttonOutsideParent = document.createElement("button");
			document.body.appendChild(parentContainer);
			document.body.appendChild(buttonOutsideParent);

			const outerRef = makeRef(overlay);
			const innerRef = makeRef(modalContent);
			const parentRef = makeRef(parentContainer);

			renderHook(() => useModalTabTrap({ outerRef, innerRef, parentRef, fitToParent: true }));

			buttonOutsideParent.focus();
			pressTab(buttonOutsideParent);

			expect(buttonOutsideParent).toHaveFocus();
		});

		test("stops intercepting Tab after the hook is unmounted", () => {
			const parentContainer = document.createElement("div");
			const overlay = createOverlayElement({ fitToParent: true });
			const modalContent = createContentElement();
			overlay.appendChild(modalContent);

			const siblingButton = document.createElement("button");
			parentContainer.appendChild(overlay);
			parentContainer.appendChild(siblingButton);
			document.body.appendChild(parentContainer);

			const outerRef = makeRef(overlay);
			const innerRef = makeRef(modalContent);
			const parentRef = makeRef(parentContainer);

			const { unmount } = renderHook(() => useModalTabTrap({ outerRef, innerRef, parentRef, fitToParent: true }));
			unmount();

			siblingButton.focus();
			pressTab(siblingButton);

			expect(siblingButton).toHaveFocus();
		});
	});

	describe("regular modal mode", () => {
		test("redirects Tab from an external element to the modal content when the modal is topmost", () => {
			const overlay = createOverlayElement();
			const modalContent = createContentElement();
			overlay.appendChild(modalContent);

			const externalButton = document.createElement("button");
			document.body.appendChild(externalButton);
			document.body.appendChild(overlay);

			const outerRef = makeRef(overlay);
			const innerRef = makeRef(modalContent);
			const parentRef = makeRef(document.createElement("div"));

			renderHook(() => useModalTabTrap({ outerRef, innerRef, parentRef, fitToParent: false }));

			externalButton.focus();
			pressTab(externalButton);

			expect(modalContent).toHaveFocus();
		});

		test("does not intercept Tab when the overlay is aria-hidden", () => {
			const overlay = createOverlayElement({ ariaHidden: true });
			const modalContent = createContentElement();
			overlay.appendChild(modalContent);

			const externalButton = document.createElement("button");
			document.body.appendChild(externalButton);
			document.body.appendChild(overlay);

			const outerRef = makeRef(overlay);
			const innerRef = makeRef(modalContent);
			const parentRef = makeRef(document.createElement("div"));

			renderHook(() => useModalTabTrap({ outerRef, innerRef, parentRef, fitToParent: false }));

			externalButton.focus();
			pressTab(externalButton);

			expect(externalButton).toHaveFocus();
		});

		test("does not intercept Tab when a newer modal overlay is rendered on top", () => {
			const backgroundOverlay = createOverlayElement();
			const backgroundContent = createContentElement();
			backgroundOverlay.appendChild(backgroundContent);

			const frontOverlay = createOverlayElement();
			const frontContent = createContentElement();
			frontOverlay.appendChild(frontContent);

			const externalButton = document.createElement("button");
			document.body.appendChild(externalButton);
			document.body.appendChild(backgroundOverlay);
			document.body.appendChild(frontOverlay);

			const outerRef = makeRef(backgroundOverlay);
			const innerRef = makeRef(backgroundContent);
			const parentRef = makeRef(document.createElement("div"));

			renderHook(() => useModalTabTrap({ outerRef, innerRef, parentRef, fitToParent: false }));

			externalButton.focus();
			pressTab(externalButton);

			expect(externalButton).toHaveFocus();
		});

		test("stops intercepting Tab after the hook is unmounted", () => {
			const overlay = createOverlayElement();
			const modalContent = createContentElement();
			overlay.appendChild(modalContent);

			const externalButton = document.createElement("button");
			document.body.appendChild(externalButton);
			document.body.appendChild(overlay);

			const outerRef = makeRef(overlay);
			const innerRef = makeRef(modalContent);
			const parentRef = makeRef(document.createElement("div"));

			const { unmount } = renderHook(() => useModalTabTrap({ outerRef, innerRef, parentRef, fitToParent: false }));
			unmount();

			externalButton.focus();
			pressTab(externalButton);

			expect(externalButton).toHaveFocus();
		});
	});
});
