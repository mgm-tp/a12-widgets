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

import { useState, useEffect, useRef, useCallback } from "react";

import { addPrefix, joinClassNames, Throttler } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { StyledContentBoxContext } from "./contentbox.context.js";
import { ContentBoxWithSidePanel } from "./contentbox-with-side-panel.view.js";
import {
	StyledContentBoxHeader,
	StyledContentBox,
	StyledContentBoxContent,
	StyledContentBoxWizardBar
} from "./contentbox.tpl.styled.js";
import type { ContentBoxProps } from "./contentbox.tpl.api.js";
import { HeadingAddonTpl, HeadingTpl } from "./elements/heading.tpl.view.js";
import { TitleTpl } from "./elements/title.tpl.view.js";
import { SubHeadingElements } from "./elements/sub-heading.tpl.view.js";
import { FooterTpl } from "./elements/footer.tpl.view.js";
import {
	BackButtonTpl,
	CloseButtonTpl,
	ActionButtonTpl,
	HeadingActionButtonTpl
} from "./elements/button-action.tpl.view.js";
import { NotificationAreaTpl } from "./elements/notification-area.tpl.view.js";
import { SubtitleTpl } from "./elements/subtitle.tpl.view.js";

const baseClassName = addPrefix("contentbox");

export namespace ContentBoxElements {
	export const Heading = HeadingTpl;

	export const HeadingAddon = HeadingAddonTpl;

	export const NotificationArea = NotificationAreaTpl;

	export const Title = TitleTpl;
	export const Subtitle = SubtitleTpl;
	export const SubHeading = SubHeadingElements.SubHeading;
	export const ActionBar = SubHeadingElements.ActionBar;
	export const SubActionBar = SubHeadingElements.SubActionBar;
	export const ActionBarGroupArea = SubHeadingElements.ActionBarGroupArea;
	export const ActionBarGroup = SubHeadingElements.ActionBarGroup;
	export const ActionBarGroupDivider = SubHeadingElements.ActionBarGroupDivider;
	export const Footer = FooterTpl;
	export const BackButton = BackButtonTpl;
	export const CloseButton = CloseButtonTpl;
	export const ActionButton = ActionButtonTpl;
	export const HeadingActionButton = HeadingActionButtonTpl;
}

const WIZARD_BORDER_WIDTH = 1;

export const ContentBox = (props: ContentBoxProps) => {
	const {
		id,
		children,
		className,
		tile,
		padding = true,
		style,
		heading,
		notificationArea,
		subHeading,
		wizardBar,
		footer,
		embedded,
		wrapperRef,
		tabIndex,
		onKeyDown,
		onFocus,
		onBlur,
		role,
		ariaLabel,
		boxShadow = "default",
		sidePanels,
		contentRef,
		hideWizardBarOnScroll
	} = props;

	const [isWizardCollapsed, setIsWizardCollapsed] = useState(false);

	const wizardRef = useRef<HTMLDivElement | null>(null);
	const contentBoxContentRef = useRef<HTMLDivElement | null>(null);
	const lastScrollPosition = useRef<number | null>(null);
	const originalWizardHeight = useRef<number>(0);

	const scrollHandler = useRef(
		Throttler.create(() => {
			if (wizardRef.current && contentBoxContentRef.current && lastScrollPosition.current !== null) {
				const currentScrollPosition = contentBoxContentRef.current.scrollTop;
				const wizardHeight = originalWizardHeight.current;

				const isAtTop = currentScrollPosition <= 0;
				const isAtBottom =
					currentScrollPosition + contentBoxContentRef.current.offsetHeight + WIZARD_BORDER_WIDTH >=
					contentBoxContentRef.current.scrollHeight;

				if (isAtTop || isAtBottom) {
					lastScrollPosition.current = contentBoxContentRef.current.scrollTop;

					return;
				}

				if (currentScrollPosition !== lastScrollPosition.current) {
					const diff = currentScrollPosition - lastScrollPosition.current;
					const wizardScrollHeight = parseInt(getComputedStyle(wizardRef.current).height || "0", 10);

					if (currentScrollPosition > wizardHeight) {
						if (diff > 0 && !isWizardCollapsed && wizardRef.current.offsetHeight === originalWizardHeight.current) {
							setIsWizardCollapsed(true);
						} else if (diff < 0 && isWizardCollapsed && wizardScrollHeight <= WIZARD_BORDER_WIDTH) {
							setIsWizardCollapsed(false);
						}
					}
				}

				lastScrollPosition.current = contentBoxContentRef.current.scrollTop;
			}
		})
	).current;

	const handleWizardRef = useCallback((ref: HTMLDivElement | null) => {
		wizardRef.current = ref;

		if (ref) {
			originalWizardHeight.current = ref.offsetHeight;
		}
	}, []);

	const handleContentBoxContentRef = useCallback(
		(ref: HTMLDivElement | null) => {
			contentBoxContentRef.current = ref;

			if (contentRef) {
				contentRef(ref);
			}
		},
		[contentRef]
	);

	const shouldContentFocusable = useCallback((): boolean => {
		return (
			tabIndex === undefined &&
			!!contentBoxContentRef.current &&
			contentBoxContentRef.current.scrollHeight - contentBoxContentRef.current.clientHeight > 0
		);
	}, [tabIndex]);

	useEffect(() => {
		const handleLoaded = () => {
			if (wizardRef.current) {
				originalWizardHeight.current = wizardRef.current.offsetHeight;
			}
		};

		window.addEventListener("load", handleLoaded);

		return () => {
			window.removeEventListener("load", handleLoaded);
		};
	}, []);

	useEffect(() => {
		if (hideWizardBarOnScroll && contentBoxContentRef.current) {
			contentBoxContentRef.current.addEventListener("scroll", scrollHandler, true);
			lastScrollPosition.current = contentBoxContentRef.current.scrollTop;

			return () => {
				contentBoxContentRef.current?.removeEventListener("scroll", scrollHandler);
			};
		}

		return undefined;
	}, [hideWizardBarOnScroll, scrollHandler]);

	useEffect(() => {
		if (contentBoxContentRef.current && shouldContentFocusable()) {
			contentBoxContentRef.current.tabIndex = 0;
		}
	}, [shouldContentFocusable]);

	const contentBoxClassName = joinClassNames(
		baseClassName,
		{ [`${baseClassName}--tile`]: tile },
		{ [`${baseClassName}--embedded`]: embedded },
		className
	);

	const contentBoxContentClassName = joinClassNames(`${baseClassName}__content`, {
		[`${baseClassName}__content--initial-padding`]: padding === true
	});

	if (sidePanels) {
		return (
			<ContentBoxWithSidePanel
				{...props}
				sidePanels={sidePanels}
				boxShadow={boxShadow}
				padding={padding}
				contentBoxClassName={contentBoxClassName}
				contentBoxContentClassName={contentBoxContentClassName}
				isWizardCollapsed={isWizardCollapsed}
				handleWizardRef={handleWizardRef}
				handleContentBoxContentRef={handleContentBoxContentRef}
			/>
		);
	}

	return (
		<StyledContentBoxContext.Provider value={{ embedded }}>
			<StyledContentBox
				ref={wrapperRef}
				onKeyDown={onKeyDown}
				onFocus={onFocus}
				onBlur={onBlur}
				id={id}
				className={contentBoxClassName}
				style={style}
				tabIndex={-1}
				data-role={DataRoles.Contentbox}
				role={role}
				aria-label={ariaLabel}
				$boxShadow={boxShadow}
			>
				{(heading || wizardBar || notificationArea || subHeading) && (
					<StyledContentBoxHeader className={`${baseClassName}__header`} data-role={DataRoles.Contentbox.Header}>
						{heading}
						{wizardBar && (
							<StyledContentBoxWizardBar
								className={joinClassNames(`${baseClassName}__wizard-bar`, {
									[`${baseClassName}__wizard-bar--collapsed`]: isWizardCollapsed
								})}
								ref={handleWizardRef}
								data-role={DataRoles.Contentbox.WizardBar}
								collapsed={isWizardCollapsed}
							>
								{wizardBar}
							</StyledContentBoxWizardBar>
						)}
						{notificationArea}
						{subHeading}
					</StyledContentBoxHeader>
				)}
				<StyledContentBoxContent
					className={contentBoxContentClassName}
					style={typeof padding !== "boolean" ? { padding } : undefined}
					ref={handleContentBoxContentRef}
					data-role={DataRoles.Contentbox.Content}
					tabIndex={tabIndex}
					padding={padding}
					$nonFooter={!footer}
				>
					{children}
				</StyledContentBoxContent>
				{footer}
			</StyledContentBox>
		</StyledContentBoxContext.Provider>
	);
};

ContentBox.displayName = "ContentBox";
