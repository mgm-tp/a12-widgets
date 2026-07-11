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

import { StyledIconWrapper } from "../../icon/main/icon.view.js";
import { active, activeAndHover, darkFocus, hover } from "../../theme/base/mixins/_interaction.js";
import { breakWord } from "../../theme/base/mixins/_break-word.js";
import { getHorizontalSpace } from "../../common/main/utils.js";

import type { IconVerticalAlignment } from "./typography.api.js";

export type Level = 1 | 2 | 3 | 4 | 5;

const iconAlignmentStyle = (alignment: IconVerticalAlignment) => {
	return css`
		align-self: ${alignment === "top" ? "flex-start" : alignment === "middle" ? "center" : "flex-end"};
	`;
};

export const StyledTypographyWrapper = styled.div.withConfig({ displayName: "StyledTypographyWrapper-sc-" })<{
	$level: Level;
	$compact?: boolean;
}>(({ theme, $level, $compact }) => {
	const { typography } = theme.components;
	const headlineLevel = typography[`headline${$level}`];

	return css`
		box-sizing: border-box;
		background-color: ${headlineLevel.wrapperBG};
		display: flex;
		min-height: ${typography.wrapper.minHeight};
		outline: none;
		padding: ${$compact ? typography.collapsible.compact : typography.wrapper.padding};
		position: relative;

		&:hover [class*="StyledTypographyHeaderActions"],
		&:focus-within [class*="StyledTypographyHeaderActions"] {
			opacity: 1;

			[data-type="icon"] {
				border-radius: 4px;

				${StyledIconWrapper} {
					color: inherit;
				}

				&:hover ${StyledIconWrapper} {
					color: inherit;
				}
			}
		}
	`;
});

export const StyledTypographyDivider = styled.div.withConfig({ displayName: "StyledTypographyDivider-sc-" })<{
	$level: Level;
}>(({ theme, $level }) => {
	const { typography } = theme.components;

	return css`
		border-top: ${typography[`headline${$level}`].borderTop};
		bottom: -1px;
		left: 0;
		position: absolute;
		right: 0;
	`;
});

export const StyledTypographyGraphic = styled.div.withConfig({ displayName: "StyledTypographyGraphic-sc-" })<{
	$level: Level;
	$iconVerticalAlignment: IconVerticalAlignment;
	$hasHeaderActions?: boolean;
}>(({ theme, $level, $iconVerticalAlignment, $hasHeaderActions }) => {
	const { typography } = theme.components;

	return css`
		align-items: center;
		display: flex;
		height: ${typography[`headline${$level}`].height};
		margin: ${typography.graphic.margin};

		${$hasHeaderActions
			? css`
					align-self: center;
				`
			: css`
					${iconAlignmentStyle($iconVerticalAlignment)}
				`}

		${StyledIconWrapper} {
			align-items: center;
			background-color: ${typography.graphic.iconBG};
			border-radius: 50%;
			color: inherit;
			display: flex;
			font-size: ${typography.graphic.fontSize};
			height: ${typography.graphic.iconSize};
			justify-content: center;
			width: ${typography.graphic.iconSize};
		}
	`;
});

export const StyledTypographyHeadline = styled.div.withConfig({ displayName: "StyledTypographyHeadline-sc-" })<{
	$level: Level;
	$collapsible?: boolean;
	$noFocus?: boolean;
	$noEffect?: boolean;
	$typographyColor?: string;
	$compact?: boolean;
}>(({ theme, $level, $collapsible, $noFocus, $noEffect, $typographyColor, $compact }) => {
	const { typography } = theme.components;
	const headlineLevel = typography[`headline${$level}`];
	const compactStyle = typography.collapsible.compact;

	return css`
		color: ${$typographyColor ?? headlineLevel.color};
		font-family: ${headlineLevel.font};
		font-size: ${$compact ? `calc(${headlineLevel.fontSize} * 0.75)` : headlineLevel.fontSize};
		font-weight: ${$compact ? theme.typography.fontWeight.boldFontWeight : headlineLevel.fontWeight};
		margin: ${headlineLevel.margin};
		outline: none;
		padding: ${headlineLevel.padding};
		text-transform: ${headlineLevel.textTransform};

		${$collapsible &&
		!$noEffect &&
		!$compact &&
		css`
			cursor: pointer;
			-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
			${active(css`
				color: ${typography.collapsible.activeColor};
				${StyledTypographyWrapper} {
					background-color: ${typography.collapsible.activeBG};
				}
			`)}
			${hover(css`
				color: ${typography.collapsible.hoverColor};
				${StyledTypographyWrapper} {
					background-color: ${typography.collapsible.hoverBG};
				}
			`)}
		  ${activeAndHover(css`
				${StyledTypographyDivider} {
					border-top-color: transparent;
				}
				${StyledTypographyGraphic} ${StyledIconWrapper} {
					background-color: transparent;
				}
			`)}
		`}

		${$collapsible &&
		!$noEffect &&
		$compact &&
		css`
			${StyledIconWrapper} {
				background-color: transparent;
			}

			cursor: pointer;
			-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
			${active(css`
				${StyledTypographyWrapper} {
					background-color: ${compactStyle?.activeBackgroundColor};
					box-shadow: ${compactStyle?.activeBoxShadow};
				}
			`)}
			${hover(css`
				${StyledTypographyWrapper} {
					background-color: ${compactStyle?.hoverBackgroundColor};
					box-shadow: ${compactStyle?.hoverBoxShadow};
				}
			`)}
			&:has(${StyledTypographyHeaderActions}:hover) {
				${StyledTypographyWrapper} {
					box-shadow: none;
				}
			}
		`}

		${$collapsible &&
		!$noFocus &&
		($compact
			? css`
					&:focus-within {
						${StyledTypographyWrapper} {
							background-color: transparent;
							box-shadow: ${compactStyle?.activeBoxShadow};
						}
					}

					&:has(${StyledTypographyHeaderActions}:focus-within) {
						${StyledTypographyWrapper} {
							box-shadow: none;
						}
					}
				`
			: css`
					&:focus-within {
						color: ${typography.collapsible.focusColor};
						${StyledTypographyWrapper} {
							background-color: ${typography.collapsible.focusBG};
							${darkFocus}
						}
						${StyledTypographyDivider} {
							border-top-color: transparent;
						}
						${StyledTypographyGraphic} ${StyledIconWrapper} {
							background-color: transparent;
						}
					}
				`)}
	`;
});

export const StyledTypographyTitle = styled.div.withConfig({ displayName: "StyledTypographyTitle-sc-" })<{
	$alignment?: "left" | "right" | "center";
	$swapAddonsPosition: boolean;
}>(({ theme, $alignment, $swapAddonsPosition }) => {
	const { typography } = theme.components;

	return css`
		${breakWord};
		align-items: center;
		align-self: center;
		color: inherit;
		display: flex;
		flex-flow: nowrap;
		flex: 1;
		outline: none;
		padding: ${typography.title.padding};
		position: relative;
		text-align: ${$alignment};

		${$swapAddonsPosition
			? css`
					justify-content: space-between;
				`
			: css`
					justify-content: ${$alignment === "center" ? "center" : $alignment === "right" ? "flex-end" : undefined};
				`}
	`;
});

export const StyledTypographyContent = styled.div.withConfig({ displayName: "StyledTypographyContent-sc-" })`
	> * {
		display: inline;
	}
`;

export const StyledTypographyInfo = styled.div.withConfig({ displayName: "StyledTypographyInfo-sc-" })(({ theme }) => {
	const { typography } = theme.components;

	return css`
		font-style: italic;
		font-weight: ${typography.info.fontWeight};
	`;
});

export const StyledTypographyAddon = styled.div.withConfig({ displayName: "StyledTypographyAddon-sc-" })(
	({ theme }) => {
		const { addon } = theme.components.typography;

		return css`
			margin: ${addon.margin};
		`;
	}
);

export const StyledTypographyHeaderActions = styled.div.withConfig({
	displayName: "StyledTypographyHeaderActions-sc-"
})(({ theme }) => {
	const { spacing } = theme.spacing;

	return css`
		align-items: center;
		display: flex;
		gap: ${spacing.spacing2xs}px;
		margin-left: auto;
		margin-right: ${spacing.spacing2xs}px;
		opacity: 0;
	`;
});

export const StyledTypographyAddons = styled.div.withConfig({ displayName: "StyledTypographyAddons-sc-" })<{
	$level: Level;
	$swapAddonsPosition: boolean;
	$iconVerticalAlignment: IconVerticalAlignment;
}>(({ theme, $level, $swapAddonsPosition, $iconVerticalAlignment }) => {
	const { typography } = theme.components;

	const marginLeft = getHorizontalSpace("left", typography.addon.margin);
	const marginRight = getHorizontalSpace("right", typography.addon.margin);

	return css`
		align-items: center;
		display: flex;
		font-size: medium;
		height: ${typography[`headline${$level}`].height};
		min-height: ${typography.addons.minHeight};

		${iconAlignmentStyle($iconVerticalAlignment)}

		${$swapAddonsPosition &&
		css`
			${StyledTypographyAddon}:first-child {
				margin-left: ${parseFloat(marginLeft || "0") != 0 ? marginLeft : marginRight};
			}
		`}
	`;
});

export const StyledTypographyBody = styled.div.withConfig({ displayName: "StyledTypographyBody-sc-" })<{
	$alignment?: "left" | "right" | "center";
	$typographyColor?: string;
}>(({ theme, $typographyColor, $alignment }) => {
	const { body } = theme.components.typography;

	return css`
		text-align: ${$alignment};
		color: ${$typographyColor ?? body.color};
		margin: ${body.margin};
		padding: 0;
	`;
});

export const StyledTypographySection = styled.div.withConfig({ displayName: "StyledTypographySection-sc-" })(
	({ theme }) => {
		const { section } = theme.components.typography;

		return css`
			display: block;
			margin: ${section.margin};
			padding: ${section.padding};
			width: ${section.width};
		`;
	}
);
