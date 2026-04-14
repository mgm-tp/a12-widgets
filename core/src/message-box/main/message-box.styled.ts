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

import { StyledBulletListItem, StyledBulletListContent } from "../../bullet-list/main/bullet-list.view.js";
import { StyledIconWrapper } from "../../icon/main/icon.view.js";
import { breakWord } from "../../theme/base/mixins/_break-word.js";

import type { MessageBoxVariant } from "./message-box.api.js";

export const StyledMessageBoxWrapper = styled.div.withConfig({ displayName: "StyledMessageBoxWrapper-sc-" })<{
	variant?: MessageBoxVariant;
}>(({ theme, variant = "error" }) => {
	const { messageBox } = theme.components;

	return css`
		position: relative;
		display: flex;
		flex-direction: column;
		font-family: ${messageBox.fontFamily};
		font-size: ${messageBox.fontSize};
		border-radius: ${messageBox.borderRadius};
		border: ${messageBox.border[variant]};
		background-color: ${messageBox.background[variant]};
		color: ${messageBox.color[variant]};
		${variant === "warning" &&
		css`
			${StyledBulletListItem},
			${StyledBulletListContent} {
				color: inherit;
			}
		`}

		${messageBox.borderWidth &&
		css`
			border-width: ${messageBox.borderWidth};
		`}
	`;
});

export const StyledMessageBoxMainContainer = styled.div.withConfig({
	displayName: "StyledMessageBoxMainContainer-sc-"
})(({ theme }) => {
	const { mainContainer } = theme.components.messageBox;

	return css`
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: ${mainContainer.padding};

		@media screen and (max-width: 768px) {
			flex-direction: column;
			align-items: flex-start;
		}
	`;
});

export const StyledMessageBoxSubContainer = styled.div.withConfig({ displayName: "StyledMessageBoxSubContainer-sc-" })(
	({ theme }) => {
		const { subContainer, response } = theme.components.messageBox;

		return css`
			align-self: flex-start;
			display: flex;
			flex-direction: column;
			max-width: 100%;
			padding: ${subContainer.padding};
			& > * {
				align-self: flex-start;
				max-width: 100%;
			}

			@media screen and (max-width: 768px) {
				border-top: ${response.topBorder};
				align-items: flex-start;
			}
		`;
	}
);

export const StyledMessageBoxTitle = styled.div.withConfig({ displayName: "StyledMessageBoxTitle-sc-" })(
	({ theme }) => {
		const { title } = theme.components.messageBox;

		return css`
			align-items: ${title?.verticalAlignment};
			display: inline-flex;
			flex-direction: row;
			outline: none;
		`;
	}
);

export const StyledMessageBoxIcon = styled.div.withConfig({ displayName: "StyledMessageBoxIcon-sc-" })(({ theme }) => {
	const { icon } = theme.components.messageBox;

	return css`
		align-content: center;
		display: flex;
		margin-right: ${icon.marginRight};
		${StyledIconWrapper} {
			font-size: ${icon.fontSize};
		}
	`;
});

export const StyledMessageBoxLabel = styled.div.withConfig({ displayName: "StyledMessageBoxLabel-sc-" })<{
	$hasAction?: boolean;
}>(({ theme, $hasAction }) => {
	const { label } = theme.components.messageBox;

	return css`
		line-height: ${label.lineHeight};
		${breakWord}

		${$hasAction &&
		css`
			max-width: ${label.maxWidth};
		`}
	`;
});

export const StyledMessageBoxAction = styled.div.withConfig({ displayName: "StyledMessageBoxAction-sc-" })(
	({ theme }) => {
		const { action, response } = theme.components.messageBox;

		return css`
			margin-left: ${action.marginLeft};
			@media screen and (max-width: 768px) {
				margin-left: ${response.actionMarginLeft};
			}
		`;
	}
);
