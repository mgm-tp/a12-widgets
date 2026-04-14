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

import type { KeyboardEvent, ReactElement } from "react";
import { useRef, useContext, useCallback, useMemo, useEffect } from "react";
import type { RouterProps } from "react-router";
import { styled, css } from "styled-components";
import { Key } from "ts-key-enum";

import type { SizeDetectorProps, MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	ApplicationHeader,
	StyledApplicationHeaderSlot,
	StyledApplicationHeaderSlotWrapper,
	Button,
	HeaderTrigger,
	Icon,
	List,
	TextOutput,
	PopUpMenu,
	FlyoutMenu,
	SlidingMenu,
	TextField,
	activeAndHover,
	provider as DeviceDetector
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ThemeSelectorHeader } from "../theme-selector-header.js";
import { GlobalSearchContext } from "../global-search/global-search-context.js";
import { getDesktopOperatingSystem } from "../utils.js";
import type { InteractionHintSettingProps } from "../use-interaction-hint-settings.js";

import { DebugInformation } from "./debug-information.view.js";

const isDesktop = DeviceDetector.isDesktop();
const cmdOrCtrlBasedOnOS = getDesktopOperatingSystem() === "MacOS" ? "Cmd" : "Ctrl";
export interface HeaderProps extends RouterProps {
	a12Version: string;
	menuItems: MenuItem[];
	touchSupport?: boolean;
	windowSize?: SizeDetectorProps.Size;
	expanded?: boolean;
	onTouchSupportToggle?(): void;
	onA11yLanguageChange?(locale: string): void;
	onHamburgerClick?(): void;
	interactionHintSettings?: InteractionHintSettingProps;
}

const ShowcaseApplicationHeader = styled(ApplicationHeader)<{ smallView?: boolean }>`
	${StyledApplicationHeaderSlotWrapper} {
		gap: ${({ smallView }) => (smallView ? "4px" : "8px")};
		&:first-child {
			flex: 1;
		}
	}
	${StyledApplicationHeaderSlot} {
		margin-right: 0;
		&:last-child {
			display: flex;
			flex: 1 1 auto;
			flex-direction: column;
			[data-role="menu-content"] {
				justify-content: center;
			}
		}
	}
`;

const ShowcaseLogo = styled.a<{ windowSize?: SizeDetectorProps.Size }>`
	display: flex;
	height: 2.25rem;
	overflow: visible;
	align-items: center;
	img {
		height: ${({ windowSize }) => (windowSize === "xs" || windowSize === "sm" ? "2.25rem" : "3rem")};
		width: auto;
		display: block;
	}
`;

const StyledIcon = styled(Icon)(({ theme }) => {
	const { colors, typography } = theme;

	return css`
		align-items: center;
		color: ${colors.interaction.disabled.colorDark};
		display: flex;
		font-size: ${typography.fontSize.smallFontSize};
	`;
});

const StyledKeyboardShortcutHint = styled.div(({ theme }) => {
	const { colors, typography, spacing } = theme;

	return css`
		border: 1px solid ${colors.divider.color};
		border-radius: 4px;
		color: ${colors.interaction.disabled.colorDark};
		display: flex;
		font-size: ${typography.fontSize.smallFontSize};
		padding: 0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px;
		margin-right: ${spacing.horizontalSpacing.horizWhiteSpacingxs}px;

		span {
			display: inline-block;
			font-size: ${typography.fontSize.smallFontSize}px;
			text-align: center;
			white-space: nowrap;
		}
	`;
});

const StyledGlobalSearchBtn = styled.div(({ theme }) => {
	const { colors } = theme;

	return css`
		cursor: pointer;
		border-radius: 4px;
		width: ${cmdOrCtrlBasedOnOS === "Cmd" ? "160" : "180"}px;
		${activeAndHover(css`
			outline: 2px solid ${colors.interaction.hover.color};
		`)}
		&:focus {
			outline: 2px solid ${colors.interaction.focus.color};
		}
	`;
});

const StyledSearchBtnInput = styled(TextField)(({ theme }) => {
	const { colors, typography } = theme;

	return css`
		outline: 1px solid ${colors.divider.color};
		border-radius: 4px;
		input {
			cursor: pointer;
			&::placeholder {
				font-size: ${typography.fontSize.smallFontSize};
			}
		}
	`;
});

export function Header(props: HeaderProps): ReactElement {
	const searchInputButtonRef = useRef<HTMLDivElement | null>(null);
	const searchInputWrapperRef = useRef<HTMLDivElement | null>(null);
	const searchInputRef = useRef<HTMLDivElement | null>(null);
	const menuElement = useRef<HTMLElement | null>(null);
	const hamburgerElement = useRef<HTMLButtonElement | null>(null);
	const { showModal, isOpen } = useContext(GlobalSearchContext);

	const {
		expanded,
		windowSize,
		menuItems,
		a12Version,
		touchSupport,
		onTouchSupportToggle,
		onA11yLanguageChange,
		onHamburgerClick,
		interactionHintSettings
	} = props;

	const getSearchInputButtonRef = useCallback((ref: HTMLDivElement | null) => {
		searchInputButtonRef.current = ref;
	}, []);

	const getSearchInputRef = useCallback((ref: HTMLDivElement | null) => {
		searchInputRef.current = ref;
	}, []);

	const getSearchInputWrapperRef = useCallback((ref: HTMLDivElement | null) => {
		searchInputWrapperRef.current = ref;
	}, []);

	const setHamburgerRef = (ref: HTMLButtonElement | null): void => {
		hamburgerElement.current = ref;
	};

	const setMenuRef = (ref: HTMLElement | null): void => {
		menuElement.current = ref;
	};

	const handleHamburgerClick = useCallback(() => {
		onHamburgerClick?.();

		if (!expanded) {
			setTimeout(() => menuElement.current?.focus(), 300);
		}
	}, [expanded, onHamburgerClick]);

	const handleSearchInputButtonKeydown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (event.key === Key.Enter) {
				showModal();
			}
		},
		[showModal]
	);

	const isSmallView = useMemo((): boolean => {
		return windowSize === "sm" || windowSize === "xs";
	}, [windowSize]);

	const leftSlots = useMemo(() => {
		return [
			isSmallView && (
				<Button
					icon={<Icon>menu</Icon>}
					onClick={handleHamburgerClick}
					className="nav__trigger"
					buttonRef={setHamburgerRef}
					title="Expand navigation"
				/>
			),
			<ShowcaseLogo
				key="logo"
				className="logo logo--flat"
				href="#/"
				aria-label="logo"
				tabIndex={0}
				windowSize={windowSize}
			>
				<img src="images/Logo-A12-Widgets-Showcase.png" alt="A12 Widgets Showcase" />
			</ShowcaseLogo>,
			!isSmallView && (
				<FlyoutMenu type="horizontal" items={menuItems} key="menu" useAs="main" id="main-application-flyout-menu" />
			)
		];
	}, [handleHamburgerClick, isSmallView, menuItems, windowSize]);

	const rightSlots = useMemo(
		() => [
			<DebugInformation
				touchSupport={touchSupport}
				onTouchSupportToggle={onTouchSupportToggle}
				onA11yLanguageChange={onA11yLanguageChange}
				interactionHintSettings={interactionHintSettings}
			/>,
			(isDesktop && isSmallView) || !isDesktop ? (
				<Button
					icon={<Icon>search</Icon>}
					title={`Search${isDesktop ? ` (${cmdOrCtrlBasedOnOS}+K)` : ""}`}
					id="global-search-button"
					onClick={showModal}
				/>
			) : (
				<StyledGlobalSearchBtn
					id="global-search-button"
					title={`Search${isDesktop ? ` (${cmdOrCtrlBasedOnOS}+K)` : ""}`}
					tabIndex={0}
					ref={getSearchInputButtonRef}
					onClick={showModal}
					onKeyDown={handleSearchInputButtonKeydown}
				>
					<StyledSearchBtnInput
						readonly
						placeholder="Search..."
						prefixes={<Icon title="search">search</Icon>}
						suffixes={
							<StyledKeyboardShortcutHint>
								{cmdOrCtrlBasedOnOS === "Cmd" ? (
									<>
										<StyledIcon size="medium">keyboard_command_key</StyledIcon>
										<span>K</span>
									</>
								) : (
									<span>Ctrl + K</span>
								)}
							</StyledKeyboardShortcutHint>
						}
						inputRef={getSearchInputRef}
						inputWrapperRef={getSearchInputWrapperRef}
					/>
				</StyledGlobalSearchBtn>
			),
			<ThemeSelectorHeader isSmallView={isSmallView} />,
			windowSize === "lg" ? (
				<TextOutput>{a12Version}</TextOutput>
			) : (
				<PopUpMenu
					key="version"
					triggerElement={<HeaderTrigger graphic="info" />}
					headerTitle="App version"
					triggerButtonTitle="Show App version"
					triggerButtonCloseTitle="Hide App version"
				>
					<List paddedRight>
						<List.Item text={a12Version} readonly />
					</List>
				</PopUpMenu>
			)
		],
		[
			a12Version,
			getSearchInputButtonRef,
			getSearchInputRef,
			getSearchInputWrapperRef,
			handleSearchInputButtonKeydown,
			interactionHintSettings,
			isSmallView,
			onA11yLanguageChange,
			onTouchSupportToggle,
			showModal,
			touchSupport,
			windowSize
		]
	);

	useEffect(() => {
		const activeElement = document.activeElement;

		if (!isOpen && (activeElement === searchInputWrapperRef.current || activeElement === searchInputRef.current)) {
			searchInputButtonRef.current?.focus();
		}
	}, [isOpen]);

	return (
		<>
			<ShowcaseApplicationHeader leftSlots={leftSlots} rightSlots={rightSlots} smallView={isSmallView} />
			{isSmallView && (
				<SlidingMenu.MainWrapper expanded={expanded}>
					<SlidingMenu items={menuItems} useAs="main" wrapperRef={setMenuRef} id="main-application-sliding-menu" />
				</SlidingMenu.MainWrapper>
			)}
		</>
	);
}
