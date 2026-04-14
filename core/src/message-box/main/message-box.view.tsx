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
import { useContext, useEffect } from "react";

import { joinClassNames, addPrefix } from "../../common/main/utils.js";
import type { A11yDefinition, MessageBoxTitles } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { MessageBoxProps, MessageBoxVariant } from "./message-box.api.js";
import {
	StyledMessageBoxWrapper,
	StyledMessageBoxMainContainer,
	StyledMessageBoxTitle,
	StyledMessageBoxIcon,
	StyledMessageBoxLabel,
	StyledMessageBoxAction,
	StyledMessageBoxSubContainer
} from "./message-box.styled.js";

const baseClassName = addPrefix("messageBox");

export const MessageBox: FC<MessageBoxProps> = ({
	action,
	children,
	className,
	focusOnMessage = true,
	icon,
	id,
	label,
	style,
	variant = "error"
}: MessageBoxProps): ReactElement => {
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const a11yTitles = languageContext.messageBoxTitles;
	const hiddenTitles = hiddenTitle(a11yTitles, variant);

	let messageTitleRef: HTMLElement | null = null;
	const setMessageTitleRef = (ref: HTMLElement | null) => {
		messageTitleRef = ref;
	};

	const classNames = joinClassNames(baseClassName, `${baseClassName}--${variant}`, className);

	useEffect(() => {
		if (focusOnMessage) {
			messageTitleRef?.focus();
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<StyledMessageBoxWrapper
			variant={variant}
			id={id}
			className={classNames}
			style={style}
			data-role={DataRoles.Messagebox}
		>
			<StyledMessageBoxMainContainer
				className={`${baseClassName}__mainContainer`}
				data-role={DataRoles.Messagebox.Main}
			>
				<StyledMessageBoxTitle
					ref={setMessageTitleRef}
					tabIndex={-1}
					className={`${baseClassName}__title`}
					data-role={DataRoles.Messagebox.Title}
				>
					{hiddenTitles && <HiddenText>{hiddenTitles}</HiddenText>}
					<StyledMessageBoxIcon className={`${baseClassName}__icon`} data-role={DataRoles.Messagebox.Icon}>
						{icon || renderIcon(variant)}
					</StyledMessageBoxIcon>
					<StyledMessageBoxLabel
						className={`${baseClassName}__label`}
						data-role={DataRoles.Messagebox.Label}
						$hasAction={!!action}
					>
						{label}
					</StyledMessageBoxLabel>
				</StyledMessageBoxTitle>
				{action && (
					<StyledMessageBoxAction className={`${baseClassName}__action`} data-role={DataRoles.Messagebox.Action}>
						{action}
					</StyledMessageBoxAction>
				)}
			</StyledMessageBoxMainContainer>
			{children && (
				<StyledMessageBoxSubContainer
					className={`${baseClassName}__subContainer`}
					data-role={DataRoles.Messagebox.Detail}
				>
					{children}
				</StyledMessageBoxSubContainer>
			)}
		</StyledMessageBoxWrapper>
	);
};

MessageBox.displayName = "MessageBox";

function renderIcon(variant?: MessageBoxVariant): ReactNode {
	switch (variant) {
		case "info":
			return <Icon variant="info">info</Icon>;
		case "success":
			return <Icon variant="success">check_circle</Icon>;
		case "warning":
			return <Icon variant="warning">warning</Icon>;
		default:
			return (
				<Icon variant="error" iconTheme="custom">
					error
				</Icon>
			);
	}
}

function hiddenTitle(a11yTitles?: MessageBoxTitles, variant?: MessageBoxVariant): string | undefined {
	switch (variant) {
		case "info":
			return a11yTitles?.infoElement;
		case "success":
			return a11yTitles?.successElement;
		case "warning":
			return a11yTitles?.warningElement;
		default:
			return a11yTitles?.errorElement;
	}
}
