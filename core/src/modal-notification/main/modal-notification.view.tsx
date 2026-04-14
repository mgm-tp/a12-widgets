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

import type { ReactElement, ReactNode } from "react";
import { useContext } from "react";
import { styled, css } from "styled-components";

import { joinClassNames, addPrefix } from "../../common/main/utils.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import type {
	A11yDefinition,
	ModalNotificationTitles
} from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { ModalOverlay } from "../../modal-overlay/main/modal-overlay.view.js";
import { ContentBoxElements } from "../../contentbox/main/template/contentbox.tpl.view.js";
import { StyledHeadingAffix } from "../../contentbox/main/template/elements/heading.tpl.view.js";
import {
	StyledContentBoxHeading,
	StyledContentBoxTitleWrapper
} from "../../contentbox/main/template/contentbox.tpl.styled.js";
import { ActionContentbox } from "../../contentbox/main/action-contentbox/action-contentbox.view.js";
import type { ActionContentboxProps } from "../../contentbox/main/action-contentbox/action-contentbox.api.js";
import { Icon, StyledIconWrapper } from "../../icon/main/icon.view.js";
import { StyledButton, variantButtonStyles } from "../../button/main/button.styled.js";
import { Button } from "../../button/main/button.view.js";

import type { ModalNotificationProps } from "./modal-notification.api.js";

export const StyledModalNotificationContentBox = styled(ActionContentbox).withConfig({
	displayName: "StyledModalNotificationContentBox-sc-"
})<
	{
		$variant: "info" | "success" | "warning" | "error";
		$hasCloseButton: boolean;
	} & ActionContentboxProps
>(({ theme, $variant, $hasCloseButton }) => {
	const { modalNotification } = theme.components;
	const textColor = modalNotification.variant.text[$variant];
	const headingButtonColor = modalNotification.closeButton?.color[$variant];
	const headingColor = modalNotification.variant[$variant];

	return css`
		${StyledContentBoxHeading} {
			background-color: ${headingColor};

			// should be the same as background-color so that primary button can inherit
			color: ${headingColor};

			${variantButtonStyles({ theme, isWarning: $variant === "warning", customColor: headingButtonColor })}

			${$hasCloseButton &&
			css`
				${StyledButton} {
					&:not(:hover):not(:focus):not([data-variant-type="activated"]) {
						background-color: ${modalNotification.closeButton?.background};
						color: ${headingButtonColor};
					}
				}
			`}
		}

		${StyledHeadingAffix} > ${StyledIconWrapper} {
			color: ${textColor};
			font-size: ${modalNotification.icon.fontSize};
		}

		${StyledContentBoxTitleWrapper} {
			color: ${textColor};
		}
	`;
});

export function ModalNotification(props: ModalNotificationProps): ReactElement<ModalNotificationProps> {
	const {
		children,
		className,
		id,
		style,
		title,
		padding,
		headingButtons,
		enableCloseButton,
		wrapperRef,
		contentRef,
		containerAttributes,
		...rest
	} = props;
	const variant = props.variant || "info";
	const icon = props.icon ? props.icon : renderIcon(variant);
	const footer = props.footer ? renderFooter(props.footer) : undefined;
	const baseClassName = addPrefix("modal-notification");
	const classNames = joinClassNames(baseClassName, `${baseClassName}--${variant}`, className);

	const { modalNotificationTitles, contentboxTitles } = useContext<A11yDefinition>(A11YLanguageContext);
	const hiddenText = getHiddenText(modalNotificationTitles, variant);
	const hasCloseButton = !!(props.enableCloseButton && props.onClose);
	const modalCloseButton = hasCloseButton && (
		<Button invert icon={<Icon>close</Icon>} title={contentboxTitles?.closeButtonTitle} onClick={props.onClose} />
	);

	const titleId = id ? `${id}-title` : undefined;

	return (
		<ModalOverlay
			style={style}
			className={classNames}
			containerAttributes={{ "aria-labelledby": titleId, ...containerAttributes }}
			{...rest}
		>
			<StyledModalNotificationContentBox
				id={id}
				headingPrefixes={icon}
				headingElements={
					<ContentBoxElements.Title
						id={titleId}
						ariaLevel={1}
						text={
							<>
								{hiddenText && <HiddenText>{hiddenText}</HiddenText>}
								{title}
							</>
						}
					/>
				}
				headingButtons={headingButtons || modalCloseButton}
				footer={footer}
				wrapperRef={wrapperRef}
				contentRef={contentRef}
				padding={padding}
				$hasCloseButton={hasCloseButton}
				$variant={variant}
			>
				{children}
			</StyledModalNotificationContentBox>
		</ModalOverlay>
	);
}

ModalNotification.displayName = "ModalNotification";

function renderIcon(variant?: string): ReactNode {
	const iconClassName = addPrefix("contentbox__headingGraphic");

	switch (variant) {
		case "success":
			return <Icon className={iconClassName}>check_circle</Icon>;
		case "warning":
			return (
				<Icon className={iconClassName} iconTheme="outlined">
					warning_amber
				</Icon>
			);
		case "error":
			return (
				<Icon className={iconClassName} iconTheme="custom">
					error
				</Icon>
			);
		default:
			return <Icon className={iconClassName}>info</Icon>;
	}
}

function renderFooter(footer: ReactNode): ReactElement {
	return <ContentBoxElements.Footer>{footer}</ContentBoxElements.Footer>;
}

function getHiddenText(a11yTitles?: ModalNotificationTitles, variant?: string): string | undefined {
	switch (variant) {
		case "info":
			return a11yTitles?.infoTitle;
		case "success":
			return a11yTitles?.successTitle;
		case "warning":
			return a11yTitles?.warningTitle;
		default:
			return a11yTitles?.errorTitle;
	}
}
