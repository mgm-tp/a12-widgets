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
import { useCallback, useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { Key } from "ts-key-enum";

import { DataRoles } from "../../common/main/data-roles.js";
import { useUpdateEffect } from "../../common/main/hooks.js";
import { type KeyboardNavigationComponentKey, useKeyboardNavigationMode } from "../../keyboard-navigation/index.js";

import type { TabPanelTemplateProps } from "./template/tab-panel.tpl.api.js";
import type { TabPanelOrientation } from "./tab-panel.api.js";

/** @internal */
export const useAdaptTabPanelResponsive = ({
	tabs,
	tabRef,
	shadowTabRef,
	shadowTabAnchorRef,
	orientation
}: {
	tabs: TabPanelTemplateProps.TabProps[];
	tabRef: RefObject<HTMLElement | null>;
	shadowTabRef: RefObject<HTMLElement | null>;
	shadowTabAnchorRef: RefObject<HTMLElement | null>;
	orientation?: TabPanelOrientation;
}): {
	mainTabs: TabPanelTemplateProps.TabProps[];
	subTabs: TabPanelTemplateProps.TabProps[];
	isCounting: boolean;
} => {
	const [tabItemCounting, setTabItemCounting] = useState(true);
	const [mainItemCount, setMainItemCount] = useState(tabs.length);

	const isHorizontal = orientation === "horizontal";
	// Keep the count valid if there are now fewer tabs than before.
	const boundedMainItemCount = Math.min(mainItemCount, tabs.length);
	// Stable key for change detection; `tabs` reference is not stable across rerenders.
	const tabListKey = tabs.map((tab) => `${tab.id}:${tab.value}`).join("|");

	const tabsOnMainPanel = tabs.slice(0, boundedMainItemCount);
	const tabsOnSubPanel = tabs.slice(boundedMainItemCount);

	const countItemsOnMain = useCallback(() => {
		const tabListShadow = shadowTabRef.current;
		const tabList = tabRef.current;
		const tabPanelAnchorClientRect = shadowTabAnchorRef.current?.getBoundingClientRect();

		if (!tabListShadow || !tabPanelAnchorClientRect || !tabList) {
			return 0;
		}

		const shadowRect = tabListShadow.getBoundingClientRect();
		const shadowTabSelector = `[data-role="${DataRoles.TabPanel.Tab}"]`;

		const shadowTabElements = Array.from(tabListShadow.querySelectorAll<HTMLElement>(shadowTabSelector)).filter(
			(el) => el !== shadowTabAnchorRef.current
		);

		if (isHorizontal) {
			// Horizontal: count tabs whose right edge (relative to shadow left) fits within
			// the available width (real tablist width minus the reserved condensed-tab width).
			const tabPanelWidth = tabList.getBoundingClientRect().width;
			const availableWidth = tabPanelWidth - tabPanelAnchorClientRect.width;

			let mainItemCount = 0;

			for (const tab of shadowTabElements) {
				if (tab.getBoundingClientRect().right - shadowRect.left <= availableWidth) {
					mainItemCount++;
				} else {
					break;
				}
			}

			// If all tabs fit, show all tabs
			if (mainItemCount >= tabs.length) {
				return tabs.length;
			}

			// Ensure submenu is not displayed if only one item would be in it
			if (mainItemCount === tabs.length - 1) {
				return tabs.length;
			}

			return mainItemCount;
		}

		// Vertical: count tabs whose bottom edge (relative to shadow top) fits within
		// the available height (real tablist height minus the reserved condensed-tab height).
		const tabListHeight = tabList.getBoundingClientRect().height;
		const availableHeight = tabListHeight - tabPanelAnchorClientRect.height;

		let mainItemCount = 0;

		for (const tab of shadowTabElements) {
			if (tab.getBoundingClientRect().bottom - shadowRect.top <= availableHeight) {
				mainItemCount++;
			} else {
				break;
			}
		}

		// Ensure submenu is not displayed if only one item would be in it
		if (mainItemCount === tabs.length - 1) {
			mainItemCount = tabs.length;
		}

		return mainItemCount;
	}, [shadowTabRef, tabRef, shadowTabAnchorRef, isHorizontal, tabs.length]);

	const countingMainAndSubTabs = useCallback(() => {
		if (shadowTabRef.current) {
			setMainItemCount(countItemsOnMain());
			setTabItemCounting(false);
		}
	}, [countItemsOnMain, shadowTabRef]);

	const handleOnResizeChange = useCallback(() => {
		setTabItemCounting(true);
		countingMainAndSubTabs();
	}, [countingMainAndSubTabs]);

	useEffect(() => {
		if (tabItemCounting) {
			countingMainAndSubTabs();
		}
	}, [countingMainAndSubTabs, tabItemCounting]);

	// Reset counting when tab list identity changes after mount (e.g. tabs added/removed).
	useUpdateEffect(() => {
		setTabItemCounting(true);
	}, [tabListKey]);

	useResizeDetector({
		handleHeight: true,
		handleWidth: true,
		targetRef: tabRef,
		onResize: handleOnResizeChange
	});

	return {
		mainTabs: tabsOnMainPanel,
		subTabs: tabsOnSubPanel,
		isCounting: tabItemCounting
	};
};

/** @internal */
export const useSubMenuKeyPressHandle = ({
	elementRef,
	allowAllDirections = false,
	navigationKey
}: {
	elementRef: RefObject<HTMLElement | null>;
	allowAllDirections?: boolean;
	navigationKey?: KeyboardNavigationComponentKey;
}): void => {
	const element = elementRef.current;
	const keyboardNavMode = useKeyboardNavigationMode(navigationKey);
	const allowTabNavigation = keyboardNavMode === "default";

	useEffect(() => {
		const subTabList = element?.closest<HTMLElement>(`[data-role=${DataRoles.TabPanel.SubTabList}]`);

		const handleKeyDown = (event: KeyboardEvent): void => {
			const isTabKey = event.key === Key.Tab;
			const isArrowKey =
				event.key === Key.ArrowUp ||
				event.key === Key.ArrowDown ||
				event.key === Key.ArrowLeft ||
				event.key === Key.ArrowRight;

			if (!isTabKey && !isArrowKey) {
				return;
			}

			if (!allowTabNavigation && isTabKey) {
				return;
			}

			if (!allowAllDirections && (event.key === Key.ArrowLeft || event.key === Key.ArrowRight)) {
				return;
			}

			const subMenuActiveTab = element?.querySelectorAll<HTMLElement>(
				`[data-role=${DataRoles.TabPanel.Tab}]:not([aria-disabled='true'])`
			);

			if (!subMenuActiveTab?.length) {
				return;
			}

			const activeTabList = Array.from(subMenuActiveTab);
			const isFocusInside = element?.contains(document.activeElement);

			if (!isFocusInside) {
				event.preventDefault();
				event.stopPropagation();

				const subMenuSelectedTab = activeTabList.find((tab) => tab.getAttribute("aria-selected") === "true");

				if (subMenuSelectedTab) {
					subMenuSelectedTab.focus();

					return;
				}

				const isBackward =
					event.key === Key.ArrowUp ||
					event.key === Key.ArrowLeft ||
					(allowTabNavigation && event.key === Key.Tab && event.shiftKey);

				if (isBackward) {
					subMenuActiveTab[subMenuActiveTab.length - 1]?.focus();
				} else {
					subMenuActiveTab[0]?.focus();
				}

				return;
			}

			event.preventDefault();
			event.stopPropagation();

			const focusedIndex = activeTabList.indexOf(document.activeElement as HTMLElement);

			const isBackward =
				event.key === Key.ArrowUp ||
				event.key === Key.ArrowLeft ||
				(allowTabNavigation && event.key === Key.Tab && event.shiftKey);

			if (isBackward) {
				const targetIndex = focusedIndex > 0 ? focusedIndex - 1 : activeTabList.length - 1;
				activeTabList[targetIndex]?.focus();
			} else {
				const targetIndex = focusedIndex < activeTabList.length - 1 ? focusedIndex + 1 : 0;
				activeTabList[targetIndex]?.focus();
			}
		};

		subTabList?.addEventListener("keydown", handleKeyDown);

		return (): void => {
			subTabList?.removeEventListener("keydown", handleKeyDown);
		};
	}, [allowAllDirections, allowTabNavigation, element]);
};
