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

import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";
import { useCallback } from "react";
import { Key } from "ts-key-enum";

import { getAllFocusableElements, getNextWrappedIndex } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import type { KeyboardNavigationMode } from "../../keyboard-navigation/main/keyboard-navigation.api.js";

import type { PopUpMenuCloseReason } from "./pop-up-menu.api.js";

interface ClosePopupOptions {
	closeReason: PopUpMenuCloseReason;
	shouldFocusBackWhenClick?: boolean;
}

interface UsePopupMenuKeyboardParams {
	popupMenuRef: RefObject<HTMLElement | null>;
	closePopup: (options: ClosePopupOptions) => void;
	keyboardNavMode: KeyboardNavigationMode | undefined;
}

interface UsePopupMenuKeyboardReturn {
	handlePopUpKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void;
}

export const usePopupMenuKeyboard = ({
	popupMenuRef,
	closePopup,
	keyboardNavMode
}: UsePopupMenuKeyboardParams): UsePopupMenuKeyboardReturn => {
	const getNavigablePopupItems = useCallback((): HTMLElement[] => {
		const container = popupMenuRef.current;

		if (!container) {
			return [];
		}

		return Array.from(getAllFocusableElements(container)).filter((el) => el.getAttribute("aria-disabled") !== "true");
	}, [popupMenuRef]);

	const handlePopUpKeyDown = useCallback(
		(event: ReactKeyboardEvent<HTMLElement>): void => {
			if (event.key === Key.ArrowDown || event.key === Key.ArrowUp) {
				if (event.target === popupMenuRef.current) {
					const hasTabPanel = !!popupMenuRef.current?.querySelector(`[data-role="${DataRoles.TabPanel.Tab}"]`);

					if (hasTabPanel) {
						return;
					}
				}

				event.preventDefault();
				event.stopPropagation();
				const items = getNavigablePopupItems();

				if (items.length === 0) {
					return;
				}

				const currentIndex = items.indexOf(event.target as HTMLElement);
				const direction = event.key === Key.ArrowDown ? "forward" : "backward";
				items[getNextWrappedIndex(currentIndex, items.length, direction)]?.focus();

				return;
			}

			// Tab and Shift+Tab in arrow-only mode: close popup and return focus to trigger button
			if (event.key === Key.Tab && keyboardNavMode === "arrow-only") {
				event.preventDefault();
				closePopup({ closeReason: "onTab", shouldFocusBackWhenClick: false });

				return;
			}

			if (event.key === Key.Enter) {
				const eventTarget = event.target as HTMLElement;
				const eventTargetDataRole = eventTarget.getAttribute("data-role");

				if (
					eventTarget !== popupMenuRef.current &&
					eventTargetDataRole !== DataRoles.List.Item.Content &&
					eventTargetDataRole !== DataRoles.TabPanel.Tab
				) {
					return;
				}

				event.stopPropagation();
				event.preventDefault();
				closePopup({ closeReason: "onItemClick", shouldFocusBackWhenClick: false });
			}
		},
		[popupMenuRef, closePopup, keyboardNavMode, getNavigablePopupItems]
	);

	return { handlePopUpKeyDown };
};
