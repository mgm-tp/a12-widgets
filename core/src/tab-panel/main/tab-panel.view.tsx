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

import type { FC, KeyboardEvent, MouseEvent, ReactElement, SyntheticEvent } from "react";
import { useCallback, useContext, useEffect, useRef } from "react";
import { Key } from "ts-key-enum";

import { joinClassNames } from "../../common/main/utils.js";
import { useArrowKeyNavigation, useStateWithCallback } from "../../common/main/hooks.js";
import { provider as DeviceDetector } from "../../common/main/device-detector.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { PopupMenuConfigContext } from "../../pop-up-menu/main/popup-menu-context.js";
import { useInteractionHint } from "../../interaction-hint/main/use-interaction-hint.js";

import { TAB_PANEL_CLASS_NAME, TabPanelTemplate } from "./template/tab-panel.tpl.view.js";
import type { TabPanelProps } from "./tab-panel.api.js";
import type { TabPanelTemplateProps } from "./template/tab-panel.tpl.api.js";
import { BaseTabPanelContent } from "./template/tab-panel.tpl.styled.js";
import {
	StyledCondensedTab,
	StyledSubMenuPopup,
	StyledSubTabListTriggerButton,
	StyledSubTabPanelTabs,
	StyledTabPanelPanel,
	StyledTabPanelTabs,
	StyledTabPanelWrapper
} from "./tab-panel.styled.js";
import { useAdaptTabPanelResponsive, useSubMenuKeyPressHandle } from "./tab-panel.hook.js";

const tabSelector = `[data-role="${DataRoles.TabPanel.Tab}"]`;

export const TabPanel: FC<TabPanelProps> = (props: TabPanelProps): ReactElement => {
	const {
		onSelect,
		wrapperRef,
		value,
		className,
		children,
		header,
		tabs,
		id,
		onClose,
		tabListAriaLabel,
		orientation = "vertical",
		enableA11YMobileDesignOnSubTab = true,
		focusOnPanelAfterSelect = false,
		...rest
	} = props;
	const { tabPanelTitles } = useContext<A11yDefinition>(A11YLanguageContext);

	const tabPanelWrapperRef = useRef<HTMLElement | null>(null);
	const tabListRef = useRef<HTMLUListElement | null>(null);
	const subTabListRef = useRef<HTMLUListElement | null>(null);
	const tabPanelAnchorRef = useRef<HTMLElement | null>(null);
	const tabPanelRef = useRef<HTMLDivElement | null>(null);
	const latestOpenTabRef = useRef<HTMLElement | null>(null);
	const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

	const mainTabListShadowRef = useRef<HTMLUListElement | null>(null);
	const condensedTabShadowRef = useRef<HTMLLIElement | null>(null);

	const openSubPanelRafIdRef = useRef<number | null>(null);

	const isHorizontalMenu = orientation === "horizontal";
	const shouldFocusOnPanel = focusOnPanelAfterSelect && Boolean(children);

	const { hintRenderer } = useInteractionHint({
		title: tabPanelTitles?.condensedTabTitle,
		componentKey: "tabPanel",
		referenceElementRef: tabPanelAnchorRef
	});

	const selectedTab = tabs.find((tab) => (value ? tab.value === value : tab.selected));

	const [showSubPanel, setShowSubPanel] = useStateWithCallback(false);

	const { mainTabs, subTabs, isCounting } = useAdaptTabPanelResponsive({
		tabs,
		tabRef: tabListRef,
		shadowTabRef: mainTabListShadowRef,
		shadowTabAnchorRef: condensedTabShadowRef,
		orientation
	});

	/**
	 * Sets focus to the panel element when `focusOnPanelAfterSelect` is true and the panel becomes available.
	 * Handles cases where the panel is initially hidden and appears only after tab selection.
	 */
	useEffect(() => {
		if (shouldFocusOnPanel) {
			tabPanelRef.current?.focus();
		}
	}, [shouldFocusOnPanel]);

	/**
	 * If the selected tab is undefined, the focus will be set to the previously selected tab.
	 * E.g. When the panel has just closed, the tab is marked as unselected, but the focus will remain on that tab.
	 */
	useEffect(() => {
		if (selectedTab) {
			latestOpenTabRef.current =
				tabListRef.current?.querySelector<HTMLElement>(`[aria-selected='true']${tabSelector}`) ?? null;
		} else if (latestOpenTabRef.current) {
			latestOpenTabRef.current.focus();
		}
	}, [selectedTab]);

	useArrowKeyNavigation({
		elementRef: tabListRef,
		selector: tabSelector,
		orientation: orientation
	});

	useSubMenuKeyPressHandle({
		elementRef: subTabListRef,
		allowAllDirections: isHorizontalMenu
	});

	/**
	 * Handles the click event on a tab.
	 */
	const handleTabClick = useCallback(
		(event: SyntheticEvent<HTMLElement>, tab: TabPanelTemplateProps.TabProps, isMainTab = true) => {
			if (!tab.disabled) {
				onSelect?.(tab);
				tab.onClick?.(event);

				if (shouldFocusOnPanel) {
					tabPanelRef.current?.focus();
				} else if (!isMainTab) {
					tabPanelAnchorRef.current?.focus();
				}
			}
		},
		[onSelect, shouldFocusOnPanel]
	);

	/**
	 * Handles the keydown event on the panel.
	 */
	const handleKeyDownOnPanel = (event: KeyboardEvent<HTMLDivElement>): void => {
		if (event.key === Key.Escape) {
			onClose?.();
		}
	};

	/**
	 * Scrolls the selected sub-tab into view when the sub-panel opens.
	 */
	const scrollSelectedSubTabIntoView = useCallback((): void => {
		const subTabSelectedElement = subTabListRef.current?.querySelector<HTMLElement>(
			`[aria-selected='true']${tabSelector}`
		);

		if (subTabSelectedElement) {
			openSubPanelRafIdRef.current = requestAnimationFrame(() => {
				subTabSelectedElement.scrollIntoView(true);
			});
		}
	}, []);

	/**
	 * Cleans up animation frame when closing the sub-menu.
	 */
	const cleanupSubMenuAnimation = useCallback((): void => {
		if (openSubPanelRafIdRef.current) {
			cancelAnimationFrame(openSubPanelRafIdRef.current);
			openSubPanelRafIdRef.current = null;
		}
	}, []);

	/**
	 * Handles the visibility change of the sub menu.
	 */
	const handleSubMenuVisibilityChange = useCallback(
		(isVisible: boolean): void => {
			setShowSubPanel(isVisible, (isSubPanelVisible) => {
				if (isSubPanelVisible) {
					scrollSelectedSubTabIntoView();
				} else {
					cleanupSubMenuAnimation();
				}
			});
		},
		[setShowSubPanel, scrollSelectedSubTabIntoView, cleanupSubMenuAnimation]
	);

	/**
	 * Gets the ref of the tab panel wrapper.
	 */
	const getWrapperRef = (param: HTMLElement | null): void => {
		tabPanelWrapperRef.current = param;
		wrapperRef?.(param);
	};

	/**
	 * Gets the ref of the sub menu trigger element.
	 */
	const getSubMenuTriggerElementWrapperRef = (element: HTMLElement | null): void => {
		tabPanelAnchorRef.current = element;
	};

	const getSubTabListRef = (el: HTMLUListElement | null): void => {
		subTabListRef.current = el;
	};

	const getTriggerButtonRef = (element: HTMLButtonElement | null): void => {
		triggerButtonRef.current = element;
	};

	const handleCondensedTabClick = (): void => {
		// Clicking CondensedTab will trigger a click event on the popup triggerButton to open/close the submenu
		triggerButtonRef.current?.click();
	};

	const handleTriggerButtonClick = (event: MouseEvent<HTMLElement>): void => {
		// Click trigger button will not trigger click event.preventDefault on StyledCondensedTab
		event.stopPropagation();
	};

	const handleTriggerButtonFocus = useCallback((): void => {
		if (shouldFocusOnPanel) {
			tabPanelRef.current?.focus();
		} else {
			tabPanelAnchorRef.current?.focus();
		}
	}, [shouldFocusOnPanel]);

	const isCondensedTabSelected = !!subTabs.find((el) => el.value === selectedTab?.value);

	const renderSubTabList = (): ReactElement => {
		return (
			<PopupMenuConfigContext.Provider value={{ enableA11YMobileDesign: enableA11YMobileDesignOnSubTab }}>
				<StyledSubMenuPopup
					onVisibilityChange={handleSubMenuVisibilityChange}
					triggerElement={
						<StyledSubTabListTriggerButton
							onClick={handleTriggerButtonClick}
							icon={<Icon>more_horiz</Icon>}
							tabIndex={-1}
							buttonRef={getTriggerButtonRef}
							title={tabPanelTitles?.condensedTabTitle}
							onFocus={handleTriggerButtonFocus}
						/>
					}
					orientation="right-end"
					popupListAttributes={{ "data-role": DataRoles.TabPanel.SubTabList }}
				>
					<StyledSubTabPanelTabs role="tablist" data-role={DataRoles.TabPanel.SubTabList} wrapperRef={getSubTabListRef}>
						{subTabs.map((tab) => {
							return (
								<TabPanelTemplate.Tab
									{...tab}
									selected={tab.value === selectedTab?.value}
									onClick={(event: SyntheticEvent<HTMLElement>): void => handleTabClick(event, tab, false)}
									key={tab.value}
									ariaControls={id ? `${id}-panel` : undefined}
									tabIndex={-1}
									orientation="vertical" // Sub tab's style is always a vertical menu
								/>
							);
						})}
					</StyledSubTabPanelTabs>
				</StyledSubMenuPopup>
			</PopupMenuConfigContext.Provider>
		);
	};

	const renderMainTabList = (): ReactElement => {
		return (
			<StyledTabPanelTabs
				ref={tabListRef}
				className={`${TAB_PANEL_CLASS_NAME}__tabs`}
				role="tablist"
				data-role={DataRoles.TabPanel.TabList}
				aria-label={tabListAriaLabel ?? tabPanelTitles?.tabListAriaLabel}
				aria-orientation={orientation}
				$orientation={orientation}
			>
				{mainTabs.map((tab, index) => {
					const isTabSelected = tab.value === selectedTab?.value;
					const noTabSelected = mainTabs.every((tab) => tab.value !== selectedTab?.value) && !isCondensedTabSelected;
					const isFirstElementAllowTab = index === 0 && noTabSelected;

					return (
						<TabPanelTemplate.Tab
							{...tab}
							selected={isTabSelected}
							onClick={(event): void => handleTabClick(event, tab)}
							key={tab.value}
							ariaControls={id ? `${id}-panel` : undefined}
							tabIndex={isTabSelected || isFirstElementAllowTab ? 0 : -1}
							orientation={orientation}
						/>
					);
				})}
				{subTabs.length > 0 && (
					<>
						<StyledCondensedTab
							value=""
							id={id && `${id}-condensed-tab`}
							selected={isCondensedTabSelected}
							wrapperRef={getSubMenuTriggerElementWrapperRef}
							tabIndex={isCondensedTabSelected ? 0 : -1}
							onClick={handleCondensedTabClick}
							orientation={orientation}
						>
							{renderSubTabList()}
						</StyledCondensedTab>
						{!showSubPanel && hintRenderer?.()}
					</>
				)}
			</StyledTabPanelTabs>
		);
	};

	const getCondensedTabShadowRef = (element: HTMLLIElement | null): void => {
		condensedTabShadowRef.current = element;
	};

	// The MainTabListShadow is used to store the size of the tab panel when rendering all items in the main tab and will be hidden from the UI
	const renderMainTabListShadow = (): ReactElement => {
		return (
			<StyledTabPanelTabs $isShadow={true} ref={mainTabListShadowRef} $orientation={orientation}>
				{tabs.map((tab) => {
					return (
						<TabPanelTemplate.Tab
							{...tab}
							key={tab.value}
							orientation={orientation}
							aria-hidden={true}
							title={undefined}
							id={undefined}
						/>
					);
				})}
				<StyledCondensedTab value="" wrapperRef={getCondensedTabShadowRef} orientation={orientation} />
			</StyledTabPanelTabs>
		);
	};

	return (
		<StyledTabPanelWrapper
			{...rest}
			className={joinClassNames(TAB_PANEL_CLASS_NAME, className)}
			id={id}
			data-role={DataRoles.TabPanel}
			ref={getWrapperRef}
			$orientation={orientation}
		>
			{isCounting && renderMainTabListShadow()}
			{renderMainTabList()}
			{children && (
				<StyledTabPanelPanel
					ref={tabPanelRef}
					className={`${TAB_PANEL_CLASS_NAME}__panel`}
					role={DeviceDetector.isPhone() ? undefined : "tabpanel"}
					aria-labelledby={selectedTab ? selectedTab.id : undefined}
					id={id ? `${id}-panel` : undefined}
					data-role={DataRoles.Panel}
					tabIndex={focusOnPanelAfterSelect ? -1 : undefined}
					onKeyDown={handleKeyDownOnPanel}
				>
					{header}
					<BaseTabPanelContent className={`${TAB_PANEL_CLASS_NAME}__content`} data-role={DataRoles.TabPanel.Content}>
						{children}
					</BaseTabPanelContent>
				</StyledTabPanelPanel>
			)}
		</StyledTabPanelWrapper>
	);
};

TabPanel.displayName = "TabPanel";
