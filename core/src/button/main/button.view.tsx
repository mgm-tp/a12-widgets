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

import type { FunctionComponent } from "react";
import { cloneElement, useContext, useRef, isValidElement, useMemo, useCallback } from "react";

import { addPrefix, joinClassNames, StringUtils } from "../../common/main/utils.js";
import { ProgressBar } from "../../progress-bar/main/progress-bar.view.js";
import { ProgressIndicator } from "../../progress-indicator/main/progress-indicator.view.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { useInteractionHint } from "../../interaction-hint/main/use-interaction-hint.js";
import { getBadgeTitle } from "../../badge/main/badge-utils.js";
import type { BadgeProps } from "../../badge/main/badge.api.js";

import type { ButtonProps } from "./button.api.js";
import { StyledButton } from "./button.styled.js";
import { ButtonConfigContext } from "./button-context.js";

const baseClassName = addPrefix("button");

export const Button: FunctionComponent<ButtonProps> = (props) => {
	const {
		id,
		className,
		dataRole,
		label,
		badge,
		children,
		buttonRef,
		title,
		type,
		buttonAttributes,
		loading,
		processedPercentage,
		labelHidden: labelHiddenProp,
		icon,
		block,
		destructive,
		primary,
		secondary,
		vertical,
		invert,
		active,
		disabled,
		...rest
	} = props;
	const { labelHidden } = useContext(ButtonConfigContext);
	const context = useContext(A11YLanguageContext);

	const buttonElementRef = useRef<HTMLButtonElement | null>(null);

	const shouldHideLabel = labelHidden ?? labelHiddenProp;
	const iconButton = (!label || shouldHideLabel) && icon;
	const classNames = joinClassNames(
		baseClassName,
		{ [`${baseClassName}--icon`]: iconButton },
		{ [`${baseClassName}--block`]: block },
		{ [`${baseClassName}--destructive`]: destructive },
		{
			[`${baseClassName}--secondary`]: secondary || (!iconButton && !primary && !vertical)
		},
		{ [`${baseClassName}--primary`]: primary },
		{ [`${baseClassName}--invert`]: primary && invert },
		{ [`${baseClassName}--outline`]: !primary && invert },
		{ [`${baseClassName}--dark`]: invert },
		{ [`${baseClassName}--activated`]: active },
		{ [`${baseClassName}--vertical`]: vertical },
		className
	);

	const baseDataRole = dataRole ?? "button";
	const hiddenLoadingLabel = context.progressIndicatorTitles?.loadingLabel;
	const hiddenLabelId = id ? `${id}-loading-hidden-label` : undefined;
	const labelId = id ? `${id}-button-label` : undefined;
	const progressId = id ? `${id}-progress-indicator` : undefined;
	const hasProgressBar = !!processedPercentage;
	const percentage = processedPercentage !== undefined ? processedPercentage : 0;
	const hasLabel = !!label && !shouldHideLabel;
	const badgeHint =
		isValidElement<BadgeProps>(badge) && !badge.props.hidden
			? getBadgeTitle(badge.props, context.badgeTitles)
			: undefined;
	const interactionHint = title && badgeHint ? `${title}, ${badgeHint}` : (title ?? badgeHint);

	const { title: resolvedTitle, hintRenderer } = useInteractionHint({
		title: interactionHint,
		componentKey: iconButton ? "iconButton" : "button",
		referenceElementRef: buttonElementRef,
		focusable: !disabled && !loading && !hasProgressBar
	});

	const ariaLabel = useMemo(() => {
		if (loading) {
			return;
		}

		const ariaLabelFromAttributes = buttonAttributes?.["aria-label"];

		// If user pass an aria-label through buttonAttributes, the aria-label should be exactly what's in the prop.
		return (
			ariaLabelFromAttributes ?? (!!hintRenderer && title && label && title !== label ? `${label}, ${title}` : title)
		);
	}, [loading, hintRenderer, buttonAttributes, title, label]);

	const getButtonRef = useCallback(
		(ref: HTMLButtonElement) => {
			buttonRef?.(ref);
			buttonElementRef.current = ref;
		},
		[buttonRef]
	);

	const renderedBadge = isValidElement<BadgeProps>(badge)
		? cloneElement(badge, {
				enabledInteractionHint: !!hintRenderer
			})
		: null;

	return (
		<StyledButton
			{...rest}
			{...buttonAttributes}
			id={id}
			ref={getButtonRef}
			aria-label={!!hintRenderer && badge ? undefined : ariaLabel}
			title={resolvedTitle ?? ""}
			type={type || "button"}
			data-role={baseDataRole}
			data-type={iconButton ? "icon" : undefined} // For style
			data-variant-type={primary ? "primary" : secondary ? "secondary" : active ? "activated" : undefined} // For style
			icon={icon}
			className={classNames}
			aria-labelledby={StringUtils.join(
				{ [`${hiddenLabelId}`]: loading },
				{ [`${labelId}`]: label && loading && !title },
				buttonAttributes?.["aria-labelledby"]
			)}
			disabled={disabled || loading || hasProgressBar}
			destructive={destructive}
			primary={primary}
			secondary={secondary}
			vertical={vertical}
			active={active}
			invert={invert}
			block={block}
			$hasLabel={hasLabel}
			$hasProgressBar={hasProgressBar}
			$loading={loading}
			$disabled={disabled || Boolean(buttonAttributes?.["aria-disabled"])}
		>
			{hasProgressBar && <ProgressBar percentage={percentage} />}
			{icon}
			{label && !shouldHideLabel && (
				<span data-role={`${baseDataRole}-label`} id={loading ? labelId : undefined}>
					{label}
				</span>
			)}
			{loading && (
				<HiddenText id={hiddenLabelId}>
					{hiddenLoadingLabel} {ariaLabel}
				</HiddenText>
			)}
			{badge && title && !!hintRenderer && <HiddenText>{`${label ? "," : ""} ${title}`}</HiddenText>}
			{loading && <ProgressIndicator singleOverlay focusOnOpen noTabIndex id={progressId} />}
			{renderedBadge}
			{children}
			{hintRenderer?.()}
		</StyledButton>
	);
};

Button.displayName = "Button";
