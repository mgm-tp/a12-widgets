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

import type { FC } from "react";
import { useRef, useCallback, useLayoutEffect, useEffect } from "react";

import { addPrefix, getAllFocusableElements, getParentElement } from "./utils.js";
import type { TabSandboxProps } from "./tab-sandbox.api.js";
import { DataRoles } from "./data-roles.js";

const TAB_SANDBOX_SUPPORTER = addPrefix("tab-sandbox-supporter");

const isFocusingOnLastRadioGroup = (target: HTMLElement, lastFocusableElement: HTMLElement): boolean => {
	return (
		lastFocusableElement.getAttribute("type") === "radio" &&
		target.getAttribute("type") === "radio" &&
		lastFocusableElement.getAttribute("name") === target.getAttribute("name")
	);
};

export const TabSandbox: FC<TabSandboxProps> = ({
	focusBackIf = "unmounted",
	focusOnOpen = true,
	skipWrapperFocus,
	focusBack: focusBackProp,
	children,
	hasFocusStyle,
	focusBackHandler,
	disableTabTrapping = false
}) => {
	const supportContainerRef = useRef<HTMLDivElement | null>(null);
	const prevActiveElement = useRef<Element | null>(focusBackProp || focusBackHandler ? document.activeElement : null);
	const isMounted = useRef(false);

	const focusBack = useCallback((): void => {
		const wrapperRef = getWrapperRef();
		const activeElementBeforeWrapperAppear = prevActiveElement.current as HTMLElement;
		const currentActiveElement = document.activeElement;

		const isModalOverlay = wrapperRef?.closest(`[data-role=${DataRoles.Modal.Overlay}]`);

		// We only manage refocusing if the current active element is still within the wrapper or if the wrapper itself is within a modal overlay, as a displayed modal overlay blocks interaction with elements beneath it.
		if (
			!focusBackHandler &&
			((!wrapperRef?.contains(currentActiveElement) && !isModalOverlay) ||
				activeElementBeforeWrapperAppear === currentActiveElement)
		) {
			return;
		}

		if (
			activeElementBeforeWrapperAppear &&
			document.contains(activeElementBeforeWrapperAppear) &&
			activeElementBeforeWrapperAppear.focus
		) {
			activeElementBeforeWrapperAppear.focus();
		} else {
			const mainContainer = document.querySelector('[role="main"]');

			if (mainContainer) {
				(mainContainer as HTMLElement).focus();
			}
		}
	}, [focusBackHandler]);

	const getWrapperRef = (): HTMLElement | null => {
		const wrapper = supportContainerRef.current?.previousElementSibling;

		return (
			wrapper && wrapper.getAttribute("data-role") === DataRoles.AttachedPortal ? wrapper.firstChild : wrapper
		) as HTMLElement;
	};

	const handleWrapperFocus = useCallback(() => {
		const wrapperRef = getWrapperRef();

		if (wrapperRef) {
			const focusableElements = getAllFocusableElements(wrapperRef);

			if (focusableElements.length > 0) {
				const firstFocusableElement = focusableElements.item(0);

				if (skipWrapperFocus) {
					firstFocusableElement.focus();
				} else {
					wrapperRef.focus();
				}
			}
		}
	}, [skipWrapperFocus]);

	useLayoutEffect(() => {
		isMounted.current = true;

		return (): void => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => focusBackHandler?.(focusBack), [focusBack, focusBackHandler]);

	useLayoutEffect(() => {
		const previousActiveElement = prevActiveElement.current;

		const handleKeyDown = (event: KeyboardEvent): void => {
			const target = event.target as HTMLElement;

			const wrapperRef = getWrapperRef();

			if (!wrapperRef || event.key !== "Tab") {
				return;
			}

			if (disableTabTrapping) {
				return;
			}

			const focusableElements = getAllFocusableElements(wrapperRef);
			const focusableElementsInPortal =
				target.getAttribute("data-role") === DataRoles.AttachedPortal ? getAllFocusableElements(target) : undefined;

			// Do nothing in some cases:
			// - if there is no focusable element
			// - in case of use with nested portals, the `target` may contain only the `tab-support-container` and no other focusable elements
			// 		e.g. when opening a sub-menu of Flyout Menu but all sub-items are disabled
			if (
				focusableElements.length === 0 ||
				focusableElementsInPortal?.length === 0 ||
				(focusableElementsInPortal?.length === 1 &&
					focusableElementsInPortal?.item(0).getAttribute("data-role") === DataRoles.TabSandbox.Supporter)
			) {
				event.preventDefault();

				return;
			}

			const firstFocusableElement = focusableElements.item(0);
			const lastFocusableElement = focusableElements.item(focusableElements.length - 1);

			const isWrapper = target === wrapperRef || target.getAttribute("data-role") === DataRoles.AttachedPortal;

			if (event.shiftKey) {
				if (focusBackIf !== "unmounted" && focusBackProp && isWrapper) {
					event.preventDefault();
					focusBack();

					return;
				}

				if (isWrapper || target === firstFocusableElement) {
					event.preventDefault();
					lastFocusableElement.focus();
				}
			} else {
				if (focusBackIf !== "unmounted" && focusBackProp && target === lastFocusableElement) {
					event.preventDefault();
					focusBack();

					return;
				}

				/**
				 * Handles focus wrapping within the tab sandbox:
				 * 1. When the user tabs past the last focusable element (except if it's an iframe).
				 * 2. When focus reaches the support container (the hidden tab trap).
				 * 3. When tabbing within a radio group that is the last focusable element.
				 *
				 * Note: If the last focusable element is an iframe, focus is not trapped,
				 * allowing natural keyboard navigation into the iframe's content.
				 */
				const isTrappedFocus = target === lastFocusableElement && target.tagName?.toLowerCase() !== "iframe";

				if (
					isTrappedFocus ||
					target === supportContainerRef.current ||
					isFocusingOnLastRadioGroup(target, lastFocusableElement)
				) {
					event.preventDefault();
					handleWrapperFocus();
				}
			}
		};

		const handleClick = (event: MouseEvent): void => {
			const wrapperRef = getWrapperRef();

			if (
				wrapperRef &&
				(wrapperRef === event.target || wrapperRef.contains(event.target as Element)) &&
				event.screenX !== 0 &&
				event.screenY !== 0
			) {
				window.addEventListener("keydown", handleKeyDown);
			}
		};

		window.addEventListener("click", handleClick);
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			if (
				!isMounted.current &&
				focusBackProp &&
				(focusBackIf === "unmounted" || focusBackIf === "both") &&
				previousActiveElement
			) {
				focusBack();
			}

			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("click", handleClick);
		};
	}, [focusBack, focusBackIf, focusBackProp, handleWrapperFocus, skipWrapperFocus, disableTabTrapping]);

	useLayoutEffect(() => {
		if (!focusOnOpen || skipWrapperFocus) {
			return;
		}

		// Separate the containers into which is a portal relative to document.body and which one is not so that we can detect
		// the right top container to set focus.
		const containersRelativeToBody: Element[] = [];
		const containersRelativeToParent: Element[] = [];

		const supportContainers = document.getElementsByClassName(TAB_SANDBOX_SUPPORTER);

		for (let i = 0; i < supportContainers.length; i++) {
			const container = supportContainers.item(i);

			const parentOfContainer = getParentElement(
				container as HTMLElement,
				(currentParent) => currentParent.getAttribute("data-role") === DataRoles.Portal
			);

			if (container) {
				if (parentOfContainer?.parentElement === document.body) {
					containersRelativeToBody.push(container);
				} else {
					containersRelativeToParent.push(container);
				}
			}
		}

		const wrapperRef = getWrapperRef();

		if (
			wrapperRef &&
			supportContainers &&
			// Check if the top tab sandbox
			(containersRelativeToParent[containersRelativeToParent.length - 1]?.previousElementSibling === wrapperRef ||
				containersRelativeToBody[containersRelativeToBody.length - 1]?.previousElementSibling === wrapperRef)
		) {
			wrapperRef.tabIndex = -1;
			wrapperRef.focus();

			if (!hasFocusStyle) {
				wrapperRef.style.outline = "1px solid transparent";
			}
		}
	}, [focusOnOpen, hasFocusStyle, skipWrapperFocus]);

	return (
		<>
			{children}
			<div
				tabIndex={disableTabTrapping ? -1 : 0}
				className={TAB_SANDBOX_SUPPORTER}
				data-role={DataRoles.TabSandbox.Supporter}
				ref={supportContainerRef}
				onFocus={handleWrapperFocus}
			/>
		</>
	);
};

TabSandbox.displayName = "TabSandbox";
