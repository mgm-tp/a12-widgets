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

import type { RefObject } from "react";
import { useEffect } from "react";

import {
	getTopActiveModalOverlay,
	getModalOverlayContent,
	resolveFitToParentTabTrapTarget
} from "./modal-overlay.utils.js";

/**
 * Intercepts Tab events from outside the overlay and redirects focus to the
 * appropriate modal content.
 *
 * @internal
 */
export interface UseModalTabTrapParams {
	outerRef: RefObject<HTMLElement | null>;
	innerRef: RefObject<HTMLElement | null>;
	parentRef: RefObject<HTMLElement | null>;
	fitToParent: boolean;
}

/** @internal */
export const useModalTabTrap = ({ outerRef, innerRef, parentRef, fitToParent }: UseModalTabTrapParams): void => {
	useEffect(() => {
		const handleTabTrap = (event: KeyboardEvent): void => {
			if (event.key !== "Tab" || !outerRef.current || !innerRef.current) {
				return;
			}

			if (fitToParent) {
				const focusTarget = resolveFitToParentTabTrapTarget(
					event.target as HTMLElement,
					outerRef.current,
					parentRef.current
				);

				if (!focusTarget) {
					return;
				}

				event.preventDefault();
				focusTarget.focus();
			} else {
				if (
					outerRef.current.getAttribute("aria-hidden") === "true" ||
					outerRef.current.contains(event.target as HTMLElement) ||
					getTopActiveModalOverlay() !== outerRef.current
				) {
					return;
				}

				event.preventDefault();
				getModalOverlayContent(outerRef.current)?.focus();
			}
		};

		window.addEventListener("keydown", handleTabTrap);

		return (): void => {
			window.removeEventListener("keydown", handleTabTrap);
		};
	}, [fitToParent, outerRef, innerRef, parentRef]);
};
