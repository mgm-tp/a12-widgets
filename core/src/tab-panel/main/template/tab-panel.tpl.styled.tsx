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

import { StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { active, hover, brightFocus } from "../../../theme/base/mixins/_interaction.js";
import { StyledButton } from "../../../button/main/button.styled.js";

import type { TabPanelOrientation } from "../tab-panel.api.js";

export interface TabPanelTabStyledProps {
	$disabled?: boolean;
	$selected?: boolean;
	$highlighted?: boolean;
	$orientation?: TabPanelOrientation;
	$mobileSubListLayout?: boolean;
}

export const BaseTabPanelTab = styled.li.withConfig({ displayName: "BaseTabPanelTab-sc-" })<TabPanelTabStyledProps>(
	({ theme, $disabled, $selected, $highlighted, $orientation, $mobileSubListLayout }) => {
		const { tab, groupTab } = theme.components.tabPanel;

		const isVertical = $orientation === "vertical";
		const isHorizontal = $orientation === "horizontal";
		const isHighlightedItem = $highlighted && !$selected;

		return css`
			align-items: center;
			box-sizing: border-box;
			color: ${tab.color};
			display: flex;
			font-size: ${tab.fontSize};
			justify-content: center;
			list-style: none;
			min-height: ${tab.minHeight};
			position: relative;
			padding: ${theme.spacing.horizontalSpacing.horizWhiteSpacingxs}px;
			${StyledIconWrapper} {
				color: inherit;
				font-size: inherit;
			}

			${isHorizontal &&
			css`
				min-width: ${tab.minWidth};
			`}

			&:before {
				border: ${tab.border};
				bottom: 0;
				content: "";
				left: 0;
				position: absolute;
				right: 0;
				top: 0;
			}

			${!$disabled &&
			css`
				cursor: pointer;

				${active(css`
					background-color: ${tab.active.background};
					color: ${tab.active.color};

					&:before {
						border-color: ${tab.active.borderColor};
					}
				`)}

				${hover(css`
					background-color: ${tab.hover.background};
					color: ${tab.hover.color};

					&:before {
						border-color: ${tab.hover.borderColor};
					}
				`)}
				
        	&:focus {
					background-color: ${tab.focus.background};
					color: ${tab.focus.color};
					margin: ${isVertical && tab.focus.margin};
					${brightFocus}

					&:before {
						border-color: ${tab.focus.borderColor};
					}
				}
			`}

			${isHighlightedItem &&
			css`
				background-color: ${tab.highlighted.background};
				color: ${tab.highlighted.color};

				&:after {
					background-color: ${tab.highlighted.afterBackground};
					bottom: 0;
					content: "";
					left: 0;
					position: absolute;
					top: 0;
					${isHorizontal
						? css`
								height: ${tab.highlighted.borderTopWidth};
								width: 100%;
							`
						: css`
								width: ${tab.highlighted.borderLeftWidth};
								height: 100%;
							`}
				}

				&:before {
					${isHorizontal
						? css`
								border-top-width: ${tab.highlighted.borderTopWidth};
							`
						: css`
								border-left-width: ${tab.highlighted.borderLeftWidth};
							`};
				}

				${StyledIconWrapper} {
					font-size: ${isVertical && tab.highlighted.fontSize};
				}

				${active(css`
					background-color: ${tab.highlighted.activeBackground};
				`)}

				${hover(css`
					background-color: ${tab.highlighted.hoverBackground};
					&:after {
						width: 0;
					}
				`)}
				
        &:focus {
					background-color: ${tab.highlighted.focusBackground};
					&:after {
						width: 0;
					}
				}
			`}

		${$selected &&
			css`
				background-color: ${tab.selected.background};
				color: ${tab.selected.color};

				&:after {
					background-color: ${tab.selected.afterBackground};
					bottom: 0;
					content: "";
					left: 0;
					position: absolute;
					top: 0;
					${isHorizontal
						? css`
								height: ${tab.selected.borderTopWidth};
								width: 100%;
							`
						: css`
								width: ${tab.selected.borderLeftWidth};
								height: 100%;
							`}
				}

				&:before {
					${isHorizontal
						? css`
								border-top-width: ${tab.selected.borderTopWidth};
							`
						: css`
								border-left-width: ${tab.selected.borderLeftWidth};
							`};
				}

				${StyledIconWrapper} {
					font-size: ${isVertical && tab.selected.fontSize};
				}

				${active(css`
					background-color: ${tab.selected.activeBackground};
				`)}

				${hover(css`
					background-color: ${tab.selected.hoverBackground};
					&:after {
						width: 0;
					}
				`)}
			
			&:focus {
					background-color: ${tab.selected.focusBackground};
					&:after {
						width: 0;
					}
				}
			`}
			
		${$disabled &&
			css`
				background: ${tab.disabled.background};
				color: ${tab.disabled.color};
			`}

		${$mobileSubListLayout &&
			css`
				font-size: ${groupTab.subItem.labelFontSize};
				justify-content: flex-start;
				padding: 0;
				margin: ${groupTab.subItem.margin};

				${StyledIconWrapper} {
					font-size: ${groupTab.subItem.iconFontSize};
					min-width: ${groupTab.subItem.iconMinWidth};
				}
			`}
		`;
	}
);

export const BaseTabPanelContent = styled.div.withConfig({ displayName: "BaseTabPanelContent-sc-" })(({ theme }) => {
	return css`
		border: ${theme.components.tabPanel.contentBorder};
		flex-grow: 1;
		overflow-y: auto;
	`;
});

export const BaseTabPanelHeader = styled.div.withConfig({ displayName: "BaseTabPanelHeader-sc-" })(({ theme }) => {
	const { header } = theme.components.tabPanel;

	return css`
		align-items: center;
		justify-content: space-between;
		background-color: ${header.background};
		display: flex;
		min-height: ${header.minHeight};
		padding: ${header.padding};
		+ ${BaseTabPanelContent} {
			border-top: none;
		}
	`;
});

export const BaseTabPanelAddonSuffix = styled.div.withConfig({ displayName: "BaseTabPanelAddonSuffix-sc-" })(
	({ theme }) => {
		const { header } = theme.components.tabPanel;

		return css`
			display: flex;
			justify-content: flex-end;
			gap: ${header.addonGap};
			${StyledButton} {
				color: ${header.buttonColor};
			}
			&:only-child {
				flex: 1;
			}
		`;
	}
);

export const BaseTabPanelTabContent = styled.div.withConfig({ displayName: "BaseTabPanelTabContent-sc-" })<{
	$mobileSubListLayout?: boolean;
}>(({ theme, $mobileSubListLayout }) => {
	const { groupTab } = theme.components.tabPanel;

	return css`
		display: inline-flex;
		justify-content: center;

		${$mobileSubListLayout &&
		css`
			align-items: center;
			display: flex;
			gap: ${groupTab.subItem.gap};
			justify-content: flex-start;
			padding: ${groupTab.subItem.padding};
			width: 100%;
		`}
	`;
});

export const StyledTabPanelHeading = styled.div.withConfig({ displayName: "StyledTabPanelHeading-sc-" })(
	({ theme }) => {
		const { heading } = theme.components.tabPanel.header;

		return css`
			flex: 1;
			min-width: 0;
			color: ${heading.color};
			font-size: ${heading.fontSize};
			font-weight: ${heading.fontWeight};
			padding: ${heading.padding};
			padding-right: 0;
		`;
	}
);
