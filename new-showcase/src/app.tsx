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

import type { FC, ReactElement } from "react";
import { useState, useCallback, useMemo, useEffect, useTransition } from "react";
import { matchPath, useLocation, useNavigate, Outlet } from "react-router";
import { styled, css } from "styled-components";

import {
	InteractionHintConfigProvider,
	KeyboardNavigationConfigProvider,
	ApplicationFrame,
	SizeContext,
	useWindowSize,
	provider as DeviceDetector,
	A11YLanguageContext,
	getA11yResource
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { SearchItem } from "./helpers/global-search/search-component.js";
import GlobalSearchProvider from "./helpers/global-search/global-search-provider.js";
import { GlobalSearch } from "./helpers/global-search/global-search.view.js";
import type { SiteMapMenuItem } from "./routes.js";
import { SiteMap, Utils } from "./routes.js";
import { disableTouchSupport, getLocalStorage, removeLocalStorage, setLocalStorage } from "./helpers/utils.js";
import { ShowcaseFooter } from "./helpers/showcase-footer.js";
import { Header } from "./helpers/template/header.view.js";
import { Sidebar } from "./helpers/template/sidebar.view.js";
import { useInteractionHintSettings } from "./helpers/use-interaction-hint-settings.js";
import { useKeyboardNavigationSettings } from "./helpers/use-keyboard-navigation-settings.js";
import { ToastProvider } from "./helpers/toast-context.js";

declare const __A12_VERSION__: string;

const StyledShowcaseApplicationFrame = styled(ApplicationFrame)<{ $isRenderingNotFoundPage: boolean }>(({
	$isRenderingNotFoundPage
}) => {
	return css`
		font-family: "Roboto", sans-serif;
		background: ${$isRenderingNotFoundPage
			? "none"
			: "linear-gradient(90deg, rgba(247, 247, 247, 1) 0%, rgba(253, 253, 253, 1) 45%, rgba(255, 255, 255, 1) 100%)"};

		@media screen and (max-width: ${({ theme }) => theme.applicationStyles.responsive.mobileMaxWidth}) {
			position: relative;
		}
	`;
});

export const App: FC = (): ReactElement => {
	const subExpandedLocal = getLocalStorage("subExpanded");
	const location = useLocation();
	const navigate = useNavigate();
	const [, startTransition] = useTransition();
	const [isRenderingNotFoundPage, setIsRenderingNotFoundPage] = useState(false);

	const [subExpanded, setSubExpanded] = useState<boolean>(
		subExpandedLocal ? JSON.parse(subExpandedLocal) : DeviceDetector.isDesktop()
	);
	const [showMainMenu, setShowMainMenu] = useState(false);
	const [a11yLanguage, setA11yLanguage] = useState(() => getLocalStorage("a11yLanguage") ?? "en");
	const interactionHintSettings = useInteractionHintSettings();
	const keyboardNavigationSettings = useKeyboardNavigationSettings();

	const { breakPoint } = useWindowSize();

	const isActive = useCallback(
		(item: SiteMapMenuItem): boolean => {
			return matchPath({ path: item.path, end: false }, location.pathname) !== null;
		},
		[location.pathname]
	);

	const isSmallSize = breakPoint.size === "sm" || breakPoint.size === "xs";

	const isApplicationFrame = useMemo((): boolean => {
		return location.pathname === "/";
	}, [location.pathname]);

	const handleSubMenuClick = useCallback(
		(item: SiteMapMenuItem): void => {
			if (item.fullScreen) {
				window.open(`#/fullscreen${item.path}`);
			} else {
				startTransition(() => navigate(item.path));
			}

			setSubExpanded(isSmallSize || DeviceDetector.isTablet() ? false : subExpanded);
			setShowMainMenu(isSmallSize ? false : showMainMenu);
		},
		[isSmallSize, navigate, startTransition, showMainMenu, subExpanded]
	);

	const getSubMenuEntries = useCallback(
		(items: SiteMapMenuItem[]): SiteMapMenuItem[] => {
			return items.map((item: SiteMapMenuItem) => {
				if (Utils.isShowcase(item)) {
					return {
						...item,
						selected: isActive(item),
						onClick: () => handleSubMenuClick(item)
					};
				} else {
					return {
						...item,
						selected: isActive(item),
						children: getSubMenuEntries(item.children)
					};
				}
			});
		},
		[handleSubMenuClick, isActive]
	);

	const prettifyPathName = useCallback((str: string): string => {
		return str.replace(/(-|^)([^-]?)/g, (_, prep, letter) => {
			return (prep && " ") + letter.toUpperCase();
		});
	}, []);

	const getPageTitle = useMemo((): string => {
		const lastPathName = location.pathname.split("/").pop();

		return (lastPathName ? `${prettifyPathName(lastPathName)} - ` : "") + "Widgets Showcase";
	}, [location.pathname, prettifyPathName]);

	const handleMainMenuClick = useCallback(
		(item: SiteMapMenuItem): void => {
			startTransition(() => navigate(getDeepestLeafPath(item)));
			setShowMainMenu(DeviceDetector.isPhone() ? false : showMainMenu);
		},
		[navigate, startTransition, showMainMenu]
	);

	const handleHamburgerClick = useCallback((): void => {
		setShowMainMenu((prevState) => !prevState);
	}, []);

	const handleExpansionChange = useCallback(
		(expanded?: boolean): void => {
			if (subExpanded !== expanded) {
				setSubExpanded(!!expanded);
				setLocalStorage("subExpanded", JSON.stringify(!!expanded));
			}
		},
		[subExpanded]
	);

	const mainMenuEntries = useMemo(
		() => [
			...SiteMap.map((item) => ({
				...item,
				children: undefined,
				selected: isActive(item),
				onClick: () => {
					handleMainMenuClick(item);
				}
			}))
		],
		[handleMainMenuClick, isActive]
	);

	const mainMenuWithSubEntries = useMemo(
		() => [
			...SiteMap.map((item) => ({
				...item,
				children: item.children ? getSubMenuEntries(item.children) : undefined,
				selected: isActive(item)
			}))
		],
		[getSubMenuEntries, isActive]
	);

	const handleSearchItemClick = useCallback(
		(item: SearchItem): void => {
			if (location.pathname !== item.link) {
				startTransition(() => navigate(item.link));
			}

			setShowMainMenu(isSmallSize ? false : showMainMenu);
		},
		[startTransition, isSmallSize, location.pathname, navigate, showMainMenu]
	);

	const selectedMainMenu = useMemo(() => SiteMap.find((item) => isActive(item)) || SiteMap[0], [isActive]);
	const subMenuEntries = useMemo(
		() => (selectedMainMenu && selectedMainMenu.children ? getSubMenuEntries(selectedMainMenu.children) : undefined),
		[getSubMenuEntries, selectedMainMenu]
	);
	useEffect(() => {
		document.title = getPageTitle;
		setIsRenderingNotFoundPage(document.getElementById("not-found-page") !== null);
	}, [getPageTitle, location.pathname]);

	return (
		<SizeContext.Provider value={{ currentSize: breakPoint.size }}>
			<A11YLanguageContext.Provider value={getA11yResource(a11yLanguage)}>
				<InteractionHintConfigProvider {...interactionHintSettings}>
					<KeyboardNavigationConfigProvider mode={keyboardNavigationSettings.mode}>
						<GlobalSearchProvider onItemClick={handleSearchItemClick}>
							<ToastProvider>
								<StyledShowcaseApplicationFrame
									$isRenderingNotFoundPage={isRenderingNotFoundPage}
									main={
										<Header
											a12Version={__A12_VERSION__}
											menuItems={isSmallSize ? mainMenuWithSubEntries : mainMenuEntries}
											onTouchSupportToggle={handleTouchSupportToggle}
											touchSupport={getTouchSupport()}
											onA11yLanguageChange={setA11yLanguage}
											windowSize={breakPoint.size}
											onHamburgerClick={handleHamburgerClick}
											expanded={showMainMenu}
											interactionHintSettings={interactionHintSettings}
											keyboardNavigationSettings={keyboardNavigationSettings}
										/>
									}
									sub={
										subMenuEntries &&
										location.pathname !== "/" &&
										!isRenderingNotFoundPage &&
										!isSmallSize && <Sidebar expanded={subExpanded} menuItems={subMenuEntries} />
									}
									disableCollapsingSub={DeviceDetector.isDesktop()}
									content={isSmallSize && showMainMenu ? undefined : <Outlet />}
									subExpanded={subExpanded}
									onExpansionChange={handleExpansionChange}
									footer={isApplicationFrame && !(isSmallSize && showMainMenu) && <ShowcaseFooter />}
									htmlAttributes={{
										contentAttributes: showMainMenu && isSmallSize ? { "aria-hidden": true } : undefined,
										footerAttributes: showMainMenu && isSmallSize ? { "aria-hidden": true } : undefined
									}}
									stickyFooter={false}
								/>
								<GlobalSearch />
							</ToastProvider>
						</GlobalSearchProvider>
					</KeyboardNavigationConfigProvider>
				</InteractionHintConfigProvider>
			</A11YLanguageContext.Provider>
		</SizeContext.Provider>
	);
};

function handleTouchSupportToggle(): void {
	const touchSupport = getTouchSupport();

	setLocalStorage("touchSupport", JSON.stringify(!touchSupport));
	window.location.reload();
}

function getDeepestLeafPath(item: SiteMapMenuItem): string {
	if (Utils.isShowcase(item)) {
		return item.path;
	}

	return getDeepestLeafPath(item.children[0]);
}

function getTouchSupport(): boolean {
	const storedValue = getLocalStorage("touchSupport");
	const touchSupport = storedValue !== null ? JSON.parse(storedValue) : DeviceDetector.hasTouch();

	if (!touchSupport) {
		removeLocalStorage("touchSupport");
		disableTouchSupport();
	}

	return touchSupport;
}
