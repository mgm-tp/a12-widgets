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

import { getBaseButtonVariantStyles, StyledButton } from "../../../button/main/button.styled.js";
import { StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { activeAndHover } from "../../../theme/base/mixins/_interaction.js";
import { StyledContentBox } from "../../../contentbox/main/template/contentbox.tpl.styled.js";
import { Button } from "../../../button/main/button.view.js";
import { StyledResizeHandlerWrapper } from "../../resizable/resize-handler.styled.js";

export namespace StyledApplicationFrame {
	export const StyledFooter = styled.div.withConfig({ displayName: "StyledFooter-sc-" })``;

	export const StyledWrapper = styled.div.withConfig({ displayName: "StyledWrapper-sc-" })<{
		$stickyFooter?: boolean;
	}>(({ $stickyFooter, theme }) => {
		const { components, applicationStyles } = theme;

		return css`
			background-color: ${components.applicationFrame.background};
			box-sizing: border-box;
			bottom: ${$stickyFooter ? "0" : "unset"};
			display: flex;
			flex-direction: column;
			isolation: isolate;
			left: 0;
			position: absolute;
			right: 0;
			top: 0;
			@media only screen and (max-width: ${applicationStyles.responsive.mobileMaxWidth}) {
				${$stickyFooter &&
				css`
					height: 100%;
					min-height: fit-content;
					${StyledFooter} {
						bottom: 0;
						position: sticky;
					}
				`}
			}
		`;
	});

	export const StyledHeader = styled.div.withConfig({ displayName: "StyledHeader-sc-" })(({ theme }) => {
		const { applicationFrame } = theme.components;

		return css`
			box-shadow: ${applicationFrame.header.boxShadow};
			flex: none;
			min-height: ${applicationFrame.header.minHeight};
			position: sticky;
			top: 0;
			width: 100%;
			z-index: 1;
		`;
	});

	export const StyledContent = styled.div.withConfig({ displayName: "StyledContent-sc-" })<{
		$hasToggleButton?: boolean;
		$subExpanded?: boolean;
		$disabledCollapsingSub?: boolean;
	}>(({ theme, $hasToggleButton, $subExpanded, $disabledCollapsingSub }) => {
		const { responsive } = theme.applicationStyles;
		const { applicationFrame, menu } = theme.components;

		return css`
			flex: 1;
			position: ${applicationFrame.content.position};
			width: 100%;
			isolation: isolate;

			${($subExpanded || ($subExpanded && !$disabledCollapsingSub)) &&
			css`
				~ ${StyledToggleSidebarButtonWrapper} {
					z-index: 1;
				}
			`}

			@media only screen and (min-width: ${responsive.tabletMinWidth}) {
				display: flex;
				justify-content: space-between;
				position: static;
				overflow: auto;
			}

			@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
				display: flex;
				flex-direction: column;
				&:has(${StyledContentBox}) {
					min-height: 0;
				}
				${$hasToggleButton &&
				css`
					height: ${menu.slidingMenu.height};
				`}
			}
		`;
	});

	export const StyledMainContainer = styled.div.withConfig({ displayName: "StyledMainContainer-sc-" })<{
		$sub?: boolean;
		$sidebarWidth?: string;
	}>(({ theme, $sub, $sidebarWidth }) => {
		const { sidebar, mainContainer } = theme.components.applicationFrame;
		const { responsive } = theme.applicationStyles;

		return css`
			box-sizing: border-box;
			height: 100%;
			outline: none;
			padding: ${mainContainer.padding};
			position: absolute;
			right: 0;
			top: 0;
			width: 100%;

			${$sub &&
			css`
				overflow-y: auto;
				transition: width ${sidebar.transition};
				width: calc(100% - ${$sidebarWidth});
			`}

			@media only screen and (min-width: ${responsive.tabletMinWidth}) {
				position: static;
			}

			@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
				min-height: 0;
				padding: 0;
				position: static;
				transition: transform ${sidebar.transition};
				width: 100%;
			}
		`;
	});
	export const StyledSidebar = styled.div.withConfig({ displayName: "StyledSidebar-sc-" })<{
		$width: string;
		$subExpanded?: boolean;
		$disabledCollapsingSub?: boolean;
		$minimized?: boolean;
		$maximized?: boolean;
		$resizable?: boolean;
	}>(({ theme, $width, $subExpanded, $disabledCollapsingSub, $minimized, $resizable }) => {
		const { sidebar } = theme.components.applicationFrame;
		const { responsive } = theme.applicationStyles;

		return css`
			background-color: ${sidebar.background};
			box-shadow: ${sidebar.boxShadow};
			box-sizing: border-box;
			height: 100%;
			left: 0;
			padding-bottom: ${$disabledCollapsingSub ? 0 : sidebar.paddingBottom};
			position: absolute;
			top: 0;
			transition: width ${sidebar.transition};
			width: ${$width};

			${($subExpanded || ($subExpanded && !$disabledCollapsingSub)) &&
			css`
				z-index: 1;
			`}

			${!$subExpanded &&
			css`
				z-index: 0;
				transition:
					width 0.1s,
					z-index 0.15s;
			`}

			${$minimized &&
			css`
				flex-shrink: 0;
				min-width: ${!$resizable && sidebar.expandedMinimizedMinWidth};
			`}

			@media only screen and (min-width: ${responsive.tabletMinWidth}) {
				position: relative;
				${$subExpanded &&
				!$disabledCollapsingSub &&
				css`
					z-index: 0;
				`}

				// Reset position of resize handler wrapper to avoid the collapsed button shifting upward after expanding.
				${StyledResizeHandlerWrapper} {
					position: unset;
				}
			}

			@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
				box-shadow: none;
				padding-bottom: 0;
				transform: translateX(-100%);
				transition:
					transform ${sidebar.transition},
					visibility ${sidebar.transition};
				visibility: hidden;
				width: 100%;

				${$subExpanded &&
				css`
					transform: translateX(0);
					visibility: visible;
					width: 100%;
					z-index: 1;
				`}

				${$minimized &&
				css`
					min-width: unset;
				`}
			}
		`;
	});

	export const StyledSidebarContainer = styled.div.withConfig({ displayName: "StyledSidebarContainer-sc-" })(
		({ theme }) => {
			return css`
				background-color: ${theme.components.applicationFrame.sidebar.containerBackground};
				border-right: ${theme.components.applicationFrame.sidebar.containerBorderRight};
				box-sizing: border-box;
				height: 100%;
				overflow-y: auto;
				width: 100%;
			`;
		}
	);

	export const StyledToggleSidebarButtonWrapper = styled.div.withConfig({
		displayName: "StyledToggleSidebarButtonWrapper-sc-"
	})<{ $smallView: boolean }>(({ theme, $smallView }) => {
		const { trigger } = theme.components.applicationFrame;
		const { responsive } = theme.applicationStyles;

		return css`
			bottom: 0;
			height: ${trigger.height};
			text-align: right;
			position: absolute;
			user-select: none;
			width: 100%;

			${$smallView &&
			css`
				display: none;
			`}

			@media screen and (max-width: ${responsive.mobileMaxWidth}) {
				bottom: ${trigger.mobile.bottom};
				border-radius: 50%;
				box-shadow: ${trigger.mobile.boxShadow};
				height: auto;
				right: ${trigger.mobile.right};
				width: auto;
				display: ${$smallView ? "block" : "none"};
				position: fixed;
			}
		`;
	});

	export const StyledToggleSidebarButton = styled(Button).withConfig({ displayName: "StyledToggleSidebarButton-sc-" })<{
		$smallView: boolean;
		$subExpanded?: boolean;
	}>(({ theme, $smallView, $subExpanded }) => {
		const { trigger } = theme.components.applicationFrame;
		const { responsive } = theme.applicationStyles;

		return css`
			${getBaseButtonVariantStyles(trigger)}

			font-size: ${trigger.fontSize};
			height: 100%;
			width: ${trigger.height};

			${!$smallView &&
			!$subExpanded &&
			css`
				${StyledButton} {
					width: 100%;
				}
			`}

			${StyledIconWrapper} {
				padding: ${trigger.iconPadding};
			}

			@media screen and (min-width: ${responsive.tabletMinWidth}) {
				&& {
					background-color: transparent;
					border-radius: 0;
					${activeAndHover(css`
						background-color: transparent;
					`)}
					&:focus {
						background-color: transparent;
					}
				}
			}

			@media screen and (max-width: ${responsive.mobileMaxWidth}) {
				&& {
					border-radius: inherit;
					height: ${trigger.mobile.size};
					width: ${trigger.mobile.size};

					${getBaseButtonVariantStyles(trigger.mobile)}

					${$subExpanded &&
					css`
						${StyledIconWrapper} {
							font-size: ${trigger.mobile.collapsedFontSize};
						}
					`}
				}
			}
		`;
	});
}
