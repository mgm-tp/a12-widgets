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

import type { BaseThemeType } from "../../../schema/base-theme.js";

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
			activeBackgroundColor?: string;
			activeBoxShadow?: string;
			hoverBackgroundColor?: string;
			hoverBoxShadow?: string;
			padding?: string;
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

export const typographyConfig = (theme: BaseThemeType): TypographyConfigType => {
	const { spacing, typography, colors } = theme;

	const commonConfig = {
		headlineColor: colors.text.headlineColor,
		lineHeight: 1.35
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
			minHeight: spacing.spacing.spacingLg + "px",
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px 0`
		},
		graphic: {
			left: "10px",
			margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px 0 0`,
			iconSize: "1.5rem",
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
			focusBorder: `1px dotted ${colors.text.invertedColor}`,
			focusColor: colors.interaction.focus.colorInverted,
			hoverBG: colors.interaction.hover.color,
			hoverColor: colors.interaction.hover.colorInverted,
			compact: {
				activeBackgroundColor: "transparent",
				activeBoxShadow: `inset 0 0 0 2px ${colors.interaction.secondaryInteractionColor}`,
				hoverBackgroundColor: "transparent",
				hoverBoxShadow: `inset 0 0 0 2px ${colors.interaction.secondaryInteractionColor}`,
				padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px 12px`
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
			fontSize: typographyHeadlineCalculation(2, commonConfig.lineHeight, spacing.baseSpacing.BASE).fontSize,
			height: typographyHeadlineCalculation(2.2, commonConfig.lineHeight, spacing.baseSpacing.BASE).height
		},
		headline2: {
			...baseHeadline,
			borderTop: headlineDivider(true),
			color: lighten(0.1, commonConfig.headlineColor),
			fontSize: typographyHeadlineCalculation(1.5, commonConfig.lineHeight, spacing.baseSpacing.BASE).fontSize,
			height: typographyHeadlineCalculation(1.675, commonConfig.lineHeight, spacing.baseSpacing.BASE).height
		},
		headline3: {
			...baseHeadline,
			color: lighten(0.15, commonConfig.headlineColor),
			fontSize: typographyHeadlineCalculation(1.275, commonConfig.lineHeight, spacing.baseSpacing.BASE).fontSize,
			height: typographyHeadlineCalculation(1.275, commonConfig.lineHeight, spacing.baseSpacing.BASE).height
		},
		headline4: {
			...baseHeadline,
			color: lighten(0.2, commonConfig.headlineColor),
			fontSize: typographyHeadlineCalculation(1.125, commonConfig.lineHeight, spacing.baseSpacing.BASE).fontSize,
			height: typographyHeadlineCalculation(1.125, commonConfig.lineHeight, spacing.baseSpacing.BASE).height
		},
		headline5: {
			...baseHeadline,
			color: lighten(0.25, commonConfig.headlineColor),
			fontSize: typographyHeadlineCalculation(1, commonConfig.lineHeight, spacing.baseSpacing.BASE).fontSize,
			height: typographyHeadlineCalculation(1, commonConfig.lineHeight, spacing.baseSpacing.BASE).height
		}
	};
};
