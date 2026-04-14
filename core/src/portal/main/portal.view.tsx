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

import type { SyntheticEvent, ReactPortal } from "react";
import { useRef, useContext, useEffect, useCallback } from "react";
import { Key } from "ts-key-enum";
import { createPortal } from "react-dom";

import {
	addPrefix,
	getElementDocument,
	getElementWindow,
	isVisibleOnScreen,
	joinClassNames
} from "../../common/main/utils.js";
import { PortalContext, WidgetsRoot } from "../../common/main/widgets-root.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { PortalProps } from "./portal.api.js";

const portalClassName = addPrefix("portal");
const modalClassName = addPrefix("modalOverlay");
const baseClassName = addPrefix("base");
const focusOnInnerWrapper = (element: HTMLElement): void => {
	if (!element?.contains(getElementDocument(element).activeElement) && element?.classList.contains(portalClassName)) {
		const focusElement = element.querySelector("[tabindex='-1']");
		(focusElement as HTMLElement)?.focus();
	}
};

const isAttachedPortal = (portal: HTMLElement): boolean => {
	return !!portal.querySelector(`[data-role=${DataRoles.AttachedPortal}]`);
};

export function Portal(props: PortalProps): ReactPortal | null {
	const { closeOnOutsideClick, onClickOutside, closeOnEsc = true, onClose, children } = props;

	const eventPath = useRef<Node[]>([]);
	const currentPortalRef = useRef<HTMLDivElement | null>(null);

	const portalContext = useContext(PortalContext);

	const {
		portalPlaceholderRef: { current: portalPlaceHolderElement }
	} = portalContext;

	useEffect(() => {
		const currentPortal = currentPortalRef.current;
		const previousSibling = currentPortal?.previousElementSibling;

		return (): void => {
			// Check if the active element or the previous active element is inside the current portal
			if (
				currentPortal &&
				(currentPortal.contains(document.activeElement) || currentPortal.contains(window.previousActiveElement))
			) {
				// For AttachedPortals, let them handle their own focus management
				if (isAttachedPortal(currentPortal)) {
					return;
				}

				// For everything else (modals, toasts, etc.), use the original behavior
				if (previousSibling) {
					focusOnInnerWrapper(previousSibling as HTMLElement);
				}
			}
		};
	}, [onClose]);

	useEffect(() => {
		const elementWindow = getElementWindow(portalPlaceHolderElement);

		/**
		 * check if there is a modal covering the screen.
		 * we won't close the current portal if click event happen on a modal because that modal needs to be closed first
		 */
		const isModalExistOnTop = (target: Element): boolean => {
			const modals = getElementDocument(target).getElementsByClassName(modalClassName);
			const portalContent = currentPortalRef.current?.firstElementChild?.firstElementChild;

			if (currentPortalRef.current && portalContent && !isVisibleOnScreen(portalContent as HTMLElement)) {
				for (let i = 0; i < modals.length; i++) {
					const modal = modals.item(i);

					if (modal && modal.contains(target)) {
						return true;
					}
				}
			}

			return false;
		};

		const mouseDownListener = (event: Event): void => {
			const target = event.target as Element;
			const isMountPointContainsElement = !!target && !!currentPortalRef.current?.contains(target);

			if (isMountPointContainsElement || isModalExistOnTop(target)) {
				return;
			}

			onClickOutside?.(event);

			if (onClose && closeOnOutsideClick) {
				if (target === eventPath.current[0] && "deepPath" in event) {
					(event as any).deepPath = (): Node[] => eventPath.current;
				}

				onClose(event);
			}
		};

		const keydownListener = (event: KeyboardEvent): void => {
			const childPortals = Array.from(currentPortalRef.current?.getElementsByClassName(portalClassName) ?? []);
			const containsAnyPortal = childPortals.length && childPortals.some((p) => p.innerHTML);

			if (
				onClose &&
				closeOnEsc &&
				event.key === Key.Escape &&
				!containsAnyPortal &&
				currentPortalRef.current?.contains(event.target as HTMLElement)
			) {
				onClose(event);

				const previousSibling = currentPortalRef.current?.previousElementSibling;

				if (previousSibling) {
					focusOnInnerWrapper(previousSibling as HTMLElement);
				}
			}
		};

		const mouseDownCaptureListener = (event: Event): void => {
			eventPath.current = [];
			let current: Node | null = event.target as Node;

			do {
				eventPath.current.push(current);
				current = current.parentNode;
			} while (current);
		};

		elementWindow.addEventListener("keydown", keydownListener);
		elementWindow.addEventListener("mousedown", mouseDownListener);
		elementWindow.addEventListener("touchstart", mouseDownListener);
		elementWindow.addEventListener("mousedown", mouseDownCaptureListener, true);
		elementWindow.addEventListener("touchstart", mouseDownCaptureListener, true);

		return (): void => {
			elementWindow.removeEventListener("keydown", keydownListener);
			elementWindow.removeEventListener("mousedown", mouseDownListener);
			elementWindow.removeEventListener("touchstart", mouseDownListener);
			elementWindow.removeEventListener("mousedown", mouseDownCaptureListener, true);
			elementWindow.removeEventListener("touchstart", mouseDownCaptureListener, true);
		};
	}, [closeOnEsc, closeOnOutsideClick, onClickOutside, onClose, portalPlaceHolderElement]);

	const stopClickEvent = useCallback((e: SyntheticEvent): void => e.stopPropagation(), []);

	return (
		portalPlaceHolderElement &&
		createPortal(
			<div
				data-role={DataRoles.Portal}
				className={joinClassNames(portalClassName, baseClassName)}
				ref={currentPortalRef}
			>
				{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
				<div onClick={stopClickEvent}>
					<WidgetsRoot>{children}</WidgetsRoot>
				</div>
			</div>,
			portalPlaceHolderElement
		)
	);
}

Portal.displayName = "Portal";
