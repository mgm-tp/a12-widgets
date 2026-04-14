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

import { useArrowKeyNavigation, useStateWithCallback } from "../../common/main/hooks.js";
import { DataRoles } from "../../common/main/data-roles.js";

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
	const [tabsOnMainPanel, setTabOnMainPanel] = useState<TabPanelTemplateProps.TabProps[]>(tabs);
	const [tabsOnSubPanel, setTabOnSubPanels] = useStateWithCallback<TabPanelTemplateProps.TabProps[]>([]);

	const isHorizontal = orientation === "horizontal";

	const countItemsOnMain = useCallback(() => {
		const tabListShadow = shadowTabRef.current;
		const tabList = tabRef.current;
		const tabPanelAnchorClientRect = shadowTabAnchorRef.current?.getBoundingClientRect();

		if (!tabListShadow || !tabPanelAnchorClientRect || !tabList) {
			return 0;
		}

		if (isHorizontal) {
			// Horizontal: measure widths
			const tabPanelRect = tabListShadow.getBoundingClientRect();
			const tabPanelWidth = tabList.getBoundingClientRect().width;
			const tabPanelItemWidthList = Array.from(tabListShadow.children).map(
				(element) => element.getBoundingClientRect().width
			);

			const firstItemToLeft = tabListShadow.children[0].getBoundingClientRect().left - tabPanelRect.left;
			let mainPanelCountWidth = firstItemToLeft + tabPanelAnchorClientRect.width;
			let mainItemCount = 0;

			while (mainPanelCountWidth <= tabPanelWidth && mainItemCount < tabPanelItemWidthList.length) {
				mainPanelCountWidth += tabPanelItemWidthList[mainItemCount];

				if (mainPanelCountWidth <= tabPanelWidth) {
					mainItemCount++;
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

		// Vertical: measure heights
		const tabPanelItemHeightList = Array.from(tabListShadow.children).map(
			(element) => element.getBoundingClientRect().height
		);

		const tabPanelRect = tabListShadow.getBoundingClientRect();

		const firstItemToTop = tabListShadow.children[0].getBoundingClientRect().top - tabPanelRect.top;

		let mainPanelCountHeight = firstItemToTop + tabPanelAnchorClientRect.height;
		let mainItemCount = 0;
		const tabListHeight = tabList.getBoundingClientRect().height;

		while (mainPanelCountHeight <= tabListHeight) {
			mainPanelCountHeight += tabPanelItemHeightList[mainItemCount];

			if (mainPanelCountHeight <= tabListHeight) {
				mainItemCount++;
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
			const mainItemCount = countItemsOnMain();

			const newTabsOnMainPanel = tabs.slice(0, mainItemCount);
			const newTabsOnSubPanel = tabs.filter((tab) => !newTabsOnMainPanel.includes(tab));

			setTabOnMainPanel(newTabsOnMainPanel);
			setTabOnSubPanels(newTabsOnSubPanel, () => {
				setTabItemCounting(false);
			});
		}
	}, [countItemsOnMain, setTabOnSubPanels, shadowTabRef, tabs]);

	const handleOnResizeChange = useCallback(() => {
		setTabItemCounting(true);
		countingMainAndSubTabs();
	}, [countingMainAndSubTabs]);

	useEffect(() => {
		countingMainAndSubTabs();
	}, [countingMainAndSubTabs]);

	useEffect(() => {
		setTabItemCounting(true);
	}, [tabs]);

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
	allowAllDirections = false
}: {
	elementRef: RefObject<HTMLElement | null>;
	allowAllDirections?: boolean;
}): void => {
	const element = elementRef.current;

	useArrowKeyNavigation({
		elementRef,
		allowAllDirections,
		allowTabNavigation: true
	});

	useEffect(() => {
		const subTabList = element?.closest<HTMLElement>(`[data-role=${DataRoles.TabPanel.SubTabList}]`);

		const handleKeyPressNavigation = (event: KeyboardEvent): void => {
			const subMenuActiveTab = element?.querySelectorAll<HTMLElement>(
				`[data-role=${DataRoles.TabPanel.Tab}]:not([aria-disabled='true'])`
			);

			if (!subMenuActiveTab?.length) {
				return;
			}

			if (event.key === Key.Tab || event.key === Key.ArrowUp || event.key === Key.ArrowDown) {
				event.preventDefault();
			}

			const subMenuSelectedTab = Array.from(subMenuActiveTab ?? []).find(
				(tab) => tab.getAttribute("aria-selected") === "true"
			);

			if (subMenuSelectedTab) {
				subMenuSelectedTab.focus();

				return;
			}

			switch (event.key) {
				case Key.Tab:
					// If tabbing out of the submenu, focus the submenu anchor
					if (event.shiftKey) {
						subMenuActiveTab[subMenuActiveTab.length - 1]?.focus();
					} else {
						subMenuActiveTab[0]?.focus();
					}

					break;
				case Key.ArrowRight:
				case Key.ArrowDown:
					subMenuActiveTab[0]?.focus();
					break;
				case Key.ArrowLeft:
				case Key.ArrowUp:
					subMenuActiveTab[subMenuActiveTab.length - 1]?.focus();
					break;
			}
		};

		const handleKeyDown = (event: KeyboardEvent): void => {
			if (!allowAllDirections && (event.key === Key.ArrowLeft || event.key === Key.ArrowRight)) {
				return;
			}

			switch (event.key) {
				case Key.ArrowUp:
				case Key.ArrowDown:
				case Key.ArrowLeft:
				case Key.ArrowRight:
				case Key.Tab:
					handleKeyPressNavigation(event);
					break;
			}
		};

		subTabList?.addEventListener("keydown", handleKeyDown);

		return (): void => {
			subTabList?.removeEventListener("keydown", handleKeyDown);
		};
	}, [allowAllDirections, element]);
};
