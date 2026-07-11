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

import { CSSTransition } from "react-transition-group";
import type { FC, SyntheticEvent, MouseEvent, ReactNode, ReactElement } from "react";
import { cloneElement, isValidElement, useCallback, useContext, useEffect, useRef, Children } from "react";
import { Key } from "ts-key-enum";

import { addPrefix, getParentElement, joinClassNames, Key as CustomKey } from "../../common/main/utils.js";
import type { Orientation } from "../../common/main/alignment.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import type { ButtonProps } from "../../button/main/button.api.js";
import { Button } from "../../button/main/button.view.js";
import { Icon } from "../../icon/main/icon.view.js";
import { useIsMount, useStateWithCallback } from "../../common/main/hooks.js";
import { TabSandbox } from "../../common/main/tab-sandbox.view.js";
import { provider } from "../../common/main/device-detector.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { AttachedPortal } from "../../attached-portal/main/attached-portal.view.js";
import { List } from "../../list/main/list.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { useKeyboardNavigationMode } from "../../keyboard-navigation/main/keyboard-navigation-context.js";

import type { PopUpMenuCloseReason, PopUpMenuProps } from "./pop-up-menu.api.js";
import {
	StyledPopup,
	StyledPopupMenu,
	StyledPopupMenuHeader,
	StyledPopupMenuHeaderWrapper,
	StyledPopupMenuWrapper
} from "./popup-menu.styled.js";
import { PopupMenuConfigContext } from "./popup-menu-context.js";
import { StyledPopupMenuModalOverlay } from "./popup-menu-overlay.styled.js";
import { PopupMenuLegacyButtons } from "./popup-menu-legacy.view.js";
import { usePopupMenuFocus } from "./use-popup-menu-focus.js";
import { usePopupMenuKeyboard } from "./use-popup-menu-keyboard.js";

const baseClassName = addPrefix("popup");

export const PopUpMenu: FC<PopUpMenuProps> = ({
	focusOnTriggerElementAfterClose = true,
	closeOnOutsideClick: closeMenuWhenClickOutside,
	closeOnEsc = true,
	focusOnOpen = true,
	headerTitle,
	...rest
}) => {
	const a11yContext = useContext(A11YLanguageContext);
	const { enableA11YMobileDesign, renderTriggerElementAttributes, renderTriggerElementChildren } =
		useContext(PopupMenuConfigContext);
	const [showPopUpList, setShowPopUpList] = useStateWithCallback(false);
	const keyboardNavMode = useKeyboardNavigationMode("popUpMenu");

	const buttonTriggerRef = useRef<HTMLElement | null>(null);
	const buttonTriggerDataRoleRef = useRef<string | null>(null);
	const popupMenuRef = useRef<HTMLElement | null>(null);
	const wrapperRef = useRef<HTMLElement | null>(null);
	const hiddenTextRef = useRef<HTMLElement | null>(null);

	const isDesktop = provider.isDesktop();
	const isMobile = provider.isPhone();
	const closeOnOutsideClick = closeMenuWhenClickOutside ?? (isDesktop || !enableA11YMobileDesign || !headerTitle);
	const orientations: Orientation[] = ["bottom-start", "bottom-end", "top-start", "top-end"];
	const transitionTime = 400;

	const {
		htmlTag,
		icon,
		close,
		dataRole: dataRoleProp,
		disabled,
		children: childrenProp,
		style,
		id,
		className: classNameProp,
		onVisibilityChange,
		onTriggerElementClick,
		wrapperRef: wrapperRefProp,
		triggerElementRef,
		triggerElement,
		portalClassName,
		orientation,
		triggerButtonTitle,
		isInResponsiveGroupButton,
		popupListAttributes,
		triggerButtonCloseTitle,
		menuClassName
	} = rest;

	const { handleTransitionExited, handlePreCloseFocus, handlePostCloseFocus } = usePopupMenuFocus({
		buttonTriggerRef,
		wrapperRef,
		popupMenuRef,
		hiddenTextRef,
		focusOnOpen,
		showPopUpList
	});

	const shouldFocusTriggerAfterClose = useCallback(
		(reason: PopUpMenuCloseReason): boolean => {
			if (typeof focusOnTriggerElementAfterClose === "object") {
				return focusOnTriggerElementAfterClose[reason] ?? true;
			}

			// ESC and SPACE keep the existing behavior and still restore focus to the trigger element.
			if (focusOnTriggerElementAfterClose === false) {
				return reason === "onEscape" || reason === "onSpace";
			}

			return true;
		},
		[focusOnTriggerElementAfterClose]
	);

	const closePopup = useCallback(
		({
			closeReason,
			shouldFocusBackWhenClick = true
		}: {
			closeReason: PopUpMenuCloseReason;
			shouldFocusBackWhenClick?: boolean;
		}): void => {
			const shouldFocusOnTriggerButton = shouldFocusTriggerAfterClose(closeReason);
			handlePreCloseFocus({ shouldFocusOnTriggerButton, shouldFocusBackWhenClick });

			setShowPopUpList(false, () => handlePostCloseFocus({ shouldFocusOnTriggerButton, shouldFocusBackWhenClick }));
		},
		[handlePreCloseFocus, handlePostCloseFocus, setShowPopUpList, shouldFocusTriggerAfterClose]
	);

	const onPopupClick = (event: SyntheticEvent<HTMLElement>): void => {
		// Do not trigger click event for non-interactive element
		const targetElement = event.target as HTMLElement;
		const isTargetInHeaderWrapper = !!targetElement.closest(`[data-role=${DataRoles.Popup.HeaderWrapper}]`);

		const targetElementDataRole = targetElement.getAttribute("data-role");

		if (
			isTargetInHeaderWrapper ||
			targetElementDataRole === DataRoles.List.SubHeader ||
			targetElement.classList.contains("list-item--non-interactive")
		) {
			return;
		}

		const nonInteractiveParent = getParentElement(
			targetElement,
			(parent) =>
				parent.getAttribute("data-role") === DataRoles.List.SubHeader ||
				parent.classList.contains("list-item--non-interactive")
		);

		if (nonInteractiveParent) {
			return;
		}

		closePopup({ closeReason: "onItemClick", shouldFocusBackWhenClick: false });
	};

	const { handlePopUpKeyDown } = usePopupMenuKeyboard({
		popupMenuRef,
		closePopup,
		keyboardNavMode
	});

	const getWrapperRef = (ref: HTMLDivElement | null): void => {
		wrapperRef.current = ref;
		wrapperRefProp?.(ref);

		if (!buttonTriggerRef.current && wrapperRef.current) {
			buttonTriggerRef.current =
				(wrapperRef.current.querySelector(`[data-role="${buttonTriggerDataRoleRef.current}"]`) as HTMLElement) ||
				(wrapperRef.current.querySelector("button") as HTMLElement);
		}
	};

	const getPopupMenuRef = (ref: HTMLElement | null): void => {
		popupMenuRef.current = ref;
	};

	const getHiddenTextRef = (ref: HTMLElement | null): void => {
		hiddenTextRef.current = ref;
	};

	const closePopUpAndFocusBack = (): void => {
		closePopup({ closeReason: "onCloseButton" });
	};

	const renderItems = (): ReactNode => {
		const a11yTitles = a11yContext.popUpMenuTitles;
		const children = Children.toArray(childrenProp);
		const classNames = joinClassNames(`${baseClassName}-menu`, menuClassName);

		const isUsingNewMenuItem = children.find((item) => {
			if (!isValidElement(item)) {
				return false;
			}

			const itemType = item.type;
			const isList = itemType === List;
			const isStyledComponentFromList =
				typeof itemType !== "string" && "target" in itemType && itemType.target === List;

			return isList || isStyledComponentFromList;
		});

		const isEnableA11Y = enableA11YMobileDesign && !isDesktop;

		const hiddenCloseButton = (
			<HiddenText htmlAttributes={{ onClick: closePopUpAndFocusBack }} htmlTag="button">
				{a11yTitles?.triggerCloseElement}
			</HiddenText>
		);

		/**
		 * Check whether the element has scrollbar or not.
		 */
		const hasScrollbar = (element: HTMLElement | null): { vertical: boolean } => {
			return {
				vertical: element ? element.scrollHeight > element.clientHeight : false
			};
		};

		const popupMenuHeader = (
			<StyledPopupMenuHeaderWrapper data-role={DataRoles.Popup.HeaderWrapper}>
				<StyledPopupMenuHeader role="heading" aria-level={1} data-role={DataRoles.Popup.HeaderTitle}>
					{headerTitle}
				</StyledPopupMenuHeader>
				<Button
					title={a11yTitles?.triggerCloseElement}
					icon={<Icon>close</Icon>}
					dataRole={DataRoles.Popup.CloseButton}
					onClick={closePopUpAndFocusBack}
				/>
			</StyledPopupMenuHeaderWrapper>
		);

		if (isUsingNewMenuItem) {
			return (
				<StyledPopupMenu
					ref={getPopupMenuRef}
					tabIndex={isEnableA11Y ? undefined : 0}
					className={classNames}
					onClick={onPopupClick}
					onKeyDown={handlePopUpKeyDown}
					data-role={DataRoles.Popup.Menu}
					$baseClassName={baseClassName}
					$isMobileOrTablet={!isDesktop && isEnableA11Y}
					$isMobile={isMobile && isEnableA11Y}
					$hasHeader={!!headerTitle && isEnableA11Y}
					$transitionTime={transitionTime}
					$hasVerticalScrollbar={hasScrollbar(popupMenuRef.current).vertical}
				>
					{isEnableA11Y && headerTitle && popupMenuHeader}
					{isEnableA11Y && !headerTitle && <HiddenText>{a11yTitles?.headingTitle}</HiddenText>}
					{!isEnableA11Y && a11yTitles?.focusOnOpenHiddenText && (
						<HiddenText tabIndex={-1} wrapperRef={getHiddenTextRef}>
							{a11yTitles?.focusOnOpenHiddenText}
						</HiddenText>
					)}
					{children}
					{!isDesktop && !enableA11YMobileDesign && (
						<HiddenText htmlAttributes={{ onClick: closePopUpAndFocusBack }} htmlTag="button">
							{a11yTitles?.triggerCloseElement}
						</HiddenText>
					)}
				</StyledPopupMenu>
			);
		}

		/**
		 * Legacy support: Using the deprecated pattern of Button components as direct children.
		 * This is maintained for backward compatibility. New code should use List component instead.
		 */
		return (
			<StyledPopupMenuWrapper
				ref={getPopupMenuRef}
				className={`${baseClassName}__menu`}
				onClick={onPopupClick}
				onKeyDown={handlePopUpKeyDown}
				tabIndex={isEnableA11Y ? undefined : 0}
				as="ul"
				data-role={DataRoles.Popup.Menu}
				$isMobileOrTablet={!isDesktop && isEnableA11Y}
				$isMobile={isMobile && isEnableA11Y}
				$hasHeader={!!headerTitle && isEnableA11Y}
				$baseClassName={baseClassName}
				$transitionTime={transitionTime}
			>
				{!isEnableA11Y && a11yTitles?.focusOnOpenHiddenText && (
					<HiddenText htmlTag="li" tabIndex={-1} wrapperRef={getHiddenTextRef}>
						{a11yTitles?.focusOnOpenHiddenText}
					</HiddenText>
				)}
				{headerTitle && isEnableA11Y && popupMenuHeader}
				{isEnableA11Y && !headerTitle && <HiddenText>{a11yTitles?.headingTitle}</HiddenText>}
				<PopupMenuLegacyButtons isInResponsiveGroupButton={isInResponsiveGroupButton}>
					{children}
				</PopupMenuLegacyButtons>
				{!isDesktop && !enableA11YMobileDesign && (
					<HiddenText htmlTag="li" tabIndex={-1} wrapperRef={getHiddenTextRef}>
						{hiddenCloseButton}
					</HiddenText>
				)}
			</StyledPopupMenuWrapper>
		);
	};

	const getTriggerButtonRef = (ref: HTMLElement | null): void => {
		buttonTriggerRef.current = ref;

		if (triggerElementRef) {
			triggerElementRef(ref);
		}
	};

	const handleTriggerElementClick = (event: MouseEvent<HTMLElement>): void => {
		setShowPopUpList((prevShowPopUpList) => !prevShowPopUpList);
		onTriggerElementClick?.(event);

		// trigger the original onClick handler, so we won't lose the user handler
		if (
			triggerElement &&
			isValidElement<{ onClick: (e: MouseEvent<HTMLElement>) => void }>(triggerElement) &&
			triggerElement.props.onClick
		) {
			triggerElement.props.onClick(event);
		}
	};

	const handleOutsideClick = (): void => {
		if (closeOnOutsideClick) {
			closePopup({ closeReason: "onOutsideClick" });
		}
	};

	const handleVisibilityChange = (showPopUpList: boolean): void => {
		setShowPopUpList(showPopUpList);
	};

	const mounted = useIsMount();

	useEffect(() => {
		if (mounted) {
			onVisibilityChange?.(showPopUpList);
		}
	}, [mounted, onVisibilityChange, showPopUpList]);

	const stopEventPropagation = (event: SyntheticEvent): void => {
		event.stopPropagation();
	};

	const renderingTriggerElement = (): ReactElement => {
		const { popUpMenuTitles } = a11yContext;
		// If the triggerButtonTitle is not provided, the title will be changed based on the showPopUpList state.
		const titleMap = {
			custom: {
				open: triggerButtonTitle,
				close: triggerButtonCloseTitle
			},
			default: {
				open: popUpMenuTitles?.triggerOpenElement,
				close: popUpMenuTitles?.triggerCloseElement
			}
		};

		const popupState = showPopUpList ? "close" : "open";
		const isValidTriggerElement = isValidElement<ButtonProps>(triggerElement);

		const customTriggerTitle = titleMap.custom[popupState];
		const popUpMenuTitle =
			titleMap.custom[popupState] ??
			renderTriggerElementAttributes?.(showPopUpList)?.title ??
			titleMap?.default[popupState];

		if (isValidTriggerElement) {
			const triggerEl = triggerElement;
			const dataRole = triggerEl.props.dataRole ?? DataRoles.Popup.TriggerElement;

			const triggerElementProps = {
				onClick: handleTriggerElementClick,
				disabled: disabled,
				title: triggerEl.props.title ?? popUpMenuTitle,
				...(isDesktop && { "aria-haspopup": true }),
				"aria-expanded": showPopUpList,
				dataRole,
				"data-role": dataRole,
				buttonAttributes: renderTriggerElementAttributes?.(showPopUpList)
			};
			buttonTriggerDataRoleRef.current = dataRole;
			const triggerElementChildren = renderTriggerElementChildren ? (
				<>
					{triggerElement.props.children}
					{renderTriggerElementChildren?.({ title: customTriggerTitle, showPopupList: showPopUpList })}
				</>
			) : (
				triggerElement?.props.children
			);

			return cloneElement(triggerElement, triggerElementProps, triggerElementChildren);
		}

		return (
			<Button
				disabled={disabled}
				buttonRef={getTriggerButtonRef}
				title={popUpMenuTitle}
				onClick={handleTriggerElementClick}
				icon={icon || <Icon>{showPopUpList ? "close" : "more_vert"}</Icon>}
				aria-haspopup={isDesktop ? true : undefined}
				aria-expanded={showPopUpList}
				dataRole={DataRoles.Popup.TriggerElement}
				buttonAttributes={renderTriggerElementAttributes?.(showPopUpList)}
			>
				{renderTriggerElementChildren?.({ title: customTriggerTitle, showPopupList: showPopUpList })}
			</Button>
		);
	};

	useEffect(() => {
		if (close) {
			close(() => closePopup({ closeReason: "onProgrammatic" }));
		}

		const handleKeydown = (event: KeyboardEvent): void => {
			const target = event.target as HTMLElement;
			const a11yDesignOnMobile = isMobile && enableA11YMobileDesign;

			const closeOnSpaceKey =
				event.key === CustomKey.Space &&
				showPopUpList &&
				popupMenuRef.current?.contains(target) &&
				target?.getAttribute("aria-pressed") !== undefined;

			const closeOnEscKey = event.key === Key.Escape && a11yDesignOnMobile;

			if (closeOnSpaceKey || closeOnEscKey) {
				closePopup({ closeReason: closeOnSpaceKey ? "onSpace" : "onEscape", shouldFocusBackWhenClick: false });
			}
		};

		window.addEventListener("keydown", handleKeydown);

		return (): void => {
			window.removeEventListener("keydown", handleKeydown);
		};
	}, [close, closePopup, enableA11YMobileDesign, handleTransitionExited, isMobile, setShowPopUpList, showPopUpList]);

	const className = joinClassNames(baseClassName, classNameProp);

	return (
		<StyledPopup
			id={id}
			className={className}
			style={style}
			ref={getWrapperRef}
			data-role={dataRoleProp || DataRoles.Popup}
			as={htmlTag || "div"}
		>
			{renderingTriggerElement()}
			{buttonTriggerRef.current &&
				(showPopUpList && (isDesktop || !enableA11YMobileDesign) ? (
					<AttachedPortal
						closeOnEsc={closeOnEsc}
						className={portalClassName}
						referenceElement={buttonTriggerRef.current}
						focusOnReferenceElementAfterEsc={shouldFocusTriggerAfterClose("onEscape")}
						orientationList={orientation ? undefined : orientations}
						orientation={orientation}
						closeOnClickReferenceElement={false}
						fixedOrientation
						focusOnOpen={false}
						onMouseOver={stopEventPropagation}
						onMouseLeave={stopEventPropagation}
						onClickOutside={handleOutsideClick}
						onVisibilityChange={handleVisibilityChange}
						htmlAttributes={popupListAttributes}
					>
						<TabSandbox focusOnOpen={false} skipWrapperFocus disableTabTrapping={keyboardNavMode === "arrow-only"}>
							{renderItems()}
						</TabSandbox>
					</AttachedPortal>
				) : (
					<CSSTransition
						in={showPopUpList}
						nodeRef={popupMenuRef}
						timeout={transitionTime}
						classNames={baseClassName}
						unmountOnExit
						onExited={handleTransitionExited}
					>
						<StyledPopupMenuModalOverlay
							fullscreen
							closeOnOutsideClick={!!closeOnOutsideClick}
							onClose={handleOutsideClick}
							focusBack={false}
							closeOnEsc={false}
							$showModalOverlay={showPopUpList}
							$hasOverlay={!!headerTitle}
							$transitionTime={transitionTime}
							htmlAttributes={popupListAttributes}
						>
							{renderItems()}
						</StyledPopupMenuModalOverlay>
					</CSSTransition>
				))}
		</StyledPopup>
	);
};

PopUpMenu.displayName = "PopUpMenu";
