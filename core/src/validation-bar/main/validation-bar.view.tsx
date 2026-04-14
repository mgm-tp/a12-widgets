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

import type { FC, ReactElement, ReactNode } from "react";
import { useRef, useCallback, useContext, useEffect } from "react";

import { CssEllipsis } from "../../css-ellipsis/main/css-ellipsis.view.js";
import { Icon } from "../../icon/main/icon.view.js";
import { joinClassNames, addPrefix } from "../../common/main/utils.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import type { Container } from "../../common/main/base-props.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { ValidationBarProps, ValidationBarVariant } from "./validation-bar.api.js";
import { StyledValidationBar } from "./validation-bar.styled.js";

const baseClassName = addPrefix("validation-bar");

const {
	StyledValidationBarWrapper,
	StyledValidationBarContent,
	StyledValidationBarGraphic,
	StyledValidationBarHeader,
	StyledValidationBarPrimaryTitle,
	StyledValidationBarSecondaryTitle,
	StyledValidationBarTitle
} = StyledValidationBar;

export const ValidationBar: FC<ValidationBarProps> = (props: ValidationBarProps) => {
	const { wrapperRef: wrapperRefProps } = props;
	const wrapperRef = useRef<HTMLElement | null>(null);

	const setWrapperRef = useCallback(
		(ref: HTMLElement | null) => {
			wrapperRef.current = ref;
			wrapperRefProps?.(ref);
		},
		[wrapperRefProps]
	);

	const {
		icon,
		variant = "error",
		className,
		primaryTitle,
		secondaryTitle,
		quickAccessMenu,
		pagination,
		children,
		titleRef,
		autoFocus = true,
		...rest
	} = props;
	const classNames = joinClassNames(
		baseClassName,
		variant === "warning" ? `${baseClassName}--warning` : `${baseClassName}--error`,
		className
	);
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const a11yTitles = languageContext.validationBarTitles;
	let variantA11yTitles;

	switch (variant) {
		case "warning":
			variantA11yTitles = a11yTitles?.warningElement;
			break;
		case "info":
			variantA11yTitles = a11yTitles?.infoElement;
			break;
		default:
			variantA11yTitles = a11yTitles?.errorElement;
	}

	useEffect(() => {
		if (autoFocus) {
			wrapperRef.current?.focus();
		}
	}, [autoFocus]);

	return (
		<A11YLanguageContext.Provider
			value={{
				...languageContext,
				paginationTitles: {
					...languageContext.paginationTitles,
					previousPage: a11yTitles?.previousIssue,
					nextPage: a11yTitles?.nextIssue
				},
				quickAccessButtonTitles: {
					...languageContext.quickAccessButtonTitles,
					triggerOpen: a11yTitles?.quickAccessButtonTriggerOpen,
					triggerClose: a11yTitles?.quickAccessButtonTriggerClose
				}
			}}
		>
			<StyledValidationBarWrapper
				$variant={variant}
				aria-label={a11yTitles?.sectionAriaLabel}
				className={classNames}
				{...rest}
				ref={setWrapperRef}
				tabIndex={-1}
				data-role={DataRoles.ValidationBar}
			>
				<StyledValidationBarHeader
					className={`${baseClassName}__header`}
					data-role={DataRoles.ValidationBar.Header}
					$variant={variant}
				>
					<StyledValidationBarGraphic
						className={`${baseClassName}__graphic`}
						data-role={DataRoles.ValidationBar.Graphic}
						$variant={variant}
					>
						{icon ? icon : renderValidationIcon(variant)}
					</StyledValidationBarGraphic>
					{(primaryTitle || secondaryTitle) && (
						<StyledValidationBarTitle
							ref={titleRef}
							className={`${baseClassName}__titles`}
							data-role={DataRoles.ValidationBar.Titles}
							role="status"
							aria-atomic="true"
							$variant={variant}
						>
							{primaryTitle && (
								<StyledValidationBarPrimaryTitle
									className={`${baseClassName}__primary-title`}
									data-role={DataRoles.ValidationBar.PrimaryTitle}
									role="heading"
									aria-level={2}
								>
									{variantA11yTitles && <HiddenText>{variantA11yTitles}</HiddenText>}
									<CssEllipsis
										maxLine={1}
										useTooltip
										tooltipVariant={props.variant === "info" ? "hint" : props.variant}
									>
										{primaryTitle}
									</CssEllipsis>
								</StyledValidationBarPrimaryTitle>
							)}

							{secondaryTitle && (
								<StyledValidationBarSecondaryTitle
									className={`${baseClassName}__secondary-title`}
									data-role={DataRoles.ValidationBar.SecondaryTitle}
								>
									<CssEllipsis
										maxLine={1}
										useTooltip
										tooltipVariant={props.variant === "info" ? "hint" : props.variant}
									>
										{secondaryTitle}
									</CssEllipsis>
								</StyledValidationBarSecondaryTitle>
							)}
						</StyledValidationBarTitle>
					)}
					{quickAccessMenu}
					{pagination}
				</StyledValidationBarHeader>
				{children && <ValidationBarContent>{children}</ValidationBarContent>}
			</StyledValidationBarWrapper>
		</A11YLanguageContext.Provider>
	);
};

ValidationBar.displayName = "ValidationBar";

function ValidationBarContent(props: Container): ReactElement {
	const element = useRef<HTMLDivElement | null>(null);

	useEffect(() => element.current?.focus(), []);

	return (
		<StyledValidationBarContent
			className={`${baseClassName}__content`}
			ref={element}
			tabIndex={-1}
			data-role={DataRoles.ValidationBar.Content}
		>
			{props.children}
		</StyledValidationBarContent>
	);
}

ValidationBarContent.displayName = "ValidationBarContent";

export function renderValidationIcon(
	variant?: ValidationBarVariant,
	overviewVariant?: ValidationBarVariant
): ReactNode {
	switch (variant) {
		case "info":
			return <Icon>{variant}</Icon>;
		case "warning": {
			if (overviewVariant && overviewVariant !== "warning") {
				return <Icon>{variant}</Icon>;
			}

			return <Icon iconTheme="outlined">warning_amber</Icon>;
		}

		default:
			return <Icon iconTheme="custom">{variant}</Icon>;
	}
}
