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

import type { FC } from "react";
import { useContext, useRef, useEffect } from "react";

import { Icon } from "../../../../icon/main/icon.view.js";
import { addPrefix, joinClassNames } from "../../../../common/main/utils.js";
import { A11YLanguageContext } from "../../../../common/main/a11y-localization/language-context.js";
import { renderIcon } from "../../common/toast.internal.js";
import {
	StyledToastWrapper,
	StyledToastGraphic,
	StyledToastBody,
	StyledToastActions,
	StyledToastButton,
	StyledToastCollapse,
	StyledToastContent,
	StyledToastFooter,
	StyledToastHeader,
	StyledToastMessage,
	StyledToastTitle
} from "../../common/toast.styled.js";
import { DataRoles } from "../../../../common/main/data-roles.js";

import type { ToastTemplateProps } from "./toast.template.api.js";

const baseClassName = addPrefix("toast");

export const ToastTemplate: FC<ToastTemplateProps> = (props) => {
	const {
		variant = "info",
		focusOnMount = true,
		header,
		message,
		collapse,
		footer,
		contentHeight,
		className,
		onClose,
		icon,
		id,
		style,
		shouldHideToastWhenAdding,
		ariaLevel,
		wrapperRef: wrapperRefProp
	} = props;

	const a11yContext = useContext(A11YLanguageContext);

	const wrapperRef = useRef<HTMLElement | null>(null);

	const getWrapperRef = (ref: HTMLDivElement | null): void => {
		wrapperRef.current = ref;
		wrapperRefProp?.(ref);
	};

	useEffect(() => {
		const focusToWrapper = (): void => {
			if (wrapperRef.current && focusOnMount) {
				wrapperRef.current.style.outline = "none";
				wrapperRef.current.focus();
			}
		};

		focusToWrapper();
	}, [focusOnMount]);

	return (
		<StyledToastWrapper
			ref={getWrapperRef}
			id={id}
			style={style}
			tabIndex={-1}
			className={joinClassNames(`${baseClassName} ${baseClassName}--${variant}`, className)}
			data-role={DataRoles.Toast}
			shouldHideToastWhenAdding={shouldHideToastWhenAdding}
		>
			<StyledToastGraphic variant={variant} className={`${baseClassName}__left`} data-role={DataRoles.Toast.Left}>
				{icon || renderIcon(variant)}
			</StyledToastGraphic>
			<StyledToastBody variant={variant} className={`${baseClassName}__right`} data-role={DataRoles.Toast.Right}>
				<StyledToastHeader className={`${baseClassName}__header`} data-role={DataRoles.Toast.Header}>
					{header && (
						<StyledToastTitle
							className={`${baseClassName}__title`}
							role="heading"
							aria-level={ariaLevel ?? 2}
							data-role={DataRoles.Toast.Title}
						>
							{header}
						</StyledToastTitle>
					)}
					<StyledToastActions className={`${baseClassName}__actions`} data-role={DataRoles.Toast.Action}>
						<StyledToastButton
							icon={<Icon>close</Icon>}
							title={a11yContext.toastTitles?.closeToast}
							onClick={onClose}
						/>
					</StyledToastActions>
				</StyledToastHeader>
				{(message || collapse) && (
					<StyledToastContent
						className={`${baseClassName}__content`}
						style={{ height: contentHeight }}
						data-role={DataRoles.Toast.Content}
					>
						{message && (
							<StyledToastMessage className={`${baseClassName}__message`} data-role={DataRoles.Toast.Message}>
								{message}
							</StyledToastMessage>
						)}
						{collapse && (
							<StyledToastCollapse className={`${baseClassName}__collapse`} data-role={DataRoles.Toast.Collapse}>
								{collapse}
							</StyledToastCollapse>
						)}
					</StyledToastContent>
				)}
				{footer && (
					<StyledToastFooter className={`${baseClassName}__footer`} data-role={DataRoles.Toast.Footer}>
						{footer}
					</StyledToastFooter>
				)}
			</StyledToastBody>
		</StyledToastWrapper>
	);
};

ToastTemplate.displayName = "ToastTemplate";
