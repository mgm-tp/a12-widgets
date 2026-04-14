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

import { active, darkFocus, hover } from "../../theme/base/mixins/_interaction.js";
import { StyledIconWrapper } from "../../icon/main/icon.view.js";
import { StyledButton } from "../../button/main/button.styled.js";
import { slideIn, slideOut } from "../../theme/base/mixins/_animation.js";
import { DataRoles } from "../../common/main/data-roles.js";

export const StyledPopup = styled.div.withConfig({ displayName: "StyledPopup-sc-" })`
	display: inline-block;
	font-size: 0;
	-webkit-tap-highlight-color: transparent;
	${StyledIconWrapper} {
		position: relative;
		&:before {
			bottom: 0;
			left: 0;
			position: absolute;
			top: 0;
			right: 0;
		}
		&:focus {
			outline: none;
			&:before {
				content: "";
				${darkFocus}
			}
		}
	}
`;

export const StyledPopupMenuHeaderWrapper = styled.div.withConfig({ displayName: "StyledPopupMenuHeaderWrapper-sc-" })(
	({ theme }) => {
		const { menu, header } = theme.components.popupMenu;

		return css`
			background: ${menu.background};
			display: flex;
			min-height: ${header.minHeight};
			padding: ${header.padding};
			position: sticky;
			top: 0;
			z-index: 1;
			align-items: center;
		`;
	}
);

export const StyledPopupMenuHeader = styled.div.withConfig({ displayName: "StyledPopupMenuHeader-sc-" })(
	({ theme }) => {
		const { header } = theme.components.popupMenu;

		return css`
			align-items: center;
			font-weight: ${header.fontWeight};
			margin: 0 auto 0 0;
		`;
	}
);

export const StyledPopupMenu = styled.div.withConfig({ displayName: "StyledPopupMenu-sc-" })<{
	$isMobileOrTablet?: boolean;
	$isMobile?: boolean;
	$hasHeader?: boolean;
	$showMenu?: boolean;
	$baseClassName?: string;
	$transitionTime?: number;
	$hasVerticalScrollbar?: boolean;
}>(({ theme, $isMobileOrTablet, $isMobile, $hasHeader, $baseClassName, $transitionTime, $hasVerticalScrollbar }) => {
	const { menu } = theme.components.popupMenu;
	const transitionTime = `${$transitionTime}ms`;

	return css`
		background: ${menu.background};
		max-width: ${menu.maxWidth};
		min-width: ${menu.minWidth};
		isolation: isolate;
		outline: 1px solid transparent;
		overflow-y: auto;
		overflow-x: hidden;
		-webkit-tap-highlight-color: transparent;

		[data-role="${DataRoles.TabPanel.SubTabList}"] && {
			min-width: ${theme.components.tabPanel.tabs.minWidth};
			${$hasVerticalScrollbar &&
			css`
				// To prevent the scrollbar on Firefox from affecting the tab list's width.
				overflow-y: scroll;
			`}
		}

		${$isMobileOrTablet
			? css`
					animation-duration: ${transitionTime};
					border-radius: ${menu.borderRadius};
					bottom: 0;
					max-height: 90%;
					position: fixed;
					width: ${$isMobile ? "100%" : menu.width};
					-webkit-animation-duration: ${transitionTime};

					&.${$baseClassName}-enter {
						opacity: 0;
					}

					&.${$baseClassName}-enter-active {
						animation-name: ${slideIn()};
						opacity: 1;
						-webkit-animation-name: ${slideIn()};
					}

					&.${$baseClassName}-exit {
						opacity: 1;
					}

					&.${$baseClassName}-exit-active {
						animation-name: ${slideOut()};
						opacity: 0;
						-webkit-animation-name: ${slideOut()};
					}

					${!$hasHeader &&
					css`
						box-shadow: ${menu.boxShadowModal};
					`}
				`
			: css`
					box-shadow: ${menu.boxShadow};
				`}
	`;
});

export const StyledPopupMenuWrapper = styled(StyledPopupMenu).withConfig({ displayName: "StyledPopupMenuWrapper-sc-" })(
	({ theme }) => {
		const { menu } = theme.components.popupMenu;

		return css`
			border-top: ${menu.borderTop};
			border-left: ${menu.borderLeft};
			list-style: none;
			margin: 0;
			max-height: ${menu.maxHeight};
			padding: 0;
		`;
	}
);

export const StyledPopupMenuItem = styled.li.withConfig({ displayName: "StyledPopupMenuItem-sc-" })<{
	$withPadding?: boolean;
	hasLoadingButton?: boolean;
	$isInResponsiveGroupButton?: boolean;
}>(({ theme, $withPadding, hasLoadingButton, $isInResponsiveGroupButton }) => {
	const { item, button } = theme.components.popupMenu;

	return css`
		border-bottom: ${item.borderBottom};
		height: ${item.height};
		&:last-child {
			border-bottom: none;
		}
		${active(css`
			background: ${item.active.background};
			box-shadow: ${item.active.boxShadow};
		`)}
		${hover(css`
			background: ${item.hover.background};
			box-shadow: ${item.hover.boxShadow};
		`)}
			${hasLoadingButton &&
		css`
			pointer-events: none;
		`}
			${StyledButton} {
			background: transparent;
			border-radius: 0;
			box-shadow: none;
			color: ${button.color};
			font-size: ${button.fontSize};
			font-weight: ${button.fontWeight};
			height: 100%;
			text-align: ${button.textAlign};
			white-space: nowrap;
			width: 100%;
			justify-content: flex-start;
			padding: ${button.padding};
			${$withPadding &&
			css`
				padding-left: ${item.paddingLeft};
			`}

			${!$isInResponsiveGroupButton &&
			css`
				text-transform: none;
			`}

			${StyledIconWrapper} {
				font-size: ${button.icon.fontSize};
				height: ${button.icon.height};
				display: inline-flex;
				align-items: center;
			}
			&:disabled {
				background: ${button.disabled.background};
				color: ${button.disabled.color};
				cursor: auto;
			}
		}
	`;
});
