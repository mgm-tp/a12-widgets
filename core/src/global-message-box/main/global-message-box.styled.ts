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

import type { DefaultThemeType } from "../../theme/schema.js";
import { StyledIconWrapper } from "../../icon/main/icon.view.js";
import { variantButtonStyles } from "../../button/main/button.styled.js";

import type { GlobalMessageBoxVariant } from "./global-message-box.api.js";

export const messageBoxColorState = (theme: DefaultThemeType, variant: GlobalMessageBoxVariant): string => {
	return theme.components.globalMessageBox.variant[variant];
};

export const StyledGlobalMessageBoxWrapper = styled.div.withConfig({
	displayName: "StyledGlobalMessageBoxWrapper-sc-"
})<{
	variant?: GlobalMessageBoxVariant;
	isMobile?: boolean;
	ellipsis?: boolean;
}>(({ theme, variant = "info", isMobile, ellipsis }) => {
	const { wrapper } = theme.components.globalMessageBox;
	const stateColor = messageBoxColorState(theme, variant);

	return css`
		align-items: center;
		box-sizing: border-box;
		display: flex;
		min-height: ${wrapper.minHeight};
		padding: ${wrapper.padding};
		background-color: ${stateColor};
		color: ${stateColor};

		&:focus {
			outline: none;
		}

		${isMobile &&
		ellipsis &&
		css`
			flex-wrap: wrap;
			justify-content: flex-end;
		`}
	`;
});

export const StyledGlobalMessageBoxContent = styled.div.withConfig({
	displayName: "StyledGlobalMessageBoxContent-sc-"
})<{
	ellipsis?: boolean;
}>(({ theme, ellipsis }) => {
	const { content } = theme.components.globalMessageBox;

	return css`
		display: flex;
		flex: 1 1 auto;
		overflow: hidden;
		${!ellipsis &&
		css`
			padding: ${content.padding};
		`}
	`;
});

export const StyledGlobalMessageBoxGraphic = styled.div.withConfig({
	displayName: "StyledGlobalMessageBoxGraphic-sc-"
})<{
	$variant: GlobalMessageBoxVariant;
}>(({ theme, $variant }) => {
	const { graphic, variant } = theme.components.globalMessageBox;

	return css`
		display: block;
		margin: ${graphic.margin};
		${StyledIconWrapper} {
			display: block;
			color: ${variant.text[$variant]};
			font-size: ${graphic.icon.fontSize};
		}
	`;
});

export const StyledGlobalMessageBoxText = styled.div.withConfig({ displayName: "StyledGlobalMessageBoxText-sc-" })<{
	$variant: GlobalMessageBoxVariant;
	$ellipsis?: boolean;
}>(({ theme, $ellipsis, $variant }) => {
	const { text, variant } = theme.components.globalMessageBox;

	return css`
		color: ${variant.text[$variant]};
		font-family: ${text.fontFamily};
		font-size: ${text.fontSize};
		font-weight: ${text.fontWeight};
		overflow: hidden;
		text-overflow: ${$ellipsis ? "ellipsis" : "clip"};
		white-space: ${$ellipsis ? "nowrap" : "normal"};
	`;
});

export const StyledGlobalMessageBoxActions = styled.div.withConfig({
	displayName: "StyledGlobalMessageBoxActions-sc-"
})<{
	$isMobile?: boolean;
	$ellipsis?: boolean;
	$variant?: GlobalMessageBoxVariant;
}>(({ theme, $isMobile, $ellipsis, $variant }) => {
	const { components } = theme;
	const { actions } = components.globalMessageBox;

	return css`
		display: flex;
		flex: 0 0 auto;
		margin: ${$isMobile && $ellipsis ? actions.mobile.margin : actions.margin};

		${!$ellipsis &&
		css`
			align-items: center;
			align-self: flex-start;
			min-height: ${actions.minHeight};
		`}

		${variantButtonStyles({ theme, isWarning: $variant === "warning" })}
	`;
});
