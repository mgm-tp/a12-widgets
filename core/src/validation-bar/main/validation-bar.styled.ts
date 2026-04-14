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

import {
	StyledListItemContent,
	StyledListItemWrapper,
	StyledListItemGraphic,
	StyledListItemMeta,
	StyledListItemText
} from "../../list/main/list.styled.js";
import { List } from "../../list/main/list.view.js";
import { StyledIconWrapper } from "../../icon/main/icon.view.js";
import {
	StyledContentBoxHeading,
	StyledContentBoxHeader,
	StyledContentBoxTitleWrapper,
	StyledContentBoxFooter
} from "../../contentbox/main/template/contentbox.tpl.styled.js";
import type { DefaultThemeType } from "../../theme/schema.js";
import { activeAndHover, brightFocus } from "../../theme/base/mixins/_interaction.js";
import { StyledQuickAccessButton } from "../../quick-access-button/main/quick-access-button.styled.js";
import { StyledButton, variantButtonStyles } from "../../button/main/button.styled.js";
import {
	StyledPaginationWrapper,
	StyledSimplePaginationAction,
	StyledSimplePaginationLabel
} from "../../pagination/main/pagination.styled.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { ValidationBarVariant } from "./validation-bar.api.js";

const mobileValidationBarState = (
	cssProperty: "background" | "color",
	validationBarVariant: ValidationBarVariant,
	theme: DefaultThemeType
) => {
	const { variant } = theme.components.validationBar;

	return css`
		background-color: ${cssProperty === "background" && variant[validationBarVariant]};
		color: ${cssProperty === "color" && variant.text[validationBarVariant]};
	`;
};

export namespace StyledMobileValidationBar {
	export const StyledMobileValidationActionItem = styled.div.withConfig({
		displayName: "StyledMobileValidationActionItem-sc-"
	})`
		align-items: center;
		display: flex;
		flex: 1;
		justify-content: center;
	`;

	export const StyledMobileValidationWrapper = styled.div.withConfig({
		displayName: "StyledMobileValidationWrapper-sc-"
	})<{
		$variant: ValidationBarVariant;
	}>(({ theme, $variant }) => {
		const { borderRadius, graphic } = theme.components.validationBar.mobile;
		const { variant } = theme.components.validationBar;
		const variantColor = variant.text[$variant];

		const buttonInteractionStyle = css`
			border-color: ${variantColor};
			outline-color: ${variantColor};
		`;

		return css`
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 100%;
			border-radius: ${borderRadius};
			&:focus {
				outline: none;
			}
			${StyledContentBoxHeading} {
				border: none;
			}
			${StyledContentBoxTitleWrapper} {
				overflow: hidden;
			}
			${StyledContentBoxFooter} {
				padding: 0;
			}

			${StyledContentBoxHeader} {
				${StyledContentBoxHeading} {
					${mobileValidationBarState("background", $variant, theme)}

					${StyledContentBoxTitleWrapper} {
						gap: ${graphic.gap};
					}

					${StyledIconWrapper}, ${StyledContentBoxTitleWrapper} {
						${mobileValidationBarState("color", $variant, theme)}
					}

					${StyledButton} {
						${activeAndHover(buttonInteractionStyle)}
						&:focus {
							${buttonInteractionStyle}
						}
					}
				}
			}
		`;
	});

	export const StyledMobileValidationOverview = styled.section.withConfig({
		displayName: "StyledMobileValidationOverview-sc-"
	})<{ $variant: ValidationBarVariant }>(({ theme, $variant }) => {
		const { minHeight, padding } = theme.components.validationBar.mobile.overview;

		return css`
			align-items: center;
			display: flex;
			min-height: ${minHeight};
			padding: ${padding};
			${mobileValidationBarState("background", $variant, theme)}

			${StyledIconWrapper}, ${StyledMobileValidationGraphicContent} {
				${mobileValidationBarState("color", $variant, theme)}
			}
		`;
	});

	export const StyledMobileValidationOverviewLeft = styled.div.withConfig({
		displayName: "StyledMobileValidationOverviewLeft-sc-"
	})(({ theme }) => {
		const { gap } = theme.components.validationBar.mobile.graphic;

		return css`
			gap: ${gap};
			display: flex;
			flex: 1;
			overflow: hidden;
		`;
	});

	export const StyledMobileValidationOverviewRight = styled.div.withConfig({
		displayName: "StyledMobileValidationOverviewRight-sc-"
	})(({ theme }) => {
		const { fontSize } = theme.components.validationBar.mobile.overview.right;

		return css`
			& > ${StyledIconWrapper} {
				display: block;
				font-size: ${fontSize};
			}
		`;
	});

	export const StyledMobileValidationGraphic = styled.div.withConfig({
		displayName: "StyledMobileValidationGraphic-sc-"
	})`
		display: flex;
		overflow: hidden;
	`;

	export const StyledMobileValidationGraphicIcon = styled.div.withConfig({
		displayName: "StyledMobileValidationGraphicIcon-sc-"
	})(({ theme }) => {
		const { margin, fontSize } = theme.components.validationBar.mobile.graphic.icon;

		return css`
			margin: ${margin};
			${StyledIconWrapper} {
				display: block;
				font-size: ${fontSize};
			}
		`;
	});

	export const StyledMobileValidationGraphicContent = styled.div.withConfig({
		displayName: "StyledMobileValidationGraphicContent-sc-"
	})(({ theme }) => {
		const { fontFamily, fontSize, fontWeight } = theme.components.validationBar.mobile.graphic.content;

		return css`
			align-self: center;
			font-family: ${fontFamily};
			font-size: ${fontSize};
			font-weight: ${fontWeight};
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		`;
	});

	export const StyledMobileValidationContent = styled.div.withConfig({
		displayName: "StyledMobileValidationContent-sc-"
	})(({ theme }) => {
		const { background, padding, height } = theme.components.validationBar.mobile.content;

		return css`
			background-color: ${background};
			flex: 1;
			overflow-y: auto;
			padding: ${padding};
			&:after {
				content: "";
				display: block;
				height: ${height};
			}
		`;
	});

	export const StyledMobileValidationActions = styled.div.withConfig({
		displayName: "StyledMobileValidationActions-sc-"
	})`
		display: flex;
		flex-grow: 1;
		height: 100%;
	`;

	export const StyledPreviewList = styled(List).withConfig({
		displayName: "StyledPreviewList-sc-"
	})(({ theme }) => {
		const { background } = theme.components.validationBar.mobile.previewList;

		return css`
			background-color: ${background};
			flex: 1;
			overflow-y: auto;
		`;
	});

	export const StyledPreviewListItem = styled(List.Item).withConfig({
		displayName: "StyledPreviewListItem-sc-"
	})(({ theme }) => {
		const {
			padding,
			borderBottom,
			graphicHeight,
			graphicMargin,
			graphicFontSize,
			textFontSize,
			metaFontSize,
			metaMargin
		} = theme.components.validationBar.mobile.previewList.item;

		return css`
			padding: ${padding};
			&.${StyledListItemWrapper}:last-child::after {
				border-bottom: ${borderBottom};
			}

			${StyledListItemContent} {
				align-items: stretch;
				padding: 0;
			}

			${StyledListItemGraphic} {
				align-self: flex-start;
				height: ${graphicHeight};
				margin: ${graphicMargin};
				${StyledIconWrapper} {
					font-size: ${graphicFontSize};
				}
			}

			${StyledListItemText} {
				font-size: ${textFontSize};
			}

			${StyledListItemMeta} {
				font-size: ${metaFontSize};
				margin: ${metaMargin};
			}
		`;
	});
}

export namespace StyledValidationBar {
	export const StyledValidationBarWrapper = styled.section.withConfig({
		displayName: "StyledValidationBarWrapper-sc-"
	})<{ $variant: ValidationBarVariant }>(({ theme, $variant }) => {
		const { padding, variant, pagination } = theme.components.validationBar;
		const backgroundColor = variant[$variant];

		return css`
			background-color: ${backgroundColor};
			color: ${backgroundColor};
			display: flex;
			flex-direction: column;
			padding: ${padding};

			&:focus {
				outline: none;
			}

			${StyledPaginationWrapper}[data-role="${DataRoles.SimplePagination}"] {
				margin: ${pagination.margin};
			}
		`;
	});

	export const StyledValidationBarHeader = styled.div.withConfig({
		displayName: "StyledValidationBarHeader-sc-"
	})<{ $variant: ValidationBarVariant }>(({ theme, $variant }) => {
		const { header } = theme.components.validationBar;
		const warningColor = theme.colors.variant.text.warning;

		return css`
			align-items: center;
			box-sizing: border-box;
			display: flex;
			padding: ${header.padding};
			min-height: ${header.minHeight};

			${$variant === "warning" &&
			css`
				${variantButtonStyles({ theme, isWarning: true, roundedIconButton: false })}

				${StyledPaginationWrapper} {
					border-color: ${warningColor};

					${StyledSimplePaginationAction}[aria-disabled="true"] {
						border: none;
					}

					${StyledSimplePaginationLabel} {
						color: ${warningColor};
					}
				}
			`}
		`;
	});

	export const StyledValidationBarGraphic = styled.div.withConfig({
		displayName: "StyledValidationBarGraphic-sc-"
	})<{ $variant: ValidationBarVariant }>(({ theme, $variant }) => {
		const { graphic } = theme.components.validationBar;

		return css`
			display: flex;
			justify-content: center;
			margin: ${graphic.margin};
			padding: ${graphic.padding};

			${StyledIconWrapper} {
				${mobileValidationBarState("color", $variant, theme)}
				font-size: ${graphic.fontSize};
			}
		`;
	});

	export const StyledValidationBarTitle = styled.div.withConfig({
		displayName: "StyledValidationBarTitle-sc-"
	})<{ $variant: ValidationBarVariant }>(({ theme, $variant }) => {
		const { title } = theme.components.validationBar;

		return css`
			flex: 1;
			line-height: ${title.lineHeight};
			outline: none;
			overflow: hidden;
			padding: ${title.padding};
			&:focus {
				${brightFocus}
			}

			& + ${StyledQuickAccessButton} {
				margin: ${title.margin};
			}

			${mobileValidationBarState("color", $variant, theme)}
		`;
	});

	export const StyledValidationBarPrimaryTitle = styled.div.withConfig({
		displayName: "StyledValidationBarPrimaryTitle-sc-"
	})(({ theme }) => {
		const { primaryTitle } = theme.components.validationBar;

		return css`
			font-family: ${primaryTitle.fontFamily};
			font-size: ${primaryTitle.fontSize};
			font-weight: ${primaryTitle.fontWeight};
		`;
	});

	export const StyledValidationBarSecondaryTitle = styled.div.withConfig({
		displayName: "StyledValidationBarSecondaryTitle-sc-"
	})(({ theme }) => {
		const { secondaryTitle } = theme.components.validationBar;

		return css`
			font-family: ${secondaryTitle.fontFamily};
			font-size: ${secondaryTitle.fontSize};
			font-weight: ${secondaryTitle.fontWeight};
		`;
	});

	export const StyledValidationBarContent = styled.div(({ theme }) => {
		const { content } = theme.components.validationBar;

		return css`
			align-items: flex-start;
			background-color: ${content.background};
			border-radius: ${content.borderRadius};
			color: ${content.color};
			font-size: ${content.fontSize};
			font-weight: ${content.fontWeight};
			margin: ${content.margin};
			height: ${content.height};
			overflow-y: auto;
			outline: none;
			padding: ${content.padding};
			&:after {
				content: "";
				display: block;
				height: ${content.spacingBottom};
				width: 100%;
			}
		`;
	});
}
