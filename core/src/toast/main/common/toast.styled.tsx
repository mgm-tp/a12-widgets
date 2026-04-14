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

import { Button } from "../../../button/main/button.view.js";
import { StyledIconWrapper } from "../../../icon/main/icon.view.js";
import type { DefaultThemeType } from "../../../theme/schema.js";
import { addPrefix } from "../../../common/main/utils.js";

import type { Variant } from "./toast.common.api.js";

const baseClassName = addPrefix("toast");

export const toastColorState = (theme: DefaultThemeType, variant: Variant): string => {
	return theme.components.toast.color[variant];
};

export const StyledToastWrapper = styled.div.withConfig({ displayName: "StyledToastWrapper-sc-" })<{
	shouldHideToastWhenAdding?: boolean;
}>(({ theme, shouldHideToastWhenAdding }) => {
	const { hideDuration } = theme.components.toastGroup;

	return css`
		display: inline-flex;
		outline: none;

		${shouldHideToastWhenAdding &&
		css`
			&&& {
				opacity: 0;
				visibility: hidden;
			}
			&:nth-last-child(2):not(.${baseClassName}-exit) {
				transition:
					visibility 0s linear ${hideDuration},
					opacity ${hideDuration};
			}
		`}
	`;
});

export const StyledToastGraphic = styled.div.withConfig({ displayName: "StyledToastGraphic-sc-" })<{
	variant: Variant;
}>(({ theme, variant }) => {
	const { graphic, variantIcon } = theme.components.toast;

	return css`
		background-color: ${toastColorState(theme, variant)};
		box-shadow: ${graphic.boxShadow};
		flex: none;
		font-size: 0;
		min-height: ${graphic.minHeight};
		padding: ${graphic.padding};
		text-align: center;
		width: ${graphic.width};
		${StyledIconWrapper} {
			color: ${variantIcon.color[variant]};
			font-size: ${variantIcon.fontSize};
		}
	`;
});

export const StyledToastBody = styled.div.withConfig({ displayName: "StyledToastBody-sc-" })<{ variant: Variant }>(
	({ theme, variant }) => {
		const { body } = theme.components.toast;
		const stateColor = toastColorState(theme, variant);

		return css`
			box-sizing: border-box;
			background-color: ${body.background};
			border: ${body.border};
			border-left: none;
			box-shadow: ${body.boxShadow};
			display: flex;
			flex: 0 1 auto;
			flex-direction: column;
			overflow-wrap: break-word;
			max-width: ${body.maxWidth};
			min-width: ${body.minWidth};
			&& {
				border-color: ${stateColor};
			}
		`;
	}
);

export const StyledToastHeader = styled.div.withConfig({ displayName: "StyledToastHeader-sc-" })`
	box-sizing: border-box;
	display: flex;
`;

export const StyledToastTitle = styled.div.withConfig({ displayName: "StyledToastTitle-sc-" })(({ theme }) => {
	const { title } = theme.components.toast;

	return css`
		color: ${title.color};
		flex-grow: 1;
		flex-shrink: 1;
		font-family: ${title.fontFamily};
		font-size: ${title.fontSize};
		font-weight: ${title.fontWeight};
		line-height: 1.45;
		overflow: hidden;
		padding: ${title.padding};
	`;
});

export const StyledToastActions = styled.div.withConfig({ displayName: "StyledToastActions-sc-" })(({ theme }) => {
	const { actions } = theme.components.toast;

	return css`
		box-sizing: border-box;
		flex: none;
		margin-left: auto;
		padding: ${actions.padding};
		text-align: center;
		width: ${actions.width};
	`;
});

export const StyledToastButton = styled(Button).withConfig({ displayName: "StyledToastButton-sc-" })(({ theme }) => {
	const { closeButton } = theme.components.toast.actions;

	return css`
		font-size: ${closeButton.fontSize};
	`;
});

export const StyledToastContent = styled.div.withConfig({ displayName: "StyledToastContent-sc-" })(({ theme }) => {
	const { content } = theme.components.toast;

	return css`
		box-sizing: border-box;
		flex: 0 1 auto;
		padding: ${content.padding};
	`;
});

export const StyledToastMessage = styled.div.withConfig({ displayName: "StyledToastMessage-sc-" })(({ theme }) => {
	const { message } = theme.components.toast;

	return css`
		color: ${message.color};
		font-family: ${message.fontFamily};
		font-size: ${message.fontSize};
		line-height: 1.45;
	`;
});
export const StyledToastCollapse = styled.div.withConfig({ displayName: "StyledToastCollapse-sc-" })(({ theme }) => {
	const { collapse } = theme.components.toast;

	return css`
		padding: ${collapse.padding};
	`;
});

export const StyledToastFooter = styled.div.withConfig({ displayName: "StyledToastFooter-sc-" })(({ theme }) => {
	const { footer } = theme.components.toast;

	return css`
		box-sizing: border-box;
		min-height: ${footer.minHeight};
		padding: ${footer.padding};
	`;
});
