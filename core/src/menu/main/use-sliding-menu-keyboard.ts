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

import type { KeyboardEvent } from "react";
import { useCallback } from "react";
import { Key } from "ts-key-enum";

import { getNextWrappedIndex, findFirstFocusableOutside, isLastFocusableElement } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import type { KeyboardNavigationMode } from "../../keyboard-navigation/main/keyboard-navigation.api.js";

import type { MenuUtils } from "./menu.internal.js";
import { getNavigableMenuItems, updateMenuRovingTabIndex } from "./menu.utils.js";

export interface SlidingMenuKeyboardOptions {
	menuContainer: HTMLElement | null;
	path: MenuUtils.MenuItemWithChildren[];
	navigateBack: () => void;
	navigateForward: (item: MenuUtils.MenuItemWithChildren) => void;
	onTabOut?: (event: KeyboardEvent<HTMLElement>) => void;
	keyboardNavMode?: KeyboardNavigationMode;
}

interface UseSlidingMenuKeyboardReturn {
	handleSlidingMenuKeyDown: (event: KeyboardEvent<HTMLElement>, options: SlidingMenuKeyboardOptions) => void;
}

export function useSlidingMenuKeyboard(): UseSlidingMenuKeyboardReturn {
	const handleSlidingMenuKeyDown = useCallback(
		(
			event: KeyboardEvent<HTMLElement>,
			{
				menuContainer,
				path,
				navigateBack,
				navigateForward: _navigateForward,
				onTabOut,
				keyboardNavMode
			}: SlidingMenuKeyboardOptions
		): void => {
			const isArrowOnly = keyboardNavMode === "arrow-only";

			if (event.key === Key.ArrowUp || event.key === Key.ArrowDown) {
				const target = event.target as HTMLElement;

				if (target.getAttribute("data-role") !== `${DataRoles.Menu.Item}`) {
					return;
				}

				event.preventDefault();

				if (!menuContainer) {
					return;
				}

				const menuItems = getNavigableMenuItems(menuContainer, isArrowOnly);
				const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);
				const direction = event.key === Key.ArrowDown ? "forward" : "backward";
				const newIndex = getNextWrappedIndex(currentIndex, menuItems.length, direction);

				if (isArrowOnly && newIndex >= 0) {
					updateMenuRovingTabIndex(menuItems, newIndex);
				}

				menuItems[newIndex]?.focus();

				return;
			}

			if (event.key === Key.ArrowRight) {
				event.preventDefault();

				return;
			}

			if (event.key === Key.ArrowLeft) {
				if (path.length > 1) {
					event.preventDefault();
					navigateBack();
				}

				return;
			}

			if (menuContainer && event.key === Key.Tab) {
				if (isArrowOnly) {
					if (!event.shiftKey) {
						onTabOut?.(event);
					}

					const exitTarget = findFirstFocusableOutside(menuContainer, event.shiftKey ? "before" : "after");

					if (exitTarget) {
						event.preventDefault();
						exitTarget.focus();
					}
				} else if (!event.shiftKey && isLastFocusableElement(menuContainer, event.target as HTMLElement)) {
					onTabOut?.(event);
				}
			}
		},
		[]
	);

	return { handleSlidingMenuKeyDown };
}
