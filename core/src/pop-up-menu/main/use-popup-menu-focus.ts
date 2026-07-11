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

import { useCallback, useContext, useEffect, useRef } from "react";
import type { RefObject } from "react";

import { getAllFocusableElements, isElementFocusable, isVisibleOnScreen } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { provider } from "../../common/main/device-detector.js";

import { PopupMenuConfigContext } from "./popup-menu-context.js";

interface ClosePopupFocusParams {
	shouldFocusOnTriggerButton: boolean;
	shouldFocusBackWhenClick: boolean;
}

interface UsePopupMenuFocusParams {
	buttonTriggerRef: RefObject<HTMLElement | null>;
	wrapperRef: RefObject<HTMLElement | null>;
	popupMenuRef: RefObject<HTMLElement | null>;
	hiddenTextRef: RefObject<HTMLElement | null>;
	focusOnOpen?: boolean;
	showPopUpList?: boolean;
}

interface UsePopupMenuFocusReturn {
	allowFocusBackRef: RefObject<boolean>;
	restoreFocusToTriggerButton: () => void;
	handleTransitionExited: () => void;
	handlePreCloseFocus: (params: ClosePopupFocusParams) => void;
	handlePostCloseFocus: (params: ClosePopupFocusParams) => void;
}

export const usePopupMenuFocus = ({
	buttonTriggerRef,
	wrapperRef,
	popupMenuRef,
	hiddenTextRef,
	focusOnOpen,
	showPopUpList
}: UsePopupMenuFocusParams): UsePopupMenuFocusReturn => {
	const { enableA11YMobileDesign } = useContext(PopupMenuConfigContext);
	const isDesktop = provider.isDesktop();
	const isMobile = provider.isPhone();

	const allowFocusBackRef = useRef<boolean>(false);
	const externalModalObserverRef = useRef<MutationObserver | null>(null);

	const restoreFocusToTriggerButton = useCallback((): void => {
		requestAnimationFrame(() => {
			const currentActive = document.activeElement as HTMLElement;

			if (!isElementFocusable(currentActive)) {
				buttonTriggerRef.current?.focus();
			}
		});
	}, [buttonTriggerRef]);

	const handlePreCloseFocus = useCallback(
		({ shouldFocusOnTriggerButton, shouldFocusBackWhenClick }: ClosePopupFocusParams): void => {
			if (buttonTriggerRef.current && !shouldFocusBackWhenClick && shouldFocusOnTriggerButton) {
				const a11yDesignOnMobile = isMobile && enableA11YMobileDesign;

				if (!a11yDesignOnMobile && isVisibleOnScreen(buttonTriggerRef.current)) {
					buttonTriggerRef.current.focus();
				}
			}
		},
		[buttonTriggerRef, isMobile, enableA11YMobileDesign]
	);

	const handlePostCloseFocus = useCallback(
		({ shouldFocusOnTriggerButton, shouldFocusBackWhenClick }: ClosePopupFocusParams): void => {
			if (!buttonTriggerRef.current) {
				return;
			}

			const a11yDesignOnMobile = isMobile && enableA11YMobileDesign;
			const allowFocusBack =
				shouldFocusOnTriggerButton &&
				(a11yDesignOnMobile || ((!enableA11YMobileDesign || isDesktop) && isVisibleOnScreen(buttonTriggerRef.current)));

			if (allowFocusBack) {
				if (shouldFocusBackWhenClick && !a11yDesignOnMobile) {
					restoreFocusToTriggerButton();
				} else {
					if (a11yDesignOnMobile) {
						allowFocusBackRef.current = shouldFocusOnTriggerButton;
					} else {
						const currentActive = document.activeElement as HTMLElement;
						const isInsideModal = !!currentActive?.closest(`[data-role="${DataRoles.Modal.Overlay}"]`);

						if (!isInsideModal) {
							buttonTriggerRef.current.focus();
						}
					}
				}
			}
		},
		[buttonTriggerRef, isMobile, enableA11YMobileDesign, isDesktop, restoreFocusToTriggerButton, allowFocusBackRef]
	);

	const handleTransitionExited = useCallback((): void => {
		requestAnimationFrame(() => {
			const hiddenParent = buttonTriggerRef.current?.closest("[aria-hidden=true]");
			const currentActive = document.activeElement as HTMLElement;
			const isInsideModal = !!currentActive?.closest(`[data-role="${DataRoles.Modal.Overlay}"]`);

			const externalModal = wrapperRef.current
				? Array.from(document.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Modal.Overlay}"]`)).find(
						(overlay) => !wrapperRef.current!.contains(overlay)
					)
				: null;
			const modalContent = externalModal?.querySelector<HTMLElement>(`[data-role="${DataRoles.Modal.OverlayContent}"]`);

			if (externalModal && modalContent) {
				if (allowFocusBackRef.current) {
					externalModalObserverRef.current?.disconnect();

					const observedParent = externalModal.parentElement;

					if (observedParent) {
						const triggerEl = buttonTriggerRef.current;
						const observer = new MutationObserver(() => {
							if (!externalModal.isConnected) {
								observer.disconnect();
								externalModalObserverRef.current = null;
								triggerEl?.focus();
							}
						});

						// Use subtree so that removal at any ancestor level (e.g. portal
						// container removed from body) is detected, not just direct children.
						observer.observe(document.body, { childList: true, subtree: true });
						externalModalObserverRef.current = observer;
					}

					allowFocusBackRef.current = false;
				}

				if (!externalModal.contains(currentActive)) {
					modalContent.focus();
				}

				return;
			}

			// Set focus back to the trigger button only if the Application Frame is not hidden (aria-hidden="true") to prevent errors when focusing on hidden elements.
			if (!hiddenParent && allowFocusBackRef.current && !isInsideModal) {
				buttonTriggerRef.current?.focus();
			} else if (hiddenParent && allowFocusBackRef.current && !isInsideModal) {
				externalModalObserverRef.current?.disconnect();

				const observer = new MutationObserver(() => {
					if (!buttonTriggerRef.current?.closest("[aria-hidden=true]")) {
						observer.disconnect();
						externalModalObserverRef.current = null;
						allowFocusBackRef.current = false;
						buttonTriggerRef.current?.focus();
					}
				});

				observer.observe(hiddenParent, { attributes: true, attributeFilter: ["aria-hidden"] });
				externalModalObserverRef.current = observer;

				return;
			}

			if (allowFocusBackRef.current) {
				allowFocusBackRef.current = false;
			}
		});
	}, [buttonTriggerRef, wrapperRef]);

	useEffect(() => {
		return (): void => {
			externalModalObserverRef.current?.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!focusOnOpen || !showPopUpList) {
			return;
		}

		const focusTimeoutId = setTimeout(() => {
			if (!isDesktop) {
				hiddenTextRef.current?.focus();
			} else {
				const container = popupMenuRef.current;

				if (container) {
					const firstItem = Array.from(getAllFocusableElements(container)).find(
						(el) => el.getAttribute("aria-disabled") !== "true"
					);
					(firstItem ?? container).focus();
				}
			}
		});

		return (): void => {
			clearTimeout(focusTimeoutId);
		};
	}, [focusOnOpen, isDesktop, showPopUpList, hiddenTextRef, popupMenuRef]);

	return {
		allowFocusBackRef,
		restoreFocusToTriggerButton,
		handleTransitionExited,
		handlePreCloseFocus,
		handlePostCloseFocus
	};
};
