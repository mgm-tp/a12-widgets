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

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { provider } from "../../common/main/device-detector.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { usePopupMenuFocus } from "../main/use-popup-menu-focus.js";

vi.mock("../../common/main/utils.js", async (importOriginal) => {
	const actual = (await importOriginal()) as Record<string, unknown>;

	return { ...actual, isVisibleOnScreen: vi.fn(() => true) };
});

const makeRef = <T>(value: T): { current: T } => ({ current: value });

const createButton = (): HTMLButtonElement => {
	const el = document.createElement("button");
	el.setAttribute("tabindex", "0");
	document.body.appendChild(el);

	return el;
};

const createDiv = (): HTMLDivElement => {
	const el = document.createElement("div");
	document.body.appendChild(el);

	return el;
};

beforeEach(() => {
	vi.useFakeTimers({ toFake: ["setTimeout", "requestAnimationFrame"] });
});

afterEach(() => {
	vi.useRealTimers();
	document.body.innerHTML = "";
	vi.restoreAllMocks();
});

describe("com.mgmtp.a12.widgets.use-popup-menu-focus", () => {
	describe("handlePreCloseFocus", () => {
		test("focuses trigger button when shouldFocusBackWhenClick=false, shouldFocusOnTriggerButton=true, desktop, visible", () => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(true);
			vi.spyOn(provider, "isPhone").mockReturnValue(false);

			const triggerBtn = createButton();

			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(null),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			act(() => {
				result.current.handlePreCloseFocus({ shouldFocusOnTriggerButton: true, shouldFocusBackWhenClick: false });
			});

			expect(triggerBtn).toHaveFocus();
		});

		test("does NOT focus trigger button when shouldFocusBackWhenClick=true", () => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(true);
			vi.spyOn(provider, "isPhone").mockReturnValue(false);

			const triggerBtn = createButton();
			const otherBtn = createButton();
			otherBtn.focus();

			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(null),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			act(() => {
				result.current.handlePreCloseFocus({ shouldFocusOnTriggerButton: true, shouldFocusBackWhenClick: true });
			});

			// focus should stay on otherBtn, not triggerBtn
			expect(otherBtn).toHaveFocus();
		});

		test("does NOT focus trigger button when shouldFocusOnTriggerButton=false", () => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(true);
			vi.spyOn(provider, "isPhone").mockReturnValue(false);

			const triggerBtn = createButton();
			const otherBtn = createButton();
			otherBtn.focus();

			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(null),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			act(() => {
				result.current.handlePreCloseFocus({ shouldFocusOnTriggerButton: false, shouldFocusBackWhenClick: false });
			});

			expect(otherBtn).toHaveFocus();
		});

		test("does NOT focus trigger button on mobile a11y design even when visible", () => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(false);
			vi.spyOn(provider, "isPhone").mockReturnValue(true);

			const triggerBtn = createButton();
			vi.spyOn(triggerBtn, "getBoundingClientRect").mockReturnValue({
				width: 100,
				height: 40,
				top: 10,
				left: 10,
				bottom: 50,
				right: 110,
				x: 10,
				y: 10,
				toJSON: () => ({})
			});
			const otherBtn = createButton();
			otherBtn.focus();

			// enableA11YMobileDesign defaults to true in PopupMenuConfigContext
			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(null),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			act(() => {
				result.current.handlePreCloseFocus({ shouldFocusOnTriggerButton: true, shouldFocusBackWhenClick: false });
			});

			expect(otherBtn).toHaveFocus();
		});
	});

	describe("handlePostCloseFocus", () => {
		test("calls restoreFocusToTriggerButton (via rAF) when shouldFocusBackWhenClick=true, desktop, not mobile a11y", async () => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(true);
			vi.spyOn(provider, "isPhone").mockReturnValue(false);

			const triggerBtn = createButton();

			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(null),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			act(() => {
				result.current.handlePostCloseFocus({ shouldFocusOnTriggerButton: true, shouldFocusBackWhenClick: true });
			});

			// restoreFocusToTriggerButton uses requestAnimationFrame; flush it
			await act(() => vi.runAllTimersAsync());

			expect(triggerBtn).toHaveFocus();
		});

		test("directly focuses trigger button when shouldFocusBackWhenClick=false, desktop, not inside modal", () => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(true);
			vi.spyOn(provider, "isPhone").mockReturnValue(false);

			const triggerBtn = createButton();

			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(null),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			act(() => {
				result.current.handlePostCloseFocus({ shouldFocusOnTriggerButton: true, shouldFocusBackWhenClick: false });
			});

			expect(triggerBtn).toHaveFocus();
		});

		test("does NOT focus trigger button when active element is inside a modal overlay", () => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(true);
			vi.spyOn(provider, "isPhone").mockReturnValue(false);

			const triggerBtn = createButton();

			// Set up a modal overlay containing a focusable button
			const modal = document.createElement("div");
			modal.setAttribute("data-role", DataRoles.Modal.Overlay);
			const modalBtn = document.createElement("button");
			modal.appendChild(modalBtn);
			document.body.appendChild(modal);
			modalBtn.focus();

			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(null),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			act(() => {
				result.current.handlePostCloseFocus({ shouldFocusOnTriggerButton: true, shouldFocusBackWhenClick: false });
			});

			// focus should remain on the modal button, not the trigger
			expect(modalBtn).toHaveFocus();
		});

		test("sets allowFocusBackRef on mobile a11y design when shouldFocusBackWhenClick=false", () => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(false);
			vi.spyOn(provider, "isPhone").mockReturnValue(true);

			const triggerBtn = createButton();

			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(null),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			act(() => {
				result.current.handlePostCloseFocus({ shouldFocusOnTriggerButton: true, shouldFocusBackWhenClick: false });
			});

			expect(result.current.allowFocusBackRef.current).toBe(true);
		});

		test("does NOT set allowFocusBackRef when shouldFocusOnTriggerButton=false on mobile", () => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(false);
			vi.spyOn(provider, "isPhone").mockReturnValue(true);

			const triggerBtn = createButton();
			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(null),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			act(() => {
				result.current.handlePostCloseFocus({ shouldFocusOnTriggerButton: false, shouldFocusBackWhenClick: false });
			});

			expect(result.current.allowFocusBackRef.current).toBe(false);
		});
	});

	describe("focusOnOpen effect", () => {
		test("focuses popupMenuRef on desktop when showPopUpList=true", async () => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(true);
			vi.spyOn(provider, "isPhone").mockReturnValue(false);

			const popupMenu = createDiv();
			popupMenu.setAttribute("tabindex", "0");

			renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(null),
					wrapperRef: makeRef(null),
					popupMenuRef: makeRef(popupMenu),
					hiddenTextRef: makeRef(null),
					focusOnOpen: true,
					showPopUpList: true
				})
			);

			await act(() => vi.runAllTimersAsync());

			expect(popupMenu).toHaveFocus();
		});

		test("focuses hiddenTextRef on mobile when showPopUpList=true", async () => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(false);
			vi.spyOn(provider, "isPhone").mockReturnValue(true);

			const hiddenText = createDiv();
			hiddenText.setAttribute("tabindex", "-1");

			renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(null),
					wrapperRef: makeRef(null),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(hiddenText),
					focusOnOpen: true,
					showPopUpList: true
				})
			);

			await act(() => vi.runAllTimersAsync());

			expect(hiddenText).toHaveFocus();
		});

		test("does NOT focus anything when focusOnOpen=false", async () => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(true);
			vi.spyOn(provider, "isPhone").mockReturnValue(false);

			const popupMenu = createDiv();
			popupMenu.setAttribute("tabindex", "0");

			renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(null),
					wrapperRef: makeRef(null),
					popupMenuRef: makeRef(popupMenu),
					hiddenTextRef: makeRef(null),
					focusOnOpen: false,
					showPopUpList: true
				})
			);

			await act(() => vi.runAllTimersAsync());

			expect(popupMenu).not.toHaveFocus();
		});
	});

	describe("handleTransitionExited", () => {
		beforeEach(() => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(false);
			vi.spyOn(provider, "isPhone").mockReturnValue(true);
		});

		test("focuses trigger button when allowFocusBackRef=true and no external modal", async () => {
			const triggerBtn = createButton();
			const wrapper = createDiv();

			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(wrapper),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			result.current.allowFocusBackRef.current = true;

			act(() => {
				result.current.handleTransitionExited();
			});

			await act(() => vi.runAllTimersAsync());

			expect(triggerBtn).toHaveFocus();
		});

		test("focuses external modal content when an external modal exists", async () => {
			const triggerBtn = createButton();
			const wrapper = createDiv();

			const externalModal = document.createElement("div");
			externalModal.setAttribute("data-role", DataRoles.Modal.Overlay);
			const modalContent = document.createElement("div");
			modalContent.setAttribute("data-role", DataRoles.Modal.OverlayContent);
			modalContent.setAttribute("tabindex", "-1");
			externalModal.appendChild(modalContent);
			document.body.appendChild(externalModal);

			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(wrapper),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			act(() => {
				result.current.handleTransitionExited();
			});

			await act(() => vi.runAllTimersAsync());

			expect(modalContent).toHaveFocus();
		});

		test("focuses trigger button after external modal is removed from DOM when allowFocusBackRef=true", async () => {
			const triggerBtn = createButton();
			const wrapper = createDiv();

			const externalModal = document.createElement("div");
			externalModal.setAttribute("data-role", DataRoles.Modal.Overlay);
			const modalContent = document.createElement("div");
			modalContent.setAttribute("data-role", DataRoles.Modal.OverlayContent);
			modalContent.setAttribute("tabindex", "-1");
			externalModal.appendChild(modalContent);
			document.body.appendChild(externalModal);
			modalContent.focus();

			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(wrapper),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			result.current.allowFocusBackRef.current = true;

			act(() => {
				result.current.handleTransitionExited();
			});

			await act(() => vi.runAllTimersAsync());

			// Remove the modal — the MutationObserver should then focus the trigger
			act(() => {
				document.body.removeChild(externalModal);
			});

			// Flush any remaining timers after MutationObserver fires
			await act(() => vi.runAllTimersAsync());

			expect(triggerBtn).toHaveFocus();
		});

		test("does NOT focus trigger button when allowFocusBackRef=false and no external modal", async () => {
			const triggerBtn = createButton();
			const wrapper = createDiv();
			const otherBtn = createButton();
			otherBtn.focus();

			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(wrapper),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			// allowFocusBackRef stays false (default)
			act(() => {
				result.current.handleTransitionExited();
			});

			await act(() => vi.runAllTimersAsync());

			expect(otherBtn).toHaveFocus();
		});
	});

	describe("restoreFocusToTriggerButton", () => {
		test("focuses trigger button when current active element is not focusable (body)", async () => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(true);
			vi.spyOn(provider, "isPhone").mockReturnValue(false);

			const triggerBtn = createButton();

			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(null),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			// document.body is active (no interactive element focused)
			act(() => {
				result.current.restoreFocusToTriggerButton();
			});

			await act(() => vi.runAllTimersAsync());

			expect(triggerBtn).toHaveFocus();
		});

		test("does NOT steal focus when an interactive element already has focus", async () => {
			vi.spyOn(provider, "isDesktop").mockReturnValue(true);
			vi.spyOn(provider, "isPhone").mockReturnValue(false);

			const triggerBtn = createButton();
			const otherBtn = createButton();
			otherBtn.focus();

			const { result } = renderHook(() =>
				usePopupMenuFocus({
					buttonTriggerRef: makeRef(triggerBtn),
					wrapperRef: makeRef(null),
					popupMenuRef: makeRef(null),
					hiddenTextRef: makeRef(null)
				})
			);

			act(() => {
				result.current.restoreFocusToTriggerButton();
			});

			await act(() => vi.runAllTimersAsync());

			expect(otherBtn).toHaveFocus();
		});
	});
});
