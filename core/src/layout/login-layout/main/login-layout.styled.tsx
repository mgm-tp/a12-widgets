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

import { styled, css } from "styled-components";

export const StyledLoginLogo = styled.div.withConfig({ displayName: "StyledLoginLogo-sc-" })(({ theme }) => {
	const { logo } = theme.components.loginLayout;

	return css`
		margin-bottom: ${logo.marginBottom};
		text-align: center;

		> * {
			max-height: ${logo.maxHeight};
			max-width: ${logo.width};
			min-height: ${logo.minHeight};
		}
	`;
});

export const StyledLoginHeadline = styled.div.withConfig({ displayName: "StyledLoginHeadline-sc-" })(({ theme }) => {
	const { headline } = theme.components.loginLayout;

	return css`
		color: ${headline.color};
		font-family: ${headline.fontFamily};
		font-size: ${headline.fontSize};
		font-weight: ${headline.fontWeight};
		line-height: ${headline.lineHeight};
		margin-bottom: ${headline.marginBottom};
		text-align: center;
	`;
});

export const StyledLoginContainer = styled.div.withConfig({ displayName: "StyledLoginContainer-sc-" })<{
	secondary?: boolean;
}>(({ theme, secondary }) => {
	const { container, mobile } = theme.components.loginLayout;

	return css`
		box-sizing: border-box;
		background-color: ${container.background};
		overflow-y: auto;
		padding: ${container.padding};
		width: 100%;
		@media screen and (max-width: 575px) {
			padding: ${mobile.padding};
		}
		${secondary &&
		css`
			background-color: ${container.secondaryBackground};
		`}
		&:after {
			content: "";
			display: block;
			height: ${container.spacingBottom};
			width: 100%;
		}
	`;
});

export const StyledLoginLayout = styled.div.withConfig({ displayName: "StyledLoginLayout-sc-" })<{
	mobile?: boolean;
	fullscreen?: boolean;
}>(({ theme, mobile, fullscreen }) => {
	const { loginLayout } = theme.components;

	return css`
		background-attachment: fixed;
		background-color: ${loginLayout.background.color};
		background-position: ${loginLayout.background.position};
		background-repeat: ${loginLayout.background.repeat};
		background-size: ${loginLayout.background.size};
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: space-between;
		overflow-y: hidden;

		.field__label {
			color: ${loginLayout.formItem.labelColor};
		}
		> * {
			margin: 0 auto;
			max-width: calc(100% - ${loginLayout.beforeAfterHeight}*2);
			width: calc(100% - ${loginLayout.beforeAfterHeight}*2);
		}

		&:before,
		&:after {
			content: "";
			display: block;
			flex-shrink: 0;
			height: ${loginLayout.beforeAfterHeight};
			width: 100%;
		}

		${fullscreen &&
		css`
			height: 100vh;
			width: 100vw;
		`}
		${mobile &&
		css`
			justify-content: start;
			${StyledLoginContainer} {
				margin: ${loginLayout.mobile.margin};
				padding: ${loginLayout.mobile.padding};
				&:after {
					height: ${loginLayout.mobile.spacingBottom};
				}
			}
		`}
			${!mobile &&
		css`
			${StyledLoginContainer} {
				width: ${loginLayout.container.width};
			}
		`}
	`;
});

export const StyledLoginForm = styled.div.withConfig({ displayName: "StyledLoginForm-sc-" })``;

export const StyledLoginFormItem = styled.div.withConfig({ displayName: "StyledLoginFormItem-sc-" })(({ theme }) => {
	const { formItem } = theme.components.loginLayout;

	return css`
		margin-bottom: ${formItem.marginBottom};
		&:last-child {
			margin-bottom: 0;
		}
	`;
});

export const StyledLoginFooter = styled.div.withConfig({ displayName: "StyledLoginFooter-sc-" })(({ theme }) => {
	const { footer } = theme.components.loginLayout;

	return css`
		margin: ${footer.margin};
		> *:not(:last-child) {
			margin: ${footer.itemMargin};
		}
	`;
});
