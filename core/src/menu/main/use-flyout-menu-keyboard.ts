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
import { useCallback, useEffect } from "react";
import { Key } from "ts-key-enum";

import { getNextWrappedIndex, findFirstFocusableOutside } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { useKeyboardNavigationMode } from "../../keyboard-navigation/main/keyboard-navigation-context.js";
import type { KeyboardNavigationMode } from "../../keyboard-navigation/main/keyboard-navigation.api.js";

import {
	getNavigableMenuItems,
	initDefaultMenuTabIndex,
	updateMenuRovingTabIndex,
	resetMenuRovingTabIndex
} from "./menu.utils.js";

interface UseFlyoutMenuKeyboardParams {
	menuItemsContainerRef: RefObject<HTMLDivElement | null>;
	type: "horizontal" | "vertical";
	onCloseAllSubMenus?: () => void;
}

interface UseFlyoutMenuKeyboardReturn {
	handleMenuKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void;
	keyboardNavMode: KeyboardNavigationMode;
}

export const useFlyoutMenuKeyboard = ({
	menuItemsContainerRef: domElementRef,
	type,
	onCloseAllSubMenus
}: UseFlyoutMenuKeyboardParams): UseFlyoutMenuKeyboardReturn => {
	const keyboardNavMode = useKeyboardNavigationMode(
		type === "horizontal" ? "horizontalFlyoutMenu" : "verticalFlyoutMenu"
	);

	useEffect(() => {
		if (!domElementRef.current) {
			return;
		}

		if (keyboardNavMode === "arrow-only") {
			resetMenuRovingTabIndex(domElementRef.current);
		} else {
			initDefaultMenuTabIndex(domElementRef.current);
		}
	}, [keyboardNavMode, domElementRef]);

	const handleMenuKeyDown = useCallback(
		(event: ReactKeyboardEvent<HTMLElement>): void => {
			const isHorizontal = type === "horizontal";
			const prevKey = isHorizontal ? Key.ArrowLeft : Key.ArrowUp;
			const nextKey = isHorizontal ? Key.ArrowRight : Key.ArrowDown;

			// When focus is inside an open submenu portal, ArrowDown/ArrowUp navigate within that submenu
			const target = event.target as HTMLElement;
			const portal = target.closest<HTMLElement>(`[data-role="${DataRoles.AttachedPortal}"]`);

			if (portal && (event.key === Key.ArrowDown || event.key === Key.ArrowUp)) {
				event.preventDefault();
				event.stopPropagation();
				const subMenuItems = Array.from(
					portal.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Menu.Item}"][tabindex="0"]`)
				);
				const currentIndex = subMenuItems.indexOf(document.activeElement as HTMLElement);
				const direction = event.key === Key.ArrowDown ? "forward" : "backward";
				subMenuItems[getNextWrappedIndex(currentIndex, subMenuItems.length, direction)]?.focus();

				return;
			}

			if (event.key === prevKey || event.key === nextKey) {
				// If focus is inside a nested submenu and ArrowLeft is pressed in a horizontal menu,
				// let the item-level window handler close only the deepest submenu.
				// Otherwise, stopPropagation here would block that handler.
				if (isHorizontal && event.key === Key.ArrowLeft && portal) {
					const ownerDoc = (event.target as HTMLElement).ownerDocument ?? document;
					const openSubMenus = ownerDoc.querySelectorAll(`[data-role="${DataRoles.SubMenu.Content}"]`);

					if (openSubMenus.length > 1) {
						return;
					}
				}

				event.preventDefault();
				event.stopPropagation();

				const isArrowOnly = keyboardNavMode === "arrow-only";
				const menuItems = domElementRef.current ? getNavigableMenuItems(domElementRef.current, isArrowOnly) : [];
				const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);
				const direction = event.key === nextKey ? "forward" : "backward";
				const newIndex = getNextWrappedIndex(currentIndex, menuItems.length, direction);

				if (isArrowOnly) {
					updateMenuRovingTabIndex(menuItems, newIndex);
				}

				menuItems[newIndex]?.focus();

				return;
			}

			if (keyboardNavMode === "arrow-only" && event.key === Key.Tab && domElementRef.current) {
				const menuRoot =
					domElementRef.current.closest<HTMLElement>(`[data-role="${DataRoles.Menu}"]`) ?? domElementRef.current;

				const exitTarget = findFirstFocusableOutside(menuRoot, event.shiftKey ? "before" : "after");

				if (exitTarget) {
					event.preventDefault();
					exitTarget.focus();
				}

				onCloseAllSubMenus?.();
			}
		},
		[type, keyboardNavMode, domElementRef, onCloseAllSubMenus]
	);

	return { handleMenuKeyDown, keyboardNavMode };
};
