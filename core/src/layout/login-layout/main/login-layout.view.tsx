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

import type { ReactElement } from "react";

import { DataRoles } from "../../../common/main/data-roles.js";
import { joinClassNames, mergeStyles, addPrefix } from "../../../common/main/utils.js";

import type {
	LoginFormItemProps,
	LoginFormProps,
	LoginHeadlineProps,
	LoginLogoProps,
	LoginLayoutProps,
	LoginFooterProps,
	LoginContainerProps
} from "./login-layout.api.js";
import {
	StyledLoginContainer,
	StyledLoginFooter,
	StyledLoginForm,
	StyledLoginFormItem,
	StyledLoginHeadline,
	StyledLoginLayout,
	StyledLoginLogo
} from "./login-layout.styled.js";

const LOGIN_LAYOUT_BASE_CLASSNAME = addPrefix("-l-login");

export function LoginLayout(props: LoginLayoutProps): ReactElement<LoginLayoutProps> {
	const { children, className, backgroundImage, style, fullscreen, mobile, noGutter, ...rest } = props;

	const wrapperClassNames = joinClassNames(
		LOGIN_LAYOUT_BASE_CLASSNAME,
		{ [`${LOGIN_LAYOUT_BASE_CLASSNAME}--mobile`]: mobile },
		{ [`${LOGIN_LAYOUT_BASE_CLASSNAME}--fullscreen`]: fullscreen },
		className
	);
	const bgImage = backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {};

	return (
		<StyledLoginLayout
			className={wrapperClassNames}
			style={mergeStyles(bgImage, style)}
			{...rest}
			data-role={DataRoles.LoginLayout}
			mobile={mobile}
			fullscreen={fullscreen}
		>
			{!noGutter ? <LoginLayout.Container>{children}</LoginLayout.Container> : children}
		</StyledLoginLayout>
	);
}

LoginLayout.displayName = "LoginLayout";

export namespace LoginLayout {
	export function Container(props: LoginContainerProps): ReactElement<LoginContainerProps> {
		const { className, children, secondary, ...rest } = props;
		const classNames = joinClassNames(
			`${LOGIN_LAYOUT_BASE_CLASSNAME}__container`,
			{ [`${LOGIN_LAYOUT_BASE_CLASSNAME}__container--secondary`]: secondary },
			className
		);

		return (
			<StyledLoginContainer
				className={classNames}
				{...rest}
				data-role={DataRoles.LoginLayout.Container}
				secondary={secondary}
			>
				{children}
			</StyledLoginContainer>
		);
	}

	Container.displayName = "LoginLayout.Container";

	export function Logo(props: LoginLogoProps): ReactElement<LoginLogoProps> {
		const { className, children, ...rest } = props;
		const classNames = joinClassNames(`${LOGIN_LAYOUT_BASE_CLASSNAME}__logo`, className);

		return (
			<StyledLoginLogo className={classNames} {...rest} data-role={DataRoles.LoginLayout.Logo}>
				{children}
			</StyledLoginLogo>
		);
	}

	Logo.displayName = "LoginLayout.Logo";

	export function Headline({
		ariaLevel = 1,
		children,
		className,
		...rest
	}: LoginHeadlineProps): ReactElement<LoginHeadlineProps> {
		const classNames = joinClassNames(`${LOGIN_LAYOUT_BASE_CLASSNAME}__headline`, className);

		return (
			<StyledLoginHeadline
				className={classNames}
				{...rest}
				role="heading"
				aria-level={ariaLevel}
				data-role={DataRoles.LoginLayout.Headline}
			>
				{children}
			</StyledLoginHeadline>
		);
	}

	Headline.displayName = "LoginLayout.Headline";

	export function Form(props: LoginFormProps): ReactElement<LoginFormProps> {
		const { className, children, ...rest } = props;
		const classNames = joinClassNames(`${LOGIN_LAYOUT_BASE_CLASSNAME}__form`, className);

		return (
			<StyledLoginForm className={classNames} {...rest} data-role={DataRoles.LoginLayout.Form}>
				{children}
			</StyledLoginForm>
		);
	}

	Form.displayName = "LoginLayout.Form";

	export function FormItem(props: LoginFormItemProps): ReactElement<LoginFormItemProps> {
		const { className, children, ...rest } = props;
		const classNames = joinClassNames(`${LOGIN_LAYOUT_BASE_CLASSNAME}__form-item`, className);

		return (
			<StyledLoginFormItem className={classNames} {...rest} data-role={DataRoles.LoginLayout.FormItem}>
				{children}
			</StyledLoginFormItem>
		);
	}

	FormItem.displayName = "LoginLayout.FormItem";

	export function Footer(props: LoginFooterProps): ReactElement<LoginFooterProps> {
		const { className, children, ...rest } = props;
		const classNames = joinClassNames(`${LOGIN_LAYOUT_BASE_CLASSNAME}__footer`, className);

		return (
			<StyledLoginFooter className={classNames} {...rest} data-role={DataRoles.LoginLayout.Footer}>
				{children}
			</StyledLoginFooter>
		);
	}

	Footer.displayName = "LoginLayout.Footer";
}
