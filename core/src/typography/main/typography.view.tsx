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

import type { ReactElement, SyntheticEvent, MouseEvent, TouchEvent, FocusEvent, KeyboardEvent } from "react";
import { useContext, useState, useRef, useMemo, useCallback, Children } from "react";
import { Key } from "ts-key-enum";

import {
	joinClassNames,
	addPrefix,
	getAllFocusableElements,
	getNearestFocusableParent
} from "../../common/main/utils.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { provider } from "../../common/main/device-detector.js";
import { Icon } from "../../icon/main/icon.view.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { HeadlineProps, BodyProps, SectionProps } from "./typography.api.js";
import {
	StyledTypographyAddons,
	StyledTypographyContent,
	StyledTypographyDivider,
	StyledTypographyGraphic,
	StyledTypographyHeadline,
	StyledTypographyWrapper,
	StyledTypographyInfo,
	StyledTypographyTitle,
	StyledTypographyAddon,
	StyledTypographyBody,
	StyledTypographySection,
	StyledTypographyHeaderActions
} from "./typography.styled.js";

const baseClassName = addPrefix("typography");

export namespace Typography {
	export function Section(props: SectionProps): ReactElement<SectionProps> {
		const { children, role, className, ...rest } = props;

		return (
			<StyledTypographySection
				className={joinClassNames(`${baseClassName}-section`, className)}
				data-role={DataRoles.Typography.Section}
				role={role}
				{...rest}
			>
				{children}
			</StyledTypographySection>
		);
	}

	export function Headline(props: HeadlineProps): ReactElement<HeadlineProps> {
		const context = useContext(A11YLanguageContext);

		const [isAddonHoveredOrTouched, setAddonHoveredOrTouched] = useState(false);
		const [isAddonFocused, setAddonFocused] = useState(false);
		const titleRef = useRef<HTMLDivElement | null>(null);
		const addonWrapperRef = useRef<HTMLDivElement | null>(null);
		const {
			color,
			level,
			ariaLevel,
			htmlTag,
			expandIcon,
			collapseIcon,
			divider,
			alignment,
			collapsible,
			collapsed,
			onCollapsingChange,
			style,
			className,
			children,
			addons,
			info,
			titleProps,
			swapAddonsPosition,
			iconVerticalAlignment = "top",
			compact,
			headerActions,
			...rest
		} = props;

		const typographyTitles = context.typographyTitles;

		const collapsibleHeadlineTitle = !collapsible
			? undefined
			: collapsed
				? typographyTitles?.expand
				: typographyTitles?.collapse;

		const rootClassName = useMemo(() => {
			return joinClassNames(
				`${baseClassName}-headline`,
				`${baseClassName}-headline--${level}`,
				{ [`${baseClassName}-headline--collapsible`]: collapsible },
				{ [`${baseClassName}-headline--no-effect`]: isAddonHoveredOrTouched },
				{ [`${baseClassName}-headline--no-focus`]: isAddonHoveredOrTouched || isAddonFocused },
				{ [addPrefix("-u-justify-end")]: alignment === "right" },
				{ [addPrefix("-u-justify-start")]: alignment === "left" },
				{ [addPrefix("-u-justify-center")]: alignment === "center" },
				className
			);
		}, [alignment, className, collapsible, isAddonFocused, isAddonHoveredOrTouched, level]);

		const handleTitleRef = useCallback(
			(instance: HTMLDivElement | null): void => {
				titleRef.current = instance;
				props.titleProps?.wrapperRef?.(instance);
			},
			[props.titleProps]
		);

		const handleClick = useCallback(
			(event: SyntheticEvent): void => {
				titleRef.current?.focus();

				if (onCollapsingChange) {
					onCollapsingChange(event);
				}
			},
			[onCollapsingChange]
		);

		const handleHeadlineWrapperClick = useCallback(
			(event: SyntheticEvent): void => {
				if (event.currentTarget !== titleRef.current) {
					handleClick(event);
				}
			},
			[handleClick]
		);

		// Specify click event for the headline title and prevent click from the headline wrapper when NVDA is on
		const handleHeadlineTitleClick = useCallback(
			(event: SyntheticEvent): void => {
				event.stopPropagation();

				if (event.currentTarget === titleRef.current) {
					handleClick(event);
				}
			},
			[handleClick]
		);

		const handleHoverOrTouchAddon = useCallback(
			(event: MouseEvent<HTMLElement> | TouchEvent<HTMLElement>, entered: boolean): void => {
				const nearestFocusableParentElement = getNearestFocusableParent(event.target as HTMLElement);

				setAddonHoveredOrTouched(
					entered && !!nearestFocusableParentElement && event.currentTarget.contains(nearestFocusableParentElement)
				);
			},
			[]
		);

		const handleAddonFocus = useCallback((event: FocusEvent<HTMLDivElement>, isFocused?: boolean): void => {
			if (getAllFocusableElements(event.currentTarget).length > 0) {
				setAddonFocused(!!isFocused);
			}
		}, []);

		const resetAddonStates = useCallback((): void => {
			setAddonHoveredOrTouched(false);
			setAddonFocused(false);
		}, []);

		const handleWrapperMouseOver = useCallback((event: SyntheticEvent): void => {
			const target = event.target as HTMLElement;
			const nearestFocusableParentElement = getNearestFocusableParent(target);
			const addon = addonWrapperRef.current;
			const isInteractiveAddon =
				!!addon && !!nearestFocusableParentElement && addon.contains(nearestFocusableParentElement);
			setAddonHoveredOrTouched(isInteractiveAddon);
		}, []);

		const keyUpHandler = useCallback(
			(event: KeyboardEvent): void => {
				if (
					(event.target as HTMLElement).classList.contains(`${baseClassName}-headline__title`) &&
					event.key === Key.Enter &&
					onCollapsingChange
				) {
					onCollapsingChange(event);
				}
			},
			[onCollapsingChange]
		);

		const graphicIconRenderer = useMemo(() => {
			const graphicIcon = collapsed
				? collapseIcon || <Icon>keyboard_arrow_right</Icon>
				: expandIcon || <Icon>keyboard_arrow_down</Icon>;

			return (
				collapsible && (
					<StyledTypographyGraphic
						className={`${baseClassName}-headline__graphic`}
						data-role={DataRoles.Typography.Headline.Graphic}
						$level={level}
						$iconVerticalAlignment={iconVerticalAlignment}
						$hasHeaderActions={!!headerActions}
					>
						{graphicIcon}
					</StyledTypographyGraphic>
				)
			);
		}, [collapsed, collapseIcon, expandIcon, collapsible, level, iconVerticalAlignment, headerActions]);

		const addonsRenderer = useMemo(() => {
			return (
				addons && (
					<StyledTypographyAddons
						className={`${baseClassName}-addons`}
						data-role={DataRoles.Typography.Addons}
						ref={addonWrapperRef}
						$level={level}
						$swapAddonsPosition={!!swapAddonsPosition}
						$iconVerticalAlignment={iconVerticalAlignment}
					>
						{Children.toArray(addons).map((addon, index) => (
							<StyledTypographyAddon
								key={index}
								className={`${baseClassName}-addon`}
								data-role={DataRoles.Typography.Addon}
								onMouseOver={(event): void => handleHoverOrTouchAddon(event, true)}
								onMouseLeave={(event): void => handleHoverOrTouchAddon(event, false)}
								onTouchStart={(event): void => handleHoverOrTouchAddon(event, true)}
								onTouchEnd={(event): void => handleHoverOrTouchAddon(event, false)}
								onFocus={(event): void => handleAddonFocus(event, true)}
								onBlur={(event): void => handleAddonFocus(event, false)}
							>
								{addon}
							</StyledTypographyAddon>
						))}
					</StyledTypographyAddons>
				)
			);
		}, [addons, iconVerticalAlignment, handleAddonFocus, handleHoverOrTouchAddon, level, swapAddonsPosition]);

		const headerActionsRenderer = useMemo(() => {
			return (
				headerActions && (
					<StyledTypographyHeaderActions
						className={`${baseClassName}-header-actions`}
						data-role={DataRoles.Typography.Headline.HeaderActions}
					>
						{headerActions}
					</StyledTypographyHeaderActions>
				)
			);
		}, [headerActions]);

		return (
			<StyledTypographyHeadline
				{...rest}
				style={style}
				className={rootClassName}
				aria-level={ariaLevel}
				role={ariaLevel ? "heading" : undefined}
				data-role={DataRoles.Typography.Headline}
				onClick={collapsible ? handleHeadlineWrapperClick : undefined}
				onKeyUp={keyUpHandler}
				onMouseOver={handleWrapperMouseOver}
				as={htmlTag || "div"}
				$level={level}
				$collapsible={collapsible}
				$noFocus={isAddonHoveredOrTouched || isAddonFocused}
				$noEffect={isAddonHoveredOrTouched}
				$typographyColor={color}
				$compact={compact}
			>
				<StyledTypographyWrapper
					className={`${baseClassName}-headline__wrapper`}
					data-role={DataRoles.Typography.Headline.Wrapper}
					$level={level}
					$compact={compact}
				>
					{swapAddonsPosition && addonsRenderer}
					<StyledTypographyTitle
						id={titleProps?.id}
						className={`${baseClassName}-headline__title`}
						data-role={DataRoles.Typography.Headline.Title}
						role={collapsible ? "button" : undefined}
						tabIndex={collapsible ? 0 : undefined}
						aria-expanded={collapsible && typeof collapsed === "boolean" ? !collapsed : undefined}
						title={collapsibleHeadlineTitle}
						onClick={collapsible ? handleHeadlineTitleClick : undefined}
						ref={handleTitleRef}
						onFocus={resetAddonStates}
						$alignment={alignment}
						$swapAddonsPosition={!!swapAddonsPosition}
					>
						{!swapAddonsPosition && graphicIconRenderer}
						<StyledTypographyContent>
							<div className={`${baseClassName}-headline__label`} data-role={DataRoles.Typography.Headline.Label}>
								{children}
							</div>
							{info && (
								<StyledTypographyInfo
									className={`${baseClassName}-headline__info`}
									data-role={DataRoles.Typography.Headline.Info}
								>
									&nbsp;- {info}
								</StyledTypographyInfo>
							)}
						</StyledTypographyContent>
						{headerActionsRenderer}
						{swapAddonsPosition && graphicIconRenderer}
						{provider.isPhone() && collapsibleHeadlineTitle && <HiddenText> {collapsibleHeadlineTitle}</HiddenText>}
					</StyledTypographyTitle>
					{!swapAddonsPosition && addonsRenderer}
					{divider && !compact && (
						<StyledTypographyDivider
							className={`${baseClassName}-headline__divider`}
							data-role={DataRoles.Typography.Headline.Divider}
							$level={level}
						/>
					)}
				</StyledTypographyWrapper>
			</StyledTypographyHeadline>
		);
	}

	export function Body(props: BodyProps): ReactElement<BodyProps> {
		const { style, className, children, color, ...rest } = props;
		const rootClassName = joinClassNames(`${baseClassName}-body`, className);

		return (
			<StyledTypographyBody
				{...rest}
				$typographyColor={color}
				style={style}
				className={rootClassName}
				id={props.id}
				data-role={DataRoles.Typography.Body}
			>
				{children}
			</StyledTypographyBody>
		);
	}
}
