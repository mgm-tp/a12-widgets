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

import { lighten } from "polished";

import type { BaseThemeCore } from "../../schema.js";
import { mergeConfig } from "../../utils/merge-config.js";

import { FontConfig } from "../base/fonts.config.js";

export type TypographyConfigType = {
	addon: { margin: string };
	addons: { minHeight: string };
	body: { color: string; margin: string };
	collapsible: {
		activeBG: string;
		activeColor: string;
		focusBG: string;
		focusBorder: string;
		focusColor: string;
		hoverBG: string;
		hoverColor: string;
		compact?: {
			activeBackgroundColor: string;
			activeBoxShadow: string;
			hoverBackgroundColor: string;
			hoverBoxShadow: string;
			padding: string;
		};
	};
	graphic: { fontSize: string; iconBG: string; iconSize: string; left: string; margin: string };
	headline1: {
		borderTop: string;
		color: string;
		font: string;
		fontSize: string;
		fontWeight: number;
		height: string;
		margin: string;
		padding: string;
		textTransform: string;
		wrapperBG: string;
	};
	headline2: {
		borderTop: string;
		color: string;
		font: string;
		fontSize: string;
		fontWeight: number;
		height: string;
		margin: string;
		padding: string;
		textTransform: string;
		wrapperBG: string;
	};
	headline3: {
		borderTop: string;
		color: string;
		font: string;
		fontSize: string;
		fontWeight: number;
		height: string;
		margin: string;
		padding: string;
		textTransform: string;
		wrapperBG: string;
	};
	headline4: {
		borderTop: string;
		color: string;
		font: string;
		fontSize: string;
		fontWeight: number;
		height: string;
		margin: string;
		padding: string;
		textTransform: string;
		wrapperBG: string;
	};
	headline5: {
		borderTop: string;
		color: string;
		font: string;
		fontSize: string;
		fontWeight: number;
		height: string;
		margin: string;
		padding: string;
		textTransform: string;
		wrapperBG: string;
	};
	info: { fontWeight: number };
	section: { margin: string; padding: string; width: string };
	title: { padding: string };
	wrapper: { minHeight: string; padding: string };
};

export const typographyHeadlineCalculation = (ratio: number, lineHeightValue: number, baseSpacingValue: number) => {
	const fontSizeValue = `${FontConfig.BASE_FONT_SIZE * ratio}rem`;

	return {
		fontSize: fontSizeValue,
		height: `${Math.round(baseSpacingValue * ratio * lineHeightValue)}px`
	};
};

const defaultTypographyConfig = (theme: BaseThemeCore): TypographyConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	const wrapperMinHeight = `${spacing.baseSpacing.BASE * 2.5}px`;
	const graphicIconSize = typography.fontSize.lgFontSize;
	const headlineHeightSm = `${spacing.verticalSpacing.vertWhiteSpacingxl}px`;
	const headlineHeightLg = `${spacing.verticalSpacing.vertWhiteSpacingxl + spacing.spacing.spacing3xs}px`;

	const commonConfig = {
		headlineColor: colors.text.headlineColor,
		lineHeight: theme.typography.lineHeight?.base
	};

	const headlineDivider = (fatDivider?: boolean) => `${fatDivider ? "2px" : "1px"} solid ${colors.divider.color}`;

	const baseHeadline = {
		borderTop: headlineDivider(),
		wrapperBG: "transparent",
		font: typography.font.MAIN_FONT,
		fontWeight: typography.fontWeight.regularFontWeight,
		margin: `${spacing.verticalSpacing.vertWhiteSpacingxs}px 0 0`,
		padding: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingxs}px 0`,
		textTransform: "unset"
	};

	return {
		wrapper: {
			minHeight: wrapperMinHeight,
			padding: "0"
		},
		graphic: {
			left: `${spacing.spacing.spacingXs + 2 * spacing.spacing.spacing3xs}px`,
			margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px 0 0`,
			iconSize: graphicIconSize,
			iconBG: colors.background.secondaryBackground,
			fontSize: typography.fontSize.lgFontSize
		},
		title: {
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px 0 0`
		},
		info: {
			fontWeight: typography.fontWeight.regularFontWeight
		},
		addons: {
			minHeight: spacing.spacing.spacingLg + "px"
		},
		addon: {
			margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px 0 0`
		},
		section: {
			padding: "0px",
			margin: "0px",
			width: "100%"
		},
		collapsible: {
			activeBG: colors.interaction.active.colorTouch,
			activeColor: colors.interaction.active.colorTouchInverted,
			focusBG: colors.interaction.focus.color,
			focusBorder: `${theme.border.width.thin} dotted ${colors.text.invertedColor}`,
			focusColor: colors.interaction.focus.colorInverted,
			hoverBG: colors.interaction.hover.color,
			hoverColor: colors.interaction.hover.colorInverted,
			compact: {
				activeBackgroundColor: "transparent",
				activeBoxShadow: `inset 0 0 0 ${theme.border.width.medium} ${colors.interaction.secondaryInteractionColor}`,
				hoverBackgroundColor: "transparent",
				hoverBoxShadow: `inset 0 0 0 ${theme.border.width.medium} ${colors.interaction.secondaryInteractionColor}`,
				padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${spacing.baseSpacing.BASE}px`
			}
		},
		body: {
			color: colors.text.color,
			margin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingsm}px 0`
		},
		headline1: {
			...baseHeadline,
			borderTop: headlineDivider(true),
			color: lighten(0.05, commonConfig.headlineColor),
			fontWeight: typography.fontWeight.regularFontWeight,
			padding: "0",
			fontSize: typographyHeadlineCalculation(2, commonConfig.lineHeight, spacing.baseSpacing.BASE).fontSize,
			height: typographyHeadlineCalculation(2.2, commonConfig.lineHeight, spacing.baseSpacing.BASE).height
		},
		headline2: {
			...baseHeadline,
			borderTop: headlineDivider(true),
			color: lighten(0.1, commonConfig.headlineColor),
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			padding: "0",
			margin: `${spacing.verticalSpacing.vertWhiteSpacinglg}px 0 ${spacing.verticalSpacing.vertWhiteSpacingsm}px 0`,
			fontSize: typography.fontSize.lgFontSize,
			height: typographyHeadlineCalculation(2, commonConfig.lineHeight, spacing.baseSpacing.BASE).height
		},
		headline3: {
			...baseHeadline,
			color: lighten(0.15, commonConfig.headlineColor),
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			padding: "0",
			margin: `${spacing.verticalSpacing.vertWhiteSpacingmd + spacing.spacing.spacing3xs}px 0 ${spacing.verticalSpacing.vertWhiteSpacingsm}px 0`,
			fontSize: typography.fontSize.smallFontSize,
			height: headlineHeightSm
		},
		headline4: {
			...baseHeadline,
			color: colors.text.secondaryColorDark,
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			padding: "0",
			margin: `${spacing.verticalSpacing.vertWhiteSpacingmd + spacing.spacing.spacing3xs}px 0 ${spacing.verticalSpacing.vertWhiteSpacingsm}px 0`,
			textTransform: "uppercase",
			fontSize: typography.fontSize.tinyFontSize,
			height: headlineHeightLg
		},
		headline5: {
			...baseHeadline,
			color: lighten(0.25, commonConfig.headlineColor),
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			padding: "0",
			fontSize: typographyHeadlineCalculation(0.9, commonConfig.lineHeight, spacing.baseSpacing.BASE).fontSize,
			height: headlineHeightSm
		}
	};
};

export const typographyOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;

	const baseHeadline = {
		borderTop: `${theme.border.width.thin} dotted ${colors.divider.color}`
	};

	return {
		headline1: baseHeadline,
		headline2: baseHeadline,
		headline3: baseHeadline,
		headline4: baseHeadline,
		headline5: baseHeadline
	};
};

export const typographyConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultTypographyConfig(theme), typographyOverrides(theme));
