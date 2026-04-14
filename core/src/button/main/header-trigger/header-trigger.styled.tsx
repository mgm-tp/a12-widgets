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

import { active, activeAndHover, darkFocus, hover } from "../../../theme/base/mixins/_interaction.js";
import { Icon, StyledIconWrapper } from "../../../icon/main/icon.view.js";

export const StyledHeaderTriggerContainer = styled.button<{
	$activated?: boolean;
	$disabled?: boolean;
	$multilingual?: boolean;
	$light?: boolean;
	$vertical?: boolean;
	$onlyGraphicIcon?: boolean;
	$onlyMetaIcon?: boolean;
}>(({ theme, $activated, $disabled, $multilingual, $light, $vertical, $onlyGraphicIcon, $onlyMetaIcon }) => {
	const { headerTrigger, button, baseInput } = theme.components;
	const onlyIcon = $onlyGraphicIcon || $onlyMetaIcon;

	return css`
		align-items: center;
		background: transparent;
		cursor: pointer;
		display: flex;
		padding: 0;
		&:disabled {
			pointer-events: none;
		}
		${StyledIconWrapper} {
			color: inherit;
			margin: 0;
			padding: 0;
			${activeAndHover(css`
				color: inherit;
			`)}
		}
		${!$disabled &&
		css`
			${active(css`
				text-decoration: ${headerTrigger.active.textDecoration};
			`)}
			${hover(css`
				text-decoration: ${headerTrigger.hover.textDecoration};
			`)}
		`}
		${!$vertical &&
		css`
			background: ${$activated && !$light && headerTrigger.activatedBackground};
			border: ${headerTrigger.border};
			color: ${$activated ? headerTrigger.activatedColor : headerTrigger.color};
			font-family: ${headerTrigger.fontFamily};
			font-size: ${headerTrigger.fontSize};
			font-weight: ${headerTrigger.fontWeight};
			gap: ${headerTrigger.gap};
			padding: ${headerTrigger.padding};
			position: relative;
			text-transform: ${headerTrigger.textTransform};

			${onlyIcon
				? css`
						border-radius: ${headerTrigger.onlyIcon.borderRadius};
						justify-content: center;
						min-height: ${headerTrigger.onlyIcon.minHeight};
						min-width: ${headerTrigger.onlyIcon.minWidth};
					`
				: css`
						border-radius: ${headerTrigger.borderRadius};
						min-height: ${headerTrigger.minHeight};
						min-width: ${headerTrigger.minHeight};
					`}

			${$multilingual &&
			css`
				background-color: ${$light
					? headerTrigger.multilingual.light.background
					: headerTrigger.multilingual.background};
				color: ${$light && headerTrigger.multilingual.light.color};
				gap: ${headerTrigger.multilingual.contentGap};
				height: 100%;
				min-height: inherit;
				padding: ${headerTrigger.multilingual.padding};
				width: 100%;
			`}
			
			${!$disabled &&
			css`
				${active(css`
					background: ${!$multilingual && headerTrigger.active.background};
					border: ${headerTrigger.active.border};
					color: ${headerTrigger.active.color};
					${$multilingual &&
					$light &&
					css`
						border-color: ${headerTrigger.multilingual.light.active.borderColor};
						color: ${headerTrigger.multilingual.light.active.color};
					`}
				`)}
				${hover(css`
					background: ${!$multilingual && headerTrigger.hover.background};
					border: ${headerTrigger.hover.border};
					color: ${headerTrigger.hover.color};
					${$multilingual &&
					$light &&
					css`
						border-color: ${headerTrigger.multilingual.light.hover.borderColor};
						color: ${headerTrigger.multilingual.light.hover.color};
					`}
				`)}
				&:focus {
					background: ${!$multilingual && headerTrigger.focus.background};
					border: ${headerTrigger.focus.border};
					color: ${headerTrigger.focus.color};
					outline: ${headerTrigger.focus.outline};
					${$multilingual &&
					$light &&
					css`
						border-color: ${headerTrigger.multilingual.light.focus.borderColor};
						color: ${headerTrigger.multilingual.light.focus.color};
						${darkFocus}
					`}
				}
			`}
		`}
		
		${$vertical &&
		$multilingual &&
		css`
			border: ${headerTrigger.border};
			border-radius: ${button.secondary.borderRadius};
			color: ${button.secondary.color};
			flex-direction: column;
			font-family: ${button.fontFamily};
			font-size: ${headerTrigger.vertical.languageFontSize};
			font-weight: ${button.fontWeight};
			height: ${baseInput.input.buttonIconSize};
			justify-content: center;
			padding: 0;
			width: ${baseInput.input.buttonIconSize};
			${!$disabled &&
			css`
				${active(css`
					border-color: ${button.secondary.interaction.active.color};
					color: ${headerTrigger.vertical.icon.activeColor};
				`)}
				${hover(css`
					border-color: ${button.secondary.interaction.hover.color};
					color: ${headerTrigger.vertical.icon.hoverColor};
				`)}
				&:focus {
					border-color: ${button.secondary.interaction.focus.color};
					color: ${headerTrigger.vertical.icon.focusColor};
					${darkFocus}
				}
			`}
		`}
	`;
});

export const StyledHeaderTriggerGraphicIcon = styled(Icon)<{
	$multilingual?: boolean;
	$vertical?: boolean;
}>(({ theme, $multilingual, $vertical }) => {
	const fontSize =
		$vertical && $multilingual
			? theme.components.headerTrigger.vertical.graphicFontSize
			: $multilingual
				? theme.components.headerTrigger.multilingual.graphicFontSize
				: theme.components.headerTrigger.graphicFontSize;

	return css`
		&&& {
			font-size: ${fontSize};
		}
	`;
});

export const StyledHeaderTriggerMetaIcon = styled(Icon)`
	&&& {
		font-size: ${({ theme }) => theme.components.headerTrigger.metaFontSize};
	}
`;

export const StyledHeaderTriggerText = styled.span`
	line-height: normal;
`;

export const StyledHeaderTriggerTextAbbreviation = styled.abbr<{ $vertical?: boolean }>(({ theme, $vertical }) => {
	const { headerTrigger } = theme.components;

	return css`
		text-decoration: none;
		${$vertical &&
		css`
			display: block;
			font-size: ${headerTrigger.vertical.languageFontSize};
			line-height: 1;
			text-decoration: none;
			text-transform: uppercase;
		`}
	`;
});
