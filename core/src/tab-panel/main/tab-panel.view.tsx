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
import { Fragment, useCallback, useContext, useEffect, useMemo, useRef } from "react";
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
	StyledGroupDivider,
	StyledSubGroupLabel,
	StyledSubMenuPopup,
	StyledSubTabListTriggerButton,
	StyledSubTabPanelTabs,
	StyledTabGroup,
	StyledTabGroupList,
	StyledTabPanelPanel,
	StyledTabPanelTabs,
	StyledTabPanelWrapper
} from "./tab-panel.styled.js";
import { useAdaptTabPanelResponsive, useSubMenuKeyPressHandle } from "./tab-panel.hook.js";
import { filterGroupedTabs, flattenTabs, isGroupedTabList } from "./tab-panel.utils.js";

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

	const isHorizontalMenu = orientation === "horizontal";
	const shouldFocusOnPanel = focusOnPanelAfterSelect && Boolean(children);

	const groupedTabs = isGroupedTabList(tabs) ? tabs : null;
	const isGrouped = groupedTabs !== null;
	const flatTabs: TabPanelTemplateProps.TabProps[] = useMemo(() => flattenTabs(tabs), [tabs]);

	const { hintRenderer } = useInteractionHint({
		title: tabPanelTitles?.condensedTabTitle,
		componentKey: "tabPanel",
		referenceElementRef: tabPanelAnchorRef
	});

	const selectedTab = flatTabs.find((tab) => (value ? tab.value === value : tab.selected));

	const [showSubPanel, setShowSubPanel] = useStateWithCallback(false);

	const { mainTabs, subTabs, isCounting } = useAdaptTabPanelResponsive({
		tabs: flatTabs,
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
		orientation
	});

	useSubMenuKeyPressHandle({
		elementRef: subTabListRef,
		allowAllDirections: isHorizontalMenu,
		navigationKey: "tabPanelSubTablist"
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
	 * Handles the visibility change of the sub menu.
	 */
	const handleSubMenuVisibilityChange = useCallback(
		(isVisible: boolean): void => {
			setShowSubPanel(isVisible);
		},
		[setShowSubPanel]
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
	const interactiveSubTab = subTabs.find((t) => !t.disabled);

	const renderCondensedTab = (isEntryPoint = false): ReactElement => {
		const condensedTab = (
			<StyledCondensedTab
				value=""
				id={id && `${id}-condensed-tab`}
				selected={isCondensedTabSelected}
				wrapperRef={getSubMenuTriggerElementWrapperRef}
				tabIndex={isCondensedTabSelected || isEntryPoint ? 0 : -1}
				onClick={handleCondensedTabClick}
				orientation={orientation}
			>
				{renderSubTabList()}
			</StyledCondensedTab>
		);

		return (
			<Fragment key="condensed-tab">
				{isGrouped ? (
					<StyledTabGroup role="presentation" data-role={DataRoles.TabPanel.Group} $orientation={orientation}>
						<StyledTabGroupList role="tablist" aria-orientation={orientation} $orientation={orientation}>
							{condensedTab}
						</StyledTabGroupList>
					</StyledTabGroup>
				) : (
					condensedTab
				)}
				{!showSubPanel && hintRenderer?.()}
			</Fragment>
		);
	};

	const renderSubTab = (tab: TabPanelTemplateProps.TabProps, isMobile: boolean): ReactElement => (
		<TabPanelTemplate.Tab
			{...tab}
			mobileSubListLayout={isMobile && isGrouped}
			selected={tab.value === selectedTab?.value}
			onClick={(event: SyntheticEvent<HTMLElement>): void => handleTabClick(event, tab, false)}
			key={tab.value}
			ariaControls={id ? `${id}-panel` : undefined}
			tabIndex={tab === interactiveSubTab ? 0 : -1}
			orientation="vertical"
		>
			{isMobile && tab.label ? tab.label : tab.children}
		</TabPanelTemplate.Tab>
	);

	const renderSubTabListContent = (): ReactElement[] => {
		const isMobile = DeviceDetector.isPhone();

		if (!isGrouped) {
			return subTabs.map((tab: TabPanelTemplateProps.TabProps) => renderSubTab(tab, isMobile));
		}

		const subGroups = filterGroupedTabs(subTabs, groupedTabs!);
		const firstSubTab = subTabs[0];

		// A sub-group is "new" (not split across main/sub lists) when none of its tabs appear in the main tab list.
		// In that case a leading divider must be rendered before it in the sub list.
		const groupOfFirstSubTab =
			firstSubTab !== undefined
				? groupedTabs.find((g) => g.tabs.some((t) => t.value === firstSubTab.value))
				: undefined;
		const firstSubGroupIsNew =
			groupOfFirstSubTab !== undefined &&
			!mainTabs.some((mainTab) => groupOfFirstSubTab.tabs.some((t) => t.value === mainTab.value));

		return subGroups.map((group, i) => (
			<Fragment key={group.id ?? `sub-group-${i}`}>
				{!isMobile && (i > 0 || firstSubGroupIsNew) && (
					<StyledGroupDivider
						role="separator"
						aria-orientation="horizontal"
						data-role={DataRoles.TabPanel.Group.Divider}
					/>
				)}
				<StyledTabGroup role="presentation" data-role={DataRoles.TabPanel.Group} $orientation="vertical">
					{isMobile && (
						<StyledSubGroupLabel role="heading" aria-level={2} data-role={DataRoles.TabPanel.SubGroupLabel}>
							{group.groupLabel}
						</StyledSubGroupLabel>
					)}
					<StyledTabGroupList
						role="tablist"
						aria-label={group.ariaLabel ?? group.groupLabel}
						aria-orientation="vertical"
						data-role={DataRoles.TabPanel.Group.TabList}
						$orientation="vertical"
					>
						{group.tabs.map((tab) => renderSubTab(tab, isMobile))}
					</StyledTabGroupList>
				</StyledTabGroup>
			</Fragment>
		));
	};

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
					<StyledSubTabPanelTabs
						role={isGrouped ? "none" : "tablist"}
						data-role={DataRoles.TabPanel.SubTabList}
						wrapperRef={getSubTabListRef}
					>
						{renderSubTabListContent()}
					</StyledSubTabPanelTabs>
				</StyledSubMenuPopup>
			</PopupMenuConfigContext.Provider>
		);
	};

	const renderGroupedMainTabList = (): ReactElement => {
		const visibleGroups = filterGroupedTabs(mainTabs, groupedTabs!);
		const selectedMainTab = mainTabs.find((t) => t.value === selectedTab?.value);
		const noTabSelected = !selectedMainTab && !isCondensedTabSelected;
		const firstEnabledTab = visibleGroups.flatMap((g) => g.tabs).find((t) => !t.disabled);
		// If all visible main tabs are disabled and nothing is selected, the condensed tab becomes the entry point
		const isCondensedTabEntryPoint = firstEnabledTab === undefined && noTabSelected && subTabs.length > 0;

		const entryTabValue = selectedMainTab?.value ?? (noTabSelected ? firstEnabledTab?.value : undefined);

		return (
			<StyledTabPanelTabs
				ref={tabListRef}
				role="group"
				className={`${TAB_PANEL_CLASS_NAME}__tabs`}
				data-role={DataRoles.TabPanel.TabList}
				aria-label={tabListAriaLabel ?? tabPanelTitles?.tabListAriaLabel}
				$orientation={orientation}
			>
				{visibleGroups.map((group, i) => {
					return (
						<Fragment key={group.id ?? `group-${i}`}>
							{i > 0 && (
								<StyledGroupDivider
									data-role={DataRoles.TabPanel.Group.Divider}
									role="separator"
									aria-orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
									$orientation={orientation}
								/>
							)}
							<StyledTabGroup role="presentation" data-role={DataRoles.TabPanel.Group} $orientation={orientation}>
								<StyledTabGroupList
									role="tablist"
									aria-label={group.ariaLabel ?? group.groupLabel}
									aria-orientation={orientation}
									data-role={DataRoles.TabPanel.Group.TabList}
									$orientation={orientation}
								>
									{group.tabs.map((tab) => (
										<TabPanelTemplate.Tab
											{...tab}
											selected={tab.value === selectedTab?.value}
											onClick={(event: SyntheticEvent<HTMLElement>): void => handleTabClick(event, tab)}
											key={tab.value}
											ariaControls={id ? `${id}-panel` : undefined}
											tabIndex={tab.value === entryTabValue ? 0 : -1}
											orientation={orientation}
										/>
									))}
								</StyledTabGroupList>
							</StyledTabGroup>
						</Fragment>
					);
				})}
				{subTabs.length > 0 && renderCondensedTab(isCondensedTabEntryPoint)}
			</StyledTabPanelTabs>
		);
	};

	const renderMainTabList = (): ReactElement => {
		if (isGrouped) {
			return renderGroupedMainTabList();
		}

		const noTabSelected = mainTabs.every((tab) => tab.value !== selectedTab?.value) && !isCondensedTabSelected;
		const firstEnabledIndex = mainTabs.findIndex((t) => !t.disabled);
		// When all main tabs are disabled and nothing is selected, the condensed tab becomes the entry point
		const isCondensedTabEntryPoint = firstEnabledIndex === -1 && noTabSelected && subTabs.length > 0;

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
					const isFirstEnabledElementAllowTab = index === firstEnabledIndex && noTabSelected;

					return (
						<TabPanelTemplate.Tab
							{...tab}
							selected={isTabSelected}
							onClick={(event): void => handleTabClick(event, tab)}
							key={tab.value}
							ariaControls={id ? `${id}-panel` : undefined}
							tabIndex={isTabSelected || isFirstEnabledElementAllowTab ? 0 : -1}
							orientation={orientation}
						/>
					);
				})}
				{subTabs.length > 0 && renderCondensedTab(isCondensedTabEntryPoint)}
			</StyledTabPanelTabs>
		);
	};

	const getCondensedTabShadowRef = (element: HTMLLIElement | null): void => {
		condensedTabShadowRef.current = element;
	};

	// The MainTabListShadow is used to store the size of the tab panel when rendering all items in the main tab and will be hidden from the UI
	const renderMainTabListShadow = (): ReactElement => {
		if (isGrouped) {
			return (
				<StyledTabPanelTabs aria-hidden={true} $isShadow={true} ref={mainTabListShadowRef} $orientation={orientation}>
					{groupedTabs.map((group, i) => (
						<Fragment key={group.id ?? `shadow-group-${i}`}>
							{i > 0 && <StyledGroupDivider $orientation={orientation} />}
							<StyledTabGroup $orientation={orientation}>
								<StyledTabGroupList $orientation={orientation}>
									{group.tabs.map((tab) => (
										<TabPanelTemplate.Tab
											{...tab}
											key={tab.value}
											orientation={orientation}
											aria-hidden={true}
											title={undefined}
											id={undefined}
										/>
									))}
								</StyledTabGroupList>
							</StyledTabGroup>
						</Fragment>
					))}
					<StyledCondensedTab value="" wrapperRef={getCondensedTabShadowRef} orientation={orientation} />
				</StyledTabPanelTabs>
			);
		}

		return (
			<StyledTabPanelTabs aria-hidden={true} $isShadow={true} ref={mainTabListShadowRef} $orientation={orientation}>
				{flatTabs.map((tab) => (
					<TabPanelTemplate.Tab
						{...tab}
						key={tab.value}
						orientation={orientation}
						aria-hidden={true}
						title={undefined}
						id={undefined}
					/>
				))}
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
